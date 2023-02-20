import { NodeTypes } from './ast'
import { isSingleElementRoot } from './transforms/hoistStatic'

export interface TransformContext {
  root
  parent: ParentNode | null
  childIndex: number
  currentNode
  helpers: Map<symbol, number> //symbol代表在render中生成的函数名
  helper<T extends symbol>(name: T): T
  nodeTransforms: any[]
}

export function createTransformContext(root, { nodeTransforms = [] }) {
  const context: TransformContext = {
    nodeTransforms,
    root,
    helpers: new Map(),
    currentNode: root,
    parent: null,
    childIndex: 0,
    // helper配合helpers使用，主要往里放东西
    helper(name) {
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
      return name
    }
  }

  return context
}

export function transform(root, options) {
  const context = createTransformContext(root, options)
  traverseNode(root, context) //从根节点开始依次处理所有节点
  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
  root.components = []
  root.directives = []
  root.imports = []
  root.hoists = []
  root.temps = []
  root.cached = []
}

export function traverseNode(node, context: TransformContext) {
  // 深度优先 子==>父
  // 分两个阶段:
  // 1.进入阶段：存储所有节点的转化函数到exitFns中
  context.currentNode = node
  const { nodeTransforms } = context
  const exitFns: any = []

  for (let i = 0; i < nodeTransforms.length; i++) {
    const onExit = nodeTransforms[i](node, context)
    if (onExit) {
      exitFns.push(onExit)
    }
  }

  switch (node.type) {
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      // 处理子节点
      traverseChildren(node, context)
      break
  }

  // 2.退出阶段：执行exitFns中的转化函数，且是倒叙的，保证深度优先
  context.currentNode = node
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

export function traverseChildren(parent, context) {
  parent.children.forEach((node, index) => {
    context.parent = parent
    context.childIndex = index
    traverseNode(node, context)
  })
}

function createRootCodegen(root) {
  const { children } = root
  // Vue2仅支持单个根节点
  if (children.length === 1) {
    const child = children[0]
    if (isSingleElementRoot(root, child) && child.codegenNode) {
      root.codegenNode = child.codegenNode
    }
  }
  // Vue3支持多个
}

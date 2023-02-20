import { createVNodeCall, NodeTypes } from '../ast'

export const transformElement = (node, context) => {
  // element节点转化函数
  return function postTransformElement() {
    node = context.currentNode
    if (node.type != NodeTypes.ELEMENT) {
      return
    }

    const { tag } = node
    let vnodeTag = `"${tag}"`
    let vnodeProps = []
    let vnodeChildren = node.children

    node.codegenNode = createVNodeCall(
      context,
      vnodeTag,
      vnodeProps,
      vnodeChildren
    )
  }
}

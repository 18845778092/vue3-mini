import { EMPTY_OBJ, ShapeFlags } from '@vue/shared'
import { Text, Fragment, Comment, isSameVNodeType } from './vnode'
export interface RendererOptions {
  // 为指定element的props打补丁
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  // 为指定的element设置text
  setElementText(node: Element, text: string): void
  // 插入指定的el到parent中，anchor锚点
  insert(el, parent: Element, anchor?): void
  // 创建element
  createElement(type: string)
  remove(el: Element)
}
export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}

/**
 * 生成渲染器主函数 根据不同宿主环境
 */
function baseCreateRenderer(options: RendererOptions): any {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    insert: hostInsert,
    patchProp: hostPatchProp,
    remove: hostRemove
  } = options

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode === null) {
      // 挂载
      mountElement(newVNode, container, anchor)
    } else {
      // TODO 更新
      patchElement(oldVNode, newVNode)
    }
  }

  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode
    // 1.创建element
    const el = (vnode.el = hostCreateElement(type))
    // 2.设置文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text children
      hostSetElementText(el, vnode.children as string)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array children
    }
    // 3.设置props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    // 4.插入
    hostInsert(el, container, anchor)
  }

  const patchElement = (oldVNode, newVNode) => {
    const el = (newVNode.el = oldVNode.el)
    const oldProps = oldVNode.props || EMPTY_OBJ
    const newProps = newVNode.props || EMPTY_OBJ
    // 更新子节点
    patchChildren(oldVNode, newVNode, el, null)
    // 更新props
    patchProps(el, newVNode, oldProps, newProps)
  }

  const patchChildren = (oldVNode, newVNode, container, anchor) => {
    const c1 = oldVNode && oldVNode.children
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
    const c2 = newVNode && newVNode.children
    const { shapeFlag } = newVNode

    // 新节点是text children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 旧节点是array children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 卸载旧子节点
      }

      if (c2 !== c1) {
        // 挂载新子节点的文本 新旧节点的子节点都是text
        hostSetElementText(container, c2)
      }
    } else {
      // 新节点不是text
      if (prevShapeFlag && ShapeFlags.ARRAY_CHILDREN) {
        // 旧节点是array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 新旧都是array
          // TODO:diff  真实的diff在这里运行
        } else {
          // 新节点不是array
          // TODO:卸载
        }
      } else {
        // 旧节点不是array
        // 旧节点是text
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 旧节点是text 新节点不是text 删除旧节点text
          hostSetElementText(container, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // TODO:单独子节点的挂载
        }
      }
    }
  }

  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]
        // 新旧prop不同就patch
        if (next !== prev) {
          hostPatchProp(el, key, prev, next)
        }
      }
      // 再进行一次旧props循环
      // 如果新的prop没有，旧的有  那么删除新props中新增的prop
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return
    }

    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      unmount(oldVNode)
      oldVNode = null
    }

    const { type, shapeFlag } = newVNode
    switch (type) {
      case Text:
        break
      case Comment:
        break
      case Fragment:
        break
      default:
        // 分两种 Element 和 组件
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
        }
    }
  }

  const unmount = vnode => {
    hostRemove(vnode.el)
  }

  const render = (vnode, container) => {
    if (vnode === null) {
      // TODO 卸载
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render
  }
}

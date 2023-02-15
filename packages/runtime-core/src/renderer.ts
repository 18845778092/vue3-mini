import { ShapeFlags } from '@vue/shared'
import { Text, Fragment, Comment } from './vnode'
export interface RendererOptions {
  // 为指定element的props打补丁
  pathProp(el: Element, key: string, prevValue: any, nextValue: any): void
  // 为指定的element设置text
  setElementText(node: Element, text: string): void
  // 插入指定的el到parent中，anchor锚点
  insert(el, parent: Element, anchor?): void
  // 创建element
  createElement(type: string)
}
export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}

/**
 * 生成渲染器主函数
 */
function baseCreateRenderer(options: RendererOptions): any {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    insert: hostInsert,
    pathProp: hostPatchProp
  } = options

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode === null) {
      // 挂载
      mountElement(newVNode, container, anchor)
    } else {
      // TODO 更新
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
  
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return
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

  const render = (vnode, container) => {
    if (vnode === null) {
      // TODO 卸载
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render
  }
}

import { ShapeFlags } from '@vue/shared'
import { createVNode } from './vnode'
import { Text } from './vnode'

export function renderComponentRoot(instance) {
  const { vnode, render, data } = instance
  let result
  try {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      result = normalizeVNode(render.call(data)) //我们定义的组件render函数返回vnode
    }
  } catch (e) {
    console.error(e)
  }

  return result
}

// 本质上是创建VNode的过程
export function normalizeVNode(child) {
  // child已经是对象旧说明当前child已经是VNode了
  if (typeof child === 'object') {
    return cloneIfMounted(child)
  } else {
    return createVNode(Text, null, String(child))
  }
}

export function cloneIfMounted(child) {
  return child
}

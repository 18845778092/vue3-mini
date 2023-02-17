import { createVNode } from './vnode'
import { Text } from './vnode'

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

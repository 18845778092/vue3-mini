import { isObject } from '../shared'
import { ShapeFlags } from '../shared/shapeFlags'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export { createVNode as createElementVNode }

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    key: props?.key,
    component: null,
    children,
    shapeFlags: getShapeFlag(type),
    el: null
  }
  if (typeof children === 'string') {
    vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN
  }
  // component + children object = slot
  if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children)) {
      vnode.shapeFlags |= ShapeFlags.SLOTS_CHILDREN
    }
  }

  return vnode
}

function getShapeFlag(type) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}

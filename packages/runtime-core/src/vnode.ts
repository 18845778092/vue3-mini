import {
  isArray,
  isFunction,
  isObject,
  isString,
  normalizeClass,
  ShapeFlags
} from '@vue/shared'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export interface VNode {
  __v_isVNode: true
  type: any
  props: any
  children: any
  shapeFlag: number
  key:any
}

export function createVNode(type, props, children): VNode {
  if (props) {
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
  }
  // string则对应ELEMENT
  // 用于按位或运算
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type) //是对象的话就认为它是一个有状态的组件
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  return createBaseVNode(type, props, children, shapeFlag)
}

function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    children,
    shapeFlag
  } as VNode

  // 解析children
  normalizeChildren(vnode, children)

  return vnode
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0

  // 根据状态解析children
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
  } else if (isFunction(children)) {
  } else {
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.children = children
  // 按位或运算 转成32位二进制再执行
  // 1 ^ 8 都转成二进制 相同为0 不同为1 然后再转成10进制等于9
  // & 与运算 两个都为1为1  有一个不为1则0
  vnode.shapeFlag = vnode.shapeFlag | type
}

export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false
}

export function isSameVNodeType(n1: VNode, n2: VNode) {
  return n1.type === n2.type && n1.key === n2.key
}

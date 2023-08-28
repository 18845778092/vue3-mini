import { isObject } from '../shared'
import { ShapeFlags } from '../shared/shapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment } from './vnode'
export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  const { shapeFlags, type } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break
    default:
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
      }
      break
  }
}

function processFragment(vnode, container) {
  mountChildren(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { type, children, props, shapeFlags } = vnode
  const el = (vnode.el = document.createElement(type))
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }
  const isOn = key => /^on[A-Z]/.test(key)
  for (const key in props) {
    const val = props[key]
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance) // 获取render
  setupRenderEffect(instance, initialVNode, container) // 调用render
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container)
  initialVNode.el = subTree.el
}

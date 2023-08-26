import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
  return createReactiveObject(raw, reactiveMap, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyMap, readonlyHandlers)
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyMap, shallowReadonlyHandlers)
}

export function isProxy(val) {
  return isReactive(val) || isReadOnly(val)
}

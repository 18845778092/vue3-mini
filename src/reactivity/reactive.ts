import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers)
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function isProxy(val) {
  return isReactive(val) || isReadOnly(val)
}

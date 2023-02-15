export { ShapeFlags } from './shapeFlags'
export { normalizeClass } from './normalizeProp'
export const isArray = Array.isArray

export const isObject = (val: unknown) => {
  return val !== null && typeof val === 'object'
}

export const hasChanged = (value: any, oldValue: any): boolean => {
  return !Object.is(value, oldValue)
}

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

export const isString = (val: unknown): val is string => typeof val === 'string'

export const extend = Object.assign

// 是否以on开头
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)

export const EMPTY_OBJ: { readonly [key: string]: any } = {}

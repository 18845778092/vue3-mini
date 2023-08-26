export const extend = Object.assign

export const isObject = val => val !== null && typeof val === 'object'

export const hasChanged = (oldVal, newVal) => !Object.is(oldVal, newVal)

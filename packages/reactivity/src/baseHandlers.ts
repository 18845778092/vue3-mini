import { track, trigger } from './effect'
const get = createGetter()
const set = createSetter()
export const mutableHandlers: ProxyHandler<any> = {
  get,
  set
}

function createGetter() {
  return function get(target: Object, key: string | Symbol, rececier: object) {
    const res = Reflect.get(target, key as PropertyKey, rececier)
    track(target, key)
    return res
  }
}

function createSetter() {
  return function set(
    target: Object,
    key: string | Symbol,
    value: unknown,
    rececier: object
  ) {
    const result = Reflect.set(target, key as PropertyKey, value, rececier)
    trigger(target, key, value)
    return result
  }
}

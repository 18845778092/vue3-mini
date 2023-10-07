import { hasChanged, isObject } from '@strive-mini-vue/shared'
import {
  trackEffects,
  triggerEffects,
  activeEffect,
  shouldTrack
} from './effect'
import { reactive } from './reactive'
import { Dep, createDep } from './dep'

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public dep?: Dep = undefined
  public readonly __v_isRef = true
  constructor(value: T) {
    this._rawValue = value
    this._value = toReactive(value)

    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = toReactive(newVal)
      triggerRefValue(this)
    }
  }
}
type RefBase<T> = {
  dep?: Dep
  value: T
}
export function trackRefValue(ref: RefBase<any>) {
  if (shouldTrack && activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

export function triggerRefValue(ref: RefBase<any>) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}

function toReactive(val) {
  return isObject(val) ? reactive(val) : val
}

export function ref(raw) {
  return new RefImpl(raw)
}

export function isRef(r) {
  return !!(r && r.__v_isRef === true)
}

export function unRef(r) {
  return isRef(r) ? r.value : r
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value, receiver) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value, receiver)
      }
    }
  })
}

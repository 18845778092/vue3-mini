import { hasChanged, isObject } from '@strive-mini-vue/shared'
import {
  trackEffects,
  triggerEffects,
  activeEffect,
  shouldTrack
} from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value
  public dep
  public _rawValue
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    this._value = toReactive(value)

    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(val) {
    if (hasChanged(val, this._rawValue)) {
      this._rawValue = val
      this._value = toReactive(val)
      triggerEffects(this.dep)
    }
  }
}

export function trackRefValue(ref) {
  if (activeEffect && shouldTrack) {
    trackEffects(ref.dep)
  }
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep)
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
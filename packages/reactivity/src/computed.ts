import { Dep, createDep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

export type ComputedGetter<T> = (...args: any[]) => T

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  public _dirty = true
  public readonly _effect: ReactiveEffect<T>

  constructor(getter: ComputedGetter<T>) {
    // this.dep = createDep()
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
  }

  get value() {
    trackRefValue(this)
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}

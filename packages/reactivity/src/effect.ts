import { isArray,extend } from '@vue/shared'
import { ComputedRefImpl } from './computed'
import { createDep, Dep } from './dep'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<object, KeyToDepMap>()
export type EffectScheduler = (...args) => any

export let activeEffect: ReactiveEffect | null
export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
}
export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>

  constructor(public fn: () => T, public scheduler: EffectScheduler | null = null) {}
  run() {
    activeEffect = this
    return this.fn()
  }
  stop(){
    console.log('stop')
  }
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn)
  if(options){
    extend(_effect,options)  //合并调度器
  }
  if (!options || !options.lazy) {
    _effect.run() //完成第一次执行
  }
}

export function track(target: object, key: unknown) {
  console.log('收集依赖')
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}

export function trigger(target: object, key: unknown, value: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return //没收集过

  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) return

  triggerEffects(dep)
}

export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]
  // for (const effect of effects) {
  //   triggerEffect(effect)
  // }

  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}

export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
  // TODO
}


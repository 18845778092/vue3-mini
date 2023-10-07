import { extend, isArray } from '@strive-mini-vue/shared'
import { Dep, createDep } from './dep'
import { ComputedRefImpl } from './computed'
export interface DebuggerOptions {}
export type EffectScheduler = (...args: any[]) => any
export interface ReactiveEffectOptions extends DebuggerOptions {
  lazy?: boolean
  scheduler?: EffectScheduler //triggerEffect中优先于run触发
  onStop?: () => void
}
export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export let activeEffect
export let shouldTrack
export class ReactiveEffect<T = any> {
  deps: Dep[] = []
  active = true
  computed?: ComputedRefImpl<T>
  onStop?: () => void
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {
    this.fn = fn
  }
  run() {
    if (!this.active) {
      return this.fn()
    }
    shouldTrack = true
    activeEffect = this
    const result = this.fn()
    shouldTrack = false
    return result
  }
  stop() {
    // 避免多次执行stop, 清理逻辑执行多次
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function effect(fn, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn)
  if (options) {
    extend(_effect, options)
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export function track(target: object, key: unknown) {
  if (activeEffect && shouldTrack) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
      dep = createDep()
      depsMap.set(key, dep)
    }
    trackEffects(dep)
  }
}

export function trackEffects(dep: Dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target: object, key?: unknown) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  let dep = depsMap.get(key)
  triggerEffects(dep!)
}

export function triggerEffects(dep: Dep | ReactiveEffect[]) {
  const effects = isArray(dep) ? dep : [...dep]
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

function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}

export function stop(runner) {
  runner.effect.stop()
}

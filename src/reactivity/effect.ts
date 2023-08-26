import { extend } from '../shared'
import { createDep } from './dep'

const targetMap = new WeakMap()
export let activeEffect
export let shouldTrack
export class ReactiveEffect {
  public deps = []
  public active = true
  public onStop?: () => void
  constructor(public fn, public scheduler?) {
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

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function track(target, key) {
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

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function stop(runner) {
  runner.effect.stop()
}

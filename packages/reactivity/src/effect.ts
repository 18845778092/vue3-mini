type KeyToDepMap = Map<any, ReactiveEffect>
const targetMap = new WeakMap<object, KeyToDepMap>()

export let activeEffect: ReactiveEffect | null

export function track(target: object, key: unknown) {
  console.log('收集依赖')
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  depsMap.set(key, activeEffect)
  console.log(targetMap)
}

export function trigger(target: object, key: unknown, vlaue: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return //没收集过

  const effect = depsMap.get(key) as ReactiveEffect //暂时一个
  if (!effect) return

  effect.fn()
}

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run() //完成第一次执行
}

class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
  run() {
    activeEffect = this
    this.fn()
  }
}

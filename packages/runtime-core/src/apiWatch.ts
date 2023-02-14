import { isReactive } from '@vue/reactivity'
import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { queuePreFlushCb } from './scheduler'

export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
}

export function watch(source, cb, options?: WatchOptions) {
  return doWatch(source, cb, options)
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  let getter: () => any
  if (isReactive(source)) {
    getter = () => source
    deep = true
  } else {
    getter = () => {}
  }

  // 依赖收集
  if (cb && deep) {
    // TODO
    const baseGetter = getter //浅拷贝
    getter = () => traverse(baseGetter())
  }

  let oldValue = {}

  // 拿到newValue
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }

  let scheduler = () => queuePreFlushCb(job)

  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }
  for (const key in value as object) {
    traverse((value as object)[key])
  }

  return value
}

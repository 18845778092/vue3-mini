import { computed } from '../src/computed'
import { effect } from '../src/effect'
import { reactive } from '../src/reactive'
import { vi } from 'vitest'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1
    })
    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({ foo: 1 })
    const getter = vi.fn(() => value.foo)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // // should not compute until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)
    // // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })

  it('should compute', () => {
    const value = reactive({ foo: 1 })
    const getter = vi.fn(() => value.foo)
    const cValue = computed(getter)
    const fn = vi.fn(() => {
      cValue.value
    })
    effect(fn)
    // 计算一次
    expect(getter).toHaveBeenCalledTimes(1)

    expect(cValue.value).toBe(1)
    // 缓存不计算
    expect(getter).toHaveBeenCalledTimes(1)

    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledTimes(2)
    // 缓存
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledTimes(2)
    value.foo = 3
    expect(getter).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenCalledTimes(3)
  })
})

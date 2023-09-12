import { reactive } from '@strive-mini-vue/reactivity'
import { nextTick } from '../src/scheduler'
import { watchEffect } from '../src/apiWatch'

describe('api: watch', () => {
  it('effect', async () => {
    const state = reactive({
      count: 0
    })
    let dummy
    watchEffect(() => {
      dummy = state.count
    })
    expect(dummy).toBe(0)
    state.count++
    await nextTick()
    expect(dummy).toBe(1)
  })

  it('停止watch行为', async () => {
    const state = reactive({
      count: 0
    })
    let dummy
    const stop = watchEffect(() => {
      dummy = state.count
    })
    expect(dummy).toBe(0)
    stop()
    state.count++
    await nextTick()
    expect(dummy).toBe(0)
  })

  it('cleanup effect', async () => {
    const state = reactive({
      count: 0
    })
    const cleanup = vi.fn()
    let dummy
    const stop = watchEffect(onCleanup => {
      onCleanup(cleanup)
      dummy = state.count
    })
    expect(dummy).toBe(0)
    state.count++
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    // onStop时再清理一次
    stop()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})

import { vi } from 'vitest'
import { readonly, isReadOnly, isProxy } from '../src/reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadOnly(original)).toBe(false)
    expect(isReadOnly(wrapped)).toBe(true)
    expect(isReadOnly(original.bar)).toBe(false)
    expect(isReadOnly(wrapped.bar)).toBe(true)
    expect(isProxy(wrapped)).toBe(true)
  })

  it('warn then call set', () => {
    console.warn = vi.fn()
    const user = readonly({
      age: 10
    })

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})

import { h, provide, inject } from '../../lib/mini-vue.esm.js'

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
    return {}
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Provider2)])
  }
}

const Provider2 = {
  name: 'Provider2',
  setup() {
    provide('foo', 'fooVal2')
    const foo = inject('foo')
    return { foo }
  },
  render() {
    return h('div', {}, [h('p', {}, `Provider2--${this.foo}`), h(Consumer)])
  }
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', () => 'default')
    return {
      foo,
      bar,
      baz
    }
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
  }
}

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
  }
}

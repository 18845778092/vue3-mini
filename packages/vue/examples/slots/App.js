import { h, createTextVNode } from '../../dist/mini-vue.esm.js'
import Foo from './Foo.js'

export const App = {
  render() {
    const app = h('div', {}, 'App')
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, 'header' + age),
          createTextVNode('你好呀')
        ],
        default: () => h('p', {}, 'default main'),
        footer: () => h('p', {}, 'footer')
      }
    )
    return h('div', {}, [app, foo])
  },
  setup() {
    return {
      msg: 'mini-vue!'
    }
  }
}

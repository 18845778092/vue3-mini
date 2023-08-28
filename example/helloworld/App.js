import { h } from '../../lib/mini-vue.esm.js'
import Foo from './Foo.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'id',
        class: ['red', 'hard']
      },
      [
        h('p', { class: 'green' }, this.msg),
        h(Foo, {
          class: 'foo',
          count: 1,
          onAddFoo(a, b) {
            console.log('监听到了', a, b)
          }
        })
      ]
    )
  },
  setup() {
    return {
      msg: 'mini-vue!'
    }
  }
}

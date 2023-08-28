import { h } from '../../lib/mini-vue.esm.js'
import Foo from './Foo.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'id',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        }
      },
      [h('p', { class: 'green' }, this.msg), h(Foo, { class: 'foo', count: 1 })]
    )
  },
  setup() {
    return {
      msg: 'mini-vue!'
    }
  }
}

import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'id',
        class: ['red', 'hard']
      },
      [h('p', { class: 'green' }, 'hello P'), h('p', { class: 'blue' }, 'blue')]
    )
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}

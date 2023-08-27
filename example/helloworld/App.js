import { h } from '../../lib/mini-vue.esm.js'
window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'id',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        }
      },
      [h('p', { class: 'green' }, this.msg), h('p', { class: 'blue' }, 'blue')]
    )
  },
  setup() {
    return {
      msg: 'mini-vue!'
    }
  }
}

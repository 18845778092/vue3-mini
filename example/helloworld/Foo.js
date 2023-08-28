import { h } from '../../lib/mini-vue.esm.js'
const App = {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add-foo', 1, 2)
    }
    return { emitAdd }
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd
      },
      'emitAdd'
    )
    const foo = h('p', {}, 'foo')
    return h('div', {}, [foo, btn])
  }
}
export default App

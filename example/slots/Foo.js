import { h, renderSlots } from '../../lib/mini-vue.esm.js'

const App = {
  setup(props, { emit }) {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age: 18
      }),
      renderSlots(this.$slots, 'default'),
      foo,
      renderSlots(this.$slots, 'footer')
    ])
  }
}
export default App

import { h, getCurrentInstance } from '../../dist/mini-vue.esm.js'

const App = {
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    console.log('instance', instance)
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    return h('div', {}, 'foo')
  }
}
export default App

import { h } from '../../lib/mini-vue.esm.js'
const App = {
  render() {
    return h(
      'div',
      {
        id: 'foo'
      },
      `foo:-->${this.count}`
    )
  },
  setup(props) {
    props.count++
    console.log(props)
  }
}
export default App

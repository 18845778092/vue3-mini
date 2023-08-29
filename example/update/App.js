import { h, ref } from '../../lib/mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })
    const addClick = () => {
      props.value.foo = 'newwww foo'
    }
    const removeClick = () => {
      props.value = {
        foo: 'foo'
      }
    }
    const undefinedClick = () => {
      props.value.foo = undefined
    }
    return {
      props,
      addClick,
      removeClick,
      undefinedClick
    }
  },
  render() {
    return h('div', { id: 'root', ...this.props }, [
      h('p', {}, `count: ${this.props.foo}`),
      h(
        'button',
        {
          onClick: this.addClick
        },
        'addClick'
      ),
      h(
        'button',
        {
          onClick: this.removeClick
        },
        'removeClick'
      ),
      h(
        'button',
        {
          onClick: this.undefinedClick
        },
        'undefinedClick'
      )
    ])
  }
}

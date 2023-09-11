import { h, ref } from '../../dist/mini-vue.esm.js'
import { Child } from './Child.js'

export const App = {
  name: 'App',
  setup() {
    const msg = ref(123)
    const count = ref(1)
    const changeChildProps = () => {
      msg.value = 456
    }
    const addCount = () => {
      count.value++
    }
    return {
      msg,
      count,
      changeChildProps,
      addCount
    }
  },
  render() {
    return h('div', {}, [
      h('div', {}, '你好'),
      h(
        'button',
        {
          onClick: this.changeChildProps
        },
        'changeChildProps'
      ),
      h(Child, {
        msg: this.msg
      }),
      h(
        'button',
        {
          onClick: this.addCount
        },
        'addCount'
      ),
      h('p', {}, `count: ${this.count}`)
    ])
  }
}

import { h, ref, nextTick, getCurrentInstance } from '../../lib/mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()
    const addCount = () => {
      for (let i = 1; i < 100; i++) {
        count.value = i
      }
      nextTick(() => {
        console.log(instance)
      })
    }
    return {
      count,
      addCount
    }
  },
  render() {
    return h('div', {}, [
      h('div', {}, `count: ${this.count}`),
      h(
        'button',
        {
          onClick: this.addCount
        },
        'addCount'
      )
    ])
  }
}

import { h, ref } from '../../lib/mini-vue.esm.js'
const PatchTest = {
  name: 'PatchTest',
  setup() {
    const flag = ref(true)
    window.flag = flag
    // const toggle = () => {
    //   flag.value = !flag.value
    // }
    return {
      flag
      // toggle
    }
  },
  render() {
    // text -> children
    // return this.flag
    //   ? h('div', {}, [h('div', {}, 'A'), h('div', {}, 'B')])
    //   : h('div', {}, 'text')

    // children -> text
    return this.flag
      ? h('div', {}, 'text')
      : h('div', {}, [h('div', {}, 'A'), h('div', {}, 'B')])

    // text -> text
    // return this.flag ? h('div', {}, 'Old Text') : h('div', {}, 'New Text')

    // children -> children
    // return this.flag
    // ? h('div', {}, [h('div', {}, 'A'), h('div', {}, 'B')])
    // : h('div', {}, [h('div', {}, 'C'), h('div', {}, 'D')])
  }
}
export const App = {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    return h('div', { id: 'root' }, [h('p', {}, `container`), h(PatchTest)])
  }
}

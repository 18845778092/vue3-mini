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
    // return this.flag
    //   ? h('div', {}, 'text')
    //   : h('div', {}, [h('div', {}, 'A'), h('div', {}, 'B')])
    // text -> text
    // return this.flag ? h('div', {}, 'Old Text') : h('div', {}, 'New Text')
    // children -> children
    // left
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'E' }, 'E')
    //     ])
    // right
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    // 新的比老的长 右侧新增
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C'),
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'E' }, 'E')
    //     ])
    // 新的比老的长 左侧新增
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])

    // 新的比老的短 右侧短
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    //   : h('div', {}, [h('div', { key: 'A' }, 'A'), h('div', { key: 'B' }, 'B')])

    // 新的比老的短 左侧短
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C')
    //     ])
    //   : h('div', {}, [h('div', { key: 'B' }, 'B'), h('div', { key: 'C' }, 'C')])

    // 乱序
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C', id: 'c-prev' }, 'C'),
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'F' }, 'F'),
    //       h('div', { key: 'G' }, 'G')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'C', id: 'c-next' }, 'C'),
    //       h('div', { key: 'F' }, 'F'),
    //       h('div', { key: 'G' }, 'G')
    //     ])
    // ab(ced)fg
    // ab(ec)fg
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C', id: 'c-prev' }, 'C'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'F' }, 'F'),
    //       h('div', { key: 'G' }, 'G')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'C', id: 'c-next' }, 'ccc'),
    //       h('div', { key: 'F' }, 'F'),
    //       h('div', { key: 'G' }, 'G')
    //     ])

    // 移动
    // return this.flag
    //   ? h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'C' }, 'C'),
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'F' }, 'F'),
    //       h('div', { key: 'G' }, 'G')
    //     ])
    //   : h('div', {}, [
    //       h('div', { key: 'A' }, 'A'),
    //       h('div', { key: 'B' }, 'B'),
    //       h('div', { key: 'E' }, 'E'),
    //       h('div', { key: 'C' }, 'C'),
    //       h('div', { key: 'D' }, 'D'),
    //       h('div', { key: 'F' }, 'F'),
    //       h('div', { key: 'G' }, 'G')
    //     ])

    // fix
    return this.flag
      ? h('div', {}, [
          h('div', { key: 'A' }, 'A'),
          h('div', {}, 'C'),
          h('div', { key: 'B' }, 'B'),
          h('div', { key: 'D' }, 'D')
        ])
      : h('div', {}, [
          h('div', { key: 'A' }, 'A'),
          h('div', { key: 'B' }, 'B'),
          h('div', {}, 'C'),
          h('div', { key: 'D' }, 'D')
        ])
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

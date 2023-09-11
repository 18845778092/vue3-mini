import { ref } from '../../lib/mini-vue.esm.js'

export const App = {
  name: 'App',
  template: `<div>h1,{{ message }}</div>`,
  setup() {
    const message = ref('哈哈哈')
    return {
      message
    }
  }
}

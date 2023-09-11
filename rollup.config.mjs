import typescript from 'rollup-plugin-typescript2'
export default {
  input: './packages/vue/src/index.ts',
  output: [
    {
      format: 'cjs',
      file: './packages/vue/dist/mini-vue.cjs.js'
    },
    {
      format: 'es',
      file: './packages/vue/dist/mini-vue.esm.js'
    }
  ],
  plugins: [typescript()]
}

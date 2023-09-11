export * from '@strive-mini-vue/runtime-dom'

import * as runtimeDom from '@strive-mini-vue/runtime-dom'
import { registerRuntimeCompiler } from '@strive-mini-vue/runtime-dom'
import { baseCompile } from '@strive-mini-vue/compiler-core'

function compileToFunction(template) {
  const { code } = baseCompile(template)
  const render = new Function('vue', code)(runtimeDom)
  return render
}
// 赋值引用
registerRuntimeCompiler(compileToFunction)

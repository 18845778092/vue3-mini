export * from './runtime-dom'

import * as runtimeDom from './runtime-dom'
import { registerRuntimeCompiler } from './runtime-dom'
import { baseCompile } from './compiler-core/src'

function compileToFunction(template) {
  const { code } = baseCompile(template)
  const render = new Function('vue', code)(runtimeDom)
  return render
}
// 赋值引用
registerRuntimeCompiler(compileToFunction)

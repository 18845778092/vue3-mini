import { createRenderer } from '@vue/runtime-core'
import { extend } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = extend({ patchProp }, nodeOps)

let renderer
function ensureRenderer() {
  return renderer || (renderer = createRenderer(renderOptions))
}
export const render = (...args) => {
  ensureRenderer().render(...args)
}

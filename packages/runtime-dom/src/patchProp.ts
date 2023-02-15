import { isOn } from '@vue/shared'
import { patchClass } from './modules/class'

export const patchProp = (el: Element, key, prevValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
  } else if (isOn(key)) {
    // on开头  事件
  } else {
  }
}

import { isOn } from '@vue/shared'
import { patchAttr } from './modules/attr'
import { patchClass } from './modules/class'
import { patchEvent } from './modules/event'
import { patchDomProp } from './modules/props'
import { patchStyle } from './modules/style'

export const patchProp = (el: Element, key, prevValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
    patchStyle(el, prevValue, nextValue)
  } else if (isOn(key)) {
    // on开头  事件
    patchEvent(el, key, prevValue, nextValue)
  } else if (shouldSetAsProp(el, key)) {
    // property
    patchDomProp(el, key, nextValue)
  } else {
    // attribute
    patchAttr(el, key, nextValue)
  }
}

function shouldSetAsProp(el: Element, key: string) {
  if (key === 'form') {
    // 对于表单元素 form属性是只读的
    return false
  }
  if (key === 'list' && el.tagName === 'INPUT') {
    // input的list属性必须通过attribute设定
    return false
  }
  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false
  }
  return key in el
}

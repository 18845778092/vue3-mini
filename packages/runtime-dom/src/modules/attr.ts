export function patchAttr(el: Element, key, value) {
  if (value === null) {
    // value是空 删掉
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}

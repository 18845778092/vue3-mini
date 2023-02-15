export function patchClass(el: Element, value: string | null) {
  if (value === null) {
    // 删除class
    el.removeAttribute('class') //使用remove 不使用setAttribute
  } else {
    el.className = value
  }
}

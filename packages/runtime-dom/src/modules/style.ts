import { isString } from '@vue/shared'

export function patchStyle(el: Element, prev, next) {
  const style = (el as HTMLElement).style //all style
  const isCssString = isString(next)
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key])
    }
  }
  // 清除本次没有的旧样式
  if (prev && !isString(prev)) {
    for (const key in prev) {
      if (next[key] == null) {
        setStyle(style, key, '')
      }
    }
  }
}

function setStyle(style: CSSStyleDeclaration, name: string, val: string) {
  // 只考虑简单的对象
  style[name] = val
}

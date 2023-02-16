const doc = (typeof document !== 'undefined' ? document : null) as Document

export const nodeOps = {
  createElement: (tag): Element => {
    const el = doc.createElement(tag)
    return el
  },
  setElementText: (el: Element, text) => {
    el.textContent = text
  },
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },
  remove: (child: Element) => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  }
}

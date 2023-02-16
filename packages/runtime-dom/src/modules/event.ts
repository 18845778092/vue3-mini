export function patchEvent(
  el: Element & { _vei?: Object },
  rawName: string,
  prevValue,
  nextValue
) {
  const invokers = el._vei || (el._vei = {})
  const existingInvoker = invokers[rawName]
  if (nextValue && existingInvoker) {
    //更新行为
    existingInvoker.value = nextValue
  } else {
    const name = parseName(rawName)
    // 新增 or 删除
    if (nextValue) {
      // 新增
      const invoker = (invokers[rawName] = createInvoker(nextValue))
      el.addEventListener(name, invoker)
    } else if (existingInvoker) {
      // 删除
      el.removeEventListener(name, existingInvoker)
      invokers[rawName] = undefined
    }
  }
}

function parseName(name: string) {
  return name.slice(2).toLocaleLowerCase()
}

function createInvoker(initalValue) {
  const invoker = (e: Event) => {
    invoker.value && invoker.value()
  }

  invoker.value = initalValue
  return invoker
}

export function patchDomProp(el, key, value) {
  try {
    el[key] = value
  } catch (e) {}
}

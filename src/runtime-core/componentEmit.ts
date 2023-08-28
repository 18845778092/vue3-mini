import { camelize, toHandlerKey } from '../shared'

export function emit(instance, event, ...args) {
  const { props } = instance

  const handlerName = toHandlerKey(camelize(event))
  const handle = props[handlerName]
  handle && handle(...args)
}

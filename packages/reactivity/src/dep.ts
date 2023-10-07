import { ReactiveEffect } from './effect'

export type Dep = Set<ReactiveEffect>

export function createDep(effects?: ReactiveEffect[]): Dep {
  const dep = new Set(effects)
  return dep
}

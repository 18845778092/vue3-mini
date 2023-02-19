import { reactive } from '@vue/reactivity'
import { isFunction, isObject } from '@vue/shared'
import { onBeforeMount, onMounted } from './apiLifecycle'

let uid = 0

export const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm'
}

export function createComponentInstance(vnode) {
  const type = vnode.type
  const instance = {
    uid: uid++,
    vnode, //instance.vnode=传入的vnode
    type,
    subTree: null,
    effect: null,
    update: null,
    render: null,
    isMounted: false,
    bc: null,
    c: null,
    bm: null,
    m: null
  }

  return instance
}

export function setupComponent(instance) {
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type
  const { setup } = Component
  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  } else {
    // optionsAPI
    finishComponentSetup(instance)
  }
}

export function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  }
  finishComponentSetup(instance)
}

export function finishComponentSetup(instance) {
  //得到的是这个对象==>const component={render(){return h('div','hello')}}
  const Component = instance.type
  if (!instance.render) {
    instance.render = Component.render
  }

  applyOptions(instance)
}

function applyOptions(instance) {
  const {
    data: dataOptions,
    beforeCreate,
    created,
    beforeMount,
    mounted
  } = instance.type

  if (beforeCreate) {
    callHook(beforeCreate, instance.data)
  }

  if (dataOptions) {
    const data = dataOptions()
    if (isObject(data)) {
      instance.data = reactive(data)
    }
  }

  if (created) {
    callHook(created, instance.data)
  }

  function registerLifecycleHook(register: Function, hook?: Function) {
    register(hook?.bind(instance.data), instance)
  }
  // 挂载前后调用,所以要先注入
  registerLifecycleHook(onBeforeMount, beforeMount)
  registerLifecycleHook(onMounted, mounted)
}

function callHook(hook: Function, proxy) {
  hook.bind(proxy)
}

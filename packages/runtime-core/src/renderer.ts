import { EMPTY_OBJ, isString, ShapeFlags } from '@vue/shared'
import { effect, ReactiveEffect } from 'packages/reactivity/src/effect'
import { createComponentInstance, setupComponent } from './component'
import { normalizeVNode, renderComponentRoot } from './componentRenderUtils'
import { queuePreFlushCb } from './scheduler'
import { Text, Fragment, Comment, isSameVNodeType } from './vnode'
export interface RendererOptions {
  // 为指定element的props打补丁
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  // 为指定的element设置text
  setElementText(node: Element, text: string): void
  // 插入指定的el到parent中，anchor锚点
  insert(el, parent: Element, anchor?): void
  // 创建element
  createElement(type: string)
  remove(el: Element)
  createText(text: string)
  setText(node, text)
  createComment(text: string)
}
export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}

/**
 * 生成渲染器主函数 根据不同宿主环境
 */
function baseCreateRenderer(options: RendererOptions): any {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    insert: hostInsert,
    patchProp: hostPatchProp,
    remove: hostRemove,
    createText: hostCreateText,
    setText: hostSetText,
    createComment: hostCreateComment
  } = options

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode === null) {
      // 挂载
      mountElement(newVNode, container, anchor)
    } else {
      // TODO 更新
      patchElement(oldVNode, newVNode)
    }
  }

  const processText = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 挂载
      newVNode.el = hostCreateText(newVNode.children)
      hostInsert(newVNode.el, container, anchor)
    } else {
      // 更新
      const el = (newVNode.el = oldVNode.el)
      if (newVNode.children !== oldVNode.children) {
        hostSetText(el, newVNode.children)
      }
    }
  }

  const processComment = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 挂载
      newVNode.el = hostCreateComment(newVNode.children)
      hostInsert(newVNode.el, container, anchor)
    } else {
      newVNode.el = oldVNode.el
    }
  }

  const processFragment = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 挂载
      mountChildren(newVNode.children, container, anchor)
    } else {
      patchChildren(oldVNode, newVNode, container, anchor)
    }
  }

  const processComponent = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      mountComponent(newVNode, container, anchor)
    }
  }

  const mountComponent = (initialVNode, container, anchor) => {
    initialVNode.component = createComponentInstance(initialVNode)
    const instance = initialVNode.component

    setupComponent(instance) //绑定render函数 处理data为响应式
    setupRenderEffect(instance, initialVNode, container, anchor) //渲染组件
  }
  // 渲染组件
  const setupRenderEffect = (instance, initialVNode, container, anchor) => {
    const componentUpdateFn = () => {
      // 挂载subTree
      if (!instance.isMounted) {
        const { bm, m } = instance
        if (bm) {
          bm()
        }
        // 根据组件定义的render 生成subTree subTree是一个VNode
        const subTree = (instance.subTree = renderComponentRoot(instance))
        patch(null, subTree, container, anchor)
        if (m) {
          m()
        }
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        let { next, vnode } = instance
        if (!next) {
          next = vnode
        }
        // 此时instance上的data已经变化了
        const nextTree = renderComponentRoot(instance)
        // 将第一次挂载的tree拿出
        const prevTree = instance.subTree
        instance.subTree = nextTree
        patch(prevTree, nextTree, container, anchor)
        next.el = nextTree.el
      }
    }

    const effect = (instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queuePreFlushCb(update)
    ))
    const update = (instance.update = () => effect.run())
    update()
  }
  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode
    // 1.创建element
    const el = (vnode.el = hostCreateElement(type))
    // 2.设置文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text children
      hostSetElementText(el, vnode.children as string)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array children
      mountChildren(vnode.children, el, anchor)
    }
    // 3.设置props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    // 4.插入
    hostInsert(el, container, anchor)
  }

  const patchElement = (oldVNode, newVNode) => {
    const el = (newVNode.el = oldVNode.el)
    const oldProps = oldVNode.props || EMPTY_OBJ
    const newProps = newVNode.props || EMPTY_OBJ
    // 更新子节点
    patchChildren(oldVNode, newVNode, el, null)
    // 更新props
    patchProps(el, newVNode, oldProps, newProps)
  }

  const mountChildren = (children, container, anchor) => {
    if (isString(children)) {
      children = children.split('')
    }

    for (let i = 0; i < children.length; i++) {
      const child = (children[i] = normalizeVNode(children[i]))
      patch(null, child, container, anchor)
    }
  }

  const patchChildren = (oldVNode, newVNode, container, anchor) => {
    const c1 = oldVNode && oldVNode.children
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
    const c2 = newVNode && newVNode.children
    const { shapeFlag } = newVNode

    // 新节点是text children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 旧节点是array children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 卸载旧子节点
      }

      if (c2 !== c1) {
        // 挂载新子节点的文本 新旧节点的子节点都是text
        hostSetElementText(container, c2)
      }
    } else {
      // 新节点不是text
      if (prevShapeFlag && ShapeFlags.ARRAY_CHILDREN) {
        // 旧节点是array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 新旧都是array
          // TODO:diff  真实的diff在这里运行
          patchKeyedChildren(c1, c2, container, anchor)
        } else {
          // 新节点不是array
          // TODO:卸载
        }
      } else {
        // 旧节点不是array
        // 旧节点是text
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 旧节点是text 新节点不是text 删除旧节点text
          hostSetElementText(container, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // TODO:单独子节点的挂载
        }
      }
    }
  }
  // diff函数
  const patchKeyedChildren = (
    oldChildren,
    newChildren,
    container,
    parentAnchor
  ) => {
    let i = 0
    const newChildrenLength = newChildren.length
    let oldChildrenEnd = oldChildren.length - 1 //旧children最后一个元素下标
    let newChildrenEnd = newChildrenLength - 1 //新children最后一个元素下标
    // 1.自前向后
    while (i <= oldChildrenEnd && i <= newChildrenEnd) {
      const oldVNode = oldChildren[i]
      const newVNode = normalizeVNode(newChildren[i])
      if (isSameVNodeType(oldVNode, newVNode)) {
        patch(oldVNode, newVNode, container, null)
      } else {
        break
      }
      i++
    }

    // 2.自后向前
    while (i <= oldChildrenEnd && i <= newChildrenEnd) {
      const oldVNode = oldChildren[oldChildrenEnd]
      const newVNode = normalizeVNode(newChildren[newChildrenEnd])
      if (isSameVNodeType(oldVNode, newVNode)) {
        patch(oldVNode, newVNode, container, null)
      } else {
        break
      }
      oldChildrenEnd--
      newChildrenEnd--
    }

    // 3.新节点多余旧节点
    if (i > oldChildrenEnd) {
      if (i <= newChildrenEnd) {
        const nextPos = newChildrenEnd + 1
        const anchor =
          nextPos < newChildrenLength ? newChildren[nextPos].el : parentAnchor
        while (i <= newChildrenEnd) {
          patch(null, normalizeVNode(newChildren[i]), container, anchor)
          i++
        }
      }
    }
    // 4.新节点少于旧节点
    else if (i > newChildrenEnd) {
      while (i <= oldChildrenEnd) {
        unmount(oldChildren[i])
        i++
      }
    }
    // 乱序
    else {
      const oldStartIndex = i // 旧节点开始索引 oldChildrenStart
      const newStartIndex = i // 新节点开始索引
      //假设传入[1,3,2,4,6,5]
      // 5.1 创建一个map对象 以新节点的key作为key，新节点的位置作为value
      const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
      // 对于新节点的循环 检查key 设置keytoIndex Map
      for (i = newStartIndex; i <= newChildrenEnd; i++) {
        const nextChild = normalizeVNode(newChildren[i])
        if (nextChild.key != null) {
          // key必须存在且唯一
          // if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
          //   warn(
          //     `Duplicate keys found during update:`,
          //     JSON.stringify(nextChild.key),
          //     `Make sure keys are unique.`
          //   )
          // }
          // 设置key
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      //
      // 5.2 循环旧节点 并且尝试打补丁或删除
      let j
      let patched = 0 //记录已经修复的新节点的数量
      const toBePatched = newChildrenEnd - newStartIndex + 1 //新节点待修补数量
      let moved = false //当前节点是否需要进行移动 5.3使用
      let maxNewIndexSoFar = 0 //始终保存当前最大的index的值
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      // 这里的注释说的稍微有点问题，它并不是创建了一个Map对象
      // 它是用Array表达Map的概念
      // 对于数组而言它既有元素的值 又有元素的下标值
      // 这个数组它的下标表示新节点下标 元素代表旧节点下标
      // 注意它里面的元素是不计算已经处理好的节点的
      // 虽然存放的是旧节点下标,但是旧节点下标永远+1
      // 并且这个newIndexToOldIndexMap还会用来确定最长递增子序列
      const newIndexToOldIndexMap = new Array(toBePatched)
      // 当前的0包含一些特殊含义 value去表示旧节点下标时不可以直接用0
      // 所以所有旧节点下标要+1
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
      // 便利旧节点
      for (i = oldStartIndex; i <= oldChildrenEnd; i++) {
        const prevChild = oldChildren[i]
        // 已经处理好的节点大于等于待处理节点 代表已经处理好了
        // 旧节点全部删除就好了
        if (patched >= toBePatched) {
          unmount(prevChild)
          continue
        }
        let newIndex //当前旧节点在新节点数组中存在的位置  它是计算已处理节点的
        // 它向newIndexToOldIndexMap扔,index需要减去前面已经处理好的数量
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 所有节点是都有对应key的 示例中进不去
          // else的作用是遍历所有新节点 找到没有对应旧节点的新节点
          // 如果旧节点没有key 还是希望尽量能把旧节点的newIndex找到
          // 边缘情况
          for (j = newStartIndex; j <= newChildrenEnd; j++) {
            if (
              newIndexToOldIndexMap[j - newStartIndex] === 0 && //还是等于0
              isSameVNodeType(prevChild, newChildren[j]) //新旧可以匹配上
            ) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          // 当前旧节点没有对应新节点 需要卸载
          unmount(prevChild)
        } else {
          // newIndex - s2 为了不计算已经处理过的节点 新节点减去i的起始值 s2
          // i的起始值代表前面处理过了几个节点了
          // i + 1 对应旧节点下标永远+1
          newIndexToOldIndexMap[newIndex - newStartIndex] = i + 1
          // maxNewIndexSoFar 存放如果最大index
          // 判断当前旧节点是否需要移动逻辑
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            // 如果某一个旧节点的新index小于当前最大index
            // newIndex < maxNewIndexSoFar
            // 代表没有递增,则代表有节点需要移动
            moved = true
          }
          // 更新完还需要移动 在5.3
          patch(prevChild, newChildren[newIndex], container, null)
          patched++
        }
      }

      // 5.3 对5.2处理完的结果进行移动和挂载新节点
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      j = increasingNewIndexSequence.length - 1 //当前递增子序列的最后一个下标
      for (i = toBePatched - 1; i >= 0; i--) {
        // s2 newStart
        const nextIndex = newStartIndex + i //需要更新的新节点下标 计算已经处理过的
        const nextChild = newChildren[nextIndex]
        const anchor =
          // 锚点是否超过newChildren的长度 没超过就在当前位置的后面
          nextIndex + 1 < newChildrenLength
            ? newChildren[nextIndex + 1].el
            : parentAnchor
        // 新节点没有对应的旧节点 表示新增的节点
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(null, nextChild, container, anchor)
        } else if (moved) {
          // j < 0 表示不存在最长递增子序列
          // i !== increasingNewIndexSequence[j] 表示当前节点不在最后位置
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }
  const move = (vnode, container, anchor) => {
    const { el } = vnode
    hostInsert(el, container, anchor)
  }
  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]
        // 新旧prop不同就patch
        if (next !== prev) {
          hostPatchProp(el, key, prev, next)
        }
      }
      // 再进行一次旧props循环
      // 如果新的prop没有，旧的有  那么删除新props中新增的prop
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return
    }

    // 旧节点存在且新节点不是相同类型直接卸载旧节点 走挂载新节点逻辑
    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      console.log('直接卸载')
      unmount(oldVNode)
      oldVNode = null
    }

    const { type, shapeFlag } = newVNode
    console.log('shapeFlag和type', shapeFlag, type)
    switch (type) {
      case Text:
        processText(oldVNode, newVNode, container, anchor)
        break
      case Comment:
        processComment(oldVNode, newVNode, container, anchor)
        break
      case Fragment:
        processFragment(oldVNode, newVNode, container, anchor)
        break
      default:
        // 分两种 Element 和 组件
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(oldVNode, newVNode, container, anchor)
        }
    }
  }

  const unmount = vnode => {
    hostRemove(vnode.el)
  }

  const render = (vnode, container) => {
    if (vnode === null) {
      // 卸载
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render
  }
}

// 求解最长递增子序列元素所在的下标
// 贪心+二分查找算法计算
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr: number[]): number[] {
  //假设传入[1,3,2,4,6,5]
  const p = arr.slice() //result每次变化时，记录result更新前最后一个索引的值
  const result = [0] //最长递增子序列下标返回值，默认包含第一个元素
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      // j代表result中最后一个元素 也就是result中保存的最大值
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j //在result变化之前记录result更新前最后一个索引的值
        result.push(i)
        continue
      }
      // 二分查找运算
      u = 0 //二分查找初始下标
      v = result.length - 1 //二分查找结束下标
      // 二分查找逻辑
      while (u < v) {
        // c是中间位置
        c = (u + v) >> 1 //往右进一位 意思是平分向下取整
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      //替换为更小的元素的下标
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          //似乎防止报错的逻辑
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  // 回溯
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}

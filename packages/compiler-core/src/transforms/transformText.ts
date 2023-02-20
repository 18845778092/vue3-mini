import { NodeTypes } from '../ast'
import { isText } from '../utils'

// 将相邻的文本节点和表达式合并成一个表达式
export const transformText = (node, context) => {
  if (
    node.type === NodeTypes.ROOT ||
    node.type === NodeTypes.ELEMENT ||
    node.type === NodeTypes.FOR ||
    node.type === NodeTypes.IF_BRANCH
  ) {
    return () => {
      const children = node.children
      let currentContainer
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isText(child)) {
          // j是child的下一个子节点
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j]
            if (!currentContainer) {
              // 创建符合表达式的节点
              currentContainer = children[i] = createCompundExpression(
                [child],
                child.loc
              )
            }
            if (isText(next)) {
              // 尝试合并
              currentContainer.children.push(`+`, next) //[child,'+',next]合并
              children.splice(j, 1)
              j--
            } else {
              // 第一个节点是text 第二个不是 不需要合并
              currentContainer = undefined
              break
            }
          }
        }
      }
    }
  }
}

export function createCompundExpression(children, loc) {
  return {
    type: NodeTypes.COMPOUND_EXPRESSION,
    loc,
    children
  }
}

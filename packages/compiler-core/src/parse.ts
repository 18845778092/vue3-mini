import { ElementTypes, NodeTypes } from './ast'

export interface ParseContext {
  source: string
}

const enum TagType {
  Start,
  End
}

function createParseContext(content): ParseContext {
  // return context上下文对象
  return {
    source: content
  }
}

export function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
    loc: {}
  }
}

export function baseParse(content: string) {
  const context = createParseContext(content)
  const children = parseChildren(context, [])
  console.log('children', children)
  // return javascript ast
  return createRoot(children)
}

function parseChildren(context: ParseContext, ancestors) {
  const nodes = [] //是将来ast中的children
  while (!isEnd(context, ancestors)) {
    const s = context.source
    let node

    if (startsWith(s, '{{')) {
      // TODO: 模板语法
    } else if (s[0] === '<') {
      // 标签的开始
      if (/[a-z]/i.test(s[1])) {
        // 处理标签
        node = parseElement(context, ancestors)
      }
    }
    if (!node) {
      // 既不是模板语法也不是< 就只可能是文本节点
      node = parseText(context)
    }
    pushNode(nodes, node)
  }

  return nodes
}
// 返回的是AST,只不过是一层一层的AST 类似递归一样最后靠children组合在一起
function parseElement(context: ParseContext, ancestors) {
  // 1.处理标签的开始
  const element = parseTag(context, TagType.Start)
  ancestors.push(element)
  // 2.处理标签的children
  const children = parseChildren(context, ancestors)
  ancestors.pop()
  element.children = children

  // 3.处理标签的结束
  // 如果是结束标签的开始的话
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End)
  }

  return element
}

function parseTag(context: ParseContext, type: TagType) {
  const match: any = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)
  const tag = match[1]
  advanceBy(context, match[0].length)
  let isSelfClosing = startsWith(context.source, '/>')
  advanceBy(context, isSelfClosing ? 2 : 1)
  return {
    tag,
    type: NodeTypes.ELEMENT,
    tagType: ElementTypes.ELEMENT,
    props: [], //不加解析会出错
    children: []
  }
}
// 解析文本
function parseText(context: ParseContext) {
  const endTokens = ['<', '{{'] //普通文本的结束 白名单

  let endIndex = context.source.length //最大值

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i], i)
    if (index !== -1 && endIndex > index) {
      endIndex = index //普通文本结束下标
    }
  }
  const content = parseTextData(context, endIndex)
  return {
    type: NodeTypes.TEXT,
    content
  }
}

// 截取text文本内容
function parseTextData(context: ParseContext, length: number) {
  const rawText = context.source.slice(0, length)
  advanceBy(context, length)
  return rawText
}

function pushNode(nodes, node) {
  nodes.push(node)
}

// ancestors数组 会放element node节点
function isEnd(context: ParseContext, ancestors) {
  const s = context.source
  if (startsWith(s, '</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (startsWithEndTagOpen(s, ancestors[i].tag)) {
        return true
      }
    }
  }
  return !s
}

function startsWithEndTagOpen(source: string, tag: string): boolean {
  return startsWith(source, '</')
}

function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString)
}

// 右移
function advanceBy(context: ParseContext, numberOfCharacters: number) {
  const { source } = context
  context.source = source.slice(numberOfCharacters)
}

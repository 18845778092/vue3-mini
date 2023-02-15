export const enum ShapeFlags {
  ELEMENT = 1, //type=Element
  FUNCTIONAL_COMPONENT = 1 << 1, //函数式组件
  STATEFUL_COMPONENT = 1 << 2, //有状(响应数据)态的组件
  TEXT_CHILDREN = 1 << 3, //children=Text
  ARRAY_CHILDREN = 1 << 4, //children=Array
  SLOTS_CHILDREN = 1 << 5, //children=slot
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  //有状态(响应数据)组件|函数组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

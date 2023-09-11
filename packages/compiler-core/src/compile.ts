import { generate } from './codegen'
import { baseParse } from './parse'
import { transform } from './transform'
import { transformElement } from './transform/transformElement'
import { transformExpression } from './transform/transformExpression'
import { transformText } from './transform/transformText'

export function baseCompile(template) {
  const ast = baseParse(template)
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText]
  })
  return generate(ast)
}

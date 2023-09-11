import { generate } from '../src/codegen'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { transformElement } from '../src/transform/transformElement'
import { transformExpression } from '../src/transform/transformExpression'
import { transformText } from '../src/transform/transformText'

describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('interpolation', () => {
    const ast = baseParse('{{ message }}')
    transform(ast, {
      nodeTransforms: [transformExpression]
    })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('element', () => {
    const ast = baseParse('<div>h1,{{ message }}</div>')
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText]
    })
    // console.dir(ast, {
    //   depth: null
    // })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})

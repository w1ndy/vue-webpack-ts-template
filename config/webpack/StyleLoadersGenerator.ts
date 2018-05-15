import { Loader } from 'webpack'

import generateCSSLoaders, { CSSLoadersGeneratorOptions } from './CSSLoadersGenerator'

interface StyleLoader {
  test: RegExp,
  use: Loader[]
}

export default function (options: CSSLoadersGeneratorOptions)
    : Array<StyleLoader> {
  const output: Array<StyleLoader> = []
  const loaders = generateCSSLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

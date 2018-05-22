import { Loader } from 'webpack'

import { generateCSSLoaders, ICSSLoaders, ICSSLoadersGeneratorOptions } from './CSSLoadersGenerator'

interface IStyleLoader {
  test: RegExp,
  use: Loader | Loader[]
}

/* tslint:disable:export-name */
export function generateStyleLoaders(options: ICSSLoadersGeneratorOptions): IStyleLoader[] {
  const output: IStyleLoader[] = []
  const loaders: ICSSLoaders = generateCSSLoaders(options)

  for (const extension of Object.keys(loaders)) {
    output.push({
      test: new RegExp(`\\.${extension}$`),
      use: loaders[extension]
    })
  }

  return output
}

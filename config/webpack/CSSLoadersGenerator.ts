import * as path from 'path'

import miniCssExtractPlugin from 'mini-css-extract-plugin'
import { Loader } from 'webpack'

export interface ICSSLoadersGeneratorOptions {
  extract?: boolean,
  sourceMap?: boolean,
  usePostCSS?: boolean
}

export interface ICSSLoaders {
  css: Loader | Loader[],
  postcss: Loader | Loader[],
  less: Loader | Loader[],
  sass: Loader | Loader[],
  scss: Loader | Loader[],
  stylus: Loader | Loader[],
  styl: Loader | Loader[],
  [key: string]: Loader | Loader[]
}

export function generateCSSLoaders(options: ICSSLoadersGeneratorOptions): ICSSLoaders {
  const cssLoader: Loader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader: Loader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader?: string, loaderOptions?: {})
      : Loader | Loader[] {
    const loaders: Loader[] = options.usePostCSS
      ? [cssLoader, postcssLoader]
      : [cssLoader]

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: {
          ...loaderOptions,
          sourceMap: options.sourceMap
        }
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return miniCssExtractPlugin.loader
    } else {
      return (<Loader[]>['vue-style-loader']).concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

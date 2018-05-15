import * as path from 'path'

import { Loader } from 'webpack'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'

import config from '../ApplicationConfiguration'

export interface CSSLoadersGeneratorOptions {
  extract?: boolean,
  sourceMap?: boolean,
  usePostCSS?: boolean
}

interface CSSLoaders {
  css: Loader | Loader[],
  postcss: Loader | Loader[],
  less: Loader | Loader[],
  sass: Loader | Loader[],
  scss: Loader | Loader[],
  stylus: Loader | Loader[],
  styl: Loader | Loader[],
  [key: string]: Loader | Loader[]
}

export default function (options: CSSLoadersGeneratorOptions): CSSLoaders {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
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
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // TODO: ExtractTextPlugin is unsupported in Webpack 4
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return MiniCSSExtractPlugin.loader
    } else {
      const styleLoader: Loader[] = ['vue-style-loader']
      return styleLoader.concat(loaders)
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

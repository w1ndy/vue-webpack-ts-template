process.env.NODE_ENV = 'production'

import * as path from 'path'

import chalk from 'chalk'
import ora from 'ora'
import rm from 'rimraf'
import webpack, { Stats } from 'webpack'

import { APPLICATION_CONFIGURATION } from '../config/ApplicationConfiguration'
import { productionWebpackConfiguration } from '../config/webpack/ProductionWebpackConfiguration'

// tslint:disable-next-line:typedef
const spinner = ora('building for production...')
spinner.start()

rm(
  path.join(
    APPLICATION_CONFIGURATION.build.assetsRoot,
    APPLICATION_CONFIGURATION.build.assetsSubDirectory),
  (e: Error): void => {
    if (e) {
      throw e
    }

    webpack(productionWebpackConfiguration, (err: Error, stats: Stats) => {
      spinner.stop()
      if (err) {
        throw err
      }

      const stat: string = stats.toString({
        colors: true,
        modules: false,
        children: true, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      })
      process.stdout.write(`${stat}\n\n`)

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
    })
  })

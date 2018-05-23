const chalk = require('chalk')
const createCallsiteRecord = require('callsite-record')

// register exception callback
process.on('uncaughtException', error => {
  console.log()

  if (!error.stack) {
    console.log(error)
    return
  }

  const oldStack = error.stack

  function printFormattedTSError ({ file, line, col, reason, msgs }) {
    console.log(`${chalk.bgRed.bold(` ${error.name} `)}${chalk.yellow.bold(` ${file} `)}${reason}`)
    for (let msg of msgs) {
      console.log(`  ${chalk.gray(msg)}`)
    }
    console.log()

    error.stack = oldStack.replace(
      /^    at/m,
      `    at __unnamed_func (${file}:${line}:${col})\n    at`
    )

    const record = createCallsiteRecord({ forError: error })
    if (record) {
      console.log(record.renderSync({}))
    }
    console.log()
  }

  // correct TSError stacktrace for pretty print
  if (error.name === 'TSError') {
    const errorMsgs = error.message.split('\n')
    errorMsgs.splice(0, 1)

    let lastError = null
    for (let msg of errorMsgs) {
      const match = msg.match(/^(.*) \((\d+),(\d+)\): (.*)$/)
      if (match) {
        if (lastError) printFormattedTSError(lastError)

        lastError = {
          file: match[1],
          line: match[2],
          col: match[3],
          reason: match[4],
          msgs: []
        }
      } else {
        if (lastError) {
          lastError.msgs.push(msg)
        } else {
          lastError = {
            file: 'VM',
            line: 1,
            col: 1,
            reason: 'Unknown error',
            msgs: [ msg ]
          }
        }
      }
    }

    if (lastError) printFormattedTSError(lastError)
  } else {
    console.log(`${chalk.bgRed.bold(` ${error.name} `)} ${error.message}`)
    const record = createCallsiteRecord({ forError: error })
    if (record) {
      console.log(record.renderSync({}))
    }
  }

  process.exit(-1)
})

// kick up server or builder with ts-node
require('ts-node').register({ project: './tsconfig.server.json' })
switch (process.argv[2]) {
  case 'build':
    require('./Builder.ts')
    break
  case 'prod':
    process.env.NODE_ENV = 'production'
  case 'serve':
    require('./Server.ts')
    break
  case 'serve-test':
    process.env.SERVE_TEST = '1'
    require('./Server.ts')
    break
  default:
    console.log('node build/main.js serve|build|prod')
}

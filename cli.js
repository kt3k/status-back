#!/usr/bin/env node

const chalk = require('chalk')
const { select } = require('action-selector')
const pkg = require('./package')
const { post, StatusBackError } = require('./')
const { getSha1 } = require('./util')

exports.main = argv => {
  const { help, version } = argv

  select(new CLI(), { version, help, main: true }).on('action', action => action(argv))
}

class CLI {
  /**
   * The version action. Shows the version number.
   */
  'action:version' () {
    console.log(`${pkg.name}@${pkg.version}`)
  }

  /**
   * The help action. Shows the help message.
   */
  'action:help' () {
    console.log(`
  Usage: ${chalk.cyan(pkg.name)} [options] [<description>, [<url>]]

  Options:
    -p, --pending - - - - - - - Set the commit status pending.
    -s, --success - - - - - - - Set the commit status success.
    -f, --failure - - - - - - - Set the commit status failure.
    -e, --error - - - - - - - - Set the commit status error.
    -t, --token <token> - - - - Set the github token.
                                Optionally set by STATUS_TOKEN env var.
    -r, --repo <repo> - - - - - Set the repo slug. e.g. nodejs/node.
                                Optionally set by GITHUB_REPO env var.
    --sha1 <sha1> - - - - - - - Set the sha1 of the commit. Default is the current sha1.
                                Optionally set by STATUS_SHA1.
    -c, --context <context> - - Set the context of the commit status. e.g. ci/build.
                                Optionally set by STATUS_CONTEXT env var.
    --github-api <url>  - - - - Set the url of the github api. Set this when you use with github enterprise.
                                Optionally set by GITHUB_API env var.

  Example:
    ${pkg.name} -s --repo nodejs/node --context ci/build "build success!" "https://ci.server/build/12345"

    ${pkg.name} -f --repo nodejs/node --context ci/build "build failure!" "https://ci.server/build/12346"
`)
  }

  /**
   * The main action. Performs sending the commit status.
   */
  'action:main' (argv) {
    const pending = argv.pending
    const success = argv.success
    const failure = argv.failure
    const error = argv.error
    const repo = argv.repo || process.env.GITHUB_REPO
    const sha1 = argv.sha1 || process.env.STATUS_SHA1 || getSha1()
    const context = argv.context || process.env.STATUS_CONTEXT
    const rootURL = argv['github-api'] || process.env.GITHUB_API

    if ([pending, success, failure, error].every(status => !status)) {
      console.log(`${chalk.red('Error:')} One of ${chalk.cyan('--pending')}, ${chalk.cyan('--success')}, ${chalk.cyan('--failure')} and ${chalk.cyan('--error')} option is required.`)
      process.exit(1)
    }

    post(/* TODO: implement */)
  }
}

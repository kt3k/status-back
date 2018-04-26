#!/usr/bin/env node

const chalk = require('chalk')
const { select } = require('action-selector')
const pkg = require('./package')
const { post } = require('./')
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
                                Optionally set by GITHUB_TOKEN env var.
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
    const pending = argv.pending || false
    const success = argv.success || false
    const failure = argv.failure || false
    const error = argv.error || false

    if (pending + success + failure + error === 0) {
      console.log(`${chalk.red('Error:')} One of ${chalk.cyan('--pending')}, ${chalk.cyan('--success')}, ${chalk.cyan('--failure')} and ${chalk.cyan('--error')} option is required.`)
      process.exit(1)
    }

    if (pending + success + failure + error > 1) {
      console.log(`${chalk.red('Error:')} Only one of ${chalk.cyan('--pending')}, ${chalk.cyan('--success')}, ${chalk.cyan('--failure')} and ${chalk.cyan('--error')} option is allowed.`)
      if (pending) {
        console.log('  --pending is specified')
      }

      if (success) {
        console.log('  --success is specified')
      }

      if (failure) {
        console.log('  --failure is specified')
      }

      if (error) {
        console.log('  --error is specified')
      }

      process.exit(1)
    }

    const state = pending ? 'pending' : success ? 'success' : failure ? 'failure' : 'error'

    const token = argv.token || process.env.GITHUB_TOKEN

    if (!token) {
      console.log(`${chalk.red('Error:')} Token is not given. You need to specify either --token option or GITHUB_TOKEN env var.`)
      process.exit(1)
    }

    const repo = argv.repo || process.env.GITHUB_REPO

    if (!repo) {
      console.log(`${chalk.red('Error:')} Repo is not given. You need to specify either --repo option or GITHUB_REPO env var.`)
      process.exit(1)
    }

    if (!repo.includes('/')) {
      console.log(`${chalk.red('Error:')} Invalid repo format: ${repo}`)
      console.log(`  You need to specify it like ${chalk.cyan('nodejs/node')} for example`)
      process.exit(1)
    }

    const context = argv.context || process.env.STATUS_CONTEXT

    if (!context) {
      console.log(`${chalk.red('Error:')} Context is not given. You need to specify either --context option or STATUS_CONTEXT env var.`)
      process.exit(1)
    }

    const sha1 = argv.sha1 || process.env.STATUS_SHA1 || getSha1()

    if (!sha1) {
      console.log(`${chalk.red('Error:')} Sha1 is not given. You need to specify either --sha1 option or STATUS_SHA1 env var or run this command in a git repository.`)
      process.exit(1)
    }

    const rootURL = argv['github-api'] || process.env.GITHUB_API
    const description = argv._[0] || ''
    const url = argv._[1] || ''

    post({
      token,
      sha1,
      owner: repo.split('/')[0],
      repo: repo.split('/')[1],
      state,
      context,
      description,
      url,
      rootURL
    })
      .then(() => {
        console.log(chalk.cyan('Sent the commit status successfully.'))
      })
      .catch(e => {
        console.log(e.stack)
        process.exit(1)
      })
  }
}

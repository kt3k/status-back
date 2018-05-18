const { execSync } = require('child_process')
const { join } = require('path')
const assert = require('assert')
const pkg = require('./package')
const util = require('./util')

const bin = join(__dirname, 'bin', 'status-back.js')
const defaultOpts = {}

/**
 * Executes the given command with the options.
 *
 * @param {string} cmd The command to excute
 * @param {Object} opts The options to pass to execSync
 * @return {string} The result of command
 */
const exec = (cmd, opts) => execSync(cmd, Object.assign({}, defaultOpts, opts)).toString()

describe('cli(status-back)', function () {
  this.timeout(8000)

  context('--version options', () => {
    it('shows version number', () => {
      const result = exec(`${bin} --version`)

      assert(result.includes(pkg.version))
    })
  })

  context('-h, --help options', () => {
    it('shows help message', () => {
      const result = exec(`${bin} -h`)

      assert(result.includes('Usage'))
    })
  })

  context('when any of -s, -p, -e or -f options is not specified', () => {
    it('throws', () => {
      assert.throws(() => exec(`${bin}`))
    })
  })

  context('when more than one of -s, -p, -e and -f options are specified', () => {
    it('throws', () => {
      assert.throws(() => exec(`${bin} -s -p`))
    })

    it('throws', () => {
      assert.throws(() => exec(`${bin} -e -f`))
    })

    it('throws', () => {
      assert.throws(() => exec(`${bin} -s -p -e -f`))
    })
  })

  context('when status option is set correctly', () => {
    context('when token is not set', () => {
      it('throws', () => {
        assert.throws(() => exec(`${bin} -s`))
      })
    })
    context('when token is set correctly', () => {
      context('when repo is not specified', () => {
        it('throws', () => {
          assert.throws(() => exec(`${bin} -s -t cafebabe`))
        })
      })
      context('when repo format is invalid', () => {
        it('throws', () => {
          assert.throws(() => exec(`${bin} -f -t cafebabe -r 123`))
        })
      })

      context('when repo is set correctly', () => {
        context('when context is not set', () => {
          it('throws', () => {
            assert.throws(() => exec(`${bin} -p -t cafebabe -r nodejs/node`))
          })
        })

        context('when context is set correctly', () => {
          context('when sha1 is not set', () => {
            it('throws', () => {
              assert.throws(() => exec(`${bin} -e -t cafebabe -r nodejs/node -c ci/test`, { cwd: '/' }))
            })
          })

          context('when sha1 is set correctly', () => {
            it('requests to the github commit status api', () => {
              exec(`${bin} -s -t cafebabe -r nodejs/node -c ci/test --sha1 1234567890123456789012345678901234567890 description http://example.com/result`)
            })

            it('when verbose mode is set', () => {
              const result = exec(`${bin} -v -s -t cafebabe -r nodejs/node -c ci/test --sha1 1234567890123456789012345678901234567890 description http://example.com/result`)

              assert(result.includes('Run with verbose mode.'))
            })

            it('when verbose mode is not set', () => {
              const result = exec(`${bin} -s -t cafebabe -r nodejs/node -c ci/test --sha1 1234567890123456789012345678901234567890 description http://example.com/result`)

              assert(!result.includes('Run with verbose mode.'))
            })

            it('requests and fails if the github API is wrong', () => {
              assert.throws(() => exec(`${bin} -e -t cafebabe -r nodejs/node -c ci/test --sha1 1234567890123456789012345678901234567890 --github-api=http://localhost:9090`))
            })
          })
        })
      })
    })
  })
})

describe('util', () => {
  describe('assert', () => {
    it('does nothing if the condition is ok', () => {
      util.assert(true, 'ok')
    })

    it('throws if the condition is not ok', () => {
      assert.throws(() => util.assert(false, 'ng'))
    })
  })
})

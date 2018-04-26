const Octokat = require('octokat')
const { assert } = require('./util')

/**
 * @param {string} token - Github token
 * @param {string} sha1 - The sha1 hash of the commit e.g cafebabe123
 * @param {string} repo - The repository e.g. nodejs/node
 * @param {string} state - The state e.g. success, pending, error, failure
 * @param {string} context - The context e.g. ci/test
 * @param {string} description - The description
 * @param {string} [url] - The url of the status
 * @param {string} rootURL - The root url of the github
 */
function post ({ token, sha1, owner, repo, state, context, description, url, rootURL }) {
  const validStates = ['pending', 'success', 'error', 'failure']

  assert(token, 'GitHub token not configured')
  assert(sha1, 'Unable to detect current build’s SHA')
  assert(owner, 'Unable to detect repository owner')
  assert(repo, 'Unable to detect repository name')
  assert(typeof context === 'string', 'context must be a string')
  assert(typeof description === 'string', 'description must be a string')
  assert(!url || typeof url === 'string', 'url must be a string')
  assert(validStates.indexOf(state) >= 0, `Invalid state (given: ${state})`)

  const octo = new Octokat({ token, rootURL })

  return octo.repos(owner, repo).statuses(sha1).create({
    state: state,
    context: context,
    description: description,
    target_url: url || undefined
  })
}

exports.post = post

const { execSync } = require('child_process')

exports.getSha1 = () => {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch (e) {
    return ''
  }
}

/**
 * Throws with the message when the condition does not satisfy.
 * @param {boolean} condition
 * @param {string} message
 */
exports.assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

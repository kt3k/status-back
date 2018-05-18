#!/usr/bin/env node

const minimisted = require('minimisted')
const { main } = require('../cli')

minimisted(main, {
  boolean: [
    'help',
    'version',
    'verbose',
    'pending',
    'success',
    'failure',
    'error'
  ],
  string: [
    'token',
    'repo',
    'sha1',
    'context',
    'github-api'
  ],
  alias: {
    h: 'help',
    v: 'verbose',
    p: 'pending',
    s: 'success',
    f: 'failure',
    e: 'error',
    t: 'token',
    r: 'repo',
    c: 'context'
  }
})

import fs from 'fs'

import test from 'ava'
import {transform} from '@babel/core'

import preset from '..'

function snapshot(t, fixture, presetOptions = {}, envName = 'development') {
  const filename = `${__dirname}/fixtures/${fixture}`
  const input = fs.readFileSync(filename, 'utf8')
  t.snapshot(input, 'input')
  const options = {envName, presets: [[preset, presetOptions]], filename, babelrc: false}
  const result = transform(input, options)
  t.snapshot(result.code, 'output')
}

snapshot.title = (provided, fixture, options, envName) => {
  const when = options ? `when ${JSON.stringify(options)}` : 'by default'
  const inEnv = envName ? ` in ${envName} environment` : ''
  return `${provided} ${when}${inEnv}`
}

test('transpiles ES2018+ syntax', snapshot, 'esnext.js')
test('transpiles ES2018+ syntax for node', snapshot, 'esnext.js', undefined, 'test')
test('transpiles ES2018+ syntax strictly', snapshot, 'esnext.js', {loose: false})

test('does not transpile ES modules', snapshot, 'esm.js')
test('transpiles ES modules', snapshot, 'esm.js', {modules: 'commonjs'})
test('transpiles ES modules', snapshot, 'esm.js', undefined, 'test')

test('does not use external helpers', snapshot, 'esm-helpers.js')
test('uses external ESM helpers', snapshot, 'esm-helpers.js', {runtime: true})
test('uses external CJS helpers', snapshot, 'esm-helpers.js', {modules: 'commonjs', runtime: true})

test('cherry picks lodash modules', snapshot, 'lodash.js')
test('does not cherry pick lodash modules', snapshot, 'lodash.js', {lodash: false})

test('wraps prop types assignment', snapshot, 'prop-types.js')
test('wraps prop types assignment', snapshot, 'prop-types.js', {removePropTypes: 'unsafe-wrap'})
test('wraps prop types value', snapshot, 'prop-types.js', {removePropTypes: 'wrap'})
test('removes prop types', snapshot, 'prop-types.js', undefined, 'production')
test('removes prop types', snapshot, 'prop-types.js', {removePropTypes: 'remove'})
test('does not remove prop types', snapshot, 'prop-types.js', {removePropTypes: false})

test('TypeScript compiles TSX', snapshot, 'react.tsx', {typescript: true})
test('TypeScript supports syntax dynamic imports', snapshot, 'syntax-dynamic-import.ts', {
  typescript: true,
})

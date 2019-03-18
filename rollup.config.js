import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import minify from 'rollup-plugin-babel-minify'

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'VueSyncData',
      file: pkg.browser,
      format: 'umd',
      exports: 'named'
    },
    plugins: [
      eslint(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties', 'lodash']
      }),
      resolve(),
      commonjs(),
      minify({
        comments: false
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.js',
    external: [
      'lodash/set',
      'lodash/isArray',
      'lodash/isBoolean',
      'lodash/isObject',
      'lodash/isEmpty',
      'lodash/isString'
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named'
      }
    ],
    plugins: [
      eslint(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties', 'lodash']
      }),
      minify({
        comments: false
      })
    ]
  }
]

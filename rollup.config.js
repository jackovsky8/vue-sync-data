import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import commonjs from 'rollup-plugin-commonjs'

// Add here external dependencies that actually you use.
const globals = { lodash: 'lodash' }

export default {
  external: Object.keys(globals),
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'syncQuery',
    globals: globals,
    sourcemap: true,
    exports: 'named',
    file: 'vue-sync-query.js'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-proposal-class-properties']
    }),
    uglify(),
    resolve(),
    sourcemaps(),
    commonjs({
      namedExports: {
        'node_modules/lodash/index.js': [
          'isObject',
          'isEmpty',
          'isArray',
          'isString',
          'isBoolean',
          'set'
        ]
      }
    })
  ]
}

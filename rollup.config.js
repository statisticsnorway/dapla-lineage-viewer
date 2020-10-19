import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const globals = {
  react: 'React',
  'semantic-ui-react': 'semanticUiReact'
}

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'lib/bundle.js',
      format: 'cjs',
      globals: globals
    },
    {
      file: 'lib/bundle.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()],
      globals: globals
    }
  ],
  external: [
    'react',
    'semantic-ui-react'
  ],
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    commonjs()
  ]
}

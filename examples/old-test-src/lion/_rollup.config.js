import multi from '@rollup/plugin-multi-entry'

export default [
  {
    input: ['one.js', 'two.js', 'three.js'],
    output: {
      name: 'main',
      file: 'es-out.js',
      format: 'es'
    },
    plugins: [multi()]
  }
]

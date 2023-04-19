import { rollup } from 'rollup'
import multi from '@rollup/plugin-multi-entry'

const build = async () => {
  let bundle
  let buildFailed = false
  try {
    bundle = await rollup({
      input: ['one.js', 'two.js', 'three.js'],
      plugins: [multi()]
    })
    await bundle.write({
      name: 'main',
      file: './es-out-fn.js',
      format: 'es'
    })
  } catch (error) {
    buildFailed = true
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
  process.exit(buildFailed ? 1 : 0)
}

build()

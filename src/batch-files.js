import { rollup } from 'rollup'
import path from 'path'
import multi from '@rollup/plugin-multi-entry'
import terser from '@rollup/plugin-terser'

const { resolve } = path

const batchFiles = async (
  batchList,
  output,
  dir,
  minify
) => {
  const file = resolve(dir, output)
  let bundle
  let buildFailed = false
  const input = batchList.map(item => resolve(dir, item))
  try {
    // Input options
    bundle = await rollup({
      makeAbsoluteExternalsRelative: false,
      onwarn: function (message) {
        if (/external dependency/.test(message)) return
        console.error(message)
      },
      external: (a, b, c) => !input.includes(a),
      input,
      plugins: [
        multi(),
        minify && terser()
      ]
    })
    await bundle.write({
      name: 'main',
      file,
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

export { batchFiles }

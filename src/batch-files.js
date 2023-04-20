import { rollup } from 'rollup'
import path from 'path'
import multi from '@rollup/plugin-multi-entry'
import terser from '@rollup/plugin-terser'
import { readdir, unlink } from 'fs/promises'

const { resolve, parse } = path

const removeAllStartingWith = async (dir, filenameWithoutExt) => {
  const files = await readdir(dir)
  //@todo refactor into the async loop
  const filteredFiles = files.filter(file => file.startsWith(filenameWithoutExt))

  try {
    for (const file of filteredFiles) {
      const filePathToRemove = resolve(dir, file)
      await unlink(filePathToRemove)
    }
  } catch (e) {
    console.error(e)
  }
}

const batchFiles = async (
  batchList,
  output,
  dir,
  minify,
  invalidate,
  preserve
) => {

  const filenameWithoutExt = parse(resolve(dir, output)).name

  if (invalidate && !preserve) {
    removeAllStartingWith(dir, filenameWithoutExt)
  }

  var hash = parseInt((Date.now() + '').slice(4)).toString(36)
  const filename = invalidate ? output.replace(/.([^.]*)$/, `\-${hash}.$1`) : output
  console.log('filename', filename)
  const file = resolve(dir, filename)
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

import { rollup } from 'rollup'
import path from 'path'
import multi from '@rollup/plugin-multi-entry'
import terser from '@rollup/plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import { readdir, unlink } from 'fs/promises'
import chalk from 'chalk'

const { resolve, parse } = path

const removeAllStartingWith = async (dir, filenameWithoutExt) => {
  const files = await readdir(dir)
  // @todo refactor into the async loop
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
  preserve,
  comments,
  batchConfigPath
) => {
  const filenameWithoutExt = parse(resolve(dir, output)).name

  if (invalidate && !preserve) {
    removeAllStartingWith(dir, filenameWithoutExt)
  }

  const hash = parseInt((Date.now() + '').slice(4)).toString(36)
  const filename = invalidate ? output.replace(/.([^.]*)$/, `-${hash}.$1`) : output

  const file = resolve(dir, filename)
  let bundle
  // let buildFailed = false
  const input = batchList.map(item => resolve(dir, item))

  // Write log
  console.group('\nCreated:', chalk.magenta(output))
  console.log('-', 'From config:', chalk.greenBright(batchConfigPath))
  console.group('-', 'Encompassing:')
  input.forEach(inputFile => {
    console.log('•', chalk.cyan(inputFile))
  })
  console.groupEnd('-')
  console.log('-', 'Wrote to:', chalk.yellow(file))
  console.groupEnd('\nCreated:')

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
        minify && terser(),
        cleanup({
          comments: comments ? 'all' : 'none'
        })
      ]
    })
    await bundle.write({
      name: 'main',
      file,
      format: 'es'
    })
  } catch (error) {
    // buildFailed = true
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
  // process.exit(buildFailed ? 1 : 0)
}

export { batchFiles }

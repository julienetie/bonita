import path from 'path'
import { readdir, readFile } from 'fs/promises'
import { batchFiles } from './batch-files.js'
// import { watchAndBuild } from './watch-and-build.js'
import * as url from 'url'
import { fork } from 'child_process'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const { resolve, dirname } = path
const { isArray } = Array
// const rootPath = new URL(path.dirname(import.meta.url)).pathname;

const batchConfigDefaults = {
  // output
  // files
  minify: false,
  comments: true,
  batch: true,
  ignore: false,
  watch: true,
  invalidate: false,
  preserve: false
}

const configureBatching = async (jsonConfig, dir) => {
  const config = JSON.parse(jsonConfig)
  console.log('type', typeof config.hasOwn)
  const minify = Object.hasOwn(config, 'minify') ? config.minify : batchConfigDefaults.minify
  const comments = Object.hasOwn(config, 'comments') ? config.comments : batchConfigDefaults.comments
  const batch = Object.hasOwn(config, 'batch') ? config.batch : batchConfigDefaults.batch
  const ignore = Object.hasOwn(config, 'ignore') ? config.ignore : batchConfigDefaults.ignore
  const watch = Object.hasOwn(config, 'watch') ? config.watch : batchConfigDefaults.watch
  const invalidate = Object.hasOwn(config, 'invalidate') ? config.invalidate : batchConfigDefaults.invalidate
  const preserve = Object.hasOwn(config, 'preserve') ? config.preserve : batchConfigDefaults.preserve
  const outputFile = config.output
  const { files } = config

  // Output file name is required
  if (outputFile === undefined) {
    console.error('Missing `output`')
    return
  }

  // Output file name must start with an underscore
  if (outputFile.at() !== '_') {
    console.error('Output file name must start with an underscore.')
    return
  }

  // Files are required
  if (!isArray(files) || files.length < 1) {
    console.error('Missing `files`')
    return
  }

  if (ignore === true) {
    // @todo check flag to override ignore
    return
  }

  // @todo Invalidate
  // @todo Watch
  // @todo Comments

  if (batch === true) {
    // Bundle files ES
    console.log('Will bundle for: ', outputFile)
    batchFiles(
      files,
      outputFile,
      dir,
      minify,
      invalidate,
      preserve,
      comments
    )
  } else {
    // Concatenate files ES
    console.log('Will concat for: ', outputFile)
  }
}

const readBatchConfig = async (batchConfigPath, dir) => {
  const file = await readFile(batchConfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return Buffer.from(data)
  })

  configureBatching(file, dir)
}

/**
 * Find all batch.json files within the parent and sub directories.
 * @param {string} parentDirectory
 */
const findBatchConfigFiles = async parentDirectory => {
  async function * findFiles (dir) {
    const dirents = await readdir(dir, { withFileTypes: true })
    for (const dirent of dirents) {
      const direntName = dirent.name
      const res = resolve(dir, direntName)
      if (dirent.isDirectory()) {
        yield * findFiles(res)
      } else {
        if (direntName.startsWith('.batch') && direntName.endsWith('.json')) {
          readBatchConfig(res, dir)
          yield res
        }
      }
    }
  }

  // eslint-disable-next-line
  for await (const _ of findFiles(parentDirectory));
}

const createBatchFiles = (directory, { watch }) => {
  // Removes * and filename from the path.
  const cleanedDirectory = dirname(directory)

  // Watch for changes flagged
  if (watch) {
    const watchAndBuild = fork(resolve(__dirname, './watch-and-build.js'))

    watchAndBuild.on('message', (m) => {
      console.log('received: ' + m)
    })

    // Watch and build
    watchAndBuild.send(cleanedDirectory)
  }

  findBatchConfigFiles(cleanedDirectory)
}

export { createBatchFiles, findBatchConfigFiles }

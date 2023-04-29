import path from 'path'
import { readdir, readFile } from 'fs/promises'
import { batchFiles } from './batch-files.js'
import chokidar from 'chokidar'
import chalk from 'chalk'
const { resolve, dirname } = path
const { isArray } = Array

const configFilesMap = {}// new Map()

const batchConfigDefaults = {
  minify: false,
  comments: true,
  batch: true,
  ignore: false,
  invalidate: false,
  preserve: false
}

const configureBatching = async (batchConfigPath, jsonConfig, dir) => {
  const config = JSON.parse(jsonConfig)
  const minify = Object.hasOwn(config, 'minify') ? config.minify : batchConfigDefaults.minify
  const comments = Object.hasOwn(config, 'comments') ? config.comments : batchConfigDefaults.comments
  const batch = Object.hasOwn(config, 'batch') ? config.batch : batchConfigDefaults.batch
  const ignore = Object.hasOwn(config, 'ignore') ? config.ignore : batchConfigDefaults.ignore
  const invalidate = Object.hasOwn(config, 'invalidate') ? config.invalidate : batchConfigDefaults.invalidate
  const preserve = Object.hasOwn(config, 'preserve') ? config.preserve : batchConfigDefaults.preserve
  const outputFile = config.output
  const { files } = config

  configFilesMap[batchConfigPath] = { files, ignore }

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

  if (batch === true) {
    batchFiles(
      files,
      outputFile,
      dir,
      minify,
      invalidate,
      preserve,
      comments,
      batchConfigPath
    )
  } else {
    // Concatenate files ES
    // console.log('Will concat for: ', outputFile)
  }
}

const readBatchConfig = async (batchConfigPath) => {
  const dir = dirname(batchConfigPath)
  const file = await readFile(batchConfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return Buffer.from(data)
  })

  configureBatching(batchConfigPath, file, dir)
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
  /* eslint-disable-next-line */
  for await (const files of findFiles(parentDirectory));

  return configFilesMap
}

const createBatchFiles = async (directory, { watch }) => {
  // Removes * and filename from the path.
  const cleanedDirectory = dirname(directory)

  const configFilesMap = await findBatchConfigFiles(cleanedDirectory)

  const watchList = []
  const watchMap = new Map()
  for (const batchConfig of Object.entries(configFilesMap)) {
    const [key, value] = batchConfig
    if (value.ignore) continue

    value.files.forEach(file => {
      const watchPath = resolve(dirname(key), file)
      watchList.push(watchPath)
      watchMap.set(watchPath, key)
    })
  }

  // Watch for changes flagged
  if (watch) {
    const watcher = chokidar.watch(watchList, {
      persistent: true,
      usePolling: true,
      interval: 100,
      binaryInterval: 300,
      useFsEvents: false,
      workerThreads: true
    })

    watcher.on('ready', () => {
      console.log('\n', chalk.whiteBright('...Watching for changes'))
      watcher.on('change', (path) => {
        const batchConfigPath = watchMap.get(path)
        readBatchConfig(batchConfigPath)
      })
    })
  }
}

export { createBatchFiles, readBatchConfig }

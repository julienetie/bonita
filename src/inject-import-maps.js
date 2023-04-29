
import * as url from 'url'
import path from 'path'
import { readdir, readFile } from 'fs/promises'
import { injectMaps } from './inject-maps.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const { resolve, basename } = path
const { isArray } = Array
const injectableFiles = new Map()
const importMaps = new Map()

const readImportMapperJson = async (cliDir = '') => {
  const importMapperJsonPath = resolve(cliDir, 'import-mapper.json')

  const importMapperJson = await readFile(importMapperJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return Buffer.from(data)
  })

  return JSON.parse(importMapperJson)
}

const readImportMap = async (importMapPath) => {
  const file = await readFile(importMapPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return Buffer.from(data)
  })
  importMaps.set(basename(importMapPath), file)
}

const getImportMaps = async importMapsDir => {
  async function * findFiles (dir) {
    const dirents = await readdir(dir, { withFileTypes: true })
    for (const dirent of dirents) {
      const direntName = dirent.name
      const res = resolve(dir, direntName)
      if (dirent.isDirectory()) {
        yield * findFiles(res)
      } else {
        if (direntName.endsWith('.json')) {
          await readImportMap(res, dir)
          yield res
        }
      }
    }
  }
  const importMapsFolder = resolve(importMapsDir, './import-maps')
  /* eslint-disable-next-line */
  for await (const _ of findFiles(importMapsFolder));

  return importMaps
}

const setInjectables = async (docs, cliDir) => {
  for await (const filePath of docs) { // @todo make docs into async iterable
    const injectableFilePath = resolve(cliDir, filePath)
    const injectableFile = await readFile(injectableFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      return Buffer.from(data)
    })
    injectableFiles.set(filePath, injectableFile)
  }
  return injectableFiles
}

const injectImportMaps = async ({ watch, path: configPath }) => {
  const cliDir = resolve(__dirname, '../', configPath) // Remove ../
  const importMapperJson = await readImportMapperJson(cliDir)
  const { documents, document } = importMapperJson

  if (!(document === undefined || document === 'string')) {
    console.error('`document` should be a string')
    return
  }

  const docs = documents || [document]

  if (!(isArray(docs) || typeof doc === 'string')) {
    console.error('`documents` should be an array or string')
    return
  }

  const importMapsPathSupplied = importMapperJson['import-maps-path'] || './'
  const importMapsPath = resolve(cliDir, importMapsPathSupplied)
  const injectables = await setInjectables(docs, cliDir)

  await getImportMaps(importMapsPath)

  const injectablesIter = injectables[Symbol.iterator]()

  for (const item of injectablesIter) {
    const [htmlPath, html] = item
    injectMaps(html, htmlPath, importMaps, cliDir)
  }
}

export { injectImportMaps }
import path from 'path'
import { readdir, readFile } from 'fs/promises'
const { resolve } = path
// const rootPath = new URL(path.dirname(import.meta.url)).pathname;

const readBatchConfig = async (batchConfigPath) => {

    const file = readFile(batchConfigPath, 'utf8', (err, data) => {
        console.log('read batch config :::', batchConfigPath)
        if (err) {
            console.error(err)
            return
        }
        return Buffer.from(data)
    })

    console.log(await file)
}

/**
 * Find all batch.json files within the parent and sub directories.
 * @param {string} parentDirectory
 */
const findBatchConfigFiles = async parentDirectory => {
    async function* findFiles(dir) {
        const dirents = await readdir(dir, { withFileTypes: true })
        for (const dirent of dirents) {
            const res = resolve(dir, dirent.name)
            if (dirent.isDirectory()) {
                yield* findFiles(res)
            } else {
                if (res.endsWith('batch.json')) {
                    readBatchConfig(res)
                    yield res
                }
            }
        }
    }

    for await (const file of findFiles(parentDirectory)) {
        // console.log(file)
    }
}

const createBatchFiles = parentDirectory => {
    findBatchConfigFiles(parentDirectory)
}

export { createBatchFiles }

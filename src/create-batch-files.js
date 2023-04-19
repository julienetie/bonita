import path from 'path'
import { readdir, readFile } from 'fs/promises'
const { resolve } = path
const { isArray } = Array
// const rootPath = new URL(path.dirname(import.meta.url)).pathname;

const batchConfigDefaults = {
    minify: false,
    comments: true,
    batch: true,
    ignore: false,
    watch: true,
    invalidate: false
}

const configureBatching = async (jsonConfig) => {
    const config = JSON.parse(jsonConfig)
    const minify = config.hasOwnProperty('minify') ? config.minify : batchConfigDefaults.minify
    const comments = config.hasOwnProperty('comments') ? config.comments : batchConfigDefaults.comments
    const batch = config.hasOwnProperty('batch') ? config.batch : batchConfigDefaults.batch
    const ignore = config.hasOwnProperty('ignore') ? config.ignore : batchConfigDefaults.ignore
    const watch = config.hasOwnProperty('watch') ? config.watch : batchConfigDefaults.watch
    const invalidate = config.hasOwnProperty('invalidate') ? config.invalidate : batchConfigDefaults.invalidate
    const outputFile = config['output-file'] 
    const { files } = config

// console.log({
//     minify,
//     comments,
//     batch,
//     ignore,
//     watch,
//     invalidate,
//     outputFile,
//     files
// })
    // Output file name is required
    if (outputFile === undefined) {
        console.error('Missing `output-file`')
        return
    }

    // Files are required
    if (!isArray(files) || files.length < 1) {
        console.error('Missing `files`')
        return
    }

    if (ignore === true) {
        //@todo check flag to override ignore
        return
    }

    // @todo Invalidate
    // @todo Watch
    // @todo Comments
    // @todo Minify

    if(batch === true) {
        // Bundle files ES
        console.log('Will bundle for: ', outputFile)
    } else {
        // Concatenate files ES
        console.log('Will concat for: ', outputFile)
    }
}


const readBatchConfig = async (batchConfigPath) => {
    const file = await readFile(batchConfigPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        return Buffer.from(data)
    })


    // console.log('///READING: ', jsonConfig['output-file'])
    configureBatching(file)
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

    for await (const _ of findFiles(parentDirectory));
}

const createBatchFiles = parentDirectory => {
    findBatchConfigFiles(parentDirectory)
}

export { createBatchFiles }

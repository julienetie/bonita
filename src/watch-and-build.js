import chokidar from 'chokidar'
// import path from 'path'

/**
 * @todo
 * - Read all batch< >.json files
 * - Map all files to their batch< >.json file
 *   - Ignore all files with config.watch as false
 * - Add to watch list
 * - Build the corresponding batch< >.json for relative changes
 */

process.on('message', (dirPath) => {
    const watchAndBuild = (directory) => {
        const watcher = chokidar.watch(directory, { persistent: true })

        console.log(`\n*** ox: Watching ${directory} for changes...`)

        watcher.on('ready', () => {
            console.log(`*** ox: Initial scan complete. Watching for changes...`)
        })

        watcher.on('change', (path) => {
            console.log(`*** ox: File ${path} has been changed`)
        })

        watcher.on('error', (error) => {
            console.log(`*** ox: Error occurred while watching ${directory}: ${error}`)
        })
    }

    watchAndBuild(dirPath)
})

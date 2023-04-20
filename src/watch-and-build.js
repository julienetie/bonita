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
    console.log(`\n*** ox: Watching ${directory} for changes...`)
    const watcher = chokidar.watch(directory, { persistent: true })
    watcher.on('change', path => {
      console.log('path', path)
    })
  }
  watchAndBuild(dirPath)
})

// export { watchAndBuild }

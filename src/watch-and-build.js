// import chokidar from 'chokidar'
// import path from 'path'
// import { readBatchConfig } from './create-batch-files.js'
// const { resolve, dirname } = path

// /**
//  * @todo
//  * - Read all batch< >.json files
//  * - Map all files to their batch< >.json file
//  *   - Ignore all files with config.watch as false
//  * - Add to watch list
//  * - Build the corresponding batch< >.json for relative changes
//  */

// process.on('message', (encoded) => {
//   // console.log('PROCESS', encoded)
//   // console.log('configFilesMapEnc',configFilesMapEnc)

//   const data = process.argv[2]
//   const decoded = JSON.parse(
//     Buffer.from(encoded, 'base64').toString('utf-8')
//   )
//   const batchConfigs = Object.entries(decoded)

//   const watchList = []
//   const watchMap = new Map()
//   for (const batchConfig of batchConfigs) {
//     const [key, value] = batchConfig
//     if (value.ignore) continue

//     value.files.map(file => {
//       const watchPath = resolve(dirname(key), file)
//       watchList.push(watchPath)
//       watchMap.set(watchPath, key)
//     })
//   }
//   console.log('watchList', watchList)
//   // console.log('decoded', )

//   const watcher = chokidar.watch(watchList, { persistent: true })

//   console.log('\n*** ox: Watching files for changes...')

//   watcher.on('ready', () => {
//     console.log('*** ox: Initial scan complete. Watching for changes...')
//   })

//   watcher.on('change', (path) => {
//     const batchConfigPath = watchMap.get(path)
//     console.log('change')
//     readBatchConfig(batchConfigPath)
//   })

//   // watcher.on('error', (error) => {
//   //     console.log(`*** ox: Error occurred while watching ...: ${error}`)
//   // })
// })

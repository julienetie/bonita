#!/usr/bin/env node
import cac from 'cac'
import { createBatchFiles } from './src/create-batch-files.js'
import { mapInjectables } from './src/map-injectables.js'
const cli = cac()


// Help message.
cli.version(process.version)
cli.option('-w, --watch', 'Watch for changes and build', {
    default: 'node',
})
cli.help()

// Batch command.
cli
    .command('batch <parentDirectory>', 'Batch files for a given parent directory')
    .option('-w, --watch', 'Watch and batch files on changes')
    .action((parentDirectory, options) => createBatchFiles(parentDirectory, options))

// Inject command.
cli
    .command('inject', 'Inject import-maps into placeholders within a given parent directory')
    .option('-w, --watch', 'Watch and batch files on changes')
    .option('-p, --path <path>', 'Defines the import-mapper.json path if not relative to the cli call')
    .action((parentDirectory, options) => mapInjectables(parentDirectory, options))

cli.parse()

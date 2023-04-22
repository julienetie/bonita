#!/usr/bin/env node
import cac from 'cac'
import { createBatchFiles } from './src/create-batch-files.js'
const cli = cac()

{
    // Help message
    cli.version(process.version)
    cli.option('-w, --watch', 'Watch for changes and build', {
        default: 'node',
    })
    cli.help()

    // Commands
    cli
        .command('batch <parentDirectory>', 'Batch files for a given parent directory')
        .option('-w, --watch', 'Watch and batch files on changes')
        .action((parentDirectory, options) => createBatchFiles(parentDirectory, options))

    cli.parse()
}
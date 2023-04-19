#!/usr/bin/env node
import cac from 'cac'
import { createBatchFiles } from './src/create-batch-files.js'
const cli = cac()

// Help message
cli.version(process.version)
cli.option('--type [type]', 'Choose a project type', {
    default: 'node',
})
cli.option('--name <name>', 'Provide your name')

cli.help()

cli
    .command('shorten <link>', 'Shorten a link')
    .action((link) => console.log(link))

    cli
    .command('batch <parentDirectory>', 'Create batch files for a given parent directory')
    .action((parentDirectory) => createBatchFiles(parentDirectory))

cli.parse()
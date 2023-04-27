
import * as url from 'url'
import path from 'path'
import { readdir, readFile } from 'fs/promises'
import { injectMaps } from './inject-maps.js'
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const { resolve, dirname, basename } = path
const { isArray } = Array
const injectableFiles = new Map()
const importMaps = new Map()

// const isRegExp = value => value instanceof RegExp

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
    async function* findFiles(dir) {
        const dirents = await readdir(dir, { withFileTypes: true })
        for (const dirent of dirents) {
            const direntName = dirent.name
            const res = resolve(dir, direntName)
            if (dirent.isDirectory()) {
                yield* findFiles(res)
            } else {
                if (direntName.endsWith('.json')) {
                    // console.log('@@: ',res, dir)
                    await readImportMap(res, dir)
                    yield res
                }
            }
        }
    }
    /* eslint-disable-next-line */
    const importMapsFolder = resolve(importMapsDir, './import-maps')
    for await (const files of findFiles(importMapsFolder));

    return importMaps
}

const setInjectables = async (docs, cliDir) => {
    for await (const filePath of docs) { //@todo make docs into async iterable 
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
    // console.log('importMapperJson', importMapperJson)
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

    // console.log('docs', docs)

    const importMapsPathSupplied = importMapperJson['import-maps-path'] || './'

    const importMapsPath = resolve(cliDir, importMapsPathSupplied)
    const injectables = await setInjectables(docs, cliDir)
    
    await getImportMaps(importMapsPath)
    // console.log('importMaps',importMaps)


    function getAttributeValues(htmlString, attribute) {
        // Create a regular expression to match the attribute and its value.
        var regex = new RegExp(`${attribute}="([^"]*)"`, 'g');

        // Match all occurrences of the attribute in the HTML string.
        var matches = regex.exec(htmlString);

        // Create an array to store the attribute values.
        var values = [];

        // Loop through the matches and add the attribute values to the array.
        while (matches) {
            values.push(matches[1]);
            matches = regex.exec(htmlString);
        }

        // Return the array of attribute values.
        return values;
    }


    function addslashes(str) {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }


    const regex = /<([a-z]+)[^>]*?\s*(?:\b(?:[a-z]+)\s*=\s*(?:"[^"]*"|'[^']*'|[^'">]+))*/gi

    function replaceHtmlTagContent(htmlString, attribute, value, replacement) {
        const regex = new RegExp(`<[^>]+${attribute}="${value}"[^>]*>[^<]*<\/[^>]+>`, "g")
        console.log()
        return htmlString.replace(regex, (match) => {
          return match.replace(/>([^<]*)</, `>${replacement}<`);
        });
      }

    function replaceHtmlTagContent(htmlString, attribute, replacement) {
        const attributeValuesPattern = new RegExp(`${attribute}="([^"]*)"`, 'g')
        const attributeValues = htmlString.match(attributeValuesPattern, 'g')

        console.log('attributeValues', attributeValues)
        const newDocs = attributeValues && attributeValues.map(attributeValue => {
            // console.log('attributeValue',attributeValue)
            // console.log('attributeValue', attributeValue)
            let value = attributeValue.match(/data-import-map=\"(.+)\"/)
            value = value && value[1] || ''
            const r = new RegExp(`<[^>]+${attributeValues}}"[^>]*>[^<]*<\/[^>]+>\g`, 'g');
            // const regex =  /<[^>]+data-import-map="${value}"[^>]*>[^<]*<\/[^>]+>/g;


            

            // console.log('regex',regex)
            const b = htmlString.replace(r, function (match) {
                console.log('match', match)
                var a = match.replace(/>([^<]*)</, `>${replacement}<`)
                return match + 'hello'
            });
            // console.log('b', b);

            // // var b =  htmlString.replace(regex, (match) => {
            // //     return match.replace(/>([^<]*)</, `>${replacement}<`);
            // //   });

            // //   console.log(b)
        });
        // console.log('newDocs', newDocs)
    }




    // console.log('injectables', ({}).toString.call(injectables))
    const injectablesIter = injectables[Symbol.iterator]()

    for (const item of injectablesIter) {
        const [htmlPath, html] = item
        // console.log('key', html)
        // console.log('text', text)
        injectMaps(html, htmlPath, importMaps)
        // // const importMapReationalMaps = getAttributeValues(value, 'data-import-map')
        // // console.log('importMapReationalMaps:', importMapReationalMaps)
        // // importMapReationalMaps.forEach(im => {

        // // const newHTML = replaceHtmlTagContent(value, 'data-import-map', 'HEllo 123')
        // const regex = /<(.+) (.+)=\"(.+)\">(.+)<\/(.+)>/g;
        // // console.log('text',text)
        // const replacedText = text.replace(regex, (match, tag, attr, value, content) => {
        //     if (attr === "data-import-map" && value === "index-top.json") {
        //       return "<${tag}>This is a new test</${tag}>";
        //     } else {
        //       return match;
        //     }
        //   });
        //   console.log('replaced:', replacedText)

        // // console.log('newHTML',newHTML)

        // // })

        // // console.log('newHTML',newHTML)
    }
    //    injectables.forEach((injectable) => {  // Make async
    //         console.log(injectable)
    //     })
    // Todo, clean maps
    // console.log('injectables: ', injectables)

    // - Find attribute `data-inject-map="`             .match('data-inject-map="')
    // - Get the value of `data-inject-map`                data-inject-map=\'([^']*)\'|data-inject-map=\"([^"]*)\"
    // - empty the co

    // B

    // - Ensure import-mapper.json is root
    // - Read the import-map's file paths
    // - Read all the import maps in the import-map/ directory and store them in a map:
    // - Read each file path and look for injection code and inject the relegant reference import maps from the the map
    //

    // Do B
}

export { injectImportMaps }

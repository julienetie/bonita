
const dataImportMapTagsPattern = /<(script)(?:\s+[^>]*?)*?\s+(data-import-map=["']([^"']*)["']|data-import-map=['"]([^'"]*)['"]).*?>(.*?)<\/\1>/gis
const commentInjectionPattern = /<!--(?:\s+[^>]*?)?import-map-start:\s*([^\s]+)\s*-->(.*?)(<!--\s*import-map-end:\s*([^\s]+)\s*-->)/gs
const tagContentPattern = /(<script(?:\s+[^>]*?)?>)[^<]*(<\/script>)/gis

// const importMaps = new Map()
const importTop = `{"imports": "abc-TOP TOP","scopes": "abcd" }`
const importBottom = `{"imports": "abc-BOTTOM BOTTOM","scopes": "abcd" }`
// importMaps.set('index-top.json', JSON.parse(importTop))
// importMaps.set('index-bottom.json', JSON.parse(importBottom))


const injectDataImportMaps = (html, importMaps) => {
    const matches = html.replace(dataImportMapTagsPattern, (match, p1, p2, p3) => {
        const newContent = `
            ${importMaps.get(p3)}
        `
        return match.replace(tagContentPattern, `$1${newContent}$2`)
    })

    return matches
}

const injectImportMapComments = (html, importMaps) => {
    return html.replaceAll(commentInjectionPattern, (match, p1) => {
        return `<!-- ***Generated import-map using Bonita*** import-map-start: ${p1} -->
            <script type="importmap">
                ${importMaps.get(p1)}
            </script>
            <!-- import-map-end: ${p1} -->
        `
    })
}


const injectMaps = (html, htmlPath, importMaps) => {
    const htmlWithDataImportMaps = injectDataImportMaps(html, importMaps)
    const result = injectImportMapComments(htmlWithDataImportMaps, importMaps)

    // Write to file using htmlPath
    console.log(result)
    // console.log('importMaps',importMaps)
}


export { injectMaps }
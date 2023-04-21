# oxpecker
### ES Module batching

Bonita is a library for: 
### - Batching ES modules into fewer files
This is to reduce the number of module imports when using native modules in the browser.
E.g. A project with 60 files may have a substantial performance gain as 12 files (containing an average of 5 files)

> ### - Mapping _import-maps_ to HTML documents and alike
> This enables the population of individual import-maps (json) to any project files containing the data-import-mapper on an _importmap_ script.
> Multiple maps can be inserted into any file. Files can of course share the same import-maps.
> Non-HTML files are supported such as server-side pages in front-end JavaScript frameworks.

> ### Managing Dependencies
> TBA

Currently the library will only feature module batching.

batch.json files can be placed in any directory and should list files that are typically used on the same page.

<sub>batch.json</sub>
```javascript
{
    "batch-file": "side-menu.js",   // <-- Batched file name
    "minify": false,                // <-- minify (default false)
    "comments": true,               // <-- Show comments (default true)
    "batch": true,                  // <-- Batch ES modules (default true, false will concatenate only)
    "ignore": false,                // <-- Ignore when building (default false)
    "watch": true,                  // <-- Allow to be watched (default true)
    "invalidate": false,            // <-- Adds a new hash on each build `parseInt((Date.now() + '').substr(4)).toString(36)`  -e9hych.js
    "files": [                      // <-- Files to batch
      "/header/blabla.js",
      "header/lala.js",
      "./feed.js",
      "nav.js"
     ]
}
```
Create all _batch-files_ under `./src` using `batch.json`

```bash
bon batch ./src
```

Minifies all, overriding `batch.json`

```bash
bon batch -m ./src
```
Ignores minification for all, overriding `batch.json`

```bash
bon batch -m=false ./src
```
Other commands 
- _-c=true, --comments=true_  : Show comments
- _-n=true, --notice=true_    : Show notice
- _-b=true, --bundle=true_    : Bundle modules (false will concatenate without bundling)
- _-i=a,b,c, --ignore=a,b,c_  : Ignore batch.json files
- _-w=false, --watch=true_    : Watch and batch


MIT 2023 - Julien Etienne 

# Bonita <sup>`beta`</sup>
### Import Maps Manager

Develop native JavaScript applications using Import Maps

#### Bonita:

- Let's you to manage _import-maps_ as JSON files
- Uses dependencies as ES modules via _NPM_ and _esm.sh_
- Work with your source files or distribution files

## Features
- **Stand-alone**: 
  - Create native websites using over 98% of ES.Next without requireing a module bundler (Optional)
- **Module Batching**: 
  - Batch files: Preserve the modularity of your codebase whilst reducing HTTP requests by dividing your files into fewer batches.
  - File hashing: Ensures returning users only download changes
  - Granular configurations: Batch files can be configured using batch-config JSON files 

_TBA_
> - **Import Maps**: 
>  - Multiple maps: Insert selected import maps into multiple parts for multiple pages or layouts
>  - Insert anywhere: Insert import-maps into HTML or any file that uses an HTML-like syntax _(template-literals, jsx, Svelte, Angular, Vue, Solid etc) 
>  - Sync hashed batch files: Batch files are automatically synced with Import Maps
>  - JSON files as import-maps: Manage multiple import maps as individual JSON files.
>  
> - **Dependency management**
>  - NPM: Bonita reads your `package.json` to build source files into the `./bon/` directory which can be used within your import-maps JSON files.
>  - NPM Alias: Includes shorthand aliases to manage NPM packages optimally.
>  - CDN: Fetch from a CDN or use a CDN URL (Currently supports esm.sh) 
>  - Mix resources: Mix NPM and CDN resources
>
> - **Development and builds**: 
>  - Livereload: Build only changed files and batch files
>  - Localization: Build multiple locales from one source
>  - Hybrid web app development: Develop and deploy web applications that are both MPAs and SPAs.
>  - CSS preprocessing: Uses PostCSS and CSS nesting by default. Can be disabled or customized.

## Module Batching
Module Batching combines modules into fewer modules to optimise HTTP performance as projects grow in size.
E.g. A project with 60 files may have a substantial performance gain as 12 files (containing an average of 5 files)
Module batching is an indirect form of code-splitting which eliminate the necessity for bundle based code-splitting.

### How it works
A `.batch.json` config file can be placed in any directory within your source code. Each batch-config determines what files to be included as well as where to write the outputted batch file.

A .batch-config can also be named `.batch-<something>.json` which is ideal if multiple batch-configs should reside in the same directory. 

<sub>batch.json</sub>
```javascript
{
    "output": "side-menu.js",       // <-- Batched file name
    "minify": false,                // <-- minify (default false)
    "comments": true,               // <-- Show comments (default true)
    "batch": true,                  // <-- Batch ES modules (default true, false will concatenate only)
    "ignore": false,                // <-- Ignore when building (default false)
    "invalidate": false,            // <-- Adds a new hash on each build `parseInt((Date.now() + '').substr(4)).toString(36)`  -e9hych.js
    "files": [                      // <-- Files to batch
      "/header/blabla.js",
      "header/lala.js",
      "./feed.js",
      "nav.js"
     ]
}
```
To build all _batch files_ under `./src` use:

```bash
bon batch ./src
```

Minify all batch files. This will override the minify settings for each batch config

```bash
bon batch -m ./src
```

Ignores minification options for all batch configurations. 

```bash
bon batch -m=false ./src
```
Other commands 
- _-c=true, --comments=true_  : Show comments
- _-n=true, --notice=true_    : Show notice
- _-b=true, --bundle=true_    : Bundle modules (false will concatenate without bundling)
- _-i=a,b,c, --ignore=a,b,c_  : Ignore batch.json files
- _-w=false, --watch=true_    : Watch and build

## Contributors

Clone bonita
`git clone git@github.com:julienetie/bonita.git`

Clone bontia-mock into the root 
`cd bonita && git clone git@github.com:julienetie/bonita-mock.git`

Install bonita globally
`npm i -g`

Batching usage
`bon batch ./bonita-mock/example-website/src`

Batch with watch usage
`bon batch ./bonita-mock/example-website/src --watch`

MIT 2023 - Julien Etienne 

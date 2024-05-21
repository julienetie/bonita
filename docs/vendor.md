# Vendor

Bonita uses esm.sh for npm vendor package management.
Packages are installed per import-maps.

1. npm packages begin with `esm.sh/<package-name>@<version>`
2. The package will be downloaded into `./vendor/` if it dosn't exist.
3. Use CDN directly with `https://esm.sh/...`
4. All esm.sh rules will apply to both local and CDN usage
5. `bon ./src/partials/import-maps/import-map.json update all`
6. `bon ./src/partials/import-maps/import-map.json audit`
7. `bon auto-remove`

```js
{
  "imports": {
    "react-dom": "esm.sh/react-dom@18.2.0"
  }
}
```

The above will be built and stored as: 
```js
`./vendor/esm.sh/react-dom@18.2.0.js
```

The ./vendor folder is also where manually created third-party files and folders live.
Bonita will only auto-remove unused packages when commanded to.

### Sub projects
Sub-projects by default will install esm.sh packages in the specified main repository. 
This option can be changed.

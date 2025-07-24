# Config

Bonita requires a config folder in the root directory `./config`. It should have a `./config/main.json` file as the sole or main development project or repository.
Sub or external directories should feature a `./config/sub.json` file.

### Imports
The configuration file can sometimes become large, therefore you can extend the configuration by importing other JSON files.
```json
{
   "someFeature": "import /path/to/some-feature.json"
}
```

### Mandatory settings
```javascript
{
  "project-name: "",                                    // The name of the project or sub project
  "main-project-dir": "../main-project-dir",            // Only required for sub-projects 
  ...  
}
```
### Invalidation
```javascript
{
  "invalidation" :{
     "enable" : true,                                  // true | false
     "include-extensions": ["js", "css"],              // Finds extensions using {{ _hash }} 
     "hash-type" : "xxh3",                             // xxh3 | CRC32 | xxh32
     "update": "changes-only"                          // changes-only | all | ["js", "css", ...others] 
  }
}
```

### Site Structure 
Choose what determines the structure of the website by default:
- site
- content
- processors
```js
{
  "site-structure": "site"
}
```


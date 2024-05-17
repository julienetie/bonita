# Structured Generation
There are two ways to define a site: 
- File-system Generation: Create a file-system representation of the site
- Structured Generation: Create a schema that each article and path component adheres to

Structured generation allows you to define a schema for article metadata so that unstructured articles ccan be structured when built.
This is ideal for creating blogs and other generative site structures.

### Structured site formation
- FS generation is default formation. To create a full structured site e.g. blog use "structured" within config.formation.

```
"formation" : {
   "rootType" : "fs" | "structured"
}
```

## Partially structured site formation
To create a structured paths within an fs formation, define a `<slug>.struct.json` file at any desired FS path. 
```bash
/site
   /blog/
      /company-blog.struct.json
 ```

You can feature as many structured paths as needed.
...

### Defining a schema
The schema is defined in _config_ when _config.formation.rootType_ is structured and defined in paths by placing `<slug>.struct.json` at the chosen parent directory.
Both types of schemas use the same syntax.

```javascript
{
   "struct": "blog",               // Name the struct 
   "dateFormat": "F/j/Y",          // ISO 8601, RFC 2822 and Unix Timestamp support
   "timeFormat": "H/i",            // ISO 8601, RFC 2822 and Unix Timestamp support
   "title": "My blog",             // Mandatory page variable
   "categories": {
     ...                           // Nested object categories terminated by null
   },
   "permalink":  “/[$_locale]/[dateFormat]/[categories:nested]/[title]/”,
   "processor-map: {
         "[$_locale]": "loaleProcessor",
         "[dateFormat]": "listPageProcessor",
         "[title]": "articleProcessor",
         "[categories::nested]": "listPageProcessor",
   }
}
```
The main job of a processor in regards to a struct is to incorporate partials to build the desired page.


#### Slashes in dateFormat
#### Slashes in timeFormat
#### ::nested directive 
#### ::0 , ::1, ::2 ...
#### [] brackets


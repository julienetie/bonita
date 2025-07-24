# Structured Generation
There are two ways to define a site: 
- File-system Generation: Create a file-system representation of the site
- Structured Generation: Create a schema that each article and path component adheres to

Structured generation allows you to define a schema for article metadata so that unstructured articles can be organized when created.
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
   "permalink":  “/[$_locale]/[dateFormat]/[categories:nested]/[title]/”,  // Defines the structure of the site generation
   "processorMap: {
         "[$_locale]": "loaleProcessor",
         "[dateFormat]": "listPageProcessor",
         "[title]": "articleProcessor",
         "[categories::nested]": "listPageProcessor",
         // or
         "[categories::2]": "thirdLevelProcessor",  // Targets all 3rd level categories
         //
         "[categories.fruits.apples]", // Specifically targets the apples categories  
   }
}
```
The main job of a processor in regards to a struct is to incorporate partials to create the desired HTML page.
The page can be an article, multiple articles, a list, excerpts, there is not limitations. Any type of static blog can be created using a struct.

#### Required metadata
With the exception of permalink and processorMap, all keys included in the struct are required for each post. 

#### Auto data
When creating an article post, by putting "auto" as the value for "dateFormat" and "timeFormat" and enabling _config.structured.allowAutoDateAndTime as true.

#### Variants (list)
Variant data is defined in the config, beginnign with an underscore. A variant list can be included using $_variant_name.



#### Slashes in dateFormat
#### Slashes in timeFormat
#### ::nested directive 
#### ::0 , ::1, ::2 ...
#### categories.zero.one.two.three...
#### [] brackets
A bracked indicates a variant-list or nested object. It also serves as the variable passed down for relative paths.


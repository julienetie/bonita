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
To create a structured paths within an fs formation, define a `slug.struct.json` file at any desired FS path. 
```bash
/site
   /blog/
      /company-blog.struct.json
 ```

You can feature as many structured paths as needed.
...


<img src="https://github.com/julienetie/bonita/assets/7676299/f08eb4e0-4e96-4d4f-a512-cc1e1415f462" width="400">

## Bonita is a software development kit for the Web

### What does it do
Bonita is an HTML architecting software development kit for generating websites and web applications.
You can think of Bonita as the foundation for creating any modern application that is served as HTML as:

- Single Page Applications
- Multi Page Applications
- Hybrid Applications

Bonita can be used as a standalone development tool kit or in conjunction with other front-end and backend solutions.

### Project size
Bonita can be used for single paged hobby websites to large-scale web applications encompassing hundreds of repositories or projects.
Bonita's has the ability to consolidate mutliple projects, ensuring teams can collaborate securely with minimal duplication 
and technical debt.

### Features
- Content management
  - Article management
  - Microcopy management
- Static site generation
  - Filed based SSG
  - Programatic SSG
- Variable path components _(E.g. localization, dynamic product pages)_
- HTML injection
- HTML transformers
- Resource injection and cache invalidation (CSS, JS etc)
- Import Maps management
- JavaScript batching
- Browser dependency management system
- Dual-role HTML templates for dynamic pages
- Path based variable inheritance
- Headless and template rendering
- Sub-project consolidation _(Integrating multiple projects into one)_


#### Front-End Integration
Bonita seamlessly integrates with vanilla JavaScript as well as popular front-end frameworks such as React, Vue, and Angular. This flexibility allows developers to enhance their user interfaces regardless of their preferred front-end technology.

#### Back-End Integration
Bonita works alongside various back-end technologies, including Node.js, Go, PHP, Python, and Rust, making it a versatile choice for a wide range of web development projects.

### How does it work?
```
[Content] -------------------|                          |---[path-component-0]------[Processor]------[final-HTML] 
                             |                          |
[File-system site]-----------|------[[Site paths]]------|---[path-component-1]------[Processor]------[final-HTML] 
                             |                          | 
[HTML partials]--------------|                          |---[path-component-2]------[Processor]------[final-HTML] 
```


- You structure a website or web application using folders and HTML files.
- You can optionally structure the entire website or parts of it based on metadata from posted content in a blog-like fashion.
- Dynamically served pages (Node.js/PHP) share HTML content from .bridge.html templates with the front-end.
- **HTML transformers, known as "Processors," are utilized to programmatically transform and generate different types of pages from existing data or content for a desired path**
- HTML partials can be injected and nested. Processors importing partials can allow you to create any layout imaginable.
- JavaScript modules are specified using Import Maps, which are also employed to download and specify browser dependencies.
- Utilize any front-end JavaScript framework or any backend programming language as needed without excessively complicating your application.
- Variable path components enable dynamic generation of lists of parent pages with different variants, such as localization variants of the entire website or product page variants.

Bonita takes a minimalst approach to creating complex applications. One of the most powerful aspects of Bonita is the ability to use a function to modify or generate any page or set of pages
at any part of the application.

### What is a Processor
A processor is a JavaScript or TypeScript function used to intercept paths, text content, and pages to customize how HTML is rendered. Most of the logic involved in creating a website or web application in Bonita will be in the form of processors. There is no extensive API, as you can manipulate HTML using JavaScript or TypeScript. HTML manipulation in Bonita is done through string manipulation in JavaScript or TypeScript. Processors are executed using the Deno JavaScript runtime.

### Creating efficinet websites at scale
Import Maps allow for almost seamless development. When a JavaScript file is changed, a hash is created for invalidation based on the content of the file. Changes are only reflected in the distributed file and Import Maps that reference the URL. Because only one file changes at a time, the number of JavaScript files within a codebase will likely have a negligible effect on development speeds.

When codebases become highly modular, production builds will benefit from batching files to reduce the number of modules in the distribution, thereby reducing the number of HTTP requests for the user. Bonita features the ability to batch JavaScript and TypeScript files when production performance becomes a concern.

### The state of Bonita
Bonita is work in progress, please reach out if you are intrested in collaborating.

MIT © Wavefront, Julien Etienne 2024

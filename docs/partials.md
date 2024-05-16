# Partials

A partial is simply an HTML file with the following features: 
- Data selectors
- Path variables
- IF
- Switch
- Nominators

Partials use the .html file extension and typically should not require additional syntax highlighting beyond HTML. 

## Where are partials stored?
Partials are stored in `./src/partials/` and can be organized into subdirectories.

## Placeholders 
A placeholder is defined using `{{ }}` selectors and variables can be used within a placeholder to render constant and dynamic textual content.

## Selectors
Selectors can locate content and configuration data on the file system. Forward slashes are used to locate files, dots are used to access objects, and bracket notation [] is used to access arrays. Bracket notation can also be used to dynamically access any part of a selector.

`{{ ./config/config.json._custom_key.nested_key[2] }}`

The `$` symbol is shorthand for accessing _config.json_ and is equivalent to the above.

`{{ $._custom_key.nested_key[2] }}`

The `@` is shorthand for accessing _./content/_.

`{{ @[_path_0]/about/team-ui.intro }}`

The `%` is shorthand for accessing _./src/partials/_.

`{{ %common/footer }}`

## Using processors with selectors 
The `|` symbol is used to pipe the content of a selector to a given processor.

`{{ %layouts/sidebars/left/large | process-sidebars/stickySidebar }}`

You can pipe multiple processors.

## Constants
Constants are passed down by route. Each path component represents a variable. 

For example, if the page "grape" has the following route path:

`/one/two/three/apple/mango/grape/`

It will have the following constants:
- _protocol: https://
- _subdomain: subdomain
- _sld: example
- _tld: com
- _domain: example.com
- _origin: https://github.com
- _path_0: one 
- _path_1: two
- _path_2: three
- _path_3: apple
- _path_4: mango
- _path_5: grape
- _current: <current-page>

## Nominators 
A nominator is syntax that wraps HTML content to allow it to be identified by a processor. It begins with `$[` and ends with `]`.
A nominator can be identified by index, relative to the number of nominators in the document, or by name. 

`$[<h1>Hello World</h1>]` Nameless nominator which can be accessed within a processor by its index.

`$[greeting <h1>Hello World</h1>]` Named nominator which can be accessed by both index and name within a processor.

Nominators are also used for including and excluding content using partial conditional statement syntax.

## Conditional statements 
The IF keyword evaluates a statement. If the statement is true, all nominators with a + will be included, and all nominators with a - will be excluded.
The reverse applies if the statement is false. The statement is treated as JavaScript.

`$[IF 2 + 3 >= 4]`

After the IF statement content can optionally be included using nominators with the + or - syntax. 

`$[+ <h2>The answer is true</h2>]`

`$[- <h2>The answer is false</h2>]`

`$[<h2>This will always show </h2>]`

The IF statement does not need to be terminated, it will condition + and - nominators until another IF statement is declared. 

Inline IF statements can also be used for ternary statements.

`$[IF 2 - 3 > 0 ? "This is false" : "This is true"]`

Switch statements can be used as follows: 
 ```html
$[SWITCH fruit]
$["apple": <div>Apple</div>]
$["banana": <div>Banana</div>]
$["orange": <div>Orange</div>]
$[default: <div>All fruits</div>]

 ```
Default is a keyword which renders if there are no matches. Switch statements need have no spaces and are terminated by the last space
or a comment of any kind.

> ### Custom variables
> Variables are not defined within partial documents; they should be defined in config and can be made to be directly or dynamically accessible.

## Page Partial 
A page is a partial that lives in the `./src/site/` subdirectory. Pages behave equivalently to partials located in `./partials/`. 
- `root.html` is the root page of the site and must be located at `./site/root.html`
- `some-file.html` will be built as a directory named `/some-file/` using an index.html file.
- `index.html` is treated as standard and served as the index page of it's directory. 

## Bridge Template
A bridge template functions similarly to a regular page but serves a distinct purpose.

- A bridge template is designed to be processed by the backend (and optionally the frontend).
- Its primary role is to represent the initial state of the page for SEO purposes, at a minimum.
- The backend platform is responsible for populating certain placeholders within the template.

The main advantage of a bridge template is that it allows the HTML for the backend to be managed within the frontend system, standardizing the context in which the HTML is handled.
Bridge templates are for dynamic pages that will be rendered by a backend platform.

- A dynamic path can feature one or several bridge templates. 
- A bridge template should be suffixed with bridge. 

`some-file.bridge.html`

The ampersand symbol should be used to denote a dummy placeholder to be replaced by the backend: 

`{{ &total-value }}`

Other values referencing the file system will be rendered as normal.

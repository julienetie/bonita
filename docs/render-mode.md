# Render Mode 
Bonita has who modes for rendering HTML:

- **Template rendering**: Generates static HTML from partials and processors.
- **Headless rendering**: Generates static HTML and renders the JavaScript in a headless browser (Chrome).

Template rendering is the fastest mode which is also the default mode. It does not render JavaScript.
Headless rendering is enabled by setting `.headless = true` for page processors. 

Headless rendering is processed after all static templates have been generated.

All pages can have headless rendering by setting `config.rendering.headless` to true or by specifying a whitelist of pages to include.


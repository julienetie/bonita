# Contributing

The Bonita project welcomes and encourages developers of all levels and experiences to contribute in any way possible. If you have any questions or hesitations please get in touch [j8@envidia.io](mailto:j8@envidia.io)

## Code of culture
- Aim to welcome new contributors and those who raise issues
- Being helpful **>** being condescending
- Your humbleness **>** how smart you want to prove you are 
- **Take ownership and resolve any disputes with class like a professional**
- Don't be afraid to ask questions, this is not your workplace nobody is getting fired :)
- Be patient, everyone has different schedules and various affairs to manage behind closed doors
- Remember that English is not everyone's first language, try to be understanding if something may come off as a little vague
- Try to remember to thank people for their help
- Don't be a dick 
- _(If I missed something out let me know)_

## Style

### ESLint
Use
```
npm run lint
```
Or to fix
```
npm run lint:fix
```
Bonita uses [StandardJS](https://standardjs.com/).

### Functions 
- Prefer [Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- But of course use generators ([function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)) when needed
- Avoid context if possible e.g. [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind), etc
- Avoid [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) if possible.

### Comments 
Follow [this short guide](https://github.com/vanslang/conventions/blob/main/comments.md) for commenting

## Project Management
You can follow the project management boards [here](https://github.com/users/julienetie/projects/4)

## Submitting changes
1. [Fork it](https://help.github.com/articles/fork-a-repo/)
2. Install dependencies (`npm i`)
3. Install Bonita globally (`npm i -g`
4. Checkout `dev` `npm checkout dev`
5. Create your feature branch (`git checkout -b my-new-feature`)
7. Test your changes and ensure all tests are passing (`npm test`)
6. Commit your changes (`git commit -am 'Added some feature'`)
8. Push your branch to remote (`git push origin my-new-feature`)
9. [Create new Pull Request](https://help.github.com/articles/creating-a-pull-request/)

## Mock directories 
You need to clone [bonita-mock](https://github.com/julienetie/bonita-mock) into your `bonita` directory before you can begin to develop.

## Contributors List 
Your name will be added to the contribution list for any efforts, _(even if your contribution doesn't make it to the main branch)_

Thanks for making it this far. Now try submitting a PR :)

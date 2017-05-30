# smashcast-common

This repository contains Gulp-based common tasks to make applications easier.

You can overwrite any task if you redefine it in your project's `gulpfile.js`.

Optionally you can create a `tasks.config.js` file which is for override the default task settings.

## Install

*Add your project's git remote before installing smashcast-common. This is required to generate default readme for your project.*

```sh
$ npm i -D smashcast-common
```

A number of files that help keeping a standard accross smashcast-common host projects, will automatically copied to the host project.
Note if any file already exists, the post-install will issue corresponding warnings.

## Configuration

### package.json

#### main

_The main field is a module ID that is the primary entry point to your program. That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module's exports object will be returned._

_This should be a module ID relative to the root of your package folder._

Set the main property to ```lib/index.js```, if you changed the distFolder in your config file, use your folder name instead of lib.


### Sample config file. 

This file is optional!

These are the default values:

```javascript
// tasks.config.js

module.exports = {
  app: {
      buildPattern: '!(*.spec).js',
      testPattern: '*.spec.js',
  },
  stylesheets: {
      buildPattern: '*.scss',
  },
  srcFolder: 'src',
  distFolder: 'lib',
  testsFolder: 'tests', // For integration and e2e tests
  targetBuild: 'browser', // browser / node
};
```

#### targetBuild

Test task will be configured based on this property.

browser: Karma will run the tests in a browser (PhantomJS by default).
node: Server side testing with Mocha.

Default value is browser.

### Sample gulpfile

```javascript
// gulpfile.js

const gulp = require('gulp');
const smashcastCommon = require('smashcast-common');

smashcastCommon.setDefaultTasks(gulp);

// Optional override or additional task
// gulp.task('freeze', _ => console.log('Do some freezing'))

// With nothing overriden, all smashcast host projects support:
// lint, lint:JS, lint:CSS, nsp, ncu, test, server, build and clean
```

## Contributing to this project

### Git Commit Message Conventions

With this repository, we follow the angular's contributing guide. 
Every time you do a commit, a script will validate your message, and can prevent wrongly formatted commits.

More info, examples: 
https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y

### Changing any of template/default files

All changes to smashcast-common template files must be marked as "BREAKING CHANGE" in the git commit footer describing what has changed and how client projects may update their existing files.

### New template/default files

While also new files should be marked as breaking changes, if the client does not have that file yet, the post-install will still copy it automatically and the client project will not need to make any manual changes.

## Gulp tasks

### Test
Run all the tests found in the codebase using Karma for frontend testing or mocha for node testing.
Define your environment in config file (targetBuild).

*Usage*

Run unit tests once

```bash
gulp test
```

Run unit tests continuously, on any src file change

```bash
gulp test:unit:watch
```

Run integration/e2e tests once

```bash
gulp test:integration
```

Run unit tests continuously, on any src file change

```bash
gulp test:integration:watch
```


Create test coverage into reports folder

```bash
gulp test:coverage
```

Run coverage, unit and integration/e2e tests once

```bash
gulp test
```

### Lint

You can run separately or both javascript and style lint tasks.

To make lint tasks pass even if you have an error, use `--relax` parameter. (`gulp lint --relax`)

both

```bash
gulp lint
```

js

```bash
gulp lint:JS
```

style

```bash
gulp lint:CSS
```

### NCU

Check if your dependencies have a new version.

```bash
gulp ncu
```

### NSP

Check if any of your dependencies have a known vulnerability.

```bash
gulp ncu
```

### Build

It is used to build JavaScript files. It uses Babel to compile ES6 code to ES5. It creates separate files in the build target directory.

The target directory is cleared before every build.

*Usage*

```bash
gulp build
```

Run it continuously, on any src file change

```bash
gulp build:watch
```

### Release

Release your library.

**Commit your changes before running this task.**

1. Run lint and test tasks
1. Create build
1. Update package version - version number detected by commit messages
1. Generate changelog from commit messages
1. Update version number in readme file
1. Commit and push everything with the new version tag
1. Post a message to #dev channel on slack with the version number and a link to the changelog

*Usage*

```bash
gulp release
```

### Test-Servers

By default http and https servers will be created for frontend projects.
Port numbers and other options can be changed through the config.
Please see config.js for the default options.

*Usage*

```bash
gulp server
```
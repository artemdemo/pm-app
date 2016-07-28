[Русская версия](readme-ru.md)

# Project Management App

Open Source Project Management app.

Work in progress. There is still much to be done.

## Getting started

Install all npm packages and dependencies

```
$ npm i && tsd i
```

Compile client app

```
$ npm run build
```

You can build uglified version of the code:

```
$ npm run pack
```

You also can pack with mangle (keep variable names):

```
$ npm run pack-with-mangle
```

Start server

```
$ npm start
```

In development use `watch` command

```
$ npm run watch
```

You can proactively run tslint code style check (it will run automatically before each commit)

```
$ npm run tslint
```

## e2e tests

Download the latest version of selenium server and chromedriver (which will be needed for running tests in Chrome browser)

```
$ npm run e2e-setup
```

Run e2e tests

```
$ npm test
```

More [about e2e tests](docs/e2e.md)

## Technologies

* ReactJS - https://facebook.github.io/react/
* Bootstrap css - http://getbootstrap.com/
* Hapi.js - http://hapijs.com/

## Compilation

I'm using webpack with some plugins



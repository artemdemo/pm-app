[Русская версия](https://github.com/artemdemo/pm-app/blob/master/readme-ru.md)

# Project Management App

Open Source Project Management app.

Work in progress. There is still much to be done.

## Getting started

Install all npm packages and dependencies

```bash
$ npm i && tsd i
```

Compile client app

```bash
$ npm run build
```

You can build uglified version of the code:

```bash
$ npm run pack
```

You also can pack with mangle (keep variable names):

```bash
$ npm run pack-with-mangle
```

Start server

```bash
$ npm start
```

In development use `watch` command

```bash
$ npm run watch
```

You can proactively run tslint code style check (it will run automatically before each commit)

```bash
$ npm run tslint
```

Run e2e tests

```bash
$ npm test
```

## Technologies

* ReactJS - https://facebook.github.io/react/
* Bootstrap css - http://getbootstrap.com/
* Hapi.js - http://hapijs.com/

## Compilation

I'm using webpack with some plugins



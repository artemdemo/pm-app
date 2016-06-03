[Русская версия](https://github.com/artemdemo/pm-app/blob/master/readme-ru.md)

# Project Management App

Open Source Project Management app.

Work in progress. There is still much to be done.

## Getting started

Install all modules and dependencies

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
$ npm run e2e
```

If you want to update Angular 2 and it's dependencies run:

```bash
$ ./update-angular.sh
```


## Technologies

* Angular 2 - https://angular.io/
* Bootstrap css - http://getbootstrap.com/
* Hapi.js - http://hapijs.com/

## Compilation

I'm using webpack with typescript plugins


## Typescript typings

I'm using `tsd` CLI to add missing types for typescript.

This is how you install CLI and missing type definition files:

```
npm install tsd --global
tsd init
tsd install es6-shim --save
tsd install require --save
```

But you don't need it since there is `typings.json` in the project, you only need to run `$ typings i`

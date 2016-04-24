[Русская версия](https://github.com/artemdemo/pm-app/blob/master/readme-ru.md)

# Project Management App

Open Source Project Management app.

Work in progress. There is still much to be done.

## Getting started

Install all modules and dependencies

```
$ npm i && typings i
```

Compile client app

```
$ npm run build
```

You can build uglified version of the code:

```
$ npm run pack
```

But there is some problem with minifying angular 2 code.
Therefore for now I'm using minifying without mangling. 
See comment by Igor Minar according to this issue: https://github.com/angular/angular/issues/6380#issuecomment-203247147

In any case you can try to pack it with mangle and see if it starts working:

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

If you want to update Angular 2 and it's dependencies run:

```
$ ./update-angular.sh
```


## Technologies

* Angular 2 - https://angular.io/
* Bootstrap css - http://getbootstrap.com/
* Hapi.js - http://hapijs.com/

## Compilation

I'm using webpack with typescript plugins


## Typescript typings

I'm using `typings` CLI to add missing types for typescript.

This is how you install CLI and missing type definition files:

```
npm install typings --global
typings install es6-shim --ambient --save
typings install require --ambient --save
```

But you don't need it since there is `typings.json` in the project, you only need to run `$ typings i`

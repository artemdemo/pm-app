[Русская версия](readme-ru.md)

# Project Management App

Open Source Project Management app.

Work in progress. There is still much to be done.

![alt tag](https://github.com/artemdemo/pm-app/blob/master/img/pm-tasks.png)

![alt tag](https://github.com/artemdemo/pm-app/blob/master/img/pm-scrum.png)

![alt tag](https://github.com/artemdemo/pm-app/blob/master/img/pm-projects.png)

## Getting started

First of all you need to run following command:
(it will install all dependencies and copy all needed files after that)

```
$ npm i && npm run build
```

Then run the server:

```
$ npm start
```

And start watching files:

```
$ npm run watch
```

This is it, you are ready to go.

## All npm commands

Install all npm packages and dependencies

```
$ npm i
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

You can proactively run eslint code style check (it will run automatically before each commit)

```
$ npm run eslint
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



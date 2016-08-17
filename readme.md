[Русская версия](readme-ru.md)

# Project Management App

Open Source Project Management app.

Work in progress. There is still much to be done.

![alt tag](https://github.com/artemdemo/pm-app/blob/master/img/pm-tasks.png)
---
![alt tag](https://github.com/artemdemo/pm-app/blob/master/img/pm-scrum.png)
---
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

This is it, you are ready to go, open http://localhost:8000/signup and create your first user.

[All npm commands](docs/npm.md)

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

## Main technologies

* ReactJS - https://facebook.github.io/react/
* Redux - http://redux.js.org/
* Bootstrap css - http://getbootstrap.com/
* Hapi.js - http://hapijs.com/
* Webpack - https://webpack.github.io/
* Nightwatch - http://nightwatchjs.org/
* Gulp - http://gulpjs.com/
* Less - http://lesscss.org/
* Babel - https://babeljs.io/ 

## Compilation

I'm using webpack with some plugins



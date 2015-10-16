(Русская версия)[https://github.com/artemdemo/pm-app/blob/master/readme-ru.md]

# Project Management App

Open Source Project Management app. It's more scrum then kanban, case I believe in sprints and iterations :smile:


## Technologies

* AngularJS v.1.4.6 (with TypeScript v.1.6)
* Laravel v.5.1.11
* Foundation for grid and design

![alt tag](https://github.com/artemdemo/pm-app/blob/master/_img/pmapp.png "Project Management App")

## Installation

Obviously you'll need PHP, MySQL and Apache installed on your machine.

### Front end

I'm using Gulp as task manager.

1. Install all related packages
```
$ npm install
```

2. Build the app
```
$ gulp
```

You can also use build in livereload:
```
$ gulp serve
```

### Back end

1. Create database with relevant name

2. Inside of `/api` create your `.env` file based on `.env.example`

3. Then run following commands:

Create all tables
```
$ php artisan migrate
```

## Tests

For frontend unit tests I'm using karma with jasmine.
All test are written in es2015 (es6) and compiled on the fly 5to6 with babel.


Run tests:
```
$ gulp test
```

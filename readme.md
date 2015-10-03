(Русская версия)[https://github.com/artemdemo/pm-app/blob/master/readme-ru.md]

# Project Management App

Open Source Project Management app. It's more scrum then kanban, case I believe in sprints and iterations :smile:


## Technologies

* AngularJS v.1.4.6 (with TypeScript v.1.6)
* Laravel v.5.1.11

## Installation

### Front end

1. Install all related packages
```
$ npm install
```

2. Build the app
```
$ gulp
```

### Back end

1. Create database with relevant name

2. Inside of `/api` create your `.env` file based on `.env.example`

3. Then run following commands:

Create all tables
```
$ php artisan migrate
```

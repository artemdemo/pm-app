# Project Management

Open Source Project Management system. It's more scrum then kanban, case I believe in sprints :)


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
$ gulp build
```

### Back end

1. Create database with relevant name

2. Inside of /api folder run following commands:

Create all tables
```
$ php artisan migrate
```

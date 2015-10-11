(English version)[https://github.com/artemdemo/pm-app/blob/master/readme.md]

# Приложение для управления проектоми и задачами

Приложение для управления проектами и задачами. Это больше скрам, нежели канбан,
потому что я доверяю спринтам и итерациям :smile:


## Технологии

* AngularJS v.1.4.6 (with TypeScript v.1.6)
* Laravel v.5.1.11

![alt tag](https://github.com/artemdemo/pm-app/blob/master/_img/pmapp.png "Приложение для управления проектоми и задачами")

## Инсталляция

### Front end

1. Устанавиваем покеты
```
$ npm install
```

2. Собираем приложение
```
$ gulp
```

Вы также можете использовать встроенный лайврелоад
```
$ gulp serve
```

### Back end

1. Создаем базу данных с релевантным именем

2. Внутри папки `/api` создаем файл `.env` на базе `.env.example`

3. После этого запускаем команды:

Создаем таблицы в базе данных
```
$ php artisan migrate
```

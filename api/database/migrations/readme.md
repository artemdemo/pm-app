# Migration files

Create new migration file

```
php artisan make:migration create_users_table
```

or with table name, if known

```
php artisan make:migration add_votes_to_users_table --table=users
```

Migration command 

```
php artisan migrate
```

## Documentation

(http://laravel.com/docs/5.1/migrations)[http://laravel.com/docs/5.1/migrations]
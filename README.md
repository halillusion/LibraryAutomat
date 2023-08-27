# LibraryAutomat | Library Automat with Express, Sequelize & MySQL

A library automat.

## Requirements

- Node.js >= 8.9.4
- MySQL >= 5.6

## Documentation

This documentation has been created to give you a quick start.

### Installation

- `npm install`
- `npm run start`
- Visit http://localhost:3000

### .env

```
DB_HOST: localhost
DB_USER: root
DB_PASS:
DB_NAME: library_automat
DB_SYNC: false
```

If you want to migrate the database and import the inital data, set `DB_SYNC` to `true` and restart the project.

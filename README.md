## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Typeorm migration

```bash
# entity가지고 migration file 생성하기
$ npm run migration:generate database/migrations/migration file name

# migration적용하기
$ npm run migration:run:dev

# migration 적용 prod
$ npm run migration:run:prod

# entity추가 전에 개발 db가 현재 migration파일을 반영하고 있는지 확인하고
# 새 migration file을 생성하자
```

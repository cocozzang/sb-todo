#!/bin/bash

source .env.test

psql() {
  docker exec -it test-db psql -U $POSTGRES_USER -d $POSTGRES_DB -p $POSTGRES_PORT || {
    echo "test-redis container에 연결 할 수 없습니다. 실행중인지 확인해보세용."
    exit 1
  }
}

redisCli() {
  docker exec -it test-redis redis-cli -a $REDIS_PASSWORD -p $REDIS_PORT || {
    echo "test-redis container에 연결 할 수 없습니다. 실행중인지 확인해보세용."
    exit 1
  }
}

if [ "$1" == "db" ]; then
  psql
elif [ "$1" == "redis" ]; then
  redisCli
elif [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo -e "실행중인 docker container에 접근하는 shell script입니다.\n /connect.sh [docker compose service] >> Ex) ./connect.sh db"
  exit 1
else
  echo "./connect.sh [--help | -h]"
  exit 1
fi

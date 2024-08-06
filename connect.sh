source .env.dev

psql() {
  container_id=$(docker compose --env-file .env.dev ps -q db) || {
    echo "Error getting db container ID"
    exit 1
  }
  docker exec -it $container_id psql -U $POSTGRES_USER -d $POSTGRES_DB || {
    echo "Error connecting to PostgreSQL container"
    exit 1
  }
}

redisCli() {
  container_id=$(docker compose --env-file .env.dev ps -q redis) || {
    echo "Error getting redis container ID"
    exit 1
  }
  docker exec -it $container_id redis-cli -a $REDIS_PASSWORD || {
    echo "Error connecting to Redis contaner"
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
fi

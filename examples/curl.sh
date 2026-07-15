#!/usr/bin/env sh
set -eu

: "${MAOLAO_API_KEY:?请先设置 MAOLAO_API_KEY 环境变量}"

BASE_URL="${MAOLAO_BASE_URL:-https://maolaoapi.com}"

curl --request POST "${BASE_URL}/v1/images/tasks" \
  --header "Authorization: Bearer ${MAOLAO_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "gpt-image-2",
    "prompt": "一只坐在月球上的橘猫，电影级光影",
    "n": 1,
    "size": "1024x1024",
    "quality": "high",
    "response_format": "b64_json"
  }'

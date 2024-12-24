#!/usr/bin/env sh

curl --request POST \
  --url http://localhost:8080/api/users \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.0.0' \
  --data '{
	"username": "username",
	"password": "P4ssword",
	"email": "test@test.com"
}' | jq
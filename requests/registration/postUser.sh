#!/usr/bin/env sh

curl --verbose \
  --request POST \
  --url http://localhost:8080/api/users \
  --header 'Content-Type: application/json' \
  --data '{
	"username": "username",
	"password": "P4ssword",
	"email": "test@test.com"
}' | jq
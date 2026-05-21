#!/usr/bin/env bash
BASE="http://host.docker.internal:8081"

echo "GET $BASE/api/cities"
curl -s "$BASE/api/cities" | jq '.'

echo
echo "POST $BASE/api/cities/price"
curl -s -X POST -H 'Content-Type: application/json' -d '{"sourceId":"1","destinationId":"2","type":"TRAIN"}' "$BASE/api/cities/price" | jq '.'

echo
echo "POST $BASE/api/bookings/book"
curl -s -X POST -H 'Content-Type: application/json' -d '{"type":"TRAIN","source":"New Delhi","destination":"Mumbai","date":"2026-06-01","userEmail":"test@example.com","price":100,"passengerName":"Test","passengerAge":30}' "$BASE/api/bookings/book" | jq '.'

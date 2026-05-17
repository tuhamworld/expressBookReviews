curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"John","password":"12345"}'

curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"John","password":"12345"}' \
  -c cookie.txt

curl -X PUT "http://localhost:5000/customer/auth/review/1?review=This%20book%20is%20cool" \
  -b cookie.txt

curl -X DELETE "http://localhost:5000/customer/auth/review/1" \
  -b cookie.txt
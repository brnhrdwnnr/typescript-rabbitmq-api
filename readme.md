npm init -y
npm install express amqplib @types/node ts-node typescript
npm install --save-dev @types/express @types/amqplib

npx ts-node src/index.ts

Sending a Message: 

curl --location --request POST 'http://localhost:3000/send' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=4E5C7D6F60C3288C3156E928FC9F57D9' \
--data-raw '{"message": "Hello, RabbitMQ!"}'

Receiving a Message: 

curl --location --request GET 'http://localhost:3000/receive' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=4E5C7D6F60C3288C3156E928FC9F57D9'

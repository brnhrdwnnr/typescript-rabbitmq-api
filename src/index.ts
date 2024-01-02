import express, { Request, Response } from 'express';
import amqp from 'amqplib/callback_api';

const app = express();
const port = 3000;

const rabbitMQUrl = 'amqp://agreement:agreement@localhost';

app.use(express.json());

amqp.connect(rabbitMQUrl, (err: any, connection: amqp.Connection) => {
  if (err) {
    console.error('Error connecting to RabbitMQ:', err.message);
    process.exit(1);
  }

  connection.createChannel((channelErr: any, channel: amqp.Channel) => {
    if (channelErr) {
      console.error('Error creating RabbitMQ channel:', channelErr.message);
      process.exit(1);
    }

    const queueName = 'messages';
    channel.assertQueue(queueName, { durable: false });

    app.post('/send', (req: Request, res: Response) => {
      const message = req.body.message;

      if (!message) {
        res.status(400).send('Message is required');
        return;
      }

      channel.sendToQueue(queueName, Buffer.from(message));
      res.send('Message sent to RabbitMQ');
    });

    app.get('/receive', (req: Request, res: Response) => {
      channel.get(queueName, { noAck: true }, (consumeErr, msg) => {
        if (consumeErr) {
          console.error('Error consuming message from RabbitMQ:', consumeErr.message);
          res.status(500).send('Error receiving message from RabbitMQ');
        } else if (msg) {
          res.send(`Received message from RabbitMQ: ${msg.content.toString()}`);
        } else {
          res.send('No messages in the queue');
        }
      });
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });
});

import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/app/users', (req, res) => {
  res.send(req.body);
});

export default app;
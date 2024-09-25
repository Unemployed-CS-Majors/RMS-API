const express = require('express');
const testRouter = require('./app/routes/test.router');

const app = express();

// Middleware and routes will be added here

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use("/test", testRouter)

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
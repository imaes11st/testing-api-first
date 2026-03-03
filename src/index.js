const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();
const port = 3000;

const swaggerDocument = YAML.load('./openapi.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/hello', (req, res) => {
  res.json({'message': 'Hello, World!'});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


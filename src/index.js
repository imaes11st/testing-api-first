const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OpenApiValidator = require('express-openapi-validator');

const app = express();
const port = 3000;

// Load OpenAPI document
const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// OpenAPI validator
app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerDocument,
    validateRequests: true,
    validateResponses: true,
    ignorePaths: /.*\/docs.*/,
  })
);

// In-memory storage
let users = [
  {
    id: 1,
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 25,
    email: 'jane.smith@example.com'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    age: 28,
    email: 'alice.johnson@example.com'
  }
];

// HELLO
app.get('/hello', (req, res) => {
  res.json({
    message: 'Hello, World!'
  });
});

// CREATE USER
app.post('/users', (req, res) => {

  const { name, age, email } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    age,
    email
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// GET USER BY ID
app.get('/users/:id', (req, res) => {

  const userId = parseInt(req.params.id);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json(user);
});

// UPDATE USER
app.post('/users/:id', (req, res) => {

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({message: 'User not found'});
  }

  const updatedUser = {
    id: userId,
    name,
    age,
    email
  };

  users[userIndex] = updatedUser;

  res.json(updatedUser);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
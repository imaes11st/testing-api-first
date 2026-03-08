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

let products = [
  {
    id: 1,
    name: 'Smartphone',
    description: 'A modern smartphone with a crisp display.',
    price: 750,
    category: 'Electronics',
    tags: ['mobile', 'gadget'],
    inStock: true,
    specifications: {
      color: 'black',
      storage: '128GB'
    },
    rating: [
      { score: 5, comment: 'Excellent phone for the price.' }
    ]
  },
  {
    id: 2,
    name: 'T-Shirt',
    description: 'Comfortable cotton t-shirt.',
    price: 199,
    category: 'Clothing',
    tags: ['casual', 'cotton'],
    inStock: true,
    specifications: {
      size: 'M',
      color: 'blue'
    },
    rating: [
      { score: 4, comment: 'Good quality but runs a bit small.' }
    ]
  }
];

// HELLO
app.get('/v1/hello', (req, res) => {
  res.json({
    message: 'Hello, World!'
  });
});

app.get('/v2/hello', (req, res) => {
  res.json({
    message: 'Hello, World!', version: 'v2', timestamp: new Date().toISOString()
  });
});

// CREATE USER
app.post(['/users', '/v1/users'], (req, res) => {
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
app.get(['/users/:id', '/v1/users/:id'], (req, res) => {
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
app.post(['/users/:id', '/v1/users/:id'], (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age, email } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
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

// PRODUCT ROUTES

// GET ALL PRODUCTS
app.get(['/productos', '/v1/productos'], (req, res) => {
  res.json(products);
});

// CREATE PRODUCT
app.post(['/productos', '/v1/productos'], (req, res) => {
  const { name, description, price, category, tags, inStock, specifications, rating } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    category,
    tags,
    inStock,
    specifications,
    rating
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// GET PRODUCT BY ID
app.get(['/productos/:id', '/v1/productos/:id'], (req, res) => {
  const productId = parseInt(req.params.id);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  res.json(product);
});

// UPDATE PRODUCT
app.put(['/productos/:id', '/v1/productos/:id'], (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, description, price, category, tags, inStock, specifications, rating } = req.body;

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const updatedProduct = {
    id: productId,
    name,
    description,
    price,
    category,
    tags,
    inStock,
    specifications,
    rating
  };

  products[productIndex] = updatedProduct;

  res.json(updatedProduct);
});

// DELETE PRODUCT
app.delete(['/productos/:id', '/v1/productos/:id'], (req, res) => {
  const productId = parseInt(req.params.id);

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('http://localhost:${port}/v1');
  console.log('http://localhost:${port}/v2');
});
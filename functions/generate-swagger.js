// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Name', 
    version: '1.0.0', 
    description: 'API documentation',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Replace with your server URL
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./app/routes/*.js'], // Adjust the path to your route files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
const swaggerYaml = yaml.dump(swaggerSpec);

// Write YAML to a file
fs.writeFileSync(path.join(__dirname, 'swagger.yaml'), swaggerYaml);

console.log('swagger.yaml generated successfully');

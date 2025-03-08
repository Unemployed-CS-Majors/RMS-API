// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'RMS API', 
    version: '1.0.0', 
    description: 'Restaurant Management System API', 
  },
  servers: [
    {
      url: 'https://api-d4o6tbc5fq-uc.a.run.app/',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./app/routes/*.js'], 
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
const swaggerYaml = yaml.dump(swaggerSpec);

// Write YAML to a file
fs.writeFileSync(path.join(__dirname, 'swagger.yaml'), swaggerYaml);

console.log('swagger.yaml generated successfully');

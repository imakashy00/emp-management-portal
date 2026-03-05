const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkBuddy API Docs',
      version: '1.0.0',
      description: 'Advanced Documentation for Employee and Manager Request APIs',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development Server',
      },
    ],
    // Added Security Definition for JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Path to the API docs (pointing to your routers folder)
  apis: ['./routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
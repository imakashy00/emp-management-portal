const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkBuddy API Docs',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:8080' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userName: { type: 'string' },
            email: { type: 'string' },
            mobile: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        PasswordReset: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            newPassword: { type: 'string' }
          }
        }
      }
    }
  },
  // CHANGE THIS LINE: Point to the docs folder YAML files
  apis: ['./docs/*.yaml'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
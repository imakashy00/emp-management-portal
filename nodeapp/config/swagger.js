const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkBuddy API Documentation',
      version: '1.0.0',
      description: 'Fully automated API documentation for WorkBuddy including Leaves and WFH.',
    },
    servers: [
      {
        url: process.env.backend_uri || 'http://localhost:8080',
        description: 'Server URL',
      },
    ],
    paths: {
      /* --- USER ROUTES --- */
      '/api/users/signup': {
        post: {
          summary: 'Register a new user',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
          },
          responses: { 200: { description: 'User added Successfully' } }
        }
      },
      '/api/users/login': {
        post: {
          summary: 'User Login',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
          },
          responses: { 200: { description: 'Login successful' } }
        }
      },
      '/api/users/getAllEmployees': {
        get: {
          summary: 'Get all employees',
          tags: ['Manager Actions'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List returned' } }
        }
      },

      /* --- LEAVE REQUEST ROUTES --- */
      '/api/leaveRequests/apply': {
        post: {
          summary: 'Apply for a new leave',
          tags: ['Leave Requests'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LeaveRequest' } } }
          },
          responses: { 200: { description: 'Leave request submitted' } }
        }
      },
      '/api/leaveRequests/my-leaves': {
        get: {
          summary: 'Get leave history for logged in user',
          tags: ['Leave Requests'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of leaves' } }
        }
      },

      /* --- WFH REQUEST ROUTES --- */
      '/api/wfhRequest/addWfhRequest': {
        post: {
          summary: 'Submit a Work From Home request',
          tags: ['WFH Requests'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WfhRequest' } } }
          },
          responses: { 200: { description: 'WFH request added successfully' } }
        }
      },
      '/api/wfhRequest/status': {
        get: {
          summary: 'Get WFH request status',
          tags: ['WFH Requests'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Status returned' } }
        }
      }
    },

    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userName: { type: 'string', example: 'johndoe' },
            email: { type: 'string', example: 'john@gmail.com' },
            mobile: { type: 'string', example: '1234567890' },
            password: { type: 'string', example: 'password123' },
            role: { type: 'string', example: 'employee' }
          }
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'john@gmail.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        LeaveRequest: {
          type: 'object',
          properties: {
            leaveType: { type: 'string', example: 'Sick Leave', enum: ['Sick Leave', 'Casual Leave', 'Privilege Leave'] },
            startDate: { type: 'string', format: 'date', example: '2023-12-01' },
            endDate: { type: 'string', format: 'date', example: '2023-12-03' },
            reason: { type: 'string', example: 'Feeling unwell' }
          }
        },
        WfhRequest: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date', example: '2023-12-05' },
            reason: { type: 'string', example: 'Home maintenance' },
            status: { type: 'string', default: 'pending' }
          }
        }
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
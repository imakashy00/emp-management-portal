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
            role: { type: 'string', enum: ['manager', 'employee'], default: 'employee' },
            leaves: { type: 'number', default: 25 }
          }
        },

        PasswordReset: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'john@gmail.com' },
            otp: { type: 'string', example: '123456' },
            token: { type: 'string', description: 'Generated reset token' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        ManagerInvite: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'manager@company.com' },
            token: { type: 'string' },
            invitedBy: { type: 'string', description: 'Manager User ID' }
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
            leaveType: { type: 'string', enum: ['Sick Leave', 'Casual Leave', 'PTO', 'Vacation'] },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            reason: { type: 'string', minLength: 10 },
            status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'] },
            file: { type: 'string', format: 'binary' }
          }
        },
        WfhRequest: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            reason: { type: 'string', minLength: 10 },
            status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'] },
            file: { type: 'string', format: 'binary' }
          }
        }
      }
    },
    paths: {
      /* --- USER / AUTH ROUTES --- */
      '/api/users/signup': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
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
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
          },
          responses: { 200: { description: 'Login successful' } }
        }
      },

      /* --- PASSWORD RESET ROUTES (NEW TAG) --- */
      '/api/users/check-email': {
        post: {
          summary: 'Request Password Reset OTP',
          tags: ['Password Reset'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } } } } }
          },
          responses: { 200: { description: 'OTP sent to email' } }
        }
      },
      '/api/users/reset-password': {
        put: {
          summary: 'Reset Password using OTP',
          tags: ['Password Reset'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PasswordReset' } } }
          },
          responses: { 200: { description: 'Password reset successful' } }
        }
      },

      /* --- PROFILE / ME ROUTES --- */
      '/api/users/me': {
        get: {
          summary: 'Get logged in user profile',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/users/update-profile': {
        put: {
          summary: 'Update user profile',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
          },
          responses: { 200: { description: 'Profile updated' } }
        }
      },

      /* --- MANAGER SPECIFIC ROUTES --- */
      '/api/users/getAllEmployees': {
        get: {
          summary: 'Get all employees',
          tags: ['Manager Actions'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List returned' } }
        }
      },
      '/api/users/inviteManager': {
        post: {
          summary: 'Invite a new manager',
          tags: ['Manager Actions'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ManagerInvite' } } }
          },
          responses: { 200: { description: 'Invitation sent' } }
        }
      },
      '/api/users/manager-stats': {
        get: {
          summary: 'Get Manager Dashboard Stats',
          tags: ['Manager Actions'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Stats returned' } }
        }
      },
      '/api/users/employee-stats': {
        get: {
          summary: 'Get Employee Stats',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Stats returned' } }
        }
      },

      /* --- LEAVE REQUEST ROUTES --- */
      '/api/leaveRequests': {
        get: {
          summary: 'Get all leave requests (Manager View)',
          tags: ['Leave Requests'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } }
        },
        post: {
          summary: 'Apply for a leave',
          tags: ['Leave Requests'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/LeaveRequest' } } }
          },
          responses: { 200: { description: 'Applied' } }
        }
      },
      '/api/leaveRequests/{employeeId}': {
        get: {
          summary: 'Get leaves by employee ID',
          tags: ['Leave Requests'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/leaveRequests/{id}/status': {
        patch: {
          summary: 'Update leave status (Manager)',
          tags: ['Leave Requests'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Approved', 'Rejected'] } } } } }
          },
          responses: { 200: { description: 'Status Updated' } }
        }
      },

      /* --- WFH REQUEST ROUTES --- */
      '/api/wfhRequests': {
        get: {
          summary: 'Get all WFH requests (Manager)',
          tags: ['WFH Requests'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } }
        },
        post: {
          summary: 'Apply for WFH',
          tags: ['WFH Requests'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/WfhRequest' } } }
          },
          responses: { 200: { description: 'Applied' } }
        }
      },
      '/api/wfhRequests/{employeeId}': {
        get: {
          summary: 'View WFH requests for specific employee',
          tags: ['WFH Requests'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'employeeId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/wfhRequests/{id}/status': {
        patch: {
          summary: 'Update WFH status (Manager)',
          tags: ['WFH Requests'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Approved', 'Rejected'] } } } } }
          },
          responses: { 200: { description: 'Status Updated' } }
        }
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
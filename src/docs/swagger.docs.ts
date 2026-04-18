import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'VideoGen API',
    version: '1.0.0',
    description: `
    Welcome to the VideoGen API documentation.
  `,
  },
  servers: [
    {
      url: 'https://api.aivideogen.co.in',
      description: 'Prod Server',
    },
    {
      url: 'http://localhost:4000',
      description: 'Local Server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication related endpoints',
    },
    {
      name: 'Template',
      description: 'Template related endpoints',
    },
    {
      name: 'Video',
      description: 'Video related endpoints',
    },
    {
      name: 'Plan',
      description: 'Plan related endpoints',
    },
    {
      name: 'Payment',
      description: 'Payment related endpoints',
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

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ['src/routes/user/*.ts', 'routes/user/*.js'], // Path to the API docs
};

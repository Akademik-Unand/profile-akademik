const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Profil Akademik UNAND',
      version: '1.0.0',
      description: 'REST API web profil Bidang Akademik (multi-unit)',
    },
    servers: [{ url: `http://localhost:${env.port}/api/v1` }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: process.env.COOKIE_NAME || 'pa_token',
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
});

module.exports = spec;

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const corsConfig = require('./config/cors');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const { error: errorResponse } = require('./utils/apiResponse');
const apiRouter = require('./routes');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(cors(corsConfig));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const env = require('./config/env');
app.use('/uploads', express.static(env.uploadDir));
if (process.env.NODE_ENV !== 'test') {
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/health' || req.url.startsWith('/api/docs'),
      },
    }),
  );
}

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK', statusCode: 200, data: { status: 'ok' } });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', apiRouter);

app.use((req, res) => {
  return errorResponse(res, {
    message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
    statusCode: 404,
  });
});

app.use(errorHandler);

module.exports = app;

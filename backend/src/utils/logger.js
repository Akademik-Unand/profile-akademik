const pino = require('pino');
const env = require('../config/env');

const logger = pino({
  level: env.logLevel,
  ...(env.nodeEnv === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        },
      }
    : {}),
});

module.exports = logger;

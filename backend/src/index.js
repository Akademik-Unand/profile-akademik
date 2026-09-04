require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const env = require('./config/env');

async function start() {
  await sequelize.authenticate();
  logger.info('Database connected');

  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

start().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});

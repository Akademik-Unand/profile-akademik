require('dotenv').config();

const common = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || null,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  define: {
    underscored: true,
    timestamps: true,
  },
};

module.exports = {
  development: {
    ...common,
    database: process.env.DB_NAME || 'profile_akademik',
  },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || 'profile_akademik_test',
    logging: false,
  },
  production: {
    ...common,
    database: process.env.DB_NAME,
    logging: false,
  },
};

const sql = require('mssql');

let poolPromise = null;

function getSqlConfig() {
  const {
    AZURE_SQL_SERVER,
    AZURE_SQL_DATABASE,
    AZURE_SQL_USER,
    AZURE_SQL_PASSWORD,
    AZURE_SQL_PORT
  } = process.env;

  if (!AZURE_SQL_SERVER || !AZURE_SQL_DATABASE || !AZURE_SQL_USER || !AZURE_SQL_PASSWORD) {
    throw new Error('Azure SQL environment variables are not fully configured.');
  }

  const port = Number.parseInt(AZURE_SQL_PORT, 10) || 1433;

  return {
    server: AZURE_SQL_SERVER,
    database: AZURE_SQL_DATABASE,
    user: AZURE_SQL_USER,
    password: AZURE_SQL_PASSWORD,
    port,
    options: {
      encrypt: true,
      trustServerCertificate: false
    },
    pool: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
}

async function getAzureSqlPool() {
  if (!poolPromise) {
    const config = getSqlConfig();
    poolPromise = sql.connect(config).catch((err) => {
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

async function closeSqlPool() {
  if (poolPromise) {
    try {
      const pool = await poolPromise;
      await pool.close();
    } finally {
      poolPromise = null;
    }
  }
}

module.exports = {
  sql,
  getAzureSqlPool,
  closeSqlPool
};

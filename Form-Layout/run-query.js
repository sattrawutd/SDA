const sql = require('mssql');
const fs = require('fs');

const config = {
  server: '10.10.10.108',
  user: 'sa',
  password: '1q2w3e4r@',
  database: process.argv[3] || 'SBO_TEST_BOM_1',
  options: { encrypt: false, trustServerCertificate: true },
  connectionTimeout: 10000,
  requestTimeout: 30000
};

async function run() {
  let query = process.argv[2];
  if (!query) {
    console.log('Usage:');
    console.log('  node run-query.js "SELECT TOP 10 * FROM OINV"');
    console.log('  node run-query.js ./path/to/file.sql');
    console.log('  node run-query.js ./path/to/file.sql SBO_Seoul');
    process.exit(1);
  }

  // If argument is a .sql file, read it
  if (query.endsWith('.sql') && fs.existsSync(query)) {
    query = fs.readFileSync(query, 'utf8');
  }

  try {
    const pool = await sql.connect(config);
    console.log(`Connected to [${config.database}]`);
    const result = await pool.request().query(query);
    console.log(`Rows: ${result.recordset.length}`);
    console.table(result.recordset);
    sql.close();
  } catch (err) {
    console.error('Error:', err.message);
    sql.close();
  }
}

run();

const pool = require("./model/db");

async function testConnection() {
  try {
    const result = await pool.query(`
      SELECT current_database() AS database,
             current_user AS username,
             NOW() AS server_time
    `);

    console.log("PostgreSQL connected successfully!");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("PostgreSQL connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();

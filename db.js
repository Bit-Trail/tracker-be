require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function startDbServer(){
    try {
        const result = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("✅ Database connected successfully!");
        const tableNames = result.rows.map(row => row.table_name);
        console.log("📦 Tables found in database:", tableNames);
    } catch (error) {
        console.error("❌ Failed to connect to the database. Server shutting down.");
        console.error(error.message);
        process.exit(1);
    }
}

startDbServer();

module.exports = pool;
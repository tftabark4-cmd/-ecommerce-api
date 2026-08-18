require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
pool.query("SELECT email, LEFT(password_hash,15) as hash_start FROM users WHERE email='rami.odeh@example.com'")
  .then(r => {
    console.log(r.rows);
    process.exit();
  })
  .catch(e => {
    console.error("ERROR:", e.message);
    process.exit(1);
  });
// ============================================
// DATABASE CONFIGURATION - PostgreSQL
// ============================================

const { Pool } = require('pg');
require('dotenv').config();

// Parse DATABASE_URL if provided (Railway), otherwise use individual env vars
let poolConfig;

console.log('[DB Config] Checking environment variables...');
console.log('[DB Config] DATABASE_URL available:', !!process.env.DATABASE_URL);
console.log('[DB Config] PGHOST available:', !!process.env.PGHOST);
console.log('[DB Config] Environment:', process.env.NODE_ENV);

if (process.env.DATABASE_URL) {
    // Railway PostgreSQL connection string (preferred)
    console.log('[DB Config] Using DATABASE_URL from Railway');
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000
    };
    const url = new URL(process.env.DATABASE_URL);
    console.log('[DB Config] Connected to database:', url.pathname.slice(1), 'at', url.hostname);
} else {
    // Local development config or Railway with individual vars
    console.log('[DB Config] Using individual environment variables');
    poolConfig = {
        user: process.env.PGUSER || process.env.DB_USER || 'postgres',
        host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
        database: process.env.PGDATABASE || process.env.DB_NAME || 'railway',
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
        port: parseInt(process.env.PGPORT || process.env.DB_PORT || 5432),
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000
    };
    console.log('[DB Config] Connected to database:', poolConfig.database, 'at', poolConfig.host);
}

// Create connection pool
const pool = new Pool(poolConfig);

// Test connection
pool.connect()
    .then(client => {
        console.log('✅ Database connected successfully');
        console.log('[DB Config] Connection pool established');
        client.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        console.error('[DB Config] Error details:', err.code);
        process.exit(1);
    });

// Handle pool errors
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
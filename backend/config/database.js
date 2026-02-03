// ============================================
// DATABASE CONFIGURATION
// ============================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Parse DATABASE_URL if provided (Railway), otherwise use individual env vars
let poolConfig;

if (process.env.DATABASE_URL) {
    // Railway MySQL connection string format
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading slash
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 30000
    };
} else {
    // Local development config
    poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cahaya_phone_crm',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 30000
    };
}

// Create connection pool
const pool = mysql.createPool(poolConfig);

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });

module.exports = pool;
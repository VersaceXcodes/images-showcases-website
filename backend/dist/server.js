import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { createServer } from 'http';
import multer from 'multer';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
// Import zod schemas
import { createUserInputSchema, createImageInputSchema, createCommentInputSchema, createLikeInputSchema, createFollowInputSchema } from './schema';
dotenv.config();
const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432, JWT_SECRET = 'your-secret-key' } = process.env;
const pool = new Pool(DATABASE_URL
    ? {
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000, // Increased from 2000
    }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000, // Increased from 2000
    });
// Handle pool errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
});
pool.on('connect', (client) => {
    console.log('New client connected to database');
});
pool.on('acquire', (client) => {
    console.log('Client acquired from pool');
});
pool.on('remove', (client) => {
    console.log('Client removed from pool');
});
// Test database connection on startup
const testDatabaseConnection = async () => {
    let client;
    try {
        console.log('Testing database connection...');
        client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as db_version');
        console.log('Database connection successful:', {
            time: result.rows[0].current_time,
            version: result.rows[0].db_version.split(' ')[0],
            pool_stats: {
                total: pool.totalCount,
                idle: pool.idleCount,
                waiting: pool.waitingCount
            }
        });
    }
    catch (error) {
        console.error('Database connection failed:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
    finally {
        if (client) {
            client.release();
        }
    }
};
// Test connection on startup
testDatabaseConnection().catch(console.error);
const app = express();
// HTTP server creation for real-time interactions
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    }
});
// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;
// Serve static files from the vitereact build directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve storage files for uploaded images
app.use('/storage', express.static(path.join(__dirname, '../storage')));
// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'https://123images-showcases-website.launchpulse.ai',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'https://localhost:5173',
            // Add more flexible origin matching
            /^https:\/\/.*\.launchpulse\.ai$/,
            /^http:\/\/localhost:\d+$/,
            /^http:\/\/127\.0\.0\.1:\d+$/,
            /^https:\/\/.*\.vercel\.app$/,
            /^https:\/\/.*\.netlify\.app$/
        ];
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return allowedOrigin === origin;
            }
            else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked origin: ${origin}`);
            // For production debugging, allow all origins but log the warning
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Date',
        'X-Api-Version'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'X-Total-Count'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 86400 // 24 hours
}));
app.use(express.json({ limit: "5mb" }));
// Handle preflight requests explicitly
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-CSRF-Token, X-Api-Version');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(200).end();
});
// Add request logging and timeout middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
    // Set proper headers for all responses
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Override res.json to ensure consistent response format
    const originalJson = res.json;
    res.json = function (body) {
        // Ensure we always send valid JSON
        if (body === null || body === undefined) {
            body = { success: false, message: 'No data available' };
        }
        // Add timestamp to all responses if not present
        if (typeof body === 'object' && !body.timestamp) {
            body.timestamp = new Date().toISOString();
        }
        return originalJson.call(this, body);
    };
    // Set timeout handlers
    const timeoutDuration = 30000; // 30 seconds
    req.setTimeout(timeoutDuration, () => {
        console.error(`Request timeout for ${req.method} ${req.path}`);
        if (!res.headersSent) {
            res.status(408).json({
                success: false,
                error: 'Request timeout',
                message: 'The request took too long to process',
                timestamp: new Date().toISOString()
            });
        }
    });
    res.setTimeout(timeoutDuration, () => {
        console.error(`Response timeout for ${req.method} ${req.path}`);
        if (!res.headersSent) {
            res.status(408).json({
                success: false,
                error: 'Response timeout',
                message: 'The response took too long to send',
                timestamp: new Date().toISOString()
            });
        }
    });
    next();
});
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './storage/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });
// Auth middleware for protected routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
// --------------------- REST API Routes ---------------------
// Health check endpoint
app.get('/api/health', (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            success: true,
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0'
        });
    }
    catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
});
// Database health check
app.get('/api/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 as health_check, NOW() as timestamp');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            success: true,
            status: 'ok',
            database: 'connected',
            timestamp: result.rows[0].timestamp,
            pool_stats: {
                total: pool.totalCount,
                idle: pool.idleCount,
                waiting: pool.waitingCount
            }
        });
    }
    catch (error) {
        console.error('Database health check failed:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            success: false,
            status: 'error',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const validatedBody = createUserInputSchema.parse(req.body);
        const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [validatedBody.email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const userId = uuidv4();
        const result = await pool.query('INSERT INTO users (user_id, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING user_id, email, username, created_at', [userId, validatedBody.email.toLowerCase(), validatedBody.username, validatedBody.password_hash]);
        const user = result.rows[0];
        const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'User created successfully',
            user,
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password_hash = $2', [email.toLowerCase(), password]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const user = result.rows[0];
        const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful',
            user,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Upload Image
app.post('/api/images', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const imageUrl = `/storage/${req.file.filename}`;
        const imageId = uuidv4();
        const validatedBody = createImageInputSchema.parse({
            ...req.body,
            image_url: imageUrl
        });
        const result = await pool.query(`INSERT INTO images (image_id, user_id, title, description, image_url, categories) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [imageId, validatedBody.user_id, validatedBody.title, validatedBody.description, validatedBody.image_url, validatedBody.categories]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get All Images (for homepage showcases)
app.get('/api/images', async (req, res) => {
    let client;
    try {
        const { limit = 20, offset = 0, sort_by = 'uploaded_at', sort_order = 'DESC' } = req.query;
        // Validate and sanitize parameters
        const validSortColumns = ['uploaded_at', 'title', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'uploaded_at';
        const sortOrder = validSortOrders.includes(sort_order) ? sort_order : 'DESC';
        const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100); // Max 100 items
        const offsetNum = Math.max(parseInt(offset) || 0, 0);
        console.log(`Fetching images with params: limit=${limitNum}, offset=${offsetNum}, sortBy=${sortBy}, sortOrder=${sortOrder}`);
        // Get a client from the pool with timeout
        client = await pool.connect();
        const result = await client.query(`SELECT i.*, u.username FROM images i 
       LEFT JOIN users u ON i.user_id = u.user_id 
       ORDER BY i.${sortBy} ${sortOrder}
       LIMIT $1 OFFSET $2`, [limitNum, offsetNum]);
        console.log(`Successfully fetched ${result.rows.length} images`);
        // Ensure all image objects have required fields
        const sanitizedImages = result.rows.map(image => ({
            ...image,
            title: image.title || 'Untitled',
            description: image.description || '',
            image_url: image.image_url || '',
            categories: image.categories || '',
            uploaded_at: image.uploaded_at || new Date().toISOString(),
            username: image.username || 'Unknown User'
        }));
        res.json({
            success: true,
            data: sanitizedImages,
            pagination: {
                limit: limitNum,
                offset: offsetNum,
                count: sanitizedImages.length
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Images fetch error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch images',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
                data: [],
                timestamp: new Date().toISOString()
            });
        }
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Search Images
app.get('/api/images/search', async (req, res) => {
    let client;
    try {
        const { query = '', limit = 20, offset = 0, sort_by = 'uploaded_at', sort_order = 'DESC' } = req.query;
        // Validate sort parameters
        const validSortColumns = ['uploaded_at', 'title', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'uploaded_at';
        const sortOrder = validSortOrders.includes(sort_order) ? sort_order : 'DESC';
        const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
        const offsetNum = Math.max(parseInt(offset) || 0, 0);
        let sqlQuery = `SELECT i.*, u.username FROM images i 
                    LEFT JOIN users u ON i.user_id = u.user_id`;
        let params = [];
        let paramIndex = 1;
        if (query && typeof query === 'string' && query.trim() !== '') {
            sqlQuery += ` WHERE (i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR i.categories ILIKE $${paramIndex})`;
            params.push(`%${query.trim()}%`);
            paramIndex++;
        }
        sqlQuery += ` ORDER BY i.${sortBy} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limitNum, offsetNum);
        console.log(`Searching images with query: "${query}", limit=${limitNum}, offset=${offsetNum}`);
        client = await pool.connect();
        const result = await client.query(sqlQuery, params);
        console.log(`Search query: "${query}", found ${result.rows.length} images`);
        // Ensure all image objects have required fields
        const sanitizedImages = result.rows.map(image => ({
            ...image,
            title: image.title || 'Untitled',
            description: image.description || '',
            image_url: image.image_url || '',
            categories: image.categories || '',
            uploaded_at: image.uploaded_at || new Date().toISOString(),
            username: image.username || 'Unknown User'
        }));
        res.json({
            success: true,
            data: sanitizedImages,
            query: query,
            pagination: {
                limit: limitNum,
                offset: offsetNum,
                count: sanitizedImages.length
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Image search error:', {
            message: error.message,
            stack: error.stack,
            query: req.query,
            timestamp: new Date().toISOString()
        });
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Failed to search images',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
                data: [],
                timestamp: new Date().toISOString()
            });
        }
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Add Comment
app.post('/api/comments', authenticateToken, async (req, res) => {
    try {
        const validatedBody = createCommentInputSchema.parse(req.body);
        const commentId = uuidv4();
        const result = await pool.query(`INSERT INTO comments (comment_id, image_id, user_id, content) VALUES ($1, $2, $3, $4) 
      RETURNING *`, [commentId, validatedBody.image_id, validatedBody.user_id, validatedBody.content]);
        const newComment = result.rows[0];
        io.emit('comment/added', newComment); // Notify via WebSocket
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error('Comment add error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Add Like
app.post('/api/likes', authenticateToken, async (req, res) => {
    try {
        const validatedBody = createLikeInputSchema.parse(req.body);
        const likeId = uuidv4();
        const result = await pool.query(`INSERT INTO likes (like_id, image_id, user_id) VALUES ($1, $2, $3) RETURNING *`, [likeId, validatedBody.image_id, validatedBody.user_id]);
        const newLike = result.rows[0];
        io.emit('like/added', newLike); // Notify via WebSocket
        res.status(201).json(newLike);
    }
    catch (error) {
        console.error('Like add error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Follow User
app.post('/api/follows', authenticateToken, async (req, res) => {
    try {
        const validatedBody = createFollowInputSchema.parse(req.body);
        const result = await pool.query(`INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) RETURNING *`, [validatedBody.follower_id, validatedBody.followed_id]);
        const newFollow = result.rows[0];
        io.emit('follow/created', newFollow); // Notify via WebSocket
        res.status(201).json(newFollow);
    }
    catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get User Details
app.get('/api/users/:user_id', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query('SELECT user_id, email, username, profile_picture, created_at FROM users WHERE user_id = $1', [user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Notifications List
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const { user_id, limit = 10, offset = 0, sort_by = 'created_at', sort_order = 'DESC' } = req.query;
        const result = await pool.query(`SELECT * FROM notifications WHERE user_id = $1 
      ORDER BY ${sort_by} ${sort_order}
      LIMIT $2 OFFSET $3`, [user_id || req.user.user_id, limit, offset]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Notification list error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// --------------------- Websocket Events ---------------------
// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    // Subscribe to user notifications
    socket.on('user/notifications', async (data) => {
        const { user_id } = data;
        const result = await pool.query(`SELECT * FROM notifications WHERE user_id = $1`, [user_id]);
        socket.emit('user/notifications', result.rows);
    });
    // Other WebSocket subscriptions
    // e.g., handling 'showcase/updates', 'image/comments', 'image/likes'
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    // Ensure response is JSON
    if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
    }
    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            message: 'The provided data is invalid',
            details: err.message,
            timestamp: new Date().toISOString()
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access',
            message: 'Authentication required',
            timestamp: new Date().toISOString()
        });
    }
    if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON',
            message: 'The request body contains invalid JSON',
            timestamp: new Date().toISOString()
        });
    }
    // Default error response
    if (!res.headersSent) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
            timestamp: new Date().toISOString()
        });
    }
});
// API 404 handler - must come before the SPA catch-all
app.use('/api/*', (req, res) => {
    console.warn(`API 404: ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        message: `The endpoint ${req.method} ${req.path} does not exist`,
        available_endpoints: [
            'GET /api/health',
            'GET /api/health/db',
            'GET /api/images',
            'GET /api/images/search',
            'POST /api/auth/login',
            'POST /api/auth/register'
        ],
        timestamp: new Date().toISOString()
    });
});
// Catch-all route for SPA routing
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
const server = httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    server.close(() => {
        console.log('HTTP server closed');
        pool.end(() => {
            console.log('Database pool closed');
            process.exit(0);
        });
    });
    // Force close after 30 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
export { app, pool };
//# sourceMappingURL=server.js.map
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
        connectionTimeoutMillis: 2000,
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
        connectionTimeoutMillis: 2000,
    });
// Handle pool errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});
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
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://123images-showcases-website.launchpulse.ai',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    optionsSuccessStatus: 200
}));
app.use(express.json({ limit: "5mb" }));
// Add request timeout middleware
app.use((req, res, next) => {
    req.setTimeout(30000, () => {
        res.status(408).json({ message: 'Request timeout' });
    });
    res.setTimeout(30000, () => {
        res.status(408).json({ message: 'Response timeout' });
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
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Database health check
app.get('/api/health/db', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'ok', database: 'connected' });
    }
    catch (error) {
        console.error('Database health check failed:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
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
    try {
        const { limit = 20, offset = 0, sort_by = 'uploaded_at', sort_order = 'DESC' } = req.query;
        // Validate sort parameters to prevent SQL injection
        const validSortColumns = ['uploaded_at', 'title', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'uploaded_at';
        const sortOrder = validSortOrders.includes(sort_order) ? sort_order : 'DESC';
        const result = await pool.query(`SELECT i.*, u.username FROM images i 
       LEFT JOIN users u ON i.user_id = u.user_id 
       ORDER BY i.${sortBy} ${sortOrder}
       LIMIT $1 OFFSET $2`, [parseInt(limit), parseInt(offset)]);
        console.log(`Fetched ${result.rows.length} images`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Images fetch error:', error);
        res.status(500).json({
            message: 'Failed to fetch images',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});
// Search Images
app.get('/api/images/search', async (req, res) => {
    try {
        const { query = '', limit = 20, offset = 0, sort_by = 'uploaded_at', sort_order = 'DESC' } = req.query;
        // Validate sort parameters
        const validSortColumns = ['uploaded_at', 'title', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'uploaded_at';
        const sortOrder = validSortOrders.includes(sort_order) ? sort_order : 'DESC';
        let sqlQuery = `SELECT i.*, u.username FROM images i 
                    LEFT JOIN users u ON i.user_id = u.user_id`;
        let params = [];
        let paramIndex = 1;
        if (query && typeof query === 'string' && query.trim() !== '') {
            sqlQuery += ` WHERE (i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR i.categories ILIKE $${paramIndex})`;
            params.push(`%${query}%`);
            paramIndex++;
        }
        sqlQuery += ` ORDER BY i.${sortBy} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        const result = await pool.query(sqlQuery, params);
        console.log(`Search query: "${query}", found ${result.rows.length} images`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Image search error:', error);
        res.status(500).json({
            message: 'Failed to search images',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
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
    console.error('Global error handler:', err);
    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            details: err.message
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Unauthorized access'
        });
    }
    // Default error response
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// Catch-all route for SPA routing
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
export { app, pool };
//# sourceMappingURL=server.js.map
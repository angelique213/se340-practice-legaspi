import 'dotenv/config';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { setupDatabase, testConnection } from './src/models/setup.js';

import routes from './src/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import flash from './src/middleware/flash.js';

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { caCert } from './src/models/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';

import db from './src/models/db.js';

/**
 * Resolve directory paths
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Environment configuration
 */
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

/**
 * Initialize Express app
 */
const app = express();

/**
 * Middleware Configuration
 */
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Configure PostgreSQL session store
 */
const PgSession = connectPgSimple(session);

app.use(
    session({
        store: new PgSession({
            pool: db,
            tableName: 'session',
            createTableIfMissing: true,
            conObject: {
                ssl: {
                    ca: caCert,
                    rejectUnauthorized: true,
                    checkServerIdentity: () => undefined
                }
            }
        }),

        secret: process.env.SESSION_SECRET || 'dev-secret-key',

        resave: false,

        saveUninitialized: false,

        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use((req, res, next) => {
    if (!req.path.startsWith('/.')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use(addLocalVariables);
app.use(flash);

/**
 * View Engine Setup
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.use('/', routes);

/**
 * Error Handling
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;

    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        NODE_ENV
    });
});

/**
 * Start Server
 */
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();

    startSessionCleanup();

    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
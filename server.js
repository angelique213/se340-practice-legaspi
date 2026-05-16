import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import routes from './src/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

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

app.use((req, res, next) => {
    if (!req.path.startsWith('/.')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use(addLocalVariables);

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
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
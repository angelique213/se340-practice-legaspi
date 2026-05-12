import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

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
 * ==============================
 * Course Data
 * ==============================
 */
const courses = {
    CSE310: {
        id: 'CSE310',
        title: 'Applied Programming',
        description: 'A course focused on building software projects and demonstrating programming skills.',
        credits: 2,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Jeremiah Pineda' }
        ]
    },
    ITM350: {
        id: 'ITM350',
        title: 'DevOps',
        description: 'A course about development operations, cloud tools, automation, and deployment practices.',
        credits: 3,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Blaine Hamilton' }
        ]
    },
    CSE212: {
        id: 'CSE212',
        title: 'Programming with Data Structures',
        description: 'A course about data structures, problem solving, and efficient programming.',
        credits: 2,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Zachariah J. Alvey' }
        ]
    },
    CSE340: {
        id: 'CSE340',
        title: 'Web Backend Development',
        description: 'A course focused on backend web development using Express, routes, EJS, and server-side concepts.',
        credits: 3,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Ammon Shepherd' }
        ]
    }
};

/**
 * ==============================
 * Middleware Configuration
 * ==============================
 */

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Log incoming requests (excluding system paths)
app.use((req, res, next) => {
    if (!req.path.startsWith('/.')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Global data middleware (available in all templates)
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase();
    res.locals.currentYear = new Date().getFullYear();
    res.locals.timestamp = new Date().toISOString();
    res.locals.queryParams = req.query || {};

    // Time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
        res.locals.greeting = 'Good Morning';
    } else if (hour < 18) {
        res.locals.greeting = 'Good Afternoon';
    } else {
        res.locals.greeting = 'Good Evening';
    }

    // Random theme selection
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

    next();
});

/**
 * ==============================
 * View Engine Setup
 * ==============================
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * ==============================
 * Route-Specific Middleware
 * ==============================
 */

// Adds a visit count value
const addVisitCount = (req, res, next) => {
    res.locals.visitCount = 42;
    next();
};

// Adds custom headers for demo route
const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'Route-specific middleware demonstration');
    next();
};

/**
 * ==============================
 * Routes
 * ==============================
 */

// Home
app.get('/', (req, res) => {
    res.render('home', { title: 'Welcome Home' });
});

// About
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me' });
});

// Middleware demo page
app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});

// Example route using route-specific middleware
app.get('/welcome', addVisitCount, (req, res) => {
    res.send(`
        <h1>Welcome</h1>
        <p>Timestamp: ${res.locals.timestamp}</p>
        <p>Visit Count: ${res.locals.visitCount}</p>
    `);
});

// Course catalog
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses,
        page: 'catalog'
    });
});

// Course details
app.get('/catalog/:courseId', (req, res, next) => {
    const course = courses[req.params.courseId];

    if (!course) {
        const err = new Error('Course not found');
        err.status = 404;
        return next(err);
    }

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course,
        currentSort: req.query.sort || 'time',
        page: 'catalog'
    });
});

// Test error route
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

/**
 * ==============================
 * Error Handling
 * ==============================
 */

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;

    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        NODE_ENV
    });
});

/**
 * ==============================
 * Start Server
 * ==============================
 */
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
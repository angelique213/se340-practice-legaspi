import express from 'express';

import { facultyListPage, facultyDetailPage } from './controllers/faculty/faculty.js';
import { homePage, aboutPage, demoPage, welcomePage, testErrorPage } from './controllers/index.js';
import { catalogPage, courseDetailPage } from './controllers/catalog/catalog.js';

import { addDemoHeaders, addVisitCount } from './middleware/demo/headers.js';
import contactRoutes from './controllers/forms/contact.js';
import registrationRoutes from './controllers/forms/registration.js';
import loginRoutes from './controllers/forms/login.js';
import { processLogout, showDashboard } from './controllers/forms/login.js';
import { requireLogin } from './middleware/auth.js';

const router = express.Router();

/**
 * Catalog styles
 */
router.use('/catalog', (req, res, next) => {

    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');

    next();
});

/**
 * Faculty styles
 */
router.use('/faculty', (req, res, next) => {

    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');

    next();
});

/**
 * Contact styles
 */
router.use('/contact', (req, res, next) => {

    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');

    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

/**
 * Login styles
 */
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});
/**
 * Dashboard styles
 */
router.use('/dashboard', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

/**
 * Contact routes
 */
router.use('/contact', contactRoutes);

/**
 * Registration routes
 */
router.use('/register', registrationRoutes);

/**
 * Basic pages
 */
router.get('/', homePage);
router.get('/about', aboutPage);

/**
 * Demo routes
 */
router.get('/demo', addDemoHeaders, demoPage);
router.get('/welcome', addVisitCount, welcomePage);

/**
 * Catalog routes
 */
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

/**
 * Faculty routes
 */
router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

/**
 * Test error route
 */
router.get('/test-error', testErrorPage);

/**
 * Login routes
 */
router.use('/login', loginRoutes);

router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);



export default router;
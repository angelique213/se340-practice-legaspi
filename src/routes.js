import express from 'express';

import { facultyListPage, facultyDetailPage } from './controllers/faculty/faculty.js';
import { homePage, aboutPage, demoPage, welcomePage, testErrorPage } from './controllers/index.js';
import { catalogPage, courseDetailPage } from './controllers/catalog/catalog.js';

import { addDemoHeaders, addVisitCount } from './middleware/demo/headers.js';
import contactRoutes from './controllers/forms/contact.js';

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
/**
 * Contact routes
 */
router.use('/contact', contactRoutes);
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

export default router;
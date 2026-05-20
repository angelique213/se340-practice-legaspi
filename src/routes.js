import express from 'express';

import { facultyListPage, facultyDetailPage } from './controllers/faculty/faculty.js';
import { homePage, aboutPage, demoPage, welcomePage, testErrorPage } from './controllers/index.js';
import { catalogPage, courseDetailPage } from './controllers/catalog/catalog.js';

import { addDemoHeaders, addVisitCount } from './middleware/demo/headers.js';

const router = express.Router();

/**
 * Basic Pages
 */
router.get('/', homePage);
router.get('/about', aboutPage);

/**
 * Demo Routes
 */
router.get('/demo', addDemoHeaders, demoPage);
router.get('/welcome', addVisitCount, welcomePage);

/**
 * Catalog Routes
 */
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

/**
 * Faculty Routes
 */
router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

/**
 * Test Error Route
 */
router.get('/test-error', testErrorPage);

export default router;
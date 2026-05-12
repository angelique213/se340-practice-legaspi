import express from 'express';

import { facultyListPage, facultyDetailPage } from './controllers/faculty/faculty.js';

const router = express.Router();

router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

export default router;
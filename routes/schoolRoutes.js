import express from 'express';
import { addSchoolFunction, listSchoolsFunction } from '../controllers/schoolController.js';

const router = express.Router();

router.get('/listSchools', listSchoolsFunction);
router.post('/addSchool', addSchoolFunction);

export default router;
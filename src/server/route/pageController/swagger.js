import express from 'express';
import {middleLogger} from '../common';

const router = express.Router();

router.use(middleLogger);

router.get('/swagger', (req, res) => {
	res.render('swagger/index');
});

export default router;
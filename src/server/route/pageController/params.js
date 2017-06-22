import express from 'express';
import {middleLogger} from '../common';

const router = express.Router();

router.use(middleLogger);

const prefix = '/params';

router.get(prefix, (req, res) => {
	res.render('parameters');
});


export default router;
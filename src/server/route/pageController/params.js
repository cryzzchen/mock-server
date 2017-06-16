import express from 'express';
import {middleLogger} from '../common';
import data2Json from '../../lib/data2json';

const router = express.Router();

router.use(middleLogger);

const prefix = '/params';

router.get(prefix, (req, res) => {
	res.render('parameters');
});


export default router;
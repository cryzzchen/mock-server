import express from 'express';
import {middleLogger} from '../common';
import {queryTypes, dbHandler} from '../../db/index';

const router = express.Router();

router.use(middleLogger);

router.get('/params/get', (req, res) => {
	dbHandler(queryTypes.getParams).then((result) => {
		res.send(result);
	})
});

export default router;
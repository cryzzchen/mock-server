import express from 'express';
import {queryTypes, dbHandler} from '../../db/index';

const router = express.Router();

router.get('/params/get', (req, res) => {
	dbHandler(queryTypes.getParams).then((result) => {
		res.send(result);
	})
});

export default router;
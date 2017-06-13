/**
* API 文档API
*/
import express from 'express';
import {middleLogger} from '../common';
import {queryTypes, dbHandler} from '../../db/index';

const router = express.Router();

router.use(middleLogger);


// 获得全部文档信息
router.get('/get/docs', (req, res) => {
	dbHandler(queryTypes.getDocs).then((result) => {
		res.send(result);
	})
});

// 创建文档
router.post('/create/doc', (req, res) => {
	console.log(req.body);
	dbHandler(queryTypes.createDoc, req.body).then((result) => {
		res.send(result);
	});
});

export default router;
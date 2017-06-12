/**
* API 文档API
*/
import express from 'express';
import {middleLogger} from '../common';
import {queryTypes, getData} from '../../db/index';

const router = express.Router();
router.use(middleLogger);


// 获得全部文档信息
router.get('/get/docs', (req, res) => {
	getData(queryTypes.getDocs).then((result) => {
		res.send(result);
	})
});

export default router;
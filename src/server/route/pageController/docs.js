/*
* API文档相关Page Controller
*/

import express from 'express';
import {middleLogger} from '../common';
import data2Json from '../../lib/data2json';

const router = express.Router();

router.use(middleLogger);

const prefix = '/doc';
// 文档列表
router.get(prefix, (req, res) => {
	res.render('doc');
});

// 编辑文档
router.get(prefix + '/edit/:id', (req, res) => {
	res.render('edit', {id: req.params.id});
});

router.get(prefix + '/test', (req, res) => {
	data2Json({fileName: '4.json', data: {}}).then(() => {
		res.send('OK');
	});
});

export default router;
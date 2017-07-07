/*
* API文档相关Page Controller
*/

import express from 'express';
import {middleLogger} from '../common';

const router = express.Router();

router.use(middleLogger);

const prefix = '/doc';
// 文档列表
router.get(prefix, (req, res) => {
	res.render('doc');
});

// 编辑文档
router.get(prefix + '/edit/:docId', (req, res) => {
	console.log(req.params.docId);
	res.render('edit', {docId: req.params.docId});
});

router.get(prefix + '/edit/:docId/api/:apiId', (req, res) => {
	res.render('edit', {docId: req.params.docId, apiId: req.params.apiId});
});

export default router;
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
router.get(prefix + '/edit/:id', (req, res) => {
	res.render('edit', {id: req.params.id});
});


export default router;
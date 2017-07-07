import express from 'express';
import {middleLogger} from '../common';

const router = express.Router();

router.use(middleLogger);

const prefix = '/user';

// 登录
router.get(prefix + '/login', (req, res) => {
	res.render('login');
});

// 项目列表
router.get(prefix + '/project', (req, res) => {
	if (req.session.loginId) {
		res.render('project');
	} else {
		res.redirect('/user/login');
	}
});


export default router;
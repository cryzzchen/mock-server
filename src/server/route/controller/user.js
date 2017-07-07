import express from 'express';
import session from 'express-session';
import {queryTypes, dbHandler} from '../../db/index';
import {login, createSession} from '../../lib/login';

const router = express.Router();

router.post('/user/login', (req, res) => {
	if (req.session.loginId) {
		res.send({
			userId: req.session.loginId,
			ldapId: req.session.ldapId,
			name: req.session.loginName
		});
	} else {
		const {name, pswd} = req.body;
		login(req.body).then((result) => {
			if (result.c === '0' || result.c === 0) {
				// 创建session
				req.session.regenerate((err) => {
					if (err) {
						res.statusCode = 400;
						res.send('登录失败');
					}
					req.session.loginName = result.d.name;
					req.session.loginId = result.d.userId;
					req.session.ldapId = result.d.ldapId;

					res.send(result.d);
				})
			} else {
				res.statusCode = 400;
				res.send(result.m);
			}
		});
	}
});

// 获得列表
router.get('/project/get', (req, res) => {
	const userId = req.session.userId;
	dbHandler(queryTypes.getProjects, userId).then((result) => {
		res.send(result);
	});
});

// 创建
router.post('/project/create', (req, res) => {
	const userId = req.session.userId;
	dbHandler(queryTypes.createProject, req.body, userId).then((result) => {
		res.send(result);
	});
});

// 设置某一个项目是否需要mock
router.put('project/set', (req, res) => {
	dbHandler(queryTypes.setProjectIsMock, req.body).then((result) => {
		res.send(result);
	});
});

// 删除
router.delete('/api/project/delete/:id', (req, res) => {
	dbHandler(queryTypes.deleteProject, req.params.id).then((result) => {
        res.send(result);
    }, (err) => {
        res.send(err);
    });
});

export default router;
/**
* API 文档API
*/
import express from 'express';
import {middleLogger} from '../common';
import {queryTypes, dbHandler} from '../../db/index';

const router = express.Router();

router.use(middleLogger);


const renderDocTree = (nodes = []) => {
	let parseNodes = {};
	let tree = {};

	const _getTree = (node, subTree) => {
		const pid = node.pid;
		const id = node._id;
		if (!pid || !parseNodes[pid]) {
			tree = {
				id,
				...node,
				children: []
			}
		} else {
			
			_getTree(parseNodes[pid], subTree);
		}
	}

	nodes.each(node => {
		parseNodes[node._id] = node;
	});

	nodes.each(node => {
		_getTree(node, {
			id: node._id,
			...node
		});
	});

}

// 获得全部文档信息,query: 
// level表示层级,返回该层级
// id 表示获得该节点+该节点的叶节点的文档
router.get('/docs/get', (req, res) => {
	const query = {};
	if (req.query) {
		const {level, id} = req.query;
		if (level) {
			query.level = parseInt(level, 10);
		}
		if (id) {
			query.id = id;
		}
	}
	dbHandler(queryTypes.getDocs, query).then((result) => {
		if (!query.level) {
			// 表示需要返回一棵树
			res.send(renderDocTree(result));
		} else {
			res.send(result);
		}
	});
});

// 创建文档
router.post('/doc/create', (req, res) => {
	console.log(req.body);
	dbHandler(queryTypes.createDoc, req.body).then((result) => {
		res.send(result);
	});
});

export default router;
/**
* API 文档API
*/
import express from 'express';
import {queryTypes, dbHandler} from '../../db/index';

const router = express.Router();


const renderDocTree = (nodes = [], {id, level}) => {
    let parseNodes = [];  // 根据层级
    let rootNode;

    nodes.map(node => {
        let levelNode = parseNodes[node.level || 0];
        if (!levelNode) {
            levelNode = {};
        }

        if (node.pid && node.pid.$ref) {
            const pid = node.pid.$ref + '';

            if (!levelNode[pid]) {
                levelNode[pid] = [];
            }

            levelNode[pid].push(node);
        }


        if (node._id == id && node.level == level) {
            rootNode = node;
        }

        parseNodes[node.level || 0] = levelNode;
    });

    console.log(rootNode);

    const tree = {
        ...rootNode,
        children: []
    };
    
    const _findChildren = (t, l) => {
        if (parseNodes[l] && parseNodes[l][t._id + '']) {
            t.children = parseNodes[l][t._id + ''];
            if (t.children && t.children.length > 0) {
                t.children.map(c => {
                    _findChildren(t, ++l);
                });
            }
        }
    }

    _findChildren(tree, parseInt(level, 10) + 1);

    return tree;
}

// 获得全部文档信息,query: 
// level表示层级,返回该层级
// id 表示获得该节点+该节点的叶节点的文档
router.get('/docs/get', (req, res) => {
    const query = {};
    const {level, id} = req.query;

    if (req.query) {
        if (!id) {
            if (level) {
                query.level = parseInt(level, 10);
            }
        }
    }

    dbHandler(queryTypes.getDocs, query).then((result) => {
        if (id) {
            // 需要返回以Id为根节点的树
            res.send(renderDocTree(result, {id, level}));
        } else {
            res.send(result);
        }
    });
});

// 创建文档
router.post('/doc/create', (req, res) => {
    dbHandler(queryTypes.createDoc, req.body).then((result) => {
        res.send(result);
    });
});

// 删除文档
router.delete('/doc/delete/:id', (req, res) => {
    dbHandler(queryTypes.deleteDoc, req.params.id).then((result) => {
        res.send(result);
    }, (err) => {
        res.send(err);
    });
});

// 创建API
router.post('/doc/api/create', (req, res) => {
    dbHandler(queryTypes.createApi, req.body, req.query).then((result) => {
        res.send(result);
    }, (err) => {
        res.send(err);
    });
});

// 获取API
router.get('/doc/api/get', (req, res) => {
    if (req.query.docid) {
        dbHandler(queryTypes.getApisByDocId, req.query.docid).then(result => {
            res.send(result);
        }, err => {
            res.send(err);
        })
    } else {
        dbHandler(queryTypes.getApis, req.query).then(result => {
            res.send(result);
        }, err => {
            res.send(err);
        })
    }
});

export default router;
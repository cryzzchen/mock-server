/*
* API文档相关的query语句
*/
import {Promise} from 'es6-promise';
import {DBRef, ObjectID} from 'mongodb';
import getLogger from '../lib/log';

const LOG = getLogger('mongodb');

const queryTypes = {
    getDocs: 'getDocs',
    createDoc: 'createDoc',
    getParams: 'getParams'
};

let rootId = null;
const DocCollection = 'docTree';
const RootName = 'root';

const query = (() => {
    // 获得根节点ID
    const getRootId = ({db}) => {
        // 获得rootId;
        if (!rootId) {
            return new Promise((resolve, reject) => {
                resolve(rootId);
            });
        }
        return new Promise((resolve, reject) => {
            db.collection(DocCollection).find({name: 'root'}).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result[0]._id);
            });
        });
    };

    // 获得某一个文档节点
    const getTreeNode = (db, {level, name}) => {
        return new Promise((resolve, reject) => {
            db.collection(DocCollection).find({name, level}).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result[0]);
            });
        });
    };

    const getDocs = (db, body) => {
        // 获得文档信息
        return new Promise((resolve, reject) => {
            db.collection(DocCollection).find(body).toArray((err, result) => {
                if (err) {
                    LOG.error(type + ' error:' + err);
                    reject(err);
                }
                resolve(result);
            });
        });
    };

    // 创建文档
    const createDoc = (db, body) => {
        const query = {
            _id: body.pid,
            level: body.level && body.level > 1 ? (body.level - 1) : 0
        };
        return new Promise((resolve, reject) => {
            db.collection(DocCollection).insert({
                name: body.name,
                description: body.desc,
                level: body.level || 1,
                pid: new DBRef(ObjectID(body.pid))
            }, (err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result.ops[0]);
            });
        });
    };

    // 获得参数列表
    const getParams = (db, id) => {
        return new Promise((resolve, reject) => {
            db.collection('parameters').find().toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    };

    return {
        getDocs,
        createDoc,
        getParams
    };
})();

export {
    queryTypes,
    query
}
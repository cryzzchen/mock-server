/*
* API文档相关的query语句
*/
import {Promise} from 'es6-promise';
import {DBRef, ObjectID} from 'mongodb';
import getLogger from '../lib/log';
import generateSwagger from './generateSwagger';

const LOG = getLogger('mongodb');

const queryTypes = {
    getDocs: 'getDocs',
    createDoc: 'createDoc',
    getParams: 'getParams',
    createApi: 'createApi',
    getApis: 'getApis',
    deleteDoc: 'deleteDoc',
    getApisByDocId: 'getApisByDocId'
};

let rootId = null;
const DocCollection = 'docTree';
const ApiCollection = 'apis';
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

    const getDocs = (db, body = {}) => {
        body.deleted = {$ne: 1 };
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
                pid: new DBRef(ObjectID(body.pid)),
                createdTime: new Date().getTime(),
                deleted: 0
            }, (err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }

                // 创建swagger
                generateSwagger(result.ops[0]._id);

                resolve(result.ops[0]);
            });
        });
    };

    // 删除文档
    const deleteDoc = (db, docId) => {
        return new Promise((resolve, reject) => {
            db.collection(DocCollection).update({_id: ObjectID(docId)}, {
                $set: {deleted: 1},
                $currentDate: {
                    lastModified: true,
                    'cancellation.date': {
                        $type: 'timestamp'
                    }
                }
            }, (err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(err);
            });
        });
    }

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

    // 创建API
    const createApi = (db, {basicInfo, path, query, body}, {docId}) => {
        console.log(basicInfo, path, query, body, docId);
        return new Promise((resolve, reject) => {
            db.collection(DocCollection).find({_id: ObjectID(docId)}).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject('目录ID不存在');
                }

                db.collection(ApiCollection).insert({
                    basicInfo,
                    path,
                    query,
                    body,
                    docid: new DBRef(ObjectID(docId)),
                    deleted: 0,
                    createdTime: new Date().getTime()
                }, (err1, result1) => {
                    if (err1) {
                        LOG.error(err);
                        reject('数据库创建失败');
                    }

                    // 更新Swagger文档
                    generateSwagger(docId);

                    resolve(result1.ops[0]);
                })
            });
        });
    }

    // 获取API
    const getApis = (db, body = {}) => {
        return new Promise((resolve, reject) => {
            if (body._id && typeof body._id === 'string') {
                console.log('s');
                body._id = ObjectID(body._id);
            }
            db.collection(ApiCollection).find(body).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    const getApisByDocId = (db, docId) => {
        return new Promise((resolve, reject) => {
            db.collection(ApiCollection).find({
                docid: new DBRef(ObjectID(docId))
            }).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    return {
        getDocs,
        createDoc,
        getParams,
        createApi,
        getApis,
        deleteDoc,
        getApisByDocId
    };
})();

export {
    queryTypes,
    query
}
import {Promise} from 'es6-promise';
import {DBRef, ObjectId} from 'mongodb';
import getLogger from '../lib/log';

const LOG = getLogger('mongodb');

const queryTypes = {
    createParam: 'createParam',
    getParams: 'getParams',
    getParam: 'getParam',
    deleteParam: 'deleteParam',
    updateParam: 'updateParam'
};

const ParamsCollection = 'params';

const query = (() => {
    const createParam = (db, docId,{name, description, isArray, params}) => {
        return new Promise((resolve, reject) => {
            db.collection(ParamsCollection).insert({
                name,
                description,
                isArray,
                params,
                docId,
                createdTime: new Date().getTime(),
                deleted: 0
            }, (err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }

                resolve(result.ops[0]);
            });
        });
    }

    const getParams = (db, docId) => {
        return new Promise((resolve, reject) => {
            db.collection(ParamsCollection).find({
                docId,
                deleted: 0
            }).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    const getParam = (db, id) => {
        return new Promise((resolve, reject) => {
            db.collection(ParamsCollection).find({
                _id: ObjectId(id),
                deleted: 0
            }).toArray((err, result) => {
                if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(result);
            })
        });
    }
    const deleteParam = (db, id) => {
        return new Promise((resolve, reject) => {
            db.collection(ParamsCollection).update({
                _id: ObjectId(id)
            }, {
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
            })
        });
    }

    const updateParam = (db, id, body) => {
        db.collection(ParamsCollection).update({
                _id: ObjectId(id)
            }, {
                $set: body,
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
            })
    }
    return {
        createParam,
        getParams,
        getParam,
        deleteParam,
        updateParam
    }
})();

export {
    query,
    queryTypes
}
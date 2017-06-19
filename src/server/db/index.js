/*
* 数据库
*/

import {MongoClient, DBRef} from 'mongodb';
import {Promise} from 'es6-promise';
import {query, queryTypes} from './query';

import getLogger from '../lib/log';

const LOG = getLogger('mongodb');

const db = null;

const getMongoDb = () => {
	return new Promise((resolve, reject) => {
		if (db === null) {
			MongoClient.connect('mongodb://localhost:27017/apiDb', (err, db) => {
				if (err) {
					LOG.error('无法连接到数据库');
					reject(err);
				}
				_db = db;
				LOG.info('数据库已链接...');
				resolve(db);
			});
		} else {
			resolve(db);
		}
	});
};



const dbHandler = (type, ...props) => {
	return getMongoDb().then((db) => {
		return query[type](db, ...props);
	}).then((result) => {
		return result;
	});
};

export {
	dbHandler,
	queryTypes
};
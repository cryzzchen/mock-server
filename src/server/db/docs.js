/*
* API文档相关的query语句
*/
import {Promise} from 'es6-promise';
import getLogger from '../lib/log';

const LOG = getLogger('mongodb');

const queryTypes = {
	getDocs: 'getDocs',
	createDoc: 'createDoc',
	getParams: 'getParams'
};

const query = (() => {
	const getDocs = (db) => {
		// 获得全部文档信息
		return new Promise((resolve, reject) => {
			db.collection('docs').find().toArray((err, result) => {
				if (err) {
					LOG.error(type + ' error:' + err);
					reject(err);
				}
				console.log(result)
				
				resolve(result);
			});
		}).then((result) => {
			console.log('数据库连接已关闭')
			db.close();
			return result;
		});
	};

	const createDoc = (db, body) => {
		// 创建新文档
		return new Promise((resolve, reject) => {
			db.collection('docs').insert({
				project_name: body.name,
				desciption: body.desc
			}, (err, result) => {
				if (err) {
					LOG.error(type + ' error:' + err);
					reject(err);
				}
				resolve(result);
			});
		}).then((result) => {
			console.log('数据库连接已关闭')
			db.close();
			return result;
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
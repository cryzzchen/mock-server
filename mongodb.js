/*
* 预处理数据库
*/

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const DBRef = mongodb.DBRef;

const db = 'mongodb://localhost:27017/apiDb';

const insertData = function (db, collection, callback) {
}


MongoClient.connect(db, function(err, db) {
	console.log('连接成功');
	
	const rootId = db.collection('docTree').find({name: 'root'})._id;
	db.collection('docTree').find({name: 'root'}).toArray((err, result) => {
		console.log(result[0]._id)
		const rootId = result[0]._id;

		db.collection('docTree').insert({
			name: 'level1',
			description: '这是文档第一层结构',
			pid: new DBRef('docTree', rootId)
		}, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log(result);
		});
	})

	
});
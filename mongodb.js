/*
* 预处理数据库
*/

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const DBRef = mongodb.DBRef;

const db = 'mongodb://localhost:27017/apiDb';

MongoClient.connect(db, function(err, db) {
	console.log('连接成功');

	// 插入文档树根节点

	db.collection('docTree').insert({name: 'root'}, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}

		db.collection('docTree').find({name: 'root'}).toArray((err1, result1) => {
			if (err1) {
				console.log(err1);
				return;
			}
			const rootId = result1[0]._id;

			// 插入文档树第一层子节点
			for(let i = 0; i < 3; i ++) {
				db.collection('docTree').insert({
					name: 'level1_' + i,
					description: '这是文档第一层结构',
					pid: new DBRef('docTree', rootId)
				}, (err2, result2) => {
					if (err2) {
						console.log(err2);
						return;
					}
					console.log(result2);
				});
			}

			// 插入文档树第三层子节点
			db.collection('docTree').find({name: 'level1_0'}).toArray((err3, result3) => {
				if (err3) {
					console.log(err3);
					return;
				}
				const level1Id = result3[0]._id;

				db.collection('docTree').insert({
					name: 'level2_0',
					description: '这是文档第二层结构',
					pid: new DBRef('docTree', level1Id)
				}, (err4, result4) => {
					if (err4) {
						console.log(err4);
						return;
					}
					console.log(result4);
				});
			});
		});
	});
	
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

		// parameters
		db.collection('parameters').insert({
			name: 'Person',
			summary: '人的类',
			yaml: '',
			treeNodes: [{
				new DBRef('docTree', rootId)
			}]
		});
	})；


});
/*
* 将数据转化为swaggerJson
*/
import {Promise} from 'es6-promise';
import fs from 'fs';
import path from 'path';

const jsonRoot = path.resolve(__dirname, '../../../src/server/json');

// apiJson按照文档进行存放
// 每新修改一次api，会覆盖————以后看需求要不要保存历史记录

const mkFolder = (folderPath) => {
	console.log(folderPath);
	if (!fs.existsSync(folderPath)) {
		console.log('不存在');
			fs.mkdirSync(folderPath);
	} else {
		console.log('存在');
	}
}

// 生成符合swagger的API JSON
const generateJson = (data) => {
	const json = {
		swagger: '2.0',
		info: {
		},
		schemes: ['http'],
		paths: {
			'/api/test': {
				'get': {
					summary: '一句话名称',
					description: '这里是这个API的描述',
					produces: ['application/json'],
					parameters: []
				}
			}
		}
	};
}

const data2Json = ({docId = 1 , apiId, fileName = '3.json', data = {}}) => {
	const folderPath = path.join(jsonRoot, '/doc_' + docId);
	const fileName = './api_' + apiId + '.json';

	// 创建文件夹
	mkFolder(folderPath);
	const json = JSON.stringify(generateJson());

	fs.writeFile(path.resolve(folderPath, fileName), json, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('成功')
		}
	});
}

export default data2Json;

import ejs from 'ejs';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import {LOG} from './common';

import apiRouters from './controller/index';
import pageRouters from './pageController/index';
import generateSwagger from '../db/generateSwagger';

const app = express();

const rootDir = path.resolve(__dirname, '../../../');

app.engine('html', ejs.__express);
app.set('views', path.join(rootDir, './src/views'));
app.set('view engine', 'html');

// 静态资源
app.use('/static', express.static(rootDir + '/src/static/js'));
app.use('/json', express.static(rootDir + '/src/server/json'));
app.use('/swagger', express.static(rootDir + '/src/static/swagger'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// pageController
pageRouters.forEach((r) => {
	app.use(r);
});

// API Controller
apiRouters.forEach((r) => {
	app.use('/api', r);
});

// 启动
app.listen(3000, () => {
	LOG.info('Server on port 3000');
	generateSwagger('5950b2b7530a4323d82f1343');
});
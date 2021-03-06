import ejs from 'ejs';
import express from 'express';
import session from 'express-session';
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

// session
app.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false,
	resave: false,
	cookie: {
		maxAge: 60 * 1000 * 30	// 30天的过期时间
	}
}));

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
	generateSwagger('59536dba733a9f11402137f7');
});
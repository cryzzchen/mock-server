var _edit = require('./edit');

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.engine('html', _ejs2.default.__express);
app.set('view engine', 'html');

// 静态资源
app.use('/static', _express2.default.static(__dirname + '../../build/static'));

app.use(_edit.prefix, _edit.router);

// 启动
app.listen(3000, function () {
	_common.LOG.info('Server on port 3000');
});
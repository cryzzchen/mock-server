exports.__esModule = true;
exports.prefix = exports.router = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _common = require('./common');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); /*
                                         * 录入相关API
                                         */

router.get('/', function (req, res) {
	res.render(_path2.default.resolve(__dirname, '../../build/built-view/center'));
});

var prefix = '/doc/edit';

exports.router = router;
exports.prefix = prefix;
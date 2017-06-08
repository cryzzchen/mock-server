exports.__esModule = true;
exports.middleLogger = exports.LOG = undefined;

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_log4js2.default.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/_route_log.log',
        category: 'route'
    }],
    replaceConsole: true
});

var LOG = _log4js2.default.getLogger('route');
_log4js2.default.connectLogger(LOG, { level: 'auto' });

var middleLogger = function middleLogger(req, res, next) {
    LOG.info(req.ip + '  ' + req.method + ':' + req.url);
    next();
};

exports.LOG = LOG;
exports.middleLogger = middleLogger;
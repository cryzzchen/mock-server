import log4js from 'log4js';

log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/_route_log.log',
        category: 'route'
    }],
    replaceConsole: true
});

const LOG = log4js.getLogger('route');
log4js.connectLogger(LOG, {level: 'auto'});

const middleLogger = (req, res, next) => {
    LOG.info(req.ip + '  ' + req.method + ':' + req.url);
    next();
}

export {
    LOG,
    middleLogger
};

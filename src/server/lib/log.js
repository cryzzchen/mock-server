import log4js from 'log4js';

const getLogger = (category) => {
	log4js.configure({
	    appenders: [{
	        type: 'console'
	    }, {
	        type: 'file',
	        filename: `logs/_${category}_log.log`,
	        category
	    }],
	    replaceConsole: true
	});

	const log = log4js.getLogger(category);
	log4js.connectLogger(log, {level: 'auto'});

	return log;
}

export default getLogger;
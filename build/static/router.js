/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 165);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dateFormat = __webpack_require__(215)
, os = __webpack_require__(22)
, eol = os.EOL || '\n'
, util = __webpack_require__(8)
, semver = __webpack_require__(318)
, replacementRegExp = /%[sdj]/g
, layoutMakers = {
  "messagePassThrough": function() { return messagePassThroughLayout; },
  "basic": function() { return basicLayout; },
  "colored": function() { return colouredLayout; },
  "coloured": function() { return colouredLayout; },
  "pattern": function (config) {
    return patternLayout(config && config.pattern, config && config.tokens);
	},
  "dummy": function() { return dummyLayout; }
}
, colours = {
  ALL: "grey",
  TRACE: "blue",
  DEBUG: "cyan",
  INFO: "green",
  WARN: "yellow",
  ERROR: "red",
  FATAL: "magenta",
  OFF: "grey"
};

function wrapErrorsWithInspect(items) {
  return items.map(function(item) {
    if ((item instanceof Error) && item.stack) {
      return { inspect: function() {
        if (semver.satisfies(process.version, '>=6')) {
          return util.format(item);
        } else {
          return util.format(item) + '\n' + item.stack;
        }
      } };
    } else {
      return item;
    }
  });
}

function formatLogData(logData) {
  var data = logData;
  if (!Array.isArray(data)) {
    var numArgs = arguments.length;
    data = new Array(numArgs);
    for (var i = 0; i < numArgs; i++) {
      data[i] = arguments[i];
    }
  }
  return util.format.apply(util, wrapErrorsWithInspect(data));
}

var styles = {
    //styles
  'bold'      : [1,  22],
  'italic'    : [3,  23],
  'underline' : [4,  24],
  'inverse'   : [7,  27],
  //grayscale
  'white'     : [37, 39],
  'grey'      : [90, 39],
  'black'     : [90, 39],
  //colors
  'blue'      : [34, 39],
  'cyan'      : [36, 39],
  'green'     : [32, 39],
  'magenta'   : [35, 39],
  'red'       : [31, 39],
  'yellow'    : [33, 39]
};

function colorizeStart(style) {
  return style ? '\x1B[' + styles[style][0] + 'm' : '';
}
function colorizeEnd(style) {
  return style ? '\x1B[' + styles[style][1] + 'm' : '';
}
/**
 * Taken from masylum's fork (https://github.com/masylum/log4js-node)
 */
function colorize (str, style) {
  return colorizeStart(style) + str + colorizeEnd(style);
}

function timestampLevelAndCategory(loggingEvent, colour, timezoneOffest) {
  var output = colorize(
    formatLogData(
      '[%s] [%s] %s - '
      , dateFormat.asString(loggingEvent.startTime, timezoneOffest)
      , loggingEvent.level
      , loggingEvent.categoryName
    )
    , colour
  );
  return output;
}

/**
 * BasicLayout is a simple layout for storing the logs. The logs are stored
 * in following format:
 * <pre>
 * [startTime] [logLevel] categoryName - message\n
 * </pre>
 *
 * @author Stephan Strittmatter
 */
function basicLayout (loggingEvent, timezoneOffset) {
  return timestampLevelAndCategory(
    loggingEvent,
    undefined,
    timezoneOffset
  ) + formatLogData(loggingEvent.data);
}

/**
 * colouredLayout - taken from masylum's fork.
 * same as basicLayout, but with colours.
 */
function colouredLayout (loggingEvent, timezoneOffset) {
  return timestampLevelAndCategory(
    loggingEvent,
    colours[loggingEvent.level.toString()],
    timezoneOffset
  ) + formatLogData(loggingEvent.data);
}

function messagePassThroughLayout (loggingEvent) {
  return formatLogData(loggingEvent.data);
}

function dummyLayout(loggingEvent) {
  return loggingEvent.data[0];
}

/**
 * PatternLayout
 * Format for specifiers is %[padding].[truncation][field]{[format]}
 * e.g. %5.10p - left pad the log level by 5 characters, up to a max of 10
 * Fields can be any of:
 *  - %r time in toLocaleTimeString format
 *  - %p log level
 *  - %c log category
 *  - %h hostname
 *  - %m log data
 *  - %d date in various formats
 *  - %% %
 *  - %n newline
 *  - %z pid
 *  - %x{<tokenname>} add dynamic tokens to your log. Tokens are specified in the tokens parameter
 * You can use %[ and %] to define a colored block.
 *
 * Tokens are specified as simple key:value objects.
 * The key represents the token name whereas the value can be a string or function
 * which is called to extract the value to put in the log message. If token is not
 * found, it doesn't replace the field.
 *
 * A sample token would be: { "pid" : function() { return process.pid; } }
 *
 * Takes a pattern string, array of tokens and returns a layout function.
 * @param {String} Log format pattern String
 * @param {object} map object of different tokens
 * @param {number} timezone offset in minutes
 * @return {Function}
 * @author Stephan Strittmatter
 * @author Jan Schmidle
 */
function patternLayout (pattern, tokens, timezoneOffset) {
  // jshint maxstatements:22
  var TTCC_CONVERSION_PATTERN  = "%r %p %c - %m%n";
  var regex = /%(-?[0-9]+)?(\.?[0-9]+)?([\[\]cdhmnprzxy%])(\{([^\}]+)\})?|([^%]+)/;

  pattern = pattern || TTCC_CONVERSION_PATTERN;

  function categoryName(loggingEvent, specifier) {
    var loggerName = loggingEvent.categoryName;
    if (specifier) {
      var precision = parseInt(specifier, 10);
      var loggerNameBits = loggerName.split(".");
      if (precision < loggerNameBits.length) {
        loggerName = loggerNameBits.slice(loggerNameBits.length - precision).join(".");
      }
    }
    return loggerName;
  }

  function formatAsDate(loggingEvent, specifier) {
    var format = dateFormat.ISO8601_FORMAT;
    if (specifier) {
      format = specifier;
      // Pick up special cases
      if (format == "ISO8601") {
        format = dateFormat.ISO8601_FORMAT;
      } else if (format == "ISO8601_WITH_TZ_OFFSET") {
        format = dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT;
      } else if (format == "ABSOLUTE") {
        format = dateFormat.ABSOLUTETIME_FORMAT;
      } else if (format == "DATE") {
        format = dateFormat.DATETIME_FORMAT;
      }
    }
    // Format the date
    return dateFormat.asString(format, loggingEvent.startTime, timezoneOffset);
  }

  function hostname() {
    return os.hostname().toString();
  }

  function formatMessage(loggingEvent) {
    return formatLogData(loggingEvent.data);
  }

  function endOfLine() {
    return eol;
  }

  function logLevel(loggingEvent) {
    return loggingEvent.level.toString();
  }

  function startTime(loggingEvent) {
    return dateFormat.asString('hh:mm:ss', loggingEvent.startTime, timezoneOffset);
  }

  function startColour(loggingEvent) {
    return colorizeStart(colours[loggingEvent.level.toString()]);
  }

  function endColour(loggingEvent) {
    return colorizeEnd(colours[loggingEvent.level.toString()]);
  }

  function percent() {
    return '%';
  }

  function pid(loggingEvent) {
    if (loggingEvent && loggingEvent.pid) {
      return loggingEvent.pid;
    } else {
      return process.pid;
    }
  }

  function clusterInfo(loggingEvent, specifier) {
    if (loggingEvent.cluster && specifier) {
      return specifier
        .replace('%m', loggingEvent.cluster.master)
        .replace('%w', loggingEvent.cluster.worker)
        .replace('%i', loggingEvent.cluster.workerId);
    } else if (loggingEvent.cluster) {
      return loggingEvent.cluster.worker+'@'+loggingEvent.cluster.master;
    } else {
      return pid();
    }
  }

  function userDefined(loggingEvent, specifier) {
    if (typeof(tokens[specifier]) !== 'undefined') {
      if (typeof(tokens[specifier]) === 'function') {
        return tokens[specifier](loggingEvent);
      } else {
        return tokens[specifier];
      }
    }
    return null;
  }

  var replacers = {
    'c': categoryName,
    'd': formatAsDate,
    'h': hostname,
    'm': formatMessage,
    'n': endOfLine,
    'p': logLevel,
    'r': startTime,
    '[': startColour,
    ']': endColour,
    'y': clusterInfo,
    'z': pid,
    '%': percent,
    'x': userDefined
  };

  function replaceToken(conversionCharacter, loggingEvent, specifier) {
    return replacers[conversionCharacter](loggingEvent, specifier);
  }

  function truncate(truncation, toTruncate) {
    var len;
    if (truncation) {
      len = parseInt(truncation.substr(1), 10);
      return toTruncate.substring(0, len);
    }

    return toTruncate;
  }

  function pad(padding, toPad) {
    var len;
    if (padding) {
      if (padding.charAt(0) == "-") {
        len = parseInt(padding.substr(1), 10);
        // Right pad with spaces
        while (toPad.length < len) {
          toPad += " ";
        }
      } else {
        len = parseInt(padding, 10);
        // Left pad with spaces
        while (toPad.length < len) {
          toPad = " " + toPad;
        }
      }
    }
    return toPad;
  }

  function truncateAndPad(toTruncAndPad, truncation, padding) {
    var replacement = toTruncAndPad;
    replacement = truncate(truncation, replacement);
    replacement = pad(padding, replacement);
    return replacement;
  }

  return function(loggingEvent) {
    var formattedString = "";
    var result;
    var searchString = pattern;

    while ((result = regex.exec(searchString))) {
      var matchedString = result[0];
      var padding = result[1];
      var truncation = result[2];
      var conversionCharacter = result[3];
      var specifier = result[5];
      var text = result[6];

      // Check if the pattern matched was just normal text
      if (text) {
        formattedString += "" + text;
      } else {
        // Create a raw replacement string based on the conversion
        // character and specifier
        var replacement = replaceToken(conversionCharacter, loggingEvent, specifier);
        formattedString += truncateAndPad(replacement, truncation, padding);
      }
      searchString = searchString.substr(result.index + result[0].length);
    }
    return formattedString;
  };

}

module.exports = {
  basicLayout: basicLayout,
  messagePassThroughLayout: messagePassThroughLayout,
  patternLayout: patternLayout,
  colouredLayout: colouredLayout,
  coloredLayout: colouredLayout,
  dummyLayout: dummyLayout,
  addLayout: function(name, serializerGenerator) {
    layoutMakers[name] = serializerGenerator;
  },
  layout: function(name, config) {
    return layoutMakers[name] && layoutMakers[name](config);
  }
};


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @api private
 */

var contentDisposition = __webpack_require__(84);
var contentType = __webpack_require__(167);
var deprecate = __webpack_require__(18)('express');
var flatten = __webpack_require__(43);
var mime = __webpack_require__(78).mime;
var basename = __webpack_require__(5).basename;
var etag = __webpack_require__(87);
var proxyaddr = __webpack_require__(119);
var qs = __webpack_require__(121);
var querystring = __webpack_require__(335);

/**
 * Return strong ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.etag = function (body, encoding) {
  var buf = !Buffer.isBuffer(body)
    ? new Buffer(body, encoding)
    : body;

  return etag(buf, {weak: false});
};

/**
 * Return weak ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.wetag = function wetag(body, encoding){
  var buf = !Buffer.isBuffer(body)
    ? new Buffer(body, encoding)
    : body;

  return etag(buf, {weak: true});
};

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

exports.isAbsolute = function(path){
  if ('/' === path[0]) return true;
  if (':' === path[1] && ('\\' === path[2] || '/' === path[2])) return true; // Windows device path
  if ('\\\\' === path.substring(0, 2)) return true; // Microsoft Azure absolute path
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

exports.flatten = deprecate.function(flatten,
  'utils.flatten: use array-flatten npm module instead');

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */

exports.normalizeType = function(type){
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: mime.lookup(type), params: {} };
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types){
  var ret = [];

  for (var i = 0; i < types.length; ++i) {
    ret.push(exports.normalizeType(types[i]));
  }

  return ret;
};

/**
 * Generate Content-Disposition header appropriate for the filename.
 * non-ascii filenames are urlencoded and a filename* parameter is added
 *
 * @param {String} filename
 * @return {String}
 * @api private
 */

exports.contentDisposition = deprecate.function(contentDisposition,
  'utils.contentDisposition: use content-disposition npm module instead');

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 * also includes `.originalIndex` for stable sorting
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function acceptParams(str, index) {
  var parts = str.split(/ *; */);
  var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };

  for (var i = 1; i < parts.length; ++i) {
    var pms = parts[i].split(/ *= */);
    if ('q' === pms[0]) {
      ret.quality = parseFloat(pms[1]);
    } else {
      ret.params[pms[0]] = pms[1];
    }
  }

  return ret;
}

/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileETag = function(val) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
      fn = exports.wetag;
      break;
    case false:
      break;
    case 'strong':
      fn = exports.etag;
      break;
    case 'weak':
      fn = exports.wetag;
      break;
    default:
      throw new TypeError('unknown value for etag function: ' + val);
  }

  return fn;
}

/**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileQueryParser = function compileQueryParser(val) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
      fn = querystring.parse;
      break;
    case false:
      fn = newObject;
      break;
    case 'extended':
      fn = parseExtendedQueryString;
      break;
    case 'simple':
      fn = querystring.parse;
      break;
    default:
      throw new TypeError('unknown value for query parser function: ' + val);
  }

  return fn;
}

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */

exports.compileTrust = function(val) {
  if (typeof val === 'function') return val;

  if (val === true) {
    // Support plain true/false
    return function(){ return true };
  }

  if (typeof val === 'number') {
    // Support trusting hop count
    return function(a, i){ return i < val };
  }

  if (typeof val === 'string') {
    // Support comma-separated values
    val = val.split(/ *, */);
  }

  return proxyaddr.compile(val || []);
}

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */

exports.setCharset = function setCharset(type, charset) {
  if (!type || !charset) {
    return type;
  }

  // parse type
  var parsed = contentType.parse(type);

  // set charset
  parsed.parameters.charset = charset;

  // format type
  return contentType.format(parsed);
};

/**
 * Parse an extended query string with qs.
 *
 * @return {Object}
 * @private
 */

function parseExtendedQueryString(str) {
  return qs.parse(str, {
    allowPrototypes: true
  });
}

/**
 * Return new empty object.
 *
 * @return {Object}
 * @api private
 */

function newObject() {
  return {};
}


/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * depd
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var callSiteToString = __webpack_require__(86).callSiteToString
var eventListenerCount = __webpack_require__(86).eventListenerCount
var relative = __webpack_require__(5).relative

/**
 * Module exports.
 */

module.exports = depd

/**
 * Get the path to base files on.
 */

var basePath = process.cwd()

/**
 * Determine if namespace is contained in the string.
 */

function containsNamespace(str, namespace) {
  var val = str.split(/[ ,]+/)

  namespace = String(namespace).toLowerCase()

  for (var i = 0 ; i < val.length; i++) {
    if (!(str = val[i])) continue;

    // namespace contained
    if (str === '*' || str.toLowerCase() === namespace) {
      return true
    }
  }

  return false
}

/**
 * Convert a data descriptor to accessor descriptor.
 */

function convertDataDescriptorToAccessor(obj, prop, message) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, prop)
  var value = descriptor.value

  descriptor.get = function getter() { return value }

  if (descriptor.writable) {
    descriptor.set = function setter(val) { return value = val }
  }

  delete descriptor.value
  delete descriptor.writable

  Object.defineProperty(obj, prop, descriptor)

  return descriptor
}

/**
 * Create arguments string to keep arity.
 */

function createArgumentsString(arity) {
  var str = ''

  for (var i = 0; i < arity; i++) {
    str += ', arg' + i
  }

  return str.substr(2)
}

/**
 * Create stack string from stack.
 */

function createStackString(stack) {
  var str = this.name + ': ' + this.namespace

  if (this.message) {
    str += ' deprecated ' + this.message
  }

  for (var i = 0; i < stack.length; i++) {
    str += '\n    at ' + callSiteToString(stack[i])
  }

  return str
}

/**
 * Create deprecate for namespace in caller.
 */

function depd(namespace) {
  if (!namespace) {
    throw new TypeError('argument namespace is required')
  }

  var stack = getStack()
  var site = callSiteLocation(stack[1])
  var file = site[0]

  function deprecate(message) {
    // call to self as log
    log.call(deprecate, message)
  }

  deprecate._file = file
  deprecate._ignored = isignored(namespace)
  deprecate._namespace = namespace
  deprecate._traced = istraced(namespace)
  deprecate._warned = Object.create(null)

  deprecate.function = wrapfunction
  deprecate.property = wrapproperty

  return deprecate
}

/**
 * Determine if namespace is ignored.
 */

function isignored(namespace) {
  /* istanbul ignore next: tested in a child processs */
  if (process.noDeprecation) {
    // --no-deprecation support
    return true
  }

  var str = process.env.NO_DEPRECATION || ''

  // namespace ignored
  return containsNamespace(str, namespace)
}

/**
 * Determine if namespace is traced.
 */

function istraced(namespace) {
  /* istanbul ignore next: tested in a child processs */
  if (process.traceDeprecation) {
    // --trace-deprecation support
    return true
  }

  var str = process.env.TRACE_DEPRECATION || ''

  // namespace traced
  return containsNamespace(str, namespace)
}

/**
 * Display deprecation message.
 */

function log(message, site) {
  var haslisteners = eventListenerCount(process, 'deprecation') !== 0

  // abort early if no destination
  if (!haslisteners && this._ignored) {
    return
  }

  var caller
  var callFile
  var callSite
  var i = 0
  var seen = false
  var stack = getStack()
  var file = this._file

  if (site) {
    // provided site
    callSite = callSiteLocation(stack[1])
    callSite.name = site.name
    file = callSite[0]
  } else {
    // get call site
    i = 2
    site = callSiteLocation(stack[i])
    callSite = site
  }

  // get caller of deprecated thing in relation to file
  for (; i < stack.length; i++) {
    caller = callSiteLocation(stack[i])
    callFile = caller[0]

    if (callFile === file) {
      seen = true
    } else if (callFile === this._file) {
      file = this._file
    } else if (seen) {
      break
    }
  }

  var key = caller
    ? site.join(':') + '__' + caller.join(':')
    : undefined

  if (key !== undefined && key in this._warned) {
    // already warned
    return
  }

  this._warned[key] = true

  // generate automatic message from call site
  if (!message) {
    message = callSite === site || !callSite.name
      ? defaultMessage(site)
      : defaultMessage(callSite)
  }

  // emit deprecation if listeners exist
  if (haslisteners) {
    var err = DeprecationError(this._namespace, message, stack.slice(i))
    process.emit('deprecation', err)
    return
  }

  // format and write message
  var format = process.stderr.isTTY
    ? formatColor
    : formatPlain
  var msg = format.call(this, message, caller, stack.slice(i))
  process.stderr.write(msg + '\n', 'utf8')

  return
}

/**
 * Get call site location as array.
 */

function callSiteLocation(callSite) {
  var file = callSite.getFileName() || '<anonymous>'
  var line = callSite.getLineNumber()
  var colm = callSite.getColumnNumber()

  if (callSite.isEval()) {
    file = callSite.getEvalOrigin() + ', ' + file
  }

  var site = [file, line, colm]

  site.callSite = callSite
  site.name = callSite.getFunctionName()

  return site
}

/**
 * Generate a default message from the site.
 */

function defaultMessage(site) {
  var callSite = site.callSite
  var funcName = site.name

  // make useful anonymous name
  if (!funcName) {
    funcName = '<anonymous@' + formatLocation(site) + '>'
  }

  var context = callSite.getThis()
  var typeName = context && callSite.getTypeName()

  // ignore useless type name
  if (typeName === 'Object') {
    typeName = undefined
  }

  // make useful type name
  if (typeName === 'Function') {
    typeName = context.name || typeName
  }

  return typeName && callSite.getMethodName()
    ? typeName + '.' + funcName
    : funcName
}

/**
 * Format deprecation message without color.
 */

function formatPlain(msg, caller, stack) {
  var timestamp = new Date().toUTCString()

  var formatted = timestamp
    + ' ' + this._namespace
    + ' deprecated ' + msg

  // add stack trace
  if (this._traced) {
    for (var i = 0; i < stack.length; i++) {
      formatted += '\n    at ' + callSiteToString(stack[i])
    }

    return formatted
  }

  if (caller) {
    formatted += ' at ' + formatLocation(caller)
  }

  return formatted
}

/**
 * Format deprecation message with color.
 */

function formatColor(msg, caller, stack) {
  var formatted = '\x1b[36;1m' + this._namespace + '\x1b[22;39m' // bold cyan
    + ' \x1b[33;1mdeprecated\x1b[22;39m' // bold yellow
    + ' \x1b[0m' + msg + '\x1b[39m' // reset

  // add stack trace
  if (this._traced) {
    for (var i = 0; i < stack.length; i++) {
      formatted += '\n    \x1b[36mat ' + callSiteToString(stack[i]) + '\x1b[39m' // cyan
    }

    return formatted
  }

  if (caller) {
    formatted += ' \x1b[36m' + formatLocation(caller) + '\x1b[39m' // cyan
  }

  return formatted
}

/**
 * Format call site location.
 */

function formatLocation(callSite) {
  return relative(basePath, callSite[0])
    + ':' + callSite[1]
    + ':' + callSite[2]
}

/**
 * Get the stack as array of call sites.
 */

function getStack() {
  var limit = Error.stackTraceLimit
  var obj = {}
  var prep = Error.prepareStackTrace

  Error.prepareStackTrace = prepareObjectStackTrace
  Error.stackTraceLimit = Math.max(10, limit)

  // capture the stack
  Error.captureStackTrace(obj)

  // slice this function off the top
  var stack = obj.stack.slice(1)

  Error.prepareStackTrace = prep
  Error.stackTraceLimit = limit

  return stack
}

/**
 * Capture call site stack from v8.
 */

function prepareObjectStackTrace(obj, stack) {
  return stack
}

/**
 * Return a wrapped function in a deprecation message.
 */

function wrapfunction(fn, message) {
  if (typeof fn !== 'function') {
    throw new TypeError('argument fn must be a function')
  }

  var args = createArgumentsString(fn.length)
  var deprecate = this
  var stack = getStack()
  var site = callSiteLocation(stack[1])

  site.name = fn.name

  var deprecatedfn = eval('(function (' + args + ') {\n'
    + '"use strict"\n'
    + 'log.call(deprecate, message, site)\n'
    + 'return fn.apply(this, arguments)\n'
    + '})')

  return deprecatedfn
}

/**
 * Wrap property in a deprecation message.
 */

function wrapproperty(obj, prop, message) {
  if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
    throw new TypeError('argument obj must be object')
  }

  var descriptor = Object.getOwnPropertyDescriptor(obj, prop)

  if (!descriptor) {
    throw new TypeError('must call property on owner object')
  }

  if (!descriptor.configurable) {
    throw new TypeError('property must be configurable')
  }

  var deprecate = this
  var stack = getStack()
  var site = callSiteLocation(stack[1])

  // set site name
  site.name = prop

  // convert data descriptor
  if ('value' in descriptor) {
    descriptor = convertDataDescriptorToAccessor(obj, prop, message)
  }

  var get = descriptor.get
  var set = descriptor.set

  // wrap getter
  if (typeof get === 'function') {
    descriptor.get = function getter() {
      log.call(deprecate, message, site)
      return get.apply(this, arguments)
    }
  }

  // wrap setter
  if (typeof set === 'function') {
    descriptor.set = function setter() {
      log.call(deprecate, message, site)
      return set.apply(this, arguments)
    }
  }

  Object.defineProperty(obj, prop, descriptor)
}

/**
 * Create DeprecationError for deprecation
 */

function DeprecationError(namespace, message, stack) {
  var error = new Error()
  var stackString

  Object.defineProperty(error, 'constructor', {
    value: DeprecationError
  })

  Object.defineProperty(error, 'message', {
    configurable: true,
    enumerable: false,
    value: message,
    writable: true
  })

  Object.defineProperty(error, 'name', {
    enumerable: false,
    configurable: true,
    value: 'DeprecationError',
    writable: true
  })

  Object.defineProperty(error, 'namespace', {
    configurable: true,
    enumerable: false,
    value: namespace,
    writable: true
  })

  Object.defineProperty(error, 'stack', {
    configurable: true,
    enumerable: false,
    get: function () {
      if (stackString !== undefined) {
        return stackString
      }

      // prepare stack trace
      return stackString = createStackString.call(this, stack)
    },
    set: function setter(val) {
      stackString = val
    }
  })

  return error
}


/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(8);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(209);
}


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Level(level, levelStr) {
  this.level = level;
  this.levelStr = levelStr;
}

/**
 * converts given String to corresponding Level
 * @param {String} sArg String value of Level OR Log4js.Level
 * @param {Log4js.Level} defaultLevel default Level, if no String representation
 * @return Level object
 * @type Log4js.Level
 */
function toLevel(sArg, defaultLevel) {
  if (!sArg) {
    return defaultLevel;
  }
  if (sArg instanceof Level) {
    module.exports[sArg.toString()] = sArg;
    return sArg;
  }
  if (typeof sArg === "string") {
    return module.exports[sArg.toUpperCase()] || defaultLevel;
  }
  return toLevel(sArg.toString());
}

Level.prototype.toString = function() {
  return this.levelStr;
};

Level.prototype.isLessThanOrEqualTo = function(otherLevel) {
  if (typeof otherLevel === "string") {
    otherLevel = toLevel(otherLevel);
  }
  return this.level <= otherLevel.level;
};

Level.prototype.isGreaterThanOrEqualTo = function(otherLevel) {
  if (typeof otherLevel === "string") {
    otherLevel = toLevel(otherLevel);
  }
  return this.level >= otherLevel.level;
};

Level.prototype.isEqualTo = function(otherLevel) {
  if (typeof otherLevel === "string") {
    otherLevel = toLevel(otherLevel);
  }
  return this.level === otherLevel.level;
};

module.exports = {
  ALL: new Level(Number.MIN_VALUE, "ALL"),
  TRACE: new Level(5000, "TRACE"),
  DEBUG: new Level(10000, "DEBUG"),
  INFO: new Level(20000, "INFO"),
  WARN: new Level(30000, "WARN"),
  ERROR: new Level(40000, "ERROR"),
  FATAL: new Level(50000, "FATAL"),
  MARK: new Level(9007199254740992, "MARK"), // 2^53
  OFF: new Level(Number.MAX_VALUE, "OFF"),
  toLevel: toLevel,
  Level: Level
};


/***/ }),
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = __webpack_require__(32);
util.inherits = __webpack_require__(23);
/*</replacement>*/

var Readable = __webpack_require__(152);
var Writable = __webpack_require__(154);

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(187);
} else {
  module.exports = __webpack_require__(188);
}


/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview log4js is a library to log in JavaScript in similar manner
 * than in log4j for Java. The API should be nearly the same.
 *
 * <h3>Example:</h3>
 * <pre>
 *  var logging = require('log4js');
 *  //add an appender that logs all messages to stdout.
 *  logging.addAppender(logging.consoleAppender());
 *  //add an appender that logs "some-category" to a file
 *  logging.addAppender(logging.fileAppender("file.log"), "some-category");
 *  //get a logger
 *  var log = logging.getLogger("some-category");
 *  log.setLevel(logging.levels.TRACE); //set the Level
 *
 *  ...
 *
 *  //call the log
 *  log.trace("trace me" );
 * </pre>
 *
 * NOTE: the authors below are the original browser-based log4js authors
 * don't try to contact them about bugs in this version :)
 * @version 1.0
 * @author Stephan Strittmatter - http://jroller.com/page/stritti
 * @author Seth Chisamore - http://www.chisamore.com
 * @since 2005-05-20
 * @static
 * Website: http://log4js.berlios.de
 */
var events = __webpack_require__(29)
, fs = __webpack_require__(7)
, path = __webpack_require__(5)
, util = __webpack_require__(8)
, layouts = __webpack_require__(9)
, levels = __webpack_require__(24)
, loggerModule = __webpack_require__(216)
, LoggingEvent = loggerModule.LoggingEvent
, Logger = loggerModule.Logger
, ALL_CATEGORIES = '[all]'
, appenders = {}
, loggers = {}
, appenderMakers = {}
, appenderShutdowns = {}
, defaultConfig =   {
  appenders: [
    { type: "stdout" }
  ],
  replaceConsole: false
};

function hasLogger(logger) {
  return loggers.hasOwnProperty(logger);
}

levels.forName = function(levelStr, levelVal) {
  var level;
  if (typeof levelStr === "string" && typeof levelVal === "number") {
    var levelUpper = levelStr.toUpperCase();
    level = new levels.Level(levelVal, levelUpper);
    loggerModule.addLevelMethods(level);
  }
  return level;
};

levels.getLevel = function(levelStr) {
  var level;
  if (typeof levelStr === "string") {
    var levelUpper = levelStr.toUpperCase();
    level = levels.toLevel(levelStr);
  }
  return level;
};

function getBufferedLogger(categoryName) {
    var base_logger = getLogger(categoryName);
    var logger = {};
    logger.temp = [];
    logger.target = base_logger;
    logger.flush = function () {
        for (var i = 0; i < logger.temp.length; i++) {
            var log = logger.temp[i];
            logger.target[log.level](log.message);
            delete logger.temp[i];
        }
    };
    logger.trace = function (message) { logger.temp.push({level: 'trace', message: message}); };
    logger.debug = function (message) { logger.temp.push({level: 'debug', message: message}); };
    logger.info = function (message) { logger.temp.push({level: 'info', message: message}); };
    logger.warn = function (message) { logger.temp.push({level: 'warn', message: message}); };
    logger.error = function (message) { logger.temp.push({level: 'error', message: message}); };
    logger.fatal = function (message) { logger.temp.push({level: 'fatal', message: message}); };

    return logger;
}

function normalizeCategory (category) {
  return  category + '.';
}

function doesLevelEntryContainsLogger (levelCategory, loggerCategory) {
  var normalizedLevelCategory = normalizeCategory(levelCategory);
  var normalizedLoggerCategory = normalizeCategory(loggerCategory);
  return normalizedLoggerCategory.substring(0, normalizedLevelCategory.length) == normalizedLevelCategory; //jshint ignore:line
}

function doesAppenderContainsLogger (appenderCategory, loggerCategory) {
  var normalizedAppenderCategory = normalizeCategory(appenderCategory);
  var normalizedLoggerCategory = normalizeCategory(loggerCategory);
  return normalizedLoggerCategory.substring(0, normalizedAppenderCategory.length) == normalizedAppenderCategory; //jshint ignore:line
}


/**
 * Get a logger instance. Instance is cached on categoryName level.
 * @param  {String} categoryName name of category to log to.
 * @return {Logger} instance of logger for the category
 * @static
 */
function getLogger (loggerCategoryName) {

  // Use default logger if categoryName is not specified or invalid
  if (typeof loggerCategoryName !== "string") {
    loggerCategoryName = Logger.DEFAULT_CATEGORY;
  }

  if (!hasLogger(loggerCategoryName)) {

    var level;

    /* jshint -W073 */
    // If there's a "levels" entry in the configuration
    if (levels.config) {
      // Goes through the categories in the levels configuration entry,
      // starting with the "higher" ones.
      var keys = Object.keys(levels.config).sort();
      for (var idx = 0; idx < keys.length; idx++) {
        var levelCategory = keys[idx];
        if (doesLevelEntryContainsLogger(levelCategory, loggerCategoryName)) {
          // level for the logger
          level = levels.config[levelCategory];
        }
      }
    }
    /* jshint +W073 */

    // Create the logger for this name if it doesn't already exist
    loggers[loggerCategoryName] = new Logger(loggerCategoryName, level);

    /* jshint -W083 */
    var appenderList;
    for(var appenderCategory in appenders) {
      if (doesAppenderContainsLogger(appenderCategory, loggerCategoryName)) {
        appenderList = appenders[appenderCategory];
        appenderList.forEach(function(appender) {
          loggers[loggerCategoryName].addListener("log", appender);
        });
      }
    }
    /* jshint +W083 */

    if (appenders[ALL_CATEGORIES]) {
      appenderList = appenders[ALL_CATEGORIES];
      appenderList.forEach(function(appender) {
        loggers[loggerCategoryName].addListener("log", appender);
      });
    }
  }

  return loggers[loggerCategoryName];
}

/**
 * args are appender, optional shutdown function, then zero or more categories
 */
function addAppender () {
  var args = Array.prototype.slice.call(arguments);
  var appender = args.shift();
  //check for a shutdown fn
  if (args.length > 0 && typeof args[0] === 'function') {
    appenderShutdowns[appender] = args.shift();
  }

  if (args.length === 0 || args[0] === undefined) {
    args = [ ALL_CATEGORIES ];
  }
  //argument may already be an array
  if (Array.isArray(args[0])) {
    args = args[0];
  }

  args.forEach(function(appenderCategory) {
    addAppenderToCategory(appender, appenderCategory);

    if (appenderCategory === ALL_CATEGORIES) {
      addAppenderToAllLoggers(appender);
    } else {

      for(var loggerCategory in loggers) {
        if (doesAppenderContainsLogger(appenderCategory,loggerCategory)) {
          loggers[loggerCategory].addListener("log", appender);
        }
      }

    }
  });
}

function addAppenderToAllLoggers(appender) {
  for (var logger in loggers) {
    if (hasLogger(logger)) {
      loggers[logger].addListener("log", appender);
    }
  }
}

function addAppenderToCategory(appender, category) {
  if (!appenders[category]) {
    appenders[category] = [];
  }
  appenders[category].push(appender);
}

function clearAppenders () {
  //if we're calling clearAppenders, we're probably getting ready to write
  //so turn log writes back on, just in case this is after a shutdown
  loggerModule.enableAllLogWrites();
  appenders = {};
  for (var logger in loggers) {
    if (hasLogger(logger)) {
      loggers[logger].removeAllListeners("log");
    }
  }
}

function configureAppenders(appenderList, options) {
  clearAppenders();
  if (appenderList) {
    appenderList.forEach(function(appenderConfig) {
      loadAppender(appenderConfig.type);
      var appender;
      appenderConfig.makers = appenderMakers;
      try {
        appender = appenderMakers[appenderConfig.type](appenderConfig, options);
        addAppender(appender, appenderConfig.category);
      } catch(e) {
        throw new Error("log4js configuration problem for " + util.inspect(appenderConfig), e);
      }
    });
  }
}

function configureLevels(_levels) {
  levels.config = _levels; // Keep it so we can create loggers later using this cfg
  if (_levels) {
    var keys = Object.keys(levels.config).sort();
    for (var idx in keys) {
      var category = keys[idx];
      if(category === ALL_CATEGORIES) {
        setGlobalLogLevel(_levels[category]);
      }
      /* jshint -W073 */
      for(var loggerCategory in loggers) {
        if (doesLevelEntryContainsLogger(category, loggerCategory)) {
          loggers[loggerCategory].setLevel(_levels[category]);
        }
      }
      /* jshint +W073 */
    }
  }
}

function setGlobalLogLevel(level) {
  Logger.prototype.level = levels.toLevel(level, levels.TRACE);
}

/**
 * Get the default logger instance.
 * @return {Logger} instance of default logger
 * @static
 */
function getDefaultLogger () {
  return getLogger(Logger.DEFAULT_CATEGORY);
}

var configState = {};

function loadConfigurationFile(filename) {
  if (filename) {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  }
  return undefined;
}

function configureOnceOff(config, options) {
  if (config) {
    try {
      restoreConsole();
      configureLevels(config.levels);
      configureAppenders(config.appenders, options);

      if (config.replaceConsole) {
        replaceConsole();
      }
    } catch (e) {
      throw new Error(
        "Problem reading log4js config " + util.inspect(config) +
          ". Error was \"" + e.message + "\" (" + e.stack + ")"
      );
    }
  }
}

function reloadConfiguration(options) {
  var mtime = getMTime(configState.filename);
  if (!mtime) return;

  if (configState.lastMTime && (mtime.getTime() > configState.lastMTime.getTime())) {
    configureOnceOff(loadConfigurationFile(configState.filename), options);
  }
  configState.lastMTime = mtime;
}

function getMTime(filename) {
  var mtime;
  try {
    mtime = fs.statSync(configState.filename).mtime;
  } catch (e) {
    getLogger('log4js').warn('Failed to load configuration file ' + filename);
  }
  return mtime;
}

function initReloadConfiguration(filename, options) {
  if (configState.timerId) {
    clearInterval(configState.timerId);
    delete configState.timerId;
  }
  configState.filename = filename;
  configState.lastMTime = getMTime(filename);
  configState.timerId = setInterval(reloadConfiguration, options.reloadSecs*1000, options);
}

function configure(configurationFileOrObject, options) {
  var config = configurationFileOrObject;
  config = config || process.env.LOG4JS_CONFIG;
  options = options || {};

  if (config === undefined || config === null || typeof(config) === 'string') {
    if (options.reloadSecs) {
      initReloadConfiguration(config, options);
    }
    config = loadConfigurationFile(config) || defaultConfig;
  } else {
    if (options.reloadSecs) {
      getLogger('log4js').warn(
        'Ignoring configuration reload parameter for "object" configuration.'
      );
    }
  }
  configureOnceOff(config, options);
}

var originalConsoleFunctions = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};

function replaceConsole(logger) {
  function replaceWith(fn) {
    return function() {
      fn.apply(logger, arguments);
    };
  }
  logger = logger || getLogger("console");
  ['log','debug','info','warn','error'].forEach(function (item) {
    console[item] = replaceWith(item === 'log' ? logger.info : logger[item]);
  });
}

function restoreConsole() {
  ['log', 'debug', 'info', 'warn', 'error'].forEach(function (item) {
    console[item] = originalConsoleFunctions[item];
  });
}

/**
 * Load an appenderModule based on the provided appender filepath. Will first
 * check if the appender path is a subpath of the log4js "lib/appenders" directory.
 * If not, it will attempt to load the the appender as complete path.
 *
 * @param {string} appender The filepath for the appender.
 * @returns {Object|null} The required appender or null if appender could not be loaded.
 * @private
 */
function requireAppender(appender) {
  var appenderModule;
  try {
    appenderModule = __webpack_require__(213)("./" + appender);
  } catch (e) {
    appenderModule = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
  }
  return appenderModule;
}

/**
 * Load an appender. Provided the appender path to be loaded. If appenderModule is defined,
 * it will be used in place of requiring the appender module.
 *
 * @param {string} appender The path to the appender module.
 * @param {Object|void} [appenderModule] The pre-required appender module. When provided,
 * instead of requiring the appender by its path, this object will be used.
 * @returns {void}
 * @private
 */
function loadAppender(appender, appenderModule) {
  appenderModule = appenderModule || requireAppender(appender);

  if (!appenderModule) {
    throw new Error("Invalid log4js appender: " + util.inspect(appender));
  }

  module.exports.appenders[appender] = appenderModule.appender.bind(appenderModule);
  if (appenderModule.shutdown) {
    appenderShutdowns[appender] = appenderModule.shutdown.bind(appenderModule);
  }
  appenderMakers[appender] = appenderModule.configure.bind(appenderModule);
}

/**
 * Shutdown all log appenders. This will first disable all writing to appenders
 * and then call the shutdown function each appender.
 *
 * @params {Function} cb - The callback to be invoked once all appenders have
 *  shutdown. If an error occurs, the callback will be given the error object
 *  as the first argument.
 * @returns {void}
 */
function shutdown(cb) {
  // First, disable all writing to appenders. This prevents appenders from
  // not being able to be drained because of run-away log writes.
  loggerModule.disableAllLogWrites();

  //turn off config reloading
  if (configState.timerId) {
    clearInterval(configState.timerId);
  }

  // Call each of the shutdown functions in parallel
  var completed = 0;
  var error;
  var shutdownFcts = [];
  var complete = function(err) {
    error = error || err;
    completed++;
    if (completed >= shutdownFcts.length) {
      cb(error);
    }
  };
  for (var category in appenderShutdowns) {
    if (appenderShutdowns.hasOwnProperty(category)) {
      shutdownFcts.push(appenderShutdowns[category]);
    }
  }
  if (!shutdownFcts.length) {
    return cb();
  }
  shutdownFcts.forEach(function(shutdownFct) { shutdownFct(complete); });
}

module.exports = {
  getBufferedLogger: getBufferedLogger,
  getLogger: getLogger,
  getDefaultLogger: getDefaultLogger,
  hasLogger: hasLogger,

  addAppender: addAppender,
  loadAppender: loadAppender,
  clearAppenders: clearAppenders,
  configure: configure,
  shutdown: shutdown,

  replaceConsole: replaceConsole,
  restoreConsole: restoreConsole,

  levels: levels,
  setGlobalLogLevel: setGlobalLogLevel,

  layouts: layouts,
  appenders: {},
  appenderMakers: appenderMakers,
  connectLogger: __webpack_require__(214).connectLogger
};

//set ourselves up
configure();


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 */

var url = __webpack_require__(157)
var parse = url.parse
var Url = url.Url

/**
 * Pattern for a simple path case.
 * See: https://github.com/joyent/node/pull/7878
 */

var simplePathRegExp = /^(\/\/?(?!\/)[^\?#\s]*)(\?[^#\s]*)?$/

/**
 * Exports.
 */

module.exports = parseurl
module.exports.original = originalurl

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @api public
 */

function parseurl(req) {
  var url = req.url

  if (url === undefined) {
    // URL is undefined
    return undefined
  }

  var parsed = req._parsedUrl

  if (fresh(url, parsed)) {
    // Return cached URL parse
    return parsed
  }

  // Parse the URL
  parsed = fastparse(url)
  parsed._raw = url

  return req._parsedUrl = parsed
};

/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @api public
 */

function originalurl(req) {
  var url = req.originalUrl

  if (typeof url !== 'string') {
    // Fallback
    return parseurl(req)
  }

  var parsed = req._parsedOriginalUrl

  if (fresh(url, parsed)) {
    // Return cached URL parse
    return parsed
  }

  // Parse the URL
  parsed = fastparse(url)
  parsed._raw = url

  return req._parsedOriginalUrl = parsed
};

/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @api private
 */

function fastparse(str) {
  // Try fast path regexp
  // See: https://github.com/joyent/node/pull/7878
  var simplePath = typeof str === 'string' && simplePathRegExp.exec(str)

  // Construct simple URL
  if (simplePath) {
    var pathname = simplePath[1]
    var search = simplePath[2] || null
    var url = Url !== undefined
      ? new Url()
      : {}
    url.path = str
    url.href = str
    url.pathname = pathname
    url.search = search
    url.query = search && search.substr(1)

    return url
  }

  return parse(str)
}

/**
 * Determine if parsed is still fresh for url.
 *
 * @param {string} url
 * @param {object} parsedUrl
 * @return {boolean}
 * @api private
 */

function fresh(url, parsedUrl) {
  return typeof parsedUrl === 'object'
    && parsedUrl !== null
    && (Url === undefined || parsedUrl instanceof Url)
    && parsedUrl._raw === url
}


/***/ }),
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Expose `arrayFlatten`.
 */
module.exports = arrayFlatten

/**
 * Recursive flatten function with depth.
 *
 * @param  {Array}  array
 * @param  {Array}  result
 * @param  {Number} depth
 * @return {Array}
 */
function flattenWithDepth (array, result, depth) {
  for (var i = 0; i < array.length; i++) {
    var value = array[i]

    if (depth > 0 && Array.isArray(value)) {
      flattenWithDepth(value, result, depth - 1)
    } else {
      result.push(value)
    }
  }

  return result
}

/**
 * Recursive flatten function. Omitting depth is slightly faster.
 *
 * @param  {Array} array
 * @param  {Array} result
 * @return {Array}
 */
function flattenForever (array, result) {
  for (var i = 0; i < array.length; i++) {
    var value = array[i]

    if (Array.isArray(value)) {
      flattenForever(value, result)
    } else {
      result.push(value)
    }
  }

  return result
}

/**
 * Flatten an array, with the ability to define a depth.
 *
 * @param  {Array}  array
 * @param  {Number} depth
 * @return {Array}
 */
function arrayFlatten (array, depth) {
  if (depth == null) {
    return flattenForever(array, [])
  }

  return flattenWithDepth(array, [], depth)
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(171);
} else {
  module.exports = __webpack_require__(172);
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * encodeurl
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = encodeUrl

/**
 * RegExp to match non-URL code points, *after* encoding (i.e. not including "%")
 * and including invalid escape sequences.
 * @private
 */

var ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]))+/g

/**
 * RegExp to match unmatched surrogate pair.
 * @private
 */

var UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g

/**
 * String to replace unmatched surrogate pair with.
 * @private
 */

var UNMATCHED_SURROGATE_PAIR_REPLACE = '$1\uFFFD$2'

/**
 * Encode a URL to a percent-encoded form, excluding already-encoded sequences.
 *
 * This function will take an already-encoded URL and encode all the non-URL
 * code points. This function will not encode the "%" character unless it is
 * not part of a valid sequence (`%20` will be left as-is, but `%foo` will
 * be encoded as `%25foo`).
 *
 * This encode is meant to be "safe" and does not throw errors. It will try as
 * hard as it can to properly encode the given URL, including replacing any raw,
 * unpaired surrogate pairs with the Unicode replacement character prior to
 * encoding.
 *
 * @param {string} url
 * @return {string}
 * @public
 */

function encodeUrl (url) {
  return String(url)
    .replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE)
    .replace(ENCODE_CHARS_REGEXP, encodeURI)
}


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */



/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}


/***/ }),
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */
/***/ (function(module, exports) {

module.exports = Object.setPrototypeOf || ({__proto__:[]} instanceof Array ? setProtoOf : mixinProperties);

function setProtoOf(obj, proto) {
	obj.__proto__ = proto;
	return obj;
}

function mixinProperties(obj, proto) {
	for (var prop in proto) {
		if (!obj.hasOwnProperty(prop)) {
			obj[prop] = proto[prop];
		}
	}
	return obj;
}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var codes = __webpack_require__(323)

/**
 * Module exports.
 * @public
 */

module.exports = status

// array of status codes
status.codes = populateStatusesMap(status, codes)

// status codes for redirects
status.redirect = {
  300: true,
  301: true,
  302: true,
  303: true,
  305: true,
  307: true,
  308: true
}

// status codes for empty bodies
status.empty = {
  204: true,
  205: true,
  304: true
}

// status codes for when you should retry the request
status.retry = {
  502: true,
  503: true,
  504: true
}

/**
 * Populate the statuses map for given codes.
 * @private
 */

function populateStatusesMap (statuses, codes) {
  var arr = []

  Object.keys(codes).forEach(function forEachCode (code) {
    var message = codes[code]
    var status = Number(code)

    // Populate properties
    statuses[status] = message
    statuses[message] = status
    statuses[message.toLowerCase()] = status

    // Add to array
    arr.push(status)
  })

  return arr
}

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */

function status (code) {
  if (typeof code === 'number') {
    if (!status[code]) throw new Error('invalid status code: ' + code)
    return code
  }

  if (typeof code !== 'string') {
    throw new TypeError('code must be a number or string')
  }

  // '403'
  var n = parseInt(code, 10)
  if (!isNaN(n)) {
    if (!status[n]) throw new Error('invalid status code: ' + n)
    return n
  }

  n = status[code.toLowerCase()]
  if (!n) throw new Error('invalid status message: "' + code + '"')
  return n
}


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * methods
 * Copyright(c) 2013-2014 TJ Holowaychuk
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var http = __webpack_require__(57);

/**
 * Module exports.
 * @public
 */

module.exports = getCurrentNodeMethods() || getBasicNodeMethods();

/**
 * Get the current Node.js methods.
 * @private
 */

function getCurrentNodeMethods() {
  return http.METHODS && http.METHODS.map(function lowerCaseMethod(method) {
    return method.toLowerCase();
  });
}

/**
 * Get the "basic" Node.js methods, a snapshot from Node.js 0.10.
 * @private
 */

function getBasicNodeMethods() {
  return [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect'
  ];
}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * on-finished
 * Copyright(c) 2013 Jonathan Ong
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = onFinished
module.exports.isFinished = isFinished

/**
 * Module dependencies.
 * @private
 */

var first = __webpack_require__(177)

/**
 * Variables.
 * @private
 */

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

/**
 * Invoke callback when the response has finished, useful for
 * cleaning up resources afterwards.
 *
 * @param {object} msg
 * @param {function} listener
 * @return {object}
 * @public
 */

function onFinished(msg, listener) {
  if (isFinished(msg) !== false) {
    defer(listener, null, msg)
    return msg
  }

  // attach the listener to the message
  attachListener(msg, listener)

  return msg
}

/**
 * Determine if message is already finished.
 *
 * @param {object} msg
 * @return {boolean}
 * @public
 */

function isFinished(msg) {
  var socket = msg.socket

  if (typeof msg.finished === 'boolean') {
    // OutgoingMessage
    return Boolean(msg.finished || (socket && !socket.writable))
  }

  if (typeof msg.complete === 'boolean') {
    // IncomingMessage
    return Boolean(msg.upgrade || !socket || !socket.readable || (msg.complete && !msg.readable))
  }

  // don't know
  return undefined
}

/**
 * Attach a finished listener to the message.
 *
 * @param {object} msg
 * @param {function} callback
 * @private
 */

function attachFinishedListener(msg, callback) {
  var eeMsg
  var eeSocket
  var finished = false

  function onFinish(error) {
    eeMsg.cancel()
    eeSocket.cancel()

    finished = true
    callback(error)
  }

  // finished on first message event
  eeMsg = eeSocket = first([[msg, 'end', 'finish']], onFinish)

  function onSocket(socket) {
    // remove listener
    msg.removeListener('socket', onSocket)

    if (finished) return
    if (eeMsg !== eeSocket) return

    // finished on first socket event
    eeSocket = first([[socket, 'error', 'close']], onFinish)
  }

  if (msg.socket) {
    // socket already assigned
    onSocket(msg.socket)
    return
  }

  // wait for socket to be assigned
  msg.on('socket', onSocket)

  if (msg.socket === undefined) {
    // node.js 0.8 patch
    patchAssignSocket(msg, onSocket)
  }
}

/**
 * Attach the listener to the message.
 *
 * @param {object} msg
 * @return {function}
 * @private
 */

function attachListener(msg, listener) {
  var attached = msg.__onFinished

  // create a private single listener with queue
  if (!attached || !attached.queue) {
    attached = msg.__onFinished = createListener(msg)
    attachFinishedListener(msg, attached)
  }

  attached.queue.push(listener)
}

/**
 * Create listener on message.
 *
 * @param {object} msg
 * @return {function}
 * @private
 */

function createListener(msg) {
  function listener(err) {
    if (msg.__onFinished === listener) msg.__onFinished = null
    if (!listener.queue) return

    var queue = listener.queue
    listener.queue = null

    for (var i = 0; i < queue.length; i++) {
      queue[i](err, msg)
    }
  }

  listener.queue = []

  return listener
}

/**
 * Patch ServerResponse.prototype.assignSocket for node.js 0.8.
 *
 * @param {ServerResponse} res
 * @param {function} callback
 * @private
 */

function patchAssignSocket(res, callback) {
  var assignSocket = res.assignSocket

  if (typeof assignSocket !== 'function') return

  // res.on('socket', callback) is broken in 0.8
  res.assignSocket = function _assignSocket(socket) {
    assignSocket.call(this, socket)
    callback(socket)
  }
}


/***/ }),
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * send
 * Copyright(c) 2012 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var createError = __webpack_require__(208)
var debug = __webpack_require__(320)('send')
var deprecate = __webpack_require__(18)('send')
var destroy = __webpack_require__(176)
var encodeUrl = __webpack_require__(45)
var escapeHtml = __webpack_require__(46)
var etag = __webpack_require__(87)
var EventEmitter = __webpack_require__(29).EventEmitter
var fresh = __webpack_require__(97)
var fs = __webpack_require__(7)
var mime = __webpack_require__(221)
var ms = __webpack_require__(36)
var onFinished = __webpack_require__(60)
var parseRange = __webpack_require__(123)
var path = __webpack_require__(5)
var statuses = __webpack_require__(55)
var Stream = __webpack_require__(31)
var util = __webpack_require__(8)

/**
 * Path function references.
 * @private
 */

var extname = path.extname
var join = path.join
var normalize = path.normalize
var resolve = path.resolve
var sep = path.sep

/**
 * Regular expression for identifying a bytes Range header.
 * @private
 */

var BYTES_RANGE_REGEXP = /^ *bytes=/

/**
 * Simple expression to split token list.
 * @private
 */

var TOKEN_LIST_REGEXP = / *, */

/**
 * Maximum value allowed for the max age.
 * @private
 */

var MAX_MAXAGE = 60 * 60 * 24 * 365 * 1000 // 1 year

/**
 * Regular expression to match a path with a directory up component.
 * @private
 */

var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * Module exports.
 * @public
 */

module.exports = send
module.exports.mime = mime

/**
 * Shim EventEmitter.listenerCount for node.js < 0.10
 */

/* istanbul ignore next */
var listenerCount = EventEmitter.listenerCount ||
  function (emitter, type) { return emitter.listeners(type).length }

/**
 * Return a `SendStream` for `req` and `path`.
 *
 * @param {object} req
 * @param {string} path
 * @param {object} [options]
 * @return {SendStream}
 * @public
 */

function send (req, path, options) {
  return new SendStream(req, path, options)
}

/**
 * Initialize a `SendStream` with the given `path`.
 *
 * @param {Request} req
 * @param {String} path
 * @param {object} [options]
 * @private
 */

function SendStream (req, path, options) {
  Stream.call(this)

  var opts = options || {}

  this.options = opts
  this.path = path
  this.req = req

  this._acceptRanges = opts.acceptRanges !== undefined
    ? Boolean(opts.acceptRanges)
    : true

  this._cacheControl = opts.cacheControl !== undefined
    ? Boolean(opts.cacheControl)
    : true

  this._etag = opts.etag !== undefined
    ? Boolean(opts.etag)
    : true

  this._dotfiles = opts.dotfiles !== undefined
    ? opts.dotfiles
    : 'ignore'

  if (this._dotfiles !== 'ignore' && this._dotfiles !== 'allow' && this._dotfiles !== 'deny') {
    throw new TypeError('dotfiles option must be "allow", "deny", or "ignore"')
  }

  this._hidden = Boolean(opts.hidden)

  if (opts.hidden !== undefined) {
    deprecate('hidden: use dotfiles: \'' + (this._hidden ? 'allow' : 'ignore') + '\' instead')
  }

  // legacy support
  if (opts.dotfiles === undefined) {
    this._dotfiles = undefined
  }

  this._extensions = opts.extensions !== undefined
    ? normalizeList(opts.extensions, 'extensions option')
    : []

  this._index = opts.index !== undefined
    ? normalizeList(opts.index, 'index option')
    : ['index.html']

  this._lastModified = opts.lastModified !== undefined
    ? Boolean(opts.lastModified)
    : true

  this._maxage = opts.maxAge || opts.maxage
  this._maxage = typeof this._maxage === 'string'
    ? ms(this._maxage)
    : Number(this._maxage)
  this._maxage = !isNaN(this._maxage)
    ? Math.min(Math.max(0, this._maxage), MAX_MAXAGE)
    : 0

  this._root = opts.root
    ? resolve(opts.root)
    : null

  if (!this._root && opts.from) {
    this.from(opts.from)
  }
}

/**
 * Inherits from `Stream`.
 */

util.inherits(SendStream, Stream)

/**
 * Enable or disable etag generation.
 *
 * @param {Boolean} val
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.etag = deprecate.function(function etag (val) {
  this._etag = Boolean(val)
  debug('etag %s', this._etag)
  return this
}, 'send.etag: pass etag as option')

/**
 * Enable or disable "hidden" (dot) files.
 *
 * @param {Boolean} path
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.hidden = deprecate.function(function hidden (val) {
  this._hidden = Boolean(val)
  this._dotfiles = undefined
  debug('hidden %s', this._hidden)
  return this
}, 'send.hidden: use dotfiles option')

/**
 * Set index `paths`, set to a falsy
 * value to disable index support.
 *
 * @param {String|Boolean|Array} paths
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.index = deprecate.function(function index (paths) {
  var index = !paths ? [] : normalizeList(paths, 'paths argument')
  debug('index %o', paths)
  this._index = index
  return this
}, 'send.index: pass index as option')

/**
 * Set root `path`.
 *
 * @param {String} path
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.root = function root (path) {
  this._root = resolve(String(path))
  debug('root %s', this._root)
  return this
}

SendStream.prototype.from = deprecate.function(SendStream.prototype.root,
  'send.from: pass root as option')

SendStream.prototype.root = deprecate.function(SendStream.prototype.root,
  'send.root: pass root as option')

/**
 * Set max-age to `maxAge`.
 *
 * @param {Number} maxAge
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.maxage = deprecate.function(function maxage (maxAge) {
  this._maxage = typeof maxAge === 'string'
    ? ms(maxAge)
    : Number(maxAge)
  this._maxage = !isNaN(this._maxage)
    ? Math.min(Math.max(0, this._maxage), MAX_MAXAGE)
    : 0
  debug('max-age %d', this._maxage)
  return this
}, 'send.maxage: pass maxAge as option')

/**
 * Emit error with `status`.
 *
 * @param {number} status
 * @param {Error} [err]
 * @private
 */

SendStream.prototype.error = function error (status, err) {
  // emit if listeners instead of responding
  if (listenerCount(this, 'error') !== 0) {
    return this.emit('error', createError(status, err, {
      expose: false
    }))
  }

  var res = this.res
  var msg = statuses[status] || String(status)
  var doc = createHtmlDocument('Error', escapeHtml(msg))

  // clear existing headers
  clearHeaders(res)

  // add error headers
  if (err && err.headers) {
    setHeaders(res, err.headers)
  }

  // send basic response
  res.statusCode = status
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Content-Length', Buffer.byteLength(doc))
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.end(doc)
}

/**
 * Check if the pathname ends with "/".
 *
 * @return {boolean}
 * @private
 */

SendStream.prototype.hasTrailingSlash = function hasTrailingSlash () {
  return this.path[this.path.length - 1] === '/'
}

/**
 * Check if this is a conditional GET request.
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.isConditionalGET = function isConditionalGET () {
  return this.req.headers['if-match'] ||
    this.req.headers['if-unmodified-since'] ||
    this.req.headers['if-none-match'] ||
    this.req.headers['if-modified-since']
}

/**
 * Check if the request preconditions failed.
 *
 * @return {boolean}
 * @private
 */

SendStream.prototype.isPreconditionFailure = function isPreconditionFailure () {
  var req = this.req
  var res = this.res

  // if-match
  var match = req.headers['if-match']
  if (match) {
    var etag = res.getHeader('ETag')
    return !etag || (match !== '*' && match.split(TOKEN_LIST_REGEXP).every(function (match) {
      return match !== etag && match !== 'W/' + etag && 'W/' + match !== etag
    }))
  }

  // if-unmodified-since
  var unmodifiedSince = parseHttpDate(req.headers['if-unmodified-since'])
  if (!isNaN(unmodifiedSince)) {
    var lastModified = parseHttpDate(res.getHeader('Last-Modified'))
    return isNaN(lastModified) || lastModified > unmodifiedSince
  }

  return false
}

/**
 * Strip content-* header fields.
 *
 * @private
 */

SendStream.prototype.removeContentHeaderFields = function removeContentHeaderFields () {
  var res = this.res
  var headers = getHeaderNames(res)

  for (var i = 0; i < headers.length; i++) {
    var header = headers[i]
    if (header.substr(0, 8) === 'content-' && header !== 'content-location') {
      res.removeHeader(header)
    }
  }
}

/**
 * Respond with 304 not modified.
 *
 * @api private
 */

SendStream.prototype.notModified = function notModified () {
  var res = this.res
  debug('not modified')
  this.removeContentHeaderFields()
  res.statusCode = 304
  res.end()
}

/**
 * Raise error that headers already sent.
 *
 * @api private
 */

SendStream.prototype.headersAlreadySent = function headersAlreadySent () {
  var err = new Error('Can\'t set headers after they are sent.')
  debug('headers already sent')
  this.error(500, err)
}

/**
 * Check if the request is cacheable, aka
 * responded with 2xx or 304 (see RFC 2616 section 14.2{5,6}).
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.isCachable = function isCachable () {
  var statusCode = this.res.statusCode
  return (statusCode >= 200 && statusCode < 300) ||
    statusCode === 304
}

/**
 * Handle stat() error.
 *
 * @param {Error} error
 * @private
 */

SendStream.prototype.onStatError = function onStatError (error) {
  switch (error.code) {
    case 'ENAMETOOLONG':
    case 'ENOENT':
    case 'ENOTDIR':
      this.error(404, error)
      break
    default:
      this.error(500, error)
      break
  }
}

/**
 * Check if the cache is fresh.
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.isFresh = function isFresh () {
  return fresh(this.req.headers, {
    'etag': this.res.getHeader('ETag'),
    'last-modified': this.res.getHeader('Last-Modified')
  })
}

/**
 * Check if the range is fresh.
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.isRangeFresh = function isRangeFresh () {
  var ifRange = this.req.headers['if-range']

  if (!ifRange) {
    return true
  }

  // if-range as etag
  if (ifRange.indexOf('"') !== -1) {
    var etag = this.res.getHeader('ETag')
    return Boolean(etag && ifRange.indexOf(etag) !== -1)
  }

  // if-range as modified date
  var lastModified = this.res.getHeader('Last-Modified')
  return parseHttpDate(lastModified) <= parseHttpDate(ifRange)
}

/**
 * Redirect to path.
 *
 * @param {string} path
 * @private
 */

SendStream.prototype.redirect = function redirect (path) {
  var res = this.res

  if (listenerCount(this, 'directory') !== 0) {
    this.emit('directory', res, path)
    return
  }

  if (this.hasTrailingSlash()) {
    this.error(403)
    return
  }

  var loc = encodeUrl(collapseLeadingSlashes(this.path + '/'))
  var doc = createHtmlDocument('Redirecting', 'Redirecting to <a href="' + escapeHtml(loc) + '">' +
    escapeHtml(loc) + '</a>')

  // redirect
  res.statusCode = 301
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Content-Length', Buffer.byteLength(doc))
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Location', loc)
  res.end(doc)
}

/**
 * Pipe to `res.
 *
 * @param {Stream} res
 * @return {Stream} res
 * @api public
 */

SendStream.prototype.pipe = function pipe (res) {
  // root path
  var root = this._root

  // references
  this.res = res

  // decode the path
  var path = decode(this.path)
  if (path === -1) {
    this.error(400)
    return res
  }

  // null byte(s)
  if (~path.indexOf('\0')) {
    this.error(400)
    return res
  }

  var parts
  if (root !== null) {
    // malicious path
    if (UP_PATH_REGEXP.test(normalize('.' + sep + path))) {
      debug('malicious path "%s"', path)
      this.error(403)
      return res
    }

    // join / normalize from optional root dir
    path = normalize(join(root, path))
    root = normalize(root + sep)

    // explode path parts
    parts = path.substr(root.length).split(sep)
  } else {
    // ".." is malicious without "root"
    if (UP_PATH_REGEXP.test(path)) {
      debug('malicious path "%s"', path)
      this.error(403)
      return res
    }

    // explode path parts
    parts = normalize(path).split(sep)

    // resolve the path
    path = resolve(path)
  }

  // dotfile handling
  if (containsDotFile(parts)) {
    var access = this._dotfiles

    // legacy support
    if (access === undefined) {
      access = parts[parts.length - 1][0] === '.'
        ? (this._hidden ? 'allow' : 'ignore')
        : 'allow'
    }

    debug('%s dotfile "%s"', access, path)
    switch (access) {
      case 'allow':
        break
      case 'deny':
        this.error(403)
        return res
      case 'ignore':
      default:
        this.error(404)
        return res
    }
  }

  // index file support
  if (this._index.length && this.hasTrailingSlash()) {
    this.sendIndex(path)
    return res
  }

  this.sendFile(path)
  return res
}

/**
 * Transfer `path`.
 *
 * @param {String} path
 * @api public
 */

SendStream.prototype.send = function send (path, stat) {
  var len = stat.size
  var options = this.options
  var opts = {}
  var res = this.res
  var req = this.req
  var ranges = req.headers.range
  var offset = options.start || 0

  if (headersSent(res)) {
    // impossible to send now
    this.headersAlreadySent()
    return
  }

  debug('pipe "%s"', path)

  // set header fields
  this.setHeader(path, stat)

  // set content-type
  this.type(path)

  // conditional GET support
  if (this.isConditionalGET()) {
    if (this.isPreconditionFailure()) {
      this.error(412)
      return
    }

    if (this.isCachable() && this.isFresh()) {
      this.notModified()
      return
    }
  }

  // adjust len to start/end options
  len = Math.max(0, len - offset)
  if (options.end !== undefined) {
    var bytes = options.end - offset + 1
    if (len > bytes) len = bytes
  }

  // Range support
  if (this._acceptRanges && BYTES_RANGE_REGEXP.test(ranges)) {
    // parse
    ranges = parseRange(len, ranges, {
      combine: true
    })

    // If-Range support
    if (!this.isRangeFresh()) {
      debug('range stale')
      ranges = -2
    }

    // unsatisfiable
    if (ranges === -1) {
      debug('range unsatisfiable')

      // Content-Range
      res.setHeader('Content-Range', contentRange('bytes', len))

      // 416 Requested Range Not Satisfiable
      return this.error(416, {
        headers: {'Content-Range': res.getHeader('Content-Range')}
      })
    }

    // valid (syntactically invalid/multiple ranges are treated as a regular response)
    if (ranges !== -2 && ranges.length === 1) {
      debug('range %j', ranges)

      // Content-Range
      res.statusCode = 206
      res.setHeader('Content-Range', contentRange('bytes', len, ranges[0]))

      // adjust for requested range
      offset += ranges[0].start
      len = ranges[0].end - ranges[0].start + 1
    }
  }

  // clone options
  for (var prop in options) {
    opts[prop] = options[prop]
  }

  // set read options
  opts.start = offset
  opts.end = Math.max(offset, offset + len - 1)

  // content-length
  res.setHeader('Content-Length', len)

  // HEAD support
  if (req.method === 'HEAD') {
    res.end()
    return
  }

  this.stream(path, opts)
}

/**
 * Transfer file for `path`.
 *
 * @param {String} path
 * @api private
 */
SendStream.prototype.sendFile = function sendFile (path) {
  var i = 0
  var self = this

  debug('stat "%s"', path)
  fs.stat(path, function onstat (err, stat) {
    if (err && err.code === 'ENOENT' && !extname(path) && path[path.length - 1] !== sep) {
      // not found, check extensions
      return next(err)
    }
    if (err) return self.onStatError(err)
    if (stat.isDirectory()) return self.redirect(path)
    self.emit('file', path, stat)
    self.send(path, stat)
  })

  function next (err) {
    if (self._extensions.length <= i) {
      return err
        ? self.onStatError(err)
        : self.error(404)
    }

    var p = path + '.' + self._extensions[i++]

    debug('stat "%s"', p)
    fs.stat(p, function (err, stat) {
      if (err) return next(err)
      if (stat.isDirectory()) return next()
      self.emit('file', p, stat)
      self.send(p, stat)
    })
  }
}

/**
 * Transfer index for `path`.
 *
 * @param {String} path
 * @api private
 */
SendStream.prototype.sendIndex = function sendIndex (path) {
  var i = -1
  var self = this

  function next (err) {
    if (++i >= self._index.length) {
      if (err) return self.onStatError(err)
      return self.error(404)
    }

    var p = join(path, self._index[i])

    debug('stat "%s"', p)
    fs.stat(p, function (err, stat) {
      if (err) return next(err)
      if (stat.isDirectory()) return next()
      self.emit('file', p, stat)
      self.send(p, stat)
    })
  }

  next()
}

/**
 * Stream `path` to the response.
 *
 * @param {String} path
 * @param {Object} options
 * @api private
 */

SendStream.prototype.stream = function stream (path, options) {
  // TODO: this is all lame, refactor meeee
  var finished = false
  var self = this
  var res = this.res

  // pipe
  var stream = fs.createReadStream(path, options)
  this.emit('stream', stream)
  stream.pipe(res)

  // response finished, done with the fd
  onFinished(res, function onfinished () {
    finished = true
    destroy(stream)
  })

  // error handling code-smell
  stream.on('error', function onerror (err) {
    // request already finished
    if (finished) return

    // clean up stream
    finished = true
    destroy(stream)

    // error
    self.onStatError(err)
  })

  // end
  stream.on('end', function onend () {
    self.emit('end')
  })
}

/**
 * Set content-type based on `path`
 * if it hasn't been explicitly set.
 *
 * @param {String} path
 * @api private
 */

SendStream.prototype.type = function type (path) {
  var res = this.res

  if (res.getHeader('Content-Type')) return

  var type = mime.lookup(path)

  if (!type) {
    debug('no content-type')
    return
  }

  var charset = mime.charsets.lookup(type)

  debug('content-type %s', type)
  res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
}

/**
 * Set response header fields, most
 * fields may be pre-defined.
 *
 * @param {String} path
 * @param {Object} stat
 * @api private
 */

SendStream.prototype.setHeader = function setHeader (path, stat) {
  var res = this.res

  this.emit('headers', res, path, stat)

  if (this._acceptRanges && !res.getHeader('Accept-Ranges')) {
    debug('accept ranges')
    res.setHeader('Accept-Ranges', 'bytes')
  }

  if (this._cacheControl && !res.getHeader('Cache-Control')) {
    var cacheControl = 'public, max-age=' + Math.floor(this._maxage / 1000)
    debug('cache-control %s', cacheControl)
    res.setHeader('Cache-Control', cacheControl)
  }

  if (this._lastModified && !res.getHeader('Last-Modified')) {
    var modified = stat.mtime.toUTCString()
    debug('modified %s', modified)
    res.setHeader('Last-Modified', modified)
  }

  if (this._etag && !res.getHeader('ETag')) {
    var val = etag(stat)
    debug('etag %s', val)
    res.setHeader('ETag', val)
  }
}

/**
 * Clear all headers from a response.
 *
 * @param {object} res
 * @private
 */

function clearHeaders (res) {
  var headers = getHeaderNames(res)

  for (var i = 0; i < headers.length; i++) {
    res.removeHeader(headers[i])
  }
}

/**
 * Collapse all leading slashes into a single slash
 *
 * @param {string} str
 * @private
 */
function collapseLeadingSlashes (str) {
  for (var i = 0; i < str.length; i++) {
    if (str[i] !== '/') {
      break
    }
  }

  return i > 1
    ? '/' + str.substr(i)
    : str
}

/**
 * Determine if path parts contain a dotfile.
 *
 * @api private
 */

function containsDotFile (parts) {
  for (var i = 0; i < parts.length; i++) {
    if (parts[i][0] === '.') {
      return true
    }
  }

  return false
}

/**
 * Create a Content-Range header.
 *
 * @param {string} type
 * @param {number} size
 * @param {array} [range]
 */

function contentRange (type, size, range) {
  return type + ' ' + (range ? range.start + '-' + range.end : '*') + '/' + size
}

/**
 * Create a minimal HTML document.
 *
 * @param {string} title
 * @param {string} body
 * @private
 */

function createHtmlDocument (title, body) {
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<title>' + title + '</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '<pre>' + body + '</pre>\n' +
    '</body>\n'
}

/**
 * decodeURIComponent.
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {String} path
 * @api private
 */

function decode (path) {
  try {
    return decodeURIComponent(path)
  } catch (err) {
    return -1
  }
}

/**
 * Get the header names on a respnse.
 *
 * @param {object} res
 * @returns {array[string]}
 * @private
 */

function getHeaderNames (res) {
  return typeof res.getHeaderNames !== 'function'
    ? Object.keys(res._headers || {})
    : res.getHeaderNames()
}

/**
 * Determine if the response headers have been sent.
 *
 * @param {object} res
 * @returns {boolean}
 * @private
 */

function headersSent (res) {
  return typeof res.headersSent !== 'boolean'
    ? Boolean(res._header)
    : res.headersSent
}

/**
 * Normalize the index option into an array.
 *
 * @param {boolean|string|array} val
 * @param {string} name
 * @private
 */

function normalizeList (val, name) {
  var list = [].concat(val || [])

  for (var i = 0; i < list.length; i++) {
    if (typeof list[i] !== 'string') {
      throw new TypeError(name + ' must be array of strings or false')
    }
  }

  return list
}

/**
 * Parse an HTTP Date into a number.
 *
 * @param {string} date
 * @private
 */

function parseHttpDate (date) {
  var timestamp = date && Date.parse(date)

  return typeof timestamp === 'number'
    ? timestamp
    : NaN
}

/**
 * Set an object of headers on a response.
 *
 * @param {object} res
 * @param {object} headers
 * @private
 */

function setHeaders (res, headers) {
  var keys = Object.keys(headers)

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    res.setHeader(key, headers[key])
  }
}


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(42);

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Enabled debuggers.
 */

var names = []
  , skips = [];

(process.env.DEBUG || '')
  .split(/[\s,]+/)
  .forEach(function(name){
    name = name.replace('*', '.*?');
    if (name[0] === '-') {
      skips.push(new RegExp('^' + name.substr(1) + '$'));
    } else {
      names.push(new RegExp('^' + name + '$'));
    }
  });

/**
 * Colors.
 */

var colors = [6, 2, 3, 4, 5, 1];

/**
 * Previous debug() call.
 */

var prev = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Is stdout a TTY? Colored output is disabled when `true`.
 */

var isatty = tty.isatty(2);

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function color() {
  return colors[prevColor++ % colors.length];
}

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

function humanize(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
}

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  function disabled(){}
  disabled.enabled = false;

  var match = skips.some(function(re){
    return re.test(name);
  });

  if (match) return disabled;

  match = names.some(function(re){
    return re.test(name);
  });

  if (!match) return disabled;
  var c = color();

  function colored(fmt) {
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (prev[name] || curr);
    prev[name] = curr;

    fmt = '  \u001b[9' + c + 'm' + name + ' '
      + '\u001b[3' + c + 'm\u001b[90m'
      + fmt + '\u001b[3' + c + 'm'
      + ' +' + humanize(ms) + '\u001b[0m';

    console.error.apply(this, arguments);
  }

  function plain(fmt) {
    fmt = coerce(fmt);

    fmt = new Date().toUTCString()
      + ' ' + name + ' ' + fmt;
    console.error.apply(this, arguments);
  }

  colored.enabled = plain.enabled = true;

  return isatty || process.env.DEBUG_COLORS
    ? colored
    : plain;
}

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 80 */
/***/ (function(module, exports) {

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */

exports = module.exports = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = require("dgram");

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

exports.__esModule = true;
exports.middleLogger = exports.LOG = undefined;

var _log4js = __webpack_require__(35);

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

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



module.exports = __webpack_require__(182);


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * content-disposition
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 */

module.exports = contentDisposition
module.exports.parse = parse

/**
 * Module dependencies.
 */

var basename = __webpack_require__(5).basename

/**
 * RegExp to match non attr-char, *after* encodeURIComponent (i.e. not including "%")
 */

var ENCODE_URL_ATTR_CHAR_REGEXP = /[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g // eslint-disable-line no-control-regex

/**
 * RegExp to match percent encoding escape.
 */

var HEX_ESCAPE_REGEXP = /%[0-9A-Fa-f]{2}/
var HEX_ESCAPE_REPLACE_REGEXP = /%([0-9A-Fa-f]{2})/g

/**
 * RegExp to match non-latin1 characters.
 */

var NON_LATIN1_REGEXP = /[^\x20-\x7e\xa0-\xff]/g

/**
 * RegExp to match quoted-pair in RFC 2616
 *
 * quoted-pair = "\" CHAR
 * CHAR        = <any US-ASCII character (octets 0 - 127)>
 */

var QESC_REGEXP = /\\([\u0000-\u007f])/g

/**
 * RegExp to match chars that must be quoted-pair in RFC 2616
 */

var QUOTE_REGEXP = /([\\"])/g

/**
 * RegExp for various RFC 2616 grammar
 *
 * parameter     = token "=" ( token | quoted-string )
 * token         = 1*<any CHAR except CTLs or separators>
 * separators    = "(" | ")" | "<" | ">" | "@"
 *               | "," | ";" | ":" | "\" | <">
 *               | "/" | "[" | "]" | "?" | "="
 *               | "{" | "}" | SP | HT
 * quoted-string = ( <"> *(qdtext | quoted-pair ) <"> )
 * qdtext        = <any TEXT except <">>
 * quoted-pair   = "\" CHAR
 * CHAR          = <any US-ASCII character (octets 0 - 127)>
 * TEXT          = <any OCTET except CTLs, but including LWS>
 * LWS           = [CRLF] 1*( SP | HT )
 * CRLF          = CR LF
 * CR            = <US-ASCII CR, carriage return (13)>
 * LF            = <US-ASCII LF, linefeed (10)>
 * SP            = <US-ASCII SP, space (32)>
 * HT            = <US-ASCII HT, horizontal-tab (9)>
 * CTL           = <any US-ASCII control character (octets 0 - 31) and DEL (127)>
 * OCTET         = <any 8-bit sequence of data>
 */

var PARAM_REGEXP = /;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g // eslint-disable-line no-control-regex
var TEXT_REGEXP = /^[\x20-\x7e\x80-\xff]+$/
var TOKEN_REGEXP = /^[!#$%&'*+.0-9A-Z^_`a-z|~-]+$/

/**
 * RegExp for various RFC 5987 grammar
 *
 * ext-value     = charset  "'" [ language ] "'" value-chars
 * charset       = "UTF-8" / "ISO-8859-1" / mime-charset
 * mime-charset  = 1*mime-charsetc
 * mime-charsetc = ALPHA / DIGIT
 *               / "!" / "#" / "$" / "%" / "&"
 *               / "+" / "-" / "^" / "_" / "`"
 *               / "{" / "}" / "~"
 * language      = ( 2*3ALPHA [ extlang ] )
 *               / 4ALPHA
 *               / 5*8ALPHA
 * extlang       = *3( "-" 3ALPHA )
 * value-chars   = *( pct-encoded / attr-char )
 * pct-encoded   = "%" HEXDIG HEXDIG
 * attr-char     = ALPHA / DIGIT
 *               / "!" / "#" / "$" / "&" / "+" / "-" / "."
 *               / "^" / "_" / "`" / "|" / "~"
 */

var EXT_VALUE_REGEXP = /^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/

/**
 * RegExp for various RFC 6266 grammar
 *
 * disposition-type = "inline" | "attachment" | disp-ext-type
 * disp-ext-type    = token
 * disposition-parm = filename-parm | disp-ext-parm
 * filename-parm    = "filename" "=" value
 *                  | "filename*" "=" ext-value
 * disp-ext-parm    = token "=" value
 *                  | ext-token "=" ext-value
 * ext-token        = <the characters in token, followed by "*">
 */

var DISPOSITION_TYPE_REGEXP = /^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/ // eslint-disable-line no-control-regex

/**
 * Create an attachment Content-Disposition header.
 *
 * @param {string} [filename]
 * @param {object} [options]
 * @param {string} [options.type=attachment]
 * @param {string|boolean} [options.fallback=true]
 * @return {string}
 * @api public
 */

function contentDisposition (filename, options) {
  var opts = options || {}

  // get type
  var type = opts.type || 'attachment'

  // get parameters
  var params = createparams(filename, opts.fallback)

  // format into string
  return format(new ContentDisposition(type, params))
}

/**
 * Create parameters object from filename and fallback.
 *
 * @param {string} [filename]
 * @param {string|boolean} [fallback=true]
 * @return {object}
 * @api private
 */

function createparams (filename, fallback) {
  if (filename === undefined) {
    return
  }

  var params = {}

  if (typeof filename !== 'string') {
    throw new TypeError('filename must be a string')
  }

  // fallback defaults to true
  if (fallback === undefined) {
    fallback = true
  }

  if (typeof fallback !== 'string' && typeof fallback !== 'boolean') {
    throw new TypeError('fallback must be a string or boolean')
  }

  if (typeof fallback === 'string' && NON_LATIN1_REGEXP.test(fallback)) {
    throw new TypeError('fallback must be ISO-8859-1 string')
  }

  // restrict to file base name
  var name = basename(filename)

  // determine if name is suitable for quoted string
  var isQuotedString = TEXT_REGEXP.test(name)

  // generate fallback name
  var fallbackName = typeof fallback !== 'string'
    ? fallback && getlatin1(name)
    : basename(fallback)
  var hasFallback = typeof fallbackName === 'string' && fallbackName !== name

  // set extended filename parameter
  if (hasFallback || !isQuotedString || HEX_ESCAPE_REGEXP.test(name)) {
    params['filename*'] = name
  }

  // set filename parameter
  if (isQuotedString || hasFallback) {
    params.filename = hasFallback
      ? fallbackName
      : name
  }

  return params
}

/**
 * Format object to Content-Disposition header.
 *
 * @param {object} obj
 * @param {string} obj.type
 * @param {object} [obj.parameters]
 * @return {string}
 * @api private
 */

function format (obj) {
  var parameters = obj.parameters
  var type = obj.type

  if (!type || typeof type !== 'string' || !TOKEN_REGEXP.test(type)) {
    throw new TypeError('invalid type')
  }

  // start with normalized type
  var string = String(type).toLowerCase()

  // append parameters
  if (parameters && typeof parameters === 'object') {
    var param
    var params = Object.keys(parameters).sort()

    for (var i = 0; i < params.length; i++) {
      param = params[i]

      var val = param.substr(-1) === '*'
        ? ustring(parameters[param])
        : qstring(parameters[param])

      string += '; ' + param + '=' + val
    }
  }

  return string
}

/**
 * Decode a RFC 6987 field value (gracefully).
 *
 * @param {string} str
 * @return {string}
 * @api private
 */

function decodefield (str) {
  var match = EXT_VALUE_REGEXP.exec(str)

  if (!match) {
    throw new TypeError('invalid extended field value')
  }

  var charset = match[1].toLowerCase()
  var encoded = match[2]
  var value

  // to binary string
  var binary = encoded.replace(HEX_ESCAPE_REPLACE_REGEXP, pdecode)

  switch (charset) {
    case 'iso-8859-1':
      value = getlatin1(binary)
      break
    case 'utf-8':
      value = new Buffer(binary, 'binary').toString('utf8')
      break
    default:
      throw new TypeError('unsupported charset in extended field')
  }

  return value
}

/**
 * Get ISO-8859-1 version of string.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function getlatin1 (val) {
  // simple Unicode -> ISO-8859-1 transformation
  return String(val).replace(NON_LATIN1_REGEXP, '?')
}

/**
 * Parse Content-Disposition header string.
 *
 * @param {string} string
 * @return {object}
 * @api private
 */

function parse (string) {
  if (!string || typeof string !== 'string') {
    throw new TypeError('argument string is required')
  }

  var match = DISPOSITION_TYPE_REGEXP.exec(string)

  if (!match) {
    throw new TypeError('invalid type format')
  }

  // normalize type
  var index = match[0].length
  var type = match[1].toLowerCase()

  var key
  var names = []
  var params = {}
  var value

  // calculate index to start at
  index = PARAM_REGEXP.lastIndex = match[0].substr(-1) === ';'
    ? index - 1
    : index

  // match parameters
  while ((match = PARAM_REGEXP.exec(string))) {
    if (match.index !== index) {
      throw new TypeError('invalid parameter format')
    }

    index += match[0].length
    key = match[1].toLowerCase()
    value = match[2]

    if (names.indexOf(key) !== -1) {
      throw new TypeError('invalid duplicate parameter')
    }

    names.push(key)

    if (key.indexOf('*') + 1 === key.length) {
      // decode extended value
      key = key.slice(0, -1)
      value = decodefield(value)

      // overwrite existing value
      params[key] = value
      continue
    }

    if (typeof params[key] === 'string') {
      continue
    }

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value
        .substr(1, value.length - 2)
        .replace(QESC_REGEXP, '$1')
    }

    params[key] = value
  }

  if (index !== -1 && index !== string.length) {
    throw new TypeError('invalid parameter format')
  }

  return new ContentDisposition(type, params)
}

/**
 * Percent decode a single character.
 *
 * @param {string} str
 * @param {string} hex
 * @return {string}
 * @api private
 */

function pdecode (str, hex) {
  return String.fromCharCode(parseInt(hex, 16))
}

/**
 * Percent encode a single character.
 *
 * @param {string} char
 * @return {string}
 * @api private
 */

function pencode (char) {
  var hex = String(char)
    .charCodeAt(0)
    .toString(16)
    .toUpperCase()
  return hex.length === 1
    ? '%0' + hex
    : '%' + hex
}

/**
 * Quote a string for HTTP.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function qstring (val) {
  var str = String(val)

  return '"' + str.replace(QUOTE_REGEXP, '\\$1') + '"'
}

/**
 * Encode a Unicode string for HTTP (RFC 5987).
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function ustring (val) {
  var str = String(val)

  // percent encode as UTF-8
  var encoded = encodeURIComponent(str)
    .replace(ENCODE_URL_ATTR_CHAR_REGEXP, pencode)

  return 'UTF-8\'\'' + encoded
}

/**
 * Class for parsed Content-Disposition header for v8 optimization
 */

function ContentDisposition (type, parameters) {
  this.type = type
  this.parameters = parameters
}


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(36);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * depd
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var Buffer = __webpack_require__(56)
var EventEmitter = __webpack_require__(29).EventEmitter

/**
 * Module exports.
 * @public
 */

lazyProperty(module.exports, 'bufferConcat', function bufferConcat() {
  return Buffer.concat || __webpack_require__(173)
})

lazyProperty(module.exports, 'callSiteToString', function callSiteToString() {
  var limit = Error.stackTraceLimit
  var obj = {}
  var prep = Error.prepareStackTrace

  function prepareObjectStackTrace(obj, stack) {
    return stack
  }

  Error.prepareStackTrace = prepareObjectStackTrace
  Error.stackTraceLimit = 2

  // capture the stack
  Error.captureStackTrace(obj)

  // slice the stack
  var stack = obj.stack.slice()

  Error.prepareStackTrace = prep
  Error.stackTraceLimit = limit

  return stack[0].toString ? toString : __webpack_require__(174)
})

lazyProperty(module.exports, 'eventListenerCount', function eventListenerCount() {
  return EventEmitter.listenerCount || __webpack_require__(175)
})

/**
 * Define a lazy property.
 */

function lazyProperty(obj, prop, getter) {
  function get() {
    var val = getter()

    Object.defineProperty(obj, prop, {
      configurable: true,
      enumerable: true,
      value: val
    })

    return val
  }

  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: true,
    get: get
  })
}

/**
 * Call toString() on the obj
 */

function toString(obj) {
  return obj.toString()
}


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * etag
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = etag

/**
 * Module dependencies.
 * @private
 */

var crypto = __webpack_require__(156)
var Stats = __webpack_require__(7).Stats

/**
 * Module variables.
 * @private
 */

var base64PadCharRegExp = /=+$/
var toString = Object.prototype.toString

/**
 * Generate an entity tag.
 *
 * @param {Buffer|string} entity
 * @return {string}
 * @private
 */

function entitytag (entity) {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'
  }

  // compute hash of entity
  var hash = crypto
    .createHash('sha1')
    .update(entity, 'utf8')
    .digest('base64')
    .replace(base64PadCharRegExp, '')

  // compute length of entity
  var len = typeof entity === 'string'
    ? Buffer.byteLength(entity, 'utf8')
    : entity.length

  return '"' + len.toString(16) + '-' + hash + '"'
}

/**
 * Create a simple ETag.
 *
 * @param {string|Buffer|Stats} entity
 * @param {object} [options]
 * @param {boolean} [options.weak]
 * @return {String}
 * @public
 */

function etag (entity, options) {
  if (entity == null) {
    throw new TypeError('argument entity is required')
  }

  // support fs.Stats object
  var isStats = isstats(entity)
  var weak = options && typeof options.weak === 'boolean'
    ? options.weak
    : isStats

  // validate argument
  if (!isStats && typeof entity !== 'string' && !Buffer.isBuffer(entity)) {
    throw new TypeError('argument entity must be string, Buffer, or fs.Stats')
  }

  // generate entity tag
  var tag = isStats
    ? stattag(entity)
    : entitytag(entity)

  return weak
    ? 'W/' + tag
    : tag
}

/**
 * Determine if object is a Stats object.
 *
 * @param {object} obj
 * @return {boolean}
 * @api private
 */

function isstats (obj) {
  // genuine fs.Stats
  if (typeof Stats === 'function' && obj instanceof Stats) {
    return true
  }

  // quack quack
  return obj && typeof obj === 'object' &&
    'ctime' in obj && toString.call(obj.ctime) === '[object Date]' &&
    'mtime' in obj && toString.call(obj.mtime) === '[object Date]' &&
    'ino' in obj && typeof obj.ino === 'number' &&
    'size' in obj && typeof obj.size === 'number'
}

/**
 * Generate a tag for a stat.
 *
 * @param {object} stat
 * @return {string}
 * @private
 */

function stattag (stat) {
  var mtime = stat.mtime.getTime().toString(16)
  var size = stat.size.toString(16)

  return '"' + size + '-' + mtime + '"'
}


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 */

var parseUrl = __webpack_require__(37);
var qs = __webpack_require__(121);

/**
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function query(options) {
  var opts = Object.create(options || null);
  var queryparse = qs.parse;

  if (typeof options === 'function') {
    queryparse = options;
    opts = undefined;
  }

  if (opts !== undefined && opts.allowPrototypes === undefined) {
    // back-compat for qs module
    opts.allowPrototypes = true;
  }

  return function query(req, res, next){
    if (!req.query) {
      var val = parseUrl(req).query;
      req.query = queryparse(val, opts);
    }

    next();
  };
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var Route = __webpack_require__(91);
var Layer = __webpack_require__(90);
var methods = __webpack_require__(59);
var mixin = __webpack_require__(80);
var debug = __webpack_require__(33)('express:router');
var deprecate = __webpack_require__(18)('express');
var flatten = __webpack_require__(43);
var parseUrl = __webpack_require__(37);
var setPrototypeOf = __webpack_require__(54)

/**
 * Module variables.
 * @private
 */

var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

/**
 * Initialize a new `Router` with the given `options`.
 *
 * @param {Object} options
 * @return {Router} which is an callable function
 * @public
 */

var proto = module.exports = function(options) {
  var opts = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // mixin Router class functions
  setPrototypeOf(router, proto)

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = [];

  return router;
};

/**
 * Map the given param placeholder `name`(s) to the given callback.
 *
 * Parameter mapping is used to provide pre-conditions to routes
 * which use normalized placeholders. For example a _:user_id_ parameter
 * could automatically load a user's information from the database without
 * any additional code,
 *
 * The callback uses the same signature as middleware, the only difference
 * being that the value of the placeholder is passed, in this case the _id_
 * of the user. Once the `next()` function is invoked, just like middleware
 * it will continue on to execute the route, or subsequent parameter functions.
 *
 * Just like in middleware, you must either respond to the request or call next
 * to avoid stalling the request.
 *
 *  app.param('user_id', function(req, res, next, id){
 *    User.find(id, function(err, user){
 *      if (err) {
 *        return next(err);
 *      } else if (!user) {
 *        return next(new Error('failed to load user'));
 *      }
 *      req.user = user;
 *      next();
 *    });
 *  });
 *
 * @param {String} name
 * @param {Function} fn
 * @return {app} for chaining
 * @public
 */

proto.param = function param(name, fn) {
  // param logic
  if (typeof name === 'function') {
    deprecate('router.param(fn): Refactor to use path params');
    this._params.push(name);
    return;
  }

  // apply param functions
  var params = this._params;
  var len = params.length;
  var ret;

  if (name[0] === ':') {
    deprecate('router.param(' + JSON.stringify(name) + ', fn): Use router.param(' + JSON.stringify(name.substr(1)) + ', fn) instead');
    name = name.substr(1);
  }

  for (var i = 0; i < len; ++i) {
    if (ret = params[i](name, fn)) {
      fn = ret;
    }
  }

  // ensure we end up with a
  // middleware function
  if ('function' !== typeof fn) {
    throw new Error('invalid param() call for ' + name + ', got ' + fn);
  }

  (this.params[name] = this.params[name] || []).push(fn);
  return this;
};

/**
 * Dispatch a req, res into the router.
 * @private
 */

proto.handle = function handle(req, res, out) {
  var self = this;

  debug('dispatching %s %s', req.method, req.url);

  var idx = 0;
  var protohost = getProtohost(req.url) || ''
  var removed = '';
  var slashAdded = false;
  var paramcalled = {};

  // store options for OPTIONS request
  // only used if OPTIONS request
  var options = [];

  // middleware and routes
  var stack = self.stack;

  // manage inter-router variables
  var parentParams = req.params;
  var parentUrl = req.baseUrl || '';
  var done = restore(out, req, 'baseUrl', 'next', 'params');

  // setup next layer
  req.next = next;

  // for options requests, respond with a default if nothing else responds
  if (req.method === 'OPTIONS') {
    done = wrap(done, function(old, err) {
      if (err || options.length === 0) return old(err);
      sendOptionsResponse(res, options, old);
    });
  }

  // setup basic req values
  req.baseUrl = parentUrl;
  req.originalUrl = req.originalUrl || req.url;

  next();

  function next(err) {
    var layerError = err === 'route'
      ? null
      : err;

    // remove added slash
    if (slashAdded) {
      req.url = req.url.substr(1);
      slashAdded = false;
    }

    // restore altered req.url
    if (removed.length !== 0) {
      req.baseUrl = parentUrl;
      req.url = protohost + removed + req.url.substr(protohost.length);
      removed = '';
    }

    // signal to exit router
    if (layerError === 'router') {
      setImmediate(done, null)
      return
    }

    // no more matching layers
    if (idx >= stack.length) {
      setImmediate(done, layerError);
      return;
    }

    // get pathname of request
    var path = getPathname(req);

    if (path == null) {
      return done(layerError);
    }

    // find next matching layer
    var layer;
    var match;
    var route;

    while (match !== true && idx < stack.length) {
      layer = stack[idx++];
      match = matchLayer(layer, path);
      route = layer.route;

      if (typeof match !== 'boolean') {
        // hold on to layerError
        layerError = layerError || match;
      }

      if (match !== true) {
        continue;
      }

      if (!route) {
        // process non-route handlers normally
        continue;
      }

      if (layerError) {
        // routes do not match with a pending error
        match = false;
        continue;
      }

      var method = req.method;
      var has_method = route._handles_method(method);

      // build up automatic options response
      if (!has_method && method === 'OPTIONS') {
        appendMethods(options, route._options());
      }

      // don't even bother matching route
      if (!has_method && method !== 'HEAD') {
        match = false;
        continue;
      }
    }

    // no match
    if (match !== true) {
      return done(layerError);
    }

    // store route for dispatch on change
    if (route) {
      req.route = route;
    }

    // Capture one-time layer values
    req.params = self.mergeParams
      ? mergeParams(layer.params, parentParams)
      : layer.params;
    var layerPath = layer.path;

    // this should be done for the layer
    self.process_params(layer, paramcalled, req, res, function (err) {
      if (err) {
        return next(layerError || err);
      }

      if (route) {
        return layer.handle_request(req, res, next);
      }

      trim_prefix(layer, layerError, layerPath, path);
    });
  }

  function trim_prefix(layer, layerError, layerPath, path) {
    if (layerPath.length !== 0) {
      // Validate path breaks on a path separator
      var c = path[layerPath.length]
      if (c && c !== '/' && c !== '.') return next(layerError)

      // Trim off the part of the url that matches the route
      // middleware (.use stuff) needs to have the path stripped
      debug('trim prefix (%s) from url %s', layerPath, req.url);
      removed = layerPath;
      req.url = protohost + req.url.substr(protohost.length + removed.length);

      // Ensure leading slash
      if (!protohost && req.url[0] !== '/') {
        req.url = '/' + req.url;
        slashAdded = true;
      }

      // Setup base URL (no trailing slash)
      req.baseUrl = parentUrl + (removed[removed.length - 1] === '/'
        ? removed.substring(0, removed.length - 1)
        : removed);
    }

    debug('%s %s : %s', layer.name, layerPath, req.originalUrl);

    if (layerError) {
      layer.handle_error(layerError, req, res, next);
    } else {
      layer.handle_request(req, res, next);
    }
  }
};

/**
 * Process any parameters for the layer.
 * @private
 */

proto.process_params = function process_params(layer, called, req, res, done) {
  var params = this.params;

  // captured parameters from the layer, keys and values
  var keys = layer.keys;

  // fast track
  if (!keys || keys.length === 0) {
    return done();
  }

  var i = 0;
  var name;
  var paramIndex = 0;
  var key;
  var paramVal;
  var paramCallbacks;
  var paramCalled;

  // process params in order
  // param callbacks can be async
  function param(err) {
    if (err) {
      return done(err);
    }

    if (i >= keys.length ) {
      return done();
    }

    paramIndex = 0;
    key = keys[i++];
    name = key.name;
    paramVal = req.params[name];
    paramCallbacks = params[name];
    paramCalled = called[name];

    if (paramVal === undefined || !paramCallbacks) {
      return param();
    }

    // param previously called with same value or error occurred
    if (paramCalled && (paramCalled.match === paramVal
      || (paramCalled.error && paramCalled.error !== 'route'))) {
      // restore value
      req.params[name] = paramCalled.value;

      // next param
      return param(paramCalled.error);
    }

    called[name] = paramCalled = {
      error: null,
      match: paramVal,
      value: paramVal
    };

    paramCallback();
  }

  // single param callbacks
  function paramCallback(err) {
    var fn = paramCallbacks[paramIndex++];

    // store updated value
    paramCalled.value = req.params[key.name];

    if (err) {
      // store error
      paramCalled.error = err;
      param(err);
      return;
    }

    if (!fn) return param();

    try {
      fn(req, res, paramCallback, paramVal, key.name);
    } catch (e) {
      paramCallback(e);
    }
  }

  param();
};

/**
 * Use the given middleware function, with optional path, defaulting to "/".
 *
 * Use (like `.all`) will run for any http METHOD, but it will not add
 * handlers for those methods so OPTIONS requests will not consider `.use`
 * functions even if they could respond.
 *
 * The other difference is that _route_ path is stripped and not visible
 * to the handler function. The main effect of this feature is that mounted
 * handlers can operate without any code changes regardless of the "prefix"
 * pathname.
 *
 * @public
 */

proto.use = function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate router.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var callbacks = flatten(slice.call(arguments, offset));

  if (callbacks.length === 0) {
    throw new TypeError('Router.use() requires middleware functions');
  }

  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i];

    if (typeof fn !== 'function') {
      throw new TypeError('Router.use() requires middleware function but got a ' + gettype(fn));
    }

    // add the middleware
    debug('use %o %s', path, fn.name || '<anonymous>')

    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);

    layer.route = undefined;

    this.stack.push(layer);
  }

  return this;
};

/**
 * Create a new Route for the given path.
 *
 * Each route contains a separate middleware stack and VERB handlers.
 *
 * See the Route api documentation for details on adding handlers
 * and middleware to routes.
 *
 * @param {String} path
 * @return {Route}
 * @public
 */

proto.route = function route(path) {
  var route = new Route(path);

  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};

// create Router#VERB functions
methods.concat('all').forEach(function(method){
  proto[method] = function(path){
    var route = this.route(path)
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});

// append methods to a list of methods
function appendMethods(list, addition) {
  for (var i = 0; i < addition.length; i++) {
    var method = addition[i];
    if (list.indexOf(method) === -1) {
      list.push(method);
    }
  }
}

// get pathname of request
function getPathname(req) {
  try {
    return parseUrl(req).pathname;
  } catch (err) {
    return undefined;
  }
}

// Get get protocol + host for a URL
function getProtohost(url) {
  if (typeof url !== 'string' || url.length === 0 || url[0] === '/') {
    return undefined
  }

  var searchIndex = url.indexOf('?')
  var pathLength = searchIndex !== -1
    ? searchIndex
    : url.length
  var fqdnIndex = url.substr(0, pathLength).indexOf('://')

  return fqdnIndex !== -1
    ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
    : undefined
}

// get type for error message
function gettype(obj) {
  var type = typeof obj;

  if (type !== 'object') {
    return type;
  }

  // inspect [[Class]] for objects
  return toString.call(obj)
    .replace(objectRegExp, '$1');
}

/**
 * Match path to a layer.
 *
 * @param {Layer} layer
 * @param {string} path
 * @private
 */

function matchLayer(layer, path) {
  try {
    return layer.match(path);
  } catch (err) {
    return err;
  }
}

// merge params with parent params
function mergeParams(params, parent) {
  if (typeof parent !== 'object' || !parent) {
    return params;
  }

  // make copy of parent for base
  var obj = mixin({}, parent);

  // simple non-numeric merging
  if (!(0 in params) || !(0 in parent)) {
    return mixin(obj, params);
  }

  var i = 0;
  var o = 0;

  // determine numeric gaps
  while (i in params) {
    i++;
  }

  while (o in parent) {
    o++;
  }

  // offset numeric indices in params before merge
  for (i--; i >= 0; i--) {
    params[i + o] = params[i];

    // create holes for the merge when necessary
    if (i < o) {
      delete params[i];
    }
  }

  return mixin(obj, params);
}

// restore obj props after function
function restore(fn, obj) {
  var props = new Array(arguments.length - 2);
  var vals = new Array(arguments.length - 2);

  for (var i = 0; i < props.length; i++) {
    props[i] = arguments[i + 2];
    vals[i] = obj[props[i]];
  }

  return function () {
    // restore vals
    for (var i = 0; i < props.length; i++) {
      obj[props[i]] = vals[i];
    }

    return fn.apply(this, arguments);
  };
}

// send an OPTIONS response
function sendOptionsResponse(res, options, next) {
  try {
    var body = options.join(',');
    res.set('Allow', body);
    res.send(body);
  } catch (err) {
    next(err);
  }
}

// wrap a function
function wrap(old, fn) {
  return function proxy() {
    var args = new Array(arguments.length + 1);

    args[0] = old;
    for (var i = 0, len = arguments.length; i < len; i++) {
      args[i + 1] = arguments[i];
    }

    fn.apply(this, args);
  };
}


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var pathRegexp = __webpack_require__(229);
var debug = __webpack_require__(33)('express:router:layer');

/**
 * Module variables.
 * @private
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Module exports.
 * @public
 */

module.exports = Layer;

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  debug('new %o', path)
  var opts = options || {};

  this.handle = fn;
  this.name = fn.name || '<anonymous>';
  this.params = undefined;
  this.path = undefined;
  this.regexp = pathRegexp(path, this.keys = [], opts);

  // set fast path flags
  this.regexp.fast_star = path === '*'
  this.regexp.fast_slash = path === '/' && opts.end === false
}

/**
 * Handle the error for the layer.
 *
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_error = function handle_error(error, req, res, next) {
  var fn = this.handle;

  if (fn.length !== 4) {
    // not a standard error handler
    return next(error);
  }

  try {
    fn(error, req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle the request for the layer.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_request = function handle(req, res, next) {
  var fn = this.handle;

  if (fn.length > 3) {
    // not a standard request handler
    return next();
  }

  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Layer.prototype.match = function match(path) {
  var match

  if (path != null) {
    // fast path non-ending match for / (any path matches)
    if (this.regexp.fast_slash) {
      this.params = {}
      this.path = ''
      return true
    }

    // fast path for * (everything matched in a param)
    if (this.regexp.fast_star) {
      this.params = {'0': decode_param(path)}
      this.path = path
      return true
    }

    // match the path
    match = this.regexp.exec(path)
  }

  if (!match) {
    this.params = undefined;
    this.path = undefined;
    return false;
  }

  // store values
  this.params = {};
  this.path = match[0]

  var keys = this.keys;
  var params = this.params;

  for (var i = 1; i < match.length; i++) {
    var key = keys[i - 1];
    var prop = key.name;
    var val = decode_param(match[i])

    if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
      params[prop] = val;
    }
  }

  return true;
};

/**
 * Decode param value.
 *
 * @param {string} val
 * @return {string}
 * @private
 */

function decode_param(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      err.status = err.statusCode = 400;
    }

    throw err;
  }
}


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var debug = __webpack_require__(33)('express:router:route');
var flatten = __webpack_require__(43);
var Layer = __webpack_require__(90);
var methods = __webpack_require__(59);

/**
 * Module variables.
 * @private
 */

var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

/**
 * Module exports.
 * @public
 */

module.exports = Route;

/**
 * Initialize `Route` with the given `path`,
 *
 * @param {String} path
 * @public
 */

function Route(path) {
  this.path = path;
  this.stack = [];

  debug('new %o', path)

  // route handlers for various http methods
  this.methods = {};
}

/**
 * Determine if the route handles a given method.
 * @private
 */

Route.prototype._handles_method = function _handles_method(method) {
  if (this.methods._all) {
    return true;
  }

  var name = method.toLowerCase();

  if (name === 'head' && !this.methods['head']) {
    name = 'get';
  }

  return Boolean(this.methods[name]);
};

/**
 * @return {Array} supported HTTP methods
 * @private
 */

Route.prototype._options = function _options() {
  var methods = Object.keys(this.methods);

  // append automatic head
  if (this.methods.get && !this.methods.head) {
    methods.push('head');
  }

  for (var i = 0; i < methods.length; i++) {
    // make upper case
    methods[i] = methods[i].toUpperCase();
  }

  return methods;
};

/**
 * dispatch req, res into this route
 * @private
 */

Route.prototype.dispatch = function dispatch(req, res, done) {
  var idx = 0;
  var stack = this.stack;
  if (stack.length === 0) {
    return done();
  }

  var method = req.method.toLowerCase();
  if (method === 'head' && !this.methods['head']) {
    method = 'get';
  }

  req.route = this;

  next();

  function next(err) {
    // signal to exit route
    if (err && err === 'route') {
      return done();
    }

    // signal to exit router
    if (err && err === 'router') {
      return done(err)
    }

    var layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    if (layer.method && layer.method !== method) {
      return next(err);
    }

    if (err) {
      layer.handle_error(err, req, res, next);
    } else {
      layer.handle_request(req, res, next);
    }
  }
};

/**
 * Add a handler for all HTTP verbs to this route.
 *
 * Behaves just like middleware and can respond or call `next`
 * to continue processing.
 *
 * You can use multiple `.all` call to add multiple handlers.
 *
 *   function check_something(req, res, next){
 *     next();
 *   };
 *
 *   function validate_user(req, res, next){
 *     next();
 *   };
 *
 *   route
 *   .all(validate_user)
 *   .all(check_something)
 *   .get(function(req, res, next){
 *     res.send('hello world');
 *   });
 *
 * @param {function} handler
 * @return {Route} for chaining
 * @api public
 */

Route.prototype.all = function all() {
  var handles = flatten(slice.call(arguments));

  for (var i = 0; i < handles.length; i++) {
    var handle = handles[i];

    if (typeof handle !== 'function') {
      var type = toString.call(handle);
      var msg = 'Route.all() requires callback functions but got a ' + type;
      throw new TypeError(msg);
    }

    var layer = Layer('/', {}, handle);
    layer.method = undefined;

    this.methods._all = true;
    this.stack.push(layer);
  }

  return this;
};

methods.forEach(function(method){
  Route.prototype[method] = function(){
    var handles = flatten(slice.call(arguments));

    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];

      if (typeof handle !== 'function') {
        var type = toString.call(handle);
        var msg = 'Route.' + method + '() requires callback functions but got a ' + type;
        throw new Error(msg);
      }

      debug('%s %o', method, this.path)

      var layer = Layer('/', {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }

    return this;
  };
});


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(36);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(36);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * fresh
 * Copyright(c) 2012 TJ Holowaychuk
 * Copyright(c) 2016-2017 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * RegExp to check for no-cache token in Cache-Control.
 * @private
 */

var CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/

/**
 * Simple expression to split token list.
 * @private
 */

var TOKEN_LIST_REGEXP = / *, */

/**
 * Module exports.
 * @public
 */

module.exports = fresh

/**
 * Check freshness of the response using request and response headers.
 *
 * @param {Object} reqHeaders
 * @param {Object} resHeaders
 * @return {Boolean}
 * @public
 */

function fresh (reqHeaders, resHeaders) {
  // fields
  var modifiedSince = reqHeaders['if-modified-since']
  var noneMatch = reqHeaders['if-none-match']

  // unconditional request
  if (!modifiedSince && !noneMatch) {
    return false
  }

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  var cacheControl = reqHeaders['cache-control']
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false
  }

  // if-none-match
  if (noneMatch && noneMatch !== '*') {
    var etag = resHeaders['etag']
    var etagStale = !etag || noneMatch.split(TOKEN_LIST_REGEXP).every(function (match) {
      return match !== etag && match !== 'W/' + etag && 'W/' + match !== etag
    })

    if (etagStale) {
      return false
    }
  }

  // if-modified-since
  if (modifiedSince) {
    var lastModified = resHeaders['last-modified']
    var modifiedStale = !lastModified || Date.parse(lastModified) > Date.parse(modifiedSince)

    if (modifiedStale) {
      return false
    }
  }

  return true
}


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var log4js = __webpack_require__(35);

function categoryFilter (excludes, appender) {
  if (typeof(excludes) === 'string') excludes = [excludes];
  return function(logEvent) {
    if (excludes.indexOf(logEvent.categoryName) === -1) {
      appender(logEvent);
    }
  };
}

function configure(config, options) {
  log4js.loadAppender(config.appender.type);
  var appender = log4js.appenderMakers[config.appender.type](config.appender, options);
  return categoryFilter(config.exclude, appender);
}

exports.appender = categoryFilter;
exports.configure = configure;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cluster = __webpack_require__(334);
var log4js = __webpack_require__(35);

/**
 * Takes a loggingEvent object, returns string representation of it.
 */
function serializeLoggingEvent(loggingEvent) {
	// JSON.stringify(new Error('test')) returns {}, which is not really useful for us.
	// The following allows us to serialize errors correctly.
	for (var i = 0; i < loggingEvent.data.length; i++) {
		var item = loggingEvent.data[i];
		// Validate that we really are in this case
		if (item && item.stack && JSON.stringify(item) === '{}') {
			loggingEvent.data[i] = {stack : item.stack};
		}
	}
	return JSON.stringify(loggingEvent);
}

/**
 * Takes a string, returns an object with
 * the correct log properties.
 *
 * This method has been "borrowed" from the `multiprocess` appender
 * by `nomiddlename`
 * (https://github.com/nomiddlename/log4js-node/blob/master/lib/appenders/multiprocess.js)
 *
 * Apparently, node.js serializes everything to strings when using `process.send()`,
 * so we need smart deserialization that will recreate log date and level for further
 * processing by log4js internals.
 */
function deserializeLoggingEvent(loggingEventString) {

	var loggingEvent;

	try {

		loggingEvent = JSON.parse(loggingEventString);
		loggingEvent.startTime = new Date(loggingEvent.startTime);
		loggingEvent.level = log4js.levels.toLevel(loggingEvent.level.levelStr);
		// Unwrap serialized errors
		for (var i = 0; i < loggingEvent.data.length; i++) {
			var item = loggingEvent.data[i];
			if (item && item.stack) {
				loggingEvent.data[i] = item.stack;
			}
		}

	} catch (e) {

		// JSON.parse failed, just log the contents probably a naughty.
		loggingEvent = {
			startTime: new Date(),
			categoryName: 'log4js',
			level: log4js.levels.ERROR,
			data: [ 'Unable to parse log:', loggingEventString ]
		};
	}
	return loggingEvent;
}

/**
 * Creates an appender.
 *
 * If the current process is a master (`cluster.isMaster`), then this will be a "master appender".
 * Otherwise this will be a worker appender, that just sends loggingEvents to the master process.
 *
 * If you are using this method directly, make sure to provide it with `config.actualAppenders`
 * array of actual appender instances.
 *
 * Or better use `configure(config, options)`
 */
function createAppender(config) {

	if (cluster.isMaster) {

		var masterAppender = function(loggingEvent) {

			if (config.actualAppenders) {
				var size = config.actualAppenders.length;
				for(var i = 0; i < size; i++) {
            if (
							!config.appenders[i].category ||
							config.appenders[i].category === loggingEvent.categoryName
						) {
							// Relying on the index is not a good practice but otherwise
							// the change would have been bigger.
							config.actualAppenders[i](loggingEvent);
      			}
				}
			}
		};

		// Listen on new workers
		cluster.on('fork', function(worker) {

			worker.on('message', function(message) {
				if (message.type && message.type === '::log-message') {
					var loggingEvent = deserializeLoggingEvent(message.event);

					// Adding PID metadata
					loggingEvent.pid = worker.process.pid;
					loggingEvent.cluster = {
						master: process.pid,
						worker: worker.process.pid,
						workerId: worker.id
					};

					masterAppender(loggingEvent);
				}
			});

		});

		return masterAppender;

	} else {

		return function(loggingEvent) {
			// If inside the worker process, then send the logger event to master.
			if (cluster.isWorker) {
				// console.log("worker " + cluster.worker.id + " is sending message");
				process.send({ type: '::log-message', event: serializeLoggingEvent(loggingEvent)});
			}
		};
	}
}

function configure(config, options) {

	if (config.appenders && cluster.isMaster) {

		var size = config.appenders.length;
		config.actualAppenders = new Array(size);

		for(var i = 0; i < size; i++) {

			log4js.loadAppender(config.appenders[i].type);
			config.actualAppenders[i] = log4js.appenderMakers[config.appenders[i].type](
				config.appenders[i],
				options
			);

		}
	}

	return createAppender(config);
}

exports.appender = createAppender;
exports.configure = configure;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var layouts = __webpack_require__(9)
, consoleLog = console.log.bind(console);

function consoleAppender (layout, timezoneOffset) {
  layout = layout || layouts.colouredLayout;
  return function(loggingEvent) {
    consoleLog(layout(loggingEvent, timezoneOffset));
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return consoleAppender(layout, config.timezoneOffset);
}

exports.appender = consoleAppender;
exports.configure = configure;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var streams = __webpack_require__(151)
, layouts = __webpack_require__(9)
, path = __webpack_require__(5)
, os = __webpack_require__(22)
, eol = os.EOL || '\n'
, openFiles = [];

//close open files on process exit.
process.on('exit', function() {
  openFiles.forEach(function (file) {
    file.end();
  });
});

/**
 * File appender that rolls files according to a date pattern.
 * @filename base filename.
 * @pattern the format that will be added to the end of filename when rolling,
 *          also used to check when to roll files - defaults to '.yyyy-MM-dd'
 * @layout layout function for log messages - defaults to basicLayout
 * @timezoneOffset optional timezone offset in minutes - defaults to system local
 */
function appender(filename, pattern, layout, options, timezoneOffset) {
  layout = layout || layouts.basicLayout;

  var logFile = new streams.DateRollingFileStream(
    filename,
    pattern,
    options
  );
  openFiles.push(logFile);

  return function(logEvent) {
    logFile.write(layout(logEvent, timezoneOffset) + eol, "utf8");
  };

}

function configure(config, options) {
  var layout;

  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  if (!config.alwaysIncludePattern) {
    config.alwaysIncludePattern = false;
  }

  if (options && options.cwd && !config.absolute) {
    config.filename = path.join(options.cwd, config.filename);
  }

  return appender(
    config.filename,
    config.pattern,
    layout,
    config,
    config.timezoneOffset
  );
}

function shutdown(cb) {
  var completed = 0;
  var error;
  var complete = function(err) {
    error = error || err;
    completed++;
    if (completed >= openFiles.length) {
      cb(error);
    }
  };
  if (!openFiles.length) {
    return cb();
  }
  openFiles.forEach(function(file) {
    if (!file.write(eol, "utf-8")) {
      file.once('drain', function() {
        file.end(complete);
      });
    } else {
      file.end(complete);
    }
  });
}

exports.appender = appender;
exports.configure = configure;
exports.shutdown = shutdown;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var debug = __webpack_require__(44)('log4js:file')
, layouts = __webpack_require__(9)
, path = __webpack_require__(5)
, fs = __webpack_require__(7)
, streams = __webpack_require__(151)
, os = __webpack_require__(22)
, eol = os.EOL || '\n'
, openFiles = []
, levels = __webpack_require__(24);

//close open files on process exit.
process.on('exit', function() {
  debug('Exit handler called.');
  openFiles.forEach(function (file) {
    file.end();
  });
});

// On SIGHUP, close and reopen all files. This allows this appender to work with
// logrotate. Note that if you are using logrotate, you should not set
// `logSize`.
process.on('SIGHUP', function() {
  debug('SIGHUP handler called.');
  openFiles.forEach(function(writer) {
    writer.closeTheStream(writer.openTheStream.bind(writer));
  });
});

/**
 * File Appender writing the logs to a text file. Supports rolling of logs by size.
 *
 * @param file file log messages will be written to
 * @param layout a function that takes a logevent and returns a string
 *   (defaults to basicLayout).
 * @param logSize - the maximum size (in bytes) for a log file,
 *   if not provided then logs won't be rotated.
 * @param numBackups - the number of log files to keep after logSize
 *   has been reached (default 5)
 * @param options - options to be passed to the underlying stream
 * @param timezoneOffset - optional timezone offset in minutes (default system local)
 */
function fileAppender (file, layout, logSize, numBackups, options, timezoneOffset) {
  file = path.normalize(file);
  layout = layout || layouts.basicLayout;
  numBackups = numBackups === undefined ? 5 : numBackups;
  //there has to be at least one backup if logSize has been specified
  numBackups = numBackups === 0 ? 1 : numBackups;

  debug("Creating file appender (",
    file, ", ",
    logSize, ", ",
    numBackups, ", ",
    options, ", ",
    timezoneOffset, ")"
  );
  var writer = openTheStream(file, logSize, numBackups, options);

  // push file to the stack of open handlers
  openFiles.push(writer);

  return function(loggingEvent) {
    writer.write(layout(loggingEvent, timezoneOffset) + eol, "utf8");
  };

}

function openTheStream(file, fileSize, numFiles, options) {
  var stream = new streams.RollingFileStream(
    file,
    fileSize,
    numFiles,
    options
  );
  stream.on("error", function (err) {
    console.error("log4js.fileAppender - Writing to file %s, error happened ", file, err);
  });
  return stream;
}


function configure(config, options) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  if (options && options.cwd && !config.absolute) {
    config.filename = path.join(options.cwd, config.filename);
  }

  return fileAppender(
    config.filename,
    layout,
    config.maxLogSize,
    config.backups,
    config,
    config.timezoneOffset
  );
}

function shutdown(cb) {
  var completed = 0;
  var error;
  var complete = function(err) {
    error = error || err;
    completed++;
    if (completed >= openFiles.length) {
      cb(error);
    }
  };
  if (!openFiles.length) {
    return cb();
  }
  openFiles.forEach(function(file) {
    var stream = file;
    if (!stream.write(eol, "utf-8")) {
      stream.once('drain', function() {
        stream.end(complete);
      });
    } else {
      stream.end(complete);
    }
  });
}

exports.appender = fileAppender;
exports.configure = configure;
exports.shutdown = shutdown;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var debug = __webpack_require__(44)('log4js:fileSync')
, layouts = __webpack_require__(9)
, path = __webpack_require__(5)
, fs = __webpack_require__(7)
, os = __webpack_require__(22)
, eol = os.EOL || '\n'
;

function RollingFileSync (filename, size, backups, options) {
  debug("In RollingFileStream");

  function throwErrorIfArgumentsAreNotValid() {
    if (!filename || !size || size <= 0) {
      throw new Error("You must specify a filename and file size");
    }
  }

  throwErrorIfArgumentsAreNotValid();

  this.filename = filename;
  this.size = size;
  this.backups = backups || 1;
  this.options = options || { encoding: 'utf8', mode: parseInt('0644', 8), flags: 'a' };
  this.currentSize = 0;

  function currentFileSize(file) {
    var fileSize = 0;
    try {
      fileSize = fs.statSync(file).size;
    } catch (e) {
      // file does not exist
      fs.appendFileSync(filename, '');
    }
    return fileSize;
  }

  this.currentSize = currentFileSize(this.filename);
}

RollingFileSync.prototype.shouldRoll = function() {
  debug("should roll with current size %d, and max size %d", this.currentSize, this.size);
  return this.currentSize >= this.size;
};

RollingFileSync.prototype.roll = function(filename) {
  var that = this,
  nameMatcher = new RegExp('^' + path.basename(filename));

  function justTheseFiles (item) {
    return nameMatcher.test(item);
  }

  function index(filename_) {
    return parseInt(filename_.substring((path.basename(filename) + '.').length), 10) || 0;
  }

  function byIndex(a, b) {
    if (index(a) > index(b)) {
      return 1;
    } else if (index(a) < index(b) ) {
      return -1;
    } else {
      return 0;
    }
  }

  function increaseFileIndex (fileToRename) {
    var idx = index(fileToRename);
    debug('Index of ' + fileToRename + ' is ' + idx);
    if (idx < that.backups) {
      //on windows, you can get a EEXIST error if you rename a file to an existing file
      //so, we'll try to delete the file we're renaming to first
      try {
        fs.unlinkSync(filename + '.' + (idx+1));
      } catch(e) {
        //ignore err: if we could not delete, it's most likely that it doesn't exist
      }

      debug('Renaming ' + fileToRename + ' -> ' + filename + '.' + (idx+1));
      fs.renameSync(path.join(path.dirname(filename), fileToRename), filename + '.' + (idx + 1));
    }
  }

  function renameTheFiles() {
    //roll the backups (rename file.n to file.n+1, where n <= numBackups)
    debug("Renaming the old files");

    var files = fs.readdirSync(path.dirname(filename));
    files.filter(justTheseFiles).sort(byIndex).reverse().forEach(increaseFileIndex);
  }

  debug("Rolling, rolling, rolling");
  renameTheFiles();
};

RollingFileSync.prototype.write = function(chunk, encoding) {
  var that = this;


  function writeTheChunk() {
    debug("writing the chunk to the file");
    that.currentSize += chunk.length;
    fs.appendFileSync(that.filename, chunk);
  }

  debug("in write");


  if (this.shouldRoll()) {
    this.currentSize = 0;
    this.roll(this.filename);
  }

  writeTheChunk();
};


/**
 * File Appender writing the logs to a text file. Supports rolling of logs by size.
 *
 * @param file file log messages will be written to
 * @param layout a function that takes a logevent and returns a string
 *   (defaults to basicLayout).
 * @param logSize - the maximum size (in bytes) for a log file,
 *   if not provided then logs won't be rotated.
 * @param numBackups - the number of log files to keep after logSize
 *   has been reached (default 5)
 * @param timezoneOffset - optional timezone offset in minutes
 *   (default system local)
 */
function fileAppender (file, layout, logSize, numBackups, timezoneOffset) {
  debug("fileSync appender created");
  var bytesWritten = 0;
  file = path.normalize(file);
  layout = layout || layouts.basicLayout;
  numBackups = numBackups === undefined ? 5 : numBackups;
  //there has to be at least one backup if logSize has been specified
  numBackups = numBackups === 0 ? 1 : numBackups;

  function openTheStream(file, fileSize, numFiles) {
    var stream;

    if (fileSize) {
      stream = new RollingFileSync(
        file,
        fileSize,
        numFiles
      );
    } else {
      stream = (function(f) {
        // create file if it doesn't exist
        if (!fs.existsSync(f))
            fs.appendFileSync(f, '');

        return {
            write: function(data) {
                fs.appendFileSync(f, data);
            }
        };
      })(file);
    }

    return stream;
  }

  var logFile = openTheStream(file, logSize, numBackups);

  return function(loggingEvent) {
    logFile.write(layout(loggingEvent, timezoneOffset) + eol);
  };
}

function configure(config, options) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  if (options && options.cwd && !config.absolute) {
    config.filename = path.join(options.cwd, config.filename);
  }

  return fileAppender(
    config.filename,
    layout,
    config.maxLogSize,
    config.backups,
    config.timezoneOffset
  );
}

exports.appender = fileAppender;
exports.configure = configure;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var zlib = __webpack_require__(158);
var layouts = __webpack_require__(9);
var levels = __webpack_require__(24);
var dgram = __webpack_require__(81);
var util = __webpack_require__(8);
var debug = __webpack_require__(44)('log4js:gelf');

var LOG_EMERG=0;    // system is unusable
var LOG_ALERT=1;    // action must be taken immediately
var LOG_CRIT=2;     // critical conditions
var LOG_ERR=3;      // error conditions
var LOG_ERROR=3;    // because people WILL typo
var LOG_WARNING=4;  // warning conditions
var LOG_NOTICE=5;   // normal, but significant, condition
var LOG_INFO=6;     // informational message
var LOG_DEBUG=7;    // debug-level message

var levelMapping = {};
levelMapping[levels.ALL] = LOG_DEBUG;
levelMapping[levels.TRACE] = LOG_DEBUG;
levelMapping[levels.DEBUG] = LOG_DEBUG;
levelMapping[levels.INFO] = LOG_INFO;
levelMapping[levels.WARN] = LOG_WARNING;
levelMapping[levels.ERROR] = LOG_ERR;
levelMapping[levels.FATAL] = LOG_CRIT;

var client;

/**
 * GELF appender that supports sending UDP packets to a GELF compatible server such as Graylog
 *
 * @param layout a function that takes a logevent and returns a string (defaults to none).
 * @param host - host to which to send logs (default:localhost)
 * @param port - port at which to send logs to (default:12201)
 * @param hostname - hostname of the current host (default:os hostname)
 * @param facility - facility to log to (default:nodejs-server)
 */
 /* jshint maxstatements:21 */
function gelfAppender (layout, host, port, hostname, facility) {
  var config, customFields;
  if (typeof(host) === 'object') {
    config = host;
    host = config.host;
    port = config.port;
    hostname = config.hostname;
    facility = config.facility;
    customFields = config.customFields;
  }

  host = host || 'localhost';
  port = port || 12201;
  hostname = hostname || __webpack_require__(22).hostname();
  layout = layout || layouts.messagePassThroughLayout;

  var defaultCustomFields = customFields || {};

  if(facility) {
    defaultCustomFields._facility = facility;
  }

  client = dgram.createSocket("udp4");

  process.on('exit', function() {
    if (client) client.close();
  });

  /**
   * Add custom fields (start with underscore )
   * - if the first object passed to the logger contains 'GELF' field,
   *   copy the underscore fields to the message
   * @param loggingEvent
   * @param msg
   */
  function addCustomFields(loggingEvent, msg){

    /* append defaultCustomFields firsts */
    Object.keys(defaultCustomFields).forEach(function(key) {
      // skip _id field for graylog2, skip keys not starts with UNDERSCORE
      if (key.match(/^_/) && key !== "_id") {
        msg[key] = defaultCustomFields[key];
      }
    });

    /* append custom fields per message */
    var data = loggingEvent.data;
    if (!Array.isArray(data) || data.length === 0) return;
    var firstData = data[0];

    if (!firstData.GELF) return; // identify with GELF field defined
    // Remove the GELF key, some gelf supported logging systems drop the message with it
    delete firstData.GELF;
    Object.keys(firstData).forEach(function(key) {
      // skip _id field for graylog2, skip keys not starts with UNDERSCORE
      if (key.match(/^_/) || key !== "_id") {
        msg[key] = firstData[key];
      }
    });

    /* the custom field object should be removed, so it will not be looged by the later appenders */
    loggingEvent.data.shift();
  }

  function preparePacket(loggingEvent) {
    var msg = {};
    addCustomFields(loggingEvent, msg);
    msg.short_message = layout(loggingEvent);

    msg.version="1.1";
    msg.timestamp = msg.timestamp || new Date().getTime() / 1000; // log should use millisecond
    msg.host = hostname;
    msg.level = levelMapping[loggingEvent.level || levels.DEBUG];
    return msg;
  }

  function sendPacket(packet) {
    client.send(packet, 0, packet.length, port, host, function(err) {
      if (err) { console.error(err); }
    });
  }

  return function(loggingEvent) {
    var message = preparePacket(loggingEvent);
    zlib.gzip(new Buffer(JSON.stringify(message)), function(err, packet) {
      if (err) {
        console.error(err.stack);
      } else {
        if (packet.length > 8192) {
          debug("Message packet length (" + packet.length + ") is larger than 8k. Not sending");
        } else {
          sendPacket(packet);
        }
      }
    });
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return gelfAppender(layout, config);
}

function shutdown(cb) {
  if (client) {
    client.close(cb);
    client = null;
  }
}

exports.appender = gelfAppender;
exports.configure = configure;
exports.shutdown = shutdown;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hipchat = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"hipchat-notifier\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var layouts = __webpack_require__(9);

exports.name = 'hipchat';
exports.appender  = hipchatAppender;
exports.configure = hipchatConfigure;

/**
  @invoke as

  log4js.configure({
    "appenders": [
      {
        "type" : "hipchat",
        "hipchat_token": "< User token with Notification Privileges >",
        "hipchat_room": "< Room ID or Name >",
        // optionl
        "hipchat_from": "[ additional from label ]",
        "hipchat_notify": "[ notify boolean to bug people ]",
        "hipchat_host" : "api.hipchat.com"
      }
    ]
  });

  var logger = log4js.getLogger("hipchat");
  logger.warn("Test Warn message");

  @invoke
 */

function hipchatNotifierResponseCallback(err, response, body){
  if(err) {
    throw err;
  }
}

function hipchatAppender(config) {

	var notifier = hipchat.make(config.hipchat_room, config.hipchat_token);

  // @lint W074 This function's cyclomatic complexity is too high. (10)
  return function(loggingEvent){

    var notifierFn;

    notifier.setRoom(config.hipchat_room);
    notifier.setFrom(config.hipchat_from || '');
    notifier.setNotify(config.hipchat_notify || false);

    if(config.hipchat_host) {
      notifier.setHost(config.hipchat_host);
    }

    switch (loggingEvent.level.toString()) {
      case "TRACE":
      case "DEBUG":
        notifierFn = "info";
        break;
      case "WARN":
        notifierFn = "warning";
        break;
      case "ERROR":
      case "FATAL":
        notifierFn = "failure";
        break;
      default:
        notifierFn = "success";
    }

    // @TODO, re-work in timezoneOffset ?
    var layoutMessage = config.layout(loggingEvent);

    // dispatch hipchat api request, do not return anything
    //  [overide hipchatNotifierResponseCallback]
    notifier[notifierFn](layoutMessage, config.hipchat_response_callback ||
      hipchatNotifierResponseCallback);
  };
}

function hipchatConfigure(config) {
	var layout;

	if (!config.layout) {
		config.layout = layouts.messagePassThroughLayout;
	}

	return hipchatAppender(config, layout);
}


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
* logFaces appender sends JSON formatted log events to logFaces receivers.
* There are two types of receivers supported - raw UDP sockets (for server side apps),
* and HTTP (for client side apps). Depending on the usage, this appender
* requires either of the two:
*
* For UDP require 'dgram', see 'https://nodejs.org/api/dgram.html'
* For HTTP require 'axios', see 'https://www.npmjs.com/package/axios'
*
* Make sure your project have relevant dependancy installed before using this appender.
*/


var util = __webpack_require__(8);
var context = {};

function datagram(config){
   var sock = __webpack_require__(81).createSocket('udp4');
   var host = config.remoteHost || "127.0.0.1";
   var port = config.port || 55201;

   return function(event){
      var buff = new Buffer(JSON.stringify(event));
      sock.send(buff, 0, buff.length, port, host, function(err, bytes) {
         if(err){
            console.error("log4js.logFacesAppender failed to %s:%d, error: %s",
                          host, port, err);
         }
      });
   };
}

function servlet(config){
   var axios = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"axios\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).create();
   axios.defaults.baseURL = config.url;
   axios.defaults.timeout = config.timeout || 5000;
   axios.defaults.headers = {'Content-Type': 'application/json'};
   axios.defaults.withCredentials = true;

   return function(lfsEvent){
      axios.post("", lfsEvent)
      .then(function(response){
         if(response.status != 200){
            console.error("log4js.logFacesAppender post to %s failed: %d",
                           config.url, response.status);
         }
      })
      .catch(function(response){
         console.error("log4js.logFacesAppender post to %s excepted: %s",
                          config.url, response.status);
      });
   };
}

/**
* For UDP (node.js) use the following configuration params:
*   {
*      "type": "logFacesAppender",       // must be present for instantiation
*      "application": "LFS-TEST",        // name of the application (domain)
*      "remoteHost": "127.0.0.1",        // logFaces server address (hostname)
*      "port": 55201                     // UDP receiver listening port
*   }
*
* For HTTP (browsers or node.js) use the following configuration params:
*   {
*      "type": "logFacesAppender",       // must be present for instantiation
*      "application": "LFS-TEST",        // name of the application (domain)
*      "url": "http://lfs-server/logs",  // logFaces receiver servlet URL
*   }
*/
function logFacesAppender(config) {
   var send = config.send;
   if(send === undefined){
      send = (config.url === undefined) ? datagram(config) : servlet(config);
   }

   return function log(event) {
      // convert to logFaces compact json format
      var lfsEvent = {
         a: config.application || "",   // application name
         t: event.startTime.getTime(),  // time stamp
         p: event.level.levelStr,       // level (priority)
         g: event.categoryName,         // logger name
         m: format(event.data)          // message text
      };

      // add context variables if exist
      Object.keys(context).forEach(function(key) {
         lfsEvent['p_' + key] = context[key];
      });

      // send to server
      send(lfsEvent);
   };
}

function configure(config) {
   return logFacesAppender(config);
}

function setContext(key, value){
   context[key] = value;
}

function format(logData) {
  var data = Array.isArray(logData) ?
               logData : Array.prototype.slice.call(arguments);
  return util.format.apply(util, wrapErrorsWithInspect(data));
}

function wrapErrorsWithInspect(items) {
  return items.map(function(item) {
    if ((item instanceof Error) && item.stack) {
      return { inspect: function() {
          return util.format(item) + '\n' + item.stack;
       }};
    } else {
      return item;
    }
  });
}

exports.appender = logFacesAppender;
exports.configure = configure;
exports.setContext = setContext;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var levels = __webpack_require__(24)
, log4js = __webpack_require__(35);

function logLevelFilter (minLevelString, maxLevelString, appender) {
  var minLevel = levels.toLevel(minLevelString);
  var maxLevel = levels.toLevel(maxLevelString, levels.FATAL);
  return function(logEvent) {
      var eventLevel = logEvent.level;
      if (eventLevel.isGreaterThanOrEqualTo(minLevel) && eventLevel.isLessThanOrEqualTo(maxLevel)) {
      appender(logEvent);
    }
  };
}

function configure(config, options) {
  log4js.loadAppender(config.appender.type);
  var appender = log4js.appenderMakers[config.appender.type](config.appender, options);
  return logLevelFilter(config.level, config.maxLevel, appender);
}

exports.appender = logLevelFilter;
exports.configure = configure;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var layouts = __webpack_require__(9)
, loggly = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"loggly\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
, os = __webpack_require__(22)
, passThrough = layouts.messagePassThroughLayout
, openRequests = 0
, shutdownCB;

function isAnyObject(value) {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

function numKeys(o) {
  var res = 0;
  for (var k in o) {
    if (o.hasOwnProperty(k)) res++;
  }
  return res;
}

/**
 * @param msg - array of args for logging.
 * @returns { deTaggedMsg: [], additionalTags: [] }
 */
function processTags(msgListArgs) {
  var msgList = (msgListArgs.length === 1 ? [msgListArgs[0]] : Array.apply(null, msgListArgs));

  return msgList.reduce(function (accum, element, currentIndex, array) {
    if (isAnyObject(element) && Array.isArray(element.tags) && numKeys(element) == 1) {
      accum.additionalTags = accum.additionalTags.concat(element.tags);
    } else {
      accum.deTaggedData.push(element);
    }
    return accum;
  }, { deTaggedData: [], additionalTags: [] });
}

/**
 * Loggly Appender. Sends logging events to Loggly using node-loggly, optionally adding tags.
 *
 * This appender will scan the msg from the logging event, and pull out any argument of the
 * shape `{ tags: [] }` so that it's possibleto add tags in a normal logging call.
 *
 * For example:
 *
 * logger.info({ tags: ['my-tag-1', 'my-tag-2'] }, 'Some message', someObj, ...)
 *
 * And then this appender will remove the tags param and append it to the config.tags.
 *
 * @param config object with loggly configuration data
 * {
 *   token: 'your-really-long-input-token',
 *   subdomain: 'your-subdomain',
 *   tags: ['loggly-tag1', 'loggly-tag2', .., 'loggly-tagn']
 * }
 * @param layout a function that takes a logevent and returns a string (defaults to objectLayout).
 */
function logglyAppender(config, layout) {
	var client = loggly.createClient(config);
  if(!layout) layout = passThrough;

  return function(loggingEvent) {
    var result = processTags(loggingEvent.data);
    var deTaggedData = result.deTaggedData;
    var additionalTags = result.additionalTags;

    // Replace the data property with the deTaggedData
    loggingEvent.data = deTaggedData;

    var msg = layout(loggingEvent);

		openRequests++;

		client.log({
			msg: msg,
			level: loggingEvent.level.levelStr,
			category: loggingEvent.categoryName,
			hostname: os.hostname().toString(),
		}, additionalTags, function (error, result) {
			if (error) {
				console.error("log4js.logglyAppender - error occurred: ", error);
			}

			openRequests--;

			if (shutdownCB && openRequests === 0) {
				shutdownCB();

				shutdownCB = undefined;
			}
		});
  };
}

function configure(config) {
	var layout;
	if (config.layout) {
		layout = layouts.layout(config.layout.type, config.layout);
	}
	return logglyAppender(config, layout);
}

function shutdown (cb) {
	if (openRequests === 0) {
		cb();
	}	else {
		shutdownCB = cb;
	}
}

exports.name      = 'loggly';
exports.appender  = logglyAppender;
exports.configure = configure;
exports.shutdown  = shutdown;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var layouts = __webpack_require__(9)
, dgram = __webpack_require__(81)
, util = __webpack_require__(8);

function logstashUDP (config, layout) {
  var udp = dgram.createSocket('udp4');
  var type = config.logType ? config.logType : config.category;
  layout = layout || layouts.dummyLayout;
  if(!config.fields) {
    config.fields = {};
  }
  return function log(loggingEvent) {

    /*
      https://gist.github.com/jordansissel/2996677
      {
        "message"    => "hello world",
        "@version"   => "1",
        "@timestamp" => "2014-04-22T23:03:14.111Z",
        "type"       => "stdin",
        "host"       => "hello.local"
      }
      @timestamp is the ISO8601 high-precision timestamp for the event.
      @version is the version number of this json schema
      Every other field is valid and fine.
    */

    if (loggingEvent.data.length > 1) {
      var secondEvData = loggingEvent.data[1];
      for (var k in secondEvData) {
        config.fields[k] = secondEvData[k];
      }
    }
    config.fields.level = loggingEvent.level.levelStr;
    config.fields.category = loggingEvent.categoryName;

    var logObject = {
      "@version" : "1",
      "@timestamp" : (new Date(loggingEvent.startTime)).toISOString(),
      "type" : config.logType ? config.logType : config.category,
      "message" : layout(loggingEvent),
      "fields" : config.fields
    };
    sendLog(udp, config.host, config.port, logObject);
  };
}

function sendLog(udp, host, port, logObject) {
  var buffer = new Buffer(JSON.stringify(logObject));
  udp.send(buffer, 0, buffer.length, port, host, function(err, bytes) {
    if(err) {
      console.error(
        "log4js.logstashUDP - %s:%p Error: %s", host, port, util.inspect(err)
      );
    }
  });
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return logstashUDP(config, layout);
}

exports.appender = logstashUDP;
exports.configure = configure;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var layouts = __webpack_require__(9);
var layout;
var config;
var mailgun;

function mailgunAppender(_config, _layout) {

    config = _config;
    layout = _layout || layouts.basicLayout;

    return function (loggingEvent) {

        var data = {
            from: _config.from,
            to: _config.to,
            subject: _config.subject,
            text: layout(loggingEvent, config.timezoneOffset)
        };

        mailgun.messages().send(data, function (error, body) {
            if (error !== null) console.error("log4js.mailgunAppender - Error happened", error);
        });
    };
}

function configure(_config) {
    config = _config;

    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }

    mailgun = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"mailgun-js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))({
        apiKey: _config.apikey,
        domain: _config.domain
    });

    return mailgunAppender(_config, layout);
}

exports.appender = mailgunAppender;
exports.configure = configure;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var log4js = __webpack_require__(35)
, debug = __webpack_require__(44)('log4js:multiprocess')
, net = __webpack_require__(30)
, END_MSG = '__LOG4JS__'
, servers = [];

/**
 * Creates a server, listening on config.loggerPort, config.loggerHost.
 * Output goes to config.actualAppender (config.appender is used to
 * set up that appender).
 */
function logServer(config) {

  /**
   * Takes a utf-8 string, returns an object with
   * the correct log properties.
   */
  function deserializeLoggingEvent(clientSocket, msg) {
    var loggingEvent;
    try {
      loggingEvent = JSON.parse(msg);
      loggingEvent.startTime = new Date(loggingEvent.startTime);
      loggingEvent.level = log4js.levels.toLevel(loggingEvent.level.levelStr);
    } catch (e) {
      // JSON.parse failed, just log the contents probably a naughty.
      loggingEvent = {
        startTime: new Date(),
        categoryName: 'log4js',
        level: log4js.levels.ERROR,
        data: [ 'Unable to parse log:', msg ]
      };
    }

    loggingEvent.remoteAddress = clientSocket.remoteAddress;
    loggingEvent.remotePort = clientSocket.remotePort;

    return loggingEvent;
  }

  var actualAppender = config.actualAppender,
  server = net.createServer(function serverCreated(clientSocket) {
    clientSocket.setEncoding('utf8');
    var logMessage = '';

    function logTheMessage(msg) {
      if (logMessage.length > 0) {
        actualAppender(deserializeLoggingEvent(clientSocket, msg));
      }
    }

    function chunkReceived(chunk) {
      var event;
      logMessage += chunk || '';
      if (logMessage.indexOf(END_MSG) > -1) {
        event = logMessage.substring(0, logMessage.indexOf(END_MSG));
        logTheMessage(event);
        logMessage = logMessage.substring(event.length + END_MSG.length) || '';
        //check for more, maybe it was a big chunk
        chunkReceived();
      }
    }

    clientSocket.on('data', chunkReceived);
    clientSocket.on('end', chunkReceived);
  });

  server.listen(config.loggerPort || 5000, config.loggerHost || 'localhost', function() {
    servers.push(server);
    //allow the process to exit, if this is the only socket active
    server.unref();
  });

  return actualAppender;
}

function workerAppender(config) {
  var canWrite = false,
  buffer = [],
  socket;

  createSocket();

  function createSocket() {
    socket = net.createConnection(config.loggerPort || 5000, config.loggerHost || 'localhost');
    socket.on('connect', function() {
      emptyBuffer();
      canWrite = true;
    });
    socket.on('timeout', socket.end.bind(socket));
    //don't bother listening for 'error', 'close' gets called after that anyway
    socket.on('close', createSocket);
  }

  function emptyBuffer() {
    var evt;
    while ((evt = buffer.shift())) {
      write(evt);
    }
  }

  function write(loggingEvent) {
	// JSON.stringify(new Error('test')) returns {}, which is not really useful for us.
	// The following allows us to serialize errors correctly.
  // Validate that we really are in this case
	if (loggingEvent && loggingEvent.stack && JSON.stringify(loggingEvent) === '{}') {
		loggingEvent = {stack : loggingEvent.stack};
	}
    socket.write(JSON.stringify(loggingEvent), 'utf8');
    socket.write(END_MSG, 'utf8');
  }

  return function log(loggingEvent) {
    if (canWrite) {
      write(loggingEvent);
    } else {
      buffer.push(loggingEvent);
    }
  };
}

function createAppender(config) {
  if (config.mode === 'master') {
    return logServer(config);
  } else {
    return workerAppender(config);
  }
}

function configure(config, options) {
  var actualAppender;
  if (config.appender && config.mode === 'master') {
    log4js.loadAppender(config.appender.type);
    actualAppender = log4js.appenderMakers[config.appender.type](config.appender, options);
    config.actualAppender = actualAppender;
  }
  return createAppender(config);
}

function shutdown(done) {
  var toBeClosed = servers.length;
  debug("multiprocess shutdown with ", toBeClosed, " servers to close.");
  servers.forEach(function(server) {
    server.close(function() {
      debug("server closed.");
      toBeClosed--;
      if (toBeClosed < 1) {
        debug("all servers closed.");
        done();
      }
    });
  });
}

exports.appender = createAppender;
exports.configure = configure;
exports.shutdown = shutdown;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Slack = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"slack-node\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var layouts = __webpack_require__(9);
var layout;

var slack, config;

function slackAppender(_config, _layout) {

    layout = _layout || layouts.basicLayout;

    return function (loggingEvent) {

        var data = {
            channel_id: _config.channel_id,
            text: layout(loggingEvent, _config.timezoneOffset),
            icon_url: _config.icon_url,
            username: _config.username
        };

        slack.api('chat.postMessage', {
            channel: data.channel_id,
            text: data.text,
            icon_url: data.icon_url,username: data.username}, function (err, response) {
            if (err) { throw err; }
        });

    };
}

function configure(_config) {

    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }

    slack = new Slack(_config.token);

    return slackAppender(_config, layout);
}

exports.name      = 'slack';
exports.appender = slackAppender;
exports.configure = configure;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var layouts = __webpack_require__(9);
var mailer = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"nodemailer\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var os = __webpack_require__(22);

var logEventBuffer = [];
var subjectLayout;
var layout;

var unsentCount = 0;
var shutdownTimeout;

var sendInterval;
var sendTimer;

var config;

function sendBuffer() {
    if (logEventBuffer.length > 0) {

        var transportOpts = getTransportOptions(config);
        var transport = mailer.createTransport(transportOpts);
        var firstEvent = logEventBuffer[0];
        var body = "";
        var count = logEventBuffer.length;
        while (logEventBuffer.length > 0) {
            body += layout(logEventBuffer.shift(), config.timezoneOffset) + "\n";
        }

        var msg = {
            to: config.recipients,
            subject: config.subject || subjectLayout(firstEvent),
            headers: {"Hostname": os.hostname()}
        };

        if (true === config.attachment.enable) {
            msg[config.html ? "html" : "text"] = config.attachment.message;
            msg.attachments = [
                {
                    filename: config.attachment.filename,
                    contentType: 'text/x-log',
                    content: body
                }
            ];
        } else {
            msg[config.html ? "html" : "text"] = body;
        }

        if (config.sender) {
            msg.from = config.sender;
        }
        transport.sendMail(msg, function (error) {
            if (error) {
                console.error("log4js.smtpAppender - Error happened", error);
            }
            transport.close();
            unsentCount -= count;
        });
    }
}

function getTransportOptions() {
    var transportOpts = null;
    if (config.SMTP) {
        transportOpts = config.SMTP;
    } else if (config.transport) {
        var plugin = config.transport.plugin || 'smtp';
        var transportModule = 'nodemailer-' + plugin + '-transport';
        var transporter = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
        transportOpts = transporter(config.transport.options);
    }

    return transportOpts;
}

function scheduleSend() {
    if (!sendTimer) {
        sendTimer = setTimeout(function () {
            sendTimer = null;
            sendBuffer();
        }, sendInterval);
    }
}

/**
 * SMTP Appender. Sends logging events using SMTP protocol. 
 * It can either send an email on each event or group several 
 * logging events gathered during specified interval.
 *
 * @param _config appender configuration data
 *    config.sendInterval time between log emails (in seconds), if 0
 *    then every event sends an email
 *    config.shutdownTimeout time to give up remaining emails (in seconds; defaults to 5).
 * @param _layout a function that takes a logevent and returns a string (defaults to basicLayout).
 */
function smtpAppender(_config, _layout) {
    config = _config;

    if (!config.attachment) {
        config.attachment = {};
    }

    config.attachment.enable = !!config.attachment.enable;
    config.attachment.message = config.attachment.message || "See logs as attachment";
    config.attachment.filename = config.attachment.filename || "default.log";
    layout = _layout || layouts.basicLayout;
    subjectLayout = layouts.messagePassThroughLayout;
    sendInterval = config.sendInterval * 1000 || 0;

    shutdownTimeout = ('shutdownTimeout' in config ? config.shutdownTimeout : 5) * 1000;

    return function (loggingEvent) {
        unsentCount++;
        logEventBuffer.push(loggingEvent);
        if (sendInterval > 0) {
            scheduleSend();
        } else {
            sendBuffer();
        }
    };
}

function configure(_config) {
    config = _config;
    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }
    return smtpAppender(_config, layout);
}

function shutdown(cb) {
    if (shutdownTimeout > 0) {
        setTimeout(function () {
            if (sendTimer)
                clearTimeout(sendTimer);
            sendBuffer();
        }, shutdownTimeout);
    }
    (function checkDone() {
      if (unsentCount > 0) {
        setTimeout(checkDone, 100);
      } else {
        cb();
      }
    })();
}

exports.name = "smtp";
exports.appender = smtpAppender;
exports.configure = configure;
exports.shutdown = shutdown;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var layouts = __webpack_require__(9);

function stderrAppender(layout, timezoneOffset) {
  layout = layout || layouts.colouredLayout;
  return function(loggingEvent) {
    process.stderr.write(layout(loggingEvent, timezoneOffset) + '\n');
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return stderrAppender(layout, config.timezoneOffset);
}

exports.appender = stderrAppender;
exports.configure = configure;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var layouts = __webpack_require__(9);

function stdoutAppender(layout, timezoneOffset) {
  layout = layout || layouts.colouredLayout;
  return function(loggingEvent) {
    process.stdout.write(layout(loggingEvent, timezoneOffset) + '\n');
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return stdoutAppender(layout, config.timezoneOffset);
}

exports.appender = stdoutAppender;
exports.configure = configure;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __webpack_require__(220)
var extname = __webpack_require__(5).extname

/**
 * Module variables.
 * @private
 */

var extractTypeRegExp = /^\s*([^;\s]*)(?:;|\s|$)/
var textTypeRegExp = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = extractTypeRegExp.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && textTypeRegExp.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = extractTypeRegExp.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),
/* 117 */,
/* 118 */,
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * proxy-addr
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = proxyaddr;
module.exports.all = alladdrs;
module.exports.compile = compile;

/**
 * Module dependencies.
 * @private
 */

var forwarded = __webpack_require__(207);
var ipaddr = __webpack_require__(210);

/**
 * Variables.
 * @private
 */

var digitre = /^[0-9]+$/;
var isip = ipaddr.isValid;
var parseip = ipaddr.parse;

/**
 * Pre-defined IP ranges.
 * @private
 */

var ipranges = {
  linklocal: ['169.254.0.0/16', 'fe80::/10'],
  loopback: ['127.0.0.1/8', '::1/128'],
  uniquelocal: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', 'fc00::/7']
};

/**
 * Get all addresses in the request, optionally stopping
 * at the first untrusted.
 *
 * @param {Object} request
 * @param {Function|Array|String} [trust]
 * @public
 */

function alladdrs(req, trust) {
  // get addresses
  var addrs = forwarded(req);

  if (!trust) {
    // Return all addresses
    return addrs;
  }

  if (typeof trust !== 'function') {
    trust = compile(trust);
  }

  for (var i = 0; i < addrs.length - 1; i++) {
    if (trust(addrs[i], i)) continue;

    addrs.length = i + 1;
  }

  return addrs;
}

/**
 * Compile argument into trust function.
 *
 * @param {Array|String} val
 * @private
 */

function compile(val) {
  if (!val) {
    throw new TypeError('argument is required');
  }

  var trust = typeof val === 'string'
    ? [val]
    : val;

  if (!Array.isArray(trust)) {
    throw new TypeError('unsupported trust argument');
  }

  for (var i = 0; i < trust.length; i++) {
    val = trust[i];

    if (!ipranges.hasOwnProperty(val)) {
      continue;
    }

    // Splice in pre-defined range
    val = ipranges[val];
    trust.splice.apply(trust, [i, 1].concat(val));
    i += val.length - 1;
  }

  return compileTrust(compileRangeSubnets(trust));
}

/**
 * Compile `arr` elements into range subnets.
 *
 * @param {Array} arr
 * @private
 */

function compileRangeSubnets(arr) {
  var rangeSubnets = new Array(arr.length);

  for (var i = 0; i < arr.length; i++) {
    rangeSubnets[i] = parseipNotation(arr[i]);
  }

  return rangeSubnets;
}

/**
 * Compile range subnet array into trust function.
 *
 * @param {Array} rangeSubnets
 * @private
 */

function compileTrust(rangeSubnets) {
  // Return optimized function based on length
  var len = rangeSubnets.length;
  return len === 0
    ? trustNone
    : len === 1
    ? trustSingle(rangeSubnets[0])
    : trustMulti(rangeSubnets);
}

/**
 * Parse IP notation string into range subnet.
 *
 * @param {String} note
 * @private
 */

function parseipNotation(note) {
  var pos = note.lastIndexOf('/');
  var str = pos !== -1
    ? note.substring(0, pos)
    : note;

  if (!isip(str)) {
    throw new TypeError('invalid IP address: ' + str);
  }

  var ip = parseip(str);

  if (pos === -1 && ip.kind() === 'ipv6' && ip.isIPv4MappedAddress()) {
    // Store as IPv4
    ip = ip.toIPv4Address();
  }

  var max = ip.kind() === 'ipv6'
    ? 128
    : 32;

  var range = pos !== -1
    ? note.substring(pos + 1, note.length)
    : null;

  if (range === null) {
    range = max;
  } else if (digitre.test(range)) {
    range = parseInt(range, 10);
  } else if (ip.kind() === 'ipv4' && isip(range)) {
    range = parseNetmask(range);
  } else {
    range = null;
  }

  if (range <= 0 || range > max) {
    throw new TypeError('invalid range on address: ' + note);
  }

  return [ip, range];
}

/**
 * Parse netmask string into CIDR range.
 *
 * @param {String} netmask
 * @private
 */

function parseNetmask(netmask) {
  var ip = parseip(netmask);
  var kind = ip.kind();

  return kind === 'ipv4'
    ? ip.prefixLengthFromSubnetMask()
    : null;
}

/**
 * Determine address of proxied request.
 *
 * @param {Object} request
 * @param {Function|Array|String} trust
 * @public
 */

function proxyaddr(req, trust) {
  if (!req) {
    throw new TypeError('req argument is required');
  }

  if (!trust) {
    throw new TypeError('trust argument is required');
  }

  var addrs = alladdrs(req, trust);
  var addr = addrs[addrs.length - 1];

  return addr;
}

/**
 * Static trust function to trust nothing.
 *
 * @private
 */

function trustNone() {
  return false;
}

/**
 * Compile trust function for multiple subnets.
 *
 * @param {Array} subnets
 * @private
 */

function trustMulti(subnets) {
  return function trust(addr) {
    if (!isip(addr)) return false;

    var ip = parseip(addr);
    var ipconv;
    var kind = ip.kind();

    for (var i = 0; i < subnets.length; i++) {
      var subnet = subnets[i];
      var subnetip = subnet[0];
      var subnetkind = subnetip.kind();
      var subnetrange = subnet[1];
      var trusted = ip;

      if (kind !== subnetkind) {
        if (subnetkind === 'ipv4' && !ip.isIPv4MappedAddress()) {
          // Incompatible IP addresses
          continue;
        }

        if (!ipconv) {
          // Convert IP to match subnet IP kind
          ipconv = subnetkind === 'ipv4'
            ? ip.toIPv4Address()
            : ip.toIPv4MappedAddress();
        }

        trusted = ipconv;
      }

      if (trusted.match(subnetip, subnetrange)) {
        return true;
      }
    }

    return false;
  };
}

/**
 * Compile trust function for single subnet.
 *
 * @param {Object} subnet
 * @private
 */

function trustSingle(subnet) {
  var subnetip = subnet[0];
  var subnetkind = subnetip.kind();
  var subnetisipv4 = subnetkind === 'ipv4';
  var subnetrange = subnet[1];

  return function trust(addr) {
    if (!isip(addr)) return false;

    var ip = parseip(addr);
    var kind = ip.kind();

    if (kind !== subnetkind) {
      if (subnetisipv4 && !ip.isIPv4MappedAddress()) {
        // Incompatible IP addresses
        return false;
      }

      // Convert IP to match subnet IP kind
      ip = subnetisipv4
        ? ip.toIPv4Address()
        : ip.toIPv4MappedAddress();
    }

    return ip.match(subnetip, subnetrange);
  };
}


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(233);
var parse = __webpack_require__(232);
var formats = __webpack_require__(120);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

exports.arrayToObject = function (source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function (target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
    }

    return out;
};

exports.compact = function (obj, references) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var refs = references || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && typeof obj[i] === 'object') {
                compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    keys.forEach(function (key) {
        obj[key] = exports.compact(obj[key], refs);
    });

    return obj;
};

exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function (obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * range-parser
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = rangeParser

/**
 * Parse "Range" header `str` relative to the given file `size`.
 *
 * @param {Number} size
 * @param {String} str
 * @param {Object} [options]
 * @return {Array}
 * @public
 */

function rangeParser (size, str, options) {
  var index = str.indexOf('=')

  if (index === -1) {
    return -2
  }

  // split the range string
  var arr = str.slice(index + 1).split(',')
  var ranges = []

  // add ranges type
  ranges.type = str.slice(0, index)

  // parse all ranges
  for (var i = 0; i < arr.length; i++) {
    var range = arr[i].split('-')
    var start = parseInt(range[0], 10)
    var end = parseInt(range[1], 10)

    // -nnn
    if (isNaN(start)) {
      start = size - end
      end = size - 1
    // nnn-
    } else if (isNaN(end)) {
      end = size - 1
    }

    // limit last-byte-pos to current length
    if (end > size - 1) {
      end = size - 1
    }

    // invalid or unsatisifiable
    if (isNaN(start) || isNaN(end) || start > end || start < 0) {
      continue
    }

    // add range
    ranges.push({
      start: start,
      end: end
    })
  }

  if (ranges.length < 1) {
    // unsatisifiable
    return -1
  }

  return options && options.combine
    ? combineRanges(ranges)
    : ranges
}

/**
 * Combine overlapping & adjacent ranges.
 * @private
 */

function combineRanges (ranges) {
  var ordered = ranges.map(mapWithIndex).sort(sortByRangeStart)

  for (var j = 0, i = 1; i < ordered.length; i++) {
    var range = ordered[i]
    var current = ordered[j]

    if (range.start > current.end + 1) {
      // next range
      ordered[++j] = range
    } else if (range.end > current.end) {
      // extend range
      current.end = range.end
      current.index = Math.min(current.index, range.index)
    }
  }

  // trim ordered array
  ordered.length = j + 1

  // generate combined range
  var combined = ordered.sort(sortByRangeIndex).map(mapWithoutIndex)

  // copy ranges type
  combined.type = ranges.type

  return combined
}

/**
 * Map function to add index value to ranges.
 * @private
 */

function mapWithIndex (range, index) {
  return {
    start: range.start,
    end: range.end,
    index: index
  }
}

/**
 * Map function to remove index value from ranges.
 * @private
 */

function mapWithoutIndex (range) {
  return {
    start: range.start,
    end: range.end
  }
}

/**
 * Sort function to sort ranges by index.
 * @private
 */

function sortByRangeIndex (a, b) {
  return a.index - b.index
}

/**
 * Sort function to sort ranges by start position.
 * @private
 */

function sortByRangeStart (a, b) {
  return a.start - b.start
}


/***/ }),
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(36);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fs = __webpack_require__(7)
, zlib = __webpack_require__(158)
, debug = __webpack_require__(79)('streamroller:BaseRollingFileStream')
, mkdirp = __webpack_require__(223)
, path = __webpack_require__(5)
, util = __webpack_require__(8)
, stream = __webpack_require__(328);

module.exports = BaseRollingFileStream;

function BaseRollingFileStream(filename, options) {
  debug("In BaseRollingFileStream");
  this.filename = filename;
  this.options = options || {};
  this.options.encoding = this.options.encoding || 'utf8';
  this.options.mode = this.options.mode || parseInt('0644', 8);
  this.options.flags = this.options.flags || 'a';

  this.currentSize = 0;

  function currentFileSize(file) {
    var fileSize = 0;
    try {
      fileSize = fs.statSync(file).size;
    } catch (e) {
      // file does not exist
    }
    return fileSize;
  }

  function throwErrorIfArgumentsAreNotValid() {
    if (!filename) {
      throw new Error("You must specify a filename");
    }
  }

  throwErrorIfArgumentsAreNotValid();
  debug("Calling BaseRollingFileStream.super");
  BaseRollingFileStream.super_.call(this);
  this.openTheStream();
  this.currentSize = currentFileSize(this.filename);
}
util.inherits(BaseRollingFileStream, stream.Writable);

BaseRollingFileStream.prototype._write = function(chunk, encoding, callback) {
  var that = this;
  function writeTheChunk() {
    debug("writing the chunk to the underlying stream");
    that.currentSize += chunk.length;
    try {
      if (that.theStream.writable) {
        that.theStream.write(chunk, encoding, callback);
      }
    }
    catch (err){
      debug(err);
      callback();
    }
  }

  debug("in _write");

  if (this.shouldRoll()) {
    this.currentSize = 0;
    this.roll(this.filename, writeTheChunk);
  } else {
    writeTheChunk();
  }
};

BaseRollingFileStream.prototype.openTheStream = function(cb) {
  debug("opening the underlying stream");
  var that = this;
  mkdirp.sync(path.dirname(this.filename));
  this.theStream = fs.createWriteStream(this.filename, this.options);
  this.theStream.on('error', function(err) {
    that.emit('error', err);
  });
  if (cb) {
    this.theStream.on("open", cb);
  }
};

BaseRollingFileStream.prototype.closeTheStream = function(cb) {
  debug("closing the underlying stream");
  this.theStream.end(cb);
};

BaseRollingFileStream.prototype.compress = function(filename, cb) {
    debug('Compressing ', filename, ' -> ', filename, '.gz');
    var gzip = zlib.createGzip();
    var inp = fs.createReadStream(filename);
    var out = fs.createWriteStream(filename+".gz");
    inp.pipe(gzip).pipe(out);

    out.on('finish', function(err) {
      debug('Removing original ', filename);
      fs.unlink(filename, cb);
    });
};

BaseRollingFileStream.prototype.shouldRoll = function() {
  return false; // default behaviour is never to roll
};

BaseRollingFileStream.prototype.roll = function(filename, callback) {
  callback(); // default behaviour is not to do anything
};

BaseRollingFileStream.prototype.end = function(chunk, encoding, callback) {
  var self = this;
  this.theStream.end(chunk, encoding, function(err) {
    stream.Writable.prototype.end.call(self, function() {
      if (callback) {
        callback(err);
      }
    });
  });
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.RollingFileStream = __webpack_require__(325);
exports.DateRollingFileStream = __webpack_require__(324);


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(326);
/*</replacement>*/


/*<replacement>*/
var Buffer = __webpack_require__(56).Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = __webpack_require__(29).EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = __webpack_require__(31);

/*<replacement>*/
var util = __webpack_require__(32);
util.inherits = __webpack_require__(23);
/*</replacement>*/

var StringDecoder;


/*<replacement>*/
var debug = __webpack_require__(8);
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = __webpack_require__(28);

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = __webpack_require__(155).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = __webpack_require__(28);

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (util.isNullOrUndefined(chunk)) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = __webpack_require__(155).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || util.isNull(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = __webpack_require__(28);

/*<replacement>*/
var util = __webpack_require__(32);
util.inherits = __webpack_require__(23);
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (!util.isNullOrUndefined(data))
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = __webpack_require__(56).Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = __webpack_require__(32);
util.inherits = __webpack_require__(23);
/*</replacement>*/

var Stream = __webpack_require__(31);

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  var Duplex = __webpack_require__(28);

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = __webpack_require__(28);

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = __webpack_require__(56).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 156 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 158 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

exports.__esModule = true;
exports.prefix = exports.router = undefined;

var _express = __webpack_require__(83);

var _express2 = _interopRequireDefault(_express);

var _common = __webpack_require__(82);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* 录入相关API
*/

var router = _express2.default.Router();

router.get('/', function (req, res) {
	res.render('/view/center');
});

var prefix = '/doc/edit';

exports.router = router;
exports.prefix = prefix;

/***/ }),
/* 160 */,
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/



/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = __webpack_require__(7);
var path = __webpack_require__(5);
var utils = __webpack_require__(178);

var scopeOptionWarned = false;
var _VERSION_STRING = __webpack_require__(179).version;
var _DEFAULT_DELIMITER = '%';
var _DEFAULT_LOCALS_NAME = 'locals';
var _NAME = 'ejs';
var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
var _OPTS = ['delimiter', 'scope', 'context', 'debug', 'compileDebug',
  'client', '_with', 'rmWhitespace', 'strict', 'filename'];
// We don't allow 'cache' option to be passed in the data obj
// for the normal `render` call, but this is where Express puts it
// so we make an exception for `renderFile`
var _OPTS_EXPRESS = _OPTS.concat('cache');
var _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Custom file loader. Useful for template preprocessing or restricting access
 * to a certain part of the filesystem.
 *
 * @type {fileLoader}
 */

exports.fileLoader = fs.readFileSync;

/**
 * Name of the object containing the locals.
 *
 * This variable is overridden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name     specified path
 * @param {String}  filename parent file path
 * @param {Boolean} isDir    parent file path whether is directory
 * @return {String}
 */
exports.resolveInclude = function(name, filename, isDir) {
  var dirname = path.dirname;
  var extname = path.extname;
  var resolve = path.resolve;
  var includePath = resolve(isDir ? filename : dirname(filename), name);
  var ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getIncludePath(path, options){
  var includePath;
  if (path.charAt(0) == '/') {
    includePath = exports.resolveInclude(path.replace(/^\/*/,''), options.root || '/', true);
  }
  else {
    if (!options.filename) {
      throw new Error('`include` use relative path requires the \'filename\' option.');
    }
    includePath = exports.resolveInclude(path, options.filename);
  }
  return includePath;
}

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var func;
  var filename = options.filename;
  var hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!filename) {
      throw new Error('cache option requires a filename');
    }
    func = exports.cache.get(filename);
    if (func) {
      return func;
    }
    if (!hasTemplate) {
      template = fileLoader(filename).toString().replace(_BOM, '');
    }
  }
  else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!filename) {
      throw new Error('Internal EJS error: no file name or template '
                    + 'provided');
    }
    template = fileLoader(filename).toString().replace(_BOM, '');
  }
  func = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(filename, func);
  }
  return func;
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @memberof module:ejs-internal
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache(options, data, cb) {
  var result;
  try {
    result = handleCache(options)(data);
  }
  catch (err) {
    return cb(err);
  }
  return cb(null, result);
}

/**
 * fileLoader is independent
 *
 * @param {String} filePath ejs file path.
 * @return {String} The contents of the specified file.
 * @static
 */

function fileLoader(filePath){
  return exports.fileLoader(filePath);
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  opts.filename = getIncludePath(path, opts);
  return handleCache(opts);
}

/**
 * Get the JavaScript source of an included file.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {Object}
 * @static
 */

function includeSource(path, options) {
  var opts = utils.shallowCopy({}, options);
  var includePath;
  var template;
  includePath = getIncludePath(path, opts);
  template = fileLoader(includePath).toString().replace(_BOM, '');
  opts.filename = includePath;
  var templ = new Template(template, opts);
  templ.generateSource();
  return {
    source: templ.source,
    filename: includePath,
    template: template
  };
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements RethrowCallback
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} filename file name of the EJS file
 * @param {String} lineno   line number of the error
 * @static
 */

function rethrow(err, str, flnm, lineno, esc){
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm); // eslint-disable-line
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

function stripSemi(str){
  return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} opts     compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned){
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {String}
 * @public
 */

exports.render = function (template, d, o) {
  var data = d || {};
  var opts = o || {};

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    utils.shallowCopyFromList(opts, data, _OPTS);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var filename = arguments[0];
  var cb = arguments[arguments.length - 1];
  var opts = {filename: filename};
  var data;

  if (arguments.length > 2) {
    data = arguments[1];

    // No options object -- if there are optiony names
    // in the data, copy them to options
    if (arguments.length === 3) {
      // Express 4
      if (data.settings && data.settings['view options']) {
        utils.shallowCopyFromList(opts, data.settings['view options'], _OPTS_EXPRESS);
      }
      // Express 3 and lower
      else {
        utils.shallowCopyFromList(opts, data, _OPTS_EXPRESS);
      }
    }
    else {
      // Use shallowCopy so we don't pollute passed in opts obj with new vals
      utils.shallowCopy(opts, arguments[2]);
    }

    opts.filename = filename;
  }
  else {
    data = {};
  }

  return tryHandleCache(opts, data, cb);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  this.dependencies = [];
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.root = opts.root;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;

  if (options.strict) {
    options._with = false;
  }
  else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING;
    var delim = utils.escapeRegExpChars(this.opts.delimiter);
    str = str.replace(/%/g, delim);
    return new RegExp(str);
  },

  compile: function () {
    var src;
    var fn;
    var opts = this.opts;
    var prepended = '';
    var appended = '';
    var escapeFn = opts.escapeFunction;

    if (!this.source) {
      this.generateSource();
      prepended += '  var __output = [], __append = __output.push.bind(__output);' + '\n';
      if (opts._with !== false) {
        prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
        appended += '  }' + '\n';
      }
      appended += '  return __output.join("");' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n'
          + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
          + '  , __filename = ' + (opts.filename ?
                JSON.stringify(opts.filename) : 'undefined') + ';' + '\n'
          + 'try {' + '\n'
          + this.source
          + '} catch (e) {' + '\n'
          + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
          + '}' + '\n';
    }
    else {
      src = this.source;
    }

    if (opts.debug) {
      console.log(src);
    }

    if (opts.client) {
      src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }

    try {
      fn = new Function(opts.localsName + ', escapeFn, include, rethrow', src);
    }
    catch(e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs\n\n';
        e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
        e.message += 'https://github.com/RyanZim/EJS-Lint';
      }
      throw e;
    }

    if (opts.client) {
      fn.dependencies = this.dependencies;
      return fn;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = function (data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    };
    returnedFn.dependencies = this.dependencies;
    return returnedFn;
  },

  generateSource: function () {
    var opts = this.opts;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r`.
      this.templateText =
        this.templateText.replace(/\r/g, '').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText =
      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    var self = this;
    var matches = this.parseTemplateText();
    var d = this.opts.delimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var opening;
        var closing;
        var include;
        var includeOpts;
        var includeObj;
        var includeSrc;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with '<' + delimiter as key
        // Then this can simply check against the map
        if ( line.indexOf('<' + d) === 0        // If it is a tag
          && line.indexOf('<' + d + d) !== 0) { // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + '>' || closing == '-' + d + '>' || closing == '_' + d + '>')) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        // HACK: backward-compat `include` preprocessor directives
        if ((include = line.match(/^\s*include\s+(\S+)/))) {
          opening = matches[index - 1];
          // Must be in EVAL or RAW mode
          if (opening && (opening == '<' + d || opening == '<' + d + '-' || opening == '<' + d + '_')) {
            includeOpts = utils.shallowCopy({}, self.opts);
            includeObj = includeSource(include[1], includeOpts);
            if (self.opts.compileDebug) {
              includeSrc =
                  '    ; (function(){' + '\n'
                  + '      var __line = 1' + '\n'
                  + '      , __lines = ' + JSON.stringify(includeObj.template) + '\n'
                  + '      , __filename = ' + JSON.stringify(includeObj.filename) + ';' + '\n'
                  + '      try {' + '\n'
                  + includeObj.source
                  + '      } catch (e) {' + '\n'
                  + '        rethrow(e, __lines, __filename, __line);' + '\n'
                  + '      }' + '\n'
                  + '    ; }).call(this)' + '\n';
            }else{
              includeSrc = '    ; (function(){' + '\n' + includeObj.source +
                  '    ; }).call(this)' + '\n';
            }
            self.source += includeSrc;
            self.dependencies.push(exports.resolveInclude(include[1],
                includeOpts.filename));
            return;
          }
        }
        self.scanLine(line);
      });
    }

  },

  parseTemplateText: function () {
    var str = this.templateText;
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  },

  scanLine: function (line) {
    var self = this;
    var d = this.opts.delimiter;
    var newLineCount = 0;

    function _addOutput() {
      if (self.truncate) {
        // Only replace single leading linebreak in the line after
        // -%> tag -- this is the single, trailing linebreak
        // after the tag that the truncation mode replaces
        // Handle Win / Unix / old Mac linebreaks -- do the \r\n
        // combo first in the regex-or
        line = line.replace(/^(?:\r\n|\r|\n)/, '');
        self.truncate = false;
      }
      else if (self.opts.rmWhitespace) {
        // rmWhitespace has already removed trailing spaces, just need
        // to remove linebreaks
        line = line.replace(/^\n/, '');
      }
      if (!line) {
        return;
      }

      // Preserve literal slashes
      line = line.replace(/\\/g, '\\\\');

      // Convert linebreaks
      line = line.replace(/\n/g, '\\n');
      line = line.replace(/\r/g, '\\r');

      // Escape double-quotes
      // - this will be the delimiter during execution
      line = line.replace(/"/g, '\\"');
      self.source += '    ; __append("' + line + '")' + '\n';
    }

    newLineCount = (line.split('\n').length - 1);

    switch (line) {
    case '<' + d:
    case '<' + d + '_':
      this.mode = Template.modes.EVAL;
      break;
    case '<' + d + '=':
      this.mode = Template.modes.ESCAPED;
      break;
    case '<' + d + '-':
      this.mode = Template.modes.RAW;
      break;
    case '<' + d + '#':
      this.mode = Template.modes.COMMENT;
      break;
    case '<' + d + d:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace('<' + d + d, '<' + d) + '")' + '\n';
      break;
    case d + d + '>':
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(d + d + '>', d + '>') + '")' + '\n';
      break;
    case d + '>':
    case '-' + d + '>':
    case '_' + d + '>':
      if (this.mode == Template.modes.LITERAL) {
        _addOutput();
      }

      this.mode = null;
      this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
      break;
    default:
        // In script mode, depends on type of tag
      if (this.mode) {
          // If '//' is found without a line break, add a line break.
        switch (this.mode) {
        case Template.modes.EVAL:
        case Template.modes.ESCAPED:
        case Template.modes.RAW:
          if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
            line += '\n';
          }
        }
        switch (this.mode) {
            // Just executing code
        case Template.modes.EVAL:
          this.source += '    ; ' + line + '\n';
          break;
            // Exec, esc, and output
        case Template.modes.ESCAPED:
          this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
          break;
            // Exec and output
        case Template.modes.RAW:
          this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
          break;
        case Template.modes.COMMENT:
              // Do nothing
          break;
            // Literal <%% mode, append as raw output
        case Template.modes.LITERAL:
          _addOutput();
          break;
        }
      }
        // In string mode, just add the output
      else {
        _addOutput();
      }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Escape characters reserved in XML.
 *
 * This is simply an export of {@link module:utils.escapeXML}.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @public
 * @func
 * */
exports.escapeXML = utils.escapeXML;

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

// Add require support
/* istanbul ignore else */
if ((void 0)) {
  (void 0)['.ejs'] = function (module, flnm) {
    var filename = flnm || /* istanbul ignore next */ module.filename;
    var options = {
      filename: filename,
      client: true
    };
    var template = fileLoader(filename).toString();
    var fn = exports.compile(template, options);
    module._compile('module.exports = ' + fn.toString() + ';', filename);
  };
}

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/**
 * Name for detection of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.name = _NAME;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}


/***/ }),
/* 162 */,
/* 163 */,
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var Negotiator = __webpack_require__(224)
var mime = __webpack_require__(116)

/**
 * Module exports.
 * @public
 */

module.exports = Accepts

/**
 * Create a new Accepts object for the given req.
 *
 * @param {object} req
 * @public
 */

function Accepts(req) {
  if (!(this instanceof Accepts))
    return new Accepts(req)

  this.headers = req.headers
  this.negotiator = new Negotiator(req)
}

/**
 * Check if the given `type(s)` is acceptable, returning
 * the best match when true, otherwise `undefined`, in which
 * case you should respond with 406 "Not Acceptable".
 *
 * The `type` value may be a single mime type string
 * such as "application/json", the extension name
 * such as "json" or an array `["json", "html", "text/plain"]`. When a list
 * or array is given the _best_ match, if any is returned.
 *
 * Examples:
 *
 *     // Accept: text/html
 *     this.types('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     this.types('html');
 *     // => "html"
 *     this.types('text/html');
 *     // => "text/html"
 *     this.types('json', 'text');
 *     // => "json"
 *     this.types('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     this.types('image/png');
 *     this.types('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     this.types(['html', 'json']);
 *     this.types('html', 'json');
 *     // => "json"
 *
 * @param {String|Array} types...
 * @return {String|Array|Boolean}
 * @public
 */

Accepts.prototype.type =
Accepts.prototype.types = function (types_) {
  var types = types_

  // support flattened arguments
  if (types && !Array.isArray(types)) {
    types = new Array(arguments.length)
    for (var i = 0; i < types.length; i++) {
      types[i] = arguments[i]
    }
  }

  // no types, return all requested types
  if (!types || types.length === 0) {
    return this.negotiator.mediaTypes()
  }

  if (!this.headers.accept) return types[0];
  var mimes = types.map(extToMime);
  var accepts = this.negotiator.mediaTypes(mimes.filter(validMime));
  var first = accepts[0];
  if (!first) return false;
  return types[mimes.indexOf(first)];
}

/**
 * Return accepted encodings or best fit based on `encodings`.
 *
 * Given `Accept-Encoding: gzip, deflate`
 * an array sorted by quality is returned:
 *
 *     ['gzip', 'deflate']
 *
 * @param {String|Array} encodings...
 * @return {String|Array}
 * @public
 */

Accepts.prototype.encoding =
Accepts.prototype.encodings = function (encodings_) {
  var encodings = encodings_

  // support flattened arguments
  if (encodings && !Array.isArray(encodings)) {
    encodings = new Array(arguments.length)
    for (var i = 0; i < encodings.length; i++) {
      encodings[i] = arguments[i]
    }
  }

  // no encodings, return all requested encodings
  if (!encodings || encodings.length === 0) {
    return this.negotiator.encodings()
  }

  return this.negotiator.encodings(encodings)[0] || false
}

/**
 * Return accepted charsets or best fit based on `charsets`.
 *
 * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
 * an array sorted by quality is returned:
 *
 *     ['utf-8', 'utf-7', 'iso-8859-1']
 *
 * @param {String|Array} charsets...
 * @return {String|Array}
 * @public
 */

Accepts.prototype.charset =
Accepts.prototype.charsets = function (charsets_) {
  var charsets = charsets_

  // support flattened arguments
  if (charsets && !Array.isArray(charsets)) {
    charsets = new Array(arguments.length)
    for (var i = 0; i < charsets.length; i++) {
      charsets[i] = arguments[i]
    }
  }

  // no charsets, return all requested charsets
  if (!charsets || charsets.length === 0) {
    return this.negotiator.charsets()
  }

  return this.negotiator.charsets(charsets)[0] || false
}

/**
 * Return accepted languages or best fit based on `langs`.
 *
 * Given `Accept-Language: en;q=0.8, es, pt`
 * an array sorted by quality is returned:
 *
 *     ['es', 'pt', 'en']
 *
 * @param {String|Array} langs...
 * @return {Array|String}
 * @public
 */

Accepts.prototype.lang =
Accepts.prototype.langs =
Accepts.prototype.language =
Accepts.prototype.languages = function (languages_) {
  var languages = languages_

  // support flattened arguments
  if (languages && !Array.isArray(languages)) {
    languages = new Array(arguments.length)
    for (var i = 0; i < languages.length; i++) {
      languages[i] = arguments[i]
    }
  }

  // no languages, return all requested languages
  if (!languages || languages.length === 0) {
    return this.negotiator.languages()
  }

  return this.negotiator.languages(languages)[0] || false
}

/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */

function extToMime(type) {
  return type.indexOf('/') === -1
    ? mime.lookup(type)
    : type
}

/**
 * Check if mime is valid.
 *
 * @param {String} type
 * @return {String}
 * @private
 */

function validMime(type) {
  return typeof type === 'string';
}


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var _edit = __webpack_require__(159);

var _ejs = __webpack_require__(161);

var _ejs2 = _interopRequireDefault(_ejs);

var _express = __webpack_require__(83);

var _express2 = _interopRequireDefault(_express);

var _common = __webpack_require__(82);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.engine('html', _ejs2.default.__express);
app.set('view engine', 'html');

// 静态资源
app.use('/static', _express2.default.static(__dirname + '/build'));

app.use(_edit.prefix, _edit.router);

// 启动
app.listen(3000, function () {
	_common.LOG.info('Server on port 3000');
});
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 166 */,
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
var paramRegExp = /; *([!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+) */g
var textRegExp = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/
var tokenRegExp = /^[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+$/

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
var qescRegExp = /\\([\u000b\u0020-\u00ff])/g

/**
 * RegExp to match chars that must be quoted-pair in RFC 7230 sec 3.2.6
 */
var quoteRegExp = /([\\"])/g

/**
 * RegExp to match type in RFC 6838
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
var typeRegExp = /^[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+\/[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+$/

/**
 * Module exports.
 * @public
 */

exports.format = format
exports.parse = parse

/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @public
 */

function format(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required')
  }

  var parameters = obj.parameters
  var type = obj.type

  if (!type || !typeRegExp.test(type)) {
    throw new TypeError('invalid type')
  }

  var string = type

  // append parameters
  if (parameters && typeof parameters === 'object') {
    var param
    var params = Object.keys(parameters).sort()

    for (var i = 0; i < params.length; i++) {
      param = params[i]

      if (!tokenRegExp.test(param)) {
        throw new TypeError('invalid parameter name')
      }

      string += '; ' + param + '=' + qstring(parameters[param])
    }
  }

  return string
}

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */

function parse(string) {
  if (!string) {
    throw new TypeError('argument string is required')
  }

  if (typeof string === 'object') {
    // support req/res-like objects as argument
    string = getcontenttype(string)

    if (typeof string !== 'string') {
      throw new TypeError('content-type header is missing from object');
    }
  }

  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string')
  }

  var index = string.indexOf(';')
  var type = index !== -1
    ? string.substr(0, index).trim()
    : string.trim()

  if (!typeRegExp.test(type)) {
    throw new TypeError('invalid media type')
  }

  var key
  var match
  var obj = new ContentType(type.toLowerCase())
  var value

  paramRegExp.lastIndex = index

  while (match = paramRegExp.exec(string)) {
    if (match.index !== index) {
      throw new TypeError('invalid parameter format')
    }

    index += match[0].length
    key = match[1].toLowerCase()
    value = match[2]

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value
        .substr(1, value.length - 2)
        .replace(qescRegExp, '$1')
    }

    obj.parameters[key] = value
  }

  if (index !== -1 && index !== string.length) {
    throw new TypeError('invalid parameter format')
  }

  return obj
}

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @private
 */

function getcontenttype(obj) {
  if (typeof obj.getHeader === 'function') {
    // res-like
    return obj.getHeader('content-type')
  }

  if (typeof obj.headers === 'object') {
    // req-like
    return obj.headers && obj.headers['content-type']
  }
}

/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @private
 */

function qstring(val) {
  var str = String(val)

  // no need to quote tokens
  if (tokenRegExp.test(str)) {
    return str
  }

  if (str.length > 0 && !textRegExp.test(str)) {
    throw new TypeError('invalid parameter value')
  }

  return '"' + str.replace(quoteRegExp, '\\$1') + '"'
}

/**
 * Class to represent a content type.
 * @private
 */
function ContentType(type) {
  this.parameters = Object.create(null)
  this.type = type
}


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var crypto = __webpack_require__(156);

/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String} secret
 * @return {String}
 * @api private
 */

exports.sign = function(val, secret){
  if ('string' != typeof val) throw new TypeError("Cookie value must be provided as a string.");
  if ('string' != typeof secret) throw new TypeError("Secret string must be provided.");
  return val + '.' + crypto
    .createHmac('sha256', secret)
    .update(val)
    .digest('base64')
    .replace(/\=+$/, '');
};

/**
 * Unsign and decode the given `val` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} val
 * @param {String} secret
 * @return {String|Boolean}
 * @api private
 */

exports.unsign = function(val, secret){
  if ('string' != typeof val) throw new TypeError("Signed cookie string must be provided.");
  if ('string' != typeof secret) throw new TypeError("Secret string must be provided.");
  var str = val.slice(0, val.lastIndexOf('.'))
    , mac = exports.sign(str, secret);
  
  return sha1(mac) == sha1(val) ? str : false;
};

/**
 * Private
 */

function sha1(str){
  return crypto.createHash('sha1').update(str).digest('hex');
}


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim()
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
exports.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
exports.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
exports.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";

function padWithZeros(vNumber, width) {
  var numAsString = vNumber + "";
  while (numAsString.length < width) {
    numAsString = "0" + numAsString;
  }
  return numAsString;
}
  
function addZero(vNumber) {
  return padWithZeros(vNumber, 2);
}

/**
 * Formats the TimeOffest
 * Thanks to http://www.svendtofte.com/code/date_format/
 * @private
 */
function offset(date) {
  // Difference to Greenwich time (GMT) in hours
  var os = Math.abs(date.getTimezoneOffset());
  var h = String(Math.floor(os/60));
  var m = String(os%60);
  if (h.length == 1) {
    h = "0" + h;
  }
  if (m.length == 1) {
    m = "0" + m;
  }
  return date.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
}

exports.asString = function(/*format,*/ date) {
  var format = exports.ISO8601_FORMAT;
  if (typeof(date) === "string") {
    format = arguments[0];
    date = arguments[1];
  }

  var vDay = addZero(date.getDate());
  var vMonth = addZero(date.getMonth()+1);
  var vYearLong = addZero(date.getFullYear());
  var vYearShort = addZero(date.getFullYear().toString().substring(2,4));
  var vYear = (format.indexOf("yyyy") > -1 ? vYearLong : vYearShort);
  var vHour  = addZero(date.getHours());
  var vMinute = addZero(date.getMinutes());
  var vSecond = addZero(date.getSeconds());
  var vMillisecond = padWithZeros(date.getMilliseconds(), 3);
  var vTimeZone = offset(date);
  var formatted = format
    .replace(/dd/g, vDay)
    .replace(/MM/g, vMonth)
    .replace(/y{1,4}/g, vYear)
    .replace(/hh/g, vHour)
    .replace(/mm/g, vMinute)
    .replace(/ss/g, vSecond)
    .replace(/SSS/g, vMillisecond)
    .replace(/O/g, vTimeZone);
  return formatted;

};


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(85);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(42);
var util = __webpack_require__(8);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(85);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(7);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(30);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * depd
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 */

module.exports = bufferConcat

/**
 * Concatenate an array of Buffers.
 */

function bufferConcat(bufs) {
  var length = 0

  for (var i = 0, len = bufs.length; i < len; i++) {
    length += bufs[i].length
  }

  var buf = new Buffer(length)
  var pos = 0

  for (var i = 0, len = bufs.length; i < len; i++) {
    bufs[i].copy(buf, pos)
    pos += bufs[i].length
  }

  return buf
}


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * depd
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 */

module.exports = callSiteToString

/**
 * Format a CallSite file location to a string.
 */

function callSiteFileLocation(callSite) {
  var fileName
  var fileLocation = ''

  if (callSite.isNative()) {
    fileLocation = 'native'
  } else if (callSite.isEval()) {
    fileName = callSite.getScriptNameOrSourceURL()
    if (!fileName) {
      fileLocation = callSite.getEvalOrigin()
    }
  } else {
    fileName = callSite.getFileName()
  }

  if (fileName) {
    fileLocation += fileName

    var lineNumber = callSite.getLineNumber()
    if (lineNumber != null) {
      fileLocation += ':' + lineNumber

      var columnNumber = callSite.getColumnNumber()
      if (columnNumber) {
        fileLocation += ':' + columnNumber
      }
    }
  }

  return fileLocation || 'unknown source'
}

/**
 * Format a CallSite to a string.
 */

function callSiteToString(callSite) {
  var addSuffix = true
  var fileLocation = callSiteFileLocation(callSite)
  var functionName = callSite.getFunctionName()
  var isConstructor = callSite.isConstructor()
  var isMethodCall = !(callSite.isToplevel() || isConstructor)
  var line = ''

  if (isMethodCall) {
    var methodName = callSite.getMethodName()
    var typeName = getConstructorName(callSite)

    if (functionName) {
      if (typeName && functionName.indexOf(typeName) !== 0) {
        line += typeName + '.'
      }

      line += functionName

      if (methodName && functionName.lastIndexOf('.' + methodName) !== functionName.length - methodName.length - 1) {
        line += ' [as ' + methodName + ']'
      }
    } else {
      line += typeName + '.' + (methodName || '<anonymous>')
    }
  } else if (isConstructor) {
    line += 'new ' + (functionName || '<anonymous>')
  } else if (functionName) {
    line += functionName
  } else {
    addSuffix = false
    line += fileLocation
  }

  if (addSuffix) {
    line += ' (' + fileLocation + ')'
  }

  return line
}

/**
 * Get constructor name of reviver.
 */

function getConstructorName(obj) {
  var receiver = obj.receiver
  return (receiver.constructor && receiver.constructor.name) || null
}


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * depd
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = eventListenerCount

/**
 * Get the count of listeners on an event emitter of a specific type.
 */

function eventListenerCount(emitter, type) {
  return emitter.listeners(type).length
}


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * destroy
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var ReadStream = __webpack_require__(7).ReadStream
var Stream = __webpack_require__(31)

/**
 * Module exports.
 * @public
 */

module.exports = destroy

/**
 * Destroy a stream.
 *
 * @param {object} stream
 * @public
 */

function destroy(stream) {
  if (stream instanceof ReadStream) {
    return destroyReadStream(stream)
  }

  if (!(stream instanceof Stream)) {
    return stream
  }

  if (typeof stream.destroy === 'function') {
    stream.destroy()
  }

  return stream
}

/**
 * Destroy a ReadStream.
 *
 * @param {object} stream
 * @private
 */

function destroyReadStream(stream) {
  stream.destroy()

  if (typeof stream.close === 'function') {
    // node.js core bug work-around
    stream.on('open', onOpenClose)
  }

  return stream
}

/**
 * On open handler to close stream.
 * @private
 */

function onOpenClose() {
  if (typeof this.fd === 'number') {
    // actually close down the fd
    this.close()
  }
}


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ee-first
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = first

/**
 * Get the first event in a set of event emitters and event pairs.
 *
 * @param {array} stuff
 * @param {function} done
 * @public
 */

function first(stuff, done) {
  if (!Array.isArray(stuff))
    throw new TypeError('arg must be an array of [ee, events...] arrays')

  var cleanups = []

  for (var i = 0; i < stuff.length; i++) {
    var arr = stuff[i]

    if (!Array.isArray(arr) || arr.length < 2)
      throw new TypeError('each array member must be [ee, events...]')

    var ee = arr[0]

    for (var j = 1; j < arr.length; j++) {
      var event = arr[j]
      var fn = listener(event, callback)

      // listen to the event
      ee.on(event, fn)
      // push this listener to the list of cleanups
      cleanups.push({
        ee: ee,
        event: event,
        fn: fn,
      })
    }
  }

  function callback() {
    cleanup()
    done.apply(null, arguments)
  }

  function cleanup() {
    var x
    for (var i = 0; i < cleanups.length; i++) {
      x = cleanups[i]
      x.ee.removeListener(x.event, x.fn)
    }
  }

  function thunk(fn) {
    done = fn
  }

  thunk.cancel = cleanup

  return thunk
}

/**
 * Create the event listener.
 * @private
 */

function listener(event, done) {
  return function onevent(arg1) {
    var args = new Array(arguments.length)
    var ee = this
    var err = event === 'error'
      ? arg1
      : null

    // copy args to prevent arguments escaping scope
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }

    done(err, ee, event, args)
  }
}


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */



var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, '\\$&');
};

var _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
var _MATCH_HTML = /[&<>\'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr =
  'var _ENCODE_HTML_RULES = {\n'
+ '      "&": "&amp;"\n'
+ '    , "<": "&lt;"\n'
+ '    , ">": "&gt;"\n'
+ '    , \'"\': "&#34;"\n'
+ '    , "\'": "&#39;"\n'
+ '    }\n'
+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
+ 'function encode_char(c) {\n'
+ '  return _ENCODE_HTML_RULES[c] || c;\n'
+ '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
        .replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Naive copy of a list of key names, from one object to another.
 * Only copies property if it is actually defined
 * Does not recurse into non-scalar properties
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @param  {Array} list List of properties to copy
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopyFromList = function (to, from, list) {
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (typeof from[p] != 'undefined') {
      to[p] = from[p];
    }
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements Cache
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};


/***/ }),
/* 179 */
/***/ (function(module, exports) {

module.exports = {
	"name": "ejs",
	"description": "Embedded JavaScript templates",
	"keywords": [
		"template",
		"engine",
		"ejs"
	],
	"version": "2.5.6",
	"author": "Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",
	"contributors": [
		"Timothy Gu <timothygu99@gmail.com> (https://timothygu.github.io)"
	],
	"license": "Apache-2.0",
	"main": "./lib/ejs.js",
	"repository": {
		"type": "git",
		"url": "git://github.com/mde/ejs.git"
	},
	"bugs": "https://github.com/mde/ejs/issues",
	"homepage": "https://github.com/mde/ejs",
	"dependencies": {},
	"devDependencies": {
		"browserify": "^13.0.1",
		"eslint": "^3.0.0",
		"git-directory-deploy": "^1.5.1",
		"istanbul": "~0.4.3",
		"jake": "^8.0.0",
		"jsdoc": "^3.4.0",
		"lru-cache": "^4.0.1",
		"mocha": "^3.0.2",
		"uglify-js": "^2.6.2"
	},
	"engines": {
		"node": ">=0.10.0"
	},
	"scripts": {
		"test": "mocha",
		"lint": "eslint \"**/*.js\" Jakefile",
		"coverage": "istanbul cover node_modules/mocha/bin/_mocha",
		"doc": "jake doc",
		"devdoc": "jake doc[dev]"
	}
};

/***/ }),
/* 180 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 180;

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var finalhandler = __webpack_require__(203);
var Router = __webpack_require__(89);
var methods = __webpack_require__(59);
var middleware = __webpack_require__(183);
var query = __webpack_require__(88);
var debug = __webpack_require__(33)('express:application');
var View = __webpack_require__(186);
var http = __webpack_require__(57);
var compileETag = __webpack_require__(16).compileETag;
var compileQueryParser = __webpack_require__(16).compileQueryParser;
var compileTrust = __webpack_require__(16).compileTrust;
var deprecate = __webpack_require__(18)('express');
var flatten = __webpack_require__(43);
var merge = __webpack_require__(80);
var resolve = __webpack_require__(5).resolve;
var setPrototypeOf = __webpack_require__(54)
var slice = Array.prototype.slice;

/**
 * Application prototype.
 */

var app = exports = module.exports = {};

/**
 * Variable for trust proxy inheritance back-compat
 * @private
 */

var trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';

/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 *   - setup route reflection methods
 *
 * @private
 */

app.init = function init() {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  this.defaultConfiguration();
};

/**
 * Initialize application configuration.
 * @private
 */

app.defaultConfiguration = function defaultConfiguration() {
  var env = process.env.NODE_ENV || 'development';

  // default settings
  this.enable('x-powered-by');
  this.set('etag', 'weak');
  this.set('env', env);
  this.set('query parser', 'extended');
  this.set('subdomain offset', 2);
  this.set('trust proxy', false);

  // trust proxy inherit back-compat
  Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
    configurable: true,
    value: true
  });

  debug('booting in %s mode', env);

  this.on('mount', function onmount(parent) {
    // inherit trust proxy
    if (this.settings[trustProxyDefaultSymbol] === true
      && typeof parent.settings['trust proxy fn'] === 'function') {
      delete this.settings['trust proxy'];
      delete this.settings['trust proxy fn'];
    }

    // inherit protos
    setPrototypeOf(this.request, parent.request)
    setPrototypeOf(this.response, parent.response)
    setPrototypeOf(this.engines, parent.engines)
    setPrototypeOf(this.settings, parent.settings)
  });

  // setup locals
  this.locals = Object.create(null);

  // top-most app is mounted at /
  this.mountpath = '/';

  // default locals
  this.locals.settings = this.settings;

  // default configuration
  this.set('view', View);
  this.set('views', resolve('views'));
  this.set('jsonp callback name', 'callback');

  if (env === 'production') {
    this.enable('view cache');
  }

  Object.defineProperty(this, 'router', {
    get: function() {
      throw new Error('\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.');
    }
  });
};

/**
 * lazily adds the base router if it has not yet been added.
 *
 * We cannot add the base router in the defaultConfiguration because
 * it reads app settings which might be set after that has run.
 *
 * @private
 */
app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });

    this._router.use(query(this.get('query parser fn')));
    this._router.use(middleware.init(this));
  }
};

/**
 * Dispatch a req, res pair into the application. Starts pipeline processing.
 *
 * If no callback is provided, then default error handlers will respond
 * in the event of an error bubbling through the stack.
 *
 * @private
 */

app.handle = function handle(req, res, callback) {
  var router = this._router;

  // final handler
  var done = callback || finalhandler(req, res, {
    env: this.get('env'),
    onerror: logerror.bind(this)
  });

  // no routes
  if (!router) {
    debug('no routes defined on app');
    done();
    return;
  }

  router.handle(req, res, done);
};

/**
 * Proxy `Router#use()` to add middleware to the app router.
 * See Router#use() documentation for details.
 *
 * If the _fn_ parameter is an express app, then it will be
 * mounted at the _route_ specified.
 *
 * @public
 */

app.use = function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate app.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var fns = flatten(slice.call(arguments, offset));

  if (fns.length === 0) {
    throw new TypeError('app.use() requires middleware functions');
  }

  // setup router
  this.lazyrouter();
  var router = this._router;

  fns.forEach(function (fn) {
    // non-express app
    if (!fn || !fn.handle || !fn.set) {
      return router.use(path, fn);
    }

    debug('.use app under %s', path);
    fn.mountpath = path;
    fn.parent = this;

    // restore .app property on req and res
    router.use(path, function mounted_app(req, res, next) {
      var orig = req.app;
      fn.handle(req, res, function (err) {
        setPrototypeOf(req, orig.request)
        setPrototypeOf(res, orig.response)
        next(err);
      });
    });

    // mounted an app
    fn.emit('mount', this);
  }, this);

  return this;
};

/**
 * Proxy to the app `Router#route()`
 * Returns a new `Route` instance for the _path_.
 *
 * Routes are isolated middleware stacks for specific paths.
 * See the Route api docs for details.
 *
 * @public
 */

app.route = function route(path) {
  this.lazyrouter();
  return this._router.route(path);
};

/**
 * Register the given template engine callback `fn`
 * as `ext`.
 *
 * By default will `require()` the engine based on the
 * file extension. For example if you try to render
 * a "foo.ejs" file Express will invoke the following internally:
 *
 *     app.engine('ejs', require('ejs').__express);
 *
 * For engines that do not provide `.__express` out of the box,
 * or if you wish to "map" a different extension to the template engine
 * you may use this method. For example mapping the EJS template engine to
 * ".html" files:
 *
 *     app.engine('html', require('ejs').renderFile);
 *
 * In this case EJS provides a `.renderFile()` method with
 * the same signature that Express expects: `(path, options, callback)`,
 * though note that it aliases this method as `ejs.__express` internally
 * so if you're using ".ejs" extensions you dont need to do anything.
 *
 * Some template engines do not follow this convention, the
 * [Consolidate.js](https://github.com/tj/consolidate.js)
 * library was created to map all of node's popular template
 * engines to follow this convention, thus allowing them to
 * work seamlessly within Express.
 *
 * @param {String} ext
 * @param {Function} fn
 * @return {app} for chaining
 * @public
 */

app.engine = function engine(ext, fn) {
  if (typeof fn !== 'function') {
    throw new Error('callback function required');
  }

  // get file extension
  var extension = ext[0] !== '.'
    ? '.' + ext
    : ext;

  // store engine
  this.engines[extension] = fn;

  return this;
};

/**
 * Proxy to `Router#param()` with one added api feature. The _name_ parameter
 * can be an array of names.
 *
 * See the Router#param() docs for more details.
 *
 * @param {String|Array} name
 * @param {Function} fn
 * @return {app} for chaining
 * @public
 */

app.param = function param(name, fn) {
  this.lazyrouter();

  if (Array.isArray(name)) {
    for (var i = 0; i < name.length; i++) {
      this.param(name[i], fn);
    }

    return this;
  }

  this._router.param(name, fn);

  return this;
};

/**
 * Assign `setting` to `val`, or return `setting`'s value.
 *
 *    app.set('foo', 'bar');
 *    app.get('foo');
 *    // => "bar"
 *
 * Mounted servers inherit their parent server's settings.
 *
 * @param {String} setting
 * @param {*} [val]
 * @return {Server} for chaining
 * @public
 */

app.set = function set(setting, val) {
  if (arguments.length === 1) {
    // app.get(setting)
    return this.settings[setting];
  }

  debug('set "%s" to %o', setting, val);

  // set value
  this.settings[setting] = val;

  // trigger matched settings
  switch (setting) {
    case 'etag':
      this.set('etag fn', compileETag(val));
      break;
    case 'query parser':
      this.set('query parser fn', compileQueryParser(val));
      break;
    case 'trust proxy':
      this.set('trust proxy fn', compileTrust(val));

      // trust proxy inherit back-compat
      Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
        configurable: true,
        value: false
      });

      break;
  }

  return this;
};

/**
 * Return the app's absolute pathname
 * based on the parent(s) that have
 * mounted it.
 *
 * For example if the application was
 * mounted as "/admin", which itself
 * was mounted as "/blog" then the
 * return value would be "/blog/admin".
 *
 * @return {String}
 * @private
 */

app.path = function path() {
  return this.parent
    ? this.parent.path() + this.mountpath
    : '';
};

/**
 * Check if `setting` is enabled (truthy).
 *
 *    app.enabled('foo')
 *    // => false
 *
 *    app.enable('foo')
 *    app.enabled('foo')
 *    // => true
 *
 * @param {String} setting
 * @return {Boolean}
 * @public
 */

app.enabled = function enabled(setting) {
  return Boolean(this.set(setting));
};

/**
 * Check if `setting` is disabled.
 *
 *    app.disabled('foo')
 *    // => true
 *
 *    app.enable('foo')
 *    app.disabled('foo')
 *    // => false
 *
 * @param {String} setting
 * @return {Boolean}
 * @public
 */

app.disabled = function disabled(setting) {
  return !this.set(setting);
};

/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @public
 */

app.enable = function enable(setting) {
  return this.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @public
 */

app.disable = function disable(setting) {
  return this.set(setting, false);
};

/**
 * Delegate `.VERB(...)` calls to `router.VERB(...)`.
 */

methods.forEach(function(method){
  app[method] = function(path){
    if (method === 'get' && arguments.length === 1) {
      // app.get(setting)
      return this.set(path);
    }

    this.lazyrouter();

    var route = this._router.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});

/**
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {String} path
 * @param {Function} ...
 * @return {app} for chaining
 * @public
 */

app.all = function all(path) {
  this.lazyrouter();

  var route = this._router.route(path);
  var args = slice.call(arguments, 1);

  for (var i = 0; i < methods.length; i++) {
    route[methods[i]].apply(route, args);
  }

  return this;
};

// del -> delete alias

app.del = deprecate.function(app.delete, 'app.del: Use app.delete instead');

/**
 * Render the given view `name` name with `options`
 * and a callback accepting an error and the
 * rendered template string.
 *
 * Example:
 *
 *    app.render('email', { name: 'Tobi' }, function(err, html){
 *      // ...
 *    })
 *
 * @param {String} name
 * @param {Object|Function} options or fn
 * @param {Function} callback
 * @public
 */

app.render = function render(name, options, callback) {
  var cache = this.cache;
  var done = callback;
  var engines = this.engines;
  var opts = options;
  var renderOptions = {};
  var view;

  // support callback function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  // merge app.locals
  merge(renderOptions, this.locals);

  // merge options._locals
  if (opts._locals) {
    merge(renderOptions, opts._locals);
  }

  // merge options
  merge(renderOptions, opts);

  // set .cache unless explicitly provided
  if (renderOptions.cache == null) {
    renderOptions.cache = this.enabled('view cache');
  }

  // primed cache
  if (renderOptions.cache) {
    view = cache[name];
  }

  // view
  if (!view) {
    var View = this.get('view');

    view = new View(name, {
      defaultEngine: this.get('view engine'),
      root: this.get('views'),
      engines: engines
    });

    if (!view.path) {
      var dirs = Array.isArray(view.root) && view.root.length > 1
        ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
        : 'directory "' + view.root + '"'
      var err = new Error('Failed to lookup view "' + name + '" in views ' + dirs);
      err.view = view;
      return done(err);
    }

    // prime the cache
    if (renderOptions.cache) {
      cache[name] = view;
    }
  }

  // render
  tryRender(view, renderOptions, done);
};

/**
 * Listen for connections.
 *
 * A node `http.Server` is returned, with this
 * application (which is a `Function`) as its
 * callback. If you wish to create both an HTTP
 * and HTTPS server you may do so with the "http"
 * and "https" modules as shown here:
 *
 *    var http = require('http')
 *      , https = require('https')
 *      , express = require('express')
 *      , app = express();
 *
 *    http.createServer(app).listen(80);
 *    https.createServer({ ... }, app).listen(443);
 *
 * @return {http.Server}
 * @public
 */

app.listen = function listen() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

/**
 * Log error using console.error.
 *
 * @param {Error} err
 * @private
 */

function logerror(err) {
  /* istanbul ignore next */
  if (this.get('env') !== 'test') console.error(err.stack || err.toString());
}

/**
 * Try rendering a view.
 * @private
 */

function tryRender(view, options, callback) {
  try {
    view.render(options, callback);
  } catch (err) {
    callback(err);
  }
}


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 */

var EventEmitter = __webpack_require__(29).EventEmitter;
var mixin = __webpack_require__(218);
var proto = __webpack_require__(181);
var Route = __webpack_require__(91);
var Router = __webpack_require__(89);
var req = __webpack_require__(184);
var res = __webpack_require__(185);

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.query = __webpack_require__(88);
exports.static = __webpack_require__(322);

/**
 * Replace removed middleware with an appropriate error message.
 */

[
  'json',
  'urlencoded',
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache',
].forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  });
});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var setPrototypeOf = __webpack_require__(54)

/**
 * Initialization middleware, exposing the
 * request and response to each other, as well
 * as defaulting the X-Powered-By header field.
 *
 * @param {Function} app
 * @return {Function}
 * @api private
 */

exports.init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
    req.res = res;
    res.req = req;
    req.next = next;

    setPrototypeOf(req, app.request)
    setPrototypeOf(res, app.response)

    res.locals = res.locals || Object.create(null);

    next();
  };
};



/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var accepts = __webpack_require__(164);
var deprecate = __webpack_require__(18)('express');
var isIP = __webpack_require__(30).isIP;
var typeis = __webpack_require__(329);
var http = __webpack_require__(57);
var fresh = __webpack_require__(97);
var parseRange = __webpack_require__(123);
var parse = __webpack_require__(37);
var proxyaddr = __webpack_require__(119);

/**
 * Request prototype.
 * @public
 */

var req = Object.create(http.IncomingMessage.prototype)

/**
 * Module exports.
 * @public
 */

module.exports = req

/**
 * Return request header.
 *
 * The `Referrer` header field is special-cased,
 * both `Referrer` and `Referer` are interchangeable.
 *
 * Examples:
 *
 *     req.get('Content-Type');
 *     // => "text/plain"
 *
 *     req.get('content-type');
 *     // => "text/plain"
 *
 *     req.get('Something');
 *     // => undefined
 *
 * Aliased as `req.header()`.
 *
 * @param {String} name
 * @return {String}
 * @public
 */

req.get =
req.header = function header(name) {
  if (!name) {
    throw new TypeError('name argument is required to req.get');
  }

  if (typeof name !== 'string') {
    throw new TypeError('name must be a string to req.get');
  }

  var lc = name.toLowerCase();

  switch (lc) {
    case 'referer':
    case 'referrer':
      return this.headers.referrer
        || this.headers.referer;
    default:
      return this.headers[lc];
  }
};

/**
 * To do: update docs.
 *
 * Check if the given `type(s)` is acceptable, returning
 * the best match when true, otherwise `undefined`, in which
 * case you should respond with 406 "Not Acceptable".
 *
 * The `type` value may be a single MIME type string
 * such as "application/json", an extension name
 * such as "json", a comma-delimited list such as "json, html, text/plain",
 * an argument list such as `"json", "html", "text/plain"`,
 * or an array `["json", "html", "text/plain"]`. When a list
 * or array is given, the _best_ match, if any is returned.
 *
 * Examples:
 *
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('html');
 *     // => "html"
 *     req.accepts('text/html');
 *     // => "text/html"
 *     req.accepts('json, text');
 *     // => "json"
 *     req.accepts('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     req.accepts(['html', 'json']);
 *     req.accepts('html', 'json');
 *     req.accepts('html, json');
 *     // => "json"
 *
 * @param {String|Array} type(s)
 * @return {String|Array|Boolean}
 * @public
 */

req.accepts = function(){
  var accept = accepts(this);
  return accept.types.apply(accept, arguments);
};

/**
 * Check if the given `encoding`s are accepted.
 *
 * @param {String} ...encoding
 * @return {String|Array}
 * @public
 */

req.acceptsEncodings = function(){
  var accept = accepts(this);
  return accept.encodings.apply(accept, arguments);
};

req.acceptsEncoding = deprecate.function(req.acceptsEncodings,
  'req.acceptsEncoding: Use acceptsEncodings instead');

/**
 * Check if the given `charset`s are acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} ...charset
 * @return {String|Array}
 * @public
 */

req.acceptsCharsets = function(){
  var accept = accepts(this);
  return accept.charsets.apply(accept, arguments);
};

req.acceptsCharset = deprecate.function(req.acceptsCharsets,
  'req.acceptsCharset: Use acceptsCharsets instead');

/**
 * Check if the given `lang`s are acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} ...lang
 * @return {String|Array}
 * @public
 */

req.acceptsLanguages = function(){
  var accept = accepts(this);
  return accept.languages.apply(accept, arguments);
};

req.acceptsLanguage = deprecate.function(req.acceptsLanguages,
  'req.acceptsLanguage: Use acceptsLanguages instead');

/**
 * Parse Range header field, capping to the given `size`.
 *
 * Unspecified ranges such as "0-" require knowledge of your resource length. In
 * the case of a byte range this is of course the total number of bytes. If the
 * Range header field is not given `undefined` is returned, `-1` when unsatisfiable,
 * and `-2` when syntactically invalid.
 *
 * When ranges are returned, the array has a "type" property which is the type of
 * range that is required (most commonly, "bytes"). Each array element is an object
 * with a "start" and "end" property for the portion of the range.
 *
 * The "combine" option can be set to `true` and overlapping & adjacent ranges
 * will be combined into a single range.
 *
 * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
 * should respond with 4 users when available, not 3.
 *
 * @param {number} size
 * @param {object} [options]
 * @param {boolean} [options.combine=false]
 * @return {number|array}
 * @public
 */

req.range = function range(size, options) {
  var range = this.get('Range');
  if (!range) return;
  return parseRange(size, range, options);
};

/**
 * Return the value of param `name` when present or `defaultValue`.
 *
 *  - Checks route placeholders, ex: _/user/:id_
 *  - Checks body params, ex: id=12, {"id":12}
 *  - Checks query string params, ex: ?id=12
 *
 * To utilize request bodies, `req.body`
 * should be an object. This can be done by using
 * the `bodyParser()` middleware.
 *
 * @param {String} name
 * @param {Mixed} [defaultValue]
 * @return {String}
 * @public
 */

req.param = function param(name, defaultValue) {
  var params = this.params || {};
  var body = this.body || {};
  var query = this.query || {};

  var args = arguments.length === 1
    ? 'name'
    : 'name, default';
  deprecate('req.param(' + args + '): Use req.params, req.body, or req.query instead');

  if (null != params[name] && params.hasOwnProperty(name)) return params[name];
  if (null != body[name]) return body[name];
  if (null != query[name]) return query[name];

  return defaultValue;
};

/**
 * Check if the incoming request contains the "Content-Type"
 * header field, and it contains the give mime `type`.
 *
 * Examples:
 *
 *      // With Content-Type: text/html; charset=utf-8
 *      req.is('html');
 *      req.is('text/html');
 *      req.is('text/*');
 *      // => true
 *
 *      // When Content-Type is application/json
 *      req.is('json');
 *      req.is('application/json');
 *      req.is('application/*');
 *      // => true
 *
 *      req.is('html');
 *      // => false
 *
 * @param {String|Array} types...
 * @return {String|false|null}
 * @public
 */

req.is = function is(types) {
  var arr = types;

  // support flattened arguments
  if (!Array.isArray(types)) {
    arr = new Array(arguments.length);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arguments[i];
    }
  }

  return typeis(this, arr);
};

/**
 * Return the protocol string "http" or "https"
 * when requested with TLS. When the "trust proxy"
 * setting trusts the socket address, the
 * "X-Forwarded-Proto" header field will be trusted
 * and used if present.
 *
 * If you're running behind a reverse proxy that
 * supplies https for you this may be enabled.
 *
 * @return {String}
 * @public
 */

defineGetter(req, 'protocol', function protocol(){
  var proto = this.connection.encrypted
    ? 'https'
    : 'http';
  var trust = this.app.get('trust proxy fn');

  if (!trust(this.connection.remoteAddress, 0)) {
    return proto;
  }

  // Note: X-Forwarded-Proto is normally only ever a
  //       single value, but this is to be safe.
  proto = this.get('X-Forwarded-Proto') || proto;
  return proto.split(/\s*,\s*/)[0];
});

/**
 * Short-hand for:
 *
 *    req.protocol === 'https'
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'secure', function secure(){
  return this.protocol === 'https';
});

/**
 * Return the remote address from the trusted proxy.
 *
 * The is the remote address on the socket unless
 * "trust proxy" is set.
 *
 * @return {String}
 * @public
 */

defineGetter(req, 'ip', function ip(){
  var trust = this.app.get('trust proxy fn');
  return proxyaddr(this, trust);
});

/**
 * When "trust proxy" is set, trusted proxy addresses + client.
 *
 * For example if the value were "client, proxy1, proxy2"
 * you would receive the array `["client", "proxy1", "proxy2"]`
 * where "proxy2" is the furthest down-stream and "proxy1" and
 * "proxy2" were trusted.
 *
 * @return {Array}
 * @public
 */

defineGetter(req, 'ips', function ips() {
  var trust = this.app.get('trust proxy fn');
  var addrs = proxyaddr.all(this, trust);

  // reverse the order (to farthest -> closest)
  // and remove socket address
  addrs.reverse().pop()

  return addrs
});

/**
 * Return subdomains as an array.
 *
 * Subdomains are the dot-separated parts of the host before the main domain of
 * the app. By default, the domain of the app is assumed to be the last two
 * parts of the host. This can be changed by setting "subdomain offset".
 *
 * For example, if the domain is "tobi.ferrets.example.com":
 * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
 * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
 *
 * @return {Array}
 * @public
 */

defineGetter(req, 'subdomains', function subdomains() {
  var hostname = this.hostname;

  if (!hostname) return [];

  var offset = this.app.get('subdomain offset');
  var subdomains = !isIP(hostname)
    ? hostname.split('.').reverse()
    : [hostname];

  return subdomains.slice(offset);
});

/**
 * Short-hand for `url.parse(req.url).pathname`.
 *
 * @return {String}
 * @public
 */

defineGetter(req, 'path', function path() {
  return parse(this).pathname;
});

/**
 * Parse the "Host" header field to a hostname.
 *
 * When the "trust proxy" setting trusts the socket
 * address, the "X-Forwarded-Host" header field will
 * be trusted.
 *
 * @return {String}
 * @public
 */

defineGetter(req, 'hostname', function hostname(){
  var trust = this.app.get('trust proxy fn');
  var host = this.get('X-Forwarded-Host');

  if (!host || !trust(this.connection.remoteAddress, 0)) {
    host = this.get('Host');
  }

  if (!host) return;

  // IPv6 literal support
  var offset = host[0] === '['
    ? host.indexOf(']') + 1
    : 0;
  var index = host.indexOf(':', offset);

  return index !== -1
    ? host.substring(0, index)
    : host;
});

// TODO: change req.host to return host in next major

defineGetter(req, 'host', deprecate.function(function host(){
  return this.hostname;
}, 'req.host: Use req.hostname instead'));

/**
 * Check if the request is fresh, aka
 * Last-Modified and/or the ETag
 * still match.
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'fresh', function(){
  var method = this.method;
  var res = this.res
  var status = res.statusCode

  // GET or HEAD for weak freshness validation only
  if ('GET' !== method && 'HEAD' !== method) return false;

  // 2xx or 304 as per rfc2616 14.26
  if ((status >= 200 && status < 300) || 304 === status) {
    return fresh(this.headers, {
      'etag': res.get('ETag'),
      'last-modified': res.get('Last-Modified')
    })
  }

  return false;
});

/**
 * Check if the request is stale, aka
 * "Last-Modified" and / or the "ETag" for the
 * resource has changed.
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'stale', function stale(){
  return !this.fresh;
});

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'xhr', function xhr(){
  var val = this.get('X-Requested-With') || '';
  return val.toLowerCase() === 'xmlhttprequest';
});

/**
 * Helper function for creating a getter on an object.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} getter
 * @private
 */
function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
}


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var contentDisposition = __webpack_require__(84);
var deprecate = __webpack_require__(18)('express');
var encodeUrl = __webpack_require__(45);
var escapeHtml = __webpack_require__(46);
var http = __webpack_require__(57);
var isAbsolute = __webpack_require__(16).isAbsolute;
var onFinished = __webpack_require__(60);
var path = __webpack_require__(5);
var statuses = __webpack_require__(55)
var merge = __webpack_require__(80);
var sign = __webpack_require__(168).sign;
var normalizeType = __webpack_require__(16).normalizeType;
var normalizeTypes = __webpack_require__(16).normalizeTypes;
var setCharset = __webpack_require__(16).setCharset;
var cookie = __webpack_require__(169);
var send = __webpack_require__(78);
var extname = path.extname;
var mime = send.mime;
var resolve = path.resolve;
var vary = __webpack_require__(331);

/**
 * Response prototype.
 * @public
 */

var res = Object.create(http.ServerResponse.prototype)

/**
 * Module exports.
 * @public
 */

module.exports = res

/**
 * Module variables.
 * @private
 */

var charsetRegExp = /;\s*charset\s*=/;

/**
 * Set status `code`.
 *
 * @param {Number} code
 * @return {ServerResponse}
 * @public
 */

res.status = function status(code) {
  this.statusCode = code;
  return this;
};

/**
 * Set Link header field with the given `links`.
 *
 * Examples:
 *
 *    res.links({
 *      next: 'http://api.example.com/users?page=2',
 *      last: 'http://api.example.com/users?page=5'
 *    });
 *
 * @param {Object} links
 * @return {ServerResponse}
 * @public
 */

res.links = function(links){
  var link = this.get('Link') || '';
  if (link) link += ', ';
  return this.set('Link', link + Object.keys(links).map(function(rel){
    return '<' + links[rel] + '>; rel="' + rel + '"';
  }).join(', '));
};

/**
 * Send a response.
 *
 * Examples:
 *
 *     res.send(new Buffer('wahoo'));
 *     res.send({ some: 'json' });
 *     res.send('<p>some html</p>');
 *
 * @param {string|number|boolean|object|Buffer} body
 * @public
 */

res.send = function send(body) {
  var chunk = body;
  var encoding;
  var len;
  var req = this.req;
  var type;

  // settings
  var app = this.app;

  // allow status / body
  if (arguments.length === 2) {
    // res.send(body, status) backwards compat
    if (typeof arguments[0] !== 'number' && typeof arguments[1] === 'number') {
      deprecate('res.send(body, status): Use res.status(status).send(body) instead');
      this.statusCode = arguments[1];
    } else {
      deprecate('res.send(status, body): Use res.status(status).send(body) instead');
      this.statusCode = arguments[0];
      chunk = arguments[1];
    }
  }

  // disambiguate res.send(status) and res.send(status, num)
  if (typeof chunk === 'number' && arguments.length === 1) {
    // res.send(status) will set status message as text string
    if (!this.get('Content-Type')) {
      this.type('txt');
    }

    deprecate('res.send(status): Use res.sendStatus(status) instead');
    this.statusCode = chunk;
    chunk = statuses[chunk]
  }

  switch (typeof chunk) {
    // string defaulting to html
    case 'string':
      if (!this.get('Content-Type')) {
        this.type('html');
      }
      break;
    case 'boolean':
    case 'number':
    case 'object':
      if (chunk === null) {
        chunk = '';
      } else if (Buffer.isBuffer(chunk)) {
        if (!this.get('Content-Type')) {
          this.type('bin');
        }
      } else {
        return this.json(chunk);
      }
      break;
  }

  // write strings in utf-8
  if (typeof chunk === 'string') {
    encoding = 'utf8';
    type = this.get('Content-Type');

    // reflect this in content-type
    if (typeof type === 'string') {
      this.set('Content-Type', setCharset(type, 'utf-8'));
    }
  }

  // populate Content-Length
  if (chunk !== undefined) {
    if (!Buffer.isBuffer(chunk)) {
      // convert chunk to Buffer; saves later double conversions
      chunk = new Buffer(chunk, encoding);
      encoding = undefined;
    }

    len = chunk.length;
    this.set('Content-Length', len);
  }

  // populate ETag
  var etag;
  var generateETag = len !== undefined && app.get('etag fn');
  if (typeof generateETag === 'function' && !this.get('ETag')) {
    if ((etag = generateETag(chunk, encoding))) {
      this.set('ETag', etag);
    }
  }

  // freshness
  if (req.fresh) this.statusCode = 304;

  // strip irrelevant headers
  if (204 === this.statusCode || 304 === this.statusCode) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    this.removeHeader('Transfer-Encoding');
    chunk = '';
  }

  if (req.method === 'HEAD') {
    // skip body for HEAD
    this.end();
  } else {
    // respond
    this.end(chunk, encoding);
  }

  return this;
};

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */

res.json = function json(obj) {
  var val = obj;

  // allow status / body
  if (arguments.length === 2) {
    // res.json(body, status) backwards compat
    if (typeof arguments[1] === 'number') {
      deprecate('res.json(obj, status): Use res.status(status).json(obj) instead');
      this.statusCode = arguments[1];
    } else {
      deprecate('res.json(status, obj): Use res.status(status).json(obj) instead');
      this.statusCode = arguments[0];
      val = arguments[1];
    }
  }

  // settings
  var app = this.app;
  var replacer = app.get('json replacer');
  var spaces = app.get('json spaces');
  var body = stringify(val, replacer, spaces);

  // content-type
  if (!this.get('Content-Type')) {
    this.set('Content-Type', 'application/json');
  }

  return this.send(body);
};

/**
 * Send JSON response with JSONP callback support.
 *
 * Examples:
 *
 *     res.jsonp(null);
 *     res.jsonp({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */

res.jsonp = function jsonp(obj) {
  var val = obj;

  // allow status / body
  if (arguments.length === 2) {
    // res.json(body, status) backwards compat
    if (typeof arguments[1] === 'number') {
      deprecate('res.jsonp(obj, status): Use res.status(status).json(obj) instead');
      this.statusCode = arguments[1];
    } else {
      deprecate('res.jsonp(status, obj): Use res.status(status).jsonp(obj) instead');
      this.statusCode = arguments[0];
      val = arguments[1];
    }
  }

  // settings
  var app = this.app;
  var replacer = app.get('json replacer');
  var spaces = app.get('json spaces');
  var body = stringify(val, replacer, spaces);
  var callback = this.req.query[app.get('jsonp callback name')];

  // content-type
  if (!this.get('Content-Type')) {
    this.set('X-Content-Type-Options', 'nosniff');
    this.set('Content-Type', 'application/json');
  }

  // fixup callback
  if (Array.isArray(callback)) {
    callback = callback[0];
  }

  // jsonp
  if (typeof callback === 'string' && callback.length !== 0) {
    this.charset = 'utf-8';
    this.set('X-Content-Type-Options', 'nosniff');
    this.set('Content-Type', 'text/javascript');

    // restrict callback charset
    callback = callback.replace(/[^\[\]\w$.]/g, '');

    // replace chars not allowed in JavaScript that are in JSON
    body = body
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');

    // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
    // the typeof check is just to reduce client error noise
    body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
  }

  return this.send(body);
};

/**
 * Send given HTTP status code.
 *
 * Sets the response status to `statusCode` and the body of the
 * response to the standard description from node's http.STATUS_CODES
 * or the statusCode number if no description.
 *
 * Examples:
 *
 *     res.sendStatus(200);
 *
 * @param {number} statusCode
 * @public
 */

res.sendStatus = function sendStatus(statusCode) {
  var body = statuses[statusCode] || String(statusCode)

  this.statusCode = statusCode;
  this.type('txt');

  return this.send(body);
};

/**
 * Transfer the file at the given `path`.
 *
 * Automatically sets the _Content-Type_ response header field.
 * The callback `callback(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.sentHeader`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
 *   - `root`     root directory for relative filenames
 *   - `headers`  object of headers to serve with file
 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
 *
 * Other options are passed along to `send`.
 *
 * Examples:
 *
 *  The following example illustrates how `res.sendFile()` may
 *  be used as an alternative for the `static()` middleware for
 *  dynamic situations. The code backing `res.sendFile()` is actually
 *  the same code, so HTTP cache support etc is identical.
 *
 *     app.get('/user/:uid/photos/:file', function(req, res){
 *       var uid = req.params.uid
 *         , file = req.params.file;
 *
 *       req.user.mayViewFilesFrom(uid, function(yes){
 *         if (yes) {
 *           res.sendFile('/uploads/' + uid + '/' + file);
 *         } else {
 *           res.send(403, 'Sorry! you cant see that.');
 *         }
 *       });
 *     });
 *
 * @public
 */

res.sendFile = function sendFile(path, options, callback) {
  var done = callback;
  var req = this.req;
  var res = this;
  var next = req.next;
  var opts = options || {};

  if (!path) {
    throw new TypeError('path argument is required to res.sendFile');
  }

  // support function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  if (!opts.root && !isAbsolute(path)) {
    throw new TypeError('path must be absolute or specify root to res.sendFile');
  }

  // create file stream
  var pathname = encodeURI(path);
  var file = send(req, pathname, opts);

  // transfer
  sendfile(res, file, opts, function (err) {
    if (done) return done(err);
    if (err && err.code === 'EISDIR') return next();

    // next() all but write errors
    if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write') {
      next(err);
    }
  });
};

/**
 * Transfer the file at the given `path`.
 *
 * Automatically sets the _Content-Type_ response header field.
 * The callback `callback(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.sentHeader`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
 *   - `root`     root directory for relative filenames
 *   - `headers`  object of headers to serve with file
 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
 *
 * Other options are passed along to `send`.
 *
 * Examples:
 *
 *  The following example illustrates how `res.sendfile()` may
 *  be used as an alternative for the `static()` middleware for
 *  dynamic situations. The code backing `res.sendfile()` is actually
 *  the same code, so HTTP cache support etc is identical.
 *
 *     app.get('/user/:uid/photos/:file', function(req, res){
 *       var uid = req.params.uid
 *         , file = req.params.file;
 *
 *       req.user.mayViewFilesFrom(uid, function(yes){
 *         if (yes) {
 *           res.sendfile('/uploads/' + uid + '/' + file);
 *         } else {
 *           res.send(403, 'Sorry! you cant see that.');
 *         }
 *       });
 *     });
 *
 * @public
 */

res.sendfile = function (path, options, callback) {
  var done = callback;
  var req = this.req;
  var res = this;
  var next = req.next;
  var opts = options || {};

  // support function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  // create file stream
  var file = send(req, path, opts);

  // transfer
  sendfile(res, file, opts, function (err) {
    if (done) return done(err);
    if (err && err.code === 'EISDIR') return next();

    // next() all but write errors
    if (err && err.code !== 'ECONNABORT' && err.syscall !== 'write') {
      next(err);
    }
  });
};

res.sendfile = deprecate.function(res.sendfile,
  'res.sendfile: Use res.sendFile instead');

/**
 * Transfer the file at the given `path` as an attachment.
 *
 * Optionally providing an alternate attachment `filename`,
 * and optional callback `callback(err)`. The callback is invoked
 * when the data transfer is complete, or when an error has
 * ocurred. Be sure to check `res.headersSent` if you plan to respond.
 *
 * This method uses `res.sendfile()`.
 *
 * @public
 */

res.download = function download(path, filename, callback) {
  var done = callback;
  var name = filename;

  // support function as second arg
  if (typeof filename === 'function') {
    done = filename;
    name = null;
  }

  // set Content-Disposition when file is sent
  var headers = {
    'Content-Disposition': contentDisposition(name || path)
  };

  // Resolve the full path for sendFile
  var fullPath = resolve(path);

  return this.sendFile(fullPath, { headers: headers }, done);
};

/**
 * Set _Content-Type_ response header with `type` through `mime.lookup()`
 * when it does not contain "/", or set the Content-Type to `type` otherwise.
 *
 * Examples:
 *
 *     res.type('.html');
 *     res.type('html');
 *     res.type('json');
 *     res.type('application/json');
 *     res.type('png');
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 * @public
 */

res.contentType =
res.type = function contentType(type) {
  var ct = type.indexOf('/') === -1
    ? mime.lookup(type)
    : type;

  return this.set('Content-Type', ct);
};

/**
 * Respond to the Acceptable formats using an `obj`
 * of mime-type callbacks.
 *
 * This method uses `req.accepted`, an array of
 * acceptable types ordered by their quality values.
 * When "Accept" is not present the _first_ callback
 * is invoked, otherwise the first match is used. When
 * no match is performed the server responds with
 * 406 "Not Acceptable".
 *
 * Content-Type is set for you, however if you choose
 * you may alter this within the callback using `res.type()`
 * or `res.set('Content-Type', ...)`.
 *
 *    res.format({
 *      'text/plain': function(){
 *        res.send('hey');
 *      },
 *
 *      'text/html': function(){
 *        res.send('<p>hey</p>');
 *      },
 *
 *      'appliation/json': function(){
 *        res.send({ message: 'hey' });
 *      }
 *    });
 *
 * In addition to canonicalized MIME types you may
 * also use extnames mapped to these types:
 *
 *    res.format({
 *      text: function(){
 *        res.send('hey');
 *      },
 *
 *      html: function(){
 *        res.send('<p>hey</p>');
 *      },
 *
 *      json: function(){
 *        res.send({ message: 'hey' });
 *      }
 *    });
 *
 * By default Express passes an `Error`
 * with a `.status` of 406 to `next(err)`
 * if a match is not made. If you provide
 * a `.default` callback it will be invoked
 * instead.
 *
 * @param {Object} obj
 * @return {ServerResponse} for chaining
 * @public
 */

res.format = function(obj){
  var req = this.req;
  var next = req.next;

  var fn = obj.default;
  if (fn) delete obj.default;
  var keys = Object.keys(obj);

  var key = keys.length > 0
    ? req.accepts(keys)
    : false;

  this.vary("Accept");

  if (key) {
    this.set('Content-Type', normalizeType(key).value);
    obj[key](req, this, next);
  } else if (fn) {
    fn();
  } else {
    var err = new Error('Not Acceptable');
    err.status = err.statusCode = 406;
    err.types = normalizeTypes(keys).map(function(o){ return o.value });
    next(err);
  }

  return this;
};

/**
 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
 *
 * @param {String} filename
 * @return {ServerResponse}
 * @public
 */

res.attachment = function attachment(filename) {
  if (filename) {
    this.type(extname(filename));
  }

  this.set('Content-Disposition', contentDisposition(filename));

  return this;
};

/**
 * Append additional header `field` with value `val`.
 *
 * Example:
 *
 *    res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
 *    res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
 *    res.append('Warning', '199 Miscellaneous warning');
 *
 * @param {String} field
 * @param {String|Array} val
 * @return {ServerResponse} for chaining
 * @public
 */

res.append = function append(field, val) {
  var prev = this.get(field);
  var value = val;

  if (prev) {
    // concat the new and prev vals
    value = Array.isArray(prev) ? prev.concat(val)
      : Array.isArray(val) ? [prev].concat(val)
      : [prev, val];
  }

  return this.set(field, value);
};

/**
 * Set header `field` to `val`, or pass
 * an object of header fields.
 *
 * Examples:
 *
 *    res.set('Foo', ['bar', 'baz']);
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * Aliased as `res.header()`.
 *
 * @param {String|Object} field
 * @param {String|Array} val
 * @return {ServerResponse} for chaining
 * @public
 */

res.set =
res.header = function header(field, val) {
  if (arguments.length === 2) {
    var value = Array.isArray(val)
      ? val.map(String)
      : String(val);

    // add charset to content-type
    if (field.toLowerCase() === 'content-type') {
      if (Array.isArray(value)) {
        throw new TypeError('Content-Type cannot be set to an Array');
      }
      if (!charsetRegExp.test(value)) {
        var charset = mime.charsets.lookup(value.split(';')[0]);
        if (charset) value += '; charset=' + charset.toLowerCase();
      }
    }

    this.setHeader(field, value);
  } else {
    for (var key in field) {
      this.set(key, field[key]);
    }
  }
  return this;
};

/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 * @public
 */

res.get = function(field){
  return this.getHeader(field);
};

/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} [options]
 * @return {ServerResponse} for chaining
 * @public
 */

res.clearCookie = function clearCookie(name, options) {
  var opts = merge({ expires: new Date(1), path: '/' }, options);

  return this.cookie(name, '', opts);
};

/**
 * Set cookie `name` to `value`, with the given `options`.
 *
 * Options:
 *
 *    - `maxAge`   max-age in milliseconds, converted to `expires`
 *    - `signed`   sign the cookie
 *    - `path`     defaults to "/"
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 *    // save as above
 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 *
 * @param {String} name
 * @param {String|Object} value
 * @param {Object} [options]
 * @return {ServerResponse} for chaining
 * @public
 */

res.cookie = function (name, value, options) {
  var opts = merge({}, options);
  var secret = this.req.secret;
  var signed = opts.signed;

  if (signed && !secret) {
    throw new Error('cookieParser("secret") required for signed cookies');
  }

  var val = typeof value === 'object'
    ? 'j:' + JSON.stringify(value)
    : String(value);

  if (signed) {
    val = 's:' + sign(val, secret);
  }

  if ('maxAge' in opts) {
    opts.expires = new Date(Date.now() + opts.maxAge);
    opts.maxAge /= 1000;
  }

  if (opts.path == null) {
    opts.path = '/';
  }

  this.append('Set-Cookie', cookie.serialize(name, String(val), opts));

  return this;
};

/**
 * Set the location header to `url`.
 *
 * The given `url` can also be "back", which redirects
 * to the _Referrer_ or _Referer_ headers or "/".
 *
 * Examples:
 *
 *    res.location('/foo/bar').;
 *    res.location('http://example.com');
 *    res.location('../login');
 *
 * @param {String} url
 * @return {ServerResponse} for chaining
 * @public
 */

res.location = function location(url) {
  var loc = url;

  // "back" is an alias for the referrer
  if (url === 'back') {
    loc = this.req.get('Referrer') || '/';
  }

  // set location
  return this.set('Location', encodeUrl(loc));
};

/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * The resulting `url` is determined by `res.location()`, so
 * it will play nicely with mounted apps, relative paths,
 * `"back"` etc.
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
 *
 * @public
 */

res.redirect = function redirect(url) {
  var address = url;
  var body;
  var status = 302;

  // allow status / url
  if (arguments.length === 2) {
    if (typeof arguments[0] === 'number') {
      status = arguments[0];
      address = arguments[1];
    } else {
      deprecate('res.redirect(url, status): Use res.redirect(status, url) instead');
      status = arguments[1];
    }
  }

  // Set location header
  address = this.location(address).get('Location');

  // Support text/{plain,html} by default
  this.format({
    text: function(){
      body = statuses[status] + '. Redirecting to ' + address
    },

    html: function(){
      var u = escapeHtml(address);
      body = '<p>' + statuses[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>'
    },

    default: function(){
      body = '';
    }
  });

  // Respond
  this.statusCode = status;
  this.set('Content-Length', Buffer.byteLength(body));

  if (this.req.method === 'HEAD') {
    this.end();
  } else {
    this.end(body);
  }
};

/**
 * Add `field` to Vary. If already present in the Vary set, then
 * this call is simply ignored.
 *
 * @param {Array|String} field
 * @return {ServerResponse} for chaining
 * @public
 */

res.vary = function(field){
  // checks for back-compat
  if (!field || (Array.isArray(field) && !field.length)) {
    deprecate('res.vary(): Provide a field name');
    return this;
  }

  vary(this, field);

  return this;
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @public
 */

res.render = function render(view, options, callback) {
  var app = this.req.app;
  var done = callback;
  var opts = options || {};
  var req = this.req;
  var self = this;

  // support callback function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  // merge res.locals
  opts._locals = self.locals;

  // default callback to respond
  done = done || function (err, str) {
    if (err) return req.next(err);
    self.send(str);
  };

  // render
  app.render(view, opts, done);
};

// pipe the send file stream
function sendfile(res, file, options, callback) {
  var done = false;
  var streaming;

  // request aborted
  function onaborted() {
    if (done) return;
    done = true;

    var err = new Error('Request aborted');
    err.code = 'ECONNABORTED';
    callback(err);
  }

  // directory
  function ondirectory() {
    if (done) return;
    done = true;

    var err = new Error('EISDIR, read');
    err.code = 'EISDIR';
    callback(err);
  }

  // errors
  function onerror(err) {
    if (done) return;
    done = true;
    callback(err);
  }

  // ended
  function onend() {
    if (done) return;
    done = true;
    callback();
  }

  // file
  function onfile() {
    streaming = false;
  }

  // finished
  function onfinish(err) {
    if (err && err.code === 'ECONNRESET') return onaborted();
    if (err) return onerror(err);
    if (done) return;

    setImmediate(function () {
      if (streaming !== false && !done) {
        onaborted();
        return;
      }

      if (done) return;
      done = true;
      callback();
    });
  }

  // streaming
  function onstream() {
    streaming = true;
  }

  file.on('directory', ondirectory);
  file.on('end', onend);
  file.on('error', onerror);
  file.on('file', onfile);
  file.on('stream', onstream);
  onFinished(res, onfinish);

  if (options.headers) {
    // set headers on successful transfer
    file.on('headers', function headers(res) {
      var obj = options.headers;
      var keys = Object.keys(obj);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        res.setHeader(k, obj[k]);
      }
    });
  }

  // pipe
  file.pipe(res);
}

/**
 * Stringify JSON, like JSON.stringify, but v8 optimized.
 * @private
 */

function stringify(value, replacer, spaces) {
  // v8 checks arguments.length for optimizing simple call
  // https://bugs.chromium.org/p/v8/issues/detail?id=4730
  return replacer || spaces
    ? JSON.stringify(value, replacer, spaces)
    : JSON.stringify(value);
}


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var debug = __webpack_require__(33)('express:view');
var path = __webpack_require__(5);
var fs = __webpack_require__(7);
var utils = __webpack_require__(16);

/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

/**
 * Module exports.
 * @public
 */

module.exports = View;

/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` root path for view lookup
 *
 * @param {string} name
 * @param {object} options
 * @public
 */

function View(name, options) {
  var opts = options || {};

  this.defaultEngine = opts.defaultEngine;
  this.ext = extname(name);
  this.name = name;
  this.root = opts.root;

  if (!this.ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  var fileName = name;

  if (!this.ext) {
    // get extension from default engine name
    this.ext = this.defaultEngine[0] !== '.'
      ? '.' + this.defaultEngine
      : this.defaultEngine;

    fileName += this.ext;
  }

  if (!opts.engines[this.ext]) {
    // load engine
    var mod = this.ext.substr(1)
    debug('require "%s"', mod)
    opts.engines[this.ext] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()).__express
  }

  // store loaded engine
  this.engine = opts.engines[this.ext];

  // lookup path
  this.path = this.lookup(fileName);
}

/**
 * Lookup view by the given `name`
 *
 * @param {string} name
 * @private
 */

View.prototype.lookup = function lookup(name) {
  var path;
  var roots = [].concat(this.root);

  debug('lookup "%s"', name);

  for (var i = 0; i < roots.length && !path; i++) {
    var root = roots[i];

    // resolve the path
    var loc = resolve(root, name);
    var dir = dirname(loc);
    var file = basename(loc);

    // resolve the file
    path = this.resolve(dir, file);
  }

  return path;
};

/**
 * Render with the given options.
 *
 * @param {object} options
 * @param {function} callback
 * @private
 */

View.prototype.render = function render(options, callback) {
  debug('render "%s"', this.path);
  this.engine(this.path, options, callback);
};

/**
 * Resolve the file within the given directory.
 *
 * @param {string} dir
 * @param {string} file
 * @private
 */

View.prototype.resolve = function resolve(dir, file) {
  var ext = this.ext;

  // <path>.<ext>
  var path = join(dir, file);
  var stat = tryStat(path);

  if (stat && stat.isFile()) {
    return path;
  }

  // <path>/index.<ext>
  path = join(dir, basename(file, ext), 'index' + ext);
  stat = tryStat(path);

  if (stat && stat.isFile()) {
    return path;
  }
};

/**
 * Return a stat, maybe.
 *
 * @param {string} path
 * @return {fs.Stats}
 * @private
 */

function tryStat(path) {
  debug('stat "%s"', path);

  try {
    return fs.statSync(path);
  } catch (e) {
    return undefined;
  }
}


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(92);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (window && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(42);
var util = __webpack_require__(8);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(92);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(7);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(30);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * finalhandler
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var debug = __webpack_require__(205)('finalhandler')
var encodeUrl = __webpack_require__(45)
var escapeHtml = __webpack_require__(46)
var onFinished = __webpack_require__(60)
var parseUrl = __webpack_require__(37)
var statuses = __webpack_require__(55)
var unpipe = __webpack_require__(330)

/**
 * Module variables.
 * @private
 */

var DOUBLE_SPACE_REGEXP = /\x20{2}/g
var NEWLINE_REGEXP = /\n/g

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function (fn) { process.nextTick(fn.bind.apply(fn, arguments)) }
var isFinished = onFinished.isFinished

/**
 * Create a minimal HTML document.
 *
 * @param {string} message
 * @private
 */

function createHtmlDocument (message) {
  var body = escapeHtml(message)
    .replace(NEWLINE_REGEXP, '<br>')
    .replace(DOUBLE_SPACE_REGEXP, ' &nbsp;')

  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<title>Error</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '<pre>' + body + '</pre>\n' +
    '</body>\n' +
    '</html>\n'
}

/**
 * Module exports.
 * @public
 */

module.exports = finalhandler

/**
 * Create a function to handle the final response.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} [options]
 * @return {Function}
 * @public
 */

function finalhandler (req, res, options) {
  var opts = options || {}

  // get environment
  var env = opts.env || process.env.NODE_ENV || 'development'

  // get error callback
  var onerror = opts.onerror

  return function (err) {
    var headers
    var msg
    var status

    // ignore 404 on in-flight response
    if (!err && res._header) {
      debug('cannot 404 after headers sent')
      return
    }

    // unhandled error
    if (err) {
      // respect status code from error
      status = getErrorStatusCode(err)

      // respect headers from error
      if (status !== undefined) {
        headers = getErrorHeaders(err)
      }

      // fallback to status code on response
      if (status === undefined) {
        status = getResponseStatusCode(res)
      }

      // get error message
      msg = getErrorMessage(err, status, env)
    } else {
      // not found
      status = 404
      msg = 'Cannot ' + req.method + ' ' + encodeUrl(parseUrl.original(req).pathname)
    }

    debug('default %s', status)

    // schedule onerror callback
    if (err && onerror) {
      defer(onerror, err, req, res)
    }

    // cannot actually respond
    if (res._header) {
      debug('cannot %d after headers sent', status)
      req.socket.destroy()
      return
    }

    // send response
    send(req, res, status, headers, msg)
  }
}

/**
 * Get headers from Error object.
 *
 * @param {Error} err
 * @return {object}
 * @private
 */

function getErrorHeaders (err) {
  if (!err.headers || typeof err.headers !== 'object') {
    return undefined
  }

  var headers = Object.create(null)
  var keys = Object.keys(err.headers)

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    headers[key] = err.headers[key]
  }

  return headers
}

/**
 * Get message from Error object, fallback to status message.
 *
 * @param {Error} err
 * @param {number} status
 * @param {string} env
 * @return {string}
 * @private
 */

function getErrorMessage (err, status, env) {
  var msg

  if (env !== 'production') {
    // use err.stack, which typically includes err.message
    msg = err.stack

    // fallback to err.toString() when possible
    if (!msg && typeof err.toString === 'function') {
      msg = err.toString()
    }
  }

  return msg || statuses[status]
}

/**
 * Get status code from Error object.
 *
 * @param {Error} err
 * @return {number}
 * @private
 */

function getErrorStatusCode (err) {
  // check err.status
  if (typeof err.status === 'number' && err.status >= 400 && err.status < 600) {
    return err.status
  }

  // check err.statusCode
  if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600) {
    return err.statusCode
  }

  return undefined
}

/**
 * Get status code from response.
 *
 * @param {OutgoingMessage} res
 * @return {number}
 * @private
 */

function getResponseStatusCode (res) {
  var status = res.statusCode

  // default status code to 500 if outside valid range
  if (typeof status !== 'number' || status < 400 || status > 599) {
    status = 500
  }

  return status
}

/**
 * Send response.
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {number} status
 * @param {object} headers
 * @param {string} message
 * @private
 */

function send (req, res, status, headers, message) {
  function write () {
    // response body
    var body = createHtmlDocument(message)

    // response status
    res.statusCode = status
    res.statusMessage = statuses[status]

    // response headers
    setHeaders(res, headers)

    // security headers
    res.setHeader('Content-Security-Policy', "default-src 'self'")
    res.setHeader('X-Content-Type-Options', 'nosniff')

    // standard headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'))

    if (req.method === 'HEAD') {
      res.end()
      return
    }

    res.end(body, 'utf8')
  }

  if (isFinished(req)) {
    write()
    return
  }

  // unpipe everything from the request
  unpipe(req)

  // flush the request
  onFinished(req, write)
  req.resume()
}

/**
 * Set response headers from an object.
 *
 * @param {OutgoingMessage} res
 * @param {object} headers
 * @private
 */

function setHeaders (res, headers) {
  if (!headers) {
    return
  }

  var keys = Object.keys(headers)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    res.setHeader(key, headers[key])
  }
}


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(96);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (window && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(204);
} else {
  module.exports = __webpack_require__(206);
}


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(42);
var util = __webpack_require__(8);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(96);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(7);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(30);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),
/* 207 */
/***/ (function(module, exports) {

/*!
 * forwarded
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = forwarded

/**
 * Get all addresses in the request, using the `X-Forwarded-For` header.
 *
 * @param {Object} req
 * @api public
 */

function forwarded(req) {
  if (!req) {
    throw new TypeError('argument req is required')
  }

  // simple header parsing
  var proxyAddrs = (req.headers['x-forwarded-for'] || '')
    .split(/ *, */)
    .filter(Boolean)
    .reverse()
  var socketAddr = req.connection.remoteAddress
  var addrs = [socketAddr].concat(proxyAddrs)

  // return all addresses
  return addrs
}


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * http-errors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var deprecate = __webpack_require__(18)('http-errors')
var setPrototypeOf = __webpack_require__(54)
var statuses = __webpack_require__(55)
var inherits = __webpack_require__(23)

/**
 * Module exports.
 * @public
 */

module.exports = createError
module.exports.HttpError = createHttpErrorConstructor()

// Populate exports for all constructors
populateConstructorExports(module.exports, statuses.codes, module.exports.HttpError)

/**
 * Get the code class of a status code.
 * @private
 */

function codeClass (status) {
  return Number(String(status).charAt(0) + '00')
}

/**
 * Create a new HTTP Error.
 *
 * @returns {Error}
 * @public
 */

function createError () {
  // so much arity going on ~_~
  var err
  var msg
  var status = 500
  var props = {}
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    if (arg instanceof Error) {
      err = arg
      status = err.status || err.statusCode || status
      continue
    }
    switch (typeof arg) {
      case 'string':
        msg = arg
        break
      case 'number':
        status = arg
        if (i !== 0) {
          deprecate('non-first-argument status code; replace with createError(' + arg + ', ...)')
        }
        break
      case 'object':
        props = arg
        break
    }
  }

  if (typeof status === 'number' && (status < 400 || status >= 600)) {
    deprecate('non-error status code; use only 4xx or 5xx status codes')
  }

  if (typeof status !== 'number' ||
    (!statuses[status] && (status < 400 || status >= 600))) {
    status = 500
  }

  // constructor
  var HttpError = createError[status] || createError[codeClass(status)]

  if (!err) {
    // create error
    err = HttpError
      ? new HttpError(msg)
      : new Error(msg || statuses[status])
    Error.captureStackTrace(err, createError)
  }

  if (!HttpError || !(err instanceof HttpError) || err.status !== status) {
    // add properties to generic error
    err.expose = status < 500
    err.status = err.statusCode = status
  }

  for (var key in props) {
    if (key !== 'status' && key !== 'statusCode') {
      err[key] = props[key]
    }
  }

  return err
}

/**
 * Create HTTP error abstract base class.
 * @private
 */

function createHttpErrorConstructor () {
  function HttpError () {
    throw new TypeError('cannot construct abstract class')
  }

  inherits(HttpError, Error)

  return HttpError
}

/**
 * Create a constructor for a client error.
 * @private
 */

function createClientErrorConstructor (HttpError, name, code) {
  var className = name.match(/Error$/) ? name : name + 'Error'

  function ClientError (message) {
    // create the error object
    var msg = message != null ? message : statuses[code]
    var err = new Error(msg)

    // capture a stack trace to the construction point
    Error.captureStackTrace(err, ClientError)

    // adjust the [[Prototype]]
    setPrototypeOf(err, ClientError.prototype)

    // redefine the error message
    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    })

    // redefine the error name
    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    })

    return err
  }

  inherits(ClientError, HttpError)

  ClientError.prototype.status = code
  ClientError.prototype.statusCode = code
  ClientError.prototype.expose = true

  return ClientError
}

/**
 * Create a constructor for a server error.
 * @private
 */

function createServerErrorConstructor (HttpError, name, code) {
  var className = name.match(/Error$/) ? name : name + 'Error'

  function ServerError (message) {
    // create the error object
    var msg = message != null ? message : statuses[code]
    var err = new Error(msg)

    // capture a stack trace to the construction point
    Error.captureStackTrace(err, ServerError)

    // adjust the [[Prototype]]
    setPrototypeOf(err, ServerError.prototype)

    // redefine the error message
    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    })

    // redefine the error name
    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    })

    return err
  }

  inherits(ServerError, HttpError)

  ServerError.prototype.status = code
  ServerError.prototype.statusCode = code
  ServerError.prototype.expose = false

  return ServerError
}

/**
 * Populate the exports object with constructors for every error class.
 * @private
 */

function populateConstructorExports (exports, codes, HttpError) {
  codes.forEach(function forEachCode (code) {
    var CodeError
    var name = toIdentifier(statuses[code])

    switch (codeClass(code)) {
      case 400:
        CodeError = createClientErrorConstructor(HttpError, name, code)
        break
      case 500:
        CodeError = createServerErrorConstructor(HttpError, name, code)
        break
    }

    if (CodeError) {
      // export the constructor
      exports[code] = CodeError
      exports[name] = CodeError
    }
  })

  // backwards-compatibility
  exports["I'mateapot"] = deprecate.function(exports.ImATeapot,
    '"I\'mateapot"; use "ImATeapot" instead')
}

/**
 * Convert a string of words to a JavaScript identifier.
 * @private
 */

function toIdentifier (str) {
  return str.split(' ').map(function (token) {
    return token.slice(0, 1).toUpperCase() + token.slice(1)
  }).join('').replace(/[^ _0-9a-z]/gi, '')
}


/***/ }),
/* 209 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function() {
  var expandIPv6, ipaddr, ipv4Part, ipv4Regexes, ipv6Part, ipv6Regexes, matchCIDR, root;

  ipaddr = {};

  root = this;

  if ((typeof module !== "undefined" && module !== null) && module.exports) {
    module.exports = ipaddr;
  } else {
    root['ipaddr'] = ipaddr;
  }

  matchCIDR = function(first, second, partSize, cidrBits) {
    var part, shift;
    if (first.length !== second.length) {
      throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
    }
    part = 0;
    while (cidrBits > 0) {
      shift = partSize - cidrBits;
      if (shift < 0) {
        shift = 0;
      }
      if (first[part] >> shift !== second[part] >> shift) {
        return false;
      }
      cidrBits -= partSize;
      part += 1;
    }
    return true;
  };

  ipaddr.subnetMatch = function(address, rangeList, defaultName) {
    var rangeName, rangeSubnets, subnet, _i, _len;
    if (defaultName == null) {
      defaultName = 'unicast';
    }
    for (rangeName in rangeList) {
      rangeSubnets = rangeList[rangeName];
      if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) {
        rangeSubnets = [rangeSubnets];
      }
      for (_i = 0, _len = rangeSubnets.length; _i < _len; _i++) {
        subnet = rangeSubnets[_i];
        if (address.match.apply(address, subnet)) {
          return rangeName;
        }
      }
    }
    return defaultName;
  };

  ipaddr.IPv4 = (function() {
    function IPv4(octets) {
      var octet, _i, _len;
      if (octets.length !== 4) {
        throw new Error("ipaddr: ipv4 octet count should be 4");
      }
      for (_i = 0, _len = octets.length; _i < _len; _i++) {
        octet = octets[_i];
        if (!((0 <= octet && octet <= 255))) {
          throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
        }
      }
      this.octets = octets;
    }

    IPv4.prototype.kind = function() {
      return 'ipv4';
    };

    IPv4.prototype.toString = function() {
      return this.octets.join(".");
    };

    IPv4.prototype.toByteArray = function() {
      return this.octets.slice(0);
    };

    IPv4.prototype.match = function(other, cidrRange) {
      var _ref;
      if (cidrRange === void 0) {
        _ref = other, other = _ref[0], cidrRange = _ref[1];
      }
      if (other.kind() !== 'ipv4') {
        throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
      }
      return matchCIDR(this.octets, other.octets, 8, cidrRange);
    };

    IPv4.prototype.SpecialRanges = {
      unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
      broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
      multicast: [[new IPv4([224, 0, 0, 0]), 4]],
      linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
      loopback: [[new IPv4([127, 0, 0, 0]), 8]],
      carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
      "private": [[new IPv4([10, 0, 0, 0]), 8], [new IPv4([172, 16, 0, 0]), 12], [new IPv4([192, 168, 0, 0]), 16]],
      reserved: [[new IPv4([192, 0, 0, 0]), 24], [new IPv4([192, 0, 2, 0]), 24], [new IPv4([192, 88, 99, 0]), 24], [new IPv4([198, 51, 100, 0]), 24], [new IPv4([203, 0, 113, 0]), 24], [new IPv4([240, 0, 0, 0]), 4]]
    };

    IPv4.prototype.range = function() {
      return ipaddr.subnetMatch(this, this.SpecialRanges);
    };

    IPv4.prototype.toIPv4MappedAddress = function() {
      return ipaddr.IPv6.parse("::ffff:" + (this.toString()));
    };

    IPv4.prototype.prefixLengthFromSubnetMask = function() {
      var cidr, i, octet, stop, zeros, zerotable, _i;
      zerotable = {
        0: 8,
        128: 7,
        192: 6,
        224: 5,
        240: 4,
        248: 3,
        252: 2,
        254: 1,
        255: 0
      };
      cidr = 0;
      stop = false;
      for (i = _i = 3; _i >= 0; i = _i += -1) {
        octet = this.octets[i];
        if (octet in zerotable) {
          zeros = zerotable[octet];
          if (stop && zeros !== 0) {
            return null;
          }
          if (zeros !== 8) {
            stop = true;
          }
          cidr += zeros;
        } else {
          return null;
        }
      }
      return 32 - cidr;
    };

    return IPv4;

  })();

  ipv4Part = "(0?\\d+|0x[a-f0-9]+)";

  ipv4Regexes = {
    fourOctet: new RegExp("^" + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "$", 'i'),
    longValue: new RegExp("^" + ipv4Part + "$", 'i')
  };

  ipaddr.IPv4.parser = function(string) {
    var match, parseIntAuto, part, shift, value;
    parseIntAuto = function(string) {
      if (string[0] === "0" && string[1] !== "x") {
        return parseInt(string, 8);
      } else {
        return parseInt(string);
      }
    };
    if (match = string.match(ipv4Regexes.fourOctet)) {
      return (function() {
        var _i, _len, _ref, _results;
        _ref = match.slice(1, 6);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          part = _ref[_i];
          _results.push(parseIntAuto(part));
        }
        return _results;
      })();
    } else if (match = string.match(ipv4Regexes.longValue)) {
      value = parseIntAuto(match[1]);
      if (value > 0xffffffff || value < 0) {
        throw new Error("ipaddr: address outside defined range");
      }
      return ((function() {
        var _i, _results;
        _results = [];
        for (shift = _i = 0; _i <= 24; shift = _i += 8) {
          _results.push((value >> shift) & 0xff);
        }
        return _results;
      })()).reverse();
    } else {
      return null;
    }
  };

  ipaddr.IPv6 = (function() {
    function IPv6(parts) {
      var i, part, _i, _j, _len, _ref;
      if (parts.length === 16) {
        this.parts = [];
        for (i = _i = 0; _i <= 14; i = _i += 2) {
          this.parts.push((parts[i] << 8) | parts[i + 1]);
        }
      } else if (parts.length === 8) {
        this.parts = parts;
      } else {
        throw new Error("ipaddr: ipv6 part count should be 8 or 16");
      }
      _ref = this.parts;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        part = _ref[_j];
        if (!((0 <= part && part <= 0xffff))) {
          throw new Error("ipaddr: ipv6 part should fit in 16 bits");
        }
      }
    }

    IPv6.prototype.kind = function() {
      return 'ipv6';
    };

    IPv6.prototype.toString = function() {
      var compactStringParts, part, pushPart, state, stringParts, _i, _len;
      stringParts = (function() {
        var _i, _len, _ref, _results;
        _ref = this.parts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          part = _ref[_i];
          _results.push(part.toString(16));
        }
        return _results;
      }).call(this);
      compactStringParts = [];
      pushPart = function(part) {
        return compactStringParts.push(part);
      };
      state = 0;
      for (_i = 0, _len = stringParts.length; _i < _len; _i++) {
        part = stringParts[_i];
        switch (state) {
          case 0:
            if (part === '0') {
              pushPart('');
            } else {
              pushPart(part);
            }
            state = 1;
            break;
          case 1:
            if (part === '0') {
              state = 2;
            } else {
              pushPart(part);
            }
            break;
          case 2:
            if (part !== '0') {
              pushPart('');
              pushPart(part);
              state = 3;
            }
            break;
          case 3:
            pushPart(part);
        }
      }
      if (state === 2) {
        pushPart('');
        pushPart('');
      }
      return compactStringParts.join(":");
    };

    IPv6.prototype.toByteArray = function() {
      var bytes, part, _i, _len, _ref;
      bytes = [];
      _ref = this.parts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        bytes.push(part >> 8);
        bytes.push(part & 0xff);
      }
      return bytes;
    };

    IPv6.prototype.toNormalizedString = function() {
      var part;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.parts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          part = _ref[_i];
          _results.push(part.toString(16));
        }
        return _results;
      }).call(this)).join(":");
    };

    IPv6.prototype.match = function(other, cidrRange) {
      var _ref;
      if (cidrRange === void 0) {
        _ref = other, other = _ref[0], cidrRange = _ref[1];
      }
      if (other.kind() !== 'ipv6') {
        throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
      }
      return matchCIDR(this.parts, other.parts, 16, cidrRange);
    };

    IPv6.prototype.SpecialRanges = {
      unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
      linkLocal: [new IPv6([0xfe80, 0, 0, 0, 0, 0, 0, 0]), 10],
      multicast: [new IPv6([0xff00, 0, 0, 0, 0, 0, 0, 0]), 8],
      loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
      uniqueLocal: [new IPv6([0xfc00, 0, 0, 0, 0, 0, 0, 0]), 7],
      ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 0xffff, 0, 0]), 96],
      rfc6145: [new IPv6([0, 0, 0, 0, 0xffff, 0, 0, 0]), 96],
      rfc6052: [new IPv6([0x64, 0xff9b, 0, 0, 0, 0, 0, 0]), 96],
      '6to4': [new IPv6([0x2002, 0, 0, 0, 0, 0, 0, 0]), 16],
      teredo: [new IPv6([0x2001, 0, 0, 0, 0, 0, 0, 0]), 32],
      reserved: [[new IPv6([0x2001, 0xdb8, 0, 0, 0, 0, 0, 0]), 32]]
    };

    IPv6.prototype.range = function() {
      return ipaddr.subnetMatch(this, this.SpecialRanges);
    };

    IPv6.prototype.isIPv4MappedAddress = function() {
      return this.range() === 'ipv4Mapped';
    };

    IPv6.prototype.toIPv4Address = function() {
      var high, low, _ref;
      if (!this.isIPv4MappedAddress()) {
        throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
      }
      _ref = this.parts.slice(-2), high = _ref[0], low = _ref[1];
      return new ipaddr.IPv4([high >> 8, high & 0xff, low >> 8, low & 0xff]);
    };

    return IPv6;

  })();

  ipv6Part = "(?:[0-9a-f]+::?)+";

  ipv6Regexes = {
    "native": new RegExp("^(::)?(" + ipv6Part + ")?([0-9a-f]+)?(::)?$", 'i'),
    transitional: new RegExp(("^((?:" + ipv6Part + ")|(?:::)(?:" + ipv6Part + ")?)") + ("" + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "$"), 'i')
  };

  expandIPv6 = function(string, parts) {
    var colonCount, lastColon, part, replacement, replacementCount;
    if (string.indexOf('::') !== string.lastIndexOf('::')) {
      return null;
    }
    colonCount = 0;
    lastColon = -1;
    while ((lastColon = string.indexOf(':', lastColon + 1)) >= 0) {
      colonCount++;
    }
    if (string.substr(0, 2) === '::') {
      colonCount--;
    }
    if (string.substr(-2, 2) === '::') {
      colonCount--;
    }
    if (colonCount > parts) {
      return null;
    }
    replacementCount = parts - colonCount;
    replacement = ':';
    while (replacementCount--) {
      replacement += '0:';
    }
    string = string.replace('::', replacement);
    if (string[0] === ':') {
      string = string.slice(1);
    }
    if (string[string.length - 1] === ':') {
      string = string.slice(0, -1);
    }
    return (function() {
      var _i, _len, _ref, _results;
      _ref = string.split(":");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        _results.push(parseInt(part, 16));
      }
      return _results;
    })();
  };

  ipaddr.IPv6.parser = function(string) {
    var match, octet, octets, parts, _i, _len;
    if (string.match(ipv6Regexes['native'])) {
      return expandIPv6(string, 8);
    } else if (match = string.match(ipv6Regexes['transitional'])) {
      parts = expandIPv6(match[1].slice(0, -1), 6);
      if (parts) {
        octets = [parseInt(match[2]), parseInt(match[3]), parseInt(match[4]), parseInt(match[5])];
        for (_i = 0, _len = octets.length; _i < _len; _i++) {
          octet = octets[_i];
          if (!((0 <= octet && octet <= 255))) {
            return null;
          }
        }
        parts.push(octets[0] << 8 | octets[1]);
        parts.push(octets[2] << 8 | octets[3]);
        return parts;
      }
    }
    return null;
  };

  ipaddr.IPv4.isIPv4 = ipaddr.IPv6.isIPv6 = function(string) {
    return this.parser(string) !== null;
  };

  ipaddr.IPv4.isValid = function(string) {
    var e;
    try {
      new this(this.parser(string));
      return true;
    } catch (_error) {
      e = _error;
      return false;
    }
  };

  ipaddr.IPv4.isValidFourPartDecimal = function(string) {
    if (ipaddr.IPv4.isValid(string) && string.match(/^\d+(\.\d+){3}$/)) {
      return true;
    } else {
      return false;
    }
  };

  ipaddr.IPv6.isValid = function(string) {
    var e;
    if (typeof string === "string" && string.indexOf(":") === -1) {
      return false;
    }
    try {
      new this(this.parser(string));
      return true;
    } catch (_error) {
      e = _error;
      return false;
    }
  };

  ipaddr.IPv4.parse = ipaddr.IPv6.parse = function(string) {
    var parts;
    parts = this.parser(string);
    if (parts === null) {
      throw new Error("ipaddr: string is not formatted like ip address");
    }
    return new this(parts);
  };

  ipaddr.IPv4.parseCIDR = function(string) {
    var maskLength, match;
    if (match = string.match(/^(.+)\/(\d+)$/)) {
      maskLength = parseInt(match[2]);
      if (maskLength >= 0 && maskLength <= 32) {
        return [this.parse(match[1]), maskLength];
      }
    }
    throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
  };

  ipaddr.IPv6.parseCIDR = function(string) {
    var maskLength, match;
    if (match = string.match(/^(.+)\/(\d+)$/)) {
      maskLength = parseInt(match[2]);
      if (maskLength >= 0 && maskLength <= 128) {
        return [this.parse(match[1]), maskLength];
      }
    }
    throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
  };

  ipaddr.isValid = function(string) {
    return ipaddr.IPv6.isValid(string) || ipaddr.IPv4.isValid(string);
  };

  ipaddr.parse = function(string) {
    if (ipaddr.IPv6.isValid(string)) {
      return ipaddr.IPv6.parse(string);
    } else if (ipaddr.IPv4.isValid(string)) {
      return ipaddr.IPv4.parse(string);
    } else {
      throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
    }
  };

  ipaddr.parseCIDR = function(string) {
    var e;
    try {
      return ipaddr.IPv6.parseCIDR(string);
    } catch (_error) {
      e = _error;
      try {
        return ipaddr.IPv4.parseCIDR(string);
      } catch (_error) {
        e = _error;
        throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
      }
    }
  };

  ipaddr.fromByteArray = function(bytes) {
    var length;
    length = bytes.length;
    if (length === 4) {
      return new ipaddr.IPv4(bytes);
    } else if (length === 16) {
      return new ipaddr.IPv6(bytes);
    } else {
      throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
    }
  };

  ipaddr.process = function(string) {
    var addr;
    addr = this.parse(string);
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      return addr.toIPv4Address();
    } else {
      return addr;
    }
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(332)(module)))

/***/ }),
/* 211 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 211;

/***/ }),
/* 212 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 212;

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./categoryFilter": 98,
	"./categoryFilter.js": 98,
	"./clustered": 99,
	"./clustered.js": 99,
	"./console": 100,
	"./console.js": 100,
	"./dateFile": 101,
	"./dateFile.js": 101,
	"./file": 102,
	"./file.js": 102,
	"./fileSync": 103,
	"./fileSync.js": 103,
	"./gelf": 104,
	"./gelf.js": 104,
	"./hipchat": 105,
	"./hipchat.js": 105,
	"./logFacesAppender": 106,
	"./logFacesAppender.js": 106,
	"./logLevelFilter": 107,
	"./logLevelFilter.js": 107,
	"./loggly": 108,
	"./loggly.js": 108,
	"./logstashUDP": 109,
	"./logstashUDP.js": 109,
	"./mailgun": 110,
	"./mailgun.js": 110,
	"./multiprocess": 111,
	"./multiprocess.js": 111,
	"./slack": 112,
	"./slack.js": 112,
	"./smtp": 113,
	"./smtp.js": 113,
	"./stderr": 114,
	"./stderr.js": 114,
	"./stdout": 115,
	"./stdout.js": 115
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 213;

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var levels = __webpack_require__(24);
var DEFAULT_FORMAT = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :content-length ":referrer"' +
  ' ":user-agent"';
/**
 * Log requests with the given `options` or a `format` string.
 *
 * Options:
 *
 *   - `format`        Format string, see below for tokens
 *   - `level`         A log4js levels instance. Supports also 'auto'
 *
 * Tokens:
 *
 *   - `:req[header]` ex: `:req[Accept]`
 *   - `:res[header]` ex: `:res[Content-Length]`
 *   - `:http-version`
 *   - `:response-time`
 *   - `:remote-addr`
 *   - `:date`
 *   - `:method`
 *   - `:url`
 *   - `:referrer`
 *   - `:user-agent`
 *   - `:status`
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 */

function getLogger(logger4js, options) {
	if ('object' == typeof options) {
		options = options || {};
	} else if (options) {
		options = { format: options };
	} else {
		options = {};
	}

	var thislogger = logger4js
  , level = levels.toLevel(options.level, levels.INFO)
  , fmt = options.format || DEFAULT_FORMAT
  , nolog = options.nolog ? createNoLogCondition(options.nolog) : null;

  return function (req, res, next) {
    // mount safety
    if (req._logging) return next();

		// nologs
		if (nolog && nolog.test(req.originalUrl)) return next();
		if (thislogger.isLevelEnabled(level) || options.level === 'auto') {

			var start = new Date()
			, statusCode
			, writeHead = res.writeHead
			, url = req.originalUrl;

			// flag as logging
			req._logging = true;

			// proxy for statusCode.
			res.writeHead = function(code, headers){
				res.writeHead = writeHead;
				res.writeHead(code, headers);
				res.__statusCode = statusCode = code;
				res.__headers = headers || {};

				//status code response level handling
				if(options.level === 'auto'){
					level = levels.INFO;
					if(code >= 300) level = levels.WARN;
					if(code >= 400) level = levels.ERROR;
				} else {
					level = levels.toLevel(options.level, levels.INFO);
				}
			};

			//hook on end request to emit the log entry of the HTTP request.
			res.on('finish', function() {
				res.responseTime = new Date() - start;
				//status code response level handling
				if(res.statusCode && options.level === 'auto'){
					level = levels.INFO;
					if(res.statusCode >= 300) level = levels.WARN;
					if(res.statusCode >= 400) level = levels.ERROR;
				}
				if (thislogger.isLevelEnabled(level)) {
          var combined_tokens = assemble_tokens(req, res, options.tokens || []);
					if (typeof fmt === 'function') {
						var line = fmt(req, res, function(str){ return format(str, combined_tokens); });
						if (line) thislogger.log(level, line);
					} else {
						thislogger.log(level, format(fmt, combined_tokens));
					}
				}
			});
		}

    //ensure next gets always called
    next();
  };
}

/**
 * Adds custom {token, replacement} objects to defaults,
 * overwriting the defaults if any tokens clash
 *
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {Array} custom_tokens
 *    [{ token: string-or-regexp, replacement: string-or-replace-function }]
 * @return {Array}
 */
function assemble_tokens(req, res, custom_tokens) {
  var array_unique_tokens = function(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i].token == a[j].token) { // not === because token can be regexp object
          a.splice(j--, 1);
        }
      }
    }
    return a;
  };

  var default_tokens = [];
  default_tokens.push({ token: ':url', replacement: getUrl(req) });
  default_tokens.push({ token: ':protocol', replacement: req.protocol });
  default_tokens.push({ token: ':hostname', replacement: req.hostname });
  default_tokens.push({ token: ':method', replacement: req.method });
  default_tokens.push({ token: ':status', replacement: res.__statusCode || res.statusCode });
  default_tokens.push({ token: ':response-time', replacement: res.responseTime });
  default_tokens.push({ token: ':date', replacement: new Date().toUTCString() });
  default_tokens.push({
    token: ':referrer',
    replacement: req.headers.referer || req.headers.referrer || ''
  });
  default_tokens.push({
    token: ':http-version',
    replacement: req.httpVersionMajor + '.' + req.httpVersionMinor
  });
  default_tokens.push({
    token: ':remote-addr',
    replacement:
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req._remoteAddress ||
      (req.socket &&
        (req.socket.remoteAddress ||
          (req.socket.socket && req.socket.socket.remoteAddress)
        )
      )
    }
  );
  default_tokens.push({ token: ':user-agent', replacement: req.headers['user-agent'] });
  default_tokens.push({
    token: ':content-length',
    replacement:
      (res._headers && res._headers['content-length']) ||
      (res.__headers && res.__headers['Content-Length']) ||
      '-'
    }
  );
  default_tokens.push({ token: /:req\[([^\]]+)\]/g, replacement: function(_, field) {
    return req.headers[field.toLowerCase()];
  } });
  default_tokens.push({ token: /:res\[([^\]]+)\]/g, replacement: function(_, field) {
    return res._headers ?
      (res._headers[field.toLowerCase()] || res.__headers[field])
      : (res.__headers && res.__headers[field]);
  } });

  return array_unique_tokens(custom_tokens.concat(default_tokens));
}

/**
 * Return request url path,
 * adding this function prevents the Cyclomatic Complexity,
 * for the assemble_tokens function at low, to pass the tests.
 *
 * @param  {IncomingMessage} req
 * @return {String}
 * @api private
 */

function getUrl(req){
  return req.originalUrl || req.url;
}
/**
 * Return formatted log line.
 *
 * @param  {String} str
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {String}
 * @api private
 */

function format(str, tokens) {
  for (var i = 0; i < tokens.length; i++) {
    str = str.replace(tokens[i].token, tokens[i].replacement);
  }
  return str;
}

/**
 * Return RegExp Object about nolog
 *
 * @param  {String} nolog
 * @return {RegExp}
 * @api private
 *
 * syntax
 *  1. String
 *   1.1 "\\.gif"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.gif?fuga
 *         LOGGING http://example.com/hoge.agif
 *   1.2 in "\\.gif|\\.jpg$"
 *         NOT LOGGING http://example.com/hoge.gif and
 *           http://example.com/hoge.gif?fuga and http://example.com/hoge.jpg?fuga
 *         LOGGING http://example.com/hoge.agif,
 *           http://example.com/hoge.ajpg and http://example.com/hoge.jpg?hoge
 *   1.3 in "\\.(gif|jpe?g|png)$"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.jpeg
 *         LOGGING http://example.com/hoge.gif?uid=2 and http://example.com/hoge.jpg?pid=3
 *  2. RegExp
 *   2.1 in /\.(gif|jpe?g|png)$/
 *         SAME AS 1.3
 *  3. Array
 *   3.1 ["\\.jpg$", "\\.png", "\\.gif"]
 *         SAME AS "\\.jpg|\\.png|\\.gif"
 */
function createNoLogCondition(nolog) {
  var regexp = null;

	if (nolog) {
    if (nolog instanceof RegExp) {
      regexp = nolog;
    }

    if (typeof nolog === 'string') {
      regexp = new RegExp(nolog);
    }

    if (Array.isArray(nolog)) {
      var regexpsAsStrings = nolog.map(
        function convertToStrings(o) {
          return o.source ? o.source : o;
        }
      );
      regexp = new RegExp(regexpsAsStrings.join('|'));
    }
  }

  return regexp;
}

exports.connectLogger = getLogger;


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
exports.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ss.SSSO";
exports.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
exports.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";

function padWithZeros(vNumber, width) {
  var numAsString = vNumber + "";
  while (numAsString.length < width) {
    numAsString = "0" + numAsString;
  }
  return numAsString;
}

function addZero(vNumber) {
  return padWithZeros(vNumber, 2);
}

/**
 * Formats the TimeOffest
 * Thanks to http://www.svendtofte.com/code/date_format/
 * @private
 */
function offset(timezoneOffset) {
  // Difference to Greenwich time (GMT) in hours
  var os = Math.abs(timezoneOffset);
  var h = String(Math.floor(os/60));
  var m = String(os%60);
  if (h.length == 1) {
    h = "0" + h;
  }
  if (m.length == 1) {
    m = "0" + m;
  }
  return timezoneOffset < 0 ? "+"+h+m : "-"+h+m;
}

exports.asString = function(/*format,*/ date, timezoneOffset) {
  /*jshint -W071 */
  var format = exports.ISO8601_FORMAT;
  if (typeof(date) === "string") {
    format = arguments[0];
    date = arguments[1];
    timezoneOffset = arguments[2];
  }
  // make the date independent of the system timezone by working with UTC
  if (timezoneOffset === undefined) {
    timezoneOffset = date.getTimezoneOffset();
  }
  date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
  var vDay = addZero(date.getUTCDate());
  var vMonth = addZero(date.getUTCMonth()+1);
  var vYearLong = addZero(date.getUTCFullYear());
  var vYearShort = addZero(date.getUTCFullYear().toString().substring(2,4));
  var vYear = (format.indexOf("yyyy") > -1 ? vYearLong : vYearShort);
  var vHour  = addZero(date.getUTCHours());
  var vMinute = addZero(date.getUTCMinutes());
  var vSecond = addZero(date.getUTCSeconds());
  var vMillisecond = padWithZeros(date.getUTCMilliseconds(), 3);
  var vTimeZone = offset(timezoneOffset);
  date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
  var formatted = format
    .replace(/dd/g, vDay)
    .replace(/MM/g, vMonth)
    .replace(/y{1,4}/g, vYear)
    .replace(/hh/g, vHour)
    .replace(/mm/g, vMinute)
    .replace(/ss/g, vSecond)
    .replace(/SSS/g, vMillisecond)
    .replace(/O/g, vTimeZone);
  return formatted;

};
/*jshint +W071 */


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var levels = __webpack_require__(24)
, util = __webpack_require__(8)
, events = __webpack_require__(29)
, DEFAULT_CATEGORY = '[default]';

var logWritesEnabled = true;

/**
 * Models a logging event.
 * @constructor
 * @param {String} categoryName name of category
 * @param {Log4js.Level} level level of message
 * @param {Array} data objects to log
 * @param {Log4js.Logger} logger the associated logger
 * @author Seth Chisamore
 */
function LoggingEvent (categoryName, level, data, logger) {
  this.startTime = new Date();
  this.categoryName = categoryName;
  this.data = data;
  this.level = level;
  this.logger = logger;
}

/**
 * Logger to log messages.
 * use {@see Log4js#getLogger(String)} to get an instance.
 * @constructor
 * @param name name of category to log to
 * @author Stephan Strittmatter
 */
function Logger (name, level) {
  this.category = name || DEFAULT_CATEGORY;

  if (level) {
    this.setLevel(level);
  }
}
util.inherits(Logger, events.EventEmitter);
Logger.DEFAULT_CATEGORY = DEFAULT_CATEGORY;
Logger.prototype.level = levels.TRACE;

Logger.prototype.setLevel = function(level) {
  this.level = levels.toLevel(level, this.level || levels.TRACE);
};

Logger.prototype.removeLevel = function() {
  delete this.level;
};

Logger.prototype.log = function() {
  var logLevel = levels.toLevel(arguments[0], levels.INFO);
  if (!this.isLevelEnabled(logLevel)) {
    return;
  }
  var numArgs = arguments.length - 1;
  var args = new Array(numArgs);
  for (var i = 0; i < numArgs; i++) {
    args[i] = arguments[i + 1];
  }
  this._log(logLevel, args);
};

Logger.prototype.isLevelEnabled = function(otherLevel) {
  return this.level.isLessThanOrEqualTo(otherLevel);
};

['Trace','Debug','Info','Warn','Error','Fatal', 'Mark'].forEach(addLevelMethods);

function addLevelMethods(level) {
  level = levels.toLevel(level);

  var levelStrLower = level.toString().toLowerCase();
  var levelMethod = levelStrLower.replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); } );
  var isLevelMethod = levelMethod[0].toUpperCase() + levelMethod.slice(1);

  Logger.prototype['is'+isLevelMethod+'Enabled'] = function() {
    return this.isLevelEnabled(level);
  };

  Logger.prototype[levelMethod] = function () {
    if (logWritesEnabled && this.isLevelEnabled(level)) {
      var numArgs = arguments.length;
      var args = new Array(numArgs);
      for (var i = 0; i < numArgs; i++) {
        args[i] = arguments[i];
      }
      this._log(level, args);
    }
  };
}

Logger.prototype._log = function(level, data) {
  var loggingEvent = new LoggingEvent(this.category, level, data, this);
  this.emit('log', loggingEvent);
};

/**
 * Disable all log writes.
 * @returns {void}
 */
function disableAllLogWrites() {
  logWritesEnabled = false;
}

/**
 * Enable log writes.
 * @returns {void}
 */
function enableAllLogWrites() {
  logWritesEnabled = true;
}

exports.LoggingEvent = LoggingEvent;
exports.Logger = Logger;
exports.disableAllLogWrites = disableAllLogWrites;
exports.enableAllLogWrites = enableAllLogWrites;
exports.addLevelMethods = addLevelMethods;


/***/ }),
/* 217 */
/***/ (function(module, exports) {

/*!
 * media-typer
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * RegExp to match *( ";" parameter ) in RFC 2616 sec 3.7
 *
 * parameter     = token "=" ( token | quoted-string )
 * token         = 1*<any CHAR except CTLs or separators>
 * separators    = "(" | ")" | "<" | ">" | "@"
 *               | "," | ";" | ":" | "\" | <">
 *               | "/" | "[" | "]" | "?" | "="
 *               | "{" | "}" | SP | HT
 * quoted-string = ( <"> *(qdtext | quoted-pair ) <"> )
 * qdtext        = <any TEXT except <">>
 * quoted-pair   = "\" CHAR
 * CHAR          = <any US-ASCII character (octets 0 - 127)>
 * TEXT          = <any OCTET except CTLs, but including LWS>
 * LWS           = [CRLF] 1*( SP | HT )
 * CRLF          = CR LF
 * CR            = <US-ASCII CR, carriage return (13)>
 * LF            = <US-ASCII LF, linefeed (10)>
 * SP            = <US-ASCII SP, space (32)>
 * SHT           = <US-ASCII HT, horizontal-tab (9)>
 * CTL           = <any US-ASCII control character (octets 0 - 31) and DEL (127)>
 * OCTET         = <any 8-bit sequence of data>
 */
var paramRegExp = /; *([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *= *("(?:[ !\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u0020-\u007e])*"|[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) */g;
var textRegExp = /^[\u0020-\u007e\u0080-\u00ff]+$/
var tokenRegExp = /^[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+$/

/**
 * RegExp to match quoted-pair in RFC 2616
 *
 * quoted-pair = "\" CHAR
 * CHAR        = <any US-ASCII character (octets 0 - 127)>
 */
var qescRegExp = /\\([\u0000-\u007f])/g;

/**
 * RegExp to match chars that must be quoted-pair in RFC 2616
 */
var quoteRegExp = /([\\"])/g;

/**
 * RegExp to match type in RFC 6838
 *
 * type-name = restricted-name
 * subtype-name = restricted-name
 * restricted-name = restricted-name-first *126restricted-name-chars
 * restricted-name-first  = ALPHA / DIGIT
 * restricted-name-chars  = ALPHA / DIGIT / "!" / "#" /
 *                          "$" / "&" / "-" / "^" / "_"
 * restricted-name-chars =/ "." ; Characters before first dot always
 *                              ; specify a facet name
 * restricted-name-chars =/ "+" ; Characters after last plus always
 *                              ; specify a structured syntax suffix
 * ALPHA =  %x41-5A / %x61-7A   ; A-Z / a-z
 * DIGIT =  %x30-39             ; 0-9
 */
var subtypeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/
var typeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/
var typeRegExp = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;

/**
 * Module exports.
 */

exports.format = format
exports.parse = parse

/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @api public
 */

function format(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required')
  }

  var parameters = obj.parameters
  var subtype = obj.subtype
  var suffix = obj.suffix
  var type = obj.type

  if (!type || !typeNameRegExp.test(type)) {
    throw new TypeError('invalid type')
  }

  if (!subtype || !subtypeNameRegExp.test(subtype)) {
    throw new TypeError('invalid subtype')
  }

  // format as type/subtype
  var string = type + '/' + subtype

  // append +suffix
  if (suffix) {
    if (!typeNameRegExp.test(suffix)) {
      throw new TypeError('invalid suffix')
    }

    string += '+' + suffix
  }

  // append parameters
  if (parameters && typeof parameters === 'object') {
    var param
    var params = Object.keys(parameters).sort()

    for (var i = 0; i < params.length; i++) {
      param = params[i]

      if (!tokenRegExp.test(param)) {
        throw new TypeError('invalid parameter name')
      }

      string += '; ' + param + '=' + qstring(parameters[param])
    }
  }

  return string
}

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @api public
 */

function parse(string) {
  if (!string) {
    throw new TypeError('argument string is required')
  }

  // support req/res-like objects as argument
  if (typeof string === 'object') {
    string = getcontenttype(string)
  }

  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string')
  }

  var index = string.indexOf(';')
  var type = index !== -1
    ? string.substr(0, index)
    : string

  var key
  var match
  var obj = splitType(type)
  var params = {}
  var value

  paramRegExp.lastIndex = index

  while (match = paramRegExp.exec(string)) {
    if (match.index !== index) {
      throw new TypeError('invalid parameter format')
    }

    index += match[0].length
    key = match[1].toLowerCase()
    value = match[2]

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value
        .substr(1, value.length - 2)
        .replace(qescRegExp, '$1')
    }

    params[key] = value
  }

  if (index !== -1 && index !== string.length) {
    throw new TypeError('invalid parameter format')
  }

  obj.parameters = params

  return obj
}

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @api private
 */

function getcontenttype(obj) {
  if (typeof obj.getHeader === 'function') {
    // res-like
    return obj.getHeader('content-type')
  }

  if (typeof obj.headers === 'object') {
    // req-like
    return obj.headers && obj.headers['content-type']
  }
}

/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function qstring(val) {
  var str = String(val)

  // no need to quote tokens
  if (tokenRegExp.test(str)) {
    return str
  }

  if (str.length > 0 && !textRegExp.test(str)) {
    throw new TypeError('invalid parameter value')
  }

  return '"' + str.replace(quoteRegExp, '\\$1') + '"'
}

/**
 * Simply "type/subtype+siffx" into parts.
 *
 * @param {string} string
 * @return {Object}
 * @api private
 */

function splitType(string) {
  var match = typeRegExp.exec(string.toLowerCase())

  if (!match) {
    throw new TypeError('invalid media type')
  }

  var type = match[1]
  var subtype = match[2]
  var suffix

  // suffix after last +
  var index = subtype.lastIndexOf('+')
  if (index !== -1) {
    suffix = subtype.substr(index + 1)
    subtype = subtype.substr(0, index)
  }

  var obj = {
    type: type,
    subtype: subtype,
    suffix: suffix
  }

  return obj
}


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * merge-descriptors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = merge

/**
 * Module variables.
 * @private
 */

var hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Merge the property descriptors of `src` into `dest`
 *
 * @param {object} dest Object to add descriptors to
 * @param {object} src Object to clone descriptors from
 * @param {boolean} [redefine=true] Redefine `dest` properties with `src` properties
 * @returns {object} Reference to dest
 * @public
 */

function merge(dest, src, redefine) {
  if (!dest) {
    throw new TypeError('argument dest is required')
  }

  if (!src) {
    throw new TypeError('argument src is required')
  }

  if (redefine === undefined) {
    // Default to true
    redefine = true
  }

  Object.getOwnPropertyNames(src).forEach(function forEachOwnPropertyName(name) {
    if (!redefine && hasOwnProperty.call(dest, name)) {
      // Skip desriptor
      return
    }

    // Copy descriptor
    var descriptor = Object.getOwnPropertyDescriptor(src, name)
    Object.defineProperty(dest, name, descriptor)
  })

  return dest
}


/***/ }),
/* 219 */
/***/ (function(module, exports) {

module.exports = {
	"application/1d-interleaved-parityfec": {
		"source": "iana"
	},
	"application/3gpdash-qoe-report+xml": {
		"source": "iana"
	},
	"application/3gpp-ims+xml": {
		"source": "iana"
	},
	"application/a2l": {
		"source": "iana"
	},
	"application/activemessage": {
		"source": "iana"
	},
	"application/alto-costmap+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-costmapfilter+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-directory+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-endpointcost+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-endpointcostparams+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-endpointprop+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-endpointpropparams+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-error+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-networkmap+json": {
		"source": "iana",
		"compressible": true
	},
	"application/alto-networkmapfilter+json": {
		"source": "iana",
		"compressible": true
	},
	"application/aml": {
		"source": "iana"
	},
	"application/andrew-inset": {
		"source": "iana",
		"extensions": [
			"ez"
		]
	},
	"application/applefile": {
		"source": "iana"
	},
	"application/applixware": {
		"source": "apache",
		"extensions": [
			"aw"
		]
	},
	"application/atf": {
		"source": "iana"
	},
	"application/atfx": {
		"source": "iana"
	},
	"application/atom+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"atom"
		]
	},
	"application/atomcat+xml": {
		"source": "iana",
		"extensions": [
			"atomcat"
		]
	},
	"application/atomdeleted+xml": {
		"source": "iana"
	},
	"application/atomicmail": {
		"source": "iana"
	},
	"application/atomsvc+xml": {
		"source": "iana",
		"extensions": [
			"atomsvc"
		]
	},
	"application/atxml": {
		"source": "iana"
	},
	"application/auth-policy+xml": {
		"source": "iana"
	},
	"application/bacnet-xdd+zip": {
		"source": "iana"
	},
	"application/batch-smtp": {
		"source": "iana"
	},
	"application/bdoc": {
		"compressible": false,
		"extensions": [
			"bdoc"
		]
	},
	"application/beep+xml": {
		"source": "iana"
	},
	"application/calendar+json": {
		"source": "iana",
		"compressible": true
	},
	"application/calendar+xml": {
		"source": "iana"
	},
	"application/call-completion": {
		"source": "iana"
	},
	"application/cals-1840": {
		"source": "iana"
	},
	"application/cbor": {
		"source": "iana"
	},
	"application/ccmp+xml": {
		"source": "iana"
	},
	"application/ccxml+xml": {
		"source": "iana",
		"extensions": [
			"ccxml"
		]
	},
	"application/cdfx+xml": {
		"source": "iana"
	},
	"application/cdmi-capability": {
		"source": "iana",
		"extensions": [
			"cdmia"
		]
	},
	"application/cdmi-container": {
		"source": "iana",
		"extensions": [
			"cdmic"
		]
	},
	"application/cdmi-domain": {
		"source": "iana",
		"extensions": [
			"cdmid"
		]
	},
	"application/cdmi-object": {
		"source": "iana",
		"extensions": [
			"cdmio"
		]
	},
	"application/cdmi-queue": {
		"source": "iana",
		"extensions": [
			"cdmiq"
		]
	},
	"application/cdni": {
		"source": "iana"
	},
	"application/cea": {
		"source": "iana"
	},
	"application/cea-2018+xml": {
		"source": "iana"
	},
	"application/cellml+xml": {
		"source": "iana"
	},
	"application/cfw": {
		"source": "iana"
	},
	"application/clue_info+xml": {
		"source": "iana"
	},
	"application/cms": {
		"source": "iana"
	},
	"application/cnrp+xml": {
		"source": "iana"
	},
	"application/coap-group+json": {
		"source": "iana",
		"compressible": true
	},
	"application/coap-payload": {
		"source": "iana"
	},
	"application/commonground": {
		"source": "iana"
	},
	"application/conference-info+xml": {
		"source": "iana"
	},
	"application/cose": {
		"source": "iana"
	},
	"application/cose-key": {
		"source": "iana"
	},
	"application/cose-key-set": {
		"source": "iana"
	},
	"application/cpl+xml": {
		"source": "iana"
	},
	"application/csrattrs": {
		"source": "iana"
	},
	"application/csta+xml": {
		"source": "iana"
	},
	"application/cstadata+xml": {
		"source": "iana"
	},
	"application/csvm+json": {
		"source": "iana",
		"compressible": true
	},
	"application/cu-seeme": {
		"source": "apache",
		"extensions": [
			"cu"
		]
	},
	"application/cybercash": {
		"source": "iana"
	},
	"application/dart": {
		"compressible": true
	},
	"application/dash+xml": {
		"source": "iana",
		"extensions": [
			"mpd"
		]
	},
	"application/dashdelta": {
		"source": "iana"
	},
	"application/davmount+xml": {
		"source": "iana",
		"extensions": [
			"davmount"
		]
	},
	"application/dca-rft": {
		"source": "iana"
	},
	"application/dcd": {
		"source": "iana"
	},
	"application/dec-dx": {
		"source": "iana"
	},
	"application/dialog-info+xml": {
		"source": "iana"
	},
	"application/dicom": {
		"source": "iana"
	},
	"application/dicom+json": {
		"source": "iana",
		"compressible": true
	},
	"application/dicom+xml": {
		"source": "iana"
	},
	"application/dii": {
		"source": "iana"
	},
	"application/dit": {
		"source": "iana"
	},
	"application/dns": {
		"source": "iana"
	},
	"application/docbook+xml": {
		"source": "apache",
		"extensions": [
			"dbk"
		]
	},
	"application/dskpp+xml": {
		"source": "iana"
	},
	"application/dssc+der": {
		"source": "iana",
		"extensions": [
			"dssc"
		]
	},
	"application/dssc+xml": {
		"source": "iana",
		"extensions": [
			"xdssc"
		]
	},
	"application/dvcs": {
		"source": "iana"
	},
	"application/ecmascript": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"ecma"
		]
	},
	"application/edi-consent": {
		"source": "iana"
	},
	"application/edi-x12": {
		"source": "iana",
		"compressible": false
	},
	"application/edifact": {
		"source": "iana",
		"compressible": false
	},
	"application/efi": {
		"source": "iana"
	},
	"application/emergencycalldata.comment+xml": {
		"source": "iana"
	},
	"application/emergencycalldata.control+xml": {
		"source": "iana"
	},
	"application/emergencycalldata.deviceinfo+xml": {
		"source": "iana"
	},
	"application/emergencycalldata.ecall.msd": {
		"source": "iana"
	},
	"application/emergencycalldata.providerinfo+xml": {
		"source": "iana"
	},
	"application/emergencycalldata.serviceinfo+xml": {
		"source": "iana"
	},
	"application/emergencycalldata.subscriberinfo+xml": {
		"source": "iana"
	},
	"application/emergencycalldata.veds+xml": {
		"source": "iana"
	},
	"application/emma+xml": {
		"source": "iana",
		"extensions": [
			"emma"
		]
	},
	"application/emotionml+xml": {
		"source": "iana"
	},
	"application/encaprtp": {
		"source": "iana"
	},
	"application/epp+xml": {
		"source": "iana"
	},
	"application/epub+zip": {
		"source": "iana",
		"extensions": [
			"epub"
		]
	},
	"application/eshop": {
		"source": "iana"
	},
	"application/exi": {
		"source": "iana",
		"extensions": [
			"exi"
		]
	},
	"application/fastinfoset": {
		"source": "iana"
	},
	"application/fastsoap": {
		"source": "iana"
	},
	"application/fdt+xml": {
		"source": "iana"
	},
	"application/fits": {
		"source": "iana"
	},
	"application/font-sfnt": {
		"source": "iana"
	},
	"application/font-tdpfr": {
		"source": "iana",
		"extensions": [
			"pfr"
		]
	},
	"application/font-woff": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"woff"
		]
	},
	"application/font-woff2": {
		"compressible": false,
		"extensions": [
			"woff2"
		]
	},
	"application/framework-attributes+xml": {
		"source": "iana"
	},
	"application/geo+json": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"geojson"
		]
	},
	"application/geo+json-seq": {
		"source": "iana"
	},
	"application/gml+xml": {
		"source": "iana",
		"extensions": [
			"gml"
		]
	},
	"application/gpx+xml": {
		"source": "apache",
		"extensions": [
			"gpx"
		]
	},
	"application/gxf": {
		"source": "apache",
		"extensions": [
			"gxf"
		]
	},
	"application/gzip": {
		"source": "iana",
		"compressible": false
	},
	"application/h224": {
		"source": "iana"
	},
	"application/held+xml": {
		"source": "iana"
	},
	"application/http": {
		"source": "iana"
	},
	"application/hyperstudio": {
		"source": "iana",
		"extensions": [
			"stk"
		]
	},
	"application/ibe-key-request+xml": {
		"source": "iana"
	},
	"application/ibe-pkg-reply+xml": {
		"source": "iana"
	},
	"application/ibe-pp-data": {
		"source": "iana"
	},
	"application/iges": {
		"source": "iana"
	},
	"application/im-iscomposing+xml": {
		"source": "iana"
	},
	"application/index": {
		"source": "iana"
	},
	"application/index.cmd": {
		"source": "iana"
	},
	"application/index.obj": {
		"source": "iana"
	},
	"application/index.response": {
		"source": "iana"
	},
	"application/index.vnd": {
		"source": "iana"
	},
	"application/inkml+xml": {
		"source": "iana",
		"extensions": [
			"ink",
			"inkml"
		]
	},
	"application/iotp": {
		"source": "iana"
	},
	"application/ipfix": {
		"source": "iana",
		"extensions": [
			"ipfix"
		]
	},
	"application/ipp": {
		"source": "iana"
	},
	"application/isup": {
		"source": "iana"
	},
	"application/its+xml": {
		"source": "iana"
	},
	"application/java-archive": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"jar",
			"war",
			"ear"
		]
	},
	"application/java-serialized-object": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"ser"
		]
	},
	"application/java-vm": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"class"
		]
	},
	"application/javascript": {
		"source": "iana",
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"js"
		]
	},
	"application/jose": {
		"source": "iana"
	},
	"application/jose+json": {
		"source": "iana",
		"compressible": true
	},
	"application/jrd+json": {
		"source": "iana",
		"compressible": true
	},
	"application/json": {
		"source": "iana",
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"json",
			"map"
		]
	},
	"application/json-patch+json": {
		"source": "iana",
		"compressible": true
	},
	"application/json-seq": {
		"source": "iana"
	},
	"application/json5": {
		"extensions": [
			"json5"
		]
	},
	"application/jsonml+json": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"jsonml"
		]
	},
	"application/jwk+json": {
		"source": "iana",
		"compressible": true
	},
	"application/jwk-set+json": {
		"source": "iana",
		"compressible": true
	},
	"application/jwt": {
		"source": "iana"
	},
	"application/kpml-request+xml": {
		"source": "iana"
	},
	"application/kpml-response+xml": {
		"source": "iana"
	},
	"application/ld+json": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"jsonld"
		]
	},
	"application/lgr+xml": {
		"source": "iana"
	},
	"application/link-format": {
		"source": "iana"
	},
	"application/load-control+xml": {
		"source": "iana"
	},
	"application/lost+xml": {
		"source": "iana",
		"extensions": [
			"lostxml"
		]
	},
	"application/lostsync+xml": {
		"source": "iana"
	},
	"application/lxf": {
		"source": "iana"
	},
	"application/mac-binhex40": {
		"source": "iana",
		"extensions": [
			"hqx"
		]
	},
	"application/mac-compactpro": {
		"source": "apache",
		"extensions": [
			"cpt"
		]
	},
	"application/macwriteii": {
		"source": "iana"
	},
	"application/mads+xml": {
		"source": "iana",
		"extensions": [
			"mads"
		]
	},
	"application/manifest+json": {
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"webmanifest"
		]
	},
	"application/marc": {
		"source": "iana",
		"extensions": [
			"mrc"
		]
	},
	"application/marcxml+xml": {
		"source": "iana",
		"extensions": [
			"mrcx"
		]
	},
	"application/mathematica": {
		"source": "iana",
		"extensions": [
			"ma",
			"nb",
			"mb"
		]
	},
	"application/mathml+xml": {
		"source": "iana",
		"extensions": [
			"mathml"
		]
	},
	"application/mathml-content+xml": {
		"source": "iana"
	},
	"application/mathml-presentation+xml": {
		"source": "iana"
	},
	"application/mbms-associated-procedure-description+xml": {
		"source": "iana"
	},
	"application/mbms-deregister+xml": {
		"source": "iana"
	},
	"application/mbms-envelope+xml": {
		"source": "iana"
	},
	"application/mbms-msk+xml": {
		"source": "iana"
	},
	"application/mbms-msk-response+xml": {
		"source": "iana"
	},
	"application/mbms-protection-description+xml": {
		"source": "iana"
	},
	"application/mbms-reception-report+xml": {
		"source": "iana"
	},
	"application/mbms-register+xml": {
		"source": "iana"
	},
	"application/mbms-register-response+xml": {
		"source": "iana"
	},
	"application/mbms-schedule+xml": {
		"source": "iana"
	},
	"application/mbms-user-service-description+xml": {
		"source": "iana"
	},
	"application/mbox": {
		"source": "iana",
		"extensions": [
			"mbox"
		]
	},
	"application/media-policy-dataset+xml": {
		"source": "iana"
	},
	"application/media_control+xml": {
		"source": "iana"
	},
	"application/mediaservercontrol+xml": {
		"source": "iana",
		"extensions": [
			"mscml"
		]
	},
	"application/merge-patch+json": {
		"source": "iana",
		"compressible": true
	},
	"application/metalink+xml": {
		"source": "apache",
		"extensions": [
			"metalink"
		]
	},
	"application/metalink4+xml": {
		"source": "iana",
		"extensions": [
			"meta4"
		]
	},
	"application/mets+xml": {
		"source": "iana",
		"extensions": [
			"mets"
		]
	},
	"application/mf4": {
		"source": "iana"
	},
	"application/mikey": {
		"source": "iana"
	},
	"application/mods+xml": {
		"source": "iana",
		"extensions": [
			"mods"
		]
	},
	"application/moss-keys": {
		"source": "iana"
	},
	"application/moss-signature": {
		"source": "iana"
	},
	"application/mosskey-data": {
		"source": "iana"
	},
	"application/mosskey-request": {
		"source": "iana"
	},
	"application/mp21": {
		"source": "iana",
		"extensions": [
			"m21",
			"mp21"
		]
	},
	"application/mp4": {
		"source": "iana",
		"extensions": [
			"mp4s",
			"m4p"
		]
	},
	"application/mpeg4-generic": {
		"source": "iana"
	},
	"application/mpeg4-iod": {
		"source": "iana"
	},
	"application/mpeg4-iod-xmt": {
		"source": "iana"
	},
	"application/mrb-consumer+xml": {
		"source": "iana"
	},
	"application/mrb-publish+xml": {
		"source": "iana"
	},
	"application/msc-ivr+xml": {
		"source": "iana"
	},
	"application/msc-mixer+xml": {
		"source": "iana"
	},
	"application/msword": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"doc",
			"dot"
		]
	},
	"application/mud+json": {
		"source": "iana",
		"compressible": true
	},
	"application/mxf": {
		"source": "iana",
		"extensions": [
			"mxf"
		]
	},
	"application/n-quads": {
		"source": "iana"
	},
	"application/n-triples": {
		"source": "iana"
	},
	"application/nasdata": {
		"source": "iana"
	},
	"application/news-checkgroups": {
		"source": "iana"
	},
	"application/news-groupinfo": {
		"source": "iana"
	},
	"application/news-transmission": {
		"source": "iana"
	},
	"application/nlsml+xml": {
		"source": "iana"
	},
	"application/nss": {
		"source": "iana"
	},
	"application/ocsp-request": {
		"source": "iana"
	},
	"application/ocsp-response": {
		"source": "iana"
	},
	"application/octet-stream": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"bin",
			"dms",
			"lrf",
			"mar",
			"so",
			"dist",
			"distz",
			"pkg",
			"bpk",
			"dump",
			"elc",
			"deploy",
			"exe",
			"dll",
			"deb",
			"dmg",
			"iso",
			"img",
			"msi",
			"msp",
			"msm",
			"buffer"
		]
	},
	"application/oda": {
		"source": "iana",
		"extensions": [
			"oda"
		]
	},
	"application/odx": {
		"source": "iana"
	},
	"application/oebps-package+xml": {
		"source": "iana",
		"extensions": [
			"opf"
		]
	},
	"application/ogg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"ogx"
		]
	},
	"application/omdoc+xml": {
		"source": "apache",
		"extensions": [
			"omdoc"
		]
	},
	"application/onenote": {
		"source": "apache",
		"extensions": [
			"onetoc",
			"onetoc2",
			"onetmp",
			"onepkg"
		]
	},
	"application/oxps": {
		"source": "iana",
		"extensions": [
			"oxps"
		]
	},
	"application/p2p-overlay+xml": {
		"source": "iana"
	},
	"application/parityfec": {
		"source": "iana"
	},
	"application/patch-ops-error+xml": {
		"source": "iana",
		"extensions": [
			"xer"
		]
	},
	"application/pdf": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"pdf"
		]
	},
	"application/pdx": {
		"source": "iana"
	},
	"application/pgp-encrypted": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"pgp"
		]
	},
	"application/pgp-keys": {
		"source": "iana"
	},
	"application/pgp-signature": {
		"source": "iana",
		"extensions": [
			"asc",
			"sig"
		]
	},
	"application/pics-rules": {
		"source": "apache",
		"extensions": [
			"prf"
		]
	},
	"application/pidf+xml": {
		"source": "iana"
	},
	"application/pidf-diff+xml": {
		"source": "iana"
	},
	"application/pkcs10": {
		"source": "iana",
		"extensions": [
			"p10"
		]
	},
	"application/pkcs12": {
		"source": "iana"
	},
	"application/pkcs7-mime": {
		"source": "iana",
		"extensions": [
			"p7m",
			"p7c"
		]
	},
	"application/pkcs7-signature": {
		"source": "iana",
		"extensions": [
			"p7s"
		]
	},
	"application/pkcs8": {
		"source": "iana",
		"extensions": [
			"p8"
		]
	},
	"application/pkix-attr-cert": {
		"source": "iana",
		"extensions": [
			"ac"
		]
	},
	"application/pkix-cert": {
		"source": "iana",
		"extensions": [
			"cer"
		]
	},
	"application/pkix-crl": {
		"source": "iana",
		"extensions": [
			"crl"
		]
	},
	"application/pkix-pkipath": {
		"source": "iana",
		"extensions": [
			"pkipath"
		]
	},
	"application/pkixcmp": {
		"source": "iana",
		"extensions": [
			"pki"
		]
	},
	"application/pls+xml": {
		"source": "iana",
		"extensions": [
			"pls"
		]
	},
	"application/poc-settings+xml": {
		"source": "iana"
	},
	"application/postscript": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"ai",
			"eps",
			"ps"
		]
	},
	"application/ppsp-tracker+json": {
		"source": "iana",
		"compressible": true
	},
	"application/problem+json": {
		"source": "iana",
		"compressible": true
	},
	"application/problem+xml": {
		"source": "iana"
	},
	"application/provenance+xml": {
		"source": "iana"
	},
	"application/prs.alvestrand.titrax-sheet": {
		"source": "iana"
	},
	"application/prs.cww": {
		"source": "iana",
		"extensions": [
			"cww"
		]
	},
	"application/prs.hpub+zip": {
		"source": "iana"
	},
	"application/prs.nprend": {
		"source": "iana"
	},
	"application/prs.plucker": {
		"source": "iana"
	},
	"application/prs.rdf-xml-crypt": {
		"source": "iana"
	},
	"application/prs.xsf+xml": {
		"source": "iana"
	},
	"application/pskc+xml": {
		"source": "iana",
		"extensions": [
			"pskcxml"
		]
	},
	"application/qsig": {
		"source": "iana"
	},
	"application/raptorfec": {
		"source": "iana"
	},
	"application/rdap+json": {
		"source": "iana",
		"compressible": true
	},
	"application/rdf+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"rdf"
		]
	},
	"application/reginfo+xml": {
		"source": "iana",
		"extensions": [
			"rif"
		]
	},
	"application/relax-ng-compact-syntax": {
		"source": "iana",
		"extensions": [
			"rnc"
		]
	},
	"application/remote-printing": {
		"source": "iana"
	},
	"application/reputon+json": {
		"source": "iana",
		"compressible": true
	},
	"application/resource-lists+xml": {
		"source": "iana",
		"extensions": [
			"rl"
		]
	},
	"application/resource-lists-diff+xml": {
		"source": "iana",
		"extensions": [
			"rld"
		]
	},
	"application/rfc+xml": {
		"source": "iana"
	},
	"application/riscos": {
		"source": "iana"
	},
	"application/rlmi+xml": {
		"source": "iana"
	},
	"application/rls-services+xml": {
		"source": "iana",
		"extensions": [
			"rs"
		]
	},
	"application/rpki-ghostbusters": {
		"source": "iana",
		"extensions": [
			"gbr"
		]
	},
	"application/rpki-manifest": {
		"source": "iana",
		"extensions": [
			"mft"
		]
	},
	"application/rpki-roa": {
		"source": "iana",
		"extensions": [
			"roa"
		]
	},
	"application/rpki-updown": {
		"source": "iana"
	},
	"application/rsd+xml": {
		"source": "apache",
		"extensions": [
			"rsd"
		]
	},
	"application/rss+xml": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"rss"
		]
	},
	"application/rtf": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"rtf"
		]
	},
	"application/rtploopback": {
		"source": "iana"
	},
	"application/rtx": {
		"source": "iana"
	},
	"application/samlassertion+xml": {
		"source": "iana"
	},
	"application/samlmetadata+xml": {
		"source": "iana"
	},
	"application/sbml+xml": {
		"source": "iana",
		"extensions": [
			"sbml"
		]
	},
	"application/scaip+xml": {
		"source": "iana"
	},
	"application/scim+json": {
		"source": "iana",
		"compressible": true
	},
	"application/scvp-cv-request": {
		"source": "iana",
		"extensions": [
			"scq"
		]
	},
	"application/scvp-cv-response": {
		"source": "iana",
		"extensions": [
			"scs"
		]
	},
	"application/scvp-vp-request": {
		"source": "iana",
		"extensions": [
			"spq"
		]
	},
	"application/scvp-vp-response": {
		"source": "iana",
		"extensions": [
			"spp"
		]
	},
	"application/sdp": {
		"source": "iana",
		"extensions": [
			"sdp"
		]
	},
	"application/sep+xml": {
		"source": "iana"
	},
	"application/sep-exi": {
		"source": "iana"
	},
	"application/session-info": {
		"source": "iana"
	},
	"application/set-payment": {
		"source": "iana"
	},
	"application/set-payment-initiation": {
		"source": "iana",
		"extensions": [
			"setpay"
		]
	},
	"application/set-registration": {
		"source": "iana"
	},
	"application/set-registration-initiation": {
		"source": "iana",
		"extensions": [
			"setreg"
		]
	},
	"application/sgml": {
		"source": "iana"
	},
	"application/sgml-open-catalog": {
		"source": "iana"
	},
	"application/shf+xml": {
		"source": "iana",
		"extensions": [
			"shf"
		]
	},
	"application/sieve": {
		"source": "iana"
	},
	"application/simple-filter+xml": {
		"source": "iana"
	},
	"application/simple-message-summary": {
		"source": "iana"
	},
	"application/simplesymbolcontainer": {
		"source": "iana"
	},
	"application/slate": {
		"source": "iana"
	},
	"application/smil": {
		"source": "iana"
	},
	"application/smil+xml": {
		"source": "iana",
		"extensions": [
			"smi",
			"smil"
		]
	},
	"application/smpte336m": {
		"source": "iana"
	},
	"application/soap+fastinfoset": {
		"source": "iana"
	},
	"application/soap+xml": {
		"source": "iana",
		"compressible": true
	},
	"application/sparql-query": {
		"source": "iana",
		"extensions": [
			"rq"
		]
	},
	"application/sparql-results+xml": {
		"source": "iana",
		"extensions": [
			"srx"
		]
	},
	"application/spirits-event+xml": {
		"source": "iana"
	},
	"application/sql": {
		"source": "iana"
	},
	"application/srgs": {
		"source": "iana",
		"extensions": [
			"gram"
		]
	},
	"application/srgs+xml": {
		"source": "iana",
		"extensions": [
			"grxml"
		]
	},
	"application/sru+xml": {
		"source": "iana",
		"extensions": [
			"sru"
		]
	},
	"application/ssdl+xml": {
		"source": "apache",
		"extensions": [
			"ssdl"
		]
	},
	"application/ssml+xml": {
		"source": "iana",
		"extensions": [
			"ssml"
		]
	},
	"application/tamp-apex-update": {
		"source": "iana"
	},
	"application/tamp-apex-update-confirm": {
		"source": "iana"
	},
	"application/tamp-community-update": {
		"source": "iana"
	},
	"application/tamp-community-update-confirm": {
		"source": "iana"
	},
	"application/tamp-error": {
		"source": "iana"
	},
	"application/tamp-sequence-adjust": {
		"source": "iana"
	},
	"application/tamp-sequence-adjust-confirm": {
		"source": "iana"
	},
	"application/tamp-status-query": {
		"source": "iana"
	},
	"application/tamp-status-response": {
		"source": "iana"
	},
	"application/tamp-update": {
		"source": "iana"
	},
	"application/tamp-update-confirm": {
		"source": "iana"
	},
	"application/tar": {
		"compressible": true
	},
	"application/tei+xml": {
		"source": "iana",
		"extensions": [
			"tei",
			"teicorpus"
		]
	},
	"application/thraud+xml": {
		"source": "iana",
		"extensions": [
			"tfi"
		]
	},
	"application/timestamp-query": {
		"source": "iana"
	},
	"application/timestamp-reply": {
		"source": "iana"
	},
	"application/timestamped-data": {
		"source": "iana",
		"extensions": [
			"tsd"
		]
	},
	"application/trig": {
		"source": "iana"
	},
	"application/ttml+xml": {
		"source": "iana"
	},
	"application/tve-trigger": {
		"source": "iana"
	},
	"application/ulpfec": {
		"source": "iana"
	},
	"application/urc-grpsheet+xml": {
		"source": "iana"
	},
	"application/urc-ressheet+xml": {
		"source": "iana"
	},
	"application/urc-targetdesc+xml": {
		"source": "iana"
	},
	"application/urc-uisocketdesc+xml": {
		"source": "iana"
	},
	"application/vcard+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vcard+xml": {
		"source": "iana"
	},
	"application/vemmi": {
		"source": "iana"
	},
	"application/vividence.scriptfile": {
		"source": "apache"
	},
	"application/vnd.3gpp-prose+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp-prose-pc3ch+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.access-transfer-events+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.bsf+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.mid-call+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.pic-bw-large": {
		"source": "iana",
		"extensions": [
			"plb"
		]
	},
	"application/vnd.3gpp.pic-bw-small": {
		"source": "iana",
		"extensions": [
			"psb"
		]
	},
	"application/vnd.3gpp.pic-bw-var": {
		"source": "iana",
		"extensions": [
			"pvb"
		]
	},
	"application/vnd.3gpp.sms": {
		"source": "iana"
	},
	"application/vnd.3gpp.sms+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.srvcc-ext+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.srvcc-info+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.state-and-event-info+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp.ussd+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp2.bcmcsinfo+xml": {
		"source": "iana"
	},
	"application/vnd.3gpp2.sms": {
		"source": "iana"
	},
	"application/vnd.3gpp2.tcap": {
		"source": "iana",
		"extensions": [
			"tcap"
		]
	},
	"application/vnd.3lightssoftware.imagescal": {
		"source": "iana"
	},
	"application/vnd.3m.post-it-notes": {
		"source": "iana",
		"extensions": [
			"pwn"
		]
	},
	"application/vnd.accpac.simply.aso": {
		"source": "iana",
		"extensions": [
			"aso"
		]
	},
	"application/vnd.accpac.simply.imp": {
		"source": "iana",
		"extensions": [
			"imp"
		]
	},
	"application/vnd.acucobol": {
		"source": "iana",
		"extensions": [
			"acu"
		]
	},
	"application/vnd.acucorp": {
		"source": "iana",
		"extensions": [
			"atc",
			"acutc"
		]
	},
	"application/vnd.adobe.air-application-installer-package+zip": {
		"source": "apache",
		"extensions": [
			"air"
		]
	},
	"application/vnd.adobe.flash.movie": {
		"source": "iana"
	},
	"application/vnd.adobe.formscentral.fcdt": {
		"source": "iana",
		"extensions": [
			"fcdt"
		]
	},
	"application/vnd.adobe.fxp": {
		"source": "iana",
		"extensions": [
			"fxp",
			"fxpl"
		]
	},
	"application/vnd.adobe.partial-upload": {
		"source": "iana"
	},
	"application/vnd.adobe.xdp+xml": {
		"source": "iana",
		"extensions": [
			"xdp"
		]
	},
	"application/vnd.adobe.xfdf": {
		"source": "iana",
		"extensions": [
			"xfdf"
		]
	},
	"application/vnd.aether.imp": {
		"source": "iana"
	},
	"application/vnd.ah-barcode": {
		"source": "iana"
	},
	"application/vnd.ahead.space": {
		"source": "iana",
		"extensions": [
			"ahead"
		]
	},
	"application/vnd.airzip.filesecure.azf": {
		"source": "iana",
		"extensions": [
			"azf"
		]
	},
	"application/vnd.airzip.filesecure.azs": {
		"source": "iana",
		"extensions": [
			"azs"
		]
	},
	"application/vnd.amazon.ebook": {
		"source": "apache",
		"extensions": [
			"azw"
		]
	},
	"application/vnd.amazon.mobi8-ebook": {
		"source": "iana"
	},
	"application/vnd.americandynamics.acc": {
		"source": "iana",
		"extensions": [
			"acc"
		]
	},
	"application/vnd.amiga.ami": {
		"source": "iana",
		"extensions": [
			"ami"
		]
	},
	"application/vnd.amundsen.maze+xml": {
		"source": "iana"
	},
	"application/vnd.android.package-archive": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"apk"
		]
	},
	"application/vnd.anki": {
		"source": "iana"
	},
	"application/vnd.anser-web-certificate-issue-initiation": {
		"source": "iana",
		"extensions": [
			"cii"
		]
	},
	"application/vnd.anser-web-funds-transfer-initiation": {
		"source": "apache",
		"extensions": [
			"fti"
		]
	},
	"application/vnd.antix.game-component": {
		"source": "iana",
		"extensions": [
			"atx"
		]
	},
	"application/vnd.apache.thrift.binary": {
		"source": "iana"
	},
	"application/vnd.apache.thrift.compact": {
		"source": "iana"
	},
	"application/vnd.apache.thrift.json": {
		"source": "iana"
	},
	"application/vnd.api+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.apothekende.reservation+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.apple.installer+xml": {
		"source": "iana",
		"extensions": [
			"mpkg"
		]
	},
	"application/vnd.apple.mpegurl": {
		"source": "iana",
		"extensions": [
			"m3u8"
		]
	},
	"application/vnd.apple.pkpass": {
		"compressible": false,
		"extensions": [
			"pkpass"
		]
	},
	"application/vnd.arastra.swi": {
		"source": "iana"
	},
	"application/vnd.aristanetworks.swi": {
		"source": "iana",
		"extensions": [
			"swi"
		]
	},
	"application/vnd.artsquare": {
		"source": "iana"
	},
	"application/vnd.astraea-software.iota": {
		"source": "iana",
		"extensions": [
			"iota"
		]
	},
	"application/vnd.audiograph": {
		"source": "iana",
		"extensions": [
			"aep"
		]
	},
	"application/vnd.autopackage": {
		"source": "iana"
	},
	"application/vnd.avistar+xml": {
		"source": "iana"
	},
	"application/vnd.balsamiq.bmml+xml": {
		"source": "iana"
	},
	"application/vnd.balsamiq.bmpr": {
		"source": "iana"
	},
	"application/vnd.bekitzur-stech+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.biopax.rdf+xml": {
		"source": "iana"
	},
	"application/vnd.blueice.multipass": {
		"source": "iana",
		"extensions": [
			"mpm"
		]
	},
	"application/vnd.bluetooth.ep.oob": {
		"source": "iana"
	},
	"application/vnd.bluetooth.le.oob": {
		"source": "iana"
	},
	"application/vnd.bmi": {
		"source": "iana",
		"extensions": [
			"bmi"
		]
	},
	"application/vnd.businessobjects": {
		"source": "iana",
		"extensions": [
			"rep"
		]
	},
	"application/vnd.cab-jscript": {
		"source": "iana"
	},
	"application/vnd.canon-cpdl": {
		"source": "iana"
	},
	"application/vnd.canon-lips": {
		"source": "iana"
	},
	"application/vnd.cendio.thinlinc.clientconf": {
		"source": "iana"
	},
	"application/vnd.century-systems.tcp_stream": {
		"source": "iana"
	},
	"application/vnd.chemdraw+xml": {
		"source": "iana",
		"extensions": [
			"cdxml"
		]
	},
	"application/vnd.chess-pgn": {
		"source": "iana"
	},
	"application/vnd.chipnuts.karaoke-mmd": {
		"source": "iana",
		"extensions": [
			"mmd"
		]
	},
	"application/vnd.cinderella": {
		"source": "iana",
		"extensions": [
			"cdy"
		]
	},
	"application/vnd.cirpack.isdn-ext": {
		"source": "iana"
	},
	"application/vnd.citationstyles.style+xml": {
		"source": "iana"
	},
	"application/vnd.claymore": {
		"source": "iana",
		"extensions": [
			"cla"
		]
	},
	"application/vnd.cloanto.rp9": {
		"source": "iana",
		"extensions": [
			"rp9"
		]
	},
	"application/vnd.clonk.c4group": {
		"source": "iana",
		"extensions": [
			"c4g",
			"c4d",
			"c4f",
			"c4p",
			"c4u"
		]
	},
	"application/vnd.cluetrust.cartomobile-config": {
		"source": "iana",
		"extensions": [
			"c11amc"
		]
	},
	"application/vnd.cluetrust.cartomobile-config-pkg": {
		"source": "iana",
		"extensions": [
			"c11amz"
		]
	},
	"application/vnd.coffeescript": {
		"source": "iana"
	},
	"application/vnd.collection+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.collection.doc+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.collection.next+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.comicbook+zip": {
		"source": "iana"
	},
	"application/vnd.commerce-battelle": {
		"source": "iana"
	},
	"application/vnd.commonspace": {
		"source": "iana",
		"extensions": [
			"csp"
		]
	},
	"application/vnd.contact.cmsg": {
		"source": "iana",
		"extensions": [
			"cdbcmsg"
		]
	},
	"application/vnd.coreos.ignition+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.cosmocaller": {
		"source": "iana",
		"extensions": [
			"cmc"
		]
	},
	"application/vnd.crick.clicker": {
		"source": "iana",
		"extensions": [
			"clkx"
		]
	},
	"application/vnd.crick.clicker.keyboard": {
		"source": "iana",
		"extensions": [
			"clkk"
		]
	},
	"application/vnd.crick.clicker.palette": {
		"source": "iana",
		"extensions": [
			"clkp"
		]
	},
	"application/vnd.crick.clicker.template": {
		"source": "iana",
		"extensions": [
			"clkt"
		]
	},
	"application/vnd.crick.clicker.wordbank": {
		"source": "iana",
		"extensions": [
			"clkw"
		]
	},
	"application/vnd.criticaltools.wbs+xml": {
		"source": "iana",
		"extensions": [
			"wbs"
		]
	},
	"application/vnd.ctc-posml": {
		"source": "iana",
		"extensions": [
			"pml"
		]
	},
	"application/vnd.ctct.ws+xml": {
		"source": "iana"
	},
	"application/vnd.cups-pdf": {
		"source": "iana"
	},
	"application/vnd.cups-postscript": {
		"source": "iana"
	},
	"application/vnd.cups-ppd": {
		"source": "iana",
		"extensions": [
			"ppd"
		]
	},
	"application/vnd.cups-raster": {
		"source": "iana"
	},
	"application/vnd.cups-raw": {
		"source": "iana"
	},
	"application/vnd.curl": {
		"source": "iana"
	},
	"application/vnd.curl.car": {
		"source": "apache",
		"extensions": [
			"car"
		]
	},
	"application/vnd.curl.pcurl": {
		"source": "apache",
		"extensions": [
			"pcurl"
		]
	},
	"application/vnd.cyan.dean.root+xml": {
		"source": "iana"
	},
	"application/vnd.cybank": {
		"source": "iana"
	},
	"application/vnd.d2l.coursepackage1p0+zip": {
		"source": "iana"
	},
	"application/vnd.dart": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"dart"
		]
	},
	"application/vnd.data-vision.rdz": {
		"source": "iana",
		"extensions": [
			"rdz"
		]
	},
	"application/vnd.dataresource+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.debian.binary-package": {
		"source": "iana"
	},
	"application/vnd.dece.data": {
		"source": "iana",
		"extensions": [
			"uvf",
			"uvvf",
			"uvd",
			"uvvd"
		]
	},
	"application/vnd.dece.ttml+xml": {
		"source": "iana",
		"extensions": [
			"uvt",
			"uvvt"
		]
	},
	"application/vnd.dece.unspecified": {
		"source": "iana",
		"extensions": [
			"uvx",
			"uvvx"
		]
	},
	"application/vnd.dece.zip": {
		"source": "iana",
		"extensions": [
			"uvz",
			"uvvz"
		]
	},
	"application/vnd.denovo.fcselayout-link": {
		"source": "iana",
		"extensions": [
			"fe_launch"
		]
	},
	"application/vnd.desmume-movie": {
		"source": "iana"
	},
	"application/vnd.desmume.movie": {
		"source": "apache"
	},
	"application/vnd.dir-bi.plate-dl-nosuffix": {
		"source": "iana"
	},
	"application/vnd.dm.delegation+xml": {
		"source": "iana"
	},
	"application/vnd.dna": {
		"source": "iana",
		"extensions": [
			"dna"
		]
	},
	"application/vnd.document+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.dolby.mlp": {
		"source": "apache",
		"extensions": [
			"mlp"
		]
	},
	"application/vnd.dolby.mobile.1": {
		"source": "iana"
	},
	"application/vnd.dolby.mobile.2": {
		"source": "iana"
	},
	"application/vnd.doremir.scorecloud-binary-document": {
		"source": "iana"
	},
	"application/vnd.dpgraph": {
		"source": "iana",
		"extensions": [
			"dpg"
		]
	},
	"application/vnd.dreamfactory": {
		"source": "iana",
		"extensions": [
			"dfac"
		]
	},
	"application/vnd.drive+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.ds-keypoint": {
		"source": "apache",
		"extensions": [
			"kpxx"
		]
	},
	"application/vnd.dtg.local": {
		"source": "iana"
	},
	"application/vnd.dtg.local.flash": {
		"source": "iana"
	},
	"application/vnd.dtg.local.html": {
		"source": "iana"
	},
	"application/vnd.dvb.ait": {
		"source": "iana",
		"extensions": [
			"ait"
		]
	},
	"application/vnd.dvb.dvbj": {
		"source": "iana"
	},
	"application/vnd.dvb.esgcontainer": {
		"source": "iana"
	},
	"application/vnd.dvb.ipdcdftnotifaccess": {
		"source": "iana"
	},
	"application/vnd.dvb.ipdcesgaccess": {
		"source": "iana"
	},
	"application/vnd.dvb.ipdcesgaccess2": {
		"source": "iana"
	},
	"application/vnd.dvb.ipdcesgpdd": {
		"source": "iana"
	},
	"application/vnd.dvb.ipdcroaming": {
		"source": "iana"
	},
	"application/vnd.dvb.iptv.alfec-base": {
		"source": "iana"
	},
	"application/vnd.dvb.iptv.alfec-enhancement": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-aggregate-root+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-container+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-generic+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-ia-msglist+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-ia-registration-request+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-ia-registration-response+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.notif-init+xml": {
		"source": "iana"
	},
	"application/vnd.dvb.pfr": {
		"source": "iana"
	},
	"application/vnd.dvb.service": {
		"source": "iana",
		"extensions": [
			"svc"
		]
	},
	"application/vnd.dxr": {
		"source": "iana"
	},
	"application/vnd.dynageo": {
		"source": "iana",
		"extensions": [
			"geo"
		]
	},
	"application/vnd.dzr": {
		"source": "iana"
	},
	"application/vnd.easykaraoke.cdgdownload": {
		"source": "iana"
	},
	"application/vnd.ecdis-update": {
		"source": "iana"
	},
	"application/vnd.ecowin.chart": {
		"source": "iana",
		"extensions": [
			"mag"
		]
	},
	"application/vnd.ecowin.filerequest": {
		"source": "iana"
	},
	"application/vnd.ecowin.fileupdate": {
		"source": "iana"
	},
	"application/vnd.ecowin.series": {
		"source": "iana"
	},
	"application/vnd.ecowin.seriesrequest": {
		"source": "iana"
	},
	"application/vnd.ecowin.seriesupdate": {
		"source": "iana"
	},
	"application/vnd.efi.img": {
		"source": "iana"
	},
	"application/vnd.efi.iso": {
		"source": "iana"
	},
	"application/vnd.emclient.accessrequest+xml": {
		"source": "iana"
	},
	"application/vnd.enliven": {
		"source": "iana",
		"extensions": [
			"nml"
		]
	},
	"application/vnd.enphase.envoy": {
		"source": "iana"
	},
	"application/vnd.eprints.data+xml": {
		"source": "iana"
	},
	"application/vnd.epson.esf": {
		"source": "iana",
		"extensions": [
			"esf"
		]
	},
	"application/vnd.epson.msf": {
		"source": "iana",
		"extensions": [
			"msf"
		]
	},
	"application/vnd.epson.quickanime": {
		"source": "iana",
		"extensions": [
			"qam"
		]
	},
	"application/vnd.epson.salt": {
		"source": "iana",
		"extensions": [
			"slt"
		]
	},
	"application/vnd.epson.ssf": {
		"source": "iana",
		"extensions": [
			"ssf"
		]
	},
	"application/vnd.ericsson.quickcall": {
		"source": "iana"
	},
	"application/vnd.espass-espass+zip": {
		"source": "iana"
	},
	"application/vnd.eszigno3+xml": {
		"source": "iana",
		"extensions": [
			"es3",
			"et3"
		]
	},
	"application/vnd.etsi.aoc+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.asic-e+zip": {
		"source": "iana"
	},
	"application/vnd.etsi.asic-s+zip": {
		"source": "iana"
	},
	"application/vnd.etsi.cug+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvcommand+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvdiscovery+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvprofile+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvsad-bc+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvsad-cod+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvsad-npvr+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvservice+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvsync+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.iptvueprofile+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.mcid+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.mheg5": {
		"source": "iana"
	},
	"application/vnd.etsi.overload-control-policy-dataset+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.pstn+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.sci+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.simservs+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.timestamp-token": {
		"source": "iana"
	},
	"application/vnd.etsi.tsl+xml": {
		"source": "iana"
	},
	"application/vnd.etsi.tsl.der": {
		"source": "iana"
	},
	"application/vnd.eudora.data": {
		"source": "iana"
	},
	"application/vnd.ezpix-album": {
		"source": "iana",
		"extensions": [
			"ez2"
		]
	},
	"application/vnd.ezpix-package": {
		"source": "iana",
		"extensions": [
			"ez3"
		]
	},
	"application/vnd.f-secure.mobile": {
		"source": "iana"
	},
	"application/vnd.fastcopy-disk-image": {
		"source": "iana"
	},
	"application/vnd.fdf": {
		"source": "iana",
		"extensions": [
			"fdf"
		]
	},
	"application/vnd.fdsn.mseed": {
		"source": "iana",
		"extensions": [
			"mseed"
		]
	},
	"application/vnd.fdsn.seed": {
		"source": "iana",
		"extensions": [
			"seed",
			"dataless"
		]
	},
	"application/vnd.ffsns": {
		"source": "iana"
	},
	"application/vnd.filmit.zfc": {
		"source": "iana"
	},
	"application/vnd.fints": {
		"source": "iana"
	},
	"application/vnd.firemonkeys.cloudcell": {
		"source": "iana"
	},
	"application/vnd.flographit": {
		"source": "iana",
		"extensions": [
			"gph"
		]
	},
	"application/vnd.fluxtime.clip": {
		"source": "iana",
		"extensions": [
			"ftc"
		]
	},
	"application/vnd.font-fontforge-sfd": {
		"source": "iana"
	},
	"application/vnd.framemaker": {
		"source": "iana",
		"extensions": [
			"fm",
			"frame",
			"maker",
			"book"
		]
	},
	"application/vnd.frogans.fnc": {
		"source": "iana",
		"extensions": [
			"fnc"
		]
	},
	"application/vnd.frogans.ltf": {
		"source": "iana",
		"extensions": [
			"ltf"
		]
	},
	"application/vnd.fsc.weblaunch": {
		"source": "iana",
		"extensions": [
			"fsc"
		]
	},
	"application/vnd.fujitsu.oasys": {
		"source": "iana",
		"extensions": [
			"oas"
		]
	},
	"application/vnd.fujitsu.oasys2": {
		"source": "iana",
		"extensions": [
			"oa2"
		]
	},
	"application/vnd.fujitsu.oasys3": {
		"source": "iana",
		"extensions": [
			"oa3"
		]
	},
	"application/vnd.fujitsu.oasysgp": {
		"source": "iana",
		"extensions": [
			"fg5"
		]
	},
	"application/vnd.fujitsu.oasysprs": {
		"source": "iana",
		"extensions": [
			"bh2"
		]
	},
	"application/vnd.fujixerox.art-ex": {
		"source": "iana"
	},
	"application/vnd.fujixerox.art4": {
		"source": "iana"
	},
	"application/vnd.fujixerox.ddd": {
		"source": "iana",
		"extensions": [
			"ddd"
		]
	},
	"application/vnd.fujixerox.docuworks": {
		"source": "iana",
		"extensions": [
			"xdw"
		]
	},
	"application/vnd.fujixerox.docuworks.binder": {
		"source": "iana",
		"extensions": [
			"xbd"
		]
	},
	"application/vnd.fujixerox.docuworks.container": {
		"source": "iana"
	},
	"application/vnd.fujixerox.hbpl": {
		"source": "iana"
	},
	"application/vnd.fut-misnet": {
		"source": "iana"
	},
	"application/vnd.fuzzysheet": {
		"source": "iana",
		"extensions": [
			"fzs"
		]
	},
	"application/vnd.genomatix.tuxedo": {
		"source": "iana",
		"extensions": [
			"txd"
		]
	},
	"application/vnd.geo+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.geocube+xml": {
		"source": "iana"
	},
	"application/vnd.geogebra.file": {
		"source": "iana",
		"extensions": [
			"ggb"
		]
	},
	"application/vnd.geogebra.tool": {
		"source": "iana",
		"extensions": [
			"ggt"
		]
	},
	"application/vnd.geometry-explorer": {
		"source": "iana",
		"extensions": [
			"gex",
			"gre"
		]
	},
	"application/vnd.geonext": {
		"source": "iana",
		"extensions": [
			"gxt"
		]
	},
	"application/vnd.geoplan": {
		"source": "iana",
		"extensions": [
			"g2w"
		]
	},
	"application/vnd.geospace": {
		"source": "iana",
		"extensions": [
			"g3w"
		]
	},
	"application/vnd.gerber": {
		"source": "iana"
	},
	"application/vnd.globalplatform.card-content-mgt": {
		"source": "iana"
	},
	"application/vnd.globalplatform.card-content-mgt-response": {
		"source": "iana"
	},
	"application/vnd.gmx": {
		"source": "iana",
		"extensions": [
			"gmx"
		]
	},
	"application/vnd.google-apps.document": {
		"compressible": false,
		"extensions": [
			"gdoc"
		]
	},
	"application/vnd.google-apps.presentation": {
		"compressible": false,
		"extensions": [
			"gslides"
		]
	},
	"application/vnd.google-apps.spreadsheet": {
		"compressible": false,
		"extensions": [
			"gsheet"
		]
	},
	"application/vnd.google-earth.kml+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"kml"
		]
	},
	"application/vnd.google-earth.kmz": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"kmz"
		]
	},
	"application/vnd.gov.sk.e-form+xml": {
		"source": "iana"
	},
	"application/vnd.gov.sk.e-form+zip": {
		"source": "iana"
	},
	"application/vnd.gov.sk.xmldatacontainer+xml": {
		"source": "iana"
	},
	"application/vnd.grafeq": {
		"source": "iana",
		"extensions": [
			"gqf",
			"gqs"
		]
	},
	"application/vnd.gridmp": {
		"source": "iana"
	},
	"application/vnd.groove-account": {
		"source": "iana",
		"extensions": [
			"gac"
		]
	},
	"application/vnd.groove-help": {
		"source": "iana",
		"extensions": [
			"ghf"
		]
	},
	"application/vnd.groove-identity-message": {
		"source": "iana",
		"extensions": [
			"gim"
		]
	},
	"application/vnd.groove-injector": {
		"source": "iana",
		"extensions": [
			"grv"
		]
	},
	"application/vnd.groove-tool-message": {
		"source": "iana",
		"extensions": [
			"gtm"
		]
	},
	"application/vnd.groove-tool-template": {
		"source": "iana",
		"extensions": [
			"tpl"
		]
	},
	"application/vnd.groove-vcard": {
		"source": "iana",
		"extensions": [
			"vcg"
		]
	},
	"application/vnd.hal+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.hal+xml": {
		"source": "iana",
		"extensions": [
			"hal"
		]
	},
	"application/vnd.handheld-entertainment+xml": {
		"source": "iana",
		"extensions": [
			"zmm"
		]
	},
	"application/vnd.hbci": {
		"source": "iana",
		"extensions": [
			"hbci"
		]
	},
	"application/vnd.hc+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.hcl-bireports": {
		"source": "iana"
	},
	"application/vnd.hdt": {
		"source": "iana"
	},
	"application/vnd.heroku+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.hhe.lesson-player": {
		"source": "iana",
		"extensions": [
			"les"
		]
	},
	"application/vnd.hp-hpgl": {
		"source": "iana",
		"extensions": [
			"hpgl"
		]
	},
	"application/vnd.hp-hpid": {
		"source": "iana",
		"extensions": [
			"hpid"
		]
	},
	"application/vnd.hp-hps": {
		"source": "iana",
		"extensions": [
			"hps"
		]
	},
	"application/vnd.hp-jlyt": {
		"source": "iana",
		"extensions": [
			"jlt"
		]
	},
	"application/vnd.hp-pcl": {
		"source": "iana",
		"extensions": [
			"pcl"
		]
	},
	"application/vnd.hp-pclxl": {
		"source": "iana",
		"extensions": [
			"pclxl"
		]
	},
	"application/vnd.httphone": {
		"source": "iana"
	},
	"application/vnd.hydrostatix.sof-data": {
		"source": "iana",
		"extensions": [
			"sfd-hdstx"
		]
	},
	"application/vnd.hyperdrive+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.hzn-3d-crossword": {
		"source": "iana"
	},
	"application/vnd.ibm.afplinedata": {
		"source": "iana"
	},
	"application/vnd.ibm.electronic-media": {
		"source": "iana"
	},
	"application/vnd.ibm.minipay": {
		"source": "iana",
		"extensions": [
			"mpy"
		]
	},
	"application/vnd.ibm.modcap": {
		"source": "iana",
		"extensions": [
			"afp",
			"listafp",
			"list3820"
		]
	},
	"application/vnd.ibm.rights-management": {
		"source": "iana",
		"extensions": [
			"irm"
		]
	},
	"application/vnd.ibm.secure-container": {
		"source": "iana",
		"extensions": [
			"sc"
		]
	},
	"application/vnd.iccprofile": {
		"source": "iana",
		"extensions": [
			"icc",
			"icm"
		]
	},
	"application/vnd.ieee.1905": {
		"source": "iana"
	},
	"application/vnd.igloader": {
		"source": "iana",
		"extensions": [
			"igl"
		]
	},
	"application/vnd.imagemeter.image+zip": {
		"source": "iana"
	},
	"application/vnd.immervision-ivp": {
		"source": "iana",
		"extensions": [
			"ivp"
		]
	},
	"application/vnd.immervision-ivu": {
		"source": "iana",
		"extensions": [
			"ivu"
		]
	},
	"application/vnd.ims.imsccv1p1": {
		"source": "iana"
	},
	"application/vnd.ims.imsccv1p2": {
		"source": "iana"
	},
	"application/vnd.ims.imsccv1p3": {
		"source": "iana"
	},
	"application/vnd.ims.lis.v2.result+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.ims.lti.v2.toolproxy+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.ims.lti.v2.toolproxy.id+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.ims.lti.v2.toolsettings+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.informedcontrol.rms+xml": {
		"source": "iana"
	},
	"application/vnd.informix-visionary": {
		"source": "iana"
	},
	"application/vnd.infotech.project": {
		"source": "iana"
	},
	"application/vnd.infotech.project+xml": {
		"source": "iana"
	},
	"application/vnd.innopath.wamp.notification": {
		"source": "iana"
	},
	"application/vnd.insors.igm": {
		"source": "iana",
		"extensions": [
			"igm"
		]
	},
	"application/vnd.intercon.formnet": {
		"source": "iana",
		"extensions": [
			"xpw",
			"xpx"
		]
	},
	"application/vnd.intergeo": {
		"source": "iana",
		"extensions": [
			"i2g"
		]
	},
	"application/vnd.intertrust.digibox": {
		"source": "iana"
	},
	"application/vnd.intertrust.nncp": {
		"source": "iana"
	},
	"application/vnd.intu.qbo": {
		"source": "iana",
		"extensions": [
			"qbo"
		]
	},
	"application/vnd.intu.qfx": {
		"source": "iana",
		"extensions": [
			"qfx"
		]
	},
	"application/vnd.iptc.g2.catalogitem+xml": {
		"source": "iana"
	},
	"application/vnd.iptc.g2.conceptitem+xml": {
		"source": "iana"
	},
	"application/vnd.iptc.g2.knowledgeitem+xml": {
		"source": "iana"
	},
	"application/vnd.iptc.g2.newsitem+xml": {
		"source": "iana"
	},
	"application/vnd.iptc.g2.newsmessage+xml": {
		"source": "iana"
	},
	"application/vnd.iptc.g2.packageitem+xml": {
		"source": "iana"
	},
	"application/vnd.iptc.g2.planningitem+xml": {
		"source": "iana"
	},
	"application/vnd.ipunplugged.rcprofile": {
		"source": "iana",
		"extensions": [
			"rcprofile"
		]
	},
	"application/vnd.irepository.package+xml": {
		"source": "iana",
		"extensions": [
			"irp"
		]
	},
	"application/vnd.is-xpr": {
		"source": "iana",
		"extensions": [
			"xpr"
		]
	},
	"application/vnd.isac.fcs": {
		"source": "iana",
		"extensions": [
			"fcs"
		]
	},
	"application/vnd.jam": {
		"source": "iana",
		"extensions": [
			"jam"
		]
	},
	"application/vnd.japannet-directory-service": {
		"source": "iana"
	},
	"application/vnd.japannet-jpnstore-wakeup": {
		"source": "iana"
	},
	"application/vnd.japannet-payment-wakeup": {
		"source": "iana"
	},
	"application/vnd.japannet-registration": {
		"source": "iana"
	},
	"application/vnd.japannet-registration-wakeup": {
		"source": "iana"
	},
	"application/vnd.japannet-setstore-wakeup": {
		"source": "iana"
	},
	"application/vnd.japannet-verification": {
		"source": "iana"
	},
	"application/vnd.japannet-verification-wakeup": {
		"source": "iana"
	},
	"application/vnd.jcp.javame.midlet-rms": {
		"source": "iana",
		"extensions": [
			"rms"
		]
	},
	"application/vnd.jisp": {
		"source": "iana",
		"extensions": [
			"jisp"
		]
	},
	"application/vnd.joost.joda-archive": {
		"source": "iana",
		"extensions": [
			"joda"
		]
	},
	"application/vnd.jsk.isdn-ngn": {
		"source": "iana"
	},
	"application/vnd.kahootz": {
		"source": "iana",
		"extensions": [
			"ktz",
			"ktr"
		]
	},
	"application/vnd.kde.karbon": {
		"source": "iana",
		"extensions": [
			"karbon"
		]
	},
	"application/vnd.kde.kchart": {
		"source": "iana",
		"extensions": [
			"chrt"
		]
	},
	"application/vnd.kde.kformula": {
		"source": "iana",
		"extensions": [
			"kfo"
		]
	},
	"application/vnd.kde.kivio": {
		"source": "iana",
		"extensions": [
			"flw"
		]
	},
	"application/vnd.kde.kontour": {
		"source": "iana",
		"extensions": [
			"kon"
		]
	},
	"application/vnd.kde.kpresenter": {
		"source": "iana",
		"extensions": [
			"kpr",
			"kpt"
		]
	},
	"application/vnd.kde.kspread": {
		"source": "iana",
		"extensions": [
			"ksp"
		]
	},
	"application/vnd.kde.kword": {
		"source": "iana",
		"extensions": [
			"kwd",
			"kwt"
		]
	},
	"application/vnd.kenameaapp": {
		"source": "iana",
		"extensions": [
			"htke"
		]
	},
	"application/vnd.kidspiration": {
		"source": "iana",
		"extensions": [
			"kia"
		]
	},
	"application/vnd.kinar": {
		"source": "iana",
		"extensions": [
			"kne",
			"knp"
		]
	},
	"application/vnd.koan": {
		"source": "iana",
		"extensions": [
			"skp",
			"skd",
			"skt",
			"skm"
		]
	},
	"application/vnd.kodak-descriptor": {
		"source": "iana",
		"extensions": [
			"sse"
		]
	},
	"application/vnd.las.las+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.las.las+xml": {
		"source": "iana",
		"extensions": [
			"lasxml"
		]
	},
	"application/vnd.liberty-request+xml": {
		"source": "iana"
	},
	"application/vnd.llamagraphics.life-balance.desktop": {
		"source": "iana",
		"extensions": [
			"lbd"
		]
	},
	"application/vnd.llamagraphics.life-balance.exchange+xml": {
		"source": "iana",
		"extensions": [
			"lbe"
		]
	},
	"application/vnd.lotus-1-2-3": {
		"source": "iana",
		"extensions": [
			"123"
		]
	},
	"application/vnd.lotus-approach": {
		"source": "iana",
		"extensions": [
			"apr"
		]
	},
	"application/vnd.lotus-freelance": {
		"source": "iana",
		"extensions": [
			"pre"
		]
	},
	"application/vnd.lotus-notes": {
		"source": "iana",
		"extensions": [
			"nsf"
		]
	},
	"application/vnd.lotus-organizer": {
		"source": "iana",
		"extensions": [
			"org"
		]
	},
	"application/vnd.lotus-screencam": {
		"source": "iana",
		"extensions": [
			"scm"
		]
	},
	"application/vnd.lotus-wordpro": {
		"source": "iana",
		"extensions": [
			"lwp"
		]
	},
	"application/vnd.macports.portpkg": {
		"source": "iana",
		"extensions": [
			"portpkg"
		]
	},
	"application/vnd.mapbox-vector-tile": {
		"source": "iana"
	},
	"application/vnd.marlin.drm.actiontoken+xml": {
		"source": "iana"
	},
	"application/vnd.marlin.drm.conftoken+xml": {
		"source": "iana"
	},
	"application/vnd.marlin.drm.license+xml": {
		"source": "iana"
	},
	"application/vnd.marlin.drm.mdcf": {
		"source": "iana"
	},
	"application/vnd.mason+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.maxmind.maxmind-db": {
		"source": "iana"
	},
	"application/vnd.mcd": {
		"source": "iana",
		"extensions": [
			"mcd"
		]
	},
	"application/vnd.medcalcdata": {
		"source": "iana",
		"extensions": [
			"mc1"
		]
	},
	"application/vnd.mediastation.cdkey": {
		"source": "iana",
		"extensions": [
			"cdkey"
		]
	},
	"application/vnd.meridian-slingshot": {
		"source": "iana"
	},
	"application/vnd.mfer": {
		"source": "iana",
		"extensions": [
			"mwf"
		]
	},
	"application/vnd.mfmp": {
		"source": "iana",
		"extensions": [
			"mfm"
		]
	},
	"application/vnd.micro+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.micrografx.flo": {
		"source": "iana",
		"extensions": [
			"flo"
		]
	},
	"application/vnd.micrografx.igx": {
		"source": "iana",
		"extensions": [
			"igx"
		]
	},
	"application/vnd.microsoft.portable-executable": {
		"source": "iana"
	},
	"application/vnd.miele+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.mif": {
		"source": "iana",
		"extensions": [
			"mif"
		]
	},
	"application/vnd.minisoft-hp3000-save": {
		"source": "iana"
	},
	"application/vnd.mitsubishi.misty-guard.trustweb": {
		"source": "iana"
	},
	"application/vnd.mobius.daf": {
		"source": "iana",
		"extensions": [
			"daf"
		]
	},
	"application/vnd.mobius.dis": {
		"source": "iana",
		"extensions": [
			"dis"
		]
	},
	"application/vnd.mobius.mbk": {
		"source": "iana",
		"extensions": [
			"mbk"
		]
	},
	"application/vnd.mobius.mqy": {
		"source": "iana",
		"extensions": [
			"mqy"
		]
	},
	"application/vnd.mobius.msl": {
		"source": "iana",
		"extensions": [
			"msl"
		]
	},
	"application/vnd.mobius.plc": {
		"source": "iana",
		"extensions": [
			"plc"
		]
	},
	"application/vnd.mobius.txf": {
		"source": "iana",
		"extensions": [
			"txf"
		]
	},
	"application/vnd.mophun.application": {
		"source": "iana",
		"extensions": [
			"mpn"
		]
	},
	"application/vnd.mophun.certificate": {
		"source": "iana",
		"extensions": [
			"mpc"
		]
	},
	"application/vnd.motorola.flexsuite": {
		"source": "iana"
	},
	"application/vnd.motorola.flexsuite.adsi": {
		"source": "iana"
	},
	"application/vnd.motorola.flexsuite.fis": {
		"source": "iana"
	},
	"application/vnd.motorola.flexsuite.gotap": {
		"source": "iana"
	},
	"application/vnd.motorola.flexsuite.kmr": {
		"source": "iana"
	},
	"application/vnd.motorola.flexsuite.ttc": {
		"source": "iana"
	},
	"application/vnd.motorola.flexsuite.wem": {
		"source": "iana"
	},
	"application/vnd.motorola.iprm": {
		"source": "iana"
	},
	"application/vnd.mozilla.xul+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"xul"
		]
	},
	"application/vnd.ms-3mfdocument": {
		"source": "iana"
	},
	"application/vnd.ms-artgalry": {
		"source": "iana",
		"extensions": [
			"cil"
		]
	},
	"application/vnd.ms-asf": {
		"source": "iana"
	},
	"application/vnd.ms-cab-compressed": {
		"source": "iana",
		"extensions": [
			"cab"
		]
	},
	"application/vnd.ms-color.iccprofile": {
		"source": "apache"
	},
	"application/vnd.ms-excel": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"xls",
			"xlm",
			"xla",
			"xlc",
			"xlt",
			"xlw"
		]
	},
	"application/vnd.ms-excel.addin.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"xlam"
		]
	},
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"xlsb"
		]
	},
	"application/vnd.ms-excel.sheet.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"xlsm"
		]
	},
	"application/vnd.ms-excel.template.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"xltm"
		]
	},
	"application/vnd.ms-fontobject": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"eot"
		]
	},
	"application/vnd.ms-htmlhelp": {
		"source": "iana",
		"extensions": [
			"chm"
		]
	},
	"application/vnd.ms-ims": {
		"source": "iana",
		"extensions": [
			"ims"
		]
	},
	"application/vnd.ms-lrm": {
		"source": "iana",
		"extensions": [
			"lrm"
		]
	},
	"application/vnd.ms-office.activex+xml": {
		"source": "iana"
	},
	"application/vnd.ms-officetheme": {
		"source": "iana",
		"extensions": [
			"thmx"
		]
	},
	"application/vnd.ms-opentype": {
		"source": "apache",
		"compressible": true
	},
	"application/vnd.ms-package.obfuscated-opentype": {
		"source": "apache"
	},
	"application/vnd.ms-pki.seccat": {
		"source": "apache",
		"extensions": [
			"cat"
		]
	},
	"application/vnd.ms-pki.stl": {
		"source": "apache",
		"extensions": [
			"stl"
		]
	},
	"application/vnd.ms-playready.initiator+xml": {
		"source": "iana"
	},
	"application/vnd.ms-powerpoint": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"ppt",
			"pps",
			"pot"
		]
	},
	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"ppam"
		]
	},
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"pptm"
		]
	},
	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"sldm"
		]
	},
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"ppsm"
		]
	},
	"application/vnd.ms-powerpoint.template.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"potm"
		]
	},
	"application/vnd.ms-printdevicecapabilities+xml": {
		"source": "iana"
	},
	"application/vnd.ms-printing.printticket+xml": {
		"source": "apache"
	},
	"application/vnd.ms-printschematicket+xml": {
		"source": "iana"
	},
	"application/vnd.ms-project": {
		"source": "iana",
		"extensions": [
			"mpp",
			"mpt"
		]
	},
	"application/vnd.ms-tnef": {
		"source": "iana"
	},
	"application/vnd.ms-windows.devicepairing": {
		"source": "iana"
	},
	"application/vnd.ms-windows.nwprinting.oob": {
		"source": "iana"
	},
	"application/vnd.ms-windows.printerpairing": {
		"source": "iana"
	},
	"application/vnd.ms-windows.wsd.oob": {
		"source": "iana"
	},
	"application/vnd.ms-wmdrm.lic-chlg-req": {
		"source": "iana"
	},
	"application/vnd.ms-wmdrm.lic-resp": {
		"source": "iana"
	},
	"application/vnd.ms-wmdrm.meter-chlg-req": {
		"source": "iana"
	},
	"application/vnd.ms-wmdrm.meter-resp": {
		"source": "iana"
	},
	"application/vnd.ms-word.document.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"docm"
		]
	},
	"application/vnd.ms-word.template.macroenabled.12": {
		"source": "iana",
		"extensions": [
			"dotm"
		]
	},
	"application/vnd.ms-works": {
		"source": "iana",
		"extensions": [
			"wps",
			"wks",
			"wcm",
			"wdb"
		]
	},
	"application/vnd.ms-wpl": {
		"source": "iana",
		"extensions": [
			"wpl"
		]
	},
	"application/vnd.ms-xpsdocument": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"xps"
		]
	},
	"application/vnd.msa-disk-image": {
		"source": "iana"
	},
	"application/vnd.mseq": {
		"source": "iana",
		"extensions": [
			"mseq"
		]
	},
	"application/vnd.msign": {
		"source": "iana"
	},
	"application/vnd.multiad.creator": {
		"source": "iana"
	},
	"application/vnd.multiad.creator.cif": {
		"source": "iana"
	},
	"application/vnd.music-niff": {
		"source": "iana"
	},
	"application/vnd.musician": {
		"source": "iana",
		"extensions": [
			"mus"
		]
	},
	"application/vnd.muvee.style": {
		"source": "iana",
		"extensions": [
			"msty"
		]
	},
	"application/vnd.mynfc": {
		"source": "iana",
		"extensions": [
			"taglet"
		]
	},
	"application/vnd.ncd.control": {
		"source": "iana"
	},
	"application/vnd.ncd.reference": {
		"source": "iana"
	},
	"application/vnd.nearst.inv+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.nervana": {
		"source": "iana"
	},
	"application/vnd.netfpx": {
		"source": "iana"
	},
	"application/vnd.neurolanguage.nlu": {
		"source": "iana",
		"extensions": [
			"nlu"
		]
	},
	"application/vnd.nintendo.nitro.rom": {
		"source": "iana"
	},
	"application/vnd.nintendo.snes.rom": {
		"source": "iana"
	},
	"application/vnd.nitf": {
		"source": "iana",
		"extensions": [
			"ntf",
			"nitf"
		]
	},
	"application/vnd.noblenet-directory": {
		"source": "iana",
		"extensions": [
			"nnd"
		]
	},
	"application/vnd.noblenet-sealer": {
		"source": "iana",
		"extensions": [
			"nns"
		]
	},
	"application/vnd.noblenet-web": {
		"source": "iana",
		"extensions": [
			"nnw"
		]
	},
	"application/vnd.nokia.catalogs": {
		"source": "iana"
	},
	"application/vnd.nokia.conml+wbxml": {
		"source": "iana"
	},
	"application/vnd.nokia.conml+xml": {
		"source": "iana"
	},
	"application/vnd.nokia.iptv.config+xml": {
		"source": "iana"
	},
	"application/vnd.nokia.isds-radio-presets": {
		"source": "iana"
	},
	"application/vnd.nokia.landmark+wbxml": {
		"source": "iana"
	},
	"application/vnd.nokia.landmark+xml": {
		"source": "iana"
	},
	"application/vnd.nokia.landmarkcollection+xml": {
		"source": "iana"
	},
	"application/vnd.nokia.n-gage.ac+xml": {
		"source": "iana"
	},
	"application/vnd.nokia.n-gage.data": {
		"source": "iana",
		"extensions": [
			"ngdat"
		]
	},
	"application/vnd.nokia.n-gage.symbian.install": {
		"source": "iana",
		"extensions": [
			"n-gage"
		]
	},
	"application/vnd.nokia.ncd": {
		"source": "iana"
	},
	"application/vnd.nokia.pcd+wbxml": {
		"source": "iana"
	},
	"application/vnd.nokia.pcd+xml": {
		"source": "iana"
	},
	"application/vnd.nokia.radio-preset": {
		"source": "iana",
		"extensions": [
			"rpst"
		]
	},
	"application/vnd.nokia.radio-presets": {
		"source": "iana",
		"extensions": [
			"rpss"
		]
	},
	"application/vnd.novadigm.edm": {
		"source": "iana",
		"extensions": [
			"edm"
		]
	},
	"application/vnd.novadigm.edx": {
		"source": "iana",
		"extensions": [
			"edx"
		]
	},
	"application/vnd.novadigm.ext": {
		"source": "iana",
		"extensions": [
			"ext"
		]
	},
	"application/vnd.ntt-local.content-share": {
		"source": "iana"
	},
	"application/vnd.ntt-local.file-transfer": {
		"source": "iana"
	},
	"application/vnd.ntt-local.ogw_remote-access": {
		"source": "iana"
	},
	"application/vnd.ntt-local.sip-ta_remote": {
		"source": "iana"
	},
	"application/vnd.ntt-local.sip-ta_tcp_stream": {
		"source": "iana"
	},
	"application/vnd.oasis.opendocument.chart": {
		"source": "iana",
		"extensions": [
			"odc"
		]
	},
	"application/vnd.oasis.opendocument.chart-template": {
		"source": "iana",
		"extensions": [
			"otc"
		]
	},
	"application/vnd.oasis.opendocument.database": {
		"source": "iana",
		"extensions": [
			"odb"
		]
	},
	"application/vnd.oasis.opendocument.formula": {
		"source": "iana",
		"extensions": [
			"odf"
		]
	},
	"application/vnd.oasis.opendocument.formula-template": {
		"source": "iana",
		"extensions": [
			"odft"
		]
	},
	"application/vnd.oasis.opendocument.graphics": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"odg"
		]
	},
	"application/vnd.oasis.opendocument.graphics-template": {
		"source": "iana",
		"extensions": [
			"otg"
		]
	},
	"application/vnd.oasis.opendocument.image": {
		"source": "iana",
		"extensions": [
			"odi"
		]
	},
	"application/vnd.oasis.opendocument.image-template": {
		"source": "iana",
		"extensions": [
			"oti"
		]
	},
	"application/vnd.oasis.opendocument.presentation": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"odp"
		]
	},
	"application/vnd.oasis.opendocument.presentation-template": {
		"source": "iana",
		"extensions": [
			"otp"
		]
	},
	"application/vnd.oasis.opendocument.spreadsheet": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"ods"
		]
	},
	"application/vnd.oasis.opendocument.spreadsheet-template": {
		"source": "iana",
		"extensions": [
			"ots"
		]
	},
	"application/vnd.oasis.opendocument.text": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"odt"
		]
	},
	"application/vnd.oasis.opendocument.text-master": {
		"source": "iana",
		"extensions": [
			"odm"
		]
	},
	"application/vnd.oasis.opendocument.text-template": {
		"source": "iana",
		"extensions": [
			"ott"
		]
	},
	"application/vnd.oasis.opendocument.text-web": {
		"source": "iana",
		"extensions": [
			"oth"
		]
	},
	"application/vnd.obn": {
		"source": "iana"
	},
	"application/vnd.ocf+cbor": {
		"source": "iana"
	},
	"application/vnd.oftn.l10n+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.oipf.contentaccessdownload+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.contentaccessstreaming+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.cspg-hexbinary": {
		"source": "iana"
	},
	"application/vnd.oipf.dae.svg+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.dae.xhtml+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.mippvcontrolmessage+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.pae.gem": {
		"source": "iana"
	},
	"application/vnd.oipf.spdiscovery+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.spdlist+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.ueprofile+xml": {
		"source": "iana"
	},
	"application/vnd.oipf.userprofile+xml": {
		"source": "iana"
	},
	"application/vnd.olpc-sugar": {
		"source": "iana",
		"extensions": [
			"xo"
		]
	},
	"application/vnd.oma-scws-config": {
		"source": "iana"
	},
	"application/vnd.oma-scws-http-request": {
		"source": "iana"
	},
	"application/vnd.oma-scws-http-response": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.drm-trigger+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.imd+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.ltkm": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.notification+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.provisioningtrigger": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.sgboot": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.sgdd+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.sgdu": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.simple-symbol-container": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.smartcard-trigger+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.sprov+xml": {
		"source": "iana"
	},
	"application/vnd.oma.bcast.stkm": {
		"source": "iana"
	},
	"application/vnd.oma.cab-address-book+xml": {
		"source": "iana"
	},
	"application/vnd.oma.cab-feature-handler+xml": {
		"source": "iana"
	},
	"application/vnd.oma.cab-pcc+xml": {
		"source": "iana"
	},
	"application/vnd.oma.cab-subs-invite+xml": {
		"source": "iana"
	},
	"application/vnd.oma.cab-user-prefs+xml": {
		"source": "iana"
	},
	"application/vnd.oma.dcd": {
		"source": "iana"
	},
	"application/vnd.oma.dcdc": {
		"source": "iana"
	},
	"application/vnd.oma.dd2+xml": {
		"source": "iana",
		"extensions": [
			"dd2"
		]
	},
	"application/vnd.oma.drm.risd+xml": {
		"source": "iana"
	},
	"application/vnd.oma.group-usage-list+xml": {
		"source": "iana"
	},
	"application/vnd.oma.lwm2m+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.oma.lwm2m+tlv": {
		"source": "iana"
	},
	"application/vnd.oma.pal+xml": {
		"source": "iana"
	},
	"application/vnd.oma.poc.detailed-progress-report+xml": {
		"source": "iana"
	},
	"application/vnd.oma.poc.final-report+xml": {
		"source": "iana"
	},
	"application/vnd.oma.poc.groups+xml": {
		"source": "iana"
	},
	"application/vnd.oma.poc.invocation-descriptor+xml": {
		"source": "iana"
	},
	"application/vnd.oma.poc.optimized-progress-report+xml": {
		"source": "iana"
	},
	"application/vnd.oma.push": {
		"source": "iana"
	},
	"application/vnd.oma.scidm.messages+xml": {
		"source": "iana"
	},
	"application/vnd.oma.xcap-directory+xml": {
		"source": "iana"
	},
	"application/vnd.omads-email+xml": {
		"source": "iana"
	},
	"application/vnd.omads-file+xml": {
		"source": "iana"
	},
	"application/vnd.omads-folder+xml": {
		"source": "iana"
	},
	"application/vnd.omaloc-supl-init": {
		"source": "iana"
	},
	"application/vnd.onepager": {
		"source": "iana"
	},
	"application/vnd.openblox.game+xml": {
		"source": "iana"
	},
	"application/vnd.openblox.game-binary": {
		"source": "iana"
	},
	"application/vnd.openeye.oeb": {
		"source": "iana"
	},
	"application/vnd.openofficeorg.extension": {
		"source": "apache",
		"extensions": [
			"oxt"
		]
	},
	"application/vnd.openstreetmap.data+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawing+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml-template": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"pptx"
		]
	},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
		"source": "iana",
		"extensions": [
			"sldx"
		]
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
		"source": "iana",
		"extensions": [
			"ppsx"
		]
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.template": {
		"source": "apache",
		"extensions": [
			"potx"
		]
	},
	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml-template": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"xlsx"
		]
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
		"source": "apache",
		"extensions": [
			"xltx"
		]
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.theme+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.vmldrawing": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml-template": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"docx"
		]
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
		"source": "apache",
		"extensions": [
			"dotx"
		]
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-package.core-properties+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
		"source": "iana"
	},
	"application/vnd.openxmlformats-package.relationships+xml": {
		"source": "iana"
	},
	"application/vnd.oracle.resource+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.orange.indata": {
		"source": "iana"
	},
	"application/vnd.osa.netdeploy": {
		"source": "iana"
	},
	"application/vnd.osgeo.mapguide.package": {
		"source": "iana",
		"extensions": [
			"mgp"
		]
	},
	"application/vnd.osgi.bundle": {
		"source": "iana"
	},
	"application/vnd.osgi.dp": {
		"source": "iana",
		"extensions": [
			"dp"
		]
	},
	"application/vnd.osgi.subsystem": {
		"source": "iana",
		"extensions": [
			"esa"
		]
	},
	"application/vnd.otps.ct-kip+xml": {
		"source": "iana"
	},
	"application/vnd.oxli.countgraph": {
		"source": "iana"
	},
	"application/vnd.pagerduty+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.palm": {
		"source": "iana",
		"extensions": [
			"pdb",
			"pqa",
			"oprc"
		]
	},
	"application/vnd.panoply": {
		"source": "iana"
	},
	"application/vnd.paos+xml": {
		"source": "iana"
	},
	"application/vnd.paos.xml": {
		"source": "apache"
	},
	"application/vnd.pawaafile": {
		"source": "iana",
		"extensions": [
			"paw"
		]
	},
	"application/vnd.pcos": {
		"source": "iana"
	},
	"application/vnd.pg.format": {
		"source": "iana",
		"extensions": [
			"str"
		]
	},
	"application/vnd.pg.osasli": {
		"source": "iana",
		"extensions": [
			"ei6"
		]
	},
	"application/vnd.piaccess.application-licence": {
		"source": "iana"
	},
	"application/vnd.picsel": {
		"source": "iana",
		"extensions": [
			"efif"
		]
	},
	"application/vnd.pmi.widget": {
		"source": "iana",
		"extensions": [
			"wg"
		]
	},
	"application/vnd.poc.group-advertisement+xml": {
		"source": "iana"
	},
	"application/vnd.pocketlearn": {
		"source": "iana",
		"extensions": [
			"plf"
		]
	},
	"application/vnd.powerbuilder6": {
		"source": "iana",
		"extensions": [
			"pbd"
		]
	},
	"application/vnd.powerbuilder6-s": {
		"source": "iana"
	},
	"application/vnd.powerbuilder7": {
		"source": "iana"
	},
	"application/vnd.powerbuilder7-s": {
		"source": "iana"
	},
	"application/vnd.powerbuilder75": {
		"source": "iana"
	},
	"application/vnd.powerbuilder75-s": {
		"source": "iana"
	},
	"application/vnd.preminet": {
		"source": "iana"
	},
	"application/vnd.previewsystems.box": {
		"source": "iana",
		"extensions": [
			"box"
		]
	},
	"application/vnd.proteus.magazine": {
		"source": "iana",
		"extensions": [
			"mgz"
		]
	},
	"application/vnd.publishare-delta-tree": {
		"source": "iana",
		"extensions": [
			"qps"
		]
	},
	"application/vnd.pvi.ptid1": {
		"source": "iana",
		"extensions": [
			"ptid"
		]
	},
	"application/vnd.pwg-multiplexed": {
		"source": "iana"
	},
	"application/vnd.pwg-xhtml-print+xml": {
		"source": "iana"
	},
	"application/vnd.qualcomm.brew-app-res": {
		"source": "iana"
	},
	"application/vnd.quarantainenet": {
		"source": "iana"
	},
	"application/vnd.quark.quarkxpress": {
		"source": "iana",
		"extensions": [
			"qxd",
			"qxt",
			"qwd",
			"qwt",
			"qxl",
			"qxb"
		]
	},
	"application/vnd.quobject-quoxdocument": {
		"source": "iana"
	},
	"application/vnd.radisys.moml+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-audit+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-audit-conf+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-audit-conn+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-audit-dialog+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-audit-stream+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-conf+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog-base+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog-group+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog-speech+xml": {
		"source": "iana"
	},
	"application/vnd.radisys.msml-dialog-transform+xml": {
		"source": "iana"
	},
	"application/vnd.rainstor.data": {
		"source": "iana"
	},
	"application/vnd.rapid": {
		"source": "iana"
	},
	"application/vnd.rar": {
		"source": "iana"
	},
	"application/vnd.realvnc.bed": {
		"source": "iana",
		"extensions": [
			"bed"
		]
	},
	"application/vnd.recordare.musicxml": {
		"source": "iana",
		"extensions": [
			"mxl"
		]
	},
	"application/vnd.recordare.musicxml+xml": {
		"source": "iana",
		"extensions": [
			"musicxml"
		]
	},
	"application/vnd.renlearn.rlprint": {
		"source": "iana"
	},
	"application/vnd.rig.cryptonote": {
		"source": "iana",
		"extensions": [
			"cryptonote"
		]
	},
	"application/vnd.rim.cod": {
		"source": "apache",
		"extensions": [
			"cod"
		]
	},
	"application/vnd.rn-realmedia": {
		"source": "apache",
		"extensions": [
			"rm"
		]
	},
	"application/vnd.rn-realmedia-vbr": {
		"source": "apache",
		"extensions": [
			"rmvb"
		]
	},
	"application/vnd.route66.link66+xml": {
		"source": "iana",
		"extensions": [
			"link66"
		]
	},
	"application/vnd.rs-274x": {
		"source": "iana"
	},
	"application/vnd.ruckus.download": {
		"source": "iana"
	},
	"application/vnd.s3sms": {
		"source": "iana"
	},
	"application/vnd.sailingtracker.track": {
		"source": "iana",
		"extensions": [
			"st"
		]
	},
	"application/vnd.sbm.cid": {
		"source": "iana"
	},
	"application/vnd.sbm.mid2": {
		"source": "iana"
	},
	"application/vnd.scribus": {
		"source": "iana"
	},
	"application/vnd.sealed.3df": {
		"source": "iana"
	},
	"application/vnd.sealed.csf": {
		"source": "iana"
	},
	"application/vnd.sealed.doc": {
		"source": "iana"
	},
	"application/vnd.sealed.eml": {
		"source": "iana"
	},
	"application/vnd.sealed.mht": {
		"source": "iana"
	},
	"application/vnd.sealed.net": {
		"source": "iana"
	},
	"application/vnd.sealed.ppt": {
		"source": "iana"
	},
	"application/vnd.sealed.tiff": {
		"source": "iana"
	},
	"application/vnd.sealed.xls": {
		"source": "iana"
	},
	"application/vnd.sealedmedia.softseal.html": {
		"source": "iana"
	},
	"application/vnd.sealedmedia.softseal.pdf": {
		"source": "iana"
	},
	"application/vnd.seemail": {
		"source": "iana",
		"extensions": [
			"see"
		]
	},
	"application/vnd.sema": {
		"source": "iana",
		"extensions": [
			"sema"
		]
	},
	"application/vnd.semd": {
		"source": "iana",
		"extensions": [
			"semd"
		]
	},
	"application/vnd.semf": {
		"source": "iana",
		"extensions": [
			"semf"
		]
	},
	"application/vnd.shana.informed.formdata": {
		"source": "iana",
		"extensions": [
			"ifm"
		]
	},
	"application/vnd.shana.informed.formtemplate": {
		"source": "iana",
		"extensions": [
			"itp"
		]
	},
	"application/vnd.shana.informed.interchange": {
		"source": "iana",
		"extensions": [
			"iif"
		]
	},
	"application/vnd.shana.informed.package": {
		"source": "iana",
		"extensions": [
			"ipk"
		]
	},
	"application/vnd.simtech-mindmapper": {
		"source": "iana",
		"extensions": [
			"twd",
			"twds"
		]
	},
	"application/vnd.siren+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.smaf": {
		"source": "iana",
		"extensions": [
			"mmf"
		]
	},
	"application/vnd.smart.notebook": {
		"source": "iana"
	},
	"application/vnd.smart.teacher": {
		"source": "iana",
		"extensions": [
			"teacher"
		]
	},
	"application/vnd.software602.filler.form+xml": {
		"source": "iana"
	},
	"application/vnd.software602.filler.form-xml-zip": {
		"source": "iana"
	},
	"application/vnd.solent.sdkm+xml": {
		"source": "iana",
		"extensions": [
			"sdkm",
			"sdkd"
		]
	},
	"application/vnd.spotfire.dxp": {
		"source": "iana",
		"extensions": [
			"dxp"
		]
	},
	"application/vnd.spotfire.sfs": {
		"source": "iana",
		"extensions": [
			"sfs"
		]
	},
	"application/vnd.sss-cod": {
		"source": "iana"
	},
	"application/vnd.sss-dtf": {
		"source": "iana"
	},
	"application/vnd.sss-ntf": {
		"source": "iana"
	},
	"application/vnd.stardivision.calc": {
		"source": "apache",
		"extensions": [
			"sdc"
		]
	},
	"application/vnd.stardivision.draw": {
		"source": "apache",
		"extensions": [
			"sda"
		]
	},
	"application/vnd.stardivision.impress": {
		"source": "apache",
		"extensions": [
			"sdd"
		]
	},
	"application/vnd.stardivision.math": {
		"source": "apache",
		"extensions": [
			"smf"
		]
	},
	"application/vnd.stardivision.writer": {
		"source": "apache",
		"extensions": [
			"sdw",
			"vor"
		]
	},
	"application/vnd.stardivision.writer-global": {
		"source": "apache",
		"extensions": [
			"sgl"
		]
	},
	"application/vnd.stepmania.package": {
		"source": "iana",
		"extensions": [
			"smzip"
		]
	},
	"application/vnd.stepmania.stepchart": {
		"source": "iana",
		"extensions": [
			"sm"
		]
	},
	"application/vnd.street-stream": {
		"source": "iana"
	},
	"application/vnd.sun.wadl+xml": {
		"source": "iana"
	},
	"application/vnd.sun.xml.calc": {
		"source": "apache",
		"extensions": [
			"sxc"
		]
	},
	"application/vnd.sun.xml.calc.template": {
		"source": "apache",
		"extensions": [
			"stc"
		]
	},
	"application/vnd.sun.xml.draw": {
		"source": "apache",
		"extensions": [
			"sxd"
		]
	},
	"application/vnd.sun.xml.draw.template": {
		"source": "apache",
		"extensions": [
			"std"
		]
	},
	"application/vnd.sun.xml.impress": {
		"source": "apache",
		"extensions": [
			"sxi"
		]
	},
	"application/vnd.sun.xml.impress.template": {
		"source": "apache",
		"extensions": [
			"sti"
		]
	},
	"application/vnd.sun.xml.math": {
		"source": "apache",
		"extensions": [
			"sxm"
		]
	},
	"application/vnd.sun.xml.writer": {
		"source": "apache",
		"extensions": [
			"sxw"
		]
	},
	"application/vnd.sun.xml.writer.global": {
		"source": "apache",
		"extensions": [
			"sxg"
		]
	},
	"application/vnd.sun.xml.writer.template": {
		"source": "apache",
		"extensions": [
			"stw"
		]
	},
	"application/vnd.sus-calendar": {
		"source": "iana",
		"extensions": [
			"sus",
			"susp"
		]
	},
	"application/vnd.svd": {
		"source": "iana",
		"extensions": [
			"svd"
		]
	},
	"application/vnd.swiftview-ics": {
		"source": "iana"
	},
	"application/vnd.symbian.install": {
		"source": "apache",
		"extensions": [
			"sis",
			"sisx"
		]
	},
	"application/vnd.syncml+xml": {
		"source": "iana",
		"extensions": [
			"xsm"
		]
	},
	"application/vnd.syncml.dm+wbxml": {
		"source": "iana",
		"extensions": [
			"bdm"
		]
	},
	"application/vnd.syncml.dm+xml": {
		"source": "iana",
		"extensions": [
			"xdm"
		]
	},
	"application/vnd.syncml.dm.notification": {
		"source": "iana"
	},
	"application/vnd.syncml.dmddf+wbxml": {
		"source": "iana"
	},
	"application/vnd.syncml.dmddf+xml": {
		"source": "iana"
	},
	"application/vnd.syncml.dmtnds+wbxml": {
		"source": "iana"
	},
	"application/vnd.syncml.dmtnds+xml": {
		"source": "iana"
	},
	"application/vnd.syncml.ds.notification": {
		"source": "iana"
	},
	"application/vnd.tableschema+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.tao.intent-module-archive": {
		"source": "iana",
		"extensions": [
			"tao"
		]
	},
	"application/vnd.tcpdump.pcap": {
		"source": "iana",
		"extensions": [
			"pcap",
			"cap",
			"dmp"
		]
	},
	"application/vnd.tmd.mediaflex.api+xml": {
		"source": "iana"
	},
	"application/vnd.tml": {
		"source": "iana"
	},
	"application/vnd.tmobile-livetv": {
		"source": "iana",
		"extensions": [
			"tmo"
		]
	},
	"application/vnd.tri.onesource": {
		"source": "iana"
	},
	"application/vnd.trid.tpt": {
		"source": "iana",
		"extensions": [
			"tpt"
		]
	},
	"application/vnd.triscape.mxs": {
		"source": "iana",
		"extensions": [
			"mxs"
		]
	},
	"application/vnd.trueapp": {
		"source": "iana",
		"extensions": [
			"tra"
		]
	},
	"application/vnd.truedoc": {
		"source": "iana"
	},
	"application/vnd.ubisoft.webplayer": {
		"source": "iana"
	},
	"application/vnd.ufdl": {
		"source": "iana",
		"extensions": [
			"ufd",
			"ufdl"
		]
	},
	"application/vnd.uiq.theme": {
		"source": "iana",
		"extensions": [
			"utz"
		]
	},
	"application/vnd.umajin": {
		"source": "iana",
		"extensions": [
			"umj"
		]
	},
	"application/vnd.unity": {
		"source": "iana",
		"extensions": [
			"unityweb"
		]
	},
	"application/vnd.uoml+xml": {
		"source": "iana",
		"extensions": [
			"uoml"
		]
	},
	"application/vnd.uplanet.alert": {
		"source": "iana"
	},
	"application/vnd.uplanet.alert-wbxml": {
		"source": "iana"
	},
	"application/vnd.uplanet.bearer-choice": {
		"source": "iana"
	},
	"application/vnd.uplanet.bearer-choice-wbxml": {
		"source": "iana"
	},
	"application/vnd.uplanet.cacheop": {
		"source": "iana"
	},
	"application/vnd.uplanet.cacheop-wbxml": {
		"source": "iana"
	},
	"application/vnd.uplanet.channel": {
		"source": "iana"
	},
	"application/vnd.uplanet.channel-wbxml": {
		"source": "iana"
	},
	"application/vnd.uplanet.list": {
		"source": "iana"
	},
	"application/vnd.uplanet.list-wbxml": {
		"source": "iana"
	},
	"application/vnd.uplanet.listcmd": {
		"source": "iana"
	},
	"application/vnd.uplanet.listcmd-wbxml": {
		"source": "iana"
	},
	"application/vnd.uplanet.signal": {
		"source": "iana"
	},
	"application/vnd.uri-map": {
		"source": "iana"
	},
	"application/vnd.valve.source.material": {
		"source": "iana"
	},
	"application/vnd.vcx": {
		"source": "iana",
		"extensions": [
			"vcx"
		]
	},
	"application/vnd.vd-study": {
		"source": "iana"
	},
	"application/vnd.vectorworks": {
		"source": "iana"
	},
	"application/vnd.vel+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.verimatrix.vcas": {
		"source": "iana"
	},
	"application/vnd.vidsoft.vidconference": {
		"source": "iana"
	},
	"application/vnd.visio": {
		"source": "iana",
		"extensions": [
			"vsd",
			"vst",
			"vss",
			"vsw"
		]
	},
	"application/vnd.visionary": {
		"source": "iana",
		"extensions": [
			"vis"
		]
	},
	"application/vnd.vividence.scriptfile": {
		"source": "iana"
	},
	"application/vnd.vsf": {
		"source": "iana",
		"extensions": [
			"vsf"
		]
	},
	"application/vnd.wap.sic": {
		"source": "iana"
	},
	"application/vnd.wap.slc": {
		"source": "iana"
	},
	"application/vnd.wap.wbxml": {
		"source": "iana",
		"extensions": [
			"wbxml"
		]
	},
	"application/vnd.wap.wmlc": {
		"source": "iana",
		"extensions": [
			"wmlc"
		]
	},
	"application/vnd.wap.wmlscriptc": {
		"source": "iana",
		"extensions": [
			"wmlsc"
		]
	},
	"application/vnd.webturbo": {
		"source": "iana",
		"extensions": [
			"wtb"
		]
	},
	"application/vnd.wfa.p2p": {
		"source": "iana"
	},
	"application/vnd.wfa.wsc": {
		"source": "iana"
	},
	"application/vnd.windows.devicepairing": {
		"source": "iana"
	},
	"application/vnd.wmc": {
		"source": "iana"
	},
	"application/vnd.wmf.bootstrap": {
		"source": "iana"
	},
	"application/vnd.wolfram.mathematica": {
		"source": "iana"
	},
	"application/vnd.wolfram.mathematica.package": {
		"source": "iana"
	},
	"application/vnd.wolfram.player": {
		"source": "iana",
		"extensions": [
			"nbp"
		]
	},
	"application/vnd.wordperfect": {
		"source": "iana",
		"extensions": [
			"wpd"
		]
	},
	"application/vnd.wqd": {
		"source": "iana",
		"extensions": [
			"wqd"
		]
	},
	"application/vnd.wrq-hp3000-labelled": {
		"source": "iana"
	},
	"application/vnd.wt.stf": {
		"source": "iana",
		"extensions": [
			"stf"
		]
	},
	"application/vnd.wv.csp+wbxml": {
		"source": "iana"
	},
	"application/vnd.wv.csp+xml": {
		"source": "iana"
	},
	"application/vnd.wv.ssp+xml": {
		"source": "iana"
	},
	"application/vnd.xacml+json": {
		"source": "iana",
		"compressible": true
	},
	"application/vnd.xara": {
		"source": "iana",
		"extensions": [
			"xar"
		]
	},
	"application/vnd.xfdl": {
		"source": "iana",
		"extensions": [
			"xfdl"
		]
	},
	"application/vnd.xfdl.webform": {
		"source": "iana"
	},
	"application/vnd.xmi+xml": {
		"source": "iana"
	},
	"application/vnd.xmpie.cpkg": {
		"source": "iana"
	},
	"application/vnd.xmpie.dpkg": {
		"source": "iana"
	},
	"application/vnd.xmpie.plan": {
		"source": "iana"
	},
	"application/vnd.xmpie.ppkg": {
		"source": "iana"
	},
	"application/vnd.xmpie.xlim": {
		"source": "iana"
	},
	"application/vnd.yamaha.hv-dic": {
		"source": "iana",
		"extensions": [
			"hvd"
		]
	},
	"application/vnd.yamaha.hv-script": {
		"source": "iana",
		"extensions": [
			"hvs"
		]
	},
	"application/vnd.yamaha.hv-voice": {
		"source": "iana",
		"extensions": [
			"hvp"
		]
	},
	"application/vnd.yamaha.openscoreformat": {
		"source": "iana",
		"extensions": [
			"osf"
		]
	},
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
		"source": "iana",
		"extensions": [
			"osfpvg"
		]
	},
	"application/vnd.yamaha.remote-setup": {
		"source": "iana"
	},
	"application/vnd.yamaha.smaf-audio": {
		"source": "iana",
		"extensions": [
			"saf"
		]
	},
	"application/vnd.yamaha.smaf-phrase": {
		"source": "iana",
		"extensions": [
			"spf"
		]
	},
	"application/vnd.yamaha.through-ngn": {
		"source": "iana"
	},
	"application/vnd.yamaha.tunnel-udpencap": {
		"source": "iana"
	},
	"application/vnd.yaoweme": {
		"source": "iana"
	},
	"application/vnd.yellowriver-custom-menu": {
		"source": "iana",
		"extensions": [
			"cmp"
		]
	},
	"application/vnd.zul": {
		"source": "iana",
		"extensions": [
			"zir",
			"zirz"
		]
	},
	"application/vnd.zzazz.deck+xml": {
		"source": "iana",
		"extensions": [
			"zaz"
		]
	},
	"application/voicexml+xml": {
		"source": "iana",
		"extensions": [
			"vxml"
		]
	},
	"application/vq-rtcpxr": {
		"source": "iana"
	},
	"application/watcherinfo+xml": {
		"source": "iana"
	},
	"application/whoispp-query": {
		"source": "iana"
	},
	"application/whoispp-response": {
		"source": "iana"
	},
	"application/widget": {
		"source": "iana",
		"extensions": [
			"wgt"
		]
	},
	"application/winhlp": {
		"source": "apache",
		"extensions": [
			"hlp"
		]
	},
	"application/wita": {
		"source": "iana"
	},
	"application/wordperfect5.1": {
		"source": "iana"
	},
	"application/wsdl+xml": {
		"source": "iana",
		"extensions": [
			"wsdl"
		]
	},
	"application/wspolicy+xml": {
		"source": "iana",
		"extensions": [
			"wspolicy"
		]
	},
	"application/x-7z-compressed": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"7z"
		]
	},
	"application/x-abiword": {
		"source": "apache",
		"extensions": [
			"abw"
		]
	},
	"application/x-ace-compressed": {
		"source": "apache",
		"extensions": [
			"ace"
		]
	},
	"application/x-amf": {
		"source": "apache"
	},
	"application/x-apple-diskimage": {
		"source": "apache",
		"extensions": [
			"dmg"
		]
	},
	"application/x-authorware-bin": {
		"source": "apache",
		"extensions": [
			"aab",
			"x32",
			"u32",
			"vox"
		]
	},
	"application/x-authorware-map": {
		"source": "apache",
		"extensions": [
			"aam"
		]
	},
	"application/x-authorware-seg": {
		"source": "apache",
		"extensions": [
			"aas"
		]
	},
	"application/x-bcpio": {
		"source": "apache",
		"extensions": [
			"bcpio"
		]
	},
	"application/x-bdoc": {
		"compressible": false,
		"extensions": [
			"bdoc"
		]
	},
	"application/x-bittorrent": {
		"source": "apache",
		"extensions": [
			"torrent"
		]
	},
	"application/x-blorb": {
		"source": "apache",
		"extensions": [
			"blb",
			"blorb"
		]
	},
	"application/x-bzip": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"bz"
		]
	},
	"application/x-bzip2": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"bz2",
			"boz"
		]
	},
	"application/x-cbr": {
		"source": "apache",
		"extensions": [
			"cbr",
			"cba",
			"cbt",
			"cbz",
			"cb7"
		]
	},
	"application/x-cdlink": {
		"source": "apache",
		"extensions": [
			"vcd"
		]
	},
	"application/x-cfs-compressed": {
		"source": "apache",
		"extensions": [
			"cfs"
		]
	},
	"application/x-chat": {
		"source": "apache",
		"extensions": [
			"chat"
		]
	},
	"application/x-chess-pgn": {
		"source": "apache",
		"extensions": [
			"pgn"
		]
	},
	"application/x-chrome-extension": {
		"extensions": [
			"crx"
		]
	},
	"application/x-cocoa": {
		"source": "nginx",
		"extensions": [
			"cco"
		]
	},
	"application/x-compress": {
		"source": "apache"
	},
	"application/x-conference": {
		"source": "apache",
		"extensions": [
			"nsc"
		]
	},
	"application/x-cpio": {
		"source": "apache",
		"extensions": [
			"cpio"
		]
	},
	"application/x-csh": {
		"source": "apache",
		"extensions": [
			"csh"
		]
	},
	"application/x-deb": {
		"compressible": false
	},
	"application/x-debian-package": {
		"source": "apache",
		"extensions": [
			"deb",
			"udeb"
		]
	},
	"application/x-dgc-compressed": {
		"source": "apache",
		"extensions": [
			"dgc"
		]
	},
	"application/x-director": {
		"source": "apache",
		"extensions": [
			"dir",
			"dcr",
			"dxr",
			"cst",
			"cct",
			"cxt",
			"w3d",
			"fgd",
			"swa"
		]
	},
	"application/x-doom": {
		"source": "apache",
		"extensions": [
			"wad"
		]
	},
	"application/x-dtbncx+xml": {
		"source": "apache",
		"extensions": [
			"ncx"
		]
	},
	"application/x-dtbook+xml": {
		"source": "apache",
		"extensions": [
			"dtb"
		]
	},
	"application/x-dtbresource+xml": {
		"source": "apache",
		"extensions": [
			"res"
		]
	},
	"application/x-dvi": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"dvi"
		]
	},
	"application/x-envoy": {
		"source": "apache",
		"extensions": [
			"evy"
		]
	},
	"application/x-eva": {
		"source": "apache",
		"extensions": [
			"eva"
		]
	},
	"application/x-font-bdf": {
		"source": "apache",
		"extensions": [
			"bdf"
		]
	},
	"application/x-font-dos": {
		"source": "apache"
	},
	"application/x-font-framemaker": {
		"source": "apache"
	},
	"application/x-font-ghostscript": {
		"source": "apache",
		"extensions": [
			"gsf"
		]
	},
	"application/x-font-libgrx": {
		"source": "apache"
	},
	"application/x-font-linux-psf": {
		"source": "apache",
		"extensions": [
			"psf"
		]
	},
	"application/x-font-otf": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"otf"
		]
	},
	"application/x-font-pcf": {
		"source": "apache",
		"extensions": [
			"pcf"
		]
	},
	"application/x-font-snf": {
		"source": "apache",
		"extensions": [
			"snf"
		]
	},
	"application/x-font-speedo": {
		"source": "apache"
	},
	"application/x-font-sunos-news": {
		"source": "apache"
	},
	"application/x-font-ttf": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"ttf",
			"ttc"
		]
	},
	"application/x-font-type1": {
		"source": "apache",
		"extensions": [
			"pfa",
			"pfb",
			"pfm",
			"afm"
		]
	},
	"application/x-font-vfont": {
		"source": "apache"
	},
	"application/x-freearc": {
		"source": "apache",
		"extensions": [
			"arc"
		]
	},
	"application/x-futuresplash": {
		"source": "apache",
		"extensions": [
			"spl"
		]
	},
	"application/x-gca-compressed": {
		"source": "apache",
		"extensions": [
			"gca"
		]
	},
	"application/x-glulx": {
		"source": "apache",
		"extensions": [
			"ulx"
		]
	},
	"application/x-gnumeric": {
		"source": "apache",
		"extensions": [
			"gnumeric"
		]
	},
	"application/x-gramps-xml": {
		"source": "apache",
		"extensions": [
			"gramps"
		]
	},
	"application/x-gtar": {
		"source": "apache",
		"extensions": [
			"gtar"
		]
	},
	"application/x-gzip": {
		"source": "apache"
	},
	"application/x-hdf": {
		"source": "apache",
		"extensions": [
			"hdf"
		]
	},
	"application/x-httpd-php": {
		"compressible": true,
		"extensions": [
			"php"
		]
	},
	"application/x-install-instructions": {
		"source": "apache",
		"extensions": [
			"install"
		]
	},
	"application/x-iso9660-image": {
		"source": "apache",
		"extensions": [
			"iso"
		]
	},
	"application/x-java-archive-diff": {
		"source": "nginx",
		"extensions": [
			"jardiff"
		]
	},
	"application/x-java-jnlp-file": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"jnlp"
		]
	},
	"application/x-javascript": {
		"compressible": true
	},
	"application/x-latex": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"latex"
		]
	},
	"application/x-lua-bytecode": {
		"extensions": [
			"luac"
		]
	},
	"application/x-lzh-compressed": {
		"source": "apache",
		"extensions": [
			"lzh",
			"lha"
		]
	},
	"application/x-makeself": {
		"source": "nginx",
		"extensions": [
			"run"
		]
	},
	"application/x-mie": {
		"source": "apache",
		"extensions": [
			"mie"
		]
	},
	"application/x-mobipocket-ebook": {
		"source": "apache",
		"extensions": [
			"prc",
			"mobi"
		]
	},
	"application/x-mpegurl": {
		"compressible": false
	},
	"application/x-ms-application": {
		"source": "apache",
		"extensions": [
			"application"
		]
	},
	"application/x-ms-shortcut": {
		"source": "apache",
		"extensions": [
			"lnk"
		]
	},
	"application/x-ms-wmd": {
		"source": "apache",
		"extensions": [
			"wmd"
		]
	},
	"application/x-ms-wmz": {
		"source": "apache",
		"extensions": [
			"wmz"
		]
	},
	"application/x-ms-xbap": {
		"source": "apache",
		"extensions": [
			"xbap"
		]
	},
	"application/x-msaccess": {
		"source": "apache",
		"extensions": [
			"mdb"
		]
	},
	"application/x-msbinder": {
		"source": "apache",
		"extensions": [
			"obd"
		]
	},
	"application/x-mscardfile": {
		"source": "apache",
		"extensions": [
			"crd"
		]
	},
	"application/x-msclip": {
		"source": "apache",
		"extensions": [
			"clp"
		]
	},
	"application/x-msdos-program": {
		"extensions": [
			"exe"
		]
	},
	"application/x-msdownload": {
		"source": "apache",
		"extensions": [
			"exe",
			"dll",
			"com",
			"bat",
			"msi"
		]
	},
	"application/x-msmediaview": {
		"source": "apache",
		"extensions": [
			"mvb",
			"m13",
			"m14"
		]
	},
	"application/x-msmetafile": {
		"source": "apache",
		"extensions": [
			"wmf",
			"wmz",
			"emf",
			"emz"
		]
	},
	"application/x-msmoney": {
		"source": "apache",
		"extensions": [
			"mny"
		]
	},
	"application/x-mspublisher": {
		"source": "apache",
		"extensions": [
			"pub"
		]
	},
	"application/x-msschedule": {
		"source": "apache",
		"extensions": [
			"scd"
		]
	},
	"application/x-msterminal": {
		"source": "apache",
		"extensions": [
			"trm"
		]
	},
	"application/x-mswrite": {
		"source": "apache",
		"extensions": [
			"wri"
		]
	},
	"application/x-netcdf": {
		"source": "apache",
		"extensions": [
			"nc",
			"cdf"
		]
	},
	"application/x-ns-proxy-autoconfig": {
		"compressible": true,
		"extensions": [
			"pac"
		]
	},
	"application/x-nzb": {
		"source": "apache",
		"extensions": [
			"nzb"
		]
	},
	"application/x-perl": {
		"source": "nginx",
		"extensions": [
			"pl",
			"pm"
		]
	},
	"application/x-pilot": {
		"source": "nginx",
		"extensions": [
			"prc",
			"pdb"
		]
	},
	"application/x-pkcs12": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"p12",
			"pfx"
		]
	},
	"application/x-pkcs7-certificates": {
		"source": "apache",
		"extensions": [
			"p7b",
			"spc"
		]
	},
	"application/x-pkcs7-certreqresp": {
		"source": "apache",
		"extensions": [
			"p7r"
		]
	},
	"application/x-rar-compressed": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"rar"
		]
	},
	"application/x-redhat-package-manager": {
		"source": "nginx",
		"extensions": [
			"rpm"
		]
	},
	"application/x-research-info-systems": {
		"source": "apache",
		"extensions": [
			"ris"
		]
	},
	"application/x-sea": {
		"source": "nginx",
		"extensions": [
			"sea"
		]
	},
	"application/x-sh": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"sh"
		]
	},
	"application/x-shar": {
		"source": "apache",
		"extensions": [
			"shar"
		]
	},
	"application/x-shockwave-flash": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"swf"
		]
	},
	"application/x-silverlight-app": {
		"source": "apache",
		"extensions": [
			"xap"
		]
	},
	"application/x-sql": {
		"source": "apache",
		"extensions": [
			"sql"
		]
	},
	"application/x-stuffit": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"sit"
		]
	},
	"application/x-stuffitx": {
		"source": "apache",
		"extensions": [
			"sitx"
		]
	},
	"application/x-subrip": {
		"source": "apache",
		"extensions": [
			"srt"
		]
	},
	"application/x-sv4cpio": {
		"source": "apache",
		"extensions": [
			"sv4cpio"
		]
	},
	"application/x-sv4crc": {
		"source": "apache",
		"extensions": [
			"sv4crc"
		]
	},
	"application/x-t3vm-image": {
		"source": "apache",
		"extensions": [
			"t3"
		]
	},
	"application/x-tads": {
		"source": "apache",
		"extensions": [
			"gam"
		]
	},
	"application/x-tar": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"tar"
		]
	},
	"application/x-tcl": {
		"source": "apache",
		"extensions": [
			"tcl",
			"tk"
		]
	},
	"application/x-tex": {
		"source": "apache",
		"extensions": [
			"tex"
		]
	},
	"application/x-tex-tfm": {
		"source": "apache",
		"extensions": [
			"tfm"
		]
	},
	"application/x-texinfo": {
		"source": "apache",
		"extensions": [
			"texinfo",
			"texi"
		]
	},
	"application/x-tgif": {
		"source": "apache",
		"extensions": [
			"obj"
		]
	},
	"application/x-ustar": {
		"source": "apache",
		"extensions": [
			"ustar"
		]
	},
	"application/x-wais-source": {
		"source": "apache",
		"extensions": [
			"src"
		]
	},
	"application/x-web-app-manifest+json": {
		"compressible": true,
		"extensions": [
			"webapp"
		]
	},
	"application/x-www-form-urlencoded": {
		"source": "iana",
		"compressible": true
	},
	"application/x-x509-ca-cert": {
		"source": "apache",
		"extensions": [
			"der",
			"crt",
			"pem"
		]
	},
	"application/x-xfig": {
		"source": "apache",
		"extensions": [
			"fig"
		]
	},
	"application/x-xliff+xml": {
		"source": "apache",
		"extensions": [
			"xlf"
		]
	},
	"application/x-xpinstall": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"xpi"
		]
	},
	"application/x-xz": {
		"source": "apache",
		"extensions": [
			"xz"
		]
	},
	"application/x-zmachine": {
		"source": "apache",
		"extensions": [
			"z1",
			"z2",
			"z3",
			"z4",
			"z5",
			"z6",
			"z7",
			"z8"
		]
	},
	"application/x400-bp": {
		"source": "iana"
	},
	"application/xacml+xml": {
		"source": "iana"
	},
	"application/xaml+xml": {
		"source": "apache",
		"extensions": [
			"xaml"
		]
	},
	"application/xcap-att+xml": {
		"source": "iana"
	},
	"application/xcap-caps+xml": {
		"source": "iana"
	},
	"application/xcap-diff+xml": {
		"source": "iana",
		"extensions": [
			"xdf"
		]
	},
	"application/xcap-el+xml": {
		"source": "iana"
	},
	"application/xcap-error+xml": {
		"source": "iana"
	},
	"application/xcap-ns+xml": {
		"source": "iana"
	},
	"application/xcon-conference-info+xml": {
		"source": "iana"
	},
	"application/xcon-conference-info-diff+xml": {
		"source": "iana"
	},
	"application/xenc+xml": {
		"source": "iana",
		"extensions": [
			"xenc"
		]
	},
	"application/xhtml+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"xhtml",
			"xht"
		]
	},
	"application/xhtml-voice+xml": {
		"source": "apache"
	},
	"application/xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"xml",
			"xsl",
			"xsd",
			"rng"
		]
	},
	"application/xml-dtd": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"dtd"
		]
	},
	"application/xml-external-parsed-entity": {
		"source": "iana"
	},
	"application/xml-patch+xml": {
		"source": "iana"
	},
	"application/xmpp+xml": {
		"source": "iana"
	},
	"application/xop+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"xop"
		]
	},
	"application/xproc+xml": {
		"source": "apache",
		"extensions": [
			"xpl"
		]
	},
	"application/xslt+xml": {
		"source": "iana",
		"extensions": [
			"xslt"
		]
	},
	"application/xspf+xml": {
		"source": "apache",
		"extensions": [
			"xspf"
		]
	},
	"application/xv+xml": {
		"source": "iana",
		"extensions": [
			"mxml",
			"xhvml",
			"xvml",
			"xvm"
		]
	},
	"application/yang": {
		"source": "iana",
		"extensions": [
			"yang"
		]
	},
	"application/yang-data+json": {
		"source": "iana",
		"compressible": true
	},
	"application/yang-data+xml": {
		"source": "iana"
	},
	"application/yang-patch+json": {
		"source": "iana",
		"compressible": true
	},
	"application/yang-patch+xml": {
		"source": "iana"
	},
	"application/yin+xml": {
		"source": "iana",
		"extensions": [
			"yin"
		]
	},
	"application/zip": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"zip"
		]
	},
	"application/zlib": {
		"source": "iana"
	},
	"audio/1d-interleaved-parityfec": {
		"source": "iana"
	},
	"audio/32kadpcm": {
		"source": "iana"
	},
	"audio/3gpp": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"3gpp"
		]
	},
	"audio/3gpp2": {
		"source": "iana"
	},
	"audio/ac3": {
		"source": "iana"
	},
	"audio/adpcm": {
		"source": "apache",
		"extensions": [
			"adp"
		]
	},
	"audio/amr": {
		"source": "iana"
	},
	"audio/amr-wb": {
		"source": "iana"
	},
	"audio/amr-wb+": {
		"source": "iana"
	},
	"audio/aptx": {
		"source": "iana"
	},
	"audio/asc": {
		"source": "iana"
	},
	"audio/atrac-advanced-lossless": {
		"source": "iana"
	},
	"audio/atrac-x": {
		"source": "iana"
	},
	"audio/atrac3": {
		"source": "iana"
	},
	"audio/basic": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"au",
			"snd"
		]
	},
	"audio/bv16": {
		"source": "iana"
	},
	"audio/bv32": {
		"source": "iana"
	},
	"audio/clearmode": {
		"source": "iana"
	},
	"audio/cn": {
		"source": "iana"
	},
	"audio/dat12": {
		"source": "iana"
	},
	"audio/dls": {
		"source": "iana"
	},
	"audio/dsr-es201108": {
		"source": "iana"
	},
	"audio/dsr-es202050": {
		"source": "iana"
	},
	"audio/dsr-es202211": {
		"source": "iana"
	},
	"audio/dsr-es202212": {
		"source": "iana"
	},
	"audio/dv": {
		"source": "iana"
	},
	"audio/dvi4": {
		"source": "iana"
	},
	"audio/eac3": {
		"source": "iana"
	},
	"audio/encaprtp": {
		"source": "iana"
	},
	"audio/evrc": {
		"source": "iana"
	},
	"audio/evrc-qcp": {
		"source": "iana"
	},
	"audio/evrc0": {
		"source": "iana"
	},
	"audio/evrc1": {
		"source": "iana"
	},
	"audio/evrcb": {
		"source": "iana"
	},
	"audio/evrcb0": {
		"source": "iana"
	},
	"audio/evrcb1": {
		"source": "iana"
	},
	"audio/evrcnw": {
		"source": "iana"
	},
	"audio/evrcnw0": {
		"source": "iana"
	},
	"audio/evrcnw1": {
		"source": "iana"
	},
	"audio/evrcwb": {
		"source": "iana"
	},
	"audio/evrcwb0": {
		"source": "iana"
	},
	"audio/evrcwb1": {
		"source": "iana"
	},
	"audio/evs": {
		"source": "iana"
	},
	"audio/fwdred": {
		"source": "iana"
	},
	"audio/g711-0": {
		"source": "iana"
	},
	"audio/g719": {
		"source": "iana"
	},
	"audio/g722": {
		"source": "iana"
	},
	"audio/g7221": {
		"source": "iana"
	},
	"audio/g723": {
		"source": "iana"
	},
	"audio/g726-16": {
		"source": "iana"
	},
	"audio/g726-24": {
		"source": "iana"
	},
	"audio/g726-32": {
		"source": "iana"
	},
	"audio/g726-40": {
		"source": "iana"
	},
	"audio/g728": {
		"source": "iana"
	},
	"audio/g729": {
		"source": "iana"
	},
	"audio/g7291": {
		"source": "iana"
	},
	"audio/g729d": {
		"source": "iana"
	},
	"audio/g729e": {
		"source": "iana"
	},
	"audio/gsm": {
		"source": "iana"
	},
	"audio/gsm-efr": {
		"source": "iana"
	},
	"audio/gsm-hr-08": {
		"source": "iana"
	},
	"audio/ilbc": {
		"source": "iana"
	},
	"audio/ip-mr_v2.5": {
		"source": "iana"
	},
	"audio/isac": {
		"source": "apache"
	},
	"audio/l16": {
		"source": "iana"
	},
	"audio/l20": {
		"source": "iana"
	},
	"audio/l24": {
		"source": "iana",
		"compressible": false
	},
	"audio/l8": {
		"source": "iana"
	},
	"audio/lpc": {
		"source": "iana"
	},
	"audio/melp": {
		"source": "iana"
	},
	"audio/melp1200": {
		"source": "iana"
	},
	"audio/melp2400": {
		"source": "iana"
	},
	"audio/melp600": {
		"source": "iana"
	},
	"audio/midi": {
		"source": "apache",
		"extensions": [
			"mid",
			"midi",
			"kar",
			"rmi"
		]
	},
	"audio/mobile-xmf": {
		"source": "iana"
	},
	"audio/mp3": {
		"compressible": false,
		"extensions": [
			"mp3"
		]
	},
	"audio/mp4": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"m4a",
			"mp4a"
		]
	},
	"audio/mp4a-latm": {
		"source": "iana"
	},
	"audio/mpa": {
		"source": "iana"
	},
	"audio/mpa-robust": {
		"source": "iana"
	},
	"audio/mpeg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"mpga",
			"mp2",
			"mp2a",
			"mp3",
			"m2a",
			"m3a"
		]
	},
	"audio/mpeg4-generic": {
		"source": "iana"
	},
	"audio/musepack": {
		"source": "apache"
	},
	"audio/ogg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"oga",
			"ogg",
			"spx"
		]
	},
	"audio/opus": {
		"source": "iana"
	},
	"audio/parityfec": {
		"source": "iana"
	},
	"audio/pcma": {
		"source": "iana"
	},
	"audio/pcma-wb": {
		"source": "iana"
	},
	"audio/pcmu": {
		"source": "iana"
	},
	"audio/pcmu-wb": {
		"source": "iana"
	},
	"audio/prs.sid": {
		"source": "iana"
	},
	"audio/qcelp": {
		"source": "iana"
	},
	"audio/raptorfec": {
		"source": "iana"
	},
	"audio/red": {
		"source": "iana"
	},
	"audio/rtp-enc-aescm128": {
		"source": "iana"
	},
	"audio/rtp-midi": {
		"source": "iana"
	},
	"audio/rtploopback": {
		"source": "iana"
	},
	"audio/rtx": {
		"source": "iana"
	},
	"audio/s3m": {
		"source": "apache",
		"extensions": [
			"s3m"
		]
	},
	"audio/silk": {
		"source": "apache",
		"extensions": [
			"sil"
		]
	},
	"audio/smv": {
		"source": "iana"
	},
	"audio/smv-qcp": {
		"source": "iana"
	},
	"audio/smv0": {
		"source": "iana"
	},
	"audio/sp-midi": {
		"source": "iana"
	},
	"audio/speex": {
		"source": "iana"
	},
	"audio/t140c": {
		"source": "iana"
	},
	"audio/t38": {
		"source": "iana"
	},
	"audio/telephone-event": {
		"source": "iana"
	},
	"audio/tone": {
		"source": "iana"
	},
	"audio/uemclip": {
		"source": "iana"
	},
	"audio/ulpfec": {
		"source": "iana"
	},
	"audio/vdvi": {
		"source": "iana"
	},
	"audio/vmr-wb": {
		"source": "iana"
	},
	"audio/vnd.3gpp.iufp": {
		"source": "iana"
	},
	"audio/vnd.4sb": {
		"source": "iana"
	},
	"audio/vnd.audiokoz": {
		"source": "iana"
	},
	"audio/vnd.celp": {
		"source": "iana"
	},
	"audio/vnd.cisco.nse": {
		"source": "iana"
	},
	"audio/vnd.cmles.radio-events": {
		"source": "iana"
	},
	"audio/vnd.cns.anp1": {
		"source": "iana"
	},
	"audio/vnd.cns.inf1": {
		"source": "iana"
	},
	"audio/vnd.dece.audio": {
		"source": "iana",
		"extensions": [
			"uva",
			"uvva"
		]
	},
	"audio/vnd.digital-winds": {
		"source": "iana",
		"extensions": [
			"eol"
		]
	},
	"audio/vnd.dlna.adts": {
		"source": "iana"
	},
	"audio/vnd.dolby.heaac.1": {
		"source": "iana"
	},
	"audio/vnd.dolby.heaac.2": {
		"source": "iana"
	},
	"audio/vnd.dolby.mlp": {
		"source": "iana"
	},
	"audio/vnd.dolby.mps": {
		"source": "iana"
	},
	"audio/vnd.dolby.pl2": {
		"source": "iana"
	},
	"audio/vnd.dolby.pl2x": {
		"source": "iana"
	},
	"audio/vnd.dolby.pl2z": {
		"source": "iana"
	},
	"audio/vnd.dolby.pulse.1": {
		"source": "iana"
	},
	"audio/vnd.dra": {
		"source": "iana",
		"extensions": [
			"dra"
		]
	},
	"audio/vnd.dts": {
		"source": "iana",
		"extensions": [
			"dts"
		]
	},
	"audio/vnd.dts.hd": {
		"source": "iana",
		"extensions": [
			"dtshd"
		]
	},
	"audio/vnd.dvb.file": {
		"source": "iana"
	},
	"audio/vnd.everad.plj": {
		"source": "iana"
	},
	"audio/vnd.hns.audio": {
		"source": "iana"
	},
	"audio/vnd.lucent.voice": {
		"source": "iana",
		"extensions": [
			"lvp"
		]
	},
	"audio/vnd.ms-playready.media.pya": {
		"source": "iana",
		"extensions": [
			"pya"
		]
	},
	"audio/vnd.nokia.mobile-xmf": {
		"source": "iana"
	},
	"audio/vnd.nortel.vbk": {
		"source": "iana"
	},
	"audio/vnd.nuera.ecelp4800": {
		"source": "iana",
		"extensions": [
			"ecelp4800"
		]
	},
	"audio/vnd.nuera.ecelp7470": {
		"source": "iana",
		"extensions": [
			"ecelp7470"
		]
	},
	"audio/vnd.nuera.ecelp9600": {
		"source": "iana",
		"extensions": [
			"ecelp9600"
		]
	},
	"audio/vnd.octel.sbc": {
		"source": "iana"
	},
	"audio/vnd.qcelp": {
		"source": "iana"
	},
	"audio/vnd.rhetorex.32kadpcm": {
		"source": "iana"
	},
	"audio/vnd.rip": {
		"source": "iana",
		"extensions": [
			"rip"
		]
	},
	"audio/vnd.rn-realaudio": {
		"compressible": false
	},
	"audio/vnd.sealedmedia.softseal.mpeg": {
		"source": "iana"
	},
	"audio/vnd.vmx.cvsd": {
		"source": "iana"
	},
	"audio/vnd.wave": {
		"compressible": false
	},
	"audio/vorbis": {
		"source": "iana",
		"compressible": false
	},
	"audio/vorbis-config": {
		"source": "iana"
	},
	"audio/wav": {
		"compressible": false,
		"extensions": [
			"wav"
		]
	},
	"audio/wave": {
		"compressible": false,
		"extensions": [
			"wav"
		]
	},
	"audio/webm": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"weba"
		]
	},
	"audio/x-aac": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"aac"
		]
	},
	"audio/x-aiff": {
		"source": "apache",
		"extensions": [
			"aif",
			"aiff",
			"aifc"
		]
	},
	"audio/x-caf": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"caf"
		]
	},
	"audio/x-flac": {
		"source": "apache",
		"extensions": [
			"flac"
		]
	},
	"audio/x-m4a": {
		"source": "nginx",
		"extensions": [
			"m4a"
		]
	},
	"audio/x-matroska": {
		"source": "apache",
		"extensions": [
			"mka"
		]
	},
	"audio/x-mpegurl": {
		"source": "apache",
		"extensions": [
			"m3u"
		]
	},
	"audio/x-ms-wax": {
		"source": "apache",
		"extensions": [
			"wax"
		]
	},
	"audio/x-ms-wma": {
		"source": "apache",
		"extensions": [
			"wma"
		]
	},
	"audio/x-pn-realaudio": {
		"source": "apache",
		"extensions": [
			"ram",
			"ra"
		]
	},
	"audio/x-pn-realaudio-plugin": {
		"source": "apache",
		"extensions": [
			"rmp"
		]
	},
	"audio/x-realaudio": {
		"source": "nginx",
		"extensions": [
			"ra"
		]
	},
	"audio/x-tta": {
		"source": "apache"
	},
	"audio/x-wav": {
		"source": "apache",
		"extensions": [
			"wav"
		]
	},
	"audio/xm": {
		"source": "apache",
		"extensions": [
			"xm"
		]
	},
	"chemical/x-cdx": {
		"source": "apache",
		"extensions": [
			"cdx"
		]
	},
	"chemical/x-cif": {
		"source": "apache",
		"extensions": [
			"cif"
		]
	},
	"chemical/x-cmdf": {
		"source": "apache",
		"extensions": [
			"cmdf"
		]
	},
	"chemical/x-cml": {
		"source": "apache",
		"extensions": [
			"cml"
		]
	},
	"chemical/x-csml": {
		"source": "apache",
		"extensions": [
			"csml"
		]
	},
	"chemical/x-pdb": {
		"source": "apache"
	},
	"chemical/x-xyz": {
		"source": "apache",
		"extensions": [
			"xyz"
		]
	},
	"font/opentype": {
		"compressible": true,
		"extensions": [
			"otf"
		]
	},
	"image/apng": {
		"compressible": false,
		"extensions": [
			"apng"
		]
	},
	"image/bmp": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"bmp"
		]
	},
	"image/cgm": {
		"source": "iana",
		"extensions": [
			"cgm"
		]
	},
	"image/dicom-rle": {
		"source": "iana"
	},
	"image/emf": {
		"source": "iana"
	},
	"image/fits": {
		"source": "iana"
	},
	"image/g3fax": {
		"source": "iana",
		"extensions": [
			"g3"
		]
	},
	"image/gif": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"gif"
		]
	},
	"image/ief": {
		"source": "iana",
		"extensions": [
			"ief"
		]
	},
	"image/jls": {
		"source": "iana"
	},
	"image/jp2": {
		"source": "iana"
	},
	"image/jpeg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"jpeg",
			"jpg",
			"jpe"
		]
	},
	"image/jpm": {
		"source": "iana"
	},
	"image/jpx": {
		"source": "iana"
	},
	"image/ktx": {
		"source": "iana",
		"extensions": [
			"ktx"
		]
	},
	"image/naplps": {
		"source": "iana"
	},
	"image/pjpeg": {
		"compressible": false
	},
	"image/png": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"png"
		]
	},
	"image/prs.btif": {
		"source": "iana",
		"extensions": [
			"btif"
		]
	},
	"image/prs.pti": {
		"source": "iana"
	},
	"image/pwg-raster": {
		"source": "iana"
	},
	"image/sgi": {
		"source": "apache",
		"extensions": [
			"sgi"
		]
	},
	"image/svg+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"svg",
			"svgz"
		]
	},
	"image/t38": {
		"source": "iana"
	},
	"image/tiff": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"tiff",
			"tif"
		]
	},
	"image/tiff-fx": {
		"source": "iana"
	},
	"image/vnd.adobe.photoshop": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"psd"
		]
	},
	"image/vnd.airzip.accelerator.azv": {
		"source": "iana"
	},
	"image/vnd.cns.inf2": {
		"source": "iana"
	},
	"image/vnd.dece.graphic": {
		"source": "iana",
		"extensions": [
			"uvi",
			"uvvi",
			"uvg",
			"uvvg"
		]
	},
	"image/vnd.djvu": {
		"source": "iana",
		"extensions": [
			"djvu",
			"djv"
		]
	},
	"image/vnd.dvb.subtitle": {
		"source": "iana",
		"extensions": [
			"sub"
		]
	},
	"image/vnd.dwg": {
		"source": "iana",
		"extensions": [
			"dwg"
		]
	},
	"image/vnd.dxf": {
		"source": "iana",
		"extensions": [
			"dxf"
		]
	},
	"image/vnd.fastbidsheet": {
		"source": "iana",
		"extensions": [
			"fbs"
		]
	},
	"image/vnd.fpx": {
		"source": "iana",
		"extensions": [
			"fpx"
		]
	},
	"image/vnd.fst": {
		"source": "iana",
		"extensions": [
			"fst"
		]
	},
	"image/vnd.fujixerox.edmics-mmr": {
		"source": "iana",
		"extensions": [
			"mmr"
		]
	},
	"image/vnd.fujixerox.edmics-rlc": {
		"source": "iana",
		"extensions": [
			"rlc"
		]
	},
	"image/vnd.globalgraphics.pgb": {
		"source": "iana"
	},
	"image/vnd.microsoft.icon": {
		"source": "iana"
	},
	"image/vnd.mix": {
		"source": "iana"
	},
	"image/vnd.mozilla.apng": {
		"source": "iana"
	},
	"image/vnd.ms-modi": {
		"source": "iana",
		"extensions": [
			"mdi"
		]
	},
	"image/vnd.ms-photo": {
		"source": "apache",
		"extensions": [
			"wdp"
		]
	},
	"image/vnd.net-fpx": {
		"source": "iana",
		"extensions": [
			"npx"
		]
	},
	"image/vnd.radiance": {
		"source": "iana"
	},
	"image/vnd.sealed.png": {
		"source": "iana"
	},
	"image/vnd.sealedmedia.softseal.gif": {
		"source": "iana"
	},
	"image/vnd.sealedmedia.softseal.jpg": {
		"source": "iana"
	},
	"image/vnd.svf": {
		"source": "iana"
	},
	"image/vnd.tencent.tap": {
		"source": "iana"
	},
	"image/vnd.valve.source.texture": {
		"source": "iana"
	},
	"image/vnd.wap.wbmp": {
		"source": "iana",
		"extensions": [
			"wbmp"
		]
	},
	"image/vnd.xiff": {
		"source": "iana",
		"extensions": [
			"xif"
		]
	},
	"image/vnd.zbrush.pcx": {
		"source": "iana"
	},
	"image/webp": {
		"source": "apache",
		"extensions": [
			"webp"
		]
	},
	"image/wmf": {
		"source": "iana"
	},
	"image/x-3ds": {
		"source": "apache",
		"extensions": [
			"3ds"
		]
	},
	"image/x-cmu-raster": {
		"source": "apache",
		"extensions": [
			"ras"
		]
	},
	"image/x-cmx": {
		"source": "apache",
		"extensions": [
			"cmx"
		]
	},
	"image/x-freehand": {
		"source": "apache",
		"extensions": [
			"fh",
			"fhc",
			"fh4",
			"fh5",
			"fh7"
		]
	},
	"image/x-icon": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"ico"
		]
	},
	"image/x-jng": {
		"source": "nginx",
		"extensions": [
			"jng"
		]
	},
	"image/x-mrsid-image": {
		"source": "apache",
		"extensions": [
			"sid"
		]
	},
	"image/x-ms-bmp": {
		"source": "nginx",
		"compressible": true,
		"extensions": [
			"bmp"
		]
	},
	"image/x-pcx": {
		"source": "apache",
		"extensions": [
			"pcx"
		]
	},
	"image/x-pict": {
		"source": "apache",
		"extensions": [
			"pic",
			"pct"
		]
	},
	"image/x-portable-anymap": {
		"source": "apache",
		"extensions": [
			"pnm"
		]
	},
	"image/x-portable-bitmap": {
		"source": "apache",
		"extensions": [
			"pbm"
		]
	},
	"image/x-portable-graymap": {
		"source": "apache",
		"extensions": [
			"pgm"
		]
	},
	"image/x-portable-pixmap": {
		"source": "apache",
		"extensions": [
			"ppm"
		]
	},
	"image/x-rgb": {
		"source": "apache",
		"extensions": [
			"rgb"
		]
	},
	"image/x-tga": {
		"source": "apache",
		"extensions": [
			"tga"
		]
	},
	"image/x-xbitmap": {
		"source": "apache",
		"extensions": [
			"xbm"
		]
	},
	"image/x-xcf": {
		"compressible": false
	},
	"image/x-xpixmap": {
		"source": "apache",
		"extensions": [
			"xpm"
		]
	},
	"image/x-xwindowdump": {
		"source": "apache",
		"extensions": [
			"xwd"
		]
	},
	"message/cpim": {
		"source": "iana"
	},
	"message/delivery-status": {
		"source": "iana"
	},
	"message/disposition-notification": {
		"source": "iana"
	},
	"message/external-body": {
		"source": "iana"
	},
	"message/feedback-report": {
		"source": "iana"
	},
	"message/global": {
		"source": "iana"
	},
	"message/global-delivery-status": {
		"source": "iana"
	},
	"message/global-disposition-notification": {
		"source": "iana"
	},
	"message/global-headers": {
		"source": "iana"
	},
	"message/http": {
		"source": "iana",
		"compressible": false
	},
	"message/imdn+xml": {
		"source": "iana",
		"compressible": true
	},
	"message/news": {
		"source": "iana"
	},
	"message/partial": {
		"source": "iana",
		"compressible": false
	},
	"message/rfc822": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"eml",
			"mime"
		]
	},
	"message/s-http": {
		"source": "iana"
	},
	"message/sip": {
		"source": "iana"
	},
	"message/sipfrag": {
		"source": "iana"
	},
	"message/tracking-status": {
		"source": "iana"
	},
	"message/vnd.si.simp": {
		"source": "iana"
	},
	"message/vnd.wfa.wsc": {
		"source": "iana"
	},
	"model/gltf+json": {
		"source": "iana",
		"compressible": true
	},
	"model/iges": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"igs",
			"iges"
		]
	},
	"model/mesh": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"msh",
			"mesh",
			"silo"
		]
	},
	"model/vnd.collada+xml": {
		"source": "iana",
		"extensions": [
			"dae"
		]
	},
	"model/vnd.dwf": {
		"source": "iana",
		"extensions": [
			"dwf"
		]
	},
	"model/vnd.flatland.3dml": {
		"source": "iana"
	},
	"model/vnd.gdl": {
		"source": "iana",
		"extensions": [
			"gdl"
		]
	},
	"model/vnd.gs-gdl": {
		"source": "apache"
	},
	"model/vnd.gs.gdl": {
		"source": "iana"
	},
	"model/vnd.gtw": {
		"source": "iana",
		"extensions": [
			"gtw"
		]
	},
	"model/vnd.moml+xml": {
		"source": "iana"
	},
	"model/vnd.mts": {
		"source": "iana",
		"extensions": [
			"mts"
		]
	},
	"model/vnd.opengex": {
		"source": "iana"
	},
	"model/vnd.parasolid.transmit.binary": {
		"source": "iana"
	},
	"model/vnd.parasolid.transmit.text": {
		"source": "iana"
	},
	"model/vnd.rosette.annotated-data-model": {
		"source": "iana"
	},
	"model/vnd.valve.source.compiled-map": {
		"source": "iana"
	},
	"model/vnd.vtu": {
		"source": "iana",
		"extensions": [
			"vtu"
		]
	},
	"model/vrml": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"wrl",
			"vrml"
		]
	},
	"model/x3d+binary": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"x3db",
			"x3dbz"
		]
	},
	"model/x3d+fastinfoset": {
		"source": "iana"
	},
	"model/x3d+vrml": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"x3dv",
			"x3dvz"
		]
	},
	"model/x3d+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"x3d",
			"x3dz"
		]
	},
	"model/x3d-vrml": {
		"source": "iana"
	},
	"multipart/alternative": {
		"source": "iana",
		"compressible": false
	},
	"multipart/appledouble": {
		"source": "iana"
	},
	"multipart/byteranges": {
		"source": "iana"
	},
	"multipart/digest": {
		"source": "iana"
	},
	"multipart/encrypted": {
		"source": "iana",
		"compressible": false
	},
	"multipart/form-data": {
		"source": "iana",
		"compressible": false
	},
	"multipart/header-set": {
		"source": "iana"
	},
	"multipart/mixed": {
		"source": "iana",
		"compressible": false
	},
	"multipart/parallel": {
		"source": "iana"
	},
	"multipart/related": {
		"source": "iana",
		"compressible": false
	},
	"multipart/report": {
		"source": "iana"
	},
	"multipart/signed": {
		"source": "iana",
		"compressible": false
	},
	"multipart/voice-message": {
		"source": "iana"
	},
	"multipart/x-mixed-replace": {
		"source": "iana"
	},
	"text/1d-interleaved-parityfec": {
		"source": "iana"
	},
	"text/cache-manifest": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"appcache",
			"manifest"
		]
	},
	"text/calendar": {
		"source": "iana",
		"extensions": [
			"ics",
			"ifb"
		]
	},
	"text/calender": {
		"compressible": true
	},
	"text/cmd": {
		"compressible": true
	},
	"text/coffeescript": {
		"extensions": [
			"coffee",
			"litcoffee"
		]
	},
	"text/css": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"css"
		]
	},
	"text/csv": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"csv"
		]
	},
	"text/csv-schema": {
		"source": "iana"
	},
	"text/directory": {
		"source": "iana"
	},
	"text/dns": {
		"source": "iana"
	},
	"text/ecmascript": {
		"source": "iana"
	},
	"text/encaprtp": {
		"source": "iana"
	},
	"text/enriched": {
		"source": "iana"
	},
	"text/fwdred": {
		"source": "iana"
	},
	"text/grammar-ref-list": {
		"source": "iana"
	},
	"text/hjson": {
		"extensions": [
			"hjson"
		]
	},
	"text/html": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"html",
			"htm",
			"shtml"
		]
	},
	"text/jade": {
		"extensions": [
			"jade"
		]
	},
	"text/javascript": {
		"source": "iana",
		"compressible": true
	},
	"text/jcr-cnd": {
		"source": "iana"
	},
	"text/jsx": {
		"compressible": true,
		"extensions": [
			"jsx"
		]
	},
	"text/less": {
		"extensions": [
			"less"
		]
	},
	"text/markdown": {
		"source": "iana"
	},
	"text/mathml": {
		"source": "nginx",
		"extensions": [
			"mml"
		]
	},
	"text/mizar": {
		"source": "iana"
	},
	"text/n3": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"n3"
		]
	},
	"text/parameters": {
		"source": "iana"
	},
	"text/parityfec": {
		"source": "iana"
	},
	"text/plain": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"txt",
			"text",
			"conf",
			"def",
			"list",
			"log",
			"in",
			"ini"
		]
	},
	"text/provenance-notation": {
		"source": "iana"
	},
	"text/prs.fallenstein.rst": {
		"source": "iana"
	},
	"text/prs.lines.tag": {
		"source": "iana",
		"extensions": [
			"dsc"
		]
	},
	"text/prs.prop.logic": {
		"source": "iana"
	},
	"text/raptorfec": {
		"source": "iana"
	},
	"text/red": {
		"source": "iana"
	},
	"text/rfc822-headers": {
		"source": "iana"
	},
	"text/richtext": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"rtx"
		]
	},
	"text/rtf": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"rtf"
		]
	},
	"text/rtp-enc-aescm128": {
		"source": "iana"
	},
	"text/rtploopback": {
		"source": "iana"
	},
	"text/rtx": {
		"source": "iana"
	},
	"text/sgml": {
		"source": "iana",
		"extensions": [
			"sgml",
			"sgm"
		]
	},
	"text/slim": {
		"extensions": [
			"slim",
			"slm"
		]
	},
	"text/stylus": {
		"extensions": [
			"stylus",
			"styl"
		]
	},
	"text/t140": {
		"source": "iana"
	},
	"text/tab-separated-values": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"tsv"
		]
	},
	"text/troff": {
		"source": "iana",
		"extensions": [
			"t",
			"tr",
			"roff",
			"man",
			"me",
			"ms"
		]
	},
	"text/turtle": {
		"source": "iana",
		"extensions": [
			"ttl"
		]
	},
	"text/ulpfec": {
		"source": "iana"
	},
	"text/uri-list": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"uri",
			"uris",
			"urls"
		]
	},
	"text/vcard": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"vcard"
		]
	},
	"text/vnd.a": {
		"source": "iana"
	},
	"text/vnd.abc": {
		"source": "iana"
	},
	"text/vnd.ascii-art": {
		"source": "iana"
	},
	"text/vnd.curl": {
		"source": "iana",
		"extensions": [
			"curl"
		]
	},
	"text/vnd.curl.dcurl": {
		"source": "apache",
		"extensions": [
			"dcurl"
		]
	},
	"text/vnd.curl.mcurl": {
		"source": "apache",
		"extensions": [
			"mcurl"
		]
	},
	"text/vnd.curl.scurl": {
		"source": "apache",
		"extensions": [
			"scurl"
		]
	},
	"text/vnd.debian.copyright": {
		"source": "iana"
	},
	"text/vnd.dmclientscript": {
		"source": "iana"
	},
	"text/vnd.dvb.subtitle": {
		"source": "iana",
		"extensions": [
			"sub"
		]
	},
	"text/vnd.esmertec.theme-descriptor": {
		"source": "iana"
	},
	"text/vnd.fly": {
		"source": "iana",
		"extensions": [
			"fly"
		]
	},
	"text/vnd.fmi.flexstor": {
		"source": "iana",
		"extensions": [
			"flx"
		]
	},
	"text/vnd.graphviz": {
		"source": "iana",
		"extensions": [
			"gv"
		]
	},
	"text/vnd.in3d.3dml": {
		"source": "iana",
		"extensions": [
			"3dml"
		]
	},
	"text/vnd.in3d.spot": {
		"source": "iana",
		"extensions": [
			"spot"
		]
	},
	"text/vnd.iptc.newsml": {
		"source": "iana"
	},
	"text/vnd.iptc.nitf": {
		"source": "iana"
	},
	"text/vnd.latex-z": {
		"source": "iana"
	},
	"text/vnd.motorola.reflex": {
		"source": "iana"
	},
	"text/vnd.ms-mediapackage": {
		"source": "iana"
	},
	"text/vnd.net2phone.commcenter.command": {
		"source": "iana"
	},
	"text/vnd.radisys.msml-basic-layout": {
		"source": "iana"
	},
	"text/vnd.si.uricatalogue": {
		"source": "iana"
	},
	"text/vnd.sun.j2me.app-descriptor": {
		"source": "iana",
		"extensions": [
			"jad"
		]
	},
	"text/vnd.trolltech.linguist": {
		"source": "iana"
	},
	"text/vnd.wap.si": {
		"source": "iana"
	},
	"text/vnd.wap.sl": {
		"source": "iana"
	},
	"text/vnd.wap.wml": {
		"source": "iana",
		"extensions": [
			"wml"
		]
	},
	"text/vnd.wap.wmlscript": {
		"source": "iana",
		"extensions": [
			"wmls"
		]
	},
	"text/vtt": {
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"vtt"
		]
	},
	"text/x-asm": {
		"source": "apache",
		"extensions": [
			"s",
			"asm"
		]
	},
	"text/x-c": {
		"source": "apache",
		"extensions": [
			"c",
			"cc",
			"cxx",
			"cpp",
			"h",
			"hh",
			"dic"
		]
	},
	"text/x-component": {
		"source": "nginx",
		"extensions": [
			"htc"
		]
	},
	"text/x-fortran": {
		"source": "apache",
		"extensions": [
			"f",
			"for",
			"f77",
			"f90"
		]
	},
	"text/x-gwt-rpc": {
		"compressible": true
	},
	"text/x-handlebars-template": {
		"extensions": [
			"hbs"
		]
	},
	"text/x-java-source": {
		"source": "apache",
		"extensions": [
			"java"
		]
	},
	"text/x-jquery-tmpl": {
		"compressible": true
	},
	"text/x-lua": {
		"extensions": [
			"lua"
		]
	},
	"text/x-markdown": {
		"compressible": true,
		"extensions": [
			"markdown",
			"md",
			"mkd"
		]
	},
	"text/x-nfo": {
		"source": "apache",
		"extensions": [
			"nfo"
		]
	},
	"text/x-opml": {
		"source": "apache",
		"extensions": [
			"opml"
		]
	},
	"text/x-pascal": {
		"source": "apache",
		"extensions": [
			"p",
			"pas"
		]
	},
	"text/x-processing": {
		"compressible": true,
		"extensions": [
			"pde"
		]
	},
	"text/x-sass": {
		"extensions": [
			"sass"
		]
	},
	"text/x-scss": {
		"extensions": [
			"scss"
		]
	},
	"text/x-setext": {
		"source": "apache",
		"extensions": [
			"etx"
		]
	},
	"text/x-sfv": {
		"source": "apache",
		"extensions": [
			"sfv"
		]
	},
	"text/x-suse-ymp": {
		"compressible": true,
		"extensions": [
			"ymp"
		]
	},
	"text/x-uuencode": {
		"source": "apache",
		"extensions": [
			"uu"
		]
	},
	"text/x-vcalendar": {
		"source": "apache",
		"extensions": [
			"vcs"
		]
	},
	"text/x-vcard": {
		"source": "apache",
		"extensions": [
			"vcf"
		]
	},
	"text/xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"xml"
		]
	},
	"text/xml-external-parsed-entity": {
		"source": "iana"
	},
	"text/yaml": {
		"extensions": [
			"yaml",
			"yml"
		]
	},
	"video/1d-interleaved-parityfec": {
		"source": "apache"
	},
	"video/3gpp": {
		"source": "apache",
		"extensions": [
			"3gp",
			"3gpp"
		]
	},
	"video/3gpp-tt": {
		"source": "apache"
	},
	"video/3gpp2": {
		"source": "apache",
		"extensions": [
			"3g2"
		]
	},
	"video/bmpeg": {
		"source": "apache"
	},
	"video/bt656": {
		"source": "apache"
	},
	"video/celb": {
		"source": "apache"
	},
	"video/dv": {
		"source": "apache"
	},
	"video/encaprtp": {
		"source": "apache"
	},
	"video/h261": {
		"source": "apache",
		"extensions": [
			"h261"
		]
	},
	"video/h263": {
		"source": "apache",
		"extensions": [
			"h263"
		]
	},
	"video/h263-1998": {
		"source": "apache"
	},
	"video/h263-2000": {
		"source": "apache"
	},
	"video/h264": {
		"source": "apache",
		"extensions": [
			"h264"
		]
	},
	"video/h264-rcdo": {
		"source": "apache"
	},
	"video/h264-svc": {
		"source": "apache"
	},
	"video/h265": {
		"source": "apache"
	},
	"video/iso.segment": {
		"source": "apache"
	},
	"video/jpeg": {
		"source": "apache",
		"extensions": [
			"jpgv"
		]
	},
	"video/jpeg2000": {
		"source": "apache"
	},
	"video/jpm": {
		"source": "apache",
		"extensions": [
			"jpm",
			"jpgm"
		]
	},
	"video/mj2": {
		"source": "apache",
		"extensions": [
			"mj2",
			"mjp2"
		]
	},
	"video/mp1s": {
		"source": "apache"
	},
	"video/mp2p": {
		"source": "apache"
	},
	"video/mp2t": {
		"source": "apache",
		"extensions": [
			"ts"
		]
	},
	"video/mp4": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"mp4",
			"mp4v",
			"mpg4"
		]
	},
	"video/mp4v-es": {
		"source": "apache"
	},
	"video/mpeg": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"mpeg",
			"mpg",
			"mpe",
			"m1v",
			"m2v"
		]
	},
	"video/mpeg4-generic": {
		"source": "apache"
	},
	"video/mpv": {
		"source": "apache"
	},
	"video/nv": {
		"source": "apache"
	},
	"video/ogg": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"ogv"
		]
	},
	"video/parityfec": {
		"source": "apache"
	},
	"video/pointer": {
		"source": "apache"
	},
	"video/quicktime": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"qt",
			"mov"
		]
	},
	"video/raptorfec": {
		"source": "apache"
	},
	"video/raw": {
		"source": "apache"
	},
	"video/rtp-enc-aescm128": {
		"source": "apache"
	},
	"video/rtploopback": {
		"source": "apache"
	},
	"video/rtx": {
		"source": "apache"
	},
	"video/smpte292m": {
		"source": "apache"
	},
	"video/ulpfec": {
		"source": "apache"
	},
	"video/vc1": {
		"source": "apache"
	},
	"video/vnd.cctv": {
		"source": "apache"
	},
	"video/vnd.dece.hd": {
		"source": "apache",
		"extensions": [
			"uvh",
			"uvvh"
		]
	},
	"video/vnd.dece.mobile": {
		"source": "apache",
		"extensions": [
			"uvm",
			"uvvm"
		]
	},
	"video/vnd.dece.mp4": {
		"source": "apache"
	},
	"video/vnd.dece.pd": {
		"source": "apache",
		"extensions": [
			"uvp",
			"uvvp"
		]
	},
	"video/vnd.dece.sd": {
		"source": "apache",
		"extensions": [
			"uvs",
			"uvvs"
		]
	},
	"video/vnd.dece.video": {
		"source": "apache",
		"extensions": [
			"uvv",
			"uvvv"
		]
	},
	"video/vnd.directv.mpeg": {
		"source": "apache"
	},
	"video/vnd.directv.mpeg-tts": {
		"source": "apache"
	},
	"video/vnd.dlna.mpeg-tts": {
		"source": "apache"
	},
	"video/vnd.dvb.file": {
		"source": "apache",
		"extensions": [
			"dvb"
		]
	},
	"video/vnd.fvt": {
		"source": "apache",
		"extensions": [
			"fvt"
		]
	},
	"video/vnd.hns.video": {
		"source": "apache"
	},
	"video/vnd.iptvforum.1dparityfec-1010": {
		"source": "apache"
	},
	"video/vnd.iptvforum.1dparityfec-2005": {
		"source": "apache"
	},
	"video/vnd.iptvforum.2dparityfec-1010": {
		"source": "apache"
	},
	"video/vnd.iptvforum.2dparityfec-2005": {
		"source": "apache"
	},
	"video/vnd.iptvforum.ttsavc": {
		"source": "apache"
	},
	"video/vnd.iptvforum.ttsmpeg2": {
		"source": "apache"
	},
	"video/vnd.motorola.video": {
		"source": "apache"
	},
	"video/vnd.motorola.videop": {
		"source": "apache"
	},
	"video/vnd.mpegurl": {
		"source": "apache",
		"extensions": [
			"mxu",
			"m4u"
		]
	},
	"video/vnd.ms-playready.media.pyv": {
		"source": "apache",
		"extensions": [
			"pyv"
		]
	},
	"video/vnd.nokia.interleaved-multimedia": {
		"source": "apache"
	},
	"video/vnd.nokia.videovoip": {
		"source": "apache"
	},
	"video/vnd.objectvideo": {
		"source": "apache"
	},
	"video/vnd.radgamettools.bink": {
		"source": "apache"
	},
	"video/vnd.radgamettools.smacker": {
		"source": "apache"
	},
	"video/vnd.sealed.mpeg1": {
		"source": "apache"
	},
	"video/vnd.sealed.mpeg4": {
		"source": "apache"
	},
	"video/vnd.sealed.swf": {
		"source": "apache"
	},
	"video/vnd.sealedmedia.softseal.mov": {
		"source": "apache"
	},
	"video/vnd.uvvu.mp4": {
		"source": "apache",
		"extensions": [
			"uvu",
			"uvvu"
		]
	},
	"video/vnd.vivo": {
		"source": "apache",
		"extensions": [
			"viv"
		]
	},
	"video/vp8": {
		"source": "apache"
	},
	"video/webm": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"webm"
		]
	},
	"video/x-f4v": {
		"source": "apache",
		"extensions": [
			"f4v"
		]
	},
	"video/x-fli": {
		"source": "apache",
		"extensions": [
			"fli"
		]
	},
	"video/x-flv": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"flv"
		]
	},
	"video/x-m4v": {
		"source": "apache",
		"extensions": [
			"m4v"
		]
	},
	"video/x-matroska": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"mkv",
			"mk3d",
			"mks"
		]
	},
	"video/x-mng": {
		"source": "apache",
		"extensions": [
			"mng"
		]
	},
	"video/x-ms-asf": {
		"source": "apache",
		"extensions": [
			"asf",
			"asx"
		]
	},
	"video/x-ms-vob": {
		"source": "apache",
		"extensions": [
			"vob"
		]
	},
	"video/x-ms-wm": {
		"source": "apache",
		"extensions": [
			"wm"
		]
	},
	"video/x-ms-wmv": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"wmv"
		]
	},
	"video/x-ms-wmx": {
		"source": "apache",
		"extensions": [
			"wmx"
		]
	},
	"video/x-ms-wvx": {
		"source": "apache",
		"extensions": [
			"wvx"
		]
	},
	"video/x-msvideo": {
		"source": "apache",
		"extensions": [
			"avi"
		]
	},
	"video/x-sgi-movie": {
		"source": "apache",
		"extensions": [
			"movie"
		]
	},
	"video/x-smv": {
		"source": "apache",
		"extensions": [
			"smv"
		]
	},
	"x-conference/x-cooltalk": {
		"source": "apache",
		"extensions": [
			"ice"
		]
	},
	"x-shader/x-fragment": {
		"compressible": true
	},
	"x-shader/x-vertex": {
		"compressible": true
	}
};

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __webpack_require__(219)


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(5);
var fs = __webpack_require__(7);

function Mime() {
  // Map of extension -> mime type
  this.types = Object.create(null);

  // Map of mime type -> extension
  this.extensions = Object.create(null);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * @param map (Object) type definitions
 */
Mime.prototype.define = function (map) {
  for (var type in map) {
    var exts = map[type];
    for (var i = 0; i < exts.length; i++) {
      if (process.env.DEBUG_MIME && this.types[exts]) {
        console.warn(this._loading.replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
          this.types[exts] + ' to ' + type);
      }

      this.types[exts[i]] = type;
    }

    // Default extension is the first one we encounter
    if (!this.extensions[type]) {
      this.extensions[type] = exts[0];
    }
  }
};

/**
 * Load an Apache2-style ".types" file
 *
 * This may be called multiple times (it's expected).  Where files declare
 * overlapping types/extensions, the last file wins.
 *
 * @param file (String) path of file to load.
 */
Mime.prototype.load = function(file) {
  this._loading = file;
  // Read file and split into lines
  var map = {},
      content = fs.readFileSync(file, 'ascii'),
      lines = content.split(/[\r\n]+/);

  lines.forEach(function(line) {
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
    map[fields.shift()] = fields;
  });

  this.define(map);

  this._loading = null;
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.lookup = function(path, fallback) {
  var ext = path.replace(/.*[\.\/\\]/, '').toLowerCase();

  return this.types[ext] || fallback || this.default_type;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.extension = function(mimeType) {
  var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  return this.extensions[type];
};

// Default instance
var mime = new Mime();

// Define built-in types
mime.define(__webpack_require__(222));

// Default type
mime.default_type = mime.lookup('bin');

//
// Additional API specific to the default instance
//

mime.Mime = Mime;

/**
 * Lookup a charset based on mime type.
 */
mime.charsets = {
  lookup: function(mimeType, fallback) {
    // Assume text types are utf8
    return (/^text\//).test(mimeType) ? 'UTF-8' : fallback;
  }
};

module.exports = mime;


/***/ }),
/* 222 */
/***/ (function(module, exports) {

module.exports = {
	"application/andrew-inset": [
		"ez"
	],
	"application/applixware": [
		"aw"
	],
	"application/atom+xml": [
		"atom"
	],
	"application/atomcat+xml": [
		"atomcat"
	],
	"application/atomsvc+xml": [
		"atomsvc"
	],
	"application/ccxml+xml": [
		"ccxml"
	],
	"application/cdmi-capability": [
		"cdmia"
	],
	"application/cdmi-container": [
		"cdmic"
	],
	"application/cdmi-domain": [
		"cdmid"
	],
	"application/cdmi-object": [
		"cdmio"
	],
	"application/cdmi-queue": [
		"cdmiq"
	],
	"application/cu-seeme": [
		"cu"
	],
	"application/dash+xml": [
		"mdp"
	],
	"application/davmount+xml": [
		"davmount"
	],
	"application/docbook+xml": [
		"dbk"
	],
	"application/dssc+der": [
		"dssc"
	],
	"application/dssc+xml": [
		"xdssc"
	],
	"application/ecmascript": [
		"ecma"
	],
	"application/emma+xml": [
		"emma"
	],
	"application/epub+zip": [
		"epub"
	],
	"application/exi": [
		"exi"
	],
	"application/font-tdpfr": [
		"pfr"
	],
	"application/font-woff": [
		"woff"
	],
	"application/font-woff2": [
		"woff2"
	],
	"application/gml+xml": [
		"gml"
	],
	"application/gpx+xml": [
		"gpx"
	],
	"application/gxf": [
		"gxf"
	],
	"application/hyperstudio": [
		"stk"
	],
	"application/inkml+xml": [
		"ink",
		"inkml"
	],
	"application/ipfix": [
		"ipfix"
	],
	"application/java-archive": [
		"jar"
	],
	"application/java-serialized-object": [
		"ser"
	],
	"application/java-vm": [
		"class"
	],
	"application/javascript": [
		"js"
	],
	"application/json": [
		"json",
		"map"
	],
	"application/json5": [
		"json5"
	],
	"application/jsonml+json": [
		"jsonml"
	],
	"application/lost+xml": [
		"lostxml"
	],
	"application/mac-binhex40": [
		"hqx"
	],
	"application/mac-compactpro": [
		"cpt"
	],
	"application/mads+xml": [
		"mads"
	],
	"application/marc": [
		"mrc"
	],
	"application/marcxml+xml": [
		"mrcx"
	],
	"application/mathematica": [
		"ma",
		"nb",
		"mb"
	],
	"application/mathml+xml": [
		"mathml"
	],
	"application/mbox": [
		"mbox"
	],
	"application/mediaservercontrol+xml": [
		"mscml"
	],
	"application/metalink+xml": [
		"metalink"
	],
	"application/metalink4+xml": [
		"meta4"
	],
	"application/mets+xml": [
		"mets"
	],
	"application/mods+xml": [
		"mods"
	],
	"application/mp21": [
		"m21",
		"mp21"
	],
	"application/mp4": [
		"mp4s",
		"m4p"
	],
	"application/msword": [
		"doc",
		"dot"
	],
	"application/mxf": [
		"mxf"
	],
	"application/octet-stream": [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"buffer"
	],
	"application/oda": [
		"oda"
	],
	"application/oebps-package+xml": [
		"opf"
	],
	"application/ogg": [
		"ogx"
	],
	"application/omdoc+xml": [
		"omdoc"
	],
	"application/onenote": [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg"
	],
	"application/oxps": [
		"oxps"
	],
	"application/patch-ops-error+xml": [
		"xer"
	],
	"application/pdf": [
		"pdf"
	],
	"application/pgp-encrypted": [
		"pgp"
	],
	"application/pgp-signature": [
		"asc",
		"sig"
	],
	"application/pics-rules": [
		"prf"
	],
	"application/pkcs10": [
		"p10"
	],
	"application/pkcs7-mime": [
		"p7m",
		"p7c"
	],
	"application/pkcs7-signature": [
		"p7s"
	],
	"application/pkcs8": [
		"p8"
	],
	"application/pkix-attr-cert": [
		"ac"
	],
	"application/pkix-cert": [
		"cer"
	],
	"application/pkix-crl": [
		"crl"
	],
	"application/pkix-pkipath": [
		"pkipath"
	],
	"application/pkixcmp": [
		"pki"
	],
	"application/pls+xml": [
		"pls"
	],
	"application/postscript": [
		"ai",
		"eps",
		"ps"
	],
	"application/prs.cww": [
		"cww"
	],
	"application/pskc+xml": [
		"pskcxml"
	],
	"application/rdf+xml": [
		"rdf"
	],
	"application/reginfo+xml": [
		"rif"
	],
	"application/relax-ng-compact-syntax": [
		"rnc"
	],
	"application/resource-lists+xml": [
		"rl"
	],
	"application/resource-lists-diff+xml": [
		"rld"
	],
	"application/rls-services+xml": [
		"rs"
	],
	"application/rpki-ghostbusters": [
		"gbr"
	],
	"application/rpki-manifest": [
		"mft"
	],
	"application/rpki-roa": [
		"roa"
	],
	"application/rsd+xml": [
		"rsd"
	],
	"application/rss+xml": [
		"rss"
	],
	"application/rtf": [
		"rtf"
	],
	"application/sbml+xml": [
		"sbml"
	],
	"application/scvp-cv-request": [
		"scq"
	],
	"application/scvp-cv-response": [
		"scs"
	],
	"application/scvp-vp-request": [
		"spq"
	],
	"application/scvp-vp-response": [
		"spp"
	],
	"application/sdp": [
		"sdp"
	],
	"application/set-payment-initiation": [
		"setpay"
	],
	"application/set-registration-initiation": [
		"setreg"
	],
	"application/shf+xml": [
		"shf"
	],
	"application/smil+xml": [
		"smi",
		"smil"
	],
	"application/sparql-query": [
		"rq"
	],
	"application/sparql-results+xml": [
		"srx"
	],
	"application/srgs": [
		"gram"
	],
	"application/srgs+xml": [
		"grxml"
	],
	"application/sru+xml": [
		"sru"
	],
	"application/ssdl+xml": [
		"ssdl"
	],
	"application/ssml+xml": [
		"ssml"
	],
	"application/tei+xml": [
		"tei",
		"teicorpus"
	],
	"application/thraud+xml": [
		"tfi"
	],
	"application/timestamped-data": [
		"tsd"
	],
	"application/vnd.3gpp.pic-bw-large": [
		"plb"
	],
	"application/vnd.3gpp.pic-bw-small": [
		"psb"
	],
	"application/vnd.3gpp.pic-bw-var": [
		"pvb"
	],
	"application/vnd.3gpp2.tcap": [
		"tcap"
	],
	"application/vnd.3m.post-it-notes": [
		"pwn"
	],
	"application/vnd.accpac.simply.aso": [
		"aso"
	],
	"application/vnd.accpac.simply.imp": [
		"imp"
	],
	"application/vnd.acucobol": [
		"acu"
	],
	"application/vnd.acucorp": [
		"atc",
		"acutc"
	],
	"application/vnd.adobe.air-application-installer-package+zip": [
		"air"
	],
	"application/vnd.adobe.formscentral.fcdt": [
		"fcdt"
	],
	"application/vnd.adobe.fxp": [
		"fxp",
		"fxpl"
	],
	"application/vnd.adobe.xdp+xml": [
		"xdp"
	],
	"application/vnd.adobe.xfdf": [
		"xfdf"
	],
	"application/vnd.ahead.space": [
		"ahead"
	],
	"application/vnd.airzip.filesecure.azf": [
		"azf"
	],
	"application/vnd.airzip.filesecure.azs": [
		"azs"
	],
	"application/vnd.amazon.ebook": [
		"azw"
	],
	"application/vnd.americandynamics.acc": [
		"acc"
	],
	"application/vnd.amiga.ami": [
		"ami"
	],
	"application/vnd.android.package-archive": [
		"apk"
	],
	"application/vnd.anser-web-certificate-issue-initiation": [
		"cii"
	],
	"application/vnd.anser-web-funds-transfer-initiation": [
		"fti"
	],
	"application/vnd.antix.game-component": [
		"atx"
	],
	"application/vnd.apple.installer+xml": [
		"mpkg"
	],
	"application/vnd.apple.mpegurl": [
		"m3u8"
	],
	"application/vnd.aristanetworks.swi": [
		"swi"
	],
	"application/vnd.astraea-software.iota": [
		"iota"
	],
	"application/vnd.audiograph": [
		"aep"
	],
	"application/vnd.blueice.multipass": [
		"mpm"
	],
	"application/vnd.bmi": [
		"bmi"
	],
	"application/vnd.businessobjects": [
		"rep"
	],
	"application/vnd.chemdraw+xml": [
		"cdxml"
	],
	"application/vnd.chipnuts.karaoke-mmd": [
		"mmd"
	],
	"application/vnd.cinderella": [
		"cdy"
	],
	"application/vnd.claymore": [
		"cla"
	],
	"application/vnd.cloanto.rp9": [
		"rp9"
	],
	"application/vnd.clonk.c4group": [
		"c4g",
		"c4d",
		"c4f",
		"c4p",
		"c4u"
	],
	"application/vnd.cluetrust.cartomobile-config": [
		"c11amc"
	],
	"application/vnd.cluetrust.cartomobile-config-pkg": [
		"c11amz"
	],
	"application/vnd.commonspace": [
		"csp"
	],
	"application/vnd.contact.cmsg": [
		"cdbcmsg"
	],
	"application/vnd.cosmocaller": [
		"cmc"
	],
	"application/vnd.crick.clicker": [
		"clkx"
	],
	"application/vnd.crick.clicker.keyboard": [
		"clkk"
	],
	"application/vnd.crick.clicker.palette": [
		"clkp"
	],
	"application/vnd.crick.clicker.template": [
		"clkt"
	],
	"application/vnd.crick.clicker.wordbank": [
		"clkw"
	],
	"application/vnd.criticaltools.wbs+xml": [
		"wbs"
	],
	"application/vnd.ctc-posml": [
		"pml"
	],
	"application/vnd.cups-ppd": [
		"ppd"
	],
	"application/vnd.curl.car": [
		"car"
	],
	"application/vnd.curl.pcurl": [
		"pcurl"
	],
	"application/vnd.dart": [
		"dart"
	],
	"application/vnd.data-vision.rdz": [
		"rdz"
	],
	"application/vnd.dece.data": [
		"uvf",
		"uvvf",
		"uvd",
		"uvvd"
	],
	"application/vnd.dece.ttml+xml": [
		"uvt",
		"uvvt"
	],
	"application/vnd.dece.unspecified": [
		"uvx",
		"uvvx"
	],
	"application/vnd.dece.zip": [
		"uvz",
		"uvvz"
	],
	"application/vnd.denovo.fcselayout-link": [
		"fe_launch"
	],
	"application/vnd.dna": [
		"dna"
	],
	"application/vnd.dolby.mlp": [
		"mlp"
	],
	"application/vnd.dpgraph": [
		"dpg"
	],
	"application/vnd.dreamfactory": [
		"dfac"
	],
	"application/vnd.ds-keypoint": [
		"kpxx"
	],
	"application/vnd.dvb.ait": [
		"ait"
	],
	"application/vnd.dvb.service": [
		"svc"
	],
	"application/vnd.dynageo": [
		"geo"
	],
	"application/vnd.ecowin.chart": [
		"mag"
	],
	"application/vnd.enliven": [
		"nml"
	],
	"application/vnd.epson.esf": [
		"esf"
	],
	"application/vnd.epson.msf": [
		"msf"
	],
	"application/vnd.epson.quickanime": [
		"qam"
	],
	"application/vnd.epson.salt": [
		"slt"
	],
	"application/vnd.epson.ssf": [
		"ssf"
	],
	"application/vnd.eszigno3+xml": [
		"es3",
		"et3"
	],
	"application/vnd.ezpix-album": [
		"ez2"
	],
	"application/vnd.ezpix-package": [
		"ez3"
	],
	"application/vnd.fdf": [
		"fdf"
	],
	"application/vnd.fdsn.mseed": [
		"mseed"
	],
	"application/vnd.fdsn.seed": [
		"seed",
		"dataless"
	],
	"application/vnd.flographit": [
		"gph"
	],
	"application/vnd.fluxtime.clip": [
		"ftc"
	],
	"application/vnd.framemaker": [
		"fm",
		"frame",
		"maker",
		"book"
	],
	"application/vnd.frogans.fnc": [
		"fnc"
	],
	"application/vnd.frogans.ltf": [
		"ltf"
	],
	"application/vnd.fsc.weblaunch": [
		"fsc"
	],
	"application/vnd.fujitsu.oasys": [
		"oas"
	],
	"application/vnd.fujitsu.oasys2": [
		"oa2"
	],
	"application/vnd.fujitsu.oasys3": [
		"oa3"
	],
	"application/vnd.fujitsu.oasysgp": [
		"fg5"
	],
	"application/vnd.fujitsu.oasysprs": [
		"bh2"
	],
	"application/vnd.fujixerox.ddd": [
		"ddd"
	],
	"application/vnd.fujixerox.docuworks": [
		"xdw"
	],
	"application/vnd.fujixerox.docuworks.binder": [
		"xbd"
	],
	"application/vnd.fuzzysheet": [
		"fzs"
	],
	"application/vnd.genomatix.tuxedo": [
		"txd"
	],
	"application/vnd.geogebra.file": [
		"ggb"
	],
	"application/vnd.geogebra.tool": [
		"ggt"
	],
	"application/vnd.geometry-explorer": [
		"gex",
		"gre"
	],
	"application/vnd.geonext": [
		"gxt"
	],
	"application/vnd.geoplan": [
		"g2w"
	],
	"application/vnd.geospace": [
		"g3w"
	],
	"application/vnd.gmx": [
		"gmx"
	],
	"application/vnd.google-earth.kml+xml": [
		"kml"
	],
	"application/vnd.google-earth.kmz": [
		"kmz"
	],
	"application/vnd.grafeq": [
		"gqf",
		"gqs"
	],
	"application/vnd.groove-account": [
		"gac"
	],
	"application/vnd.groove-help": [
		"ghf"
	],
	"application/vnd.groove-identity-message": [
		"gim"
	],
	"application/vnd.groove-injector": [
		"grv"
	],
	"application/vnd.groove-tool-message": [
		"gtm"
	],
	"application/vnd.groove-tool-template": [
		"tpl"
	],
	"application/vnd.groove-vcard": [
		"vcg"
	],
	"application/vnd.hal+xml": [
		"hal"
	],
	"application/vnd.handheld-entertainment+xml": [
		"zmm"
	],
	"application/vnd.hbci": [
		"hbci"
	],
	"application/vnd.hhe.lesson-player": [
		"les"
	],
	"application/vnd.hp-hpgl": [
		"hpgl"
	],
	"application/vnd.hp-hpid": [
		"hpid"
	],
	"application/vnd.hp-hps": [
		"hps"
	],
	"application/vnd.hp-jlyt": [
		"jlt"
	],
	"application/vnd.hp-pcl": [
		"pcl"
	],
	"application/vnd.hp-pclxl": [
		"pclxl"
	],
	"application/vnd.ibm.minipay": [
		"mpy"
	],
	"application/vnd.ibm.modcap": [
		"afp",
		"listafp",
		"list3820"
	],
	"application/vnd.ibm.rights-management": [
		"irm"
	],
	"application/vnd.ibm.secure-container": [
		"sc"
	],
	"application/vnd.iccprofile": [
		"icc",
		"icm"
	],
	"application/vnd.igloader": [
		"igl"
	],
	"application/vnd.immervision-ivp": [
		"ivp"
	],
	"application/vnd.immervision-ivu": [
		"ivu"
	],
	"application/vnd.insors.igm": [
		"igm"
	],
	"application/vnd.intercon.formnet": [
		"xpw",
		"xpx"
	],
	"application/vnd.intergeo": [
		"i2g"
	],
	"application/vnd.intu.qbo": [
		"qbo"
	],
	"application/vnd.intu.qfx": [
		"qfx"
	],
	"application/vnd.ipunplugged.rcprofile": [
		"rcprofile"
	],
	"application/vnd.irepository.package+xml": [
		"irp"
	],
	"application/vnd.is-xpr": [
		"xpr"
	],
	"application/vnd.isac.fcs": [
		"fcs"
	],
	"application/vnd.jam": [
		"jam"
	],
	"application/vnd.jcp.javame.midlet-rms": [
		"rms"
	],
	"application/vnd.jisp": [
		"jisp"
	],
	"application/vnd.joost.joda-archive": [
		"joda"
	],
	"application/vnd.kahootz": [
		"ktz",
		"ktr"
	],
	"application/vnd.kde.karbon": [
		"karbon"
	],
	"application/vnd.kde.kchart": [
		"chrt"
	],
	"application/vnd.kde.kformula": [
		"kfo"
	],
	"application/vnd.kde.kivio": [
		"flw"
	],
	"application/vnd.kde.kontour": [
		"kon"
	],
	"application/vnd.kde.kpresenter": [
		"kpr",
		"kpt"
	],
	"application/vnd.kde.kspread": [
		"ksp"
	],
	"application/vnd.kde.kword": [
		"kwd",
		"kwt"
	],
	"application/vnd.kenameaapp": [
		"htke"
	],
	"application/vnd.kidspiration": [
		"kia"
	],
	"application/vnd.kinar": [
		"kne",
		"knp"
	],
	"application/vnd.koan": [
		"skp",
		"skd",
		"skt",
		"skm"
	],
	"application/vnd.kodak-descriptor": [
		"sse"
	],
	"application/vnd.las.las+xml": [
		"lasxml"
	],
	"application/vnd.llamagraphics.life-balance.desktop": [
		"lbd"
	],
	"application/vnd.llamagraphics.life-balance.exchange+xml": [
		"lbe"
	],
	"application/vnd.lotus-1-2-3": [
		"123"
	],
	"application/vnd.lotus-approach": [
		"apr"
	],
	"application/vnd.lotus-freelance": [
		"pre"
	],
	"application/vnd.lotus-notes": [
		"nsf"
	],
	"application/vnd.lotus-organizer": [
		"org"
	],
	"application/vnd.lotus-screencam": [
		"scm"
	],
	"application/vnd.lotus-wordpro": [
		"lwp"
	],
	"application/vnd.macports.portpkg": [
		"portpkg"
	],
	"application/vnd.mcd": [
		"mcd"
	],
	"application/vnd.medcalcdata": [
		"mc1"
	],
	"application/vnd.mediastation.cdkey": [
		"cdkey"
	],
	"application/vnd.mfer": [
		"mwf"
	],
	"application/vnd.mfmp": [
		"mfm"
	],
	"application/vnd.micrografx.flo": [
		"flo"
	],
	"application/vnd.micrografx.igx": [
		"igx"
	],
	"application/vnd.mif": [
		"mif"
	],
	"application/vnd.mobius.daf": [
		"daf"
	],
	"application/vnd.mobius.dis": [
		"dis"
	],
	"application/vnd.mobius.mbk": [
		"mbk"
	],
	"application/vnd.mobius.mqy": [
		"mqy"
	],
	"application/vnd.mobius.msl": [
		"msl"
	],
	"application/vnd.mobius.plc": [
		"plc"
	],
	"application/vnd.mobius.txf": [
		"txf"
	],
	"application/vnd.mophun.application": [
		"mpn"
	],
	"application/vnd.mophun.certificate": [
		"mpc"
	],
	"application/vnd.mozilla.xul+xml": [
		"xul"
	],
	"application/vnd.ms-artgalry": [
		"cil"
	],
	"application/vnd.ms-cab-compressed": [
		"cab"
	],
	"application/vnd.ms-excel": [
		"xls",
		"xlm",
		"xla",
		"xlc",
		"xlt",
		"xlw"
	],
	"application/vnd.ms-excel.addin.macroenabled.12": [
		"xlam"
	],
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": [
		"xlsb"
	],
	"application/vnd.ms-excel.sheet.macroenabled.12": [
		"xlsm"
	],
	"application/vnd.ms-excel.template.macroenabled.12": [
		"xltm"
	],
	"application/vnd.ms-fontobject": [
		"eot"
	],
	"application/vnd.ms-htmlhelp": [
		"chm"
	],
	"application/vnd.ms-ims": [
		"ims"
	],
	"application/vnd.ms-lrm": [
		"lrm"
	],
	"application/vnd.ms-officetheme": [
		"thmx"
	],
	"application/vnd.ms-pki.seccat": [
		"cat"
	],
	"application/vnd.ms-pki.stl": [
		"stl"
	],
	"application/vnd.ms-powerpoint": [
		"ppt",
		"pps",
		"pot"
	],
	"application/vnd.ms-powerpoint.addin.macroenabled.12": [
		"ppam"
	],
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": [
		"pptm"
	],
	"application/vnd.ms-powerpoint.slide.macroenabled.12": [
		"sldm"
	],
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": [
		"ppsm"
	],
	"application/vnd.ms-powerpoint.template.macroenabled.12": [
		"potm"
	],
	"application/vnd.ms-project": [
		"mpp",
		"mpt"
	],
	"application/vnd.ms-word.document.macroenabled.12": [
		"docm"
	],
	"application/vnd.ms-word.template.macroenabled.12": [
		"dotm"
	],
	"application/vnd.ms-works": [
		"wps",
		"wks",
		"wcm",
		"wdb"
	],
	"application/vnd.ms-wpl": [
		"wpl"
	],
	"application/vnd.ms-xpsdocument": [
		"xps"
	],
	"application/vnd.mseq": [
		"mseq"
	],
	"application/vnd.musician": [
		"mus"
	],
	"application/vnd.muvee.style": [
		"msty"
	],
	"application/vnd.mynfc": [
		"taglet"
	],
	"application/vnd.neurolanguage.nlu": [
		"nlu"
	],
	"application/vnd.nitf": [
		"ntf",
		"nitf"
	],
	"application/vnd.noblenet-directory": [
		"nnd"
	],
	"application/vnd.noblenet-sealer": [
		"nns"
	],
	"application/vnd.noblenet-web": [
		"nnw"
	],
	"application/vnd.nokia.n-gage.data": [
		"ngdat"
	],
	"application/vnd.nokia.radio-preset": [
		"rpst"
	],
	"application/vnd.nokia.radio-presets": [
		"rpss"
	],
	"application/vnd.novadigm.edm": [
		"edm"
	],
	"application/vnd.novadigm.edx": [
		"edx"
	],
	"application/vnd.novadigm.ext": [
		"ext"
	],
	"application/vnd.oasis.opendocument.chart": [
		"odc"
	],
	"application/vnd.oasis.opendocument.chart-template": [
		"otc"
	],
	"application/vnd.oasis.opendocument.database": [
		"odb"
	],
	"application/vnd.oasis.opendocument.formula": [
		"odf"
	],
	"application/vnd.oasis.opendocument.formula-template": [
		"odft"
	],
	"application/vnd.oasis.opendocument.graphics": [
		"odg"
	],
	"application/vnd.oasis.opendocument.graphics-template": [
		"otg"
	],
	"application/vnd.oasis.opendocument.image": [
		"odi"
	],
	"application/vnd.oasis.opendocument.image-template": [
		"oti"
	],
	"application/vnd.oasis.opendocument.presentation": [
		"odp"
	],
	"application/vnd.oasis.opendocument.presentation-template": [
		"otp"
	],
	"application/vnd.oasis.opendocument.spreadsheet": [
		"ods"
	],
	"application/vnd.oasis.opendocument.spreadsheet-template": [
		"ots"
	],
	"application/vnd.oasis.opendocument.text": [
		"odt"
	],
	"application/vnd.oasis.opendocument.text-master": [
		"odm"
	],
	"application/vnd.oasis.opendocument.text-template": [
		"ott"
	],
	"application/vnd.oasis.opendocument.text-web": [
		"oth"
	],
	"application/vnd.olpc-sugar": [
		"xo"
	],
	"application/vnd.oma.dd2+xml": [
		"dd2"
	],
	"application/vnd.openofficeorg.extension": [
		"oxt"
	],
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": [
		"pptx"
	],
	"application/vnd.openxmlformats-officedocument.presentationml.slide": [
		"sldx"
	],
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": [
		"ppsx"
	],
	"application/vnd.openxmlformats-officedocument.presentationml.template": [
		"potx"
	],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
		"xlsx"
	],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": [
		"xltx"
	],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		"docx"
	],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": [
		"dotx"
	],
	"application/vnd.osgeo.mapguide.package": [
		"mgp"
	],
	"application/vnd.osgi.dp": [
		"dp"
	],
	"application/vnd.osgi.subsystem": [
		"esa"
	],
	"application/vnd.palm": [
		"pdb",
		"pqa",
		"oprc"
	],
	"application/vnd.pawaafile": [
		"paw"
	],
	"application/vnd.pg.format": [
		"str"
	],
	"application/vnd.pg.osasli": [
		"ei6"
	],
	"application/vnd.picsel": [
		"efif"
	],
	"application/vnd.pmi.widget": [
		"wg"
	],
	"application/vnd.pocketlearn": [
		"plf"
	],
	"application/vnd.powerbuilder6": [
		"pbd"
	],
	"application/vnd.previewsystems.box": [
		"box"
	],
	"application/vnd.proteus.magazine": [
		"mgz"
	],
	"application/vnd.publishare-delta-tree": [
		"qps"
	],
	"application/vnd.pvi.ptid1": [
		"ptid"
	],
	"application/vnd.quark.quarkxpress": [
		"qxd",
		"qxt",
		"qwd",
		"qwt",
		"qxl",
		"qxb"
	],
	"application/vnd.realvnc.bed": [
		"bed"
	],
	"application/vnd.recordare.musicxml": [
		"mxl"
	],
	"application/vnd.recordare.musicxml+xml": [
		"musicxml"
	],
	"application/vnd.rig.cryptonote": [
		"cryptonote"
	],
	"application/vnd.rim.cod": [
		"cod"
	],
	"application/vnd.rn-realmedia": [
		"rm"
	],
	"application/vnd.rn-realmedia-vbr": [
		"rmvb"
	],
	"application/vnd.route66.link66+xml": [
		"link66"
	],
	"application/vnd.sailingtracker.track": [
		"st"
	],
	"application/vnd.seemail": [
		"see"
	],
	"application/vnd.sema": [
		"sema"
	],
	"application/vnd.semd": [
		"semd"
	],
	"application/vnd.semf": [
		"semf"
	],
	"application/vnd.shana.informed.formdata": [
		"ifm"
	],
	"application/vnd.shana.informed.formtemplate": [
		"itp"
	],
	"application/vnd.shana.informed.interchange": [
		"iif"
	],
	"application/vnd.shana.informed.package": [
		"ipk"
	],
	"application/vnd.simtech-mindmapper": [
		"twd",
		"twds"
	],
	"application/vnd.smaf": [
		"mmf"
	],
	"application/vnd.smart.teacher": [
		"teacher"
	],
	"application/vnd.solent.sdkm+xml": [
		"sdkm",
		"sdkd"
	],
	"application/vnd.spotfire.dxp": [
		"dxp"
	],
	"application/vnd.spotfire.sfs": [
		"sfs"
	],
	"application/vnd.stardivision.calc": [
		"sdc"
	],
	"application/vnd.stardivision.draw": [
		"sda"
	],
	"application/vnd.stardivision.impress": [
		"sdd"
	],
	"application/vnd.stardivision.math": [
		"smf"
	],
	"application/vnd.stardivision.writer": [
		"sdw",
		"vor"
	],
	"application/vnd.stardivision.writer-global": [
		"sgl"
	],
	"application/vnd.stepmania.package": [
		"smzip"
	],
	"application/vnd.stepmania.stepchart": [
		"sm"
	],
	"application/vnd.sun.xml.calc": [
		"sxc"
	],
	"application/vnd.sun.xml.calc.template": [
		"stc"
	],
	"application/vnd.sun.xml.draw": [
		"sxd"
	],
	"application/vnd.sun.xml.draw.template": [
		"std"
	],
	"application/vnd.sun.xml.impress": [
		"sxi"
	],
	"application/vnd.sun.xml.impress.template": [
		"sti"
	],
	"application/vnd.sun.xml.math": [
		"sxm"
	],
	"application/vnd.sun.xml.writer": [
		"sxw"
	],
	"application/vnd.sun.xml.writer.global": [
		"sxg"
	],
	"application/vnd.sun.xml.writer.template": [
		"stw"
	],
	"application/vnd.sus-calendar": [
		"sus",
		"susp"
	],
	"application/vnd.svd": [
		"svd"
	],
	"application/vnd.symbian.install": [
		"sis",
		"sisx"
	],
	"application/vnd.syncml+xml": [
		"xsm"
	],
	"application/vnd.syncml.dm+wbxml": [
		"bdm"
	],
	"application/vnd.syncml.dm+xml": [
		"xdm"
	],
	"application/vnd.tao.intent-module-archive": [
		"tao"
	],
	"application/vnd.tcpdump.pcap": [
		"pcap",
		"cap",
		"dmp"
	],
	"application/vnd.tmobile-livetv": [
		"tmo"
	],
	"application/vnd.trid.tpt": [
		"tpt"
	],
	"application/vnd.triscape.mxs": [
		"mxs"
	],
	"application/vnd.trueapp": [
		"tra"
	],
	"application/vnd.ufdl": [
		"ufd",
		"ufdl"
	],
	"application/vnd.uiq.theme": [
		"utz"
	],
	"application/vnd.umajin": [
		"umj"
	],
	"application/vnd.unity": [
		"unityweb"
	],
	"application/vnd.uoml+xml": [
		"uoml"
	],
	"application/vnd.vcx": [
		"vcx"
	],
	"application/vnd.visio": [
		"vsd",
		"vst",
		"vss",
		"vsw"
	],
	"application/vnd.visionary": [
		"vis"
	],
	"application/vnd.vsf": [
		"vsf"
	],
	"application/vnd.wap.wbxml": [
		"wbxml"
	],
	"application/vnd.wap.wmlc": [
		"wmlc"
	],
	"application/vnd.wap.wmlscriptc": [
		"wmlsc"
	],
	"application/vnd.webturbo": [
		"wtb"
	],
	"application/vnd.wolfram.player": [
		"nbp"
	],
	"application/vnd.wordperfect": [
		"wpd"
	],
	"application/vnd.wqd": [
		"wqd"
	],
	"application/vnd.wt.stf": [
		"stf"
	],
	"application/vnd.xara": [
		"xar"
	],
	"application/vnd.xfdl": [
		"xfdl"
	],
	"application/vnd.yamaha.hv-dic": [
		"hvd"
	],
	"application/vnd.yamaha.hv-script": [
		"hvs"
	],
	"application/vnd.yamaha.hv-voice": [
		"hvp"
	],
	"application/vnd.yamaha.openscoreformat": [
		"osf"
	],
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": [
		"osfpvg"
	],
	"application/vnd.yamaha.smaf-audio": [
		"saf"
	],
	"application/vnd.yamaha.smaf-phrase": [
		"spf"
	],
	"application/vnd.yellowriver-custom-menu": [
		"cmp"
	],
	"application/vnd.zul": [
		"zir",
		"zirz"
	],
	"application/vnd.zzazz.deck+xml": [
		"zaz"
	],
	"application/voicexml+xml": [
		"vxml"
	],
	"application/widget": [
		"wgt"
	],
	"application/winhlp": [
		"hlp"
	],
	"application/wsdl+xml": [
		"wsdl"
	],
	"application/wspolicy+xml": [
		"wspolicy"
	],
	"application/x-7z-compressed": [
		"7z"
	],
	"application/x-abiword": [
		"abw"
	],
	"application/x-ace-compressed": [
		"ace"
	],
	"application/x-apple-diskimage": [
		"dmg"
	],
	"application/x-authorware-bin": [
		"aab",
		"x32",
		"u32",
		"vox"
	],
	"application/x-authorware-map": [
		"aam"
	],
	"application/x-authorware-seg": [
		"aas"
	],
	"application/x-bcpio": [
		"bcpio"
	],
	"application/x-bittorrent": [
		"torrent"
	],
	"application/x-blorb": [
		"blb",
		"blorb"
	],
	"application/x-bzip": [
		"bz"
	],
	"application/x-bzip2": [
		"bz2",
		"boz"
	],
	"application/x-cbr": [
		"cbr",
		"cba",
		"cbt",
		"cbz",
		"cb7"
	],
	"application/x-cdlink": [
		"vcd"
	],
	"application/x-cfs-compressed": [
		"cfs"
	],
	"application/x-chat": [
		"chat"
	],
	"application/x-chess-pgn": [
		"pgn"
	],
	"application/x-chrome-extension": [
		"crx"
	],
	"application/x-conference": [
		"nsc"
	],
	"application/x-cpio": [
		"cpio"
	],
	"application/x-csh": [
		"csh"
	],
	"application/x-debian-package": [
		"deb",
		"udeb"
	],
	"application/x-dgc-compressed": [
		"dgc"
	],
	"application/x-director": [
		"dir",
		"dcr",
		"dxr",
		"cst",
		"cct",
		"cxt",
		"w3d",
		"fgd",
		"swa"
	],
	"application/x-doom": [
		"wad"
	],
	"application/x-dtbncx+xml": [
		"ncx"
	],
	"application/x-dtbook+xml": [
		"dtb"
	],
	"application/x-dtbresource+xml": [
		"res"
	],
	"application/x-dvi": [
		"dvi"
	],
	"application/x-envoy": [
		"evy"
	],
	"application/x-eva": [
		"eva"
	],
	"application/x-font-bdf": [
		"bdf"
	],
	"application/x-font-ghostscript": [
		"gsf"
	],
	"application/x-font-linux-psf": [
		"psf"
	],
	"application/x-font-otf": [
		"otf"
	],
	"application/x-font-pcf": [
		"pcf"
	],
	"application/x-font-snf": [
		"snf"
	],
	"application/x-font-ttf": [
		"ttf",
		"ttc"
	],
	"application/x-font-type1": [
		"pfa",
		"pfb",
		"pfm",
		"afm"
	],
	"application/x-freearc": [
		"arc"
	],
	"application/x-futuresplash": [
		"spl"
	],
	"application/x-gca-compressed": [
		"gca"
	],
	"application/x-glulx": [
		"ulx"
	],
	"application/x-gnumeric": [
		"gnumeric"
	],
	"application/x-gramps-xml": [
		"gramps"
	],
	"application/x-gtar": [
		"gtar"
	],
	"application/x-hdf": [
		"hdf"
	],
	"application/x-install-instructions": [
		"install"
	],
	"application/x-iso9660-image": [
		"iso"
	],
	"application/x-java-jnlp-file": [
		"jnlp"
	],
	"application/x-latex": [
		"latex"
	],
	"application/x-lua-bytecode": [
		"luac"
	],
	"application/x-lzh-compressed": [
		"lzh",
		"lha"
	],
	"application/x-mie": [
		"mie"
	],
	"application/x-mobipocket-ebook": [
		"prc",
		"mobi"
	],
	"application/x-ms-application": [
		"application"
	],
	"application/x-ms-shortcut": [
		"lnk"
	],
	"application/x-ms-wmd": [
		"wmd"
	],
	"application/x-ms-wmz": [
		"wmz"
	],
	"application/x-ms-xbap": [
		"xbap"
	],
	"application/x-msaccess": [
		"mdb"
	],
	"application/x-msbinder": [
		"obd"
	],
	"application/x-mscardfile": [
		"crd"
	],
	"application/x-msclip": [
		"clp"
	],
	"application/x-msdownload": [
		"exe",
		"dll",
		"com",
		"bat",
		"msi"
	],
	"application/x-msmediaview": [
		"mvb",
		"m13",
		"m14"
	],
	"application/x-msmetafile": [
		"wmf",
		"wmz",
		"emf",
		"emz"
	],
	"application/x-msmoney": [
		"mny"
	],
	"application/x-mspublisher": [
		"pub"
	],
	"application/x-msschedule": [
		"scd"
	],
	"application/x-msterminal": [
		"trm"
	],
	"application/x-mswrite": [
		"wri"
	],
	"application/x-netcdf": [
		"nc",
		"cdf"
	],
	"application/x-nzb": [
		"nzb"
	],
	"application/x-pkcs12": [
		"p12",
		"pfx"
	],
	"application/x-pkcs7-certificates": [
		"p7b",
		"spc"
	],
	"application/x-pkcs7-certreqresp": [
		"p7r"
	],
	"application/x-rar-compressed": [
		"rar"
	],
	"application/x-research-info-systems": [
		"ris"
	],
	"application/x-sh": [
		"sh"
	],
	"application/x-shar": [
		"shar"
	],
	"application/x-shockwave-flash": [
		"swf"
	],
	"application/x-silverlight-app": [
		"xap"
	],
	"application/x-sql": [
		"sql"
	],
	"application/x-stuffit": [
		"sit"
	],
	"application/x-stuffitx": [
		"sitx"
	],
	"application/x-subrip": [
		"srt"
	],
	"application/x-sv4cpio": [
		"sv4cpio"
	],
	"application/x-sv4crc": [
		"sv4crc"
	],
	"application/x-t3vm-image": [
		"t3"
	],
	"application/x-tads": [
		"gam"
	],
	"application/x-tar": [
		"tar"
	],
	"application/x-tcl": [
		"tcl"
	],
	"application/x-tex": [
		"tex"
	],
	"application/x-tex-tfm": [
		"tfm"
	],
	"application/x-texinfo": [
		"texinfo",
		"texi"
	],
	"application/x-tgif": [
		"obj"
	],
	"application/x-ustar": [
		"ustar"
	],
	"application/x-wais-source": [
		"src"
	],
	"application/x-web-app-manifest+json": [
		"webapp"
	],
	"application/x-x509-ca-cert": [
		"der",
		"crt"
	],
	"application/x-xfig": [
		"fig"
	],
	"application/x-xliff+xml": [
		"xlf"
	],
	"application/x-xpinstall": [
		"xpi"
	],
	"application/x-xz": [
		"xz"
	],
	"application/x-zmachine": [
		"z1",
		"z2",
		"z3",
		"z4",
		"z5",
		"z6",
		"z7",
		"z8"
	],
	"application/xaml+xml": [
		"xaml"
	],
	"application/xcap-diff+xml": [
		"xdf"
	],
	"application/xenc+xml": [
		"xenc"
	],
	"application/xhtml+xml": [
		"xhtml",
		"xht"
	],
	"application/xml": [
		"xml",
		"xsl",
		"xsd"
	],
	"application/xml-dtd": [
		"dtd"
	],
	"application/xop+xml": [
		"xop"
	],
	"application/xproc+xml": [
		"xpl"
	],
	"application/xslt+xml": [
		"xslt"
	],
	"application/xspf+xml": [
		"xspf"
	],
	"application/xv+xml": [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	],
	"application/yang": [
		"yang"
	],
	"application/yin+xml": [
		"yin"
	],
	"application/zip": [
		"zip"
	],
	"audio/adpcm": [
		"adp"
	],
	"audio/basic": [
		"au",
		"snd"
	],
	"audio/midi": [
		"mid",
		"midi",
		"kar",
		"rmi"
	],
	"audio/mp4": [
		"mp4a",
		"m4a"
	],
	"audio/mpeg": [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	],
	"audio/ogg": [
		"oga",
		"ogg",
		"spx"
	],
	"audio/s3m": [
		"s3m"
	],
	"audio/silk": [
		"sil"
	],
	"audio/vnd.dece.audio": [
		"uva",
		"uvva"
	],
	"audio/vnd.digital-winds": [
		"eol"
	],
	"audio/vnd.dra": [
		"dra"
	],
	"audio/vnd.dts": [
		"dts"
	],
	"audio/vnd.dts.hd": [
		"dtshd"
	],
	"audio/vnd.lucent.voice": [
		"lvp"
	],
	"audio/vnd.ms-playready.media.pya": [
		"pya"
	],
	"audio/vnd.nuera.ecelp4800": [
		"ecelp4800"
	],
	"audio/vnd.nuera.ecelp7470": [
		"ecelp7470"
	],
	"audio/vnd.nuera.ecelp9600": [
		"ecelp9600"
	],
	"audio/vnd.rip": [
		"rip"
	],
	"audio/webm": [
		"weba"
	],
	"audio/x-aac": [
		"aac"
	],
	"audio/x-aiff": [
		"aif",
		"aiff",
		"aifc"
	],
	"audio/x-caf": [
		"caf"
	],
	"audio/x-flac": [
		"flac"
	],
	"audio/x-matroska": [
		"mka"
	],
	"audio/x-mpegurl": [
		"m3u"
	],
	"audio/x-ms-wax": [
		"wax"
	],
	"audio/x-ms-wma": [
		"wma"
	],
	"audio/x-pn-realaudio": [
		"ram",
		"ra"
	],
	"audio/x-pn-realaudio-plugin": [
		"rmp"
	],
	"audio/x-wav": [
		"wav"
	],
	"audio/xm": [
		"xm"
	],
	"chemical/x-cdx": [
		"cdx"
	],
	"chemical/x-cif": [
		"cif"
	],
	"chemical/x-cmdf": [
		"cmdf"
	],
	"chemical/x-cml": [
		"cml"
	],
	"chemical/x-csml": [
		"csml"
	],
	"chemical/x-xyz": [
		"xyz"
	],
	"font/opentype": [
		"otf"
	],
	"image/bmp": [
		"bmp"
	],
	"image/cgm": [
		"cgm"
	],
	"image/g3fax": [
		"g3"
	],
	"image/gif": [
		"gif"
	],
	"image/ief": [
		"ief"
	],
	"image/jpeg": [
		"jpeg",
		"jpg",
		"jpe"
	],
	"image/ktx": [
		"ktx"
	],
	"image/png": [
		"png"
	],
	"image/prs.btif": [
		"btif"
	],
	"image/sgi": [
		"sgi"
	],
	"image/svg+xml": [
		"svg",
		"svgz"
	],
	"image/tiff": [
		"tiff",
		"tif"
	],
	"image/vnd.adobe.photoshop": [
		"psd"
	],
	"image/vnd.dece.graphic": [
		"uvi",
		"uvvi",
		"uvg",
		"uvvg"
	],
	"image/vnd.djvu": [
		"djvu",
		"djv"
	],
	"image/vnd.dvb.subtitle": [
		"sub"
	],
	"image/vnd.dwg": [
		"dwg"
	],
	"image/vnd.dxf": [
		"dxf"
	],
	"image/vnd.fastbidsheet": [
		"fbs"
	],
	"image/vnd.fpx": [
		"fpx"
	],
	"image/vnd.fst": [
		"fst"
	],
	"image/vnd.fujixerox.edmics-mmr": [
		"mmr"
	],
	"image/vnd.fujixerox.edmics-rlc": [
		"rlc"
	],
	"image/vnd.ms-modi": [
		"mdi"
	],
	"image/vnd.ms-photo": [
		"wdp"
	],
	"image/vnd.net-fpx": [
		"npx"
	],
	"image/vnd.wap.wbmp": [
		"wbmp"
	],
	"image/vnd.xiff": [
		"xif"
	],
	"image/webp": [
		"webp"
	],
	"image/x-3ds": [
		"3ds"
	],
	"image/x-cmu-raster": [
		"ras"
	],
	"image/x-cmx": [
		"cmx"
	],
	"image/x-freehand": [
		"fh",
		"fhc",
		"fh4",
		"fh5",
		"fh7"
	],
	"image/x-icon": [
		"ico"
	],
	"image/x-mrsid-image": [
		"sid"
	],
	"image/x-pcx": [
		"pcx"
	],
	"image/x-pict": [
		"pic",
		"pct"
	],
	"image/x-portable-anymap": [
		"pnm"
	],
	"image/x-portable-bitmap": [
		"pbm"
	],
	"image/x-portable-graymap": [
		"pgm"
	],
	"image/x-portable-pixmap": [
		"ppm"
	],
	"image/x-rgb": [
		"rgb"
	],
	"image/x-tga": [
		"tga"
	],
	"image/x-xbitmap": [
		"xbm"
	],
	"image/x-xpixmap": [
		"xpm"
	],
	"image/x-xwindowdump": [
		"xwd"
	],
	"message/rfc822": [
		"eml",
		"mime"
	],
	"model/iges": [
		"igs",
		"iges"
	],
	"model/mesh": [
		"msh",
		"mesh",
		"silo"
	],
	"model/vnd.collada+xml": [
		"dae"
	],
	"model/vnd.dwf": [
		"dwf"
	],
	"model/vnd.gdl": [
		"gdl"
	],
	"model/vnd.gtw": [
		"gtw"
	],
	"model/vnd.mts": [
		"mts"
	],
	"model/vnd.vtu": [
		"vtu"
	],
	"model/vrml": [
		"wrl",
		"vrml"
	],
	"model/x3d+binary": [
		"x3db",
		"x3dbz"
	],
	"model/x3d+vrml": [
		"x3dv",
		"x3dvz"
	],
	"model/x3d+xml": [
		"x3d",
		"x3dz"
	],
	"text/cache-manifest": [
		"appcache",
		"manifest"
	],
	"text/calendar": [
		"ics",
		"ifb"
	],
	"text/coffeescript": [
		"coffee"
	],
	"text/css": [
		"css"
	],
	"text/csv": [
		"csv"
	],
	"text/hjson": [
		"hjson"
	],
	"text/html": [
		"html",
		"htm"
	],
	"text/jade": [
		"jade"
	],
	"text/jsx": [
		"jsx"
	],
	"text/less": [
		"less"
	],
	"text/n3": [
		"n3"
	],
	"text/plain": [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	],
	"text/prs.lines.tag": [
		"dsc"
	],
	"text/richtext": [
		"rtx"
	],
	"text/sgml": [
		"sgml",
		"sgm"
	],
	"text/stylus": [
		"stylus",
		"styl"
	],
	"text/tab-separated-values": [
		"tsv"
	],
	"text/troff": [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	],
	"text/turtle": [
		"ttl"
	],
	"text/uri-list": [
		"uri",
		"uris",
		"urls"
	],
	"text/vcard": [
		"vcard"
	],
	"text/vnd.curl": [
		"curl"
	],
	"text/vnd.curl.dcurl": [
		"dcurl"
	],
	"text/vnd.curl.mcurl": [
		"mcurl"
	],
	"text/vnd.curl.scurl": [
		"scurl"
	],
	"text/vnd.dvb.subtitle": [
		"sub"
	],
	"text/vnd.fly": [
		"fly"
	],
	"text/vnd.fmi.flexstor": [
		"flx"
	],
	"text/vnd.graphviz": [
		"gv"
	],
	"text/vnd.in3d.3dml": [
		"3dml"
	],
	"text/vnd.in3d.spot": [
		"spot"
	],
	"text/vnd.sun.j2me.app-descriptor": [
		"jad"
	],
	"text/vnd.wap.wml": [
		"wml"
	],
	"text/vnd.wap.wmlscript": [
		"wmls"
	],
	"text/vtt": [
		"vtt"
	],
	"text/x-asm": [
		"s",
		"asm"
	],
	"text/x-c": [
		"c",
		"cc",
		"cxx",
		"cpp",
		"h",
		"hh",
		"dic"
	],
	"text/x-component": [
		"htc"
	],
	"text/x-fortran": [
		"f",
		"for",
		"f77",
		"f90"
	],
	"text/x-handlebars-template": [
		"hbs"
	],
	"text/x-java-source": [
		"java"
	],
	"text/x-lua": [
		"lua"
	],
	"text/x-markdown": [
		"markdown",
		"md",
		"mkd"
	],
	"text/x-nfo": [
		"nfo"
	],
	"text/x-opml": [
		"opml"
	],
	"text/x-pascal": [
		"p",
		"pas"
	],
	"text/x-sass": [
		"sass"
	],
	"text/x-scss": [
		"scss"
	],
	"text/x-setext": [
		"etx"
	],
	"text/x-sfv": [
		"sfv"
	],
	"text/x-uuencode": [
		"uu"
	],
	"text/x-vcalendar": [
		"vcs"
	],
	"text/x-vcard": [
		"vcf"
	],
	"text/yaml": [
		"yaml",
		"yml"
	],
	"video/3gpp": [
		"3gp"
	],
	"video/3gpp2": [
		"3g2"
	],
	"video/h261": [
		"h261"
	],
	"video/h263": [
		"h263"
	],
	"video/h264": [
		"h264"
	],
	"video/jpeg": [
		"jpgv"
	],
	"video/jpm": [
		"jpm",
		"jpgm"
	],
	"video/mj2": [
		"mj2",
		"mjp2"
	],
	"video/mp2t": [
		"ts"
	],
	"video/mp4": [
		"mp4",
		"mp4v",
		"mpg4"
	],
	"video/mpeg": [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	],
	"video/ogg": [
		"ogv"
	],
	"video/quicktime": [
		"qt",
		"mov"
	],
	"video/vnd.dece.hd": [
		"uvh",
		"uvvh"
	],
	"video/vnd.dece.mobile": [
		"uvm",
		"uvvm"
	],
	"video/vnd.dece.pd": [
		"uvp",
		"uvvp"
	],
	"video/vnd.dece.sd": [
		"uvs",
		"uvvs"
	],
	"video/vnd.dece.video": [
		"uvv",
		"uvvv"
	],
	"video/vnd.dvb.file": [
		"dvb"
	],
	"video/vnd.fvt": [
		"fvt"
	],
	"video/vnd.mpegurl": [
		"mxu",
		"m4u"
	],
	"video/vnd.ms-playready.media.pyv": [
		"pyv"
	],
	"video/vnd.uvvu.mp4": [
		"uvu",
		"uvvu"
	],
	"video/vnd.vivo": [
		"viv"
	],
	"video/webm": [
		"webm"
	],
	"video/x-f4v": [
		"f4v"
	],
	"video/x-fli": [
		"fli"
	],
	"video/x-flv": [
		"flv"
	],
	"video/x-m4v": [
		"m4v"
	],
	"video/x-matroska": [
		"mkv",
		"mk3d",
		"mks"
	],
	"video/x-mng": [
		"mng"
	],
	"video/x-ms-asf": [
		"asf",
		"asx"
	],
	"video/x-ms-vob": [
		"vob"
	],
	"video/x-ms-wm": [
		"wm"
	],
	"video/x-ms-wmv": [
		"wmv"
	],
	"video/x-ms-wmx": [
		"wmx"
	],
	"video/x-ms-wvx": [
		"wvx"
	],
	"video/x-msvideo": [
		"avi"
	],
	"video/x-sgi-movie": [
		"movie"
	],
	"video/x-smv": [
		"smv"
	],
	"x-conference/x-cooltalk": [
		"ice"
	]
};

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(5);
var fs = __webpack_require__(7);
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * negotiator
 * Copyright(c) 2012 Federico Romero
 * Copyright(c) 2012-2014 Isaac Z. Schlueter
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Cached loaded submodules.
 * @private
 */

var modules = Object.create(null);

/**
 * Module exports.
 * @public
 */

module.exports = Negotiator;
module.exports.Negotiator = Negotiator;

/**
 * Create a Negotiator instance from a request.
 * @param {object} request
 * @public
 */

function Negotiator(request) {
  if (!(this instanceof Negotiator)) {
    return new Negotiator(request);
  }

  this.request = request;
}

Negotiator.prototype.charset = function charset(available) {
  var set = this.charsets(available);
  return set && set[0];
};

Negotiator.prototype.charsets = function charsets(available) {
  var preferredCharsets = loadModule('charset').preferredCharsets;
  return preferredCharsets(this.request.headers['accept-charset'], available);
};

Negotiator.prototype.encoding = function encoding(available) {
  var set = this.encodings(available);
  return set && set[0];
};

Negotiator.prototype.encodings = function encodings(available) {
  var preferredEncodings = loadModule('encoding').preferredEncodings;
  return preferredEncodings(this.request.headers['accept-encoding'], available);
};

Negotiator.prototype.language = function language(available) {
  var set = this.languages(available);
  return set && set[0];
};

Negotiator.prototype.languages = function languages(available) {
  var preferredLanguages = loadModule('language').preferredLanguages;
  return preferredLanguages(this.request.headers['accept-language'], available);
};

Negotiator.prototype.mediaType = function mediaType(available) {
  var set = this.mediaTypes(available);
  return set && set[0];
};

Negotiator.prototype.mediaTypes = function mediaTypes(available) {
  var preferredMediaTypes = loadModule('mediaType').preferredMediaTypes;
  return preferredMediaTypes(this.request.headers.accept, available);
};

// Backwards compatibility
Negotiator.prototype.preferredCharset = Negotiator.prototype.charset;
Negotiator.prototype.preferredCharsets = Negotiator.prototype.charsets;
Negotiator.prototype.preferredEncoding = Negotiator.prototype.encoding;
Negotiator.prototype.preferredEncodings = Negotiator.prototype.encodings;
Negotiator.prototype.preferredLanguage = Negotiator.prototype.language;
Negotiator.prototype.preferredLanguages = Negotiator.prototype.languages;
Negotiator.prototype.preferredMediaType = Negotiator.prototype.mediaType;
Negotiator.prototype.preferredMediaTypes = Negotiator.prototype.mediaTypes;

/**
 * Load the given module.
 * @private
 */

function loadModule(moduleName) {
  var module = modules[moduleName];

  if (module !== undefined) {
    return module;
  }

  // This uses a switch for static require analysis
  switch (moduleName) {
    case 'charset':
      module = __webpack_require__(225);
      break;
    case 'encoding':
      module = __webpack_require__(226);
      break;
    case 'language':
      module = __webpack_require__(227);
      break;
    case 'mediaType':
      module = __webpack_require__(228);
      break;
    default:
      throw new Error('Cannot find module \'' + moduleName + '\'');
  }

  // Store to prevent invoking require()
  modules[moduleName] = module;

  return module;
}


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = preferredCharsets;
module.exports.preferredCharsets = preferredCharsets;

/**
 * Module variables.
 * @private
 */

var simpleCharsetRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

/**
 * Parse the Accept-Charset header.
 * @private
 */

function parseAcceptCharset(accept) {
  var accepts = accept.split(',');

  for (var i = 0, j = 0; i < accepts.length; i++) {
    var charset = parseCharset(accepts[i].trim(), i);

    if (charset) {
      accepts[j++] = charset;
    }
  }

  // trim accepts
  accepts.length = j;

  return accepts;
}

/**
 * Parse a charset from the Accept-Charset header.
 * @private
 */

function parseCharset(str, i) {
  var match = simpleCharsetRegExp.exec(str);
  if (!match) return null;

  var charset = match[1];
  var q = 1;
  if (match[2]) {
    var params = match[2].split(';')
    for (var i = 0; i < params.length; i ++) {
      var p = params[i].trim().split('=');
      if (p[0] === 'q') {
        q = parseFloat(p[1]);
        break;
      }
    }
  }

  return {
    charset: charset,
    q: q,
    i: i
  };
}

/**
 * Get the priority of a charset.
 * @private
 */

function getCharsetPriority(charset, accepted, index) {
  var priority = {o: -1, q: 0, s: 0};

  for (var i = 0; i < accepted.length; i++) {
    var spec = specify(charset, accepted[i], index);

    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }

  return priority;
}

/**
 * Get the specificity of the charset.
 * @private
 */

function specify(charset, spec, index) {
  var s = 0;
  if(spec.charset.toLowerCase() === charset.toLowerCase()){
    s |= 1;
  } else if (spec.charset !== '*' ) {
    return null
  }

  return {
    i: index,
    o: spec.i,
    q: spec.q,
    s: s
  }
}

/**
 * Get the preferred charsets from an Accept-Charset header.
 * @public
 */

function preferredCharsets(accept, provided) {
  // RFC 2616 sec 14.2: no header = *
  var accepts = parseAcceptCharset(accept === undefined ? '*' : accept || '');

  if (!provided) {
    // sorted list of all charsets
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullCharset);
  }

  var priorities = provided.map(function getPriority(type, index) {
    return getCharsetPriority(type, accepts, index);
  });

  // sorted list of accepted charsets
  return priorities.filter(isQuality).sort(compareSpecs).map(function getCharset(priority) {
    return provided[priorities.indexOf(priority)];
  });
}

/**
 * Compare two specs.
 * @private
 */

function compareSpecs(a, b) {
  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
}

/**
 * Get full charset string.
 * @private
 */

function getFullCharset(spec) {
  return spec.charset;
}

/**
 * Check if a spec has any quality.
 * @private
 */

function isQuality(spec) {
  return spec.q > 0;
}


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = preferredEncodings;
module.exports.preferredEncodings = preferredEncodings;

/**
 * Module variables.
 * @private
 */

var simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

/**
 * Parse the Accept-Encoding header.
 * @private
 */

function parseAcceptEncoding(accept) {
  var accepts = accept.split(',');
  var hasIdentity = false;
  var minQuality = 1;

  for (var i = 0, j = 0; i < accepts.length; i++) {
    var encoding = parseEncoding(accepts[i].trim(), i);

    if (encoding) {
      accepts[j++] = encoding;
      hasIdentity = hasIdentity || specify('identity', encoding);
      minQuality = Math.min(minQuality, encoding.q || 1);
    }
  }

  if (!hasIdentity) {
    /*
     * If identity doesn't explicitly appear in the accept-encoding header,
     * it's added to the list of acceptable encoding with the lowest q
     */
    accepts[j++] = {
      encoding: 'identity',
      q: minQuality,
      i: i
    };
  }

  // trim accepts
  accepts.length = j;

  return accepts;
}

/**
 * Parse an encoding from the Accept-Encoding header.
 * @private
 */

function parseEncoding(str, i) {
  var match = simpleEncodingRegExp.exec(str);
  if (!match) return null;

  var encoding = match[1];
  var q = 1;
  if (match[2]) {
    var params = match[2].split(';');
    for (var i = 0; i < params.length; i ++) {
      var p = params[i].trim().split('=');
      if (p[0] === 'q') {
        q = parseFloat(p[1]);
        break;
      }
    }
  }

  return {
    encoding: encoding,
    q: q,
    i: i
  };
}

/**
 * Get the priority of an encoding.
 * @private
 */

function getEncodingPriority(encoding, accepted, index) {
  var priority = {o: -1, q: 0, s: 0};

  for (var i = 0; i < accepted.length; i++) {
    var spec = specify(encoding, accepted[i], index);

    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }

  return priority;
}

/**
 * Get the specificity of the encoding.
 * @private
 */

function specify(encoding, spec, index) {
  var s = 0;
  if(spec.encoding.toLowerCase() === encoding.toLowerCase()){
    s |= 1;
  } else if (spec.encoding !== '*' ) {
    return null
  }

  return {
    i: index,
    o: spec.i,
    q: spec.q,
    s: s
  }
};

/**
 * Get the preferred encodings from an Accept-Encoding header.
 * @public
 */

function preferredEncodings(accept, provided) {
  var accepts = parseAcceptEncoding(accept || '');

  if (!provided) {
    // sorted list of all encodings
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullEncoding);
  }

  var priorities = provided.map(function getPriority(type, index) {
    return getEncodingPriority(type, accepts, index);
  });

  // sorted list of accepted encodings
  return priorities.filter(isQuality).sort(compareSpecs).map(function getEncoding(priority) {
    return provided[priorities.indexOf(priority)];
  });
}

/**
 * Compare two specs.
 * @private
 */

function compareSpecs(a, b) {
  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
}

/**
 * Get full encoding string.
 * @private
 */

function getFullEncoding(spec) {
  return spec.encoding;
}

/**
 * Check if a spec has any quality.
 * @private
 */

function isQuality(spec) {
  return spec.q > 0;
}


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = preferredLanguages;
module.exports.preferredLanguages = preferredLanguages;

/**
 * Module variables.
 * @private
 */

var simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;

/**
 * Parse the Accept-Language header.
 * @private
 */

function parseAcceptLanguage(accept) {
  var accepts = accept.split(',');

  for (var i = 0, j = 0; i < accepts.length; i++) {
    var langauge = parseLanguage(accepts[i].trim(), i);

    if (langauge) {
      accepts[j++] = langauge;
    }
  }

  // trim accepts
  accepts.length = j;

  return accepts;
}

/**
 * Parse a language from the Accept-Language header.
 * @private
 */

function parseLanguage(str, i) {
  var match = simpleLanguageRegExp.exec(str);
  if (!match) return null;

  var prefix = match[1],
      suffix = match[2],
      full = prefix;

  if (suffix) full += "-" + suffix;

  var q = 1;
  if (match[3]) {
    var params = match[3].split(';')
    for (var i = 0; i < params.length; i ++) {
      var p = params[i].split('=');
      if (p[0] === 'q') q = parseFloat(p[1]);
    }
  }

  return {
    prefix: prefix,
    suffix: suffix,
    q: q,
    i: i,
    full: full
  };
}

/**
 * Get the priority of a language.
 * @private
 */

function getLanguagePriority(language, accepted, index) {
  var priority = {o: -1, q: 0, s: 0};

  for (var i = 0; i < accepted.length; i++) {
    var spec = specify(language, accepted[i], index);

    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }

  return priority;
}

/**
 * Get the specificity of the language.
 * @private
 */

function specify(language, spec, index) {
  var p = parseLanguage(language)
  if (!p) return null;
  var s = 0;
  if(spec.full.toLowerCase() === p.full.toLowerCase()){
    s |= 4;
  } else if (spec.prefix.toLowerCase() === p.full.toLowerCase()) {
    s |= 2;
  } else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) {
    s |= 1;
  } else if (spec.full !== '*' ) {
    return null
  }

  return {
    i: index,
    o: spec.i,
    q: spec.q,
    s: s
  }
};

/**
 * Get the preferred languages from an Accept-Language header.
 * @public
 */

function preferredLanguages(accept, provided) {
  // RFC 2616 sec 14.4: no header = *
  var accepts = parseAcceptLanguage(accept === undefined ? '*' : accept || '');

  if (!provided) {
    // sorted list of all languages
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullLanguage);
  }

  var priorities = provided.map(function getPriority(type, index) {
    return getLanguagePriority(type, accepts, index);
  });

  // sorted list of accepted languages
  return priorities.filter(isQuality).sort(compareSpecs).map(function getLanguage(priority) {
    return provided[priorities.indexOf(priority)];
  });
}

/**
 * Compare two specs.
 * @private
 */

function compareSpecs(a, b) {
  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
}

/**
 * Get full language string.
 * @private
 */

function getFullLanguage(spec) {
  return spec.full;
}

/**
 * Check if a spec has any quality.
 * @private
 */

function isQuality(spec) {
  return spec.q > 0;
}


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = preferredMediaTypes;
module.exports.preferredMediaTypes = preferredMediaTypes;

/**
 * Module variables.
 * @private
 */

var simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;

/**
 * Parse the Accept header.
 * @private
 */

function parseAccept(accept) {
  var accepts = splitMediaTypes(accept);

  for (var i = 0, j = 0; i < accepts.length; i++) {
    var mediaType = parseMediaType(accepts[i].trim(), i);

    if (mediaType) {
      accepts[j++] = mediaType;
    }
  }

  // trim accepts
  accepts.length = j;

  return accepts;
}

/**
 * Parse a media type from the Accept header.
 * @private
 */

function parseMediaType(str, i) {
  var match = simpleMediaTypeRegExp.exec(str);
  if (!match) return null;

  var params = Object.create(null);
  var q = 1;
  var subtype = match[2];
  var type = match[1];

  if (match[3]) {
    var kvps = splitParameters(match[3]).map(splitKeyValuePair);

    for (var j = 0; j < kvps.length; j++) {
      var pair = kvps[j];
      var key = pair[0].toLowerCase();
      var val = pair[1];

      // get the value, unwrapping quotes
      var value = val && val[0] === '"' && val[val.length - 1] === '"'
        ? val.substr(1, val.length - 2)
        : val;

      if (key === 'q') {
        q = parseFloat(value);
        break;
      }

      // store parameter
      params[key] = value;
    }
  }

  return {
    type: type,
    subtype: subtype,
    params: params,
    q: q,
    i: i
  };
}

/**
 * Get the priority of a media type.
 * @private
 */

function getMediaTypePriority(type, accepted, index) {
  var priority = {o: -1, q: 0, s: 0};

  for (var i = 0; i < accepted.length; i++) {
    var spec = specify(type, accepted[i], index);

    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }

  return priority;
}

/**
 * Get the specificity of the media type.
 * @private
 */

function specify(type, spec, index) {
  var p = parseMediaType(type);
  var s = 0;

  if (!p) {
    return null;
  }

  if(spec.type.toLowerCase() == p.type.toLowerCase()) {
    s |= 4
  } else if(spec.type != '*') {
    return null;
  }

  if(spec.subtype.toLowerCase() == p.subtype.toLowerCase()) {
    s |= 2
  } else if(spec.subtype != '*') {
    return null;
  }

  var keys = Object.keys(spec.params);
  if (keys.length > 0) {
    if (keys.every(function (k) {
      return spec.params[k] == '*' || (spec.params[k] || '').toLowerCase() == (p.params[k] || '').toLowerCase();
    })) {
      s |= 1
    } else {
      return null
    }
  }

  return {
    i: index,
    o: spec.i,
    q: spec.q,
    s: s,
  }
}

/**
 * Get the preferred media types from an Accept header.
 * @public
 */

function preferredMediaTypes(accept, provided) {
  // RFC 2616 sec 14.2: no header = */*
  var accepts = parseAccept(accept === undefined ? '*/*' : accept || '');

  if (!provided) {
    // sorted list of all types
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullType);
  }

  var priorities = provided.map(function getPriority(type, index) {
    return getMediaTypePriority(type, accepts, index);
  });

  // sorted list of accepted types
  return priorities.filter(isQuality).sort(compareSpecs).map(function getType(priority) {
    return provided[priorities.indexOf(priority)];
  });
}

/**
 * Compare two specs.
 * @private
 */

function compareSpecs(a, b) {
  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
}

/**
 * Get full type string.
 * @private
 */

function getFullType(spec) {
  return spec.type + '/' + spec.subtype;
}

/**
 * Check if a spec has any quality.
 * @private
 */

function isQuality(spec) {
  return spec.q > 0;
}

/**
 * Count the number of quotes in a string.
 * @private
 */

function quoteCount(string) {
  var count = 0;
  var index = 0;

  while ((index = string.indexOf('"', index)) !== -1) {
    count++;
    index++;
  }

  return count;
}

/**
 * Split a key value pair.
 * @private
 */

function splitKeyValuePair(str) {
  var index = str.indexOf('=');
  var key;
  var val;

  if (index === -1) {
    key = str;
  } else {
    key = str.substr(0, index);
    val = str.substr(index + 1);
  }

  return [key, val];
}

/**
 * Split an Accept header into media types.
 * @private
 */

function splitMediaTypes(accept) {
  var accepts = accept.split(',');

  for (var i = 1, j = 0; i < accepts.length; i++) {
    if (quoteCount(accepts[j]) % 2 == 0) {
      accepts[++j] = accepts[i];
    } else {
      accepts[j] += ',' + accepts[i];
    }
  }

  // trim accepts
  accepts.length = j + 1;

  return accepts;
}

/**
 * Split a string of parameters.
 * @private
 */

function splitParameters(str) {
  var parameters = str.split(';');

  for (var i = 1, j = 0; i < parameters.length; i++) {
    if (quoteCount(parameters[j]) % 2 == 0) {
      parameters[++j] = parameters[i];
    } else {
      parameters[j] += ';' + parameters[i];
    }
  }

  // trim parameters
  parameters.length = j + 1;

  for (var i = 0; i < parameters.length; i++) {
    parameters[i] = parameters[i].trim();
  }

  return parameters;
}


/***/ }),
/* 229 */
/***/ (function(module, exports) {

/**
 * Expose `pathtoRegexp`.
 */

module.exports = pathtoRegexp;

/**
 * Match matching groups in a regular expression.
 */
var MATCHING_GROUP_REGEXP = /\((?!\?)/g;

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Object} options
 * @return {RegExp}
 * @api private
 */

function pathtoRegexp(path, keys, options) {
  options = options || {};
  keys = keys || [];
  var strict = options.strict;
  var end = options.end !== false;
  var flags = options.sensitive ? '' : 'i';
  var extraOffset = 0;
  var keysOffset = keys.length;
  var i = 0;
  var name = 0;
  var m;

  if (path instanceof RegExp) {
    while (m = MATCHING_GROUP_REGEXP.exec(path.source)) {
      keys.push({
        name: name++,
        optional: false,
        offset: m.index
      });
    }

    return path;
  }

  if (Array.isArray(path)) {
    // Map array parts into regexps and return their source. We also pass
    // the same keys and options instance into every generation to get
    // consistent matching groups before we join the sources together.
    path = path.map(function (value) {
      return pathtoRegexp(value, keys, options).source;
    });

    return new RegExp('(?:' + path.join('|') + ')', flags);
  }

  path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
    .replace(/\/\(/g, '/(?:')
    .replace(/([\/\.])/g, '\\$1')
    .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function (match, slash, format, key, capture, star, optional, offset) {
      slash = slash || '';
      format = format || '';
      capture = capture || '([^\\/' + format + ']+?)';
      optional = optional || '';

      keys.push({
        name: key,
        optional: !!optional,
        offset: offset + extraOffset
      });

      var result = ''
        + (optional ? '' : slash)
        + '(?:'
        + format + (optional ? slash : '') + capture
        + (star ? '((?:[\\/' + format + '].+?)?)' : '')
        + ')'
        + optional;

      extraOffset += result.length - match.length;

      return result;
    })
    .replace(/\*/g, function (star, index) {
      var len = keys.length

      while (len-- > keysOffset && keys[len].offset > index) {
        keys[len].offset += 3; // Replacement length minus asterisk length.
      }

      return '(.*)';
    });

  // This is a workaround for handling unnamed matching groups.
  while (m = MATCHING_GROUP_REGEXP.exec(path)) {
    var escapeCount = 0;
    var index = m.index;

    while (path.charAt(--index) === '\\') {
      escapeCount++;
    }

    // It's possible to escape the bracket.
    if (escapeCount % 2 === 1) {
      continue;
    }

    if (keysOffset + i === keys.length || keys[keysOffset + i].offset > m.index) {
      keys.splice(keysOffset + i, 0, {
        name: name++, // Unnamed matching groups must be consistently linear.
        optional: false,
        offset: m.index
      });
    }

    i++;
  }

  // If the path is non-ending, match until the end or a slash.
  path += (end ? '$' : (path[path.length - 1] === '/' ? '' : '(?=\\/|$)'));

  return new RegExp(path, flags);
};


/***/ }),
/* 230 */,
/* 231 */,
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(122);

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos));
            val = options.decoder(part.slice(pos + 1));
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function parseObjectRecursive(chain, val, options) {
    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(parseObject(chain, val, options));
    } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
        var index = parseInt(cleanRoot, 10);
        if (
            !isNaN(index) &&
            root !== cleanRoot &&
            String(index) === cleanRoot &&
            index >= 0 &&
            (options.parseArrays && index <= options.arrayLimit)
        ) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
        } else {
            obj[cleanRoot] = parseObject(chain, val, options);
        }
    }

    return obj;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts || {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(122);
var formats = __webpack_require__(120);

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts || {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats.default;
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    return keys.join(delimiter);
};


/***/ }),
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */
/***/ (function(module, exports) {

exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.
/* nomin */ var debug;
/* nomin */ if (typeof process === 'object' &&
    /* nomin */ process.env &&
    /* nomin */ process.env.NODE_DEBUG &&
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
  /* nomin */ debug = function() {
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
    /* nomin */ args.unshift('SEMVER');
    /* nomin */ console.log.apply(console, args);
    /* nomin */ };
/* nomin */ else
  /* nomin */ debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  debug('SemVer', version, loose);
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num;
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  debug('SemVer.compare', this.version, this.loose, other);
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(b);
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  debug('comparator', comp, loose);
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  debug('comp', this);
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  debug('Comparator.test', version, this.loose);

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};


exports.Range = Range;
function Range(range, loose) {
  if ((range instanceof Range) && range.loose === loose)
    return range;

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  debug('range', range, loose);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  debug('comp', comp);
  comp = replaceCarets(comp, loose);
  debug('caret', comp);
  comp = replaceTildes(comp, loose);
  debug('tildes', comp);
  comp = replaceXRanges(comp, loose);
  debug('xrange', comp);
  comp = replaceStars(comp, loose);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  debug('caret', comp, loose);
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  debug('replaceXRanges', comp, loose);
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm)
          M = +M + 1;
        else
          m = +m + 1;
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  debug('replaceStars', comp, loose);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY)
        continue;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  return versions.filter(function(version) {
    return satisfies(version, range, loose);
  }).sort(function(a, b) {
    return rcompare(a, b, loose);
  })[0] || null;
}

exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, loose) {
  return versions.filter(function(version) {
    return satisfies(version, range, loose);
  }).sort(function(a, b) {
    return compare(a, b, loose);
  })[0] || null;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

exports.prerelease = prerelease;
function prerelease(version, loose) {
  var parsed = parse(version, loose);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
}


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(149);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (window && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(319);
} else {
  module.exports = __webpack_require__(321);
}


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(42);
var util = __webpack_require__(8);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(149);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(7);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(30);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * serve-static
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var encodeUrl = __webpack_require__(45)
var escapeHtml = __webpack_require__(46)
var parseUrl = __webpack_require__(37)
var resolve = __webpack_require__(5).resolve
var send = __webpack_require__(78)
var url = __webpack_require__(157)

/**
 * Module exports.
 * @public
 */

module.exports = serveStatic
module.exports.mime = send.mime

/**
 * @param {string} root
 * @param {object} [options]
 * @return {function}
 * @public
 */

function serveStatic (root, options) {
  if (!root) {
    throw new TypeError('root path required')
  }

  if (typeof root !== 'string') {
    throw new TypeError('root path must be a string')
  }

  // copy options object
  var opts = Object.create(options || null)

  // fall-though
  var fallthrough = opts.fallthrough !== false

  // default redirect
  var redirect = opts.redirect !== false

  // headers listener
  var setHeaders = opts.setHeaders

  if (setHeaders && typeof setHeaders !== 'function') {
    throw new TypeError('option setHeaders must be function')
  }

  // setup options for send
  opts.maxage = opts.maxage || opts.maxAge || 0
  opts.root = resolve(root)

  // construct directory listener
  var onDirectory = redirect
    ? createRedirectDirectoryListener()
    : createNotFoundDirectoryListener()

  return function serveStatic (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (fallthrough) {
        return next()
      }

      // method not allowed
      res.statusCode = 405
      res.setHeader('Allow', 'GET, HEAD')
      res.setHeader('Content-Length', '0')
      res.end()
      return
    }

    var forwardError = !fallthrough
    var originalUrl = parseUrl.original(req)
    var path = parseUrl(req).pathname

    // make sure redirect occurs at mount
    if (path === '/' && originalUrl.pathname.substr(-1) !== '/') {
      path = ''
    }

    // create send stream
    var stream = send(req, path, opts)

    // add directory handler
    stream.on('directory', onDirectory)

    // add headers listener
    if (setHeaders) {
      stream.on('headers', setHeaders)
    }

    // add file listener for fallthrough
    if (fallthrough) {
      stream.on('file', function onFile () {
        // once file is determined, always forward error
        forwardError = true
      })
    }

    // forward errors
    stream.on('error', function error (err) {
      if (forwardError || !(err.statusCode < 500)) {
        next(err)
        return
      }

      next()
    })

    // pipe
    stream.pipe(res)
  }
}

/**
 * Collapse all leading slashes into a single slash
 * @private
 */
function collapseLeadingSlashes (str) {
  for (var i = 0; i < str.length; i++) {
    if (str[i] !== '/') {
      break
    }
  }

  return i > 1
    ? '/' + str.substr(i)
    : str
}

 /**
 * Create a minimal HTML document.
 *
 * @param {string} title
 * @param {string} body
 * @private
 */

function createHtmlDocument (title, body) {
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<title>' + title + '</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '<pre>' + body + '</pre>\n' +
    '</body>\n'
}

/**
 * Create a directory listener that just 404s.
 * @private
 */

function createNotFoundDirectoryListener () {
  return function notFound () {
    this.error(404)
  }
}

/**
 * Create a directory listener that performs a redirect.
 * @private
 */

function createRedirectDirectoryListener () {
  return function redirect (res) {
    if (this.hasTrailingSlash()) {
      this.error(404)
      return
    }

    // get original URL
    var originalUrl = parseUrl.original(this.req)

    // append trailing slash
    originalUrl.path = null
    originalUrl.pathname = collapseLeadingSlashes(originalUrl.pathname + '/')

    // reformat the URL
    var loc = encodeUrl(url.format(originalUrl))
    var doc = createHtmlDocument('Redirecting', 'Redirecting to <a href="' + escapeHtml(loc) + '">' +
      escapeHtml(loc) + '</a>')

    // send redirect response
    res.statusCode = 301
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.setHeader('Content-Length', Buffer.byteLength(doc))
    res.setHeader('Content-Security-Policy', "default-src 'self'")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Location', loc)
    res.end(doc)
  }
}


/***/ }),
/* 323 */
/***/ (function(module, exports) {

module.exports = {
	"100": "Continue",
	"101": "Switching Protocols",
	"102": "Processing",
	"200": "OK",
	"201": "Created",
	"202": "Accepted",
	"203": "Non-Authoritative Information",
	"204": "No Content",
	"205": "Reset Content",
	"206": "Partial Content",
	"207": "Multi-Status",
	"208": "Already Reported",
	"226": "IM Used",
	"300": "Multiple Choices",
	"301": "Moved Permanently",
	"302": "Found",
	"303": "See Other",
	"304": "Not Modified",
	"305": "Use Proxy",
	"306": "(Unused)",
	"307": "Temporary Redirect",
	"308": "Permanent Redirect",
	"400": "Bad Request",
	"401": "Unauthorized",
	"402": "Payment Required",
	"403": "Forbidden",
	"404": "Not Found",
	"405": "Method Not Allowed",
	"406": "Not Acceptable",
	"407": "Proxy Authentication Required",
	"408": "Request Timeout",
	"409": "Conflict",
	"410": "Gone",
	"411": "Length Required",
	"412": "Precondition Failed",
	"413": "Payload Too Large",
	"414": "URI Too Long",
	"415": "Unsupported Media Type",
	"416": "Range Not Satisfiable",
	"417": "Expectation Failed",
	"418": "I'm a teapot",
	"421": "Misdirected Request",
	"422": "Unprocessable Entity",
	"423": "Locked",
	"424": "Failed Dependency",
	"425": "Unordered Collection",
	"426": "Upgrade Required",
	"428": "Precondition Required",
	"429": "Too Many Requests",
	"431": "Request Header Fields Too Large",
	"451": "Unavailable For Legal Reasons",
	"500": "Internal Server Error",
	"501": "Not Implemented",
	"502": "Bad Gateway",
	"503": "Service Unavailable",
	"504": "Gateway Timeout",
	"505": "HTTP Version Not Supported",
	"506": "Variant Also Negotiates",
	"507": "Insufficient Storage",
	"508": "Loop Detected",
	"509": "Bandwidth Limit Exceeded",
	"510": "Not Extended",
	"511": "Network Authentication Required"
};

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var BaseRollingFileStream = __webpack_require__(150)
  , debug = __webpack_require__(79)('streamroller:DateRollingFileStream')
  , format = __webpack_require__(170)
  , fs = __webpack_require__(7)
  , path = __webpack_require__(5)
  , util = __webpack_require__(8);

module.exports = DateRollingFileStream;

function findTimestampFromFileIfExists(filename, now) {
  return fs.existsSync(filename) ? fs.statSync(filename).mtime : new Date(now());
}

function DateRollingFileStream(filename, pattern, options, now) {
  debug("Now is ", now);
  if (pattern && typeof(pattern) === 'object') {
    now = options;
    options = pattern;
    pattern = null;
  }
  this.pattern = pattern || '.yyyy-MM-dd';
  this.now = now || Date.now;
  this.lastTimeWeWroteSomething = format.asString(
    this.pattern,
    findTimestampFromFileIfExists(filename, this.now)
  );

  this.baseFilename = filename;
  this.alwaysIncludePattern = false;

  if (options) {
    if (options.alwaysIncludePattern) {
      this.alwaysIncludePattern = true;
      filename = this.baseFilename + this.lastTimeWeWroteSomething;
    }
    delete options.alwaysIncludePattern;
    if (Object.keys(options).length === 0) {
      options = null;
    }
  }
  debug("this.now is ", this.now, ", now is ", now);

  DateRollingFileStream.super_.call(this, filename, options);
}
util.inherits(DateRollingFileStream, BaseRollingFileStream);

DateRollingFileStream.prototype.shouldRoll = function () {
  var lastTime = this.lastTimeWeWroteSomething,
    thisTime = format.asString(this.pattern, new Date(this.now()));

  debug("DateRollingFileStream.shouldRoll with now = ",
    this.now(), ", thisTime = ", thisTime, ", lastTime = ", lastTime);

  this.lastTimeWeWroteSomething = thisTime;
  this.previousTime = lastTime;

  return thisTime !== lastTime;
};

DateRollingFileStream.prototype.roll = function (filename, callback) {
  var that = this;

  debug("Starting roll");

  if (this.alwaysIncludePattern) {
    this.filename = this.baseFilename + this.lastTimeWeWroteSomething;
    this.closeTheStream(
      this.compressIfNeeded.bind(this, filename,
        this.removeOldFilesIfNeeded.bind(this,
          this.openTheStream.bind(this, callback))));
  } else {
    var newFilename = this.baseFilename + this.previousTime;
    this.closeTheStream(
      deleteAnyExistingFile.bind(null,
        renameTheCurrentFile.bind(null,
          this.compressIfNeeded.bind(this, newFilename,
            this.removeOldFilesIfNeeded.bind(this,
              this.openTheStream.bind(this, callback))))));
  }

  function deleteAnyExistingFile(cb) {
    //on windows, you can get a EEXIST error if you rename a file to an existing file
    //so, we'll try to delete the file we're renaming to first
    fs.unlink(newFilename, function (err) {

      //ignore err: if we could not delete, it's most likely that it doesn't exist
      cb();
    });
  }

  function renameTheCurrentFile(cb) {
    debug("Renaming the ", filename, " -> ", newFilename);
    fs.rename(filename, newFilename, cb);
  }
};

DateRollingFileStream.prototype.compressIfNeeded = function (filename, cb) {
  debug("Checking if we need to compress the old file");
  if (this.options.compress) {
    this.compress(filename, cb);
  } else {
    cb();
  }
};

DateRollingFileStream.prototype.removeOldFilesIfNeeded = function (cb) {
  debug("Checking if we need to delete old files");
  if (this.options.daysToKeep && this.options.daysToKeep > 0) {
    var oldestDate = new Date(this.now() - (this.options.daysToKeep * (24 * 60 * 60 * 1000)));
    debug("Will delete any log files modified before ", oldestDate.toString());

    this.removeFilesOlderThan(oldestDate);
  }
  cb();
};

DateRollingFileStream.prototype.removeFilesOlderThan = function (oldestDate) {

  // Loop through any log files and delete any whose mtime is earlier than oldestDate
  var dirToScan = path.dirname(this.baseFilename);
  var fileToMatch = path.basename(this.baseFilename);
  var filesToCheck = fs.readdirSync(dirToScan).filter(function (file) {
    return file.indexOf(fileToMatch) > -1;
  });
  for (var i = 0; i < filesToCheck.length; i++) {
    var fileToCheck = path.join(dirToScan, filesToCheck[i]);
    var fileStats = fs.statSync(fileToCheck);
    if (fileStats.mtime < oldestDate) {
      debug("Deleting old log ", filesToCheck);
      fs.unlinkSync(fileToCheck);
    }
  }
};




/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var BaseRollingFileStream = __webpack_require__(150)
, debug = __webpack_require__(79)('streamroller:RollingFileStream')
, util = __webpack_require__(8)
, path = __webpack_require__(5)
, child_process = __webpack_require__(333)
, fs = __webpack_require__(7);

module.exports = RollingFileStream;

function RollingFileStream (filename, size, backups, options) {
  //if you don't specify a size, this will behave like a normal file stream
  this.size = size || Number.MAX_SAFE_INTEGER;
  this.backups = backups || 1;

  function throwErrorIfArgumentsAreNotValid() {
    if (!filename || size <= 0) {
      throw new Error("You must specify a filename and file size");
    }
  }

  throwErrorIfArgumentsAreNotValid();

  RollingFileStream.super_.call(this, filename, options);
}
util.inherits(RollingFileStream, BaseRollingFileStream);

RollingFileStream.prototype.shouldRoll = function() {
  debug("should roll with current size " + this.currentSize + " and max size " + this.size);
  return this.currentSize >= this.size;
};

RollingFileStream.prototype.roll = function(filename, callback) {
  var that = this,
  nameMatcher = new RegExp('^' + path.basename(filename));

  function justTheseFiles (item) {
    return nameMatcher.test(item);
  }

  function index(filename_) {
    debug('Calculating index of '+filename_);
    return parseInt(filename_.substring((path.basename(filename) + '.').length), 10) || 0;
  }

  function byIndex(a, b) {
    if (index(a) > index(b)) {
      return 1;
    } else if (index(a) < index(b) ) {
      return -1;
    } else {
      return 0;
    }
  }

  function increaseFileIndex (fileToRename, cb) {
    var idx = index(fileToRename);
    debug('Index of ' + fileToRename + ' is ' + idx);
    if (idx < that.backups) {

      var ext = path.extname(fileToRename);
      var destination = filename + '.' + (idx+1);
      if (that.options.compress && /^gz$/.test(ext.substring(1))) {
        destination+=ext;
      }
      //on windows, you can get a EEXIST error if you rename a file to an existing file
      //so, we'll try to delete the file we're renaming to first
      fs.unlink(destination, function (err) {
        //ignore err: if we could not delete, it's most likely that it doesn't exist
        debug('Renaming ' + fileToRename + ' -> ' + destination);
        fs.rename(path.join(path.dirname(filename), fileToRename), destination, function(err) {
          if (err) {
            cb(err);
          } else {
            if (that.options.compress && ext!=".gz") {
              that.compress(destination, cb);
            } else {
              cb();
            }
          }
        });
      });
    } else {
      cb();
    }
  }

  function renameTheFiles(cb) {
    //roll the backups (rename file.n to file.n+1, where n <= numBackups)
    debug("Renaming the old files");
    fs.readdir(path.dirname(filename), function (err, files) {
      if (err) {
        return cb(err);
      }
      var filesToProcess = files.filter(justTheseFiles).sort(byIndex);
      (function processOne(err) {
        var file = filesToProcess.pop();
        if (!file || err) { return cb(err); }
        increaseFileIndex(file, processOne);
      })();
    });
  }

  debug("Rolling, rolling, rolling");
  this.closeTheStream(
    renameTheFiles.bind(null,
      this.openTheStream.bind(this,
        callback)));

};


/***/ }),
/* 326 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = __webpack_require__(153);

/*<replacement>*/
var util = __webpack_require__(32);
util.inherits = __webpack_require__(23);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(152);
exports.Stream = __webpack_require__(31);
exports.Readable = exports;
exports.Writable = __webpack_require__(154);
exports.Duplex = __webpack_require__(28);
exports.Transform = __webpack_require__(153);
exports.PassThrough = __webpack_require__(327);
if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  module.exports = __webpack_require__(31);
}


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * type-is
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var typer = __webpack_require__(217)
var mime = __webpack_require__(116)

/**
 * Module exports.
 * @public
 */

module.exports = typeofrequest
module.exports.is = typeis
module.exports.hasBody = hasbody
module.exports.normalize = normalize
module.exports.match = mimeMatch

/**
 * Compare a `value` content-type with `types`.
 * Each `type` can be an extension like `html`,
 * a special shortcut like `multipart` or `urlencoded`,
 * or a mime type.
 *
 * If no types match, `false` is returned.
 * Otherwise, the first `type` that matches is returned.
 *
 * @param {String} value
 * @param {Array} types
 * @public
 */

function typeis (value, types_) {
  var i
  var types = types_

  // remove parameters and normalize
  var val = tryNormalizeType(value)

  // no type or invalid
  if (!val) {
    return false
  }

  // support flattened arguments
  if (types && !Array.isArray(types)) {
    types = new Array(arguments.length - 1)
    for (i = 0; i < types.length; i++) {
      types[i] = arguments[i + 1]
    }
  }

  // no types, return the content type
  if (!types || !types.length) {
    return val
  }

  var type
  for (i = 0; i < types.length; i++) {
    if (mimeMatch(normalize(type = types[i]), val)) {
      return type[0] === '+' || type.indexOf('*') !== -1
        ? val
        : type
    }
  }

  // no matches
  return false
}

/**
 * Check if a request has a request body.
 * A request with a body __must__ either have `transfer-encoding`
 * or `content-length` headers set.
 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3
 *
 * @param {Object} request
 * @return {Boolean}
 * @public
 */

function hasbody (req) {
  return req.headers['transfer-encoding'] !== undefined ||
    !isNaN(req.headers['content-length'])
}

/**
 * Check if the incoming request contains the "Content-Type"
 * header field, and it contains any of the give mime `type`s.
 * If there is no request body, `null` is returned.
 * If there is no content type, `false` is returned.
 * Otherwise, it returns the first `type` that matches.
 *
 * Examples:
 *
 *     // With Content-Type: text/html; charset=utf-8
 *     this.is('html'); // => 'html'
 *     this.is('text/html'); // => 'text/html'
 *     this.is('text/*', 'application/json'); // => 'text/html'
 *
 *     // When Content-Type is application/json
 *     this.is('json', 'urlencoded'); // => 'json'
 *     this.is('application/json'); // => 'application/json'
 *     this.is('html', 'application/*'); // => 'application/json'
 *
 *     this.is('html'); // => false
 *
 * @param {String|Array} types...
 * @return {String|false|null}
 * @public
 */

function typeofrequest (req, types_) {
  var types = types_

  // no body
  if (!hasbody(req)) {
    return null
  }

  // support flattened arguments
  if (arguments.length > 2) {
    types = new Array(arguments.length - 1)
    for (var i = 0; i < types.length; i++) {
      types[i] = arguments[i + 1]
    }
  }

  // request content type
  var value = req.headers['content-type']

  return typeis(value, types)
}

/**
 * Normalize a mime type.
 * If it's a shorthand, expand it to a valid mime type.
 *
 * In general, you probably want:
 *
 *   var type = is(req, ['urlencoded', 'json', 'multipart']);
 *
 * Then use the appropriate body parsers.
 * These three are the most common request body types
 * and are thus ensured to work.
 *
 * @param {String} type
 * @private
 */

function normalize (type) {
  if (typeof type !== 'string') {
    // invalid type
    return false
  }

  switch (type) {
    case 'urlencoded':
      return 'application/x-www-form-urlencoded'
    case 'multipart':
      return 'multipart/*'
  }

  if (type[0] === '+') {
    // "+json" -> "*/*+json" expando
    return '*/*' + type
  }

  return type.indexOf('/') === -1
    ? mime.lookup(type)
    : type
}

/**
 * Check if `expected` mime type
 * matches `actual` mime type with
 * wildcard and +suffix support.
 *
 * @param {String} expected
 * @param {String} actual
 * @return {Boolean}
 * @private
 */

function mimeMatch (expected, actual) {
  // invalid type
  if (expected === false) {
    return false
  }

  // split types
  var actualParts = actual.split('/')
  var expectedParts = expected.split('/')

  // invalid format
  if (actualParts.length !== 2 || expectedParts.length !== 2) {
    return false
  }

  // validate type
  if (expectedParts[0] !== '*' && expectedParts[0] !== actualParts[0]) {
    return false
  }

  // validate suffix wildcard
  if (expectedParts[1].substr(0, 2) === '*+') {
    return expectedParts[1].length <= actualParts[1].length + 1 &&
      expectedParts[1].substr(1) === actualParts[1].substr(1 - expectedParts[1].length)
  }

  // validate subtype
  if (expectedParts[1] !== '*' && expectedParts[1] !== actualParts[1]) {
    return false
  }

  return true
}

/**
 * Normalize a type and remove parameters.
 *
 * @param {string} value
 * @return {string}
 * @private
 */

function normalizeType (value) {
  // parse the type
  var type = typer.parse(value)

  // remove the parameters
  type.parameters = undefined

  // reformat it
  return typer.format(type)
}

/**
 * Try to normalize a type and remove parameters.
 *
 * @param {string} value
 * @return {string}
 * @private
 */

function tryNormalizeType (value) {
  try {
    return normalizeType(value)
  } catch (err) {
    return null
  }
}


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * unpipe
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = unpipe

/**
 * Determine if there are Node.js pipe-like data listeners.
 * @private
 */

function hasPipeDataListeners(stream) {
  var listeners = stream.listeners('data')

  for (var i = 0; i < listeners.length; i++) {
    if (listeners[i].name === 'ondata') {
      return true
    }
  }

  return false
}

/**
 * Unpipe a stream from all destinations.
 *
 * @param {object} stream
 * @public
 */

function unpipe(stream) {
  if (!stream) {
    throw new TypeError('argument stream is required')
  }

  if (typeof stream.unpipe === 'function') {
    // new-style
    stream.unpipe()
    return
  }

  // Node.js 0.8 hack
  if (!hasPipeDataListeners(stream)) {
    return
  }

  var listener
  var listeners = stream.listeners('close')

  for (var i = 0; i < listeners.length; i++) {
    listener = listeners[i]

    if (listener.name !== 'cleanup' && listener.name !== 'onclose') {
      continue
    }

    // invoke the listener
    listener.call(stream)
  }
}


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * vary
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 */

module.exports = vary
module.exports.append = append

/**
 * Regular expression to split on commas, trimming spaces
 * @private
 */

var ARRAY_SPLIT_REGEXP = / *, */

/**
 * RegExp to match field-name in RFC 7230 sec 3.2
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 */

var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/

/**
 * Append a field to a vary header.
 *
 * @param {String} header
 * @param {String|Array} field
 * @return {String}
 * @public
 */

function append (header, field) {
  if (typeof header !== 'string') {
    throw new TypeError('header argument is required')
  }

  if (!field) {
    throw new TypeError('field argument is required')
  }

  // get fields array
  var fields = !Array.isArray(field)
    ? parse(String(field))
    : field

  // assert on invalid field names
  for (var j = 0; j < fields.length; j++) {
    if (!FIELD_NAME_REGEXP.test(fields[j])) {
      throw new TypeError('field argument contains an invalid header name')
    }
  }

  // existing, unspecified vary
  if (header === '*') {
    return header
  }

  // enumerate current values
  var val = header
  var vals = parse(header.toLowerCase())

  // unspecified vary
  if (fields.indexOf('*') !== -1 || vals.indexOf('*') !== -1) {
    return '*'
  }

  for (var i = 0; i < fields.length; i++) {
    var fld = fields[i].toLowerCase()

    // append value (case-preserving)
    if (vals.indexOf(fld) === -1) {
      vals.push(fld)
      val = val
        ? val + ', ' + fields[i]
        : fields[i]
    }
  }

  return val
}

/**
 * Parse a vary header into an array.
 *
 * @param {String} header
 * @return {Array}
 * @private
 */

function parse (header) {
  return header.trim().split(ARRAY_SPLIT_REGEXP)
}

/**
 * Mark that a request is varied on a header field.
 *
 * @param {Object} res
 * @param {String|Array} field
 * @public
 */

function vary (res, field) {
  if (!res || !res.getHeader || !res.setHeader) {
    // quack quack
    throw new TypeError('res argument is required')
  }

  // get existing header
  var val = res.getHeader('Vary') || ''
  var header = Array.isArray(val)
    ? val.join(', ')
    : String(val)

  // set new header
  if ((val = append(header, field))) {
    res.setHeader('Vary', val)
  }
}


/***/ }),
/* 332 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 333 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 334 */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),
/* 335 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ })
/******/ ]);
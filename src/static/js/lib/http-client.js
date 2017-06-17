import {Promise} from 'es6-promise';

class HttpClientError extends Error {
    constructor(message, {code, response} = {}) {
        // bluebird checks if the message is string to determin if it's of an Error type
        message = JSON.stringify(message);
        super(message);
        this.message = message;
        this.name = 'HttpClientError';
        this.response = response;
        this.code = code;
        Error.captureStackTrace(this, HttpClientError);
    }
}

// retain a reference of the returned promise to call cancel on it
// as then/catch returns a new promsise, which has no `cacel` method

function makeCancellable(promise) {
    let isCancelled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((result) => {
            if (!isCancelled) {
                resolve(result);
            }
        }).catch((xhrErr) => {
            if (!isCancelled) {
                reject(xhrErr);
            }
        });
    });

    wrappedPromise.cancel = () => isCancelled = true;

    return wrappedPromise;
}

function request(type, {
    url = '',
    payload,
    query = {},
    contentType = 'text/plain;charset=UTF-8',
    isCors = false,
    async = true,
    noJson = false,
    noParse = false
}) {
    const hasQueryString = url.indexOf('?') !== -1;
    const appendantString = Object.keys(query).reduce((str, key, i) => {
        if (i !== 0) {
            str += '&';
        }
        str += `${key}=${query[key]}`;
        return str;
    }, '');

    if (appendantString !== '') {
        url = hasQueryString ? url + '&' + appendantString : url + '?' + appendantString;
    }

    return makeCancellable(new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(type, url, async);
        if (contentType) {
            xhr.setRequestHeader('Content-Type', contentType);
        }
        // xhr.setRequestHeader('Accept', 'application/json');

        //  Response to preflight request doesn't pass access control check: A wildcard '*'
        //  cannot be used in the 'Access-Control-Allow-Origin' header when the credentials flag is true.
        // 跨域的请求先全部设置成 false
        xhr.withCredentials = !isCors;
        xhr.onload = () => {
            if (xhr.status === 200) {
                let response = xhr.responseText;
                if (!noParse) {
                    try {
                        response = response ? JSON.parse(response) : {};
                    } catch (e) {
                        noParse = true;
                    }
                }
                if (typeof response.errorCode === 'undefined' || response.errorCode === 0) {
                    resolve(response);
                } else {
                    reject(new HttpClientError(response.errorMsg || response.errorCode, {response}));
                }
            } else {
                reject(new HttpClientError(xhr.status, {code: xhr.status, response: xhr.response}));
            }
        };
        xhr.onerror = reject;

        let sendPayload;
        if (noJson) {
            sendPayload = payload;
        } else {
            sendPayload = typeof payload === 'undefined' ? undefined : JSON.stringify(payload);
        }
        xhr.send(sendPayload);
    }));
}

// 为上传文件 /c/api/texture/upload 接口定制。。
function kRequestFile(type, {
    url = '',
    payload,
    query = {},
    contentType = 'text/plain;charset=UTF-8',
    isCors = false,
    async = true,
    noJson = false
}) {
    const hasQueryString = url.indexOf('?') !== -1;
    const appendantString = Object.keys(query).reduce((str, key, i) => {
        if (i !== 0) {
            str += '&';
        }
        str += `${key}=${query[key]}`;
        return str;
    }, '');

    if (appendantString !== '') {
        url = hasQueryString ? url + '&' + appendantString : url + '?' + appendantString;
    }

    return makeCancellable(new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(type, url, async);
        if (contentType) {
            xhr.setRequestHeader('Content-Type', contentType);
        }
        // xhr.setRequestHeader('Accept', 'application/json');

        //  Response to preflight request doesn't pass access control check: A wildcard '*'
        //  cannot be used in the 'Access-Control-Allow-Origin' header when the credentials flag is true.
        // 跨域的请求先全部设置成 false
        xhr.withCredentials = !isCors;
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new HttpClientError(xhr.status, {code: xhr.status}));
            }
        };
        xhr.onerror = reject;
        let sendPayload;
        if (noJson) {
            sendPayload = payload;
        } else {
            sendPayload = typeof payload === 'undefined' ? undefined : JSON.stringify(payload);
        }
        xhr.send(sendPayload);
    }));
}

export default {
    get: (url, query) => request('get', {url, query}),
    post: (url, payload, query, contentType, {isCors, async, noJson, noParse} = {}) => request('post', {url, payload, query, contentType, isCors, async, noJson, noParse}),
    put: (url, payload, query, contentType, {isCors, async, noJson, noParse} = {}) => request('put', {url, payload, query, contentType, isCors, async, noJson, noParse}),
    delete: (url, payload, query, contentType, {isCors, async, noJson, noParse} = {}) => request('delete', {url, payload, query, contentType, isCors, async, noJson, noParse}),
    // 上传文件
    putFile: (url, payload, query, contentType, {isCors, async, noJson, noParse} = {}) => kRequestFile('post', {url, payload, query, contentType, isCors, async, noJson, noParse})
};

export {
    request
};

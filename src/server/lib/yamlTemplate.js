import _ from 'lodash';

const generateSpace = (num = 0) => {
    let space = '';
    for(let i = 0; i < num; i++) {
        space += '  ';
    }
    return space;
}


const generateItem = (prefixNum,name, value, defaultValue) => {
    if (value) {
        return generateSpace(prefixNum) + `${name}: ${value}\n`;
    } else if (defaultValue) {
        return generateSpace(prefixNum) + `${name}: ${defaultValue}\n`;
    }
    return '';
}

const generateSwagger = () => {
    return generateItem(0, 'swagger', '\'2.0\'');
}

const generateInfo = (docInfo) => {
    return 'info:\n' +
            generateItem(1, 'description', docInfo.description ? docInfo.description + '' : '') +
            generateItem(1, 'version', '1.0.0') +
            generateItem(1, 'title', docInfo.name ? docInfo.name + '' : '', '未命名');
}

const generateUrl = () => {
    return 'schemes:\n' +
            generateSpace(1) + '- https\n';
}

const generatePaths = (apis = []) => {
    const _generatePathParam = (prefix, path) => {
        const yaml = generateSpace(prefix) + `- name: ${path.name}\n` +
                generateSpace(prefix + 1) + `in: path\n` +
                generateItem(prefix + 1, 'description', path.description) +
                generateItem(prefix + 1, 'type', path.type) +
                generateItem(prefix + 1, 'required', true);
        return yaml;
    }
    const _generateQueryParam = (prefix, query) => {
        const yaml = generateSpace(prefix) + `- name: ${query.name}\n` +
                generateSpace(prefix + 1) + `in: query\n` +
                generateItem(prefix + 1, 'description', query.description) +
                generateItem(prefix + 1, 'type', query.type) +
                generateItem(prefix + 1, 'required', query.required);
        return yaml;
    }

    const _generateBodyParams = (prefix, body = {type: '', items: []}) => {
        if (!body.type || items.length === 0) {
            return '';
        }
        let bodyYaml = generateSpace(prefix) + `- name: body\n` +
                        generateSpace(prefix + 1) + `in: body\n` +
                        generateItem(prefix + 1, 'type', body.type, 'object');
        if (body.type === 'array') {
            // 下面先不考虑array的情况
            bodyYaml += generateSpace(prefix + 1) + 'items:\n';
            prefix++;
        }
        const items = body.items;
        // 取出所有必填项
        const required = [];
        items.map(item => {
            if (item.required === true || item.required === 'true') {
                required.push(item);
            }
        });
        if (required.length > 0 ) {
            bodyYaml += generateSpace(prefix + 1) + 'required:\n' +
                        required.map(r => generateSpace(prefix + 2) + '- ' + r.name).join('');
        }
        bodyYaml += generateSpace(prefix + 1) + 'properties:\n' +
                    items.map(item => {
                        return generateSpace(prefix + 2) + `${item.name}:\n` +
                                generateItem(prefix + 3, 'type', item.type);
                    }).join('');
        return bodyYaml;
    }

    const _generateParameters = (prefix, {path = [], query = [], body = {}}) => {
        const pathYaml = path.map(p => {
            return _generatePathParam(prefix, p)
        }).join('');

        const queryYaml = query.map(q => {
            return _generateQueryParam(prefix, q);
        }).join('');

        const bodyYaml = _generateBodyParams(prefix, body);

        let paramsYaml = pathYaml + queryYaml + bodyYaml;
        if (paramsYaml.length > 0) {
            return generateSpace(prefix) + 'parameters:\n' + paramsYaml;
        } else {
            return '';
        }
    }
    const _generateResponse = (prefix, response) => {
        let responseYaml = generateSpace(prefix) + `responses:\n` +
                            response.map(r => {
                                let tmpYaml = generateSpace(prefix + 1) + `${r.name}:\n` +
                                        generateItem(prefix + 2, 'description', r.description, `状态码：${r.name}`) +
                                        generateSpace(prefix + 2) + `schema:\n` + 
                                        generateItem(prefix + 3, 'type', r.type);
                                
                                if (r.type === 'array') {
                                    // 下面先不考虑array的情况
                                    tmpYaml += generateSpace(prefix + 3) + 'items:\n';
                                    prefix++;
                                }
                                const items = r.schemaObj.dataSource;
                                // 取出所有必填项
                                const required = [];
                                items.map(item => {
                                    if (item.required === true || item.required === 'true') {
                                        required.push(item);
                                    }
                                });
                                if (required.length > 0 ) {
                                    tmpYaml += generateSpace(prefix + 3) + 'required:\n' +
                                                required.map(r => generateSpace(prefix + 4) + `- ${r.name}\n`).join('');
                                }
                                tmpYaml += generateSpace(prefix + 3) + 'properties:\n' +
                                            items.map(item => {
                                                return generateSpace(prefix + 4) + `${item.name}:\n` +
                                                        generateItem(prefix + 5, 'type', item.type);
                                            }).join('');
                                return tmpYaml;
                            }).join('');

        return responseYaml;
    }
    const _generatePath = (prefix, data = []) => {
        let yaml = generateSpace(prefix) + `${data[0].basicInfo.path}:\n`;
        let pNum = prefix + 1;
        yaml = yaml + data.map(api => {
            const {basicInfo, path, query, body, response} = api;
            let subService = basicInfo.subService ? `子服务：${basicInfo.subService};<br>` : '';
            return generateSpace(pNum) + `${basicInfo.method}:\n` +
                    generateItem(pNum + 1, 'summary', basicInfo.name ? basicInfo.name + '' : '') +
                    generateItem(pNum + 1, 'description', subService + basicInfo.description) +
                    _generateParameters(pNum + 1, {path, query, body}) +
                    _generateResponse(pNum + 1, response);
        }).join('');

        return yaml;
    }

    // 取出path相同不同method的api进行渲染
    const parseApis = {};
    apis.map(api => {
        const path = api.basicInfo.path;
        const method = api.basicInfo.method;
        if(parseApis[path] && parseApis[path].length > 0) {
            // 判断是否有重合的API
            const tmp = _.find(parseApis[path], (v) => {
                return (v.method === method);
            });
            if (tmp) {
                console.log('重复的API：', path + ':' + method);
            } else {
                parseApis[path].push(api);
            }
        } else {
            parseApis[path] = [];
            parseApis[path].push(api);
        }
    });

    // 渲染
    let pathsYaml = Object.keys(parseApis).map(key => {
        const value = parseApis[key];
        return _generatePath(1, value);
    }).join('');

    return 'paths:\n' + pathsYaml;
}

const generateYaml = (docInfo, apis) => {
    const yaml = generateSwagger() +
                generateInfo(docInfo) +
                generateUrl() +
                generatePaths(apis);
    return yaml;
}

export default generateYaml;
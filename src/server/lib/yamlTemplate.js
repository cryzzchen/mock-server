/*
* 生成yaml,这个文件用2空格
*/

const _generateSwagger = () => {
    return 'swagger: \'2.0\'\n';
}

const _generateInfo = (docInfo = {}) => {
    return 'info:\n' +
            (docInfo.description ? ('  description: ' + (docInfo.description + '') + '\n'): '') +
            '  version: 1.0.0\n' +
            '  title: ' + (docInfo.name + '') + '\n';

}

const _generateUrl = (data = {}) => {
    return 'schemes:\n' +
            '  - https\n';
}

const _generatePaths = (apis = []) => {

    const _generateParamsType = (prefix, data) => {
      try {
        const type = typeof data;
        if (type === 'object') {
          // 判断是否为数组
          if (data instanceof Array) {
          // 数组
            if (data[0] !== undefined) {
              const subType = typeof data[0];
              return prefix + 'type: array\n' +
                      prefix + 'items:\n' +
                      prefix + `  type: ${subType}\n`;
            } else {
              return prefix + 'type: array\n' +
                      prefix + 'items:\n' +
                      prefix + '  type: string\n';
            }
          } else {
            return prefix + 'type: object\n';
          }
        } else {
          return prefix + `type: ${type}\n`;
        }
      } catch(e) {
        return  prefix + `type: string\n`;
      }
    }

    const _generatePathParam = (data, prefix) => {
        const param = prefix + `- name: ${data.name}\n` +
               prefix + `  in: path\n` +
               prefix + `  description: ${data.description}\n` +
               prefix + `  type: ${data.type}\n` +
               prefix + `  required: true\n`;
        
        return param;
    }

    const _generateQueryParam = (data, prefix) => {
      let param = prefix + `- name: ${data.name}\n` +
               prefix + `  in: query\n` +
               prefix + `  description: ${data.description}\n` +
               prefix + `  type: ${data.type}\n`;
               
        if (data.required) {
          param += prefix + `  required: true\n`;
        }

        return param;
    }

    const _generateBodyParam = (data, prefix) => {
      let params = '';
      Object.keys(data).map(key => {
        const v = data[key];
        const tmp = prefix + `- name: ${key}\n` +
                    prefix + `  in: body\n` +
                    prefix + `  schema:\n` +
                    _generateParamsType(prefix + '      ', data);
        params += tmp;

      });
      return params;
    }

    const _generateParameters = ({path, query, body = {}}, prefix) => {
        const parameters = path.map(p => _generatePathParam(p, prefix)).join('') +
                query.map(p => _generateQueryParam(p, prefix)).join('') +
                _generateBodyParam(body, prefix);
        if (parameters.length > 0) {
          return prefix + 'parameters:\n' + parameters;
        }
        return '';
    }

    const _generateResponse = (data = {}, prefix) => {
      // response必需有description
      let response = prefix + 'responses:\n';
      Object.keys(data).map(key => {
        const v = data[key];
        const tmp = prefix + `  ${key}:\n` +
                    prefix + `    description: code is ${key}\n`+
                    prefix + `    schema:\n` +
                    _generateParamsType(prefix + '      ', data);
        response += tmp;
      });
      return response;
    }

    let pathPatterns = [];
    const _generatePath = ({basicInfo, path, query, body, response}, prefix) => {
        // 不允许有相同的路径 + 相同的method出现
        const tmp = basicInfo.path + '[' + basicInfo.method;
        console.log(tmp, pathPatterns);
        if (pathPatterns.indexOf(tmp) >= 0) {
          console.log(2222)
          return '';
        }
        pathPatterns.push(tmp);

        return prefix + `${basicInfo.path}:\n` +
               prefix + `  ${basicInfo.method}:\n` +
               prefix + `    summary: ${basicInfo.name}\n` +
               prefix + `    description: 子服务：${basicInfo.subService};<br> ${basicInfo.description}\n` +
               _generateResponse(response, prefix + '    ') +
               _generateParameters({path, query, body}, prefix + '    ');
    }

    // todo 循环
    return 'paths:\n' + apis.map(api => _generatePath(api, '  ')).join('');
}

const generateYaml = (docInfo, apis) => {
    const yaml = _generateSwagger() +
                    _generateInfo(docInfo) +
                    _generateUrl() +
                    _generatePaths(apis);
                    console.log(yaml)
    return yaml;
}

export default generateYaml;
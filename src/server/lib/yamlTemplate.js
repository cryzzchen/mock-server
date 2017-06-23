/*
* 生成yaml,这个文件用2空格
*/

const _generateSwagger = () => {
    return 'swagger: \'2.0\'\n';
}

const _generateInfo = (docInfo = {}) => {
  console.log(docInfo);
    return 'info:\n' +
            '  description: ' + (docInfo.description + '') + '\n' +
            '  version: 1.0.0\n' +
            '  title: ' + (docInfo.name + '') + '\n';

}

const _generateUrl = (data = {}) => {
    return 'schemes:\n' +
            '  - https\n';
}

const _generatePaths = (apis = []) => {
    const pathPatterns = [];

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
      console.log(data);
    }

    const _generateParameters = ({path, query, body}, prefix) => {
        const parameters = path.map(p => _generatePathParam(p, prefix)).join('') +
                query.map(p => _generateQueryParam(p, prefix)).join('') +
                body.map(p => _generateBodyParam(p, prefix)).join('');
        if (parameters.length > 0) {
          return prefix + 'parameters:\n' + parameters;
        }
        return '';
    }

    const _generateResponse = (data, prefix) => {
        return prefix + 'responses:\n' +
               prefix + '  200:\n' +
               prefix + '    description: A list of test\n' +
               prefix + '    schema:\n' +
               prefix + '      type: array\n' +
               prefix + '      items:\n' +
               prefix + '        required:\n' +
               prefix + '          - username\n' +
               prefix + '        properties:\n' +
               prefix + '          username:\n' +
               prefix + '            type: string\n' +
               prefix + '          firstname:\n' +
               prefix + '            type: string\n';
    }


    const _generatePath = ({basicInfo, path, query, body}, prefix) => {
        // 不允许有相同的路径 + 相同的method出现
        const tmp = basicInfo.path + '/' + basicInfo.method;
        if (pathPatterns.indexOf(tmp) >= 0) {
          return '';
        }
        pathPatterns.push(tmp);

        return prefix + `${basicInfo.path}:\n` +
               prefix + `  ${basicInfo.method}:\n` +
               prefix + `    summary: ${basicInfo.name}\n` +
               prefix + `    description: 子服务：${basicInfo.subService};<br> ${basicInfo.description}\n` +
               _generateResponse(path, prefix + '    ') +
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
    return yaml;
}

export default generateYaml;
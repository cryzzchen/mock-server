/*
* 生成yaml
*/

const _generateSwagger = () => {
    return 'swagger: \'2.0\'\n';
}

const _generateInfo = (data = {}) => {
    return 'info:\n' +
            '  - description: ' + data.description + '\n' +
            '  - version: 1.0.0' +
            '  - title: ' + '测试文档' + '\n';

}

const _generateUrl = (data = {}) => {
    return 'schemes:\n' +
            '  - https\n';
}

const _generatePaths = (data = {}) => {
    const _generateQuery = (data, prefix) => {
        return prefix + '- name: size\n' +
               prefix + '  in: query\n' +
               prefix + '  description: 这里是测试\n' +
               prefix + '  type: integer\n';
    }

    const _generateParameters = (data, prefix) => {
        return prefix + 'parameters:\n' +
                _generateQuery(data, prefix);
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


    const _generatePath = (path, prefix) => {
        return prefix + '/api/test\n' +
               prefix + '  get:\n' +
               prefix + '    summary: 这个是测试API\n' +
               prefix + '    description: 这里是详细描述详细描述\n' +
               _generateResponse(path, prefix + '    ') +
               _generateParameters(path, prefix + '    ');
    }

    // todo 循环
    return 'paths:\n' + _generatePath(data.path, '  ');
}

const generateYaml = () => {
    const yaml = _generateSwagger() +
                    _generateInfo() +
                    _generateUrl() +
                    _generatePaths();
    return yaml;
}
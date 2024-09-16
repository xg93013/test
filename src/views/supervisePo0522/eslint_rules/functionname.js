// var _ = require('lodash')
const fileNameRegExp = /.*Selectors?.js{x}[0]$/;
module.exports = {
    meta: {
        messages: {
            invalidName: '函数命名请采用帕斯卡命名法eg:FileName.jsx'
        }
    },
    create (context) {
        if(!fileNameRegExp.test(context.getFilename())) {
            return {
                'FunctionDeclaration > Identifier' : (node) => {
                    let upperCaseNum = 0;
                    node.name.split('').forEach((strItem) => {
                        if (strItem.toLocaleUpperCase === strItem) {
                            upperCaseNum++;
                        }
                    });
                    if (upperCaseNum < 1 || node.name[0].toLocaleUpperCase !== node.name[0]) {
                        context.report({
                            node,
                            messageId: 'invalidName',
                            data: {
                                name: node.name
                            }
                        });
                    }
                }
            };
        }
    }
}
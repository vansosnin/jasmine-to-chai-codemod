export default function transformer(file, api) {
    const j = api.jscodeshift;
    const { statement } = j.template;

    return j(file.source)
        .find(j.ExpressionStatement, {
            expression: {
                type: j.CallExpression.name,
                callee: {
                    type: j.MemberExpression.name,
                    object: {
                        type: j.CallExpression.name,
                        callee: {
                            type: j.Identifier.name,
                            name: 'expect'
                        }
                    }
                }
            }
        })
        .replaceWith(({value: node}) => {
            const fnCall = node.expression;
            const [expectArg] = fnCall.callee.object.arguments
                ? fnCall.callee.object.arguments
                : fnCall.callee.object.object.arguments;

            switch(fnCall.callee.property.name) {
                case 'toBeFalsy':
                    return statement`expect(${expectArg}).not.to.be.ok;`;
                case 'toBeTruthy':
                    return statement`expect(${expectArg}).to.be.ok;`;
                case 'toBeUndefined':
                    return statement`expect(${expectArg}).to.be.undefined;`;
                case 'toBeDefined':
                    return statement`expect(${expectArg}).to.not.be.undefined;`;
                case 'toBeNull':
                    return statement`expect(${expectArg}).to.be.null;`;
                case 'toThrow':
                case 'toThrowError':
                    return transformThrow(expectArg, fnCall.arguments) || node;
                default:
                    return node;
            }
        })
        .toSource();

    function transformThrow(expectArg, [throwArg]) {
        if (!throwArg) {
            return statement`expect(${expectArg}).to.throw(Error);`;
        } else if (throwArg.type === j.Literal.name) {
            return statement`expect(${expectArg}).to.throw(Error, ${throwArg});`;
        } else if (throwArg.type === j.NewExpression.name) {
            const [innerArg] = throwArg.arguments;
            const errorType = throwArg.callee;
            return statement`expect(${expectArg}).to.throw(${errorType}, ${innerArg});`;
        }
        return undefined;
    }
};

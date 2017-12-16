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
        .replaceWith(
            p => {
                const fnCall = p.value.expression;
                const [expectArg] = fnCall.callee.object.arguments
                    ? fnCall.callee.object.arguments
                    : fnCall.callee.object.object.arguments;
                const [chainArg] = fnCall.arguments;

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
                        if (!chainArg) {
                            return statement`expect(${expectArg}).to.throw(Error);`;
                        } else if (chainArg.type === j.Literal.name) {
                            return statement`expect(${expectArg}).to.throw(Error, ${chainArg});`;
                        } else if (chainArg.type === j.NewExpression.name) {
                            const [innerArg] = chainArg.arguments;
                            const errorType = chainArg.callee;
                            return statement`expect(${expectArg}).to.throw(${errorType}, ${innerArg});`;
                        }
                        return p.value;

                    default:
                        return p.value;
                }
            }
        )
        .toSource();
};

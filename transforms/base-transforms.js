export default function transformer(file, api) {
    const j = api.jscodeshift;
    const { statement } = j.template;

    const root = j(file.source);

    const importExpectChaiDeclarations = root.find(j.ImportDeclaration, {
        specifiers: [{
            local: {
                name: 'expect'
            }
        }],
        source: {
            value: 'chai'
        }
    });
    const hasImportExpectChai = importExpectChaiDeclarations.__paths.length > 0;

    return root
        .find(j.Program)
        .replaceWith(p => {
            if (!hasImportExpectChai) {
                p.value.body.unshift("import { expect } from 'chai';");
            }
            return p.value;
        })

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
                const [expectArg] = p.value.expression.callee.object.arguments
                    ? p.value.expression.callee.object.arguments
                    : p.value.expression.callee.object.object.arguments;
                const [chainArg] = p.value.expression.arguments;

                switch(p.value.expression.callee.property.name) {
                    case 'toBeFalsy':
                        return statement`expect(${expectArg}).to.be.false;`;
                    case 'toBeTruthy':
                        return statement`expect(${expectArg}).to.be.true;`;
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

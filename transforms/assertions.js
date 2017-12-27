const expectPattern = {
    expression: {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'expect'
                }
            }
        }
    }
};

const expectNotPattern = {
    expression: {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object: {
                type: 'MemberExpression',
                object: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'expect'
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'not'
                }
            }
        }
    }
};

const jasmineAny = {
    type: 'CallExpression',
    callee: {
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: 'jasmine'
        },
        property: {
            type: 'Identifier',
            name: 'any'
        }
    },
    arguments: [{
        type: 'Identifier'
    }]
};

export default function transformer(file, {jscodeshift: j}) {
    const { statement } = j.template;

    return j(file.source)
        .find(j.ExpressionStatement, (node) => isExpect(node) || isExpectNot(node))
        .replaceWith(({value: node}) => {
            const fnCall = node.expression;
            if (isExpect(node)) {
                return transformExpect(fnCall, fnCall.callee.object.arguments, {to: true}) || node;
            } else {
                return transformExpect(fnCall, fnCall.callee.object.object.arguments, {to: false}) || node;
            }
        })
        .toSource();

    function isExpect(node) {
        return j.match(node, expectPattern);
    }

    function isExpectNot(node) {
        return j.match(node, expectNotPattern);
    }

    function transformExpect(fnCall, [expectArg], {to}) {
        const args = fnCall.arguments;

        switch(fnCall.callee.property.name) {
            case 'toBeFalsy':
                return statement`expect(${expectArg}).${maybeNot(!to)}.be.ok;`;
            case 'toBeTruthy':
                return statement`expect(${expectArg}).${maybeNot(to)}.be.ok;`;
            case 'toBeUndefined':
                return statement`expect(${expectArg}).${maybeNot(to)}.be.undefined;`;
            case 'toBeDefined':
                return statement`expect(${expectArg}).${maybeNot(!to)}.be.undefined;`;
            case 'toBeNull':
                return statement`expect(${expectArg}).${maybeNot(to)}.be.null;`;
            case 'toBe':
                const primitiveAssertion = builtinPrimitiveAssertion(args[0]);
                if (primitiveAssertion) {
                    return statement`expect(${expectArg}).${maybeNot(to)}.be.${primitiveAssertion};`;
                } else {
                    return statement`expect(${expectArg}).${maybeNot(to)}.equal(${args[0]});`;
                }
            case 'toEqual':
                if (isJasmineAny(args[0])) {
                    const classVariable = args[0].arguments[0];
                    const typeofString = toTypeofString(classVariable);
                    if (typeofString) {
                        return statement`expect(${expectArg}).${maybeNot(to)}.be.a(${typeofString});`;
                    } else {
                        return statement`expect(${expectArg}).${maybeNot(to)}.be.an.instanceof(${classVariable});`;
                    }
                } else {
                    return statement`expect(${expectArg}).${maybeNot(to)}.deep.equal(${args[0]});`;
                }
            case 'toMatch':
                return statement`expect(${expectArg}).${maybeNot(to)}.match(${args[0]});`;
            case 'toContain':
                return statement`expect(${expectArg}).${maybeNot(to)}.contain(${args[0]});`;
            case 'toThrow':
                // toThrow()                          -> to.throw()                   (!!)
                // toThrow("msg")                     -> to.throw("msg")
                // toThrow(TypeError)                 -> to.throw(TypeError)
                // toThrow(new TypeError("msg"))      -> to.throw(TypeError, "msg")
                return transformThrow(expectArg, toThrowArgs(args), {to});
            case 'toThrowError':
                // toThrowError()                     -> to.throw(Error)              (!!)
                // toThrowError("msg")                -> to.throw("msg")
                // toThrowError(TypeError)            -> to.throw(TypeError)
                // toThrowError(new TypeError("msg")) -> to.throw(TypeError, "msg")
                // toThrowError(TypeError, "msg")     -> to.throw(TypeError, "msg")   (!!)
                return transformThrow(expectArg, toThrowErrorArgs(args), {to});

            // By default return nothing, so we can default back to the original AST node.
            default:
                return undefined;
        }
    }

    function maybeNot(to) {
        return to ? 'to' : 'not.to';
    }

    function builtinPrimitiveAssertion(node) {
        if (j.match(node, {type: 'Identifier', name: 'undefined'})) {
            return node;
        }
        if (
            j.match(node, {type: 'Literal', value: null, raw: 'null'}) ||
            j.match(node, {type: 'Literal', value: false, raw: 'false'}) ||
            j.match(node, {type: 'Literal', value: true, raw: 'true'})
        ) {
            return {type: 'Identifier', name: node.raw};
        }
    }

    function isJasmineAny(node) {
        return j.match(node, jasmineAny);
    }

    // For String and Boolean, we use typeof check instead of instanceof
    function toTypeofString({name}) {
        const typeofMap = {
            String: 'string',
            Boolean: 'boolean'
        };

        if (typeofMap[name]) {
            return {
                type: 'Literal',
                value: typeofMap[name],
            };
        }
    }

    function toThrowArgs([arg]) {
        if (!arg) {
            return [];
        } else {
            return singleThrowArg(arg);
        }
    }

    function toThrowErrorArgs(args) {
        switch (args.length) {
            case 0:
                return ["Error"];
            case 1:
                return singleThrowArg(args[0]);
            case 2:
            default:
                return args;
        }
    }

    function singleThrowArg(arg) {
        if (arg.type === 'NewExpression') {
            const {callee: errorType, arguments: [constructorArg]} = arg;
            return [errorType, constructorArg];
        } else {
            return [arg];
        }
    }

    function transformThrow(expectArg, [errorType, msg], {to}) {
        if (!errorType) {
            return statement`expect(${expectArg}).${maybeNot(to)}.throw();`;
        } if (errorType && !msg) {
            return statement`expect(${expectArg}).${maybeNot(to)}.throw(${errorType});`;
        } else {
            return statement`expect(${expectArg}).${maybeNot(to)}.throw(${errorType}, ${msg});`;
        }
    }
};

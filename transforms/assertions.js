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
                return statement`expect(${expectArg}).${maybeNot(to)}.equal(${fnCall.arguments[0]});`;
            case 'toEqual':
                return statement`expect(${expectArg}).${maybeNot(to)}.deep.equal(${fnCall.arguments[0]});`;
            case 'toMatch':
                return statement`expect(${expectArg}).${maybeNot(to)}.match(${fnCall.arguments[0]});`;
            case 'toContain':
                return statement`expect(${expectArg}).${maybeNot(to)}.contain(${fnCall.arguments[0]});`;
            case 'toThrow':
                // toThrow()                          -> to.throw()                   (!!)
                // toThrow("msg")                     -> to.throw("msg")
                // toThrow(TypeError)                 -> to.throw(TypeError)
                // toThrow(new TypeError("msg"))      -> to.throw(TypeError, "msg")
                return transformThrow(expectArg, toThrowArgs(fnCall.arguments), {to});
            case 'toThrowError':
                // toThrowError()                     -> to.throw(Error)              (!!)
                // toThrowError("msg")                -> to.throw("msg")
                // toThrowError(TypeError)            -> to.throw(TypeError)
                // toThrowError(new TypeError("msg")) -> to.throw(TypeError, "msg")
                // toThrowError(TypeError, "msg")     -> to.throw(TypeError, "msg")   (!!)
                return transformThrow(expectArg, toThrowErrorArgs(fnCall.arguments), {to});
        }
    }

    function maybeNot(to) {
        return to ? 'to' : 'not.to';
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

export default function transformer(file, {jscodeshift: j}) {
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
                    // toThrow()                          -> to.throw()                   (!!)
                    // toThrow("msg")                     -> to.throw("msg")
                    // toThrow(TypeError)                 -> to.throw(TypeError)
                    // toThrow(new TypeError("msg"))      -> to.throw(TypeError, "msg")
                    return transformThrow(expectArg, toThrowArgs(fnCall.arguments));
                case 'toThrowError':
                    // toThrowError()                     -> to.throw(Error)              (!!)
                    // toThrowError("msg")                -> to.throw("msg")
                    // toThrowError(TypeError)            -> to.throw(TypeError)
                    // toThrowError(new TypeError("msg")) -> to.throw(TypeError, "msg")
                    // toThrowError(TypeError, "msg")     -> to.throw(TypeError, "msg")   (!!)
                    return transformThrow(expectArg, toThrowErrorArgs(fnCall.arguments));
                default:
                    return node;
            }
        })
        .toSource();

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
        if (arg.type === j.NewExpression.name) {
            const {callee: errorType, arguments: [constructorArg]} = arg;
            return [errorType, constructorArg];
        } else {
            return [arg];
        }
    }

    function transformThrow(expectArg, [errorType, msg]) {
        if (!errorType) {
            return statement`expect(${expectArg}).to.throw();`;
        } if (errorType && !msg) {
            return statement`expect(${expectArg}).to.throw(${errorType});`;
        } else {
            return statement`expect(${expectArg}).to.throw(${errorType}, ${msg});`;
        }
    }
};

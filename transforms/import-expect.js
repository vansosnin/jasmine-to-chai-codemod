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
        .toSource();
};

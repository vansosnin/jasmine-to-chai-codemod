export default function transformer(file, {jscodeshift: j}) {
    const { statement } = j.template;

    const root = j(file.source);

    return root
        .find(j.Program)
        .replaceWith(({value: node}) => {
            if (!hasImportExpect(root)) {
                node.body.unshift("import { expect } from 'chai';");
            }
            return node;
        })
        .toSource();

    function hasImportExpect(root) {
        const declarations = root.find(j.ImportDeclaration, {
            specifiers: [{
                local: {
                    name: 'expect'
                }
            }],
            source: {
                value: 'chai'
            }
        });

        return declarations.__paths.length > 0;
    }
};

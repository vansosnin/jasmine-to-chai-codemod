export default function transformer(file, {jscodeshift: j}) {
    return j(file.source)
        .find(j.Identifier)
        .replaceWith(({value: node}) => {
            switch (node.name) {
                case 'toBe':
                    return 'to.equal';
                case 'toEqual':
                    return 'to.deep.equal';
                case 'toMatch':
                    return 'to.match';
                case 'toContain':
                    return 'to.contain';

                default:
                    return node;
            }
        })
        .toSource();
};

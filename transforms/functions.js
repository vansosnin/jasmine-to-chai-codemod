export default function transformer(file, api) {
    const j = api.jscodeshift;

    return j(file.source)
        .find(j.Identifier)
        .replaceWith(
            p => {
                switch (p.value.name) {
                    case 'toBe':
                        return 'to.equal';
                    case 'toEqual':
                        return 'to.deep.equal';
                    case 'toMatch':
                        return 'to.match';
                    case 'toContain':
                        return 'to.contain';

                    default:
                        return p.value.name;
                }
            }
        )
        .toSource();
};

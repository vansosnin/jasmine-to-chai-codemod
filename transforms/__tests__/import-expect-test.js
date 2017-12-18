import {defineTest} from 'jscodeshift/dist/testUtils';

defineTest(__dirname, 'import-expect');
defineTest(__dirname, 'import-expect', null, 'import-expect-existing');

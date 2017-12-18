import transform from '../import-expect';
import {defineInlineTest} from 'jscodeshift/dist/testUtils';

// No imports in file
defineInlineTest(transform, {},
`expect();`,
`import { expect } from 'chai';
expect();`
);

// Some other imports exist
defineInlineTest(transform, {},
`import foo from 'bar';
expect();`,
`import { expect } from 'chai';
import foo from 'bar';
expect();`
);

// Import of expect already exists
defineInlineTest(transform, {},
`import {expect} from 'chai';
expect();`,
`import {expect} from 'chai';
expect();`
);

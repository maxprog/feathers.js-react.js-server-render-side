'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('transactions service', function() {
  it('registered the transactions service', () => {
    assert.ok(app.service('transactions'));
  });
});

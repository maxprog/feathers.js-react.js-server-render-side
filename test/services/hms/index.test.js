'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('hms service', function() {
  it('registered the hms service', () => {
    assert.ok(app.service('hms'));
  });
});

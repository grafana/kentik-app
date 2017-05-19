'use strict';

var _query_builder = require('../datasource/query_builder');

var _query_builder2 = _interopRequireDefault(_query_builder);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Kentik Query Builder', function () {
  var ctx = {};
  var defined = _sinon2.default.match.defined;

  beforeEach(function () {});

  describe('When building Kentik filter group', function () {
    it('should build proper filters', function (done) {
      var filters = [{ key: "Source Country", operator: "=", value: "US" }];

      var expectedGroup = [{
        filters: [{ filterField: "src_geo", operator: "=", filterValue: "US" }],
        connector: "All",
        not: false
      }];

      var filterGroup = _query_builder2.default.convertToKentikFilterGroup(filters);
      expect(filterGroup).to.eql(expectedGroup);
      done();
    });
  });
});

"use strict";

var _module = require("../datasource/module");

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('KentikDatasource', function () {
  var ctx = {};
  var defined = _sinon2.default.match.defined;

  beforeEach(function () {
    ctx.$q = _q2.default;
    ctx.kentikProxySrv = {};
    ctx.templateSrv = {};

    var instanceSettings = {};
    ctx.ds = new _module.Datasource(instanceSettings, {}, ctx.templateSrv);
  });

  describe('When building Kentik filter group', function () {
    it('should build proper filters', function (done) {
      var filters = [{ key: "Source Country", operator: "=", value: "US" }];

      var expectedGroup = [{
        filters: [{ filterField: "src_geo", operator: "=", filterValue: "US" }],
        connector: "All",
        not: false
      }];

      var filterGroup = ctx.ds.convertToKentikFilterGroup(filters);
      expect(filterGroup).to.eql(expectedGroup);
      done();
    });
  });
});

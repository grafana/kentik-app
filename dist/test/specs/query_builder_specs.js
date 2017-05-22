'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _query_builder = require('../datasource/query_builder');

var _query_builder2 = _interopRequireDefault(_query_builder);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Moment = function () {
  function Moment(time) {
    _classCallCheck(this, Moment);

    this.time = time;
  }

  _createClass(Moment, [{
    key: 'utc',
    value: function utc() {
      return this;
    }
  }, {
    key: 'format',
    value: function format() {
      return this.time;
    }
  }]);

  return Moment;
}();

describe('Kentik Query Builder', function () {
  var ctx = {};
  var defined = _sinon2.default.match.defined;

  beforeEach(function () {
    ctx.range = {
      from: new Moment("1970-01-01 00:00:00"),
      to: new Moment("1970-01-01 01:00:00")
    };
  });

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

  describe('When building topXData query', function () {
    beforeEach(function () {
      ctx.query_options = {
        unit: "bytes",
        metric: "src_geo_region",
        deviceNames: "cat2_demo",
        range: ctx.range,
        kentikFilterGroups: []
      };
    });

    it('should build proper topXData query', function (done) {
      var expectedQuery = {
        "metric": "bytes",
        "dimension": ["src_geo_region"],
        "device_name": "cat2_demo",
        "outsort": "avg_both",
        "time_format": "UTC",
        "ending_time": "1970-01-01 01:00:00",
        "starting_time": "1970-01-01 00:00:00",
        "matrixBy": [],
        "cidr": 32,
        "cidr6": 128,
        "topx": "8",
        "depth": 100,
        "fastData": "Auto",
        "lookback_seconds": 0,
        "filters_obj": {
          "connector": "All",
          "filterGroups": []
        },
        "aggregates": [{
          "name": "avg_both",
          "column": "f_sum_both_bytes",
          "fn": "average",
          "raw": true,
          "sample_rate": 1
        }, {
          "name": "p95th_both",
          "column": "f_sum_both_bytes",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "max_both",
          "column": "f_sum_both_bytes",
          "fn": "max",
          "sample_rate": 1
        }]
      };

      var topXDataQuery = _query_builder2.default.buildTopXdataQuery(ctx.query_options);
      expect(topXDataQuery).to.eql(expectedQuery);
      done();
    });

    it('should build proper Bits/s query', function (done) {
      ctx.query_options.unit = "bytes";

      var expectedQuery = {
        "metric": "bytes",
        "aggregates": [{
          "name": "avg_both",
          "column": "f_sum_both_bytes",
          "fn": "average",
          "raw": true,
          "sample_rate": 1
        }, {
          "name": "p95th_both",
          "column": "f_sum_both_bytes",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "max_both",
          "column": "f_sum_both_bytes",
          "fn": "max",
          "sample_rate": 1
        }]
      };

      var topXDataQuery = _query_builder2.default.buildTopXdataQuery(ctx.query_options);
      expect(topXDataQuery.metric).to.equal(expectedQuery.metric);
      expect(topXDataQuery.aggregates).to.eql(expectedQuery.aggregates);
      done();
    });

    it('should build proper Packets/s query', function (done) {
      ctx.query_options.unit = "packets";

      var expectedQuery = {
        "metric": "packets",
        "aggregates": [{
          "name": "avg_both",
          "column": "f_sum_both_pkts",
          "fn": "average",
          "raw": true,
          "sample_rate": 1
        }, {
          "name": "p95th_both",
          "column": "f_sum_both_pkts",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "max_both",
          "column": "f_sum_both_pkts",
          "fn": "max",
          "sample_rate": 1
        }]
      };

      var topXDataQuery = _query_builder2.default.buildTopXdataQuery(ctx.query_options);
      expect(topXDataQuery.metric).to.equal(expectedQuery.metric);
      expect(topXDataQuery.aggregates).to.eql(expectedQuery.aggregates);
      done();
    });

    it('should build proper Unique Src IPs query', function (done) {
      ctx.query_options.unit = "unique_src_ip";

      var expectedQuery = {
        "metric": "unique_src_ip",
        "aggregates": [{
          "name": "avg_ips",
          "column": "f_hll(inet_src_addr,0.0001)",
          "fn": "average",
          "raw": true,
          "sample_rate": 1
        }, {
          "name": "p95th_ips",
          "column": "f_hll(inet_src_addr,0.0001)",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "max_ips",
          "column": "f_hll(inet_src_addr,0.0001)",
          "fn": "max",
          "sample_rate": 1,
          "raw": true
        }, {
          "name": "p95th_bits_per_sec",
          "column": "f_sum_both_bytes",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "p95th_pkts_per_sec",
          "column": "f_sum_both_pkts",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }]
      };

      var topXDataQuery = _query_builder2.default.buildTopXdataQuery(ctx.query_options);
      expect(topXDataQuery.metric).to.equal(expectedQuery.metric);
      expect(topXDataQuery.aggregates).to.eql(expectedQuery.aggregates);
      done();
    });

    it('should build proper Unique Dst IPs query', function (done) {
      ctx.query_options.unit = "unique_dst_ip";

      var expectedQuery = {
        "metric": "unique_dst_ip",
        "aggregates": [{
          "name": "avg_ips",
          "column": "f_hll(inet_dst_addr,0.0001)",
          "fn": "average",
          "raw": true,
          "sample_rate": 1
        }, {
          "name": "p95th_ips",
          "column": "f_hll(inet_dst_addr,0.0001)",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "max_ips",
          "column": "f_hll(inet_dst_addr,0.0001)",
          "fn": "max",
          "sample_rate": 1,
          "raw": true
        }, {
          "name": "p95th_bits_per_sec",
          "column": "f_sum_both_bytes",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }, {
          "name": "p95th_pkts_per_sec",
          "column": "f_sum_both_pkts",
          "fn": "percentile",
          "rank": 95,
          "sample_rate": 1
        }]
      };

      var topXDataQuery = _query_builder2.default.buildTopXdataQuery(ctx.query_options);
      expect(topXDataQuery.metric).to.equal(expectedQuery.metric);
      expect(topXDataQuery.aggregates).to.eql(expectedQuery.aggregates);
      done();
    });
  });
});

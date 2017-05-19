import queryBuilder from '../datasource/query_builder';
import sinon from 'sinon';

class Moment {
  constructor(time) {
    this.time = time;
  }
  utc() { return this; }
  format() { return this.time; }
}

describe('Kentik Query Builder', () => {
  let ctx = {};
  let defined = sinon.match.defined;

  beforeEach(function () {
    ctx.range = {
      from: new Moment("1970-01-01 00:00:00"),
      to: new Moment("1970-01-01 01:00:00")
    };
  });

  describe('When building Kentik filter group', () => {
    it('should build proper filters', (done) => {
      let filters = [
        { key: "Source Country", operator: "=", value: "US" }
      ];

      let expectedGroup = [{
        filters: [
          { filterField: "src_geo", operator: "=", filterValue: "US" }
        ],
        connector: "All",
        not: false
      }];

      let filterGroup = queryBuilder.convertToKentikFilterGroup(filters);
      expect(filterGroup).to.eql(expectedGroup);
      done();
    });
  });

  describe('When building topXData query', () => {
    it('should build proper Bits/s query', (done) => {
      let query_options = {
        unit: "bytes",
        metric: "src_geo_region",
        deviceNames: "cat2_demo",
        range: ctx.range,
        kentikFilterGroups: []
      };

      let expectedQuery = {
        "metric": "bytes",
        "dimension": [
          "src_geo_region"
        ],
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
        "aggregates": [
          {
            "name": "avg_both",
            "column": "f_sum_both_bytes",
            "fn": "average",
            "raw": true,
            "sample_rate": 1
          },
          {
            "name": "p95th_both",
            "column": "f_sum_both_bytes",
            "fn": "percentile",
            "rank": 95,
            "sample_rate": 1
          },
          {
            "name": "max_both",
            "column": "f_sum_both_bytes",
            "fn": "max",
            "sample_rate": 1
          }
        ]
      };

      let topXDataQuery = queryBuilder.buildTopXdataQuery(query_options);
      expect(topXDataQuery).to.eql(expectedQuery);
      done();
    });
  });

});

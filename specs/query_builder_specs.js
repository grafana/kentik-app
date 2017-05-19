import queryBuilder from '../datasource/query_builder';
import sinon from 'sinon';

describe('Kentik Query Builder', () => {
  let ctx = {};
  let defined = sinon.match.defined;

  beforeEach(function () {
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

});

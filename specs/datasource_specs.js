import { Datasource } from "../datasource/module";
import Q from "q";
import sinon from 'sinon';

describe('KentikDatasource', () => {
  let ctx = {};
  let defined = sinon.match.defined;

  beforeEach(function () {
    ctx.$q = Q;
    ctx.kentikProxySrv = {};
    ctx.templateSrv = {};

    let instanceSettings = {};
    ctx.ds = new Datasource(instanceSettings, {}, ctx.templateSrv);
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

      let filterGroup = ctx.ds.convertToKentikFilterGroup(filters);
      expect(filterGroup).to.eql(expectedGroup);
      done();
    });
  });

});

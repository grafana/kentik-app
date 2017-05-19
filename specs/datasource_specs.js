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

  describe('When querying Kentik data', () => {
    it('pass', (done) => {
      done();
    });
  });

});

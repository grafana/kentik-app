import { Datasource } from '../../src/datasource/module';
import Q from 'q';

describe('KentikDatasource', () => {
  let ctx: any = {};

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

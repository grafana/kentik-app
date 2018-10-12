import { Datasource } from '../../src/datasource/module';

describe('KentikDatasource', () => {
  let ctx: any = {};

  beforeEach(function () {
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

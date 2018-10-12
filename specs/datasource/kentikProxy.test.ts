import { KentikAPI } from '../../src/datasource/kentikAPI';
import { KentikProxy } from '../../src/datasource/kentikProxy';

describe('KentikProxy', () => {
  let ctx: any = {};

  describe('When getting custom dimensions', () => {
    const data = {
      customDimensions: [
        {
          display_name: 'just-testing', name: 'c_test',
          populators: [
            { value: 'value1' }, { value: 'value2' }
          ]
        },
        {
          display_name: 'just-testing-2', name: 'c_test_2',
          populators: [
            { value: 'value3' }, { value: 'value4' }
          ]
        }
      ]
    };

    beforeEach(() => mockKentikResponse(ctx, data));
    it('Should parse it properly', async () => {
      const dimensions = await ctx.kentikProxy.getCustomDimensions();
      expect(dimensions).toHaveLength(2);
      expect(dimensions[0]).toEqual({
        text: 'Custom just-testing',
        value: 'c_test',
        field: 'c_test',
        values: ['value1', 'value2'],
      });
    });
  });
});

function mockKentikResponse(ctx, data) {
  ctx.backendSrv = {
    datasourceRequest: function () {
      return Promise.resolve({
        status: 200, data
      })
    }
  }

  ctx.kentikAPI = new KentikAPI(ctx.backendSrv);
  ctx.kentikProxy = new KentikProxy({}, ctx.kentikAPI);
}

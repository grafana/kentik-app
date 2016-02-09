
class KentikDatasource {
  constructor(instanceSettings, $http)  {
    this.instanceSettings = instanceSettings;
    this.$http = $http;
  }

  query(options) {
    console.log('query!', options);
    return Promise.resolve({data: []});
  }
}

export {KentikDatasource};


class KentikDatasource {
  constructor(instanceSettings, backendSrv, $q)  {
    this.instanceSettings = instanceSettings;
    this.backendSrv = backendSrv;
    this.$q = $q;
  }

  getTimeFilter(range) {
    var timeFilter = 'ctimestamp > ' + (range.from.valueOf() / 1000).toFixed(0);
    timeFilter += ' OR ctimestamp < ' + (range.to.valueOf() / 1000).toFixed(0);
    return timeFilter;
  }

  query(options) {
    var query = options.targets[0].target;
    query = query.replace('$timeFilter', this.getTimeFilter(options.range));

    console.log('Kentik query: ', query);
    return this.backendSrv.datasourceRequest({
      method: 'POST',
      url: 'api/plugin-proxy/kentik-app/query',
      data: {q: query}
    }).then(this.processResponse.bind(this));
  }

  processResponse(data) {
    if (data.data && data.data.err) {
      return this.$q.reject({message: data.data.err});
    }

    var rows = data.data.data;

    if (rows.length === 0) {
      return [];
    }

    var seriesList = [];
    var firstRow = rows[0];

    for (var prop in firstRow) {
      if (prop === 'ctimestamp') {
        continue;
      }

      if (firstRow.hasOwnProperty(prop)) {
        seriesList.push({datapoints: [], target: prop});
      }
    }

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      for (var y = 0; y < seriesList.length; y++) {
        var serie = seriesList[y];
        var value = parseInt(row[serie.target]);
        var time = row.ctimestamp * 1000;
        serie.datapoints.push([value, time]);
        console.log('add value: ', value, time);
      }
    }

    return {data: seriesList};
  }
}

export {KentikDatasource};

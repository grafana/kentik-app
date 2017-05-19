import {metricList, unitList, filterFieldList} from './metric_def';
import _ from 'lodash';
import TableModel from 'app/core/table_model';
import './kentikProxy';
import queryBuilder from './query_builder';

class KentikDatasource {

  constructor(instanceSettings, templateSrv, kentikProxySrv)  {
    this.instanceSettings = instanceSettings;
    this.name = instanceSettings.name;
    this.templateSrv = templateSrv;
    this.kentik = kentikProxySrv;
  }

  interpolateDeviceField(value, variable) {
    // if no multi or include all do not regexEscape
    if (!variable.multi && !variable.includeAll) {
      return value;
    }

    if (typeof value === 'string') {
      return value;
    }

    return value.join(',');
  }

  query(options) {
    if (!options.targets || options.targets.length === 0) {
      return Promise.resolve({data: []});
    }

    let target = options.targets[0];
    let deviceNames = this.templateSrv.replace(target.device, options.scopedVars, this.interpolateDeviceField.bind(this));

    let kentikFilters = this.templateSrv.getAdhocFilters(this.name);
    kentikFilters = queryBuilder.convertToKentikFilterGroup(kentikFilters);

    let query_options = {
      deviceNames: deviceNames,
      range: {
        from: options.range.from,
        to: options.range.to
      },
      metric: this.templateSrv.replace(target.metric),
      unit: this.templateSrv.replace(target.unit),
      kentikFilterGroups: kentikFilters
    };
    let query = queryBuilder.buildTopXdataQuery(query_options);

    return this.kentik.invokeTopXDataQuery(query)
    .then(this.processResponse.bind(this, query, target.mode, options))
    .then(result => {
      return {
        data: result
      };
    });
  }

  processResponse(query, mode, options, data) {
    if (!data.results) {
      return Promise.reject({message: 'no kentik data'});
    }

    var bucketData = data.results[0].data;
    if (bucketData.length === 0) {
      return [];
    }

    var metricDef = _.find(metricList, {value: query.dimension[0]});
    var unitDef = _.find(unitList, {value: query.metric});

    if (mode === 'table') {
      return this.processTableData(bucketData, metricDef, unitDef);
    } else {
      return this.processTimeSeries(bucketData, query, options);
    }
  }

  processTimeSeries(bucketData, query) {
    let seriesList = [];
    let endIndex = query.topx;
    if (bucketData.length < endIndex) {
      endIndex = bucketData.length;
    }

    for (let i = 0; i < endIndex; i++) {
      let series = bucketData[i];
      let timeseries = _.find(series.timeSeries, series => {
        return series.flow && series.flow.length;
      });
      let seriesName = series.key;

      if (timeseries) {
        let grafana_series = {
          target: seriesName,
          datapoints: _.map(timeseries.flow, point => {
            return [point[1], point[0]];
          })
        };
        seriesList.push(grafana_series);
      }
    }

    return seriesList;
  }

  processTableData(bucketData, metricDef, unitDef) {
    var table = new TableModel();

    table.columns.push({text: metricDef.text});

    for (let col of unitDef.tableFields) {
      table.columns.push({text: col.text, unit: col.unit});
    }

    _.forEach(bucketData, row => {
      var seriesName = row.key;

      var values = [seriesName];
      for (let col of unitDef.tableFields) {
        var val = row[col.field];

        if (_.isString(val)) {
          val = parseFloat(val);
        }

        values.push(val);
      }

      table.rows.push(values);
    });

    return [table];
  }

  metricFindQuery(query) {
    if (query === 'metrics()') {
      return Promise.resolve(metricList);
    }
    if (query === 'units()') {
      return Promise.resolve(unitList);
    }

    return this.kentik.getDevices()
    .then(devices => {
      return devices.map(device => {
        return {text: device.device_name, value: device.device_name};
      });
    });
  }

  getTagKeys() {
    return Promise.resolve(filterFieldList);
  }

  getTagValues(options) {
    if (options) {
      let field = _.find(filterFieldList, {text: options.key}).field;
      return this.kentik.getFieldValues(field)
      .then(result => {
        return result.rows.map(row => {
          return {text: row[field].toString()};
        });
      });
    } else {
      return Promise.resolve([]);
    }
  }
}

export {KentikDatasource};

import {metricList, unitList, filterFieldList} from './metric_def';
import _ from 'lodash';
import TableModel from 'app/core/table_model';
import './kentikAPI';

class KentikDatasource {

  constructor(instanceSettings, templateSrv, kentikAPISrv)  {
    this.instanceSettings = instanceSettings;
    this.name = instanceSettings.name;
    this.templateSrv = templateSrv;
    this.kentik = kentikAPISrv;
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

  convertToKentikFilter(filterObj) {
    return {
      filterField: _.find(filterFieldList, {text: filterObj.key}).field,
      operator: filterObj.operator,
      filterValue: filterObj.value
    };
  }

  query(options) {
    if (!options.targets || options.targets.length === 0) {
      return Promise.resolve({data: []});
    }

    let target = options.targets[0];
    let deviceNames = this.templateSrv.replace(target.device, options.scopedVars, this.interpolateDeviceField.bind(this));

    let kentikFilters = this.templateSrv.getAdhocFilters(this.name);
    kentikFilters = _.map(kentikFilters, this.convertToKentikFilter);

    let query_options = {
      deviceNames: deviceNames,
      range: {
        from: options.range.from,
        to: options.range.to
      },
      metric: this.templateSrv.replace(target.metric),
      unit: this.templateSrv.replace(target.unit),
      kentikFilters: kentikFilters
    };
    let query = this.kentik.formatV4Query(query_options);
    query = this.kentik.formatV5Query(query_options);

    let endpoint = 'timeSeriesData';
    endpoint = 'topXdata';
    if (target.mode === 'table') {
      endpoint = 'topXdata';
    }

    return this.kentik.invokeV5Query(query, endpoint)
    .then(this.processV5Response.bind(this, query, target.mode, options));
  }

  processResponse(query, endpoint, options, data) {
    if (!data.data) {
      return Promise.reject({message: 'no kentik data'});
    }

    var rows = data.data;
    if (rows.length === 0) {
      return [];
    }

    var metricDef = _.find(metricList, {value: query.query.metric});
    var unitDef = _.find(unitList, {value: query.query.units});

    if (endpoint === 'topXData') {
      return this.processTopXData(rows, metricDef, unitDef, options);
    } else {
      return this.processTimeSeries(rows, metricDef, unitDef, options);
    }
  }

  processV5Response(query, mode, options, data) {
    if (!data.data.results) {
      return Promise.reject({message: 'no kentik data'});
    }

    var bucketData = data.data.results[0].data;
    if (bucketData.length === 0) {
      return [];
    }

    var metricDef = _.find(metricList, {value: query.queries[0].query.dimension[0]});
    var unitDef = _.find(unitList, {value: query.queries[0].query.metric});

    if (mode === 'table') {
      return this.processTableData(bucketData, metricDef, unitDef);
    } else {
      return this.processV5TimeSeries(bucketData, query, options);
    }
  }

  processV5TimeSeries(bucketData, query) {
    let seriesList = [];
    let endIndex = query.queries[0].query.topx;
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
          datapoints: timeseries.flow.map(point => {
            return [point[1], point[0]];
          })
        };
        seriesList.push(grafana_series);
      }
    }

    return { data: seriesList };
  }

  processTableData(bucketData, metricDef, unitDef) {
    var table = new TableModel();

    table.columns.push({text: metricDef.text});

    for (let col of unitDef.tableFields) {
      table.columns.push({text: col.text, unit: col.unit});
    }

    bucketData.forEach(row => {
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

    return {data: [table]};
  }

  processTimeSeries(rows, metricDef, unitDef, options) {
    var seriesList = {};
    var endIndex = rows.length;

    // if time range is to now ignore last data point
    if (options.rangeRaw.to === 'now') {
      endIndex = endIndex - 1;
    }

    for (var i = 0; i < endIndex; i++) {
      var row = rows[i];
      var value = row[unitDef.field];
      var seriesName = row[metricDef.field];
      var series = seriesList[seriesName];

      if (!series) {
        series = seriesList[seriesName] = {
          target: seriesName,
          datapoints: [],
          unit: unitDef.gfUnit,
          axisLabel: unitDef.gfAxisLabel
        };
      }

      if (unitDef.transform) {
        value = unitDef.transform(value, row);
      }

      var time = new Date(row.i_start_time).getTime();
      series.datapoints.push([value, time]);
    }

    // turn seriesList hash to array
    return { data: _.map(seriesList, value => value) };
  }

  processTopXData(rows, metricDef, unitDef, options) {
    var table = new TableModel();
    var rangeSeconds = (options.range.to.valueOf() - options.range.from.valueOf()) / 1000;

    table.columns.push({text: metricDef.text});

    for (let col of unitDef.tableFields) {
      table.columns.push({text: col.text, unit: col.unit});
    }

    for (let row of rows) {
      var seriesName = row[metricDef.field];

      var values = [seriesName];
      for (let col of unitDef.tableFields) {
        var val = row[col.field];
        var transform = col.transform || unitDef.transform;

        if (_.isString(val)) {
          val = parseFloat(val);
        }

        if (transform) {
          val = transform(val, row, rangeSeconds);
        }

        values.push(val);
      }

      table.rows.push(values);
    }

    return {data: [table]};
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
      return Promise.resolve([]);
    } else {
      return Promise.resolve([]);
    }
  }
}

export {KentikDatasource};

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
    // Use Kentik 'not equal' style
    if (filterObj.operator === '!=') {
      filterObj.operator = '<>';
    }

    return {
      filterField: _.find(filterFieldList, {text: filterObj.key}).field,
      operator: filterObj.operator,
      filterValue: filterObj.value
    };
  }

  convertToKentikFilterGroup(filters) {
    if (filters.length) {
      let kentikFilters = _.map(filters, this.convertToKentikFilter);
      let connector = 'All';
      if (filters[0].condition && (
          filters[0].condition.toLowerCase() === 'or' ||
          filters[0].condition.toLowerCase() === 'any')) {
        connector = 'Any';
      }
      return [{
        "connector": connector,
        "filters": kentikFilters,
        "filterString": "",
        "metric": null,
        "not": false,
        "id": "c255"
      }];
    } else {
      return [];
    }
  }

  query(options) {
    if (!options.targets || options.targets.length === 0) {
      return Promise.resolve({data: []});
    }

    let target = options.targets[0];
    let deviceNames = this.templateSrv.replace(target.device, options.scopedVars, this.interpolateDeviceField.bind(this));

    let kentikFilters = this.templateSrv.getAdhocFilters(this.name);
    kentikFilters = this.convertToKentikFilterGroup(kentikFilters);

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
    let query = this.kentik.formatQuery(query_options);

    return this.kentik.invokeQuery(query)
    .then(this.processResponse.bind(this, query, target.mode, options));
  }

  processResponse(query, mode, options, data) {
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
      return this.processTimeSeries(bucketData, query, options);
    }
  }

  processTimeSeries(bucketData, query) {
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

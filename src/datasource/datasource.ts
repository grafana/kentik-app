import { metricList, unitList, filterFieldList } from './metric_def';
import * as _ from 'lodash';
import './kentikProxy';
import TableModel from 'grafana/app/core/table_model';
import queryBuilder from './query_builder';

class KentikDatasource {
  name: string;
  kentik: any;

  /** @ngInject */
  constructor(public instanceSettings: any, public templateSrv: any, kentikProxySrv: any) {
    this.name = instanceSettings.name;
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

  async query(options) {
    if (!options.targets || options.targets.length === 0) {
      return Promise.resolve({ data: [] });
    }

    const target = options.targets[0];
    const deviceNames = this.templateSrv.replace(
      target.device,
      options.scopedVars,
      this.interpolateDeviceField.bind(this)
    );

    let kentikFilters = this.templateSrv.getAdhocFilters(this.name);
    const customDimensions = await this.kentik.getCustomDimensions();
    kentikFilters = queryBuilder.convertToKentikFilterGroup(kentikFilters, customDimensions);

    const queryOptions = {
      deviceNames: deviceNames,
      range: {
        from: options.range.from,
        to: options.range.to,
      },
      metric: this.templateSrv.replace(target.metric),
      unit: this.templateSrv.replace(target.unit),
      kentikFilterGroups: kentikFilters,
    };
    const query = queryBuilder.buildTopXdataQuery(queryOptions);

    return this.kentik
      .invokeTopXDataQuery(query)
      .then(this.processResponse.bind(this, query, target.mode, options))
      .then(result => {
        return {
          data: result,
        };
      });
  }

  async processResponse(query, mode, options, data) {
    if (!data.results) {
      return Promise.reject({ message: 'no kentik data' });
    }

    const bucketData = data.results[0].data;
    if (bucketData.length === 0) {
      return [];
    }

    const extendedMetricList = await this._getExtendedDimensionsList(metricList);
    const metricDef = _.find(
      extendedMetricList,
      { value: query.dimension[0] }
    );

    const unitDef = _.find(unitList, { value: query.metric });

    if (mode === 'table') {
      return this.processTableData(bucketData, metricDef, unitDef);
    } else {
      return this.processTimeSeries(bucketData, query, options);
    }
  }

  processTimeSeries(bucketData, query, options?: any) {
    const seriesList = [];
    let endIndex = query.topx;
    if (bucketData.length < endIndex) {
      endIndex = bucketData.length;
    }

    for (let i = 0; i < endIndex; i++) {
      const series = bucketData[i];
      const timeseries = _.find(series.timeSeries, series => {
        return series.flow && series.flow.length;
      });
      const seriesName = series.key;

      if (timeseries) {
        const grafanaSeries = {
          target: seriesName,
          datapoints: _.map(timeseries.flow, point => {
            return [point[1], point[0]];
          }),
        };
        seriesList.push(grafanaSeries);
      }
    }

    return seriesList;
  }

  processTableData(bucketData, metricDef, unitDef) {
    const table = new TableModel();

    table.columns.push({ text: metricDef.text });

    for (const col of unitDef.tableFields) {
      table.columns.push({ text: col.text, unit: col.unit });
    }

    _.forEach(bucketData, row => {
      const seriesName = row.key;

      const values = [seriesName];
      for (const col of unitDef.tableFields) {
        let val = row[col.field];

        if (_.isString(val)) {
          val = parseFloat(val);
        }

        values.push(val);
      }

      table.rows.push(values);
    });

    return [table];
  }

  async metricFindQuery(query) {
    if (query === 'metrics()') {
      return await this._getExtendedDimensionsList(metricList);
    }
    if (query === 'units()') {
      return unitList;
    }

    return this.kentik.getDevices().then(devices => {
      return devices.map(device => {
        return { text: device.device_name, value: device.device_name };
      });
    });
  }

  async getTagKeys() {
    let initialList = await this._getExtendedDimensionsList(filterFieldList);
    const savedFilters = await this.kentik.getSavedFilters();
    let joinedFilterList = _.concat(initialList,savedFilters)
    return joinedFilterList;
  }

  async getTagValues(options) {
    if (options) {
      const filter = _.find(filterFieldList, { text: options.key });

      if (filter === undefined) {
        const customDimensions = await this.kentik.getCustomDimensions();
        const dimension = _.find(customDimensions, { text: options.key });
        return dimension.values.map(value => ({ text: value }));
      } else {
        const field = filter.field;
        return this.kentik.getFieldValues(field).then(result => {
          return result.rows.map(row => {
            return { text: row[field].toString() };
          });
        });
      }
    } else {
      return [];
    }
  }

  private async _getExtendedDimensionsList(list: Array<any>) {
    const customDimensions = await this.kentik.getCustomDimensions();
    return _.concat(list, customDimensions);
  }
}

export { KentikDatasource };

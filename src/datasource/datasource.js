
class KentikDatasource {

  constructor(instanceSettings, backendSrv, templateSrv)  {
    this.instanceSettings = instanceSettings;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  getTimeFilter(range) {
    var timeFilter = 'ctimestamp > ' + (range.from.valueOf() / 1000).toFixed(0);
    timeFilter += ' OR ctimestamp < ' + (range.to.valueOf() / 1000).toFixed(0);
    return timeFilter;
  }

  query(options) {
    if (!options.targets || options.targets.length === 0) {
      return Promise.resolve({data: []});
    }

    var target = options.targets[0];

    var query = {
      version: "2.01",
      query: {
        device_name: this.templateSrv.replace(target.device),
        time_type: 'relative', // or fixed
        lookback_seconds: 3600,
        starting_time: null,
        ending_time: null,
        metric: this.templateSrv.replace(target.metric),
        fast_data: "Auto", // or Fast or Full
        // device_type: 'router', // or host,
      },
      filterSettings: {
        connector: 'All',
        filterString: '',
        filterGroups: []
      }
    };
    console.log('Kentik query: ', query);

    return this.backendSrv.datasourceRequest({
      method: 'POST',
      url: 'api/plugin-proxy/kentik-app/api/v4/dataExplorer/timeSeriesData',
      data: query
    }).then(this.processResponse.bind(this, query));
  }

  processResponse(query, data) {
    if (!data.data) {
      return Promise.reject({message: 'no kentik data'});
    }

    var rows = data.data;
    if (rows.length === 0) {
      return [];
    }

    console.log('kentik response', rows);
    var seriesList = [];
    var series = {target: query.query.metric, datapoints: []};

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var value = row.f_sum_both_bytes;
      var time = new Date(row.i_start_time).getTime();
      series.datapoints.push([value, time]);
    }

    seriesList.push(series);
    return {data: seriesList};
  }

  getMetricList() {
    return Promise.resolve([
        "Traffic" ,
        "Geography_src",
        "src_geo_region",
        "src_geo_city",
        "AS_src",
        "InterfaceID_src",
        "Port_src",
        "VLAN_src",
        "IP_src",
        "src_route_prefix_len",
        "src_route_length",
        "src_bgp_community",
        "src_bgp_aspath",
        "src_nexthop_ip",
        "src_nexthop_asn",
        "src_second_asn",
        "src_third_asn",
        "src_proto_port",
        "TopFlow",
        "Proto",
        "InterfaceTopTalkers",
        "PortPortTalkers",
        "RegionTopTalkers",
        "TopFlowsIP",
        "ASTopTalkers",
        "TOS",
        "Geography_dst",
        "dst_geo_region",
        "dst_geo_city",
        "AS_dst",
        "InterfaceID_dst",
        "Port_dst",
        "VLAN_dst",
        "IP_dst",
        "dst_route_prefix_len",
        "dst_route_length",
        "dst_bgp_community",
        "dst_bgp_aspath",
        "dst_nexthop_ip",
        "dst_nexthop_asn",
        "dst_second_asn",
        "dst_third_asn",
        "dst_proto_port"
          ].map(value => {
            return {text: value, value: value};
          }));
  }

  metricFindQuery(query) {
    if (query === 'metrics()') {
      return this.getMetricList();
    }

    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: 'api/plugin-proxy/kentik-app/api/v1/device/list',
    }).then(res => {
      if (!res.data || !res.data.device) {
        return [];
      }

      return res.data.device.map(device => {
        return {text: device.device_name, value: device.device_name};
      });
    });
  }
}

export {KentikDatasource};

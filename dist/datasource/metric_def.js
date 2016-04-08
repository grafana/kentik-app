'use strict';

System.register([], function (_export, _context) {
  var metricList, unitList;
  return {
    setters: [],
    execute: function () {
      _export('metricList', metricList = [{ text: 'Traffic', value: 'Traffic', field: 'traffic' }, { text: 'Geography Src', value: 'Geography_src', field: 'src_geo' }, { text: 'IP Src', value: 'IP_src', field: 'ipv4_src_addr' }, { text: 'Src Geo Region', value: 'src_geo_region', field: 'src_geo_region' }]);

      _export('unitList', unitList = [{
        text: 'Bits/s',
        value: 'bytes',
        field: 'f_sum_both_bytes',
        gfUnit: "bps",
        gfAxisLabel: 'Bits/s',
        transform: function transform(value, row) {
          // transform from bytes to bits and
          // divide by interval
          return value / 8 / row.i_duration;
        }
      }, {
        text: 'Packets/s',
        value: 'packets',
        field: 'f_sum_both_pkts',
        gfUnit: "pps",
        gfAxislabel: 'Packets/s',
        transform: function transform(value, row) {
          return value / row.i_duration;
        }
      }, {
        text: 'Unique Src IPs',
        value: 'unique_src_ip',
        field: 'uniquesrcips',
        gfUnit: "short",
        gfAxisLabel: "Unique Src IPs"
      }, {
        text: 'Unique Dst IPs',
        value: 'unique_dst_ip',
        field: 'uniquesrcips',
        gfUnit: "short",
        gfAxisLabel: "Unique Dst IPs"
      }]);

      _export('metricList', metricList);

      _export('unitList', unitList);
    }
  };
});
//# sourceMappingURL=metric_def.js.map

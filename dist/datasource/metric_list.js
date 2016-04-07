'use strict';

System.register([], function (_export, _context) {
  var metricList;
  return {
    setters: [],
    execute: function () {
      metricList = [{ text: 'Traffic', value: 'Traffic', field: 'f_sum_both_bytes' }, { text: 'Geography Src', value: 'Geography_src', field: 'src_geo' }, { text: 'IP Src', value: 'IP_src', field: 'ipv4_src_addr' }];

      _export('default', metricList);
    }
  };
});
//# sourceMappingURL=metric_list.js.map

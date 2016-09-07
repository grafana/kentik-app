/// <reference path="./es6-shim/es6-shim.d.ts" />

declare var System: any;

// dummy modules
declare module 'app/core/config' {
  var config: any;
  export default config;
}

declare module 'lodash' {
  var lodash: any;
  export default lodash;
}

declare module 'moment' {
  var moment: any;
  export default moment;
}

declare module 'angular' {
  var angular: any;
  export default angular;
}

declare module 'jquery' {
  var jquery: any;
  export default jquery;
}

declare module 'app/core/utils/kbn' {
  var kbn: any;
  export default kbn;
}

// Hack for datemath module
declare module 'app/core/utils/datemath' {
  export var parse: any;
  export var isValid: any;
  export var parseDateMath: any;
}

// Hack for timeseries2 module
declare module 'app/core/time_series2' {
  var timeseries2: any;
  export default timeseries2;
}

// Hack for file_export module
declare module 'app/core/utils/file_export' {
  export var exportSeriesListToCsv: any;
  export var exportSeriesListToCsvColumns: any;
}

// Hack for core_module module
declare module 'app/core/core_module' {
  var core_module: any;
  export default core_module;
}

// Hack for query_part module
declare module 'app/core/components/query_part/query_part' {
  export var QueryPart: any;
  export var QueryPartDef: any;
}

// Hack for rangeutil module
declare module 'app/core/utils/rangeutil' {
  export var describeTextRange: any;
}

// Hack for rxjs module
declare module 'vendor/npm/rxjs/Subject' {
  export var Subject: any;
}

// Hack for core module
declare module 'app/core/core' {
  export var Emitter: any;
}

// Hack for profiler module
declare module 'app/core/profiler' {
  export var profiler: any;
}

declare module 'app/core/store' {
  var store: any;
  export default store;
}

declare module 'tether' {
  var config: any;
  export default config;
}

declare module 'tether-drop' {
  var config: any;
  export default config;
}

declare module 'eventemitter3' {
  var config: any;
  export default config;
}

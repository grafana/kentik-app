import { QueryCtrl } from 'grafana/app/plugins/sdk';

class KentikQueryCtrl extends QueryCtrl {
  static templateUrl: string;
  queryModes: any[];

  /** @ngInject */
  constructor($scope, $injector) {
    super($scope, $injector);

    this.target.mode = this.target.mode || 'graph';

    this.queryModes = [{ value: 'flow', text: 'Flow' }, { value: 'graph', text: 'Graph' }, { value: 'table', text: 'Table' }];
  }
}

KentikQueryCtrl.templateUrl = 'datasource/query_editor.html';

export { KentikQueryCtrl };

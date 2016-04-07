import {QueryCtrl} from 'app/plugins/sdk';

class KentikQueryCtrl extends QueryCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);

    this.target.mode = this.target.mode || 'graph';

    this.queryModes = [
      {value: 'graph', text: 'Graph'},
      {value: 'table', text: 'Table'}
    ];
  }
}

KentikQueryCtrl.templateUrl = 'datasource/query_editor.html';

export {KentikQueryCtrl};

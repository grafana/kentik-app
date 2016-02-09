import {QueryCtrl} from 'app/plugins/sdk';

class KentikQueryCtrl extends QueryCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
  }
}

KentikQueryCtrl.templateUrl = 'datasource/query_editor.html';

export {KentikQueryCtrl};

import configTemplate from './config.html';
import { KentikAPI, showAlert } from '../datasource/kentikAPI';

import * as _ from 'lodash';

class KentikConfigCtrl {
  appEditCtrl: any;
  appModel: any;
  apiValidated: boolean;
  apiError: boolean;
  kentik: KentikAPI;
  static template: any;
  regionTypes = [
    { value: "default", text: "US (default)" },
    { value: "eu", text: "EU" }
  ];

  /** @ngInject */
  constructor($scope, $injector, public backendSrv: any) {
    this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));

    if (!this.appModel.jsonData) {
      this.appModel.jsonData = {};
    }
    if (!this.appModel.secureJsonData) {
      this.appModel.secureJsonData = {};
    }
    if (!this.appModel.jsonData.region) {
      this.appModel.jsonData.region = "default";
    }
    this.apiValidated = false;
    this.apiError = false;
    this.kentik = new KentikAPI(this.backendSrv, this.appModel.jsonData.region);
    if (this.appModel.enabled && this.appModel.jsonData.tokenSet) {
      this.validateApiConnection();
    }
  }

  preUpdate() {
    if (this.appModel.secureJsonData.token) {
      this.appModel.jsonData.tokenSet = true;
    }

    return this.initDatasource();
  }

  async postUpdate() {
    if (!this.appModel.enabled) {
      return Promise.resolve();
    }

    await this.validateApiConnection();    
    await this.appEditCtrl.importDashboards();

    return {
      url: 'dashboard/db/kentik-home',
      message: 'Kentik Connect Pro app installed!',
    };
  }

  // make sure that we can hit the Kentik API.
  async validateApiConnection() {
    try {
      await this.kentik.getUsers();
      this.apiValidated = true;
    } catch (e) {
      showAlert(e);
      this.apiValidated = false;
      this.apiError = true;
    }
  }

  reset() {
    this.appModel.jsonData.email = '';
    this.appModel.jsonData.tokenSet = false;
    this.appModel.jsonData.region = "default";
    this.appModel.secureJsonData = {};
    this.apiValidated = false;
  }

  initDatasource() {
    const self = this;
    //check for existing datasource.
    return self.backendSrv.get('/api/datasources').then(results => {
      let foundKentic = false;
      _.forEach(results, ds => {
        if (foundKentic) {
          return;
        }
        if (ds.name === 'kentik') {
          foundKentic = true;
        }
      });
      const promises = [];
      if (!foundKentic) {
        // create datasource.
        const kentik = {
          name: 'kentik',
          type: 'kentik-ds',
          access: 'direct',
          jsonData: {},
        };
        promises.push(self.backendSrv.post('/api/datasources', kentik));
      }
      return Promise.all(promises);
    });
  }
}

KentikConfigCtrl.template = configTemplate;

export { KentikConfigCtrl as ConfigCtrl };

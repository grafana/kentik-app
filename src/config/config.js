import configTemplate from './config.html!text';

class KentikConfigCtrl {
  constructor() {
    this.appModel.secureJsonData = {
      token: '**********'
    };
  }
}

KentikConfigCtrl.template = configTemplate;

export {
  KentikConfigCtrl as ConfigCtrl
};


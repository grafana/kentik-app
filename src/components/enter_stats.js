

export class EnterStatsCtrl {

  constructor(backendSrv) {
    this.backendSrv = backendSrv;
  }

  record(metric, value) {
    var data = {metrics: {}};
    data.metrics['pool.' + metric + '.count'] = value;

    return this.backendSrv.post("/api/plugin-proxy/grafana-pool-app/api/", data);
  }
}

EnterStatsCtrl.templateUrl = 'components/enter_stats.html';

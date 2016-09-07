///<reference path="../../../../headers/common.d.ts" />
System.register(['lodash', './threshold_mapper', 'app/core/components/query_part/query_part', './alert_def', 'app/core/config', 'moment'], function(exports_1) {
    var lodash_1, threshold_mapper_1, query_part_1, alert_def_1, config_1, moment_1;
    var AlertTabCtrl;
    /** @ngInject */
    function alertTab() {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/app/features/alerting/partials/alert_tab.html',
            controller: AlertTabCtrl,
        };
    }
    exports_1("alertTab", alertTab);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (threshold_mapper_1_1) {
                threshold_mapper_1 = threshold_mapper_1_1;
            },
            function (query_part_1_1) {
                query_part_1 = query_part_1_1;
            },
            function (alert_def_1_1) {
                alert_def_1 = alert_def_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }],
        execute: function() {
            AlertTabCtrl = (function () {
                /** @ngInject */
                function AlertTabCtrl($scope, $timeout, backendSrv, dashboardSrv, uiSegmentSrv, $q, datasourceSrv, templateSrv) {
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.backendSrv = backendSrv;
                    this.dashboardSrv = dashboardSrv;
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.$q = $q;
                    this.datasourceSrv = datasourceSrv;
                    this.templateSrv = templateSrv;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    this.$scope.ctrl = this;
                    this.subTabIndex = 0;
                    this.evalFunctions = alert_def_1.default.evalFunctions;
                    this.conditionTypes = alert_def_1.default.conditionTypes;
                    this.severityLevels = alert_def_1.default.severityLevels;
                    this.noDataModes = alert_def_1.default.noDataModes;
                    this.appSubUrl = config_1.default.appSubUrl;
                }
                AlertTabCtrl.prototype.$onInit = function () {
                    var _this = this;
                    this.addNotificationSegment = this.uiSegmentSrv.newPlusButton();
                    this.initModel();
                    this.validateModel();
                    // set panel alert edit mode
                    this.$scope.$on("$destroy", function () {
                        _this.panelCtrl.editingThresholds = false;
                        _this.panelCtrl.render();
                    });
                    // subscribe to graph threshold handle changes
                    this.panelCtrl.events.on('threshold-changed', this.graphThresholdChanged.bind(this));
                    // build notification model
                    this.notifications = [];
                    this.alertNotifications = [];
                    this.alertHistory = [];
                    return this.backendSrv.get('/api/alert-notifications').then(function (res) {
                        _this.notifications = res;
                        lodash_1.default.each(_this.alert.notifications, function (item) {
                            var model = lodash_1.default.findWhere(_this.notifications, { id: item.id });
                            if (model) {
                                model.iconClass = _this.getNotificationIcon(model.type);
                                _this.alertNotifications.push(model);
                            }
                        });
                    });
                };
                AlertTabCtrl.prototype.getAlertHistory = function () {
                    var _this = this;
                    this.backendSrv.get("/api/alert-history?dashboardId=" + this.panelCtrl.dashboard.id + "&panelId=" + this.panel.id).then(function (res) {
                        _this.alertHistory = lodash_1.default.map(res, function (ah) {
                            ah.time = moment_1.default(ah.timestamp).format('MMM D, YYYY HH:mm:ss');
                            ah.stateModel = alert_def_1.default.getStateDisplayModel(ah.newState);
                            ah.metrics = lodash_1.default.map(ah.data, function (ev) {
                                return ev.Metric + "=" + ev.Value;
                            }).join(', ');
                            return ah;
                        });
                    });
                };
                AlertTabCtrl.prototype.getNotificationIcon = function (type) {
                    switch (type) {
                        case "email": return "fa fa-envelope";
                        case "slack": return "fa fa-slack";
                        case "webhook": return "fa fa-cubes";
                    }
                };
                AlertTabCtrl.prototype.getNotifications = function () {
                    var _this = this;
                    return Promise.resolve(this.notifications.map(function (item) {
                        return _this.uiSegmentSrv.newSegment(item.name);
                    }));
                };
                AlertTabCtrl.prototype.changeTabIndex = function (newTabIndex) {
                    this.subTabIndex = newTabIndex;
                    if (this.subTabIndex === 2) {
                        this.getAlertHistory();
                    }
                };
                AlertTabCtrl.prototype.notificationAdded = function () {
                    var model = lodash_1.default.findWhere(this.notifications, { name: this.addNotificationSegment.value });
                    if (!model) {
                        return;
                    }
                    this.alertNotifications.push({ name: model.name, iconClass: this.getNotificationIcon(model.type) });
                    this.alert.notifications.push({ id: model.id });
                    // reset plus button
                    this.addNotificationSegment.value = this.uiSegmentSrv.newPlusButton().value;
                    this.addNotificationSegment.html = this.uiSegmentSrv.newPlusButton().html;
                };
                AlertTabCtrl.prototype.removeNotification = function (index) {
                    this.alert.notifications.splice(index, 1);
                    this.alertNotifications.splice(index, 1);
                };
                AlertTabCtrl.prototype.initModel = function () {
                    var _this = this;
                    var alert = this.alert = this.panel.alert = this.panel.alert || { enabled: false };
                    if (!this.alert.enabled) {
                        return;
                    }
                    alert.conditions = alert.conditions || [];
                    if (alert.conditions.length === 0) {
                        alert.conditions.push(this.buildDefaultCondition());
                    }
                    alert.noDataState = alert.noDataState || 'unknown';
                    alert.severity = alert.severity || 'critical';
                    alert.frequency = alert.frequency || '60s';
                    alert.handler = alert.handler || 1;
                    alert.notifications = alert.notifications || [];
                    var defaultName = this.panel.title + ' alert';
                    alert.name = alert.name || defaultName;
                    this.conditionModels = lodash_1.default.reduce(alert.conditions, function (memo, value) {
                        memo.push(_this.buildConditionModel(value));
                        return memo;
                    }, []);
                    threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(this.panel);
                    this.panelCtrl.editingThresholds = true;
                    this.panelCtrl.render();
                };
                AlertTabCtrl.prototype.graphThresholdChanged = function (evt) {
                    for (var _i = 0, _a = this.alert.conditions; _i < _a.length; _i++) {
                        var condition = _a[_i];
                        if (condition.type === 'query') {
                            condition.evaluator.params[evt.handleIndex] = evt.threshold.value;
                            this.evaluatorParamsChanged();
                            break;
                        }
                    }
                };
                AlertTabCtrl.prototype.buildDefaultCondition = function () {
                    return {
                        type: 'query',
                        query: { params: ['A', '5m', 'now'] },
                        reducer: { type: 'avg', params: [] },
                        evaluator: { type: 'gt', params: [null] },
                    };
                };
                AlertTabCtrl.prototype.validateModel = function () {
                    var _this = this;
                    if (!this.alert.enabled) {
                        return;
                    }
                    var firstTarget;
                    var fixed = false;
                    var foundTarget = null;
                    for (var _i = 0, _a = this.alert.conditions; _i < _a.length; _i++) {
                        var condition = _a[_i];
                        if (condition.type !== 'query') {
                            continue;
                        }
                        for (var _b = 0, _c = this.panel.targets; _b < _c.length; _b++) {
                            var target = _c[_b];
                            if (!firstTarget) {
                                firstTarget = target;
                            }
                            if (condition.query.params[0] === target.refId) {
                                foundTarget = target;
                                break;
                            }
                        }
                        if (!foundTarget) {
                            if (firstTarget) {
                                condition.query.params[0] = firstTarget.refId;
                                foundTarget = firstTarget;
                                fixed = true;
                            }
                            else {
                                this.error = "Could not find any metric queries";
                            }
                        }
                        var datasourceName = foundTarget.datasource || this.panel.datasource;
                        this.datasourceSrv.get(datasourceName).then(function (ds) {
                            if (ds.meta.id !== 'graphite') {
                                _this.error = 'Currently the alerting backend only supports Graphite queries';
                            }
                            else if (_this.templateSrv.variableExists(foundTarget.target)) {
                                _this.error = 'Template variables are not supported in alert queries';
                            }
                            else {
                                _this.error = '';
                            }
                        });
                    }
                };
                AlertTabCtrl.prototype.buildConditionModel = function (source) {
                    var cm = { source: source, type: source.type };
                    cm.queryPart = new query_part_1.QueryPart(source.query, alert_def_1.default.alertQueryDef);
                    cm.reducerPart = alert_def_1.default.createReducerPart(source.reducer);
                    cm.evaluator = source.evaluator;
                    return cm;
                };
                AlertTabCtrl.prototype.handleQueryPartEvent = function (conditionModel, evt) {
                    var _this = this;
                    switch (evt.name) {
                        case "action-remove-part": {
                            break;
                        }
                        case "get-part-actions": {
                            return this.$q.when([]);
                        }
                        case "part-param-changed": {
                            this.validateModel();
                        }
                        case "get-param-options": {
                            var result = this.panel.targets.map(function (target) {
                                return _this.uiSegmentSrv.newSegment({ value: target.refId });
                            });
                            return this.$q.when(result);
                        }
                    }
                };
                AlertTabCtrl.prototype.handleReducerPartEvent = function (conditionModel, evt) {
                    switch (evt.name) {
                        case "action": {
                            conditionModel.source.reducer.type = evt.action.value;
                            conditionModel.reducerPart = alert_def_1.default.createReducerPart(conditionModel.source.reducer);
                            break;
                        }
                        case "get-part-actions": {
                            var result = [];
                            for (var _i = 0, _a = alert_def_1.default.reducerTypes; _i < _a.length; _i++) {
                                var type = _a[_i];
                                if (type.value !== conditionModel.source.reducer.type) {
                                    result.push(type);
                                }
                            }
                            return this.$q.when(result);
                        }
                    }
                };
                AlertTabCtrl.prototype.addCondition = function (type) {
                    var condition = this.buildDefaultCondition();
                    // add to persited model
                    this.alert.conditions.push(condition);
                    // add to view model
                    this.conditionModels.push(this.buildConditionModel(condition));
                };
                AlertTabCtrl.prototype.removeCondition = function (index) {
                    this.alert.conditions.splice(index, 1);
                    this.conditionModels.splice(index, 1);
                };
                AlertTabCtrl.prototype.delete = function () {
                    this.alert = this.panel.alert = { enabled: false };
                    this.panel.thresholds = [];
                    this.conditionModels = [];
                    this.panelCtrl.render();
                };
                AlertTabCtrl.prototype.enable = function () {
                    this.alert.enabled = true;
                    this.initModel();
                };
                AlertTabCtrl.prototype.evaluatorParamsChanged = function () {
                    threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(this.panel);
                    this.panelCtrl.render();
                };
                AlertTabCtrl.prototype.severityChanged = function () {
                    threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(this.panel);
                    this.panelCtrl.render();
                };
                AlertTabCtrl.prototype.evaluatorTypeChanged = function (evaluator) {
                    // ensure params array is correct length
                    switch (evaluator.type) {
                        case "lt":
                        case "gt": {
                            evaluator.params = [evaluator.params[0]];
                            break;
                        }
                        case "within_range":
                        case "outside_range": {
                            evaluator.params = [evaluator.params[0], evaluator.params[1]];
                            break;
                        }
                        case "no_value": {
                            evaluator.params = [];
                        }
                    }
                    this.evaluatorParamsChanged();
                };
                AlertTabCtrl.prototype.test = function () {
                    var _this = this;
                    this.testing = true;
                    var payload = {
                        dashboard: this.dashboardSrv.getCurrent().getSaveModelClone(),
                        panelId: this.panelCtrl.panel.id,
                    };
                    return this.backendSrv.post('/api/alerts/test', payload).then(function (res) {
                        _this.testResult = res;
                        _this.testing = false;
                    });
                };
                return AlertTabCtrl;
            })();
            exports_1("AlertTabCtrl", AlertTabCtrl);
        }
    }
});
//# sourceMappingURL=alert_tab_ctrl.js.map
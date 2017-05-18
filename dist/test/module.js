'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ConfigCtrl = exports.AddDeviceCtrl = exports.DeviceDetailsCtrl = exports.DeviceListCtrl = undefined;

var _config = require('./config/config.js');

var _device_list = require('./components/device_list');

var _device_details = require('./components/device_details');

var _add_device = require('./components/add_device');

var _sdk = require('app/plugins/sdk');

(0, _sdk.loadPluginCss)({
	dark: 'plugins/kentik-app/css/kentik.dark.css',
	light: 'plugins/kentik-app/css/kentik.light.css'
});

exports.DeviceListCtrl = _device_list.DeviceListCtrl;
exports.DeviceDetailsCtrl = _device_details.DeviceDetailsCtrl;
exports.AddDeviceCtrl = _add_device.AddDeviceCtrl;
exports.ConfigCtrl = _config.ConfigCtrl;

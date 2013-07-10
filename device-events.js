module.exports = exports = DeviceEvents;

	//	core
var inherits = require('util').inherits
	, EE = require('events').EventEmitter

	//	3rd party
	,	detect = require('connect-mobile-detection')()

	, devices = ['phone', 'tablet', 'mobile']
;

function DeviceEvents (req, res, opt) {
	var next, all;

	if (!(this instanceof DeviceEvents)) {
		return new DeviceEvents(req, res, opt);
	}

	EE.call(this);

	this.req = req;
	this.res = res;
	next = (opt.callback || function () {}).bind(null, req, res);

	detect(req, res, next);

	matched = false;

	devices.map(function (device) {
		if (req[device]) {
			this.emit(device, req, res);
			matched = true;
		}
	}, this);

	if (!matched) {
		this.emit('computer', req, res);
	}

	this.emit('all', req, res);
}

inherits(DeviceEvents, EE);
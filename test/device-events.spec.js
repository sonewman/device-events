var test = require('tape')
	, DeviceEvents = require('../device-events')


test('DeviceEvents instance', function (t) {
	var dv = DeviceEvents();
	t.assert(
		(dv instanceof DeviceEvents)
		, 'should return an new instance on function call'
	);
	t.end();
});
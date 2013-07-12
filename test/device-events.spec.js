var test = require('tape')
  , sinon = require('sinon')
  , EE = require('events').EventEmitter
  , de = require('../device-events');

test('DeviceEvents instance', function (t) {
  var req = { headers : { 'user-agent' : '' } }
    , res = {}
    , devices = de(req, res);

  t.assert(
    (devices instanceof de.DeviceEvents)
    , 'should return an new instance on function call'
  );
  t.end();
});

test('test iphone', function (t) {
  var req = { headers : { 'user-agent' : 'Iphone' } }
    , res = {}
    , devices = de(req, res);


  t.ok(req.mobile, 'should be mobile');
  t.ok(req.phone, 'should be phone');
  t.notOk(req.tablet, 'should not be tablet');
  t.notOk(req.computer, 'should not be computer');
  t.end();
});

test('ipad', function (t) {
  var req = { headers : { 'user-agent' : 'Ipad' } }
    , res = {}
    , devices = de(req, res);

  t.ok(req.mobile, 'should be mobile');
  t.notOk(req.phone, 'should not be phone');
  t.ok(req.tablet, 'should be tablet');
  t.notOk(req.computer, 'should not be computer');
  t.end();
});

test('pc', function (t) {
  var req = { headers : { 'user-agent' : 'pc' } }
    , res = {}
    , devices = de(req, res);

  t.notOk(req.mobile, 'should not be mobile');
  t.notOk(req.phone, 'should not be phone');
  t.notOk(req.tablet, 'should not be tablet');
  t.ok(req.computer, 'should be computer');
  t.end();
});

test('#on()', function (t) {
  t.test(function (t) {
    var req = { headers : { 'user-agent' : 'pc' } }
      , res = {}
      , devices = de(req, res)
      , spy = sinon.spy();

    sinon.stub(EE.prototype, 'on', EE.prototype.on);
    devices.on('computer', spy);
    t.assert(EE.prototype.on.called, 'EventEmitter.on was called');
    t.assert(EE.prototype.on.calledWith('computer', spy), 'Called with args');
    t.assert(spy.called, 'spy was called');
    EE.prototype.on.restore();
    t.end();
  });

  t.test(function (t) {
    var req = { headers : { 'user-agent' : 'ipad' } }
      , res = {}
      , devices = de()
      , spy = sinon.spy();

    sinon.stub(EE.prototype, 'on', EE.prototype.on);
    devices.on('tablet', spy);

    devices.respond(req, res);
    t.assert(EE.prototype.on.called, 'EventEmitter.on was called');
    t.assert(EE.prototype.on.calledWith('tablet', spy), 'Called with args');
    t.assert(spy.called, 'spy was called');
    EE.prototype.on.restore();
    t.end();
  });

  t.end();
});

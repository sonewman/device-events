module.exports = exports = de;
exports.DeviceEvents = DeviceEvents;

  //  core
var inherits = require('util').inherits
  , EE = require('events').EventEmitter

  //  3rd party
  , detect = require('connect-mobile-detection')()
  , eventBindMethods = ['on', 'addListener', 'once']
  , _slice = [].slice
  , devices = ['phone', 'tablet', 'mobile', 'computer', 'full', 'terminal']
;

function de (req, res, opt) {
  var de = new DeviceEvents;
  if (!(req && res)) return de;
  return de.respond(req, res, opt);
}

function DeviceEvents () {
  if (!(this instanceof DeviceEvents))
    return new DeviceEvents;
  EE.call(this);  
}

inherits(DeviceEvents, EE);

DeviceEvents.prototype.respond = function (req, res, opt) {
  var next, matched;
  if (this.responded) return this._checkStatus();
  opt = opt || {};

  this.req = req;
  this.res = res;
  next = (opt.callback || function () {}).bind(null, req, res);
  detect(req, res, next);
  matched = false;

  devices.forEach(function (device) {
    this[device] = req[device] || false;
    if (device === 'tablet' && req[device]) {
      this.full = req.full = true;
    }
    if (req[device]) matched = true;
  }, this);

  this.computer = req.computer = !matched ? true : false;
  this.full = req.full = !matched ? true : false;
  this.terminal = req.terminal = /libcurl/.test(req.headers['user-agent']) || false;

  this.responded = true;
  this._checkStatus();
  return this;
};

DeviceEvents.prototype._checkStatus = function () {
  if (!this.responded) return this;

  //  have we cached the devices?
  if (this._devices) {
    //  loop cached devices and emit relevant events
    this._devices.forEach(function (name) {
      this.emit(name, this.req, this.res);
    }, this);

  //  filter the results so we only have
  //  the device
  } else {

    this._devices = devices.filter(function (name) {
      if (this[name]) {
        this.emit(name, this.req, this.res);
        return true;
      }
    }, this);
  }

  //  emit the all event
  this.emit('all', this.req, this.res);
  return this;
};

//  monkey patch events - this will prob be added to x-emitter
eventBindMethods.forEach(function (methodName) {
  DeviceEvents.prototype[methodName] = function (name, callback /*, arguments */) {
    // console.log(this.responded, this._devices)
    if (this.responded && this._devices) {
      ((this._devices.indexOf(name) > -1) && typeof callback == 'function') 
        && callback.apply(this, [this.req, this.res].concat(_slice.call(arguments, 2)));
    }
    EE.prototype[methodName].apply(this, _slice.call(arguments));
    return this;
  };
});


function proxyObject (to /*, to bind*/) {
  to = to || {};
  var args = _slice.call(arguments, 1).forEach(function (bind) {
    //  use for-in to catch prototype properties
    for (var prop in bind) {
      if (typeof bind[prop] === 'function') {
        to[prop] = function () {
          bind[prop].apply(bind, _slice.call(arguments))
        };
      } else {
        to[prop] = function () {
          return bind[prop];
        };
      }
    }
  });
  return to;
}


function extend (obj) {
  obj = obj || {};
  var extras = _slice.call(arguments, 1);
  extras.forEach(function (ex) {
    Object.keys(ex).forEach(function (prop) {
      obj[prop] = ex[prop];
    });
  });
  return obj;
}
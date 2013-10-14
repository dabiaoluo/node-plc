// Generated by CoffeeScript 1.6.3
/*
Copyright (c) 2012-2013, Maruks Kohlhase <mail@markus-kohlhase.de>
*/


(function() {
  var Logo, bits, dave, ev, fs, net,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require("fs");

  net = require("net");

  ev = require("events");

  dave = require("../build/Release/nodave");

  bits = require("bits");

  Logo = (function(_super) {
    __extends(Logo, _super);

    function Logo(ipAddress, opt) {
      this.ipAddress = ipAddress;
      if (opt == null) {
        opt = {};
      }
      this.inputs = opt.inputs, this.markers = opt.markers, this.timeout = opt.timeout;
      this._dave = new dave.NoDave(this.ipAddress);
      if (this.inputs == null) {
        this.inputs = 8;
      }
      if (this.markers == null) {
        this.markers = 4;
      }
      if (this._simulate == null) {
        this._simulate = opt.simulate;
      }
      if (this._simulate) {
        this._simMarkers = 0;
        this._simInputs = 0;
      }
    }

    Logo.prototype.connected = false;

    Logo.prototype.connect = function() {
      var _this = this;
      if (this._simulate) {
        this.isConnected = true;
        this.emit("connect");
        return;
      }
      if (this._socket == null) {
        this._socket = new net.Socket;
        if (this.timeout) {
          this._socket.setTimeout(this.timeout);
        }
        this._socket.on("timeout", function(ev) {
          return _this.emit("timeout", ev);
        });
        this._socket.on("error", function(err) {
          _this.isConnected = false;
          return _this.emit("error", err);
        });
        this._socket.on("close", function(ev) {
          _this.isConnected = false;
          return _this.emit("disconnect", ev);
        });
        this._socket.on("connect", function() {
          var e;
          try {
            _this._dave.connect(_this._socket._handle.fd, _this.timeout);
            _this.isConnected = true;
            return _this.emit("connect");
          } catch (_error) {
            e = _error;
            return _this.emit("error", e);
          }
        });
      }
      return this._socket.connect(102, this.ipAddress);
    };

    Logo.prototype.disconnect = function() {
      var _ref;
      this.isConnected = false;
      return (_ref = this._socket) != null ? _ref.destroy() : void 0;
    };

    Logo.prototype.setMarker = function(m) {
      if (!this.isConnected) {
        return null;
      }
      if (this._simulate) {
        return this._simMarkers = bits.set(this._simMarkers, m);
      } else {
        return this._dave.setMarkers(bits.set(this._dave.getMarkers(), m));
      }
    };

    Logo.prototype.clearMarker = function(m) {
      if (!this.isConnected) {
        return null;
      }
      if (this._simulate) {
        return this._simMarkers = bits.clear(this._simMarkers, m);
      } else {
        return this._dave.setMarkers(bits.clear(this._dave.getMarkers(), m));
      }
    };

    Logo.prototype.getMarker = function(m) {
      if (!this.isConnected) {
        return null;
      }
      if (this._simulate) {
        return bits.test(this._simMarkers, m);
      } else {
        return bits.test(this._dave.getMarkers(), m);
      }
    };

    Logo.prototype.getMarkers = function() {
      var i, markers, _i, _ref, _results;
      if (!this.isConnected) {
        return null;
      }
      markers = this._simulate ? this._simMarkers : this._dave.getMarkers();
      _results = [];
      for (i = _i = 0, _ref = this.markers; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(bits.test(markers, i));
      }
      return _results;
    };

    Logo.prototype.setSimulatedInput = function(i) {
      if (!(this.isConnected && this._simulate)) {
        return null;
      }
      return this._simInputs = bits.set(this._simInputs, i);
    };

    Logo.prototype.clearSimulatedInput = function(i) {
      if (!(this.isConnected && this._simulate)) {
        return null;
      }
      return this._simInputs = bits.clear(this._simInputs, i);
    };

    Logo.prototype.getInput = function(i) {
      if (!this.isConnected) {
        return null;
      }
      if (this._simulate) {
        return bits.test(this._simInputs, i);
      } else {
        return bits.test(this._dave.getInputs(), i);
      }
    };

    Logo.prototype.getInputs = function() {
      var i, inputs, _i, _ref, _results;
      if (!this.isConnected) {
        return null;
      }
      inputs = this._simulate ? this._simInputs : this._dave.getInputs();
      _results = [];
      for (i = _i = 0, _ref = this.inputs; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(bits.test(inputs, i));
      }
      return _results;
    };

    return Logo;

  })(ev.EventEmitter);

  module.exports = Logo;

}).call(this);

const BigNumber = require('bignumber.js');
const Utils = require('./utils');
const PASSIVE = require('./passive');
const REGION = require('./region');

module.exports = (function () {

  function Hex64Byte(hex, base) {
    this.data = ('undefined' === typeof base) ? new BigNumber(hex) : new BigNumber(hex, base);
    this._str = this.data.toString();
    this.hex = this.data.toString(16);
    this.bits = this.data.toString(2);
  }

  Hex64Byte.prototype.toNumber = function () {
    return this.data.toNumber();
  }


  Hex64Byte.prototype.add = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    var data = this.data.plus(val);
    return new Hex64Byte(data);
  }

  Hex64Byte.prototype.sub = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    var data = this.data.minus(val);
    return new Hex64Byte(data);
  }

  Hex64Byte.prototype.mul = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    var data = this.data.times(val);
    return new Hex64Byte(data);
  }

  Hex64Byte.prototype.div = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    var data = this.data.div(val);
    return new Hex64Byte(data);
  }

  Hex64Byte.prototype.idiv = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    var data = this.data.idiv(val);
    return new Hex64Byte(data);
  }

  Hex64Byte.prototype.eq = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    return this.data.eq(val);
  }

  Hex64Byte.prototype.gt = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    return this.data.gt(val);
  }

  Hex64Byte.prototype.gte = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    return this.data.gte(val);
  }

  Hex64Byte.prototype.lt = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    return this.data.lt(val);
  }

  Hex64Byte.prototype.lte = function (other) {
    var val = ('undefined' === typeof other.data) ? other : other.data;
    return this.data.lte(val);
  }

  // var shifted = this.bits.slice(this.bits.length - shift, this.bits.length);
  // return new Hex64Byte(shifted, 2);


  Hex64Byte.prototype.ls = function (shift) {
    var shiftCount = shift;
    if ('undefined' !== typeof shift.data) {
      shiftCount = shift.data.toNumber();
    }

    var zeros = '';
    for (var i = 0; i < shiftCount; i++) {
      zeros += '0';
    }
    var shifted = this.bits + zeros;
    if (shifted.length > 256) {
      shifted = shifted.slice(shifted.length - 256, shifted.length);
    }
    return new Hex64Byte(shifted, 2);
  }

  Hex64Byte.prototype.rs = function (shift) {
    var shiftCount = shift;
    if ('undefined' !== typeof shift.data) {
      shiftCount = shift.data.toNumber();
    }
    var shifted = this.bits.slice(0, this.bits.length - shiftCount);
    return new Hex64Byte(shifted, 2);
  }

  Hex64Byte.prototype.and = function (mask, base) {
    var maskHex;
    if ('undefined' === typeof mask.data) {
      maskHex = ('undefined' === typeof base) ? new Hex64Byte(mask) : new Hex64Byte(mask, base);
    } else {
      maskHex = new Hex64Byte(mask.data);
    }
    var masked = '';
    for (var i = 0; i < maskHex.bits.length; i++) {
      masked += (this.bits.charAt(this.bits.length - maskHex.bits.length + i) === maskHex.bits.charAt(i)) ? maskHex.bits.charAt(i) : '0';
    }
    return new Hex64Byte(masked, 2);
  }

  Hex64Byte.prototype.or = function (mask, base) {
    var maskHex;
    if ('undefined' === typeof mask.data) {
      maskHex = ('undefined' === typeof base) ? new Hex64Byte(mask) : new Hex64Byte(mask, base);
    } else {
      maskHex = new Hex64Byte(mask.data);
    }

    var notMasked = this.rs(maskHex.bits.length).bits;
    var masked = '';
    for (var i = 0; i < maskHex.bits.length; i++) {
      masked += (maskHex.bits.charAt(i) === '0') ? this.bits.charAt(this.bits.length - maskHex.bits.length + i) : '1';
    }
    return new Hex64Byte(notMasked + masked, 2);
  }

  Hex64Byte.Test = function () {

    var hex = new Hex64Byte('0x110000000000000640000000000000032000050000c800032000be0001a');

    var hp = hex.rs(100).and(1048575);
    var ap = hex.rs(80).and(1048575);
    var deff = hex.rs(60).and(1048575);
    var speed = hex.rs(40).and(1048575);
    var weight = hex.rs(20).and(1048575);
    var lifespan = hex.and(1048575);

    var mainStats = hp.ls(20).or(ap).ls(20).or(deff).ls(20).or(speed).ls(20).or(weight).ls(20).or(lifespan);

    console.log('hex');
    console.log(hex);

    console.log('hp');
    console.log(hp);
    console.log('ap');
    console.log(ap);
    console.log('deff');
    console.log(deff);
    console.log('speed');
    console.log(speed);
    console.log('weight');
    console.log(weight);
    console.log('lifespan');
    console.log(lifespan);
    console.log('mainStats');
    console.log(mainStats);

  }

  return Hex64Byte;
})();
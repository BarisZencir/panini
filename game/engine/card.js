
const BigNumber = require('bignumber.js');
const Utils = require('./utils');
const Hex64Byte = require('./hex64byte');
const PASSIVE = require('./passive');
const REGION = require('./region');
const Calc = require('./calculate');

module.exports = (function () {

  function Card(name,
    hp, ap, deff, speed, weight, lifespan,
    passives, passivePercents,
    region, rarity) {
    this.name = name || '';
    this.hp = hp || 0;
    this.ap = ap || 0;
    this.deff = deff || 0;
    this.speed = speed || 0;
    this.weight = weight || 0;
    this.lifespan = lifespan || 0;

    this.region1 = 0;
    this.region2 = 0;
    this.region3 = 0;
    this.region4 = 0;
    this.region5 = 0;//asia
    this.region6 = 0;
    this.region7 = 0;
    this.region8 = 0;
    if (typeof region !== 'undefined') {
      this[region] = 1;
    }

    this.passive1 = 0;
    this.passive2 = 0;
    this.passive3 = 0;
    this.passive4 = 0;
    this.passive5 = 0;
    this.passive6 = 0;//deff
    this.passive7 = 0;
    this.passive8 = 0;
    this.passive9 = 0;
    this.passive10 = 0;
    if (typeof passives !== 'undefined') {
      for (var i = 0; i < passives.length; i++) {
        this[passives[i]] = passivePercents[i];
      }
    }

    this.rarity = rarity || 0;
    this.level = 0;
  }

  //note: 4 byte baseId icin ayrildi.
  //total byte: 60 byte
  Card.prototype.toHex64Byte = function () {
    var hex = '0x'
      + Utils.toHex(this.level, 1)
      + Utils.toHex(this.rarity, 1)
      + Utils.toHex(this.region1, 1)
      + Utils.toHex(this.region2, 1)
      + Utils.toHex(this.region3, 1)
      + Utils.toHex(this.region4, 1)
      + Utils.toHex(this.region5, 1)
      + Utils.toHex(this.region6, 1)
      + Utils.toHex(this.region7, 1)
      + Utils.toHex(this.region8, 1)
      + Utils.toHex(this.passive1, 2)
      + Utils.toHex(this.passive2, 2)
      + Utils.toHex(this.passive3, 2)
      + Utils.toHex(this.passive4, 2)
      + Utils.toHex(this.passive5, 2)
      + Utils.toHex(this.passive6, 2)
      + Utils.toHex(this.passive7, 2)
      + Utils.toHex(this.passive8, 2)
      + Utils.toHex(this.passive9, 2)
      + Utils.toHex(this.passive10, 2)
      + Utils.toHex(this.hp, 5)
      + Utils.toHex(this.ap, 5)
      + Utils.toHex(this.deff, 5)
      + Utils.toHex(this.speed, 5)
      + Utils.toHex(this.weight, 5)
      + Utils.toHex(this.lifespan, 5);
    return new Hex64Byte(hex);
  }

  Card.prototype.fromHex64Byte = function (Hex64Byte) {
    var hex = Hex64Byte.hex;
    var n = hex.length - 1;
    var k = 0;

    var elem = '';

    //features
    for (var i = 0; i < 5; i++) { elem = hex[n - k] + elem; k++; }
    this.lifespan = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex[n - k] + elem; k++; }
    this.weight = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex[n - k] + elem; k++; }
    this.speed = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex[n - k] + elem; k++; }
    this.deff = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex[n - k] + elem; k++; }
    this.ap = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex[n - k] + elem; k++; }
    this.hp = parseInt(elem, 16); elem = '';
    //passive
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive10 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive9 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive8 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive7 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive6 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive5 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive4 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive3 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive2 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex[n - k] + elem; k++; }
    this.passive1 = parseInt(elem, 16); elem = '';
    //region
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region8 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region7 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region6 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region5 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region4 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region3 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region2 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.region1 = parseInt(elem, 16); elem = '';
    //rarity
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.rarity = parseInt(elem, 16); elem = '';

    //level
    for (var i = 0; i < 1; i++) { elem = hex[n - k] + elem; k++; }
    this.level = (isNaN(parseInt(elem, 16))) ? 0 : parseInt(elem, 16); elem = ''

    return this;
  }
  Card.prototype.toJSON = function () {

    var region = "OCEAN";
    if (this.region1) {
      region = "NOURTH_AMERICA";
    } else if (this.region2) {
      region = "SOUTH_AMERICA";
    } else if (this.region3) {
      region = "EUROPE";
    } else if (this.region4) {
      region = "AFRICA";
    } else if (this.region5) {
      region = "ASIA";
    } else if (this.region6) {
      region = "AUSTRALIA";
    } else if (this.region7) {
      region = "ANTARCTICA";
    }


    var PASSIVE = {
      POISON: 'passive1',
      HEAL_BUFF: 'passive2',
      ATTACK_DEBUFF: 'passive3',
      ATTACK_BUFF: 'passive4',
      DEFENSE_DEBUFF: 'passive5',
      DEFENSE_BUFF: 'passive6',
      SPEED_DEBUFF: 'passive7',
      SPEED_BUFF: 'passive8',
      LIFESTEAL: 'passive9',//aktive
      DAMAGE_REFLECTION: 'passive10'//aktive
    };
    var passives = [];
    if (this.passive1) {
      passives.push(" POISON: " + this.passive1);
    }
    if (this.passive2) {
      passives.push(" HEAL_BUFF: " + this.passive2);
    }
    if (this.passive3) {
      passives.push(" ATTACK_DEBUFF: " + this.passive3);
    }
    if (this.passive4) {
      passives.push(" ATTACK_BUFF: " + this.passive4);
    }
    if (this.passive5) {
      passives.push(" DEFENSE_DEBUFF: " + this.passive5);
    }
    if (this.passive6) {
      passives.push(" DEFENSE_BUFF: " + this.passive6);
    }
    if (this.passive7) {
      passives.push(" SPEED_DEBUFF: " + this.passive7);
    }
    if (this.passive8) {
      passives.push(" SPEED_BUFF: " + this.passive8);
    }
    if (this.passive9) {
      passives.push(" LIFESTEAL: " + this.passive9);
    }
    if (this.passive10) {
      passives.push(" DAMAGE_REFLECTION: " + this.passive10);
    }


    return {
      name: this.name,
      hp: this.hp,
      ap: this.ap,
      deff: this.deff,
      speed: this.speed,
      weight: this.weight,
      lifespan: this.lifespan,
      region: region,
      passives: passives.join()
    }
  };

  Card.prototype.print = function () {


    // var card = this.cards[i];
    // var region;
    // if (card.region1) {
    //   region = 'NOURTH_AMERICA';
    // } else if (card.region2) {
    //   region = 'SOUTH_AMERICA';
    // } else if (card.region3) {
    //   region = 'EUROPE';
    // } else if (card.region4) {
    //   region = 'AFRICA';
    // } else if (card.region5) {
    //   region = 'ASIA';
    // } else if (card.region6) {
    //   region = 'AUSTRALIA';
    // } else if (card.region7) {
    //   region = 'ANTARCTICA';
    // } else if (card.region8) {
    //   region = 'OCEAN';
    // }
    // var passive;
    // var passivePercent;
    // if (card.passive1) {

    // } else if (card.passive1) {
    //   passive = 'POISON';
    //   passivePercent = card.passive1;
    // } else if (card.passive2) {
    //   passive = 'HEAL_BUFF';
    //   passivePercent = card.passive2;
    // } else if (card.passive3) {
    //   passive = 'ATTACK_DEBUFF';
    //   passivePercent = card.passive3;
    // } else if (card.passive4) {
    //   passive = 'ATTACK_BUFF';
    //   passivePercent = card.passive4;
    // } else if (card.passive5) {
    //   passive = 'DEFENSE_DEBUFF';
    //   passivePercent = card.passive5;
    // } else if (card.passive6) {
    //   passive = 'DEFENSE_BUFF';
    //   passivePercent = card.passive6;
    // } else if (card.passive7) {
    //   passive = 'SPEED_DEBUFF';
    //   passivePercent = card.passive7;
    // } else if (card.passive8) {
    //   passive = 'SPEED_BUFF';
    //   passivePercent = card.passive8;
    // } else if (card.passive9) {
    //   passive = 'LIFESTEAL';
    //   passivePercent = card.passive9;
    // } else if (card.passive10) {
    //   passive = 'DAMAGE_REFLECTION';
    //   passivePercent = card.passive10;
    // }

    // console.log();
    // console.log(
    //   card.name + '(' + region + ')');
    // console.log(
    //   'hp:' + card.hp + ' '
    //   + 'ap:' + card.ap + ' '
    //   + 'deff:' + card.deff + ' '
    //   + 'speed:' + card.speed + ' '
    //   + 'weight:' + card.weight + ' '
    //   + 'life:' + card.lifespan
    //   + ' passive(' + passive + '):'
    //   + passivePercent
    // );

  }

  return Card;
})();



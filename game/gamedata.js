const Card = require('./engine/card');

const RARITY = require('./engine/rarity');
const REGION = require('./engine/region');
const PASSIVE = require('./engine/passive');
const Utils = require('./engine/utils');
const Hex64Byte = require('./engine/hex64byte');

const csv = require('csvtojson')
const csvFilePath = "Panini - Etherzoo Animal List - animals.csv";


//note: test codu.
// daha sonra db'ye tasinacak
module.exports = (function () {

  var baseCards = [];

  async function initBaseCards() {

    const jsonArray = await csv().fromFile(csvFilePath);

    for (var i = 0; i < jsonArray.length; i++) {
      //note: 24,25: description, link of picture.
      var passives = [];
      var passivePercents = [];
      var row = jsonArray[i];
      for (var j = 1; j <= 10; j++) {
        var key = "passive" + j;
        if (row[key] != "") {
          passives.push(key);
          passivePercents.push(row[key]);
        }
      }

      var region;
      if (row.region == "North America") {
        region = REGION.NOURTH_AMERICA;
      } else if (row.region == "South America") {
        region = REGION.SOUTH_AMERICA;
      } else if (row.region == "Europe") {
        region = REGION.EUROPE;
      } else if (row.region == "Africa") {
        region = REGION.AFRICA;
      } else if (row.region == "Asia") {
        region = REGION.ASIA;
      } else if (row.region == "Australia") {
        region = REGION.AUSTRALIA;
      } else if (row.region == "Antartica") {
        region = REGION.ANTARCTICA;
      }

      var rarity;
      if (row.rarity == "Common") {
        rarity = RARITY.COMMON;
      } else if (row.rarity == "Rare") {
        rarity = RARITY.RARE;
      } else if (row.rarity == "Exotic") {
        rarity = RARITY.EXOTIC;
      }

      baseCards.push(new Card(row.name,
        row.hp, row.ap, row.deff, row.sp, row.weight, row.lifespan,
        passives, passivePercents,
        region, rarity
      ));
    }
    console.log(baseCards);
  }
  // baseCards = [
  //   new Card('Black Bear',
  //     //hp, ap, deff, sp, we, life, 
  //     800, 80, 200, 50, 190, 26,
  //     [PASSIVE.ATTACK_BUFF], [100],
  //     REGION.NOURTH_AMERICA, RARITY.COMMON),

  //   //2
  //   new Card('Raccoon',
  //     //hp, ap, deff, sp, we, life, 
  //     80, 20, 20, 24, 6, 14,
  //     [PASSIVE.HEAL_BUFF], [50],
  //     REGION.NOURTH_AMERICA, RARITY.COMMON),

  //   //3
  //   new Card('Mustang',
  //     //hp, ap, deff, sp, we, life, 
  //     150, 30, 50, 75, 600, 19,
  //     [PASSIVE.SPEED_BUFF], [120],
  //     REGION.NOURTH_AMERICA, RARITY.EXOTIC),

  //   //4
  //   new Card('American Bison',
  //     //hp, ap, deff, sp, we, life, 
  //     1000, 50, 300, 35, 1200, 17,
  //     [PASSIVE.DEFENSE_BUFF], [80],
  //     REGION.NOURTH_AMERICA, RARITY.RARE),

  //   //5
  //   new Card('Mountain Lion',
  //     //hp, ap, deff, sp, we, life, 
  //     600, 80, 150, 40, 220, 15,
  //     [PASSIVE.LIFESTEAL, PASSIVE.SPEED_BUFF], [40, 50],
  //     REGION.NOURTH_AMERICA, RARITY.EXOTIC), //exotic olmali?

  //   //6
  //   new Card('Bald Eagle',
  //     //hp, ap, deff, sp, we, life, 
  //     100, 60, 50, 150, 7, 18,
  //     [PASSIVE.SPEED_BUFF], [80],
  //     REGION.NOURTH_AMERICA, RARITY.EXOTIC),

  //   //South America
  //   //7
  //   new Card('Toucan',
  //     //hp, ap, deff, sp, we, life, 
  //     20, 5, 10, 64, 1, 18,
  //     [PASSIVE.HEAL_BUFF], [60],
  //     REGION.SOUTH_AMERICA, RARITY.COMMON),

  //   //8
  //   new Card('Piranha',
  //     //hp, ap, deff, sp, we, life, 
  //     30, 30, 30, 17, 1, 22,
  //     [PASSIVE.ATTACK_BUFF], [80],
  //     REGION.SOUTH_AMERICA, RARITY.COMMON),

  //   //Europe
  //   //9
  //   new Card('Reindeer',
  //     //hp, ap, deff, sp, we, life, 
  //     200, 10, 100, 82, 300, 15,
  //     [PASSIVE.SPEED_DEBUFF], [60],
  //     REGION.EUROPE, RARITY.COMMON),

  //   //10
  //   new Card('Grass Snake',
  //     //hp, ap, deff, sp, we, life, 
  //     50, 40, 50, 3, 1, 24,
  //     [PASSIVE.POISON], [40],
  //     REGION.EUROPE, RARITY.COMMON),

  //   //11
  //   new Card('Gray Wolf',
  //     //hp, ap, deff, sp, we, life, 
  //     250, 70, 150, 75, 32, 12,
  //     [PASSIVE.LIFESTEAL, PASSIVE.DEFENSE_DEBUFF], [60, 40],
  //     REGION.EUROPE, RARITY.COMMON),

  //   //Africa
  //   //12
  //   new Card('Cheetah',
  //     //hp, ap, deff, sp, we, life, 
  //     250, 90, 80, 112, 48, 11,
  //     [PASSIVE.SPEED_BUFF], [120],
  //     REGION.AFRICA, RARITY.RARE),

  //   //13
  //   new Card('Spotted Hyena',
  //     //hp, ap, deff, sp, we, life, 
  //     350, 110, 120, 60, 77, 24,
  //     [PASSIVE.DEFENSE_DEBUFF], [60],
  //     REGION.AFRICA, RARITY.RARE),

  //   //14
  //   new Card('Hippopotamus',
  //     //hp, ap, deff, sp, we, life, 
  //     1600, 60, 100, 45, 2500, 45,
  //     [PASSIVE.ATTACK_BUFF], [60],
  //     REGION.AFRICA, RARITY.RARE),

  //   //15
  //   new Card('Black Rhinoceros',
  //     //hp, ap, deff, sp, we, life, 
  //     1000, 100, 400, 42, 1100, 47,
  //     [PASSIVE.ATTACK_BUFF], [100],
  //     REGION.AFRICA, RARITY.EXOTIC),

  //   //16
  //   new Card('Black Mamba',
  //     //hp, ap, deff, sp, we, life, 
  //     10, 40, 10, 5, 2, 11,
  //     [PASSIVE.POISON], [40],
  //     REGION.AFRICA, RARITY.RARE),

  //   //Asia
  //   //17
  //   new Card('Giant Panda',
  //     //hp, ap, deff, sp, we, life, 
  //     300, 10, 300, 32, 180, 32,
  //     [PASSIVE.HEAL_BUFF], [60],
  //     REGION.ASIA, RARITY.EXOTIC),

  //   //18
  //   new Card('Asian Elephant',
  //     //hp, ap, deff, sp, we, life, 
  //     1700, 120, 500, 43, 4000, 67,
  //     [PASSIVE.DEFENSE_BUFF], [100],
  //     REGION.ASIA, RARITY.EXOTIC), //exotic olmali?

  //   //19
  //   new Card('King Cobra',
  //     //hp, ap, deff, sp, we, life, 
  //     60, 50, 50, 7, 5, 18,
  //     [PASSIVE.POISON], [50],
  //     REGION.ASIA, RARITY.RARE),

  //   //Australia
  //   //20
  //   new Card('Tasmanian Devil',
  //     //hp, ap, deff, sp, we, life, 
  //     120, 50, 80, 24, 7, 7,
  //     [PASSIVE.ATTACK_BUFF], [80],
  //     REGION.AUSTRALIA, RARITY.EXOTIC), //exotic olmali?

  //   //21
  //   new Card('Kangaroo',
  //     //hp, ap, deff, sp, we, life, 
  //     200, 20, 100, 55, 65, 7,
  //     [PASSIVE.DAMAGE_REFLECTION, PASSIVE.HEAL_BUFF], [200, 60],
  //     REGION.AUSTRALIA, RARITY.COMMON),

  //   //22
  //   new Card('Koala',
  //     //hp, ap, deff, sp, we, life, 
  //     20, 10, 10, 2, 8, 18,
  //     [PASSIVE.HEAL_BUFF], [50],
  //     REGION.AUSTRALIA, RARITY.EXOTIC),

  //   //Antartica

  //   //23
  //   new Card('Elephant Seal',
  //     //hp, ap, deff, sp, we, life, 
  //     600, 20, 200, 19, 1800, 19,
  //     [PASSIVE.DAMAGE_REFLECTION, PASSIVE.ATTACK_DEBUFF], [150, 100],
  //     REGION.ANTARCTICA, RARITY.COMMON),


  //   //OCEAN
  //   //24
  //   new Card('Killer Whale',
  //     //hp, ap, deff, sp, we, life, 
  //     1400, 90, 100, 44, 7500, 56,
  //     [PASSIVE.LIFESTEAL, PASSIVE.HEAL_BUFF], [40, 20],
  //     REGION.OCEAN, RARITY.EXOTIC), //okyanus olmali, exotic?
  //   //25
  //   new Card('Great White Shark',
  //     //hp, ap, deff, sp, we, life, 
  //     800, 80, 100, 24, 1650, 38,
  //     [PASSIVE.DEFENSE_DEBUFF], [100],
  //     REGION.OCEAN, RARITY.RARE), //okyanus olmali?
  // ];

  ////passive1, passive1Percents, passive2, passive2Percent,passive3, passive3Percent
  var regionBuffs = [
    //NOURTH_AMERICA
    {
      passive1: [PASSIVE.DEFENSE_BUFF], passive1Percents: [30],
      passive2: [PASSIVE.DEFENSE_DEBUFF], passive2Percents: [40],
      passive3: [PASSIVE.DEFENSE_BUFF], passive3Percents: [50]
    },
    //SOUTH_AMERICA
    {
      passive1: [PASSIVE.HEAL_BUFF], passive1Percents: [30],
      passive2: [PASSIVE.DEFENSE_BUFF], passive2Percents: [40],
      passive3: [PASSIVE.POISON], passive3Percents: [30]
    },
    //EUROPA
    {
      passive1: [PASSIVE.ATTACK_BUFF], passive1Percents: [30],
      passive2: [PASSIVE.DEFENSE_BUFF], passive2Percents: [40],
      passive3: [PASSIVE.DEFENSE_BUFF], passive3Percents: [50]
    },

    //AFRICA
    {
      passive1: [PASSIVE.SPEED_BUFF], passive1Percents: [30],
      passive2: [PASSIVE.ATTACK_BUFF], passive2Percents: [40],
      passive3: [PASSIVE.SPEED_BUFF], passive3Percents: [50]
    },
    //ASIA
    {
      passive1: [PASSIVE.ATTACK_BUFF], passive1Percents: [30],
      passive2: [PASSIVE.HEAL_BUFF], passive2Percents: [40],
      passive3: [PASSIVE.ATTACK_BUFF], passive3Percents: [50]
    },
    //AUSTRALIA
    {
      passive1: [PASSIVE.POISON], passive1Percents: [20],
      passive2: [PASSIVE.POISON], passive2Percents: [30],
      passive3: [PASSIVE.POISON], passive3Percents: [40]
    },
    //ANTARCTICA
    {
      passive1: [PASSIVE.DEFENSE_DEBUFF], passive1Percents: [50],
      passive2: [PASSIVE.SPEED_BUFF], passive2Percents: [40],
      passive3: [PASSIVE.ATTACK_DEBUFF], passive3Percents: [50]
    },
    //OCEAN
    {
      passive1: [PASSIVE.HEAL_BUFF], passive1Percents: [30],
      passive2: [PASSIVE.DEFENSE_DEBUFF], passive2Percents: [40],
      passive3: [PASSIVE.HEAL_BUFF], passive3Percents: [50]
    }];

  function extractHex64BaseCards() {
    var hex64List = [];
    for (var i = 0; i < baseCards.length; i++) {
      hex64List.push(baseCards[i].toHex64Byte());
    }
    return hex64List;
  }

  var createRegionPassives = function (passive1, passive1Percents, passive2, passive2Percent, passive3, passive3Percent) {
    var buff1 = {
      passive1: 0,
      passive2: 0,
      passive3: 0,
      passive4: 0,
      passive5: 0,
      passive6: 0,
      passive7: 0,
      passive8: 0,
      passive9: 0,
      passive10: 0
    };

    for (var i = 0; i < passive1.length; i++) {
      buff1[passive1[i]] += passive1Percents[i];
    }

    var buff2 = {
      passive1: buff1.passive1,
      passive2: buff1.passive2,
      passive3: buff1.passive3,
      passive4: buff1.passive4,
      passive5: buff1.passive5,
      passive6: buff1.passive6,
      passive7: buff1.passive7,
      passive8: buff1.passive8,
      passive9: buff1.passive9,
      passive10: buff1.passive10
    };

    for (var i = 0; i < passive2.length; i++) {
      buff2[passive2[i]] += passive2Percent[i];
    }

    var buff3 = {
      passive1: buff2.passive1,
      passive2: buff2.passive2,
      passive3: buff2.passive3,
      passive4: buff2.passive4,
      passive5: buff2.passive5,
      passive6: buff2.passive6,
      passive7: buff2.passive7,
      passive8: buff2.passive8,
      passive9: buff2.passive9,
      passive10: buff2.passive10
    };

    for (var i = 0; i < passive3.length; i++) {
      buff3[passive3[i]] += passive3Percent[i];
    }

    return '0x'
      + Utils.toHex(buff3.passive1, 2)
      + Utils.toHex(buff3.passive2, 2)
      + Utils.toHex(buff3.passive3, 2)
      + Utils.toHex(buff3.passive4, 2)
      + Utils.toHex(buff3.passive5, 2)
      + Utils.toHex(buff3.passive6, 2)
      + Utils.toHex(buff3.passive7, 2)
      + Utils.toHex(buff3.passive8, 2)
      + Utils.toHex(buff3.passive9, 2)
      + Utils.toHex(buff3.passive10, 2)
      + Utils.toHex(buff2.passive1, 2)
      + Utils.toHex(buff2.passive2, 2)
      + Utils.toHex(buff2.passive3, 2)
      + Utils.toHex(buff2.passive4, 2)
      + Utils.toHex(buff2.passive5, 2)
      + Utils.toHex(buff2.passive6, 2)
      + Utils.toHex(buff2.passive7, 2)
      + Utils.toHex(buff2.passive8, 2)
      + Utils.toHex(buff2.passive9, 2)
      + Utils.toHex(buff2.passive10, 2)
      + Utils.toHex(buff1.passive1, 2)
      + Utils.toHex(buff1.passive2, 2)
      + Utils.toHex(buff1.passive3, 2)
      + Utils.toHex(buff1.passive4, 2)
      + Utils.toHex(buff1.passive5, 2)
      + Utils.toHex(buff1.passive6, 2)
      + Utils.toHex(buff1.passive7, 2)
      + Utils.toHex(buff1.passive8, 2)
      + Utils.toHex(buff1.passive9, 2)
      + Utils.toHex(buff1.passive10, 2);

  }

  function extractHexregionBuffs() {
    var hexRegionBuffs = [];
    for (var i = 0; i < regionBuffs.length; i++) {
      //passive1, passive1Percents, passive2, passive2Percent,passive3, passive3Percent
      var regionBuff = regionBuffs[i];
      hexRegionBuffs[i] = createRegionPassives(
        regionBuff.passive1, regionBuff.passive1Percents,
        regionBuff.passive2, regionBuff.passive2Percents,
        regionBuff.passive3, regionBuff.passive3Percents);
    }
    return hexRegionBuffs;
  }

  function printHexBaseCards() {
    console.log('hex64CardList: ');
    var hex64CardList = extractHex64BaseCards();
    console.log(hex64CardList);
    for (var i = 0; i < hex64CardList.length; i++) {
      console.log('_createCardBase(0x' + hex64CardList[i].hex + ');');
    }
    for (var i = 0; i < hex64CardList.length; i++) {
      console.log('cards[' + (i + 1) + '] = 0x' + hex64CardList[i].hex + ';');
    }
  }

  function printHexRegionBuffs() {

    console.log('regionBuffs:');
    var hexRegionBuffs = extractHexregionBuffs();
    console.log(hexRegionBuffs);
    for (var i = 0; i < hexRegionBuffs.length; i++) {
      console.log('regionBuffs[' + (i) + '] = ' + hexRegionBuffs[i] + ';');
    }
  }
  return {
    data: {
      baseCards,
      regionBuffs,
    },
    methods: {
      initBaseCards,
      extractHex64BaseCards,
      extractHexregionBuffs,
      printHexBaseCards,
      printHexRegionBuffs
    }
  }

})();
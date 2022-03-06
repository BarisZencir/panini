
const RARITY = require('./rarity');
const REGION = require('./region');
const PASSIVE = require('./passive');
const { _sIdxs, _cDmgs } = require('./calculate');
const Card = require('./card');
const Utils = require('./utils');
const Hex64Byte = require('./hex64byte');
const PlayerState = require('./playerstate');


module.exports = (function () {

  function PaniniGameEngine() {
    this.cards = [];
    this.cards.push(new Card('empty'));//index.
  }

  PaniniGameEngine.PASSIVE = PASSIVE;
  PaniniGameEngine.REGION = REGION;
  PaniniGameEngine.RARITY = RARITY;

  function getCards(_herd) {
    var _cards = [];
    _cards[0] = _herd[0].toHex64Byte();
    _cards[1] = _herd[1].toHex64Byte();
    _cards[2] = _herd[2].toHex64Byte();
    _cards[3] = _herd[3].toHex64Byte();
    _cards[4] = _cards[0].add(_cards[1]).add(_cards[2]).add(_cards[3]);

    return _cards;
  }


  //FARKLAR:
  //1: herd(herd1,herd2)'ler card id hex degil. direk hayvan card objeleri.
  PaniniGameEngine.prototype.StartGame = function (herd1, herd2, _time) {
    var gameStates = [];//added for client side: events-state list for return.
    var regionBuffs = [];
    regionBuffs[0] = new Hex64Byte('0x0000000028500000000000000000281e0000000000000000001e00000000');
    regionBuffs[1] = new Hex64Byte('0x1e1e0000002800000000001e0000002800000000001e0000000000000000');
    regionBuffs[2] = new Hex64Byte('0x0000001e005a000000000000001e0028000000000000001e000000000000');
    regionBuffs[3] = new Hex64Byte('0x00000028000000500000000000280000001e0000000000000000001e0000');
    regionBuffs[4] = new Hex64Byte('0x002800500000000000000028001e0000000000000000001e000000000000');
    regionBuffs[5] = new Hex64Byte('0x5a0000000000000000003200000000000000000014000000000000000000');
    regionBuffs[6] = new Hex64Byte('0x000032003200002800000000000032000028000000000000320000000000');
    regionBuffs[7] = new Hex64Byte('0x00500000280000000000001e0000280000000000001e0000000000000000');

    //a0,s1,df2,wf3,wf4,df5,df6
    //calcData: [ap, sp, deffFactor, weightFactor1, weightFactor2]; ao, sp, deffFactor <-(for p1, p2)
    //damageFactor1, damageFactor2 
    //regionBuffs1, regionBuffs2 -> to to buffs. , + shiftedRegion , index
    var calcData = [];

    //player1 data
    //region -> p1Cards'da
    //buffs -> p1Cards'da 
    //5. index sum of 1-4
    var p1Cards = getCards(herd1);

    //player2 data
    //region -> p2Cards'da
    //buffs -> p2Cards'da
    //5. index sum of 1-4
    var p2Cards = getCards(herd2);


    var p1 = new PlayerState(
      new Hex64Byte(0), //damage
      p1Cards[0].rs(100).and(1048575),//defenderHp
      0, //uint256 defenderCardIndex
      _sIdxs(p1Cards),
      false//cardDeath
    );

    var p2 = new PlayerState(
      new Hex64Byte(0), //int256 damage;
      p2Cards[0].rs(100).and(1048575),//defenderHp
      0, //uint256 defenderCardIndex;      
      _sIdxs(p2Cards),
      false//cardDeath
    );

    calcData[11] = new Hex64Byte(4);
    calcData[12] = new Hex64Byte(4);
    var cDmgs = _cDmgs(calcData, regionBuffs,
      p1.defenderHp, p1Cards[0], p1Cards[4],
      p2.defenderHp, p2Cards[0], p2Cards[4]);
    p1.damage = cDmgs.p1Damage;
    p2.damage = cDmgs.p2Damage;

    //iki saldiri'da ayni anda yapilacak.
    //60 => 60 sec.(1min) 
    //   for(uint256 i = game.startTime; i < _time; i = i + 60) { //time lapse :2 sec, it will be change.
    for (var i = 0; i < 200; i++) { //time lapse :2 sec, it will be change.

      var gameState = {
        turn: i,
        player1State: {
          defenderIndex: p1.defenderCardIndex,
          defenderHp: p1.defenderHp.toNumber(),
          damage: p1.damage.toNumber(),
        },
        player2State: {
          defenderIndex: p2.defenderCardIndex,
          defenderHp: p2.defenderHp.toNumber(),
          damage: p2.damage.toNumber(),
        },
        events: []
      }
      //####################################
      //ATTACK P1-P2 AND DAMAGE DONE
      //####################################
      if (p1.defenderHp.lte(p2.damage)) {
        //Damage can'dan cok ise oldur.
        p1.defenderHp = new Hex64Byte(0); //defender'in olmesi durumunda defendirin oldurulmesi asagida yapilmakta.
        p1.cardDeath = true;
        calcData[11] = calcData[11].sub(1);

        gameState.events.push({
          type: 'defenderDied',
          message: 'Player-1 Defender died. Damage: ' + p2.damage.toNumber(),
          payload: {
            player: 1,
            damage: p2.damage.toNumber()
          }
        });
      } else {
        //damage can'dan az. uygula.
        p1.defenderHp = p1.defenderHp.sub(p2.damage);
        //eger heal + lifesteal yuzunden damage negatif ise. max hp'yi gecme
        if (p2.damage.lt(new Hex64Byte(0)) && p1.defenderHp.gt(p1Cards[p1.defenderCardIndex].rs(100).and(1048575))) {
          p1.defenderHp = p1Cards[p1.defenderCardIndex].rs(100).and(1048575);
        }

        gameState.events.push({
          type: 'damage',
          message: 'Player-1 takes damage. Damage: ' + p2.damage.toNumber(),
          payload: {
            player: 1,
            damage: p2.damage.toNumber()
          }
        });

      }
      //p2
      if (p2.defenderHp.lte(p1.damage)) {
        //Damage can'dan cok ise oldur.
        p2.defenderHp = new Hex64Byte(0); //defender'in olmesi durumunda defendirin oldurulmesi asagida yapilmakta.
        p2.cardDeath = true;
        calcData[12] = calcData[12].sub(1);
        gameState.events.push({
          type: 'defenderDied',
          message: 'Player-2 Defender died. Damage: ' + p1.damage.toNumber(),
          payload: {
            player: 2,
            damage: p1.damage.toNumber()
          }
        });

      } else {
        //damage can'dan az. uygula.
        p2.defenderHp = p2.defenderHp.sub(p1.damage);
        //eger heal + lifesteal yuzunden damage negatif ise. max hp'yi gecme
        if (p1.damage.lt(new Hex64Byte(0)) && p2.defenderHp.gt(p2Cards[p2.defenderCardIndex].rs(100).and(1048575))) {
          p2.defenderHp = p2Cards[p2.defenderCardIndex].rs(100).and(1048575);
        }

        gameState.events.push({
          type: 'damage',
          message: 'Player-2 takes damage. Damage: ' + p1.damage.toNumber(),
          payload: {
            player: 2,
            damage: p1.damage.toNumber()
          }
        });
      }

      //####################################
      //P1-P2 LIFE SPAN
      //####################################
      //buraya gelirken: defender olmus olabilir veya yasiyordur.
      //defender olmus ise?
      // not:  bu index hesaplama defender'dan sonra yapilmali?
      //p1 aktive life span deaths.
      if (p1Cards[p1.lifes[p1.lifes[4]]].and(1048575).lte(i)) {
        //olen defender mi?
        if (p1.lifes[p1.lifes[4]] == p1.defenderCardIndex) {
          p1.defenderHp = new Hex64Byte(0); //defender'in olmesi durumunda defendirin oldurulmesi asagida yapilmakta.
        } else {
          //kart'i oldur.
          p1Cards[p1.lifes[p1.lifes[4]]] = p1Cards[4].sub(p1Cards[p1.lifes[p1.lifes[4]]]);
          p1Cards[p1.lifes[p1.lifes[4]]] = new Hex64Byte(0);
        }
        gameState.events.push({
          type: 'life',
          message: 'Player-1 animal(' + p1.lifes[p1.lifes[4]] + ') died at age ' + i + '.',
          payload: {
            player: 1,
            cardIndex: p1.lifes[p1.lifes[4]]
          }
        });

        p1.lifes[4] += 1;
        p1.cardDeath = true;
        calcData[11] = calcData[11].sub(1);

      }
      //p2
      if (p2Cards[p2.lifes[p2.lifes[4]]].and(1048575).lte(i)) {
        if (p2.lifes[p2.lifes[4]] == p2.defenderCardIndex) {
          p2.defenderHp = new Hex64Byte(0);
        } else {
          p2Cards[p2.lifes[p2.lifes[4]]] = p2Cards[4].sub(p2Cards[p2.lifes[p2.lifes[4]]]);
          p2Cards[p2.lifes[p2.lifes[4]]] = new Hex64Byte(0);
        }

        gameState.events.push({
          type: 'life',
          message: 'Player-2 animal(' + p2.lifes[p2.lifes[4]] + ') died at age ' + i + '.',
          payload: {
            player: 2,
            cardIndex: p2.lifes[p2.lifes[4]]
          }
        });

        p2.lifes[4] += 1;
        p2.cardDeath = true;
        calcData[12] = calcData[12].sub(1);

      }

      //####################################
      //P1 DEFENDER DIED. SET NEXT DEFENDER
      //####################################
      if (p1.defenderHp.eq(new Hex64Byte(0))) {
        //DEFENDER'IN OLDURULMESI
        p1Cards[4] = p1Cards[4].sub(p1Cards[p1.defenderCardIndex]);
        p1Cards[p1.defenderCardIndex] = new Hex64Byte(0);
        //siradaki defender'a gec.
        p1.defenderCardIndex++;
        //life span ile olen defender'lari atla.
        //defender index bu if-else'de max 4 olmakta!
        //ONEMLI:defender index 4 olunca yasayan kart kalmadi demektir.
        if (p1.defenderCardIndex < 4 && p1Cards[p1.defenderCardIndex].rs(100).and(1048575).eq(new Hex64Byte(0))) {
          p1.defenderCardIndex++;
          if (p1.defenderCardIndex < 4 && p1Cards[p1.defenderCardIndex].rs(100).and(1048575).eq(new Hex64Byte(0))) {
            p1.defenderCardIndex++;
            if (p1.defenderCardIndex < 4 && p1Cards[p1.defenderCardIndex].rs(100).and(1048575).eq(new Hex64Byte(0))) {
              p1.defenderCardIndex++;
            }
          }
        }

        //DEFENDER INDEX 4 DEGIL ISE
        if (p1.defenderCardIndex < 4) {
          p1.defenderHp = p1Cards[p1.defenderCardIndex].rs(100).and(1048575);

          gameState.events.push({
            type: 'defender',
            message: 'Player-1 defender index : ' + p1.defenderCardIndex,
            payload: {
              player: 1,
              cardIndex: p1.defenderCardIndex
            }
          });
        }
      }

      //p2
      if (p2.defenderHp.eq(new Hex64Byte(0))) {
        p2Cards[4] = p2Cards[4].sub(p2Cards[p2.defenderCardIndex]);
        p2Cards[p2.defenderCardIndex] = 0;
        p2.defenderCardIndex++;
        if (p2.defenderCardIndex < 4 && p2Cards[p2.defenderCardIndex].rs(100).and(1048575).eq(new Hex64Byte(0))) {
          p2.defenderCardIndex++;
          if (p2.defenderCardIndex < 4 && p2Cards[p2.defenderCardIndex].rs(100).and(1048575).eq(new Hex64Byte(0))) {
            p2.defenderCardIndex++;
            if (p2.defenderCardIndex < 4 && p2Cards[p2.defenderCardIndex].rs(100).and(1048575).eq(new Hex64Byte(0))) {
              p2.defenderCardIndex++;
            }
          }
        }

        //DEFENDER INDEX 4 DEGIL ISE
        if (p2.defenderCardIndex < 4) {
          p2.defenderHp = p2Cards[p2.defenderCardIndex].rs(100).and(1048575);
          gameState.events.push({
            type: 'defender',
            message: 'Player-2 defender index : ' + p2.defenderCardIndex,
            payload: {
              player: 2,
              cardIndex: p2.defenderCardIndex
            }
          });

        }
      }


      //oyun devam ediyor ise
      if (p1.defenderCardIndex < 4 && p2.defenderCardIndex < 4) {

        //p1-p2 aktiveLifes index'i yenden set et.
        //buradan once lifes index 4 olabilir(son defender'i oldurdu.). ancak yukaridaki if'e giriyorsa son defender degildir.
        //bu durumda asagidan cikarken her zaman p2.aktiveLifes[4] < 4.
        if (p1.cardDeath && p1.lifes[p1.lifes[4]] < p1.defenderCardIndex) {
          p1.lifes[4] += 1;
          if (p1.lifes[p1.lifes[4]] < p1.defenderCardIndex) {
            p1.lifes[4] += 1;
            if (p1.lifes[p1.lifes[4]] < p1.defenderCardIndex) {
              p1.lifes[4] += 1;
            }
          }
        }
        if (p2.cardDeath && p2.lifes[p2.lifes[4]] < p2.defenderCardIndex) {
          p2.lifes[4] += 1;
          if (p2.lifes[p2.lifes[4]] < p2.defenderCardIndex) {
            p2.lifes[4] += 1;
            if (p2.lifes[p2.lifes[4]] < p2.defenderCardIndex) {
              p2.lifes[4] += 1;
            }
          }
        }


        //bir kart olduyse.
        //DAMAGE HESAPLA
        if (p1.cardDeath || p2.cardDeath) {

          cDmgs = _cDmgs(calcData, regionBuffs,
            p1.defenderHp, p1Cards[p1.defenderCardIndex], p1Cards[4],
            p2.defenderHp, p2Cards[p2.defenderCardIndex], p2Cards[4]);

          p1.damage = cDmgs.p1Damage;
          p2.damage = cDmgs.p2Damage;
          p1.cardDeath = false;
          p2.cardDeath = false;

          gameState.events.push({
            type: 'calculateDamages',
            message: 'Re calculated damages...',
            payload: {
              p1Damage: cDmgs.p1Damage.toNumber(),
              p2Damage: cDmgs.p2Damage.toNumber()
            }
          });
        }

        gameStates.push(gameState);
      }
      else {
        //kazanma kaybetme berabere durumlari
        if (p1.defenderCardIndex == 4 && p2.defenderCardIndex == 4) {
          //berabere
          gameState.events.push({
            type: 'finished',
            message: 'berabere',
            payload: 3
          });
          gameStates.push(gameState);
          return gameStates;
        } else if (p2.defenderCardIndex == 4) {
          //p1 winner
          gameState.events.push({
            type: 'finished',
            message: 'Player-1 won.',
            payload: 1
          });
          gameStates.push(gameState);
          return gameStates;
        }
        //p2 winner
        gameState.events.push({
          type: 'finished',
          message: 'Player-2 won.',
          payload: 2
        });
        gameStates.push(gameState);
        return gameStates;
      }

    }

    //p2 winner
    gameState.events.push({
      type: 'continue',
      message: 'the Game not finished yet.',
      payload: 0
    });
    return gameStates;
  }

  return PaniniGameEngine;
})();
const PaniniGameEngine = require('./engine');

module.exports = (function () {

  return PaniniGameEngine;
})();



/*


//{
//    card1, card2, card3, card4, card5, card6, card7, card8
//  }, {
//    card1, card2, card3, card4, card5, card6, card7, card8
//  } 
PaniniGameEngine.prototype.StartGame = function (herd1, herd2) {

  //player1 data
  //region -> p1ActiveCards'da
  //buffs -> p1PassiveCards'da 
  //5. index sum of 1-4
  var p1ActiveCards = [];
  p1ActiveCards[0] = this.cards[herd1.card1];
  p1ActiveCards[1] = this.cards[herd1.card2];
  p1ActiveCards[2] = this.cards[herd1.card3];
  p1ActiveCards[3] = this.cards[herd1.card4];
  p1ActiveCards[4] = _calculateSumOfCards(p1ActiveCards[0], p1ActiveCards[1], p1ActiveCards[2], p1ActiveCards[3]);
  //console.log(p1ActiveCards[4]);

  var p1PassiveCards = [];
  p1PassiveCards[0] = this.cards[herd1.card5];
  p1PassiveCards[1] = this.cards[herd1.card6];
  p1PassiveCards[2] = this.cards[herd1.card7];
  p1PassiveCards[3] = this.cards[herd1.card8];
  p1PassiveCards[4] = _calculateSumOfCards(p1PassiveCards[0], p1PassiveCards[1], p1PassiveCards[2], p1PassiveCards[3]);

  var p2ActiveCards = [];
  p2ActiveCards[0] = this.cards[herd2.card1];
  p2ActiveCards[1] = this.cards[herd2.card2];
  p2ActiveCards[2] = this.cards[herd2.card3];
  p2ActiveCards[3] = this.cards[herd2.card4];
  p2ActiveCards[4] = _calculateSumOfCards(p2ActiveCards[0], p2ActiveCards[1], p2ActiveCards[2], p2ActiveCards[3]);
  //console.log(p2ActiveCards[4]);

  var p2PassiveCards = [];
  p2PassiveCards[0] = this.cards[herd2.card5];
  p2PassiveCards[1] = this.cards[herd2.card6];
  p2PassiveCards[2] = this.cards[herd2.card7];
  p2PassiveCards[3] = this.cards[herd2.card8];
  p2PassiveCards[4] = _calculateSumOfCards(p2PassiveCards[0], p2PassiveCards[1], p2PassiveCards[2], p2PassiveCards[3]);

  var p1 = {
    deffFactor: 0, //uint256 deffFactor;
    damage: 0, //uint256 damage;
    defenderCardIndex: 0, //uint256 defenderCardIndex;
    defenderHp: p1ActiveCards[0].hp, //defenderHp
    ap: p1ActiveCards[4].ap,   //uint256 ap;
    sp: p1ActiveCards[4].speed,  //uint256 sp;
    deff: p1ActiveCards[4].deff,   //uint256 deff;
    weight: p1ActiveCards[4].weight,  //uint256 weight;
    aktiveCardDeath: false,
    passiveCardDeath: false
  };

  var p2 = {
    deffFactor: 0, //uint256 deffFactor;
    damage: 0, //uint256 damage;
    defenderCardIndex: 0, //uint256 defenderCardIndex;
    defenderHp: p2ActiveCards[0].hp, //defenderHp
    ap: p2ActiveCards[4].ap,   //uint256 ap;
    sp: p2ActiveCards[4].speed,  //uint256 sp;
    deff: p2ActiveCards[4].deff,   //uint256 deff;
    weight: p2ActiveCards[4].weight,  //uint256 weight;
    aktiveCardDeath: false,
    passiveCardDeath: false
  };

  //>>>> //NOT: hata var. cikarma tam tersi olmali.

  //buffs ap, dap, sp, dsp, deff, ddeff
  p1.ap += (p1ActiveCards[4].ap * (p1PassiveCards[4].passive4 - p2PassiveCards[4].passive3)) / 1000;
  p1.deff += (p1ActiveCards[4].deff * (p1PassiveCards[4].passive6 - p2PassiveCards[4].passive5)) / 1000;
  p1.sp += (p1ActiveCards[4].speed * (p1PassiveCards[4].passive8 - p2PassiveCards[4].passive7)) / 1000;

  //buffs ap, dap, sp, dsp, deff, ddeff
  p2.ap += (p2ActiveCards[4].ap * (p2PassiveCards[4].passive4 - p1PassiveCards[4].passive3)) / 1000;
  p2.deff += (p2ActiveCards[4].deff * (p2PassiveCards[4].passive6 - p1PassiveCards[4].passive5)) / 1000;
  p2.sp += (p2ActiveCards[4].speed * (p2PassiveCards[4].passive8 - p1PassiveCards[4].passive7)) / 1000;



  //damage calc.
  var weightFactor1 = _calculateWeightFactor(p1.weight, p2.weight);
  var weightFactor2 = _calculateWeightFactor(p2.weight, p1.weight);
  p1.deffFactor = _calculateDeffFactor(p1.deff);
  p2.deffFactor = _calculateDeffFactor(p2.deff);
  p1.damage = _calculateDamage(p1.ap, p1.sp, weightFactor1, p2.deffFactor)
    + (p2ActiveCards[0].hp * (p1PassiveCards[4].passive1 - p2PassiveCards[4].passive2)) / 1000; //+ heal poison. 
  p2.damage = _calculateDamage(p2.ap, p2.sp, weightFactor2, p1.deffFactor);
  + (p1ActiveCards[0].hp * (p2PassiveCards[4].passive1 - p1PassiveCards[4].passive2)) / 1000; //+ heal poison. 

  //buff9:lifesteal, buff10: reflect. calculation.
  //lifesteal = pEnemy.damage - damage*lifesteal
  //reflect = damage + pEnemy.damage*reflect

  //lifeSteal(p2'nin)
  if (p2PassiveCards[0].passive9 > 0) {
    p1.damage -= (p2.damage * p2ActiveCards[0].passive9) / 1000;
  }
  //damageReflection
  if (p1PassiveCards[0].passive10 > 0) {
    p1.damage += (p2.damage * p1ActiveCards[0].passive10) / 1000;
  }

  //lifeSteal(p2'nin)
  if (p1PassiveCards[0].passive9 > 0) {
    p2.damage -= (p1.damage * p1ActiveCards[0].passive9) / 1000;
  }
  //damageReflection
  if (p2PassiveCards[0].passive10 > 0) {
    p2.damage += (p1.damage * p2ActiveCards[0].passive10) / 1000;
  }

  console.log('-------');
  console.log('p1-p2');
  console.log('weightFactor1:' + weightFactor1);
  console.log('weightFactor2:' + weightFactor2);
  console.log('-------');
  console.log(p1);
  console.log('-------');
  console.log(p2);
  console.log('-------');

  //####
  //life span hesaplama.
  //####  
  var p1ALifes = _sortedIndexs(p1ActiveCards);
  var p1PLifes = _sortedIndexs(p1PassiveCards);
  var p2ALifes = _sortedIndexs(p2ActiveCards);
  var p2PLifes = _sortedIndexs(p2PassiveCards);

  for (var i = 1; i < 1000; i++) {
    //console.log('p1.damage' + p1.damage);
    //console.log('p2.damage' + p2.damage);

    //yasam suresi biten olursa oldur.
    console.log('----------------------------------------------------------');
    console.log('>>>>>  life of p1 aktiveCard-' + p1ALifes[p1ALifes[4]] + '(' + i + '/' + p1ActiveCards[p1ALifes[p1ALifes[4]]].lifespan + ')  defenderCardIndex:' + p1.defenderCardIndex + ' defenderHp: (' + p1.defenderHp + '/' + p1ActiveCards[p1.defenderCardIndex].hp + ')  damage: ' + p1.damage);
    console.log('>>>>>  life of p2 aktiveCard-' + p2ALifes[p2ALifes[4]] + '(' + i + '/' + p2ActiveCards[p2ALifes[p2ALifes[4]]].lifespan + ')  defenderCardIndex:' + p2.defenderCardIndex + ' defenderHp: (' + p2.defenderHp + '/' + p2ActiveCards[p2.defenderCardIndex].hp + ')  damage: ' + p2.damage);
    if (p1ActiveCards[p1ALifes[p1ALifes[4]]].lifespan <= i) {
      //olen defender mi?
      //bu turun sonunda oluyor aslinda(damagesini yapiyor.).
      if (p1ALifes[p1ALifes[4]] == p1.defenderCardIndex) {
        p1.defenderHp = 0;
      } else {
        p1ActiveCards[p1ALifes[p1ALifes[4]]] = _calculateSubOfCards(p1ActiveCards[4], p1ActiveCards[p1ALifes[p1ALifes[4]]]);
        p1ActiveCards[p1ALifes[p1ALifes[4]]] = this.killedCard(p1ActiveCards[p1ALifes[p1ALifes[4]]]);
      }
      p1ALifes[4] += 1;
      //sonraki kart eger savasta olmus kart ise tekrar tekrar damage hesaplmasin sonraki turlarda
      if (p1ALifes[p1ALifes[4]] < p1.defenderCardIndex) {
        p1ALifes[4] += 1
        if (p1ALifes[p1ALifes[4]] < p1.defenderCardIndex) {
          p1ALifes[4] += 1
        }
      }
      p1.aktiveCardDeath = true;
    }

    if (p2ActiveCards[p2ALifes[p2ALifes[4]]].lifespan <= i) {
      //olen defender mi?
      //bu turun sonunda oluyor aslinda(damagesini yapiyor.).
      if (p2ALifes[p2ALifes[4]] == p2.defenderCardIndex) {
        p2.defenderHp = 0;
      } else {
        p2ActiveCards[p2ALifes[p2ALifes[4]]] = _calculateSubOfCards(p2ActiveCards[4], p2ActiveCards[p2ALifes[p2ALifes[4]]]);
        p2ActiveCards[p2ALifes[p2ALifes[4]]] = this.killedCard(p2ActiveCards[p2ALifes[p2ALifes[4]]]);
      }

      p2ALifes[4] += 1;
      //sonraki kart eger savasta olmus kart ise tekrar tekrar damage hesaplmasin sonraki turlarda
      if (p2ALifes[p2ALifes[4]] < p2.defenderCardIndex) {
        p2ALifes[4] += 1
        if (p2ALifes[p2ALifes[4]] < p2.defenderCardIndex) {
          p2ALifes[4] += 1
        }
      }
      p2.aktiveCardDeath = true;
    }

    if (p1PLifes[4] < 4 && p1PassiveCards[p1PLifes[p1PLifes[4]]].lifespan <= i) {
      p1PLifes[4] += 1;
      p1PassiveCards[4] = _calculateSubOfCards(p1PassiveCards[4], p1PassiveCards[p1PLifes[p1PLifes[4]]]);
      p1.passiveCardDeath = true;
    }
    if (p2PLifes[4] < 4 && p2PassiveCards[p2PLifes[p2PLifes[4]]].lifespan <= i) {
      p2PLifes[4] += 1;
      p2PassiveCards[4] = _calculateSubOfCards(p2PassiveCards[4], p2PassiveCards[p2PLifes[p2PLifes[4]]]);
      p2.passiveCardDeath = true;
    }


    //saldiri.
    if (p1.defenderHp <= p2.damage) {
      //died.
      p1ActiveCards[4] = _calculateSubOfCards(p1ActiveCards[4], p1ActiveCards[p1.defenderCardIndex]);
      p1ActiveCards[p1.defenderCardIndex] = this.killedCard(p1ActiveCards[p1.defenderCardIndex]);

      //yasam suresi bitmemis ise arttir. //eger yasam suresi bitmisse zaten arttiramayacak.
      if (p1ALifes[p1ALifes[4]] == p1.defenderCardIndex) {
        p1ALifes[4] += 1;
        //sonraki kart eger savasta olmus kart ise tekrar tekrar damage hesaplmasin sonraki turlarda
        if (p1ALifes[p1ALifes[4]] < p1.defenderCardIndex) {
          p1ALifes[4] += 1
          if (p1ALifes[p1ALifes[4]] < p1.defenderCardIndex) {
            p1ALifes[4] += 1
          }
        }

      }

      p1.defenderHp = 0;
      p1.aktiveCardDeath = true;

    } else {
      p1.defenderHp -= p2.damage;
    }

    if (p2.defenderHp <= p1.damage) {
      //died.
      p2ActiveCards[4] = _calculateSubOfCards(p2ActiveCards[4], p2ActiveCards[p2.defenderCardIndex]);
      p2ActiveCards[p2.defenderCardIndex] = this.killedCard(p2ActiveCards[p2.defenderCardIndex]);

      //yasam suresi bitmemis ise arttir. //eger yasam suresi bitmisse zaten arttiramayacak.
      if (p2ALifes[p2ALifes[4]] == p2.defenderCardIndex) {
        p2ALifes[4] += 1;
        //sonraki kart eger savasta olmus kart ise tekrar tekrar damage hesaplmasin sonraki turlarda
        if (p2ALifes[p2ALifes[4]] < p2.defenderCardIndex) {
          p2ALifes[4] += 1
          if (p2ALifes[p2ALifes[4]] < p2.defenderCardIndex) {
            p2ALifes[4] += 1
          }
        }
      }

      p2.defenderHp = 0;
      p2.aktiveCardDeath = true;

    } else {
      p2.defenderHp -= p1.damage;
    }








    //if aktifCard died. Recalculate.
    //1. oyuncunun kartlari da olduyse. (ayni islemleri tekrarlamamak icin.)
    if (p1.aktiveCardDeath) {

      //defender olduyse yeni defendar belirle.
      if (p1.defenderHp == 0) {

        p1.defenderCardIndex++;
        //life span ile olenleri gec.
        if (p1.defenderCardIndex < 4 && p1ActiveCards[p1.defenderCardIndex].hp == 0) {
          p1.defenderCardIndex++;
          if (p1.defenderCardIndex < 4 && p1ActiveCards[p1.defenderCardIndex].hp == 0) {
            p1.defenderCardIndex++;
            if (p1.defenderCardIndex < 4 && p1ActiveCards[p1.defenderCardIndex].hp == 0) {
              p1.defenderCardIndex++;
            }
          }
        }
        p1.defenderHp = p1ActiveCards[p1.defenderCardIndex].hp; //defenderHp
      }

      // oyun hala devam ediyor ise hesapla.
      if (p1.defenderCardIndex < 4) {

        p1.ap = p1ActiveCards[4].ap;  //uint256 ap;
        p1.sp = p1ActiveCards[4].speed;   //uint256 sp;
        p1.deff = p1ActiveCards[4].deff;   //uint256 weight;
        p1.weight = p1ActiveCards[4].weight;   //uint256 deff;

        p1.deffFactor = _calculateDeffFactor(p1.deff);
      }

    }

    //if aktifCard died. Recalculate.
    //2. oyuncunun kartlari da olduyse. (ayni islemleri tekrarlamamak icin.)
    if (p2.aktiveCardDeath) {

      if (p2.defenderHp == 0) {

        p2.defenderCardIndex++;

        //life span ile olenleri gec.
        if (p2.defenderCardIndex < 4 && p2ActiveCards[p2.defenderCardIndex].hp == 0) {
          p2.defenderCardIndex++;
          if (p2.defenderCardIndex < 4 && p2ActiveCards[p2.defenderCardIndex].hp == 0) {
            p2.defenderCardIndex++;
            if (p2.defenderCardIndex < 4 && p2ActiveCards[p2.defenderCardIndex].hp == 0) {
              p2.defenderCardIndex++;
            }
          }
        }
        p2.defenderHp = p2ActiveCards[p2.defenderCardIndex].hp; //defenderHp
      }
      // oyun hala devam ediyor ise hesapla.
      if (p2.defenderCardIndex < 4) {

        p2.ap = p2ActiveCards[4].ap;  //uint256 ap;
        p2.sp = p2ActiveCards[4].speed;   //uint256 sp;
        p2.deff = p2ActiveCards[4].deff;   //uint256 weight;
        p2.weight = p2ActiveCards[4].weight;   //uint256 deff;

        p2.deffFactor = _calculateDeffFactor(p2.deff);
      }
    }

    //buraya kadar:
    //olen pasif kaldirildi
    //damage yapildi
    //siradaki aktif kart belirlendi(olen var ise)
    //ap,sp vs hesaplandi.
    //buradan sonrasi:
    //her hangi bir kart olduyse ve oyun devam ediyor ise;
    //buflari ekle.
    //damageleri hesapla.
    //

    // oyun hala devam ediyor ise hesapla.
    if (p1.defenderCardIndex < 4 && p2.defenderCardIndex < 4) {

      //bir kart olduyse.
      //DAMAGE HESAPLA
      if (p1.aktiveCardDeath || p2.aktiveCardDeath || p1.passiveCardDeath || p2.passiveCardDeath) {

        //buffs ap, dap, sp, dsp, deff, ddeff
        p1.ap += (p1ActiveCards[p1.defenderCardIndex].ap * (p1PassiveCards[4].passive4 - p2PassiveCards[4].passive3)) / 1000;
        p1.deff += (p1ActiveCards[p1.defenderCardIndex].deff * (p1PassiveCards[4].passive6 - p2PassiveCards[4].passive5)) / 1000;
        p1.sp += (p1ActiveCards[p1.defenderCardIndex].speed * (p1PassiveCards[4].passive8 - p2PassiveCards[4].passive7)) / 1000;

        //buffs ap, dap, sp, dsp, deff, ddeff
        p2.ap += (p2ActiveCards[p2.defenderCardIndex].ap * (p2PassiveCards[4].passive4 - p1PassiveCards[4].passive3)) / 1000;
        p2.deff += (p2ActiveCards[p2.defenderCardIndex].deff * (p2PassiveCards[4].passive6 - p1PassiveCards[4].passive5)) / 1000;
        p2.sp += (p2ActiveCards[p2.defenderCardIndex].speed * (p2PassiveCards[4].passive8 - p1PassiveCards[4].passive7)) / 1000;

        weightFactor1 = _calculateWeightFactor(p1.weight, p2.weight);
        weightFactor2 = _calculateWeightFactor(p2.weight, p1.weight);
        p1.damage = _calculateDamage(p1.ap, p1.sp, weightFactor1, p2.deffFactor)
          + (p1ActiveCards[p1.defenderCardIndex].hp * (p2PassiveCards[4].passive2 - p1PassiveCards[4].passive1)) / 1000;//heal poison
        p2.damage = _calculateDamage(p2.ap, p2.sp, weightFactor2, p1.deffFactor)
          + (p2ActiveCards[p2.defenderCardIndex].hp * (p1PassiveCards[4].passive2 - p2PassiveCards[4].passive1)) / 1000;//heal poison

        //buff9:lifesteal, buff10: reflect. calculation.
        //lifesteal = pEnemy.damage - damage*lifesteal
        //reflect = damage + pEnemy.damage*reflect
        //lifeSteal
        if (p1PassiveCards[p1.defenderCardIndex].passive9 > 0) {
          p2.damage -= (p1.damage * p1ActiveCards[p1.defenderCardIndex].passive9) / 1000;
        }
        if (p1PassiveCards[p1.defenderCardIndex].passive10 > 0) {
          p1.damage += (p2.damage * p2ActiveCards[p1.defenderCardIndex].passive10) / 1000;
        }

        //damageReflection
        if (p2PassiveCards[p2.defenderCardIndex].passive9 > 0) {
          p1.damage -= (p2.damage * p1ActiveCards[p2.defenderCardIndex].passive9) / 1000;
        }
        if (p2PassiveCards[p2.defenderCardIndex].passive10 > 0) {
          p2.damage += (p1.damage * p2ActiveCards[p2.defenderCardIndex].passive10) / 1000;
        }

        p1.aktiveCardDeath = false;
        p1.passiveCardDeath = false;

        p2.aktiveCardDeath = false;
        p2.passiveCardDeath = false;
      }

    }
    //kazanma kaybetme berabere durumlari
    //berabere
    else if (p2.defenderCardIndex == 4) {
      console.log('----------------------------------------------------------');
      console.log('>>>>>  life of p1 aktiveCard-' + p1ALifes[p1ALifes[4]] + '(' + i + '/' + p1ActiveCards[p1ALifes[p1ALifes[4]]].lifespan + ')  defenderCardIndex:' + p1.defenderCardIndex + ' defenderHp: (' + p1.defenderHp + '/' + p1ActiveCards[p1.defenderCardIndex].hp + ')  damage: ' + p1.damage);
      console.log('>>>>>  life of p2 aktiveCard-' + p2ALifes[p2ALifes[4]] + '(' + i + '/' + p2ActiveCards[p2ALifes[p2ALifes[4]]].lifespan + ')  defenderCardIndex:' + p2.defenderCardIndex + ' defenderHp: (' + p2.defenderHp + '/' + p2ActiveCards[p2.defenderCardIndex].hp + ')  damage: ' + p2.damage);
      console.log('The winner: player-1!');
      return 1;
      //p2 winner
    } else if (p1.defenderCardIndex == 4) {
      console.log('----------------------------------------------------------');
      console.log('>>>>>  life of p1 aktiveCard-' + p1ALifes[p1ALifes[4]] + '(' + i + '/' + p1ActiveCards[p1ALifes[p1ALifes[4]]].lifespan + ')  defenderCardIndex:' + p1.defenderCardIndex + ' defenderHp: (' + p1.defenderHp + '/' + p1ActiveCards[p1.defenderCardIndex].hp + ')  damage: ' + p1.damage);
      console.log('>>>>>  life of p2 aktiveCard-' + p2ALifes[p2ALifes[4]] + '(' + i + '/' + p2ActiveCards[p2ALifes[p2ALifes[4]]].lifespan + ')  defenderCardIndex:' + p2.defenderCardIndex + ' defenderHp: (' + p2.defenderHp + '/' + p2ActiveCards[p2.defenderCardIndex].hp + ')  damage: ' + p2.damage); return 2;
      console.log('The winner: player-2!');
    } else {
      console.log('----------------------------------------------------------');
      console.log('>>>>>  life of p1 aktiveCard-' + p1ALifes[p1ALifes[4]] + '(' + i + '/' + p1ActiveCards[p1ALifes[p1ALifes[4]]].lifespan + ')  defenderCardIndex:' + p1.defenderCardIndex + ' defenderHp: (' + p1.defenderHp + '/' + p1ActiveCards[p1.defenderCardIndex].hp + ')  damage: ' + p1.damage);
      console.log('>>>>>  life of p2 aktiveCard-' + p2ALifes[p2ALifes[4]] + '(' + i + '/' + p2ActiveCards[p2ALifes[p2ALifes[4]]].lifespan + ')  defenderCardIndex:' + p2.defenderCardIndex + ' defenderHp: (' + p2.defenderHp + '/' + p2ActiveCards[p2.defenderCardIndex].hp + ')  damage: ' + p2.damage);
      console.log('Draw!');
      return 3;
    }
  }//end of loop
  return 0;
}

*/
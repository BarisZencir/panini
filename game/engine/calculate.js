const Hex64Byte = require('./hex64byte');

module.exports = (function () {


  function _sIdxs(_arr) {
    //_arr : a,b,c,d
    var indexs = [];//4->temp. + index when using.
    if (_arr[0].and(1048575).lt(_arr[1].and(1048575))) {
      indexs[0] = 0;
      indexs[1] = 1;
    } else {
      indexs[0] = 1;
      indexs[1] = 0;
    }//[x,y] x<y (z = min(a,b), t = max(a,b) )

    if (_arr[2].and(1048575).lt(_arr[3].and(1048575))) {
      indexs[2] = 2;
      indexs[3] = 3;
    } else {
      indexs[2] = 3;
      indexs[3] = 2;
    }//[z,t] z<t (z = min(c,d), t = max(c,d) )

    //son case.
    //not://y<z =< x,y,z,t //bisey yapmaya gerek yok.

    //t<x => z<t < x<y
    if (_arr[indexs[3]].and(1048575).lt(_arr[indexs[0]].and(1048575))) {
      indexs[4] = indexs[0];//temp
      indexs[0] = indexs[2];
      indexs[2] = indexs[4];
      indexs[4] = indexs[1];//temp
      indexs[1] = indexs[3];
      indexs[3] = indexs[4];
    }
    //z<x => z,x,y,t | z,x,t,y (her zaman z<y)
    else if (_arr[indexs[2]].and(1048575).lt(_arr[indexs[0]].and(1048575))) {

      //t<y => z,x,t,y
      if (_arr[indexs[3]].and(1048575).lt(_arr[indexs[1]].and(1048575))) {
        indexs[4] = indexs[0];//temp
        indexs[0] = indexs[2];//z
        indexs[2] = indexs[4];//t
        indexs[3] = indexs[1];//y
        indexs[1] = indexs[4];//x
      } else {//z,x,y,t
        indexs[4] = indexs[0];//temp
        indexs[0] = indexs[2];//z
        indexs[2] = indexs[1];//y
        indexs[1] = indexs[4];//x
        //t already there.
      }
    }
    //(herzaman x < (z,t))
    // t<y => x<z<t<y
    else if (_arr[indexs[3]].and(1048575).lt(_arr[indexs[1]].and(1048575))) {
      indexs[4] = indexs[1];//temp
      indexs[1] = indexs[2];
      indexs[2] = indexs[3];
      indexs[3] = indexs[4];
    }
    //y<t => x<z<y<t | 
    else if (_arr[indexs[2]].and(1048575).lt(_arr[indexs[1]].and(1048575))) {
      indexs[4] = indexs[1];//temp
      indexs[1] = indexs[2];
      indexs[2] = indexs[4];
    }
    //else x<y<z<t
    indexs[4] = 0; //index of start.
    return indexs;
  }
  //returns 800 - 1200  : 1k = 1.
  //weightRate : w1/w2 ->p1, w2/w1 ->p2
  function _cWF(_weightRate) {
    //kusurat icin *1000    
    if (_weightRate.lte(50)) {
      return _weightRate.mul(2).add(900);
    } else if (_weightRate.lte(150)) {
      return _weightRate.add(950);
    }
    return new Hex64Byte(1100);
  }

  function _cWFs(_weight1, _weight2) {
    return {
      wf1: _cWF(_weight1.mul(100).idiv(_weight2.add(1))),
      wf2: _cWF(_weight2.mul(100).idiv(_weight1.add(1))),
    };
  }

  // 0-9000(for %0-90).
  function _cDefF(_deff) {
    //kusurat icin *1000    
    if (_deff.lte(0)) {
      return new Hex64Byte(1);
    } else if (_deff.lte(250)) {
      return _deff.mul(10);
    } else if (_deff.lte(500)) {
      return _deff.mul(8).add(500);
    } else if (_deff.lte(1000)) {
      return _deff.mul(5).add(2000);
    } else if (_deff.lte(2000)) {
      return _deff.mul(2).add(5000);
    }
    return new Hex64Byte(9000);
  }

  //0-600
  //600-
  function _cSpF(_sp) {
    //kusurat icin *1000    
    if (_sp.lte(60)) {
      return _sp.mul(10);//10-600
    } else if (_sp.lte(120)) {
      return _sp.mul(6).add(240);//600-960
    } else if (_sp.lte(180)) {
      return _sp.mul(2).add(720);//960-1080
    }
    return _sp.add(900);
  }

  //0-600
  //600-
  function _cApF(_ap) {
    //kusurat icin *1000    
    if (_ap.lte(100)) {
      return _ap.mul(10);//10-1000
    } else if (_ap.lte(200)) {
      return _ap.mul(7).add(300);//1000-1700
    } else if (_ap.lte(400)) {
      return _ap.mul(4).add(900);//1700-2500
    }
    return _ap.mul(2).add(1700);//2500++
  }

  //ap: ~400
  //sp: ~250
  //wf: ~1000
  //(ap*sp*wf) : ~10^8
  //df: ~10000(max) : normalde 5000 civaridir.
  // 10^8 / (5k*60*?)
  //(dk*5xAp*5xSp) :(5000*60*k = 3*10^5) : 3*10^5... k = 19 
  function _cDamF(_ap, _sp, _wf, _df, _lives) {
    return (_cApF(_ap.add(50)).mul(_cSpF(_sp.add(30))).mul(_wf).mul((new Hex64Byte(18000).sub(_df)))).idiv((new Hex64Byte("60000000000")).mul(_lives));//(600);
  }


  function _cApSpBfs(_cards, _buffs, _enemyBuffs) {
    return {
      apSpBf1: _cards.rs(80).and(1048575).add(
        _cards.rs(80).and(1048575).mul(
          _buffs.rs(168).and(255).sub(_enemyBuffs.rs(176).and(255))
        ).idiv(1000)
      ),

      apSpBf2: _cards.rs(40).and(1048575).add(
        _cards.rs(40).and(1048575).mul(
          _buffs.rs(136).and(255).sub(_enemyBuffs.rs(144).and(255))
        ).idiv(1000)
      )
    }
  }

  function _cDeffFBfs(_cards, _buffs, _enemyBuffs) {
    //p1 deffFactor
    return _cDefF(
      _cards.rs(60).and(1048575).add(
        _cards.rs(60).and(1048575).mul(
          _buffs.rs(152).and(255).sub(_enemyBuffs.rs(160).and(255))
        ).idiv(1000)
      )
    );
  }

  function _cRBfs(_c, regionBuffs, _card) {
    _c[8] = new Hex64Byte(0);
    _c[9] = _card.rs(200);
    for (var i = 0; i < 8; i++) {
      _c[10] = _c[9].and(15);
      if (_c[10].gt(1)) {//2,3,4 icin
        _c[8] = _c[8].add(regionBuffs[i].rs(_c[10].sub(2).mul(80)));
      }
      _c[9] = _c[9].rs(4);
    }
    _c[8] = _c[8].and('1208925819614629174706175').ls(120);
  }
  //a0,s1,df2,wf3,wf4,df5,df6
  //calcData: [ap, sp, deffFactor, weightFactor1, weightFactor2]; ao, sp, deffFactor <-(for p1, p2)
  //damageFactor1, damageFactor2 
  //calcs: damages, lifesteal,damagareflect, heal, poison. -> to just a single damage.
  function _cDmgs(_c, regionBuffs,
    _p1DefenderHp, _p1Defender, _p1Cards,
    _p2DefenderHp, _p2Defender, _p2Cards) {
    //calc buffs with region buff.
    //_c[7] -> p1 buffs
    //_c[8] -> p2 buffs
    _cRBfs(_c, regionBuffs, _p1Cards);
    _c[7] = _p1Cards.add(_c[8]);
    _cRBfs(_c, regionBuffs, _p2Cards);
    _c[8] = _c[8].add(_p2Cards);
    //p1,p2 weight factors   
    var cWFs = _cWFs(_p1Cards.rs(20).and(1048575), _p2Cards.rs(20).and(1048575));
    _c[3] = cWFs.wf1;
    _c[4] = cWFs.wf2;

    //## p1:damage factor(calcData5)
    //ap, sp -> p1
    var cApSpBfs = _cApSpBfs(_p1Cards, _c[7], _c[8]);
    _c[0] = cApSpBfs.apSpBf1;
    _c[1] = cApSpBfs.apSpBf2;

    //deffFactor -> p2
    _c[2] = _cDeffFBfs(_p2Cards, _c[8], _c[7]);
    _c[5] = _cDamF(_c[0], _c[1], _c[3], _c[2], _c[11]);

    //## p2:damage factor(calcData6)
    //ap, sp -> p2
    cApSpBfs = _cApSpBfs(_p2Cards, _c[8], _c[7]);
    _c[0] = cApSpBfs.apSpBf1;
    _c[1] = cApSpBfs.apSpBf2;

    //deffFactor -> p1
    _c[2] = _cDeffFBfs(_p1Cards, _c[7], _c[8]);
    _c[6] = _cDamF(_c[0], _c[1], _c[4], _c[2], _c[12]);
    //passive1,2,9,10 /p1,p2

    return {
      //p1 heal+poison: p1damage += p2Hp*(p1.poison - p2.heal)(rakibin hp'si uzerinden kendi poisonunu ekle, rakibin heal'ini cikar. )
      //p1 lifeSteal: p1damage -= (p2.damage*p2Cards[0].passive9)/1000;(rakibin lifesteal'ini kendi damagesinden cikart.)
      //p1 damage reflection: p1damage += (p2.damage*p1Cards[0].passive10)/1000; (rakibin damagesini kendi passif dam.reflectionu ile kendi damagesine ekle.)
      p1Damage:
        _c[5].add(
          (_p2DefenderHp.mul(_p1Cards.rs(192).and(255)).sub(_p2Cards.rs(184).and(255))
            //burasi toplanabilir sonra.
            .sub(_p2Defender.rs(128).and(255).mul(_c[6]))
            .add(_p1Defender.rs(120).and(255).mul(_c[6]))
          ).idiv(1000)),

      //p2 heal+poison: p2damage += p1Hp*(p2.poison - p1.heal)(rakibin hp'si uzerinden kendi poisonunu ekle, rakibin heal'ini cikar. )
      //p2 lifeSteal: p2damage -= (p1.damage*p1Cards[0].passive9)/1000;(rakibin lifesteal'ini kendi damagesinden cikart.)
      //p2 damage reflection: p2damage += (p1.damage*p2Cards[0].passive10)/1000; (rakibin damagesini kendi passif dam.reflectionu ile kendi damagesine ekle.)
      p2Damage:
        _c[6].add(
          (_p1DefenderHp.mul(_p2Cards.rs(192).and(255)).sub(_p1Cards.rs(184).and(255))
            //burasi toplanabilir sonra.
            .sub(_p1Defender.rs(128).and(255).mul(_c[5]))
            .add(_p2Defender.rs(120).and(255).mul(_c[5]))
          ).idiv(1000)),

    }
  }

  return {
    _sIdxs,
    _cDmgs
  }
})();

module.exports = (function () {

  function _sortIndexs(arr) {
    //arr : a,b,c,d
    var indexs = [];//4->temp. + index when using.
    if (arr[0].lifespan < arr[1].lifespan) {
      indexs[0] = 0;
      indexs[1] = 1;
    } else {
      indexs[0] = 1;
      indexs[1] = 0;
    }//[x,y] x<y (z = min(a,b), t = max(a,b) )

    if (arr[2].lifespan < arr[3].lifespan) {
      indexs[2] = 2;
      indexs[3] = 3;
    } else {
      indexs[2] = 3;
      indexs[3] = 2;
    }//[z,t] z<t (z = min(c,d), t = max(c,d) )

    //son case.
    //not://y<z =< x,y,z,t //bisey yapmaya gerek yok.

    //t<x => z<t < x<y
    if (arr[indexs[3]].lifespan < arr[indexs[0]].lifespan) {
      indexs[4] = indexs[0];//temp
      indexs[0] = indexs[2];
      indexs[2] = indexs[4];
      indexs[4] = indexs[1];//temp
      indexs[1] = indexs[3];
      indexs[3] = indexs[4];
    }
    //z<x => z,x,y,t | z,x,t,y (her zaman z<y)
    else if (arr[indexs[2]].lifespan < arr[indexs[0]].lifespan) {
      //t<y => z,x,t,y
      if (arr[indexs[3]].lifespan < arr[indexs[1]].lifespan) {
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
    else if (arr[indexs[3]].lifespan < arr[indexs[1]].lifespan) {
      indexs[4] = indexs[1];//temp
      indexs[1] = indexs[2];
      indexs[2] = indexs[3];
      indexs[3] = indexs[4];
    }
    //y<t => x<z<y<t | 
    else if (arr[indexs[2]].lifespan < arr[indexs[1]].lifespan) {
      indexs[4] = indexs[1];//temp
      indexs[1] = indexs[2];
      indexs[2] = indexs[4];
    }
    //else x<y<z<t
    indexs[4] = 0; //index of start.
    return indexs;
  }


  function toHex(decimal, size) {
    var res = parseInt('' + decimal).toString(16);
    var n = res.length;
    for (var i = 0; i < size - n; i++) { res = '0' + res; }
    return res;
  }


  //hp, ap, deff, speed, weight, lifespan, 
  //  passive, passivePercent, region, rarity
  function toHex64Card(cardBase) {
    var res = ''
      + toHex(cardBase.rarity, 1)
      + toHex(cardBase.region1, 1)
      + toHex(cardBase.region2, 1)
      + toHex(cardBase.region3, 1)
      + toHex(cardBase.region4, 1)
      + toHex(cardBase.region5, 1)
      + toHex(cardBase.region6, 1)
      + toHex(cardBase.region7, 1)
      + toHex(cardBase.region8, 1)
      + toHex(cardBase.passive1, 2)
      + toHex(cardBase.passive2, 2)
      + toHex(cardBase.passive3, 2)
      + toHex(cardBase.passive4, 2)
      + toHex(cardBase.passive5, 2)
      + toHex(cardBase.passive6, 2)
      + toHex(cardBase.passive7, 2)
      + toHex(cardBase.passive8, 2)
      + toHex(cardBase.passive9, 2)
      + toHex(cardBase.passive10, 2)
      + toHex(cardBase.hp, 5)
      + toHex(cardBase.ap, 5)
      + toHex(cardBase.deff, 5)
      + toHex(cardBase.speed, 5)
      + toHex(cardBase.weight, 5)
      + toHex(cardBase.lifespan, 5);
    return '0x' + res;
  }


  function fromHex64Card(hex64) {
    var obj = {};
    var n = hex64.length - 1;
    var k = 0;

    var elem = '';

    //features
    for (var i = 0; i < 5; i++) { elem = hex64[n - k] + elem; k++; }
    obj.lifespan = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex64[n - k] + elem; k++; }
    obj.weight = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex64[n - k] + elem; k++; }
    obj.speed = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex64[n - k] + elem; k++; }
    obj.deff = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex64[n - k] + elem; k++; }
    obj.ap = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 5; i++) { elem = hex64[n - k] + elem; k++; }
    obj.hp = parseInt(elem, 16); elem = '';
    //passive
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive10 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive9 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive8 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive7 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive6 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive5 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive4 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive3 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive2 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 2; i++) { elem = hex64[n - k] + elem; k++; }
    obj.passive1 = parseInt(elem, 16); elem = '';
    //region
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region8 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region7 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region6 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region5 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region4 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region3 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region2 = parseInt(elem, 16); elem = '';
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.region1 = parseInt(elem, 16); elem = '';
    //rarity
    for (var i = 0; i < 1; i++) { elem = hex64[n - k] + elem; k++; }
    obj.rarity = parseInt(elem, 16); elem = '';

    //sirasini tekrar saglamak icin(objenin.)
    return {
      rarity: obj.rarity,
      region1: obj.region1,
      region2: obj.region2,
      region3: obj.region3,
      region4: obj.region4,
      region5: obj.region5,
      region6: obj.region6,
      region7: obj.region7,
      region8: obj.region8,
      passive1: obj.passive1,
      passive2: obj.passive2,
      passive3: obj.passive3,
      passive4: obj.passive4,
      passive5: obj.passive5,
      passive6: obj.passive6,
      passive7: obj.passive7,
      passive8: obj.passive8,
      passive9: obj.passive9,
      passive10: obj.passive10,
      hp: obj.hp,
      ap: obj.ap,
      deff: obj.deff,
      speed: obj.speed,
      weight: obj.weight,
      lifespan: obj.lifespan
    }
  }


  return {
    _sortIndexs: _sortIndexs,
    toHex: toHex,
    toHex64Card: toHex64Card,
    fromHex64Card: fromHex64Card
  }
})();
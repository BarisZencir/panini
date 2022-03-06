const express = require('express')
const path = require("path");
var bodyParser = require('body-parser');
var GameData = require('./game/gamedata');
var PaniniGameEngine = require('./game/engine');

const app = express();
const port = process.env.PORT || 3000;

async function initialize() {
  await GameData.methods.initBaseCards();
  var cards = GameData.data.baseCards;
  console.log(cards);
}

initialize().then(() => {
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });


  app.get('/api/regionBuffs', function (req, res) {
    console.log('/api/regionBuffs');
    var regionBuffList = [
      //NOURTH_AMERICA
      {
        name: "NOURTH_AMERICA",
        buffs: [
          "DEFENSE_BUFF: 30",
          "DEFENSE_DEBUFF: 40",
          "DEFENSE_BUFF: 50"
        ]
      },
      //SOUTH_AMERICA
      {
        name: "SOUTH_AMERICA",
        buffs: [
          "HEAL_BUFF: 30",
          "DEFENSE_BUFF: 40",
          "POISON: 30"
        ]
      },
      //EUROPA
      {
        name: "EUROPA",
        buffs: [
          "ATTACK_BUFF: 30",
          "DEFENSE_BUFF: 40",
          "DEFENSE_BUFF: 50"
        ]
      },

      //AFRICA
      {
        name: "AFRICA",
        buffs: [
          "SPEED_BUFF: 30",
          "ATTACK_BUFF: 40",
          "SPEED_BUFF: 50"
        ]
      },
      //ASIA
      {
        name: "ASIA",
        buffs: [
          "ATTACK_BUFF: 30",
          "HEAL_BUFF: 40",
          "ATTACK_BUFF: 50"
        ]
      },
      //AUSTRALIA
      {
        name: "AUSTRALIA",
        buffs: [
          "POISON: 20",
          "POISON: 30",
          "POISON: 40"
        ]
      },
      //ANTARCTICA
      {
        name: "ANTARCTICA",
        buffs: [
          "DEFENSE_DEBUFF: 50",
          "SPEED_BUFF: 40",
          "ATTACK_DEBUFF: 50"
        ]
      },
      //OCEAN
      {
        name: "OCEAN",
        buffs: [
          "HEAL_BUFF: 30",
          "DEFENSE_DEBUFF: 40",
          "HEAL_BUFF: 50"
        ]
      }];

    res.json({
      regionBuffs: regionBuffList
    });
  });

  app.get('/api/animals', function (req, res) {
    console.log('/api/animals');
    var animalList = GameData.data.baseCards.map(card => card.toJSON());
    res.json({
      animals: animalList
    });
  });
  app.post('/api/calculateGame', function (req, res) {
    console.log('/api/calculateGame');

    var herd1 = req.body.herd1;
    var herd2 = req.body.herd2;

    var engine = new PaniniGameEngine();

    var gameStates = engine.StartGame(
      [
        GameData.data.baseCards[herd1[0]],
        GameData.data.baseCards[herd1[1]],
        GameData.data.baseCards[herd1[2]],
        GameData.data.baseCards[herd1[3]]
      ],
      [
        GameData.data.baseCards[herd2[0]],
        GameData.data.baseCards[herd2[1]],
        GameData.data.baseCards[herd2[2]],
        GameData.data.baseCards[herd2[3]]
      ]
    );

    res.json(gameStates);

    // for (var i = 0; i < gameStates.length; i++) {
    //   var gameState = gameStates[i];
    //   console.log('################################################');
    //   console.log('--------------------------------');
    //   console.log('turn : ' + (gameState.turn + 1));
    //   console.log('--------------------------------');
    //   console.log('player-1 : Defender('
    //     + gameState.player1State.defenderIndex
    //     + ') hp: ' + gameState.player1State.defenderHp
    //     + ' damage: ' + gameState.player1State.damage);
    //   console.log('player-2 : Defender('
    //     + gameState.player2State.defenderIndex
    //     + ') hp: ' + gameState.player2State.defenderHp
    //     + ' damage: ' + gameState.player2State.damage);
    //   console.log('--------------------------------');
    //   console.log('Events:');
    //   console.log('--------------------------------');
    //   var events = gameState.events;
    //   for (var j = 0; j < events.length; j++) {
    //     var event = events[j];
    //     console.log('  ' + event.type + ' >> ' + event.message);
    //   }
    //   console.log('--------------------------------');
    // }

  });

  app.get('/PaniniTest', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

  app.get('/metamaskTest', function (req, res) {
    res.sendFile(path.join(__dirname + '/metamask/index.html'));
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}).catch((error) => {
  console.log(error);
});

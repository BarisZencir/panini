module.exports = (function () {
  function PlayerState(damage, defenderHp, defenderCardIndex, lifes, cardDeath) {
    this.damage = damage;
    this.defenderHp = defenderHp;
    this.defenderCardIndex = defenderCardIndex;
    this.lifes = lifes;
    this.cardDeath = cardDeath;
  }

  return PlayerState;
})();
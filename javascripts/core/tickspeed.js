function canBuyTickSpeed() {
  if (player.currentEternityChall == "eterc9") return false
  return canBuyDimension(3);
}

function getTickSpeedMultiplier() {
  if (player.currentChallenge == "postc3" || isIC3Trapped()) return 1;
  if (inQC(2)) return 0.89
  var realnormalgalaxies = player.galaxies
  if (player.masterystudies) realnormalgalaxies = Math.max(player.galaxies-player.quantum.electrons.sacGals,0)
  if (realnormalgalaxies + player.replicanti.galaxies + player.dilation.freeGalaxies < 3) {
      let baseMultiplier = 0.9;
      if (GUBought("rg4")) realnormalgalaxies *= 0.4
      if (realnormalgalaxies == 0) baseMultiplier = 0.89
      if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.93;
      let perGalaxy = 0.02;
      let galaxies = realnormalgalaxies+player.replicanti.galaxies+Math.floor(player.dilation.freeGalaxies)
      if (player.timestudy.studies.includes(133)) galaxies += player.replicanti.galaxies/2
      if (player.timestudy.studies.includes(132)) galaxies += player.replicanti.galaxies*0.4
      if (player.boughtdims) galaxies += player.replicanti.galaxies*(Math.log10(player.replicanti.limit.log(2))/Math.log10(2)/10-1)
      galaxies += extraReplGalaxies
      galaxies += Math.min(player.replicanti.galaxies, player.replicanti.gal) * Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10()+1), 0.03 * ECTimesCompleted("eterc8"))-1, 0)
      if (player.infinityUpgrades.includes("galaxyBoost")) perGalaxy *= 2;
      if (player.infinityUpgrades.includes("postGalaxy")) perGalaxy *= 1.5;
      if (player.challenges.includes("postc5")) perGalaxy *= 1.1;
      if (player.achievements.includes("r86")) perGalaxy *= 1.01;
      if (player.achievements.includes("ngpp8")) perGalaxy *= 1.001;
      if (player.timestudy.studies.includes(212)) perGalaxy *= Math.min(Math.pow(player.timeShards.max(2).log2(), 0.005), 1.1)
      perGalaxy *= colorBoosts.r
      if (GUBought("rg2")) perGalaxy *= Math.pow(player.dilation.freeGalaxies/5e3+1,0.25)
      if (GUBought("rg4")) perGalaxy *= 1.5

      return Math.max(baseMultiplier-(realnormalgalaxies*perGalaxy),0.83);
  } else {
      let baseMultiplier = 0.8
      if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.83
      let perGalaxy = 0.965
      if (GUBought("rg4")) realnormalgalaxies *= 0.4
      let galaxies = realnormalgalaxies-2+player.replicanti.galaxies+Math.floor(player.dilation.freeGalaxies)
      if (player.timestudy.studies.includes(133)) galaxies += player.replicanti.galaxies/2
      if (player.timestudy.studies.includes(132)) galaxies += player.replicanti.galaxies*0.4
      galaxies += extraReplGalaxies
      galaxies += Math.min(player.replicanti.galaxies, player.replicanti.gal) * Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10()+1), 0.03 * ECTimesCompleted("eterc8"))-1, 0)
      if (player.infinityUpgrades.includes("galaxyBoost")) galaxies *= 2;
      if (player.infinityUpgrades.includes("postGalaxy")) galaxies *= 1.5;
      if (player.challenges.includes("postc5")) galaxies *= 1.1;
      if (player.achievements.includes("r86")) galaxies *= 1.01
      if (player.achievements.includes("ngpp8")) galaxies *= 1.001;
      if (player.timestudy.studies.includes(212)) galaxies *= Math.min(Math.pow(player.timeShards.max(2).log2(), 0.005), 1.1)
      if (player.timestudy.studies.includes(232)) galaxies *= Math.pow(1+realnormalgalaxies/1000, 0.2)
      galaxies *= colorBoosts.r
      if (GUBought("rg2")) galaxies *= Math.pow(player.dilation.freeGalaxies/3e3+1,0.25)
      if (GUBought("rg4")) galaxies *= 1.5

      return Decimal.pow(perGalaxy, galaxies - 2).times(baseMultiplier)
  }
}

function buyTickSpeed() {
  if (!canBuyTickSpeed()) {
      return false;
  }

  if (!canAfford(player.tickSpeedCost)) {
      return false;
  }

  player.money = player.money.minus(player.tickSpeedCost);
  if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
  else multiplySameCosts(player.tickSpeedCost)
  if (player.tickSpeedCost.gte(Number.MAX_VALUE)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(player.tickSpeedMultDecrease);
  if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
  player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier());
  if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(getPostC3RewardMult())
  postc8Mult = new Decimal(1)
  player.why = player.why + 1
  return true;
}

document.getElementById("tickSpeed").onclick = function () {
  buyTickSpeed();

  updateTickSpeed();
};

function buyMaxPostInfTickSpeed (mult) {
	var a = Math.log10(Math.sqrt(player.tickSpeedMultDecrease))
	var b = player.tickspeedMultiplier.dividedBy(Math.sqrt(player.tickSpeedMultDecrease)).log10()
	var c = player.tickSpeedCost.dividedBy(player.money).log10()
	var discriminant = Math.pow(b, 2) - (c *a* 4)
	if (discriminant < 0) return false
	var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
	if (buying <= 0) return false
	player.tickspeed = player.tickspeed.times(Decimal.pow(mult, buying));
	if (player.challenges.includes("postc3") || player.currentChallenge == "postc3") player.postC3Reward = player.postC3Reward.times(Decimal.pow(1.05+(player.galaxies*0.005), buying))
	player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier.pow(buying-1)).times(Decimal.pow(player.tickSpeedMultDecrease, (buying-1)*(buying-2)/2))
	player.tickspeedMultiplier = player.tickspeedMultiplier.times(Decimal.pow(player.tickSpeedMultDecrease, buying-1))
	if (player.money.gte(player.tickSpeedCost)) player.money = player.money.minus(player.tickSpeedCost)
	player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
	player.tickspeedMultiplier = player.tickspeedMultiplier.times(player.tickSpeedMultDecrease)
}

function cannotUsePostInfTickSpeed () {
	return player.currentChallenge == "challenge5" || player.currentChallenge == "postc5" || player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease > 2;
}

function buyMaxTickSpeed() {
	if (!canBuyTickSpeed()) return false
	var mult = getTickSpeedMultiplier()
	if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (cannotUsePostInfTickSpeed()) {
		while (player.money.gt(player.tickSpeedCost) && (player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease > 2 || player.currentChallenge == "postc5")) {
			player.money = player.money.minus(player.tickSpeedCost);
			if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
			else multiplySameCosts(player.tickSpeedCost)
			if (player.tickSpeedCost.gte(Number.MAX_VALUE)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(player.tickSpeedMultDecrease);
			player.tickspeed = player.tickspeed.times(mult);
			if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(1.05+(player.galaxies*0.005))
			postc8Mult = new Decimal(1)
			if (!cannotUsePostInfTickSpeed()) buyMaxPostInfTickSpeed(mult);
		}
	} else {
		buyMaxPostInfTickSpeed(mult);
	}

	updateTickSpeed()
}


function updateTickSpeed() {
    var exp = player.tickspeed.e;
    if (exp > 1) document.getElementById("tickSpeedAmount").innerHTML = 'Tickspeed: ' + player.tickspeed.toFixed(0);
    else {
        document.getElementById("tickSpeedAmount").innerHTML = 'Tickspeed: ' + Math.min(player.tickspeed.m * 100, 999).toFixed(0) + ' / ' + shorten(Decimal.pow(10,2 - exp));
    }
}
function canBuyTickSpeed() {
  if (player.currentEternityChall == "eterc9") return false
  if (player.galacticSacrifice) if (player.currentChallenge=="challenge14"&&player.tickBoughtThisInf.current>307) return false
  return canBuyDimension(3);
}

function getGalaxyPower(ng, bi) {
	let replGalPower = player.replicanti.galaxies
	if (player.timestudy.studies.includes(133)) replGalPower += player.replicanti.galaxies/2
	if (player.timestudy.studies.includes(132)) replGalPower += player.replicanti.galaxies*0.4
	if (player.boughtdims) replGalPower += player.replicanti.galaxies*(Math.log10(player.replicanti.limit.log(2))/Math.log10(2)/10-1)
	replGalPower += extraReplGalaxies
	replGalPower += Math.min(player.replicanti.galaxies, player.replicanti.gal)*Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10()+1), 0.03 * ECTimesCompleted("eterc8"))-1, 0)

	let galaxyPower = Math.max(ng-(bi?2:0),0)+replGalPower+Math.floor(player.dilation.freeGalaxies)
	if ((player.currentChallenge=="challenge7"||inQC(4))&&player.galacticSacrifice) galaxyPower *= galaxyPower
	return galaxyPower
}

function getGalaxyPowerEff(ng, bi) {
	let eff = 1
	if (player.galacticSacrifice) if (player.galacticSacrifice.upgrades.includes(22)) eff *= 5;
	if (player.infinityUpgrades.includes("galaxyBoost")) eff *= 2;
	if (player.infinityUpgrades.includes("postGalaxy")) eff *= player.galacticSacrifice ? 1.7 : 1.5;
	if (player.challenges.includes("postc5")) eff *= player.galacticSacrifice ? 1.3 : 1.1;
	if (player.achievements.includes("r86")) eff *= player.galacticSacrifice ? 1.05 : 1.01
	if (player.galacticSacrifice) {
		if (player.achievements.includes("r83")) eff *= 1.05
		if (player.achievements.includes("r45")) eff *= 1.02
	}
	if (player.achievements.includes("ngpp8")) eff *= 1.001;
	if (player.timestudy.studies.includes(212)) eff *= Math.min(Math.pow(player.timeShards.max(2).log2(), 0.005), 1.1)
	if (player.timestudy.studies.includes(232)&&bi) eff *= Math.pow(1+ng/1000, 0.2)
	eff *= colorBoosts.r
	if (GUBought("rg2")) eff *= Math.pow(player.dilation.freeGalaxies/5e3+1,0.25)
	if (GUBought("rg4")) eff *= 1.5
	return eff
}

function getTickSpeedMultiplier() {
  if (player.currentChallenge == "postc3" || isIC3Trapped()) return 1;
  if (inQC(2)) return 0.89
  var realnormalgalaxies = player.galaxies
  if (player.masterystudies) realnormalgalaxies = Math.max(player.galaxies-player.quantum.electrons.sacGals,0)
  if (player.galacticSacrifice) {
      if (GUBought("rg4")) realnormalgalaxies *= 0.4
      return Decimal.pow(0.998, getGalaxyPower(realnormalgalaxies) * getGalaxyPowerEff())
  } else if (realnormalgalaxies + player.replicanti.galaxies + player.dilation.freeGalaxies < 3) {
      if (GUBought("rg4")) realnormalgalaxies *= 0.4
      let baseMultiplier = 0.9;
      if (realnormalgalaxies == 0) baseMultiplier = 0.89
      if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.93;
      let perGalaxy = 0.02;
      perGalaxy *= getGalaxyPowerEff()

      return Math.max(baseMultiplier-(realnormalgalaxies*perGalaxy),0.83);
  } else {
      if (GUBought("rg4")) realnormalgalaxies *= 0.4
      let baseMultiplier = 0.8
      if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.83
      let perGalaxy = 0.965
      let galaxies = getGalaxyPower(realnormalgalaxies) * getGalaxyPowerEff(realnormalgalaxies, true)
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
  if (player.tickSpeedCost.gte(Number.MAX_VALUE)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(inQC(7)?Number.MAX_VALUE:player.tickSpeedMultDecrease);
  if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
  player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier());
  if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(getPostC3RewardMult())
  player.postC8Mult = new Decimal(1)
  if (player.currentChallenge=="challenge14") player.tickBoughtThisInf.current++
  player.why = player.why + 1
  return true;
}

document.getElementById("tickSpeed").onclick = function () {
  buyTickSpeed();

  updateTickSpeed();
};

function buyMaxPostInfTickSpeed (mult) {
	var mi = inQC(7)?Number.MAX_VALUE:player.tickSpeedMultDecrease
	var a = Math.log10(Math.sqrt(mi))
	var b = player.tickspeedMultiplier.dividedBy(Math.sqrt(mi)).log10()
	var c = player.tickSpeedCost.dividedBy(player.money).log10()
	var discriminant = Math.pow(b, 2) - (c *a* 4)
	if (discriminant < 0) return false
	var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
	if (buying <= 0) return false
	player.tickspeed = player.tickspeed.times(Decimal.pow(mult, buying));
	if (player.challenges.includes("postc3") || player.currentChallenge == "postc3") player.postC3Reward = player.postC3Reward.times(Decimal.pow(getPostC3RewardMult(), buying))
	player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier.pow(buying-1)).times(Decimal.pow(mi, (buying-1)*(buying-2)/2))
	player.tickspeedMultiplier = player.tickspeedMultiplier.times(Decimal.pow(mi, buying-1))
	if (player.money.gte(player.tickSpeedCost)) player.money = player.money.minus(player.tickSpeedCost)
	player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
	player.tickspeedMultiplier = player.tickspeedMultiplier.times(mi)
	player.postC8Mult = new Decimal(1)
}

function cannotUsePostInfTickSpeed () {
	return player.currentChallenge == "challenge5" || player.currentChallenge == "postc5" || player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease > 2;
}

function buyMaxTickSpeed() {
	if (player.currentChallenge == "challenge14") return false
	if (!canBuyTickSpeed()) return false
	var mult = getTickSpeedMultiplier()
	if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (cannotUsePostInfTickSpeed()) {
		while (player.money.gt(player.tickSpeedCost) && (player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease > 2 || player.currentChallenge == "postc5")) {
			player.money = player.money.minus(player.tickSpeedCost);
			if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
			else multiplySameCosts(player.tickSpeedCost)
			if (player.tickSpeedCost.gte(Number.MAX_VALUE)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(inQC(7)?Number.MAX_VALUE:player.tickSpeedMultDecrease);
			player.tickspeed = player.tickspeed.times(mult);
			if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(getPostC3RewardMult())
			player.postC8Mult = new Decimal(1)
			if (!cannotUsePostInfTickSpeed()) buyMaxPostInfTickSpeed(mult);
		}
	} else {
		buyMaxPostInfTickSpeed(mult);
	}

	updateTickSpeed()
}


function updateTickSpeed() {
	var showTickspeed = Decimal.lt(player.tickspeed, 1e3) || (player.currentChallenge != "postc3" && !isIC3Trapped())
	var label = ""
	if (showTickspeed) {
		var exp = player.tickspeed.e;
		if (exp > 1) label = 'Tickspeed: ' + player.tickspeed.toFixed(0)
		else label = 'Tickspeed: ' + Math.min(player.tickspeed.m * 100, 999).toFixed(0) + ' / ' + shorten(Decimal.pow(10,2 - exp))
	}
	if (player.galacticSacrifice || player.currentChallenge == "postc3" || isIC3Trapped()) label = (showTickspeed ? label + ", Tickspeed m" : "M") + "ultiplier: " + formatValue(player.options.notation, player.postC3Reward, 2, 3)
	if (player.galacticSacrifice && player.currentChallenge == "challenge14") {
		label += "<br>You have "+(308-player.tickBoughtThisInf.current)+" tickspeed purchases left."
		document.getElementById("tickSpeedAmount").innerHTML = label
	} else document.getElementById("tickSpeedAmount").textContent = label
}
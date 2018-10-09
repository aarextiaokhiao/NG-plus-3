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

	let replGalEff = Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10()+1), 0.03 * ECTimesCompleted("eterc8")), 1)
	let replGalStrength
	let replGalStrengthPow = 0
	if (player.masterystudies) if (player.masterystudies.includes("t342")) replGalStrengthPow = getMTSMult(342)
	if (replGalStrengthPow > 0) replGalStrength = Math.min(player.replicanti.galaxies, player.replicanti.gal) * (1 - replGalStrengthPow) + replGalPower * replGalStrengthPow
	else replGalStrength = Math.min(player.replicanti.galaxies, player.replicanti.gal)
	replGalPower += replGalStrength * (replGalEff - 1)

	let freeGalPower = Math.floor(player.dilation.freeGalaxies)
	let freeReplGalStrength = 0
	if (player.masterystudies) if (player.masterystudies.includes("t343")) freeReplGalStrength = getMTSMult(343)
	if (freeReplGalStrength > 0) freeGalPower *= replGalEff * freeReplGalStrength + 1 - freeReplGalStrength

	let galaxyPower = Math.max(ng-(bi?2:0),0)+replGalPower+freeGalPower
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
	if (player.masterystudies) if (player.masterystudies.includes("t344")) eff *= getMTSMult(344)
	return eff
}

function getTickSpeedMultiplier() {
	let realnormalgalaxies = player.galaxies
	if (player.masterystudies) realnormalgalaxies = Math.max(player.galaxies-player.quantum.electrons.sacGals,0)
	if (player.currentChallenge == "postc3" || isIC3Trapped()) {
		if (player.currentChallenge=="postcngmm_3" || player.challenges.includes("postcngmm_3")) {
			if (GUBought("rg4")) realnormalgalaxies *= 0.4
			return Decimal.pow(0.998, getGalaxyPower(realnormalgalaxies) * getGalaxyPowerEff(realnormalgalaxies, true))
		}
		return 1;
	}
	if (inQC(2)) return 0.89
	let inERS = !(!player.boughtDims)
	let galaxies
	let baseMultiplier
	let useLinear
	let linearGalaxies
	if (inERS) {
		if (GUBought("rg4")) realnormalgalaxies *= 0.4
		galaxies = getGalaxyPower(realnormalgalaxies) * getGalaxyPowerEff(realnormalgalaxies, true)
		linearGalaxies = Math.min(galaxies,5)
		useLinear = true
	} else {
		linearGalaxies = 2
		useLinear = realnormalgalaxies + player.replicanti.galaxies + player.dilation.freeGalaxies < 3
	}
	if (useLinear) {
		if (GUBought("rg4")) realnormalgalaxies *= 0.4
		baseMultiplier = 0.9;
		if (inERS && galaxies == 0) baseMultiplier = 0.89
		else if (realnormalgalaxies == 0) baseMultiplier = 0.89
		if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.93;
		if (inERS) {
			baseMultiplier -= linearGalaxies*0.02
		} else {
			let perGalaxy = 0.02 * getGalaxyPowerEff()
			return Math.max(baseMultiplier-realnormalgalaxies*perGalaxy,0.83);
		}
	}
	if (!inERS) {
		baseMultiplier = 0.8
		if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.83
		if (GUBought("rg4")) realnormalgalaxies *= 0.4
		galaxies = getGalaxyPower(realnormalgalaxies) * getGalaxyPowerEff(realnormalgalaxies, true)
	}
	let perGalaxy = 0.965
	return Decimal.pow(perGalaxy, galaxies-linearGalaxies).times(baseMultiplier)
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
  if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(getTickSpeedCostMultiplierIncrease());
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

function getTickSpeedCostMultiplierIncrease() {
  if (inQC(7)) return Number.MAX_VALUE
  let ret = player.tickSpeedMultDecrease;
  if (player.currentChallenge === 'postcngmm_2') {
    ret = Math.pow(ret, .5);
  } else if (player.challenges.includes('postcngmm_2')) {
    ret = Math.pow(ret, .9);
    ret = Math.pow(ret, 1 / (1 + Math.pow(player.galaxies, 0.7) / 10));
  }
  return ret;
}

function buyMaxPostInfTickSpeed (mult) {
	var mi = getTickSpeedCostMultiplierIncrease()
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
	return player.currentChallenge == "challenge5" || player.currentChallenge == "postc5" || !costIncreaseActive(player.tickSpeedCost) || player.tickSpeedMultDecrease > 2;
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
			if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(getTickSpeedCostMultiplierIncrease());
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
function getTickSpeedMultiplier() {
	let ret = E(getGalaxyTickSpeedMultiplier())
	if (tmp.be && beSave.upgrades.includes(5)) ret = ret.div(getBreakUpgMult(5))
	if (inNC(6, 2)) ret = ret.add(player.resets * 1e-3)
	return ret.min(1)
}

function initialGalaxies() {
	let g = player.galaxies
	if (tmp.ngp3 && !tmp.be) {
		g = Math.max(g-quSave.electrons.sacGals, 0)
		g *= Math.max(Math.min(10 - (quSave.electrons.amount + g * getElectronGainFinalMult()) / 16857, 1), 0)
		if (hasBU(14)) g = Math.max(Math.min(player.galaxies, tmp.blu[14]), g)
	}
	if (tmp.rg4) g *= 0.4
	if ((inNC(15) || player.currentChallenge == "postc1") && tmp.ngmX==3) g = 0
	return g
}

function getGalaxyPower(ng, bi, noDil) {
	let replGalEff = 1
	if (player.boughtDims) replGalEff = Math.log10(player.replicanti.limit.log(2)) / Math.log10(2)/10
	else if (ECComps("eterc8") > 0) replGalEff = getECReward(8)
	if (tmp.ngp3 && player.masterystudies.includes("t344")) replGalEff *= getMTSMult(344)
	
	let extraReplGalPower = 0
	if (player.timestudy.studies.includes(133)) extraReplGalPower += player.replicanti.galaxies * 0.5
	if (player.timestudy.studies.includes(132)) extraReplGalPower += player.replicanti.galaxies * 0.4
	extraReplGalPower += extraReplGalaxies // extraReplGalaxies is a constant
	
	let otherGalPower = player.replicanti.galaxies
	if (player.masterystudies ? player.masterystudies.includes("t342") : false) otherGalPower = (otherGalPower + extraReplGalPower) * replGalEff
	else otherGalPower += Math.min(player.replicanti.galaxies, player.replicanti.gal) * (replGalEff - 1) + extraReplGalPower
	if (!noDil) {
		let dilGals = Math.floor(player.dilation.freeGalaxies)
		otherGalPower += dilGals * ((player.masterystudies ? player.masterystudies.includes("t343") : false) ? replGalEff : 1)
	}
	otherGalPower += tmp.effAeg

	let galaxyPower = ng
	if (!tmp.be) galaxyPower = Math.max(ng - (bi ? 2 : 0), 0) + otherGalPower
	if ((inNC(7) || inQC(4) ) && inNGM(2)) galaxyPower *= galaxyPower
	return galaxyPower
}

function getGalaxyEff(bi) {
	let eff = 1
	if (inNC(6, 2)) eff *= 1.5
	if (inNGM(2)) if (hasGalUpg(22)) eff *= inNGM(4)?2:5;
	if (player.infinityUpgrades.includes("galaxyBoost")) eff *= 2;
	if (player.infinityUpgrades.includes("postGalaxy")) eff *= getPostGalaxyEff();
	if (player.challenges.includes("postc5")) eff *= inNGM(2) ? 1.15 : 1.1;
	if (hasAch("r86")) eff *= inNGM(2) ? 1.05 : 1.01
	if (inNGM(2)) {
		if (hasAch("r83")) eff *= 1.05
		if (hasAch("r45")) eff *= 1.02
		if (player.infinityUpgrades.includes("postinfi51")) eff *= inNGM(3) ? 1.15 : 1.2
		if (tmp.cp && hasAch("r67")) {
			let x = tmp.cp
			if (x < 0) x = 1
			if (x > 4 && inNGM(3)) x = Math.sqrt(x - 1) + 2
			eff += .07 * x
		}
	}
	if (inNGM(3) && (inNC(5) || player.currentChallenge == "postcngm3_3")) eff *= 0.75
	if (hasAch("ngpp8") && player.meta != undefined) eff *= 1.001;
	if (player.timestudy.studies.includes(212)) eff *= tsMults[212]()
	if (player.timestudy.studies.includes(232) && bi) eff *= tmp.ts232

	if (aarMod.nguspV !== undefined && player.dilation.active) eff *= exDilationBenefit() + 1
	if (tmp.ngp3) eff *= colorBoosts.r
	if (GUBought("rg2")) eff *= Math.pow(player.dilation.freeGalaxies/5e3 + 1, 0.25)
	if (tmp.rg4) eff *= 1.5
	if (hasBU(34)) eff *= tmp.blu[34]
	return eff
}

function getPostGalaxyEff() {
	let ret = inNGM(3) ? 1.1 : inNGM(2) ? 1.7 : 1.5
	if (aarMod.ngexV && !player.challenges.includes("postc5")) ret -= 0.05
	return ret
}

function getGalaxyTickSpeedMultiplier() {
	let g = initialGalaxies()
	if ((player.currentChallenge == "postc3" || isIC3Trapped()) && !tmp.be) {
		if (player.currentChallenge == "postcngmm_3" || player.challenges.includes("postcngmm_3")) {
			var base = inNGM(3) ? 0.9995 : 0.998
			if (inNGM(4) && player.challenges.includes("postcngmm_3")) base = .9998
			return E_pow(base, getGalaxyPower(g) * getGalaxyEff(true))
		}
		return 1
	}
	if (inQC(2)) return 0.89
	let inRS = player.boughtDims != undefined
	let galaxies = getGalaxyPower(g, !inRS) * getGalaxyEff(true)
	let baseMultiplier = 0.8
	let linearGalaxies = 2
	if (inNC(6, 1) && aarMod.ngexV) linearGalaxies += 2
	let useLinear = g + player.replicanti.galaxies + player.dilation.freeGalaxies <= linearGalaxies
	if (inNC(6, 1) || player.currentChallenge == "postc1") baseMultiplier = 0.83
	if (inRS) {
		linearGalaxies = Math.min(galaxies, linearGalaxies + 3)
		useLinear = true
	}
	if (useLinear) {
		baseMultiplier = 0.9;
		if (inRS && galaxies == 0) baseMultiplier = 0.89
		else if (g == 0) baseMultiplier = 0.89
		if (inNC(6, 1) || player.currentChallenge == "postc1") baseMultiplier = 0.93
		if (inRS) {
			baseMultiplier -= linearGalaxies * 0.02
		} else {
			let perGalaxy = 0.02 * getGalaxyEff()
			return Math.max(baseMultiplier - (g * perGalaxy), 0.83)
		}
	}

	var log = Math.log10(0.965) * (galaxies-linearGalaxies) + Math.log10(baseMultiplier)
	if (log < 0) log = -softcap(-log, "ts_reduce_log")
	return pow10(log)
}

function getPostC3Mult() {
	let base = getPostC3Base()
	let exp = getPostC3Exp()
	if (exp > 1) return E_pow(base,exp)
	return base
}

function getPostC3Base() {
	if (player.currentChallenge=="postcngmm_3") return 1
	let perGalaxy = 0.005;
	if (inNGM(3)) perGalaxy = 0.002
	if (inQC(2)) perGalaxy = 0
	if (tmp.ngp3 ? brSave.active : false) {
		if (ghostified && ghSave.neutrinos.boosts>8) perGalaxy *= tmp.nb[9]
		if (hasNU(12)) perGalaxy *= tmp.nu[4].free
	}
	if (inNGM(2)) return player.galaxies * perGalaxy + 1.05
	if (tmp.cp > 1) {
		if (inNGM(3)) perGalaxy *= tmp.cp / 10 + .9
		else perGalaxy *= tmp.cp / 5 + .8
	}
	var g=initialGalaxies()
	perGalaxy *= getGalaxyEff()
	let ret = getGalaxyPower(g) * perGalaxy + 1.05
	if (inNC(6, 1) || player.currentChallenge == "postc1") ret -= inNGM(4) ? 0.02 : 0.05
	else if (tmp.ngmX==3) ret -= 0.03
	if (tmp.be && ret > 1e8) ret = Math.pow(Math.log10(ret) + 2, 8)
	return ret
}

function getPostC3Exp() {
	let x = 1
	if (inNGM(2)) {
		let g = getGalaxyPower(0, false, true)
		if (g < 7) return 1 + g / 5
		let y = 5
		let z = .5
		if (tmp.ec > 29) {
			if (player.currentEternityChall == "" || player.currentEternityChall == "eterc12") {
				z = .9
				if (tmp.ec > 53) y = 1.4 - ((tmp.ec - 54) / 15)
				else if (tmp.ec > 42) y = 2
				else if (tmp.ec > 37) y = 3.5
			} else z = .6
		}
		x = 2 + Math.pow(g - 5, z) / y
	}
	return x
}

function canBuyTickSpeed() {
	if (player.currentEternityChall == "eterc9") return false
	if (inOnlyNGM(2) && inNC(14) && player.tickBoughtThisInf.current > 307) return false
	return canBuyDimension(3);
}

function buyTickSpeed() {
	if (!canBuyTickSpeed()) return false
	if (player.tickSpeedCost.gt(player.money)) return false
	if (!quantumed) player.money = player.money.minus(player.tickSpeedCost)
	if ((!inNC(5) && player.currentChallenge != "postc5") || inNGM(3)) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
	else multiplySameCosts(player.tickSpeedCost)
	if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(getTickSpeedCostMultiplierIncrease())
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (!tmp.be) {
		player.tickspeed = player.tickspeed.times(tmp.tsReduce)
		if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(getPostC3Mult())
	}
	player.postC8Mult = E(1)
	if (inNC(14) && !inNGM(3)) player.tickBoughtThisInf.current++
	player.why = player.why + 1
	tmp.tickUpdate = true
	return true
}

el("tickSpeed").onclick = function () {
	buyTickSpeed()
};

function getTickSpeedCostMultiplierIncrease() {
	if (inQC(7)) return Number.MAX_VALUE
	let ret = player.tickSpeedMultDecrease;
	let exp = .9 - .02 * ECComps("eterc11")
	if (player.currentChallenge === 'postcngmm_2') ret = Math.pow(ret, .5)
	else if (player.challenges.includes('postcngmm_2')) {
		var galeff = (1 + Math.pow(player.galaxies, 0.7) / 10)
		if (inNGM(4)) galeff = Math.pow(galeff, .2)
		ret = Math.pow(ret, exp / galeff)
	}
	return ret
}

function buyMaxPostInfTickSpeed(mult) {
	var mi = getTickSpeedCostMultiplierIncrease()
	var a = Math.log10(Math.sqrt(mi))
	var b = player.tickspeedMultiplier.dividedBy(Math.sqrt(mi)).log10()
	var c = player.tickSpeedCost.dividedBy(player.money).log10()
	var discriminant = Math.pow(b, 2) - (c * a * 4)
	if (discriminant < 0) return false
	var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
	if (buying <= 0) return false
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (!tmp.be || player.currentEternityChall == "eterc10") {
		player.tickspeed = player.tickspeed.times(E_pow(mult, buying));
		if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(E_pow(getPostC3Mult(), buying))
	}
	player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier.pow(buying-1)).times(E_pow(mi, (buying-1)*(buying-2)/2))
	player.tickspeedMultiplier = player.tickspeedMultiplier.times(E_pow(mi, buying-1))
	if (!quantum){
		if (player.money.gte(player.tickSpeedCost)) player.money = player.money.minus(player.tickSpeedCost)
		else if (player.tickSpeedMultDecrease > 2) player.money = E(0)
	}
	player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
	player.tickspeedMultiplier = player.tickspeedMultiplier.times(mi)
	player.postC8Mult = E(1)
}

function cannotUsePostInfTickSpeed() {
	return ((inNC(5) || player.currentChallenge == "postc5") && !inNGM(3)) || !costIncreaseActive(player.tickSpeedCost) || (player.tickSpeedMultDecrease > 2 && player.tickspeedMultiplier.lt(Number.MAX_SAFE_INTEGER));
}

function buyMaxTickSpeed() {
	if (inNC(14) && !inNGM(3)) return false
	if (!canBuyTickSpeed()) return false
	if (player.tickSpeedCost.gt(player.money)) return false
	let cost = player.tickSpeedCost
	if (((!inNC(5) && player.currentChallenge != "postc5") || inNGM(3)) && !inNC(9) && !costIncreaseActive(player.tickSpeedCost)) {
		let max = Number.POSITIVE_INFINITY
		if (!inNC(10) && player.currentChallenge != "postc1") max = Math.ceil(Decimal.div(Number.MAX_VALUE, cost).log(10))
		var toBuy = Math.min(Math.floor(player.money.div(cost).times(9).add(1).log(10)), max)
		getOrSubResource(1, pow10(toBuy).sub(1).div(9).times(cost))
		if (!tmp.be || player.currentEternityChall == "eterc10") {
			player.tickspeed = E_pow(tmp.tsReduce, toBuy).times(player.tickspeed)
			if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(E_pow(getPostC3Mult(), toBuy))
		}
		player.tickSpeedCost = player.tickSpeedCost.times(pow10(toBuy))
		player.postC8Mult = E(1)
		if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(getTickSpeedCostMultiplierIncrease())
	}
	var mult = tmp.tsReduce
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (cannotUsePostInfTickSpeed()) {
		while (player.money.gt(player.tickSpeedCost) && (player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease > 2 || (player.currentChallenge == "postc5" && !inNGM(3)))) {
			player.money = player.money.minus(player.tickSpeedCost);
			if (!inNC(5) && player.currentChallenge != "postc5") player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
			else multiplySameCosts(player.tickSpeedCost)
			if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(getTickSpeedCostMultiplierIncrease())
			if (!tmp.be || player.currentEternityChall == "eterc10") {
				player.tickspeed = player.tickspeed.times(mult);
				if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.times(getPostC3Mult())
			}
			player.postC8Mult = E(1)
			if (!cannotUsePostInfTickSpeed()) buyMaxPostInfTickSpeed(mult);
		}
	} else {
		buyMaxPostInfTickSpeed(mult);
	}

	tmp.tickUpdate = true
}

function getTickspeed() {
	var log = -player.tickspeed.log10()
	if (tmp.ngp3) log = softcap(log, "working_ts")
	tick = pow10(-log)
	return tick
}

function updateTickspeed() {
	var showTickspeed = player.tickspeed.lt(1e3) || (player.currentChallenge != "postc3" && !isIC3Trapped()) || player.currentChallenge == "postcngmm_3" || (player.challenges.includes("postcngmm_3") && !inNGM(3)) || tmp.be
	var label = ""
	if (showTickspeed) {
		var tickspeed = getTickspeed()
		var exp = tickspeed.e;
		if (isNaN(exp)) label = 'Tickspeed: Infinite'
		else if (exp > 1) label = 'Tickspeed: ' + tickspeed.toFixed(0)
		else {
			var expExp = Math.max(Math.min(Math.ceil(15 - Math.log10(2 - exp)), 3), 0)
			if (expExp == 0) label = 'Tickspeed: ' + shortenCosts(Decimal.div(1000, tickspeed)) + "/s"
			else label = 'Tickspeed: ' + Math.min(tickspeed.m * Math.pow(10, expExp - 1), Math.pow(10, expExp) - 1).toFixed(0) + ' / ' + shortenCosts(pow10(2 - exp))
		}
	}
	if (player.galacticSacrifice || player.currentChallenge == "postc3" || isIC3Trapped()) label = (showTickspeed ? label + ", Tickspeed m" : "M") + "ultiplier: " + formatValue(player.options.notation, player.postC3Reward, 2, 3)
	if (gameSpeed != 1) label += ", Game speed: " + (gameSpeed < 1 ? shorten(1 / gameSpeed) + "x slower" : shorten(tmp.gameSpeed) + "x faster")
	if (inOnlyNGM(2) && inNC(14)) {
		label += "<br>You have "+(308-player.tickBoughtThisInf.current)+" tickspeed purchases left."
		el("tickSpeedAmount").innerHTML = label
	} else el("tickSpeedAmount").textContent = label
}

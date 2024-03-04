function getTickSpeedMultiplier() {
	let ret = E(getGalaxyTickSpeedMultiplier())
	if (isBreakUpgActive(5)) ret = ret.div(tmp.qu.beu[5])
	return ret.min(1)
}

function getGalaxyTickSpeedMultiplier() {
	let galPow = getGalaxyPower() * tmp.gal.str
	if (inQC(2)) return 0.89

	let gal = tmp.gal.init
	if ((player.currentChallenge == "postc3" || isIC3Trapped()) && !tmp.qu.be) {
		if (player.currentChallenge == "postcngmm_3" || player.challenges.includes("postcngmm_3")) {
			var base = inNGM(3) ? 0.9995 : 0.998
			if (inNGM(4) && player.challenges.includes("postcngmm_3")) base = .9998
			return E_pow(base, galPow)
		}
		return 1
	}

	//Linear
	let ret = 0.8
	let linearGalaxies = 2
	let useLinear = player.galaxies + player.replicanti.gal + player.dilation.freeGalaxies <= linearGalaxies
	if (mod.rs) {
		linearGalaxies = Math.min(galPow, linearGalaxies + 3)
		useLinear = true
	}
	if (useLinear) {
		ret = 0.9;
		if (mod.rs && player.galaxies == 0) ret = 0.89
		else if (gal == 0) ret = 0.89
		if (inNC(6, 1) || player.currentChallenge == "postc1") ret = 0.93
		if (mod.rs) ret -= linearGalaxies * 0.02
		else {
			let perGalaxy = 0.02 * tmp.gal.str
			return Math.max(ret - (gal * perGalaxy), 0.83)
		}
	}

	//Exponential
	if (inNC(6, 1) || player.currentChallenge == "postc1") ret = 0.83

	var log = Math.log10(0.965) * (galPow - linearGalaxies) + Math.log10(ret)
	return pow10(log)
}

function getIC3Mult() {
	let base = getIC3Base()
	let exp = getIC3Exp()
	if (exp > 1) return E_pow(base,exp)
	return base
}

function getIC3Base() {
	if (player.currentChallenge == "postcngmm_3") return 1

	let add = 1.05
	let mult = 0.005
	if (inNGM(3)) mult = 0.002
	if (inQC(2)) mult = 0

	let gal = player.galaxies
	if (inNGM(2)) {
		gal = getGalaxyPower()
		if (inNC(6, 1) || player.currentChallenge == "postc1") add -= inNGM(4) ? 0.02 : 0.05
		else if (inOnlyNGM(3)) add -= 0.03

		mult *= tmp.gal.str
		if (tmp.ic_power > 1) {
			if (inNGM(3)) mult *= tmp.ic_power / 10 + .9
			else mult *= tmp.ic_power / 5 + .8
		}
	}
	if (ghostified) {
		if (hasNB(9)) mult = NT.eff("boost", 9).mul(mult)
		if (hasNU(12)) mult = NT.eff("upg", 12).free.mul(mult)
		return E(mult).mul(gal).add(add)
	}
	return mult * gal + add
}

function getIC3Exp() {
	let x = 1
	if (inNGM(2)) {
		let g = getReplGalPower()
		if (g < 7) return 1 + g / 5
		let y = 5
		let z = .5
		if (tmp.ec_eff > 29) {
			if (player.currentEternityChall == "" || player.currentEternityChall == "eterc12") {
				z = .9
				if (tmp.ec_eff > 53) y = 1.4 - ((tmp.ec_eff - 54) / 15)
				else if (tmp.ec_eff > 42) y = 2
				else if (tmp.ec_eff > 37) y = 3.5
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
	getOrSubResource(1, player.tickSpeedCost)
	if ((!inNC(5) && player.currentChallenge != "postc5") || inNGM(3)) player.tickSpeedCost = player.tickSpeedCost.mul(player.tickspeedMultiplier)
	else multiplySameCosts(player.tickSpeedCost)
	if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.mul(getTickSpeedCostMultiplierIncrease())
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (!tmp.qu.be) {
		player.tickspeed = player.tickspeed.mul(tmp.gal.ts)
		if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.mul(getIC3Mult())
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
	if (!tmp.qu.be || player.currentEternityChall == "eterc10") {
		player.tickspeed = player.tickspeed.mul(E_pow(mult, buying));
		if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.mul(E_pow(getIC3Mult(), buying))
	}
	player.tickSpeedCost = player.tickSpeedCost.mul(player.tickspeedMultiplier.pow(buying-1)).mul(E_pow(mi, (buying-1)*(buying-2)/2))
	player.tickspeedMultiplier = player.tickspeedMultiplier.mul(E_pow(mi, buying-1))
	getOrSubResource(1, player.tickSpeedCost)

	player.tickSpeedCost = player.tickSpeedCost.mul(player.tickspeedMultiplier)
	player.tickspeedMultiplier = player.tickspeedMultiplier.mul(mi)
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
		var toBuy = Math.min(Math.floor(player.money.div(cost).mul(9).add(1).log(10)), max)
		getOrSubResource(1, pow10(toBuy).sub(1).div(9).mul(cost))
		if (!tmp.qu.be || player.currentEternityChall == "eterc10") {
			player.tickspeed = E_pow(tmp.gal.ts, toBuy).mul(player.tickspeed)
			if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.mul(E_pow(getIC3Mult(), toBuy))
		}
		player.tickSpeedCost = player.tickSpeedCost.mul(pow10(toBuy))
		player.postC8Mult = E(1)
		if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.mul(getTickSpeedCostMultiplierIncrease())
	}
	var mult = tmp.gal.ts
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (cannotUsePostInfTickSpeed()) {
		while (player.money.gt(player.tickSpeedCost) && (player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease > 2 || (player.currentChallenge == "postc5" && !inNGM(3)))) {
			getOrSubResource(1, player.tickSpeedCost)
			if (!inNC(5) && player.currentChallenge != "postc5") player.tickSpeedCost = player.tickSpeedCost.mul(player.tickspeedMultiplier);
			else multiplySameCosts(player.tickSpeedCost)
			if (costIncreaseActive(player.tickSpeedCost)) player.tickspeedMultiplier = player.tickspeedMultiplier.mul(getTickSpeedCostMultiplierIncrease())
			if (!tmp.qu.be || player.currentEternityChall == "eterc10") {
				player.tickspeed = player.tickspeed.mul(mult);
				if (player.challenges.includes("postc3") || player.currentChallenge == "postc3" || isIC3Trapped()) player.postC3Reward = player.postC3Reward.mul(getIC3Mult())
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
	let r = player.tickspeed
	if (tmp.qu.be && player.currentEternityChall == "eterc10") r = r.max(pow10(-3e8))
	return r
}

function updateTickspeed() {
	var showTickspeed = player.tickspeed.lt(1e3) || (player.currentChallenge != "postc3" && !isIC3Trapped()) || player.currentChallenge == "postcngmm_3" || (player.challenges.includes("postcngmm_3") && !inNGM(3)) || tmp.qu.be
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
	if (inOnlyNGM(2) && inNC(14)) {
		label += "<br>You have "+(308-player.tickBoughtThisInf.current)+" tickspeed purchases left."
		el("tickSpeedAmount").innerHTML = label
	} else el("tickSpeedAmount").textContent = label
	el("tickSpeed").textContent = "Cost: " + shortenPreInfCosts(player.tickSpeedCost);
}


function tickspeedButtonDisplay(){
	if (player.tickSpeedCost.gt(player.money)) {
		el("tickSpeed").className = 'unavailablebtn';
		el("tickSpeedMax").className = 'unavailablebtn';
	} else {
		el("tickSpeed").className = 'storebtn';
		el("tickSpeedMax").className = 'storebtn';
	}
}
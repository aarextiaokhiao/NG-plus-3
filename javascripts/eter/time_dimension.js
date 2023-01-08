//time dimensions

function getBreakEternityTDMult(tier){
	var ret = tmp.it
	if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.times(tsMults[11]())
	if (beSave && beSave.upgrades.includes(1) && tier < 5) ret = ret.times(getBreakUpgMult(1))
	if (beSave && beSave.upgrades.includes(4) && tier > 3 && tier < 7) ret = ret.times(getBreakUpgMult(4))
	if (hasRipUpg(13)) ret = ret.times(player.replicanti.amount.max(1).pow(1e-6))
	if (tier == 6 && ghSave.ghostlyPhotons.unl) ret = ret.times(tmp.le[6])
	if (tier == 7 && hasRipUpg(16)) ret = ret.times(tmp.bru[16])
	if (beSave && beSave.upgrades.includes(11) && brSave.active) ret = ret.mul(tmp.beu[11]||1)
	if (tier == 8 && hasAch("ng3p62")) ret = ret.pow(Math.log10(ghSave.time/10+1)/100+1)
	if (ret.lt(0)) ret = E(0)
	return dilates(ret)
}

function doNGMatLeast4TDChanges(tier, ret){
	//Tickspeed multiplier boost
	var x = player.postC3Reward
	var exp = ([5, 3, 2, 1.5, 1, .5, 1/3, 0])[tier - 1]
	if (x.gt(1e10)) x = pow10(Math.sqrt(x.log10() * 5 + 50))
	if (hasGalUpg(25)) exp *= galMults.u25()
	if (inNC(16)) exp /= 2
	ret = ret.times(x.pow(exp))

	//NG-4 upgrades
	if (hasGalUpg(12)) ret = ret.times(galMults.u12())
	if (hasGalUpg(13) && player.currentChallenge!="postngm3_4") ret = ret.times(galMults.u13())
	if (hasGalUpg(15)) ret = ret.times(galMults.u15())
	if (hasGalUpg(44) && inNGM(4)) {
		var e = hasGalUpg(46) ? galMults["u46"]() : 1
		ret = ret.times(E_pow(player[TIER_NAMES[tier]+"Amount"].plus(10).log10(), e * Math.pow(11 - tier, 2)))
	}
	if (hasGalUpg(31)) ret = ret.pow(galMults.u31())
	return ret
}

function getERTDAchMults(){
	if (!player.boughtDims) return 1
	if (hasAch('r117')) {
		return 1 + Math.pow(Math.log(player.eternities), 1.5) / Math.log(100);
	} else if (hasAch('r102')) {
		return 1 + Math.log(player.eternities) / Math.log(100);
	}
	return 1
}

function calcNGM2atleastTDPreVPostDilMultiplier(tier){
	var ret2 = E(1)
	var ngPlus = (aarMod.newGamePlusVersion ? 103680000 : 0)
	if (player.currentEternityChall == "eterc9") ret2 = ret2.times(tmp.infPow)
	if (ECComps("eterc1") !== 0) ret2 = ret2.times(getECReward(1))
	if (player.eternityUpgrades.includes(4)) ret2 = ret2.times(player.achPow)
	if (player.eternityUpgrades.includes(5)) ret2 = ret2.times(Math.max(player.timestudy.theorem, 1))
	if (player.eternityUpgrades.includes(6)) ret2 = ret2.times((player.totalTimePlayed + ngPlus) / 10 / 60 / 60 / 24)
	if (tmp.ngex) ret2 = ret2.div(10 / tier)
	return ret2
}

function calcVanillaTSTDMult(tier){
	var ret = E(1)
	if (player.timestudy.studies.includes(73) && tier == 3) ret = ret.times(tmp.sacPow.pow(0.005).min(E("1e1300")))
	if (player.timestudy.studies.includes(93)) ret = ret.times(E_pow(player.totalTickGained, 0.25).max(1))
	if (player.timestudy.studies.includes(103)) ret = ret.times(Math.max(player.replicanti.galaxies, 1))
	if (player.timestudy.studies.includes(151)) ret = ret.times(1e4)
	if (player.timestudy.studies.includes(221)) ret = ret.times(E_pow(1.0025, player.resets))
	if (player.timestudy.studies.includes(227) && tier == 4) ret = ret.times(Math.pow(tmp.sacPow.max(10).log10(), 10))
	return ret
}

function getTimeDimensionPower(tier) {
	if (player.currentEternityChall == "eterc11") return E(1)
	if (tmp.be) return getBreakEternityTDMult(tier)
	var dim = player["timeDimension" + tier]
	var ret = dim.power.pow(player.boughtDims ? 1 : 2)

	if (inNGM(4)) ret = doNGMatLeast4TDChanges(tier,ret)

	if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.times(tsMults[11]())
	
	if (hasAch("r105")) ret = ret.times(tmp.it)
	ret = ret.times(getERTDAchMults())

	var ret2 = calcNGM2atleastTDPreVPostDilMultiplier(tier)
	if (inNGM(2)) ret = ret.times(ret2)
	ret = ret.times(calcVanillaTSTDMult(tier))

	if (ECComps("eterc10") !== 0) ret = ret.times(getECReward(10))
	if (hasAch("r128")) ret = ret.times(Math.max(player.timestudy.studies.length, 1))
	if (hasGalUpg(43)) ret = ret.times(galMults.u43())
	if (!player.dilation.upgrades.includes("ngmm2") && player.dilation.upgrades.includes(5) && player.replicanti.amount.gt(1)) ret = ret.times(tmp.rm.pow(0.1))
	if (inQC(6)) ret = ret.times(player.postC8Mult).dividedBy(player.matter.max(1))

	ret = dilates(ret, 2)
	if (inNGM(2)) ret = ret.times(ret2)

	ret = dilates(ret, 1)
	if (player.dilation.upgrades.includes("ngmm2") && player.dilation.upgrades.includes(5) && player.replicanti.amount.gt(1)) ret = ret.times(tmp.rm.pow(0.1))
	if (player.dilation.upgrades.includes("ngmm8")) ret = ret.pow(getDil71Mult())

	return ret
}

function getTimeDimensionProduction(tier) {
  	if (player.currentEternityChall == "eterc1" || player.currentEternityChall == "eterc10" || (!tmp.be && inQC(8))) return E(0)
  	var dim = player["timeDimension" + tier]
  	if (player.currentEternityChall == "eterc11") return dim.amount
  	var ret = dim.amount
  	if (inQC(4) && tier == 1) ret = ret.plus(player.timeDimension2.amount.floor())
  	ret = ret.times(getTimeDimensionPower(tier))
  	if (inNGM(4)&&(inNC(2)||player.currentChallenge=="postc1")) ret = ret.times(player.chall2Pow)
  	if (player.currentEternityChall == "eterc7") ret = dilates(ret.dividedBy(player.tickspeed.dividedBy(1000)))
  	if (inNGM(4)&&(tier>1||!hasAch("r12"))) ret = ret.div(100)
  	if (aarMod.ngexV) ret = ret.div(10 / tier)
  	if (player.currentEternityChall == "eterc1") return E(0)
  	return ret
}

function getIC3EffFromFreeUpgs() {
	let x = 0
	if (tmp.ngp3) {
		if (player.currentEternityChall=='eterc14') x = 5
		else {
			x = ECComps("eterc14") * (tmp.ngp3l ? 2 : 4)
			if (hasNU(12)) if (brSave.active) x *= tmp.nu[4].replicated
		}
	}
	if (inNGM(2)) x++
	return x
}

function isTDUnlocked(t) {
	if (t > 8) return
	if (inNGM(4)) {
		if ((inNC(4) || player.currentChallenge == "postc1") && t > 6) return
		return player.tdBoosts > t - 2
	}
	return t < 5 || player.dilation.studies.includes(t - 3)
}

function getTimeDimensionRateOfChange(tier) {
	let toGain = getTimeDimensionProduction(tier + (inQC(4) ? 2 : 1))
	var current = Decimal.max(player["timeDimension" + tier].amount, 1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.times(10).dividedBy(current);
	return change;
}

function getTimeDimensionDescription(tier) {
	if (!isTDUnlocked(((inNC(7) && inNGM(4)) || inQC(4) ? 2 : 1) + tier)) return getFullExpansion(player['timeDimension' + tier].bought)
	else if (player.timeShards.l > 1e7) return shortenDimensions(player['timeDimension' + tier].amount)
	else return shortenDimensions(player['timeDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function updateTimeDimensions() {
	if (el("timedimensions").style.display == "block" && el("dimensions").style.display == "block") {
		updateTimeShards()
		for (let tier = 1; tier <= 8; ++tier) {
			if (isTDUnlocked(tier)) {
				el("timeRow" + tier).style.display = "table-row"
				el("timeD" + tier).textContent = DISPLAY_NAMES[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
				el("timeAmount" + tier).textContent = getTimeDimensionDescription(tier);
				el("timeMax" + tier).textContent = (quantumed ? '':"Cost: ") + shortenDimensions(player["timeDimension" + tier].cost) + (inNGM(4) ? "" : " EP")
				if (getOrSubResourceTD(tier).gte(player["timeDimension" + tier].cost)) el("timeMax"+tier).className = "storebtn"
			else el("timeMax" + tier).className = "unavailablebtn"
			} else el("timeRow" + tier).style.display = "none"
		}
		if (inNGM(4)) {
			var isShift = player.tdBoosts < (inNC(4) ? 5 : 7)
			var req = getTDBoostReq()
			el("tdReset").style.display = ""
			el("tdResetLabel").textContent = "Time Dimension "+(isShift ? "Shift" : "Boost") + " (" + getFullExpansion(player.tdBoosts) + "): requires " + getFullExpansion(req.amount) + " " + DISPLAY_NAMES[req.tier] + " Time Dimensions"
			el("tdResetBtn").textContent = "Reset the game for a " + (isShift ? "new dimension" : "boost")
			el("tdResetBtn").className = (player["timeDimension" + req.tier].bought < req.amount) ? "unavailablebtn" : "storebtn"
		} else el("tdReset").style.display = "none"
	}
}

function updateTimeShards() {
	let p = getTimeDimensionProduction(1)
	el("itmult").textContent = tmp.ngp3 && hasAch('r105') ? 'Your "Infinite Time" multiplier is currently ' + shorten(tmp.it) + 'x.':''
	el("timeShardAmount").textContent = shortenMoney(player.timeShards)
	el("tickThreshold").textContent = shortenMoney(player.tickThreshold)
	if (player.currentEternityChall == "eterc7") el("timeShardsPerSec").textContent = "You are getting " + shortenDimensions(p) + " Eighth Infinity Dimensions per second."
	else el("timeShardsPerSec").textContent = "You are getting " + shortenDimensions(p) + " Timeshards per second."
}

var timeDimCostMults = [[null, 3, 9, 27, 81, 243, 729, 2187, 6561], [null, 1.5, 2, 3, 20, 150, 1e5, 3e6, 1e8]]
var timeDimStartCosts = [[null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"], [null, 10, 20, 40, 80, 160, 1e8, 1e12, 1e18]]

function timeDimCost(tier, bought) {
	var cost = E_pow(timeDimCostMults[0][tier], bought).times(timeDimStartCosts[0][tier])
	if (inNGM(2)) return cost
	if (cost.gte(Number.MAX_VALUE)) cost = E_pow(timeDimCostMults[0][tier]*1.5, bought).times(timeDimStartCosts[0][tier])
	if (cost.gte("1e1300")) cost = E_pow(timeDimCostMults[0][tier]*2.2, bought).times(timeDimStartCosts[0][tier])
	if (tier > 4) cost = E_pow(timeDimCostMults[0][tier]*100, bought).times(timeDimStartCosts[0][tier])
	if (cost.gte(tier > 4 ? "1e300000" : "1e20000")) {
		// rather than fixed cost scaling as before, quadratic cost scaling
		// to avoid exponential growth
		cost = cost.times(E_pow(E('1e1000'),
		Math.pow(cost.log(10) / 1000 - (tier > 4 ? 300 : 20), 2)));
	}
	return cost
}

function buyTimeDimension(tier) {
	var dim = player["timeDimension"+tier]
	if (inNGM(4) && getAmount(1) < 1) {
		alert("You need to buy a first Normal Dimension to be able to buy Time Dimensions.")
		return
	}
	if (!isTDUnlocked(tier)) return false
	if (getOrSubResourceTD(tier).lt(dim.cost)) return false

	getOrSubResourceTD(tier, dim.cost)
	dim.amount = dim.amount.plus(1);
	dim.bought += 1
	if (inQC(6)) player.postC8Mult = E(1)
	if (inNGM(4)) {
		dim.cost = dim.cost.times(timeDimCostMults[1][tier])
		if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	} else {
		dim.power = dim.power.times(player.boughtDims ? 3 : 2)
		dim.cost = timeDimCost(tier, dim.bought)
		updateEternityUpgrades()
	}
	return true
}

function resetTimeDimensions() {
	for (var i = 1; i <= 8; i++) {
		var dim = player["timeDimension" + i]
		dim.amount = E(dim.bought)
	}
}

function getOrSubResourceTD(tier, sub) {
	if (sub == undefined) {
		var currmax = player.currentChallenge == "" ? E(Number.MAX_VALUE).pow(10) : pow10(1000)
		if (player.currentChallenge == "postcngm3_1") currmax = E(1e60)
		var maxval = hasAch("r36") ? currmax : E(Number.MAX_VALUE)
		if (inNGM(4)) return player.money.min(maxval)
		return player.eternityPoints
	} else {
		if (inNGM(4)) player.money = player.money.sub(player.money.min(sub))
		else player.eternityPoints = player.eternityPoints.sub(player.eternityPoints.min(sub))
	}
}

function buyMaxTimeDimension(tier, bulk) {
	var dim = player['timeDimension' + tier]
	var res = getOrSubResourceTD(tier)
	if (inNGM(4) && getAmount(1) < 1) return
	if (aarMod.maxHighestTD && tier < 8 && player["timeDimension" + (tier + 1)].bought > 0) return
	if (!isTDUnlocked(tier)) return
	if (res.lt(dim.cost)) return
	if (inNGM(4)) {
		var toBuy = Math.floor(res.div(dim.cost).times(timeDimCostMults[1][tier] - 1).add(1).log(timeDimCostMults[1][tier]))
		if (bulk) toBuy = Math.min(toBuy,bulk)
		getOrSubResourceTD(tier, E_pow(timeDimCostMults[1][tier], toBuy).sub(1).div(timeDimCostMults[1][tier] - 1).times(dim.cost))
		if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	} else {
		var toBuy = 0
		var increment = 1
		while (player.eternityPoints.gte(timeDimCost(tier, dim.bought + increment - 1))) increment *= 2
		while (increment>=1) {
			if (player.eternityPoints.gte(timeDimCost(tier, dim.bought + toBuy + increment - 1))) toBuy += increment
			increment /= 2
		}
		var num = toBuy
		var newEP = player.eternityPoints
		while (num > 0) {
			var temp = newEP
			var cost = timeDimCost(tier, dim.bought + num - 1)
			if (newEP.lt(cost)) {
				newEP = player.eternityPoints.sub(cost)
				toBuy--
			} else newEP = newEP.sub(cost)
			if (newEP.eq(temp) || num > 9007199254740992) break
			num--
		}
		player.eternityPoints = newEP
		if (isNaN(newEP.e)) player.eternityPoints = E(0)
	}
	dim.amount = dim.amount.plus(toBuy);
	dim.bought += toBuy
	if (inNGM(4)) {
		dim.power = Decimal.sqrt(getDimensionPowerMultiplier()).times(dim.power)
		dim.cost = dim.cost.times(E_pow(timeDimCostMults[1][tier], toBuy))
	} else {
		dim.cost = timeDimCost(tier, dim.bought)
		dim.power = dim.power.times(E_pow(player.boughtDims ? 3 : 2, toBuy))
		if (inQC(6)) player.postC8Mult = E(1)
		updateEternityUpgrades()
	}
}

function buyMaxTimeDimensions() {
	for (var i = 1; i <= 8; i++) buyMaxTimeDimension(i)
}

function toggleAllTimeDims() {
	var turnOn
	var id = 1
	while (id <= 8 && turnOn === undefined) {
		if (!player.autoEterOptions["td" + id]) turnOn = true
		else if (id > 7) turnOn = false
		id++
	}
	for (id = 1; id <= 8; id++) {
		player.autoEterOptions["td" + id] = turnOn
		el("td" + id + 'auto').textContent = "Auto: " + (turnOn ? "ON" : "OFF")
	}
	el("maxTimeDimensions").style.display = turnOn ? "none" : ""
}

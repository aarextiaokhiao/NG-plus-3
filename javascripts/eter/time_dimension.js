//time dimensions

function getBreakEternityTDMult(tier){
	var ret = tmp.inf_time
	if (hasTimeStudy(11) && tier == 1) ret = ret.mul(tsMults[11]())
	if (isBreakUpgActive(1) && tier < 5) ret = ret.mul(tmp.qu.beu[1])
	if (isBreakUpgActive(4) && tier > 3 && tier < 7) ret = ret.mul(tmp.qu.beu[4])
	if (hasRipUpg(13)) ret = ret.mul(player.replicanti.amount.max(1).pow(1e-6))
	if (tier == 7 && hasRipUpg(16)) ret = ret.mul(tmp.qu.bru[16])
	if (hasWZMilestone(9)) ret = ret.mul(player["timeDimension"+tier].power.pow(0.01))
	if (ret.lt(0)) ret = E(0)
	return dilates(ret)
}

function getERTDAchMults(){
	if (!mod.rs) return 1
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
	if (player.currentEternityChall == "eterc9") ret2 = ret2.mul(tmp.inf_pow)
	if (ECComps("eterc1") !== 0) ret2 = ret2.mul(getECReward(1))
	if (player.eternityUpgrades.includes(4)) ret2 = ret2.mul(player.achPow)
	if (player.eternityUpgrades.includes(5)) ret2 = ret2.mul(Math.max(player.timestudy.theorem, 1))
	if (player.eternityUpgrades.includes(6)) ret2 = ret2.mul((player.totalTimePlayed + ngPlus) / 10 / 60 / 60 / 24)
	if (hasGSacUpg(43)) ret = ret.mul(galMults.u43())
	return ret2
}

function calcVanillaTSTDMult(tier){
	var ret = E(1)
	if (hasTimeStudy(73) && tier == 3) ret = ret.mul(tmp.sacPow.pow(0.005).min(E("1e1300")))
	if (hasTimeStudy(93)) ret = ret.mul(E_pow(player.totalTickGained, 0.25).max(1))
	if (hasTimeStudy(103)) ret = ret.mul(Math.max(player.replicanti.galaxies, 1))
	if (hasTimeStudy(151)) ret = ret.mul(1e4)
	if (hasTimeStudy(221)) ret = ret.mul(E_pow(1.0025, player.resets))
	if (hasTimeStudy(227) && tier == 4) ret = ret.mul(E_pow(tmp.sacPow.max(10).log10(), 10))
	return ret
}

function getTimeDimensionPower(tier) {
	if (player.currentEternityChall == "eterc11") return E(1)
	if (tmp.qu.be) return getBreakEternityTDMult(tier)
	var dim = player["timeDimension" + tier]
	var ret = dim.power.pow(mod.rs ? 1 : 2)

	if (inNGM(4)) ret = doNGM4TDMultiplier(tier, ret)

	if (hasTimeStudy(11) && tier == 1) ret = ret.mul(tsMults[11]())
	
	if (hasAch("r105")) ret = ret.mul(tmp.inf_time)
	ret = ret.mul(getERTDAchMults())

	var ret2 = calcNGM2atleastTDPreVPostDilMultiplier(tier)
	if (inNGM(2)) ret = ret.mul(ret2)
	ret = ret.mul(calcVanillaTSTDMult(tier))

	if (ECComps("eterc10") !== 0) ret = ret.mul(getECReward(10))
	if (hasAch("r128")) ret = ret.mul(Math.max(player.timestudy.studies.length, 1))
	if (player.dilation.upgrades.includes(5)) ret = ret.mul(tmp.rep.eff.pow(hasWZMilestone(8) ? .3 : .1))

	ret = dilates(ret, 2)
	if (inNGM(2)) ret = ret.mul(ret2)

	return dilates(ret, 1)
}

function getTimeDimensionProduction(tier) {
	if (player.currentEternityChall == "eterc1" || player.currentEternityChall == "eterc10" || (!tmp.qu.be && inQC(8))) return E(0)
	var dim = player["timeDimension" + tier]
	if (player.currentEternityChall == "eterc11") return dim.amount
	var ret = dim.amount
	if (inQC(4) && tier == 1) ret = ret.add(player.timeDimension2.amount.floor())
	ret = ret.mul(getTimeDimensionPower(tier))
	if (inNGM(4)&&(inNC(2)||player.currentChallenge=="postc1")) ret = ret.mul(player.chall2Pow)
	if (player.currentEternityChall == "eterc7") ret = dilates(ret.dividedBy(player.tickspeed.dividedBy(1000)))

	// 2nd dimension achievement does not have an effect in NG-4R
	if (!inNGM4Respec() && inNGM(4)&&(tier>1||!hasAch("r12"))) ret = ret.div(100)
	if (player.currentEternityChall == "eterc1") return E(0)
	return ret
}

function getIC3EffFromFreeUpgs() {
	let x = 0
	if (mod.ngp3) {
		if (player.currentEternityChall=='eterc14') x = 5
		else {
			x = ECComps("eterc14") * 4
			if (hasNU(12)) x *= NT.eff("upg", 12).replicated
		}
	}
	if (inNGM(2)) x++
	return x
}

function isTDUnlocked(t) {
	if (t > (8 - PHANTOM.amt)) return
	if (inNGM(4)) {
		if ((inNC(4) || player.currentChallenge == "postc1") && t > 6) return
		return player.tdBoosts > t - 2
	}
	return t < 5 || hasDilStudy(t - 3)
}

function getTimeDimensionRateOfChange(tier) {
	let toGain = getTimeDimensionProduction(tier + (inQC(4) ? 2 : 1))
	var current = Decimal.max(player["timeDimension" + tier].amount, 1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.mul(10).dividedBy(current);
	return change;
}

function getTimeDimensionDescription(tier) {
	if(aarMod.newGame4MinusRespeccedVersion){
		if (!isTDUnlocked(((inNC(7) && inNGM(4)) || inQC(4) ? 2 : 1) + tier)){
			let desc=getFullExpansion(player['timeDimension' + tier].bought+player['timeDimension' + tier].boughtAntimatter) + " ("+getFullExpansion(player['timeDimension' + tier].boughtAntimatter);
			if(player['timeDimension' + tier].bought>0)desc+=" + "+getFullExpansion(player['timeDimension' + tier].bought);
			return desc+")";
		}
		let desc=formatQuick(player['timeDimension' + tier].amount, 2, 2) + " ("+getFullExpansion(player['timeDimension' + tier].boughtAntimatter);
		if(player['timeDimension' + tier].bought>0)desc+=" + "+getFullExpansion(player['timeDimension' + tier].bought);
		return desc+")" + ' (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
	}
	if (!isTDUnlocked(((inNC(7) && inNGM(4)) || inQC(4) ? 2 : 1) + tier)){
		if(inNGM(4))return getFullExpansion(player['timeDimension' + tier].boughtAntimatter)
		return getFullExpansion(player['timeDimension' + tier].bought)
	}
	else if (player.timeShards.l > 1e7) return shortenDimensions(player['timeDimension' + tier].amount)
	else return formatQuick(player['timeDimension' + tier].amount, 2, inNGM(4) ? Math.min(Math.max(3 - player.money.e, 1), 3) : 0) + ' (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function updateTimeDimensions() {
	let maxCost = getMaxTDCost();
	updateTimeShards()
	for (let tier = 1; tier <= 8; ++tier) {
		if (isTDUnlocked(tier)) {
			el("timeRow" + tier).style.display = "table-row"
			el("timeD" + tier).textContent = dimNames[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
			el("timeAmount" + tier).textContent = getTimeDimensionDescription(tier);
			if (inNGM(4)) {
				if(inNGM4Respec() && !(hasAch("r63") || hasAch("r91") || hasAch("r92"))) {
					el("timeMax" + tier).style.display = "none";
				}
				else el("timeMax" + tier).style.display = "";
				el("timeMax" + tier + "Antimatter").style.display = "";
				el("timeMax" + tier + "Antimatter").textContent = (quantumed ? '':"Cost: ") + formatQuick(player["timeDimension" + tier].costAntimatter, 2, aarMod.newGame4MinusRespeccedVersion?0:(Math.min(Math.max(3 - player.money.e, 1), 3)))
				if (getOrSubResourceTD(tier,1).gte(player["timeDimension" + tier].costAntimatter)) el("timeMax"+tier + "Antimatter").className = "storebtn"
			else el("timeMax" + tier + "Antimatter").className = "unavailablebtn"
			}else el("timeMax" + tier + "Antimatter").style.display = "none",el("timeMax" + tier).style.display = "";
			el("timeMax" + tier).textContent = (quantumed ? '':"Cost: ") + formatQuick(player["timeDimension" + tier].cost, 2, 0) + (" EP")
			if (getOrSubResourceTD(tier).gte(player["timeDimension" + tier].cost)) el("timeMax"+tier).className = "storebtn"
		else el("timeMax" + tier).className = "unavailablebtn"
		} else el("timeRow" + tier).style.display = "none"
	}
	el("itmult").textContent = hasAch('r105') ? 'Infinite Time: ' + shorten(tmp.inf_time) + 'x to all Time Dimensions' : ''
	if (aarMod.newGame4MinusRespeccedVersion && getNGM4RTBPower() > 0) el("itmult").textContent += ', Tickspeed Boosts are reducing Time Shard requirement by ' + shortenMoney(getNGM4RTBPower()) + ' Tickspeed Upgrades'
	
	if (inNGM(4)) {
		var isShift = player.tdBoosts < (inNC(4) ? 5 : 7)
		var req = getTDBoostReq()
		el("tdReset").style.display = ""
		el("tdResetLabel").textContent = "Time Dimension "+(isShift ? "Shift" : "Boost") + " (" + getFullExpansion(player.tdBoosts) + "): requires " + getFullExpansion(req.amount) + " " + dimNames[req.tier] + " Time Dimensions"
		el("tdResetBtn").textContent = "Reset prior features for a " + (isShift ? "new Dimension" : "Boost")
		el("tdResetBtn").className = (player["timeDimension" + req.tier].bought + player["timeDimension" + req.tier].boughtAntimatter < req.amount) ? "unavailablebtn" : "storebtn"

		// Whether this should be important to show in regular NG-4 might not matter compared to NG-4R
		// as the purchase limit is pushed much earlier in NG-4R
		//if (aarMod.newGame4MinusRespeccedVersion) {
			el("tdCostLimit").style.display = "inline-block"
			el("tdCostLimit").textContent = "You can spend up to " + shortenDimensions(maxCost) + " antimatter on Time Dimensions (for each tier)."
		//}

	} else {
		el("tdReset").style.display = "none"
		el("tdCostLimit").style.display = "none"
	}
}

function updateTimeShards() {
	let p = getTimeDimensionProduction(1)

	// For NG-x mods, displaying decimals is especially important to show how precise the numbers are
	if (aarMod.newGame4MinusRespeccedVersion)el("timeShardAmount").textContent = formatQuick(softcap(player.timeShards,"ts_ngm4r"), 2, 1);
	else el("timeShardAmount").textContent = formatQuick(player.timeShards, 2, inNGM(3) ? Math.min(Math.max(3 - player.timeShards.e, 0), 3) : 2)
	el("tickThreshold").textContent = formatQuick(player.tickThreshold, 2, inNGM(3) ? Math.min(Math.max(3 - player.tickThreshold.e, 0), 3) : 2)
	
	//if (player.currentEternityChall == "eterc7") el("timeShardsPerSec").textContent = "You are getting " + shortenDimensions(p) + " Eighth Infinity Dimensions per second."
	//else el("timeShardsPerSec").textContent = "You are getting " + formatQuick(p, 2, inNGM(4) ? Math.min(Math.max(3 - p.e, 1), 3) : 0) + " Time Shards per second."

	if (player.currentEternityChall == "eterc7") el("timeShardsPerSec").textContent = "You are getting " + shortenDimensions(p) + " Eighth Infinity Dimensions per second."
	else if (aarMod.newGame4MinusRespeccedVersion) el("timeShardsPerSec").textContent = "You have " + shortenMoney(player.timeShards) + " undilated Time Shards. You are getting " + (inNGM(5) && p < 100 ? shortenND(p) : shortenDimensions(p)) + " undilated Time Shards per " + (tmp.PDunl ? "real-life " : "") + "second."
	else el("timeShardsPerSec").textContent = "You are getting " + (inNGM(5) && p < 100 ? shortenND(p) : shortenDimensions(p)) + " Time Shards per " + (tmp.PDunl ? "real-life " : "") + "second."
}

// 0:Original 1:NG-4C 2:NG-4R
var timeDimCostMults = [[null, 3, 9, 27, 81, 243, 729, 2187, 6561], [null, 1.5, 2, 3, 20, 150, 1e5, 3e6, 1e8], [null, 2, 3, 4, 5, 10, 50, 1e3, 1e5]]
var timeDimStartCosts = [[null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"], [null, 10, 20, 40, 80, 160, 1e8, 1e12, 1e18], [null, 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7]]

// NG-4 and NG-4R used antimatter to buy Time Dimension.
function getTimeDimCostMult(tier, ngm4) {
	if(ngm4)return timeDimCostMults[aarMod.newGame4MinusRespeccedVersion ? 2 : 1][tier]
	return timeDimCostMults[0][tier]
}

function getTimeDimStartCost(tier, ngm4) {
	if (ngm4) return timeDimStartCosts[aarMod.newGame4MinusRespeccedVersion ? 2 : 1][tier]
	return timeDimStartCosts[0][tier]
}

function timeDimCost(tier, bought, ngm4) {
	var mult = getTimeDimCostMult(tier, ngm4)
	var start = getTimeDimStartCost(tier, ngm4)
	var cost = E_pow(mult, bought).mul(start)

	if (ngm4) {
		if (inNGM4Respec()) {
			if (cost.gte(Number.MAX_VALUE)) cost = E_pow(mult*1.5, bought).mul(start)
			if (cost.gte("1e5000")) cost = E_pow(mult*2, bought).mul(start)
			if (cost.gte("1e50000")) cost = E_pow(mult*Math.max(3,bought*bought*[1.7e-10,2.4e-10,3.1e-10,3.8e-10,6.25e-10,1.25e-9,2.5e-9,5e-9][tier-1]), bought).mul(start)
		}
	} else {
		if (cost.gte(Number.MAX_VALUE)) cost = E_pow(mult*1.5, bought).mul(start)
		if (cost.gte("1e1300")) cost = E_pow(mult*2.2, bought).mul(start)

		if (tier > 4) cost = E_pow(mult*100, bought).mul(start)
		if (cost.gte(tier > 4 ? "1e300000" : "1e20000")) {
			// rather than fixed cost scaling as before, quadratic cost scaling
			// to avoid exponential growth
			cost = cost.mul(pow10(Math.pow(cost.log(10) / 1000 - (tier > 4 ? 300 : 20), 2) * 1000));
		}
	}
	return cost
}

function buyTimeDimension(tier, ngm4) {
	var dim = player["timeDimension"+tier]
	if (getAmount(1) < 1 && ngm4) {
		// I should just make a message system just like the modal message system
		el("welcome").style.display = "flex"
		el("welcomeMessage").innerHTML = "You need to buy a first Antimatter Dimension to be able to buy Time Dimensions."
		return
	}
	if (!isTDUnlocked(tier)) return false
	if (getOrSubResourceTD(tier, ngm4).lt(ngm4 ? dim.costAntimatter : dim.cost)) return false

	getOrSubResourceTD(tier, ngm4, ngm4 ? dim.costAntimatter : dim.cost)
	dim.amount = dim.amount.add(1);
	if(ngm4)dim.boughtAntimatter += 1;else dim.bought += 1;
	if (inNGM(4)) {
		if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	} else {
		dim.power = dim.power.mul(mod.rs ? 3 : 2)
	}
	dim.cost = timeDimCost(tier, dim.bought)
	if (inNGM(4)) dim.costAntimatter = timeDimCost(tier, dim.boughtAntimatter, 1)
	return true
}

function resetTimeDimensions() {
	for (var i = 1; i <= 8; i++) {
		var dim = player["timeDimension" + i]
		dim.amount = E(dim.bought)
	}
}

function getMaxTDCost() {
	if (aarMod.newGame4MinusRespeccedVersion && !(player.currentChallenge == "postcngm3_1")){
		if (player.currentChallenge == "postcngm3_1") return E(1e60)
		let y=50+player.tickspeedBoosts*10+player.challenges.length*5+(hasAch("r36")?200:0);
		if(player.break)y=200+(hasAch("r36")?200:0)+player.tickspeedBoosts*10+(Math.max(player.challenges.length,16)-16)*100;
		return Decimal.pow(10, y)
	}
	if (!hasAch("r36")) return Number.MAX_VALUE
	let x = Decimal.pow(Number.MAX_VALUE, 10)

	if (player.currentChallenge == "postcngm3_1") x = E(1e60)
	else if (player.currentChallenge != "") x = Decimal.pow(10, 1000)

	if (player.infinityUpgrades.includes("postinfi53")) x = x.pow(1 + tmp.cp / 3)

	return x
}

function getOrSubResourceTD(tier, ngm4, sub) {
	if (sub == undefined) {
		if (ngm4) return player.money.min(getMaxTDCost())
		return player.eternityPoints
	} else {
		if (ngm4) player.money = player.money.sub(player.money.min(sub))
		else player.eternityPoints = player.eternityPoints.sub(player.eternityPoints.min(sub))
	}
}

function buyMaxTimeDimension(tier, ngm4 = false, bulk) {
	var dim = player['timeDimension' + tier]
	var res = getOrSubResourceTD(tier, inNGM(4))

	if (inNGM(4) && getAmount(1) < 1) return
	if (aarMod.maxHighestTD && tier < 8 && (player["timeDimension" + (tier + 1)].bought > 0 || player["timeDimension" + (tier + 1)].boughtAntimatter > 0 && inNGM4Respec())) return
	if (!isTDUnlocked(tier)) return
	if (res.lt(dim.cost) && !inNGM(4) || res.lt(dim.costAntimatter) && inNGM(4)) return

	if (inNGM(4)) {
		var costMultSelect = inNGM4Respec ? 2 : 1
		var toBuy = Math.max(Math.floor(res.div(dim.costAntimatter).mul(timeDimCostMults[costMultSelect][tier] - 1).add(1).log(timeDimCostMults[costMultSelect][tier])), 0)
		if (bulk) toBuy = Math.min(toBuy,bulk)
		getOrSubResourceTD(tier, true, E_pow(timeDimCostMults[costMultSelect][tier], toBuy).sub(1).div(timeDimCostMults[costMultSelect][tier] - 1).mul(dim.costAntimatter))
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

	if (ngm4) {
		dim.amount = dim.amount.add(toBuy);
		dim.boughtAntimatter += toBuy
	} else {
		dim.amount = dim.amount.add(toBuy);
		dim.bought += toBuy
	}

	if (inNGM(4)) {
		//dim.power = E(getDimensionPowerMultiplier()).sqrt().mul(dim.power)
	} else {
		dim.power = dim.power.mul(E_pow(mod.rs ? 3 : 2, toBuy))
	}

	dim.cost = timeDimCost(tier, dim.bought)
	if (inNGM(4)) dim.costAntimatter = timeDimCost(tier, dim.boughtAntimatter, 1)
}

function buyMaxTimeDimensions(purchaseWithAM) {
	// if you're in NG-4... naturally you will want to buy with antimatter initially
	// otherwise, or if you will eventually purchase with EP, you don't necessarily want to buy with antimatter
	purchaseWithAM = player.eternities < 1 && inNGM(4)
	for (var i = 1; i <= 8; i++) buyMaxTimeDimension(i, purchaseWithAM)
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
		el("td" + id + 'Auto').textContent = "Auto: " + (turnOn ? "ON" : "OFF")
	}
	el("maxTimeDimensions").style.display = turnOn ? "none" : ""
}

function nonERFreeTickUpdating(){
	let threshold = 1.33
	let easier = inOnlyNGM(2)
	if (easier) {
		threshold = hasTimeStudy(171) ? 1.1 : 1.15
		if (inNGM(3) && !inNGM4Respec()) threshold = hasTimeStudy(171) ? 1.03 : 1.05
	} else if (hasTimeStudy(171)) {
		threshold = 1.25
		if (mod.ngmu) threshold -= 0.08
	}
	if (QCIntensity(7)) threshold *= tmp.qu.chal.reward[7]
	if (threshold < 1.1 && inNGM(2)) threshold = 1 + 0.1 / (2.1 - threshold)
	if (threshold < 1.01 && inNGM(2)) threshold = 1.005 + 0.005 / (2.01 - threshold)

	if(aarMod.newGame4MinusRespeccedVersion){
		threshold = 1.15;
		if(hasTimeStudy(171))threshold = 1.13;
		player.tickThreshold = E_pow(threshold, player.totalTickGained);
		let gain = Math.ceil(softcap(E(player.timeShards),"ts_ngm4r").dividedBy(player.tickThreshold).log10()/Math.log10(threshold))
		if(gain<0)gain=0;
		player.totalTickGained += gain
		player.tickspeed = player.tickspeed.mul(E_pow(tmp.gal.ts, gain))
		player.postC3Reward = E_pow(getIC3Mult(), gain * getIC3EffFromFreeUpgs()).mul(player.postC3Reward)
	}else{
		const gain = Math.ceil(E(player.timeShards).dividedBy(player.tickThreshold).log10()/Math.log10(threshold))
		player.totalTickGained += gain
		player.tickspeed = player.tickspeed.mul(E_pow(tmp.gal.ts, gain))
		player.postC3Reward = E_pow(getIC3Mult(), gain * getIC3EffFromFreeUpgs()).mul(player.postC3Reward)
	}

	const base = aarMod.newGame4MinusRespeccedVersion ? 1 : inNGM(4) ? 0.01 : inNGM(3) ? .1 : 1
	player.tickThreshold = E_pow(threshold, player.totalTickGained).mul(base)
	el("totaltickgained").textContent = "You've gained " + getFullExpansion(player.totalTickGained) + " tickspeed upgrades."
	tmp.tickUpdate = true
}
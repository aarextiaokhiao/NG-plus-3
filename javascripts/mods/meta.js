//meta dimensions
function getMetaAntimatterStart(bigRip) {
	let x = 10
	if (speedrunMilestonesReached >= 19 && !bigRip) x = 1e25
	else if (player.achievements.includes("ngpp12")) x = 100
	return new Decimal(x)
}

function getDilationMetaDimensionMultiplier() {
	let pow = 0.1
	let div = 1e40
	if (isNanoEffectUsed("dt_to_ma_exp")) if (tmp.nf.effects.dt_to_ma_exp) pow = tmp.nf.effects.dt_to_ma_exp //this is a quick fix, but we need to fix this bug
	if (player.aarexModifications.nguspV !== undefined) div = 1e50
	if (player.aarexModifications.ngudpV && !player.aarexModifications.nguepV) {
		let l = tmp.qu.colorPowers.b.plus(10).log10()
		let x = 3 - Math.log10(l + 1)
		if (player.aarexModifications.ngumuV) {
			if (x < 2) x = 2 - 2 * (2 - x) / (5 - x)
		} else {
			x = Math.max(x, 2)
			if (l > 5000) x -= Math.min(Math.log10(l - 4900) - 2, 2) / 3
		}
		pow /= x
	}
	let ret = player.dilation.dilatedTime.div(div).pow(pow).plus(1)
	return ret
}

function getMetaDimensionMultiplier(tier) {
	if (player.currentEternityChall === "eterc11") return new Decimal(1)
	let ret = Decimal.pow(getPerTenMetaPower(), Math.floor(player.meta[tier].bought / 10))
	ret = ret.times(Decimal.pow(getMetaBoostPower(), Math.max(player.meta.resets + 1 - tier, 0)))
	ret = ret.times(tmp.mdgm) //Global multiplier of all Meta Dimensions
	//Quantum upgrades
	if (tier == 1 && GUBought("rg3")) ret = ret.times(getRG3Effect())

	//QC Rewards:
	if (tier % 2 > 0) ret = ret.times(tmp.qcRewards[4])
	
	//Achievements:
	if (tier == 8 && player.achievements.includes("ng3p22")) ret = ret.times(1 + Math.pow(player.meta[1].amount.plus(1).log10() / 10, 2))
	if (tier == 1 && player.achievements.includes("ng3p31")) ret = ret.times(player.meta.antimatter.plus(1).pow(.001))
	if (!tmp.ngp3l && tier == 1 && player.achievements.includes("ng3p17")) ret = ret.times(Math.max(1,Math.log10(player.totalmoney.plus(10).log10())))
	
	ret = dilates(dilates(ret.max(1), 2), "meta")
	if (player.dilation.upgrades.includes("ngmm8")) ret = ret.pow(getDil71Mult())
	return ret
}

function getMetaDimensionGlobalMultiplier() {
	let ret = getDilationMetaDimensionMultiplier()
	if (player.dilation.upgrades.includes("ngpp3")) ret = ret.times(getDil14Bonus())
	if (player.achievements.includes("ngpp12")) ret = ret.times(1.1)
	if (tmp.ngp3) {
		//Mastery Study Boosts
		if (player.masterystudies.includes("t262")) ret = ret.times(getMTSMult(262))
		if (player.masterystudies.includes("t282")) ret = ret.times(getMTSMult(282))
		if (player.masterystudies.includes("t303")) ret = ret.times(getMTSMult(303))
		if (player.masterystudies.includes("t351")) ret = ret.times(getMTSMult(351))
		if (player.masterystudies.includes("t373")) ret = ret.times(getMTSMult(373))
		if (player.masterystudies.includes("t382")) ret = ret.times(getMTSMult(382))
		if (player.masterystudies.includes("t383")) ret = ret.times(getMTSMult(383))
		if (player.masterystudies.includes("t393")) ret = ret.times(getMTSMult(393))
		//Qunatum Upgrades
		if (GUBought("br4")) ret = ret.times(Decimal.pow(getDimensionPowerMultiplier(), 0.0003).max(1))
		//QC Rewards
		ret = ret.times(tmp.qcRewards[3])
		ret = ret.times(tmp.qcRewards[6])
		//Achievement Rewards
		if (!tmp.ngp3l) {
			var ng3p13exp = Math.pow(Decimal.plus(quantumWorth, 1).log10(), 0.75)
			if (ng3p13exp > 1000) ng3p13exp = Math.pow(7 + Math.log10(ng3p13exp), 3)
			if (player.achievements.includes("ng3p13")) ret = ret.times(Decimal.pow(8, ng3p13exp))
			if (player.achievements.includes("ng3p57")) ret = ret.times(1 + player.timeShards.plus(1).log10())
		}
	}
	
	return ret
}

function getPerTenMetaPower() {
	let r = 2
	let exp = 1
	if (player.dilation.upgrades.includes("ngpp4")) r = getDil15Bonus()
	if (hasBosonicUpg(25)) exp = tmp.blu[25]
	return Math.pow(r, exp)
}

function getMetaBoostPower() {
	if (inQC(8)) return 1
	let r = 2
	let exp = 1
	if (player.dilation.upgrades.includes("ngpp4")) r = getDil15Bonus()
	if (tmp.ngp3) {
		if (isNanoEffectUsed("meta_boost_power")) r = tmp.nf.effects.meta_boost_power
		if (player.masterystudies.includes("t312")) exp = 1.045
		if (!tmp.ngp3l && player.achievements.includes("ng3p26")) exp *= Math.log10(9 + Math.max(player.meta.resets / 75 + 0.25, 1))
	}
	if (player.achievements.includes("ngpp14")) r *= 1.01
	return Math.pow(r, exp)
}

function getMetaDimensionDescription(tier) {
	if (tier > Math.min(7, player.meta.resets + 3) - (inQC(4) ? 1 : 0)) return getFullExpansion(player.meta[tier].bought) + ' (' + dimMetaBought(tier) + ')';
	else return shortenDimensions(player.meta[tier].amount) + ' (' + dimMetaBought(tier) + ')  (+' + formatValue(player.options.notation, getMetaDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getMetaDimensionRateOfChange(tier) {
	let toGain = getMetaDimensionProduction(tier + (inQC(4) ? 2 : 1));

	var current = player.meta[tier].amount.max(1);
	if (player.aarexModifications.logRateChange) {
		var change = current.add(toGain.div(10)).log10() - current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change  = toGain.times(10).dividedBy(current);

	return change;
}

function canBuyMetaDimension(tier) {
    if (tier > player.meta.resets + 4) return false;
    if (speedrunMilestonesReached < 17 && tier > 1 && player.meta[tier - 1].amount.eq(0)) return false;
    return true;
}

function clearMetaDimensions () { //Resets costs and amounts
	for (var i = 1; i <= 8; i++) {
		player.meta[i].amount = new Decimal(0);
		player.meta[i].bought = 0;
		player.meta[i].cost = new Decimal(initCost[i]);
	}
}

function getMetaShiftRequirement() { 
	var mdb = player.meta.resets
	var data = {tier: Math.min(8, mdb + 4), amount: 20}
	var inQC4 = inQC(4)
	data.mult = inQC4 ? 5.5 : 15
	if (tmp.ngp3) if (player.masterystudies.includes("t312")) data.mult -= 1
	data.amount += data.mult * Math.max(mdb - 4, 0)
	if (tmp.ngp3) if (player.masterystudies.includes("d13")) data.amount -= getTreeUpgradeEffect(1)
	if (ghostified) if (hasNU(1)) data.amount -= tmp.nu[0]

	data.scalingStart = inQC4 ? 55 : 15
	if (player.meta.resets >= data.scalingStart) {
		var multAdded = inQC4 ? 14.5 : 5
		data.amount += multAdded * (mdb - data.scalingStart)
		data.mult += multAdded
	}
	
	return data
}

function getMetaDimensionBoostRequirement(){
	return getMetaShiftRequirement()
}

function metaBoost() {
	let req = getMetaShiftRequirement()
	let isNU1ReductionActive = hasNU(1) ? !tmp.qu.bigRip.active : false
	if (!(player.meta[req.tier].bought>=req.amount)) return
	if (isRewardEnabled(27) && req.tier > 7) {
		if (isNU1ReductionActive) {
			if (player.meta.resets < req.scalingStart) {
				player.meta.resets = Math.min(player.meta.resets + Math.floor((player.meta[8].bought - req.amount) / (req.mult + 1)) + 1, req.scalingStart)
				if (player.meta.resets == req.scalingStart) req = getMetaShiftRequirement()
			}
			if (player.meta.resets >= req.scalingStart && player.meta.resets < 110) {
				player.meta.resets=Math.min(player.meta.resets + Math.floor((player.meta[8].bought - req.amount) / (req.mult + 1)) + 1,110)
				if (player.meta.resets>109) req=getMetaShiftRequirement()
			}
			if (player.meta.resets > 109) player.meta.resets += Math.floor((player.meta[8].bought - req.amount) / req.mult) + 1
		} else {
			if (player.meta.resets < req.scalingStart) {
				player.meta.resets = Math.min(player.meta.resets + Math.floor((player.meta[8].bought - req.amount) / req.mult) + 1, req.scalingStart)
				if (player.meta.resets == req.scalingStart) req = getMetaShiftRequirement()
			}
			if (player.meta.resets >= req.scalingStart) player.meta.resets += Math.floor((player.meta[8].bought - req.amount) / req.mult) + 1
		}
		if (inQC(4)) if (player.meta[8].bought >= getMetaShiftRequirement().amount) player.meta.resets++
	} else player.meta.resets++
	if (!tmp.ngp3l && player.achievements.includes("ng3p72")) return
	player.meta.antimatter = getMetaAntimatterStart()
	clearMetaDimensions()
	if (!tmp.ngp3 || !tmp.qu.bigRip.active) document.getElementById("quantumbtn").style.display="none"
}


function getMetaDimensionCostMultiplier(tier) {
	return costMults[tier];
}

function dimMetaBought(tier) {
	return player.meta[tier].bought % 10;
}

function metaBuyOneDimension(tier) {
	var cost = player.meta[tier].cost;
	if (!canBuyMetaDimension(tier)) return false;
	if (!canAffordMetaDimension(cost)) return false;
	player.meta.antimatter = player.meta.antimatter.minus(cost);
	player.meta[tier].amount = player.meta[tier].amount.plus(1);
	player.meta[tier].bought++;
	if (player.meta[tier].bought % 10 < 1) {
		player.meta[tier].cost = getMetaCost(tier, player.meta[tier].bought/10)
	}
	if (tier > 7) giveAchievement("And still no ninth dimension...")
	return true;
}

function getMetaCost(tier, boughtTen) {
	let cost = Decimal.times(initCost[tier], costMults[tier].pow(boughtTen))
	let scalingStart = Math.ceil(Decimal.div(getMetaCostScalingStart(), initCost[tier]).log(costMults[tier]))
	if (boughtTen >= scalingStart) cost = cost.times(Decimal.pow(10, (boughtTen-scalingStart + 1) * (boughtTen-scalingStart + 2) / 2))
	return cost
}

function getMetaCostScalingStart() {
	return tmp.ngp3l ? "1e1100" : "1e900"
}

function getMetaMaxCost(tier) {
	return player.meta[tier].cost.times(10 - dimMetaBought(tier));
}

function metaBuyManyDimension(tier) {
	var cost = getMetaMaxCost(tier);
	if (!canBuyMetaDimension(tier)) {
		return false;
	}
	if (!canAffordMetaDimension(cost)) {
		return false;
	}
	player.meta.antimatter = player.meta.antimatter.minus(cost);
	player.meta[tier].amount = player.meta[tier].amount.plus(10 - dimMetaBought(tier));
	player.meta[tier].bought += 10 - dimMetaBought(tier)
	player.meta[tier].cost = getMetaCost(tier, player.meta[tier].bought / 10)
	if (tier > 7) giveAchievement("And still no ninth dimension...")
	return true;
}

function buyMaxMetaDimension(tier) {
	if (!canBuyMetaDimension(tier)) return
	if (getMetaMaxCost(tier).gt(player.meta.antimatter)) return
	var currentBought = Math.floor(player.meta[tier].bought / 10)
	var bought = player.meta.antimatter.div(10).div(initCost[tier]).log(costMults[tier]) + 1
	var scalingStart = Math.ceil(Decimal.div(getMetaCostScalingStart(), initCost[tier]).log(costMults[tier]))
	if (bought >= scalingStart) {
		let b = costMults[tier].log10() + 0.5
		bought=Math.sqrt(b * b + 2 * (bought - scalingStart) * costMults[tier].log10()) - b + scalingStart
	}
	bought = Math.floor(bought) - currentBought
	var num = bought
	var tempMA = player.meta.antimatter
	if (num > 1) {
		while (num > 0) {
			var temp = tempMA
			var cost = getMetaCost(tier,currentBought + num - 1).times(num > 1 ? 10 : 10 - dimMetaBought(tier))
			if (cost.gt(tempMA)) {
				tempMA = player.meta.antimatter.sub(cost)
				bought--
			} else tempMA = tempMA.sub(cost)
			if (temp.eq(tempMA) || currentBought + num > 9007199254740991) break
			num--
		}
	} else {
		tempMA = tempMA.sub(getMetaCost(tier, currentBought).times(10 - dimMetaBought(tier)))
		bought = 1
	}
	player.meta.antimatter = tempMA
	player.meta[tier].amount = player.meta[tier].amount.add(bought * 10 - dimMetaBought(tier))
	player.meta[tier].bought += bought * 10 - dimMetaBought(tier)
	player.meta[tier].cost = getMetaCost(tier, currentBought + bought)
	if (tier >= 8) giveAchievement("And still no ninth dimension...")
}

function canAffordMetaDimension(cost) {
	return cost.lte(player.meta.antimatter);
}

for (let i = 1; i <= 8; i++) {
	document.getElementById("meta" + i).onclick = function () {
		if (speedrunMilestonesReached > i + 5) player.autoEterOptions["md" + i] = !player.autoEterOptions["md" + i]
		else metaBuyOneDimension(i);
		if (speedrunMilestonesReached > 27) {
			var removeMaxAll=false
			for (var d = 1; d < 9; d++) {
				if (player.autoEterOptions["md" + d]) {
					if (d > 7) removeMaxAll = true
				} else break
			}
			document.getElementById("metaMaxAllDiv").style.display = removeMaxAll ? "none" : ""
		}
	}
	document.getElementById("metaMax" + i).onclick = function () {
		if (shiftDown && speedrunMilestonesReached > i + 5) metaBuyOneDimension(i)
		else metaBuyManyDimension(i);
	}
}

document.getElementById("metaMaxAll").onclick = function () {
	for (let i = 1; i <= 8; i++) buyMaxMetaDimension(i)
}

document.getElementById("metaSoftReset").onclick = function () {
	metaBoost();
}

function getMetaDimensionProduction(tier) {
	let ret = player.meta[tier].amount.floor()
	if (inQC(4)) {
		if (tier == 1) ret = ret.plus(player.meta[2].amount.floor().pow(1.3))
		else if (tier == 4) ret = ret.pow(1.5)
	}
	return ret.times(getMetaDimensionMultiplier(tier));
}

function getExtraDimensionBoostPower() {
	if (player.currentEternityChall=="eterc14" || inQC(7)) return new Decimal(1)
	let r = getExtraDimensionBoostPowerUse()
	r = Decimal.pow(r, getExtraDimensionBoostPowerExponent(r)).max(1)
	if (!inQC(3)) r = r.add(1)
	if (player.aarexModifications.nguspV) {
		let l = r.log(2)
		if (l > 1024) r = Decimal.pow(2,Math.pow(l * 32, 2/3))
	}
	return r
}

function getExtraDimensionBoostPowerUse() {
	if (!tmp.ngp3l && player.achievements.includes("ng3p71")) return player.meta.bestOverQuantums
	return player.meta.bestAntimatter
}

function getMADimBoostPowerExp(ma = player.meta.antimatter){
	getExtraDimensionBoostPowerExponent(ma)
}

function getExtraDimensionBoostPowerExponent(ma) {
	let power = 8
	if (inQC(3)) {
		power = Math.pow(ma.log10() / 8, 2)
		if (!tmp.ngp3l && power > 1e8) power = Math.pow(power * 1e6, 4/7)
		return power
	}
	if (player.dilation.upgrades.includes("ngpp5")) power++
	power += getECReward(13)
	if (tmp.ngp3) {
		if (isNanoEffectUsed("ma_effect_exp")) power += tmp.nf.effects.ma_effect_exp
		if (player.masterystudies.includes("d13")) power += getTreeUpgradeEffect(8)
	}
	return power
}

function getDil14Bonus() {
	return 1 + Math.log10(1 - Math.min(0, player.tickspeed.log(10)));
}

function getDil17Bonus() {
	return Math.sqrt(player.meta.bestAntimatter.max(1).log10()) / (player.masterystudies ? 1 : 2);
}

function updateOverallMetaDimensionsStuff(){
	document.getElementById("metaAntimatterAmount").textContent = shortenMoney(player.meta.antimatter)
	document.getElementById("metaAntimatterBest").textContent = shortenMoney(player.meta.bestAntimatter)
	document.getElementById("bestAntimatterQuantum").textContent = player.masterystudies && quantumed ? "Your best" + (ghostified ? "" : "-ever") + " meta-antimatter" + (ghostified ? " in this Ghostify" : "") + " was " + shortenMoney(player.meta.bestOverQuantums) + "." : ""
	document.getElementById("bestAntimatterTranslation").innerHTML = (tmp.ngp3 && player.aarexModifications.nguspV === undefined && player.currentEternityChall != "eterc14" && (inQC(3) || tmp.qu.nanofield.rewards >= 2) && !inQC(7)) ? 'Raised to the power of <span id="metaAntimatterPower" style="font-size:35px; color: black">'+formatValue(player.options.notation, getExtraDimensionBoostPowerExponent(getExtraDimensionBoostPowerUse()), 2, 1)+'</span>, t' : "T"
	setAndMaybeShow("bestMAOverGhostifies", ghostified, '"Your best-ever meta-antimatter was " + shortenMoney(player.meta.bestOverGhostifies) + "."')
	document.getElementById("metaAntimatterEffect").textContent = shortenMoney(getExtraDimensionBoostPower())
	document.getElementById("metaAntimatterPerSec").textContent = 'You are getting ' + shortenDimensions(getMetaDimensionProduction(1)) + ' meta-antimatter per second.'
}

function updateMetaDimensions () {
	updateOverallMetaDimensionsStuff()
	let showDim = false
	let useTwo = player.options.notation=="Logarithm" ? 2 : 0
	for (let tier = 8; tier > 0; tier--) {
		showDim = showDim || canBuyMetaDimension(tier)
		document.getElementById(tier + "MetaRow").style.display = showDim ? "" : "none"
		if (showDim) {
			document.getElementById(tier + "MetaD").textContent = DISPLAY_NAMES[tier] + " Meta Dimension x" + formatValue(player.options.notation, getMetaDimensionMultiplier(tier), 2, 1)
			document.getElementById("meta" + tier + "Amount").textContent = getMetaDimensionDescription(tier)
			document.getElementById("meta" + tier).textContent = speedrunMilestonesReached > tier + 5 ? "Auto: " + (player.autoEterOptions["md" + tier] ? "ON" : "OFF") : "Cost: " + formatValue(player.options.notation, player.meta[tier].cost, useTwo, 0) + " MA"
			document.getElementById('meta' + tier).className = speedrunMilestonesReached > tier + 5 ? "storebtn" : canAffordMetaDimension(player.meta[tier].cost) ? 'storebtn' : 'unavailablebtn'
			document.getElementById("metaMax"+tier).textContent = (speedrunMilestonesReached > tier + 5 ? (shiftDown ? "Singles: " : ghostified ? "":"Cost: ") : "Until 10: ") + formatValue(player.options.notation, ((shiftDown && speedrunMilestonesReached > tier + 5) ? player.meta[tier].cost : getMetaMaxCost(tier)), useTwo, 0) + " MA"
			document.getElementById('metaMax' + tier).className = canAffordMetaDimension((shiftDown && speedrunMilestonesReached > tier + 5) ? player.meta[tier].cost : getMetaMaxCost(tier)) ? 'storebtn' : 'unavailablebtn'
		}
	}
	var isMetaShift = player.meta.resets < 4
	var metaShiftRequirement = getMetaShiftRequirement()
		document.getElementById("metaResetLabel").textContent = 'Meta-Dimension ' + (isMetaShift ? "Shift" : "Boost") + ' ('+ getFullExpansion(player.meta.resets) +'): requires ' + getFullExpansion(Math.floor(metaShiftRequirement.amount)) + " " + DISPLAY_NAMES[metaShiftRequirement.tier] + " Meta Dimensions"
		document.getElementById("metaSoftReset").textContent = "Reset meta-dimensions for a " + (isMetaShift ? "new dimension" : "boost")
	if (player.meta[metaShiftRequirement.tier].bought >= metaShiftRequirement.amount) {
		document.getElementById("metaSoftReset").className = 'storebtn'
	} else {
		document.getElementById("metaSoftReset").className = 'unavailablebtn'
	}
	var bigRipped = tmp.ngp3 && tmp.qu.bigRip.active
	var req = getQuantumReq()
	var reqGotten = isQuantumReached()
	var newClassName = reqGotten ? (bigRipped && player.options.theme == "Aarex's Modifications" ? "" : "storebtn ") + (bigRipped ? "aarexmodsghostifybtn" : "") : 'unavailablebtn'
	var message = 'Lose all your previous progress, but '
	document.getElementById("quantumResetLabel").textContent = (bigRipped ? 'Ghostify' : 'Quantum') + ': requires ' + shorten(req) + ' meta-antimatter ' + (!inQC(0) ? "and " + shortenCosts(Decimal.pow(10, getQCGoal())) + " antimatter" : player.masterystudies ? "and an EC14 completion" : "")
	if (reqGotten && bigRipped && ghostified) {
		var GS = getGHPGain()
		message += "gain " + shortenDimensions(GS) + " Ghost Particle" + (GS.lt(2) ? "" : "s")
	} else if (reqGotten && !bigRipped && (tmp.qu.times || player.ghostify.milestones)) {
		var QS = quarkGain()
		message += "gain " + shortenDimensions(QS) + " quark" + (QS.lt(2) ? "" : "s") + " for boosts"
	} else message += "get a boost"
	document.getElementById("quantum").textContent = message
	if (document.getElementById("quantum").className !== newClassName) document.getElementById("quantum").className = newClassName
}

function getDil15Bonus() {
	let x = 1
	let max = 3
	if (ghostified && player.ghostify.neutrinos.boosts >= 3) {
		if (tmp.ngp3l) max = tmp.nb[3]
		else {
			x = tmp.nb[3]
			max = 1/0
		}
	}
	if (player.aarexModifications.nguspV !== undefined) x *= Math.min(Math.max(player.dilation.dilatedTime.max(1).log10() / 10 - 6.25, 2), max)
	else x *= Math.min(Math.log10(player.dilation.dilatedTime.max(1e10).log(10)) + 1, max)
	return x
}

function getMetaUnlCost() {
	if (player.aarexModifications.nguspV) return 1e21
	return 1e24
}
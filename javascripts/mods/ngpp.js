function getMetaAntimatterStart(bigRip) {
	let x = 10
	if (speedrunMilestonesReached >= 19 && !bigRip) x = 1e25
	else if (player.achievements.includes("ngpp12")) x = 100
	return new Decimal(x)
}

function getDilationMetaDimensionMultiplier() {
	let pow = 0.1
	let div = 1e40
	if (isNanoEffectUsed("dt_to_ma_exp")) pow = tmp.nf.effects.dt_to_ma_exp
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


function getMetaShiftRequirement() { //what does data.mult do? it doesnt seem to be used for anything but idk maybe it is
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
	if (player.meta.resets >= 10) giveAchievement("Meta-boosting to the max")
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
	if (!canBuyMetaDimension(tier)) {
		return false;
	}
	if (!canAffordMetaDimension(cost)) {
		return false;
	}
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
	let scalingStart=Math.ceil(Decimal.div(getMetaCostScalingStart(), initCost[tier]).log(costMults[tier]))
	if (boughtTen>=scalingStart) cost=cost.times(Decimal.pow(10, (boughtTen-scalingStart + 1) * (boughtTen-scalingStart + 2) / 2))
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

// v2.2
function updateAutoEterMode() {
	var modeText = ""
	var modeCond = ""
	document.getElementById("priority13").disabled = false
	document.getElementById("autoEterValue").disabled = false
	if (player.autoEterMode == "time") {
		modeText = "time"
		modeCond = "Seconds between eternities:"
	} else if (player.autoEterMode == "relative") {
		modeText = "X times last eternity"
		modeCond = modeText + ":"
	} else if (player.autoEterMode == "relativebest") {
		modeText = "X times best of last 10"
		modeCond = modeText + " eternities:"
	} else if (player.autoEterMode == "replicanti") {
		modeText = "replicanti"
		modeCond = "Amount of replicanti to wait until reset:"
	} else if (player.autoEterMode == "peak") {
		modeText = "peak"
		modeCond = "Seconds to wait after latest peak gain:"
	} else if (player.autoEterMode == "eternitied") {
		modeText = "X times eternitied"
		modeCond = modeText + ":"
	} else if (player.autoEterMode == "manual") {
		modeText = "dilate only"
		modeCond = "Does nothing to eternity"
		document.getElementById("priority13").disabled = true
		document.getElementById("autoEterValue").disabled = true
	} else {
		modeText = "amount"
		modeCond = "Amount of EP to wait until reset:"
	}
	document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: " + modeText
	document.getElementById("eterlimittext").textContent = modeCond
	if (player.achievements.includes("ng3p52")) {
		document.getElementById("autoEterMode").textContent = "Mode: " + modeText
		document.getElementById("autoEterCond").textContent = modeCond
	}
}

function toggleAutoEterMode() {
	if (player.autoEterMode == "amount") player.autoEterMode = "time"
	else if (player.autoEterMode == "time") player.autoEterMode = "relative"
	else if (player.autoEterMode == "relative") player.autoEterMode = "relativebest"
	else if (player.autoEterMode == "relativebest" && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 4e11 && player.aarexModifications.newGame3PlusVersion) player.autoEterMode = "replicanti"
	else if (player.autoEterMode == "replicanti" && getEternitied() >= 1e13) player.autoEterMode = "peak"
	else if (player.autoEterMode == "peak" && player.achievements.includes("ng3p51")) player.autoEterMode = "eternitied"
	else if ((player.autoEterMode == "peak" || player.autoEterMode == "eternitied") && speedrunMilestonesReached > 24) player.autoEterMode = "manual"
	else if (player.autoEterMode) player.autoEterMode = "amount"
	updateAutoEterMode()
}

// v2.21
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

// v2.3
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
		document.getElementById("td" + id + 'auto').textContent = "Auto: " + (turnOn ? "ON" : "OFF")
	}
	document.getElementById("maxTimeDimensions").style.display = turnOn ? "none" : ""
}

function toggleAutoEter(id) {
	player.autoEterOptions[id] = !player.autoEterOptions[id]
	document.getElementById(id + 'auto').textContent = (id == "dilUpgs" ? "Auto-buy dilation upgrades" : (id == "rebuyupg" ? "Rebuyable upgrade a" : id == "metaboost" ? "Meta-boost a" : "A") + "uto") + ": " + (player.autoEterOptions[id] ? "ON" : "OFF")
	if (id.slice(0,2) == "td") {
		var removeMaxAll = false
		for (var d = 1; d < 9; d++) {
			if (player.autoEterOptions["td" + d]) {
				if (d > 7) removeMaxAll = true
			} else break
		}
		document.getElementById("maxTimeDimensions").style.display = removeMaxAll ? "none" : ""
	}
}

function doAutoEterTick() {
	if (!player.meta) return
	if (player.achievements.includes("ngpp17")) {
		if (player.masterystudies == undefined || tmp.be || !tmp.qu.bigRip.active) for (var d = 1; d < 9; d++) if (player.autoEterOptions["td" + d]) buyMaxTimeDimension(d)
		if (player.autoEterOptions.epmult) buyMaxEPMult()
		if (player.autoEterOptions.blackhole) {
			buyMaxBlackholeDimensions()
			feedBlackholeMax()
		}
	}
	if (player.autoEterOptions.tt && !player.dilation.upgrades.includes(10) && speedrunMilestonesReached > 1) maxTheorems()
}

// v2.301
function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk = !player.galaxyMaxBulk
	document.getElementById('replicantibulkmodetoggle').textContent = "Mode: " + (player.galaxyMaxBulk ? "Max" : "Singles")
}

// v2.9
quantumed = false
function quantum(auto, force, challid, bigRip = false, quick) {
    if (player.masterystudies !== undefined) if (!auto && !force && tmp.qu.bigRip.active) force = true
	if (!(isQuantumReached()||force)||implosionCheck) return
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !tmp.ngp3
	if (player.aarexModifications.quantumConf&&!(auto||force)) if (!confirm(player.masterystudies?"Quantum will reset everything eternity resets, and "+(headstart?"also some other things like dilation":"also time studies, eternity challenges, dilation, "+(tmp.ngp3?"meta dimensions, and mastery studies":"and meta dimensions"))+". You will gain a quark and unlock various upgrades.":"But wait! Quantum will erases almost everything that you have and rewards nothing! However, this is not a win. You need to reach real Infinite antimatter to win! (it's impossible)")) return
	if (!quantumed) if (!confirm("Are you sure you want to do that? You will lose everything you have!")) return
	var pc=challid-8
	if (tmp.ngp3) {
		tmp.preQCMods=tmp.qu.qcsMods.current
		tmp.qu.qcsMods.current=[]
		if (challid > 0) {
			var abletostart=false
			if (pc > 0) {
				if (tmp.qu.pairedChallenges.order[pc]) if (tmp.qu.pairedChallenges.order[pc].length > 1) abletostart = true
			} else if (!pcFocus) abletostart = true
			if (abletostart) {
				if (pc > 0) if (tmp.qu.pairedChallenges.completed + 1 < pc) return
				if (tmp.qu.electrons.amount < getQCCost(challid) || !inQC(0)) return
				if (bigRip) {
					var qc1 = tmp.qu.pairedChallenges.order[pc][0]
					var qc2 = tmp.qu.pairedChallenges.order[pc][1]
					var qc1st = Math.min(qc1, qc2)
					var qc2st = Math.max(qc1, qc2)
					if (qc1st != 6 || qc2st != 8) return
					if (tmp.qu.bigRip.conf && !auto) if (!confirm("Big ripping the universe starts PC6+8 with only quantum stuff. However, only dilation upgrades boost dilation except upgrades that multiply TP gain until you buy the eleventh upgrade. NOTE: If you can beat PC6+8, you will earn a grand reward. You can give your Time Theorems and Time Studies back by undoing Big Rip.")) return
				} else if (pc > 0) {
					if (player.options.challConf || (tmp.qu.pairedChallenges.completions.length < 1 && !ghostified)) if (!confirm("You will start a Quantum Challenge, but you need to do 2 challenges at one. Completing it boosts the rewards of Quantum Challenges that you chose in this Paired Challenge. NOTE: You will keep electrons & sacrificed galaxies, but they don't work in this Challenge.")) return
				} else if (player.options.challConf || (QCIntensity(1) == 0 && !ghostified)) if (!confirm("You will do a quantum reset but you will not gain quarks, and keep your electrons & sacrificed galaxies, and you can't buy electron upgrades. You have to reach the set goal of antimatter to complete this challenge. NOTE: Electrons and banked eternities do nothing in quantum challenges and your electrons and sacrificed galaxies do not reset until you end the challenge.")) return
				tmp.qu.electrons.amount -= getQCCost(challid)
				if (!quick) for (var m = 0; m < qcm.on.length; m++) if (ranking >= qcm.reqs[qcm.on[m]] || !qcm.reqs[qcm.on[m]]) tmp.qu.qcsMods.current.push(qcm.on[m])
			} else if (pcFocus && pc < 1) {
				if (!assigned.includes(challid)) {
					if (!tmp.qu.pairedChallenges.order[pcFocus]) tmp.qu.pairedChallenges.order[pcFocus]=[challid]
					else {
						tmp.qu.pairedChallenges.order[pcFocus].push(challid)
						pcFocus=0
					}
					updateQuantumChallenges()
				}
				return
			} else if (pcFocus != pc) {
				pcFocus = pc
				updateQuantumChallenges()
				return
			} else {
				pcFocus = 0
				updateQuantumChallenges()
				return
			}
		}
		if (speedrunMilestonesReached > 3 && !isRewardEnabled(4)) {
			for (var s = 0; s < player.masterystudies.length; s++) {
				if (player.masterystudies[s].indexOf("t") >= 0) player.timestudy.theorem += masteryStudies.costs.time[player.masterystudies[s].split("t")[1]]
				else player.timestudy.theorem += masteryStudies.costs.dil[player.masterystudies[s].split("d")[1]]
			}
		}
	}
	var implode = !(auto||force)&&speedrunMilestonesReached<23
	if (implode) {
		implosionCheck = 1
		dev.implode()
		setTimeout(function(){
			quantumReset(force, auto, challid, bigRip, true)
		},1000)
		setTimeout(function(){
			implosionCheck = 0
		},2000)
	} else quantumReset(force, auto, challid, bigRip)
}

function getQuantumReq() {
	return Decimal.pow(Number.MAX_VALUE, tmp.ngp3l ? 1.45 : tmp.ngp3 ? 1.4 : 1)
}

function isQuantumReached() {
	return player.money.log10() >= getQCGoal() && (player.meta.antimatter.max(player.achievements.includes("ng3p76") ? player.meta.bestOverQuantums : 0).gte(getQuantumReq(undefined, tmp.ngp3 && tmp.qu.bigRip.active))) && (!player.masterystudies || ECTimesCompleted("eterc14")) && quarkGain().gt(0)
}

function getQuarkGain(){
	return quarkGain()
}

function getQKGain(){
	return quarkGain()
}

function getQCtotalTime(){
	var temp = 0
	var count = 0
	for (var i = 1; i <= 8; i++){
		if (tmp.qu.challengeRecords[i]) {
			temp += tmp.qu.challengeRecords[i]
			count ++
		}
	}
	if (count < 8) return Infinity
	return temp
}

function getQCtoQKEffect(){
	if (tmp.ngp3l) return 1
	var time = getQCtotalTime()
	var ret = 1 + 192 * 3600 * 10 / time
	if (ret > 999) ret = 333 * Math.log10(ret + 1)
	return ret
}

let quarkGain = function () {
	let ma = player.meta.antimatter.max(1)
	if (!tmp.ngp3) return Decimal.pow(10, ma.log(10) / Math.log10(Number.MAX_VALUE) - 1).floor()
	
	if (!tmp.qu.times && !player.ghostify.milestones) return new Decimal(1)
	if (player.ghostify.milestones) ma = player.meta.bestAntimatter.max(1)

	let log = (ma.log10() - 379.4) / (player.achievements.includes("ng3p63") ? 279.8 : 280)
	let logBoost = tmp.ngp3l ? 1.2 : 2
	let logBoostExp = tmp.ngp3l ? 2 : 1.5
	if (log > logBoost) log = Math.pow(log / logBoost, logBoostExp) * logBoost
	if (log > 738 && !hasNU(8)) log = Math.sqrt(log * 738)
	if (!tmp.ngp3l) {
		let exp = 0.6
		if (tmp.newNGP3E) exp += 0.1
		if (player.achievements.includes("ng3p28")) exp *= 1.01

		var EPBonus = Math.pow(Math.max(player.eternityPoints.log10() / 1e6, 1), exp) - 1
		if (EPBonus > 5e5) EPBonus = 5e5 * Math.sqrt(EPBonus / 5e5)
		
		log += EPBonus 
		log += Math.log10(getQCtoQKEffect())
		log += player.quantum.bigRip.spaceShards.plus(1).log10()
		if (player.achievements.includes("ng3p65")) log += Math.pow(player.ghostify.ghostlyPhotons.enpowerments, 2)
	}

	var dlog = Math.log10(log)
	let start = 4 //Starts at e10k.
	if ((player.aarexModifications.ngumuV || player.aarexModifications.nguepV) && dlog > start) {
		let capped = Math.floor(Math.log10(Math.max(dlog - 2, 1)) / Math.log10(2))
		dlog = (dlog - Math.pow(2, capped) - 2) / Math.pow(2, capped) + capped + 3
		log = Math.pow(10, dlog)
	}

	return Decimal.pow(10, log).times(getQuarkMult()).floor()
}

let getQuarkMult = function () {
	x = Decimal.pow(2, tmp.qu.multPower.total)
	if (player.achievements.includes("ng3p93")) x = x.times(5)
	return x
}

function toggleQuantumConf() {
	player.aarexModifications.quantumConf = !player.aarexModifications.quantumConf
	document.getElementById("quantumConfirmBtn").textContent = "Quantum confirmation: " + (player.aarexModifications.quantumConf ? "ON" : "OFF")
}

var averageQk = new Decimal(0)
var bestQk
function updateLastTenQuantums() {
	if (!player.meta) return
	var listed = 0
	var tempTime = new Decimal(0)
	var tempQK = new Decimal(0)
	for (var i = 0; i < 10; i++) {
		if (tmp.qu.last10[i][1].gt(0)) {
			var qkpm = tmp.qu.last10[i][1].dividedBy(tmp.qu.last10[i][0] / 600)
			var tempstring = shorten(qkpm) + " QK/min"
			if (qkpm<1) tempstring = shorten(qkpm*60) + " QK/hour"
			var msg = "The quantum " + (i == 0 ? '1 quantum' : (i+1) + ' quantums') + " ago took " + timeDisplayShort(tmp.qu.last10[i][0], false, 3)
			if (tmp.qu.last10[i][2]) {
				if (typeof(tmp.qu.last10[i][2]) == "number") " in Quantum Challenge " + tmp.qu.last10[i][2]
				else msg += " in Paired Challenge " + tmp.qu.last10[i][2][0] + " (QC" + tmp.qu.last10[i][2][1][0] + "+" + tmp.qu.last10[i][2][1][1] + ")"
			}
			msg += " and gave " + shortenDimensions(tmp.qu.last10[i][1]) +" QK. "+ tempstring
			document.getElementById("quantumrun"+(i+1)).textContent = msg
			tempTime = tempTime.plus(tmp.qu.last10[i][0])
			tempQK = tempQK.plus(tmp.qu.last10[i][1])
			bestQk = tmp.qu.last10[i][1].max(bestQk)
			listed++
		} else document.getElementById("quantumrun" + (i + 1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempQK = tempQK.dividedBy(listed)
		var qkpm = tempQK.dividedBy(tempTime / 600)
		var tempstring = shorten(qkpm) + " QK/min"
		averageQk = tempQK
		if (qkpm<1) tempstring = shorten(qkpm*60) + " QK/hour"
		document.getElementById("averageQuantumRun").textContent = "Last " + listed + " quantums average time: "+ timeDisplayShort(tempTime, false, 3) + " Average QK gain: " + shortenDimensions(tempQK) + " QK. " + tempstring
	} else document.getElementById("averageQuantumRun").textContent = ""
}

//v2.9014
function doQuantumProgress() {
	var quantumReq = getQuantumReq()
	var id = 1
	if (quantumed && tmp.ngp3) {
		if (tmp.qu.bigRip.active) {
			var gg = getGHPGain()
			if (player.meta.antimatter.lt(quantumReq)) id = 1
			else if (!tmp.qu.breakEternity.unlocked) id = 4
			else if (!ghostified || player.money.lt(getQCGoal(undefined, true)) || Decimal.lt(gg, 2)) id = 5
			else if (player.ghostify.neutrinos.boosts > 8 && hasNU(12) && !player.ghostify.ghostlyPhotons.unl) id = 7
			else id = 6
		} else if (inQC(0)) {
			var gqk = quarkGain()
			if (player.meta.antimatter.gte(quantumReq) && Decimal.gt(gqk, 1)) id = 3
		} else if (player.money.lt(Decimal.pow(10, getQCGoal())) || player.meta.antimatter.gte(quantumReq)) id = 2
	}
	var className = id > 4 ? "ghostifyProgress" : "quantumProgress"
	if (document.getElementById("progressbar").className != className) document.getElementById("progressbar").className = className
	if (id == 1) {
		var percentage = Math.min(player.meta.antimatter.max(1).log10() / quantumReq.log10() * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip', (player.masterystudies ? "Meta-antimatter p" : "P") + 'ercentage to quantum')
	} else if (id == 2) {
		var percentage = Math.min(player.money.max(1).log10() / getQCGoal() * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Percentage to Quantum Challenge goal')
	} else if (id == 3) {
		var gqkLog = gqk.log2()
		var goal = Math.pow(2, Math.ceil(Math.log10(gqkLog) / Math.log10(2)))
		if (!tmp.qu.reachedInfQK) goal = Math.min(goal, 1024)
		var percentage = Math.min(gqkLog / goal * 100, 100).toFixed(2) + "%"
		if (goal > 512 && !tmp.qu.reachedInfQK) percentage = Math.min(tmp.qu.quarks.add(gqk).log2() / goal * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		if (goal > 512 && !tmp.qu.reachedInfQK) document.getElementById("progresspercent").setAttribute('ach-tooltip', "Percentage to new QoL features (" + shorten(Number.MAX_VALUE) + " QK)")
		else document.getElementById("progresspercent").setAttribute('ach-tooltip', "Percentage to " + shortenDimensions(Decimal.pow(2, goal)) + " QK gain")
	} else if (id == 4) {
		var percentage = Math.min(player.eternityPoints.max(1).log10() / 12.15, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Eternity points percentage to Break Eternity')
	} else if (id == 5) {
		var percentage = Math.min(tmp.qu.bigRip.bestThisRun.max(1).log10() / getQCGoal(undefined, true) * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Percentage to Ghostify')
	} else if (id == 6) {
		var ggLog = gg.log2()
		var goal = Math.pow(2, Math.ceil(Math.log10(ggLog) / Math.log10(2)))
		var percentage = Math.min(ggLog / goal * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip', "Percentage to " + shortenDimensions(Decimal.pow(2, goal)) + " GHP gain")
	} else if (id == 7) {
		var percentage = Math.min(tmp.qu.bigRip.bestThisRun.max(1).log10() / 6000e4, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to Ghostly Photons")
	}
}

//v2.90141
function checkUniversalHarmony() {
	if (player.achievements.includes("ngpp18")) return
	if (player.meta != undefined) {
		if (player.galaxies < 700 || player.replicanti.galaxies + extraReplGalaxies < 700 || player.dilation.freeGalaxies < 700) return
	} else if (player.exdilation != undefined) {
		if (player.galaxies != player.replicanti.galaxies || player.galaxies != player.dilation.freeGalaxies || player.galaxies < 300) return
	} else return
	giveAchievement("Universal harmony")
}

//v2.90142
function quantumReset(force, auto, challid, bigRip, implode=false) {
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !tmp.ngp3
	var pc = challid - 8
	if (implode && speedrunMilestonesReached < 1) {
		showTab("dimensions")
		showDimTab("antimatterdimensions")
		showChallengesTab("challenges")
		showInfTab("preinf")
		showEternityTab("timestudies", true)
	}
	if (!quantumed) {
		quantumed=true
		document.getElementById("quantumtabbtn").style.display=""
		document.getElementById("quarks").style.display=""
		document.getElementById("galaxyPoints2").className = "GP"
		document.getElementById("sacpos").className = "sacpos"
		if (tmp.ngp3) {
			document.getElementById("bestAntimatterType").textContent = "Your best meta-antimatter for this quantum"
			document.getElementById("quarksAnimBtn").style.display="inline-block"
		}
		if (isEmptiness) {
			showTab("dimensions")
			isEmptiness = false
			document.getElementById("quantumtabbtn").style.display = "inline-block"
			if (ghostified) document.getElementById("ghostifytabbtn").style.display = "inline-block"
		}
	}
	document.getElementById("quantumbtn").style.display = "none"
	document.getElementById("bigripbtn").style.display = "none"
	document.getElementById("ghostifybtn").style.display = "none"
	updateBankedEter()
	if (force) {
		if (bigRip && player.achievements.includes("ng3p73")) player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())
		else bankedEterGain = 0
	} else {
		for (var i = tmp.qu.last10.length - 1; i > 0; i--) {
			tmp.qu.last10[i] = tmp.qu.last10[i - 1]
		}
		var qkGain = quarkGain()
		var array = [tmp.qu.time, qkGain]
		if (!inQC(0)) {
			if (tmp.qu.pairedChallenges.current > 0) {
				array.push([tmp.qu.pairedChallenges.current, tmp.qu.challenge])
			} else {
				array.push(tmp.qu.challenge[0])
			}
		}
		tmp.qu.last10[0] = array
		if (tmp.qu.best > tmp.qu.time) {
			tmp.qu.best = tmp.qu.time
			updateSpeedruns()
		}
		tmp.qu.times++
		if (!tmp.ngp3l && tmp.qu.times >= 1e4) giveAchievement("Prestige No-lifer")
		if (!inQC(6)) {
			tmp.qu.quarks = tmp.qu.quarks.add(qkGain)
			if (!tmp.ngp3 || player.ghostify.milestones < 8) tmp.qu.quarks = tmp.qu.quarks.round()
			if (tmp.ngp3 && tmp.qu.quarks.gte(Number.MAX_VALUE) && !tmp.qu.reachedInfQK) {
				tmp.qu.reachedInfQK = true
				if (!ghostified) {
					document.getElementById("welcome").style.display = "flex"
					document.getElementById("welcomeMessage").innerHTML = "Congratulations for getting " + shorten(Number.MAX_VALUE) + " quarks! You have unlocked new QoL features, like quantum autobuyer modes, assign all, and auto-assignation!"
					document.getElementById('assignAll').style.display = ""
					document.getElementById('autoAssign').style.display = ""
					document.getElementById('autoAssignRotate').style.display = ""
					document.getElementById('ratioSettings').style.display = ""
				}
				document.getElementById('toggleautoquantummode').style.display=""
			}
		}
		if (!inQC(4)) if (player.meta.resets < 1) giveAchievement("Infinity Morals")
		if (player.dilation.rebuyables[1] + player.dilation.rebuyables[2] + player.dilation.rebuyables[3] + player.dilation.rebuyables[4] < 1 && player.dilation.upgrades.length < 1) giveAchievement("Never make paradoxes!")
		if (player.achievements.includes("ng3p73")) player.infinitiedBank=nA(player.infinitiedBank,gainBankedInf())
	}
	var oheHeadstart = bigRip ? tmp.qu.bigRip.upgrades.includes(2) : speedrunMilestonesReached > 0
	var keepABnICs = oheHeadstart || bigRip || player.achievements.includes("ng3p51")
	var oldTime = tmp.qu.time
	tmp.qu.time = 0
	updateQuarkDisplay()
	document.getElementById("galaxyPoints2").innerHTML = "You have <span class='GPAmount'>0</span> Galaxy points."
	if (tmp.ngp3) {
		var aea = {
			dilMode: player.eternityBuyer.dilMode,
			tpUpgraded: player.eternityBuyer.tpUpgraded,
			slowStop: player.eternityBuyer.slowStop,
			slowStopped: player.eternityBuyer.slowStopped,
			ifAD: player.eternityBuyer.ifAD,
			presets: player.eternityBuyer.presets
		}
		if (!tmp.qu.gluons.rg) {
			tmp.qu.gluons = {
				rg: new Decimal(0),
				gb: new Decimal(0),
				br: new Decimal(0)
			}
		}
		updateQuantumWorth()
		if (bigRip && !tmp.qu.bigRip.upgrades.includes(12)) {
			tmp.qu.bigRip.storedTS={
				tt: player.timestudy.theorem,
				studies: player.timestudy.studies,
				boughtA: Decimal.div(player.timestudy.amcost, "1e20000").log("1e20000"),
				boughtI: player.timestudy.ipcost.log("1e100"),
				boughtE: Math.round(player.timestudy.epcost.log(2))
			}
			if (player.eternityChallUnlocked > 12) tmp.qu.bigRip.storedTS.tt += masteryStudies.costs.ec[player.eternityChallUnlocked]
			else tmp.qu.bigRip.storedTS.tt += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
			for (var s = 0; s < player.masterystudies.length; s++) if (player.masterystudies[s].indexOf("t") == 0) tmp.qu.bigRip.storedTS.studies.push(parseInt(player.masterystudies[s].split("t")[1]))
		}
		if (bigRip != tmp.qu.bigRip.active) switchAB()
		if (inQCModifier("sm")) {
			var count = 0
			var newMS = []
			for (var i = 0; i < player.masterystudies.length; i++) {
				var study = player.masterystudies[i]
				var split = study.split("t")
				if (!split[1]) newMS.push(study)
				else if (count < 20) {
					newMS.push(study)
					count++
				} else {
					if (study == "t373") updateColorCharge()
					player.timestudy.theorem += masteryStudies.costs.time[split[1]]
				}
			}
			player.masterystudies = newMS
			respecUnbuyableTimeStudies()
		}
		if (!bigRip && tmp.qu.bigRip.active) if (player.galaxies == 9 && player.replicanti.galaxies == 9 && player.timeDimension4.amount.round().eq(9)) giveAchievement("We can really afford 9.")
	} else tmp.qu.gluons = 0;
	if (player.tickspeedBoosts !== undefined) player.tickspeedBoosts = 0
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	else player.infinityPoints = new Decimal(0);
	if (tmp.ngp3) {
		if (!bigRip && tmp.qu.bigRip.active && force) {
			tmp.qu.bigRip.spaceShards = tmp.qu.bigRip.spaceShards.add(getSpaceShardsGain())
			if (player.ghostify.milestones < 8) tmp.qu.bigRip.spaceShards = tmp.qu.bigRip.spaceShards.round()
			if (player.matter.gt("1e5000")) giveAchievement("Really?")
		}
		else if (inQC(6) && inQC(8) && player.money.gt(tmp.qu.pairedChallenges.pc68best)) {
			tmp.qu.pairedChallenges.pc68best = player.money
			document.getElementById("bpc68").textContent = shortenMoney(player.money)
		}
	}
	var oldMoney = player.money
	var dilTimes = player.dilation.times
	var bhd = []
	var bigRipChanged = tmp.ngp3 && bigRip != player.quantum.bigRip.active
	var turnSomeOn = !bigRip || player.quantum.bigRip.upgrades.includes(1)
	if (player.aarexModifications.ngudpV) for (var d = 0; d < 4; d++) bhd[d]=Object.assign({}, player["blackholeDimension" + (d + 1)])
	doQuantumResetStuff()
	player.money = onQuantumAM()
	if (player.galacticSacrifice && !keepABnICs) player.autobuyers[12] = 13
	if (player.tickspeedBoosts !== undefined && !keepABnICs) player.autobuyers[13] = 14
	player.challenges = challengesCompletedOnEternity(bigRip)
	if (bigRip && player.ghostify.milestones > 9 && player.aarexModifications.ngudpV) for (var u = 7; u < 10; u++) player.eternityUpgrades.push(u)
	if (isRewardEnabled(11) && (bigRip && !tmp.qu.bigRip.upgrades.includes(12))) {
		if (player.eternityChallUnlocked > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.eternityChallUnlocked]
		else player.timestudy.theorem += ([0,30,35,40,70,130,85,115,115,415,550,1,1])[player.eternityChallUnlocked]
	}
	player.eternityChallUnlocked = 0
	if (headstart) for (var ec = 1; ec < 13; ec++) player.eternityChalls['eterc' + ec]=5
	else if (isRewardEnabled(3) && !bigRip) for (ec = 1; ec < 15; ec++) player.eternityChalls['eterc' + ec] = 5
	player.dilation.totalTachyonParticles = player.dilation.tachyonParticles
	if (player.exdilation != undefined) {
		if (player.eternityUpgrades.length) for (var u = 7; u < 10; u++) player.eternityUpgrades.push(u)
		for (var d = 1; d < (player.aarexModifications.nguspV ? 9 : 5); d++) player["blackholeDimension" + d] = player.achievements.includes("ng3p67") && player.aarexModifications.ngudpV && !player.aarexModifications.ngumuV ? bhd[d - 1] : {
			cost: blackholeDimStartCosts[d],
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		}
		if (speedrunMilestonesReached < 3) {
			document.getElementById("blackholediv").style.display = "none"
			document.getElementById("blackholeunlock").style.display = "inline-block"
		}
	}
	if (tmp.ngp3) {
		giveAchievement("Sub-atomic")
		ipMultPower = GUBought("gb3") ? 2.3 : player.masterystudies.includes("t241") ? 2.2 : 2
		player.dilation.times = 0
		if (!force) {
			var u = tmp.qu.usedQuarks
			var g = tmp.qu.gluons
			var p = ["rg", "gb", "br"]
			var d = []
			for (var c = 0; c < 3; c++) d[c] = u[p[c][0]].min(u[p[c][1]])
			for (var c = 0; c < 3; c++) {
				g[p[c]] = g[p[c]].add(d[c]).round()
				u[p[c][0]] = u[p[c][0]].sub(d[c]).round()
			}
			var qc = tmp.inQCs
			var intensity = qc.length
			var qc1 = qc[0]
			var qc2 = qc[1]
			if (intensity > 1) {
				var qc1st = Math.min(qc1,qc2)
				var qc2st = Math.max(qc1,qc2)
				var pcid = qc1st * 10 + qc2st
				if (tmp.qu.pairedChallenges.current > tmp.qu.pairedChallenges.completed) {
					tmp.qu.challenges[qc1] = 2
					tmp.qu.challenges[qc2] = 2
					tmp.qu.electrons.mult += 0.5
					tmp.qu.pairedChallenges.completed = tmp.qu.pairedChallenges.current
					if (pcid == 68 && tmp.qu.pairedChallenges.current == 1 && oldMoney.e >= 165e7) giveAchievement("Back to Challenge One")
					if (tmp.qu.pairedChallenges.current == 4) giveAchievement("Twice in a row")
				}
				if (tmp.qu.pairedChallenges.completions[pcid] === undefined) tmp.qu.pairedChallenges.completions[pcid] = tmp.qu.pairedChallenges.current
				else tmp.qu.pairedChallenges.completions[pcid] = Math.min(tmp.qu.pairedChallenges.current, tmp.qu.pairedChallenges.completions[pcid])
				if (dilTimes == 0) {
					if (tmp.qu.qcsNoDil["pc" + pcid] === undefined) tmp.qu.qcsNoDil["pc" + pcid] = tmp.qu.pairedChallenges.current
					else tmp.qu.qcsNoDil["pc" + pcid] = Math.min(tmp.qu.pairedChallenges.current,tmp.qu.qcsNoDil["pc" + pcid])
				}
				for (let m = 0; m < tmp.preQCMods.length; m++) recordModifiedQC("pc" + pcid, tmp.qu.pairedChallenges.current, tmp.preQCMods[m])
				if (tmp.qu.pairedChallenges.fastest[pcid] === undefined) tmp.qu.pairedChallenges.fastest[pcid] = oldTime
				else tmp.qu.pairedChallenges.fastest[pcid] = tmp.qu.pairedChallenges.fastest[pcid] = Math.min(tmp.qu.pairedChallenges.fastest[pcid], oldTime)
			} else if (intensity) {
				if (!tmp.qu.challenges[qc1]) {
					tmp.qu.challenges[qc1] = 1
					tmp.qu.electrons.mult += 0.25
				}
				if (tmp.qu.challengeRecords[qc1] == undefined) tmp.qu.challengeRecords[qc1] = oldTime
				else tmp.qu.challengeRecords[qc1] = Math.min(tmp.qu.challengeRecords[qc1], oldTime)
				if (dilTimes == 0) tmp.qu.qcsNoDil["qc" + qc1] = 1
				for (let m = 0; m < tmp.preQCMods.length; m++) recordModifiedQC("qc" + qc1, 1, tmp.preQCMods[m])
			}
			if (tmp.qu.pairedChallenges.respec) {
				tmp.qu.electrons.mult -= tmp.qu.pairedChallenges.completed * 0.5
				tmp.qu.pairedChallenges = {
					order: {},
					current: 0,
					completed: 0,
					completions: tmp.qu.pairedChallenges.completions,
					fastest: tmp.qu.pairedChallenges.fastest,
					respec: false
				}
				for (qc = 1; qc < 9; qc++) tmp.qu.challenges[qc] = 1
				document.getElementById("respecPC").className = "storebtn"
			}
			if (tmp.qu.autoOptions.assignQK) assignAll(true)
			if (ghostified) player.ghostify.neutrinos.generationGain = player.ghostify.neutrinos.generationGain % 3 + 1
			if (isAutoGhostActive(4) && player.ghostify.automatorGhosts[4].mode != "t") rotateAutoUnstable()
		}//bounds if (!force)
		tmp.qu.pairedChallenges.current = 0
		if (challid == 0) {
			tmp.qu.electrons.amount = 0
			tmp.qu.electrons.sacGals = 0
			tmp.qu.challenge = []
			tmp.aeg = 0
		} else if (pc < 1) tmp.qu.challenge = [challid]
		else {
			tmp.qu.challenge = tmp.qu.pairedChallenges.order[pc]
			tmp.qu.pairedChallenges.current = pc
		}
		updateInQCs()
		if ((!challid && player.ghostify.milestones < 6) || bigRip != tmp.qu.bigRip.active) tmp.qu.replicants.amount = new Decimal(0)
		tmp.qu.replicants.requirement = new Decimal("1e3000000")
		tmp.qu.replicants.quarks = (!(challid > 0 )&& player.achievements.includes("ng3p45")) ? tmp.qu.replicants.quarks.pow(2/3) : new Decimal(0)
		tmp.qu.replicants.eggonProgress = new Decimal(0)
		tmp.qu.replicants.eggons = new Decimal(0)
		tmp.qu.replicants.babyProgress = new Decimal(0)
		tmp.qu.replicants.babies = new Decimal(0)
		tmp.qu.replicants.growupProgress = new Decimal(0)
		for (let d = 1; d < 9; d++) {
			if (d > 7 || tmp.eds[d].perm < 10) tmp.qu.replicants.quantumFood += Math.round(tmp.eds[d].progress.toNumber() * 3) % 3
			if (d != 1 || !player.achievements.includes("ng3p46") || challid > 0){
				tmp.eds[d].workers=new Decimal(tmp.eds[d].perm)
				tmp.eds[d].progress=new Decimal(0)
			} else {
				tmp.eds[d].workers = tmp.eds[d].workers.pow(1/3)
				tmp.eds[d].progress = new Decimal(0)
			}
		}
		tmp.qu.nanofield.charge = new Decimal(0)
		tmp.qu.nanofield.energy = new Decimal(0)
		tmp.qu.nanofield.antienergy = new Decimal(0)
		tmp.qu.nanofield.power = 0
		tmp.qu.nanofield.powerThreshold = new Decimal(50)
		player.eternityBuyer.tpUpgraded = false
		player.eternityBuyer.slowStopped = false
		if (tmp.qu.bigRip.active != bigRip) {
			if (bigRip) {
				for (var u = 0; u < tmp.qu.bigRip.upgrades.length; u++) tweakBigRip(tmp.qu.bigRip.upgrades[u])
				if (tmp.qu.bigRip.times < 1) document.getElementById("bigRipConfirmBtn").style.display = "inline-block"
				tmp.qu.bigRip.times++
				tmp.qu.bigRip.bestThisRun = player.money
				giveAchievement("To the new dimension!")
				if (tmp.qu.breakEternity.break) tmp.qu.breakEternity.did = true
			} else {
				if (!tmp.qu.bigRip.upgrades.includes(1) && oheHeadstart) {
					player.infmultbuyer = true
					for (var d=0;d<8;d++) player.infDimBuyers[d] = true
				}
				if (isRewardEnabled(11)) unstoreTT()
			}
			if (ghostified) player.ghostify.neutrinos.generationGain = player.ghostify.neutrinos.generationGain % 3 + 1
			tmp.qu.bigRip.active = bigRip
		}
		document.getElementById("metaAntimatterEffectType").textContent = inQC(3) ? "multiplier on all Infinity Dimensions" : "extra multiplier per dimension boost"
		updateColorCharge()
		updateColorDimPowers()
		updateGluonsTabOnUpdate()
		if (tmp.ngp3l&&!QCIntensity(1)) document.getElementById('rg4toggle').style.display = inQC(1) ? "none" : ""
		updateElectrons()
		updateBankedEter()
		updateQuantumChallenges()
		updateQCTimes()
		updatePCCompletions()
		updateReplicants()
		updateBreakEternity()
		if (!oheHeadstart) {
			player.eternityBuyer.dilationMode = false
			player.eternityBuyer.dilationPerAmount = 10
			if (tmp.ngp3) {
				player.eternityBuyer.dilMode = aea.dilMode
				player.eternityBuyer.tpUpgraded = aea.tpUpgraded
				player.eternityBuyer.slowStop = aea.slowStop
				player.eternityBuyer.slowStopped = aea.slowStopped
				player.eternityBuyer.presets = aea.presets
			}
		}
		player.eternityBuyer.statBeforeDilation = 0
		if ((player.autoEterMode=="replicanti"||player.autoEterMode=="peak")&&(speedrunMilestonesReached<18||!isRewardEnabled(4))) {
			player.autoEterMode="amount"
			updateAutoEterMode()
		}
		document.getElementById('dilationmode').style.display = speedrunMilestonesReached > 4 ? "" : "none"
		document.getElementById('rebuyupgauto').style.display = speedrunMilestonesReached > 6 ? "" : "none"
		document.getElementById('toggleallmetadims').style.display = speedrunMilestonesReached > 7 ? "" : "none"
		document.getElementById('metaboostauto').style.display = speedrunMilestonesReached > 14 ? "" : "none"
		document.getElementById("autoBuyerQuantum").style.display = speedrunMilestonesReached > 22 ? "" : "none"
		if (speedrunMilestonesReached < 6 || !isRewardEnabled(4)) {
			document.getElementById("qctabbtn").style.display = "none"
			document.getElementById("electronstabbtn").style.display = "none"
		}
		if (bigRip ? tmp.qu.bigRip.upgrades.includes(12) : isRewardEnabled(11)&&isRewardEnabled(4)) player.dilation.upgrades.push(10)
		else tmp.qu.wasted = (!isRewardEnabled(11) || bigRip) && tmp.qu.bigRip.storedTS === undefined
		if (bigRip ? tmp.qu.bigRip.upgrades.includes(12) : speedrunMilestonesReached > 13 && isRewardEnabled(4)) {
			for (let i = (player.exdilation != undefined ? 1 : 3); i < 7; i++) if (i != 2 || !player.aarexModifications.ngudpV) player.dilation.upgrades.push((i > 2 ? "ngpp" : "ngud") + i)
			if (player.aarexModifications.nguspV) {
				for (var i = 1; i < 3; i++) player.dilation.upgrades.push("ngusp" + i)
				for (var i = 4; i < 23; i++) if (player.dilation.upgrades.includes(getDilUpgId(i))) player.dilation.autoUpgrades.push(i)
				updateExdilation()
			}
		}
		tmp.qu.notrelative = true
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		if (!bigRip && !tmp.qu.breakEternity.unlocked && document.getElementById("breakEternity").style.display == "block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display!="block")
		document.getElementById("breakEternityTabbtn").style.display = bigRip || tmp.qu.breakEternity.unlocked ? "" : "none"
		delete tmp.qu.autoECN
	}
	if (speedrunMilestonesReached<1&&!bigRip) {
		document.getElementById("infmultbuyer").textContent = "Autobuy IP mult OFF"
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
		document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
		document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: " + shortenDimensions(player.epmult) + "x<p>Cost: " + shortenDimensions(player.epmultCost) + " EP"
	}
	if (!oheHeadstart) {
		player.autobuyers[9].bulk = Math.ceil(player.autobuyers[9].bulk)
		document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
	}
	setInitialDimensionPower()
	resetUP()
	if (oheHeadstart) player.replicanti.amount = new Decimal(1)
	player.replicanti.galaxies = 0
	updateRespecButtons()
	if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	updateAutobuyers();
	setInitialMoney()
	if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4);
	if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4);
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	resetInfDimensions();
	updateChallenges();
	updateNCVisuals()
	updateChallengeTimes()
	updateLastTenRuns()
	updateLastTenEternities()
	updateLastTenQuantums()
	if (!player.achievements.includes("r133") && !bigRip) {
		var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
		for (var i = 0; i < infchalls.length; i++) infchalls[i].style.display = "none"
	}
	GPminpeak = new Decimal(0)
	IPminpeak = new Decimal(0)
	EPminpeakType = 'normal'
	EPminpeak = new Decimal(0)
	QKminpeak = new Decimal(0)
	QKminpeakValue = new Decimal(0)
	updateAutobuyers()
	updateMilestones()
	resetTimeDimensions()
	if (oheHeadstart) {
		document.getElementById("replicantiresettoggle").style.display = "inline-block"
		skipResets()
	} else {
		hideDimensions()
		if (tmp.ngp3) document.getElementById("infmultbuyer").textContent="Max buy IP mult"
		else document.getElementById("infmultbuyer").style.display = "none"
		hideMaxIDButton()
		document.getElementById("replicantidiv").style.display="none"
		document.getElementById("replicantiunlock").style.display="inline-block"
		document.getElementById("replicantiresettoggle").style.display = "none"
		delete player.replicanti.galaxybuyer
	}
	document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points."
	document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points."
	document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
	document.getElementById("eternityPoints2").style.display = "inline-block"
	document.getElementById("eternitystorebtn").style.display = "inline-block"
	updateEternityUpgrades()
	document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
	hideDimensions()
	tmp.tickUpdate = true
	playerInfinityUpgradesOnEternity()
	document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
	updateEternityChallenges()
	updateTheoremButtons()
	updateTimeStudyButtons()
	updateDilationUpgradeCosts()
	drawStudyTree()
	if (!isRewardEnabled(4) || (bigRip ? !tmp.qu.bigRip.upgrades.includes(10) : false)) if (document.getElementById("dilation").style.display=="block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display=="block")
	document.getElementById("masterystudyunlock").style.display = (bigRip ? !tmp.qu.bigRip.upgrades.includes(12) : speedrunMilestonesReached < 14 || !isRewardEnabled(4)) ? "none" : ""
	if (speedrunMilestonesReached < 14 || !isRewardEnabled(4)) {
		document.getElementById("edtabbtn").style.display = "none"
		document.getElementById("nanofieldtabbtn").style.display = "none"
		document.getElementById("todtabbtn").style.display = "none"
		updateUnlockedMasteryStudies()
		if (document.getElementById("emperordimensions").style.display == "block") showDimTab("antimatterdimensions")
		if (document.getElementById("quantumchallenges").style.display == "block") showChallengesTab("normalchallenges")
		if (document.getElementById("electrons").style.display == "block" || document.getElementById("replicants").style.display == "block" || document.getElementById("nanofield").style.display == "block") showQuantumTab("uquarks")
	}
	let keepMastery = bigRip ? isBigRipUpgradeActive(12) : speedrunMilestonesReached > 13 && isRewardEnabled(4)
	document.getElementById("respecMastery").style.display = keepMastery ? "block" : "none"
	document.getElementById("respecMastery2").style.display = keepMastery ? "block" : "none"
	if (!keepMastery) {
		performedTS = false
		if (document.getElementById("metadimensions").style.display == "block") showDimTab("antimatterdimensions")
		if (document.getElementById("masterystudies").style.display == "block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display!="block")
	}
	if (inQC(8) && (document.getElementById("infinitydimensions").style.display == "block" || (document.getElementById("timedimensions").style.display == "block" && !tmp.be))) showDimTab("antimatterdimensions")
	if ((bigRip ? !isBigRipUpgradeActive(2) : speedrunMilestonesReached < 2) && document.getElementById("eternitychallenges").style.display == "block") showChallengesTab("normalchallenges")
	drawMasteryTree()
	Marathon2 = 0;
	document.getElementById("quantumConfirmBtn").style.display = "inline-block"
}

function updateQuarkDisplay() {
	let msg = ""
	if (quantumed) {
		msg += "You have <b class='QKAmount'>"+shortenDimensions(tmp.qu.quarks)+"</b> "	
		if (tmp.ngp3&&player.masterystudies.includes("d14")) msg += " QK and <b class='SSAmount'>" + shortenDimensions(tmp.qu.bigRip.spaceShards) + "</b> Space Shard" + (tmp.qu.bigRip.spaceShards.round().eq(1) ? "" : "s")
		else msg += "quark" + (tmp.qu.quarks.round().eq(1) ? "" : "s")
		msg += "."
	}
	document.getElementById("quarks").innerHTML=msg
}

function metaReset2() {
	if (tmp.ngp3 && tmp.qu.bigRip.active) ghostify()
	else quantum(false, false, 0)
}

function getMetaUnlCost() {
	if (player.aarexModifications.nguspV) return 1e21
	return 1e24
}

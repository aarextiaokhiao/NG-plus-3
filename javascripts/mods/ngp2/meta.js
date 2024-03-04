//meta dimensions
function getMetaAntimatterStart(bigRip) {
	let x = 10
	if (speedrunMilestones >= 19 && !bigRip) x = 1e25
	else if (hasAch("ngpp12")) x = 100
	return E(x)
}

function getDilationMetaDimensionMultiplier() {
	let div = 1e40
	if (mod.udsp) div = 1e50

	let pow = 0.1
	if (hasNanoReward("dt_to_ma_exp")) pow *= getNanorewardEff("dt_to_ma_exp")

	if (mod.udp && !aarMod.nguepV) {
		let l = quSave.colorPowers.b.add(10).log10()
		let x = 3 - Math.log10(l + 1)
		if (aarMod.ngumuV) {
			if (x < 2) x = 2 - 2 * (2 - x) / (5 - x)
		} else {
			x = Math.max(x, 2)
			if (l > 5000) x -= Math.min(Math.log10(l - 4900) - 2, 2) / 3
		}
		pow /= x
	}
	let ret = player.dilation.dilatedTime.div(div).pow(pow).add(1)
	return ret
}

function getMetaDimensionMultiplier(tier) {
	if (player.currentEternityChall === "eterc11") return E(1)
	let ret = E_pow(getPerTenMetaPower(), Math.floor(player.meta[tier].bought / 10))
	ret = ret.mul(E_pow(getMetaBoostPower(), Math.max(player.meta.resets + 1 - tier, 0)))
	ret = ret.mul(tmp.mdgm) //Global multiplier of all Meta Dimensions

	//Quantum upgrades
	if (tier == 1 && hasGluonUpg("rg", 3)) ret = ret.mul(gluonEff("rg", 3))

	//QC Rewards:
	if (tier % 2 > 0) ret = ret.mul(tmp.qu.chal.reward[4])
	
	//Achievements:
	if (tier == 8 && hasAch("ng3p22")) ret = ret.mul(1 + Math.pow(player.meta[1].amount.add(1).log10() / 10, 2))
	if (tier == 1 && hasAch("ng3p31")) ret = ret.mul(player.meta.antimatter.add(1).pow(.001))
	if (tier == 1 && hasAch("ng3p17")) ret = ret.mul(Math.max(1,Math.log10(player.totalmoney.add(10).log10())))
	
	ret = dilates(dilates(ret.max(1), 2), "meta")
	return ret
}

function getMetaDimensionGlobalMultiplier() {
	let ret = getDilationMetaDimensionMultiplier()
	if (player.dilation.upgrades.includes("ngpp3")) ret = ret.mul(getDil14Bonus())
	if (hasAch("ngpp12")) ret = ret.mul(1.1)
	if (mod.ngp3) {
		//Mastery Study Boosts
		if (hasMasteryStudy("t262")) ret = ret.mul(getMTSMult(262))
		if (hasMasteryStudy("t282")) ret = ret.mul(getMTSMult(282))
		if (hasMasteryStudy("t303")) ret = ret.mul(getMTSMult(303))
		if (hasMasteryStudy("t351")) ret = ret.mul(getMTSMult(351))
		if (hasMasteryStudy("t373")) ret = ret.mul(getMTSMult(373))
		if (hasMasteryStudy("t382")) ret = ret.mul(getMTSMult(382))
		if (hasMasteryStudy("t383")) ret = ret.mul(getMTSMult(383))
		if (hasMasteryStudy("t393")) ret = ret.mul(getMTSMult(393))

		//Quantum Upgrades
		if (hasGluonUpg("br", 4)) ret = ret.mul(gluonEff("br", 4))
		if (hasGluonUpg("br", 5)) ret = ret.mul(3)

		//QC Rewards
		ret = ret.mul(tmp.qu.chal.reward[3])
		ret = ret.mul(tmp.qu.chal.reward[6])

		//Achievement Rewards
		if (hasAch("ng3p13")) ret = ret.mul(Math.pow(Decimal.add(quantumWorth, 10).log10(), 2))
		if (hasAch("ng3p57")) ret = ret.mul(1 + player.timeShards.add(1).log10() / 1e3)
	}
	
	return ret
}

function getPerTenMetaPower() {
	let r = 2
	let exp = 1
	if (player.dilation.upgrades.includes("ngpp4")) r = getDil15Bonus()
	return Math.pow(r, exp)
}

function getMetaBoostPower() {
	if (inQC(8)) return 1
	let r = 2
	let exp = 1
	if (player.dilation.upgrades.includes("ngpp4")) r = getDil15Bonus()
	if (mod.ngp3) {
		if (hasNanoReward("md_boost")) r = getNanorewardEff("md_boost")
		if (hasMasteryStudy("t312")) exp = 1.045
		exp *= lightEff(7)
	}
	if (hasAch("ngpp14")) r *= 1.01

	let eff = E_pow(r, exp)
	return eff
}

function getMetaDimensionDescription(tier) {
	if (tier > Math.min(7, player.meta.resets + 3) - (inQC(4) ? 1 : 0)) return getFullExpansion(player.meta[tier].bought) + ' (' + dimMetaBought(tier) + ')';
	else return shortenDimensions(player.meta[tier].amount) + ' (' + dimMetaBought(tier) + ') (+' + formatValue(player.options.notation, getMetaDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getMetaDimensionRateOfChange(tier) {
	let toGain = getMetaDimensionProduction(tier + (inQC(4) ? 2 : 1));

	var current = player.meta[tier].amount.max(1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10() - current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.mul(10).dividedBy(current);

	return change;
}

function canBuyMetaDimension(tier) {
	if (tier > player.meta.resets + 4) return false;
	if (speedrunMilestones < 17 && tier > 1 && player.meta[tier - 1].amount.eq(0)) return false;
	return true;
}

function clearMetaDimensions() { //Resets costs and amounts
	for (let i = 1; i <= 8; i++) {
		player.meta[i] = {
			amount: E(0),
			bought: 0,
			cost: initCost[i]
		}
	}
}

function getMetaShiftRequirement() { 
	var mdb = player.meta.resets
	var data = {tier: Math.min(8, mdb + 4), amount: 20}
	var inQC4 = inQC(4)
	data.mult = inQC4 ? 5.5 : 15
	if (mod.ngp3) {
		if (hasMasteryStudy("t312")) data.mult -= 1
	}
	data.amount += data.mult * Math.max(mdb - 4, 0)
	if (isDecayOn()) data.amount -= getTreeUpgradeEffect(1)
	if (hasNU(1)) data.amount -= NT.eff("upg", 1, 0)

	data.scalingStart = inQC4 ? 55 : 15
	if (player.meta.resets >= data.scalingStart) {
		var multAdded = inQC4 ? 14.5 : 5
		data.mult += multAdded
		data.amount += multAdded * (mdb - data.scalingStart)
	}
	
	return data
}

function getMetaDimensionBoostRequirement(){
	return getMetaShiftRequirement()
}

function metaBoost() {
	let req = getMetaShiftRequirement()
	let isNU1ReductionActive = hasNU(1) ? !bigRipped() : false
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
	if (hasAch("ng3p52")) return
	player.meta.antimatter = getMetaAntimatterStart()
	clearMetaDimensions()
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
	player.meta[tier].amount = player.meta[tier].amount.add(1);
	player.meta[tier].bought++;
	if (player.meta[tier].bought % 10 < 1) {
		player.meta[tier].cost = getMetaCost(tier, player.meta[tier].bought/10)
	}
	if (tier > 7) giveAchievement("And still no ninth dimension...")
	return true;
}

function getMetaCost(tier, boughtTen) {
	let cost = Decimal.mul(initCost[tier], costMults[tier].pow(boughtTen))
	let scalingStart = Math.ceil(Decimal.div(getMetaCostScalingStart(), initCost[tier]).log(costMults[tier]))
	if (boughtTen >= scalingStart) cost = cost.mul(pow10((boughtTen - scalingStart + 1) * (boughtTen-scalingStart + 2) / 2))
	return cost
}

function getMetaCostScalingStart() {
	return mod.ngp3 ? E("1e900") : E(1/0)
}

function getMetaMaxCost(tier) {
	return player.meta[tier].cost.mul(10 - dimMetaBought(tier));
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
	player.meta[tier].amount = player.meta[tier].amount.add(10 - dimMetaBought(tier));
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
			var cost = getMetaCost(tier,currentBought + num - 1).mul(num > 1 ? 10 : 10 - dimMetaBought(tier))
			if (cost.gt(tempMA)) {
				tempMA = player.meta.antimatter.sub(cost)
				bought--
			} else tempMA = tempMA.sub(cost)
			if (temp.eq(tempMA) || currentBought + num > 9007199254740991) break
			num--
		}
	} else {
		tempMA = tempMA.sub(getMetaCost(tier, currentBought).mul(10 - dimMetaBought(tier)))
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

function setupMetaDimensions() {
	var html = ""
	for (let d = 1; d <= 8; d++) {
		html += `<tr id="${d}MetaRow" style="display: none; font-size: 15px">
			<td id="${d}MetaD" class="rel"></td>
			<td id="meta${d}Amount"></td>
			<td width="70px"><button id="meta${d}" style="width: 70px; font-size: 10px;" class="storebtn"></button></td>
			<td width="10%"><button id="metaMax${d}" style="width:210px; height: 25px; font-size: 10px" class="storebtn"></button></td>
		</tr>`
	}
	el("metaDimTable").innerHTML = html

	for (let i = 1; i <= 8; i++) {
		el("meta" + i).onclick = function () {
			if (speedrunMilestones > i + 5) player.autoEterOptions["md" + i] = !player.autoEterOptions["md" + i]
			else metaBuyOneDimension(i);
			if (speedrunMilestones > 27) {
				var removeMaxAll=false
				for (var d = 1; d < 9; d++) {
					if (player.autoEterOptions["md" + d]) {
						if (d > 7) removeMaxAll = true
					} else break
				}
				el("metaMaxAll").style.display = removeMaxAll ? "none" : ""
			}
		}
		el("metaMax" + i).onclick = function () {
			if (shiftDown && speedrunMilestones > i + 5) metaBuyOneDimension(i)
			else metaBuyManyDimension(i);
		}
	}

	el("metaMaxAll").onclick = function () {
		for (let i = 1; i <= 8; i++) buyMaxMetaDimension(i)
	}
}

function getMetaDimensionProduction(tier) {
	let ret = player.meta[tier].amount.floor()
	if (inQC(4)) {
		if (tier == 1) ret = ret.add(player.meta[2].amount.floor().pow(1.3))
		else if (tier == 4) ret = ret.pow(1.5)
	}
	return ret.mul(getMetaDimensionMultiplier(tier));
}

function getExtraDimensionBoostPower() {
	if (player.currentEternityChall=="eterc14" || inQC(7)) return E(1)
	let r = getExtraDimensionBoostPowerUse()
	r = E_pow(r, getExtraDimensionBoostPowerExponent(r)).max(1)
	if (!inQC(3)) r = r.add(1)
	return r
}

function getExtraDimensionBoostPowerUse() {
	return player.meta[hasAch("ng3p71") ? "bestOverQuantums" : "bestAntimatter"]
}

function getMADimBoostPowerExp(ma = player.meta.antimatter){
	getExtraDimensionBoostPowerExponent(ma)
}

function getExtraDimensionBoostPowerExponent(ma) {
	let power = 8
	if (inQC(3)) {
		power = Math.pow(ma.log10() / 8, 2)
		if (power > 1e8) power = Math.pow(power * 1e6, 4/7)
		return power
	}
	if (player.dilation.upgrades.includes("ngpp5")) power++
	if (mod.ngp3) {
		power += getECReward(13)
		if (hasNanoReward("ma_eff_exp")) power += getNanorewardEff("ma_eff_exp")
		if (isDecayOn()) power += getTreeUpgradeEffect(8)
		if (hasNU(16)) power += NT.eff("upg", 16)
	}
	return power
}

function getDil14Bonus() {
	return 1 + Math.log10(1 - Math.min(0, player.tickspeed.log(10)));
}

function getDil17Bonus() {
	return Math.sqrt(player.meta.bestAntimatter.max(1).log10()) / (mod.ngp3 ? 1 : 2);
}

function updateOverallMetaDimensionsStuff(){
	el("metaAntimatterAmount").textContent = shortenMoney(player.meta.antimatter)
	el("metaAntimatterBest").textContent = shortenMoney(player.meta.bestAntimatter)
	el("bestAntimatterQuantum").textContent = quantumed ? "Your best" + (ghostified ? "" : "-ever") + " meta-antimatter" + (ghostified ? " in this Fundament" : "") + " was " + shortenMoney(player.meta.bestOverQuantums) + "." : ""
	el("bestAntimatterTranslation").innerHTML = (mod.ngp3 && player.currentEternityChall != "eterc14" && (inQC(3) || nfSave.rewards >= 2) && !inQC(7)) ? 'Raised to the power of <span id="metaAntimatterPower" style="font-size:35px; color: black">'+formatValue(player.options.notation, getExtraDimensionBoostPowerExponent(getExtraDimensionBoostPowerUse()), 2, 1)+'</span>, t' : "T"
	setAndMaybeShow("bestMAOverGhostifies", ghostified, '"Your best-ever meta-antimatter was " + shortenMoney(player.meta.bestOverGhostifies) + "."')
	el("metaAntimatterEffect").textContent = shortenMoney(getExtraDimensionBoostPower())
	el("metaAntimatterPerSec").textContent = 'You are getting ' + shortenDimensions(getMetaDimensionProduction(1)) + ' meta-antimatter per second.'
}

function updateMetaDimensions () {
	updateOverallMetaDimensionsStuff()
	let showDim = false
	let useTwo = player.options.notation=="Logarithm" ? 2 : 0
	for (let tier = 8; tier > 0; tier--) {
		showDim = showDim || canBuyMetaDimension(tier)
		el(tier + "MetaRow").style.display = showDim ? "" : "none"
		if (showDim) {
			el(tier + "MetaD").textContent = dimNames[tier] + " Meta Dimension x" + formatValue(player.options.notation, getMetaDimensionMultiplier(tier), 2, 1)
			el("meta" + tier + "Amount").textContent = getMetaDimensionDescription(tier)
			el("meta" + tier).textContent = speedrunMilestones > tier + 5 ? "Auto: " + (player.autoEterOptions["md" + tier] ? "ON" : "OFF") : shortenCosts(player.meta[tier].cost) + " MA"
			el('meta' + tier).className = speedrunMilestones > tier + 5 ? "storebtn" : canAffordMetaDimension(player.meta[tier].cost) ? 'storebtn' : 'unavailablebtn'
			el("metaMax"+tier).textContent = (speedrunMilestones > tier + 5 ? (shiftDown ? "Singles: " : ghostified ? "":"Cost: ") : "Until 10: ") + formatValue(player.options.notation, ((shiftDown && speedrunMilestones > tier + 5) ? player.meta[tier].cost : getMetaMaxCost(tier)), useTwo, 0) + " MA"
			el('metaMax' + tier).className = canAffordMetaDimension((shiftDown && speedrunMilestones > tier + 5) ? player.meta[tier].cost : getMetaMaxCost(tier)) ? 'storebtn' : 'unavailablebtn'
		}
	}
	var isMetaShift = player.meta.resets < 4
	var metaShiftRequirement = getMetaShiftRequirement()
		el("metaResetLabel").textContent = 'Meta-Dimension ' + (isMetaShift ? "Shift" : "Boost") + ' ('+ getFullExpansion(player.meta.resets) +'): requires ' + getFullExpansion(Math.floor(metaShiftRequirement.amount)) + " " + dimNames[metaShiftRequirement.tier] + " Meta Dimensions"
		el("metaSoftReset").textContent = "Reset meta-dimensions for a " + (isMetaShift ? "new dimension" : "boost")
	if (player.meta[metaShiftRequirement.tier].bought >= metaShiftRequirement.amount) {
		el("metaSoftReset").className = 'storebtn'
	} else {
		el("metaSoftReset").className = 'unavailablebtn'
	}
	var bigRip = bigRipped()
	var req = getQuantumReq()
	var reqGotten = isQuantumReached()
	var newClassName = reqGotten ? (bigRip && player.options.theme == "Aarex's Modifications" ? "" : "storebtn ") + (bigRip ? "aarexmodsghostifybtn" : "") : 'unavailablebtn'
	el("quantumResetLabel").textContent = (bigRip ? 'Fundament' : 'Quantum') + ': requires ' + shorten(req) + ' meta-antimatter ' + (inAnyQC() ? "and " + shortenCosts(getQCGoal()) + " antimatter" : player.masterystudies ? "and an EC14 completion" : "")

	var message = 'Lose all your prior progress'
	if (reqGotten && bigRip && ghostified) {
		var GS = getGHPGain()
		message += ", +" + shortenDimensions(GS) + " Spectral Particle" + (GS.lt(2) ? "" : "s")
	} else if (reqGotten && !bigRip && quantumed) {
		var QS = quarkGain()
		message += ", +" + shortenDimensions(QS) + " anti-quark" + (QS.lt(2) ? "" : "s")
	} else message += " for a new layer"
	el("quantum").textContent = message
	if (el("quantum").className !== newClassName) el("quantum").className = newClassName
}

function getDil15Bonus() {
	let x = 1
	let max = 3
	if (hasNB(3)) {
		x = NT.eff("boost", 3)
		max = 1/0
	}
	x *= Math.min(Math.log10(player.dilation.dilatedTime.max(1e10).log(10)) + 1, max)
	return x
}

function metaDimsUpdating(diff){
	var step = inQC(4) ? 2 : 1
	for (let tier = 1 ; tier < 9; tier++) {
		if (tier < 9 - step) player.meta[tier].amount = player.meta[tier].amount.add(getMetaDimensionProduction(tier+step).mul(diff / 10))
	}

	player.meta.antimatter = player.meta.antimatter.add(getMetaDimensionProduction(1).mul(diff))
	if (inQC(4)) player.meta.antimatter = player.meta.antimatter.add(getMetaDimensionProduction(2).mul(diff))
	player.meta.bestAntimatter = player.meta.bestAntimatter.max(player.meta.antimatter)
	if (mod.ngp3) {
		player.meta.bestOverQuantums = player.meta.bestOverQuantums.max(player.meta.antimatter)
		player.meta.bestOverGhostifies = player.meta.bestOverGhostifies.max(player.meta.antimatter)
	}
}

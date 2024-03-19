//Variables
const dimTiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ]
const dimNames = [ null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth" ]
var initCost
var costMults

//Dimensions
function getNormalDimensions(uncapped = false) {
	let rvalue = player.resets + 4
	if (!uncapped) rvalue = Math.min(rvalue, getMaxNormalDimensions())
	return rvalue
}

function getMaxNormalDimensions() {
	return player.currentEternityChall == "eterc3" ? 4 : inNC(4) || player.currentChallenge == "postc1" ? 6 : 8
}

function getDimensionProductionPerSecond(tier) {
	if (inQC(1) && tier > 2) return E(0)

	let ret = player[dimTiers[tier] + 'Amount'].floor()
	if ((inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4)) && !inNGM(2)) {
		if (tier == 4) ret = ret.pow(1.3)
		else if (tier == 2) ret = ret.pow(1.5)
	}
	ret = ret.mul(getDimensionFinalMultiplier(tier))
	if (inNC(2) || player.currentChallenge == "postc1") ret = ret.mul(player.chall2Pow)
	if (tier == 1 && (inNC(3) || player.currentChallenge == "postc1")) ret = ret.mul(player.chall3Pow)
	if (inNGM(3)) ret = ret.div(10)
	if (inNGM(4)) ret = ret.div(100)
	if (tier == 1 && (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4))) ret = ret.add(getDimensionProductionPerSecond(2))
	let tick = dilates(Decimal.div(1e3,getTickspeed()),"tick")
	if (player.dilation.active && hasNanoReward("dil_exp")) tick = tick.pow(getNanorewardEff("dil_exp"))
	ret = ret.mul(tick)
	return ret
}

function getDimensionRateOfChange(tier) {
	if (tier == 8 || (player.currentEternityChall == "eterc3" && tier > 3)) return 0;

	let toGain = getDimensionProductionPerSecond(tier + 1)
	if (tier == 7 && player.currentEternityChall == "eterc7") toGain = DimensionProduction(1).mul(10)

	var name = dimTiers[tier];
	if (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4)) {
		if (tier == 7) return 0
		else toGain = getDimensionProductionPerSecond(tier + 2);
	}
	var current = player[name + 'Amount'].max(1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.mul(10).dividedBy(current);

	return change;
}

function getDimensionDescription(tier) {
	var name = dimTiers[tier];
	if (tier == getNormalDimensions()) return getFullExpansion(inNC(11) ? getAmount(tier) : player[name + 'Bought']) + ' (' + dimBought(tier) + ')';
	else if (player.money.l > 1e9) return shortenND(player[name + 'Amount'])
	else if (player.money.l > 1e6) return shortenND(player[name + 'Amount']) + ' (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
	else return shortenND(player[name + 'Amount']) + ' (' + dimBought(tier) + ') (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function clearDimensions(amount = 8) {
	for (var i = 1; i <= amount; i++) player[dimTiers[i] + "Amount"] = E(0)
}

function resetDimensions() {
	var costs = [10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24]
	if (inNC(10) || player.currentChallenge == "postc1") costs = [10, 100, 100, 500, 2500, 2e4, 2e5, 4e6]

	clearDimensions()
	for (var d = 1; d <= 8; d++) {
		var name = dimTiers[d]
		player[name+"Bought"] = 0
		player[name+"Cost"] = E(costs[d-1])
	}
}
	
function getAmount(tier) {
	let ret = player[dimTiers[tier] + "Amount"].toNumber()
	if (!break_infinity_js) ret = Math.round(ret)
	return ret
}

//Buying
function getOrSubResource(tier, sub) {
	let index = "money"
	if (tier > 2 && (inNC(10) || player.currentChallenge == "postc1")) index = dimTiers[tier-2] + "Amount"

	if (sub !== undefined && !hasAch("ng3p55")) player[index] = player[index].sub(sub.min(player[index]))
	return player[index]
}
	
function canBuyDimension(tier) {
	if (tmp.ri) return false
	if (tier > getNormalDimensions()) return false
	if (tier > 1 && getAmount(tier - 1) == 0 && getEternitied() < 30) return false

	return true
}

function canQuickBuyDim(tier) {
	if (((inNC(5) || player.currentChallenge == "postc5") && !inNGM(3)) || inNC(9)) return false
	return player.dimensionMultDecrease <= 3 || player.costMultipliers[tier-1].gt(Number.MAX_SAFE_INTEGER)
}

function buyOneDimension(tier) {
	if (!canBuyDimension(tier)) return false
	let name = dimTiers[tier]
	let cost = player[name + 'Cost']
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return false
	getOrSubResource(tier, cost)
	player[name + "Amount"] = player[name + "Amount"].add(1)
	recordBought(name, 1)
	if (dimBought(tier) == 0) {
		if (player.currentChallenge == "postc5" && !inNGM(3)) multiplyIC5Costs(player[name + 'Cost'], tier)
		else if (inNC(5) && !inNGM(3)) multiplySameCosts(player[name + 'Cost'])
		else player[name + "Cost"] = player[name + "Cost"].mul(getDimensionCostMultiplier(tier))
		if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].mul(getDimensionCostMultiplierIncrease())
	}
	if (tier == 1 && getAmount(1) >= 1e150) giveAchievement("There's no point in doing that")
	if (getAmount(8) == 99) giveAchievement("The 9th Dimension is a lie");
	onBuyDimension(tier)
	return true
}

function buyManyDimension(tier, quick) {
	if (!canBuyDimension(tier)) return false
	let name = dimTiers[tier]
	let toBuy = 10 - dimBought(tier)
	let cost = player[name + 'Cost'].mul(toBuy)
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return false

	getOrSubResource(tier, cost)
	player[name + "Amount"] = player[name + "Amount"].add(toBuy)
	recordBought(name, toBuy)

	if (player.currentChallenge == "postc5" && !inNGM(3)) multiplyIC5Costs(player[name + 'Cost'], tier)
	else if (inNC(5) && !inNGM(3)) multiplySameCosts(player[name + 'Cost'])
	else player[name + "Cost"] = player[name + "Cost"].mul(getDimensionCostMultiplier(tier))
	if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].mul(getDimensionCostMultiplierIncrease())

	if (!quick) {
		floatText("D" + tier, "x" + shortenMoney(getDimensionPowerMultiplier()))
		onBuyDimension(tier)
	}
	return true
}

function buyBulkDimension(tier, bulk, auto) {
	if (!canBuyDimension(tier)) return
	let bought = 0
	if (dimBought(tier) > 0) {
		if (!buyManyDimension(tier, true)) return
		bought++
	}
	let name = dimTiers[tier]
	let cost = player[name + 'Cost'].mul(10)
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return
	if (((!inNC(5) && player.currentChallenge != "postc5") || inNGM(3)) && !inNC(9) && !costIncreaseActive(player[name + "Cost"])) {
		let mult = getDimensionCostMultiplier(tier)
		let max = Number.POSITIVE_INFINITY
		if (!inNC(10) && player.currentChallenge != "postc1") max = Math.ceil(Decimal.div(Number.MAX_VALUE, cost).log(mult) + 1)
		var toBuy = Math.min(Math.min(Math.floor(resource.div(cost).mul(mult-1).add(1).log(mult)), bulk-bought), max)
		getOrSubResource(tier, E_pow(mult, toBuy).sub(1).div(mult-1).mul(cost))
		player[name + "Amount"] = player[name + "Amount"].add(toBuy * 10)
		recordBought(name, toBuy*10)
		player[name + "Cost"] = player[name + "Cost"].mul(E_pow(mult, toBuy))
		if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].mul(getDimensionCostMultiplierIncrease())
		bought += toBuy
	}
	let stopped = !costIncreaseActive(player[name + "Cost"])
	let failsafe = 0
	while (!canQuickBuyDim(tier)) {
		stopped = true
		if (!buyManyDimension(tier, true)) break
		bought++
		if (bought == bulk) break
		failsafe++
		if (failsafe > 149) break
		stopped = false
	}
	while (!stopped) {
		stopped = true
		let mi = getDimensionCostMultiplierIncrease()
		let a = Math.log10(mi)/2
		let b = player.costMultipliers[tier-1].log10() - a
		let c = player[name + "Cost"].mul(10).log10() - player.money.log10()
		let d = b * b - 4 * a * c
		if (d < 0) break
		let toBuy = Math.min(Math.floor(( -b + Math.sqrt(d)) / (2 * a)) + 1, bulk - bought)
		if (toBuy < 1) break
		let newCost = player[name + "Cost"].mul(E_pow(player.costMultipliers[tier - 1], toBuy - 1).mul(E_pow(mi, (toBuy - 1) * (toBuy - 2) / 2)))
		let newMult = player.costMultipliers[tier - 1].mul(E_pow(mi, toBuy - 1))
		getOrSubResource(tier, newCost)
		player[name + "Amount"] = player[name + "Amount"].add(toBuy * 10)
		recordBought(name, toBuy * 10)
		player[name + "Cost"] = newCost.mul(newMult)
		player.costMultipliers[tier - 1] = newMult.mul(mi)
		bought += toBuy
	}
	if (!auto) floatText("D" + tier, "x" + shortenMoney(E_pow(getDimensionPowerMultiplier(), bought)))
	onBuyDimension(tier)
}
	
function onBuyDimension(tier) {
	giveAchievement(allAchievements["r1"+tier])
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (inNC(8) || player.currentChallenge == "postc1") clearDimensions(tier - 1)
	if ((inNC(12) || player.currentChallenge == "postc1" || player.currentChallenge == "postc6" || inQC(6)) && player.matter.equals(0)) player.matter = E(1)
	player.postC4Tier = tier;
	player.postC8Mult = E(1)
	if (tier != 8) player.dimlife = false
	if (tier != 1) player.dead = false
	if (mod.ngp3 && tier > 4) player.old = false
}

//Scalings & Bought
function dimBought(tier) {
	return player[dimTiers[tier] + "Bought"] % 10;
}

function recordBought(name, num) {
	player[name + 'Bought'] += num;
	if (inNGM(2)) player.totalBoughtDims[name] = (player.totalBoughtDims[name] ? player.totalBoughtDims[name] : 0) + num;
}

function getDimensionCostMultiplier(tier) {
	var multiplier2 = [E(1e3), E(5e3), E(1e4), E(1.2e4), E(1.8e4), E(2.6e4), E(3.2e4), E(4.2e4)];
	if (inNC(10)) return multiplier2[tier - 1];
	else return player.costMultipliers[tier - 1];
}

function getDimensionCostMultiplierIncrease() {
	if (inQC(7)) return Number.MAX_VALUE
	let ret = player.dimensionMultDecrease;
	if (inNGM(4)) ret = Math.pow(ret, 1.25)
	if (player.currentChallenge === 'postcngmm_2') {
		exp = inNGM(4) ? .9 : .5
		ret = Math.pow(ret, exp)
	} else if (player.challenges.includes('postcngmm_2')) {
		expcomp = inNGM(4) ? .95 : .9
		ret = Math.pow(ret, expcomp)
	}
	return ret;
}

function costIncreaseActive(cost) {
	if (inNC(10) || player.currentChallenge == "postc1") return false
	return cost.gte(Number.MAX_VALUE) || player.currentChallenge === 'postcngmm_2';
}

//Per-purchase bonuses	
function getDimensionPowerMultiplier(focusOn, debug) {
	let ret = focusOn || inNC(9) || player.currentChallenge=="postc1" ? getMPTBase(focusOn) : tmp.mptb
	if (focusOn == "linear") return ret

	let exp = 1
	if (mod.ngp3) exp = focusOn == "no-rg4" ? getMPTExp(focusOn) : tmp.mpte
	if (exp > 1) ret = E_pow(ret, exp)
	if (focusOn == "positrons") return ret

	if (mod.ngp3) ret = E(lightEff(0)).mul(ret)
	if (mod.ngmu) {
		ret = E(Math.log10(player.resets + 1) + 1).mul(ret)
		ret = E(Math.log10(Math.max(player.galaxies, 0) + 1) * 5 + 1).mul(ret)
	}
	return ret
}
	
function getMPTBase(focusOn) {
	if ((inQC(5) || inQC(7)) && focusOn != "linear") return hasMasteryStudy("t321") ? E("1e430") : E(1)
	if ((((inNC(13) && !inNGM(3)) || player.currentChallenge == "postc1" || player.currentChallenge == "postcngm3_1") && inNGM(2))) return E(1)

	let ret = 2
	if (inNGM(3)) ret = 1
	if (mod.ngep) ret *= 10
	if (mod.ngmu) ret *= 2.1
	if (player.infinityUpgrades.includes("dimMult")) ret *= infUpg12Pow()
	if ((inNC(9) || player.currentChallenge === "postc1") && !focusOn) ret = Math.pow(10 / 0.30, Math.random()) * 0.30
	if (hasAch("r58")) {
		if (inNGM(2)) {
			let exp = 1.0666
			if (inNGM(3)) exp = Math.min(Math.sqrt(1800 / player.challengeTimes[3] + 1), exp)
			ret = Math.pow(ret, exp)
		} else ret *= 1.01
	}
	ret += getECReward(3)
	if (inNGM(2)) if (hasGSacUpg(33) && ((!inNC(14) && player.currentChallenge != "postcngm3_3") || !inNGM(3) || inNGM(4)) && player.currentChallenge != "postcngm3_4") ret *= galMults.u33();
	if (focusOn == "no-QC5") return ret
	if (mod.ngp3) {
		ret += tmp.qu.chal.reward[5]
		if (hasNanoReward("per_10_power")) ret += getNanorewardEff("per_10_power")
	}
	return ret
}

function getMPTExp(focusOn) {
	return isPositronsOn() ? getPositronBoost(focusOn) : 1
}

//Multipliers
const infToDimMultUpgs = [null, "18Mult", "27Mult", "36Mult", "45Mult", "45Mult", "36Mult", "27Mult", "18Mult"]
function hasInfinityMult(tier) {
	return player.infinityUpgrades.includes(infToDimMultUpgs[tier])
}

function timeMult() {
	var mult = E(1)
	if (player.infinityUpgrades.includes("timeMult")) mult = mult.mul(infUpg11Pow());
	if (player.infinityUpgrades.includes("timeMult2")) mult = mult.mul(infUpg13Pow());
	if (hasAch("r76")) mult = mult.mul(Math.pow(player.totalTimePlayed / (600 * 60 * 48), inNGM(2) ? 0.1 : 0.05));
	return mult;
}

function infUpg11Pow() {
	if (inNGM(2)) return Math.max(Math.pow(player.totalTimePlayed / 864e3, 0.75), 1)
	else return Math.max(Math.pow(player.totalTimePlayed / 1200, 0.15), 1)
}

function infUpg12Pow() {
	if (inNGM(3)) return 1.05 + .01 * Math.min(Math.max(player.infinitied, 0), 45)
	if (inNGM(2)) return 1.05 + .0025 * Math.min(Math.max(player.infinitied, 0), 60)
	if (mod.ngep) return 1.2
	return 1.1
}

function infUpg13Pow() {
	if (inNGM(2)) return Math.pow(1 + player.thisInfinityTime / 2400, 1.5)
	else return Math.max(Math.pow(player.thisInfinityTime / 2400, 0.25), 1)
}

function dimMults() {
	return E_pow(Decimal.mul(getInfinitied(), 0.2).add(1),(inNGM(2) ? 2 : 1) * (hasTimeStudy(31) ? 4 : 1))
}

function getInfinitiedMult() {
	var add = inNGM(2) ? 0 : 1
	var base = (inNGM(2) ? 1 : 0) + Decimal.add(getInfinitied(), 1).log10() * (inNGM(2) ? 100 : 10)
	var exp = (inNGM(2) ? 2 : 1) * (hasTimeStudy(31) ? 4 : 1)
	if (inNGM(4)) {
		if ((player.currentChallenge == "postcngmm_1" || player.challenges.includes("postcngmm_1")) && !hasAch("r71")) exp += .2
		else exp *= 1 + Decimal.add(getInfinitied(), 1).log10() / 3
	}
	return E_pow(base, exp).add(add)
}

function getPostBreakInfNDMult() {
	let mult = E(1)
	if (player.infinityUpgrades.includes("totalMult")) mult = mult.mul(totalMult)
	if (player.infinityUpgrades.includes("currentMult")) mult = mult.mul(currentMult)
	if (player.infinityUpgrades.includes("infinitiedMult")) mult = mult.mul(infinitiedMult)
	if (player.infinityUpgrades.includes("achievementMult")) mult = mult.mul(achievementMult)
	if (player.infinityUpgrades.includes("challengeMult")) mult = mult.mul(worstChallengeBonus)
	return mult
}

//Multipliers
function getR84or73Mult() {
	if (hasAch("r84")) return player.money.pow(inNGM(2)?0.0002:0.00004).plus(1)
	if (hasAch("r73")) return player.money.pow(inNGM(2)?0.0001:0.00002).plus(1)
	return E(1)
}

function getNormalDimensionVanillaAchievementBonus(tier) {
	var mult = E(1)
	if (tier == 1) {
		if (hasAch("r28")) mult = mult.mul(1.1)
		if (hasAch("r31")) mult = mult.mul(1.05)
		if (hasAch("r71")) mult = mult.mul(inNGM(2) ? 909 : 3)
		if (hasAch("r68")) mult = mult.mul(inNGM(2) ? 5 : 1.5)
		if (inNGM(2)) if (hasAch("r64")) mult = mult.mul(1e6)
	}
	if (tier == 8 && hasAch("r23")) mult = mult.mul(1.1)
	else if (hasAch("r34")) mult = mult.mul(inNGM(2) ? 2 : 1.02)
	if (tier <= 4 && hasAch("r43")) mult = mult.mul(1.25)
	if (inNGM(2) && hasAch("r31")) mult = mult.mul(productAllTotalBought1())
	if (hasAch("r48")) mult = mult.mul(1.1)
	if (hasAch("r72")) mult = mult.mul(inNGM(2) ? 10 : 1.1)
	if (inOnlyNGM(2) && hasAch("r46")) mult = mult.mul(productAllDims1())
	if (hasAch("r74") && player.currentChallenge != "") mult = mult.mul(inNGM(2) ? 40 : 1.4)
	if (hasAch("r77")) mult = mult.mul(1 + tier / (inNGM(2) ? 10 : 100))
	if (mod.rs && hasAch("r98")) mult = mult.mul(player.infinityDimension8.amount.max(1))
	mult = mult.mul(getR84or73Mult())
	if (inNGM(2)) return mult

	if (hasAch("r56") && player.thisInfinityTime < 1800) mult = mult.mul(3600 / (player.thisInfinityTime + 1800))
	if (hasAch("r78") && player.thisInfinityTime < 3) mult = mult.mul(3.3 / (player.thisInfinityTime + 0.3))
	if (hasAch("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) mult = mult.mul(Math.max(2400 / (player.thisInfinityTime + 600), 1))
	if (hasAch("r91") && player.thisInfinityTime < 50) mult = mult.mul(Math.max(301 - player.thisInfinityTime * 6, 1))
	if (hasAch("r92") && player.thisInfinityTime < 600) mult = mult.mul(Math.max(101 - player.thisInfinityTime / 6, 1))
	return mult
}

function getNormalDimensionVanillaTimeStudyBonus(tier){
	var mult = E(1)
	if (hasTimeStudy(71) && tier !== 8) mult = mult.mul(tmp.sacPow.pow(0.25).min("1e210000"));
	if (hasTimeStudy(91)) mult = mult.mul(Decimal.pow(10, Math.min(player.thisEternity, 18000) / 60));

	let useHigherNDReplMult = hasMasteryStudy("t323") && !player.dilation.active
	if (!useHigherNDReplMult) mult = mult.mul(tmp.rep.nd || 1)

	if (hasTimeStudy(161)) mult = mult.mul(Decimal.pow(10, (player.galacticSacrifice ? 6660 : 616) * (player.aarexModifications.newGameExpVersion ? 5 : 1)))
	if (hasTimeStudy(234) && tier == 1) mult = mult.mul(tmp.sacPow)
	if (hasTimeStudy(193)) mult = mult.mul(Decimal.pow(1.03, getEternitied()).min("1e13000"))
	if (tier == 8 && hasTimeStudy(214)) mult = mult.mul(tmp.sacPow.pow(8).min("1e46000").mul(tmp.sacPow.pow(1.1).min(new Decimal("1e125000"))))

	return mult
}

function getNormalDimensionGalaxyUpgradesBonus(mult){
	if (hasGSacUpg(12) && (hasGSacUpg(42) || !inNGM(4))) mult = mult.mul(galMults.u12())
	if (hasGSacUpg(13) && (inNGM(4) || (!inNC(14) && player.currentChallenge != "postcngm3_3")) && player.currentChallenge != "postcngm3_4") mult = mult.mul(galMults.u13())
	if (hasGSacUpg(15)) mult = mult.mul(galMults.u15())
	if (hasGSacUpg(35)) mult = mult.mul(galMults.u35())
	if (player.challenges.includes("postc4")) mult = mult.pow(1.05);
	if (hasGSacUpg(31)) mult = mult.pow(galMults.u31());
	return mult
}

function getTimeDimMult(tier) {
	let timeAndDimMult = timeMult()
	if (hasInfinityMult(tier) && !inNGM(3)) timeAndDimMult = dimMults().mul(timeAndDimMult)
	return timeAndDimMult
}

function getAfterDefaultDilationLayerAchBonus(tier){
	mult = E(1)
	if (player.challenges.includes("postcngmm_1") || player.currentChallenge=="postcngmm_1") mult = mult.mul(getTimeDimMult(tier))
	if (inNGM(2)) return mult

	if (hasAch("r56") && player.thisInfinityTime < 1800) mult = mult.mul(3600 / (player.thisInfinityTime + 1800));
	if (hasAch("r78") && player.thisInfinityTime < 3) mult = mult.mul(3.3 / (player.thisInfinityTime + 0.3));
	if (hasAch("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) mult = mult.mul(Math.max(2400 / (player.thisInfinityTime + 600), 1))
	if (hasAch("r91") && player.thisInfinityTime < 50) mult = mult.mul(Math.max(301 - player.thisInfinityTime * 6, 1))
	if (hasAch("r92") && player.thisInfinityTime < 600) mult = mult.mul(Math.max(101 - player.thisInfinityTime / 6, 1));
	if (player.currentChallenge == "postc6") mult = mult.dividedBy(player.matter.max(1))
	if (player.currentChallenge == "postc8") mult = mult.mul(player.postC8Mult)
	if (hasGSacUpg(42) && inNGM(4)) mult = mult.mul(galMults.u12())
	if (hasGSacUpg(45) && inNGM(4)) {
		var e = hasGSacUpg(46) ? galMults["u46"]() : 1
		mult = mult.mul(Math.pow(player["timeDimension" + tier].amount.add(10).log10(), e))
	}
	return mult
}

function getStartingNDMult(tier) {
	let dbMult = player.resets < tier ? E(1) : E_pow(getDimensionBoostPower(), player.resets - tier + 1)
	let mptMult = E_pow(getDimensionPowerMultiplier(), Math.floor(player[dimTiers[tier] + "Bought"] / 10))
	return mptMult.mul(dbMult)
}

function getDimensionFinalMultiplier(tier) {
	if (player.currentChallenge == "postcngm3_2") return E(1e100).max(tmp.inf_pow)
	if (player.currentEternityChall == "eterc11") return player.infinityPower.pow(7).max(1).mul(getDimensionBoostPower().pow(player.resets - tier + 1).max(1))

	let mult = getStartingNDMult(tier)
	if (tier == 8) mult = mult.mul(getTotalSacrificeBoost())

	if ((inNC(7) || player.currentChallenge == "postcngm3_3") && !inNGM(2)) {
		if (tier == 4) mult = mult.pow(1.4)
		if (tier == 2) mult = mult.pow(1.7)
	}

	if (player.currentEternityChall != "eterc9" && (!inNGM(3) || player.currentChallenge != "postc2")) mult = mult.mul(tmp.inf_pow)
	mult = mult.mul(getPostBreakInfNDMult())
	mult = mult.mul(player.achPow)
	if (!player.challenges.includes("postcngmm_1") && player.currentChallenge!="postcngmm_1") mult = mult.mul(getTimeDimMult(tier))

	if (tier == 1 && player.infinityUpgrades.includes("unspentBonus")) mult = mult.mul(unspentBonus);
	mult = mult.mul(getNormalDimensionVanillaAchievementBonus(tier))
	mult = mult.mul(getNormalDimensionVanillaTimeStudyBonus(tier))
	if (inNGM(2)) mult = getNormalDimensionGalaxyUpgradesBonus(mult)

	mult = mult.mul(player.postC3Reward)
	if (player.challenges.includes("postc4")) mult = mult.pow(1.05);
	if (player.challenges.includes("postc8") && tier < 8 && tier > 1) mult = mult.mul(mult18);

	if (isADSCRunning() || (inNGM(2) && player.currentChallenge === "postc1")) mult = mult.mul(productAllTotalBought());
	else {
		if (player.currentChallenge == "postc6") mult = mult.dividedBy(player.matter.max(1))
		if (player.currentChallenge == "postc8") mult = mult.mul(player.postC8Mult)
	}

	if (player.currentChallenge == "postc4" && player.postC4Tier != tier && !inNGM(3)) mult = mult.pow(0.25)
	
	if (player.currentEternityChall == "eterc10") mult = mult.mul(ec10bonus)
	if (tier == 8 && hasAch("ng3p27")) mult = mult.mul(tmp.qu.intergal.eff)

	if (mult.gt(10)) mult = dilates(mult.max(1), 2)
	mult = mult.mul(getAfterDefaultDilationLayerAchBonus(tier))
	if (player.currentChallenge == "postc4" && inNGM(3)) mult = mult.sqrt()

	if (mult.gt(10)) mult = dilates(mult.max(1), 1)
	if (player.dilation.upgrades.includes(6)) mult = mult.mul(player.dilation.dilatedTime.max(1).pow(308))
	if (tier == 1 && !inNGM(3) && player.infinityUpgrades.includes("postinfi60")) mult = mult.mul(getNewB60Mult())

	let useHigherNDReplMult = hasMasteryStudy("t323") && !player.dilation.active
	if (useHigherNDReplMult) mult = mult.mul(tmp.rep.nd || 1)
	if (player.dilation.active && hasNanoReward("dil_exp")) mult = mult.pow(getNanorewardEff("dil_exp"))
	if (isBigRipUpgradeActive(1)) mult = mult.mul(tmp.qu.bru[1])

	return mult
}

//Challenges
function multiplySameCosts(cost) {
	for (let i = 1; i <= 8; i++) {
		if (player[dimTiers[i] + "Cost"].e == cost.e) player[dimTiers[i] + "Cost"] = player[dimTiers[i] + "Cost"].mul(getDimensionCostMultiplier(i))
	}
	if (player.tickSpeedCost.e == cost.e) player.tickSpeedCost = player.tickSpeedCost.mul(player.tickspeedMultiplier)
}

function multiplyIC5Costs(cost, tier) {
	if (tier < 5) {
		for (var i = 1; i <= 8; i++) {
			if (player[dimTiers[i] + "Cost"].e <= cost.e) {
				player[dimTiers[i] + "Cost"] = player[dimTiers[i] + "Cost"].mul(player.costMultipliers[i-1])
				if (player[dimTiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].mul(10)
			}
		}
	} else {
		for (var i = 1; i <= 8; i++) {
			if (player[dimTiers[i] + "Cost"].e >= cost.e) {
				player[dimTiers[i] + "Cost"] = player[dimTiers[i] + "Cost"].mul(player.costMultipliers[i-1])
				 if (player[dimTiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].mul(10)
			}
		}
	}
}
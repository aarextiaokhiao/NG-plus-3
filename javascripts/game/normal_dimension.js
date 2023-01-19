function getR84or73Mult(){
	var mult = E(1)
	if (hasAch("r84")) mult = player.money.pow(inNGM(2)?0.0002:0.00004).plus(1);
	else if (hasAch("r73")) mult = player.money.pow(inNGM(2)?0.0001:0.00002).plus(1);
	
	var log = mult.log10()
	if (log > 1e12) log = 1e12 * Math.pow(log / 1e12, .5)
	
	if (log < 0) log = 0
	return pow10(log)
}

function getNormalDimensionVanillaAchievementBonus(tier){
	var mult = E(1)
	if (tier == 1) {
		if (hasAch("r28")) mult = mult.times(1.1);
		if (hasAch("r31")) mult = mult.times(1.05);
		if (hasAch("r71")) mult = mult.times(inNGM(2) ? 909 : 3);
		if (hasAch("r68")) mult = mult.times(inNGM(2) ? 5 : 1.5);
		if (inNGM(2)) if (hasAch("r64")) mult = mult.times(1e6);
	}
	if (tier == 8 && hasAch("r23")) mult = mult.times(1.1);
	else if (hasAch("r34")) mult = mult.times(inNGM(2) ? 2 : 1.02);
	if (tier <= 4 && hasAch("r43")) mult = mult.times(1.25);
	if (inNGM(2) && hasAch("r31")) mult = mult.times(productAllTotalBought1());
	if (hasAch("r48")) mult = mult.times(1.1);
	if (hasAch("r72")) mult = mult.times(inNGM(2) ? 10 : 1.1); // tbd
	if (inOnlyNGM(2) && hasAch("r46")) mult = mult.times(productAllDims1());
	if (hasAch("r74") && player.currentChallenge != "") mult = mult.times(inNGM(2) ? 40 : 1.4);
	if (hasAch("r77")) mult = mult.times(1 + tier / (inNGM(2) ? 10 : 100));
	if (player.boughtDims && hasAch("r98")) mult = mult.times(player.infinityDimension8.amount.max(1))
	mult = mult.times(getR84or73Mult())
	if (inNGM(2)) return mult
	if (hasAch("r56") && player.thisInfinityTime < 1800) mult = mult.times(3600 / (player.thisInfinityTime + 1800));
	if (hasAch("r78") && player.thisInfinityTime < 3) mult = mult.times(3.3 / (player.thisInfinityTime + 0.3));
	if (hasAch("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) mult = mult.times(Math.max(2400 / (player.thisInfinityTime + 600), 1))
	if (hasAch("r91") && player.thisInfinityTime < 50) mult = mult.times(Math.max(301 - player.thisInfinityTime * 6, 1))
	if (hasAch("r92") && player.thisInfinityTime < 600) mult = mult.times(Math.max(101 - player.thisInfinityTime / 6, 1));
	return mult
}

function getNormalDimensionVanillaTimeStudyBonus(tier){
	var mult = E(1)
	if (player.timestudy.studies.includes(71) && tier !== 8) mult = mult.times(tmp.sacPow.pow(0.25).min("1e210000"));
	if (player.timestudy.studies.includes(91)) mult = mult.times(pow10(Math.min(player.thisEternity, 18000) / 60));
	let useHigherNDReplMult = !player.dilation.active ? false : !player.masterystudies ? false : hasMasteryStudy("t323")
	if (!useHigherNDReplMult) mult = mult.times(tmp.nrm)
	if (player.timestudy.studies.includes(161)) mult = mult.times(pow10((inNGM(2) ? 6660 : 616) * (mod.ngep ? 5 : 1)))
	if (player.timestudy.studies.includes(234) && tier == 1) mult = mult.times(tmp.sacPow)
	if (player.timestudy.studies.includes(193)) mult = mult.times(E_pow(1.03, getEternitied()).min("1e13000"))
	if (tier == 8 && player.timestudy.studies.includes(214)) mult = mult.times((tmp.sacPow.pow(8)).min("1e46000").times(tmp.sacPow.pow(1.1).min(E("1e125000"))))
	return mult
}

function getNormalDimensionGalaxyUpgradesBonus(tier,mult){
	if (inNGM(2)) return mult
	
	if (hasGalUpg(12) && (hasGalUpg(42) || !inNGM(4))) mult = mult.times(galMults.u12())
	if (hasGalUpg(13) && ((!inNC(14) && player.currentChallenge != "postcngm3_3") || !inNGM(3) || inNGM(4)) && player.currentChallenge != "postcngm3_4") mult = mult.times(galMults.u13())
	if (hasGalUpg(15)) mult = mult.times(galMults.u15())
	if (hasGalUpg(35)) mult = mult.times(galMults.u35())
	if (player.challenges.includes("postc4")) mult = mult.pow(1.05);
	if (hasGalUpg(31)) mult = mult.pow(galMults.u31());
	return mult
}

function getAfterDefaultDilationLayerAchBonus(tier){
	mult = E(1)
	let timeAndDimMult = timeMult()
	if (hasInfinityMult(tier) && !inNGM(3)) timeAndDimMult = dimMults().times(timeAndDimMult)
	if (player.challenges.includes("postcngmm_1")||player.currentChallenge=="postcngmm_1") mult = mult.times(timeAndDimMult)
	if (inNGM(2)) return mult
	if (hasAch("r56") && player.thisInfinityTime < 1800) mult = mult.times(3600 / (player.thisInfinityTime + 1800));
	if (hasAch("r78") && player.thisInfinityTime < 3) mult = mult.times(3.3 / (player.thisInfinityTime + 0.3));
	if (hasAch("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) mult = mult.times(Math.max(2400 / (player.thisInfinityTime + 600), 1))
	if (hasAch("r91") && player.thisInfinityTime < 50) mult = mult.times(Math.max(301 - player.thisInfinityTime * 6, 1))
	if (hasAch("r92") && player.thisInfinityTime < 600) mult = mult.times(Math.max(101 - player.thisInfinityTime / 6, 1));
	if (player.currentChallenge == "postc6" || inQC(6)) mult = mult.dividedBy(player.matter.max(1))
	if (player.currentChallenge == "postc8" || inQC(6)) mult = mult.times(player.postC8Mult)
	if (hasGalUpg(12) && hasGalUpg(42) && inNGM(4)) mult = mult.times(galMults.u12())
	if (hasGalUpg(45) && inNGM(4)) {
		var e = hasGalUpg(46) ? galMults["u46"]() : 1
		mult = mult.times(Math.pow(player["timeDimension" + tier].amount.plus(10).log10(), e))
	}
	return mult
}

function getPostBreakInfNDMult(){
	mult = E(1)
	if (player.infinityUpgrades.includes("totalMult")) mult = mult.times(totalMult)
	if (player.infinityUpgrades.includes("currentMult")) mult = mult.times(currentMult)
	if (player.infinityUpgrades.includes("infinitiedMult")) mult = mult.times(infinitiedMult)
	if (player.infinityUpgrades.includes("achievementMult")) mult = mult.times(achievementMult)
	if (player.infinityUpgrades.includes("challengeMult")) mult = mult.times(worstChallengeBonus)
	return mult
}

function getStartingNDMult(tier){
	let mPerTen = getDimensionPowerMultiplier()
	let mPerDB = getDimensionBoostPower()
	let dbMult = player.resets < tier ? E(1) : E_pow(mPerDB, player.resets - tier + 1)
	let mptMult = E_pow(mPerTen, Math.floor(player[TIER_NAMES[tier]+"Bought"] / 10))
	return mptMult.times(dbMult)
}

function getDimensionFinalMultiplier(tier) {
	let mult = getStartingNDMult(tier)
	if (tier == 8) mult = mult.times(getTotalSacrificeBoost())
	
	if (aarMod.newGameMinusVersion !== undefined) mult = mult.times(.1)
	if (!tmp.infPow) updateInfinityPowerEffects()
	if (player.currentChallenge == "postcngm3_2") return tmp.infPow.max(1e100)
	if (player.currentEternityChall == "eterc11") return tmp.infPow.times(E_pow(getDimensionBoostPower(), player.resets - tier + 1).max(1))
	if ((inNC(7) || player.currentChallenge == "postcngm3_3") && inNGM(2)) {
		if (tier == 4) mult = mult.pow(1.4)
		if (tier == 2) mult = mult.pow(1.7)
	}

	if (player.currentEternityChall != "eterc9" && (!inNGM(3) || player.currentChallenge != "postc2")) mult = mult.times(tmp.infPow)

	mult = mult.times(getPostBreakInfNDMult())

	let timeAndDimMult = timeMult()
	if (hasInfinityMult(tier) && !inNGM(3)) timeAndDimMult = dimMults().times(timeAndDimMult)
	if (!inNGM(3)) mult = mult.times(dimMults())
	if (!player.challenges.includes("postcngmm_1") && player.currentChallenge!="postcngmm_1") mult = mult.times(timeAndDimMult)
	
	if (tier == 1 && player.infinityUpgrades.includes("unspentBonus")) mult = mult.times(unspentBonus);
	mult = mult.times(getNormalDimensionVanillaAchievementBonus(tier))
	mult = mult.times(player.achPow)
	mult = mult.times(getNormalDimensionVanillaTimeStudyBonus(tier))
	mult = getNormalDimensionGalaxyUpgradesBonus(tier,mult)

	mult = mult.times(player.postC3Reward)
	if (player.challenges.includes("postc4") && inNGM(2)) mult = mult.pow(1.05);
	if (player.challenges.includes("postc8") && tier < 8 && tier > 1) mult = mult.times(mult18);

	if (isADSCRunning() || (inNGM(2) && player.currentChallenge === "postc1")) mult = mult.times(productAllTotalBought());
	else {
		if (player.currentChallenge == "postc6" || inQC(6)) mult = mult.dividedBy(player.matter.max(1))
		if (player.currentChallenge == "postc8" || inQC(6)) mult = mult.times(player.postC8Mult)
	}

	if (player.currentChallenge == "postc4" && player.postC4Tier != tier && !inNGM(3)) mult = mult.pow(0.25)
	
	if (player.currentEternityChall == "eterc10") mult = mult.times(ec10bonus)
	
	if (tier == 8 && hasAch("ng3p27")) mult = mult.times(tmp.ig)
	
	if (mult.gt(10)) mult = dilates(mult.max(1), 2)
	mult = mult.times(getAfterDefaultDilationLayerAchBonus(tier))
	if (player.currentChallenge == "postc4" && inNGM(3)) mult = mult.sqrt()

	if (mult.gt(10)) mult = dilates(mult.max(1), 1)
	if (player.dilation.upgrades.includes(6)) mult = mult.times(player.dilation.dilatedTime.max(1).pow(308))
	if (tier == 1 && !inNGM(3) && player.infinityUpgrades.includes("postinfi60")) mult = mult.times(getNewB60Mult())
	let useHigherNDReplMult = !player.dilation.active ? false : !player.masterystudies ? false : hasMasteryStudy("t323")
	if (useHigherNDReplMult) mult = mult.times(tmp.nrm)
	if (player.dilation.active && isNanoEffectUsed("dil_effect_exp")) mult = mult.pow(tmp.nf.effects.dil_effect_exp)
	if (isBigRipUpgradeActive(1)) mult = mult.times(tmp.bru[1])

	return mult
}

function getNormalDimensions() {
	return Math.min(player.resets + 4, getMaxNormalDimensions())
}

function getMaxNormalDimensions() {
	return inQC(1) ? 2 : player.currentEternityChall == "eterc3" ? 4 : inNC(4) || player.currentChallenge == "postc1" ? 6 : 8
}

function getDimensionDescription(tier) {
	var name = TIER_NAMES[tier];
	if (tier == getNormalDimensions()) return getFullExpansion(inNC(11) ? getAmount(tier) : player[name + 'Bought']) + ' (' + dimBought(tier) + ')';
	else if (player.money.l > 1e9) return shortenND(player[name + 'Amount'])
	else if (player.money.l > 1e6) return shortenND(player[name + 'Amount']) + '  (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
	else return shortenND(player[name + 'Amount']) + ' (' + dimBought(tier) + ')  (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getDimensionRateOfChange(tier) {
	if (tier == 8 || (player.currentEternityChall == "eterc3" && tier > 3)) return 0;

	let toGain = getDimensionProductionPerSecond(tier + 1)
	if (tier == 7 && player.currentEternityChall == "eterc7") toGain = DimensionProduction(1).times(10)

	var name = TIER_NAMES[tier];
	if (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4)) {
		if (tier == 7) return 0
		else toGain = getDimensionProductionPerSecond(tier + 2);
	}
	var current = player[name + 'Amount'].max(1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.times(10).dividedBy(current);

	return change;
}

let infToDimMultUpgs = [null, "18Mult", "27Mult", "36Mult", "45Mult", "45Mult", "36Mult", "27Mult", "18Mult"]
function hasInfinityMult(tier) {
	return player.infinityUpgrades.includes(infToDimMultUpgs[tier])
}

function multiplySameCosts(cost) {
	var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
	var tierCosts = [ null, E(1e3), E(1e4), E(1e5), E(1e6), E(1e8), E(1e10), E(1e12), E(1e15) ];

	for (let i = 1; i <= 8; i++) {
		if (player[tiers[i] + "Cost"].e == cost.e) player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(tierCosts[i])
	}
	if (player.tickSpeedCost.e == cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
}

function multiplyPC5Costs(cost, tier) {
	var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
	if (tier < 5) {
		for (var i = 1; i <= 8; i++) {
			if (player[tiers[i] + "Cost"].e <= cost.e) {
				player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i-1])
				if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].times(10)
			}
		}
	} else {
		for (var i = 1; i <= 8; i++) {
			if (player[tiers[i] + "Cost"].e >= cost.e) {
				player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i-1])
				 if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].times(10)
			}
		}
	}
}
	
function canBuyDimension(tier) {
	if (tmp.ri) return false
	if (tier > getNormalDimensions()) return false
	if (tier > 1 && getAmount(tier - 1) == 0 && getEternitied() < 30) return false

	return true
}
	
function getDimensionPowerMultiplier(focusOn, debug) {
	let ret = focusOn || inNC(9) || player.currentChallenge=="postc1" ? getMPTBase(focusOn) : tmp.mptb
	let exp = 1
	if (mod.ngp3 && focusOn != "linear") exp = focusOn == "no-rg4" ? getMPTExp(focusOn) : tmp.mpte
	if (exp > 1) ret = E_pow(ret, exp)
	if (mod.ngmu) {
		ret = Decimal.times(ret, Math.log10(player.resets + 1) + 1)
		ret = Decimal.times(ret, Math.log10(Math.max(player.galaxies, 0) + 1) * 5 + 1)
	}
	return ret
}
	
function getMPTBase(focusOn) {
	if (((inQC(5) || inQC(7)) && focusOn != "linear") || (((inNC(13) && !inNGM(3)) || player.currentChallenge == "postc1" || player.currentChallenge == "postcngm3_1") && inNGM(2))) {
		if (hasMasteryStudy("t321")) return E("1e430")
		return 1
	}
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
	if (inNGM(2)) if (hasGalUpg(33) && ((!inNC(14) && player.currentChallenge != "postcngm3_3") || !inNGM(3) || inNGM(4)) && player.currentChallenge != "postcngm3_4") ret *= galMults.u33();
	if (focusOn == "no-QC5") return ret
	if (mod.ngp3) {
		ret += tmp.qcRewards[5]
		if (isNanoEffectUsed("per_10_power")) ret += tmp.nf.effects.per_10_power
	}
	return ret
}

function getMPTExp(focusOn) {
	let x = 1
	if (hasMasteryStudy("d7")) x = getElectronBoost(focusOn)
	return x
}

function infUpg12Pow() {
	if (inNGM(3)) return 1.05 + .01 * Math.min(Math.max(player.infinitied, 0), 45)
	if (inNGM(2)) return 1.05 + .0025 * Math.min(Math.max(player.infinitied, 0), 60)
	if (mod.ngep) return 1.2
	return 1.1
}
	
function clearDimensions(amount) {
	var tiers = [null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
	
	for (var i = 1; i <= amount; i++) {
		player[tiers[i] + "Amount"] = E(0)
	}
}
	
	
function getDimensionCostMultiplier(tier) {
	var multiplier2 = [E(1e3), E(5e3), E(1e4), E(1.2e4), E(1.8e4), E(2.6e4), E(3.2e4), E(4.2e4)];
	if (inNC(10)) return multiplier2[tier - 1];
	else return player.costMultipliers[tier - 1];
}
	
function onBuyDimension(tier) {
	giveAchievement(allAchievements["r1"+tier])
	if (inNC(2) || player.currentChallenge == "postc1") player.chall2Pow = 0
	if (inNC(8) || player.currentChallenge == "postc1") clearDimensions(tier-1)
	if ((inNC(12) || player.currentChallenge == "postc1" || player.currentChallenge == "postc6" || inQC(6)) && player.matter.equals(0)) player.matter = E(1)
	player.postC4Tier = tier;
	player.postC8Mult = E(1)
	if (tier != 8) player.dimlife = false
	if (tier != 1) player.dead = false
	if (mod.ngp3 && tier > 4) player.old = false
}
	
function getAmount(tier) {
	let ret = player[TIER_NAMES[tier] + "Amount"].toNumber()
	if (!break_infinity_js) ret = Math.round(ret)
	return ret
}

function dimBought(tier) {
	return player[TIER_NAMES[tier] + "Bought"] % 10;
}

function recordBought (name, num) {
	player[name + 'Bought'] += num;
	if (inNGM(2)) player.totalBoughtDims[name] = (player.totalBoughtDims[name] ? player.totalBoughtDims[name] : 0) + num;
}

function costIncreaseActive(cost) {
	if (inNC(10) || player.currentChallenge == "postc1") return false
	return cost.gte(Number.MAX_VALUE) || player.currentChallenge === 'postcngmm_2';
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

function buyOneDimension(tier) {
	if (!canBuyDimension(tier)) return false
	let name = TIER_NAMES[tier]
	let cost = player[name + 'Cost']
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return false
	getOrSubResource(tier, cost)
	player[name + "Amount"] = player[name + "Amount"].add(1)
	recordBought(name, 1)
	if (dimBought(tier) == 0) {
		if (player.currentChallenge == "postc5" && !inNGM(3)) multiplyPC5Costs(player[name + 'Cost'], tier)
		else if (inNC(5) && !inNGM(3)) multiplySameCosts(player[name + 'Cost'])
		else player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
		if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(getDimensionCostMultiplierIncrease())
		floatText("D" + tier, "x" + shortenMoney(getDimensionPowerMultiplier()))
	}
	if (tier == 1 && getAmount(1) >= 1e150) giveAchievement("There's no point in doing that")
	if (getAmount(8) == 99) giveAchievement("The 9th Dimension is a lie");
	onBuyDimension(tier)
	return true
}

function buyManyDimension(tier, quick) {
	if (!canBuyDimension(tier)) return false
	let name = TIER_NAMES[tier]
	let toBuy = 10 - dimBought(tier)
	let cost = player[name + 'Cost'].times(toBuy)
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return false
	getOrSubResource(tier, cost)
	player[name + "Amount"] = player[name + "Amount"].add(toBuy)
	recordBought(name, toBuy)
	if (player.currentChallenge == "postc5" && !inNGM(3)) multiplyPC5Costs(player[name + 'Cost'], tier)
	else if (inNC(5) && !inNGM(3)) multiplySameCosts(player[name + 'Cost'])
	else player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
	if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(getDimensionCostMultiplierIncrease())
	if (!quick) {
		floatText("D" + tier, "x" + shortenMoney(getDimensionPowerMultiplier()))
		onBuyDimension(tier)
	}
	return true
}

var initCost
var costMults
function buyBulkDimension(tier, bulk, auto) {
	if (!canBuyDimension(tier)) return
	let bought = 0
	if (dimBought(tier) > 0) {
		if (!buyManyDimension(tier, true)) return
		bought++
	}
	let name = TIER_NAMES[tier]
	let cost = player[name + 'Cost'].times(10)
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return
	if (((!inNC(5) && player.currentChallenge != "postc5") || inNGM(3)) && !inNC(9) && !costIncreaseActive(player[name + "Cost"])) {
		let mult = getDimensionCostMultiplier(tier)
		let max = Number.POSITIVE_INFINITY
		if (!inNC(10) && player.currentChallenge != "postc1") max = Math.ceil(Decimal.div(Number.MAX_VALUE, cost).log(mult) + 1)
		var toBuy = Math.min(Math.min(Math.floor(resource.div(cost).times(mult-1).add(1).log(mult)), bulk-bought), max)
		getOrSubResource(tier, E_pow(mult, toBuy).sub(1).div(mult-1).times(cost))
		player[name + "Amount"] = player[name + "Amount"].add(toBuy * 10)
		recordBought(name, toBuy*10)
		player[name + "Cost"] = player[name + "Cost"].times(E_pow(mult, toBuy))
		if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(getDimensionCostMultiplierIncrease())
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
		let c = player[name + "Cost"].times(10).log10() - player.money.log10()
		let d = b * b - 4 * a * c
		if (d < 0) break
		let toBuy = Math.min(Math.floor(( -b + Math.sqrt(d)) / (2 * a)) + 1, bulk - bought)
		if (toBuy < 1) break
		let newCost = player[name + "Cost"].times(E_pow(player.costMultipliers[tier - 1], toBuy - 1).times(E_pow(mi, (toBuy - 1) * (toBuy - 2) / 2)))
		let newMult = player.costMultipliers[tier - 1].times(E_pow(mi, toBuy - 1))
		if (!inQC(1)) {
			if (player.money.gte(newCost)) player.money = player.money.sub(newCost)
			else if (player.dimensionMultDecrease > 3) player.money = E(0)
		}
		player[name + "Amount"] = player[name + "Amount"].add(toBuy * 10)
		recordBought(name, toBuy * 10)
		player[name + "Cost"] = newCost.times(newMult)
		player.costMultipliers[tier - 1] = newMult.times(mi)
		bought += toBuy
	}
	if (!auto) floatText("D" + tier, "x" + shortenMoney(E_pow(getDimensionPowerMultiplier(), bought)))
	onBuyDimension(tier)
}

function canQuickBuyDim(tier) {
	if (((inNC(5) || player.currentChallenge == "postc5") && !inNGM(3)) || inNC(9)) return false
	return player.dimensionMultDecrease <= 3 || player.costMultipliers[tier-1].gt(Number.MAX_SAFE_INTEGER)
}

function getOrSubResource(tier, sub) {
	if (sub == undefined || inQC(1)) {
		if (tier > 2 && (inNC(10) || player.currentChallenge == "postc1")) return player[TIER_NAMES[tier-2] + "Amount"]
		return player.money
	} else {
		if (tier > 2 && (inNC(10) || player.currentChallenge == "postc1")) {
			if (sub.gt(player[TIER_NAMES[tier - 2] + "Amount"])) player[TIER_NAMES[tier - 2] + "Amount"] = E(0)
			else player[TIER_NAMES[tier - 2] + "Amount"] = player[TIER_NAMES[tier - 2] + "Amount"].sub(sub)
		} else if (sub.gt(player.money)) player.money = E(0)
		else player.money = player.money.sub(sub)
	}
}


function timeMult() {
	var mult = E(1)
	if (player.infinityUpgrades.includes("timeMult")) mult = mult.times(infUpg11Pow());
	if (player.infinityUpgrades.includes("timeMult2")) mult = mult.times(infUpg13Pow());
	if (hasAch("r76")) mult = mult.times(Math.pow(player.totalTimePlayed / (600 * 60 * 48), inNGM(2) ? 0.1 : 0.05));
	return mult;
}

function infUpg11Pow() {
	if (inNGM(2)) return Math.max(Math.pow(player.totalTimePlayed / 864e3, 0.75), 1)
	else return Math.max(Math.pow(player.totalTimePlayed / 1200, 0.15), 1)
}

function infUpg13Pow() {
	if (inNGM(2)) return Math.pow(1 + player.thisInfinityTime / 2400, 1.5)
	else return Math.max(Math.pow(player.thisInfinityTime / 2400, 0.25), 1)
}

function dimMults() {
	return E_pow(Decimal.times(getInfinitied(), 0.2).add(1),(inNGM(2) ? 2 : 1) * (player.timestudy.studies.includes(31) ? 4 : 1))
}

function getInfinitiedMult() {
	var add = inNGM(2) ? 0 : 1
	var base = (inNGM(2) ? 1 : 0) + Decimal.add(getInfinitied(), 1).log10() * (inNGM(2) ? 100 : 10)
	var exp = (inNGM(2) ? 2 : 1) * (player.timestudy.studies.includes(31) ? 4 : 1)
	if (inNGM(4)) {
		if ((player.currentChallenge == "postcngmm_1" || player.challenges.includes("postcngmm_1")) && !hasAch("r71")) exp += .2
		else exp *= 1 + Math.log10(getInfinitied() + 1) / 3
	}
	return add + Math.pow(base, exp)
}

function getDimensionProductionPerSecond(tier) {
	let ret = player[TIER_NAMES[tier] + 'Amount'].floor()
	if ((inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4)) && !inNGM(2)) {
		if (tier == 4) ret = ret.pow(1.3)
		else if (tier == 2) ret = ret.pow(1.5)
	}
	ret = ret.times(getDimensionFinalMultiplier(tier))
	if (inNC(2) || player.currentChallenge == "postc1") ret = ret.times(player.chall2Pow)
	if (tier == 1 && (inNC(3) || player.currentChallenge == "postc1")) ret = ret.times(player.chall3Pow)
	if (inNGM(3)) ret = ret.div(10)
	if (inNGM(4)) ret = ret.div(100)
	if (tier == 1 && (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4))) ret = ret.plus(getDimensionProductionPerSecond(2))
	let tick = dilates(Decimal.div(1e3,getTickspeed()),"tick")
	if (player.dilation.active && isNanoEffectUsed("dil_effect_exp")) tick = tick.pow(tmp.nf.effects.dil_effect_exp)
	ret = ret.times(tick)
	return ret
}

//infinity dimensions

function getInfinityDimensionFinalMultiplier(tier){
	return DimensionPower(tier)
}

function getInfinityDimensionMultiplier(tier){
	return DimensionPower(tier)
}

function maxAllID() {
	for (var t = 1; t <= 8; t++) {
		var dim = player["infinityDimension"+t]
		var cost = getIDCost(t)
		if (player.infDimensionsUnlocked[t - 1] && player.infinityPoints.gte(dim.cost)) {
			var costMult = getIDCostMult(t)
			if (player.infinityPoints.lt(pow10(1e10))) {
				var toBuy = Math.max(Math.floor(player.infinityPoints.div(9 - t).div(cost).times(costMult - 1).add(1).log(costMult)), 1)
				var toSpend = E_pow(costMult, toBuy).sub(1).div(costMult-1).times(cost).round()
				if (toSpend.gt(player.infinityPoints)) player.infinityPoints = E(0)
				else player.infinityPoints = player.infinityPoints.sub(toSpend)
			} else var toBuy = Math.floor(player.infinityPoints.div(cost).log(costMult))
			dim.amount = dim.amount.add(toBuy * 10)
			dim.baseAmount += toBuy * 10
			dim.power=dim.power.times(E_pow(getInfBuy10Mult(t),toBuy))
			dim.cost=dim.cost.times(E_pow(costMult,toBuy))
		}
	}
}

function hideMaxIDButton(onLoad=false) {
	if (!onLoad) if (!player.masterystudies) return
	var hide = true
	if (player.masterystudies && player.currentEterChall != "eterc8") {
		hide = false
		if (player.eternities > 17) {
			for (var d = 0; d < 8; d++) {
				if (player.infDimBuyers[d] && d > 6) hide = true
				else break
			}
		}
	}
	el("maxAllID").style.display = hide ? "none" : ""
}

function DimensionDescription(tier) {
	if (tier > (inQC(4) ? 6 : 7) && (ECComps("eterc7") === 0 || player.timeDimension1.amount.eq(0) || tier == 7) && player.currentEternityChall != "eterc7") return getFullExpansion(Math.round(player["infinityDimension" + tier].amount.toNumber()));
	else if (player.infinityPower.l > 1e7) return shortenDimensions(player['infinityDimension' + tier].amount)
	else return shortenDimensions(player['infinityDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, DimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function DimensionRateOfChange(tier) {
	var toGain = DimensionProduction(tier + ((inQC(4)) && tier < 8 ? 2 : 1))
	var current = Decimal.max(player["infinityDimension"+tier].amount, 1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change  = toGain.times(tier > 7 ? 1 : 10).dividedBy(current);
	return change;
}

function updateInfinityDimensions() {
	if (el("dimensions").style.display == "block" && el("infinitydimensions").style.display == "block") {
		updateInfPower()
		for (let tier = 1; tier <= 8; ++tier) {
			var unl = player.infDimensionsUnlocked[tier-1]
			el("infRow" + tier).style.display = unl ? "" : "none"
			if (unl) {
				el("infD" + tier).textContent = DISPLAY_NAMES[tier] + " Infinity Dimension x" + shortenMoney(DimensionPower(tier));
				el("infAmount" + tier).textContent = DimensionDescription(tier);
				el("infMax" + tier).textContent = (quantumed ? '' : "Cost: ") + shortenInfDimCosts(getIDCost(tier)) + " IP"
				el("infMax"+tier).className = player.infinityPoints.gte(getIDCost(tier)) ? "storebtn" : "unavailablebtn"
				el("infRow" + tier).style.visibility = "visible";
			}
		}
	}
}

function DimensionProduction(tier) {
	if (inQC(8)) return E(0)
	if (tier == 9) return getTimeDimensionProduction(1).pow(ECComps("eterc7") * 0.2).max(1).minus(1)
	var dim = player["infinityDimension" + tier]
	var ret = dim.amount
	if (inQC(4) && tier == 1) ret = ret.plus(player.infinityDimension2.amount.floor())
	if (player.tickspeedBoosts !== undefined && player.currentChallenge == "postc2") return E(0)
	if (player.currentEternityChall == "eterc11") return ret
	if (player.currentEternityChall == "eterc7") ret = dilates(ret.dividedBy(player.tickspeed.dividedBy(1000)))
	if (aarMod.ngmX > 3) ret = ret.div(100)
	ret = ret.times(DimensionPower(tier))
	if (player.challenges.includes("postc6") && !inQC(3)) return ret.times(Decimal.div(1000, dilates(player.tickspeed)).pow(0.0005))
	return ret
}

function getTotalIDEUMult(){
	var mult = E(1)
	if (player.eternityUpgrades.includes(1)) mult = mult.times(player.eternityPoints.plus(1))
	if (player.eternityUpgrades.includes(2)) mult = mult.times(getEU2Mult())
	if (player.eternityUpgrades.includes(3)) mult = mult.times(getEU3Mult())
	return mult
}

function getInfDimPathIDMult(tier){
	var mult = E(1)
	if (player.timestudy.studies.includes(72) && tier == 4) mult = mult.times(tmp.sacPow.pow(0.04).max(1).min("1e30000"))
	if (player.timestudy.studies.includes(82)) mult = mult.times(E_pow(1.0000109, Math.pow(player.resets, 2)).min(player.meta == undefined ? 1 / 0 : '1e80000'))
	if (player.timestudy.studies.includes(92)) mult = mult.times(pow2(600 / Math.max(player.bestEternity, 20)))
	if (player.timestudy.studies.includes(162)) mult = mult.times(pow10((player.galacticSacrifice ? 234 : 11) * (aarMod.newGameExpVersion ? 5 : 1)))
	return mult
}

function getStartingIDPower(tier){
	var dim = player["infinityDimension" + tier]
	var mult = dim.power
	return mult
}

function DimensionPower(tier) {
  	var dim = player["infinityDimension" + tier]
  	if (player.currentEternityChall == "eterc2" || player.currentEternityChall == "eterc10" || player.currentEternityChall == "eterc13") return E(0)
  	if (player.currentEternityChall == "eterc11") return E(1)
  	if (player.currentEternityChall == 'eterc14') return getIDReplMult()
  	if (inQC(3)) return getExtraDimensionBoostPower()
  	
	var mult = getStartingIDPower(tier)
	
  	mult = mult.times(infDimPow)

  	if (hasAch("r94") && tier == 1) mult = mult.times(2);
  	if (hasAch("r75") && !player.boughtDims) mult = mult.times(player.achPow);
  	if (hasAch("r66") && player.galacticSacrifice !== undefined) mult = mult.times(Math.max(1, Math.abs(player.tickspeed.log10()) / 29))
  	if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.galacticSacrifice === undefined) mult = mult.times(getIDReplMult())

  	mult = mult.times(getInfDimPathIDMult(tier))
	mult = mult.times(getTotalIDEUMult())
	
	if (ECComps("eterc2") !== 0 && tier == 1) mult = mult.times(getECReward(2))
  	if (ECComps("eterc4") !== 0) mult = mult.times(getECReward(4))

  	var ec9 = E(1)
  	if (ECComps("eterc9") !== 0) ec9 = getECReward(9)
  	if (player.galacticSacrifice === undefined) mult = mult.times(ec9)

  	if (inQC(6)) mult = mult.times(player.postC8Mult).dividedBy(player.matter.max(1))

  	mult = dilates(mult, 2)
  	if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.galacticSacrifice !== undefined) mult = mult.times(getIDReplMult())
  	if (player.galacticSacrifice !== undefined) mult = mult.times(ec9)

  	mult = dilates(mult, 1)
  	return mult
}

function resetInfDimensions() {
	for (var t = 1; t < 9; t++) {
		if (player.infDimensionsUnlocked[t - 1]) player["infinityDimension" + t].amount = E(player["infinityDimension" + t].baseAmount)
	}
	if (player.infDimensionsUnlocked[0]) player.infinityPower = E(0)
}

function resetInfDimUnlocked() {
	let value = player != undefined && getEternitied() >= 25 && hasAch("ng3p21")
	let data = []
	for (var d = 1; d <= 8; d++) data.push(value)
	return data
}

var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [[null, 50, 30, 10, 5, 5, 5, 5, 5], [null, 500, 300, 100, 50, 25, 10, 5, 5]]
var infBaseCost = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280]
function getIDCost(tier) {
	let ret = player["infinityDimension" + tier].cost
	if (player.galacticSacrifice !== undefined && hasAch("r123")) ret = ret.div(galMults.u11())
	return ret
}

function getIDCostMult(tier) {
	let ret = infCostMults[tier]
	if (ECComps("eterc12")) ret = Math.pow(ret,getECReward(12))
	if (player.galacticSacrifice == undefined) return ret
	if (player.infinityUpgrades.includes("postinfi53")) ret /= 50
	if (player.galacticSacrifice.upgrades.includes(42)) ret /= 1 + 5 * Math.log10(player.eternityPoints.plus(1).log10() + 1)
	let cap = .1
	if (player.achPow.gte(E_pow(5,11.9)) && tier > 1) {
		cap = .02
		ret /= Math.max(1, Math.log(player.totalmoney.log10())/10-.5)
	}
	return Math.max(ret,Math.pow(infCostMults[tier],cap))
}

function getInfBuy10Mult(tier) {
	let ret = infPowerMults[player.galacticSacrifice!==undefined&&player.tickspeedBoosts===undefined ? 1 : 0][tier]
	if (player.galacticSacrifice !== undefined && player.galacticSacrifice.upgrades.includes(41)) ret *= player.galacticSacrifice.galaxyPoints.max(10).log10()
	if (player.dilation.upgrades.includes("ngmm6")) ret *= getDil45Mult()
	return ret
}

function buyManyInfinityDimension(tier, auto) {
  	if (player.eterc8ids <= 0 && player.currentEternityChall == "eterc8") return false
  	var dim = player["infinityDimension" + tier]
  	var cost = getIDCost(tier)
  	if (player.infinityPoints.lt(cost)) return false
  	if (!player.infDimensionsUnlocked[tier - 1]) return false
	if (player.eterc8ids == 0) return false
	if (player.infinityPoints.lt(pow10(1e10))) player.infinityPoints = player.infinityPoints.minus(cost)
	dim.amount = dim.amount.plus(10);
	dim.cost = Decimal.round(dim.cost.times(getIDCostMult(tier)))
	dim.power = dim.power.times(getInfBuy10Mult(tier))
	dim.baseAmount += 10

	if (player.currentEternityChall == "eterc8") player.eterc8ids -= 1
	el("eterc8ids").textContent = "You have " + player.eterc8ids + " purchases left."
	if (inQC(6)) player.postC8Mult = E(1)
	return true
}

function buyMaxInfDims(tier, auto) {
	var dim = player["infinityDimension"+tier]
	var cost = getIDCost(tier)
	if (player.infinityPoints.lt(cost)) return false
	if (!player.infDimensionsUnlocked[tier-1]) return false

	var costMult = getIDCostMult(tier)
	var toBuy = Math.floor(player.infinityPoints.div(cost).log10() / Math.log10(costMult))
	dim.cost = dim.cost.times(E_pow(costMult, toBuy-1))
	if (player.infinityPoints.lt(pow10(1e10))) player.infinityPoints = player.infinityPoints.minus(getIDCost(tier).min(player.infinityPoints))
	dim.cost = dim.cost.times(costMult)
	dim.amount = dim.amount.plus(10 * toBuy);
	dim.power = dim.power.times(E_pow(getInfBuy10Mult(tier), toBuy))
	dim.baseAmount += 10 * toBuy
	buyManyInfinityDimension(tier, auto)
}

function updateInfinityPowerEffects() {
	tmp.infPrePowExp = getPreInfinityPowerEffectExp()
	tmp.infPowExp = getInfinityPowerEffectExp()
	tmp.infPow = getInfinityPowerEffect()
}

function getInfinityPowerEffect() {
	if (player.currentEternityChall == "eterc9") return E_pow(Math.max(player.infinityPower.log2(), 1), player.galacticSacrifice == undefined ? 4 : 30).max(1)
	let log = player.infinityPower.max(1).log10()
	log *= tmp.infPowExp
	return pow10(log)
}

function getPreInfinityPowerEffectExp() {
	let x = 7
	let galaxies = Math.max(player.galaxies, 0)
	if (player.galacticSacrifice != undefined) {
		x = Math.pow(galaxies, 0.7)
		if (player.currentChallenge === "postcngm3_2" || (player.tickspeedBoosts != undefined && player.currentChallenge === "postc1")) {
			if (aarMod.ngmX >= 4) {
				x = Math.pow(galaxies, 1.25)
				if (x > 7) x += 1
			} else x = galaxies
		}
		else if (player.challenges.includes("postcngm3_2")) x = Math.pow(galaxies + (player.resets + player.tickspeedBoosts) / 30, 0.7)
		x = Math.max(x , 7)
	}
	if (x > 100) x = 50 * Math.log10(x)
	if (player.dilation.upgrades.includes("ngmm5")) x += getDil44Mult()
	return x
}

function getInfinityPowerEffectExp() {
	return tmp.infPrePowExp
}

function switchAutoInf(tier) {
	if (player.infDimBuyers[tier - 1]) {
		player.infDimBuyers[tier - 1] = false
		el("infauto"+tier).textContent = "Auto: OFF"
	} else {
		player.infDimBuyers[tier - 1] = true
		el("infauto"+tier).textContent = "Auto: ON"
	}
	hideMaxIDButton()
}

function toggleAllInfDims() {
	if (player.infDimBuyers[0]) {
		for (var i = 1; i <= 8; i++) {
			player.infDimBuyers[i - 1] = false
			el("infauto" + i).textContent = "Auto: OFF"
		}
	} else {
		for (var i=1; i <= 8; i++) {
			if (getEternitied() - 10 >= i) {
				player.infDimBuyers[i - 1] = true
				el("infauto" + i).textContent = "Auto: ON"
			}
		}
	}
	hideMaxIDButton()
}

function loadInfAutoBuyers() {
	for (var i = 1; i <= 8; i++) {
		if (player.infDimBuyers[i - 1]) el("infauto" + i).textContent = "Auto: ON"
		else el("infauto" + i).textContent = "Auto: OFF"
	}
	hideMaxIDButton(true)
}

var infDimPow = 1

function getIDReplMult() {
	if (player.masterystudies) if (player.masterystudies.includes('t311')) return tmp.rm.pow(17.3)
	return tmp.rm
}

function getEU2Mult() {
	var e = nMx(getEternitied(), 0)
	if (typeof(e) == "number" && isNaN(e)) e = 0
	if (player.boughtDims) return E_pow(e, Decimal.times(e,2).add(1).log(4))
	var cap = nMn(e, 1e5)
	var soft = 0
	if (e > 1e5) soft = nS(e, cap)
	var achReward = 1
	if (hasAch("ngpp15")) achReward = pow10(Math.pow(Decimal.log10(e), 4.75))
	return E_pow(cap/200 + 1, Math.log(cap * 2 + 1) / Math.log(4)).times(Decimal.div(soft, 200).add(1).times(Decimal.times(soft, 2).add(1).log(4)).max(1)).max(achReward)
}

function getEU3Mult() {
	if (player.boughtDims) return player.timeShards.div(1e12).plus(1)
	return pow2(300 / Math.max(infchallengeTimes, 6.1))
}

function updateInfPower() {
	el("infPowAmount").textContent = shortenMoney(player.infinityPower)
	if (player.galacticSacrifice) el("infPowEffectPower").textContent = tmp.infPowExp.toFixed(2)
	el("infDimMultAmount").textContent = shortenMoney(tmp.infPow)
	if (player.currentEternityChall == "eterc7") el("infPowPerSec").textContent = "You are getting " +shortenDimensions(DimensionProduction(1))+" Seventh Dimensions per second."
	else {
		let r = DimensionProduction(1)
		el("infPowPerSec").textContent = "You are getting " + shortenDimensions(r) + " Infinity Power per second."
	}
}

function getNewInfReq() {
	let reqs = [E("1e1100"), E("1e1900"), E("1e2400"), E("1e10500"), E("1e30000"), E("1e45000"), E("1e54000")]
	if (player.galacticSacrifice !== undefined) {
		if (player.tickspeedBoosts === undefined) {
			reqs[1] = E("1e1500")
			reqs[3] = E("1e9600")
		} else {
			reqs[0] = E("1e1800")
			reqs[1] = E("1e2400")
			reqs[2] = E("1e4000")
		}
		if (aarMod.ngmX >= 4){
			reqs[0] = E("1e1777")
		}
	}
	for (var tier = 0; tier < 7; tier++) if (!player.infDimensionsUnlocked[tier]) return {money: reqs[tier], tier: tier+1}
	return {money: E("1e60000"), tier: 8}
}


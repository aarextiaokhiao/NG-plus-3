//infinity dimensions


function DimensionDescription(tier) {
  if (tier > (inQC(4) ? 6 : 7) && (ECTimesCompleted("eterc7") === 0 || player.timeDimension1.amount.eq(0) || tier == 7) && player.currentEternityChall != "eterc7") return getFullExpansion(Math.round(player["infinityDimension"+tier].amount.toNumber()));
  else return shortenDimensions(player['infinityDimension'+tier].amount)+' (+' + formatValue(player.options.notation, DimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}


function DimensionRateOfChange(tier) {
  var toGain = DimensionProduction(tier+(inQC(4)&&tier<8?2:1))
  var current = Decimal.max(player["infinityDimension"+tier].amount, 1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(tier>7?1:10).dividedBy(current);
  return change;
}




function updateInfinityDimensions() {
  if (document.getElementById("infinitydimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 8; ++tier) {
        if (!player.infDimensionsUnlocked[tier-1]) {
            break;
        }
        document.getElementById("infD"+tier).textContent = DISPLAY_NAMES[tier] + " Infinity Dimension x" + shortenMoney(DimensionPower(tier));
        document.getElementById("infAmount"+tier).textContent = DimensionDescription(tier);
        document.getElementById("infRow"+tier).style.display = "table-row";
        document.getElementById("infRow"+tier).style.visibility = "visible";
    }
  }
}

function DimensionProduction(tier) {
  if (inQC(8)) return new Decimal(0)
  if (tier == 9) return getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).max(1).minus(1)
  var dim = player["infinityDimension"+tier]
  var ret = dim.amount
  if (inQC(4) && tier == 1) ret = ret.plus(player.infinityDimension2.amount.floor())
  if (player.tickspeedBoosts !== undefined && player.currentChallenge == "postc2") return new Decimal(0)
  if (player.currentEternityChall == "eterc11") return ret
  if (player.currentEternityChall == "eterc7") ret = dilates(ret.dividedBy(player.tickspeed.dividedBy(1000)))
  if (player.aarexModifications.ngm4V) ret = ret.div(100)
  ret = ret.times(DimensionPower(tier))
  if (player.challenges.includes("postc6")&&!inQC(3)) return ret.times(Decimal.div(1000, dilates(player.tickspeed)).pow(0.0005))
  return ret
}

function DimensionPower(tier) {
  var dim = player["infinityDimension"+tier]
  if (player.currentEternityChall == "eterc2" || player.currentEternityChall == "eterc10" || player.currentEternityChall == "eterc13") return new Decimal(0)
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  if (player.currentEternityChall=='eterc14') return getIDReplMult()
  if (inQC(3)) return getExtraDimensionBoostPower()
  var mult = dim.power

  mult = mult.times(infDimPow)

  if (player.achievements.includes("r94") && tier == 1) mult = mult.times(2);
  if (player.achievements.includes("r75") && !player.boughtDims) mult = mult.times(player.achPow);
  if (player.achievements.includes("r66") && player.galacticSacrifice !== undefined) mult = mult.times(Math.max(1, Math.abs(player.tickspeed.log10()) / 29))
  if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.galacticSacrifice === undefined) mult = mult.times(getIDReplMult())

  if (player.timestudy.studies.includes(72) && tier == 4) {
      mult = mult.times(calcTotalSacrificeBoost().pow(0.04).max(1).min("1e30000"))
  }

  if (player.timestudy.studies.includes(82)) {
      mult = mult.times(Decimal.pow(1.0000109,Math.pow(player.resets,2)).min(player.meta==undefined?1/0:'1e80000'))
  }

  if (player.eternityUpgrades.includes(1)) {
      mult = mult.times(player.eternityPoints.plus(1))
  }

  if (player.eternityUpgrades.includes(2)) mult = mult.times(getEU2Mult())

  if (player.eternityUpgrades.includes(3)) mult = mult.times(getEU3Mult())

  if (player.timestudy.studies.includes(92)) mult = mult.times(Decimal.pow(2, 600/Math.max(player.bestEternity, 20)))
  if (player.timestudy.studies.includes(162)) mult = mult.times(Decimal.pow(10,(player.galacticSacrifice?234:11)*(player.aarexModifications.newGameExpVersion?5:1)))
  if (ECTimesCompleted("eterc2") !== 0 && tier == 1) mult = mult.times(getECReward(2))

  if (ECTimesCompleted("eterc4") !== 0) mult = mult.times(getECReward(4))

  var ec9 = new Decimal(1)
  if (ECTimesCompleted("eterc9") !== 0) ec9 = getECReward(9)
  if (player.galacticSacrifice === undefined) mult = mult.times(ec9)

  if (inQC(6)) mult = mult.times(player.postC8Mult).dividedBy(player.matter.max(1))

  mult = dilates(mult, 2)
  if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.galacticSacrifice !== undefined) mult = mult.times(getIDReplMult())
  if (player.galacticSacrifice !== undefined) mult = mult.times(ec9)

  return dilates(mult, 1)
}




function resetInfDimensions() {

  if (player.infDimensionsUnlocked[0]) {
      player.infinityPower = new Decimal(0)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0 && ECTimesCompleted("eterc7") > 0){
      player.infinityDimension8.amount = new Decimal(player.infinityDimension8.baseAmount)
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0){
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[6] && player.infinityDimension6.amount != 0){
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[5] && player.infinityDimension6.amount != 0){
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[4] && player.infinityDimension5.amount != 0){
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[3] && player.infinityDimension4.amount != 0){
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[2] && player.infinityDimension3.amount != 0){
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[1] && player.infinityDimension2.amount != 0){
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }

}

var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [[null, 50, 30, 10, 5, 5, 5, 5, 5], [null, 500, 300, 100, 50, 25, 10, 5, 5]]
var infBaseCost = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280]
function getIDCost(tier) {
	let ret=player["infinityDimension"+tier].cost
	if (player.galacticSacrifice !== undefined && player.achievements.includes("r123")) ret=ret.div(galUpgrade11())
	return ret
}

function getIDCostMult(tier) {
	let ret=infCostMults[tier]
	if (player.infinityUpgrades.includes("postinfi53")) ret/=50
	if (ECTimesCompleted("eterc12")) ret=Math.pow(ret,getECReward(12))
	if (player.galacticSacrifice!==undefined&&player.galacticSacrifice.upgrades.includes(42)) ret/=1+5*Math.log10(player.eternityPoints.plus(1).log10()+1)
	return Math.max(ret,Math.pow(infCostMults[tier],.1))
}

function getInfBuy10Mult(tier) {
	let ret = infPowerMults[player.galacticSacrifice!==undefined&&player.tickspeedBoosts===undefined?1:0][tier]
	if (player.galacticSacrifice!==undefined&&player.galacticSacrifice.upgrades.includes(41)) ret *= player.galacticSacrifice.galaxyPoints.max(10).log10()
	return ret
}

function buyManyInfinityDimension(tier) {
  if (player.eterc8ids <= 0 && player.currentEternityChall == "eterc8") return false
  var dim = player["infinityDimension"+tier]
  var cost = getIDCost(tier)
  if (player.infinityPoints.lt(cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false
  if (player.eterc8ids == 0) return false
  if (player.infinityPoints.lt(Decimal.pow(10, 1e10))) player.infinityPoints = player.infinityPoints.minus(cost)
  dim.amount = dim.amount.plus(10);
  dim.cost = Decimal.round(dim.cost.times(getIDCostMult(tier)))
  dim.power = dim.power.times(getInfBuy10Mult(tier))
  dim.baseAmount += 10

  if (player.currentEternityChall == "eterc8") player.eterc8ids-=1
  document.getElementById("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
  if (inQC(6)) player.postC8Mult = new Decimal(1)
  return true
}

function buyMaxInfDims(tier) {
  var dim = player["infinityDimension"+tier]
  var cost = getIDCost(tier)
  if (player.infinityPoints.lt(cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false

  var costMult=getIDCostMult(tier)
  var toBuy = Math.floor(player.infinityPoints.div(cost).log10() / Math.log10(costMult))
  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy-1))
  if (player.infinityPoints.lt(Decimal.pow(10, 1e10))) player.infinityPoints = player.infinityPoints.minus(getIDCost(tier).min(player.infinityPoints))
  dim.cost = dim.cost.times(costMult)
  dim.amount = dim.amount.plus(10*toBuy);
  dim.power = dim.power.times(Decimal.pow(getInfBuy10Mult(tier), toBuy))
  dim.baseAmount += 10*toBuy
  buyManyInfinityDimension(tier)
}

function getInfinityPowerEffectPower() {
	if (player.galacticSacrifice!=undefined) {
		let ret=Math.pow(player.galaxies, 0.7)
		if (player.currentChallenge=="postcngm3_2"||(player.tickspeedBoosts!=undefined&&player.currentChallenge=="postc1")) ret=player.galaxies
		else if (player.challenges.includes("postcngm3_2")) ret=Math.pow(player.galaxies+(player.resets+player.tickspeedBoosts)/30,0.7)
		return Math.max(ret,7)
	}
	return 7
}

function switchAutoInf(tier) {
  if (player.infDimBuyers[tier-1]) {
      player.infDimBuyers[tier-1] = false
      document.getElementById("infauto"+tier).textContent = "Auto: OFF"
  } else {
      player.infDimBuyers[tier-1] = true
      document.getElementById("infauto"+tier).textContent = "Auto: ON"
  }
  hideMaxIDButton()
}

function toggleAllInfDims() {
  if (player.infDimBuyers[0]) {
      for (var i=1; i<9; i++) {
          player.infDimBuyers[i-1] = false
          document.getElementById("infauto"+i).textContent = "Auto: OFF"
      }
  } else {
      for (var i=1; i<9; i++) {
          if (getEternitied() - 10>=i) {
              player.infDimBuyers[i-1] = true
              document.getElementById("infauto"+i).textContent = "Auto: ON"
          }
      }
  }
  hideMaxIDButton()
}

function loadInfAutoBuyers() {
  for (var i=1; i<9; i++) {
      if (player.infDimBuyers[i-1]) document.getElementById("infauto"+i).textContent = "Auto: ON"
      else document.getElementById("infauto"+i).textContent = "Auto: OFF"
  }
  hideMaxIDButton(true)
}

var infDimPow = 1

function getIDReplMult() {
	if (player.masterystudies) if (player.masterystudies.includes('t311')) return tmp.rm.pow(17.3)
	return tmp.rm
}

function getEU2Mult() {
	var e = getEternitied()
	if (player.boughtDims) return Decimal.pow(e, Decimal.times(e,2).add(1).log(Math.E)/Math.log(4))
	var cap = nMn(e, 100000)
	var soft = nS(e, cap)
	return Decimal.pow(cap/200 + 1, Math.log(cap*2+1)/Math.log(4)).times(Decimal.div(soft,200).add(1).times(Decimal.times(soft,2).add(1).log(Math.E)/Math.log(4)).max(1)).max(player.achievements.includes("ngpp15")?Decimal.pow(10, Math.pow(Decimal.log10(e), 4.75)):1)
}

function getEU3Mult() {
	if (player.boughtDims) return player.timeShards.div(1e12).plus(1)
	return Decimal.pow(2,300/Math.max(infchallengeTimes, player.achievements.includes("r112") ? 6.1 : 7.5))
}

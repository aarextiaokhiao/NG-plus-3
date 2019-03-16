//time dimensions

function getTimeDimensionPower(tier) {
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  if (isEternityBroke()) {
    var mult = Decimal.div(1000,player.tickspeed).pow(0.000005)
    if (mult.gt("1e120000")) mult = Decimal.pow(10, Math.pow(mult.log10()/12e4,0.5)*12e4)
    if (player.timestudy.studies.includes(11) && tier == 1) mult = mult.dividedBy(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).max(Decimal.fromMantissaExponent(1, -2500)).pow(player.aarexModifications.newGameExpVersion?0.25:1))
    if (player.quantum.breakEternity.upgrades.includes(1) && tier < 5) mult = mult.times(getBreakUpgMult(1))
    if (player.quantum.breakEternity.upgrades.includes(4) && tier > 4) mult = mult.times(getBreakUpgMult(4))
    if (mult.lt(0)) mult = new Decimal(0)
    if (player.dilation.active || player.galacticSacrifice) {
      mult = Decimal.pow(10, Math.pow(mult.max(1).log10(), dilationPowerStrength()))
      if (player.dilation.upgrades.includes(9)) {
        mult = Decimal.pow(10, Math.pow(mult.log10(), 1.05))
      }
    }
    return mult
  }
  var dim = player["timeDimension"+tier]
  var ret = dim.power.pow(player.boughtDims?1:2)
  ret = ret.times(kongAllDimMult)

  if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.dividedBy(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).max(Decimal.fromMantissaExponent(1, -2500)).pow(player.aarexModifications.newGameExpVersion?0.25:1))
  if (player.achievements.includes("r105")) {
      var mult = Decimal.div(1000,player.tickspeed).pow(0.000005)
      if (mult.gt("1e120000")) mult = Decimal.pow(10, Math.pow(mult.log10()/12e4,0.5)*12e4)
      ret = ret.times(mult)
  }
  if (player.boughtDims) {
      if (player.achievements.includes('r117')) {
        ret = ret.times(1 + Math.pow(Math.log(player.eternities), 1.5) / Math.log(100));
      } else if (player.achievements.includes('r102')) {
        ret = ret.times(1 + Math.log(player.eternities) / Math.log(100));
      }
  }

  ret = ret.times(kongAllDimMult)

  if (player.eternityUpgrades.includes(4)) ret = ret.times(player.achPow)
  if (player.eternityUpgrades.includes(5)) ret = ret.times(Math.max(player.timestudy.theorem, 1))
  if (player.eternityUpgrades.includes(6)) ret = ret.times(player.totalTimePlayed / 10 / 60 / 60 / 24)
  if (player.timestudy.studies.includes(73) && tier == 3) ret = ret.times(calcTotalSacrificeBoost().pow(0.005).min(new Decimal("1e1300")))
  if (player.timestudy.studies.includes(93)) ret = ret.times(Decimal.pow(player.totalTickGained, 0.25).max(1))
  if (player.timestudy.studies.includes(103)) ret = ret.times(Math.max(player.replicanti.galaxies, 1))
  if (player.timestudy.studies.includes(151)) ret = ret.times(1e4)
  if (player.timestudy.studies.includes(221)) ret = ret.times(Decimal.pow(1.0025, player.resets))
  if (player.timestudy.studies.includes(227) && tier == 4) ret = ret.times(Math.pow(calcTotalSacrificeBoost().max(10).log10(), 10))
  if (player.currentEternityChall == "eterc9") ret = ret.times((Decimal.pow(Math.max(player.infinityPower.log2(), 1), 4)).max(1))
  if (ECTimesCompleted("eterc1") !== 0) ret = ret.times(Math.pow(Math.max(player.thisEternity*10, 0.9), 0.3+(ECTimesCompleted("eterc1")*0.05)))
  let ec10bonus = new Decimal(1)
  if (ECTimesCompleted("eterc10") !== 0) ec10bonus = new Decimal(Math.max(Math.pow(getInfinitied(), 0.9) * ECTimesCompleted("eterc10") * 0.000002+1, 1))
  if (player.timestudy.studies.includes(31)) ec10bonus = ec10bonus.pow(4)
  ret = ret.times(ec10bonus)
  if (player.achievements.includes("r128")) ret = ret.times(Math.max(player.timestudy.studies.length, 1))

  if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.dilation.upgrades.includes(5)) ret = ret.times(getReplMult().pow(0.1))

  if (inQC(6)) ret = ret.times(player.postC8Mult).dividedBy(player.matter.max(1))
  if (ret.lt(0)) {
    ret = new Decimal(0)
  }

  if (player.dilation.active || player.galacticSacrifice) {
    ret = Decimal.pow(10, Math.pow(ret.max(1).log10(), dilationPowerStrength()))
    if (player.dilation.upgrades.includes(9)) {
      ret = Decimal.pow(10, Math.pow(ret.log10(), 1.05))
    }
  }


  return ret

}


function getTimeDimensionProduction(tier) {
  if (player.currentEternityChall == "eterc1" || player.currentEternityChall == "eterc10" || (!isEternityBroke() && inQC(8))) return new Decimal(0)
  var dim = player["timeDimension"+tier]
  if (player.currentEternityChall == "eterc11") return dim.amount
  var ret = dim.amount
  if (inQC(4) && tier == 1) ret = ret.plus(player.timeDimension2.amount.floor())
  ret = ret.times(getTimeDimensionPower(tier))
  if (player.currentEternityChall == "eterc7") {
      ret = ret.dividedBy(player.tickspeed.dividedBy(1000))
  }
  if (player.currentEternityChall == "eterc1") return new Decimal(0)
  return ret
}


function getTimeDimensionRateOfChange(tier) {
  let toGain = getTimeDimensionProduction(tier+(inQC(4)?2:1))
  var current = Decimal.max(player["timeDimension"+tier].amount, 1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(10).dividedBy(current);
  return change;
}

function getTimeDimensionDescription(tier) {
  if (tier > (inQC(4) ? 6 : 7) || (tier > 3 && !player.dilation.studies.includes(tier - 2))) return getFullExpansion(player['timeDimension' + tier].bought)
  else return shortenDimensions(player['timeDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function updateTimeDimensions() {
  if (document.getElementById("timedimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 4; ++tier) {
      document.getElementById("timeD"+tier).textContent = DISPLAY_NAMES[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
      document.getElementById("timeAmount"+tier).textContent = getTimeDimensionDescription(tier);
    }
    if (player.dilation.studies.includes(2)) {
      for (let tier = 5; tier <= 8; ++tier) {
        if (player.dilation.studies.includes(tier-3)) {
          document.getElementById("timeD"+tier).textContent = DISPLAY_NAMES[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
          document.getElementById("timeAmount"+tier).textContent = getTimeDimensionDescription(tier);
        }
      }
    }
    for (let tier = 1; tier <= 8; ++tier) {
      if (player.dilation.studies.includes(tier-3) || tier < 5) {
        document.getElementById("timeRow"+tier).style.display = "table-row"
      } else {
        document.getElementById("timeRow"+tier).style.display = "none"
      }
    }
  }
}

var timeDimCostMults = [null, 3, 9, 27, 81, 243, 729, 2187, 6561]
var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"]

function timeDimCost(tier, bought) {
	cost = Decimal.pow(timeDimCostMults[tier], bought).times(timeDimStartCosts[tier])
	if (cost.gte(Number.MAX_VALUE)) cost = Decimal.pow(timeDimCostMults[tier]*1.5, bought).times(timeDimStartCosts[tier])
	if (cost.gte("1e1300")) cost = Decimal.pow(timeDimCostMults[tier]*2.2, bought).times(timeDimStartCosts[tier])
	if (tier > 4) cost = Decimal.pow(timeDimCostMults[tier]*100, bought).times(timeDimStartCosts[tier])
	if (cost.gte(tier > 4 ? "1e300000" : "1e20000")) {
		// rather than fixed cost scaling as before, quadratic cost scaling
		// to avoid exponential growth
		cost = cost.times(Decimal.pow(new Decimal('1e1000'),
		Math.pow(cost.log(10) / 1000 - (tier > 4 ? 300 : 20), 2)));
	}
	return cost
}

function buyTimeDimension(tier) {
  var dim = player["timeDimension"+tier]
  if (tier > 4 && !player.dilation.studies.includes(tier-3)) return false
  if (player.eternityPoints.lt(dim.cost)) return false

  player.eternityPoints = player.eternityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(1);
  dim.bought += 1
  dim.cost = timeDimCost(tier, dim.bought)
  dim.power = dim.power.times(player.boughtDims?3:2)
  if (inQC(6)) player.postC8Mult = new Decimal(1)
  updateEternityUpgrades()
  return true
}

function resetTimeDimensions() {
  for (var i=1; i<9; i++) {
      var dim = player["timeDimension"+i]
      dim.amount = new Decimal(dim.bought)
  }
}

function buyMaxTimeDimension(tier) {
	if (tier>4&&!player.dilation.studies.includes(tier-3)) return
	var dim=player['timeDimension'+tier]
	if (player.eternityPoints.lt(dim.cost)) return
	var increment=1
	while (player.eternityPoints.gte(timeDimCost(tier,dim.bought+increment*2-1))) {
		increment*=2
	}
	var toBuy=increment
	for (p=0;p<53;p++) {
		increment/=2
		if (increment<1) break
		if (player.eternityPoints.gte(timeDimCost(tier,dim.bought+toBuy+increment-1))) toBuy+=increment
	}
	var num=toBuy
	var newEP=player.eternityPoints
	while (num>0) {
		var temp=newEP
		var cost=timeDimCost(tier,dim.bought+num-1)
		if (newEP.lt(cost)) {
			newEP=player.eternityPoints.sub(cost)
			toBuy--
		} else newEP=newEP.sub(cost)
		if (newEP.eq(temp)||num>9007199254740992) break
		num--
	}
	player.eternityPoints=newEP
	dim.amount=dim.amount.plus(toBuy);
	dim.bought+=toBuy
	dim.cost=timeDimCost(tier, dim.bought)
	dim.power=dim.power.times(Decimal.pow(player.boughtDims?3:2, toBuy))
	if (inQC(6)) player.postC8Mult = new Decimal(1)
	updateEternityUpgrades()
}

function buyMaxTimeDimensions() {
  for (i=1; i<9; i++) buyMaxTimeDimension(i)
}
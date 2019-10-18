//time dimensions

function getTimeDimensionPower(tier) {
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  var dim = player["timeDimension"+tier]
  var ret = dim.power.pow(player.boughtDims?1:2)
  if (tmp.be) {
    ret = tmp.it
    if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.times(getTS11Mult())
    if (tmp.qu.breakEternity.upgrades.includes(1) && tier < 5) ret = ret.times(getBreakUpgMult(1))
    if (tmp.qu.breakEternity.upgrades.includes(4) && tier > 3 && tier < 7) ret = ret.times(getBreakUpgMult(4))
    if (tmp.qu.bigRip.upgrades.includes(13)) ret = ret.times(player.replicanti.amount.max(1).pow(1e-6))
    if (tier == 6 && player.ghostify.ghostlyPhotons.unl) ret = ret.times(tmp.le[6])
    if (tier == 7 && tmp.qu.bigRip.upgrades.includes(16)) ret = ret.times(player.dilation.dilatedTime.div(1e100).pow(0.155).max(1))
    if (ret.lt(0)) ret = new Decimal(0)
    return dilates(ret)
  }

  if (hasPU(32)) ret=ret.times(puMults[32]())
  if (player.aarexModifications.ngmX>3) {
      //Tickspeed multiplier boost
      var x=player.postC3Reward
      var exp=([5,3,2,1.5,1,.5,1/3,0])[tier-1]
      if (x.gt(1e10)) x=Decimal.pow(10,Math.sqrt(x.log10()*5+50))
      if (player.galacticSacrifice.upgrades.includes(25)) exp*=galMults.u25()
      if (player.pSac!=undefined) exp/=2
      if (inNC(16)) exp/=2
      ret=ret.times(x.pow(exp))

      //NG-4 upgrades
      if (player.galacticSacrifice.upgrades.includes(12)) ret = ret.times(galMults.u12())
      if (player.galacticSacrifice.upgrades.includes(13)&&player.currentChallenge!="postngm3_4") ret = ret.times(galMults.u13())
      if (player.galacticSacrifice.upgrades.includes(15)) ret = ret.times(galMults.u15())
      if (player.pSac !== undefined) if (tier==2) ret = ret.pow(puMults[13](hasPU(13, true, true))) //NG-5, not NG-4.
      if (player.galacticSacrifice.upgrades.includes(31)) ret = ret.pow(galMults.u31())
  }

  if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.times(getTS11Mult())
  if (player.achievements.includes("r105")) ret = ret.times(tmp.it)
  if (player.boughtDims) {
      if (player.achievements.includes('r117')) {
        ret = ret.times(1 + Math.pow(Math.log(player.eternities), 1.5) / Math.log(100));
      } else if (player.achievements.includes('r102')) {
        ret = ret.times(1 + Math.log(player.eternities) / Math.log(100));
      }
  }
  ret = ret.times(kongAllDimMult)
 
  var ret2 = new Decimal(1)
  if (player.currentEternityChall == "eterc9") ret2 = ret2.times(getInfinityPowerEffect())
  if (ECTimesCompleted("eterc1") !== 0) ret2 = ret2.times(getECReward(1))
  if (player.eternityUpgrades.includes(4)) ret2 = ret2.times(player.achPow)
  if (player.eternityUpgrades.includes(5)) ret2 = ret2.times(Math.max(player.timestudy.theorem, 1))
  if (player.eternityUpgrades.includes(6)) ret2 = ret2.times(player.totalTimePlayed / 10 / 60 / 60 / 24)
  if (player.galacticSacrifice === undefined) ret=ret.times(ret2)
  if (player.timestudy.studies.includes(73) && tier == 3) ret = ret.times(calcTotalSacrificeBoost().pow(0.005).min(new Decimal("1e1300")))
  if (player.timestudy.studies.includes(93)) ret = ret.times(Decimal.pow(player.totalTickGained, 0.25).max(1))
  if (player.timestudy.studies.includes(103)) ret = ret.times(Math.max(player.replicanti.galaxies, 1))
  if (player.timestudy.studies.includes(151)) ret = ret.times(1e4)
  if (player.timestudy.studies.includes(221)) ret = ret.times(Decimal.pow(1.0025, player.resets))
  if (player.timestudy.studies.includes(227) && tier == 4) ret = ret.times(Math.pow(calcTotalSacrificeBoost().max(10).log10(), 10))
  if (ECTimesCompleted("eterc10") !== 0) ret = ret.times(getECReward(10))
  if (player.achievements.includes("r128")) ret = ret.times(Math.max(player.timestudy.studies.length, 1))
  if (player.galacticSacrifice !== undefined && player.galacticSacrifice.upgrades.includes(43)) ret = ret.times(galMults.u43())
  if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.dilation.upgrades.includes(5)) ret = ret.times(tmp.rm.pow(0.1))
  if (inQC(6)) ret = ret.times(player.postC8Mult).dividedBy(player.matter.max(1))

  ret=dilates(ret, 2)
  if (player.galacticSacrifice !== undefined) ret=ret.times(ret2)

  return dilates(ret, 1)
}

function getTimeDimensionProduction(tier) {
  if (player.currentEternityChall == "eterc1" || player.currentEternityChall == "eterc10" || (!tmp.be && inQC(8))) return new Decimal(0)
  var dim = player["timeDimension"+tier]
  if (player.currentEternityChall == "eterc11") return dim.amount
  var ret = dim.amount
  if (inQC(4) && tier == 1) ret = ret.plus(player.timeDimension2.amount.floor())
  ret = ret.times(getTimeDimensionPower(tier))
  if (player.aarexModifications.ngmX>3&&(inNC(2)||player.currentChallenge=="postc1"||player.pSac!=undefined)) ret = ret.times(player.chall2Pow)
  if (player.currentEternityChall == "eterc7") ret = dilates(ret.dividedBy(player.tickspeed.dividedBy(1000)))
  if (player.aarexModifications.ngmX>3&&(tier>1||!player.achievements.includes("r12"))) ret = ret.div(100)
  if (player.currentEternityChall == "eterc1") return new Decimal(0)
  return ret
}

function isTDUnlocked(t) {
	if (t>8) return
	if (player.aarexModifications.ngmX>3) {
		if ((inNC(4)||player.currentChallenge=="postc1"||player.pSac!=undefined)&&t>6) return
		return player.tdBoosts>t-2
	}
	return t<5||player.dilation.studies.includes(t-3)
}

function getTimeDimensionRateOfChange(tier) {
  let toGain = getTimeDimensionProduction(tier+(inQC(4)||player.pSac!==undefined?2:1))
  if (player.pSac !== undefined) toGain = toGain.div(getEC12Mult())
  var current = Decimal.max(player["timeDimension"+tier].amount, 1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(10).dividedBy(current);
  return change;
}

function getTimeDimensionDescription(tier) {
  if (!isTDUnlocked(((inNC(7) && player.aarexModifications.ngmX > 3) || inQC(4) || player.pSac!=undefined ? 2 : 1) + tier)) return getFullExpansion(player['timeDimension' + tier].bought)
  else return shortenDimensions(player['timeDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function updateTimeDimensions() {
	if (document.getElementById("timedimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
		for (let tier = 1; tier <= 8; ++tier) {
			if (isTDUnlocked(tier)) {
				document.getElementById("timeRow"+tier).style.display = "table-row"
				document.getElementById("timeD"+tier).textContent = DISPLAY_NAMES[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
				document.getElementById("timeAmount"+tier).textContent = getTimeDimensionDescription(tier);
				document.getElementById("timeMax"+tier).textContent = "Cost: " + shortenDimensions(player["timeDimension"+tier].cost) + (player.aarexModifications.ngmX>3?"":" EP")
				if (getOrSubResourceTD(tier).gte(player["timeDimension"+tier].cost)) document.getElementById("timeMax"+tier).className = "storebtn"
			else document.getElementById("timeMax"+tier).className = "unavailablebtn"
			} else document.getElementById("timeRow"+tier).style.display = "none"
		}
		if (player.aarexModifications.ngmX>3) {
			var isShift=player.tdBoosts<(inNC(4)?5:7)
			var req=getTDBoostReq()
			document.getElementById("tdReset").style.display=""
			document.getElementById("tdResetLabel").textContent="Time Dimension "+(isShift ? "Shift" : "Boost")+" ("+getFullExpansion(player.tdBoosts)+"): requires "+getFullExpansion(req.amount)+" "+DISPLAY_NAMES[req.tier]+" Time Dimensions"
			document.getElementById("tdResetBtn").textContent="Reset the game for a " + (isShift ? "new dimension" : "boost")
			document.getElementById("tdResetBtn").className=(player["timeDimension"+req.tier].bought<req.amount)?"unavailablebtn":"storebtn"
		} else document.getElementById("tdReset").style.display="none"
	}
}

var timeDimCostMults = [[null, 3, 9, 27, 81, 243, 729, 2187, 6561], [null, 1.5, 2, 3, 20, 150, 1e5, 3e6, 1e8]]
var timeDimStartCosts = [[null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"], [null, 10, 20, 40, 80, 160, 1e8, 1e12, 1e18]]

function timeDimCost(tier, bought) {
	cost = Decimal.pow(timeDimCostMults[0][tier], bought).times(timeDimStartCosts[0][tier])
	if (player.galacticSacrifice !== undefined) return cost
	if (cost.gte(Number.MAX_VALUE)) cost = Decimal.pow(timeDimCostMults[0][tier]*1.5, bought).times(timeDimStartCosts[0][tier])
	if (cost.gte("1e1300")) cost = Decimal.pow(timeDimCostMults[0][tier]*2.2, bought).times(timeDimStartCosts[0][tier])
	if (tier > 4) cost = Decimal.pow(timeDimCostMults[0][tier]*100, bought).times(timeDimStartCosts[0][tier])
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
	if (player.aarexModifications.ngmX>3&&getAmount(1)<1) {
		alert("You need to buy 1 of first Normal Dimension to be able to buy Time Dimensions.")
		return
	}
	if (!isTDUnlocked(tier)) return false
	if (getOrSubResourceTD(tier).lt(dim.cost)) return false

	getOrSubResourceTD(tier, dim.cost)
	dim.amount = dim.amount.plus(1);
	dim.bought += 1
	if (inQC(6)) player.postC8Mult = new Decimal(1)
	if (player.aarexModifications.ngmX>3) {
		dim.cost = dim.cost.times(timeDimCostMults[1][tier])
		if (inNC(2)||player.currentChallenge=="postc1"||player.pSac!=undefined) player.chall2Pow=0
		reduceMatter(1)
	} else {
		dim.power = dim.power.times(player.boughtDims?3:2)
		dim.cost = timeDimCost(tier, dim.bought)
		updateEternityUpgrades()
	}
	return true
}

function resetTimeDimensions() {
  for (var i=1; i<9; i++) {
      var dim = player["timeDimension"+i]
      dim.amount = new Decimal(dim.bought)
  }
}

function getOrSubResourceTD(tier, sub) {
	if (sub == undefined) {
		if (player.aarexModifications.ngmX>3) return player.money.min(Number.MAX_VALUE)
		return player.eternityPoints
	} else {
		if (player.aarexModifications.ngmX>3) player.money=player.money.sub(player.money.min(sub))
		else player.eternityPoints=player.eternityPoints.sub(player.eternityPoints.min(sub))
	}
}

function buyMaxTimeDimension(tier, bulk) {
	var dim=player['timeDimension'+tier]
	var res=getOrSubResourceTD(tier)
	if (player.aarexModifications.ngmX>3&&getAmount(1)<1) return
	if (player.aarexModifications.maxHighestTD&&tier<8&&player["timeDimension"+(tier+1)].bought>0) return
	if (!isTDUnlocked(tier)) return
	if (res.lt(dim.cost)) return
	if (player.aarexModifications.ngmX>3) {
		var toBuy=Math.floor(res.div(dim.cost).times(timeDimCostMults[1][tier]-1).add(1).log(timeDimCostMults[1][tier]))
		if (bulk) toBuy=Math.min(toBuy,bulk)
		getOrSubResourceTD(tier,Decimal.pow(timeDimCostMults[1][tier],toBuy).sub(1).div(timeDimCostMults[1][tier]-1).times(dim.cost))
		if (inNC(2)||player.currentChallenge=="postc1"||player.pSac!=undefined) player.chall2Pow=0
		reduceMatter(toBuy)
	} else {
		var toBuy=0
		var increment=1
		while (player.eternityPoints.gte(timeDimCost(tier,dim.bought+increment-1))) increment*=2
		while (increment>=1) {
			if (player.eternityPoints.gte(timeDimCost(tier,dim.bought+toBuy+increment-1))) toBuy+=increment
			increment/=2
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
		if (isNaN(newEP.e)) player.eternityPoints=new Decimal(0)
	}
	dim.amount=dim.amount.plus(toBuy);
	dim.bought+=toBuy
	if (player.aarexModifications.ngmX>3) {
		dim.power = Decimal.sqrt(getDimensionPowerMultiplier()).times(dim.power)
		dim.cost = dim.cost.times(Decimal.pow(timeDimCostMults[1][tier],toBuy))
	} else {
		dim.cost=timeDimCost(tier, dim.bought)
		dim.power=dim.power.times(Decimal.pow(player.boughtDims?3:2, toBuy))
		if (inQC(6)) player.postC8Mult = new Decimal(1)
		updateEternityUpgrades()
	}
}

function buyMaxTimeDimensions() {
	for (i=1; i<9; i++) buyMaxTimeDimension(i)
}
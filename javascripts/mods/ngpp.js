function getDilationMetaDimensionMultiplier () {
	let pow = 0.1
	if (player.masterystudies != undefined) if (player.masterystudies.includes("d12")) pow = getNanofieldRewardEffect(4)
	return player.dilation.dilatedTime.div(1e40).pow(pow).plus(1);
}

function getMetaDimensionMultiplier (tier) {
  if (player.currentEternityChall === "eterc11") {
    return new Decimal(1);
  }
  let power = player.dilation.upgrades.includes("ngpp4") ? getDil15Bonus() : 2
  let multiplierpower = Math.floor(player.meta[tier].bought / 10)
  let boostpower = power
  if (player.masterystudies != undefined) if (player.masterystudies.includes("d12")) boostpower = getNanofieldRewardEffect(6)
  if (player.achievements.includes("ngpp14")) boostpower *= 1.01
  if (inQC(8)) boostpower = 1
  let multiplier = Decimal.pow(power, Math.floor(player.meta[tier].bought / 10)).times(Decimal.pow(boostpower, Math.max(0, player.meta.resets - tier + 1)*(!player.masterystudies?1:player.masterystudies.includes('t312')?1.045:1))).times(getDilationMetaDimensionMultiplier());
  if (player.dilation.upgrades.includes("ngpp3")) {
    multiplier = multiplier.times(getDil14Bonus());
  }
  if (player.achievements.includes("ngpp12")) multiplier = multiplier.times(1.1)
  if (player.masterystudies) {
      if (player.masterystudies.includes("t262")) multiplier = multiplier.times(getMTSMult(262))
      if (player.masterystudies.includes("t282")) multiplier = multiplier.times(getMTSMult(282))
      if (player.masterystudies.includes("t303")) multiplier = multiplier.times(getMTSMult(303))
      multiplier = multiplier.times(getQCReward(3))
      if (player.masterystudies.includes("t351")) multiplier = multiplier.times(getMTSMult(351))
      if (player.masterystudies.includes("t373")) multiplier = multiplier.times(getMTSMult(373))
      if (player.masterystudies.includes("t382")) multiplier = multiplier.times(getMTSMult(382))
      if (player.masterystudies.includes("t383")) multiplier = multiplier.times(getMTSMult(383))
      if (player.masterystudies.includes("t393")) multiplier = multiplier.times(getMTSMult(393))
  }
  if (GUBought("rg3")&&tier<2) multiplier = multiplier.times(player.resets)
  if (GUBought("br4")) multiplier = multiplier.times(Decimal.pow(getDimensionPowerMultiplier(), 0.0003))
  if (tier%2>0) multiplier = multiplier.times(QC4Reward)
  multiplier = multiplier.times(getQCReward(6))
  
  if (multiplier.lt(1)) multiplier = new Decimal(1)
  if (player.dilation.active || player.galacticSacrifice) {
    multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 0.75))
    if (player.dilation.upgrades.includes(11)) {
      multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 1.05))
    }
  }
  return multiplier;
}

function getMetaDimensionDescription(tier) {
  if (tier > Math.min(7, player.meta.resets + 3) - (inQC(4) ? 1 : 0)) return getFullExpansion(player.meta[tier].bought) + ' (' + dimMetaBought(tier) + ')';
  else return shortenDimensions(player.meta[tier].amount) + ' (' + dimMetaBought(tier) + ')  (+' + formatValue(player.options.notation, getMetaDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getMetaDimensionRateOfChange(tier) {
  let toGain = getMetaDimensionProduction(tier + (inQC(4)?2:1));

  var current = player.meta[tier].amount.max(1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(10).dividedBy(current);

  return change;
}

function canBuyMetaDimension(tier) {
    if (tier > player.meta.resets + 4) return false;
    if (speedrunMilestonesReached < 17 && tier > 1 && player.meta[tier - 1].amount.eq(0)) return false;
    return true;
}

function clearMetaDimensions () {
    for (i = 1; i <= 8; i++) {
        player.meta[i].amount = new Decimal(0);
        player.meta[i].bought = 0;
        player.meta[i].cost = new Decimal(initCost[i]);
    }
}

function getMetaShiftRequirement() {
	var data = {tier: Math.min(8, player.meta.resets + 4), amount: 20}
	var inQC4 = inQC(4)
	data.mult = inQC4 ? 5.5 : 15
	if (player.masterystudies != undefined) if (player.masterystudies.includes("t312")) data.mult -= 1
	data.amount += data.mult * Math.max(player.meta.resets - 4, 0)
	if (player.masterystudies != undefined) if (player.masterystudies.includes("d13")) data.amount -= getTreeUpgradeEffect(1)
	if (ghostified) if (player.ghostify.neutrinos.upgrades.includes(1)) data.amount -= getNU1Pow()

	data.scalingStart = inQC4 ? 55 : 15
	if (player.meta.resets >= data.scalingStart) {
		var multAdded = inQC4 ? 14.5 : 5
		data.amount += multAdded * (player.meta.resets - data.scalingStart)
		data.mult += multAdded
	}
	return data
}

function metaBoost() {
	let req = getMetaShiftRequirement()
	let isNU1ReductionActive = ghostified ? player.ghostify.neutrinos.upgrades.includes(1) && !player.quantum.bigRip.active : false
	if (player.meta[req.tier].bought<Math.floor(req.amount)) return
	if (speedrunMilestonesReached>26 && req.tier>7) {
		if (isNU1ReductionActive) {
			if (player.meta.resets<=req.scalingStart) {
				player.meta.resets=Math.min(player.meta.resets+Math.floor((player.meta[8].bought-req.amount)/(req.mult+1))+1,req.scalingStart)
				if (player.meta.resets==req.scalingStart) req = getMetaShiftRequirement()
			}
			if (player.meta.resets>=req.scalingStart&&player.meta.resets<100) player.meta.resets=Math.min(player.meta.resets+Math.floor((player.meta[8].bought-req.amount)/(req.mult+1))+1,100)
			if (player.meta.resets>99) player.meta.resets+=Math.floor((player.meta[8].bought-req.amount)/req.mult)+1
		} else {
			if (player.meta.resets<=req.scalingStart) {
				player.meta.resets=Math.min(player.meta.resets+Math.floor((player.meta[8].bought-req.amount)/req.mult)+1,req.scalingStart)
				if (player.meta.resets==req.scalingStart) req = getMetaShiftRequirement()
			}
			if (player.meta.resets>=req.scalingStart) player.meta.resets+=Math.floor((player.meta[8].bought-req.amount)/req.mult)+1
		}
		if (inQC(4) && player.meta.resets > 54) if (player.meta[8].bought>=Math.floor(getMetaShiftRequirement().amount)) player.meta.resets++
	} else player.meta.resets++
	if (player.meta.resets>9) giveAchievement("Meta-boosting to the max")
	player.meta.antimatter = new Decimal(speedrunMilestonesReached>18?1e25:player.achievements.includes("ngpp12")?100:10);
	clearMetaDimensions();
	for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) document.getElementById(i + "MetaRow").style.display = "none"
	if (player.masterystudies === undefined ? true : !player.quantum.bigRip.active) document.getElementById("quantumbtn").style.display="none"
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
    if (tier>7) giveAchievement("And still no ninth dimension...")
    return true;
}

function getMetaCost(tier, boughtTen) {
	let cost=initCost[tier].times(costMults[tier].pow(boughtTen))
	let scalingStart=Math.ceil(Decimal.div("1e1100", initCost[tier]).log(costMults[tier]))
	if (boughtTen>=scalingStart) cost=cost.times(Decimal.pow(10,(boughtTen-scalingStart+1)*(boughtTen-scalingStart+2)/2))
	return cost
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
    player.meta[tier].cost = getMetaCost(tier, player.meta[tier].bought/10)
    if (tier>7) giveAchievement("And still no ninth dimension...")
    return true;
}

function buyMaxMetaDimension(tier) {
	if (!canBuyMetaDimension(tier)) return
	if (getMetaMaxCost(tier).gt(player.meta.antimatter)) return
	var currentBought=Math.floor(player.meta[tier].bought/10)
	var bought=player.meta.antimatter.div(10).div(initCost[tier]).log(costMults[tier])+1
	var scalingStart=Math.ceil(Decimal.div("1e1100", initCost[tier]).log(costMults[tier]))
	if (bought>=scalingStart) {
		b=costMults[tier].log10()+0.5
		bought=Math.sqrt(b*b+2*(bought-scalingStart)*costMults[tier].log10())-b+scalingStart
	}
	bought=Math.floor(bought)-currentBought
	var num=bought
	var tempMA=player.meta.antimatter
	if (num>1) {
		while (num>0) {
			var temp=tempMA
			var cost=getMetaCost(tier,currentBought+num-1).times(num>1?10:10-dimMetaBought(tier))
			if (cost.gt(tempMA)) {
				tempMA=player.meta.antimatter.sub(cost)
				bought--
			} else tempMA=tempMA.sub(cost)
			if (temp.eq(tempMA)||currentBought+num>9007199254740991) break
			num--
		}
	} else {
		tempMA=tempMA.sub(getMetaCost(tier,currentBought).times(10-dimMetaBought(tier)))
		bought=1
	}
	player.meta.antimatter=tempMA
	player.meta[tier].amount=player.meta[tier].amount.add(bought*10-dimMetaBought(tier))
	player.meta[tier].bought+=bought*10-dimMetaBought(tier)
	player.meta[tier].cost=getMetaCost(tier,currentBought+bought)
	if (tier>7) giveAchievement("And still no ninth dimension...")
}

function canAffordMetaDimension(cost) {
    return cost.lte(player.meta.antimatter);
}

for (let i = 1; i <= 8; i++) {
	document.getElementById("meta" + i).onclick = function () {
		if (speedrunMilestonesReached > i+5) player.autoEterOptions["md"+i] = !player.autoEterOptions["md"+i]
		else metaBuyOneDimension(i);
		if (speedrunMilestonesReached > 27) {
			var removeMaxAll=false
			for (d=1;d<9;d++) {
				if (player.autoEterOptions["md"+d]) {
					if (d>7) removeMaxAll=true
				} else break
			}
			document.getElementById("metaMaxAllDiv").style.display=removeMaxAll?"none":""
		}
	}
	document.getElementById("metaMax" + i).onclick = function () {
		if (shiftDown && speedrunMilestonesReached > i+5) metaBuyOneDimension(i)
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
		if (tier==1) ret = ret.plus(player.meta[2].amount.floor().pow(1.3))
		else if (tier==4) ret = ret.pow(1.5)
	}
	return ret.times(getMetaDimensionMultiplier(tier));
}

function getExtraDimensionBoostPower() {
	if (player.currentEternityChall=="eterc14"||inQC(7)) return new Decimal(1)
	if (inQC(3)) return player.meta.bestAntimatter.pow(Math.pow(player.meta.bestAntimatter.max(1e8).log10()/8,2))
	else return player.meta.bestAntimatter.pow(getExtraDimensionBoostPowerExponent()).plus(1)
}

function getExtraDimensionBoostPowerExponent() {
	let power = 8
	if (player.dilation.upgrades.includes("ngpp5")) power++
	power += ECTimesCompleted("eterc13")*0.2
	if (player.masterystudies != undefined) {
		if (player.masterystudies.includes("d12")) power += getNanofieldRewardEffect(2)
		if (player.masterystudies.includes("d13")) power += getTreeUpgradeEffect(8)
	}
	return power
}

function getDil14Bonus () {
	return 1 + Math.log10(1 - Math.min(0, player.tickspeed.log(10)));
}

function getDil17Bonus () {
	return Math.sqrt(player.meta.bestAntimatter.max(1).log10())/(player.masterystudies?1:2);
}

function updateMetaDimensions () {
	document.getElementById("metaAntimatterAmount").textContent = shortenMoney(player.meta.antimatter);
	document.getElementById("metaAntimatterBest").textContent = shortenMoney(player.meta.bestAntimatter);
	document.getElementById("bestAntimatterQuantum").textContent = player.masterystudies && quantumed ? "Your best" + (ghostified ? "" : "-ever") + " meta-antimatter" + (ghostified ? " in this Ghostify" : "") + " was " + shortenMoney(player.meta.bestOverQuantums) + "." : ""
	document.getElementById("bestAntimatterTranslation").innerHTML = (player.masterystudies ? player.quantum.nanofield.rewards > 1 && player.currentEternityChall != "eterc14" && !inQC(3) && !inQC(4) : false) ? 'Raised to the power of <span id="metaAntimatterPower" style="font-size:35px; color: black">'+Math.round(getExtraDimensionBoostPowerExponent()*10)/10+'</span>, t' : "T"
	document.getElementById("bestMAOverGhostifies").textContent = ghostified ? "Your best-ever meta-antimatter was " + shortenMoney(player.meta.bestOverGhostifies) + "." : ""
	document.getElementById("metaAntimatterEffect").textContent = shortenMoney(getExtraDimensionBoostPower())
	document.getElementById("metaAntimatterPerSec").textContent = 'You are getting ' + shortenDimensions(getMetaDimensionProduction(1)) + ' meta-antimatter per second.';
	for (let tier = 1; tier <= 8; ++tier) {
		if (!canBuyMetaDimension(tier) && document.getElementById(tier + "MetaRow").style.display !== "table-row") {
			break;
		}
		document.getElementById(tier + "MetaD").childNodes[0].nodeValue = DISPLAY_NAMES[tier] + " Meta Dimension x" + formatValue(player.options.notation, getMetaDimensionMultiplier(tier), 2, 1);
		document.getElementById("meta" + tier + "Amount").textContent = getMetaDimensionDescription(tier);
	}
	for (let tier = 1; tier <= 8; ++tier) {
		if (!canBuyMetaDimension(tier)) {
			break;
		}
		document.getElementById(tier + "MetaRow").style.display = "table-row";
		document.getElementById(tier + "MetaRow").style.visibility = "visible";
	}
	var useTwo = player.options.notation=="Logarithm" ? 2 : 0
	for (let tier = 1; tier <= 8; ++tier) {
		document.getElementById("meta"+tier).textContent = speedrunMilestonesReached > tier+5 ? "Auto: O"+(player.autoEterOptions["md"+tier] ? "N" : "FF") : "Cost: " + formatValue(player.options.notation, player.meta[tier].cost, useTwo, 0) + " MA"
		document.getElementById('meta' + tier).className = speedrunMilestonesReached > tier+5 ? "storebtn" : canAffordMetaDimension(player.meta[tier].cost) ? 'storebtn' : 'unavailablebtn';
		document.getElementById("metaMax"+tier).textContent = (speedrunMilestonesReached > tier+5 ? (shiftDown ? "Singles" : "Cost") : "Until 10") + ": " + formatValue(player.options.notation, ((shiftDown && speedrunMilestonesReached > tier+5) ? player.meta[tier].cost : getMetaMaxCost(tier)), useTwo, 0) + " MA"
		document.getElementById('metaMax' + tier).className = canAffordMetaDimension((shiftDown && speedrunMilestonesReached > tier+5) ? player.meta[tier].cost : getMetaMaxCost(tier)) ? 'storebtn' : 'unavailablebtn';
	}
	var isMetaShift = player.meta.resets < 4
	var metaShiftRequirement = getMetaShiftRequirement()
        document.getElementById("metaResetLabel").textContent = 'Meta-Dimension ' + (isMetaShift ? "Shift" : "Boost") + ' ('+ getFullExpansion(player.meta.resets) +'): requires ' + getFullExpansion(Math.floor(metaShiftRequirement.amount)) + " " + DISPLAY_NAMES[metaShiftRequirement.tier] + " Meta Dimensions"
        document.getElementById("metaSoftReset").textContent = "Reset meta-dimensions for a " + (isMetaShift ? "new dimension" : "boost")
	if (player.meta[metaShiftRequirement.tier].bought >= metaShiftRequirement.amount) {
		document.getElementById("metaSoftReset").className = 'storebtn';
	} else {
		document.getElementById("metaSoftReset").className = 'unavailablebtn';
	}
	var bigRipped = player.masterystudies !== undefined ? player.quantum.bigRip.active : false
    var QS = quarkGain()
    var req = Decimal.pow(Number.MAX_VALUE,player.masterystudies?1.45:1)
    var reqGotten = isQuantumReached()
	var newClassName = reqGotten?(bigRipped?"aarexmodsghostifybtn":"storebtn"):'unavailablebtn'
    document.getElementById("quantumResetLabel").textContent = (bigRipped?'Ghostify':'Quantum')+': requires '+shorten(req)+' meta-antimatter '+(!inQC(0)? "and "+shortenCosts(Decimal.pow(10,getQCGoal()))+" antimatter":player.masterystudies?"and an EC14 completion":"")
    document.getElementById("quantum").textContent = 'Lose all your previous progress, but '+(player.quantum.times>0&&reqGotten&&!bigRipped?'gain '+shortenDimensions(QS)+' quark'+(QS.lt(2)?'':'s')+' for boosts':'get a boost')
    if (document.getElementById("quantum").className !== newClassName) document.getElementById("quantum").className = newClassName
}

// v2.2
function updateAutoEterMode() {
	document.getElementById("priority13").disabled=false
	if (player.autoEterMode == "time") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: time"
		document.getElementById("eterlimittext").textContent = "Seconds between eternities:"
	} else if (player.autoEterMode == "relative") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: X times last eternity"
		document.getElementById("eterlimittext").textContent = "X times last eternity:"
	} else if (player.autoEterMode == "relativebest") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: X times best of last 10"
        document.getElementById("eterlimittext").textContent = "X times best of last 10 eternities:"
	} else if (player.autoEterMode == "replicanti") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: replicanti"
		document.getElementById("eterlimittext").textContent = "Amount of replicanti to wait until reset:"
	} else if (player.autoEterMode == "peak") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: peak"
		document.getElementById("eterlimittext").textContent = "Seconds to wait after latest peak gain:"
	} else if (player.autoEterMode == "manual") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: dilate only"
		document.getElementById("eterlimittext").textContent = "Does nothing to eternity"
		document.getElementById("priority13").disabled=true
	} else {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: amount"
		document.getElementById("eterlimittext").textContent = "Amount of EP to wait until reset:"
	}
}

function toggleAutoEterMode() {
	if (player.autoEterMode == "amount") player.autoEterMode = "time"
	else if (player.autoEterMode == "time") player.autoEterMode = "relative"
	else if (player.autoEterMode == "relative") player.autoEterMode = "relativebest"
	else if (player.autoEterMode == "relativebest" && player.dilation.upgrades.includes("ngpp3") && player.eternities >= 4e11 && player.aarexModifications.newGame3PlusVersion) player.autoEterMode = "replicanti"
	else if (player.autoEterMode == "replicanti" && player.eternities >= 1e13) player.autoEterMode = "peak"
	else if (player.autoEterMode == "peak" && speedrunMilestonesReached > 24) player.autoEterMode = "manual"
	else if (player.autoEterMode) player.autoEterMode = "amount"
	updateAutoEterMode()
}

// v2.21
function getDil15Bonus () {
	return Math.log10(player.dilation.dilatedTime.max(1e10).min(1e100).log(10)) + 1;
}

// v2.3
function toggleAllTimeDims() {
	var turnOn
	var id=1
	while (id<9&&turnOn===undefined) {
		if (!player.autoEterOptions["td"+id]) turnOn=true
		else if (id>7) turnOn=false
		id++
	}
	for (id=1;id<9;id++) {
		player.autoEterOptions["td"+id]=turnOn
		document.getElementById("td"+id+'auto').textContent="Auto: O"+(turnOn?"N":"FF")
	}
	document.getElementById("maxTimeDimensions").style.display=turnOn?"none":""
}

function toggleAutoEter(id) {
	player.autoEterOptions[id]=!player.autoEterOptions[id]
	document.getElementById(id+'auto').textContent=(id=="rebuyupg"?"Rebuyable upgrade a":id=="metaboost"?"Meta-boost a":"A")+"uto: O"+(player.autoEterOptions[id]?"N":"FF")
	if (id.slice(0,2)=="td") {
		var removeMaxAll=false
		for (d=1;d<9;d++) {
			if (player.autoEterOptions["td"+d]) {
				if (d>7) removeMaxAll=true
			} else break
		}
		document.getElementById("maxTimeDimensions").style.display=removeMaxAll?"none":""
	}
}

function doAutoEterTick() {
	if (!player.meta) return
	if (player.achievements.includes("ngpp17")) {
		for (d=1;d<9;d++) if (player.autoEterOptions["td"+d]) buyMaxTimeDimension(d)
		if (player.autoEterOptions.epmult) buyMaxEPMult()
	}
	if (player.autoEterOptions.tt && !player.dilation.upgrades.includes(10) && speedrunMilestonesReached > 1) maxTheorems()
}

// v2.301
function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk=!player.galaxyMaxBulk
	document.getElementById('replicantibulkmodetoggle').textContent="Mode: "+(player.galaxyMaxBulk?"Max":"Singles")
}

// v2.9
quantumed = false
function quantum(auto, force, challid, bigRip) {
    if (player.masterystudies !== undefined) if (!auto && !force && player.quantum.bigRip.active) force = true
	if (!(isQuantumReached()||force)||implosionCheck) return
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !player.masterystudies
	if (player.aarexModifications.quantumConf&&!(auto||force)) if (!confirm(player.masterystudies?"Quantum will reset everything eternity resets, and "+(headstart?"also some other things like dilation":"also time studies, eternity challenges, dilation, "+(player.masterystudies?"meta dimensions, and mastery studies":"and meta dimensions"))+". You will gain a quark and unlock various upgrades.":"But wait! Quantum will erases almost everything that you have and rewards nothing! However, this is not a win. You need to reach real Infinite antimatter to win! (it's impossible)")) return
	if (!quantumed) if (!confirm("Are you sure you want to do that? You will lose everything you have!")) return
	var pc=challid-8
	if (player.masterystudies) {
		if (challid>0) {
			var abletostart=false
			if (pc>0) {
				if (player.quantum.pairedChallenges.order[pc]) if (player.quantum.pairedChallenges.order[pc].length>1) abletostart=true
			} else if (!pcFocus) abletostart=true
			if (abletostart) {
				if (pc>0) if (player.quantum.pairedChallenges.completed+1<pc) return
				if (player.quantum.electrons.amount<getQCCost(challid)||!inQC(0)) return
				if (bigRip) {
					var qc1 = player.quantum.pairedChallenges.order[pc][0]
					var qc2 = player.quantum.pairedChallenges.order[pc][1]
					var qc1st = Math.min(qc1, qc2)
					var qc2st = Math.max(qc1, qc2)
					if (qc1st != 6 || qc2st != 8) return
					if (!confirm("Big ripping the universe starts PC6+8 with only quantum stuff. However, only dilation upgrades boost dilation except upgrades that multiply TP gain until you buy the eleventh upgrade. NOTE: If you can beat PC6+8, you will earn a grand reward.")) return
				}
				if (pc > 0) {
					if (player.options.challConf || (player.quantum.pairedChallenges.completions.length < 1 && !ghostified)) if (!confirm("You will start a Quantum Challenge, but you need to do 2 challenges at one. Completing it boosts the rewards of Quantum Challenges that you chose in this Paired Challenge.")) return
				} else if (player.options.challConf || (QCIntensity(1) == 0 && !ghostified)) if (!confirm("You will do a quantum reset but you will not gain quarks, and keep your electrons & sacrificed galaxies, and you can't buy electron upgrades. You have to reach the set goal of antimatter to complete this challenge. NOTE: Electrons and banked eternities do nothing in quantum challenges and your electrons and sacrificed galaxies do not reset until you end the challenge.")) return
				player.quantum.electrons.amount=player.quantum.electrons.amount.sub(getQCCost(challid))
			} else if (pcFocus&&pc<1) {
				if (!assigned.includes(challid)) {
					if (!player.quantum.pairedChallenges.order[pcFocus]) player.quantum.pairedChallenges.order[pcFocus]=[challid]
					else {
						player.quantum.pairedChallenges.order[pcFocus].push(challid)
						pcFocus=0
					}
					updateQuantumChallenges()
				}
				return
			} else if (pcFocus!=pc) {
				pcFocus=pc
				updateQuantumChallenges()
				return
			} else {
				pcFocus=0
				updateQuantumChallenges()
				return
			}
		}
	}
	var implode = !(auto||force)&&speedrunMilestonesReached<23
	if (implode) {
		implosionCheck=1
		dev.implode()
		setTimeout(function(){
			quantumReset(force, auto, challid, bigRip, true)
		},1000)
		setTimeout(function(){
			implosionCheck=0
		},2000)
	} else quantumReset(force, auto, challid, bigRip)
}

function isQuantumReached() {
	return player.money.log10()>=getQCGoal()&&player.meta.antimatter.gte(Decimal.pow(Number.MAX_VALUE,player.masterystudies?1.45:1))&&(!player.masterystudies||ECTimesCompleted("eterc14"))
}

let quarkGain = function () {
	if (player.masterystudies) {
		if (player.quantum.times<1) return new Decimal(1)
		var log = player.meta.antimatter.log10() / 280 - 1.355
		if (log > 1.2) log = log*log/1.2
		if (log > 738) log = Math.sqrt(log * 738)
		return Decimal.pow(10, log).times(Decimal.pow(2, player.quantum.multPower.total)).floor()
	}
	return Decimal.pow(10, player.meta.antimatter.log(10) / Math.log10(Number.MAX_VALUE) - 1).times(quarkMult()).floor();
}

let quarkMult = function () {
	let ret = Decimal.pow(2, player.quantum.rebuyables[2]);
	if (player.quantum.upgrades.includes(4)) {
		ret = ret.times(Decimal.pow(2, player.quantum.realGluons / 1024));
	}
	return ret;
}

function toggleQuantumConf() {
	player.aarexModifications.quantumConf = !player.aarexModifications.quantumConf
	document.getElementById("quantumConfirmBtn").textContent = "Quantum confirmation: O" + (player.aarexModifications.quantumConf ? "N" : "FF")
}

var averageQk = new Decimal(0)
var bestQk
function updateLastTenQuantums() {
	if (!player.meta) return
    var listed = 0
    var tempTime = new Decimal(0)
    var tempQK = new Decimal(0)
    for (var i=0; i<10; i++) {
        if (player.quantum.last10[i][1].gt(0)) {
            var qkpm = player.quantum.last10[i][1].dividedBy(player.quantum.last10[i][0]/600)
            var tempstring = shorten(qkpm) + " QK/min"
            if (qkpm<1) tempstring = shorten(qkpm*60) + " QK/hour"
            var msg = "The quantum " + (i == 0 ? '1 quantum' : (i+1) + ' quantums') + " ago took " + timeDisplayShort(player.quantum.last10[i][0], false, 3)
            if (player.quantum.last10[i][2]) {
                if (typeof(player.quantum.last10[i][2])=="number") " in Quantum Challenge " + player.quantum.last10[i][2]
                else msg += " in Paired Challenge " + player.quantum.last10[i][2][0] + " (QC" + player.quantum.last10[i][2][1][0] + "+" + player.quantum.last10[i][2][1][1] + ")"
            }
            msg += " and gave " + shortenDimensions(player.quantum.last10[i][1]) +" QK. "+ tempstring
            document.getElementById("quantumrun"+(i+1)).textContent = msg
            tempTime = tempTime.plus(player.quantum.last10[i][0])
            tempQK = tempQK.plus(player.quantum.last10[i][1])
            bestQk = player.quantum.last10[i][1].max(bestQk)
            listed++
        } else document.getElementById("quantumrun"+(i+1)).textContent = ""
    }
    if (listed > 1) {
        tempTime = tempTime.dividedBy(listed)
        tempQK = tempQK.dividedBy(listed)
        var qkpm = tempQK.dividedBy(tempTime/600)
        var tempstring = shorten(qkpm) + " QK/min"
        averageQk = tempQK
        if (qkpm<1) tempstring = shorten(qkpm*60) + " QK/hour"
        document.getElementById("averageQuantumRun").textContent = "Last " + listed + " quantums average time: "+ timeDisplayShort(tempTime, false, 3)+" Average QK gain: "+shortenDimensions(tempQK)+" QK. "+tempstring
    } else document.getElementById("averageQuantumRun").textContent = ""
}

//v2.9014
function doQuantumProgress() {
	var power = player.masterystudies != undefined ? 1.45 : 1
	var id = 1
	if (quantumed && power > 1) {
		if (player.quantum.bigRip.active) {
			if (player.meta.antimatter.lt(Decimal.pow(Number.MAX_VALUE, power))) id = 1
			else if (!player.quantum.breakEternity.unlocked) id = 4
			else id = 5
		} else if (inQC(0)) {
			var gqk = quarkGain()
			if (player.meta.antimatter.gte(Decimal.pow(Number.MAX_VALUE, power)) && Decimal.gt(gqk, 1)) id = 3
		} else if (player.money.lt(Decimal.pow(10, getQCGoal())) || player.meta.antimatter.gte(Decimal.pow(Number.MAX_VALUE, power))) id = 2
	}
	var className = id > 3 ? "ghostifyProgress" : "quantumProgress"
	if (document.getElementById("progressbar").className != className) document.getElementById("progressbar").className = className
	if (id == 1) {
		var percentage = Math.min(player.meta.antimatter.max(1).log10() / Decimal.log10(Number.MAX_VALUE) / power * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip',(player.masterystudies?"Meta-antimatter p":"P")+'ercentage to quantum')
	} else if (id == 2) {
		var percentage = Math.min(player.money.max(1).log10() / getQCGoal() * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Percentage to Quantum Challenge goal')
	} else if (id == 3) {
		var gqkLog = gqk.log2()
		var goal = Math.pow(2,Math.ceil(Math.log10(gqkLog) / Math.log10(2)))
		var percentage = Math.min(gqkLog / goal * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to "+shortenDimensions(Decimal.pow(2,goal))+" QK gain")
	} else if (id == 4) {
		var percentage = Math.min(player.eternityPoints.max(1).log10() / 1200, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Eternity points percentage to Break Eternity')
	} else if (id == 5) {
		var percentage = Math.min(player.quantum.bigRip.bestThisRun.max(1).log10() / getQCGoal() * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Percentage to Ghostify')
	}
}

//v2.90141
function checkUniversalHarmony() {
	if (player.achievements.includes("ngpp18")) return
	if (player.meta!=undefined) {
		if (player.galaxies<700||player.replicanti.galaxies+extraReplGalaxies<700||player.dilation.freeGalaxies<700) return
	} else if (player.exdilation!=undefined) {
		if (player.galaxies!=player.replicanti.galaxies||player.galaxies!=player.dilation.freeGalaxies||player.galaxies<300) return
	} else return
	giveAchievement("Universal harmony")
}

//v2.90142
function quantumReset(force, auto, challid, bigRip, implode=false) {
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !player.masterystudies
	var pc=challid-8
	if (implode && speedrunMilestonesReached < 1) {
		showTab("dimensions")
		showDimTab("antimatterdimensions")
		showChallengesTab("challenges")
		showInfTab("preinf")
		showEternityTab("timestudies", document.getElementById("eternitystore").style.display != "block" && document.getElementById("timestudies").style.display != "block")
	}
	if (!quantumed) {
		quantumed=true
		document.getElementById("quantumtabbtn").style.display=""
		document.getElementById("quarks").style.display=""
		document.getElementById("galaxyPoints2").className = "GP"
		document.getElementById("sacpos").className = "sacpos"
		if (player.masterystudies) {
			document.getElementById("bestAntimatterType").textContent = "Your best meta-antimatter for this quantum"
			document.getElementById("quarksAnimBtn").style.display="inline-block"
			document.getElementById("quantumstudies").style.display=""
		}
		if (isEmptiness) {
			showTab("dimensions")
			isEmptiness = false
			document.getElementById("quantumtabbtn").style.display = "inline-block"
			if (ghostified) document.getElementById("ghostifytabbtn").style.display = "inline-block"
		}
	}
	document.getElementById("quantumbtn").style.display="none"
	document.getElementById("ghostifybtn").style.display="none"
	if (force) bankedEterGain=0
	else {
		for (var i=player.quantum.last10.length-1; i>0; i--) {
			player.quantum.last10[i] = player.quantum.last10[i-1]
		}
		var qkGain=quarkGain()
		var array=[player.quantum.time, qkGain]
		if (!inQC(0)) {
			if (player.quantum.pairedChallenges.current > 0) {
				array.push([player.quantum.pairedChallenges.current, player.quantum.challenge])
			} else {
				array.push(player.quantum.challenge[0])
			}
		}
		player.quantum.last10[0] = array
		if (player.quantum.best>player.quantum.time) {
			player.quantum.best=player.quantum.time
			updateSpeedruns()
			if (speedrunMilestonesReached>23) giveAchievement("And the winner is...")
			if (speedrunMilestonesReached>25) document.getElementById('rebuyupgmax').style.display="none"
			if (speedrunMilestonesReached>27) {
				giveAchievement("Special Relativity")
				var removeMaxAll=false
				for (d=1;d<9;d++) {
					if (player.autoEterOptions["md"+d]) {
						if (d>7) removeMaxAll=true
					} else break
				}
				document.getElementById("metaMaxAllDiv").style.display=removeMaxAll?"none":""
			}
			if (player.quantum.best<=0.2) giveAchievement("Quantum doesn't take so long")
		}
		player.quantum.times++
		if (!inQC(6)) {
			player.quantum.quarks = player.quantum.quarks.plus(qkGain)
			if (player.masterystudies != undefined && player.quantum.quarks.gte(Number.MAX_VALUE) && !player.quantum.reachedInfQK) {
				if (!ghostified) {
					document.getElementById("welcome").style.display = "flex"
					document.getElementById("welcomeMessage").innerHTML = "Congratulations for getting " + shorten(Number.MAX_VALUE) + " quarks! You have unlocked new QoL features, like quantum autobuyer modes, assign all, and auto-assignation!"
					document.getElementById('assignAll').style.display=""
				}
				player.quantum.reachedInfQK = true
				document.getElementById('toggleautoquantummode').style.display=""
			}
		}
		if (!inQC(4)) if (player.meta.resets<1) giveAchievement("Infinity Morals")
		if (player.dilation.rebuyables[1] + player.dilation.rebuyables[2] + player.dilation.rebuyables[3] + player.dilation.rebuyables[4] < 1 && player.dilation.upgrades.length < 1) giveAchievement("Never make paradoxes!")
	}
	var oheHeadstart = bigRip ? player.quantum.bigRip.upgrades.includes(2) : speedrunMilestonesReached > 0
	var oldTime = player.quantum.time
	player.quantum.time=0
	document.getElementById("quarks").innerHTML="You have <b class='QKAmount'>"+shortenDimensions(player.quantum.quarks)+"</b> quark"+(player.quantum.quarks.lt(2)?".":"s.")
	document.getElementById("galaxyPoints2").innerHTML="You have <span class='GPAmount'>0</span> Galaxy points."
	if (player.masterystudies) {
		if (!player.quantum.gluons.rg) {
			player.quantum.gluons = {
				rg: new Decimal(0),
				gb: new Decimal(0),
				br: new Decimal(0)
			}
		}
		if (bigRip != player.quantum.bigRip.active) {
			player.quantum.bigRip["savedAutobuyers" + (bigRip ? "No" : "") + "BR"] = {}
			var data = player.quantum.bigRip["savedAutobuyers" + (bigRip ? "No" : "") + "BR"]
			for (d=1;d<9;d++) if (player.autobuyers[d-1] % 1 !== 0) data["d"+d] = {
				time: player.autobuyers[d-1].interval,
				cost: player.autobuyers[d-1].cost,
				priority: player.autobuyers[d-1].priority,
				bulk: player.autobuyers[d-1].bulk,
				perTen: player.autobuyers[d-1].target > 10,
				on: player.autobuyers[d-1].isOn,
			}
			if (player.autobuyers[8] % 1 !== 0) data.tickspeed = {
				time: player.autobuyers[8].interval,
				cost: player.autobuyers[8].cost,
				priority: player.autobuyers[8].priority,
				max: player.autobuyers[8].target == 10,
				on: player.autobuyers[8].isOn
			}
			if (player.autoSacrifice % 1 !== 0) data.sacrifice = {
				time: player.autoSacrifice.interval,
				cost: player.autoSacrifice.cost,
				amount: player.autoSacrifice.priority,
				on: player.autoSacrifice.isOn
			}
			if (player.autobuyers[9] % 1 !== 0) data.dimBoosts = {
				time: player.autobuyers[9].interval,
				cost: player.autobuyers[9].cost,
				maxDims: player.autobuyers[9].priority,
				always: player.overXGalaxies,
				bulk: player.autobuyers[9].bulk,
				on: player.autobuyers[9].isOn
			}
			if (player.tickspeedBoosts !== undefined) if (player.autobuyers[13] % 1 !== 0) data.tickBoosts = {
				time: player.autobuyers[13].interval,
				cost: player.autobuyers[13].cost,
				maxDims: player.autobuyers[13].priority,
				always: player.overXGalaxiesTickspeedBoost,
				bulk: player.autobuyers[13].bulk,
				on: player.autobuyers[13].isOn
			}
			if (player.autobuyers[10] % 1 !== 0) data.galaxies = {
				time: player.autobuyers[10].interval,
				cost: player.autobuyers[10].cost,
				maxGalaxies: player.autobuyers[10].priority,
				bulkTime: player.autobuyers[10].bulk,
				on: player.autobuyers[10].isOn
			}
			if (player.galacticSacrifice !== undefined) if (player.autobuyers[12] % 1 !== 0) data.galSacrifice = {
				time: player.autobuyers[12].interval,
				cost: player.autobuyers[12].cost,
				amount: player.autobuyers[12].priority,
				on: player.autobuyers[12].isOn
			}
			if (player.autobuyers[11] % 1 !== 0) data.crunch = {
				time: player.autobuyers[11].interval,
				cost: player.autobuyers[11].cost,
				mode: player.autoCrunchMode,
				amount: player.autobuyers[11].priority,
				on: player.autobuyers[11].isOn
			}
			data.eternity = {
				mode: player.autoEterMode,
				amount: player.eternityBuyer.limit,
				dilation: player.eternityBuyer.dilationMode,
				dilationPerStat: player.eternityBuyer.dilationPerAmount,
				on: player.eternityBuyer.isOn
			}
			var data = player.quantum.bigRip["savedAutobuyers" + (bigRip ? "" : "No") + "BR"]
			if ((!bigRip || player.quantum.bigRip.upgrades.includes(2)) && data !== undefined) {
				for (d=1;d<9;d++) if (data["d"+d]) player.autobuyers[d-1] = {
					interval: data["d"+d].time,
					cost: data["d"+d].cost,
					bulk: data["d"+d].bulk,
					priority: data["d"+d].priority,
					tier: d,
					target: d + (data["d"+d].perTen ? 10 : 0),
					ticks: 0,
					isOn: data["d"+d].on
				}
				if (data.tickspeed) player.autobuyers[8] = {
					interval: data.tickspeed.time,
					cost: data.tickspeed.cost,
					bulk: 1,
					priority: data.tickspeed.priority,
					tier: 1,
					target: (data.tickspeed.max ? 10 : 1),
					ticks: 0,
					isOn: data.tickspeed.on
				}
				if (data.sacrifice) player.autoSacrifice = {
					interval: data.sacrifice.time,
					cost: data.sacrifice.cost,
					bulk: 1,
					priority: data.sacrifice.priority,
					tier: 1,
					target: 13,
					ticks: 0,
					isOn: data.sacrifice.on
				}
				if (data.dimBoosts) {
					player.autobuyers[9] = {
						interval: data.dimBoosts.time,
						cost: data.dimBoosts.cost,
						bulk: data.dimBoosts.bulk,
						priority: data.dimBoosts.maxDims,
						tier: 1,
						target: 11,
						ticks: 0,
						isOn: data.dimBoosts.on
					}
					player.overXGalaxies = data.dimBoosts.always
				}
				if (data.tickBoosts) {
					player.autobuyers[13] = {
						interval: data.tickBoosts.time,
						cost: data.tickBoosts.cost,
						bulk: data.tickBoosts.bulk,
						priority: data.tickBoosts.maxDims,
						tier: 1,
						target: 14,
						ticks: 0,
						isOn: data.tickBoosts.on
					}
					player.overXGalaxiesTickspeedBoost = data.tickBoosts.always
				}
				if (data.galaxies) player.autobuyers[10] = {
					interval: data.galaxies.time,
					cost: data.galaxies.cost,
					bulk: data.galaxies.bulkTime,
					priority: data.galaxies.maxGalaxies,
					tier: 1,
					target: 11,
					ticks: 0,
					isOn: data.galaxies.on
				}
				if (data.galacticSacrifice) player.autobuyers[12] = {
					interval: data.galacticSacrifice.time,
					cost: data.galacticSacrifice.cost,
					bulk: 1,
					priority: data.galacticSacrifice.amount,
					tier: 1,
					target: 13,
					ticks: 0,
					isOn: data.galacticSacrifice.on
				}
				if (data.crunch) {
					player.autobuyers[11] = {
						interval: data.crunch.time,
						cost: data.crunch.cost,
						bulk: 1,
						priority: data.crunch.amount,
						tier: 1,
						target: 12,
						ticks: 0,
						isOn: data.crunch.on
					}
					player.autoCrunchMode = data.crunch.mode
				}
				if (data.eternity) {
					player.eternityBuyer = {
						limit: data.eternity.amount,
						dilationMode: data.eternity.dilation,
						dilationPerAmount: data.eternity.dilationPerStat,
						statBeforeDilation: data.eternity.dilationPerStat,
						isOn: data.eternity.on
					}
					player.autoEterMode = data.eternity.mode
				}
				loadAutoBuyerSettings()
				if (player.autoCrunchMode == "amount") {
					document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
					document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
				} else if (player.autoCrunchMode == "time") {
					document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: time"
					document.getElementById("limittext").textContent = "Seconds between crunches:"
				} else {
					document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
					document.getElementById("limittext").textContent = "X times last crunch:"
				}
				updateAutoEterMode()
			}
		}
		if (!bigRip && player.quantum.bigRip.active) if (player.galaxies == 9 && player.replicanti.galaxies == 9 && player.infinityDimension8.amount.round().eq(9) && player.timeDimension4.amount.round().eq(9)) giveAchievement("We can really afford 9.")
	} else player.quantum.gluons = 0;
	if (player.tickspeedBoosts !== undefined) player.tickspeedBoosts = 0
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	else player.infinityPoints = new Decimal(0);
	if (player.masterystudies !== undefined) {
		if (!bigRip && player.quantum.bigRip.active && force) player.quantum.bigRip.spaceShards = player.quantum.bigRip.spaceShards.add(getSpaceShardsGain()).round()
		else if (inQC(6) && inQC(8) && player.money.gt(player.quantum.pairedChallenges.pc68best)) {
			player.quantum.pairedChallenges.pc68best = player.money
			document.getElementById("bpc68").textContent = shortenMoney(player.money)
		}
	}
	player = {
		money: new Decimal(10),
		tickSpeedCost: new Decimal(1000),
		tickspeed: new Decimal(player.aarexModifications.newGameExpVersion?500:1000),
		tickBoughtThisInf: resetTickBoughtThisInf(),
		firstCost: new Decimal(10),
		secondCost: new Decimal(100),
		thirdCost: new Decimal(10000),
		fourthCost: new Decimal(1000000),
		fifthCost: new Decimal(1e9),
		sixthCost: new Decimal(1e13),
		seventhCost: new Decimal(1e18),
		eightCost: new Decimal(1e24),
		firstAmount: new Decimal(0),
		secondAmount: new Decimal(0),
		thirdAmount: new Decimal(0),
		fourthAmount: new Decimal(0),
		firstBought: 0,
		secondBought: 0,
		thirdBought: 0,
		fourthBought: 0,
		fifthAmount: new Decimal(0),
		sixthAmount: new Decimal(0),
		seventhAmount: new Decimal(0),
		eightAmount: new Decimal(0),
		fifthBought: 0,
		sixthBought: 0,
		seventhBought: 0,
		eightBought: 0,
		totalBoughtDims: resetTotalBought(),
		firstPow: new Decimal(1),
		secondPow: new Decimal(1),
		thirdPow: new Decimal(1),
		fourthPow: new Decimal(1),
		fifthPow: new Decimal(1),
		sixthPow: new Decimal(1),
		seventhPow: new Decimal(1),
		eightPow: new Decimal(1),
		sacrificed: new Decimal(0),
		achievements: player.achievements,
		challenges: [],
		currentChallenge: "",
		infinityUpgrades: oheHeadstart ? player.infinityUpgrades : [],
		setsUnlocked: oheHeadstart ? player.setsUnlocked : 0,
		infinityPoints: player.infinityPoints,
		infinitied: 0,
		infinitiedBank: headstart || player.achievements.includes("ng3p15") ? player.infinitiedBank : 0,
		totalTimePlayed: player.totalTimePlayed,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: oheHeadstart ? 4 : 0,
		dbPower: player.dbPower,
		tickspeedBoosts: player.tickspeedBoosts,
		galaxies: oheHeadstart ? 1 : 0,
		galacticSacrifice: resetGalacticSacrifice(),
		totalmoney: player.totalmoney,
		interval: null,
		lastUpdate: player.lastUpdate,
		achPow: player.achPow,
		autobuyers: oheHeadstart ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		partInfinityPoint: 0,
		partInfinitied: 0,
		break: oheHeadstart ? player.break : false,
		costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
		tickspeedMultiplier: new Decimal(10),
		chall2Pow: 1,
		chall3Pow: new Decimal(0.01),
		newsArray: player.newsArray,
		matter: new Decimal(0),
		chall11Pow: new Decimal(1),
		challengeTimes: player.challengeTimes,
		infchallengeTimes: player.infchallengeTimes,
		lastTenRuns: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		lastTenEternities: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		infMult: new Decimal(1),
		infMultCost: new Decimal(10),
		tickSpeedMultDecrease: oheHeadstart ? player.tickSpeedMultDecrease : GUBought("gb4") ? 1.25 : 10,
		tickSpeedMultDecreaseCost: oheHeadstart ? player.tickSpeedMultDecreaseCost : 3e6,
		dimensionMultDecrease: oheHeadstart ? player.dimensionMultDecrease : 10,
		dimensionMultDecreaseCost: oheHeadstart ? player.dimensionMultDecreaseCost : 1e8,
		extraDimPowerIncrease: oheHeadstart ? player.extraDimPowerIncrease : 0,
		dimPowerIncreaseCost: oheHeadstart ? player.dimPowerIncreaseCost : 1e3,
		version: player.version,
		postC4Tier: 1,
		postC8Mult: new Decimal(1),
		overXGalaxies: oheHeadstart ? player.overXGalaxies : 0,
		overXGalaxiesTickspeedBoost: oheHeadstart || player.tickspeedBoosts == undefined ? player.overXGalaxiesTickspeedBoost : 0,
		spreadingCancer: player.spreadingCancer,
		postChallUnlocked: (player.achievements.includes("r133")) ? 8 : 0,
		postC4Tier: 0,
		postC3Reward: new Decimal(1),
		eternityPoints: new Decimal(0),
		eternities: headstart ? player.eternities : bigRip ? (player.quantum.bigRip.upgrades.includes(2) ? 1e5 : 0) : speedrunMilestonesReached > 17 ? 1e13 : oheHeadstart ? 2e4 : 0,
		eternitiesBank: player.masterystudies ? player.eternitiesBank + bankedEterGain : undefined,
		thisEternity: 0,
		bestEternity: headstart ? player.bestEternity : 9999999999,
		eternityUpgrades: isRewardEnabled(3) && !bigRip ? [1,2,3,4,5,6] : [],
		epmult: new Decimal(1),
		epmultCost: new Decimal(500),
		infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
		infinityPower: new Decimal(1),
		infinityDimension1 : {
			cost: new Decimal(1e8),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension2 : {
			cost: new Decimal(1e9),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension3 : {
			cost: new Decimal(1e10),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension4 : {
			cost: new Decimal(1e20),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension5 : {
			cost: new Decimal(1e140),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension6 : {
			cost: new Decimal(1e200),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension7 : {
			cost: new Decimal(1e250),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension8 : {
			cost: new Decimal(1e280),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infDimBuyers: oheHeadstart ? player.infDimBuyers : [false, false, false, false, false, false, false, false],
		timeShards: new Decimal(0),
		tickThreshold: new Decimal(1),
		totalTickGained: 0,
		timeDimension1: {
			cost: new Decimal(1),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension2: {
			cost: new Decimal(5),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension3: {
			cost: new Decimal(100),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension4: {
			cost: new Decimal(1000),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension5: {
			cost: new Decimal("1e2350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension6: {
			cost: new Decimal("1e2650"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension7: {
			cost: new Decimal("1e3000"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension8: {
			cost: new Decimal("1e3350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		offlineProd: oheHeadstart ? player.offlineProd : 0,
		offlineProdCost: oheHeadstart ? player.offlineProdCost : 1e7,
		challengeTarget: 0,
		autoSacrifice: oheHeadstart ? player.autoSacrifice : 1,
		replicanti: {
			amount: new Decimal(oheHeadstart ? 1 : 0),
			unl: oheHeadstart,
			chance: 0.01,
			chanceCost: new Decimal(1e150),
			interval: 1000,
			intervalCost: new Decimal(1e140),
			gal: 0,
			galaxies: 0,
			galCost: new Decimal(1e170),
			galaxybuyer: oheHeadstart ? player.replicanti.galaxybuyer : undefined,
			auto: oheHeadstart ? player.replicanti.auto : [false, false, false]
		},
		timestudy: isRewardEnabled(11) && (bigRip ? player.quantum.bigRip.upgrades.includes(12) : true) ? player.timestudy : {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: [],
		},
		eternityChalls: {},
		eternityChallGoal: new Decimal(Number.MAX_VALUE),
		currentEternityChall: "",
		eternityChallUnlocked: 0,
		etercreq: 0,
		autoIP: new Decimal(0),
		autoTime: 1e300,
		infMultBuyer: oheHeadstart ? player.infMultBuyer : false,
		autoCrunchMode: oheHeadstart ? player.autoCrunchMode : "amount",
		autoEterMode: oheHeadstart ? player.autoEterMode : "amount",
		peakSpent: player.masterystudies ? 0 : undefined,
		respec: false,
		respecMastery: player.masterystudies ? false : undefined,
		eternityBuyer: oheHeadstart ? player.eternityBuyer : {
			limit: new Decimal(0),
			isOn: false
		},
		eterc8ids: 50,
		eterc8repl: 40,
		dimlife: true,
		dead: true,
		dilation: {
			studies: bigRip ? (player.quantum.bigRip.upgrades.includes(10) ? [1,2,3,4,5,6] : player.quantum.bigRip.upgrades.includes(10) ? [1] : []) : isRewardEnabled(4) ? (speedrunMilestonesReached > 5 ? [1,2,3,4,5,6] : [1]) : [],
			active: false,
			tachyonParticles: player.achievements.includes("ng3p37") && (bigRip ? player.quantum.bigRip.upgrades.includes(11) : true) ? player.dilation.bestTP.sqrt() : new Decimal(0),
			dilatedTime: new Decimal(speedrunMilestonesReached>21 && isRewardEnabled(4) && !bigRip?1e100:0),
			totalTachyonParticles: player.achievements.includes("ng3p37") && (bigRip ? player.quantum.bigRip.upgrades.includes(11) : true) ? player.dilation.bestTP.sqrt() : new Decimal(0),
			bestTP: player.dilation.bestTP,
			bestTPOverGhostifies: player.dilation.bestTPOverGhostifies,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: speedrunMilestonesReached > 5 && isRewardEnabled(4) && (bigRip ? player.quantum.bigRip.upgrades.includes(12) : true) ? [4,5,6,7,8,9,"ngpp1","ngpp2"] : [],
			rebuyables: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
			}
		},
		why: player.why,
		shameLevel: player.shameLevel,
		options: player.options,
		meta: {
			antimatter: new Decimal(speedrunMilestonesReached > 18 && !bigRip ? 1e25 : 100),
			bestAntimatter: headstart ? player.meta.bestAntimatter : new Decimal(speedrunMilestonesReached > 18 && !bigRip ? 1e25 : 100),
			bestOverQuantums: player.meta.bestOverQuantums,
			bestOverGhostifies: player.meta.bestOverGhostifies,
			resets: isRewardEnabled(27) ? 4 : 0,
			'1': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(10)
			},
			'2': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(100)
			},
			'3': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e4)
			},
			'4': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e6)
			},
			'5': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e9)
			},
			'6': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e13)
			},
			'7': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e18)
			},
			'8': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e24)
			}
		},
		masterystudies: player.masterystudies ? (!(bigRip ? player.quantum.bigRip.upgrades.includes(12) : true) ? ["d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14"] : speedrunMilestonesReached > 10 && isRewardEnabled(4) ? player.masterystudies : []) : undefined,
		autoEterOptions: player.autoEterOptions,
		galaxyMaxBulk: player.galaxyMaxBulk,
		quantum: player.quantum,
		old: player.masterystudies ? inQC(0) : undefined,
		dontWant: player.masterystudies ? true : undefined,
		ghostify: player.ghostify,
		aarexModifications: player.aarexModifications
	};
	if (player.challenges.includes("challenge1")) player.money = new Decimal(100)
	if (player.achievements.includes("r37")) player.money = new Decimal(1000)
	if (player.achievements.includes("r54")) player.money = new Decimal(2e5)
	if (player.achievements.includes("r55")) player.money = new Decimal(1e10)
	if (player.achievements.includes("r78")) player.money = new Decimal(1e25)
	if (player.galacticSacrifice && !oheHeadstart) player.autobuyers[12]=13
	if (player.tickspeedBoosts !== undefined && !oheHeadstart) player.autobuyers[13]=14
	player.challenges=challengesCompletedOnEternity()
	if (headstart) for (ec=1;ec<13;ec++) player.eternityChalls['eterc'+ec]=5
	else if (isRewardEnabled(3) && !bigRip) for (ec=1;ec<15;ec++) if (ec != 7) player.eternityChalls['eterc'+ec] = 5
	if (player.masterystudies) {
		giveAchievement("Sub-atomic")
		ipMultPower=GUBought("gb3")?2.3:player.masterystudies.includes("t241")?2.2:2
		player.dilation.times=0
		var diffrg=player.quantum.usedQuarks.r.min(player.quantum.usedQuarks.g)
		var diffgb=player.quantum.usedQuarks.g.min(player.quantum.usedQuarks.b)
		var diffbr=player.quantum.usedQuarks.b.min(player.quantum.usedQuarks.r)
		player.quantum.usedQuarks.r=player.quantum.usedQuarks.r.sub(diffrg).round()
		player.quantum.usedQuarks.g=player.quantum.usedQuarks.g.sub(diffgb).round()
		player.quantum.usedQuarks.b=player.quantum.usedQuarks.b.sub(diffbr).round()
		player.quantum.gluons.rg=player.quantum.gluons.rg.add(diffrg).round()
		player.quantum.gluons.gb=player.quantum.gluons.gb.add(diffgb).round()
		player.quantum.gluons.br=player.quantum.gluons.br.add(diffbr).round()
		if (!force) {
			var intensity=player.quantum.challenge.length
			var qc1=player.quantum.challenge[0]
			var qc2=player.quantum.challenge[1]
			if (getCurrentQCData().length>1) {
				if (player.quantum.pairedChallenges.current>player.quantum.pairedChallenges.completed) {
					player.quantum.challenges[qc1]=2
					player.quantum.challenges[qc2]=2
					player.quantum.electrons.mult+=0.5
					player.quantum.pairedChallenges.completed=player.quantum.pairedChallenges.current
					if (player.quantum.pairedChallenges.current==4) giveAchievement("Twice in a row")
				}
				var qc1st=Math.min(qc1,qc2)
				var qc2st=Math.max(qc1,qc2)
				if (player.quantum.pairedChallenges.completions[qc1st*10+qc2st] === undefined) player.quantum.pairedChallenges.completions[qc1st*10+qc2st] = player.quantum.pairedChallenges.current
				else player.quantum.pairedChallenges.completions[qc1st*10+qc2st] = Math.min(player.quantum.pairedChallenges.current,player.quantum.pairedChallenges.completions[qc1st*10+qc2st])
				if (player.quantum.pairedChallenges.fastest[qc1st*10+qc2st] === undefined) player.quantum.pairedChallenges.fastest[qc1st*10+qc2st] = oldTime
				else player.quantum.pairedChallenges.fastest[qc1st*10+qc2st] = player.quantum.pairedChallenges.fastest[qc1st*10+qc2st] = Math.min(player.quantum.pairedChallenges.fastest[qc1st*10+qc2st], oldTime)
			} else if (intensity>0) {
				if (!player.quantum.challenges[qc1]) {
					player.quantum.challenges[qc1]=1
					player.quantum.electrons.mult+=0.25
				}
				if (player.quantum.challengeRecords[qc1] == undefined) player.quantum.challengeRecords[qc1]=oldTime
				else player.quantum.challengeRecords[qc1]=Math.min(player.quantum.challengeRecords[qc1],oldTime)
			}
			if (player.quantum.pairedChallenges.respec) {
				player.quantum.electrons.mult-=player.quantum.pairedChallenges.completed*0.5
				player.quantum.pairedChallenges = {
					order: {},
					current: 0,
					completed: 0,
					completions: player.quantum.pairedChallenges.completions,
					fastest: player.quantum.pairedChallenges.fastest,
					respec: false
				}
				for (qc=1;qc<9;qc++) player.quantum.challenges[qc]=1
				document.getElementById("respecPC").className="storebtn"
			}
			if (player.quantum.autoOptions.assignQK) assignAll(true)
			if (ghostified) player.ghostify.neutrinos.generationGain = player.ghostify.neutrinos.generationGain % 3 + 1
		}
		player.quantum.pairedChallenges.current=0
		if (challid==0) {
			player.quantum.electrons.amount=0
			player.quantum.electrons.sacGals=0
			player.quantum.challenge=[]
		} else if (pc<1) player.quantum.challenge=[challid]
		else {
			player.quantum.challenge=player.quantum.pairedChallenges.order[pc]
			player.quantum.pairedChallenges.current=pc
		}
		player.quantum.replicants.amount = new Decimal(0)
		player.quantum.replicants.requirement = new Decimal("1e3000000")
		player.quantum.replicants.quarks = new Decimal(0)
		player.quantum.replicants.eggonProgress = new Decimal(0)
		player.quantum.replicants.eggons = new Decimal(0)
		player.quantum.replicants.babyProgress = new Decimal(0)
		player.quantum.replicants.babies = new Decimal(0)
		player.quantum.replicants.growupProgress = new Decimal(0)
		for (d=1;d<9;d++) {
			if (d>7||eds[d].perm<10) player.quantum.replicants.quantumFood+=Math.round(eds[d].progress.toNumber()*3)%3
			eds[d].workers=new Decimal(eds[d].perm)
			eds[d].progress=new Decimal(0)
		}
		player.quantum.nanofield.charge = new Decimal(0)
		player.quantum.nanofield.energy = new Decimal(0)
		player.quantum.nanofield.antienergy = new Decimal(0)
		player.quantum.nanofield.power = 0
		player.quantum.nanofield.powerThreshold = new Decimal(50)
		if (player.quantum.bigRip.active != bigRip) for (var t=1;t<9;t++) document.getElementById("treeupg"+t+"lvl").textContent=player.quantum.tod.upgrades[t] + (player.quantum.bigRip.active || player.quantum.tod.upgrades[t] <= maxLevels[t] ? "" : " (cap: " + maxLevels[t] + ")")
		player.quantum.bigRip.active = bigRip
		if (bigRip) {
			tweakBigRip()
			if (player.quantum.bigRip.times < 1) document.getElementById("bigRipConfirmBtn").style.display = "inline-block"
			player.quantum.bigRip.times++
			player.quantum.bigRip.bestThisRun = player.money
			giveAchievement("To the new dimension!")
			if (!player.quantum.bigRip.upgrades.includes(2)) {
				showTab("infinity")
				showInfTab("preinf")
			}
		}
		document.getElementById("metaAntimatterEffectType").textContent=inQC(3)?"multiplier on all Infinity Dimensions":"extra multiplier per dimension boost"
		updateColorCharge()
		updateGluons()
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
		}
		player.eternityBuyer.statBeforeDilation = 0
		if ((player.autoEterMode=="replicanti"||player.autoEterMode=="peak")&&(speedrunMilestonesReached<18||!isRewardEnabled(4))) {
			player.autoEterMode="amount"
			updateAutoEterMode()
		}
		document.getElementById('dilationmode').style.display=speedrunMilestonesReached>4?"":"none"
		document.getElementById('rebuyupgauto').style.display=speedrunMilestonesReached>6?"":"none"
		document.getElementById('toggleallmetadims').style.display=speedrunMilestonesReached>7?"":"none"
		document.getElementById('metaboostauto').style.display=speedrunMilestonesReached>14?"":"none"
		document.getElementById("autoBuyerQuantum").style.display=speedrunMilestonesReached>22?"":"none"
		if (speedrunMilestonesReached<6||!isRewardEnabled(4)) {
			document.getElementById("qctabbtn").style.display="none"
			document.getElementById("electronstabbtn").style.display="none"
		}
		if (bigRip?player.quantum.bigRip.upgrades.includes(12):isRewardEnabled(11)&&isRewardEnabled(4)) player.dilation.upgrades.push(10)
		else player.quantum.wasted = !isRewardEnabled(11)||bigRip
		if (bigRip?player.quantum.bigRip.upgrades.includes(12):speedrunMilestonesReached>13&&isRewardEnabled(4)) for (i=3;i<7;i++) player.dilation.upgrades.push("ngpp"+i)
		player.quantum.notrelative = true
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
	}
	if (speedrunMilestonesReached<1&&!bigRip) {
		document.getElementById("infmultbuyer").textContent="Autobuy IP mult OFF"
		document.getElementById("togglecrunchmode").textContent="Auto crunch mode: amount"
		document.getElementById("limittext").textContent="Amount of IP to wait until reset:"
		document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
	}
	for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) document.getElementById(i + "MetaRow").style.display = "none"
	
	setInitialDimensionPower()
	updatePowers()
	if (oheHeadstart) player.replicanti.amount = new Decimal(1)
	player.replicanti.galaxies = 0
	updateRespecButtons()
	if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (inQC(6)) document.getElementById("matter").style.display = "block";
	else document.getElementById("matter").style.display = "none";
       if (isADSCRunning()) document.getElementById("chall13Mult").style.display = "block";
       else document.getElementById("chall13Mult").style.display = "none";
	document.getElementById("quickReset").style.display = "none";
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	updateAutobuyers();
	if (player.achievements.includes("r37")) player.money = new Decimal(1000);
	if (player.achievements.includes("r54")) player.money = new Decimal(2e5);
	if (player.achievements.includes("r55")) player.money = new Decimal(1e10);
	if (player.achievements.includes("r78")) player.money = new Decimal(1e25);
	if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4);
	if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4);
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	if (player.achievements.includes("r142")) player.meta.antimatter = new Decimal(100);
	resetInfDimensions();
	updateChallenges();
	updateChallengeTimes()
	updateLastTenRuns()
	updateLastTenEternities()
	updateLastTenQuantums()
	if (!player.achievements.includes("r133")) {
		var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
		for (var i = 0; i< infchalls.length; i++) infchalls[i].style.display = "none"
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
		document.getElementById("secondRow").style.display = "none";
		document.getElementById("thirdRow").style.display = "none";
		document.getElementById("tickSpeed").style.visibility = "hidden";
		document.getElementById("tickSpeedMax").style.visibility = "hidden";
		document.getElementById("tickLabel").style.visibility = "hidden";
		document.getElementById("tickSpeedAmount").style.visibility = "hidden";
		document.getElementById("fourthRow").style.display = "none";
		document.getElementById("fifthRow").style.display = "none";
		document.getElementById("sixthRow").style.display = "none";
		document.getElementById("seventhRow").style.display = "none";
		document.getElementById("eightRow").style.display = "none";
		if (player.masterystudies) document.getElementById("infmultbuyer").textContent="Max buy IP mult"
		else document.getElementById("infmultbuyer").style.display = "none"
		hideMaxIDButton()
		document.getElementById("replicantidiv").style.display="none"
		document.getElementById("replicantiunlock").style.display="inline-block"
		document.getElementById("replicantiresettoggle").style.display = "none"
		delete player.replicanti.galaxybuyer
	}
	document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
	document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
	document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."
	document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
	document.getElementById("eternityPoints2").style.display = "inline-block"
	document.getElementById("eternitystorebtn").style.display = "inline-block"
	document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
	updateEternityUpgrades()
	document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
	updateTickSpeed();
	playerInfinityUpgradesOnEternity()
	document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
	updateEternityChallenges()
	updateTheoremButtons()
	updateTimeStudyButtons()
	updateDilationUpgradeCosts()
	drawStudyTree()
	if (!isRewardEnabled(4)||bigRip) if (document.getElementById("dilation").style.display=="block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display=="block")
	document.getElementById("masterystudyunlock").style.display = (bigRip ? !player.quantum.bigRip.upgrades.includes(12) : speedrunMilestonesReached < 14 || !isRewardEnabled(4)) ? "none" : ""
	if (speedrunMilestonesReached < 14 || !isRewardEnabled(4)) {
		document.getElementById("respecMastery").style.display = "none"
		document.getElementById("respecMastery2").style.display = "none"
		document.getElementById("replicantsstudies").style.display = "none"
		document.getElementById("timestudy322").style.display="none"
		document.getElementById("empstudies").style.display = "none"
		document.getElementById("timestudy361").style.display = "none"
		document.getElementById("timestudy362").style.display = "none"
		document.getElementById("nfstudies").style.display="none"
		document.getElementById("edtabbtn").style.display = "none"
		document.getElementById("nanofieldtabbtn").style.display = "none"
		document.getElementById("todtabbtn").style.display = "none"
		if (document.getElementById("metadimensions").style.display == "block"||document.getElementById("emperordimensions").style.display == "block") showDimTab("antimatterdimensions")
		if (document.getElementById("masterystudies").style.display=="block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display=="block")
		if (document.getElementById("quantumchallenges").style.display == "block") showChallengesTab("normalchallenges")
		if (document.getElementById("electrons").style.display == "block"||document.getElementById("replicants").style.display == "block"||document.getElementById("nanofield").style.display == "block") showQuantumTab("uquarks")
	}
	document.getElementById("breakEternityTabbtn").style.display = bigRip || player.quantum.breakEternity.unlocked ? "" : "none"
	if (!bigRip && !player.quantum.breakEternity.unlocked) if (document.getElementById("breakEternity").style.display == "block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display=="block")
	drawMasteryTree()
	Marathon2 = 0;
	document.getElementById("quantumConfirmBtn").style.display = "inline-block"
}

function metaReset2() {
	if (player.masterystudies !== undefined ? player.quantum.bigRip.active : false) ghostify()
	else quantum(false, false, 0)
}
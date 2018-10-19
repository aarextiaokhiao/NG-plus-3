function getDilationMetaDimensionMultiplier () {
  return player.dilation.dilatedTime.div(1e40).pow(.1).plus(1);
}

function getMetaDimensionMultiplier (tier) {
  if (player.currentEternityChall === "eterc11") {
    return new Decimal(1);
  }
  let power = player.dilation.upgrades.includes("ngpp4") ? getDil15Bonus() : 2
  let multiplier = Decimal.pow(power*(inQC(6)?1.01:1), Math.floor(player.meta[tier].bought / 10)).times(Decimal.pow(inQC(8)?1:power*(player.achievements.includes("ngpp14")?1.01:1), Math.max(0, player.meta.resets - tier + 1)*(!player.masterystudies?1:player.masterystudies.includes('t312')?1.02:1))).times(getDilationMetaDimensionMultiplier());
  if (player.dilation.upgrades.includes("ngpp3")) {
    multiplier = multiplier.times(getDil14Bonus());
  }
  if (player.achievements.includes("ngpp12")) multiplier = multiplier.times(1.1)
  if (player.masterystudies) {
      if (player.masterystudies.includes("t262")) multiplier = multiplier.times(getMTSMult(262))
      if (player.masterystudies.includes("t282")) multiplier = multiplier.times(getMTSMult(282))
      if (player.masterystudies.includes("t303")) multiplier = multiplier.times(getMTSMult(303))
      if (QCIntensity(3)) multiplier = multiplier.times(Decimal.pow(10,Math.sqrt(Math.max(player.infinityPower.log10(),0)/(QCIntensity(3)>1?2e8:1e9))))
      if (player.masterystudies.includes("t351")) multiplier = multiplier.times(getMTSMult(351))
  }
  if (GUBought("rg3")&&tier<2) multiplier = multiplier.times(player.resets)
  if (GUBought("br4")) multiplier = multiplier.times(Decimal.pow(getDimensionPowerMultiplier(), 0.0003))
  if (tier%2>0) multiplier = multiplier.times(QC4Reward)
  if (QCIntensity(6)) multiplier = multiplier.times(player.achPow.pow(QCIntensity(6)>1?3:1))
  
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

function getMetaShiftRequirement () {
  return {
    tier: Math.min(8, player.meta.resets + 4),
    amount: Math.floor(Math.max(((inQC(4) ? 5.5 : 15) - (!player.masterystudies ? 0 : player.masterystudies.includes("t312") ? 1 : 0)) * (player.meta.resets - 4),0) + Math.max((inQC(4) ? 14.5 : 5) * (player.meta.resets - (inQC(4) ? 55 : 15)), 0)) + 20
  }
}

function metaBoost() {
	let req = getMetaShiftRequirement();
	if (player.meta[req.tier].bought<req.amount) {
		return false;
	}
	if (speedrunMilestonesReached>26 && req.tier>7) {
		let costStart=15
		let mult=15
		if (inQC(4)) {
			costStart=55
			mult=5.5
		}
		if (player.masterystudies) if (player.masterystudies.includes("t312")) mult--
		if (player.meta.resets<costStart) {
			player.meta.resets=Math.min(player.meta.resets+Math.floor((player.meta[8].bought-req.amount)/mult)+1,costStart)
			if (player.meta.resets==costStart) req = getMetaShiftRequirement()
		}
		if (player.meta.resets>=costStart) {
			mult=20
			if (player.masterystudies) if (player.masterystudies.includes("t312")) mult--
			player.meta.resets+=Math.floor((player.meta[8].bought-req.amount)/mult)+1
		}
	} else player.meta.resets++
	if (player.meta.resets>9) giveAchievement("Meta-boosting to the max")
	player.meta.antimatter = new Decimal(speedrunMilestonesReached>18?1e25:player.achievements.includes("ngpp12")?100:10);
	clearMetaDimensions();
	for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) document.getElementById(i + "MetaRow").style.display = "none"
	document.getElementById("quantumbtn").style.display="none"
	return true;
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
		if (speedrunMilestonesReached > 23 && player.achievements.includes("ng3p21")) {
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
	else {
		let power=8
		if (player.dilation.upgrades.includes("ngpp5")) power++
		power+=ECTimesCompleted("eterc13")*0.2
		if (player.masterystudies) if (player.masterystudies.includes('t313')) power++
		return player.meta.bestAntimatter.pow(power).plus(1)
	}
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
	document.getElementById("metaAntimatterEffect").textContent = shortenMoney(getExtraDimensionBoostPower())
	document.getElementById("metaAntimatterPerSec").textContent = 'You are getting ' + shortenDimensions(getMetaDimensionProduction(1)) + ' meta-antimatter per second.';
	for (let tier = 1; tier <= 8; ++tier) {
		if (!canBuyMetaDimension(tier) && document.getElementById(tier + "MetaRow").style.display !== "table-row") {
			break;
		}
		document.getElementById(tier + "MetaD").childNodes[0].nodeValue = DISPLAY_NAMES[tier] + " Meta Dimension x" + formatValue(player.options.notation, getMetaDimensionMultiplier(tier), 1, 1);
		document.getElementById("meta" + tier + "Amount").textContent = getMetaDimensionDescription(tier);
	}
	for (let tier = 1; tier <= 8; ++tier) {
		if (!canBuyMetaDimension(tier)) {
			break;
		}
		document.getElementById(tier + "MetaRow").style.display = "table-row";
		document.getElementById(tier + "MetaRow").style.visibility = "visible";
	}
	for (let tier = 1; tier <= 8; ++tier) {
		document.getElementById('meta' + tier).className = speedrunMilestonesReached > tier+5 ? "storebtn" : canAffordMetaDimension(player.meta[tier].cost) ? 'storebtn' : 'unavailablebtn';
		document.getElementById('metaMax' + tier).className = canAffordMetaDimension((shiftDown && speedrunMilestonesReached > tier+5) ? player.meta[tier].cost : getMetaMaxCost(tier)) ? 'storebtn' : 'unavailablebtn';
	}
	var isMetaShift = player.meta.resets < 4
	var metaShiftRequirement = getMetaShiftRequirement()
        document.getElementById("metaResetLabel").textContent = 'Meta-Dimension ' + (isMetaShift ? "Shift" : "Boost") + ' ('+ getFullExpansion(player.meta.resets) +'): requires ' + getFullExpansion(metaShiftRequirement.amount) + " " + DISPLAY_NAMES[metaShiftRequirement.tier] + " Meta Dimensions"
        document.getElementById("metaSoftReset").textContent = "Reset meta-dimensions for a " + (isMetaShift ? "new dimension" : "boost")
	if (player.meta[metaShiftRequirement.tier].bought >= metaShiftRequirement.amount) {
		document.getElementById("metaSoftReset").className = 'storebtn';
	} else {
		document.getElementById("metaSoftReset").className = 'unavailablebtn';
	}
    var QS = quarkGain()
    var req = Decimal.pow(Number.MAX_VALUE,player.masterystudies?1.45:1)
    var reqGotten = isQuantumReached()
    document.getElementById("quantumResetLabel").textContent = 'Quantum: requires '+shorten(req)+' meta-antimatter '+(!inQC(0)? "and "+shortenCosts(Decimal.pow(10,getQCGoal()))+" antimatter":player.masterystudies?"and an EC14 completion":"")
    document.getElementById("quantum").textContent = 'Lose all your previous progress, but '+(player.quantum.times>0&&reqGotten?'gain '+shortenDimensions(QS)+' quark'+(QS.lt(2)?'':'s')+' for boosts':'get a boost')
    document.getElementById("quantum").className = reqGotten?'storebtn':'unavailablebtn'
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
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: manual"
		document.getElementById("eterlimittext").textContent = "Wait until next eternity"
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
	if (player.autoEterOptions.tt && !player.dilation.upgrades.includes(10)) maxTheorems()
}

// v2.301
function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk=!player.galaxyMaxBulk
	document.getElementById('replicantibulkmodetoggle').textContent="Mode: "+(player.galaxyMaxBulk?"Max":"Singles")
}

// v2.9
quantumed = false
function quantum(auto,force,challid) {
	if (!(isQuantumReached()||force)||implosionCheck) return
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !player.masterystudies
	if (player.aarexModifications.quantumConf&&!(auto||force)) if (!confirm(player.masterystudies?"Quantum will reset everything eternity resets, and "+(headstart?"also some other things like dilation":"also time studies, eternity challenges, dilation, "+(player.masterystudies?"meta dimensions, and mastery studies":"and meta dimensions"))+". You will gain a quark and unlock various upgrades.":"But wait! Quantum will erases almost everything that you have and rewards nothing! However, this is not a win. You need to reach real Infinite antimatter to win! (it's impossible)")) return
	if (player.quantum.times<1) if (!confirm("Are you sure you want to do that? You will lose everything you have!")) return
	var pc=challid-8
	if (player.masterystudies) {
		if (challid>0) {
			var abletostart=false
			if (pc>0) {
				if (player.quantum.pairedChallenges.order[pc]) if (player.quantum.pairedChallenges.order[pc].length>1) abletostart=true
			} else if (!pcFocus) abletostart=true
			if (abletostart) {
				if (pc>0) if (player.quantum.pairedChallenges.completed+1<pc) return
				if (player.quantum.electrons.amount.lt(getQCCost(challid))||!inQC(0)) return
				if (player.options.challConf) if (!confirm("You will do a quantum reset but you will not gain quarks, and keep your electrons & sacrificed galaxies, and you can't buy electron upgrades. You have to reach the set goal of meta-antimatter to complete this challenge. NOTE: Electrons does nothing in quantum challenges and your electrons and sacrificed galaxies does not reset until you end the challenge.")) return
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
			quantumReset(force, auto, challid, true)
		},1000)
		setTimeout(function(){
			implosionCheck=0
		},2000)
	} else quantumReset(force, auto, challid)
}

function isQuantumReached() {
	return player.money.log10()>=getQCGoal()&&player.meta.antimatter.gte(Decimal.pow(Number.MAX_VALUE,player.masterystudies?1.45:1))&&(!player.masterystudies||ECTimesCompleted("eterc14"))
}

let quarkGain = function () {
	if (player.masterystudies) {
		if (!quantumed) return new Decimal(1)
		var log = player.meta.antimatter.log10() / 280 - 1.355
		if (log > 1.2) log = log*log/1.2
		return Decimal.pow(10, log).times(Decimal.pow(2, player.quantum.multPower.total)).floor();
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
            document.getElementById("quantumrun"+(i+1)).textContent = "The quantum " + (i == 0 ? '1 quantum' : (i+1) + ' quantums') + " ago took " + timeDisplayShort(player.quantum.last10[i][0]) + " and gave " + shortenDimensions(player.quantum.last10[i][1]) +" QK. "+ tempstring
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
        document.getElementById("averageQuantumRun").textContent = "Last " + listed + " quantums average time: "+ timeDisplayShort(tempTime)+" Average QK gain: "+shortenDimensions(tempQK)+" QK. "+tempstring
    } else document.getElementById("averageQuantumRun").textContent = ""
}

//v2.9014
function doQuantumProgress() {
	document.getElementById("progressbar").className="quantumProgress"
	var gqk = quarkGain()
	if (!quantumed || player.meta.antimatter.lt(Decimal.pow(Number.MAX_VALUE, 1.45)) || !player.masterystudies || gqk.lt(2)) {
		var percentage = Math.min(player.meta.antimatter.max(1).log10() / Decimal.log10(Number.MAX_VALUE) / (player.masterystudies ? 1.45 : 1) * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip',(player.masterystudies?"Meta-antimatter p":"P")+'ercentage to quantum')
	} else if (!inQC(0)) {
		var percentage = Math.min(player.money.max(1).log10() / getQCGoal() * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Percentage to Quantum Challenge goal')
	} else {
		var gqkLog = gqk.log2()
		var goal = Math.pow(2,Math.ceil(Math.log10(gqkLog) / Math.log10(2)))
		var percentage = Math.min(gqkLog / goal * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to "+shortenDimensions(Decimal.pow(2,goal))+" QK gain")
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
function quantumReset(force, auto, challid, implode=false) {
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !player.masterystudies
	var pc=challid-8
	if (implode) {
		showDimTab("antimatterdimensions")
		showChallengesTab("challenges")
		showInfTab("preinf")
		showEternityTab("timestudies", true)
		if (document.getElementById("quantumtab").style.display=="none") showTab("dimensions")
	}
	if (!quantumed) {
		quantumed=true
		document.getElementById("quantumtabbtn").style.display=""
		document.getElementById("quarks").style.display=""
		document.getElementById("galaxyPoints2").className = "GP"
		document.getElementById("sacpos").className = "sacpos"
		if (player.masterystudies) {
			document.getElementById("quantumstudies").style.display=""
			document.getElementById("quarksAnimBtn").style.display="inline-block"
		}
	}
	document.getElementById("quantumbtn").style.display="none"
	if (!force) {
		for (var i=player.quantum.last10.length-1; i>0; i--) {
			player.quantum.last10[i] = player.quantum.last10[i-1]
		}
		var qkGain=quarkGain()
		player.quantum.last10[0] = [player.quantum.time,qkGain]
		if (player.quantum.best>player.quantum.time) {
			player.quantum.best=player.quantum.time
			updateSpeedruns()
			if (speedrunMilestonesReached>23) giveAchievement("And the winner is...")
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
		}
		player.quantum.times++
		if (!inQC(6)) player.quantum.quarks = player.quantum.quarks.plus(qkGain);
		if (!inQC(4)) if (player.meta.resets<1) giveAchievement("Infinity Morals")
	}
	var oheHeadstart = speedrunMilestonesReached > 0
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
	} else player.quantum.gluons = 0;
	if (player.tickspeedBoosts !== undefined) player.tickspeedBoosts = 0
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	else player.infinityPoints = new Decimal(0);
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
		infinityPoints: player.infinityPoints,
		infinitied: 0,
		infinitiedBank: headstart || player.achievements.includes("ng3p15") ? player.infinitiedBank : 0,
		totalTimePlayed: player.totalTimePlayed,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: oheHeadstart ? 4 : 0,
		dbPower: player.dbPower ? new Decimal(1) : undefined,
		tickspeedBoosts: player.tickspeedBoosts,
		galaxies: oheHeadstart ? 1 : 0,
		galacticSacrifice: resetGalacticSacrifice(),
		tickDecrease: 0.9,
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
		eternities: headstart ? player.eternities : speedrunMilestonesReached > 17 ? 1e13 : oheHeadstart ? 2e4 : 0,
		thisEternity: 0,
		bestEternity: headstart ? player.bestEternity : 9999999999,
		eternityUpgrades: isRewardEnabled(3) ? [1,2,3,4,5,6] : [],
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
		timestudy: speedrunMilestonesReached > 10 ? player.timestudy : {
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
		respecOptions: player.masterystudies ? {time:false,mastery:false} : undefined,
		eternityBuyer: oheHeadstart ? player.eternityBuyer : {
			limit: new Decimal(0),
			isOn: false
		},
		eterc8ids: 50,
		eterc8repl: 40,
		dimlife: true,
		dead: true,
		dilation: {
			studies: isRewardEnabled(4) ? (speedrunMilestonesReached > 5 ? [1,2,3,4,5,6] : [1]) : [],
			active: false,
			tachyonParticles: new Decimal(0),
			dilatedTime: new Decimal(speedrunMilestonesReached>21 && isRewardEnabled(4)?1e100:0),
			totalTachyonParticles: new Decimal(0),
			bestTP: player.dilation.bestTP,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: speedrunMilestonesReached > 5 && isRewardEnabled(4) ? [4,5,6,7,8,9,"ngpp1","ngpp2"] : [],
			rebuyables: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
			}
		},
		why: player.why,
		options: player.options,
		meta: {
			antimatter: new Decimal(speedrunMilestonesReached > 18 ? 1e25 : 100),
			bestAntimatter: headstart ? player.meta.bestAntimatter : new Decimal(speedrunMilestonesReached > 18 ? 1e25 : 100),
			resets: speedrunMilestonesReached>26 ? 4 : 0,
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
		masterystudies: player.masterystudies ? (speedrunMilestonesReached > 10 && isRewardEnabled(4) ? player.masterystudies : []) : undefined,
		autoEterOptions: player.autoEterOptions,
		galaxyMaxBulk: player.galaxyMaxBulk,
		quantum: player.quantum,
		old: player.masterystudies ? inQC(0) : undefined,
		aarexModifications: player.aarexModifications
	};
	if (player.challenges.includes("challenge1")) player.money = new Decimal(100)
	if (player.achievements.includes("r37")) player.money = new Decimal(1000)
	if (player.achievements.includes("r54")) player.money = new Decimal(2e5)
	if (player.achievements.includes("r55")) player.money = new Decimal(1e10)
	if (player.achievements.includes("r78")) player.money = new Decimal(1e25)
	if (player.galacticSacrifice && !oheHeadstart) player.autobuyers[12]=13
	player.challenges=challengesCompletedOnEternity()
	if (headstart) for (ec=1;ec<13;ec++) player.eternityChalls['eterc'+ec]=5
	else if (isRewardEnabled(3)) for (ec=1;ec<15;ec++) player.eternityChalls['eterc'+ec] = 5
	if (player.masterystudies) {
		giveAchievement("Sub-atomic")
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
			if (player.quantum.pairedChallenges.current>0) {
				if (player.quantum.pairedChallenges.current>player.quantum.pairedChallenges.completed) {
					player.quantum.challenges[qc1]=2
					player.quantum.challenges[qc2]=2
					player.quantum.electrons.mult+=0.5
					player.quantum.pairedChallenges.completed=player.quantum.pairedChallenges.current
					if (player.quantum.pairedChallenges.current>3) giveAchievement("Twice in the row")
				}
			} else if (!player.quantum.challenges[qc1]&&intensity>0) {
				player.quantum.challenges[qc1]=1
				player.quantum.electrons.mult+=0.25
			}
			if (player.quantum.pairedChallenges.respec) {
				player.quantum.electrons.mult-=player.quantum.pairedChallenges.completed*0.5
				player.quantum.pairedChallenges = {
					order: {},
					current: 0,
					completed: 0,
					respec: false
				}
				for (qc=1;qc<9;qc++) player.quantum.challenges[qc]=1
				document.getElementById("respecPC").className="storebtn"
			}
		}
		if (pc>0) {
			player.quantum.pairedChallenges.current=pc
			player.quantum.challenge=player.quantum.pairedChallenges.order[pc]
		} else if (challid>0) {
			player.quantum.pairedChallenges.current=0
			player.quantum.challenge=[challid]
		} else {
			player.quantum.electrons.amount=new Decimal(0)
			player.quantum.electrons.sacGals=0
			player.quantum.pairedChallenges.current=0
			player.quantum.challenge=[]
		}
		player.quantum.replicants.amount = new Decimal(0)
		player.quantum.replicants.requirement = new Decimal("1e3000000")
		player.quantum.replicants.quarks = new Decimal(0)
		player.quantum.replicants.quantumFood += Math.round(player.quantum.replicants.workerProgress.toNumber()*3)
		player.quantum.replicants.workerProgress = new Decimal(0)
		player.quantum.replicants.eggonProgress = new Decimal(0)
		player.quantum.replicants.eggons = new Decimal(0)
		player.quantum.replicants.babyProgress = new Decimal(0)
		player.quantum.replicants.babies = new Decimal(0)
		player.quantum.replicants.growupProgress = new Decimal(0)
		updateColorCharge()
		updateGluons()
		updateElectrons()
		updateQuantumChallenges()
		updateReplicants()
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
		if (speedrunMilestonesReached>10&&isRewardEnabled(4)) player.dilation.upgrades.push(10)
		if (speedrunMilestonesReached>13&&isRewardEnabled(4)) for (i=3;i<7;i++) player.dilation.upgrades.push("ngpp"+i)
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
	}
	if (speedrunMilestonesReached<1) {
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
	ipMultPower=GUBought("gb3")?2.3:2
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
		document.getElementById("break").textContent = "BREAK INFINITY"
		document.getElementById("abletobreak").style.display = "block"
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
	document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
	updateEternityUpgrades()
	document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
	updateTickSpeed();
	playerInfinityUpgradesOnEternity()
	document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	updateEternityChallenges()
	updateTheoremButtons()
	updateTimeStudyButtons()
	updateDilationUpgradeCosts()
	drawStudyTree()
	if (!isRewardEnabled(4)) if (document.getElementById("dilation").style.display=="block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display=="block")
	if (speedrunMilestonesReached < 14 || !isRewardEnabled(4)) {
		document.getElementById("masterystudyunlock").style.display = "none"
		document.getElementById("respecOptions").style.display = "none"
		document.getElementById("respecOptions2").style.display = "none"
		document.getElementById("emperorstudies").style.display = "none"
		if (document.getElementById("metadimensions").style.display == "block") showDimTab("antimatterdimensions")
		if (document.getElementById("masterystudies").style.display=="block") showEternityTab("timestudies", document.getElementById("eternitystore").style.display=="block")
		if (document.getElementById("quantumchallenges").style.display == "block") showChallengesTab("normalchallenges")
		if (document.getElementById("electronstabbtn").style.display == "block"||document.getElementById("replicantstabbtn").style.display == "block") showQuantumTab("uquarks")
	}
	drawMasteryTree()
	Marathon2 = 0;
	document.getElementById("quantumConfirmBtn").style.display = "inline-block"
}

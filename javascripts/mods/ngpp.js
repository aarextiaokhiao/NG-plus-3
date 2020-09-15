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

// v2.3
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
	if (player.aarexModifications.quantumConf&&!(auto||force)) if (!confirm(player.masterystudies?"Quantum will reset everything Eternity resets, and "+(headstart?"other things like Dilation":"including Time Studies, Eternity Challenges, Dilation, "+(tmp.ngp3?"Meta Dimensions, and Mastery Studies":"and Meta Dimensions"))+". You will gain a quark and unlock various upgrades.":"WARNING! Quantum wasn't fully implemented in NG++, so if you go Quantum now, you will gain quarks, but they'll have no use. Everything up to and including Eternity features will be reset.")) return
	if (!quantumed) if (!confirm("Are you sure you want to do this? You will lose everything you have!")) return
	var pc = challid - 8
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
					if (tmp.qu.bigRip.conf && !auto) if (!confirm("Big Ripping the universe starts PC6+8, however, only dilation upgrades boost dilation except upgrades that multiply TP gain until you buy the eleventh upgrade, certain resources like Time Theorems and Time Studies will be changed, and only certain upgrades work in Big Rip. If you can beat PC6+8, you will be able to unlock the next layer. You can give your Time Theorems and Time Studies back by undoing Big Rip.")) return
				} else if (pc > 0) {
					if (player.options.challConf || (tmp.qu.pairedChallenges.completions.length < 1 && !ghostified)) if (!confirm("You will start a Quantum Challenge, but as a Paired Challenge, there will be two challenges at once. Completing it boosts the rewards of the Quantum Challenges that you chose in this Paired Challenge. You will keep electrons & sacrificed galaxies, but they don't work in this Challenge.")) return
				} else if (player.options.challConf || (QCIntensity(1) == 0 && !ghostified)) if (!confirm("You will do a Quantum reset, but you will not gain quarks, you keep your electrons & sacrificed galaxies, and you can't buy electron upgrades. You have to reach the set goal of antimatter while getting the meta-antimatter requirement to Quantum to complete this challenge. Electrons and banked eternities have no effect in Quantum Challenges and your electrons and sacrificed galaxies don't reset until you end the challenge.")) return
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
	updateTemp()
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
		if (tmp.newNGP3E) exp += 0.05
		if (player.achievements.includes("ng3p28")) exp *= 1.01

		var EPBonus = Math.pow(Math.max(player.eternityPoints.log10() / 1e6, 1), exp) - 1
		if (EPBonus > 1e4) EPBonus = 1e4 * Math.sqrt(EPBonus / 1e4)
		if (EPBonus > 1e5) EPBonus = 1e5 * Math.sqrt(EPBonus / 1e5)
		
		log += EPBonus 
		log += Math.log10(getQCtoQKEffect())
		log += player.quantum.bigRip.spaceShards.plus(1).log10()
		if (player.achievements.includes("ng3p65")) log += player.ghostify.ghostlyPhotons.enpowerments * (Math.min(20, player.ghostify.ghostlyPhotons.enpowerments))
	}

	var dlog = Math.log10(log)
	let start = 4 // Starts at e10k.
	if (!(player.aarexModifications.ngumuV || player.aarexModifications.nguepV)) start = 5
	if (dlog > start) {
		let capped = Math.floor(Math.log10(Math.max(dlog + 2 - start, 1)) / Math.log10(2))
		dlog = (dlog - Math.pow(2, capped) + 2 - start) / Math.pow(2, capped) + capped - 1 + start
		log = Math.pow(10, dlog)
	}

	log += getQuarkMult().log10()

	return Decimal.pow(10, log).floor()
}

let getQuarkMult = function () {
	x = Decimal.pow(2, tmp.qu.multPower.total)
	if (player.achievements.includes("ng3p93")) x = x.times(500)
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
			var msg = "The quantum " + (i == 0 ? '1 quantum' : (i + 1) + ' quantums') + " ago took " + timeDisplayShort(tmp.qu.last10[i][0], false, 3)
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
		var tempstring = "(" + shorten(qkpm) + " QK/min)"
		averageQk = tempQK
		if (qkpm < 1) tempstring = "(" + shorten(qkpm * 60) + " QK/hour"
		document.getElementById("averageQuantumRun").textContent = "Average time of the last " + listed + " Quantums: "+ timeDisplayShort(tempTime, false, 3) + " | Average QK gain: " + shortenDimensions(tempQK) + " QK. " + tempstring
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
		document.getElementById("progresspercent").setAttribute('ach-tooltip', "Percentage to Ghostly Photons")
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
function quantumReset(force, auto, challid, bigRip, implode = false) {
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
	} //bounds the else statement to if (force)
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
	
	doQuantumResetStuff(bigRip, challid)
	if (ghostified && bigRip) {
		player.timeDimension8 = {
			cost: timeDimCost(8, 1),
			amount: new Decimal(1),
			power: new Decimal(1),
			bought: 1
		}
	}
		
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
				var qc1st = Math.min(qc1, qc2)
				var qc2st = Math.max(qc1, qc2)
				if (qc1st == qc2st) console.log("there is some issue, you have assigned a QC twice (QC" + qc1st + ")")
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
		replicantsResetOnQuantum(challid)
		nanofieldResetOnQuantum()
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
	if (speedrunMilestonesReached < 1 && !bigRip) {
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
	updateAutobuyers()
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
	var shortenedIP = shortenDimensions(player.infinityPoints)
	document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenedIP + "</span> Infinity points."
	document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenedIP + "</span> Infinity points."
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
	setInitialMoney()
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

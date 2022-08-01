// v2.9
quantumed = false
function quantum(auto, force, challid, bigRip = false, quick) {
	if (player.masterystudies !== undefined) if (!auto && !force && brSave.active) force = true
	if (!(isQuantumReached()||force)||implosionCheck) return
	var headstart = aarMod.newGamePlusVersion > 0 && !tmp.ngp3
	if (aarMod.quantumConf&&!(auto||force)) if (!confirm(player.masterystudies?"Quantum will reset everything Eternity resets, and "+(headstart?"other things like Dilation":"including Time Studies, Eternity Challenges, Dilation, "+(tmp.ngp3?"Meta Dimensions, and Mastery Studies":"and Meta Dimensions"))+". You will gain a quark and unlock various upgrades.":"WARNING! Quantum wasn't fully implemented in NG++, so if you go Quantum now, you will gain quarks, but they'll have no use. Everything up to and including Eternity features will be reset.")) return
	if (!quantumed) if (!confirm("Are you sure you want to do this? You will lose everything you have!")) return
	var pc = challid - 8
	if (tmp.ngp3) {
		tmp.preQCMods=quSave.qcsMods.current
		quSave.qcsMods.current=[]
		if (challid > 0) {
			var abletostart=false
			if (pc > 0) {
				if (quSave.pairedChallenges.order[pc]) if (quSave.pairedChallenges.order[pc].length > 1) abletostart = true
			} else if (!pcFocus) abletostart = true
			if (abletostart) {
				if (pc > 0) if (quSave.pairedChallenges.completed + 1 < pc) return
				if (quSave.electrons.amount < getQCCost(challid) || !inQC(0)) return
				if (bigRip) {
					var qc1 = quSave.pairedChallenges.order[pc][0]
					var qc2 = quSave.pairedChallenges.order[pc][1]
					var qc1st = Math.min(qc1, qc2)
					var qc2st = Math.max(qc1, qc2)
					if (qc1st != 6 || qc2st != 8) return
					if (brSave.conf && !auto) if (!confirm("Big Ripping the universe starts PC6+8, however, only dilation upgrades boost dilation except upgrades that multiply TP gain until you buy the eleventh upgrade, certain resources like Time Theorems and Time Studies will be changed, and only certain upgrades work in Big Rip. If you can beat PC6+8, you will be able to unlock the next layer. You can give your Time Theorems and Time Studies back by undoing Big Rip.")) return
				} else if (pc > 0) {
					if (player.options.challConf || (quSave.pairedChallenges.completions.length < 1 && !ghostified)) if (!confirm("You will start a Quantum Challenge, but as a Paired Challenge, there will be two challenges at once. Completing it boosts the rewards of the Quantum Challenges that you chose in this Paired Challenge. You will keep electrons & sacrificed galaxies, but they don't work in this Challenge.")) return
				} else if (player.options.challConf || (QCIntensity(1) == 0 && !ghostified)) if (!confirm("You will do a Quantum reset, but you will not gain quarks, you keep your electrons & sacrificed galaxies, and you can't buy electron upgrades. You have to reach the set goal of antimatter while getting the meta-antimatter requirement to Quantum to complete this challenge. Electrons and banked eternities have no effect in Quantum Challenges and your electrons and sacrificed galaxies don't reset until you end the challenge.")) return
				quSave.electrons.amount -= getQCCost(challid)
				if (!quick) for (var m = 0; m < qcm.on.length; m++) if (ranking >= qcm.reqs[qcm.on[m]] || !qcm.reqs[qcm.on[m]]) quSave.qcsMods.current.push(qcm.on[m])
			} else if (pcFocus && pc < 1) {
				if (!assigned.includes(challid)) {
					if (!quSave.pairedChallenges.order[pcFocus]) quSave.pairedChallenges.order[pcFocus]=[challid]
					else {
						quSave.pairedChallenges.order[pcFocus].push(challid)
						showChallengesTab("pChalls")
						pcFocus=0
					}
					updateQuantumChallenges()
				}
				return
			} else if (pcFocus != pc) {
				pcFocus = pc
				showChallengesTab("quantumchallenges")
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
	return E_pow(Number.MAX_VALUE, tmp.ngp3 ? 1.4 : 1)
}

function isQuantumReached() {
	return player.money.log10() >= getQCGoal() && (player.meta.antimatter.max(hasAch("ng3p76") ? player.meta.bestOverQuantums : 0).gte(getQuantumReq(undefined, tmp.ngp3 && brSave.active))) && (!player.masterystudies || ECComps("eterc14")) && quarkGain().gt(0)
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
		if (quSave.challengeRecords[i]) {
			temp += quSave.challengeRecords[i]
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

function getEPtoQKExp(){
	let exp = 0.6
	if (tmp.newNGP3E) exp += 0.05
	if (hasAch("ng3p28")) exp *= 1.05
	return exp
}

function getEPtoQKMult(){
	var EPBonus = Math.pow(Math.max(player.eternityPoints.log10() / 1e6, 1), getEPtoQKExp()) - 1
	return EPBonus 
}

function getNGP3p1totalQKMult(){
	let log = 0
	if (quSave.upgrades.includes("rg5")) log += 1
	if (hasAch("ng3p16")) log += getEPtoQKMult()
	if (hasAch("ng3p33")) log += Math.log10(getQCtoQKEffect())
	if (hasAch("ng3p53")) log += brSave && brSave.spaceShards.plus(1).log10()
	if (hasAch("ng3p65")) log += getTotalRadioactiveDecays()
	if (hasAch("ng3p85")) log += Math.pow(ghSave.ghostlyPhotons.enpowerments, 2)
	return log
}

function quarkGain() {
	let ma = player.meta.antimatter.max(1)
	if (!tmp.ngp3) return pow10(ma.log(10) / Math.log10(Number.MAX_VALUE) - 1).floor()
	
	if (!quantumed) return E(1)
	if (ghSave.milestones) ma = player.meta.bestAntimatter.max(1)

	let log = (ma.log10() - 379.4) / (hasAch("ng3p63") ? 279.8 : 280)
	let logBoost = tmp.ngp3l ? 1.2 : 2
	let logBoostExp = tmp.ngp3l ? 2 : 1.5
	if (log > logBoost) log = Math.pow(log / logBoost, logBoostExp) * logBoost
	if (log > 738 && !hasNU(8)) log = Math.sqrt(log * 738)
	if (!tmp.ngp3l) log += getNGP3p1totalQKMult()

	var dlog = Math.log10(log)
	let start = 5
	if (dlog > start) {
		let capped = Math.floor(Math.log10(Math.max(dlog + 2 - start, 1)) / Math.log10(2))
		dlog = (dlog - Math.pow(2, capped) + 2 - start) / Math.pow(2, capped) + capped - 1 + start
		log = Math.pow(10, dlog)
	}

	log += getQuarkMult().log10()

	return pow10(log).floor()
}

function getQuarkMult() {
	x = pow2(quSave.multPower.total)
	if (hasAch("ng3p93")) x = x.times(500)
	return x
}

function toggleQuantumConf() {
	aarMod.quantumConf = !aarMod.quantumConf
	el("quantumConfirmBtn").textContent = "Quantum confirmation: " + (aarMod.quantumConf ? "ON" : "OFF")
}

var averageQk = E(0)
var bestQk
function updateLastTenQuantums() {
	if (!player.meta) return
	var listed = 0
	var tempTime = E(0)
	var tempQK = E(0)
	for (var i = 0; i < 10; i++) {
		if (quSave.last10[i][1].gt(0)) {
			var qkpm = quSave.last10[i][1].dividedBy(quSave.last10[i][0] / 600)
			var tempstring = shorten(qkpm) + " QK/min"
			if (qkpm<1) tempstring = shorten(qkpm*60) + " QK/hour"
			var msg = "The quantum " + (i == 0 ? '1 quantum' : (i + 1) + ' quantums') + " ago took " + timeDisplayShort(quSave.last10[i][0], false, 3)
			if (quSave.last10[i][2]) {
				if (typeof(quSave.last10[i][2]) == "number") " in Quantum Challenge " + quSave.last10[i][2]
				else msg += " in Paired Challenge " + quSave.last10[i][2][0] + " (QC" + quSave.last10[i][2][1][0] + "+" + quSave.last10[i][2][1][1] + ")"
			}
			msg += " and gave " + shortenDimensions(quSave.last10[i][1]) +" QK. "+ tempstring
			el("quantumrun"+(i+1)).textContent = msg
			tempTime = tempTime.plus(quSave.last10[i][0])
			tempQK = tempQK.plus(quSave.last10[i][1])
			bestQk = quSave.last10[i][1].max(bestQk)
			listed++
		} else el("quantumrun" + (i + 1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempQK = tempQK.dividedBy(listed)
		var qkpm = tempQK.dividedBy(tempTime / 600)
		var tempstring = "(" + shorten(qkpm) + " QK/min)"
		averageQk = tempQK
		if (qkpm < 1) tempstring = "(" + shorten(qkpm * 60) + " QK/hour"
		el("averageQuantumRun").textContent = "Average time of the last " + listed + " Quantums: "+ timeDisplayShort(tempTime, false, 3) + " | Average QK gain: " + shortenDimensions(tempQK) + " QK. " + tempstring
	} else el("averageQuantumRun").textContent = ""
}

//v2.9014
function doQuantumProgress() {
	var quantumReq = getQuantumReq()
	var id = 1
	if (quantumed && tmp.ngp3) {
		if (brSave.active) {
			var gg = getGHPGain()
			if (player.meta.antimatter.lt(quantumReq)) id = 1
			else if (!beSave.unlocked) id = 4
			else if (!ghostified || player.money.lt(getQCGoal(undefined, true)) || Decimal.lt(gg, 2)) id = 5
			else if (ghSave.neutrinos.boosts > 8 && hasNU(12) && !ghSave.ghostlyPhotons.unl) id = 7
			else id = 6
		} else if (inQC(0)) {
			var gqk = quarkGain()
			if (player.meta.antimatter.gte(quantumReq) && Decimal.gt(gqk, 1)) id = 3
		} else if (player.money.lt(pow10(getQCGoal())) || player.meta.antimatter.gte(quantumReq)) id = 2
	}
	var className = id > 4 ? "ghostifyProgress" : "quantumProgress"
	if (el("progressbar").className != className) el("progressbar").className = className
	if (id == 1) {
		var percentage = Math.min(player.meta.antimatter.max(1).log10() / quantumReq.log10() * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip', (player.masterystudies ? "Meta-antimatter p" : "P") + 'ercentage to quantum')
	} else if (id == 2) {
		var percentage = Math.min(player.money.max(1).log10() / getQCGoal() * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip','Percentage to Quantum Challenge goal')
	} else if (id == 3) {
		var gqkLog = gqk.log2()
		var goal = Math.pow(2, Math.ceil(Math.log10(gqkLog) / Math.log10(2)))
		if (!quSave.reachedInfQK) goal = Math.min(goal, 1024)
		var percentage = Math.min(gqkLog / goal * 100, 100).toFixed(2) + "%"
		if (goal > 512 && !quSave.reachedInfQK) percentage = Math.min(quSave.quarks.add(gqk).log2() / goal * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		if (goal > 512 && !quSave.reachedInfQK) el("progresspercent").setAttribute('ach-tooltip', "Percentage to new QoL features (" + shorten(Number.MAX_VALUE) + " QK)")
		else el("progresspercent").setAttribute('ach-tooltip', "Percentage to " + shortenDimensions(pow2(goal)) + " QK gain")
	} else if (id == 4) {
		var percentage = Math.min(player.eternityPoints.max(1).log10() / 12.15, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip','Eternity points percentage to Break Eternity')
	} else if (id == 5) {
		var percentage = Math.min(brSave.bestThisRun.max(1).log10() / getQCGoal(undefined, true) * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip','Percentage to Ghostify')
	} else if (id == 6) {
		var ggLog = gg.log2()
		var goal = Math.pow(2, Math.ceil(Math.log10(ggLog) / Math.log10(2)))
		var percentage = Math.min(ggLog / goal * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip', "Percentage to " + shortenDimensions(pow2(goal)) + " GHP gain")
	} else if (id == 7) {
		var percentage = Math.min(brSave.bestThisRun.max(1).log10() / 6000e4, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip', "Percentage to Photons")
	}
}

//v2.90142
function quantumReset(force, auto, challid, bigRip, implode = false) {
	var headstart = aarMod.newGamePlusVersion > 0 && !tmp.ngp3
	var pc = challid - 8
	if (implode && speedrunMilestonesReached < 1) {
		showTab("dimensions")
		showDimTab("antimatterdimensions")
		showChallengesTab("challenges")
		showInftab("preinf")
		showEternityTab("timestudies", true)
	}
	if (!quantumed) {
		quantumed=true
		ngp3_feature_notify("qu")
		el("quantumtabbtn").style.display=""
		el("quarks").style.display=""
		el("galaxyPoints2").className = "GP"
		el("sacpos").className = "sacpos"
		if (tmp.ngp3) {
			el("bestAntimatterType").textContent = "Your best meta-antimatter for this quantum"
			el("quarksAnimBtn").style.display="inline-block"
		}
		if (isEmptiness) {
			showTab("dimensions")
			isEmptiness = false
			el("quantumtabbtn").style.display = "inline-block"
			if (ghostified) el("ghostifytabbtn").style.display = "inline-block"
		}
	}
	el("quantumbtn").style.display = "none"
	el("bigripbtn").style.display = "none"
	el("ghostifybtn").style.display = "none"
	updateBankedEter()
	if (force) {
		if (bigRip && hasAch("ng3p73")) player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())
		else bankedEterGain = 0
	} else {
		for (var i = quSave.last10.length - 1; i > 0; i--) {
			quSave.last10[i] = quSave.last10[i - 1]
		}
		var qkGain = quarkGain()
		var array = [quSave.time, qkGain]
		if (!inQC(0)) {
			if (quSave.pairedChallenges.current > 0) {
				array.push([quSave.pairedChallenges.current, quSave.challenge])
			} else {
				array.push(quSave.challenge[0])
			}
		}
		quSave.last10[0] = array
		if (quSave.best > quSave.time) {
			quSave.best = quSave.time
			updateSpeedruns()
		}
		quSave.times++
		if (quSave.times >= 1e4) giveAchievement("Prestige No-lifer")
		if (!inQC(6)) {
			quSave.quarks = quSave.quarks.add(qkGain)
			if (!tmp.ngp3 || ghSave.milestones < 8) quSave.quarks = quSave.quarks.round()
			if (tmp.ngp3 && quSave.quarks.gte(Number.MAX_VALUE) && !quSave.reachedInfQK) {
				quSave.reachedInfQK = true
				if (!ghostified) {
					el("welcome").style.display = "flex"
					el("welcomeMessage").innerHTML = "Congratulations for getting " + shorten(Number.MAX_VALUE) + " quarks! You have unlocked new QoL features, like quantum autobuyer modes, assign all, and auto-assignation!"
					el('assignAll').style.display = ""
					el('autoAssign').style.display = ""
					el('autoAssignRotate').style.display = ""
				}
				el('toggleautoquantummode').style.display=""
			}
		}
		if (!inQC(4)) if (player.meta.resets < 1) giveAchievement("Infinity Morals")
		if (player.dilation.rebuyables[1] + player.dilation.rebuyables[2] + player.dilation.rebuyables[3] + player.dilation.rebuyables[4] < 1 && player.dilation.upgrades.length < 1) giveAchievement("Never make paradoxes!")
		if (hasAch("ng3p73")) player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())
	} //bounds the else statement to if (force)
	var oheHeadstart = bigRip ? hasRipUpg(2) : speedrunMilestonesReached > 0
	var keepABnICs = oheHeadstart || bigRip || hasAch("ng3p51")
	var oldTime = quSave.time
	quSave.time = 0
	updateQuarkDisplay()
	el("galaxyPoints2").innerHTML = "You have <span class='GPAmount'>0</span> Galaxy points."
	if (tmp.ngp3) {
		if (!quSave.gluons.rg) {
			quSave.gluons = {
				rg: E(0),
				gb: E(0),
				br: E(0)
			}
		}
		updateQuantumWorth()
		if (bigRip && !hasRipUpg(12)) {
			brSave.storedTS={
				tt: player.timestudy.theorem,
				studies: player.timestudy.studies,
				boughtA: Decimal.div(player.timestudy.amcost, "1e20000").log("1e20000"),
				boughtI: player.timestudy.ipcost.log("1e100"),
				boughtE: Math.round(player.timestudy.epcost.log(2))
			}
			if (player.eternityChallUnlocked > 12) brSave.storedTS.tt += masteryStudies.costs.ec[player.eternityChallUnlocked]
			else brSave.storedTS.tt += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
			for (var s = 0; s < player.masterystudies.length; s++) if (player.masterystudies[s].indexOf("t") == 0) brSave.storedTS.studies.push(parseInt(player.masterystudies[s].split("t")[1]))
		}
		if (bigRip != brSave && brSave.active) switchAB()
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
		if (!bigRip && brSave.active) if (player.galaxies == 9 && player.replicanti.galaxies == 9 && player.timeDimension4.amount.round().eq(9)) giveAchievement("We can really afford 9.")
	} else quSave.gluons = 0;
	if (player.tickspeedBoosts !== undefined) player.tickspeedBoosts = 0
	if (hasAch("r104")) player.infinityPoints = E(2e25);
	else player.infinityPoints = E(0);
	if (tmp.ngp3) {
		if (!bigRip && brSave.active && force) {
			brSave.spaceShards = brSave && brSave.spaceShards.add(getSpaceShardsGain())
			if (ghSave.milestones < 8) brSave.spaceShards = brSave && brSave.spaceShards.round()
			if (player.matter.gt("1e5000")) giveAchievement("Really?")
		}
		else if (inQC(6) && inQC(8) && player.money.gt(quSave.pairedChallenges.pc68best)) {
			quSave.pairedChallenges.pc68best = player.money
			el("bpc68").textContent = shortenMoney(player.money)
		}
	}
	var oldMoney = player.money
	var dilTimes = player.dilation.times
	var bhd = []
	var bigRipChanged = tmp.ngp3 && bigRip != brSave && brSave.active
	var turnSomeOn = !bigRip || hasRipUpg(1)
	if (aarMod.ngudpV) for (var d = 0; d < 4; d++) bhd[d]=Object.assign({}, player["blackholeDimension" + (d + 1)])
	
	doQuantumResetStuff(bigRip, challid)
	if (ghostified && bigRip) {
		player.timeDimension8 = {
			cost: timeDimCost(8, 1),
			amount: E(1),
			power: E(1),
			bought: 1
		}
	}
		
	player.money = onQuantumAM()
	player.resets = beSave.upgrades.includes(11)?5:4
	if (player.galacticSacrifice && !keepABnICs) player.autobuyers[12] = 13
	if (player.tickspeedBoosts !== undefined && !keepABnICs) player.autobuyers[13] = 14
	player.challenges = challengesCompletedOnEternity(bigRip)
	if (bigRip && ghSave.milestones > 9 && aarMod.ngudpV) for (var u = 7; u < 10; u++) player.eternityUpgrades.push(u)
	if (isRewardEnabled(11) && (bigRip && !hasRipUpg(12))) {
		if (player.eternityChallUnlocked > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.eternityChallUnlocked]
		else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
	}
	player.eternityChallUnlocked = 0
	if (headstart) for (var ec = 1; ec < 13; ec++) player.eternityChalls['eterc' + ec]=5
	else if (isRewardEnabled(3) && !bigRip) for (ec = 1; ec < 15; ec++) player.eternityChalls['eterc' + ec] = 5
	player.dilation.totalTachyonParticles = player.dilation.tachyonParticles
	if (player.exdilation != undefined) {
		if (player.eternityUpgrades.length) for (var u = 7; u < 10; u++) player.eternityUpgrades.push(u)
		for (var d = 1; d < (aarMod.nguspV ? 9 : 5); d++) player["blackholeDimension" + d] = hasAch("ng3p67") && aarMod.ngudpV && !aarMod.ngumuV ? bhd[d - 1] : {
			cost: blackholeDimStartCosts[d],
			amount: E(0),
			power: E(1),
			bought: 0
		}
		if (speedrunMilestonesReached < 3) {
			el("blackholediv").style.display = "none"
			el("blackholeunlock").style.display = "inline-block"
		}
	}
	if (tmp.ngp3) {
		ipMultPower = GUBought("gb3") ? 2.3 : player.masterystudies.includes("t241") ? 2.2 : 2
		player.dilation.times = 0
		if (!force) {
			var u = quSave.usedQuarks
			var g = quSave.gluons
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
				if (qc1st == qc2st) console.log("There is an issue, you have assigned a QC twice (QC" + qc1st + ")")
				//them being the same should do something lol, not just this
				var pcid = qc1st * 10 + qc2st
				if (quSave.pairedChallenges.current > quSave.pairedChallenges.completed) {
					quSave.challenges[qc1] = 2
					quSave.challenges[qc2] = 2
					quSave.electrons.mult += 0.5
					quSave.pairedChallenges.completed = quSave.pairedChallenges.current
					if (pcid == 68 && quSave.pairedChallenges.current == 1 && oldMoney.e >= 1.65e9) giveAchievement("Back to Challenge One")
					if (quSave.pairedChallenges.current == 4) giveAchievement("Twice in a row")
				}
				if (quSave.pairedChallenges.completions[pcid] === undefined) quSave.pairedChallenges.completions[pcid] = quSave.pairedChallenges.current
				else quSave.pairedChallenges.completions[pcid] = Math.min(quSave.pairedChallenges.current, quSave.pairedChallenges.completions[pcid])
				if (dilTimes == 0) {
					if (quSave.qcsNoDil["pc" + pcid] === undefined) quSave.qcsNoDil["pc" + pcid] = quSave.pairedChallenges.current
					else quSave.qcsNoDil["pc" + pcid] = Math.min(quSave.pairedChallenges.current,quSave.qcsNoDil["pc" + pcid])
				}
				for (let m = 0; m < tmp.preQCMods.length; m++) recordModifiedQC("pc" + pcid, quSave.pairedChallenges.current, tmp.preQCMods[m])
				if (quSave.pairedChallenges.fastest[pcid] === undefined) quSave.pairedChallenges.fastest[pcid] = oldTime
				else quSave.pairedChallenges.fastest[pcid] = quSave.pairedChallenges.fastest[pcid] = Math.min(quSave.pairedChallenges.fastest[pcid], oldTime)
			} else if (intensity) {
				if (!quSave.challenges[qc1]) {
					quSave.challenges[qc1] = 1
					quSave.electrons.mult += 0.25
				}
				if (quSave.challengeRecords[qc1] == undefined) quSave.challengeRecords[qc1] = oldTime
				else quSave.challengeRecords[qc1] = Math.min(quSave.challengeRecords[qc1], oldTime)
				if (dilTimes == 0) quSave.qcsNoDil["qc" + qc1] = 1
				for (let m = 0; m < tmp.preQCMods.length; m++) recordModifiedQC("qc" + qc1, 1, tmp.preQCMods[m])
			}
			if (quSave.pairedChallenges.respec) {
				quSave.electrons.mult -= quSave.pairedChallenges.completed * 0.5
				quSave.pairedChallenges = {
					order: {},
					current: 0,
					completed: 0,
					completions: quSave.pairedChallenges.completions,
					fastest: quSave.pairedChallenges.fastest,
					respec: false
				}
				for (qc = 1; qc < 9; qc++) quSave.challenges[qc] = 1
				el("respecPC").className = "storebtn"
			}
			if (quSave.autoOptions.assignQK) assignAll(true)
			if (ghostified) ghSave.neutrinos.generationGain = ghSave.neutrinos.generationGain % 3 + 1
			if (isAutoGhostActive(4) && ghSave.automatorGhosts[4].mode != "t") rotateAutoUnstable()
		}//bounds if (!force)
		quSave.pairedChallenges.current = 0
		if (challid == 0) {
			quSave.electrons.amount = 0
			quSave.electrons.sacGals = 0
			quSave.challenge = []
			tmp.aeg = 0
		} else if (pc < 1) quSave.challenge = [challid]
		else {
			quSave.challenge = quSave.pairedChallenges.order[pc]
			quSave.pairedChallenges.current = pc
		}
		updateInQCs()
		if ((!challid && ghSave.milestones < 6) || bigRip != brSave && brSave.active) quSave.replicants.amount = E(0)
		replicantsResetOnQuantum(challid)
		nanofieldResetOnQuantum()
		if (brSave.active != bigRip) {
			if (bigRip) {
				for (var u = 0; u < brSave.upgrades.length; u++) tweakBigRip(brSave.upgrades[u])
				if (brSave.times < 1) el("bigRipConfirmBtn").style.display = "inline-block"
				brSave.times++
				brSave.bestThisRun = player.money
				giveAchievement("To the new dimension!")
				if (beSave && beSave.break) beSave.did = true
			} else {
				if (!hasRipUpg(1) && oheHeadstart) {
					player.infmultbuyer = true
					for (var d=0;d<8;d++) player.infDimBuyers[d] = true
				}
				if (isRewardEnabled(11)) unstoreTT()
			}
			if (ghostified) ghSave.neutrinos.generationGain = ghSave.neutrinos.generationGain % 3 + 1
			brSave.active = bigRip
		}
		el("metaAntimatterEffectType").textContent = inQC(3) ? "multiplier on all Infinity Dimensions" : "extra multiplier per Dimension Boost"
		updateColorCharge()
		updateColorDimPowers()
		updateGluonsTabOnUpdate()
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
		el('dilationmode').style.display = speedrunMilestonesReached > 4 ? "block" : "none"
		el('rebuyupgauto').style.display = speedrunMilestonesReached > 6 ? "" : "none"
		el('toggleallmetadims').style.display = speedrunMilestonesReached > 7 ? "" : "none"
		el('metaboostauto').style.display = speedrunMilestonesReached > 14 ? "" : "none"
		el("autoBuyerQuantum").style.display = speedrunMilestonesReached > 22 ? "" : "none"
		if (speedrunMilestonesReached < 6 || !isRewardEnabled(4)) {
			el("qctabbtn").style.display = "none"
			el("electronstabbtn").style.display = "none"
		}
		if (bigRip ? hasRipUpg(12) : isRewardEnabled(11)&&isRewardEnabled(4)) player.dilation.upgrades.push(10)
		else quSave.wasted = (!isRewardEnabled(11) || bigRip) && brSave.storedTS === undefined
		if (bigRip ? hasRipUpg(12) : speedrunMilestonesReached > 13 && isRewardEnabled(4)) {
			for (let i = (player.exdilation != undefined ? 1 : 3); i < 7; i++) if (i != 2 || !aarMod.ngudpV) player.dilation.upgrades.push((i > 2 ? "ngpp" : "ngud") + i)
			if (aarMod.nguspV) {
				for (var i = 1; i < 3; i++) player.dilation.upgrades.push("ngusp" + i)
				for (var i = 4; i < 23; i++) if (player.dilation.upgrades.includes(getDilUpgId(i))) player.dilation.autoUpgrades.push(i)
				updateExdilation()
			}
		}
		quSave.notrelative = true
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		if (!bigRip && !beSave.unlocked && el("breakEternity").style.display == "block") showEternityTab("timestudies", el("eternitystore").style.display!="block")
		delete quSave.autoECN
	} // bounds if tmp.ngp3
	if (speedrunMilestonesReached < 1 && !bigRip) {
		el("infmultbuyer").textContent = "Autobuy IP mult OFF"
		el("togglecrunchmode").textContent = "Auto crunch mode: amount"
		el("limittext").textContent = "Amount of IP to wait until reset:"
		el("epmult").innerHTML = "You gain 5 times more EP<p>Currently: " + shortenDimensions(player.epmult) + "x<p>Cost: " + shortenDimensions(player.epmultCost) + " EP"
	}
	if (!oheHeadstart) {
		player.autobuyers[9].bulk = Math.ceil(player.autobuyers[9].bulk)
		el("bulkDimboost").value = player.autobuyers[9].bulk
	}
	setInitialDimensionPower()
	resetUP()
	if (oheHeadstart) player.replicanti.amount = E(1)
	player.replicanti.galaxies = 0
	updateRespecButtons()
	if (hasAch("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	updateAutobuyers()
	if (hasAch("r85")) player.infMult = player.infMult.times(4);
	if (hasAch("r93")) player.infMult = player.infMult.times(4);
	if (hasAch("r104")) player.infinityPoints = E(2e25);
	resetInfDimensions();
	updateChallenges();
	updateNCVisuals()
	updateChallengeTimes()
	updateLastTenRuns()
	updateLastTenEternities()
	updateLastTenQuantums()
	if (!hasAch("r133") && !bigRip) {
		var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
		for (var i = 0; i < infchalls.length; i++) infchalls[i].style.display = "none"
	}
	GPminpeak = E(0)
	IPminpeak = E(0)
	EPminpeakType = 'normal'
	EPminpeak = E(0)
	QKminpeak = E(0)
	QKminpeakValue = E(0)
	updateAutobuyers()
	updateMilestones()
	resetTimeDimensions()
	if (oheHeadstart) {
		el("replicantiresettoggle").style.display = "inline-block"
		skipResets()
	} else {
		hideDimensions()
		if (tmp.ngp3) el("infmultbuyer").textContent="Max buy IP mult"
		else el("infmultbuyer").style.display = "none"
		hideMaxIDButton()
		el("replicantidiv").style.display="none"
		el("replicantiunlock").style.display="inline-block"
		el("replicantiresettoggle").style.display = "none"
		delete player.replicanti.galaxybuyer
	}
	var shortenedIP = shortenDimensions(player.infinityPoints)
	el("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenedIP + "</span> Infinity points."
	el("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenedIP + "</span> Infinity points."
	el("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
	el("eternityPoints2").style.display = "inline-block"
	el("eternitystorebtn").style.display = "inline-block"
	updateEternityUpgrades()
	el("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
	hideDimensions()
	tmp.tickUpdate = true
	playerInfinityUpgradesOnEternity()
	el("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	el("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
	updateEternityChallenges()
	updateTheoremButtons()
	updateTimeStudyButtons()
	updateDilationUpgradeCosts()
	drawStudyTree()
	if (!isRewardEnabled(4) || (bigRip ? !hasRipUpg(10) : false)) if (el("dilation").style.display=="block") showEternityTab("timestudies", el("eternitystore").style.display=="block")
	el("masterystudyunlock").style.display = (bigRip ? !hasRipUpg(12) : speedrunMilestonesReached < 14 || !isRewardEnabled(4)) ? "none" : ""
	if (speedrunMilestonesReached < 14 || !isRewardEnabled(4)) {
		el("anttabs").style.display = "none"
		NF.shown()
		el("edtabbtn_dim").style.display = "none"
		el("todtabbtn").style.display = "none"
		el("riptabbtn").style.display = "none"
		updateUnlockedMasteryStudies()
		if (el("quantumchallenges").style.display == "block") showChallengesTab("normalchallenges")
		if (el("electrons").style.display == "block" || el("replicants").style.display == "block" || el("nanofield").style.display == "block") showQuantumTab("uquarks")
	}
	let keepMastery = bigRip ? isBigRipUpgradeActive(12) : speedrunMilestonesReached > 13 && isRewardEnabled(4)
	el("respecMastery").style.display = keepMastery ? "block" : "none"
	el("respecMastery2").style.display = keepMastery ? "block" : "none"
	if (!keepMastery) {
		performedTS = false
		if (el("metadimensions").style.display == "block") showDimTab("antimatterdimensions")
		if (el("masterystudies").style.display == "block") showEternityTab("timestudies", el("eternitystore").style.display!="block")
	}
	if (inQC(8) && (el("infinitydimensions").style.display == "block" || (el("timedimensions").style.display == "block" && !tmp.be))) showDimTab("antimatterdimensions")
	if ((bigRip ? !isBigRipUpgradeActive(2) : speedrunMilestonesReached < 2) && el("eternitychallenges").style.display == "block") showChallengesTab("normalchallenges")
	drawMasteryTree()
	Marathon2 = 0;
	setInitialMoney()
	el("quantumConfirmBtn").style.display = "inline-block"
}

function updateQuarkDisplay() {
	let msg = ""
	if (quantumed) {
		msg += "You have <b class='QKAmount'>"+shortenDimensions(quSave.quarks)+"</b> "	
		if (tmp.ngp3&&player.masterystudies.includes("d14")) msg += " QK and <b class='SSAmount'>" + shortenDimensions(brSave.spaceShards) + "</b> Space Shard" + (brSave.spaceShards.round().eq(1) ? "" : "s")
		else msg += "quark" + (quSave.quarks.round().eq(1) ? "" : "s")
		msg += "."
	}
	el("quarks").innerHTML=msg
}

function metaReset2() {
	if (tmp.ngp3 && brSave.active) ghostify()
	else quantum(false, false, 0)
}

// v2.9
quantumed = false
function quantum(auto, force, qc, bigRip = false) {
	if (bigRipped()) force = true
	if (!force && !isQuantumReached()) return
	if (implosionCheck) return

	if (!mod.ngp3) {
		alert("You've reached the end of NG++. To continue playing, please convert your save to NG+++ in Options > Save tab.")
		return
	}

	var headstart = aarMod.newGamePlusVersion > 0 && !mod.ngp3
	if (!(auto||force) && aarMod.quantumConf && !confirm("Quantum will reset everything up to and including Eternity features will be reset, in exchange of anti-quarks. Ready?")) return
	if (!quantumed && !confirm("Are you sure you want to do this? You will lose everything you have!")) return

	if (qc) {
		let cost = getQCIdCost(qc.qc)
		if (quSave.electrons.amount < cost) return

		let conf = player.options.challConf
		if (auto) conf = false
		if (qc.pc) {
			if (quSave.pairedChallenges.completed < qc.pc - 1) return
			if (bigRip && !hasAch("ng3p41")) conf = true
			if (!bigRip && quSave.pairedChallenges.completions.length < 1 && !ghostified) conf = true
			if (conf) {
				if (bigRip && confirm("Big Ripping the universe starts PC6+8, but with various changes. You can give your Time Theorems and Time Studies back by undoing Big Rip. If you can beat this, you will be able to unlock the next layer.")) return
				if (!bigRip && confirm("You will start a Quantum Challenge, but as a Paired Challenge, there will be two challenges at once. Completing it boosts the rewards of the Quantum Challenges that you chose in this Paired Challenge. You will keep electrons & sacrificed galaxies, but they don't work in this Challenge.")) return
			}
		} else {
			if (QCIntensity(1) == 0 && !ghostified) conf = true
			if (conf && confirm("You will do a Quantum reset, but you will not gain quarks, you keep your electrons & sacrificed galaxies, and you can't buy electron upgrades. You have to reach the set goal of antimatter while getting the meta-antimatter requirement to Quantum to complete this challenge. Electrons and banked eternities have no effect in Quantum Challenges and your electrons and sacrificed galaxies don't reset until you end the challenge.")) return
		}

		quSave.electrons.amount -= cost
	}

	var implode = !auto && !force && isAnimationOn("quantum")
	if (implode) {
		quantumAni(function(){
			if (!speedrunMilestonesReached) {
				showDimTab("antimatterdimensions")
				showChallengesTab("challenges")
				showInftab("preinf")
				showEternityTab("timestudies")
				showTab("dimensions")
			}
			doQuantum(force, auto, qc)
		})
	} else doQuantum(force, auto, qc)
}

function getQuantumReq() {
	return E_pow(Number.MAX_VALUE, mod.ngp3 ? 1.4 : 1)
}

function isQuantumReached() {
	if (!mod.ngpp) return

	let ma = player.meta.antimatter.max(hasAch("ng3p76") ? player.meta.bestOverQuantums : 0)
	let got = ma.gte(getQuantumReq())
	if (mod.ngp3) {
		got = got && quarkGain().gt(0)
		if (inQC(0)) got = got && ECComps("eterc14")
		if (!inQC(0)) got = got && player.money.gte(pow10(getQCGoal(null, bigRipped())))
	}
	return got
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
	var time = getQCtotalTime()
	var ret = 1 + 192 * 3600 * 10 / time
	if (ret > 999) ret = 333 * Math.log10(ret + 1)
	return ret
}

function getEPtoQKExp(){
	let exp = 0.6
	if (mod.p3ep) exp += 0.05
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
	if (hasAch("ng3p65")) log += getRadioactiveDecays('r') * 3
	return log
}

function quarkGain() {
	let ma = player.meta.antimatter.max(1)
	if (!mod.ngp3) return pow10(ma.log(10) / Math.log10(Number.MAX_VALUE) - 1).floor()

	if (!quantumed) return E(1)
	ma = player.meta.bestAntimatter.max(1)

	let log = (ma.log10() - 379.4) / (hasAch("ng3p63") ? 279.8 : 280)
	let logBoost = 2
	let logBoostExp = 1.5
	if (log > logBoost) log = Math.pow(log / logBoost, logBoostExp) * logBoost
	if (log > 738 && !hasNU(8)) log = Math.sqrt(log * 738)

	log += quSave.multPower * Math.log10(2)
	log += getNGP3p1totalQKMult()
	if (hasAch("ng3p93")) log += Math.log10(500)

	return pow10(log).floor()
}

function getQuarkMult() {
	x = E_pow(2, quSave.multPower)
	return x
}

function toggleQuantumConf() {
	aarMod.quantumConf = !aarMod.quantumConf
	el("quantumConfirmBtn").textContent = "Quantum confirmation: " + (aarMod.quantumConf ? "ON" : "OFF")
}

var averageQk = E(0)
var bestQk
function updateLastTenQuantums() {
	if (!mod.ngpp) return
	var listed = 0
	var tempTime = E(0)
	var tempQK = E(0)
	for (var i = 0; i < 10; i++) {
		if (quSave.last10[i][1].gt(0)) {
			var qkpm = quSave.last10[i][1].dividedBy(quSave.last10[i][0] / 600)
			var tempstring = shorten(qkpm) + " aQ/min"
			if (qkpm<1) tempstring = shorten(qkpm*60) + " aQ/hour"
			var msg = "The quantum " + (i == 0 ? '1 quantum' : (i + 1) + ' quantums') + " ago took " + timeDisplayShort(quSave.last10[i][0], false, 3)
			if (quSave.last10[i][2]) {
				if (typeof(quSave.last10[i][2]) == "number") " in Quantum Challenge " + quSave.last10[i][2]
				else msg += " in Paired Challenge " + quSave.last10[i][2][0] + " (QC" + quSave.last10[i][2][1][0] + "+" + quSave.last10[i][2][1][1] + ")"
			}
			msg += " and gave " + shortenDimensions(quSave.last10[i][1]) +" anti-Quarks. "+ tempstring
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
		var tempstring = "(" + shorten(qkpm) + " aQ/min)"
		averageQk = tempQK
		if (qkpm < 1) tempstring = "(" + shorten(qkpm * 60) + " aQ/hour"
		el("averageQuantumRun").textContent = "Average time of the last " + listed + " Quantums: "+ timeDisplayShort(tempTime, false, 3) + " | Average aQ gain: " + shortenDimensions(tempQK) + " aQ. " + tempstring
	} else el("averageQuantumRun").textContent = ""
}

//v2.9014
function doQuantumProgress() {
	var quantumReq = getQuantumReq()
	var id = 1
	if (quantumed && mod.ngp3) {
		if (bigRipped()) {
			var gg = getGHPGain()
			if (player.meta.antimatter.lt(quantumReq)) id = 1
			else if (!beSave.unlocked) id = 4
			else if (!ghostified || player.money.lt(getQCGoal(undefined, true)) || Decimal.lt(gg, 2)) id = 5
			else if (ghSave.neutrinos.boosts > 8 && hasNU(12) && !PHOTON.unlocked()) id = 7
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
function doQuantum(force, auto, qc = {}) {
	//to-do: clean up the mess
	//ng+3 only

	//setup
	let dilTimes = player.dilation.times
	let bigRip = qc.br
	let oldBigRip = bigRipped()

	if (hasAch("ng3p73")) player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())
	if (!force) {
		//Stats
		player.eternitiesBank = nA(player.eternitiesBank, bankedEterGain)
		updateBankedEter()

		quSave.times++
		if (quSave.times >= 1e4) giveAchievement("Prestige No-lifer")

		if (quSave.best > quSave.time) {
			quSave.best = quSave.time
			updateSpeedruns()
		}
	
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
		updateLastTenQuantums()

		//Quarks
		if (!inQC(6)) quSave.quarks = quSave.quarks.add(quarkGain()).round()
		if (!quantumed) {
			quantumed = true
			ngp3_feature_notify("qu")
			el("quarks").style.display=""
			el("bestAntimatterType").textContent = "Your best meta-antimatter for this quantum"
			if (isEmptiness) showTab("dimensions")
		}

		//Gluons
		if (!quSave.gluons.rg) {
			quSave.gluons = {
				rg: E(0),
				gb: E(0),
				br: E(0)
			}
		}
		convertAQToGluons()
		updateQuantumWorth()

		if (quSave.autoOptions.assignQK) assignAll(true)
		updateColorCharge()
	}

	//Big Rip
	if (oldBigRip) {
		brSave.spaceShards = brSave.spaceShards.add(getSpaceShardsGain()).round()
		if (player.matter.gt("1e5000")) giveAchievement("Really?")
	}
	if (bigRip && !hasRipUpg(12)) {
		brSave.storedTS = {
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
	if (bigRip != oldBigRip) {
		if (bigRip) {
			brSave.times++
			brSave.bestThisRun = E(0)
			giveAchievement("To the new dimension!")
			if (brokeEternity()) beSave.did = true
		} else {
			if (!hasRipUpg(1)) {
				player.infmultbuyer = true
				for (var d=0;d<8;d++) player.infDimBuyers[d] = true
			}
			if (isRewardEnabled(11)) unstoreTT()
		}
		switchAB()
	}
	brSave.active = bigRip

	//Quantum Challenges
	if (!force) {
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
		}
	}
	if (inQC(6) && inQC(8) && player.money.gt(quSave.pairedChallenges.pc68best) && !bigRipped()) {
		quSave.pairedChallenges.pc68best = player.money
		el("bpc68").textContent = shortenMoney(player.money)
	}
	quSave.challenge = qc.qc || []
	quSave.pairedChallenges.current = qc.pc || 0
	updateInQCs()
	updateQCTimes()
	updateQuantumChallenges()
	updatePCCompletions()

	//Achievements
	if (!force) {
		if (!inQC(4) && player.meta.resets < 1) giveAchievement("Infinity Morals")
		if (player.dilation.rebuyables[1] + player.dilation.rebuyables[2] + player.dilation.rebuyables[3] + player.dilation.rebuyables[4] < 1 && player.dilation.upgrades.length < 1) giveAchievement("Never make paradoxes!")
	}
	if (!bigRip && oldBigRip && player.galaxies == 9 && player.replicanti.galaxies == 9 && player.timeDimension4.amount.round().eq(9)) giveAchievement("We can really afford 9.")

	//Finally, do a Quantum reset!
	var oldTime = quSave.time
	doReset("qu", auto)

	el("quantumbtn").style.display = "none"
	el("bigripbtn").style.display = "none"
	el("ghostifybtn").style.display = "none"

	//Post-Quantum
	if (bigRip) for (var u = 0; u < brSave.upgrades.length; u++) tweakBigRip(brSave.upgrades[u])
	if (ghostified) ghSave.neutrinos.generationGain = ghSave.neutrinos.generationGain % 3 + 1
}

RESETS.qu = {
	doReset(order) {
		let bigRip = bigRipped()
		let qc = !inQC(0)

		player.infinitiedBank = 0
		player.eternities = speedrunMilestonesReached >= 1 ? 2e4 : mod.ngp3 ? 0 : 100
		player.lastTenEternities = [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]]
		updateLastTenEternities()

		player.eternityPoints = E(0)
		if (getEternitied() < 100) player.eternityBuyer.isOn = false
		player.eternityBuyer.statBeforeDilation = 0
		completelyResetTimeDimensions()
		if (bigRip && hasAch("ng3p58")) player.timeDimension8 = {
			cost: timeDimCost(8, 1),
			amount: E(1),
			power: E(2),
			bought: 1
		}

		player.respec = false
		if (bigRip ? !hasRipUpg(12) : !isRewardEnabled(11)) player.timestudy = {
			theorem: 0,
			amcost: E("1e20000"),
			ipcost: E(1),
			epcost: E(1),
			studies: [],
		}

		if (bigRip ? !hasRipUpg(12) : !isRewardEnabled(3)) player.eternityUpgrades = []
		player.epmult = E(1)
		player.epmultCost = E(5)

		if (bigRip ? !hasRipUpg(2) : !isRewardEnabled(3)) {
			player.eternityChalls = {}
			updateEternityChallenges()
		}
		player.eternityChallGoal = E(Number.MAX_VALUE)
		player.currentEternityChall = ""
		player.eternityChallUnlocked = isRewardEnabled(11) ? player.eternityChallUnlocked : 0
		player.etercreq = 0

		player.dilation.tachyonParticles = E(0)
		player.dilation.dilatedTime = E(0)
		player.dilation.studies = (bigRip ? hasRipUpg(10) : isRewardEnabled(4)) ? (
			(bigRip ? hasRipUpg(12) : speedrunMilestonesReached >= 4) ? player.dilation.studies : [1]
		) : []
		resetDilation(order)

		doMetaDimensionsReset(order, qc)
		if (mod.ngud) {
			player.exdilation = {
				unspent: E(0),
				spent: {
					1: E(0),
					2: E(0),
					3: E(0),
					4: E(0)
				},
				times: 0
			}
			resetBlackhole()
		}

		//NG+3
		if (speedrunMilestonesReached >= 4 && !isRewardEnabled(4)) {
			for (var s = 0; s < player.masterystudies.length; s++) {
				if (player.masterystudies[s].indexOf("t") >= 0) player.timestudy.theorem += masteryStudies.costs.time[player.masterystudies[s].split("t")[1]]
				else player.timestudy.theorem += masteryStudies.costs.dil[player.masterystudies[s].split("d")[1]]
			}
		}
		if (isRewardEnabled(11) && (bigRip && !hasRipUpg(12))) {
			if (player.eternityChallUnlocked > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.eternityChallUnlocked]
			else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
		}

		player.masterystudies = bigRip && !hasRipUpg(12) ? ["d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14"] : speedrunMilestonesReached >= 16 && isRewardEnabled(11) ? player.masterystudies : []
		player.respecMastery = false

		ipMultPower = GUBought("gb3") ? 2.3 : hasMasteryStudy("t241") ? 2.2 : 2
		if (!qc) {
			quSave.electrons.amount = 0
			quSave.electrons.sacGals = 0
			if (speedrunMilestonesReached < 25 && player.quantum.autoOptions.sacrifice) toggleAutoQuantumContent('sacrifice')
		}
		replicantsResetOnQuantum(qc)
		nanofieldResetOnQuantum()

		quSave.time = 0
		QKminpeak = E(0)
		QKminpeakValue = E(0)
		el("metaAntimatterEffectType").textContent = inQC(3) ? "multiplier on all Infinity Dimensions" : "extra multiplier per Dimension Boost"

		if (!auto) {
			updateMilestones()
			updateMasteryStudyCosts()
			drawMasteryTree()
		}
	}
}

function updateQuarkDisplay() {
	let msg = ""
	if (quantumed) {
		msg += "You have <b class='QKAmount'>"+shortenDimensions(quSave.quarks)+"</b> "	
		if (hasMasteryStudy("d14")) msg += " QK and <b class='SSAmount'>" + shortenDimensions(brSave.spaceShards) + "</b> Space Shard" + (brSave.spaceShards.round().eq(1) ? "" : "s")
		else msg += "anti-quark" + (quSave.quarks.round().eq(1) ? "" : "s")
		msg += "."
	}
	el("quarks").innerHTML=msg
}

function metaReset2() {
	if (bigRipped()) ghostify()
	else quantum(false, false, 0)
}

/*
	ANIMATIONS
	Credit to MrRedShark77
	http://github.com/MrRedShark77/NG-plus-3CR/
*/
function quantumAni(def) {
    let q = el('quani')
	implosionCheck = 1

	el("container").style.animation = "qu 2s 1"
    q.style.opacity = 0.5
    setTimeout(()=>{
		if (def) def()
        q.style.opacity = 0
    },1000)
    setTimeout(()=>{
		el("container").style.animation = ""
		implosionCheck = 0
    },2000)
}
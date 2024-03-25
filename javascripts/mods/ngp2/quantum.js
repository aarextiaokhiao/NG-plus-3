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
		let req = getQCIdCost(qc.qc)
		if (quSave.electrons.amount < req) return

		let conf = !auto && player.options.challConf
		if (qc.pc) {
			if (quSave.pairedChallenges.completed < qc.pc - 1) return
			if (!hasAch("ng3p41")) conf = true
			if (conf) {
				if (bigRip && !confirm("Big Ripping the universe starts PC6+8, but with various changes. You can give your Time Theorems and Time Studies back by undoing Big Rip. If you can beat this, you will be able to unlock the next layer.")) return
				if (!bigRip && !confirm("You will start a Quantum Challenge, but as a Paired Challenge, there will be two challenges at once. Completing it boosts the rewards of the Quantum Challenges that you chose in this Paired Challenge. You will keep positrons & sacrificed galaxies, but they don't work in this Challenge.")) return
			}
		} else {
			if (QCIntensity(1) == 0 && !ghostified) conf = true
			if (conf && !confirm(`You have to reach the set goal of antimatter while getting ${shorten(getQuantumReq())} meta-antimatter to complete this challenge. Positrons and Banked Eternities have no effect in Quantum Challenges. You keep Positrons & Discharged Galaxies, but you can't buy Positron Upgrades.`)) return
		}
	}

	var implode = !auto && !force && isAnimationOn("quantum")
	if (implode) {
		quantumAni(_ => doQuantum(force, auto, qc))
	} else doQuantum(force, auto, qc)
}

function getQuantumReq() {
	return E_pow(Number.MAX_VALUE, mod.ngp3 ? 1.4 : 1)
}

function isQuantumReached() {
	if (!mod.ngpp) return

	let ma = player.meta.bestAntimatter
	let got = ma.gte(getQuantumReq())
	if (mod.ngp3) {
		if (notInQC()) got = got && ECComps("eterc14")
		if (inAnyQC()) got = got && player.money.gte(getQCGoal())
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
	for (var i = 1; i <= 8; i++){
		if (quSave.challengeRecords[i]) temp += quSave.challengeRecords[i]
		else return Infinity
	}
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
	if (hasGluonUpg("rg", 5)) log += 1
	if (hasAch("ng3p16")) log += getEPtoQKMult()
	if (hasAch("ng3p33")) log += Math.log10(getQCtoQKEffect())
	if (hasAch("ng3p53")) log += brSave && brSave.spaceShards.add(1).log10()
	if (hasAch("ng3p65")) log += getRadioactiveDecays() * 3
	if (hasAch("ng3p93")) log += Math.log10(500)
	return log
}

function quarkGain() {
	let ma = player.meta.antimatter.max(1)
	if (!mod.ngp3) return pow10(ma.log(10) / Math.log10(Number.MAX_VALUE) - 1).floor()

	if (!isQuantumReached()) return E(0)
	if (!quantumed) return E(1)
	ma = player.meta.bestAntimatter.max(1)

	let log = (ma.log10() - 379.4) / (hasAch("ng3p63") ? 279.8 : 280)
	let logBoost = 2
	let logBoostExp = 1.5
	if (log > logBoost) log = Math.pow(log / logBoost, logBoostExp) * logBoost
	if (log > 738 && !hasNU(8)) log = Math.sqrt(log * 738)

	log += getQuarkMult().log10()
	log += getNGP3p1totalQKMult()

	return pow10(log).floor()
}

function getQuarkMult() {
	return pow2(quSave.multPower)
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
			tempTime = tempTime.add(quSave.last10[i][0])
			tempQK = tempQK.add(quSave.last10[i][1])
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

//v2.90142
function doQuantum(force, auto, qc = {}) {
	// NG+3 Only

	//setup
	let dilTimes = player.dilation.times
	let bigRip = qc.br
	let oldBigRip = bigRipped()

	if (!force) {
		//Stats
		player.eternitiesBank = nA(player.eternitiesBank, bankedEterGain)

		quSave.times++
		if (quSave.times >= 1e4) giveAchievement("Prestige No-lifer")

		if (quSave.best > quSave.time) {
			quSave.best = quSave.time
			updateSpeedruns(true)
		}
	
		for (var i = quSave.last10.length - 1; i > 0; i--) {
			quSave.last10[i] = quSave.last10[i - 1]
		}
		var qkGain = quarkGain()
		var array = [quSave.time, qkGain]
		if (inAnyQC()) {
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
			notifyFeature("qu")
			el("quarks").style.display=""
			el("bestAntimatterType").textContent = "Your best meta-antimatter for this Quantum"
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
	if (force && hasAch("ng3p72")) player.eternitiesBank = nA(player.eternitiesBank, bankedEterGain)

	// Big Rip
	if (oldBigRip) brSave.spaceShards = brSave.spaceShards.add(getSpaceShardsGain()).round()
	if (bigRip && !hasRipUpg(12)) {
		brSave.storedTS = {
			tt: player.timestudy.theorem,
			studies: player.timestudy.studies,
			boughtA: Decimal.div(player.timestudy.amcost, "1e20000").log("1e20000"),
			boughtI: player.timestudy.ipcost.log("1e100"),
			boughtE: Math.round(player.timestudy.epcost.log(2))
		}
		if (player.eternityChallUnlocked > 12) brSave.storedTS.tt += MTS.costs.ec[player.eternityChallUnlocked]
		else brSave.storedTS.tt += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
		for (var s = 0; s < player.masterystudies.length; s++) if (player.masterystudies[s].indexOf("t") == 0) brSave.storedTS.studies.push(parseInt(player.masterystudies[s].split("t")[1]))
	}
	if (bigRip != oldBigRip) {
		if (bigRip) {
			brSave.times++
			brSave.bestThisRun = E(0)
			if (brokeEternity()) beSave.did = true
		} else {
			brSave.banked_replicanti = E(1)
			if (hasBLMilestone(0)) brSave.banked_replicanti = player.replicanti.amount

			if (!hasRipUpg(1)) {
				player.infmultbuyer = true
				for (var d=0;d<8;d++) player.infDimBuyers[d] = true
			}
			if (isRewardEnabled(11)) unstoreTT()
		}
		switchAB(bigRip)
	}
	brSave.active = bigRip

	// Paired Challenges
	let qcs = tmp.qu.chal.in
	let intensity = qcs.length
	let oldMoney = player.money
	var oldTime = quSave.time
	if (hasMasteryStudy("d9")) {
		if (!force && intensity == 2) {
			let qc1 = Math.min(qcs[0], qcs[0])
			let qc2 = Math.max(qcs[1], qcs[1])
			var pcid = qc1 * 10 + qc2
			if (qc1 == qc2) {
				console.log("There is an issue, you have assigned a QC twice (QC" + qc1 + ")")
				$.notify("Somehow, you have assigned the same Quantum Challenge twice; this Paired Challenge attempt will not count.", "error")
			} else {
				quSave.pairedChallenges.completed = Math.max(quSave.pairedChallenges.completed, quSave.pairedChallenges.current)
				var in68 = pcid == 68 || pcid == 86 // each pair will work

				if (in68 && quSave.pairedChallenges.current == 1 && oldMoney.e >= 1.65e9) giveAchievement("Back to Challenge One")
				if (quSave.pairedChallenges.current == 4) giveAchievement("Twice in a row")
	
				quSave.pairedChallenges.completions[pcid] = Math.min(quSave.pairedChallenges.completions[pcid] || 1/0, quSave.pairedChallenges.current)
				quSave.pairedChallenges.fastest[pcid] = Math.min(quSave.pairedChallenges.fastest[pcid] || 1/0, oldTime)

				if (inQC(6) && inQC(8) && !bigRipped()) quSave.pairedChallenges.pc68best = player.money.max(quSave.pairedChallenges.pc68best)
			}
		}
		quSave.pairedChallenges.current = qc.pc || 0
		updatePCCompletions()
	}

	// Quantum Challenges
	if (hasMasteryStudy("d8")) {
		if (!force && inAnyQC()) {
			for (let qc of qcs) {
				quSave.challenges[qc] = Math.max(intensity, quSave.challenges[qc] || 0)
				quSave.challengeRecords[qc] = Math.min(quSave.challengeRecords[qc] || 1/0, quSave.time)
			}
		}

		quSave.challenge = qc.qc || []
		updateQCTimes()
		updateQuantumChallenges()
	}

	//Achievements
	if (!force) {
		if (player.meta.resets == 0) giveAchievement("Infinity Morals")
		if (player.dilation.rebuyables[1] + player.dilation.rebuyables[2] + player.dilation.rebuyables[3] + player.dilation.rebuyables[4] < 1 && player.dilation.upgrades.length < 1) giveAchievement("Never make paradoxes!")
	}
	if (!bigRip && oldBigRip && player.galaxies == 9 && player.replicanti.galaxies == 9 && player.timeDimension4.amount.round().eq(9)) giveAchievement("We can really afford 9.")

	//Finally, do a Quantum reset!
	doReset("qu", auto)

	//Post-Quantum
	if (bigRip) {
		for (var u = 0; u < brSave.upgrades.length; u++) tweakBigRip(brSave.upgrades[u])
		player.replicanti.amount = E(brSave.banked_replicanti || 1)
	}
	if (ghostified) ghSave.neutrinos.generationGain = ghSave.neutrinos.generationGain % 3 + 1
}

function updateQuarkDisplay() {
	let msg = ""
	if (quantumed) {
		msg = aarMod.netQuarkTop ? getQuantumWorthMsg() : getQuarkMsg()
		if (hasMasteryStudy("d14")) msg += "<br><b class='SSAmount'>" + shortenDimensions(brSave.spaceShards) + "</b> Space Shard" + (brSave.spaceShards.round().eq(1) ? "" : "s")
		else msg = "You have " + msg + "."

		el("quarks2").innerHTML = getQuarkMsg()
	}
	el("quarks").innerHTML = msg
}

function getQuarkMsg() {
	return "<b class='QKAmount'>"+shortenDimensions(quSave.quarks)+"</b> anti-Quark" + (quSave.quarks.round().eq(1) ? "" : "s")
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
var quantumChallenges = {
	costs:[0, 16750, 19100, 21500,  24050,  25900,  28900, 31300, 33600],
	goals:[0, 6.65e9, 7.68e10, 4.525e10, 5.325e10, 1.344e10, 5.61e8, 6.254e10, 2.925e10]
}

function updateQuantumChallenges() {
	if (!hasMasteryStudy("d8")) return

	for (var qc = 1; qc <= 8; qc++) {
		var property = "qc" + qc
		el(property + "div").style.display = (qc < 2 || QCIntensity(qc - 1)) ? "inline-block" : "none"
		el(property).textContent = pcFocus ? "Choose" : inQC(qc) ? "Running" : QCIntensity(qc) ? "Completed" : "Start"
		el(property).className = pcFocus ? "challengesbtn" : inQC(qc) ? "onchallengebtn" : QCIntensity(qc) ? "completedchallengesbtn" : "challengesbtn"
		el(property + "cost").textContent = isQCFree() ? "" : "Req: " + getFullExpansion(quantumChallenges.costs[qc]) + " Positrons"
		el(property + "goal").textContent = "Goal: " + shortenCosts(getQCGoal(qc)) + " antimatter"
	}

	updateQCDisplaysSpecifics()
	updatePairedChallenges()
}

function updateQCDisplaysSpecifics(){
	el("qc2reward").textContent = Math.round(tmp.qu.chal.reward[2] * 100 - 100)
	el("qc7desc").textContent = "Dimensions and Tickspeed scale at " + shorten(Number.MAX_VALUE) + "x. Per-10 Dimension multipliers and meta-antimatter boost to dimension boosts do nothing."
	el("qc7reward").textContent = (100 - tmp.qu.chal.reward[7] * 100).toFixed(2)
	el("qc8reward").textContent = tmp.qu.chal.reward[8]
}

function inQC(num) {
	return tmp.qu.chal.in.includes(num)
}
function inAnyQC() {
	return !inQC(0)
}
function notInQC() {
	return inQC(0)
}

function updateInQCs() {
	tmp.qu.chal.in = [0]
	if (!quSave?.challenge) return

	data = quSave.challenge
	if (typeof(data) == "number") data = [data]
	if (!data.length) data = [0]
	tmp.qu.chal.in = data
}

function getQCIdGoal(qcs, bigRip) {
	let mult = 1
	if (hasAch("ng3p96") && !bigRip) mult *= 0.95
	if (qcs.includes(1) && qcs.includes(3)) mult *= 1.6
	if (qcs.includes(2) && qcs.includes(6)) mult *= 1.7
	if (qcs.includes(3) && qcs.includes(7)) mult *= 2.68
	if (qcs.includes(3) && qcs.includes(6)) mult *= 3

	let r = 0
	if (!qcs[0] || !qcs[1]) r = quantumChallenges.goals[qcs[0] || qcs[1]] * mult
	else r = quantumChallenges.goals[qcs[0]] * quantumChallenges.goals[qcs[1]] / 1e11 * mult * mult
	return pow10(r)
}

function getQCGoal(num, bigRip) {
	if (!mod.ngp3) return 0

	if (num == undefined) return getQCIdGoal(tmp.qu.chal.in, bigRipped())
	if (num > 8) return getQCIdGoal(quSave.pairedChallenges.order[num - 8], bigRip)
	if (num <= 8) return getQCIdGoal([num], bigRip)
}

function QCIntensity(num) {
	return quSave?.challenges?.[num] || 0
}

function updateQCTimes() {
	if (!mod.ngp3) return
	var temp = 0
	var tempcounter = 0
	for (var i = 1; i < 9; i++) {
		setAndMaybeShow("qctime" + i, quSave.challengeRecords[i], '"Quantum Challenge ' + i + ' time record: "+timeDisplayShort(quSave.challengeRecords[' + i + '], false, 3)')
		if (quSave.challengeRecords[i]) {
			temp+=quSave.challengeRecords[i]
			tempcounter++
		}
	}
	setAndMaybeShow("qctimesum", tempcounter > 1, '"The sum of your completed Quantum Challenge time records is "+timeDisplayShort(' + temp + ', false, 3)')
}

let qcRewards = {
	effects: {
		1: function(comps) {
			if (comps == 0) return E(1)
			let base = getDimensionFinalMultiplier(1).mul(getDimensionFinalMultiplier(2)).max(1).log10()
			let exp = 0.225 + comps * .025
			return pow10(Math.pow(base, exp) / 200)
		},
		2: function(comps) {
			if (comps == 0) return 1
			return 1.2 + comps * 0.2
		},
		3: function(comps) {
			if (comps == 0) return 1
			let ipow = player.infinityPower.plus(1).log10()
			let log = Math.sqrt(ipow / 2e8) 
			if (comps >= 2) log += Math.pow(ipow / 1e9, 4/9 + comps/9)

			log = softcap(log, "qc3reward")
			return pow10(log)
		},
		4: function(comps) {
			if (comps == 0) return 1
			let mult = player.meta[2].amount.mul(player.meta[4].amount).mul(player.meta[6].amount).mul(player.meta[8].amount).max(1)
			if (comps <= 1) return E_pow(10 * comps, Math.sqrt(mult.log10()) / 10)
			return mult.pow(comps / 150)
			
		},
		5: function(comps) {
			if (comps == 0) return 0
			return Math.log10(1 + player.resets) * Math.pow(comps, 0.4)
		},
		6: function(comps) {
			if (comps == 0) return 1
			return player.achPow.pow(comps * 2 - 1)
		},
		7: function(comps) {
			if (comps == 0) return 1
			return Math.pow(0.975, comps)
		},
		8: function(comps) {
			if (comps == 0) return 1
			return comps + 2
		}
	}
}

function updateQCRewardsTemp() {
	tmp.qu.chal.reward = {}
	for (var c = 1; c <= 8; c++) tmp.qu.chal.reward[c] = qcRewards.effects[c](QCIntensity(c))
}

function isQCFree() {
	return hasAch("ng3p55")
}

function getQCCost(num) {
	return getQCIdCost(num > 8 ? quSave.pairedChallenges.order[num - 8] : [num])
}

function getQCIdCost(qcs) {
	if (isQCFree()) return 0

	let r = 0
	for (var qc of qcs) r += quantumChallenges.costs[qc]
	return r
}

function selectQC(x) {
	if (pcFocus) {
		if (pcAssigned.includes(x)) return
		pcChosen.push(x)
		if (pcChosen.length == 2) {
			quSave.pairedChallenges.order[pcFocus] = pcChosen
			showChallengesTab("pChalls")
			pcFocus = 0
		}
		updateQuantumChallenges()
	} else quantum(false, true, { qc: [x] })
}

function doReachAMGoalStuff(chall){
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "You reached the antimatter goal (" + shorten(getQCGoal()) + "), but you didn't reach the meta-antimatter goal yet! Get " + shorten(getQuantumReq()) + " meta-antimatter" + (bigRipped() ? " and then you can fundament!" : " and then go Quantum to complete your challenge!")
	quSave.nonMAGoalReached.push(chall)
}

//Paired Challenges
function updatePairedChallenges() {
	el("pChalls").style.display = hasMasteryStudy("d9") ? "" : "none"
	if (!hasMasteryStudy("d9")) return

	pcAssigned = []
	for (var pc = 1; pc <= 4; pc++) {
		var subChalls = quSave.pairedChallenges.order[pc]
		if (subChalls) for (var qc of subChalls) assignPC(pc, qc)

		var property = "pc" + pc
		var sc1 = quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc][0] : 0
		var sc2 = (sc1 ? quSave.pairedChallenges.order[pc].length > 1 : false) ? quSave.pairedChallenges.order[pc][1] : 0
		el(property+"desc").textContent = "Paired Challenge "+pc+": Both Quantum Challenge " + (sc1 ? sc1 : "?") + " and " + (sc2 ? sc2 : "?") + " are applied."
		el(property+"cost").textContent = isQCFree() ? "" : "Req: " + (sc2 ? getFullExpansion(getQCCost(pc + 8)) : "???") + " Positrons"
		el(property+"goal").textContent = "Goal: " + (sc2 ? shortenCosts(getQCGoal(pc + 8)) : "???") + " antimatter"
		el(property).textContent = pcFocus == pc ? "Cancel" : (quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc].length < 2 : true) ? "Assign" : quSave.pairedChallenges.completed >= pc ? "Completed" : quSave.pairedChallenges.completed + 1 < pc ? "Locked" : quSave.pairedChallenges.current == pc ? "Running" : "Start"
		el(property).className = pcFocus == pc || (quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc].length < 2 : true) ? "challengesbtn" : quSave.pairedChallenges.completed >= pc ? "completedchallengesbtn" : quSave.pairedChallenges.completed + 1 <pc ? "lockedchallengesbtn" : quSave.pairedChallenges.current == pc ? "onchallengebtn" : "challengesbtn"

		var sc1t = Math.min(sc1, sc2)
		var sc2t = Math.max(sc1, sc2)
		if (hasMasteryStudy("d14")) {
			el(property + "br").style.display = ""
			el(property + "br").textContent = sc1t != 6 || sc2t != 8 ? "QC6 & 8" : bigRipped() ? "Big Ripped" : quSave.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
			el(property + "br").className = sc1t != 6 || sc2t != 8 ? "lockedchallengesbtn" : bigRipped() ? "onchallengebtn" : quSave.pairedChallenges.completed + 1 < pc ? "lockedchallengesbtn" : "challengesbtn bigrip"
		} else el(property + "br").style.display = "none"
	}

	if (pcFocus) for (var qc of pcChosen) assignPC(pcFocus, qc)
}

var pcFocus = 0
var pcAssigned = []
var pcChosen = []
function selectPC(loc, bigRip) {
	let pc = quSave.pairedChallenges.order[loc] || []
	if (pc.length == 2) {
		if (bigRip && (!pc.includes(6) || !pc.includes(8))) return
		quantum(false, true, { qc: pc, pc: loc, br: bigRip })
		return
	} else if (pcFocus == loc) pcFocus = 0
	else {
		pcFocus = loc
		pcChosen = []
		showChallengesTab("quantumchallenges")
	}
	updateQuantumChallenges()
}

function assignPC(pc, qc) {
	pcAssigned.push(qc)
	el("qc"+qc).textContent = `Paired (PC${pc})`
	el("qc"+qc).className = "onchallengebtn"
}

function respecPC(force) {
	if (!force && !confirm("Are you sure to respec your challenges? This will force a Quantum!")) return

	quantum(true, !isQuantumReached() || bigRipped())
	for (qc = 1; qc <= 8; qc++) quSave.challenges[qc] = 1
	quSave.pairedChallenges.order = {}
	quSave.pairedChallenges.current = 0
	quSave.pairedChallenges.completed = 0
	if (!force) updateQuantumChallenges()
}

function getPCStr() {
	let order = quSave.pairedChallenges.order
	let str = ""
	for (var pc = 1; pc <= 4; pc++) {
		str += order?.[pc]?.[0] ?? 0
		str += order?.[pc]?.[1] ?? 0
		str += "+"
	}
	return str
}

function importPC() {
	let str = prompt("This will force a Quantum and respec your Paired Challenges!")
	if (str == "") return

	let check = {}
	str = str.split("+")
	for (var pc = 1; pc <= 4; pc++) {
		if (str[pc-1][0] == str[pc-1][1]) return
		check[pc] = [str[pc-1][0], str[pc-1][1]]
	}

	respecPC(true)
	quSave.pairedChallenges.order = check
	updateQuantumChallenges()
}

var ranking=0
function updatePCCompletions() {
	el("pccompletionsbtn").style.display = "none"
	if (!mod.ngp3) return
	var r = 0
	tmp.qu.chal.pc_comp = {} // PC Completion counters
	for (var c1 = 2; c1 < 9; c1++) for (var c2 = 1; c2 < c1; c2++) {
		var rankingPart = 0
		if (quSave.pairedChallenges.completions[c2 * 10 + c1]) {
			rankingPart = 5 - quSave.pairedChallenges.completions[c2 * 10 + c1]
			tmp.qu.chal.pc_comp.normal = (tmp.qu.chal.pc_comp.normal || 0) + 1
		} else if (c2 * 10 + c1 == 68 && ghostified) {
			rankingPart = 0.5
			tmp.qu.chal.pc_comp.normal = (tmp.qu.chal.pc_comp.normal || 0) + 1
		}
		if (quSave.qcsNoDil["pc" + (c2 * 10 + c1)]) {
			rankingPart += 5 - quSave.qcsNoDil["pc" + ( c2 * 10 + c1)]
			tmp.qu.chal.pc_comp.noDil = (tmp.qu.chal.pc_comp.noDil || 0) + 1
		}
		r += Math.sqrt(rankingPart)
	}
	r *= 100 / 56
	tmp.qu.chal.rank = r // its global
	updatePCTable()

	if (r) el("pccompletionsbtn").style.display = "inline-block"

	el("bpc68").textContent = "You've made " + shortenMoney(quSave.pairedChallenges.pc68best) + " in Paired Challenge combinations 6 and 8."
	el("upcc").textContent = "You've completed " + (tmp.qu.chal.pc_comp.normal || 0) + " / 28 unique Paired Challenges."
	el("udcc").textContent = "(" + (tmp.qu.chal.pc_comp.noDil || 0) + " combinations without dilation runs)"
	el("pccranking").textContent = r.toFixed(1)
	el("pccrankingMax").textContent = Math.sqrt(2e4).toFixed(1)
}

function setupPCTable() {
	var pcct = el("pccompletionstable")
	var row = pcct.insertRow(0)
	for (let c = 0; c <= 8; c++) {
		var col = row.insertCell(c)
		if (c > 0) col.textContent = "#" + c
	}
	for (let r = 1; r <= 8; r++) {
		row = pcct.insertRow(r)
		for (let c = 0; c <= r; c++) {
			var col = row.insertCell(c)
			if (c < 1) col.textContent = "#" + r
			else if (c == r) {
				col.id = "qcC" + r
			} else col.id = "pc" + r + c
		}
	}
}

function updatePCTable() {
	for (r = 1; r < 9; r++) for (c = 1; c <= r; c++) {
		if (r != c) {
			var divid = "pc" + (r * 10 + c)
			var pcid = r * 10 + c
			if (r > c) pcid = c * 10  +r
			var comp = quSave.pairedChallenges.completions[pcid]
			if (comp !== undefined) {
				el(divid).textContent = "PC" + comp
				el(divid).className = (quSave.qcsNoDil["pc" + pcid] ? "nd" : "pc" + comp) + "completed"
				var achTooltip = 'Fastest time: ' + (quSave.pairedChallenges.fastest[pcid] ? timeDisplayShort(quSave.pairedChallenges.fastest[pcid]) : "N/A")
				if (quSave.qcsNoDil["pc" + pcid]) achTooltip += ", No dilation: PC" + quSave.qcsNoDil["pc" + pcid]
				el(divid).setAttribute('ach-tooltip', achTooltip)
				if (divid=="pc38") giveAchievement("Hardly marked")
				if (divid=="pc68") giveAchievement("Big Rip isn't enough")
			} else if (pcid == 68 && ghostified) {
				el(divid).textContent = "BR"
				el(divid).className = "brCompleted"
				el(divid).removeAttribute('ach-tooltip')
				el(divid).setAttribute('ach-tooltip', 'Fastest time from start of Ghostify: ' + timeDisplayShort(ghSave.best))
			} else {
				el(divid).textContent = ""
				el(divid).className = ""
				el(divid).removeAttribute('ach-tooltip')
			}
		} else { // r == c
			var divid = "qcC" + r
			el(divid).textContent = "QC"+r
			if (quSave.qcsNoDil["qc" + r]) {
				el(divid).className = "ndcompleted"
				el(divid).setAttribute('ach-tooltip', "No dilation achieved!")
			} else {
				el(divid).className = "pc1completed"
				el(divid).removeAttribute('ach-tooltip')
			}
		}
	}
}
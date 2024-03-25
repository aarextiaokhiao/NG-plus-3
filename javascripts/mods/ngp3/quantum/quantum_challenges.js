const QC = QUANTUM_CHALLENGE = {
	1: {
		cost: 16750,
		goal: pow10(6.65e9),
		desc: "Antimatter Dimensions 3-8 don't produce anything.",

		reward: "Add 0.25x to positron multiplier for each Quantum Challenge completion, and First & Second Dimensions boost Dilated Time production.",
		reward_eff(comps) {
			if (comps == 0) return E(1)
			let base = getDimensionFinalMultiplier(1).mul(getDimensionFinalMultiplier(2)).max(1).log10()
			let exp = 0.225 + comps * .025
			return pow10(Math.pow(base, exp) / 200)
		},
		reward_eff_disp: e => shorten(e) + "x"
	},
	2: {
		cost: 19100,
		goal: pow10(7.68e10),
		desc: "Galaxies do nothing.",

		reward: "Gain more Tachyonic Galaxies for each threshold.",
		reward_eff(comps) {
			if (comps == 0) return 1
			return 1.2 + comps * 0.2
		},
		reward_eff_disp: e => shortenDimensions(e * 100 - 100) + "%"
	},
	3: {
		cost: 21500,
		goal: pow10(4.525e10),
		desc: "Meta-Antimatter boosts Infinity Dimensions instead.",

		reward: "Infinity Power boosts Meta Dimensions at a greatly reduced rate.",
		reward_eff(comps) {
			if (comps == 0) return 1
			let ipow = player.infinityPower.add(1).log10()

			let log = Math.sqrt(ipow / 2e8)
			if (comps >= 2) log += Math.pow(ipow / 1e9, 4/9 + comps/9)
			if (log > 1e3) log = Math.sqrt(log * 250) + 500

			return pow10(log)
		},
		reward_eff_disp: e => shorten(e) + "x"
	},
	4: {
		cost: 24050,
		goal: pow10(5.325e10),
		desc: "Automatic Big Crunch Challenge is applied to Antimatter, Infinity, Time, and Meta Dimensions. Meta-Dimension Boosts scale slower, but nullify buffs.",

		reward: "All even Meta Dimensions boost all odd Meta Dimensions.",
		reward_eff(comps) {
			if (comps == 0) return 1
			let mult = player.meta[2].amount.mul(player.meta[4].amount).mul(player.meta[6].amount).mul(player.meta[8].amount).max(1)
			if (comps <= 1) return E_pow(10 * comps, Math.sqrt(mult.log10()) / 10)
			return mult.pow(comps / 150)
		},
		reward_eff_disp: e => shorten(e) + "x"
	},
	5: {
		cost: 25900,
		goal: pow10(1.344e10),
		desc: "Dimension Supersonic scales instantly and faster. Replicated Galaxies and Tachyonic Galaxies also scale faster. Multiplier per ten dimensions is 1x.",

		reward: "Dimension Boosts boost the multiplier per ten Dimensions.",
		reward_eff(comps) {
			if (comps == 0) return 0
			return Math.log10(1 + player.resets) * Math.pow(comps, 0.4)
		},
		reward_eff_disp: e => getDimensionPowerMultiplier("linear").toFixed(2) + "x"
	},
	6: {
		cost: 28900,
		goal: pow10(5.61e8),
		desc: "You are stuck in Infinity Challenges 3 and 7. You can't get Dimension Boosts. However, per-10 Meta Dimension effects are stronger.",

		reward: "Achievement bonus boosts Meta Dimensions.",
		reward_eff(comps) {
			if (comps == 0) return 1
			return player.achPow.pow(comps * 2 - 1)
		},
		reward_eff_disp: e => shorten(e) + "x"
	},
	7: {
		cost: 31300,
		goal: pow10(6.254e10),
		desc: "Dimensions and Tickspeed upgrades scale really fast. Per-10 multipliers and meta-antimatter effect is nullified.",

		reward: "Free tickspeed upgrades scale slower.",
		reward_eff(comps) {
			if (comps == 0) return 1
			return Math.pow(0.975, comps)
		},
		reward_eff_disp: e => shortenDimensions(100 - e * 100) + "%"
	},
	8: {
		cost: 33600,
		goal: pow10(2.925e10),
		desc: "Disable Infinity and Time Dimensions, and Meta-Dimension Boosts do nothing.",

		reward: "Gain extra Replicated Galaxies faster after 100.",
		reward_eff(comps) {
			if (comps == 0) return 1
			return comps + 2
		},
		reward_eff_disp: e => e + "x"
	}
}

function setupQCHTML() {
	let table = ""
	let table2 = ""
	let pc = 0
	for (let qc = 1; qc <= 8; qc++) {
		let data = QC[qc]
		table += `<td>
			<div class="quantumchallengediv" id="qc${qc}div">
				<span>${data.desc}</span>
				<br><br>

				<div class="outer">
					<button id="qc${qc}" class="challengesbtn" onclick="selectQC(${qc})">Start</button>
					<br>
					<span id="qc${qc}cost"></span><br>
					<span id="qc${qc}goal"></span><br>
					Reward: ${data.reward}<br>
					Currently: <span id="qc${qc}reward"></span>
				</div>
			</div>
		</td>`
		if (qc % 2 == 0) {
			pc++
			table += "</tr><tr>"
			table2 += `<td>
				<div class="quantumchallengediv">
					<span id="pc${pc}desc"></span>
					<br>
					<br>
					<div class="outer">
						<button id="pc${pc}" class="challengesbtn" onclick="selectPC(${pc})"></button>
						<button id="pc${pc}br" class="challengesbtn" onclick="selectPC(${pc}, true)"></button>
						<br>
						<span id="pc${pc}cost"></span><br>
						<span id="pc${pc}goal"></span><br>
						Reward: Boost the reward for these sub-challenges.
					</div>
				</div>
			</td>`
			if (pc % 2 == 0) table2 += "</tr><tr>"
		}
	}
	el("qc_table").innerHTML = `<tr>${table}</tr>`
	el("pc_table").innerHTML = `<tr>${table2}</tr>`
}

function updateQuantumChallenges() {
	if (!hasMasteryStudy("d8")) return

	for (var qc = 1; qc <= 8; qc++) {
		var property = "qc" + qc
		el(property + "div").style.display = (qc < 2 || QCIntensity(qc - 1)) ? "inline-block" : "none"
		el(property).textContent = pcFocus ? "Choose" : inQC(qc) ? "Running" : QCIntensity(qc) ? "Completed" : "Start"
		el(property).className = pcFocus ? "challengesbtn" : inQC(qc) ? "onchallengebtn" : QCIntensity(qc) ? "completedchallengesbtn" : "challengesbtn"
		el(property + "cost").textContent = isQCFree() ? "" : "Req: " + getFullExpansion(QC[qc].cost) + " Positrons"
		el(property + "goal").textContent = "Goal: " + shortenCosts(getQCGoal(qc, false)) + " antimatter"
	}

	updatePairedChallenges()
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

	let r = 1
	for (let i of qcs) r *= QC[i].goal.e
	if (qcs.length == 2) r /= 1e11

	return pow10(r * mult)
}

function getQCGoal(num, bigRip = bigRipped()) {
	if (!mod.ngp3) return E(0)

	let qcs = num > 8 ? quSave.pairedChallenges.order[num - 8] : num ? [num] : tmp.qu.chal.in
	return getQCIdGoal(qcs, bigRip)
}

function QCIntensity(num) {
	return quSave?.challenges?.[num] || 0
}

function updateQCTimes() {
	if (!mod.ngp3) return
	var sumOfCompletedChallengeTimes = 0
	var completedChallenges = 0
	let showQuantumChallengeStatsGroup = false
	for (var i = 1; i < 9; i++) {
		setAndMaybeShow("qctime" + i, quSave.challengeRecords[i], '"Quantum Challenge ' + i + ' time record: "+timeDisplayShort(quSave.challengeRecords[' + i + '], false, 3)')
		if (quSave.challengeRecords[i]) {
			sumOfCompletedChallengeTimes+=quSave.challengeRecords[i]
			completedChallenges++
			showQuantumChallengeStatsGroup = true
		}
	}
	el("stats_qctime").style.display = showQuantumChallengeStatsGroup ? null : "none"
	setAndMaybeShow("qctimesum", completedChallenges > 1, '"The sum of your completed Quantum Challenge time records is " + timeDisplayShort(' + sumOfCompletedChallengeTimes + ', false, 3) + "."')
}

function updateQCRewardsTemp() {
	tmp.qu.chal.reward = {}
	for (var c = 1; c <= 8; c++) tmp.qu.chal.reward[c] = QC[c].reward_eff(QCIntensity(c))
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
	for (var qc of qcs) r += QC[qc].cost
	return r
}

function selectQC(x) {
	if (pcFocus) {
		if (pcAssigned.includes(x)) return
		pcChosen.push(x)
		if (pcChosen.length == 2) {
			quSave.pairedChallenges.order[pcFocus] = pcChosen
			pcFocus = 0
		}
		updateQuantumChallenges()
	} else quantum(false, true, { qc: [x] })
}

function doReachAMGoalStuff(chall){
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	el("welcomeMessage").innerHTML = "You reached the antimatter goal (" + shorten(getQCGoal()) + "), but you didn't reach the meta-antimatter goal yet! Get " + shorten(getQuantumReq()) + " meta-antimatter" + (bigRipped() ? " and then you can Fundament!" : " and then go Quantum to complete your challenge!")
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
		el(property+"goal").textContent = "Goal: " + (sc2 ? shortenCosts(getQCGoal(pc + 8, false)) : "???") + " antimatter"
		el(property).textContent = pcFocus == pc ? "Cancel" : (quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc].length < 2 : true) ? "Assign" : quSave.pairedChallenges.completed >= pc ? "Completed" : quSave.pairedChallenges.completed + 1 < pc ? "Locked" : quSave.pairedChallenges.current == pc ? "Running" : "Start"
		el(property).className = pcFocus == pc ? "onchallengebtn" : (quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc].length < 2 : true) ? "challengesbtn" : quSave.pairedChallenges.completed >= pc ? "completedchallengesbtn" : quSave.pairedChallenges.completed + 1 <pc ? "lockedchallengesbtn" : quSave.pairedChallenges.current == pc ? "onchallengebtn" : "challengesbtn"

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
		quantum(true, false, { qc: pc, pc: loc, br: bigRip })
		return
	} else if (pcFocus == loc) pcFocus = 0
	else {
		pcFocus = loc
		pcChosen = []
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

function importPC() {
	let str = prompt("Input a list of PCs below. This will force a Quantum, respec your Paired Challenges, and import your selected PC choices.")
	if (str == "") return
	PRESET_DATA.pc.load(str)
}

PRESET_DATA.pc = {
	name: "Paired Challenges",
	in: _ => isTabShown("chal_qu") && hasMasteryStudy("d9"),
	unl: _ => hasMasteryStudy("d9"),

	get() {
		let order = quSave.pairedChallenges.order
		let str = ""
		for (var pc = 1; pc <= 4; pc++) {
			str += order?.[pc]?.[0] ?? 0
			str += order?.[pc]?.[1] ?? 0
			str += "+"
		}
		return str
	},

	options: [],
	load(str, options) {
		let check = {}
		let has = []
		str = str.split("+")
		for (var pc = 1; pc <= 4; pc++) {
			check[pc] = [str[pc-1][0], str[pc-1][1]]
			for (var qc of check[pc]) {
				if (parseInt(qc) != qc) return
				if (qc == 0 || qc == 9) return
				if (has.includes(qc)) return
				has.push(qc)
			}
		}

		respecPC(true)
		quSave.pairedChallenges.order = check
		updateQuantumChallenges()
	}
}

var ranking=0
function updatePCCompletions() {
	el("stats_pc").style.display = "none"
	if (!mod.ngp3) return

	var r = 0
	tmp.qu.chal.pc_comp = 0 // PC Completion counters
	for (var c1 = 2; c1 < 9; c1++) for (var c2 = 1; c2 < c1; c2++) {
		var rankingPart = 0
		if (quSave.pairedChallenges.completions[c2 * 10 + c1]) {
			rankingPart = 5 - quSave.pairedChallenges.completions[c2 * 10 + c1]
			tmp.qu.chal.pc_comp++
		} else if (c2 * 10 + c1 == 68 && ghostified) {
			rankingPart = 0.5
			tmp.qu.chal.pc_comp++
		}
		r += Math.sqrt(rankingPart)
	}

	tmp.qu.chal.pc_rank = r // its global
	updatePCTable()

	if (r) el("stats_pc").style.display = "inline-block"

	el("bpc68").textContent = "You've made " + shortenMoney(quSave.pairedChallenges.pc68best) + " in Paired Challenge combinations 6 and 8."
	el("upcc").textContent = "You've completed " + (tmp.qu.chal.pc_comp) + " / 28 unique Paired Challenges."
	el("pccranking").textContent = r.toFixed(1)
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
			if (r > c) pcid = c * 10 + r
			var comp = quSave.pairedChallenges.completions[pcid]
			if (comp !== undefined) {
				el(divid).textContent = "PC" + comp
				el(divid).className = "pc" + comp + "completed"
				var achTooltip = 'Fastest time: ' + (quSave.pairedChallenges.fastest[pcid] ? timeDisplayShort(quSave.pairedChallenges.fastest[pcid]) : "N/A")
				el(divid).setAttribute('ach-tooltip', achTooltip)

				var clear38 = (divid == "pc83" || pcid == 38)
				if (clear38) giveAchievement("Hardly marked")
			} else if (pcid == 68 && ghostified) {
				el(divid).textContent = "BR"
				el(divid).className = "brCompleted"
				el(divid).removeAttribute('ach-tooltip')
				if (quSave.pairedChallenges.completions[86] > 0) {
					el(divid).setAttribute('ach-tooltip', 'Fastest BR time from start of Fundament: ' + timeDisplayShort(ghSave.best) + ', fastest QC6+8 time: ' + timeDisplayShort(quSave.pairedChallenges.fastest[86] ? quSave.pairedChallenges.fastest[86] : "N/A"))
				} else {
					el(divid).setAttribute('ach-tooltip', 'Fastest BR time from start of Fundament: ' + timeDisplayShort(ghSave.best))
				}

				var clear68 = (divid == "pc86" || pcid == 68)
				if (clear68) giveAchievement("Big Rip isn't enough")
			} else {
				el(divid).textContent = ""
				el(divid).className = ""
				el(divid).removeAttribute('ach-tooltip')
			}
		} else { // r == c
			var divid = "qcC" + r
			el(divid).textContent = "QC"+r
			el(divid).className = "pc1completed"
			el(divid).removeAttribute('ach-tooltip')
		}
	}
}
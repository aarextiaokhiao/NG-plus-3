function setupAutomaticGhostsData() {
	var data = {power: 0, ghosts: 3}
	for (var ghost = 1; ghost <= automators.max; ghost++) data[ghost] = {on: false}
	data[4].mode = "q"
	data[4].rotate = "r"
	data[11].pw = 1
	data[11].lw = 1
	data[11].cw = 1
	data[15].a = 1
	data[17].a = 60
	data[17].t = 0
	return data
}

var automators = {
	max: 19,
	order: [1,5,6,7,18,8,9,10,11,12,13,14,15,16,17,19,20,21,22],

	1: {
		req: 0,
		pow: 1.5,
	},
	5: {
		req: 4,
		pow: 2,
	},
	6: {
		req: 4,
		pow: 1.5,
	},
	7: {
		req: 4.5,
		pow: 0.5,
	},
	8: {
		req: 5,
		pow: 0.5,
	},
	9: {
		req: 5,
		pow: 0.5,
	},
	10: {
		req: 6,
		pow: 1,
	},
	11: {
		req: 6.5,
		pow: 0.5,
	},
	12: {
		req: 7,
		pow: 0.5,
	},
	13: {
		req: 7,
		pow: 3,
	},
	14: {
		req: 7.5,
		pow: 1,
	},
	15: {
		req: 8,
		pow: 4,
	},
	16: {
		req: 12,
		pow: 1,
	},
	17: {
		req: 25,
		pow: 4,
	},
	18: {
		req: 4.5,
		pow: 1,
	},
	19: {
		req: 32,
		pow: 3,
	},
	20: {
		req: 36,
		pow: 9,
	},
	21: {
		req: 40,
		pow: 3,
	},
	22: {
		req: 45,
		pow: 3,
	},
}

var powerConsumed = undefined
function updateAutoGhosts(load) {
	var data = ghSave.automatorGhosts
	if (load) {
		for (var x of automators.order) if (!data[x]) data[x] = {on: false}
		updateAutomatorUnlocks()
	}
	powerConsumed = 0
	for (var [g, id] of Object.entries(automators.order)) {
		if (load) {
			el("autoGhost" + id).style.display=data.ghosts<g?"none":""
			el("isAutoGhostOn" + id).checked=data[id].on
		}
		if (data[id].on) powerConsumed += automators[id].pow
	}
	if (load) {
		el("autoGhost11pw").value = data[11].pw
		el("autoGhost11cw").value = data[11].cw
		el("autoGhost13t").value = data[13].t
		el("autoGhost13u").value = data[13].u
		el("autoGhost13o").value = data[13].o
		el("autoGhost15a").value = data[15].a || 300
		el("autoGhost17s").value = data[17].s || 60
	}
	el("consumedPower").textContent = powerConsumed.toFixed(2)
	isAutoGhostsSafe = data.power >= powerConsumed
	el("tooMuchPowerConsumed").style.display = isAutoGhostsSafe ? "none" : ""
}

function toggleAutoGhost(id) {
	ghSave.automatorGhosts[id].on = el("isAutoGhostOn" + id).checked
	updateAutoGhosts()
}

function changeAutoGhost(o) {
	if (o == "11pw") {
		var num = parseFloat(el("autoGhost11pw").value)
		if (!isNaN(num) && num > 0) ghSave.automatorGhosts[11].pw = num
	} else if (o == "11cw") {
		var num = parseFloat(el("autoGhost11cw").value)
		if (!isNaN(num) && num > 0) ghSave.automatorGhosts[11].cw = num
	} else if (o == "13t") {
		var num = parseFloat(el("autoGhost13t").value)
		if (!isNaN(num) && num >= 0) ghSave.automatorGhosts[13].t = num
	} else if (o == "13u") {
		var num = parseFloat(el("autoGhost13u").value)
		if (!isNaN(num) && num > 0) ghSave.automatorGhosts[13].u = num
	} else if (o == "13o") {
		var num = parseInt(getEl("autoGhost13o").value)
		if (!isNaN(num) && num >= 0) player.ghostify.automatorGhosts[13].o = num
	} else if (o == "15a") {
		var num = parseFloat(el("autoGhost15a").value)
		if (!isNaN(num) && num > 0) ghSave.automatorGhosts[13].u = num
	} else if (o == "17a") {
		var num = fromValue(el("autoGhost17s").value)
		if (!isNaN(break_infinity_js ? num : num.l)) ghSave.automatorGhosts[17].s = num
	}
}

function isAutoGhostActive(id) {
	if (!ghostified) return
	return ghSave.automatorGhosts[id].on
}

function getAutoCharge() {
	return Math.max(Math.log10(quantumWorth.add(1).log10() / 150) / Math.log10(2), 0) + Math.max(brSave.spaceShards.add(1).log10() / 15 - 0.5, 0)
}

function getAutomatorReq(x) {
	if (!x) x = automators.order[ghSave.automatorGhosts.ghosts] //Next
	return automators[x].req
}

function updateAutomatorStuff(mode) {
	var data = ghSave.automatorGhosts
	data.power = Math.max(getAutoCharge(), data.power)

	if (mode != "quick") updateAutomatorUnlocks()
	while (data.ghosts<automators.max&&data.power>=getAutomatorReq()) {
		data.ghosts++
		el("autoGhost"+automators.order[data.ghosts]).style.display=""
		updateAutomatorUnlocks()
	}

}

//AUTOMATION
function automatorTick(diff) {
	if (!ghostified) return
	if (!isAutoGhostsSafe) return

	//Ghostify Layer
	if (ghSave.wzb.unl) {
		if (isAutoGhostActive(17)) {
			let ag = ghSave.automatorGhosts[17]

			let change = getRemainingExtractTime().gte(ag.s || 60)
			if (!change) change = ag.oc && ag.t >= 2
			if (change) changeTypeToExtract(blSave.typeToExtract % br.limit + 1)

			if (!blSave.extracting) extract()
		}
		if (isAutoGhostActive(20)) buyMaxBosonicUpgrades()
		if (isAutoGhostActive(21)) {
			let data = ghSave.wzb
			let hasWNB = data.wnb.gt(0)

			if (data.dPUse == 0 && data.dP.gt(0)) useAntiPreon(hasWNB ? 3 : 1)
			if (data.dPUse == 1) useAntiPreon(hasWNB ? 3 : 2)
			if (data.dPUse == 2) useAntiPreon(1)
			if (data.dPUse == 3 && !hasWNB) useAntiPreon(2)
		}
	}
	if (isAutoGhostActive(19)) {
		let ag = ghSave.automatorGhosts[19]
		let perSec = 1/2
		ag.t = (ag.t || 0) + diff * perSec
		let times = Math.floor(ag.t)
		if (times > 0) {
			let max = times
			if (isEnchantUsed(35)) max = tmp.bEn[35].times(max)
			autoMaxAllEnchants(max)
			ag.t = ag.t - times
		}
	}
	if (isAutoGhostActive(22)) {
		lightEmpowerment(true)
	}
	if (isAutoGhostActive(15) && ghSave.time >= ghSave.automatorGhosts[15].a * 1e3) ghostify(true)

	//Quantum Layer
	let limit = ghSave.automatorGhosts[13].o || 1 / 0
	if (hasMasteryStudy("d13") && isAutoGhostActive(13)) {
		if (bigRipped()) {
			if (quSave.time >= ghSave.automatorGhosts[13].u * 10 && brSave.times <= limit) doQuantum(true, true)
		} else if (quSave.time >= ghSave.automatorGhosts[13].t * 10 && brSave.times < limit) bigRip(true)
	}
	if (NF.unl()) {
		if (isAutoGhostActive(1) && quSave.usedQuarks.r.gt(0) && todSave.r.quarks.eq(0)) unstableQuarks("r")
		if (isAutoGhostActive(12) && getUnstableGain("r").max(todSave.r.quarks).gte(Decimal.pow(10, Math.pow(2, 50)))) {
			unstableQuarks("r")
			radioactiveDecay("r")
		}
		if (isAutoGhostActive(5)) maxBranchUpg("r")
		if (isAutoGhostActive(6)) maxTreeUpg()
	}
	if (hasMasteryStudy("d11") && isAutoGhostActive(11)) {
		let ag = ghSave.automatorGhosts[11]
		ag.t = (ag.t || 0) + diff

		let start = nfSave.producingCharge ? ag.t <= ag.cw : ag.t >= ag.pw
		if (nfSave.producingCharge != start) {
			startProduceQuarkCharge()
			if (start) ag.t = 0
		}
	}
}

function automatorPerSec() {
	if (isAutoGhostActive(14)) maxBuyBEEPMult()
	if (isAutoGhostActive(10)) maxBuyLimit()
	if (isAutoGhostActive(9) && quSave.replicants.quantumFood > 0) {
		for (d = 1;d < 9; d++) if (canFeedReplicant(d) && (d == quSave.replicants.limitDim || (!EDsave[d + 1].perm && EDsave[d].workers.lt(11)))) {
			feedReplicant(d, true);
			break;
		} 
	}
	if (isAutoGhostActive(8)) buyMaxQuantumFood()
	if (isAutoGhostActive(7)) maxQuarkMult()
}

//HTML
function updateAutomatorUnlocks() {
	var amt = ghSave.automatorGhosts.ghosts
	if (amt >= automators.max) el("nextAutomatorGhost").parentElement.style.display="none"
	else {
		el("nextAutomatorGhostDiv").style.display=""
		el("nextAutomatorGhost").textContent=getAutomatorReq().toFixed(2)
	}
}

function updateAutomatorHTML() {
	el("automatorCharge").textContent=getAutoCharge().toFixed(2)
	el("automatorPower").textContent=ghSave.automatorGhosts.power.toFixed(2)
}
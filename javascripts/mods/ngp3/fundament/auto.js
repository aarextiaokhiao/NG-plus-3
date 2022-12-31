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
	max: 22,
	order: [null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,17,19,20,21,22],

	1: {
		req: 0,
		pow: 0.75,
	},
	2: {
		req: 0,
		pow: 0.75,
	},
	3: {
		req: 0,
		pow: 0.75,
	},
	4: {
		req: 2,
		pow: 1,
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
		pow: 0.5,
	},
	14: {
		req: 7.5,
		pow: 0.5,
	},
	15: {
		req: 8,
		pow: 0.5,
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
		req: 12,
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
		for (var x = 1; x <= automators.max; x++) if (data[x] === undefined) data[x] = {on: false}
		updateAutomatorUnlocks()
	}
	powerConsumed = 0
	for (var g = 1; g <= automators.max; g++) {
		var id = automators.order[g]
		if (data.ghosts < g) {
			if (load) el("autoGhost" + id).style.display="none"
		} else {
			if (load) {
				el("autoGhost" + id).style.display=""
				el("isAutoGhostOn" + id).checked=data[id].on
			}
			if (data[id].on) powerConsumed += automators[id].pow
		}
	}
	if (load) {
		el("autoGhostMod4").textContent = "Every " + (data[4].mode == "t" ? "second" : "Quantum")
		el("autoGhostRotate4").textContent = data[4].rotate == "l" ? "Left" : "Right"
		el("autoGhost11pw").value = data[11].pw
		el("autoGhost11cw").value = data[11].cw
		el("autoGhost13t").value = data[13].t
		el("autoGhost13u").value = data[13].u
		el("autoGhost13o").value = data[13].o
		el("autoGhost15a").value = formatValue("Scientific", data[15].a, 2, 1)
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
	if (o == "4m") {
		ghSave.automatorGhosts[4].mode = ghSave.automatorGhosts[4].mode == "t" ? "q" : "t"
		el("autoGhostMod4").textContent = "Every " + (ghSave.automatorGhosts[4].mode == "t" ? "second" : "Quantum")
	} else if (o == "4r") {
		ghSave.automatorGhosts[4].rotate = ghSave.automatorGhosts[4].rotate == "l" ? "r" : "l"
		el("autoGhostRotate4").textContent = ghSave.automatorGhosts[4].rotate == "l" ? "Left" : "Right"
	} else if (o == "11pw") {
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
		var num = fromValue(el("autoGhost15a").value)
		if (!isNaN(break_infinity_js ? num : num.l)) ghSave.automatorGhosts[15].a = num
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
	if (!x) x = automators.order[ghSave.automatorGhosts.ghosts + 1] //Next
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
			if (!change) change = ag.oc && ag.t >= 2 / (hasAch("ng3p103") ? 10 : 1)
			if (change) changeTypeToExtract(tmp.bl.typeToExtract % br.limit + 1)

			if (!tmp.bl.extracting) extract()
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
	if (isAutoGhostActive(15)) if ((hasNU(16) || inBigRip()) && getGHPGain().gte(ghSave.automatorGhosts[15].a)) ghostify(true)

	//Quantum Layer
	let limit = ghSave.automatorGhosts[13].o || 1 / 0
	if (player.masterystudies.includes("d13") && isAutoGhostActive(13)) {
		if (brSave.active) {
			if (quSave.time >= ghSave.automatorGhosts[13].u * 10 && brSave.times <= limit) quantumReset(true, true)
		} else if (quSave.time >= ghSave.automatorGhosts[13].t * 10 && brSave.times < limit) bigRip(true)
	}
	if (NF.unl()) {
		let colorShorthands = ["r", "g", "b"]
		for (let c = 1; c <= 1; c++) {
			let shorthand = colorShorthands[c - 1]
			if (isAutoGhostActive(c) && quSave.usedQuarks[shorthand].gt(0) && todSave[shorthand].quarks.eq(0)) unstableQuarks(shorthand)
			if (isAutoGhostActive(12) && getUnstableGain(shorthand).max(todSave[shorthand].quarks).gte(Decimal.pow(10, Math.pow(2, 50)))) {
				unstableQuarks(shorthand)
				radioactiveDecay(shorthand)
			}
			if (isAutoGhostActive(5)) maxBranchUpg(shorthand)
		}
		if (isAutoGhostActive(6)) maxTreeUpg()
	}
	if (player.masterystudies.includes("d11") && isAutoGhostActive(11)) {
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
	if (isAutoGhostActive(4) && ghSave.automatorGhosts[4].mode=="t") rotateAutoUnstable()
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

function rotateAutoUnstable() {
	var tg=ghSave.automatorGhosts[3].on
	if (ghSave.automatorGhosts[4].rotate=="l") {
		ghSave.automatorGhosts[3].on = ghSave.automatorGhosts[1].on
		ghSave.automatorGhosts[1].on = ghSave.automatorGhosts[2].on
		ghSave.automatorGhosts[2].on = tg
	} else {
		ghSave.automatorGhosts[3].on = ghSave.automatorGhosts[2].on
		ghSave.automatorGhosts[2].on = ghSave.automatorGhosts[1].on
		ghSave.automatorGhosts[1].on = tg
	}
	for (var g = 1; g < 4; g++) el("isAutoGhostOn" + g).checked = ghSave.automatorGhosts[g].on
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
var automators = {
	1: {
		title: "Quark Decay",
		req: 0,
		pow: 1.5,
	},
	5: {
		title: "Branch Upgrader",
		req: 4,
		pow: 2,
	},
	6: {
		title: "Tree Upgrader",
		req: 4,
		pow: 1.5,
	},
	7: {
		title: "Quantum Multiplier",
		req: 4.5,
		pow: 0.5,
	},
	18: {
		title: "Positron Upgrader",
		req: 4.5,
		pow: 1,
	},
	8: {
		title: "Food Giver",
		req: 5,
		pow: 0.5,
	},
	9: {
		title: "Worker Promoter",
		req: 5,
		pow: 0.5,
	},
	10: {
		title: "Worker Capacity",
		req: 6,
		pow: 1,
	},
	11: {
		title: "Nanocharger",
		html: `Wait: <input id="autoGhost11pw" onchange="changeAutoGhost('11pw')"/>s<br>
		Produce: <input id="autoGhost11cw" type="text" onchange="changeAutoGhost('11cw')"/>s`,
		req: 6.5,
		pow: 0.5,
	},
	12: {
		title: "Radioactive Decay",
		req: 7,
		pow: 0.5,
	},
	13: {
		title: "Big Rip",
		html: `Rip in: <input id="autoGhost13t" onchange="changeAutoGhost('13t')"/>s<br>
		Undo: <input id="autoGhost13u" onchange="changeAutoGhost('13u')"/>s<br>
		Stop: <input id="autoGhost13o" onchange="changeAutoGhost('13o')"/> times<br>(0 = always)`,
		req: 7,
		pow: 3,
	},
	14: {
		title: "EP Multiplier",
		req: 7.5,
		pow: 1,
	},
	15: {
		title: "Fundament",
		html: `Seconds to wait until reset: <input id="autoGhost15a" onchange="changeAutoGhost('15a')"/>`,
		req: 8,
		pow: 4,
	},
	16: {
		title: "Neutrino Upgrader",
		req: 12,
		pow: 1,
	},
	17: {
		title: "Experimenter",
		req: 25,
		pow: 4,
	},
	19: {
		title: "Enchanter",
		html: `Changes hypotheses on a complete experiment after 2s<br>
		or change at X seconds remaining: <input id="autoGhost17s" onchange="changeAutoGhost('17s')"/>`,
		req: 32,
		pow: 3,
	},
	20: {
		title: "Bosonic Upgrader",
		html: `(doesn't consume your Hypotheses, enchant per 2 seconds)`,
		req: 36,
		pow: 9,
	},
	21: {
		title: "W & Z Worker",
		req: 40,
		pow: 3,
	},
}
const automatorOrder = [1,5,6,7,18,8,9,10,11,12,13,14,15,16,17,19,20,21]

function setupAutomaticGhostsData() {
	var data = {power: 0, ghosts: 3}
	for (var g of automatorOrder) data[g] = {}
	data[11].pw = 1
	data[11].lw = 1
	data[11].cw = 1
	data[15].a = 1
	data[17].a = 60
	data[17].t = 0
	return data
}

var powerConsumed = undefined
function updateAutoGhosts(load) {
	let data = ghSave.automatorGhosts
	if (load) updateAutomatorUnlocks()

	powerConsumed = 0
	for (let [g, id] of Object.entries(automatorOrder)) {
		if (load) {
			el("autoGhost" + id).style.display = data.ghosts > g ? "table-cell" : "none"
			loadAutoGhost(id)
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

	isAutoGhostsSafe = data.power >= powerConsumed
	el("consumedPower").textContent = powerConsumed.toFixed(2)
	el("machineQuote").textContent = !isAutoGhostsSafe ? "Overloaded! Vacate some or seek more power to enable!" :
		!powerConsumed ? "The machine idles... Hire some ants to do work for you." : ""
}

function loadAutoGhost(id) {
	let data = ghSave.automatorGhosts
	el("autoGhost" + id).className = "autoBuyerDiv " + (data[id].on ? "on" : "")
	el("isAutoGhostOn" + id).textContent = data[id].on ? "Vacate" : "Hire"
	el("isAutoGhostOn" + id).className = "storebtn " + (data[id].on ? "chosenbtn" : "antbtn")
}

function toggleAutoGhost(id) {
	let data = ghSave.automatorGhosts
	data[id].on = !data[id].on
	loadAutoGhost(id)
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
		if (!isNaN(num) && num >= 0) ghSave.automatorGhosts[13].o = num
	} else if (o == "15a") {
		var num = parseFloat(el("autoGhost15a").value)
		if (!isNaN(num) && num > 0) ghSave.automatorGhosts[13].u = num
	} else if (o == "17a") {
		var num = fromValue(el("autoGhost17s").value)
		if (!isNaN(break_infinity_js ? num : num.l)) ghSave.automatorGhosts[17].s = num
	}
}

function isAutoGhostActive(id) {
	return ghSave.automatorGhosts?.[id].on && isAutoGhostsSafe
}

function getAutoCharge() {
	let r = Math.max(Math.log10(quantumWorth.add(1).log10() / 150) / Math.log10(2), 0)
	r += Math.max(brSave.spaceShards.add(1).log10() / 15 - 0.5, 0)
	if (hasAch("ng3p78")) r += ghSave.ghostParticles.add(1).log10() / 100
	return r
}

function getAutomatorReq(g = ghSave.automatorGhosts.ghosts) {
	return automators[automatorOrder[g]].req
}

function updateAutomatorStuff(mode) {
	var data = ghSave.automatorGhosts
	data.power = Math.max(getAutoCharge(), data.power)
	if (mode != "quick") updateAutomatorUnlocks()

	var order = automatorOrder
	while (data.ghosts < automatorOrder.length && data.power >= getAutomatorReq()) {
		el("autoGhost" + automatorOrder[data.ghosts]).style.display=""
		data.ghosts++
		updateAutomatorUnlocks()
	}

}

//AUTOMATION
function automatorTick(diff) {
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
			if (isEnchantUsed(35)) max = tmp.bEn[35].mul(max)
			autoMaxAllEnchants(max)
			ag.t = ag.t - times
		}
	}
	if (isAutoGhostActive(15) && ghSave.time >= ghSave.automatorGhosts[15].a * 10) ghostify(true)

	//Quantum Layer
	let limit = ghSave.automatorGhosts[13].o || 1 / 0
	if (hasMasteryStudy("d14") && isAutoGhostActive(13)) {
		if (bigRipped()) {
			if (quSave.time >= ghSave.automatorGhosts[13].u * 10 && brSave.times <= limit) doQuantum(true, true)
		} else if (quSave.time >= ghSave.automatorGhosts[13].t * 10 && brSave.times < limit) bigRip(true)
	}
	if (NF.unl()) {
		if (isAutoGhostActive(1) && quSave.usedQuarks.r.gt(0)) unstableQuarks("r")
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
	if (!isAutoGhostsSafe) return
	if (isAutoGhostActive(18)) {
		for (var i = 1; i <= 4; i++) while (buyElectronUpg(i, true)) {}
		updateElectrons()
	}
	if (isAutoGhostActive(16)) {
		maxNeutrinoMult()
		maxGHPMult()
	}
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
	var max = ghSave.automatorGhosts.ghosts >= automatorOrder.length
	el("nextAutomatorGhostDiv").style.display = max ? "none" : ""
	if (!max) el("nextAutomatorGhost").textContent=getAutomatorReq().toFixed(2)
}

function setupAutomatorHTML() {
	let html = ``
	let htmlCount = 0
	let htmlCustom = ``
	for (let id of automatorOrder) {
		let g = automators[id]
		if (g.html) htmlCustom += `<td id="autoGhost${id}" class="autoBuyerDiv">
				<div class='top'>
					<b>${g.title}</b>: ${g.pow} Power<br>
					<button class='storebtn' id="isAutoGhostOn${id}" onclick="toggleAutoGhost(${id})"></button>
					<br><br><hr>
				</div><div class='bottom'>
					${g.html}
				</div>
			</td>`
		else {
			htmlCount++
			html += `<td id="autoGhost${id}" class="autoBuyerDiv">
				<b>${g.title}</b><br>
				${g.pow} Power<br>
				<button class='storebtn' id="isAutoGhostOn${id}" onclick="toggleAutoGhost(${id})"></button>
			</td>`
			if (htmlCount % 5 == 0) html += "</tr><tr>"
		}
	}
	el('autoAntTable').innerHTML = '<tr>' + html + '</tr>'
	el('autoAntCustomTable').innerHTML = '<tr>' + htmlCustom + '</tr>'
}

function updateAutomatorHTML() {
	if (hasBraveMilestone(8)) updateQuantumWorth("display")
	el("automatorCharge").textContent=getAutoCharge().toFixed(2)
	el("automatorPower").textContent=ghSave.automatorGhosts.power.toFixed(2)
}
var automators = {
	1: {
		title: "Quark Decay",
		req: 0,
		pow: 1.5
	},
	5: {
		title: "Branch Upgrader",
		req: 4,
		pow: 2
	},
	6: {
		title: "Tree Upgrader",
		req: 4,
		pow: 1
	},
	7: {
		title: "Quantum Multiplier",
		req: 4.5,
		pow: 0.5
	},
	8: {
		title: "Food Giver",
		req: 5,
		pow: 0.5
	},
	9: {
		title: "Worker Promoter",
		req: 5,
		pow: 0.5
	},
	10: {
		title: "Worker Capacity",
		req: 6,
		pow: 1
	},
	11: {
		title: "Nanocharger",
		html: `Wait: <input id="autoAnt11pw" onchange="changeAutoGhost(11, 'pw')"/>s<br>
		Produce: <input id="autoAnt11cw" type="text" onchange="changeAutoGhost(11, 'cw')"/>s`,
		req: 6.5,
		pow: 2,
		configs: {
			pw: 1,
			cw: 1
		}
	},
	13: {
		title: "Big Rip",
		html: `Rip in: <input id="autoAnt13t" onchange="changeAutoGhost(13, 't')"/>s<br>
		Undo: <input id="autoAnt13u" onchange="changeAutoGhost(13, 'u')"/>s<br>
		Stop: <input id="autoAnt13o" onchange="changeAutoGhost(13, 'o')"/> times<br>(0 = always)`,
		req: 7,
		pow: 2,
		configs: {
			o: 5,
			u: 5,
			t: 3
		}
	},
	14: {
		title: "EP Multiplier II",
		req: 7.5,
		pow: 2
	},
	2: {
		title: "Challenger",
		html: `(big rip only)<br>
		Begin EC10 at Big Rip #: <input id="autoAnt2b" onchange="changeAutoGhost(2, 'b')"/><br>
		Duration: <input id="autoAnt2t" onchange="changeAutoGhost(2, 't')"/>s`,
		req: 11,
		pow: 1,
		configs: {
			b: 3,
			t: 5
		}
	},
	15: {
		title: "Fundament",
		html: `Seconds until reset: <input id="autoAnt15a" onchange="changeAutoGhost(15, 'a')"/>`,
		req: 12,
		pow: 2,
		configs: {
			a: 1
		}
	},
	18: {
		title: "Positron Upgrader",
		req: 13,
		pow: 2
	},
	12: {
		title: "Radioactive Decay",
		req: 15,
		pow: 1
	},
	16: {
		title: "Neutrino Upgrader",
		req: 16,
		pow: 1
	},
	17: {
		title: "Paradigmic",
		html: `At antimatter threshold in Big Rip:
		<input id="autoAnt17t" onchange="changeAutoGhost(17, 't')"/>`,
		req: 17,
		pow: 2,
		configs: {
			t: pow10(2e10)
		}
	}
}
const automatorOrder = Object.keys(automators)
const automatorIntConfigs = ["2b", "13o"]

function setupAutomaticGhostsData() {
	var data = {power: 0, ghosts: 3}
	for (var [g, d] of Object.entries(automators)) {
		data[g] = {}
		if (d.configs) for (var [i, val] of Object.entries(d.configs)) data[g][i] = val
	}

	return data
}

var powerConsumed = undefined
function updateAutoGhosts(load) {
	let data = ghSave.automatorGhosts
	if (load) updateAutomatorUnlocks()

	powerConsumed = 0
	for (let [g, id] of Object.entries(automatorOrder)) {
		if (load) {
			el("autoAnt" + id).style.display = data.ghosts > g ? "table-cell" : "none"
			loadAutoGhost(id)
		}
		if (data[id].on) powerConsumed += automators[id].pow
	}
	if (load) {
		for (var [g, d] of Object.entries(automators)) {
			if (d.configs) {
				for (var i of Object.keys(d.configs)) {
					el("autoAnt" + g + i).value = data[g][i] instanceof Decimal ? shorten(data[g][i]) : data[g][i]
				}
			}
		}
	}

	isAutoGhostsSafe = data.power >= powerConsumed
	el("machineQuote").textContent = !isAutoGhostsSafe ? "Overloaded! Vacate some ants or seek more power to enable!" :
		!powerConsumed ? "The machine is idle... Hire some ants to do work for you." : ""
}

function loadAutoGhost(id) {
	let data = ghSave.automatorGhosts
	el("autoAnt" + id).className = "autoBuyerDiv " + (data[id].on ? "on" : "")
	el("isAutoGhostOn" + id).textContent = data[id].on ? "Vacate" : "Hire"
	el("isAutoGhostOn" + id).className = "storebtn " + (data[id].on ? "chosen" : "antbtn")
}

function toggleAutoGhost(id) {
	let data = ghSave.automatorGhosts
	data[id].on = !data[id].on
	loadAutoGhost(id)
	updateAutoGhosts()
}

function changeAutoGhost(g, i) {
	var configs = automators[g].configs
	var val = el("autoAnt" + g + i).value

	if (configs[i] instanceof Decimal) {
		val = fromValue(val)
		if (!isNaN(val.l)) ghSave.automatorGhosts[g][i] = val
	} else {
		val = automatorIntConfigs.includes(g + i) ? parseInt(val) : parseFloat(val)
		if (!isNaN(val) && val >= 0) ghSave.automatorGhosts[g][i] = val
	}
}

function isAutoGhostActive(id) {
	return ghSave.automatorGhosts?.[id].on && isAutoGhostsSafe
}

function getAutoCharge() {
	let r = Math.max(Math.log2(quantumWorth.add(1).log10() / 150), 0)
	if (false) r = Math.max(Math.pow(quantumWorth.add(1).log10() / 1e3 + 1, 8/9) - 1, r) //no requirement yet

	r += Math.max(brSave.spaceShards.add(1).log10() / 15 - 0.5, 0)
	if (hasAch("ng3p78")) r += ghSave.ghostParticles.add(1).log10() / 10
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
	while (data.ghosts < order.length && data.power >= getAutomatorReq()) {
		el("autoAnt" + order[data.ghosts]).style.display = "table-cell"
		data.ghosts++
		updateAutomatorUnlocks()
	}

	el("autoAntWelcome").style.display = data.ghosts >= 10 ? "none" : ""
}

//AUTOMATION
function automatorTick(diff) {
	if (!isAutoGhostsSafe) return

	//Ghostify Layer
	if (isAutoGhostActive(15) && ghSave.time >= ghSave.automatorGhosts[15].a * 10) ghostify(true)

	//Quantum Layer
	let inRip = bigRipped()
	if (inRip) {
		if (isAutoGhostActive(2) && brSave.times >= ghSave.automatorGhosts[2].b) {
			if (quSave.time < ghSave.automatorGhosts[2].t * 10 && player.currentEternityChall != "eterc10") startEC10()
			if (quSave.time >= ghSave.automatorGhosts[2].t * 10 && player.currentEternityChall == "eterc10") eternity(true)
		}
	}

	let inParadigm = PHANTOM.amt || inRip && player.money.gt(ghSave.automatorGhosts[17].t) && isAutoGhostActive(17)
	if (inParadigm && isAutoGhostActive(17)) PHANTOM.click()
	else if (hasMasteryStudy("d14") && isAutoGhostActive(13) && !inParadigm) {
		let limit = ghSave.automatorGhosts[13].o || 1 / 0
		if (inRip) {
			if (quSave.time >= ghSave.automatorGhosts[13].u * 10 && brSave.times <= limit) doQuantum(true, true)
		} else if (quSave.time >= ghSave.automatorGhosts[13].t * 10 && brSave.times < limit) bigRip(true)
	}

	if (NF.unl()) {
		if (isAutoGhostActive(1) && quSave.usedQuarks.r.gt(0)) unstableQuarks("r")
		if (isAutoGhostActive(12) && getUnstableGain("r").max(todSave.r.quarks).gte(Decimal.pow(10, Math.pow(2, 40)))) {
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
	if (isAutoGhostActive(18)) maxPositronUpg()
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
	let htmlCustomCount = 0
	for (let id of automatorOrder) {
		let g = automators[id]
		if (g.html) {
			htmlCustomCount++
			htmlCustom += `<td id="autoAnt${id}" class="autoBuyerDiv">
				<div class='top'>
					<b>${g.title}</b>: ${g.pow} Power<br>
					<button class='storebtn' id="isAutoGhostOn${id}" onclick="toggleAutoGhost(${id})"></button>
					<br><br><hr>
				</div><div class='bottom'>
					${g.html}
				</div>
			</td>`
			if (htmlCustomCount % 3 == 0) htmlCustom += "</tr><tr>"
		} else {
			htmlCount++
			html += `<td id="autoAnt${id}" class="autoBuyerDiv">
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

	let h = powerConsumed.toFixed(2) + "/" + ghSave.automatorGhosts.power.toFixed(2)
	if (!isAutoGhostsSafe) h = `<b class='red'>${h}</b>`
	el("automatorPower").innerHTML = h
}
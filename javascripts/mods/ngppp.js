//v1.5 
function showQuantumTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('quantumtab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName) { 
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab != tabName) {
		player.aarexModifications.tabsSave.tabQuantum = tabName
		if (tabName == "uquarks" && document.getElementById("quantumtab").style.display !== "none") {
			resizeCanvas()
			requestAnimationFrame(drawQuarkAnimation)
		}
	}
	closeToolTip()
}

var quantumTabs = {
	tabIds: ["uquarks", "gluons", "electrons", "replicants", "nanofield", "tod"],
	update: {
		uquarks: updateQuarksTab,
		gluons: updateGluonsTab,
		electrons: updateElectronsTab,
		replicants: updateReplicantsTab,
		nanofield: updateNanofieldTab,
		tod: updateTreeOfDecayTab
	}
}

function updateQuantumTabs() {
	for (var i = 0; i < quantumTabs.tabIds.length; i++) {
		var id = quantumTabs.tabIds[i]
		if (document.getElementById(id).style.display == "block") quantumTabs.update[id]()
	}
}

function toggleAutoTT() {
	if (speedrunMilestonesReached < 2) maxTheorems()
	else player.autoEterOptions.tt = !player.autoEterOptions.tt
	document.getElementById("theoremmax").innerHTML = speedrunMilestonesReached > 2 ? ("Auto max: "+(player.autoEterOptions.tt ? "ON" : "OFF")) : "Buy max Theorems"
}

//v1.8
const MAX_DIL_UPG_PRIORITIES = [5, 4, 3, 1, 2]
function doAutoMetaTick() {
	if (!player.masterystudies) return
	if (player.autoEterOptions.rebuyupg && speedrunMilestonesReached > 6) {
		if (speedrunMilestonesReached > 25) maxAllDilUpgs()
		else for (var i = 0; i < MAX_DIL_UPG_PRIORITIES.length; i++) {
			var id = "r" + MAX_DIL_UPG_PRIORITIES[i]
			if (isDilUpgUnlocked(id)) buyDilationUpgrade(id, false, true)
		}
	}
	for (var d = 1; d <= 8; d++) {
		var dim = d
		if (tmp.ngp3l) dim = 9 - d
		if (player.autoEterOptions["md" + dim] && speedrunMilestonesReached >= 6 + dim) buyMaxMetaDimension(dim)
	}
	if (player.autoEterOptions.metaboost && speedrunMilestonesReached > 14) metaBoost()
}

function toggleAllMetaDims() {
	var turnOn
	var id = 1
	var stop = Math.min(speedrunMilestonesReached - 5, 9)
	while (id < stop&&turnOn === undefined) {
		if (!player.autoEterOptions["md" + id]) turnOn = true
		else if (id > stop-2) turnOn = false
		id++
	}
	for (id = 1; id < stop; id++) player.autoEterOptions["md" + id] = turnOn
	document.getElementById("metaMaxAllDiv").style.display = turnOn && stop > 7 && speedrunMilestonesReached > 27 ? "none" : ""
}

//v1.997
function respecTogglePC() {
	tmp.qu.pairedChallenges.respec = !tmp.qu.pairedChallenges.respec
	document.getElementById("respecPC").className = tmp.qu.pairedChallenges.respec ? "quantumbtn" : "storebtn"
}

//v1.99799
function respecOptions() {
	closeToolTip()
	document.getElementById("respecoptions").style.display="flex"
}

//v1.998
function toggleAutoQuantumContent(id) {
	tmp.qu.autoOptions[id]=!tmp.qu.autoOptions[id]
	if (id=='sacrifice') {
		document.getElementById('sacrificeAuto').textContent = "Auto: " + (tmp.qu.autoOptions.sacrifice ? "ON" : "OFF")
		if (tmp.qu.autoOptions.sacrifice) sacrificeGalaxy(6)
	}
}

//v1.9986
function respecMasteryToggle() {
	player.respecMastery = !player.respecMastery
	updateRespecButtons()
}

//v1.9987
var bankedEterGain
function updateBankedEter(updateHtml = true) {
	bankedEterGain = 0
	if (player.achievements.includes("ng3p15")) bankedEterGain = player.eternities
	if (player.achievements.includes("ng3p73")) bankedEterGain = nA(bankedEterGain, gainEternitiedStat())
	bankedEterGain = nD(bankedEterGain, 20)
	if (updateHtml) {
		setAndMaybeShow("bankedEterGain", bankedEterGain > 0, '"You will gain "+getFullExpansion(bankedEterGain)+" banked eternities on next quantum."')
		setAndMaybeShow("eternitiedBank", player.eternitiesBank, '"You have "+getFullExpansion(player.eternitiesBank)+" banked eternities."')
	}
}

//v1.99871
function fillAll() {
	var oldLength = player.timestudy.studies.length
	for (var t = 0; t < all.length; t++) buyTimeStudy(all[t], 0, true)
	if (player.timestudy.studies.length > oldLength) {
		updateTheoremButtons()
		updateTimeStudyButtons()
		drawStudyTree()
		if (player.timestudy.studies.length > 56) $.notify("All studies in time study tab are now filled.")
	}
}

//v1.99872
function maxAllDilUpgs() {
	let update
	for (var i = 0; i < MAX_DIL_UPG_PRIORITIES.length; i++) {
		var id = "r" + MAX_DIL_UPG_PRIORITIES[i]
		if (isDilUpgUnlocked(id)) {
			if (id == "r1") {	
				var cost = Decimal.pow(10, player.dilation.rebuyables[1] + 5)
				if (player.dilation.dilatedTime.gte(cost)) {
					var toBuy = Math.floor(player.dilation.dilatedTime.div(cost).times(9).add(1).log10())
					var toSpend = Decimal.pow(10, toBuy).sub(1).div(9).times(cost)
					player.dilation.dilatedTime = player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
					player.dilation.rebuyables[1] += toBuy
					update = true
				}
			} else if (id == "r2") {
				if (canBuyGalaxyThresholdUpg()) {
					if (speedrunMilestonesReached > 21) {
						var cost = Decimal.pow(10,player.dilation.rebuyables[2] * 2 + 6)
						if (player.dilation.dilatedTime.gte(cost)) {
							var toBuy = Math.min(Math.floor(player.dilation.dilatedTime.div(cost).times(99).add(1).log(100)), 60 - player.dilation.rebuyables[2])
							var toSpend = Decimal.pow(100,toBuy).sub(1).div(99).times(cost)
							player.dilation.dilatedTime = player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
							player.dilation.rebuyables[2] += toBuy
							resetDilationGalaxies()
							update=true
						}
					} else if (buyDilationUpgrade("r2", true, true)) update = true
				}
			} else while (buyDilationUpgrade(id, true, true)) update = true
		}
	}
	if (update) {
		updateDilationUpgradeCosts()
		updateDilationUpgradeButtons()
	}
}

//v1.99874
function maybeShowFillAll() {
	var display = "none"
	if (player.masterystudies) if (player.masterystudies.includes("t302")) display = "block"
	document.getElementById("fillAll").style.display = display
	document.getElementById("fillAll2").style.display = display
}

//v1.9995
function updateAutoQuantumMode() {
	if (tmp.qu.autobuyer.mode == "amount") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: amount"
		document.getElementById("autoquantumtext").textContent = "Amount of QK to wait until reset:"
	} else if (tmp.qu.autobuyer.mode == "relative") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: X times last quantum"
		document.getElementById("autoquantumtext").textContent = "X times last quantum:"
	} else if (tmp.qu.autobuyer.mode == "time") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: time"
		document.getElementById("autoquantumtext").textContent = "Seconds between quantums:"
	} else if (tmp.qu.autobuyer.mode == "peak") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: peak"
		document.getElementById("autoquantumtext").textContent = "Seconds to wait after latest peak gain:"
	} else if (tmp.qu.autobuyer.mode == "dilation") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: # of dilated"
		document.getElementById("autoquantumtext").textContent = "Wait until # of dilated stat:"
	}
}

function toggleAutoQuantumMode() {
	if (tmp.qu.reachedInfQK && tmp.qu.autobuyer.mode == "amount") tmp.qu.autobuyer.mode = "relative"
	else if (tmp.qu.autobuyer.mode == "relative") tmp.qu.autobuyer.mode = "time"
	else if (tmp.qu.autobuyer.mode == "time") tmp.qu.autobuyer.mode = "peak"
	else if (player.achievements.includes("ng3p25") && tmp.qu.autobuyer.mode != "dilation") tmp.qu.autobuyer.mode = "dilation"
	else tmp.qu.autobuyer.mode = "amount"
	updateAutoQuantumMode()
}

//v1.9997
function toggleAutoReset() {
	tmp.qu.autoOptions.replicantiReset = !tmp.qu.autoOptions.replicantiReset
	document.getElementById('autoReset').textContent = "Auto: " + (tmp.qu.autoOptions.replicantiReset ? "ON" : "OFF")
}

//v2
function autoECToggle() {
	tmp.qu.autoEC = !tmp.qu.autoEC
	document.getElementById("autoEC").className = tmp.qu.autoEC ? "timestudybought" : "storebtn"
}

function toggleRG4Upg() {
	tmp.qu.rg4 = !tmp.qu.rg4
	document.getElementById('rg4toggle').textContent = "Toggle: " + (tmp.qu.rg4 ? "ON":"OFF")
}

var nanospeed = 1


function openAfterEternity() {
	showEternityTab("autoEternity")
	showTab("eternitystore")
}

function toggleABEter() {
	document.getElementById("eternityison").checked = !player.eternityBuyer.isOn
	updateAutobuyers()
}

function updateAutoEterValue() {
	document.getElementById("priority13").value = document.getElementById("autoEterValue").value
	updatePriorities()
}

function toggleAutoEterIfAD() {
	player.eternityBuyer.ifAD = !player.eternityBuyer.ifAD
	document.getElementById("autoEterIfAD").textContent = "Auto-eternity only if able to auto-dilate: O" + (player.eternityBuyer.ifAD ? "N" : "FF")
}

function toggleAutoDil() {
	document.getElementById("dilatedeternityison").checked = !player.eternityBuyer.dilationMode	
	updateAutobuyers()
}

function updateAutoDilValue() {
	document.getElementById("prioritydil").value = document.getElementById("autoDilValue").value
	updatePriorities()
}

function changeAutoDilateMode() {
	if (player.eternityBuyer.dilMode == "amount") player.eternityBuyer.dilMode = "upgrades"
	else player.eternityBuyer.dilMode = "amount"
	document.getElementById("autodilatemode").textContent = "Mode: " + (player.eternityBuyer.dilMode == "amount" ? "Amount of eternities" : "Upgrades")
}

function toggleSlowStop() {
	player.eternityBuyer.slowStop = !player.eternityBuyer.slowStop
	player.eternityBuyer.slowStopped = false
	document.getElementById("slowstop").textContent = "Stop auto-dilate if a little bit of TP is gained: O" + (player.eternityBuyer.slowStop ? "N" : "FF")
}

function toggleAPs() {
	player.eternityBuyer.presets.on = !player.eternityBuyer.presets.on
	document.getElementById("toggleAP").textContent = player.eternityBuyer.presets.on ? "Disable" : "Enable"
}

function bigRip(auto) {
	if (!player.masterystudies.includes("d14") || tmp.qu.electrons.amount < 62500 || !inQC(0)) return
	if (player.ghostify.milestones > 1) {
		tmp.qu.pairedChallenges.order = {1: [1, 2], 2: [3, 4], 3: [5, 7], 4:[6, 8]}
		tmp.qu.pairedChallenges.completed = 4
		for (var c = 1; c < 9; c++) {
			tmp.qu.electrons.mult += (2 - tmp.qu.challenges[c]) * 0.25
			tmp.qu.challenges[c] = 2
		}
		quantum(auto, true, 12, true, true)
	} else {
		for (var p = 1; p < 5; p++) {
			var pcData = tmp.qu.pairedChallenges.order[p]
			if (pcData) {
				var pc1 = Math.min(pcData[0], pcData[1])
				var pc2 = Math.max(pcData[0], pcData[1])
				if (pc1 == 6 && pc2 == 8) {
					if (p - 1 > tmp.qu.pairedChallenges.completed) return
					quantum(auto, true, p + 8, true, true)
				}
			}
		}
	}
}

function toggleBigRipConf() {
	tmp.qu.bigRip.conf = !tmp.qu.bigRip.conf
	document.getElementById("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + (tmp.qu.bigRip.conf ? "N" : "FF")
}

function switchAB() {
	var bigRip = tmp.qu.bigRip.active
	tmp.qu.bigRip["savedAutobuyers" + (bigRip ? "" : "No") + "BR"] = {}
	var data = tmp.qu.bigRip["savedAutobuyers" + (bigRip ? "" : "No") + "BR"]
	for (let d = 1; d < 9; d++) if (player.autobuyers[d-1] % 1 !== 0) data["d" + d] = {
		priority: player.autobuyers[d-1].priority,
		perTen: player.autobuyers[d-1].target > 10,
		on: player.autobuyers[d-1].isOn,
	}
	if (player.autobuyers[8] % 1 !== 0) data.tickspeed = {
		priority: player.autobuyers[8].priority,
		max: player.autobuyers[8].target == 10,
		on: player.autobuyers[8].isOn
	}
	if (player.autobuyers[9] % 1 !== 0) data.dimBoosts = {
		maxDims: player.autobuyers[9].priority,
		always: player.overXGalaxies,
		bulk: player.autobuyers[9].bulk,
		on: player.autobuyers[9].isOn
	}
	if (player.tickspeedBoosts !== undefined) if (player.autobuyers[13] % 1 !== 0) data.tickBoosts = {
		maxDims: player.autobuyers[13].priority,
		always: player.overXGalaxiesTickspeedBoost,
		bulk: player.autobuyers[13].bulk,
		on: player.autobuyers[13].isOn
	}
	if (player.galacticSacrifice !== undefined) if (player.autobuyers[12] % 1 !== 0) data.galSacrifice = {
		amount: player.autobuyers[12].priority,
		on: player.autobuyers[12].isOn
	}
	if (player.autobuyers[11] % 1 !== 0) data.crunch = {
		mode: player.autoCrunchMode,
		amount: new Decimal(player.autobuyers[11].priority),
		on: player.autobuyers[11].isOn
	}
	data.eternity = {
		mode: player.autoEterMode,
		amount: player.eternityBuyer.limit,
		dilation: player.eternityBuyer.dilationMode,
		dilationPerStat: player.eternityBuyer.dilationPerAmount,
		dilMode: player.eternityBuyer.dilMode,
		tpUpgraded: player.eternityBuyer.tpUpgraded,
		slowStop: player.eternityBuyer.slowStop,
		slowStopped: player.eternityBuyer.slowStopped,
		ifAD: player.eternityBuyer.ifAD,
		presets: Object.assign({}, player.eternityBuyer.presets),
		on: player.eternityBuyer.isOn
	}
	data.eternity.presets.order = []
	for (var i = 0; i < player.eternityBuyer.presets.order.length; i++) {
		var id = player.eternityBuyer.presets.order[i]
		data.eternity.presets[id] = Object.assign({}, player.eternityBuyer.presets[id])
		data.eternity.presets.order.push(id)
	}
	if (data.eternity.presets.dil !== undefined) data.eternity.presets.dil = Object.assign({}, data.eternity.presets.dil)
	if (data.eternity.presets.grind !== undefined) data.eternity.presets.grind = Object.assign({}, data.eternity.presets.grind)
	var data = tmp.qu.bigRip["savedAutobuyers" + (bigRip ? "No" : "") + "BR"]
	for (var d = 1; d < 9; d++) if (data["d" + d]) player.autobuyers[d - 1] = {
		interval: player.autobuyers[d - 1].interval,
		cost: player.autobuyers[d - 1].cost,
		bulk: player.autobuyers[d - 1].bulk,
		priority: data["d"+d].priority,
		tier: d,
		target: d + (data["d"+d].perTen ? 10 : 0),
		ticks: 0,
		isOn: data["d"+d].on
	}
	if (data.tickspeed) player.autobuyers[8] = {
		interval: player.autobuyers[8].interval,
		cost: player.autobuyers[8].cost,
		bulk: 1,
		priority: data.tickspeed.priority,
		tier: 1,
		target: player.autobuyers[8].target,
		ticks: 0,
		isOn: data.tickspeed.on
	}
	if (data.dimBoosts) {
		player.autobuyers[9] = {
			interval: player.autobuyers[9].interval,
			cost: player.autobuyers[9].cost,
			bulk: data.dimBoosts.bulk,
			priority: data.dimBoosts.maxDims,
			tier: 1,
			target: 11,
			ticks: 0,
			isOn: data.dimBoosts.on
		}
		player.overXGalaxies = data.dimBoosts.always
	}
	if (data.tickBoosts) {
		player.autobuyers[13] = {
			interval: player.autobuyers[13].interval,
			cost: player.autobuyers[13].cost,
			bulk: data.tickBoosts.bulk,
			priority: data.tickBoosts.maxDims,
			tier: 1,
			target: 14,
			ticks: 0,
			isOn: data.tickBoosts.on
		}
		player.overXGalaxiesTickspeedBoost = data.tickBoosts.always
	}
	if (data.galacticSacrifice) player.autobuyers[12] = {
		interval: player.autobuyers[12].interval,
		cost: player.autobuyers[12].cost,
		bulk: 1,
		priority: data.galacticSacrifice.amount,
		tier: 1,
		target: 13,
		ticks: 0,
		isOn: data.galacticSacrifice.on
	}
	if (data.crunch) {
		player.autobuyers[11] = {
			interval: player.autobuyers[11].interval,
			cost: player.autobuyers[11].cost,
			bulk: 1,
			priority: new Decimal(data.crunch.amount),
			tier: 1,
			target: 12,
			ticks: 0,
			isOn: data.crunch.on
		}
		player.autoCrunchMode = data.crunch.mode
	}
	if (data.eternity) {
		player.eternityBuyer = {
			limit: data.eternity.amount,
			dilationMode: data.eternity.dilation,
			dilationPerAmount: data.eternity.dilationPerStat,
			statBeforeDilation: data.eternity.dilationPerStat,
			dilMode: data.eternity.dilMode ? data.eternity.dilMode : "amount",
			tpUpgraded: data.eternity.tpUpgraded ? data.eternity.tpUpgraded : false,
			slowStop: data.eternity.slowStop ? data.eternity.slowStop : false,
			slowStopped: data.eternity.slowStopped ? data.eternity.slowStopped : false,
			ifAD: data.eternity.ifAD ? data.eternity.ifAD : false,
			presets: data.eternity.presets ? data.eternity.presets : {on: false, autoDil: false, selected: -1, selectNext: 0, left: 1, order: []},
			isOn: data.eternity.on
		}
		if (player.eternityBuyer.presets.selectNext === undefined) {
			player.eternityBuyer.presets.selected = -1
			player.eternityBuyer.presets.selectNext = 0
		}
		if (player.eternityBuyer.presets.left === undefined) player.eternityBuyer.presets.left = 1
		player.autoEterMode = data.eternity.mode
	}
	tmp.qu.bigRip["savedAutobuyers" + (bigRip ? "No" : "") + "BR"] = {}
	updateCheckBoxes()
	loadAutoBuyerSettings()
	if (player.autoCrunchMode == "amount") {
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
		document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
	} else if (player.autoCrunchMode == "time") {
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: time"
		document.getElementById("limittext").textContent = "Seconds between crunches:"
	} else {
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
		document.getElementById("limittext").textContent = "X times last crunch:"
	}
	updateAutoEterMode()
}

function getGHPGain() {
	if (!tmp.ngp3 || !tmp.qu.bigRip.active) return new Decimal(0)
	if (!tmp.ngp3l && !ghostified) return new Decimal(1)
	let log = tmp.qu.bigRip.bestThisRun.log10() / getQCGoal(undefined,true) - 1
	if (log < 0) return new Decimal(0)
	if (tmp.ngp3l) {
		log *= 2
	} else if (player.achievements.includes("ng3p58")) { 
		//the square part of the formula maxes at e10, and gets weaker after ~e60 total
		let x = Math.min(7, log / 2) + Math.min(3, log / 2)
		y = player.ghostify.ghostParticles.plus(Decimal.pow(10, log)).plus(10).log10()
		if (!player.achievements.includes("ng3p84")) x = Math.min(x, 600 / y)
		log += x
	}
	return Decimal.pow(10, log).times(getGHPMult()).floor()
}

function getGHPMult() {
	let x = Decimal.pow(2, player.ghostify.multPower - 1)
	if (player.achievements.includes("ng3p93")) x = x.times(500)
	if (player.achievements.includes("ng3p83")) x = x.times(ranking + 1)
	if (player.achievements.includes("ng3p97")) x = x.times(Decimal.pow(player.ghostify.times + 1, 1/3))
	return x
}

ghostified = false
function ghostify(auto, force) {
	if (!force&&(!isQuantumReached()||!tmp.qu.bigRip.active||implosionCheck)) return
	if (!auto && !force && player.aarexModifications.ghostifyConf && !confirm("Becoming a ghost resets everything Quantum resets, and also resets your banked stats, best TP & MA, quarks, gluons, electrons, Quantum Challenges, Replicants, Nanofield, and Tree of Decay to gain a Ghost Particle. Are you ready for this?")) {
		denyGhostify()
		return
	}
	if (!ghostified && (!confirm("Are you sure you want to do this? You will lose everything you have!") || !confirm("ARE YOU REALLY SURE YOU WANT TO DO THAT? YOU CAN'T UNDO THIS AFTER YOU BECAME A GHOST AND PASS THE UNIVERSE EVEN IT IS BIG RIPPED! THIS IS YOUR LAST CHANCE!"))) {
		denyGhostify()
		return
	}
	var implode = player.options.animations.ghostify && !force
	if (implode) {
		var gain = getGHPGain()
		var amount = player.ghostify.ghostParticles.add(gain).round()
		var seconds = ghostified ? 4 : 10
		implosionCheck=1
		dev.ghostify(gain, amount, seconds)
		setTimeout(function(){
			isEmptiness = true
			showTab("")
		}, seconds * 250)
		setTimeout(function(){
			if (Math.random()<1e-3) giveAchievement("Boo!")
			ghostifyReset(true, gain, amount)
		}, seconds * 500)
		setTimeout(function(){
			implosionCheck=0
		}, seconds * 1000)
	} else ghostifyReset(false, 0, 0, force)
	updateAutoQuantumMode()
}

var ghostifyDenied
function denyGhostify() {
	ghostifyDenied++
	if (!tmp.ngp3l && ghostifyDenied >= 15) giveAchievement("You are supposed to become a ghost!")
}

function ghostifyReset(implode, gain, amount, force) {
	var bulk = getGhostifiedGain()
	if (!force) {
		if (!tmp.ngp3l && tmp.qu.times >= 1e3 && player.ghostify.milestones >= 16) giveAchievement("Scared of ghosts?")
		if (!implode) {
			var gain = getGHPGain()
			player.ghostify.ghostParticles = player.ghostify.ghostParticles.add(gain).round()
		} else player.ghostify.ghostParticles = amount
		for (var i=player.ghostify.last10.length-1; i>0; i--) player.ghostify.last10[i] = player.ghostify.last10[i-1]
		player.ghostify.last10[0] = [player.ghostify.time, gain]
		player.ghostify.times = nA(player.ghostify.times, bulk)
		player.ghostify.best = Math.min(player.ghostify.best, player.ghostify.time)
		while (tmp.qu.times <= tmp.bm[player.ghostify.milestones]) player.ghostify.milestones++
	}
	if (tmp.qu.bigRip.active) switchAB()
	var bm = player.ghostify.milestones
	var nBRU = []
	var nBEU = []
	for (var u = 20; u > 0; u--) {
		if (nBRU.includes(u + 1) || tmp.qu.bigRip.upgrades.includes(u)) nBRU.push(u)
		if (u < 11 && u != 7 && (nBEU.includes(u + 1) || tmp.qu.breakEternity.upgrades.includes(u))) nBEU.push(u)
	}
	if (bm > 2) for (var c=1;c<9;c++) tmp.qu.electrons.mult += .5 - QCIntensity(c) * .25
	if (bm > 6 && !force && player.achievements.includes("ng3p68")) gainNeutrinos(Decimal.times(2e3 * tmp.qu.bigRip.bestGals, bulk), "all")
	if (bm > 15) giveAchievement("I rather oppose the theory of everything")
	if (player.eternityPoints.e>=22e4&&player.ghostify.under) giveAchievement("Underchallenged")
	if (player.eternityPoints.e>=375e3&&inQCModifier("ad")) giveAchievement("Overchallenged")
	if (player.ghostify.best<=6) giveAchievement("Running through Big Rips")
	player.ghostify.time = 0
	doGhostifyResetStuff(implode, gain, amount, force, bulk, nBRU, nBEU)
	
	tmp.qu = player.quantum
	updateInQCs()
	doPreInfinityGhostifyResetStuff()
	doInfinityGhostifyResetStuff(implode, bm)
	doEternityGhostifyResetStuff(implode, bm)	
	doQuantumGhostifyResetStuff(implode, bm)
	doGhostifyGhostifyResetStuff(bm, force)

	//After that...
	resetUP()
}

function toggleGhostifyConf() {
	player.aarexModifications.ghostifyConf = !player.aarexModifications.ghostifyConf
	document.getElementById("ghostifyConfirmBtn").textContent = "Ghostify confirmation: O" + (player.aarexModifications.ghostifyConf ? "N" : "FF")
}

function getGHPRate(num) {
	if (num.lt(1 / 60)) return (num * 1440).toFixed(1) + " GhP/day"
	if (num.lt(1)) return (num * 60).toFixed(1) + " GhP/hr"
	return shorten(num) + " GhP/min"
}

var averageGHP = new Decimal(0)
var bestGHP
function updateLastTenGhostifies() {
	if (player.masterystudies === undefined) return
	var listed = 0
	var tempTime = new Decimal(0)
	var tempGHP = new Decimal(0)
	for (var i=0; i<10; i++) {
		if (player.ghostify.last10[i][1].gt(0)) {
			var qkpm = player.ghostify.last10[i][1].dividedBy(player.ghostify.last10[i][0]/600)
			var tempstring = shorten(qkpm) + " GhP/min"
			if (qkpm<1) tempstring = shorten(qkpm*60) + " GhP/hour"
			var msg = "The Ghostify " + (i == 0 ? '1 Ghostify' : (i+1) + ' Ghostifies') + " ago took " + timeDisplayShort(player.ghostify.last10[i][0], false, 3) + " and gave " + shortenDimensions(player.ghostify.last10[i][1]) +" GhP. "+ tempstring
			document.getElementById("ghostifyrun"+(i+1)).textContent = msg
			tempTime = tempTime.plus(player.ghostify.last10[i][0])
			tempGHP = tempGHP.plus(player.ghostify.last10[i][1])
			bestGHP = player.ghostify.last10[i][1].max(bestGHP)
			listed++
		} else document.getElementById("ghostifyrun"+(i+1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempGHP = tempGHP.dividedBy(listed)
		var qkpm = tempGHP.dividedBy(tempTime/600)
		var tempstring = shorten(qkpm) + " GhP/min"
		averageGHP = tempGHP
		if (qkpm<1) tempstring = shorten(qkpm*60) + " GhP/hour"
		document.getElementById("averageGhostifyRun").textContent = "Last " + listed + " Ghostifies average time: "+ timeDisplayShort(tempTime, false, 3)+" Average GhP gain: "+shortenDimensions(tempGHP)+" GhP. "+tempstring
	} else document.getElementById("averageGhostifyRun").textContent = ""
}

function updateBraveMilestones() {
	if (ghostified) {
		for (var m = 1; m < 17;m++) document.getElementById("braveMilestone" + m).className = "achievement achievement" + (player.ghostify.milestones < m ? "" : "un") + "locked"
		for (var r = 1; r < 3; r++) document.getElementById("braveRow" + r).className = player.ghostify.milestones < r * 8 ? "" : "completedrow"
	}
}

function showGhostifyTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('ghostifytab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab !== tabName) player.aarexModifications.tabsSave.tabGhostify = tabName
	closeToolTip()
}

function updateGhostifyTabs() {
	if (document.getElementById("neutrinos").style.display == "block") updateNeutrinosTab()
	if (document.getElementById("automaticghosts").style.display == "block") if (player.ghostify.milestones > 7) updateQuantumWorth("display")
	if (document.getElementById("gphtab").style.display == "block" && player.ghostify.ghostlyPhotons.unl) updatePhotonsTab()
	if (document.getElementById("bltab").style.display == "block" && player.ghostify.wzb.unl) updateBosonicLabTab()
}

function buyGHPMult() {
	let sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost = getGHPMultCost()
	if (sum.lt(cost)) return
	subNeutrinos(cost)
	player.ghostify.multPower++
	player.ghostify.automatorGhosts[15].a = player.ghostify.automatorGhosts[15].a.times(5)
	document.getElementById("autoGhost15a").value = formatValue("Scientific", player.ghostify.automatorGhosts[15].a, 2, 1)
	document.getElementById("ghpMult").textContent = shortenDimensions(Decimal.pow(2,player.ghostify.multPower-1))
	document.getElementById("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
}

function maxGHPMult() {
	let sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost = getGHPMultCost()
	if (sum.lt(cost)) return
	if (player.ghostify.multPower < 85) {
		let toBuy=Math.min(Math.floor(sum.div(cost).times(24).add(1).log(25)),85-player.ghostify.multPower)
		subNeutrinos(Decimal.pow(25,toBuy).sub(1).div(24).times(cost))
		player.ghostify.multPower+=toBuy
		player.ghostify.automatorGhosts[15].a=player.ghostify.automatorGhosts[15].a.times(Decimal.pow(5,toBuy))
		document.getElementById("autoGhost15a").value=formatValue("Scientific", player.ghostify.automatorGhosts[15].a, 2, 1)
		cost=getGHPMultCost()
	}
	if (player.ghostify.multPower>84) {
		let b=player.ghostify.multPower*2-167
		let x=Math.floor((-b+Math.sqrt(b*b+4*sum.div(cost).log(5)))/2)+1
		if (x) {
			let toBuy=x
			let toSpend=0
			while (x>0) {
				cost=getGHPMultCost(x-1)
				if (sum.div(cost).gt(1e16)) break
				toSpend=cost.add(toSpend)
				if (sum.lt(toSpend)) {
					toSpend=cost
					toBuy--
				}
				x--
			}
			subNeutrinos(toSpend)
			player.ghostify.multPower+=toBuy
		}
	}
	document.getElementById("ghpMult").textContent=shortenDimensions(Decimal.pow(2,player.ghostify.multPower-1))
	document.getElementById("ghpMultUpgCost").textContent=shortenDimensions(getGHPMultCost())
}

function setupAutomaticGhostsData() {
	var data = {power: 0, ghosts: 3}
	for (var ghost=1; ghost <= getMaxAutoGhosts(); ghost++) data[ghost] = {on: false}
	data[4].mode = "q"
	data[4].rotate = "r"
	data[11].pw = 1
	data[11].lw = 1
	data[11].cw = 1
	data[15].a = 1
	return data
}

var autoGhostRequirements=[2,4,4,4.5,5,5,6,6.5,7,7,7.5,8,20,24,28,32,36,40]
var powerConsumed
var powerConsumptions=[0,1,1,1,1,2,2,0.5,0.5,0.5,1,0.5,0.5,0.5,0.5,0.5,6,3,6,3,9,3]
function updateAutoGhosts(load) {
	var data = player.ghostify.automatorGhosts
	if (load) {
		for (var x = 1; x <= getMaxAutoGhosts(); x++) if (data[x] === undefined) data[x] = {on: false}
		if (data.ghosts >= getMaxAutoGhosts()) document.getElementById("nextAutomatorGhost").parentElement.style.display="none"
		else {
			document.getElementById("automatorGhostsAmount").textContent=data.ghosts
			document.getElementById("nextAutomatorGhost").parentElement.style.display=""
			document.getElementById("nextAutomatorGhost").textContent=autoGhostRequirements[data.ghosts-3].toFixed(2)
		}
	}
	powerConsumed=0
	for (var ghost = 1; ghost <= getMaxAutoGhosts(); ghost++) {
		if (ghost>data.ghosts) {
			if (load) document.getElementById("autoGhost"+ghost).style.display="none"
		} else {
			if (load) {
				document.getElementById("autoGhost"+ghost).style.display=""
				document.getElementById("isAutoGhostOn"+ghost).checked=data[ghost].on
			}
			if (data[ghost].on) powerConsumed+=powerConsumptions[ghost]
		}
	}
	if (load) {
		document.getElementById("autoGhostMod4").textContent = "Every " + (data[4].mode == "t" ? "second" : "Quantum")
		document.getElementById("autoGhostRotate4").textContent = data[4].rotate == "l" ? "Left" : "Right"
		document.getElementById("autoGhost11pw").value = data[11].pw
		document.getElementById("autoGhost11lw").value = data[11].lw
		document.getElementById("autoGhost11cw").value = data[11].cw
		document.getElementById("autoGhost13t").value = data[13].t
		document.getElementById("autoGhost13u").value = data[13].u
		document.getElementById("autoGhost15a").value = formatValue("Scientific", data[15].a, 2, 1)
	}
	document.getElementById("consumedPower").textContent = powerConsumed.toFixed(2)
	isAutoGhostsSafe = data.power >= powerConsumed
	document.getElementById("tooMuchPowerConsumed").style.display = isAutoGhostsSafe ? "none" : ""
}

function toggleAutoGhost(id) {
	player.ghostify.automatorGhosts[id].on = document.getElementById("isAutoGhostOn" + id).checked
	updateAutoGhosts()
}

function isAutoGhostActive(id) {
	if (!ghostified) return
	return player.ghostify.automatorGhosts[id].on
}

function changeAutoGhost(o) {
	if (o == "4m") {
		player.ghostify.automatorGhosts[4].mode = player.ghostify.automatorGhosts[4].mode == "t" ? "q" : "t"
		document.getElementById("autoGhostMod4").textContent = "Every " + (player.ghostify.automatorGhosts[4].mode == "t" ? "second" : "Quantum")
	} else if (o == "4r") {
		player.ghostify.automatorGhosts[4].rotate = player.ghostify.automatorGhosts[4].rotate == "l" ? "r" : "l"
		document.getElementById("autoGhostRotate4").textContent = player.ghostify.automatorGhosts[4].rotate == "l" ? "Left" : "Right"
	} else if (o == "11pw") {
		var num = parseFloat(document.getElementById("autoGhost11pw").value)
		if (!isNaN(num) && num > 0) player.ghostify.automatorGhosts[11].pw = num
	} else if (o == "11lw") {
		var num = parseFloat(document.getElementById("autoGhost11lw").value)
		if (!isNaN(num) && num > 0) player.ghostify.automatorGhosts[11].lw = num
	} else if (o == "11cw") {
		var num = parseFloat(document.getElementById("autoGhost11cw").value)
		if (!isNaN(num) && num > 0) player.ghostify.automatorGhosts[11].cw = num
	} else if (o == "13t") {
		var num = parseFloat(document.getElementById("autoGhost13t").value)
		if (!isNaN(num) && num >= 0) player.ghostify.automatorGhosts[13].t = num
	} else if (o == "13u") {
		var num = parseFloat(document.getElementById("autoGhost13u").value)
		if (!isNaN(num) && num > 0) player.ghostify.automatorGhosts[13].u = num
	} else if (o == "15a") {
		var num = fromValue(document.getElementById("autoGhost15a").value)
		if (!isNaN(break_infinity_js ? num : num.l)) player.ghostify.automatorGhosts[15].a = num
	}
}

function rotateAutoUnstable() {
	var tg=player.ghostify.automatorGhosts[3].on
	if (player.ghostify.automatorGhosts[4].rotate=="l") {
		player.ghostify.automatorGhosts[3].on = player.ghostify.automatorGhosts[1].on
		player.ghostify.automatorGhosts[1].on = player.ghostify.automatorGhosts[2].on
		player.ghostify.automatorGhosts[2].on = tg
	} else {
		player.ghostify.automatorGhosts[3].on = player.ghostify.automatorGhosts[2].on
		player.ghostify.automatorGhosts[2].on = player.ghostify.automatorGhosts[1].on
		player.ghostify.automatorGhosts[1].on = tg
	}
	for (var g = 1; g < 4; g++) document.getElementById("isAutoGhostOn" + g).checked = player.ghostify.automatorGhosts[g].on
}

function getMaxAutoGhosts() {
	return tmp.ngp3l ? 15 : 21
}

//v2.1
function startEC10() {
	if (canUnlockEC(10, 550, 181)) {
		justImported = true
		document.getElementById("ec10unl").onclick()
		justImported = false
	}
	startEternityChallenge(10)
}

function getGHPMultCost(offset=0) {
	let lvl=player.ghostify.multPower+offset
	return Decimal.pow(5, lvl * 2 + Math.max(lvl - 85, 0) * (lvl - 84) - 1).times(25e8)

}

//v2.2
function canBuyGalaxyThresholdUpg() {
	return !tmp.ngp3 || player.dilation.rebuyables[2] < 60
}

function showNFTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('nftab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab !== tabName) player.aarexModifications.tabsSave.tabNF = tabName
	closeToolTip()
}

function getGhostifiedGain() {
	let r = 1
	if (hasBosonicUpg(15)) r = nN(tmp.blu[15].gh)
	return r
}

function toggleLEConf() {
	player.aarexModifications.leNoConf = !player.aarexModifications.leNoConf
	document.getElementById("leConfirmBtn").textContent = "Light Empowerment confirmation: O" + (player.aarexModifications.leNoConf ? "FF" : "N")
}

//Anti-Preontius' Lair
function getAntiPreonGhostWake() {
	return 104
}

//v2.21: NG+3.1
function setNonlegacyStuff() {
}

function displayNonlegacyStuff() {
	//QC Modifiers
	for (var m = 1; m < qcm.modifiers.length; m++) document.getElementById("qcm_" + qcm.modifiers[m]).style.display = tmp.ngp3l ? "none" : ""
}

function getOldAgeRequirement() {
	let year = new Date().getFullYear() || 2020
	if (tmp.ngp3l) year = 2019
	return Decimal.pow(10, 3 * 86400 * 365.2425 * year)
}

//v2.302
function NGP3andVanillaCheck() {
	return (tmp.ngp3 && !tmp.ngp3l) || !player.aarexModifications.newGamePlusPlusVersion
}
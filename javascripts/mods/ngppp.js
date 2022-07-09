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
		aarMod.tabsSave.tabQuantum = tabName
		if (tabName == "uquarks" && el("quantumtab").style.display !== "none") {
			resizeCanvas()
			requestAnimationFrame(drawQuarkAnimation)
		}
	}
	closeToolTip()
}

var quantumTabs = {
	tabIds: ["uquarks", "gluons", "electrons", "replicants", "tod", "bigrip"],
	update: {
		uquarks: updateQuarksTab,
		gluons: updateGluonsTab,
		electrons: updateElectronsTab,
		replicants: updateReplicantsTab,
		tod: updateTreeOfDecayTab,
		bigrip: updateRipTabs
	}
}

function updateQuantumTabs() {
	for (var i = 0; i < quantumTabs.tabIds.length; i++) {
		var id = quantumTabs.tabIds[i]
		if (el(id).style.display == "block") quantumTabs.update[id]()
	}
}

function toggleAutoTT() {
	if (speedrunMilestonesReached < 2) maxTheorems()
	else player.autoEterOptions.tt = !player.autoEterOptions.tt
	el("theoremmax").innerHTML = speedrunMilestonesReached > 2 ? ("Auto max: "+(player.autoEterOptions.tt ? "ON" : "OFF")) : "Buy max Theorems"
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
	el("metaMaxAllDiv").style.display = turnOn && stop > 7 && speedrunMilestonesReached > 27 ? "none" : ""
}

//v1.997
function respecTogglePC() {
	quSave.pairedChallenges.respec = !quSave.pairedChallenges.respec
	el("respecPC").className = quSave.pairedChallenges.respec ? "quantumbtn" : "storebtn"
}

//v1.99799
function respecOptions() {
	closeToolTip()
	el("respecoptions").style.display="flex"
}

//v1.998
function toggleAutoQuantumContent(id) {
	quSave.autoOptions[id]=!quSave.autoOptions[id]
	if (id=='sacrifice') {
		el('sacrificeAuto').textContent = "Auto: " + (quSave.autoOptions.sacrifice ? "ON" : "OFF")
		if (quSave.autoOptions.sacrifice) sacrificeGalaxy(6)
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
	if (hasAch("ng3p15")) bankedEterGain = player.eternities
	if (hasAch("ng3p73")) bankedEterGain = nA(bankedEterGain, gainEternitiedStat())
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
				var cost = pow10(player.dilation.rebuyables[1] + 5)
				if (player.dilation.dilatedTime.gte(cost)) {
					var toBuy = Math.floor(player.dilation.dilatedTime.div(cost).times(9).add(1).log10())
					var toSpend = pow10(toBuy).sub(1).div(9).times(cost)
					player.dilation.dilatedTime = player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
					player.dilation.rebuyables[1] += toBuy
					update = true
				}
			} else if (id == "r2") {
				if (canBuyGalaxyThresholdUpg()) {
					if (speedrunMilestonesReached > 21) {
						var cost = pow10(player.dilation.rebuyables[2] * 2 + 6)
						if (player.dilation.dilatedTime.gte(cost)) {
							var toBuy = Math.min(Math.floor(player.dilation.dilatedTime.div(cost).times(99).add(1).log(100)), 60 - player.dilation.rebuyables[2])
							var toSpend = E_pow(100,toBuy).sub(1).div(99).times(cost)
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
	el("fillAll").style.display = display
	el("fillAll2").style.display = display
}

//v1.9995
function updateAutoQuantumMode() {
	if (quSave.autobuyer.mode == "amount") {
		el("toggleautoquantummode").textContent = "Auto quantum mode: amount"
		el("autoquantumtext").textContent = "Amount of QK to wait until reset:"
	} else if (quSave.autobuyer.mode == "relative") {
		el("toggleautoquantummode").textContent = "Auto quantum mode: X times last quantum"
		el("autoquantumtext").textContent = "X times last quantum:"
	} else if (quSave.autobuyer.mode == "time") {
		el("toggleautoquantummode").textContent = "Auto quantum mode: time"
		el("autoquantumtext").textContent = "Seconds between quantums:"
	} else if (quSave.autobuyer.mode == "peak") {
		el("toggleautoquantummode").textContent = "Auto quantum mode: peak"
		el("autoquantumtext").textContent = "Seconds to wait after latest peak gain:"
	} else if (quSave.autobuyer.mode == "dilation") {
		el("toggleautoquantummode").textContent = "Auto quantum mode: # of dilated"
		el("autoquantumtext").textContent = "Wait until # of dilated stat:"
	}
}

function toggleAutoQuantumMode() {
	if (quSave.reachedInfQK && quSave.autobuyer.mode == "amount") quSave.autobuyer.mode = "relative"
	else if (quSave.autobuyer.mode == "relative") quSave.autobuyer.mode = "time"
	else if (quSave.autobuyer.mode == "time") quSave.autobuyer.mode = "peak"
	else if (hasAch("ng3p25") && quSave.autobuyer.mode != "dilation") quSave.autobuyer.mode = "dilation"
	else quSave.autobuyer.mode = "amount"
	updateAutoQuantumMode()
}

//v1.9997
function toggleAutoReset() {
	quSave.autoOptions.replicantiReset = !quSave.autoOptions.replicantiReset
	el('autoReset').textContent = "Auto: " + (quSave.autoOptions.replicantiReset ? "ON" : "OFF")
}

//v2
function autoECToggle() {
	quSave.autoEC = !quSave.autoEC
	el("autoEC").className = quSave.autoEC ? "timestudybought" : "storebtn"
}

var nanospeed = 1
function bigRip(auto) {
	if (!player.masterystudies.includes("d14") || quSave.electrons.amount < 62500 || !inQC(0)) return
	if (ghSave.milestones > 1) {
		quSave.pairedChallenges.order = {1: [1, 2], 2: [3, 4], 3: [5, 7], 4:[6, 8]}
		quSave.pairedChallenges.completed = 4
		for (var c = 1; c < 9; c++) {
			quSave.electrons.mult += (2 - quSave.challenges[c]) * 0.25
			quSave.challenges[c] = 2
		}
		quantum(auto, true, 12, true, true)
	} else {
		for (var p = 1; p < 5; p++) {
			var pcData = quSave.pairedChallenges.order[p]
			if (pcData) {
				var pc1 = Math.min(pcData[0], pcData[1])
				var pc2 = Math.max(pcData[0], pcData[1])
				if (pc1 == 6 && pc2 == 8) {
					if (p - 1 > quSave.pairedChallenges.completed) return
					quantum(auto, true, p + 8, true, true)
				}
			}
		}
	}
}

function toggleBigRipConf() {
	brSave.conf = !brSave.conf
	el("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + (brSave.conf ? "N" : "FF")
}

function switchAB() {
	var bigRip = brSave && brSave.active
	brSave["savedAutobuyers" + (bigRip ? "" : "No") + "BR"] = {}
	var data = brSave["savedAutobuyers" + (bigRip ? "" : "No") + "BR"]
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
		amount: E(player.autobuyers[11].priority),
		on: player.autobuyers[11].isOn
	}
	data.eternity = {
		mode: player.autoEterMode,
		amount: player.eternityBuyer.limit,
		dilation: player.eternityBuyer.dilationMode,
		dilationPerStat: player.eternityBuyer.dilationPerAmount,
		on: player.eternityBuyer.isOn
	}
	var data = brSave["savedAutobuyers" + (bigRip ? "No" : "") + "BR"]
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
			priority: E(data.crunch.amount),
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
			isOn: data.eternity.on
		}
		player.autoEterMode = data.eternity.mode
	}
	brSave["savedAutobuyers" + (bigRip ? "No" : "") + "BR"] = {}
	updateCheckBoxes()
	loadAutoBuyerSettings()
	if (player.autoCrunchMode == "amount") {
		el("togglecrunchmode").textContent = "Auto crunch mode: amount"
		el("limittext").textContent = "Amount of IP to wait until reset:"
	} else if (player.autoCrunchMode == "time") {
		el("togglecrunchmode").textContent = "Auto crunch mode: time"
		el("limittext").textContent = "Seconds between crunches:"
	} else {
		el("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
		el("limittext").textContent = "X times last crunch:"
	}
	updateAutoEterMode()
}

function getGHPGain() {
	if (!tmp.ngp3 || !brSave.active) return E(0)
	if (!ghostified) return E(1)
	let log = brSave && brSave.bestThisRun.log10() / getQCGoal(undefined,true) - 1
	if (log < 0) return E(0)
	if (tmp.ngp3l) {
		log *= 2
	} else if (hasAch("ng3p58")) { 
		//the square part of the formula maxes at e10, and gets weaker after ~e60 total
		let x = Math.min(7, log / 2) + Math.min(3, log / 2)
		y = ghSave.ghostParticles.plus(pow10(log)).plus(10).log10()
		if (!hasAch("ng3p84")) x = Math.min(x, 600 / y)
		log += x
	}
	let x = pow10(log).times(getGHPMult())
	//x = doStrongerPowerReductionSoftcapDecimal(x,E("e30000"),0.5)
	return x.floor()
}

function getGHPBaseMult() {
	return E_pow(3, ghSave.multPower - 1)
}

function getGHPMult() {
	let x = getGHPBaseMult()
	if (hasAch("ng3p93")) x = x.times(500)
	if (hasAch("ng3p83")) x = x.times(ranking + 1)
	if (hasAch("ng3p97")) x = x.times(E_pow(ghSave.times + 1, 1/3))
	return x
}

ghostified = false
function ghostify(auto, force) {
	if (!force&&(!isQuantumReached()||!brSave.active||implosionCheck)) return
	if (!auto && !force && aarMod.ghostifyConf && !confirm("Becoming a ghost resets everything Quantum resets, and also resets your banked stats, best TP & MA, quarks, gluons, electrons, Quantum Challenges, Duplicants, Nanofield, and Tree of Decay to gain a Elementary Particle. Are you ready for this?")) {
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
		var amount = ghSave.ghostParticles.add(gain).round()
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
	if (ghostifyDenied >= 15) giveAchievement("You are supposed to become a ghost!")
}

function ghostifyReset(implode, gain, amount, force) {
	var bulk = getGhostifiedGain()
	if (!force) {
		if (quSave.times >= 1e3 && ghSave.milestones >= 16) giveAchievement("Scared of ghosts?")
		if (!implode) {
			var gain = getGHPGain()
			ghSave.ghostParticles = ghSave.ghostParticles.add(gain).round()
		} else ghSave.ghostParticles = amount
		for (var i=ghSave.last10.length-1; i>0; i--) ghSave.last10[i] = ghSave.last10[i-1]
		ghSave.last10[0] = [ghSave.time, gain]
		ghSave.times = nA(ghSave.times, bulk)
		ghSave.best = Math.min(ghSave.best, ghSave.time)
		while (quSave.times <= tmp.bm[ghSave.milestones]) ghSave.milestones++
	}
	if (brSave.active) switchAB()
	var bm = ghSave.milestones
	var nBRU = []
	var nBEU = []
	for (var u = 20; u > 0; u--) {
		if (nBRU.includes(u + 1) || hasRipUpg(u)) nBRU.push(u)
		if (u < 12 && u != 7 && (nBEU.includes(u + 1) || beSave.upgrades.includes(u))) nBEU.push(u)
	}
	if (bm > 2) for (var c=1;c<9;c++) quSave.electrons.mult += .5 - QCIntensity(c) * .25
	if (bm > 6 && !force && hasAch("ng3p68")) gainNeutrinos(Decimal.times(2e3 * brSave.bestGals, bulk), "all")
	if (bm > 15) giveAchievement("I rather oppose the theory of everything")
	if (player.eternityPoints.e>=22e4&&ghSave.under) giveAchievement("Underchallenged")
	if (player.eternityPoints.e>=375e3&&inQCModifier("ad")) giveAchievement("Overchallenged")
	if (ghSave.best<=6) giveAchievement("Running through Big Rips")
	ghSave.time = 0
	doGhostifyResetStuff(implode, gain, amount, force, bulk, nBRU, nBEU)
	
	quSave = player.quantum
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
	aarMod.ghostifyConf = !aarMod.ghostifyConf
	el("ghostifyConfirmBtn").textContent = "Ghostify confirmation: O" + (aarMod.ghostifyConf ? "N" : "FF")
}

function getGHPRate(num) {
	if (num.lt(1 / 60)) return (num * 1440).toFixed(1) + " ElP/day"
	if (num.lt(1)) return (num * 60).toFixed(1) + " ElP/hr"
	return shorten(num) + " ElP/min"
}

var averageGHP = E(0)
var bestGHP
function updateLastTenGhostifies() {
	if (player.masterystudies === undefined) return
	var listed = 0
	var tempTime = E(0)
	var tempGHP = E(0)
	for (var i=0; i<10; i++) {
		if (ghSave.last10[i][1].gt(0)) {
			var qkpm = ghSave.last10[i][1].dividedBy(ghSave.last10[i][0]/600)
			var tempstring = shorten(qkpm) + " ElP/min"
			if (qkpm<1) tempstring = shorten(qkpm*60) + " ElP/hour"
			var msg = "The Fundament " + (i+1) + " ago took " + timeDisplayShort(ghSave.last10[i][0], false, 3) + " and gave " + shortenDimensions(ghSave.last10[i][1]) +" ElP. "+ tempstring
			el("ghostifyrun"+(i+1)).textContent = msg
			tempTime = tempTime.plus(ghSave.last10[i][0])
			tempGHP = tempGHP.plus(ghSave.last10[i][1])
			bestGHP = ghSave.last10[i][1].max(bestGHP)
			listed++
		} else el("ghostifyrun"+(i+1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempGHP = tempGHP.dividedBy(listed)
		var qkpm = tempGHP.dividedBy(tempTime/600)
		var tempstring = shorten(qkpm) + " ElP/min"
		averageGHP = tempGHP
		if (qkpm<1) tempstring = shorten(qkpm*60) + " ElP/hour"
		el("averageGhostifyRun").textContent = "Last " + listed + " Fundaments average time: "+ timeDisplayShort(tempTime, false, 3)+" Average ElP gain: "+shortenDimensions(tempGHP)+" ElP. "+tempstring
	} else el("averageGhostifyRun").textContent = ""
}

function updateBraveMilestones() {
	if (ghostified) {
		for (var m = 1; m < 17;m++) el("braveMilestone" + m).className = "achievement achievement" + (ghSave.milestones < m ? "" : "un") + "locked"
		for (var r = 1; r < 3; r++) el("braveRow" + r).className = ghSave.milestones < r * 8 ? "" : "completedrow"
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
	if (oldTab !== tabName) aarMod.tabsSave.tabGhostify = tabName
	closeToolTip()
}

function updateGhostifyTabs() {
	if (el("neutrinos").style.display == "block") updateNeutrinosTab()
	if (el("automaticghosts").style.display == "block") if (ghSave.milestones > 7) updateQuantumWorth("display")
	if (el("gphtab").style.display == "block" && ghSave.ghostlyPhotons.unl) updatePhotonsTab()
	if (el("bltab").style.display == "block" && ghSave.wzb.unl) updateBosonicLabTab()
}

function buyGHPMult() {
	let sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	let cost = getGHPMultCost()
	if (sum.lt(cost)) return
	subNeutrinos(cost)
	ghSave.multPower++
	ghSave.automatorGhosts[15].a = ghSave.automatorGhosts[15].a.times(5)
	el("autoGhost15a").value = formatValue("Scientific", ghSave.automatorGhosts[15].a, 2, 1)
	el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
	el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
}

function maxGHPMult() {
	let sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	let cost = getGHPMultCost()
	if (sum.lt(cost)) return

	let toBuy=Math.min(Math.floor(sum.div(cost).times(24).add(1).log(25)),85-ghSave.multPower)
	subNeutrinos(E_pow(25,toBuy).sub(1).div(24).times(cost))
	ghSave.multPower+=toBuy
	ghSave.automatorGhosts[15].a=ghSave.automatorGhosts[15].a.times(E_pow(5,toBuy))

	el("autoGhost15a").value = formatValue("Scientific", ghSave.automatorGhosts[15].a, 2, 1)
	el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
	el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
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
	data[17].a = 60
	data[17].t = 0
	return data
}

var autoGhostRequirements=[2,4,4,4.5,5,5,6,6.5,7,7,7.5,8,20,24,28,32,36,40,45]
var powerConsumed
var powerConsumptions=[0,0.75,0.75,0.75,1,2,1.5,0.5,0.5,0.5,1,0.5,0.5,0.5,0.5,0.5,6,3,6,3,9,3,3]
function updateAutoGhosts(load) {
	var data = ghSave.automatorGhosts
	if (load) {
		for (var x = 1; x <= getMaxAutoGhosts(); x++) if (data[x] === undefined) data[x] = {on: false}
		if (data.ghosts >= getMaxAutoGhosts()) el("nextAutomatorGhost").parentElement.style.display="none"
		else {
			el("nextAutomatorGhostDiv").style.display=""
			el("nextAutomatorGhost").textContent=autoGhostRequirements[data.ghosts-3].toFixed(2)
		}
	}
	powerConsumed=0
	for (var ghost = 1; ghost <= getMaxAutoGhosts(); ghost++) {
		if (ghost>data.ghosts) {
			if (load) el("autoGhost"+ghost).style.display="none"
		} else {
			if (load) {
				el("autoGhost"+ghost).style.display=""
				el("isAutoGhostOn"+ghost).checked=data[ghost].on
			}
			if (data[ghost].on) powerConsumed+=powerConsumptions[ghost]
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

function isAutoGhostActive(id) {
	if (!ghostified) return
	return ghSave.automatorGhosts[id].on
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

function getMaxAutoGhosts() {
	return tmp.ngp3l ? 15 : 22
}

//v2.1
function startEC10() {
	if (canUnlockEC(10, 550, 181)) {
		justImported = true
		el("ec10unl").onclick()
		justImported = false
	}
	startEternityChallenge(10)
}

function getGHPMultCost(offset=0) {
	let lvl=ghSave.multPower+offset
	return E_pow(5, lvl * 2 - 1).times(25e8)

}

//v2.2
function canBuyGalaxyThresholdUpg() {
	return !tmp.ngp3 || player.dilation.rebuyables[2] < 60
}

function showAntTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('anttab');
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
	if (oldTab !== tabName) aarMod.tabsSave.tabAnt = tabName
	closeToolTip()
}

function getGhostifiedGain() {
	let r = 1
	if (hasBU(15)) r = nN(tmp.blu[15].gh)
	return r
}

function toggleLEConf() {
	aarMod.leNoConf = !aarMod.leNoConf
	el("leConfirmBtn").textContent = "Spectral Ion confirmation: O" + (aarMod.leNoConf ? "FF" : "N")
}

//Anti-Preonius' Lair
function getAntiPreonGhostWake() {
	let x = 104
	if (hasNU(17)) x += tmp.nanofield_free_rewards/3
	return Math.floor(x)
}

//v2.21: NG+3.1
function setNonlegacyStuff() {
}

function displayNonlegacyStuff() {
	//QC Modifiers
	for (var m = 1; m < qcm.modifiers.length; m++) el("qcm_" + qcm.modifiers[m]).style.display = tmp.ngp3l ? "none" : ""
}

function getOldAgeRequirement() {
	let year = new Date().getFullYear() || 2022
	return pow10(3 * 86400 * 365.2425 * year)
}

//v2.302
function NGP3andVanillaCheck() {
	return (tmp.ngp3) || !aarMod.newGamePlusPlusVersion
}

// Gathered from NG+3R v0.7 - Fluctuate
// Feature Notifications
var ngp3Features = {
	md: {
		name: "Meta Dimensions",
		next: "ms",
		tab() {
			showTab("dimensions")
			showDimTab("metadimensions")
		}
	},
	ms: {
		name: "Mastery Studies",
		threshold: () => "Get " + shortenInt(1e100) + " DT upgrade from Time Dilation",
		next: "qu",
		tab() {
			showTab("eternitystore")
			showEternityTab("masterystudies")
		}
	},
	qu: {
		name: "Quantum",
		threshold: () => "Get " + shorten(getQuantumReq()) + " meta-Antimatter and complete Eternity Challenge 14",
		next: "el",
		tab() {
			showTab("quantumtab")
		}
	},
	el: {
		name: "Electrons",
		threshold: () => "Get " + shorten(50) + " Quantum Worth",
		next: "qc",
		tab() {
			showTab("quantumtab")
			showQuantumTab('electrons')
		}
	},
	qc: {
		name: "Quantum Challenges",
		threshold: () => "Get " + getFullExpansion(16750) + " electrons",
		next: "pc",
		tab() {
			showTab("challenges")
			showChallengesTab("quantumchallenges")
		}
	},
	pc: {
		name: "Paired Challenges",
		threshold: () => "Complete Quantum Challenge 8",
		next: "du",
		tab() {
			showTab("challenges")
			showChallengesTab("pChalls")
		}
	},
	du: {
		name: "Duplicants",
		threshold: () => "Complete Paired Challenge 4",
		next: "ed",
		tab() {
			showTab("quantumtab")
			showQuantumTab('replicants')
		}
	},
	ed: {
		name: "Emperor Dimensions",
		threshold: () => "Get " + getFullExpansion(10) + " worker duplicants",
		next: "nf",
		tab() {
			teleportToEDs()
		}
	},
	nf: {
		name: "Nanofield",
		threshold: () => "Get " + getFullExpansion(10) + " Eighth Emperor Dimensions",
		next: "tod",
		tab() {
			showTab("quantumtab")
			showQuantumTab('replicants')
			showAntTab('nanofield')
		}
	},
	tod: {
		name: "Tree of Decay",
		threshold: () => "Get " + getFullExpansion(16) + " Nanorewards",
		next: "br",
		tab() {
			showTab("quantumtab")
			showQuantumTab('tod')
		}
	},
	br: {
		name: "Big Rip",
		threshold: () => "Get 'The Challenging Day' achievement",
		next: "fu",
		tab() {
			showTab("quantumtab")
			showQuantumTab('bigrip')
		}
	},
	fu: {
		name: "Fundament",
		threshold: () => "Get " + shorten(getQuantumReq()) + " meta-Antimatter in Big Rip",
		next: "ph",
		tab() {
			showTab("ghostify")
		}
	},
	ph: {
		name: "Photons",
		threshold: () => "Get " + shortenCosts(pow10(6e9)) + " antimatter in Big Rip",
		next: "bl",
		tab() {
			showTab("ghostify")
			showGhostifyTab('gphtab')
		}
	},
	bl: {
		name: "Bosonic Lab",
		threshold: () => "Get 4 Spectral Ions",
		next: "gw",
		tab() {
			showTab("ghostify")
			showGhostifyTab('bltab')
		}
	},
	gw: {
		name: "Gravity Well",
		threshold: () => "Get " + shortenCosts(pow10(1e18)) + " antimatter",
		next: "bd",
		tab() {
			showTab("ghostify")
			showGhostifyTab('bltab')
			showBLTab('gravtab')
		}
	},
	bd: {
		name: "Break Dilation",
		threshold: () => "Get " + shortenCosts(pow10(4e12)) + " antimatter in Big Rip",
		tab() {
			toBDTab()
		}
	},
}

function ngp3_feature_notify(k) {
	ngp3Features[k].tab()
	$.notify("Congratulations! You have unlocked " + ngp3Features[k].name + "!", "success")

	el("ngp3_feature_ani").style.display = ""
	el("ngp3_feature_ani_4").textContent = ngp3Features[k].name + " is now unlocked!"
	setTimeout(function() {
		el("ngp3_feature_ani_1").style.background = "transparent"
		el("ngp3_feature_ani_2a").style.background = "transparent"
		el("ngp3_feature_ani_2a").style.left = "0"
		el("ngp3_feature_ani_2a").style.top = "0"
		el("ngp3_feature_ani_2a").style.width = "100%"
		el("ngp3_feature_ani_2a").style.height = "100%"
		el("ngp3_feature_ani_2b").style.background = "transparent"
		el("ngp3_feature_ani_2b").style.left = "0"
		el("ngp3_feature_ani_2b").style.top = "0"
		el("ngp3_feature_ani_2b").style.width = "100%"
		el("ngp3_feature_ani_2b").style.height = "100%"
		el("ngp3_feature_ani_3").style.right = "0"
	}, 100)

	setTimeout(function() {
		el("ngp3_feature_ani").style.left = "150%"

		var nxt = ngp3Features[k].next
		$.notify(nxt ? ngp3Features[nxt].threshold() + " to unlock the next feature: " + ngp3Features[nxt].name + "!" : "Congratulations, you have reached the end-game for now...", "error")
	}, 5000)
	setTimeout(function() {
		el("ngp3_feature_ani").style.display = "none"
		el("ngp3_feature_ani").style.left = "0%"
		el("ngp3_feature_ani_1").style.background = "white"
		el("ngp3_feature_ani_2a").style.background = "#7fff00"
		el("ngp3_feature_ani_2a").style.left = "50%"
		el("ngp3_feature_ani_2a").style.top = "50%"
		el("ngp3_feature_ani_2a").style.width = "0"
		el("ngp3_feature_ani_2a").style.height = "0"
		el("ngp3_feature_ani_2b").style.background = "#00ffff"
		el("ngp3_feature_ani_2b").style.left = "50%"
		el("ngp3_feature_ani_2b").style.top = "50%"
		el("ngp3_feature_ani_2b").style.width = "0"
		el("ngp3_feature_ani_2b").style.height = "0"
		el("ngp3_feature_ani_3").style.right = "150%"
	}, 6000)
}
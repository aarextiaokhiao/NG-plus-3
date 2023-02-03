//VERSION: 2.31
let ngp3_ver = 2.31
let ngp3_build = 20230202
function doNGP3Updates() {
	if (!aarMod.ngp3_build) aarMod.ngp3_build = 0
	if (aarMod.ngp3_build < 20221230) quSave.multPower = 0
	if (aarMod.ngp3_build < 20220201) {
		if (!quSave.qcsNoDil) quSave.qcsNoDil = {}
		delete ghSave.ghostlyPhotons
		delete aarMod.leNoConf
	}
	aarMod.newGame3PlusVersion = ngp3_ver
	aarMod.ngp3_build = ngp3_build
}

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
	tabIds: ["uquarks", "gluons", "electrons", "replicants", "tod", "bigrip", "breakEternity"],
	update: {
		uquarks: updateQuarksTab,
		gluons: updateGluonsTab,
		electrons: updateElectronsTab,
		tod: updateTreeOfDecayTab,
		bigrip: updateBigRipTab,
		breakEternity: () => breakEternityDisplay()
	}
}

function updateQuantumTabs() {
	for (var i = 0; i < quantumTabs.tabIds.length; i++) {
		var id = quantumTabs.tabIds[i]
		if (el(id).style.display == "block") quantumTabs.update[id]()
	}
	if (ghSave.milestones > 7) updateQuantumWorth("display")
}

function toggleAutoTT() {
	if (speedrunMilestonesReached < 2) maxTheorems()
	else player.autoEterOptions.tt = !player.autoEterOptions.tt
	el("theoremmax").innerHTML = speedrunMilestonesReached > 2 ? ("Auto max: "+(player.autoEterOptions.tt ? "ON" : "OFF")) : "Buy max Theorems"
}

//v1.8
const MAX_DIL_UPG_PRIORITIES = [4, 3, 1, 2]
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
		if (player.autoEterOptions["md" + d] && speedrunMilestonesReached >= 6 + d) buyMaxMetaDimension(d)
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
					var toBuy = Math.floor(player.dilation.dilatedTime.div(cost).mul(9).add(1).log10())
					var toSpend = pow10(toBuy).sub(1).div(9).mul(cost)
					player.dilation.dilatedTime = player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
					player.dilation.rebuyables[1] += toBuy
					update = true
				}
			} else if (id == "r2") {
				if (canBuyGalaxyThresholdUpg()) {
					if (speedrunMilestonesReached > 21) {
						var cost = pow10(player.dilation.rebuyables[2] * 2 + 6)
						if (player.dilation.dilatedTime.gte(cost)) {
							var toBuy = Math.min(Math.floor(player.dilation.dilatedTime.div(cost).mul(99).add(1).log(100)), 60 - player.dilation.rebuyables[2])
							var toSpend = E_pow(100,toBuy).sub(1).div(99).mul(cost)
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
	if (hasMasteryStudy("t302")) display = "block"
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

function switchAB() {
	var bigRip = bigRipped()
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
	if (inNGM(3)) if (player.autobuyers[13] % 1 !== 0) data.tickBoosts = {
		maxDims: player.autobuyers[13].priority,
		always: player.overXGalaxiesTickspeedBoost,
		bulk: player.autobuyers[13].bulk,
		on: player.autobuyers[13].isOn
	}
	if (inNGM(2)) if (player.autobuyers[12] % 1 !== 0) data.galSacrifice = {
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

//v2.2
function canBuyGalaxyThresholdUpg() {
	return !mod.ngp3 || player.dilation.rebuyables[2] < 60
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

//v2.21: NG+3.1
function getOldAgeRequirement() {
	let year = new Date().getFullYear() || 2022
	return pow10(3 * 86400 * 365.2425 * year)
}

//v2.302
function NGP3andVanillaCheck() {
	return (mod.ngp3) || !aarMod.newGamePlusPlusVersion
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
			showTab("replicants")
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
			showTab("replicants")
			showAntTab('nanofield')
		}
	},
	tod: {
		name: "Quark Decay",
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

			el("welcome").style.display = "flex"
			el("welcomeMessage").innerHTML = "<h1>Your journey is not over...</h1>Anyways, welcome to NG+4, originally by Soul147! You have reached the NG+4 checkpoint. However, many features remain for you to dominate."
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
		threshold: () => "Get " + shortenCosts(pow10(1e10)) + " antimatter in Big Rip",
		next: "bl",
		tab() {
			showTab("ghostify")
			showGhostifyTab('gphtab')
		}
	},
	bl: {
		name: "Bosonic Lab",
		threshold: () => "Get 4 Spectral Ions",
		next: "hb",
		tab() {
			showTab("bltab")
		}
	},
	hb: {
		name: "Higgs",
		threshold: () => "???",
		tab() {
			showTab("bltab")
		}
	}
}

function ngp3_feature_notify(k) {
	ngp3Features[k].tab()
	$.notify("Congratulations! You unlocked " + ngp3Features[k].name + "!", "success")

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

//v2.4: Moved from old functions...
function doPerSecondNGP3Stuff(){
	updateQuantumTabDisplays()
	updateQuarkDisplay()
	el('toggleautoquantummode').style.display = mod.ngp3 && quSave.reachedInfQK ? "" : "none"

	if (!mod.ngp3) return

	//NG+3: Automators
	automatorPerSec()
	if (quSave.autoECN !== undefined) {
		justImported = true
		if (quSave.autoECN > 12) buyMasteryStudy("ec", quSave.autoECN,true)
		else el("ec" + quSave.autoECN + "unl").onclick()
		justImported = false
	}
	if (quSave.autoOptions.assignQK && ghSave.milestones > 7) assignAll(true) 

	//NG+3: Others
	doNGP3UnlockStuff()
	notifyGhostifyMilestones()
	givePerSecondNeuts()

	notifyQuantumMilestones()
	updateQuantumWorth()
	updateQCDisplaysSpecifics()
	updateQuantumTabDisplays()
}

function doGhostifyUnlockStuff(){
	ghSave.reached = true
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "You are finally able to complete PC6+8 in Big Rip! However, because of the unstability of this universe, the only way to go further is to fundament. This allows to unlock new stuff in exchange for everything that you have."
}

function doReachAMGoalStuff(chall){
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "You reached the antimatter goal (" + shorten(pow10(getQCGoal())) + "), but you didn't reach the meta-antimatter goal yet! Get " + shorten(getQuantumReq()) + " meta-antimatter" + (bigRipped() ? " and then you can fundament!" : " and then go Quantum to complete your challenge!")
	quSave.nonMAGoalReached.push(chall)
}

function doQuantumUnlockStuff(){
	quSave.reached = true
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "Congratulations! You reached " + shorten(getQuantumReq()) + " MA and completed EC14 for the first time! This allows you to go Quantum (the 5th layer), giving you a quark in exchange for everything up to this point, which can be used to get more powerful upgrades. This allows you to get gigantic numbers!"
}

function doNGP3UnlockStuff(){
	var chall = tmp.inQCs
	if (chall.length < 2) chall = chall[0]
	else if (chall[0] > chall[1]) chall = chall[1] * 10 + chall[0]
	else chall = chall[0] * 10 + chall[1]

	if (ghostified) {
		if (!PHOTON.unlocked() && PHOTON.req()) unlockPhotons()
		if (!ghSave.wzb.unl && canUnlockBosonicLab()) doBosonsUnlockStuff()
		if (!ghSave.hb.unl && canUnlockHiggs()) unlockHiggs()
	}
	if (quantumed) {
		let MAbool = player.meta.bestAntimatter.lt(getQuantumReq())
		let DONEbool = !quSave.nonMAGoalReached.includes(chall)
		let TIMEbool = quSave.time > 10

		if (!inQC(0) && player.money.gt(pow10(getQCGoal())) && MAbool && DONEbool && TIMEbool) doReachAMGoalStuff(chall)
		if (!beSave.unlocked && player.eternityPoints.gte("1e1200") && bigRipped()) doBreakEternityUnlockStuff()
		if (!ghSave.reached && isQuantumReached() && bigRipped()) doGhostifyUnlockStuff()

		if (quSave.quarks.gte(Number.MAX_VALUE) && !quSave.reachedInfQK) {
			quSave.reachedInfQK = true

			el("welcome").style.display = "flex"
			el("welcomeMessage").innerHTML = "Congratulations for getting " + shorten(Number.MAX_VALUE) + " anti-Quarks! You have unlocked autobuyer modes and auto-assignation!"
			el('autoAssign').style.display = ""
			el('autoAssignRotate').style.display = ""
		}
	} else if (!quSave.reached && isQuantumReached()) doQuantumUnlockStuff()
}

function quantumOverallUpdating(diff){
	var colorShorthands=["r","g","b"]

	//Color Powers
	for (var c=0;c<3;c++) quSave.colorPowers[colorShorthands[c]]=quSave.colorPowers[colorShorthands[c]].add(getColorPowerProduction(colorShorthands[c]).mul(diff))
	updateColorPowers()
	if (hasMasteryStudy("d10")) replicantOverallUpdating(diff)
	if (hasMasteryStudy("d11")) emperorDimUpdating(diff)
	if (NF.unl()) nanofieldUpdating(diff)
	if (hasMasteryStudy("d13")) treeOfDecayUpdating(diff)
	if (bigRipped()) {
		brSave.totalAntimatter = brSave.totalAntimatter.max(player.money)
		brSave.bestThisRun = brSave.bestThisRun.max(player.money)
		brSave.bestGals = Math.max(brSave.bestGals, player.galaxies)
	}
	
	if (speedrunMilestonesReached>5) {
		quSave.metaAutobuyerWait+=diff*10
		var speed=speedrunMilestonesReached>20?10/3:10
		if (quSave.metaAutobuyerWait>speed) {
			quSave.metaAutobuyerWait=quSave.metaAutobuyerWait%speed
			doAutoMetaTick()
		}
	}
	thisQuantumTimeUpdating()
}

function updateQuantumTabDisplays() {
	el("qctabbtn").style.display = hasMasteryStudy("d8") ? "" : "none"
	el("pctabbtn").style.display = hasMasteryStudy("d9") ? "" : "none"
	el("tab_ant").style.display = hasMasteryStudy("d10") ? "inline-block" : "none"

	if (!quantumed) return
	el("electronstabbtn").style.display = hasMasteryStudy("d7") ? "" : "none"
	el("antTabs").style.display = hasMasteryStudy("d11") ? "" : "none"
	el("nanofieldtabbtn").style.display = NF.unl() ? "" : "none"
	el("todtabbtn").style.display = hasMasteryStudy("d13") ? "" : "none"
	el("riptabbtn").style.display = hasMasteryStudy("d14") ? "" : "none"
	el("betabbtn").style.display = beSave.unlocked ? "" : "none"
}

function beatNGP3() {
	el("welcome").style.display = "flex"
	el("welcomeMessage").innerHTML = `
	You reached the inner depths of lab...<br>
	<b class='red'>(but for now...)</b><br><br>
	<h1>You have beaten ${modAbbs(mod, true)}!</h1>
	This took you ${timeDisplayShort(player.totalTimePlayed)} and ${player.achievements.length} achievements.<br><br>
	Post-game is coming soon!<br>
	Thanks for playing!`
}

//Setup
function setupNGP3HTMLAndData() {
	setupMasteryStudiesHTML()
	setupPCTable()
	setupEmpDimensionHTML()
	setupNanofieldHTML()
	setupToDHTML()
	setupBraveMilestones()
	setupPhotonTab()
	setupBosonicExtraction()
	setupBosonicUpgrades()
	setupBosonicRunes()
}
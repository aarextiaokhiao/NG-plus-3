//VERSION: 2.31
let ngp3_ver = 2.31
let ngp3_build = 20240107
function doNGP3Updates() {
	if (!aarMod.ngp3_build) aarMod.ngp3_build = 0
	if (aarMod.ngp3_build < 20221230) quSave.multPower = 0
	if (aarMod.ngp3_build < 20230201) delete aarMod.leNoConf
	if (aarMod.ngp3_build < 20230204) {
		delete quSave.tod.g
		delete quSave.tod.b
	}
	if (aarMod.ngp3_build < 20230208) {
		delete brSave.savedAutobuyersBR
		delete brSave.savedAutobuyersNoBR
	}
	if (aarMod.ngp3_build < 20230211) {
		quSave.electrons.amount = 0
		quSave.electrons.sacGals = 0
		updatePositronsEffect()
	}
	if (aarMod.ngp3_build < 20230215) player.dilation.freeGalaxies = 0
	if (aarMod.ngp3_build < 20230514 && todSave) todSave.chosen = "r"
	if (aarMod.ngp3_build < 20230721.01 && hasMasteryStudy("d8") && quSave.best > 3e3) alert("Quantum Challenges are locked until you get a 5-minute Speedrun Milestone!")
	if (ghSave !== undefined) {
		if (aarMod.ngp3_build < 20230201) delete ghSave.ghostlyPhotons
		if (aarMod.ngp3_build < 20230204) {
			delete ghSave.disabledRewards
			delete ghSave.reached
		}
		if (aarMod.ngp3_build < 20230727 && E(ghSave.ghostParticles).gte(1e20)) {
			alert("Due to massive balancing changes, you will be pushed back to e20 Spectral Particles!")

			resetGHPandNeutrinos()
			ghSave.neutrinos.upgrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
			ghSave.neutrinos.boosts = 9
			beSave.upgrades = [1, 2, 3, 4, 5, 6]
			ghSave.ghostParticles = E(1e20)
		}
		if (aarMod.ngp3_build < 20230820) {
			delete ghSave.wzb
			delete ghSave.bl
			delete ghSave.lab?.hf
			ghSave.photons = PHOTON.setup()
			ghSave.hb = HIGGS.setupSave()
		}
		if (aarMod.ngp3_build < 20231221) {
			if (ghSave.milestones) ghSave.low = BM_REQ[ghSave.milestones-1]
			delete ghSave.milestones
		}

		if (!ghSave.reached && !ghSave.times) {
			delete player.ghostify
			loadFundament()
		}
	}

	aarMod.newGame3PlusVersion = ngp3_ver
	aarMod.ngp3_build = ngp3_build
}

//v1.5
function toggleAutoTT() {
	if (speedrunMilestonesReached < 2) maxTheorems()
	else player.autoEterOptions.tt = !player.autoEterOptions.tt
	el("theoremmax").innerHTML = speedrunMilestonesReached > 2 ? ("Auto max: "+(player.autoEterOptions.tt ? "ON" : "OFF")) : "Buy max Theorems"
}

//v1.8
const MAX_DIL_UPG_PRIORITIES = [4, 3, 1, 2]
function doAutoMetaTick() {
	if (!mod.ngp3) return

	if (player.autoEterOptions.rebuyupg && speedrunMilestonesReached > 6) {
		if (speedrunMilestonesReached > 25) maxAllDilUpgs()
		else for (var i = 0; i < MAX_DIL_UPG_PRIORITIES.length; i++) {
			var id = "r" + MAX_DIL_UPG_PRIORITIES[i]
			buyDilationUpgrade(id)
		}
	}
	for (var d = 1; d <= 8; d++) if (player.autoEterOptions["md" + d] && speedrunMilestonesReached >= 6 + d) buyMaxMetaDimension(d)
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
	el("metaMaxAll").style.display = turnOn && stop > 7 && speedrunMilestonesReached > 27 ? "none" : ""
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
		if (quSave.autoOptions.sacrifice) sacrificeGalaxy()
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
	if (!hasAch("ng3p15")) return

	bankedEterGain = nD(player.eternities, 20)
	if (updateHtml) {
		setAndMaybeShow("bankedEterGain", bankedEterGain > 0, '"You will gain "+getFullExpansion(bankedEterGain)+" banked Eternities on next Quantum."')
		setAndMaybeShow("eternitiedBank", player.eternitiesBank, '"You have "+getFullExpansion(player.eternitiesBank)+" banked Eternities."')
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
		if (player.timestudy.studies.length > 56) $.notify("All Studies in the Time Study tab are now filled.")
	}
}

//v1.99872
function maxAllDilUpgs() {
	let update
	for (let i of MAX_DIL_UPG_PRIORITIES) {
		let id = "r" + i
		if (!isDilUpgUnlocked(id)) continue

		let amt = player.dilation.rebuyables[i] || 0
		let start = Math.floor(getRebuyableDilUpgScaleStart(i))
		if ((i != 2 || speedrunMilestonesReached >= 22) && amt < start) {
			let cost = getRebuyableDilUpgCost(i)
			let scale = DIL_UPG_COSTS[id][1]
			if (player.dilation.dilatedTime.lt(cost)) continue

			let toBuy = Math.min(Math.floor(player.dilation.dilatedTime.div(cost).mul(scale - 1).add(1).log(scale)), start - amt)
			let toSpend = E_pow(scale, toBuy).sub(1).div(scale - 1).mul(cost)
			player.dilation.dilatedTime = player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
			player.dilation.rebuyables[i] += toBuy
			update = true
		}
		while (buyDilationUpgrade(id, true)) update = true
	}
	if (update) updateDilationUpgradeButtons()
}

//v1.99874
function maybeShowFillAll() {
	var display = hasMasteryStudy("t302") ? "block" : "none"
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

//v2.21: NG+3.1
function getOldAgeRequirement() {
	let year = new Date().getFullYear() || 2022
	return pow10(3 * 86400 * 365.2425 * year)
}

//v2.302
function NGP3andVanillaCheck() {
	return (mod.ngp3) || !aarMod.newGamePlusPlusVersion
}

//v2.4: Moved from old functions...
function intergalacticDisplay() {
	if (tmp.qu.intergal && getNormalDimensions() == 8) {
		el("intergalacticLabel").parentElement.style.display = ""
		let nanopart = 1
		if (hasNanoReward("dil_exp")) nanopart = getNanorewardEff("dil_exp")
		el("intergalacticLabel").innerHTML = 
			'Intergalactic ' + 
			'(' + getFullExpansion(Math.floor(tmp.qu.intergal.gal)) + ')' +
			(player.dilation.active || inNGM(2) ? ": (estimated)" : ": ") +
			shorten(dilates(tmp.qu.intergal.eff).pow(player.dilation.active ? nanopart : 1)) + 
			'x to Eighth Dimensions'
	} else el("intergalacticLabel").parentElement.style.display = "none"
}

function beatNGP3() {
	el("welcome").style.display = "flex"
	el("welcomeMessage").innerHTML = `
	You reached the inner depths of lab...<br>
	<b class='red'>(but for now...)</b><br><br>
	<h1>You have beaten ${modAbbs(mod, true)}!</h1>
	This took you ${timeDisplayShort(player.totalTimePlayed)} with ${player.achievements.length} achievements.<br><br>
	Thanks for playing!`
	onObtainBadgeCheck("tgr")
}

//v2.4: Code
function updateNGP3Temp() {
	tmp.qu.be = brokeEternity()
	updateGhostifyTempStuff()
	if (quantumed) {
		if (beSave && beSave.unlocked) updateBreakEternityUpgradesTemp()
		if (hasMasteryStudy("d14")) updateBigRipUpgradesTemp()
		if (isDecayOn()) tmp.qu.tree_str = getTreeUpgradeEfficiency()
		if (hasMasteryStudy("d12")) updateNanofieldTemp()
		if (hasMasteryStudy("d10")) {
			tmp.qu.ant.preon_eff = getPilonEffect()
			tmp.qu.ant.workers = getTotalWorkers()
			tmp.qu.ant.total = getTotalDuplicants()
			tmp.qu.ant.global_mult = getEmperorDimensionGlobalMultiplier() //Update global multiplier of all Emperor Dimensions
		}
		updateColorPowers()
	}
	updateQCRewardsTemp()
	if (mod.ngp3) {
		updateMasteryStudyTemp()
		updateIntergalacticTemp()
	}
	updateNGP3Progress()
}

function doPerSecondNGP3Stuff(quick) {
	if (!quick) {
		el("respecMastery").style.display = MTS.unl() ? "block" : "none"
		updateQuarkDisplay()
		updateNetTop()
		el('toggleautoquantummode').style.display = quSave?.reachedInfQK ? "" : "none"
		el('dilationmode').style.display=speedrunMilestonesReached > 4?"":"none"
		el('rebuyupgmax').style.display=speedrunMilestonesReached < 26?"":"none"
		el('toggleallmetadims').style.display=speedrunMilestonesReached > 7?"":"none"
		el('metaboostAuto').style.display=speedrunMilestonesReached > 14?"":"none"
		el("autoBuyerQuantum").style.display = speedrunMilestonesReached >= 23 ? "" : "none"
		updateBreakEternity()
		BL_JOKE.updateHTML()
	}
	if (!mod.ngp3) return

	//Automators
	if (ghostified) automatorPerSec()
	if (quSave.autoECN !== undefined) {
		justImported = true
		if (quSave.autoECN > 12) buyMasteryStudy("ec", quSave.autoECN,true)
		else el("ec" + quSave.autoECN + "unl").onclick()
		justImported = false
	}
	if (quSave.autoOptions.assignQK) assignAll(true) 

	//Others
	ngP3AchieveCheck()
	doNGP3UnlockStuff()	

	if (quick) return
	notifyQuantumMilestones()

	updateMasteryStudyTextDisplay()
	updateAssortOptions()
	updateQuantumWorth()
	updatePostBM14Display()
}

function ngP3AchieveCheck() {
	let checkEmpty = player.timestudy.studies.length < 1
	if (mod.ngp3) for (id = 0; id < player.masterystudies.length; id++) if (player.masterystudies[id].split("t")[1]) checkEmpty = false

	let ableToGetRid2 = checkEmpty && player.dilation.active
	let ableToGetRid3 = ableToGetRid2 && quSave.electrons.amount == 0	
	let ableToGetRid4 = ableToGetRid2 && inQC(2)
	let ableToGetRid5 = ableToGetRid4 && player.dontWant
	let ableToGetRid6 = ableToGetRid2 && inQC(6) && inQC(8)
	let noTree = false
	for (var u = 1; u < 9; u++) {
		if (todSave.upgrades[u]) break
		else noTree = true
	}
	if (player.meta.antimatter.gte(Number.MAX_VALUE)) giveAchievement("I don't have enough fuel!")
	if (player.galaxies >= 900 && !hasDilStudy(1)) giveAchievement("No more tax fraud!")
	if (player.money.gte(getOldAgeRequirement())) giveAchievement("Old age")
	if (player.infinityPoints.log10() >= 4e5 && ableToGetRid3) giveAchievement("I already got rid of you...")
	if (player.meta.resets == 8 && player.meta.antimatter.log10() >= 1500) giveAchievement("We are not going squared.")
	if (player.eightBought >= 4e6 && (getTotalRG() + player.dilation.freeGalaxies) < 1) giveAchievement("Intergalactic")
	if (player.old && player.meta.antimatter.log10() >= 1700) giveAchievement("Old memories come true")
	if (player.infinityPoints.log10() >= 3.54e5 && ableToGetRid4) giveAchievement("Seriously, I already got rid of you.")
	if (player.meta.antimatter.log10() >= 333 && player.meta[2].amount.eq(0) && player.meta.resets == 0) giveAchievement("ERROR 500: INTERNAL DIMENSION ERROR")
	if (player.money.log10() >= 7.88e13 && quSave.pairedChallenges.completed == 0) giveAchievement("The truth of anti-challenged")
	if (player.money.log10() >= 6.2e11 && player.currentEternityChall == "eterc11") giveAchievement("I can’t get my multipliers higher!")
	if (player.replicanti.amount.log10() >= 2e6 && player.dilation.tachyonParticles.eq(0)) giveAchievement("No dilation means no production.")
	if (player.infinityPoints.gte(E_pow(Number.MAX_VALUE, 1000)) && ableToGetRid5) giveAchievement("I am not interested...")
	if (player.dilation.dilatedTime.log10() >= 411 && quSave.notrelative) giveAchievement("Time is not relative")
	if (!hasAch("ng3p42")) {
		for (d = 2; d < 9; d++) {
			if (player[dimTiers[d]+"Amount"].gt(0) || player["infinityDimension"+d].amount.gt(0) || player["timeDimension"+d].amount.gt(0) || player.meta[d].amount.gt(0)) break
			else if (player.money.log10() >= 1.6e12 && d == 8) giveAchievement("ERROR 404: DIMENSIONS NOT FOUND")
		}
	}
	if (player.money.log10() >= 8e6 && inQC(6) && inQC(8)) giveAchievement("Impossible expectations")
	if (player.timestudy.theorem >= 1.1e7 && quSave.wasted) giveAchievement("Studies are wasted")
	if (quSave.replicants.requirement.gte("1e12500000")) giveAchievement("Stop blocking me!")
	if (player.infinityPoints.gte(pow10(2.75e5)) && ableToGetRid6) giveAchievement("Is this really worth it?")
	if (nfSave.rewards >= 21 && noTree) giveAchievement("But I don't want to grind!")
	if (player.replicanti.amount.log10() >= (mod.udp ? 268435456 : 36e6)) giveAchievement("Will it be enough?")
	if (player.options.secrets && player.options.secrets.ghostlyNews && !player.options.newsHidden) giveAchievement("Two tickers")
	if (tmp.qu.chal.pc_comp >= 24) giveAchievement("The Challenging Day")
	if (speedrunMilestonesReached >= 24) giveAchievement("And the winner is...")
	if (speedrunMilestonesReached >= 28) giveAchievement("Special Relativity")
	if (hasMasteryStudy("d13")) giveAchievement("Do protons decay?")
	if (quantumed) giveAchievement("Sub-atomic")

	//New format
	let ableToGetRid7 = ableToGetRid2 && bigRipped() && player.epmult.eq(1)
	if (bigRipped()) giveAchievement("To the new dimension!")
	if (quSave.best <= 10) giveAchievement("Quantum doesn't take so long")
	if (tmp.qu.be) giveAchievement("Time Breaker")
	if (bigRipped() && player.currentEternityChall == "eterc7" && player.galaxies == 1 && player.money.log10() >= 8e7) giveAchievement("Time Immunity")
	if (tmp.qu.be && !hasTimeStudy(11) && player.timeShards.log10() >= 215) giveAchievement("You're not really smart.")
	if (ableToGetRid7 && player.infinityPoints.log10() >= 3.5e5) giveAchievement("And so your life?")

	if (!ghostified) return
	let ableToGetRid8 = ableToGetRid7 && !beSave.did
	if (brSave.spaceShards.e >= 33 && !beSave.did) giveAchievement("Finite Time")
	if (beSave.eternalMatter.gte(9.999999e99)) giveAchievement("This achievement doesn't exist 4")
	if (braveMilestones == 16) giveAchievement("I rather oppose the theory of everything")
	if (inQC(6) && inQC(8) && !bigRipped() && player.money.e >= 4e7) giveAchievement("Really?")
	if (ableToGetRid8 && player.infinityPoints.log10() >= 9.5e5) giveAchievement("Please answer me why.")

	if (PHOTON.unlocked()) giveAchievement("Progressing as a Ghost")
	if (bigRipped() && player.eternityPoints.e >= 1e5) giveAchievement("Underchallenged")
	if (nG(getInfinitied(), Number.MAX_VALUE)) giveAchievement("Meta-Infinity confirmed?")
	if (todSave.r.quarks.gte(pow10(1e12)) && !brSave.times) giveAchievement("Weak Decay")	
	if (getRadioactiveDecays() >= 1) giveAchievement("Radioactive Decaying to the max!")
	if (ghSave.best <= 30) giveAchievement("Running through Big Rips")
	if (MTS.bought >= 48) giveAchievement("The Theory of Ultimate Studies")
	if (ghSave.photons.lighten) giveAchievement("Here comes the light")

	if (LAB.unlocked()) giveAchievement("Even Ghostlier than before")
	if (nG(getEternitied(), Number.MAX_VALUE)) giveAchievement("Everlasting Eternities")

	//if (ghSave.hb.higgs >= 1) giveAchievement("The Holy Particle")
	//if (ghSave.ghostlyPhotons.enpowerments >= 25) giveAchievement("Bright as the Anti-Sun") -- will be back
	if (quSave.quarks.log10() >= 40000) giveAchievement("Are these another...")
	if (ghSave.reference && getRadioactiveDecays() >= 2) giveAchievement("... references to EC8?")
	if (ghSave.times >= Math.pow(Number.MAX_VALUE, 1/4)) giveAchievement("The Ghostliest Side")
	if (player.money.log10() >= 1e18) giveAchievement("Meta-Quintillion")
	if (player.unstableThisGhostify <= 10 && getTwoDecaysBool()) giveAchievement("... references to EC8?")
}

function doNGP3UnlockStuff() {
	var chall = tmp.qu.chal.in
	if (chall.length < 2) chall = chall[0]
	else if (chall[0] > chall[1]) chall = chall[1] * 10 + chall[0]
	else chall = chall[0] * 10 + chall[1]

	if (ghostified) {
		if (!PHOTON.unlocked() && PHOTON.req()) PHOTON.unlock()
		if (!LAB.unlocked() && LAB.req() && !BL_JOKE.started()) LAB.unlock()
	}
	if (quantumed) {
		let MAbool = player.meta.bestAntimatter.lt(getQuantumReq())
		let DONEbool = !quSave.nonMAGoalReached.includes(chall)
		let TIMEbool = quSave.time > 10

		if (inAnyQC() && player.money.gt(getQCGoal()) && MAbool && DONEbool && TIMEbool) doReachAMGoalStuff(chall)
		if (!beSave.unlocked && player.eternityPoints.gte("1e1200") && bigRipped()) unlockBreakEternity()
		if (!ghSave && isQuantumReached() && bigRipped()) unlockFundament()

		if (quSave.quarks.gte(Number.MAX_VALUE) && !quSave.reachedInfQK) {
			quSave.reachedInfQK = true

			el("welcome").style.display = "flex"
			el("welcomeMessage").innerHTML = "Congratulations for getting " + shorten(Number.MAX_VALUE) + " anti-Quarks! You have unlocked autobuyer modes and auto-assignation!"
			el('autoAssign').style.display = ""
			el('autoAssignRotate').style.display = ""
		}
	} else if (!quSave.reached && isQuantumReached()) doQuantumUnlockStuff()
}

function doQuantumUnlockStuff(){
	quSave.reached = true
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	el("welcomeMessage").innerHTML = "Congratulations! You reached " + shorten(getQuantumReq()) + " MA and completed EC14 for the first time! This allows you to go Quantum (the 5th layer), giving you a quark in exchange for everything up to this point, which can be used to get more powerful upgrades. This allows you to get gigantic numbers!"
}

function postBoostMilestone() {
	return mod.ngp3 && (getEternitied() >= 1e9 || hasAch("ng3p71"))
}

function quantumOverallUpdating(diff){
	//Color Powers
	for (var c of QUARK_COLORS) quSave.colorPowers[c]=quSave.colorPowers[c].add(getColorPowerProduction(c).mul(diff))

	if (hasMasteryStudy("d7")) quSave.electrons.amount = getPositronGainFinalMult() * quSave.electrons.sacGals
	if (hasMasteryStudy("d10")) replicantOverallUpdating(diff)
	if (hasMasteryStudy("d11")) emperorDimUpdating(diff)
	if (NF.unl()) nanofieldUpdating(diff)
	if (isDecayOn()) treeOfDecayUpdating(diff)
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

TABS = Object.assign(TABS, {
	qu: { name: "Quantum", class: "quantumbtn", stab: [ "aq", "gl", "pos", "ant_n", "nf", "decay", "mil_time" ], unl: _ => quantumed, update() {
		if (hasBraveMilestone(8)) updateQuantumWorth("display")
	} },
	stats_qu: { name: "Quantum", class: "quantumbtn", unl: _ => quantumed, update: _ => displayQuantumStats() },

	aq: { name: "Anti-Quarks", update: _ => updateQuarksTab() },
	gl: { name: "Gluons", update: _ => GLUON.update() },
	pos: { name: "Positrons", unl: _ => hasMasteryStudy("d7") && !inAnyQC(), update: _ => updatePositronsTab() },
	chal_qu: { name: "Quantum", class: "quantumbtn", unl: _ => hasMasteryStudy("d8") && speedrunMilestonesReached >= 16, update() {
		el("qcDisclaimer").innerHTML = (isQCFree() ? "" : "Spend Positrons to start Quantum Challenges.<br>You have " + getFullExpansion(Math.round(quSave.electrons.amount)) + " Positrons.<br>") + "<b class='red'>Positrons are disabled in Quantum Challenges!</b>"
		for (var c = 1; c <= 8; c++) el("qc" + c + "reward").textContent = QC[c].reward_eff_disp(tmp.qu.chal.reward[c])
	} },
	decay: { name: "Decay", unl: _ => hasMasteryStudy("d13"), update: _ => updateTreeOfDecayTab() },
	rip: { name: "Big Rip", class: "bigrip", unl: _ => hasMasteryStudy("d14"), update: _ => updateBigRipTab() },
	mil_time: { name: "Speedrun Milestones" }
})

//Settings
function updateNetTop(toggle) {
	if (toggle) aarMod.netQuarkTop = !aarMod.netQuarkTop

	el("netQuarkTop").style.display = quantumed ? "" : "none"
	el("netQuarkTop").textContent = "Anti-quarks at top: " + (aarMod.netQuarkTop ? "Net" : "Current")

	el("quarks2").style.display = aarMod.netQuarkTop ? "" : "none"
	el("quantumWorth1").style.display = aarMod.netQuarkTop ? "none" : ""
	el("quantumWorth2").style.display = aarMod.netQuarkTop ? "none" : ""
}

//Setup
function setupNGP3HTMLAndData() {
	setupMasteryStudiesHTML()
	GLUON.setupTab()
	setupQCHTML()
	setupPCTable()
	setupEmpDimensionHTML()
	setupNanofieldHTML()
	setupToDHTML()
	setupBraveMilestones()
	setupAutomatorHTML()
	NT.setupTab()
	PHOTON.setupTab()
	LAB.setupTab()
	HIGGS.setupTab()

	//META
	setupBadges()
	PRESET.setup()
	REDISCOVER.setup()
}

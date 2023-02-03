let ghostified = false
function ghostify(auto, force) {
	if (implosionCheck) return
	if (!force && !canGhostify()) return

	if (!auto && !force && aarMod.ghostifyConf && !confirm("Fundament will reset everything up to this point, except achievements and some quantum statistics. Are you ready for this?")) {
		denyGhostify()
		return
	}
	if (!ghostified && !confirm("Are you really sure? Do you want to enlarge yourself for particles, in exchange of everything?")) {
		denyGhostify()
		return
	}

	var gain = getGHPGain()
	var implode = !auto && !force && isAnimationOn("ghostify")
	if (implode) {
		var amt = ghSave.ghostParticles.add(gain).round()
		var seconds = ghostified ? 4 : 10
		implosionCheck = 1
		ghostifyAni(gain, amt, seconds)
		setTimeout(function(){
			showTab("")
		}, seconds * 250)
		setTimeout(function(){
			if (Math.random()<1e-3) giveAchievement("Boo!")
			showQuantumTab("uquarks")
			showAntTab("antcore")
			ghostifyReset(false, gain)
		}, seconds * 750)
		setTimeout(function(){
			implosionCheck=0
		}, seconds * 1000)
	} else ghostifyReset(force, gain)
}

function ghostifyReset(force, gain) {
	//Revert Big Rip
	if (bigRipped()) switchAB()

	var bulk = getGhostifiedGain()
	if (!force) {
		ghSave.ghostParticles = ghSave.ghostParticles.add(gain).round()
		el("GHPAmount").textContent = shortenDimensions(ghSave.ghostParticles)

		//Records
		ghSave.times = nA(ghSave.times, bulk)
		if (!ghostified) {
			ghostified = true
			ngp3_feature_notify("fu")
			el("ghostparticles").style.display = ""
			giveAchievement("Kee-hee-hee!")
		} else if (ghSave.times > 2 && ghSave.times < 11) {
			$.notify("You unlocked " + (ghSave.times+2) + "th Neutrino upgrade!", "success")
			if (ghSave.times % 3 > 1) el("neutrinoUpg" + (ghSave.times + 2)).parentElement.parentElement.style.display = ""
			else el("neutrinoUpg" + (ghSave.times + 2)).style.display = ""
		}

		for (var i=ghSave.last10.length-1; i>0; i--) ghSave.last10[i] = ghSave.last10[i-1]
		ghSave.last10[0] = [ghSave.time, gain]
		ghSave.best = Math.min(ghSave.best, ghSave.time)
	}

	//Brave Milestones & Achievements
	if (!force) {
		while (quSave.times <= tmp.bm[ghSave.milestones]) ghSave.milestones++
		updateBraveMilestones()

		giveAchievement("Kee-hee-hee!")
		if (bm == 16) giveAchievement("I rather oppose the theory of everything")
		if (player.eternityPoints.e >= 22e4 && ghSave.under) giveAchievement("Underchallenged")
		if (ghSave.best <= 6) giveAchievement("Running through Big Rips")
		if (quSave.times >= 1e3 && ghSave.milestones >= 16) giveAchievement("Scared of ghosts?")
	}

	var bm = ghSave.milestones
	if (!force && bm > 6 && hasAch("ng3p68")) gainNeutrinos(Decimal.mul(2e3 * brSave.bestGals, bulk), "all")

	doReset("funda")
}

RESETS.funda = {
	resetQuantums() {
		quSave.times = 0
		quSave.best = 9999999999
		quSave.last10 = [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]]
		updateSpeedruns()
		updateLastTenQuantums()
	},
	resetQuarkGluons(bm) {
		quSave.quarks = E(0)
		quSave.usedQuarks = {
			r: E(0),
			g: E(0),
			b: E(0),
		}
		quSave.colorPowers = {
			r: E(0),
			g: E(0),
			b: E(0),
		}
		quSave.gluons = {
			rg: E(0),
			gb: E(0),
			br: E(0),
		}
		quSave.multPower = 0
		if (bm < 2) quSave.upgrades = []

		updateQuantumWorth("quick")
		updateColorCharge()
		updateGluonsTabOnUpdate("prestige")
	},
	resetElectrons(bm) {
		if (bm >= 3) return
		quSave.electrons.mult = 2
		quSave.electrons.rebuyables = [0, 0, 0, 0]
	},
	resetQCs(bm) {
		quSave.challenge = []
		quSave.pairedChallenges.current = 0
		if (bm < 1) {
			quSave.challenges = {}
			quSave.pairedChallenges.order = {}
			quSave.pairedChallenges.completed = 0
		} else if (bm < 3) {
			for (var comp of Object.values(quSave.challenges)) quSave.electrons.mult += .5 - comp * .25
		}
		updateInQCs()
		updateQuantumChallenges()
		updateQuantumTabDisplays()
		updatePCCompletions()
	},
	resetDuplicants(bm) {
		quSave.replicants = getBrandNewReplicantsData()

		let permUnlocks = [null, 7, 9, 10, 10, 11, 11, 12, 12]
		for (let d = 1; d <= 8; d++) {
			let keep10 = bm >= permUnlocks[d]
			EDsave[d].perm = keep10 ? 10 : 0
			if (keep10) quSave.replicants.limitDim = d
		}
		if (quSave.replicants.limitDim >= 1) {
			quSave.replicants.limit = 10
			quSave.replicants.limitCost = E_pow(200, quSave.replicants.limitDim * 9).mul(1e49)
			quSave.replicants.quantumFoodCost = E_pow(5, quSave.replicants.limitDim * 30).mul(2e46)
		}
		updateEmperorDimensions()

		nfSave.rewards = bm >= 13 ? 5 : 0
		updateNanoRewardTemp()
	},
	resetDecay(bm) {
		todSave.r.quarks = E(0)
		todSave.r.spin = bm >= 14 ? E(1e25) : E(0)
		todSave.r.upgrades = {}
		todSave.r.decays = hasAch("ng3p86") ? Math.floor(todSave.r.decays * .75) : 0
		todSave.upgrades = { 1: bm >= 4 ? 5 : 0 }
		updateTODStuff()
	},
	resetRip(bm) {
		brSave.active = false
		brSave.times = 0
		brSave.bestGals = 0
		if (bm < 1) brSave.upgrades = []

		if (bm < 3) {
			beSave.unlocked = false
			beSave.break = false
		}
		beSave.eternalMatter = E(0)
		beSave.upgrades = []
		beSave.epMultPower = 0
		updateBreakEternity()
	},

	doReset() {
		let bm = ghSave.milestones
		ghSave.time = 0
		GHPminpeak = E(0)
		GHPminpeakValue = E(0)

		player.infinitiedBank = 0
		player.eternitiesBank = ghostified ? 1e5 : 0
		updateBankedEter()
		player.dilation.bestTP = E(0)
		player.meta.bestOverQuantums = E(0)
		if (bm < 3) {
			var keepMS = []
			for (var i of player.masterystudies) if (i[0] != "d") keepMS.push(i)
			player.masterystudies = keepMS
		}

		this.resetQuantums(bm)
		this.resetQuarkGluons(bm)
		this.resetElectrons(bm)
		this.resetQCs(bm)
		this.resetDuplicants(bm)
		this.resetDecay(bm)
		this.resetRip(bm)

		updateAutoQuantumMode()
		doGhostifyGhostifyResetStuff()
	}
}

function canGhostify() {
	return isQuantumReached() && bigRipped()
}

var ghostifyDenied
function denyGhostify() {
	ghostifyDenied++
	if (ghostifyDenied >= 15) giveAchievement("You are supposed to become a ghost!")
}

function toggleGhostifyConf() {
	aarMod.ghostifyConf = !aarMod.ghostifyConf
	el("ghostifyConfirmBtn").textContent = "Fundament confirmation: O" + (aarMod.ghostifyConf ? "N" : "FF")
}

ghostifyAni = function(gain, amount, seconds=4) {
	el("ghostifyani").style.display = ""
	el("ghostifyani").style.width = "100%"
	el("ghostifyani").style.height = "100%"
	el("ghostifyani").style.left = "0%"
	el("ghostifyani").style.top = "0%"
	el("ghostifyani").style.transform = "rotateZ(0deg)"
	el("ghostifyani").style["transition-duration"] = (seconds / 4) + "s"
	el("ghostifyanitext").style["transition-duration"] = (seconds / 8) + "s"
	setTimeout(function() {
		el("ghostifyanigained").innerHTML = ghostified ? "You now have <b>" + shortenDimensions(amount) + "</b> Elementary Particles. (+" + shortenDimensions(gain) + ")" : "We became small. You have enlarged enough to see first particles!<br>Congratulations for beating a PC with QCs 6 & 8 combination!"
		el("ghostifyanitext").style.left = "0%"
		el("ghostifyanitext").style.opacity = 1
	}, seconds * 250)
	setTimeout(function() {
		el("ghostifyanitext").style.left = "100%"
		el("ghostifyanitext").style.opacity = 0
	}, seconds * 625)
	setTimeout(function() {
		el("ghostifyani").style.width = "0%"
		el("ghostifyani").style.height = "0%"
		el("ghostifyani").style.left = "50%"
		el("ghostifyani").style.top = "50%"
		el("ghostifyani").style.transform = "rotateZ(45deg)"
	}, seconds * 750)
	setTimeout(function() {
		el("ghostifyani").style.width = "0%"
		el("ghostifyani").style.height = "0%"
		el("ghostifyani").style.left = "50%"
		el("ghostifyani").style.top = "50%"
		el("ghostifyani").style.transform = "rotateZ(-45deg)"
		el("ghostifyani").style["transition-duration"] = "0s"
		el("ghostifyanitext").style.left = "-100%"
		el("ghostifyanitext").style["transition-duration"] = "0s"
	}, seconds * 1000)
}

//GHP
function getGHPGain() {
	if (!bigRipped()) return E(0)
	if (!ghostified) return E(1)

	let log = brSave.bestThisRun.log10() / getQCGoal(undefined, true) - 1
	if (log < 0) return E(0)

	let x = pow10(log)
	//ng3p58 reward was now free
	//the square part of the formula maxes at e10, and gets weaker after ~e60 total
	let boost = Math.min(7, log / 2) + Math.min(3, log / 2)
	let softcap = x.plus(pow10(log)).plus(10).log10()
	boost = Math.min(boost, 600 / softcap)
	log += boost

	return x.mul(getGHPMult()).floor()
}

function getGHPMult() {
	let x = getGHPBaseMult()
	if (hasAch("ng3p93")) x = x.mul(500)
	if (hasAch("ng3p97")) x = x.mul(E_pow(ghSave.times + 1, 1/3))
	return x
}

var averageGHP = E(0)
var bestGHP
function getGHPRate(num) {
	if (num.lt(1 / 60)) return (num * 1440).toFixed(1) + " ElP/day"
	if (num.lt(1)) return (num * 60).toFixed(1) + " ElP/hr"
	return shorten(num) + " ElP/min"
}

//Ghostified
function getGhostifiedGain() {
	let r = 1
	if (hasBU(15)) r = nN(tmp.blu[15].gh)
	return r
}

function updateLastTenGhostifies() {
	if (!mod.ngp3) return
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

//Brave Milestones
function setupBraveMilestones(){
	for (var m = 1; m <= 16; m++) el("braveMilestone" + m).textContent=getFullExpansion(tmp.bm[m - 1])+"x quantumed"+(m==1?" or lower":"")
}

function updateBraveMilestones() {
	if (ghostified) {
		for (var m = 1; m < 17;m++) el("braveMilestone" + m).className = "achievement achievement" + (ghSave.milestones < m ? "" : "un") + "locked"
		for (var r = 1; r < 3; r++) el("braveRow" + r).className = ghSave.milestones < r * 8 ? "" : "completedrow"
	}
}

//Tabs
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
	if (el("automaticghosts").style.display == "block") {
		if (ghSave.milestones > 7) updateQuantumWorth("display")
		updateAutomatorHTML()
	}
	if (el("gphtab").style.display == "block") updatePhotonTab()
}
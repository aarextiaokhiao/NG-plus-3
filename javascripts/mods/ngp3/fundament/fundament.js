//Saving
function setupFundament() {
	return {
		times: 0,
		time: player.totalTimePlayed,
		best: 9999999999,
		last10: [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]],
		milestones: 0,
		ghostParticles: E(0),
		multPower: 1,
		neutrinos: NT.setup(),
		automatorGhosts: setupAutomaticGhostsData(),
		photons: PHOTON.setup(),
		lab_real: BOSONIC_LAB.setup()
	}
}

function loadFundament() {
	ghSave = player.ghostify
	ghostified = ghSave?.times > 0 
	blSave = undefined

	if (!mod.ngp3) return
	player.meta.bestOverGhostifies = Decimal.max(player.meta.bestOverGhostifies, player.meta.bestOverQuantums)
	player.dilation.bestTPOverGhostifies = Decimal.max(player.dilation.bestTPOverGhostifies, player.dilation.bestTP)

	if (!ghSave) return
	ghSave = deepUndefinedAndDecimal(ghSave, setupFundament())
	blSave = ghSave?.bl

	ghSave.times = nP(ghSave.times)
	updateBraveMilestones()
	updateAutoGhosts(true)
	updatePhotonUnlocks()
}

function unlockFundament() {
	player.ghostify = setupFundament()
	loadFundament()
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "You are finally able to complete PC6+8 in Big Rip! However, because of the unstability of this universe, the only way to go further is to fundament. This allows to unlock new stuff in exchange for everything that you have."
}

//Reset
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
		}, seconds * 625)
		setTimeout(function(){
			implosionCheck=0
		}, seconds * 1000)
	} else ghostifyReset(force, gain)
}

function ghostifyReset(force, gain) {
	if (!force) {
		ghSave.ghostParticles = ghSave.ghostParticles.add(gain).round()
		el("GHPAmount").textContent = shortenDimensions(ghSave.ghostParticles)

		//Records
		ghSave.times++
		if (!ghostified) {
			ghostified = true
			ngp3_feature_notify("fu")
			el("ghostparticles").style.display = ""
			giveAchievement("Kee-hee-hee!")
		} else if (ghSave.times > 2 && ghSave.times < 11) {
			$.notify("You unlocked " + (ghSave.times + 2) + "th Neutrino upgrade!", "success")
		}

		for (var i=ghSave.last10.length-1; i>0; i--) ghSave.last10[i] = ghSave.last10[i-1]
		ghSave.last10[0] = [ghSave.time, gain]
		ghSave.best = Math.min(ghSave.best, ghSave.time)
	}

	//Brave Milestones & Achievements
	if (!force) {
		while (quSave.times <= BM_REQ[ghSave.milestones]) ghSave.milestones++
		updateBraveMilestones()

		giveAchievement("Kee-hee-hee!")
		if (quSave.times >= 1e3 && hasBraveMilestone(16)) giveAchievement("Scared of ghosts?")
	}

	var bm = ghSave.milestones

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
		if (bm < 1) quSave.upgrades = []

		updateQuantumWorth("quick")
		updateColorCharge()
		updateGluonsTabOnUpdate("prestige")
	},
	resetPositrons(bm) {
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
			EDsave[d].workers = E(EDsave[d].perm)
			if (keep10) quSave.replicants.limitDim = d
		}
		if (quSave.replicants.limitDim >= 1) {
			quSave.replicants.limit = 10
			quSave.replicants.limitCost = E_pow(200, quSave.replicants.limitDim * 9).mul(1e49)
			quSave.replicants.quantumFoodCost = E_pow(5, quSave.replicants.limitDim * 30).mul(2e46)
		}
		updateEmperorDimensions()

		nfSave.rewards = bm >= 13 ? 5 : 0
	},
	resetDecay(bm) {
		todSave.r.quarks = E(0)
		todSave.r.spin = E(0)
		todSave.r.upgrades = { 1: bm >= 4 ? 5 : 0 }
		todSave.r.decays = hasAch("ng3p86") ? Math.floor(todSave.r.decays * .75) : 0
		todSave.upgrades = {}
		updateTODStuff()
	},
	resetRip(bm) {
		if (bigRipped()) switchAB(false)
		brSave.active = false
		brSave.times = 0
		brSave.bestGals = 0
		brSave.spaceShards = E(0)
		if (bm < 1) brSave.upgrades = []

		if (bm < 3) {
			beSave.unlocked = false
			beSave.break = false
		}
		if (bm < 7) beSave.upgrades = []
		beSave.eternalMatter = E(0)
		beSave.epMultPower = 0
	},

	doReset() {
		let bm = ghSave.milestones

		player.infinitiedBank = 0
		player.eternitiesBank = ghostified ? 200 : 0
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
		this.resetPositrons(bm)
		this.resetQCs(bm)
		this.resetDuplicants(bm)
		this.resetDecay(bm)
		this.resetRip(bm)

		updateAutoQuantumMode()
		if (bm < 7) {
			ghSave.neutrinos.electron = E(0)
			ghSave.neutrinos.mu = E(0)
			ghSave.neutrinos.tau = E(0)
		}

		ghSave.time = 0
		GHPminpeak = E(0)
		GHPminpeakValue = E(0)

		player.unstableThisGhostify = 0
		ghSave.under = true
		ghSave.another = 10
		ghSave.reference = 10

		ghSave.photons.amt = E(0)
		ghSave.photons.light = []
		delete ghSave.photons.emission[2]
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

function updateGhostifyTempStuff() {
	if (!ghostified) return
	tmp.funda = {}
	PHOTON.temp()
	NT.temp()
}

//Animations
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
	}, seconds * 125)
	setTimeout(function() {
		el("ghostifyanitext").style.left = "100%"
		el("ghostifyanitext").style.opacity = 0
	}, seconds * 625)
	setTimeout(function() {
		el("ghostifyani").style.width = "0%"
		el("ghostifyani").style.height = "0%"
		el("ghostifyani").style.left = "50%"
		el("ghostifyani").style.top = "50%"
		el("ghostifyani").style.transform = "rotateZ(360deg)"
	}, seconds * 625)
	setTimeout(function() {
		el("ghostifyani").style.width = "0%"
		el("ghostifyani").style.height = "0%"
		el("ghostifyani").style.left = "50%"
		el("ghostifyani").style.top = "50%"
		el("ghostifyani").style.transform = "rotateZ(-180deg)"
		el("ghostifyani").style["transition-duration"] = "0s"
		el("ghostifyanitext").style.left = "-100%"
		el("ghostifyanitext").style["transition-duration"] = "0s"
	}, seconds * 1000)
}

//GHP
function getGHPGain() {
	if (!bigRipped()) return E(0)
	if (!ghostified) return E(1)

	let log = brSave.bestThisRun.log(getQCGoal()) - 1
	if (log < 0) return E(0)
	if (log > 15) log = Math.cbrt(log / 15) * 15

	return pow10(log).mul(getGHPMult()).floor()
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

//Brave Milestones
const BM_REQ = [200,175,150,100,50,40,30,25,20,15,10,5,4,3,2,1]
function setupBraveMilestones(){
	for (var m = 1; m <= 16; m++) el("braveMilestone" + m).textContent=BM_REQ[m - 1]+"x quantumed or lower"
}

function hasBraveMilestone(x) {
	return ghSave?.milestones >= x
}

//HTML
function toggleGhostifyConf() {
	aarMod.ghostifyConf = !aarMod.ghostifyConf
	el("ghostifyConfirmBtn").textContent = "Fundament confirmation: O" + (aarMod.ghostifyConf ? "N" : "FF")
}

function updateLastTenGhostifies() {
	if (!ghostified) return
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
	if (!ghSave) return
	for (var m = 1; m <= 16; m++) el("braveMilestone" + m).className = "achievement achievement" + (ghSave.milestones < m ? "" : "un") + "locked"
	for (var r = 1; r < 3; r++) el("braveRow" + r).className = ghSave.milestones < r * 8 ? "" : "completedrow"
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
	if (el("neutrinos").style.display == "block") NT.update()
	if (el("gphtab").style.display == "block") PHOTON.update()
	if (el("automaticghosts").style.display == "block") updateAutomatorHTML()
}
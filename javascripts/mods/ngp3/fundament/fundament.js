//Saving
function setupFundament() {
	return {
		times: 0,
		time: player.totalTimePlayed,
		best: 9999999999,
		last10: [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]],
		low: 9999999999,
		automatorGhosts: setupAutomaticGhostsData(),

		ghostParticles: E(0),
		multPower: 1,
		neutrinos: NT.setup(),

		photons: PHOTON.setup(),
		lab: LAB.setup(),
		hb: HIGGS.setupSave()
	}
}

function loadFundament(unl) {
	unl = unl ?? player.ghostify != undefined
	ghSave = player.ghostify = unl ? deepUndefinedAndDecimal(player.ghostify, setupFundament()) : undefined
	blSave = ghSave?.lab
	ghostified = ghSave?.times > 0
	braveMilestones = 0

	if (mod.ngp3) {
		player.meta.bestOverGhostifies = Decimal.max(player.meta.bestOverGhostifies, player.meta.bestOverQuantums)
		player.dilation.bestTPOverGhostifies = Decimal.max(player.dilation.bestTPOverGhostifies, player.dilation.bestTP)
	}
	if (!unl) return

	updateBraveMilestones()
	updateAutoGhosts(true)
	PHOTON.harvest.update()
	delete BL_HYPOTHESES.hypo_chosen
}

function unlockFundament() {
	loadFundament(true)
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	el("welcomeMessage").innerHTML = "You are finally able to complete PC6+8 in Big Rip! However, because of the unstability of this universe, the only way to go further is to fundament. This allows to unlock new stuff in exchange for everything that you have."
}

//Reset
let ghostified = false
function ghostify(auto, force) {
	if (implosionCheck) return
	if (!force && !canGhostify()) return

	if (!auto && !force && aarMod.ghostifyConf && !confirm("Fundament will reset everything up to this point, except achievements and some Quantum statistics. Are you ready for this?")) {
		denyGhostify()
		return
	}
	if (!ghostified && !confirm("Are you really sure? Do you want to enlarge yourself for particles, in exchange of everything?")) {
		denyGhostify()
		return
	}

	let gain = getGHPGain()
	let implode = !auto && !force && isAnimationOn("ghostify")
	if (implode) {
		let amt = ghSave.ghostParticles.add(gain).round()
		let seconds = ghostified ? 4 : 10
		implosionCheck = 1
		ghostifyAni(gain, amt, seconds)
		setTimeout(function(){
			TAB_CORE.open("none")
		}, seconds * 250)
		setTimeout(function(){
			if (Math.random()<1e-3) giveAchievement("Boo!")
			TAB_CORE.switch("qu", "aq")
			TAB_CORE.switch("ant", "ant_n")
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
			notifyFeature("fu")
			el("ghostparticles").style.display = ""
			giveAchievement("Kee-hee-hee!")
		} else if (ghSave.times > 2 && ghSave.times < 11) {
			$.notify("You unlocked " + (ghSave.times + 2) + "th Neutrino upgrade!", "success")
		}

		for (let i=ghSave.last10.length-1; i>0; i--) ghSave.last10[i] = ghSave.last10[i-1]
		ghSave.last10[0] = [ghSave.time, gain]
		ghSave.best = Math.min(ghSave.best, ghSave.time)
	}

	//Brave Milestones & Achievements
	if (!force) {
		ghSave.low = Math.min(ghSave.low, quSave.times)
		updateBraveMilestones(true)

		giveAchievement("Kee-hee-hee!")
		if (quSave.times >= 1e3 && hasBraveMilestone(16)) giveAchievement("Scared of ghosts?")
	}

	doReset("funda")
}

function canGhostify() {
	return isQuantumReached() && bigRipped()
}

let ghostifyDenied
function denyGhostify() {
	ghostifyDenied++
	if (ghostifyDenied >= 15) giveAchievement("You are supposed to become a ghost!")
}

function updateGhostifyTempStuff() {
	if (!ghostified) return
	if (tmp.funda == undefined) tmp.funda = {}
	HIGGS.temp()
	LAB.temp()
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
		el("ghostifyanigained").innerHTML = ghostified ? "You now have <b>" + shortenDimensions(amount) + "</b> Spectral Particles. (+" + shortenDimensions(gain) + ")" : "A spectral realm... Kee-hee-hee!"
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
		el("ghostifyani").style.transform = "rotateZ(240deg)"
	}, seconds * 625)
	setTimeout(function() {
		el("ghostifyani").style.width = "0%"
		el("ghostifyani").style.height = "0%"
		el("ghostifyani").style.left = "50%"
		el("ghostifyani").style.top = "50%"
		el("ghostifyani").style.transform = "rotateZ(-120deg)"
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

let averageGHP = E(0)
let bestGHP
function getGHPRate(num) {
	if (num.lt(1 / 60)) return (num * 1440).toFixed(1) + " SP/day"
	if (num.lt(1)) return (num * 60).toFixed(1) + " SP/hr"
	return shorten(num) + " SP/min"
}

//Brave Milestones
const BM_REQ = [200,175,150,100,50,40,30,25,20,15,10,5,4,3,2,1]
function setupBraveMilestones(){
	for (let m = 1; m <= 16; m++) el("braveMilestone" + m).textContent=BM_REQ[m - 1]+"x quantumed or lower"
}

function hasBraveMilestone(x) {
	return braveMilestones >= x
}

//HTML
function toggleGhostifyConf() {
	aarMod.ghostifyConf = !aarMod.ghostifyConf
	el("ghostifyConfirmBtn").textContent = "Fundament confirmation: O" + (aarMod.ghostifyConf ? "N" : "FF")
}

function updateLastTenGhostifies() {
	if (!ghostified) return
	let listed = 0
	let tempTime = E(0)
	let tempGHP = E(0)
	for (let i=0; i<10; i++) {
		if (ghSave.last10[i][1].gt(0)) {
			let qkpm = ghSave.last10[i][1].dividedBy(ghSave.last10[i][0]/600)
			let tempstring = shorten(qkpm) + " SP/min"
			if (qkpm<1) tempstring = shorten(qkpm*60) + " SP/hour"
			let msg = "The Fundament " + (i+1) + " ago took " + timeDisplayShort(ghSave.last10[i][0], false, 3) + " and gave " + shortenDimensions(ghSave.last10[i][1]) +" SP. "+ tempstring
			el("ghostifyrun"+(i+1)).textContent = msg
			tempTime = tempTime.add(ghSave.last10[i][0])
			tempGHP = tempGHP.add(ghSave.last10[i][1])
			bestGHP = ghSave.last10[i][1].max(bestGHP)
			listed++
		} else el("ghostifyrun"+(i+1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempGHP = tempGHP.dividedBy(listed)
		let qkpm = tempGHP.dividedBy(tempTime/600)
		let tempstring = shorten(qkpm) + " SP/min"
		averageGHP = tempGHP
		if (qkpm<1) tempstring = shorten(qkpm*60) + " SP/hour"
		el("averageGhostifyRun").textContent = "Last " + listed + " Fundaments average time: "+ timeDisplayShort(tempTime, false, 3)+" Average SP gain: "+shortenDimensions(tempGHP)+" SP. "+tempstring
	} else el("averageGhostifyRun").textContent = ""
}

let braveMilestones = 0
function updateBraveMilestones(onReset) {
	let oldMilestones = braveMilestones
	braveMilestones = 0

	if (!ghSave) return
	while (ghSave.low <= BM_REQ[braveMilestones]) braveMilestones++

	if (onReset && braveMilestones > oldMilestones) {
		$.notify("You fundamented with under "+getFullExpansion(BM_REQ[braveMilestones-1])+" Quantum resets!", "success")
		setTimeout(() => $.notify(el("braveMilestone"+braveMilestones).getAttribute("ach-tooltip"), "info"), 2e3)
	}

	for (let m = 1; m <= 16; m++) el("braveMilestone" + m).className = "achievement achievement" + (braveMilestones < m ? "" : "un") + "locked"
	for (let r = 1; r < 3; r++) el("braveRow" + r).className = braveMilestones < r * 8 ? "" : "completedrow"
}

TABS = Object.assign(TABS, {
	funda: { name: "Fundament", class: "ghostifybtn", stab: [ "nt", "ph", "auto_ant", "mil_brave" ], unl: _ => ghostified, update: _ => LAB.updateReq() },
	stats_funda: { name: "Fundament", class: "ghostifybtn", unl: _ => ghostified, update: _ => bestGhostifyDisplay() },

	nt: { name: "Neutrinos", update: _ => NT.update() },
	ph: { name: "Photons", update: _ => PHOTON.update() },
	auto_ant: { name: "Automator Ants", update: _ => updateAutomatorHTML() },
	mil_brave: { name: "Brave Milestones" }
})

//Sublayers
function resetGHPandNeutrinos() {
	ghSave.ghostParticles = E(0)
	ghSave.multPower = 1
	ghSave.neutrinos.electron = E(0)
	ghSave.neutrinos.mu = E(0)
	ghSave.neutrinos.tau = E(0)
	ghSave.neutrinos.multPower = 1

	resetPowers()
	doReset("funda")
}
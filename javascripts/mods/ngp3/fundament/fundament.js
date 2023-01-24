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
		dev.ghostify(gain, amt, seconds)
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

	//Brave Milestones and Achievements
	if (!force) {
		while (quSave.times <= tmp.bm[ghSave.milestones]) ghSave.milestones++
		updateBraveMilestones()
	}

	var bm = ghSave.milestones
	if (bm > 2) for (var c=1;c<=8;c++) quSave.electrons.mult += .5 - QCIntensity(c) * .25
	if (!force && bm > 6 && hasAch("ng3p68")) gainNeutrinos(Decimal.times(2e3 * brSave.bestGals, bulk), "all")

	//Achievements
	if (bm > 15) giveAchievement("I rather oppose the theory of everything")
	if (player.eternityPoints.e >= 22e4 && ghSave.under) giveAchievement("Underchallenged")
	if (ghSave.best <= 6) giveAchievement("Running through Big Rips")
	if (!force && quSave.times >= 1e3 && ghSave.milestones >= 16) giveAchievement("Scared of ghosts?")

	//?!??!
	var nBRU = []
	var nBEU = []
	for (var u = 20; u > 0; u--) {
		if (nBRU.includes(u + 1) || hasRipUpg(u)) nBRU.push(u)
		if (u < 12 && u != 7 && (nBEU.includes(u + 1) || beSave.upgrades.includes(u))) nBEU.push(u)
	}

	ghSave.time = 0
	doReset("funda")
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

//GHP
function getGHPGain() {
	if (!mod.ngp3 || !bigRipped()) return E(0)
	if (!ghostified) return E(1)
	let log = brSave && brSave.bestThisRun.log10() / getQCGoal(undefined,true) - 1
	if (log < 0) return E(0)
	if (hasAch("ng3p58")) { 
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

function getGHPMult() {
	let x = getGHPBaseMult()
	if (hasAch("ng3p93")) x = x.times(500)
	if (hasAch("ng3p97")) x = x.times(E_pow(ghSave.times + 1, 1/3))
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
	if (el("gphtab").style.display == "block" && ghSave.ghostlyPhotons.unl) updatePhotonsTab()
}
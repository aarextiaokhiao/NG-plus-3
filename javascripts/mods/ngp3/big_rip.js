function unstoreTT() {
	if (tmp.qu.bigRip.storedTS===undefined) return
	player.timestudy.theorem = tmp.qu.bigRip.storedTS.tt
	player.timestudy.amcost = Decimal.pow(10, 2e4 * (tmp.qu.bigRip.storedTS.boughtA + 1))
	player.timestudy.ipcost = Decimal.pow(10, 100 * tmp.qu.bigRip.storedTS.boughtI)
	player.timestudy.epcost = Decimal.pow(2, tmp.qu.bigRip.storedTS.boughtE)
	var newTS = []
	var newMS = []
	var studies=tmp.qu.bigRip.storedTS.studies
	for (var s = 0; s < studies.length; s++) {
		var num=studies[s]
		if (typeof(num)=="string") num=parseInt(num)
		if (num<240) newTS.push(num)
		else newMS.push("t"+num)
	}
	for (var s = 7; s < 15; s++) if (player.masterystudies.includes("d" + s)) newMS.push("d" + s)
	player.timestudy.studies = newTS
	player.masterystudies = newMS
	updateBoughtTimeStudies()
	performedTS = false
	updateTheoremButtons()
	drawStudyTree()
	maybeShowFillAll()
	drawMasteryTree()
	updateMasteryStudyButtons()
	delete tmp.qu.bigRip.storedTS
}

function getSpaceShardsGain() {
	let ret = tmp.qu.bigRip.active ? tmp.qu.bigRip.bestThisRun : player.money
	ret = Decimal.pow(ret.add(1).log10() / 2000, 1.5).times(player.dilation.dilatedTime.add(1).pow(0.05))
	if (!tmp.qu.bigRip.active || tmp.be) {
		if (tmp.qu.breakEternity.upgrades.includes(3)) ret = ret.times(getBreakUpgMult(3))
		if (tmp.qu.breakEternity.upgrades.includes(6)) ret = ret.times(getBreakUpgMult(6))
	}
	if (hasNU(9)) ret = ret.times(Decimal.max(getEternitied(), 1).pow(0.1))

	let log = ret.log10()
	let log4log = Math.log10(log) / Math.log10(4)
	let start = 5 //Starts at e1,024.
	if (log4log > start && false) { //removed the softcap for now, it can go back in later maybe
		let capped=Math.min(Math.floor(Math.log10(Math.max(log4log + 2 - start, 1)) / Math.log10(2)), 10 - start)
		log4log = (log4log - Math.pow(2, capped) - start + 2) / Math.pow(2, capped) + capped + start - 1
		log = Math.pow(4, log4log)
	}
	ret = Decimal.pow(10, log)

	if (isNaN(ret.e)) return new Decimal(0)
	return ret.floor()
}

let bigRipUpgCosts = [0, 2, 3, 5, 20, 30, 45, 60, 150, 300, 2000, 1e9, 3e14, 1e17, 3e18, 3e20, 5e22, 1e32, 1e145, 1e150, Number.MAX_VALUE]
function buyBigRipUpg(id) {
	if (tmp.qu.bigRip.spaceShards.lt(bigRipUpgCosts[id]) || tmp.qu.bigRip.upgrades.includes(id)) return
	tmp.qu.bigRip.spaceShards = tmp.qu.bigRip.spaceShards.sub(bigRipUpgCosts[id])
	if (player.ghostify.milestones < 8) tmp.qu.bigRip.spaceShards=tmp.qu.bigRip.spaceShards.round()
	tmp.qu.bigRip.upgrades.push(id)
	document.getElementById("spaceShards").textContent = shortenDimensions(tmp.qu.bigRip.spaceShards)
	if (tmp.qu.bigRip.active) tweakBigRip(id, true)
	if (id == 10 && !tmp.qu.bigRip.upgrades.includes(9)) {
		tmp.qu.bigRip.upgrades.push(9)
		if (tmp.qu.bigRip.active) tweakBigRip(9, true)
	}
	for (var u = 1; u <= getMaxBigRipUpgrades(); u++) {
		document.getElementById("bigripupg" + u).className = tmp.qu.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" + (isBigRipUpgradeActive(u, true) ? "" : "off") : tmp.qu.bigRip.spaceShards.lt(bigRipUpgCosts[u]) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
	}
}

function tweakBigRip(id, reset) {
	if (id == 2) {
		for (var ec = 1; ec < 15; ec++) player.eternityChalls["eterc" + ec] = 5
		player.eternities = Math.max(player.eternities, 1e5)
		if (!reset) updateEternityChallenges()
	}
	if (!tmp.qu.bigRip.upgrades.includes(9)) {
		if (id == 3) player.timestudy.theorem += 5
		if (id == 5) player.timestudy.theorem += 20
		if (id == 7 && !player.timestudy.studies.includes(192)) player.timestudy.studies.push(192)
	}
	if (id == 9) {
		if (reset) player.timestudy = {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: []
		}
		if (!tmp.qu.bigRip.upgrades.includes(12)) player.timestudy.theorem += 1350
	}
	if (id == 10) {
		if (!player.dilation.studies.includes(1)) player.dilation.studies.push(1)
		if (reset) {
			showTab("eternitystore")
			showEternityTab("dilation")
		}
	}
	if (id == 11) {
		if (reset) player.timestudy = {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: []
		}
		if (!inQCModifier("ad")) {
			player.dilation.tachyonParticles = player.dilation.tachyonParticles.max(player.dilation.bestTP.sqrt())
			player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.max(player.dilation.bestTP.sqrt())
		}
	}
}

function isBigRipUpgradeActive(id, bigRipped) {
	if (player.masterystudies == undefined) return false
	if (bigRipped === undefined ? !tmp.qu.bigRip.active : !bigRipped) return false
	if (id == 1) if (!tmp.qu.bigRip.upgrades.includes(17)) for (var u = 3; u < 18; u++) if (tmp.qu.bigRip.upgrades.includes(u)) return false
	if (id > 2 && id != 4 && id < 9) if (tmp.qu.bigRip.upgrades.includes(9) && (id != 8 || !hasNU(11))) return false
	if (id == 4) if (tmp.qu.bigRip.upgrades.includes(11)) return false
	return tmp.qu.bigRip.upgrades.includes(id)
}

function updateBreakEternity() {
	if (player.masterystudies === undefined) {
		document.getElementById("breakEternityTabbtn").style.display = "none"
		return
	}
	document.getElementById("breakEternityTabbtn").style.display = tmp.qu.bigRip.active || tmp.qu.breakEternity.unlocked ? "" : "none"
	if (tmp.qu.breakEternity.unlocked) {
		document.getElementById("breakEternityReq").style.display = "none"
		document.getElementById("breakEternityShop").style.display = ""
		document.getElementById("breakEternityNoBigRip").style.display = tmp.qu.bigRip.active ? "none" : ""
		document.getElementById("breakEternityBtn").textContent = (tmp.qu.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
		for (var u = 1; u < (player.ghostify.ghostlyPhotons.unl ? 11 : 8); u++) document.getElementById("breakUpg" + u + "Cost").textContent = shortenDimensions(getBreakUpgCost(u))
		document.getElementById("breakUpg7MultIncrease").textContent = shortenDimensions(1e9)
		document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		document.getElementById("breakUpgRS").style.display = tmp.qu.bigRip.active ? "" : "none"
	} else {
		document.getElementById("breakEternityReq").style.display = ""
		document.getElementById("breakEternityReq").textContent = "You need to get " + shorten(new Decimal("1e1200")) + " EP before you can Break Eternity."
		document.getElementById("breakEternityNoBigRip").style.display = "none"
		document.getElementById("breakEternityShop").style.display = "none"
	}
}

function breakEternity() {
	tmp.qu.breakEternity.break = !tmp.qu.breakEternity.break
	tmp.qu.breakEternity.did = true
	document.getElementById("breakEternityBtn").textContent = (tmp.qu.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
	if (tmp.qu.bigRip.active) {
		tmp.be = tmp.qu.breakEternity.break
		updateTemp()
		if (!tmp.be && document.getElementById("timedimensions").style.display == "block") showDimTab("antimatterdimensions")
	}
	if (!player.dilation.active && isSmartPeakActivated) {
		EPminpeakType = 'normal'
		EPminpeak = new Decimal(0)
		player.peakSpent = 0
	}
}

function getEMGain() {
	let log = player.timeShards.div(1e9).log10() * 0.25
	if (log > 15) log = Math.sqrt(log * 15)
	
	let log2log = Math.log10(log) / Math.log10(2)
	let start = 10 //Starts at e1024.
	if (log2log > start) {
		let capped = Math.min(Math.floor(Math.log10(Math.max(log2log + 2 - start, 1)) / Math.log10(2)), 20 - start)
		log2log = (log2log - Math.pow(2, capped) - start + 2) / Math.pow(2, capped) + capped + start - 1
		log = Math.pow(2, log2log)
	}
	
	return Decimal.pow(10, log).floor()
}

var breakUpgCosts = [1, 1e3, 2e6, 2e11, 8e17, 1e45, null, 1e290, new Decimal("1e350"), new Decimal("1e375")]
function getBreakUpgCost(id) {
	if (id == 7) return Decimal.pow(2, tmp.qu.breakEternity.epMultPower).times(1e5)
	return breakUpgCosts[id - 1]
}

function buyBreakUpg(id) {
	if (!tmp.qu.breakEternity.eternalMatter.gte(getBreakUpgCost(id)) || tmp.qu.breakEternity.upgrades.includes(id)) return
	tmp.qu.breakEternity.eternalMatter = tmp.qu.breakEternity.eternalMatter.sub(getBreakUpgCost(id))
	if (player.ghostify.milestones < 15) tmp.qu.breakEternity.eternalMatter = tmp.qu.breakEternity.eternalMatter.round()
	if (id == 7) {
		tmp.qu.breakEternity.epMultPower++
		document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		document.getElementById("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
	} else tmp.qu.breakEternity.upgrades.push(id)
	document.getElementById("eternalMatter").textContent = shortenDimensions(tmp.qu.breakEternity.eternalMatter)
}

function getBreakUpgMult(id) {
	return tmp.beu[id]
}

function maxBuyBEEPMult() {
	let cost = getBreakUpgCost(7)
	if (!tmp.qu.breakEternity.eternalMatter.gte(cost)) return
	let toBuy = Math.floor(tmp.qu.breakEternity.eternalMatter.div(cost).add(1).log(2))
	let toSpend = Decimal.pow(2,toBuy).sub(1).times(cost).min(tmp.qu.breakEternity.eternalMatter)
	tmp.qu.breakEternity.epMultPower += toBuy
	tmp.qu.breakEternity.eternalMatter = tmp.qu.breakEternity.eternalMatter.sub(toSpend)
	if (player.ghostify.milestones < 15) tmp.qu.breakEternity.eternalMatter = tmp.qu.breakEternity.eternalMatter.round()
	document.getElementById("eternalMatter").textContent = shortenDimensions(tmp.qu.breakEternity.eternalMatter)
	document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
	document.getElementById("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
}

function getMaxBigRipUpgrades() {
	if (player.ghostify.ghostlyPhotons.unl) return tmp.ngp3l ? 19 : 20
	return 17
}

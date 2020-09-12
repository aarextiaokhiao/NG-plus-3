function unstoreTT() {
	if (tmp.qu.bigRip.storedTS===undefined) return
	player.timestudy.theorem=tmp.qu.bigRip.storedTS.tt
	player.timestudy.amcost=Decimal.pow(10,2e4*(tmp.qu.bigRip.storedTS.boughtA+1))
	player.timestudy.ipcost=Decimal.pow(10,100*tmp.qu.bigRip.storedTS.boughtI)
	player.timestudy.epcost=Decimal.pow(2,tmp.qu.bigRip.storedTS.boughtE)
	var newTS=[]
	var newMS=[]
	var studies=tmp.qu.bigRip.storedTS.studies
	for (var s=0;s<studies.length;s++) {
		var num=studies[s]
		if (typeof(num)=="string") num=parseInt(num)
		if (num<240) newTS.push(num)
		else newMS.push("t"+num)
	}
	for (var s=7;s<15;s++) if (player.masterystudies.includes("d"+s)) newMS.push("d"+s)
	player.timestudy.studies=newTS
	player.masterystudies=newMS
	updateBoughtTimeStudies()
	performedTS=false
	updateTheoremButtons()
	drawStudyTree()
	maybeShowFillAll()
	drawMasteryTree()
	updateMasteryStudyButtons()
	delete tmp.qu.bigRip.storedTS
}

function getSpaceShardsGain() {
	let ret = tmp.qu.bigRip.active ? tmp.qu.bigRip.bestThisRun : player.money
	ret = Decimal.pow(ret.add(1).log10()/2000, 1.5).times(player.dilation.dilatedTime.add(1).pow(0.05))
	if (!tmp.qu.bigRip.active || tmp.be) {
		if (tmp.qu.breakEternity.upgrades.includes(3)) ret = ret.times(getBreakUpgMult(3))
		if (tmp.qu.breakEternity.upgrades.includes(6)) ret = ret.times(getBreakUpgMult(6))
	}
	if (hasNU(9)) ret = ret.times(Decimal.max(getEternitied(), 1).pow(0.1))
	ret = ret.floor()
	if (player.aarexModifications.ngudpV !== undefined) {
		let log=ret.log10()
		let log4log=Math.log10(log)/Math.log10(4)
		let start=5 //Starts at e1,024.
		if (player.aarexModifications.nguepV) start++ //Starts at e4,096.
		if (player.aarexModifications.ngumuV) start-- //Starts at e256. (NGUd*' only)
		if (log4log>start) {
			let capped=Math.min(Math.floor(Math.log10(Math.max(log4log+2-start,1))/Math.log10(2)),10-start)
			log4log=(log4log-Math.pow(2,capped)-start+2)/Math.pow(2,capped)+capped+start-1
			log=Math.pow(4,log4log)
		}
		ret=Decimal.pow(10,log)
	}
	if (isNaN(ret.e)) return new Decimal(0)
	return ret
}

let bigRipUpgCosts = [0, 2, 3, 5, 20, 30, 45, 60, 150, 300, 2000, 1e9, 3e14, 1e17, 3e18, 3e20, 5e22, 1e32, 1e145, 1e150, Number.MAX_VALUE]
function buyBigRipUpg(id) {
	if (tmp.qu.bigRip.spaceShards.lt(bigRipUpgCosts[id])||tmp.qu.bigRip.upgrades.includes(id)) return
	tmp.qu.bigRip.spaceShards=tmp.qu.bigRip.spaceShards.sub(bigRipUpgCosts[id])
	if (player.ghostify.milestones < 8) tmp.qu.bigRip.spaceShards=tmp.qu.bigRip.spaceShards.round()
	tmp.qu.bigRip.upgrades.push(id)
	document.getElementById("spaceShards").textContent = shortenDimensions(tmp.qu.bigRip.spaceShards)
	if (tmp.qu.bigRip.active) tweakBigRip(id, true)
	if (id==10 && !tmp.qu.bigRip.upgrades.includes(9)) {
		tmp.qu.bigRip.upgrades.push(9)
		if (tmp.qu.bigRip.active) tweakBigRip(9, true)
	}
	for (var u=1;u<=getMaxBigRipUpgrades();u++) document.getElementById("bigripupg"+u).className = tmp.qu.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" + (isBigRipUpgradeActive(u, true) ? "" : "off") : tmp.qu.bigRip.spaceShards.lt(bigRipUpgCosts[u]) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
}

function tweakBigRip(id, reset) {
	if (id == 2) {
		for (var ec=1;ec<15;ec++) player.eternityChalls["eterc"+ec] = 5
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
	if (id == 1) if (!tmp.qu.bigRip.upgrades.includes(17)) for (var u=3;u<18;u++) if (tmp.qu.bigRip.upgrades.includes(u)) return false
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
		for (var u=1;u<(player.ghostify.ghostlyPhotons.unl?11:8);u++) document.getElementById("breakUpg" + u + "Cost").textContent = shortenDimensions(getBreakUpgCost(u))
		document.getElementById("breakUpg7MultIncrease").textContent = shortenDimensions(1e9)
		document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		document.getElementById("breakUpgRS").style.display = tmp.qu.bigRip.active ? "" : "none"
	} else {
		document.getElementById("breakEternityReq").style.display = ""
		document.getElementById("breakEternityReq").textContent = "You need to get " + shorten(new Decimal("1e1200")) + " EP before you will be able to Break Eternity."
		document.getElementById("breakEternityNoBigRip").style.display = "none"
		document.getElementById("breakEternityShop").style.display = "none"
	}
}

function breakEternity() {
	tmp.qu.breakEternity.break = !tmp.qu.breakEternity.break
	tmp.qu.breakEternity.did = true
	document.getElementById("breakEternityBtn").textContent = (tmp.qu.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
	giveAchievement("Time Breaker")
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
	if (log>15) log = Math.sqrt(log * 15)
	
	let log2log = Math.log10(log) / Math.log10(2)
	let start = 10 //Starts at e1024.
	if (log2log > start) {
		let capped = Math.min(Math.floor(Math.log10(Math.max(log2log + 2 - start, 1)) / Math.log10(2)), 20 - start)
		log2log = (log2log - Math.pow(2, capped) - start + 2) / Math.pow(2, capped) + capped + start - 1
		log = Math.pow(2, log2log)
	}
	
	return Decimal.pow(10,log).floor()
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

function updateBreakEternityUpgradesTemp() {
	//Setup
	var ep = player.eternityPoints
	var ts = player.timeShards
	var ss = tmp.qu.bigRip.spaceShards
	var em = tmp.qu.breakEternity.eternalMatter
	var nerfUpgs = !tmp.be && hasBosonicUpg(24)

	//Upgrade 1
	var log1 = ep.div("1e1280").add(1).log10()
	var log2 = em.times(10).max(1).log10()
	tmp.beu[1] = Decimal.pow(10, Math.pow(log1, 1/3) * 0.5 + Math.pow(log2, 1/3)).max(1)

	//Upgrade 2
	var log = ep.div("1e1290").add(1).log10()
	tmp.beu[2] = Math.pow(Math.log10(log + 1) * 1.6 + 1, player.currentEternityChall == "eterc10" ? 1 : 2)

	//Upgrade 3
	var log = ep.div("1e1370").add(1).log10()
	if (nerfUpgs) log /= 2e6
	var exp = Math.pow(log, 1/3) * 0.5
	if (!tmp.ngp3l) exp = softcap(exp, "beu3_log")
	tmp.beu[3] = Decimal.pow(10, exp)

	//Upgrade 4
	var log1 = ep.div("1e1860").add(1).log10()
	var log2 = ss.div("7e19").add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3) * 8
	if (!tmp.ngp3l && exp > 333) exp = 111 * Math.log10(3 * exp + 1)
	tmp.beu[4] = Decimal.pow(10, exp)

	//Upgrade 5
	var log1 = ep.div("1e2230").add(1).log10()
	var log2 = ts.div(1e90).add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3)
	if (player.aarexModifications.ngudpV && exp > 100) exp = Math.log10(exp) * 50
	if (!tmp.ngp3l && exp > 999) exp = 333 * Math.log10(exp + 1)
	exp *= 4
	tmp.beu[5] = Decimal.pow(10, exp)

	//Upgrade 6
	var log1 = ep.div("1e4900").add(1).log10()
	var log2 = em.div(1e45).add(1).log10()
	if (nerfUpgs) log1 /= 2e6
	var exp = Math.pow(log1, 1/3) / 1.7 + Math.pow(log2, 1/3) * 2
	if (!tmp.ngp3l && exp > 200) exp = 50 * Math.log10(50 * exp)
	tmp.beu[6] = Decimal.pow(10, exp)

	//Upgrade 7: EP Mult
	tmp.beu[7] = Decimal.pow(1e9, tmp.qu.breakEternity.epMultPower)

	if (player.ghostify.ghostlyPhotons.unl) {
		//Upgrade 8
		var x = Math.log10(player.dilation.tachyonParticles.div(1e200).add(1).log10() / 100 + 1) * 3 + 1
		if (player.aarexModifications.ngudpV && x > 2.2) x = 1.2 + Math.log10(x + 7.8)
		if (!tmp.ngp3l) {
			if (x > 3) x = 1 + Math.log2(x + 1)
			if (x > 10/3) x = 7/3 + Math.log10(3 * x)
		}
		tmp.beu[8] = x

		//Upgrade 9
		var x = em.div("1e335").add(1).pow(0.05 * Math.log10(4))
		if (!tmp.ngp3l) {
			if (x.gte(Decimal.pow(10,18))) x = Decimal.pow(x.log10() * 5 + 10, 9)
			if (x.gte(Decimal.pow(10,100))) x = Decimal.pow(x.log10(), 50)
		}
		tmp.beu[9] = x.toNumber()

		//Upgrade 10
		tmp.beu[10] = Math.max(Math.log10(ep.add(1).log10() + 1) - 1, 1)
	}
}

function getBreakUpgMult(id) {
	return tmp.beu[id]
}

function maxBuyBEEPMult() {
	let cost=getBreakUpgCost(7)
	if (!tmp.qu.breakEternity.eternalMatter.gte(cost)) return
	let toBuy=Math.floor(tmp.qu.breakEternity.eternalMatter.div(cost).add(1).log(2))
	let toSpend=Decimal.pow(2,toBuy).sub(1).times(cost).min(tmp.qu.breakEternity.eternalMatter)
	tmp.qu.breakEternity.epMultPower+=toBuy
	tmp.qu.breakEternity.eternalMatter=tmp.qu.breakEternity.eternalMatter.sub(toSpend)
	if (player.ghostify.milestones < 15) tmp.qu.breakEternity.eternalMatter = tmp.qu.breakEternity.eternalMatter.round()
	document.getElementById("eternalMatter").textContent = shortenDimensions(tmp.qu.breakEternity.eternalMatter)
	document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
	document.getElementById("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
}

function updateBRU1Temp() {
	tmp.bru[1] = 1
	if (!tmp.qu.bigRip.active) return
	let exp = 1
	if (tmp.qu.bigRip.upgrades.includes(17)) exp = tmp.bru[17]
	if (ghostified && player.ghostify.neutrinos.boosts > 7) exp *= tmp.nb[8]
	exp *= player.infinityPoints.max(1).log10()
	exp = softcap(exp, "bru1_log", tmp.ngp3l ? 1 : 2)
	tmp.bru[1] = Decimal.pow(10, exp) //BRU1
}

function updateBRU8Temp() {
	tmp.bru[8] = 1
	if (!tmp.qu.bigRip.active) return
	tmp.bru[8] = Decimal.pow(2,getTotalRG()) //BRU8
	if (!hasNU(11)) tmp.bru[8] = tmp.bru[8].min(Number.MAX_VALUE)
}

function updateBRU14Temp() {
	if (!tmp.qu.bigRip.active) {
		tmp.bru[14] = 1
		return
	}
	var ret = Math.min(tmp.qu.bigRip.spaceShards.div(3e18).add(1).log10()/3,0.4)
	var val = Math.sqrt(tmp.qu.bigRip.spaceShards.div(3e15).add(1).log10()*ret+1)
	if (val > 12) val = 10 + Math.log10(4 + 8 * val)
	tmp.bru[14] = val //BRU14
}

function updateBRU15Temp() {
	let r = Math.sqrt(player.eternityPoints.add(1).log10()) * 3.55
	if (r > 1e4 && !tmp.ngp3l) r = Math.sqrt(r * 1e4)
	tmp.bru[15] = r
}

function updateBRU16Temp() {
	tmp.bru[16] = player.dilation.dilatedTime.div(1e100).pow(0.155).max(1)
}

function updateBRU17Temp() {
	tmp.bru[17] = !tmp.ngp3l && ghostified ? 3 : 2.9
}

function updateBigRipUpgradesTemp(){
	updateBRU17Temp()
	updateBRU1Temp()
	updateBRU8Temp()
	updateBRU14Temp()
	updateBRU15Temp()
	updateBRU16Temp()
}

function updatePhotonsUnlockedBRUpgrades(){
	var bigRipUpg18base = 1 + tmp.qu.bigRip.spaceShards.div(1e140).add(1).log10()
	var bigRipUpg18exp = Math.max(tmp.qu.bigRip.spaceShards.div(1e140).add(1).log10() / 10, 1)
	if (bigRipUpg18base > 10 && tmp.newNGP3E) bigRipUpg18base *= Math.log10(bigRipUpg18base)
	tmp.bru[18] = Decimal.pow(bigRipUpg18base, bigRipUpg18exp) //BRU18
	
	var bigRipUpg19exp = Math.sqrt(player.timeShards.add(1).log10()) / (tmp.newNGP3E ? 60 : 80)
	tmp.bru[19] = Decimal.pow(10, bigRipUpg19exp) //BRU19
}

function getMaxBigRipUpgrades() {
	if (player.ghostify.ghostlyPhotons.unl) return tmp.ngp3l ? 19 : 20
	return 17
}

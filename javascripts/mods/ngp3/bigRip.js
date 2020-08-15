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

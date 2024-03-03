function bigRip(auto) {
	if (bigRipped()) {
		quantum()
		return
	}
	if (!canBigRip()) return
	for (let [id, pc] of Object.entries(quSave.pairedChallenges.order)) {
		for (let qc of pc) {
			var pc1 = Math.min(pc[0], pc[1])
			var pc2 = Math.max(pc[0], pc[1])
			if (pc1 == 6 && pc2 == 8) {
				selectPC(id, true)
				return
			}
		}
	}
}

function canBigRip() {
	return !bigRipped() && canDirectlyBigRip()
}

function canDirectlyBigRip() {
	if (!hasMasteryStudy("d14")) return
	for (let pc of Object.values(quSave.pairedChallenges.order)) {
		for (let qc of pc) {
			var pc1 = Math.min(pc[0], pc[1])
			var pc2 = Math.max(pc[0], pc[1])
			if (pc1 == 6 && pc2 == 8) return quSave.electrons.amount >= getQCIdCost([6,8])
		}
	}
}

function bigRipped() {
	return brSave?.active
}

function getSpaceShardsGain() {
	let ret = E_pow(brSave.bestThisRun.add(1).log10() / 1e3, 1.5).mul(player.dilation.dilatedTime.add(1).pow(0.05)).add(1)

	if (tmp.qu.be) {
		if (isBreakUpgActive(3)) ret = ret.mul(tmp.qu.beu[3])
		if (isBreakUpgActive(6)) ret = ret.mul(tmp.qu.beu[6])
	}
	if (hasNU(9)) {
		if (hasBLMilestone(4)) ret = ret.mul(pow10(Math.pow(Decimal.max(getEternitied(), 1).log10(), 4/3) / 40))
		else ret = ret.mul(Decimal.max(getEternitied(), 1).pow(0.1))
	}

	if (isNaN(ret.e)) return E(0)
	return ret.floor()
}

let bigRipUpgCosts = [0, 2, 3, 5, 20, 30, 45, 60, 150, 300, 2000, 1e9, 3e14, 1e17, 3e18, 3e20, 5e22, 1e32, 1e70]
function buyBigRipUpg(id) {
	if (brSave.spaceShards.lt(bigRipUpgCosts[id]) || hasRipUpg(id)) return
	brSave.spaceShards = brSave && brSave.spaceShards.sub(bigRipUpgCosts[id])
	if (!hasBraveMilestone(8)) brSave.spaceShards=brSave.spaceShards.round()

	brSave.upgrades.push(id)
	el("spaceShards").textContent = shortenDimensions(brSave.spaceShards)
	if (bigRipped()) tweakBigRip(id, true)
	if (id == 10 && !hasRipUpg(9)) {
		brSave.upgrades.push(9)
		if (bigRipped()) tweakBigRip(9, true)
	}
}

function hasRipUpg(x) {
	if (!mod.ngp3) return
	return brSave.upgrades.includes(x)
}

function isBigRipUpgradeActive(id) {
	if (!bigRipped()) return
	if (id == 1 && !hasRipUpg(17)) for (var u = 3; u < 17; u++) if (hasRipUpg(u)) return false
	if (id > 2 && id != 4 && id < 9) if (hasRipUpg(9) && (id != 8 || !hasNU(11))) return false
	if (id == 4 && hasRipUpg(11)) return false
	return hasRipUpg(id)
}

function tweakBigRip(id, reset) {
	if (id == 2) {
		for (var ec = 1; ec < 15; ec++) player.eternityChalls["eterc" + ec] = 5
		player.eternities = Math.max(player.eternities, 1e5)
		if (!reset) updateEternityChallenges()
	}
	if (!hasRipUpg(9)) {
		if (id == 3) player.timestudy.theorem += 5
		if (id == 5) player.timestudy.theorem += 20
		if (id == 7 && !hasTimeStudy(192)) player.timestudy.studies.push(192)
	}
	if (id == 9) {
		if (reset) player.timestudy = {
			theorem: 0,
			amcost: E("1e20000"),
			ipcost: E(1),
			epcost: E(1),
			studies: []
		}
		if (!hasRipUpg(12)) player.timestudy.theorem += 1350
	}
	if (id == 10 && !hasDilStudy(1)) player.dilation.studies.push(1)
	if (id == 11) {
		if (reset) player.timestudy = {
			theorem: 0,
			amcost: E("1e20000"),
			ipcost: E(1),
			epcost: E(1),
			studies: []
		}
		player.dilation.tachyonParticles = player.dilation.tachyonParticles.max(player.dilation.bestTP.sqrt())
		player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.max(player.dilation.bestTP.sqrt())
	}
}

function unstoreTT() {
	if (brSave.storedTS === undefined) return
	player.timestudy.theorem = brSave && brSave.storedTS.tt
	player.timestudy.amcost = pow10(2e4 * (brSave.storedTS.boughtA + 1))
	player.timestudy.ipcost = pow10(100 * brSave.storedTS.boughtI)
	player.timestudy.epcost = pow2(brSave.storedTS.boughtE)
	var newTS = []
	var newMS = []
	var studies = brSave.storedTS.studies
	for (var s = 0; s < studies.length; s++) {
		var num = studies[s]
		if (typeof(num) == "string") num=parseInt(num)
		if (num<240) newTS.push(num)
		else newMS.push("t"+num)
	}
	for (var s = 7; s < 15; s++) if (hasMasteryStudy("d" + s)) newMS.push("d" + s)
	player.timestudy.studies = newTS
	player.masterystudies = newMS
	delete brSave.storedTS
}

function switchAB(rip) {
	var data = {}
	data.crunch = { ...player.autobuyers[11], mode: player.autoCrunchMode }
	data.eternity = { ...player.eternityBuyer, mode: player.autoEterMode }
	brSave["autoSave" + (rip ? "Qu" : "Rip")] = data

	var data = brSave["autoSave" + (rip ? "Rip" : "Qu")]
	if (data) {
		player.autobuyers[11] = { ...data.crunch }
		player.autoCrunchMode = data.crunch.mode

		player.eternityBuyer = { ...data.eternity }
		player.autoEterMode = data.eternity.mode

		delete player.autobuyers[11].mode
		delete player.eternityBuyer.mode
		delete brSave["autoSave" + (rip ? "Rip" : "Qu")]
	}
}

function updateBigRipTab() {
	el("bigRipBtn").innerHTML = bigRipped() ? `Refine the rift.<br>+${shortenDimensions(getSpaceShardsGain())} Space Shards` : canDirectlyBigRip() ? "Big Rip the cosmos!" : "Unlock a Paired Challenge with QC6 and 8 combinations to Big Rip."
	el("bigRipBtn").className = "qu_upg " + (bigRipped() ? "onchallengebtn" : canDirectlyBigRip() ? "bigrip" : "unavailablebtn")
	el("spaceShards").textContent = shortenDimensions(brSave.spaceShards)
	bigRipUpgradeUpdating()
}

function updateBRU1Temp() {
	tmp.qu.bru[1] = 1
	if (!bigRipped()) return

	let exp = 1
	if (hasRipUpg(17)) exp = tmp.qu.bru[17]
	if (hasNB(8)) exp *= NT.eff("boost", 8)
	exp *= player.infinityPoints.max(1).log10()
	tmp.qu.bru[1] = pow10(exp) // BRU1
}

function updateBRU8Temp() {
	tmp.qu.bru[8] = 1
	if (!bigRipped()) return
	tmp.qu.bru[8] = pow2(getTotalRG()) // BRU8
	if (!hasNU(11)) tmp.qu.bru[8] = tmp.qu.bru[8].min(Number.MAX_VALUE)
}

function updateBRU14Temp() {
	if (!bigRipped()) {
		tmp.qu.bru[14] = 1
		return
	}
	var ret = Math.min(brSave.spaceShards.div(3e18).add(1).log10()/3,0.4)
	var val = Math.sqrt(brSave.spaceShards.div(3e15).add(1).log10()*ret+1)
	tmp.qu.bru[14] = Math.min(val, 15) //BRU14
}

function updateBRU15Temp() {
	let r = Math.sqrt(player.eternityPoints.add(1).log10()) * 3.55
	if (r > 1e3) r = Math.sqrt(r * 1e3)
	tmp.qu.bru[15] = r
}

function updateBRU16Temp() {
	tmp.qu.bru[16] = player.dilation.dilatedTime.div(1e100).pow(0.155).max(1)
}

function updateBRU17Temp() {
	tmp.qu.bru[17] = ghostified ? 3 : 2.9
}

function updateBigRipUpgradesTemp(){
	updateBRU1Temp()
	updateBRU8Temp()
	updateBRU14Temp()
	updateBRU15Temp()
	updateBRU16Temp()
	updateBRU17Temp()
}

function bigRipUpgradeUpdating() {
	el("spaceShards").textContent=shortenDimensions(brSave.spaceShards)
	for (var u=1;u<=18;u++) {
		el("bigripupg"+u).className = brSave && hasRipUpg(u) ? "qu_upg_bought bigrip" + (isBigRipUpgradeActive(u, true) ? "" : "off") : brSave.spaceShards.lt(bigRipUpgCosts[u]) ? "qu_upg unavailablebtn" : "qu_upg bigrip"
		el("bigripupg"+u+"cost").textContent = shortenDimensions(E(bigRipUpgCosts[u]))
	}

	el("bigripupg1current").textContent=shortenDimensions(tmp.qu.bru[1])
	el("bigripupg8current").textContent=shortenDimensions(tmp.qu.bru[8])+(Decimal.gte(tmp.qu.bru[8],Number.MAX_VALUE)&&!hasNU(11)?"x (cap)":"x")
	el("bigripupg14current").textContent=tmp.qu.bru[14].toFixed(2)
	el("bigripupg15current").textContent=shorten(tmp.qu.bru[15])
	el("bigripupg16current").textContent=shorten(tmp.qu.bru[16])
	el("bigripupg17current").textContent=tmp.qu.bru[17]
}

function toggleBigRipConf() {
	brSave.conf = !brSave.conf
	el("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + (brSave.conf ? "N" : "FF")
}

//BREAK ETERNITY
function setupBreakEternity() {
	return {
		unlocked: false,
		break: false,
		eternalMatter: 0,
		upgrades: [],
		epMultPower: 0
	}
}

function unlockBreakEternity() {
	beSave.unlocked = true
	if (!ghostified) notifyFeature("be")
	$.notify("Congratulations! You have unlocked Break Eternity!", "success")
}

function breakEternity() {
	beSave.break = !beSave.break
	beSave.did = true
	updateBreakEternity()
	if (!player.dilation.active && isSmartPeakActivated) {
		EPminpeakType = 'normal'
		EPminpeak = E(0)
		player.peakSpent = 0
	}
}

function brokeEternity() {
	return bigRipped() && beSave.break
}

function getEMGain() {
	let log = player.timeShards.div(1e9).log10() * 0.25
	if (log > 15) log = Math.sqrt(log * 15)

	return pow10(log).floor()
}

function updateBreakEternityUpgrade1Temp(){
	var ep = player.eternityPoints
	var em = beSave.eternalMatter
	var log1 = ep.div("1e1280").add(1).log10()
	var log2 = em.mul(10).max(1).log10()
	var exp = isBreakUpgActive(9) ? Math.pow(log1, 0.5) / 15 + Math.pow(log2, 2) / 400 :
		Math.pow(log1, 1/3) * 0.5 + Math.pow(log2, 1/3)
	tmp.qu.beu[1] = pow10(exp)
}

function updateBreakEternityUpgrade2Temp(){
	var ep = player.eternityPoints
	var log = ep.div("1e1290").add(1).log10()
	var ret = Math.pow(Math.log10(log + 1) * 1.6 + 1, player.currentEternityChall == "eterc10" ? 1 : 2)
	tmp.qu.beu[2] = Math.min(ret, 80)
}

function updateBreakEternityUpgrade3Temp(){
	var ep = player.eternityPoints
	var log = ep.div("1e1370").add(1).log10()
	var exp = Math.pow(log, 1/3) * 0.5
	tmp.qu.beu[3] = pow10(exp)
}

function updateBreakEternityUpgrade4Temp(){
	var ep = player.eternityPoints
	var ss = brSave && brSave.spaceShards
	var log1 = ep.div("1e1860").add(1).log10()
	var log2 = ss.div("7e19").add(1).log10()
	var exp = isBreakUpgActive(9) ? Math.pow(log1, 0.5) / 15 + Math.pow(log2, 1.5) / 8 :
		Math.pow(log1, 1/3) + Math.pow(log2, 1/3) * 8
	tmp.qu.beu[4] = pow10(exp)
}

function updateBreakEternityUpgrade5Temp(){
	var ep = player.eternityPoints
	var ts = player.timeShards
	var log1 = ep.div("1e2230").add(1).log10()
	var log2 = ts.div(1e90).add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3)
	if (exp > 100) exp = Math.log10(exp) * 50
	tmp.qu.beu[5] = pow10(exp * 4)
}

function updateBreakEternityUpgrade6Temp(){
	var ep = player.eternityPoints
	var em = beSave.eternalMatter
	var log1 = ep.div("1e4900").add(1).log10()
	var log2 = em.div(1e45).add(1).log10()

	var exp = Math.pow(log1, 1/3) / 1.7
	exp += isBreakUpgActive(10) ? Math.pow(log2, 4/3) / 30 : Math.pow(log2, 1/3) * 2

	tmp.qu.beu[6] = pow10(exp)
}

function updateBreakEternityUpgradesTemp() {
	updateBreakEternityUpgrade1Temp()
	updateBreakEternityUpgrade2Temp()
	updateBreakEternityUpgrade3Temp()
	updateBreakEternityUpgrade4Temp()
	updateBreakEternityUpgrade5Temp()
	updateBreakEternityUpgrade6Temp()

	//Upgrade 7: EP Mult
	tmp.qu.beu[7] = getBEEPMultBase().pow(beSave.epMultPower)
}

function getBEUnls() {
	let x = 7
	if (PHOTON.unlocked()) x += 3
	return x
}

var breakUpgCosts = [1, 1e3, 2e6, 2e11, 8e17, 1e45, null, 1/0, 1/0, 1/0]
function getBreakUpgCost(id) {
	if (id == 7) return pow2(beSave.epMultPower).mul(1e5)
	return breakUpgCosts[id - 1]
}

function buyBreakUpg(id) {
	if (!beSave.eternalMatter.gte(getBreakUpgCost(id))) return
	if (beSave.upgrades.includes(id)) return
	beSave.eternalMatter = beSave.eternalMatter.sub(getBreakUpgCost(id))
	if (!hasBraveMilestone(16)) beSave.eternalMatter = beSave.eternalMatter.round()

	if (id == 7) {
		beSave.epMultPower++
		el("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		el("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
	} else beSave.upgrades.push(id)
}

function getBreakUpgMult(id) {
	return tmp.qu.beu[id]
}

function getBEEPMultBase() {
	return pow10(Math.pow(Math.max(beSave.epMultPower / 400, 1), 3) * 9)
}

function isBreakUpgActive(id) {
	return tmp.qu.be && beSave.upgrades.includes(id)
}

function maxBuyBEEPMult() {
	let cost = getBreakUpgCost(7)
	if (!beSave.eternalMatter.gte(cost)) return
	let toBuy = Math.floor(beSave.eternalMatter.div(cost).add(1).log(2))
	let toSpend = pow2(toBuy).sub(1).mul(cost).min(beSave.eternalMatter)
	beSave.epMultPower += toBuy
	beSave.eternalMatter = beSave.eternalMatter.sub(toSpend)
	if (!hasBraveMilestone(16)) beSave.eternalMatter = beSave.eternalMatter.round()

	el("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
	el("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
}

function updateBreakEternity() {
	let unl = beSave?.unlocked
	el("breakEternityReq").style.display = bigRipped() && !unl ? "" : "none"
	el("breakEternityReq").textContent = "Get " + shortenCosts(E("1e1200")) + " EP to Break Eternity."
	el("breakEternityNoBigRip").style.display = !bigRipped() && unl ? "" : "none"
	el("breakEternityBtn").style.visibility = bigRipped() && unl ? "visible" : "hidden"

	let broke = brokeEternity()
	el("eternityUpgrades").style.display = !broke ? "" : "none"
	el("eternalMatterDiv").style.display = broke ? "" : "none"
	el("breakEternityUpgrades").style.display = broke ? "" : "none"
	el("breakUpgRow3").style.display = getBEUnls() > 7 ? "" : "none"
	el("breakUpg7").style.visibility = broke ? "visible" : "hidden"
	el("breakUpg7Max").style.visibility = broke ? "visible" : "hidden"
	el("beShortcut").style.display = broke && !LAB.unlocked() ? "" : "none"
	if (broke) {
		for (var u = 1; u <= getBEUnls(); u++) el("breakUpg" + u + "Cost").textContent = shortenDimensions(getBreakUpgCost(u))
		el("breakUpg7MultIncrease").textContent = shortenDimensions(getBEEPMultBase())
	}
}

function breakEternityDisplay(){
	if (!beSave?.unlocked) return

	el("breakEternityBtn").innerHTML = (beSave.break ? "FIX" : "BREAK") + " ETERNITY"
	el("eternalMatter").innerHTML = shortenDimensions(beSave.eternalMatter)
	for (var u = 1; u <= getBEUnls(); u++) {
		el("breakUpg" + u).className = beSave.upgrades.includes(u) ? "eternityupbtnbought" : beSave.eternalMatter.gte(getBreakUpgCost(u)) ? "eternityupbtn" : "eternityupbtnlocked"
		if (u < 8 && el("breakUpg" + u + "Mult")) el("breakUpg" + u + "Mult").textContent = shortenMoney(getBreakUpgMult(u))
	}
	if (bigRipped()) {
		el("eterShortcutEM").textContent=shortenDimensions(beSave.eternalMatter)
		el("eterShortcutEP").textContent=shortenDimensions(player.eternityPoints)
		el("eterShortcutTP").textContent=shortenMoney(player.dilation.tachyonParticles)
	}
}
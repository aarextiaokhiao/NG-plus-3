function getDTMultPostBRU11(){
	let gain = E(1)
	if (hasAch("ng3p11")) gain = gain.times(Math.max(player.galaxies / 600 + 0.5, 1))
	if (hasAch("ng3p41")) gain = gain.times(E_pow(4,Math.sqrt(nfSave.rewards)))
	if (player.masterystudies.includes("t263")) gain = gain.times(getMTSMult(263))
	if (player.masterystudies.includes("t281")) gain = gain.times(getMTSMult(281))
	gain = gain.times(tmp.qcRewards[1])
	if (player.masterystudies.includes("t322")) gain = gain.times(getMTSMult(322))
	if (player.masterystudies.includes("t341")) gain = gain.times(getMTSMult(341))
	gain = gain.times(getTreeUpgradeEffect(7))
	gain = gain.times(colorBoosts.b)
	if (GUBought("br2")) gain = gain.times(E_pow(2.2, Math.pow(tmp.sacPow.max(1).log10()/1e6, 0.25)))
	if (hasAch("r137")) gain = gain.times(Math.max((player.replicanti.amount.log10()-2e4)/8e3+1,1))
	return gain
}

function getBaseDTProduction(){
	let tp = player.dilation.tachyonParticles
	let exp = getDTGainExp()
	let gain = tp.pow(exp)
	if (NGP3andVanillaCheck()) {
		if (hasAch("r132")) gain = gain.times(Math.max(Math.pow(player.galaxies, 0.04), 1))
		if (hasAch("r137") && player.dilation.active) gain = gain.times(2)
	}
	
	if (mod.ngud) gain = gain.times(getNGUDTGain())
	gain = gain.times(getEternityBoostToDT())

	if (player.dilation.upgrades.includes('ngpp6')) gain = gain.times(getDil17Bonus())
	if (player.dilation.upgrades.includes('ngusp3')) gain = gain.times(getD22Bonus())
	if (mod.ngp3 && (!bigRipped() || hasRipUpg(11))) {
		gain = gain.times(getDTMultPostBRU11())
	}
	if (hasBU(15)) gain = gain.times(tmp.blu[15].dt)
	if (mod.p3ep && hasAch("r138") && gain.lt(1e100)) gain = gain.times(3).min(1e100)
	if ((mod.ngp3 || mod.p3ep) && hasAch("ngpp13")) gain = gain.times(2)

	return gain
}

function getDilTimeGainPerSecond() {
	let gain = getBaseDTProduction()
	return gain.times(pow2(getDilUpgPower(1)))	
}

function getDTGainExp(){
	let exp = GUBought("br3") ? 1.1 : 1
	if (ghostified && ghSave.ghostlyPhotons.unl) exp *= tmp.le[0]
	return exp
}

function getEternitiesAndDTBoostExp() {
	let exp = 0
	if (player.dilation.upgrades.includes('ngpp2')) exp += mod.udp ? .2 : .1
	if (player.dilation.upgrades.includes('ngud2')) exp += .1
	if (player.dilation.upgrades.includes('ngmm3')) exp += .1
	return exp
}

function getDilPower() {
	var ret = E_pow(getDil3Power(), getDilUpgPower(3))
	if (NGP3andVanillaCheck()) {
		if (hasAch("r132")) ret = ret.times(Math.max(Math.pow(player.galaxies, 0.04), 1))
	}

	if (player.dilation.upgrades.includes("ngud1")) ret = getD18Bonus().times(ret)
	if (mod.ngp3) {
		if (hasAch("ng3p11")) ret = ret.times(Math.max(getTotalRG() / 125, 1))
		if (player.masterystudies.includes("t264")) ret = ret.times(getMTSMult(264))
		if (GUBought("br1")) ret = ret.times(getBR1Effect())
	}
	return ret
}

function getDilUpgPower(x) {
	let r = player.dilation.rebuyables[x] || 0
	if (aarMod.nguspV) r += exDilationUpgradeStrength(x)
	else if (mod.ngud && !mod.udp) r *= exDilationUpgradeStrength(x)
	return r
}

function getDil3Power() {
	let ret = 3
	if (aarMod.nguspV) ret += getDilUpgPower(4) / 2
	return ret
}

function getDilationTPFormulaExp(disable){
	return getDilExp(disable)
}

function getDilExp(disable) {
	let ret = 1.5
	if (mod.ngep) ret += .001
	if (mod.ngpp && !aarMod.nguspV) ret += getDilUpgPower(4) / 4
	if (mod.ngp3) {
		if ((!bigRipped() || hasRipUpg(11)) && player.masterystudies.includes("d13") && disable != "TU3") ret += getTreeUpgradeEffect(2)
		if (ghostified && ghSave.neutrinos.boosts && disable != "neutrinos") ret += tmp.nb[1]
	}
	return ret
}

function getTotalTPGain(){
	return getDilGain()
}

function getTotalTachyonParticleGain(){
	return getDilGain()
}

function getDilGain() {
	if (player.money.lt(10)) return E(0)
	var log = Math.log10(player.money.log10() / 400) * getDilExp() + getDilPower().log10()
	if (mod.ngp3) if (!tmp.be && bigRipped()) {
		if (log > 100) log = Math.sqrt(100 * log)
	}
	return pow10(log)
}


function getReqForTPGain() {
	let tplog = player.dilation.totalTachyonParticles.log10()
	if (tplog > 100 && !tmp.be && bigRipped()) tplog = Math.pow(tplog, 2) / 100
	return pow10(pow10(tplog).div(getDilPower()).pow(1 / getDilExp()).toNumber() * 400)
}

function getNGUDTGain(){
	var gain = E(1)
	gain = gain.times(getBlackholePowerEffect())
	if (player.eternityUpgrades.includes(7)) gain = gain.times(1 + Math.log10(Math.max(1, player.money.log(10))) / 40)
	if (player.eternityUpgrades.includes(8)) gain = gain.times(1 + Math.log10(Math.max(1, player.infinityPoints.log(10))) / 20)
	if (player.eternityUpgrades.includes(9)) gain = gain.times(1 + Math.log10(Math.max(1, player.eternityPoints.log(10))) / 10)
	return gain
}

function getDilatedTimeGainPerSecond(){
	return getDilTimeGainPerSecond()
}

function getEternityBoostToDT(){
	var gain = E(1)
	let eterExp = getEternitiesAndDTBoostExp()
	if (eterExp > 0) gain = gain.times(Decimal.max(getEternitied(), 1).pow(eterExp))
	if (player.dilation.upgrades.includes('ngpp2') && mod.ngep) {
		let e = E(getEternitied())
		gain = gain.times(e.max(10).log10()).times(Math.pow(e.max(1e7).log10()-6,3))
		if (e.gt(5e14)) gain = gain.times(Math.sqrt(e.log10())) // this comes into play at the grind right before quantum
	}
	return gain
}

function dilates(x, m) {
	let e = 1
	let y = x
	let a = false
	if (player.dilation.active && m != 2 && (m != "meta" || !hasAch("ng3p63") || !inQC(0))) {
		e *= dilationPowerStrength()
		if (mod.ngmu) e = 0.9 + Math.min((player.dilation.dilatedTime.add(1).log10()) / 1000, 0.05)
		if (mod.ngud && !mod.udp && !aarMod.nguspV) e += exDilationBenefit() * (1-e)
		if (player.dilation.upgrades.includes(9)) e *= 1.05
		if (player.dilation.rebuyables[5]) e += 0.0025 * (1 - 1 / Math.pow(player.dilation.rebuyables[5] + 1 , 1 / 3))
		a = true
	}
	if (inNGM(2) && m != 1) {
		e *= dilationPowerStrength()
		a = true
	}
	if (a) {
		if (m != "tick") x = x.max(1)
		else if (!inNGM(2)) x = x.times(1e3)
		if (x.gt(10) || !inNGM(3)) x = pow10(Math.pow(x.log10(), e))
		if (m == "tick" && inNGM(2)) x = x.div(1e3)
		if (m == "tick" && x.lt(1)) x = Decimal.div(1, x)
	}
	return x.max(0).min(y) //it should never be a buff
}

function dilationPowerStrength() {
	let pow = 0.75
	if (inNGM(4)) pow = 0.7
	return pow;
}

/**
 *
 * @param {Name of the ugrade} id
 * @param {Cost of the upgrade} cost
 * @param {Cost increase for the upgrade, only for rebuyables} costInc
 *
 * id 1-3 are rebuyables
 *
 * id 2 resets your dilated time and free galaxies
 *
 */

const DIL_UPGS = []
const DIL_UPG_SIZES = [5, 7]
const DIL_UPG_COSTS = {
	r1: [1e5, 10, 1/0],
	r2: [1e6, 100, 1/0],
	r3: [1e7, 20, 72],
	r4: [1e8, 1e4, 24],
	r4_ngmm: [1e30, 1e4, 18],
	r5: [1e16, 10, 1/0],
	  4: 5e6,
	  5: 1e9,
	  6: 5e7,
	  7: 2e12,
	  8: 1e10,
	  9: 1e11,
	  10: 1e15,
	  ngud1: 1e20,
	  ngud2: 1e25,
	  ngpp1: 1e20,
	  ngpp2: 1e25,
	  ngpp3: 1e50,
	  ngpp4: 1e60,
	  ngpp5: 1e80,
	  ngpp6: 1e100,
	  ngpp3_usp: 1e79,
	  ngpp4_usp: 1e84,
	  ngpp5_usp: 1e89,
	  ngpp6_usp: 1e100,
	  ngmm1: 5e16,
	  ngmm2: 1e19,
	  ngmm3: 1e20,
	  ngmm4: 1e25,
	  ngmm5: 1/0,
	  ngmm6: 1/0,
	  ngmm7: 1/0,
	  ngmm8: 1/0,
	  ngmm9: 1/0,
	  ngmm10: 1/0,
	  ngmm11: 1/0,
	  ngmm12: 1/0,
	  ngusp1: 1e50,
	  ngusp2: 1e55,
	  ngusp3: 1e94
}

const DIL_UPG_OLD_POS_IDS = {
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
	12: "ngpp1",
	13: "ngpp2",
	14: "ngpp3",
	15: "ngpp4",
	16: "ngpp5",
	17: "ngpp6",
	18: "ngud1",
	19: "ngud2",
	20: "ngusp1",
	21: "ngusp2",
	22: "ngusp3"
}

const DIL_UPG_POS_IDS = {
	11: "r1",    12: "r2",    13: "r3",     15: "r5",     14: "r4",     
	21: 4,       22: 5,       23: 6,        25: "ngmm1",  24: "ngpp1",
	31: 7,       32: 8,       33: 9,        35: "ngmm2",  34: "ngpp2",
	51: "ngpp3", 52: "ngpp4", 53: "ngpp5",  55: "ngmm7",  54: "ngpp6",
	71: "ngmm8", 72: "ngmm9", 73: "ngmm10", 74: "ngmm11", 75: "ngmm12",
	41: 10,      42: "ngmm3", 43: "ngmm4",  44: "ngmm5",  45: "ngmm6",
	61: "ngud1", 62: "ngud2", 63: "ngusp1", 64: "ngusp2", 65: "ngusp3"
}

const DIL_UPG_ID_POS = {}
const DIL_UPG_UNLOCKED = {}

function setupDilationUpgradeList() {
	for (var x = 1; x <= DIL_UPG_SIZES[0]; x++) {
		for (var y = 1; y <= DIL_UPG_SIZES[1]; y++)	{
			let push = false
			let pos = y * 10 + x
			let id = DIL_UPG_POS_IDS[pos]
			if (id) push = true
			if (push) {
				DIL_UPGS.push(pos)
				DIL_UPG_ID_POS[id] = pos
			}
		}
	}
}

function getDilUpgId(x) {
	let r = DIL_UPG_POS_IDS[x]
	return r
}

function isDilUpgUnlocked(id) {
	id = toString(id)
	let ngpp = id.split("ngpp")[1]
	let ngmm = id.split("ngmm")[1]
	if (id == "r4") return mod.ngpp
	if (id == "r5") return inNGM(2)
	if (ngmm) {
		let r = inNGM(2)
		if (ngmm == 6) r = r && mod.ngpp
		if (ngmm >= 7) r = r && player.dilation.studies.includes(6)
		return r
	}
	if (ngpp) {
		ngpp = parseInt(ngpp)
		let r = mod.ngpp
		if (ngpp >= 3) r = r && player.dilation.studies.includes(6)
		return r
	}
	if (id.split("ngud")[1]) {
		let r = mod.ngud
		if (id == "ngud2") r = r && aarMod.nguspV === undefined
		return r
	}
	if (id.split("ngusp")[1]) {
		let r = aarMod.nguspV !== undefined
		if (id != "ngusp1") r = r && player.dilation.studies.includes(6)
		return r
	}
	return true
}

function getDilUpgCost(id) {
	id = toString(id)
	if (id[0] == "r") return getRebuyableDilUpgCost(id[1])
	let cost = DIL_UPG_COSTS[id]
	let ngpp = id.split("ngpp")[1]
	if (ngpp) {
		ngpp = parseInt(ngpp)
		if (ngpp >= 3 && aarMod.nguspV !== undefined) cost = DIL_UPG_COSTS[id + "_usp"]
	}
	return cost
}

function getRebuyableDilUpgCost(id) {
	var costGroup = DIL_UPG_COSTS["r"+id]
	if (id == 4 && inNGM(2)) costGroup = DIL_UPG_COSTS.r4_ngmm
	var amount = player.dilation.rebuyables[id] || 0
	let cost = E(costGroup[0]).times(E_pow(costGroup[1],amount))
	if (aarMod.nguspV) {
		if (id > 3) cost = cost.times(1e7)
		if (id > 2 && cost.gte(1e25)) cost = pow10(Math.pow(cost.log10() / 2.5 - 5, 2))
	} else if (id > 2) {
		if (mod.ngpp && amount >= costGroup[2]) return cost.times(E_pow(costGroup[1], (amount - costGroup[2] + 1) * (amount - costGroup[2] + 2)/4))
		if (mod.ngud && !mod.udp && cost.gt(1e30)) cost = cost.div(1e30).pow(cost.log(1e30)).times(1e30)
	}
	return cost
}

function buyDilationUpgrade(pos, max, isId) {
	let id = pos
	if (isId) pos = DIL_UPG_ID_POS[id]
	else id = getDilUpgId(id)
	let cost = getDilUpgCost(id)
	if (!player.dilation.dilatedTime.gte(cost)) return
	let rebuyable = toString(id)[0] == "r"
	if (rebuyable) {
		// Rebuyable
		if (cost.gt("1e100000")) return
		if (id[1] == 2 && !canBuyGalaxyThresholdUpg()) return

		player.dilation.dilatedTime = player.dilation.dilatedTime.sub(cost)
		player.dilation.rebuyables[id[1]] = (player.dilation.rebuyables[id[1]] || 0) + 1
		
		if (id[1] == 2) {
			if (speedrunMilestonesReached < 22) player.dilation.dilatedTime = E(0)
			resetDilationGalaxies()
		}
		if (id[1] >= 3) player.eternityBuyer.tpUpgraded = true
	} else {
		// Not rebuyable
		if (player.dilation.upgrades.includes(id)) return

		player.dilation.dilatedTime = player.dilation.dilatedTime.sub(cost)
		player.dilation.upgrades.push(id)
		if (aarMod.nguspV !== undefined && !player.dilation.autoUpgrades.includes(id)) player.dilation.autoUpgrades.push(id)
		if (id == 4 || id == "ngmm1") player.dilation.freeGalaxies *= 2 // Double the current galaxies
		if (id == 10 && mod.ngp3) quSave.wasted = false
		if (id == "ngpp3" && mod.ngp3) {
			updateMilestones()
			if (getEternitied() >= 1e9) player.dbPower = E(getDimensionBoostPower())
		}
		if (id == "ngpp6" && mod.ngp3) {
			el("masterystudyunlock").style.display=""
			el("respecMastery").style.display = "block"
			el("respecMastery2").style.display = "block"
			if (!quantumed) {
				ngp3_feature_notify("ms")
				$.notify("Congratulations for unlocking Mastery Studies! You can either click the 'mastery studies' button\nor 'continue to mastery studies' button in the Time Studies menu.")
				el("welcomeMessage").innerHTML = "Congratulations for reaching the end-game of NG++. In NG+3, the game keeps going with a lot of new content starting at Mastery Studies. You can either click the 'Mastery studies' tab button or 'Continue to mastery studies' button in the Time Studies menu to access the new Mastery Studies available."
				el("welcome").style.display = "flex"
			}
		}
	}
	if (max) return true
	if (rebuyable) updateDilationUpgradeCost(pos, id)
	updateDilationUpgradeButtons()
}

function getPassiveTTGen() {
	if (player.dilation.tachyonParticles.plus(player.dilation.bestTP).gt(pow10(3333))) return 1e202
	let r = getTTGenPart(player.dilation.tachyonParticles)
	if (hasAch("ng3p18") && !bigRipped()) r += getTTGenPart(player.dilation.bestTP) / 50
	r /= (hasAch("ng3p51") ? 200 : 2e4)
	if (isLEBoostUnlocked(6)) r *= tmp.leBonus[6]
	return r
}

function getTTGenPart(x) {
	if (!x) return E(0)
	if (NGP3andVanillaCheck()) {
		if (hasAch("r137") && player.dilation.active) x = x.times(2)
	}
	if (mod.ngp3) {
		x = x.max(1).log10()
		let y = mod.udp && !aarMod.nguepV ? 73 : 80
		if (x > y) x = Math.sqrt((x - y + 5) * 5) + y - 5
		x = Math.pow(10, x)
	}
	return x
}

function updateDilationUpgradeButtons() {
	for (var i = 0; i < DIL_UPGS.length; i++) {
		var pos = DIL_UPGS[i]
		var id = getDilUpgId(pos)
		var unl = isDilUpgUnlocked(id)
		if (DIL_UPG_UNLOCKED[id] != unl) {
			if (unl) {
				DIL_UPG_UNLOCKED[id] = 1
				updateDilationUpgradeCost(pos, id)
			} else delete DIL_UPG_UNLOCKED[id]
			el("dil" + pos).parentElement.style.display = unl ? "" : "none"
		}
		if (unl) el("dil" + pos).className = player.dilation.upgrades.includes(id) || (id == "r2" && !canBuyGalaxyThresholdUpg()) ? "dilationupgbought" : player.dilation.dilatedTime.gte(getDilUpgCost(id)) ? "dilationupg" : "dilationupglocked"
	}
	var genSpeed = getPassiveTTGen()
	var power = getDil3Power()
	el("dil13desc").textContent = power > 3 ? "Gain " + shorten(power) + "x more Tachyon Particles." : "Triple the amount of Tachyon Particles gained."
	el("dil31desc").textContent = "Currently: " + shortenMoney(player.dilation.dilatedTime.max(1).pow(1000).max(1)) + "x"
	el("dil41desc").textContent = "Currently: " + shortenMoney(hasAch("ng3p44") && player.timestudy.theorem / genSpeed < 3600 ? genSpeed * 10 : genSpeed)+"/s"
	if (player.dilation.studies.includes(6)) {
		el("dil51desc").textContent = "Currently: " + shortenMoney(getDil14Bonus()) + 'x';
		el("dil52desc").textContent = "Currently: " + shortenMoney(getDil15Bonus()) + 'x';
		el("dil54formula").textContent = "(log(x)^0.5" + (mod.ngp3 ? ")" : "/2)")
		el("dil54desc").textContent = "Currently: " + shortenMoney(getDil17Bonus()) + 'x';
	}
	if (mod.ngud) el("dil61desc").textContent = "Currently: "+shortenMoney(getD18Bonus())+"x"
	if (isDilUpgUnlocked("ngusp2")) {
		el("dil64desc").textContent = "Currently: +" + shortenMoney(getD21Bonus()) + " to exponent before softcap"
		el("dil65desc").textContent = "Currently: " + shortenMoney(getD22Bonus()) + "x"
	}
	if (inNGM(2)) {
		el("dil44desc").textContent = "Currently: +" + shortenMoney(getDil44Mult())
		el("dil45desc").textContent = "Currently: " + shortenMoney(getDil45Mult()) + "x"
		if (player.dilation.studies.includes(6)) {
			el("dil71desc").textContent = "Currently: ^" + shortenMoney(getDil71Mult())
			el("dil72desc").textContent = "Currently: " + shortenMoney(getDil72Mult()) + "x"
		}
	}
}

function updateDilationUpgradeCost(pos, id) {
	if (id == "r2" && !canBuyGalaxyThresholdUpg()) el("dil" + pos + "cost").textContent = "Maxed out"
	else {
		let r = getDilUpgCost(id)
		if (id == "r3") r = formatValue(player.options.notation, getRebuyableDilUpgCost(3), 1, 1)
		else r = shortenCosts(r)
		el("dil" + pos + "cost").textContent = "Cost: " + r + " dilated time"
	}
	if (id == "ngud1") el("dil61oom").textContent = shortenCosts(E("1e1000"))
}

function updateDilationUpgradeCosts() {
	for (var i = 0; i < DIL_UPGS.length; i++) {
		var pos = DIL_UPGS[i]
		var id = getDilUpgId(pos)
		if (DIL_UPG_UNLOCKED[id]) updateDilationUpgradeCost(pos, id)
	}
}

function getFreeGalaxyThresholdIncrease(){
	let thresholdMult = inQC(5) ? Math.pow(10, 2.8) : !canBuyGalaxyThresholdUpg() ? 1.35 : 1.35 + 3.65 * Math.pow(0.8, getDilUpgPower(2))
	if (hasBU(12)) thresholdMult -= tmp.blu[12]
	if (mod.ngud) thresholdMult -= Math.min(.1 * exDilationUpgradeStrength(2), 0.2)
	if (thresholdMult < 1.15 && aarMod.nguspV !== undefined) thresholdMult = 1.05 + 0.1 / (2.15 - thresholdMult)
	return thresholdMult
}

function gainDilationGalaxies() {
	let thresholdMult = getFreeGalaxyThresholdIncrease()
	let thresholdStart = getFreeGalaxyThresholdStart()
	let galaxyMult = getFreeGalaxyGainMult()
	let baseGain = Math.floor(player.dilation.dilatedTime.div(thresholdStart).log(thresholdMult) + 1)
	if (baseGain < 0) baseGain = 0
	let old = Math.round(player.dilation.freeGalaxies / galaxyMult)
	player.dilation.freeGalaxies = Math.max(baseGain, old) * galaxyMult
	player.dilation.nextThreshold = E_pow(thresholdMult, baseGain).times(getFreeGalaxyThresholdStart())
}

function getFreeGalaxyGainMult() {
	let galaxyMult = player.dilation.upgrades.includes(4) ? 2 : 1
	if (player.dilation.upgrades.includes("ngmm1")) galaxyMult *= 2
	if (mod.udp && !aarMod.nguepV) galaxyMult /= 1.5
	galaxyMult *= tmp.qcRewards[2]
	if (isNanoEffectUsed("dil_gal_gain")) galaxyMult *= tmp.nf.effects.dil_gal_gain
	return galaxyMult
}

function getFreeGalaxyThresholdStart(){
	return E(1000)
}

function resetDilationGalaxies() {
	player.dilation.nextThreshold = getFreeGalaxyThresholdStart()
	player.dilation.freeGalaxies = 0
	gainDilationGalaxies()
}

function startDilatedEternity(auto) {
	if (!player.dilation.studies.includes(1)) return

	var onActive = !player.dilation.active
	if (!auto && onActive && aarMod.dilationConf && !confirm("Dilating time will start a new Eternity where all of your Normal/Infinity/Time Dimension multiplier's exponents and the Tickspeed multiplier's exponent will be reduced to ^0.75. If you can Eternity while dilated, you'll be rewarded with tachyon particles based on your antimatter and tachyon particles.")) return

	eternity(onActive || !canEternity(), auto, onActive)
}

function updateDilationDisplay() {
	if (el("dilation").style.display == "block" && el("eternitystore").style.display == "block") {
		el("tachyonParticleAmount").textContent = shortenMoney(player.dilation.tachyonParticles)
		el("dilatedTimeAmount").textContent = shortenMoney(player.dilation.dilatedTime)
		el("dilatedTimePerSecond").textContent = "+" + shortenMoney(getDilTimeGainPerSecond()) + "/s"
		el("galaxyThreshold").textContent = shortenMoney(player.dilation.nextThreshold)
		el("dilatedGalaxies").textContent = getFullExpansion(Math.floor(player.dilation.freeGalaxies))
	}
}
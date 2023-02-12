let tmp = {
	nrm: E(1),
	rm: E(1),
	extraRG: 0,
	it: E(1),
	inQCs: [0],
	bru: {},
	be: false,
	beu: {},
	nu: {},
	nuc: [null,1e6,1e7,1e8,2e8,5e8,2e9,5e9,75e8,1e10,7e12,1e18,1e45,1/0,1/0,1/0],
}

function updateTemp() {
	if (typeof player != "undefined") {
		if (player.money) tmp.ri = player.money.gte(Number.MAX_VALUE) && ((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) || !onPostBreak())
		else tmp.ri = false
	} else {
		tmp.ri = false
		return
	}

	tmp.nrm = 1
	if (player.timestudy.studies.includes(101)) tmp.nrm = player.replicanti.amount.max(1)
	tmp.sacPow = calcTotalSacrificeBoost()

	updateNGP3Temp()

	if (mod.ngpp) tmp.mdgm = getMetaDimensionGlobalMultiplier() //Update global multiplier of all Meta Dimensions
	tmp.mptb = getMPTBase()
	tmp.mpte = getMPTExp()

	updateInfiniteTimeTemp()
	if (hasBU(41)) {
		tmp.blu[41] = bu.effects[41]()
		tmp.it = tmp.it.mul(tmp.blu[41].it)
		tmp.ig = tmp.ig.mul(tmp.blu[41].ig)
	}

	tmp.rm = getReplMult()
	updateInfinityPowerEffects()
	updateExtraReplGalaxies()
	
	updateTS232Temp()
	updateMatterSpeed()

	tmp.tsReduce = getTickSpeedMultiplier()
	updateInfinityPowerEffects()
	if (player.replicanti.unl) updateReplicantiTemp()

	updatePowers()
}

function updateInfiniteTimeTemp() {
	var x = (3 - getTickspeed().log10()) * 0.000005
	if (mod.ngp3) {
		if (hasAch("ng3p56")) x *= 1.03
		if (hasNB(4)) x *= tmp.nb[4]
		if (tmp.be && !player.dilation.active && beSave.upgrades.includes(8)) x *= getBreakUpgMult(8)
		x = softcap(x, "inf_time_log_1")
	}
	tmp.it = pow10(x)
}

function updateIntergalacticTemp() {
	if (!hasAch("ng3p27")) return

	x = player.galaxies
	if (tmp.be && player.dilation.active && beSave.upgrades.includes(10)) x *= getBreakUpgMult(10)
	tmp.igg = x

	var igLog = Math.pow(x, Math.min(Math.sqrt(Math.log10(Math.max(x, 1))) * 2, PHOTON.eff(5, 2.5))) //Log10 of reward
	tmp.ig = pow10(igLog)
}

function updateTS232Temp() {
	var exp = 0.2
	if (mod.ngp3 && player.galaxies >= 1e4 && !tmp.be) exp *= Math.max(6 - player.galaxies / 2e3, 0)
	tmp.ts232 = Math.pow(1 + initialGalaxies() / 1000, exp)
}

function updateMatterSpeed() {
	//mv: Matter speed
	tmp.mv = 1.03 + player.resets/200 + player.galaxies/100
}

function updateReplicantiTemp() {
	var data = {}
	tmp.rep = data

	data.ln = player.replicanti.amount.ln()
	data.chance = player.replicanti.chance
	data.speeds = getReplSpeed()
	data.interval = getReplicantiFinalInterval()

	if (hasMasteryStudy("t273")) {
		data.chance = E_pow(data.chance, tmp.mts[273])
		data.freq = 0
		if (data.chance.gte("1e9999998")) data.freq = tmp.mts[273].mul(Math.log10(player.replicanti.chance + 1) / Math.log10(2))
	}

	data.est = Decimal.div((data.freq ? data.freq.mul(Math.log10(2) / Math.log10(Math.E) * 1e3) : Decimal.add(data.chance, 1).log(Math.E) * 1e3), data.interval)
	data.estLog = data.est.mul(Math.log10(Math.E))
}

function updateBRU1Temp() {
	tmp.bru[1] = 1
	if (!bigRipped()) return
	let exp = 1
	if (hasRipUpg(17)) exp = tmp.bru[17]
	if (hasNB(7)) exp *= tmp.nb[7]
	exp *= player.infinityPoints.max(1).log10()
	tmp.bru[1] = pow10(exp) // BRU1
}

function updateBRU8Temp() {
	tmp.bru[8] = 1
	if (!bigRipped()) return
	tmp.bru[8] = pow2(getTotalRG()) // BRU8
	if (!hasNU(11)) tmp.bru[8] = tmp.bru[8].min(Number.MAX_VALUE)
}

function updateBRU14Temp() {
	if (!bigRipped()) {
		tmp.bru[14] = 1
		return
	}
	var ret = Math.min(brSave.spaceShards.div(3e18).add(1).log10()/3,0.4)
	var val = Math.sqrt(brSave.spaceShards.div(3e15).add(1).log10()*ret+1)
	if (val > 12) val = 10 + Math.log10(4 + 8 * val)
	tmp.bru[14] = val //BRU14
}

function updateBRU15Temp() {
	let r = Math.sqrt(player.eternityPoints.add(1).log10()) * 3.55
	if (r > 1e4) r = Math.sqrt(r * 1e4)
	tmp.bru[15] = r
}

function updateBRU16Temp() {
	tmp.bru[16] = player.dilation.dilatedTime.div(1e100).pow(0.155).max(1)
}

function updateBRU17Temp() {
	tmp.bru[17] = ghostified ? 3 : 2.9
}

function updateBigRipUpgradesTemp(){
	updateBRU17Temp()
	updateBRU1Temp()
	updateBRU8Temp()
	updateBRU14Temp()
	updateBRU15Temp()
	updateBRU16Temp()
}

//Vanilla
var totalMult = 1
var currentMult = 1
var infinitiedMult = 1
var achievementMult = 1
var unspentBonus = 1
var mult18 = E(1)
var ec10bonus = E(1)

function getAchievementMult(){
	var ach = player.achievements.length
	var gups = inNGM(2) ? player.galacticSacrifice.upgrades.length : 0
	var minus = inNGM(2) ? 10 : 30
	var exp = inNGM(2) ? 5 : 3
	var div = 40
	if (inNGM(4)) {
		minus = 0
		exp = 10
		div = 20 - Math.sqrt(gups)
		if (gups > 15) exp += gups
	}
	return Math.max(Math.pow(ach - minus - getSecretAchAmount(), exp) / div, 1)
}

function getUnspentBonus() {
	x = player.infinityPoints
	if (!x) return E(1)
	if (inNGM(2)) return x.pow(Math.max(Math.min(Math.pow(x.max(1).log(10), 1 / 3) * 3, 8), 1)).plus(1);
	else return x.dividedBy(2).pow(1.5).plus(1)
}

function updatePowers() {
	var expMult = inNGM(2) ? 2 : 0.5
	if (inNGM(4)) expMult += player.money.plus(10).div(10).log10() / 1e4

	totalMult = E_pow(player.totalmoney.plus(10).log10(), expMult)
	currentMult = E_pow(player.money.plus(10).log10(), expMult)
	infinitiedMult = getInfinitiedMult()
	achievementMult = getAchievementMult()
	unspentBonus = getUnspentBonus()

	if (mod.rs) mult18 = getDimensionFinalMultiplier(1).max(1).mul(getDimensionFinalMultiplier(8).max(1)).pow(0.02)
	else mult18 = getDimensionFinalMultiplier(1).mul(getDimensionFinalMultiplier(8)).pow(0.02)
	if (isNaN(mult18.e)) mult18 = E(1)

	if (player.currentEternityChall == "eterc10" || inQC(6)) {
		ec10bonus = E_pow(getInfinitied(), 1e3).max(1)
		if (player.timestudy.studies.includes(31)) ec10bonus = ec10bonus.pow(4)
	} else {
		ec10bonus = E(1)
	}
}
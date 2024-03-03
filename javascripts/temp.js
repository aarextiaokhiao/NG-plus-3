let tmp = {
	qu: {
		chal: { in: [0], reward: {} },
		bru: {},
		beu: {},
	},
	tab: { in: [], open: {} }
}

function updateTemp() {
	tmp.mod = mod

	if (typeof player != "undefined") {
		if (player.money) tmp.ri = player.money.gte(Number.MAX_VALUE) && ((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) || !onPostBreak())
		else tmp.ri = false
	} else {
		tmp.ri = false
		return
	}

	tmp.sacPow = calcTotalSacrificeBoost()
	updateNGP3Temp()
	BH_UDSP.temp()

	if (mod.ngpp) tmp.mdgm = getMetaDimensionGlobalMultiplier() //Update global multiplier of all Meta Dimensions
	tmp.mptb = getMPTBase()
	tmp.mpte = getMPTExp()

	updateInfiniteTimeTemp()
	updateMatterSpeed()

	tmp.gal.init = initialGalaxies()
	tmp.gal.str = getGalaxyEff(true)
	tmp.gal.ts = getTickSpeedMultiplier()

	updatePowers()
	updateInfinityPowerEffects()
	if (player.replicanti.unl) updateReplicantiTemp()
	updateExtraReplGalaxies()
}

function updateInfiniteTimeTemp() {
	var x = (3 - getTickspeed().log10()) * 0.000005
	if (mod.ngp3) {
		if (hasAch("ng3p56")) x *= 1.03
		if (hasNB(4)) x *= NT.eff("boost", 4)[0]
		x = softcap(x, "inf_time_log")
	}
	tmp.inf_time = pow10(x)
}

function updateIntergalacticTemp() {
	if (!hasAch("ng3p27")) return

	var gal = player.galaxies
	if (!bigRipped()) {
		if (hasBLMilestone(5)) gal += blEff(5, 0)
		if (hasBLMilestone(6)) gal *= blEff(6)
	}

	var exp = Math.min(Math.sqrt(Math.log10(Math.max(gal, 1))) * 2, 2.5)
	tmp.qu.intergal = {
		gal: gal,
		eff: pow10(Math.pow(gal, exp))
	}
}

function updateMatterSpeed() {
	//mv: Matter speed
	tmp.matter_rate = 1.03 + player.resets/200 + player.galaxies/100
}

function updateReplicantiTemp() {
	var data = {}
	tmp.rep = data

	data.ln = player.replicanti.amount.ln()
	data.chance = player.replicanti.chance
	if (hasMasteryStudy("t273") && !dev.testZone) {
		let ms273 = getMTSMult(273)
		data.chance = E_pow(data.chance, ms273)
		if (data.chance.gte("1e9999998")) data.freq = ms273.mul(Math.log10(player.replicanti.chance + 1) / Math.log10(2))
	}

	data.dupRate = (data.freq ? data.freq.mul(Math.log10(2) / Math.log10(Math.E)) : Decimal.add(data.chance, 1).log(Math.E))
	data.interval = getReplicantiInterval()
	data.speeds = getReplSpeed()

	data.est = E(1e3).div(getReplicantiFinalInterval())
	data.estLog = data.est.mul(Math.log10(Math.E))

	data.eff = getReplMult()
	data.nd = E(1)
	if (hasTimeStudy(101)) data.nd = player.replicanti.amount.max(1)
	if (bigRipped() && !player.dilation.active && hasRipUpg(14)) data.nd = data.nd.pow(tmp.qu.bru[14])

	data.gal_str = getReplGalEff()
	updateExtraReplGalaxies()
}

//Vanilla
var totalMult = 1
var currentMult = 1
var infinitiedMult = 1
var achievementMult = 1
var unspentBonus = 1
var mult18 = E(1)
var ec10bonus = E(1)

function getAchievementMult() {
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
	if (inNGM(2)) return x.pow(Math.max(Math.min(Math.pow(x.max(1).log(10), 1 / 3) * 3, 8), 1)).add(1);
	else return x.dividedBy(2).pow(1.5).add(1)
}

function resetPowers() {
	mult18 = E(1)
	tmp.sacPow = E(1)
	tmp.gal = { str: 1 }
	tmp.rep = { extra: 0, eff: E(1), gal_str: 1 }
	tmp.mts = {}
	tmp.qu.color_eff = { r: 1, g: 1, b: 1 }
	tmp.qu.chal.reward = {}
	tmp.qu.ant = {}
	tmp.progress = { reached: 0, max: NGP3_FEATURE_LEN - 1 }
	delete tmp.qu.intergal
	setupNanoRewardTemp()

	tmp.funda = {}
	updateInQCs()
	updateTemp()
}

function updatePowers() {
	var expMult = inNGM(2) ? 2 : 0.5
	if (inNGM(4)) expMult += player.money.add(10).div(10).log10() / 1e4

	totalMult = E_pow(player.totalmoney.add(10).log10(), expMult)
	currentMult = E_pow(player.money.add(10).log10(), expMult)
	infinitiedMult = getInfinitiedMult()
	achievementMult = getAchievementMult()
	unspentBonus = getUnspentBonus()

	if (mod.rs) mult18 = getDimensionFinalMultiplier(1).max(1).mul(getDimensionFinalMultiplier(8).max(1)).pow(0.02)
	else mult18 = getDimensionFinalMultiplier(1).mul(getDimensionFinalMultiplier(8)).pow(0.02)
	if (isNaN(mult18.e)) mult18 = E(1)

	if (player.currentEternityChall == "eterc10" || inQC(6)) {
		ec10bonus = E_pow(getInfinitied(), 1e3).max(1)
		if (hasTimeStudy(31)) ec10bonus = ec10bonus.pow(4)
	} else {
		ec10bonus = E(1)
	}
}
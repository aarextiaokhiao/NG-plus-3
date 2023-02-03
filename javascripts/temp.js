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
	tmp.rg4 = false
	if (mod.ngp3) {
		updateGhostifyTempStuff()
		if (beSave && beSave.unlocked) updateBreakEternityUpgradesTemp()

		if (hasMasteryStudy("d14")) updateBigRipUpgradesTemp()
		if (tmp.nrm !== 1 && bigRipped()) {
			if (!player.dilation.active && hasRipUpg(14)) tmp.nrm = tmp.nrm.pow(tmp.bru[14])
			if (tmp.nrm.log10() > 1e9) tmp.nrm = pow10(1e9 * Math.pow(tmp.nrm.log10() / 1e9, 2/3))
		}
		tmp.be = brokeEternity()

		if (hasMasteryStudy("d13")) {
			tmp.branchSpeed = getBranchSpeed()
			tmp.tue = getTreeUpgradeEfficiency()
		}

		if (hasMasteryStudy("d12")) updateNanofieldTemp()
		if (hasMasteryStudy("d11")) tmp.edgm = getEmperorDimensionGlobalMultiplier() //Update global multiplier of all Emperor Dimensions
		if (hasMasteryStudy("d10")) {
			tmp.twr = getTotalWorkers()
			tmp.tra = getTotalReplicants()
		}
		tmp.rg4 = quSave.upgrades.includes("rg4")

		updateMasteryStudyTemp()
		updateIntergalacticTemp() // starts with if (mod.ngp3)
	} else tmp.be = false
	tmp.sacPow = calcTotalSacrificeBoost()
	updateQCRewardsTemp()

	if (mod.ngpp) tmp.mdgm = getMetaDimensionGlobalMultiplier() //Update global multiplier of all Meta Dimensions
	tmp.mptb = getMPTBase()
	tmp.mpte = getMPTExp()
	updatePostInfiTemp()
	updateInfiniteTimeTemp()
	if (hasBU(41)) {
		tmp.blu[41] = bu.effects[41]()
		tmp.it = tmp.it.mul(tmp.blu[41].it)
		tmp.ig = tmp.ig.mul(tmp.blu[41].ig)
	}

	tmp.rm = getReplMult()
	updateExtraReplGalaxies()
	
	updateTS232Temp()
	updateMatterSpeed()

	tmp.tsReduce = getTickSpeedMultiplier()
	updateInfinityPowerEffects()
	if (player.replicanti.unl) updateReplicantiTemp()
}

let tmp = {
	nrm: E(1),
	rm: E(1),
	it: 1,
	rg4: false,
	inQCs: [0],
	pct: "",
	ns: 1,
	bru: {},
	be: false,
	beu: {},
	bm: [200,175,150,100,50,40,30,25,20,15,10,5,4,3,2,1],
	nbc: [1,2,4,6,15,50,1e3,1e14,1e35,1/0,1/0,1/0],
	nu: {},
	nuc: [null,1e6,1e7,1e8,2e8,5e8,2e9,5e9,75e8,1e10,7e12,1e18,1e45,1/0,1/0,1/0],
	nanofield_free_rewards: 0
}

function updateInfiniteTimeTemp() {
	var x = (3 - getTickspeed().log10()) * 0.000005
	if (mod.ngp3) {
		if (hasAch("ng3p56")) x *= 1.03
		if (ghostified && ghSave.neutrinos.boosts>3) x *= tmp.nb[4]
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
	tmp.igs = 0 //Intergalactic Scaling ; used in the display text

	var igLog = Math.pow(x, Math.min(Math.sqrt(Math.log10(Math.max(x,1))) * 2, 2.5)) //Log10 of reward
	if (igLog > 1e15) { //Further
		igLog = Math.pow(igLog * 1e9, 5 / 8)
		tmp.igs = 1
	}

	tmp.ig = pow10(igLog)
}

function updateTS232Temp() {
	var exp = 0.2
	if (mod.ngp3 && player.galaxies >= 1e4 && !tmp.be) exp *= Math.max(6 - player.galaxies / 2e3,0)
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

function updatePostInfiTemp() {
	var exp11 = inNGM(2) ? 2 : 0.5
	var exp21 = inNGM(2) ? 2 : 0.5
	if (inNGM(4)){
		exp11 += player.totalmoney.plus(10).div(10).log10() / 1e4
		exp21 += player.money.plus(10).div(10).log10() / 1e4
	}
	tmp.postinfi11 = E_pow(player.totalmoney.plus(10).log10(), exp11)
	tmp.postinfi21 = E_pow(player.money.plus(10).log10(), exp21)
}

function updateGhostifyTempStuff(){
	updateBosonicLabTemp()
	if (PHOTON.unlocked()) {
		PHOTON.updateTemp()
		updatePhotonsUnlockedBRUpgrades()
	}
	if (ghostified) {
		updateNeutrinoUpgradesTemp()
		updateNeutrinoBoostsTemp()
	}
}

function updateBreakEternityUpgrade1Temp(){
	var ep = player.eternityPoints
	var em = beSave.eternalMatter
	var log1 = ep.div("1e1280").add(1).log10()
	var log2 = em.mul(10).max(1).log10()
	tmp.beu[1] = pow10(Math.pow(log1, 1/3) * 0.5 + Math.pow(log2, 1/3)).max(1)
}

function updateBreakEternityUpgrade2Temp(){
	var ep = player.eternityPoints
	var log = ep.div("1e1290").add(1).log10()
	tmp.beu[2] = Math.pow(Math.log10(log + 1) * 1.6 + 1, player.currentEternityChall == "eterc10" ? 1 : 2)
}

function updateBreakEternityUpgrade3Temp(){
	var ep = player.eternityPoints
	var nerfUpgs = !tmp.be && hasBU(24)
	var log = ep.div("1e1370").add(1).log10()
	if (nerfUpgs) log /= 2e6
	var exp = Math.pow(log, 1/3) * 0.5
	tmp.beu[3] = pow10(exp)
}

function updateBreakEternityUpgrade4Temp(){
	var ep = player.eternityPoints
	var ss = brSave && brSave.spaceShards
	var log1 = ep.div("1e1860").add(1).log10()
	var log2 = ss.div("7e19").add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3) * 8
	tmp.beu[4] = pow10(exp)
}

function updateBreakEternityUpgrade5Temp(){
	var ep = player.eternityPoints
	var ts = player.timeShards
	var log1 = ep.div("1e2230").add(1).log10()
	var log2 = ts.div(1e90).add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3)
	if (mod.udp && exp > 100) exp = Math.log10(exp) * 50
	exp *= 4
	tmp.beu[5] = pow10(exp)
}

function updateBreakEternityUpgrade6Temp(){
	var ep = player.eternityPoints
	var em = beSave.eternalMatter
	var nerfUpgs = !tmp.be && hasBU(24)
	var log1 = ep.div("1e4900").add(1).log10()
	var log2 = em.div(1e45).add(1).log10()
	if (nerfUpgs) log1 /= 2e6
	var exp = Math.pow(log1, 1/3) / 1.7 + Math.pow(log2, 1/3) * 2
	tmp.beu[6] = pow10(exp)
}

function updateBreakEternityUpgrade8Temp(){
	var x = Math.log10(player.dilation.tachyonParticles.div(1e200).add(1).log10() / 100 + 1) * 3 + 1
	if (mod.udp && x > 2.2) x = 1.2 + Math.log10(x + 7.8)
	tmp.beu[8] = x
}

function updateBreakEternityUpgrade9Temp(){
	var em = beSave.eternalMatter
	var x = em.div("1e335").add(1).pow(0.05 * Math.log10(4))
	tmp.beu[9] = x.toNumber()
}

function updateBreakEternityUpgrade10Temp(){
	var ep = player.eternityPoints
	tmp.beu[10] = Math.max(Math.log10(ep.add(1).log10() + 1) - 1, 1)
}

function updateBreakEternityUpgradesTemp() {
	//Setup
	var ep = player.eternityPoints
	var ts = player.timeShards
	var ss = brSave && brSave.spaceShards
	var em = beSave.eternalMatter
	var nerfUpgs = !tmp.be && hasBU(24)

	updateBreakEternityUpgrade1Temp()
	updateBreakEternityUpgrade2Temp()
	updateBreakEternityUpgrade3Temp()
	updateBreakEternityUpgrade4Temp()
	updateBreakEternityUpgrade5Temp()
	updateBreakEternityUpgrade6Temp()

	//Upgrade 7: EP Mult
	tmp.beu[7] = E_pow(1e9, beSave.epMultPower)

	if (PHOTON.unlocked()) {
		updateBreakEternityUpgrade8Temp()
		updateBreakEternityUpgrade9Temp()
		updateBreakEternityUpgrade10Temp()
	}
}

function updateBRU1Temp() {
	tmp.bru[1] = 1
	if (!bigRipped()) return
	let exp = 1
	if (hasRipUpg(17)) exp = tmp.bru[17]
	if (ghostified && ghSave.neutrinos.boosts > 7) exp *= tmp.nb[8]
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

function updatePhotonsUnlockedBRUpgrades(){
	var bigRipUpg18base = 1 + brSave.spaceShards.div(1e140).add(1).log10()
	var bigRipUpg18exp = Math.max(brSave.spaceShards.div(1e140).add(1).log10() / 10, 1)
	if (bigRipUpg18base > 10 && mod.p3ep) bigRipUpg18base *= Math.log10(bigRipUpg18base)
	tmp.bru[18] = E_pow(bigRipUpg18base, bigRipUpg18exp) // BRU18
	
	var bigRipUpg19exp = Math.sqrt(player.timeShards.add(1).log10()) / (mod.p3ep ? 60 : 80)
	tmp.bru[19] = pow10(bigRipUpg19exp) // BRU19
}

function updateNanoEffectUsages() {
	var data = []
	tmp.nf.rewardsUsed = data
	nanoRewards.effectToReward = {}

	//First reward
	var data2 = [hasNU(15) ? "photons" : "hatch_speed"]
	nanoRewards.effectsUsed[1] = data2

	//Fifth reward
	var data2 = ["dil_effect_exp", "light_threshold_speed"]
	nanoRewards.effectsUsed[5] = data2

	//Seventh reward
	var data2 = ["remote_start", "preon_charge"]
	if (hasNU(6)) data2 = ["preon_charge"]
	nanoRewards.effectsUsed[7] = data2

	//Used Nanorewards
	for (var x = 1; x <= 8; x++) {
		var rewards = nanoRewards.effectsUsed[x]
		for (var r = 0; r < rewards.length; r++) {
			data.push(rewards[r])
			nanoRewards.effectToReward[rewards[r]] = x
		}
	}
}

function updateNanoRewardPowers() {
	var data = {}
	tmp.nf.powers = data

	for (var x = 1; x <= 8; x++) data[x] = getNanoRewardPower(x, tmp.nf.rewards)
}

function updateNanoRewardEffects() {
	var data = {}
	tmp.nf.effects = data

	for (var e = 0; e < tmp.nf.rewardsUsed.length; e++) {
		var effect = tmp.nf.rewardsUsed[e]
		tmp.nf.effects[effect] = nanoRewards.effects[effect](tmp.nf.powers[nanoRewards.effectToReward[effect]])
	}
}

function updateNanoRewardTemp() {
	tmp.nf = {}

	if (!mod.ngp3) return
	if (!hasMasteryStudy("d11")) return

	updateNanoEffectUsages()
	//The rest is calculated by updateTemp().
}


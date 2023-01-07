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
	if (tmp.ngp3) {
		updatePostNGp3TempStuff()
		updateGhostifyTempStuff()
		if (beSave && beSave.unlocked) updateBreakEternityUpgradesTemp()
		if (player.masterystudies.includes("d14")) updateBigRipUpgradesTemp()
		if (tmp.nrm !== 1 && brSave.active) {
			if (!player.dilation.active && hasRipUpg(14)) tmp.nrm = tmp.nrm.pow(tmp.bru[14])
			if (tmp.nrm.log10() > 1e9) tmp.nrm = pow10(1e9 * Math.pow(tmp.nrm.log10() / 1e9, 2/3))
		}
		if (player.masterystudies.includes("d13")) updateTS431ExtraGalTemp()
		if (player.masterystudies.includes("d9")) {
			tmp.twr = getTotalWorkers()
			tmp.tra = getTotalReplicants()
		}
		updateMasteryStudyTemp()
		if (player.masterystudies.includes("d13")) tmp.branchSpeed = getBranchSpeed()
		if (NF.unl() && tmp.nf !== undefined && tmp.nf.rewardsUsed !== undefined) {
			var x = getNanoRewardPowerEff()
			var y = nfSave.rewards+tmp.nanofield_free_rewards
			tmp.ns = getNanofieldSpeed()
			if (tmp.nf.powerEff !== x || tmp.nf.rewards !== y) {
				tmp.nf.powerEff = x
				tmp.nf.rewards = y

				updateNanoRewardPowers()
				updateNanoRewardEffects()
			}
		}
		if (player.masterystudies.includes("d10")) tmp.edgm = getEmperorDimensionGlobalMultiplier() //Update global multiplier of all Emperor Dimensions
		tmp.be = brSave && brSave.active && beSave.break
		tmp.rg4 = quSave.upgrades.includes("rg4")
		tmp.tue = getTreeUpgradeEfficiency()
	} else tmp.be = false
	tmp.sacPow = calcTotalSacrificeBoost()
	updateQCRewardsTemp()

	if (player.meta !== undefined) tmp.mdgm = getMetaDimensionGlobalMultiplier() //Update global multiplier of all Meta Dimensions
	tmp.mptb = getMPTBase()
	tmp.mpte = getMPTExp()
	updatePostInfiTemp()
	updateInfiniteTimeTemp()
	updateAntiElectronGalaxiesTemp()
	updateIntergalacticTemp() // starts with if (tmp.ngp3)
	if (hasBU(41)) {
		tmp.blu[41] = bu.effects[41]()
		tmp.it = tmp.it.times(tmp.blu[41].it)
		tmp.ig = tmp.ig.times(tmp.blu[41].ig)
	}

	tmp.rm = getReplMult()
	updateExtraReplGalaxies()
	
	updateTS232Temp()
	updateMatterSpeed()

	tmp.tsReduce = getTickSpeedMultiplier()
	updateInfinityPowerEffects()
	if (player.replicanti.unl) updateReplicantiTemp()

	if (tmp.gameSpeed != gameSpeed) {
		tmp.gameSpeed = gameSpeed
		tmp.tickUpdate = true
	}
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
	nbc: [1,2,4,6,15,50,1e3,1e14,1e35,"1e500","1e2500","1e20000"],
	nu: [],
	nuc: [null,1e6,1e7,1e8,2e8,5e8,2e9,5e9,75e8,1e10,7e12,1e18,1e45,1e100,1e80,1e280,"e10000","e13000"],
	lt: [100,3e3,2e4,1e5,1e6,1e7,1e8,1e9],
	lti: [2,3,1.3,10,4,1e3,2.5,3],
	effL: [0,0,0,0,0,0,0],
	ls: [0,0,0,0,0,0,0],
	le: [0,0,0,0,0,0,0],
	leBonus: {},
	nanofield_free_rewards: 0,
	free_lights: 0,

	gravitons: {
		upg_eff: [],
	},
	bd: {
		unls: 0,
		upg_eff: [],
	},
}

function updateInfiniteTimeTemp() {
	var x = (3 - getTickspeed().log10()) * 0.000005
	if (tmp.ngp3) {
		if (hasAch("ng3p56")) x *= 1.03
		if (ghostified && ghSave.neutrinos.boosts>3) x *= tmp.nb[4]
		if (tmp.be && !player.dilation.active && beSave.upgrades.includes(8)) x *= getBreakUpgMult(8)
		if (isLEBoostUnlocked(8)) x *= tmp.leBonus[8]
		x = softcap(x, "inf_time_log_1")
	}
	tmp.it = pow10(x)
}

function updateIntergalacticTemp() {
	if (!tmp.ngp3) return
	x = player.galaxies
	if (isLEBoostUnlocked(3) && !brSave.active) x *= tmp.leBonus[3]
	if (tmp.be && player.dilation.active && beSave.upgrades.includes(10)) x *= getBreakUpgMult(10)
	if (!tmp.ngp3l) x += tmp.effAeg
	tmp.igg = x
	tmp.igs = 0 //Intergalactic Scaling ; used in the display text

	var igLog = Math.pow(x, Math.min(Math.sqrt(Math.log10(Math.max(x,1))) * 2, 2.5)) //Log10 of reward
	if (igLog > 1e15) { //Further
		igLog = Math.pow(igLog * 1e9, 5 / 8)
		tmp.igs = 1
	}

	tmp.ig = pow10(igLog)
}

function updateAntiElectronGalaxiesTemp(){
	tmp.aeg = 0
	if (hasBU(14) && !brSave.active) tmp.aeg = Math.max(tmp.blu[14] - quSave.electrons.sacGals, 0)
	tmp.effAeg = tmp.aeg
}

function updateTS232Temp() {
	var exp = 0.2
	if (tmp.ngp3 && player.galaxies >= 1e4 && !tmp.be) exp *= Math.max(6 - player.galaxies / 2e3,0)
	tmp.ts232 = Math.pow(1 + initialGalaxies() / 1000, exp)
}

function updateTS431ExtraGalTemp() {
	tmp.eg431 = tmp.effAeg * (tmp.ngp3l ? 0.1 : 5)
	if (isLEBoostUnlocked(1)) {
		tmp.leBonus[1].total = (colorBoosts.g + tmp.pe - 1) * tmp.leBonus[1].effect
		tmp.eg431 += tmp.leBonus[1].total
	}
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

	if (tmp.ngp3 && player.masterystudies.includes("t273")) {
		data.chance = E_pow(data.chance, tmp.mts[273])
		data.freq = 0
		if (data.chance.gte("1e9999998")) data.freq = tmp.mts[273].times(Math.log10(player.replicanti.chance + 1) / Math.log10(2))
	}

	data.est = Decimal.div((data.freq ? data.freq.times(Math.log10(2) / Math.log10(Math.E) * 1e3) : Decimal.add(data.chance, 1).log(Math.E) * 1e3), data.interval)
	data.estLog = data.est.times(Math.log10(Math.E))
}

function updatePostInfiTemp() {
	var exp11 = player.galacticSacrifice ? 2 : 0.5
	var exp21 = player.galacticSacrifice ? 2 : 0.5
	if (aarMod.ngmX >= 4){
		exp11 += player.totalmoney.plus(10).div(10).log10() / 1e4
		exp21 += player.money.plus(10).div(10).log10() / 1e4
	}
	tmp.postinfi11 = Math.pow(player.totalmoney.plus(10).log10(), exp11)
	tmp.postinfi21 = Math.pow(player.money.plus(10).log10(), exp21)
}

function updatePPTITemp(){
	if (!ghSave.ghostlyPhotons.unl) {
		tmp.ppti = 1
		return
	}
	let x = 1
	x /= tmp.le[1] || 1
	if (hasAch("ng3p113")) x /= 2
	tmp.ppti = x
}

function updateGhostifyTempStuff(){
	updateBosonicLabTemp()
	updatePPTITemp() //pilon power threshold increase
	if (ghSave.ghostlyPhotons.unl) {
		var x = getLightEmpowermentBoost()
		var y = hasBU(32)
		tmp.free_lights = 0
		if (tmp.leBoost !== x || tmp.hasBU32 !== y || tmp.updateLights) {
			tmp.leBoost = x
			tmp.hasBU32 = y
			tmp.updateLights = false
			updateFixedLightTemp()
		}
		updateIndigoLightBoostTemp()
		updateVioletLightBoostTemp()
		updatePhotonsUnlockedBRUpgrades()
		updateNU14Temp()
		updateNU15Temp()
	}
	if (ghostified) {
		updateNeutrinoUpgradesTemp()
		updateNeutrinoBoostsTemp()
	}
}

function updateNeutrinoBoostsTemp() {
	tmp.nb = {}

	if (!tmp.ngp3) return
	if (!ghostified) return

	var nt = []
	for (var g = 0; g < 3; g++) nt[g] = ghSave.neutrinos[(["electron","mu","tau"])[g]]
	for (var nb = 1; nb <= ghSave.neutrinos.boosts; nb++) tmp.nb[nb] = neutrinoBoosts.boosts[nb](nt)
}

function updateNU1Temp(){
	let x = 110
	if (!brSave.active) x = Math.max(x - player.meta.resets, 0)
	tmp.nu[0] = x
}

function updateNU3Temp(){
	let log = quSave.colorPowers.b.log10()
	let exp = Math.max(log / 1e4 + 1, 2)
	let x
	if (exp > 2) x = E_pow(Math.max(log / 250 + 1, 1), exp)
	else x = Math.pow(Math.max(log / 250 + 1, 1), exp)
	tmp.nu[1] = x
}

function updateNU4Temp(){
	let nu4base = 50
	if (tmp.ngp3l) nu4base = 20
	tmp.nu[2] = E_pow(nu4base, Math.pow(Math.max(-getTickspeed().div(1e3).log10() / 4e13 - 4, 0), 1/4))
}

function updateNU7Temp(){
	var nu7 = quSave.colorPowers.g.add(1).log10()/400
	if (nu7 > 40) nu7 = Math.sqrt(nu7*10)+20
	tmp.nu[3] = pow10(nu7) 
}

function updateNU12Temp(){
	tmp.nu[4] = { 
		normal: Math.sqrt(player.galaxies * .0035 + 1),
		free: player.dilation.freeGalaxies * .035 + 1,
		replicated: Math.sqrt(getTotalRG()) * (tmp.ngp3l ? .035 : .0175) + 1 //NU12 
	}
}

function updateNU14Temp(){
	var base = ghSave.ghostParticles.add(1).log10()
	tmp.nu[5] = Decimal.pow(2, base / 60 - 0.5).max(1).min(1e4)
}

function updateNU15Temp(){
	tmp.nu[6] = pow2(Math.sqrt(nfSave.rewards + 4) - 1) 
	//NU15
}

function updateNeutrinoUpgradesTemp(){
	updateNU1Temp()
	updateNU3Temp()
	updateNU4Temp()
	updateNU7Temp()
	updateNU12Temp()
}

function updateBreakEternityUpgrade1Temp(){
	var ep = player.eternityPoints
	var em = beSave.eternalMatter
	var log1 = ep.div("1e1280").add(1).log10()
	var log2 = em.times(10).max(1).log10()
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
	if (aarMod.ngudpV && exp > 100) exp = Math.log10(exp) * 50
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
	if (aarMod.ngudpV && x > 2.2) x = 1.2 + Math.log10(x + 7.8)
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

	if (ghSave.ghostlyPhotons.unl) {
		updateBreakEternityUpgrade8Temp()
		updateBreakEternityUpgrade9Temp()
		updateBreakEternityUpgrade10Temp()
	}

	if (ghSave.breakDilation.unl) {
		updateBreakEternityUpgrade11Temp()
	}
}

function updateBRU1Temp() {
	tmp.bru[1] = 1
	if (!brSave.active) return
	let exp = 1
	if (hasRipUpg(17)) exp = tmp.bru[17]
	if (ghostified && ghSave.neutrinos.boosts > 7) exp *= tmp.nb[8]
	exp *= player.infinityPoints.max(1).log10()
	tmp.bru[1] = pow10(exp) // BRU1
}

function updateBRU8Temp() {
	tmp.bru[8] = 1
	if (!brSave.active) return
	tmp.bru[8] = pow2(getTotalRG()) // BRU8
	if (!hasNU(11)) tmp.bru[8] = tmp.bru[8].min(Number.MAX_VALUE)
}

function updateBRU14Temp() {
	if (!brSave.active) {
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
	if (bigRipUpg18base > 10 && tmp.newNGP3E) bigRipUpg18base *= Math.log10(bigRipUpg18base)
	tmp.bru[18] = E_pow(bigRipUpg18base, bigRipUpg18exp) // BRU18
	
	var bigRipUpg19exp = Math.sqrt(player.timeShards.add(1).log10()) / (tmp.newNGP3E ? 60 : 80)
	tmp.bru[19] = pow10(bigRipUpg19exp) // BRU19
}

function updateNanoEffectUsages() {
	var data = []
	tmp.nf.rewardsUsed = data
	nanoRewards.effectToReward = {}

	//First reward
	var data2 = [hasBU(21) ? "supersonic_start" : "hatch_speed"]
	nanoRewards.effectsUsed[1] = data2

	//Fifth reward
	var data2 = ["dil_effect_exp"]
	if (!tmp.ngp3l) data2.push("light_threshold_speed")
	nanoRewards.effectsUsed[5] = data2

	//Seventh reward
	var data2 = [hasBU(22) ? "neutrinos" : "remote_start", "preon_charge"]
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

	if (!tmp.ngp3) return
	if (!player.masterystudies.includes("d11")) return

	updateNanoEffectUsages()
	//The rest is calculated by updateTemp().
}


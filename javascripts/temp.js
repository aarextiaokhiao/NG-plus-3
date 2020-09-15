let tmp = {
	nrm: new Decimal(1),
	rm: new Decimal(1),
	it: 1,
	rg4: false,
	inQCs: [0],
	pct: "",
	ns: 1,
	bru: {},
	be: false,
	beu: {},
	bm: [200,175,150,100,50,40,30,25,20,15,10,5,4,3,2,1],
	nbc: [1,2,4,6,15,50,1e3,1e14,1e35,"1e900","1e3000"],
	nu: [],
	nuc: [null,1e6,1e7,1e8,2e8,5e8,2e9,5e9,75e8,1e10,7e12,1e18,1e55,1e125,1e160,1e280],
	lt: [12800,16e4,48e4,16e5,6e6,5e7,24e7,125e7],
	lti: [2,4,1.5,10,4,1e3,2.5,3],
	effL: [0,0,0,0,0,0,0],
	ls: [0,0,0,0,0,0,0],
	le: [0,0,0,0,0,0,0],
	leBonus: {}
}

function updateRedLightBoostTemp(){
	var light0multiplier = tmp.newNGP3E ? .155 : .15
	var lighteffect0 = Math.pow(tmp.effL[0].best, .25) * light0multiplier + 1
	
	if (lighteffect0 > 1.5 && !tmp.newNGP3E) lighteffect0 = Math.log10(lighteffect0 * 20 / 3) * 1.5
	tmp.le[0] = lighteffect0
}

function updateOrangeLightBoostTemp(){
	tmp.le[1] = tmp.effL[1] > 64 ? Math.log10(tmp.effL[1] / 64) + 14 : tmp.effL[1] > 8 ? Math.sqrt(tmp.effL[1]) + 6 : tmp.effL[1] + 1
}

function updateYellowLightBoostTemp(){
	var lighteffect2 = 0 //changed later no matter what
	if (tmp.effL[2] > 60 && !tmp.newNGP3E) lighteffect2 = (Math.log10(tmp.effL[2] / 6) + 2) / 3 * Math.sqrt(1200)
	else lighteffect2 = tmp.effL[2] > 20 ? Math.sqrt(tmp.effL[2] * 20) : tmp.effL[2]
	tmp.le[2] = Math.sqrt(lighteffect2) * 45e3
}

function updateGreenLightBoostTemp(){
	var lighteffect3 = 1
	if (tmp.ngp3l) lighteffect3 = tmp.effL[3] > 8 ? Math.log10(tmp.effL[3] / 8) + Math.sqrt(12) + 1 : Math.sqrt(tmp.effL[3] * 1.5) + 1
	else lighteffect3 = Math.log10(tmp.effL[3] + 1) / 5 + 1
	tmp.le[3] = lighteffect3
}

function updateBlueLightBoostTemp(){
	var light4mult = tmp.newNGP3E ? 1.3 : 5/4
	var lighteffect4 = Math.log10(Math.sqrt(tmp.effL[4] * 2) + 1) * light4mult
	tmp.le[4] = lighteffect4
}

function updateIndigoLightBoostTemp(){
	var loglighteffect5 = tmp.effL[5] > 25 ? Math.sqrt(tmp.effL[5]*10+375) : tmp.effL[5]
	loglighteffect5 *= tmp.newNGP3E ? 20 : 10
	if (!tmp.ngp3l && loglighteffect5 > 729) loglighteffect5 = Math.pow(loglighteffect5 * 27, 2 / 3)
	tmp.le[5] = Decimal.pow(10, loglighteffect5) 
}

function updateVioletLightBoostTemp(){
	var lightexp6 = tmp.newNGP3E ? .36 : 1/3
	var loglighteffect6 = Math.pow(player.postC3Reward.log10() * tmp.effL[6], lightexp6) * 2 
	if (loglighteffect6 > 15e3) loglighteffect6 = 15e3 * Math.pow(loglighteffect6 / 15e3, .6)
	if (!tmp.ngp3l && loglighteffect6 > 5e4) loglighteffect6 = Math.sqrt(loglighteffect6 * 5e4)
	tmp.le[6] = Decimal.pow(10, loglighteffect6)
}

function updateEffectiveLightAmountsTemp(){
	let leBonus5Unl = isLEBoostUnlocked(5)
	for (var c = 7; c >= 0; c--) {
		var x = player.ghostify.ghostlyPhotons.lights[c]
		var y = tmp.leBoost
		if ((c == 6 && !isLEBoostUnlocked(4)) || c == 7) y += 1
		else if (leBonus5Unl) y += Math.pow(tmp.effL[c + 1] * tmp.leBonus[5].mult + 1, tmp.leBonus[5].exp)
		else y += Math.sqrt(tmp.effL[c + 1] + 1)
		tmp.ls[c] = y
		if (c == 0) {
			tmp.effL[0] = {
				normal: x * y, // Without best red Light
				best: (player.ghostify.ghostlyPhotons.maxRed + x * 2) / 3 * y //With best red Light
			}
		} else tmp.effL[c] = x * y
	}
	tmp.leBonus[4] = tmp.ls[6]
}

function updateFixedLightTemp() {
	if (isLEBoostUnlocked(5)) tmp.leBonus[5] = leBoosts.effects[5]()
	updateLightEmpowermentReq()
	updateEffectiveLightAmountsTemp()
	updateRedLightBoostTemp()
	updateOrangeLightBoostTemp()
	updateYellowLightBoostTemp()
	updateGreenLightBoostTemp()
	updateBlueLightBoostTemp()
	updateVioletLightBoostTemp()
	if (isLEBoostUnlocked(1)) tmp.leBonus[1] = {effect: leBoosts.effects[1]()}
	for (var b = 2; b <= leBoosts.max; b++) {
		if (!isLEBoostUnlocked(b)) break
		if (b != 4 && b != 5) {
			tmp.leBonus[b] = leBoosts.effects[b]()
			if (b == 8) tmp.apgw += Math.floor(tmp.leBonus[9])
		}
	}
}

function updateInfiniteTimeTemp() {
	var x = (3 - getTickspeed().log10()) * 0.000005
	if (tmp.ngp3) {
		if (!tmp.ngp3l && player.achievements.includes("ng3p56")) x *= 1.03
		if (ghostified && player.ghostify.neutrinos.boosts>3) x *= tmp.nb[4]
		if (tmp.be && !player.dilation.active && tmp.qu.breakEternity.upgrades.includes(8)) x *= getBreakUpgMult(8)
		if (isLEBoostUnlocked(8)) x *= tmp.leBonus[8]
		x = softcap(x, "inf_time_log_1")
		if (player.aarexModifications.ngudpV) {
			if (x > 1e8) x = Math.pow(1e8 * x, .5)
			if (x > 1e9) x = Math.pow(1 + Math.log10(x), 9)
			if (tmp.be && x > 1e7) x = Math.pow(93 + Math.log10(x), 3.5)
		}
		if ((!tmp.ngp3l || player.aarexModifications.ngudpV) && player.dilation.active && x > 1e5) x = Math.pow(1e20 * x, .2)
		if (!tmp.ngp3l && !tmp.qu.bigRip.active) x = softcap(x, "inf_time_log_2")
	}
	tmp.it = Decimal.pow(10, x)
}

function updateIntergalacticTemp() {
	if (!tmp.ngp3) return
	x = player.galaxies
	if (isLEBoostUnlocked(3) && !tmp.qu.bigRip.active) x *= tmp.leBonus[3]
	if (tmp.be && player.dilation.active && tmp.qu.breakEternity.upgrades.includes(10)) x *= getBreakUpgMult(10)
	if (!tmp.ngp3l) x += tmp.effAeg
	tmp.igg = x

	tmp.igs = 0 //Intergalactic Scaling ; used in the display text
	var igLog = Math.pow(x, Math.min(Math.sqrt(Math.log10(Math.max(x,1))) * 2, 2.5)) //Log10 of reward
	
	if (tmp.qu.bigRip.active && !tmp.ngp3l) {
		if (igLog > 1e9) { //Distant
			igLog = Math.pow(igLog * 1e3, .75)
			tmp.igs = 1
		}
		if (igLog > 1e11) { //Further
			igLog = Math.pow(Math.log10(igLog) - 1, 11)
			tmp.igs = 2
		}
		tmp.ig = Decimal.pow(10, igLog)
		return
	}
	if ((player.aarexModifications.ngudpV || !tmp.ngp3l) && igLog > 1e15) { //Further
		igLog = Math.pow(10 + 6 * Math.log10(igLog), 7.5)
		tmp.igs = 2
	}
	if (player.aarexModifications.ngudpV && igLog > 1e16) { //Remote
		igLog = Math.pow(84 + Math.log10(igLog), 8)
		tmp.igs = 3
	}

	if (!tmp.ngp3l && igLog > 1e20) { //Dark Matter or Ghostly or Ethereal
		igLog = softcap(igLog, "ig_log_high")
		tmp.igs = Math.min(Math.floor(Math.log10(igLog) - 16), 8)
		if (igLog > 1e24) igLog = Math.pow(Math.pow(Math.log10(igLog), 2) + 424, 8)
	}

	tmp.ig = Decimal.pow(10, igLog)
}

function updateAntiElectronGalaxiesTemp(){
	tmp.aeg = 0
	if (hasBosonicUpg(14) && !tmp.qu.bigRip.active) tmp.aeg = Math.max(tmp.blu[14] - tmp.qu.electrons.sacGals, 0)
	tmp.effAeg = tmp.aeg
	if (tmp.aeg > 0) {
		if (hasBosonicUpg(34)) tmp.effAeg *= tmp.blu[34]
	}
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

function updateMatterSpeed(){
	//mv: Matter speed
	tmp.mv = 1.03 + player.resets/200 + player.galaxies/100
	if (player.pSac !== undefined) {
		var exp = 10 / puMults[12](hasPU(12, true, true))
		tmp.mv = Decimal.pow(tmp.mv, exp)
	}
}

function updateReplicantiTemp() {
	var data = {}
	tmp.rep = data

	data.ln = player.replicanti.amount.ln()
	data.chance = player.replicanti.chance
	data.speeds = getReplSpeed()
	data.interval = getReplicantiFinalInterval()

	if (tmp.ngp3 && player.masterystudies.includes("t273")) {
		data.chance = Decimal.pow(data.chance, tmp.mts[273])
		data.freq = 0
		if (data.chance.gte("1e9999998")) data.freq = tmp.mts[273].times(Math.log10(player.replicanti.chance + 1) / Math.log10(2))
	}

	data.est = Decimal.div((data.freq ? data.freq.times(Math.log10(2) / Math.log10(Math.E) * 1e3) : Decimal.add(data.chance, 1).log(Math.E) * 1e3), data.interval)
	data.estLog = data.est.times(Math.log10(Math.E))
}

function updatePostInfiTemp() {
	var exp11 = player.galacticSacrifice ? 2 : 0.5
	var exp21 = player.galacticSacrifice ? 2 : 0.5
	if (player.aarexModifications.ngmX >= 4){
		exp11 += player.totalmoney.plus(10).div(10).log10() / 1e4
		exp21 += player.money.plus(10).div(10).log10() / 1e4
	}
	tmp.postinfi11 = Math.pow(player.totalmoney.plus(10).log10(), exp11)
	tmp.postinfi21 = Math.pow(player.money.plus(10).log10(), exp21)
}

function updatePPTITemp(){
	let x = 1
	x /= tmp.le[1] || 1
	tmp.ppti = x
}

function updateGhostifyTempStuff(){
	updateBosonicLabTemp()
	tmp.apgw = tmp.qu.nanofield.apgWoke || getAntiPreonGhostWake()
	updatePPTITemp() //preon power threshold increase
	if (player.ghostify.ghostlyPhotons.unl) {
		var x = getLightEmpowermentBoost()
		var y = hasBosonicUpg(32)
		if (tmp.leBoost !== x || tmp.hasBU32 !== y || tmp.updateLights) {
			tmp.leBoost = x
			tmp.hasBU32 = y
			tmp.updateLights = false
			updateFixedLightTemp()
		}
		updateIndigoLightBoostTemp()
		updatePhotonsUnlockedBRUpgrades()
		updateNU14Temp()
		updateNU15Temp()
	}
	if (ghostified) {
		updateNeutrinoUpgradesTemp()
		updateNeutrinoBoostsTemp()
	}
}

function updateTemp() {
	if (player) {
		if (player.money) tmp.ri = player.money.gte(getLimit()) && ((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) || !onPostBreak())
		else tmp.ri = false
	} else {
		tmp.ri = false
		return
	}
	tmp.nrm = 1
	if (player.timestudy.studies.includes(101)) tmp.nrm = player.replicanti.amount.max(1)
	tmp.rg4 = false
	if (tmp.ngp3) {
		updateGhostifyTempStuff()
		if (tmp.qu.breakEternity.unlocked) updateBreakEternityUpgradesTemp()
		if (player.masterystudies.includes("d14")) updateBigRipUpgradesTemp()
		if (tmp.nrm !== 1 && tmp.qu.bigRip.active) {
			if (!player.dilation.active && tmp.qu.bigRip.upgrades.includes(14)) tmp.nrm = tmp.nrm.pow(tmp.bru[14])
			if (tmp.nrm.log10() > 1e9) tmp.nrm = Decimal.pow(10, 1e9 * Math.pow(tmp.nrm.log10() / 1e9, 2/3))
		}
		if (player.masterystudies.includes("d13")) updateTS431ExtraGalTemp()
		if (player.masterystudies.includes("d9")) {
			tmp.twr = getTotalWorkers()
			tmp.tra = getTotalReplicants()
		}
		updateMasteryStudyTemp()
		if (player.masterystudies.includes("d13")) tmp.branchSpeed = getBranchSpeed()
		if (player.masterystudies.includes("d12") && tmp.nf !== undefined && tmp.nf.rewardsUsed !== undefined) {
			var x = getNanoRewardPowerEff()
			var y = tmp.qu.nanofield.rewards
			tmp.ns = getNanofieldSpeed()
			if (tmp.nf.powerEff !== x || tmp.nf.rewards !== y) {
				tmp.nf.powerEff = x
				tmp.nf.rewards = y

				updateNanoRewardPowers()
				updateNanoRewardEffects()
			}
		}
		if (player.masterystudies.includes("d10")) tmp.edgm = getEmperorDimensionGlobalMultiplier() //Update global multiplier of all Emperor Dimensions
		tmp.be = tmp.qu.bigRip.active&&tmp.qu.breakEternity.break
		tmp.rg4 = tmp.qu.upgrades.includes("rg4") && (tmp.qu.rg4 || !tmp.ngp3l || inQC(1) || QCIntensity(1))
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
	if (hasBosonicUpg(41)) {
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
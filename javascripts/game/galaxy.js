function galaxyReset(bulk) {
	if (tmp.ri) return

	if (autoS) auto = false;
	autoS = true;
	player.galaxies += bulk
	if (player.options.notation == "Emojis") player.spreadingCancer += bulk
	checkOnGalaxyReset()
	if (mod.ngp3 && bulk) {
		if (quSave.autoOptions.sacrifice) sacrificeGalaxy()
		if (hasNB(1)) NT.onGalaxy(bulk)
	}

	let am = player.money
	doReset("gal")
	if (hasAch("r111") && am.gte(player.money)) player.money = am
}

function checkOnGalaxyReset() {
	if (player.sacrificed == 0) giveAchievement("I don't believe in Gods");
	if (player.galaxies >= 50) giveAchievement("YOU CAN GET 50 GALAXIES!??")
	if (player.galaxies >= 2) giveAchievement("Double Galaxy");
	if (player.galaxies >= 1) giveAchievement("You got past The Big Wall");
	if (player.galaxies >= 540 && player.replicanti.galaxies == 0) giveAchievement("Unique snowflakes")
	
	if (player.spreadingCancer >= 10) giveAchievement("Spreading Nerd")
	if (player.spreadingCancer >= 1000000) giveAchievement("Cancer = Spread")
}

el("secondSoftReset").onclick = function() {
	let ngm4 = inNGM(4)
	let bool1 = !inNC(11) || ngm4
	let bool2 = player.currentChallenge != "postc1"
	let bool3 = player.currentChallenge != "postc5" || !inNGM(3)
	let bool4 = player.currentChallenge != "postc7"
	let bool5 = (player.currentEternityChall == "eterc6" || inQC(6)) && !tmp.qu.be
	var bool = bool1 && bool2  && bool3 && bool4 && !bool5 && !tmp.ri && !cantReset()
	if (getAmount(inNC(4) ? 6 : 8) >= getGalaxyRequirement() && bool) {
		if ((getEternitied() >= 7 || player.autobuyers[10].bulkBought) && !shiftDown && (!inNC(14) || !inNGM(3))) maxBuyGalaxies(true);
		else galaxyReset(1)
	}
}

function getGalaxyRequirement(offset = 0, display) {
	let mult = getGalaxyReqMultiplier()
	let total = player.galaxies + offset
	let base = total * mult
	let amount = 80 + base
	let scaling = 0
	if (inNGM(2)) amount -= (hasGSacUpg(22) && player.galaxies > 0) ? 80 : 60
	if (inNGM(4)) amount -= 10
	if (inNC(4)) amount = !inNGM(3) ? 99 + base : amount + (inNGM(4) ? 20 : -30)
	if (tmp.qu.be) {
		amount *= 50
		if (isBreakUpgActive(2)) amount /= tmp.qu.beu[2]
	}
	if (!mod.rs) {
		let distantStart = getDistantScalingStart()
		if (total >= distantStart) {
			let speed = 1
			if (hasGluonUpg("rg", 6)) speed *= 0.867
			if (hasGluonUpg("gb", 6)) speed /= gluonEff("gb", 6)
			if (hasGluonUpg("br", 6)) speed /= gluonEff("br", 6)
			if (hasNB(6)) speed /= NT.eff("boost", 6)
			if (hasAch("ng3p98")) speed *= 0.9
			amount += getDistantAdd(total-distantStart+1)*speed
			if (total >= distantStart * 2.5 && inNGM(2)) {
				// 5 times worse scaling
				amount += 4 * speed * getDistantAdd(total-distantStart * 2.5 + 1)
				scaling = Math.max(scaling, 2)
			} else scaling = Math.max(scaling, 1)
		}

		let remoteStart = getRemoteScalingStart()
		if (total >= remoteStart && !hasNU(6)) {
			let speed2 = 1
			if (hasGluonUpg("rg", 7)) speed2 *= 0.9
			if (hasGluonUpg("gb", 7)) speed2 /= gluonEff("gb", 7)
			if (hasGluonUpg("br", 7)) speed2 /= gluonEff("br", 7)
			amount *= Math.pow(1 + (hasGluonUpg("rg", 1) ? 1 : 2) / (inNGM(4) ? 10 : 1e3), (total - remoteStart + 1) * speed2)
			scaling = Math.max(scaling, 3)
		}
	}
	amount = Math.ceil(amount)

	if (player.infinityUpgrades.includes("resetBoost")) amount -= 9
	if (player.challenges.includes("postc5")) amount -= 1
	if (display) return {amount: amount, scaling: scaling}
	return amount
}

function getGalaxyReqMultiplier() {
	if (player.currentChallenge == "postcngmm_1") return 60
	let ret = 60
	if (inNGM(2)) if (hasGSacUpg(22)) ret -= 30
	if (inNC(4)) ret = 90
	if (player.infinityUpgrades.includes("galCost")) ret -= 5
	if (player.infinityUpgrades.includes("postinfi52") && !inNGM(3)) ret -= 3
	if (hasTimeStudy(42)) ret *= tsMults[42]()
	return ret
}

function getDistantScalingStart() {
	if (player.currentEternityChall == "eterc5") return 0
	var n = 100 + getECReward(5)
	if (hasTimeStudy(223)) n += 7
	if (hasTimeStudy(224)) n += Math.floor(player.resets/2000)
	if (bigRipped() && hasRipUpg(15)) n += tmp.qu.bru[15]
	if (hasBLMilestone(16)) n += blEff(16, 0)

	return Math.max(n, 0)
}

function getDistantAdd(x) {
	if (inOnlyNGM(2)) return Math.pow(x, 1.5) + x
	return (x + 1) * x
}

function getRemoteScalingStart(galaxies) {
	var n = 800
	if (inNGM(4)) {
		n = 6
		if (player.challenges.includes("postcngm3_1")) n += tmp.ic_power / 2
	} else if (inNGM(2)) n += 1e7
	if (mod.ngp3) {
		for (var t = 251; t < 254; t++) if (hasMasteryStudy("t" + t)) n += getMTSMult(t)
		if (hasMasteryStudy("t301")) n += getMTSMult(301)
		if (hasNanoReward("remote_start")) n += getNanorewardEff("remote_start")
	}
	return n
}

/* EFF */
function initialGalaxies() {
	let g = player.galaxies
	if (isPositronsOn()) {
		let sac = quSave.electrons.sacGals
		g = Math.max(g - sac, 0)
		g *= Math.max(Math.min(10 - (quSave.electrons.amount + g * getPositronGainFinalMult()) / 16857, 1), 0)
		g += Math.min(sac, player.galaxies) * lightEff(3, 0)
	}
	if ((inAnyQC() || dev.testZone) && !tmp.qu.be) g = 0
	if ((inNC(15) || player.currentChallenge == "postc1") && inOnlyNGM(3)) g = 0
	return g
}

function getGalaxyPower() {
	let r = tmp.gal.init
	if (!tmp.qu.be) {
		if (player.break && !mod.rs && !inNGM(2)) r = Math.max(r - 2, 0)
		r += getReplGalPower() + getDilGalPower()
	}
	if ((inNC(7) || inQC(4)) && inNGM(2)) r *= r
	return r
}

function getGalaxyEff(bi) {
	let eff = 1
	if (hasGSacUpg(22)) eff *= inNGM(4) ? 2 : 5
	if (player.infinityUpgrades.includes("galaxyBoost")) eff *= 2;
	if (player.infinityUpgrades.includes("postGalaxy")) eff *= getPostGalaxyEff();
	if (player.challenges.includes("postc5")) eff *= inNGM(2) ? 1.15 : 1.1;
	if (hasAch("r86")) eff *= inNGM(2) ? 1.05 : 1.01
	if (inNGM(2)) {
		if (hasAch("r83")) eff *= 1.05
		if (hasAch("r45")) eff *= 1.02
		if (player.infinityUpgrades.includes("postinfi51")) eff *= inNGM(3) ? 1.15 : 1.2
		if (tmp.ic_power && hasAch("r67")) {
			let x = tmp.ic_power
			if (x < 0) x = 1
			if (x > 4 && inNGM(3)) x = Math.sqrt(x - 1) + 2
			eff += .07 * x
		}
	}
	if (inNGM(3) && (inNC(5) || player.currentChallenge == "postcngm3_3")) eff *= 0.75
	if (hasAch("ngpp8") && mod.ngpp) eff *= 1.001
	if (hasTimeStudy(212)) eff *= tsMults[212]()
	if (hasTimeStudy(232) && bi) eff *= tsMults[232]()

	if (mod.udsp && player.dilation.active) eff *= exDilationBenefit() + 1
	if (mod.ngp3) {
		eff *= tmp.qu.color_eff.r
		if (hasGluonUpg("rg", 2)) eff *= gluonEff("rg", 2)
		if (hasGluonUpg("rg", 4)) eff *= 1.5
		if (tmp.qu.be) eff *= 0.4
	}
	return eff
}

function getPostGalaxyEff() {
	return inNGM(3) ? 1.1 : inNGM(2) ? 1.7 : 1.5
}
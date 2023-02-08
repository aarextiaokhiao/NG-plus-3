function galaxyReset(bulk) {
	if (tmp.ri) return

	if (autoS) auto = false;
	autoS = true;

	if (player.sacrificed == 0 && bulk > 0) giveAchievement("I don't believe in Gods");

	let am = player.money
	player.galaxies += bulk
	doReset("gal")
	if (hasAch("r111")) player.money = am

	if (mod.ngp3 && bulk) {
		if (quSave.autoOptions.sacrifice) sacrificeGalaxy(6, true)
		if (hasNB(1)) gainNeutrinos(bulk, "gen")
	}
	hideDimensions()
	tmp.tickUpdate = true;
}

el("secondSoftReset").onclick = function() {
	let ngm4 = inNGM(4)
	let bool1 = !inNC(11) || ngm4
	let bool2 = player.currentChallenge != "postc1"
	let bool3 = player.currentChallenge != "postc5" || !inNGM(3)
	let bool4 = player.currentChallenge != "postc7"
	let bool5 = (player.currentEternityChall == "eterc6" || inQC(6)) && !tmp.be
	var bool = bool1 && bool2  && bool3 && bool4 && !bool5 && !tmp.ri && !cantReset()
	if (getAmount(inNC(4) ? 6 : 8) >= getGalaxyRequirement() && bool) {
		if ((getEternitied() >= 7 || player.autobuyers[10].bulkBought) && !shiftDown && (!inNC(14) || !inNGM(3))) maxBuyGalaxies(true);
		else galaxyReset(1)
	}
}

function getGalaxyRequirement(offset = 0, display) {
	tmp.grd = {} //Galaxy requirement data
	tmp.grd.galaxies = player.galaxies + offset
	let mult = getGalaxyReqMultiplier()
	let base = tmp.grd.galaxies * mult
	let amount = 80 + base
	let scaling = 0
	if (inNGM(2)) amount -= (hasGSacUpg(22) && player.galaxies > 0) ? 80 : 60
	if (inNGM(4)) amount -= 10
	if (inNC(4)) amount = !inNGM(3) ? 99 + base : amount + (inNGM(4) ? 20 : -30)
	if (tmp.be) {
		amount *= 50
		if (beSave && beSave.upgrades.includes(2)) amount /= getBreakUpgMult(2)
		if (player.currentEternityChall == "eterc10" && beSave.upgrades.includes(9)) amount /= getBreakUpgMult(9)
	}
	if (!mod.rs) {
		tmp.grd.speed = 1
		let ghostlySpeed = tmp.be ? 55 : 1
		let div = 1e4
		let over = tmp.grd.galaxies / (302500 / ghostlySpeed)
		if (over >= 1) {
			tmp.grd.speed = Math.pow(2, (tmp.grd.galaxies + 1 - 302500 / ghostlySpeed) * ghostlySpeed / div)
			scaling = Math.max(scaling, 4)
		}

		let distantStart = getDistantScalingStart()
		if (tmp.grd.galaxies >= distantStart) {
			let speed = tmp.grd.speed
			if (hasGluonUpg("rg6")) speed *= 0.867
			if (hasGluonUpg("gb6")) speed /= 1 + Math.pow(player.infinityPower.plus(1).log10(), 0.25) / 2810
			if (hasGluonUpg("br6")) speed /= 1 + player.meta.resets / 340
			if (hasNB(6)) speed /= tmp.nb[6]
			if (hasBU(45)) speed /= tmp.blu[45]
			if (hasAch("ng3p98")) speed *= 0.9
			amount += getDistantAdd(tmp.grd.galaxies-distantStart+1)*speed
			if (tmp.grd.galaxies >= distantStart * 2.5 && inNGM(2)) {
				// 5 times worse scaling
				amount += 4 * speed * getDistantAdd(tmp.grd.galaxies-distantStart * 2.5 + 1)
				scaling = Math.max(scaling, 2)
			} else scaling = Math.max(scaling, 1)
		}

		let remoteStart = getRemoteScalingStart()
		if (tmp.grd.galaxies >= remoteStart && !tmp.be && !hasNU(6)) {
			let speed2 = tmp.grd.speed
			if (hasGluonUpg("rg7")) speed2 *= 0.9
			if (hasGluonUpg("gb7")) speed2 /= 1+Math.log10(1+player.infinityPoints.max(1).log10())/100
			if (hasGluonUpg("br7")) speed2 /= 1+Math.log10(1+player.eternityPoints.max(1).log10())/80
			amount *= Math.pow(1 + (hasGluonUpg("rg1") ? 1 : 2) / (inNGM(4) ? 10 : 1e3), (tmp.grd.galaxies - remoteStart + 1) * speed2)
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
	if (player.timestudy.studies.includes(42)) ret *= tsMults[42]()
	return ret
}

function getDistantScalingStart() {
	if (player.currentEternityChall == "eterc5") return 0
	var n = 100 + getECReward(5)
	if (player.timestudy.studies.includes(223)) n += 7
	if (player.timestudy.studies.includes(224)) n += Math.floor(player.resets/2000)
	if (bigRipped() && hasRipUpg(15)) n += tmp.bru[15]

	if (tmp.grd.speed == 1) return Math.max(n, 0)
	return n
}

function getDistantAdd(x) {
	if (inOnlyNGM(2)) return Math.pow(x, 1.5) + x
	return (x + 1) * x
}

function getRemoteScalingStart(galaxies) {
	var n = 800
	if (inNGM(4)) {
		n = 6
		if (player.challenges.includes("postcngm3_1")) n += tmp.cp / 2
	}
	else if (inNGM(2)) n += 1e7
	if (mod.ngp3) {
		for (var t = 251; t < 254; t++) if (hasMasteryStudy("t" + t)) n += getMTSMult(t)
		if (hasMasteryStudy("t301")) n += getMTSMult(301)
		if (isNanoEffectUsed("remote_start")) n += tmp.nf.effects.remote_start
		if (galaxies > 1/0 && !tmp.be) n -= galaxies - 1/0 
	}
	return n
}
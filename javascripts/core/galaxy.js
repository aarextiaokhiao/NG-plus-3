function galaxyReset(bulk) {
	if (tmp.ri) return
	if (autoS) auto = false;
	autoS = true;
	if (player.sacrificed == 0 && bulk > 0) giveAchievement("I don't believe in Gods");
	if (player.tickspeedBoosts) player.tickspeedBoosts = 0
	doGalaxyResetStuff(bulk)

	NC10NDCostsOnReset()
	if (player.pSac) {
		resetInfDimensions()
		player.pSac.dims.extraTime = 0
	}
	resetTDs()
	reduceDimCosts()
	skipResets()
	if (player.currentChallenge == "postc2") {
		player.eightAmount = new Decimal(1);
		player.eightBought = 1;
		player.resets = 4;
	}
	setInitialDimensionPower();
	
	if (player.options.notation == "Emojis") player.spreadingCancer += bulk
	if (player.spreadingCancer >= 10 && !player.achievements.includes("r41")) giveAchievement("Spreading Cancer")
	if (player.spreadingCancer >= 1000000) giveAchievement("Cancer = Spread")
	if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r83")) player.tickspeed = player.tickspeed.times(Decimal.pow(0.95, player.galaxies));
	divideTickspeedIC5()

	if (player.infinitied < 1 && player.eternities == 0 && !quantumed) {
		document.getElementById("sacrifice").style.display = "none"
		document.getElementById("confirmation").style.display = "none"
		if (player.galacticSacrifice && (player.galaxies > 0 || (player.galacticSacrifice ? player.galacticSacrifice.times > 0 : false))) {
			document.getElementById("gSacrifice").style.display = "inline-block"
			document.getElementById("gConfirmation").style.display = "inline-block"
		}
	}
	if (player.galaxies >= 50 && !player.achievements.includes("r83")) giveAchievement("YOU CAN GET 50 GALAXIES!??")
	if (player.galaxies >= 2 && !player.achievements.includes("r27")) giveAchievement("Double Galaxy");
	if (player.galaxies >= 1 && !player.achievements.includes("r26")) giveAchievement("You got past The Big Wall");
	if (!player.achievements.includes("r111")) setInitialMoney()
	if (player.achievements.includes("r66")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.galaxies >= 540 && player.replicanti.galaxies == 0) giveAchievement("Unique snowflakes")
	if (!player.achievements.includes("ngpp18")) checkUniversalHarmony()
	if (tmp.ngp3 && bulk) {
		if (tmp.qu.autoOptions.sacrifice) sacrificeGalaxy(6, true)
		if (tmp.qu.bigRip.active) tmp.qu.bigRip.bestGals = Math.max(tmp.qu.bigRip.bestGals, player.galaxies)
		if (ghostified && player.ghostify.neutrinos.boosts) gainNeutrinos(bulk, "gen")
	}
	hideDimensions()
	tmp.tickUpdate = true;
}

document.getElementById("secondSoftReset").onclick = function() {
	let ngm4 = player.aarexModifications.ngmX ? player.aarexModifications.ngmX >= 4 : false
	let bool1 = !inNC(11) || ngm4
	let bool2 = player.currentChallenge != "postc1"
	let bool3 = player.currentChallenge != "postc5" || player.tickspeedBoosts == undefined
	let bool4 = player.currentChallenge != "postc7"
	let bool5 = (player.currentEternityChall == "eterc6" || inQC(6)) && !tmp.be
	var bool = bool1 && bool2  && bool3 && bool4 && !bool5 && !tmp.ri && !cantReset()
	if (getAmount(inNC(4) || player.pSac != undefined ? 6 : 8) >= getGalaxyRequirement() && bool) {
		if ((getEternitied() >= 7 || player.autobuyers[10].bulkBought) && !shiftDown && (!inNC(14) || !(player.aarexModifications.ngmX > 3))) maxBuyGalaxies(true);
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
	if (player.galacticSacrifice != undefined) amount -= (player.galacticSacrifice.upgrades.includes(22) && player.galaxies > 0) ? 80 : 60
	else if (inNC(6, 1) && player.aarexModifications.ngexV != undefined && tmp.grd.galaxies < 2) amount -= tmp.grd.galaxies == 1 ? 40 : 50
	if (player.aarexModifications.ngmX > 3) amount -= 10
	if (inNC(6, 1) && player.aarexModifications.ngexV != undefined && tmp.grd.galaxies >= 2) amount -= 2 * mult
	if (inNC(4) || player.pSac !== undefined) amount = player.tickspeedBoosts == undefined ? 99 + base : amount + (player.aarexModifications.ngmX > 3 ? 20 : -30)
	if (tmp.be) {
		amount *= 50
		if (tmp.qu.breakEternity.upgrades.includes(2)) amount /= getBreakUpgMult(2)
		if (player.currentEternityChall == "eterc10" && tmp.qu.breakEternity.upgrades.includes(9)) amount /= getBreakUpgMult(9)
	}
	if (!player.boughtDims) {
		tmp.grd.speed = 1
		let ghostlySpeed = tmp.be ? 55 : 1
		let div = 1e4
		let over = tmp.grd.galaxies / (302500 / ghostlySpeed)
		if (over >= 1) {
			if (over >= 3) {
				div /= Math.pow(over, 6) / 729
				scaling = 6
			}
			if (isLEBoostUnlocked(2) && tmp.be) div *= tmp.leBonus[2]
			tmp.grd.speed = Math.pow(2, (tmp.grd.galaxies + 1 - 302500 / ghostlySpeed) * ghostlySpeed / div)
			scaling = Math.max(scaling, 5)
		}

		let distantStart = getDistantScalingStart()
		if (tmp.grd.galaxies >= distantStart) {
			let speed = tmp.grd.speed
			if (GUBought("rg6")) speed *= 0.867
			if (GUBought("gb6")) speed /= 1 + Math.pow(player.infinityPower.max(1).log10(), 0.25) / 2810
			if (GUBought("br6")) speed /= 1 + player.meta.resets / 340
			if (ghostified && player.ghostify.neutrinos.boosts > 5) speed /= tmp.nb[6]
			if (hasBosonicUpg(45)) speed /= tmp.blu[45]
			if (player.achievements.includes("ng3p98")) speed *= 0.9
			amount += getDistantAdd(tmp.grd.galaxies-distantStart+1)*speed
			if (tmp.grd.galaxies >= distantStart * 2.5 && player.galacticSacrifice != undefined) {
				// 5 times worse scaling
				amount += 4 * speed * getDistantAdd(tmp.grd.galaxies-distantStart * 2.5 + 1)
				scaling = Math.max(scaling, 2)
			} else scaling = Math.max(scaling, 1)
		}

		let remoteStart = getRemoteScalingStart()
		if (tmp.grd.galaxies >= remoteStart && !tmp.be && !hasNU(6)) {
			let speed2 = tmp.grd.speed
			if (GUBought("rg7")) speed2 *= 0.9
			if (GUBought("gb7")) speed2 /= 1+Math.log10(1+player.infinityPoints.max(1).log10())/100
			if (GUBought("br7")) speed2 /= 1+Math.log10(1+player.eternityPoints.max(1).log10())/80
			amount *= Math.pow(1 + (GUBought("rg1") ? 1 : 2) / (player.aarexModifications.ngmX > 3 ? 10 : 1e3), (tmp.grd.galaxies - remoteStart + 1) * speed2)
			scaling = Math.max(scaling, 3)
		}

		if (tmp.grd.galaxies >= tmp.grd.darkStart) scaling = Math.max(scaling, 4)
	}
	amount = Math.ceil(amount)

	if (player.infinityUpgrades.includes("resetBoost")) amount -= 9
	if (player.challenges.includes("postc5")) amount -= 1
	if (player.infinityUpgradesRespecced != undefined) amount -= getInfUpgPow(6)
	if (display) return {amount: amount, scaling: scaling}
	return amount
}

function getGalaxyReqMultiplier() {
	if (inNC(6, 1) && player.aarexModifications.ngexV != undefined && tmp.grd.galaxies <= 2) return 0
	if (player.currentChallenge == "postcngmm_1") return 60
	let ret = 60
	if (player.galacticSacrifice !== undefined) if (player.galacticSacrifice.upgrades.includes(22)) ret -= 30
	else if (player.timestudy.studies.includes(42)) ret *= tsMults[42]()
	if (inNC(4)) ret = 90
	if (player.infinityUpgrades.includes("galCost")) ret -= 5
	if (player.infinityUpgrades.includes("postinfi52") && player.tickspeedBoosts == undefined) ret -= 3
	if (player.dilation.upgrades.includes("ngmm12")) ret -= 10
	if (player.galacticSacrifice !== undefined && player.timestudy.studies.includes(42)) ret *= tsMults[42]()
	return ret
}

function getDistantScalingStart() {
	if (player.currentEternityChall == "eterc5") return 0
	var n = 100 + getECReward(5)
	if (player.timestudy.studies.includes(223)) n += 7
	if (player.timestudy.studies.includes(224)) n += Math.floor(player.resets/2000)
	if (tmp.ngp3) if (tmp.qu.bigRip.active && tmp.qu.bigRip.upgrades.includes(15)) n += tmp.bru[15]
	if (player.dilation.upgrades.includes("ngmm11")) n += 25

	if (tmp.grd.galaxies >= tmp.grd.darkStart) {
		let push = 5 / tmp.grd.speed
		if (GUBought("rg5")) push *= 1.13
		if (GUBought("gb5")) push *= 1 + Math.sqrt(player.replicanti.galaxies) / 550
		if (GUBought("br5")) push *= 1 + Math.min(Math.sqrt(player.dilation.tachyonParticles.max(1).log10()) * 0.013, 0.14)
		n -= Math.ceil((tmp.grd.galaxies - tmp.grd.darkStart + 1) / push)
	}

	if (tmp.grd.speed == 1) return Math.max(n, 0)
	return n
}

function getDistantAdd(x) {
	if (player.galacticSacrifice !== undefined && player.tickspeedBoosts == undefined) return Math.pow(x, 1.5) + x
	return (x + 1) * x
}

function getRemoteScalingStart(galaxies) {
	var n = 800
	if (player.aarexModifications.ngmX > 3) {
		n = 6
		if (player.challenges.includes("postcngm3_1")) n += tmp.cp / 2
	}
	else if (player.galacticSacrifice != undefined) n += 1e7
	if (tmp.ngp3) {
		for (var t = 251; t < 254; t++) if (player.masterystudies.includes("t" + t)) n += getMTSMult(t)
		if (player.masterystudies.includes("t301")) n += getMTSMult(301)
		if (isNanoEffectUsed("remote_start")) n += tmp.nf.effects.remote_start
		if (galaxies > 1/0 && !tmp.be) n -= galaxies - 1/0 
	}
	return n
}
function cantHoldInfinitiesCheck(){
	if (getDimensionFinalMultiplier(1).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(2).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(3).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(4).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(5).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(6).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(7).gte(new Decimal("1e308")) &&
	getDimensionFinalMultiplier(8).gte(new Decimal("1e308"))) giveAchievement("Can't hold all these infinities")
}

function antitablesHaveTurnedCheck(){
	if (getDimensionFinalMultiplier(1).lt(getDimensionFinalMultiplier(2)) &&
	getDimensionFinalMultiplier(2).lt(getDimensionFinalMultiplier(3)) &&
	getDimensionFinalMultiplier(3).lt(getDimensionFinalMultiplier(4)) &&
	getDimensionFinalMultiplier(4).lt(getDimensionFinalMultiplier(5)) &&
	getDimensionFinalMultiplier(5).lt(getDimensionFinalMultiplier(6)) &&
	getDimensionFinalMultiplier(6).lt(getDimensionFinalMultiplier(7)) &&
	getDimensionFinalMultiplier(7).lt(getDimensionFinalMultiplier(8))) giveAchievement("How the antitables have turned")
}

function checkEPReqAchieve(){
	if (player.eternityPoints.gte(Number.MAX_VALUE)) giveAchievement("But I wanted another prestige layer...")
	if (player.eternityPoints.gte("1e40000")) giveAchievement("In the grim darkness of the far endgame")
	if (player.eternityPoints.gte("9e99999999")) giveAchievement("This achievement doesn't exist 3")
}

function checkIPReqAchieve(){
	var checkEmpty = player.timestudy.studies.length < 1
	if (tmp.ngp3) for (id=0;id<player.masterystudies.length;id++) {
		if (player.masterystudies[id].split("t")[1]) checkEmpty = false
	}
	var ableToGetRid2 = checkEmpty && player.dilation.active 
	
	if (player.infinityPoints.gte(new Decimal("1e22000")) && checkEmpty) giveAchievement("What do I have to do to get rid of you")
	if (player.infinityPoints.gte(1e100) && player.firstAmount.equals(0) && player.infinitied == 0 && player.resets <= 4 && player.galaxies <= 1 && player.replicanti.galaxies == 0) giveAchievement("Like feasting on a behind")
	if (player.infinityPoints.gte('9.99999e999')) giveAchievement("This achievement doesn't exist II");
	if (player.infinityPoints.gte('1e30008')) giveAchievement("Can you get infinite IP?");
	if (player.infinityDimension1.baseAmount == 0 &&
		player.infinityDimension2.baseAmount == 0 &&
		player.infinityDimension3.baseAmount == 0 &&
		player.infinityDimension4.baseAmount == 0 &&
		player.infinityDimension5.baseAmount == 0 &&
		player.infinityDimension6.baseAmount == 0 &&
		player.infinityDimension7.baseAmount == 0 &&
		player.infinityDimension8.baseAmount == 0 &&
		player.infMultCost.equals(10) &&
		player.infinityPoints.gt(new Decimal("1e140000"))) giveAchievement("I never liked this infinity stuff anyway")
	if (ableToGetRid2 && player.infinityPoints.log10() >= 20000) giveAchievement("This is what I have to do to get rid of you.")
}

function checkReplicantiBasedReqAchieve(){
	if (player.replicanti.amount.gte(Number.MAX_VALUE) && player.thisInfinityTime < 600*30) giveAchievement("Is this safe?");
	if (player.replicanti.galaxies >= 10 && player.thisInfinityTime < 150) giveAchievement("The swarm");
	if (player.replicanti.galaxies >= 180*player.galaxies && player.galaxies > 0) giveAchievement("Popular music")
	if (player.replicanti.amount.gt(new Decimal(tmp.ngex?"1e15000":"1e20000"))) giveAchievement("When will it be enough?")
	if (player.boughtDims && player.replicanti.amount.gt("1e1000000")) giveAchievement("Do you really need a guide for this?");
	if (player.replicanti.amount.gt(new Decimal("1e100000"))) giveAchievement("It will never be enough")
}

function checkResetCountReqAchieve(){
	if (getEternitied() >= 1e12) giveAchievement("The cap is a million, not a trillion")
	if (player.infinitied > 2e6) giveAchievement("2 Million Infinities")
}

function checkMatterAMNDReqAchieve(){
	if (player.money.gte("9.9999e9999")) giveAchievement("This achievement doesn't exist")
	if (player.money.gte("1e35000")) giveAchievement("I got a few to spare")
	if (player.money >= 1e80) giveAchievement("Antimatter Apocalypse")
	if (player.seventhAmount > 1e12) giveAchievement("Multidimensional");
	if ((player.matter.gte(2.586e15) && player.currentChallenge == "postc6") || player.matter.gte(Number.MAX_VALUE)) giveAchievement("It's not called matter dimensions is it?")
	if (dilates(player.firstPow, 2) >= 10e30) giveAchievement("I forgot to nerf that")
}

function checkInfPowerReqAchieve(){
	if (player.infinityPower.gt(1)) giveAchievement("A new beginning.");
	if (player.infinityPower.gt(1e6)) giveAchievement("1 million is a lot"); 
	if (player.infinityPower.gt(1e260)) giveAchievement("Minute of infinity"); 
}

function checkTickspeedReqAchieve(){
	if (player.tickspeed.lt(1e-26)) giveAchievement("Faster than a potato");
	if (player.tickspeed.lt(1e-55)) giveAchievement("Faster than a squared potato");
	if (player.tickspeed.e < -8296262) giveAchievement("Faster than a potato^286078")
	if (player.totalTickGained >= 308) giveAchievement("Infinite time");
	if (player.totalTickGained>=1e6) giveAchievement("GAS GAS GAS")
}

function checkOtherPreNGp3Achieve(){
	var ableToGetRid2 = player.timestudy.studies.length < 1 && player.dilation.active 
	if (tmp.ngp3) for (id=0;id<player.masterystudies.length;id++) {
		if (player.masterystudies[id].split("t")[1]) ableToGetRid2 = false
	}
	if (player.why >= 1e6) giveAchievement("Should we tell them about buy max...")
	if (player.exdilation !== undefined) {
		let ableToGetRid3 = ableToGetRid2 && player.dilation.upgrades.length === 0 && player.dilation.rebuyables[1] === 0 && player.dilation.rebuyables[2] === 0 && player.dilation.rebuyables[3] === 0
		if (player.blackhole.power.gt(0)) giveAchievement("A newer beginning.")
		if (player.blackhole.power.gt(1e6)) giveAchievement("1 million is still a lot")
		if (player.exdilation.unspent.gt(1e5)) giveAchievement("Finally I'm out of that channel");
		if (ableToGetRid2 && player.infinityPoints.e >= 20000) giveAchievement("I already got rid of you.")
	}
	checkUniversalHarmony()
	if (infchallengeTimes < 7.5) giveAchievement("Never again")
	if (player.totalTimePlayed >= 10 * 60 * 60 * 24 * 8) giveAchievement("One for each dimension")
	if (Math.random() < 0.00001) giveAchievement("Do you feel lucky? Well do ya punk?")
}

function ngP3AchieveCheck(){
	let checkEmpty = player.timestudy.studies.length < 1
	if (tmp.ngp3) for (id=0;id<player.masterystudies.length;id++) {
		if (player.masterystudies[id].split("t")[1]) checkEmpty = false
	}
	let ableToGetRid2 = checkEmpty && player.dilation.active
	let ableToGetRid3 = ableToGetRid2 && tmp.qu.electrons.amount == 0	
	let ableToGetRid4 = ableToGetRid2 && inQC(2)
	let ableToGetRid5 = ableToGetRid4 && player.dontWant
	let ableToGetRid6 = ableToGetRid2 && inQC(6) && inQC(8)
	let noTree = false
	let minUQ = getMinimumUnstableQuarks()
	for (var u = 1; u < 9; u++) {
		if (tmp.qu.tod.upgrades[u]) break
		else noTree = true
	}
	if (player.meta.antimatter.gte(Number.MAX_VALUE)) giveAchievement("I don't have enough fuel!")
	if (player.galaxies > 899 && !player.dilation.studies.includes(1)) giveAchievement("No more tax fraud!")
	if (player.money.gte(getOldAgeRequirement())) giveAchievement("Old age")
	if (player.infinityPoints.log10() >= 4e5 && ableToGetRid3) giveAchievement("I already got rid of you...")
	if (player.meta.resets == 8) if (player.meta.antimatter.e >= 1500) giveAchievement("We are not going squared.")
	if (player.eightBought >= 4e6 && getTotalRG() + player.dilation.freeGalaxies<1) giveAchievement("Intergalactic")
	if (player.old && player.meta.antimatter.e>1699) giveAchievement("Old memories come true")
	if (player.infinityPoints.e >= 3.54e5 && ableToGetRid4) giveAchievement("Seriously, I already got rid of you.")
	if (player.meta.antimatter.e > 332 && player.meta[2].amount.eq(0) && player.meta.resets == 0) giveAchievement("ERROR 500: INTERNAL DIMENSION ERROR")
	if (player.money.e >= 7.88e13 && tmp.qu.pairedChallenges.completed == 0) giveAchievement("The truth of anti-challenged")
	if (player.money.e >= 6.2e11 && player.currentEternityChall == "eterc11") giveAchievement("I can’t get my multipliers higher!")
	if (player.replicanti.amount.e >= 2e6 && player.dilation.tachyonParticles.eq(0)) giveAchievement("No dilation means no production.")
	if (player.infinityPoints.gte(Decimal.pow(Number.MAX_VALUE, 1000)) && ableToGetRid5) giveAchievement("I don't want you to live anymore.")
	if (player.dilation.dilatedTime.e > 410 && tmp.qu.notrelative) giveAchievement("Time is not relative")
	if (!player.achievements.includes("ng3p42")) {
		for (d = 2; d < 9; d++) {
			if (player[TIER_NAMES[d]+"Amount"].gt(0) || player["infinityDimension"+d].amount.gt(0) || player["timeDimension"+d].amount.gt(0) || player.meta[d].amount.gt(0)) break
			else if (player.money.e > 1.6e12 && d > 7) giveAchievement("ERROR 404: DIMENSIONS NOT FOUND")
		}
	}
	if (player.money.e >= 8e6 && inQC(6) && inQC(8)) giveAchievement("Impossible expectations")
	if (player.timestudy.theorem > 1.1e7 && tmp.qu.wasted) giveAchievement("Studies are wasted")
	if (tmp.qu.replicants.requirement.gte("1e12500000")) giveAchievement("Stop blocking me!")
	if (player.infinityPoints.gte(Decimal.pow(10, 2.75e5)) && ableToGetRid6) giveAchievement("Are you currently dying?")
	if (tmp.qu.nanofield.rewards > 20 && noTree) giveAchievement("But I don't want to grind!")
	if (player.replicanti.amount.e >= (player.aarexModifications.ngudpV ? 268435456 : 36e6)) giveAchievement("Will it be enough?")
	if (tmp.qu.bigRip.active) {
		let ableToGetRid7 = ableToGetRid2 && player.epmult.eq(1)
		let ableToGetRid8 = ableToGetRid7 && !tmp.qu.breakEternity.did
		let ableToGetRid9 = ableToGetRid8 && noTree
		let ableToGetRid10 = ableToGetRid9 && inQCModifier("ad")
		if (player.currentEternityChall == "eterc7" && player.galaxies == 1 && player.money.e >= 8e7) giveAchievement("Time Immunity")
		if (!player.timestudy.studies.includes(11) && player.timeShards.e > 214) giveAchievement("You're not really smart.")
		if (ableToGetRid7 && player.infinityPoints.e >= 3.5e5) giveAchievement("And so your life?")
		if (tmp.qu.breakEternity.eternalMatter.gte(9.999999e99)) giveAchievement("This achievement doesn't exist 4")
		if (ableToGetRid8 && player.infinityPoints.e >= 9.5e5) giveAchievement("Please answer me why you are dying.")
		if (ableToGetRid9 && player.infinityPoints.e >= 1.8e6) giveAchievement("Aren't you already dead?")
		if (ableToGetRid10 && player.infinityPoints.e >= 2.25e4) giveAchievement("I give up.")
	}
	if (tmp.qu.bigRip.spaceShards.e>32&&!tmp.qu.breakEternity.did) giveAchievement("Finite Time")
	if (minUQ.quarks.e>=1e12&&minUQ.decays>=2&&!tmp.qu.bigRip.times) giveAchievement("Weak Decay")		
	if (nG(getInfinitied(), Number.MAX_VALUE)) giveAchievement("Meta-Infinity confirmed?")
	if (nG(getEternitied(), Number.MAX_VALUE)) giveAchievement("Everlasting Eternities")
	if (player.options.secrets && player.options.secrets.ghostlyNews && !player.options.newsHidden) giveAchievement("Two tickers")
	
	if (tmp.ngp3l) return 
	if (player.ghostify.another && tmp.qu.quarks.gte(1/0)) giveAchievement("Is these another...")
	if (player.ghostify.reference && minUQ.decays >= 2) giveAchievement("... reference to EC8?")
	if (player.ghostify.hb.bosonicSemipowerment && player.ghostify.ghostlyPhotons.lights[7] >= tmp.leReq / 2) giveAchievement("Bosonic Semipowerment")
	if (player.ghostify.times >= Math.pow(Number.MAX_VALUE, 1/4)) giveAchievement("The Ghostliest Side")
	if (player.money.e >= 1e18) giveAchievement("Meta-Quintillion")
	branches = ['r','g','b']
	twoDecays = true
	for (i = 0; i < 3; i++){
		if (!player.quantum.tod[branches[i]].decays) {
			twoDecays = false
			break
		}
		if (player.quantum.tod[branches[i]].decays < 2) twoDecays = false	
	}
	if (player.unstableThisGhostify) if (player.unstableThisGhostify <= 10 && twoDecays) giveAchievement("... references to EC8?")
	if (player.quantum.quarks.log10() >= 66666) giveAchievement("Are these another...")
}

function ALLACHIEVECHECK(){
	//PRE NG+3 ACHIEVEMENTS ONLY!!!
	checkIPReqAchieve() //IP Req
	checkEPReqAchieve() //EP Req
	checkReplicantiBasedReqAchieve() //Replicanti based Req
	checkResetCountReqAchieve() //Reset Count Req
	checkMatterAMNDReqAchieve() //AM/ND/Matter Req
	checkInfPowerReqAchieve() //IPo Req
	checkTickspeedReqAchieve() //Tickspeed/tick upgs based
	checkOtherPreNGp3Achieve() //Other
	
	if (tmp.ngp3) ngP3AchieveCheck()
}
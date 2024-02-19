function cantHoldInfinitiesCheck(){
	if (getDimensionFinalMultiplier(1).gte(E("1e308")) &&
	getDimensionFinalMultiplier(2).gte(E("1e308")) &&
	getDimensionFinalMultiplier(3).gte(E("1e308")) &&
	getDimensionFinalMultiplier(4).gte(E("1e308")) &&
	getDimensionFinalMultiplier(5).gte(E("1e308")) &&
	getDimensionFinalMultiplier(6).gte(E("1e308")) &&
	getDimensionFinalMultiplier(7).gte(E("1e308")) &&
	getDimensionFinalMultiplier(8).gte(E("1e308"))) giveAchievement("Can't hold all these infinities")
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

function bendTimeCheck(){
	if (tmp.gal.ts < 0.001) giveAchievement("Do you even bend time bro?")
}

function checkMarathon(){
	if (getDimensionProductionPerSecond(1).gt(player.money) && !hasAch("r44")) {
		Marathon += player.options.updateRate/1000;
		if (Marathon >= 30) giveAchievement("Over in 30 seconds");
	} else {
		Marathon = 0;
	}
}

function checkMarathon2(){
	if (DimensionProduction(1).gt(player.infinityPower) && player.currentEternityChall != "eterc7" && !hasAch("r113")) {
		Marathon2+=player.options.updateRate/1000;
		if (Marathon2 >= 60) giveAchievement("Long lasting relationship");
	} else {
		Marathon2 = 0;
	}
}

function checkPain(){
	if (player.eternities >= 1 && (player.options.notation == "Standard" || player.options.notation == "Emojis" || player.options.notation == "Brackets")) {
		painTimer += player.options.updateRate/1000;
		if (painTimer >= 600) giveAchievement("Do you enjoy pain?");
	}
}

function checkForEndMe() {
	var temp = 0
	for (var i=0; i<getTotalNormalChallenges(); i++) temp += player.challengeTimes[i]
	if (temp <= 1800) giveAchievement("Not-so-challenging")
	if (temp <= 50) giveAchievement("End me")

	var temp2 = 0
	for (var i = 0; i < order.length; i++) temp2 += player.infchallengeTimes[i]
	infchallengeTimes = temp2
	if (temp2 <= 66.6) giveAchievement("Yes. This is hell.")
}

function checkYoDawg(){
	if (!hasAch("r111") && player.lastTenRuns[9][1].neq(0)) {
		var n = 0;
		for (i = 0; i < 9; i++) {
			if (player.lastTenRuns[i][1].gte(player.lastTenRuns[i+1][1].mul(Number.MAX_VALUE))) n++
		}
		if (n == 9) giveAchievement("Yo dawg, I heard you liked infinities...")
	}
}

function checkUniversalHarmony() {
	if (hasAch("ngpp18")) return
	if (mod.ngpp) {
		if (player.galaxies < 700 || getTotalRG() < 700 || player.dilation.freeGalaxies < 700) return
	} else if (mod.ngud) {
		if (player.galaxies != player.replicanti.galaxies || player.galaxies != player.dilation.freeGalaxies || player.galaxies < 300) return
	} else return
	giveAchievement("Universal harmony")
}

function checkEPReqAchieve(){
	if (player.eternityPoints.gte(Number.MAX_VALUE)) giveAchievement("But I wanted another prestige layer...")
	if (player.eternityPoints.gte("1e40000")) giveAchievement("In the grim darkness of the far endgame")
	if (player.eternityPoints.gte("9e99999999")) giveAchievement("This achievement doesn't exist 3")
}

function checkIPReqAchieve(){
	var checkEmpty = player.timestudy.studies.length < 1
	if (mod.ngp3) for (id=0;id<player.masterystudies.length;id++) {
		if (player.masterystudies[id].split("t")[1]) checkEmpty = false
	}
	var ableToGetRid2 = checkEmpty && player.dilation.active 
	
	if (player.infinityPoints.gte(E("1e22000")) && checkEmpty) giveAchievement("What do I have to do to get rid of you")
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
		player.infinityPoints.gt(E("1e140000"))) giveAchievement("I never liked this infinity stuff anyway")
	if (ableToGetRid2 && player.infinityPoints.log10() >= 20000) giveAchievement("This is what I have to do to get rid of you.")
}

function checkReplicantiBasedReqAchieve(){
	if (player.replicanti.amount.gte(Number.MAX_VALUE) && player.thisInfinityTime < 600*30) giveAchievement("Is this safe?");
	if (player.replicanti.galaxies >= 10 && player.thisInfinityTime < 150) giveAchievement("The swarm");
	if (player.replicanti.galaxies >= 180 * player.galaxies && player.galaxies >= 1) giveAchievement("Popular music")
	if (player.replicanti.amount.gt(E("1e20000"))) giveAchievement("When will it be enough?")
	if (mod.rs && player.replicanti.amount.gt("1e1000000")) giveAchievement("Do you really need a guide for this?");
	if (player.replicanti.amount.gt(E("1e100000"))) giveAchievement("It will never be enough")
}

function checkResetCountReqAchieve(){
	if (getEternitied() >= 1e12) giveAchievement("The cap is a million, not a trillion")
	if (player.infinitied >= 2e6) giveAchievement("2 Million Infinities")
}

function checkMatterAMNDReqAchieve(){
	if (player.money.gte("9.9999e9999")) giveAchievement("This achievement doesn't exist")
	if (player.money.gte("1e35000")) giveAchievement("I got a few to spare")
	if (player.money.gt(pow10(80))) giveAchievement("Antimatter Apocalypse")
	if (player.money.gt(pow10(63))) giveAchievement("Supersanic");
	if (player.seventhAmount.gt(pow10(12))) giveAchievement("Multidimensional");
	if ((player.matter.gte(2.586e15) && player.currentChallenge == "postc6") || player.matter.gte(Number.MAX_VALUE)) giveAchievement("It's not called matter dimensions is it?")
	if (getDimensionFinalMultiplier(1).gt(1e31)) giveAchievement("I forgot to nerf that")
}

function checkInfPowerReqAchieve(){
	if (player.infinityPower.gt(1)) giveAchievement("A new beginning.");
	if (player.infinityPower.gt(1e6)) giveAchievement("1 million is a lot"); 
	if (player.infinityPower.gt(1e260)) giveAchievement("4.3333 minutes of Infinity"); 
}

function checkTickspeedReqAchieve(){
	let tickspeed = inNGM(2) ? player.postC3Reward.pow(-1).mul(1e3) : player.tickspeed
	if (tickspeed.lt(1e-26)) giveAchievement("Faster than a potato");
	if (tickspeed.lt(1e-55)) giveAchievement("Faster than a squared potato");
	if (tickspeed.log10() < -8296262) giveAchievement("Faster than a potato^286078")
	if (player.totalTickGained >= 308) giveAchievement("Infinite time");
	if (player.totalTickGained>=1e6) giveAchievement("GAS GAS GAS")
}

function newDimension() {
	var req = getNewInfReq()
	if (player.money.lt(req.money)) return
	player.infDimensionsUnlocked[req.tier-1] = true
	if (req.tier == 4) giveAchievement("NEW DIMENSIONS???")
	if (req.tier == 8) giveAchievement("0 degrees from infinity")
}

function checkOtherPreNGp3Achieve(){
	var ableToGetRid2 = player.timestudy.studies.length < 1 && player.dilation.active 
	if (mod.ngp3) for (id = 0; id < player.masterystudies.length; id++) {
		if (player.masterystudies[id].split("t")[1]) ableToGetRid2 = false
	}
	if (player.why >= 1e6) giveAchievement("Should we tell them about buy max...")
	if (mod.ngud) {
		let ableToGetRid3 = ableToGetRid2 && player.dilation.upgrades.length === 0 && player.dilation.rebuyables[1] === 0 && player.dilation.rebuyables[2] === 0 && player.dilation.rebuyables[3] === 0
		if (player.blackhole.power.gt(0)) giveAchievement("A newer beginning.")
		if (player.blackhole.power.gt(1e6)) giveAchievement("1 million is still a lot")
		if (player.exdilation.unspent.gt(1e5)) giveAchievement("Finally I'm out of that channel");
		if (ableToGetRid2 && player.infinityPoints.log10() >= 20000) giveAchievement("I already got rid of you.")
	}
	if (mod.ngpp && hasDilStudy(6)) giveAchievement("I'm so meta")
	checkUniversalHarmony()
	if (infchallengeTimes < 7.5) giveAchievement("Never again")
	if (player.totalTimePlayed >= 10 * 60 * 60 * 24 * 8) giveAchievement("One for each dimension")
	if (Math.random() < 0.00001) giveAchievement("Do you feel lucky? Well do ya punk?")
	
	// need to know if we should really decide to move these into separate functions
	if (player.galaxies >= 50) giveAchievement("YOU CAN GET 50 GALAXIES!??")
	if (player.galaxies >= 2) giveAchievement("Double Galaxy");
	if (player.galaxies >= 1) giveAchievement("You got past The Big Wall");
	if (player.galaxies >= 540 && player.replicanti.galaxies == 0) giveAchievement("Unique snowflakes")
	if (player.dilation.active) giveAchievement("I told you already, time is relative")
	if (player.resets >= 10) giveAchievement("Boosting to the max")
	if (player.spreadingCancer >= 10) giveAchievement("Spreading Nerd")
	if (player.spreadingCancer >= 1000000) giveAchievement("Cancer = Spread")
	if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
	if (player.break) giveAchievement("Limit Break")
	if (mod.ngpp) if (player.meta.resets >= 10) giveAchievement("Meta-boosting to the max")
	if (tmp.sacPow >= 600) giveAchievement("The Gods are pleased");
	if (tmp.sacPow.gte(Number.MAX_VALUE)) giveAchievement("Yet another infinity reference")
	if (tmp.sacPow.gte(pow10(9000)) && !inNC(11)) giveAchievement("IT'S OVER 9000")
	if (tmp.ec_eff >= 50) giveAchievement("5 more eternities until the update")
	if (player.infinitiedBank >= 5000000000) giveAchievement("No ethical consumption");
	if (getEternitied() >= 100) giveAchievement("This mile took an Eternity")
	if (player.bestEternity < 300) giveAchievement("That wasn't an eternity");
	if (player.bestEternity <= 0.01) giveAchievement("Less than or equal to 0.001");
}

function getTwoDecaysBool(){
	branches = ['r', 'g', 'b']
	for (i = 0; i < 3; i++){
		if (!todSave[branches[i]].decays) return false
		if (todSave[branches[i]].decays < 2) return false	
	}
	return true
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
}

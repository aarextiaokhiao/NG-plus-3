function onQuantumAM(){
	let x = 10
	if (player.challenges.includes("challenge1")) x = 100
	if (player.aarexModifications.ngmX > 3) x = 200
	if (player.achievements.includes("r37")) x = 1000
	if (player.achievements.includes("r54")) x = 2e5
	if (player.achievements.includes("r55")) x = 1e10
	if (player.achievements.includes("r78")) x = 2e25
	return new Decimal(x)
}

function NC10NDCostsOnReset(){
	if (inNC(10) || player.currentChallenge == "postc1") {
		player.thirdCost = new Decimal(100)
		player.fourthCost = new Decimal(500)
		player.fifthCost = new Decimal(2500)
		player.sixthCost = new Decimal(2e4)
		player.seventhCost = new Decimal(2e5)
		player.eightCost = new Decimal(4e6)
	}
}

function replicantsResetOnQuantum(challid){
	tmp.qu.replicants.requirement = new Decimal("1e3000000")
	tmp.qu.replicants.quarks = (!(challid > 0) && player.achievements.includes("ng3p45") && !tmp.ngp3l) ? tmp.qu.replicants.quarks.pow(2/3) : new Decimal(0)
	tmp.qu.replicants.eggonProgress = new Decimal(0)
	tmp.qu.replicants.eggons = new Decimal(0)
	tmp.qu.replicants.babyProgress = new Decimal(0)
	tmp.qu.replicants.babies = new Decimal(0)
	tmp.qu.replicants.growupProgress = new Decimal(0)
	for (let d = 1; d <= 8; d++) {
		if (d == 8 || tmp.eds[d].perm < 10) tmp.qu.replicants.quantumFood += Math.round(tmp.eds[d].progress.toNumber() * 3) % 3
		if (d != 1 || (!player.achievements.includes("ng3p46") && !tmp.ngp3l) || challid > 0) {
			tmp.eds[d].workers = new Decimal(tmp.eds[d].perm)
			tmp.eds[d].progress = new Decimal(0)
		} else {
			tmp.eds[d].workers = tmp.eds[d].workers.pow(1/3)
			tmp.eds[d].progress = new Decimal(0)
		}
	}
}

function nanofieldResetOnQuantum(){
	tmp.qu.nanofield.charge = new Decimal(0)
	tmp.qu.nanofield.energy = new Decimal(0)
	tmp.qu.nanofield.antienergy = new Decimal(0)
	tmp.qu.nanofield.power = 0
	tmp.qu.nanofield.powerThreshold = new Decimal(50)
}

function doQuantumResetStuff(bigRip, challid){
	var headstart = player.aarexModifications.newGamePlusVersion > 0 && !tmp.ngp3
	var oheHeadstart = bigRip ? tmp.qu.bigRip.upgrades.includes(2) : speedrunMilestonesReached > 0
	var keepABnICs = oheHeadstart || bigRip || player.achievements.includes("ng3p51")
	var turnSomeOn = !bigRip || player.quantum.bigRip.upgrades.includes(1)
	var bigRipChanged = tmp.ngp3 && bigRip != player.quantum.bigRip.active
	player.money = new Decimal(10)
	player.tickSpeedCost = new Decimal(1000)
	player.tickspeed = new Decimal(player.aarexModifications.newGameExpVersion ? 500 : 1000)
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	completelyResetNormalDimensions()
	player.sacrificed = new Decimal(0)
	player.challenges = keepABnICs ? player.challenges : []
	player.currentChallenge = ""
	player.infinitied = 0
	player.infinitiedBank = headstart || player.achievements.includes("ng3p15") ? player.infinitiedBank : 0
	player.bestInfinityTime = 9999999999
	player.thisInfinityTime = 0
	player.resets = keepABnICs ? 4 : 0
	player.tdBoosts = resetTDBoosts()
	player.tickspeedBoosts = player.tickspeedBoosts !== undefined ? (keepABnICs ? 16 : 0) : undefined
	player.galaxies = keepABnICs ? 1 : 0
	player.galacticSacrifice = resetGalacticSacrifice()
	player.interval = null
	player.autobuyers = keepABnICs ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	player.partInfinityPoint = 0
	player.partInfinitied = 0
	player.break = keepABnICs ? player.break : false
	player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
	player.tickspeedMultiplier = new Decimal(10)
	player.chall2Pow = 1
	player.chall3Pow = new Decimal(0.01)
	player.matter = new Decimal(0)
	player.chall11Pow = new Decimal(1)
	player.lastTenRuns = [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]]
	player.lastTenEternities = [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]]
	player.infMult = new Decimal(1)
	player.infMultCost = new Decimal(10)
	player.tickSpeedMultDecrease = keepABnICs ? player.tickSpeedMultDecrease : GUBought("gb4") ? 1.25 : 10
	player.tickSpeedMultDecreaseCost = keepABnICs ? player.tickSpeedMultDecreaseCost : 3e6
	player.dimensionMultDecrease = keepABnICs ? player.dimensionMultDecrease : 10
	player.dimensionMultDecreaseCost = keepABnICs ? player.dimensionMultDecreaseCost : 1e8
	player.extraDimPowerIncrease = keepABnICs ? player.extraDimPowerIncrease : 0
	player.dimPowerIncreaseCost = keepABnICs ? player.dimPowerIncreaseCost : 1e3
	player.postC4Tier = 1
	player.postC8Mult = new Decimal(1)
	player.overXGalaxies = keepABnICs ? player.overXGalaxies : 0
	player.overXGalaxiesTickspeedBoost = keepABnICs || player.tickspeedBoosts == undefined ? player.overXGalaxiesTickspeedBoost : 0
	player.postChallUnlocked = player.achievements.includes("r133") || bigRip ? order.length : 0
	player.postC4Tier = 0
	player.postC3Reward = new Decimal(1)
	player.eternityPoints = new Decimal(0)
	player.eternities = headstart ? player.eternities : bigRip ? (tmp.qu.bigRip.upgrades.includes(2) ? 1e5 : 0) : speedrunMilestonesReached > 17 ? 1e13 : oheHeadstart ? 2e4 : player.achievements.includes("ng3p12") ? Math.max(Math.floor(720*3600*10/player.quantum.best),10000) : 0
	player.eternitiesBank = tmp.ngp3 ? nA(player.eternitiesBank, bankedEterGain) : undefined
	player.thisEternity = 0
	player.bestEternity = headstart ? player.bestEternity : 9999999999
	player.eternityUpgrades = isRewardEnabled(3) && (!bigRip || player.quantum.bigRip.upgrades.includes(12)) ? [1,2,3,4,5,6] : []
	player.epmult = new Decimal(1)
	player.epmultCost = new Decimal(500)
	player.infDimensionsUnlocked = resetInfDimUnlocked()
	player.infinityPower = new Decimal(1)
	completelyResetInfinityDimensions()
	player.infDimBuyers = bigRipChanged ? [turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn] : oheHeadstart ? player.infDimBuyers : [false, false, false, false, false, false, false, false]
	player.timeShards = new Decimal(0)
	player.tickThreshold = new Decimal(1)
	player.totalTickGained = 0
	completelyResetTimeDimensions()
	player.offlineProd = keepABnICs ? player.offlineProd : 0
	player.offlineProdCost = keepABnICs ? player.offlineProdCost : 1e7
	player.challengeTarget = 0
	player.autoSacrifice = keepABnICs || player.achievements.includes("r133") ? player.autoSacrifice : 1
	player.replicanti = {
		amount: new Decimal(oheHeadstart ? 1 : 0),
		unl: oheHeadstart,
		chance: 0.01,
		chanceCost: new Decimal(player.galacticSacrifice !== undefined ? 1e90 : 1e150),
		interval: 1000,
		intervalCost: new Decimal(player.galacticSacrifice !== undefined ? 1e80 : 1e140),
		gal: 0,
		galaxies: 0,
		galCost: new Decimal(player.galacticSacrifice!=undefined?1e110:1e170),
		galaxybuyer: bigRipChanged ? turnSomeOn : oheHeadstart ? player.replicanti.galaxybuyer : undefined,
		auto: bigRipChanged ? [turnSomeOn, turnSomeOn, turnSomeOn] : oheHeadstart ? player.replicanti.auto : [false, false, false]
	}
	player.timestudy = isRewardEnabled(11) && (!bigRip || tmp.qu.bigRip.upgrades.includes(12)) ? player.timestudy : {
		theorem: 0,
		amcost: new Decimal("1e20000"),
		ipcost: new Decimal(1),
		epcost: new Decimal(1),
		studies: [],
	}
	player.eternityChalls = {}
	player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
	player.currentEternityChall = ""
	player.eternityChallUnlocked = isRewardEnabled(11) ? player.eternityChallUnlocked : 0
	player.etercreq = 0
	player.autoIP = new Decimal(0)
	player.autoTime = 1e300
	player.infMultBuyer = bigRipChanged ? turnSomeOn : oheHeadstart ? player.infMultBuyer : false
	player.autoCrunchMode = keepABnICs ? player.autoCrunchMode : "amount"
	player.autoEterMode = keepABnICs ? player.autoEterMode : "amount"
	player.peakSpent = tmp.ngp3 ? 0 : undefined
	player.respec = false
	player.respecMastery = tmp.ngp3 ? false : undefined
	player.eternityBuyer = keepABnICs ? player.eternityBuyer : {
		limit: new Decimal(0),
		isOn: false
	}
	player.eterc8ids = 50
	player.eterc8repl = 40
	player.dimlife = true
	player.dead = true
	if (!player.dilation.bestTP) player.dilation.bestTP = player.dilation.tachyonParticles
	player.dilation = {
		studies: bigRip ? (tmp.qu.bigRip.upgrades.includes(12) ? [1,2,3,4,5,6] : tmp.qu.bigRip.upgrades.includes(10) ? [1] : []) : isRewardEnabled(4) ? (speedrunMilestonesReached > 5 ? [1,2,3,4,5,6] : [1]) : [],
		active: false,
		tachyonParticles: (((player.achievements.includes("ng3p37") && (!bigRip || tmp.qu.bigRip.upgrades.includes(11))) || player.achievements.includes("ng3p71")) && !inQCModifier("ad")) ? player.dilation.bestTP.pow((player.ghostify.milestones > 15 && (!bigRip || player.achievements.includes("ng3p71"))) || (!challid && player.ghostify.milestones > 3) ? 1 : 0.5) : new Decimal(0),
		dilatedTime: new Decimal(speedrunMilestonesReached > 21 && isRewardEnabled(4) && !inQCModifier("ad") && !bigRip ? 1e100 : 0),
		bestTP: Decimal.max(player.dilation.bestTP || 0, player.dilation.tachyonParticles),
		bestTPOverGhostifies: player.dilation.bestTPOverGhostifies,
		nextThreshold: new Decimal(1000),
		freeGalaxies: 0,
		upgrades: speedrunMilestonesReached > 5 && isRewardEnabled(4) && (!bigRip || tmp.qu.bigRip.upgrades.includes(12)) ? [4,5,6,7,8,9,"ngpp1","ngpp2"] : [],
		autoUpgrades: [],
		rebuyables: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
		}
	}
	player.exdilation = player.exdilation != undefined ? {
		unspent: new Decimal(0),
		spent: {
			1: new Decimal(0),
			2: new Decimal(0),
			3: new Decimal(0),
			4: new Decimal(0)
		},
		times: 0
	}: player.exdilation
	player.blackhole = player.exdilation != undefined ? {
		unl: speedrunMilestonesReached > 4,
		upgrades: {dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0},
		power: new Decimal(0)
	}: player.blackhole
	doMetaDimensionsReset(bigRip, headstart, challid)
	player.masterystudies = tmp.ngp3 ? (bigRip && !tmp.qu.bigRip.upgrades.includes(12) ? ["d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14"] : speedrunMilestonesReached > 15 && isRewardEnabled(11) ? player.masterystudies : []) : undefined
	player.old = tmp.ngp3 ? inQC(0) : undefined
	player.dontWant = tmp.ngp3 || undefined
}
		
function doMetaDimensionsReset(bigRip, headstart, challid){
	player.meta = {
		antimatter: getMetaAntimatterStart(bigRip),
		bestAntimatter: headstart ? player.meta.bestAntimatter : getMetaAntimatterStart(bigRip),
		bestOverQuantums: player.meta.bestOverQuantums,
		bestOverGhostifies: player.meta.bestOverGhostifies,
		resets: isRewardEnabled(27) ? (!challid && player.ghostify.milestones > 4 && bigRip == tmp.qu.bigRip.active ? player.meta.resets : 4) : 0,
		'1': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(10)
		},
		'2': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(100)
		},
		'3': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(1e4)
		},
		'4': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(1e6)
		},
		'5': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(1e9)
		},
		'6': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(1e13)
		},
		'7': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(1e18)
		},
		'8': {
			amount: new Decimal(0),
			bought: 0,
			cost: new Decimal(1e24)
		}
	}
}

function doGalaxyResetStuff(bulk){
	player.money = player.achievements.includes("r111") ? player.money : new Decimal(10)
	player.tickSpeedCost = new Decimal(1000)
	player.tickBoughtThisInf = updateTBTIonGalaxy()
	completelyResetNormalDimensions()
	player.sacrificed = new Decimal(0)
	player.totalBoughtDims = resetTotalBought()
	player.resets = player.achievements.includes("ng3p55") ? player.resets : 0
	player.interval = null
	player.tdBoosts = resetTDBoosts()
	player.galaxies = player.galaxies + bulk
	player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
	player.tickspeedMultiplier = new Decimal(10)
	player.chall3Pow = new Decimal(0.01)
	player.matter = new Decimal(0)
	player.chall11Pow = new Decimal(1)
	player.postC4Tier = 1
	player.postC8Mult = new Decimal(1)
}


function doNormalChallengeResetStuff(){
	player.money = new Decimal(10)
	player.tickSpeedCost = new Decimal(1000)
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	completelyResetNormalDimensions()
	player.totalBoughtDims = resetTotalBought()
	player.sacrificed = new Decimal(0)
	player.thisInfinityTime = 0
	player.resets = 0
	player.galaxies = 0
	player.interval = null
	player.galacticSacrifice = newGalacticDataOnInfinity()
	player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
	player.tickspeedMultiplier= new Decimal(10)
	player.chall2Pow = 1
	player.chall3Pow = new Decimal(0.01)
	player.matter = new Decimal(0)
	player.chall11Pow = new Decimal(1)
	player.postC4Tier = 1
	player.postC8Mult = new Decimal(1)
}
			
function completelyResetTimeDimensions(){
	player.timeDimension1 = {
		cost: new Decimal(1),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension2 = {
		cost: new Decimal(5),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension3 = {
		cost: new Decimal(100),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension4 = {
		cost: new Decimal(1000),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension5 = {
		cost: new Decimal("1e2350"),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension6 = {
		cost: new Decimal("1e2650"),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension7 = {
		cost: new Decimal("1e3000"),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
	player.timeDimension8 = {
		cost: timeDimCost(8,0),
		amount: new Decimal(0),
		power: new Decimal(1),
		bought: 0
	}
}

function completelyResetInfinityDimensions(){
	player.infinityDimension1 = {
		cost: new Decimal(1e8),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension2 = {
		cost: new Decimal(1e9),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension3 = {
		cost: new Decimal(1e10),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension4 = {
		cost: new Decimal(1e20),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension5 = {
		cost: new Decimal(1e140),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension6 = {
		cost: new Decimal(1e200),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension7 = {
		cost: new Decimal(1e250),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
	player.infinityDimension8 = {
		cost: new Decimal(1e280),
		amount: new Decimal(0),
		bought: 0,
		power: new Decimal(1),
		baseAmount: 0
	}
}

function completelyResetNormalDimensions(){
	player.firstCost = new Decimal(10)
	player.secondCost = new Decimal(100)
	player.thirdCost = new Decimal(10000)
	player.fourthCost = new Decimal(1000000)
	player.fifthCost = new Decimal(1e9)
	player.sixthCost = new Decimal(1e13)
	player.seventhCost = new Decimal(1e18)
	player.eightCost = new Decimal(1e24)
	player.firstAmount = new Decimal(0)
	player.secondAmount = new Decimal(0)
	player.thirdAmount = new Decimal(0)
	player.fourthAmount = new Decimal(0)
	player.firstBought = 0
	player.secondBought = 0
	player.thirdBought = 0
	player.fourthBought = 0
	player.fifthAmount = new Decimal(0)
	player.sixthAmount = new Decimal(0)
	player.seventhAmount = new Decimal(0)
	player.eightAmount = new Decimal(0)
	player.fifthBought = 0
	player.sixthBought = 0
	player.seventhBought = 0
	player.eightBought = 0
}

function checkOnCrunchAchievements(){
	if (player.thisInfinityTime <= 72000) giveAchievement("That's fast!");
	if (player.thisInfinityTime <= 6000) giveAchievement("That's faster!")
	if (player.thisInfinityTime <= 600) giveAchievement("Forever isn't that long")
	if (player.thisInfinityTime <= 2) giveAchievement("Blink of an eye")
	if (player.eightAmount == 0) giveAchievement("You didn't need it anyway");
	if (player.galaxies == 1) giveAchievement("Claustrophobic");
	if (player.galaxies == 0 && player.resets == 0) giveAchievement("Zero Deaths")
	if (inNC(2) && player.thisInfinityTime <= 1800) giveAchievement("Many Deaths")
	if (inNC(11) && player.thisInfinityTime <= 1800) giveAchievement("Gift from the Gods")
	if (inNC(5) && player.thisInfinityTime <= 1800) giveAchievement("Is this hell?")
	if (inNC(3) && player.thisInfinityTime <= 100) giveAchievement("You did this again just for the achievement right?");
	if (player.firstAmount == 1 && player.resets == 0 && player.galaxies == 0 && inNC(12)) giveAchievement("ERROR 909: Dimension not found")
	if (gainedInfinityPoints().gte(1e150)) giveAchievement("All your IP are belong to us")
	if (gainedInfinityPoints().gte(1e200) && player.thisInfinityTime <= 20) giveAchievement("Ludicrous Speed")
	if (gainedInfinityPoints().gte(1e250) && player.thisInfinityTime <= 200) giveAchievement("I brake for nobody")
}

function checkSecondSetOnCrunchAchievements(){
	checkForEndMe()
	giveAchievement("To infinity!");
	if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	if (player.bestInfinityTime <= 0.01) giveAchievement("Less than or equal to 0.001");
	if (player.challenges.length >= 2) giveAchievement("Daredevil")
	if (player.challenges.length >= getTotalNormalChallenges() + 1) giveAchievement("AntiChallenged")
	if (player.challenges.length >= getTotalNormalChallenges() + order.length + 1) giveAchievement("Anti-antichallenged")
}

function doCrunchResetStuff(){
	player.galacticSacrifice = newGalacticDataOnInfinity()
	player.money = new Decimal(10)
	player.tickSpeedCost = new Decimal(1000)
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	completelyResetNormalDimensions()
	player.totalBoughtDims = resetTotalBought()
	player.sacrificed = new Decimal(0)
	player.bestInfinityTime = (player.currentEternityChall !== "eterc12") ? Math.min(player.bestInfinityTime, player.thisInfinityTime) : player.bestInfinityTime
	player.thisInfinityTime = 0
	player.resets = 0
	player.interval = null
	player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
	player.tickspeedMultiplier = new Decimal(10)
	player.chall2Pow = 1
	player.chall3Pow = new Decimal(0.01)
	player.matter = new Decimal(0)
	player.chall11Pow = new Decimal(1)
	player.postC4Tier = 1
	player.postC8Mult = new Decimal(1)
	player.galaxies = 0
}

function doEternityResetStuff(){
	player.money = new Decimal(10)
	player.tickSpeedCost = new Decimal(1000)
	player.tickspeed = new Decimal(player.aarexModifications.newGameExpVersion?500:1000)
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	completelyResetNormalDimensions()
	player.infinitied = 0
	player.totalBoughtDims = resetTotalBought()
	player.sacrificed = new Decimal(0)
	player.bestInfinityTime = 9999999999
	player.thisInfinityTime = 0
	player.resets = (getEternitied() > 3) ? 4 : 0
	player.challenges = challengesCompletedOnEternity()
	player.currentChallenge = ""
	player.galaxies = (getEternitied() > 3) ? 1 : 0
	player.galacticSacrifice = newGalacticDataOnInfinity(true)
	player.interval = null
	player.autobuyers = (getEternitied() > 1) ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	player.break = getEternitied() > 1 ? player.break : false
	player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
	player.partInfinityPoint = 0
	player.partInfinitied = 0    
	player.tickspeedMultiplier = new Decimal(10)
	player.chall2Pow = 1
	player.chall3Pow = new Decimal(0.01)
	player.matter = new Decimal(0)
	player.chall11Pow = new Decimal(1)
	player.lastTenRuns = [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]]
	player.infMult = new Decimal(1)
	player.infMultCost = new Decimal(10)
	player.tickSpeedMultDecrease = getEternitied() > 19 ? player.tickSpeedMultDecrease : 10
	player.tickSpeedMultDecreaseCost = getEternitied() > 19 ? player.tickSpeedMultDecreaseCost : 3e6
	player.dimensionMultDecrease = getEternitied() > 19 ? player.dimensionMultDecrease : 10
	player.dimensionMultDecreaseCost = getEternitied() > 19 ? player.dimensionMultDecreaseCost : 1e8
	player.extraDimPowerIncrease = getEternitied() > 19 ? player.extraDimPowerIncrease : 0
	player.dimPowerIncreaseCost = getEternitied() > 19 ? player.dimPowerIncreaseCost : 1e3    
	player.postChallUnlocked = player.achievements.includes("r133") ? order.length : 0
	player.postC4Tier = 1
	player.postC8Mult = new Decimal(1)
	player.infDimensionsUnlocked = resetInfDimUnlocked()
	player.infinityPower = new Decimal(1)
	completelyResetInfinityDimensions()
	player.timeShards = new Decimal(0)
	player.tickThreshold = new Decimal(1)
	player.totalTickGained = 0
	player.thisEternity = 0
	player.totalTickGained = 0
	player.offlineProd = getEternitied() > 19 ? player.offlineProd : 0
	player.offlineProdCost = getEternitied() > 19 ? player.offlineProdCost : 1e7
	player.challengeTarget = 0
	player.autoSacrifice = getEternitied() > 6 ? player.autoSacrifice : 1
	player.replicanti.amount = speedrunMilestonesReached > 23 ? player.replicanti.amount : new Decimal(getEternitied() > 49 ? 1 : 0)
	player.replicanti.unl = getEternitied() > 49
	player.replicanti.galaxies = 0
	player.replicanti.galaxybuyer = (getEternitied() > 2) ? player.replicanti.galaxybuyer : undefined
	player.autoIP = new Decimal(0)
	player.autoTime = 1e300
	player.peakSpent = tmp.ngp3 ? 0 : undefined
	player.eterc8ids = 50
	player.eterc8repl = 40
	player.dimlife = true
	player.dead = true
	player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
	player.currentEternityChall = ""
	player.quantum = tmp.qu
	player.dontWant = tmp.ngp3 ? true : undefined
}

function getReplicantsOnGhostifyData(){
	return {
		amount: new Decimal(0),
		requirement: new Decimal("1e3000000"),
		quarks: new Decimal(0),
		quantumFood: 0,
		quantumFoodCost: new Decimal(2e46),
		limit: 1,
		limitDim: 1,
		limitCost: new Decimal(1e49),
		eggonProgress: new Decimal(0),
		eggons: new Decimal(0),
		hatchSpeed: 20,
		hatchSpeedCost: new Decimal(1e49),
		babyProgress: new Decimal(0),
		babies: new Decimal(0),
		ageProgress: new Decimal(0)
	}
}

function getToDOnGhostifyData(){
	var bm = player.ghostify.milestones
	let ret = {
		r: {
			quarks: new Decimal(0),
			spin: new Decimal(bm > 13 ? 1e25 : 0),
			upgrades: {}
		},
		g: {
			quarks: new Decimal(0),
			spin: new Decimal(bm > 13 ? 1e25 : 0),
			upgrades: {}
		},
		b: {
			quarks: new Decimal(0),
			spin: new Decimal(bm > 13 ? 1e25 : 0),
			upgrades: {}
		},
		upgrades: {}
	}
	if (player.quantum.tod.b.decays && player.achievements.includes("ng3p86")) ret.b.decays = Math.floor(player.quantum.tod.b.decays * .75)
	if (player.quantum.tod.r.decays && player.achievements.includes("ng3p86")) ret.r.decays = Math.floor(player.quantum.tod.r.decays * .75)
	if (player.quantum.tod.g.decays && player.achievements.includes("ng3p86")) ret.g.decays = Math.floor(player.quantum.tod.g.decays * .75)
	return ret
}

function getBigRipOnGhostifyData(nBRU){
	var bm = player.ghostify.milestones
	return {
		active: false,
		conf: tmp.qu.bigRip.conf,
		times: 0,	
		bestThisRun: new Decimal(0),
		totalAntimatter: tmp.qu.bigRip.totalAntimatter,
		bestGals: tmp.qu.bigRip.bestGals,
		savedAutobuyersNoBR: tmp.qu.bigRip.savedAutobuyersNoBR,
		savedAutobuyersBR: tmp.qu.bigRip.savedAutobuyersBR,
		spaceShards: new Decimal(0),
		upgrades: bm ? nBRU : []
	}
}

function getBreakEternityDataOnGhostify(nBEU, bm){
	return {
		unlocked: bm > 14,
		break: bm > 14 ? tmp.qu.breakEternity.break : false,
		eternalMatter: new Decimal(0),
		upgrades: bm > 14 ? nBEU : [],
		epMultPower: 0
	}
}

function getQuantumOnGhostifyData(bm, nBRU, nBEU){
	return {
		reached: true,
		times: 0,
		time: 0,
		best: 9999999999,
		last10: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		autoEC: tmp.qu.autoEC,
		disabledRewards: tmp.qu.disabledRewards,
		metaAutobuyerWait: 0,
		autobuyer: {
			enabled: false,
			limit: new Decimal(0),
			mode: "amount",
			peakTime: 0
		},
		autoOptions: {
			assignQK: tmp.qu.autoOptions.assignQK,
			assignQKRotate: tmp.qu.autoOptions.assignQKRotate,
			sacrifice: bm ? tmp.qu.autoOptions.sacrifice : false,
			replicantiReset: tmp.qu.autoOptions.replicantiReset
		},
		assortPercentage: tmp.qu.assortPercentage,
		assignAllRatios: tmp.qu.assignAllRatios,
		quarks: new Decimal(0),
		usedQuarks: {
			r: new Decimal(0),
			g: new Decimal(0),
			b: new Decimal(0)
		},
		colorPowers: {
			r: new Decimal(0),
			g: new Decimal(0),
			b: new Decimal(0)
		},
		gluons: {
			rg: new Decimal(0),
			gb: new Decimal(0),
			br: new Decimal(0)
		},
		multPower: {
			rg: 0,
			gb: 0,
			br: 0,
			total: 0
		},
		electrons: {
			amount: 0,
			sacGals: 0,
			mult: bm > 2 ? tmp.qu.electrons.mult : bm ? 6 : 2,
			rebuyables: bm > 2 ? tmp.qu.electrons.rebuyables : [0,0,0,0]
		},
		challenge: [],
		challenges: {},
		nonMAGoalReached: tmp.qu.nonMAGoalReached,
		challengeRecords: {},
		pairedChallenges: {
			order: bm ? tmp.qu.pairedChallenges.order : {},
			current: 0,
			completed: bm ? 4 : 0,
			completions: tmp.qu.pairedChallenges.completions,
			fastest: tmp.qu.pairedChallenges.fastest,
			pc68best: tmp.qu.pairedChallenges.pc68best,
			respec: false
		},
		qcsNoDil: tmp.qu.qcsNoDil,
		qcsMods: tmp.qu.qcsMods,
		replicants: getReplicantsOnGhostifyData(),
		emperorDimensions: {},
		nanofield: {
			charge: new Decimal(0),
			energy: new Decimal(0),
			antienergy: new Decimal(0),
			power: 0,
			powerThreshold: new Decimal(50),
			rewards: bm>12?16:0,
			producingCharge: false,
			apgWoke: tmp.qu.nanofield.apgWoke
		},
		reachedInfQK: bm,
		tod: getToDOnGhostifyData(),
		bigRip: getBigRipOnGhostifyData(nBRU),
		breakEternity: getBreakEternityDataOnGhostify(nBEU, bm),
		notrelative: true,
		wasted: true,
		producedGluons: 0,
		realGluons: 0,
		bosons: {
			'w+': 0,
			'w-': 0,
			'z0': 0
		},
		neutronstar: {
			quarks: 0,
			metaAntimatter: 0,
			dilatedTime: 0
		},
		rebuyables: {
			1: 0,
			2: 0
		},
		upgrades: bm > 1 ? tmp.qu.upgrades : [],
		rg4: false
	}
}

function doGhostifyResetStuff(implode, gain, amount, force, bulk, nBRU, nBEU){
	var bm = player.ghostify.milestones
	player.galacticSacrifice = resetGalacticSacrifice()
	completelyResetNormalDimensions()
	player.money = onQuantumAM()
	player.tickSpeedCost = new Decimal(1000)
	player.tickspeed = new Decimal(player.aarexModifications.newGameExpVersion ? 500 : 1000)
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	player.totalBoughtDims = resetTotalBought()
	player.sacrificed = new Decimal(0)
	player.currentChallenge =  ""
	player.setsUnlocked = 0
	player.infinitied = 0
	player.infinitiedBank = 0
	player.bestInfinityTime = 9999999999
	player.thisInfinityTime = 0
	player.resets = 0
	player.tdBoosts = resetTDBoosts()
	player.tickspeedBoosts = player.tickspeedBoosts !== undefined ? 16 : undefined
	player.galaxies = 0
	player.interval = null
	player.partInfinityPoint = 0
	player.partInfinitied = 0
	player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
	player.tickspeedMultiplier = new Decimal(10)
	player.chall2Pow = 1
	player.chall3Pow = new Decimal(0.01)
	player.matter = new Decimal(0)
	player.chall11Pow = new Decimal(1)
	player.lastTenRuns = [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]]
	player.lastTenEternities = [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]]
	player.infMult = new Decimal(1)
	player.infMultCost = new Decimal(10)
	player.tickSpeedMultDecrease = Math.max(player.tickSpeedMultDecrease, bm > 1 ? 1.25 : 2)
	player.postC4Tier = 1
	player.postC8Mult = new Decimal(1)
	player.overXGalaxiesTickspeedBoost = player.tickspeedBoosts == undefined ? player.overXGalaxiesTickspeedBoost : 0
	player.postChallUnlocked = player.achievements.includes("r133") ? order.length : 0
	player.postC4Tier = 0
	player.postC3Reward = new Decimal(1)
	player.eternityPoints = new Decimal(0)
	player.eternities = bm ? 1e13 : 0
	player.eternitiesBank = 0
	player.thisEternity = 0
	player.bestEternity = 9999999999
	player.eternityUpgrades = bm ? [1, 2, 3, 4, 5, 6] : []
	player.epmult = new Decimal(1)
	player.epmultCost = new Decimal(500)
	player.infDimensionsUnlocked = resetInfDimUnlocked()
	player.infinityPower = new Decimal(1)
	/* function */ completelyResetInfinityDimensions()
	/* function */ completelyResetTimeDimensions()
	player.infDimBuyers = bm ? player.infDimBuyers : [false, false, false, false, false, false, false, false]
	player.timeShards = new Decimal(0)
	player.tickThreshold = new Decimal(1)
	player.totalTickGained = 0
	player.challengeTarget = 0
	player.replicanti = {
		amount: new Decimal(bm ? 1 : 0),
		unl: bm > 0,
		chance: 0.01,
		chanceCost: new Decimal(player.galacticSacrifice !== undefined ? 1e90 : 1e150),
		interval: 1000,
		intervalCost: new Decimal(player.galacticSacrifice !== undefined ? 1e80 : 1e140),
		gal: 0,
		galaxies: 0,
		galCost: new Decimal(player.galacticSacrifice != undefined ? 1e110 : 1e170),
		galaxybuyer: player.replicanti.galaxybuyer,
		auto: bm ? player.replicanti.auto : [false, false, false]
	}
	player.timestudy = bm ? player.timestudy : {
		theorem: 0,
		amcost: new Decimal("1e20000"),
		ipcost: new Decimal(1),
		epcost: new Decimal(1),
		studies: [],
	}
	player.eternityChalls = bm ? player.eternityChalls : {}
	player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
	player.currentEternityChall = ""
	player.etercreq = 0
	player.autoIP = new Decimal(0)
	player.autoTime = 1e300
	player.infMultBuyer = bm ? player.infMultBuyer : false
	player.autoEterMode = bm ? player.autoEterMode : "amount"
	player.peakSpent = 0
	player.respec = false
	player.respecMastery = false
	player.eternityBuyer = bm ? player.eternityBuyer : {
		limit: new Decimal(0),
		isOn: false,
		dilationMode: false,
		dilationPerAmount: player.eternityBuyer.dilationPerAmount,
		dilMode: player.eternityBuyer.dilMode,
		tpUpgraded: player.eternityBuyer.tpUpgraded,
		slowStop: player.eternityBuyer.slowStop,
		slowStopped: player.eternityBuyer.slowStopped,
		ifAD: player.eternityBuyer.ifAD,
		presets: player.eternityBuyer.presets
	}
	player.eterc8ids = 50
	player.eterc8repl = 40
	player.dimlife = true
	player.dead = true
	player.dilation = {
		studies: bm ? player.dilation.studies : [],
		active: false,
		times: 0,
		tachyonParticles: player.ghostify.milestones > 15 ? player.dilation.bestTPOverGhostifies : new Decimal(0),
		dilatedTime: new Decimal(bm ? 1e100 : 0),
		bestTP: player.ghostify.milestones > 15 ? player.dilation.bestTPOverGhostifies : new Decimal(0),
		bestTPOverGhostifies: player.dilation.bestTPOverGhostifies,
		nextThreshold: new Decimal(1000),
		freeGalaxies: 0,
		upgrades: bm ? player.dilation.upgrades : [],
		autoUpgrades: bm ? player.dilation.autoUpgrades : player.aarexModifications.nguspV ? [] : undefined,
		rebuyables: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
		}
	}
	player.exdilation = player.exdilation != undefined ? {
		unspent: new Decimal(0),
		spent: {
			1: new Decimal(0),
			2: new Decimal(0),
			3: new Decimal(0),
			4: new Decimal(0)
		},
		times: 0
	} : player.exdilation
	player.blackhole = player.exdilation != undefined ? {
		unl: bm > 0,
		upgrades: {dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0},
		power: new Decimal(0)
	} : player.blackhole
	/*function */ doMetaDimensionsReset(false, false, 0) //meta dimboosts are set on the next line
	player.meta.resets = bm ? 4 : 0
	player.masterystudies = bm ? player.masterystudies : []
	player.quantum = getQuantumOnGhostifyData(bm, nBRU, nBEU)
	player.old = false
	player.dontWant = true	
	player.unstableThisGhostify = 0
}

function doPreInfinityGhostifyResetStuff(implode){
	setInitialMoney()
	setInitialDimensionPower()
	GPminpeak = new Decimal(0)
	if (implode) showTab("dimensions")
	document.getElementById("tickSpeed").style.visibility = "hidden"
	document.getElementById("tickSpeedMax").style.visibility = "hidden"
	document.getElementById("tickLabel").style.visibility = "hidden"
	document.getElementById("tickSpeedAmount").style.visibility = "hidden"
	hideDimensions()
	tmp.tickUpdate = true
}

function doInfinityGhostifyResetStuff(implode, bm){
	if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4)
	if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4)
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25)
	player.challenges = challengesCompletedOnEternity()
	IPminpeak = new Decimal(0)
	if (isEmptiness) {
		showTab("dimensions")
		isEmptiness = false
		document.getElementById("quantumtabbtn").style.display = "inline-block"
		document.getElementById("ghostifytabbtn").style.display = "inline-block"
	}
	document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points."
	document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points."
	document.getElementById("infmultbuyer").textContent = "Max buy IP mult"
	if (implode) showChallengesTab("normalchallenges")
	updateChallenges()
	updateNCVisuals()
	updateAutobuyers()
	hideMaxIDButton()
	if (!bm) {
		ipMultPower = player.masterystudies.includes("t241") ? 2.2 : 2
		player.autobuyers[9].bulk = Math.ceil(player.autobuyers[9].bulk)
		document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
		document.getElementById("replicantidiv").style.display = "none"
		document.getElementById("replicantiunlock").style.display = "inline-block"
		document.getElementById("replicantiresettoggle").style.display = "none"
		delete player.replicanti.galaxybuyer
	}
	updateLastTenRuns()
	if ((document.getElementById("metadimensions").style.display == "block" && !bm) || implode) showDimTab("antimatterdimensions")
	resetInfDimensions()
}

function doNGUpdateGhostifyResetStuff(){
	if (player.exdilation != undefined) {
		if (player.eternityUpgrades.length) for (var u = 7; u < 10; u++) player.eternityUpgrades.push(u)
		for (var d = 1; d < (player.aarexModifications.nguspV ? 9 : 5); d++) player["blackholeDimension" + d] = {
			cost: blackholeDimStartCosts[d],
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		}
		if (speedrunMilestonesReached < 3) {
			document.getElementById("blackholediv").style.display="none"
			document.getElementById("blackholeunlock").style.display="inline-block"
		}
	}
}

function doTOUSOnGhostify(bm){
	if (player.achievements.includes("ng3p77")) { //thry of ultimate studies
		player.timestudy.studies=[]
		player.masterystudies=[]
		for (var t = 0; t < all.length; t++) player.timestudy.studies.push(all[t])
		for (var c = 1; c <= 14; c++) player.eternityChalls["eterc" + c] = 5
		for (var t = 0; t < masteryStudies.timeStudies.length; t++) player.masterystudies.push("t" + masteryStudies.timeStudies[t])
		for (var d = 1; d < 7; d++) player.dilation.studies.push(d)
		for (var d = 7; d < 15; d++) player.masterystudies.push("d" + d)
		if (bm < 2) {
			player.dimensionMultDecrease = 2
			player.tickSpeedMultDecrease = 1.65
		}
	}
}

function doEternityGhostifyResetStuff(implode, bm){
	EPminpeakType = 'normal'
	EPminpeak = new Decimal(0)
	if (bm) {
		if (player.eternityChallUnlocked > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.eternityChallUnlocked]
		else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
	} else performedTS = false
	player.eternityChallUnlocked = 0
	player.dilation.bestTP = player.dilation.tachyonParticles
	player.dilation.totalTachyonParticles = player.dilation.bestTP
	doNGUpdateGhostifyResetStuff()
	doTOUSOnGhostify(bm) //thry of ultimate studies
	document.getElementById("eternitybtn").style.display = "none"
	document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
	if (((document.getElementById("masterystudies").style.display == "block" || document.getElementById("breakEternity").style.display == "block") && !bm) || implode) showEternityTab("timestudies", document.getElementById("eternitystore").style.display == "none")
	updateLastTenEternities()
	resetTimeDimensions()
	updateRespecButtons()
	updateMilestones()
	updateEternityUpgrades()
	updateTheoremButtons()
	updateTimeStudyButtons()
	if (!bm) updateAutoEterMode()
	updateEternityChallenges()
	updateDilationUpgradeCosts()
	if (!bm) {
		document.getElementById("masterystudyunlock").style.display = "none"
		document.getElementById('rebuyupgmax').style.display = ""
		document.getElementById('rebuyupgauto').style.display = "none"
	}
	updateMasteryStudyCosts()
	updateMasteryStudyButtons()
}

function doQuantumGhostifyResetStuff(implode, bm){
	if (!tmp.ngp3l) tmp.qu.quarkEnergy = new Decimal(0)
	tmp.qu.qcsMods.current = []
	tmp.qu.replicants.amount = new Decimal(0)
	tmp.qu.replicants.requirement = new Decimal("1e3000000")
	tmp.qu.replicants.quarks = new Decimal(0)
	tmp.qu.replicants.eggonProgress = new Decimal(0)
	tmp.qu.replicants.eggons = new Decimal(0)
	tmp.qu.replicants.babyProgress = new Decimal(0)
	tmp.qu.replicants.babies = new Decimal(0)
	tmp.qu.replicants.growupProgress = new Decimal(0)
	tmp.eds = tmp.qu.emperorDimensions
	QKminpeak = new Decimal(0)
	QKminpeakValue = new Decimal(0)
	if (implode) showQuantumTab("uquarks")
	var permUnlocks = [7,9,10,10,11,11,12,12]
	for (var i = 1; i < 9; i++) {
		var num = bm >= permUnlocks[i - 1] ? 10 : 0
		tmp.eds[i] = {workers: new Decimal(num), progress: new Decimal(0), perm: num}
		if (num > 9) tmp.qu.replicants.limitDim = i
	}
	if (bm > 6) {
		tmp.qu.replicants.limit = 10
		tmp.qu.replicants.limitCost = Decimal.pow(200, tmp.qu.replicants.limitDim * 9).times(1e49)
		tmp.qu.replicants.quantumFoodCost = Decimal.pow(5, tmp.qu.replicants.limitDim * 30).times(2e46)
	}
	if (bm > 3) {
		var colors = ['r', 'g', 'b']
		for (var c = 0; c < 3; c++) tmp.qu.tod[colors[c]].upgrades[1] = 5
	}
	if (bm) for (var i = 1; i < 9; i++) tmp.qu.challenges[i] = 2
	else {
		document.getElementById('rebuyupgauto').style.display="none"
		document.getElementById('toggleallmetadims').style.display="none"
		document.getElementById('metaboostauto').style.display="none"
		document.getElementById("autoBuyerQuantum").style.display="none"
		document.getElementById('toggleautoquantummode').style.display="none"
	}
	if (!bm && !player.achievements.includes("ng3p77")) {
		document.getElementById("electronstabbtn").style.display = "none"
		document.getElementById("nanofieldtabbtn").style.display = "none"
		document.getElementById("edtabbtn").style.display = "none"
	}
	if (tmp.ngp3l && !bm) document.getElementById('rg4toggle').style.display = inQC(1) ? "none" : ""
	document.getElementById('bestTP').textContent = "Your best Tachyon particles in this Ghostify was " + shorten(player.dilation.bestTP) + "."
	updateLastTenQuantums()
	updateSpeedruns()
	updateColorCharge()
	updateColorDimPowers()
	updateGluonsTabOnUpdate("prestige")
	updateQuantumWorth("quick")
	updateBankedEter()
	updateQuantumChallenges()
	updatePCCompletions()
	updateReplicants("prestige")
	updateEmperorDimensions()
	updateNanoRewardTemp()
	updateTODStuff()
	updateBreakEternity()
}

function doGhostifyGhostifyResetStuff(bm, force){
	GHPminpeak = new Decimal(0)
	GHPminpeakValue = new Decimal(0)
	document.getElementById("ghostifybtn").style.display = "none"
	if (!ghostified) {
		ghostified = true
		document.getElementById("ghostifytabbtn").style.display = "inline-block"
		document.getElementById("ghostparticles").style.display = ""
		document.getElementById("ghostifyAnimBtn").style.display = "inline-block"
		document.getElementById("ghostifyConfirmBtn").style.display = "inline-block"
		giveAchievement("Kee-hee-hee!")
	} else if (player.ghostify.times > 2 && player.ghostify.times < 11) {
		$.notify("You unlocked " + (player.ghostify.times+2) + "th Neutrino upgrade!", "success")
		if (player.ghostify.times % 3 > 1) document.getElementById("neutrinoUpg" + (player.ghostify.times + 2)).parentElement.parentElement.style.display = ""
		else document.getElementById("neutrinoUpg" + (player.ghostify.times + 2)).style.display = ""
	}
	document.getElementById("GHPAmount").textContent = shortenDimensions(player.ghostify.ghostParticles)
	if (bm < 7) {
		player.ghostify.neutrinos.electron = new Decimal(0)
		player.ghostify.neutrinos.mu = new Decimal(0)
		player.ghostify.neutrinos.tau = new Decimal(0)
		player.ghostify.neutrinos.generationGain = 1
	} else if (!force) player.ghostify.neutrinos.generationGain = player.ghostify.neutrinos.generationGain % 3 + 1
	player.ghostify.ghostlyPhotons.amount = new Decimal(0)
	player.ghostify.ghostlyPhotons.darkMatter = new Decimal(0)
	player.ghostify.ghostlyPhotons.ghostlyRays = new Decimal(0)
	tmp.bl.watt = 0
	player.ghostify.under = true
	updateLastTenGhostifies()
	updateBraveMilestones()
	if (!tmp.ngp3l) {
		player.ghostify.another = 10
		player.ghostify.reference = 10
	}
}


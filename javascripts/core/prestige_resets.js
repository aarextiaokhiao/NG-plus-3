function onQuantumAM(){
	let x = 10
	if (player.challenges.includes("challenge1")) x = 100
	if (player.aarexModifications.ngmX > 3) x = 200
	if (player.achievements.includes("r37")) x = 1000
	if (player.achievements.includes("r54")) x = 2e5
	if (player.achievements.includes("r55")) x = 1e10
	if (player.achievements.includes("r78")) x = 1e25
	return new Decimal(x)
}

function doQuantumResetStuff(){
	player = {
		money: new Decimal(10),
		tickSpeedCost: new Decimal(1000),
		tickspeed: new Decimal(player.aarexModifications.newGameExpVersion ? 500 : 1000),
		tickBoughtThisInf: resetTickBoughtThisInf(),
		firstCost: new Decimal(10), 
		secondCost: new Decimal(100),
		thirdCost: new Decimal(10000),
		fourthCost: new Decimal(1000000),
		fifthCost: new Decimal(1e9),
		sixthCost: new Decimal(1e13),
		seventhCost: new Decimal(1e18),
		eightCost: new Decimal(1e24),
		firstAmount: new Decimal(0),
		secondAmount: new Decimal(0),
		thirdAmount: new Decimal(0),
		fourthAmount: new Decimal(0),
		firstBought: 0,
		secondBought: 0,
		thirdBought: 0,
		fourthBought: 0,
		fifthAmount: new Decimal(0),
		sixthAmount: new Decimal(0),
		seventhAmount: new Decimal(0),
		eightAmount: new Decimal(0),
		fifthBought: 0,
		sixthBought: 0,
		seventhBought: 0,
		eightBought: 0,
		totalBoughtDims: resetTotalBought(),
		firstPow: new Decimal(1),
		secondPow: new Decimal(1),
		thirdPow: new Decimal(1),
		fourthPow: new Decimal(1),
		fifthPow: new Decimal(1),
		sixthPow: new Decimal(1),
		seventhPow: new Decimal(1),
		eightPow: new Decimal(1),
		sacrificed: new Decimal(0),
		achievements: player.achievements,
		challenges: keepABnICs ? player.challenges : [],
		currentChallenge: "",
		infinityUpgrades: player.infinityUpgrades,
		infinityPoints: player.infinityPoints,
		infinitied: 0,
		infinitiedBank: headstart || player.achievements.includes("ng3p15") ? player.infinitiedBank : 0,
		totalTimePlayed: player.totalTimePlayed,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: keepABnICs ? 4 : 0,
		dbPower: player.dbPower,
		tdBoosts: resetTDBoosts(),
		tickspeedBoosts: player.tickspeedBoosts !== undefined ? (keepABnICs ? 16 : 0) : undefined,
		galaxies: keepABnICs ? 1 : 0,
		galacticSacrifice: resetGalacticSacrifice(),
		totalmoney: player.totalmoney,
		interval: null,
		lastUpdate: player.lastUpdate,
		achPow: player.achPow,
		autobuyers: keepABnICs ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		partInfinityPoint: 0,
		partInfinitied: 0,
		break: keepABnICs ? player.break : false,
		costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
		tickspeedMultiplier: new Decimal(10),
		chall2Pow: 1,
		chall3Pow: new Decimal(0.01),
		newsArray: player.newsArray,
		matter: new Decimal(0),
		chall11Pow: new Decimal(1),
		challengeTimes: player.challengeTimes,
		infchallengeTimes: player.infchallengeTimes,
		lastTenRuns: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		lastTenEternities: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		infMult: new Decimal(1),
		infMultCost: new Decimal(10),
		tickSpeedMultDecrease: keepABnICs ? player.tickSpeedMultDecrease : GUBought("gb4") ? 1.25 : 10,
		tickSpeedMultDecreaseCost: keepABnICs ? player.tickSpeedMultDecreaseCost : 3e6,
		dimensionMultDecrease: keepABnICs ? player.dimensionMultDecrease : 10,
		dimensionMultDecreaseCost: keepABnICs ? player.dimensionMultDecreaseCost : 1e8,
		extraDimPowerIncrease: keepABnICs ? player.extraDimPowerIncrease : 0,
		dimPowerIncreaseCost: keepABnICs ? player.dimPowerIncreaseCost : 1e3,
		version: player.version,
		postC4Tier: 1,
		postC8Mult: new Decimal(1),
		overXGalaxies: keepABnICs ? player.overXGalaxies : 0,
		overXGalaxiesTickspeedBoost: keepABnICs || player.tickspeedBoosts == undefined ? player.overXGalaxiesTickspeedBoost : 0,
		spreadingCancer: player.spreadingCancer,
		postChallUnlocked: player.achievements.includes("r133") || bigRip ? order.length : 0,
		postC4Tier: 0,
		postC3Reward: new Decimal(1),
		eternityPoints: new Decimal(0),
		eternities: headstart ? player.eternities : bigRip ? (tmp.qu.bigRip.upgrades.includes(2) ? 1e5 : 0) : speedrunMilestonesReached > 17 ? 1e13 : oheHeadstart ? 2e4 : player.achievements.includes("ng3p12") ? Math.max(Math.floor(720*3600*10/player.quantum.best),10000) : 0,
		eternitiesBank: tmp.ngp3 ? nA(player.eternitiesBank, bankedEterGain) : undefined,
		thisEternity: 0,
		bestEternity: headstart ? player.bestEternity : 9999999999,
		eternityUpgrades: isRewardEnabled(3) && (!bigRip || player.quantum.bigRip.upgrades.includes(12)) ? [1,2,3,4,5,6] : [],
		epmult: new Decimal(1),
		epmultCost: new Decimal(500),
		infDimensionsUnlocked: resetInfDimUnlocked(),
		infinityPower: new Decimal(1),
		infinityDimension1 : {
			cost: new Decimal(1e8),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension2 : {
			cost: new Decimal(1e9),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension3 : {
			cost: new Decimal(1e10),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension4 : {
			cost: new Decimal(1e20),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension5 : {
			cost: new Decimal(1e140),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension6 : {
			cost: new Decimal(1e200),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension7 : {
			cost: new Decimal(1e250),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension8 : {
			cost: new Decimal(1e280),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infDimBuyers: bigRipChanged ? [turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn, turnSomeOn] : oheHeadstart ? player.infDimBuyers : [false, false, false, false, false, false, false, false],
		timeShards: new Decimal(0),
		tickThreshold: new Decimal(1),
		totalTickGained: 0,
		timeDimension1: {
			cost: new Decimal(1),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension2: {
			cost: new Decimal(5),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension3: {
			cost: new Decimal(100),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension4: {
			cost: new Decimal(1000),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension5: {
			cost: new Decimal("1e2350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension6: {
			cost: new Decimal("1e2650"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension7: {
			cost: new Decimal("1e3000"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension8: {
			cost: timeDimCost(8,ghostified&&bigRip?1:0),
			amount: new Decimal(ghostified&&bigRip?1:0),
			power: new Decimal(1),
			bought: ghostified&&bigRip?1:0
		},
		offlineProd: keepABnICs ? player.offlineProd : 0,
		offlineProdCost: keepABnICs ? player.offlineProdCost : 1e7,
		challengeTarget: 0,
		autoSacrifice: keepABnICs || player.achievements.includes("r133") ? player.autoSacrifice : 1,
		replicanti: {
			amount: new Decimal(oheHeadstart ? 1 : 0),
			unl: oheHeadstart,
			chance: 0.01,
			chanceCost: new Decimal(player.galacticSacrifice!==undefined?1e90:1e150),
			interval: 1000,
			intervalCost: new Decimal(player.galacticSacrifice!==undefined?1e80:1e140),
			gal: 0,
			galaxies: 0,
			galCost: new Decimal(player.galacticSacrifice!=undefined?1e110:1e170),
			galaxybuyer: bigRipChanged ? turnSomeOn : oheHeadstart ? player.replicanti.galaxybuyer : undefined,
			auto: bigRipChanged ? [turnSomeOn, turnSomeOn, turnSomeOn] : oheHeadstart ? player.replicanti.auto : [false, false, false]
		},
		timestudy: isRewardEnabled(11) && (!bigRip || tmp.qu.bigRip.upgrades.includes(12)) ? player.timestudy : {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: [],
		},
		eternityChalls: {},
		eternityChallGoal: new Decimal(Number.MAX_VALUE),
		currentEternityChall: "",
		eternityChallUnlocked: isRewardEnabled(11)?player.eternityChallUnlocked:0,
		etercreq: 0,
		autoIP: new Decimal(0),
		autoTime: 1e300,
		infMultBuyer: bigRipChanged ? turnSomeOn : oheHeadstart ? player.infMultBuyer : false,
		autoCrunchMode: keepABnICs ? player.autoCrunchMode : "amount",
		autoEterMode: keepABnICs ? player.autoEterMode : "amount",
		peakSpent: tmp.ngp3 ? 0 : undefined,
		respec: false,
		respecMastery: tmp.ngp3 ? false : undefined,
		eternityBuyer: keepABnICs ? player.eternityBuyer : {
			limit: new Decimal(0),
			isOn: false
		},
		eterc8ids: 50,
		eterc8repl: 40,
		dimlife: true,
		dead: true,
		dilation: {
			studies: bigRip ? (tmp.qu.bigRip.upgrades.includes(12) ? [1,2,3,4,5,6] : tmp.qu.bigRip.upgrades.includes(10) ? [1] : []) : isRewardEnabled(4) ? (speedrunMilestonesReached > 5 ? [1,2,3,4,5,6] : [1]) : [],
			active: false,
			tachyonParticles: (((player.achievements.includes("ng3p37") && (!bigRip || tmp.qu.bigRip.upgrades.includes(11))) || player.achievements.includes("ng3p71")) && !inQCModifier("ad")) ? player.dilation.bestTP.pow((player.ghostify.milestones > 15 && (!bigRip || player.achievements.includes("ng3p71"))) || (!challid && player.ghostify.milestones > 3) ? 1 : 0.5) : new Decimal(0),
			dilatedTime: new Decimal(speedrunMilestonesReached>21 && isRewardEnabled(4) && !inQCModifier("ad") && !bigRip?1e100:0),
			bestTP: player.dilation.bestTP,
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
		},
		exdilation: player.exdilation!=undefined?{
			unspent: new Decimal(0),
			spent: {
				1: new Decimal(0),
				2: new Decimal(0),
				3: new Decimal(0),
				4: new Decimal(0)
			},
			times: 0
		}: player.exdilation,
		blackhole: player.exdilation!=undefined?{
			unl: speedrunMilestonesReached > 4,
			upgrades: {dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0},
			power: new Decimal(0)
		}: player.blackhole,
		why: player.why,
		shameLevel: player.shameLevel,
		options: player.options,
		meta: {
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
		},
		masterystudies: tmp.ngp3 ? (bigRip && !tmp.qu.bigRip.upgrades.includes(12) ? ["d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14"] : speedrunMilestonesReached > 10 && isRewardEnabled(4) ? player.masterystudies : []) : undefined,
		autoEterOptions: player.autoEterOptions,
		galaxyMaxBulk: player.galaxyMaxBulk,
		quantum: tmp.qu,
		old: tmp.ngp3 ? inQC(0) : undefined,
		dontWant: tmp.ngp3 || undefined,
		ghostify: player.ghostify,
		aarexModifications: player.aarexModifications
	};
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
	player.firstPow = new Decimal(1)
	player.secondPow = new Decimal(1)
	player.thirdPow = new Decimal(1)
	player.fourthPow = new Decimal(1)
	player.fifthPow = new Decimal(1)
	player.sixthPow = new Decimal(1)
	player.seventhPow = new Decimal(1)
	player.eightPow = new Decimal(1)
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

function doCrunchResetStuff(){
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
	player.galacticSacrifice = newGalacticDataOnInfinity()
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

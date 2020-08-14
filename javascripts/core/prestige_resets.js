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
	completlyResetNormalDimensions()
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
	completlyResetNormalDimensions()
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
	completlyResetInfinityDimensions()
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

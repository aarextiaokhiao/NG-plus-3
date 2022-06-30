var inflationCheck = false
var betaId = "P"
var prefix = betaId + "ds"
var savePrefix = prefix + "AM_"
var presetPrefix = prefix + "AM_ST_"
var metaSaveId = betaId + "AD_aarexModifications"
var notifyId = 0
var forceToQuantumAndRemove = false

function setOptionsIfUndefined(){
        if (player.options === undefined) {
		player.options = {
			scientific: false,
			animationOn: true
		}
	}
	if (player.options.invert === true) player.options.theme = "Inverted"; player.options.invert = undefined;
	if (player.options.notation === undefined) player.options.notation = "Standard"
	if (player.options.scientific === undefined || typeof(player.options.scientific) == "boolean") player.options.scientific = {significantDigits: undefined}
	if (player.options.challConf === undefined) player.options.challConf = false
	if (player.options.logarithm === undefined) player.options.logarithm = {base: 10}
	if (player.options.tetration === undefined) player.options.tetration = {base: 2}
	if (player.options.hypersci === undefined) player.options.hypersci = {bump: 10}
	if (player.options.spazzy === undefined) player.options.spazzy = {subNotation: "Scientific"}
	if (player.options.standard === undefined) player.options.standard = { useMyr: false, useTam: false }
	if (player.options.aas === undefined) player.options.aas = { useDe: false }
	if (player.options.newsHidden === undefined) player.options.newsHidden = false;
	if (player.options.sacrificeConfirmation === undefined) player.options.sacrificeConfirmation = true;
	if (player.options.retryChallenge === undefined) player.options.retryChallenge = false;
	if (player.options.bulkOn === undefined) player.options.bulkOn = true
	if (player.options.cloud === undefined) player.options.cloud = true
	if (player.options.hotkeys === undefined) player.options.hotkeys = true
	if (player.options.eternityconfirm === undefined) player.options.eternityconfirm = true
	if (player.options.themes === undefined) player.options.themes = "Normal"
	if (player.options.secretThemeKey === undefined) player.options.secretThemeKey = 0
        if (player.options.commas === undefined) player.options.commas = true
        if (player.options.chart === undefined) player.options.chart = {}
	if (player.options.chart.updateRate === undefined) player.options.chart.updateRate = 1000
	if (player.options.chart.duration === undefined) player.options.chart.duration = 10
	if (player.options.chart.warning === undefined) player.options.chart.warning = 0
	if (player.options.chart.on === undefined) player.options.chart.on = false
	if (player.options.chart.dips === undefined) player.options.chart.dips = true
	if (player.options.animations === undefined) player.options.animations = {floatingText: true, bigCrunch: true, eternity: true, tachyonParticles: true}
        if (player.options.notation == "Mixed") player.options.notation = "Mixed scientific"
        if (player.options.commas == "Default") {
                player.options.commas == "AF2019";
                updateNotationOption();
        }
        if (player.options.notation == "Default") {
                player.options.notation = typeof(player.options.commas) === "boolean" ? "AF2019" : "Brackets";
                updateNotationOption();
        }
}

function setPreBreakIfUndefined(){
        if (player.achievements === undefined) player.achievements = [];
	if (player.sacrificed === undefined) player.sacrificed = E(0);
	if (player.infinityUpgrades === undefined) player.infinityUpgrades = [];
	if (player.infinityPoints === undefined) player.infinityPoints = E(0);
	if (player.infinitied === undefined) player.infinitied = 0;
	if (player.totalTimePlayed === undefined) player.totalTimePlayed = 0;
	if (player.bestInfinityTime === undefined) player.bestInfinityTime = 9999999999;
	if (player.thisInfinityTime === undefined) player.thisInfinityTime = 9999999999;
	if (player.galaxies === undefined) player.galaxies = 0;
	if (player.lastUpdate === undefined) player.lastUpdate = new Date().getTime();
	if (player.achPow === undefined) player.achPow = 1;
	if (player.newsArray === undefined) player.newsArray = [];
	if (player.chall2Pow === undefined) player.chall2Pow = 1;
	if (player.chall3Pow === undefined) player.chall3Pow = 0.01;
	if (player.challenges === undefined) player.challenges = []
	if (player.currentChallenge === undefined) player.currentChallenge = ""
	if (player.infinitied > 0 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1")
	if (player.matter === undefined) player.matter = E(0)
	if (player.autobuyers === undefined) player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	if (player.costMultipliers === undefined) player.costMultipliers = [E(1e3), E(1e4), E(1e5), E(1e6), E(1e8), E(1e10), E(1e12), E(1e15)]
	if (player.tickspeedMultiplier === undefined) player.tickspeedMultiplier = E(10)
	if (player.partInfinityPoint === undefined) player.partInfinityPoint = 0
	if (player.challengeTimes === undefined) player.challengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
	if (player.infchallengeTimes === undefined) player.infchallengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
	if (player.lastTenRuns === undefined) player.lastTenRuns = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
}

function setPreEterIfUndefined(){
        if (player.infMult === undefined) player.infMult = E(1)
	if (player.infMultCost === undefined) player.infMultCost = E(100)
	if (player.tickSpeedMultDecrease === undefined) player.tickSpeedMultDecrease = 10
	if (player.tickSpeedMultDecreaseCost === undefined) player.tickSpeedMultDecreaseCost = 3e6
	if (player.dimensionMultDecrease === undefined) player.dimensionMultDecrease = 10
	if (player.dimensionMultDecreaseCost === undefined) player.dimensionMultDecreaseCost = 1e8
	if (player.overXGalaxies === undefined) player.overXGalaxies = 10;
	if (player.partInfinitied === undefined) player.partInfinitied = 0
	if (player.spreadingCancer === undefined) player.spreadingCancer = 0
	if (player.postC4Tier === undefined) player.postC4Tier = 0
	if (player.postC3Reward === undefined) player.postC3Reward = E(1)
	if (player.postC8Mult === undefined) player.postC8Mult = E(1)
	if (player.offlineProd === undefined) player.offlineProd = 0
	if (player.offlineProdCost === undefined) player.offlineProdCost = 1e7
	if (player.autoSacrifice === undefined) player.autoSacrifice = 1
	if (player.postChallUnlocked === undefined) player.postChallUnlocked = 0
	if (player.infMultBuyer === undefined) player.infMultBuyer = false
	if (player.autoCrunchMode === undefined) player.autoCrunchMode = "amount"
	if (player.challengeTarget === undefined) {
		player.challengeTarget = 0
		if (player.currentChallenge != "") player.challengeTarget = Number.MAX_VALUE
	}
}

function setPreNGp3IfUndefined(){
        if (player.lastTenEternities === undefined) player.lastTenEternities = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
	if (player.respec === undefined) player.respec = false
	if (player.eternityChalls === undefined) player.eternityChalls = {}
	if (player.eternityChallGoal === undefined) player.eternityChallGoal = E(Number.MAX_VALUE)
	if (player.currentEternityChall === undefined) player.currentEternityChall = ""
	if (player.eternityChallUnlocked === undefined) player.eternityChallUnlocked = 0
	if (player.etercreq === undefined) player.etercreq = 0
	if (player.options.updateRate === undefined) player.options.updateRate = 50
	if (player.eterc8ids === undefined) player.eterc8ids = 50
	if (player.eterc8repl === undefined) player.eterc8repl = 40
	if (player.infinitiedBank === undefined) player.infinitiedBank = 0
	if (player.dimlife === undefined) player.dimlife = false
	if (player.dead === undefined) player.dead = false
	if (player.dilation === undefined) player.dilation = {}
	if (player.dilation.studies === undefined) player.dilation.studies = []
	if (player.dilation.active === undefined) player.dilation.active = false
	if (player.dilation.tachyonParticles === undefined) player.dilation.tachyonParticles = E(0)
	if (player.dilation.dilatedTime === undefined) player.dilation.dilatedTime = E(0)
	if (player.dilation.totalTachyonParticles === undefined) player.dilation.totalTachyonParticles = E(0)
	if (player.dilation.nextThreshold === undefined) player.dilation.nextThreshold = E(1000)
	if (player.dilation.freeGalaxies === undefined) player.dilation.freeGalaxies = 0
	if (player.dilation.upgrades === undefined) player.dilation.upgrades = []
	if (player.dilation.rebuyables === undefined) player.dilation.rebuyables =  { 1: 0, 2: 0, 3: 0 }
	if (player.timeDimension5 === undefined) player.timeDimension5 = {cost: E("1e2350"), amount: E(0), power: E(1), bought: 0 }
	if (player.timeDimension6 === undefined) player.timeDimension6 = {cost: E("1e2650"), amount: E(0), power: E(1), bought: 0 }
	if (player.timeDimension7 === undefined) player.timeDimension7 = {cost: E("1e3000"), amount: E(0), power: E(1), bought: 0 }
	if (player.timeDimension8 === undefined) player.timeDimension8 = {cost: E("1e3350"), amount: E(0), power: E(1), bought: 0 }
	if (player.why === undefined) player.why = 0
}

function checkShowTS(){
        if (player.secondAmount !== 0) {
		el("tickSpeed").style.visibility = "visible";
		el("tickSpeedMax").style.visibility = "visible";
		el("tickLabel").style.visibility = "visible";
		el("tickSpeedAmount").style.visibility = "visible";
	}
}

function setIDIfUndefined(){
        if (player.infinityPower === undefined) {
		player.infinityPower = E(1)
		player.infinityDimension1 = {
			cost: E(1e8),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
		player.infinityDimension2 = {
			cost: E(1e9),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
		player.infinityDimension3 = {
			cost: E(1e10),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
		player.infinityDimension4 = {
			cost: E(1e20),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
		player.infDimensionsUnlocked = [false, false, false, false]
	}
        if (player.infinityDimension1.baseAmount === undefined) {
		player.infinityDimension1.baseAmount = 0;
		player.infinityDimension2.baseAmount = 0;
		player.infinityDimension3.baseAmount = 0;
		player.infinityDimension4.baseAmount = 0;

		player.infinityDimension1.baseAmount = E(player.infinityDimension1.power).log(50).times(10).toNumber()
		player.infinityDimension2.baseAmount = E(player.infinityDimension2.power).log(30).times(10).toNumber()
		player.infinityDimension3.baseAmount = E(player.infinityDimension3.power).log(10).times(10).toNumber()
		player.infinityDimension4.baseAmount = E(player.infinityDimension4.power).log(5).times(10).toNumber()
	}

        if (player.infinityDimension5 === undefined) {
		player.infDimensionsUnlocked.push(false)
		player.infDimensionsUnlocked.push(false)
		player.infinityDimension5 = {
			cost: E(1e140),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
		player.infinityDimension6 = {
			cost: E(1e200),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
	}

	if (player.infinityDimension7 == undefined) {
		player.infDimensionsUnlocked.push(false)
		player.infDimensionsUnlocked.push(false)
		player.infinityDimension7 = {
			cost: E(1e250),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
		player.infinityDimension8 = {
			cost: E(1e280),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
	}
}

function setTD1to4IfUndefined(){
        if (player.timeShards === undefined) {
		player.timeShards = E(0)
		player.eternityPoints = E(0)
		player.tickThreshold = E(1)
		player.totalTickGained = 0
		player.eternities = 0
		player.timeDimension1 = {
			cost: E(1),
			amount: E(0),
			power: E(1),
			bought: 0
		}
		player.timeDimension2 = {
			cost: E(5),
			amount: E(0),
			power: E(1),
			bought: 0
		}
		player.timeDimension3 = {
			cost: E(100),
			amount: E(0),
			power: E(1),
			bought: 0
		}
		player.timeDimension4 = {
			cost: E(1000),
			amount: E(0),
			power: E(1),
			bought: 0
		}
	}
}

function setABIfUndefined(){
        if (player.autoIP === undefined) player.autoIP = E(0)
	if (player.autoTime === undefined) player.autoTime = 1e300;
	if (player.matter === null) player.matter = E(0)
	for (var i = 0; i < 12; i++) {
		if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].tier === undefined) {
			player.autobuyers[i].tier = i + 1
		}
		if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].target % 1 !== 0) {
			player.autobuyers[i].target = i + 1
			if (i == 8) player.autobuyers[i].target = 1
		}

		if (player.autobuyers[i]%1 !== 0 && (player.autobuyers[i].bulk === undefined || isNaN(player.autobuyers[i].bulk) || player.autobuyers[i].bulk === null)) {
			player.autobuyers[i].bulk = 1
		}
	}
	if (player.autobuyers[8].tier == 10) player.autobuyers[8].tier = 9
}

function setPeakIfUndefined(){
        GPminpeak = E(0)
	IPminpeak = E(0)
	EPminpeakType = 'normal'
	EPminpeak = E(0)
	QKminpeak = E(0)
	QKminpeakValue = E(0)
	GHPminpeak = E(0)
	GHPminpeakValue = E(0)
	if (player.peakSpent) player.peakSpent = 0
}

function dov1tov5(){
        if (player.version === undefined) { 
		for (var i = 0; i < player.autobuyers.length; i++) {
			if (player.autobuyers[i]%1 !== 0) player.infinityPoints = player.infinityPoints + player.autobuyers[i].cost - 1
		}
		player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		player.version = 1
	}
	if (player.version == 1) {
		if (player.dimensionMultDecrease != 10) {
			if (player.dimensionMultDecrease == 9) {
				player.dimensionMultDecrease = 10
				player.dimensionMultDecreaseCost = 1e8
				player.infinityPoints = player.infinityPoints.plus(1e8)
			}
			if (player.dimensionMultDecrease == 8) {
				player.dimensionMultDecrease = 10
				player.dimensionMultDecreaseCost = 1e8
				player.infinityPoints = player.infinityPoints.plus(2.1e9)
			}
			if (player.dimensionMultDecrease == 7) {
				player.dimensionMultDecrease = 10
				player.dimensionMultDecreaseCost = 1e8
				player.infinityPoints = player.infinityPoints.plus(4.21e10)
			}
		}
		player.version = 2
	}
	if (player.version < 5) {
		player.newsArray = []
		player.version = 5
	}
}

function setReplTSIfUndefined(){
        if (player.replicanti === undefined) {
		player.replicanti = {
			amount: E(0),
			unl: false,
			chance: 0.01,
			chanceCost: E(1e150),
			interval: 1000,
			intervalCost: E(1e140),
			gal: 0,
			galaxies: 0,
			galCost: E(1e170)
		}
	}
	if (player.bestEternity === undefined) {
		player.bestEternity = 9999999999
		player.thisEternity = player.totalTimePlayed
	}
	if (player.timestudy === undefined) {
		player.timestudy = {
			theorem: 0,
			amcost: E("1e20000"),
			ipcost: E(1),
			epcost: E(1),
			studies: [],
		}
	}
        if (getEternitied() == 0) {
		el("eternityPoints2").style.display = "none";
		el("eternitystorebtn").style.display = "none";
		el("tdtabbtn").style.display = "none";
	}
}

function setEverythingPreNGp3onLoad(){
        clickedAntimatter = 0
        happyHalloween = false
        if (player.totalmoney === undefined || isNaN(player.totalmoney)) player.totalmoney = player.money;
	if (player.tickspeed === undefined) player.tickspeed = E(1000)
	setOptionsIfUndefined()
	setPreBreakIfUndefined()
	setPreEterIfUndefined()
        setPreNGp3IfUndefined()
	setTheme(player.options.theme);
	sliderText.textContent = "Update rate: " + player.options.updateRate + "ms";
	slider.value = player.options.updateRate;
        checkShowTS()
        setIDIfUndefined()
        setTD1to4IfUndefined()
        setABIfUndefined()
	el("totaltickgained").textContent = "You've gained " + getFullExpansion(player.totalTickGained) + " tickspeed upgrades."
        setPeakIfUndefined()
	dov1tov5()
	if (typeof player.autobuyers[9].bulk !== "number") player.autobuyers[9].bulk = 1
        setReplTSIfUndefined()

	if (player.eternityUpgrades === undefined) player.eternityUpgrades = []

	if (player.infDimBuyers === undefined) player.infDimBuyers = [false, false, false, false, false, false, false, false]

	if (player.replicanti.auto === undefined) player.replicanti.auto = [false, false, false]
	if (player.eternityBuyer === undefined) {
		player.eternityBuyer = {
			limit: E(0),
			isOn: false
		}
	}
  
	if (typeof(player.options.commas) !== "string") {
		if (player.options.commas) player.options.commas = "Commas"
		else player.options.commas = player.options.notation
	}
	if (player.shameLevel === undefined) player.shameLevel = 0;
        el("break").textContent = (player.break ? "FIX" : "BREAK") + " INFINITY"
}

function setAarexModIfUndefined(){
	//First Aarex's Mods option: Decimal Library Toggle
	if (player.aarexModifications === undefined) {
		player.aarexModifications = {
			breakInfinity: false
		}
		break_infinity_js = false
		aarMod = player.aarexModifications
	}

	if (aarMod.dilationConf === undefined) aarMod.dilationConf = true
	if (aarMod.offlineProgress === undefined)  aarMod.offlineProgress = true
	if (aarMod.autoSave === undefined) aarMod.autoSave = true
	if (aarMod.progressBar === undefined) aarMod.progressBar = true
	if (aarMod.logRateChange === undefined) aarMod.logRateChange = false
	if (aarMod.hideProductionTab === undefined) aarMod.hideProductionTab = !(!player.boughtDims) && aarMod.ersVersion === undefined
	if (aarMod.eternityChallRecords === undefined) aarMod.eternityChallRecords = {}
	if (aarMod.popUpId === undefined) aarMod.popUpId = 0

	if (aarMod.tabsSave === undefined) aarMod.tabsSave = {on: false}
	if (aarMod.noFooter == undefined) {
                aarMod.noFooter = player.options.theme == "Aarex's Modifications" || player.options.theme == "Aarex's Mods II"
        }
        if (player.masterystudies !== undefined && aarMod.newGame3PlusVersion === undefined) {
		forceHardReset = true
		reset_game()
		forceHardReset = false
		return
	}
	if (aarMod.newGamePlusPlusVersion == undefined && aarMod.newGame3PlusVersion != undefined) {
		delete player.masterystudies
		delete aarMod.newGame3PlusVersion
	}
}

function doNGp3Init1(){
        if (aarMod.newGame3PlusVersion >= 2.2) tmp.bl = ghSave.bl
	tmp.ngp3=player.masterystudies!==undefined
	tmp.newNGP3E=aarMod.newGameExpVersion!==undefined
	setNonlegacyStuff()
	transformSaveToDecimal();
	tmp.tickUpdate = true;
	updateAchievements();
	updateCheckBoxes();
	toggleChallengeRetry()
	toggleChallengeRetry()
	toggleBulk()
	toggleBulk()
}

function setSomeEterEraStuff(){
        if (player.replicanti.unl == true) {
		el("replicantidiv").style.display="inline-block"
		el("replicantiunlock").style.display="none"
	} else {
		el("replicantidiv").style.display="none"
		el("replicantiunlock").style.display="inline-block"
	}
        if (!player.replicanti.auto[0]) el("replauto1").textContent = "Auto: OFF"
	if (!player.replicanti.auto[1]) el("replauto2").textContent = "Auto: OFF"
	if (!player.replicanti.auto[2]) el("replauto3").textContent = "Auto: OFF"

	updateNotationOption()

	el("floatingTextAnimBtn").textContent = "Floating text: " + ((player.options.animations.floatingText) ? "ON" : "OFF")
	el("bigCrunchAnimBtn").textContent = "Big crunch: " + (player.options.animations.bigCrunch === "always" ? "ALWAYS" : player.options.animations.bigCrunch ? "ON" : "OFF")
	el("tachyonParticleAnimBtn").textContent = "Tachyon particles: " + ((player.options.animations.tachyonParticles) ? "ON" : "OFF")

	if (player.infinitied == 0 && getEternitied() == 0) el("infinityPoints2").style.display = "none"

	if (player.eternityChallUnlocked === null) player.eternityChallUnlocked = 0
	if (player.eternityChallUnlocked !== 0) el("eterc"+player.eternityChallUnlocked+"div").style.display = "inline-block"

	if (getEternitied()<1) el("infmultbuyer").textContent="Max buy IP mult"
	else el("infmultbuyer").textContent="Autobuy IP mult O"+(player.infMultBuyer?"N":"FF")

	if (player.epmult === undefined || player.epmult == 0) {
		player.epmult = E(1)
		player.epmultCost = E(500)
	}
}

function setSaveStuffHTML(){
	el("save_name").textContent = "You are currently playing in " + (aarMod.save_name ? aarMod.save_name : "Save #" + savePlacement)
	el("offlineProgress").textContent = "Offline progress: O"+(aarMod.offlineProgress?"N":"FF")
	el("autoSave").textContent = "Auto save: " + (aarMod.autoSave ? "ON" : "OFF")
	el("autoSaveInterval").textContent = "Auto-save interval: " + getAutoSaveInterval() + "s"
	el("autoSaveIntervalSlider").value = getAutoSaveInterval()
}

function setSomeEterEraStuff2(){
        el("automation_ng" + (aarMod.ngmX > 3 ? "m4" : "") + "_placement").appendChild(el("autobuyers"))
	if (aarMod.ngmX > 3) el("autobuyers").style.display="none"
	el("autobuyers").className=(aarMod.ngmX>3?"":"inf")+"tab"
	el("autobuyersbtn").style.display=aarMod.ngmX>3?"none":""
	loadAutoBuyerSettings();
	var updatedLTR = []
	for (var lastRun = 0; lastRun < 10; lastRun++) {
		if (typeof(player.lastTenRuns[lastRun]) !== "number") if (player.lastTenRuns[lastRun][0] != 26784000 || player.lastTenRuns[lastRun][1].neq(1)) updatedLTR.push(player.lastTenRuns[lastRun])
		if (player.lastTenEternities[lastRun][0] == 26784000 && player.lastTenEternities[lastRun][1].eq(1)) player.lastTenEternities[lastRun] = [26784000, E(0)]
	}
	for (var a = updatedLTR.length; a < 10; a++) updatedLTR.push([26784000, E(0)])
	player.lastTenRuns = updatedLTR
	updateLastTenRuns()
	updateLastTenEternities()

	updateInfCosts()
}

function dov7tov10(){
        var inERS=!(!player.boughtDims)
        if (player.version > 7 && inERS && !aarMod.ersVersion) player.version = 7
	if (player.version < 9) {
		player.version = 9
		let achs = []
		if (hasAch("r22")) {
			achs.push("r35")
			player.achievements.splice(player.achievements.indexOf("r22"), 1)
		}
		if (hasAch("r35")) {
			achs.push("r76")
			player.achievements.splice(player.achievements.indexOf("r35"), 1)
		}
		if (hasAch("r41")) {
			achs.push("r22")
			player.achievements.splice(player.achievements.indexOf("r41"), 1)
		}
		if (hasAch("r76")) {
			achs.push("r41")
			player.achievements.splice(player.achievements.indexOf("r76"), 1)
		}

		for (var i = 0; i < achs.length;i++) player.achievements.push(achs[i])
		updateAchievements()
		if (!inERS) player.replicanti.intervalCost = player.replicanti.intervalCost.dividedBy(1e20)
	}
	el(inERS?"r22":"r35").appendChild(el("Don't you dare sleep"))
	el(inERS?"r35":"r76").appendChild(el("One for each dimension"))
	el(inERS?"r41":"r22").appendChild(el("Fake News"))
	el(inERS?"r76":"r41").appendChild(el("Spreading Cancer"))
	el("Universal harmony").style["background-image"]="url(images/"+(player.masterystudies==undefined?104:"104-ngp3")+".png)"
	el("Infinite time").style["background-image"]="url(images/"+(inERS?79:69)+".png)"

	el("ec12Mult").style.display = player.pSac !== undefined ? "" : "none"

	if (player.version < 9.5) {
		player.version = 9.5
		if (player.timestudy.studies.includes(191)) player.timestudy.theorem += 100
	}

	if (player.version < 10) {
		player.version = 10
		if (player.timestudy.studies.includes(72)) {
			for (i = 4; i < 8; i++) {
				player["infinityDimension" + i].amount = player["infinityDimension" + i].amount.div(calcTotalSacrificeBoost().pow(0.02))
			}
		}
	}
}

function doNGM1Versions(){
        if (aarMod.newGameMinusVersion === undefined && !player.boughtDims) {
                if (checkNGM() > 0) {
                        aarMod.newGameMinusVersion = (aarMod.newGameMinusUpdate !== undefined ? aarMod.newGameMinusUpdate : player.newGameMinusUpdate === undefined ? checkNGM() : 1.1)
                        delete aarMod.newGameMinusUpdate
                        delete player.newGameMinusUpdate
                }
        }
        if (aarMod.newGameMinusVersion < 1.1) {
                player.totalTimePlayed+=1728000
                player.timestudy.theorem+=1
                player.timestudy.ipcost=Decimal.div(player.timestudy.ipcost,2)
                if (player.eternityChalls.eterc1==undefined) player.eternityChalls.eterc1=-6
                else player.eternityChalls.eterc1-=6
                if (player.eternityChalls.eterc11==undefined) player.eternityChalls.eterc11=1
                else if (player.eternityChalls.eterc11<5) player.eternityChalls.eterc11+=1
                aarMod.newGameMinusVersion = 1.1
        }
        if (aarMod.newGameMinusVersion < 2) {
                if (player.eternities == -20) {
                        player.infinitied += 991
                        player.offlineProdCost = Decimal.times(player.offlineProdCost, 5e4)
                } player.infinitiedBank -= 996
                player.spreadingCancer -= 9000
                player.timeDimension1.power = player.timeDimension1.power.mul(2)
                player.timestudy.theorem--
                player.timestudy.ipcost = player.timestudy.ipcost.div(5e11)
                player.dilation.nextThreshold.e = 6
                player.dilation.totalTachyonParticles = E(500)
                player.dilation.rebuyables[2] = 1
                player.timeDimension5.power = pow10(-3)
                player.timeDimension6.power = E(0.0004)
                player.timeDimension7.power = pow10(-4)
                player.timeDimension8.power = E(0.00004)
        }
        if (aarMod.newGameMinusVersion < 2.1) {
                player.timeDimension1.power = player.timeDimension1.power.mul(8)
                player.timeDimension4.power = player.timeDimension4.power.mul(4)
                player.timestudy.theorem--
                player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.add(1500)
        }
        if (aarMod.newGameMinusVersion < 2.2) {
                player.timestudy.theorem += 3;
                const pow_div = [0,160,5/3,1,3,100,80,100/3,20];
                for (i=1;i<=8;i++) player["timeDimension"+i].power = player["timeDimension"+i].power.div(pow_div[i]);
                if (player.eternityChalls.eterc11 == 1) delete player.eternityChalls.eterc11
                else player.eternityChalls.eterc11--
                $.notify('Your NG- save has been updated due to few balancing issues.', 'info')
        }
}



function doNGP3NewPlayerStuff(){
        aarMod.newGame3PlusVersion = 2.302
        player.respecMastery=false
        player.dbPower = 1
        player.dilation.times = 0
        player.peakSpent = 0
        player.masterystudies = []
        quSave.reached = false
        player.meta.bestOverQuantums = player.meta.bestAntimatter
        player.options.animations.quarks = true
        quSave.usedQuarks = {
                r: 0,
                g: 0,
                b: 0
        }
        quSave.colorPowers = {
                r: 0,
                g: 0,
                b: 0
        }
        quSave.gluons = {
                rg: 0,
                gb: 0,
                br: 0
        }
        player.eternityBuyer.dilationMode = false
        player.eternityBuyer.statBeforeDilation = 0
        player.eternityBuyer.dilationPerAmount = 10
        quSave.autobuyer = {
                enabled: false,
                limit: 1,
                mode: "amount",
                peakTime: 0
                }
        quSave.electrons = {
                amount: 0,
                sacGals: 0,
                mult: 2,
                rebuyables: [0,0,0,0]
        }
        quSave.disabledRewards = {}
        quSave.metaAutobuyerWait = 0
        quSave.multPower = {rg:0,gb:0,br:0,total:0}
        quSave.challenge = []
        quSave.challenges = {}
        quSave.nonMAGoalReached = []
        quSave.challengeRecords = {}
        quSave.pairedChallenges = {
                order: {},
                current: 0,
                completed: 0,
                completions: {},
                fastest: {},
                pc68best: 0,
                respec: false
        }
        quSave.qcsNoDil = {}
        quSave.qcsMods = {current:[]}
        player.dilation.bestTP = 0
        player.old = false
        quSave.autoOptions = {}
        quSave.replicants = {
                amount: 0,
                requirement: "1e3000000",
                quarks: 0,
                quantumFood: 0,
                quantumFoodCost: 2e46,
                limit: 1,
                limitDim: 1,
                limitCost: 1e49,
                eggonProgress: 0,
                eggons: 0,
                hatchSpeed: 20,
                hatchSpeedCost: 1e49,
                babyProgress: 0,
                babies: 0,
                ageProgress: 0
        }
        quSave.emperorDimensions = {}
        for (d=1;d<9;d++) quSave.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
        quSave.nanofield = {
                charge: 0,
                energy: 0,
                antienergy: 0,
                power: 0,
                powerThreshold: 50,
                rewards: 0,
                producingCharge: false
        }
        quSave.reachedInfQK = false
        quSave.assignAllRatios = {
                r: 1,
                g: 1,
                b: 1
        }
        quSave.notrelative = false
        quSave.wasted = false
        quSave.tod = {
                r: {
                        quarks: 0,
                        spin: 0,
                        upgrades: {}
                },
                g: {
                        quarks: 0,
                        spin: 0,
                        upgrades: {}
                },
                b: {
                        quarks: 0,
                        spin: 0,
                        upgrades: {}
                },
                upgrades: {}
        }
        quSave.bigRip = {
                active: false,
                conf: true,
                times: 0,
                bestThisRun: 0,
                totalAntimatter: 0,
                bestGals: 0,
                savedAutobuyersNoBR: {},
                savedAutobuyersBR: {},
                spaceShards: 0,
                upgrades: []
        }
        quSave.breakEternity = {
                unlocked: false,
                break: false,
                eternalMatter: 0,
                upgrades: [],
                epMultPower: 0
        }
        ghSave = getGhostifyOnNewNGP3Data()
        tmp.bl=ghSave.bl
        for (var g=1;g<=br.maxLimit;g++) tmp.bl.glyphs.push(0)
        player.options.animations.ghostify = true
        aarMod.ghostifyConf = true
}

function getGhostifyOnNewNGP3Data(){
        return {
                reached: false,
                times: 0,
                time: player.totalTimePlayed,
                best: 9999999999,
                last10: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
                milestones: 0,
                disabledRewards: {},
                ghostParticles: 0,
                multPower: 1,
                neutrinos: {
                        electron: 0,
                        mu: 0,
                        tau: 0,
                        generationGain: 1,
                        multPower: 1,
                        upgrades: []
                },
                automatorGhosts: setupAutomaticGhostsData(),
                ghostlyPhotons: {
                        unl: false,
                        amount: 0,
                        ghostlyRays: 0,
                        darkMatter: 0,
                        lights: [0,0,0,0,0,0,0,0],
                        maxRed: 0,
                        enpowerments: 0
                },
                bl: {
                        watt: 0,
                        speed: 1,
                        ticks: 0,
                        am: 0,
                        typeToExtract: 1,
                        extracting: false,
                        extractProgress: 0,
                        autoExtract: 0,
                        glyphs: [],
                        enchants: {},
                        usedEnchants: [],
                        upgrades: [],
                        battery: 0,
                        odSpeed: 1
                },
                wzb: {
                        unl: false,
                        dP: 0,
                        dPUse: 0,
                        wQkUp: true,
                        wQkProgress: 0,
                        zNeGen: 1,
                        zNeProgress: 1,
                        zNeReq: E(1),
                        wpb: 0,
                        wnb: 0,
                        zb: 0
                }
        }
}

function doInitNGp2NOT3Stuff(){
        if (aarMod.newGamePlusPlusVersion === undefined && !player.masterystudies) { 
		if (player.dilation.rebuyables[4] !== undefined) {
                        var migratedUpgrades = []
                        var v2_1check=player.version>13
                        for (id=5;id<(v2_1check?18:14);id++) if (player.dilation.upgrades.includes(id)) migratedUpgrades.push(id>16?10:(id>12&&v2_1check)?("ngpp"+(id-10)):(id%4<1)?("ngpp"+(id/4-1)):Math.floor(id/4)*3+id%4)
                        if (player.meta) {
                                for (dim=1;dim<9;dim++) {
                                        player.meta[dim].bought += player.meta[dim].tensBought * 10
                                        delete player.meta[dim].tensBought
                                }
                                if (player.autoEterMode) aarMod.newGamePlusPlusVersion = 2.2
                                else if (v2_1check) {
                                        player.version = 12.1
                                        aarMod.newGamePlusPlusVersion = 2.1
                                } else if (player.meta) aarMod.newGamePlusPlusVersion = 2
                        } else aarMod.newGamePlusPlusVersion = 1
                        var newAchievements=[]
                        var v2_3check=player.ep5xAutobuyer!==undefined
                        for (id=0;id<player.achievements.length;id++) {
                                r=player.achievements[id].split("r")[1]
                                newAchievements.push(r>138?"ngpp"+(r-130):player.achievements[id])
                                if (r>138) v2_3check=true
                        }
                        if (v2_3check) {
                                aarMod.newGamePlusVersion = 1
                                aarMod.newGamePlusPlusVersion = 2.3
                                player.autoEterOptions = {epmult:player.ep5xAutobuyer}
                                for (dim=1;dim<9;dim++) player.autoEterOptions["td"+dim] = player.timeDimensionAutobuyer
                                player.achievements=newAchievements
                                updateAchievements()
                                delete player.timeDimensionAutobuyer
                                delete player.ep5xAutobuyer
                        }
                        quSave=player.quantum
                        if (quSave) {
                                aarMod.newGamePlusPlusVersion = 2.901
                                quSave.time = player.totalTimePlayed
                                quSave.best = 9999999999
                                quSave.last10 = [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]]
                                aarMod.quantumConf = true
                        }
                        aarMod.newGamePlusVersion = 1
                        if (confirm("Do you want to migrate your NG++ save into new NG+++ mode?")) {
                                doNGP3NewPlayerStuff()
                        }
                        player.dilation.upgrades=migratedUpgrades
                        resetDilationGalaxies()
                }
        } else if (player.dilation.rebuyables[4] == null) {
                delete aarMod.meta
                delete aarMod.autoEterMode
                delete aarMod.autoEterOptions
                delete quSave
        }
}

function doNGP2v2tov2302(){
        if (aarMod.newGamePlusPlusVersion < 2) {
                for (dim=1;dim<5;dim++) {
                        var dim = player["timeDimension" + dim]
                        if (Decimal.gte(dim.cost, "1e20000")) dim.cost = E_pow(timeDimCostMults[dim]*2.2, dim.bought).times(timeDimStartCosts[dim]).times(E_pow(E('1e1000'),Math.pow(dim.cost.log(10) / 1000 - 20, 2)))
                }
                player.meta = {resets: 0, antimatter: 10, bestAntimatter: 10}
                for (dim=1;dim<9;dim++) player.meta[dim] = {amount: 0, bought: 0, cost: initCost[dim]}
        }
        if (aarMod.newGamePlusPlusVersion < 2.2) {
                for (dim=1;dim<5;dim++) {
                        var dim = player["timeDimension" + dim]
                        if (Decimal.gte(dim.cost, "1e100000")) dim.cost = E_pow(timeDimCostMults[dim]*100, dim.bought).times(timeDimStartCosts[dim]).times(E_pow(E('1e1000'),Math.pow(dim.cost.log(10) / 1000 - 100, 2)))
                }
                
                player.autoEterMode == "amount"
                aarMod.newGamePlusPlusVersion = 2.2
        }
        if (aarMod.newGamePlusPlusVersion < 2.3) {
                var autoEterOptions={epmult:player.autoEterOptions?player.autoEterOptions.epMult===true:false}
                for (dim=1;dim<9;dim++) if (player.autoEterOptions===undefined?true:player.autoEterOptions["td"+dim]) autoEterOptions["td"+dim]=false
                player.autoEterOptions=autoEterOptions
        }
        if (aarMod.newGamePlusPlusVersion < 2.301) {
                var metaAchCheck = player.dilation.studies.includes(6)
                var noD9AchCheck = player.meta[8].bought > 0 || player.meta.resets > 4
                var metaBoostCheck = player.meta.resets > 9
                if (metaBoostCheck) giveAchievement("And still no ninth dimension...")
                if (noD9AchCheck||metaBoostCheck) giveAchievement("Meta-boosting to the max")
                if (metaAchCheck||noD9AchCheck||metaBoostCheck) giveAchievement("I'm so meta")
                player.galaxyMaxBulk = false
        }
        if (aarMod.newGamePlusPlusVersion < 2.302){
                for (let i = 1; i <= 8; i++){
                        delete player[TIER_NAMES[i]+"Pow"]
                }
                aarMod.newGamePlusPlusVersion = 2.302
        }
}

function doQuantumRestore(){
        var quantumRestore = aarMod.newGamePlusPlusVersion < 2.9 || (!quSave && aarMod.newGamePlusPlusVersion > 2.4)
        if (quantumRestore) {
                player.quantum={
                        times: 0,
                        quarks: 0,
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
                        upgrades: []
                }
                quSave=player.quantum
        }
        if (quantumRestore || aarMod.newGamePlusPlusVersion < 2.901) {
                quSave.time = player.totalTimePlayed
                quSave.best = 9999999999
                quSave.last10 = [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]]
        }
        if (aarMod.newGamePlusPlusVersion < 2.901) {
                aarMod.quantumConf = true
                $.notify('NG++ was updated to include quantum reset.', 'info')
        }
        if (aarMod.newGamePlusPlusVersion < 2.9011 && player.autoEterOptions === undefined) {
                player.autoEterOptions = {epmult:false}
                for (dim=1;dim<9;dim++) player.autoEterOptions["td"+dim] = false
        }
        if (aarMod.newGamePlusPlusVersion < 2.9013) if (aarMod.quantumConf===undefined||quSave.times<1) aarMod.quantumConf=true
        if (aarMod.newGamePlusPlusVersion < 2.90142) aarMod.newGamePlusPlusVersion = 2.90142
        if (aarMod.newGame3PlusVersion < 1.01) aarMod.dbPower = E(getDimensionBoostPower())
        if ((aarMod.newGame3PlusVersion && !player.masterystudies) || aarMod.newGame3PlusVersion < 1.02) player.masterystudies = []
        if (aarMod.newGame3PlusVersion < 1.21) player.replicanti.chanceCost = E_pow(1e15, player.replicanti.chance * 100 + 9)
        if ((quantumRestore && player.masterystudies) || aarMod.newGame3PlusVersion < 1.5) {
                quSave.usedQuarks = {
                        r: 0,
                        g: 0,
                        b: 0
                }
                quSave.colorPowers = {
                        r: 0,
                        g: 0,
                        b: 0
                }
        }
        if ((quantumRestore && player.masterystudies) || aarMod.newGame3PlusVersion < 1.51) {
                quSave.gluons = {
                        rg: 0,
                        gb: 0,
                        br: 0
                }
        }
}

function doQuantumUpdates(){
        if (aarMod.newGame3PlusVersion < 1.511) if (player.autoEterMode !== undefined) player.autoEterMode = "amount"
        if ((quSave ? !quSave.electrons : false) && player.masterystudies) {
                quSave.electrons = {
                        amount: 0,
                        sacGals: 0,
                        mult: 2,
                        rebuyables: [0,0,0,0]
                }
        }
        if (aarMod.newGame3PlusVersion < 1.8) {
                player.eternityBuyer.dilationMode = false
                player.eternityBuyer.statBeforeDilation = 0
                player.eternityBuyer.dilationPerAmount = 10
                quSave.autobuyer = {
                        enabled: false,
                        limit: 1,
                        mode: "amount"
                }
        }
        if (aarMod.newGame3PlusVersion < 1.9) {
                player.replicanti.intervalCost = E_pow(1e10, Math.round(Math.log10(1000/player.replicanti.interval)/-Math.log10(0.9))+14)
                quSave.disabledRewards={}
                quSave.electrons.mult=2
        }
        if (aarMod.newGame3PlusVersion < 1.901 && !quSave.electrons.rebuyables) quSave.electrons.rebuyables=[0,0,0,0]
        if (aarMod.newGame3PlusVersion < 1.95) {
                quSave.multPower=0
                quSave.challenge=0
                quSave.challenges=0
        }
        if (aarMod.newGame3PlusVersion < 1.99) {
                quSave.challenge=quSave.challenge>0?[quSave.challenge]:[]
                var newChallenges={}
                for (c=1;c<=quSave.challenges;c++) newChallenges[c]=1
                quSave.challenges=newChallenges
                quSave.metaAutobuyerWait=0
        }
        if (aarMod.newGame3PlusVersion < 1.997) {
                quSave.pairedChallenges = {
                        order: {},
                        current: 0,
                        completed: 0,
                        respec: false
                }
        }
        if (aarMod.newGame3PlusVersion < 1.9975&&!quSave.challenge) quSave.challenge=[]
        if (aarMod.newGame3PlusVersion < 1.9979) {
                player.dilation.bestTP=hasAch("ng3p18")?player.dilation.tachyonParticles:E(0)
                player.old=false
        }
        if (aarMod.newGame3PlusVersion < 1.99795) player.options.animations.quarks = true
        if (aarMod.newGame3PlusVersion < 1.99799) player.respecOptions={time:player.respec,mastery:player.respec}
        if (aarMod.newGame3PlusVersion < 1.998) {
                var respecedMS=[]
                for (id=0;id<player.masterystudies.length;id++) {
                        if (player.masterystudies[id]=="t322") respecedMS.push("t323")
                        else respecedMS.push(player.masterystudies[id])
                }
                player.masterystudies=respecedMS
                quSave.autoOptions = {}
                quSave.replicants = {
                        amount: 0,
                        requirement: "1e3000000",
                        quarks: 0,
                        quantumFood: 0,
                        quantumFoodCost: 1e46,
                        workerProgress: 0,
                        workers: 0,
                        limit: 1,
                        limitCost: 1e49,
                        eggonProgress: 0,
                        eggons: 0,
                        hatchSpeed: 20,
                        hatchSpeedCost: 1e49,
                        babyProgress: 0,
                        babies: 0,
                        ageProgress: 0
                }
        }
        if (aarMod.newGame3PlusVersion < 1.9985)  quSave.multPower = {rg:Math.ceil(quSave.multPower/3),gb:Math.ceil((quSave.multPower-1)/3),br:Math.floor(quSave.multPower/3),total:quSave.multPower}
        if (aarMod.newGame3PlusVersion < 1.9986) {
                player.respec=player.respecOptions.time
                player.respecMastery=player.respecOptions.mastery
                updateRespecButtons()
                delete player.respecOptions
        }
        if (aarMod.newGame3PlusVersion < 1.998621) {
                if (getCurrentQCData().length<2) quSave.pairedChallenges.current=0
                if (quSave.pairedChallenges.completed>4) quSave.pairedChallenges.completed=0
        }
        if (aarMod.newGame3PlusVersion < 1.9987) player.eternitiesBank=0
        if (aarMod.newGame3PlusVersion < 1.99871) {
                quSave.replicants.limit=Math.min(quSave.replicants.limit,10)
                quSave.replicants.limitCost=Math.pow(200,quSave.replicants.limit-1)*1e49
                quSave.replicants.workers=Decimal.min(quSave.replicants.workers,10)
                if (quSave.replicants.workers.eq(10)) quSave.replicants.workerProgress=0
        }
        if (aarMod.newGame3PlusVersion < 1.998711) {
                quSave.quantumFood=0
                quSave.quantumFoodCost=1e46*Math.pow(5,Math.round(E(quSave.replicants.workers).toNumber()*3+E(quSave.replicants.workerProgress).toNumber()))
        }
        if (aarMod.newGame3PlusVersion < 1.99873) {
                quSave.pairedChallenges.completions = {}
                for (c=1;c<=quSave.pairedChallenges.completed;c++) {
                        var c1 = quSave.pairedChallenges.order[c][0]
                        var c2 = quSave.pairedChallenges.order[c][1]
                        quSave.pairedChallenges.completions[Math.min(c1, c2) * 10 + Math.max(c1, c2)] = c
                }
        }

        if (player.masterystudies ? aarMod.newGame3PlusVersion < 1.999 || (quSave.emperorDimensions ? quSave.emperorDimensions[1] == undefined : false) : false) { 
                var oldLength=player.masterystudies.length
                var newMS=[]
                for (var m=0;m<player.masterystudies.length;m++) {
                        var t=player.masterystudies[m].split("t")
                        if (t[1]==undefined) newMS.push(player.masterystudies[m])
                        else {
                                t=parseInt(t[1])
                                if (t!=322&&t<330) newMS.push(player.masterystudies[m])
                        }
                }
                player.masterystudies=newMS
                if (oldLength > newMS.length) forceToQuantumAndRemove = true
                quSave.replicants.quantumFoodCost = Decimal.times(quSave.replicants.quantumFoodCost, 2)
                quSave.replicants.limitDim=1
                quSave.emperorDimensions = {}
                quSave.emperorDimensions[1] = {workers: quSave.replicants.workers, progress: quSave.replicants.workerProgress, perm: Math.round(parseFloat(quSave.replicants.workers))}
                for (d=2;d<9;d++) quSave.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
                player.dontWant = false
                delete quSave.replicants.workers
                delete quSave.replicants.workerProgress
        }
        if (aarMod.newGame3PlusVersion < 1.9995) {
                if (quSave.emperorDimensions[1].perm === undefined) {
                        quSave.replicants.quantumFood = 0
                        quSave.replicants.quantumFoodCost = 1e46
                        for (d=1;d<9;d++) quSave.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
                }
                player.meta.bestOverQuantums = player.meta.bestAntimatter
                quSave.autobuyer.peakTime = 0
                quSave.nanofield = {
                        charge: 0,
                        energy: 0,
                        antienergy: 0,
                        power: 0,
                        powerThreshold: 50,
                        rewards: 0,
                        producingCharge: false
                }
                nfSave = quSave.nanofield
                quSave.reachedInfQK = false
                quSave.assignAllRatios = {
                        r: 1,
                        g: 1,
                        b: 1
                }
                quSave.notrelative = false
                quSave.wasted = false
        }
        if (aarMod.newGame3PlusVersion < 1.9997) {
                player.dilation.times = 0
                quSave.tod = {
                        r: {
                                quarks: 0,
                                spin: 0,
                                upgrades: {}
                        },
                        g: {
                                quarks: 0,
                                spin: 0,
                                upgrades: {}
                        },
                        b: {
                                quarks: 0,
                                spin: 0,
                                upgrades: {}
                        },
                        upgrades: {}
                }
                TODsave = quSave.tod
                if (nfSave.rewards>16) {
                        var newMS=[]
                        for (var m=0;m<player.masterystudies.length;m++) {
                                var d=player.masterystudies[m].split("d")
                                if (d[1]!==undefined) newMS.push(player.masterystudies[m])
                        }
                        player.masterystudies = newMS
                        nfSave.rewards = 16
                        forceToQuantumAndRemove = true
                        setTTAfterQuantum = 2e94
                }
        }
}

function doFundamentUpdates(){
	let skip = 0

	//v2.0: Fundament
	if (aarMod.newGame3PlusVersion < 2) {
		player.eternityBuyer.dilMode = "amount"
		player.eternityBuyer.tpUpgraded = false
		player.eternityBuyer.ifAD = false
		quSave.reached = quSave.times > 0
		quSave.nonMAGoalReached = {}
		quSave.pairedChallenges.fastest = {}
		quSave.qcsNoDil = {}
		quSave.pairedChallenges.pc68best = 0
		quSave.bigRip = {
			active: false,
			conf: true,
			times: 0,
			bestThisRun: 0,
			totalAntimatter: 0,
			savedAutobuyersNoBR: {},
			savedAutobuyersBR: {},
			spaceShards: 0,
			upgrades: []
		}
		quSave.breakEternity = {
			unlocked: false,
			break: false,
			eternalMatter: 0,
			upgrades: [],
			epMultPower: 0
		}
		player.ghostify = {
			reached: false,
			times: 0,
			time: player.totalTimePlayed,
			best: 9999999999,
			last10: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
			milestones: 0,
			disabledRewards: {},
			ghostParticles: 0,
			multPower: 1,
			neutrinos: {
				electron: 0,
				mu: 0,
				tau: 0,
				generationGain: 1,
				boosts: 0,
				multPower: 1,
				upgrades: []
			},
			automatorGhosts: setupAutomaticGhostsData()
		}
		brSave = quSave.bigRip
		beSave = quSave.breakEternity
		ghSave = quSave.ghostify
		player.options.animations.ghostify = true
		aarMod.ghostifyConf = true
		skip++
	}

	//v2.1: Ghostly Photons
	if (aarMod.newGame3PlusVersion < 2.1) {
		ghSave = player.ghostify
		ghSave.ghostlyPhotons = {
			unl: false,
			amount: 0,
			ghostlyRays: 0,
			darkMatter: 0,
			lights: [0,0,0,0,0,0,0,0],
			maxRed: 0,
			enpowerments: 0
		}
		skip++
	}
	if (aarMod.newGame3PlusVersion < 2.101) {
		var newAchievements=[]
		for (var a=0;a<player.achievements.length;a++) if (player.achievements[a]!="ng3p67") newAchievements.push(player.achievements[a])
		player.achievements=newAchievements
		skip++
	}

	//v2.2: Bosonic Lab
	if (aarMod.newGame3PlusVersion < 2.2) {
		ghSave.bl = {
			watt: 0,
			ticks: 0,
			speed: 1,
			am: 0,
			typeToExtract: 1,
			extracting: false,
			extractProgress: 0,
			autoExtract: 0,
			glyphs: [],
			enchants: {},
			usedEnchants: [],
			upgrades: [],
			battery: 0,
			odSpeed: 1
		}
		ghSave.wzb = {
			unl: false,
			dP: 0,
			dPUse: 0,
			wQkUp: true,
			wQkProgress: 0,
			zNeGen: 1,
			zNeProgress: 1,
			zNeReq: E(1),
			wpb: 0,
			wnb: 0,
			wb: 0
		}
		tmp.bl=ghSave.bl
		skip++
	}
	if (aarMod.newGame3PlusVersion < 2.21) {
		var oldBRUpg20Bought = brSave && brSave.upgrades.pop()
		if (oldBRUpg20Bought != 20) brSave.upgrades.push(oldBRUpg20Bought)
		skip++
	}

	//v2.3: Higgs
	if (aarMod.newGame3PlusVersion < 2.3) {
		ghSave.hb = setupHiggsSave()
		skip++
	}
	if (ghSave.hb.amount !== undefined) ghSave.hb = setupHiggsSave()
	else {
		tmp.hb = ghSave.hb

		delete tmp.hb.higgsUnspent
		delete tmp.hb.particlesUnlocked
		delete tmp.hb.field
	}

	//v2.41R: Gravity Well + Break Dilation
	if (ghSave.gravitons === undefined) skip++ //v2.4 adds Gravitons
	if (ghSave.breakDilation === undefined) skip++ //v2.41 adds Break Dilation
	if (aarMod.newGame3PlusVersion < 2.41) {
		skip++ //v2.41R reworks them
		if (player.ghostify.times) giveAchievement("A ghost fate")
	}
	aarMod.newGame3PlusVersion = 2.41

	if (skip > 1) giveAchievement("Waiting, I see...")
}

function doPostNGP3Versions() {
	if (aarMod.newGamePlusVersion < 2) {
                if (player.masterystudies!==undefined?!quSave.reached&&!ghSave.reached:true) {
                        player.money=Decimal.max(player.money,1e25)
                        player.infinitiedBank=nMx(player.infinitiedBank,1e6)
                        var filter=["timeMult","dimMult","timeMult2","unspentBonus","27Mult","18Mult","36Mult","resetMult","passiveGen","45Mult","resetBoost","galaxyBoost"]
                        for (var u=0;u<filter.length;u++) if (!player.infinityUpgrades.includes(filter[u])) player.infinityUpgrades.push(filter[u])
                        if (!hasAch("r85")) player.infMult=Decimal.times(player.infMult,4)
                        if (!hasAch("r93")) player.infMult=Decimal.times(player.infMult,4)
                        player.dimensionMultDecrease=2
                        player.tickSpeedMultDecrease=1.65
                        player.eternities=nMx(player.eternities,100)
                        for (var c=2;c<(player.tickspeedBoosts!==undefined?16:player.galacticSacrifice!==undefined?15:13);c++) if (!player.challenges.includes("challenge"+c)) player.challenges.push("challenge"+c)
                        player.replicanti.unl=true
                        player.replicanti.amount=Decimal.max(player.replicanti.amount,1)
                        if (!player.dilation.studies.includes(1)) player.dilation.studies.push(1)
                }
                if (!hasAch("r77")) player.achievements.push("r77")
                if (!hasAch("r78")) player.achievements.push("r78")
                if (!hasAch("r85")) player.achievements.push("r85")
                if (!hasAch("r93")) player.achievements.push("r93")
                if (!hasAch("r95")) player.achievements.push("r95")
                if (!hasAch("r102")) player.achievements.push("r102")
                if (!hasAch("r131")) player.achievements.push("r131")
                aarMod.newGamePlusVersion=2
        }
        if (aarMod.newGameMinusMinusVersion === undefined && !player.meta) {
                if (player.exdilation == undefined && player.version == 13) player.version = 12
                if (player.galacticSacrifice) {
                        player.galacticSacrifice.time = (player.lastUpdate - player.galacticSacrifice.last) / 100
                        aarMod.newGameMinusMinusVersion = 1.29
                        delete player.galacticSacrifice.last
                } else if (player.galaxyPoints) aarMod.newGameMinusMinusVersion = 1.1
                else if ((Decimal.gt(player.postC3Reward, 1) && player.infinitied < 1 && player.eternities < 1) || (Math.round(E(player.achPow).log(5) * 100) % 100 < 1 && Decimal.gt(player.achPow, 1))) aarMod.newGameMinusMinusVersion = 1
                if (player.firstTotalBought != undefined) {
                        player.totalBoughtDims = {}
                        for (d=1;d<9;d++) {
                                var name = TIER_NAMES[d]
                                player.totalBoughtDims[name] = player[name + "TotalBought"]
                                delete player[name + "TotalBought"]
                        }
                        aarMod.newGameMinusMinusVersion = 1.295
                }
                if (player.tickBoughtThisInf) {
                        var haveAutoSacrifice = player.autobuyers[12] % 1 !== 0
                        player.autoSacrifice = haveAutoSacrifice ? player.autobuyers[12] : 1
                        if (haveAutoSacrifice) {
                                player.autoSacrifice.priority = E(player.autoSacrifice.priority)
                                el("prioritySac").value = player.autoSacrifice.priority
                                el("13ison").checked = player.autoSacrifice.isOn
                        }
                        var popThis = player.autobuyers.pop()
                        var haveAutoGalSacrifice = popThis % 1 !== 0
                        player.autobuyers[12] = haveAutoGalSacrifice ? popThis : 13
                        if (haveAutoGalSacrifice) {
                                player.autobuyers[12].priority = E(player.autobuyers[12].priority)
                                el("priority14").value = player.autobuyers[12].priority
                                el("14ison").checked = player.autobuyers[12].isOn
                        }
                        aarMod.newGameMinusMinusVersion = 1.301
                        updateAutobuyers()
                }
                if (player.dimPowerIncreaseCost) {
                        if (player.challengeTimes[12]) aarMod.newGameMinusMinusVersion = 1.41
                        else aarMod.newGameMinusMinusVersion = 1.4
                }
                if (player.infchallengeTimes[8]) {
                        player.currentChallenge=renameIC(player.currentChallenge)
                        for (c=0;c<player.challenges.length;c++) player.challenges[c]=renameIC(player.challenges[c])
                        player.postC4Tier=player.postC6Tier
                        delete player.postC6Tier
                        aarMod.newGameMinusMinusVersion = 1.5
                        updateChallenges()
                }
                if (E_pow(1e15, player.replicanti.chance*100).times(1e135).div(player.replicanti.chanceCost).gte(1e59)) aarMod.newGameMinusMinusVersion = 2
                if (aarMod.newGameMinusMinusVersion) updateAchievements()
        }
}

function doNGm2v11tov3(){
        if (aarMod.newGameMinusMinusVersion < 1.1) player.galaxyPoints = 0
        if (aarMod.newGameMinusMinusVersion < 1.2) {
                player.galacticSacrifice = {}
                player.galacticSacrifice = resetGalacticSacrifice()
                player.galacticSacrifice.galaxyPoints = player.galaxyPoints
                $.notify('Your NG-- save has been updated because dan-simon made upgrades for Galactic Sacrifice.', 'info')
                aarMod.newGameMinusMinusVersion = 1.2
                delete player.galaxyPoints
        }
        if (aarMod.newGameMinusMinusVersion < 1.21) {
                if (player.galacticSacrifice.upgrades.includes(11)) for (d=1;d<8;d++) {
                        var name = TIER_NAMES[d]
                        player[name+"Cost"] = Decimal.div(player[name+"Cost"], 10)
                }
        }
        if (aarMod.newGameMinusMinusVersion < 1.22) {
                if (player.galacticSacrifice.upgrades.includes(11)) for (d=1;d<8;d++) {
                        var name = TIER_NAMES[d]
                        player[name+"Cost"] = Decimal.div(player[name+"Cost"], 10)
                }
        }
        if (aarMod.newGameMinusMinusVersion < 1.24) {
                if (ECComps("eterc6")>0) {
                        forceHardReset=true
                        inflationCheck=true
                        reset_game()
                        forceHardReset=false
                        return
                }
        }
        if (aarMod.newGameMinusMinusVersion < 1.26) {
                if (player.galacticSacrifice.upgrades.includes(11)) for (d=1;d<8;d++) {
                        var name = TIER_NAMES[d]
                        player[name+"Cost"] = Decimal.times(player[name+"Cost"], 100)
                }
                reduceDimCosts()
        }
        if (aarMod.newGameMinusMinusVersion < 1.295) player.totalBoughtDims = {}
        if (aarMod.newGameMinusMinusVersion < 1.3) {
                player.options.gSacrificeConfirmation = player.options.sacrificeConfirmation
                player.tickBoughtThisInf = resetTickBoughtThisInf()
                player.autobuyers.push(13)
                updateAutobuyers()
        }
        if (aarMod.newGameMinusMinusVersion < 1.3005) {
                if (player.autobuyers[10].interval) player.autobuyers[10].interval = Math.max(player.autobuyers[10].interval / 2.5, 100);
                if (player.autobuyers[11].interval) player.autobuyers[11].interval = Math.max(player.autobuyers[11].interval / 5, 100);
        }
        if (aarMod.newGameMinusMinusVersion < 1.301 && player.currentChallenge=="challenge14" && player.tickBoughtThisInf.pastResets.length<1) player.tickBoughtThisInf.pastResets.push({resets:player.resets,bought:player.tickBoughtThisInf.current-E(player.tickSpeedCost).e+3})
        if (aarMod.newGameMinusMinusVersion < 1.4) {
                if (player.autobuyers.length>14) {
                        var haveAutoSacrifice = player.autobuyers[12] % 1 !== 0
                        player.autoSacrifice = haveAutoSacrifice ? player.autobuyers[12] : 1
                        if (haveAutoSacrifice) {
                                player.autoSacrifice.priority = E(player.autoSacrifice.priority)
                                el("prioritySac").value = player.autoSacrifice.priority
                                el("13ison").checked = player.autoSacrifice.isOn
                        }
                        var popThis = player.autobuyers.pop()
                        var haveAutoGalSacrifice = popThis % 1 !== 0
                        player.autobuyers[12] = haveAutoGalSacrifice ? popThis : 13
                        if (haveAutoGalSacrifice) {
                                player.autobuyers[12].priority = E(player.autobuyers[12].priority)
                                el("priority14").value = player.autobuyers[12].priority
                                el("14ison").checked = player.autobuyers[12].isOn
                        }
                } else if (player.autoSacrifice === 0) player.autoSacrifice = 1
                player.extraDimPowerIncrease = 0
                player.dimPowerIncreaseCost = 1e3
        }
        if (aarMod.newGameMinusMinusVersion < 1.41) {
                if (player.version == 13) player.version = 12
                player.challengeTimes.push(600*60*24*31)
                player.challengeTimes.push(600*60*24*31)
                aarMod.newGameMinusMinusVersion = 1.41
        }
        if (aarMod.newGameMinusMinusVersion < 1.5) {
                player.infchallengeTimes.push(600*60*24*31)
                player.infchallengeTimes.push(600*60*24*31)
                aarMod.newGameMinusMinusVersion = 1.5
        }
        if (aarMod.newGameMinusMinusVersion < 1.9) {
                player.replicanti.chanceCost=player.replicanti.chanceCost.div(1e60)
                player.replicanti.intervalCost=player.replicanti.intervalCost.div(1e60)
                player.replicanti.galCost=player.replicanti.galCost.div(1e60)
        }
        if (aarMod.newGameMinusMinusVersion < 1.91) {
                for (tier=1;tier<9;tier++) {
                        let dim = player["infinityDimension"+tier]
                        dim.cost = E_pow(getIDCostMult(tier),dim.baseAmount/10).times(infBaseCost[tier])
                }
        }
        if (aarMod.newGameMinusMinusVersion < 2) {
                for (tier=1;tier<9;tier++) {
                        let dim = player["infinityDimension"+tier]
                        dim.power = E_pow(getInfBuy10Mult(tier), dim.baseAmount/10)
                }
        }
        if (aarMod.newGameMinusMinusVersion < 3) aarMod.newGameMinusMinusVersion = 3
}

function doNGm3v21tov3202() {
        if (aarMod.newGame3MinusVersion < 2.1) {
                player.autobuyers[13]=14
                player.overXGalaxiesTickspeedBoost=1
                player.challengeTimes.push(600*60*24*31)
        }
        if (aarMod.newGame3MinusVersion < 2.2) {
                player.dimPowerIncreaseCost*=300
                var newChallRecords = []
                for (c=0;c<2;c++) newChallRecords.push(player.infchallengeTimes[c])
                newChallRecords.push(600*60*24*31)
                newChallRecords.push(600*60*24*31)
                for (c=2;c<10;c++) newChallRecords.push(player.infchallengeTimes[c])
                player.infchallengeTimes=newChallRecords
        }
        if (aarMod.newGame3MinusVersion < 3) {
                var newUpgs=[]
                for (var u=0;u<player.galacticSacrifice.upgrades.length;u++) if (player.galacticSacrifice.upgrades[u]!=34) newUpgs.push(player.galacticSacrifice.upgrades[u])
                player.galacticSacrifice.upgrades=newUpgs
                aarMod.newGame3MinusVersion = 3
                aarMod.ngmX=aarMod.newGame4MinusVersion?4:3
                if (aarMod.ngmX>3) reduceDimCosts()
        } else if (!aarMod.ngmX && player.tickspeedBoosts !== undefined) {
                aarMod.newGame4MinusVersion = 1
                aarMod.ngmX=4
                reduceDimCosts()
        }
        if (aarMod.newGame3MinusVersion < 3.201) {
                player.infchallengeTimes.push(600*60*24*31)
                player.infchallengeTimes.push(600*60*24*31)
                aarMod.newGame3MinusVersion = 3.201
        }
        if (aarMod.newGame3MinusVersion < 3.202) {
                player.replicanti.chanceCost = pow10(150)
                player.replicanti.intervalCost = pow10(140)
                player.replicanti.galCost = pow10(170)
                aarMod.newGame3MinusVersion = 3.202
        }
}

function doERSv0tov102(){
        if (aarMod.ersVersion === undefined && player.timestudy.studies.length>0 && typeof(player.timestudy.studies[0])!=="number") {
                newAchievements=[]
                for (id=0;id<player.achievements.length;id++) {
                        var r=player.achievements[id].split("r")[1]
                        newAchievements.push(r==105?"r117":player.achievements[id])
                }
                player.achievements=newAchievements
                player.dimlife=true
                player.dead=true
                for (d=1;d<9;d++) {
                        var name = TIER_NAMES[d]
                        if (costMults[d].lt(player.costMultipliers[d-1])) player[name+"Bought"] += (Math.round(Decimal.div(player.costMultipliers[d-1],costMults[d]).log(player.dimensionMultDecrease))+Math.ceil(Decimal.div(Number.MAX_VALUE,initCost[d]).log(costMults[d]))-1)*10
                        else player[name+"Bought"] += Decimal.div(player[name+"Cost"],initCost[d]).log(costMults[d])*10
                        if (player[name+"Bought"]>0) {
                                if (d>1) player.dead=false
                                if (d<8) player.dimlife=false
                        }
                }
                player.boughtDims=[]
                player.timestudy.ers_studies=[null]
                for (s=1;s<7;s++) player.timestudy.ers_studies[s]=player.timestudy.studies[s]?player.timestudy.studies[s]:0
                player.timestudy.studies=[]
                if (player.eternityChallenges) {
                        player.currentEternityChall=player.eternityChallenges.current?"eterc"+player.eternityChallenges.current:""
                        player.eternityChallUnlocked=player.eternityChallenges.unlocked?"eterc"+player.eternityChallenges.unlocked:0
                        player.eternityChalls={}
                        for (c in player.eternityChallenges.done) player.eternityChalls["eterc"+c]=player.eternityChallenges.done[parseInt(c)]
                }
                player.tickspeed=player.tickspeed.div(E_pow(getTickSpeedMultiplier(),player.totalTickGained))
                player.totalTickGained=0
                player.tickThreshold=E(1)
                if (player.darkMatter) {
                        player.eterc8repl=player.ec8PurchasesMade.repl
                        player.eterc8ids=player.ec8PurchasesMade.ids
                }
                aarMod.ersVersion=1
                delete player.eternityChallenges
        }
        if (aarMod.ersVersion<1.02) {
                if (hasAch("r85")) player.infMult=player.infMult.times(4)
                if (hasAch("r93")) player.infMult=player.infMult.times(4)
                aarMod.ersVersion=1.02
        }
}

function doNGExpv0tov111(){
        if (aarMod.newGameExpVersion === undefined && !player.masterystudies && Decimal.gt(player.infMultCost,10) && Math.round(Decimal.div(player.infMultCost,10).log(4)*1e3)%1e3<1) aarMod.newGameExpVersion = 1
        if (aarMod.newGameExpVersion < 1.11) aarMod.newGameExpVersion = 1.11
}

function doNGUdv0tov11(){
        if (aarMod.newGameUpdateVersion === undefined && player.exdilation != undefined) {
                aarMod.newGameUpdateVersion=1.01
                player.options.animations.blackHole=true
                aarMod.dilationConf=player.options.dilationconfirm
                var newAchievements=[]
                for (id=0;id<player.achievements.length;id++) {
                        r=player.achievements[id].split("r")[1]
                        newAchievements.push(r==148?"ngpp13":r==146?"ngpp18":r>140?"ngud"+(r-130):player.achievements[id])
                        if (r>138) v2_3check=true
                }
                player.achievements=newAchievements
                delete player.options.dilationconfirm
                updateAchievements()
                if (player.version==13) {
                        player.version=12
                        var newDilUpgs=[]
                        for (var u=0;u<player.dilation.upgrades.length;u++) {
                                var id=player.dilation.upgrades[u]
                                if (id>10) id="ngud"+(id-10)
                                newDilUpgs.push(id)
                        }
                        player.dilation.upgrades=newDilUpgs
                        aarMod.newGameUpdateVersion=1.1
                }
        }
        if (aarMod.newGameUpdateVersion<1.01) player.blackholeDimension4.cost=Decimal.min(player.blackholeDimension4.cost,"1e20000")
        if (aarMod.newGameUpdateVersion<1.1) {
                player.version = 12
                aarMod.newGameUpdateVersion=1.1
        }
}

function doExdilationIfUndefined(){
        if (player.exdilation !== undefined) {
                if (player.options.exdilationconfirm === undefined) player.options.exdilationconfirm = true
                if (player.options.exdilationConfirm !== undefined) {
                        player.options.exdilationconfirm = player.options.exdilationConfirm
                        delete player.options.exdilationConfirm
                }
                if (player.meta !== undefined && player.exdilation.spent[4] === undefined) player.exdilation.spent[4] = 0
        }
}

function doIRSv0tov12(){
        if (aarMod.irsVersion < 1.1) {
                player.singularity = {
                        unlocked: false,
                        sacrificed: 0,
                        upgraded: 0,
                        singularityPower: 0,
                        darkMatter: 0
                }
        }
        if (aarMod.irsVersion < 1.2) {
                player.dimtechs = {
                        unlocked: false,
                        discounts: 0,
                        tickUpgrades: 0,
                        respec: false
                }
                for (dim=1;dim<9;dim++) player.dimtechs["dim"+dim+"Upgrades"] = 0
                aarMod.irsVersion = 1.2
        }
}

function doNGM4v0tov2111(){
        if (aarMod.newGame4MinusVersion<2) {
                player.tdBoosts=0
                resetTDs()
        }
        if (aarMod.newGame4MinusVersion<2.1) {
                if ((player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0 || (quSave !== undefined && quSave.times > 0) || (ghSave !== undefined && ghSave.times > 0)) && !player.challenges.includes("challenge1")) player.challenges.push("challenge1")
                player.autobuyers.push(15)
                player.challengeTimes.push(600*60*24*31)
        }
        if (aarMod.newGame4MinusVersion<2.111) aarMod.newGame4MinusVersion=2.111
}

function doNGM5v0tov052(){
        if (aarMod.ngm5V<0.1) aarMod.ngm5V=0.1
        if (aarMod.ngm5V<0.5) {
                player.infDimensionsUnlocked[0]=true
                resetIDs_ngm5()
                resetPDs(true)
        }
        if (aarMod.ngm5V<0.52) aarMod.ngm5V=0.52
}

function doNGSPUpdatingVersion(){
        if (aarMod.nguspV !== undefined) {
                if (player.blackholeDimension5 === undefined) for (var d=5;d<9;d++) player["blackholeDimension"+d] = {
                        cost: blackholeDimStartCosts[d],
                        amount: 0,
                        power: 1,
                        bought: 0
                }
                if (player.dilation.autoUpgrades === undefined) player.dilation.autoUpgrades = []
        }
}

function doInitInfMultStuff(){
        ipMultPower=2
        if (player.masterystudies) if (player.masterystudies.includes("t241")) ipMultPower=2.2
        if (GUBought("gb3")) ipMultPower=2.3
        if (aarMod.newGameExpVersion !== undefined) ipMultCostIncrease=4
        else ipMultCostIncrease=10
        el("infiMult").innerHTML = "You gain " + ipMultPower + "x more IP.<br>Currently: "+shortenDimensions(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
}

function dov12tov122(){
        if (player.version < 12) {
                for (i=1; i<5; i++) {
                        if (player["timeDimension"+i].cost.gte("1e1300")) {
                                player["timeDimension"+i].cost = E_pow(timeDimCostMults[i]*2.2, player["timeDimension"+i].bought).times(timeDimStartCosts[i])
                        }
                }
                if (player.bestEternity <= 0.01 || player.bestInfinityTime <= 0.01) giveAchievement("Less than or equal to 0.001");
        }
        if (player.version < 12.1) {
                if (hasAch("s36")) {
                        player.achievements.splice(player.achievements.indexOf("s36"), 1)
                        updateAchievements();
                }
        }
        if (player.version < 12.2) {
                player.version = 12.2
                player.sixthCost = Decimal.times(player.sixthCost, 10)
                if (player.meta) player.meta[6].cost = Decimal.times(player.meta[6].cost, 10)
        }
}

function updateVersionsONLOAD(){
	dov7tov10()
	doNGM1Versions()
	if (aarMod.newGamePlusVersion === undefined) if (player.eternities < 20 && ECComps("eterc1") > 0) aarMod.newGamePlusVersion = 1
	doInitNGp2NOT3Stuff()
	doNGP2v2tov2302()

	//NG+3
	doQuantumRestore()
	doQuantumUpdates()
	doFundamentUpdates()

	doPostNGP3Versions()
	doNGm2v11tov3()
	doNGm3v21tov3202()
	doERSv0tov102()
	doNGExpv0tov111()
	doNGUdv0tov11()
	doExdilationIfUndefined()
	if (aarMod.ngudpV < 1.12) aarMod.ngudpV = 1.12
	if (aarMod.nguepV < 1.03) aarMod.nguepV = 1.03
	doIRSv0tov12()
	doNGM4v0tov2111()
	doNGM5v0tov052()
	doNGSPUpdatingVersion()
	doInitInfMultStuff()
	dov12tov122()
}

function doNGp3Init2(){
        ghostified = tmp.ngp3 && ghSave.times > 0 
        quantumed = player.meta !== undefined && (ghostified || quSave.times > 0)

        updateBosonicLimits()
        if (tmp.ngp3) {
                setupMasteryStudies()
                updateUnlockedMasteryStudies()
                updateSpentableMasteryStudies()
        }
        updateTemp()
        
        if (tmp.ngp3) {
                delete player.eternityBuyer.presets
                el('prioritydil').value=player.eternityBuyer.dilationPerAmount
                if (player.meta.bestOverQuantums === undefined) player.meta.bestOverQuantums = player.meta.bestAntimatter
                updateColorPowers()
                tmp.be=brSave.active&&beSave.break
                el("eggonsCell").style.display = ghSave.neutrinos.upgrades.includes(2) ? "none" : ""
                el("workerReplWhat").textContent = ghSave.neutrinos.upgrades.includes(2) ? "babies" : "eggons"
                updateQuantumWorth()
                if (quSave.autoOptions === undefined) quSave.autoOptions = {}
                if (quSave.nonMAGoalReached === undefined || !quSave.nonMAGoalReached.length) quSave.nonMAGoalReached = []
                if (quSave.qcsMods === undefined) quSave.qcsMods = {current:[]}
                if (quSave.challengeRecords === undefined) quSave.challengeRecords = {}
                if (quSave.pairedChallenges.completions === undefined) quSave.pairedChallenges.completions = {}
                if (quSave["10ofield"] !== undefined) {
                        nfSave = quSave["10ofield"]
                        delete quSave["10ofield"]
                }
                if (nfSave.powerThreshold === undefined) {
                        nfSave.powerThreshold = 50
                        nfSave.producingCharge = false
                }
                if (quSave.autobuyer.peakTime === undefined) quSave.autobuyer.peakTime = 0
                if (nfSave.rewards>17&&todSave.upgrades[1]==undefined&&!ghSave.reached&&!aarMod.ngp4V) {
                        var newMS=[]
                        for (var m=0;m<player.masterystudies.length;m++) {
                                var d=player.masterystudies[m].split("d")
                                if (d[1]!==undefined) newMS.push(player.masterystudies[m])
                        }
                        player.masterystudies = newMS
                        nfSave.rewards = 16
                        forceToQuantumAndRemove = true
                        setTTAfterQuantum = 2e94
                }
                if (brSave.bestGals == undefined) brSave.bestGals = 0
                if (ghSave.neutrinos.boosts == undefined|| !ghSave.times) ghSave.neutrinos.boosts = 0
                if (ghSave.ghostlyPhotons.maxRed == undefined) ghSave.ghostlyPhotons.maxRed = 0
                if (ghSave.wzb.unl) giveAchievement("Even Ghostlier than before")
                for (var g = tmp.bl.glyphs.length + 1; g <= br.maxLimit; g++) tmp.bl.glyphs.push(0)
                if (!tmp.bl.usedEnchants.length) tmp.bl.usedEnchants=[]
                if (ghSave.wzb.dPUse === undefined) {
                        ghSave.wzb.dPUse = 0
                        ghSave.wzb.wQkUp = true
                        ghSave.wzb.zNeGen = 1
                }
                tmp.bl.odSpeed = Math.max(tmp.bl.odSpeed, 1)
                if (Decimal.eq(ghSave.wzb.zNeReq, 0)) ghSave.wzb.zNeReq = E(1)
                updateAutoGhosts(true)
        }
}

function setConfirmationsDisplay(){
        el("confirmations").style.display = (player.resets > 4 || player.galaxies > 0 || (player.galacticSacrifice ? player.galacticSacrifice.times > 0 : false) || player.infinitied !== 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
        el("confirmation").style.display = (player.resets > 4 || player.infinitied > 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
        el("sacrifice").style.display = (player.resets > 4 || player.infinitied > 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
        el("sacConfirmBtn").style.display = (player.resets > 4 || player.galaxies > 0 || (player.galacticSacrifice ? player.galacticSacrifice.times > 0 : false) || player.infinitied > 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
        var gSacDisplay = !player.galacticSacrifice ? "none" : player.galaxies > 0 || player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities !== 0 || quantumed ? "inline-block" : "none"
        el("gConfirmation").style.display = gSacDisplay
        el("gSacrifice").style.display = gSacDisplay
        el("gSacConfirmBtn").style.display = gSacDisplay
        el("challengeconfirmation").style.display = (player.challenges.includes("challenge1") || player.infinitied !== 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
        el("eternityconf").style.display = (player.eternities !== 0 || quantumed) ? "inline-block" : "none"
        el("dilationConfirmBtn").style.display = (player.dilation.studies.includes(1) || quantumed) ? "inline-block" : "none"
        el("quantumConfirmBtn").style.display = quantumed ? "inline-block" : "none"
        el("bigRipConfirmBtn").style.display = (player.masterystudies === undefined ? false : brSave.times) ? "inline-block" : "none"
        el("ghostifyConfirmBtn").style.display = ghostified ? "inline-block" : "none"
        el("leConfirmBtn").style.display = ghostified && ghSave.ghostlyPhotons.enpowerments ? "inline-block" : "none"

        el("confirmation").checked = !player.options.sacrificeConfirmation
        el("sacConfirmBtn").textContent = "Sacrifice confirmation: O" + (player.options.sacrificeConfirmation ? "N" : "FF")
        el("gConfirmation").checked = !player.options.gSacrificeConfirmation
        el("gSacConfirmBtn").textContent = "Galactic sacrifice confirmation: O" + (player.options.gSacrificeConfirmation ? "N" : "FF")
        el("challengeconfirmation").textContent = "Challenge confirmation: O" + (player.options.challConf ? "N" : "FF")
        el("eternityconf").textContent = "Eternity confirmation: O" + (player.options.eternityconfirm ? "N" : "FF")
        el("dilationConfirmBtn").textContent = "Dilation confirmation: O" + (aarMod.dilationConf ? "N" : "FF")
        el("exdilationConfirmBtn").textContent = "Reverse dilation confirmation: O" + (player.options.exdilationconfirm ? "N" : "FF")
        el("quantumConfirmBtn").textContent = "Quantum confirmation: O" + (aarMod.quantumConf ? "N" : "FF")
        el("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + ((player.masterystudies === undefined ? false : brSave.conf) ? "N" : "FF")
        el("ghostifyConfirmBtn").textContent = "Ghostify confirmation: O" + (aarMod.ghostifyConf ? "N" : "FF")
        el("leConfirmBtn").textContent = "Spectral Ion confirmation: O" + (aarMod.leNoConf ? "FF" : "N")
}

function setOptionsDisplaysStuff1(){
        el("progressBarBtn").textContent = (aarMod.progressBar?"Hide":"Show")+" progress bar"
        el("toggleLogRateChange").textContent = "Logarithm rate: O"+(aarMod.logRateChange?"N":"FF")
        el("tabsSave").textContent = "Saved tabs: O"+(aarMod.tabsSave.on?"N":"FF")
        updatePerformanceTicks()
        dimDescEnd = (aarMod.logRateChange?" OoM":"%")+"/s)"

        el("maxHighestTD").parentElement.parentElement.style.display = aarMod.ngmX > 3 ? "" : "none"
        el("maxHighestTD").textContent = "Max only highest Time Dimensions: O"+(aarMod.maxHighestTD?"N":"FF")

        el("quickMReset").style.display = pSacrificed() ? "" : "none"
        el("quickMReset").textContent = "Quick matter reset: O"+(aarMod.quickReset?"N":"FF")

        el("quantumtabbtn").style.display = quantumed ? "" : "none"
        el("ghostifytabbtn").style.display = ghostified ? "" : "none"

        el("chartDurationInput").value = player.options.chart.duration;
        el("chartUpdateRateInput").value = player.options.chart.updateRate;
        if (player.options.chart.on) el("chartOnOff").checked = true
        else el("chartOnOff").checked = false
        if (player.options.chart.dips) el("chartDipsOnOff").checked = true
        else el("chartDipsOnOff").checked = false
 
        if (player.options.theme == "Dark" || player.options.theme == "Dark Metro") {
                Chart.defaults.global.defaultFontColor = '#888';
                normalDimChart.data.datasets[0].borderColor = '#888'
        } else {
                Chart.defaults.global.defaultFontColor = 'black';
                normalDimChart.data.datasets[0].borderColor = '#000'
        }

        el("infmultbuyer").style.display = getEternitied()>0||player.masterystudies?"inline-block":"none"
        if (!player.options.hotkeys) el("hotkeys").textContent = "Enable hotkeys"

        document.getElementsByClassName("hideInMorse").display = player.options.notation == "Morse code" ? "none" : ""

        el("hideProductionTab").textContent = (aarMod.hideProductionTab?"Show":"Hide")+" production tab"
        el("hideRepresentation").textContent=(aarMod.hideRepresentation?"Show":"Hide")+" antimatter representation"
        el("showAchRowNums").textContent=(aarMod.showAchRowNums?"Hide":"Show")+" achievement row info"
        el("hideCompletedAchs").textContent=(aarMod.hideCompletedAchs?"Show":"Hide")+" completed achievement rows"
        el("hideSecretAchs").textContent=(aarMod.hideSecretAchs?"Show":"Hide")+" secret achievements"
}

function setDisplaysStuff1(){
        el("secretstudy").style.opacity = 0
        el("secretstudy").style.cursor = "pointer"
  
        el("bestAntimatterType").textContent = player.masterystudies && quantumed ? "Your best meta-antimatter for this quantum" : "Your best-ever meta-antimatter"

        el("masterystudyunlock").style.display = player.dilation.upgrades.includes("ngpp6") && player.masterystudies ? "" : "none"
        el("respecMastery").style.display = player.dilation.upgrades.includes("ngpp6") && player.masterystudies ? "block" : "none"
        el("respecMastery2").style.display = player.dilation.upgrades.includes("ngpp6") && player.masterystudies ? "block" : "none"

        if (player.galacticSacrifice) {
                el("galaxy11").innerHTML = "Normal"+(aarMod.ngmX>3?" and Time D":" d")+"imensions are "+(player.infinitied>0||getEternitied()!==0||quantumed?"cheaper based on your Infinities.<br>Currently: <span id='galspan11'></span>x":"99% cheaper.")+"<br>Cost: 1 GP"
                el("galaxy15").innerHTML = "Normal and Time Dimensions produce "+(player.infinitied>0||getEternitied()!==0||quantumed?"faster based on your Infinities.<br>Currently: <span id='galspan15'></span>x":"100x faster")+".<br>Cost: 1 GP"
        } else {
                el("infi21").innerHTML = "Increase the multiplier for buying 10 Dimensions<br>"+(aarMod.newGameExpVersion?"20x -> 24x":"2x -> 2.2x")+"<br>Cost: 1 IP"
                el("infi33").innerHTML = "Increase Dimension Boost multiplier<br>2x -> 2.5x<br>Cost: 7 IP"
        }
        var resetSkipCosts=[20,40,80]
        for (u=1;u<4;u++) el("infi4"+u).innerHTML="You start with the "+(u+4)+"th dimension unlocked"+(player.tickspeedBoosts==undefined?"":" and "+(u*4)+" tickspeed boosts")+"<br>Cost: "+resetSkipCosts[u-1]+" IP"
        el("infi44").innerHTML="You start with the 8th dimension unlocked"+(player.tickspeedBoosts==undefined?"":", 16 tickspeed boosts")+", and a Galaxy<br>Cost: 500 IP"
}

function setChallengeDisplay(){
        var showMoreBreak = player.galacticSacrifice ? "" : "none"
        for (i=1;i<5;i++) el("postinfi0"+i).parentElement.style.display=showMoreBreak
        el("d1AutoChallengeDesc").textContent=(aarMod.ngmX>3?"Galactic Sacrifice":"Big Crunch")+" for the first time."
        el("d5AutoChallengeDesc").textContent=aarMod.ngexV?"Each Dimension Boost reduces your tickspeed reduction by 0.1% additively, but galaxies are 50% stronger.":player.galacticSacrifice?"Tickspeed upgrades"+(player.tickspeedBoosts==undefined?"":" and Tickspeed Boosts")+(aarMod.ngmX>3?" are weaker":" start out useless")+", but galaxies make them stronger.":"Tickspeed starts at 7%."
        el("tbAutoChallengeDesc").textContent=player.tickspeedBoosts==undefined?"Whenever you buy 10 of a dimension or tickspeed, everything else of equal cost will increase to its next cost step.":"You can't get Tickspeed Boosts and Antimatter Galaxies are 25% weaker."
        el("autoDBChallengeDesc").textContent="There are only 6 dimensions, with Dimension Boost"+(player.tickspeedBoosts==undefined?"":", Tickspeed Boost,")+" and Antimatter Galaxy costs modified."
        el("autoCrunchChallengeDesc").textContent="Each Normal Dimension produces the Dimension 2 tiers before it; First Dimensions produce reduced antimatter. "+(player.galacticSacrifice?"Galaxies are far more powerful.":"")
        el("autoDSChallengeDesc").textContent=player.tickspeedBoosts==undefined?"Per-ten multiplier is always 1x, but the product of dimensions bought multiplies all dimensions.":"The product of amount is used instead of the product of bought."
        el("autoGSChallengeDesc").textContent=aarMod.ngmX>3?"You can hold up to 10 total Dimension Boosts, Time Dimension Boosts, Tickspeed Boosts, and Galaxies.":(aarMod.ngmX>2?"All galaxy upgrades from the third column are disabled and Tickspeed Boosts give 20 free tickspeed purchases each instead.":"You can only get 308 tickspeed upgrades. This count does not reset on resets.")
        el("autoTBChallengeDesc").textContent=aarMod.ngmX>3?"Dimension Boosts and Time Dimension Boosts divide Tickspeed Multiplier instead.":"Dimension Boosts and Galaxies only boost Galaxy point gain and Tickspeed Boosts are nerfed, but Galaxy points boost Tickspeed Boosts."
        el("infPowEffectPowerDiv").innerHTML=player.galacticSacrifice&&player.pSac==undefined?"Raised to the power of <span id='infPowEffectPower' style='font-size:35px; color: black'></span>, t":"T"
        el("ngmmchalls").style.display=player.galacticSacrifice?"":"none"
        el("ngmmmchalls").style.display=player.tickspeedBoosts==undefined?"none":""
        el("ngm4chall").style.display=aarMod.ngmX>3?"":"none"
        el("irschalls").style.display=player.infinityUpgradesRespecced==undefined?"none":""
}

function setInfChallengeDisplay(){
        if (player.galacticSacrifice) {
                order=['postcngmm_1','postcngmm_2','postcngmm_3','postc1','postc2','postc4','postc5','postc6','postc7','postc8']
                el("icngmm_row").style.display=""
                el("icngmm_3div").style.display=""
                el("ic2div").style.display="none"
                el("icngmm_4div").style.display=""
                el("ic3div").style.display="none"
                el("icngmm_4div").appendChild(el("postc2").parentElement.parentElement)
        } else {
                order=['postc1','postc2','postc3','postc4','postc5','postc6','postc7','postc8']
                el("icngmm_row").style.display="none"
                el("icngmm_3div").style.display="none"
                el("ic2div").style.display=""
                el("icngmm_4div").style.display="none"
                el("ic3div").style.display=""
                el("ic2div").appendChild(el("postc2").parentElement.parentElement)
        }
        el("postc2reward").textContent = "Reward: "+(player.galacticSacrifice?"S":"Get the sacrifice autobuyer, and s")+"acrifice is more powerful."
        if (player.tickspeedBoosts == undefined) {
                el("icngm3_row").style.display="none"
                el("icngm3_row2").style.display="none"
                el("icngm3_div1").style.display="none"
                galCosts[31]=2
	        galCosts[12]=3
	        galCosts[32]=8
	        galCosts[13]=20
	        galCosts[33]=1e3
                el("ic4div").appendChild(el("postc4").parentElement.parentElement)
                el("ic4div").style.display=""
        } else {
                el("icngm3_row").style.display=""
                el("icngm3_row2").style.display=""
                el("icngm3_div1").style.display=""
                order=['postcngmm_1','postcngmm_2','postcngm3_1','postcngm3_2','postcngmm_3','postc1','postc2','postcngm3_3','postc4','postcngm3_4','postc5','postc6','postc7','postc8']
	        galCosts[31]=5
	        galCosts[12]=5
	        galCosts[32]=20
	        galCosts[13]=50
	        galCosts[33]=1e15
                el("icngm3_div2").appendChild(el("postc4").parentElement.parentElement)
                el("ic4div").style.display="none"
        }
}

function setOtherChallDisplay(){
        el("galaxy21").innerHTML=(player.tickspeedBoosts!=undefined?"Reduce the Dimension Boost cost multiplier to "+(aarMod.ngmX>3?10:5):"Dimension Boost scaling starts 2 boosts later, and increases the cost by 5 each")+".<br>Cost: 1 GP"
        el("galaxy12").innerHTML="Normal "+(aarMod.ngmX>3?"and Time D":"D")+"imensions gain a multiplier based on time spent in this Galactic Sacrifice.<br>Currently: <span id='galspan12'>x</span>x<br>Cost: "+galCosts[12]+" GP"
        el("galBuff22").textContent=aarMod.ngmX>3?2:5
        el("galaxy13").innerHTML="Normal "+(aarMod.ngmX>3?"and Time D":"D")+"imensions gain a multiplier based on your Galaxy points.<br>Currently: <span id='galspan13'>x</span>x<br>Cost: "+galCosts[13]+" GP"
        el("galDesc23").textContent="Dimension "+(aarMod.ngmX>3?" Boosts and Time Dimension B":"B")+"oosts are stronger based on your Galaxy points."
        el("galcost31").textContent=galCosts[31]
        el("galcost32").textContent=galCosts[32]
        el("preinfupgrades").style.display=player.infinityUpgradesRespecced?"none":""
        el("infi1div").style.display=player.infinityUpgradesRespecced==undefined?"none":""
        el("infi3div").style.display=player.infinityUpgradesRespecced==undefined?"none":""
        el("postinfbtn").style.display=player.infinityUpgradesRespecced?"none":""
  
        if (player.infinityUpgradesRespecced != undefined) order = []
        el("ic1desc").textContent="All the previous challenges (except for the Tickspeed challenge"+(player.galacticSacrifice?',':" and")+" Automatic Big Crunch challenge"+(player.galacticSacrifice?", and Automatic Galactic Sacrifice challenge":"")+") are applied at once."
        el("ic1reward").textContent="Reward: Get "+(player.galacticSacrifice?2:1.3)+"x on all Infinity Dimensions for each Infinity Challenge completed."
        el("ic2desc").textContent=(player.tickspeedBoosts==undefined?"":"Infinity Dimensions are disabled, but Sacrifice is way stronger. ")+"You automatically sacrifice every 8 ticks once you have the 8th Dimension."
        el("ic4desc").textContent=player.tickspeedBoosts==undefined?"Only the latest bought Normal Dimension's production is normal, all other Normal Dimensions produce less.":"All Normal Dimension multipliers are square rooted without the dilation penalty."
        el("ic5desc").textContent=player.tickspeedBoosts==undefined?"When buying Normal Dimensions 1-4, everything with costs smaller or equal increases. When buying Normal Dimensions 5-8, everything with costs bigger or equal increases. When buying tickspeed, everything with the same cost increases.":"You can't get tickspeed upgrades and galaxies. Tickspeed Boosts boost tickspeed instead."
        el("ic7desc").textContent="You can't get Antimatter Galaxies, but the Dimension Boost multiplier "+(player.galacticSacrifice?"is cubed":"is increased to 10x")+"."
        el("ic7reward").textContent="Reward: The Dimension Boost multiplier "+(player.galacticSacrifice? "is squared":" is increased to 4x.")
        el("replicantitabbtn").style.display=player.infinityUpgradesRespecced?"none":""
        el("replicantiresettoggle").textContent="Auto galaxy "+(player.replicanti.galaxybuyer?"ON":"OFF")+(player.timestudy.studies.includes(131)&&speedrunMilestonesReached<20?" (disabled)":"")
}

function setTSDisplay(){
        el("41desc").textContent=tsMults[41]()
        el("42desc").textContent=player.galacticSacrifice?"Galaxy cost multiplier is reduced by "+Math.round(tsMults[42]()*15)+"/15x.":"Galaxy cost increases by "+(60*tsMults[42]())+" 8ths instead of 60."
        el("61desc").innerHTML=tsMults[61]()
        el("62desc").textContent=tsMults[62]()
        el("81desc").textContent=player.galacticSacrifice?"is cubed":"becomes 10x"
        el("181desc").textContent = player.galacticSacrifice !== undefined && player.tickspeedBoosts === undefined ? "1% of your GP and IP gain on next reset" : "1% of your IP gained on crunch"
        el("211desc").textContent=tsMults[211]()
        el("213desc").textContent=tsMults[213]()
        el("221").style["font-size"] = tmp.ngp3 ? "0.45rem" : "0.55rem"
        el("222desc").textContent=tsMults[222]()
        el("231").style["font-size"] = tmp.ngp3 ? "0.55rem" : "0.65rem"
}

function updateNGp3DisplayStuff(){
        displayNonlegacyStuff()
        for (var i=0;i<masteryStudies.timeStudies.length;i++) {
                var t=masteryStudies.timeStudies[i]
                var d=masteryStudies.timeStudyDescs[t]
                el("ts"+t+"Desc").innerHTML=(typeof(d)=="function"?d():d)||"Unknown desc."
        }
        updateMasteryStudyCosts()
        if (quSave.best<=10) giveAchievement("Quantum doesn't take so long")
        if (ghostified) giveAchievement("Kee-hee-hee!")
        el('reward3disable').textContent="6 hours reward: O"+(quSave.disabledRewards[3]?"FF":"N")
        el('reward4disable').textContent="4.5 hours reward: O"+(quSave.disabledRewards[4]?"FF":"N")
        el('reward11disable').textContent="33.3 mins reward: O"+(quSave.disabledRewards[11]?"FF":"N")
        el('reward27disable').textContent="10 seconds reward: O"+(quSave.disabledRewards[27]?"FF":"N")
        el('rebuyupgauto').textContent="Rebuyable upgrade auto: O"+(player.autoEterOptions.rebuyupg?"N":"FF")
        el('dilUpgsauto').textContent="Auto-buy dilation upgrades: O"+(player.autoEterOptions.dilUpgs?"N":"FF")
        el('metaboostauto').textContent="Meta-boost auto: O"+(player.autoEterOptions.metaboost?"N":"FF")
        el('priorityquantum').value=formatValue("Scientific", E(quSave.autobuyer.limit), 2, 0)
        el("respecPC").className=quSave.pairedChallenges.respec?"quantumbtn":"storebtn"
        el('sacrificeAuto').textContent="Auto: O"+(quSave.autoOptions.sacrifice?"N":"FF")
        el("produceQuarkCharge").innerHTML="S" + (nfSave.producingCharge ? "top" : "tart") + " production of preon charge." + (nfSave.producingCharge ? "" : "<br>(You will not get preons when you do this.)")
        el("ratio_r").value = quSave.assignAllRatios.r
        el("ratio_g").value = quSave.assignAllRatios.g
        el("ratio_b").value = quSave.assignAllRatios.b
        el('autoAssign').textContent="Auto: O"+(quSave.autoOptions.assignQK?"N":"FF")
        el('autoAssignRotate').textContent="Rotation: "+(quSave.autoOptions.assignQKRotate>1?"Left":quSave.autoOptions.assignQKRotate?"Right":"None")
        el('autoReset').textContent="Auto: O"+(quSave.autoOptions.replicantiReset?"N":"FF")
        el("antTabs").style.display=player.masterystudies.includes("d11")?"":"none"
        el("edtabbtn_dim").style.display=player.masterystudies.includes("d11")?"":"none"
		NANOFIELD.shown()
        el("riptabbtn").style.display=player.masterystudies.includes("d14")?"":"none"
        el("ghostifyAnimBtn").textContent="Ghostify: O"+(player.options.animations.ghostify?"N":"FF")
        for (var u=5;u<13;u++) {
                if (u%3==1) el("neutrinoUpg"+u).parentElement.parentElement.style.display=u>ghSave.times+2?"none":""
                else el("neutrinoUpg"+u).style.display=u>ghSave.times+2?"none":""
        }
        el("gphUnl").textContent="To unlock Photons, you need to get "+shortenCosts(pow10(4.7e9))+" antimatter while your universe is Big Ripped first."
        updateBLUnlockDisplay()
        el("bpc68").textContent=shortenMoney(quSave.pairedChallenges.pc68best)
        el("odSlider").value=Math.round((tmp.bl.odSpeed-1)/4*50)
        for (var g=1;g<=br.limit;g++) el("typeToExtract"+g).className=tmp.bl.typeToExtract==g?"chosenbtn":"storebtn"
        updateAssortPercentage()
        updateElectrons()
        updateAutoQuantumMode()
        updateColorCharge()
        updateGluonsTabOnUpdate()
        updateReplicants()
        updateTODStuff()
        updateBraveMilestones()
        updateNeutrinoBoosts()
        tmp.updateLights = true
        updateGPHUnlocks()
        updateBLUnlocks()
        updateBosonicStuffCosts()
        if (!tmp.ngp3l) {
                el("nextParticle").textContent = "To unlock the next particle (Higgs), you need to get " + shortenCosts(pow10(2e17)) + " antimatter and " + shortenCosts(getHiggsRequirement()) + " Bosons first."
        }
        updateBLParticleUnlocks()
}

function setSomeQuantumAutomationDisplay(){
        var suffix = "NG" + (player.meta != undefined ? "pp" : "ud")
        el("uhDiv" + suffix).appendChild(el("Universal harmony"))
        el("feDiv" + suffix).appendChild(el("In the grim darkness of the far endgame"))
        el("dil14desc").textContent = aarMod.nguspV ? "The TP multiplier upgrade is more powerful." : "Increase the exponent of the TP formula."
        el("dil52").style["font-size"] = player.masterystudies == undefined || aarMod.nguspV !== undefined ? "10px" : "9px"
        el("dil52formula").style.display = player.masterystudies == undefined || aarMod.nguspV !== undefined ? "none" : ""
        el("exDilationDesc").innerHTML = aarMod.nguspV ? 'making galaxies <span id="exDilationBenefit" style="font-size:25px; color: black">0</span>% stronger in dilation.' : 'making dilation <span id="exDilationBenefit" style="font-size:25px; color: black">0</span>% less severe.'
        el("metaAntimatterEffectType").textContent=inQC(3) ? "multiplier on all Infinity Dimensions" : "extra multiplier per Dimension Boost"
        if (player.meta) {
                el('epmultauto').textContent="Auto: O"+(player.autoEterOptions.epmult?"N":"FF")
                for (i=1;i<9;i++) el("td"+i+'auto').textContent="Auto: O"+(player.autoEterOptions["td"+i]?"N":"FF")
        }
        el('replicantibulkmodetoggle').textContent="Mode: "+(player.galaxyMaxBulk?"Max":"Singles")
        el('versionMod').textContent = "Post-NG+3: Respecced"
        el('versionDesc').style.display = tmp.ngp3 ? "" : "none"
        el('sacrificeAuto').style.display=speedrunMilestonesReached>24?"":"none"
        el('toggleautoquantummode').style.display=(player.masterystudies?quSave.reachedInfQK||hasAch("ng3p25"):false)?"":"none"
        var autoAssignUnl = tmp.ngp3 && (ghostified || quSave.reachedInfQK)
        el('assignAll').style.display = !tmp.ngp3l || autoAssignUnl ? "" : "none"
        el('autoAssign').style.display = autoAssignUnl ? "" : "none"
        el('autoAssignRotate').style.display = autoAssignUnl ? "" : "none"
        el('autoReset').style.display=hasAch("ng3p47")?"":"none"
}

function setReplAutoDisplay(){
        el('replicantigalaxypowerdiv').style.display=hasAch("r106")&&player.boughtDims?"":"none"
        el("dilationeterupgrow").style.display="none"
        el("blackHoleAnimBtn").style.display="none"
        if (player.exdilation != undefined) {
                if (player.dilation.studies.includes(1)) el("dilationeterupgrow").style.display="table-row"
                el("blackHoleAnimBtn").textContent = "Black hole: " + ((player.options.animations.blackHole) ? "ON" : "OFF")
                el("blackholeMax").style.display = aarMod.ngudpV || aarMod.nguspV ? "" : "none"
                el("blackholeAuto").style.display = aarMod.ngudpV && hasAch("ngpp17") ? "" : "none"
                el('blackholeAuto').textContent="Auto: O"+(aarMod.ngudpV&&player.autoEterOptions.blackhole?"N":"FF")
                if (player.blackhole.unl == true) {
                        el("blackholediv").style.display="inline-block"
                        el("blackholeunlock").style.display="none"
                        el("blackHoleAnimBtn").style.display="inline-block"
                } else {
                        el("blackholediv").style.display="none"
                        el("blackholeunlock").style.display="inline-block"
                }
        }
}

function updateNGModeMessage(){
        ngModeMessages=[]
        if (aarMod.newGameMult) ngModeMessages.push("Welcome to NG Multiplied, made by Despacit and Soul147! This mode adds many buffs which may break the game, similar to NG^.")
        if (aarMod.newGameExpVersion) ngModeMessages.push("Welcome to NG^, made by Naruyoko! This mode adds many buffs to features that can end up unbalancing the game significantly.")
        if (player.meta!==undefined||player.exdilation!==undefined) {
                if (!aarMod.newGamePlusVersion) ngModeMessages.push("You have disabled NG+ features on NG++. This means you start off from the beginning of Antimatter Dimensions without any buffs, and with NG+3 enabled, it can be considered as The Grand Run. If you want to go for it, good luck.")
                if (player.exdilation!==undefined) {
                if (aarMod.nguspV) ngModeMessages.push("Welcome to NG Update Semiprime, made by Aarex! This is like NGUd', but with balancing changes implemented. Good luck! :)")
                if (aarMod.ngumuV||aarMod.nguepV) {
                        if (aarMod.ngumuV) ngModeMessages.push("Welcome to NG Update Multiplied Prime, made by Aarex! This is a NG*-like mod of NGUd'. This mod will thus be very fast, but it's unlikely that you will break it.")
                        if (aarMod.nguepV) ngModeMessages.push("Welcome to NG Update Exponential Prime, made by pg132! NGUd^' is like NGUd', but nerfs unrelated to the Black Hole are removed to make NGUd^' a NG^-like mod of NGUd'. This mod will be fast as a result, but it is somewhat unlikely that you will break it.")
                } else if (aarMod.nguspV) {}
                else if (aarMod.ngudpV) ngModeMessages.push("Welcome to NG Update Prime, made by pg132! NGUd' is like NGUd+, but you can't reverse dilation. Good luck for beating this mod. >:)")
                else if (player.meta!==undefined) ngModeMessages.push("Welcome to NG Update+, a combination made by Soul147 (Sigma)! This is a combination of dan-simon's NG Update and Aarex's NG+++, which can end up unbalancing the game because of some mechanics.")
                else ngModeMessages.push("Welcome to NG Update, made by dan-simon! In this mod, Black Hole and Ex-Dilation are available after the endgame of the vanilla Antimatter Dimensions.")
                } else if (player.masterystudies&&!aarMod.ngp3lV&&!aarMod.ngp3mpV) ngModeMessages.push("Welcome to Post-NG+3R, Aarex's fanmade rework to MrRedShark77's Post-NG+3; extending NG+2 and +3! " + (aarMod.ngp4V ? "If you haven't experienced NG+3 yet, do it without NG+4." : "You are now on the marathon of NG+3, I wish you dedication."))
                else if (!aarMod.ngp4V) ngModeMessages.push("Welcome to NG++, made by dan-simon! In this mode, more Dilation upgrades and Meta Dimensions are added to push the endgame further. Disclaimer: This is not NG+3, there is no Quantum content available.")
        } else if (aarMod.newGamePlusVersion) ngModeMessages.push("Welcome to NG+ v2, made by usavictor and Aarex! You start with many things unlocked and given to you immediately to get through the early game faster.")
        if (player.infinityUpgradesRespecced) ngModeMessages.push('Welcome to Infinity Respecced, created by Aarex! In this mode, all of infinity upgrades are replaced with new upgrades except for the 2x IP mult, Break Infinity is removed, but there is new content in Infinity.')
        if (player.boughtDims) ngModeMessages.push('Welcome to Eternity Respecced, created by dan-simon! In this mode, Eternity is changed to be balanced better without any scaling. Note: The port is not complete on this site, so you should search for the separate website for the mod itself to get the latest version.')
        if (player.galacticSacrifice) {
                if (aarMod.ngmX>4) ngModeMessages.push('Welcome to NG-5, the nerfed version of NG-4! This is very hardcore because you are stuck in more challenges. You are also stuck in Automated Big Crunches Challenge which is a big impact on this mod. Good luck! This mod is made by Aarex.')
                else if (aarMod.ngmX>3) ngModeMessages.push('Welcome to NG-4, the nerfed version of NG-3! This mode features even more changes from NG---, and is very hardcore. WIP by Nyan Cat and edited by Aarex.')
                else if (aarMod.newGame3MinusVersion) ngModeMessages.push('Welcome to NG-3, the nerfed version of NG--! This mode reduces tickspeed multiplier multiplier and nerfs galaxies, but has a new feature called \"Tickspeed Boosts\" and many more changes to NG--.')
                else ngModeMessages.push('Welcome to NG--, created by Nyan cat! You are always in Dilation and IC3, but there is a new layer called Galactic Sacrifice.')
        }
        if (aarMod.newGameMinusVersion) ngModeMessages.push("Welcome to NG-, created by slabdrill! Originally made as a save file modification, NG- is now ported as a 'mod'. Everything in the original Antimatter Dimensions is nerfed, making the endgame harder to reach.")
        if (aarMod.aau) ngModeMessages.push("You have applied the AAU 'mod', made by Apeirogon. This will unbalance many areas of the game, as you get all achievements available in your save. It is not recommended to choose this 'mod' for this reason, unless you want fast gameplay.")
        if (inflationCheck) ngModeMessages = ["I'm terribly sorry, but it seems there has been an inflation problem in your save, which is why this save file has been reset."]
        if (infiniteCheck) ngModeMessages = ["I'm terribly sorry, but there has been an Infinite bug detected within your save file, which is why said save file will get reset. Luckily, you can export your save before this reset. Thanks! :)"]
        if (forceToQuantumAndRemove) {
                quantum(false, true, 0)
                ngModeMessages = ["Due to balancing changes, you are forced to quantum and reset your TT and your best TP, but you are given  " + shorten(setTTAfterQuantum) + " TT as compensation."]
                player.timestudy.theorem = setTTAfterQuantum
                player.dilation.bestTP = E(0)
                el('bestTP').textContent = "Your best ever Tachyon particles was 0."
        }
}


function onLoad(noOffline) {
	quSave = player.quantum
	EDsave = quSave && quSave.emperorDimensions
	nfSave = quSave && quSave.nanofield
	todSave = quSave && quSave.tod
	brSave = quSave && quSave.bigRip
	beSave = quSave && quSave.breakEternity

	ghSave = player.ghostify
	aarMod = player.aarexModifications

	ghostifyDenied = 0
	setEverythingPreNGp3onLoad()
        setAarexModIfUndefined()
	doNGp3Init1()
        setSaveStuffHTML()


	setSomeEterEraStuff2()
        setSomeEterEraStuff()

	clearOldAchieves()

	el("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"

	updateBoughtTimeStudies()
	performedTS = false
        updateVersionsONLOAD()
        transformSaveToDecimal()
        updateInQCs()
	doNGp3Init2()
        for (s = 0; s < (player.boughtDims ? 4 : 3); s++) toggleCrunchMode(true)
        updateAutoEterMode()
        setConfirmationsDisplay()
        setOptionsDisplaysStuff1()
        updateHotkeys()
        setDisplaysStuff1()
        setChallengeDisplay()
        setInfChallengeDisplay()
        updateSingularity()
        updateDimTechs()
        setOtherChallDisplay()
        setTSDisplay()
        setReplAutoDisplay()
        setSomeQuantumAutomationDisplay()
        if (player.pSac !== undefined) {
                updateParadoxUpgrades()
                updatePUCosts()
        }
        if (tmp.ngp3) updateNGp3DisplayStuff()
        hideDimensions()
        updateChallenges()
        updateNCVisuals()
        updateChallengeTimes()
        checkForEndMe()
        updateAutobuyers()
        updatePriorities()
        updateMilestones()
        loadInfAutoBuyers()
        updateEternityUpgrades()
        updateTheoremButtons()
        updateTimeStudyButtons()
        updateRespecButtons()
        updateEternityChallenges()
        updateEterChallengeTimes()
        updateDilationUpgradeCosts()
        updateExdilation()
        updateLastTenQuantums()
        updateSpeedruns()
        updateBankedEter()
        updateQuantumChallenges()
        updateQCTimes()
        updatePCCompletions()
        maybeShowFillAll()
        updateNanoRewardTemp()
        updateBreakEternity()
        updateLastTenGhostifies()
        onNotationChangeNeutrinos()
        setAchieveTooltip()
        if (player.boughtDims) {
                if (el("timestudies").style.display=="block") showEternityTab("ers_timestudies",true)
                updateGalaxyControl()
        } else if (el("ers_timestudies").style.display=="block") showEternityTab("timestudies",true)
        poData=metaSave["presetsOrder"+(player.boughtDims?"_ers":"")]
        setAndMaybeShow('bestTP',hasAch("ng3p18") || hasAch("ng3p37"),'"Your best"+(ghostified ? "" : " ever")+" Tachyon particles"+(ghostified ? " in this Fundament" : "")+" was "+shorten(player.dilation.bestTP)+"."')
        setAndMaybeShow('bestTPOverGhostifies',(hasAch("ng3p18") || hasAch("ng3p37")) && ghostified,'"Your best-ever Tachyon particles was "+shorten(player.dilation.bestTPOverGhostifies)+"."')
        el('dilationmode').style.display=speedrunMilestonesReached>4?"":"none"
        el('rebuyupgmax').style.display=speedrunMilestonesReached<26&&player.masterystudies?"":"none"
        el('rebuyupgauto').style.display=speedrunMilestonesReached>6?"":"none"
        el('toggleallmetadims').style.display=speedrunMilestonesReached>7?"":"none"
        el('metaboostauto').style.display=speedrunMilestonesReached>14?"":"none"
        el("autoBuyerQuantum").style.display=speedrunMilestonesReached>22?"":"none"
        el("quarksAnimBtn").style.display=quantumed&&player.masterystudies?"inline-block":"none"
        el("quarksAnimBtn").textContent="Quarks: O"+(player.options.animations.quarks?"N":"FF")
        el("maxTimeDimensions").style.display=removeMaxTD?"none":""
        el("metaMaxAllDiv").style.display=removeMaxMD?"none":""
        el("ghostifyAnimBtn").style.display=ghostified?"inline-block":"none"
        var removeMaxTD=false
        var removeMaxMD=false
        if (hasAch("ngpp17")) {
                for (d=1;d<9;d++) {
                        if (player.autoEterOptions["td"+d]) if (d>7) removeMaxTD=true
                        else break
                }
        }
        if (speedrunMilestonesReached > 27) {
                for (d=1;d<9;d++) {
                        if (player.autoEterOptions["md"+d]) if (d>7) removeMaxMD=true
                        else break
                }
        }
        notifyId=speedrunMilestonesReached
        notifyId2=player.masterystudies===undefined?0:ghSave.milestones
        showHideFooter()
        el("newsbtn").textContent=(player.options.newsHidden?"Show":"Hide")+" news ticker"
        el("game").style.display=player.options.newsHidden?"none":"block"
        var tabsSave = aarMod.tabsSave
        showDimTab((tabsSave.on && tabsSave.tabDims) || 'antimatterdimensions')
        showStatsTab((tabsSave.on && tabsSave.tabStats) || 'stats')
        showAchTab((tabsSave.on && (tabsSave.tabAchs == 'normalachievements' || tabsSave.tabAchs == 'secretachievements') && tabsSave.tabAchs) || 'normalachievements')
        showChallengesTab((tabsSave.on && tabsSave.tabChalls) || 'normalchallenges')
        showInftab((tabsSave.on && tabsSave.tabInfinity) || 'preinf')
        showEternityTab((tabsSave.on && tabsSave.tabEternity) || 'timestudies', true)
        showQuantumTab((tabsSave.on && tabsSave.tabQuantum) || 'uquarks')
        showAntTab((tabsSave.on && tabsSave.tabAnt) || 'antcore')
        showBranchTab((tabsSave.on && tabsSave.tabBranch) || 'red')
        showRipTab((tabsSave.on && tabsSave.tabRip) || 'riptab')
        showGhostifyTab((tabsSave.on && tabsSave.tabGhostify) || 'neutrinos')
        showBLTab((tabsSave.on && tabsSave.tabBL) || 'bextab')
        if (!player.options.newsHidden) scrollNextMessage()
        el("secretoptionsbtn").style.display=player.options.secrets?"":"none"
        el("ghostlynewsbtn").textContent=((player.options.secrets!==undefined?player.options.secrets.ghostlyNews:false)?"Hide":"Show")+" ghostly news ticker"
        resetUP()
        if (aarMod.offlineProgress && !noOffline) {
                let diff = new Date().getTime() - player.lastUpdate
                if (diff > 1000*1000) simulateTime(diff/1000)
        } else player.lastUpdate = new Date().getTime()
        if (player.totalTimePlayed < 1 || inflationCheck || forceToQuantumAndRemove) {
                updateNGModeMessage()
                inflationCheck = false
                infiniteCheck = false
                closeToolTip()
                showNextModeMessage()
        }  else showNextModeMessage()
        el("ghostlyNewsTicker").style.height=((player.options.secrets!==undefined?player.options.secrets.ghostlyNews:false)?24:0)+"px"
        el("ghostlyNewsTickerBlock").style.height=((player.options.secrets!==undefined?player.options.secrets.ghostlyNews:false)?16:0)+"px"
        updateTemp()
        updateTemp()
}


/*
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
END OF ONLOAD
*/

function checkNGM(imported) {
	var temp = (imported) ? imported : player
	var td1PowerDiv = pow2(player.timeDimension1.bought).div(player.timeDimension1.power).toNumber()
	if (Math.round(td1PowerDiv) == 100) return 2.2
	if (Math.round(td1PowerDiv*8) == 5) return 2.1
	if (Math.round(td1PowerDiv) == 5) return 2
	if (Math.round(E(temp.timestudy.ipcost).mantissa) != 1) return 1.1
	if (Math.round(td1PowerDiv) == 10) return 1
	return 0
}

/*
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF
STUFF




Does transformSaveToDecimal() even do anything anymore
we can just remove back compatibility right
no one should have a AD save from back then
I guess we shoudln't but ew its laggy, maybe a variable that says if we have done so
*/

function setup_data() {
	if (break_infinity_js == null) {
		break_infinity_js = false
		initCost = [null, E(10), E(1e2), E(1e4), E(1e6), E(1e9), E(1e13), E(1e18), E(1e24)]
		costMults = [null, E(1e3), E(1e4), E(1e5), E(1e6), E(1e8), E(1e10), E(1e12), E(1e15)]
		nextAt = {postc1: E("1e2000"), postc1_ngmm: E("1e3000"), postc1_ngm3:E("1e3760"),
                    postc2:E("1e5000"),
                    postc3:E("1e12000"),
                    postc4:E("1e14000"),
                    postc5:E("1e18000"), postc5_ngm3:E("1e21500"),
                    postc6:E("1e20000"), postc6_ngm3:E("1e23000"),
                    postc7:E("1e23000"), postc7_ngm3:E("1e25500"),
                    postc8:E("1e28000"), postc8_ngm3:E("1e39000"),
                    postcngmm_1:E("1e750"),postcngmm_1_ngm3:E("1e1080"),
                    postcngmm_2:E("1e1350"),
                    postcngmm_3:E("1e2000"), postcngmm_3_ngm3:E("1e2650"),
                    postcngm3_1:E("1e1560"),
                    postcngm3_2:E("1e2085"),
                    postcngm3_3:E("1e8140"),
                    postcngm3_4:E("1e17000")}
		goals = {postc1: E("1e850"), postc1_ngmm: E("1e650"), postc1_ngm3:E("1e375"),
                    postc2:E("1e10500"), postc2_ngm3:E("1e4250"),
                    postc3:E("1e5000"),
                    postc4:E("1e13000"), postc4_ngm3:E("1e4210"),
                    postc5:E("1e11111"), postc5_ngm3:E("7.77e7777"),
                    postc6:E("2e22222"),
                    postc7:E("1e10000"), postc7_ngmm:E("1e15000"), postc7_ngm3:E("1e5100"),
                    postc8:E("1e27000"), postc8_ngm3:E("1e35000"), 
                    postcngmm_1:E("1e550"), postcngmm_1_ngm3:E("1e650"), postcngmm_1_ngm4:E("1e950"),
                    postcngmm_2:E("1e950"), postcngmm_2_ngm3:E("1e1090"), postcngmm_2_ngm4:E("1e1200"),
                    postcngmm_3:E("1e1200"), postcngmm_3_ngm3:E("1e1230"), postcngmm_3_ngm4:E("1e1530"),
                    postcngm3_1:E("1e550"), postcngm3_1_ngm4:E("1e1210"),
                    postcngm3_2:E("1e610"), postcngm3_2_ngm4:E("1e750"),
                    postcngm3_3:E("8.8888e888"),
                    postcngm3_4:E("1e12345")}
		order = ['postc1','postc2','postc3','postc4','postc5','postc6','postc7','postc8']
		setUnlocks = [E_pow(Number.MAX_VALUE, 2.9)]
	}
}

function conToDeciPreInf(){
        player.money = E(player.money)
        player.tickSpeedCost = E(player.tickSpeedCost)
        player.tickspeed = E(player.tickspeed)
        player.firstAmount = E(player.firstAmount)
        player.secondAmount = E(player.secondAmount)
        player.thirdAmount = E(player.thirdAmount)
        player.fourthAmount = E(player.fourthAmount)
        player.fifthAmount = E(player.fifthAmount)
        player.sixthAmount = E(player.sixthAmount)
        player.seventhAmount = E(player.seventhAmount)
        player.eightAmount = E(player.eightAmount)
        player.firstCost = E(player.firstCost)
        player.secondCost = E(player.secondCost)
        player.thirdCost = E(player.thirdCost)
        player.fourthCost = E(player.fourthCost)
        player.fifthCost = E(player.fifthCost)
        player.sixthCost = E(player.sixthCost)
        player.seventhCost = E(player.seventhCost)
        player.eightCost = E(player.eightCost)
        player.sacrificed = E(player.sacrificed)
        player.totalmoney = E(player.totalmoney)
}

function conToDeciTD(){
        player.timeDimension1.amount = E(player.timeDimension1.amount)
        player.timeDimension2.amount = E(player.timeDimension2.amount)
        player.timeDimension3.amount = E(player.timeDimension3.amount)
        player.timeDimension4.amount = E(player.timeDimension4.amount)
        player.timeDimension5.amount = E(player.timeDimension5.amount)
        player.timeDimension6.amount = E(player.timeDimension6.amount)
        player.timeDimension7.amount = E(player.timeDimension7.amount)
        player.timeDimension8.amount = E(player.timeDimension8.amount)
        player.timeDimension1.cost = E(player.timeDimension1.cost)
        player.timeDimension2.cost = E(player.timeDimension2.cost)
        player.timeDimension3.cost = E(player.timeDimension3.cost)
        player.timeDimension4.cost = E(player.timeDimension4.cost)
        player.timeDimension5.cost = E(player.timeDimension5.cost)
        player.timeDimension6.cost = E(player.timeDimension6.cost)
        player.timeDimension7.cost = E(player.timeDimension7.cost)
        player.timeDimension8.cost = E(player.timeDimension8.cost)
        player.timeDimension1.power = E(player.timeDimension1.power)
        player.timeDimension2.power = E(player.timeDimension2.power)
        player.timeDimension3.power = E(player.timeDimension3.power)
        player.timeDimension4.power = E(player.timeDimension4.power)
        player.timeDimension5.power = E(player.timeDimension5.power)
        player.timeDimension6.power = E(player.timeDimension6.power)
        player.timeDimension7.power = E(player.timeDimension7.power)
        player.timeDimension8.power = E(player.timeDimension8.power)
}

function conToDeciPreEter(){
        player.infinityPoints = E(player.infinityPoints)
        el("eternitybtn").style.display = ((player.infinityPoints.gte(Number.MAX_VALUE) && player.infDimensionsUnlocked[7]) || getEternitied() > 0) ? "inline-block" : "none"

        conToDeciPreInf()
        player.infinitied = nP(player.infinitied)
        player.infinitiedBank = nP(player.infinitiedBank)
        player.chall3Pow = E(player.chall3Pow)
        player.chall11Pow = E(player.chall11Pow)
        if (player.galacticSacrifice !== undefined) {
        player.galacticSacrifice.galaxyPoints = Decimal.round(player.galacticSacrifice.galaxyPoints)
        if (player.dimPowerIncreaseCost !== undefined) player.dimPowerIncreaseCost = E(player.dimPowerIncreaseCost)
        }
        if (player.pSac !== undefined) {
                player.pSac.px = E(player.pSac.px)
                for (var d=1;d<9;d++) player["infinityDimension"+d].costAM = E(player["infinityDimension"+d].costAM)
                if (player.pSac.dims !== undefined) {
                        player.pSac.dims.power = E(player.pSac.dims.power)
                        for (var d=1;d<9;d++) {
                                player.pSac.dims[d].cost = E(player.pSac.dims[d].cost)
                                player.pSac.dims[d].amount = E(player.pSac.dims[d].amount)
                                player.pSac.dims[d].power = E(player.pSac.dims[d].power)
                        }
                }
        }
        player.costMultipliers = [E(player.costMultipliers[0]), E(player.costMultipliers[1]), E(player.costMultipliers[2]), E(player.costMultipliers[3]), E(player.costMultipliers[4]), E(player.costMultipliers[5]), E(player.costMultipliers[6]), E(player.costMultipliers[7])]
        player.tickspeedMultiplier = E(player.tickspeedMultiplier)
        player.matter = E(player.matter)
        
        if (player.singularity != undefined) {
                player.singularity.sacrificed = E(player.singularity.sacrificed)
                player.singularity.singularityPower = E(player.singularity.singularityPower)
                player.singularity.darkMatter = E(player.singularity.darkMatter)
        }
        player.infinityPower = E(player.infinityPower)
        player.infinityDimension1.amount = E(player.infinityDimension1.amount)
        player.infinityDimension2.amount = E(player.infinityDimension2.amount)
        player.infinityDimension3.amount = E(player.infinityDimension3.amount)
        player.infinityDimension4.amount = E(player.infinityDimension4.amount)
        player.infinityDimension5.amount = E(player.infinityDimension5.amount)
        player.infinityDimension6.amount = E(player.infinityDimension6.amount)
        player.infinityDimension7.amount = E(player.infinityDimension7.amount)
        player.infinityDimension8.amount = E(player.infinityDimension8.amount)
}

function conToDeciLateEter(){
        if (player.exdilation !== undefined) {
        player.blackhole.power = E(player.blackhole.power)

        for (var d=1;d<9;d++) {
                var dim=player["blackholeDimension"+d]
                if (dim!==undefined) {
                        dim.amount = E(dim.amount)
                        dim.cost = E(dim.cost)
                        dim.power = E(dim.power)
                }
        }

        player.exdilation.unspent = E(player.exdilation.unspent)
        player.exdilation.spent[1] = E(player.exdilation.spent[1])
        player.exdilation.spent[2] = E(player.exdilation.spent[2])
        player.exdilation.spent[3] = E(player.exdilation.spent[3])
        if (player.exdilation.spent[4] !== undefined) player.exdilation.spent[4] = E(player.exdilation.spent[4])
        }

        if (player.meta !== undefined) {
        player.meta.antimatter = E(player.meta.antimatter);
        player.meta.bestAntimatter = E(player.meta.bestAntimatter);
        for (let i = 1; i <= 8; i++) {
                player.meta[i].amount = E(player.meta[i].amount);
                player.meta[i].cost = E(player.meta[i].cost);
        }
        if (quSave) {
                if (quSave.last10) for (i=0;i<10;i++) quSave.last10[i][1] = E(quSave.last10[i][1])
                quSave.quarks = E(quSave.quarks);
                if (!player.masterystudies) quSave.gluons = (quSave.gluons ? quSave.gluons.rg !== null : true) ? E(0) : E(quSave.gluons);
                quSave.neutronstar.quarks = E(quSave.neutronstar.quarks);
                quSave.neutronstar.metaAntimatter = E(quSave.neutronstar.metaAntimatter);
                quSave.neutronstar.dilatedTime = E(quSave.neutronstar.dilatedTime);
        }
        }
        player.timeShards = E(player.timeShards)
        player.eternityPoints = E(player.eternityPoints)
        player.tickThreshold = E(player.tickThreshold)
        player.postC3Reward = E(player.postC3Reward)
        player.postC8Mult = E(player.postC8Mult)

        for (var i=0; i<10; i++) {
                player.lastTenRuns[i][0] = parseFloat(player.lastTenRuns[i][0])
                player.lastTenRuns[i][1] = E(player.lastTenRuns[i][1])
                player.lastTenEternities[i][1] = E(player.lastTenEternities[i][1])
        }
        player.replicanti.chanceCost = E(player.replicanti.chanceCost)
        player.replicanti.intervalCost = E(player.replicanti.intervalCost)
        player.replicanti.galCost = E(player.replicanti.galCost)

        for (var i=1; i<=8; i++) {
        player["infinityDimension"+i].cost = E(player["infinityDimension"+i].cost)
        player["infinityDimension"+i].power = E(player["infinityDimension"+i].power)
        }

        player.infMultCost = E(player.infMultCost)
        player.infMult = E(player.infMult)
        player.timestudy.amcost = E(player.timestudy.amcost)
        player.timestudy.ipcost = E(player.timestudy.ipcost)
        player.timestudy.epcost = E(player.timestudy.epcost)

        player.autoIP = E(player.autoIP)

        if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autobuyers[11].priority !== "undefined" && player.autobuyers[11].priority.toString().toLowerCase()!="max") player.autobuyers[11].priority = E(player.autobuyers[11].priority)

        player.epmultCost = E(player.epmultCost)
        player.epmult = E(player.epmult)
        player.eternityBuyer.limit = E(player.eternityBuyer.limit)
        player.eternityChallGoal = E(player.eternityChallGoal)
        player.replicanti.amount = E(player.replicanti.amount)
        if (player.boughtDims) {
                player.replicanti.limit = E(player.replicanti.limit)
                player.replicanti.newLimit = E(player.replicanti.newLimit)
                if (player.darkMatter) player.darkMatter = E(player.darkMatter)
        }

        player.dilation.tachyonParticles = E(player.dilation.tachyonParticles)
        player.dilation.dilatedTime = E(player.dilation.dilatedTime)
        player.dilation.totalTachyonParticles = E(player.dilation.totalTachyonParticles)
        player.dilation.nextThreshold = E(player.dilation.nextThreshold)
}

function conToDeciMS(){
        if (player.masterystudies) {
                player.dbPower = E(player.dbPower)
                player.meta.bestOverQuantums = Decimal.max(player.meta.bestOverQuantums, player.meta.bestAntimatter)
                if (quSave ? quSave.usedQuarks : false) {
                        quSave.usedQuarks.r = E(quSave.usedQuarks.r)
                        quSave.usedQuarks.g = E(quSave.usedQuarks.g)
                        quSave.usedQuarks.b = E(quSave.usedQuarks.b)
                        quSave.colorPowers.r = E(quSave.colorPowers.r)
                        quSave.colorPowers.g = E(quSave.colorPowers.g)
                        quSave.colorPowers.b = E(quSave.colorPowers.b)
                }
                if (quSave ? aarMod.newGame3PlusVersion > 1.5 : false) {
                        quSave.gluons.rg = E(quSave.gluons.rg)
                        quSave.gluons.gb = E(quSave.gluons.gb)
                        quSave.gluons.br = E(quSave.gluons.br)
                }
                if (quSave ? quSave.autobuyer : false) quSave.autobuyer.limit = E(quSave.autobuyer.limit)
                if (quSave ? quSave.electrons : false) if (typeof(quSave.electrons.amount)=="string") quSave.electrons.amount = Math.round(parseFloat(quSave.electrons.amount)*4)/4
                if (player.dilation.bestTP == undefined) player.dilation.bestTP = hasAch("ng3p18") || hasAch("ng3p37") ? player.dilation.tachyonParticles : 0
                player.dilation.bestTP = E(player.dilation.bestTP)
                if (quSave ? quSave.replicants : false) {
                        quSave.replicants.amount = E(quSave.replicants.amount)
                        quSave.replicants.requirement = E(quSave.replicants.requirement)
                        quSave.replicants.quarks = E(quSave.replicants.quarks)
                        quSave.replicants.quantumFoodCost = E(quSave.replicants.quantumFoodCost)
                        quSave.replicants.limitCost = E(quSave.replicants.limitCost)
                        quSave.replicants.eggonProgress = E(quSave.replicants.eggonProgress)
                        quSave.replicants.eggons = E(quSave.replicants.eggons)
                        quSave.replicants.hatchSpeedCost = E(quSave.replicants.hatchSpeedCost)
                        quSave.replicants.babyProgress = E(quSave.replicants.babyProgress)
                        quSave.replicants.babies = E(quSave.replicants.babies)
                        quSave.replicants.ageProgress = E(quSave.replicants.ageProgress)
                }
                if (quSave ? (quSave.emperorDimensions ? quSave.emperorDimensions[1] : false) : false) for (d=1;d<9;d++) {
                        quSave.emperorDimensions[d].workers = Decimal.round(quSave.emperorDimensions[d].workers)
                        quSave.emperorDimensions[d].progress = Decimal.round(quSave.emperorDimensions[d].progress)
                }
                if (quSave ? nfSave : false) {
                        nfSave.charge = E(nfSave.charge)
                        nfSave.energy = E(nfSave.energy)
                        nfSave.antienergy = E(nfSave.antienergy)
                        nfSave.powerThreshold = E(nfSave.powerThreshold)
                }
                if (quSave ? todSave : false) {
                        todSave.r.quarks = E(todSave.r.quarks)
                        todSave.r.spin = E(todSave.r.spin)
                        todSave.g.quarks = E(todSave.g.quarks)
                        todSave.g.spin = E(todSave.g.spin)
                        todSave.b.quarks = E(todSave.b.quarks)
                        todSave.b.spin = E(todSave.b.spin)
                }
                if (quSave) quSave.quarkEnergy = E(quSave.quarkEnergy)
        }
}

function conToDeciGhostify(){
        if (ghSave) {
                player.dilation.bestTPOverGhostifies = Decimal.max(player.dilation.bestTPOverGhostifies, player.dilation.bestTP)
                player.meta.bestOverGhostifies = Decimal.max(player.meta.bestOverGhostifies, player.meta.bestOverQuantums)
                quSave.pairedChallenges.pc68best = E(quSave.pairedChallenges.pc68best)
                if (brSave) {
                        brSave.bestThisRun = E(brSave.bestThisRun)
                        brSave.totalAntimatter = E(brSave.totalAntimatter)
                        brSave.spaceShards = E(brSave.spaceShards)
                }
                if (beSave) beSave.eternalMatter = E(beSave.eternalMatter)
                ghSave.times = nP(ghSave.times)
                ghSave.ghostParticles = E(ghSave.ghostParticles)
                for (var r=0;r<10;r++) ghSave.last10[r][1] = E(ghSave.last10[r][1])
                ghSave.neutrinos.electron = E(ghSave.neutrinos.electron)
                ghSave.neutrinos.mu = E(ghSave.neutrinos.mu)
                ghSave.neutrinos.tau = E(ghSave.neutrinos.tau)
                if (ghSave.automatorGhosts!==undefined) ghSave.automatorGhosts[15].a=E(ghSave.automatorGhosts[15].a)
                if (ghSave.ghostlyPhotons) {
                        ghSave.ghostlyPhotons.amount=E(ghSave.ghostlyPhotons.amount)
                        ghSave.ghostlyPhotons.ghostlyRays=E(ghSave.ghostlyPhotons.ghostlyRays)
                        ghSave.ghostlyPhotons.darkMatter=E(ghSave.ghostlyPhotons.darkMatter)
                }
				if (tmp.bl && ghSave.wzb) {
					tmp.bl.watt=E(tmp.bl.watt)
					tmp.bl.ticks=E(tmp.bl.ticks)
					tmp.bl.speed=E(tmp.bl.speed)
					tmp.bl.am=E(tmp.bl.am)
					tmp.bl.extractProgress=E(tmp.bl.extractProgress)
					tmp.bl.autoExtract=E(tmp.bl.autoExtract)
					for (var t=0;t<=br.maxLimit-1;t++) tmp.bl.glyphs[t]=E(tmp.bl.glyphs[t]||0)
					tmp.bl.battery=E(tmp.bl.battery)
					for (var g2=2;g2<=br.maxLimit;g2++) for (var g1=1;g1<g2;g1++) if (tmp.bl.enchants[g1*10+g2]!==undefined) tmp.bl.enchants[g1*10+g2]=E(tmp.bl.enchants[g1*10+g2])

					ghSave.wzb.dP=E(ghSave.wzb.dP)
					ghSave.wzb.wQkProgress=E(ghSave.wzb.wQkProgress)
					ghSave.wzb.zNeProgress=E(ghSave.wzb.zNeProgress)
					ghSave.wzb.zNeReq=E(ghSave.wzb.zNeReq)
					ghSave.wzb.wpb=E(ghSave.wzb.wpb)
					ghSave.wzb.wnb=E(ghSave.wzb.wnb)
					ghSave.wzb.zb=E(ghSave.wzb.zb)
				}
        }
}

function deepUndefinedAndDecimal(obj, data) {
        if (obj == null) return data
        for (let x = 0; x < Object.keys(data).length; x++) {
            let k = Object.keys(data)[x]
            if (obj[k] === null) continue
            if (obj[k] === undefined) obj[k] = data[k]
            else {
                if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
                else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
            }
        }
        return obj
}

function transformSaveToDecimal() {

        conToDeciPreEter()
        player.eternities = nP(player.eternities)
        if (player.eternitiesBank !== undefined) player.eternitiesBank = nP(player.eternitiesBank)
        conToDeciTD()
        conToDeciLateEter()
        conToDeciMS()
        conToDeciGhostify()

        conToDeciPostNGP3()
}


function loadAutoBuyerSettings() {
        for (var i=0; i<9; i++) {
                el("priority" + (i+1)).selectedIndex = player.autobuyers[i].priority-1
                if (i == 8 && player.autobuyers[i].target == 10) el("toggleBtnTickSpeed").textContent = "Buys max"
                else if (i == 8 && player.autobuyers[i].target !== 10) el("toggleBtnTickSpeed").textContent = "Buys singles"
                else if (player.autobuyers[i].target > 10) el("toggleBtn" + (i+1)).textContent = "Buys until 10"
                else el("toggleBtn" + (i+1)).textContent = "Buys singles"
        }
        el("priority10").value = player.autobuyers[9].priority
        el("priority11").value = player.autobuyers[10].priority
        el("priority12").value = player.autoCrunchMode == "amount" ? formatValue("Scientific", player.autobuyers[11].priority, 2, 0) : player.autobuyers[11].priority
        el("overGalaxies").value = player.overXGalaxies
        el("bulkDimboost").value = player.autobuyers[9].bulk
        el("prioritySac").value = player.autoSacrifice.priority
        el("bulkgalaxy").value = player.autobuyers[10].bulk
        el("priority13").value = formatValue("Scientific", E(player.eternityBuyer.limit), 2, 0)
        if (player.eternityBuyer.dilationPerAmount !== undefined) el('prioritydil').value=player.eternityBuyer.dilationPerAmount
        if (player.autobuyers[12] !== undefined) el("priority14").value = formatValue("Scientific", E(player.autobuyers[12].priority), 2, 0)
        if (player.autobuyers[13] !== undefined) {
                el("priority15").value = player.autobuyers[13].priority
                el("overGalaxiesTickspeedBoost").value = player.overXGalaxiesTickspeedBoost
                el("bulkTickBoost").value = player.autobuyers[13].bulk
        }
        if (player.autobuyers[14] !== undefined) {
                el("priority16").value = player.autobuyers[14].priority
                el("overGalaxiesTDBoost").value = player.autobuyers[14].overXGals
                el("bulkTickBoost").value = player.autobuyers[14].bulk
        }
        if (player.boughtDims) {
                el("maxReplicantiCrunchSwitch").checked = player.autobuyers[11].requireMaxReplicanti;
                el("requireIPPeak").checked = player.autobuyers[11].requireIPPeak;
        }
        if (player.masterystudies) {
                el("prioritydil").value = player.eternityBuyer.dilationPerAmount
                if (quSave && quSave.autobuyer) {
                        if (isNaN(break_infinity_js ? quSave.autobuyer.limit : quSave.autobuyer.limit.l)) quSave.autobuyer.limit = E(1)
                        el("priorityquantum").value = quSave.autobuyer.mode == "amount" || quSave.autobuyer.mode == "relative" ? formatValue("Scientific", quSave.autobuyer.limit, 2, 0) : quSave.autobuyer.limit
                }
        }
}

function set_save(id, value) {
	localStorage.setItem(btoa(savePrefix+id), btoa(JSON.stringify(value, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
}

function get_save(id) {
        try {
                var dimensionSave = localStorage.getItem(btoa(savePrefix+id))
                if (dimensionSave !== null) dimensionSave = JSON.parse(atob(dimensionSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
                return dimensionSave
        } catch(e) { }
}

var meta_started = false
function initiateMetaSave() {
	metaSave = localStorage.getItem(metaSaveId)
	if (metaSave == null) {
		metaSave = {presetsOrder: [], version: 2.02}
		meta_started = true
	} else metaSave = JSON.parse(atob(metaSave))
	if (metaSave.current == undefined) {
		metaSave.current = 1
		metaSave.saveOrder = [1]
	}
	if (!metaSave.current) {
		metaSave.current = 1
		metaSave.alert = true
	}
}

function migrateOldSaves() {
	if (metaSave.newGameMinus!=undefined) {
		metaSave.saveOrder = []
		var ngSave = localStorage.getItem('dimensionSave_aarexModifications')
		if (ngSave != null) {
			ngSave = JSON.parse(atob(ngSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
			if (ngSave.saves != null) {
				for (id=0;id<3;id++) {
					if (ngSave.saves[id] != null) {
						metaSave.saveOrder.push(1+id)
						localStorage.setItem(btoa('dsAM_'+(1+id)), btoa(JSON.stringify(ngSave.saves[id], function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
					}
				}
				if (!metaSave.newGameMinus) metaSave.current=1+ngSave.currentSave
			} else {
				if (!metaSave.newGameMinus) metaSave.current=1
				metaSave.saveOrder.push(1)
				localStorage.setItem(btoa('dsAM_1'), btoa(JSON.stringify(ngSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
			}
		}
		localStorage.removeItem('dimensionSave_aarexModifications')
		var ngmSave = localStorage.getItem('dimensionSave_NGM')
		if (ngmSave != null) {
			ngmSave = JSON.parse(atob(ngmSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
			if (ngmSave.saves != null) {
				for (id=0;id<3;id++) {
					if (ngmSave.saves[id] != null) {
						metaSave.saveOrder.push(4+id)
						localStorage.setItem(btoa('dsAM_'+(4+id)), btoa(JSON.stringify(ngmSave.saves[id], function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
					}
				}
				if (metaSave.newGameMinus) metaSave.current=4+ngmSave.currentSave
			} else {
				if (metaSave.newGameMinus) metaSave.current=4
				metaSave.saveOrder.push(4)
				localStorage.setItem(btoa('dsAM_4'), btoa(JSON.stringify(ngmSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
			}
		}
		localStorage.removeItem('dimensionSave_NGM')
		delete metaSave.newGameMinus
	}
	if (metaSave.version == undefined) {
		metaSave.presetsOrder=[]
		for (id=1;id<4;id++) {
			var studyTreePreset=localStorage.getItem("studyTree"+id)
			if (studyTreePreset !== null) {
				metaSave.presetsOrder.push(id)
				localStorage.setItem(btoa("dsAM_ST_"+id),btoa(JSON.stringify({preset:studyTreePreset})))
				localStorage.removeItem("studyTree"+id)
			}
		}
	}
	if (metaSave.version < 2.01) metaSave.presetsOrder_ers=[]
	metaSave.version=2.02
}

var inflationCheck = false
var betaId = "P"
var prefix = betaId + "ds"
var savePrefix = prefix + "AM_"
var presetPrefix = prefix + "AM_ST_"
var metaSaveId = betaId + "AD_aarexModifications"
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
	if (player.options.standard === undefined) player.options.standard = { useMyr: false }
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
	if (player.dilation.rebuyables === undefined) player.dilation.rebuyables =	{ 1: 0, 2: 0, 3: 0 }
	if (player.timeDimension5 === undefined) player.timeDimension5 = {cost: E("1e2350"), amount: E(0), power: E(1), bought: 0 }
	if (player.timeDimension6 === undefined) player.timeDimension6 = {cost: E("1e2650"), amount: E(0), power: E(1), bought: 0 }
	if (player.timeDimension7 === undefined) player.timeDimension7 = {cost: E("1e3000"), amount: E(0), power: E(1), bought: 0 }
	if (player.timeDimension8 === undefined) player.timeDimension8 = {cost: E("1e3350"), amount: E(0), power: E(1), bought: 0 }
	if (player.why === undefined) player.why = 0
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

		player.infinityDimension1.baseAmount = E(player.infinityDimension1.power).log(50).mul(10).toNumber()
		player.infinityDimension2.baseAmount = E(player.infinityDimension2.power).log(30).mul(10).toNumber()
		player.infinityDimension3.baseAmount = E(player.infinityDimension3.power).log(10).mul(10).toNumber()
		player.infinityDimension4.baseAmount = E(player.infinityDimension4.power).log(5).mul(10).toNumber()
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
				player.infinityPoints = player.infinityPoints.add(1e8)
			}
			if (player.dimensionMultDecrease == 8) {
				player.dimensionMultDecrease = 10
				player.dimensionMultDecreaseCost = 1e8
				player.infinityPoints = player.infinityPoints.add(2.1e9)
			}
			if (player.dimensionMultDecrease == 7) {
				player.dimensionMultDecrease = 10
				player.dimensionMultDecreaseCost = 1e8
				player.infinityPoints = player.infinityPoints.add(4.21e10)
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
}

function setAarexModIfUndefined(){
	aarMod = deepUndefinedAndDecimal(player.aarexModifications, {
		dilationConf: true,
		eternityChallRecords: {},
		presets: {},

		offline: 10,
		progressBar: true,
		tabs: {},
		noFooter: player.options.theme == "Aarex's Modifications" || player.options.theme == "Aarex's Mods II"
	})
	player.aarexModifications = aarMod

	if (mod.ngp3 && aarMod.newGame3PlusVersion === undefined) {
		forceHardReset = true
		reset_game()
		forceHardReset = false
		return
	}
	if (aarMod.newGamePlusPlusVersion == undefined && aarMod.newGame3PlusVersion != undefined) {
		delete player.masterystudies
		delete aarMod.newGame3PlusVersion
	}
	delete aarMod.tabsSave
	delete aarMod.offlineProgress
}

function setSomeEterEraStuff() {
	updateNotationOption()

	if (player.infinitied == 0 && getEternitied() == 0) el("infinityPoints2").style.display = "none"
	if (player.eternityChallUnlocked === null) player.eternityChallUnlocked = 0

	if (getEternitied()<1) el("infmultbuyer").textContent="Max buy IP mult"
	else el("infmultbuyer").textContent="Autobuy IP mult "+(player.infMultBuyer?"ON":"OFF")

	if (player.epmult === undefined || player.epmult == 0) {
		player.epmult = E(1)
		player.epmultCost = E(500)
	}
}

function setSaveStuffHTML(){
	el("save_name").textContent = "You are currently playing in " + (aarMod.save_name ? aarMod.save_name : meta.save.current == "rediscover" ? "Rediscovery" : "Save #" + (savePlacement + 1))
	el("offlineSlider").value = aarMod.offline
	el("offlineInterval").textContent = "Offline progress: " + (aarMod.offline ? (aarMod.offline * 100) + " ticks" : "OFF")

	changeAutoSaveInterval()
}

function setSomeEterEraStuff2(){
	var updatedLTR = []
	for (var lastRun = 0; lastRun < 10; lastRun++) {
		if (typeof(player.lastTenRuns[lastRun]) !== "number") if (player.lastTenRuns[lastRun][0] != 26784000 || player.lastTenRuns[lastRun][1].neq(1)) updatedLTR.push(player.lastTenRuns[lastRun])
		if (player.lastTenEternities[lastRun][0] == 26784000 && player.lastTenEternities[lastRun][1].eq(1)) player.lastTenEternities[lastRun] = [26784000, E(0)]
	}
	for (var a = updatedLTR.length; a < 10; a++) updatedLTR.push([26784000, E(0)])
	player.lastTenRuns = updatedLTR
	updateLastTenRuns()
	updateLastTenEternities()
}

function dov7tov10(){
	var inERS=mod.ers
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
	el(inERS?"r76":"r41").appendChild(el("Spreading Nerd"))
	el("Universal harmony").style["background-image"]="url(images/"+(!mod.ngp3?104:"104-ngp3")+".png)"
	el("Infinite time").style["background-image"]="url(images/"+(inERS?79:69)+".png)"

	if (player.version < 9.5) {
		player.version = 9.5
		if (hasTimeStudy(191)) player.timestudy.theorem += 100
	}

	if (player.version < 10) {
		player.version = 10
		if (hasTimeStudy(72)) {
			for (i = 4; i < 8; i++) {
				player["infinityDimension" + i].amount = player["infinityDimension" + i].amount.div(calcTotalSacrificeBoost().pow(0.02))
			}
		}
	}
}

function doInitNGp2NOT3Stuff(){
	if (aarMod.newGamePlusPlusVersion === undefined && !player.masterystudies) { 
		if (player.dilation.rebuyables[4] !== undefined) {
			var migratedUpgrades = []
			var v2_1check=player.version>13
			for (id=5;id<(v2_1check?18:14);id++) if (player.dilation.upgrades.includes(id)) migratedUpgrades.push(id>16?10:(id>12&&v2_1check)?("ngpp"+(id-10)):(id%4<1)?("ngpp"+(id/4-1)):Math.floor(id/4)*3+id%4)
			if (mod.ngpp) {
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
			if (confirm("Do you want to migrate your NG++ save into new NG+++ mode?")) doNGPlusThreeNewPlayer()
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
			if (Decimal.gte(dim.cost, "1e20000")) dim.cost = E_pow(getTimeDimCostMult(dim)*2.2, dim.bought).mul(getTimeDimStartCost(dim)).mul(E_pow(E('1e1000'),Math.pow(dim.cost.log(10) / 1000 - 20, 2)))
		}
		player.meta = {resets: 0, antimatter: 10, bestAntimatter: 10}
		for (dim=1;dim<9;dim++) player.meta[dim] = {amount: 0, bought: 0, cost: initCost[dim]}
	}
	if (aarMod.newGamePlusPlusVersion < 2.2) {
		for (dim=1;dim<5;dim++) {
			var dim = player["timeDimension" + dim]
			if (Decimal.gte(dim.cost, "1e100000")) dim.cost = E_pow(getTimeDimCostMult(dim)*100, dim.bought).mul(getTimeDimStartCost(dim)).mul(E_pow(E('1e1000'),Math.pow(dim.cost.log(10) / 1000 - 100, 2)))
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
		var metaAchCheck = hasDilStudy(6)
		var noD9AchCheck = player.meta[8].bought > 0 || player.meta.resets > 4
		var metaBoostCheck = player.meta.resets > 9
		if (metaBoostCheck) giveAchievement("And still no ninth dimension...")
		if (noD9AchCheck||metaBoostCheck) giveAchievement("Meta-boosting to the max")
		if (metaAchCheck||noD9AchCheck||metaBoostCheck) giveAchievement("I'm so meta")
		player.galaxyMaxBulk = false
	}
	if (aarMod.newGamePlusPlusVersion < 2.302){
		for (let i = 1; i <= 8; i++) delete player[dimTiers[i]+"Pow"]
		aarMod.newGamePlusPlusVersion = 2.302
	}
}

function doQuantumRestore(){
	var quantumRestore = aarMod.newGamePlusPlusVersion < 2.9 || (!player.quantum && aarMod.newGamePlusPlusVersion > 2.4)
	if (quantumRestore) {
		player.quantum=quSave={
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
	}
	if (quantumRestore || aarMod.newGamePlusPlusVersion < 2.901) {
		quSave.time = player.totalTimePlayed
		quSave.best = 9999999999
		quSave.last10 = [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]]
	}
	if (aarMod.newGamePlusPlusVersion < 2.901) {
		aarMod.quantumConf = true
		$.notify('NG++ was updated to include the Quantum reset.', 'info')
	}
	if (aarMod.newGamePlusPlusVersion < 2.9011 && player.autoEterOptions === undefined) {
		player.autoEterOptions = {epmult:false}
		for (dim=1;dim<9;dim++) player.autoEterOptions["td"+dim] = false
	}
	if (aarMod.newGamePlusPlusVersion < 2.9013) if (aarMod.quantumConf===undefined||quSave.times<1) aarMod.quantumConf=true
	if (aarMod.newGamePlusPlusVersion < 2.90142) aarMod.newGamePlusPlusVersion = 2.90142
	if ((aarMod.newGame3PlusVersion && !player.masterystudies) || aarMod.newGame3PlusVersion < 1.02) player.masterystudies = []
	if (aarMod.newGame3PlusVersion < 1.21) player.replicanti.chanceCost = E_pow(1e15, player.replicanti.chance * 100 + 9)
	if ((quantumRestore && mod.ngp3) || aarMod.newGame3PlusVersion < 1.5) {
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
	if ((quantumRestore && mod.ngp3) || aarMod.newGame3PlusVersion < 1.51) {
		quSave.gluons = {
			rg: 0,
			gb: 0,
			br: 0
		}
	}
}

function doQuantumUpdates(){
	if (aarMod.newGame3PlusVersion < 1.511) if (player.autoEterMode !== undefined) player.autoEterMode = "amount"
	if (mod.ngp3) quSave = player.quantum
	if (mod.ngp3 && !quSave.electrons) {
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
		quSave.pairedChallenges = getBrandNewPCData()
	}
	if (aarMod.newGame3PlusVersion < 1.9975&&!quSave.challenge) quSave.challenge=[]
	if (aarMod.newGame3PlusVersion < 1.9979) {
		player.dilation.bestTP=hasAch("ng3p18")?player.dilation.tachyonParticles:E(0)
		player.old=false
	}
	if (aarMod.newGame3PlusVersion < 1.99799) player.respecOptions={time:player.respec,mastery:player.respec}
	if (aarMod.newGame3PlusVersion < 1.998) {
		var respecedMS = []
		for (var id of player.masterystudies) respecedMS.push(id == "t322" ? "t323" : id)
		player.masterystudies = respecedMS

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
	if (aarMod.newGame3PlusVersion < 1.9986) {
		player.respec=player.respecOptions.time
		player.respecMastery=player.respecOptions.mastery
		updateRespecButtons()
		delete player.respecOptions
	}
	if (aarMod.newGame3PlusVersion < 1.998621) {
		if (quSave.challenge.length<2) quSave.pairedChallenges.current=0
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
	if (aarMod.newGame3PlusVersion < 1.999 || mod.ngp3 && !EDsave?.[1]) { 
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
		quSave.replicants.quantumFoodCost = Decimal.mul(quSave.replicants.quantumFoodCost, 2)
		quSave.replicants.limitDim=1
		EDsave = quSave.emperorDimensions = setupEDSave()
		EDsave[1] = { workers: E(quSave.replicants.workers), progress: E(quSave.replicants.workerProgress), perm: Math.round(parseFloat(quSave.replicants.workers)) }
		player.dontWant = false
		delete quSave.replicants.workers
		delete quSave.replicants.workerProgress
	}
	if (aarMod.newGame3PlusVersion < 1.9995) {
		if (quSave.emperorDimensions[1].perm === undefined) {
			quSave.replicants.quantumFood = 0
			quSave.replicants.quantumFoodCost = 1e46
			EDsave = quSave.emperorDimensions = setupEDSave()
		}
		player.meta.bestOverQuantums = player.meta.bestAntimatter
		quSave.autobuyer.peakTime = 0
		quSave.nanofield = {
			charge: 0,
			energy: 0,
			antienergy: 0,
			rewards: 0,
		}
		nfSave = quSave.nanofield
		quSave.assignAllRatios = {
			r: 1,
			g: 1,
			b: 1
		}
	}
	if (aarMod.newGame3PlusVersion < 1.9997) {
		player.dilation.times = 0
		quSave.tod = todSave = getBrandNewTodData()
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

function doFundamentUpdates() {
	//v2.0: Fundament
	if (aarMod.newGame3PlusVersion < 2) {
		player.eternityBuyer.dilMode = "amount"
		player.eternityBuyer.tpUpgraded = false
		player.eternityBuyer.ifAD = false
		quSave.reached = quSave.times > 0
		quSave.nonMAGoalReached = {}
		quSave.pairedChallenges.fastest = {}
		quSave.pairedChallenges.pc68best = 0
		quSave.bigRip = getBrandNewBigRipData()
		quSave.breakEternity = {
			unlocked: false,
			break: false,
			eternalMatter: 0,
			upgrades: [],
			epMultPower: 0
		}
		ghSave = player.ghostify
		brSave = quSave.bigRip
		beSave = quSave.breakEternity
		aarMod.ghostifyConf = true
	}

	//v2.1: Ghostly Photons
	if (aarMod.newGame3PlusVersion < 2.101) {
		var newAch = []
		for (var a of player.achievements) if (a != "ng3p67") newAch.push(a)
		player.achievements = newAch
	}

	//v2.2: Bosonic Lab
	if (aarMod.newGame3PlusVersion < 2.21) {
		var oldBRUpg20Bought = brSave && brSave.upgrades.pop()
		if (oldBRUpg20Bought != 20) brSave.upgrades.push(oldBRUpg20Bought)
	}
}

function doPostNGP3Versions() {
	if (aarMod.newGamePlusVersion < 2) {
		if (player.masterystudies!==undefined?!quSave.reached&&!ghSave.reached:true) {
			player.money=Decimal.max(player.money,1e25)
			player.infinitiedBank=nMx(player.infinitiedBank,1e6)
			var filter=["timeMult","dimMult","timeMult2","unspentBonus","27Mult","18Mult","36Mult","resetMult","passiveGen","45Mult","resetBoost","galaxyBoost"]
			for (var u=0;u<filter.length;u++) if (!player.infinityUpgrades.includes(filter[u])) player.infinityUpgrades.push(filter[u])
			if (!hasAch("r85")) player.infMult=Decimal.mul(player.infMult,4)
			if (!hasAch("r93")) player.infMult=Decimal.mul(player.infMult,4)
			player.dimensionMultDecrease=2
			player.tickSpeedMultDecrease=1.65
			player.eternities=nMx(player.eternities,100)
			for (var c=2;c<(inNGM(3)?16:inNGM(2)?15:13);c++) if (!player.challenges.includes("challenge"+c)) player.challenges.push("challenge"+c)
			player.replicanti.unl=true
			player.replicanti.amount=Decimal.max(player.replicanti.amount,1)
			if (!hasDilStudy(1)) player.dilation.studies.push(1)
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
	if (aarMod.newGameMinusMinusVersion === undefined && !mod.ngpp) {
		if (!mod.ngud && player.version == 13) player.version = 12
		if (inNGM(2)) {
			player.galacticSacrifice.time = (player.lastUpdate - player.galacticSacrifice.last) / 100
			aarMod.newGameMinusMinusVersion = 1.29
			delete player.galacticSacrifice.last
		} else if (player.galaxyPoints) aarMod.newGameMinusMinusVersion = 1.1
		else if ((Decimal.gt(player.postC3Reward, 1) && player.infinitied < 1 && player.eternities < 1) || (Math.round(E(player.achPow).log(5) * 100) % 100 < 1 && Decimal.gt(player.achPow, 1))) aarMod.newGameMinusMinusVersion = 1
		if (player.firstTotalBought != undefined) {
			player.totalBoughtDims = {}
			for (d=1;d<9;d++) {
				var name = dimTiers[d]
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
		}
		if (E_pow(1e15, player.replicanti.chance*100).mul(1e135).div(player.replicanti.chanceCost).gte(1e59)) aarMod.newGameMinusMinusVersion = 2
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
		if (hasGSacUpg(11)) for (d=1;d<8;d++) {
			var name = dimTiers[d]
			player[name+"Cost"] = Decimal.div(player[name+"Cost"], 10)
		}
	}
	if (aarMod.newGameMinusMinusVersion < 1.22) {
		if (hasGSacUpg(11)) for (d=1;d<8;d++) {
			var name = dimTiers[d]
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
		if (hasGSacUpg(11)) for (d=1;d<8;d++) {
			var name = dimTiers[d]
			player[name+"Cost"] = Decimal.mul(player[name+"Cost"], 100)
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
			dim.cost = E_pow(getIDCostMult(tier),dim.baseAmount / 10).mul(infBaseCost[tier])
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
		mod.ngmX=aarMod.newGame4MinusVersion?4:3
		if (inNGM(4)) reduceDimCosts()
	} else if (!mod.ngmX && inNGM(3)) {
		aarMod.newGame4MinusVersion = 1
		mod.ngmX=4
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
			var name = dimTiers[d]
			if (costMults[d].lt(player.costMultipliers[d-1])) player[name+"Bought"] += (Math.round(Decimal.div(player.costMultipliers[d-1],costMults[d]).log(player.dimensionMultDecrease))+Math.ceil(Decimal.div(Number.MAX_VALUE,initCost[d]).log(costMults[d]))-1)*10
			else player[name+"Bought"] += Decimal.div(player[name+"Cost"],initCost[d]).log(costMults[d])*10
			if (player[name+"Bought"]>0) {
				if (d>1) player.dead=false
				if (d<8) player.dimlife=false
			}
		}
		mod.rs=[]
		player.timestudy.ers_studies=[null]
		for (s=1;s<7;s++) player.timestudy.ers_studies[s]=player.timestudy.studies[s]?player.timestudy.studies[s]:0
		player.timestudy.studies=[]
		if (player.eternityChallenges) {
			player.currentEternityChall=player.eternityChallenges.current?"eterc"+player.eternityChallenges.current:""
			player.eternityChallUnlocked=player.eternityChallenges.unlocked?"eterc"+player.eternityChallenges.unlocked:0
			player.eternityChalls={}
			for (c in player.eternityChallenges.done) player.eternityChalls["eterc"+c]=player.eternityChallenges.done[parseInt(c)]
		}
		player.tickspeed=player.tickspeed.div(E_pow(tmp.gal.ts, player.totalTickGained))
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
		if (hasAch("r85")) player.infMult=player.infMult.mul(4)
		if (hasAch("r93")) player.infMult=player.infMult.mul(4)
		aarMod.ersVersion=1.02
	}
}

function doNGExpv0tov111(){
	if (mod.ngep === undefined && !player.masterystudies && Decimal.gt(player.infMultCost,10) && Math.round(Decimal.div(player.infMultCost,10).log(4)*1e3)%1e3<1) aarMod.newGameExpVersion = 1
	if (aarMod.newGameExpVersion < 1.11) aarMod.newGameExpVersion = 1.11
}

function doNGUdv0tov11(){
	if (aarMod.newGameUpdateVersion === undefined && mod.ngud) {
		aarMod.newGameUpdateVersion=1.01
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
	if (mod.ngud) {
		if (player.options.exdilationconfirm === undefined) player.options.exdilationconfirm = true
		if (player.options.exdilationConfirm !== undefined) {
			player.options.exdilationconfirm = player.options.exdilationConfirm
			delete player.options.exdilationConfirm
		}
		if (mod.ngpp && player.exdilation.spent[4] === undefined) player.exdilation.spent[4] = 0
	}
}

function doNGM4v0tov2111(){
	if (aarMod.newGame4MinusVersion<2) {
		player.tdBoosts=0
		resetNGM4TDs()
	}
	if (aarMod.newGame4MinusVersion<2.1) {
		if ((player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0) && !player.challenges.includes("challenge1")) player.challenges.push("challenge1")
		player.autobuyers.push(15)
		player.challengeTimes.push(600*60*24*31)
	}
	if (aarMod.newGame4MinusVersion<2.111) aarMod.newGame4MinusVersion=2.111
}

function doNGSPUpdatingVersion(){
	if (!mod.udsp) return
	aarMod.nguspV = 2

	for (var d = 1; d <= 8; d++) delete player["blackholeDimension"+d]
	if (player.dilation.autoUpgrades === undefined) player.dilation.autoUpgrades = []
	player.blackhole = deepUndefinedAndDecimal(player.blackhole, BH_UDSP.getSave())
	BH_UDSP.hunger.update()
}

function doInitInfMultStuff(){
	ipMultPower=2
	if (hasMasteryStudy("t241")) ipMultPower=2.2
	if (hasGluonUpg("gb", 3)) ipMultPower=2.3
	if (mod.ngep) ipMultCostIncrease=4
	else ipMultCostIncrease=10
	el("infiMult").innerHTML = "You gain " + ipMultPower + "x more IP.<br>Currently: "+shortenDimensions(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
}

function dov12tov122(){
	if (player.version < 12) {
		for (i=1; i<5; i++) {
			if (player["timeDimension"+i].cost.gte("1e1300")) {
				player["timeDimension"+i].cost = E_pow(getTimeDimCostMult(i)*2.2, player["timeDimension"+i].bought).mul(getTimeDimStartCost(i))
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
	if (player.version < 12.2) { // last supported vanilla version
		player.version = 12.2
		player.sixthCost = Decimal.mul(player.sixthCost, 10)
		if (mod.ngpp) player.meta[6].cost = Decimal.mul(player.meta[6].cost, 10)
	}
}

function updateVersionsONLOAD(){
	el('versionMod').textContent = modAbbs()
	el('info').style.display = mod.ngp3 ? "" : "none"

	dov7tov10()
	if (aarMod.newGamePlusVersion === undefined) if (player.eternities < 20 && ECComps("eterc1") > 0) aarMod.newGamePlusVersion = 1
	doInitNGp2NOT3Stuff()
	doNGP2v2tov2302()

	//NG+3
	quantumed = mod.ngpp && (ghostified || quSave.times > 0)
	doQuantumRestore()
	doQuantumUpdates()
	if (mod.ngp3) {
		doFundamentUpdates()
		doNGP3Updates()
	}

	doNGm2v11tov3()
	doNGm3v21tov3202()
	doERSv0tov102()
	doNGExpv0tov111()
	doNGUdv0tov11()
	doExdilationIfUndefined()
	if (aarMod.ngudpV < 1.12) aarMod.ngudpV = 1.12
	if (aarMod.nguepV < 1.03) aarMod.nguepV = 1.03
	doNGM4v0tov2111()
	doNGSPUpdatingVersion()
	doInitInfMultStuff()
	dov12tov122()
}

function doNGp3Init() {
	setupMasteryStudies()
	updateUnlockedMasteryStudies()
	updateSpentableMasteryStudies()

	delete player.eternityBuyer.presets
	el('prioritydil').value=player.eternityBuyer.dilationPerAmount
	if (player.meta.bestOverQuantums === undefined) player.meta.bestOverQuantums = player.meta.bestAntimatter
	el("eggonsCell").style.display = hasNU(2) ? "none" : ""
	el("workerReplWhat").textContent = hasNU(2) ? "babies" : "eggons"
	updateQuantumWorth()
	if (quSave.autoOptions === undefined) quSave.autoOptions = {}
	if (quSave.nonMAGoalReached === undefined || !quSave.nonMAGoalReached.length) quSave.nonMAGoalReached = []
	if (quSave.challengeRecords === undefined) quSave.challengeRecords = {}
	if (quSave.pairedChallenges.completions === undefined) quSave.pairedChallenges.completions = {}
	if (quSave["10ofield"] !== undefined) {
		quSave.nanofield = nfSave = quSave["10ofield"]
		delete quSave["10ofield"]
	}
	if (quSave.autobuyer.peakTime === undefined) quSave.autobuyer.peakTime = 0
	if (nfSave.rewards>17&&todSave.upgrades[1]==undefined&&!ghSave?.reached&&!aarMod.ngp4V) {
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
}

function setConfirmationsDisplay(){
	el("confirmations").style.display = (player.resets > 4 || player.galaxies > 0 || gSacrificed() || player.infinitied !== 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
	el("gConfirmation").style.display = gSacrificeUnl() ? "" : "none"
	el("challengeconfirmation").style.display = (player.challenges.includes("challenge1") || player.infinitied !== 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
	el("eternityconf").style.display = (player.eternities !== 0 || quantumed) ? "inline-block" : "none"

	el("confirmation").checked = !player.options.sacrificeConfirmation
	el("sacConfirmBtn").textContent = "Sacrifice confirmation: O" + (player.options.sacrificeConfirmation ? "N" : "FF")
	el("gConfirmation").checked = !player.options.gSacrificeConfirmation
	el("gSacConfirmBtn").textContent = "Galactic sacrifice confirmation: O" + (player.options.gSacrificeConfirmation ? "N" : "FF")
	el("challengeconfirmation").textContent = "Challenge confirmation: O" + (player.options.challConf ? "N" : "FF")
	el("eternityconf").textContent = "Eternity confirmation: O" + (player.options.eternityconfirm ? "N" : "FF")
	el("dilationConfirmBtn").textContent = "Dilation confirmation: O" + (aarMod.dilationConf ? "N" : "FF")
	el("exdilationConfirmBtn").textContent = "Reverse dilation confirmation: O" + (player.options.exdilationconfirm ? "N" : "FF")
	el("quantumConfirmBtn").textContent = "Quantum confirmation: O" + (aarMod.quantumConf ? "N" : "FF")
	el("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + ((!mod.ngp3 ? false : brSave.conf) ? "N" : "FF")
	el("ghostifyConfirmBtn").textContent = "Fundament confirmation: O" + (aarMod.ghostifyConf ? "N" : "FF")
}

function setOptionsDisplaysStuff1(){
	el("progressBarBtn").textContent = (aarMod.progressBar?"Hide":"Show")+" progress bar"
	el("toggleLogRateChange").textContent = "Logarithm rate: O"+(aarMod.logRateChange?"N":"FF")
	updatePerformanceTicks()
	dimDescEnd = (aarMod.logRateChange?" OoM":"%")+"/s)"

	el("maxHighestTD").style.display = inNGM(4) ? "" : "none"
	el("maxHighestTD").textContent = "Max only highest Time Dimensions: O"+(aarMod.maxHighestTD?"N":"FF")

	el("infmultbuyer").style.display = getEternitied()>0||mod.ngp3?"inline-block":"none"
	if (!player.options.hotkeys) el("disablehotkeys").textContent = "Enable hotkeys"

	el_class("hideInMorse").display = player.options.notation == "Morse code" ? "none" : ""

	el("hideRepresentation").textContent=(aarMod.hideRepresentation?"Show":"Hide")+" antimatter representation"
	el("showAchRowNums").textContent=(aarMod.showAchRowNums?"Hide":"Show")+" achievement info"
	el("hideCompletedAchs").textContent=(aarMod.hideCompletedAchs?"Show":"Hide")+" completed rows"
	el("hideSecretAchs").textContent=(aarMod.hideSecretAchs?"Show":"Hide")+" extra achievements"
}

function setDisplaysStuff1(){
	el("secretstudy").style.opacity = 0
	el("secretstudy").style.cursor = "pointer"
	
	el("bestAntimatterType").textContent = quantumed ? "Your best meta-antimatter for this Quantum" : "Your best-ever meta-antimatter"

	if (inNGM(2)) {
		el("galaxy11").innerHTML = "Antimatter"+(inNGM(4)?" and Time D":" D")+"imensions are "+(player.infinitied>0||getEternitied()!==0||quantumed?"cheaper based on your Infinities.<br>Currently: <span id='galspan11'></span>x":"99% cheaper.")+"<br>Cost: 1 GP"
		el("galaxy15").innerHTML = "Antimatter and Time Dimensions produce "+(player.infinitied>0||getEternitied()!==0||quantumed?"faster based on your Infinities.<br>Currently: <span id='galspan15'></span>x":"100x faster")+".<br>Cost: 1 GP"
	} else {
		el("infi21").innerHTML = "Increase the multiplier for buying 10 Dimensions<br>"+(mod.ngep?"20x → 24x":"2x → 2.2x")+"<br>Cost: 1 IP"
		el("infi33").innerHTML = "Increase Dimension Boost multiplier<br>2x → 2.5x<br>Cost: 7 IP"
	}
	var resetSkipCosts=[20,40,80]
	for (u=1;u<4;u++) el("infi4"+u).innerHTML="You start with the "+(u+4)+"th dimension unlocked"+(!inNGM(3)?"":" and "+(u*4)+" Tickspeed Boosts")+"<br>Cost: "+resetSkipCosts[u-1]+" IP"
	el("infi44").innerHTML="You start with the 8th dimension unlocked"+(!inNGM(3)?"":", 16 Tickspeed Boosts")+", and a Galaxy<br>Cost: 500 IP"
}

function setChallengeDisplay(){
	var showMoreBreak = inNGM(2) ? "" : "none"
	for (i=1;i<5;i++) el("postinfi0"+i).parentElement.style.display=showMoreBreak
	el("d1AutoChallengeDesc").textContent=(inNGM(4)?"Galactic Sacrifice":"Big Crunch")+" for the first time."
	el("d5AutoChallengeDesc").textContent=inNGM(2)?"Tickspeed upgrades"+(!inNGM(3)?"":" and Tickspeed Boosts")+(inNGM(4)?" are weaker":" start out useless")+", but Galaxies make them stronger.":"Tickspeed starts at 7%."
	el("tbAutoChallengeDesc").textContent=!inNGM(3)?"Whenever you buy 10 of a dimension or tickspeed, everything else of equal cost will increase to its next cost step.":"You can't get Tickspeed Boosts and Antimatter Galaxies are 25% weaker."
	el("autoDBChallengeDesc").textContent="There are only 6 dimensions, with Dimension Boost"+(!inNGM(3)?"":", Tickspeed Boost,")+" and Antimatter Galaxy costs modified."
	el("autoCrunchChallengeDesc").textContent="Each Antimatter Dimension produces the Dimension 2 tiers before it; First Dimensions produce reduced antimatter. "+(inNGM(2)?"Galaxies are far more powerful.":"")
	el("autoDSChallengeDesc").textContent=!inNGM(3)?"Per-ten multiplier is always 1x, but the product of dimensions bought multiplies all Antimatter Dimensions.":"The product of amount is used instead of the product of bought."
	el("autoGSChallengeDesc").textContent=inNGM(4)?"You can hold up to 10 total Dimension Boosts, Time Dimension Boosts, Tickspeed Boosts, and Galaxies.":(inNGM(3)?"All Galaxy upgrades from the third column are disabled and Tickspeed Boosts give 20 free tickspeed purchases each instead.":"You can only get 308 tickspeed upgrades. This count does not reset on resets.")
	el("autoTBChallengeDesc").textContent=inNGM(4)?"Dimension Boosts and Time Dimension Boosts divide Tickspeed Multiplier instead.":"Dimension Boosts and Galaxies only boost Galaxy Point gain and Tickspeed Boosts are nerfed, but Galaxy Points boost Tickspeed Boosts."
	el("infPowEffectPowerDiv").innerHTML=inNGM(2)?"Raised to the power of <span id='infPowEffectPower' style='font-size:35px; color: black'></span>, t":"T"
	el("ngmmchalls").style.display=inNGM(2)?"":"none"
	el("ngmmmchalls").style.display=!inNGM(3)?"none":""
	el("ngm4chall").style.display=inNGM(4)?"":"none"
}

function setInfChallengeOrder() {
	if (inNGM(3)) order = ['postcngmm_1','postcngmm_2','postcngm3_1','postcngm3_2','postcngmm_3','postc1','postc2','postcngm3_3','postc4','postcngm3_4','postc5','postc6','postc7','postc8']
	else if (inNGM(2)) order = ['postcngmm_1','postcngmm_2','postcngmm_3','postc1','postc2','postc4','postc5','postc6','postc7','postc8']
	else order = ['postc1','postc2','postc3','postc4','postc5','postc6','postc7','postc8']
}

function setInfChallengeDisplay(){
	if (inNGM(2)) {
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
	el("postc2reward").textContent = "Reward: "+(inNGM(2)?"S":"Get the Sacrifice autobuyer, and S")+"acrifice is more powerful."
	if (!inNGM(3)) {
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
	el("galaxy21").innerHTML=(inNGM(3)?"Reduce the Dimension Boost cost multiplier to "+(inNGM(4)?10:5):"Dimension Boost scaling starts 2 boosts later, and increases the cost by 5 each")+".<br>Cost: 1 GP"
	el("galaxy12").innerHTML="Antimatter "+(inNGM(4)?"and Time D":"D")+"imensions gain a multiplier based on time spent in this Galactic Sacrifice.<br>Currently: <span id='galspan12'>x</span>x<br>Cost: "+galCosts[12]+" GP"
	el("galBuff22").textContent=inNGM(4)?2:5
	el("galaxy13").innerHTML="Antimatter "+(inNGM(4)?"and Time D":"D")+"imensions gain a multiplier based on your Galaxy Points.<br>Currently: <span id='galspan13'>x</span>x<br>Cost: "+galCosts[13]+" GP"
	el("galDesc23").textContent="Dimension "+(inNGM(4)?" Boosts and Time Dimension B":"B")+"oosts are stronger based on your Galaxy Points."
	el("galcost31").textContent=galCosts[31]
	el("galcost32").textContent=galCosts[32]
	
	el("ic1desc").textContent="All previous Normal Challenges (except for the Tickspeed challenge"+(inNGM(2)?',':" and")+" Automatic Big Crunch challenge"+(inNGM(2)?", and Automatic Galactic Sacrifice challenge":"")+") are applied at once."
	el("ic1reward").textContent="Reward: Get "+(inNGM(2)?2:1.3)+"x on all Infinity Dimensions for each Infinity Challenge completed."
	el("ic2desc").textContent=(!inNGM(3)?"":"Infinity Dimensions are disabled, but Sacrifice is way stronger. ")+"You automatically sacrifice every 0.4 seconds."
	el("ic4desc").textContent=!inNGM(3)?"Only the latest bought Antimatter Dimension's production is normal; all other Antimatter Dimensions produce less.":"All Antimatter Dimension multipliers are square rooted without the dilation penalty."
	el("ic5desc").textContent=!inNGM(3)?"When buying Antimatter Dimensions 1-4, everything with costs smaller or equal increases. When buying Antimatter Dimensions 5-8, everything with costs bigger or equal increases. When buying tickspeed, everything with the same cost increases.":"You can't get tickspeed upgrades and galaxies. Tickspeed Boosts boost tickspeed instead."
	el("ic7desc").textContent="You can't get Antimatter Galaxies, but the Dimension Boost multiplier "+(inNGM(2)?"is cubed":"is increased to 10x")+"."
	el("ic7reward").textContent="Reward: The Dimension Boost multiplier "+(inNGM(2)? "is squared":" is increased to 4x.")
}

function setTSDisplay(){
	el("41desc").textContent=tsMults[41]()
	el("42desc").textContent=inNGM(2)?"Galaxy cost multiplier is reduced by "+Math.round(tsMults[42]()*15)+"/15x.":"Galaxy cost increases by "+(60*tsMults[42]())+" 8ths instead of 60."
	el("61desc").innerHTML=tsMults[61]()
	el("62desc").textContent=tsMults[62]()
	el("81desc").textContent=inNGM(2)?"is cubed":"becomes 10x"
	el("181desc").textContent = inOnlyNGM(2) ? "1% of your GP and IP gain on next reset" : "1% of your IP gained on crunch"
	el("211desc").textContent=tsMults[211]()
	el("222desc").textContent=tsMults[222]()
}

function updateNGp3DisplayStuff(){
	for (var t of MTS.timeStudies) {
		var d=MTS.timeStudyDescs[t]
		el("ts"+t+"Desc").innerHTML=(typeof(d)=="function"?d():d)||"Unknown desc."
	}
	updateMasteryStudyCosts()
	el('reward3disable').textContent="6 hours reward: O"+(quSave.disabledRewards[3]?"FF":"N")
	el('reward4disable').textContent="4.5 hours reward: O"+(quSave.disabledRewards[4]?"FF":"N")
	el('reward11disable').textContent="33.3 mins reward: O"+(quSave.disabledRewards[11]?"FF":"N")
	el('reward27disable').textContent="10 seconds reward: O"+(quSave.disabledRewards[27]?"FF":"N")
	el('rebuyupgAuto').textContent="Auto"+(mod.udsp?" (repeatable): ":": ")+(player.autoEterOptions.rebuyupg?"ON":"OFF")
	el('dilUpgsAuto').textContent="Auto: "+(player.autoEterOptions.dilUpgs?"ON":"OFF")
	el('metaboostAuto').textContent="Auto: "+(player.autoEterOptions.metaboost?"ON":"OFF")
	el('priorityquantum').value=formatValue("Scientific", E(quSave.autobuyer.limit), 2, 0)
	el('sacrificeAuto').textContent="Auto: "+(quSave.autoOptions.sacrifice?"ON":"OFF")
	el("ratio_r").value = quSave.assignAllRatios.r
	el("ratio_g").value = quSave.assignAllRatios.g
	el("ratio_b").value = quSave.assignAllRatios.b
	el('autoAssign').textContent="Auto: O"+(quSave.autoOptions.assignQK?"N":"FF")
	el('autoAssignRotate').textContent="Rotation: "+(quSave.autoOptions.assignQKRotate>1?"Left":quSave.autoOptions.assignQKRotate?"Right":"None")
	el('autoReset').textContent="Auto: O"+(quSave.autoOptions.replicantiReset?"N":"FF")

	updateAssortPercentage()
	updateAutoQuantumMode()
	updateColorCharge()
}

function setSomeQuantumAutomationDisplay(){
	var suffix = "NG" + (mod.ngpp ? "pp" : "ud")
	el("uhDiv" + suffix).appendChild(el("Universal harmony"))
	el("feDiv" + suffix).appendChild(el("In the grim darkness of the far endgame"))
	el("exDilationDesc").innerHTML = mod.udsp ? 'making galaxies <span id="exDilationBenefit" style="font-size:25px; color: black">0</span>% stronger in dilation.' : 'making dilation <span id="exDilationBenefit" style="font-size:25px; color: black">0</span>% less severe.'
	el("metaAntimatterEffectType").textContent=inQC(3) ? "multiplier on all Infinity Dimensions" : "extra multiplier per Dimension Boost"
	if (mod.ngpp) {
		el('epmultAuto').textContent="Auto: O"+(player.autoEterOptions.epmult?"N":"FF")
		for (i=1;i<9;i++) el("td"+i+'Auto').textContent="Auto: O"+(player.autoEterOptions["td"+i]?"N":"FF")
	}
	el('replicantibulkmodetoggle').textContent="Mode: "+(player.galaxyMaxBulk?"Max":"Singles")
}

function setReplAutoDisplay(){
	el('replicantigalaxypowerdiv').style.display=hasAch("r106")&&mod.rs?"":"none"
	el("dilationeterupgrow").style.display=hasDilStudy(1)&&mod.ngud?"":"none"
}

function updateNGModeMessage(){
	ngModeMessages=welcomeMods()
	if (forceToQuantumAndRemove) {
		quantum(false, true, 0)
		ngModeMessages = ["Due to balancing changes, you are forced to Quantum and reset your TT and your best TP, but you are given	" + shorten(setTTAfterQuantum) + " TT as compensation."]
		player.timestudy.theorem = setTTAfterQuantum
		player.dilation.bestTP = E(0)
		el('bestTP').textContent = "Your best ever Tachyon Particles is 0."
	}
}


function onLoad(noOffline) {
	//reload subsave variables
	quSave = player.quantum
	EDsave = quSave?.emperorDimensions
	nfSave = quSave?.nanofield
	todSave = quSave?.tod
	brSave = quSave?.bigRip
	beSave = quSave?.breakEternity

	//ghostify subsaves are in ???
	aarMod = player.aarexModifications

	//reload mods
	cacheMods()

	ghostifyDenied = 0
	setEverythingPreNGp3onLoad()
	setAarexModIfUndefined()
	transformSaveToDecimal()
	setSaveStuffHTML()

	clearOldAchieves()
	updateAchievements()
	updateBadges()

	tmp.tickUpdate = true
	updateCheckBoxes()
	toggleTabAmount()
	toggleTabAmount()
	toggleChallengeRetry()
	toggleChallengeRetry()
	toggleBulk()
	toggleBulk()

	performedTS = false
	setSomeEterEraStuff2()
	setSomeEterEraStuff()

	updateVersionsONLOAD()
	mult18 = E(1)
	resetPowers()
	closeToolTip()
	delete PRESET.reload
	delete PRESET.loc.preset
	if (mod.ngp3) doNGp3Init()

	for (var s = 0; s < (mod.rs ? 4 : 3); s++) toggleCrunchMode(true)
	updateAutoEterMode()

	//This should be reorganized
	setConfirmationsDisplay()
	setOptionsDisplaysStuff1()
	updateHotkeys()
	setDisplaysStuff1()
	setChallengeDisplay()
	setInfChallengeDisplay()
	setOtherChallDisplay()
	setTSDisplay()
	setReplAutoDisplay()
	setSomeQuantumAutomationDisplay()

	if (mod.ngp3) {
		updateNGp3DisplayStuff()
		tousToggleUpdate()
	}
	hideDimensions()
	updateChallenges()
	updateNCVisuals()
	updateChallengeTimes()
	updateAutobuyers()
	updatePriorities()
	loadInfAutoBuyers()
	updateRespecButtons()
	updateEternityChallenges()
	updateEterChallengeTimes()
	setAchieveTooltip()
	updateAnimationBtns(true)

	//This should be moved
	updateLastTenQuantums()
	updateSpeedruns()
	updateBankedEter()
	updateQuantumChallenges()
	updateQCTimes()
	updatePCCompletions()
	updateLastTenGhostifies()

	if (mod.rs) updateGalaxyControl()
	poData=meta.save["presetsOrder"+(mod.rs?"_ers":"")]

	var removeMaxTD=false, removeMaxMD=false
	if (hasAch("ngpp17")) {
		for (d=1;d<9;d++) {
			if (player.autoEterOptions["td"+d]) if (d>7) removeMaxTD=true
			else break
		}
	}
	if (speedrunMilestones > 27) {
		for (d=1;d<9;d++) {
			if (player.autoEterOptions["md"+d]) if (d>7) removeMaxMD=true
			else break
		}
	}
	el("maxTimeDimensions").style.display=removeMaxTD?"none":""
	el("metaMaxAll").style.display=removeMaxMD?"none":""

	if (aarMod.offline && !noOffline) {
		let diff = new Date().getTime() - player.lastUpdate
		if (diff >= 1e3) simulateTime(diff / 1000, aarMod.offline * 100)
	} else player.lastUpdate = new Date().getTime()

	el("newsbtn").textContent=(player.options.newsHidden?"Show":"Hide")+" news ticker"
	el("game").style.display=player.options.newsHidden?"none":"block"
	updateGhostlyNews()
	if (!player.options.newsHidden) scrollNextMessage()

	if (player.totalTimePlayed < 1 || inflationCheck || forceToQuantumAndRemove) {
		updateNGModeMessage()
		if (meta.save.current == "rediscover") REDISCOVER.data[meta.save.rediscover.in].preload()
		inflationCheck = false
		infiniteCheck = false
		showNextModeMessage()
	} else showNextModeMessage()
}

/*
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
Does transformSaveToDecimal() even do anything anymore
we can just remove back compatibility right
no one should have a AD save from back then // wrong, it is entirely possible
I guess we shoudln't but ew its laggy, maybe a variable that says if we have done so
*/

function setupBugfixData() {
	if (break_infinity_js) {
		Decimal = Decimal_BI
		E = E_BI
	}

	initCost = [null, E(10), E(1e2), E(1e4), E(1e6), E(1e9), E(1e13), E(1e18), E(1e24)]
	costMults = [null, E(1e3), E(1e4), E(1e5), E(1e6), E(1e8), E(1e10), E(1e12), E(1e15)]
	nextAt = {postc1: E("1e2000"), postc1_ngmm: E("1e3000"), postc1_ngm3:E("1e3760"),
		postc2: E("1e5000"),
		postc3: E("1e12000"),
		postc4: E("1e14000"),
		postc5: E("1e18000"), postc5_ngm3: E("1e21500"),
		postc6: E("1e20000"), postc6_ngm3: E("1e23000"),
		postc7: E("1e23000"), postc7_ngm3: E("1e25500"),
		postc8: E("1e28000"), postc8_ngm3: E("1e39000"),
		postcngmm_1: E("1e750"),postcngmm_1_ngm3: E("1e1080"),
		postcngmm_2: E("1e1350"),
		postcngmm_3: E("1e2000"), postcngmm_3_ngm3: E("1e2650"),
		postcngm3_1: E("1e1560"),
		postcngm3_2: E("1e2085"),
		postcngm3_3: E("1e8140"),
		postcngm3_4: E("1e17000")}
	goals = {postc1: E("1e850"), postc1_ngmm: E("1e650"), postc1_ngm3: E("1e375"),
		postc2: E("1e10500"), postc2_ngm3: E("1e4250"),
		postc3: E("1e5000"),
		postc4: E("1e13000"), postc4_ngm3: E("1e4210"),
		postc5: E("1e11111"), postc5_ngm3: E("7.77e7777"),
		postc6: E("2e22222"),
		postc7: E("1e10000"), postc7_ngmm: E("1e15000"), postc7_ngm3: E("1e5100"),
		postc8: E("1e27000"), postc8_ngm3: E("1e35000"), 
		postcngmm_1: E("1e550"), postcngmm_1_ngm3: E("1e650"), postcngmm_1_ngm4: E("1e950"),
		postcngmm_2: E("1e950"), postcngmm_2_ngm3: E("1e1090"), postcngmm_2_ngm4: E("1e1200"),
		postcngmm_3: E("1e1200"), postcngmm_3_ngm3: E("1e1230"), postcngmm_3_ngm4: E("1e1530"),
		postcngm3_1: E("1e550"), postcngm3_1_ngm4: E("1e1210"),
		postcngm3_2: E("1e610"), postcngm3_2_ngm4: E("1e750"),
		postcngm3_3: E("8.8888e888"),
		postcngm3_4: E("1e12345")}

	order = ['postc1','postc2','postc3','postc4','postc5','postc6','postc7','postc8']
	setUnlocks = [E_pow(Number.MAX_VALUE, 2.9)]
}

function conToDeciPreInf(){
	player.money = E(player.money)
	player.totalmoney = E(player.totalmoney)
	player.tickSpeedCost = E(player.tickSpeedCost)
	player.tickspeed = E(player.tickspeed)
	for (let dim = 1; dim <= 8; dim++) {
		player[dimTiers[dim]+"Amount"] = E(player[dimTiers[dim]+"Amount"])
		delete player[dimTiers[dim]+"Pow"] //deleted in NG+3 v2.302
		player[dimTiers[dim]+"Cost"] = E(player[dimTiers[dim]+"Cost"])
	}
	player.sacrificed = E(player.sacrificed)
	player.costMultipliers = [E(player.costMultipliers[0]), E(player.costMultipliers[1]), E(player.costMultipliers[2]), E(player.costMultipliers[3]), E(player.costMultipliers[4]), E(player.costMultipliers[5]), E(player.costMultipliers[6]), E(player.costMultipliers[7])]
}

function conToDeciTD(){
	for (let dim = 1; dim <= 8; dim++) {
		const data = player["timeDimension"+dim]
		data.amount = E(data.amount)
		data.cost = isNaN(E(data.cost).e) ? timeDimCost(dim, data.bought) : E(data.cost)
		data.power = E(data.power)
	}
}

function conToDeciPreEter(){
	player.infinityPoints = E(player.infinityPoints)

	conToDeciPreInf()
	player.infinitied = nP(player.infinitied)
	player.infinitiedBank = nP(player.infinitiedBank)
	player.chall3Pow = E(player.chall3Pow)
	player.chall11Pow = E(player.chall11Pow)
	if (inNGM(2)) {
		player.galacticSacrifice.galaxyPoints = Decimal.round(player.galacticSacrifice.galaxyPoints)
		if (player.dimPowerIncreaseCost !== undefined) player.dimPowerIncreaseCost = E(player.dimPowerIncreaseCost)
	}
	player.tickspeedMultiplier = E(player.tickspeedMultiplier)
	player.matter = E(player.matter)

	player.infinityPower = E(player.infinityPower)
	for (let dim = 1; dim <= 8; dim++) {
		const data = player["infinityDimension"+dim]
		data.amount = E(data.amount)
	}
}

function conToDeciLateEter(){
	if (mod.ngud) {
		player.blackhole.power = E(player.blackhole.power)
		for (var d = 1; d <= 8; d++) {
			var dim = player["blackholeDimension"+d]
			if (!dim) continue
			dim.amount = E(dim.amount)
			dim.cost = E(dim.cost)
			dim.power = E(dim.power)
		}

		player.exdilation.unspent = E(player.exdilation.unspent)
		player.exdilation.spent[1] = E(player.exdilation.spent[1])
		player.exdilation.spent[2] = E(player.exdilation.spent[2])
		player.exdilation.spent[3] = E(player.exdilation.spent[3])
		if (player.exdilation.spent[4] !== undefined) player.exdilation.spent[4] = E(player.exdilation.spent[4])
	}

	if (mod.ngpp) {
		player.meta.antimatter = E(player.meta.antimatter);
		player.meta.bestAntimatter = E(player.meta.bestAntimatter);
		for (let i = 1; i <= 8; i++) {
			player.meta[i].amount = E(player.meta[i].amount);
			player.meta[i].cost = E(player.meta[i].cost);
		}
		if (quSave) {
			if (quSave.last10) for (i=0;i<10;i++) quSave.last10[i][1] = E(quSave.last10[i][1])
			quSave.quarks = E(quSave.quarks);
			if (!mod.ngp3) quSave.gluons = (quSave.gluons ? quSave.gluons.rg !== null : true) ? E(0) : E(quSave.gluons);
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
	if (mod.rs) {
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
	if (mod.ngp3) {
		player.dilation.best = E(player.dilation.best || 0)
		player.meta.bestOverQuantums = Decimal.max(player.meta.bestOverQuantums, player.meta.bestAntimatter)
		if (quSave.usedQuarks) {
			quSave.usedQuarks.r = E(quSave.usedQuarks.r)
			quSave.usedQuarks.g = E(quSave.usedQuarks.g)
			quSave.usedQuarks.b = E(quSave.usedQuarks.b)
			quSave.colorPowers.r = E(quSave.colorPowers.r)
			quSave.colorPowers.g = E(quSave.colorPowers.g)
			quSave.colorPowers.b = E(quSave.colorPowers.b)
		}
		if (aarMod.newGame3PlusVersion > 1.5) {
			quSave.gluons.rg = E(quSave.gluons.rg)
			quSave.gluons.gb = E(quSave.gluons.gb)
			quSave.gluons.br = E(quSave.gluons.br)
		}
		if (quSave.autobuyer) quSave.autobuyer.limit = E(quSave.autobuyer.limit)
		if (typeof(quSave?.electrons.amount)=="string") quSave.electrons.amount = Math.round(parseFloat(quSave.electrons.amount)*4)/4
		if (player.dilation.bestTP == undefined) player.dilation.bestTP = hasAch("ng3p18") || hasAch("ng3p37") ? player.dilation.tachyonParticles : 0
		player.dilation.bestTP = E(player.dilation.bestTP)
		if (quSave.pairedChallenges) quSave.pairedChallenges.pc68best = E(quSave.pairedChallenges.pc68best)
		if (quSave.replicants) {
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
		if (EDsave) EDsave = deepUndefinedAndDecimal(EDsave, setupEDSave())
		if (nfSave) {
			nfSave.charge = E(nfSave.charge)
			nfSave.energy = E(nfSave.energy)
			nfSave.antienergy = E(nfSave.antienergy)
			nfSave.powerThreshold = E(nfSave.powerThreshold)
		}
		if (todSave) {
			todSave.r.quarks = E(todSave.r.quarks)
			todSave.r.spin = E(todSave.r.spin)
		}
		if (brSave) {
			brSave.bestThisRun = E(brSave.bestThisRun)
			brSave.totalAntimatter = E(brSave.totalAntimatter)
			brSave.spaceShards = E(brSave.spaceShards)
		}
		if (beSave) beSave.eternalMatter = E(beSave.eternalMatter)
	}
}

// Credit to MrRedShark77, Edited by Aarex
// https://github.com/MrRedShark77/NG-plus-3CR/blob/main/javascripts/core/load_functions.js
// this assumedly does a deep search for undefined values
function deepUndefinedAndDecimal(obj, data) {
	if (obj == null || obj == undefined) return data
	for (let x = 0; x < Object.keys(data).length; x++) {
		let k = Object.keys(data)[x]
		if (obj[k] === null || data[k] === undefined) continue;
		if (obj[k] === undefined) obj[k] = data[k]
		else {
			if (data[k].exponent !== undefined) obj[k] = E(obj[k])
			else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
		}
	}
	return obj
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
	loadFundament()
}


function loadAutoBuyerSettings() {
	for (var i = 0; i < 9; i++) {
		let data = player.autobuyers[i]
		if (data % 1 === 0) continue

		let key = autoBuyerKeys[i]
		let elm = el("ab_" + key + "_toggle")
		el("ab_" + key + "_toggle").textContent = "Buys " + (data.target < 10 ? "singles" : key == "ts" ? "max" : "until 10")
		el("priority" + (i + 1)).selectedIndex = data.priority - 1
	}

	priorityOrder()
	el("priority10").value = player.autobuyers[9].priority
	el("priority11").value = player.autobuyers[10].priority
	el("priority12").value = player.autoCrunchMode == "amount" ? formatValue("Scientific", player.autobuyers[11].priority, 2, 0) : player.autobuyers[11].priority
	el("overGalaxies").value = player.overXGalaxies
	el("bulkDimboost").value = player.autobuyers[9].bulk
	el("prioritySac").value = player.autoSacrifice.priority
	el("bulkgalaxy").value = player.autobuyers[10].bulk
	updateAutoCrunchMode()
	el("priority13").value = formatValue("Scientific", E(player.eternityBuyer.limit), 2, 0)
	if (player.eternityBuyer.dilationPerAmount !== undefined) el('prioritydil').value=player.eternityBuyer.dilationPerAmount
	updateAutoEterMode()

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
	if (mod.rs) el("requireIPPeak").checked = player.autobuyers[11].requireIPPeak;
	if (mod.ngp3) {
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

function migrateOldSaves() {
	if (meta.save.newGameMinus!=undefined) {
		meta.save.saveOrder = []
		var ngSave = localStorage.getItem('dimensionSave_aarexModifications')
		if (ngSave != null) {
			ngSave = JSON.parse(atob(ngSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
			if (ngSave.saves != null) {
				for (id=0;id<3;id++) {
					if (ngSave.saves[id] != null) {
						meta.save.saveOrder.push(1+id)
						localStorage.setItem(btoa('dsAM_'+(1+id)), btoa(JSON.stringify(ngSave.saves[id], function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
					}
				}
				if (!meta.save.newGameMinus) meta.save.current=1+ngSave.currentSave
			} else {
				if (!meta.save.newGameMinus) meta.save.current=1
				meta.save.saveOrder.push(1)
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
						meta.save.saveOrder.push(4+id)
						localStorage.setItem(btoa('dsAM_'+(4+id)), btoa(JSON.stringify(ngmSave.saves[id], function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
					}
				}
				if (meta.save.newGameMinus) meta.save.current=4+ngmSave.currentSave
			} else {
				if (meta.save.newGameMinus) meta.save.current=4
				meta.save.saveOrder.push(4)
				localStorage.setItem(btoa('dsAM_4'), btoa(JSON.stringify(ngmSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
			}
		}
		localStorage.removeItem('dimensionSave_NGM')
		delete meta.save.newGameMinus
	}
	if (meta.save.version == undefined) {
		meta.save.presetsOrder=[]
		for (id=1;id<4;id++) {
			var studyTreePreset=localStorage.getItem("studyTree"+id)
			if (studyTreePreset !== null) {
				meta.save.presetsOrder.push(id)
				localStorage.setItem(btoa("dsAM_ST_"+id),btoa(JSON.stringify({preset:studyTreePreset})))
				localStorage.removeItem("studyTree"+id)
			}
		}
	}
	meta.save.version = meta.ver
}
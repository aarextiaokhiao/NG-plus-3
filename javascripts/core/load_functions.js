var inflationCheck = false
var notifyId = 0
function onLoad(noOffline) {
  happyHalloween=false
  if (player.totalmoney === undefined || isNaN(player.totalmoney)) player.totalmoney = player.money;
  if (player.tickspeed === undefined) player.tickspeed = new Decimal(1000)
  if (player.options === undefined) {
      player.options = {
          scientific: false,
          animationOn: true
      }
  }
  if (player.options.invert === true) player.options.theme = "Inverted"; player.options.invert = undefined;
  if (player.options.notation === undefined) player.options.notation = "Standard"
  if (player.options.challConf === undefined) player.options.challConf = false
  if (player.options.scientific === undefined || typeof(player.options.scientific) == "boolean") player.options.scientific={significantDigits:undefined}
  if (player.options.logarithm === undefined) player.options.logarithm={base:10}
  if (player.options.tetration === undefined) player.options.tetration={base:2}
  if (player.options.spazzy === undefined) player.options.spazzy={subNotation:"Scientific"}
  if (player.options.aas === undefined) player.options.aas={useHyphen: false, useDe: false}
  if (player.options.newsHidden === undefined) player.options.newsHidden = false;
  if (player.options.sacrificeConfirmation === undefined) player.options.sacrificeConfirmation = true;
  if (player.options.retryChallenge === undefined) player.options.retryChallenge = false;
  if (player.options.bulkOn === undefined) player.options.bulkOn = true
  if (player.options.cloud === undefined) player.options.cloud = true
  if (player.options.hotkeys === undefined) player.options.hotkeys = true
  if (player.options.eternityconfirm === undefined) player.options.eternityconfirm = true
  if (player.options.themes === undefined) player.options.themes = "Normal"
  if (player.options.secretThemeKey === undefined) player.options.secretThemeKey = 0
  if (player.achievements === undefined) player.achievements = [];
  if (player.sacrificed === undefined) player.sacrificed = new Decimal(0);
  if (player.infinityUpgrades === undefined) player.infinityUpgrades = [];
  if (player.infinityPoints === undefined) player.infinityPoints = new Decimal(0);
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
  if (player.firstAmount !== 0) document.getElementById("secondRow").style.display = "table-row";
  if (player.challenges === undefined) player.challenges = []
  if (player.currentChallenge === undefined) player.currentChallenge = ""
  if (player.infinitied > 0 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1")
  if (player.matter === undefined) player.matter = new Decimal(0)
  if (player.autobuyers === undefined) player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  if (player.costMultipliers === undefined) player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
  if (player.tickspeedMultiplier === undefined) player.tickspeedMultiplier = new Decimal(10)
  if (player.partInfinityPoint === undefined) player.partInfinityPoint = 0
  if (player.challengeTimes === undefined) player.challengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
  if (player.infchallengeTimes === undefined) player.infchallengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
  if (player.lastTenRuns === undefined) player.lastTenRuns = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
  if (player.infMult === undefined) player.infMult = new Decimal(1)
  if (player.infMultCost === undefined) player.infMultCost = new Decimal(100)
  if (player.tickSpeedMultDecrease === undefined) player.tickSpeedMultDecrease = 10
  if (player.tickSpeedMultDecreaseCost === undefined) player.tickSpeedMultDecreaseCost = 3e6
  if (player.dimensionMultDecrease === undefined) player.dimensionMultDecrease = 10
  if (player.dimensionMultDecreaseCost === undefined) player.dimensionMultDecreaseCost = 1e8
  if (player.overXGalaxies === undefined) player.overXGalaxies = 10;
  if (player.partInfinitied === undefined) player.partInfinitied = 0
  if (player.spreadingCancer === undefined) player.spreadingCancer = 0
  if (player.postC4Tier === undefined) player.postC4Tier = 0
  if (player.postC3Reward === undefined) player.postC3Reward = new Decimal(1)
  if (player.postC8Mult === undefined) player.postC8Mult = new Decimal(1)
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
  if (player.lastTenEternities === undefined) player.lastTenEternities = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
  if (player.respec === undefined) player.respec = false
  if (player.options.commas === undefined) player.options.commas = true
  if (player.eternityChalls === undefined) player.eternityChalls = {}
  if (player.eternityChallGoal === undefined) player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
  if (player.currentEternityChall === undefined) player.currentEternityChall = ""
  if (player.eternityChallUnlocked === undefined) player.eternityChallUnlocked = 0
  if (player.options.chart === undefined) player.options.chart = {}
  if (player.options.chart.updateRate === undefined) player.options.chart.updateRate = 1000
  if (player.options.chart.duration === undefined) player.options.chart.duration = 10
  if (player.options.chart.warning === undefined) player.options.chart.warning = 0
  if (player.options.chart.on === undefined) player.options.chart.on = false
  if (player.options.chart.dips === undefined) player.options.chart.dips = true
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
  if (player.dilation.tachyonParticles === undefined) player.dilation.tachyonParticles = new Decimal(0)
  if (player.dilation.dilatedTime === undefined) player.dilation.dilatedTime = new Decimal(0)
  if (player.dilation.totalTachyonParticles === undefined) player.dilation.totalTachyonParticles = new Decimal(0)
  if (player.dilation.nextThreshold === undefined) player.dilation.nextThreshold = new Decimal(1000)
  if (player.dilation.freeGalaxies === undefined) player.dilation.freeGalaxies = 0
  if (player.dilation.upgrades === undefined) player.dilation.upgrades = []
  if (player.dilation.rebuyables === undefined) player.dilation.rebuyables =  { 1: 0, 2: 0, 3: 0 }
  if (player.timeDimension5 === undefined) player.timeDimension5 = {cost: new Decimal("1e2350"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.timeDimension6 === undefined) player.timeDimension6 = {cost: new Decimal("1e2650"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.timeDimension7 === undefined) player.timeDimension7 = {cost: new Decimal("1e3000"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.timeDimension8 === undefined) player.timeDimension8 = {cost: new Decimal("1e3350"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.why === undefined) player.why = 0
  if (player.options.animations === undefined) player.options.animations = {floatingText: true, bigCrunch: true, eternity: true, tachyonParticles: true}
  setTheme(player.options.theme);

  sliderText.textContent = "Update rate: " + player.options.updateRate + "ms";
  slider.value = player.options.updateRate;

  if (player.secondAmount !== 0) {
      document.getElementById("thirdRow").style.display = "table-row";
      document.getElementById("tickSpeed").style.visibility = "visible";
      document.getElementById("tickSpeedMax").style.visibility = "visible";
      document.getElementById("tickLabel").style.visibility = "visible";
      document.getElementById("tickSpeedAmount").style.visibility = "visible";
  }
  if (player.options.notation == "Mixed") player.options.notation = "Mixed scientific"

  if (player.infinityPower === undefined) {
      player.infinityPower = new Decimal(1)
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
      player.infDimensionsUnlocked = [false, false, false, false]
  }

  if (player.timeShards === undefined) {
      player.timeShards = new Decimal(0)
      player.eternityPoints = new Decimal(0)
      player.tickThreshold = new Decimal(1)
      player.totalTickGained = 0
      player.eternities = 0
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
  }

  if (player.infinityDimension1.baseAmount === undefined) {
      player.infinityDimension1.baseAmount = 0;
      player.infinityDimension2.baseAmount = 0;
      player.infinityDimension3.baseAmount = 0;
      player.infinityDimension4.baseAmount = 0;

      player.infinityDimension1.baseAmount = new Decimal(player.infinityDimension1.power).log(50).times(10).toNumber()
      player.infinityDimension2.baseAmount = new Decimal(player.infinityDimension2.power).log(30).times(10).toNumber()
      player.infinityDimension3.baseAmount = new Decimal(player.infinityDimension3.power).log(10).times(10).toNumber()
      player.infinityDimension4.baseAmount = new Decimal(player.infinityDimension4.power).log(5).times(10).toNumber()


  }
  if (player.autoIP === undefined) player.autoIP = new Decimal(0)
  if (player.autoTime === undefined) player.autoTime = 1e300;

  if (player.matter === null) player.matter = new Decimal(0)
  for (var i=0; i<12; i++) {
      if (player.autobuyers[i]%1 !== 0 && player.autobuyers[i].tier === undefined) {
          player.autobuyers[i].tier = i+1
      }
      if (player.autobuyers[i]%1 !== 0 && player.autobuyers[i].target%1 !== 0) {
          player.autobuyers[i].target = i+1
          if (i == 8) player.autobuyers[i].target = 1
      }

      if (player.autobuyers[i]%1 !== 0 && (player.autobuyers[i].bulk === undefined || isNaN(player.autobuyers[i].bulk) || player.autobuyers[i].bulk === null)) {
          player.autobuyers[i].bulk = 1
      }
  }
  if (player.autobuyers[8].tier == 10) player.autobuyers[8].tier = 9

  if (player.thirdAmount !== 0 || getEternitied() >= 30) document.getElementById("fourthRow").style.display = "table-row";
  if (player.fourthAmount !== 0|| getEternitied() >= 30)
  if (player.resets > 0) document.getElementById("fifthRow").style.display = "table-row";
  if (player.fifthAmount !== 0|| getEternitied() >= 30)
  if (player.resets > 1) document.getElementById("sixthRow").style.display = "table-row";
  if (player.sixthAmount !== 0|| getEternitied() >= 30)
  if (player.resets > 2 && player.currentChallenge !== "challenge4" && player.currentChallenge !== "postc1") document.getElementById("seventhRow").style.display = "table-row";
  if (player.seventhAmount !== 0|| getEternitied() >= 30)
  if (player.resets > 3 && player.currentChallenge !== "challenge4") document.getElementById("eightRow").style.display = "table-row";

  document.getElementById("totaltickgained").textContent = "You've gained "+getFullExpansion(player.totalTickGained)+" tickspeed upgrades."

  GPminpeak = new Decimal(0)
  IPminpeak = new Decimal(0)
  EPminpeakType = 'normal'
  EPminpeak = new Decimal(0)
  QKminpeak = new Decimal(0)
  QKminpeakValue = new Decimal(0)
  GHPminpeak = new Decimal(0)
  GHPminpeakValue = new Decimal(0)
  if (player.peakSpent) player.peakSpent = 0

  if (typeof player.autobuyers[9].bulk !== "number") {
      player.autobuyers[9].bulk = 1
  }

  if (player.version === undefined) { // value will need to be adjusted when update goes live
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

  if (player.infinityDimension5 === undefined) {
      player.infDimensionsUnlocked.push(false)
      player.infDimensionsUnlocked.push(false)
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
      player.version = 6
  }

  if (player.infinityDimension7 == undefined) {
      player.infDimensionsUnlocked.push(false)
      player.infDimensionsUnlocked.push(false)
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

  if (player.replicanti === undefined) {
      player.replicanti = {
          amount: new Decimal(0),
          unl: false,
          chance: 0.01,
          chanceCost: new Decimal(1e150),
          interval: 1000,
          intervalCost: new Decimal(1e140),
          gal: 0,
          galaxies: 0,
          galCost: new Decimal(1e170)
      }
  }
  if (player.bestEternity === undefined) {
      player.bestEternity = 9999999999
      player.thisEternity = player.totalTimePlayed
  }
  if (player.timestudy === undefined) {
      player.timestudy = {
          theorem: 0,
          amcost: new Decimal("1e20000"),
          ipcost: new Decimal(1),
          epcost: new Decimal(1),
          studies: [],
      }
  }



  if (getEternitied() == 0) {
      document.getElementById("eternityPoints2").style.display = "none";
      document.getElementById("eternitystorebtn").style.display = "none";
      document.getElementById("tdtabbtn").style.display = "none";
  }

  if (player.eternityUpgrades === undefined) player.eternityUpgrades = []

  if (player.infDimBuyers === undefined) player.infDimBuyers = [false, false, false, false, false, false, false, false]

  if (player.replicanti.auto === undefined) player.replicanti.auto = [false, false, false]
  if (player.eternityBuyer === undefined) {
      player.eternityBuyer = {
          limit: new Decimal(0),
          isOn: false
      }
  }
  
  if (typeof(player.options.commas) !== "string") {
      if (player.options.commas) player.options.commas = "Commas"
      else player.options.commas = player.options.notation
  }
  if (player.shameLevel === undefined) player.shameLevel = 0;
    
  if (player.aarexModifications === undefined) {
      player.aarexModifications = {
          breakInfinity: false
      }
  }
  if (break_infinity_js!=player.aarexModifications.breakInfinity) {
      save_game(true)
      document.location.reload(true)
      return
  }
  if (player.aarexModifications.dilationConf === undefined) {
      player.aarexModifications.dilationConf = true
  }
  if (player.aarexModifications.offlineProgress === undefined) {
      player.aarexModifications.offlineProgress = true
  }
  if (player.aarexModifications.autoSave === undefined) {
      player.aarexModifications.autoSave = true
  }
  if (player.aarexModifications.progressBar === undefined) {
      player.aarexModifications.progressBar = true
  }
  if (player.aarexModifications.logRateChange === undefined) {
      player.aarexModifications.logRateChange = false
  }
  if (player.aarexModifications.hideProductionTab === undefined) {
      player.aarexModifications.hideProductionTab = !(!player.boughtDims) && player.aarexModifications.ersVersion === undefined
  }
  if (player.aarexModifications.eternityChallRecords === undefined) player.aarexModifications.eternityChallRecords = {}
  if (player.aarexModifications.popUpId === undefined) {
      player.aarexModifications.popUpId = 0
  }
  if (player.aarexModifications.tabsSave === undefined) player.aarexModifications.tabsSave = {on: false}
  if (player.aarexModifications.newGamePlusPlusVersion == undefined && player.aarexModifications.newGame3PlusVersion != undefined) {
      delete player.masterystudies
      delete player.aarexModifications.newGame3PlusVersion
  }
  transformSaveToDecimal();
  updateTickSpeed();
  updateAchievements();
  updateCheckBoxes();
  toggleChallengeRetry()
  toggleChallengeRetry()
  toggleBulk()
  toggleBulk()

  document.getElementById("rename").innerHTML = "<p style='font-size:15px'>Rename</p>Name: "+(player.aarexModifications.save_name?player.aarexModifications.save_name:"Save #" + savePlacement)
  document.getElementById("offlineProgress").textContent = "Offline progress: O"+(player.aarexModifications.offlineProgress?"N":"FF")
  document.getElementById("autoSave").textContent = "Auto save: O"+(player.aarexModifications.autoSave?"N":"FF")

  if (!player.replicanti.auto[0]) document.getElementById("replauto1").textContent = "Auto: OFF"
  if (!player.replicanti.auto[1]) document.getElementById("replauto2").textContent = "Auto: OFF"
  if (!player.replicanti.auto[2]) document.getElementById("replauto3").textContent = "Auto: OFF"

  loadAutoBuyerSettings();
  var updatedLTR = []
  for (lastRun=0; lastRun<10 ; lastRun++) {
      if (typeof(player.lastTenRuns[lastRun]) !== "number") if (player.lastTenRuns[lastRun][0] != 26784000 || player.lastTenRuns[lastRun][1].neq(1)) updatedLTR.push(player.lastTenRuns[lastRun])
      if (player.lastTenEternities[lastRun][0] == 26784000 && player.lastTenEternities[lastRun][1].eq(1)) player.lastTenEternities[lastRun] = [26784000, new Decimal(0)]
  }
  for (a=updatedLTR.length;a<10;a++) updatedLTR.push([26784000, new Decimal(0)])
  player.lastTenRuns = updatedLTR
  updateLastTenRuns()
  updateLastTenEternities()

  updateInfCosts()


  if (player.replicanti.unl == true) {
      document.getElementById("replicantidiv").style.display="inline-block"
      document.getElementById("replicantiunlock").style.display="none"
  } else {
      document.getElementById("replicantidiv").style.display="none"
      document.getElementById("replicantiunlock").style.display="inline-block"
  }

  if (player.currentChallenge == "challenge12" || player.currentChallenge == "challenge9" || player.currentChallenge == "challenge5" || player.currentChallenge == "challenge14" ||
      player.currentChallenge == "postc1" || player.currentChallenge == "postc4" || player.currentChallenge == "postc5" || player.currentChallenge == "postc6" || player.currentChallenge == "postc8") document.getElementById("quickReset").style.display = "inline-block";
  else document.getElementById("quickReset").style.display = "none";


  document.getElementById("break").textContent = (player.break ? "FIX" : "BREAK") + " INFINITY"

  updateNotationOption()

  document.getElementById("floatingTextAnimBtn").textContent = "Floating text: " + ((player.options.animations.floatingText) ? "ON" : "OFF")
  document.getElementById("bigCrunchAnimBtn").textContent = "Big crunch: " + (player.options.animations.bigCrunch === "always" ? "ALWAYS" : player.options.animations.bigCrunch ? "ON" : "OFF")
  document.getElementById("tachyonParticleAnimBtn").textContent = "Tachyon particles: " + ((player.options.animations.tachyonParticles) ? "ON" : "OFF")

  if (player.infinitied == 0 && getEternitied() == 0) document.getElementById("infinityPoints2").style.display = "none"

  var isInIC1=player.galacticSacrifice&&!player.aarexModifications.newGameMinusMinusVersion?player.currentChallenge=="postc4":player.currentChallenge=="postc1"
  if (player.currentChallenge == "challenge12" || isInIC1 || player.currentChallenge == "postc6" || inQC(6)) document.getElementById("matter").style.display = "block";
  else document.getElementById("matter").style.display = "none";
  if (player.currentChallenge == "challenge13" || player.tickspeedBoosts != undefined || (isInIC1 && player.galacticSacrifice)) document.getElementById("chall13Mult").style.display = "block";
  else document.getElementById("chall13Mult").style.display = "none";

  var inERS=!(!player.boughtDims)
  if (player.replicanti.galaxybuyer !== undefined && !inERS) {
      replicantiGalaxyAutoToggle()
      replicantiGalaxyAutoToggle()
  }

  if (player.eternityChallUnlocked === null) player.eternityChallUnlocked = 0
  if (player.eternityChallUnlocked !== 0) document.getElementById("eterc"+player.eternityChallUnlocked+"div").style.display = "inline-block"

  if (getEternitied()<1) document.getElementById("infmultbuyer").textContent="Max buy IP mult"
  else document.getElementById("infmultbuyer").textContent="Autobuy IP mult O"+(player.infMultBuyer?"N":"FF")

  if (player.epmult === undefined || player.epmult == 0) {
      player.epmult = new Decimal(1)
      player.epmultCost = new Decimal(500)
  }

  clearOldAchieves()

  document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"

  for (var i=0; i<player.timestudy.studies.length; i++) {
      if (player.timestudy.studies.length>0&&typeof(player.timestudy.studies[0])!=="number") break
      if (player.timestudy.studies[i] == 71 || player.timestudy.studies[i] == 81 || player.timestudy.studies[i] == 91 || player.timestudy.studies[i] == 101) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought normaldimstudy"
      } else if (player.timestudy.studies[i] == 72 || player.timestudy.studies[i] == 82 || player.timestudy.studies[i] == 92 || player.timestudy.studies[i] == 102) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought infdimstudy"
      } else if (player.timestudy.studies[i] == 73 || player.timestudy.studies[i] == 83 || player.timestudy.studies[i] == 93 || player.timestudy.studies[i] == 103) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought timedimstudy"
      } else if (player.timestudy.studies[i] == 121 || player.timestudy.studies[i] == 131 || player.timestudy.studies[i] == 141) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought activestudy"
      } else if (player.timestudy.studies[i] == 122 || player.timestudy.studies[i] == 132 || player.timestudy.studies[i] == 142) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought passivestudy"
      } else if (player.timestudy.studies[i] == 123 || player.timestudy.studies[i] == 133 || player.timestudy.studies[i] == 143) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought idlestudy"
      } else if (player.timestudy.studies[i] == 221 || player.timestudy.studies[i] == 224 || player.timestudy.studies[i] == 225 || player.timestudy.studies[i] == 228 || player.timestudy.studies[i] == 231 || player.timestudy.studies[i] == 234) {
          document.getElementById(player.timestudy.studies[i]).className = "timestudybought darkstudy"
      } else if (player.timestudy.studies[i] == 222 || player.timestudy.studies[i] == 223 || player.timestudy.studies[i] == 226 || player.timestudy.studies[i] == 227 || player.timestudy.studies[i] == 232 || player.timestudy.studies[i] == 233) {
          document.getElementById(player.timestudy.studies[i]).className = "timestudybought lightstudy"
      } else {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought"
      }
  }

  if (player.version > 7 && inERS && !player.aarexModifications.ersVersion) {
	  player.version = 7
  }
  if (player.version < 9) {
      player.version = 9
      let achs = []
      if (player.achievements.includes("r22")) {
          achs.push("r35")
          player.achievements.splice(player.achievements.indexOf("r22"), 1)
      }
      if (player.achievements.includes("r35")) {
          achs.push("r76")
          player.achievements.splice(player.achievements.indexOf("r35"), 1)
      }
      if (player.achievements.includes("r41")) {
          achs.push("r22")
          player.achievements.splice(player.achievements.indexOf("r41"), 1)
      }
      if (player.achievements.includes("r76")) {
          achs.push("r41")
          player.achievements.splice(player.achievements.indexOf("r76"), 1)
      }

      for (var i=0; i<achs.length;i++) player.achievements.push(achs[i])
      updateAchievements()
      if (!inERS) player.replicanti.intervalCost = player.replicanti.intervalCost.dividedBy(1e20)
  }
  document.getElementById(inERS?"r22":"r35").appendChild(document.getElementById("Don't you dare to sleep"))
  document.getElementById(inERS?"r35":"r76").appendChild(document.getElementById("One for each dimension"))
  document.getElementById(inERS?"r41":"r22").appendChild(document.getElementById("Fake News"))
  document.getElementById(inERS?"r76":"r41").appendChild(document.getElementById("Spreading Cancer"))
  document.getElementById("Universal harmony").style["background-image"]="url(images/"+(player.masterystudies==undefined?104:"104-ngp3")+".png)"
  document.getElementById("Infinite time").style["background-image"]="url(images/"+(inERS?79:69)+".png)"

  if (player.version < 9.5) {
      player.version = 9.5
      if (player.timestudy.studies.includes(191)) player.timestudy.theorem += 100
  }

  if (player.version < 10) {
      player.version = 10
      if (player.timestudy.studies.includes(72)) {
          for (i=4; i<8; i++) {
              player["infinityDimension"+i].amount = player["infinityDimension"+i].amount.div(calcTotalSacrificeBoost().pow(0.02))
          }
      }
  }

  if (player.aarexModifications.newGameMinusVersion === undefined && !player.boughtDims) {
      if (checkNGM() > 0) {
          player.aarexModifications.newGameMinusVersion = (player.aarexModifications.newGameMinusUpdate !== undefined ? player.aarexModifications.newGameMinusUpdate : player.newGameMinusUpdate === undefined ? checkNGM() : 1.1)
          delete player.aarexModifications.newGameMinusUpdate
          delete player.newGameMinusUpdate
      }
  }
  if (player.aarexModifications.newGameMinusVersion < 1.1) {
      player.totalTimePlayed+=1728000
      player.timestudy.theorem+=1
      player.timestudy.ipcost=Decimal.div(player.timestudy.ipcost,2)
      if (player.eternityChalls.eterc1==undefined) player.eternityChalls.eterc1=-6
      else player.eternityChalls.eterc1-=6
      if (player.eternityChalls.eterc11==undefined) player.eternityChalls.eterc11=1
      else if (player.eternityChalls.eterc11<5) player.eternityChalls.eterc11+=1
      player.aarexModifications.newGameMinusVersion = 1.1
  }
  if (player.aarexModifications.newGameMinusVersion < 2) {
      if (player.eternities == -20) {
          player.infinitied += 991
          player.offlineProdCost = Decimal.times(player.offlineProdCost, 5e4)
      } player.infinitiedBank -= 996
      player.spreadingCancer -= 9000
      player.timeDimension1.power = player.timeDimension1.power.mul(2)
      player.timestudy.theorem--
      player.timestudy.ipcost = player.timestudy.ipcost.div(5e11)
      player.dilation.nextThreshold.e = 6
      player.dilation.totalTachyonParticles = new Decimal(500)
      player.dilation.rebuyables[2] = 1
      player.timeDimension5.power.e = -3
      player.timeDimension6.power = new Decimal(0.0004)
      player.timeDimension7.power.e = -4
      player.timeDimension8.power = new Decimal(0.00004)
  }
  if (player.aarexModifications.newGameMinusVersion < 2.1) {
      player.timeDimension1.power = player.timeDimension1.power.mul(8)
      player.timeDimension4.power = player.timeDimension4.power.mul(4)
      player.timestudy.theorem--
      player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.add(1500)
  }
  if (player.aarexModifications.newGameMinusVersion < 2.2) {
      player.timestudy.theorem += 3;
      const pow_div = [0,160,5/3,1,3,100,80,100/3,20];
      for (i=1;i<=8;i++) player["timeDimension"+i].power = player["timeDimension"+i].power.div(pow_div[i]);
      if (player.eternityChalls.eterc11 == 1) delete player.eternityChalls.eterc11
      else player.eternityChalls.eterc11--
      $.notify('Your NG- save has been updated due to few balancing issues.', 'info')
  }
  if (player.aarexModifications.newGamePlusVersion === undefined) if (player.eternities < 20 && ECTimesCompleted("eterc1") > 0) player.aarexModifications.newGamePlusVersion = 1
  if (player.aarexModifications.newGamePlusPlusVersion === undefined && !player.masterystudies) { 
      if (player.dilation.rebuyables[4] !== undefined) {
          var migratedUpgrades = []
          var v2_1check=player.version>13
          for (id=5;id<(v2_1check?18:14);id++) if (player.dilation.upgrades.includes(id)) migratedUpgrades.push(id>16?10:(id>12&&v2_1check)?("ngpp"+(id-10)):(id%4<1)?("ngpp"+(id/4-1)):Math.floor(id/4)*3+id%4)
          if (player.meta) {
              for (dim=1;dim<9;dim++) {
                  player.meta[dim].bought += player.meta[dim].tensBought * 10
                  delete player.meta[dim].tensBought
              }
              if (player.autoEterMode) player.aarexModifications.newGamePlusPlusVersion = 2.2
              else if (v2_1check) {
                  player.version = 12.1
                  player.aarexModifications.newGamePlusPlusVersion = 2.1
              } else if (player.meta) player.aarexModifications.newGamePlusPlusVersion = 2
          } else player.aarexModifications.newGamePlusPlusVersion = 1
          var newAchievements=[]
          var v2_3check=player.ep5xAutobuyer!==undefined
          for (id=0;id<player.achievements.length;id++) {
              r=player.achievements[id].split("r")[1]
              newAchievements.push(r>138?"ngpp"+(r-130):player.achievements[id])
              if (r>138) v2_3check=true
          }
          if (v2_3check) {
              player.aarexModifications.newGamePlusVersion = 1
              player.aarexModifications.newGamePlusPlusVersion = 2.3
              player.autoEterOptions = {epmult:player.ep5xAutobuyer}
              for (dim=1;dim<9;dim++) player.autoEterOptions["td"+dim] = player.timeDimensionAutobuyer
              player.achievements=newAchievements
              updateAchievements()
              delete player.timeDimensionAutobuyer
              delete player.ep5xAutobuyer
          }
          if (player.quantum) {
              player.aarexModifications.newGamePlusPlusVersion = 2.901
              player.quantum.time = player.totalTimePlayed
              player.quantum.best = 9999999999
              player.quantum.last10 = [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]]
              player.aarexModifications.quantumConf = true
          }
          player.aarexModifications.newGamePlusVersion = 1
          if (confirm("Do you want to migrate your NG++ save into new NG+++ mode?")) {
              player.aarexModifications.newGame3PlusVersion = 2
              player.respecMastery=false
              player.dbPower = 1
              player.dilation.times = 0
              player.peakSpent = 0
              player.masterystudies = []
              player.quantum.reached = false
              player.meta.bestOverQuantums = player.meta.bestAntimatter
              player.options.animations.quarks = true
              player.quantum.usedQuarks = {
                  r: 0,
                  g: 0,
                  b: 0
              }
              player.quantum.colorPowers = {
                  r: 0,
                  g: 0,
                  b: 0
              }
              player.quantum.gluons = {
                  rg: 0,
                  gb: 0,
                  br: 0
              }
              player.eternityBuyer.dilationMode = false
              player.eternityBuyer.statBeforeDilation = 0
              player.eternityBuyer.dilationPerAmount = 10
              player.eternityBuyer.dilMode = "amount"
              player.eternityBuyer.tpUpgraded = false
              player.eternityBuyer.slowStop = false
              player.eternityBuyer.slowStopped = false
              player.eternityBuyer.ifAD = false
              player.eternityBuyer.presets = {on: false, autoDil: false, selected: -1, left: 1, order: []}
              player.quantum.autobuyer = {
                  enabled: false,
                  limit: 1,
                  mode: "amount",
                  peakTime: 0
              }
              player.quantum.electrons = {
                  amount: 0,
                  sacGals: 0,
                  mult: 2,
                  rebuyables: [0,0,0,0]
              }
              player.quantum.disabledRewards = {}
              player.quantum.metaAutobuyerWait = 0
              player.quantum.multPower = {rg:0,gb:0,br:0,total:0}
              player.quantum.challenge = []
              player.quantum.challenges = {}
              player.quantum.nonMAGoalReached = {}
              player.quantum.challengeRecords = {}
              player.quantum.pairedChallenges = {
                  order: {},
                  current: 0,
                  completed: 0,
                  completions: {},
                  fastest: {},
                  pc68best: 0,
                  respec: false
              }
              player.quantum.qcsNoDil = {}
              player.dilation.bestTP = 0
              player.old = false
              player.quantum.autoOptions = {}
              player.quantum.replicants = {
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
              player.quantum.emperorDimensions = {}
              for (d=1;d<9;d++) player.quantum.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
              player.quantum.nanofield = {
                 charge: 0,
                 energy: 0,
                 antienergy: 0,
                 power: 0,
                 powerThreshold: 50,
                 rewards: 0,
                 producingCharge: false
              }
              player.quantum.reachedInfQK = false
              player.quantum.assignAllRatios = {
                  r: 1,
                  g: 1,
                  b: 1
              }
              player.quantum.notrelative = false
              player.quantum.wasted = false
              player.quantum.tod = {
                  r: {
                      quarks: 0,
                      spin: 0,
                      gainDiv: 0,
                      upgrades: {}
                  },
                  g: {
                      quarks: 0,
                      spin: 0,
                      gainDiv: 0,
                      upgrades: {}
                  },
                  b: {
                      quarks: 0,
                      spin: 0,
                      gainDiv: 0,
                      upgrades: {}
                  },
                  upgrades: {}
              }
              player.quantum.bigRip = {
                  active: false,
                  conf: true,
                  times: 0,
                  bestThisRun: 0,
                  bestAntimatter: 0,
                  totalAntimatter: 0,
                  savedAutobuyersNoBR: {},
                  savedAutobuyersBR: {},
                  spaceShards: 0,
                  upgrades: []
              }
              player.quantum.breakEternity = {
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
                      multPower: 1,
                      upgrades: []
                  },
                  automatorGhosts: setupAutomaticGhostsData()
              }
              player.options.animations.ghostify = true
              player.aarexModifications.ghostifyConf = true
          }
          player.dilation.upgrades=migratedUpgrades
          resetDilationGalaxies()
      }
  } else if (player.dilation.rebuyables[4] == null) {
      delete player.aarexModifications.meta
      delete player.aarexModifications.autoEterMode
      delete player.aarexModifications.autoEterOptions
      delete player.quantum

  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2) {
      for (dim=1;dim<5;dim++) {
          var dim = player["timeDimension" + dim]
          if (Decimal.gte(dim.cost, "1e20000")) dim.cost = Decimal.pow(timeDimCostMults[dim]*2.2, dim.bought).times(timeDimStartCosts[dim]).times(Decimal.pow(new Decimal('1e1000'),Math.pow(dim.cost.log(10) / 1000 - 20, 2)))
      }

      player.meta = {resets: 0, antimatter: 10, bestAntimatter: 10}
      for (dim=1;dim<9;dim++) player.meta[dim] = {amount: 0, bought: 0, cost: initCost[dim]}
  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2.2) {
      for (dim=1;dim<5;dim++) {
          var dim = player["timeDimension" + dim]
          if (Decimal.gte(dim.cost, "1e100000")) dim.cost = Decimal.pow(timeDimCostMults[dim]*100, dim.bought).times(timeDimStartCosts[dim]).times(Decimal.pow(new Decimal('1e1000'),Math.pow(dim.cost.log(10) / 1000 - 100, 2)))
      }

      player.autoEterMode == "amount"
      player.aarexModifications.newGamePlusPlusVersion = 2.2
  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2.3) {
      var autoEterOptions={epmult:player.autoEterOptions?player.autoEterOptions.epMult===true:false}
      for (dim=1;dim<9;dim++) if (player.autoEterOptions===undefined?true:player.autoEterOptions["td"+dim]) autoEterOptions["td"+dim]=false
      player.autoEterOptions=autoEterOptions
      player.aarexModifications.newGamePlusPlusVersion = 2.3
  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2.301) {
      var metaAchCheck = player.dilation.studies.includes(6)
      var noD9AchCheck = player.meta[8].bought > 0 || player.meta.resets > 4
      var metaBoostCheck = player.meta.resets > 9
      if (metaBoostCheck) giveAchievement("And still no ninth dimension...")
      if (noD9AchCheck||metaBoostCheck) giveAchievement("Meta-boosting to the max")
      if (metaAchCheck||noD9AchCheck||metaBoostCheck) giveAchievement("I'm so meta")
      player.galaxyMaxBulk = false
  }
  var quantumRestore = player.aarexModifications.newGamePlusPlusVersion < 2.9 || (!player.quantum && player.aarexModifications.newGamePlusPlusVersion > 2.4)
  if (quantumRestore) {
      player.quantum = {
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
  if (quantumRestore || player.aarexModifications.newGamePlusPlusVersion < 2.901) {
      player.quantum.time = player.totalTimePlayed
      player.quantum.best = 9999999999
      player.quantum.last10 = [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]]
  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2.901) {
      player.aarexModifications.quantumConf = true
      $.notify('NG++ was updated to include quantum reset.', 'info')
  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2.9011 && player.autoEterOptions === undefined) {
      player.autoEterOptions = {epmult:false}
      for (dim=1;dim<9;dim++) player.autoEterOptions["td"+dim] = false
  }
  if (player.aarexModifications.newGamePlusPlusVersion < 2.9013) if (player.aarexModifications.quantumConf===undefined||player.quantum.times<1) player.aarexModifications.quantumConf=true
  if (player.aarexModifications.newGamePlusPlusVersion < 2.90142) player.aarexModifications.newGamePlusPlusVersion = 2.90142
  if (player.aarexModifications.newGame3PlusVersion < 1.01) player.aarexModifications.dbPower = new Decimal(getDimensionBoostPower())
  if ((player.aarexModifications.newGame3PlusVersion && !player.masterystudies) || player.aarexModifications.newGame3PlusVersion < 1.02) player.masterystudies = []
  if (player.aarexModifications.newGame3PlusVersion < 1.21) player.replicanti.chanceCost = Decimal.pow(1e15, player.replicanti.chance * 100 + 9)
  if ((quantumRestore && player.masterystudies) || player.aarexModifications.newGame3PlusVersion < 1.5) {
      player.quantum.usedQuarks = {
          r: 0,
          g: 0,
          b: 0
      }
      player.quantum.colorPowers = {
          r: 0,
          g: 0,
          b: 0
      }
  }
  if ((quantumRestore && player.masterystudies) || player.aarexModifications.newGame3PlusVersion < 1.51) {
      player.quantum.gluons = {
          rg: 0,
          gb: 0,
          br: 0
      }
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.511) if (player.autoEterMode !== undefined) player.autoEterMode = "amount"
  if ((player.quantum ? !player.quantum.electrons : false) && player.masterystudies) {
      player.quantum.electrons = {
          amount: 0,
          sacGals: 0,
          mult: 2,
          rebuyables: [0,0,0,0]
      }
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.8) {
      player.eternityBuyer.dilationMode = false
      player.eternityBuyer.statBeforeDilation = 0
      player.eternityBuyer.dilationPerAmount = 10
      player.quantum.autobuyer = {
          enabled: false,
          limit: 1,
          mode: "amount"
      }
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.9) {
      player.replicanti.intervalCost = Decimal.pow(1e10, Math.round(Math.log10(1000/player.replicanti.interval)/-Math.log10(0.9))+14)
      player.quantum.disabledRewards={}
      player.quantum.electrons.mult=2
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.901 && !player.quantum.electrons.rebuyables) player.quantum.electrons.rebuyables=[0,0,0,0]
  if (player.aarexModifications.newGame3PlusVersion < 1.95) {
      player.quantum.multPower=0
      player.quantum.challenge=0
      player.quantum.challenges=0
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.99) {
      player.quantum.challenge=player.quantum.challenge>0?[player.quantum.challenge]:[]
      var newChallenges={}
      for (c=1;c<=player.quantum.challenges;c++) newChallenges[c]=1
      player.quantum.challenges=newChallenges
      player.quantum.metaAutobuyerWait=0
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.997) {
      player.quantum.pairedChallenges = {
          order: {},
          current: 0,
          completed: 0,
          respec: false
      }
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.9975&&!player.quantum.challenge) player.quantum.challenge=[]
  if (player.aarexModifications.newGame3PlusVersion < 1.9979) {
      player.dilation.bestTP=player.achievements.includes("ng3p18")?player.dilation.tachyonParticles:new Decimal(0)
      player.old=false
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.99795) player.options.animations.quarks = true
  if (player.aarexModifications.newGame3PlusVersion < 1.99799) player.respecOptions={time:player.respec,mastery:player.respec}
  if (player.aarexModifications.newGame3PlusVersion < 1.998) {
      var respecedMS=[]
      for (id=0;id<player.masterystudies.length;id++) {
          if (player.masterystudies[id]=="t322") respecedMS.push("t323")
          else respecedMS.push(player.masterystudies[id])
      }
      player.masterystudies=respecedMS
      player.quantum.autoOptions = {}
      player.quantum.replicants = {
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
  if (player.aarexModifications.newGame3PlusVersion < 1.9985)  player.quantum.multPower = {rg:Math.ceil(player.quantum.multPower/3),gb:Math.ceil((player.quantum.multPower-1)/3),br:Math.floor(player.quantum.multPower/3),total:player.quantum.multPower}
  if (player.aarexModifications.newGame3PlusVersion < 1.9986) {
      player.respec=player.respecOptions.time
      player.respecMastery=player.respecOptions.mastery
      updateRespecButtons()
      delete player.respecOptions
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.998621) {
      if (getCurrentQCData().length<2) player.quantum.pairedChallenges.current=0
      if (player.quantum.pairedChallenges.completed>4) player.quantum.pairedChallenges.completed=0
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.9987) player.eternitiesBank=0
  if (player.aarexModifications.newGame3PlusVersion < 1.99871) {
      player.quantum.replicants.limit=Math.min(player.quantum.replicants.limit,10)
      player.quantum.replicants.limitCost=Math.pow(200,player.quantum.replicants.limit-1)*1e49
      player.quantum.replicants.workers=Decimal.min(player.quantum.replicants.workers,10)
      if (player.quantum.replicants.workers.eq(10)) player.quantum.replicants.workerProgress=0
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.998711) {
      player.quantum.quantumFood=0
      player.quantum.quantumFoodCost=1e46*Math.pow(5,Math.round(new Decimal(player.quantum.replicants.workers).toNumber()*3+new Decimal(player.quantum.replicants.workerProgress).toNumber()))
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.99873) {
      player.quantum.pairedChallenges.completions = {}
      for (c=1;c<=player.quantum.pairedChallenges.completed;c++) {
          var c1 = player.quantum.pairedChallenges.order[c][0]
          var c2 = player.quantum.pairedChallenges.order[c][1]
          player.quantum.pairedChallenges.completions[Math.min(c1, c2) * 10 + Math.max(c1, c2)] = c
      }
  }
  var forceToQuantumAndRemove=false
  if (player.masterystudies ? player.aarexModifications.newGame3PlusVersion < 1.999 || (player.quantum.emperorDimensions ? player.quantum.emperorDimensions[1] == undefined : false) : false) { //temp
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
      if (oldLength > newMS.length) forceToQuantumAndRemove=true
      player.quantum.replicants.quantumFoodCost = Decimal.times(player.quantum.replicants.quantumFoodCost, 2)
      player.quantum.replicants.limitDim=1
      player.quantum.emperorDimensions = {}
      player.quantum.emperorDimensions[1] = {workers: player.quantum.replicants.workers, progress: player.quantum.replicants.workerProgress, perm: Math.round(parseFloat(player.quantum.replicants.workers))}
      for (d=2;d<9;d++) player.quantum.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
      player.dontWant = false
      delete player.quantum.replicants.workers
      delete player.quantum.replicants.workerProgress
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.9995) {
      if (player.quantum.emperorDimensions[1].perm === undefined) {
          player.quantum.replicants.quantumFood = 0
          player.quantum.replicants.quantumFoodCost = 1e46
          for (d=1;d<9;d++) player.quantum.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
      }
      player.meta.bestOverQuantums = player.meta.bestAntimatter
      player.quantum.autobuyer.peakTime = 0
      player.quantum.nanofield = {
          charge: 0,
          energy: 0,
          antienergy: 0,
          power: 0,
          powerThreshold: 50,
          rewards: 0,
          producingCharge: false
      }
      player.quantum.reachedInfQK = false
      player.quantum.assignAllRatios = {
          r: 1,
          g: 1,
          b: 1
      }
      player.quantum.notrelative = false
      player.quantum.wasted = false
  }
  var setTTAfterQuantum=0
  if (player.aarexModifications.newGame3PlusVersion < 1.9997) {
      player.dilation.times = 0
      player.quantum.tod = {
          r: {
              quarks: 0,
              spin: 0,
              gainDiv: 0,
              upgrades: {}
          },
          g: {
              quarks: 0,
              spin: 0,
              gainDiv: 0,
              upgrades: {}
          },
          b: {
              quarks: 0,
              spin: 0,
              gainDiv: 0,
              upgrades: {}
          },
          upgrades: {}
      }
      if (player.quantum.nanofield.rewards>16) {
          var newMS=[]
          for (var m=0;m<player.masterystudies.length;m++) {
              var d=player.masterystudies[m].split("d")
              if (d[1]!==undefined) {
                  newMS.push(player.masterystudies[m])
              }
          }
          player.masterystudies=newMS
          player.quantum.nanofield.rewards=16
          forceToQuantumAndRemove=true
          setTTAfterQuantum=2e94
      }
  }
  if (player.aarexModifications.newGame3PlusVersion < 1.99971) {
      player.quantum.tod.r.gainDiv = Decimal.div(player.quantum.tod.r.gainDiv, 1e30)
      player.quantum.tod.g.gainDiv = Decimal.div(player.quantum.tod.g.gainDiv, 1e30)
      player.quantum.tod.b.gainDiv = Decimal.div(player.quantum.tod.b.gainDiv, 1e30)
  }
  if (player.aarexModifications.newGame3PlusVersion < 2) {
      player.eternityBuyer.dilMode = "amount"
      player.eternityBuyer.tpUpgraded = false
      player.eternityBuyer.slowStop = false
      player.eternityBuyer.slowStopped = false
      player.eternityBuyer.ifAD = false
      player.eternityBuyer.presets = {on: false, autoDil: false, selected: -1, left: 1, order: []}
      player.quantum.reached = player.quantum.times > 0
      player.quantum.nonMAGoalReached = {}
      player.quantum.pairedChallenges.fastest = {}
      player.quantum.qcsNoDil = {}
      player.quantum.pairedChallenges.pc68best = 0
      player.quantum.bigRip = {
          active: false,
          conf: true,
          times: 0,
          bestThisRun: 0,
          bestAntimatter: 0,
          totalAntimatter: 0,
          savedAutobuyersNoBR: {},
          savedAutobuyersBR: {},
          spaceShards: 0,
          upgrades: []
      }
      player.quantum.breakEternity = {
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
              boosts: 1,
              multPower: 1,
              upgrades: []
          },
          automatorGhosts: setupAutomaticGhostsData()
      }
      player.options.animations.ghostify = true
      player.aarexModifications.ghostifyConf = true
      player.aarexModifications.newGame3PlusVersion = 2
  }
  if (player.masterystudies) {
      //Testing-exclusive
      if (player.eternityBuyer.dilMode === undefined) {
          player.eternityBuyer.dilMode = "amount"
          player.eternityBuyer.tpUpgraded = false
          player.eternityBuyer.slowStop = false
          player.eternityBuyer.slowStopped = false
          player.eternityBuyer.presets = {on: false, autoDil: false, selected: -1, selectNext: 0, left: 1, order: []}
      }
      if (player.eternityBuyer.presets.selectNext === undefined) {
          player.eternityBuyer.presets.selected = -1
          player.eternityBuyer.presets.selectNext = 0
      }
      if (player.eternityBuyer.presets.left === undefined) player.eternityBuyer.presets.left = 1
      if (player.eternityBuyer.ifAD === undefined) player.eternityBuyer.ifAD = false
      if (player.quantum.reached === undefined) player.quantum.reached = player.quantum.times > 0
      if (player.quantum.nonMAGoalReached === undefined ? true : player.quantum.nonMAGoalReached.length === undefined) player.quantum.nonMAGoalReached = []
      if (player.quantum.bigRip.savedAutobuyersNoBR === undefined) player.quantum.bigRip.savedAutobuyersNoBR = {}
      if (player.quantum.bigRip.savedAutobuyersBR === undefined) player.quantum.bigRip.savedAutobuyersBR = {}
      if (player.quantum.bigRip.upgrades.includes(10) && !player.quantum.bigRip.upgrades.includes(9)) {
          player.quantum.bigRip.upgrades.push(9)
          if (player.quantum.bigRip.active) tweakBigRip(9, true)
      }
      if (player.quantum.breakEternity.upgradesReset === undefined && player.ghostify.times < 1) {
          var newUpgrades = []
          for (var u=0;u<player.quantum.breakEternity.upgrades.length;u++) if (player.quantum.breakEternity.upgrades[u]<4) newUpgrades.push(player.quantum.breakEternity.upgrades[u])
          player.quantum.breakEternity.upgrades = newUpgrades
          player.quantum.breakEternity.epMultPower = 0
          player.quantum.breakEternity.upgradesReset = true
      }
      if (player.quantum.pairedChallenges.fastest === undefined) player.quantum.pairedChallenges.fastest = {}
      if (player.quantum.qcsNoDil === undefined) player.quantum.qcsNoDil = {}
      if (player.ghostify.reached === undefined) player.ghostify.reached = player.ghostify.times > 0
      if (player.ghostify.timeReset === undefined) {
          player.ghostify.time = player.totalTimePlayed
          player.ghostify.timeReset = true
      }
      if (player.ghostify.neutrinos.boosts === undefined) player.ghostify.neutrinos.boosts = 1
      if (player.ghostify.automatorGhosts === undefined) player.ghostify.automatorGhosts = setupAutomaticGhostsData()
      if (player.options.animations.ghostify === undefined) player.options.animations.ghostify = true
      if (player.aarexModifications.ghostifyConf === undefined) player.aarexModifications.ghostifyConf = true

      if (player.meta.bestOverQuantums === undefined) player.meta.bestOverQuantums = player.meta.bestAntimatter
      document.getElementById('prioritydil').value=player.eternityBuyer.dilationPerAmount
      if (player.achievements.includes("ng3p52")) document.getElementById("autoDilValue").value=player.eternityBuyer.dilationPerAmount
      document.getElementById("eggonsCell").style.display = player.ghostify.neutrinos.upgrades.includes(2) ? "none" : ""
      document.getElementById("workerReplWhat").textContent = player.ghostify.neutrinos.upgrades.includes(2) ? "babies" : "eggons"
      updateQuantumWorth()
      if (player.quantum.autoOptions === undefined) player.quantum.autoOptions = {}
      if (player.quantum.challengeRecords === undefined) player.quantum.challengeRecords = {}
      if (player.quantum.pairedChallenges.completions === undefined) player.quantum.pairedChallenges.completions = {}
      if (player.quantum["10ofield"] !== undefined) {
          player.quantum.nanofield = player.quantum["10ofield"]
          delete player.quantum["10ofield"]
      }
      if (player.quantum.nanofield.powerThreshold === undefined) {
          player.quantum.nanofield.powerThreshold = 50
          player.quantum.nanofield.producingCharge = false
      }
      if (player.quantum.autobuyer.peakTime === undefined) player.quantum.autobuyer.peakTime = 0
      if (player.quantum.nanofield.rewards>17&&player.quantum.tod.upgrades[1]==undefined) {
          var newMS=[]
          for (var m=0;m<player.masterystudies.length;m++) {
              var d=player.masterystudies[m].split("d")
              if (d[1]!==undefined) {
                  newMS.push(player.masterystudies[m])
             }
          }
          player.masterystudies=newMS
          player.quantum.nanofield.rewards=16
          forceToQuantumAndRemove=true
          setTTAfterQuantum=2e94
      }
      updateAutoGhosts(true)
  }
  if (player.aarexModifications.newGame3PlusVersion==undefined) {
      colorBoosts={
          r:1,
          g:1,
          b:1
      }
      gatheredQuarksBoost = 0
      tmp.be=false
  } else {
      colorBoosts.r=Math.pow(Decimal.add(player.quantum.colorPowers.r, 1).log10(),player.dilation.active?2/3:0.5)/10+1
      colorBoosts.g=Math.sqrt(Decimal.add(player.quantum.colorPowers.g, 1).log10()*2+1)
      colorBoosts.b=Decimal.pow(10,Math.sqrt(Decimal.add(player.quantum.colorPowers.b, 1).log10()))
      if (colorBoosts.r>1.3) colorBoosts.r=Math.sqrt(colorBoosts.r*1.3)
      if (colorBoosts.r>2.3&&(!player.dilation.active||getTreeUpgradeLevel(2)>7)) colorBoosts.r=Math.sqrt(colorBoosts.r*2.3)
      if (colorBoosts.g>4.5) colorBoosts.g=Math.sqrt(colorBoosts.g*4.5)
      if (colorBoosts.b.gt(1300)) colorBoosts.b=Decimal.pow(10,Math.sqrt(colorBoosts.b.log10()*Math.log10(1300)))
      gatheredQuarksBoost = Math.pow(Decimal.add(player.quantum.replicants.quarks, 1).log10(),player.masterystudies.includes("t362")?0.35:0.25)*0.67*(player.masterystudies.includes("t412")?1.25:1)
      eds=player.quantum.emperorDimensions
      tmp.be=player.quantum.bigRip.active&&player.quantum.breakEternity.break
  }
  if (player.aarexModifications.newGameMinusMinusVersion === undefined && !player.meta) {
      if (player.version == 13) player.version = 12
      if (player.galacticSacrifice) {
          player.galacticSacrifice.time = (player.lastUpdate - player.galacticSacrifice.last) / 100
          player.aarexModifications.newGameMinusMinusVersion = 1.29
          delete player.galacticSacrifice.last
	  } else if (player.galaxyPoints) player.aarexModifications.newGameMinusMinusVersion = 1.1
      else if ((Decimal.gt(player.postC3Reward, 1) && player.infinitied < 1 && player.eternities < 1) || (Math.round(new Decimal(player.achPow).log(5) * 100) % 100 < 1 && Decimal.gt(player.achPow, 1))) player.aarexModifications.newGameMinusMinusVersion = 1
      if (player.firstTotalBought != undefined) {
          player.totalBoughtDims = {}
          for (d=1;d<9;d++) {
              var name = TIER_NAMES[d]
              player.totalBoughtDims[name] = player[name + "TotalBought"]
              delete player[name + "TotalBought"]
          }
          player.aarexModifications.newGameMinusMinusVersion = 1.295
      }
      if (player.tickBoughtThisInf) {
          var haveAutoSacrifice = player.autobuyers[12] % 1 !== 0
          player.autoSacrifice = haveAutoSacrifice ? player.autobuyers[12] : 1
          if (haveAutoSacrifice) {
              player.autoSacrifice.priority = new Decimal(player.autoSacrifice.priority)
              document.getElementById("prioritySac").value = player.autoSacrifice.priority
              document.getElementById("13ison").checked = player.autoSacrifice.isOn
          }
          var popThis = player.autobuyers.pop()
          var haveAutoGalSacrifice = popThis % 1 !== 0
          player.autobuyers[12] = haveAutoGalSacrifice ? popThis : 13
          if (haveAutoGalSacrifice) {
              player.autobuyers[12].priority = new Decimal(player.autobuyers[12].priority)
              document.getElementById("priority14").value = player.autobuyers[12].priority
              document.getElementById("14ison").checked = player.autobuyers[12].isOn
          }
          player.aarexModifications.newGameMinusMinusVersion = 1.301
          updateAutobuyers()
      }
      if (player.dimPowerIncreaseCost) {
          if (player.challengeTimes[12]) player.aarexModifications.newGameMinusMinusVersion = 1.41
          else player.aarexModifications.newGameMinusMinusVersion = 1.4
      }
      if (player.infchallengeTimes[8]) {
          player.currentChallenge=renameIC(player.currentChallenge)
          for (c=0;c<player.challenges.length;c++) player.challenges[c]=renameIC(player.challenges[c])
          player.postC4Tier=player.postC6Tier
          delete player.postC6Tier
          player.aarexModifications.newGameMinusMinusVersion = 1.5
          updateChallenges()
      }
      if (player.aarexModifications.newGameMinusMinusVersion) updateAchievements()
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.1) player.galaxyPoints = 0
  if (player.aarexModifications.newGameMinusMinusVersion < 1.2) {
      player.galacticSacrifice = {}
      player.galacticSacrifice = resetGalacticSacrifice()
      player.galacticSacrifice.galaxyPoints = player.galaxyPoints
      $.notify('Your NG-- save has been updated because dan-simon made upgrades for Galactic Sacrifice.', 'info')
      player.aarexModifications.newGameMinusMinusVersion = 1.2
      delete player.galaxyPoints
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.21) {
      if (player.galacticSacrifice.upgrades.includes(11)) for (d=1;d<8;d++) {
          var name = TIER_NAMES[d]
          player[name+"Cost"] = Decimal.div(player[name+"Cost"], 10)
	  }
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.22) {
      if (player.galacticSacrifice.upgrades.includes(11)) for (d=1;d<8;d++) {
          var name = TIER_NAMES[d]
          player[name+"Cost"] = Decimal.div(player[name+"Cost"], 10)
	  }
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.24) {
      if (ECTimesCompleted("eterc6")>0) {
          forceHardReset=true
          inflationCheck=true
          document.getElementById("reset").click()
          forceHardReset=false
          return
	  }
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.26) {
      if (player.galacticSacrifice.upgrades.includes(11)) for (d=1;d<8;d++) {
          var name = TIER_NAMES[d]
          player[name+"Cost"] = Decimal.times(player[name+"Cost"], 100)
      }
      reduceDimCosts()
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.295) player.totalBoughtDims = {}
  if (player.aarexModifications.newGameMinusMinusVersion < 1.3) {
      player.options.gSacrificeConfirmation = player.options.sacrificeConfirmation
      player.tickBoughtThisInf = resetTickBoughtThisInf()
      player.autobuyers.push(13)
      updateAutobuyers()
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.3005) {
      // fixing autobuyers
      if (player.autobuyers[10].interval) {
        player.autobuyers[10].interval = Math.max(player.autobuyers[10].interval / 2.5, 100);
      }
      if (player.autobuyers[11].interval) {
        player.autobuyers[11].interval = Math.max(player.autobuyers[11].interval / 5, 100);
      }
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.301) {
      if (player.currentChallenge=="challenge14") if (player.tickBoughtThisInf.pastResets.length<1) player.tickBoughtThisInf.pastResets.push({resets:player.resets,bought:player.tickBoughtThisInf.current-new Decimal(player.tickSpeedCost).e+3})
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.4) {
      if (player.autobuyers.length>14) {
          var haveAutoSacrifice = player.autobuyers[12] % 1 !== 0
          player.autoSacrifice = haveAutoSacrifice ? player.autobuyers[12] : 1
          if (haveAutoSacrifice) {
              player.autoSacrifice.priority = new Decimal(player.autoSacrifice.priority)
              document.getElementById("prioritySac").value = player.autoSacrifice.priority
              document.getElementById("13ison").checked = player.autoSacrifice.isOn
          }
          var popThis = player.autobuyers.pop()
          var haveAutoGalSacrifice = popThis % 1 !== 0
          player.autobuyers[12] = haveAutoGalSacrifice ? popThis : 13
          if (haveAutoGalSacrifice) {
              player.autobuyers[12].priority = new Decimal(player.autobuyers[12].priority)
              document.getElementById("priority14").value = player.autobuyers[12].priority
              document.getElementById("14ison").checked = player.autobuyers[12].isOn
          }
      } else if (player.autoSacrifice === 0) player.autoSacrifice = 1
      player.extraDimPowerIncrease = 0
      player.dimPowerIncreaseCost = 1e3
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.41) {
      if (player.version == 13) player.version = 12
      player.challengeTimes.push(600*60*24*31)
      player.challengeTimes.push(600*60*24*31)
      player.aarexModifications.newGameMinusMinusVersion = 1.41
  }
  if (player.aarexModifications.newGameMinusMinusVersion < 1.5) {
      player.infchallengeTimes.push(600*60*24*31)
      player.infchallengeTimes.push(600*60*24*31)
      player.aarexModifications.newGameMinusMinusVersion = 1.5
  }
  if (player.aarexModifications.newGame3MinusVersion < 2.1) {
      player.autobuyers[13]=14
      player.overXGalaxiesTickspeedBoost=1
      player.challengeTimes.push(600*60*24*31)
  }
  if (player.aarexModifications.newGame3MinusVersion < 2.2) {
      player.dimPowerIncreaseCost*=300
      var newChallRecords = []
      for (c=0;c<2;c++) newChallRecords.push(player.infchallengeTimes[c])
      newChallRecords.push(600*60*24*31)
      newChallRecords.push(600*60*24*31)
      for (c=2;c<10;c++) newChallRecords.push(player.infchallengeTimes[c])
      player.infchallengeTimes=newChallRecords
      player.aarexModifications.newGame3MinusVersion = 2.2
  }
  if (player.aarexModifications.ersVersion === undefined && player.timestudy.studies.length>0 && typeof(player.timestudy.studies[0])!=="number") {
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
      player.tickspeed=player.tickspeed.div(Decimal.pow(getTickSpeedMultiplier(),player.totalTickGained))
      player.totalTickGained=0
      player.tickThreshold=new Decimal(1)
      if (player.darkMatter) {
          player.eterc8repl=player.ec8PurchasesMade.repl
          player.eterc8ids=player.ec8PurchasesMade.ids
      }
      player.aarexModifications.ersVersion=1
      delete player.eternityChallenges
  }
  if (player.aarexModifications.ersVersion<1.02) {
      if (player.achievements.includes("r85")) player.infMult=player.infMult.times(4)
      if (player.achievements.includes("r93")) player.infMult=player.infMult.times(4)
      player.aarexModifications.ersVersion=1.02
  }
  if (player.aarexModifications.newGameExpVersion === undefined && !player.masterystudies && Decimal.gt(player.infMultCost,10) && Math.round(Decimal.div(player.infMultCost,10).log(4)*1e3)%1e3<1) player.aarexModifications.newGameExpVersion=1
  if (player.aarexModifications.newGameUpdateVersion === undefined && player.exdilation != undefined) {
      player.aarexModifications.newGameUpdateVersion=1
      player.options.animations.blackHole=true
      player.aarexModifications.dilationConf=player.options.dilationconfirm
      var newAchievements=[]
      for (id=0;id<player.achievements.length;id++) {
            r=player.achievements[id].split("r")[1]
            newAchievements.push(r==148?"ngpp13":r==146?"ngpp18":r>140?"ngud"+(r-130):player.achievements[id])
            if (r>138) v2_3check=true
      }
      player.achievements=newAchievements
      delete player.options.dilationconfirm
      updateAchievements()
  }
  if (player.exdilation !== undefined && player.options.exdilationconfirm === undefined) player.options.exdilationconfirm = true
  if (player.aarexModifications.irsVersion < 1.1) {
      player.singularity = {
          unlocked: false,
          sacrificed: 0,
          upgraded: 0,
          singularityPower: 0,
          darkMatter: 0
      }
  }
  if (player.aarexModifications.irsVersion < 1.2) {
      player.dimtechs = {
          unlocked: false,
          discounts: 0,
          tickUpgrades: 0,
          respec: false
      }
      for (dim=1;dim<9;dim++) player.dimtechs["dim"+dim+"Upgrades"] = 0
      player.aarexModifications.irsVersion = 1.2
  }
  ipMultPower=2
  if (player.masterystudies) if (player.masterystudies.includes("t241")) ipMultPower=2.2
  if (GUBought("gb3")) ipMultPower=2.3
  if (player.aarexModifications.newGameExpVersion !== undefined) ipMultCostIncrease=4
  else ipMultCostIncrease=10
  document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shortenDimensions(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"

  //updates TD costs to harsher scaling
  if (player.version < 12) {
      player.version = 12
      for (i=1; i<5; i++) {
        if (player["timeDimension"+i].cost.gte("1e1300")) {
            player["timeDimension"+i].cost = Decimal.pow(timeDimCostMults[i]*2.2, player["timeDimension"+i].bought).times(timeDimStartCosts[i])
          }
      }
      if (player.bestEternity <= 0.01 || player.bestInfinityTime <= 0.01) giveAchievement("Less than or equal to 0.001");
  }

  if (player.version < 12.1) {
    player.version = 12.1
    if (player.achievements.includes("s36")) {
        player.achievements.splice(player.achievements.indexOf("s36"), 1)
        updateAchievements();
    }
  }
  if (player.version < 12.2) {
    player.version = 12.2
    player.sixthCost = Decimal.times(player.sixthCost, 10)
    if (player.meta) player.meta[6].cost = Decimal.times(player.meta[6].cost, 10)
  }

  // player.version is currently 12.1
  if (player.options.commas == "Default") {
      player.options.commas == "AF2019";
      updateNotationOption();
  }
  if (player.options.notation == "Default") {
      player.options.notation = typeof(player.options.commas) === "boolean" ? "AF2019" : "Brackets";
      updateNotationOption();
  }

  for (s=0;s<(player.boughtDims?4:3);s++) toggleCrunchMode(true)
  updateAutoEterMode()

  ghostified = false
  if (player.masterystudies !== undefined) ghostified = player.ghostify.times > 0
  quantumed = ghostified
  if (player.meta !== undefined && !quantumed) quantumed = player.quantum.times > 0
  document.getElementById("confirmations").style.display = (player.resets > 4 || player.galaxies > 0 || (player.galacticSacrifice ? player.galacticSacrifice.times > 0 : false) || player.infinitied !== 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
  document.getElementById("confirmation").style.display = (player.resets > 4 || player.infinitied > 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
  document.getElementById("sacrifice").style.display = (player.resets > 4 || player.infinitied > 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
  document.getElementById("sacConfirmBtn").style.display = (player.resets > 4 || player.galaxies > 0 || (player.galacticSacrifice ? player.galacticSacrifice.times > 0 : false) || player.infinitied > 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
  var gSacDisplay = !player.galacticSacrifice ? "none" : player.galaxies > 0 || player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities !== 0 || quantumed ? "inline-block" : "none"
  document.getElementById("gConfirmation").style.display = gSacDisplay
  document.getElementById("gSacrifice").style.display = gSacDisplay
  document.getElementById("gSacConfirmBtn").style.display = gSacDisplay
  document.getElementById("challengeconfirmation").style.display = (player.infinitied !== 0 || player.eternities !== 0 || quantumed) ? "inline-block" : "none"
  document.getElementById("eternityconf").style.display = (player.eternities !== 0 || quantumed) ? "inline-block" : "none"
  document.getElementById("dilationConfirmBtn").style.display = (player.dilation.studies.includes(1) || quantumed) ? "inline-block" : "none"
  document.getElementById("quantumConfirmBtn").style.display = quantumed ? "inline-block" : "none"
  document.getElementById("bigRipConfirmBtn").style.display = (player.masterystudies === undefined ? false : player.quantum.bigRip.times) ? "inline-block" : "none"
  document.getElementById("ghostifyConfirmBtn").style.display = ghostified ? "inline-block" : "none"

  document.getElementById("confirmation").checked = !player.options.sacrificeConfirmation
  document.getElementById("sacConfirmBtn").textContent = "Sacrifice confirmation: O" + (player.options.sacrificeConfirmation ? "N" : "FF")
  document.getElementById("gConfirmation").checked = !player.options.gSacrificeConfirmation
  document.getElementById("gSacConfirmBtn").textContent = "Galactic sacrifice confirmation: O" + (player.options.gSacrificeConfirmation ? "N" : "FF")
  document.getElementById("challengeconfirmation").textContent = "Challenge confirmation: O" + (player.options.challConf ? "N" : "FF")
  document.getElementById("eternityconf").textContent = "Eternity confirmation: O" + (player.options.eternityconfirm ? "N" : "FF")
  document.getElementById("dilationConfirmBtn").textContent = "Dilation confirmation: O" + (player.aarexModifications.dilationConf ? "N" : "FF")
  document.getElementById("exdilationConfirmBtn").textContent = "Reverse dilation confirmation: O" + (player.options.exdilationConfirm ? "N" : "FF")
  document.getElementById("quantumConfirmBtn").textContent = "Quantum confirmation: O" + (player.aarexModifications.quantumConf ? "N" : "FF")
  document.getElementById("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + ((player.masterystudies === undefined ? false : player.quantum.bigRip.conf) ? "N" : "FF")
  document.getElementById("ghostifyConfirmBtn").textContent = "Ghostify confirmation: O" + (player.aarexModifications.ghostifyConf ? "N" : "FF")

  document.getElementById("progressBarBtn").textContent = (player.aarexModifications.progressBar?"Hide":"Show")+" progress bar"
  document.getElementById("toggleLogRateChange").textContent = "Logarithm rate: O"+(player.aarexModifications.logRateChange?"N":"FF")
  document.getElementById("tabsSave").textContent = "Saved tabs: O"+(player.aarexModifications.tabsSave.on?"N":"FF")
  dimDescEnd = (player.aarexModifications.logRateChange?" OoM":"%")+"/s)"

  document.getElementById("quantumtabbtn").style.display = quantumed ? "" : "none"
  document.getElementById("ghostifytabbtn").style.display = ghostified ? "" : "none"

  document.getElementById("chartDurationInput").value = player.options.chart.duration;
  document.getElementById("chartUpdateRateInput").value = player.options.chart.updateRate;
  if (player.options.chart.on) document.getElementById("chartOnOff").checked = true
  else document.getElementById("chartOnOff").checked = false
  if (player.options.chart.dips) document.getElementById("chartDipsOnOff").checked = true
  else document.getElementById("chartDipsOnOff").checked = false
 
  if (player.options.theme == "Dark" || player.options.theme == "Dark Metro") {
    Chart.defaults.global.defaultFontColor = '#888';
    normalDimChart.data.datasets[0].borderColor = '#888'
  } else {
    Chart.defaults.global.defaultFontColor = 'black';
    normalDimChart.data.datasets[0].borderColor = '#000'
  }

  document.getElementById("infmultbuyer").style.display = getEternitied()>0||player.masterystudies?"inline-block":"none"
  if (getEternitied() < 30) {
    document.getElementById("secondRow").style.display = "none";
    document.getElementById("thirdRow").style.display = "none";
    document.getElementById("tickSpeed").style.visibility = "hidden";
    document.getElementById("tickSpeedMax").style.visibility = "hidden";
    document.getElementById("tickLabel").style.visibility = "hidden";
    document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    document.getElementById("fourthRow").style.display = "none";
    document.getElementById("fifthRow").style.display = "none";
    document.getElementById("sixthRow").style.display = "none";
    document.getElementById("seventhRow").style.display = "none";
    document.getElementById("eightRow").style.display = "none";
}

  if (!player.options.hotkeys) document.getElementById("hotkeys").textContent = "Enable hotkeys"

  document.getElementsByClassName("hideInMorse").display = player.options.notation == "Morse code" ? "none" : ""

  document.getElementById("decimalMode").textContent = "Decimal mode: "+(break_infinity_js?"Slow but accurate":"Fast but inaccurate")
  document.getElementById("decimalMode").style.display = Decimal.gt(player.totalmoney,"1e9000000000000000") ? "none" : ""
  document.getElementById("hideProductionTab").textContent = (player.aarexModifications.hideProductionTab?"Show":"Hide")+" production tab"
  document.getElementById("hideRepresentation").textContent=(player.aarexModifications.hideRepresentation?"Show":"Hide")+" antimatter representation"
  document.getElementById("showAchRowNums").textContent=(player.aarexModifications.showAchRowNums?"Hide":"Show")+" achievement row numbers"
  document.getElementById("hideCompletedAchs").textContent=(player.aarexModifications.hideCompletedAchs?"Show":"Hide")+" completed achievement rows"
  document.getElementById("hideSecretAchs").textContent=(player.aarexModifications.hideSecretAchs?"Show":"Hide")+" secret achievements"

  document.getElementById("hotkeysDesc").innerHTML = "Hotkeys: 1-8 for buy 10 dimension, shift+1-8 for buy 1 dimension, T to buy max tickspeed, shift+T to buy one tickspeed, M for max all<br>S for sacrifice, D for dimension boost,"+(player.tickspeedBoosts==undefined?"":" B for tickspeed boost,")+" G for galaxy, C for crunch, A for toggle autobuyers, R for replicanti galaxies, E for eternity"+(player.meta?", Q for quantum":"")+(player.boughtDims?".":".<br>You can hold shift while buying time studies to buy all up until that point, see each study's number, and save study trees.<br>Hotkeys do not work while holding control.")

  document.getElementById("secretstudy").style.opacity = 0
  document.getElementById("secretstudy").style.cursor = "pointer"
  
  document.getElementById("bestAntimatterType").textContent = player.masterystudies && quantumed ? "Your best meta-antimatter for this quantum" : "Your best-ever meta-antimatter"

  document.getElementById("masterystudyunlock").style.display = player.dilation.upgrades.includes("ngpp6") && player.masterystudies ? "" : "none"
  document.getElementById("respecMastery").style.display = player.dilation.upgrades.includes("ngpp6") && player.masterystudies ? "block" : "none"
  document.getElementById("respecMastery2").style.display = player.dilation.upgrades.includes("ngpp6") && player.masterystudies ? "block" : "none"

  if (player.galacticSacrifice) {
      document.getElementById("galaxy11").innerHTML = "Normal dimensions are "+(player.infinitied>0||getEternitied()!==0||quantumed?"cheaper based on your infinitied stat.<br>Currently: <span id='galspan11'>"+shortenDimensions(galUpgrade11())+"</span>x":"99% cheaper.")+"<br>Cost: 1 GP"
  } else {
      document.getElementById("infi21").innerHTML = "Increase the multiplier for buying 10 Dimensions<br>"+(player.aarexModifications.newGameExpVersion?"20x -> 24x":"2x -> 2.2x")+"<br>Cost: 1 IP"
      document.getElementById("infi33").innerHTML = "Increase Dimension Boost multiplier<br>2x -> 2.5x<br>Cost: 7 IP"
  }
  var resetSkipCosts=[20,40,80]
  for (u=1;u<4;u++) document.getElementById("infi4"+u).innerHTML="You start with the "+(u+4)+"th dimension unlocked"+(player.tickspeedBoosts==undefined?"":" and "+(u*4)+" tickspeed boosts")+"<br>Cost: "+resetSkipCosts[u-1]+" IP"
  document.getElementById("infi44").innerHTML="You start with the 8th dimension unlocked"+(player.tickspeedBoosts==undefined?"":", 16 tickspeed boosts")+", and a Galaxy<br>Cost: 500 IP"
  var showMoreBreak = player.galacticSacrifice ? "" : "none"
  for (i=1;i<5;i++) document.getElementById("postinfi0"+i).parentElement.style.display=showMoreBreak
  document.getElementById("d5AutoChallengeDesc").textContent=player.galacticSacrifice?"Tickspeed upgrades start out useless, but galaxies make them stronger.":"Tickspeed starts at 7%."
  document.getElementById("d8AutoChallengeDesc").textContent=(player.tickspeedBoosts==undefined?"":"Product of bought, ")+"Dimension Boosts"+(player.tickspeedBoosts==undefined?"":",")+" and galaxies are useless, sacrifice resets everything but is immensely more powerful"
  document.getElementById("autoDBChallengeDesc").textContent="There are only 6 dimensions, with dimension boost"+(player.tickspeedBoosts==undefined?"":", tickspeed boost,")+" and antimatter galaxy costs modified."
  document.getElementById("autoCrunchChallengeDesc").textContent="Each dimension produces the dimension 2 below it; first dimensions produce reduced antimatter. "+(player.galacticSacrifice?"Galaxies are far more powerful.":"")
  document.getElementById("autoDSChallengeDesc").textContent=player.tickspeedBoosts==undefined?"Per-ten multiplier is always 1x, but product of dimensions bought multiplies all dimensions.":"There is the product of amount instead of the product of bought."
  document.getElementById("infPowEffectPowerDiv").innerHTML=player.galacticSacrifice?"Raised to the power of <span id='infPowEffectPower' style='font-size:35px; color: black'></span>, t":"T"
  document.getElementById("ngmmchalls").style.display=player.galacticSacrifice?"":"none"
  document.getElementById("ngmmmchalls").style.display=player.tickspeedBoosts==undefined?"none":""
  document.getElementById("irschalls").style.display=player.infinityUpgradesRespecced==undefined?"none":""
  if (player.galacticSacrifice) {
      order=['postcngmm_1','postcngmm_2','postcngmm_3','postc1','postc2','postc4','postc5','postc6','postc7','postc8']
      document.getElementById("icngmm_row").style.display=""
      document.getElementById("icngmm_3div").style.display=""
      document.getElementById("ic2div").style.display="none"
      document.getElementById("icngmm_4div").style.display=""
      document.getElementById("ic3div").style.display="none"
      document.getElementById("icngmm_4div").appendChild(document.getElementById("postc2").parentElement.parentElement)
  } else {
      order=['postc1','postc2','postc3','postc4','postc5','postc6','postc7','postc8']
      document.getElementById("icngmm_row").style.display="none"
      document.getElementById("icngmm_3div").style.display="none"
      document.getElementById("ic2div").style.display=""
      document.getElementById("icngmm_4div").style.display="none"
      document.getElementById("ic3div").style.display=""
      document.getElementById("ic2div").appendChild(document.getElementById("postc2").parentElement.parentElement)
  }
  if (player.tickspeedBoosts == undefined) {
      document.getElementById("icngm3_row").style.display="none"
	  galUpgradeCosts[32]=8
	  galUpgradeCosts[13]=20
	  galUpgradeCosts[23]=100
	  galUpgradeCosts[33]=1e3
  } else {
      document.getElementById("icngm3_row").style.display=""
      order=['postcngmm_1','postcngmm_2','postcngm3_1','postcngm3_2','postcngmm_3','postc1','postc2','postc4','postc5','postc6','postc7','postc8']
	  galUpgradeCosts[32]=30
	  galUpgradeCosts[13]=100
	  galUpgradeCosts[23]=200
	  galUpgradeCosts[33]=5e10
  }
  document.getElementById("galcost32").textContent=galUpgradeCosts[32]
  document.getElementById("galcost13").textContent=galUpgradeCosts[13]
  document.getElementById("galcost23").textContent=galUpgradeCosts[23]
  var showMoreGal = player.tickspeedBoosts!=undefined ? "" : "none"
  for (i=1;i<4;i++) document.getElementById("galaxy"+i+"4div").style.display=showMoreGal
  document.getElementById("preinfupgrades").style.display=player.infinityUpgradesRespecced?"none":""
  document.getElementById("infi1div").style.display=player.infinityUpgradesRespecced==undefined?"none":""
  document.getElementById("infi3div").style.display=player.infinityUpgradesRespecced==undefined?"none":""
  updateChallenges()
  document.getElementById("postinfbtn").style.display=player.infinityUpgradesRespecced?"none":""
  updateSingularity()
  updateDimTechs()
  if (player.infinityUpgradesRespecced != undefined) order = []
  document.getElementById("icngmm_3reward").textContent="Reward: " + (player.tickspeedBoosts == undefined ? "???" : "Every tickspeed purchase decreases tickspeed based on galaxies")
  document.getElementById("ic1desc").textContent="All previous challenges (except tickspeed challenge"+(player.galacticSacrifice?',':" and")+" automatic big crunch challenge"+(player.galacticSacrifice?", and automatic galactic sacrifice challenge":"")+") at once."
  document.getElementById("ic7desc").textContent="You can't get Antimatter Galaxies, but dimensional boost multiplier "+(player.galacticSacrifice?"is cubed":"2.5x -> 10x")
  document.getElementById("ic7reward").textContent="Reward: Dimensional boost multiplier "+(player.galacticSacrifice?"is squared":"2.5x -> 4x")
  document.getElementById("replicantitabbtn").style.display=player.infinityUpgradesRespecced?"none":""
  document.getElementById("41").innerHTML="Each galaxy gives a 1."+(player.aarexModifications.newGameExpVersion?5:2)+"x multiplier on IP gained. <span>Cost: 4 Time Theorems"
  document.getElementById("42").innerHTML="Galaxy requirement goes up "+(player.aarexModifications.newGameExpVersion?48:52)+" 8ths instead of 60.<span>Cost: 6 Time Theorems"
  document.getElementById("61").innerHTML="You gain 10"+(player.aarexModifications.newGameExpVersion?0:"")+"x more EP<span>Cost: 3 Time Theorems"
  document.getElementById("62").innerHTML="You gain replicanti "+(player.aarexModifications.newGameExpVersion?4:3)+" times faster<span>Cost: 3 Time Theorems"
  document.getElementById("81").innerHTML="Dimensional boost power "+(player.galacticSacrifice?"is cubed":"becomes 10x")+"<span>Cost: 4 Time Theorems"
  document.getElementById("221").style["font-size"] = player.masterystudies !== undefined ? "0.45rem" : "0.55rem"
  document.getElementById("221desc").textContent = ""
  document.getElementById("227desc").textContent = ""
  document.getElementById("231").style["font-size"] = player.masterystudies !== undefined ? "0.55rem" : "0.65rem"
  document.getElementById("231desc").textContent = ""
  document.getElementById("232desc").textContent = ""

  updateAutobuyers();
  setAchieveTooltip();
  updatePriorities();
  updateTheoremButtons();
  updateTimeStudyButtons();
  document.getElementById('replicantigalaxypowerdiv').style.display=player.achievements.includes("r106")&&player.boughtDims?"":"none"
  document.getElementById('epmultauto').style.display=player.achievements.includes("ngpp17")?"":"none"
  document.getElementById("dilationeterupgrow").style.display="none"
  document.getElementById("blackHoleAnimBtn").style.display="none"
  if (player.exdilation != undefined) {
      if (player.dilation.studies.includes(1)) document.getElementById("dilationeterupgrow").style.display="table-row"
      document.getElementById("blackHoleAnimBtn").textContent = "Black hole: " + ((player.options.animations.blackHole) ? "ON" : "OFF")
      if (player.blackhole.unl == true) {
          document.getElementById("blackholediv").style.display="inline-block"
          document.getElementById("blackholeunlock").style.display="none"
          document.getElementById("blackHoleAnimBtn").style.display="inline-block"
      } else {
          document.getElementById("blackholediv").style.display="none"
          document.getElementById("blackholeunlock").style.display="inline-block"
      }
  }
  var suffix="NG"+(player.meta!=undefined?"pp":"ud")
  document.getElementById("uhDiv"+suffix).appendChild(document.getElementById("Universal harmony"))
  document.getElementById("feDiv"+suffix).appendChild(document.getElementById("In the grim darkness of the far endgame"))
  document.getElementById("dil15").style["font-size"]=player.masterystudies==undefined?"10px":"9px"
  document.getElementById("dil15formula").style.display=player.masterystudies==undefined?"none":""
  document.getElementById("metaAntimatterEffectType").textContent=inQC(3)?"multiplier on all Infinity Dimensions":"extra multiplier per dimension boost"
  for (i=1;i<9;i++) document.getElementById("td"+i+'auto').style.visibility=player.achievements.includes("ngpp17")?"visible":"hidden"
  document.getElementById('togglealltimedims').style.visibility=player.achievements.includes("ngpp17")?"visible":"hidden"
  document.getElementById('replicantibulkmodetoggle').style.display=player.achievements.includes("ngpp16")?"inline-block":"none"
  document.getElementById('replicantibulkmodetoggle').textContent="Mode: "+(player.galaxyMaxBulk?"Max":"Singles")
  if (player.meta) {
      document.getElementById('epmultauto').textContent="Auto: O"+(player.autoEterOptions.epmult?"N":"FF")
      for (i=1;i<9;i++) document.getElementById("td"+i+'auto').textContent="Auto: O"+(player.autoEterOptions["td"+i]?"N":"FF")
  }
  document.getElementById('sacrificeAuto').style.display=speedrunMilestonesReached>24?"":"none"
  document.getElementById('toggleautoquantummode').style.display=(player.masterystudies?player.quantum.reachedInfQK||player.achievements.includes("ng3p25"):false)?"":"none"
  document.getElementById('assignAll').style.display=(player.masterystudies?player.quantum.reachedInfQK||ghostified:false)?"":"none"
  document.getElementById('autoReset').style.display=player.achievements.includes("ng3p47")?"":"none"
  document.getElementById('aftereternity').style.display=player.achievements.includes("ng3p52")?"":"none"
  if (player.masterystudies) {
      updateMasteryStudyCosts()
      updateMasteryStudyButtons()
      if (quantumed) giveAchievement("Sub-atomic")
      if (player.quantum.best<=1) giveAchievement("Quantum doesn't take so long")
      if (ghostified) giveAchievement("Kee-hee-hee!")
      document.getElementById('reward3disable').textContent="6 hours reward: O"+(player.quantum.disabledRewards[3]?"FF":"N")
      document.getElementById('reward4disable').textContent="4.5 hours reward: O"+(player.quantum.disabledRewards[4]?"FF":"N")
      document.getElementById('reward11disable').textContent="33.3 mins reward: O"+(player.quantum.disabledRewards[11]?"FF":"N")
      document.getElementById('reward27disable').textContent="10 seconds reward: O"+(player.quantum.disabledRewards[27]?"FF":"N")
      document.getElementById('coloredQuarksProduction').innerHTML=player.ghostify.milestones>1?"You are getting <span id='rPowerRate' style='font-size:35px' class='red'></span> red power, <span id='gPowerRate' style='font-size:35px' class='green'></span> green power, and <span id='bPowerRate' style='font-size:35px' class='blue'></span> blue power per second.":"They have a <span id='colorChargeAmount' style='font-size:35px'></span><span id='colorCharge'></span> charge, which produces <span id='powerRate' style='font-size:35px'></span> <span id='colorPower'></span> per second."
      document.getElementById('rebuyupgauto').textContent="Rebuyable upgrade auto: O"+(player.autoEterOptions.rebuyupg?"N":"FF")
      document.getElementById('metaboostauto').textContent="Meta-boost auto: O"+(player.autoEterOptions.metaboost?"N":"FF")
      document.getElementById('priorityquantum').value=formatValue("Scientific", new Decimal(player.quantum.autobuyer.limit), 2, 0)
      document.getElementById("respecPC").className=player.quantum.pairedChallenges.respec?"quantumbtn":"storebtn"
      document.getElementById('sacrificeAuto').textContent="Auto: O"+(player.quantum.autoOptions.sacrifice?"N":"FF")
      document.getElementById("produceQuarkCharge").innerHTML="S" + (player.quantum.nanofield.producingCharge ? "top" : "tart") + " production of preon charge." + (player.quantum.nanofield.producingCharge ? "" : "<br>(You will not get preons when you do this.)")
      document.getElementById("ratio_r").value = player.quantum.assignAllRatios.r
      document.getElementById("ratio_g").value = player.quantum.assignAllRatios.g
      document.getElementById("ratio_b").value = player.quantum.assignAllRatios.b
      document.getElementById('autoAssign').textContent="Auto: O"+(player.quantum.autoOptions.assignQK?"N":"FF")
      document.getElementById('autoAssignRotate').textContent="Rotation: "+(player.quantum.autoOptions.assignQKRotate>1?"Left":player.quantum.autoOptions.assignQKRotate?"Right":"None")
      document.getElementById('autoReset').textContent="Auto: O"+(player.quantum.autoOptions.replicantiReset?"N":"FF")
      updateAutoQuantumMode()
  }
  transformSaveToDecimal();
  updateChallengeTimes();
  updateMilestones();
  updateEternityUpgrades();
  loadInfAutoBuyers();
  resizeCanvas();
  checkForEndMe();
  updateRespecButtons()
  updateEternityChallenges();
  updateEterChallengeTimes()
  updateExtraReplGalaxies()
  updateDilationUpgradeCosts()
  updateExdilation()
  updateLastTenQuantums()
  updateLastTenGhostifies()
  updateBraveMilestones()
  updateColorCharge()
  updateGluons()
  updateSpeedruns()
  var removeMaxTD=false
  var removeMaxMD=false
  if (player.achievements.includes("ngpp17")) {
      for (d=1;d<9;d++) {
          if (player.autoEterOptions["td"+d]) {
              if (d>7) removeMaxTD=true
          } else break
      }
  }
  if (speedrunMilestonesReached > 27) {
      for (d=1;d<9;d++) {
          if (player.autoEterOptions["md"+d]) {
              if (d>7) removeMaxMD=true
          } else break
      }
  }
  document.getElementById("maxTimeDimensions").style.display=removeMaxTD?"none":""
  document.getElementById("metaMaxAllDiv").style.display=removeMaxMD?"none":""
  updateElectrons()
  updateBankedEter()
  updateQuantumChallenges()
  updateQCTimes()
  updatePCCompletions()
  if (player.masterystudies !== undefined) {
      document.getElementById("bpc68").textContent = shortenMoney(player.quantum.pairedChallenges.pc68best)
      updateNeutrinoBoosts()
  }
  maybeShowFillAll()
  updateReplicants()
  updateTODStuff()
  updateBreakEternity()
  onNotationChangeNeutrinos()
  if (player.boughtDims) {
      if (document.getElementById("timestudies").style.display=="block") showEternityTab("ers_timestudies",true)
      updateGalaxyControl()
  } else if (document.getElementById("ers_timestudies").style.display=="block") showEternityTab("timestudies",true)
  poData=metaSave["presetsOrder"+(player.boughtDims?"_ers":"")]
  document.getElementById("quantumstudies").style.display=quantumed&&player.masterystudies?"":"none"
  document.getElementById("replicantsstudies").style.display=!player.masterystudies?"none":player.masterystudies.includes("d10")||ghostified?"":"none"
  document.getElementById("timestudy322").style.display=!player.masterystudies?"none":player.masterystudies.includes("d10")||ghostified?"":"none"
  document.getElementById("empstudies").style.display=!player.masterystudies?"none":player.masterystudies.includes("d11")||ghostified?"":"none"
  document.getElementById("timestudy361").style.display=!player.masterystudies?"none":player.masterystudies.includes("d11")||ghostified?"":"none"
  document.getElementById("timestudy362").style.display=!player.masterystudies?"none":player.masterystudies.includes("d11")||ghostified?"":"none"
  document.getElementById("nfstudies").style.display=!player.masterystudies?"none":player.masterystudies.includes("d12")||ghostified?"":"none"
  document.getElementById("quarksAnimBtn").style.display=quantumed&&player.masterystudies?"inline-block":"none"
  document.getElementById("quarksAnimBtn").textContent="Quarks: O"+(player.options.animations.quarks?"N":"FF")
  document.getElementById('dilationmode').style.display=speedrunMilestonesReached>4?"":"none"
  document.getElementById('rebuyupgmax').style.display=speedrunMilestonesReached<26&&player.masterystudies?"":"none"
  document.getElementById('rebuyupgauto').style.display=speedrunMilestonesReached>6?"":"none"
  document.getElementById('toggleallmetadims').style.display=speedrunMilestonesReached>7?"":"none"
  document.getElementById('metaboostauto').style.display=speedrunMilestonesReached>14?"":"none"
  document.getElementById("autoBuyerQuantum").style.display=speedrunMilestonesReached>22?"":"none"
  document.getElementById("edtabbtn").style.display=!player.masterystudies?"none":player.masterystudies.includes("d11")?"":"none"
  document.getElementById("nanofieldtabbtn").style.display=!player.masterystudies?"none":player.masterystudies.includes("d12")?"":"none"
  document.getElementById("ghostifyAnimBtn").style.display=ghostified?"inline-block":"none"
  document.getElementById("ghostifyAnimBtn").textContent="Ghostify: O"+(player.options.animations.ghostify?"N":"FF")
  setAndMaybeShow('bestTP',player.achievements.includes("ng3p18") || player.achievements.includes("ng3p37"),'"Your best"+(ghostified ? "" : " ever")+" Tachyon particles"+(ghostified ? " in this Ghostify" : "")+" was "+shorten(player.dilation.bestTP)+"."')
  setAndMaybeShow('bestTPOverGhostifies',(player.achievements.includes("ng3p18") || player.achievements.includes("ng3p37")) && ghostified,'"Your best-ever Tachyon particles was "+shorten(player.dilation.bestTPOverGhostifies)+"."')
  notifyId=speedrunMilestonesReached
  notifyId2=player.masterystudies===undefined?0:player.ghostify.milestones
  resetUP()
  document.getElementById("newsbtn").textContent=(player.options.newsHidden?"Show":"Hide")+" news ticker"
  document.getElementById("game").style.display=player.options.newsHidden?"none":"block"
  var tabsSave = player.aarexModifications.tabsSave
  showDimTab(tabsSave.on && tabsSave.tabDims !== undefined ? tabsSave.tabDims : 'antimatterdimensions')
  showStatsTab(tabsSave.on && tabsSave.tabStats !== undefined ? tabsSave.tabStats : 'stats')
  showAchTab(tabsSave.on && tabsSave.tabAchs !== undefined ? tabsSave.tabAchs : 'normalachievements')
  showChallengesTab(tabsSave.on && tabsSave.tabChalls !== undefined ? tabsSave.tabChalls : 'normalchallenges')
  showInfTab(tabsSave.on && tabsSave.tabInfinity !== undefined ? tabsSave.tabInfinity : 'preinf')
  showEternityTab(tabsSave.on && tabsSave.tabEternity !== undefined ? tabsSave.tabEternity : 'timestudies', true)
  showQuantumTab(tabsSave.on && tabsSave.tabQuantum !== undefined ? tabsSave.tabQuantum : 'uquarks')
  showBranchTab(tabsSave.on && tabsSave.tabBranch !== undefined ? tabsSave.tabBranch : 'red')
  showGhostifyTab(tabsSave.on && tabsSave.tabGhostify !== undefined ? tabsSave.tabGhostify : 'neutrinos')
  if (!player.options.newsHidden) scrollNextMessage()
  document.getElementById("secretoptionsbtn").style.display=player.options.secrets?"":"none"
  document.getElementById("ghostlynewsbtn").textContent=((player.options.secrets!==undefined?player.options.secrets.ghostlyNews:false)?"Hide":"Show")+" ghostly news ticker"
  var detectNGPStart = player.lastUpdate == 1531944153054
  if (player.aarexModifications.switch) {
      player.money=new Decimal("1e9e15")
      player.totalmoney=new Decimal("1e9e15")
      softReset(0)
      delete player.aarexModifications.switch
  } else if (player.aarexModifications.offlineProgress && !noOffline) {
      let diff = new Date().getTime() - player.lastUpdate
      if (diff > 1000*1000) {
          simulateTime(diff/1000)
      }
  } else player.lastUpdate = new Date().getTime()
  document.getElementById("ghostlyNewsTicker").style.height=((player.options.secrets!==undefined?player.options.secrets.ghostlyNews:false)?24:0)+"px"
  document.getElementById("ghostlyNewsTickerBlock").style.height=((player.options.secrets!==undefined?player.options.secrets.ghostlyNews:false)?16:0)+"px"
  if (detectNGPStart || player.totalTimePlayed < 1 || inflationCheck || forceToQuantumAndRemove) {
      ngModeMessages=[]
      if (player.aarexModifications.newGameExpVersion) ngModeMessages.push("Welcome to NG^ mode, made by Naruyoko! This mode adds way many buffs that this mode may be broken!")
      if (player.meta!==undefined||player.exdilation!==undefined) {
          if (!player.aarexModifications.newGamePlusVersion) ngModeMessages.push("WARNING! You are disabling NG+ features on NG++! Standard NG++ have all of NG++ features and I recommend you to create a new save with NG+ and NG++ modes on.")
          if (player.meta!==undefined&&player.exdilation!==undefined) ngModeMessages.push("Welcome to NG Update+ mode, a combination made by Soul147 (Sigma)! This is a combination of dan-simon's NG Update and Aarex's NG+++. I think in this mode, you can break the game...")
          else if (player.exdilation!==undefined) ngModeMessages.push("Welcome to NG Update mode, an another dan-simon's end-game mod! In this mode, there are black hole and ex-dilation.")
          else if (player.masterystudies) ngModeMessages.push("Welcome to NG+++ mode, the extension of dan-simon's NG++ mode! In this mode, more time & dilation studies, more eternity milestones, and dilated challenges were added.")
          else ngModeMessages.push("Welcome to NG++ mode, made by dan-simon! In this mode, more dilation upgrades and meta-dimensions are added to push the end-game further.")
      } else if (player.aarexModifications.newGamePlusVersion) ngModeMessages.push("Welcome to NG+ mode, made by earthernsence! Right now, you start with all Eternity Challenges completed and 1 infinitied.")
      if (player.infinityUpgradesRespecced) ngModeMessages.push('Welcome to Infinity Respecced, created by Aarex! In this mode, all of infinity upgrades are replaced with new upgrades except 2x IP mult. Oh, break infinity is removed.')
      if (player.boughtDims) ngModeMessages.push('Welcome to Eternity Respecced created by dan-simon! You can check out why he made this at <a href="https://dan-simon.github.io/b/eternity-respecced/about/about_game.html" target="_newtab">the link</a>. NOTE: This is broken right now. I will fix it in later time, like after months.')
      if (player.galacticSacrifice) {
          if (player.aarexModifications.newGame3MinusVersion) ngModeMessages.push('Welcome to NG--- mode, the nerfed version of NG-- mode! This mode reduces tickspeed multiplier multiplier and nerfs galaxies, but have a new feature called \"Tickspeed Boosts\" and 1 achievement buff.')
          else ngModeMessages.push('Welcome to NG-- mode created by Nyan cat! Dilation is always locked but have more balancing, IC3 trap, and a new feature called "Galactic Sacrifice".')
      }
      if (player.aarexModifications.newGameMinusVersion) ngModeMessages.push("Welcome to NG- mode! Everything are nerfed by the creator slabdrill, making the end-game harder to reach.")
      if (player.aarexModifications.newGameMinusVersion&&player.galacticSacrifice&&player.meta&&player.masterystudies){
          ngModeMessages = []
          if (!player.aarexModifications.newGamePlusVersion) ngModeMessages.push("WARNING! You are disabling NG+ features on NG+-+-+! Standard NG+-+-+ have all of NG++ features and I recommend you to create a new save with NG-, NG--, NG+ and NG+++ modes on.")
          if (player.tickspeedBoosts !== undefined) ngModeMessages.push("Welcome to NG+-+-+- mode! This combines NG--, NG-, and NG+3 features. Good luck!")
          else ngModeMessages.push("Welcome to NG+-+-+ mode, created by earthernsence! This mode combines NG--, NG-, and NG+++ features. Good luck!")
      }
      if (inflationCheck) ngModeMessages = ["I'm terribly sorry. But your save was appeared that there is an inflation, which it defeats the rule of incremental games. Your save was forced to reset everything."]
      if (forceToQuantumAndRemove) {
          quantum(false, true, 0)
          ngModeMessages = ["Due to balancing changes, you are forced to quantum, lose your TT, and lose your best TP, but you now have "+shorten(setTTAfterQuantum)+" TT for free."]
          player.timestudy.theorem = setTTAfterQuantum
          player.dilation.bestTP = new Decimal(0)
          document.getElementById('bestTP').textContent = "Your best ever Tachyon particles was 0."
      }
      inflationCheck = false
      closeToolTip()
      showNextModeMessage()
  } else if (player.aarexModifications.popUpId!="STD") showNextModeMessage()
}

function checkNGM(imported) {
	var temp = (imported) ? imported : player
	var td1PowerDiv = Decimal.pow(2, player.timeDimension1.bought).div(player.timeDimension1.power).toNumber()
	if (Math.round(td1PowerDiv) == 100) return 2.2
	if (Math.round(td1PowerDiv*8) == 5) return 2.1
	if (Math.round(td1PowerDiv) == 5) return 2
	if (Math.round(new Decimal(temp.timestudy.ipcost).mantissa) != 1) return 1.1
	if (Math.round(td1PowerDiv) == 10) return 1
	return 0
}

var savePlacement
function load_game(noOffline) {
	if (!metaSave.saveOrder.includes(metaSave.current)) metaSave.current=metaSave.saveOrder[0]
	var dimensionSave=get_save(metaSave.current)
	if (dimensionSave!=null) {
		if (dimensionSave.quantum !== undefined) if (dimensionSave.quantum.timeFluxPower !== undefined) dimensionSave = get_save(metaSave.current + "_af2019")
		player=dimensionSave
	}
	savePlacement=1
	while (metaSave.saveOrder[savePlacement-1]!=metaSave.current) savePlacement++
	if (break_infinity_js==null) {
		if (player.aarexModifications) break_infinity_js=player.aarexModifications.breakInfinity
		if (break_infinity_js) Decimal = Decimal_BI
		initCost = [null, new Decimal(10), new Decimal(1e2), new Decimal(1e4), new Decimal(1e6), new Decimal(1e9), new Decimal(1e13), new Decimal(1e18), new Decimal(1e24)]
		costMults = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
		nextAt = {postc1:new Decimal("1e2000"),postc1_ngmm:new Decimal("1e3000"),postc2:new Decimal("1e5000"),postc3:new Decimal("1e12000"),postc4:new Decimal("1e14000"),postc5:new Decimal("1e18000"),postc6:new Decimal("1e20000"),postc7:new Decimal("1e23000"),postc8:new Decimal("1e28000"),postcngmm_1:new Decimal("1e750"),postcngmm_1_ngm3:new Decimal("1e1100"),postcngmm_2:new Decimal("1e1350"),postcngmm_3:new Decimal("1e2000"),postcngm3_1:new Decimal("1e1520"),postcngm3_2:new Decimal("1e1770")}
		goals = {postc1:new Decimal("1e850"),postc1_ngmm:new Decimal("1e650"),postc2:new Decimal("1e10500"),postc3:new Decimal("1e5000"),postc4:new Decimal("1e13000"),postc5:new Decimal("1e11111"),postc6:new Decimal("2e22222"),postc7:new Decimal("1e10000"),postc7_ngmm:new Decimal("1e15000"),postc8:new Decimal("1e27000"),postcngmm_1:new Decimal("1e550"),postcngmm_1_ngm3:new Decimal("6.66e666"),postcngmm_2:new Decimal("1e950"),postcngmm_2_ngm3:new Decimal("1e1100"),postcngmm_3:new Decimal("1e1200"),postcngm3_1:new Decimal("1e600"),postcngm3_2:new Decimal("1e920")}
		setUnlocks = [Decimal.pow(Number.MAX_VALUE, 2.9)]
	}
	onLoad(noOffline)
	startInterval()
}

function reload() {
	clearInterval(gameLoopIntervalId)
	updateNewPlayer()
	closeToolTip()
	load_game(true)
}

var noSave=false
function save_game(silent) {
  if (noSave) return
  set_save(metaSave.current, player);
  if (!silent) $.notify("Game saved", "info")
}

function overwrite_save(id) {
	if (id==metaSave.current) {
		save_game()
		return
	}
	var placement=1
	while (metaSave.saveOrder[placement-1]!=id) placement++
	if (!confirm("Are you really sure you want to overwrite save #"+placement+"? You might lose your progress!")) return
	set_save(id, player)
	$.notify("Save overwritten", "info")
}

function change_save(id) {
  save_game(true)
  clearInterval(gameLoopIntervalId)
  var oldId=metaSave.current
  metaSave.current=id
  changeSaveDesc(oldId, savePlacement)
  updateNewPlayer()
  closeToolTip()
  load_game(shiftDown)
  savePlacement=1
  while (metaSave.saveOrder[savePlacement-1]!=id) savePlacement++
  changeSaveDesc(metaSave.current, savePlacement)

  $.notify("Save #"+savePlacement+" loaded", "info")
  localStorage.setItem("AD_aarexModifications_ghostify",btoa(JSON.stringify(metaSave)))
}

function rename_save(id) {
	if (metaSave.current != id && id !== undefined) {
		var placement=1
		while (metaSave.saveOrder[placement-1]!=id) placement++
	}
	var save_name = prompt("Input a new name of "+((metaSave.current == id || id === undefined) ? "your current save" : "save #" + placement)+". It is necessary to rename it into related names! Leave blank to reset the save's name.")
	if (save_name === null) return
	if (metaSave.current == id || id === undefined) {
		player.aarexModifications.save_name = save_name
		document.getElementById("rename").innerHTML = "<p style='font-size:15px'>Rename</p>Name: "+(player.aarexModifications.save_name?player.aarexModifications.save_name:"Save #" + savePlacement)
	} else {
		var temp_save = get_save(id)
		if (!temp_save.aarexModifications) temp_save.aarexModifications={
			dilationConf: false,
			offlineProgress: true,
			autoSave: true,
			progressBar: true,
			logRateChange: false,
			hideProductionTab: true,
			eternityChallRecords: {},
			popUpId: 0,
			tabsSave: {on: false},
			breakInfinity: false
        }
		temp_save.aarexModifications.save_name = save_name
	}
	set_save(id, temp_save)
	placement=1
	while (metaSave.saveOrder[placement-1]!=id) placement++
	changeSaveDesc(id, placement)
	$.notify("Save #"+placement+" renamed", "info")
}

function export_save(id) {
    var placement=1
    while (metaSave.saveOrder[placement-1]!=id) placement++
	let output = document.getElementById('exportOutput')
	let parent = output.parentElement

	parent.style.display = ""
	output.value = localStorage.getItem(btoa("dsAM_ghostify_"+id))

	output.onblur = function() {
		parent.style.display = "none"
	}

	output.focus()
	output.select()

	try {
		if (document.execCommand('copy')) {
			$.notify("Exported save #"+placement+" to clipboard", "info")
			output.blur()
		}
	} catch(ex) {
		// well, we tried.
	}
}

function move(id,offset) {
	placement=0
	while (metaSave.saveOrder[placement]!=id) placement++
	if (offset<0) {
		if (placement<-offset) return
	} else if (placement>metaSave.saveOrder.length-offset-1) return
	var temp=metaSave.saveOrder[placement]
	if (temp==metaSave.current) savePlacement+=offset
	if (metaSave.saveOrder[placement+offset]==metaSave.current) savePlacement-=offset
	metaSave.saveOrder[placement]=metaSave.saveOrder[placement+offset]
	metaSave.saveOrder[placement+offset]=temp
	document.getElementById("saves").rows[placement].innerHTML=getSaveLayout(metaSave.saveOrder[placement])
	document.getElementById("saves").rows[placement+offset].innerHTML=getSaveLayout(id)
	changeSaveDesc(metaSave.saveOrder[placement], placement+1)
	changeSaveDesc(id, placement+offset+1)
	localStorage.setItem("AD_aarexModifications_ghostify",btoa(JSON.stringify(metaSave)))
}

function delete_save(saveId) {
	if (metaSave.saveOrder.length<2) {
		document.getElementById("reset").click()
		return
	} else if (!confirm("Do you really want to erase this save? You will lose access if you do that!")) return
	var alreadyDeleted=false
	var newSaveOrder=[]
	for (orderId=0;orderId<metaSave.saveOrder.length;orderId++) {
		if (alreadyDeleted) changeSaveDesc(metaSave.saveOrder[orderId], orderId)
		if (metaSave.saveOrder[orderId]==saveId) {
			localStorage.removeItem(btoa("dsAM_ghostify_"+saveId))
			alreadyDeleted=true
			document.getElementById("saves").deleteRow(orderId)
			if (savePlacement>orderId+1) savePlacement--
			loadedSaves--
		} else newSaveOrder.push(metaSave.saveOrder[orderId])
	}
	metaSave.saveOrder=newSaveOrder
	if (metaSave.current==saveId) {
		change_save(metaSave.saveOrder[0])
		document.getElementById("loadmenu").style.display="block"
	} else localStorage.setItem("AD_aarexModifications_ghostify",btoa(JSON.stringify(metaSave)))
	$.notify("Save deleted", "info")
}

var ngModeMessages=[]
function new_game(id) {
	if (modes.arrows > 1) {
		alert("Coming soon...")
		return
	}
	save_game(true)
	clearInterval(gameLoopIntervalId)
	updateNewPlayer()
	var oldId=metaSave.current
	metaSave.current=1
	while (metaSave.saveOrder.includes(metaSave.current)) metaSave.current++
	metaSave.saveOrder.push(metaSave.current)
	localStorage.setItem("AD_aarexModifications_ghostify",btoa(JSON.stringify(metaSave)))
	changeSaveDesc(oldId, savePlacement)
	latestRow=document.getElementById("saves").insertRow(loadedSaves)
	latestRow.innerHTML=getSaveLayout(metaSave.current)
	loadedSaves++
	changeSaveDesc(metaSave.current, loadedSaves)
	savePlacement=loadedSaves
	closeToolTip()
	onLoad()
	startInterval()
	
	$.notify("Save created", "info")
	localStorage.setItem("AD_aarexModifications_ghostify",btoa(JSON.stringify(metaSave)))
	closeToolTip()
	showDimTab('antimatterdimensions')
	showStatsTab('stats')
	showAchTab('normalachievements')
	showChallengesTab('normalchallenges')
	showInfTab('preinf')
	showEternityTab('timestudies', true)
	showQuantumTab('uquarks')
	showBranchTab('red')
	showGhostifyTab('neutrinos')
}

function transformSaveToDecimal() {

  player.infinityPoints = new Decimal(player.infinityPoints)
  document.getElementById("eternitybtn").style.display = ((player.infinityPoints.gte(Number.MAX_VALUE) && player.infDimensionsUnlocked[7]) || getEternitied() > 0) ? "inline-block" : "none"

  player.money = new Decimal(player.money)
  player.tickSpeedCost = new Decimal(player.tickSpeedCost)
  player.tickspeed = new Decimal(player.tickspeed)
  player.firstCost = new Decimal(player.firstCost)
  player.secondCost = new Decimal(player.secondCost)
  player.thirdCost = new Decimal(player.thirdCost)
  player.fourthCost = new Decimal(player.fourthCost)
  player.fifthCost = new Decimal(player.fifthCost)
  player.sixthCost = new Decimal(player.sixthCost)
  player.seventhCost = new Decimal(player.seventhCost)
  player.eightCost = new Decimal(player.eightCost)
  player.firstAmount = new Decimal(player.firstAmount)
  player.secondAmount = new Decimal(player.secondAmount)
  player.thirdAmount = new Decimal(player.thirdAmount)
  player.fourthAmount = new Decimal(player.fourthAmount)
  player.fifthAmount = new Decimal(player.fifthAmount)
  player.sixthAmount = new Decimal(player.sixthAmount)
  player.seventhAmount = new Decimal(player.seventhAmount)
  player.eightAmount = new Decimal(player.eightAmount)
  player.firstPow = new Decimal(player.firstPow)
  player.secondPow = new Decimal(player.secondPow)
  player.thirdPow = new Decimal(player.thirdPow)
  player.fourthPow = new Decimal(player.fourthPow)
  player.fifthPow = new Decimal(player.fifthPow)
  player.sixthPow = new Decimal(player.sixthPow)
  player.seventhPow = new Decimal(player.seventhPow)
  player.eightPow = new Decimal(player.eightPow)
  player.sacrificed = new Decimal(player.sacrificed)
  player.totalmoney = new Decimal(player.totalmoney)
  player.infinitied = nP(player.infinitied)
  player.infinitiedBank = nP(player.infinitiedBank)
  player.chall3Pow = new Decimal(player.chall3Pow)
  player.chall11Pow = new Decimal(player.chall11Pow)
  if (player.galacticSacrifice !== undefined) {
      player.galacticSacrifice.galaxyPoints = Decimal.round(player.galacticSacrifice.galaxyPoints)
      if (player.dimPowerIncreaseCost !== undefined) player.dimPowerIncreaseCost = new Decimal(player.dimPowerIncreaseCost)
  }
  player.costMultipliers = [new Decimal(player.costMultipliers[0]), new Decimal(player.costMultipliers[1]), new Decimal(player.costMultipliers[2]), new Decimal(player.costMultipliers[3]), new Decimal(player.costMultipliers[4]), new Decimal(player.costMultipliers[5]), new Decimal(player.costMultipliers[6]), new Decimal(player.costMultipliers[7])]
  player.tickspeedMultiplier = new Decimal(player.tickspeedMultiplier)
  player.matter = new Decimal(player.matter)
 
  if (player.singularity != undefined) {
      player.singularity.sacrificed = new Decimal(player.singularity.sacrificed)
      player.singularity.singularityPower = new Decimal(player.singularity.singularityPower)
      player.singularity.darkMatter = new Decimal(player.singularity.darkMatter)
  }
  player.infinityPower = new Decimal(player.infinityPower)
  player.infinityDimension1.amount = new Decimal(player.infinityDimension1.amount)
  player.infinityDimension2.amount = new Decimal(player.infinityDimension2.amount)
  player.infinityDimension3.amount = new Decimal(player.infinityDimension3.amount)
  player.infinityDimension4.amount = new Decimal(player.infinityDimension4.amount)
  player.infinityDimension5.amount = new Decimal(player.infinityDimension5.amount)
  player.infinityDimension6.amount = new Decimal(player.infinityDimension6.amount)
  player.infinityDimension7.amount = new Decimal(player.infinityDimension7.amount)
  player.infinityDimension8.amount = new Decimal(player.infinityDimension8.amount)

  player.eternities = nP(player.eternities)
  if (player.eternitiesBank !== undefined) player.eternitiesBank = nP(player.eternitiesBank)
  player.timeDimension1.amount = new Decimal(player.timeDimension1.amount)
  player.timeDimension2.amount = new Decimal(player.timeDimension2.amount)
  player.timeDimension3.amount = new Decimal(player.timeDimension3.amount)
  player.timeDimension4.amount = new Decimal(player.timeDimension4.amount)
  player.timeDimension5.amount = new Decimal(player.timeDimension5.amount)
  player.timeDimension6.amount = new Decimal(player.timeDimension6.amount)
  player.timeDimension7.amount = new Decimal(player.timeDimension7.amount)
  player.timeDimension8.amount = new Decimal(player.timeDimension8.amount)
  player.timeDimension1.cost = new Decimal(player.timeDimension1.cost)
  player.timeDimension2.cost = new Decimal(player.timeDimension2.cost)
  player.timeDimension3.cost = new Decimal(player.timeDimension3.cost)
  player.timeDimension4.cost = new Decimal(player.timeDimension4.cost)
  player.timeDimension5.cost = new Decimal(player.timeDimension5.cost)
  player.timeDimension6.cost = new Decimal(player.timeDimension6.cost)
  player.timeDimension7.cost = new Decimal(player.timeDimension7.cost)
  player.timeDimension8.cost = new Decimal(player.timeDimension8.cost)
  player.timeDimension1.power = new Decimal(player.timeDimension1.power)
  player.timeDimension2.power = new Decimal(player.timeDimension2.power)
  player.timeDimension3.power = new Decimal(player.timeDimension3.power)
  player.timeDimension4.power = new Decimal(player.timeDimension4.power)
  player.timeDimension5.power = new Decimal(player.timeDimension5.power)
  player.timeDimension6.power = new Decimal(player.timeDimension6.power)
  player.timeDimension7.power = new Decimal(player.timeDimension7.power)
  player.timeDimension8.power = new Decimal(player.timeDimension8.power)

  if (player.exdilation !== undefined) {
      player.blackhole.power = new Decimal(player.blackhole.power)

      player.blackholeDimension1.amount = new Decimal(player.blackholeDimension1.amount)
      player.blackholeDimension2.amount = new Decimal(player.blackholeDimension2.amount)
      player.blackholeDimension3.amount = new Decimal(player.blackholeDimension3.amount)
      player.blackholeDimension4.amount = new Decimal(player.blackholeDimension4.amount)
      player.blackholeDimension1.cost = new Decimal(player.blackholeDimension1.cost)
      player.blackholeDimension2.cost = new Decimal(player.blackholeDimension2.cost)
      player.blackholeDimension3.cost = new Decimal(player.blackholeDimension3.cost)
      player.blackholeDimension4.cost = new Decimal(player.blackholeDimension4.cost)
      player.blackholeDimension1.power = new Decimal(player.blackholeDimension1.power)
      player.blackholeDimension2.power = new Decimal(player.blackholeDimension2.power)
      player.blackholeDimension3.power = new Decimal(player.blackholeDimension3.power)
      player.blackholeDimension4.power = new Decimal(player.blackholeDimension4.power)

      player.exdilation.unspent = new Decimal(player.exdilation.unspent)
      player.exdilation.spent[1] = new Decimal(player.exdilation.spent[1])
      player.exdilation.spent[2] = new Decimal(player.exdilation.spent[2])
      player.exdilation.spent[3] = new Decimal(player.exdilation.spent[3])
  }

  if (player.meta !== undefined) {
      player.meta.antimatter = new Decimal(player.meta.antimatter);
      player.meta.bestAntimatter = new Decimal(player.meta.bestAntimatter);
      for (let i = 1; i <= 8; i++) {
          player.meta[i].amount = new Decimal(player.meta[i].amount);
          player.meta[i].cost = new Decimal(player.meta[i].cost);
      }
      if (player.quantum) {
          if (player.quantum.last10) for (i=0;i<10;i++) player.quantum.last10[i][1] = new Decimal(player.quantum.last10[i][1])
          player.quantum.quarks = new Decimal(player.quantum.quarks);
          if (!player.masterystudies) player.quantum.gluons = (player.quantum.gluons ? player.quantum.gluons.rg !== null : true) ? new Decimal(0) : new Decimal(player.quantum.gluons);
          player.quantum.neutronstar.quarks = new Decimal(player.quantum.neutronstar.quarks);
          player.quantum.neutronstar.metaAntimatter = new Decimal(player.quantum.neutronstar.metaAntimatter);
          player.quantum.neutronstar.dilatedTime = new Decimal(player.quantum.neutronstar.dilatedTime);
      }
  }
  player.timeShards = new Decimal(player.timeShards)
  player.eternityPoints = new Decimal(player.eternityPoints)
  player.tickThreshold = new Decimal(player.tickThreshold)
  player.postC3Reward = new Decimal(player.postC3Reward)
  player.postC8Mult = new Decimal(player.postC8Mult)

  for (var i=0; i<10; i++) {
      player.lastTenRuns[i][0] = parseFloat(player.lastTenRuns[i][0])
      player.lastTenRuns[i][1] = new Decimal(player.lastTenRuns[i][1])
      player.lastTenEternities[i][1] = new Decimal(player.lastTenEternities[i][1])
  }
  player.replicanti.chanceCost = new Decimal(player.replicanti.chanceCost)
  player.replicanti.intervalCost = new Decimal(player.replicanti.intervalCost)
  player.replicanti.galCost = new Decimal(player.replicanti.galCost)

  for (var i=1; i<=8; i++) {
      player["infinityDimension"+i].cost = new Decimal(player["infinityDimension"+i].cost)
      player["infinityDimension"+i].power = new Decimal(player["infinityDimension"+i].power)
  }

  player.infMultCost = new Decimal(player.infMultCost)
  player.infMult = new Decimal(player.infMult)
  player.timestudy.amcost = new Decimal(player.timestudy.amcost)
  player.timestudy.ipcost = new Decimal(player.timestudy.ipcost)
  player.timestudy.epcost = new Decimal(player.timestudy.epcost)

  player.autoIP = new Decimal(player.autoIP)

  if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autobuyers[11].priority !== "undefined" && player.autobuyers[11].priority.toString().toLowerCase()!="max") player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority)

  player.epmultCost = new Decimal(player.epmultCost)
  player.epmult = new Decimal(player.epmult)
  player.eternityBuyer.limit = new Decimal(player.eternityBuyer.limit)
  player.eternityChallGoal = new Decimal(player.eternityChallGoal)
  player.replicanti.amount = new Decimal(player.replicanti.amount)
  if (player.boughtDims) {
      player.replicanti.limit = new Decimal(player.replicanti.limit)
      player.replicanti.newLimit = new Decimal(player.replicanti.newLimit)
      if (player.darkMatter) player.darkMatter = new Decimal(player.darkMatter)
  }

  player.dilation.tachyonParticles = new Decimal(player.dilation.tachyonParticles)
  player.dilation.dilatedTime = new Decimal(player.dilation.dilatedTime)
  player.dilation.totalTachyonParticles = new Decimal(player.dilation.totalTachyonParticles)
  player.dilation.nextThreshold = new Decimal(player.dilation.nextThreshold)

  if (player.masterystudies) {
      player.dbPower = new Decimal(player.dbPower)
      if (player.meta.bestOverQuantums != undefined) player.meta.bestOverQuantums = new Decimal(player.meta.bestOverQuantums)
      if (player.quantum ? player.quantum.usedQuarks : false) {
          player.quantum.usedQuarks.r = new Decimal(player.quantum.usedQuarks.r)
          player.quantum.usedQuarks.g = new Decimal(player.quantum.usedQuarks.g)
          player.quantum.usedQuarks.b = new Decimal(player.quantum.usedQuarks.b)
          player.quantum.colorPowers.r = new Decimal(player.quantum.colorPowers.r)
          player.quantum.colorPowers.g = new Decimal(player.quantum.colorPowers.g)
          player.quantum.colorPowers.b = new Decimal(player.quantum.colorPowers.b)
      }
      if (player.quantum ? player.aarexModifications.newGame3PlusVersion > 1.5 : false) {
          player.quantum.gluons.rg = new Decimal(player.quantum.gluons.rg)
          player.quantum.gluons.gb = new Decimal(player.quantum.gluons.gb)
          player.quantum.gluons.br = new Decimal(player.quantum.gluons.br)
      }
      if (player.quantum ? player.quantum.autobuyer : false) player.quantum.autobuyer.limit = new Decimal(player.quantum.autobuyer.limit)
      if (player.quantum ? player.quantum.electrons : false) if (typeof(player.quantum.electrons.amount)=="string") player.quantum.electrons.amount = Math.round(parseFloat(player.quantum.electrons.amount)*4)/4
      if (player.dilation.bestTP == undefined) player.dilation.bestTP = player.achievements.includes("ng3p18") || player.achievements.includes("ng3p37") ? player.dilation.tachyonParticles : 0
      player.dilation.bestTP = new Decimal(player.dilation.bestTP)
      if (player.quantum ? player.quantum.replicants : false) {
          player.quantum.replicants.amount = new Decimal(player.quantum.replicants.amount)
          player.quantum.replicants.requirement = new Decimal(player.quantum.replicants.requirement)
          player.quantum.replicants.quarks = new Decimal(player.quantum.replicants.quarks)
          player.quantum.replicants.quantumFoodCost = new Decimal(player.quantum.replicants.quantumFoodCost)
          player.quantum.replicants.limitCost = new Decimal(player.quantum.replicants.limitCost)
          player.quantum.replicants.eggonProgress = new Decimal(player.quantum.replicants.eggonProgress)
          player.quantum.replicants.eggons = new Decimal(player.quantum.replicants.eggons)
          player.quantum.replicants.hatchSpeedCost = new Decimal(player.quantum.replicants.hatchSpeedCost)
          player.quantum.replicants.babyProgress = new Decimal(player.quantum.replicants.babyProgress)
          player.quantum.replicants.babies = new Decimal(player.quantum.replicants.babies)
          player.quantum.replicants.ageProgress = new Decimal(player.quantum.replicants.ageProgress)
      }
      if (player.quantum ? (player.quantum.emperorDimensions ? player.quantum.emperorDimensions[1] : false) : false) for (d=1;d<9;d++) {
          player.quantum.emperorDimensions[d].workers = Decimal.round(player.quantum.emperorDimensions[d].workers)
          player.quantum.emperorDimensions[d].progress = Decimal.round(player.quantum.emperorDimensions[d].progress)
      }
      if (player.quantum ? player.quantum.nanofield : false) {
          player.quantum.nanofield.charge = new Decimal(player.quantum.nanofield.charge)
          player.quantum.nanofield.energy = new Decimal(player.quantum.nanofield.energy)
          player.quantum.nanofield.antienergy = new Decimal(player.quantum.nanofield.antienergy)
          player.quantum.nanofield.powerThreshold = new Decimal(player.quantum.nanofield.powerThreshold)
      }
      if (player.quantum ? player.quantum.tod : false) {
          player.quantum.tod.r.quarks = new Decimal(player.quantum.tod.r.quarks)
          player.quantum.tod.r.spin = new Decimal(player.quantum.tod.r.spin)
          player.quantum.tod.g.quarks = new Decimal(player.quantum.tod.g.quarks)
          player.quantum.tod.g.spin = new Decimal(player.quantum.tod.g.spin)
          player.quantum.tod.b.quarks = new Decimal(player.quantum.tod.b.quarks)
          player.quantum.tod.b.spin = new Decimal(player.quantum.tod.b.spin)
          if (player.quantum.tod.r.gainDiv) {
              player.quantum.tod.r.gainDiv = new Decimal(player.quantum.tod.r.gainDiv)
              player.quantum.tod.g.gainDiv = new Decimal(player.quantum.tod.g.gainDiv)
              player.quantum.tod.b.gainDiv = new Decimal(player.quantum.tod.b.gainDiv)
          }
      }
  }
  if (player.ghostify) {
      player.dilation.bestTPOverGhostifies = Decimal.max(player.dilation.bestTPOverGhostifies, player.dilation.bestTP)
      player.meta.bestOverGhostifies = Decimal.max(player.meta.bestOverGhostifies, player.meta.bestOverQuantums)
      player.quantum.pairedChallenges.pc68best = new Decimal(player.quantum.pairedChallenges.pc68best)
      player.quantum.bigRip.bestThisRun = new Decimal(player.quantum.bigRip.bestThisRun)
      player.quantum.bigRip.bestAntimatter = new Decimal(player.quantum.bigRip.bestAntimatter)
      player.quantum.bigRip.totalAntimatter = new Decimal(player.quantum.bigRip.totalAntimatter)
      player.quantum.bigRip.spaceShards = new Decimal(player.quantum.bigRip.spaceShards)
      player.quantum.breakEternity.eternalMatter = new Decimal(player.quantum.breakEternity.eternalMatter)
      player.ghostify.ghostParticles = new Decimal(player.ghostify.ghostParticles)
      for (var r=0;r<10;r++) player.ghostify.last10[r][1] = new Decimal(player.ghostify.last10[r][1])
      player.ghostify.neutrinos.electron = new Decimal(player.ghostify.neutrinos.electron)
      player.ghostify.neutrinos.mu = new Decimal(player.ghostify.neutrinos.mu)
      player.ghostify.neutrinos.tau = new Decimal(player.ghostify.neutrinos.tau)
  }
}


function loadAutoBuyerSettings() {
  for (var i=0; i<9; i++) {
      document.getElementById("priority" + (i+1)).selectedIndex = player.autobuyers[i].priority-1
      if (i == 8 && player.autobuyers[i].target == 10) document.getElementById("toggleBtnTickSpeed").textContent = "Buys max"
      else if (i == 8 && player.autobuyers[i].target !== 10) document.getElementById("toggleBtnTickSpeed").textContent = "Buys singles"
      else if (player.autobuyers[i].target > 10) document.getElementById("toggleBtn" + (i+1)).textContent = "Buys until 10"
      else document.getElementById("toggleBtn" + (i+1)).textContent = "Buys singles"

  }
  document.getElementById("priority10").value = player.autobuyers[9].priority
  document.getElementById("priority11").value = player.autobuyers[10].priority
  document.getElementById("priority12").value = player.autoCrunchMode == "amount" ? formatValue("Scientific", player.autobuyers[11].priority, 2, 0) : player.autobuyers[11].priority
  document.getElementById("overGalaxies").value = player.overXGalaxies
  document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
  document.getElementById("prioritySac").value = player.autoSacrifice.priority
  document.getElementById("bulkgalaxy").value = player.autobuyers[10].bulk
  document.getElementById("priority13").value = formatValue("Scientific", new Decimal(player.eternityBuyer.limit), 2, 0)
  if (player.achievements.includes("ng3p52") && player.eternityBuyer.presets !== undefined) {
      document.getElementById("autoEterIfAD").textContent = "Auto-eternity only if able to auto-dilate: O" + (player.eternityBuyer.ifAD ? "N" : "FF")
      document.getElementById("autoEterValue").value = formatValue("Scientific", new Decimal(player.eternityBuyer.limit), 2, 0)
      document.getElementById("autodilatemode").textContent = "Mode: " + (player.eternityBuyer.dilMode == "upgrades" ? "Upgrades" : "Amount of eternities")
      document.getElementById("slowstop").textContent = "Stop auto-dilate if a little bit of TP is gained: O" + (player.eternityBuyer.slowStop ? "N" : "FF")
      document.getElementById("toggleAP").textContent = player.eternityBuyer.presets.on ? "Disable" : "Enable"
      document.getElementById("eternitiesLeft").textContent = getFullExpansion(player.eternityBuyer.presets.left)
      apLoaded = false
      clearInterval(apInterval)
      if (document.getElementById("eternitystore").style.display === "block" && document.getElementById("autoEternity").style.display === "block") loadAP()
  }
  if (player.eternityBuyer.dilationPerAmount !== undefined) {
      document.getElementById('prioritydil').value=player.eternityBuyer.dilationPerAmount
      if (player.achievements.includes("ng3p52")) document.getElementById("autoDilValue").value=player.eternityBuyer.dilationPerAmount
  }
  if (player.autobuyers[12] !== undefined) document.getElementById("priority14").value = formatValue("Scientific", new Decimal(player.autobuyers[12].priority), 2, 0)
  if (player.autobuyers[13] !== undefined) {
      document.getElementById("priority15").value = player.autobuyers[13].priority
      document.getElementById("overGalaxiesTickspeedBoost").value = player.overXGalaxiesTickspeedBoost
      document.getElementById("bulkTickBoost").value = player.autobuyers[13].bulk
  }
  if (player.boughtDims) {
      document.getElementById("maxReplicantiCrunchSwitch").checked = player.autobuyers[11].requireMaxReplicanti;
      document.getElementById("requireIPPeak").checked = player.autobuyers[11].requireIPPeak;
  }
  if (player.masterystudies) {
      document.getElementById("prioritydil").value = player.eternityBuyer.dilationPerAmount
      if (player.quantum) if (player.quantum.autobuyer) {
          if (isNaN(break_infinity_js ? player.quantum.autobuyer.limit : player.quantum.autobuyer.limit.logarithm)) player.quantum.autobuyer.limit = new Decimal(1)
          document.getElementById("priorityquantum").value = player.quantum.autobuyer.mode == "amount" || player.quantum.autobuyer.mode == "relative" ? formatValue("Scientific", player.quantum.autobuyer.limit, 2, 0) : player.quantum.autobuyer.limit
      }
  }
}

function set_save(id, value) {
	localStorage.setItem(btoa('dsAM_ghostify_'+id), btoa(JSON.stringify(value, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
}

function get_save(id) {
    try {
        var dimensionSave = localStorage.getItem(btoa('dsAM_ghostify_'+id))
        if (dimensionSave !== null) dimensionSave = JSON.parse(atob(dimensionSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
        return dimensionSave
    } catch(e) { }
}

function initiateMetaSave() {
	metaSave = localStorage.getItem('AD_aarexModifications_ghostify')
	if (metaSave == null) metaSave = {presetsOrder:[], version:2}
	else metaSave = JSON.parse(atob(metaSave))
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
						localStorage.setItem(btoa('dsAM_ghostify_'+(1+id)), btoa(JSON.stringify(ngSave.saves[id], function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
					}
				}
				if (!metaSave.newGameMinus) metaSave.current=1+ngSave.currentSave
			} else {
				if (!metaSave.newGameMinus) metaSave.current=1
				metaSave.saveOrder.push(1)
				localStorage.setItem(btoa('dsAM_ghostify_1'), btoa(JSON.stringify(ngSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
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
						localStorage.setItem(btoa('dsAM_ghostify_'+(4+id)), btoa(JSON.stringify(ngmSave.saves[id], function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
					}
				}
				if (metaSave.newGameMinus) metaSave.current=4+ngmSave.currentSave
			} else {
				if (metaSave.newGameMinus) metaSave.current=4
				metaSave.saveOrder.push(4)
				localStorage.setItem(btoa('dsAM_ghostify_4'), btoa(JSON.stringify(ngmSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
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
				localStorage.setItem(btoa("dsAM_ghostify_ST_"+id),btoa(JSON.stringify({preset:studyTreePreset})))
				localStorage.removeItem("studyTree"+id)
			}
		}
	}
	if (metaSave.version < 2.01) {
		metaSave.presetsOrder_ers=[]
	}
	metaSave.version=2.01
}

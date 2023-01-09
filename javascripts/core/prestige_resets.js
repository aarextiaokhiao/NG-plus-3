let RESETS = {
	db: {
		//lowest: Dimension Boosts
		startingAM() {
			let x = 10
			if (player.challenges.includes("challenge1")) x = 100
			if (inNGM(4)) x = 200
			if (hasAch("r37")) x = 1000
			if (hasAch("r54")) x = 2e5
			if (hasAch("r55")) x = 1e10
			if (hasAch("r78")) x = 2e25
			player.money = E(x)
		},
		startingDims() {
			var costs = [10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24]
			var costMults = [1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15]
			if (inNC(10) || player.currentChallenge == "postc1") costs = [10, 100, 100, 500, 2500, 2e4, 2e5, 4e6]
			if (inNC(10)) costMults = [1e3, 5e3, 1e4, 12e3, 18e3, 26e3, 32e3, 42e3]

			for (var d = 1; d <= 8; d++) {
				var name = TIER_NAMES[d]
				player[name + "Amount"] = E(0)
				player[name + "Bought"] = 0
				player[name + "Cost"] = E(costs[d - 1])
				player.costMultipliers[d - 1] = E(costMults[d - 1])
			}
			player.totalBoughtDims = resetTotalBought()

			//IC2 Headstart
			if (player.currentChallenge == "postc2") {
				player.eightAmount = E(1)
				player.eightBought = 1
				player.resets = 4
			}
		},
		startingTickspeed() {
			player.tickspeed = E(aarMod.newGameExpVersion ? 500 : 1000)
			player.tickSpeedCost = E(1e3)
			player.tickspeedMultiplier = E(10)

			if (hasAch("r36")) player.tickspeed = player.tickspeed.times(0.98);
			if (hasAch("r45")) player.tickspeed = player.tickspeed.times(0.98);
			if (hasAch("r66")) player.tickspeed = player.tickspeed.times(0.98);
			if (hasAch("r83")) player.tickspeed = player.tickspeed.times(E_pow(0.95,player.galaxies));
			divideTickspeedIC5()
		},
		doReset() {
			this.startingAM()
			this.startingDims()
			if (inNGM(4)) resetNGM4TDs()
			this.startingTickspeed()
			reduceDimCosts()
			setInitialDimensionPower()
			player.sacrificed = E(0)
			player.chall3Pow = E(0.01)
			player.matter = E(0)
			player.chall11Pow = E(1)
			player.postC4Tier = 1
			player.postC8Mult = E(1)
			skipResets()
			Marathon = 0

			//UPDATE DISPLAYS
			hideDimensions()
			tmp.tickUpdate = true
		}
	},
	tdb: {
		doReset() {
			player.tickBoughtThisInf = updateTBTIonGalaxy()

			if (order == "tdb" && (hasAch("r26") && player.resets >= player.tdBoosts)) return
			if (order == "tsb" && (hasAch("r27") && player.tickspeedBoosts < 5 * player.galaxies - 8)) return
			player.resets = 0
		}
	},
	tsb: {
		doReset(order) {
			if (inNGM(4)) player.tdBoosts = hasAch("r27") && player.currentChallenge == "" ? 3 : 0
		}
	},
	gal: {
		doReset() {
			if (inNGM(3)) player.tickspeedBoosts = 0
		}
	},
	galSac: {
		doReset() {
			player.galaxies = 0
			if (inNGM(2)) {
				player.galacticSacrifice.time = 0
				GPminpeak = E(0)
			}
		}
	},
	inf: {
		doReset(order) {
			if (isEmptiness) showTab("dimensions")
			if (inNGM(2)) player.galacticSacrifice = newGalacticDataOnInfinity(order != "inf")
			player.infinityPower = E(1)
			player.thisInfinityTime = 0
			IPminpeak = E(0)
			Marathon2 = 0
		}
	},
	eter: {
		doReset(order) {
			player.infinitied = 0
			player.bestInfinityTime = 9999999999
			player.lastTenRuns = [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]]
			player.autoIP = E(0)
			player.autoTime = 1e300
			updateLastTenRuns()

			player.infinityPoints = E(hasAch("r104") ? 2e25 : 0);
			playerInfinityUpgradesOnEternity()
			player.infMult = E(1)
			player.infMultCost = E(100)
			if (hasAch("r85")) player.infMult = player.infMult.times(4)
			if (hasAch("r93")) player.infMult = player.infMult.times(4)
			el("infmultbuyer").style.display = tmp.ngp3 || getEternitied() >= 1 ? "" : "none"

			if (!hasAch("r133")) player.postChallUnlocked = 0
			player.currentChallenge = ""
			player.challengeTarget = 0
			player.challenges = challengesCompletedOnEternity()
			updateChallenges()

			if (getEternitied() < 2) {
				player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
				if (inNGM(2)) player.autobuyers.push(13)
				if (inNGM(3)) player.autobuyers.push(14)
				if (inNGM(4)) player.autobuyers.push(15)
				player.break = false
			}
			updateAutobuyers()

			if (getEternitied() <= 20) {
				player.tickSpeedMultDecrease = 10
				player.tickSpeedMultDecreaseCost = 3e6
				player.dimensionMultDecrease = 10
				player.dimensionMultDecreaseCost = 1e8
				player.extraDimPowerIncrease = 0
				player.dimPowerIncreaseCost = 1e3  
				player.offlineProd = 0
				player.offlineProdCost = 1e7
			}

			player.infDimensionsUnlocked = resetInfDimUnlocked()
			completelyResetInfinityDimensions()
			hideMaxIDButton()

			if (getEternitied() < 7) player.autoSacrifice = 1
			player.postC4Tier = 1
			player.postC8Mult = E(1)

			if (getEternitied() < 50) {
				player.replicanti.amount = E(0)
				player.replicanti.unl = false
			} else if (order != "eter" || speedrunMilestonesReached < 24) {
				player.replicanti.amount = E(1)
			}
			if (!hasAch("ng3p67") || player.dilation.active) {
				let keepPartial = tmp.ngp3 && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 2e10
				player.replicanti.chance = keepPartial ? Math.min(player.replicanti.chance, 1) : 0.01
				player.replicanti.interval = keepPartial ? Math.max(player.replicanti.interval, player.timestudy.studies.includes(22) ? 1 : 50) : 1000
				player.replicanti.gal = 0
				player.replicanti.chanceCost = E_pow(1e15, player.replicanti.chance * 100).times(inNGM(2) ? 1e75 : 1e135)
				player.replicanti.intervalCost = E_pow(1e10, Math.round(Math.log10(1000 / player.replicanti.interval) / -Math.log10(0.9))).times(inNGM(2) ? 1e80 : 1e140)
				player.replicanti.galCost = E(inNGM(2) ? 1e110 : 1e170)

				el("replicantidiv").style.display="inline-block"
				el("replicantiunlock").style.display="none"
			}
			if (getEternitied() < 3) player.replicanti.galaxybuyer = undefined

			EPminpeakType = 'normal'
			EPminpeak = E(0)

			player.thisEternity = 0
			player.timeShards = E(0)
			player.tickThreshold = E(1)
			player.totalTickGained = 0
			resetTimeDimensions()

			player.eterc8ids = 50
			player.eterc8repl = 40

			player.dimlife = true
			player.dead = true
			if (tmp.ngp3) {
				player.peakSpent = 0
				player.dontWant = true
			}

			resetUP()
		}
	},
	qu: {
		doReset(order) {
			let bigRip = bigRipped()
			let qc = !inQC(0)

			player.infinitiedBank = 0
			player.eternities = speedrunMilestonesReached >= 1 ? 2e4 : tmp.ngp3 ? 0 : 100
			player.lastTenEternities = [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]]
			updateLastTenEternities()

			player.eternityPoints = E(0)
			player.eternityBuyer = getEternitied() < 100 ? player.eternityBuyer : {
				limit: E(0),
				isOn: false
			}
			player.eternityBuyer.statBeforeDilation = 0
			completelyResetTimeDimensions()

			player.respec = false
			if (bigRip ? !hasRipUpg(12) : !isRewardEnabled(11)) player.timestudy = {
				theorem: 0,
				amcost: E("1e20000"),
				ipcost: E(1),
				epcost: E(1),
				studies: [],
			}

			if (bigRip ? !hasRipUpg(12) : !isRewardEnabled(3)) player.eternityUpgrades = []
			player.epmult = E(1)
			player.epmultCost = E(5)

			if (tmp.ngp3 && (!isRewardEnabled(3) || bigRip)) player.eternityChalls = challengesCompletedOnEternity(bigRip)
			player.eternityChallGoal = E(Number.MAX_VALUE)
			player.currentEternityChall = ""
			player.eternityChallUnlocked = isRewardEnabled(11) ? player.eternityChallUnlocked : 0
			player.etercreq = 0

			if (!player.dilation.bestTP) player.dilation.bestTP = player.dilation.tachyonParticles
			let unl = bigRip ? hasRipUpg(10) : isRewardEnabled(4)
			let oldUpgs = player.dilation.upgrades
			player.dilation.tachyonParticles = E(0)
			player.dilation.dilatedTime = E(0)
			player.dilation.studies = []
			player.dilation.upgrades = []
			player.dilation.times = 0
			if (unl) {
				let keepTP = hasAch("ng3p71") ? true : bigRip ? hasRipUpg(11) : hasAch("ng3p37")
				if (bigRip) {
					player.dilation.studies = hasRipUpg(12) ? [1,2,3,4,5,6] : [1]
					if (hasRipUpg(12)) player.dilation.upgrades = oldUpgs
				} else {
					player.dilation.studies = speedrunMilestonesReached >= 6 ? [1,2,3,4,5,6] : [1]
					player.dilation.dilatedTime = unl && speedrunMilestonesReached >= 22 ? E(1e100) : E(0)
					if (speedrunMilestonesReached >= 6) player.dilation.upgrades = oldUpgs
				}
				if (keepTP) player.dilation.tachyonParticles = player.dilation.bestTP.pow((hasAch("ng3p71") ? true : bigRip ? false : qc ? ghSave.milestones > 15 : ghSave.milestones > 3) ? 1 : 0.5)
			}
			player.dilation.totalTachyonParticles = player.dilation.tachyonParticles
			resetDilationGalaxies()

			doMetaDimensionsReset(bigRip, !tmp.ngp3, qc)
			if (player.exdilation !== undefined) {
				player.exdilation = {
					unspent: E(0),
					spent: {
						1: E(0),
						2: E(0),
						3: E(0),
						4: E(0)
					},
					times: 0
				}
				player.blackhole = {
					unl: speedrunMilestonesReached >= 5,
					upgrades: {dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0},
					power: E(0)
				}
				if (!hasAch("ng3p67") || !aarMod.ngudpV || aarMod.ngumuV) {
					for (var d = 1; d <= (aarMod.nguspV ? 8 : 4); d++) player["blackholeDimension" + d] = {
						cost: blackholeDimStartCosts[d],
						amount: E(0),
						power: E(1),
						bought: 0
					}
				}
				if (speedrunMilestonesReached <= 4) {
					el("blackholediv").style.display = "none"
					el("blackholeunlock").style.display = "inline-block"
				}
			}
			if (tmp.ngp3) {
				if (speedrunMilestonesReached >= 4 && !isRewardEnabled(4)) {
					for (var s = 0; s < player.masterystudies.length; s++) {
						if (player.masterystudies[s].indexOf("t") >= 0) player.timestudy.theorem += masteryStudies.costs.time[player.masterystudies[s].split("t")[1]]
						else player.timestudy.theorem += masteryStudies.costs.dil[player.masterystudies[s].split("d")[1]]
					}
				}
				if (isRewardEnabled(11) && (bigRip && !hasRipUpg(12))) {
					if (player.eternityChallUnlocked > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.eternityChallUnlocked]
					else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
				}

				player.masterystudies = bigRip && !hasRipUpg(12) ? ["d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14"] : speedrunMilestonesReached >= 16 && isRewardEnabled(11) ? player.masterystudies : []
				player.respecMastery = false
				updateMasteryStudyCosts()

				ipMultPower = GUBought("gb3") ? 2.3 : player.masterystudies.includes("t241") ? 2.2 : 2
				if (!qc) {
					quSave.electrons.amount = 0
					quSave.electrons.sacGals = 0
					if (speedrunMilestonesReached < 25 && player.quantum.autoOptions.sacrifice) toggleAutoQuantumContent('sacrifice')
					tmp.aeg = 0
				}
				drawMasteryTree()
				replicantsResetOnQuantum(qc)
				nanofieldResetOnQuantum()
			}

			quSave.time = 0
			QKminpeak = E(0)
			QKminpeakValue = E(0)
			el("metaAntimatterEffectType").textContent = inQC(3) ? "multiplier on all Infinity Dimensions" : "extra multiplier per Dimension Boost"
		}
	}
}
let RESET_ORDER = Object.keys(RESETS)
let RESET_INDEX = {}
for (var [i, r] of Object.entries(RESET_ORDER)) RESET_INDEX[r] = i

function doReset(order) {
	let start = RESET_INDEX[order]
	for (var layer = start; layer >= 0; layer--) RESETS[RESET_ORDER[layer]].doReset(order)
}

//OLD CODE
function onQuantumAM(){
	let x = 10
	if (player.challenges.includes("challenge1")) x = 100
	if (inNGM(4)) x = 200
	if (hasAch("r37")) x = 1000
	if (hasAch("r54")) x = 2e5
	if (hasAch("r55")) x = 1e10
	if (hasAch("r78")) x = 2e25
	return E(x)
}

function NC10NDCostsOnReset(){
	if (inNC(10) || player.currentChallenge == "postc1") {
		player.thirdCost = E(100)
		player.fourthCost = E(500)
		player.fifthCost = E(2500)
		player.sixthCost = E(2e4)
		player.seventhCost = E(2e5)
		player.eightCost = E(4e6)
	}
}

function replicantsResetOnQuantum(challid){
	quSave.replicants.requirement = E("1e3000000")
	quSave.replicants.quarks = (!(challid > 0) && hasAch("ng3p45")) ? quSave.replicants.quarks.pow(2/3) : E(0)
	quSave.replicants.eggonProgress = E(0)
	quSave.replicants.eggons = E(0)
	quSave.replicants.babyProgress = E(0)
	quSave.replicants.babies = E(0)
	quSave.replicants.growupProgress = E(0)
	for (let d = 1; d <= 8; d++) {
		if (d == 8 || EDsave[d].perm < 10) quSave.replicants.quantumFood += Math.round(EDsave[d].progress.toNumber() * 3) % 3
		if (d != 1 || (!hasAch("ng3p46")) || challid > 0) {
			EDsave[d].workers = E(EDsave[d].perm)
			EDsave[d].progress = E(0)
		} else {
			EDsave[d].workers = EDsave[d].workers.pow(1/3)
			EDsave[d].progress = E(0)
		}
	}
}

function nanofieldResetOnQuantum(){
	nfSave.charge = E(0)
	nfSave.energy = E(0)
	nfSave.antienergy = E(0)
	nfSave.power = 0
	nfSave.powerThreshold = E(50)
}
		
function doMetaDimensionsReset(bigRip, headstart, challid){
	player.meta = {
		antimatter: getMetaAntimatterStart(bigRip),
		bestAntimatter: headstart ? player.meta.bestAntimatter : getMetaAntimatterStart(bigRip),
		bestOverQuantums: player.meta.bestOverQuantums,
		bestOverGhostifies: player.meta.bestOverGhostifies,
		resets: isRewardEnabled(27) ? (!challid && ghSave.milestones > 4 ? player.meta.resets : 4) : 0,
		'1': {
			amount: E(0),
			bought: 0,
			cost: E(10)
		},
		'2': {
			amount: E(0),
			bought: 0,
			cost: E(100)
		},
		'3': {
			amount: E(0),
			bought: 0,
			cost: E(1e4)
		},
		'4': {
			amount: E(0),
			bought: 0,
			cost: E(1e6)
		},
		'5': {
			amount: E(0),
			bought: 0,
			cost: E(1e9)
		},
		'6': {
			amount: E(0),
			bought: 0,
			cost: E(1e13)
		},
		'7': {
			amount: E(0),
			bought: 0,
			cost: E(1e18)
		},
		'8': {
			amount: E(0),
			bought: 0,
			cost: E(1e24)
		}
	}
}

function completelyResetNormalDimensions(){
	player.firstCost = E(10)
	player.secondCost = E(100)
	player.thirdCost = E(10000)
	player.fourthCost = E(1000000)
	player.fifthCost = E(1e9)
	player.sixthCost = E(1e13)
	player.seventhCost = E(1e18)
	player.eightCost = E(1e24)
	player.firstAmount = E(0)
	player.secondAmount = E(0)
	player.thirdAmount = E(0)
	player.fourthAmount = E(0)
	player.firstBought = 0
	player.secondBought = 0
	player.thirdBought = 0
	player.fourthBought = 0
	player.fifthAmount = E(0)
	player.sixthAmount = E(0)
	player.seventhAmount = E(0)
	player.eightAmount = E(0)
	player.fifthBought = 0
	player.sixthBought = 0
	player.seventhBought = 0
	player.eightBought = 0
}

function completelyResetInfinityDimensions(){
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

function completelyResetTimeDimensions(){
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
	player.timeDimension5 = {
		cost: E("1e2350"),
		amount: E(0),
		power: E(1),
		bought: 0
	}
	player.timeDimension6 = {
		cost: E("1e2650"),
		amount: E(0),
		power: E(1),
		bought: 0
	}
	player.timeDimension7 = {
		cost: E("1e3000"),
		amount: E(0),
		power: E(1),
		bought: 0
	}
	player.timeDimension8 = {
		cost: timeDimCost(8,0),
		amount: E(0),
		power: E(1),
		bought: 0
	}
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

function getReplicantsOnGhostifyData(){
	return {
		amount: E(0),
		requirement: E("1e3000000"),
		quarks: E(0),
		quantumFood: 0,
		quantumFoodCost: E(2e46),
		limit: 1,
		limitDim: 1,
		limitCost: E(1e49),
		eggonProgress: E(0),
		eggons: E(0),
		hatchSpeed: 20,
		hatchSpeedCost: E(1e49),
		babyProgress: E(0),
		babies: E(0),
		ageProgress: E(0)
	}
}

function getToDOnGhostifyData(){
	var bm = ghSave.milestones
	let ret = {
		r: {
			quarks: E(0),
			spin: E(bm > 13 ? 1e25 : 0),
			upgrades: {}
		},
		g: {
			quarks: E(0),
			spin: E(bm > 13 ? 1e25 : 0),
			upgrades: {}
		},
		b: {
			quarks: E(0),
			spin: E(bm > 13 ? 1e25 : 0),
			upgrades: {}
		},
		upgrades: {}
	}
	if (todSave.b.decays && hasAch("ng3p86")) ret.b.decays = Math.floor(todSave.b.decays * .75)
	if (todSave.r.decays && hasAch("ng3p86")) ret.r.decays = Math.floor(todSave.r.decays * .75)
	if (todSave.g.decays && hasAch("ng3p86")) ret.g.decays = Math.floor(todSave.g.decays * .75)
	return ret
}

function getBigRipOnGhostifyData(nBRU){
	var bm = ghSave.milestones
	return {
		active: false,
		conf: brSave.conf,
		times: 0,	
		bestThisRun: E(0),
		totalAntimatter: brSave.totalAntimatter,
		bestGals: brSave.bestGals,
		savedAutobuyersNoBR: brSave.savedAutobuyersNoBR,
		savedAutobuyersBR: brSave.savedAutobuyersBR,
		spaceShards: E(0),
		upgrades: bm ? nBRU : []
	}
}

function getBreakEternityDataOnGhostify(nBEU, bm){
	return {
		unlocked: bm > 14,
		break: bm > 14 ? beSave.break : false,
		eternalMatter: E(0),
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
		last10: [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]],
		autoEC: quSave.autoEC,
		disabledRewards: quSave.disabledRewards,
		metaAutobuyerWait: 0,
		autobuyer: {
			enabled: false,
			limit: E(0),
			mode: "amount",
			peakTime: 0
		},
		autoOptions: {
			assignQK: quSave.autoOptions.assignQK,
			assignQKRotate: quSave.autoOptions.assignQKRotate,
			sacrifice: bm ? quSave.autoOptions.sacrifice : false,
			replicantiReset: quSave.autoOptions.replicantiReset
		},
		assortPercentage: quSave.assortPercentage,
		assignAllRatios: quSave.assignAllRatios,
		quarks: E(0),
		usedQuarks: {
			r: E(0),
			g: E(0),
			b: E(0)
		},
		colorPowers: {
			r: E(0),
			g: E(0),
			b: E(0)
		},
		gluons: {
			rg: E(0),
			gb: E(0),
			br: E(0)
		},
		multPower: 0,
		electrons: {
			amount: 0,
			sacGals: 0,
			mult: bm > 2 ? quSave.electrons.mult : bm ? 6 : 2,
			rebuyables: bm > 2 ? quSave.electrons.rebuyables : [0,0,0,0]
		},
		challenge: [],
		challenges: {},
		nonMAGoalReached: quSave.nonMAGoalReached,
		challengeRecords: {},
		pairedChallenges: {
			order: bm ? quSave.pairedChallenges.order : {},
			current: 0,
			completed: bm ? 4 : 0,
			completions: quSave.pairedChallenges.completions,
			fastest: quSave.pairedChallenges.fastest,
			pc68best: quSave.pairedChallenges.pc68best,
			respec: false
		},
		qcsNoDil: quSave.qcsNoDil,
		qcsMods: quSave.qcsMods,
		replicants: getReplicantsOnGhostifyData(),
		emperorDimensions: {},
		nanofield: {
			charge: E(0),
			energy: E(0),
			antienergy: E(0),
			power: 0,
			powerThreshold: E(50),
			rewards: bm>12?16:0,
			producingCharge: false
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
		upgrades: bm > 1 ? quSave.upgrades : [],
		rg4: false
	}
}

function doGhostifyResetStuff(implode, gain, amount, force, bulk, nBRU, nBEU){
	var bm = ghSave.milestones
	player.galacticSacrifice = resetGalacticSacrifice()
	completelyResetNormalDimensions()
	player.money = onQuantumAM()
	player.tickSpeedCost = E(1000)
	player.tickspeed = E(aarMod.newGameExpVersion ? 500 : 1000)
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	player.totalBoughtDims = resetTotalBought()
	player.sacrificed = E(0)
	player.currentChallenge =  ""
	player.setsUnlocked = 0
	player.infinitied = 0
	player.infinitiedBank = 0
	player.bestInfinityTime = 9999999999
	player.thisInfinityTime = 0
	player.resets = 0
	player.tdBoosts = resetTDBoosts()
	player.tickspeedBoosts = inNGM(3) ? 16 : undefined
	player.galaxies = 0
	player.interval = null
	player.partInfinityPoint = 0
	player.partInfinitied = 0
	player.costMultipliers = [E(1e3), E(1e4), E(1e5), E(1e6), E(1e8), E(1e10), E(1e12), E(1e15)]
	player.tickspeedMultiplier = E(10)
	player.chall2Pow = 1
	player.chall3Pow = E(0.01)
	player.matter = E(0)
	player.chall11Pow = E(1)
	player.lastTenRuns = [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]]
	player.lastTenEternities = [[600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)], [600*60*24*31, E(0)]]
	player.infMult = E(1)
	player.infMultCost = E(10)
	player.tickSpeedMultDecrease = Math.max(player.tickSpeedMultDecrease, bm > 1 ? 1.25 : 2)
	player.postC4Tier = 1
	player.postC8Mult = E(1)
	player.overXGalaxiesTickspeedBoost = !inNGM(3) ? player.overXGalaxiesTickspeedBoost : 0
	player.postChallUnlocked = hasAch("r133") ? order.length : 0
	player.postC4Tier = 0
	player.postC3Reward = E(1)
	player.eternityPoints = E(0)
	player.eternities = bm ? 1e13 : 0
	player.eternitiesBank = 0
	player.thisEternity = 0
	player.bestEternity = 9999999999
	player.eternityUpgrades = bm ? [1, 2, 3, 4, 5, 6] : []
	player.epmult = E(1)
	player.epmultCost = E(500)
	player.infDimensionsUnlocked = resetInfDimUnlocked()
	player.infinityPower = E(1)
	/* function */ completelyResetInfinityDimensions()
	/* function */ completelyResetTimeDimensions()
	player.infDimBuyers = bm ? player.infDimBuyers : [false, false, false, false, false, false, false, false]
	player.timeShards = E(0)
	player.tickThreshold = E(1)
	player.totalTickGained = 0
	player.challengeTarget = 0
	player.replicanti = {
		amount: E(bm ? 1 : 0),
		unl: bm > 0,
		chance: 0.01,
		chanceCost: E(inNGM(2) ? 1e90 : 1e150),
		interval: 1000,
		intervalCost: E(inNGM(2) ? 1e80 : 1e140),
		gal: 0,
		galaxies: 0,
		galCost: E(inNGM(2) ? 1e110 : 1e170),
		galaxybuyer: player.replicanti.galaxybuyer,
		auto: bm ? player.replicanti.auto : [false, false, false]
	}
	player.timestudy = bm ? player.timestudy : {
		theorem: 0,
		amcost: E("1e20000"),
		ipcost: E(1),
		epcost: E(1),
		studies: [],
	}
	player.eternityChalls = bm ? player.eternityChalls : {}
	player.eternityChallGoal = E(Number.MAX_VALUE)
	player.currentEternityChall = ""
	player.etercreq = 0
	player.autoIP = E(0)
	player.autoTime = 1e300
	player.infMultBuyer = bm ? player.infMultBuyer : false
	player.autoEterMode = bm ? player.autoEterMode : "amount"
	player.peakSpent = 0
	player.respec = false
	player.respecMastery = false
	player.eternityBuyer = bm ? player.eternityBuyer : {
		limit: E(0),
		isOn: false,
		dilationMode: false,
		dilationPerAmount: player.eternityBuyer.dilationPerAmount,
	}
	player.eterc8ids = 50
	player.eterc8repl = 40
	player.dimlife = true
	player.dead = true
	player.dilation = {
		studies: bm ? player.dilation.studies : [],
		active: false,
		times: 0,
		tachyonParticles: ghSave.milestones > 15 ? player.dilation.bestTPOverGhostifies : E(0),
		dilatedTime: E(bm ? 1e100 : 0),
		bestTP: ghSave.milestones > 15 ? player.dilation.bestTPOverGhostifies : E(0),
		bestTPOverGhostifies: player.dilation.bestTPOverGhostifies,
		nextThreshold: E(1000),
		freeGalaxies: 0,
		upgrades: bm ? player.dilation.upgrades : [],
		autoUpgrades: bm ? player.dilation.autoUpgrades : aarMod.nguspV ? [] : undefined,
		rebuyables: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
		}
	}
	player.exdilation = player.exdilation != undefined ? {
		unspent: E(0),
		spent: {
			1: E(0),
			2: E(0),
			3: E(0),
			4: E(0)
		},
		times: 0
	} : player.exdilation
	player.blackhole = player.exdilation != undefined ? {
		unl: bm > 0,
		upgrades: {dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0},
		power: E(0)
	} : player.blackhole
	/*function */ doMetaDimensionsReset(false, false, 0) //meta dimboosts are set on the next line
	player.meta.resets = bm ? 4 : 0
	player.masterystudies = bm ? player.masterystudies : []
	quSave = getQuantumOnGhostifyData(bm, nBRU, nBEU)
	player.quantum = quSave
	nfSave = quSave.nanofield
	todSave = quSave.tod
	brSave = quSave.bigRip
	beSave = quSave.breakEternity
	player.old = false
	player.dontWant = true	
	player.unstableThisGhostify = 0
}

function doPreInfinityGhostifyResetStuff(implode){
	setInitialMoney()
	setInitialDimensionPower()
	GPminpeak = E(0)
	if (implode) showTab("dimensions")
	el("tickSpeed").style.visibility = "hidden"
	el("tickSpeedMax").style.visibility = "hidden"
	el("tickLabel").style.visibility = "hidden"
	el("tickSpeedAmount").style.visibility = "hidden"
	hideDimensions()
	tmp.tickUpdate = true
}

function doInfinityGhostifyResetStuff(implode, bm){
	if (hasAch("r85")) player.infMult = player.infMult.times(4)
	if (hasAch("r93")) player.infMult = player.infMult.times(4)
	if (hasAch("r104")) player.infinityPoints = E(2e25)
	player.challenges = challengesCompletedOnEternity()
	IPminpeak = E(0)
	if (isEmptiness) showTab("dimensions")
	el("infmultbuyer").textContent = "Max buy IP mult"
	if (implode) showChallengesTab("normalchallenges")
	updateChallenges()
	updateNCVisuals()
	updateAutobuyers()
	hideMaxIDButton()
	if (!bm) {
		ipMultPower = player.masterystudies.includes("t241") ? 2.2 : 2
		player.autobuyers[9].bulk = Math.ceil(player.autobuyers[9].bulk)
		el("bulkDimboost").value = player.autobuyers[9].bulk
		el("replicantidiv").style.display = "none"
		el("replicantiunlock").style.display = "inline-block"
		el("replicantiresettoggle").style.display = "none"
		delete player.replicanti.galaxybuyer
	}
	updateLastTenRuns()
	if ((el("metadimensions").style.display == "block" && !bm) || implode) showDimTab("antimatterdimensions")
	resetInfDimensions()
}

function doNGUpdateGhostifyResetStuff(){
	if (player.exdilation != undefined) {
		if (player.eternityUpgrades.length) for (var u = 7; u < 10; u++) player.eternityUpgrades.push(u)
		for (var d = 1; d < (aarMod.nguspV ? 9 : 5); d++) player["blackholeDimension" + d] = {
			cost: blackholeDimStartCosts[d],
			amount: E(0),
			power: E(1),
			bought: 0
		}
		if (speedrunMilestonesReached < 3) {
			el("blackholediv").style.display="none"
			el("blackholeunlock").style.display="inline-block"
		}
	}
}

function doTOUSOnGhostify(bm){
	if (hasAch("ng3p77")) { //thry of ultimate studies
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
	EPminpeak = E(0)
	if (bm) {
		if (player.eternityChallUnlocked > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.eternityChallUnlocked]
		else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.eternityChallUnlocked]
	} else performedTS = false
	player.eternityChallUnlocked = 0
	player.dilation.bestTP = player.dilation.tachyonParticles
	player.dilation.totalTachyonParticles = player.dilation.bestTP
	doNGUpdateGhostifyResetStuff()
	doTOUSOnGhostify(bm) //thry of ultimate studies
	el("eternitybtn").style.display = "none"
	el("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
	if (((el("masterystudies").style.display == "block" || el("breakEternity").style.display == "block") && !bm) || implode) showEternityTab("timestudies", el("eternitystore").style.display == "none")
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
		el("masterystudyunlock").style.display = "none"
		el('rebuyupgmax').style.display = ""
		el('rebuyupgauto').style.display = "none"
	}
	updateMasteryStudyCosts()
	updateMasteryStudyButtons()
}

function doQuantumGhostifyResetStuff(implode, bm){
	quSave.qcsMods.current = []
	quSave.replicants.amount = E(0)
	quSave.replicants.requirement = E("1e3000000")
	quSave.replicants.quarks = E(0)
	quSave.replicants.eggonProgress = E(0)
	quSave.replicants.eggons = E(0)
	quSave.replicants.babyProgress = E(0)
	quSave.replicants.babies = E(0)
	quSave.replicants.growupProgress = E(0)
	EDsave = quSave.emperorDimensions
	QKminpeak = E(0)
	QKminpeakValue = E(0)
	if (implode) showQuantumTab("uquarks")
	var permUnlocks = [7,9,10,10,11,11,12,12]
	for (var i = 1; i < 9; i++) {
		var num = bm >= permUnlocks[i - 1] ? 10 : 0
		EDsave[i] = {workers: E(num), progress: E(0), perm: num}
		if (num > 9) quSave.replicants.limitDim = i
	}
	if (bm > 6) {
		quSave.replicants.limit = 10
		quSave.replicants.limitCost = E_pow(200, quSave.replicants.limitDim * 9).times(1e49)
		quSave.replicants.quantumFoodCost = E_pow(5, quSave.replicants.limitDim * 30).times(2e46)
	}
	if (bm > 3) {
		var colors = ['r', 'g', 'b']
		for (var c = 0; c < 3; c++) todSave[colors[c]].upgrades[1] = 5
	}
	if (bm) for (var i = 1; i < 9; i++) quSave.challenges[i] = 2
	else {
		el('rebuyupgauto').style.display="none"
		el('toggleallmetadims').style.display="none"
		el('metaboostauto').style.display="none"
		el("autoBuyerQuantum").style.display="none"
		el('toggleautoquantummode').style.display="none"
	}
	if (!bm && !hasAch("ng3p77")) {
		el("electronstabbtn").style.display = "none"
		el("anttabs").style.display = "none"
		NF.shown()
		el("riptabbtn").style.display = "none"
	}
	el('bestTP').textContent = "Your best Tachyon particles in this Ghostify was " + shorten(player.dilation.bestTP) + "."
	updateLastTenQuantums()
	updateSpeedruns()
	updateColorCharge()
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
	GHPminpeak = E(0)
	GHPminpeakValue = E(0)
	el("ghostifybtn").style.display = "none"
	if (!ghostified) {
		ghostified = true
		ngp3_feature_notify("fu")
		el("ghostparticles").style.display = ""
		el("ghostifyConfirmBtn").style.display = "inline-block"
		giveAchievement("Kee-hee-hee!")
	} else if (ghSave.times > 2 && ghSave.times < 11) {
		$.notify("You unlocked " + (ghSave.times+2) + "th Neutrino upgrade!", "success")
		if (ghSave.times % 3 > 1) el("neutrinoUpg" + (ghSave.times + 2)).parentElement.parentElement.style.display = ""
		else el("neutrinoUpg" + (ghSave.times + 2)).style.display = ""
	}
	el("GHPAmount").textContent = shortenDimensions(ghSave.ghostParticles)
	if (bm < 7) {
		ghSave.neutrinos.electron = E(0)
		ghSave.neutrinos.mu = E(0)
		ghSave.neutrinos.tau = E(0)
		ghSave.neutrinos.generationGain = 1
	} else if (!force) ghSave.neutrinos.generationGain = ghSave.neutrinos.generationGain % 3 + 1
	ghSave.ghostlyPhotons.amount = E(0)
	ghSave.ghostlyPhotons.darkMatter = E(0)
	ghSave.ghostlyPhotons.ghostlyRays = E(0)
	tmp.bl.watt = 0
	ghSave.under = true
	updateLastTenGhostifies()
	updateBraveMilestones()
	if (!tmp.ngp3l) {
		ghSave.another = 10
		ghSave.reference = 10
	}
}
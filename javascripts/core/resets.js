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
				var name = dimTiers[d]
				player[name + "Amount"] = E(0)
				player[name + "Bought"] = 0
				player[name + "Cost"] = E(costs[d - 1])
				player.costMultipliers[d - 1] = E(costMults[d - 1])
			}
			player.totalBoughtDims = resetTotalBought()
		},
		startingTickspeed() {
			player.tickspeed = E(mod.ngep ? 500 : 1000)
			player.tickSpeedCost = E(1e3)
			player.tickspeedMultiplier = E(10)

			if (hasAch("r36")) player.tickspeed = player.tickspeed.mul(0.98);
			if (hasAch("r45")) player.tickspeed = player.tickspeed.mul(0.98);
			if (hasAch("r66")) player.tickspeed = player.tickspeed.mul(0.98);
			if (hasAch("r83")) player.tickspeed = player.tickspeed.mul(E_pow(0.95,player.galaxies));
			divideTickspeedIC5()
		},
		doReset(order) {
			let resetDims = !(order == "db" || order == "gal") || !postBoostMilestone()
			if (resetDims) {
				this.startingAM()
				this.startingDims()
				player.sacrificed = E(0)
				if (inNGM(2)) reduceDimCosts()
				if (inNGM(4)) resetNGM4TDs()
			}
			if (resetDims) resetPowers()
			this.startingTickspeed()
			setInitialDimensionPower()
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
		doReset(order) {
			player.tickBoughtThisInf = updateTBTIonGalaxy()

			if (order == "tdb" && (hasAch("r26") && player.resets >= player.tdBoosts)) return
			if (order == "tsb" && (hasAch("r27") && player.tickspeedBoosts < 5 * player.galaxies - 8)) return
			if (order == "gal" && hasAch("ng3p55")) return
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
		modReq: _ => inNGM(2),
		reached: _ => getGSAmount().gt(0) && !isEmptiness,
		got: _ => gSacrificed() && !isEmptiness,

		doReset() {
			player.galaxies = 0
			updateNCVisuals()
			if (inNGM(2)) {
				player.galacticSacrifice.time = 0
				GPminpeak = E(0)
			}
		}
	},
	inf: {
		modReq: _ => true,
		reached: _ => tmp.ri,
		got: _ => player.infinitied > 0 || eternitied(),

		doReset(order) {
			player.thisInfinityTime = 0
			IPminpeak = E(0)
			Marathon2 = 0

			if (inNGM(2)) player.galacticSacrifice = newGalacticDataOnInfinity(order != "inf")
			player.infinityPower = E(1)

			let keepRep = hasAch("r95")
			if (!keepRep) player.replicanti.amount = E(1)

			let keepRepGal = (order == "eter" && hasAch("ng3p67")) || (order == "inf" && speedrunMilestonesReached >= 28)
			if (!keepRepGal) player.replicanti.galaxies = (order == "inf" && hasTimeStudy(33)) ? Math.floor(player.replicanti.galaxies / 2) : 0

			if (isEmptiness) TAB_CORE.open("dim")
		}
	},
	eter: {
		modReq: _ => true,
		prequsite: _ => player.break,
		reached: _ => canEternity(),
		got: _ => eternitied(),

		doReset(order, auto) {
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
			if (hasAch("r85")) player.infMult = player.infMult.mul(4)
			if (hasAch("r93")) player.infMult = player.infMult.mul(4)
			el("infmultbuyer").style.display = mod.ngp3 || getEternitied() >= 1 ? "" : "none"

			if (!hasAch("r133")) player.postChallUnlocked = 0
			player.currentChallenge = ""
			player.challengeTarget = 0
			player.challenges = challengesCompletedOnEternity()

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

			completelyResetInfinityDimensions()

			if (getEternitied() < 7) player.autoSacrifice = 1
			player.postC4Tier = 1
			player.postC8Mult = E(1)

			if (getEternitied() < 50) {
				player.replicanti.amount = E(0)
				player.replicanti.unl = false
			} else if (order != "eter" || speedrunMilestonesReached < 24) {
				player.replicanti.amount = E(1)
			}
			if (order != "eter" || !hasAch("ng3p67")) {
				let keepPartial = mod.ngp3 && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 2e10
				player.replicanti.chance = keepPartial ? Math.min(player.replicanti.chance, 1) : 0.01
				player.replicanti.chanceCost = E_pow(1e15, player.replicanti.chance * 100).mul(inNGM(2) ? 1e75 : 1e135)
				player.replicanti.interval = keepPartial ? Math.max(player.replicanti.interval, hasTimeStudy(22) ? 1 : 50) : 1000
				player.replicanti.intervalCost = E_pow(1e10, Math.round(Math.log10(1000 / player.replicanti.interval) / -Math.log10(0.9))).mul(inNGM(2) ? 1e80 : 1e140)
				player.replicanti.gal = 0
				player.replicanti.galCost = E(inNGM(2) ? 1e110 : 1e170)
				player.replicanti.galaxies = 0
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
			if (mod.ngp3) {
				player.peakSpent = 0
				player.dontWant = true
			}

			if (!auto) {
				updateChallenges()
				updateAutobuyers()
				updateMilestones()
				hideMaxIDButton()
			}
			if (!canBreakInfinity()) player.break = false
		}
	}
}
let RESET_ORDER, RESET_INDEX

function setupResetData() {
	RESET_ORDER = Object.keys(RESETS)
	RESET_INDEX = {}
	for (var [i, r] of Object.entries(RESET_ORDER)) RESET_INDEX[r] = i
}

function doReset(order, auto) {
	let start = RESET_INDEX[order]
	for (var layer = start; layer >= 0; layer--) RESETS[RESET_ORDER[layer]].doReset(order, auto)
}

//OLD CODE
function duplicantsResetOnQuantum(qc) {
	let keepAnt = hasBraveMilestone(6) && !qc
	if (!keepAnt) {
		quSave.replicants.requirement = E("1e3000000")
		quSave.replicants.amount = E(0)
	}
	quSave.replicants.quarks = (!qc && hasAch("ng3p45")) ? quSave.replicants.quarks.pow(2/3) : E(0)
	quSave.replicants.eggonProgress = E(0)
	quSave.replicants.eggons = E(0)
	quSave.replicants.babyProgress = E(0)
	quSave.replicants.babies = E(0)
	quSave.replicants.growupProgress = E(0)
	for (let d = 1; d <= 8; d++) {
		if (d == 8 || EDsave[d].perm < 10) quSave.replicants.quantumFood += Math.round(EDsave[d].progress.toNumber() * 3) % 3
		if (d != 1 || !hasAch("ng3p46") || qc) {
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

function completelyResetInfinityDimensions() {
	const ID_COSTS = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280]
	for (var i = 1; i <= 8; i++) {
		player["infinityDimension" + i] = {
			cost: E(ID_COSTS[i]),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		}
	}
	resetInfDimUnlocked()
}

function resetInfDimUnlocked() {
	let data = []
	let value = getEternitied() >= 25 && hasAch("ng3p21")
	for (var d = 1; d <= 8; d++) data.push(value)
	player.infDimensionsUnlocked = data
}

function completelyResetTimeDimensions() {
	for (let dim = 1; dim <= 8; dim++) {
		player["timeDimension"+dim] = {
			cost: timeDimCost(dim, 0),
			power: E(1),
			bought: 0
		}
	}
}

//HTML
function updateResetTierButtons() {
	let unls = 0
	for (let [entry, data] of Object.entries(RESETS)) {
		let elm = el("layer_" + entry)
		if (!elm) continue

		let got = data.modReq() && data.got()
		let shown = got || (data.modReq() && (data.reached() || data.prequsite?.()))

		elm.style.display = shown ? "" : "none"
		if (shown) {
			elm.style.left = [85, 15, 50][unls % 3] + "%"
			elm.style.top = Math.floor(unls / 3) * 120 + "px"
			unls++
		}
	}

	let blockLen = Math.floor(unls / 3)
	el("block_header").style.display = blockLen ? "" : "none"
	el("block_header").style.height = (blockLen * 120) + "px"
	el("bigcrunch").parentElement.style.top = (blockLen * 120 + 19) + "px"

	if (!mod.ngpp) return

	let bigRip = bigRipped()
	el("quantumbtn").className = bigRip ? "bigrip" : "quantumbtn"
	el("quantumbtn").style.display = bigRip || isQuantumReached() ? "" : "none"

	el("bigripbtn").style.display = canBigRip() ? "" : "none"
	el("bigripbtn").innerHTML = (ghostified ? "" : "Show to the limitless! ") + "Big Rip the cosmos."
	el("ghostifybtn").style.display = bigRip && isQuantumReached() ? "" : "none"
	el("ghostparticles").style.display = ghostified ? "" : "none"
	if (ghostified) {
		el("GHPAmount").textContent = shortenDimensions(ghSave.ghostParticles)

		var showQuantumed = !hasBraveMilestone(16)
		el("quantumedBM").style.display = showQuantumed ? "" : "none"
		if (showQuantumed) el("quantumedBMAmount").textContent = getFullExpansion(quSave.times)
	}
}

const infinitied = x => player.infinitied > 0 || eternitied()
const eternitied = x => getEternitied() > 0 || quantumed
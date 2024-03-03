const MTS = MASTERY_STUDIES = {
	initCosts: {
		time: {241: 2e71, 251: 5e71, 252: 5e71, 253: 5e71, 261: 2e71, 262: 2e71, 263: 2e71, 264: 2e71, 265: 2e71, 266: 2e71, 271: 2.7434842249657063e76, 272: 2.7434842249657063e76, 273: 2.7434842249657063e76, 281: 6.858710562414266e76, 282: 6.858710562414266e76, 291: 2.143347050754458e77, 292: 2.143347050754458e77, 301: 8.573388203017832e77, 302: 2.6791838134430725e78, 303: 8.573388203017832e77, 311: 8.573388203017832e77, 312: 8.573388203017832e77, 321: 2.6791838134430727e76, 322: 9.324815538194444e77, 323: 2.6791838134430727e76, 331: 1.0172526041666666e79, 332: 1.0172526041666666e79, 341: 9.5367431640625e78, 342: 1.0172526041666666e79, 343: 1.0172526041666666e79, 344: 9.5367431640625e78, 351: 2.1192762586805557e79, 361: 1.5894571940104167e79, 362: 1.5894571940104167e79, 371: 2.1192762586805557e79, 372: 6.622738308376736e79, 373: 2.1192762586805557e79, 381: 6.622738308376736e79, 382: 6.622738308376736e79, 383: 6.622738308376736e79, 391: 8.27842288547092e79, 392: 8.27842288547092e79, 393: 8.27842288547092e79, 401: 4.967053731282552e80, 402: 8.278422885470921e80, 411: 1.3245476616753473e76, 412: 1.655684577094184e76, 421: 1.9868214925130208e77, 431: 1.1037897180627893e80},
		ec: {13: 1.7777777777777776e72, 14: 1.7777777777777776e72},
		dil: {},
	},
	costs: {
		time: {},
		time_mults: {241: 1, 251: 2.5, 252: 2.5, 253: 2.5, 261: 6, 262: 6, 263: 6, 264: 6, 265: 6, 266: 6, 271: 2, 272: 2, 273: 2, 281: 4, 282: 4, 291: 1, 292: 1, 301: 2, 302: 131072, 303: 2, 311: 64, 312: 64, 321: 2, 322: 2, 323: 2, 331: 2, 332: 2, 341: 1, 342: 1, 343: 1, 344: 1, 351: 4, 361: 1, 362: 1, 371: 2, 372: 2, 373: 2, 381: 1, 382: 1, 383: 2, 391: 1, 392: 1, 393: 1, 401: 1e5, 402: 1e5, 411: 1, 412: 1, 421: 1, 431: 1},
		ec: {},
		dil: {}
	},
	ecReqs: {
		13() {
			let comps = ECComps("eterc13")
			return 728e3 + (1500 + 3e3 * comps) * comps
		},
		14() {
			let comps = ECComps("eterc14")
			return 255e5 + (4e6 + 2e6 * comps) * comps
		}
	},
	ecReqsStored: {},
	ecReqDisplays: {
		13() {
			return getFullExpansion(MTS.ecReqsStored[13]) + " Dimension Boosts"
		},
		14() {
			return getFullExpansion(MTS.ecReqsStored[14]) + "% replicate chance"
		}
	},
	unlocked: [],
	unlockReqConditions: {
		7() {
			return quantumWorth.gte(50)
		},
		8() {
			return quSave.electrons.amount >= 16750 && speedrunMilestones >= 16
		},
		9() {
			return QCIntensity(8) >= 1
		},
		10() {
			return quSave.pairedChallenges.completed == 4
		},
		11() {
			return EDsave[1].perm == 10
		},
		12() {
			return EDsave[8].perm >= 10
		},
		13() {
			return nfSave.rewards >= 16
		},
		14() {
			return hasAch("ng3p34")
		}
	},
	unlockReqDisplays: {
		7() {
			return shortenDimensions(quantumWorth) + " / " + shortenDimensions(50) + " net Quarks"
		},
		8() {
			return getFullExpansion(quSave.electrons.amount) + " / " + getFullExpansion(16750) + " positrons and 5 minute Speedrun Milestone"
		},
		9() {
			return "Complete Quantum Challenge 8"
		},
		10() {
			return "Complete Paired Challenge 4"
		},
		11() {
			return getFullExpansion(EDsave[1].perm) + " / " + getFullExpansion(10) + " worker limit"
		},
		12() {
			return getFullExpansion(EDsave[8].perm) + " / " + getFullExpansion(10) + " Eighth Emperor Dimensions"
		},
		13() {
			return getFullExpansion(nfSave.rewards) + " / " + getFullExpansion(16) + " Nanorewards"
		},
		14() {
			return ghostified ? "<s>24 Paired Challenge combinations</s> Free!" : getFullExpansion(tmp.qu.chal?.pc_comp) + " / " + getFullExpansion(24) + " Paired Challenge combinations"
		}
	},
	types: {t: "time", ec: "ec", d: "dil"},
	timeStudyEffects: {
		251: () => Math.floor(player.resets / 3e3),
		252: () => Math.floor(player.dilation.freeGalaxies / 7),
		253: () => Math.floor(getTotalRG() / 4),
		262() {
			let r = Math.max(player.resets / 5e4 - 10, 1)

			exp = 2
			if (mod.ngep) exp *= 2
			return E_pow(r, exp)
		},
		263() {
			let x = player.meta.resets
			return Math.max(x * x / 10, 1)
		},
		264() {
			let r = player.galaxies / 100 + 1
			if (mod.ngep) return Math.pow(r, 2)
			return r
		},
		273(uses){
			var intensity = 5
			if (hasNB(2)) intensity += NT.eff("boost", 2, 0)
			if (uses.includes("intensity")) return intensity
			return Decimal.max(Math.log10(player.replicanti.chance + 1), 1).pow(intensity)
		},
		281: () => pow10(Math.pow(E(tmp.rep?.eff || 1).max(1).log10(), 0.25) / 10 * (mod.p3ep ? 2 : 1)),
		282: () => pow10(Math.pow(E(tmp.rep?.eff || 1).max(1).log10(), 0.25) / 15 * (mod.p3ep ? 2 : 1)),
		301() {
			if (hasNU(6)) return 0
			return Math.floor(tmp.rep.extra / 4.15)
		},
		303: () => E_pow(4.7, Math.pow(Math.log10(Math.max(player.galaxies, 1)), 1.5)),
		322() {
			let log = Math.sqrt(Math.max(3 - getTickspeed().log10(), 0)) / (isBreakUpgActive(8) ? 500 : 2e4)
			if (log > 110) log = Math.sqrt(log * 27.5) + 55
			return pow10(log)
		},
		332: () => Math.max(player.galaxies, 1),
		341() {
			var exp = Math.sqrt(quSave.replicants.quarks.add(1).log10())
			return E_pow(mod.p3ep ? 3 : 2, exp)
		},
		344: () => Math.pow(quSave.replicants.quarks.div(1e7).add(1).log10(), 0.25) * 0.17 + 1,
		351() { //maybe use softcap.js
			let log = player.timeShards.max(1).log10() * 14e-7
			if (log > 1e3) log = Math.sqrt(log * 1e3)
			return E_pow(mod.p3ep ? 12 : 10, log)
		},
		361: () => player.dilation.tachyonParticles.max(1).pow(0.015),
		371: () =>  Math.pow(tmp.rep.extra+1,mod.p3ep?.5:.3),
		372: () => Math.sqrt(player.timeShards.add(1).log10())/20+1,
		373: () => Math.pow(player.galaxies+1,0.55),
		381: () => Decimal.min(tmp.gal.ts, 1).log10() / -135 + 1,
		382: () => player.eightAmount.max(1).pow(Math.PI),
		383: () => E(tmp.qu.color_eff.b || 1).max(1).pow(.5),
		391: () => player.meta.antimatter.max(1).pow(8e-4),
		392: () => E_pow(mod.p3ep ? 1.7 : 1.6, Math.sqrt(quSave.replicants.quarks.add(1).log10())).add(1),
		393() {
			if (!tmp.qu.ant.workers) return E(1)
			return E_pow(4e5, Math.sqrt(tmp.qu.ant.workers.add(1).log10()))
		},
		401() {
			let log = quSave.replicants.quarks.div(1e28).add(1).log10() / 5
			return E_pow(mod.p3ep ? 12 : 10, log)
		},
		411() {
			if (!tmp.qu.ant.total) return E(1)
			var exp = tmp.qu.ant.total.div(1e22).add(1).log10() / 6
			if (mod.p3ep) exp += Math.pow((exp + 9) * 3, .2) * Math.log10(exp + 1)
			return pow10(exp)
		},
		421: () => pow10(Math.pow(-getTickspeed().log10() / 1e13 + 1, 1/3) - 1),
		431() {
			var gals = player.dilation.freeGalaxies
			var base = Math.max(gals / 5e3 - 1, 1)
			var exp = Math.max(gals / 1e4 + Math.log10(gals) / 4, 1)
			return E_pow(base, exp)
		}
	},
	timeStudyDescs: {
		241: "IP multiplier gives 2.2x per upgrade.",
		251: "Dimension Boosts scale Remote Galaxies later.",
		252: "Tachyonic Galaxies scale Remote Galaxies later.",
		253: "Replicated Galaxies scale Remote Galaxies later.",
		261: "Dimension Boosts scale by 1 less.",
		262: "Dimension Boosts boost Meta Dimensions.",
		263: "Meta-Dimension Boosts boost Dilated Time.",
		264: "Antimatter Galaxies boost Tachyon Particles.",
		265: "Replicate chance can go over 100%.",
		266: "Reduce the post-400 Replicated Galaxy scaling.",
		271: "Replicate interval can go below 1ms, but cost scales faster.",
		272: "You can buy all Time Studies in all 3-way splits.",
		273: "Replicate chance boosts itself.",
		281: "Replicanti multiplier boosts Dilated Time.",
		282: "Replicanti multiplier boosts Meta Dimensions.",
		291: "You gain 1% of your EP gained on Eternity Per second.",
		292: "Gain Tachyon Particles based on best antimatter in dilation.",
		301: "Extra Replicated Galaxies scale Remote Galaxies later.",
		302: "You can buy all Time Studies.",
		303: "Galaxies strengthen Meta Dimensions.",
		311: "Replicanti boost to all Infinity Dimensions is 17.3x stronger.",
		312: "Meta-dimension boosts are 4.5% stronger and cost scale by 1 less.",
		321: () => `Increase multiplier per 10 normal Dimensions to ${shortenCosts(E("1e430"))} if it is 1x.`,
		322: "Tickspeed boosts Dilated Time.",
		323: "Cancel dilation penalty for the Normal Dimension boost from replicanti.",
		331: "Dimension Supersonic scales 240,000 later, and the cost increase is reduced by 3.",
		332: "Gain replicanti faster based on your normal galaxies.",
		341: "Pilons boost dilated time production at reduced rate.",
		342: "All Replicated Galaxies are stronger and use the same formula.",
		343: "Tachyonic Galaxies are as strong as a normal Replicated Galaxy.",
		344: "Pilons strengthen Replicated Galaxies.",
		351: "Time Shards boost Meta Dimensions.",
		361: "Tachyon Particles speed up hatching.",
		362: () => "Reduce the softcap for the pilon boost"+(aarMod.ngumuV?", but reduce the efficiency.":"."),
		371: "Extra Replicated Galaxies speed up hatching.",
		372: "Tachyon Particles speed up hatching.",
		373: "Galaxies boost Pilons.",
		381: "Tickspeed reduction multiplier speeds up hatching.",
		382: "Eighth Dimensions boost Meta Dimensions.",
		383: "Blue power boosts Meta Dimensions.",
		391: "Meta-antimatter speeds up hatching.",
		392: "Pilons boost all Emperor Dimensions.",
		393: "Workers boost Meta Dimensions.",
		401: "Pilons reduce anti-Nanoenergy.",
		402: "Emperor Dimensions and hatch speed are 30x faster.",
		411: "Duplicants boost Nanoenergy.",
		412: "Further reduce the softcap of pilon boost.",
		421: "Tickspeed boosts Nanocharge.",
		431: "Tachyonic Galaxies speed up Branches."
	},
	hasStudyEffect: [251, 252, 253, 262, 263, 264, 273, 281, 282, 301, 303, 322, 332, 341, 344, 351, 361, 371, 372, 373, 381, 382, 383, 391, 392, 393, 401, 411, 421, 431],
	studyEffectDisplays: {
		251(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		252(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		253(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		273(x) {
			return "^" + shorten(x)
		},
		301(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		332(x) {
			return shortenDimensions(x) + "x"
		},
		344(x) {
			return (x * 100 - 100).toFixed(2) + "%"
		},
		431(x) {
			return shorten(x) + "x"
		}
	},
	ecsUpTo: 14,
	unlocksUpTo: 14,
	allConnections: {241: [251, 253, 252], 251: [261, 262], 252: [263, 264], 253: [265, 266], 261: ["ec13"], 262: ["ec13"], 263: ["ec13"], 264: ["ec14"], 265: ["ec14"], 266: ["ec14"], ec13: ["d7"], ec14: ["d7"], d7: [272], 271: [281], 272: [271, 273, 281, 282, "d8"], 273: [282], d8: ["d9"], d9: [291, 292, 302], 291: [301], 292: [303], 301: [311], 302: ["d10"], 303: [312], 311: [321], 312: [323], d10: [322], 322: [331, 332], 331: [342], 332: [343], 342: [341], 343: [344], 344: [351], 351: ["d11"], d11: [361, 362], 361: [371], 362: [373], 371: [372], 372: [381], 373: [382], 381: [391], 382: [383], 383: [393], 391: [392], 393: [392], 392: ["d12"], d12: [401, 402], 401: [411], 402: [412], 411: [421], 412: ["d13"], 421: ["d13"], d13: [431], 431: ["d14"]},
	allUnlocks: {
		d7() {
			return quantumed
		},
		322() {
			return hasMasteryStudy("d10") || ghostified
		},
		361() {
			return hasMasteryStudy("d11") || ghostified
		},
		r40() {
			return NF.unl() || ghostified
		},
		r43() {
			return hasMasteryStudy("d13") || ghostified
		}
	},

	unl: _ => mod.ngp3 && player.dilation.upgrades.includes("ngpp6"),
	respec(load, achCheck) {
		var keep = []
		player.timestudy.theorem += MTS.ttSpent
		for (var id of player.masterystudies) if (id[0] == "d") keep.push(id)

		if (player.masterystudies.length > keep.length) achCheck = false
		player.masterystudies = keep

		respecUnbuyableTimeStudies()
		updateMasteryStudyCosts()
		if (!hasGluonUpg("gb", 3)) ipMultPower = 2
		if (!load) {
			updateMasteryStudyButtons()
			drawMasteryTree()
		}

		if (!achCheck) delete quSave.wasted
		return achCheck
	}
}

function enterMasteryPortal() {
	if (!MTS.unl()) return
	recordUpDown(1)
	TAB_CORE.open("ts_master")
}

function exitMasteryPortal() {
	recordUpDown(2)
	TAB_CORE.open("ts")
}

function convertMasteryStudyIdToDisplay(x) {
	x = x.toString()
	var ec = x.split("ec")[1]
	var dil = x.split("d")[1]
	return ec ? "ec" + ec + "unl" : dil ? "dilstudy" + dil : "timestudy" + x
}

function updateMasteryStudyCosts() {
	var oldBought = MTS.bought
	MTS.latestBoughtRow = 0
	MTS.costMult = 1
	MTS.bought = 0
	MTS.ttSpent = 0
	for (let id of player.masterystudies) {
		var t = id.split("t")[1]
		if (t) {
			setMasteryStudyCost(t, "t")
			MTS.ttSpent += MTS.costs.time[t]
			MTS.costMult *= getMasteryStudyCostMult(t)
			MTS.latestBoughtRow = Math.max(MTS.latestBoughtRow,Math.floor(t/10))
			MTS.bought++
		}
	}
	for (let name of MTS.timeStudies) {
		if (!MTS.unlocked.includes(name)) break
		if (!hasMasteryStudy("t"+name)) setMasteryStudyCost(name,"t")
	}
	for (let id = 13; id <= MTS.ecsUpTo; id++) {
		if (!MTS.unlocked.includes("ec"+id)) break
		setMasteryStudyCost(id,"ec")
		MTS.ecReqsStored[id] = MTS.ecReqs[id]()
		if (player.eternityChallUnlocked == id) MTS.ttSpent += MTS.costs.ec[id]
	}
	for (let id = 7; id <= MTS.unlocksUpTo; id++) {
		if (!MTS.unlocked.includes("d"+id)) break
		setMasteryStudyCost(id,"d")
	}
	if (oldBought != MTS.bought) updateSpentableMasteryStudies()
	if (player.eternityChallUnlocked > 12) MTS.ttSpent += MTS.costs.ec[player.eternityChallUnlocked]
	updateMasteryStudyTextDisplay()
}

function setupMasteryStudies() {
	MTS.studies = [241]
	MTS.timeStudies = []
	var map = MTS.studies
	var part
	var pos = 0
	while (true) {
		var id = map[pos]
		if (!id) {
			if (!part) break
			map.push(part)
			id = part
			part = ""
		}
		if (typeof(id) == "number") MTS.timeStudies.push(id)
		var paths = getMasteryStudyConnections(id)
		if (paths !== undefined) for (var x = 0; x < paths.length; x++) {
			var y = paths[x]
			if (!map.includes(y)) {
				if (y.toString()[0] == "d") part = y
				else map.push(y)
			}
		}
		pos++
	}
}

function setupMasteryStudiesHTML() {
	setupMasteryStudies()
	for (id = 0; id < MTS.timeStudies.length; id++) {
		var name = MTS.timeStudies[id]
		var html = "<span id='ts" + name + "Desc'></span>"
		if (MTS.hasStudyEffect.includes(name)) html += "<br>Currently: <span id='ts" + name + "Current'></span>"
		html += "<br>Cost: <span id='ts" + name + "Cost'></span> Time Theorems"
		el("timestudy" + name).innerHTML = html
	}
}

function getMasteryStudyConnections(id) {
	return MTS.allConnections[id]
}

function updateUnlockedMasteryStudies() {
	var unl = true
	var rowNum = 0
	MTS.unlocked = []
	for (var x = 0; x < MTS.studies.length; x++) {
		var id = MTS.studies[x]
		var divid = convertMasteryStudyIdToDisplay(id)
		if (Math.floor(id / 10) > rowNum) {
			rowNum = Math.floor(id / 10)
			if (MTS.allUnlocks["r"+rowNum] && !MTS.allUnlocks["r"+rowNum]()) unl = false
			el(divid).parentElement.parentElement.parentElement.parentElement.style = unl ? "" : "display: none !important"
			if (unl) MTS.unlocked.push("r"+rowNum)
		} else if (divid[0] == "d") el(divid).parentElement.parentElement.parentElement.parentElement.style = unl ? "" : "display: none !important"
		if (MTS.allUnlocks[id]&&!MTS.allUnlocks[id]()) unl = false
		el(divid).style.visibility = unl ? "" : "hidden"
		if (unl) MTS.unlocked.push(id)
	}
}

function updateSpentableMasteryStudies() {
	MTS.spentable = []
	addSpentableMasteryStudies(241)
}

function addSpentableMasteryStudies(x) {
	var map = [x]
	var part
	var pos = 0
	while (true) {
		var id = map[pos]
		if (!id) break
		var isNum=typeof(id) == "number"
		var ecId = !isNum&&id.split("ec")[1]
		var canAdd = false
		if (ecId) canAdd = ECComps("eterc"+ecId)
		else canAdd = hasMasteryStudy(isNum?"t"+id:id)
		if (MTS.unlocked.includes(id) && !MTS.spentable.includes(id)) MTS.spentable.push(id)
		if (canAdd) {
			var paths = getMasteryStudyConnections(id)
			if (paths) for (var x=0;x<paths.length;x++) map.push(paths[x])
		}
		pos++
	}
}

function setMasteryStudyCost(id,type) {
	let d = MTS.initCosts
	let type2 = MTS.types[type]
	MTS.costs[type2][id] = (d[type2][id]||0) * (type == "d" ? 1 : MTS.costMult)
}

function getMasteryStudyCostMult(id) {
	return MTS.costs.time_mults[id] || 1
}

function buyingD7Changes(){
	TAB_CORE.open("pos")
}

function buyingDilStudyQC(){
	TAB_CORE.open("chal_qu")
	updateQuantumChallenges()
}

function buyingDilStudyReplicant(){
	TAB_CORE.open("ant")
	el("timestudy322").style.display=""
}

function buyingDilStudyED(){
	teleportToEDs()
	el("timestudy361").style.display = ""
	el("timestudy362").style.display = ""
}

function buyingDilStudyNanofield(){
	TAB_CORE.open("nf")
	NF.shown()
}

function buyingDilStudyToD(){
	TAB_CORE.open("tod")
}

function buyingDilStudyRip(){
	TAB_CORE.open("rip")
}

function buyingDilationStudy(id){
	if (id == 7) buyingD7Changes()
	if (id == 8) buyingDilStudyQC()
	if (id == 9) buyingDilStudyQC()
	if (id == 10) buyingDilStudyReplicant()
	if (id == 11) buyingDilStudyED()
	if (id == 12) buyingDilStudyNanofield()
	if (id == 13) buyingDilStudyToD()
	if (id == 14) buyingDilStudyRip()
}

function buyingDilationStudyFirstTime(id){
	if (id == 7) notifyFeature("pos")
	if (id == 8) notifyFeature("qc")
	if (id == 9) notifyFeature("pc")
	if (id == 10) notifyFeature("ant")
	if (id == 11) notifyFeature("ed")
	if (id == 12) notifyFeature("nf")
	if (id == 13) notifyFeature("decay")
	if (id == 14) notifyFeature("br")
}

function buyMasteryStudy(type, id, quick=false) {
	if (quick) setMasteryStudyCost(id, type)
	if (!canBuyMasteryStudy(type, id)) return
	player.timestudy.theorem -= MTS.costs[MTS.types[type]][id]
	if (type == 'ec') {
		player.eternityChallUnlocked = id
		player.etercreq = id
		updateEternityChallenges()
		delete quSave.autoECN
	} else player.masterystudies.push(type + id)
	if (type == "t") {
		addSpentableMasteryStudies(id)
		if (quick) {
			MTS.costMult *= getMasteryStudyCostMult(id)
			MTS.latestBoughtRow = Math.max(MTS.latestBoughtRow, Math.floor(id / 10))
		}
		if (id == 241 && !hasGluonUpg("gb", 3)) {
			var otherMults = 1
			if (hasAch("r85")) otherMults *= 4
			if (hasAch("r93")) otherMults *= 4
			var old = getIPMultPower()
			ipMultPower = 2.2
			player.infMult = player.infMult.div(otherMults).pow(Math.log10(getIPMultPower()) / Math.log10(old)).mul(otherMults)
		}
		if (id == 266 && player.replicanti.gal >= 400) {
			var gal = player.replicanti.gal
			player.replicanti.galCost = E(inNGM(2) ? 1e110 : 1e170)
			player.replicanti.galCost = getRGCost(gal)
		}
		if (id == 312) player.meta.resets = 4
		if (!hasNU(6) && (id == 251 || id == 252 || id == 253 || id == 301)) player.galaxies = 1
		if (!inQC(5) && (id == 261 || id == 331)) player.resets = 4
	}
	if (type=="d") {
		buyingDilationStudy(id)
		if (!ghostified) buyingDilationStudyFirstTime(id)

		updateUnlockedMasteryStudies()
		updateSpentableMasteryStudies()
	}
	if (!quick) {
		if (type == "t") {
			if (id == 302) fillAll()
			MTS.bought++
		}
		if (type == "ec") TAB_CORE.open('chal_eter')
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		drawMasteryTree()
	}
}

function canBuyMasteryStudy(type, id) {
	if (type == 't') {
		if (player.timestudy.theorem < MTS.costs.time[id] || hasMasteryStudy('t' + id) || player.eternityChallUnlocked > 12 || !MTS.timeStudies.includes(id)) return false
		if (player.eternityChallUnlocked > 12) return false
		if (MTS.latestBoughtRow > Math.floor(id / 10)) return false
		if (!MTS.spentable.includes(id)) return false
	} else if (type == 'd') {
		if (player.timestudy.theorem < MTS.costs.dil[id] || hasMasteryStudy('d' + id)) return false
		if (!hasBraveMilestone(3) && !MTS.unlockReqConditions[id]()) return false
		if (!MTS.spentable.includes("d" + id)) return false
	} else {
		if (player.timestudy.theorem < MTS.costs.ec[id]) return false
		if (player.eternityChallUnlocked) return false
		if (player.etercreq == id) return true
		if (id == 13) return player.resets >= MTS.ecReqsStored[13]
		return Math.round(player.replicanti.chance * 100) >= MTS.ecReqsStored[14]
	}
	return true
}

function hasMasteryStudy(x) {
	return mod.ngp3 && player.masterystudies.includes(x)
}
	
function updateMasteryStudyButtons() {
	if (!mod.ngp3) return
	for (id = 0; id < MTS.unlocked.length; id++) {
		var name = MTS.unlocked[id]
		if (name + 0 == name) {
			var className
			var type = name > 270 ? "quantum" : "mastery"
			var div = el("timestudy" + name)
			if (hasMasteryStudy("t" + name)) className = "timestudybought " + type
			else if (canBuyMasteryStudy('t', name)) className = "timestudy " + type
			else className = "timestudylocked"
			if (div.className !== className) div.className = className
			if (MTS.hasStudyEffect.includes(name)) {
				var mult = getMTSMult(name)
				el("ts" + name + "Current").textContent = (MTS.studyEffectDisplays[name] !== undefined ? MTS.studyEffectDisplays[name](mult) : shorten(mult) + "x")
			}
		}
	}
	for (id = 13; id <= MTS.ecsUpTo; id++) {
		var div = el("ec" + id + "unl")
		if (!MTS.unlocked.includes("ec" + id)) break
		if (player.eternityChallUnlocked == id) div.className = "eternitychallengestudybought"
		else if (canBuyMasteryStudy('ec', id)) div.className = "eternitychallengestudy"
		else div.className = "timestudylocked"
	}
	for (id = 7; id <= MTS.unlocksUpTo; id++) {
		var div = el("dilstudy" + id)
		if (!MTS.unlocked.includes("d" + id)) break
		if (hasMasteryStudy("d" + id)) div.className = "dilationupgbought"
		else if (canBuyMasteryStudy('d', id)) div.className = "dilationupg"
		else div.className = "timestudylocked"
	}
}

function updateMasteryStudyTextDisplay() {
	if (!mod.ngp3) return
	el("costmult").textContent = shorten(MTS.costMult)
	el("totalmsbought").textContent = MTS.bought
	el("totalttspent").textContent = shortenDimensions(MTS.ttSpent)
	for (id = 0; id < MTS.timeStudies.length; id++) {
		var name = MTS.timeStudies[id]
		if (!MTS.unlocked.includes(name)) break
		el("ts" + name + "Cost").textContent = shorten(MTS.costs.time[name])
	}
	for (id = 13; id <= MTS.ecsUpTo; id++) {
		if (!MTS.unlocked.includes("ec"+id)) break
		el("ec" + id + "Cost").textContent = "Cost: " + shorten(MTS.costs.ec[id]) + " Time Theorems"
		el("ec" + id + "Req").style.display = player.etercreq == id ? "none" : "block"
		el("ec" + id + "Req").textContent = "Requirement: " + MTS.ecReqDisplays[id]()
	}
	for (id = 7; id <= MTS.unlocksUpTo; id++) {
		el("ds" + id + "Req").innerHTML = hasBraveMilestone(3) ? "" : "Requirement: " + MTS.unlockReqDisplays[id]()
	}
}

function drawMasteryBranch(id1, id2) {
	var type1 = id1.split("ec")[1] ? "c" : id1.split("dil")[1] ? "d" : id1.split("time")[1] ? "t" : undefined
	var type2 = id2.split("ec")[1] ? "c" : id2.split("dil")[1] ? "d" : id2.split("time")[1] ? "t" : undefined
	var start = el(id1).getBoundingClientRect();
	var end = el(id2).getBoundingClientRect();
	var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth = 15;
	msctx.beginPath();
	var drawBoughtLine = true
	if (type1 == "t" || type1 == "d") drawBoughtLine = hasMasteryStudy(type1+id1.split("study")[1])
	if (type2 == "t" || type2 == "d") drawBoughtLine = drawBoughtLine && hasMasteryStudy(type2 + id2.split("study")[1])
	if (type2 == "c") drawBoughtLine = drawBoughtLine && player.eternityChallUnlocked == id2.slice(2,4)
	if (drawBoughtLine) {
		if (type2 == "d" && player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle = parseInt(id2.split("study")[1]) < 8 ? "#D2E500" : parseInt(id2.split("study")[1]) > 9 ? "#333333" : "#009900";
		} else if (type2 == "c") {
			msctx.strokeStyle = "#490066";
		} else {
			msctx.strokeStyle = "#000000";
		}
	} else if (type2 == "d" && player.options.theme == "Aarex's Modifications") {
		msctx.strokeStyle = parseInt(id2.split("study")[1]) < 8 ? "#697200" : parseInt(id2.split("study")[1]) > 11 ? "#727272" : parseInt(id2.split("study")[1]) > 9 ? "#262626" : "#006600";
	} else msctx.strokeStyle = "#444";
	msctx.moveTo(x1, y1);
	msctx.lineTo(x2, y2);
	msctx.stroke()
}

function drawMasteryTree() {
	msctx.clearRect(0, 0, msc.width, msc.height);
	if (!isTabShown("ts_master")) return

	drawMasteryBranch("back", "timestudy241")
	for (let id of MTS.unlocked) {
		let paths = getMasteryStudyConnections(id)
		if (!paths) continue
		for (let to of paths) {
			if (!MTS.unlocked.includes(to)) continue
			drawMasteryBranch(convertMasteryStudyIdToDisplay(id), convertMasteryStudyIdToDisplay(to))
		}
	}
	if (!shiftDown) return

	for (let id of MTS.unlocked) {
		if (id + 0 != id) continue
		let mult = getMasteryStudyCostMult(id)
		drawStudyHeader(msctx, convertMasteryStudyIdToDisplay(id), id + " (" + shorten(mult) + "x)")
	}
}

function getMasteryStudyMultiplier(id, uses = ""){
	return getMTSMult(id, uses)
}

function getMTSMult(id, uses = "") {
	return (!uses && tmp.mts[id]) ?? MTS.timeStudyEffects[id](uses)
}

function updateMasteryStudyTemp() {
	let studies = MTS.unlocked
	if (studies === undefined) return

	for (var study of studies) {
		if (MTS.hasStudyEffect.includes(study)) tmp.mts[study] = MTS.timeStudyEffects[study]("")
	}
}

var upDown = {
	point: 0,
	times: 0
}

function recordUpDown(x) {
	if (upDown.point>0&&upDown.point==x) return
	upDown.point=x
	upDown.times++
	if (upDown.times>=200) giveAchievement("Up and Down and Up and Down...")
}
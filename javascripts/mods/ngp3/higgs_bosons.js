function setupHiggsSave() {
	let data = {
		unl: false,
		higgs: 0,
		higgsUnspent: 0,
		particlesUnlocked: 0,
		field: {}
	}
	tmp.hb = data
	return data
}

function unlockHiggs() {
	if (tmp.ngp3l) return //higgs isnt a thing in legacy mode
	if (tmp.hb.unl) return
	if (!player.ghostify.wzb.unl) return
	if (!canUnlockHiggs()) return
	$.notify("Congratulations! You have unlocked Higgs Bosons!", "success")
	tmp.hb.unl = true
	updateHiggsUnlocks()
}

function canUnlockHiggs() {
	return player.money.gte(Decimal.pow(10, 2e17)) && tmp.bl.am.gte(getHiggsRequirement())
}

function updateHiggsUnlocks() {
	let unl = tmp.hb.unl
	let higgsGot = tmp.hb.higgs > 0
	document.getElementById("hbUnl").style.display = unl ? "none" : ""
	document.getElementById("bosonicResets").style.display = unl ? "" : "none"
	document.getElementById("hbMessage").style.display = unl && !higgsGot ? "" : "none"
	document.getElementById("bAMDimReturn").style.display = unl ? "" : "none"
	if (!unl) updateHiggsUnlockDisplay()
}

function updateHiggsUnlockDisplay() {
	document.getElementById("hbUnl").textContent = "To unlock Higgs Bosons, you need to get " + shortenCosts(Decimal.pow(10, 2e17)) + " antimatter and " + shortenCosts(getHiggsRequirement()) + " Bosonic Antimatter first."
}

function bosonicLabReset() {
	delete tmp.qu.nanofield.apgWoke
	player.ghostify.neutrinos.electron = new Decimal(0)
	player.ghostify.neutrinos.mu = new Decimal(0)
	player.ghostify.neutrinos.tau = new Decimal(0)
	player.ghostify.ghostlyPhotons.amount = new Decimal(0)
	player.ghostify.ghostlyPhotons.darkMatter = new Decimal(0)
	player.ghostify.ghostlyPhotons.ghostlyRays = new Decimal(0)
	player.ghostify.ghostlyPhotons.lights = [0,0,0,0,0,0,0,0]
	tmp.updateLights = true
	var startingEnchants = bEn.effects[14](tmp.bl.enchants[14] || 0, "bUpgs")
	tmp.bl = {
		watt: new Decimal(0),
		ticks: tmp.bl.ticks,
		speed: 0,
		am: new Decimal(0),
		typeToExtract: tmp.bl.typeToExtract,
		extracting: false,
		extractProgress: new Decimal(0),
		autoExtract: new Decimal(0),
		glyphs: [],
		enchants: {},
		usedEnchants: [],
		upgrades: [],
		battery: new Decimal(0),
		odSpeed: tmp.bl.odSpeed
	}
	var order = [11, 12, 13, 15, 14, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45]
	//tmp.bl.upgrades needs to be updated (also 12 needs to be added)
	for (let i = 0; i < startingEnchants; i++){
		if (i == 20) break
		tmp.bl.upgrades.push(order[i])
	}
	if (!tmp.bl.upgrades.includes(32) && player.achievements.includes("ng3p92")) tmp.bl.upgrades.push(32)
	for (var g = 1; g <= br.maxLimit; g++) tmp.bl.glyphs.push(new Decimal(0))
	player.ghostify.wzb = {
		unl: true,
		dP: new Decimal(0),
		dPUse: 0,
		wQkUp: true,
		wQkProgress: new Decimal(0),
		zNeGen: 1,
		zNeProgress: new Decimal(0),
		zNeReq: new Decimal(1),
		wpb: new Decimal(0),
		wnb: new Decimal(0),
		zb: new Decimal(0)
	}
	if (player.achievements.includes("ng3p92")) tmp.bl.upgrades.push(32)
	updateBosonicAMDimReturnsTemp()
	ghostify(false, true)
}

function higgsReset() {
	if (tmp.ngp3l) return
	var oldHiggs = tmp.hb.higgs
	if (!tmp.bl.am.gte(getHiggsRequirement())) return
	if (!player.aarexModifications.higgsNoConf && !confirm("You will exchange all your Bosonic Lab stuff for a Higgs Boson, but everything will also reset that Light Empowerments reset. Are you sure to proceed?")) return
	addHiggs(getHiggsGain())
	bosonicLabReset()
	giveAchievement("The Holy Particle")
	if (oldHiggs == 0) {
		updateNeutrinoBoosts()
		updateHiggsUnlocks()
		updateBosonicLimits()
		updateBosonicStuffCosts()
	}
	tmp.hb.bosonicSemipowerment = true
}

function restartHiggs() {
	if (!confirm("This resets everything that Higgs resets. You won't gain anything. Are you sure to proceed?")) return
	bosonicLabReset()
	tmp.hb.bosonicSemipowerment = true
}

function getHiggsRequirementBase() {
	var div = new Decimal(1)
	if (player.ghostify.wzb.usedEnchants.includes(14)) div = div.times(tmp.bEn[14] || 1)
	return new Decimal(1e20).divided(div)
}

function getHiggsRequirementMult() {
	return new Decimal(100)
}

function getHiggsRequirement(higgs) {
	if (higgs === undefined) higgs = tmp.hb.higgs
	let x = getHiggsRequirementMult().pow(higgs).times(getHiggsRequirementBase())
	return x
}

function getHiggsGain() {
	if (tmp.hb.higgs == 0) return 1
	return Math.round(tmp.bl.am.div(getHiggsRequirement()).floor().toNumber())
}

function addHiggs(x) {
	tmp.hb.higgs += x
	updateUnspentHiggs()
}

function updateUnspentHiggs() {
	tmp.hb.higgsUnspent = tmp.hb.higgs
}


function updateHiggsTemp() {
	updateBosonicFactorTemp()
}

function updateBosonicFactorTemp() {
	var data = {}
	tmp.hbTmp.bFact = data

	data.subFactA = tmp.bl.am.add(1).log10() + 1

	data.subFactE = 1
	if (tmp.bl.usedEnchants.includes(34)) data.subFactE = tmp.bEn[34]

	data.subFactZ = player.ghostify.wzb.zb.add(1).log10() + 1

	data.subFactH = tmp.hb.higgsUnspent / 20 + 1

	data.total = data.subFactA * data.subFactE * data.subFactZ * data.subFactH

	data.effect = Math.pow(data.total, 0.1)
}

function updateHiggsTab() {
	document.getElementById("bAMDimReturnPhrase1").textContent = tmp.bl.am.gte(tmp.badm.start) ? "started" : "will start"
	document.getElementById("bAMDimReturnStart").textContent = shorten(tmp.badm.start)
	document.getElementById("bAMDimReturnDivide").textContent = "Your Bosonic Antimatter production has been divided by " + shorten(tmp.badm.preDim) + " because of this!"
	document.getElementById("bAMDimReturnPhrase2").textContent = tmp.hb.higgs > 0 ? "But, you have the power to get more Higgs Bosons if you go very far." : "So, you have to get one."

	document.getElementById("hbUnspent").textContent = getFullExpansion(tmp.hb.higgsUnspent)

	document.getElementById("subFactorA").textContent = shorten(tmp.hbTmp.bFact.subFactA)
	document.getElementById("subFactorE").textContent = shorten(tmp.hbTmp.bFact.subFactE)
	document.getElementById("subFactorZ").textContent = shorten(tmp.hbTmp.bFact.subFactZ)
	document.getElementById("subFactorH").textContent = shorten(tmp.hbTmp.bFact.subFactH)
	document.getElementById("bosonicFactor").textContent = shorten(tmp.hbTmp.bFact.total)
	document.getElementById("bosonicFactorEffect").textContent = (tmp.hbTmp.bFact.effect * 100).toFixed(1)
}

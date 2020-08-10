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
	if (tmp.hb.unl) return
	if (!player.ghostify.wzb.unl) return
	if (canUnlockHiggs()) return
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
	player.ghostify.neutrinos.electron=new Decimal(0)
	player.ghostify.neutrinos.mu=new Decimal(0)
	player.ghostify.neutrinos.tau=new Decimal(0)
	player.ghostify.ghostlyPhotons.amount=new Decimal(0)
	player.ghostify.ghostlyPhotons.darkMatter=new Decimal(0)
	player.ghostify.ghostlyPhotons.ghostlyRays=new Decimal(0)
	player.ghostify.ghostlyPhotons.lights=[0,0,0,0,0,0,0,0]
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
	for (var g=1;g<=br.maxLimit;g++) tmp.bl.glyphs.push(new Decimal(0))
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
	ghostify(false, true)
}

function higgsReset() {
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

function getHiggsRequirementBase() {
	return new Decimal(1e20)
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

function updateHiggsTemp() {
	//empty
}

function addHiggs(x) {
	tmp.hb.higgs += x
	tmp.hb.higgsUnspent += x
}

function updateHiggsTab() {
	document.getElementById("bAMDimReturnPhrase1").textContent = tmp.bl.am.gte(tmp.badm.start) ? "started" : "will start"
	document.getElementById("bAMDimReturnStart").textContent = shorten(tmp.badm.start)
	document.getElementById("bAMDimReturnDivide").textContent = "Your Bosonic Antimatter production has been divided by " + shorten(tmp.badm.preDim) + " because of this!"
	document.getElementById("bAMDimReturnPhrase2").textContent = tmp.hb.higgs > 0 ? "But, you have the power to get more Higgs Bosons if you go very far." : "So, you have to get one."
}
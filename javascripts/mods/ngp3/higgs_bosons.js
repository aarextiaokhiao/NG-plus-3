function setupHiggsSave() {
	let data = {
		unl: false,
		higgs: 0
	}
	player.ghostify.hb = data
	return data
}

function unlockHiggs() {
	if (tmp.ngp3l) return //higgs isnt a thing in legacy mode
	if (player.ghostify.hb.unl) return
	if (!player.ghostify.wzb.unl) return
	if (!canUnlockHiggs()) return
	$.notify("Congratulations! You have unlocked Higgs Bosons!", "success")
	player.ghostify.hb.unl = true
	giveAchievement("The Holy Particle")
	updateHiggsUnlocks()
}

function canUnlockHiggs() {
	return player.money.gte(Decimal.pow(10, 2e17)) && player.ghostify.bl.am.gte(getHiggsRequirement()) && !tmp.ngp3l
}

function updateHiggsUnlocks() {
	let unl = player.ghostify.hb.unl
	document.getElementById("nextParticle").style.display = unl ? "none" : ""
	document.getElementById("bosonicResets").style.display = unl ? "" : "none"
	if (!unl) updateHiggsUnlockDisplay()
}

function updateHiggsUnlockDisplay() {
	document.getElementById("nextParticle").textContent = "To unlock the next particle (Higgs Bosons), you need to get " + shortenCosts(Decimal.pow(10, 2e17)) + " antimatter and " + shortenCosts(getHiggsRequirement()) + " Bosonic Antimatter first."
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
	var startingEnchants = tmp.bEn[14].bUpgs
	player.ghostify.bl = {
		watt: new Decimal(0),
		ticks: player.ghostify.bl.ticks,
		speed: 0,
		am: new Decimal(0),
		typeToExtract: player.ghostify.bl.typeToExtract,
		extracting: false,
		extractProgress: new Decimal(0),
		autoExtract: new Decimal(0),
		glyphs: [],
		enchants: {},
		usedEnchants: [],
		upgrades: [],
		battery: new Decimal(0),
		odSpeed: player.ghostify.bl.odSpeed
	}
	var order = [11, 12, 13, 15, 14, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45]
	//tmp.bl.upgrades needs to be updated (also 12 needs to be added)
	for (let i = 0; i < startingEnchants; i++){
		if (i == 20) break
		player.ghostify.bl.upgrades.push(order[i])
	}
	if (!player.ghostify.bl.upgrades.includes(32) && player.achievements.includes("ng3p92")) player.ghostify.bl.upgrades.push(32)
	for (var g = 1; g <= br.maxLimit; g++) player.ghostify.bl.glyphs.push(new Decimal(0))
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
	updateBosonicAMDimReturnsTemp()
	ghostify(false, true)
	matchTempPlayerHiggs()
}

function higgsReset() {
	if (tmp.ngp3l) return
	var oldHiggs = player.ghostify.hb.higgs
	if (!player.ghostify.bl.am.gte(getHiggsRequirement())) return
	if (!player.aarexModifications.higgsNoConf && !confirm("You will exchange all your Bosonic Lab stuff for Higgs Bosons. Everything that Light Empowerments resets initally will be reset. Are you ready to proceed?")) return
	addHiggs(getHiggsGain())
	bosonicLabReset()
	giveAchievement("The Holy Particle")
	if (oldHiggs == 0) {
		updateNeutrinoBoosts()
		updateHiggsUnlocks()
		updateBosonicLimits()
		updateBosonicStuffCosts()
	}
	player.ghostify.hb.bosonicSemipowerment = true
	matchTempPlayerHiggs()
}

function restartHiggs() {
	if (!confirm("Restarting will act as a Higgs reset, but you won't gain anything. Are you sure you want to restart?")) return
	bosonicLabReset()
	player.ghostify.hb.bosonicSemipowerment = true
	matchTempPlayerHiggs()
}

function getHiggsRequirementBase() {
	var div = new Decimal(1)
	if (player.ghostify.bl.usedEnchants.includes(14)) div = div.times(tmp.bEn[14].higgs || 1)
	return new Decimal(1e20).divide(div)
}

function getHiggsRequirementMult() {
	return new Decimal(100)
}

function getHiggsRequirement(higgs) {
	if (higgs === undefined) higgs = player.ghostify.hb.higgs
	let x = getHiggsRequirementMult().pow(higgs).times(getHiggsRequirementBase())
	return x
}

function getHiggsGain() {
	if (player.ghostify.hb.higgs == 0) return 1
	return Math.round(player.ghostify.bl.am.div(getHiggsRequirement()).floor().toNumber())
}

function addHiggs(x) {
	player.ghostify.hb.higgs += x
}

function matchTempPlayerHiggs(){
	tmp.hb = player.ghostify.hb
	tmp.bl = player.ghostify.bl
}
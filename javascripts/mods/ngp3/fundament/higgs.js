function setupHiggsSave() {
	let data = {
		unl: false,
		higgs: 0
	}
	ghSave.hb = data
	return data
}

function unlockHiggs() {
	if (ghSave.hb.unl) return
	if (!canUnlockHiggs()) return
	$.notify("Congratulations! You have unlocked Higgs!", "success")
	ghSave.hb.unl = true
	updateBLParticleUnlocks()
}

function canUnlockHiggs() {
	return player.money.gte(pow10(2e17)) && ghSave.bl.am.gte(getHiggsRequirement())
}

function updateBLParticleUnlocks() {
	el("bosonicResets").style.display = ghSave.hb.unl ? "" : "none"
	el("hftabbtn").style.display = ghSave.hb.higgs >= 60 ? "" : "none"
	updateBLParticleDisplay()
}

function updateBLParticleDisplay() {
	el("nextParticle").style.display = ""
	if (!ghSave.hb.unl) el("nextParticle").textContent = "To unlock Higgs, you need to get " + shortenCosts(pow10(2e17)) + " antimatter and " + shortenCosts(getHiggsRequirement()) + " Bosons first."
	else el("nextParticle").style.display = "none"
}

function bosonicLabReset() {
	ghSave.neutrinos.electron = E(0)
	ghSave.neutrinos.mu = E(0)
	ghSave.neutrinos.tau = E(0)
	ghSave.ghostlyPhotons.amount = E(0)
	ghSave.ghostlyPhotons.darkMatter = E(0)
	ghSave.ghostlyPhotons.ghostlyRays = E(0)
	ghSave.ghostlyPhotons.lights = [0,0,0,0,0,0,0,0]
	tmp.updateLights = true
	var startingEnchants = tmp.bEn[14] ? tmp.bEn[14].bUpgs : 0
	ghSave.bl = {
		watt: E(0),
		ticks: ghSave.bl.ticks,
		speed: 0,
		am: E(0),
		typeToExtract: ghSave.bl.typeToExtract,
		extracting: false,
		extractProgress: E(0),
		autoExtract: E(0),
		glyphs: [],
		enchants: {},
		usedEnchants: ghSave.bl.usedEnchants,
		upgrades: [],
		battery: E(0),
		odSpeed: ghSave.bl.odSpeed
	}
	if (hasAch("ng3p92")) {
		ghSave.bl.enchants[12] = E(1)
		if (!ghSave.bl.usedEnchants.includes(12)) ghSave.bl.usedEnchants.push(12)
	}

	var order = [11, 12, 13, 15, 14, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45]
	//tmp.bl.upgrades needs to be updated (also 12 needs to be added)
	for (let i = 0; i < startingEnchants; i++){
		if (i == 20) break
		ghSave.bl.upgrades.push(order[i])
	}
	if (!hasBU(32) && hasAch("ng3p92")) ghSave.bl.upgrades.push(32)
	for (var g = 1; g <= br.maxLimit; g++) ghSave.bl.glyphs.push(E(0))

	ghSave.wzb = {
		unl: true,
		dP: E(0),
		dPUse: 0,
		wQkUp: true,
		wQkProgress: E(0),
		zNeGen: 1,
		zNeProgress: E(0),
		zNeReq: E(1),
		wpb: E(0),
		wnb: E(0),
		zb: E(0)
	}
	ghostify(false, true)
	matchTempPlayerHiggs()
}

function higgsReset() {
	if (!hasAch("future")) {
		var oldHiggs = ghSave.hb.higgs
		if (!ghSave.bl.am.gte(getHiggsRequirement())) return
		if (!aarMod.higgsNoConf && !confirm("Everything that Spectral Ions resets, as well as Bosonic Lab.  Are you ready to proceed?")) return
	}
	addHiggs(getHiggsGain())
	if (!hasAch("future")) bosonicLabReset()
	if (oldHiggs == 0) {
		updateNeutrinoBoosts()
		updateBLParticleUnlocks()
		updateBosonicLimits()
		updateBosonicStuffCosts()
	}
	ghSave.hb.bosonicSemipowerment = true
	matchTempPlayerHiggs()
}

function getHiggsRequirementBase() {
	var div = E(1)
	if (ghSave.bl.usedEnchants.includes(14)) div = div.times(tmp.bEn[14].higgs || 1)
	if (hasAch("ng3p102")) div = div.times(100)
	return E(1e20).divide(div)
}

function getHiggsRequirementMult() {
	return E(100)
}

function getHiggsRequirement(higgs) {
	if (higgs === undefined) higgs = ghSave.hb.higgs
	let x = getHiggsRequirementMult().pow(higgs).times(getHiggsRequirementBase())
	return x
}

function getHiggsGain() {
	if (ghSave.hb.higgs == 0) return 1
	return Math.floor(Math.max(ghSave.bl.am.div(getHiggsRequirement()).log(100)+1,0))
}

function addHiggs(x) {
	ghSave.hb.higgs += x
}

function matchTempPlayerHiggs(){
	tmp.hb = ghSave.hb
	tmp.bl = ghSave.bl
}
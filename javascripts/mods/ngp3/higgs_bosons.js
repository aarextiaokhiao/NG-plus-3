function setupHiggsSave() {
	let data = {
		unl: false,
		higgs: 0
	}
	ghSave.hb = data
	return data
}

function unlockHiggs() {
	if (tmp.ngp3l) { // higgs isn't a thing in legacy mode
		return
	} 
	if (ghSave.hb.unl) return
	if (!ghSave.wzb.unl) return
	if (!canUnlockHiggs()) return
	$.notify("Congratulations! You have unlocked Higgs Bosons!", "success")
	ghSave.hb.unl = true
	updateHiggsUnlocks()
}

function canUnlockHiggs() {
	return player.money.gte(pow10(2e17)) && ghSave.bl.am.gte(getHiggsRequirement()) && !tmp.ngp3l
}

function updateHiggsUnlocks() {
	if (tmp.ngp3l) {
		document.getElementById("nextParticle").style.display = "none"
		document.getElementById("bosonicResets").style.display = "none"
		return
	}
	let unl = ghSave.hb.unl
	document.getElementById("nextParticle").style.display = unl ? "none" : ""
	document.getElementById("bosonicResets").style.display = unl ? "" : "none"
	if (!unl) updateHiggsUnlockDisplay()
}

function updateHiggsUnlockDisplay() {
	document.getElementById("nextParticle").textContent = "To unlock the next particle (Higgs Bosons), you need to get " + shortenCosts(pow10(2e17)) + " antimatter and " + shortenCosts(getHiggsRequirement()) + " Bosonic Antimatter first."
}

function bosonicLabReset() {
	delete nfSave.apgWoke
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
		usedEnchants: [],
		upgrades: [],
		battery: E(0),
		odSpeed: ghSave.bl.odSpeed
	}
	var order = [11, 12, 13, 15, 14, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45]
	//tmp.bl.upgrades needs to be updated (also 12 needs to be added)
	for (let i = 0; i < startingEnchants; i++){
		if (i == 20) break
		ghSave.bl.upgrades.push(order[i])
	}
	if (!ghSave.bl.upgrades.includes(32) && player.achievements.includes("ng3p92")) ghSave.bl.upgrades.push(32)
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
	updateBosonicAMDimReturnsTemp()
	ghostify(false, true)
	matchTempPlayerHiggs()
}

function higgsReset() {
	if (tmp.ngp3l) return
	if (!player.achievements.includes("ng3p102")) {
		var oldHiggs = ghSave.hb.higgs
		if (!ghSave.bl.am.gte(getHiggsRequirement())) return
		if (!aarMod.higgsNoConf && !confirm("You will exchange all your Bosonic Lab stuff for Higgs Bosons. Everything that Light Empowerments resets initally will be reset. Are you ready to proceed?")) return
	}
	addHiggs(getHiggsGain())
	if (!player.achievements.includes("ng3p102")) bosonicLabReset()
	if (oldHiggs == 0) {
			updateNeutrinoBoosts()
			updateHiggsUnlocks()
			updateBosonicLimits()
			updateBosonicStuffCosts()
		}
	ghSave.hb.bosonicSemipowerment = true
	matchTempPlayerHiggs()
}

function getHiggsRequirementBase() {
	var div = E(1)
	if (ghSave.bl.usedEnchants.includes(14)) div = div.times(tmp.bEn[14].higgs || 1)
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
	return Math.round(ghSave.bl.am.div(getHiggsRequirement()).floor().toNumber())
}

function addHiggs(x) {
	ghSave.hb.higgs += x
}

function matchTempPlayerHiggs(){
	tmp.hb = ghSave.hb
	tmp.bl = ghSave.bl
}
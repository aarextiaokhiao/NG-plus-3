function setupHiggsSave() {
	return {
		unl: false,
		higgs: 0
	}
}

function unlockHiggs() {
	ngp3_feature_notify("hb")
	ghSave.hb.unl = true
	updateBLParticleUnlocks()
}

function canUnlockHiggs() {
	return player.money.gte(pow10(2e17)) && ghSave.bl.am.gte(getHiggsRequirement())
}

function updateBLParticleUnlocks() {
	el("bosonicResets").style.display = ghSave.hb.unl ? "" : "none"
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

	var startingEnchants = tmp.bEn[14] ? tmp.bEn[14].bUpgs : 0

	ghSave.bl = getBrandNewBosonicLabData()
	ghSave.wzb = getBrandNewWZBosonsData()
	blSave = ghSave.bl

	if (hasAch("ng3p92")) {
		blSave.enchants[12] = E(1)
		if (!blSave.usedEnchants.includes(12)) blSave.usedEnchants.push(12)
	}

	var order = [11, 12, 13, 15, 14, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45]
	//blSave.upgrades needs to be updated (also 12 needs to be added)
	for (let i = 0; i < startingEnchants; i++){
		if (i == 20) break
		blSave.upgrades.push(order[i])
	}

	ghostify(false, true)
}

function higgsReset() {
	if (!hasAch("future")) {
		var oldHiggs = ghSave.hb.higgs
		if (!ghSave.bl.am.gte(getHiggsRequirement())) return
		if (!aarMod.higgsNoConf && !confirm("Everything that Spectral Ions resets, as well as Bosonic Lab. Are you ready to proceed?")) return
	}
	addHiggs(getHiggsGain())
	if (!hasAch("future")) bosonicLabReset()
	if (oldHiggs == 0) {
		updateNeutrinoBoosts()
		updateBLParticleUnlocks()
		updateBosonicLimits()
		updateBosonicStuffCosts()
	}
}

function getHiggsRequirementBase() {
	var div = E(1)
	if (ghSave.bl.usedEnchants.includes(14)) div = div.mul(tmp.bEn[14].higgs || 1)
	if (hasAch("ng3p102")) div = div.mul(100)
	return E(1e20).divide(div)
}

function getHiggsRequirementMult() {
	return E(100)
}

function getHiggsRequirement(higgs) {
	if (higgs === undefined) higgs = ghSave.hb.higgs
	let x = getHiggsRequirementMult().pow(higgs).mul(getHiggsRequirementBase())
	return x
}

function getHiggsGain() {
	if (ghSave.hb.higgs == 0) return 1
	return Math.floor(Math.max(ghSave.bl.am.div(getHiggsRequirement()).log(100)+1,0))
}

function addHiggs(x) {
	ghSave.hb.higgs += x
}
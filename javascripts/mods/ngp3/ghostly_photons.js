function updateLightEmpowermentReq() {
	tmp.leReq = getLightEmpowermentReq()
}

function getLightEmpowermentBoost() {
	let r = ghSave.ghostlyPhotons.enpowerments
	if (hasBU(13)) r *= tmp.blu[13]
	return r
}

var leBoosts = {
	reqs: [null, 1, 2, 3, 10, 13, 16, 19, 22, 25],
	max: 9,
	effects: [
		null,
		//Boost #1
		function() {
			var le1exp = 0.75
			if (tmp.ngp3l) le1exp = 1
			else if (tmp.newNGP3E) {
				le1exp += 0.2
				if (ghSave.ghostlyPhotons.unl) le1exp += .15
				if (ghSave.wzb.unl) le1exp += .15
			}
			var le1mult = 500
			if (tmp.ngp3l) le1mult = 300
			if (tmp.newNGP3E) le1mult *= 2
			var eff = Math.pow(Math.log10(tmp.effL[3] + 1), le1exp) * le1mult
			return eff
		},
		//Boost #2
		function() {
			return Math.log10(tmp.effL[4] * 10 + 1) / 4 + 1
		},
		//Boost #3
		function() {
			return Math.pow(tmp.effL[0].normal + 1, 0.1) * 2 - 1
		},
		//Boost #4
		function() {
			return tmp.leBonus[4]
		},
		//Boost #5
		function() {
			return {
				exp: 0.75 - 0.25 / Math.sqrt(tmp.leBoost / 200 + 1),
				mult: Math.pow(tmp.leBoost / 100 + 1, 1/3),
			}
		},
		//Boost #6
		function() {
			return Math.pow(3, Math.pow(tmp.effL[2] + 1, 0.25) - 1)
		},
		//Boost #7
		function() {
			return Math.pow(tmp.effL[5] / 150 + 1, 0.25)
		},
		//Boost #8
		function() {
			return Math.log10(tmp.effL[6] / 500 + 1) / 10 + 1
		},
		//Boost #9
		function() {
			return Math.pow(tmp.effL[1] / 10 + 1, 1/3) - 1
		},
	]
}

function isLEBoostUnlocked(x) {
	if (!tmp.ngp3) return false
	if (!ghostified) return false
	if (!ghSave.ghostlyPhotons.unl) return false
	if (x >= 4 && !hasBU(32)) return false
	return ghSave.ghostlyPhotons.enpowerments >= leBoosts.reqs[x]
}

function updateGPHUnlocks() {
	let unl = ghSave.ghostlyPhotons.unl
	el("gphUnl").style.display = unl ? "none" : ""
	el("gphDiv").style.display = unl ? "" : "none"
	el("gphRow").style.display = unl ? "" : "none"
	el("breakUpgR3").style.display = unl ? "" : "none"
	el("bltabbtn").style.display = unl ? "" : "none"
}

function getGPHProduction() {
	let b = brSave && brSave.active
	if (b) var ret = player.dilation.dilatedTime.div("1e475")
	else var ret = player.dilation.dilatedTime.div("1e900")
	if (ret.gt(1)) ret = ret.pow(b ? 0.02 : 0.025)
	return ret
}

function updatePhotonsTab(){
	updateRaysPhotonsDisplay()
	updateLightThresholdStrengthDisplay()
	updateLightBoostDisplay()
	updateLEmpowermentPrimary()
	updateLEmpowermentBoosts()
}

function updateRaysPhotonsDisplay(){
	var gphData = ghSave.ghostlyPhotons
	el("dtGPH").textContent = shorten(player.dilation.dilatedTime)
	el("gphProduction").textContent = shorten(getGPHProduction()) + (brSave.active ? " Hz" : "")
	el("gphProduction").className = (brSave.active ? "gph" : "dm") + "Amount"
	el("gphProductionType").textContent = brSave.active ? "frequency" : "Photons"
	el("gph").textContent = shortenMoney(gphData.amount) + " Hz"
	el("dm").textContent = shortenMoney(gphData.darkMatter)
	el("ghrProduction").textContent = shortenMoney(getGHRProduction())
	el("ghrCap").textContent = shortenMoney(getGHRCap())
	el("ghr").textContent = shortenMoney(gphData.ghostlyRays)
}

function updateLightBoostDisplay(){
	var gphData = ghSave.ghostlyPhotons
	el("lightMax1").textContent = getFullExpansion(gphData.maxRed)
	el("lightBoost1").textContent = tmp.le[0].toFixed(3)
	el("lightBoost2").textContent = tmp.le[1].toFixed(2)
	el("lightBoost3").textContent = getFullExpansion(Math.floor(tmp.le[2]))
	el("lightBoost4").textContent = (tmp.le[3] * 100 - 100).toFixed(1)
	el("lightBoost5").textContent = (tmp.le[4] * 100).toFixed(1) + (hasBU(11) ? "+" + (tmp.blu[11] * 100).toFixed(1) : "")
	el("lightBoost6").textContent = shorten(tmp.le[5])
	el("lightBoost7").textContent = shorten(tmp.le[6])
}

function updateLightThresholdStrengthDisplay(){
	var gphData=ghSave.ghostlyPhotons
	for (var c = 0; c < 8; c++) {
		el("light" + (c + 1)).textContent = getFullExpansion(gphData.lights[c])+(tmp.free_lights>0?" + "+getFullExpansion(tmp.free_lights):"")
		el("lightThreshold" + (c + 1)).textContent = shorten(getLightThreshold(c))
		if (c > 0) el("lightStrength" + c).textContent = shorten(tmp.ls[c-1])
	}
}

function updateLEmpowermentPrimary(){
	var gphData = ghSave.ghostlyPhotons
	el("lightEmpowerment").className = "gluonupgrade "+(gphData.lights[7] >= tmp.leReq ? "gph" : "unavailablebtn")
	el("lightEmpowermentDesc").textContent = hasAch("ng3p101") ? "+1 Spectral Ion" : "Reset Photons for +1 Spectral Ion"
	el("lightEmpowermentReq").textContent = getFullExpansion(tmp.leReq)
	el("lightEmpowerments").textContent = getFullExpansion(gphData.enpowerments)
	el("lightEmpowermentScaling").textContent = getGalaxyScaleName(tmp.leReqScale) + "Spectral Ions"
	el("lightEmpowermentsEffect").textContent = shorten(tmp.leBoost)
}

function updateLEmpowermentBoosts(){
	var boosts = 0
	for (var e = 1; e <= leBoosts.max; e++) {
		var unlocked = isLEBoostUnlocked(e)
		if (unlocked) boosts++
		el("le"+e).style.visibility = unlocked ? "visible" : "hidden"
	}
	if (boosts >= 1) {
		el("leBoost1").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].effect))
		el("leBoost1Total").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].total))
	}
	if (boosts >= 2) el("leBoost2").textContent = (tmp.leBonus[2] * 100 - 100).toFixed(1)
	if (boosts >= 3) el("leBoost3").textContent = tmp.leBonus[3].toFixed(2)
	if (boosts >= 5) el("leBoost5").textContent = "(" + shorten(tmp.leBonus[5].mult) + "x+1)^" + tmp.leBonus[5].exp.toFixed(3)
	if (boosts >= 6) el("leBoost6").textContent = shorten(tmp.leBonus[6])
	if (boosts >= 7) el("leBoost7").textContent = (tmp.leBonus[7] * 100).toFixed(1)
	if (boosts >= 8) el("leBoost8").textContent = (tmp.leBonus[8] * 100).toFixed(1)
	if (boosts >= 9) el("leBoost9").textContent = tmp.leBonus[9].toFixed(2)
}

function getGHRProduction() {
	var log = ghSave.ghostlyPhotons.amount.sqrt().div(2).log10()
	if (ghSave.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	return pow10(log).mul(Math.max(log+1,1))
}

function getGHRCap() {
	var log = ghSave.ghostlyPhotons.darkMatter.pow(0.4).times(1e3).log10()
	if (ghSave.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	return pow10(log)
}

function getLightThreshold(l) {
	let x = E_pow(getLightThresholdIncrease(l), ghSave.ghostlyPhotons.lights[l]).times(tmp.lt[l])
	return x
}

function getLightThresholdIncrease(l) {
	let x = tmp.lti[l]
	if (isNanoEffectUsed("light_threshold_speed")) {
		let y = 1 / tmp.nf.effects.light_threshold_speed
		if (y < 1) x = Math.pow(x, y)
	}
	return x
}

function lightEmpowerment(auto=false) {
	if (!(ghSave.ghostlyPhotons.lights[7] >= tmp.leReq)) return
	if (!hasAch("ng3p101") && !auto) {
		if (!aarMod.leNoConf && !confirm("You will fundament, but Photons will be reset. You will gain 1 Spectral Ion from this. Are you sure you want to proceed?")) return
		if (!ghSave.ghostlyPhotons.enpowerments) el("leConfirmBtn").style.display = "inline-block"
	}
	ghSave.ghostlyPhotons.enpowerments++
	if (hasAch("ng3p101")) return
	ghostify(false, true)
	if (!hasAch("ng3p91")) resetLights()
}

function resetLights() {
	ghSave.ghostlyPhotons.amount = E(0)
	ghSave.ghostlyPhotons.darkMatter = E(0)
	ghSave.ghostlyPhotons.ghostlyRays = E(0)
	ghSave.ghostlyPhotons.lights = [0,0,0,0,0,0,0,0]
}

function getLightEmpowermentReq(le) {
	if (le === undefined) le = ghSave.ghostlyPhotons.enpowerments
	let x = le * 2.4 + 1
	let scale = 0
	if (le > 19) {
		x += Math.pow(le - 19, 2) / 3
		scale = 1
	}
	if (hasAch("ng3p95")) x--
	tmp.leReqScale = scale
	return Math.floor(x)
}

function updateLightEmpowermentReq() {
	tmp.leReq = getLightEmpowermentReq()
}

function getLightEmpowermentBoost() {
	let r = ghSave.ghostlyPhotons.enpowerments
	if (hasBosonicUpg(13)) r *= tmp.blu[13]
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
			return Math.pow(tmp.effL[6] / 500 + 1, 0.125)
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
	if (x >= 4 && !hasBosonicUpg(32)) return false
	return ghSave.ghostlyPhotons.enpowerments >= leBoosts.reqs[x]
}

function updateGPHUnlocks() {
	let unl = ghSave.ghostlyPhotons.unl
	document.getElementById("gphUnl").style.display = unl ? "none" : ""
	document.getElementById("gphDiv").style.display = unl ? "" : "none"
	document.getElementById("gphRow").style.display = unl ? "" : "none"
	document.getElementById("breakUpgR3").style.display = unl ? "" : "none"
	document.getElementById("bltabbtn").style.display = unl ? "" : "none"
}

function getGPHProduction() {
	let b = brSave && brSave.active
	if (b) var ret = player.dilation.dilatedTime.div("1e480")
	else var ret = player.dilation.dilatedTime.div("1e930")
	if (ret.gt(1)) ret = ret.pow(0.02)
	if (b && ret.gt(pow2(444))) ret = ret.div(pow2(444)).sqrt().times(pow2(444))
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
	document.getElementById("dtGPH").textContent = shorten(player.dilation.dilatedTime)
	document.getElementById("gphProduction").textContent = shorten(getGPHProduction())
	document.getElementById("gphProduction").className = (brSave.active ? "gph" : "dm") + "Amount"
	document.getElementById("gphProductionType").textContent = brSave && brSave.active ? "Ghostly Photons" : "Dark Matter"
	document.getElementById("gph").textContent = shortenMoney(gphData.amount)
	document.getElementById("dm").textContent = shortenMoney(gphData.darkMatter)
	document.getElementById("ghrProduction").textContent = shortenMoney(getGHRProduction())
	document.getElementById("ghrCap").textContent = shortenMoney(getGHRCap())
	document.getElementById("ghr").textContent = shortenMoney(gphData.ghostlyRays)
}

function updateLightBoostDisplay(){
	var gphData = ghSave.ghostlyPhotons
	document.getElementById("lightMax1").textContent = getFullExpansion(gphData.maxRed)
	document.getElementById("lightBoost1").textContent = tmp.le[0].toFixed(3)
	document.getElementById("lightBoost2").textContent = tmp.le[1].toFixed(2)
	document.getElementById("lightBoost3").textContent = getFullExpansion(Math.floor(tmp.le[2]))
	document.getElementById("lightBoost4").textContent = (tmp.le[3] * 100 - 100).toFixed(1)
	document.getElementById("lightBoost5").textContent = (tmp.le[4] * 100).toFixed(1) + (hasBosonicUpg(11) ? "+" + (tmp.blu[11] * 100).toFixed(1) : "")
	document.getElementById("lightBoost6").textContent = shorten(tmp.le[5])
	document.getElementById("lightBoost7").textContent = shorten(tmp.le[6])
}

function updateLightThresholdStrengthDisplay(){
	var gphData=ghSave.ghostlyPhotons
	for (var c = 0; c < 8; c++) {
		document.getElementById("light" + (c + 1)).textContent = getFullExpansion(gphData.lights[c])+(tmp.free_lights>0?" + "+getFullExpansion(tmp.free_lights):"")
		document.getElementById("lightThreshold" + (c + 1)).textContent = shorten(getLightThreshold(c))
		if (c > 0) document.getElementById("lightStrength" + c).textContent = shorten(tmp.ls[c-1])
	}
}

function updateLEmpowermentPrimary(){
	var gphData = ghSave.ghostlyPhotons
	document.getElementById("lightEmpowerment").className = "gluonupgrade "+(gphData.lights[7] >= tmp.leReq ? "gph" : "unavailablebtn")
	document.getElementById("lightEmpowermentDesc").textContent = player.achievements.includes("ng3p101") ? "+1 Light Empowerment" : "Gain 1 Light Empowerment, but become a ghost and reset this mechanic."
	document.getElementById("lightEmpowermentReq").textContent = getFullExpansion(tmp.leReq)
	document.getElementById("lightEmpowerments").textContent = getFullExpansion(gphData.enpowerments)
	document.getElementById("lightEmpowermentScaling").textContent = getGalaxyScaleName(tmp.leReqScale) + "Light Empowerments"
	document.getElementById("lightEmpowermentsEffect").textContent = shorten(tmp.leBoost)
}

function updateLEmpowermentBoosts(){
	var boosts = 0
	for (var e = 1; e <= leBoosts.max; e++) {
		var unlocked = isLEBoostUnlocked(e)
		if (unlocked) boosts++
		document.getElementById("le"+e).style.visibility = unlocked ? "visible" : "hidden"
	}
	if (boosts >= 1) {
		document.getElementById("leBoost1").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].effect))
		document.getElementById("leBoost1Total").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].total))
	}
	if (boosts >= 2) document.getElementById("leBoost2").textContent = (tmp.leBonus[2] * 100 - 100).toFixed(1)
	if (boosts >= 3) document.getElementById("leBoost3").textContent = tmp.leBonus[3].toFixed(2)
	if (boosts >= 5) document.getElementById("leBoost5").textContent = "(" + shorten(tmp.leBonus[5].mult) + "x+1)^" + tmp.leBonus[5].exp.toFixed(3)
	if (boosts >= 6) document.getElementById("leBoost6").textContent = shorten(tmp.leBonus[6])
	if (boosts >= 7) document.getElementById("leBoost7").textContent = (tmp.leBonus[7] * 100).toFixed(1)
	if (boosts >= 8) document.getElementById("leBoost8").textContent = (tmp.leBonus[8] * 100).toFixed(1)
	if (boosts >= 9) document.getElementById("leBoost9").textContent = tmp.leBonus[9].toFixed(2)
}

function getGHRProduction() {
	var log = ghSave.ghostlyPhotons.amount.sqrt().div(2).log10()
	if (ghSave.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	return pow10(log)
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
	if (!player.achievements.includes("ng3p101") && !auto) {
		if (!aarMod.leNoConf && !confirm("You will become a ghost, but Ghostly Photons will be reset. You will gain 1 Light Empowerment from this. Are you sure you want to proceed?")) return
		if (!ghSave.ghostlyPhotons.enpowerments) document.getElementById("leConfirmBtn").style.display = "inline-block"
	}
	ghSave.ghostlyPhotons.enpowerments++
	if (player.achievements.includes("ng3p101")) return
	ghostify(false, true)
	if (player.achievements.includes("ng3p91")) return
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
		x += Math.pow(le - 19, 2*(hasBosonicUpg(51)?0.85:1)) / 3
		scale = 1
	}
	if (player.achievements.includes("ng3p95")) x--
	tmp.leReqScale = scale
	return Math.floor(x)
}

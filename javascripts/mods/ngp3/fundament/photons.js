function updateRedLightBoostTemp(){
	var light0multiplier = tmp.newNGP3E ? .1 : .07
	var lighteffect0 = Math.log2(tmp.effL[0].best + 1) * light0multiplier + 1
	tmp.le[0] = lighteffect0
}

function updateOrangeLightBoostTemp(){
	tmp.le[1] = Math.pow(Math.log10(tmp.effL[1] + 1) + 1, 1.5)
}

function updateYellowLightBoostTemp(){
	var lighteffect2 = 0 // changed later no matter what
	tmp.le[2] = Math.cbrt(tmp.effL[2]) * 2e4
}

function updateGreenLightBoostTemp(){
	var lighteffect3 = 1
	tmp.le[3] = Math.log2(tmp.effL[3] + 1) / 5 + 1
}

function updateBlueLightBoostTemp(){
	var light4mult = tmp.newNGP3E ? 1.3 : 5/4
	var lighteffect4 = Math.log10(Math.sqrt(tmp.effL[4] * 2) + 1) * light4mult + 1
	tmp.le[4] = lighteffect4
}

function updateIndigoLightBoostTemp(){
	tmp.le[5] = E(1)
}

function updateVioletLightBoostTemp(){
	var lightexp6 = tmp.newNGP3E ? .36 : 1/3
	var loglighteffect6 = Math.pow(player.postC3Reward.log10() * tmp.effL[6], lightexp6) * 2 
	if (loglighteffect6 > 15e3) loglighteffect6 = 15e3 * Math.pow(loglighteffect6 / 15e3, .6)
	tmp.le[6] = pow10(loglighteffect6)
}

function updateEffectiveLightAmountsTemp(){
	let leBonus5Unl = isLEBoostUnlocked(5)
	for (var c = 7; c >= 0; c--) {
		var x = ghSave.ghostlyPhotons.lights[c]+tmp.free_lights
		var y = tmp.leBoost
		if ((c == 6 && !isLEBoostUnlocked(4)) || c == 7) y += 1
		else if (leBonus5Unl) y += Math.pow(tmp.effL[c + 1] * tmp.leBonus[5].mult + 1, tmp.leBonus[5].exp)
		else y += Math.sqrt(tmp.effL[c + 1] / 2 + 1)
		tmp.ls[c] = y
		if (c == 0) {
			tmp.effL[0] = {
				normal: x * y, // Without best red Light
				best: (ghSave.ghostlyPhotons.maxRed + x * 2) / 3 * y //With best red Light
			}
		} else tmp.effL[c] = x * y
	}
	tmp.leBonus[4] = tmp.ls[6]
}

function updateFixedLightTemp() {
	if (isLEBoostUnlocked(5)) tmp.leBonus[5] = leBoosts.effects[5]()
	updateLightEmpowermentReq()
	updateEffectiveLightAmountsTemp()
	updateRedLightBoostTemp()
	updateOrangeLightBoostTemp()
	updateYellowLightBoostTemp()
	updateGreenLightBoostTemp()
	updateBlueLightBoostTemp()
	updateVioletLightBoostTemp()
	if (isLEBoostUnlocked(1)) tmp.leBonus[1] = {effect: leBoosts.effects[1]()}
	for (var b = 2; b <= leBoosts.max; b++) {
		if (!isLEBoostUnlocked(b)) break
		if (b != 4 && b != 5) {
			tmp.leBonus[b] = leBoosts.effects[b]()
			if (b == 8) tmp.apgw += Math.floor(tmp.leBonus[9])
		}
	}
}

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
	if (b) var ret = player.dilation.dilatedTime.div("1e480")
	else var ret = player.dilation.dilatedTime.div("1e900")
	if (ret.gt(1)) ret = ret.pow(b ? 0.013 : 0.025)
	if (hasAch("ng3p72")) ret = ret.mul(2)
	if (hasNU(14)) ret = ret.mul(tmp.nu[5])
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
	el("ghrProduction").textContent = shortenMoney(getWVProduction())
	el("ghrCap").textContent = shortenMoney(getWVCap())
	el("ghr").textContent = shortenMoney(gphData.ghostlyRays)
}

function updateLightBoostDisplay(){
	var gphData = ghSave.ghostlyPhotons
	el("lightMax1").textContent = getFullExpansion(gphData.maxRed)
	el("lightBoost1").textContent = tmp.le[0].toFixed(3)
	el("lightBoost2").textContent = tmp.le[1].toFixed(2)
	el("lightBoost3").textContent = getFullExpansion(Math.floor(tmp.le[2]))
	el("lightBoost4").textContent = "+"+(tmp.le[3] * 100 - 100).toFixed(1)+"%"
	el("lightBoost5").textContent = shorten(tmp.le[4])
	el("lightBoost6").textContent = shorten(tmp.le[5])
	el("lightBoost7").textContent = shorten(tmp.le[6])
}

function updateLightThresholdStrengthDisplay(){
	var gphData=ghSave.ghostlyPhotons
	for (var c = 0; c < 8; c++) {
		el("light" + (c + 1)).textContent = getFullExpansion(gphData.lights[c])+(tmp.free_lights>0?" + "+getFullExpansion(tmp.free_lights):"")
		el("lightThreshold" + (c + 1)).textContent = shorten(getLightThreshold(c))
		if (c > 0) el("lightStrength" + c).textContent = "("+shorten(tmp.ls[c-1])+"x)"
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
	if (boosts >= 1) el("leBoost1").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].total))
	if (boosts >= 2) el("leBoost2").textContent = (tmp.leBonus[2] * 100 - 100).toFixed(1)
	if (boosts >= 3) el("leBoost3").textContent = tmp.leBonus[3].toFixed(2)
	if (boosts >= 5) el("leBoost5").textContent = "(" + shorten(tmp.leBonus[5].mult) + "x+1)^" + tmp.leBonus[5].exp.toFixed(3)
	if (boosts >= 6) el("leBoost6").textContent = shorten(tmp.leBonus[6])
	if (boosts >= 7) el("leBoost7").textContent = (tmp.leBonus[7] * 100).toFixed(1)
	if (boosts >= 8) el("leBoost8").textContent = (tmp.leBonus[8] * 100).toFixed(1)
	if (boosts >= 9) el("leBoost9").textContent = tmp.leBonus[9].toFixed(2)
}

function getWVProduction() {
	var log = ghSave.ghostlyPhotons.amount.cbrt().div(2).log10()
	if (ghSave.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	if (hasAch("ng3p72")) log += Math.log10(2)
	if (hasNU(14)) log += tmp.nu[5].log10()
	return pow10(log)
}

function getWVCap() {
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

function ghostlyPhotonsUpdating(diff){
	var data = ghSave.ghostlyPhotons
	var type = brSave && brSave.active ? "amount" : "darkMatter"
	data[type] = data[type].add(getGPHProduction().times(diff))
	data.ghostlyRays = data.ghostlyRays.add(getWVProduction().times(diff)).min(getWVCap())
	for (var c = 0; c < 8; c++) {
		if (data.ghostlyRays.gte(getLightThreshold(c))) {
			data.lights[c] += Math.floor(data.ghostlyRays.div(getLightThreshold(c)).log(getLightThresholdIncrease(c)) + 1)
			tmp.updateLights = true
		}
	}
	data.maxRed = Math.max(data.lights[0], data.maxRed)
}
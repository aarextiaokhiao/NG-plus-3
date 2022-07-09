//Quantum worth
var quantumWorth
function updateQuantumWorth(mode) {
	if (!tmp.ngp3) return
	if (ghSave.milestones<8) {
		if (mode != "notation") mode=undefined
	} else if (mode == "notation") return
	if (mode != "notation") {
		if (mode != "display") {
			quantumWorth = quSave.quarks.add(quSave.usedQuarks.r).add(quSave.usedQuarks.g).add(quSave.usedQuarks.b).add(quSave.gluons.rg).add(quSave.gluons.gb).add(quSave.gluons.br).round()
			if (!tmp.ngp3l) colorCharge.qwBonus = quantumWorth.pow(.8).div(100)
		}
		if (ghSave.times) {
			var automaticCharge = Math.max(Math.log10(quantumWorth.add(1).log10() / 150) / Math.log10(2), 0) + Math.max(brSave.spaceShards.add(1).log10() / 15 - 0.5, 0)
			ghSave.automatorGhosts.power = Math.max(automaticCharge, ghSave.automatorGhosts.power)
			if (mode != "quick") {
				el("automaticCharge").textContent = automaticCharge.toFixed(2)
				el("automaticPower").textContent = ghSave.automatorGhosts.power.toFixed(2)
			}
			while (ghSave.automatorGhosts.ghosts<getMaxAutoGhosts()&&ghSave.automatorGhosts.power>=autoGhostRequirements[ghSave.automatorGhosts.ghosts-3]) {
				ghSave.automatorGhosts.ghosts++
				el("autoGhost"+ghSave.automatorGhosts.ghosts).style.display=""
				if (ghSave.automatorGhosts.ghosts>=getMaxAutoGhosts()) el("nextAutomatorGhost").parentElement.style.display="none"
				else el("nextAutomatorGhostDiv").style.display=""
			}
		}
	}
	if (mode != "quick") for (var e=1;e<4;e++) el("quantumWorth"+e).textContent = shortenDimensions(quantumWorth)
}

//Quark Assertment Machine (Quark Assignation: NG+3L)
function getAssortPercentage() {
	return quSave.assortPercentage ? quSave.assortPercentage : 100
}

function getAssortAmount() {
	return quSave.quarks.floor().min(quSave.quarks).times(getAssortPercentage() / 100).round()
}

var assortDefaultPercentages = [10, 25, 50, 100]
function updateAssortPercentage() {
	if (tmp.ngp3l) return
	let percentage = getAssortPercentage()
	el("assort_percentage").value = percentage
	for (var i = 0; i < assortDefaultPercentages.length; i++) {
		var percentage2 = assortDefaultPercentages[i]
		el("assort_percentage_" + percentage2).className = percentage2 == percentage ? "chosenbtn" : "storebtn"
	}
}

function changeAssortPercentage(x) {
	quSave.assortPercentage = Math.max(Math.min(parseFloat(x || el("assort_percentage").value), 100), 0)
	updateAssortPercentage()
	updateQuarksTabOnUpdate()
}

function assignQuark(color) {
	var usedQuarks = getAssortAmount()
	if (usedQuarks.eq(0)) {
		$.notify("Make sure you are assigning at least one quark!")
		return
	}
	if (tmp.ngp3l && color != "r" && quSave.times < 2 && !ghostified) if (!confirm("It is strongly recommended to assign your first quarks to red. Are you sure you want to do that?")) return
	var mult = getQuarkAssignMult()
	quSave.usedQuarks[color] = quSave.usedQuarks[color].add(usedQuarks.times(mult)).round()
	quSave.quarks = quSave.quarks.sub(usedQuarks)
	el("quarks").innerHTML = "You have <b class='QKAmount'>0</b> quarks."
	if (!mult.eq(1)) updateQuantumWorth()
	updateColorCharge()
	if (ghSave.another > 0) ghSave.another--
}

function assignAll(auto) {
	var ratios = quSave.assignAllRatios
	var sum = ratios.r+ratios.g+ratios.b
	var oldQuarks = getAssortAmount()
	var colors = ['r','g','b']
	var mult = getQuarkAssignMult()
	if (oldQuarks.lt(100)) {
		if (!auto) $.notify("You can only use this feature if you will assign at least 100 quarks.")
		return
	}
	for (c = 0; c < 3; c++) {
		var toAssign = oldQuarks.times(ratios[colors[c]]/sum).round()
		if (toAssign.gt(0)) {
			quSave.usedQuarks[colors[c]] = quSave.usedQuarks[colors[c]].add(toAssign.times(mult)).round()
			if (ghSave.another > 0) ghSave.another--
		}
	}
	quSave.quarks = quSave.quarks.sub(oldQuarks).round()
	if (quSave.autoOptions.assignQKRotate) {
		if (quSave.autoOptions.assignQKRotate > 1) {
			quSave.assignAllRatios = {
				r: quSave.assignAllRatios.g,
				g: quSave.assignAllRatios.b,
				b: quSave.assignAllRatios.r
			}
		} else quSave.assignAllRatios = {
			r: quSave.assignAllRatios.b,
			g: quSave.assignAllRatios.r,
			b: quSave.assignAllRatios.g
		}
		var colors = ['r','g','b']
		for (c = 0; c < 3; c++) el("ratio_" + colors[c]).value = quSave.assignAllRatios[colors[c]]
	}
	if (mult.gt(1)) updateQuantumWorth()
	updateColorCharge()
}

function getQuarkAssignMult() {
	let r = E(1)
	if (hasBU(23)) r = r.times(tmp.blu[23])
	return r
}

function changeRatio(color) {
	var value = parseFloat(el("ratio_" + color).value)
	if (value < 0 || isNaN(value)) {
		el("ratio_" + color).value = quSave.assignAllRatios[color]
		return
	}
	var sum = 0
	var colors = ['r','g','b']
	for (c = 0; c < 3; c++) sum += colors[c] == color ? value : quSave.assignAllRatios[colors[c]]
	if (sum == 0 || sum == 1/0) {
		el("ratio_" + color).value = quSave.assignAllRatios[color]
		return
	}
	quSave.assignAllRatios[color] = value
}

function toggleAutoAssign() {
	quSave.autoOptions.assignQK = !quSave.autoOptions.assignQK
	el('autoAssign').textContent="Auto: O"+(quSave.autoOptions.assignQK?"N":"FF")
	if (quSave.autoOptions.assignQK && quSave.quarks.gt(0)) assignAll(true)
}

function rotateAutoAssign() {
	quSave.autoOptions.assignQKRotate=quSave.autoOptions.assignQKRotate?(quSave.autoOptions.assignQKRotate+1)%3:1
	el('autoAssignRotate').textContent="Rotation: "+(quSave.autoOptions.assignQKRotate>1?"Left":quSave.autoOptions.assignQKRotate?"Right":"None")
}

//Color Charge
colorCharge = {
	normal: {}
}
colorShorthands = {r:'red',
	g:'green',
	b:'blue'}

function updateColorCharge() {
	if (!tmp.ngp3) return
	var colors = ['r','g','b']
	for (var i = 0; i < 3; i++) {
		var ret = E(0)
		if (ghSave.milestones >= 2) ret = quSave.usedQuarks[colors[i]]
		colorCharge[colors[i]] = ret
	}

	var sorted=[]
	for (var s = 1; s < 4; s++) {
		var search = ''
		for (var i = 0; i < 3; i++) if (!sorted.includes(colors[i])&&(search==''||quSave.usedQuarks[colors[i]].gte(quSave.usedQuarks[search]))) search=colors[i]
		sorted.push(search)
	}

	colorCharge.normal={color:sorted[0],charge:Decimal.sub(quSave.usedQuarks[sorted[0]]).sub(quSave.usedQuarks[sorted[1]])}
	if (ghSave.milestones<2) colorCharge[sorted[0]]=colorCharge[sorted[0]].add(colorCharge.normal.charge)
	if (quSave.usedQuarks[sorted[0]].gt(0)&&colorCharge.normal.charge.eq(0)) giveAchievement("Hadronization")

	updateQuarksTabOnUpdate()
}

function getColorPowerProduction(color) {
	let ret = E(colorCharge[color])
	if (!tmp.ngp3l) ret = ret.add(colorCharge.qwBonus)
	return ret
}

colorBoosts={
	r:1,
	g:1,
	b:1,
	dim: {
		r:1,
		g:1,
		b:1
	}
}

function getCPLog(c) {
	var x = Decimal.add(quSave.colorPowers[c], 1).log10()
	return x
}

function getCPLogs(c) {
	return {
		r: getCPLog("r"),
		g: getCPLog("g"),
		b: getCPLog("b")
	}
}

function updateColorPowers(log) {
	//Logs
	if (log == undefined) log = getCPLogs()

	//Red
	let div6 = 4
	if (!player.dilation.active) div6--

	colorBoosts.r = Math.pow(log.r,div6 / 6) / 10 + 1
	if (colorBoosts.r>1.3) colorBoosts.r = Math.sqrt(colorBoosts.r * 1.3)
	if (colorBoosts.r>2.3 && (!player.dilation.active || getTreeUpgradeLevel(2) > 7 || ghostified)) {
		let sc_exp = 0.5
		if (ghostified && ghSave.neutrinos.boosts >= 5) sc_exp += tmp.nb[5] / 2
		if (sc_exp < 1) colorBoosts.r = Math.pow(colorBoosts.r / 2.3, sc_exp) * 2.3
	}

	//Green
	let m = 1
	if (tmp.ngp3l) {
		colorBoosts.g = Math.sqrt(log.g*2+1)
		if (colorBoosts.g>4.5) colorBoosts.g = Math.sqrt(colorBoosts.g*4.5)
	} else {
		colorBoosts.g = Math.pow(log.g+1, 1/3) * 2 - 1
		if (ghSave.ghostlyPhotons.unl) m *= tmp.le[3]
	}
	if (aarMod.ngumuV && player.masterystudies.includes("t362")) {
		m += quSave.replicants.quarks.add(1).log10()/10
		if (m > 4) m = Math.sqrt(m * 4)
	}
	if (aarMod.ngudpV && !aarMod.nguepV) m /= 2
	colorBoosts.g = (colorBoosts.g - 1) * m + 1

	//Blue
	var bLog = log.b
	if (tmp.ngp3l) bLog = Math.sqrt(bLog)
	else bLog = Math.sqrt(log.b + 1.5) - 1.5

	let softcapStartLog = 3
	let softcapPower = 1
	if (ghSave.ghostlyPhotons.unl) softcapPower += tmp.le[4]
	if (hasBU(11)) softcapPower += tmp.blu[11]
	if (bLog > softcapStartLog) {
		bLog = E_pow(bLog/softcapStartLog,softcapPower/2).times(softcapStartLog)
		if (bLog.lt(100)) bLog = bLog.toNumber()
		else bLog = Math.min(bLog.toNumber(), bLog.log10() * (40 + 10 * bLog.sub(90).log10()))
	}
	if (bLog < 0) bLog = 0
	colorBoosts.b = pow10(bLog)

	//Dimensions
	updateColorDimPowers(log)
}

function updateColorDimPowers(log) {
	if (tmp.ngp3l) return
	if (log == undefined) log = getCPLogs()
	
	var rexp = Math.sqrt(player.money.add(1).log10()) * Math.pow(getColorDimPowerBase("r", log), 4/7) * (inQC(6) ? 1 : 35)
	var gexp = Math.sqrt(player.infinityPower.add(1).log10()) * Math.pow(getColorDimPowerBase("g", log), 4/7) * 5
	var bexp = Math.sqrt(player.timeShards.add(1).log10()) * Math.pow(getColorDimPowerBase("b", log), 8/21)
	
	if (rexp > 1e12) rexp = Math.sqrt(rexp * 1e12)
	if (rexp > 1e15) rexp = Math.sqrt(rexp * 1e15)

	if (gexp > 1e9) gexp = Math.sqrt(gexp * 1e9)
	if (gexp > 1e12) gexp = Math.sqrt(gexp * 1e12)

	if (bexp > 1e6) bexp = Math.sqrt(bexp * 1e6)
	if (bexp > 1e9) bexp = Math.sqrt(bexp * 1e9)

	colorBoosts.dim.r = pow10(rexp)
	colorBoosts.dim.g = pow10(gexp)
	colorBoosts.dim.b = pow10(bexp)
}

function getColorDimPowerBase(color, log) {
	if (log == undefined) log = getCPLogs()
	let ret = Math.pow(log[color], 3/5)
	ret *= Math.pow((quSave.colorDimPower || 0) + 1, 2/5)
	return ret
}

function getColorDimPowerUpgradeCost() {
	return E_pow(5, quSave.colorDimPower || 0).times(3)
}

function upgradeColorDimPower() {
	let cost = getColorDimPowerUpgradeCost()
	if (!quSave.quarks.gte(cost)) return
	quSave.quarks = quSave.quarks.sub(cost).round()
	quSave.colorDimPower = (quSave.colorDimPower || 0) + 1
	updateQuantumWorth()
	updateQuarksTabOnUpdate()
}

function maxUpgradeColorDimPower(){
	var currCost = getColorDimPowerUpgradeCost()
	var quarks = quSave.quarks
	if (!quarks.gte(currCost)) return
	var log105 = Math.log10(5)
	
	var tobuy = Math.floor(quarks.times(4).plus(currCost).div(currCost).log10()/log105-1)
	//log_5(4*totalquarks+currentcost)-1
	var costToBuy = E_pow(5,tobuy).minus(1).div(4).times(currCost).min(pow2(1024)) 
	//only costs quarks if you have less than e308 of them
	
	quSave.colorDimPower = (quSave.colorDimPower || 0) + tobuy
	quSave.quarks = quarks.sub(costToBuy).round()
	updateQuantumWorth()
	updateQuarksTabOnUpdate()
	upgradeColorDimPower() //in case there are some rounding issues, we will check and buy one more (if possible)
}

//Gluons
function gainQuarkEnergy(ma_old, ma_new) {
	if (!ma_new.gte(ma_old)) return
	quSave.quarkEnergy = quSave.quarkEnergy.add(getQuarkEnergyGain(ma_new).sub(getQuarkEnergyGain(ma_old)).times(getQuarkEnergyGainMult()))
}

function getQuarkEnergyGain(ma) {
	let x = (ma.log10() - Math.log10(Number.MAX_VALUE) * 1.4) / 280
	if (x < 0) x = -Math.pow(-x, 1.5)
	else x = Math.pow(x, 1.5)
	return pow10(x)
}

function getQuarkEnergyGainMult() {
	return 0.75
}

function generateGluons(mix) {
	let firstColor = mix[0]
	let toConsume = quSave.usedQuarks[firstColor].min(quSave.quarkEnergy.floor())
	if (toConsume.eq(0)) return
	quSave.usedQuarks[firstColor] = quSave.usedQuarks[firstColor].sub(toConsume).round()
	quSave.quarkEnergy = quSave.quarkEnergy.sub(toConsume)
	quSave.gluons[mix] = quSave.gluons[mix].add(toConsume).round()
	updateColorCharge()
	updateGluonsTabOnUpdate()
}

GUCosts = [null, 1, 2, 4, 100, 7e15, 4e19, 3e28, "1e570"]

function buyGluonUpg(color, id) {
	var name = color + id
	if (quSave.upgrades.includes(name) || quSave.gluons[color].plus(0.001).lt(GUCosts[id])) return
	quSave.upgrades.push(name)
	quSave.gluons[color] = quSave.gluons[color].sub(GUCosts[id])
	updateGluonsTab("spend")
	if (name == "gb3") {
		var otherMults = 1
		if (hasAch("r85")) otherMults *= 4
		if (hasAch("r93")) otherMults *= 4
		var old = getIPMultPower()
		ipMultPower = 2.3
		player.infMult = player.infMult.div(otherMults).pow(Math.log10(getIPMultPower()) / Math.log10(old)).times(otherMults)
	}
	if (name == "rg4" && !quSave.autoOptions.sacrifice) updateElectronsEffect()
	if (name == "gb4") player.tickSpeedMultDecrease = 1.25
	updateQuantumWorth()
	updateGluonsTabOnUpdate()
}

function GUBought(id) {
	return tmp.ngp3 && quSave.upgrades.includes(id)
}

function buyQuarkMult(name) {
	var cost = E_pow(100, quSave.multPower[name] + Math.max(quSave.multPower[name] - 467, 0)).times(500)
	if (quSave.gluons[name].lt(cost)) return
	quSave.gluons[name] = quSave.gluons[name].sub(cost).round()
	quSave.multPower[name]++
	quSave.multPower.total++
	updateGluonsTab("spend")
	if (quSave.autobuyer.mode === 'amount') {
		quSave.autobuyer.limit = Decimal.times(quSave.autobuyer.limit, 2)
		el("priorityquantum").value = formatValue("Scientific", quSave.autobuyer.limit, 2, 0);
	}
}

function maxQuarkMult() {
	var names = ["rg", "gb", "br"]
	var bought = 0
	for (let c = 0; c < 3; c++) {
		var name = names[c]
		var buying = true
		while (buying) {
			var cost = E_pow(100, quSave.multPower[name] + Math.max(quSave.multPower[name] - 467, 0)).times(500)
			if (quSave.gluons[name].lt(cost)) buying = false
			else if (quSave.multPower[name] < 468) {
				var toBuy = Math.min(Math.floor(quSave.gluons[name].div(cost).times(99).add(1).log(100)),468-quSave.multPower[name])
				var toSpend = E_pow(100, toBuy).sub(1).div(99).times(cost)
				if (toSpend.gt(quSave.gluons[name])) quSave.gluons[name]=E(0)
				else quSave.gluons[name] = quSave.gluons[name].sub(toSpend).round()
				quSave.multPower[name] += toBuy
				bought += toBuy
			} else {
				var toBuy=Math.floor(quSave.gluons[name].div(cost).times(9999).add(1).log(1e4))
				var toSpend=E_pow(1e4, toBuy).sub(1).div(9999).times(cost)
				if (toSpend.gt(quSave.gluons[name])) quSave.gluons[name]=E(0)
				else quSave.gluons[name] = quSave.gluons[name].sub(toSpend).round()
				quSave.multPower[name] += toBuy
				bought += toBuy
			}
		}
	}
	quSave.multPower.total += bought
	if (quSave.autobuyer.mode === 'amount') {
		quSave.autobuyer.limit = Decimal.times(quSave.autobuyer.limit, pow2(bought))
		el("priorityquantum").value = formatValue("Scientific", quSave.autobuyer.limit, 2, 0)
	}
	updateGluonsTabOnUpdate("spend")
}

function getGB1Effect() {
	if (tmp.ngp3l) return 1 - Math.min(Decimal.log10(tmp.tsReduce),0)
	return Decimal.div(1, tmp.tsReduce).log10() / 100 + 1
}

function getBR1Effect() {
	if (tmp.ngp3l) return player.dilation.dilatedTime.add(1).log10()+1
	return Math.sqrt(player.dilation.dilatedTime.add(10).log10()) / 2
}

function getRG3Effect() {
	if (tmp.ngp3l || !hasAch("ng3p24")) return player.resets
	let exp = Math.sqrt(player.meta.resets)
	if (exp > 36) exp = 6 * Math.sqrt(exp)
	return E_pow(player.resets, exp)
}

function getGU8Effect(type) {
	return Math.pow(quSave.gluons[type].div("1e565").add(1).log10() * 0.505 + 1, 1.5)
}

//Display
function updateQuarksTab(tab) {
	el("redPower").textContent=shortenMoney(quSave.colorPowers.r)
	el("greenPower").textContent=shortenMoney(quSave.colorPowers.g)
	el("bluePower").textContent=shortenMoney(quSave.colorPowers.b)
	el("redTranslation").textContent=((colorBoosts.r-1)*100).toFixed(1)
	var msg = getFullExpansion(Math.round((colorBoosts.g-1)*100))+(tmp.pe>0?"+"+getFullExpansion(Math.round(tmp.pe*100)):"")
	el("greenTranslation").textContent=msg
	el("blueTranslation").textContent=shortenMoney(colorBoosts.b)
	if (!tmp.ngp3l) {
		el("redDimTranslation").textContent=shortenMoney(colorBoosts.dim.r)
		el("greenDimTranslation").textContent=shortenMoney(colorBoosts.dim.g)
		el("blueDimTranslation").textContent=shortenMoney(colorBoosts.dim.b)
	}
	if (player.masterystudies.includes("t383")) el("blueTranslationMD").textContent=shorten(getMTSMult(383))
	if (ghSave.milestones>7) {
		var assortAmount=getAssortAmount()
		if (!tmp.ngp3l) {
			var colors=['r','g','b']
			el("assort_amount").textContent = shortenDimensions(assortAmount.times(getQuarkAssignMult()))
			for (c = 0; c < 3; c++) if (colorCharge[colors[c]].div(colorCharge.qwBonus).lte(1e16)) el(colors[c]+"PowerRate").textContent="+"+shorten(getColorPowerProduction(colors[c]))+"/s"
		}
		el("assignAllButton").className=(assortAmount.lt(1)?"unavailabl":"stor")+"ebtn"
		updateQuantumWorth("display")
	}
}

function updateGluonsTab() {
	el("gbupg1current").textContent = "Currently: " + shortenMoney(getGB1Effect()) + "x"
	el("brupg1current").textContent = "Currently: " + shortenMoney(getBR1Effect()) + "x"
	el("rgupg2current").textContent = "Currently: " + (Math.pow(player.dilation.freeGalaxies / 5e3 + 1, 0.25) * 100 - 100).toFixed(1) + "%"
	el("brupg2current").textContent = "Currently: " + shortenMoney(E_pow(2.2, Math.pow(tmp.sacPow.log10() / 1e6, 0.25))) + "x"
	el("rgupg3current").textContent = "Currently: " + shorten(getRG3Effect()) + "x"
	el("brupg4current").textContent = "Currently: " + shortenMoney(E_pow(getDimensionPowerMultiplier(hasNU(13) && "no-rg4"), 0.0003).max(1)) + "x"
	if (player.masterystudies.includes("d9")) {
		el("gbupg5current").textContent = "Currently: " + (Math.sqrt(player.replicanti.galaxies) / 5.5).toFixed(1) + "%"
		el("brupg5current").textContent = "Currently: " + Math.min(Math.sqrt(player.dilation.tachyonParticles.max(1).log10())*1.3,14).toFixed(1) + "%"
		el("gbupg6current").textContent = "Currently: " + (100-100/(1 + Math.pow(player.infinityPower.plus(1).log10(),0.25)/2810)).toFixed(1) + "%"
		el("brupg6current").textContent = "Currently: " + (100-100/(1 + player.meta.resets/340)).toFixed(1) + "%"
		el("gbupg7current").textContent = "Currently: " + (100-100/(1 + Math.log10(1+player.infinityPoints.max(1).log10())/100)).toFixed(1) + "%"
		el("brupg7current").textContent = "Currently: " + (100-100/(1 + Math.log10(1+player.eternityPoints.max(1).log10())/80)).toFixed(1) + "%"
	}
	if (player.masterystudies.includes("d13")) {
		el("rgupg8current").textContent = "Currently: " + shorten(getGU8Effect("rg")) + "x"
		el("gbupg8current").textContent = "Currently: " + shorten(getGU8Effect("gb")) + "x"
		el("brupg8current").textContent = "Currently: " + shorten(getGU8Effect("br")) + "x"
	}
	if (!tmp.ngp3l) {
		let qkEnergy=quSave.quarkEnergy
		let rgGain=qkEnergy.floor().min(quSave.usedQuarks.r)
		let gbGain=qkEnergy.floor().min(quSave.usedQuarks.g)
		let brGain=qkEnergy.floor().min(quSave.usedQuarks.b)
		el("quarkEnergy").textContent = shortenMoney(qkEnergy)
		el("quarkEnergyGluons").textContent = shortenDimensions(qkEnergy.floor())
		el("generateRGGluons").className = "gluonupgrade " + (rgGain.gt(0) ? "rg" : "unavailablebtn")
		el("generateRGGluonsAmount").textContent=shortenDimensions(rgGain)
		el("generateGBGluons").className = "gluonupgrade " + (gbGain.gt(0) ? "gb" : "unavailablebtn")
		el("generateGBGluonsAmount").textContent=shortenDimensions(gbGain)
		el("generateBRGluons").className = "gluonupgrade " + (brGain.gt(0) ? "br" : "unavailablebtn")
		el("generateBRGluonsAmount").textContent=shortenDimensions(brGain)
	}
	if (ghSave.milestones > 7) {
		updateQuantumWorth("display")
		updateGluonsTabOnUpdate("display")
	}
}

//Display: On load
function updateQuarksTabOnUpdate(mode) {
	var colors = ['r','g','b']
	if (colorCharge.normal.charge.eq(0)) el("colorCharge").innerHTML='neutral charge'
	else {
		var color = colorShorthands[colorCharge.normal.color]
		el("colorCharge").innerHTML='<span class="'+color+'">'+color+'</span> charge of <span class="'+color+'" style="font-size:35px">' + shortenDimensions(colorCharge.normal.charge) + "</span>"
	}
	for (c = 0; c < 3; c++) el(colors[c]+"PowerRate").textContent="+"+shorten(getColorPowerProduction(colors[c]))+"/s"

	el("redQuarks").textContent = shortenDimensions(quSave.usedQuarks.r)
	el("greenQuarks").textContent = shortenDimensions(quSave.usedQuarks.g)
	el("blueQuarks").textContent = shortenDimensions(quSave.usedQuarks.b)
	el("boost").style.display = player.dilation.active ? "" : "none"

	var assortAmount = getAssortAmount()
	var canAssign = assortAmount.gt(0)
	el("quarkAssort").style.display = tmp.ngp3l ? "none" : ""
	el("quarkAssign").style.display = tmp.ngp3l ? "" : "none"
	el("colorDimTranslations").style.display = tmp.ngp3l ? "none" : ""
	if (tmp.ngp3l) {
		el("redAssign").className = canAssign ? "storebtn" : "unavailablebtn"
		el("greenAssign").className = canAssign ? "storebtn" : "unavailablebtn"
		el("blueAssign").className = canAssign ? "storebtn" : "unavailablebtn"
	} else {
		el("assort_amount").textContent = shortenDimensions(assortAmount.times(getQuarkAssignMult()))
		el("redAssort").className = canAssign ? "storebtn" : "unavailablebtn"
		el("greenAssort").className = canAssign ? "storebtn" : "unavailablebtn"
		el("blueAssort").className = canAssign ? "storebtn" : "unavailablebtn"
		el("colorDimPowerUpgLevel").textContent = getFullExpansion((quSave.colorDimPower||0)+1)
		el("colorDimPowerUpgCost").textContent = shortenDimensions(getColorDimPowerUpgradeCost())
		el("colorDimPowerUpg").className = "gluonupgrade " + (quSave.quarks.gte(getColorDimPowerUpgradeCost()) ? "storebtn" : "unavailablebtn")
	}

	var uq = quSave.usedQuarks
	var gl = quSave.gluons
	for (var p = 0; p < 3; p++) {
		var pair = (["rg", "gb", "br"])[p]
		var diff = uq[pair[0]].min(uq[pair[1]])
		el(pair + "gain").textContent = shortenDimensions(diff)
		el(pair + "next").textContent = shortenDimensions(uq[pair[0]].sub(diff).round())
	}
	el("assignAllButton").className = canAssign ? "storebtn" : "unavailablebtn"
	el("bluePowerMDEffect").style.display = player.masterystudies.includes("t383") ? "" : "none"
	if (player.masterystudies.includes("d13")) {
		el("redQuarksToD").textContent = shortenDimensions(quSave.usedQuarks.r)
		el("greenQuarksToD").textContent = shortenDimensions(quSave.usedQuarks.g)
		el("blueQuarksToD").textContent = shortenDimensions(quSave.usedQuarks.b)	
	}
}

function updateGluonsTabOnUpdate(mode) {
	if (!player.masterystudies) return
	else if (!quSave.gluons.rg) {
		quSave.gluons = {
			rg: E(0),
			gb: E(0),
			br: E(0)
		}
	}
	if (ghSave.milestones<8) mode = undefined
	var names = ["rg","gb","br"]
	var sevenUpgrades = player.masterystudies.includes("d9")
	var eightUpgrades = player.masterystudies.includes("d13")
	if (mode == undefined) for (r = 3; r < 5; r++) el("gupgrow" + r).style.display = sevenUpgrades ? "" : "none"
	for (c = 0; c < 3; c++) {
		if (mode==undefined) {
			el(names[c] + "upg7col").setAttribute("colspan", eightUpgrades ? 1 : 2)
			el(names[c] + "upg8col").style.display = eightUpgrades ? "" : "none"
		}
		if (mode == undefined || mode == "display") {
			var name = names[c]
			el(name).textContent = shortenDimensions(quSave.gluons[name])
			for (u = 1; u <= (eightUpgrades ? 8 : sevenUpgrades ? 7 : 4); u++) {
				var upg = name + "upg" + u
				if (u > 4) el(upg + "cost").textContent = shortenMoney(E(GUCosts[u]))
				if (quSave.upgrades.includes(name + u)) el(upg).className="gluonupgradebought small "+name
				else if (quSave.gluons[name].lt(GUCosts[u])) el(upg).className="gluonupgrade small unavailablebtn"
				else el(upg).className="gluonupgrade small "+name
			}
			var upg = name + "qk"
			var cost = E_pow(100, quSave.multPower[name] + Math.max(quSave.multPower[name] - 467,0)).times(500)
			el(upg+"cost").textContent = shortenDimensions(cost)
			if (quSave.gluons[name].lt(cost)) el(upg+"btn").className = "gluonupgrade unavailablebtn"
			else el(upg + "btn").className = "gluonupgrade " + name
		}
	}
	if (mode == undefined || mode == "display") el("qkmultcurrent").textContent = shortenDimensions(pow2(quSave.multPower.total))
}

//Quarks animation
var quarks={}
var centerX
var centerY
var maxDistance
var code

function drawQuarkAnimation(ts){
	centerX = canvas.width/2
	centerY = canvas.height/2
	maxDistance=Math.sqrt(Math.pow(centerX,2)+Math.pow(centerY,2))
	code=player.options.theme=="Aarex's Modifications"?"e5":"99"
	if (el("quantumtab").style.display !== "none" && el("uquarks").style.display !== "none" && player.options.animations.quarks) {
		qkctx.clearRect(0, 0, canvas.width, canvas.height);
		quarks.sum=quSave.colorPowers.r.max(1).log10()+quSave.colorPowers.g.max(1).log10()+quSave.colorPowers.b.max(1).log10()
		quarks.amount=Math.ceil(Math.min(quarks.sum,200))
		for (p=0;p<quarks.amount;p++) {
			var particle=quarks['p'+p]
			if (particle==undefined) {
				particle={}
				var random=Math.random()
				if (random<=quSave.colorPowers.r.max(1).log10()/quarks.sum) particle.type='r'
				else if (random>=1-quSave.colorPowers.b.max(1).log10()/quarks.sum) particle.type='b'
				else particle.type='g'
				particle.motion=Math.random()>0.5?'in':'out'
				particle.direction=Math.random()*Math.PI*2
				particle.distance=Math.random()
				quarks['p'+p]=particle
			} else {
				particle.distance+=0.01
				if (particle.distance>=1) {
					var random=Math.random()
					if (random<=quSave.colorPowers.r.max(1).log10()/quarks.sum) particle.type='r'
					else if (random>=1-quSave.colorPowers.b.max(1).log10()/quarks.sum) particle.type='b'
					else particle.type='g'
					particle.motion=Math.random()>0.5?'in':'out'
					particle.direction=Math.random()*Math.PI*2
					particle.distance=0
				}
				var actualDistance=particle.distance*maxDistance
				if (particle.motion=="in") actualDistance=maxDistance-actualDistance
				qkctx.fillStyle=particle.type=="r"?"#"+code+"0000":particle.type=="g"?"#00"+code+"00":"#0000"+code
				point(centerX+Math.sin(particle.direction)*actualDistance, centerY+Math.cos(particle.direction)*actualDistance, qkctx)
			}
		}
		delta = (ts - lastTs) / 1000;
		lastTs = ts;
		requestAnimationFrame(drawQuarkAnimation);
	}
}

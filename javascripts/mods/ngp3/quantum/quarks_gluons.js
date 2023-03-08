//Quantum worth
var quantumWorth
function updateQuantumWorth(mode) {
	if (!mod.ngp3) return
	if (!hasBraveMilestone(8)) {
		if (mode != "notation") mode = undefined
	} else if (mode == "notation") return

	if (mode != "notation") {
		if (mode != "display") {
			quantumWorth = quSave.quarks.add(quSave.usedQuarks.r).add(quSave.usedQuarks.g).add(quSave.usedQuarks.b).add(quSave.gluons.rg).add(quSave.gluons.gb).add(quSave.gluons.br).round()
			colorCharge.qwBonus = quantumWorth.pow(.8).div(100)
		}
		if (ghostified) updateAutomatorStuff(mode)
	}
	if (mode != "quick") for (var e=1;e<=2;e++) el("quantumWorth"+e).textContent = shortenDimensions(quantumWorth)
}

function getQuarkMultReq() {
	let lvl = quSave.multPower / 3
	if (lvl > 467) lvl = lvl * 2 - 467
	return E_pow(100, lvl).mul(500)
}

function getQuarkMultBulk() {
	let bulk = E(quantumWorth).max(1).div(500).log(100)
	if (bulk > 467) bulk = (bulk + 467) / 2
	bulk *= 3
	if (bulk < 0) return 0
	return Math.floor(bulk + 1)
}

function buyQuarkMult() {
	if (E(quantumWorth).lt(getQuarkMultReq())) return
	increaseQuarkMult(1)
}

function maxQuarkMult() {
	let bulk = getQuarkMultBulk()
	if (bulk <= quSave.multPower) return
	increaseQuarkMult(bulk - quSave.multPower)
}

function increaseQuarkMult(toAdd) {
	quSave.multPower += toAdd
	if (quSave.autobuyer.mode === 'amount') {
		quSave.autobuyer.limit = Decimal.mul(quSave.autobuyer.limit, pow2(toAdd))
		el("priorityquantum").value = formatValue("Scientific", quSave.autobuyer.limit, 2, 0)
	}
	updateGluonsTab("spend")
}

//Quark Assertment Machine (Quark Assignation: NG+3L)
function getAssortPercentage() {
	return quSave.assortPercentage ? quSave.assortPercentage : 100
}

function getAssortAmount() {
	return quSave.quarks.floor().min(quSave.quarks).mul(getAssortPercentage() / 100).round()
}

var assortDefaultPercentages = [10, 25, 50, 100]
function updateAssortPercentage() {
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
	if (color != "r" && quSave.times < 2 && !ghostified && !confirm("It is strongly recommended to assign your first quarks to red. Are you sure you want to do that?")) return
	var mult = getQuarkAssignMult()
	quSave.usedQuarks[color] = quSave.usedQuarks[color].add(usedQuarks.mul(mult)).round()
	quSave.quarks = quSave.quarks.sub(usedQuarks)
	updateQuarkDisplay()
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
		var toAssign = oldQuarks.mul(ratios[colors[c]]/sum).round()
		if (toAssign.gt(0)) {
			quSave.usedQuarks[colors[c]] = quSave.usedQuarks[colors[c]].add(toAssign.mul(mult)).round()
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
	if (hasBU(23)) r = r.mul(tmp.blu[23])
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
	if (!mod.ngp3) return
	var colors = ['r','g','b']
	for (var i = 0; i < 3; i++) {
		var ret = E(0)
		if (hasBraveMilestone(2)) ret = quSave.usedQuarks[colors[i]]
		colorCharge[colors[i]] = ret
	}

	var sorted=[]
	for (var s = 1; s < 4; s++) {
		var search = ''
		for (var i = 0; i < 3; i++) if (!sorted.includes(colors[i])&&(search==''||quSave.usedQuarks[colors[i]].gte(quSave.usedQuarks[search]))) search=colors[i]
		sorted.push(search)
	}

	colorCharge.normal={color:sorted[0],charge:Decimal.sub(quSave.usedQuarks[sorted[0]]).sub(quSave.usedQuarks[sorted[1]])}
	if (!hasBraveMilestone(2)) colorCharge[sorted[0]]=colorCharge[sorted[0]].add(colorCharge.normal.charge)
	if (quSave.usedQuarks[sorted[0]].gt(0)&&colorCharge.normal.charge.eq(0)) giveAchievement("Hadronization")

	updateQuarksTabOnUpdate()
}

function getColorPowerProduction(color) {
	let ret = E(colorCharge[color]).add(colorCharge.qwBonus)
	return ret
}

colorBoosts={
	r: 1,
	g: 1,
	b: 1
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

	colorBoosts.r = Math.pow(log.r, div6 / 6) / 10 + 1
	if (colorBoosts.r > 1.3) colorBoosts.r = Math.sqrt(colorBoosts.r * 1.3)
	if (colorBoosts.r > 2.3) {
		let sc_exp = 0.5
		if (hasNB(5)) sc_exp += ntEff("boost", 5, 0) / 2
		if (sc_exp < 1) colorBoosts.r = Math.pow(colorBoosts.r / 2.3, sc_exp) * 2.3
	}
	if (colorBoosts.r > 3) colorBoosts.r = Math.sqrt(colorBoosts.r * 3)

	//Green
	let mult = 2
	if (aarMod.ngumuV && hasMasteryStudy("t362")) {
		mult += quSave.replicants.quarks.add(1).log10() / 10
		if (mult > 4) m = Math.sqrt(m * 4)
	}
	if (mod.udp && !aarMod.nguepV) mult /= 2
	colorBoosts.g = (Math.pow(log.g + 1, 1/3) - 1) * mult + 1

	//Blue
	var bLog = Math.sqrt(log.b + 1.5) - Math.sqrt(1.5)
	if (bLog > 3) bLog = Math.sqrt(bLog * 3)
	colorBoosts.b = pow10(bLog)
}

//Gluons
function convertAQToGluons() {
	var u = quSave.usedQuarks
	var g = quSave.gluons
	var p = ["rg", "gb", "br"]
	var d = []
	for (var c = 0; c < 3; c++) d[c] = u[p[c][0]].min(u[p[c][1]])
	for (var c = 0; c < 3; c++) {
		g[p[c]] = g[p[c]].add(d[c]).round()
		u[p[c][0]] = u[p[c][0]].sub(d[c]).round()
	}

	updateQuarkDisplay()
	updateQuarksTabOnUpdate()
	updateGluonsTabOnUpdate()
}

function checkGluonRounding(){
	if (!quantumed) return
	if (hasBraveMilestone(8)) return
	if (quSave.gluons.rg.lt(101)) quSave.gluons.rg = quSave.gluons.rg.round()
	if (quSave.gluons.gb.lt(101)) quSave.gluons.gb = quSave.gluons.gb.round()
	if (quSave.gluons.br.lt(101)) quSave.gluons.br = quSave.gluons.br.round()
	if (quSave.quarks.lt(101)) quSave.quarks = quSave.quarks.round()
}

const GUCosts = [null, 1, 2, 4, 100, 7e15, 4e19, 3e28, "1e570"]
function buyGluonUpg(color, id) {
	var name = color + id
	if (hasGluonUpg(name) || quSave.gluons[color].plus(0.001).lt(GUCosts[id])) return
	quSave.upgrades.push(name)
	quSave.gluons[color] = quSave.gluons[color].sub(GUCosts[id])
	updateGluonsTab("spend")
	if (name == "gb3") {
		var otherMults = 1
		if (hasAch("r85")) otherMults *= 4
		if (hasAch("r93")) otherMults *= 4
		var old = getIPMultPower()
		ipMultPower = 2.3
		player.infMult = player.infMult.div(otherMults).pow(Math.log10(getIPMultPower()) / Math.log10(old)).mul(otherMults)
	}
	if (name == "rg4" && !quSave.autoOptions.sacrifice) updateElectronsEffect()
	if (name == "gb4") player.tickSpeedMultDecrease = 1.25
	updateQuantumWorth()
	updateGluonsTabOnUpdate()
}

function hasGluonUpg(id) {
	return quSave?.upgrades.includes(id)
}

function getGB1Effect() {
	return Decimal.div(1, tmp.tsReduce).log10() / 100 + 1
}

function getBR1Effect() {
	return Math.sqrt(player.dilation.dilatedTime.add(10).log10()) / 2
}

function getRG3Effect() {
	if (!hasAch("ng3p24")) return player.resets

	let exp = Math.sqrt(player.meta.resets)
	if (exp > 36) exp = 6 * Math.sqrt(exp)
	return E_pow(player.resets, exp)
}

function getGB6Effect() {
	return Math.min(1 + Math.pow(player.infinityPower.plus(1).log10(), 0.25) / 2810, 2.5)
}

function getBR6Effect() {
	return Math.min(1 + player.meta.resets / 340, 2.5)
}

function getGU8Effect(type) {
	return Math.pow(quSave.gluons[type].div("1e565").add(1).log10() + 1, 0.5)
}

//Display
function updateQuarksTab(tab) {
	el("redPower").textContent=shortenMoney(quSave.colorPowers.r)
	el("greenPower").textContent=shortenMoney(quSave.colorPowers.g)
	el("bluePower").textContent=shortenMoney(quSave.colorPowers.b)
	el("redTranslation").textContent=shortenMoney((colorBoosts.r-1)*100)+"%"
	el("greenTranslation").textContent="+"+shortenMoney((colorBoosts.g-1)*100)+"%"
	el("blueTranslation").textContent=shortenMoney(colorBoosts.b)+"x"

	if (hasMasteryStudy("t383")) el("blueTranslationMD").textContent=shorten(getMTSMult(383))+"x"
	if (hasBraveMilestone(8)) {
		var assortAmount=getAssortAmount()
		var colors=['r','g','b']
		el("assort_amount").textContent = shortenDimensions(assortAmount.mul(getQuarkAssignMult()))
		for (c = 0; c < 3; c++) if (colorCharge[colors[c]].div(colorCharge.qwBonus).lte(1e16)) el(colors[c]+"PowerRate").textContent="+"+shorten(getColorPowerProduction(colors[c]))+"/s"

		el("assignAllButton").className=(assortAmount.lt(1)?"unavailabl":"stor")+"ebtn"
	}

	//UPGRADES
	el("qk_mult_upg").className = "gluonupgrade " + (E(quantumWorth).gte(getQuarkMultReq()) ? "storebtn" : "unavailablebtn")
	el("qk_mult_upg").innerHTML = `
		<b>Double anti-quarks.</b><br>
		Currently: ${shortenDimensions(getQuarkMult())}x<br>
		(req: ${shortenDimensions(getQuarkMultReq())} quantum worth)
	`
}

function updateGluonsTab() {
	el("gbupg1current").textContent = "Currently: " + shortenMoney(getGB1Effect()) + "x"
	el("brupg1current").textContent = "Currently: " + shortenMoney(getBR1Effect()) + "x"
	el("rgupg2current").textContent = "Currently: " + (Math.pow(player.dilation.freeGalaxies / 5e3 + 1, 0.25) * 100 - 100).toFixed(1) + "%"
	el("brupg2current").textContent = "Currently: " + shortenMoney(E_pow(2.2, Math.pow(tmp.sacPow.log10() / 1e6, 0.25))) + "x"
	el("rgupg3current").textContent = "Currently: " + shorten(getRG3Effect()) + "x"
	el("brupg4current").textContent = "Currently: " + shortenMoney(E_pow(getDimensionPowerMultiplier(hasNU(13) && "no-rg4"), 0.0003).max(1)) + "x"
	if (hasMasteryStudy("d9")) {
		el("gbupg6current").textContent = "Currently: " + (100-100/getGB6Effect()).toFixed(1) + "%"
		el("brupg6current").textContent = "Currently: " + (100-100/getBR6Effect()).toFixed(1) + "%"
		el("gbupg7current").textContent = "Currently: " + (100-100/(1 + Math.log10(1+player.infinityPoints.max(1).log10())/100)).toFixed(1) + "%"
		el("brupg7current").textContent = "Currently: " + (100-100/(1 + Math.log10(1+player.eternityPoints.max(1).log10())/80)).toFixed(1) + "%"
	}
	if (hasMasteryStudy("d13")) {
		el("rgupg8current").textContent = "Currently: " + shorten(getGU8Effect("rg")) + "x"
		el("gbupg8current").textContent = "Currently: " + shorten(getGU8Effect("gb")) + "x"
		el("brupg8current").textContent = "Currently: " + shorten(getGU8Effect("br")) + "x"
	}
	if (hasBraveMilestone(8)) updateGluonsTabOnUpdate("display")
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

	var assortAmount = getAssortAmount()
	var canAssign = assortAmount.gt(0)
	el("assort_amount").textContent = shortenDimensions(assortAmount.mul(getQuarkAssignMult()))
	el("redAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	el("greenAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	el("blueAssort").className = canAssign ? "storebtn" : "unavailablebtn"

	var uq = quSave.usedQuarks
	var gl = quSave.gluons
	for (var p = 0; p < 3; p++) {
		var pair = (["rg", "gb", "br"])[p]
		var diff = uq[pair[0]].min(uq[pair[1]])
		el(pair + "gain").textContent = shortenDimensions(diff)
		el(pair + "next").textContent = shortenDimensions(uq[pair[0]].sub(diff).round())
	}
	el("assignAllButton").className = canAssign ? "storebtn" : "unavailablebtn"
	el("bluePowerMDEffect").style.display = hasMasteryStudy("t383") ? "" : "none"
	if (hasMasteryStudy("d13")) el("redQuarksToD").textContent = shortenDimensions(quSave.usedQuarks.r)
}

function updateGluonsTabOnUpdate(mode) {
	if (!mod.ngp3) return
	else if (!quSave.gluons.rg) {
		quSave.gluons = {
			rg: E(0),
			gb: E(0),
			br: E(0)
		}
	}
	if (!hasBraveMilestone(8)) mode = undefined
	var names = ["rg","gb","br"]
	var sevenUpgrades = hasMasteryStudy("d9")
	var eightUpgrades = hasMasteryStudy("d13")
	for (c = 0; c < 3; c++) {
		if (mode == undefined) {
			el(names[c] + "upg3row").style.display = sevenUpgrades ? "" : "none"
			el(names[c] + "upg7col").style.display = sevenUpgrades ? "" : "none"
			el(names[c] + "upg8col").style.display = eightUpgrades ? "" : "none"
		}
		if (mode == undefined || mode == "display") {
			var name = names[c]
			el(name).textContent = shortenDimensions(quSave.gluons[name])
			for (u = 1; u <= (eightUpgrades ? 8 : sevenUpgrades ? 7 : 4); u++) {
				var upg = name + "upg" + u
				if (u > 4) el(upg + "cost").textContent = shortenMoney(E(GUCosts[u]))
				if (hasGluonUpg(name + u)) el(upg).className="gluonupgradebought small "+name
				else if (quSave.gluons[name].lt(GUCosts[u])) el(upg).className="gluonupgrade small unavailablebtn"
				else el(upg).className="gluonupgrade small "+name
			}
		}
	}
}

//Quarks animation
let quarks = {}
function drawQuarkAnimation(ts){
	let centerX = qkc.width / 2
	let centerY = qkc.height / 2
	let offset = Math.max(centerX, centerY)

	if (el("quantumtab").style.display !== "none" && el("uquarks").style.display !== "none" && isAnimationOn("quarks")) {
		delta = (ts - lastTs) / 1000
		lastTs = ts

		qkctx.clearRect(0, 0, qkc.width, qkc.height)
		let amt = Math.min(Math.log10(quantumWorth.add(1).log10() + 10) * 50, 200)
		for (let i = 0; i < amt; i++) {
			let data = quarks[i] || {
				deg: Math.random() * 1000,
				speed: Math.random() * .5 + .75
			}
			quarks[i] = data
			data.deg += delta * data.speed

			let actualDeg = (data.deg / Math.PI) % 1
			let dist = offset * (Math.sin(data.deg / Math.PI) / 3 + .5)
			qkctx.fillStyle = actualDeg > 2/3 ? "#00f" : actualDeg > 1/3 ? "#0f0" : "#f00"
			point(centerX + Math.sin(data.deg) * dist, centerY + Math.cos(data.deg) * dist, qkctx)
		}

		requestAnimationFrame(drawQuarkAnimation)
	}
}

const COLORS = {
	r: "red",
	g: "green",
	b: "blue",
}
const QUARK_COLORS = ["r","g","b"]

//Net Quarks
var quantumWorth
function updateQuantumWorth(mode) {
	if (!mod.ngp3) return
	if (!hasBraveMilestone(8)) {
		if (mode != "notation") mode = undefined
	} else if (mode == "notation") return

	if (mode != "notation") {
		if (mode != "display") {
			quantumWorth = quSave.quarks.add(quSave.usedQuarks.r).add(quSave.usedQuarks.g).add(quSave.usedQuarks.b).add(quSave.gluons.rg).add(quSave.gluons.gb).add(quSave.gluons.br).round()
			colorCharge.qwBonus = quantumWorth.add(1).pow(0.9).div(50)
		}
		if (ghostified) updateAutomatorStuff(mode)
	}
	if (mode != "quick") {
		for (let e = 1; e <= 2; e++) el("quantumWorth"+e).innerHTML = getQuantumWorthMsg()
	}
}

function getQuantumWorthMsg() {
	return "<b class='QKAmount'>" + shortenDimensions(quantumWorth) + "</b> net Quarks" + (shiftDown ? "<br><span style='font-size: 7px'>(anti-quarks + colored anti-quarks + gluons)</span>" : "")
}

function getQuarkMultReq() {
	return E_pow(10, quSave.multPower).mul(5)
}

function getQuarkMultBulk() {
	let bulk = E(quantumWorth).max(1).div(5).log(10)
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
}

//Quark Assertment Machine
function getAssortAmount() {
	return quSave.quarks.floor().min(quSave.quarks).mul(getAssortPercentage() / 100).round()
}

function assignQuark(color) {
	var usedQuarks = getAssortAmount()
	if (usedQuarks.eq(0)) {
		$.notify("Make sure you are assigning at least one quark!")
		return
	}
	if (color != "r" && quSave.times < 2 && !ghostified && !confirm("It is strongly recommended to assign your first quarks to red. Are you sure you want to do that?")) return

	quSave.usedQuarks[color] = quSave.usedQuarks[color].add(usedQuarks).round()
	quSave.quarks = quSave.quarks.sub(usedQuarks)

	if (!mult.eq(1)) updateQuantumWorth()
	updateColorCharge()
	if (ghSave?.another > 0) ghSave.another--
}

function isAdvancedAssortUnlocked() {
	return quantumWorth.gte(100) || quSave?.reachedInfQK
}

function assignAll(auto) {
	var ratios = quSave.assignAllRatios
	var sum = ratios.r+ratios.g+ratios.b
	var oldQuarks = getAssortAmount()
	for (let c of QUARK_COLORS) {
		var toAssign = oldQuarks.mul(ratios[c] / sum).round()
		if (toAssign.gt(0)) {
			quSave.usedQuarks[c] = quSave.usedQuarks[c].add(toAssign).round()
			if (ghSave?.another > 0) ghSave.another--
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
		for (let c of QUARK_COLORS) el("ratio_" + c).value = quSave.assignAllRatios[c]
	}
	updateColorCharge()
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

function getAssortPercentage() {
	return quSave.assortPercentage ? quSave.assortPercentage : 100
}

var assortDefaultPercentages = [10, 25, 50, 100]
function updateAssortPercentage() {
	let percentage = getAssortPercentage()
	el("assort_percentage").value = percentage
	for (var i = 0; i < assortDefaultPercentages.length; i++) {
		var percentage2 = assortDefaultPercentages[i]
		el("assort_percentage_" + percentage2).className = percentage2 == percentage ? "chosen" : "storebtn"
	}
}

function changeAssortPercentage(x) {
	quSave.assortPercentage = Math.max(Math.min(parseFloat(x || el("assort_percentage").value), 100), 0)
	updateAssortPercentage()
	updateQuarksTabOnUpdate()
}

function changeRatio(color) {
	var value = parseFloat(el("ratio_" + color).value)
	if (value < 0 || isNaN(value)) {
		el("ratio_" + color).value = quSave.assignAllRatios[color]
		return
	}
	var sum = 0
	for (let c of QUARK_COLORS) sum += c == color ? value : quSave.assignAllRatios[c]
	if (sum == 0 || sum == 1/0) {
		el("ratio_" + color).value = quSave.assignAllRatios[color]
		return
	}
	quSave.assignAllRatios[color] = value
}

function updateAssortOptions() {
	var advancedUnl = isAdvancedAssortUnlocked()
	var autoAssignUnl = quSave?.reachedInfQK
	el('assign_opt_req').style.display = !advancedUnl ? "" : "none"
	el('assign_options').style.display = advancedUnl ? "" : "none"
	for (let c of QUARK_COLORS) el("ratio_" + c).style.display = advancedUnl ? "" : "none"

	el('autoAssign').style.display = autoAssignUnl ? "" : "none"
	el('autoAssignRotate').style.display = autoAssignUnl ? "" : "none"
	el('autoReset').style.display = hasAch("ng3p47") ? "" : "none"
}

//Color Charge
colorCharge = {
	normal: {}
}

function updateColorCharge() {
	if (!mod.ngp3) return
	for (let c of QUARK_COLORS) {
		var ret = E(0)
		if (hasBraveMilestone(2)) ret = quSave.usedQuarks[c]
		colorCharge[c] = ret
	}

	var sorted = []
	for (var s = 1; s < 4; s++) {
		var search = ''
		for (let c of QUARK_COLORS) if (!sorted.includes(c) && quSave.usedQuarks[c].gte(quSave.usedQuarks[search] ?? 0)) search = c
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
	let red = Math.pow(log.r, player.dilation.active ? 2/3 : .5) / 10 + 1
	if (red > 1.3) red = Math.sqrt(red * 1.3)
	if (red > 2.3) {
		let exp = 0.5
		if (hasNB(5)) exp += NT.eff("boost", 5, 0) / 2
		if (exp < 1) red = Math.pow(red / 2.3, exp) * 2.3
	}
	tmp.qu.color_eff.r = Math.min(red, 4)

	//Green
	let mult = 2
	if (aarMod.ngumuV && hasMasteryStudy("t362")) {
		mult += quSave.replicants.quarks.add(1).log10() / 10
		if (mult > 4) m = Math.sqrt(m * 4)
	}
	if (mod.udp && !aarMod.nguepV) mult /= 2
	tmp.qu.color_eff.g = (Math.pow(log.g + 1, 1/3) - 1) * mult + 1

	//Blue
	var bLog = Math.sqrt(log.b + 1.5) - Math.sqrt(1.5)
	if (bLog > 3) bLog = Math.sqrt(bLog * 3)
	if (dev.testZone) bLog = Math.pow(log.b, 2/3) / 5

	tmp.qu.color_eff.b = pow10(bLog)
}

//Display
function updateQuarksTab(tab) {
	el("redPower").textContent=shortenMoney(quSave.colorPowers.r)
	el("greenPower").textContent=shortenMoney(quSave.colorPowers.g)
	el("bluePower").textContent=shortenMoney(quSave.colorPowers.b)
	el("redTranslation").textContent=shortenMoney((tmp.qu.color_eff.r-1)*100)+"%"
	el("greenTranslation").textContent="+"+shortenMoney((tmp.qu.color_eff.g-1)*100)+"%"
	el("blueTranslation").textContent=shortenMoney(tmp.qu.color_eff.b)+"x"

	if (hasMasteryStudy("t383")) el("blueTranslationMD").textContent=shorten(getMTSMult(383))+"x"
	if (hasBraveMilestone(8)) {
		var assortAmount = getAssortAmount()
		el("assort_amount").textContent = shortenDimensions(assortAmount)
		el("assignAllButton").className = (assortAmount.lt(1) ? "unavailabl" : "stor") + "ebtn"

		for (let c of QUARK_COLORS) el(c+"PowerRate").textContent="+"+shorten(getColorPowerProduction(c))+"/s"
	}

	//UPGRADES
	el("qk_mult_upg").className = "qu_upg " + (E(quantumWorth).gte(getQuarkMultReq()) ? "storebtn" : "unavailablebtn")
	el("qk_mult_upg").innerHTML = `
		<b>Double anti-quarks.</b><br>
		Currently: ${shortenDimensions(getQuarkMult())}x<br>
		(req: ${shortenDimensions(getQuarkMultReq())} net Quarks)
	`
}

//Display: On load
function updateQuarksTabOnUpdate(mode) {
	if (colorCharge.normal.charge.eq(0)) el("colorCharge").innerHTML='neutral charge'
	else {
		var color = COLORS[colorCharge.normal.color]
		el("colorCharge").innerHTML='<span class="'+color+'">'+color+'</span> charge of <span class="'+color+'" style="font-size:15px">' + shortenDimensions(colorCharge.normal.charge) + "</span>"
	}

	var assortAmount = getAssortAmount()
	var canAssign = assortAmount.gt(0)
	for (var c of QUARK_COLORS) {
		var color = COLORS[c]
		el(c+"PowerRate").textContent="+"+shorten(getColorPowerProduction(c))+"/s"
		el(color+"Quarks").textContent = shortenDimensions(quSave.usedQuarks[c])
		el(color+"Assort").className = canAssign ? "storebtn" : "unavailablebtn"
	}

	el("assort_amount").textContent = shortenDimensions(assortAmount)
	el("assignAllButton").className = canAssign ? "storebtn" : "unavailablebtn"
	el("bluePowerMDEffect").style.display = hasMasteryStudy("t383") ? "" : "none"
}

//Quarks animation
let quarks = {}
function drawQuarkAnimation(ts){
	let centerX = qkc.width / 2
	let centerY = qkc.height / 2
	let offset = Math.max(centerX, centerY)

	if (isAnimationOn("quarks") && isTabShown("aq")) {
		delta = (ts - lastTs) / 1000
		lastTs = ts

		qkctx.clearRect(0, 0, qkc.width, qkc.height)

		let amt = Math.min(Math.log10(quantumWorth.add(1).log10() + 10) * 100, 300)
		for (let i = 0; i < amt; i++) {
			let data = quarks[i] ?? {
				deg: i,
				delta: Math.floor(Math.random() * 4) + 1,
				speed: Math.random() * .1 + .2
			}
			quarks[i] = data
			data.deg += delta * data.speed

			let actualDeg = (data.deg / Math.PI) % 1
			let dist = offset * (0.4 + Math.cos(data.deg / data.delta + ts / 5e3) * 0.3)
			qkctx.fillStyle = actualDeg > 2/3 ? "#00f" : actualDeg > 1/3 ? "#0f0" : "#f00"
			point(centerX + Math.sin(data.deg) * dist, centerY + Math.cos(data.deg) * dist, qkctx)
		}

		requestAnimationFrame(drawQuarkAnimation)
	}
}

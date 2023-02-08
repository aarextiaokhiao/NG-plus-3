function getLogTotalSpin() {
	return todSave.r.spin.add(1).log10()
}

function updateToDSpeedDisplay(){
	let t = ''
	if (shiftDown) t = getBranchSpeedText()
	else t = "Branch speed: " + (todspeed == 1 ? "" : shorten(tmp.branchSpeed) + " * " + shorten(todspeed) + " = ") + shorten(getBranchFinalSpeed()) + "x" + " (hold shift for details)"
	el("todspeed").innerHTML = t
}

function setupToDHTML() {
	for (var c = 0; c < 1; c++) {
		var color = (["red", "green", "blue"])[c]
		var shorthand = (["r", "g", "b"])[c]
		var branchUpgrades = ["Gain <span id='" + color + "UpgPow1'></span>x preons, but preons decay <span id='" + color + "UpgSpeed1'></span>x faster.",
				"Boost preons.",
				"Preons decay <span id='" + color + "UpgEffDesc'>4x</span> slower."] //might need to change this to just "slower" once we have 1000+ upgrade 3's

		var html = '<span class="' + color + '" id="' + color + 'QuarksToD" style="font-size: 35px">0</span> ' + color + ' quarks<br>'
		html += '<button class="storebtn" id="' + color + 'UnstableGain" style="width: 210px; height: 120px" onclick="unstableQuarks(\'' + shorthand + '\')"></button><br>'
		html += "<span class='" + color + "' id='" + color + "UnstableQuarks' style='font-size: 20px'>0</span> " + " <span id='" + shorthand + "UQName'></span> preons<br>"
		html += "<span id='" + color + "QuarksDecayRate'></span><br>"
		html += "(Duration: <span id='" + color + "QuarksDecayTime'></span>)<br>"
		html += '<span class="' + color + '" id="' + color + 'QuarkSpin" style="font-size: 25px">0.0</span> ' + ' preonic spin '
		html += '<span class="' + color + '" id="' + color + 'QuarkSpinProduction" style="font-size: 15px">+0/s</span>'
		el("todRow").innerHTML = html
		el("todRow").className = shorthand + "qC"
		
		html = "<table class='table' align='center' style='margin: auto'><tr>"
		for (var u = 1; u <= 3; u++) {
			html += "<td style='vertical-align: 0'><button class='gluonupgrade unavailablebtn' id='" + color + "upg" + u + "' onclick='buyBranchUpg(\"" + shorthand + "\", " + u + ")' style='font-size:10px'>" + branchUpgrades[u - 1] + "<br>" 
			html += "Currently: <span id='" + color + "upg" + u + "current'>1</span><br><span id='" + color + "upg" + u + "cost'>?</span></button>"
			html += (u == 2 ? "<br><button class='storebtn' style='width: 190px' onclick='maxBranchUpg(\"" + shorthand + "\")'>Max all upgrades</button>" + "<br><button class='storebtn' style='width: 190px; font-size:10px' onclick='maxBranchUpg(\"" + shorthand + "\", true)'>Max 2nd and 3rd upgrades</button>":"")+"</td>"
		}
		html += "</tr></tr><td></td><td><button class='gluonupgrade unavailablebtn' id='" + shorthand + "RadioactiveDecay' style='font-size:9px' onclick='radioactiveDecay(\"" + shorthand + "\")'>Reset to strengthen the 1st upgrade, but nerf this branch.<br><span id='" + shorthand + "RDReq'></span><br>Radioactive Decays: <span id='" + shorthand + "RDLvl'></span></button></td><td></td>"
		html += "</tr></table>"
		el(color + "Branch").innerHTML = html
	}
}

function updateTreeOfDecayTab(){
	var branchNum
	var colors = ["red", "green", "blue"]
	var shorthands = ["r", "g", "b"]
	for (var c = 0; c < 1; c++) {
		var color = colors[c]
		var shorthand = shorthands[c]
		var branch = todSave[shorthand]
		var name = getUQName(shorthand) + " preons"
		var rate = getDecayRate(shorthand)
		var linear = pow2(getRDPower(shorthand))
		el(color + "UnstableGain").className = quSave.usedQuarks[shorthand].gt(0) && getUnstableGain(shorthand).gt(branch.quarks) ? "storebtn" : "unavailablebtn"
		el(color + "UnstableGain").innerHTML = "Gain " + shortenMoney(getUnstableGain(shorthand)) + " " + name + (gotBraveMilestone(4) ? "." : ", but lose all your " + color + " quarks.")
		el(color + "QuarkSpin").innerHTML = shortenMoney(branch.spin)
		el(color + "UnstableQuarks").innerHTML = shortenMoney(branch.quarks)
		el(color + "QuarksDecayRate").innerHTML = branch.quarks.lt(linear) && rate.lt(1) ? "(-" + shorten(linear.mul(rate)) + " " + name + "/s)" : "(Half-life: " + timeDisplayShort(Decimal.div(10,rate), true, 2) + (linear.eq(1) ? "" : " until " + shorten(linear)) + ")"
		el(color + "QuarksDecayTime").innerHTML = timeDisplayShort(Decimal.div(10, rate).mul(branch.quarks.gt(linear) ? branch.quarks.div(linear).log(2) + 1 : branch.quarks.div(linear)))
		let ret = getQuarkSpinProduction(shorthand)
		el(color + "QuarkSpinProduction").innerHTML = "(+" + shortenMoney(ret) + "/s)"

		let decays = getRadioactiveDecays(shorthand)
		let power = Math.floor(getBU1Power(shorthand) / 120 + 1)			
		el(color + "UpgPow1").innerHTML = decays || power > 1 ? shorten(pow2((1 + decays * .1) / power)) : 2
		el(color + "UpgSpeed1").innerHTML = decays > 2 || power > 1 ? shorten(pow2(Math.max(.8 + decays * .1, 1) / power)) : 2

		let lvl = getBranchUpgLevel(shorthand, 3)
		let s = getBranchUpg3SoftcapStart()
		if (lvl >= s) eff = E_pow(4, (Math.sqrt((lvl + 1) / s) - Math.sqrt(lvl / s)) * s).toFixed(2)
		else eff = "4"
		el(color + "UpgEffDesc").innerHTML = " " + eff + "x"

		for (var u = 1; u <= 3; u++) {
			updateBranchUpgrade(shorthand, u)
			el(color + "upg" + u).className = "gluonupgrade " + (branch.spin.lt(getBranchUpgCost(shorthand, u)) ? "unavailablebtn" : shorthand)
		}

		document.getElementById(shorthand+"RadioactiveDecay").style.display = ghostified ? "" : "none"
		if (ghostified) {
			document.getElementById(shorthand+"RDReq").innerHTML = "(requires "+shorten(Decimal.pow(10, Math.pow(2, 50))) + " of " + color + " " + getUQName(shorthand) + " preons)"
			document.getElementById(shorthand+"RDLvl").textContent = getFullExpansion(getRadioactiveDecays(shorthand))
		}
	} //for loop

	var start = getLogTotalSpin() > 200 ? "" : "Cost: "
	for (var u = 1; u <= 8; u++) {
		var lvl = getTreeUpgradeLevel(u)
		el("treeupg" + u).className = "gluonupgrade " + (canBuyTreeUpg(u) ? "r" : "unavailablebtn")
		el("treeupg" + u + "current").innerHTML = getTreeUpgradeEffectDesc(u)
		el("treeupg" + u + "lvl").innerHTML = getFullExpansion(lvl) + (tmp.tue > 1 ? " -> " + getFullExpansion(Math.floor(lvl * tmp.tue)) : "")
		el("treeupg" + u + "cost").innerHTML = start + shortenMoney(getTreeUpgradeCost(u)) + " preonic spin"
	}
	el("treeUpgradeEff").style.display = ghostified ? "" : "none"
	if (ghostified) el("treeUpgradeEff").innerHTML = getTreeUpgradeEfficiencyText()

	updateToDSpeedDisplay()
}

function updateBranchUpgrade(b, u) {
	var clr = {r: "red", g: "green", b: "blue"}[b]
	var bData = todSave[b]
	var eff = shortenDimensions(getBranchUpgMult(b, u))

	var extra = bData.spin.log10() > 200
	var start = extra ? "" : "Cost: "

	el(clr + "upg" + u + "current").innerHTML = u == 2 ? eff + "n^" + eff : eff + "x"
	el(clr + "upg" + u + "cost").innerHTML = start + shortenMoney(getBranchUpgCost(b, u)) + " preonic spin"
}

function updateTODStuff() {
	if (!tmp.ngp3 || !hasMasteryStudy("d13")) return

	var colors = ["red", "green", "blue"]
	var shorthands = ["r", "g", "b"]
	for (var c = 0; c < 1; c++) {
		var color = colors[c]
		var shorthand = shorthands[c]
		var name = getUQName(shorthand)
		el(shorthand + "UQName").innerHTML = name

		if (ghostified) {
			el(shorthand+"RadioactiveDecay").parentElement.parentElement.style.display = ""
			el(shorthand+"RDReq").innerHTML = "(requires "+shorten(pow10(Math.pow(2, 50))) + " of " + name + " preons)"
			el(shorthand+"RDLvl").innerHTML = getFullExpansion(getRadioactiveDecays(shorthand))
		} else el(shorthand+"RadioactiveDecay").parentElement.parentElement.style.display = "none"
	}
}

function getUnstableGain(branch) {
	let ret = quSave.usedQuarks[branch].div("1e420").add(1).log10()
	if (ret < 2) ret = Math.max(quSave.usedQuarks[branch].div("1e300").div(99).log10() / 60,0)
	let power = getBranchUpgLevel(branch, 2) - getRDPower(branch)
	ret = pow2(power).mul(ret)
	if (ret.gt(1)) ret = E_pow(ret, Math.pow(2, power + 1))
	return ret.mul(pow2(getRDPower(branch) + 1)).min(pow10(Math.pow(2, 51)))
}

function unstableQuarks(branch) {
	if (quSave.usedQuarks[branch].eq(0) || getUnstableGain(branch).lte(todSave[branch].quarks)) return
	todSave[branch].quarks = todSave[branch].quarks.max(getUnstableGain(branch))
	if (!gotBraveMilestone(4)) quSave.usedQuarks[branch] = E(0)
	if (ghSave.reference > 0) ghSave.reference--
	if (player.unstableThisGhostify) player.unstableThisGhostify ++
	else player.unstableThisGhostify = 10
}

function getBranchSpeedText(){
	let text = ""
	if (hasMasteryStudy("t431") && getMTSMult(431).gt(1)) text += "Mastery Study 431: " + shorten(getMTSMult(431)) + "x, "
	if (getGluonBranchSpeed().gt(1)) text += "Gluon Upgrades: " + shorten(getGluonBranchSpeed()) + "x, "
	if (E(getTreeUpgradeEffect(3)).gt(1)) text += "Tree Upgrade 3: " + shorten(getTreeUpgradeEffect(3)) + "x, "
	if (E(getTreeUpgradeEffect(5)).gt(1)) text += "Tree Upgrade 5: " + shorten(getTreeUpgradeEffect(5)) + "x, "
	if (PHOTON.eff(1) > 1) text += "Green Light: " + shorten(E(PHOTON.eff(1)).pow(nfSave.rewards)) + "x, "
	if (hasAch("ng3p48") && player.meta.resets) text += "'Are you currently dying?' reward: " + shorten(Math.sqrt(player.meta.resets + 1)) + "x, "
	if (todspeed > 1) text += "ToD Speed: " + shorten(todspeed) + "x, "
	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getGluonBranchSpeed() {
	let x = E(1)
	if (hasGluonUpg("rg8")) x = x.mul(getGU8Effect("rg"))
	if (hasGluonUpg("gb8")) x = x.mul(getGU8Effect("gb"))
	if (hasGluonUpg("br8")) x = x.mul(getGU8Effect("br"))
	return x
}

function getBranchSpeed() {
	let x = E(1)
	if (hasMasteryStudy("t431")) x = x.mul(getMTSMult(431))
	x = x.mul(getGluonBranchSpeed())
	x = x.mul(getTreeUpgradeEffect(3), getTreeUpgradeEffect(5))
	x = E(PHOTON.eff(1)).pow(nfSave.rewards).mul(x)
	if (hasAch("ng3p48")) x = x.mul(Math.sqrt(player.meta.resets + 1))
	return x
}

function getBranchFinalSpeed() {
	return tmp.branchSpeed.mul(todspeed)
}

function getDecayRate(branch) {
	let ret = pow2(getBU1Power(branch) * Math.max((getRadioactiveDecays(branch) - 8) / 10, 1)).div(getBranchUpgMult(branch, 3)).div(pow2(Math.max(0, getRDPower(branch) - 4)))
	ret = ret.mul(getBranchFinalSpeed())
	return ret.min(Math.pow(2, 40)).mul(todspeed)
}

function getQuarkSpinProduction(branch) {
	let ret = getBranchUpgMult(branch, 1).mul(getBranchFinalSpeed())
	if (hasNU(3)) ret = ret.mul(tmp.nu[3])
	if (hasNU(12)) ret = ret.mul(tmp.nu[12].normal)
	if (hasAch("ng3p74")) ret = ret.mul(1 + (todSave[branch].decays || 0))

	ret = ret.mul(todspeed)
	return ret
}

function getTreeUpgradeCost(upg,add) {
	let lvl = getTreeUpgradeLevel(upg)
	if (add !== undefined) lvl += add
	if (upg == 1) return pow2(lvl * 2 + Math.max(lvl - 35, 0) * (lvl - 34) / 2).mul(50)
	if (upg == 2) return E_pow(4, lvl * (lvl + 3) / 2).mul(600)
	if (upg == 3) return E_pow(32, lvl).mul(3e9)
	if (upg == 4) return pow2(lvl + Math.max(lvl - 37, 0) * (lvl - 36) / 2).mul(1e12)
	if (upg == 5) return pow2(lvl + Math.max(lvl - 35, 0) * (lvl - 34) / 2 + Math.pow(Math.max(0, lvl - 50), 1.5)).mul(4e12)
	if (upg == 6) return E_pow(4, lvl * (lvl + 3) / 2).mul(6e22)
	if (upg == 7) return E_pow(16, lvl * lvl).mul(4e22)
	if (upg == 8) return pow2(lvl).mul(3e23)
	return 0
}

function canBuyTreeUpg(upg) {
	return getTreeUpgradeCost(upg).lte(todSave.r.spin)
}

function buyTreeUpg(upg) {
	if (!canBuyTreeUpg(upg)) return
	var branch = todSave.r
	branch.spin = branch.spin.sub(getTreeUpgradeCost(upg))
	if (!todSave.upgrades[upg]) todSave.upgrades[upg] = 0
	todSave.upgrades[upg]++
}

function getTreeUpgradeLevel(upg) {
	return todSave.upgrades[upg] || 0
}

function getEffectiveTreeUpgLevel(upg){
	if (!tmp.tue) return 0
	lvl = getTreeUpgradeLevel(upg) * tmp.tue
	if (upg == 1 && lvl >= 500) lvl = 500 * Math.pow(lvl / 500,.9)
	if (upg == 2 && lvl > 64) lvl = (lvl + 128) / 3
	if (upg == 5 && lvl > 500) lvl = Math.sqrt(lvl / 500) * 500
	if (upg == 7 && lvl > 100) lvl -= Math.sqrt(lvl) - 10
	if (upg == 8 && lvl > 1111) lvl = 1111 + (lvl - 1111) / 2
	return lvl
}

function getTotalNumOfToDUpgrades(){
	let power = 0
	for (var upg = 1; upg < 9; upg++) power += getTreeUpgradeLevel(upg)
	return power
}

function getTreeUpgradeEffect(upg) {
	let lvl = getEffectiveTreeUpgLevel(upg)
	if (upg == 1) return Math.floor(lvl * 30)
	if (upg == 2) return lvl * 0.25
	if (upg == 3) return pow2(Math.sqrt(Math.max(lvl, 0) * 2))
	if (upg == 4) return Math.sqrt(1 + Math.log10(lvl * 0.5 + 1) * 0.1)
	if (upg == 5) {
		let MA = player.meta.bestOverQuantums
		if (hasAch("ng3p87")) MA = player.meta.bestOverGhostifies
		return Math.pow(Math.log10(MA.add(1).log10() + 1) / 5 + 1, Math.sqrt(lvl))
	}
	if (upg == 6) return pow2(lvl)
	if (upg == 7) return E_pow(player.replicanti.amount.max(1).log10() + 1, 0.25 * lvl)
	if (upg == 8) return Math.log10(Decimal.add(player.meta.bestAntimatter, 1).log10() + 1) / 4 * Math.sqrt(lvl)
	return 0
}

function getTreeUpgradeEffectDesc(upg) {
	if (upg == 1) return getFullExpansion(getTreeUpgradeEffect(upg))
	if (upg == 2) return getDilExp("TU3").toFixed(2) + " -> " + getDilExp().toFixed(2)
	if (upg == 4) return "^" + getFullExpansion(Math.round(getElectronBoost("noTree"))) + " -> ^" + getFullExpansion(Math.round(tmp.mpte))
	if (upg == 8) return getTreeUpgradeEffect(8).toFixed(2)
	return shortenMoney(getTreeUpgradeEffect(upg))
}

var branchUpgCostScales = [[300, 15], [50, 8], [4e7, 7]]
function getBranchUpgCost(branch, upg) {
	var lvl = getBranchUpgLevel(branch, upg)
	var scale = branchUpgCostScales[upg-1]
	return pow2(lvl * upg + Math.max(lvl - scale[1], 0) * Math.max(3 - upg, 1)).mul(scale[0])
}

function buyBranchUpg(branch, upg) {
	var bData = todSave[branch]
	if (bData.spin.lt(getBranchUpgCost(branch,upg))) return
	bData.spin = bData.spin.sub(getBranchUpgCost(branch, upg))
	if (bData.upgrades[upg] == undefined) bData.upgrades[upg] = 0
	bData.upgrades[upg]++
}

function getBranchUpgLevel(branch,upg) {
	upg = todSave[branch].upgrades[upg]
	if (upg) return upg
	return 0
}

var todspeed = 1

function rotateAutoAssign() {
	quSave.autoOptions.assignQKRotate = quSave.autoOptions.assignQKRotate ? (quSave.autoOptions.assignQKRotate + 1) % 3 : 1
	el('autoAssignRotate').innerHTML = "Rotation: " + (quSave.autoOptions.assignQKRotate > 1 ? "Left" : quSave.autoOptions.assignQKRotate ? "" : "None")
}

var uq_names = {
	standard(rds) {
		let x = ""
		let roots_1 = ["", "radioactive", "infinity", "eternal", "quantum"]
		let roots_2 = ["", "spectre", "disappearing", "reappearing", "ethereal"]

		let a = rds % 5
		if (a > 0) x = roots_1[a] + " " + x

		let b = Math.floor((rds - 5) / 50 + 1)
		if (b >= 1) {
			if (b >= roots_2.length) return this.exponents(rds)

			let c = Math.floor((rds - 5) / 5) % 10 + 1
			x = roots_2[b] + (c > 1 ? "<sup>" + c + "</sup>" : "") + " " + x
		}

		if (rds == 0) x = "free"

		return x
	},
	abbreviated(rds) {
		let x = ""
		let roots_1 = ["", "r", "i", "e", "q"]
		let roots_2 = ["", "s", "d", "ra", "er"]

		let a = rds % 5
		if (a > 0) x = roots_1[a] + "."

		let b = Math.floor((rds - 5) / 50 + 1)
		if (b >= 1) {
			if (b >= roots_2.length) return this.exponents(rds)

			let c = Math.floor((rds - 5) / 5) % 10 + 1
			x = roots_2[b] + (c > 1 ? c : "") + "." + x
		}

		if (rds == 0) x = "free"

		return x
	},
	scientific(rds) {
		let x = "Rd"
		let roots_1 = ["", "r", "i", "e", "q"]
		let roots_2 = ["", "s", "d", "ra", "er"]

		let a = rds % 5
		let b = Math.floor((rds - 5) / 50 + 1)

		if (b >= 1) {
			if (b >= roots_2.length) return this.exponents(rds)

			let c = Math.floor((rds - 5) / 5) % 10 + 1
			x += "<sup>" + roots_2[b] + (c > 1 ? c : "") + "</sup>"
		}
		if (a >= (b > 0 ? 2 : 1)) x += "<sub>" + roots_1[a] + "</sub>"

		if (rds == 0) x = "free"

		return x
	},
	exponents(rds) {
		if (rds == 0) return "free"
		if (rds == 1) return "radioactive"
		return "radioactive<sup>" + getFullExpansion(rds + 1) + "</sup>"
	},
	mixed(rds) {
		if (rds > 5) return this.exponents(rds)
		return this.standard(rds)
	}
}

function getUQNameFromDecays(rds) {
	return uq_names["standard"](rds)
}

function getUQName(shorthand) {
	return getUQNameFromDecays(todSave[shorthand].decays || 0)
}

function maxTreeUpg() {
	var update = false
	var colors = ["r", "g", "b"]
	var todData = todSave
	for (var u = 1; u <= 8; u++) {
		var cost = getTreeUpgradeCost(u)
		var lvl = getTreeUpgradeLevel(u)
		var min = todData.r.spin
		var newSpins = todData.r.spin

		if (newSpins.gte(cost)) {
			var increment = 1
			while (newSpins.gte(getTreeUpgradeCost(u, increment - 1))) increment *= 2
			var toBuy = 0
			while (increment >= 1) {
				if (newSpins.gte(getTreeUpgradeCost(u, toBuy + increment - 1))) toBuy += increment
				increment /= 2
			}
			var cost = getTreeUpgradeCost(u, toBuy - 1)
			var toBuy2 = toBuy
			while (toBuy > 0 && newSpins.div(cost).lt(1e16)) {
				if (newSpins.gte(cost)) newSpins = newSpins.sub(cost)
				else {
					newSpins = todData.r.spin.sub(cost)
					toBuy2--
				}
				toBuy--
				cost = getTreeUpgradeCost(u, toBuy - 1)
			}
			if (toBuy2) {
				todData.r.spin = isNaN(newSpins.e) ? E(0) : newSpins
				todData.upgrades[u] = toBuy2 + (todData.upgrades[u] === undefined ? 0 : todData.upgrades[u])
				update = true
			}
		}
	}
}

function maxBranchUpg(branch, weak) {
	var colors = {r: "red", g: "green", b: "blue"}
	var bData = todSave[branch]
	for (var u = (weak ? 2 : 1); u < 4; u++) {
		var oldLvl = getBranchUpgLevel(branch, u)
		var scaleStart = branchUpgCostScales[u - 1][1]
		var cost = getBranchUpgCost(branch, u)
		if (bData.spin.gte(cost) && oldLvl < scaleStart) {
			var costMult = Math.pow(2, u)
			var toAdd = Math.min(Math.floor(bData.spin.div(cost).mul(costMult - 1).add(1).log(costMult)),scaleStart - oldLvl)
			bData.spin = bData.spin.sub(E_pow(costMult, toAdd).sub(1).div(costMult).mul(cost).min(bData.spin))
			if (bData.upgrades[u] === undefined) bData.upgrades[u] = 0
			bData.upgrades[u] += toAdd
			cost = getBranchUpgCost(branch, u)
		}
		if (bData.spin.gte(cost) && bData.upgrades[u] >= scaleStart) {
			var costMult = Math.pow(2, u + Math.max(3 - u, 1))
			var toAdd = Math.floor(bData.spin.div(cost).mul(costMult-1).add(1).log(costMult))
			bData.spin = bData.spin.sub(E_pow(costMult,toAdd).sub(1).div(costMult).mul(cost).min(bData.spin))
			if (bData.upgrades[u] === undefined) bData.upgrades[u] = 0
			bData.upgrades[u] += toAdd
		}
	}
}

function radioactiveDecay(shorthand) {
	let data = todSave[shorthand]
	if (!data.quarks.gte(pow10(Math.pow(2, 50)))) return
	data.quarks = E(0)
	data.spin = E(0)
	data.upgrades = {}
	if (gotBraveMilestone(4)) data.upgrades[1] = 5
	data.decays = data.decays === undefined ? 1 : data.decays + 1
	let sum = 0
	for (var c = 0; c < 1; c++) sum += getRadioactiveDecays((['r', 'g', 'b'])[c])
	updateTODStuff()
}

function getRadioactiveDecays(shorthand) {
	let data = todSave[shorthand]
	return data.decays || 0
}

function getMinimumUnstableQuarks() {
	let r={quarks:E(1/0),decays:1/0}
	let c=["r","g","b"]
	for (var i=0;i<1;i++) {
		let b=todSave[c[i]]
		let d=b.decays||0
		if (r.decays>d||(r.decays==d&&b.quarks.lte(r.quarks))) r={quarks:b.quarks,decays:d}
	}
	return r
}

function getMaximumUnstableQuarks() {
	let r = {quarks:E(0),decays:0}
	let c = ["r","g","b"]
	for (var i=0;i<1;i++) {
		let b = todSave[c[i]]
		let d = b.decays || 0
		if (r.decays < d || (r.decays == d && b.quarks.gte(r.quarks))) r = {quarks: b.quarks, decays: d}
	}
	return r
}

function getTreeUpgradeEfficiencyText(){
	if (!shiftDown) return "Tree upgrade efficiency: "+(tmp.tue*100).toFixed(1)+"%"

	let text = ""
	if (hasNB(7) && bigRipped()) text += "Neutrino Boost 7: +" + shorten(tmp.nb[7]) + ", "
	if (hasAch("ng3p62")) text += "Finite Time Reward: +10%, "
	if (hasBU(43)) text += "Bosonic Lab Upgrade 18: " + shorten(tmp.blu[43]) + "x, "

	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getTreeUpgradeEfficiency(mod) {
	let r = 1
	if (hasNB(7) && (bigRipped() || mod == "br") && mod != "noNB") r += tmp.nb[7]
	if (hasAch("ng3p62")) r += 0.1
	if (hasBU(43)) r *= tmp.blu[43]
	return r
}

function getRDPower(branch) {
	let x = getRadioactiveDecays(branch)
	let y = Math.max(x - 5, 0)
	return x * 25 + (Math.pow(y, 2) + y) * 1.25
}


function getBU1Power(branch) {
	let x = getBranchUpgLevel(branch,1)
	let s = Math.floor(Math.sqrt(0.25 + 2 * x / 120) - 0.5)
	return s * 120 + (x - s * (s + 1) * 60)/(s + 1)
}

function getBU2Power(branch) {
	let x = getBranchUpgLevel(branch, 2)
	if (hasAch("ng3p94")) x += getRadioactiveDecays(branch)
	return x
}

function getBranchUpg3SoftcapStart(){
	return 1000 //maybe later on we can have things buff this
}

function getBranchUpgMult(branch, upg) {
	if (upg == 1) return pow2(getBU1Power(branch) * (getRadioactiveDecays(branch) / 10 + 1))
	else if (upg == 2) return pow2(getBU2Power(branch))
	else if (upg == 3) {
		l = getBranchUpgLevel(branch, 3)
		let s = getBranchUpg3SoftcapStart()
		if (l > s) l = s * Math.sqrt(l / s)
		return E_pow(4, l)
	}
} 

function treeOfDecayUpdating(diff){
	var colorShorthands=["r","g","b"]
	for (var c = 0; c < 1; c++) {
		var shorthand = colorShorthands[c]
		var branch = todSave[shorthand]
		var decayRate = getDecayRate(shorthand)
		var decayPower = getRDPower(shorthand)
				
		var mult = pow2(decayPower)
		var power = Decimal.div(branch.quarks.gt(mult)?branch.quarks.div(mult).log(2)+1:branch.quarks.div(mult),decayRate)
		var decayed = power.min(diff)
		power = power.sub(decayed).mul(decayRate)

		var sProd = getQuarkSpinProduction(shorthand)
		branch.quarks = power.gt(1) ? pow2(power-1).mul(mult) : power.mul(mult)	
		branch.spin = branch.spin.add(sProd.mul(decayed))	
	}
}
function isDecayOn() {
	return hasMasteryStudy("d13") && !dev.testZone
}

function getLogTotalSpin() {
	return todSave.r.spin.add(1).log10()
}

function updateToDSpeedDisplay(){
	let t = ''
	if (shiftDown) t = getBranchSpeedText()
	else t = "Branch speed: " + shorten(getBranchSpeed()) + "x" + " (hold shift for details)"
	el("todspeed").innerHTML = t
}

function setupToDHTML() {
	var branchUpgrades = ["Double preonic spin, but preons decay 2x faster.",
			"Boost free preons.",
			"Preons decay 4x slower."]
	html = "<table class='table' align='center' style='margin: auto'><tr>"
	for (var u = 1; u <= 3; u++) {
		html += "<td style='vertical-align: 0'><button class='qu_upg unavailablebtn' id='redupg" + u + "' onclick='buyBranchUpg(\"r\", " + u + ")' style='font-size:10px'>" + branchUpgrades[u - 1] + "<br>" 
		html += "Currently: <span id='redupg" + u + "current'>1</span><br><span id='redupg" + u + "cost'>?</span></button>"
	}
	el("branchUpgs").innerHTML = html
}

function updateTreeOfDecayTab(){
	//Branch
	var branch = todSave.r
	var name = getUQName("r") + " preons"
	var rate = getDecayRate("r")
	var linear = pow2(getRDPower("r"))
	el("decay_btn").className = canUnstableQuarks() ? "storebtn" : "unavailablebtn"
	el("decay_btn").innerHTML = shortenDimensions(quSave.usedQuarks[todSave.chosen]) + " " + COLORS[todSave.chosen] + " quarks →<br>" + shortenMoney(getUnstableGain()) + " " + name

	el("decay_preons").innerHTML = shortenMoney(branch.quarks)
	el("decay_preons_name").innerHTML = name
	el("decay_rate").innerHTML = branch.quarks.lt(linear) && rate.lt(1) ? "-" + shorten(linear.mul(rate)) + " " + name + "/s" : "Half-life: " + timeDisplayShort(Decimal.div(10,rate), true, 2) + (linear.eq(1) ? "" : " until " + shorten(linear))
	el("decay_time").innerHTML = timeDisplayShort(Decimal.div(10, rate).mul(branch.quarks.gt(linear) ? branch.quarks.div(linear).log(2) + 1 : branch.quarks.div(linear)))

	el("decay_spin").innerHTML = shortenMoney(branch.spin)
	el("decay_spin_prod").innerHTML = "(+" + shortenMoney(getQuarkSpinProduction("r")) + "/s)"

	for (var u = 1; u <= 3; u++) updateBranchUpgrade("r", u)

	//Tree
	document.getElementById("rRadioactiveDecay").style.display = ghostified ? "" : "none"
	if (ghostified) {
		document.getElementById("rRDReq").innerHTML = "(requires "+shorten(Decimal.pow(10, Math.pow(2, 50))) + " of red " + getUQName("r") + " preons)"
		document.getElementById("rRDLvl").textContent = getFullExpansion(getRadioactiveDecays("r"))
	}

	var start = getLogTotalSpin() > 200 ? "" : "Cost: "
	for (var u = 1; u <= 8; u++) {
		var lvl = getTreeUpgradeLevel(u)
		el("treeupg" + u).className = "qu_upg " + (canBuyTreeUpg(u) ? "r" : "unavailablebtn")
		el("treeupg" + u + "current").innerHTML = getTreeUpgradeEffectDesc(u)
		el("treeupg" + u + "lvl").innerHTML = getFullExpansion(lvl) + (tmp.qu.tree_str > 1 ? " → " + getFullExpansion(Math.floor(lvl * tmp.qu.tree_str)) : "")
		el("treeupg" + u + "cost").innerHTML = start + shortenMoney(getTreeUpgradeCost(u)) + " preonic spin"
	}
	el("treeUpgradeEff").style.display = ghostified ? "" : "none"
	if (ghostified) el("treeUpgradeEff").innerHTML = getTreeUpgradeEfficiencyText()

	updateToDSpeedDisplay()
}

function updateBranchUpgrade(b, u) {
	var clr = COLORS[b]
	var bData = todSave[b]
	var eff = shortenDimensions(getBranchUpgMult(b, u))

	var extra = bData.spin.log10() > 200
	var start = extra ? "" : "Cost: "

	el(clr + "upg" + u + "current").innerHTML = u == 2 ? eff + "n^" + eff : eff + "x"
	el(clr + "upg" + u + "cost").innerHTML = start + shortenMoney(getBranchUpgCost(b, u)) + " preonic spin"
	el(clr + "upg" + u).className = "qu_upg " + (bData.spin.lt(getBranchUpgCost(b, u)) ? "unavailablebtn" : b)
}

function updateTODStuff() {
	if (!mod.ngp3 || !hasMasteryStudy("d13")) return

	var name = getUQName("r")
	el("decay_preons_name").innerHTML = name

	if (ghostified) {
		el("rRadioactiveDecay").parentElement.parentElement.style.display = ""
		el("rRDReq").innerHTML = "(requires "+shorten(pow10(Math.pow(2, 50))) + " of " + name + " preons)"
		el("rRDLvl").innerHTML = getFullExpansion(getRadioactiveDecays("r"))
	} else el("rRadioactiveDecay").parentElement.parentElement.style.display = "none"
}

function getUnstableGain() {
	let color = todSave.chosen
	let ret = quSave.usedQuarks[color].div("1e420").add(1).log10()
	if (ret < 2) ret = Math.max(quSave.usedQuarks[color].div("1e300").div(99).log10() / 60, 0)

	let power = getBranchUpgLevel("r", 2) - getRDPower("r")
	ret = pow2(power).mul(ret)

	if (ret.gt(1)) ret = E_pow(ret, Math.pow(2, power + 1))
	return ret.mul(pow2(getRDPower("r") + 1)).min(pow10(Math.pow(2, 51)))
}

function canUnstableQuarks() {
	return getUnstableGain().gt(todSave.r.quarks)
}

function unstableQuarks() {
	if (!canUnstableQuarks()) return

	todSave.r.quarks = todSave.r.quarks.max(getUnstableGain())
	if (!hasBraveMilestone(4)) quSave.usedQuarks[todSave.chosen] = E(0)

	if (ghSave.reference > 0) ghSave.reference--
	if (player.unstableThisGhostify) player.unstableThisGhostify++
	else player.unstableThisGhostify = 10
}

function getBranchSpeedText(){
	let text = ""
	if (hasMasteryStudy("t431") && getMTSMult(431).gt(1)) text += "Mastery Study 431: " + shorten(getMTSMult(431)) + "x, "
	if (E(getTreeUpgradeEffect(3)).gt(1)) text += "Tree Upgrade 3: " + shorten(getTreeUpgradeEffect(3)) + "x, "
	if (E(getTreeUpgradeEffect(5)).gt(1)) text += "Tree Upgrade 5: " + shorten(getTreeUpgradeEffect(5)) + "x, "
	if (hasNU(4)) text += "Neutrino Upgrade 4: " + shorten(NT.eff("upg", 4)) + "x, "
	if (hasNanoReward("decay_exp")) text += "7th Nanobenefit: ^" + shorten(getNanorewardEff("decay_exp")) + ", "
	if (hasAch("ng3p48") && player.meta.resets) text += "'Are you currently dying?' reward: " + shorten(Math.sqrt(player.meta.resets + 1)) + "x, "
	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getGluonBranchSpeed() {
	let x = E(1)
	if (hasGluonUpg("rg", 8)) x = x.mul(gluonEff("rg", 8))
	if (hasGluonUpg("gb", 8)) x = x.mul(gluonEff("gb", 8))
	if (hasGluonUpg("br", 8)) x = x.mul(gluonEff("br", 8))
	return x
}

function getBranchSpeed() {
	let x = E(1)
	if (hasMasteryStudy("t431")) x = x.mul(getMTSMult(431))
	x = x.mul(getTreeUpgradeEffect(3))
	x = x.mul(getTreeUpgradeEffect(5))
	if (hasNU(4)) x = x.mul(NT.eff("upg", 4))
	if (hasNanoReward("decay_exp")) x = x.pow(getNanorewardEff("decay_exp"))
	if (hasAch("ng3p48")) x = x.mul(Math.sqrt(player.meta.resets + 1))
	return x
}

function getDecayRate(branch) {
	let ret = pow2(getBU1Power(branch) * Math.max((getRadioactiveDecays(branch) - 8) / 10, 1)).div(getBranchUpgMult(branch, 3)).div(pow2(Math.max(0, getRDPower(branch) - 4)))
	ret = ret.mul(getBranchSpeed())
	ret = ret.div(getGluonBranchSpeed())
	return ret.min(Math.pow(2, 40))
}

function getQuarkSpinProduction(branch) {
	let ret = getBranchUpgMult(branch, 1).mul(getBranchSpeed())
	if (hasNU(3)) ret = ret.mul(NT.eff("upg", 3))
	if (hasNU(12)) ret = ret.mul(NT.eff("upg", 12).normal)
	if (hasAch("ng3p74")) ret = ret.mul(1 + (todSave[branch].decays || 0))
	return ret
}

function getTreeUpgradeCost(upg,add) {
	let lvl = getTreeUpgradeLevel(upg)
	if (add !== undefined) lvl += add
	if (upg == 1) return pow2(lvl * 2 + Math.max(lvl - 35, 0) * (lvl - 34) / 2).mul(50)
	if (upg == 2) return E_pow(4, lvl * (lvl + 3) / 2).mul(600)
	if (upg == 3) return E_pow(32, lvl).mul(3e9)
	if (upg == 4) return pow2(lvl).mul(1e12)
	if (upg == 5) return pow2(lvl).mul(4e12)
	if (upg == 6) return E_pow(6, lvl).mul(1e21)
	if (upg == 7) return E_pow(16, lvl).mul(4e22)
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

function getTotalNumOfToDUpgrades(){
	let power = 0
	for (var upg = 1; upg <= 8; upg++) power += getTreeUpgradeLevel(upg)
	return power
}

function getTreeUpgradeEffect(upg) {
	let lvl = getTreeUpgradeLevel(upg) * tmp.qu.tree_str
	if (upg == 1) return Math.floor(lvl * 30)
	if (upg == 2) return lvl * 0.25
	if (upg == 3) return pow2(Math.sqrt(Math.max(lvl, 0) * 2))
	if (upg == 4) return Math.sqrt(1 + Math.log10(lvl * 0.5 + 1) * 0.1)
	if (upg == 5) {
		let MA = hasAch("ng3p87") ? player.meta.bestOverGhostifies : player.meta.bestOverQuantums
		return E_pow(Math.log10(MA.add(1).log10() + 1) / 5 + 1, Math.sqrt(lvl) / 2)
	}
	if (upg == 6) return pow10(lvl / 2)
	if (upg == 7) return lvl ? pow2(Math.sqrt(tmp.rep.eff.max(1).log10()) / 20 * Math.log10(lvl + 9)) : E(1)
	if (upg == 8) return Math.log10(Decimal.add(player.meta.bestAntimatter, 1).log10() + 1) * Math.sqrt(lvl)
	return 0
}

function getTreeUpgradeEffectDesc(upg) {
	if (upg == 1) return getFullExpansion(getTreeUpgradeEffect(upg))
	if (upg == 2) return getDilExp("TU3").toFixed(2) + " → " + getDilExp().toFixed(2)
	if (upg == 4) return "^" + getFullExpansion(Math.round(getPositronBoost("noTree"))) + " → ^" + getFullExpansion(Math.round(tmp.mpte))
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

function rotateAutoAssign() {
	quSave.autoOptions.assignQKRotate = quSave.autoOptions.assignQKRotate ? (quSave.autoOptions.assignQKRotate + 1) % 3 : 1
	el('autoAssignRotate').innerHTML = "Rotation: " + (quSave.autoOptions.assignQKRotate > 1 ? "Left" : quSave.autoOptions.assignQKRotate ? "Right" : "None")
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
			bData.spin = bData.spin.sub(E_pow(costMult, toAdd).sub(1).div(costMult).mul(cost).min(bData.spin))
			if (bData.upgrades[u] === undefined) bData.upgrades[u] = 0
			bData.upgrades[u] += toAdd
		}
	}
}

function radioactiveDecay(shorthand) {
	let data = todSave[shorthand]
	if (!data.quarks.gte(pow10(Math.pow(2, 50)))) return
	data.quarks = E(0)
	data.decays = data.decays === undefined ? 1 : data.decays + 1
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
	if (!shiftDown) return "Tree upgrade efficiency: "+(tmp.qu.tree_str * 100).toFixed(1)+"%"

	let text = ""
	if (todSave.r.decays) {
		text += "Radioactive Decays: +" + (todSave.r.decays / 5).toFixed(1) + "x, "
		if (hasBLMilestone(14)) text += "Bosonic Milestone 15: " + shorten(blEff(14)) + "x to prior, "
	}
	if (hasNB(7)) text += "Neutrino Boost 7: +" + shorten(NT.eff("boost", 7)) + "x, "
	if (hasAch("ng3p62")) text += "'Finite Time' Reward: +0.1x, "

	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getTreeUpgradeEfficiency(mod) {
	let r = (todSave.r.decays || 0) / 5
	if (hasBLMilestone(14)) r *= blEff(14)
	if (hasNB(7) && mod != "noNB") r += NT.eff("boost", 7, 0)
	if (hasAch("ng3p62")) r += 0.1
	return r + 1
}

function getRDPower(branch) {
	let x = getRadioactiveDecays(branch)
	let y = Math.max(x - 5, 0)
	return x * 25 + (Math.pow(y, 2) + y) * 1.25
}

function getBU1Power(branch) {
	let x = getBranchUpgLevel(branch, 1)
	if (hasBLMilestone(2)) x *= blEff(2)
	let s = Math.floor(Math.sqrt(0.25 + 2 * x / 120) - 0.5)
	return s * 120 + (x - s * (s + 1) * 60) / (s + 1)
}

function getBU2Power(branch) {
	let x = getBranchUpgLevel(branch, 2)
	if (hasAch("ng3p94")) x += getRadioactiveDecays(branch)
	return x
}

function getBranchUpgMult(branch, upg) {
	if (upg == 1) return pow2(getBU1Power(branch))
	else if (upg == 2) return pow2(getBU2Power(branch))
	else if (upg == 3) return E_pow(4, getBranchUpgLevel(branch, 3))
} 

function treeOfDecayUpdating(diff){
	var branch = todSave.r
	var decayRate = getDecayRate("r")
	var decayPower = getRDPower("r")
			
	var mult = pow2(decayPower)
	var power = Decimal.div(branch.quarks.gt(mult)?branch.quarks.div(mult).log(2)+1:branch.quarks.div(mult),decayRate)
	var decayed = power.min(diff)
	power = power.sub(decayed).mul(decayRate)

	var sProd = getQuarkSpinProduction("r")
	branch.quarks = power.gt(1) ? pow2(power-1).mul(mult) : power.mul(mult)	
	branch.spin = branch.spin.add(sProd.mul(hasBraveMilestone(4) && isAutoGhostActive(1) && getUnstableGain("r").gt(0) ? diff : decayed))	
}
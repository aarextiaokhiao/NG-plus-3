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
	const branchUpgrades = ["Speed up Decay by 2x.", "Boost free preons.", "Preons decay 4x slower."]
	let html = ""
	for (var [u, b] of Object.entries(branchUpgrades)) {
		let i = parseInt(u) + 1
		html += `<td>
			<button class='qu_upg unavailablebtn' id='redupg${i}' onclick='buyBranchUpg(${i})'>
				${b}<br>
				Currently: <span id='redupg${i}current'></span><br>
				<span id='redupg${i}cost'></span>
			</button>
		</td>`
	}
	el("branchUpgs").innerHTML = html
}

function updateTreeOfDecayTab(){
	//Decay
	var branch = todSave.r
	var name = getUQName("r") + " preons"
	var rate = getDecayRate("r")
	var linear = pow2(getRDNerf("r"))
	el("decay_btn").className = canUnstableQuarks() ? "storebtn" : "unavailablebtn"
	el("decay_btn").innerHTML = shortenDimensions(quSave.usedQuarks[todSave.chosen]) + " " + COLORS[todSave.chosen] + " quarks →<br>" + shortenMoney(getUnstableGain()) + " " + name

	el("decay_preons").innerHTML = shortenMoney(branch.quarks)
	el("decay_preons_name").innerHTML = name
	el("decay_rate").innerHTML = branch.quarks.lt(linear) && rate.lt(1) ? "-" + shorten(linear.mul(rate)) + " " + name + "/s" : "Half-life: " + timeDisplayShort(Decimal.div(10,rate), true, 2) + (linear.eq(1) ? "" : " until " + shorten(linear))
	el("decay_time").innerHTML = timeDisplayShort(Decimal.div(10, rate).mul(branch.quarks.gt(linear) ? branch.quarks.div(linear).log(2) + 1 : branch.quarks.div(linear)))

	el("decay_spin").innerHTML = shortenMoney(branch.spin)
	el("decay_spin_prod").innerHTML = "(+" + shortenMoney(getQuarkSpinProduction("r")) + "/s)"

	//Upgrades
	for (var u = 1; u <= 3; u++) updateBranchUpgrade(u)

	document.getElementById("decay_radio").style.display = ghostified ? "" : "none"
	if (ghostified) {
		document.getElementById("decay_radio_req").innerHTML = "(requires "+shorten(pow10(Math.pow(2, 50))) + " " + getUQName("r") + " preons)"
		document.getElementById("decay_radio_lvl").textContent = getFullExpansion(getRadioactiveDecays())
	}

	//Tree Upgrades
	var start = getLogTotalSpin() > 200 ? "" : "Cost: "
	for (var u = 1; u <= 12; u++) {
		el("treeupg" + u).style.display = tmp.qu.tree_unls >= u ? "" : "none"
		if (tmp.qu.tree_unls < u) continue

		var lvl = getTreeUpgradeLevel(u)
		el("treeupg" + u).className = "qu_upg " + (canBuyTreeUpg(u) ? "r" : "unavailablebtn")
		el("treeupg" + u + "current").innerHTML = getTreeUpgradeEffectDesc(u)
		el("treeupg" + u + "lvl").innerHTML = getFullExpansion(lvl) + (tmp.qu.tree_str > 1 && u < 12 ? " → " + getFullExpansion(Math.floor(lvl * tmp.qu.tree_str)) : "")
		el("treeupg" + u + "cost").innerHTML = start + shortenMoney(getTreeUpgradeCost(u)) + " preonic spin"
	}
	el("treeUpgradeEff").style.display = ghostified ? "" : "none"
	if (ghostified) el("treeUpgradeEff").innerHTML = getTreeUpgradeEfficiencyText()

	updateToDSpeedDisplay()
}

function updateBranchUpgrade(u) {
	var bData = todSave.r
	var eff = getBranchUpgMult(u)

	var extra = bData.spin.log10() > 200
	var start = extra ? "" : "Cost: "

	el("redupg" + u + "current").innerHTML = u == 2 ? shortenDimensions(eff.mult) + "x, ^" + shortenDimensions(eff.exp) : shortenDimensions(eff) + "x"
	el("redupg" + u + "cost").innerHTML = start + shortenMoney(getBranchUpgCost(u)) + " preonic spin"
	el("redupg" + u).className = "qu_upg " + (bData.spin.lt(getBranchUpgCost(u)) ? "unavailablebtn" : "r")
}

function getUnstableGain() {
	let qk = quSave.usedQuarks[todSave.chosen]
	let ret = qk.div("1e420").add(1).log10()
	if (ret < 2) ret = Math.max(qk.div("1e300").div(99).log10() / 60, 0)

	let bu2 = getBranchUpgMult(2)
	ret = bu2.mult.mul(ret)

	if (ret.gt(1)) ret = ret.pow(bu2.exp.toNumber() * 2)
	return ret.min(pow10(Math.pow(2, 51)))
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
	if (getBranchUpgMult(1).gt(1)) text += "Branch Upgrade 1: " + shorten(getBranchUpgMult(1)) + "x, "
	if (hasMasteryStudy("t431") && getMTSMult(431).gt(1)) text += "Mastery Study 431: " + shorten(getMTSMult(431)) + "x, "
	if (E(getTreeUpgradeEffect(3)).gt(1)) text += "Tree Upgrade 3: " + shorten(getTreeUpgradeEffect(3)) + "x, "
	if (E(getTreeUpgradeEffect(5)).gt(1)) text += "Tree Upgrade 5: " + shorten(getTreeUpgradeEffect(5)) + "x, "
	if (hasNU(4)) text += "Neutrino Upgrade 4: " + shorten(NT.eff("upg", 4)) + "x, "
	if (hasAch("ng3p48") && player.meta.resets) text += "'Is this really worth it?' reward: " + shorten(Math.sqrt(player.meta.resets + 1)) + "x, "
	if (hasNanoReward("decay_exp")) text += "7th Nanobenefit: ^" + shorten(getNanorewardEff("decay_exp")) + ", "
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
	let x = getBranchUpgMult(1)
	if (hasMasteryStudy("t431")) x = x.mul(getMTSMult(431))
	x = x.mul(getTreeUpgradeEffect(3))
	x = x.mul(getTreeUpgradeEffect(5))
	if (hasNU(4)) x = x.mul(NT.eff("upg", 4))
	if (hasAch("ng3p48")) x = x.mul(Math.sqrt(player.meta.resets + 1))
	return x
}

function getDecayRate(branch) {
	return getBranchSpeed().div(5)
		.div(getBranchUpgMult(3))
		.div(pow2(Math.max(0, getRDNerf() - 4)))
		.div(getGluonBranchSpeed())
}

function getQuarkSpinProduction(branch) {
	let ret = getBranchSpeed()
	if (hasNU(3)) ret = ret.mul(NT.eff("upg", 3))
	if (hasNU(12)) ret = ret.mul(NT.eff("upg", 12).normal)
	if (hasAch("ng3p74")) ret = ret.mul(1 + (todSave[branch].decays || 0))
	return ret
}

function getTreeUpgradeCost(upg, add=0) {
	let lvl = getTreeUpgradeLevel(upg) + add

	if (upg == 1) return pow2(lvl * 2).mul(50)
	if (upg == 2) return pow2(lvl * (lvl + 3)).mul(600)
	if (upg == 3) return pow2(lvl * 5).mul(3e9)
	if (upg == 4) return pow2(lvl).mul(1e12)
	if (upg == 5) return pow2(lvl).mul(4e12)
	if (upg == 6) return E_pow(6, lvl).mul(1e21)
	if (upg == 7) return pow2(lvl * 4).mul(4e22)
	if (upg == 8) return pow2(lvl).mul(3e23)
	if (upg == 9) return pow10(lvl).mul(1e50)
	if (upg == 10) return pow10(lvl).mul(1e60)
	if (upg == 11) return pow10(lvl).mul(1e70)
	if (upg == 12) return pow10((lvl + 5) * (lvl + 15))
	return E(1/0)
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

function getTreeUpgradeEffect(upg) {
	let lvl = getTreeUpgradeLevel(upg)
	if (upg == 12) return lvl / 3

	lvl *= tmp.qu.tree_str
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
	if (upg == 9) return lvl * 10
	if (upg == 10) return lvl * 1e4
	if (upg == 11) return lvl / 200 + 1
	return 0
}

function getTreeUpgradeEffectDesc(upg) {
	let eff = getTreeUpgradeEffect(upg)

	if (upg == 1) return getFullExpansion(eff)
	if (upg == 2) return getDilExp("TU3").toFixed(2) + " → " + getDilExp().toFixed(2)
	if (upg == 4) return "^" + getFullExpansion(Math.round(getPositronBoost("noTree"))) + " → ^" + getFullExpansion(Math.round(tmp.mpte))
	if (upg == 8) return eff.toFixed(2)
	return shortenMoney(eff)
}

var branchUpgCostScales = [[300, 15, 2], [50, 8, 1], [4e7, 7, 1]]
function getBranchUpgCost(upg, lvl) {
	var lvl = lvl || getBranchUpgLevel(upg)
	var scale = branchUpgCostScales[upg-1]
	return pow2(lvl * upg + Math.max(lvl - getBranchUpgScaleStart(upg), 0) * scale[2]).mul(scale[0])
}

function getBranchUpgScaleStart(upg) {
	var r = branchUpgCostScales[upg-1][1]
	if (hasNanoReward("decay_scale")) r += getNanorewardEff("decay_scale")
	return r
}

function buyBranchUpg(upg) {
	var bData = todSave.r

	if (bData.spin.lt(getBranchUpgCost(upg))) return
	bData.spin = bData.spin.sub(getBranchUpgCost(upg))
	bData.upgrades[upg] = getBranchUpgLevel(upg) + 1
}

function getBranchUpgLevel(upg) {
	return todSave.r.upgrades[upg] ?? 0
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
	for (var u = 1; u <= tmp.qu.tree_unls; u++) {
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
	for (var u = (weak ? 2 : 1); u <= 3; u++) {
		var scales = branchUpgCostScales[u - 1], scaleStart = getBranchUpgScaleStart(u)
		var ret = bData.spin.div(scales[0]).log(2) / u
		if (ret > scaleStart) ret = scaleStart + (ret - scaleStart) / (u + scales[2]) * u
		ret = Math.floor(ret) + 1

		if (getBranchUpgLevel(u) >= ret) continue
		bData.spin = bData.spin.sub(getBranchUpgCost(u, ret - 1))
		bData.upgrades[u] = ret
	}
}

function radioactiveDecay() {
	let data = todSave.r
	if (!data.quarks.gte(pow10(Math.pow(2, 50)))) return
	data.quarks = E(0)
	data.decays = data.decays === undefined ? 1 : data.decays + 1
}

function getRadioactiveDecays() {
	return todSave.r.decays || 0
}

function getTreeUpgradeEfficiencyText(){
	if (!shiftDown) return "Tree upgrade efficiency: "+(tmp.qu.tree_str * 100).toFixed(1)+"%"

	let text = ""
	if (todSave.r.decays) {
		text += "Radioactive Decays: +" + (todSave.r.decays / 3).toFixed(1) + "x, "
		if (hasBLMilestone(14)) text += "Bosonic Milestone 15: " + shorten(blEff(14)) + "x to prior, "
	}
	if (getTreeUpgradeLevel(12) > 0) text += "Tree Upgrade 12: +" + shorten(getTreeUpgradeEffect(12)) + "x, "
	if (hasNB(7)) text += "Neutrino Boost 7: +" + shorten(NT.eff("boost", 7)) + "x, "
	if (hasAch("ng3p62")) text += "'Finite Time' Reward: +0.1x, "

	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getTreeUpgradeEfficiency(mod) {
	let r = getRadioactiveDecays() / 3 + getTreeUpgradeEffect(12)

	if (hasBLMilestone(14)) r *= blEff(14)
	if (hasNB(7) && mod != "noNB") r += NT.eff("boost", 7, 0)
	if (hasAch("ng3p62")) r += 0.1
	return r + 1
}

function getRDNerf() {
	return getRadioactiveDecays() * 20
}

function getBU1Power() {
	let x = getBranchUpgLevel(1)
	if (hasBLMilestone(2)) x *= blEff(2)
	let s = Math.floor(Math.sqrt(0.25 + 2 * x / 120) - 0.5)
	return s * 120 + (x - s * (s + 1) * 60) / (s + 1)
}

function getBU2Power() {
	let x = getBranchUpgLevel(2)
	if (hasAch("ng3p94")) x += getRadioactiveDecays()
	return x
}

function getBranchUpgMult(upg) {
	if (upg == 1) return pow2(getBU1Power())
	else if (upg == 2) {
		let pow = getBU2Power()
		return {
			mult: pow2(pow),
			exp: pow2(pow - getRDNerf()).max(1),
		}
	}
	else if (upg == 3) return E_pow(4, getBranchUpgLevel(3))
} 

function treeOfDecayUpdating(diff){
	var branch = todSave.r
	var decayRate = getDecayRate("r")
	var decayPower = getRDNerf("r")
			
	var mult = pow2(decayPower)
	var power = Decimal.div(branch.quarks.gt(mult)?branch.quarks.div(mult).log(2)+1:branch.quarks.div(mult),decayRate)
	var decayed = power.min(diff)
	power = power.sub(decayed).mul(decayRate)

	var sProd = getQuarkSpinProduction("r")
	branch.quarks = power.gt(1) ? pow2(power-1).mul(mult) : power.mul(mult)	
	branch.spin = branch.spin.add(sProd.mul(hasBraveMilestone(4) && isAutoGhostActive(1) && getUnstableGain("r").gt(0) ? diff : decayed))	
}
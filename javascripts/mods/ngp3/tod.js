function getLogTotalSpin() {
	return tmp.qu.tod.r.spin.plus(tmp.qu.tod.b.spin).plus(tmp.qu.tod.g.spin).add(1).log10()
}

function updateToDSpeedDisplay(){
	let t = ''
	if (shiftDown) t = getBranchSpeedText()
	else t = "Branch speed: " + (todspeed == 1 ? "" : shorten(tmp.branchSpeed) + " * " + shorten(todspeed) + " = ") + shorten(getBranchFinalSpeed()) + "x" + " (hold shift for details)"
	document.getElementById("todspeed").textContent = t
}

function getTreeUpgradeEfficiencyDisplay(){
	s = 'getTreeUpgradeEfficiencyText()'
	if (!shiftDown) s = '"Tree upgrade efficiency: "+(tmp.tue*100).toFixed(1)+"%"'
	return s
}

function updateTreeOfDecayTab(){
	var branchNum
	var colors = ["red", "green", "blue"]
	var shorthands = ["r", "g", "b"]
	if (document.getElementById("redBranch").style.display == "block") branchNum = 1
	if (document.getElementById("greenBranch").style.display == "block") branchNum = 2
	if (document.getElementById("blueBranch").style.display == "block") branchNum = 3
	for (var c = 0; c < 3; c++) {
		var color = colors[c]
		var shorthand = shorthands[c]
		var branch = tmp.qu.tod[shorthand]
		var name = color + " " + getUQName(shorthand) + " quarks"
		var rate = getDecayRate(shorthand)
		var linear = Decimal.pow(2, getRDPower(shorthand))
		document.getElementById(color+"UnstableGain").className = tmp.qu.usedQuarks[shorthand].gt(0) && getUnstableGain(shorthand).gt(branch.quarks) ? "storebtn" : "unavailablebtn"
		document.getElementById(color+"UnstableGain").textContent = "Gain " + shortenMoney(getUnstableGain(shorthand)) + " " + name + (player.ghostify.milestones > 3 ? "." : ", but lose all your " + color + " quarks.")
		document.getElementById(color+"QuarkSpin").textContent = shortenMoney(branch.spin)
		document.getElementById(color+"UnstableQuarks").textContent = shortenMoney(branch.quarks)
		document.getElementById(color+"QuarksDecayRate").textContent = branch.quarks.lt(linear) && rate.lt(1) ? "You are losing " + shorten(linear.times(rate)) + " " + name + " per second" : "Their half-life is " + timeDisplayShort(Decimal.div(10,rate), true, 2) + (linear.eq(1) ? "" : " until their amount reaches " + shorten(linear))
		document.getElementById(color+"QuarksDecayTime").textContent = timeDisplayShort(Decimal.div(10,rate).times(branch.quarks.gt(linear) ? branch.quarks.div(linear).log(2) + 1 : branch.quarks.div(linear)))
		let ret = getQuarkSpinProduction(shorthand)
		document.getElementById(color+"QuarkSpinProduction").textContent = "+" + shortenMoney(ret) + "/s"
		if (branchNum == c + 1) {
			var decays = getRadioactiveDecays(shorthand)
			var power = Math.floor(getBU1Power(shorthand) / 120 + 1)			
			document.getElementById(color+"UpgPow1").textContent = decays || power > 1 ? shorten(Decimal.pow(2, (1 + decays * .1) / power)) : 2
			document.getElementById(color+"UpgSpeed1").textContent = decays > 2 || power > 1 ? shorten(Decimal.pow(2, Math.max(.8 + decays * .1, 1) / power)) : 2
			for (var u = 1; u < 4; u++) document.getElementById(color + "upg" + u).className = "gluonupgrade " + (branch.spin.lt(getBranchUpgCost(shorthand, u)) ? "unavailablebtn" : shorthand)
			if (ghostified) document.getElementById(shorthand+"RadioactiveDecay").className = "gluonupgrade "  +(branch.quarks.lt(Decimal.pow(10, Math.pow(2, 50))) ? "unavailablebtn" : shorthand)
		}
	} //for loop
	if (!branchNum) {
		var start = getLogTotalSpin() > 500 ? "" : "Cost: "
		var end = getLogTotalSpin() > 500 ? "" : " quark spin"
		for (var u = 1; u <= 8; u++) {
			var lvl = getTreeUpgradeLevel(u)
			document.getElementById("treeupg" + u).className = "gluonupgrade " + (canBuyTreeUpg(u) ? shorthands[getTreeUpgradeLevel(u) % 3] : "unavailablebtn")
			document.getElementById("treeupg" + u + "current").textContent = getTreeUpgradeEffectDesc(u)
			document.getElementById("treeupg" + u + "lvl").textContent = getFullExpansion(lvl) + (tmp.tue > 1 ? " -> " + getFullExpansion(Math.floor(lvl * tmp.tue)) : "")
			document.getElementById("treeupg" + u + "cost").textContent = start + shortenMoney(getTreeUpgradeCost(u)) + " " + colors[lvl % 3] + end
		}
		setAndMaybeShow("treeUpgradeEff", ghostified, '"Tree upgrade efficiency: "+(tmp.tue*100).toFixed(1)+"%"')
		// I want to make it getTreeUpgradeEfficiencyDisplay(), but that doesnt work, so leaveing it out for now
	}
	updateToDSpeedDisplay()
}

function updateTODStuff() {
	if (player.masterystudies ? !player.masterystudies.includes("d13") : true) {
		document.getElementById("todtabbtn").style.display = "none"
		return
	} else {
		document.getElementById("todtabbtn").style.display = ""
		giveAchievement("Do protons decay?")
	}
	var colors = ["red", "green", "blue"]
	var shorthands = ["r", "g", "b"]
	for (var c = 0; c < 3; c++) {
		var color = colors[c]
		var shorthand = shorthands[c]
		var branch = tmp.qu.tod[shorthand]
		var name = getUQName(shorthand)
		document.getElementById(shorthand+"UQName").textContent = name
		for (var b = 1; b < 4; b++) {
			document.getElementById(color + "upg" + b + "current").textContent = shortenDimensions(getBranchUpgMult(shorthand, b))
			document.getElementById(color + "upg" + b + "cost").textContent = shortenMoney(getBranchUpgCost(shorthand, b))
			if (b>1) document.getElementById(color+"UpgName"+b).textContent=name
		}
		if (ghostified) {
			document.getElementById(shorthand+"RadioactiveDecay").parentElement.parentElement.style.display = ""
			document.getElementById(shorthand+"RDReq").textContent = "(requires "+shorten(Decimal.pow(10, Math.pow(2, 50))) + " of " + color + " " + getUQName(shorthand) + " quarks)"
			document.getElementById(shorthand+"RDLvl").textContent = getFullExpansion(getRadioactiveDecays(shorthand))
		} else document.getElementById(shorthand+"RadioactiveDecay").parentElement.parentElement.style.display = "none"
	}
}

function showBranchTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('branchtab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName + "Branch") {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab !== tabName) player.aarexModifications.tabsSave.tabBranch = tabName
	closeToolTip()
}

function getUnstableGain(branch) {
	let ret = tmp.qu.usedQuarks[branch].div("1e420").add(1).log10()
	if (ret < 2) ret = Math.max(tmp.qu.usedQuarks[branch].div("1e300").div(99).log10() / 60,0)
	let power = getBranchUpgLevel(branch, 2) - getRDPower(branch)
	ret = Decimal.pow(2, power).times(ret)
	if (ret.gt(1)) ret = Decimal.pow(ret, Math.pow(2, power + 1))
	return ret.times(Decimal.pow(2, getRDPower(branch) + 1)).min(Decimal.pow(10, Math.pow(2, 51)))
}


function unstableQuarks(branch) {
	if (tmp.qu.usedQuarks[branch].eq(0) || getUnstableGain(branch).lte(tmp.qu.tod[branch].quarks)) return
	tmp.qu.tod[branch].quarks = tmp.qu.tod[branch].quarks.max(getUnstableGain(branch))
	if (player.ghostify.milestones < 4) tmp.qu.usedQuarks[branch] = new Decimal(0)
	if (player.ghostify.reference > 0) player.ghostify.reference--
	if (player.unstableThisGhostify) player.unstableThisGhostify ++
	else player.unstableThisGhostify = 10
}

function getBranchSpeedText(){
	let text = ""
	if (new Decimal(getTreeUpgradeEffect(3)).gt(1)) text += "Tree Upgrade 3: " + shorten(getTreeUpgradeEffect(3)) + "x, "
	if (new Decimal(getTreeUpgradeEffect(5)).gt(1)) text += "Tree Upgrade 5: " + shorten(getTreeUpgradeEffect(5)) + "x, "
	if (player.masterystudies.includes("t431")) if (getMTSMult(431).gt(1)) text += "Mastery Study 431: " + shorten(getMTSMult(431)) + "x, "
	if (hasNU(4)) if (tmp.nu[2].gt(1)) text += "Fourth Neutrino Upgrade: " + shorten(tmp.nu[2]) + "x, "
	if (!tmp.ngp3l) if (player.achievements.includes("ng3p58")) if (player.meta.resets > 1) text += "'Are you currently dying?' reward: " + shorten (Math.sqrt(player.meta.resets + 1)) + "x, "
	if (player.ghostify.milestones >= 14) text += "Brave Milestone 14: " + shorten(getMilestone14SpinMult()) + "x, "
	if (todspeed) if (todspeed > 1) text += "ToD Speed: " + shorten(todspeed) + "x, "
	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getBranchSpeed() { // idea: when you hold shift you can see where the multipliers of branch speed are
	let x = Decimal.times(getTreeUpgradeEffect(3), getTreeUpgradeEffect(5))
	if (player.masterystudies.includes("t431")) x = x.times(getMTSMult(431))
	if (tmp.qu.bigRip.active && isBigRipUpgradeActive(19)) x = x.times(tmp.bru[19])
	if (hasNU(4)) x = x.times(tmp.nu[2])
	if (!tmp.ngp3l) {
		if (player.achievements.includes("ng3p58")) x = x.times(Math.sqrt(player.meta.resets + 1))
	}
	if (player.ghostify.milestones >= 14) x = x.times(getMilestone14SpinMult())
	return x
}

function getBranchFinalSpeed() {
	return tmp.branchSpeed.times(todspeed)
}

function getDecayRate(branch) {
	let ret = Decimal.pow(2, getBU1Power(branch) * Math.max((getRadioactiveDecays(branch) - 8) / 10, 1)).div(getBranchUpgMult(branch, 3)).div(Decimal.pow(2, Math.max(0, getRDPower(branch) - 4)))
	if (branch == "r") {
		if (GUBought("rg8")) ret = ret.div(getGU8Effect("rg"))
	}
	if (branch == "g") {
		if (GUBought("gb8")) ret = ret.div(getGU8Effect("gb"))
	}
	if (branch == "b") {
		if (GUBought("br8")) ret = ret.div(getGU8Effect("br"))
	}
	ret = ret.times(getBranchFinalSpeed())
	return ret.min(Math.pow(2, 40)).times(todspeed)
}

function getMilestone14SpinMult(){
	var logSpin = getLogTotalSpin()
	if (logSpin <= 25 || tmp.ngp3l) return 10
	return Math.pow(logSpin, 2) / 625 * 10
}

function getQuarkSpinProduction(branch) {
	let ret = getBranchUpgMult(branch, 1).times(getBranchFinalSpeed())
	if (hasNU(4)) ret = ret.times(tmp.nu[2])
	if (player.achievements.includes("ng3p74")) if (tmp.qu.tod[branch].decays) ret = ret.times(1 + tmp.qu.tod[branch].decays)
	if (tmp.qu.bigRip.active) {
		if (isBigRipUpgradeActive(18)) ret = ret.times(tmp.bru[18])
		if (isBigRipUpgradeActive(19)) ret = ret.times(tmp.bru[19])
		if (hasNU(12)) ret = ret.times(tmp.nu[4].normal)
	}
	if (!tmp.ngp3l) ret = ret.times(Decimal.pow(1.1, player.quantum.nanofield.rewards - 12))
	ret = ret.times(todspeed)
	return ret
}

function getTreeUpgradeCost(upg,add) {
	let lvl = getTreeUpgradeLevel(upg)
	if (add !== undefined) lvl += add
	if (upg == 1) return Decimal.pow(2, lvl * 2 + Math.max(lvl - 35, 0) * (lvl - 34) / 2).times(50)
	if (upg == 2) return Decimal.pow(4, lvl * (lvl + 3) / 2).times(600)
	if (upg == 3) return Decimal.pow(32, lvl).times(3e9)
	if (upg == 4) return Decimal.pow(2, lvl + Math.max(lvl - 37, 0) * (lvl - 36) / 2).times(1e12)
	if (upg == 5) return Decimal.pow(2, lvl + Math.max(lvl - 35, 0) * (lvl - 34) / 2).times(4e12)
	if (upg == 6) return Decimal.pow(4, lvl * (lvl + 3) / 2).times(6e22)
	if (upg == 7) return Decimal.pow(16, lvl * lvl).times(4e22)
	if (upg == 8) return Decimal.pow(2, lvl).times(3e23)
	return 0
}

function canBuyTreeUpg(upg) {
	var shorthands = ["r", "g", "b"]
	return getTreeUpgradeCost(upg).lte(tmp.qu.tod[shorthands[getTreeUpgradeLevel(upg) % 3]].spin)
}

function buyTreeUpg(upg) {
	if (!canBuyTreeUpg(upg)) return
	var colors = ["red", "green", "blue"]
	var shorthands = ["r", "g", "b"]
	var branch = tmp.qu.tod[shorthands[getTreeUpgradeLevel(upg) % 3]]
	branch.spin = branch.spin.sub(getTreeUpgradeCost(upg))
	if (!tmp.qu.tod.upgrades[upg]) tmp.qu.tod.upgrades[upg] = 0
	tmp.qu.tod.upgrades[upg]++
}

function getTreeUpgradeLevel(upg) {
	return tmp.qu.tod.upgrades[upg] || 0
}

function getTreeUpgradeEffect(upg) {
	let lvl = getTreeUpgradeLevel(upg) * tmp.tue
	if (upg == 1) {
		if (lvl >= 500) lvl = 500 * Math.pow(lvl / 500,.9)
		return Math.floor(lvl * 30)
	}
	if (upg == 2) {
		if (lvl > 64) lvl = (lvl + 128) / 3
		return lvl * 0.25
	}
	if (upg == 3) {
		if (lvl < 1) return 1
		let power = 0
		for (var upg = 1; upg < 9; upg++) power += getTreeUpgradeLevel(upg)
		return Decimal.pow(2,Math.sqrt(Math.sqrt(Math.max(lvl * 3 - 2, 0)) * Math.max(power - 10, 0)))
	}
	if (upg == 4) return Math.sqrt(1 + Math.log10(lvl * 0.5 + 1) * 0.1)
	if (upg == 5) {
		if (lvl > 500) lvl += Math.sqrt(lvl + 125) - 25
		return Math.pow(Math.log10(player.meta.bestOverQuantums.add(1).log10() + 1) / 5 + 1, Math.sqrt(lvl))
	}
	if (upg == 6) {
		return Decimal.pow(2, lvl)
	}
	if (upg == 7) {
		if (lvl > 100) lvl -= Math.sqrt(lvl) - 10
		return Decimal.pow(player.replicanti.amount.max(1).log10() + 1, 0.25 * lvl)
	}
	if (upg == 8) {
		if (lvl > 1111) lvl = 1111 + (lvl - 1111) / 2
		return Math.log10(Decimal.add(player.meta.bestAntimatter, 1).log10() + 1) / 4 * Math.sqrt(lvl)
	}
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
	return Decimal.pow(2, lvl * upg + Math.max(lvl - scale[1], 0) * Math.max(3 - upg, 1)).times(scale[0])
}

function buyBranchUpg(branch, upg) {
	var colors = {r: "red", g: "green", b: "blue"}
	var bData = tmp.qu.tod[branch]
	if (bData.spin.lt(getBranchUpgCost(branch,upg))) return
	bData.spin = bData.spin.sub(getBranchUpgCost(branch, upg))
	if (bData.upgrades[upg] == undefined) bData.upgrades[upg] = 0
	bData.upgrades[upg]++
	var end = (upg == 3 && getBranchUpgLevel(branch, upg) > 1000) ? " (softcapped)" : ""
	document.getElementById(colors[branch] + "upg" + upg + "current").textContent = shortenDimensions(getBranchUpgMult(branch, upg)) + end
	document.getElementById(colors[branch] + "upg" + upg + "cost").textContent = shortenMoney(getBranchUpgCost(branch, upg))
}

function getBranchUpgLevel(branch,upg) {
	upg = tmp.qu.tod[branch].upgrades[upg]
	if (upg) return upg
	return 0
}

var todspeed = 1

function rotateAutoAssign() {
	tmp.qu.autoOptions.assignQKRotate = tmp.qu.autoOptions.assignQKRotate ? (tmp.qu.autoOptions.assignQKRotate + 1) % 3 : 1
	document.getElementById('autoAssignRotate').textContent = "Rotation: " + (tmp.qu.autoOptions.assignQKRotate > 1 ? "Left" : tmp.qu.autoOptions.assignQKRotate ? "Right" : "None")
}

function unstableAll() {
	var colors = ["r", "g", "b"]
	for (var c = 0; c < 3; c++) {
		var bData = tmp.qu.tod[colors[c]]
		if (tmp.qu.usedQuarks[colors[c]].gt(0) && getUnstableGain(colors[c]).gt(bData.quarks)) {
			bData.quarks = bData.quarks.max(getUnstableGain(colors[c]))
			if (player.ghostify.milestones < 4) tmp.qu.usedQuarks[colors[c]] = new Decimal(0)
		}
		player.unstableThisGhostify ++
	}
	updateColorCharge()
	updateQuantumWorth()
}

function getUQName(shorthand) {
	let ret = "unstable"
	if (tmp.qu.tod[shorthand].decays !== undefined) {
		let amt = tmp.qu.tod[shorthand].decays
		if (amt > 4) ret = "ghostly" + (amt > 9 ? "^" + Math.floor(amt / 5) : "") + " " + ret
		if (amt % 5) ret = (["radioactive", "infinity", "eternal", "quantum"])[amt % 5 - 1] + " " + ret
	}
	return ret
}

function maxTreeUpg() {
	var update = false
	var colors = ["r", "g", "b"]
	var todData = tmp.qu.tod
	for (var u = 1; u <= 8; u++) {
		var cost = getTreeUpgradeCost(u)
		var newSpins = []
		var lvl = getTreeUpgradeLevel(u)
		var min
		for (var c = 0; c < 3; c++) {
			min = todData[colors[c]].spin.min(c ? min : 1/0)
			newSpins[c] = todData[colors[c]].spin
		}
		if (newSpins[lvl % 3].gte(cost)) {
			var increment = 1
			while (newSpins[(lvl + increment - 1) % 3].gte(getTreeUpgradeCost(u, increment - 1))) increment *= 2
			var toBuy = 0
			while (increment >= 1) {
				if (newSpins[(lvl + toBuy + increment - 1) % 3].gte(getTreeUpgradeCost(u, toBuy + increment - 1))) toBuy += increment
				increment /= 2
			}
			var cost = getTreeUpgradeCost(u, toBuy - 1)
			var toBuy2 = toBuy
			while (toBuy > 0 && newSpins[(lvl + toBuy - 1) % 3].div(cost).lt(1e16)) {
				if (newSpins[(lvl + toBuy - 1) % 3].gte(cost)) newSpins[(lvl + toBuy - 1) % 3]=newSpins[(lvl + toBuy - 1) % 3].sub(cost)
				else {
					newSpins[(lvl + toBuy - 1) % 3] = todData[colors[(lvl + toBuy - 1) % 3]].spin.sub(cost)
					toBuy2--
				}
				toBuy--
				cost = getTreeUpgradeCost(u, toBuy - 1)
			}
			if (toBuy2) {
				for (c = 0; c < 3; c++) todData[colors[c]].spin = isNaN(newSpins[c].e) ? new Decimal(0) : newSpins[c]
				todData.upgrades[u] = toBuy2 + (todData.upgrades[u] === undefined ? 0 : todData.upgrades[u])
				update = true
			}
		}
	}
}

function maxBranchUpg(branch, weak) {
	var colors = {r: "red", g: "green", b: "blue"}
	var bData = tmp.qu.tod[branch]
	for (var u = (weak ? 2 : 1); u < 4; u++) {
		var oldLvl = getBranchUpgLevel(branch, u)
		var scaleStart = branchUpgCostScales[u - 1][1]
		var cost = getBranchUpgCost(branch, u)
		if (bData.spin.gte(cost) && oldLvl < scaleStart) {
			var costMult = Math.pow(2, u)
			var toAdd = Math.min(Math.floor(bData.spin.div(cost).times(costMult - 1).add(1).log(costMult)),scaleStart - oldLvl)
			bData.spin = bData.spin.sub(Decimal.pow(costMult, toAdd).sub(1).div(costMult).times(cost).min(bData.spin))
			if (bData.upgrades[u] === undefined) bData.upgrades[u] = 0
			bData.upgrades[u] += toAdd
			cost = getBranchUpgCost(branch, u)
		}
		if (bData.spin.gte(cost) && bData.upgrades[u] >= scaleStart) {
			var costMult = Math.pow(2, u + Math.max(3 - u, 1))
			var toAdd = Math.floor(bData.spin.div(cost).times(costMult-1).add(1).log(costMult))
			bData.spin = bData.spin.sub(Decimal.pow(costMult,toAdd).sub(1).div(costMult).times(cost).min(bData.spin))
			if (bData.upgrades[u] === undefined) bData.upgrades[u] = 0
			bData.upgrades[u] += toAdd
		}
		if (bData.upgrades[u] > oldLvl) {
			var end = (u == 3 && getBranchUpgLevel(branch, u) > 1000) ? " (softcapped)" : ""
			document.getElementById(colors[branch] + "upg" + u + "current").textContent=shortenDimensions(getBranchUpgMult(branch, u)) + end
			document.getElementById(colors[branch] + "upg" + u + "cost").textContent=shortenMoney(getBranchUpgCost(branch, u))
		}
	}
}

function radioactiveDecay(shorthand) {
	let data = tmp.qu.tod[shorthand]
	if (!data.quarks.gte(Decimal.pow(10, Math.pow(2, 50)))) return
	data.quarks = new Decimal(0)
	data.spin = new Decimal(0)
	data.upgrades = {}
	if (player.ghostify.milestones > 3) data.upgrades[1] = 5
	data.decays = data.decays === undefined ? 1 : data.decays + 1
	let sum = 0
	for (var c = 0; c < 3; c++) sum += getRadioactiveDecays((['r', 'g', 'b'])[c])
	if (sum > 9) giveAchievement("Radioactive Decaying to the max!")
	updateTODStuff()
}

function getRadioactiveDecays(shorthand) {
	let data = tmp.qu.tod[shorthand]
	return data.decays || 0
}

function getMinimumUnstableQuarks() {
	let r={quarks:new Decimal(1/0),decays:1/0}
	let c=["r","g","b"]
	for (var i=0;i<3;i++) {
		let b=tmp.qu.tod[c[i]]
		let d=b.decays||0
		if (r.decays>d||(r.decays==d&&b.quarks.lte(r.quarks))) r={quarks:b.quarks,decays:d}
	}
	return r
}

function getMaximumUnstableQuarks() {
	let r = {quarks:new Decimal(0),decays:0}
	let c = ["r","g","b"]
	for (var i = 0; i < 3; i++) {
		let b = tmp.qu.tod[c[i]]
		let d = b.decays || 0
		if (r.decays < d || (r.decays == d && b.quarks.gte(r.quarks))) r = {quarks: b.quarks, decays: d}
	}
	return r
}

function getTreeUpgradeEfficiencyText(){
	let text = ""
	if (player.ghostify.neutrinos.boosts >= 7) text += "Neutrino Boost 7: +" + shorten(tmp.nb[7]) + ", "
	if (!tmp.ngp3l) {
		if (player.achievements.includes("ng3p62") && !tmp.qu.bigRip.active) text += "Finite Time Reward: +10%, "
		if (hasBosonicUpg(43)) text += "Bosonic Lab Upgrade 18: " + shorten(tmp.blu[43]) + "x, "
	}
	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getTreeUpgradeEfficiency(mod) {
	let r = 1
	if (player.ghostify.neutrinos.boosts >= 7 && (tmp.qu.bigRip.active || mod == "br") && mod != "noNB") r += tmp.nb[7]
	if (!tmp.ngp3l) {
		if (player.achievements.includes("ng3p62") && !tmp.qu.bigRip.active) r += 0.1
		if (hasBosonicUpg(43)) r *= tmp.blu[43]
	}
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
	if (player.achievements.includes("ng3p94")) x += getRadioactiveDecays(branch)
	return x
}

function getBranchUpgMult(branch, upg) {
	if (upg == 1) return Decimal.pow(2, getBU1Power(branch) * (getRadioactiveDecays(branch) / 10 + 1))
	else if (upg == 2) return Decimal.pow(2, getBU2Power(branch))
	else if (upg == 3) {
		l = getBranchUpgLevel(branch, 3)
		if (l > 1000) l = 1000 * Math.sqrt(l / 1000)
		return Decimal.pow(4, l)
	}
} 
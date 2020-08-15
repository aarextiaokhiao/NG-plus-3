function getLogTotalSpin() {
	return tmp.qu.tod.r.spin.plus(tmp.qu.tod.b.spin).plus(tmp.qu.tod.g.spin).add(1).log10()
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
	}
	document.getElementById("todspeed").textContent = "Branch speed: " + (todspeed == 1 ? "" : shorten(tmp.branchSpeed) + " * " + shorten(todspeed) + " = ") + shorten(getBranchFinalSpeed()) + "x"
}

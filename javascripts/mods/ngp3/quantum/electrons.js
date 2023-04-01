function isPositronsOn() {
	return hasMasteryStudy("d7") && notInQC() && !dev.testZone
}

function updateElectronsTab() {
	el("normalGalaxies").textContent = getFullExpansion(player.galaxies)
	el("sacrificeGal").className = canSacrificeGalaxies() ? "storebtn positron" : "unavailablebtn"
	el("sacrificeGals").textContent = getFullExpansion(Math.max(player.galaxies-quSave.electrons.sacGals, 0))
	el("electronsGain").textContent = getFullExpansion(Math.floor(Math.max(player.galaxies-quSave.electrons.sacGals, 0) * getElectronGainFinalMult()))
	for (var u = 1; u < 5; u++) el("electronupg" + u).className = canBuyElectronUpg(u) ? "storebtn positron" : "unavailablebtn"
	if (quSave.autoOptions.sacrifice) updateElectronsEffect()
}

function updateElectrons(retroactive) {
	if (!isPositronsOn()) return

	var mult = getElectronGainFinalMult()
	el("electronsGainMult").textContent = mult.toFixed(2)
	if (retroactive) quSave.electrons.amount = getElectronGainFinalMult() * quSave.electrons.sacGals
	if (!quSave.autoOptions.sacrifice) updateElectronsEffect()
	for (var u = 1; u < 5; u++) {
		var cost = getElectronUpgCost(u)
		el("electronupg" + u).innerHTML = "+" + (getElectronGainMult() / 4).toFixed(2) + "x Positrons<br>" +
			"Level: " + getFullExpansion(quSave.electrons.rebuyables[u-1]) + "<br>" +
			"Requires: " + ((u == 4 ? getFullExpansion : shortenCosts)(cost)) + " " + [null, "Time Theorems", "dilated time", "meta-antimatter", "Meta-Dimension Boosts"][u]
	}
}

function updateElectronsEffect() {
	if (!quSave.autoOptions.sacrifice) tmp.mpte = getElectronBoost()
	el("sacrificedGals").textContent = getFullExpansion(quSave.electrons.sacGals)
	el("electronsAmount").textContent = getFullExpansion(Math.round(quSave.electrons.amount))
	el("electronsTranslation").textContent = "^"+getFullExpansion(Math.round(tmp.mpte))
	el("electronsEffect").textContent = shorten(getDimensionPowerMultiplier("non-random"))+"x"
	el("linearPerTenMult").textContent = shorten(getDimensionPowerMultiplier("linear"))+"x"
}

function canSacrificeGalaxies() {
	return isPositronsOn() && player.galaxies > quSave.electrons.sacGals && getElectronGainMult() > 0
}

function sacrificeGalaxy() {
	if (!canSacrificeGalaxies()) return

	var gain = player.galaxies - quSave.electrons.sacGals
	quSave.electrons.sacGals += gain
	quSave.electrons.amount += getElectronGainFinalMult() * gain

	if (!quSave.autoOptions.sacrifice) {
		updateElectronsEffect()
		galaxyReset(0)
	}
}

function getElectronBoost(mod) {
	var r = quSave.electrons.amount
	var ss = 8e4
	var ss_speed = 8e4
	if (hasNU(13)) ss += NT.eff("upg", 13, 0)
	if (r > ss) r = Math.sqrt((r - ss + ss_speed) * ss_speed) + ss - ss_speed

	if (hasGluonUpg("rg4") && mod != "no-rg4") r *= 0.7
	if (isDecayOn() && mod != "noTree") r *= getTreeUpgradeEffect(4)
	return r + 1
}

function getElectronGainMult() {
	return hasNU(5) ? 3 : 1
}

function getElectronGainFinalMult() {
	return quSave.electrons.mult * getElectronGainMult()
}

function getElectronUpgRes(u) {
	return E([null, player.timestudy.theorem, player.dilation.dilatedTime, player.meta.antimatter, player.meta.resets][u])
}

function getElectronUpgCost(u) {
	var amt = quSave.electrons.rebuyables[u-1]
	if (hasGluonUpg("gb5")) amt -= 0.3
	amt = Math.max(amt, 0)

	var base = amt * Math.max(amt - 1, 1) + 1
	base = Math.pow(base, getElectronUpgCostScalingExp(u))
	base + [null, 82, 153, 638, 26][u]

	if (u != 4) return pow10(base)
	return Math.floor(base)
}

function getElectronUpgCostScalingExp(u) {
	return (u == 1 || u == 4) ? 1 : 2
}

function buyElectronUpg(u, quick) {
	if (!canBuyElectronUpg(u)) return false
	quSave.electrons.rebuyables[u - 1]++
	if (quick) return true
	quSave.electrons.mult += 0.25
	updateElectrons(true)
}

function canBuyElectronUpg(id) {
	return getElectronUpgRes(id).gte(getElectronUpgCost(id))
}
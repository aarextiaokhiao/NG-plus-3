function updateElectronsTab() {
	el("normalGalaxies").textContent = getFullExpansion(player.galaxies)
	el("sacrificeGal").className = "gluonupgrade " + (canSacrificeGalaxies() ? "storebtn" : "unavailablebtn")
	el("sacrificeGals").textContent = getFullExpansion(Math.max(player.galaxies-quSave.electrons.sacGals, 0))
	el("electronsGain").textContent = getFullExpansion(Math.floor(Math.max(player.galaxies-quSave.electrons.sacGals, 0) * getElectronGainFinalMult()))
	for (var u = 1; u < 5; u++) el("electronupg" + u).className = "gluonupgrade " + (canBuyElectronUpg(u) ? "stor" : "unavailabl") + "ebtn"
	if (quSave.autoOptions.sacrifice) updateElectronsEffect()
}

function updateElectrons(retroactive) {
	if (!hasMasteryStudy("d7")) return

	var mult = getElectronGainFinalMult()
	el("electronsGainMult").textContent = mult.toFixed(2)
	if (retroactive) quSave.electrons.amount = getElectronGainFinalMult() * quSave.electrons.sacGals
	if (!quSave.autoOptions.sacrifice) updateElectronsEffect()
	for (var u = 1; u < 5; u++) {
		var cost = getElectronUpgCost(u)
		el("electronupg" + u).innerHTML = "+" + (getElectronGainMult() / 4).toFixed(2) + "x Electrons<br>" +
			"Level: " + getFullExpansion(quSave.electrons.rebuyables[u-1]) + "<br>" +
			"Cost: " + ((u == 4 ? getFullExpansion : shortenCosts)(cost)) + " " + [null, "Time Theorems", "dilated time", "meta-antimatter", "Meta-Dimension Boosts"][u]
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
	return getElectronGainMult() > 0 && player.galaxies > quSave.electrons.sacGals
}

function sacrificeGalaxy(auto = false) {
	if (!canSacrificeGalaxies()) return

	var gain = player.galaxies - quSave.electrons.sacGals
	quSave.electrons.sacGals += gain
	quSave.electrons.amount += getElectronGainFinalMult() * gain
	if (!quSave.autoOptions.sacrifice) updateElectronsEffect()
	galaxyReset(0)
}

function getElectronBoost(mod) {
	var r = quSave.electrons.amount
	var ss = 149840
	if (hasNU(13)) ss += tmp.nu[13]
	if (r > 37460 + ss) r = Math.sqrt((r - ss) * 37460) + ss

	if (hasGluonUpg("rg4") && mod != "no-rg4") r *= 0.7
	if (hasMasteryStudy("d13") && mod != "noTree") r *= getTreeUpgradeEffect(4)
	return r + 1
}

function getElectronGainMult() {
	let ret = 1
	if (hasNU(5)) ret = 3
	if (bigRipped()) ret *= PHOTON.eff(1)
	else if (!inQC(0)) return 0
	return ret
}

function getElectronGainFinalMult() {
	return quSave.electrons.mult * getElectronGainMult()
}

function getElectronUpgCost(u) {
	var amount = quSave.electrons.rebuyables[u-1]
	if (hasGluonUpg("gb5")) amount -= 0.3
	if (hasBU(33)) amount -= tmp.blu[33]

	var base = amount * Math.max(amount - 1, 1) + 1
	var exp = getElectronUpgCostScalingExp(u)
	if (exp != 1) {
		if (base < 0) base = -Math.pow(-base, exp)
		else base = Math.pow(base, exp)
	}
	base += ([null, 82, 153, 638, 26])[u]

	if (u == 1) return Math.pow(10, base)
	if (u == 4) return Math.max(Math.floor(base), 0)
	return pow10(base)
}

function getElectronUpgCostScalingExp(u) {
	if (u == 1 || u == 4) return 1
	return 2
}

function buyElectronUpg(u, quick) {
	if (!canBuyElectronUpg(u)) return false
	var cost = getElectronUpgCost(u)
	if (u == 1) player.timestudy.theorem -= cost
	else if (u == 2) player.dilation.dilatedTime = player.dilation.dilatedTime.sub(cost)
	else if (u == 3) player.meta.antimatter = player.meta.antimatter.sub(cost)
	else if (u == 4 && !hasAch("ng3p64")) {
		player.meta.resets -= cost
		player.meta.antimatter = getMetaAntimatterStart()
		clearMetaDimensions()
		for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) el(i + "MetaRow").style.display = "none"
	}
	quSave.electrons.rebuyables[u - 1]++
	if (quick) return true
	quSave.electrons.mult += 0.25
	updateElectrons(true)
}

function canBuyElectronUpg(id) {
	if (!inQC(0)) return false
	if (id > 3) return player.meta.resets >= getElectronUpgCost(4)
	if (id > 2) return player.meta.antimatter.gte(getElectronUpgCost(3))
	if (id > 1) return player.dilation.dilatedTime.gte(getElectronUpgCost(2))
	return player.timestudy.theorem >= getElectronUpgCost(1)
}
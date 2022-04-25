function updateElectronsTab() {
	el("normalGalaxies").textContent = getFullExpansion(player.galaxies)
	el("sacrificeGal").className = "gluonupgrade " + ((player.galaxies > quSave.electrons.sacGals && inQC(0)) ? "stor" : "unavailabl") + "ebtn"
	el("sacrificeGals").textContent = getFullExpansion(Math.max(player.galaxies-quSave.electrons.sacGals, 0))
	el("electronsGain").textContent = getFullExpansion(Math.floor(Math.max(player.galaxies-quSave.electrons.sacGals, 0) * getElectronGainFinalMult()))
	for (var u = 1; u < 5; u++) el("electronupg" + u).className = "gluonupgrade " + (canBuyElectronUpg(u) ? "stor" : "unavailabl") + "ebtn"
	if (quSave.autoOptions.sacrifice) updateElectronsEffect()
}

function updateElectrons(retroactive) {
	if (!tmp.ngp3 || !player.masterystudies.includes("d7")) {
		el("electronstabbtn").style.display = "none"
		return
	} else el("electronstabbtn").style.display = ""
	var mult = getElectronGainFinalMult()
	el("electronsGainMult").textContent = mult.toFixed(2)
	if (retroactive) quSave.electrons.amount = getElectronGainFinalMult() * quSave.electrons.sacGals
	if (!quSave.autoOptions.sacrifice) updateElectronsEffect()
	for (var u = 1; u < 5; u++) {
		var cost = getElectronUpgCost(u)
		el("electronupg" + u).innerHTML = "Increase the multiplier by " + (getElectronGainMult() * getElectronUpgIncrease(u)).toFixed(2) + "x.<br>" +
			"Level: " + getFullExpansion(quSave.electrons.rebuyables[u-1]) + "<br>" +
			"Cost: " + ((u == 4 ? getFullExpansion : shortenCosts)(cost)) + " " + [null, "Time Theorems", "dilated time", "meta-antimatter", "Meta-Dimension Boosts"][u]
	}
}

function updateElectronsEffect() {
	if (!quSave.autoOptions.sacrifice) {
		tmp.mpte = getElectronBoost()
		el("electronsAmount2").textContent = "You have " + getFullExpansion(Math.round(quSave.electrons.amount)) + " electrons."
	}
	el("sacrificedGals").textContent = getFullExpansion(quSave.electrons.sacGals)
	el("electronsAmount").textContent = getFullExpansion(Math.round(quSave.electrons.amount))
	el("electronsTranslation").textContent = getFullExpansion(Math.round(tmp.mpte))
	el("electronsEffect").textContent = shorten(getDimensionPowerMultiplier("non-random"))
	el("linearPerTenMult").textContent = shorten(getDimensionPowerMultiplier("linear"))
}

function sacrificeGalaxy(auto = false) {
	var amount = player.galaxies - quSave.electrons.sacGals
	if (amount < 1) return
	if (player.options.sacrificeConfirmation && !auto) if (!confirm("You will perform a Galaxy reset, but you will exchange all your galaxies to electrons, which will give a boost to your Multiplier per Ten Dimensions.")) return
	quSave.electrons.sacGals = player.galaxies
	quSave.electrons.amount += getElectronGainFinalMult() * amount
	if (!quSave.autoOptions.sacrifice) updateElectronsEffect()
	if (!auto) galaxyReset(0)
}

function getElectronBoost(mod) {
	if (!inQC(0)) return 1
	var amount = quSave.electrons.amount

	var s = 149840
	if (NF.active(4)) s += NF.eff(4)
	if (ghSave.ghostlyPhotons.unl) s += tmp.le[2]
	
	if (amount > 37460 + s) amount = Math.sqrt((amount-s) * 37460) + s
	if (tmp.rg4 && mod != "no-rg4") amount *= 0.7
	if (player.masterystudies !== undefined && player.masterystudies.includes("d13") && mod != "noTree") amount *= getTreeUpgradeEffect(4)
	amount += 1
	return amount
}

function getElectronGainMult() {
	let ret = 1
	if (hasNU(5)) ret *= 3
	return ret
}

function getElectronGainFinalMult() {
	return quSave.electrons.mult * getElectronGainMult()
}

function getElectronUpgCost(u) {
	var amount = quSave.electrons.rebuyables[u-1]
	if (hasBosonicUpg(33)) amount -= tmp.blu[33]
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
	if (u == 1) return 1
	return 2
}

function getElectronUpgIncrease(u) {
	return 0.25
}

function buyElectronUpg(u, quick) {
	if (!canBuyElectronUpg(u)) return false
	var cost = getElectronUpgCost(u)
	if (u == 1) player.timestudy.theorem -= cost
	else if (u == 2) player.dilation.dilatedTime = player.dilation.dilatedTime.sub(cost)
	else if (u == 3) player.meta.antimatter = player.meta.antimatter.sub(cost)
	else if (u == 4 && (tmp.ngp3l || !hasAch("ng3p64"))) {
		player.meta.resets -= cost
		player.meta.antimatter = getMetaAntimatterStart()
		clearMetaDimensions()
		for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) el(i + "MetaRow").style.display = "none"
	}
	quSave.electrons.rebuyables[u - 1]++
	if (quick) return true
	quSave.electrons.mult += getElectronUpgIncrease(u)
	updateElectrons(!tmp.ngp3l)
}

function canBuyElectronUpg(id) {
	if (!inQC(0)) return false
	if (id > 3) return player.meta.resets >= getElectronUpgCost(4)
	if (id > 2) return player.meta.antimatter.gte(getElectronUpgCost(3))
	if (id > 1) return player.dilation.dilatedTime.gte(getElectronUpgCost(2))
	return player.timestudy.theorem >= getElectronUpgCost(1)
}

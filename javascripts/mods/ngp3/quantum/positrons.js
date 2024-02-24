function isPositronsOn() {
	return hasMasteryStudy("d7") && notInQC() && !dev.testZone
}

function updatePositronsTab() {
	el("normalGalaxies").textContent = getFullExpansion(player.galaxies)
	el("sacrificeGal").className = canSacrificeGalaxies() ? "storebtn positron" : "unavailablebtn"
	el("sacrificeGals").textContent = getFullExpansion(Math.max(player.galaxies-quSave.electrons.sacGals, 0))
	el("positronsGain").textContent = getFullExpansion(Math.floor(Math.max(player.galaxies-quSave.electrons.sacGals, 0) * getPositronGainFinalMult()))
	for (var u = 1; u <= 4; u++) el("positronupg" + u).className = canBuyPositronUpg(u) ? "storebtn positron" : "unavailablebtn"

	updatePositrons()
	updatePositronsEffect()
}

function updatePositrons() {
	if (!isPositronsOn()) return

	var mult = getPositronGainFinalMult()
	el("positronsGainMult").textContent = mult.toFixed(2)

	for (var u = 1; u <= 4; u++) {
		var cost = getPositronUpgCost(u)
		el("positronupg" + u).innerHTML = "+" + (getPositronGainMult() / 4).toFixed(2) + "x Positrons " +
			"(" + getFullExpansion(quSave.electrons.rebuyables[u-1]) + ")<br>" +
			((u == 4 ? getFullExpansion : shortenCosts)(cost)) + " " + [null, "Time Theorems", "dilated time", "meta-Antimatter", "meta-Dimension Boosts"][u]
	}
}

function updatePositronsEffect() {
	if (!quSave.autoOptions.sacrifice) tmp.mpte = getPositronBoost()

	el("sacrificedGals").textContent = getFullExpansion(quSave.electrons.sacGals)
	el("positronsAmount").textContent = getFullExpansion(Math.round(quSave.electrons.amount))
	el("positronsTranslation").textContent = "^"+getFullExpansion(Math.round(tmp.mpte))
	el("positronsEffect").textContent = shorten(getDimensionPowerMultiplier("positrons"))+"x"
	el("linearPerTenMult").textContent = shorten(getDimensionPowerMultiplier("linear"))+"x"
}

function canSacrificeGalaxies() {
	return isPositronsOn() && player.galaxies > quSave.electrons.sacGals && getPositronGainMult() > 0
}

function sacrificeGalaxy() {
	if (!canSacrificeGalaxies()) return

	quSave.electrons.sacGals = player.galaxies
	if (!quSave.autoOptions.sacrifice) galaxyReset(0)
}

function getPositronBoost(mod) {
	var r = quSave.electrons.amount
	var ss = 8e4
	var ss_speed = 8e4
	if (hasNU(14)) ss += NT.eff("upg", 14, 0)
	if (r > ss) r = Math.sqrt((r - ss + ss_speed) * ss_speed) + ss - ss_speed

	if (hasGluonUpg("rg", 4) && mod != "no-rg4") r *= 0.7
	if (isDecayOn() && mod != "noTree") r *= getTreeUpgradeEffect(4)
	return r + 1
}

function getPositronGainMult() {
	return hasNU(5) ? 3 : 1
}

function getPositronGainFinalMult() {
	let r = 2
	for (var i = 0; i < 4; i++) r += quSave.electrons.rebuyables[i] / 4
	for (var i = 1; i <= 8; i++) r += QCIntensity(i) / 4
	return r * getPositronGainMult()
}

function getPositronUpgRes(u) {
	return E([null, player.timestudy.theorem, player.dilation.dilatedTime, player.meta.antimatter, player.meta.resets][u])
}

function getPositronUpgCost(u) {
	var amt = quSave.electrons.rebuyables[u-1]
	if (hasGluonUpg("gb", 5)) amt -= 0.3
	amt = Math.max(amt, 0)

	var base = amt * Math.max(amt - 1, 1) + 1
	base = Math.pow(base, getPositronUpgCostScalingExp(u))
	base + [null, 82, 153, 638, 26][u]

	if (u != 4) return pow10(base)
	return Math.floor(base)
}

function getPositronUpgCostScalingExp(u) {
	return [null, 1, 2, 2, 1][u]
}

function buyPositronUpg(u, quick) {
	if (!canBuyPositronUpg(u)) return false
	quSave.electrons.rebuyables[u - 1]++
	if (quick) return true
	updatePositrons(true)
}

function canBuyPositronUpg(id) {
	return getPositronUpgRes(id).gte(getPositronUpgCost(id))
}

function maxPositronUpg() {
	for (var i = 1; i <= 4; i++) while (buyPositronUpg(i, true)) {}
}
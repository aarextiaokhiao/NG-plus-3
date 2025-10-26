function isPositronsOn() {
	return hasMasteryStudy("d7") && notInQC() && quSave.electrons.on
}

function updatePositronsTab() {
	let isOn = isPositronsOn()
	el("sacrificeGal").className = isOn ? "unavailablebtn" : "storebtn positron"
	el("sacrificeGal").innerHTML = isOn ? "Discharging Antimatter Galaxies..." : "Start discharging Antimatter Galaxies"

	for (var u = 1; u <= 4; u++) el("positronupg" + u).className = canBuyPositronUpg(u) ? "storebtn positron" : "unavailablebtn"

	updatePositrons()
	updatePositronsEffect()
}

function updatePositrons() {
	var mult = getPositronGainFinalMult()
	el("positronsGainMult").textContent = `(${mult.toFixed(2)} per galaxy)`

	for (var u = 1; u <= 4; u++) {
		var cost = getPositronUpgCost(u)
		el("positronupg" + u).innerHTML = "+" + (getPositronGainMult() / 4).toFixed(2) + "x Positrons " +
			"(" + getFullExpansion(quSave.electrons.rebuyables[u-1]) + ")<br>" +
			((u == 4 ? getFullExpansion : shortenCosts)(cost)) + " " + [null, "Time Theorems", "dilated time", "meta-Antimatter", "meta-Dimension Boosts"][u]
	}
}

function updatePositronsEffect() {
	if (!quSave.autoOptions.sacrifice) tmp.mpte = getPositronBoost()

	el("sacrificedGals").textContent = getFullExpansion(quSave.electrons.sacGals) + (PHOTON.unlocked() ? ` (${formatPercentage(1 - lightEff(6, 0))}%)` : "")
	el("positronsAmount").textContent = shorten(quSave.electrons.amount)
	el("positronsTranslation").textContent = "^"+shorten(tmp.mpte)
	el("positronsEffect").textContent = shorten(getDimensionPowerMultiplier("positrons"))+"x"
	el("linearPerTenMult").textContent = shorten(getDimensionPowerMultiplier("linear"))+"x"
}

function getPositronBoost(mod) {
	var ss = 8e4

	var r = quSave.electrons.amount
	if (r > ss) r = Math.sqrt(r * ss)

	if (hasGluonUpg("rg", 4) && mod != "no-rg4") r *= 0.7
	if (hasDecay() && mod != "noTree") r *= getTreeUpgradeEffect(4)
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
	base += [null, 82, 153, 638, 26][u]

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
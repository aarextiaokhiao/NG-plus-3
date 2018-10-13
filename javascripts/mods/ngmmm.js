function getTickspeedBoostRequirement() {
	return {tier: player.currentChallenge=="challenge4"?6:8, amount: player.tickspeedBoosts*5+35}
}

function tickspeedBoost() {
	if (!player.break && player.money.gt(Number.MAX_VALUE)) return;
	if (!isTickspeedBoostPossible()) return
	var req=getTickspeedBoostRequirement()
	if (getAmount(req.tier)<req.amount) return
	player.tickspeedBoosts++
	softReset(player.achievements.includes("r36")?0:-player.resets, true)
	player.tickBoughtThisInf = updateTBTIonGalaxy()
}

function resetTickspeedBoosts() {
	if (player.tickspeedBoosts != undefined) return 0
}

//v2.1
function getProductBoughtMult() {
	let mult = 1
	if (player.tickspeedBoosts != undefined) {
		if (!player.galacticSacrifice.upgrades.includes(24)) mult = 0.5
		if (player.currentChallenge=="challenge13"||player.currentChallenge=="postc1") mult /= 5
	}
	return mult
}

function isTickspeedBoostPossible() {
	if (player.tickspeedBoosts == undefined) return false
	return player.resets > 4 || player.tickspeedBoosts > 0 || player.galaxies > 0 || player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0 || quantumed
}

document.getElementById("challenge15").onclick = function () {
	startChallenge("challenge15", Number.MAX_VALUE);
}

document.getElementById("buyerBtnTickspeedBoost").onclick = function () {
	buyAutobuyer(13);
}

function autoTickspeedBoostBoolean() {
	if (!player.autobuyers[13].isOn) return false
	if (player.autobuyers[13].ticks*100 < player.autobuyers[13].interval) return false
	var req=getTickspeedBoostRequirement()
	if (req.tier<8) return false
	if (player.overXGalaxiesTickspeedBoost <= player.galaxies) return true
	if (getAmount(8)>req.amount) return false
	return true
}
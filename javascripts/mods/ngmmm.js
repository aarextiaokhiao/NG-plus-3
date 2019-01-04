function getTickspeedBoostRequirement(offset=0) {
	let resets = player.tickspeedBoosts + offset
	let mult = getTickBoostCostMult()
	let amount = resets * mult + 35
	return {tier: player.currentChallenge=="challenge4"?6:8, amount: amount, mult: mult}
}

function tickspeedBoost(bulk) {
	if (!player.break && player.money.gt(Number.MAX_VALUE)) return;
	if (!isTickspeedBoostPossible()) return
	var req=getTickspeedBoostRequirement()
	if (getAmount(req.tier)<req.amount) return
	player.tickspeedBoosts += bulk
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
		mult = 0.2
		if (player.galacticSacrifice.upgrades.includes(24)) mult = galUpgrade24().max(0.2)
		if (player.currentChallenge == "challenge13" || player.currentChallenge == "postc1") mult = Math.max(mult/2, 0.1)
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
	var req=getTickspeedBoostRequirement(player.autobuyers[13].bulk - 1)
	if (req.tier<8) return false
	if (player.overXGalaxiesTickspeedBoost <= player.galaxies) return true
	if (getAmount(8)>req.amount) return true
	return false
}

//v2.2
function manualTickspeedBoost() {
	let bulk = 1
	if (player.infinityUpgrades.includes("bulkBoost")) {
		let req = getTickspeedBoostRequirement()
		bulk = Math.floor((getAmount(req.tier) - req.amount) / req.mult + 1)
	}
	if (bulk > 0) tickspeedBoost(bulk)
}

function getTickBoostCostMult() {
	let mult = 5
	return mult
}

function galUpgrade24() {
	return player.galacticSacrifice.galaxyPoints.pow(0.25).div(10)
}
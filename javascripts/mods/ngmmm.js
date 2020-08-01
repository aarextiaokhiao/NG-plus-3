function getTickspeedBoostRequirement(bulk = 1) {
	let resets = player.tickspeedBoosts + bulk - 1
	let mult = 5
	if (player.currentChallenge != "postcngmm_1" && player.currentChallenge != "postc1") {
		if (player.galacticSacrifice.upgrades.includes(34)) mult = 4
		if (player.infinityUpgrades.includes("postinfi52")) mult = 3
	}
	return {tier: inNC(4) || player.pSac != undefined ? 6 : 8, amount: resets * mult + (inNC(15) && player.aarexModifications.ngmX > 3 ? 10 : 30), mult: mult}
}

function tickspeedBoost(bulk) {
	player.tickspeedBoosts += bulk
	if (!player.achievements.includes("r27") || player.tickspeedBoosts >= 5 * player.galaxies - 8) player.tdBoosts = resetTDBoosts()
	softReset(player.achievements.includes("r27") && 5 * player.galaxies - 8 >player.tickspeedBoosts ? 0 : -player.resets, true)
	player.tickBoughtThisInf = updateTBTIonGalaxy()
}

function resetTickspeedBoosts() {
	if (player.tickspeedBoosts != undefined) return 0
}

//v2.1
function getProductBoughtMult() {
	let mult = 1
	if (player.tickspeedBoosts != undefined) {
		mult = player.galacticSacrifice.upgrades.includes(24) && player.currentChallenge != "postcngm3_4" ? galMults.u24() : 0.2
		if (inNC(13) || player.currentChallenge == "postc1") mult = Decimal.div(mult, 2)
	}
	return mult
}

function isTickspeedBoostPossible() {
	if (player.tickspeedBoosts == undefined) return
	if (inNC(5) || player.currentChallenge == "postcngm3_3") return
	if (tmp.ri) return
	return player.resets > 4 || player.tickspeedBoosts > 0 || player.galaxies > 0 || player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0 || quantumed
}

document.getElementById("challenge15").onclick = function () {
	startNormalChallenge(15)
}

document.getElementById("buyerBtnTickspeedBoost").onclick = function () {
	buyAutobuyer(13);
}

function autoTickspeedBoostBoolean() {
	var req = getTickspeedBoostRequirement()
	var amount = getAmount(req.tier)
	if (!isTickspeedBoostPossible()) return false
	if (!player.autobuyers[13].isOn) return false
	if (player.autobuyers[13].ticks * 100 < player.autobuyers[13].interval) return false
	if (amount < req.amount) return false
	if (player.aarexModifications.ngmX > 3 && inNC(14)) return false
	if (amount < getTickspeedBoostRequirement(player.autobuyers[13].bulk).amount) return false
	if (player.overXGalaxiesTickspeedBoost <= player.galaxies) return true
	if (player.autobuyers[13].priority < req.amount) return false
	return true
}

//v2.2
function manualTickspeedBoost() {
	if (!isTickspeedBoostPossible()) return
	if (cantReset()) return
	let req=getTickspeedBoostRequirement()
	let amount=getAmount(req.tier)
	if (!(amount >= req.amount)) return
	if ((player.infinityUpgrades.includes("bulkBoost") || player.achievements.includes("r28")) && (!inNC(14) || !(player.aarexModifications.ngmX > 3))) tickspeedBoost(Math.floor((amount - req.amount) / req.mult + 1))
	else tickspeedBoost(1)
}

//v3.2
function divideTickspeedIC5() {
	if (player.currentChallenge != "postc5" || player.tickspeedBoosts == undefined) return
	player.tickspeed = player.tickspeed.div(Decimal.pow(2, Math.pow(player.tickspeedBoosts, 1.5)))
}


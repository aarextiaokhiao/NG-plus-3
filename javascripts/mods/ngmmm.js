function getTickspeedBoostRequirement(bulk=1) {
	let resets=player.tickspeedBoosts+bulk-1
	return {tier:player.currentChallenge=="challenge4"?6:8,amount:resets*5+30}
}

function tickspeedBoost(bulk) {
	player.tickspeedBoosts+=bulk
	softReset(player.achievements.includes("r27")&&5*player.galaxies-8>player.tickspeedBoosts?0:-player.resets,true)
	player.tickBoughtThisInf=updateTBTIonGalaxy()
}

function resetTickspeedBoosts() {
	if (player.tickspeedBoosts!=undefined) return 0
}

//v2.1
function getProductBoughtMult() {
	let mult = 1
	if (player.tickspeedBoosts != undefined) {
		mult = player.galacticSacrifice.upgrades.includes(24) ? galUpgrade24() : 0.2
		if (player.currentChallenge == "challenge13" || player.currentChallenge == "postc1") mult = Decimal.div(mult, 2)
	}
	return mult
}

function isTickspeedBoostPossible() {
	if (player.tickspeedBoosts == undefined) return
	if (reachedInfinity()) return
	return player.resets > 4 || player.tickspeedBoosts > 0 || player.galaxies > 0 || player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0 || quantumed
}

document.getElementById("challenge15").onclick = function () {
	startChallenge("challenge15", Number.MAX_VALUE);
}

document.getElementById("buyerBtnTickspeedBoost").onclick = function () {
	buyAutobuyer(13);
}

function autoTickspeedBoostBoolean() {
    var req = getTickspeedBoostRequirement()
    var amount = getAmount(req.tier)
    if (!player.autobuyers[13].isOn) return false
    if (player.autobuyers[13].ticks*100 < player.autobuyers[13].interval) return false
    if (amount < req.amount) return false
    if (amount < getTickspeedBoostRequirement(player.autobuyers[13].bulk).amount) return false
    if (player.overXGalaxiesTickspeedBoost <= player.galaxies) return true
    if (player.autobuyers[13].priority < req.amount) return false
    return true
}

//v2.2
function manualTickspeedBoost() {
	if (!isTickspeedBoostPossible()) return
	let req=getTickspeedBoostRequirement()
	let amount=getAmount(req.tier)
	if (!(amount>=req.amount)) return
	if (player.infinityUpgrades.includes("bulkBoost")) tickspeedBoost(Math.floor((amount-req.amount)/5+1))
	else tickspeedBoost(1)
}

function galUpgrade24() {
	return player.galacticSacrifice.galaxyPoints.pow(0.25).div(20).max(0.2)
}
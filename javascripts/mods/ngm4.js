function getTDBoostReq() {
	let amount = player.tdBoosts > 2 || player.pSac != undefined ? 10 : 2
	let maxTier = inNC(4) || player.pSac != undefined ? 6 : 8
	let mult = inNC(4) || player.pSac != undefined ? 3 : 2
	return {amount: Math.ceil(amount + Math.max(player.tdBoosts + (player.pSac ? 0 : 1 - maxTier), 0) * mult), mult: mult, tier: Math.min(player.tdBoosts + 1, maxTier)}
}

function tdBoost(bulk) {
	let req = getTDBoostReq()
	if (player["timeDimension" + req.tier].bought < req.amount) return
	if (cantReset()) return
	player.tdBoosts += bulk
	if (!player.achievements.includes("r36")) softReset(player.achievements.includes("r26") && player.resets >= player.tdBoosts ? 0 : -player.resets)
	player.tickBoughtThisInf = updateTBTIonGalaxy()
}

function resetTDBoosts() {
	if (player.aarexModifications.ngmX > 3) return player.achievements.includes("r27") && player.currentChallenge == "" ? 3 : 0
}

function resetTDs() {
	var bp=getDimensionBoostPower()
	if (player.aarexModifications.ngmX > 3) {
		for (var d = 1; d <= 8; d++) {
			var dim = player["timeDimension" + d]
			dim.amount = new Decimal(0)
			dim.bought = 0
			dim.cost = new Decimal(timeDimStartCosts[1][d])
			dim.power = bp.pow((player.tdBoosts - d + 1) / 2).max(1)
		}
		player.timeShards = new Decimal(0)
		player.totalTickGained = 0
		player.tickThreshold = new Decimal(0.01)
		document.getElementById("totaltickgained").textContent = "You've gained " + getFullExpansion(player.totalTickGained) + " tickspeed upgrades."
	}
}

//v2.1
document.getElementById("challenge16").onclick = function () {
	startNormalChallenge(16)
}

function autoTDBoostBoolean() {
	var req = getTDBoostReq()
	var amount = player["timeDimension" + req.tier].bought
	if (!player.autobuyers[14].isOn) return false
	if (player.autobuyers[14].ticks * 100 < player.autobuyers[14].interval) return false
	if (amount < req.amount) return false
	if (player.aarexModifications.ngmX > 3 && inNC(14)) return false
	if (player.autobuyers[14].overXGals <= player.galaxies) return true
	if (player.autobuyers[14].priority < req.amount) return false
	return true
}

//v2.11
function cantReset() {
	return player.aarexModifications.ngmX > 3 && inNC(14) && getTotalResets() > 9
}

document.getElementById("buyerBtnTDBoost").onclick = function () {
	buyAutobuyer(14)
}

function maxHighestTD() {
	player.aarexModifications.maxHighestTD=!player.aarexModifications.maxHighestTD
	document.getElementById("maxHighestTD").textContent = "Buy Max the highest tier of Time Dimensions: O"+(player.aarexModifications.maxHighestTD?"N":"FF")
}

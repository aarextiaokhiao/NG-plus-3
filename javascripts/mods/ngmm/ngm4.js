function getTDBoostReq() {
	let amount = player.tdBoosts > 2 ? 10 : 2
	let maxTier = inNC(4) ? 6 : 8
	let mult = inNC(4) ? 3 : 2
	return {amount: Math.ceil(amount + Math.max(player.tdBoosts + 1 - maxTier, 0) * mult), mult: mult, tier: Math.min(player.tdBoosts + 1, maxTier)}
}

function tdBoost(bulk) {
	let req = getTDBoostReq()
	if (player["timeDimension" + req.tier].bought < req.amount) return
	if (cantReset()) return
	player.tdBoosts += bulk
	if (!hasAch("r36")) doReset("tdb")
}

function resetTDBoosts() {
	if (inNGM(4)) return hasAch("r27") && player.currentChallenge == "" ? 3 : 0
}

function resetNGM4TDs() {
	var bp=getDimensionBoostPower()
	for (var d = 1; d <= 8; d++) {
		var dim = player["timeDimension" + d]
		dim.amount = E(0)
		dim.bought = 0
		dim.cost = E(timeDimStartCosts[1][d])
		dim.power = bp.pow((player.tdBoosts - d + 1) / 2).max(1)
	}
	player.timeShards = E(0)
	player.totalTickGained = 0
	player.tickThreshold = E(0.01)
	el("totaltickgained").textContent = "You've gained " + getFullExpansion(player.totalTickGained) + " tickspeed upgrades."
}

//v2.1
el("challenge16").onclick = function () {
	startNormalChallenge(16)
}

function autoTDBoostBoolean() {
	var req = getTDBoostReq()
	var amount = player["timeDimension" + req.tier].bought
	if (!player.autobuyers[14].isOn) return false
	if (player.autobuyers[14].ticks * 100 < player.autobuyers[14].interval) return false
	if (amount < req.amount) return false
	if (inNGM(4) && inNC(14)) return false
	if (player.autobuyers[14].overXGals <= player.galaxies) return true
	if (player.autobuyers[14].priority < req.amount) return false
	return true
}

//v2.11
function cantReset() {
	return inNGM(4) && inNC(14) && getTotalResets() > 9
}

function maxHighestTD() {
	aarMod.maxHighestTD=!aarMod.maxHighestTD
	el("maxHighestTD").textContent = "Buy Max the highest tier of Time Dimensions: O"+(aarMod.maxHighestTD?"N":"FF")
}

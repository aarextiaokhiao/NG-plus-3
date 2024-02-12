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
	var power = getDimensionBoostPower()

	completelyResetTimeDimensions()
	for (var d = 1; d <= 8; d++) {
		var dim = player["timeDimension" + d]
		dim.cost = E(getTimeDimStartCost(d))
		dim.power = E(power).pow((player.tdBoosts - d + 1) / 2).max(1)
	}
	player.timeShards = E(0)
	player.totalTickGained = 0
	player.tickThreshold = E(0.01)
}

function doNGM4TDMultiplier(tier, ret){
	//Tickspeed multiplier boost
	var ic3 = player.postC3Reward
	if (ic3.gt(1e10)) ic3 = Decimal.pow(10, Math.sqrt(ic3.log10() * 5 + 50))

	var ic3_exp = ([5, 3, 2, 1.5, 1, .5, 1/3, 0])[tier - 1]
	if (hasGSacUpg(25)) ic3_exp *= galMults.u25()
	ret = ret.times(ic3.pow(ic3_exp))

	//NG-4 upgrades
	if (hasGSacUpg(12)) ret = ret.mul(galMults.u12())
	if (hasGSacUpg(13) && player.currentChallenge!="postngm3_4") ret = ret.mul(galMults.u13())
	if (hasGSacUpg(15)) ret = ret.mul(galMults.u15())
	if (hasGSacUpg(44) && inNGM(4)) {
		var e = hasGSacUpg(46) ? galMults["u46"]() : 1
		ret = ret.mul(E_pow(player[dimTiers[tier]+"Amount"].add(10).log10(), e * Math.pow(11 - tier, 2)))
	}
	if (hasGSacUpg(31)) ret = ret.pow(galMults.u31())
	return ret
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
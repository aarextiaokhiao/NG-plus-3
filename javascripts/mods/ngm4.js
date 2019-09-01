function getTDBoostReq() {
	let amount=player.tdBoosts>2?10:2
	let maxTier=player.currentChallenge=="challenge4"?6:8
	let mult=2
	return {amount:Math.ceil(amount+Math.max(player.tdBoosts-maxTier+1,0)*mult),mult:mult,tier:Math.min(player.tdBoosts+1,maxTier)}
}

function tdBoost(bulk) {
	let req=getTDBoostReq()
	if (player["timeDimension"+req.tier].bought<req.amount) return
	player.tdBoosts+=bulk
	softReset(player.achievements.includes("r26")&&player.resets>=player.tdBoosts?0:-player.resets)
	player.tickBoughtThisInf=updateTBTIonGalaxy()
}

function resetTDBoosts() {
	if (player.aarexModifications.ngmX>3) return player.achievements.includes("r27") && player.currentChallenge == "" ? 3 : 0
}

function resetTDs() {
	var bp=getDimensionBoostPower()
	if (player.aarexModifications.ngmX>3) {
		for (var d=1;d<9;d++) {
			var dim=player["timeDimension"+d]
			dim.amount=new Decimal(0)
			dim.bought=0
			dim.cost=new Decimal(timeDimStartCosts[1][d])
			dim.power=bp.pow((player.tdBoosts-d+1)/2).max(1)
		}
		player.timeShards=new Decimal(0)
		player.totalTickGained=0
		player.tickThreshold=new Decimal(0.01)
		document.getElementById("totaltickgained").textContent = "You've gained "+getFullExpansion(player.totalTickGained)+" tickspeed upgrades."
	}
}
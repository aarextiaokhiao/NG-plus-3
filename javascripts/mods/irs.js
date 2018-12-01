var setUnlocks
var powAdds = [null, 0, null, 0, 4, 4, 4]
function buyRepeatableInfinityUpgrade(id) {
	if (player.infinityPoints.lt(Decimal.pow(10, player.infinityUpgradesRespecced[id] + powAdds[id]))) return
	player.infinityPoints=player.infinityPoints.sub(Decimal.pow(10, player.infinityUpgradesRespecced[id]))
	player.infinityUpgradesRespecced[id]++
	if (id==1) {
		player.tickspeed=player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), 10))
		updateTickSpeed()
	}
}

function getInfUpgPow(id) {
	var amt=player.infinityUpgradesRespecced[id]
	if (id==4) return amt*30
	if (id==5) return 1+amt*0.17
	if (id==6) return amt*20
}
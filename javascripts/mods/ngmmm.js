function getTickspeedBoostRequirement() {
	return {tier: 8, amount: player.tickspeedBoosts*5+35}
}

function tickspeedBoost() {
	if (!player.break && player.money.gt(Number.MAX_VALUE)) return;
	if (!(player.resets > 0 || player.tickspeedBoosts > 0 || player.galaxies > 0 || player.infinitied > 0 || player.eternities != 0 || quantumed)) return
	var req=getTickspeedBoostRequirement()
	if (Math.round(player[TIER_NAMES[req.tier]+"Amount"])<req.amount) return
	player.tickspeedBoosts++
	softReset(-player.resets, true)
	player.tickBoughtThisInf = updateTBTIonGalaxy()
}

function resetTickspeedBoosts() {
	if (player.tickspeedBoosts != undefined) return 0
}
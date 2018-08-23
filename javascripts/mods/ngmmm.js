function getTickspeedBoostRequirement() {
	let tier = Math.min(Math.floor(player.tickspeedBoosts/2)+5,8)
	return {tier: tier, amount: (player.tickspeedBoosts-tier*2+11)*10}
}

function tickspeedBoost() {
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
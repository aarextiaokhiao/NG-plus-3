function getEmperorDimensionMultiplier(dim) {
	let ret = new Decimal(1)
	if (player.currentEternityChall == "eterc11") return ret
	ret = tmp.edgm //Global multiplier of all Emperor Dimensions
	if (hasNU(7) && dim % 2 == 1) ret = ret.times(tmp.nu[3])
	return dilates(ret, 1)
}

function getEmperorDimensionGlobalMultiplier() {
	let ret = new Decimal(1)
	if (player.masterystudies.includes("t392")) ret = getMTSMult(392)
	if (player.masterystudies.includes("t402")) ret = ret.times(30)
	if (player.masterystudies.includes("d13")) ret = ret.times(getTreeUpgradeEffect(6))
	if (player.achievements.includes("ng3p91")) ret = ret.times(player.achPow)
	return ret
}

function getEmperorDimensionRateOfChange(dim) {
	if (!canFeedReplicant(dim, true)) return 0
	let toGain = getEmperorDimensionMultiplier(dim+1).times(tmp.eds[dim+1].workers).div(20)

	var current = tmp.eds[dim].workers.add(tmp.eds[dim].progress).max(1)
	if (player.aarexModifications.logRateChange) {
		var change = current.add(toGain).log10()-current.log10()
		if (change<0||isNaN(change)) change = 0
	} else var change = toGain.times(10).dividedBy(current)

	return change
}
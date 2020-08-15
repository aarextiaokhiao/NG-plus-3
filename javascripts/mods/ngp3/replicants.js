function updateReplicantsTab(){
	document.getElementById("replicantiAmount2").textContent = shortenDimensions(player.replicanti.amount)
	document.getElementById("replicantReset").className = player.replicanti.amount.lt(tmp.qu.replicants.requirement) ? "unavailablebtn" : "storebtn"
	document.getElementById("replicantReset").innerHTML = "Reset replicanti amount for a replicant.<br>(requires " + shortenCosts(tmp.qu.replicants.requirement) + " replicanti)"
	document.getElementById("replicantAmount").textContent = shortenDimensions(tmp.qu.replicants.amount)
	document.getElementById("workerReplAmount").textContent = shortenDimensions(tmp.twr)
	document.getElementById("babyReplAmount").textContent = shortenDimensions(tmp.qu.replicants.babies)

	var gatherRateData = getGatherRate()
	document.getElementById("normalReplGatherRate").textContent = shortenDimensions(gatherRateData.normal)
	document.getElementById("workerReplGatherRate").textContent = shortenDimensions(gatherRateData.workersTotal)
	document.getElementById("babyReplGatherRate").textContent = shortenDimensions(gatherRateData.babies)
	document.getElementById("gatherRate").textContent = tmp.qu.nanofield.producingCharge ? '-' + shortenDimensions(getQuarkLossProduction()) + '/s' : '+' + shortenDimensions(gatherRateData.total) + '/s'

	document.getElementById("gatheredQuarks").textContent = shortenDimensions(tmp.qu.replicants.quarks.floor())
	document.getElementById("quarkTranslation").textContent = getFullExpansion(Math.round(tmp.pe * 100))

	var eggonRate = tmp.twr.times(getEmperorDimensionMultiplier(1)).times(3)
	if (eggonRate.lt(30)) {
		document.getElementById("eggonRate").textContent = shortenDimensions(eggonRate)
		document.getElementById("eggonRateTimeframe").textContent = "minute"
	} else {
		document.getElementById("eggonRate").textContent = shortenMoney(eggonRate.div(60))
		document.getElementById("eggonRateTimeframe").textContent = "second"
	}
	document.getElementById("feedNormal").className = (canFeedReplicant(1) ? "stor" : "unavailabl") + "ebtn"
	document.getElementById("workerProgress").textContent = Math.round(tmp.eds[1].progress.toNumber() * 100) + "%"

	if (!hasNU(2)) {
		document.getElementById("eggonAmount").textContent = shortenDimensions(tmp.qu.replicants.eggons)
		document.getElementById("hatchProgress").textContent = Math.round(tmp.qu.replicants.babyProgress.toNumber() * 100)+"%"
	}
	var growupRate = tmp.twr.times(player.achievements.includes("ng3p35") ? 3 : 0.3).times(getSpinToReplicantiSpeed())
	if (tmp.qu.replicants.babies.eq(0)) growupRate = growupRate.min(eggonRate)
	if (growupRate.lt(30)) {
		document.getElementById("growupRate").textContent = shortenDimensions(growupRate)
		document.getElementById("growupRateUnit").textContent = "minute"
	} else {
		document.getElementById("growupRate").textContent = shortenMoney(growupRate.div(60))
		document.getElementById("growupRateUnit").textContent = "second"
	}
	document.getElementById("growupProgress").textContent = Math.round(tmp.qu.replicants.ageProgress.toNumber() * 100) + "%"
	
	document.getElementById("reduceHatchSpeed").innerHTML = "Hatch speed: " + hatchSpeedDisplay() + " -> " + hatchSpeedDisplay(true) + "<br>Cost: " + shortenDimensions(tmp.qu.replicants.hatchSpeedCost) + " for all 3 gluons"
	if (player.ghostify.milestones > 7) updateReplicants("display")
}

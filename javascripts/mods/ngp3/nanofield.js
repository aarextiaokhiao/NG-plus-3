function updateNanoverseTab(){
	var rewards = tmp.qu.nanofield.rewards
	document.getElementById("quarksNanofield").textContent = shortenDimensions(tmp.qu.replicants.quarks)		
	document.getElementById("quarkCharge").textContent = shortenMoney(tmp.qu.nanofield.charge)
	document.getElementById("quarkChargeRate").textContent = shortenDimensions(getQuarkChargeProduction())
	document.getElementById("quarkLoss").textContent = shortenDimensions(getQuarkLossProduction())
	document.getElementById("preonEnergy").textContent = shortenMoney(tmp.qu.nanofield.energy)
	document.getElementById("quarkEnergyRate").textContent = shortenMoney(getQuarkEnergyProduction())
	document.getElementById("quarkPower").textContent = getFullExpansion(tmp.qu.nanofield.power)
	document.getElementById("quarkPowerThreshold").textContent = shortenMoney(tmp.qu.nanofield.powerThreshold)
	document.getElementById("quarkAntienergy").textContent = shortenMoney(tmp.qu.nanofield.antienergy)
	document.getElementById("quarkAntienergyRate").textContent = shortenMoney(getQuarkAntienergyProduction())
	document.getElementById("quarkChargeProductionCap").textContent = shortenMoney(getQuarkChargeProductionCap())
	document.getElementById("rewards").textContent = getFullExpansion(rewards)

	for (var reward = 1; reward < 9; reward++) {
		document.getElementById("nfReward" + reward).className = reward > rewards ? "nfRewardlocked" : "nfReward"
		document.getElementById("nfReward" + reward).textContent = wordizeList(nanoRewards.effectsUsed[reward].map(x => nanoRewards.effectDisplays[x](tmp.nf.effects[x])), true) + "."
		document.getElementById("nfRewardHeader" + reward).textContent = (rewards % 8 + 1 == reward ? "Next" : DISPLAY_NAMES[reward]) + " reward"
		document.getElementById("nfRewardTier" + reward).textContent = "Tier " + getFullExpansion(Math.ceil((rewards + 1 - reward) / 8)) + " / Power: " + tmp.nf.powers[reward].toFixed(1)
	}
	document.getElementById("nfReward5").textContent = (!tmp.ngp3l && tmp.nf.powers[5] > 15 ? nanoRewards.effectDisplays.light_threshold_speed(tmp.nf.effects.light_threshold_speed) : nanoRewards.effectDisplays.dil_effect_exp(tmp.nf.effects.dil_effect_exp)) + "."
	document.getElementById("ns").textContent = ghostified || nanospeed != 1 ? "Your Nanofield speed is currently " + (nanospeed == 1 ? "" : shorten(tmp.ns) + " * " + shorten(nanospeed) + " = ") + shorten(getNanofieldFinalSpeed()) + "x." : ""
}

function updateNanofieldAntipreon(){
	var rewards = tmp.qu.nanofield.rewards
	document.getElementById("rewards_AP").textContent = getFullExpansion(rewards)
	document.getElementById("rewards_wake").textContent = getFullExpansion(tmp.apgw)
	document.getElementById("sleepy").style.display = tmp.qu.nanofield.apgWoke ? "none" : ""
	document.getElementById("woke").style.display = tmp.qu.nanofield.apgWoke ? "" : "none"
}

function updateNanofieldTab(){
	if (document.getElementById("nanoverse").style.display == "block") updateNanoverseTab()
	if (document.getElementById("antipreon").style.display == "block") updateNanofieldAntipreon()
}

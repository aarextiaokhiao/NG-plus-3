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

function updateReplicants(mode) {
	if (player.masterystudies == undefined ? true : player.ghostify.milestones < 8) mode = undefined
	if (mode === undefined) {
		if (player.masterystudies ? !player.masterystudies.includes("d10") : true) {
			document.getElementById("replicantstabbtn").style.display = "none"
			return
		} else document.getElementById("replicantstabbtn").style.display = ""
	}
	if (mode === undefined || mode === "display") {
		document.getElementById("quantumFoodAmount").textContent = getFullExpansion(tmp.qu.replicants.quantumFood)
		document.getElementById("buyQuantumFood").innerHTML = "Buy 1 quantum food<br>Cost: " + shortenDimensions(tmp.qu.replicants.quantumFoodCost) + " of all 3 gluons"
		document.getElementById("buyQuantumFood").className = "gluonupgrade " + (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.quantumFoodCost) ? "unavailabl" : "stor") + "ebtn"
		if (!tmp.qu.quarks.l > 1e5) document.getElementById("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " -> " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(tmp.qu.replicants.limitCost) + " for all 3 gluons" : "")
		document.getElementById("breakLimit").className = (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailabl" : "stor") + "ebtn"
		document.getElementById("reduceHatchSpeed").className = (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.hatchSpeedCost) ? "unavailabl" : "stor") + "ebtn"
		if (player.masterystudies.includes('d11')) {
			document.getElementById("quantumFoodAmountED").textContent = getFullExpansion(tmp.qu.replicants.quantumFood)
			if (!tmp.qu.quarks.l > 1e5) document.getElementById("buyQuantumFoodED").innerHTML = "Buy 1 quantum food<br>Cost: "+shortenDimensions(tmp.qu.replicants.quantumFoodCost)+" for all 3 gluons"
			document.getElementById("buyQuantumFoodED").className = "gluonupgrade " + (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.quantumFoodCost) ? "unavailabl" : "stor") + "ebtn"
			if (!tmp.qu.quarks.l > 1e5) document.getElementById("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " -> " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(tmp.qu.replicants.limitCost) + " of all 3 gluons":"")
			document.getElementById("breakLimitED").className = (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailabl" : "stor") + "ebtn"
		}
		if (tmp.qu.quarks.l > 1e5){
			document.getElementById("buyQuantumFoodED").innerHTML = "Buy 1 quantum food"
			document.getElementById("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg()
			document.getElementById("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg()
			document.getElementById("rgRepl").textContent = "lots of"
			document.getElementById("gbRepl").textContent = "many"
			document.getElementById("brRepl").textContent = "tons of"
		} else {
			document.getElementById("rgRepl").textContent = shortenDimensions(tmp.qu.gluons.rg)
			document.getElementById("gbRepl").textContent = shortenDimensions(tmp.qu.gluons.gb)
			document.getElementById("brRepl").textContent = shortenDimensions(tmp.qu.gluons.br)
		}
	}
}

function getGatherRate() {
	var mult = new Decimal(1)
	if (player.masterystudies.includes("t373")) mult = getMTSMult(373)
	var data = {
		normal: tmp.qu.replicants.amount.times(mult),
		babies: tmp.qu.replicants.babies.times(mult).div(20),
		workers: {}
	}
	data.total = data.normal.add(data.babies)
	data.workersTotal = new Decimal(0)
	for (var d = 1; d < 9; d++) {
		data.workers[d] = tmp.eds[d].workers.times(mult).times(Decimal.pow(20, d))
		data.workersTotal = data.workersTotal.add(data.workers[d])
	}
	data.total = data.total.add(data.workersTotal)
	return data
}

function buyQuantumFood() {
	if (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).gte(tmp.qu.replicants.quantumFoodCost)) {
		tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(tmp.qu.replicants.quantumFoodCost)
		tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(tmp.qu.replicants.quantumFoodCost)
		tmp.qu.gluons.br = tmp.qu.gluons.br.sub(tmp.qu.replicants.quantumFoodCost)
		tmp.qu.replicants.quantumFood++
		tmp.qu.replicants.quantumFoodCost = tmp.qu.replicants.quantumFoodCost.times(5)
		updateGluonsTabOnUpdate("spend")
		updateReplicants("spend")
	}
}

function reduceHatchSpeed() {
	if (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).gte(tmp.qu.replicants.hatchSpeedCost)) {
		tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(tmp.qu.replicants.hatchSpeedCost)
		tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(tmp.qu.replicants.hatchSpeedCost)
		tmp.qu.gluons.br = tmp.qu.gluons.br.sub(tmp.qu.replicants.hatchSpeedCost)
		tmp.qu.replicants.hatchSpeed = tmp.qu.replicants.hatchSpeed / 1.1
		tmp.qu.replicants.hatchSpeedCost = tmp.qu.replicants.hatchSpeedCost.times(10)
		updateGluonsTabOnUpdate("spend")
		updateReplicants("spend")
	}
}

function hatchSpeedDisplay(next) {
	var speed = getHatchSpeed()
	if (next) speed /= 1.1
	if (speed < 1e-24) return shorten(1/speed) + "/s"
	return timeDisplayShort(speed * 10, true, 1)
}

function getTotalReplicants(data) {
	if (data === undefined) return tmp.twr.add(tmp.qu.replicants.amount).round()
	else return getTotalWorkers(data).add(data.quantum.replicants.amount).round()
}


function babyRateUpdating(){
	var eggonRate = tmp.twr.times(getEmperorDimensionMultiplier(1)).times(3).div((player.achievements.includes("ng3p35")) ? 1 : 10).times(getSpinToReplicantiSpeed())
	if (eggonRate.lt(3)){
		document.getElementById("eggonRate").textContent = shortenDimensions(eggonRate.times(60))
		document.getElementById("eggonRateTimeframe").textContent = "hour"
	} else if (eggonRate.lt(30)) {
		document.getElementById("eggonRate").textContent = shortenDimensions(eggonRate)
		document.getElementById("eggonRateTimeframe").textContent = "minute"
	} else {
		document.getElementById("eggonRate").textContent = shortenMoney(eggonRate.div(60))
		document.getElementById("eggonRateTimeframe").textContent = "second"
	}
}

function preonGatherRateUpdating(){
	var gatherRateData = getGatherRate()
	document.getElementById("normalReplGatherRate").textContent = shortenDimensions(gatherRateData.normal)
	document.getElementById("workerReplGatherRate").textContent = shortenDimensions(gatherRateData.workersTotal)
	document.getElementById("babyReplGatherRate").textContent = shortenDimensions(gatherRateData.babies)
	document.getElementById("gatherRate").textContent = nfSave.producingCharge && !hasBDUpg(3) ? '-' + shortenDimensions(getQuarkLossProduction()) + '/s' : '+' + shortenDimensions(gatherRateData.total) + '/s'
}

function getGrowupRatePerMinute(){
	return tmp.twr.plus(quSave.replicants.amount).times(player.achievements.includes("ng3p35") ? 3 : 0.3).times(getSpinToReplicantiSpeed())
}

function growupRateUpdating(){
	if (!hasNU(2)) {
		document.getElementById("eggonAmount").textContent = shortenDimensions(quSave.replicants.eggons)
		document.getElementById("hatchProgress").textContent = Math.round(quSave.replicants.babyProgress.toNumber() * 100)+"%"
	}
	var growupRate = getGrowupRatePerMinute()
	if (quSave.replicants.babies.eq(0)) growupRate = growupRate.min(eggonRate)
	if (growupRate.lt(30)) {
		document.getElementById("growupRate").textContent = shortenDimensions(growupRate)
		document.getElementById("growupRateUnit").textContent = "minute"
	} else {
		document.getElementById("growupRate").textContent = shortenMoney(growupRate.div(60))
		document.getElementById("growupRateUnit").textContent = "second"
	}
	document.getElementById("growupProgress").textContent = Math.round(quSave.replicants.ageProgress.toNumber() * 100) + "%"
}

function updateReplicantsTab(){
	document.getElementById("replicantiAmount2").textContent = shortenDimensions(player.replicanti.amount)
	document.getElementById("replicantReset").className = player.replicanti.amount.lt(quSave.replicants.requirement) ? "unavailablebtn" : "storebtn"
	document.getElementById("replicantReset").innerHTML = "Reset replicanti amount for a replicant.<br>(requires " + shortenCosts(quSave.replicants.requirement) + " replicanti)"
	document.getElementById("replicantAmount").textContent = shortenDimensions(quSave.replicants.amount)
	document.getElementById("workerReplAmount").textContent = shortenDimensions(tmp.twr)
	document.getElementById("babyReplAmount").textContent = shortenDimensions(quSave.replicants.babies)

	preonGatherRateUpdating()

	document.getElementById("gatheredQuarks").textContent = shortenDimensions(quSave.replicants.quarks.floor())
	document.getElementById("quarkTranslation").textContent = getFullExpansion(Math.round(tmp.pe * 100))

	babyRateUpdating()
	document.getElementById("feedNormal").className = (canFeedReplicant(1) ? "stor" : "unavailabl") + "ebtn"
	document.getElementById("workerProgress").textContent = Math.round(EDsave[1].progress.toNumber() * 100) + "%"

	growupRateUpdating()
	
	document.getElementById("reduceHatchSpeed").innerHTML = "Hatch speed: " + hatchSpeedDisplay() + " -> " + hatchSpeedDisplay(true) + "<br>Cost: " + shortenDimensions(quSave.replicants.hatchSpeedCost) + " for all 3 gluons"
	if (ghSave.milestones > 7) updateReplicants("display")
}

function updateReplicants(mode) {
	if (player.masterystudies == undefined ? true : ghSave.milestones < 8) mode = undefined
	if (mode === undefined) {
		if (player.masterystudies ? !player.masterystudies.includes("d10") : true) {
			document.getElementById("replicantstabbtn").style.display = "none"
			return
		} else document.getElementById("replicantstabbtn").style.display = ""
	}
	if (mode === undefined || mode === "display") {
		document.getElementById("quantumFoodAmount").textContent = getFullExpansion(quSave.replicants.quantumFood)
		if (quSave.quarks.lt(pow10(1e5))) document.getElementById("buyQuantumFood").innerHTML = "Buy 1 quantum food<br>Cost: " + shortenDimensions(quSave.replicants.quantumFoodCost) + " of all 3 gluons"
		document.getElementById("buyQuantumFood").className = "gluonupgrade " + (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.quantumFoodCost) ? "unavailabl" : "stor") + "ebtn"
		if (quSave.quarks.lt(pow10(1e5))) document.getElementById("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " -> " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(quSave.replicants.limitCost) + " for all 3 gluons" : "")
		document.getElementById("breakLimit").className = (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailabl" : "stor") + "ebtn"
		document.getElementById("reduceHatchSpeed").className = (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.hatchSpeedCost) ? "unavailabl" : "stor") + "ebtn"
		if (player.masterystudies.includes('d11')) {
			document.getElementById("quantumFoodAmountED").textContent = getFullExpansion(quSave.replicants.quantumFood)
			if (quSave.quarks.lt(pow10(1e5))) document.getElementById("buyQuantumFoodED").innerHTML = "Buy 1 quantum food<br>Cost: "+shortenDimensions(quSave.replicants.quantumFoodCost)+" for all 3 gluons"
			document.getElementById("buyQuantumFoodED").className = "gluonupgrade " + (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.quantumFoodCost) ? "unavailabl" : "stor") + "ebtn"
			if (quSave.quarks.lt(pow10(1e5))) document.getElementById("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " -> " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(quSave.replicants.limitCost) + " of all 3 gluons":"")
			document.getElementById("breakLimitED").className = (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailabl" : "stor") + "ebtn"
		}
		if (quSave.quarks.gte(pow10(1e5))){
			document.getElementById("buyQuantumFoodED").innerHTML = "Buy 1 quantum food"
			document.getElementById("buyQuantumFood").innerHTML = "Buy 1 quantum food"
			document.getElementById("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg()
			document.getElementById("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg()
			document.getElementById("rgRepl").textContent = "lots of"
			document.getElementById("gbRepl").textContent = "many"
			document.getElementById("brRepl").textContent = "tons of"
		} else {
			document.getElementById("rgRepl").textContent = shortenDimensions(quSave.gluons.rg)
			document.getElementById("gbRepl").textContent = shortenDimensions(quSave.gluons.gb)
			document.getElementById("brRepl").textContent = shortenDimensions(quSave.gluons.br)
		}
	}
}

function getGatherRate() {
	var mult = E(1)
	if (player.masterystudies.includes("t373")) mult = getMTSMult(373)
	var data = {
		normal: quSave.replicants.amount.times(mult),
		babies: quSave.replicants.babies.times(mult).div(20),
		workers: {}
	}
	data.total = data.normal.add(data.babies)
	data.workersTotal = E(0)
	for (var d = 1; d < 9; d++) {
		data.workers[d] = EDsave[d].workers.times(mult).times(E_pow(20, d))
		data.workersTotal = data.workersTotal.add(data.workers[d])
	}
	data.total = data.total.add(data.workersTotal)
	return data
}

function buyQuantumFood() {
	if (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).gte(quSave.replicants.quantumFoodCost)) {
		quSave.gluons.rg = quSave.gluons.rg.sub(quSave.replicants.quantumFoodCost)
		quSave.gluons.gb = quSave.gluons.gb.sub(quSave.replicants.quantumFoodCost)
		quSave.gluons.br = quSave.gluons.br.sub(quSave.replicants.quantumFoodCost)
		quSave.replicants.quantumFood++
		quSave.replicants.quantumFoodCost = quSave.replicants.quantumFoodCost.times(5)
		updateGluonsTabOnUpdate("spend")
		updateReplicants("spend")
	}
}

function reduceHatchSpeed() {
	if (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).gte(quSave.replicants.hatchSpeedCost)) {
		quSave.gluons.rg = quSave.gluons.rg.sub(quSave.replicants.hatchSpeedCost)
		quSave.gluons.gb = quSave.gluons.gb.sub(quSave.replicants.hatchSpeedCost)
		quSave.gluons.br = quSave.gluons.br.sub(quSave.replicants.hatchSpeedCost)
		quSave.replicants.hatchSpeed = quSave.replicants.hatchSpeed / 1.1
		quSave.replicants.hatchSpeedCost = quSave.replicants.hatchSpeedCost.times(10)
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
	if (data === undefined) return tmp.twr.add(quSave.replicants.amount).round()
	else return getTotalWorkers(data).add(data.quantum.replicants.amount).round()
}

function getEmperorDimensionMultiplier(dim) {
	let ret = E(1)
	if (player.currentEternityChall == "eterc11") return ret
	ret = tmp.edgm //Global multiplier of all Emperor Dimensions
	if (hasNU(7) && dim % 2 == 1) ret = ret.times(tmp.nu[3])
	//quSave.emperorDimensions[8].perm-10 
	if (!tmp.ngp3l && dim == 8) ret = ret.times(E_pow(1.05, Math.sqrt(Math.max(0, quSave.emperorDimensions[8].perm - 8))))
	return dilates(ret, 1)
}

function getEmperorDimensionGlobalMultiplier() {
	let ret = E(1)
	if (player.masterystudies.includes("t392")) ret = getMTSMult(392)
	if (player.masterystudies.includes("t402")) ret = ret.times(30)
	if (player.masterystudies.includes("d13")) ret = ret.times(getTreeUpgradeEffect(6))
	if (hasBosonicUpg(35)) ret = ret.times(tmp.blu[35].eds)
	return ret
}

function getEmperorDimensionRateOfChange(dim) {
	if (!canFeedReplicant(dim, true)) return 0
	let toGain = getEmperorDimensionMultiplier(dim + 1).times(EDsave[dim + 1].workers).div(20)

	var current = EDsave[dim].workers.add(EDsave[dim].progress).max(1)
	if (aarMod.logRateChange) {
		var change = current.add(toGain).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.times(10).dividedBy(current)

	return change
}

function feedReplicant(tier, max) {
	if (!canFeedReplicant(tier)) return
	var toFeed = max ? Math.min(quSave.replicants.quantumFood, quSave.replicants.limitDim > tier ? Math.round(getWorkerAmount(tier - 1).toNumber() * 3) : Math.round((quSave.replicants.limit - EDsave[tier].perm - EDsave[tier].progress.toNumber()) * 3)) : 1
	if (quSave.replicants.limitDim > tier) quSave.replicants.quantumFoodCost = quSave.replicants.quantumFoodCost.div(E_pow(5, toFeed))
	EDsave[tier].progress = EDsave[tier].progress.add(toFeed / 3)
	if (tier < 8 || getWorkerAmount(tier + 1).eq(0)) EDsave[tier].progress = EDsave[tier].progress.times(3).round().div(3)
	if (EDsave[tier].progress.gte(1)) {
		var toAdd = EDsave[tier].progress.floor()
		if (tier > 1) EDsave[tier-1].workers = EDsave[tier - 1].workers.sub(toAdd.min(EDsave[tier - 1].workers)).round()
		else quSave.replicants.amount = quSave.replicants.amount.sub(toAdd.min(quSave.replicants.amount)).round()
		EDsave[tier].progress = EDsave[tier].progress.sub(EDsave[tier].progress.min(toAdd))
		EDsave[tier].workers = EDsave[tier].workers.add(toAdd).round()
		EDsave[tier].perm = Math.min(EDsave[tier].perm + Math.round(toAdd.toNumber()), tier > 7 ? 1/0 : 10)
		if (tier == 2) giveAchievement("An ant office?")
	}
	quSave.replicants.quantumFood -= toFeed
	updateReplicants("spend")
}

function getWorkerAmount(tier) {
	if (tier < 1) return quSave.replicants.amount
	if (tier > 8) return E(0)
	return EDsave[tier].workers
}

function getTotalWorkers(data) {
	if (data) {
		if (data.quantum.emperorDimensions == undefined) return E(data.quantum.replicants.workers)
		data = data.quantum.emperorDimensions
	} else data = EDsave
	var total = E(0)
	for (var d = 1; d < 9; d++) total = total.add(data[d].workers)
	return total.round()
}

function buyMaxQuantumFood() {
	let minGluons = quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
	let toBuy = Math.floor(minGluons.div(quSave.replicants.quantumFoodCost).times(4).add(1).log(5))
	if (toBuy < 1) return
	let toSpend = E_pow(5, toBuy).minus(1).div(4).times(quSave.replicants.quantumFoodCost)
	quSave.gluons.rg = quSave.gluons.rg.sub(quSave.gluons.rg.min(toSpend))
	quSave.gluons.gb = quSave.gluons.gb.sub(quSave.gluons.gb.min(toSpend))
	quSave.gluons.br = quSave.gluons.br.sub(quSave.gluons.br.min(toSpend))
	quSave.replicants.quantumFood += toBuy
	quSave.replicants.quantumFoodCost = quSave.replicants.quantumFoodCost.times(E_pow(5, toBuy))
	updateGluonsTabOnUpdate("spend")
	updateReplicants("spend")
}

function canFeedReplicant(tier, auto) {
	if (quSave.replicants.quantumFood < 1 && !auto) return false
	if (tier > 1) {
		if (EDsave[tier].workers.gte(EDsave[tier - 1].workers)) return auto && hasNU(2)
		if (EDsave[tier - 1].workers.lte(10)) return false
	} else {
		if (EDsave[1].workers.gte(quSave.replicants.amount)) return auto && hasNU(2)
		if (quSave.replicants.amount.eq(0)) return false
	}
	if (tier > quSave.replicants.limitDim) return false
	if (tier == quSave.replicants.limitDim) return getWorkerAmount(tier).lt(quSave.replicants.limit)
	return true
}

function isLimitUpgAffordable() {
	if (!player.masterystudies.includes("d11")) return quSave.replicants.limit < 10
	return true
}

function getLimitMsg() {
	if (!player.masterystudies.includes("d11")) return quSave.replicants.limit
	return getFullExpansion(quSave.replicants.limit) + " ED" + quSave.replicants.limitDim + "s"
}

function getNextLimitMsg() {
	if (!player.masterystudies.includes("d11")) return quSave.replicants.limit+1
	if (quSave.replicants.limit > 9 && quSave.replicants.limitDim < 8) return "1 ED" + (quSave.replicants.limitDim + 1) + "s"
	return getFullExpansion(quSave.replicants.limit + 1) + " ED" + quSave.replicants.limitDim + "s"
}

function getHatchSpeed() {
	var speed = quSave.replicants.hatchSpeed
	if (player.masterystudies.includes("t361")) speed /= getMTSMult(361)
	if (player.masterystudies.includes("t371")) speed /= getMTSMult(371)
	if (player.masterystudies.includes("t372")) speed /= getMTSMult(372)
	if (player.masterystudies.includes("t381")) speed /= getMTSMult(381)
	if (player.masterystudies.includes("t391")) speed /= getMTSMult(391)
	if (player.masterystudies.includes("t402")) speed /= 30
	if (isNanoEffectUsed("hatch_speed")) speed /= tmp.nf.effects.hatch_speed
	return speed
}

function updateEmperorDimensions() {
	let production = getGatherRate()
	let mults = {}
	let limitDim = quSave.replicants.limitDim
	document.getElementById("rgEDs").textContent = shortenDimensions(quSave.gluons.rg)
	document.getElementById("gbEDs").textContent = shortenDimensions(quSave.gluons.gb)
	document.getElementById("brEDs").textContent = shortenDimensions(quSave.gluons.br)
	document.getElementById("replicantAmountED").textContent=shortenDimensions(quSave.replicants.amount)
	for (var d = 1; d <= 8; d++) mults[d] = getEmperorDimensionMultiplier(d)
	for (var d = 1; d <= 8; d++) {
		if (d > limitDim) document.getElementById("empRow" + d).style.display = "none"
		else {
			document.getElementById("empRow" + d).style.display = ""
			document.getElementById("empD" + d).textContent = DISPLAY_NAMES[d] + " Emperor Dimension x" + formatValue(player.options.notation, mults[d], 2, 1)
			document.getElementById("empAmount" + d).textContent = d < limitDim ? shortenDimensions(EDsave[d].workers) + " (+" + shorten(getEmperorDimensionRateOfChange(d)) + dimDescEnd : getFullExpansion(EDsave[limitDim].perm)
			document.getElementById("empQuarks" + d).textContent = shorten(production.workers[d])
			document.getElementById("empFeed" + d).className = (canFeedReplicant(d) ? "stor" : "unavailabl") + "ebtn"
			document.getElementById("empFeed" + d).textContent = "Feed (" + (d == limitDim || mults[d + 1].times(EDsave[d + 1].workers).div(20).lt(1e3) ? Math.round(EDsave[d].progress.toNumber() * 100) + "%, " : "") + getFullExpansion(EDsave[d].perm) + " kept)"
			document.getElementById("empFeedMax" + d).className = (canFeedReplicant(d) ? "stor" : "unavailabl") + "ebtn"
		}
	}
	document.getElementById("totalWorkers").textContent = shortenDimensions(tmp.twr)
	document.getElementById("totalQuarkProduction").textContent = shorten(production.workersTotal)
	if (ghSave.milestones > 7) updateReplicants("display")
}

function maxReduceHatchSpeed() {
	let minGluons = quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
	let toBuy = Math.floor(minGluons.div(quSave.replicants.hatchSpeedCost).times(9).add(1).log10())
	if (toBuy < 1) return
	let toSpend = pow10(toBuy).minus(1).div(9).times(quSave.replicants.hatchSpeedCost)
	if (toSpend.gt(quSave.gluons.rg)) quSave.gluons.rg = E(0)
	else quSave.gluons.rg = quSave.gluons.rg.sub(toSpend)
	if (toSpend.gt(quSave.gluons.gb)) quSave.gluons.gb = E(0)
	else quSave.gluons.gb = quSave.gluons.gb.sub(toSpend)
	if (toSpend.gt(quSave.gluons.br)) quSave.gluons.br = E(0)
	else quSave.gluons.br = quSave.gluons.br.sub(toSpend)
	quSave.replicants.hatchSpeed /= Math.pow(1.1, toBuy)
	quSave.replicants.hatchSpeedCost = quSave.replicants.hatchSpeedCost.times(pow10(toBuy))
	updateGluonsTabOnUpdate()
	updateReplicants()
}

function replicantReset(bulk = false) {
	if (player.replicanti.amount.lt(quSave.replicants.requirement)) return
	if (!player.achievements.includes("ng3p47")) player.replicanti.amount = E(1)
	if ((player.achievements.includes("ng3p74") && !tmp.ngp3l) && bulk) {
		let x = Math.floor(player.replicanti.amount.div(quSave.replicants.requirement).log10() / 1e5) + 1
		quSave.replicants.amount = quSave.replicants.amount.add(x)
		quSave.replicants.requirement = quSave.replicants.requirement.times(pow10(x * 1e5))
	} else {
		quSave.replicants.amount = quSave.replicants.amount.add(1)
		quSave.replicants.requirement = quSave.replicants.requirement.times(pow10(1e5))
	}
}

function breakLimit() {
	if (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).gte(quSave.replicants.limitCost) && isLimitUpgAffordable()) {
		quSave.gluons.rg = quSave.gluons.rg.sub(quSave.replicants.limitCost)
		quSave.gluons.gb = quSave.gluons.gb.sub(quSave.replicants.limitCost)
		quSave.gluons.br = quSave.gluons.br.sub(quSave.replicants.limitCost)
		quSave.replicants.limit++
		if (quSave.replicants.limit > 10 && quSave.replicants.limitDim < 8) {
			quSave.replicants.limit = 1
			quSave.replicants.limitDim++
		}
		if (quSave.replicants.limit % 10 > 0) quSave.replicants.limitCost = quSave.replicants.limitCost.times(200)
		updateGluonsTabOnUpdate("spend")
		updateReplicants("spend")
	}
}

function maxBuyLimit() {
	var min=quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
	if (!min.gte(quSave.replicants.limitCost) && isLimitUpgAffordable()) return
	for (var i = 0; i < (player.masterystudies.includes("d11") ? 3 : 1); i++) {
		if (i == 1) {
			var toAdd = Math.floor(min.div(quSave.replicants.limitCost).log(200) / 9)
			if (toAdd) {
				var toSpend = E_pow(200, toAdd * 9).times(quSave.replicants.limitCost)
				quSave.gluons.rg = quSave.gluons.rg.sub(quSave.gluons.rg.min(toSpend))
				quSave.gluons.gb = quSave.gluons.gb.sub(quSave.gluons.gb.min(toSpend))
				quSave.gluons.br = quSave.gluons.br.sub(quSave.gluons.br.min(toSpend))
				quSave.replicants.limitCost = quSave.replicants.limitCost.times(E_pow(200, toAdd * 9))
				quSave.replicants.limit += toAdd * 10
			}
		} else {
			var limit = quSave.replicants.limit
			var toAdd = Math.max(Math.min(Math.floor(min.div(quSave.replicants.limitCost).times(199).add(1).log(200)), 10 - limit % 10), 0)
			var toSpend = E_pow(200,toAdd).sub(1).div(199).round().times(quSave.replicants.limitCost)
			quSave.gluons.rg = quSave.gluons.rg.sub(quSave.gluons.rg.min(toSpend))
			quSave.gluons.gb = quSave.gluons.gb.sub(quSave.gluons.gb.min(toSpend))
			quSave.gluons.br = quSave.gluons.br.sub(quSave.gluons.br.min(toSpend))
			quSave.replicants.limitCost = quSave.replicants.limitCost.times(E_pow(200, Math.max(Math.min(toAdd, 9 - limit % 10), 0)))
			quSave.replicants.limit += toAdd
		}
		var dimAdd = Math.max(Math.min(Math.ceil(quSave.replicants.limit / 10 - 1), 8 - quSave.replicants.limitDim), 0)
		if (dimAdd > 0) {
			quSave.replicants.limit -= dimAdd * 10
			quSave.replicants.limitDim += dimAdd
		}
		min = quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
		if (!min.gte(quSave.replicants.limitCost) && isLimitUpgAffordable()) break
	}
	updateGluonsTabOnUpdate()
	updateReplicants()
}

function getSpinToReplicantiSpeed(){
	// log10(green spins) * log10(blue spins) *log10(red spins) 
	if (!player.achievements.includes("ng3p54")) return 1
	var r = todSave.r.spin.plus(10).log10()
	var g = todSave.g.spin.plus(10).log10()
	var b = todSave.b.spin.plus(10).log10()
	return r * g * b
}


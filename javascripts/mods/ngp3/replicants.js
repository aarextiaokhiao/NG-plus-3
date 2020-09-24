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
	document.getElementById("gatherRate").textContent = tmp.qu.nanofield.producingCharge ? '-' + shortenDimensions(getQuarkLossProduction()) + '/s' : '+' + shortenDimensions(gatherRateData.total) + '/s'
}

function getGrowupRatePerMinute(){
	return tmp.twr.plus(tmp.qu.replicants.amount).times(player.achievements.includes("ng3p35") ? 3 : 0.3).times(getSpinToReplicantiSpeed())
}

function growupRateUpdating(){
	if (!hasNU(2)) {
		document.getElementById("eggonAmount").textContent = shortenDimensions(tmp.qu.replicants.eggons)
		document.getElementById("hatchProgress").textContent = Math.round(tmp.qu.replicants.babyProgress.toNumber() * 100)+"%"
	}
	var growupRate = getGrowupRatePerMinute()
	if (tmp.qu.replicants.babies.eq(0)) growupRate = growupRate.min(eggonRate)
	if (growupRate.lt(30)) {
		document.getElementById("growupRate").textContent = shortenDimensions(growupRate)
		document.getElementById("growupRateUnit").textContent = "minute"
	} else {
		document.getElementById("growupRate").textContent = shortenMoney(growupRate.div(60))
		document.getElementById("growupRateUnit").textContent = "second"
	}
	document.getElementById("growupProgress").textContent = Math.round(tmp.qu.replicants.ageProgress.toNumber() * 100) + "%"
}

function updateReplicantsTab(){
	document.getElementById("replicantiAmount2").textContent = shortenDimensions(player.replicanti.amount)
	document.getElementById("replicantReset").className = player.replicanti.amount.lt(tmp.qu.replicants.requirement) ? "unavailablebtn" : "storebtn"
	document.getElementById("replicantReset").innerHTML = "Reset replicanti amount for a replicant.<br>(requires " + shortenCosts(tmp.qu.replicants.requirement) + " replicanti)"
	document.getElementById("replicantAmount").textContent = shortenDimensions(tmp.qu.replicants.amount)
	document.getElementById("workerReplAmount").textContent = shortenDimensions(tmp.twr)
	document.getElementById("babyReplAmount").textContent = shortenDimensions(tmp.qu.replicants.babies)

	preonGatherRateUpdating()

	document.getElementById("gatheredQuarks").textContent = shortenDimensions(tmp.qu.replicants.quarks.floor())
	document.getElementById("quarkTranslation").textContent = getFullExpansion(Math.round(tmp.pe * 100))

	babyRateUpdating()
	document.getElementById("feedNormal").className = (canFeedReplicant(1) ? "stor" : "unavailabl") + "ebtn"
	document.getElementById("workerProgress").textContent = Math.round(tmp.eds[1].progress.toNumber() * 100) + "%"

	growupRateUpdating()
	
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
		if (tmp.qu.quarks.lt(Decimal.pow(10, 1e5))) document.getElementById("buyQuantumFood").innerHTML = "Buy 1 quantum food<br>Cost: " + shortenDimensions(tmp.qu.replicants.quantumFoodCost) + " of all 3 gluons"
		document.getElementById("buyQuantumFood").className = "gluonupgrade " + (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.quantumFoodCost) ? "unavailabl" : "stor") + "ebtn"
		if (tmp.qu.quarks.lt(Decimal.pow(10, 1e5))) document.getElementById("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " -> " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(tmp.qu.replicants.limitCost) + " for all 3 gluons" : "")
		document.getElementById("breakLimit").className = (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailabl" : "stor") + "ebtn"
		document.getElementById("reduceHatchSpeed").className = (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.hatchSpeedCost) ? "unavailabl" : "stor") + "ebtn"
		if (player.masterystudies.includes('d11')) {
			document.getElementById("quantumFoodAmountED").textContent = getFullExpansion(tmp.qu.replicants.quantumFood)
			if (tmp.qu.quarks.lt(Decimal.pow(10, 1e5))) document.getElementById("buyQuantumFoodED").innerHTML = "Buy 1 quantum food<br>Cost: "+shortenDimensions(tmp.qu.replicants.quantumFoodCost)+" for all 3 gluons"
			document.getElementById("buyQuantumFoodED").className = "gluonupgrade " + (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.quantumFoodCost) ? "unavailabl" : "stor") + "ebtn"
			if (tmp.qu.quarks.lt(Decimal.pow(10, 1e5))) document.getElementById("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " -> " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(tmp.qu.replicants.limitCost) + " of all 3 gluons":"")
			document.getElementById("breakLimitED").className = (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).lt(tmp.qu.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailabl" : "stor") + "ebtn"
		}
		if (tmp.qu.quarks.gte(Decimal.pow(10, 1e5))){
			document.getElementById("buyQuantumFoodED").innerHTML = "Buy 1 quantum food"
			document.getElementById("buyQuantumFood").innerHTML = "Buy 1 quantum food"
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

function getEmperorDimensionMultiplier(dim) {
	let ret = new Decimal(1)
	if (player.currentEternityChall == "eterc11") return ret
	ret = tmp.edgm //Global multiplier of all Emperor Dimensions
	if (hasNU(7) && dim % 2 == 1) ret = ret.times(tmp.nu[3])
	//player.quantum.emperorDimensions[8].perm-10 
	if (!tmp.ngp3l && dim == 8) ret = ret.times(Decimal.pow(1.05, Math.sqrt(Math.max(0, player.quantum.emperorDimensions[8].perm - 8))))
	return dilates(ret, 1)
}

function getEmperorDimensionGlobalMultiplier() {
	let ret = new Decimal(1)
	if (player.masterystudies.includes("t392")) ret = getMTSMult(392)
	if (player.masterystudies.includes("t402")) ret = ret.times(30)
	if (player.masterystudies.includes("d13")) ret = ret.times(getTreeUpgradeEffect(6))
	if (hasBosonicUpg(35)) ret = ret.times(tmp.blu[35].eds)
	return ret
}

function getEmperorDimensionRateOfChange(dim) {
	if (!canFeedReplicant(dim, true)) return 0
	let toGain = getEmperorDimensionMultiplier(dim + 1).times(tmp.eds[dim + 1].workers).div(20)

	var current = tmp.eds[dim].workers.add(tmp.eds[dim].progress).max(1)
	if (player.aarexModifications.logRateChange) {
		var change = current.add(toGain).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.times(10).dividedBy(current)

	return change
}

function feedReplicant(tier, max) {
	if (!canFeedReplicant(tier)) return
	var toFeed = max ? Math.min(tmp.qu.replicants.quantumFood, tmp.qu.replicants.limitDim > tier ? Math.round(getWorkerAmount(tier - 1).toNumber() * 3) : Math.round((tmp.qu.replicants.limit - tmp.eds[tier].perm - tmp.eds[tier].progress.toNumber()) * 3)) : 1
	if (tmp.qu.replicants.limitDim > tier) tmp.qu.replicants.quantumFoodCost = tmp.qu.replicants.quantumFoodCost.div(Decimal.pow(5, toFeed))
	tmp.eds[tier].progress = tmp.eds[tier].progress.add(toFeed / 3)
	if (tier < 8 || getWorkerAmount(tier + 1).eq(0)) tmp.eds[tier].progress = tmp.eds[tier].progress.times(3).round().div(3)
	if (tmp.eds[tier].progress.gte(1)) {
		var toAdd = tmp.eds[tier].progress.floor()
		if (tier > 1) tmp.eds[tier-1].workers = tmp.eds[tier - 1].workers.sub(toAdd.min(tmp.eds[tier - 1].workers)).round()
		else tmp.qu.replicants.amount = tmp.qu.replicants.amount.sub(toAdd.min(tmp.qu.replicants.amount)).round()
		tmp.eds[tier].progress = tmp.eds[tier].progress.sub(tmp.eds[tier].progress.min(toAdd))
		tmp.eds[tier].workers = tmp.eds[tier].workers.add(toAdd).round()
		tmp.eds[tier].perm = Math.min(tmp.eds[tier].perm + Math.round(toAdd.toNumber()), tier > 7 ? 1/0 : 10)
		if (tier == 2) giveAchievement("An ant office?")
	}
	tmp.qu.replicants.quantumFood -= toFeed
	updateReplicants("spend")
}

function getWorkerAmount(tier) {
	if (tier < 1) return tmp.qu.replicants.amount
	if (tier > 8) return new Decimal(0)
	return tmp.eds[tier].workers
}

function getTotalWorkers(data) {
	if (data) {
		if (data.quantum.emperorDimensions == undefined) return new Decimal(data.quantum.replicants.workers)
		data = data.quantum.emperorDimensions
	} else data = tmp.eds
	var total = new Decimal(0)
	for (var d = 1; d < 9; d++) total = total.add(data[d].workers)
	return total.round()
}

function buyMaxQuantumFood() {
	let minGluons = tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br)
	let toBuy = Math.floor(minGluons.div(tmp.qu.replicants.quantumFoodCost).times(4).add(1).log(5))
	if (toBuy < 1) return
	let toSpend = Decimal.pow(5, toBuy).minus(1).div(4).times(tmp.qu.replicants.quantumFoodCost)
	tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(tmp.qu.gluons.rg.min(toSpend))
	tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(tmp.qu.gluons.gb.min(toSpend))
	tmp.qu.gluons.br = tmp.qu.gluons.br.sub(tmp.qu.gluons.br.min(toSpend))
	tmp.qu.replicants.quantumFood += toBuy
	tmp.qu.replicants.quantumFoodCost = tmp.qu.replicants.quantumFoodCost.times(Decimal.pow(5, toBuy))
	updateGluonsTabOnUpdate("spend")
	updateReplicants("spend")
}

function canFeedReplicant(tier, auto) {
	if (tmp.qu.replicants.quantumFood < 1 && !auto) return false
	if (tier > 1) {
		if (tmp.eds[tier].workers.gte(tmp.eds[tier - 1].workers)) return auto && hasNU(2)
		if (tmp.eds[tier - 1].workers.lte(10)) return false
	} else {
		if (tmp.eds[1].workers.gte(tmp.qu.replicants.amount)) return auto && hasNU(2)
		if (tmp.qu.replicants.amount.eq(0)) return false
	}
	if (tier > tmp.qu.replicants.limitDim) return false
	if (tier == tmp.qu.replicants.limitDim) return getWorkerAmount(tier).lt(tmp.qu.replicants.limit)
	return true
}

function isLimitUpgAffordable() {
	if (!player.masterystudies.includes("d11")) return tmp.qu.replicants.limit < 10
	return true
}

function getLimitMsg() {
	if (!player.masterystudies.includes("d11")) return tmp.qu.replicants.limit
	return getFullExpansion(tmp.qu.replicants.limit) + " ED" + tmp.qu.replicants.limitDim + "s"
}

function getNextLimitMsg() {
	if (!player.masterystudies.includes("d11")) return tmp.qu.replicants.limit+1
	if (tmp.qu.replicants.limit > 9 && tmp.qu.replicants.limitDim < 8) return "1 ED" + (tmp.qu.replicants.limitDim + 1) + "s"
	return getFullExpansion(tmp.qu.replicants.limit + 1) + " ED" + tmp.qu.replicants.limitDim + "s"
}

function getHatchSpeed() {
	var speed = tmp.qu.replicants.hatchSpeed
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
	let limitDim = tmp.qu.replicants.limitDim
	document.getElementById("rgEDs").textContent = shortenDimensions(tmp.qu.gluons.rg)
	document.getElementById("gbEDs").textContent = shortenDimensions(tmp.qu.gluons.gb)
	document.getElementById("brEDs").textContent = shortenDimensions(tmp.qu.gluons.br)
	document.getElementById("replicantAmountED").textContent=shortenDimensions(tmp.qu.replicants.amount)
	for (var d = 1; d <= 8; d++) mults[d] = getEmperorDimensionMultiplier(d)
	for (var d = 1; d <= 8; d++) {
		if (d > limitDim) document.getElementById("empRow" + d).style.display = "none"
		else {
			document.getElementById("empRow" + d).style.display = ""
			document.getElementById("empD" + d).textContent = DISPLAY_NAMES[d] + " Emperor Dimension x" + formatValue(player.options.notation, mults[d], 2, 1)
			document.getElementById("empAmount" + d).textContent = d < limitDim ? shortenDimensions(tmp.eds[d].workers) + " (+" + shorten(getEmperorDimensionRateOfChange(d)) + dimDescEnd : getFullExpansion(tmp.eds[limitDim].perm)
			document.getElementById("empQuarks" + d).textContent = shorten(production.workers[d])
			document.getElementById("empFeed" + d).className = (canFeedReplicant(d) ? "stor" : "unavailabl") + "ebtn"
			document.getElementById("empFeed" + d).textContent = "Feed (" + (d == limitDim || mults[d + 1].times(tmp.eds[d + 1].workers).div(20).lt(1e3) ? Math.round(tmp.eds[d].progress.toNumber() * 100) + "%, " : "") + getFullExpansion(tmp.eds[d].perm) + " kept)"
			document.getElementById("empFeedMax" + d).className = (canFeedReplicant(d) ? "stor" : "unavailabl") + "ebtn"
		}
	}
	document.getElementById("totalWorkers").textContent = shortenDimensions(tmp.twr)
	document.getElementById("totalQuarkProduction").textContent = shorten(production.workersTotal)
	if (player.ghostify.milestones > 7) updateReplicants("display")
}

function maxReduceHatchSpeed() {
	let minGluons = tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br)
	let toBuy = Math.floor(minGluons.div(tmp.qu.replicants.hatchSpeedCost).times(9).add(1).log10())
	if (toBuy < 1) return
	let toSpend = Decimal.pow(10, toBuy).minus(1).div(9).times(tmp.qu.replicants.hatchSpeedCost)
	if (toSpend.gt(tmp.qu.gluons.rg)) tmp.qu.gluons.rg = new Decimal(0)
	else tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(toSpend)
	if (toSpend.gt(tmp.qu.gluons.gb)) tmp.qu.gluons.gb = new Decimal(0)
	else tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(toSpend)
	if (toSpend.gt(tmp.qu.gluons.br)) tmp.qu.gluons.br = new Decimal(0)
	else tmp.qu.gluons.br = tmp.qu.gluons.br.sub(toSpend)
	tmp.qu.replicants.hatchSpeed /= Math.pow(1.1, toBuy)
	tmp.qu.replicants.hatchSpeedCost = tmp.qu.replicants.hatchSpeedCost.times(Decimal.pow(10, toBuy))
	updateGluonsTabOnUpdate()
	updateReplicants()
}

function replicantReset(bulk = false) {
	if (player.replicanti.amount.lt(tmp.qu.replicants.requirement)) return
	if (!player.achievements.includes("ng3p47")) player.replicanti.amount = new Decimal(1)
	if ((player.achievements.includes("ng3p74") && !tmp.ngp3l) && bulk) {
		let x = Math.floor(player.replicanti.amount.div(tmp.qu.replicants.requirement).log10() / 1e5) + 1
		tmp.qu.replicants.amount = tmp.qu.replicants.amount.add(x)
		tmp.qu.replicants.requirement = tmp.qu.replicants.requirement.times(Decimal.pow(10, x * 1e5))
	} else {
		tmp.qu.replicants.amount = tmp.qu.replicants.amount.add(1)
		tmp.qu.replicants.requirement = tmp.qu.replicants.requirement.times(Decimal.pow(10, 1e5))
	}
}

function breakLimit() {
	if (tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br).gte(tmp.qu.replicants.limitCost) && isLimitUpgAffordable()) {
		tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(tmp.qu.replicants.limitCost)
		tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(tmp.qu.replicants.limitCost)
		tmp.qu.gluons.br = tmp.qu.gluons.br.sub(tmp.qu.replicants.limitCost)
		tmp.qu.replicants.limit++
		if (tmp.qu.replicants.limit > 10 && tmp.qu.replicants.limitDim < 8) {
			tmp.qu.replicants.limit = 1
			tmp.qu.replicants.limitDim++
		}
		if (tmp.qu.replicants.limit % 10 > 0) tmp.qu.replicants.limitCost = tmp.qu.replicants.limitCost.times(200)
		updateGluonsTabOnUpdate("spend")
		updateReplicants("spend")
	}
}

function maxBuyLimit() {
	var min=tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br)
	if (!min.gte(tmp.qu.replicants.limitCost) && isLimitUpgAffordable()) return
	for (var i = 0; i < (player.masterystudies.includes("d11") ? 3 : 1); i++) {
		if (i == 1) {
			var toAdd = Math.floor(min.div(tmp.qu.replicants.limitCost).log(200) / 9)
			if (toAdd) {
				var toSpend = Decimal.pow(200, toAdd * 9).times(tmp.qu.replicants.limitCost)
				tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(tmp.qu.gluons.rg.min(toSpend))
				tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(tmp.qu.gluons.gb.min(toSpend))
				tmp.qu.gluons.br = tmp.qu.gluons.br.sub(tmp.qu.gluons.br.min(toSpend))
				tmp.qu.replicants.limitCost = tmp.qu.replicants.limitCost.times(Decimal.pow(200, toAdd * 9))
				tmp.qu.replicants.limit += toAdd * 10
			}
		} else {
			var limit = tmp.qu.replicants.limit
			var toAdd = Math.max(Math.min(Math.floor(min.div(tmp.qu.replicants.limitCost).times(199).add(1).log(200)), 10 - limit % 10), 0)
			var toSpend = Decimal.pow(200,toAdd).sub(1).div(199).round().times(tmp.qu.replicants.limitCost)
			tmp.qu.gluons.rg = tmp.qu.gluons.rg.sub(tmp.qu.gluons.rg.min(toSpend))
			tmp.qu.gluons.gb = tmp.qu.gluons.gb.sub(tmp.qu.gluons.gb.min(toSpend))
			tmp.qu.gluons.br = tmp.qu.gluons.br.sub(tmp.qu.gluons.br.min(toSpend))
			tmp.qu.replicants.limitCost = tmp.qu.replicants.limitCost.times(Decimal.pow(200, Math.max(Math.min(toAdd, 9 - limit % 10), 0)))
			tmp.qu.replicants.limit += toAdd
		}
		var dimAdd = Math.max(Math.min(Math.ceil(tmp.qu.replicants.limit / 10 - 1), 8 - tmp.qu.replicants.limitDim), 0)
		if (dimAdd > 0) {
			tmp.qu.replicants.limit -= dimAdd * 10
			tmp.qu.replicants.limitDim += dimAdd
		}
		min = tmp.qu.gluons.rg.min(tmp.qu.gluons.gb).min(tmp.qu.gluons.br)
		if (!min.gte(tmp.qu.replicants.limitCost) && isLimitUpgAffordable()) break
	}
	updateGluonsTabOnUpdate()
	updateReplicants()
}

function getSpinToReplicantiSpeed(){
	// log10(green spins) * log10(blue spins) *log10(red spins) 
	if (!player.achievements.includes("ng3p54")) return 1
	var r = player.quantum.tod.r.spin.plus(10).log10()
	var g = player.quantum.tod.g.spin.plus(10).log10()
	var b = player.quantum.tod.b.spin.plus(10).log10()
	return r * g * b
}


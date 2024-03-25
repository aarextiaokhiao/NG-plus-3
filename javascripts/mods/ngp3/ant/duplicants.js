function babyRateUpdating(){
	var eggonRate = tmp.qu.ant.workers.mul(getEmperorDimensionMultiplier(1)).mul(3)
	if (eggonRate.lt(30)) {
		el("eggonRate").textContent = shortenDimensions(eggonRate)
		el("eggonRateTimeframe").textContent = "minute"
	} else {
		el("eggonRate").textContent = shortenMoney(eggonRate.div(60))
		el("eggonRateTimeframe").textContent = "second"
	}
}

function updatePilonDisplay() {
	el("gatheredQuarks").textContent = shortenDimensions(quSave.replicants.quarks.floor())
	el("quarkTranslation").textContent = "+" + shortenMoney(tmp.qu.ant.preon_eff * 100) + "%"

	var gatherRateData = getGatherRate()
	el("normalReplGatherRate").textContent = shortenDimensions(gatherRateData.normal)
	el("workerReplGatherRate").textContent = shortenDimensions(gatherRateData.workersTotal)
	el("babyReplGatherRate").textContent = shortenDimensions(gatherRateData.babies)
	el("gatherRate").textContent = nfSave.producingCharge && !hasAch("ng3p71") ? '-' + shortenDimensions(getQuarkLossProduction()) + '/s' : '+' + shortenDimensions(gatherRateData.total) + '/s'
}

function getGrowupRatePerMinute(){
	return tmp.qu.ant.workers.add(quSave.replicants.amount).mul(0.3)
}

function growupRateUpdating(){
	if (!hasNU(2)) {
		el("eggonAmount").textContent = shortenDimensions(quSave.replicants.eggons)
		el("hatchProgress").textContent = `(${Math.round(quSave.replicants.babyProgress.toNumber() * 100)}%)`
	}
	var growupRate = getGrowupRatePerMinute()
	if (quSave.replicants.babies.eq(0)) growupRate = growupRate.min(eggonRate)
	if (growupRate.lt(30)) {
		el("growupRate").textContent = shortenDimensions(growupRate)
		el("growupRateUnit").textContent = "minute"
	} else {
		el("growupRate").textContent = shortenMoney(growupRate.div(60))
		el("growupRateUnit").textContent = "second"
	}
	el("growupProgress").textContent = Math.round(quSave.replicants.ageProgress.toNumber() * 100) + "%"
}

TABS = Object.assign(TABS, {
	ant: { name: "Duplicants", class: "antbtn", stab: [ "ant_n", "dim_emp", "nf" ], unl: _ => TABS.ant_n.unl() },
	ant_n: { name: "Ants", unl: _ => hasMasteryStudy("d10") && !hasBraveMilestone(14), update() {
		updateDuplicants()
		updateDuplicantsSubtab()
	} },
	dim_emp: { name: "Emperors", class: "antbtn", unl: _ => hasMasteryStudy("d11"), update() {
		updateDuplicants()
		updateEmperorDimensions()
	} },
	nf: { name: "Nanofield", unl: _ => hasMasteryStudy("d12"), update: _ => updateNanoverseTab() }
})

function updateDuplicantsSubtab(){
	el("replicantiAmount2").textContent = shortenDimensions(player.replicanti.amount)
	el("replicantReset").className = player.replicanti.amount.lt(quSave.replicants.requirement) ? "unavailablebtn" : "antbtn"
	el("replicantReset").innerHTML = "Reset replicantis for a duplicant.<br>(requires " + shortenCosts(quSave.replicants.requirement) + " replicanti)"
	el("replicantAmount").textContent = shortenDimensions(quSave.replicants.amount)
	el("workerReplAmount").textContent = shortenDimensions(tmp.qu.ant.workers)
	el("babyReplAmount").textContent = shortenDimensions(quSave.replicants.babies)

	babyRateUpdating()
	el("feedNormal").className = (canFeedReplicant(1) ? "stor" : "unavailabl") + "ebtn"
	el("workerProgress").textContent = Math.round(EDsave[1].progress.toNumber() * 100) + "%"

	growupRateUpdating()
	
	el("reduceHatchSpeed").innerHTML = "Hatch speed: " + hatchSpeedDisplay() + " → " + hatchSpeedDisplay(true) + "<br>Cost: " + shortenDimensions(quSave.replicants.hatchSpeedCost) + " for all 3 gluons"
}

function updateDuplicants() {
	let showCosts = quSave.replicants.limit < 1e3
	el("quantumFoodAmount").textContent = getFullExpansion(quSave.replicants.quantumFood)

	el("buyQuantumFood").className = "qu_upg " + (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.quantumFoodCost) ? "unavailable" : "ant") + "btn"
	el("breakLimit").className = (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailable" : "ant") + "btn"
	el("reduceHatchSpeed").className = (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.hatchSpeedCost) ? "unavailable" : "ant") + "btn"

	if (showCosts) {
		el("rgRepl").textContent = shortenDimensions(quSave.gluons.rg)
		el("gbRepl").textContent = shortenDimensions(quSave.gluons.gb)
		el("brRepl").textContent = shortenDimensions(quSave.gluons.br)

		el("buyQuantumFood").innerHTML = "+1 Quantum Food<br>Cost: "+shortenDimensions(quSave.replicants.quantumFoodCost)+" for all 3 gluons"
		el("buyQuantumFoodED").innerHTML = "+1 Quantum Food<br>Cost: "+shortenDimensions(quSave.replicants.quantumFoodCost)+" for all 3 gluons"
		el("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " → " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(quSave.replicants.limitCost) + " of all 3 gluons":"")
		el("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg() + (isLimitUpgAffordable() ? " → " + getNextLimitMsg() + "<br>Cost: " + shortenDimensions(quSave.replicants.limitCost) + " of all 3 gluons":"")
	} else {
		el("rgRepl").textContent = "lots of"
		el("gbRepl").textContent = "many"
		el("brRepl").textContent = "tons of"

		el("buyQuantumFood").innerHTML = "+1 Quantum Food"
		el("buyQuantumFoodED").innerHTML = "+1 Quantum Food"
		el("breakLimit").innerHTML = "Limit of workers: " + getLimitMsg()
		el("breakLimitED").innerHTML = "Limit of workers: " + getLimitMsg()
	}

	if (hasMasteryStudy('d11')) {
		el("quantumFoodAmountED").textContent = getFullExpansion(quSave.replicants.quantumFood)
		el("buyQuantumFoodED").className = "qu_upg " + (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.quantumFoodCost) ? "unavailable" : "ant") + "btn"
		el("breakLimitED").className = (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).lt(quSave.replicants.limitCost) || !isLimitUpgAffordable() ? "unavailable" : "ant") + "btn"
	}

	updatePilonDisplay()
}

function getGatherRate() {
	var mult = E(1)
	if (hasMasteryStudy("t373")) mult = getMTSMult(373)
	var data = {
		normal: quSave.replicants.amount.mul(mult),
		babies: quSave.replicants.babies.mul(mult).div(20),
		workers: {}
	}
	data.total = data.normal.add(data.babies)
	data.workersTotal = E(0)
	for (var d = 1; d < 9; d++) {
		data.workers[d] = EDsave[d].workers.mul(mult).mul(E_pow(20, d))
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
		quSave.replicants.quantumFoodCost = quSave.replicants.quantumFoodCost.mul(5)
	}
}

function reduceHatchSpeed() {
	if (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).gte(quSave.replicants.hatchSpeedCost)) {
		quSave.gluons.rg = quSave.gluons.rg.sub(quSave.replicants.hatchSpeedCost)
		quSave.gluons.gb = quSave.gluons.gb.sub(quSave.replicants.hatchSpeedCost)
		quSave.gluons.br = quSave.gluons.br.sub(quSave.replicants.hatchSpeedCost)
		quSave.replicants.hatchSpeed = quSave.replicants.hatchSpeed / 1.1
		quSave.replicants.hatchSpeedCost = quSave.replicants.hatchSpeedCost.mul(10)
	}
}

function hatchSpeedDisplay(next) {
	var speed = getHatchSpeed()
	if (next) speed /= 1.1
	if (speed < 1e-24) return shorten(1/speed) + "/s"
	return timeDisplayShort(speed * 10, true, 1)
}

function getTotalDuplicants(data) {
	if (data === undefined) return tmp.qu.ant.workers.add(quSave.replicants.amount).round()
	else return getTotalWorkers(data).add(data.quantum.duplicants.amount).round()
}

function getEmperorDimensionMultiplier(dim) {
	if (!tmp.qu.ant.global_mult) return E(1)

	let ret = tmp.qu.ant.global_mult //Global multiplier of all Emperor Dimensions
	if (dim == 8) ret = ret.mul(E_pow(1.1, quSave.emperorDimensions[8].perm - 8).max(1))
	if (dim == 1 && hasAch("ng3p54")) ret = ret.mul(Math.pow(todSave.r.spin.add(10).log10(), 3))
	if (hasNU(7) && dim % 2 == 1) ret = ret.mul(NT.eff("upg", 7))
	ret = ret.pow(lightEff(5))
	return ret
}

function getEmperorDimensionGlobalMultiplier() {
	let ret = E(1)
	if (hasMasteryStudy("t392")) ret = getMTSMult(392)
	if (hasMasteryStudy("t402")) ret = ret.mul(30)
	if (hasBLMilestone(13)) ret = ret.mul(blEff(13))
	if (hasMasteryStudy("d13")) ret = ret.mul(getTreeUpgradeEffect(6))
	return ret
}

function getEmperorDimensionRateOfChange(dim) {
	if (!canFeedReplicant(dim, true)) return 0
	let toGain = getEmperorDimensionMultiplier(dim + 1).mul(EDsave[dim + 1].workers).div(2)

	var current = EDsave[dim].workers.add(EDsave[dim].progress).max(1)
	if (aarMod.logRateChange) {
		var change = current.add(toGain).log10()-current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.mul(10).dividedBy(current)

	return change
}

function feedReplicant(tier, max) {
	if (!canFeedReplicant(tier)) return
	if (hasBraveMilestone(14)) {
		let max = quSave.replicants.limitDim > tier ? 10 : quSave.replicants.limit
		let old = EDsave[tier].perm
		EDsave[tier].workers = EDsave[tier].workers.add(max - old)
		EDsave[tier].perm = E(max)
	} else {
		var toFeed = max ? Math.min(quSave.replicants.quantumFood, quSave.replicants.limitDim > tier ? Math.round(getWorkerAmount(tier - 1).toNumber() * 3) : Math.round((quSave.replicants.limit - EDsave[tier].perm - EDsave[tier].progress.toNumber()) * 3)) : 1
		if (quSave.replicants.limitDim > tier) quSave.replicants.quantumFoodCost = quSave.replicants.quantumFoodCost.div(E_pow(5, toFeed))
		EDsave[tier].progress = EDsave[tier].progress.add(toFeed / 3)
		if (tier < 8 || getWorkerAmount(tier + 1).eq(0)) EDsave[tier].progress = EDsave[tier].progress.mul(3).round().div(3)
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
	}
}

function getWorkerAmount(tier) {
	if (tier < 1) return quSave.replicants.amount
	if (tier > 8) return E(0)
	return EDsave[tier].workers
}

function getTotalWorkers(data = player) {
	let qu = data.quantum
	if (qu?.emperorDimensions != undefined) {
		var total = E(0)
		for (var d = 1; d <= 8; d++) total = total.add(qu.emperorDimensions[d].workers)
		return total.round()
	} else {
		return E(qu?.duplicants?.workers ?? 0)
	}
}

function buyMaxQuantumFood() {
	let minGluons = quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
	let toBuy = Math.floor(minGluons.div(quSave.replicants.quantumFoodCost).mul(4).add(1).log(5))
	if (toBuy < 1) return
	let toSpend = E_pow(5, toBuy).minus(1).div(4).mul(quSave.replicants.quantumFoodCost)
	subtractGluons(toSpend)
	quSave.replicants.quantumFood += toBuy
	quSave.replicants.quantumFoodCost = quSave.replicants.quantumFoodCost.mul(E_pow(5, toBuy))
}

function canFeedReplicant(tier, auto) {
	if (hasBraveMilestone(14)) return (tier > quSave.replicants.limitDim ? 10 : quSave.replicants.limit) > EDsave[tier].perm
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
	if (!hasMasteryStudy("d11")) return quSave.replicants.limit < 10
	return true
}

function getLimitMsg() {
	if (!hasMasteryStudy("d11")) return quSave.replicants.limit
	return getFullExpansion(quSave.replicants.limit) + " ED" + quSave.replicants.limitDim + "s"
}

function getNextLimitMsg() {
	if (!hasMasteryStudy("d11")) return quSave.replicants.limit+1
	if (quSave.replicants.limit > 9 && quSave.replicants.limitDim < 8) return "1 ED" + (quSave.replicants.limitDim + 1) + "s"
	return getFullExpansion(quSave.replicants.limit + 1) + " ED" + quSave.replicants.limitDim + "s"
}

function getHatchSpeed() {
	var speed = quSave.replicants.hatchSpeed * .2
	if (hasMasteryStudy("t361")) speed /= getMTSMult(361)
	if (hasMasteryStudy("t371")) speed /= getMTSMult(371)
	if (hasMasteryStudy("t372")) speed /= getMTSMult(372)
	if (hasMasteryStudy("t381")) speed /= getMTSMult(381)
	if (hasMasteryStudy("t391")) speed /= getMTSMult(391)
	if (hasMasteryStudy("t402")) speed /= 30
	if (hasNanoReward("hatch_speed")) speed /= getNanorewardEff("hatch_speed")
	return speed
}

function teleportToEDs() {
	TAB_CORE.open("dim_emp")
}

function setupEmpDimensionHTML() {
	var edsDiv = el("empDimTable")
	for (let d = 1; d <= 8; d++) {
		var row = edsDiv.insertRow(d - 1)
		row.id = "empRow" + d
		row.style["font-size"] = "15px"
		row.innerHTML = `<td id="empD${d}" width="41%"></td>
		<td id="empAmount${d}"></td>
		<td id="empQuarks${d}"></td>
		<td width="2.5%"><button id="empFeedMax${d}" style="color:black; width:70px; font-size:10px" class="storebtn" onclick="feedReplicant(${d}, true)">Max</button></td>
		<td width="7.5%"><button id="empFeed${d}" style="color:black; width:195px; font-size:10px" class="storebtn" onclick="feedReplicant(${d})"></button></td>`
	}
}


function updateEmperorDimensions() {
	let production = getGatherRate(), mults = {}
	let limitDim = quSave.replicants.limitDim
	let showDetails = !hasBraveMilestone(14)

	el("rgEDs").textContent = shortenDimensions(quSave.gluons.rg)
	el("gbEDs").textContent = shortenDimensions(quSave.gluons.gb)
	el("brEDs").textContent = shortenDimensions(quSave.gluons.br)
	el("replicantAmountED").textContent = shortenDimensions(quSave.replicants.amount)

	for (var d = 1; d <= limitDim; d++) mults[d] = getEmperorDimensionMultiplier(d)
	for (var d = 1; d <= 8; d++) {
		if (d > limitDim) el("empRow" + d).style.display = "none"
		else {
			el("empRow" + d).style.display = ""
			el("empD" + d).textContent = dimNames[d] + " Emperor Dimension x" + formatValue(player.options.notation, mults[d], 2, 1)
			el("empAmount" + d).textContent = d < limitDim ? shortenDimensions(EDsave[d].workers) + " (+" + shorten(getEmperorDimensionRateOfChange(d)) + dimDescEnd : getFullExpansion(EDsave[limitDim].perm)
			el("empFeed" + d).className = (canFeedReplicant(d) ? "stor" : "unavailabl") + "ebtn"
			el("empFeed" + d).textContent = hasBraveMilestone(14) ? "Feed" : "Feed (" + (d == limitDim || mults[d + 1].mul(EDsave[d + 1].workers).div(20).lt(1e3) ? Math.round(EDsave[d].progress.toNumber() * 100) + "%, " : "") + getFullExpansion(EDsave[d].perm) + " kept)"
			el("empFeedMax" + d).className = (canFeedReplicant(d) ? "stor" : "unavailabl") + "ebtn"

			el("empQuarks" + d).style.display = showDetails ? "" : "none"
			if (showDetails) el("empQuarks" + d).textContent = shorten(production.workers[d]) + "pilons/s"
		}
	}

	el("totalAntStats").style.display = showDetails ? "" : "none"
	el("totalWorkers").textContent = shortenDimensions(tmp.qu.ant.workers)
	el("totalQuarkProduction").textContent = shorten(production.workersTotal)
}

function maxReduceHatchSpeed() {
	let minGluons = quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
	let toBuy = Math.floor(minGluons.div(quSave.replicants.hatchSpeedCost).mul(9).add(1).log10())
	if (toBuy < 1) return
	let toSpend = pow10(toBuy).minus(1).div(9).mul(quSave.replicants.hatchSpeedCost)
	subtractGluons(toSpend)
	quSave.replicants.hatchSpeed /= Math.pow(1.1, toBuy)
	quSave.replicants.hatchSpeedCost = quSave.replicants.hatchSpeedCost.mul(pow10(toBuy))
}

function replicantReset(bulk = false) {
	if (player.replicanti.amount.lt(quSave.replicants.requirement)) return
	if (!hasAch("ng3p47")) player.replicanti.amount = E(1)
	if ((hasAch("ng3p74")) && bulk) {
		let x = Math.floor(player.replicanti.amount.div(quSave.replicants.requirement).log10() / 1e5) + 1
		quSave.replicants.amount = quSave.replicants.amount.add(x)
		quSave.replicants.requirement = quSave.replicants.requirement.mul(pow10(x * 1e5))
	} else {
		quSave.replicants.amount = quSave.replicants.amount.add(1)
		quSave.replicants.requirement = quSave.replicants.requirement.mul(pow10(1e5))
	}
}

function breakLimit() {
	if (quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br).gte(quSave.replicants.limitCost) && isLimitUpgAffordable()) {
		subtractGluons(quSave.replicants.limitCost)
		quSave.replicants.limit++
		if (quSave.replicants.limit > 10 && quSave.replicants.limitDim < 8) {
			quSave.replicants.limit = 1
			quSave.replicants.limitDim++
		}
		if (quSave.replicants.limit % 10 > 0) quSave.replicants.limitCost = quSave.replicants.limitCost.mul(200)
	}
}

function maxBuyLimit() {
	var min=quSave.gluons.rg.min(quSave.gluons.gb).min(quSave.gluons.br)
	if (!min.gte(quSave.replicants.limitCost) && isLimitUpgAffordable()) return
	for (var i = 0; i < (hasMasteryStudy("d11") ? 3 : 1); i++) {
		if (i == 1) {
			var toAdd = Math.floor(min.div(quSave.replicants.limitCost).log(200) / 9)
			if (toAdd) {
				var toSpend = E_pow(200, toAdd * 9).mul(quSave.replicants.limitCost)
				subtractGluons(toSpend)
				quSave.replicants.limitCost = quSave.replicants.limitCost.mul(E_pow(200, toAdd * 9))
				quSave.replicants.limit += toAdd * 10
			}
		} else {
			var limit = quSave.replicants.limit
			var toAdd = Math.max(Math.min(Math.floor(min.div(quSave.replicants.limitCost).mul(199).add(1).log(200)), 10 - limit % 10), 0)
			var toSpend = E_pow(200,toAdd).sub(1).div(199).round().mul(quSave.replicants.limitCost)
			subtractGluons(toSpend)
			quSave.replicants.limitCost = quSave.replicants.limitCost.mul(E_pow(200, Math.max(Math.min(toAdd, 9 - limit % 10), 0)))
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
}

//UPDATES
function replicantOverallUpdating(diff){
	replicantEggonUpdating(diff)
	replicantBabyHatchingUpdating(diff)
	if (quSave.replicants.eggons.lt(1)) quSave.replicants.babyProgress = E(0)
	replicantBabiesGrowingUpUpdating(diff)
	if (quSave.replicants.babies.lt(1)) quSave.replicants.ageProgress = E(0)
	if (!nfSave.producingCharge) quSave.replicants.quarks = quSave.replicants.quarks.add(getGatherRate().total.max(0).mul(diff))
}

function replicantEggonUpdating(diff){
	var newBabies = tmp.qu.ant.workers.mul(getEmperorDimensionMultiplier(1)).mul(diff/20)
	if (hasAch("ng3p35")) newBabies = newBabies.mul(10)

	quSave.replicants.eggonProgress = quSave.replicants.eggonProgress.add(newBabies)
	var toAdd = quSave.replicants.eggonProgress.floor()
	if (toAdd.gt(0)) {
		if (toAdd.gt(quSave.replicants.eggonProgress)) quSave.replicants.eggonProgress = E(0)
		else quSave.replicants.eggonProgress = quSave.replicants.eggonProgress.sub(toAdd)

		var toAddWhat = hasBraveMilestone(14) ? "amount" : "eggons"
		quSave.replicants[toAddWhat] = quSave.replicants[toAddWhat].add(toAdd).round()
	}
}

function replicantBabyHatchingUpdating(diff){
	if (quSave.replicants.eggons.gt(0)) {
		quSave.replicants.babyProgress = quSave.replicants.babyProgress.add(diff/getHatchSpeed()/10)
		var toAdd = hasNU(2) ? quSave.replicants.eggons : quSave.replicants.babyProgress.floor().min(quSave.replicants.eggons)
		if (toAdd.gt(0)) {
			if (toAdd.gt(quSave.replicants.eggons)) quSave.replicants.eggons = E(0)
			else quSave.replicants.eggons = quSave.replicants.eggons.sub(toAdd).round()
			if (toAdd.gt(quSave.replicants.babyProgress)) quSave.replicants.babyProgress = E(0)
			else quSave.replicants.babyProgress = quSave.replicants.babyProgress.sub(toAdd)
			quSave.replicants.babies = quSave.replicants.babies.add(toAdd).round()
		}
	}
}

function replicantBabiesGrowingUpUpdating(diff){
	if (quSave.replicants.babies.gt(0)&&tmp.qu.ant.total.gt(0)) {
		quSave.replicants.ageProgress = quSave.replicants.ageProgress.add(getGrowupRatePerMinute().div(60).mul(diff)).min(quSave.replicants.babies)
		var toAdd = quSave.replicants.ageProgress.floor()
		if (toAdd.gt(0)) {
			if (!hasAch("ng3p71")) {
				if (toAdd.gt(quSave.replicants.babies)) quSave.replicants.babies = E(0)
				else quSave.replicants.babies = quSave.replicants.babies.sub(toAdd).round()
			}
			if (toAdd.gt(quSave.replicants.ageProgress)) quSave.replicants.ageProgress = E(0)
			else quSave.replicants.ageProgress = quSave.replicants.ageProgress.sub(toAdd)
			quSave.replicants.amount = quSave.replicants.amount.add(toAdd).round()
		}
	}
}

function emperorDimUpdating(diff){
	for (dim=8;dim>1;dim--) {
		if (hasBraveMilestone(14)) {
			EDsave[dim-1].workers = EDsave[dim-1].workers.add(EDsave[dim].workers.mul(getEmperorDimensionMultiplier(dim)).mul(diff/20)).round()
		} else {
			var promote = hasNU(2) ? 1/0 : getWorkerAmount(dim-2)
			if (canFeedReplicant(dim-1,true)) {
				if (dim>2) promote = EDsave[dim-2].workers.sub(10).round().min(promote)
				EDsave[dim-1].progress = EDsave[dim-1].progress.add(EDsave[dim].workers.mul(getEmperorDimensionMultiplier(dim)).mul(diff/20)).min(promote)
				var toAdd = EDsave[dim-1].progress.floor()
				if (toAdd.gt(0)) {
					if (!hasAch("ng3p52")) {
						if (dim>2 && toAdd.gt(getWorkerAmount(dim-2))) EDsave[dim-2].workers = E(0)
						else if (dim>2) EDsave[dim-2].workers = EDsave[dim-2].workers.sub(toAdd).round()
						else if (toAdd.gt(quSave.replicants.amount)) quSave.replicants.amount = E(0)
						else quSave.replicants.amount = quSave.replicants.amount.sub(toAdd).round()
					}
					if (toAdd.gt(EDsave[dim-1].progress)) EDsave[dim-1].progress = E(0)
					else EDsave[dim-1].progress = EDsave[dim-1].progress.sub(toAdd)
					EDsave[dim-1].workers = EDsave[dim-1].workers.add(toAdd).round()
				}
			}
			if (!canFeedReplicant(dim-1,true)) EDsave[dim-1].progress = E(0)
		}
	}
}

function getPilonEffect() {
	let exp = 1/3
	if (hasMasteryStudy("t362")) exp = .4
	if (hasMasteryStudy("t412")) exp = .5

	return Math.pow(quSave.replicants.quarks.add(1).log10(), exp) * 0.8
}

function updatePostBM14Display() {
	let bm14 = hasBraveMilestone(14)
	el("foodCell").style.display = bm14 ? "none" : ""
	el(bm14 ? "pilonsCellED" : "pilonsCell").appendChild(el("pilonsDiv"))
}

function setupEDSave() {
	let r = {}
	for (let d = 1; d <= 8; d++) r[d] = { workers: E(0), progress: E(0), perm: 0 }
	return r
}
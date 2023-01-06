var setUnlocks
var powAdds = [null, 0, null, 0, 4, 4, 4]
function buyRepeatableInfinityUpgrade(id) {
	if (player.infinityPoints.lt(pow10(player.infinityUpgradesRespecced[id] + powAdds[id]))) return
	player.infinityPoints = player.infinityPoints.sub(pow10(player.infinityUpgradesRespecced[id] + powAdds[id]))
	player.infinityUpgradesRespecced[id]++
	if (id == 1) {
		player.tickspeed = player.tickspeed.times(E_pow(getTickSpeedMultiplier(), 10))
		updateTickSpeed()
	}
}

function getInfUpgPow(id) {
	var amt = player.infinityUpgradesRespecced[id]
	if (id == 4) return amt * 30
	if (id == 5) return 1 + amt * 0.17
	if (id == 6) return amt * 20
}

//v1.1
function updateSingularity() {
	if (player.infinityUpgradesRespecced == undefined) {
		el("singularitytabbtn").style.display = "none"
		return
	} else el("singularitytabbtn").style.display = ""
	if (player.singularity.unlocked) {
		el("singularityunlock").style.display = "none"
		el("singularitydiv").style.display = ""
		el("sacrificedIP").textContent = shortenDimensions(player.singularity.sacrificed)
		el("nextUpgrade").textContent = shortenCosts(pow10(player.singularity.upgraded * 2 + 32))
		el("sacrificeIP").className = gainedSingularityPower().eq(0) ? "unavailablebtn" : "storebtn"
		el("singularityPowerGain").textContent = shortenDimensions(gainedSingularityPower())
		el("singularityPower").textContent = shortenDimensions(player.singularity.singularityPower)
		el("darkMatterPerSecond").textContent = shortenDimensions(getDarkMatterPerSecond())
	} else {
		el("singularityunlock").style.display = ""
		el("singularitydiv").style.display = "none"
		el("singularityunlcost").textContent = shortenCosts(1e30)
		el("singularityunlock").className = player.infinityPoints.lt(1e30) ? "unavailablebtn" : "storebtn"
	}
}

function unlockSingularity() {
	if (player.infinityPoints.lt(1e30) || player.singularity.unlocked) return
	player.infinityPoints = player.infinityPoints.sub(1e30)
	player.singularity.unlocked = true
	updateSingularity()
	updateDimTechs()
}

function gainedSingularityPower() {
	return player.infinityPoints.div(1e30).pow(0.15).floor()
}

function sacrificeIP() {
	if (gainedSingularityPower().eq(0)) return
	player.singularity.singularityPower = player.singularity.singularityPower.add(gainedSingularityPower())
	player.singularity.sacrificed = player.singularity.sacrificed.add(player.infinityPoints)
	player.infinityPoints = E(0)
	player.singularity.upgraded += Math.floor(player.singularity.sacrificed.div(pow10(player.singularity.upgraded * 2 + 30)).log(100))
	updateSingularity()
}

function getDarkMatterPerSecond() {
	return player.singularity.singularityPower.times(pow2(player.singularity.upgraded))
}

function infinityRespeccedDMUpdating(diff){
	var prod = getDarkMatterPerSecond()
	player.singularity.darkMatter = player.singularity.darkMatter.add(getDarkMatterPerSecond().times(diff))
	if (prod.gt(0)) tmp.tickUpdate = true
	if (player.singularity.darkMatter.gte(getNextDiscounts())) {
		player.dimtechs.discounts++
		for (d=1;d<9;d++) {
			var name = TIER_NAMES[d]
			player[name+"Cost"] = player[name+"Cost"].div(getDiscountMultiplier("dim" + d))
		}
		player.tickSpeedCost = player.tickSpeedCost.div(getDiscountMultiplier("tick"))
	}
}

function getDarkMatterMult() {
	return player.singularity.darkMatter.add(1).pow(4)
}

//v1.2
el("challenge16").onclick = function () {
	startChallenge("challenge16", Number.MAX_VALUE);
}

function updateDimTechs() {
	var shown = false
	if (player.infinityUpgradesRespecced != undefined) shown = player.singularity.unlocked
	if (!shown) {
		el("dimtechstabbtn").style.display = "none"
		return
	} else el("dimtechstabbtn").style.display = ""
	if (player.dimtechs.unlocked) {
		el("dimtechsunlock").style.display = "none"
		el("dimtechsdiv").style.display = ""
		var cost = getDimTechUpgradeCost()
		var canBuy = player.infinityPoints.gte(cost)
		for (var dim = 1; dim < 9; dim++) {
			el("dim" + dim + "techbtn").innerHTML = "Level " + getFullExpansion(player.dimtechs["dim" + dim + "Upgrades"]) + "<br>" + shortenDimensions(getDiscountMultiplier("dim" + dim)) + "x per discount upgrade" + "<br><br>Cost: " + shortenCosts(cost) + " IP"
			el("dim" + dim + "techbtn").className = canBuy ? "storebtn" : "unavailablebtn"
		}
		el("ticktechbtn").innerHTML = "Level " + getFullExpansion(player.dimtechs.tickUpgrades) + "<br>" + shortenDimensions(getDiscountMultiplier("tick")) + "x per discount upgrade" + "<br><br>Cost: " + shortenCosts(cost) + " IP"
		el("ticktechbtn").className = canBuy ? "storebtn" : "unavailablebtn"
		el("respecDimTechs").className = player.dimtechs.respec ? "respecbtn" : "storebtn"
	} else {
		el("dimtechsunlock").style.display = ""
		el("dimtechsdiv").style.display = "none"
		el("dimtechsunlcost").textContent = shortenCosts(1e95)
		el("dimtechsunlock").className = player.infinityPoints.lt(1e95) ? "unavailablebtn" : "storebtn"
	}
}

function unlockDimTechs() {
	if (player.infinityPoints.lt(1e95) || player.dimtechs.unlocked) return
	player.infinityPoints = player.infinityPoints.sub(1e95)
	player.dimtechs.unlocked = true
	updateDimTechs()
}

function getNextDiscounts() {
	return pow2(player.dimtechs.discounts * (player.dimtechs.discounts + 1) / 4).times(1e22)
}

function getDimTechUpgradeCost() {
	var total = 0
	for (var dim = 1; dim < 9; dim++) total += player.dimtechs["dim" + dim + "Upgrades"]
	total += player.dimtechs.tickUpgrades
	return E_pow(5, total).times(1e95)
}

function buyDimTech(dim, tick) {
	if (tick) var name = "tick"
	else var name = "dim" + dim
	if (player.infinityPoints.lt(getDimTechUpgradeCost())) return
	player.infinityPoints = player.infinityPoints.sub(getDimTechUpgradeCost())
	var oldMultiplier = getDiscountMultiplier(name)
	player.dimtechs[name + "Upgrades"]++
	if (tick) player.tickSpeedCost = player.tickSpeedCost.div(E_pow(getDiscountMultiplier(name).div(oldMultiplier), player.dimtechs.discounts))
	else player[TIER_NAMES[dim] + "Cost"] = player[TIER_NAMES[dim] + "Cost"].div(E_pow(getDiscountMultiplier(name).div(oldMultiplier), player.dimtechs.discounts))
	updateDimTechs()
}

function getDiscountMultiplier(id) {
	return E_pow(1e38, Math.sqrt(player.dimtechs[id + "Upgrades"]))
}

function respecDimTechs() {
	player.dimtechs.respec = !player.dimtechs.respec
	el("respecDimTechs").className = player.dimtechs.respec ? "respecbtn" : "storebtn"
}

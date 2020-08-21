var setUnlocks
var powAdds = [null, 0, null, 0, 4, 4, 4]
function buyRepeatableInfinityUpgrade(id) {
	if (player.infinityPoints.lt(Decimal.pow(10, player.infinityUpgradesRespecced[id] + powAdds[id]))) return
	player.infinityPoints = player.infinityPoints.sub(Decimal.pow(10, player.infinityUpgradesRespecced[id] + powAdds[id]))
	player.infinityUpgradesRespecced[id]++
	if (id == 1) {
		player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), 10))
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
		document.getElementById("singularitytabbtn").style.display = "none"
		return
	} else document.getElementById("singularitytabbtn").style.display = ""
	if (player.singularity.unlocked) {
		document.getElementById("singularityunlock").style.display = "none"
		document.getElementById("singularitydiv").style.display = ""
		document.getElementById("sacrificedIP").textContent = shortenDimensions(player.singularity.sacrificed)
		document.getElementById("nextUpgrade").textContent = shortenCosts(Decimal.pow(10, player.singularity.upgraded * 2 + 32))
		document.getElementById("sacrificeIP").className = gainedSingularityPower().eq(0) ? "unavailablebtn" : "storebtn"
		document.getElementById("singularityPowerGain").textContent = shortenDimensions(gainedSingularityPower())
		document.getElementById("singularityPower").textContent = shortenDimensions(player.singularity.singularityPower)
		document.getElementById("darkMatterPerSecond").textContent = shortenDimensions(getDarkMatterPerSecond())
	} else {
		document.getElementById("singularityunlock").style.display = ""
		document.getElementById("singularitydiv").style.display = "none"
		document.getElementById("singularityunlcost").textContent = shortenCosts(1e30)
		document.getElementById("singularityunlock").className = player.infinityPoints.lt(1e30) ? "unavailablebtn" : "storebtn"
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
	player.infinityPoints = new Decimal(0)
	player.singularity.upgraded += Math.floor(player.singularity.sacrificed.div(Decimal.pow(10, player.singularity.upgraded * 2 + 30)).log(100))
	updateSingularity()
}

function getDarkMatterPerSecond() {
	return player.singularity.singularityPower.times(Decimal.pow(2, player.singularity.upgraded))
}

function getDarkMatterMult() {
	return player.singularity.darkMatter.add(1).pow(4)
}

//v1.2
document.getElementById("challenge16").onclick = function () {
	startChallenge("challenge16", Number.MAX_VALUE);
}

function updateDimTechs() {
	var shown = false
	if (player.infinityUpgradesRespecced != undefined) shown = player.singularity.unlocked
	if (!shown) {
		document.getElementById("dimtechstabbtn").style.display = "none"
		return
	} else document.getElementById("dimtechstabbtn").style.display = ""
	if (player.dimtechs.unlocked) {
		document.getElementById("dimtechsunlock").style.display = "none"
		document.getElementById("dimtechsdiv").style.display = ""
		var cost = getDimTechUpgradeCost()
		var canBuy = player.infinityPoints.gte(cost)
		for (var dim = 1; dim < 9; dim++) {
			document.getElementById("dim" + dim + "techbtn").innerHTML = "Level " + getFullExpansion(player.dimtechs["dim" + dim + "Upgrades"]) + "<br>" + shortenDimensions(getDiscountMultiplier("dim" + dim)) + "x per discount upgrade" + "<br><br>Cost: " + shortenCosts(cost) + " IP"
			document.getElementById("dim" + dim + "techbtn").className = canBuy ? "storebtn" : "unavailablebtn"
		}
		document.getElementById("ticktechbtn").innerHTML = "Level " + getFullExpansion(player.dimtechs.tickUpgrades) + "<br>" + shortenDimensions(getDiscountMultiplier("tick")) + "x per discount upgrade" + "<br><br>Cost: " + shortenCosts(cost) + " IP"
		document.getElementById("ticktechbtn").className = canBuy ? "storebtn" : "unavailablebtn"
		document.getElementById("respecDimTechs").className = player.dimtechs.respec ? "respecbtn" : "storebtn"
	} else {
		document.getElementById("dimtechsunlock").style.display = ""
		document.getElementById("dimtechsdiv").style.display = "none"
		document.getElementById("dimtechsunlcost").textContent = shortenCosts(1e95)
		document.getElementById("dimtechsunlock").className = player.infinityPoints.lt(1e95) ? "unavailablebtn" : "storebtn"
	}
}

function unlockDimTechs() {
	if (player.infinityPoints.lt(1e95) || player.dimtechs.unlocked) return
	player.infinityPoints = player.infinityPoints.sub(1e95)
	player.dimtechs.unlocked = true
	updateDimTechs()
}

function getNextDiscounts() {
	return Decimal.pow(2, player.dimtechs.discounts * (player.dimtechs.discounts + 1) / 4).times(1e22)
}

function getDimTechUpgradeCost() {
	var total = 0
	for (var dim = 1; dim < 9; dim++) total += player.dimtechs["dim" + dim + "Upgrades"]
	total += player.dimtechs.tickUpgrades
	return Decimal.pow(5, total).times(1e95)
}

function buyDimTech(dim, tick) {
	if (tick) var name = "tick"
	else var name = "dim" + dim
	if (player.infinityPoints.lt(getDimTechUpgradeCost())) return
	player.infinityPoints = player.infinityPoints.sub(getDimTechUpgradeCost())
	var oldMultiplier = getDiscountMultiplier(name)
	player.dimtechs[name + "Upgrades"]++
	if (tick) player.tickSpeedCost = player.tickSpeedCost.div(Decimal.pow(getDiscountMultiplier(name).div(oldMultiplier), player.dimtechs.discounts))
	else player[TIER_NAMES[dim] + "Cost"] = player[TIER_NAMES[dim] + "Cost"].div(Decimal.pow(getDiscountMultiplier(name).div(oldMultiplier), player.dimtechs.discounts))
	updateDimTechs()
}

function getDiscountMultiplier(id) {
	return Decimal.pow(1e38, Math.sqrt(player.dimtechs[id + "Upgrades"]))
}

function respecDimTechs() {
	player.dimtechs.respec = !player.dimtechs.respec
	document.getElementById("respecDimTechs").className = player.dimtechs.respec ? "respecbtn" : "storebtn"
}

var setUnlocks
var powAdds = [null, 0, null, 0, 4, 4, 4]
function buyRepeatableInfinityUpgrade(id) {
	if (player.infinityPoints.lt(Decimal.pow(10, player.infinityUpgradesRespecced[id] + powAdds[id]))) return
	player.infinityPoints=player.infinityPoints.sub(Decimal.pow(10, player.infinityUpgradesRespecced[id] + powAdds[id]))
	player.infinityUpgradesRespecced[id]++
	if (id==1) {
		player.tickspeed=player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), 10))
		updateTickSpeed()
	}
}

function getInfUpgPow(id) {
	var amt=player.infinityUpgradesRespecced[id]
	if (id==4) return amt*30
	if (id==5) return 1+amt*0.17
	if (id==6) return amt*20
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

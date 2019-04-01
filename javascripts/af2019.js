function getTimeFluxSpeed() {
	if (player.masterystudies === undefined ? false : player.masterystudies.includes("d42019")) {
		if (player.quantum.timeFluxPower === undefined) player.quantum.timeFluxPower = 1
		return Math.pow(Math.log10(player.money.add(1).log10()+1)+1, player.quantum.timeFluxPower)
	}
	return 1
}

function updateTimeFlux() {
	if (player.masterystudies === undefined ? true : !player.masterystudies.includes("d42019")) {
		document.getElementById("af2019tabbtn").style.display = "none"
		return
	}
	var power = player.quantum.timeFluxPower === undefined ? 1 : player.quantum.timeFluxPower
	var cost = Decimal.pow(10, power + 2)
	document.getElementById("af2019tabbtn").style.display = ""
	document.getElementById("timeFluxPower").textContent = getFullExpansion(power)
	document.getElementById("timeFluxUpg").className = "gluonupgrade " + (player.quantum.quarks.gte(cost) ? "stor" : "unavailabl") + "ebtn"
	document.getElementById("timeFluxUpgCost").textContent = shortenCosts(cost)
}

function buyTimeFluxUpg() {
	var cost = Decimal.pow(10, player.quantum.timeFluxPower + 2)
	if (!player.quantum.quarks.gte(cost)) return
	player.quantum.quarks = player.quantum.quarks.sub(cost).round()
	player.quantum.timeFluxPower++
	updateTimeFlux()
}

function revert() {
	clearInterval(gameLoopIntervalId)
	var oldSave = localStorage.getItem(btoa("dsAM_"+metaSave.current+"_af2019"))
	if (oldSave !== null) {
		localStorage.setItem(btoa("dsAM_"+metaSave.current), oldSave)
		localStorage.removeItem(btoa("dsAM_"+metaSave.current+"_af2019"))
	} else localStorage.removeItem(btoa("dsAM_"+metaSave.current))
	updateNewPlayer()
	closeToolTip()
	load_game()
	$.notify("April Fools!")
	setTimeout(function(){$.notify("Time Flux makes this game inflation, right?");},5000)
}

function toggleEverythingUseless() {
	player.aarexModifications.hideEverythingUseless = !player.aarexModifications.hideEverythingUseless
	document.getElementById("container").style.display = player.aarexModifications.hideEverythingUseless ? "none" : ""
	document.getElementById("hideEverythingUseless").textContent = (player.aarexModifications.hideEverythingUseless ? "Show" : "Hide") + " everything useless"
}
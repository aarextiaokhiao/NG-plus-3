function canAutoDilUpgs() {
	return player.aarexModifications.nguspV && player.eternityPoints.gte("1e40000")
}

function autoBuyDilUpgs() {
	if (player.autoEterOptions.dilUpgs) {
		var upgs=player.dilation.autoUpgrades
		var old=player.dilation.upgrades.length
		for (var u=0;u<upgs.length;u++) buyDilationUpgrade(upgs[u],true)
		maxAllDilUpgs()
		if (player.dilation.upgrades.length>old) {
			updateDilationUpgradeCosts()
			updateDilationUpgradeButtons()
		}
	}
}

function getD21Bonus() {
	let r=Math.max(player.eternityPoints.max(1).log10()/1e3-55,0)
	if (r>10) r=Math.log10(r)*5+5
	return r
}

function getD22Bonus() {
	let l=player.meta.antimatter.max(1).log10()
	return Decimal.pow(10,Math.max(Math.sqrt(Math.max(l-120,0))-10,0)/1.5)
}

function distribEx() {
	let toAdd=player.exdilation.unspent
	for (var u=1;u<5;u++) toAdd=toAdd.add(player.exdilation.spent[u])
	toAdd=toAdd.div(5)
	player.exdilation.unspent=toAdd
	for (var u=1;u<5;u++) player.exdilation.spent[u]=toAdd
	updateExdilation()
}
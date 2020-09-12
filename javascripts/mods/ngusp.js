function canAutoDilUpgs() {
	return player.aarexModifications.nguspV && player.eternityPoints.gte("1e40000")
}

function autoBuyDilUpgs() {
	if (player.autoEterOptions.dilUpgs) {
		var upgs = player.dilation.autoUpgrades
		var old = player.dilation.upgrades.length
		for (var u = 0; u < upgs.length; u++) {
			var upg = upgs[u]
			if (upg > 11) upg = DIL_UPG_OLD_POS_IDS[upg]
			buyDilationUpgrade(upg, true, true)
		}
		maxAllDilUpgs()
		if (player.dilation.upgrades.length > old) {
			updateDilationUpgradeCosts()
			updateDilationUpgradeButtons()
		}
	}
}

function getD21Bonus() {
	let r = Math.max(player.eternityPoints.max(1).log10() / 1e3 - 55, 0)
	if (r > 10) r = Math.log10(r) * 5 + 5
	return r
}

function getD22Bonus() {
	let l = player.meta.antimatter.max(1).log10()
	return Decimal.pow(10, Math.max(Math.sqrt(Math.max(l - 120, 0)) - 10, 0) / 1.5)
}

function distribEx() {
	let unl = []
	for (var i = 1; i <= DIL_UPG_SIZES[0]; i++) if (isDilUpgUnlocked("r" + i)) unl.push(i)
	let div = unl.length + 1
	let toAdd = player.exdilation.unspent
	for (var u = 0; u < div - 1; u++) toAdd = toAdd.add(player.exdilation.spent[unl[u]]||0)
	toAdd = toAdd.div(div)
	player.exdilation.unspent = toAdd
	for (var u = 0; u < div - 1; u++) player.exdilation.spent[unl[u]] = toAdd
	updateExdilation()
}



function getGSAmount() {
	return Decimal.min(Math.max(player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies, 0), player.eightAmount.div(50).floor())
}

function galacticSacrifice() {
	if (getGSAmount().eq(0)) return
	if (player.options.sacrificeConfirmation) if (!confirm("Galactic Sacrifice will do a galaxy reset, and then remove all of your galaxies, in exchange of galaxy points which can be use to buy many powerful upgrades, but it will take a lot of time to recover, are you sure you wanna do this?")) return
	alert("Your galaxy points will be earned when Nyan cat updated NG--.")
	player.galaxyPoints = player.galaxyPoints.add(getGSAmount())
	player.galaxies = -1
	galaxyReset()
}
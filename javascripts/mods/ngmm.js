function getGSAmount() {
	let galaxies = player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies;
	let ret = new Decimal(galaxies * player.eightAmount.div(20).toNumber());
	if (player.galacticSacrifice.upgrades.includes(32)) {
		return ret.times(galUpgrade32()).floor();
	} else {
		return ret.floor();
	}
}

function galacticSacrifice() {
	if (getGSAmount().eq(0)) return
	if (player.options.sacrificeConfirmation) if (!confirm("Galactic Sacrifice will do a galaxy reset, and then remove all of your galaxies, in exchange of galaxy points which can be use to buy many powerful upgrades, but it will take a lot of time to recover, are you sure you wanna do this?")) return
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.plus(getGSAmount())
	player.galaxies = -1
	player.galacticSacrifice.times++
	player.galacticSacrifice.time = 0
	galaxyReset()
}

function resetGalacticSacrifice() {
	return player.galacticSacrifice ? {
		galaxyPoints: new Decimal(0),
		time: 0,
		times: 0,
		upgrades: []
	} : undefined
}

function isIC3Trapped() {
	return (!player.challenges.includes("postc3") && player.aarexModifications.newGameMinusMinusVersion !== undefined) || player.currentEternityChall === "eterc14"
}

//v1.2

let galUpgradeCosts = {
	11: 1,
	12: 3,
	13: 20,
	21: 1,
	22: 5,
	23: 100,
	31: 2,
	32: 8,
	33: 1000
}

function buyGalaxyUpgrade(i) {
	if (player.galacticSacrifice.upgrades.includes(i) || player.galacticSacrifice.galaxyPoints.lt(galUpgradeCosts[i])) return
	player.galacticSacrifice.upgrades.push(i)
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.sub(galUpgradeCosts[i])
	if (i==11) for (d=1;d<8;d++) {
		var name = TIER_NAMES[d]
		player[name+"Cost"] = player[name+"Cost"].div(100)
	}
}

let galUpgrade12 = function () {
	return 2 * Math.pow(1 + player.galacticSacrifice.time / 600, 0.5);
}
let galUpgrade13 = function () {
	return player.galacticSacrifice.galaxyPoints.div(5).plus(1).pow(3)
}
let galUpgrade23 = function () {
	return player.galacticSacrifice.galaxyPoints.div(50).plus(2)
}
let galUpgrade32 = function () {
	return player.totalmoney.pow(0.003);
}
let galUpgrade33 = function () {
	return player.galacticSacrifice.galaxyPoints.div(200).plus(2)
}

function galacticUpgradeSpanDisplay () {
	document.getElementById('galspan12').innerHTML = formatValue(player.options.notation, galUpgrade12(), 1, 1)
	document.getElementById('galspan13').innerHTML = formatValue(player.options.notation, galUpgrade13(), 1, 1)
	document.getElementById('galspan23').innerHTML = formatValue(player.options.notation, galUpgrade23(), 1, 1)
	document.getElementById('galspan32').innerHTML = formatValue(player.options.notation, galUpgrade32(), 1, 1)
	document.getElementById('galspan33').innerHTML = formatValue(player.options.notation, galUpgrade33(), 1, 1)
}

function galacticUpgradeButtonTypeDisplay () {
	for (let i = 1; i <= 3; i++) {
		for (let j = 1; j <= 3; j++) {
			let e = document.getElementById('galaxy' + i + j);
			if (player.galacticSacrifice.upgrades.includes(+(i + '' + j))) {
				e.className = 'infinistorebtnbought'
			} else if (player.galacticSacrifice.galaxyPoints.gte(galUpgradeCosts[i + '' + j]) && (i === 1 || player.galacticSacrifice.upgrades.includes(+((i - 1) + '' + j)))) {
				e.className = 'infinistorebtn' + j;
			} else {
				e.className = 'infinistorebtnlocked'
			}
		}
	}
}
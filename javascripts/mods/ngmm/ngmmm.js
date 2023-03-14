function getTickspeedBoostRequirement(bulk = 1) {
	let resets = player.tickspeedBoosts + bulk - 1
	let mult = 5
	if (player.currentChallenge != "postcngmm_1" && player.currentChallenge != "postc1") {
		if (hasGSacUpg(34)) mult = 4
		if (player.infinityUpgrades.includes("postinfi52")) mult = 3
	}
	return {tier: inNC(4) ? 6 : 8, amount: resets * mult + (inNC(15) && inNGM(4) ? 10 : 30), mult: mult}
}

function tickspeedBoost(bulk) {
	if (isNaN(bulk)) return
	player.tickspeedBoosts += bulk
	doReset("tsb")
}

//v2.1
function getProductBoughtMult() {
	let mult = 1
	if (inNGM(3)) {
		mult = hasGSacUpg(24) && player.currentChallenge != "postcngm3_4" ? galMults.u24() : 0.2
		if (inNC(13) || player.currentChallenge == "postc1") mult = Decimal.div(mult, 2)
	}
	return mult
}

function isTickspeedBoostPossible() {
	if (!inNGM(3)) return
	if (inNC(5) || player.currentChallenge == "postcngm3_3") return
	return !tmp.ri
}

el("challenge15").onclick = function () {
	startNormalChallenge(15)
}

function autoTickspeedBoostBoolean() {
	var req = getTickspeedBoostRequirement()
	var amount = getAmount(req.tier)

	if (!isTickspeedBoostPossible()) return false
	if (inNGM(4) && inNC(14)) return false

	if (!player.autobuyers[13].isOn) return false
	if (player.autobuyers[13].ticks * 100 < player.autobuyers[13].interval) return false

	if (amount < req.amount) return false
	if (amount < getTickspeedBoostRequirement(player.autobuyers[13].bulk).amount) return false

	if (player.overXGalaxiesTickspeedBoost <= player.galaxies) return true
	if (player.autobuyers[13].priority < req.amount) return false
	return true
}

//v2.2
function manualTickspeedBoost() {
	if (!isTickspeedBoostPossible()) return
	if (cantReset()) return
	let req = getTickspeedBoostRequirement()
	let amount = getAmount(req.tier)
	if (!(amount >= req.amount)) return
	if ((player.infinityUpgrades.includes("bulkBoost") || hasAch("r28")) && (!inNC(14) || !inNGM(3))) tickspeedBoost(Math.floor((amount - req.amount) / req.mult + 1))
	else tickspeedBoost(1)
}

//v3.2
function divideTickspeedIC5() {
	if (player.currentChallenge != "postc5" || !inNGM(3)) return
	player.tickspeed = player.tickspeed.div(pow2(Math.pow(player.tickspeedBoosts, 1.5)))
}

//Others
function getTickspeedBoostPower() {
	let mult = 30
	if ((inNC(14) && inOnlyNGM(3)) || player.currentChallenge == "postcngm3_3") mult = 20
	else if (hasGSacUpg(14)) mult = 32
	if (inNC(6, 1)) mult *= Math.min(player.galaxies / 30, 1)
	let ic3PowerTB = player.tickspeedBoosts * mult
	let softCapStart = 1024
	let frac = 8
	if (player.currentChallenge=="postcngm3_1" || player.currentChallenge=="postc1") softCapStart = 0
	if (player.challenges.includes("postcngm3_1")) frac = 7
	if (ic3PowerTB > softCapStart) ic3PowerTB = Math.sqrt((ic3PowerTB - softCapStart) / frac + 1024) * 32 + softCapStart - 1024
	if (inNC(15) || player.currentChallenge == "postc1" || player.currentChallenge == "postcngm3_3") ic3PowerTB *= inNGM(4) ? .2 : Math.max(player.galacticSacrifice.galaxyPoints.div(1e3).add(1).log(8),1)
	else if (player.challenges.includes("postcngm3_3")) ic3PowerTB *= Math.max(Math.sqrt(player.galacticSacrifice.galaxyPoints.max(1).log10()) / 15 + .6, 1)
	if (hasAch("r67")) {
		let x = tmp.ic_power
		if (x > 4) x = Math.sqrt(x - 1) + 2
		ic3PowerTB *= x * .15 + 1
	}
	return ic3PowerTB
}
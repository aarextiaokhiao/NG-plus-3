var Autobuyer = function Autobuyer(target) {
	this.target = target
	this.cost = 1
	this.interval = 5000;
	this.priority = 1;
	this.ticks = 0;
	this.isOn = false;
	this.tier = 1;
	this.bulk = 1;
}

//FUNCTIONS (NG+3)
function getAutobuyerReduction() {
	return 0.6
}

function getAutobuyerData(i) {
	if (i > 13) return player.autobuyers[i-2]
	if (i == 13) return player.autoSacrifice
	if (i < 13) return player.autobuyers[i-1]
}

function autobuyerUpgRes() {
	if (inNGM(4) && id != 11) return "GP"
	return "IP"
}

function buyAutobuyer(id, quick) {
	let data = getAutobuyerData(id)
	if (autobuyerUpgRes() == "GP") {
		if (player.galacticSacrifice.galaxyPoints.lt(data.cost)) return false
		player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.minus(data.cost)
	} else {
		if (player.infinityPoints.lt(data.cost)) return false
		player.infinityPoints = player.infinityPoints.minus(data.cost)
	}

	if (data.interval == 100) {
		if (id > 8) return
		if (data.bulk >= 1e100) return false
		data.bulk = Math.min(data.bulk * 2, 1e100)
		data.cost = Math.ceil(2.4 * data.cost)
	} else {
		data.interval = Math.max(data.interval * getAutobuyerReduction(), 100);
		if (data.interval > 120) data.cost *= 2; //if your last purchase wont be very strong, dont double the cost
	}

	if (!quick) updateAutobuyers()
	return true
}

function toggleAutobuyerTarget(id) {
	let data = getAutobuyerData(id)
	data.target = data.target == id ? 10 + (id == 9 ? 0 : id) : id
	el("ab_" + autoBuyerKeys[id-1] + "_toggle").textContent = "Buys " + (data.target == id ? "singles" : id == 9 ? "max" : "until 10")
}

function maxAutobuyerUpgrades() {
	for (var i = getTotalNormalChallenges() + 1; i > 0; i--) {
		if (getAutobuyerData(i) % 1 !== 0) while (buyAutobuyer(i, true)) {}
	}
	updateAutobuyers()
}

function isABBuyUntil10(id) {
	return player.autobuyers[id - 1].target != id
}

function toggleAllABBulks() {
	var cond = false
	for (var i = 0; i <= 8; i++) {
		if (player.autobuyers[i] % 1 !== 0 && !isABBuyUntil10(i + 1)) {
			cond = true
			break
		}
	}

	for (var d = 1; d <= 8; d++) {
		if (player.autobuyers[d-1] % 1 !== 0) player.autobuyers[d-1].target = (cond ? 10 : 0) + d
	}
	if (player.autobuyers[8] % 1 !== 0) player.autobuyers[8].target = cond ? 10 : 0

	updateAutobuyers()
}
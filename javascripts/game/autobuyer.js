/*class Autobuyer {
  constructor(target) {
    this.target = target;
    this.cost = 1
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
  }

}*/

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
	return tmp.ngC ? 0.3 : 0.6
}

function buyAutobuyer(id, quick) {
	if ((inNGM(4) && id != 11 ? player.galacticSacrifice.galaxyPoints : player.infinityPoints).lt(player.autobuyers[id].cost)) return false

	if (inNGM(4) && id != 11) player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.minus(player.autobuyers[id].cost)
	else player.infinityPoints = player.infinityPoints.minus(player.autobuyers[id].cost)

	if (player.autobuyers[id].interval == 100) {
		if (id > 8) {
			if (player.autobuyers[id].bulkBought || player.infinityPoints.lt(1e4) || id > 10) return
			player.infinityPoints = player.infinityPoints.sub(1e4)
			player.autobuyers[id].bulkBought = true
		} else {
			if (player.autobuyers[id].bulk >= 1e100) return false
	
			player.autobuyers[id].bulk = Math.min(player.autobuyers[id].bulk * 2, 1e100);
			player.autobuyers[id].cost = Math.ceil(2.4 * player.autobuyers[id].cost);
		}
	} else {
		player.autobuyers[id].interval = Math.max(player.autobuyers[id].interval * getAutobuyerReduction(), 100);
		if (player.autobuyers[id].interval > 120) player.autobuyers[id].cost *= 2; //if your last purchase wont be very strong, dont double the cost
	}

	if (!quick) updateAutobuyers()

	return true
}

function toggleAutobuyerTarget(id) {
	if (player.autobuyers[id-1].target == id) {
		player.autobuyers[id-1].target = 10 + id
		el("toggleBtn" + id).textContent = "Buys until 10"
	} else {
		player.autobuyers[id-1].target = id
		el("toggleBtn" + id).textContent = "Buys singles"
	}
}

function maxAutobuyerUpgrades() {
	let order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	for (var i = order.length; i > 0; i--) {
		var id = order[i - 1]
		if (player.autobuyers[id - 1] % 1 !== 0) while (buyAutobuyer(id - 1, true)) {}
	}
	updateAutobuyers()
}

function isABBuyUntil10(id) {
	return player.autobuyers[id - 1].target >= 10
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
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

function updateABBulks() {
	for (var i = 0; i <= 8; i++) {
		el("toggleBtn" + (i == 8 ? "TickSpeed" : i + 1)).textContent = "Buys " + (!isABBuyUntil10(i + 1) ? "singles" : i == 8 ? "max" : "until 10")
	}
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
	updateABBulks()
}
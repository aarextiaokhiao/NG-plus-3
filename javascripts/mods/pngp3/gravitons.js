//Core
function doGravitonsUnlockStuff(){
	ghSave.gravitons.unl=true
	$.notify("Congratulations! You have unlocked Gravity Well!", "success")
	updateBLParticleUnlocks()
	updateTemp()
}

function getBrandNewGravitonsData() {
	return {
		unl: false,
        amount: E(0),
        best: E(0),

        tog: 0,
        dir: 0,
		dist: 0,
		cancel: 0
	}
}

let GRAV_BOOSTS = {
	0: {
		pos(x) {
			return Math.sqrt(x / 10 + 1)
		},
		neg(x) {
			return Math.sqrt(x / 5 + 1)
		},

		pos_disp(x) {
			return "Meta-Dimension Boosts are " + shorten(x) + "x stronger"
		},
		neg_disp(x) {
			return "Meta-Dimension Boosts scale " + shorten(x) + "x faster"
		},
	},
	1: {
		pos(x) {
			return Math.sqrt(x / 10 + 1)
		},
		neg(x) {
			return Math.sqrt(x / 10 + 1)
		},

		pos_disp(x) {
			return "Tickspeed softcaps are " + shorten(x) + "x weaker"
		},
		neg_disp(x) {
			return "Galaxy scalings start " + shorten(x) + "x earlier"
		},
	},
	2: {
		pos(x) {
			return 0
		},
		neg(x) {
			return 1
		},

		pos_disp(x) {
			return "Gain " + shorten(x * 100) + "% of electrons within Big Rips"
		},
		neg_disp(x) {
			return "Electrons are " + shorten(x) + "x weaker within Big Rips"
		},
	},
	3: {
		pos(x) {
			return 1
		},
		neg(x) {
			return 1
		},

		pos_disp(x) {
			return "2nd Infinite Time softcap is " + shorten(x) + "x weaker"
		},
		neg_disp(x) {
			return "Time Dimensions are reduced to ^" + shorten(x)
		},
	},
	4: {
		pos(x) {
			return 1
		},
		neg(x) {
			return 1
		},

		pos_disp(x) {
			return "Bosons boost Bosonic Force by " + shorten(x) + "x" //Or Higgs raise Bosons, but decay at a logarithmic rate.
		},
		neg_disp(x) {
			return "Bosons production is ^" + shorten(x)
		},
	},
	5: {
		pos(x) {
			return 1
		},
		neg(x) {
			return 1
		},

		pos_disp(x) {
			return "Electron Upgrades scale ^" + shorten(x) + " slower"
		},
		neg_disp(x) {
			return "Electrons are " + shorten(x) + "x weaker"
		},
	},
	6: {
		pos(x) {
			return 1
		},
		neg(x) {
			return 1
		},

		pos_disp(x) {
			return "Light Empowerments are " + shorten(x) + "x cheaper"
		},
		neg_disp(x) {
			return "All Lights scale " + shorten(x) + "x slower"
		},
	},
	7: {
		pos(x) {
			return {e: 1, m: 1}
		},
		neg(x) {
			return 1
		},

		pos_disp(x) {
			return "GhP multiplier upgrades are ^" + shorten(x.e) + ", x" + shorten(x.m) + " stronger"
		},
		neg_disp(x) {
			return "GhP gain is reduced to ^" + shorten(x)
		},
	},
}

//Functions
function hasGrav(x) {
	return false
}

function clickGv(x) {
	if (ghSave.gravitons.dist == ghSave.gravitons.tog) return
	if (!tmp.gv.core.can.includes(x)) return
	if (tmp.gv.core.on.includes(x)) return

	ghSave.gravitons.dist++
	if (ghSave.gravitons.dist == 2) ghSave.gravitons.dir = x > 2 ? 1 : 0
	updateGravitonsTemp()
	bosonicLabReset()
	resetLights()
}

function getGrav(x, type) {
	return tmp.gv.core[x][type + "eff"]
}

function respecGv() {
	if (!confirm("This will perform a Higgs reset. Are you sure?")) return
	ghSave.gravitons.dist = 0
	bosonicLabReset()
}

function upgGvReq() {
	return Math.floor(Math.pow(ghSave.gravitons.cancel / 10 + 1, 1.5) * 45)
}

function upgGv() {
	if (ghSave.hb.higgs < upgGvReq()) return
	ghSave.gravitons.cancel++
}

//Temp
function updateGravitonsTemp() {
	let data = {}
	let save = ghSave && ghSave.gravitons
	tmp.gv = data
	if (!save || !save.unl) return

	//gain
    data.gain = Decimal.pow(player.money.add(1).log10() / 1e20 + 1, save.dist / 2).sub(1)

	//the core
	let core = {
		on: [],
		can: []
	}
	if (save.dist == 0) core.can = [0]
	if (save.dist == 1) core.can = [1/*, 7*/] //TO-DO: Make adjacent rings start at any direction, and costs secondary activations.
	if (save.dist >= 1) core.on.push(0)
	if (save.dist > 1) {
		core.can = [save.dir ? 8 - save.dist : save.dist + 1]
		for (var i = 1; i < save.dist; i++) core.on.push(save.dir ? 8 - i : i)
	}
	let order = save.dir ? [0,7,6,5,4,3,2,1] : [0,1,2,3,4,5,6,7]
	for (var i = 0; i < 8; i++) {
		let smooth = true ? save.dist / 8 : 0
		let pos = save.dist > i ? (save.dist - i) * (1 - smooth) + 8 * smooth : 0
		let neg = Math.max(Math.sqrt(Math.max(save.dist - save.cancel, 0)) - Math.sqrt(i), 0)
		core[order[i]] = {
			p: pos,
			n: neg,
			p_eff: GRAV_BOOSTS[i].pos(pos),
			n_eff: GRAV_BOOSTS[i].neg(neg),
		}
	}
	data.core = core

	//gain toggles
	data.bulk = Math.floor(Math.sqrt(save.amount.add(1).log(6))) + 1
	data.next = E(6).pow(Math.pow(save.tog, 2)).sub(1)
}

//Displays
function updateGravitonsTab() {
    return

	/*
	el("gravAmt").innerHTML = shortenMoney(ghSave.gravitons.amount)
	el("gravGain").innerHTML = shorten(tmp.gv.gain)
	el("gravBest").innerHTML = shortenMoney(ghSave.gravitons.best)
	el("gravLeft").innerHTML = getFullExpansion(ghSave.gravitons.tog - ghSave.gravitons.dist) + " / " + ghSave.gravitons.tog
	el("gravNext").innerHTML = shortenMoney(tmp.gv.next)

	let can = ghSave.gravitons.tog > ghSave.gravitons.dist
	for (var i = 0; i < 8; i++) {
		let eff = tmp.gv.core[i]
		el("gv_"+i).className = tmp.gv.core.on.includes(i) ? "chosenbtn gw" : can && tmp.gv.core.can.includes(i) ? "storebtn gw" : "unavailablebtn gw"
		el("gv_"+i+"_data").innerHTML = "<b class='l_green'>+" + shortenMoney(eff.p) + "</b> / <b class='red'>-" + shortenMoney(eff.n) + "</b>"
		el("gv_"+i+"_eff").innerHTML = "<span class='l_green'>Pros: " + GRAV_BOOSTS[i].pos_disp(eff.p_eff) + "</span><br>" +
			"<span class='red'>Cons: " + GRAV_BOOSTS[i].neg_disp(eff.n_eff) + "</span>"
	}

	el("gv_upg").className = ghSave.hb.higgs >= upgGvReq() ? "gluonupgrade gw" : "unavailablebtn gw"
	el("gv_upg_req").textContent = getFullExpansion(ghSave.hb.higgs) + " / " + getFullExpansion(upgGvReq())
	*/
}
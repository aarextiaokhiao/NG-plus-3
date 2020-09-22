function updateNeutrinoBoostDisplay(){
	if (player.ghostify.neutrinos.boosts >= 1) {
		document.getElementById("preNeutrinoBoost1").textContent = getDilExp("neutrinos").toFixed(2)
		document.getElementById("neutrinoBoost1").textContent = getDilExp().toFixed(2)
	}
	if (player.ghostify.neutrinos.boosts >= 2) {
		document.getElementById("preNeutrinoBoost2").textContent = "^" + shorten(getMTSMult(273, "pn"))
		document.getElementById("neutrinoBoost2").textContent = "^" + shorten(getMTSMult(273))
		document.getElementById("preNeutrinoBoost2Exp").textContent = getMTSMult(273, ["pn", "intensity"]).toFixed(2)
		document.getElementById("neutrinoBoost2Exp").textContent = getMTSMult(273, "intensity").toFixed(2)
	}
	if (player.ghostify.neutrinos.boosts >= 3) document.getElementById("neutrinoBoost3").textContent = tmp.nb[3].toFixed(2)
	if (player.ghostify.neutrinos.boosts >= 4) document.getElementById("neutrinoBoost4").textContent = (tmp.nb[4] * 100 - 100).toFixed(1)
	if (player.ghostify.neutrinos.boosts >= 5) document.getElementById("neutrinoBoost5").textContent = (tmp.nb[5] * 100).toFixed(1)
	if (player.ghostify.neutrinos.boosts >= 6) document.getElementById("neutrinoBoost6").textContent = tmp.nb[6] < 10.995 ? (tmp.nb[6] * 100 - 100).toFixed(1) : getFullExpansion(Math.floor(tmp.nb[6] * 100 - 100))
	if (player.ghostify.neutrinos.boosts >= 7) {
		document.getElementById("neutrinoBoost7").textContent = (tmp.nb[7] * 100).toFixed(1)
		document.getElementById("preNeutrinoBoost7Eff").textContent = (getTreeUpgradeEfficiency("noNB") * 100).toFixed(1)
		document.getElementById("neutrinoBoost7Eff").textContent = (getTreeUpgradeEfficiency("br") * 100).toFixed(1)
	}
	if (player.ghostify.neutrinos.boosts >= 8) document.getElementById("neutrinoBoost8").textContent = (tmp.nb[8] * 100 - 100).toFixed(1)
	if (player.ghostify.neutrinos.boosts >= 9) document.getElementById("neutrinoBoost9").textContent = shorten(tmp.nb[9])
	if (player.ghostify.neutrinos.boosts >= 10) document.getElementById("neutrinoBoost10").textContent = tmp.nb[10].toFixed(4)
	if (player.ghostify.neutrinos.boosts >= 11) document.getElementById("neutrinoBoost11").textContent = shorten(tmp.nb[11])
}

function updateNeutrinoAmountDisplay(){
	document.getElementById("electronNeutrinos").textContent = shortenDimensions(player.ghostify.neutrinos.electron)
	document.getElementById("muonNeutrinos").textContent = shortenDimensions(player.ghostify.neutrinos.mu)
	document.getElementById("tauNeutrinos").textContent = shortenDimensions(player.ghostify.neutrinos.tau)
}

function updateNeutrinoUpgradeDisplay(){
	document.getElementById("neutrinoUpg1Pow").textContent = tmp.nu[0]
	document.getElementById("neutrinoUpg3Pow").textContent = shorten(tmp.nu[1])
	document.getElementById("neutrinoUpg4Pow").textContent = shorten(tmp.nu[2])
	if (player.ghostify.times > 4) document.getElementById("neutrinoUpg7Pow").textContent = shorten(tmp.nu[3])
	if (player.ghostify.times > 9) document.getElementById("neutrinoUpg12").setAttribute('ach-tooltip',
		"Normal galaxy effect: " + shorten(tmp.nu[4].normal) + "x to quark spin production, "+
		"Replicated galaxy effect: " + shorten(tmp.nu[4].replicated) + "x to EC14 reward, "+
		"Free galaxy effect: " + shorten(tmp.nu[4].free) + "x to IC3 reward"
	)
	if (player.ghostify.ghostlyPhotons.unl) {
		document.getElementById("neutrinoUpg14Pow").textContent=shorten(tmp.nu[5])
		document.getElementById("neutrinoUpg15Pow").textContent=shorten(tmp.nu[6])
	}
	var sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	for (var u = 1; u < 16; u++) {
		var e = false
		if (u > 12) e = player.ghostify.ghostlyPhotons.unl
		else e = player.ghostify.times + 3 > u || u < 5
		if (e) {
			if (hasNU(u)) document.getElementById("neutrinoUpg" + u).className = "gluonupgradebought neutrinoupg"
			else if (sum.gte(tmp.nuc[u])) document.getElementById("neutrinoUpg" + u).className = "gluonupgrade neutrinoupg"
			else document.getElementById("neutrinoUpg" + u).className = "gluonupgrade unavailablebtn"
		}
	}
}

function updateNeutrinosTab(){
	var generations = ["electron", "Muon", "Tau"]
	var neutrinoGain = getNeutrinoGain()
	var sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	document.getElementById("neutrinosGain").textContent="You gain " + shortenDimensions(neutrinoGain) + " " + generations[player.ghostify.neutrinos.generationGain - 1] + " neutrino" + (neutrinoGain.eq(1) ? "" : "s") + " each time you get 1 normal galaxy."
	setAndMaybeShow("neutrinosGainGhostify",player.achievements.includes("ng3p68"),'"You gain "+shortenDimensions(Decimal.times(\''+neutrinoGain.toString()+'\',tmp.qu.bigRip.bestGals*2e3))+" of all neutrinos each time you become a ghost 1x time."')
	
	updateNeutrinoAmountDisplay()
	updateNeutrinoBoostDisplay()
	updateNeutrinoUpgradeDisplay()
	
	if (player.ghostify.ghostParticles.gte(tmp.nbc[player.ghostify.neutrinos.boosts])) document.getElementById("neutrinoUnlock").className = "gluonupgrade neutrinoupg"
	else document.getElementById("neutrinoUnlock").className = "gluonupgrade unavailablebtn"
	if (player.ghostify.ghostParticles.gte(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))) document.getElementById("neutrinoMultUpg").className = "gluonupgrade neutrinoupg"
	else document.getElementById("neutrinoMultUpg").className = "gluonupgrade unavailablebtn"
	if (sum.gte(getGHPMultCost())) document.getElementById("ghpMultUpg").className = "gluonupgrade neutrinoupg"
	else document.getElementById("ghpMultUpg").className = "gluonupgrade unavailablebtn"
}

function onNotationChangeNeutrinos() {
	if (player.masterystudies == undefined) return
	document.getElementById("neutrinoUnlockCost").textContent=shortenDimensions(new Decimal(tmp.nbc[player.ghostify.neutrinos.boosts]))
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5, player.ghostify.neutrinos.multPower - 1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4, player.ghostify.neutrinos.multPower-1).times(2))
	document.getElementById("ghpMult").textContent=shortenDimensions(Decimal.pow(2, player.ghostify.multPower-1))
	document.getElementById("ghpMultUpgCost").textContent=shortenDimensions(getGHPMultCost())
	for (var u = 1; u < 16; u++) document.getElementById("neutrinoUpg" + u + "Cost").textContent=shortenDimensions(tmp.nuc[u])
}

function getNeutrinoGain() {
	let ret = Decimal.pow(5, player.ghostify.neutrinos.multPower - 1)
	if (player.ghostify.ghostlyPhotons.unl) ret = ret.times(tmp.le[5])
	if (hasNU(14)) ret = ret.times(tmp.nu[5])
	if (isNanoEffectUsed("neutrinos")) ret = ret.times(tmp.nf.effects.neutrinos)
	return ret
}

function buyNeutrinoUpg(id) {
	let sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost = tmp.nuc[id]
	if (sum.lt(cost) || player.ghostify.neutrinos.upgrades.includes(id)) return
	player.ghostify.neutrinos.upgrades.push(id)
	subNeutrinos(cost)
	if (id == 2) {
		document.getElementById("eggonsCell").style.display="none"
		document.getElementById("workerReplWhat").textContent="babies"
	}
	if (id == 5) updateElectrons(true)
}

function updateNeutrinoBoosts() {
	for (var b = 1; b <= 11; b++) document.getElementById("neutrinoBoost" + (b % 3 == 1 ? "Row" + (b + 2) / 3 : "Cell" + b)).style.display = player.ghostify.neutrinos.boosts >= b ? "" : "none"
	document.getElementById("neutrinoUnlock").style.display = player.ghostify.neutrinos.boosts >= getMaxUnlockedNeutrinoBoosts() ? "none" : ""
	document.getElementById("neutrinoUnlockCost").textContent = shortenDimensions(new Decimal(tmp.nbc[player.ghostify.neutrinos.boosts]))
}

function unlockNeutrinoBoost() {
	var cost = tmp.nbc[player.ghostify.neutrinos.boosts]
	if (!player.ghostify.ghostParticles.gte(cost) || player.ghostify.neutrinos.boosts>=getMaxUnlockedNeutrinoBoosts()) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.boosts++
	updateNeutrinoBoosts()
	updateTemp()
}

function getMaxUnlockedNeutrinoBoosts() {
	let x = 9
	if (player.ghostify.wzb.unl) x++
	if (!tmp.ngp3l && player.ghostify.hb.higgs > 0) x++
	return x
}

function hasNU(id) {
	return ghostified ? player.ghostify.neutrinos.upgrades.includes(id) : false
}

function buyNeutrinoMult() {
	let cost = Decimal.pow(4, player.ghostify.neutrinos.multPower - 1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.multPower++
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5, player.ghostify.neutrinos.multPower-1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4, player.ghostify.neutrinos.multPower-1).times(2))
}

function maxNeutrinoMult() {
	let cost = Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	let toBuy = Math.floor(player.ghostify.ghostParticles.div(cost).times(3).add(1).log(4))
	let toSpend = Decimal.pow(4,toBuy).sub(1).div(3).times(cost)
	player.ghostify.ghostParticles = player.ghostify.ghostParticles.sub(toSpend.min(player.ghostify.ghostParticles)).round()
	player.ghostify.neutrinos.multPower += toBuy
	document.getElementById("neutrinoMult").textContent = shortenDimensions(Decimal.pow(5, player.ghostify.neutrinos.multPower - 1))
	document.getElementById("neutrinoMultUpgCost").textContent = shortenDimensions(Decimal.pow(4, player.ghostify.neutrinos.multPower - 1).times(2))
}

var neutrinoBoosts = {
	boosts: {
		1: function(nt) {
			let nb1mult = .75
			if (tmp.newNGP3E) nb1mult = .8
			if (isLEBoostUnlocked(7)) nb1mult *= tmp.leBonus[7]
			let nb1neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			return Math.log10(1+nb1neutrinos)*nb1mult
		},
		2: function(nt) {
			let nb2neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			let nb2 = Math.pow(nb2neutrinos, .25) * 1.5
			return nb2 
		},
		3: function(nt) {
			if (tmp.ngp3l) { //NG+3L
				let nb3Neutrinos = Math.pow(Math.log10(Math.max(nt[0].max(1).log10()-5,1))/Math.log10(5),2)+Math.pow(Math.log10(Math.max(nt[1].max(1).log10()-5,1))/Math.log10(5),2)+Math.pow(Math.log10(Math.max(nt[2].max(1).log10()-5,1))/Math.log10(5),2)
				let nb3 = Math.pow(nb3Neutrinos / 3, .25) + 3
				if (nb3 > 6) nb3 = 3 + Math.log2(nb3 + 2)
				return nb3
			} else { //NG+3
				let nb3neutrinos = Math.sqrt(
					Math.pow(nt[0].max(1).log10(), 2) +
					Math.pow(nt[1].max(1).log10(), 2) +
					Math.pow(nt[2].max(1).log10(), 2)
				)
				let nb3 = Math.sqrt(nb3neutrinos + 625) / 25
				return nb3
			}
		},
		4: function(nt) {
			var nb4neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			var nb4 = Math.pow(nb4neutrinos, .25) * 0.07 + 1
			if (tmp.ngp3l && nb4 > 10) nb4 = 6 + Math.log2(nb4 + 6)
			return nb4
		},
		5: function(nt) {
			var nb5neutrinos = nt[0].max(1).log10()+nt[1].max(1).log10()+nt[2].max(1).log10()
			return Math.min(nb5neutrinos / 33, 1)
		},
		6: function(nt) {
			var nb6neutrinos = Math.pow(nt[0].add(1).log10(), 2) + Math.pow(nt[1].add(1).log10(), 2) + Math.pow(nt[2].add(1).log10(), 2)
			var nb6exp1 = .25
			if (tmp.newNGP3E) nb6exp1 = .26
			let nb6 = Math.pow(Math.pow(nb6neutrinos, nb6exp1) * 0.525 + 1, tmp.qu.bigRip.active ? 0.5 : 1)
			if (isLEBoostUnlocked(9)) nb6 *= tmp.leBonus[7]
			return nb6
		},
		7: function(nt) {
			let nb7exp = .5
			if (tmp.newNGP3E) nb7exp = .6
			let nb7neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb7 = Math.pow(Math.log10(1 + nb7neutrinos), nb7exp)*2.35
			if (!tmp.ngp3l) {
				if (nb7 > 4) nb7 = 2 * Math.log2(nb7)
				if (nb7 > 5) nb7 = 2 + Math.log2(nb7 + 3)
			}
			return nb7
		},
		8: function(nt) {
			let nb8neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			let nb8exp = .25
			if (tmp.newNGP3E) nb8exp = .27
			var nb8 = Math.pow(nb8neutrinos, nb8exp) / 10 + 1
			if (nb8 > 11) nb8 = 7 + Math.log2(nb8 + 5)
			return nb8
		},
		9: function(nt) {
			var nb9 = (nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10())/10
			if (tmp.ngp3l && nb9 > 4096) nb9 = Math.pow(Math.log2(nb9) + 4, 3)
			if (isLEBoostUnlocked(9)) nb9 *= tmp.leBonus[7]
			return nb9
		},
		10: function(nt) {
			let nb10neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb10 = Math.max(nb10neutrinos - 3e3, 0) / 75e4
			if (!tmp.ngp3l && nb10 > 0.1) nb10 = Math.log10(nb10 * 100) / 10
			return nb10
		},
		11: function(nt) {
			let nb11neutrinos = nt[0].add(nt[1]).add(nt[2]).add(1).log10()
			let nb11exp = Math.sqrt(nb11neutrinos)
			let nb11 = Decimal.pow(1.15, nb11exp)
			return nb11
		}
	}
}

function gainNeutrinos(bulk,type) {
	let gain = getNeutrinoGain().times(bulk)
	let gens = ["electron", "mu", "tau"]
	if (type == "all") {
		for (var g = 0; g < 3; g++) {
			var gen = gens[g]
			player.ghostify.neutrinos[gen] = player.ghostify.neutrinos[gen].add(gain).round()
		}
	} else if (type == "gen") {
		var gen = gens[player.ghostify.neutrinos.generationGain - 1]
		player.ghostify.neutrinos[gen] = player.ghostify.neutrinos[gen].add(gain).round()
	}
}

function subNeutrinos(sub) {
	let neu = player.ghostify.neutrinos
	let sum = neu.electron.add(neu.mu).add(neu.tau).round()
	let gen = ["electron", "mu", "tau"]
	for (g = 0; g < 3; g++) neu[gen[g]] = neu[gen[g]].sub(neu[gen[g]].div(sum).times(sub).min(neu[gen[g]])).round()
}

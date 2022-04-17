function updateNeutrinoBoostDisplay(){
	if (ghSave.neutrinos.boosts >= 1) {
		el("preNeutrinoBoost1").textContent = getDilExp("neutrinos").toFixed(2)
		el("neutrinoBoost1").textContent = getDilExp().toFixed(2)
	}
	if (ghSave.neutrinos.boosts >= 2) {
		el("preNeutrinoBoost2").textContent = "^" + shorten(getMTSMult(273, "pn"))
		el("neutrinoBoost2").textContent = "^" + shorten(getMTSMult(273))
		el("preNeutrinoBoost2Exp").textContent = getMTSMult(273, ["pn", "intensity"]).toFixed(2)
		el("neutrinoBoost2Exp").textContent = getMTSMult(273, "intensity").toFixed(2)
	}
	if (ghSave.neutrinos.boosts >= 3) el("neutrinoBoost3").textContent = tmp.nb[3].toFixed(2)
	if (ghSave.neutrinos.boosts >= 4) el("neutrinoBoost4").textContent = "^"+tmp.nb[4].toFixed(3)
	if (ghSave.neutrinos.boosts >= 5) el("neutrinoBoost5").textContent = (tmp.nb[5] * 100).toFixed(1)
	if (ghSave.neutrinos.boosts >= 6) el("neutrinoBoost6").textContent = tmp.nb[6] < 10.995 ? (tmp.nb[6] * 100 - 100).toFixed(1) : getFullExpansion(Math.floor(tmp.nb[6] * 100 - 100))
	if (ghSave.neutrinos.boosts >= 7) {
		el("neutrinoBoost7").textContent = (tmp.nb[7] * 100).toFixed(1)
		el("preNeutrinoBoost7Eff").textContent = (getTreeUpgradeEfficiency("noNB") * 100).toFixed(1)
		el("neutrinoBoost7Eff").textContent = (getTreeUpgradeEfficiency("br") * 100).toFixed(1)
	}
	if (ghSave.neutrinos.boosts >= 8) el("neutrinoBoost8").textContent = (tmp.nb[8] * 100 - 100).toFixed(1)
	if (ghSave.neutrinos.boosts >= 9) el("neutrinoBoost9").textContent = shorten(tmp.nb[9])
	if (ghSave.neutrinos.boosts >= 10) el("neutrinoBoost10").textContent = "-"+tmp.nb[10].toFixed(4)+"x"
	if (ghSave.neutrinos.boosts >= 11) el("neutrinoBoost11").textContent = shorten(tmp.nb[11])
	if (ghSave.neutrinos.boosts >= 12) el("neutrinoBoost12").textContent = shorten(tmp.nb[12])+"x"
}

function updateNeutrinoAmountDisplay(){
	el("electronNeutrinos").textContent = shortenDimensions(ghSave.neutrinos.electron)
	el("muonNeutrinos").textContent = shortenDimensions(ghSave.neutrinos.mu)
	el("tauNeutrinos").textContent = shortenDimensions(ghSave.neutrinos.tau)
}

function updateNeutrinoUpgradeDisplay(){
	el("gravRow").style.display = ghSave.gravitons.unl ? "" : "none"

	el("neutrinoUpg1Pow").textContent = tmp.nu[0]
	el("neutrinoUpg3Pow").textContent = shorten(tmp.nu[1])
	el("neutrinoUpg4Pow").textContent = shorten(tmp.nu[2])
	if (ghSave.times > 4) el("neutrinoUpg7Pow").textContent = shorten(tmp.nu[3])
	if (ghSave.times > 9) el("neutrinoUpg12").setAttribute('ach-tooltip',
		"Normal galaxy effect: " + shorten(tmp.nu[4].normal) + "x to quark spin production, "+
		"Replicated galaxy effect: " + shorten(tmp.nu[4].replicated) + "x to EC14 reward, "+
		"Free galaxy effect: " + shorten(tmp.nu[4].free) + "x to IC3 reward"
	)
	if (ghSave.ghostlyPhotons.unl) {
		el("neutrinoUpg14Pow").textContent=shorten(tmp.nu[5])
		el("neutrinoUpg15Pow").textContent=shorten(tmp.nu[6])
	}
	if (ghSave.gravitons.unl) el("neutrinoUpg16Pow").textContent=shorten(tmp.nu[7])
	var sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	for (var u = 1; u < 18; u++) {
		var e = false
		if (u > 15) e = ghSave.gravitons.unl
		else if (u > 12) e = ghSave.ghostlyPhotons.unl
		else e = ghSave.times + 3 > u || u < 5
		if (e) {
			if (hasNU(u)) el("neutrinoUpg" + u).className = "gluonupgradebought neutrinoupg"
			else if (sum.gte(tmp.nuc[u])) el("neutrinoUpg" + u).className = "gluonupgrade neutrinoupg"
			else el("neutrinoUpg" + u).className = "gluonupgrade unavailablebtn"
		}
	}
}

function updateNeutrinosTab(){
	var generations = ["electron", "Muon", "Tau"]
	var neutrinoGain = getNeutrinoGain()
	var sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	el("neutrinosGain").textContent="You gain " + shortenDimensions(neutrinoGain) + " " + generations[ghSave.neutrinos.generationGain - 1] + " neutrino" + (neutrinoGain.eq(1) ? "" : "s") + " each time you get 1 normal galaxy."
	setAndMaybeShow("neutrinosGainGhostify",hasAch("ng3p68"),'"You gain "+shortenDimensions(Decimal.times(\''+neutrinoGain.toString()+'\',brSave.bestGals*2e3))+" of all neutrinos each time you become a ghost 1x time."')
	
	updateNeutrinoAmountDisplay()
	updateNeutrinoBoostDisplay()
	updateNeutrinoUpgradeDisplay()
	
	if (ghSave.ghostParticles.gte(tmp.nbc[ghSave.neutrinos.boosts])) el("neutrinoUnlock").className = "gluonupgrade neutrinoupg"
	else el("neutrinoUnlock").className = "gluonupgrade unavailablebtn"
	if (ghSave.ghostParticles.gte(E_pow(4,ghSave.neutrinos.multPower-1).times(2))) el("neutrinoMultUpg").className = "gluonupgrade neutrinoupg"
	else el("neutrinoMultUpg").className = "gluonupgrade unavailablebtn"
	if (sum.gte(getGHPMultCost())) el("ghpMultUpg").className = "gluonupgrade neutrinoupg"
	else el("ghpMultUpg").className = "gluonupgrade unavailablebtn"
}

function onNotationChangeNeutrinos() {
	if (player.masterystudies == undefined) return
	el("neutrinoUnlockCost").textContent=shortenDimensions(E(tmp.nbc[ghSave.neutrinos.boosts]))
	el("neutrinoMult").textContent=shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
	el("neutrinoMultUpgCost").textContent=shortenDimensions(E_pow(4, ghSave.neutrinos.multPower-1).times(2))
	el("ghpMult").textContent=shortenDimensions(pow2(ghSave.multPower-1))
	el("ghpMultUpgCost").textContent=shortenDimensions(getGHPMultCost())
	for (var u = 1; u < 18; u++) el("neutrinoUpg" + u + "Cost").textContent=shortenDimensions(E(tmp.nuc[u]))
}

function getNeutrinoGain() {
	let ret = E_pow(5, ghSave.neutrinos.multPower - 1)
	if (ghSave.ghostlyPhotons.unl) ret = ret.times(tmp.le[5])
	if (hasNU(14)) ret = ret.times(tmp.nu[5])
	if (isNanoEffectUsed("neutrinos")) ret = ret.times(tmp.nf.effects.neutrinos)
	ret = doStrongerPowerReductionSoftcapDecimal(ret, E("e45000"), 0.25)
	return ret
}

function buyNeutrinoUpg(id) {
	let sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	let cost = tmp.nuc[id]
	if (sum.lt(cost) || ghSave.neutrinos.upgrades.includes(id)) return
	ghSave.neutrinos.upgrades.push(id)
	subNeutrinos(cost)
	if (id == 2) {
		el("eggonsCell").style.display="none"
		el("workerReplWhat").textContent="babies"
	}
	if (id == 5) updateElectrons(true)
}

function updateNeutrinoBoosts() {
	for (var b = 1; b <= 12; b++) el("neutrinoBoost" + (b % 3 == 1 ? "Row" + (b + 2) / 3 : "Cell" + b)).style.display = ghSave.neutrinos.boosts >= b ? "" : "none"
	el("neutrinoUnlock").style.display = ghSave.neutrinos.boosts >= getMaxUnlockedNeutrinoBoosts() ? "none" : ""
	el("neutrinoUnlockCost").textContent = shortenDimensions(E(tmp.nbc[ghSave.neutrinos.boosts]))
}

function unlockNeutrinoBoost() {
	var cost = tmp.nbc[ghSave.neutrinos.boosts]
	if (!ghSave.ghostParticles.gte(cost) || ghSave.neutrinos.boosts>=getMaxUnlockedNeutrinoBoosts()) return
	ghSave.ghostParticles=ghSave.ghostParticles.sub(cost).round()
	ghSave.neutrinos.boosts++
	updateNeutrinoBoosts()
	updateTemp()
}

function getMaxUnlockedNeutrinoBoosts() {
	let x = 9
	if (ghSave.wzb.unl) x++
	if (ghSave.hb.higgs > 0) x++
	if (ghSave.gravitons.unl) x++
	return x
}

function hasNU(id) {
	return ghostified ? ghSave.neutrinos.upgrades.includes(id) : false
}

function buyNeutrinoMult() {
	let cost = E_pow(4, ghSave.neutrinos.multPower - 1).times(2)
	if (!ghSave.ghostParticles.gte(cost)) return
	ghSave.ghostParticles=ghSave.ghostParticles.sub(cost).round()
	ghSave.neutrinos.multPower++
	el("neutrinoMult").textContent=shortenDimensions(E_pow(5, ghSave.neutrinos.multPower-1))
	el("neutrinoMultUpgCost").textContent=shortenDimensions(E_pow(4, ghSave.neutrinos.multPower-1).times(2))
}

function maxNeutrinoMult() {
	let cost = E_pow(4,ghSave.neutrinos.multPower-1).times(2)
	if (!ghSave.ghostParticles.gte(cost)) return
	let toBuy = Math.floor(ghSave.ghostParticles.div(cost).times(3).add(1).log(4))
	let toSpend = E_pow(4,toBuy).sub(1).div(3).times(cost)
	ghSave.ghostParticles = ghSave.ghostParticles.sub(toSpend.min(ghSave.ghostParticles)).round()
	ghSave.neutrinos.multPower += toBuy
	el("neutrinoMult").textContent = shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
	el("neutrinoMultUpgCost").textContent = shortenDimensions(E_pow(4, ghSave.neutrinos.multPower - 1).times(2))
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
			let nb3neutrinos = Math.sqrt(
				Math.pow(nt[0].max(1).log10(), 2) +
				Math.pow(nt[1].max(1).log10(), 2) +
				Math.pow(nt[2].max(1).log10(), 2)
			)
			let nb3 = Math.sqrt(nb3neutrinos + 625) / 25
			return nb3
		},
		4: function(nt) {
			var nb4neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			var nb4 = Math.pow(Math.log10(nb4neutrinos*(brSave.active?1:0.07)+1)/4+1,brSave.active?1:0.5)
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
			let nb6 = Math.pow(Math.pow(nb6neutrinos, nb6exp1) * 0.525 + 1, brSave.active ? 0.5 : 1)
			if (isLEBoostUnlocked(9)) nb6 *= tmp.leBonus[7]
			return nb6
		},
		7: function(nt) {
			let nb7exp = .5
			if (tmp.newNGP3E) nb7exp = .6
			let nb7neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb7 = Math.pow(Math.log10(1 + nb7neutrinos), nb7exp) * 2.35
			if (nb7 > 4) nb7 = 2 * Math.log2(nb7)
			return nb7
		},
		8: function(nt) {
			let nb8neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			let nb8exp = .25
			if (tmp.newNGP3E) nb8exp = .27
			var nb8 = Math.pow(nb8neutrinos, nb8exp) / 10 + 1
			if (nb8 > 3) nb8 = 3
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
			if (nb10 > 0.1) nb10 = Math.log10(nb10 * 100) / 10
			return nb10
		},
		11: function(nt) {
			let nb11neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb11exp = Math.sqrt(nb11neutrinos)
			let nb11 = E_pow(1.15, nb11exp)
			return nb11
		},
		12: function(nt) {
			let hb = ghSave.hb.higgs
			let nb12neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb12exp = hb / (Math.log2(hb * 1e5 / nb12neutrinos + 1) + 1)
			return E(3).pow(nb12exp)
		},
	}
}

function gainNeutrinos(bulk,type) {
	let gain = getNeutrinoGain().times(bulk)
	let gens = ["electron", "mu", "tau"]
	if (type == "all") {
		for (var g = 0; g < 3; g++) {
			var gen = gens[g]
			ghSave.neutrinos[gen] = ghSave.neutrinos[gen].add(gain).round()
		}
	} else if (type == "gen") {
		var gen = gens[ghSave.neutrinos.generationGain - 1]
		ghSave.neutrinos[gen] = ghSave.neutrinos[gen].add(gain).round()
	}
}

function subNeutrinos(sub) {
	let neu = ghSave.neutrinos
	let sum = neu.electron.add(neu.mu).add(neu.tau).round()
	let gen = ["electron", "mu", "tau"]
	for (g = 0; g < 3; g++) neu[gen[g]] = neu[gen[g]].sub(neu[gen[g]].div(sum).times(sub).min(neu[gen[g]])).round()
}

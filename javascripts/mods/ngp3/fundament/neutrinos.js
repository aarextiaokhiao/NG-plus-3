function updateNeutrinoAmountDisplay(){
	el("electronNeutrinos").textContent = shortenDimensions(ghSave.neutrinos.electron)
	el("muonNeutrinos").textContent = shortenDimensions(ghSave.neutrinos.mu)
	el("tauNeutrinos").textContent = shortenDimensions(ghSave.neutrinos.tau)
}

function updateNeutrinosTab(){
	var neutrinoGain = getNeutrinoGain()
	var sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	el("neutrinosGain").textContent="Gain " + shortenDimensions(neutrinoGain) + " " + NEUTRINO_NAMES[ghSave.neutrinos.generationGain - 1] + " Neutrino" + (neutrinoGain.eq(1) ? "" : "s") + " per 1 antimatter galaxy."
	
	updateNeutrinoAmountDisplay()
	updateNeutrinoBoostDisplay()
	updateNeutrinoUpgradeDisplay()
	
	if (ghSave.ghostParticles.gte(tmp.nbc[ghSave.neutrinos.boosts])) el("neutrinoUnlock").className = "gluonupgrade neutrinoupg"
	else el("neutrinoUnlock").className = "gluonupgrade unavailablebtn"
	if (ghSave.ghostParticles.gte(E_pow(4,ghSave.neutrinos.multPower-1).mul(2))) el("neutrinoMultUpg").className = "gluonupgrade neutrinoupg"
	else el("neutrinoMultUpg").className = "gluonupgrade unavailablebtn"
	if (sum.gte(getGHPMultCost())) el("ghpMultUpg").className = "gluonupgrade neutrinoupg"
	else el("ghpMultUpg").className = "gluonupgrade unavailablebtn"
}

function onNotationChangeNeutrinos() {
	if (!ghostified) return
	el("neutrinoUnlockCost").textContent=shortenDimensions(tmp.nbc[ghSave.neutrinos.boosts])
	el("neutrinoMult").textContent=shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
	el("neutrinoMultUpgCost").textContent=shortenDimensions(getNeutrinoMultCost())
	el("ghpMult").textContent=shortenDimensions(getGHPBaseMult())
	el("ghpMultUpgCost").textContent=shortenDimensions(getGHPMultCost())
	for (var u = 1; u <= 15; u++) el("neutrinoUpg" + u + "Cost").textContent=shortenDimensions(E(tmp.nuc[u]))
}

//Gain
const NEUTRINO_NAMES = ["electron", "Muon", "Tau"]
const NEUTRINO_TYPES = ["electron", "mu", "tau"]
function getNeutrinoGain() {
	let ret = E_pow(5, ghSave.neutrinos.multPower - 1)
	return ret
}

function gainNeutrinos(bulk, type) {
	let gain = getNeutrinoGain().mul(bulk)
	if (type == "all") for (var g = 0; g < 3; g++) gainNeutrinoType(gain, g)
	if (type == "gen") gainNeutrinoType(gain, ghSave.neutrinos.generationGain - 1)
}

function gainNeutrinoType(gain, type) {
	type = NEUTRINO_TYPES[type]
	ghSave.neutrinos[type] = ghSave.neutrinos[type].add(gain).round()
}

function subNeutrinos(sub) {
	let neu = ghSave.neutrinos
	let sum = neu.electron.add(neu.mu).add(neu.tau).round()
	let gen = ["electron", "mu", "tau"]
	for (g = 0; g < 3; g++) neu[gen[g]] = neu[gen[g]].sub(neu[gen[g]].div(sum).mul(sub).min(neu[gen[g]])).round()
}

//Upgrades
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

function hasNU(id) {
	return ghostified && ghSave.neutrinos.upgrades.includes(id)
}

function updateNU1Temp(){
	let x = 110
	if (!bigRipped()) x = Math.max(x - player.meta.resets, 0)
	tmp.nu[1] = x
}

function updateNU3Temp(){
	let log = quSave.colorPowers.b.log10()
	let exp = Math.max(log / 1e4 + 1, 2)
	let x
	if (exp > 2) x = E_pow(Math.max(log / 500 + 1, 1), exp)
	else x = Math.pow(Math.max(log / 500 + 1, 1), exp)
	tmp.nu[3] = x
}

function updateNU4Temp(){
	let nu4base = 30
	tmp.nu[4] = E_pow(nu4base, Math.pow(Math.max(-getTickspeed().div(1e3).log10() / 4e13 - 4, 0), 1/4))
}

function updateNU7Temp(){
	var nu7 = quSave.colorPowers.g.add(1).log10()/400
	if (nu7 > 40) nu7 = Math.sqrt(nu7*10)+20
	tmp.nu[7] = pow10(nu7) 
}

function updateNU12Temp(){
	tmp.nu[12] = { 
		normal: Math.sqrt(player.galaxies * .0035 + 1),
		free: player.dilation.freeGalaxies * .035 + 1,
		replicated: Math.sqrt(getTotalRG()) * .0175 + 1 //NU12 
	}
}

function updateNU13Temp(){
	tmp.nu[13] = pow10(Math.pow(player.eternityPoints.max(1).log10(), 3/4) / 1e6)
}

function updateNU14Temp(){
	tmp.nu[14] = Math.sqrt(quSave.replicants.quarks.max(1).log10() / 20 + 1)
}

function updateNeutrinoUpgradesTemp(){
	updateNU1Temp()
	updateNU3Temp()
	updateNU4Temp()
	updateNU7Temp()
	updateNU12Temp()
	updateNU13Temp()
	updateNU14Temp()
}

function updateNeutrinoUpgradeDisplay(){
	el("neutrinoUpg1Pow").textContent = tmp.nu[1]
	el("neutrinoUpg3Pow").textContent = shorten(tmp.nu[3])
	el("neutrinoUpg4Pow").textContent = shorten(tmp.nu[4])
	if (ghSave.times > 4) el("neutrinoUpg7Pow").textContent = shorten(tmp.nu[7])
	if (ghSave.times > 9) el("neutrinoUpg12").setAttribute('ach-tooltip',
		`Normal galaxy effect: ${shorten(tmp.nu[12].normal)}x to quark spin production,
		Replicated galaxy effect: ${shorten(tmp.nu[12].replicated)}x to EC14 reward,
		Tachyonic galaxy effect: ${shorten(tmp.nu[12].free)}x to IC3 base`
	)
	if (PHOTON.unlocked()) {
		el("neutrinoUpg13Pow").textContent=shorten(tmp.nu[13])+"x"
		el("neutrinoUpg14Pow").textContent="^"+shorten(tmp.nu[14])
	}
	var sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	for (var u = 1; u < 15; u++) {
		var e = false
		if (u > 12) e = PHOTON.unlocked()
		else e = ghSave.times + 3 > u || u < 5
		if (e) {
			if (hasNU(u)) el("neutrinoUpg" + u).className = "gluonupgradebought neutrinoupg"
			else if (sum.gte(tmp.nuc[u])) el("neutrinoUpg" + u).className = "gluonupgrade neutrinoupg"
			else el("neutrinoUpg" + u).className = "gluonupgrade unavailablebtn"
		}
	}
}

//Boosts
var neutrinoBoosts = {
	boosts: {
		1: function(nt) {
			let nb1mult = .75
			if (mod.p3ep) nb1mult = .8
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
			var nb4 = Math.log10(nb4neutrinos*(bigRipped()?1:0.07)+1)/4+1
			nb4 = Math.min(nb4, 2.5)
			if (!bigRipped()) nb4 = nb4 ** 0.5
			return nb4
		},
		5: function(nt) {
			var nb5neutrinos = nt[0].max(1).log10()+nt[1].max(1).log10()+nt[2].max(1).log10()
			return Math.min(nb5neutrinos / 33, 1)
		},
		6: function(nt) {
			var nb6neutrinos = Math.pow(nt[0].add(1).log10(), 2) + Math.pow(nt[1].add(1).log10(), 2) + Math.pow(nt[2].add(1).log10(), 2)
			var nb6exp1 = .25
			if (mod.p3ep) nb6exp1 = .26
			let nb6 = Math.pow(Math.pow(nb6neutrinos, nb6exp1) * 0.525 + 1, bigRipped() ? 0.5 : 1)
			return nb6
		},
		7: function(nt) {
			let nb7exp = .5
			if (mod.p3ep) nb7exp = .6
			let nb7neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb7 = Math.pow(Math.log10(1 + nb7neutrinos), nb7exp) * 2.35
			if (nb7 > 4) nb7 = 2 * Math.log2(nb7)
			return nb7
		},
		8: function(nt) {
			let nb8neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			let nb8exp = .25
			if (mod.p3ep) nb8exp = .27
			var nb8 = Math.pow(nb8neutrinos, nb8exp) / 10 + 1
			if (nb8 > 3) nb8 = 3
			return nb8
		},
		9: function(nt) {
			var nb9 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			return nb9
		},
		10: function(nt) {
			var nb10 = nt[0].add(1).log10()*nt[1].add(1).log10()*nt[2].add(1).log10()
			return nb10
		},
		11: function(nt) {
			var nb11 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			nb11 = Math.log10(nb11 + 10)
			return nb11
		},
		12: function(nt) {
			var nb12 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			return ghSave.time
		},
	}
}

function updateNeutrinoBoostsTemp() {
	if (!ghostified) return
	tmp.nb = {}

	var nt = []
	for (var g = 0; g < 3; g++) nt[g] = ghSave.neutrinos[(["electron","mu","tau"])[g]]
	for (var nb = 1; nb <= ghSave.neutrinos.boosts; nb++) tmp.nb[nb] = neutrinoBoosts.boosts[nb](nt)
}

function updateNeutrinoBoosts() {
	for (var b = 1; b <= 12; b++) el("neutrinoBoost" + (b % 3 == 1 ? "Row" + (b + 2) / 3 : "Cell" + b)).style.display = ghSave.neutrinos.boosts >= b ? "" : "none"
	el("neutrinoUnlock").style.display = ghSave.neutrinos.boosts >= 12 ? "none" : ""
	el("neutrinoUnlockCost").textContent = shortenDimensions(E(tmp.nbc[ghSave.neutrinos.boosts]))
}

function updateNeutrinoBoostDisplay(){
	if (hasNB(1)) {
		el("preNeutrinoBoost1").textContent = getDilExp("neutrinos").toFixed(2)
		el("neutrinoBoost1").textContent = getDilExp().toFixed(2)
	}
	if (hasNB(2)) {
		el("preNeutrinoBoost2").textContent = "^" + shorten(getMTSMult(273, "pn"))
		el("neutrinoBoost2").textContent = "^" + shorten(getMTSMult(273))
		el("preNeutrinoBoost2Exp").textContent = getMTSMult(273, ["pn", "intensity"]).toFixed(2)
		el("neutrinoBoost2Exp").textContent = getMTSMult(273, "intensity").toFixed(2)
	}
	if (hasNB(3)) el("neutrinoBoost3").textContent = tmp.nb[3].toFixed(2)+"x"
	if (hasNB(4)) el("neutrinoBoost4").textContent = "^"+tmp.nb[4].toFixed(3)
	if (hasNB(5)) el("neutrinoBoost5").textContent = (tmp.nb[5] * 100).toFixed(1)+"%"
	if (hasNB(6)) el("neutrinoBoost6").textContent = (tmp.nb[6] < 10.995 ? (tmp.nb[6] * 100 - 100).toFixed(1) : getFullExpansion(Math.floor(tmp.nb[6] * 100 - 100)))+"%"
	if (hasNB(7)) {
		el("neutrinoBoost7").textContent = (tmp.nb[7] * 100).toFixed(1)+"%"
		el("preNeutrinoBoost7Eff").textContent = (getTreeUpgradeEfficiency("noNB") * 100).toFixed(1)
		el("neutrinoBoost7Eff").textContent = (getTreeUpgradeEfficiency("br") * 100).toFixed(1)
	}
	if (hasNB(8)) el("neutrinoBoost8").textContent = (tmp.nb[8] * 100 - 100).toFixed(1)+"x"
	if (hasNB(9)) el("neutrinoBoost9").textContent = shorten(tmp.nb[9])+"x"
	if (hasNB(10)) el("neutrinoBoost10").textContent = shorten(tmp.nb[10])+"x"
	if (hasNB(11)) el("neutrinoBoost11").textContent = "^"+shorten(tmp.nb[11])
	if (hasNB(12)) el("neutrinoBoost12").textContent = shorten(tmp.nb[12])+"x"
}

function unlockNeutrinoBoost() {
	var cost = tmp.nbc[ghSave.neutrinos.boosts]
	if (!ghSave.ghostParticles.gte(cost)) return
	if (!hasNB(12)) return
	ghSave.ghostParticles=ghSave.ghostParticles.sub(cost).round()
	ghSave.neutrinos.boosts++
	updateNeutrinoBoosts()
	updateTemp()
}

function hasNB(id) {
	return ghSave?.neutrinos.boosts >= id
}

//Multipliers
function getNeutrinoMultCost() {
	return E_pow(4, ghSave.neutrinos.multPower - 1).mul(2)
}

function buyNeutrinoMult(max) {
	let cost = getNeutrinoMultCost()
	if (!ghSave.ghostParticles.gte(cost)) return

	let toBuy = max ? Math.floor(ghSave.ghostParticles.div(cost).log(4) + 1) : 1
	ghSave.ghostParticles=ghSave.ghostParticles.sub(E_pow(4, toBuy - 1).mul(cost)).round()
	ghSave.neutrinos.multPower += toBuy

	el("neutrinoMult").textContent=shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
	el("neutrinoMultUpgCost").textContent=shortenDimensions(getNeutrinoMultCost())
}

function maxNeutrinoMult() {
	buyNeutrinoMult(true)
}

function getGHPBaseMult() {
	return E_pow(3, ghSave.multPower - 1)
}

function getGHPMultCost() {
	return E_pow(25, ghSave.multPower).mul(2e8)
}

function buyGHPMult(max) {
	let sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	let cost = getGHPMultCost()
	if (sum.lt(cost)) return

	let toBuy = max ? Math.floor(sum.div(cost).log(25) + 1) : 1
	subNeutrinos(E_pow(25,toBuy - 1).mul(cost))
	ghSave.multPower += toBuy

	el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
	el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
}

function maxGHPMult() {
	buyGHPMult(true)
}
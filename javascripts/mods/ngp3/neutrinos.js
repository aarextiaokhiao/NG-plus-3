function updateNeutrinoBoostDisplay(){
	if (player.ghostify.neutrinos.boosts>=1) {
		document.getElementById("preNeutrinoBoost1").textContent=getDilExp("neutrinos").toFixed(2)
		document.getElementById("neutrinoBoost1").textContent=getDilExp().toFixed(2)
	}
	if (player.ghostify.neutrinos.boosts>=2) {
		document.getElementById("preNeutrinoBoost2").textContent="^"+shorten(getMTSMult(273, "pn"))
		document.getElementById("neutrinoBoost2").textContent="^"+shorten(getMTSMult(273))
		document.getElementById("preNeutrinoBoost2Exp").textContent=getMTSMult(273, ["pn", "intensity"]).toFixed(2)
		document.getElementById("neutrinoBoost2Exp").textContent=getMTSMult(273, "intensity").toFixed(2)
	}
	if (player.ghostify.neutrinos.boosts>=3) document.getElementById("neutrinoBoost3").textContent=tmp.nb[3].toFixed(2)
	if (player.ghostify.neutrinos.boosts>=4) document.getElementById("neutrinoBoost4").textContent=(tmp.nb[4]*100-100).toFixed(1)
	if (player.ghostify.neutrinos.boosts>=5) document.getElementById("neutrinoBoost5").textContent=(tmp.nb[5]*100).toFixed(1)
	if (player.ghostify.neutrinos.boosts>=6) document.getElementById("neutrinoBoost6").textContent=tmp.nb[6]<10.995?(tmp.nb[5]*100-100).toFixed(1):getFullExpansion(Math.floor(tmp.nb[6]*100-100))
	if (player.ghostify.neutrinos.boosts>=7) {
		document.getElementById("neutrinoBoost7").textContent=(tmp.nb[7]*100).toFixed(1)
		document.getElementById("preNeutrinoBoost7Eff").textContent=(getTreeUpgradeEfficiency("noNB")*100).toFixed(1)
		document.getElementById("neutrinoBoost7Eff").textContent=(getTreeUpgradeEfficiency("br")*100).toFixed(1)
	}
	if (player.ghostify.neutrinos.boosts>=8) document.getElementById("neutrinoBoost8").textContent=(tmp.nb[8]*100-100).toFixed(1)
	if (player.ghostify.neutrinos.boosts>=9) document.getElementById("neutrinoBoost9").textContent=shorten(tmp.nb[9])
	if (player.ghostify.neutrinos.boosts>=10) document.getElementById("neutrinoBoost10").textContent=tmp.nb[10].toFixed(4)
	if (player.ghostify.neutrinos.boosts>=11) document.getElementById("neutrinoBoost11").textContent=shorten(tmp.nb[11])
}

function updateNeutrinoAmountDisplay(){
	document.getElementById("electronNeutrinos").textContent=shortenDimensions(player.ghostify.neutrinos.electron)
	document.getElementById("muonNeutrinos").textContent=shortenDimensions(player.ghostify.neutrinos.mu)
	document.getElementById("tauNeutrinos").textContent=shortenDimensions(player.ghostify.neutrinos.tau)
}

function updateNeutrinoUpgradeDisplay(){
	document.getElementById("neutrinoUpg1Pow").textContent=tmp.nu[0]
	document.getElementById("neutrinoUpg3Pow").textContent=shorten(tmp.nu[1])
	document.getElementById("neutrinoUpg4Pow").textContent=shorten(tmp.nu[2])
	if (player.ghostify.times>4) document.getElementById("neutrinoUpg7Pow").textContent=shorten(tmp.nu[3])
	if (player.ghostify.times>9) document.getElementById("neutrinoUpg12").setAttribute('ach-tooltip',
		"Normal galaxy effect: "+shorten(tmp.nu[4].normal)+"x to quark spin production, "+
		"Replicated galaxy effect: "+shorten(tmp.nu[4].replicated)+"x to EC14 reward, "+
		"Free galaxy effect: "+shorten(tmp.nu[4].free)+"x to IC3 reward"
	)
	if (player.ghostify.ghostlyPhotons.unl) {
		document.getElementById("neutrinoUpg14Pow").textContent=shorten(tmp.nu[5])
		document.getElementById("neutrinoUpg15Pow").textContent=shorten(tmp.nu[6])
	}
	var sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	for (var u=1;u<16;u++) {
		var e=false
		if (u>12) e=player.ghostify.ghostlyPhotons.unl
		else e=player.ghostify.times+3>u||u<5
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
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5,player.ghostify.neutrinos.multPower-1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))
	document.getElementById("ghpMult").textContent=shortenDimensions(Decimal.pow(2,player.ghostify.multPower-1))
	document.getElementById("ghpMultUpgCost").textContent=shortenDimensions(getGHPMultCost())
	for (var u=1; u<16; u++) document.getElementById("neutrinoUpg"+u+"Cost").textContent=shortenDimensions(tmp.nuc[u])
}

function getNeutrinoGain() {
	let ret=Decimal.pow(5,player.ghostify.neutrinos.multPower-1)
	if (player.ghostify.ghostlyPhotons.unl) ret=ret.times(tmp.le[5])
	if (hasNU(14)) ret=ret.times(tmp.nu[5])
	if (isNanoEffectUsed("neutrinos")) ret=ret.times(tmp.nf.effects.neutrinos)
	return ret
}

function buyNeutrinoUpg(id) {
	let sum=player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost=tmp.nuc[id]
	if (sum.lt(cost)||player.ghostify.neutrinos.upgrades.includes(id)) return
	player.ghostify.neutrinos.upgrades.push(id)
	subNeutrinos(cost)
	if (id==2) {
		document.getElementById("eggonsCell").style.display="none"
		document.getElementById("workerReplWhat").textContent="babies"
	}
	if (id==5) updateElectrons(true)
}

function updateNeutrinoBoosts() {
	for (var b=1;b<=11;b++) document.getElementById("neutrinoBoost"+(b%3==1?"Row"+(b+2)/3:"Cell"+b)).style.display=player.ghostify.neutrinos.boosts>=b?"":"none"
	document.getElementById("neutrinoUnlock").style.display=player.ghostify.neutrinos.boosts>=getMaxUnlockedNeutrinoBoosts()?"none":""
	document.getElementById("neutrinoUnlockCost").textContent=shortenDimensions(new Decimal(tmp.nbc[player.ghostify.neutrinos.boosts]))
}

function unlockNeutrinoBoost() {
	var cost=tmp.nbc[player.ghostify.neutrinos.boosts]
	if (!player.ghostify.ghostParticles.gte(cost)||player.ghostify.neutrinos.boosts>=getMaxUnlockedNeutrinoBoosts()) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.boosts++
	updateNeutrinoBoosts()
	updateTemp()
}

function getMaxUnlockedNeutrinoBoosts() {
	let x = 9
	if (player.ghostify.wzb.unl) x++
	if (!tmp.ngp3l && tmp.hb.higgs > 0) x++
	return x
}

function hasNU(id) {
	return ghostified ? player.ghostify.neutrinos.upgrades.includes(id) : false
}

function buyNeutrinoMult() {
	let cost=Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.multPower++
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5,player.ghostify.neutrinos.multPower-1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))
}

function maxNeutrinoMult() {
	let cost=Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	let toBuy=Math.floor(player.ghostify.ghostParticles.div(cost).times(3).add(1).log(4))
	let toSpend=Decimal.pow(4,toBuy).sub(1).div(3).times(cost)
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(toSpend.min(player.ghostify.ghostParticles)).round()
	player.ghostify.neutrinos.multPower+=toBuy
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5,player.ghostify.neutrinos.multPower-1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))
}

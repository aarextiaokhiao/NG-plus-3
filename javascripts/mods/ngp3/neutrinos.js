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

var dev = {};

dev.giveAllAchievements = function(slient) {
	var gave = []
	Object.keys(allAchievements).forEach(function(key) {
		var got = hasAch(key)
		giveAchievement(allAchievements[key], true)
		if (hasAch(key) && !got) gave.push(key)
	})
	if (!slient) {
		if (gave.length < 11) for (var a = 0; a < gave.length; a++) $.notify(allAchievements[gave[a]], "success")
		if (gave.length > 1) $.notify("Gave "+gave.length+" achievements.", "success")
		updateAchievements()
	}
}

dev.giveAllNGAchievements = function() {
	var gave = []
	Object.keys(allAchievements).forEach(function(key) {
		if (key[0] == "r" || key[0] == "s") {
			var got = hasAch(key)
			giveAchievement(allAchievements[key], true)
			if (hasAch(key) && !got) gave.push(key)
		}
	})
	if (gave.length < 11) for (var a = 0; a < gave.length; a++) $.notify(allAchievements[gave[a]], "success")
	if (gave.length > 1) $.notify("Gave " + gave.length + " achievements.", "success")
	updateAchievements()
}

dev.doubleEverything = function() {
	Object.keys(player).forEach( function(key) {
		if (typeof player[key] === "number") player[key] *= 2;
		if (typeof player[key] === "object" && player[key].constructor !== Object) player[key] = player[key].mul(2);
		if (typeof player[key] === "object" && !isFinite(player[key])) {
			Object.keys(player[key]).forEach( function(key2) {
				if (typeof player[key][key2] === "number") player[key][key2] *= 2
				if (typeof player[key][key2] === "object" && player[key][key2].constructor !== Object) player[key][key2] = player[key][key2].mul(2)
			})
		}
	})
}

dev.spin3d = function() {
	if (el("body").style.animation === "") el("body").style.animation = "spin3d 2s infinite"
	else el("body").style.animation = ""
}

dev.cancerize = function() {
	player.options.theme = "S4";
	player.options.secretThemeKey = "Cancer";
	setTheme(player.options.theme);
	player.options.notation = "Emojis"
	el("theme").textContent = "SO"
	el("notation").textContent = "BEAUTIFUL"
}

dev.implode = function() {
	el("body").style.animation = "implode 2s 1";
	setTimeout(function(){ el("body").style.animation = ""; }, 2000)
}

dev.giveQuantumStuff = function(n){
	quSave.usedQuarks.r = quSave.usedQuarks.r.add(pow10(n+1))
	quSave.usedQuarks.b = quSave.usedQuarks.b.add(pow10(n+1))
	quSave.usedQuarks.g = quSave.usedQuarks.g.add(pow10(n+1))
	quSave.gluons.rg = quSave.gluons.rg.add(pow10(n))
	quSave.gluons.gb = quSave.gluons.gb.add(pow10(n))
	quSave.gluons.br = quSave.gluons.br.add(pow10(n))
	quSave.colorPowers.r = quSave.colorPowers.r.add(pow10(n+2))
	quSave.colorPowers.b = quSave.colorPowers.b.add(pow10(n+2))
	quSave.colorPowers.g = quSave.colorPowers.g.add(pow10(n+2))
}

dev.addReward = function(){
	nfSave.rewards += 1
}

dev.setReward = function(n){
	nfSave.rewards = n
}

dev.setNeut = function(n){
	ghSave.neutrinos.electron = pow10(n)
	ghSave.neutrinos.mu = pow10(n)
	ghSave.neutrinos.tau = pow10(n)
}

dev.addNeut = dev.giveNeutrinos = dev.addNeutrinos = function(n){
	ghSave.neutrinos.electron = ghSave.neutrinos.electron.add(pow10(n))
	ghSave.neutrinos.mu = ghSave.neutrinos.mu.add(pow10(n))
	ghSave.neutrinos.tau = ghSave.neutrinos.tau.add(pow10(n))
}

/*
TEST ZONE
- Antimatter Galaxies scale Dilation rebuyables later.
- Antimatter Galaxies contribute to 3rd Nanobenefit but weaker.

- Improve TS226.
- Improve Mastery Study 373.
- Improve Blue Power Effect.

- Unsoftcap extra RGs.
- Remove the last EP multiplier scaling.
- Get unobtainable upgrades.
*/

dev.enterTestZone = function() {
	dev.testZone = true
	noSave = true

	ghSave.neutrinos.boosts = 12
	ghSave.neutrinos.upgrades.push(15, 16)
	beSave.upgrades.push(8, 9, 10)

	$.notify("Entered the test zone. You'll recieve experimental effects.")
	dev.quickZone()
}

dev.quickZone = function() {
	setInterval(function() {
		updatePerSecond()

		NT_RES.addAll(NT_RES.gain().mul(player.galaxies))
		quSave.time = 1e4
		player.replicanti.amount = pow10(tmp.rep.speeds.exp / Math.log10(tmp.rep.speeds.inc) * 3).max(player.replicanti.amount)

		if (bigRipped()) ghSave.ghostParticles = ghSave.ghostParticles.max(getGHPGain())
	}, 100)
}
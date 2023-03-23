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

dev.fixSave = function() {
	var save = JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; })
  
	var fixed = save.replace(/NaN/gi, "10")
	var stillToDo = JSON.parse(fixed)
	for (var i = 0; i < stillToDo.autobuyers.length; i++) stillToDo.autobuyers[i].isOn = false
	console.log(stillToDo)
    
	var save_data = stillToDo
	if (!save_data || !verify_save(save_data)) {
		alert('could not load the save..');
		load_custom_game();
		return;
	}

	player = save_data;
	save_game();
	reload();
}

dev.implode = function() {
	el("body").style.animation = "implode 2s 1";
	setTimeout(function(){ el("body").style.animation = ""; }, 2000)
}

dev.updateCosts = function() {
	for (var i = 1; i < 9; i++) {
		var dim = player["timeDimension"+i]
		if (dim.cost.gte(Number.MAX_VALUE)) {
			dim.cost = E_pow(timeDimCostMults[i]*1.5, dim.bought).mul(timeDimStartCosts[i])
		}
		if (dim.cost.gte("1e1300")) {
			dim.cost = E_pow(timeDimCostMults[i]*2.2, dim.bought).mul(timeDimStartCosts[i])
		}
		if (i > 4) {
			dim.cost = E_pow(timeDimCostMults[i]*100, dim.bought).mul(timeDimStartCosts[i])
		}
	}
}

dev.testTDCosts = function() {
	for (var i=1; i<9; i++) {
		var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e2900", "1e3300"]
		var dim = player["timeDimension"+i]
		if (dim.cost.gte(Number.MAX_VALUE)) {
			dim.cost = E_pow(timeDimCostMults[i]*1.5, dim.bought).mul(timeDimStartCosts[i])
		}
		if (dim.cost.gte("1e1300")) {
			dim.cost = E_pow(timeDimCostMults[i]*2.2, dim.bought).mul(timeDimStartCosts[i])
		}
		if (i > 4) {
			dim.cost = E_pow(timeDimCostMults[i]*100, dim.bought).mul(timeDimStartCosts[i])
		}
	}
}

dev.giveQuantumStuff = function(n){
	quSave.usedQuarks.r = quSave.usedQuarks.r.plus(pow10(n+1))
	quSave.usedQuarks.b = quSave.usedQuarks.b.plus(pow10(n+1))
	quSave.usedQuarks.g = quSave.usedQuarks.g.plus(pow10(n+1))
	quSave.gluons.rg = quSave.gluons.rg.plus(pow10(n))
	quSave.gluons.gb = quSave.gluons.gb.plus(pow10(n))
	quSave.gluons.br = quSave.gluons.br.plus(pow10(n))
	quSave.colorPowers.r = quSave.colorPowers.r.plus(pow10(n+2))
	quSave.colorPowers.b = quSave.colorPowers.b.plus(pow10(n+2))
	quSave.colorPowers.g = quSave.colorPowers.g.plus(pow10(n+2))
}

dev.addReward = function(){
	nfSave.rewards += 1
}

dev.setReward = function(n){
	nfSave.rewards = n
}

dev.addSpin = function(n){
	todSave.r.spin = todSave.r.spin.plus(pow10(n))
	todSave.b.spin = todSave.b.spin.plus(pow10(n))
	todSave.g.spin = todSave.g.spin.plus(pow10(n))
}

dev.addGHP = function(n){
	ghSave.ghostParticles = ghSave.ghostParticles.plus(pow10(n))
}

dev.setNeut = function(n){
	ghSave.neutrinos.electron = pow10(n)
	ghSave.neutrinos.mu = pow10(n)
	ghSave.neutrinos.tau = pow10(n)
}

dev.addNeut = function(n){
	ghSave.neutrinos.electron = ghSave.neutrinos.electron.plus(pow10(n))
	ghSave.neutrinos.mu = ghSave.neutrinos.mu.plus(pow10(n))
	ghSave.neutrinos.tau = ghSave.neutrinos.tau.plus(pow10(n))
}

dev.giveNeutrinos = function(n){
	dev.addNeut(n)
}

dev.addNeutrinos = function(n){
	dev.addNeut(n)
}

dev.enterTestZone = function() {
	/* 
	Test the Fundament Challenge:
	- Start with 0 best Antimatter in Dilation and 0 Dilated Time.
	- Mastery Studies 273, 322, 351, 393 are disabled.
	- No Positrons.
	- No Extra TP Exponents.
	- No Decay.
	*/
	dev.testZone = !dev.testZone
	doReset("funda")
}
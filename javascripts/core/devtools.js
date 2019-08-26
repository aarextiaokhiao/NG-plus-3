var dev = {};

dev.giveAllAchievements = function() {
    Object.keys(allAchievements).forEach( function(key) {
        giveAchievement(allAchievements[key])
    })
}

dev.doubleEverything = function() {
    Object.keys(player).forEach( function(key) {
        if (typeof player[key] === "number") player[key] *= 2;
        if (typeof player[key] === "object" && player[key].constructor !== Object) player[key] = player[key].times(2);
        if (typeof player[key] === "object" && !isFinite(player[key])) {
            Object.keys(player[key]).forEach( function(key2) {
                if (typeof player[key][key2] === "number") player[key][key2] *= 2
                if (typeof player[key][key2] === "object" && player[key][key2].constructor !== Object) player[key][key2] = player[key][key2].times(2)
            })
        }
    })
}

dev.spin3d = function() {
    if (document.getElementById("body").style.animation === "") document.getElementById("body").style.animation = "spin3d 2s infinite"
    else document.getElementById("body").style.animation = ""
}

dev.cancerize = function() {
    player.options.theme = "S4";
    player.options.secretThemeKey = "Cancer";
    setTheme(player.options.theme);
    player.options.notation = "Emojis"
    document.getElementById("theme").textContent = "SO"
    document.getElementById("notation").textContent = "BEAUTIFUL"
}

dev.fixSave = function() {
    var save = JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; })
  
    var fixed = save.replace(/NaN/gi, "10")
    var stillToDo = JSON.parse(fixed)
    for (var i=0; i<stillToDo.autobuyers.length; i++) stillToDo.autobuyers[i].isOn = false
    console.log(stillToDo)
    
    var save_data = stillToDo
    if (!save_data || !verify_save(save_data)) {
        alert('could not load the save..');
        load_custom_game();
        return;
    }

    saved = 0;
    totalMult = 1
    currentMult = 1
    infinitiedMult = 1
    achievementMult = 1
    challengeMult = 1
    unspentBonus = 1
    infDimPow = 1
    postc8Mult = new Decimal(0)
    mult18 = new Decimal(1)
    ec10bonus = new Decimal(1)
    player = save_data;
    save_game();
    load_game();
    updateChallenges()
    transformSaveToDecimal()
}

dev.implode = function() {
    document.getElementById("body").style.animation = "implode 2s 1";
    setTimeout(function(){ document.getElementById("body").style.animation = ""; }, 2000)
}

dev.ghostify = function(gain, amount, seconds=4) {
	document.getElementById("ghostifyani").style.display = ""
	document.getElementById("ghostifyani").style.width = "100%"
	document.getElementById("ghostifyani").style.height = "100%"
	document.getElementById("ghostifyani").style.left = "0%"
	document.getElementById("ghostifyani").style.top = "0%"
	document.getElementById("ghostifyani").style.transform = "rotateZ(0deg)"
	document.getElementById("ghostifyani").style["transition-duration"] = (seconds / 4) + "s"
	document.getElementById("ghostifyanitext").style["transition-duration"] = (seconds / 8) + "s"
	setTimeout(function() {
		document.getElementById("ghostifyanigained").innerHTML = ghostified ? "You now have <b>" + shortenDimensions(amount) + "</b> Ghost Particles. (+" + shortenDimensions(gain) + ")" : "Congratulations for beating a PC with QCs 6 & 8 combination!"
		document.getElementById("ghostifyanitext").style.left = "0%"
		document.getElementById("ghostifyanitext").style.opacity = 1
	}, seconds * 250)
	setTimeout(function() {
		document.getElementById("ghostifyanitext").style.left = "100%"
		document.getElementById("ghostifyanitext").style.opacity = 0
	}, seconds * 625)
	setTimeout(function() {
		document.getElementById("ghostifyani").style.width = "0%"
		document.getElementById("ghostifyani").style.height = "0%"
		document.getElementById("ghostifyani").style.left = "50%"
		document.getElementById("ghostifyani").style.top = "50%"
		document.getElementById("ghostifyani").style.transform = "rotateZ(45deg)"
	}, seconds * 750)
	setTimeout(dev.resetGhostify, seconds * 1000)
}

dev.resetGhostify = function() {
	document.getElementById("ghostifyani").style.width = "0%"
	document.getElementById("ghostifyani").style.height = "0%"
	document.getElementById("ghostifyani").style.left = "50%"
	document.getElementById("ghostifyani").style.top = "50%"
	document.getElementById("ghostifyani").style.transform = "rotateZ(-45deg)"
	document.getElementById("ghostifyani").style["transition-duration"] = "0s"
	document.getElementById("ghostifyanitext").style.left = "-100%"
	document.getElementById("ghostifyanitext").style["transition-duration"] = "0s"
}

dev.updateCosts = function() {
    for (var i=1; i<9; i++) {
        var dim = player["timeDimension"+i]
        if (dim.cost.gte(Number.MAX_VALUE)) {
            dim.cost = Decimal.pow(timeDimCostMults[i]*1.5, dim.bought).times(timeDimStartCosts[i])
        }
        if (dim.cost.gte("1e1300")) {
            dim.cost = Decimal.pow(timeDimCostMults[i]*2.2, dim.bought).times(timeDimStartCosts[i])
        }
        if (i > 4) {
          dim.cost = Decimal.pow(timeDimCostMults[i]*100, dim.bought).times(timeDimStartCosts[i])
        }
    }
}

dev.testTDCosts = function() {
    for (var i=1; i<9; i++) {
        var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e2900", "1e3300"]
        var dim = player["timeDimension"+i]
        if (dim.cost.gte(Number.MAX_VALUE)) {
            dim.cost = Decimal.pow(timeDimCostMults[i]*1.5, dim.bought).times(timeDimStartCosts[i])
        }
        if (dim.cost.gte("1e1300")) {
            dim.cost = Decimal.pow(timeDimCostMults[i]*2.2, dim.bought).times(timeDimStartCosts[i])
        }
        if (i > 4) {
          dim.cost = Decimal.pow(timeDimCostMults[i]*100, dim.bought).times(timeDimStartCosts[i])
        }
    }
}
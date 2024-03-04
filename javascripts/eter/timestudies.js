// Time studies
function buyWithAntimatter() {
	if (player.money.gte(player.timestudy.amcost)) {
		player.money = player.money.minus(player.timestudy.amcost)
		player.timestudy.amcost = player.timestudy.amcost.mul(E("1e20000"))
		player.timestudy.theorem += 1
		updateTimeStudyButtons(true)
		return true
	} else return false
}

function buyWithIP() {
	if (player.infinityPoints.gte(player.timestudy.ipcost)) {
		player.infinityPoints = player.infinityPoints.minus(player.timestudy.ipcost)
		player.timestudy.ipcost = player.timestudy.ipcost.mul(1e100)
		player.timestudy.theorem += 1
		updateTimeStudyButtons(true)
		return true
	} else return false
}

function buyWithEP() {
	if (!canBuyTTWithEP()) {
		alert("You need to buy at least 1 Time Dimension before you can purchase Theorems with Eternity Points.")
		return false;
	}
	if (player.eternityPoints.gte(player.timestudy.epcost)) {
		player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost)
		player.timestudy.epcost = player.timestudy.epcost.mul(2)
		player.timestudy.theorem += 1
		updateTimeStudyButtons(true)
		return true
	}
}

function canBuyTTWithEP() {
	return player.timeDimension1.bought || bigRipped()
}

function maxTheorems() {
	var gainTT = Math.floor((player.money.log10() - player.timestudy.amcost.log10()) / 20000 + 1)
	if (gainTT > 0) {
		player.timestudy.theorem += gainTT
		player.timestudy.amcost = player.timestudy.amcost.mul(E_pow("1e20000", gainTT))
		player.money = player.money.sub(player.timestudy.amcost.div("1e20000"))
	}
	
	gainTT = Math.floor((player.infinityPoints.log10() - player.timestudy.ipcost.log10()) / 100 + 1)
	if (gainTT > 0) {
		player.timestudy.theorem += gainTT
		player.timestudy.ipcost = player.timestudy.ipcost.mul(E_pow("1e100", gainTT))
		player.infinityPoints = player.infinityPoints.sub(player.timestudy.ipcost.div("1e100"))
	}
	
	gainTT = Math.floor(player.eternityPoints.div(player.timestudy.epcost).add(1).log2())
	if (gainTT > 0 && canBuyTTWithEP()) {
		player.timestudy.theorem += gainTT
		player.eternityPoints = player.eternityPoints.sub(pow2(gainTT).sub(1).mul(player.timestudy.epcost))
		if (!break_infinity_js && isNaN(player.eternityPoints.logarithm)) player.eternityPoints = E(0)
		player.timestudy.epcost = player.timestudy.epcost.mul(pow2(gainTT))
	}
	updateTimeStudyButtons(true)
}

function updateTheoremButtons() {
	if (player.dilation.upgrades.includes(10) && getPassiveTTGen() >= 10) {
		el("theoremmax").style.display = "none"
		el("theoremam").style.display = "none"
		el("theoremip").style.display = "none"
		el("theoremep").style.display = "none"
		el("timetheorems").style.bottom = "0"
		el("theorembuybackground").style.bottom = "-80px"
	} else {
		el("theoremmax").style.display = ""
		el("theoremam").style.display = ""
		el("theoremip").style.display = ""
		el("theoremep").style.display = ""
		el("timetheorems").style.bottom = "80px"
		el("theorembuybackground").style.bottom = "0"
		el("theoremam").className = player.money.gte(player.timestudy.amcost) ? "timetheorembtn" : "timetheorembtnlocked"
		el("theoremip").className = player.infinityPoints.gte(player.timestudy.ipcost) ? "timetheorembtn" : "timetheorembtnlocked"
		el("theoremep").className = player.eternityPoints.gte(player.timestudy.epcost) ? "timetheorembtn" : "timetheorembtnlocked"
		el("theoremep").innerHTML = "Buy Time Theorems <br>Cost: " + shortenDimensions(player.timestudy.epcost) + " EP"
		el("theoremip").innerHTML = "Buy Time Theorems <br>Cost: " + shortenCosts(player.timestudy.ipcost) + " IP"
		el("theoremam").innerHTML = "Buy Time Theorems <br>Cost: " + shortenCosts(player.timestudy.amcost)
		el("theoremmax").innerHTML = (speedrunMilestones > 2 && player.masterystudies) ? ("Auto max: "+(player.autoEterOptions.tt ? "ON" : "OFF")) : "Buy max Theorems"
	}
	var tt = player.timestudy.theorem
	var html = "<span style='display:inline' class=\"TheoremAmount\">" + (tt >= 1e5 ? shortenMoney(tt) : getFullExpansion(Math.floor(tt))) + "</span> "
	if (tt >= 1e100) html += " Time Theorems" + (player.timestudy.theorem == 1e200 ? " (cap)" : "")
	else if (tt == 1) html = "You have " + html + " Time Theorem."
	else html = "You have " + html + " Time Theorems."
	el("timetheorems").innerHTML = html
}

function buyTimeStudy(name, check, quickBuy) {
	var cost = studyCosts[all.indexOf(name)]
	if (mod.rs) {
		if (player.timestudy.theorem < player.timestudy.ers_studies[name] + 1) return
		player.timestudy.theorem -= player.timestudy.ers_studies[name]+1
		player.timestudy.ers_studies[name]++
		updateTimeStudyButtons(true)
	} else if (shiftDown && check === undefined) studiesUntil(name);
	else if (player.timestudy.theorem >= cost && canBuyStudy(name) && !hasTimeStudy(name)) {
		player.timestudy.studies.push(name)
		player.timestudy.theorem -= cost
		updateTimeStudyClass(name, "bought")

		if (name == 131 && speedrunMilestones < 20) {
			if (player.replicanti.galaxybuyer) el("replicantiresettoggle").textContent = "Auto galaxy ON (disabled)"
			else el("replicantiresettoggle").textContent = "Auto galaxy OFF (disabled)"
		}
		if (quickBuy) return
		updateTimeStudyButtons(true)
		drawStudyTree()
	}
}

function buyDilationStudy(name, cost) {
	if (player.timestudy.theorem >= cost && !hasDilStudy(name) && (hasDilStudy(name - 1) || name < 2)) {
		if (name < 2) {
			if (ECComps("eterc11") + ECComps("eterc12") < 10 || getTotalTT(player) < 13000) return
			TAB_CORE.open('dil')
			if (player.eternityUpgrades.length < 1) giveAchievement("Work harder.")
		} else if (name > 5) {
			TAB_CORE.open('dim_meta')
			notifyFeature("md")
		}
		player.dilation.studies.push(name)
		player.timestudy.theorem -= cost
		el("dilstudy"+name).className = "dilationupgbought"
		updateTimeStudyButtons(true)
		drawStudyTree()
	}
}

function hasRow(row) {
	for (var i=0; i<player.timestudy.studies.length; i++) {
		if (Math.floor(player.timestudy.studies[i]/10) == row) return true
	}
}

function canBuyStudy(name) {
	var row = Math.floor(name / 10)
	var col = name % 10
	if (name == 33) {
		return hasTimeStudy(21) 
	}
	if (name == 62) {
		return player.eternityChalls.eterc5 !== undefined && hasTimeStudy(42)
	}

	if ((name == 71 || name == 72) && player.eternityChallUnlocked == 12) {
		return false;
	}

	if ((name == 72 || name == 73) && player.eternityChallUnlocked == 11) {
		return false;
	}

	if (name == 181) {
		return player.eternityChalls.eterc1 !== undefined && player.eternityChalls.eterc2 !== undefined && player.eternityChalls.eterc3 !== undefined && hasTimeStudy(171)
	}
	if (name == 201) return hasTimeStudy(192) && !player.dilation.upgrades.includes(8)
	if (name == 211 || name == 212) return hasTimeStudy(191)
	if (name == 213 || name == 214) return hasTimeStudy(193)
	switch(row) {

		case 1: return true
			break;

		case 2:
		case 5:
		case 6:
		case 11:
		case 15:
		case 16:
		case 17:
			if (hasRow(row-1)) return true; else return false
			break;
		case 3:
		case 4:
		case 8:
		case 9:
		case 10:
		case 13:
		case 14:
			if (hasTimeStudy((row-1)*10 + col)) return true; else return false
			break;
		case 12:
			if (hasRow(row-1) && (!hasRow(row) || hasMasteryStudy("t272"))) return true; else return false
			break;
		case 7:
			if (!hasTimeStudy(61)) return false;
			if (player.dilation.upgrades.includes(8)) return true;
			var have = player.timestudy.studies.filter(function(x) {return Math.floor(x / 10) == 7}).length;
			if (hasTimeStudy(201)) return have < 2;
			return have < 1;
			break;

		case 19:
			return player.eternityChalls.eterc10 !== undefined && hasTimeStudy(181)
			break;

		case 22:
			return hasTimeStudy(210 + Math.round(col/2)) && (((name%2 == 0) ? !hasTimeStudy(name-1) : !hasTimeStudy(name+1)) || hasMasteryStudy("t302"))
			break;

		case 23:
			return (hasTimeStudy(220 + Math.floor(col*2)) || hasTimeStudy(220 + Math.floor(col*2-1))) && (!hasTimeStudy((name%2 == 0) ? name-1 : name+1) || hasMasteryStudy("t302"))
			break;
	}
}

var all = [11, 21, 22, 33, 31, 32, 41, 42, 51, 61, 62, 71, 72, 73, 81, 82 ,83, 91, 92, 93, 101, 102, 103, 111, 121, 122, 123, 131, 132, 133, 141, 142, 143, 151, 161, 162, 171, 181, 191, 192, 193, 201, 211, 212, 213, 214, 221, 222, 223, 224, 225, 226, 227, 228, 231, 232, 233, 234]
var studyCosts = [1, 3, 2, 2, 3, 2, 4, 6, 3, 3, 3, 4, 6, 5, 4, 6, 5, 4, 5, 7, 4, 6, 6, 12, 9, 9, 9, 5, 5, 5, 4, 4, 4, 8, 7, 7, 15, 200, 400, 730, 300, 900, 120, 150, 200, 120, 900, 900, 900, 900, 900, 900, 900, 900, 500, 500, 500, 500]
var performedTS
function updateTimeStudyButtons(changed, forceupdate = false) {
	if (!forceupdate && (changed ? player.dilation.upgrades.includes(10) : performedTS && !player.dilation.upgrades.includes(10))) return
	performedTS = true
	if (mod.rs) { // eternity
		var locked = getTotalTT(player) < 60
		el("nextstudy").textContent = locked ? "Next Time Study set unlocks at 60 total Time Theorems." : ""
		el("tsrow3").style.display = locked ? "none" : ""
		for (var id = 1; id < (locked ? 5 : 7); id++) {
			var b = player.timestudy.ers_studies[id]
			var c = b + 1
			el("ts" + id + "bought").textContent = getFullExpansion(b)
			el("ts" + id + "cost").textContent = getFullExpansion(c)
			el("ts" + id).className = "eternityttbtn" + (player.timestudy.theorem < c ? "locked" : "")
		}
		return
	}
	for (let [i, id] of Object.entries(all)) {
		updateTimeStudyClass(id, hasTimeStudy(id) ? "bought" : canBuyStudy(id) && player.timestudy.theorem >= studyCosts[i] ? "" : "locked")
	}

	//Dilation
	for (var i = 1; i < 7; i++) {
		if (hasDilStudy(i)) el("dilstudy"+i).className = "dilationupgbought"
		else if (player.timestudy.theorem >= ([null, 5e3, 1e6, 1e7, 1e8, 1e9, 1e24])[i] && (hasDilStudy(i - 1) || (i < 2 && ECComps("eterc11") > 4 && ECComps("eterc12") > 4 && getTotalTT(player) >= 13e3))) el("dilstudy" + i).className = "dilationupg"
		else el("dilstudy" + i).className = "timestudylocked"
	}
	el("dilstudy6").style.display = mod.ngpp ? "" : "none"

	//NG+3
	maybeShowFillAll()
	el("masteryportal").style.display = mod.ngp3 ? "" : "none"
	if (mod.ngp3) {
		el("masteryportal").innerHTML = "<b style='font-size: 13px'>Mastery Portal</b>" +
			"<span>" + (
				MTS.unl() ? "Find more knowledge... Advance to Mastery." :
				hasDilStudy(6) ? "66%: Purchase the last Dilation Upgrade" :
				hasDilStudy(1) ? "33%: Unleash the Meta" :
				"0%: Adjust the flow of time")
			+ "</span>"
		el("masteryportal").className = player.dilation.upgrades.includes("ngpp6") ? "dilationupgrebuyable" : "timestudylocked"
	}
}

hasTimeStudy = x => player.timestudy.studies.includes(x)

function updateTimeStudyClass(id, type = "") {
	let className = "timestudy" + type
	if (id > 70 && id < 110) {
		className += " " + [null, "normal", "inf", "time"][id % 10] + "dimstudy"
	} else if (id > 120 && id < 150) {
		className += " " + [null, "active", "passive", "idle"][id % 10] + "study"
	} else if (id > 220) {
		className += " " + ["light", "dark"][id % 2] + "study"
	}
	el(id).className = className
}

function studiesUntil(id) {
	var col = id % 10;
	var row = Math.floor(id / 10);
	var path = [0,0];
	for (var i = 1; i < 4; i++){
		if (hasTimeStudy(70 + i)) path[0] = i;
		if (hasTimeStudy(120 + i)) path[1] = i;
	}
	if ((row > 10 && path[0] === 0) || (row > 14 && path[1] === 0)) {
		return;
	}
	for (var i = 1; i < row; i++) {
		var chosenPath = path[i > 11 ? 1 : 0];
		if (row > 6 && row < 11) var secondPath = col;
		if ((i > 6 && i < 11) || (i > 11 && i < 15)) buyTimeStudy(i * 10 + (chosenPath === 0 ? col : chosenPath), 0, true);
		if ((i > 6 && i < 11) && hasTimeStudy(201)) buyTimeStudy(i * 10 + secondPath, 0, true);
		else for (var j = 1; all.includes(i * 10 + j) ; j++) buyTimeStudy(i * 10 + j, 0, true);
	}
	buyTimeStudy(id, studyCosts[all.indexOf(id)], 0, true);
}

function respecTimeStudies(ecComp, load) {
	var respecTime = player.respec || (ecComp && player.eternityChallUnlocked <= 12) || load
	var gotAch = respecTime || player.timestudy.studies.length < 1

	if (respecTime) {
		if (mod.rs) {
			var temp = player.timestudy.theorem
			for (var id = 1; id < 7; id++) player.timestudy.theorem += player.timestudy.ers_studies[id] * (player.timestudy.ers_studies[id] + 1) / 2
			if (temp > player.timestudy.theorem) gotAch = false
			player.timestudy.ers_studies = [null,0,0,0,0,0,0]
		} else {
			let keep = isBigRipUpgradeActive(7) ? [192] : []
			for (var i = 0; i < all.length; i++) {
				if (hasTimeStudy(all[i]) && !keep.includes(all[i])) {
					player.timestudy.theorem += studyCosts[i]
					gotAch = false
				}
			}
			if (mod.ngp3 && player.timestudy.studies.length) delete quSave.wasted
			player.timestudy.studies = keep

			var ECCosts = [null, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1]
			player.timestudy.theorem += ECCosts[player.eternityChallUnlocked]
		}
		if (!load) updateTimeStudyButtons(true)
	}

	var respecMastery = false
	if (MTS.unl()) {
		respecMastery = player.respecMastery || load || (ecComp && player.eternityChallUnlocked >= 13)
		gotAch = gotAch && respecMastery
	}
	if (respecMastery) gotAch = MTS.respec(load, true) && gotAch

	player.eternityChallUnlocked = 0
	if (mod.ngp3) delete quSave.autoECN
	if (gotAch) giveAchievement("You do know how these work, right?")
}

function respecUnbuyableTimeStudies() {
	var respecedTS = []
	var secondSplitPick
	var earlyDLStudies = []
	for (var t = 0; t < all.length; t++) {
		var id = all[t]
		if (hasTimeStudy(id)) {
			if ((id < 120 || id > 150 || !secondSplitPick || secondSplitPick == id % 10 || hasMasteryStudy("t272")) && (id < 220 || !earlyDLStudies.includes(id % 2 > 0 ? id + 1 : id - 1) || hasMasteryStudy("t302"))) {
				respecedTS.push(id)
				if (id > 120 && id < 130) secondSplitPick = id % 10
				if (id > 220) earlyDLStudies.push(id)
			} else player.timestudy.theorem += studyCosts[t]
		}
	}
	player.timestudy.studies=respecedTS
}

function getTotalTT(tree) {
	tree = tree.timestudy

	var result = tree.theorem
	var ecCosts = [null, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1]
	for (var id = 0; id < all.length; id++) if (tree.studies.includes(all[id])) result += studyCosts[id]
	return result + ecCosts[player.eternityChallUnlocked]
}

function getStudyTreeStr() {
	var mtsstudies=[]
	if (mod.ngp3) {
		for (id = 0; id < player.masterystudies.length; id++) {
			var t = player.masterystudies[id].split("t")[1]
			if (t) mtsstudies.push(t)
		}
	}
	return player.timestudy.studies + (mtsstudies.length > 0 ? "," + mtsstudies + "|" : "|") + player.eternityChallUnlocked
}

function exportStudyTree() {
	exportData(getStudyTreeStr())
};

function importStudyTree(input) {
	onImport = true
	if (typeof input !== 'string') var input = prompt()
	onImport = false
	if (sha512_256(input) == "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608") giveAchievement("You followed the instructions")
	if (input === "") return false
	if (mod.rs) {
		let l = input.split('/');
		for (let i = 1; i <= l.length; i++) {
			for (let j = 0; j < l[i - 1]; j++) {
				if (!buyTimeStudy(i)) break;
			}
		}
	} else {
		var studiesToBuy = input.split("|")[0].split(",");
		var secondSplitPick = 0
		var laterSecondSplits = []
		var earlyDLStudies = []
		var laterDLStudies = []
		var oldLength = player.timestudy.length
		if (mod.ngp3) var oldLengthMS = player.masterystudies.length
		for (var i = 0; i < studiesToBuy.length; i++) {
			var study=parseInt(studiesToBuy[i])
			if ((study < 120 || study > 150 || (secondSplitPick < 1 || study % 10 == secondSplitPick)) && (study < 220 || study > 240 || earlyDLStudies.includes(study + (study % 2 > 0 ? - 1 : 1)))) {
				if (study > 120 && study < 150) secondSplitPick = study % 10
				else if (study > 220 && study < 240) earlyDLStudies.push(study)
				if (study > 240) buyMasteryStudy("t", study, true)
				else buyTimeStudy(study, 0, true);
			} else if (study < 150) laterSecondSplits.push(study)
			else laterDLStudies.push(study)
		}
		for (var i=0; i < laterSecondSplits.length; i++) buyTimeStudy(laterSecondSplits[i], 0, true)
		for (var i=0; i < laterDLStudies.length; i++) buyTimeStudy(laterDLStudies[i], 0, true)
		var ec = parseInt(input.split("|")[1])
		if (ec > 0) {
			justImported = true;
			if (ec > 12) {
				buyMasteryStudy("ec", ec, true)
				changeMS = true
			} else el("ec" + parseInt(input.split("|")[1]) + "unl").click();
			setTimeout(function(){ justImported = false; }, 100);
		}
		if (player.masterystudies.length > oldLengthMS) {
			updateMasteryStudyCosts()
			updateMasteryStudyButtons()
			updateMasteryStudyTextDisplay()
			drawMasteryTree()
		}
		if (player.timestudy.length > oldLength) {
			updateTimeStudyButtons(true)
			drawStudyTree()
		}
	}
};

let tsMults = {
	11() {
		let bigRip = bigRipped()
		let log = -player.tickspeed.div(1e3).pow(0.005).mul(0.95).add(player.tickspeed.div(1e3).pow(0.0003).mul(0.95)).log10()
		if (bigRip && log > 900) log = Math.sqrt(log * 900)
		else if (mod.p3ep) log = Math.min(log, 25000) // buff to NG^+++
		else if (!inNGM(2)) log = Math.min(log, 2500)
		if (log < 0) log = 0
		if (bigRip) log = softcap(log, "ts11_log_big_rip", 1)
		return pow10(log)
	},
	32: () => Math.pow(Math.max(player.resets, 1), mod.ngmu ? 4 : 1),
	41: () => mod.ngep ? 1.5 : 1.2,
	42: () => (mod.ngep ? 12 : 13) / 15,
	61: () => mod.ngep ? 100 : 10,
	62: () => mod.ngep ? 4 : 3,
	211: () => !inNGM(2) ? 5 : 1,
	212() {
		let r = player.timeShards.max(2).log2()
		if (mod.ngep) return Math.min(Math.pow(r, 0.006), 1.15)
		return Math.min(Math.pow(r, 0.005), 1.1)
	},
	222: () => !inNGM(2) ? 2 : .5,
	225() {
		let r = Math.floor(player.replicanti.amount.e / 1e3)
		if (r >= 100 && mod.ngp3) r = Math.sqrt(0.25 + (r - 99) * tmp.qu.chal.reward[8] * 2) + 98.5
		return r
	},
	226() {
		let r = Math.floor(player.replicanti.gal / 15)
		if (r >= 100 && mod.ngp3) r = dev.testZone ? (r + 300) / 8 : Math.sqrt(0.25 + (r - 99) * tmp.qu.chal.reward[8] * 2) + 98.5
		return r
	},
	232() {
		let pow = 0.001
		if (!bigRipped()) {
			if (hasGluonUpg("rg", 4)) pow = 0
			if (hasNB(10)) pow = Math.max(NT.eff("boost", 10) * 0.001, pow)
		}
		return Math.pow(1 + player.galaxies * pow, 0.2)
	}
}

//Dilation
function hasDilStudy(x) {
	return player.dilation.studies.includes(x)
}
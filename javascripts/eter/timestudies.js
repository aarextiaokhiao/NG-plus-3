presets={}

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
		alert("You need to buy at least 1 time dimension before you can purchase theorems with Eternity points.")
		return false;
	}
	if (player.eternityPoints.gte(player.timestudy.epcost)) {
		player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost)
		player.timestudy.epcost = player.timestudy.epcost.mul(2)
		player.timestudy.theorem += 1
		updateTimeStudyButtons(true)
		updateEternityUpgrades()
		return true
	} else return false
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
	
	gainTT = Math.floor(player.eternityPoints.div(player.timestudy.epcost).plus(1).log2())
	if (gainTT > 0 && canBuyTTWithEP()) {
		player.timestudy.theorem += gainTT
		player.eternityPoints = player.eternityPoints.sub(pow2(gainTT).sub(1).mul(player.timestudy.epcost))
		if (!break_infinity_js && isNaN(player.eternityPoints.logarithm)) player.eternityPoints = E(0)
		player.timestudy.epcost = player.timestudy.epcost.mul(pow2(gainTT))
	}
	updateTimeStudyButtons(true)
	updateEternityUpgrades()
}

function updateTheoremButtons() {
	if (player.dilation.upgrades.includes(10)) {
		el("theoremmax").style.display = "none"
		el("theoremam").style.display = "none"
		el("theoremip").style.display = "none"
		el("theoremep").style.display = "none"
		el("timetheorems").style.bottom = "0"
		el("presetsbtn").style.bottom = "-3px"
		el("theorembuybackground").style.bottom = "-80px"
	} else {
		el("theoremmax").style.display = ""
		el("theoremam").style.display = ""
		el("theoremip").style.display = ""
		el("theoremep").style.display = ""
		el("timetheorems").style.bottom = "80px"
		el("presetsbtn").style.bottom = "77px"
		el("theorembuybackground").style.bottom = "0"
		el("theoremam").className = player.money.gte(player.timestudy.amcost) ? "timetheorembtn" : "timetheorembtnlocked"
		el("theoremip").className = player.infinityPoints.gte(player.timestudy.ipcost) ? "timetheorembtn" : "timetheorembtnlocked"
		el("theoremep").className = player.eternityPoints.gte(player.timestudy.epcost) ? "timetheorembtn" : "timetheorembtnlocked"
		el("theoremep").innerHTML = "Buy Time Theorems <br>Cost: " + shortenDimensions(player.timestudy.epcost) + " EP"
		el("theoremip").innerHTML = "Buy Time Theorems <br>Cost: " + shortenCosts(player.timestudy.ipcost) + " IP"
		el("theoremam").innerHTML = "Buy Time Theorems <br>Cost: " + shortenCosts(player.timestudy.amcost)
		el("theoremmax").innerHTML = (speedrunMilestonesReached > 2 && player.masterystudies) ? ("Auto max: "+(player.autoEterOptions.tt ? "ON" : "OFF")) : "Buy max Theorems"
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
	else if (player.timestudy.theorem >= cost && canBuyStudy(name) && !player.timestudy.studies.includes(name)) {
		player.timestudy.studies.push(name)
		player.timestudy.theorem -= cost
		if (name == 71 || name == 81 || name == 91 || name == 101) {
			el(name).className = "timestudybought normaldimstudy"
		} else if (name == 72 || name == 82 || name == 92 || name == 102) {
			el(name).className = "timestudybought infdimstudy"
		} else if (name == 73 || name == 83 || name == 93 || name == 103) {
			el(name).className = "timestudybought timedimstudy"
		} else if (name == 121 || name == 131 || name == 141) {
			el(name).className = "timestudybought activestudy"
		} else if (name == 122 || name == 132 || name == 142) {
			el(name).className = "timestudybought passivestudy"
		} else if (name == 123 || name == 133 || name == 143) {
			el(name).className = "timestudybought idlestudy"
		} else if (name == 221 || name == 224 || name == 225 || name == 228 || name == 231 || name == 234) {
			el(name).className = "timestudybought darkstudy"
		} else if (name == 222 || name == 223 || name == 226 || name == 227 || name == 232 || name == 233) {
			el(name).className = "timestudybought lightstudy"
		} else {
			el(name).className = "timestudybought"
		}
		if (name == 131 && speedrunMilestonesReached < 20) {
			if (player.replicanti.galaxybuyer) el("replicantiresettoggle").textContent = "Auto galaxy ON (disabled)"
			else el("replicantiresettoggle").textContent = "Auto galaxy OFF (disabled)"
		}
		if (quickBuy) return
		updateTimeStudyButtons(true)
		drawStudyTree()
	}
}

function getDilationTotalTTReq() {
	return 13000
}

function buyDilationStudy(name, cost) {
	if (player.timestudy.theorem >= cost && !hasDilStudy(name) && (hasDilStudy(name - 1) || name < 2)) {
		if (name < 2) {
			if (ECComps("eterc11") + ECComps("eterc12") < 10 || getTotalTT(player) < getDilationTotalTTReq()) return
			showEternityTab("dilation")
			if (player.eternityUpgrades.length < 1) giveAchievement("Work harder.")
			if (player.blackhole != undefined) updateEternityUpgrades()
		} else if (name > 5) {
			updateDilationUpgradeCosts()
			if (quantumed || !mod.ngp3) {
				showTab("dimensions")
				showDimTab("metadimensions")
			} else ngp3_feature_notify("md")
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
		return player.timestudy.studies.includes(21) 
	}
	if (name == 62) {
		return player.eternityChalls.eterc5 !== undefined && player.timestudy.studies.includes(42)
	}

	if ((name == 71 || name == 72) && player.eternityChallUnlocked == 12) {
		return false;
	}

	if ((name == 72 || name == 73) && player.eternityChallUnlocked == 11) {
		return false;
	}

	if (name == 181) {
		return player.eternityChalls.eterc1 !== undefined && player.eternityChalls.eterc2 !== undefined && player.eternityChalls.eterc3 !== undefined && player.timestudy.studies.includes(171)
	}
	if (name == 201) return player.timestudy.studies.includes(192) && !player.dilation.upgrades.includes(8)
	if (name == 211 || name == 212) return player.timestudy.studies.includes(191)
	if (name == 213 || name == 214) return player.timestudy.studies.includes(193)
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
			if (player.timestudy.studies.includes((row-1)*10 + col)) return true; else return false
			break;
		case 12:
			if (hasRow(row-1) && (!hasRow(row) || (player.masterystudies ? hasMasteryStudy("t272") : false))) return true; else return false
			break;
		case 7:
			if (!player.timestudy.studies.includes(61)) return false;
			if (player.dilation.upgrades.includes(8)) return true;
			var have = player.timestudy.studies.filter(function(x) {return Math.floor(x / 10) == 7}).length;
			if (player.timestudy.studies.includes(201)) return have < 2;
			return have < 1;
			break;

		case 19:
			return player.eternityChalls.eterc10 !== undefined && player.timestudy.studies.includes(181)
			break;

		case 22:
			return player.timestudy.studies.includes(210 + Math.round(col/2)) && (((name%2 == 0) ? !player.timestudy.studies.includes(name-1) : !player.timestudy.studies.includes(name+1)) || (player.masterystudies ? hasMasteryStudy("t302") : false))
			break;

		case 23:
			return (player.timestudy.studies.includes(220 + Math.floor(col*2)) || player.timestudy.studies.includes(220 + Math.floor(col*2-1))) && (!player.timestudy.studies.includes((name%2 == 0) ? name-1 : name+1) || (player.masterystudies ? hasMasteryStudy("t302") : false))
			break;
	}
}

var all = [11, 21, 22, 33, 31, 32, 41, 42, 51, 61, 62, 71, 72, 73, 81, 82 ,83, 91, 92, 93, 101, 102, 103, 111, 121, 122, 123, 131, 132, 133, 141, 142, 143, 151, 161, 162, 171, 181, 191, 192, 193, 201, 211, 212, 213, 214, 221, 222, 223, 224, 225, 226, 227, 228, 231, 232, 233, 234]
var studyCosts = [1, 3, 2, 2, 3, 2, 4, 6, 3, 3, 3, 4, 6, 5, 4, 6, 5, 4, 5, 7, 4, 6, 6, 12, 9, 9, 9, 5, 5, 5, 4, 4, 4, 8, 7, 7, 15, 200, 400, 730, 300, 900, 120, 150, 200, 120, 900, 900, 900, 900, 900, 900, 900, 900, 500, 500, 500, 500]
var performedTS
function updateTimeStudyButtons(changed, forceupdate = false) {
	if (!forceupdate && (changed ? player.dilation.upgrades.includes(10) : performedTS && !player.dilation.upgrades.includes(10))) return
	performedTS = true
	if (mod.rs) {
		var locked = getTotalTT(player) < 60
		el("nextstudy").textContent = locked ? "Next time study set unlock at 60 total Time Theorems." : ""
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
	for (var i = 0; i < all.length; i++) {
		if (!player.timestudy.studies.includes(all[i])) {
			var className
			if (canBuyStudy(all[i]) && studyCosts[i] <= player.timestudy.theorem) {
				if (all[i] == 71 || all[i] == 81 || all[i] == 91 || all[i] == 101) {
					className = "timestudy normaldimstudy"
				} else if (all[i] == 72 || all[i] == 82 || all[i] == 92 || all[i] == 102) {
					className = "timestudy infdimstudy"
				} else if (all[i] == 73 || all[i] == 83 || all[i] == 93 || all[i] == 103) {
					className = "timestudy timedimstudy"
				} else if (all[i] == 121 || all[i] == 131 || all[i] == 141) {
					className = "timestudy activestudy"
				} else if (all[i] == 122 || all[i] == 132 || all[i] == 142) {
					className = "timestudy passivestudy"
				} else if (all[i] == 123 || all[i] == 133 || all[i] == 143) {
					className = "timestudy idlestudy"
				} else if (all[i] == 221 || all[i] == 224 || all[i] == 225 || all[i] == 228 || all[i] == 231 || all[i] == 234) {
					className = "timestudy darkstudy"
				} else if (all[i] == 222 || all[i] == 223 || all[i] == 226 || all[i] == 227 || all[i] == 232 || all[i] == 233) {
					className = "timestudy lightstudy"
				} else {
					className = "timestudy"
				}
			}
			else {
				if (all[i] == 71 || all[i] == 81 || all[i] == 91 || all[i] == 101) {
					className = "timestudylocked normaldimstudylocked"
				} else if (all[i] == 72 || all[i] == 82 || all[i] == 92 || all[i] == 102) {
					className = "timestudylocked infdimstudylocked"
				} else if (all[i] == 73 || all[i] == 83 || all[i] == 93 || all[i] == 103) {
					className = "timestudylocked timedimstudylocked"
				} else if (all[i] == 121 || all[i] == 131 || all[i] == 141) {
					className = "timestudylocked activestudylocked"
				} else if (all[i] == 122 || all[i] == 132 || all[i] == 142) {
					className = "timestudylocked passivestudylocked"
				} else if (all[i] == 123 || all[i] == 133 || all[i] == 143) {
					className = "timestudylocked idlestudylocked"
				} else {
					className = "timestudylocked"
				}
			}
			el(all[i]).className = className
		}
	}

	for (var i = 1; i < 7; i++) {
		if (hasDilStudy(i)) el("dilstudy"+i).className = "dilationupgbought"
		else if (player.timestudy.theorem >= ([null, 5e3, 1e6, 1e7, 1e8, 1e9, 1e24])[i] && (hasDilStudy(i - 1) || (i < 2 && ECComps("eterc11") > 4 && ECComps("eterc12") > 4 && getTotalTT(player) >= 13e3))) el("dilstudy" + i).className = "dilationupg"
		else el("dilstudy" + i).className = "timestudylocked"
	}
	el("dilstudy6").style.display = mod.ngpp ? "" : "none"
	el("masteryportal").style.display = player.masterystudies ? "" : "none"
	if (mod.ngp3) {
		el("masteryportal").innerHTML = player.dilation.upgrades.includes("ngpp6") ? "Mastery portal<span>Continue into mastery studies.</span>" : !hasDilStudy(1) ? "To be continued...." : "Mastery portal (" + (hasDilStudy(6) ? "66%: requires "+shortenCosts(1e100)+" dilated time upgrade)" : "33%: requires meta-dimensions)") 
		el("masteryportal").className = player.dilation.upgrades.includes("ngpp6") ? "dilationupg" : "timestudylocked"
	}
}

function updateBoughtTimeStudies() {
	for (var i = 0; i < player.timestudy.studies.length; i++) {
		var num = player.timestudy.studies[i]
		if (typeof(num) != "number") num = parseInt(num)
		if (!all.includes(num)) continue
		if (num == 71 || num == 81 || num == 91 || num == 101) {
			el(num).className = "timestudybought normaldimstudy"
		} else if (num == 72 || num == 82 || num == 92 || num == 102) {
			el(num).className = "timestudybought infdimstudy"
		} else if (num == 73 || num == 83 || num == 93 || num == 103) {
			el(num).className = "timestudybought timedimstudy"
		} else if (num == 121 || num == 131 || num == 141) {
			el(num).className = "timestudybought activestudy"
		} else if (num == 122 || num == 132 || num == 142) {
			el(num).className = "timestudybought passivestudy"
		} else if (num == 123 || num == 133 || num == 143) {
			el(num).className = "timestudybought idlestudy"
		} else if (num == 221 || num == 224 || num == 225 || num == 228 || num == 231 || num == 234) {
			el(num).className = "timestudybought darkstudy"
		} else if (num == 222 || num == 223 || num == 226 || num == 227 || num == 232 || num == 233) {
			el(num).className = "timestudybought lightstudy"
		} else {
			el(num).className = "timestudybought"
		}
	}	
}

function studiesUntil(id) {
	var col = id % 10;
	var row = Math.floor(id / 10);
	var path = [0,0];
	for (var i = 1; i < 4; i++){
		if (player.timestudy.studies.includes(70 + i)) path[0] = i;
		if (player.timestudy.studies.includes(120 + i)) path[1] = i;
	}
	if ((row > 10 && path[0] === 0) || (row > 14 && path[1] === 0)) {
		return;
	}
	for (var i = 1; i < row; i++) {
		var chosenPath = path[i > 11 ? 1 : 0];
		if (row > 6 && row < 11) var secondPath = col;
		if ((i > 6 && i < 11) || (i > 11 && i < 15)) buyTimeStudy(i * 10 + (chosenPath === 0 ? col : chosenPath), 0, true);
		if ((i > 6 && i < 11) && player.timestudy.studies.includes(201)) buyTimeStudy(i * 10 + secondPath, 0, true);
		else for (var j = 1; all.includes(i * 10 + j) ; j++) buyTimeStudy(i * 10 + j, 0, true);
	}
	buyTimeStudy(id, studyCosts[all.indexOf(id)], 0, true);
}

function respecTimeStudies(force, presetLoad) {
	var respecTime = player.respec || (force && (presetLoad || player.eternityChallUnlocked < 13))
	var respecMastery = false
	var gotAch = respecTime || player.timestudy.studies.length < 1
	if (mod.ngp3) {
		respecMastery=player.respecMastery||force
		gotAch=gotAch&&(respecMastery||player.masterystudies.length<1)
		delete quSave.autoECN
	}

	if (respecTime) {
		if (mod.rs) {
			var temp = player.timestudy.theorem
			for (var id = 1; id < 7; id++) player.timestudy.theorem += player.timestudy.ers_studies[id] * (player.timestudy.ers_studies[id] + 1) / 2
			if (temp > player.timestudy.theorem) gotAch = false
			player.timestudy.ers_studies = [null,0,0,0,0,0,0]
		} else {
			var bru7activated = isBigRipUpgradeActive(7)
			for (var i = 0; i < all.length; i++) {
				if (player.timestudy.studies.includes(all[i]) && (!bru7activated || all[i] !== 192)) {
					player.timestudy.theorem += studyCosts[i]
					gotAch=false
				}
			}
			if (mod.ngp3 && player.timestudy.studies.length>1) quSave.wasted = false
			player.timestudy.studies = bru7activated ? [192] : []
			var ECCosts = [null, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1]
			player.timestudy.theorem += ECCosts[player.eternityChallUnlocked]
			
		}
	}

	if (respecMastery) {
		var respecedMS = []
		player.timestudy.theorem += masteryStudies.ttSpent
		if (hasMasteryStudy("t373")) updateColorCharge()
		for (var id = 0; id < player.masterystudies.length; id++) {
			var d = player.masterystudies[id].split("d")[1]
			if (d) respecedMS.push(player.masterystudies[id])
		}
		if (player.masterystudies.length > respecedMS.length) {
			quSave.wasted = false
			gotAch = false
		}
		player.masterystudies=respecedMS
		respecUnbuyableTimeStudies()
		updateMasteryStudyCosts()
		if (!presetLoad) {
			maybeShowFillAll()
			updateMasteryStudyButtons()
		}
		drawMasteryTree()
	}
	player.eternityChallUnlocked = 0
	updateEternityChallenges()
	drawStudyTree()

	if (!presetLoad) updateTimeStudyButtons(true)
	if (!hasGluonUpg("gb3")) ipMultPower = 2
	if (gotAch) giveAchievement("You do know how these work, right?")
}

function respecUnbuyableTimeStudies() {
	var respecedTS = []
	var secondSplitPick
	var earlyDLStudies = []
	for (var t = 0; t < all.length; t++) {
		var id = all[t]
		if (player.timestudy.studies.includes(id)) {
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
	11: function() {
		let bigRip = bigRipped()
		let log = -player.tickspeed.div(1e3).pow(0.005).mul(0.95).plus(player.tickspeed.div(1e3).pow(0.0003).mul(0.95)).log10()
		if (bigRip && log > 900) log = Math.sqrt(log * 900)
		else if (mod.p3ep) log = Math.min(log, 25000) // buff to NG^+++
		else if (!inNGM(2)) log = Math.min(log, 2500)
		if (log < 0) log = 0
		if (bigRip) log = softcap(log, "ts11_log_big_rip", 1)
		return pow10(log)
	},
	32: function() {
		return Math.pow(Math.max(player.resets, 1), mod.ngmu ? 4 : 1)
	},
	41: function() {
		return mod.ngep ? 1.5 : 1.2
	},
	42: function() {
		return (mod.ngep ? 12 : 13) / 15
	},
	61: function() {
		return mod.ngep ? 100 : 10
	},
	62: function() {
		let r = mod.ngep ? 4 : 3
		return r
	},
	211: function() {
		return !inNGM(2) ? 5 : 1
	},
	212: function() {
		let r = player.timeShards.max(2).log2()
		if (mod.ngep) return Math.min(Math.pow(r, 0.006), 1.15)
		return Math.min(Math.pow(r, 0.005), 1.1)
	},
	213: function() {
		return 20
	},
	222: function() {
		return !inNGM(2) ? 2 : .5
	}
}

//Dilation
function hasDilStudy(x) {
	return player.dilation.studies.includes(x)
}

//Smart presets
var onERS = false
var onNGP3 = false
var poData

function new_preset(importing) {
	var input

	if (importing) {
		onImport = true
		input = prompt()

		onImport = false
		if (input === null) return
	} else input = getStudyTreeStr()

	var placement = 1
	while (poData.includes(placement)) placement++
	presets[placement] = {preset: input}
	localStorage.setItem(btoa(presetPrefix + placement), btoa(JSON.stringify(presets[placement])))
	poData.push(placement)
	latestRow = el("presets").insertRow(loadedPresets)
	latestRow.innerHTML = getPresetLayout(placement)
	loadedPresets++
	changePresetTitle(placement, loadedPresets)
	localStorage.setItem(metaSaveId,btoa(JSON.stringify(metaSave)))
	$.notify("Preset created", "info")
}

function save_preset(id, placement) {
	if (presets.editing != id) presets[id].preset = getStudyTreeStr()
	else delete presets.editing

	localStorage.setItem(btoa(presetPrefix + id), btoa(JSON.stringify(presets[id])))

	changePresetTitle(id, placement)
	$.notify("Preset saved", "info")
}

function toggle_preset_reset(load) {
	if (!load) {
		aarMod.presetReset = !aarMod.presetReset
		el("toggle_preset_reset").style.display = mod.ngp3 ? "" : "none"
	}
	el("toggle_preset_reset").textContent = "Force eternity: " + (aarMod.presetReset ? "ON" : "OFF")
}

function load_preset(id, placement) {
	let pres = presets[id]
	let edit = pres.preset
	let dil = pres.dilation
	console.log(dil)

	if (aarMod.presetReset) {
		if (!canEternity()) return
		eternity(true, false, dil, true)
	} else if (dil) startDilatedEternity(true)

	let saved = false
	if (id == presets.editing) {
		delete presets.editing
		localStorage.setItem(btoa(presetPrefix + id), btoa(JSON.stringify(pres)))
		changePresetTitle(id, placement)
		saved = true
	}

	importStudyTree(edit)
	closeToolTip()
	$.notify("Preset" + (saved ? " saved and " : "") + " loaded", "info")
}

function delete_preset(presetId) {
	if (!confirm("Do you really want to erase this preset? You will lose access to this preset!")) return
	var alreadyDeleted = false
	var newPresetsOrder = []
	for (var id = 0; id < poData.length; id++) {
		if (alreadyDeleted) {
			newPresetsOrder.push(poData[id])
			changePresetTitle(poData[id], id)
		} else if (poData[id] == presetId) {
			if (id == presets.editing) delete presets.editing
			delete presets[presetId]
			localStorage.removeItem(btoa(presetPrefix + presetId))
			alreadyDeleted = true
			el("presets").deleteRow(id)
			loadedPresets--
		} else newPresetsOrder.push(poData[id])
	}
	metaSave["presetsOrder"+(mod.rs?"_ers":"")] = newPresetsOrder
	poData = newPresetsOrder
	localStorage.setItem(metaSaveId,btoa(JSON.stringify(metaSave)))
	$.notify("Preset deleted", "info")
}

function rename_preset(id) {
	presets[id].title = prompt("Input the new name for this preset. It is recommended you rename the preset based on what studies you have selected.")
	localStorage.setItem(btoa(presetPrefix + id), btoa(JSON.stringify(presets[id])))
	placement = 1
	while (poData[placement-1] != id) placement++
	changePresetTitle(id, placement)
	$.notify("Preset renamed", "info")
}

function move_preset(id, offset) {
	placement = 0
	while (poData[placement] != id) placement++

	if (offset < 0) {
		if (placement < -offset) return
	} else if (placement > poData.length - offset - 1) return
	if (id == presets.editing) presets.editing += offset

	var temp = poData[placement]
	poData[placement] = poData[placement+offset]
	poData[placement+offset] = temp
	el("presets").rows[placement].innerHTML = getPresetLayout(poData[placement])
	el("presets").rows[placement+offset].innerHTML = getPresetLayout(id)
	changePresetTitle(poData[placement], placement)
	changePresetTitle(poData[placement+offset], placement + offset)
	localStorage.setItem(metaSaveId, btoa(JSON.stringify(metaSave)))
}

var loadedPresets = 0
function openStudyPresets() {
	closeToolTip()
	let saveOnERS = mod.rs
	let saveOnNGP3 = mod.ngp3
	if (saveOnERS != onERS) {
		delete presets.editing
		el("presets").innerHTML = ""
		presets = {}
		onERS = saveOnERS
		if (onERS) presetPrefix = prefix+"ERS_ST_"
		else presetPrefix = prefix+"AM_ST_"
		loadedPresets = 0
	} else if (saveOnNGP3 != onNGP3) {
		onNGP3 = saveOnNGP3
		for (var p = 0; p < loadedPresets; p++) {
			el("presets").rows[p].innerHTML = getPresetLayout(poData[p], p + 1)
			changePresetTitle(poData[p], p + 1)
		}
	}
	el("presetsmenu").style.display = "block";
	clearInterval(loadSavesIntervalId)
	occupied = false
	loadSavesIntervalId=setInterval(function(){
		if (occupied) return
		else occupied = true
		if (loadedPresets == poData.length) {
			clearInterval(loadSavesIntervalId)
			return
		} else if (!onLoading) {
			latestRow = el("presets").insertRow(loadedPresets)
			onLoading = true
		}
		try {
			var id = poData[loadedPresets]
			latestRow.innerHTML = getPresetLayout(id, loadedPresets + 1)
			changePresetTitle(id, loadedPresets + 1)
			loadedPresets++
			onLoading = false
		} catch (e) { console.error(e) }
		occupied = false
	}, 0)
}

function focus_preset(id, placement) {
	if (presets.editing && presets.editing != id) {
		alert("Due to technical issues, save the preset with * mark first!")
	} else {
		presets[id].dilation = el("preset_" + id + "_dilation").checked
		presets[id].preset = el("preset_" + id + "_data").value
		presets.editing = id
	}
	changePresetTitle(id, placement)
}

function getPresetLayout(id, placement) {
	return `<b id='preset_${id}_title'>Preset #${placement}</b><br>
		<span id='preset_${id}_dilation_div'>Dilation run: <input id='preset_${id}_dilation' type='checkbox' onchange='focus_preset(${id}, ${placement})'></span><br>
		<input id='preset_${id}_data' style='width: 75%' onchange='focus_preset(${id}, ${placement})'><br>

		<button class='storebtn' onclick='save_preset(${id}, ${placement})'>Save</button>
		<button class='storebtn' onclick='load_preset(${id}, ${placement})'>Load</button>
		<button class='storebtn' onclick='rename_preset(${id}, ${placement})'>Rename</button>

		<span class='metaOpts'>
			<button class='storebtn' onclick='move_preset(${id}, -1)'>⭡</button>
			<button class='storebtn' onclick='move_preset(${id}, 1)'>⭣</button>
			<button class='storebtn' onclick='delete_preset(${id})'>X</button>
		</span>`
}

function changePresetTitle(id, placement) {
	if (!placement) {
		placement = 0
		while (poData[placement] != id) placement++
	}

	let editing = presets.editing == id
	if (!editing && presets[id] === undefined) {
		var preset = localStorage.getItem(btoa(presetPrefix + id))
		if (preset === null) {
			presets[id] = {preset: "|0", title: "Deleted preset #" + placement, dilation: false}
			localStorage.setItem(btoa(presetPrefix + id), btoa(JSON.stringify(presets[id])))
		} else presets[id] = JSON.parse(atob(preset))
	}
	el("preset_" + id + "_title").textContent = (presets[id].title ? presets[id].title : "Preset #" + placement) + (editing ? "*" : "")
	el("preset_" + id + "_data").value = presets[id].preset
	el("preset_" + id + "_dilation").checked = presets[id].dilation
	el("preset_" + id + "_dilation_div").style.display = mod.ngp3 && (hasDilStudy(1) || quantumed)
}
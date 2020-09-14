//Bosonic Lab
function canUnlockBosonicLab() {
	let max = getMaximumUnstableQuarks()
	return (max.decays > 5 || max.quarks.e >= (tmp.ngp3l ? 1e10 : 5e10)) && max.decays > 4 && (tmp.ngp3l || player.ghostify.ghostlyPhotons.enpowerments >= 3)
}
  
function updateBLUnlocks() {
	let unl = player.ghostify.wzb.unl
	document.getElementById("blUnl").style.display = unl ? "none" : ""
	document.getElementById("blDiv").style.display = unl ? "" : "none"
	document.getElementById("nftabs").style.display = unl ? "" : "none"
	if (!unl) updateBLUnlockDisplay()
}

function updateBLUnlockDisplay() {
	document.getElementById("blUnl").textContent = "To unlock Bosonic Lab, you need to get " + shortenCosts(Decimal.pow(10, tmp.ngp3l ? 1e10 : 5e10)) + " Ghostly Unstable Quarks" + (tmp.ngp3l ? "" : " and 3 Light Empowerments") + " first."
}

function getBosonicWattGain() {
	return player.money.log10() / 2e16 - 1.25
}

function bosonicTick(diff) {
	let lDiff //Mechanic-local diff
	let lData //Mechanic-local data
	let data = player.ghostify.bl
	diff = new Decimal(diff)
	if (isNaN(diff.e)) return
	if (data.odSpeed > 1 && data.battery.gt(0)) {
		var bBtL = getBosonicBatteryLoss()
		var odDiff = diff.times(bBtL).min(data.battery)
		var fasterDiff = odDiff.div(bBtL).times(data.odSpeed)
		data.battery = data.battery.sub(diff.times(bBtL).min(data.battery))
		diff = fasterDiff.add(diff.sub(odDiff.min(diff)))
	}
	data.ticks = data.ticks.add(diff)
	
	//W & Z Bosons
	let apDiff
	let apSpeed
	lData = player.ghostify.wzb
	if (lData.dPUse) {
		apDiff = diff.times(getAntiPreonLoss()).min(lData.dP).div(aplScalings[player.ghostify.wzb.dPUse])
		if (isNaN(apDiff.e)) apDiff=new Decimal(0)
		if (lData.dPUse == 1) {
			lData.wQkProgress = lData.wQkProgress.add(apDiff.times(tmp.wzb.zbs))
			if (lData.wQkProgress.gt(1)) {
				let toSub=lData.wQkProgress.floor()
				lData.wpb=lData.wpb.add(toSub.add(lData.wQkUp ? 1 : 0).div(2).floor())
				lData.wnb=lData.wnb.add(toSub.add(lData.wQkUp ? 0 : 1).div(2).floor())
				if (toSub.mod(2).gt(0)) lData.wQkUp = !lData.wQkUp
				lData.wQkProgress = lData.wQkProgress.sub(toSub.min(lData.wQkProgress))
				
				let batteryMult = new Decimal(1)
				if (data.usedEnchants.includes(33)) batteryMult = batteryMult.times(tmp.bEn[33])
				
				let toAdd = toSub.div(1e6).times(batteryMult).div(diff)

				if (toAdd.gt(1e3)) toAdd = Decimal.pow(toAdd.log10() + 7, 3) 

				data.battery = data.battery.add(toAdd.times(diff))
			}
		}
		if (lData.dPUse == 2) {
			lData.zNeProgress = lData.zNeProgress.add(apDiff.times(getOscillateGainSpeed()))
			if (lData.zNeProgress.gte(1)) {
				let oscillated = Math.floor(lData.zNeProgress.add(1).log(2))
				lData.zb = lData.zb.add(Decimal.pow(Math.pow(2, 0.75), oscillated).sub(1).div(Math.pow(2, 0.75)-1).times(lData.zNeReq.pow(0.75)))
				lData.zNeProgress = lData.zNeProgress.sub(Decimal.pow(2,oscillated).sub(1).min(lData.zNeProgress)).div(Decimal.pow(2, oscillated))
				lData.zNeReq = lData.zNeReq.times(Decimal.pow(2,oscillated))
				lData.zNeGen = (lData.zNeGen+oscillated-1)%3+1
			}
		}
		if (lData.dPUse == 3) {
			lData.wpb = lData.wpb.add(lData.wnb.min(apDiff).times(tmp.wzb.zbs))
			lData.wnb = lData.wnb.sub(lData.wnb.min(apDiff).times(tmp.wzb.zbs))
		}
		lData.dP = lData.dP.sub(diff.times(getAntiPreonLoss()).min(lData.dP))
		if (lData.dP.eq(0)) lData.dPUse = 0
	} else lData.dP = lData.dP.add(getAntiPreonProduction().times(diff))
	lData.zNeReq=Decimal.pow(10, Math.sqrt(Math.max(Math.pow(lData.zNeReq.log10(),2) - diff / 100, 0)))
	
	//Bosonic Extractor
	if (data.usedEnchants.includes(12)) {
		data.autoExtract = data.autoExtract.add(diff.times(tmp.bEn[12]))
		if (!data.extracting && data.autoExtract.gte(1)) {
			data.extracting = true
			data.autoExtract = data.autoExtract.sub(1)
			dynuta.times = 0
		}
	} else data.autoExtract = new Decimal(1)
	if (data.extracting) data.extractProgress = data.extractProgress.add(diff.div(getExtractTime()))
	if (data.extractProgress.gte(1)) {
		var oldAuto = data.autoExtract.floor()
		if (!data.usedEnchants.includes(12)) oldAuto = new Decimal(0)
		var toAdd = data.extractProgress.min(oldAuto.add(1).round()).floor()
		data.autoExtract = data.autoExtract.sub(toAdd.min(oldAuto))
		data.glyphs[data.typeToExtract - 1] = data.glyphs[data.typeToExtract - 1].add(toAdd).round()
		if (dynuta.check) {
			dynuta.check = false
			dynuta.times++
			if (dynuta.times >= 20) giveAchievement("Did you not understand the automation?")
		}
		if (data.usedEnchants.includes(12) && oldAuto.add(1).round().gt(toAdd)) data.extractProgress = data.extractProgress.sub(toAdd.min(data.extractProgress))
		else {
			data.extracting = false
			data.extractProgress = new Decimal(0)
		}
	}
	if (data.extracting && data.extractProgress.lt(1)) {
		dynuta.check = false
		dynuta.times = 0
	}

	//Bosonic Antimatter production
	var newBA = data.am
	var baAdded = getBosonicAMProduction().times(diff)
	if (tmp.ngp3l) newBA = newBA.add(baAdded)
	else {
		if (tmp.badm.start !== undefined && data.am.gt(tmp.badm.start) && tmp.badm.postDim <= Number.MAX_VALUE) data.am = tmp.badm.preDim.times(tmp.badm.start)
		updateBosonicAMDimReturnsTemp()
		newBA = data.am.add(baAdded)
		if (newBA.gt(tmp.badm.start)) {
			newBA = newBA.div(tmp.badm.start)
			tmp.badm.preDim = newBA
			newBA = newBA.sub(-tmp.badm.offset).ln() / Math.log(tmp.badm.base) + tmp.badm.offset2
			tmp.badm.postDim = newBA
			newBA = tmp.badm.start.times(newBA)
		}
	}
	data.am = newBA
}

function getBAMProduction(){
	return getBosonicAMProduction()
}

function getBosonicAntiMatterProduction(){
	return getBosonicAMProduction()
}

function getAchBAMMult(){
	if (!player.achievements.includes("ng3p91")) return 1
	return player.achPow.pow(0.2)
}

function getBosonicAMProduction() {
	var exp = player.money.max(1).log10() / 15e15 - 3
	var ret = Decimal.pow(10, exp).times(tmp.wzb.wbp)
	if (player.ghostify.bl.usedEnchants.includes(34)) ret = ret.times(tmp.bEn[34] || 1)
	if (player.achievements.includes("ng3p91")) ret = ret.times(getAchBAMMult())
	if (player.achievements.includes("ng3p98")) ret = ret.plus(Math.pow(player.ghostify.hb.higgs, 2))
	//maybe softcap at e40 or e50?
	ret = softcap(ret, "bam")
	return ret
}

function getBosonicAMFinalProduction() {
	let r = getBosonicAMProduction()
	if (tmp.ngp3l) return r
	if (player.ghostify.bl.am.gt(tmp.badm.start)) r = r.div(tmp.badm.preDim)
	return r
}

function updateBosonicAMDimReturnsTemp() {
	var data = {}
	tmp.badm = data

	if (!tmp.ngp3) return
	if (tmp.ngp3l) return
	if (!player.ghostify.wzb.unl) return

	data.start = getHiggsRequirement()
	data.base = getHiggsRequirementMult()
	data.offset = 1 / Math.log(data.base) - 1
	data.offset2 = 1 - Math.log10(data.offset + 1) / Math.log10(data.base)
	data.postDim = player.ghostify.bl.am.div(data.start)
	data.preDim = Decimal.pow(data.base,  Decimal.log(100, data.postDim) - data.offset2).add(-data.offset).max(1)
}

function updateBosonicLimits() {
	if (!tmp.ngp3) return

	//Bosonic Runes / Extractor / Enchants
	br.limit = br.maxLimit
	if (tmp.ngp3l || player.ghostify.hb.higgs == 0) br.limit = 3
	var width = 100 / br.limit
	for (var r = 1; r <= br.maxLimit; r++) {
		document.getElementById("bRuneCol" + r).style = "min-width:" + width + "%;width:" + width + "%;max-width:" + width + "%"
		if (r > 3) {
			var shown = br.limit >= r
			document.getElementById("bRuneCol" + r).style.display = shown ? "" : "none"
			document.getElementById("typeToExtract" + r).style.display = shown ? "" : "none"
			document.getElementById("bEnRow" + (r - 1)).style.display = shown ? "" : "none"
		}
	}

	//Bosonic Upgrades
	bu.rows = bu.maxRows
	if (tmp.ngp3l || player.ghostify.hb.higgs == 0) bu.rows = 2
	for (var r = 3; r <= bu.maxRows; r++) document.getElementById("bUpgRow" + r).style.display = bu.rows >= r ? "" : "none"

	//Bosonic Enchants
	bEn.limit = bEn.maxLimit
	if (tmp.ngp3l || player.ghostify.hb.higgs == 0) bEn.limit = 2
}

function showBLTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('bltab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab !== tabName) player.aarexModifications.tabsSave.tabBL = tabName
	closeToolTip()
}

function updateBosonicLabTab(){
	let data = player.ghostify.bl
	let speed = data.speed * (data.battery.gt(0) ? data.odSpeed : 1)
	document.getElementById("bWatt").textContent = shorten(data.watt)
	document.getElementById("bSpeed").textContent = shorten(data.speed)
	document.getElementById("bTotalSpeed").textContent = shorten(speed)
	document.getElementById("bTicks").textContent = shorten(data.ticks)
	document.getElementById("bAM").textContent = shorten(data.am)
	document.getElementById("bAMProduction").textContent = "+" + shorten(getBosonicAMFinalProduction().times(speed)) + "/s"
	document.getElementById("bAMProductionReduced").style.display = !tmp.ngp3l && data.am.gt(tmp.badm.start) ? "" : "none"
	document.getElementById("bAMProductionReduced").textContent = "(reduced by " + shorten(tmp.badm.preDim) + "x)"
	document.getElementById("bBt").textContent = shorten(data.battery)
	document.getElementById("bBtProduction").textContent = "-" + shorten(getBosonicBatteryLoss().times(data.speed)) + "/s"
	document.getElementById("odSpeed").textContent=(data.battery.gt(0)?data.odSpeed:1).toFixed(2) + "x"
	document.getElementById("odSpeedWBBt").style.display = data.battery.eq(0) && data.odSpeed > 1 ? "" : "none"
	document.getElementById("odSpeedWBBt").textContent = " (" + data.odSpeed.toFixed(2) + "x if you have Bosonic Battery)"
	for (var g = 1;g <= br.limit; g++) document.getElementById("bRune"+g).textContent = shortenDimensions(data.glyphs[g-1])
	if (document.getElementById("bextab").style.display=="block") updateBosonExtractorTab()
	if (document.getElementById("butab").style.display=="block") updateBosonicUpgradeDescs()
	if (document.getElementById("wzbtab").style.display=="block") updateWZBosonsTab()
	if (!tmp.ngp3l) {
		if (player.ghostify.hb.unl) {
			var req = getHiggsRequirement()
			document.getElementById("hb").textContent = getFullExpansion(player.ghostify.hb.higgs)
			document.getElementById("hbReset").className = "gluonupgrade " + (player.ghostify.bl.am.gte(req) ? "hb" : "unavailablebtn")
			document.getElementById("hbResetReq").textContent = shorten(req)
			document.getElementById("hbResetGain").textContent = getFullExpansion(getHiggsGain())
		}
	}
}

function updateBosonicStuffCosts() {
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		var data = bEn.costs[id]
		document.getElementById("bEnG1Cost" + id).textContent = (data !== undefined && data[0] !== undefined && shortenDimensions(getBosonicFinalCost(data[0]))) || "???"
		document.getElementById("bEnG2Cost" + id).textContent = (data !== undefined && data[1] !== undefined && shortenDimensions(getBosonicFinalCost(data[1]))) || "???"
	}
	for (var r = 1; r <= bu.rows; r++) for (var c = 1; c < 6; c++) {
		var id = r * 10 + c
		var data = bu.reqData[id]
		document.getElementById("bUpgCost" + id).textContent = (data[0] !== undefined && shorten(getBosonicFinalCost(data[0]))) || "???"
		for (var g = 1; g < 3; g++) document.getElementById("bUpgG" + g + "Req" + id).textContent = (data[g * 2 - 1] !== undefined && shortenDimensions(getBosonicFinalCost(data[g * 2 - 1]))) || "???"
	}
}

function getBosonicFinalCost(x) {
	x = new Decimal(x)
	if (player.achievements.includes("ng3p91")) x = x.div(2)
	return x.ceil()
}

function updateBosonicLabTemp() {
	tmp.bEn = {}
	tmp.blu = {}
	tmp.wzb = {}
	tmp.hbTmp = {}
	//tmp.gvTmp = {}
	//tmp.x17Tmp = {}

	if (!tmp.ngp3) return 
	if (!player.ghostify.wzb.unl) return 

	updateBosonicEnchantsTemp()
	updateBosonicUpgradesTemp()
	updateWZBosonsTemp()
	if (!tmp.ngp3l) {
		// if (tmp.gv.unl) updateGravitonsTemp()
		// if (tmp.x17.unl) updateX17Temp()
	}
}

//Bosonic Extractor / Bosonic Runes
let dynuta={
	check: false,
	times: 0
}
function extract() {
	let data = player.ghostify.bl
	if (data.extracting) return
	dynuta.check = true
	data.extracting = true
}

function getExtractTime() {
	let data = player.ghostify.bl
	let r = new Decimal(br.scalings[data.typeToExtract] || 1/0)
	r = r.div(tmp.wzb.wbt)
	return r
}

function changeTypeToExtract(x) {
	let data = player.ghostify.bl
	if (data.typeToExtract == x) return
	document.getElementById("typeToExtract" + data.typeToExtract).className = "storebtn"
	document.getElementById("typeToExtract" + x).className = "chosenbtn"
	data.typeToExtract = x
	data.extracting = false
	data.extractProgress = new Decimal(0)
	data.autoExtract = new Decimal(1)
}

function canBuyEnchant(id) {
	let data = player.ghostify.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	if (costData === undefined) return
	if (costData[0] === undefined || !data.glyphs[g1 - 1].gte(getBosonicFinalCost(costData[0]))) return
	if (costData[1] === undefined || !data.glyphs[g2 - 1].gte(getBosonicFinalCost(costData[1]))) return
	return true
}

function getMaxEnchantLevelGain(id) {
	let data = player.ghostify.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	if (costData === undefined) return new Decimal(0)
	let lvl1 = data.glyphs[g1 - 1].div(getBosonicFinalCost(costData[0])).floor()
	let lvl2 = data.glyphs[g2 - 1].div(getBosonicFinalCost(costData[1])).floor()
	if (costData[0] == 0) lvl1 = 1/0
	if (costData[1] == 0) lvl2 = 1/0
	return lvl1.min(lvl2)
}

function canUseEnchant(id) {
	if (!player.ghostify.bl.enchants[id]) return
	if (bEn.limit == 1) {
		if (player.ghostify.bl.usedEnchants.includes(id)) return
	} else if (!player.ghostify.bl.usedEnchants.includes(id) && player.ghostify.bl.usedEnchants.length >= bEn.limit) return
	return true
}

function takeEnchantAction(id) {
	let data = player.ghostify.bl
	if (bEn.action == "upgrade") {
		let costData = bEn.costs[id]
		let g1 = Math.floor(id / 10)
		let g2 = id % 10
		if (!canBuyEnchant(id)) return
		data.glyphs[g1 - 1] = data.glyphs[g1 - 1].sub(getBosonicFinalCost(costData[0])).round()
		data.glyphs[g2 - 1] = data.glyphs[g2 - 1].sub(getBosonicFinalCost(costData[1])).round()
		if (data.enchants[id] == undefined) data.enchants[id] = new Decimal(1)
		else data.enchants[id] = data.enchants[id].add(1).round()
	} else if (bEn.action == "max") {
		let lvl = getMaxEnchantLevelGain(id)
		let costData = bEn.costs[id]
		let g1 = Math.floor(id / 10)
		let g2 = id % 10
		if (!canBuyEnchant(id)) return
		data.glyphs[g1 - 1] = data.glyphs[g1 - 1].sub(lvl.times(getBosonicFinalCost(costData[0])).min(data.glyphs[g1 - 1])).round()
		data.glyphs[g2 - 1] = data.glyphs[g2 - 1].sub(lvl.times(getBosonicFinalCost(costData[1])).min(data.glyphs[g2 - 1])).round()
		if (data.enchants[id] == undefined) data.enchants[id] = new Decimal(lvl)
		else data.enchants[id] = data.enchants[id].add(lvl).round()
	} else if (bEn.action == "use") {
		if (canUseEnchant(id)) {
			if (bEn.limit == 1) data.usedEnchants = [id]
			else {
				if (data.usedEnchants.includes(id)) {
					var newData = []
					for (var u = 0; u < data.usedEnchants.length; u++) if (data.usedEnchants[u] != id) newData.push(data.usedEnchants[u])
					data.usedEnchants = newData
				} else data.usedEnchants.push(id)
			}
		}
	}
}

function changeEnchantAction(id) {
	bEn.action = bEn.actions[id - 1]
}

function getEnchantEffect(id, desc) {
	let data = player.ghostify.bl
	let l = new Decimal(0)
	if (bEn.effects[id] === undefined) return
	if (desc ? data.enchants[id] : data.usedEnchants.includes(id)) l = new Decimal(data.enchants[id])
	return bEn.effects[id](l)
}

function updateBosonExtractorTab(){
	let data = player.ghostify.bl
	let speed = data.speed * (data.battery.gt(0) ? data.odSpeed : 1)
	let time = getExtractTime().div(speed)
	if (data.extracting) document.getElementById("extract").textContent = "Extracting" + (time.lt(0.1)?"":" ("+data.extractProgress.times(100).toFixed(1)+"%)")
	else document.getElementById("extract").textContent="Extract"
	if (time.lt(0.1)) document.getElementById("extractTime").textContent="This would automatically take "+shorten(Decimal.div(1,time))+" runes per second."
	else if (data.extracting) document.getElementById("extractTime").textContent=shorten(time.times(Decimal.sub(1,data.extractProgress)))+" seconds left to extract."
	else document.getElementById("extractTime").textContent="This will take "+shorten(time)+" seconds."
	updateEnchantDescs()
}

function updateEnchantDescs() {
	let data = player.ghostify.bl
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		if (bEn.action == "upgrade" || bEn.action == "max") document.getElementById("bEn" + id).className = "gluonupgrade "  +(canBuyEnchant(id) ? "bl" : "unavailablebtn")
		else if (bEn.action == "use") document.getElementById("bEn" + id).className = "gluonupgrade " + (canUseEnchant(id) ? "storebtn" : "unavailablebtn")
		if (id == 14) document.getElementById("bEn14").style = "font-size: 8px"
		if (shiftDown) document.getElementById("bEnLvl" + id).textContent = "Enchant id: " + id
		else document.getElementById("bEnLvl" + id).textContent = "Level: " + shortenDimensions(tmp.bEn.lvl[id])
		if (bEn.action == "max") document.getElementById("bEnOn"+id).textContent = "+" + shortenDimensions(getMaxEnchantLevelGain(id)) + " levels"
		else document.getElementById("bEnOn" + id).textContent = data.usedEnchants.includes(id) ? "Enabled" : "Disabled"
		if (tmp.bEn[id] != undefined) {
			let effect = getEnchantEffect(id, true)
			let effectDesc = bEn.effectDescs[id]
			document.getElementById("bEnEffect" + id).textContent = effectDesc !== undefined ? effectDesc(effect) : shorten(effect) + "x"	
		}
	}
	document.getElementById("usedEnchants").textContent = "You have used " + data.usedEnchants.length + " / " + bEn.limit + " Bosonic Enchants."
}

var br = {
	names: [null, "Infinity", "Eternity", "Quantum", "Ghostly", "Ethereal", "Sixth", "Seventh", "Eighth", "Ninth"], //Current maximum limit of 9.
	maxLimit: 4,
	scalings: {
		1: 60,
		2: 120,
		3: 600,
		4: 6e7
	}
}

var bEn = {
	costs: {
		12: [3,1],
		13: [20,2],
		23: [1e4,2e3],
		14: [1e6, 2],
		24: [1e6, 10],
		34: [1,0]
	},
	descs: {
		12: "You automatically extract Bosonic Runes.",
		13: "Speed up the production and use of Anti-Preons.",
		23: "Bosonic Antimatter boosts oscillate speed.",
		14: "Divide the requirement of Higgs and start with some Bosonic Upgrades even it is inactive.",
		24: "You gain more Bosonic Battery.",
		34: "Higgs Bosons produce more Bosonic Antimatter."
	},
	effects: {
		12: function(l) {
			let exp = 0.75
			if (l.gt(1e10)) exp /= Math.pow(l.log10() / 10, 1/3)
			return Decimal.pow(l, exp).div(bEn.autoScalings[player.ghostify.bl.typeToExtract])
		},
		13: function(l) {
			return Decimal.add(l, 1).sqrt()
		},
		14: function(l) {
			return {
				bUpgs: Math.floor(Math.pow(Decimal.add(l, 9).log10(), 2/3)),
				higgs: Decimal.add(l, 1).pow(0.4)
			}
		},
		23: function(l) {
			let exp = Math.max(l.log10() + 1, 0) / 3
			if (player.ghostify.bl.am.gt(1e11)) exp *= player.ghostify.bl.am.div(10).log10() / 10
			if (exp > 5) exp = Math.sqrt(exp * 5)
			return Decimal.pow(player.ghostify.bl.am.add(10).log10(), exp)
		},
		24: function(l) {
			return Decimal.pow(Decimal.add(l, 100).log10(), 4).div(16)
		},
		34: function(l) {
			return Decimal.pow(player.ghostify.hb.higgs / 20 + 1, l.add(1).log10() / 5)
		}
	},
	effectDescs: {
		12: function(x) {
			var blData = player.ghostify.bl

			x = x.times(blData.speed * (blData.battery.gt(0) ? blData.odSpeed : 1))
			if (x.lt(1) && x.gt(0)) return x.m.toFixed(2) + "/" + shortenCosts(Decimal.pow(10, -x.e)) + " seconds"
			return shorten(x) + "/second"
		},
		14: function(x) {
			return "/" + shorten(x.higgs) + " to Higgs requirement, " + getFullExpansion(x.bUpgs) + " starting upgrades"
		}
	},
	action: "upgrade",
	actions: ["upgrade", "max", "use"],
	maxLimit: 4,
	autoScalings:{
		1: 1.5,
		2: 3,
		3: 12,
		4: 1e6,
		5: 1/0
	}
}

function updateBosonicEnchantsTemp(){
	tmp.bEn.lvl = {}
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		tmp.bEn.lvl[id] = player.ghostify.bl.enchants[id] || new Decimal(0)
		if (bEn.effects[id] !== undefined) tmp.bEn[id] = getEnchantEffect(id)
	}
}

//Bosonic Upgrades
function setupBosonicUpgReqData() {
	for (var r = 1; r <= bu.maxRows; r++) for (var c = 1; c < 6; c++) {
		var id = r * 10 + c
		var data = bu.costs[id]
		var rData = [undefined, undefined, 0, undefined, 0]
		if (data) {
			if (data.am !== undefined) rData[0] = data.am
			var p = 1
			for (var g = 1; g <= br.maxLimit; g++) if (data["g" + g] !== undefined) {
				rData[p * 2 - 1] = data["g" + g]
				rData[p * 2] = g
				p++
			}
		}
		bu.reqData[id] = rData
	}
}

function canBuyBosonicUpg(id) {
	let rData = bu.reqData[id]
	if (rData[0] === undefined || rData[1] === undefined || rData[3] === undefined) return
	if (!player.ghostify.bl.am.gte(getBosonicFinalCost(rData[0]))) return
	for (var g = 1; g < 3; g++) if (!player.ghostify.bl.glyphs[rData[g * 2] - 1].gte(getBosonicFinalCost(rData[g * 2 - 1]))) return
	return true
}

function buyBosonicUpgrade(id, quick) {
	if (player.ghostify.bl.upgrades.includes(id)) return true
	if (!canBuyBosonicUpg(id)) return false
	player.ghostify.bl.upgrades.push(id)
	player.ghostify.bl.am = player.ghostify.bl.am.sub(getBosonicFinalCost(bu.reqData[id][0]))
	if (!quick) updateTemp()
	if (id == 21 || id == 22) updateNanoRewardTemp()
	if (id == 32) tmp.updateLights = true
	if (!tmp.ngp3l) delete player.ghostify.hb.bosonicSemipowerment
	return true
}

function buyMaxBosonicUpgrades() {
	var stopped = false
	var oldLength = player.ghostify.bl.upgrades.length
	if (oldLength == bu.rows * 5) return
	for (var r = 1; r <= bu.rows; r++) {
		for (var c = 1; c <= 5; c++) {
			var id = r * 10 + c
			if (!buyBosonicUpgrade(id, true)) break
		}
	}
	if (player.ghostify.bl.upgrades.length > oldLength) updateTemp()
}

function hasBosonicUpg(id) {
	return ghostified && player.ghostify.wzb.unl && player.ghostify.bl.upgrades.includes(id)
}

function updateBosonicUpgradeDescs() {
	for (var r = 1; r <= bu.rows; r++) for (var c = 1; c <= 5; c++) {
		var id = r * 10 + c
		document.getElementById("bUpg" + id).className = player.ghostify.bl.upgrades.includes(id) ? "gluonupgradebought bl" : canBuyBosonicUpg(id) ? "gluonupgrade bl" : "gluonupgrade unavailablebtn"
		if (tmp.blu[id] !== undefined) document.getElementById("bUpgEffect"+id).textContent = (bu.effectDescs[id] !== undefined && bu.effectDescs[id](tmp.blu[id])) || shorten(tmp.blu[id]) + "x"
	}
}

var bu = {
	maxRows: 4,
	costs: {
		11: {
			am: 200,
			g1: 200,
			g2: 100
		},
		12: {
			am: 4e5,
			g2: 3e3,
			g3: 800
		},
		13: {
			am: 3e6,
			g1: 1e4,
			g3: 1e3
		},
		14: {
			am: 2e8,
			g1: 2e5,
			g2: 1e5
		},
		15: {
			am: 1e9,
			g2: 25e4,
			g3: 35e3,
		},
		21: {
			am: 8e10,
			g1: 5e6,
			g2: 25e5
		},
		22: {
			am: 5e11,
			g2: 4e6,
			g3: 75e4
		},
		23: {
			am: 1e13,
			g1: 15e6,
			g3: 15e3
		},
		24: {
			am: 1e15,
			g1: 8e7,
			g2: 4e7
		},
		25: {
			am: 15e16,
			g2: 75e6,
			g3: 15e6,
		},
		31: {
			am: 1e10,
			g1: 1e6,
			g4: 1,
		},
		32: {
			am: 1e17,
			g2: 5e6,
			g4: 10
		},
		33: {
			am: 1e22,
			g3: 3e7,
			g4: 400
		},
		34: {
			am: 2e25,
			g1: 5e9,
			g3: 5e8
		},
		35: {
			am: 2e28,
			g1: 5e10,
			g4: 5e4
		},
		41: {
			am: 2e33,
			g2: 5e10,
			g4: 1e6
		},
		42: {
			am: 2e40,
			g3: 1e12,
			g4: 1e7
		},
		43:{
			am: 2e50,
			g1: 4e13,
			g3: 4e12
		},
		44:{
			am: 2e65,
			g1: 1e14,
			g4: 1e8
		},
		45:{
			am: 2e80,
			g2: 2e14,
			g4: 4e8
		}
	},
	reqData: {},
	descs: {
		11: "Bosonic Antimatter increases blue Light effect.",
		12: "For every 100% of green power effect, decrease the free galaxy threshold increase by 0.0007.",
		13: "Radioactive Decays boost the effect of Light Empowerments.",
		14: "Sacrificed galaxies cancel less galaxies based on your free galaxies.",
		15: "Ghostifies and dilated time power up each other.",
		21: "Replace first Nanofield reward with a boost to slow down Dimension Supersonic scaling.",
		22: "Replace seventh Nanofield reward with a boost to neutrino gain and preon charge.",
		23: "Assigning gives more colored quarks based on your meta-antimatter.",
		24: "You produce 1% of Space Shards on Big Rip per second, but Break Eternity upgrades that boost space shard gain are nerfed.",
		25: "Electrons boost the per-ten Meta Dimensions multiplier.",
		31: "Bosonic Antimatter boosts all Nanofield rewards.",
		32: "Unlock a new boost until every third LE from LE7 until LE25.",
		33: "Higgs Bosons reduce the costs of all electron upgrades.",
		34: "All types of galaxies boost each other.",
		35: "Replicantis and Emperor Dimensions boost each other.",
		41: "Intergalactic and Infinite Time rewards boost each other.",
		42: "Red power boosts the first Bosonic Upgrade.",
		43: "Green power effect boosts Tree Upgrades.",
		44: "Blue power makes replicate interval increase slower.",
		45: "Dilated time weakens the Distant Antimatter Galaxies scaling."
	},
	effects: {
		11: function() {
			let x = player.ghostify.bl.am.add(1).log10()
			let y = 1
			if (hasBosonicUpg(42)) y = tmp.blu[42]

			let exp = 0.5 - 0.25 * x / (x + 3) / y
			if (tmp.newNGP3E) x += x / 2 + Math.sqrt(x)
			if (y > 1) x *= y
			ret = Math.pow(x, exp) / 4
			if (ret > 1) ret = 1 + Math.log10(ret)
			return ret
		},
		12: function() {
			return (colorBoosts.g + tmp.pe - 1) * 7e-4
		},
		13: function() {
			var decays = getRadioactiveDecays('r') + getRadioactiveDecays('g') + getRadioactiveDecays('b')
			var div = 3
			if (tmp.newNGP3E){
				decays += Math.sqrt(decays) + decays / 3
				div = 2
			}
			return Math.max(Math.sqrt(decays) / 3 + .6, 1)
		},
		14: function() {
			let x = Math.pow(Math.max(player.dilation.freeGalaxies / 20 - 1800, 0), 1.5)
			let y = tmp.qu.electrons.sacGals
			let z = Math.max(y, player.galaxies)
			if (!tmp.ngp3l && x > y) x = (x + y * 2) / 3
			if (x > z) x = Math.pow((x - z + 1e5) * 1e10, 1/3) + z - 1e5
			return Math.round(x)
		},
		15: function() {
			let gLog = Decimal.max(player.ghostify.times, 1).log10()
			if (tmp.newNGP3E) gLog += 2 * Math.sqrt(gLog)

			let ghlog = player.dilation.dilatedTime.div("1e1520").add(1).pow(.05).log10()
			if (ghlog > 308) ghlog = Math.sqrt(ghlog * 308)

			return {
				dt: Decimal.pow(10, 2 * gLog + 3 * gLog / (gLog / 20 + 1)),
				gh: Decimal.pow(10, ghlog)
			}
		},
		23: function() {
			return player.meta.antimatter.add(1).pow(0.06)
		},
		25: function() {
			var div = 8e3
			var add = 1
			var exp = 0.6
			if (tmp.newNGP3E){
				div = 2e3
				add = 1.5
			} else if (tmp.ngp3l) exp = 0.5
			return Math.pow(tmp.qu.electrons.amount + 1, exp) / div + add
		},
		31: function() {
			var ret = Math.pow(Math.log10(player.ghostify.bl.am.add(1).log10() / 5 + 1) / 2 + 1, 2)
			for (var i = 4; i < 10; i++){
				if (ret > i / 2) ret = i / 2 + Math.log10(ret - i/2 + 1)
				else break
			}
			return ret
		},
		33: function() {
			var div = tmp.newNGP3E ? 4 : 6
			return (Math.sqrt(player.ghostify.hb.higgs + 1) - 1) / div + 1
		},
		34: function() {
			var galPart = Math.log10(player.galaxies / 1e4 + 10) * Math.log10(getTotalRG() / 1e4 + 10) * Math.log10(player.dilation.freeGalaxies / 1e4 + 10) * Math.log10(tmp.aeg / 1e4 + 10)
			var exp = tmp.newNGP3E ? 1/6 : 1/8
			var ret = Math.pow(galPart, exp) - 1
			for (var i = 2; i < 10; i++){
				if (ret > i / 10) ret = i / 10 + Math.log10(ret - i/10 + 1)
				else break
			}
			return ret / 5 + 1
		},
		35: function() {
			return {
				rep: Math.pow(tmp.qu.replicants.quarks.add(1).log10(), 1/3) * 2,
				eds: Decimal.pow(tmp.newNGP3E ? 10 : 20, Math.pow(player.replicanti.amount.log10(), 2/3) / 15e3)
			}
		},
		41: function() {
			return {
				ig: Decimal.pow(tmp.qu.bigRip.active ? 1e5 : 1.05, Math.pow(Decimal.max(tmp.it, 1).log10(), 2)),
				it: Decimal.pow(tmp.qu.bigRip.active ? 1.01 : 5, Math.sqrt(Decimal.max(tmp.ig, 1).log10()))
			}
		},
		42: function() {
			var exp = tmp.newNGP3E ? 1/3 : 1/4
			return Math.pow(tmp.qu.colorPowers.r.add(1).log10() / 2e4 + 1, exp)
		},
		43: function() {
			return Math.sqrt(colorBoosts.g + tmp.pe) / (tmp.qu.bigRip.active ? 100 : 40) + 1
		},
		44: function() {
			var exp = tmp.newNGP3E ? .55 : .5
			return Math.pow(tmp.qu.colorPowers.b.add(1).log10(), exp) * 0.15
		},
		45: function() {
			var eff = player.dilation.dilatedTime.add(1).pow(.0005)
			if (eff.gt(9)) eff = Decimal.pow(eff, .5).times(3)
			if (eff.gt(25)) eff = Decimal.pow(eff, .5).times(5)
			if (eff.gt(49)) eff = Decimal.pow(eff, .5).times(7)
			if (eff.gt(81)) eff = Decimal.pow(eff, .5).times(9)
			return eff.toNumber()
		}
	},
	effectDescs: {
		11: function(x) {
			return (x * 100).toFixed(1) + "%"
		},
		12: function(x) {
			return "-" + x.toFixed(5)
		},
		14: function(x) {
			return getFullExpansion(x) + (x > tmp.qu.electrons.sacGals && !tmp.qu.bigRip.active ? " (+" + getFullExpansion(Math.max(x - tmp.qu.electrons.sacGals, 0)) + " Antielectronic Galaxies)" : "")
		},
		15: function(x) {
			return shorten(x.gh) + "x more Ghostifies & " + shorten(x.dt) + "x more DT"
		},
		25: function(x) {
			return "^" + x.toFixed(2)
		},
		31: function(x) {
			return (x * 100 - 100).toFixed(1) + "% stronger"
		},
		33: function(x) {
			return "-" + x.toFixed(2) + " levels worth"
		},
		34: function(x) {
			return (x * 100 - 100).toFixed(2) + "% stronger"
		},
		35: function(x) {
			return "+" + shorten(x.rep) + " OoMs to replicate interval increase, " + shorten(x.eds) + "x to all EDs"
		},
		41: function(x) {
			return shorten(x.ig) + "x to Intergalactic, " + shorten(x.it) + "x to Infinite Time"
		},
		42: function(x) {
			return (x * 100).toFixed(2) + "% to growth and softcap slowdown"
		},
		43: function(x) {
			return (x * 100).toFixed(2) + "%"
		},
		44: function(x) {
			return "+" + x.toFixed(1) + " OoMs"
		},
		45: function(x) {
			return "/" + shorten(x) + " to efficiency"
		}
	}
}

function updateBosonicUpgradesTemp(){
	for (var r = bu.rows; r >= 1; r--) for (var c = 1; c < 6; c++) {
		var id = r * 10 + c
		if (bu.effects[id] !== undefined) tmp.blu[id] = bu.effects[id]()
	}
}

//Bosonic Overdrive
function getBosonicBatteryLoss() {
	if (player.ghostify.bl.odSpeed == 1) return new Decimal(0)
	return Decimal.pow(10, player.ghostify.bl.odSpeed * 2 - 3)
}

function changeOverdriveSpeed() {
	player.ghostify.bl.odSpeed = document.getElementById("odSlider").value / 50 * 4 + 1
}

//W & Z Bosons
function getAntiPreonProduction() {
	let r = new Decimal(0.1)
	if (player.ghostify.bl.usedEnchants.includes(13)) r = r.times(tmp.bEn[13])
	return r
}

var aplScalings = {
	0: 0,
	1: 8,
	2: 32,
	3: 16
}

function getAntiPreonLoss() {
	let r = new Decimal(0.05)
	if (player.ghostify.bl.usedEnchants.includes(13)) r = r.times(tmp.bEn[13])
	return r
}

function useAntiPreon(id) {
	player.ghostify.wzb.dPUse = id
}

function getOscillateGainSpeed() {
	let r = tmp.wzb.wbo
	if (player.ghostify.bl.usedEnchants.includes(23)) r = r.times(tmp.bEn[23])
	return Decimal.div(r, player.ghostify.wzb.zNeReq)
}

function updateWZBosonsTemp(){
	var data = tmp.wzb
	var wpl = player.ghostify.wzb.wpb.add(1).log10()
	var wnl = player.ghostify.wzb.wnb.add(1).log10()

	var bosonsExp = Math.max(wpl * (player.ghostify.wzb.wpb.sub(player.ghostify.wzb.wnb.min(player.ghostify.wzb.wpb))).div(player.ghostify.wzb.wpb.max(1)).toNumber(), 0)
	data.wbt = Decimal.pow(tmp.newNGP3E ? 5 : 3, bosonsExp) //W Bosons boost to extract time
	data.wbo = Decimal.pow(10, Math.max(bosonsExp, 0)) //W Bosons boost to Z Neutrino oscillation requirement
	data.wbp = player.ghostify.wzb.wpb.add(player.ghostify.wzb.wnb).div(100).max(1).pow(1 / 3).sub(1) //W Bosons boost to Bosonic Antimatter production

	var zbslog = player.ghostify.wzb.zb.div(10).add(1).sqrt().log10()
	data.zbs = Decimal.pow(10, zbslog) //Z Bosons boost to W Quark
}

function updateWZBosonsTab() {
	let data = player.ghostify.bl
	let data2 = tmp.wzb
	let data3 = player.ghostify.wzb
	let speed = data.speed * (data.battery.gt(0) ? data.odSpeed : 1)
	let show0 = data2.dPUse == 1 && getAntiPreonLoss().times(speed).div(aplScalings[1]).times(tmp.wzb.zbs).gte(10)
	let gainSpeed = getOscillateGainSpeed()
	let r
	if (!data2.dPUse) r = getAntiPreonProduction().times(speed)
	else r = getAntiPreonLoss().times(speed)
	document.getElementById("ap").textContent = shorten(data3.dP)
	document.getElementById("apProduction").textContent = (data3.dPUse ? "-" : "+") + shorten(r) + "/s"
	document.getElementById("apUse").textContent = data3.dPUse == 0 ? "" : "You are currently consuming Anti-Preons to " + (["", "decay W Quark", "oscillate Z Neutrino", "convert W- to W+ Bosons"])[data3.dPUse] + "."
	document.getElementById("wQkType").textContent = data3.wQkUp ? "up" : "down"
	document.getElementById("wQkProgress").textContent = data3.wQkProgress.times(100).toFixed(1) + "% to turn W Quark to a" + (data3.wQkUp ? " down" : "n up")+" quark."
	document.getElementById("wQk").className = show0 ? "zero" : data3.wQkUp ? "up" : "down"
	document.getElementById("wQkSymbol").textContent = show0 ? "0" : data3.wQkUp ? "+" : "−"
	document.getElementById("wpb").textContent = shortenDimensions(data3.wpb)
	document.getElementById("wnb").textContent = shortenDimensions(data3.wnb)
	document.getElementById("wbTime").textContent = shorten(data2.wbt)
	document.getElementById("wbOscillate").textContent = shorten(data2.wbo)
	document.getElementById("wbProduction").textContent = shorten(data2.wbp)
	document.getElementById("zNeGen").textContent = (["electron", "Mu", "Tau"])[data3.zNeGen - 1]
	document.getElementById("zNeProgress").textContent = data3.zNeProgress.times(100).toFixed(1) + "% to oscillate Z Neutrino to " + (["Mu", "Tau", "electron"])[data3.zNeGen-1] + "."
	document.getElementById("zNeReq").textContent = "Oscillate progress gain speed is currently " + (gainSpeed.gt(1) ? shorten(gainSpeed) : "1 / " + shorten(Decimal.div(1, gainSpeed))) + "x."
	document.getElementById("zNe").className = (["electron","mu","tau"])[data3.zNeGen - 1]
	document.getElementById("zNeSymbol").textContent = (["e", "μ", "τ"])[data3.zNeGen - 1]
	document.getElementById("zb").textContent = shortenDimensions(data3.zb)
	document.getElementById("zbGain").textContent = "You will gain " + shortenDimensions(data3.zNeReq.pow(0.75)) + " Z Bosons on next oscillation."
	document.getElementById("zbSpeed").textContent = shorten(data2.zbs)
}


//Bosonic Lab
function canUnlockBosonicLab() {
	return ghSave.ghostlyPhotons.enpowerments >= 4
}
  
function updateBLUnlocks() {
	let unl = ghSave.wzb.unl
	el("blUnl").style.display = unl ? "none" : ""
	if (!unl) updateBLUnlockDisplay()
}

function updateBLUnlockDisplay() {
	el("blUnl").textContent = "To unlock Bosonic Lab, you need to get " + getFullExpansion(4) + " Spectral Ions first."
}

function getBosonicWattGain() {
	if (player.money.e <= 2.5e16) return E(0)

	let r = player.money.log10() / 2e16 - 1.25
	r *= getAchBWMult()
	return E(r)
}

function WZBosonsUpdating(diff) {
	ghSave.automatorGhosts[17].t += diff

	var data = ghSave.bl
	var wattGain = getBosonicWattGain()
	if (wattGain.gt(data.watt)) {
		data.speed = wattGain
		data.watt = wattGain
	}

	if (E(data.speed).gt(0)) bosonicTick(data.speed.times(diff))
}

function bosonicTick(diff) {
	let lDiff //Mechanic-local diff
	let lData //Mechanic-local data
	let data = ghSave.bl
	if (isNaN(diff.e)) return
	if (data.odSpeed > 1 && data.battery.gt(0)) {
		var bBtL = getBosonicBatteryLoss()
		var odDiff = diff.times(bBtL).min(data.battery)
		var fasterDiff = odDiff.div(bBtL).times(getBosonicOverdrive())
		data.battery = data.battery.sub(diff.times(bBtL).min(data.battery))
		diff = fasterDiff.add(diff.sub(odDiff.min(diff)))
	}
	data.ticks = data.ticks.add(diff)
	
	//W & Z Bosons
	let apDiff
	lData = player.ghostify.wzb
	if (lData.dPUse) {
		apDiff = diff.times(getAntiPreonLoss()).min(lData.dP).div(aplScalings[ghSave.wzb.dPUse])
		if (isNaN(apDiff.e)) apDiff=E(0)

		lData.dP = lData.dP.sub(diff.times(getAntiPreonLoss()).min(lData.dP))
		if (lData.dP.eq(0)) lData.dPUse = 0

		if (lData.dPUse == 1) {
			lData.wQkProgress = lData.wQkProgress.add(apDiff.times(tmp.wzb.zbs).mul(2))
			if (lData.wQkProgress.gt(1)) {
				let toSub = lData.wQkProgress.floor()
				lData.wpb = lData.wpb.add(toSub.add(lData.wQkUp ? 1 : 0).div(2).floor())
				lData.wnb = lData.wnb.add(toSub.add(lData.wQkUp ? 0 : 1).div(2).floor())
				if (toSub.mod(2).gt(0)) lData.wQkUp = !lData.wQkUp
				lData.wQkProgress = lData.wQkProgress.sub(toSub.min(lData.wQkProgress))

				let toAdd = getBatteryGainPerSecond(toSub.div(diff)).times(diff)
				data.battery = data.battery.add(toAdd.times(diff))
				tmp.batteryGainLast = toAdd
			}
		}
		if (lData.dPUse == 2) {
			lData.zNeProgress = lData.zNeProgress.add(apDiff.times(getOscillateGainSpeed()))
			if (lData.zNeProgress.gte(1)) {
				let oscillated = Math.floor(lData.zNeProgress.add(1).log(2))
				lData.zb = lData.zb.add(E_pow(Math.pow(2, 0.75), oscillated).sub(1).div(Math.pow(2, 0.75)-1).times(lData.zNeReq.pow(0.75)))
				lData.zNeProgress = lData.zNeProgress.sub(pow2(oscillated).sub(1).min(lData.zNeProgress)).div(pow2(oscillated))
				lData.zNeReq = lData.zNeReq.times(pow2(oscillated))
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
	lData.zNeReq=pow10(Math.sqrt(Math.max(Math.pow(lData.zNeReq.log10(),2) - diff / 100, 0)))
	
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
		if (!data.usedEnchants.includes(12)) oldAuto = E(0)
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
			data.extractProgress = E(0)
		}
		ghSave.automatorGhosts[17].oc = true
	}
	if (data.extracting && data.extractProgress.lt(1)) {
		dynuta.check = false
		dynuta.times = 0
	}

	//Bosons production
	var newBA = data.am
	var baAdded = getBosonProduction().times(diff)
	data.am = newBA.add(baAdded)
}

function getBosonicProduction() {
	return getBosonProduction()
}

function getAchBWMult(){
	if (!hasAch("ng3p91")) return 1
	return player.achPow.div(E(1.5).pow(19)).toNumber()
}

function getBosonProduction() {
	var exp = Math.pow(player.money.max(1).log10() / 15e15 + 1, 0.8) - 4
	var ret = pow10(exp).times(tmp.wzb.wbp)
	if (ghSave.bl.usedEnchants.includes(34)) ret = ret.times(tmp.bEn[34] || 1)
	if (ghSave.neutrinos.boosts >= 12) ret = ret.times(tmp.nb[12])
	//maybe softcap at e40 or e50?
	ret = softcap(ret, "bam")
	return ret
}

function updateBosonicLimits() {
	if (!tmp.ngp3) return

	//Hypotheses / Theories
	br.limit = br.maxLimit
	if (!ghSave.gravitons.unl) br.limit = 4
	if (ghSave.hb.higgs == 0) br.limit = 3
	var width = 100 / br.limit
	for (var r = 1; r <= br.maxLimit; r++) {
		el("bRuneCol" + r).style = "min-width:" + width + "%;width:" + width + "%;max-width:" + width + "%"
		if (r > 3) {
			var shown = br.limit >= r
			el("bRuneCol" + r).style.display = shown ? "" : "none"
			el("typeToExtract" + r).style.display = shown ? "" : "none"
			el("bEnRow" + (r - 1)).style.display = shown ? "" : "none"
		}
	}

	//Bosonic Upgrades
	bu.rows = bu.maxRows
	if (!ghSave.gravitons.unl) bu.rows = 4
	if (ghSave.hb.higgs == 0) bu.rows = 2
	for (var r = 3; r <= bu.maxRows; r++) el("bUpgRow" + r).style.display = bu.rows >= r ? "" : "none"

	//Enchants
	bEn.limit = bEn.maxLimit
	if (!ghSave.gravitons.unl) bEn.limit = 5
	if (ghSave.hb.higgs == 0) bEn.limit = 2
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
	if (oldTab !== tabName) {
		aarMod.tabsSave.tabBL = tabName
		el("bRunesDiv").style.display = tabName == "bextab" || tabName == "butab" ? "" : "none"
	}
	closeToolTip()
}

function getEstimatedNetBatteryGain(){
	let pos = (tmp.batteryGainLast || E(0)).times(1000)
	if (ghSave.wzb.dPUse != 1) pos = E(0)
	let neg = getBosonicBatteryLoss().times(ghSave.bl.speed)
	if (pos.gte(neg)) return [true, pos.minus(neg)]
	return [false, neg.minus(pos)]
}

function toBLTab() {
	showTab("bltab")
}

function updateBosonicLabTab(){
	let data = ghSave.bl
	let speed = getBosonicFinalSpeed()
	el("bWatt").textContent = shorten(data.watt)
	el("bSpeed").textContent = shorten(data.speed)
	el("bTotalSpeed").textContent = shorten(speed)
	el("bAM").textContent = shorten(data.am)
	el("bAMProduction").textContent = "+" + shorten(getBosonProduction().times(speed)) + "/s"
	el("bBt").textContent = shorten(data.battery)
	let x = getEstimatedNetBatteryGain()
	s = shorten(x[1]) + "/s"
	if (!x[0]) s = "-" + s
	el("bBtProduction").textContent = s
	el("odSpeed").textContent=shorten(getBosonicOverdrive()) + "x"
	el("odSpeedWBBt").style.display = data.battery.eq(0) && data.odSpeed > 1 ? "" : "none"
	el("odSpeedWBBt").textContent = " (" + shorten(getBosonicOverdrive(true)) + "x if you have Bosonic Battery)"
	for (var g = 1; g <= br.limit; g++) el("bRune"+g).textContent = shortenDimensions(data.glyphs[g-1])

	if (ghSave.hb.unl) {
		var req = getHiggsRequirement()
		el("hb").textContent = getFullExpansion(ghSave.hb.higgs)
		el("hbReset").className = "gluonupgrade " + (ghSave.bl.am.gte(req) ? "hb" : "unavailablebtn")
		el("hbResetReq").textContent = shorten(req)
		el("hbResetDesc").textContent = hasAch("future") ? "+" + getFullExpansion(getHiggsGain()) + " Higgs" : "Reset Bosonic Lab to gain +" + getFullExpansion(getHiggsGain()) + " Higgs."
	}

	if (el("bextab").style.display=="block") updateBosonExtractorTab()
	if (el("butab").style.display=="block") updateBosonicUpgradeDescs()
	if (el("wzbtab").style.display=="block") updateWZBosonsTab()
	if (el("gravtab").style.display == "block") updateGravitonsTab()
}

function updateBosonicStuffCosts() {
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		var data = bEn.costs[id]
		el("bEnG1Cost" + id).textContent = (data !== undefined && data[0] !== undefined && shortenDimensions(getBosonicFinalCost(data[0]))) || "???"
		el("bEnG2Cost" + id).textContent = (data !== undefined && data[1] !== undefined && shortenDimensions(getBosonicFinalCost(data[1]))) || "???"
	}
	for (var r = 1; r <= bu.rows; r++) for (var c = 1; c < 6; c++) {
		var id = r * 10 + c
		var data = bu.reqData[id]
		el("bUpgCost" + id).textContent = (data[0] !== undefined && shorten(getBosonicFinalCost(data[0]))) || "???"
		for (var g = 1; g < 3; g++) el("bUpgG" + g + "Req" + id).textContent = (data[g * 2 - 1] !== undefined && shortenDimensions(getBosonicFinalCost(data[g * 2 - 1]))) || "???"
	}
}

function getBosonicFinalCost(x) {
	return E(x).ceil()
}

function updateBosonicLabTemp() {
	tmp.bEn = {}
	tmp.blu = {}
	tmp.wzb = {}
	tmp.hbTmp = {}

	if (!tmp.ngp3) return 
	if (!ghSave.wzb.unl) return 

	updateBosonicEnchantsTemp()
	updateBosonicUpgradesTemp()
	updateWZBosonsTemp()
}

//Bosonic Extractor / Hypotheses
let dynuta={
	check: false,
	times: 0
}
function extract() {
	let data = ghSave.bl
	if (data.extracting) return
	player.ghostify.automatorGhosts[17].oc = false
	dynuta.check = true
	data.extracting = true
}

function getExtractTime() {
	let data = ghSave.bl
	let r = E(br.scalings[data.typeToExtract] || 1/0)
	r = r.div(tmp.wzb.wbt)
	return r
}

function changeTypeToExtract(x) {
	let data = ghSave.bl
	if (data.typeToExtract == x) return
	el("typeToExtract" + data.typeToExtract).className = "storebtn"
	el("typeToExtract" + x).className = "chosenbtn"
	data.typeToExtract = x
	data.extracting = false
	data.extractProgress = E(0)
	data.autoExtract = E(1)

	ghSave.automatorGhosts[17].t = 0
}

function canBuyEnchant(id) {
	let data = ghSave.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	if (costData === undefined) return
	if (costData[0] === undefined || !data.glyphs[g1 - 1].gte(getBosonicFinalCost(costData[0]))) return
	if (costData[1] === undefined || !data.glyphs[g2 - 1].gte(getBosonicFinalCost(costData[1]))) return
	return true
}

function isEnchantUsed(x) {
	return tmp.bEn !== undefined && tmp.bEn[x] !== undefined && tmp.bl.usedEnchants.includes(x)
}

function getMaxEnchantLevelGain(id) {
	let data = ghSave.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	if (costData === undefined) return E(0)
	let lvl1 = data.glyphs[g1 - 1].div(getBosonicFinalCost(costData[0])).floor()
	let lvl2 = data.glyphs[g2 - 1].div(getBosonicFinalCost(costData[1])).floor()
	if (costData[0] == 0) lvl1 = 1/0
	if (costData[1] == 0) lvl2 = 1/0
	return lvl1.min(lvl2)
}

function canUseEnchant(id) {
	if (!ghSave.bl.enchants[id]) return
	if (bEn.limit == 1) {
		if (ghSave.bl.usedEnchants.includes(id)) return
	} else if (!ghSave.bl.usedEnchants.includes(id) && ghSave.bl.usedEnchants.length >= bEn.limit) return
	return true
}

function takeEnchantAction(id) {
	let data = ghSave.bl
	if (bEn.action == "upgrade") {
		let costData = bEn.costs[id]
		let g1 = Math.floor(id / 10)
		let g2 = id % 10
		if (!canBuyEnchant(id)) return
		data.glyphs[g1 - 1] = data.glyphs[g1 - 1].sub(getBosonicFinalCost(costData[0])).round()
		data.glyphs[g2 - 1] = data.glyphs[g2 - 1].sub(getBosonicFinalCost(costData[1])).round()
		if (data.enchants[id] == undefined) data.enchants[id] = E(1)
		else data.enchants[id] = data.enchants[id].add(1).round()
	} else if (bEn.action == "max") {
		let lvl = getMaxEnchantLevelGain(id)
		let costData = bEn.costs[id]
		let g1 = Math.floor(id / 10)
		let g2 = id % 10
		if (!canBuyEnchant(id)) return
		data.glyphs[g1 - 1] = data.glyphs[g1 - 1].sub(lvl.times(getBosonicFinalCost(costData[0])).min(data.glyphs[g1 - 1])).round()
		data.glyphs[g2 - 1] = data.glyphs[g2 - 1].sub(lvl.times(getBosonicFinalCost(costData[1])).min(data.glyphs[g2 - 1])).round()
		if (data.enchants[id] == undefined) data.enchants[id] = E(lvl)
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
	let data = ghSave.bl
	let l = E(0)
	if (bEn.effects[id] === undefined) return
	if (desc ? data.enchants[id] : data.usedEnchants.includes(id)) l = E(data.enchants[id])
	return bEn.effects[id](l)
}

function updateBosonExtractorTab(){
	let data = ghSave.bl
	let speed = data.speed * (data.battery.gt(0) ? data.odSpeed : 1)
	let time = getExtractTime().div(speed)
	if (data.extracting) el("extract").textContent = (time.lt(0.1)?"Progressing":" ("+data.extractProgress.times(100).toFixed(1)+"%)")
	else el("extract").textContent="Experiment"
	if (time.lt(0.1)) el("extractTime").textContent="This would automatically take "+shorten(Decimal.div(1,time))+" per second."
	else if (data.extracting) el("extractTime").textContent=shorten(time.times(Decimal.sub(1,data.extractProgress)))+" seconds left..."
	else el("extractTime").textContent="This will take "+shorten(time)+" seconds."
	updateEnchantDescs()
}

function updateEnchantDescs() {
	let data = ghSave.bl
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		if (bEn.action == "upgrade" || bEn.action == "max") el("bEn" + id).className = "gluonupgrade "  +(canBuyEnchant(id) ? "bl" : "unavailablebtn")
		else if (bEn.action == "use") el("bEn" + id).className = "gluonupgrade " + (canUseEnchant(id) ? "storebtn" : "unavailablebtn")
		if (id == 14) el("bEn14").style = "font-size: 8px"
		if (shiftDown) el("bEnLvl" + id).textContent = "Enchant id: " + id
		else el("bEnLvl" + id).textContent = "Level: " + shortenDimensions(tmp.bEn.lvl[id])
		if (bEn.action == "max") el("bEnOn"+id).textContent = "+" + shortenDimensions(getMaxEnchantLevelGain(id)) + " levels"
		else el("bEnOn" + id).textContent = data.usedEnchants.includes(id) ? "Enabled" : "Disabled"
		if (tmp.bEn[id] != undefined) {
			let effect = getEnchantEffect(id, true)
			let effectDesc = bEn.effectDescs[id]
			el("bEnEffect" + id).textContent = effectDesc !== undefined ? effectDesc(effect) : shorten(effect) + "x"	
		}
	}
	el("usedEnchants").textContent = "You have used " + data.usedEnchants.length + " / " + bEn.limit + " Theories."
}

var br = {
	names: [null, "Infinite", "Eternal", "Quantum", "Spectre", "Ethereal", "Newtonian", "Seventh", "Eighth", "Ninth"], //Current maximum limit of 9.
	maxLimit: 6,
	scalings: {
		1: 10,
		2: 20,
		3: 100,
		4: 5e7,
		5: 1/0,
		6: 1/0
	}
}

var bEn = {
	costs: {
		12: [3,1],
		13: [20,2],
		23: [1e4,2e3],
		14: [1e6, 2],
		24: [1e6, 10],
		34: [1,0],
		15: [1/0,1],
		25: [1/0,1],
		35: [1/0,1],
		45: [1/0,1],
		16: [1/0,1],
		26: [1/0,1],
		36: [1/0,1],
		46: [1/0,1],
		56: [1/0,1]
	},
	descs: {
		12: "Automatically experiment.",
		13: "Speed up the production and use of Anti-Preons.",
		23: "Bosons boost oscillate speed.",
		14: "Divide the requirement of Higgs and start with some Bosonic Upgrades even it is inactive.",
		24: "You gain more Bosonic Battery.",
		34: "Higgs produce more Bosons.",
		15: "Z Bosons give a stronger boost to W Bosons.",
		25: "Raise the Overdrive Speed.",
		35: "Speed up the Auto-Enchanter Ghost.",
		45: "Overdrive Speed boosts Gravitons.",
		16: "Neutrino Boost 7 always work, but reduced.",
		26: "RG4 negative effects are reduced.",
		36: "Cheapen Spectral Ions.",
		46: "Reduce Bosonic Upgrade 1 slowdown.",
		56: "Weaken the Nanoreward scalings.",
	},
	effects: {
		12(l) {
			let exp = 0.75
			if (l.gt(1e10)) exp *= Math.pow(l.log10() / 10, 1/3)
			if (exp > .8) exp = Math.log10(exp * 12.5) * .8
			return E_pow(l, exp).div(bEn.autoScalings[ghSave.bl.typeToExtract])
		},
		13(l) {
			return Decimal.add(l, 1).sqrt()
		},
		14(l) {
			let bUpgs = Decimal.add(l, 9).log10()
			if (bUpgs > 15) bUpgs = Math.sqrt(bUpgs * 15)
			if (bUpgs > 20) bUpgs = 20
			return {
				bUpgs: bUpgs,
				higgs: Decimal.add(l, 1).pow(0.4)
			}
		},
		23(l) {
			let exp = Math.max(l.log10() + 1, 0) / 3
			return E_pow(Math.min(ghSave.bl.am.add(10).log10(), 100), exp)
		},
		24(l) {
			return E_pow(Decimal.add(l, 100).log10(), 4).div(16)
		},
		34(l) {
			let log = l.add(1).log10()
			return E(ghSave.hb.higgs / 4 + 1).pow(log / Math.log10(log + 10))
		},
		15(l) {
			return 0.65 - 0.15 / Math.sqrt(l.add(1).log10() / 50 + 1)
		},
		25(l) {
			return l.add(1).log10() / 100 + 1
		},
		35(l) {
			return Math.sqrt(l.add(10).log10())
		},
		45(l) {
			return E(1)
		},
	},
	effectDescs: {
		12(x) {
			var blData = ghSave.bl

			x = x.times(blData.speed * (blData.battery.gt(0) ? blData.odSpeed : 1))
			if (x.lt(1) && x.gt(0)) return x.m.toFixed(2) + "/" + shortenCosts(pow10(-x.e)) + " seconds"
			return shorten(x) + "/second"
		},
		14(x) {
			return "/" + shorten(x.higgs) + " to Higgs requirement, " + getFullExpansion(x.bUpgs) + " starting upgrades"
		},
		15(x) {
			return "x^0.500 -> x^" + x.toFixed(3)
		},
	},
	action: "upgrade",
	actions: ["upgrade", "max", "use"],
	maxLimit: 8,
	autoScalings:{
		1: 1.5,
		2: 3,
		3: 12,
		4: 1e6,
		5: 1/0
	},
	onBuy(id) {
		
	},
}

function updateBosonicEnchantsTemp(){
	tmp.bEn.lvl = {}
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		tmp.bEn.lvl[id] = ghSave.bl.enchants[id] || E(0)
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

function getRemainingExtractTime() {
	let data = ghSave.bl
	let x = getExtractTime().div(data.speed)
	if (data.extracting) x = x.times(Decimal.sub(1, data.extractProgress))
	return x
}

function autoMaxEnchant(id) {
	if (!canBuyEnchant(id)) return

	let data = ghSave.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	let toAdd = getMaxEnchantLevelGain(id)
	if (data.enchants[id] == undefined) data.enchants[id] = E(toAdd)
	else data.enchants[id] = data.enchants[id].add(toAdd).round()
	bEn.onBuy(id)
}

function autoMaxAllEnchants() {
	for (let g2 = 2; g2 <= br.limit; g2++) for (let g1 = 1; g1 < g2; g1++) autoMaxEnchant(g1 * 10 + g2)
}

function canBuyBosonicUpg(id) {
	let rData = bu.reqData[id]
	if (rData[0] === undefined || rData[1] === undefined || rData[3] === undefined) return
	if (!ghSave.bl.am.gte(getBosonicFinalCost(rData[0]))) return
	for (var g = 1; g < 3; g++) if (!ghSave.bl.glyphs[rData[g * 2] - 1].gte(getBosonicFinalCost(rData[g * 2 - 1]))) return
	return true
}

function buyBosonicUpgrade(id, quick) {
	if (hasBU(id)) return true
	if (!canBuyBosonicUpg(id)) return false
	ghSave.bl.upgrades.push(id)
	ghSave.bl.am = ghSave.bl.am.sub(getBosonicFinalCost(bu.reqData[id][0]))

	if (!quick) updateTemp()
	if (id == 21 || id == 22) updateNanoRewardTemp()
	if (id == 32) tmp.updateLights = true
	delete ghSave.hb.bosonicSemipowerment

	return true
}

function buyMaxBosonicUpgrades() {
	var stopped = false
	var oldLength = ghSave.bl.upgrades.length
	if (oldLength == bu.rows * 5) return
	for (var r = 1; r <= bu.rows; r++) {
		for (var c = 1; c <= 5; c++) {
			var id = r * 10 + c
			if (!buyBosonicUpgrade(id, true)) break
		}
	}
	if (ghSave.bl.upgrades.length > oldLength) updateTemp()
}

function hasBU(x) {
	return ghostified && ghSave.wzb.unl && (tmp.bl||ghSave.bl).upgrades.includes(x)
}

function updateBosonicUpgradeDescs() {
	for (var r = 1; r <= bu.rows; r++) for (var c = 1; c <= 5; c++) {
		var id = r * 10 + c
		el("bUpg" + id).className = hasBU(id) ? "gluonupgradebought bl" : canBuyBosonicUpg(id) ? "gluonupgrade bl" : "gluonupgrade unavailablebtn bllocked"
		if (tmp.blu[id] !== undefined) el("bUpgEffect"+id).textContent = (bu.effectDescs[id] !== undefined && bu.effectDescs[id](tmp.blu[id])) || shorten(tmp.blu[id]) + "x"
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
			am: 2e70,
			g1: 4e13,
			g3: 4e12
		},
		44:{
			am: 2e80,
			g1: 1e14,
			g4: 1e8
		},
		45:{
			am: 2e90,
			g2: 2e14,
			g4: 4e8
		},
	},
	reqData: {},
	descs: {
		11: "Bosons increases blue Light effect.",
		12: "Decrease the free galaxy threshold based on Green Power.",
		13: "Radioactive Decays boost Spectral Ions.",
		14: "Sacrificed galaxies cancel less based on your Tachyonic Galaxies.",
		15: "Fundaments and dilated time power up each other.",
		21: "Replace first Nanoreward with a boost to weaken Dimension Supersonic.",
		22: "Replace seventh Nanoreward with a boost to Neutrinos and Preon Charge.",
		23: "Meta-antimatter multiplies colored quarks.",
		24: "Produce Space Shards outside of Big Rips, but reduced.",
		25: "Electrons boost the per-ten Meta Dimensions multiplier.",
		31: "Bosons strengthen Nanofield.",
		32: "Unlock a new boost for every 3rd LE from LE7 until LE25.",
		33: "Higgs cheapens all electron upgrades.",
		34: "Total galaxies strengthen galaxies.",
		35: "Replicantis and Emperor Dimensions boost each other.",
		41: "Intergalactic and Infinite Time rewards boost each other.",
		42: "Red power boosts Bosonic Upgrade 1.",
		43: "Green power effect boosts Tree Upgrades.",
		44: "Blue power slows down replicate interval increase.",
		45: "Dilated time weakens Distant Antimatter Galaxies.",
	},
	effects: {
		11: function() {
			let x = ghSave.bl.am.add(1).log10()
			let g = 1
			let sd = 1
			if (hasBU(42)) g = tmp.blu[42]
			if (hasBU(42)) sd = tmp.blu[42]

			let exp = 0.5 - 0.25 * x / (x + 3) / sd
			if (g > 1) x *= g

			ret = Math.pow(x, exp) / 4
			return ret
		},
		12: function() {
			let r = (colorBoosts.g + tmp.pe - 1) * 7e-4
			if (r > 0.2) r = 0.35 - 0.04 / r
			return r
		},
		13: function() {
			var decays = getRadioactiveDecays('r') + getRadioactiveDecays('g') + getRadioactiveDecays('b')
			var div = 3
			if (tmp.ngp3e){
				decays += Math.sqrt(decays) + decays / 3
				div = 2
			}
			return Math.max(Math.sqrt(decays) / 3 + .6, 1)
		},
		14: function() {
			let x = Math.pow(Math.max(player.dilation.freeGalaxies / 20 - 1800, 0), 1.5)
			let y = quSave.electrons.sacGals
			let z = Math.max(y, player.galaxies)
			if (x > y) x = (x + y * 2) / 3
			if (x > z) x = Math.pow((x - z + 1e5) * 1e10, 1/3) + z - 1e5
			return Math.round(x)
		},
		15: function() {
			let gLog = Decimal.max(ghSave.times, 1).log10()
			if (tmp.ngp3e) gLog += 2 * Math.sqrt(gLog)

			let ghlog = player.dilation.dilatedTime.div("1e1520").add(1).pow(.05).log10()
			if (ghlog > 308) ghlog = Math.sqrt(ghlog * 308)

			return {
				dt: pow10(2 * gLog + 3 * gLog / (gLog / 20 + 1)),
				gh: pow10(ghlog)
			}
		},
		23: function() {
			return player.meta.antimatter.add(1).pow(0.06)
		},
		25: function() {
			var div = 8e3
			var add = 1
			var exp = 0.6
			if (tmp.ngp3e){
				div = 2e3
				add = 1.5
			}
			return Math.pow(quSave.electrons.amount + 1, exp) / div + add
		},
		31: function() {
			var ret = Math.pow(Math.log10(ghSave.bl.am.add(1).log10() / 5 + 1) / 2 + 1, 2)
			if (ret > 2) ret = ret / 2 + 1
			return ret
		},
		33: function() {
			var div = tmp.ngp3e ? 4 : 6
			return (Math.sqrt(ghSave.hb.higgs + 1) - 1) / div + 1
		},
		34: function() {
			var galPart = Math.log10(player.galaxies / 1e4 + 1) + Math.log10(getTotalRG() / 1e4 + 1) + Math.log10(player.dilation.freeGalaxies / 1e4 + 10) * Math.log10(tmp.aeg / 1e4 + 1)
			var exp = tmp.ngp3e ? 1/3 : 1/4
			return Math.pow(galPart / 5 + 1, exp)
		},
		35: function() {
			return {
				rep: Math.pow(quSave.replicants.quarks.add(1).log10(), 1/3) * 2,
				eds: E_pow(tmp.ngp3e ? 10 : 20, Math.pow(player.replicanti.amount.log10(), 2/3) / 15e3)
			}
		},
		41: function() {
			return {
				ig: E_pow(bigRipped() ? 1e5 : 1.05, Math.pow(Decimal.max(tmp.it, 1).log10(), 2)),
				it: E_pow(bigRipped() ? 1.01 : 5, Math.sqrt(Decimal.max(tmp.ig, 1).log10()))
			}
		},
		42: function() {
			var exp = 1/3
			return Math.pow(quSave.colorPowers.r.add(1).log10() / 2e4 + 1, exp)
		},
		43: function() {
			return Math.sqrt(colorBoosts.g + tmp.pe) / (bigRipped() ? 100 : 40) + 1
		},
		44: function() {
			var exp = tmp.ngp3e ? .55 : .5
			return Math.pow(quSave.colorPowers.b.add(1).log10(), exp) * 0.15
		},
		45: function() {
			var eff = player.dilation.dilatedTime.add(1).log10() / 500 + 1
			return eff
		},
	},
	effectDescs: {
		11: function(x) {
			return "+" + (x * 100).toFixed(1) + "%"
		},
		12: function(x) {
			return "-" + x.toFixed(5)
		},
		14: function(x) {
			//To do: Add Antielectronic Galaxies in Big Rips, sometimes in Gravitons
			return getFullExpansion(x) + (x > quSave.electrons.sacGals && !bigRipped() ? " (+" + getFullExpansion(Math.max(x - quSave.electrons.sacGals, 0)) + " Antielectronic Galaxies)" : "")
		},
		15: function(x) {
			return shorten(x.gh) + "x Fundaments, " + shorten(x.dt) + "x DT"
		},
		25: function(x) {
			return "^" + x.toFixed(2)
		},
		31: function(x) {
			return shorten(x * 100 - 100) + "% stronger"
		},
		33: function(x) {
			return "-" + x.toFixed(2) + " levels worth"
		},
		34: function(x) {
			return shorten(x * 100 - 100) + "% stronger"
		},
		35: function(x) {
			return "+" + shorten(x.rep) + " OoMs to replicate interval increase, " + shorten(x.eds) + "x to all EDs"
		},
		41: function(x) {
			return shorten(x.ig) + "x to Intergalactic, " + shorten(x.it) + "x to Infinite Time"
		},
		42: function(x) {
			return shorten(x * 100) + "% to growth and softcap slowdown"
		},
		43: function(x) {
			return shorten(x * 100) + "%"
		},
		44: function(x) {
			return "+" + x.toFixed(1) + " OoMs"
		},
		45: function(x) {
			return "/" + shorten(x)
		},
	}
}

function updateBosonicUpgradesTemp(){
	for (var r = bu.rows; r >= 1; r--) for (var c = 1; c < 6; c++) {
		var id = r * 10 + c
		if (bu.effects[id] !== undefined) tmp.blu[id] = bu.effects[id]()
	}
}

//Bosonic Overdrive
function getBatteryGainPerSecond(toSub) {
	let batteryMult = new Decimal(1)
	if (isEnchantUsed(24)) batteryMult = batteryMult.times(tmp.bEn[24])

	let toAdd = toSub.div(1e6).times(batteryMult)
	if (toAdd.gt(1e3)) toAdd = Decimal.pow(toAdd.log10() + 7, 3)

	return toAdd
}

function getBosonicBatteryLoss() {
	if (ghSave.bl.odSpeed == 1) return E(0)
	return pow10(ghSave.bl.odSpeed * 2 - 3)
}

function changeOverdriveSpeed() {
	ghSave.bl.odSpeed = el("odSlider").value / 50 * 4 + 1
}

function getBosonicOverdrive(bypass) {
	let r = ghSave.bl.odSpeed
	if (!bypass && ghSave.bl.battery.lte(0)) r = E(1)
	return E(r)
}

function getBosonicFinalSpeed() {
	return Decimal.mul(ghSave.bl.speed, getBosonicOverdrive())
}

//W & Z Bosons
function getAntiPreonProduction() {
	let r = E(0.2)
	if (ghSave.bl.usedEnchants.includes(13)) r = r.times(tmp.bEn[13])
	return r
}

var aplScalings = {
	0: 0,
	1: 1,
	2: 2,
	3: 4
}

function getAntiPreonLoss() {
	let r = E(0.05)
	if (ghSave.bl.usedEnchants.includes(13)) r = r.times(tmp.bEn[13])
	return r
}

function useAntiPreon(id) {
	ghSave.wzb.dPUse = id
}

function getOscillateGainSpeed() {
	let r = tmp.wzb.wbo
	if (ghSave.bl.usedEnchants.includes(23)) r = r.times(tmp.bEn[23])
	return Decimal.div(r, ghSave.wzb.zNeReq)
}

function updateWZBosonsTab() {
	let data = ghSave.bl
	let data2 = tmp.wzb
	let data3 = ghSave.wzb
	let speed = getBosonicFinalSpeed()
	let show0 = data2.dPUse == 1 && getAntiPreonLoss().times(speed).div(aplScalings[1]).times(tmp.wzb.zbs).gte(10)
	let gainSpeed = getOscillateGainSpeed()
	let r
	if (!data2.dPUse) r = getAntiPreonProduction().times(speed)
	else r = getAntiPreonLoss().times(speed)
	el("ap").textContent = shorten(data3.dP)
	el("apProduction").textContent = (data3.dPUse ? "-" : "+") + shorten(r) + "/s"
	el("apUse").textContent = data3.dPUse == 0 ? "" : "You are currently consuming Anti-Preons to " + (["", "decay W Bosons", "oscillate Z Bosons", "convert W- to W+ Bosons"])[data3.dPUse] + "."
	el("wQkType").textContent = data3.wQkUp ? "positive" : "negative"
	el("wQkProgress").textContent = data3.wQkProgress.times(100).toFixed(1) + "% to turn W Boson to a" + (data3.wQkUp ? " negative" : " positive")+" Boson."
	el("wQk").className = show0 ? "zero" : data3.wQkUp ? "up" : "down"
	el("wQkSymbol").textContent = show0 ? "0" : data3.wQkUp ? "+" : "−"
	el("wpb").textContent = shortenDimensions(data3.wpb)
	el("wnb").textContent = shortenDimensions(data3.wnb)
	el("wbTime").textContent = shorten(data2.wbt)
	el("wbOscillate").textContent = shorten(data2.wbo)
	el("wbProduction").textContent = shorten(data2.wbp)
	el("zNeGen").textContent = (["electron", "Mu", "Tau"])[data3.zNeGen - 1]
	el("zNeProgress").textContent = data3.zNeProgress.times(100).toFixed(1) + "% to oscillate Z Boson to " + (["Mu", "Tau", "electron"])[data3.zNeGen-1] + "."
	el("zNeReq").textContent = "Oscillate progress gain speed is currently " + (gainSpeed.gt(1) ? shorten(gainSpeed) : "1 / " + shorten(Decimal.div(1, gainSpeed))) + "x."
	el("zNe").className = (["electron","mu","tau"])[data3.zNeGen - 1]
	el("zNeSymbol").textContent = (["e", "μ", "τ"])[data3.zNeGen - 1]
	el("zb").textContent = shortenDimensions(data3.zb)
	el("zbGain").textContent = "You will gain " + shortenDimensions(data3.zNeReq.pow(0.75)) + " Z Bosons on next oscillation."
	el("zbSpeed").textContent = shorten(data2.zbs)
}


function updateWZBosonsTemp(){
	let data = tmp.wzb
	let wpl = player.ghostify.wzb.wpb.add(1).log10()
	let wnl = player.ghostify.wzb.wnb.add(1).log10()

	let bosonsExp = Math.max(wpl * (player.ghostify.wzb.wpb.sub(player.ghostify.wzb.wnb.min(player.ghostify.wzb.wpb))).div(player.ghostify.wzb.wpb.max(1)).toNumber(), 0)
	data.wbt = Decimal.pow(4, bosonsExp)
	//W Bosons boost to extract time
	data.wbo = Decimal.pow(10, bosonsExp)
	//W Bosons boost to Z Neutrino oscillation requirement

	let div1 = tmp.ngp3e ? 2 : 30
	data.wbp = player.ghostify.wzb.wpb.add(player.ghostify.wzb.wnb).div(div1).max(1).pow(1 / 3).sub(1)
	//W Bosons boost to Bosons production

	let zLog = player.ghostify.wzb.zb.add(1).log10()
	let zLogMult = 0.5
	if (isEnchantUsed(15)) zLogMult = tmp.bEn[15]
	data.zbs = Decimal.pow(10, zLog * zLogMult) //Z Bosons boost to W Quark
}
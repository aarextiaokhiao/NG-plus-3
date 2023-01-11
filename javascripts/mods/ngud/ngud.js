//v1: black hole part
function getBlackholeDimensionPower(tier) {
	let dim = player["blackholeDimension" + tier];
	let ret = dim.power
	if (aarMod.ngumuV) ret = ret.pow(Math.sqrt(getMPTExp()))
	return dilates(ret.max(1), 1)
}


function getBlackholeDimensionProduction(tier) {
	var dim = player["blackholeDimension" + tier]
	if (player.currentEternityChall == "eterc11") return dim.amount
	var ret = dim.amount.times(getBlackholeDimensionPower(tier))
	return ret
}


function getBlackholeDimensionRateOfChange(tier) {
	let toGain = getBlackholeDimensionProduction(tier + (inQC(4) ? 2 : 1))
	var current = Decimal.max(player["blackholeDimension" + tier].amount, 1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10() - current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change  = toGain.times(10).dividedBy(current);
	return change;
}

function getBlackholeDimensionDescription(tier) {
	if (!isBHDimUnlocked(tier + (inQC(4) ? 2 : 1))) return getFullExpansion(player['blackholeDimension' + tier].bought)
	else return shortenDimensions(player['blackholeDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, getBlackholeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getBlackholeUpgradeExponent() {
	let ret = player.blackhole.upgrades.total / 10
	if (player.dilation.upgrades.includes("ngusp2")) ret += getD21Bonus()
	if (ret > 2) ret = (ret - 2) / Math.log2(ret) + 2
	if (ret > 20 && (mod.udp || aarMod.nguspV)) ret=20+Math.pow(Math.log10(ret-19),aarMod.ngumu?2.5:2) // this should only happen if you are playing NGUd'.
	return ret
}

function getBlackholePowerEffect() {
	return E_pow(Math.max(player.blackhole.power.max(1).log(2), 1), getBlackholeUpgradeExponent())
}

function unlockBlackhole() {
	if (player.eternityPoints.gte('1e4000')) {
		el("blackholediv").style.display = "inline-block"
		el("blackholeunlock").style.display = "none"
		player.blackhole.unl = true
		player.eternityPoints = player.eternityPoints.minus('1e4000')
	}
}

function isBHDimUnlocked(t) {
	if (t > 8) return false
	if (t > 4) {
		if (aarMod.nguspV === undefined) return false
		if (t==5) return player.eternityPoints.gt("1e120000")
		if (t==6) return player.eternityPoints.gt("1e175000")
		if (t==7) return player.eternityPoints.gt("1e190000")
		if (t==8) return player.eternityPoints.gt("1e1000000")
	}
	return true
}

function updateBlackhole() {
	drawBlackhole();
	el("blackholePowAmount").innerHTML = shortenMoney(player.blackhole.power);
	el("blackholePowPerSec").innerHTML = "You are getting " + shortenMoney(getBlackholeDimensionProduction(1)) + " black hole power per second.";
	el("DilMultAmount").innerHTML = formatValue(player.options.notation, getBlackholePowerEffect(), 2, 2)
	el("InfAndReplMultAmount").innerHTML = formatValue(player.options.notation, getBlackholePowerEffect().pow(1/3), 2, 2)
	el("blackholeDil").innerHTML = "Feed the black hole with dilated time<br>Cost: "+shortenCosts(pow10(player.blackhole.upgrades.dilatedTime+(aarMod.nguspV?18:20)))+" dilated time";
	el("blackholeInf").innerHTML = "Feed the black hole with banked infinities<br>Cost: "+formatValue(player.options.notation, pow2(player.blackhole.upgrades.bankedInfinities).times(5e9).round(), 1, 1)+" banked infinities";
	el("blackholeRepl").innerHTML = "Feed the black hole with replicanti<br>Cost: "+shortenCosts(E("1e20000").times(E_pow("1e1000", player.blackhole.upgrades.replicanti)))+" replicanti";
	el("blackholeDil").className = canFeedBlackHole(1) ? 'eternityupbtn' : 'eternityupbtnlocked';
	el("blackholeInf").className = canFeedBlackHole(2) ? 'eternityupbtn' : 'eternityupbtnlocked';
	el("blackholeRepl").className = canFeedBlackHole(3) ? 'eternityupbtn' : 'eternityupbtnlocked';
	if (el("blackhole").style.display == "block" && el("eternitystore").style.display == "block") {
		for (let tier = 1; tier < 9; ++tier) {
			if (isBHDimUnlocked(tier)) {
				el("blackholeRow" + tier).style.display = ""
				el("blackholeD" + tier).textContent = DISPLAY_NAMES[tier] + " Black Hole Dimension x" + shortenMoney(getBlackholeDimensionPower(tier));
				el("blackholeAmount" + tier).textContent = getBlackholeDimensionDescription(tier);
				el("blackholeMax" + tier).textContent = "Cost: " + shortenCosts(player["blackholeDimension"+tier].cost) + " EP";
				if (player.eternityPoints.gte(player["blackholeDimension" + tier].cost)) el("blackholeMax"+tier).className = "storebtn"
				else el("blackholeMax"+tier).className = "unavailablebtn"
			} else el("blackholeRow"+tier).style.display="none"
		}
	}
}

function drawBlackhole(ts) {
	if (el("eternitystore").style.display !== "none" && el("blackhole").style.display !== "none" && isAnimationOn("blackHole")) {
		bhctx.clearRect(0, 0, canvas.width, canvas.height);
		let radius = Math.max(player.blackhole.power.log(2), 0);
		bhctx.beginPath()
		bhctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI, true)
		bhctx.fill()
		delta = (ts - lastTs) / 1000;
		lastTs = ts;
		requestAnimationFrame(drawBlackhole);
	}
}

function canFeedBlackHole (i) {
	if (i == 1) {
		return pow10(player.blackhole.upgrades.dilatedTime + (aarMod.nguspV ? 18 : 20)).lte(player.dilation.dilatedTime)
	} else if (i == 2) {
		return pow2(player.blackhole.upgrades.bankedInfinities).times(5e9).round().lte(player.infinitiedBank)
	} else if (i == 3) {
		return pow10(1e3 * player.blackhole.upgrades.replicanti + 2e4).lte(player.replicanti.amount)
	}
}

function feedBlackHole(i, bulk) {
	if (!canFeedBlackHole(i)) return
	if (i == 1) {
		let cost = pow10(player.blackhole.upgrades.dilatedTime + (aarMod.nguspV ? 18 : 20))
		if (bulk) {
			let toBuy = Math.floor(player.dilation.dilatedTime.div(cost).times(9).plus(1).log10())
			let toSpend = pow10(toBuy).sub(1).div(9).times(cost)
			player.dilation.dilatedTime = player.dilation.dilatedTime.minus(player.dilation.dilatedTime.min(toSpend))
			player.blackhole.upgrades.dilatedTime += toBuy
			player.blackhole.upgrades.total += toBuy
		} else {
			player.dilation.dilatedTime = player.dilation.dilatedTime.minus(pow10(player.blackhole.upgrades.dilatedTime + (aarMod.nguspV ? 18 : 20)))
			player.blackhole.upgrades.dilatedTime++
		}
	} else if (i == 2) {
		let cost = pow2(player.blackhole.upgrades.bankedInfinities).times(5e9).round()
		if (bulk) {
			let toBuy = Math.floor(Decimal.div(player.infinitiedBank, cost).plus(1).log(2))
			let toSpend = pow10(1e3 * toBuy - 1).times(cost).round()
			player.infinitiedBank = nS(player.infinitiedBank, nMn(player.infinitiedBank, toBuy))
			player.blackhole.upgrades.bankedInfinities += toBuy
			player.blackhole.upgrades.total += toBuy
		} else {
			player.infinitiedBank = nS(player.infinitiedBank, cost)
			player.blackhole.upgrades.bankedInfinities++
		}
	} else if (i == 3) {
		let cost = pow10(1e3 * player.blackhole.upgrades.replicanti + 2e4)
		if (bulk) {
			let toBuy = Math.floor(player.replicanti.amount.div(cost).log10() / 1e3 + 1)
			let toSpend = pow10(1e3 * toBuy - 1).times(cost)
			player.replicanti.amount = player.replicanti.amount.minus(player.replicanti.amount.min(toSpend)).max(1)
			player.blackhole.upgrades.replicanti += toBuy
			player.blackhole.upgrades.total += toBuy
		} else {
			player.replicanti.amount = player.replicanti.amount.minus(cost)
			player.blackhole.upgrades.replicanti++
		}
	}
	if (!bulk) player.blackhole.upgrades.total++
	updateBlackhole()
}

let blackholeDimStartCosts = [null, E('1e4000'), E('1e8000'), E('1e12000'), E('1e20000'), E('1e40000'), E('1e60000'), E('1e75000'), E('1e80000')]
let blackholeDimCostMults = [null, E('1e500'), E('1e1000'), E('1e2000'), E('1e4000'), E('1e5000'), E('1e6000'), E('1e7500'), E('1e8000')]
let blackholeDimPowers = [null, 2, 2, 2, 2, 16, 16, 16, 16]

function buyBlackholeDimension(tier) {
	var dim = player["blackholeDimension" + tier]
	if (!isBHDimUnlocked(tier)) return
	if (player.eternityPoints.lt(dim.cost)) return false

	player.eternityPoints = player.eternityPoints.minus(dim.cost)
	dim.amount = dim.amount.plus(1);
	dim.bought += 1
	dim.cost = E_pow(blackholeDimCostMults[tier], dim.bought).times(blackholeDimStartCosts[tier]);
	dim.power = dim.power.times(blackholeDimPowers[tier])
	updateBlackhole();
	if (tier > 3) giveAchievement("We couldn't afford 5")
	return true
}

function resetBlackhole() {
	player.blackhole.power = E(0);
	el('blackHoleCanvas').getContext('2d').clearRect(0, 0, 400, 400);
	for (var i = 1; i < 5; i++) {
		var dim = player["blackholeDimension" + i]
		dim.amount = E(dim.bought)
	}
}

function buyMaxBlackholeDimensions(){
	for (var i = 1; i < 9; i ++){
		// i is the tier
		if (!isBHDimUnlocked(i)) return
		let e = player.eternityPoints.log10()
		let dim = player["blackholeDimension" + i]
		if (dim.cost.log10() <= e){
			let diff = e - dim.cost.log10()
			let buying = Math.ceil(diff/blackholeDimCostMults[i].log10())
			player.eternityPoints = player.eternityPoints.minus(player.eternityPoints.min(E_pow(blackholeDimCostMults[i], buying - 1).times(dim.cost)))
			dim.amount = dim.amount.plus(buying)
			dim.bought += buying	
			dim.cost = E_pow(blackholeDimCostMults[i], dim.bought).times(blackholeDimStartCosts[i])
			dim.power = dim.power.times(E_pow(blackholeDimPowers[i], buying))
			if (i > 3) giveAchievement("We couldn't afford 5")
		}
	}
}

//v1: ex-dilation part
function canReverseDilation() {
	let req=getExdilationReq()
	return player.eternityPoints.gte(req.ep) && player.dilation.dilatedTime.gte(req.dt)
}

function updateExdilation() {
	el("xdp").style.display = "none"
	el("xdrow").style.display = "none"
	el("exdilationConfirmBtn").style.display = "none"
	if (!mod.ngud || mod.udp) return
	if (player.exdilation.times < 1 && !quantumed) return
	el("xdp").style.display = ""
	el("xdrow").style.display = ""
	el("exdilationConfirmBtn").style.display = "inline"
	el("exDilationAmount").textContent = shortenDimensions(player.exdilation.unspent)
	el("exDilationBenefit").textContent = (aarMod.nguspV ? exDilationBenefit() * 100 : exDilationBenefit() / 0.0075).toFixed(1)
	for (var i = 1; i <= DIL_UPG_SIZES[0]; i++) {
		let unl = isDilUpgUnlocked("r" + i)
		if (unl) {
			el("xd" + i).style.height = aarMod.nguspV ? "60px" : "50px"
			el("xd" + i).className = player.exdilation.unspent.eq(0) ? "dilationupgrebuyablelocked" : "dilationupgrebuyable";
			if (aarMod.nguspV !== undefined) el("xd" + i + "span").textContent = '+' + exDilationUpgradeStrength(i).toFixed(1) + ' free upgrades -> +' + exDilationUpgradeStrength(i,player.exdilation.unspent).toFixed(1)
			else el("xd" + i + "span").textContent = exDilationUpgradeStrength(i).toFixed(2) + 'x -> ' + exDilationUpgradeStrength(i,player.exdilation.unspent).toFixed(2) + 'x'
		}
		el("xd"+i).style.display = unl ? "" : "none"
	}
}

function getExDilationGain() {
	let exp = 2
	if (aarMod.nguspV && !aarMod.nguepV) exp = 0.1
	if (player.dilation.upgrades.includes("ngusp1")) exp *= 2
	if (aarMod.nguspV && !aarMod.nguepV) return player.dilation.dilatedTime.div(1e40).pow(exp).floor()
	return E_pow(Math.max(1, (player.eternityPoints.log10() - 9900) / 100), exp * player.dilation.dilatedTime.log(1e15) - 4).floor();
}

function exDilationBenefit() {
	let ret = player.exdilation.unspent
	if (aarMod.nguspV) {
		ret = ret.add(1).log10()
		if (ret > 1) ret = Math.sqrt(ret)
		return ret
	}
	ret = Math.max(ret.log10()+1,0)/10
	if (ret > .3) {
		ret = .8 - Math.pow(Math.E, 2 * (.3 - ret)) / 2;
	}
	return ret;
}

function exDilationUpgradeStrength(x, add = 0) {
	let ret = Decimal.plus(player.exdilation.spent[x] || 0,add)
	if (aarMod.nguspV) {
		ret = ret.add(1).log10() * 2
		if (ret > 1) ret = Math.sqrt(ret)
		return ret
	}
	ret = Math.max(ret.log10() + 1, 0) / 10
	if (ret > .3) {
		ret = .8 - Math.pow(Math.E, 2 * (.3 - ret)) / 2;
	}
	return 1 + ret / 2;
}

function reverseDilation () {
	if (!canReverseDilation()) return;
	if (player.options.exdilationconfirm) if (!confirm('Reversing dilation will make you lose all your tachyon particles, ' +
							   'dilated time, dilation upgrades, and blackhole power, but you will gain ex-dilation ' +
							   'that makes repeatable upgrades more powerful and reduces the severity of dilation. Are you sure you want to do this?')) return;
	var eterConf = player.options.eternityconfirm
	player.options.eternityconfirm = false
	eternity(true);
	player.options.eternityconfirm = eterConf
	player.exdilation.unspent = player.exdilation.unspent.plus(getExDilationGain());
	player.exdilation.times++;
	player.dilation = {
		studies: player.dilation.studies,
		active: false,
		tachyonParticles: E(0),
		dilatedTime: E(0),
		totalTachyonParticles: E(0),
		bestTP: player.dilation.bestTP,
		bestTPOverGhostifies: player.dilation.bestTPOverGhostifies,
		nextThreshold: E(1000),
		freeGalaxies: 0,
		upgrades: [],
		autoUpgrades: aarMod.nguspV ? player.dilation.autoUpgrades : undefined,
		rebuyables: {
			1: 0,
			2: 0,
			3: 0
		},
	}
	if (mod.ngpp) player.dilation.rebuyables[4] = 0
	resetBlackhole();
	updateDilation();
	updateDilationUpgradeButtons();
	updateDilationUpgradeCosts();
	updateExdilation()
	giveAchievement('Time is absolute')
}

function toggleExdilaConf() {
	player.options.exdilationconfirm = !player.options.exdilationconfirm
	el("exdilationConfirmBtn").textContent = "Reverse dilation confirmation: " + (player.options.exdilationconfirm ? "ON" : "OFF")
}

function boostDilationUpgrade(x) {
	player.exdilation.spent[x] = Decimal.plus(player.exdilation.spent[x] || 0, player.exdilation.unspent).round();
	player.exdilation.unspent = E(0);
	updateDilation();
	updateDilationUpgradeButtons();
	updateExdilation();
	if (x == 2 && aarMod.nguspV) resetDilationGalaxies()
}

//v1.1
function getD18Bonus() {
	let x = player.replicanti.amount.max(1).log10() / 1e3
	if (aarMod.nguspV) return Decimal.max(x / 20 + 1, 1)
	if (x > 100 && mod.udp) x = Math.log(x) * 50 //NGUd'
	return E_pow(1.05, x)
}

function getExdilationReq() {
	if (aarMod.nguspV && !aarMod.nguepV) return {ep: "1e20000", dt: 1e40}
	return {ep: "1e10000", dt: 1e30}
}



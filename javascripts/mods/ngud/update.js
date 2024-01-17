//v1: black hole part
function unlockBlackhole() {
	if (player.eternityPoints.gte('1e4000')) {
		player.blackhole.unl = true
		player.eternityPoints = player.eternityPoints.minus('1e4000')
	}
}

let blackholeDimStartCosts = [null, E('1e4000'), E('1e8000'), E('1e12000'), E('1e20000'), E('1e40000'), E('1e60000'), E('1e75000'), E('1e80000')]
let blackholeDimCostMults = [null, E('1e500'), E('1e1000'), E('1e2000'), E('1e4000'), E('1e5000'), E('1e6000'), E('1e7500'), E('1e8000')]
let blackholeDimPowers = [null, 2, 2, 2, 2, 16, 16, 16, 16]

function buyBlackholeDimension(tier) {
	var dim = player["blackholeDimension" + tier]
	if (!isBHDimUnlocked(tier)) return
	if (player.eternityPoints.lt(dim.cost)) return false

	player.eternityPoints = player.eternityPoints.minus(dim.cost)
	dim.amount = dim.amount.add(1);
	dim.bought += 1
	dim.cost = E_pow(blackholeDimCostMults[tier], dim.bought).mul(blackholeDimStartCosts[tier]);
	dim.power = dim.power.mul(blackholeDimPowers[tier])
	if (tier > 3) giveAchievement("We couldn't afford 5")
	return true
}

function buyMaxBlackholeDimensions() {
	for (var i = 1; i < 9; i ++){
		// i is the tier
		if (!isBHDimUnlocked(i)) return
		let e = player.eternityPoints.log10()
		let dim = player["blackholeDimension" + i]
		if (dim.cost.log10() <= e){
			let diff = e - dim.cost.log10()
			let buying = Math.ceil(diff/blackholeDimCostMults[i].log10())
			player.eternityPoints = player.eternityPoints.minus(player.eternityPoints.min(E_pow(blackholeDimCostMults[i], buying - 1).mul(dim.cost)))
			dim.amount = dim.amount.add(buying)
			dim.bought += buying	
			dim.cost = E_pow(blackholeDimCostMults[i], dim.bought).mul(blackholeDimStartCosts[i])
			dim.power = dim.power.mul(E_pow(blackholeDimPowers[i], buying))
			if (i > 3) giveAchievement("We couldn't afford 5")
		}
	}
}

function getBlackholeDimensionPower(tier) {
	let dim = player["blackholeDimension" + tier];
	let ret = dim.power
	if (aarMod.ngumuV) ret = ret.pow(Math.sqrt(getMPTExp()))
	return dilates(ret.max(1), 1)
}

function getBlackholeDimensionProduction(tier) {
	var dim = player["blackholeDimension" + tier]
	if (player.currentEternityChall == "eterc11") return dim.amount
	var ret = dim.amount.mul(getBlackholeDimensionPower(tier))
	return ret
}

function getBlackholeDimensionRateOfChange(tier) {
	let toGain = getBlackholeDimensionProduction(tier + (inQC(4) ? 2 : 1))
	var current = Decimal.max(player["blackholeDimension" + tier].amount, 1);
	if (aarMod.logRateChange) {
		var change = current.add(toGain.div(10)).log10() - current.log10()
		if (change < 0 || isNaN(change)) change = 0
	} else var change = toGain.mul(10).dividedBy(current);
	return change;
}

function getBlackholeDimensionDescription(tier) {
	if (!isBHDimUnlocked(tier + (inQC(4) ? 2 : 1))) return getFullExpansion(player['blackholeDimension' + tier].bought)
	else return shortenDimensions(player['blackholeDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, getBlackholeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function isBHDimUnlocked(t) {
	return player.blackhole?.unl && !mod.udsp && t <= 4
}

function resetBlackholeDimensions(full) {
	if (!mod.ngud) return

	player.blackhole.power = E(0)
	el('blackHoleCanvas').getContext('2d').clearRect(0, 0, 400, 400)

	for (var i = 1; i <= 8; i++) {
		var dim = player["blackholeDimension" + i]
		if (!dim) continue

		if (full) {
			dim.cost = blackholeDimStartCosts[d]
			dim.bought = E(0)
			dim.power = E(1)
		}
		dim.amount = E(dim.bought)
	}
}

//feeding
let BH_FEED = {
	dilatedTime: { title: "Dilated Time", cost: [pow10(20), 10], res: _ => player.dilation.dilatedTime, sub: x => { player.dilation.dilatedTime = player.dilation.dilatedTime.sub(x) } },
	bankedInfinities: { title: "Banked Infinities", cost: [5e9, 2], res: _ => player.infinitiedBank, sub: x => { player.infinitiedBank = nS(player.infinitiedBank, x) } },
	replicanti: { title: "Replicanti", cost: [pow10(2e4), pow10(1e3)], res: _ => player.replicanti.amount, sub: x => { player.replicanti.amount = player.replicanti.amount.sub(x) } },
}

function feedBlackHoleCost(i) {
	let scale = BH_FEED[i].cost
	let lvl = player.blackhole.upgrades[i]
	if (i == "replicanti" && lvl > 100 && mod.udsp) lvl *= lvl / 100
	return E_pow(scale[1], lvl).mul(scale[0])
}

function canFeedBlackHole(i) {
	return E(BH_FEED[i].res()).gte(feedBlackHoleCost(i))
}

function feedBlackHole(i, bulk) {
	if (!canFeedBlackHole(i)) return

	let data = BH_FEED[i]
	let cost = feedBlackHoleCost(i)
	let scale = data.cost[1]

	let toBuy = bulk ? Math.floor(E(data.res()).div(cost).log(scale) + 1) : 1
	let toSpend = E(scale).pow(toBuy - 1).mul(cost)
	if (i == "replicanti" && bulk) {
		toBuy = 1
		toSpend = cost
	}
	data.sub(toSpend.min(data.res()))

	player.blackhole.upgrades[i] += toBuy
	player.blackhole.upgrades.total += toBuy
}

function getBlackholeUpgradeExponent() {
	let ret = player.blackhole.upgrades.total / 10
	if (ret > 2) ret = (ret - 2) / Math.log2(ret) + 2
	if (ret > 20 && mod.udp) ret = 20 + Math.pow(Math.log10(ret - 19), aarMod.ngumu ? 2.5 : 2) // this should only happen if you are playing NGUd'.
	return ret
}

function getBlackholePowerEffect() {
	return E_pow(Math.max(player.blackhole.power.max(1).log(2), 1), getBlackholeUpgradeExponent())
}

function updateBHFeed() {
	el("blackholeMax").style.display = mod.udp || mod.udsp ? "" : "none"
	el("blackholeAuto").style.display = (mod.udp || mod.udsp) && hasAch("ngpp17") ? "" : "none"
	el('blackholeAuto').textContent = "Auto: O"+(mod.udp&&player.autoEterOptions.blackhole?"N":"FF")
	for (let i of Object.keys(BH_FEED)) {
		el("bh_feed_"+i).innerHTML = (mod.udsp ? "<b>+1 Remnant</b>" : `Feed the Black Hole with ${BH_FEED[i].title}`) + `<br>Cost: ${shortenCosts(feedBlackHoleCost(i))} ${BH_FEED[i].title}`
		el("bh_feed_"+i).className = canFeedBlackHole(i) ? 'eternityupbtn' : 'eternityupbtnlocked'
	}
}

//power
function updateBlackhole() {
	if (hasDilStudy(1)) el("dilationeterupgrow").style.display="table-row"

	let unl = player.blackhole.unl
	el("blackholediv").style.display = unl && !mod.udsp ? "" : "none"
	el("blackholeunlock").style.display = unl ? "none" : ""
	if (!unl) {
		el("blackholeunlock").innerHTML = "Unlock the Black Hole<br>Cost: " + shortenCosts(E('1e4000')) + " EP"
		el("blackholeunlock").className = (player.eternityPoints.gte("1e4000")) ? "storebtn" : "unavailablebtn"
		return
	}

	BH_UDSP.update()
	if (mod.udsp) return

	updateBHFeed()
	drawBlackhole()
	el("blackholePowAmount").innerHTML = shortenMoney(player.blackhole.power);
	if (!mod.udsp) el("blackholePowPerSec").innerHTML = "You are getting " + shortenMoney(getBlackholeDimensionProduction(1)) + " Black Hole power per second.";

	el("DilMultAmount").innerHTML = formatValue(player.options.notation, getBlackholePowerEffect(), 2, 2)
	el("InfAndReplMultAmount").innerHTML = formatValue(player.options.notation, getBlackholePowerEffect().pow(1/3), 2, 2)

	for (let tier = 1; tier <= 8; ++tier) {
		if (isBHDimUnlocked(tier)) {
			el("blackholeRow" + tier).style.display = ""
			el("blackholeD" + tier).textContent = dimNames[tier] + " Black Hole Dimension x" + shortenMoney(getBlackholeDimensionPower(tier));
			el("blackholeAmount" + tier).textContent = getBlackholeDimensionDescription(tier);
			el("blackholeMax" + tier).textContent = "Cost: " + shortenCosts(player["blackholeDimension"+tier].cost) + " EP";
			if (player.eternityPoints.gte(player["blackholeDimension" + tier].cost)) el("blackholeMax"+tier).className = "storebtn"
			else el("blackholeMax"+tier).className = "unavailablebtn"
		} else el("blackholeRow"+tier).style.display="none"
	}
}

function drawBlackhole(ts) {
	if (isTabShown("bh") && isAnimationOn("blackHole")) {
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

function resetBlackhole(full) {
	let oldSave = player.blackhole
	player.blackhole = {
		unl: speedrunMilestones >= 5,
		upgrades: { dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0 },
		power: E(0)
	}
	if (mod.udsp) {
		player.blackhole = deepUndefinedAndDecimal(player.blackhole, BH_UDSP.getSave())
		player.blackhole.weight = oldSave.weight
	}

	el('blackHoleCanvas').getContext('2d').clearRect(0, 0, 400, 400)

	resetBlackholeDimensions(!hasAch("ng3p67") || !mod.udp || aarMod.ngumuV)
}

function setupBlackHole() {
	var html = ""
	for (let d = 1; d <= 8; d++) {
		html += `<tr style="font-size: 17px" id="blackholeRow${d}">
			<td id="blackholeD${d}" width="43%"></td>
			<td id="blackholeAmount${d}"></td>
			<td align="right" width="10%">
				<button id="blackholeMax${d}" style="color:black; width:195px; height:30px" class="storebtn" align="right" onclick="buyBlackholeDimension(${d})"></button>
			</td>
		</tr>`
	}
	el("bhDimTable").innerHTML = html

	var html = ""
	for (let i of Object.keys(BH_FEED)) html += `<td><button id="bh_feed_${i}" class="eternityupbtn" onclick="feedBlackHole('${i}')"></button></td>`
	el("bh_feed_table").innerHTML = html
}

//v1: ex-dilation part
function hasExdilation() {
	return mod.ngud == 1 || mod.ngud == 3
}

function getExdilationReq() {
	if (mod.udsp) return {ep: "1e4500", dt: 1e27}
	return {ep: "1e10000", dt: 1e30}
}

function canReverseDilation() {
	let req = getExdilationReq()
	return player.eternityPoints.gte(req.ep) && player.dilation.dilatedTime.gte(req.dt)
}

function exdilated() {
	return hasExdilation() && (player.exdilation.times || quantumed)
}

function updateExdilation() {
	updateExdilationButton()
	updateExdilationStats()
}

function updateExdilationButton() {
	let has = exdilated() || hasExdilation()
	el("reversedilationdiv").style.display = has ? "" : "none"
	if (!has) return
	if (canReverseDilation()) {
		el("reversedilation").className = "dilationbtn"
		el("reversedilation").innerHTML = "Reverse Dilation." + (exdilated() ? "<br>Gain "+shortenMoney(getExDilationGain()) + " ex-dilation" : "")
	} else {
		let req = getExdilationReq()
		el("reversedilation").className = "eternityupbtnlocked"
		el("reversedilation").textContent = "Get "+(player.eternityPoints.lt(req.ep)?shortenCosts(E(req.ep))+" EP and ":"")+shortenCosts(req.dt)+" Dilated Time to reverse Dilation."
	}
}

function updateExdilationStats() {
	let unl = exdilated()
	el("xdp").style.display = unl ? "" : "none"
	el("xdrow").style.display = unl ? "" : "none"
	if (!unl) return

	el("exDilationAmount").textContent = shortenMoney(player.exdilation.unspent)
	el("exDilationBenefit").textContent = (mod.udsp ? exDilationBenefit() * 100 : exDilationBenefit() / 0.0075).toFixed(1)
	for (var i = 1; i <= 4; i++) {
		let unl = isDilUpgUnlocked("r" + i)
		if (unl) {
			el("xd" + i).style.height = mod.udsp ? "60px" : "50px"
			el("xd" + i).className = player.exdilation.unspent.eq(0) ? "dilationupgrebuyablelocked" : "dilationupgrebuyable";

			if (mod.udsp) el("xd" + i + "span").textContent = shortenMoney(getRebuyableDilUpgScaleStart(i)) + ' → ' + shortenMoney(getRebuyableDilUpgScaleStart(i, player.exdilation.unspent)) + ' scaling start'
			else el("xd" + i + "span").textContent = exDilationUpgradeStrength(i).toFixed(2) + 'x → ' + exDilationUpgradeStrength(i,player.exdilation.unspent).toFixed(2) + 'x'
		}
		el("xd"+i).parentElement.style.display = unl ? "" : "none"
	}
}

function getExDilationGain() {
	if (mod.udsp) {
		let r = player.dilation.dilatedTime.max(1).log10() / 20 + 1
		if (hasBlackHoleEff(2)) r *= getBlackHoleEff(2)
		if (hasBlackHoleEff(5)) r = E_pow(r, getBlackHoleEff(5))
		return r
	} else {
		return E_pow(Math.max(1, (player.eternityPoints.log10() - 9900) / 100), 2 * player.dilation.dilatedTime.log(1e15) - 4).floor();
	}
}

function exDilationBenefit() {
	let ret = player.exdilation.unspent
	if (mod.udsp) return ret.add(1).log10() / 15
	ret = Math.max(ret.log10()+1,0)/10
	if (ret > .3) {
		ret = .8 - Math.pow(Math.E, 2 * (.3 - ret)) / 2;
	}
	return ret;
}

function exDilationUpgradeStrength(x, add = 0) {
	let ret = Decimal.add(player.exdilation.spent[x] || 0, add)
	if (!mod.udsp) {
		ret = Math.max(ret.log10() + 1, 0) / 10
		if (ret > .3) ret = .8 - Math.pow(Math.E, 2 * (.3 - ret)) / 2
		ret = 1 + ret / 2
	} else {
		ret = ret.add(1)
		if (hasBlackHoleEff(5)) ret = ret.mul(getBlackHoleEff(5))
		ret = ret.pow(5)
	}

	return ret
}

function reverseDilation() {
	if (!canReverseDilation()) return;
	if (player.options.exdilationconfirm && !confirm(`Reversing Dilation resets Time Dilation and Black Hole Power in exchange for ex-dilation, which reduces dilation penalty and strengthens repeatable upgrades. Are you sure?`)) return

	player.exdilation.unspent = player.exdilation.unspent.add(getExDilationGain())
	player.exdilation.times++

	resetDilation()
	if (!mod.udsp) resetBlackholeDimensions()
	eternity(true)

	giveAchievement('Time is absolute')
}

function toggleExdilaConf() {
	player.options.exdilationconfirm = !player.options.exdilationconfirm
	el("exdilationConfirmBtn").textContent = "Reverse Dilation confirmation: " + (player.options.exdilationconfirm ? "ON" : "OFF")
}

function boostDilationUpgrade(x) {
	player.exdilation.spent[x] = Decimal.add(player.exdilation.spent[x] || 0, player.exdilation.unspent).round();
	player.exdilation.unspent = E(0);
}

//v1.1
function getD18Bonus() {
	let x = player.replicanti.amount.max(1).log10() / 1e3
	if (mod.udsp) return Decimal.max(x / 20 + 1, 1)
	if (x > 100 && mod.udp) x = Math.log(x) * 50 //NGUd'
	return E_pow(1.05, x)
}

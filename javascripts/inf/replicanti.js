function unlockReplicantis() {
	if (player.infinityPoints.gte(inOnlyNGM(2)?1e80:1e140)) {
		player.replicanti.unl = true
		player.replicanti.amount = E(1)
		player.infinityPoints = player.infinityPoints.minus(inOnlyNGM(2) ? 1e80 : 1e140)
	}
}

function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk = !player.galaxyMaxBulk
	el('replicantibulkmodetoggle').textContent = "Mode: " + (player.galaxyMaxBulk ? "Max" : "Singles")
}

function getReplMult(next) {
	let exp = 2
	if (inNGM(2)) exp = Math.max(2, Math.pow(player.galaxies, .4))
	if (mod.rs) {
		exp += (player.timestudy.ers_studies[3] + (next ? 1 : 0)) / 2
		if (hasAch('r108')) exp *= 1.09;
	}
	let replmult = Decimal.max(player.replicanti.amount.log(2), 1).pow(exp)
	if (hasTimeStudy(21)) replmult = replmult.add(E_pow(player.replicanti.amount, 0.032))
	if (hasTimeStudy(102)) {
		let gal = player.replicanti.galaxies
		if (hasBLMilestone(17)) gal *= blEff(17)
		replmult = replmult.mul(E_pow(5, gal))
	}
	return replmult;
}

function upgradeReplicantiChance() {
	if (player.infinityPoints.gte(player.replicanti.chanceCost) && isChanceAffordable() && player.eterc8repl > 0) {
		if (player.infinityPoints.lt(pow10(1e9))) player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
		player.replicanti.chance = Math.round(player.replicanti.chance * 100 + 1) / 100
		if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
		el("eterc8repl").textContent = "You have " + player.eterc8repl + " purchases left."
		player.replicanti.chanceCost = player.replicanti.chanceCost.mul(1e15)
	}
}

function isChanceAffordable() {
	return player.replicanti.chance < 1 || hasMasteryStudy("t265")
}

function upgradeReplicantiInterval() {
	if (!(player.infinityPoints.gte(player.replicanti.intervalCost) && isIntervalAffordable() && player.eterc8repl !== 0)) return 
	if (player.infinityPoints.lt(pow10(1e9))) player.infinityPoints = player.infinityPoints.minus(player.replicanti.intervalCost)

	//Reduce
	if (E(player.replicanti.interval).gte(1)) player.replicanti.interval *= 0.9
	else player.replicanti.interval = E(player.replicanti.interval).mul(0.9)

	//Change Cost
	if (E(player.replicanti.interval).lt(1)) {
		let cost = E(1).div(player.replicanti.interval)
		if (cost.gt(1e10)) cost = cost.div(1e5).pow(2)
		if (hasNU(13)) cost = pow10(800 * Math.pow(cost.log10() * 50 + 1, 4))
		else cost = pow10(800 * cost.toNumber())
		player.replicanti.intervalCost = cost
	} else player.replicanti.intervalCost = player.replicanti.intervalCost.mul(1e10)

	if (!isIntervalAffordable()) player.replicanti.interval = (hasTimeStudy(22) || mod.rs ? 1 : 50)
	if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
	el("eterc8repl").textContent = "You have " + player.eterc8repl + " purchases left."
}

function getReplicantiLimit() {
	if (mod.rs) return player.replicanti.limit
	return Number.MAX_VALUE
}

function isIntervalAffordable() {
	if (hasMasteryStudy("t271")) return true
	return player.replicanti.interval > (hasTimeStudy(22) || mod.rs ? 1 : 50)
}

function getRGCost(offset = 0, costChange) {
	let ret = player.replicanti.galCost
	if (offset > 0) {
		if (inQC(5)) return player.replicanti.galCost.pow(Math.pow(1.2, offset))
		else {
			let increase = 0
			if (player.currentEternityChall == "eterc6") increase = offset * ((offset + player.replicanti.gal * 2) + 3)
			else increase = offset * (2.5 * (offset + player.replicanti.gal * 2) + 22.5)
			if (player.replicanti.gal + offset > 99) increase += (offset - Math.max(99 - player.replicanti.gal, 0)) * (25 * (offset - Math.max(99 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 99) * 2) - 4725)
			if (player.replicanti.gal + offset > 399) {
				if (mod.ngud) for (var g = Math.max(player.replicanti.gal, 399); g < player.replicanti.gal + offset; g++) increase += Math.pow(g - 389, 2)
				if (mod.ngpp) {
					var isReduced = hasMasteryStudy("t266")
					if (isReduced) {
						increase += (offset - Math.max(399 - player.replicanti.gal, 0)) * (1500 * (offset - Math.max(399 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 399) * 2) - 1183500)
						if (player.replicanti.gal + offset > 2998) increase += (offset - Math.max(2998 - player.replicanti.gal, 0)) * (5e3 * (offset - Math.max(2998 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 2998) * 2) - 29935e3)
						if (player.replicanti.gal + offset > 5e4) increase += (Math.pow(Math.max(offset + player.replicanti.gal - 5e4, 0), 4) - Math.pow(Math.max(player.replicanti.gal - 5e4, 0), 4))
					} else for (var g = Math.max(player.replicanti.gal, 399); g < player.replicanti.gal + offset; g++) increase += 5 * Math.floor(Math.pow(1.2, g - 394))
				}
			}
			ret = ret.mul(pow10(increase))
		}
	}
	if (hasTimeStudy(233) && !costChange) ret = ret.dividedBy(player.replicanti.amount.pow(0.3))
	return ret
}

function upgradeReplicantiGalaxy() {
	var cost = getRGCost()
	if (player.infinityPoints.gte(cost) && player.eterc8repl !== 0) {
		if (player.infinityPoints.lt(pow10(1e9))) player.infinityPoints = player.infinityPoints.minus(cost)
		player.replicanti.galCost = getRGCost(1)
		player.replicanti.gal += 1
		if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
		el("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
		return true
	}
	return false
}

function replicantiGalaxy() {
	if (!canGetReplicatedGalaxy()) return
	player.replicanti.galaxies = player.galaxyMaxBulk ? getMaxRG() : player.replicanti.galaxies + 1

	if (!hasAch("ng3p67")) player.replicanti.amount=Decimal.div(hasAch("r126")?player.replicanti.amount:1,Number.MAX_VALUE).max(1)
	galaxyReset(0)
}

function canGetReplicatedGalaxy() {
	return player.replicanti.galaxies < getMaxRG() && player.replicanti.amount.gte(getReplicantiLimit())
}

function canAutoReplicatedGalaxy() {
	return getEternitied() >= 3 && (!hasTimeStudy(131) || mod.ngp3 && hasAch("ngpp16"))
}

function getMaxRG() {
	let ret = player.replicanti.gal
	if (hasTimeStudy(131)) ret += Math.floor(ret * 0.5)
	return ret
}

function autoBuyRG() {
	if (!player.infinityPoints.gte(getRGCost())) return
	let increment = 1
	while (player.infinityPoints.gte(getRGCost(increment - 1))) increment *= 2
	let toBuy = 0
	while (increment >= 1) {
		if (player.infinityPoints.gte(getRGCost(toBuy + increment - 1))) toBuy += increment
		increment /= 2
	}
	let newIP = player.infinityPoints
	let cost = getRGCost(toBuy - 1)
	let toBuy2 = toBuy
	while (toBuy > 0 && newIP.div(cost).lt(1e16)) {
		if (player.infinityPoints.lt(pow10(1e9))) {
			if (newIP.gte(cost)) newIP = newIP.sub(cost)
			else {
				newIP = player.infinityPoints.sub(cost)
				toBuy2--
			}
		}
		toBuy--
		cost = getRGCost(toBuy - 1)
	}
	player.replicanti.infinityPoints = newIP
	player.replicanti.galCost = getRGCost(toBuy2, true)
	player.replicanti.gal += toBuy2
}

function updateExtraReplGalaxies() {
	tmp.rep.extraBase = getExtraReplGalaxyBase()
	tmp.rep.extraMult = getExtraReplGalaxyMult()
	tmp.rep.extra = tmp.rep.extraBase * tmp.rep.extraMult
}

function getExtraReplGalaxyBase() {
	let ss_speed = tmp.qu.chal.reward[8] * 2
	let ts225Eff = 0
	let ts226Eff = 0
	if (hasTimeStudy(225)) {
		ts225Eff = Math.floor(player.replicanti.amount.e / 1e3)
		if (ts225Eff >= 100 && mod.ngp3) ts225Eff = Math.floor(Math.sqrt(0.25 + (ts225Eff - 99) * ss_speed) + 98.5)
	}
	if (hasTimeStudy(226)) {
		ts226Eff = Math.floor(player.replicanti.gal / 15)
		if (ts226Eff >= 100 && mod.ngp3) ts226Eff = Math.floor(Math.sqrt(0.25 + (ts226Eff - 99) * ss_speed) + 98.5)
	}

	let amt = ts225Eff + ts226Eff
	if (mod.ngp3) {
		if (amt > 325) amt = (Math.sqrt(0.9216+0.16*(amt-324))-0.96)/0.08+324
		if (amt > 700) amt = 700
	}
	return amt
}

function getExtraReplGalaxyMult() {
	let mult = 1
	if (quantumed) mult = tmp.qu.color_eff.g
	if (hasMasteryStudy("d10")) mult += tmp.qu.ant.preon_eff
	return mult
}

function getExtraReplGalaxyDisp() {
	if (shiftDown) {
		if (tmp.rep.extraBase == 0 && tmp.rep.extraMult == 1) return ""
		let r = " + " + getFullExpansion(tmp.rep.extraBase)
		if (tmp.rep.extraMult > 1) r += "*" + shorten(tmp.rep.extraMult)
		return r
	} else {
		if (tmp.rep.extra == 0) return ""
		return " + " + getFullExpansion(tmp.rep.extra)
	}
}

function getTotalRG() {
	return player.replicanti.galaxies + tmp.rep.extra
}

function getReplGalPower() {
	let extra = 0
	if (player.timestudy.studies.includes(133)) extra += player.replicanti.galaxies * 0.5
	if (player.timestudy.studies.includes(132)) extra += player.replicanti.galaxies * 0.4
	extra += tmp.rep.extra // extraReplGalaxies is a constant

	let str = tmp.rep.gal_str, r = player.replicanti.galaxies
	if (hasMasteryStudy("t342")) r = (r + extra) * str
	else r += Math.min(player.replicanti.galaxies, player.replicanti.gal) * (str - 1) + extra
	return r
}

function getReplGalEff() {
	let r = 1
	if (mod.rs) r = Math.log10(player.replicanti.limit.log(2)) / Math.log10(2)/10
	else if (ECComps("eterc8") > 0) r = getECReward(8)
	if (hasMasteryStudy("t344")) r *= getMTSMult(344)
	return r
}

function replicantiGalaxyAutoToggle() {
	player.replicanti.galaxybuyer = !player.replicanti.galaxybuyer
}

function getReplSpeed() {
	let inc = .2
	let exp = 308
	if (player.dilation.upgrades.includes('ngpp1')) {
		let expDiv = 10
		if (mod.ngp3) expDiv = 9
		if (mod.udsp) expDiv = 20
		if (hasBlackHoleEff(0)) expDiv /= getBlackHoleEff(0)
		let x = 1 + player.dilation.dilatedTime.max(1).log10() / expDiv
		inc /= Math.min(x, 200)
		if (x > 200) exp += x / 10 - 20
	}
	inc = inc + 1
	if (hasGluonUpg("gb", 2)) exp *= 2
	exp *= lightEff(4)
	return {inc: inc, exp: exp}
}

function getReplicantiInterval() {
	let interval = 1
	if (hasTimeStudy(62)) interval /= tsMults[62]()
	if (player.replicanti.amount.gt(Number.MAX_VALUE)||hasTimeStudy(133)) interval *= 10
	if (hasTimeStudy(213)) interval /= tsMults[213]()
	if (hasGluonUpg("gb", 1)) interval /= gluonEff("gb", 1)
	if (player.replicanti.amount.lt(Number.MAX_VALUE) && hasAch("r134")) interval /= 2
	if (isBigRipUpgradeActive(4)) interval /= 10

	interval = E(interval).mul(player.replicanti.interval)
	if (mod.ngud && !mod.udsp) interval = interval.div(getBlackholePowerEffect().pow(1/3))
	if (hasMasteryStudy("t332")) interval = interval.div(getMTSMult(332))
	return interval
}

function getReplicantiFinalInterval() {
	let speed = tmp.rep.speeds
	let x = tmp.rep.interval.div(tmp.rep.dupRate)

	if (hasTimeStudy(192) && hasNU(13)) {
		tmp.rep.warp = E(1000).div(x).max(10).log10() / 2
		speed.exp *= tmp.rep.warp

		tmp.rep.warp_lim = E(100).pow(speed.exp / Math.log10(speed.inc))
		x = 1 / speed.exp
		if (player.replicanti.amount.gt(tmp.rep.warp_lim)) x *= 10
	}

	if (player.replicanti.amount.gt(Number.MAX_VALUE)) x = mod.rs ? Math.pow(hasAch("r107") ? Math.max(player.replicanti.amount.log(2)/1024,1) : 1, -.25) * x.toNumber() : E_pow(speed.inc, Math.max(player.replicanti.amount.log10() / speed.exp - 1, 0)).mul(x)

	return x
}

function runRandomReplicanti(chance){
	if (Decimal.gte(chance, 1)) {
		player.replicanti.amount = player.replicanti.amount.mul(2)
		return
	}
	var temp = player.replicanti.amount
	if (typeof(chance) == "object") chance = chance.toNumber()
	for (var i = 0; temp.gt(i); i++) {
		if (chance > Math.random()) player.replicanti.amount = player.replicanti.amount.add(1)
		if (i >= 99) return
	}
}

function notContinuousReplicantiUpdating() {
	var chance = tmp.rep.chance
	var interval = Decimal.div(tmp.rep.interval, 100)
	if (typeof(chance) !== "number") chance = chance.toNumber()

	if (interval <= replicantiTicks && player.replicanti.unl) {
		if (player.replicanti.amount.lte(100)) runRandomReplicanti(chance) //chance should be a decimal
		else if (player.replicanti.amount.lt(getReplicantiLimit())) {
			var temp = Decimal.round(player.replicanti.amount.dividedBy(100))
			if (chance < 1) {
				let counter = 0
				for (var i=0; i<100; i++) if (chance > Math.random()) counter++;
				player.replicanti.amount = temp.mul(counter).add(player.replicanti.amount)
				counter = 0
			} else player.replicanti.amount = player.replicanti.amount.mul(2)
			if (!hasTimeStudy(192)) player.replicanti.amount = player.replicanti.amount.min(getReplicantiLimit())
		}
		replicantiTicks -= interval
	}
}

function continuousReplicantiUpdating(diff){
	if (hasTimeStudy(192) && tmp.rep.est.toNumber() > 0 && tmp.rep.est.toNumber() < 1/0) player.replicanti.amount = E_pow(Math.E, tmp.rep.ln +Math.log((diff*tmp.rep.est/10) * (Math.log10(tmp.rep.speeds.inc)/tmp.rep.speeds.exp)+1) / (Math.log10(tmp.rep.speeds.inc)/tmp.rep.speeds.exp))
	else if (hasTimeStudy(192)) player.replicanti.amount = E_pow(Math.E, tmp.rep.ln + tmp.rep.est.mul(diff * Math.log10(tmp.rep.speeds.inc) / tmp.rep.speeds.exp / 10).add(1).log(Math.E) / (Math.log10(tmp.rep.speeds.inc)/tmp.rep.speeds.exp))
	else player.replicanti.amount = E_pow(Math.E, tmp.rep.ln +(diff*tmp.rep.est/10)).min(getReplicantiLimit())
	replicantiTicks = 0
}

function toggleReplAuto(i) {
	player.replicanti.auto[i] = !player.replicanti.auto[i]
}
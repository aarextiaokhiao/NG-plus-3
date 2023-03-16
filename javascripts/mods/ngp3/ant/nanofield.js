let NF = {
	unl() {
		return hasMasteryStudy("d12")
	},
}

function updateNanoverseTab() {
	var amt = nfSave.rewards
	el("quarksNanofield").textContent = shortenDimensions(quSave.replicants.quarks)		
	el("quarkCharge").textContent = shortenMoney(nfSave.charge)
	el("quarkChargeRate").textContent = shortenDimensions(getQuarkChargeProduction())
	el("quarkLoss").textContent = shortenDimensions(getQuarkLossProduction())
	el("preonEnergy").textContent = shortenMoney(nfSave.energy)
	el("quarkEnergyRate").textContent = shortenMoney(getQuarkEnergyProduction())
	el("quarkPower").textContent = getFullExpansion(nfSave.power)
	el("quarkPowerThreshold").textContent = shortenMoney(nfSave.powerThreshold)
	el("quarkAntienergy").textContent = shortenMoney(nfSave.antienergy)
	el("quarkAntienergyRate").textContent = shortenMoney(getQuarkAntienergyProduction())
	el("quarkChargeProductionCap").textContent = shortenMoney(getQuarkChargeProductionCap())
	el("rewards").textContent = getFullExpansion(amt)
	el("produceQuarkCharge").innerHTML = (nfSave.producingCharge ? "Stop" : "Start") + " production of nanocharge." + (nfSave.producingCharge ? "" : "<br>(You won't gain pilons on production)")

	for (var reward = 1; reward < 9; reward++) {
		el("nfReward" + reward).className = reward > amt ? "nfRewardlocked" : "nfReward"
		el("nfReward" + reward).textContent = wordizeList(tmp.nf.reward[reward].map(x => nanoRewards.effDisp[x](tmp.nf.eff[x])), true) + "."
		el("nfRewardHeader" + reward).innerHTML = "<u>" + (amt % 8 + 1 == reward ? "Next" : dimNames[reward]) + " Nanobenefit</u>"
		el("nfRewardHeader" + reward).className = (amt % 8 + 1 == reward ? "grey" : "") + " milestoneTextSmall"
		el("nfRewardTier" + reward).textContent = "Tier " + getFullExpansion(Math.ceil((amt + 1 - reward) / 8)) + " / Power: " + tmp.nf.power[reward].toFixed(1)
	}
}


function getQuarkChargeProduction() {
	let ret = E(1)
	if (hasNanoReward("preon_charge")) ret = ret.mul(tmp.nf.eff.preon_charge)
	if (hasMasteryStudy("t421")) ret = ret.mul(getMTSMult(421))
	if (hasNU(3)) ret = ret.mul(NT.eff("upg", 3))
	if (hasNU(7)) ret = ret.mul(NT.eff("upg", 7))
	ret = ret.pow(PHOTON.eff(6))
	return ret
}

function startProduceQuarkCharge() {
	nfSave.producingCharge = !nfSave.producingCharge
}

function getQuarkLossProduction() {
	let ret = getQuarkChargeProduction(true)
	ret = ret.pow(2).mul(4e25)
	if (hasNU(3)) ret = ret.div(10)
	return ret
}

function getQuarkEnergyProduction() {
	let ret = nfSave.charge.mul(5).sqrt()
	if (hasNanoReward("preon_energy")) ret = ret.mul(tmp.nf.eff.preon_energy)
	if (hasMasteryStudy("t411")) ret = ret.mul(getMTSMult(411))
	return ret
}

function getQuarkAntienergyProduction() {
	let ret = nfSave.charge.sqrt()
	if (hasMasteryStudy("t401")) ret = ret.div(getMTSMult(401))
	return ret
}

function getQuarkChargeProductionCap() {
	return nfSave.charge.mul(2500).sqrt()
}

var nanoRewards = {
	eff: {
		hatch_speed: function(x) {
			return E_pow(30, x)
		},
		ma_effect_exp: function(x) {
			return x * 6.8
		},
		dil_gal_gain: function(x) {
			return x / 1e3 + 1
		},
		dt_to_ma_exp: function(x) {
			return Math.sqrt(x) * 0.021 + 1
		},
		dil_effect_exp: function(x) {
			return Math.min(x * 0.36 + 1, 2)
		},
		meta_boost_power: function(x) {
			let y = 2
			if (player.dilation.upgrades.includes("ngpp4")) y = getDil15Bonus()
			return x * 1.34 + y
		},
		remote_start: function(x) {
			return x * 2150
		},
		preon_charge: function(x) {
			return pow2(x * 2)
		},
		per_10_power: function(x) {
			return x * 0.76
		},
		preon_energy: function(x) {
			return pow2(x)
		},
		photon: function(x) {
			return Math.pow(x / 5 + 1, 3)
		},
		light_threshold_speed: function(x) {
			return Math.max(Math.sqrt(x + 1) / 4, 1)
		}
	},
	effDisp: {
		hatch_speed: function(x) {
			return "eggons hatch " + shorten(x) + "x faster"
		},
		ma_effect_exp: function(x) {
			return "meta-antimatter effect is ^" + x.toFixed(2)
		},
		dil_gal_gain: function(x) {
			return "each replicated galaxy gives " + x.toFixed(3) + "x more dilated time"
		},
		dt_to_ma_exp: function(x) {
			return "dilated time gives ^" + x.toFixed(3) + " boost to Meta Dimensions"
		},
		dil_effect_exp: function(x) {
			return "in dilation, raise Normal Dimension multipliers and Tickspeed by ^" + x.toFixed(2)
		},
		meta_boost_power: function(x) {
			return "Meta-Dimension Boost gives a " + x.toFixed(2) + "x boost"
		},
		remote_start: function(x) {
			return "Remote Antimatter Galaxies scale " + getFullExpansion(Math.floor(x)) + " later"
		},
		preon_charge: function(x) {
			return "produce nanocharge " + shorten(x) + "x faster"
		},
		per_10_power: function(x) {
			return "before Electrons, add " + shorten(x) + "x to multiplier per ten Dimensions"
		},
		preon_energy: function(x) {
			return "produce nanoenergy " + shorten(x) + "x faster"
		},
		photon: function(x) {
			return "gain " + shorten(x) + "x more Photons"
		}	
	},
	usage: {
		1: _ => hasNU(16) ? ["photon"] : ["hatch_speed"],
		2: _ => ["ma_effect_exp"],
		3: _ => ["dil_gal_gain"],
		4: _ => ["dt_to_ma_exp"],
		5: _ => ["dil_effect_exp"],
		6: _ => ["meta_boost_power"],
		7: _ => hasNU(6) ? ["preon_charge"] : ["remote_start", "preon_charge"],
		8: _ => ["per_10_power", "preon_energy"],
	},
}

function hasNanoReward(x) {
	return tmp.nf?.eff?.[x] ?? false
}

function getNanoRewardPower(reward, rewards) {
	let x = Math.ceil((rewards - reward + 1) / 8)
	return x * tmp.nf.str
}

function getNanoRewardPowerEff() {
	let x = 1
	if (hasBU(31)) x *= tmp.blu[31]
	return x
}

function getNanoRewardReq(additional){
	return getNanoRewardReqFixed(additional - 1 + nfSave.power)
}

function getActiveNanoScalings(){
	ret = [true, true]
	//there are two total scalings and they all start active
	return ret
}

function getNanoScalingsStart(){
	ret = [0, 15]
	return ret
}

function getNanoRewardReqFixed(n){
	let x = E(50)
	let a = getActiveNanoScalings()
	let s = getNanoScalingsStart()
	if (n >= s[0] && a[0]) x = x.mul(E_pow(4.0, (n - s[0])))
	if (n >= s[1] && a[1]) x = x.mul(E_pow(2.0, (n - s[1]) * (n - s[1] + 3)))
	return x.pow(getNanoRewardThresholdExp())
}

function getNanoRewardThresholdExp() {
	let x = 1
	if (hasAch("ng3p113")) x /= 2
	return x
}

function updateNextPreonEnergyThreshold(){
	let en = nfSave.energy
	let increment = 0.5
	let toSkip = 0
	var check = 0
	while (en.gte(getNanoRewardReq(increment * 2))) increment *= 2
	while (increment >= 1) {
		check = toSkip + increment
		if (en.gte(getNanoRewardReq(check))) toSkip += increment
		increment /= 2
	}
	nfSave.power += toSkip
	nfSave.powerThreshold = getNanoRewardReq(1)
}

function updateNanoEffectUsages() {
	let data = {}
	tmp.nf.reward = data
	for (let x = 1; x <= 8; x++) data[x] = nanoRewards.usage[x]()
}

function updateNanoRewardPowers() {
	let data = {}
	tmp.nf.power = data
	for (let x = 1; x <= 8; x++) data[x] = getNanoRewardPower(x, tmp.nf.rewards)
}

function updateNanoRewardEffects() {
	let data = {}
	tmp.nf.eff = data

	for (let x = 1; x <= 8; x++) {
		let pow = tmp.nf.power[x]
		for (let r of tmp.nf.reward[x]) data[r] = nanoRewards.eff[r](pow)
	}
}

function resetNanoRewardEffects() {
	updateNanoEffectUsages()
	updateNanoRewardEffects()
}

function setupNanoRewardTemp() {
	tmp.nf = {}
	if (!hasMasteryStudy("d11")) return

	updateNanoEffectUsages()
}

function updateNanofieldTemp() {
	if (!NF.unl()) return
	if (!tmp.nf) setupNanoRewardTemp()
	var x = getNanoRewardPowerEff()
	var y = nfSave.rewards
	if (tmp.nf.str !== x || tmp.nf.rewards !== y) {
		tmp.nf.str = x
		tmp.nf.rewards = y

		updateNanoRewardPowers()
		updateNanoRewardEffects()
	}
}

//HTML
function setupNanofieldHTML() {
	var nfRewards = el("nfRewards")
	var row = 0
	for (var r = 1; r <= 5; r += 4) {
		nfRewards.insertRow(row).innerHTML = 
			"<td id='nfRewardHeader" + r + "' class='milestoneText'></td>" +
			"<td id='nfRewardHeader" + (r + 1) + "' class='milestoneText'></td>"+
			"<td id='nfRewardHeader" + (r + 2) + "' class='milestoneText'></td>"+
			"<td id='nfRewardHeader" + (r + 3) + "' class='milestoneText'></td>"
		row++
		nfRewards.insertRow(row).innerHTML = 
			"<td id='nfRewardTier" + r + "' class='milestoneTextSmall'></td>" +
			"<td id='nfRewardTier" + (r + 1) + "' class='milestoneTextSmall'></td>"+
			"<td id='nfRewardTier" + (r + 2) + "' class='milestoneTextSmall'></td>"+
			"<td id='nfRewardTier" + (r + 3) + "' class='milestoneTextSmall'></td>"
		row++
		nfRewards.insertRow(row).innerHTML = 
			"<td><button class='nfRewardlocked' id='nfReward" + r + "'></button></td>" +
			"<td><button class='nfRewardlocked' id='nfReward" + (r + 1) + "'></button></td>"+
			"<td><button class='nfRewardlocked' id='nfReward" + (r + 2) + "'></button></td>"+
			"<td><button class='nfRewardlocked' id='nfReward" + (r + 3) + "'></button></td>"
		row++
	}
	el("nfReward7").style["font-size"] = "10px"
	el("nfReward8").style["font-size"] = "10px"
}

function nanofieldUpdating(diff){
	var AErate = getQuarkAntienergyProduction()
	var toAddAE = AErate.mul(diff).min(getQuarkChargeProductionCap().sub(nfSave.antienergy))
	if (nfSave.producingCharge) nanofieldProducingChargeUpdating(diff)
	if (toAddAE.gt(0)) {
		nfSave.antienergy = nfSave.antienergy.add(toAddAE).min(getQuarkChargeProductionCap())
		nfSave.energy = nfSave.energy.add(toAddAE.div(AErate).mul(getQuarkEnergyProduction()))

		updateNextPreonEnergyThreshold()
		if (nfSave.power > nfSave.rewards) nfSave.rewards = nfSave.power
	}
}

function nanofieldProducingChargeUpdating(diff){
	var rate = getQuarkChargeProduction()
	var loss = getQuarkLossProduction()
	var toSub = loss.mul(diff).min(quSave.replicants.quarks)
	if (toSub.eq(0)) nfSave.producingCharge = false
	else {
		let chGain = toSub.div(loss).mul(rate)
		if (!hasAch("ng3p71")) quSave.replicants.quarks = quSave.replicants.quarks.sub(toSub)
		nfSave.charge = nfSave.charge.add(chGain)
	}
}
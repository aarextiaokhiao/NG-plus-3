let NF = {
	unl() {
		return hasMasteryStudy("d12")
	},
}

function updateNanoverseTab() {
	el("quarksNanofield").textContent = shortenDimensions(quSave.replicants.quarks)		
	el("preonEnergy").textContent = shortenMoney(nfSave.energy)
	el("quarkEnergyRate").textContent = shortenMoney(getQuarkEnergyProduction())

	let noCharge = hasBLMilestone(3)
	el("quarkChargeDiv").style.display = noCharge ? "none" : ""
	el("quarkAntienergyDiv").style.display = noCharge ? "none" : ""
	if (!noCharge) {
		el("quarkCharge").textContent = shortenMoney(nfSave.charge)
		el("quarkChargeRate").textContent = shortenDimensions(getQuarkChargeProduction())
		el("quarkLoss").textContent = shortenDimensions(getQuarkLossProduction())
		el("quarkAntienergy").textContent = shortenMoney(nfSave.antienergy)
		el("quarkAntienergyRate").textContent = shortenMoney(getQuarkAntienergyProduction())
		el("quarkChargeProductionCap").textContent = shortenMoney(getQuarkChargeProductionCap())
	}

	el("produceQuarkCharge").innerHTML = (nfSave.producingCharge ? "Stop" : "Start") + " production of nanocharge." + (nfSave.producingCharge ? "" : "<br>(You won't gain pilons on production)")
	el("produceQuarkCharge").className = "antbtn " + (nfSave.producingCharge ? "hover" : "")

	var amt = nfSave.rewards
	el("nanorewards").textContent = getFullExpansion(amt)
	el("nanorewardThreshold").textContent = shortenMoney(getNanoRewardReq(1))

	for (var reward = 1; reward < 9; reward++) {
		el("nfReward" + reward).className = reward > amt ? "nfRewardlocked" : "nfReward"
		el("nfReward" + reward).textContent = wordizeList(tmp.qu.nf.reward[reward].map(x => nanoRewards.effDisp[x](tmp.qu.nf.eff[x])), true) + "."
		el("nfRewardHeader" + reward).innerHTML = "<u>" + (amt % 8 + 1 == reward ? "Next" : dimNames[reward]) + " Nanobenefit</u>"
		el("nfRewardHeader" + reward).className = (amt % 8 + 1 == reward ? "grey" : "") + " milestoneTextSmall"
		el("nfRewardTier" + reward).textContent = "Tier " + getFullExpansion(Math.ceil((amt + 1 - reward) / 8)) + " / Power: " + tmp.qu.nf.power[reward].toFixed(1)
	}
}


function getQuarkChargeProduction() {
	let ret = E(1)
	if (hasNanoReward("pilon_charge")) ret = ret.mul(tmp.qu.nf.eff.pilon_charge)
	if (hasMasteryStudy("t421")) ret = ret.mul(getMTSMult(421))
	if (hasNU(3)) ret = ret.mul(NT.eff("upg", 3))
	if (hasNU(7)) ret = ret.mul(NT.eff("upg", 7))
	return ret
}

function startProduceQuarkCharge() {
	nfSave.producingCharge = !nfSave.producingCharge
}

function getQuarkLossProduction() {
	let ret = getQuarkChargeProduction()
	ret = ret.pow(2).mul(4e25)
	if (hasNU(3)) ret = ret.div(10)
	return ret
}

function getQuarkEnergyProduction() {
	let ret = hasBLMilestone(3) ? getQuarkChargeProduction() : nfSave.charge
	ret = ret.mul(5).sqrt()
	if (hasNanoReward("pilon_energy")) ret = ret.mul(tmp.qu.nf.eff.pilon_energy)
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
		ma_eff_exp: function(x) {
			return x * 6.8
		},
		dil_gal_gain: function(x) {
			return x / 1e3 + 1
		},
		dt_to_ma_exp: function(x) {
			return Math.sqrt(x) * 0.021 + 1
		},
		dil_exp: function(x) {
			return Math.min(x * 0.36 + 1, 2)
		},
		md_boost: function(x) {
			let y = 2
			if (player.dilation.upgrades.includes("ngpp4")) y = getDil15Bonus()
			return x * 1.34 + y
		},
		remote_start: function(x) {
			return x * 2150
		},
		pilon_charge: function(x) {
			return pow2(x * (hasNU(16) ? 4 : 2))
		},
		per_10_power: function(x) {
			return x * 0.76
		},
		pilon_energy: function(x) {
			return pow2(x)
		},
		decay_exp: function(x) {
			return Math.min(Math.log10(Math.max(x + 8, 10)), 2)
		},
		photon: function(x) {
			return Math.pow(x + 1, 1.5)
		}
	},
	effDisp: {
		hatch_speed: function(x) {
			return "eggons hatch " + shorten(x) + "x faster"
		},
		ma_eff_exp: function(x) {
			return "meta-antimatter effect is ^" + x.toFixed(2)
		},
		dil_gal_gain: function(x) {
			return "each Replicated Galaxy gives " + x.toFixed(3) + "x more dilated time"
		},
		dt_to_ma_exp: function(x) {
			return "dilated time gives ^" + x.toFixed(3) + " boost to Meta Dimensions"
		},
		dil_exp: function(x) {
			return "in dilation, raise Normal Dimension multipliers and Tickspeed by ^" + x.toFixed(2)
		},
		md_boost: function(x) {
			return "Meta-Dimension Boost gives a " + x.toFixed(2) + "x boost"
		},
		remote_start: function(x) {
			return "Remote Antimatter Galaxies scale " + getFullExpansion(Math.floor(x)) + " later"
		},
		pilon_charge: function(x) {
			return "produce nanocharge " + shorten(x) + "x faster"
		},
		per_10_power: function(x) {
			return "before Positrons, add " + shorten(x) + "x to multiplier per ten Dimensions"
		},
		pilon_energy: function(x) {
			return "produce nanoenergy " + shorten(x) + "x faster"
		},
		decay_exp: function(x) {
			return "raise Decay speed by ^" + shorten(x)
		},
		photon: function(x) {
			return "gain " + shorten(x) + "x more Photons"
		}
	},
	usage: {
		1: _ => hasNU(16) ? ["photon"] : ["hatch_speed"],
		2: _ => ["ma_eff_exp"],
		3: _ => ["dil_gal_gain"],
		4: _ => ["dt_to_ma_exp"],
		5: _ => ["dil_exp"],
		6: _ => ["md_boost"],
		7: _ => hasNU(6) ? ["pilon_charge", "decay_exp"] : ["remote_start", "pilon_charge"],
		8: _ => ["per_10_power", "pilon_energy"],
	},
}

function hasNanoReward(x) {
	return getNanorewardEff(x) ? true : false
}

function getNanorewardEff(x) {
	return tmp.qu.nf?.eff?.[x]
}

function getNanoRewardPower(reward, rewards) {
	let x = Math.ceil((rewards - reward + 1) / 8)
	return x * tmp.qu.nf.str
}

function getNanoRewardReq(additional){
	return getNanoRewardReqFixed(additional - 1 + nfSave.rewards)
}

function getActiveNanoScalings(){
	ret = [true, true]
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
	if (n >= s[1] && a[1]) x = x.mul(E_pow(2.0, (n - s[1]) * (n - s[1] + 3) / PHOTON.eff(6)))
	return x
}

function updateNextPreonEnergyThreshold() {
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
	nfSave.rewards += toSkip
}

function updateNanoEffectUsages() {
	let data = {}
	tmp.qu.nf.reward = data
	for (let x = 1; x <= 8; x++) data[x] = nanoRewards.usage[x]()
}

function updateNanoRewardPowers() {
	let data = {}
	tmp.qu.nf.power = data
	for (let x = 1; x <= 8; x++) data[x] = getNanoRewardPower(x, tmp.qu.nf.rewards)
}

function updateNanoRewardEffects() {
	let data = {}
	tmp.qu.nf.eff = data

	for (let x = 1; x <= 8; x++) {
		let pow = tmp.qu.nf.power[x]
		for (let r of tmp.qu.nf.reward[x]) data[r] = nanoRewards.eff[r](pow)
	}
}

function resetNanoRewardEffects() {
	updateNanoEffectUsages()
	updateNanoRewardEffects()
}

function setupNanoRewardTemp() {
	tmp.qu.nf = {}
	if (!hasMasteryStudy("d11")) return

	updateNanoEffectUsages()
}

function updateNanofieldTemp() {
	if (!NF.unl()) return
	if (!tmp.qu.nf) setupNanoRewardTemp()
	var x = 1 //getNanoRewardPowerEff()
	var y = nfSave.rewards
	if (tmp.qu.nf.str !== x || tmp.qu.nf.rewards !== y) {
		tmp.qu.nf.str = x
		tmp.qu.nf.rewards = y

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
}

function nanofieldUpdating(diff){
	if (hasBLMilestone(3)) {
		nfSave.energy = nfSave.energy.add(getQuarkEnergyProduction().mul(diff))
	} else {
		var AErate = getQuarkAntienergyProduction()
		var toAddAE = AErate.mul(diff).min(getQuarkChargeProductionCap().sub(nfSave.antienergy))
		if (nfSave.producingCharge) nanofieldProducingChargeUpdating(diff)
		if (toAddAE.gt(0)) {
			nfSave.antienergy = nfSave.antienergy.add(toAddAE).min(getQuarkChargeProductionCap())
			nfSave.energy = nfSave.energy.add(toAddAE.div(AErate).mul(getQuarkEnergyProduction()))
		}
	}
	updateNextPreonEnergyThreshold()
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
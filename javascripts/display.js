function dimShiftDisplay(){
	el("dimReset").style.display = inQC(6) ? "none" : ""

	var shiftRequirement = getShiftRequirement(0);
	var isShift = getNormalDimensions() < getMaxNormalDimensions()
	el("resetLabel").textContent = 'Dimension ' + (isShift ? "Shift" : player.resets < getSupersonicStart() ? "Boost" : "Supersonic") + ' ('+ getFullExpansion(Math.ceil(player.resets)) +'): requires ' + getFullExpansion(Math.ceil(shiftRequirement.amount)) + " " + dimNames[shiftRequirement.tier] + " Dimensions"
	el("softReset").textContent = "Reset antimatter and ADs for a " + (isShift ? "new Dimension" : "Boost")
}

function tickspeedBoostDisplay(){
	if (isTickspeedBoostPossible()) {
		var tickReq = getTickspeedBoostRequirement()
		el("tickReset").style.display = ""
		el("tickResetLabel").textContent = "Tickspeed Boost (" + getFullExpansion(player.tickspeedBoosts) + "): requires " + getFullExpansion(tickReq.amount) + " " + dimNames[tickReq.tier] + " Dimensions"
		el("tickResetBtn").className = getAmount(tickReq.tier) < tickReq.amount ? "unavailablebtn" : "storebtn"
	} else el("tickReset").style.display = "none"
}

function galaxyReqDisplay(){
	var nextGal = getGalaxyRequirement(0, true)
	var totalRepl = getTotalRG()
	var dil = Math.floor(player.dilation.freeGalaxies)
	var totalTypes = dil ? 3 : totalRepl ? 2 : 1

	var msg = getGalaxyScaleName(nextGal.scaling) + (nextGal.scaling <= 3 ? "Antimatter " : "") + ' Galaxies '
	msg += "(" + getFullExpansion(player.galaxies)
	if (totalTypes >= 2) msg += " + " + getFullExpansion(totalRepl)
	if (totalTypes >= 3) msg += " + " + getFullExpansion(dil)
	if (totalTypes >= 2 && shiftDown) msg += " = " + getFullExpansion(player.galaxies + totalRepl + dil)

	msg += "): "
	if (totalTypes >= 3) msg += "<br>"
	msg += 'requires ' + getFullExpansion(nextGal.amount) + ' ' + dimNames[inNC(4) ? 6 : 8] + ' Dimensions'
	el("secondResetLabel").innerHTML = msg
}

var galaxyScalings = ["", "Distant ", "Farther ", "Remote ", "Obscure ", "Dark ", "Spectre ", "Vacuumic ", "Exotic ", "Ethereal "]
function getGalaxyScaleName(x) {
	return galaxyScalings[x]
}

function dimensionTabDisplay() {
	let shown = false
	for (let tier = 8; tier > 0; tier--) {
		if (
			   shown
			|| canBuyDimension(tier)
			|| (player.resets > 0 && tier < player.resets + 4)
		) {
			el(tier + "Row").style.display = null
			shown = true
		}
		if (el(tier + "Row").style.display == "none") continue
		el("D" + tier).childNodes[0].nodeValue = dimNames[tier] + " Dimension x" + formatValue(player.options.notation, getDimensionFinalMultiplier(tier), 2, 1)
		el("A" + tier).textContent = getDimensionDescription(tier)
		el(tier + "Row").style.opacity = canBuyDimension(tier) ? null : .42
	}

	setAndMaybeShow("mp10d", mod.ngmu, "'Multiplier per 10 Dimensions: '+shorten(getDimensionPowerMultiplier(\"non-random\"))+'x'")
	updateCosts()
	dimShiftDisplay()
	tickspeedBoostDisplay()
	galaxyReqDisplay()
	intergalacticDisplay()
	normalSacDisplay()
	d8SacDisplay()
	dimboostBtnUpdating()
	galaxyBtnUpdating()
}

function updateCosts() {
	var costPart = quantumed ? '' : 'Cost: '
	var until10CostPart = quantumed ? '' : 'Until 10, Cost: '
	for (var i=1; i<9; i++) {
		var cost = player[dimTiers[i] + "Cost"]
		var resource = getOrSubResource(i)
		el('B'+i).className = canBuyDimension(i) && cost.lte(resource) ? 'storebtn' : 'unavailablebtn'
		el('B'+i).textContent = costPart + shortenPreInfCosts(cost)
		el('M'+i).className = canBuyDimension(i) && cost.mul(10 - dimBought(i)).lte(resource) ? 'storebtn' : 'unavailablebtn'
		el('M'+i).textContent = until10CostPart + shortenPreInfCosts(cost.mul(10 - dimBought(i)));
	}
}

function tickspeedDisplay(){
	let unl = canBuyDimension(3) || player.currentEternityChall == "eterc9"
	el("tickSpeedRow").style.visibility = unl ? "visible" : "hidden"
	if (!unl) return

	var tickmult = tmp.gal.ts
	var tickmultNum = tickmult.toNumber()
	var ticklabel
	var e = Math.floor(Math.log10(Math.round(1/tickmultNum)))
	if (isNaN(tickmultNum)) ticklabel = 'Break the tick interval by Infinite';
	else if (e >= 9) ticklabel = "Divide the tick interval by " + shortenDimensions(Decimal.recip(tickmult))
	else if (tickmultNum > .9) ticklabel = 'Reduce the tick interval by ' + shorten((1 - tickmultNum) * 100) + '%'
	else ticklabel = 'Reduce the tick interval by ' + ((1 - tickmultNum) * 100).toFixed(e) + '%'
	let ic3mult=getIC3Mult()
	if (player.galacticSacrifice || player.currentChallenge == "postc3" || isIC3Trapped()) el("tickLabel").innerHTML = ((isIC3Trapped() || player.currentChallenge == "postc3") && player.currentChallenge != "postcngmm_3" && !player.challenges.includes("postcngmm_3") && !tmp.qu.be ? "M" : ticklabel + '<br>and m') + 'ultiply all dimensions by ' + (ic3mult > 999.95 ? shorten(ic3mult) : E(ic3mult).toNumber().toPrecision(4)) + '.'
	else el("tickLabel").textContent = ticklabel + '.'
	tickspeedButtonDisplay()

	if (tmp.tickUpdate) {
		updateTickspeed()
		tmp.tickUpdate = false
	}
}

function infinityUpgradesDisplay(){
	if (player.infinityUpgrades.includes("timeMult")) el("infi11").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)) el("infi11").className = "infinistorebtn1"
	else el("infi11").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("dimMult")) el("infi21").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)) el("infi21").className = "infinistorebtn2"
	else el("infi21").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("18Mult")) el("infi12").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("timeMult")) el("infi12").className = "infinistorebtn1"
	else el("infi12").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("27Mult")) el("infi22").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("dimMult")) el("infi22").className = "infinistorebtn2"
	else el("infi22").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("36Mult")) el("infi13").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("18Mult")) el("infi13").className = "infinistorebtn1"
	else el("infi13").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("45Mult")) el("infi23").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("27Mult")) el("infi23").className = "infinistorebtn2"
	else el("infi23").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("resetBoost")) el("infi14").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("36Mult")) el("infi14").className = "infinistorebtn1"
	else el("infi14").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("galaxyBoost")) el("infi24").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(2)&&player.infinityUpgrades.includes("45Mult")) el("infi24").className = "infinistorebtn2"
	else el("infi24").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("timeMult2")) el("infi31").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(3)) el("infi31").className = "infinistorebtn3"
	else el("infi31").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("unspentBonus")) el("infi32").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("timeMult2") && player.infinityPoints.gte(5)) el("infi32").className = "infinistorebtn3"
	else el("infi32").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("resetMult")) el("infi33").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("unspentBonus") && player.infinityPoints.gte(7)) el("infi33").className = "infinistorebtn3"
	else el("infi33").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("passiveGen")) el("infi34").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("resetMult") && player.infinityPoints.gte(10)) el("infi34").className = "infinistorebtn3"
	else el("infi34").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipReset1")) el("infi41").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(20)) el("infi41").className = "infinistorebtn4"
	else el("infi41").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipReset2")) el("infi42").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("skipReset1") && player.infinityPoints.gte(40)) el("infi42").className = "infinistorebtn4"
	else el("infi42").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipReset3")) el("infi43").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("skipReset2") && player.infinityPoints.gte(80)) el("infi43").className = "infinistorebtn4"
	else el("infi43").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipResetGalaxy")) el("infi44").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("skipReset3") && player.infinityPoints.gte(500)) el("infi44").className = "infinistorebtn4"
	else el("infi44").className = "infinistorebtnlocked"
	el("infi11").innerHTML = "Antimatter Dimensions gain a multiplier based on time played <br>Currently: " + (infUpg11Pow()).toFixed(2) + "x<br>Cost: 1 IP"
	el("infi12").innerHTML = "1st and 8th Antimatter Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi13").innerHTML = "3rd and 6th Antimatter Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi22").innerHTML = "2nd and 7th Antimatter Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi23").innerHTML = "4th and 5th Antimatter Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi31").innerHTML = "Antimatter Dimensions gain a multiplier based on time spent in this Infinity<br>Currently: " + shorten(infUpg13Pow()) + "x<br>Cost: 3 IP"
	var infi32middle = player.infinityPoints.lt(pow10(1e9)) ? " <br> Currently: " + formatValue(player.options.notation, getUnspentBonus(), 2, 2) + "x" : ""
	el("infi32").innerHTML = "1st Antimatter Dimension gets a multiplier based on unspent IP " + infi32middle + "<br>Cost: 5 IP"
}

function preBreakUpgradeDisplay(){
	if (canBuyIPMult()) el("infiMult").className = "infinimultbtn"
	else el("infiMult").className = "infinistorebtnlocked"
	var infiMultEnding = player.infinityPoints.lt(pow10(1e9)) ? "<br>Currently: " + shorten(getIPMult()) + "x<br>Cost: " + shortenCosts(player.infMultCost) + " IP" : ""
	el("infiMult").innerHTML = "You get " + (Math.round(getIPMultPower() * 100) / 100) + "x more IP." + infiMultEnding

	infinityUpgradesDisplay()
	if (inNGM(2)) {
		var base = !inNGM(3) ? 2 : 1
		if (mod.ngep) base *= 10
		el("infi21").innerHTML = "Increase the multiplier for buying 10 Dimensions based on Infinities<br>"+base+"x → "+(infUpg12Pow()*base).toPrecision(4)+"x<br>Cost: 1 IP"
		el("infi33").innerHTML = "Dimension Boosts are stronger based on Infinity Points<br>Currently: " + (1.2 + 0.05 * player.infinityPoints.max(1).log(10)).toFixed(2) + "x<br>Cost: 7 IP"
	}
	var infi34Middle = player.infinityPoints.lt(pow10(1e9)) ? "<br>Currently: " + shortenDimensions(getIPMult()) + " every " + timeDisplay(player.bestInfinityTime * 10) : ""
	el("infi34").innerHTML = "Generate IP based on your fastest Infinity " + infi34Middle + "<br>Cost: 10 IP"
}

function breakInfinityUpgradeDisplay(){
	el("break").textContent = (player.break ? "FIX" : "BREAK") + " INFINITY"

	if (player.infinityUpgrades.includes("totalMult")) el("postinfi11").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e4)) el("postinfi11").className = "infinistorebtn1"
	else el("postinfi11").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("currentMult")) el("postinfi21").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(5e4)) el("postinfi21").className = "infinistorebtn1"
	else el("postinfi21").className = "infinistorebtnlocked"
	if (player.tickSpeedMultDecrease <= 2) el("postinfi31").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickSpeedMultDecreaseCost)) el("postinfi31").className = "infinimultbtn"
	else el("postinfi31").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("achievementMult")) el("postinfi22").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e6)) el("postinfi22").className = "infinistorebtn1"
	else el("postinfi22").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("infinitiedMult")) el("postinfi12").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e5)) el("postinfi12").className = "infinistorebtn1"
	else el("postinfi12").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postGalaxy")) el("postinfi41").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(5e11)) el("postinfi41").className = "infinistorebtn1"
	else el("postinfi41").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("challengeMult")) el("postinfi32").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e7)) el("postinfi32").className = "infinistorebtn1"
	else el("postinfi32").className = "infinistorebtnlocked"
	if (player.dimensionMultDecrease <= 3) el("postinfi42").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.dimensionMultDecreaseCost)) el("postinfi42").className = "infinimultbtn"
	else el("postinfi42").className = "infinistorebtnlocked"
	if (player.offlineProd == 50) el("offlineProd").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.offlineProdCost)) el("offlineProd").className = "infinimultbtn"
	else el("offlineProd").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("infinitiedGeneration")) el("postinfi13").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(20e6)) el("postinfi13").className = "infinistorebtn1"
	else el("postinfi13").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("bulkBoost")) el("postinfi23").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(inNGM(3)?2e4:inNGM(2)?5e6:5e9)) el("postinfi23").className = "infinistorebtn1"
	else el("postinfi23").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("autoBuyerUpgrade")) el("postinfi33").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e15)) el("postinfi33").className = "infinistorebtn1"
	else el("postinfi33").className = "infinistorebtnlocked"
	el("postinfi11").innerHTML = "Antimatter Dimensions gain a multiplier based on total antimatter produced<br>Currently: " + shorten(totalMult) + "x<br>Cost: "+shortenCosts(1e4)+" IP"
	el("postinfi21").innerHTML = "Antimatter Dimensions gain a multiplier based on current antimatter<br>Currently: " + shorten(currentMult) + "x<br>Cost: "+shortenCosts(5e4)+" IP"
	if (player.tickSpeedMultDecrease > 2) el("postinfi31").innerHTML = "Decrease the Tickspeed cost multiplier increase post-e308<br>Currently: " + player.tickSpeedMultDecrease+"x → "+(player.tickSpeedMultDecrease-1)+"x<br>Cost: "+shortenDimensions(player.tickSpeedMultDecreaseCost) +" IP"
	else el("postinfi31").innerHTML = "Decrease the Tickspeed cost multiplier increase post-e308<br>Currently: " + player.tickSpeedMultDecrease.toFixed(player.tickSpeedMultDecrease < 2 ? 2 : 0)+"x"
	el("postinfi22").innerHTML = "Antimatter Dimensions gain a multiplier based on your Achievements " + (inNGM(4) ? "and purchased GP upgrades " : "") + "<br>Currently: " + shorten(achievementMult) + "x<br>Cost: " + shortenCosts(1e6) + " IP"
	el("postinfi12").innerHTML = "Antimatter Dimensions gain a multiplier based on your Infinities <br>Currently: "+shorten(getInfinitiedMult())+"x<br>Cost: " + shortenCosts(1e5) + " IP"
	el("postinfi41").innerHTML = "Galaxies are " + Math.round(getPostGalaxyEff() * 100 - 100) + "% stronger <br>Cost: "+shortenCosts(5e11)+" IP"
	el("postinfi32").innerHTML = "Antimatter Dimensions gain a multiplier based on your slowest Normal Challenge time<br>Currently: "+shorten(worstChallengeBonus)+"x<br>Cost: " + shortenCosts(1e7) + " IP"
	el("postinfi13").innerHTML = "You generate Infinities based on your fastest Infinity.<br>1 Infinity every " + timeDisplay(player.bestInfinityTime * 5) + " <br>Cost: " + shortenCosts(2e7) + " IP"
	el("postinfi23").innerHTML = "Unlock the option to bulk buy Dimension" + (!inNGM(3) ? "" : " and Tickspeed") + " Boosts <br>Cost: " + shortenCosts(inNGM(3) ? 2e4 : inNGM(2) ? 5e6 : 5e9) + " IP"
	el("postinfi33").innerHTML = "Autobuyers work twice as fast <br>Cost: " + shortenCosts(1e15) + " IP"
	if (player.dimensionMultDecrease > 3) el("postinfi42").innerHTML = "Decrease the Dimension cost multiplier post-e308<br>Currently: " + player.dimensionMultDecrease + "x → " + (player.dimensionMultDecrease - 1) + "x<br>Cost: " + shortenCosts(player.dimensionMultDecreaseCost) +" IP"
	else el("postinfi42").innerHTML = "Decrease the Dimension cost multiplier post-e308<br>Currently: "+player.dimensionMultDecrease.toFixed(ECComps("eterc6") % 5 > 0 ? 1 : 0) + "x"
	el("offlineProd").innerHTML = "Generate " + player.offlineProd + "% > " + Math.max(Math.max(5, player.offlineProd + 5), Math.min(50, player.offlineProd + 5)) + "% of your best IP/min from the last 10 Infinities, works offline<br>Currently: " + shortenMoney(bestRunIppm.mul(player.offlineProd / 100)) + " IP/min<br> Cost: " + shortenCosts(player.offlineProdCost) + " IP"
	if (player.offlineProd == 50) el("offlineProd").innerHTML = "Generate " + player.offlineProd + "% of your best IP/min from the last 10 Infinities, works offline<br>Currently: " + shortenMoney(bestRunIppm.mul(player.offlineProd / 100)) + " IP/min"

	if (inNGM(2)) breakNGm2UpgradeColumnDisplay()
	if (inNGM(2) && (player.infinityDimension3.amount.gt(0) || player.eternities > 0 || quantumed)) breakNGm2UpgradeRow5Display()
	else el("postinfir5").style.display = "none"
	if (inNGM(2) && (player.infinityDimension4.amount.gt(0) || player.eternities > 0 || quantumed)) breakNGm2UpgradeRow6Display()
	else el("postinfir6").style.display = "none"
}

function roundedDBCostIncrease(a){
	return shorten(getDimboostCostIncrease() + a)
}

function breakNGm2UpgradeColumnDisplay(){
	if (player.infinityUpgrades.includes("galPointMult")) el("postinfi01").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(!inNGM(3) ? 1e3 : 1e4)) el("postinfi01").className = "infinistorebtn1"
	else el("postinfi01").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("dimboostCost")) el("postinfi02").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(!inNGM(3) ? 2e4 : 1e5)) el("postinfi02").className = "infinistorebtn1"
	else el("postinfi02").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("galCost")) el("postinfi03").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(5e5)) el("postinfi03").className = "infinistorebtn1"
	else el("postinfi03").className = "infinistorebtnlocked"
	if (player.extraDimPowerIncrease >= 40) el("postinfi04").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.dimPowerIncreaseCost)) el("postinfi04").className = "infinimultbtn"
	else el("postinfi04").className = "infinistorebtnlocked"
	el("postinfi01").innerHTML = "Multiplier to Galaxy Points based on Infinities<br>Currently: "+shorten(getPost01Mult())+"x<br>Cost: "+shortenCosts(!inNGM(3)?1e3:1e4)+" IP"
	el("postinfi02").innerHTML = "Decrease Dimension Boost cost increase by 1.<br>Currently: " + roundedDBCostIncrease(0) + (player.infinityUpgrades.includes("dimboostCost") ? "" : " → " + (roundedDBCostIncrease(-1))) + "<br>Cost: " + shortenCosts(!inNGM(3) ? 2e4 : 1e5) + " IP"
	el("postinfi03").innerHTML = "Decrease Galaxy cost increase by 5.<br>Currently: " + Math.round(getGalaxyReqMultiplier() * 10) / 10 + (player.infinityUpgrades.includes("galCost") ? "" : " → " + Math.round(getGalaxyReqMultiplier() * 10 - 50) / 10 + "<br>Cost: " + shortenCosts(5e5) + " IP")
	el("postinfi04").innerHTML = "Further increase all Antimatter Dimension multipliers<br>x^" + galMults.u31().toFixed(2) + (player.extraDimPowerIncrease < 40 ? " → x^" + ((galMults.u31() + 0.02).toFixed(2)) + "<br>Cost: " + shorten(player.dimPowerIncreaseCost) + " IP" : "")
}

function breakNGm2UpgradeRow5Display(){
	el("postinfir5").style.display = ""
	if (player.infinityUpgrades.includes("postinfi50")) el("postinfi50").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(!inNGM(3) ? 1e25 : 1e18)) el("postinfi50").className = "infinistorebtn1"
	else el("postinfi50").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi51")) el("postinfi51").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(!inNGM(3) ? 1e29 : 1e20)) el("postinfi51").className = "infinistorebtn1"
	else el("postinfi51").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi52")) el("postinfi52").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(!inNGM(3) ? 1e33 : 1e25)) el("postinfi52").className = "infinistorebtn1"
	else el("postinfi52").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi53")) el("postinfi53").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(!inNGM(3) ? 1e37 : 1e29)) el("postinfi53").className = "infinistorebtn1"
	else el("postinfi53").className = "infinistorebtnlocked"
	el("postinfi50").innerHTML = "Decrease the Dimension Boost cost increase by 0.5.<br>Currently: " + getDimboostCostIncrease() + (player.infinityUpgrades.includes("postinfi50") ? "" : " → " + (getDimboostCostIncrease() - 0.5)) + "<br>Cost: " + shortenCosts(!inNGM(3) ? 1e25 : 1e18) + " IP"
	el("postinfi51").innerHTML = "Galaxies are " + (inNGM(3) ? 15 : 20) + "% more stronger.<br>Cost: " + shortenCosts(!inNGM(3) ? 1e29 : 1e20) + " IP"
	let inf52text = ''
	if (!inNGM(3)){
		inf52text = "Galaxy cost increases by 3 less.<br>Currently: " + Math.round(getGalaxyReqMultiplier() * 10) / 10 + (player.infinityUpgrades.includes("postinfi52") ? "" : " → " + Math.round(getGalaxyReqMultiplier() * 10 - 30) / 10) + "<br>Cost: " + shortenCosts(1e33) + " IP"
	} else inf52text = "Decrease tickspeed boost cost multiplier to 3.<br>Cost: " + shortenCosts(1e25) + " IP"
	el("postinfi52").innerHTML = inf52text
	el("postinfi53").innerHTML = "Divide all Infinity Dimension cost multipliers by 50.<br>Cost: "+shortenCosts(!inNGM(3) ? 1e37 : 1e29) + " IP"
}

function breakNGm2UpgradeRow6Display(){
	el("postinfir6").style.display = ""
	if (player.infinityUpgrades.includes("postinfi60")) el("postinfi60").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e50)) el("postinfi60").className = "infinistorebtn1"
	else el("postinfi60").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi61")) el("postinfi61").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte("1e450")) el("postinfi61").className = "infinistorebtn1"
	else el("postinfi61").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi62")) el("postinfi62").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte("1e700")) el("postinfi62").className = "infinistorebtn1"
	else el("postinfi62").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi63")) el("postinfi63").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte("1e2000")) el("postinfi63").className = "infinistorebtn1"
	else el("postinfi63").className = "infinistorebtnlocked"
	el("postinfi60").innerHTML = "You gain more " + (inNGM(3) ? "Galaxy Points" : "antimatter") + " based on your galaxies." + (inNGM(3) ? "" : "<br>Currently: " + shorten(getNewB60Mult()) + "x") + "<br>Cost: " + shortenCosts(1e50) + " IP"
	el("postinfi61").innerHTML = "g11 formula is better.<br>Cost: " + shortenCosts(E("1e450")) + " IP"
	el("postinfi62").innerHTML = "Dimension Boosts make g13 stronger.<br>Cost: " + shortenCosts(E("1e700")) + " IP"
	el("postinfi63").innerHTML = "Unlock 2 new rows of Galaxy upgrades.<br>Cost: " + shortenCosts(E("1e2000")) + " IP"
}

function eternityUpgradesDisplay(){
	var eu2formula = "(x/200)^log4(2x)"
	if (mod.rs) eu2formula = "x^log4(2x)"
	else if (hasAch("ngpp15")) eu2formula = "x^log10(x)^3.75"
	el("eter1").innerHTML = "Infinity Dimension multiplier based on unspent EP (x+1)<br>Currently: "+shortenMoney(player.eternityPoints.add(1))+"x<br>Cost: 5 EP"
	el("eter2").innerHTML = "Infinity Dimension multiplier based on Eternities (" + eu2formula + ")<br>Currently: "+shortenMoney(getEU2Mult())+"x<br>Cost: 10 EP"
	el("eter3").innerHTML = "Infinity Dimension multiplier based on "+(mod.rs ? "Time Shards (x/"+shortenCosts(1e12)+"+1)":"sum of Infinity Challenge times")+"<br>Currently: "+shortenMoney(getEU3Mult())+"x<br>Cost: "+shortenCosts(50e3)+" EP"
	el("eter4").innerHTML = "Your achievement bonus affects Time Dimensions"+"<br>Cost: "+shortenCosts(1e16)+" EP"
	el("eter5").innerHTML = "Time Dimensions gain a multiplier based on your unspent Time Theorems"+"<br>Cost: "+shortenCosts(1e40)+" EP"
	el("eter6").innerHTML = "Time Dimensions gain a multiplier based on days played"+"<br>Cost: "+shortenCosts(1e50)+" EP"
	if (mod.ngud && hasDilStudy(1)) {
		el("eter7").innerHTML = "Dilated Time gain is boosted by antimatter<br>Currently: "+(1 + Math.log10(Math.max(1, player.money.log(10))) / 40).toFixed(3)+"x<br>Cost: "+shortenCosts(E("1e1500"))+" EP"
		el("eter8").innerHTML = "Dilated Time gain is boosted by Infinity Points<br>Currently: "+(1 + Math.log10(Math.max(1, player.infinityPoints.log(10))) / 20).toFixed(3)+"x<br>Cost: "+shortenCosts(E("1e2000"))+" EP"
		el("eter9").innerHTML = "Dilated Time gain is boosted by Eternity Points<br>Currently: "+(1 + Math.log10(Math.max(1, player.eternityPoints.log(10))) / 10).toFixed(3)+"x<br>Cost: "+shortenCosts(E("1e3000"))+" EP"
	}
	el("epmult").className = player.eternityPoints.gte(player.epmultCost) ? "eternityupbtn" : "eternityupbtnlocked"
}

function uponDilationDisplay(){
	let gain = getDilGain()
	let msg = "Disable dilation"
	if (!canEternity()) {}
	else if (player.dilation.totalTachyonParticles.gt(gain)) msg += ".<br>Reach " + shortenMoney(getReqForTPGain()) + " antimatter to gain more Tachyon Particles"
	else msg += " for " + shortenMoney(gain.sub(player.dilation.totalTachyonParticles)) + " Tachyon Particles"
	el("enabledilation").innerHTML = msg + "."
}

function updateDilation(){
	if (player.dilation.active) uponDilationDisplay()
	else el("enabledilation").textContent = "Dilate time."+((player.eternityBuyer.isOn&&player.eternityBuyer.dilationMode?!isNaN(player.eternityBuyer.statBeforeDilation):false) ? " "+player.eternityBuyer.statBeforeDilation+ " left before dilation." : "")

	el("tachyonParticleAmount").textContent = shortenMoney(player.dilation.tachyonParticles)
	updateBestTachyonParticles()
	el("dilatedTimeAmount").textContent = shortenMoney(player.dilation.dilatedTime)
	el("dilatedTimePerSecond").textContent = "+" + shortenMoney(getDilTimeGainPerSecond()) + "/s"

	var fgm = getFreeGalaxyGainMult()
	el('freeGalaxyMult').textContent = fgm == 1 ? "Tachyonic Galaxy is" : Math.round(fgm * 10) / 10 + " Tachyonic Galaxies are"
	el("galaxyThreshold").textContent = shortenMoney(player.dilation.nextThreshold)
	el("dilatedGalaxies").textContent = getFullExpansion(Math.floor(player.dilation.freeGalaxies))
}

function replicantiDisplay() {
	let unl = player.replicanti.unl
	el("replicantidiv").style.display=unl?"":"none"
	el("replicantiunlock").style.display=!unl?"":"none"

	if (unl) {
		let time = mod.ngp3 && player.dilation.upgrades.includes(6)
		let dil = hasMasteryStudy("t281") || hasMasteryStudy("d13")
		el("replicantiamount").textContent = shortenDimensions(player.replicanti.amount) + (hasTimeStudy(192) ? "" : " / " + shortenDimensions(getReplicantiLimit()))
		el("replicantieff").textContent = shiftDown ? "Efficiency: " + shorten(tmp.rep.eff) + "x" : ""
		el("replicantimult").textContent = shorten(dil ? getReplDilBonus() : time ? tmp.rep.eff.pow(0.1) : getIDReplMult()) + "x"
		el("replDesc").textContent = dil ? " on Dilated Time production" : time ? " on all Time Dimensions" : " on all Infinity Dimensions"
		
		let replGalOver = getMaxRG() - player.replicanti.gal
		let chance = Decimal.mul(tmp.rep.chance, 100)
		let chanceDisplayEnding = (isChanceAffordable() && player.infinityPoints.lt(pow10(1e9)) ? "<br>+1% Cost: " + shortenCosts(player.replicanti.chanceCost) + " IP" : "")
		el("replicantichance").innerHTML = (tmp.rep.freq?"Frequency: "+shorten(tmp.rep.freq)+"x":"Chance: "+getFullExpansion(chance.gt(1e12)?chance:Math.round(chance.toNumber()))+"%") + chanceDisplayEnding
		el("replicantiinterval").innerHTML = "Interval: "+timeDisplayShort(Decimal.div(tmp.rep.interval, 100), true, 3) + (isIntervalAffordable() ? "<br>→ "+timeDisplayShort(Decimal.mul(tmp.rep.interval, 9e-3), true, 3)+" Cost: "+shortenCosts(player.replicanti.intervalCost)+" IP" : "")

		let replGalName = player.replicanti.gal < 100 ? "Max Replicated Galaxies" : getGalaxyScaleName(player.replicanti.gal < 400 ? 1 : player.replicanti.gal < 2999 ? 2 : player.replicanti.gal < 5e4 ? 3 : 4) + " Replicated Galaxies"
		let replGalCostPortion = player.infinityPoints.lt(pow10(1e9)) ? "<br>+1 Cost: " + shortenCosts(getRGCost()) + " IP" : ""
		el("replicantimax").innerHTML = replGalName + ": " + getFullExpansion(player.replicanti.gal) + (replGalOver > 1 ? "+" + getFullExpansion(replGalOver) : "") + replGalCostPortion
		el("replicantireset").innerHTML = (hasAch("ng3p67") ? "Get " : (hasAch("ngpp16") || hasAch("r126")) ? "Divide replicanti by " + shorten(Number.MAX_VALUE) + " for" : "Reset replicanti amount for") + " 1 galaxy.<br>" + getFullExpansion(player.replicanti.galaxies) + getExtraReplGalaxyDisp() + " Replicated Galax" + (getTotalRG() == 1 ? "y" : "ies") + " created."
		el("replicantiapprox").innerHTML = mod.ngp3 && player.dilation.upgrades.includes("ngpp1") && hasTimeStudy(192) && player.replicanti.amount.gte(Number.MAX_VALUE) ? 
			"Replicanti increases by " + (tmp.rep.est < Math.log10(2) ? "x2.00 per " + timeDisplayShort(Math.log10(2) / tmp.rep.est * 10) : shorten(pow10(tmp.rep.est.toNumber())) + "x per second") + ".<br>" +
			"Replicanti Slowdown: " + tmp.rep.speeds.inc.toFixed(3) + "x slower per " + shorten(pow10(tmp.rep.speeds.exp)) + "x.<br>" +
			"(10x slower per " + shorten(pow10(tmp.rep.speeds.exp / Math.log10(tmp.rep.speeds.inc))) + "x)<br>" +
			(tmp.rep.warp ? "<br><b>Replicanti Warp: " + timeDisplayShort(tmp.rep.interval.div(tmp.rep.dupRate), true, 2) + " interval → ^" + shorten(tmp.rep.warp) + " slowdown!</b><br>(10x until " + shortenCosts(tmp.rep.warp_lim) + ")" : "") :
			"Approximately "+ timeDisplay(Math.max((Math.log(Number.MAX_VALUE) - tmp.rep.ln) / tmp.rep.est.toNumber(), 0) * 10) + " Until Infinite Replicanti"

		el("replicantichance").className = (player.infinityPoints.gte(player.replicanti.chanceCost) && isChanceAffordable()) ? "storebtn" : "unavailablebtn"
		el("replicantiinterval").className = (player.infinityPoints.gte(player.replicanti.intervalCost) && isIntervalAffordable()) ? "storebtn" : "unavailablebtn"
		el("replicantimax").className = (player.infinityPoints.gte(getRGCost())) ? "storebtn" : "unavailablebtn"
		el("replicantireset").className = (canGetReplicatedGalaxy()) ? "storebtn" : "unavailablebtn"
		el("replicantireset").style.height = (hasAch("ngpp16") && !hasAch("ng3p67") ? 90 : 70) + "px"

		for (var i = 1; i <= 3; i++) el("replauto"+i).innerHTML = "Auto: " + (player.replicanti.auto[i-1] ? "ON" : "OFF")
		el("replicantiresettoggle").textContent="Auto galaxy "+(player.replicanti.galaxybuyer?"ON":"OFF")
	} else {
		el("replicantiunlock").innerHTML = "Unlock Replicantis<br>Cost: " + shortenCosts(inOnlyNGM(2) ? 1e80 : 1e140) + " IP"
		el("replicantiunlock").className = (player.infinityPoints.gte(inOnlyNGM(2) ? 1e80 : 1e140)) ? "storebtn" : "unavailablebtn"
	}
}

function initialTimeStudyDisplay(){
	el("11desc").textContent = "Currently: " + shortenMoney(tsMults[11]()) + "x"
	el("32desc").textContent = "Gain " + getFullExpansion(tsMults[32]()) + "x more Infinities (based on Dimension Boosts)"
	el("51desc").textContent = "Gain " + shortenCosts(mod.ngep ? 1e30 : 1e15) + "x more IP"
	el("71desc").textContent = "Currently: " + shortenMoney(tmp.sacPow.pow(0.25).max(1).min("1e210000")) + "x"
	el("72desc").textContent = "Currently: " + shortenMoney(tmp.sacPow.pow(0.04).max(1).min("1e30000")) + "x"
	el("73desc").textContent = "Currently: " + shortenMoney(tmp.sacPow.pow(0.005).max(1).min("1e1300")) + "x"
	el("82desc").textContent = "Currently: " + shortenMoney(E_pow(1.0000109, E_pow(player.resets, 2)).min(player.meta==undefined?1/0:'1e80000')) + "x"
	el("91desc").textContent = "Currently: " + shortenMoney(pow10(Math.min(player.thisEternity, 18000)/60)) + "x"
	el("92desc").textContent = "Currently: " + shortenMoney(pow2(600/Math.max(player.bestEternity, 20))) + "x"
	el("93desc").textContent = "Currently: " + shortenMoney(E_pow(player.totalTickGained, 0.25).max(1)) + "x"
	el("121desc").textContent = "Currently: " + ((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5).toFixed(1) + "x"
	el("123desc").textContent = "Currently: " + Math.sqrt(1.39*player.thisEternity/10).toFixed(1) + "x"
	el("141desc").textContent = "Currently: " + shortenMoney(E(1e45).dividedBy(E_pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125))).max(1)) + "x"
	el("142desc").textContent = "Gain " + shortenCosts(1e25) + "x more IP"
	el("143desc").textContent = "Currently: " + shortenMoney(E_pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125))) + "x"
	el("151desc").textContent = shortenCosts(1e4) + "x multiplier on all Time Dimensions"
	el("161desc").textContent = shortenCosts(pow10((inNGM(2) ? 6660 : 616) * (mod.ngep ? 5 : 1))) + "x multiplier on all Antimatter Dimensions"
	el("162desc").textContent = shortenCosts(pow10((inNGM(2) ? 234 : 11) * (mod.ngep ? 5 : 1))) + "x multiplier on all Infinity Dimensions"
	el("192desc").textContent = "Replicantis can surpass " + shortenMoney(Number.MAX_VALUE) + ", but interval scales more you have"
	el("193desc").textContent = "Currently: " + shortenMoney(E_pow(1.03, Decimal.min(1e7, getEternitied())).min("1e13000")) + "x"
	el("212desc").textContent = "Currently: " + ((tsMults[212]() - 1) * 100).toFixed(2) + "%"
	el("214desc").textContent = "Currently: " + shortenMoney(((tmp.sacPow.pow(8)).min("1e46000").mul(tmp.sacPow.pow(1.1)).div(tmp.sacPow)).max(1).min(E("1e125000"))) + "x"
	el("metaCost").textContent = shortenCosts(1e24);
}

function eternityChallengeUnlockDisplay(){
	var ec1Mult=mod.ngep?1e3:2e4
	if (player.etercreq !== 1) el("ec1unl").innerHTML = "Eternity Challenge 1<span>Requirement: "+getFullExpansion((ECComps("eterc1")+1)*ec1Mult)+" Eternities<span>Cost: 30 Time Theorems"
	else el("ec1unl").innerHTML = "Eternity Challenge 1<span>Cost: 30 Time Theorems"
	if (player.etercreq !== 2) el("ec2unl").innerHTML = "Eternity Challenge 2<span>Requirement: "+getFullExpansion(1300+ECComps("eterc2")*150)+" Tickspeed upgrades gained from Time Dimensions<span>Cost: 35 Time Theorems"
	else el("ec2unl").innerHTML = "Eternity Challenge 2<span>Cost: 35 Time Theorems"
	if (player.etercreq !== 3) el("ec3unl").innerHTML = "Eternity Challenge 3<span>Requirement: "+getFullExpansion(17300+ECComps("eterc3")*1250)+" 8th dimensions<span>Cost: 40 Time Theorems"
	else el("ec3unl").innerHTML = "Eternity Challenge 3<span>Cost: 40 Time Theorems"
	if (player.etercreq !== 4) el("ec4unl").innerHTML = "Eternity Challenge 4<span>Requirement: "+getFullExpansion(1e8 + ECComps("eterc4")*5e7)+" infinities<span>Cost: 70 Time Theorems"
	else el("ec4unl").innerHTML = "Eternity Challenge 4<span>Cost: 70 Time Theorems"
	if (player.etercreq !== 5) el("ec5unl").innerHTML = "Eternity Challenge 5<span>Requirement: "+getFullExpansion(160+ECComps("eterc5")*14)+" galaxies<span>Cost: 130 Time Theorems"
	else el("ec5unl").innerHTML = "Eternity Challenge 5<span>Cost: 130 Time Theorems"
	if (player.etercreq !== 6) el("ec6unl").innerHTML = "Eternity Challenge 6<span>Requirement: "+getFullExpansion(40+ECComps("eterc6")*5)+" Replicated Galaxies<span>Cost: 85 Time Theorems"
	else el("ec6unl").innerHTML = "Eternity Challenge 6<span>Cost: 85 Time Theorems"
	if (player.etercreq !== 7) el("ec7unl").innerHTML = "Eternity Challenge 7<span>Requirement: "+shortenCosts(E("1e500000").mul(E("1e300000").pow(ECComps("eterc7"))))+" antimatter<span>Cost: 115 Time Theorems"
	else el("ec7unl").innerHTML = "Eternity Challenge 7<span>Cost: 115 Time Theorems"
	if (player.etercreq !== 8) el("ec8unl").innerHTML = "Eternity Challenge 8<span>Requirement: "+shortenCosts(E("1e4000").mul(E("1e1000").pow(ECComps("eterc8"))))+" IP<span>Cost: 115 Time Theorems"
	else el("ec8unl").innerHTML = "Eternity Challenge 8<span>Cost: 115 Time Theorems"
	if (player.etercreq !== 9) el("ec9unl").innerHTML = "Eternity Challenge 9<span>Requirement: "+shortenCosts(E("1e17500").mul(E("1e2000").pow(ECComps("eterc9"))))+" infinity power<span>Cost: 415 Time Theorems"
	else el("ec9unl").innerHTML = "Eternity Challenge 9<span>Cost: 415 Time Theorems"
	if (player.etercreq !== 10) el("ec10unl").innerHTML = "Eternity Challenge 10<span>Requirement: "+shortenCosts(E("1e100").mul(E("1e20").pow(ECComps("eterc10"))))+" EP<span>Cost: 550 Time Theorems"
	else el("ec10unl").innerHTML = "Eternity Challenge 10<span>Cost: 550 Time Theorems"

	el("ec11unl").innerHTML = "Eternity Challenge 11<span>Requirement: Use only the Antimatter Dimension path<span>Cost: 1 Time Theorem"
	el("ec12unl").innerHTML = "Eternity Challenge 12<span>Requirement: Use only the Time Dimension path<span>Cost: 1 Time Theorem"
}

function mainTimeStudyDisplay(){
	initialTimeStudyDisplay()
	eternityChallengeUnlockDisplay()
	el("dilstudy1").innerHTML = "Unlock Time Dilation" + (hasDilStudy(1) ? "" : "<span>Requirement: 5 EC11 and EC12 completions and " + getFullExpansion(13000) + " total Theorems")+"<span>Cost: " + getFullExpansion(5e3) + " Time Theorems"
	if (mod.ngp3) {
		el("221desc").textContent = "Currently: "+shorten(E_pow(1.0025, player.resets))+"x"
		el("227desc").textContent = "Currently: "+shorten(Math.pow(tmp.sacPow.max(10).log10(), 10))+"x"
		el("231desc").textContent = "Currently: "+shorten(E_pow(Math.max(player.resets, 1), 0.3))+"x more power"
		el("232desc").textContent = "Currently: "+shortenMoney(tsMults[232]() * 100 - 100)+"%"
	}
}

function ABTypeDisplay(){
	if (getEternitied() > 4) el("togglecrunchmode").style.display = "inline-block"
	else el("togglecrunchmode").style.display = "none"
	if (getEternitied() > 8 || player.autobuyers[10].bulkBought) el("galaxybulk").style.display = "inline-block"
	else el("galaxybulk").style.display = "none"
	if (getEternitied() > 99 && mod.ngpp) el("toggleautoetermode").style.display = "inline-block"
	else el("toggleautoetermode").style.display = "none"
}

function infPoints2Display(){
	if (player.infinitied > 0 || player.infinityPoints.gt(0) || player.infinityUpgrades.length > 0 || eternitied()) el("infinityPoints2").style.display = "inline-block"
	else el("infinityPoints2").style.display = "none"
}

function eterPoints2Display(){
	el("eternityPoints2").style.display = getEternitied() >= 0 || quantumed ? "inline-block" : ""
}

function dimboostABTypeDisplay(){
	if (getEternitied() > 9 || player.autobuyers[9].bulkBought) el("bulklabel").textContent = "Buy max DimBoosts every X seconds:"
	else el("bulklabel").textContent = "Bulk DimBoost Amount:"
}

function IDABDisplayCorrection(){
	let mode = getEternitied() > 10 ? "visible" : "hidden"
	if (getEternitied() > 10) {
		for (var i=1;i<getEternitied()-9 && i < 9; i++) el("infauto"+i).style.visibility = "visible"
		el("toggleallinfdims").style.visibility = "visible"
	} else {
		for (var i=1; i<9; i++) el("infauto"+i).style.visibility = "hidden"
		el("toggleallinfdims").style.visibility = "hidden"
	}
}

function replicantiAutoDisplay() {
	if (getEternitied() >= 40) el("replauto1").style.visibility = "visible"
	else el("replauto1").style.visibility = "hidden"
	if (getEternitied() >= 60) el("replauto2").style.visibility = "visible"
	else el("replauto2").style.visibility = "hidden"
	if (getEternitied() >= 80) el("replauto3").style.visibility = "visible"
	else el("replauto3").style.visibility = "hidden"
	if (canAutoReplicatedGalaxy()) el("replicantiresettoggle").style.display = ""
	else el("replicantiresettoggle").style.display = "none"
}

function primaryStatsDisplayResetLayers() {
	var showStats = infinitied() ? "" : "none"
	el("brfilter").style.display = showStats
}

function ECCompletionsDisplay(){
	for (i = 1; i < 15; i++) { //1-14
		el("eterc" + i + "completed").textContent = "Completed " + ECComps("eterc" + i) + " times."
	}
}

function ECchallengePortionDisplay(){
	let ec12TimeLimit = Math.round(getEC12TimeLimit() * 10) / 100
	for (var c=1;c<15;c++) el("eterc"+c+"goal").textContent = "Goal: "+shortenCosts(getECGoal("eterc"+c))+" IP"+(c==12?" in "+ec12TimeLimit+" second"+(ec12TimeLimit==1?"":"s")+" or less.":c==4?" in "+Math.max((16-(ECComps("eterc4")*4)),0)+" infinities or less.":"")
}

function EC8PurchasesDisplay(){
	if (player.currentEternityChall == "eterc8") {
		el("eterc8repl").style.display = "block"
		el("eterc8ids").style.display = "block"
		el("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
		el("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
	} else {
		el("eterc8repl").style.display = "none"
		el("eterc8ids").style.display = "none"
	}
}

function showHideConfirmations() {
	let inf = player.infinitied > 0 || player.eternities !== 0 || quantumed
	let gSac = gSacrificed() || inf

	el("sacConfirmBtn").style.display = (player.resets > 4 || player.galaxies > 0 || gSac || inf) ? "inline-block" : "none"
	el("gSacConfirmBtn").style.display = gSac ? "inline-block" : "none"
	el("dilationConfirmBtn").style.display = (hasDilStudy(1) || quantumed) ? "inline-block" : "none"
	el("exdilationConfirmBtn").style.display = exdilated() ? "" : "none"
	el("quantumConfirmBtn").style.display = quantumed ? "inline-block" : "none"
	el("bigRipConfirmBtn").style.display = brSave?.times ? "inline-block" : "none"
	el("ghostifyConfirmBtn").style.display = ghostified ? "inline-block" : "none"
}

function updateHeaders() {
	let header = !isEmptiness
	el("main_header").style.display = header ? "" : "none"
	el("bonus_header").style.display = header ? "" : "none"
	el("tabs_root").style.display = header ? "" : "none"
	el("emptiness").style.display = header ? "none" : ""
	updateResetTierButtons()
}
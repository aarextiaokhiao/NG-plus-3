function getGSAmount(offset=0) { 
	if (isEmptiness) return E(0)
	let galaxies = getGSGalaxies() + offset
	let y = getGSGalaxyExp(galaxies)
	let z = getGSDimboostExp(galaxies)
	let resetMult = player.resets
	if (inNGM(4)) resetMult = resetMult + player.tdBoosts / 2 - 1
	resetMult -= inNC(4) ? 2 : 4
	if (inNGM(3)) resetMult = (resetMult + 1) / 2
	let exp = getD8Exp()
	let div2 = 50
	if (hasAch("r102")) div2 = 10
	if (player.totalmoney.log10() > 2e6) div2 /= Math.log(player.totalmoney.log10()) 
	
	let ret = E_pow(galaxies, y).mul(E_pow(Math.max(0, resetMult), z)).max(0)
	ret = ret.mul(E_pow(1 + getAmount(8) / div2, exp))
	
	if (!player.galacticSacrifice.chall) ret = ret.mul(getGPMultipliers())
	if (hasGSacUpg(16) && inNGM(4)) ret = ret.mul(Math.max(player.tdBoosts, 1))
	if (inNGM(4)) {
		var e = hasGSacUpg(46) ? galMults["u46"]() : 1
		if (hasGSacUpg(41) && inNGM(4)) ret = ret.mul(Decimal.max(player.tickspeedBoosts, 1).pow(e))
		if (hasGSacUpg(43) && inNGM(4)) ret = ret.mul(Decimal.max(player.resets, 1).pow(e))
		if (hasGSacUpg(45) && inNGM(4)) ret = ret.mul(player.eightAmount.max(1).pow(e))
		if (player.challenges.includes("postcngm3_1") && inNGM(4)) ret = ret.mul(E_pow(3, tmp.ic_power))
	}
	var rgs = player.replicanti.galaxies
	if (hasAch("r98")) rgs *= 2
	if (inNGM(3) && hasAch("r95")) ret = ret.mul(E_pow(Math.max(1, player.eightAmount), rgs))

	return ret.floor()
}

function getGPGain(offset = 0){
	return getGSAmount(offset)
}

function getGPMultipliers(){
	let ret = E(1)
	if (hasAch("r23") && inNGM(3)) {
		let tbDiv = 10
		if (inNGM(4)) tbDiv = 5
		ret=ret.mul(E_pow(Math.max(player.tickspeedBoosts / tbDiv, 1),Math.max(getAmount(8) / 75, 1)))
	}
	if (hasGSacUpg(32)) ret = ret.mul(galMults.u32())
	if (player.infinityUpgrades.includes("galPointMult")) ret = ret.mul(getPost01Mult())
	if (hasAch('r37')) {
		if (player.bestInfinityTime >= 18000) ret = ret.mul(Math.max(180000 / player.bestInfinityTime, 1))
		else ret = ret.mul(10 * (1 + Math.pow(Math.log10(18000 / player.bestInfinityTime), 2)))
	}
	if (hasAch("r62") && !inNGM(3)) ret = ret.mul(player.infinityPoints.max(10).log10())
	return ret
}

function getGSGalaxies() {
	let galaxies = player.galaxies + player.dilation.freeGalaxies;
	let rg = player.replicanti.galaxies
	if (hasTimeStudy(133)) rg *= 1.5
	if (hasTimeStudy(132)) rg *= 1.4
	if (hasAch("r121")) galaxies += 30.008
	if (hasAch("r127")) galaxies += R127 // roughly 42 galaxies
	if (hasAch("r132")) rg *= 1 + .540 // 54.0% boost becasue of the 540 in the achievement
	if (hasAch("r135")) galaxies += R135 // roughly 663 galaxies
	if (hasAch("r137")) galaxies += Math.max(200, player.dilation.freeGalaxies * 4) + 2 * player.dilation.freeGalaxies
	return galaxies+rg
}

function getGSGalaxyExp(galaxies) {
	let y = 1.5 
	if (player.challenges.includes("postcngmm_1")) {
		y += Math.max(0, 0.05 * (galaxies - 10)) + 0.005 * Math.pow(Math.max(0, galaxies-30) , 2)
		if (!inNGM(3) || player.challenges.includes("postcngm3_4") || player.currentChallenge == "postcngm3_4") y += 0.0005 * Math.pow(Math.max(0, galaxies - 50) , 3)
		if (hasAch("r121") && !inNGM(3)) y += 1e-5 * Math.pow(Math.max(galaxies - 500, 0), 4) 
		y *= .08*(tmp.ic_power+14)
		if (player.infinityUpgrades.includes("postinfi60") && inNGM(3)) y *= Math.log10(Math.max(galaxies - 50, 1)) * 2.5 + 1
		if (inNGM(4)) y += .25 * Math.sqrt(y + (2.5 / 9 * galaxies))
	}
	if (hasAch("r121")) y *= Math.log(3+galaxies)
	if (hasGSacUpg(52) && !inNGM(3)) {
		if (y > 100) y = Math.pow(1e4 * y , 1/3)
	} else if (y > 100 && !inNGM(3)) {
		y = Math.pow(316.22 * y, 1/3)
	} else if (y > 10) {
		y = Math.pow(10 * y, .5)
	}
	if (hasAch("r121")) y += 10
	return y
}

function getGSDimboostExp(galaxies){
	let z = 1
	if (tmp.ic_power > 3) {
		z = 0.06 * (tmp.ic_power + 14)
		z += galaxies / 100
		if (!inNGM(3)) z *= Math.log(galaxies + 3)
	}
	return z
}

function getD8Exp(){
	let exp = 1
	let logBestAM = player.totalmoney.add(10).log10()
	if (hasAch("r124")) {
		let div = 30
		if (player.currentEternityChall == "") div += 12
		else if (player.achievements.length > 90) div -= .1 * (player.achievements.length - 90)
		let amt = getAmount(8) / div
		if (amt > 1048576) amt = Math.pow(Math.log2(amt) / 5, 10) // 1048576 = 2^20 = 4^10
		if (amt > 1024) amt = 24 + Math.pow(Math.log2(amt), 3)
		exp += amt
		if (logBestAM > 2.75e6) {
			let exp2 = Math.min(1.3, 1 + logBestAM / 1e8 + Math.sqrt(logBestAM / 275) / 3000)
			exp = Math.pow(exp, exp2)
		}
	}
	return exp
}

function galacticSacrifice(auto, force, chall) {
	if (getGSAmount().eq(0) && !force) return
	if (tmp.ri) return
	if (player.options.gSacrificeConfirmation && !auto && !force) if (!confirm("Galactic Sacrifice will act like a Galaxy reset, but will remove all your Galaxies in exchange for Galaxy Points to buy powerful upgrades. It will take a lot of time to recover initially. Are you sure you want to do this?")) return
	if (player.options.challConf && chall) if (!confirm("You will Galactic Sacrifice without gaining anything. You need to Galactic Sacrifice with special conditions to complete this challenge. Some Galaxy Points gain multipliers won't work in this challenge.")) return
	if (!force) {
		player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.add(getGSAmount())
		player.galacticSacrifice.times++
	}
	if (chall) {
		player.galacticSacrifice.chall = chall
		TAB_CORE.open("dim")
	}
	if (inNGM(4)) {
		if (!force) {
			if (!player.challenges.includes("challenge1")) player.challenges.push("challenge1")
			if (player.galacticSacrifice.chall) {
				if (!player.challenges.includes("challenge" + player.galacticSacrifice.chall)) player.challenges.push("challenge" + player.galacticSacrifice.chall)
				player.challengeTimes[player.galacticSacrifice.chall - 2] = Math.min(player.challengeTimes[player.galacticSacrifice.chall - 2], player.galacticSacrifice.time)
			}
			if (player.challenges.length > 1) giveAchievement("Daredevil")
			if (player.challenges.length == getTotalNormalChallenges() + 1) giveAchievement("AntiChallenged")
			if (player.challenges.length == getTotalNormalChallenges() + player.infchallengeTimes.length + 1) giveAchievement("Anti-antichallenged")
			if (inNC(2) && player.galacticSacrifice.time <= 1800) giveAchievement("Many Deaths")
			if (inNC(11) && player.galacticSacrifice.time <= 1800) giveAchievement("Gift from the Gods")
			if (inNC(5) && player.galacticSacrifice.time <= 1800) giveAchievement("Is this hell?")
			if (inNC(3) && player.galacticSacrifice.time <= 100) giveAchievement("You did this again just for the achievement right?");
			if (player.firstAmount == 1 && player.resets == 0 && player.galaxies == 0 && inNC(12)) giveAchievement("ERROR 909: Dimension not found")
		}
		if (!chall && (force || !player.options.retryChallenge)) delete player.galacticSacrifice.chall
		el("challengeconfirmation").style.display = "inline-block"
		updateChallenges()
		updateChallengeTimes()
		updateAutobuyers()
	}

	if (!auto && !force && isAnimationOn("gSac")) {
		doGalSacAni()
		setTimeout(() => doReset("galSac"), 1000)
	} else doReset("galSac")
}

function resetGalacticSacrificeData(eternity) {
	return inNGM(2) ? {
		galaxyPoints: hasAch("r33") && !eternity ? player.infinityPoints.div(10).pow(2) : E(0),
		time: 0,
		times: 0,
		upgrades: []
	} : undefined
}

function newGalacticDataOnInfinity(eternity) {
	if (inNGM(2) && (eternity ? getEternitied() > 6 : hasAch("r3"+(!inNGM(3)?6:3)))) {
		var data = player.galacticSacrifice
		data.galaxyPoints = !inNGM(3) ? (eternity ? data.galaxyPoints : data.galaxyPoints.add(getGSAmount())) : E(0)
		if (inNGM(3)) data.times = 0
		data.time = 0
		return data
	} else return resetGalacticSacrificeData()
}

function isIC3Trapped() {
	return player.galacticSacrifice || player.currentEternityChall === "eterc14" || inQC(6)
}

//v1.2

let galCosts = {
	11: 1,
	21: 1,
	41: "1e3800",
	51: "1e5500",
	22: 5,
	42: "1e4000",
	52: "1e8000",
	23: 100,
	43: "1e4200",
	53: "1e25000",
	14: 300,
	24: 1e3,
	34: 1e17,
	15: 1,
	25: 1e3,
	35: 2e3,
	16: 1e16,
	26: 1e18,
	36: 1e22,
	"41ngm4": 1e23,
	"42ngm4": 1e25,
	"43ngm4": 1e28,
	"44ngm4": 1e31,
	"45ngm4": 1e34,
	"46ngm4": 1e40 
}

function getGalaxyUpgradeCost(i){
	if (mod.ngmX==4){
		if (galCosts[i+"ngm4"]) return E(galCosts[i+"ngm4"])
	}
	return galCosts[i]
}

function buyGalaxyUpgrade(i) {
	var cost = getGalaxyUpgradeCost(i)
	if (hasGSacUpg(i) || !(Math.floor(i/10) < 2 || hasGSacUpg(i-10)) || player.galacticSacrifice.galaxyPoints.lt(cost)) return
	player.galacticSacrifice.upgrades.push(i)
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.sub(cost)
	if (i == 11) {
		if (hasAch("r21")) {
			for (var d = 1; d < 9; d++) {
				var name = dimTiers[d]
				player[name + "Cost"] = player[name + "Cost"].mul(10)
				if (inNGM(4)) player["timeDimension" + d].cost = player["timeDimension" + d].cost.mul(10)
			}
		}
		reduceDimCosts(true)
	}
	if (i == 41 && !inNGM(4)) for (var tier = 1; tier < 9; tier++) {
		let dim = player["infinityDimension" + tier]
		dim.power = E_pow(getInfBuy10Mult(tier), dim.baseAmount/10)
	}
	if (i == 42 && !inNGM(4)) for (var tier = 1; tier < 9; tier++) {
		let dim = player["infinityDimension" + tier]
		dim.cost = E_pow(getIDCostMult(tier), dim.baseAmount / 10).mul(infBaseCost[tier])
	}
	if (i == 53) {
		player.infMult = E(1)
		player.infMultCost = E(10)
	}
}

function reduceDimCosts(upg) {
	let div = 1
	if (hasAch("r21")) div = 10
	if (hasGSacUpg(11)) div = galMults.u11()
	for (var d = 1; d < 9; d++) {
		var name = dimTiers[d]
		if (inNGM(4) && !upg) {
			player[name + "Cost"] = player[name + "Cost"].pow(1.25).mul(10)
			player.costMultipliers[d - 1] = player.costMultipliers[d - 1].pow(1.25)
		}
		player[name + "Cost"] = player[name + "Cost"].div(div)
		if (inNGM(4)) player["timeDimension" + d].cost = player["timeDimension" + d].cost.div(div)
	}
	if (hasAch('r48') && !inNGM(3)) player.tickSpeedCost = player.tickSpeedCost.div(div)
}

function galacticUpgradeSpanDisplay () {
	el("galaxyPoints").innerHTML = "You have <span class='GPAmount'>"+shortenDimensions(player.galacticSacrifice.galaxyPoints)+"</span> Galaxy point"+(player.galacticSacrifice.galaxyPoints.eq(1)?".":"s.")
	el('galcost33').innerHTML = shortenCosts(getGalaxyUpgradeCost(33))
	if (inNGM(3)) {
		el('galcost24').textContent = shortenCosts(1e3)
		el('galcost34').textContent = shortenCosts(1e17)
	}
	if (inNGM(4)) {
		el('galcost25').textContent = shortenCosts(1e3)
		el('galcost35').textContent = shortenCosts(2e3)
		el('galcost16').textContent = shortenCosts(1e16)
		el('galcost26').textContent = shortenCosts(1e18)
		el('galcost36').textContent = shortenCosts(1e22)
		el('galcost41').textContent = shortenCosts(1e23)
		el('galcost42').textContent = shortenCosts(1e25)
		el('galcost43').textContent = shortenCosts(1e28)
		el('galcost44').textContent = shortenCosts(1e31)
		el('galcost45').textContent = shortenCosts(1e34)
		el('galcost46').textContent = shortenCosts(1e40) 
	} else if (player.infinityUpgrades.includes("postinfi63")) {
		el("galcost41").textContent = shortenCosts(E("1e3800"))
		el("galcost42").textContent = shortenCosts(E("1e4000"))
		el("galcost43").textContent = shortenCosts(E("1e4200"))
	}
	if (player.infinityUpgrades.includes("postinfi63")) {
		el("galcost51").textContent = shortenCosts(E("1e5500"))
		el("galcost52").textContent = shortenCosts(E("1e8000"))
		el("galcost53").textContent = shortenCosts(E("1e25000"))
	}
}

function updateGalaxyUpgradesDisplay(){
	var text41 = inNGM(4) ? "Square g11, and tickspeed boosts multiply GP gain." : "Galaxy points boost per-10 bought Infinity Dimensions multiplier."
	el("galaxy41").innerHTML = text41 + "<br>Cost: <span id='galcost41'></span> GP"
	var text42 = inNGM(4) ? "Buff g12 and make it post dilation." : "Eternity Points reduce Infinity Dimension cost multipliers."
	el("galaxy42").innerHTML = text42 + "<br>Cost: <span id='galcost42'></span> GP"
	var text43 = inNGM(4) ? "Reduce Dimension Boost cost multiplier by 1, and Dimension Boosts multiply GP gain." : "Galaxy points boost Time Dimensions."
	var curr43 = inNGM(4) ? "" : "<br>Currently: <span id='galspan43'>?</span>x"
	el("galaxy43").innerHTML = text43 + curr43 + "<br>Cost: <span id='galcost43'></span> GP"
}

function galacticUpgradeButtonTypeDisplay() {
	let t = el("galUpgs")
	for (let i = 1; i <= 5; i++) { //5 rows
		var r = t.rows[i-1]
		if (!galConditions["r"+i] || galConditions["r"+i]()) {
			r.style.display = ""
			for (let j = 1; j <= 6; j++) { //6 columns
				var c = r.cells[j-1]
				if (!galConditions["c"+j] || galConditions["c"+j]()) {
					c.style.display = ""
					var e = el('galaxy' + i + j);
					if (hasGSacUpg(+(i + '' + j))) {
						e.className = 'infinistorebtnbought'
					} else if (player.galacticSacrifice.galaxyPoints.gte(getGalaxyUpgradeCost(i + '' + j)) && (i === 1 || hasGSacUpg(+((i - 1) + '' + j)))) {
						e.className = 'galaxyupgbtn'
					} else {
						e.className = 'infinistorebtnlocked'
					}
					if (galMults["u"+i+j] !== undefined) {
						a = 0
						if (i * 10 + j == 11 || i * 10 + j == 15) {
							if (player.infinitied > 0 || player.eternities !== 0 || quantumed) el('galspan' + i + j).textContent = shortenDimensions(galMults["u" + i + j]())
						} else if (i * 10 + j == 31 || i * 10 + j == 25) el("galspan" + i + j).textContent = galMults["u" + i + j]().toFixed(2)
						else if (i * 10 + j == 43 && inNGM(4)) a = 0
						else if (i * 10 + j == 46 && inNGM(4)) el("galspan46").textContent = shorten(galMults["u46"]() * 100 - 100)
						else el("galspan" + i + j).textContent = shorten(galMults["u" + i + j]())
					}
				} else c.style.display = "none"
			}
		} else r.style.display = "none"
	}
}

//v1.295
function resetTotalBought() { //uhh what does this do?
	if (inNGM(2)) return {}
}

function productAllTotalBought() {
	var ret = 1;
	var mult = getProductBoughtMult()
	for (var i = 1; i <= 8; i++) {
		if (inNC(13) && inNGM(3)) ret = Decimal.mul(player[dimTiers[i] + "Amount"].max(1).log10(), mult).add(1).mul(ret);
		else if (player.totalBoughtDims[dimTiers[i]]) ret = Decimal.mul(ret, player.totalBoughtDims[dimTiers[i]] ? Decimal.mul(player.totalBoughtDims[dimTiers[i]], mult).max(1) : 1);
	}
	return ret;
}

function productAllTotalBought1() {
	return Math.pow(Decimal.max(productAllTotalBought(), 10).log10() ,2);
}

function productAllDims1(){
	var ret = E(0)
	for (var i = 1; i <= 8; i++) {
		ret = ret.add(Math.max(player[dimTiers[i] + "Amount"].max(1).log10(),0));
	}
	return ret.max(1)
}

el("challenge13").onclick = function () {
	startNormalChallenge(13)
}

//v1.3
function gSacrificeConf() {
	el("gConfirmation").checked = player.options.gSacrificeConfirmation
	player.options.gSacrificeConfirmation = !player.options.gSacrificeConfirmation
	el("gSacConfirmBtn").textContent = "Galactic Sacrifice confirmation: " + (player.options.gSacrificeConfirmation ? "ON" : "OFF")
}

el("challenge14").onclick = function () {
	startNormalChallenge(14)
}

function updateTBTIonGalaxy() {
	if (inNGM(2)) return {current: player.tickBoughtThisInf.current, pastResets: [{resets: 0, bought: player.tickBoughtThisInf.current}]}
}

function resetTickBoughtThisInf() {
	if (inNGM(2)) return {current: 0, pastResets: [{resets: 0, bought: 0}]}
}

function upgradeSacAutobuyer() {
	let cost = player.autoSacrifice.cost
	if ((inNGM(4) ? player.galacticSacrifice.galaxyPoints : player.infinityPoints).lt(cost)) return false
	if (inNGM(4)) player.galacticSacrifice.galaxyPoints=player.galacticSacrifice.galaxyPoints.sub(cost)
	else player.infinityPoints = player.infinityPoints.sub(cost)
	if (player.autoSacrifice.interval > 100) {
		player.autoSacrifice.interval = Math.max(player.autoSacrifice.interval * 0.6, 100);
		if (player.autoSacrifice.interval > 120) player.autoSacrifice.cost *= 2; // if your last purchase wont be very strong, dont double the cost
	}
	updateAutobuyers();
}

//v1.4
function getPost01Mult() {
	return Math.min(Math.pow(player.infinitied + 1, .3), Math.pow(Math.log(player.infinitied + 3), 3))
}

el("postinfi01").onclick = function() {
	buyInfinityUpgrade("galPointMult",!inNGM(3)?1e3:1e4);
}

el("postinfi02").onclick = function() {
	buyInfinityUpgrade("dimboostCost",!inNGM(3)?2e4:1e5);
}

el("postinfi03").onclick = function() {
	buyInfinityUpgrade("galCost",5e5);
}

el("postinfi04").onclick = function() {
	if (player.infinityPoints.gte(player.dimPowerIncreaseCost) && player.extraDimPowerIncrease < 40) {
		player.infinityPoints = player.infinityPoints.minus(player.dimPowerIncreaseCost)
		player.dimPowerIncreaseCost = E(!inNGM(3) ? 1e3 : 3e5).mul(E_pow(4, Math.min(player.extraDimPowerIncrease, 15) + 1));
		player.extraDimPowerIncrease += 1;
		if (player.extraDimPowerIncrease > 15) player.dimPowerIncreaseCost = player.dimPowerIncreaseCost.mul(E_pow(E_pow(4, 5), player.extraDimPowerIncrease - 15))
		el("postinfi04").innerHTML = "Further increase all Dimension multipliers<br>x^" + galMults.u31().toFixed(2) + (player.extraDimPowerIncrease < 40 ? " → x^" + ((galMults.u31() + 0.02).toFixed(2)) + "<br>Cost: " + shorten(player.dimPowerIncreaseCost) + " IP" : "")
	}
}

//v1.41
function galIP(){
	let gal = player.galaxies
	let rg = player.replicanti.galaxies
	if (hasTimeStudy(132)) rg *= 1.4
	if (hasTimeStudy(133)) rg *= 1.5
	if (hasAch("r122")) gal += 100*rg 
	if (gal < 5) return gal
	if (gal < 50) return 2 + Math.pow(5 + gal,0.6)
	return Math.min(Math.pow(gal, .4) + 7, 155)
}

//v1.5
function renameIC(id) {
	let split=id.split("postc")
	if (split[1]) id=order[parseInt(split[1])-1]
	return id
}

//v1.501
function isADSCRunning() {
	return inNC(13) || (player.currentChallenge === "postc1" && inNGM(2)) || inNGM(3)
}

//v1.6
el("postinfi50").onclick = function() {
	buyInfinityUpgrade("postinfi50", !inNGM(3)?1e25:2e18);
}

el("postinfi51").onclick = function() {
	buyInfinityUpgrade("postinfi51", !inNGM(3)?1e29:1e20);
}

el("postinfi52").onclick = function() {
	buyInfinityUpgrade("postinfi52", !inNGM(3)?1e33:1e25);
}

el("postinfi53").onclick = function() {
	buyInfinityUpgrade("postinfi53", !inNGM(3)?1e37:1e29);
}

//v1.9
el("postinfi60").onclick = function() {
	buyInfinityUpgrade("postinfi60", 1e50);
}

el("postinfi61").onclick = function() {
	buyInfinityUpgrade("postinfi61", E("1e450"));
}

el("postinfi62").onclick = function() {
	buyInfinityUpgrade("postinfi62", E("1e700"));
}

el("postinfi63").onclick = function() {
	buyInfinityUpgrade("postinfi63", E("1e2000"));
}

function getNewB60Mult(){
	let gal = player.galaxies-95
	return pow10((120 * gal)).max(1)
}

function getB60Mult() {
	let gal = player.galaxies
	if (gal >= 295 && getEternitied() > 0) return E_pow(3,200).mul(E_pow(2.5,gal-295))
	return E_pow(3, gal - 95).max(1)
}

//v2.3
let R127 = Math.pow(0.5772156649 + .5 * Math.pow(Math.PI,.5) + 3.35988 + 0.43828 + 0.95531, 0.739085 + 1.30637) 
//.5772156649 is the E-M constant, .5*Math.pow(Math.PI,.5) is root(pi)/2, 0.739085 is the unique real solution to cos(x)=x, 
// 1.30637 is Mills constant, 3.35988 is an approximation of the sum of the recipricals of fibonacci numbers, 0.43828 is the real part of the infinite power tower of i 
// 0.95531 is artan(root2)
	
let R135 = Math.pow(Math.E + Math.PI + 0.56714 + 4.81047 + 0.78343 + 1.75793 + 2.286078 + 1.20205, 1.45136 + .829626)
// obviously e and pi, .286078 + .8296262 are the values given in the achievement 
// 0.56714 is the infinite power towers of 1/e, 0.78343 integral from 0 to 1 of x^x, 4.81047 principal root of i^-i 
// 1.45136 is the root of li, 1.75793 = root(1+root(2+root(3+... , 1.20205 = sum of reciprocals of cubes

//v2.31
let galMults = {
	u11() {
		if (inNGM(3)) {
			var e = hasGSacUpg(46) ? galMults["u46"]() : 1
			var exp = (inNGM(4) && hasGSacUpg(41)) ? 2 * e : 1
			var l = 0
			if (player.infinityUpgrades.includes("postinfi61")) l = Math.log10(getInfinitied() + 1)
			if (l > 2) return pow10(l * Math.min(l, 6) * Math.min(l, 4))
			return pow10(2 + Math.min(4, getInfinitied())).pow(exp)
		}
		if (tmp.ec_eff > 53) return pow10(2e4)
		let x = getG11Infinities()
		let z = getG11Divider()
		
		//define y
		let y = 2 // it'll get overwritten no matter what
		if (x > 99) y = Math.pow(Math.log(x), Math.log(x) / z) + 14
		else if (x > 4) y = Math.sqrt(x + 5) + 4
		else y = x + 2
		if (hasAch("r82")) y += 30
		
		//softcap y
		if (y > 1000) y = Math.sqrt(1000 * y)
		if (y > 1e4) y = Math.pow(1e8 * y,1/3)
		return pow10(Math.min(y, 2e4));
	},
	u31() {
		let x = 1.1 + player.extraDimPowerIncrease * 0.02
		return x
	},
	u51() {
		let x = player.galacticSacrifice.galaxyPoints.max(1).log10() / 1e3
		if (x > 200) x = Math.sqrt(x * 200)
		return pow10(x)
	},
	u12() {
		var r = 2 * Math.pow(1 + player.galacticSacrifice.time / 600, 0.5)
		if (inNGM(4) && hasGSacUpg(42)) {
			m = hasGSacUpg(46) ? 10 : 4
			r = E_pow(r, Math.min(m, Math.pow(r, 1/3)))
			if (hasGSacUpg(46)) r = E_pow(r, Math.log10(10 + r)).add(1e20)
		}
		r = Decimal.add(r, 0)
		if (r.gt(1e25)) r = r.div(1e25).pow(.5).mul(1e25)
		if (r.gt(1e30)) r = r.div(1e30).pow(.4).mul(1e30)
		if (r.gt(1e35)) r = r.div(1e35).pow(.3).mul(1e35)
		return r
	},
	u32() {
		let x = player.totalmoney
		let exp = .003
		if (hasAch("r123")) exp = .005
		if (inNGM(4)){
			m = 1
			if (hasAch("r63")) m += .01 * player.galacticSacrifice.upgrades.length
			if (hasAch("r64")) m += .02 * tmp.ic_power
			exp *= m
		}
		let l = Math.max(player.galacticSacrifice.galaxyPoints.log10() - 5e4, 0)
		if (hasAch("r123")) exp += Math.min(.005, l / 2e8)
		if (!player.break) x = x.min(Number.MAX_VALUE)
		if (hasAch("r113")) exp += exp/60
		if (exp > .01) exp = Math.log10(10000 * exp)/200
		if (x.gt(1)){
			y = x.log10()
			if (y > 1e7) y = Math.pow(Math.log10(y) + 3, 7)
			x = pow10(y)
		}
		return x.pow(exp).add(1)
	},
	u13() {
		exp = calcG13Exp()
		x = player.galacticSacrifice.galaxyPoints.div(5)
		if (x.gt(1)){
			y = x.log10()
			if (y > 5e5) y = Math.sqrt(5e5*y)
			x = pow10(y)
		}
		return x.add(1).pow(exp)
	},
	u23() {
		let x = player.galacticSacrifice.galaxyPoints.max(1).log10() * .75 + 1
		if (hasAch("r138")) x *= Decimal.add(player.dilation.bestIP,10).log10()
		return x
	},
	u33() {
		if (inNGM(3)) return player.galacticSacrifice.galaxyPoints.div(1e10).add(1).log10()/5+1
		return player.galacticSacrifice.galaxyPoints.max(1).log10() / 4 + 1
	},
	u43() {
		return E_pow(player.galacticSacrifice.galaxyPoints.log10(), 50)
	},
	u24() {
		return player.galacticSacrifice.galaxyPoints.pow(0.25).div(20).max(0.2)
	},
	u15() {
		return pow10(getInfinitied() + 2).max(1).min(1e6).pow(hasGSacUpg(16) ? 2 : 1)
	},
	u25() {
		let r = Math.max(player.galacticSacrifice.galaxyPoints.log10() - 2, 1)
		if (r > 2.5) r = Math.pow(r * 6.25, 1/3)
		r = Math.pow(r, hasGSacUpg(26) ? 2 : 1)
		if (r > 10) r = 10 * Math.log10(r)
		return r
	},
	u35() {
		let r = E(1)
		let p = getProductBoughtMult()
		for (var d = 1; d < 9; d++) {
			r = Decimal.mul(player["timeDimension" + d].bought / 6, p).max(1).mul(r)
		}
		r = r.pow(hasGSacUpg(36) ? 2 : 1)
		if (r.gt(1e100)) r = E_pow(r.log10(), 50)
		return r
	},
	u46() {
		var r = Math.pow(player.galacticSacrifice.galaxyPoints.add(10).log10(), .2) - 1
		if (r < 1) return 1
		if (r > 2) return 2
		return r
	}
}

let galConditions = {
	r4: function() {
		var unl = player.challenges.includes("postcngmm_1") || player.eternities > 0
		return player.infinityUpgrades.includes("postinfi63") || (inNGM(4) && unl)
	},
	r5: function() {
		return player.infinityUpgrades.includes("postinfi63")
	},
	c4: function() {
		return inNGM(3)
	},
	c5: function() {
		return inNGM(4)
	},
	c6: function(){
		return inNGM(4) && player.totalmoney.log10() >= 666
	}
}

//v2.4
function getGSoffset(offset=0) {
	return getGSAmount(offset)
}

function getG11Infinities() {
	let x = getInfinitied()
	let e = getEternitied()
	if (e == 0 && x > 1e6) x = Math.min(Math.pow(x * 1e12, 1/3), 1e7)
	if (e > 0 && x < 1e8 && tmp.ic_power > 0) x += 2e6
	if (player.infinityUpgrades.includes("postinfi61")) x += 1e7
	if (player.infinityUpgrades.includes("postinfi61") && player.galacticSacrifice.upgrades.length > 9) x += player.galacticSacrifice.upgrades.length * 1e7
	x += tmp.ec_eff * 1e10
	if (x > 1e8) x = Math.sqrt(x * 1e8)
	return x
}

function getG11Divider(){
	let z = 10
	let c = tmp.ic_power // challenges completed
	if (c > 0 && player.challenges.includes("postcngmm_1")) z -= (c + 6) / 4
	if (c > 6) z += 0.085 * tmp.ic_power - 0.31
	if (player.infinityUpgrades.includes("postinfi61")) z -= .1
	z -= Math.pow(tmp.ec_eff, 0.3)/10
	if (getEternitied() > 0) z -= 0.5
	if (z < 6) z = Math.pow(1296 * z, .2)
	return z
}

//v3
function getNewB60Mult(){
	let gal = player.galaxies - 95
	if (gal < 0) gal = 0
	return pow10(120 * gal)
}

function calcG13Exp(){
	let exp = 3
	if (player.infinityUpgrades.includes("postinfi62") && hasAch("r117") && !inNGM(3)) {
		if (player.currentEternityChall === "") exp *= Math.pow(.8 + Math.log(player.resets + 3), 2.08)
		else if (player.currentEternityChall == "eterc9" || player.currentEternityChall == "eterc7" || player.currentEternityChall == "eterc6") {
			exp *= Math.pow(.8 + Math.log(player.resets + 3) * (hasAch("r124") ? (8 - player.bestEternity || 6) : 1), 0.5 + hasAch("r124") ? 0.5 : 0)
		}
		else exp *= Math.pow(.8 + Math.log(player.resets+3), 0.5 + hasAch("r124") ? 0.1 : 0)
	} else if (player.infinityUpgrades.includes("postinfi62")){
		if (player.currentEternityChall === "") exp *= Math.pow(Math.log(player.resets + 3), 2)
		else exp *= Math.pow(Math.log(player.resets + 3), 0.5)
	}
	if (inNGM(3) && hasAch("r101")) exp *= Math.pow(Math.max(1, 2*player.galaxies), 1/3)
	if (hasAch("r81") && player.currentEternityChall === "") exp += 7
	if (inNGM(3) && exp > 100) exp = Math.sqrt(exp) * 10
	if (inNGM(3) && hasAch("r117")) exp += Math.sqrt(exp)
	return exp
}

//Unknown
function gSacrificeUnl() {
	return inNGM(2) && (player.galaxies || gSacrificed() || infinitied())
}

function gSacrificed() {
	return inNGM(2) && (player?.galacticSacrifice?.times || infinitied())
}

function hasGSacUpg(x) {
	return inNGM(2) && player.galacticSacrifice.upgrades.includes(x)
}

function updateNGM2RewardDisplay(){
	el("postcngmm_1reward").innerHTML = "Reward: Infinity upgrades based on time " + (inNGM(4) ? "" : "or Infinities ") + "are applied post-dilation, and make the GP formula better based on galaxies."
	el("postcngm3_1description").innerHTML = "Multiplier per ten Dimensions is 1x, Dimension Boosts have no effect," + (inNGM(4) ? " have a much lower Time Dimension cost limit," : "") + " and Tickspeed Boost effect softcap starts immediately."
	el("postcngm3_1reward").innerHTML = "Reward: Weaken tickspeed boost softcap" + (inNGM(4) ? ", Remote Galaxies scale 0.5 galaxies later, and triple GP per IC completion" : "") + "."
}

function displayGalSacStats(){
	if (!gSacrificed()) el("gsStatistics").style.display = "none"
	else {
		el("gsStatistics").style.display = ""
		el("sacrificed").textContent = "You have Galactic Sacrificed "+getFullExpansion(player.galacticSacrifice.times) + " times."
		el("thisSacrifice").textContent = "You have spent " + timeDisplay(player.galacticSacrifice.time) + " in this Galactic Sacrifice."
	}
}

function galSacDisplay(){
	if (gSacrificed() && !isEmptiness) el("galaxyPoints2").innerHTML = "You have <span class='GPAmount'>"+shortenDimensions(player.galacticSacrifice.galaxyPoints)+"</span> Galaxy point"+(player.galacticSacrifice.galaxyPoints.eq(1)?".":"s.")
	galSacBtnUpdating()
}

function galSacBtnUpdating(){
	el("sacrificebtn").style.display = "none"
	el("gSacrifice").style.display = gSacrificeUnl()
	if (gSacrificeUnl()) {
		el("gSacrifice").innerHTML = "Galactic Sacrifice (" + formatValue(player.options.notation, getGSAmount(), 2, 0) + " GP)"
		el("gSacrifice").setAttribute('ach-tooltip', "Gain " + formatValue(player.options.notation, getGSAmount(), 2, 0) + " GP")
		if (getGSAmount().gt(0)) {
			el("gSacrifice").className = "storebtn"
			el("sacrificebtn").style.display = ""
			var currentGPmin = getGSAmount().dividedBy(player.galacticSacrifice.time / 600)
			if (currentGPmin.gt(GPminpeak)) GPminpeak = currentGPmin
			var notationOkay = (GPminpeak.gt("1e300000") && player.options.theme != "Aarex's Modifications") || player.options.notation == "Morse code" || player.options.notation == 'Spazzy'
			var notation2okay = (GPminpeak.gt("1e3000") && player.options.theme != "Aarex's Modifications") || player.options.notation == "Morse code" || player.options.notation == 'Spazzy'
			el("sacrificebtn").innerHTML = (notationOkay ? "Gain " : "Galactic Sacrifice for ") + shortenDimensions(getGSAmount()) + " Galaxy points." +
				(notation2okay ? "" : "<br>" + shortenMoney(currentGPmin) + " GP/min" + "<br>Peaked at " + shortenMoney(GPminpeak) + " GP/min")
		} else el("gSacrifice").className = "unavailablebtn"
	}
}

function passiveGPGen(diff){
	let passiveGPGen = false
	if (inNGM(3)) passiveGPGen = hasAch("r56")
	else if (inNGM(2)) passiveGPGen = hasTimeStudy(181)
	var mult = 1
	if (inNGM(4)){
		if (hasAch("r43")){
			mult = Math.pow(player.galacticSacrifice.galaxyPoints.add(1e20).log10() / 10, 2) /2
		}
		if (mult > 100) mult = 100
	}
	if (passiveGPGen) player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.add(getGSAmount().mul(diff / 100 * mult))
}

function doGPUpgCrunchUpdating(g11MultShown){
	var showg11Mult = player.infinitied > 0 || player.eternities !== 0 || quantumed
	if (inNGM(2) && (showg11Mult != g11MultShown)) {
		el("galaxy11").innerHTML = "Antimatter" + (inNGM(4) ? " and Time D" : " D")+"imensions are " + (showg11Mult ? "cheaper based on your Infinities.<br>Currently: <span id='galspan11'></span>x":"99% cheaper.")+"<br>Cost: 1 GP"
		el("galaxy15").innerHTML = "Antimatter and Time Dimensions produce " + (showg11Mult ? "faster based on your Infinities.<br>Currently: <span id='galspan15'></span>x":"100x faster")+".<br>Cost: 1 GP"
	}
}

function doGalSacAni() {
	el("body").style.animation = "gsac 2s 1";
	el("gsacani").style.display = "block"
	setTimeout(function() {
		el("gsacani1").style.opacity = 1
		el("gsacani1").style.width = "100%"
		el("gsacani1").style.left = "0"
		el("gsacani1").style.top = "0"
	}, 100)
	setTimeout(function() {
		el("gsacani1").style.opacity = 0
		el("gsacani1").style.width = "0%"
		el("gsacani1").style.left = "50%"
	}, 1500)
	setTimeout(function() {
		el("body").style.animation = ""
		el("gsacani").style.display = "none"
		el("gsacani1").style.top = "100%"
	}, 2e3)
}

//Global
function inNGM(x) {
	return mod.ngmX >= x
}
function inOnlyNGM(x) {
	return mod.ngmX == x
}

const MAX_NGMX = 4
function getNGMX(save = player) {
	let aMod = save.aarMod
	if (aMod?.ngmX) return aMod.ngmX
	return save.tdBoosts !== undefined ? 4 :
		save.tickspeedBoosts !== undefined ? 3 :
		save.galacticSacrifice !== undefined ? 2 : 0
}
function getGSAmount() {
	if (isEmptiness) return new Decimal(0)
	let galaxies = player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies;
	let y = 1.5 
	if (player.challenges.includes("postcngmm_1")) {
		y += Math.max(0, 0.05*(galaxies - 10)) + 0.005 * Math.pow(Math.max(0, galaxies-30) , 2) + 0.0005 * Math.pow(Math.max(0, galaxies-50) , 3)
		y *= .08*(tmp.cp+14)
	}
	if (y > 100) y = Math.pow(316.22*y, 2/5)
	else if (y > 10) y = Math.pow(10*y, .5)
	let z = 1
	if (tmp.cp>3) {
		z = 0.06*(tmp.cp+14)
		z += galaxies/100
		if (player.tickspeedBoosts == undefined) z *= Math.log(galaxies+3)
	}
	let resetMult = player.resets-(player.currentChallenge=="challenge4"?2:4)
	if (player.tickspeedBoosts !== undefined) resetMult = (resetMult+1)/2
	let ret = Decimal.pow(galaxies, y).times(Decimal.pow(Math.max(0, resetMult), z)).max(0)
	ret = ret.times(getAmount(8)/50+1)
	if (player.achievements.includes("r23") && player.tickspeedBoosts !== undefined) ret=ret.times(Decimal.pow(Math.max(player.tickspeedBoosts/10,1),Math.max(getAmount(8)/75,1)))
	if (player.galacticSacrifice.upgrades.includes(32)) ret = ret.times(galUpgrade32())
	if (player.infinityUpgrades.includes("galPointMult")) ret = ret.times(getPost01Mult())
	if (player.achievements.includes('r37')) {
		if (player.bestInfinityTime >= 18000) ret = ret.times(Math.max(180000/player.bestInfinityTime,1))
		else ret = ret.times(10*(1+Math.pow(Math.log10(18000/player.bestInfinityTime),2)))
	}
	if (player.achievements.includes("r62")) ret = ret.times(player.infinityPoints.max(10).log10())
	return ret.floor()
}

function galacticSacrifice(auto) {
	if (getGSAmount().eq(0)) return
	if (tmp.ri) return
	if (player.options.gSacrificeConfirmation&&!auto) if (!confirm("Galactic Sacrifice will do a galaxy reset, and then remove all of your galaxies, in exchange of galaxy points which can be use to buy many overpowered upgrades, but it will take a lot of time to recover, are you sure you wanna do this?")) return
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.plus(getGSAmount())
	player.galacticSacrifice.times++
	player.galacticSacrifice.time = 0
	GPminpeak = new Decimal(0)
	galaxyReset(-player.galaxies)
}

function resetGalacticSacrifice() {
	return player.galacticSacrifice ? {
		galaxyPoints: player.achievements.includes("r33")?player.infinityPoints.div(10).pow(2):new Decimal(0),
		time: 0,
		times: 0,
		upgrades: []
	} : undefined
}

function newGalacticDataOnInfinity() {
	if (player.galacticSacrifice&&player.achievements.includes("r3"+(player.tickspeedBoosts==undefined?6:3))) {
		var data=player.galacticSacrifice
		data.galaxyPoints=player.tickspeedBoosts==undefined?data.galaxyPoints.add(getGSAmount()):new Decimal(0)
		data.time=0
		return data
	} else return resetGalacticSacrifice()
}

function isIC3Trapped() {
	return player.galacticSacrifice || player.currentEternityChall === "eterc14" || inQC(6)
}

//v1.2

let galUpgradeCosts = {
	11: 1,
	21: 1,
	22: 5,
	23: 100,
	14: 300,
	24: 1e3,
	34: 1e17
}

function buyGalaxyUpgrade(i) {
	if (player.galacticSacrifice.upgrades.includes(i) || !(Math.floor(i/10)<2 || player.galacticSacrifice.upgrades.includes(i-10)) || player.galacticSacrifice.galaxyPoints.lt(galUpgradeCosts[i])) return
	player.galacticSacrifice.upgrades.push(i)
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.sub(galUpgradeCosts[i])
	if (i==11) {
		if (player.achievements.includes("r21")) {
			for (d=1;d<9;d++) {
				var name = TIER_NAMES[d]
				player[name+"Cost"] = player[name+"Cost"].times(10)
			}
		}
		reduceDimCosts()
	}
}

function reduceDimCosts() {
	if (player.galacticSacrifice) {
		let div=1
		if (player.achievements.includes("r21")) div=10
		if (player.galacticSacrifice.upgrades.includes(11)) div=galUpgrade11()
		for (d=1;d<9;d++) {
			var name = TIER_NAMES[d]
			if (player.aarexModifications.ngmX>3) {
				player[name+"Cost"] = player[name+"Cost"].pow(1.25).times(10)
				player.costMultipliers[d-1] = player.costMultipliers[d-1].pow(1.25)
			}
			player[name+"Cost"] = player[name+"Cost"].div(div)
		}
		if (player.achievements.includes('r48') && player.tickspeedBoosts == undefined) player.tickSpeedCost = player.tickSpeedCost.div(div)
	}
	if (player.infinityUpgradesRespecced != undefined) {
		for (d=1;d<9;d++) {
			var name = TIER_NAMES[d]
			player[name+"Cost"] = player[name+"Cost"].div(Decimal.pow(getDiscountMultiplier("dim" + d), player.dimtechs.discounts))
		}
		player.tickSpeedCost = player.tickSpeedCost.div(Decimal.pow(getDiscountMultiplier("tick"), player.dimtechs.discounts))
	}
}

let galUpgrade11 = function () {
	let x = Math.min(player.infinitied, player.tickspeedBoosts !== undefined ? 4 : 1e6);
	let y = Math.max(x + 2, 2);
	let z = 10
	if (tmp.cp > 0 && player.challenges.includes("postcngmm_1") && player.tickspeedBoosts == undefined) z -= (tmp.cp+6)/4
	if (player.infinityUpgrades.includes("postinfi61")) {
		x += 1e7
		z -= .1
		if (player.galacticSacrifice.upgrades.length>9) x += player.galacticSacrifice.upgrades.length*1e7
	}
	if (z < 6) z = Math.pow(1296 * z, .2)
	if (x > 99) y = Math.pow(Math.log(x), Math.log(x) / z) + 14
	else if (x > 4) y = Math.pow(x + 5, .5) + 4
	return Decimal.pow(10, Math.min(y, 2e4));
}
let galUpgrade12 = function () {
	return 2 * Math.pow(1 + player.galacticSacrifice.time / 600, 0.5);
}
let galUpgrade13 = function () {
	let exp = 3
	if (player.infinityUpgrades.includes("postinfi62")) {
		if (player.currentEternityChall === "") exp *= Math.pow(Math.log(player.resets+3), 2)
		else exp *= Math.pow(Math.log(player.resets+3), 0.5)
	}
	return player.galacticSacrifice.galaxyPoints.div(5).plus(1).pow(exp)
}
let galUpgrade23 = function () {
	return player.galacticSacrifice.galaxyPoints.max(1).log10()*3/4+1
}
let galUpgrade31 = function () {
	return 1.1 + player.extraDimPowerIncrease * 0.02
}
let galUpgrade32 = function () {
	let x = player.totalmoney
	if (!player.break) x = x.min(Number.MAX_VALUE)
	return x.pow(0.003).add(1);
}
let galUpgrade33 = function () {
	if (player.tickspeedBoosts != undefined) return player.galacticSacrifice.galaxyPoints.div(1e10).add(1).log10()/5+1
	return player.galacticSacrifice.galaxyPoints.max(1).log10()/4+1
}

function galacticUpgradeSpanDisplay () {
	document.getElementById("galaxyPoints").innerHTML = "You have <span class='GPAmount'>"+shortenDimensions(player.galacticSacrifice.galaxyPoints)+"</span> Galaxy point"+(player.galacticSacrifice.galaxyPoints.eq(1)?".":"s.")
	if (player.infinitied>0||player.eternities!==0||quantumed) document.getElementById('galspan11').innerHTML = shortenDimensions(galUpgrade11())
	document.getElementById('galspan12').innerHTML = shorten(galUpgrade12())
	document.getElementById('galspan13').innerHTML = shorten(galUpgrade13())
	document.getElementById('galspan23').innerHTML = shorten(galUpgrade23())
	document.getElementById('galspan31').innerHTML = galUpgrade31().toFixed(2)
	document.getElementById('galspan32').innerHTML = shorten(galUpgrade32())
	document.getElementById('galspan33').innerHTML = shorten(galUpgrade33())
	document.getElementById('galcost33').innerHTML = shortenCosts(galUpgradeCosts[33])
	if (player.tickspeedBoosts!=undefined) {
		document.getElementById('galspan24').innerHTML = shorten(galUpgrade24())
		document.getElementById('galcost24').innerHTML = shortenCosts(1e3)
		document.getElementById('galcost34').innerHTML = shortenCosts(1e17)
	}
}

function galacticUpgradeButtonTypeDisplay () {
	for (let i = 1; i <= 3; i++) {
		for (let j = 1; j <= (player.tickspeedBoosts!=undefined?4:3); j++) {
			let e = document.getElementById('galaxy' + i + j);
			if (player.galacticSacrifice.upgrades.includes(+(i + '' + j))) {
				e.className = 'infinistorebtnbought'
			} else if (player.galacticSacrifice.galaxyPoints.gte(galUpgradeCosts[i + '' + j]) && (i === 1 || player.galacticSacrifice.upgrades.includes(+((i - 1) + '' + j)))) {
				e.className = 'infinistorebtn' + j;
			} else {
				e.className = 'infinistorebtnlocked'
			}
		}
	}
}

//v1.295
function resetTotalBought() {
	if (player.galacticSacrifice) return {}
}

function productAllTotalBought () {
	var ret = 1;
	var mult = getProductBoughtMult()
	for (i = 1; i <= 8; i++) {
		if (player.currentChallenge == "challenge13" && player.tickspeedBoosts != undefined) ret = Decimal.times(player[TIER_NAMES[i]+"Amount"].max(1).log10(),mult).add(1).times(ret);
		else if (player.totalBoughtDims[TIER_NAMES[i]]) ret = Decimal.times(ret,player.totalBoughtDims[TIER_NAMES[i]]?Decimal.times(player.totalBoughtDims[TIER_NAMES[i]],mult).max(1):1);
	}
	return ret;
}

function productAllTotalBought1 () {
	return Math.pow(Decimal.max(productAllTotalBought(),10).log10(),2);
}

function productAllDims1(){
	var ret = new Decimal(0)
	for (i = 1; i <= 8; i++) {
		ret = ret.add(Math.max(player[TIER_NAMES[i] + "Amount"].max(1).log10(),0));
	}
	return ret.min(1)
}

document.getElementById("challenge13").onclick = function () {
	startChallenge("challenge13", Number.MAX_VALUE);
}

//v1.3
function gSacrificeConf() {
	document.getElementById("gConfirmation").checked = player.options.gSacrificeConfirmation
	player.options.gSacrificeConfirmation = !player.options.gSacrificeConfirmation
	document.getElementById("gSacConfirmBtn").textContent = "Galactic Sacrifice confirmation: O" + (player.options.gSacrificeConfirmation ? "N" : "FF")
}

document.getElementById("challenge14").onclick = function () {
	startChallenge("challenge14", Number.MAX_VALUE);
}

function updateTBTIonGalaxy() {
	if (player.galacticSacrifice) return {current:player.tickBoughtThisInf.current,pastResets:[{resets:0,bought:player.tickBoughtThisInf.current}]}
}

function resetTickBoughtThisInf() {
	if (player.galacticSacrifice) return {current:0,pastResets:[{resets:0,bought:0}]}
}

function upgradeSacAutobuyer() {
	if (player.infinityPoints.lt(player.autoSacrifice.cost)) return false;
	player.infinityPoints = player.infinityPoints.minus(player.autoSacrifice.cost);
	if (player.autoSacrifice.interval > 100) {
		player.autoSacrifice.interval = Math.max(player.autoSacrifice.interval*0.6, 100);
		if (player.autoSacrifice.interval > 120) player.autoSacrifice.cost *= 2; //if your last purchase wont be very strong, dont double the cost
	}
	updateAutobuyers();
}

document.getElementById("buyerBtnGalSac").onclick = function () {
	buyAutobuyer(12);
}

//v1.4
function getPost01Mult() {
	return Math.min(Math.pow(player.infinitied + 1, .3), Math.pow(Math.log(player.infinitied + 3), 3))
}

document.getElementById("postinfi01").onclick = function() {
	buyInfinityUpgrade("galPointMult",player.tickspeedBoosts==undefined?1e3:1e4);
}

document.getElementById("postinfi02").onclick = function() {
	buyInfinityUpgrade("dimboostCost",player.tickspeedBoosts==undefined?2e4:1e5);
}

document.getElementById("postinfi03").onclick = function() {
	buyInfinityUpgrade("galCost",5e5);
}

document.getElementById("postinfi04").onclick = function() {
	if (player.infinityPoints.gte(player.dimPowerIncreaseCost) && player.extraDimPowerIncrease < 40) {
		player.infinityPoints = player.infinityPoints.minus(player.dimPowerIncreaseCost)
		player.dimPowerIncreaseCost = new Decimal(player.tickspeedBoosts==undefined?1e3:3e5).times(Decimal.pow(4,Math.min(player.extraDimPowerIncrease,15)+1));
		player.extraDimPowerIncrease += 1;
		if (player.extraDimPowerIncrease > 15) player.dimPowerIncreaseCost = player.dimPowerIncreaseCost.times(Decimal.pow(Decimal.pow(4,5),player.extraDimPowerIncrease-15))
		document.getElementById("postinfi04").innerHTML = "Further increase all dimension multipliers<br>x^"+galUpgrade31().toFixed(2)+(player.extraDimPowerIncrease<40?" -> x^"+((galUpgrade31()+0.02).toFixed(2))+"<br>Cost: "+shorten(player.dimPowerIncreaseCost)+" IP":"")
	}
}

//v1.41
function galIP(){
    let gal = player.galaxies
    if (gal<5) return gal
    if (gal<50) return 2+Math.pow(5+gal,0.6)
    return Math.pow(gal,.4)+7
}

//v1.5
function renameIC(id) {
	let split=id.split("postc")
	if (split[1]) id=order[parseInt(split[1])-1]
	return id
}

//v1.501
function isADSCRunning() {
	return player.currentChallenge === "challenge13" || (player.currentChallenge === "postc1" && player.galacticSacrifice) || player.tickspeedBoosts !== undefined
}

//v1.6
document.getElementById("postinfi50").onclick = function() {
    buyInfinityUpgrade("postinfi50",1e25);
}

document.getElementById("postinfi51").onclick = function() {
    buyInfinityUpgrade("postinfi51",1e29);
}

document.getElementById("postinfi52").onclick = function() {
    buyInfinityUpgrade("postinfi52",1e33);
}

document.getElementById("postinfi53").onclick = function() {
    buyInfinityUpgrade("postinfi53",1e37);
}

//v1.9
document.getElementById("postinfi60").onclick = function() {
    buyInfinityUpgrade("postinfi60",1e50);
}

document.getElementById("postinfi61").onclick = function() {
    buyInfinityUpgrade("postinfi61",new Decimal("1e450"));
}

document.getElementById("postinfi62").onclick = function() {
    buyInfinityUpgrade("postinfi62",new Decimal("1e700"));
}

document.getElementById("postinfi63").onclick = function() {
    buyInfinityUpgrade("postinfi63",new Decimal("1e2000"));
}

function getB60Mult() {
	return Decimal.pow(getEternitied()>0?2.5:3,player.galaxies-95).max(1)
}

function getPostC3Exp() {
	let g = getGalaxyPower(0)-player.dilation.freeGalaxies
	if (g<7) return 1+g/5
	return 2+Math.pow(g-5,0.5)/5
}
//test
var gameLoopIntervalId;
var Marathon = 0;
var Marathon2 = 0;
var auto = false;
var autoS = true;
var shiftDown = false;
var controlDown = false;
var justImported = false;
var saved = 0;
var painTimer = 0;
var keySequence = 0;
var keySequence2 = 0;
var failureCount = 0;
var implosionCheck = 0;
var break_infinity_js = 0 //option removed until break_infinity support is fixed
var forceHardReset = false;

//TO-DO: Move setup into another file.
function setupAutobuyerToggles(){
	for (let [i, key] of Object.entries(autoBuyerKeys)) {
		i = parseInt(i)
		el("ab_" + key + "_upg").onclick = () => buyAutobuyer(i+1)
		if (i < 9) el("ab_" + key + "_toggle").onclick = () => toggleAutobuyerTarget(i+1)
	}
}

function setupInfUpgHTMLandData(){
	var iut = el("preinfupgrades")
	for (let r = 1; r < 5; r++) {
		let row = iut.insertRow(r - 1)
		for (let c = 1; c < 5; c++) {
			var col = row.insertCell(c - 1)
			col.innerHTML = "<button id='infi" + (c * 10 + r) + "' class='infinistorebtn" + c + "'></button>"
		}
	}
	el("infi14").innerHTML = "Dimension Boosts and Galaxies require 9 less<br>Cost: 1 IP"
	el("infi24").innerHTML = "Galaxies are 2x stronger<br>Cost: 2 IP"
	el("infi11").onclick = function () {
		buyInfinityUpgrade("timeMult", 1);
	}
	el("infi21").onclick = function () {
		buyInfinityUpgrade("dimMult", 1);
	}
	el("infi12").onclick = function () {
		if (player.infinityUpgrades.includes("timeMult")) buyInfinityUpgrade("18Mult", 1);
	}
	el("infi22").onclick = function () {
		if (player.infinityUpgrades.includes("dimMult")) buyInfinityUpgrade("27Mult", 1);
	}
	el("infi13").onclick = function () {
		if (player.infinityUpgrades.includes("18Mult")) buyInfinityUpgrade("36Mult", 1);
	}
	el("infi23").onclick = function () {
		if (player.infinityUpgrades.includes("27Mult")) buyInfinityUpgrade("45Mult", 1);
	}
	el("infi14").onclick = function () {
		if (player.infinityUpgrades.includes("36Mult")) buyInfinityUpgrade("resetBoost", 1);
	}
	el("infi24").onclick = function () {
		if (player.infinityUpgrades.includes("45Mult")) buyInfinityUpgrade("galaxyBoost", 2);
	}
	el("infi31").onclick = function() {
		buyInfinityUpgrade("timeMult2", 3);
	}
	el("infi32").onclick = function() {
		if (player.infinityUpgrades.includes("timeMult2")) buyInfinityUpgrade("unspentBonus", 5);
	}
	el("infi33").onclick = function() {
		if (player.infinityUpgrades.includes("unspentBonus")) buyInfinityUpgrade("resetMult", 7);
	}
	el("infi34").onclick = function() {
		if (player.infinityUpgrades.includes("resetMult")) buyInfinityUpgrade("passiveGen", 10);
	}
	el("infi41").onclick = function() {
		buyInfinityUpgrade("skipReset1", 20);
	}
	el("infi42").onclick = function() {
		if (player.infinityUpgrades.includes("skipReset1")) buyInfinityUpgrade("skipReset2", 40)
	}
	el("infi43").onclick = function() {
		if (player.infinityUpgrades.includes("skipReset2")) buyInfinityUpgrade("skipReset3", 80)
	}
	el("infi44").onclick = function() {
		if (player.infinityUpgrades.includes("skipReset3")) buyInfinityUpgrade("skipResetGalaxy", 500)
	}
}

function setupDimensionHTML() {
	var html = ""
	for (let d = 1; d <= 8; d++) {
		html += `<tr id='${d}Row' style='font-size:15px'>
			<td id="D${d}" width="32%" style='position: relative'> </td>
			<td id="A${d}"></td>
			<td width="10%"><button id="B${d}" style="color:black; height: 30px; font-size: 10px; width: 140px" class="storebtn" onclick="buyOneDimension(${d})"></button></td>
			<td width="10%"><button id="M${d}" style="color:black; height: 30px; font-size: 10px; width: 180px" class="storebtn" onclick="buyManyDimension(${d})"></button></td>
		</tr>`
	}
	el("dimTable").innerHTML = html

	var html = ""
	for (let d = 1; d <= 8; d++) {
		html += `<tr id='infRow${d}' style='font-size:16px'>
			<td id="infD${d}" width="41%"></td>
			<td id="infAmount${d}"></td>
			<td><button id="infauto${d}" style="width:70px; font-size: 10px; float: right; visibility: hidden" onclick="switchAutoInf(${d})" class="storebtn"></button></td>
			<td width="10%"><button id="infMax${d}" style="color:black; width:195px; height:30px" class="storebtn" align="right" onclick="buyManyInfinityDimension(${d})"></button></td>
		</tr>`
	}
	el("infDimTable").innerHTML = html

	var html = ""
	for (let d = 1; d <= 8; d++) {
		html += `<tr id='timeRow${d}' style='font-size:17px'>
			<td id="timeD${d}" width="41%"></td>
			<td id="timeAmount${d}"></td>
			<td><button id="td${d}Auto" style="width:70px; font-size: 10px; float: right; visibility: hidden" onclick="toggleAutoEter('td${d}')" class="storebtn"></button></td>
			<td width="10%"><button id="timeMax${d}" style="color:black; width:195px; height:30px" class="storebtn" align="right" onclick="buyTimeDimension(${d})">Cost: 10</button></td>
		</tr>`
	}
	html += `<tr id="tdReset" style="font-size: 17px">
		<td id="tdResetLabel" colspan=3></td>
		<td><button id="tdResetBtn" style="color:black; width: 195px; height: 25px; font-size: 9px" class="storebtn" onclick="tdBoost(1)"></button></td>
	</tr>`
	el("timeDimTable").innerHTML = html
}

function setupHTMLAndData() {
	for (let i of Object.keys(TABS)) {
		if (i != "root") {
			el("tab_" + i).className = "tab"
			el("tab_" + i).align = "center"
		}
		if (TABS[i].stab != undefined) {
			el("tabs_" + i).className = "table"
			el("tabs_" + i).align = "center"
		}
	}
	setupResetData()

	setupDimensionHTML()
	setupAnimationBtns()
	setupAutobuyerToggles()
	setupInfUpgHTMLandData()
	setupDilationUpgradeList()
	setupMetaDimensions()
	setupBlackHole()
	BH_UDSP.setup()
	setupNGP3HTMLAndData()
}

//Theme stuff
function setTheme(name) {
	document.querySelectorAll("link").forEach(e => {
		if (e.href.includes("theme")) e.remove();
	})

	var themeName = player.options.secretThemeKey
	if (name === undefined) themeName = "Normal"
	else if (name !== "S6") themeName = name
	if(name !== undefined && name.length < 3) giveAchievement("Shhh... It's a secret")

	el("theme").innerHTML="<p style='font-size:15px'>Themes</p>Current theme: " + themeName
	el("chosenTheme").textContent="Current theme: " + themeName
	player.options.theme = name

	if (name !== undefined) {
		name = name.replace(`'`, ``)

		var head = document.head
		var link = document.createElement('link')

		link.type = 'text/css'
		link.rel = 'stylesheet'
		link.href = "stylesheets/theme-" + name + ".css"
		head.appendChild(link)
	}

	updatePaddingForFooter()
}

function updatePaddingForFooter() {
	const footerHeight = el("footer").getBoundingClientRect().height
	el("container").style.paddingBottom = `calc(${footerHeight}px + var(--container-padding-bottom))`
}

el("theme").onclick = function () {
	closeToolTip()
	el('thememenu').style.display="flex"
}


function updateMoney() {
	el("coinAmount").textContent = formatQuick(player.money, 2, inNGM(3) ? Math.min(Math.max(3 - player.money.e, 0), 3) : 2)

	var element2 = el("matter");
	if (inNC(12) || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") element2.textContent = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter."; //TODO

	var element3 = el("chall13Mult");
	if (isADSCRunning()) {
		var mult = getProductBoughtMult()
		element3.innerHTML = formatValue(player.options.notation, productAllTotalBought(), 2, 1) + 'x multiplier on all dimensions (product of '+(inNGM(3)&&(inNC(13)||player.currentChallenge=="postc1")?"1+log10(amount)":"bought")+(mult==1?"":"*"+shorten(mult))+').'
	}
	if (inNC(14) && inNGM(4)) el("c14Resets").textContent = "You have "+getFullExpansion(10-getTotalResets())+" resets left."
}

function updateCoinPerSec() {
	var element = el("coinsPerSec");
	var ret = getDimensionProductionPerSecond(1)
	element.textContent = 'You are getting ' + shortenND(ret) + ' antimatter per second.'
}

var clickedAntimatter
function onAntimatterClick() {
	clickedAntimatter++
	if (clickedAntimatter >= 10) giveAchievement("This is NOT a clicker game!")
}

function getEternitied() {
	let banked = player.eternitiesBank
	let total = player.eternities
	if (banked && (notInQC() || hasNU(10))) total = nA(total, player.eternitiesBank)
	return total
}

//DISPLAY FUNCTIONS
function hideDimensions() {
	for (var d = 2; d < 9; d++)
		if (antimatterDimensionShouldBeHidden(d))
			el(d + "Row").style.display = "none"
}

function floatText(id, text, leftOffset = 150) {
	if (!player.options.animations.floatingText) return
	var el = $("#"+id)
	el.append("<div class='floatingText' style='left: "+leftOffset+"px'>"+text+"</div>")
	setTimeout(function() {
		el.children()[0].remove()
	}, 1000)
}

function getNextAt(chall) {
	var ret = nextAt[chall]
	if (inNGM(2)) ret = nextAt[chall+"_ngmm"] || ret
	if (inNGM(3)) ret = nextAt[chall+"_ngm3"] || ret
	if (inNGM(4)) ret = nextAt[chall+"_ngm4"] || ret
	return ret
}

function getGoal(chall) {
	var ret = goals[chall]
	if (inNGM(2)) ret = goals[chall+"_ngmm"] || ret
	if (inNGM(3)) ret = goals[chall+"_ngm3"] || ret
	if (inNGM(4)) ret = goals[chall+"_ngm4"] || ret
	return ret
}

function checkICID(name) {
	if (inNGM(2)) {
		var split=name.split("postcngm3_")
		if (split[1]!=undefined) return parseInt(split[1])+2
		var split=name.split("postcngmm_")
		if (split[1]!=undefined) {
			var num=parseInt(split[1])
			if (inNGM(3)&&num>2) return 5
			return num
		}
		var split=name.split("postc")
		if (split[1]!=undefined) {
			var num=parseInt(split[1])
			var offset=!inNGM(3)?3:5
			if (num>2) offset--
			return num+offset
		}
	} else {
		var split=name.split("postc")
		if (split[1]!=undefined) return parseInt(split[1])
	}
}

function updateEternityChallenges() {
	tmp.ec_eff = 0
	tmp.ec_unl = quantumed
	for (let ec = 1; ec <= 14; ec++) {
		let id = "eterc" + ec
		let comps = player.eternityChalls[id]
		let unl = player.eternityChallUnlocked == ec
		let run = player.currentEternityChall == id
		if (unl || comps > 0) tmp.ec_unl = true
		if (comps > 0) tmp.ec_eff += comps

		el(id + "div").style.display = comps > 0 || unl ? "inline-block" : "none"
		el(id).textContent = unl ? (run ? "Running" : "Start") : comps == 5 ? "Completed" : "Locked"
		el(id).className = unl ? (run ? "onchallengebtn" : "challengesbtn") : comps == 5 ? "completedchallengesbtn" : "lockedchallengesbtn"
	}

	el("autoEC").style.display = quantumed ? "inline-block" : "none"
	if (quantumed) el("autoEC").className=quSave.autoEC?"timestudybought":"storebtn"
}

function toggleChallengeRetry() {
	player.options.retryChallenge = !player.options.retryChallenge
	el("retry").textContent = "Automatically retry challenges: O" + (player.options.retryChallenge ? "N" : "FF")
}

function toggleTabAmount() {
	player.options.tabAmount = !player.options.tabAmount
	el("tabAmount").textContent = "Show Antimatter amount in tab title: O" + (player.options.tabAmount ? "N" : "FF")
}

el("news").onclick = function () {
	if (el("news").textContent === "Click this to unlock a secret achievement.") giveAchievement("Real news")
	if (el("news").textContent === "If you are a ghost, try to click me!" && ghostified && (player.options.secrets === undefined || player.options.secrets.ghostlyNews === undefined)) {
		if (player.options.secrets === undefined) player.options.secrets = {}
		player.options.secrets.ghostlyNews = false

		el("ghostlynewsbtn").style.display = ""
		$.notify("You unlocked the ghostly news ticker option!", "success")
		giveAchievement("News for other species")
	}
	if (el("news").textContent === "Don't click this news") {
		alert("I told you so.")
		clearInterval(gameLoopIntervalId)
		simulateTime(0, false, "lair")
		player.lastUpdate = new Date().getTime()
		startInterval()
		giveAchievement("Lie the news")
	}
};

el("game").onclick = function () {
	if (tmp.blankedOut) giveAchievement("Blanked out")
}

el("secretstudy").onclick = function () {
	el("secretstudy").style.opacity = "1";
	el("secretstudy").style.cursor = "default";
	giveAchievement("Go study in real life instead");
	setTimeout(drawStudyTree, 2000);
};

el("The first one's always free").onclick = function () {
	giveAchievement("The first one's always free")
};

el("maxall").onclick = function () {
	if (tmp.ri) return false
	if (player.currentChallenge !== 'challenge14' || !inOnlyNGM(2)) buyMaxTickSpeed()
	for (var tier=1; tier<9;tier++) buyBulkDimension(tier, 1/0)
	if (inNGM(4)) buyMaxTimeDimensions()
}

el("challengeconfirmation").onclick = function () {
	player.options.challConf = !player.options.challConf
	el("challengeconfirmation").textContent = "Challenge confirmation: O" + (player.options.challConf ? "N" : "FF")
}

function buyInfinityUpgrade(name, cost) {
	if (player.infinityPoints.gte(cost) && !player.infinityUpgrades.includes(name)) {
		player.infinityUpgrades.push(name)
		player.infinityPoints = player.infinityPoints.minus(cost)
		if (name == "postinfi53") for (tier = 1; tier <= 8; tier++) {
			let dim = player["infinityDimension" + tier]
			dim.cost = E_pow(getIDCostMult(tier),dim.baseAmount / 10).mul(infBaseCost[tier])
		}
	}
}

var ipMultPower = 2
var ipMultCostIncrease = 10
function getIPMultPower() {
	let ret = ipMultPower
	if (hasGSacUpg(53)) ret += Math.pow(1.25, -15e4 / player.galacticSacrifice.galaxyPoints.log10())
	return ret
}
function canBuyIPMult() {
	return player.infinityUpgrades.includes("skipResetGalaxy") && player.infinityUpgrades.includes("passiveGen") && player.infinityUpgrades.includes("galaxyBoost") && player.infinityUpgrades.includes("resetBoost") && player.infinityPoints.gte(player.infMultCost)
}

el("infiMult").onclick = function() {
	if (canBuyIPMult()) {
		player.infinityPoints = player.infinityPoints.minus(player.infMultCost)
		player.infMult = player.infMult.mul(getIPMultPower());
		player.autoIP = player.autoIP.mul(getIPMultPower());
		player.infMultCost = player.infMultCost.mul(ipMultCostIncrease)
		if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = Decimal.mul(player.autobuyers[11].priority, 2);
		if (player.autoCrunchMode == "amount") el("priority12").value = formatValue("Scientific", player.autobuyers[11].priority, 2, 0);
	}
}

function updateEternityUpgrades() {
	el("epmult").innerHTML = "Gain 5x more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"

	el("eter1").className = (player.eternityUpgrades.includes(1)) ? "eternityupbtnbought" : (player.eternityPoints.gte(5)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter2").className = (player.eternityUpgrades.includes(2)) ? "eternityupbtnbought" : (player.eternityPoints.gte(10)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter3").className = (player.eternityUpgrades.includes(3)) ? "eternityupbtnbought" : (player.eternityPoints.gte(50e3)) ? "eternityupbtn" : "eternityupbtnlocked"
	if (mod.rs) {
		el("eterrow2").style.display = "none"
		return
	} else el("eterrow2").style.display = ""
	el("eter4").className = (player.eternityUpgrades.includes(4)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e16)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter5").className = (player.eternityUpgrades.includes(5)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e40)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter6").className = (player.eternityUpgrades.includes(6)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e50)) ? "eternityupbtn" : "eternityupbtnlocked"
	if (mod.ngud && hasDilStudy(1))	{
		el("dilationeterupgrow").style.display = ""
		el("eter7").className = (player.eternityUpgrades.includes(7)) ? "eternityupbtnbought" : (player.eternityPoints.gte("1e1500")) ? "eternityupbtn" : "eternityupbtnlocked"
		el("eter8").className = (player.eternityUpgrades.includes(8)) ? "eternityupbtnbought" : (player.eternityPoints.gte("1e2000")) ? "eternityupbtn" : "eternityupbtnlocked"
		el("eter9").className = (player.eternityUpgrades.includes(9)) ? "eternityupbtnbought" : (player.eternityPoints.gte("1e3000")) ? "eternityupbtn" : "eternityupbtnlocked"
	} else {
		el("dilationeterupgrow").style.display = "none"
		return
	}
}

function buyEternityUpgrade(name, cost) {
	if (player.eternityPoints.gte(cost) && !player.eternityUpgrades.includes(name)) {
		player.eternityUpgrades.push(name)
		player.eternityPoints = player.eternityPoints.minus(cost)
	}
}

function getEPCost(bought) {
	if (inNGM(2)) return E_pow(50,bought).mul(500)
	return E_pow(bought > 481 ? 1e3 : bought > 153 ? 500 : bought > 58 ? 100 : 50, bought + Math.pow(Math.max(bought - 1334, 0), 1.2)).mul(500)	
}

function buyEPMult() {
	if (player.eternityPoints.gte(player.epmultCost)) {
		player.epmult = player.epmult.mul(5)
		if (player.autoEterMode === undefined || player.autoEterMode === 'amount') {
			player.eternityBuyer.limit = Decimal.mul(player.eternityBuyer.limit, 5);
			el("priority13").value = formatValue("Scientific", player.eternityBuyer.limit, 2, 0);
		}
		player.eternityPoints = player.eternityPoints.minus(player.epmultCost)
		player.epmultCost = getEPCost(Math.round(player.epmult.ln()/Math.log(5)))
	}
}

function buyMaxEPMult() {
	if (player.eternityPoints.lt(player.epmultCost)) return
	var bought=Math.round(player.epmult.ln()/Math.log(5))
	var increment=1
	while (player.eternityPoints.gte(getEPCost(bought + increment * 2 - 1))) {
		increment *= 2
	}
	var toBuy = increment
	for (p = 0; p < 53; p++) {
		increment /= 2
		if (increment < 1) break
		if (player.eternityPoints.gte(getEPCost(bought + toBuy + increment - 1))) toBuy += increment
	}
	var num = toBuy
	var newEP = player.eternityPoints
	while (num > 0) {
		var temp = newEP
		var cost = getEPCost(bought+num-1)
		if (newEP.lt(cost)) {
			newEP = player.eternityPoints.sub(cost)
			toBuy--
		} else newEP = newEP.sub(cost)
		if (newEP.eq(temp) || num > 9007199254740992) break
		num--
	}
	player.eternityPoints = newEP
	if (isNaN(newEP.e)) player.eternityPoints = E(0)
	player.epmult = player.epmult.mul(E_pow(5, toBuy))
	player.epmultCost = getEPCost(bought+toBuy)
}

function playerInfinityUpgradesOnEternity() {
	if (getEternitied() >= 20 || hasAch("ng3p51")) return
	if (getEternitied() >= 4) {
		var filter = ["timeMult", "dimMult", "timeMult2", "skipReset1", "skipReset2", "unspentBonus", "27Mult", "18Mult", "36Mult", "resetMult", "skipReset3", "passiveGen", "45Mult", "resetBoost", "galaxyBoost", "skipResetGalaxy"]
		var newUpgrades = []
		for (u = 0; u < player.infinityUpgrades.length; u++) if (filter.includes(player.infinityUpgrades[u])) newUpgrades.push(player.infinityUpgrades[u])
		player.infinityUpgrades = newUpgrades
	} else player.infinityUpgrades = []
}

el("postinfi11").onclick = function() {
	buyInfinityUpgrade("totalMult", 1e4);
}

el("postinfi21").onclick = function() {
	buyInfinityUpgrade("currentMult", 5e4);
}

el("postinfi31").onclick = function() {
	if (player.infinityPoints.gte(player.tickSpeedMultDecreaseCost) && player.tickSpeedMultDecrease > 2) {
		player.infinityPoints = player.infinityPoints.minus(player.tickSpeedMultDecreaseCost)
		player.tickSpeedMultDecreaseCost *= 5
		player.tickSpeedMultDecrease--;
		if (player.tickSpeedMultDecrease > 2) el("postinfi31").innerHTML = "Decrease the Tickspeed cost multiplier increase post-e308<br>"+player.tickSpeedMultDecrease+"x → "+(player.tickSpeedMultDecrease-1)+"x<br>Cost: "+shortenDimensions(player.tickSpeedMultDecreaseCost) +" IP"
		else {
			for (c=0;c<ECComps("eterc11");c++) player.tickSpeedMultDecrease-=0.07
			el("postinfi31").innerHTML = "Decrease the Tickspeed cost multiplier increase post-e308<br>"+player.tickSpeedMultDecrease.toFixed(player.tickSpeedMultDecrease<2?2:0)+"x"
		}
	}
}

el("postinfi41").onclick = function() {
	buyInfinityUpgrade("postGalaxy", 5e11);
}

el("postinfi12").onclick = function() {
	buyInfinityUpgrade("infinitiedMult", 1e5);
}

el("postinfi22").onclick = function() {
	buyInfinityUpgrade("achievementMult", 1e6);
}

el("postinfi32").onclick = function() {
	buyInfinityUpgrade("challengeMult", 1e7);
}

el("postinfi42").onclick = function() {
	if (player.infinityPoints.gte(player.dimensionMultDecreaseCost) && player.dimensionMultDecrease > 3) {
		player.infinityPoints = player.infinityPoints.minus(player.dimensionMultDecreaseCost)
		player.dimensionMultDecreaseCost *= 5000
		player.dimensionMultDecrease--;
		if (player.dimensionMultDecrease > 3) el("postinfi42").innerHTML = "Decrease the Dimension cost multiplier post-e308<br>Currently: "+player.dimensionMultDecrease+"x → "+(player.dimensionMultDecrease-1)+"x<br>Cost: "+shortenCosts(player.dimensionMultDecreaseCost) +" IP"
		else {
			for (c=0;c<ECComps("eterc6");c++) player.dimensionMultDecrease-=0.2
			el("postinfi42").innerHTML = "Decrease the Dimension cost multiplier post-e308<br>Currently: "+player.dimensionMultDecrease.toFixed(ECComps("eterc6")%5>0?1:0)+"x"
		}
	}
}

el("postinfi23").onclick = function() {
	buyInfinityUpgrade("bulkBoost",inNGM(3) ? 2e4 : inNGM(2)?5e6:5e9);
}

el("offlineProd").onclick = function() {
	if (player.infinityPoints.gte(player.offlineProdCost) && player.offlineProd < 50) {
		player.infinityPoints = player.infinityPoints.minus(player.offlineProdCost)
		player.offlineProdCost *= 10
		player.offlineProd += 5
	}
}

//MORE DISPLAY STUFF
function toggleRepresentation() {
	// 0 == visible, 1 == not visible
	aarMod.hideRepresentation=!aarMod.hideRepresentation
	el("hideRepresentation").textContent=(aarMod.hideRepresentation?"Show":"Hide")+" antimatter representation"
}

function updateMilestones() {
	var moreUnlocked = mod.ngp3
	var milestoneRequirements = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 25, 30, 40, 50, 60, 80, 100, 1e9, 2e10, 4e11, 1e13]
	for (i=0; i< (moreUnlocked ? 28 : 24); i++) {
		var name = "reward" + i;
		if (i > 23) el("milestone" + i).textContent = shortenMoney(milestoneRequirements[i]) + " Eternities:"
		if (getEternitied() >= milestoneRequirements[i]) {
			el(name).className = "milestonereward"
		} else {
			el(name).className = "milestonerewardlocked"
		}
	}
	el("mdmilestones").style.display = moreUnlocked ? "" : "none"
}

function infMultAutoToggle() {
	if (getEternitied()<1) {
		if (canBuyIPMult()) {
			var toBuy = Math.max(Math.floor(player.infinityPoints.div(player.infMultCost).mul(ipMultCostIncrease - 1).add(1).log(ipMultCostIncrease)), 1)
			var toSpend = E_pow(ipMultCostIncrease, toBuy).sub(1).div(ipMultCostIncrease - 1).mul(player.infMultCost).round()
			if (toSpend.gt(player.infinityPoints)) player.infinityPoints = E(0)
			else player.infinityPoints = player.infinityPoints.sub(toSpend)
			player.infMult = player.infMult.mul(E_pow(getIPMultPower(), toBuy))
			player.infMultCost = player.infMultCost.mul(E_pow(ipMultCostIncrease,toBuy))
		}
	} else {
		player.infMultBuyer = !player.infMultBuyer
		el("infmultbuyer").textContent = "Autobuy IP mult O"+(player.infMultBuyer?"N":"FF")
	}
}

function toggleEternityConf() {
	player.options.eternityconfirm = !player.options.eternityconfirm
	el("eternityconf").textContent = "Eternity confirmation: O" + (player.options.eternityconfirm ? "N" : "FF")
}

function toggleDilaConf() {
	aarMod.dilationConf = !aarMod.dilationConf
	el("dilationConfirmBtn").textContent = "Dilation confirmation: O" + (aarMod.dilationConf ? "N" : "FF")
}

function gainedEternityPoints() {
	var ret = E_pow(5, player.infinityPoints.add(getIPGain()).e / (hasAch("ng3p23") ? 307.8 : 308) - 0.7).mul(player.epmult)
	if (mod.ngep) ret = ret.mul(10)
	if (hasTimeStudy(61)) ret = ret.mul(tsMults[61]())
	if (hasTimeStudy(121)) ret = ret.mul(((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5)) //x300 if tryhard, ~x60 if not
	else if (hasTimeStudy(122)) ret = ret.mul(35)
	else if (hasTimeStudy(123)) ret = ret.mul(Math.sqrt(1.39*player.thisEternity/10))
	if (hasGSacUpg(51)) ret = ret.mul(galMults.u51())
	if (bigRipped()) {
		if (isBigRipUpgradeActive(5)) ret = ret.mul(brSave.spaceShards.max(1))
		if (isBigRipUpgradeActive(8)) ret = ret.mul(tmp.qu.bru[8])
	}
	if (tmp.qu.be) ret = ret.mul(getBreakUpgMult(7))
	return ret.floor()
}

//TO-DO: move these option stuff
function showOptions(id) {
	closeToolTip();
	el(id).style.display = id == "advnotationmenu" ? "inline" : "flex"
}

el("animationoptionsbtn").onclick = function () {
	closeToolTip();
	el("animationoptions").style.display = "flex";
};

el("confirmations").onclick = function () {
	closeToolTip();
	el("confirmationoptions").style.display = "flex";
};

function showVisibilityMenu() {
	closeToolTip();
	el("visibilityoptions").style.display = "flex";
};

function sacrificeConf() {
	el("confirmation").checked = player.options.sacrificeConfirmation
	player.options.sacrificeConfirmation = !player.options.sacrificeConfirmation
	el("sacConfirmBtn").textContent = "Sacrifice confirmation: O" + (player.options.sacrificeConfirmation ? "N" : "FF")
}

function toggleLogRateChange() {
	aarMod.logRateChange=!aarMod.logRateChange
	el("toggleLogRateChange").textContent = "Logarithm rate: O" + (aarMod.logRateChange ? "N" : "FF")
	dimDescEnd = (aarMod.logRateChange?" OoM":"%")+"/s)"
}

function updatePerformanceTicks() {
	if (aarMod.performanceTicks) el("updaterateslider").min=1
	else {
		slider.min = 33
		if (player.options.updateRate < 33) {
			clearInterval(gameLoopIntervalId)
			player.options.updateRate = 33
			sliderText.textContent="Update rate: "+player.options.updateRate+"ms"
			startInterval()
		}
	}
	el("performanceTicks").textContent = "Throttlence: " + ["OFF", "LOW", "MEDIUM", "HIGH"][aarMod.performanceTicks || 0]
}

function togglePerformanceTicks() {
	aarMod.performanceTicks = ((aarMod.performanceTicks || 0) + 1) % 4
	updatePerformanceTicks()
}

function showHideFooter(toggle) {
	if (toggle) aarMod.noFooter = !aarMod.noFooter
	el("nofooterbtn").textContent = (aarMod.noFooter ? "Show" : "Hide") + " footer"
	el("footer").style.display = !aarMod.noFooter || isTabShown("opt") ? "" : "none"
}

el("newsbtn").onclick = function(force) {
	player.options.newsHidden=!player.options.newsHidden
	el("newsbtn").textContent=(player.options.newsHidden?"Show":"Hide")+" news ticker"
	el("game").style.display=player.options.newsHidden?"none":"block"
	if (!player.options.newsHidden) scrollNextMessage()
}

function getSacrificeBoost(){
	return calcSacrificeBoost()
}

function calcSacrificeBoost() {
	let ret
	let pow
	if (player.firstAmount == 0) return E(1);
	if (player.challenges.includes("postc2") || (inNGM(3) && player.currentChallenge == "postc2")) {
		pow = 0.01
		if (hasTimeStudy(228)) pow = 0.013
		else if (hasAch("r97") && mod.rs) pow = 0.012
		else if (hasAch("r88")) pow = 0.011
		ret = player.firstAmount.div(player.sacrificed.max(1)).pow(pow).max(1)
	} else if (!inNC(11)) {
		pow = 2
		if (hasAch("r32")) pow += inNGM(3) ? 2 : 0.2
		if (hasAch("r57")) pow += mod.rs ? 0.3 : 0.2 //this upgrade was too OP lol
		ret = E_pow(Math.max(player.firstAmount.e/10.0, 1) / Math.max(player.sacrificed.e/10.0, 1), pow).max(1)
	} else ret = player.firstAmount.pow(0.05).dividedBy(player.sacrificed.pow(inNGM(4)?0.05:0.04).max(1)).max(1)
	if (mod.rs) ret = ret.pow(1 + Math.log(1 + Math.log(1 + player.timestudy.ers_studies[1] / 5)))
	return ret
}

function getTotalSacrificeBoost(next){
	return calcTotalSacrificeBoost(next)
}

function calcTotalSacrificeBoost(next) {
	if (player.resets < 5) return E(1)
	let ret
	let pow
	if (player.challenges.includes("postc2") || (inNGM(3) && player.currentChallenge == "postc2")) {
		pow = 0.01
		if (hasTimeStudy(228)) pow = 0.013
		else if (hasAch("r97") && mod.rs) pow = 0.012
		else if (hasAch("r88")) pow = 0.011
		ret = player.sacrificed.pow(pow).max(1)
	} else if (!inNC(11)) {
		pow = 2
		if (hasAch("r32")) pow += inNGM(3) ? 2 : 0.2
		if (hasAch("r57")) pow += mod.rs ? 0.3 : 0.2 //this upgrade was too OP lol
		ret = E_pow(Math.max(player.sacrificed.e/10.0, 1), pow)
	} else ret = player.chall11Pow 
	if (mod.rs) ret = ret.pow(1 + Math.log(1 + Math.log(1 + (player.timestudy.ers_studies[1] + (next ? 1 : 0))/ 5)))
	return ret
}

function sacrifice(auto) {
	if (getAmount(8) == 0) return false
	if (player.resets < 5) return false
	if (player.currentEternityChall == "eterc3") return false

	if (!auto && player.options.sacrificeConfirmation && !confirm("Dimensional Sacrifice will remove all of your First to Seventh Dimensions (with the cost and multiplier unchanged) for a boost to the Eighth Dimension. It will take time to regain production.")) return

	var sacGain = calcSacrificeBoost()
	var maxPower = inNGM(2) ? pow10(8888) : Number.MAX_VALUE
	if (inNC(11) && (tmp.sacPow.gte(maxPower) || player.chall11Pow.gte(maxPower))) return false

	if (!auto) floatText("D8", "x" + shortenMoney(sacGain))
	player.sacrificed = player.sacrificed.add(player.firstAmount)
	if (inNC(11)) {
		player.chall11Pow = player.chall11Pow.mul(sacGain)
		if (!hasAch("r118")) resetDimensions()
		player.money = E(100)
	} else {
		if ((inNC(7) || player.currentChallenge == "postcngm3_3") && !hasAch("r118")) clearDimensions(6)
		else if (!hasAch("r118")) clearDimensions(7)
	}
	
	if (tmp.sacPow >= 600) giveAchievement("The Gods are pleased");
	if (tmp.sacPow.gte(Number.MAX_VALUE)) giveAchievement("Yet another infinity reference")
	if (tmp.sacPow.gte(pow10(9000)) && !inNC(11)) giveAchievement("IT'S OVER 9000")
}

var ndAutobuyersUsed = 0
var autoBuyers = {
	d1: { interval: _ => 1500 },
	d2: { interval: _ => 2000 },
	d3: { interval: _ => 2500 },
	d4: { interval: _ => 3000 },
	d5: { interval: _ => 4000 },
	d6: { interval: _ => 5000 },
	d7: { interval: _ => 6000 },
	d8: { interval: _ => 7500 },
	ts: { interval: _ => 5000, },
	db: { interval: _ => 8000 },
	gal: { interval: _ => inNGM(2) ? 60000 : 15000 },
	inf: { interval: _ => inNGM(2) ? 60000 : 300000 },
	sac: { interval: _ => inNGM(2) ? 15000 : 100 },
	gSac: { interval: _ => 15000 },
	tsb: { interval: _ => 15000 },
	tdb: { interval: _ => 15000 }
}
var autoBuyerKeys = []
for (var i of Object.keys(autoBuyers)) autoBuyerKeys.push(i)

function updateAutobuyers() {
	var intervalUnits = player.infinityUpgrades.includes("autoBuyerUpgrade") ? 1/2000 : 1/1000
	var maxedAutobuy = 0
	var bulkMin = 1/0

	for (let [i, key] of Object.entries(autoBuyerKeys)) {
		i = parseInt(i) + 1

		let ab_data = autoBuyers[key]
		let ab = new Autobuyer(i)

		ab.interval = tmp.ngep ? 1e3 : ab_data.interval()
		if (i <= 9) ab.bulk = 1
		ab.cost = 1
		ab.priority = i

		var unl = player.challenges.includes("challenge" + challOrder[i])
		if (i == 13) unl = unl || player.challenges.includes("postc2")

		//Player
		var ret = i
		if (unl) {
			ret = i > 13 ? player.autobuyers[i-2] : i == 13 ? player.autoSacrifice : player.autobuyers[i-1]
			if (!(ret % 1 !== 0)) ret = ab
			else if (ret === undefined) ret = ab
			else {
				ret.isOn = el(i + "ison").checked
				if (ret.interval < 100) ret.interval = 100
			}
		}

		if (i > 13 && i <= getTotalNormalChallenges() + 1) player.autobuyers[i-2] = ret
		else if (i == 13) player.autoSacrifice = ret
		else if (i < 13) player.autobuyers[i-1] = ret

		//HTML
		let currencyEnd = key != "inf" && inNGM(4) ? " GP" : " IP"
		el("ab_" + key).style.display = unl ? "inline-block" : ""
		if (unl) {
			el("ab_" + key + "_int").innerHTML = "Current interval: " + (ret.interval * intervalUnits).toFixed(2) + " seconds"
			el("ab_" + key + "_upg").innerHTML = "40% smaller interval<br>Cost: " + shortenDimensions(ret.cost) + currencyEnd
			el("ab_" + key + "_upg").style.display = ret.interval == 100 ? "none" : ""

			if (ret.interval == 100) maxedAutobuy++
			if (i <= 8 && ret.interval == 100 && ret.bulk < 1e100) {
				el("ab_" + key + "_upg").innerHTML = shortenDimensions(ret.bulk*2)+"x bulk purchase<br>Cost: " + shortenDimensions(ret.cost) + currencyEnd
				el("ab_" + key + "_upg").style.display = ""
			}
			if (i <= 8) bulkMin = Math.min(bulkMin, ret.bulk)
		}
	}

	if (canBreakInfinity()) {
		el("postinftable").style.display = "inline-block"
		el("breaktable").style.display = "inline-block"
		el("abletobreak").style.display = "none"
		el("break").style.display = "inline-block"
	} else {
		el("postinftable").style.display = "none"
		el("breaktable").style.display = "none"
		el("abletobreak").textContent = "You need to reduce the Automatic Big Crunches interval to 0.1 seconds to be able to Break Infinity"
		el("abletobreak").style.display = "block"
		el("break").style.display = "none"
		el("break").textContent = "BREAK INFINITY"
	}

	if (maxedAutobuy >= 9) giveAchievement("Age of Automation");
	if (maxedAutobuy >= getTotalNormalChallenges() + 1) giveAchievement("Definitely not worth it");
	if (maxedAutobuy && bulkMin >= 512) giveAchievement("Bulked up");
	if (maxedAutobuy && bulkMin >= 1e100) giveAchievement("Professional bodybuilder");

	el("autoBuyerEter").style.display = getEternitied() >= 100 ? "inline-block" : "none"
	player.eternityBuyer.isOn = el("eternityison").checked
	if (mod.ngp3) {
		player.eternityBuyer.dilationMode = el("dilatedeternityison").checked
		player.eternityBuyer.dilationPerAmount = Math.max(parseInt(el("prioritydil").value),2)
		player.eternityBuyer.statBeforeDilation = Math.min(player.eternityBuyer.statBeforeDilation, player.eternityBuyer.dilationPerAmount)
		if (player.eternityBuyer.isOn&&player.eternityBuyer.dilationMode&&player.eternityBuyer.statBeforeDilation<=0) {
			startDilatedEternity(true)
			return
		}
		if (quSave?.autobuyer) quSave.autobuyer.enabled = el("quantumison").checked
	}

	loadAutoBuyerSettings()

	ndAutobuyersUsed=0
	for (i = 0; i < 9; i++) if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].isOn) ndAutobuyersUsed++
	el("maxall").style.display=ndAutobuyersUsed>8&&player.challenges.includes("postc8") ? "none" : ""
}

function autoBuyerArray() {
	var tempArray = []
	for (var i=0; i<player.autobuyers.length && i<9; i++) {
		if (player.autobuyers[i]%1 !== 0 ) tempArray.push(player.autobuyers[i])
	}
	return tempArray;
}

var priority = []

function priorityOrder() {
	var tempArray = []
	var i = 1;
	while(tempArray.length != autoBuyerArray().length) {
		for (var x=0 ; x< autoBuyerArray().length; x++) {
			if (autoBuyerArray()[x].priority == i) tempArray.push(autoBuyerArray()[x])
		}
		i++;
	}
	priority = tempArray;
}

function fromValue(value) {
	value = value.replace(/,/g, '')
	let E=value.toUpperCase().split("E")
	if (E.length > 2 && value.split(" ")[0] !== value) {
		var temp = E(0)
		temp.mantissa = parseFloat(E[0])
		temp.exponent = parseFloat(E[1]+"e"+E[2])
	}
	if (value.includes(" ")) {
		const prefixes = [['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
		['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
		['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
		const prefixes2 = ['', 'MI', 'MC', 'NA', 'PC', 'FM', ' ']
		let e = 0;
		let m,k,l;
		if (value.split(" ")[1].length < 5) {
			for (l=101;l>0;l--) {
				if (value.includes(FormatList[l])) {
					e += l*3
					break
				}
			}
			return Decimal.fromMantissaExponent(parseInt(value.split(" ")[0]), e)
		}
		for (let i=1;i<5;i++) {
			if (value.includes(prefixes2[i])) {
				m = value.split(prefixes2[i])[1]
				for (k=0;k<3;k++) {
					for (l=1;l<10;l++) {
						if (m.includes(prefixes[k][l])) break;
					}
					if (l != 10) e += Math.pow(10,k)*l;
				}
				break;
			}
			return Decimal.fromMantissaExponent(value.split, e*3)
		}
		for (let i=1;i<=5;i++) {
			if (value.includes(prefixes2[i])) {
				for (let j=1;j+i<6;j++) {
					if (value.includes(prefixes2[i+j])) {
						m=value.split(prefixes2[i+j])[1].split(prefixes2[i])[0]
						if (m == "") e += Math.pow(1000,i);
						else {
							for (k=0;k<3;k++) {
								for (l=1;l<10;l++) {
									if (m.includes(prefixes[k][l])) break;
								}
								if (l != 10) e += Math.pow(10,k+i*3)*l;
							}
						}
						break;
					}
				}
			}
		}
		return Decimal.fromMantissaExponent(parseFloat(value), i*3+3)
	}
	if (!isFinite(parseFloat(value[value.length-1]))) { //needs testing
		const l = " abcdefghijklmnopqrstuvwxyz"
		const v = value.replace(parseFloat(value),"")
		let e = 0;
		for (let i=0;i<v.length;i++) {
			for (let j=1;j<27;j++) {
				if (v[i] == l[j]) e += Math.pow(26,v.length-i-1)*j
			}
		}
		return Decimal.fromMantissaExponent(parseFloat(value), e*3)
	}
	value = value.replace(',','')
	if (E[0] === "") return Decimal.fromMantissaExponent(Math.pow(10,parseFloat(E[1])%1), parseInt(E[1]))
	return Decimal.fromString(value)
}

function updatePriorities() {
	auto = false;
	for (var x=0 ; x < autoBuyerArray().length; x++) {
		if (x < 9) autoBuyerArray()[x].priority = parseInt(el("priority" + (x+1)).value)
	}
	if (parseInt(el("priority10").value) === 69
			|| parseInt(el("priority11").value) === 69
			|| parseInt(fromValue(el("priority12").value).toString()) === 69
			|| parseInt(el("bulkDimboost").value) === 69
			|| parseInt(el("overGalaxies").value) === 69
			|| parseInt(fromValue(el("prioritySac").value).toString()) === 69
			|| parseInt(el("bulkgalaxy").value) === 69
			|| parseInt(fromValue(el("priority13").value).toString()) === 69
			|| parseInt(fromValue(el("priority14").value).toString()) === 69
			|| parseInt(el("overGalaxiesTickspeedBoost").value) === 69
			|| parseInt(el("bulkTickBoost").value) === 69
			|| parseInt(fromValue(el("priority15").value).toString()) === 69
			|| parseInt(el("prioritydil").value) === 69
			|| parseInt(fromValue(el("priorityquantum").value).toString()) === 69) giveAchievement("Nice.");
	player.autobuyers[9].priority = parseInt(el("priority10").value)
	player.autobuyers[10].priority = parseInt(el("priority11").value)
	const infValue = fromValue(el("priority12").value)
	if (!isNaN(break_infinity_js ? infValue : infValue.l)) player.autobuyers[11].priority = infValue
	else if (player.autoCrunchMode=="replicanti"&&el("priority12").value.toLowerCase()=="max") player.autobuyers[11].priority = el("priority12").value
	if (getEternitied() < 10 && !player.autobuyers[9].bulkBought) {
		var bulk = Math.floor(Math.max(parseFloat(el("bulkDimboost").value), 1))
	} else {
		var bulk = Math.max(parseFloat(el("bulkDimboost").value), 0.05)
	}
	player.autobuyers[9].bulk = (isNaN(bulk)) ? 1 : bulk
	player.overXGalaxies = parseInt(el("overGalaxies").value)
	const sacValue = fromValue(el("prioritySac").value)
	if (!isNaN(break_infinity_js ? sacValue : sacValue.l)) player.autoSacrifice.priority = Decimal.max(sacValue, 1.01)
	if (inNGM(2)) {
		const galSacValue = fromValue(el("priority14").value)
		if (!isNaN(break_infinity_js ? galSacValue : galSacValue.l)) player.autobuyers[12].priority = galSacValue
	}
	if (player.autobuyers[13]!=undefined) {
		player.autobuyers[13].priority = parseInt(el("priority15").value)
		player.overXGalaxiesTickspeedBoost = parseInt(el("overGalaxiesTickspeedBoost").value)
		player.autobuyers[13].bulk = Math.floor(Math.max(parseFloat(el("bulkTickBoost").value), 1))
	}
	if (player.autobuyers[14]!=undefined) {
		player.autobuyers[14].priority = parseInt(el("priority16").value)
		player.autobuyers[14].overXGals = parseInt(el("overGalaxiesTDBoost").value)
	}
	player.autobuyers[10].bulk = parseFloat(el("bulkgalaxy").value)
	const eterValue = fromValue(el("priority13").value)
	if (!isNaN(break_infinity_js ? eterValue : eterValue.l)) player.eternityBuyer.limit = eterValue
	if (mod.ngp3) {
		const dilValue = parseFloat(el("prioritydil").value)
		if (dilValue == Math.round(dilValue) && dilValue > 1) player.eternityBuyer.dilationPerAmount = dilValue
		const quantumValue = fromValue(el("priorityquantum").value)
		if (!isNaN(break_infinity_js ? quantumValue : quantumValue.l) && quSave.autobuyer) quSave.autobuyer.limit = quantumValue
		if (player.eternityBuyer.isOn&&player.eternityBuyer.dilationMode&&player.eternityBuyer.statBeforeDilation<=0) {
			startDilatedEternity(true)
			return
		}
	}
	priorityOrder()
}

function updateCheckBoxes() {
	for (var i = 0; i < player.autobuyers.length; i++) {
		if (player.autobuyers[i]%1 !== 0) {
			var id = (i + (i > 11 ? 2 : 1)) + "ison"
			el(id).checked = player.autobuyers[i].isOn ? "true" : ""
		}
	}
	if (player.autoSacrifice.isOn) el("13ison").checked = "true"
	else el("13ison").checked = ""
	el("eternityison").checked = player.eternityBuyer.isOn
	if (mod.ngp3) {
		el("dilatedeternityison").checked = player.eternityBuyer.dilationMode
		if (quSave && quSave.autobuyer) el("quantumison").checked = quSave.autobuyer.enabled
	} else el("dilatedeternityison").checked = false
}


function toggleAutoBuyers() {
	var bool = player.autobuyers[0].isOn
	for (var i = 0; i<player.autobuyers.length; i++) {
		if (player.autobuyers[i]%1 !== 0) {
			player.autobuyers[i].isOn = !bool
		}
	}
	player.autoSacrifice.isOn = !bool
	player.eternityBuyer.isOn = !bool
	if (mod.ngp3) quSave.autobuyer.enabled = !bool

	$.notify("Autobuyers toggled " + (bool ? "off" : "on"), "info")
	updateCheckBoxes()
	updateAutobuyers()
}

function toggleBulk() {
	if (player.options.bulkOn) {
		player.options.bulkOn = false
		el("togglebulk").textContent = "Enable bulk buy"
	} else {
		player.options.bulkOn = true
		el("togglebulk").textContent = "Disable bulk buy"
	}
}

function toggleHotkeys() {
	if (player.options.hotkeys) {
		player.options.hotkeys = false
		el("disablehotkeys").textContent = "Enable hotkeys"
	} else {
		player.options.hotkeys = true
		el("disablehotkeys").textContent = "Disable hotkeys"
	}
}

function updateHotkeys() {
	// todo: improve hotkeys to be more visual-based and give the ability to change and reset hotkeys
	let html = "Hotkeys: Arrow keys to move tabs, 1-8 to buy 10 of that Dimension, shift+1-8 to buy 1 of that Dimension, T to buy max Tickspeed, shift+T to buy one tickspeed upgrade, M to max all, <br>S to sacrifice"
	if (!hasAch("r136")) html += ", D to Dimension Boost"
	if (!hasAch("ng3p51")) {
		if (inNGM(3)) html += ", B to Tickspeed Boost"
		if (inNGM(4)) html += ", N to Time Dimension Boost"
		html += ", G to Galaxy"
	}
	html += ", C to Crunch, A to toggle autobuyers, R to get a Replicated Galaxy, E to Eternity"
	if (hasAch("r136")) html += ", D to dilate time"
	if (hasAch("ngpp11")) html += ", shift+D to Meta-Dimension Boost"
	if (mod.ngpp) html += ", Q to quantum"
	if (hasAch("ng3p45")) html += ", U to unstabilize all quarks"
	if (hasAch("ng3p51")) html += ", B to Big Rip"
	if (hasAch("ng3p61")) html += ", F to Fundament"
	html += "."
	if (mod.rs) html += "<br>You can hold shift while buying time studies to buy all up until that point, see each study's number, and save study trees."
	if (BL_JOKE.started() && ghSave.lab_real.signed) html += "<br><b onclick='BL_JOKE.findKey()'>Hotkeys</b> do not work while holding control."
	else html += "<br>Hotkeys do not work while holding control."
	el("hotkeysDesc").innerHTML = html
}


var bestECTime
function updateEterChallengeTimes() {
	bestECTime=0
	var sumOfCompletedChallengeTimes=0
	var completedChallenges=0
	let showEterChallengeStatsGroup = false
	for (var i=1;i<15;i++) {
		setAndMaybeShow("eterchallengetime"+i,aarMod.eternityChallRecords[i],'"Eternity Challenge '+i+' time record: "+timeDisplayShort(aarMod.eternityChallRecords['+i+'], false, 3)')
		if (aarMod.eternityChallRecords[i]) {
			bestECTime=Math.max(bestECTime, aarMod.eternityChallRecords[i])
			sumOfCompletedChallengeTimes+=aarMod.eternityChallRecords[i]
			completedChallenges++
			showEterChallengeStatsGroup = true
		}
	}
	el("stats_eterchallengetime").style.display = showEterChallengeStatsGroup ? null : "none"
	setAndMaybeShow("eterchallengetimesum",completedChallenges>1,'"The sum of your completed Eternity Challenge time records is "+timeDisplayShort('+sumOfCompletedChallengeTimes+', false, 3)+"."')
}

var averageEp = E(0)
var bestEp
function updateLastTenEternities() {
	var listed = 0
	var tempTime = E(0)
	var tempEP = E(0)
	for (var i=0; i<10; i++) {
		if (player.lastTenEternities[i][1].gt(0) || player.lastTenEternities[i][2]) {
			var eppm = player.lastTenEternities[i][1].dividedBy(player.lastTenEternities[i][0]/600)
			var unit = player.lastTenEternities[i][2] ? player.lastTenEternities[i][2] == "b" ? "EM" : player.lastTenEternities[i][2] == "d2" ? "TP" : "EP" : "EP"
			var tempstring = shorten(eppm) + " " + unit + "/min"
			if (eppm<1) tempstring = shorten(eppm*60) + " " + unit + "/hour"
			msg = "The Eternity " + (i == 0 ? '1 eternity' : (i+1) + ' eternities') + " ago took " + timeDisplayShort(player.lastTenEternities[i][0], false, 3)
			if (player.lastTenEternities[i][2]) {
				if (player.lastTenEternities[i][2] == "b") msg += " while it was broken"
				else if (player.lastTenEternities[i][2].toString().slice(0,1) == "d") msg += " while dilated"
				else msg += " in Eternity Challenge " + player.lastTenEternities[i][2]
			}
			msg += " and gave " + shortenDimensions(player.lastTenEternities[i][1]) + " " + unit + ". " + tempstring
			el("eternityrun"+(i+1)).textContent = msg
			tempTime = tempTime.add(player.lastTenEternities[i][0])
			tempEP = tempEP.add(player.lastTenEternities[i][1])
			bestEp = player.lastTenEternities[i][1].max(bestEp)
			listed++
		} else el("eternityrun"+(i+1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempEP = tempEP.dividedBy(listed)
		var eppm = tempEP.dividedBy(tempTime/600)
		var tempstring = "(" + shorten(eppm) + " EP/min)"
		averageEp = tempEP
		if (eppm < 1) tempstring = "(" + shorten(eppm * 60) + " EP/hour)"
		el("averageEternityRun").textContent = "Average time of the last " + listed + " Eternities: " + timeDisplayShort(tempTime, false, 3) + " | Average EP gain: " + shortenDimensions(tempEP) + " EP. " + tempstring
	} else el("averageEternityRun").textContent = ""
}

function addEternityTime(array) {
	for (var i=player.lastTenEternities.length-1; i>0; i--) {
		player.lastTenEternities[i] = player.lastTenEternities[i-1]
	}
	player.lastTenEternities[0] = array
	updateLastTenEternities()
}

function addTime(array) {
	for (var i=player.lastTenRuns.length-1; i>0; i--) {
		player.lastTenRuns[i] = player.lastTenRuns[i-1]
	}
	player.lastTenRuns[0] = array
}

function doDefaultTickspeedReduction(){
	if (hasAch("r36")) player.tickspeed = player.tickspeed.mul(0.98);
	if (hasAch("r45")) player.tickspeed = player.tickspeed.mul(0.98);
	if (hasAch("r66")) player.tickspeed = player.tickspeed.mul(0.98);
	if (hasAch("r83")) player.tickspeed = player.tickspeed.mul(E_pow(0.95, player.galaxies));
}

function respecToggle() {
	player.respec = !player.respec
	updateRespecButtons()
}

function updateRespecButtons() {
	var className = player.respec ? "timestudybought" : "storebtn"
	el("respec").className = className
	el("respec2").className = className
	el("respec3").className = className

	className = player.respecMastery ? "timestudybought" : "storebtn"
	el("respecMastery").className = className
	el("respecMastery2").className = className
}

function doCheckECCompletionStuff(){
	var forceRespec = false
	if (player.currentEternityChall !== "") {
		if (player.eternityChalls[player.currentEternityChall] === undefined) {
			player.eternityChalls[player.currentEternityChall] = 1
		} else if (player.eternityChalls[player.currentEternityChall] < 5) {
			player.eternityChalls[player.currentEternityChall] += 1
		}
		else if (aarMod.eternityChallRecords[player.eternityChallUnlocked] === undefined) aarMod.eternityChallRecords[player.eternityChallUnlocked] = player.thisEternity
		else aarMod.eternityChallRecords[player.eternityChallUnlocked] = Math.min(player.thisEternity, aarMod.eternityChallRecords[player.eternityChallUnlocked])
		if (player.currentEternityChall === "eterc12" && hasAch("ng3p51")) {
			if (player.eternityChalls.eterc11 === undefined) player.eternityChalls.eterc11 = 1
			else if (player.eternityChalls.eterc11 < 5) player.eternityChalls.eterc11++
		}
		if (mod.ngp3 ? quSave.autoEC && player.eternityChalls[player.currentEternityChall] < 5 : false) {
			if (player.etercreq > 12) player.timestudy.theorem += MTS.costs.ec[player.etercreq]
			else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.etercreq]
			player.eternityChallUnlocked = 0
			quSave.autoECN = player.etercreq
		} else if (hasBraveMilestone(2)) {
			if (player.etercreq > 12) player.timestudy.theorem += MTS.costs.ec[player.etercreq]
			else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.etercreq]
			player.eternityChallUnlocked = 0
		} else forceRespec = true
		player.etercreq = 0
	} else if (mod.ngp3) delete quSave.autoECN
	return forceRespec
}

function canEternity() {
	var eter25 = getEternitied() >= 25
	var id7unlocked = player.infDimensionsUnlocked[7]
	if (eter25) id7unlocked = true
	if (bigRipped()) id7unlocked = true

	return player.infinityPoints.gte(player.eternityChallGoal || Number.MAX_VALUE) && id7unlocked
}

function eternity(force, auto, dil, presetLoad) {
	if (!force && !canEternity()) return
	if (!auto && !dil && player.options.eternityconfirm && !confirm("Eternity will reset everything except achievements and challenge records. You will gain an Eternity Point and unlock various upgrades.")) return

	var oldEter = getEternitied()
	var oldEP = player.eternityPoints
	if (!force) {
		//Infinities / Eternities
		player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())
		player.eternities = nA(player.eternities, gainEternitiedStat())
		updateBankedEter()

		//Eternity 
		player.eternityPoints = player.eternityPoints.add(gainedEternityPoints())

		//Records
		if (player.thisEternity < player.bestEternity && !force) player.bestEternity = player.thisEternity
		temp = []
		var array = [player.thisEternity, gainedEternityPoints()]
		if (player.dilation.active) array = [player.thisEternity, getDilGain().sub(player.dilation.totalTachyonParticles).max(0), "d2"]
		else if (player.currentEternityChall != "") array.push(player.eternityChallUnlocked)
		else if (tmp.qu.be) {
			beSave.eternalMatter = beSave.eternalMatter.add(getEMGain())
			if (!hasBraveMilestone(16)) beSave.eternalMatter = beSave.eternalMatter.round()
			array = [player.thisEternity, getEMGain(), "b"]
		}
		addEternityTime(array)
	}

	//Challenges - Fixed by valence  
	if (player.currentEternityChall !== "" && player.infinityPoints.lt(player.eternityChallGoal)) return false
	if (player.currentEternityChall == "eterc6" && ECComps("eterc6") < 5 && player.dimensionMultDecrease < 4) player.dimensionMultDecrease = Math.max(parseFloat((player.dimensionMultDecrease - 0.2).toFixed(1)),2)
	if (!hasGluonUpg("gb", 4)) if ((player.currentEternityChall == "eterc11" || (player.currentEternityChall == "eterc12" && ghostified)) && ECComps("eterc11") < 5) player.tickSpeedMultDecrease = Math.max(parseFloat((player.tickSpeedMultDecrease - 0.07).toFixed(2)), 1.65)
	
	var forceRespec = doCheckECCompletionStuff()
	player.currentEternityChall = ""
	player.eternityChallGoal = E(Number.MAX_VALUE)
	updateEternityChallenges()

	//Dilation
	if (player.dilation.active && (!force || player.infinityPoints.gte(Number.MAX_VALUE))) {
		let gain = getDilGain()
		if (gain.gte(player.dilation.totalTachyonParticles)) {
			if (player.dilation.totalTachyonParticles.gt(0) && gain.div(player.dilation.totalTachyonParticles).lt(2)) player.eternityBuyer.slowStopped = true
			if (mod.ngp3) player.dilation.times = (player.dilation.times || 0) + 1
			player.dilation.totalTachyonParticles = gain
			setTachyonParticles(gain)
		}
	}
	if (!hasDilStudy(1)) dil = false
	else if (!force && !dil) {
		if (player.eternityBuyer.dilationMode) {
			player.eternityBuyer.statBeforeDilation--
			if (player.eternityBuyer.statBeforeDilation <= 0) dil = true
			if (player.eternityBuyer.alwaysDilCond) dil = true
		}
	}
	if (dil) player.eternityBuyer.statBeforeDilation = player.eternityBuyer.dilationPerAmount

	//Achievements
	giveAchievement("Time is relative")
	if (player.thisEternity < 2) giveAchievement("Eternities are the new infinity")
	if (player.infinitied < 10 && !force && !mod.rs) giveAchievement("Do you really need a guide for this?");
	if (Decimal.round(player.replicanti.amount) == 9) giveAchievement("We could afford 9");
	if (player.dimlife && !force) giveAchievement("8 nobody got time for that")
	if (player.dead && !force) giveAchievement("You're already dead.")
	if (player.infinitied <= 1 && !force) giveAchievement("Do I really need to infinity")
	if (gainedEternityPoints().gte("1e600") && player.thisEternity <= 600 && player.dilation.active && !force) giveAchievement("Now you're thinking with dilation!")
	if (gainedEternityPoints().gte(player.eternityPoints) && player.eternityPoints.gte("1e1185") && (mod.ngp3 ? player.dilation.active && bigRipped() : false)) giveAchievement("Gonna go fast")

	//Presets
	if (player.respec || player.respecMastery || forceRespec || presetLoad) respecTimeStudies(forceRespec, presetLoad)
	if (player.respec) respecToggle()
	if (player.respecMastery) respecMasteryToggle()

	player.dilation.active = dil
	doReset("eter", auto)

	if (player.eternitied == 1 && !quantumed) TAB_CORE.open("dim_time")
	if (quantumed) updateColorCharge()
	doAutoEterTick()
}

function challengesCompletedOnEternity() {
	var array = []
	if (getEternitied() > 1 || hasAch("ng3p51") || bigRipped()) for (var i = 1; i <= getTotalNormalChallenges() + 1; i++) array.push("challenge" + i)
	if (hasAch("r133")) for (i = 0; i < order.length; i++) array.push(order[i])
	return array
}

function gainEternitiedStat() {
	let ret = 1
	if (quantumed && getEternitied() < 1e5) ret = 20
	if (hasNU(9)) ret = nM(ret, pow10(Math.pow(brSave.spaceShards.max(1).log10(), 3/4) / 3))
	let exp = getEternitiesAndDTBoostExp()
	if (exp > 0) ret = nM(player.dilation.dilatedTime.max(1).pow(exp), ret)
	if (typeof(ret) == "number") ret = Math.floor(ret)
	return ret
}

function gainBankedInf() {
	let ret = 0 
	let numerator = player.infinitied
	if (speedrunMilestones > 27 || hasAch("ng3p73")) numerator = nA(getInfinitiedGain(), player.infinitied)
	let frac = 0.05
	if (hasTimeStudy(191)) ret = nM(numerator, frac)
	if (hasAch("r131")) ret = nA(nM(numerator, frac), ret)
	if (mod.ngud && !mod.udsp) ret = nM(ret, getBlackholePowerEffect().pow(1/3))
	if (hasBlackHoleEff(4)) ret = nM(ret, getBlackHoleEff(4))
	return ret
}

function exitChallenge() {
	if (player.galacticSacrifice?.chall) {
		galacticSacrifice(false, true)
		TAB_CORE.open("dim")
	} else if (player.currentChallenge !== "") {
		startChallenge("");
		updateChallenges();
		return
	} else if (player.currentEternityChall !== "") {
		player.currentEternityChall = ""
		player.eternityChallGoal = E(Number.MAX_VALUE)
		eternity(true)
		updateEternityChallenges();
		return
	}
	if (mod.ngp3 && inAnyQC()) quantum(false, true, 0)
}

function quickReset() {
	if (inQC(6)) return
	if (inNC(14)) if (player.tickBoughtThisInf.pastResets.length < 1) return
	if (player.resets > 0 && !(inNGM(2) && inNC(5))) player.resets--
	if (inNC(14)) {
		while (player.tickBoughtThisInf.pastResets.length > 0) {
			let entry = player.tickBoughtThisInf.pastResets.pop()
			if (entry.resets < player.resets) {
				// it has fewer resets than we do, put it back and we're done.
				player.tickBoughtThisInf.pastResets.push(entry);
				break;
			} else {
				// we will have at least this many resets, set our remaining tickspeed upgrades
				// and then throw the entry away
				player.tickBoughtThisInf.current = entry.bought;
			}
		}
	}
	dimBoost(0)
}

var blink = true
var nextAt
var goals
var order

function setAndMaybeShow(elementName, condition, contents) {
	var elem = el(elementName)
	if (condition) {
		elem.innerHTML = eval(contents)
		elem.style.display = ""
	} else {
		elem.innerHTML = ""
		elem.style.display = "none"
	}
}

function updateBlinkOfAnEye(){
	if (blink && !hasAch("r78")) {
		el("Blink of an eye").style.display = "none"
		blink = false
	}
	else {
		el("Blink of an eye").style.display = "block"
		blink = true
	}
}

function canQuickBigRip() {
	var x = false
	if (hasMasteryStudy("d14") && notInQC() && quSave.electrons.amount >= 62500) {
		for (var p = 1; p < 5; p++) {
			var pcData = quSave.pairedChallenges.order[p]
			if (pcData) {
				var pc1 = Math.min(pcData[0], pcData[1])
				var pc2 = Math.max(pcData[0], pcData[1])
				if (pc1 == 6 && pc2 == 8) {
					if (p - 1 > quSave.pairedChallenges.completed) return
					x = true
				}
			}
		}
	}
	return x
}

function idAutoTick() {
	maxAllID(true)
}

function replicantiAutoTick() {
	if (getEternitied() >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8" && isChanceAffordable()) {
		var chance = Math.round(player.replicanti.chance * 100)
		var maxCost = (mod.ngp3 ? hasMasteryStudy("t265") : false) ? 1 / 0 : E("1e1620").div(inOnlyNGM(2) ? 1e60 : 1);
		var bought = Math.max(Math.floor(player.infinityPoints.min(maxCost).div(player.replicanti.chanceCost).log(1e15) + 1), 0)
		if (!hasMasteryStudy("t265")) bought = Math.min(bought, 100 - chance)
		player.replicanti.chance = (chance + bought) / 100
		player.replicanti.chanceCost = player.replicanti.chanceCost.mul(E_pow(1e15, bought))
	}

	if (getEternitied() >= 60 && player.replicanti.auto[1] && player.currentEternityChall !== "eterc8") {
		while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && isIntervalAffordable()) upgradeReplicantiInterval()
	}

	if (getEternitied() >= 80 && player.replicanti.auto[2] && player.currentEternityChall !== "eterc8") autoBuyRG()
}

function failedEC12Check(){
	if (player.currentEternityChall == "eterc12" && player.thisEternity >= getEC12TimeLimit()) {
		setTimeout(exitChallenge, 500)
		onChallengeFail()
	}
}

function updateNGpp17Reward(){
	el('epmultAuto').style.display=hasAch("ngpp17")?"":"none"
	for (i=1;i<9;i++) el("td"+i+'Auto').style.visibility=hasAch("ngpp17")?"visible":"hidden"
	el('togglealltimedims').style.visibility=hasAch("ngpp17")?"visible":"hidden"
}

function updateNGpp16Reward(){
	el('replicantibulkmodetoggle').style.display=hasAch("ngpp16")?"inline-block":"none"
}

function dilationStuffABTick(){
	el('rebuyupgAuto').style.display = speedrunMilestones>6?"":"none"
	el('dilUpgsAuto').style.display = hasAch("ngpp13") && mod.udsp ? "" : "none"
	el('distribEx').style.display = hasAch("ngud14") ? "" : "none"
	if (player?.autoEterOptions?.dilUpgs) autoBuyDilUpgs()

	updateDilationUpgradeButtons()
}

function updateOrderGoals(){
	if (order) for (var i=0; i<order.length; i++) el(order[i]+"goal").textContent = "Goal: "+shortenCosts(getGoal(order[i]))
}

let autoSaveSeconds=0
function updatePerSecond(quick) {
	if (!player) return

	// Achieve:
	cantHoldInfinitiesCheck()
	antitablesHaveTurnedCheck()
	updateBlinkOfAnEye()
	ALLACHIEVECHECK()
	bendTimeCheck()
	metaAchMultLabelUpdate()

	// AB Stuff
	replicantiAutoTick()
	idAutoTick()
	doAutoEterTick()
	dilationStuffABTick()
	DimBoostBulkDisplay()

	// Quick
	doPerSecondNGP3Stuff(quick)
	if (quick) return

	// Displays
	ABTypeDisplay()
	dimboostABTypeDisplay()
	IDABDisplayCorrection()
	replicantiAutoDisplay()
	updateNGpp17Reward()
	updateNGpp16Reward()

	// More Displays
	TAB_CORE.update_tmp()
	updateHeaders()
	updateMilestones()
	primaryStatsDisplayResetLayers()
	updateGalaxyUpgradesDisplay()
	updateNGM2RewardDisplay()
	infPoints2Display()
	bankedInfinityDisplay()
	eterPoints2Display()
	updateTimeStudyButtons(false, true)
	updateAnimationBtns()
	showHideConfirmations()

	// EC Stuff
	ECCompletionsDisplay()
	ECchallengePortionDisplay()
	updateECUnlockButtons()
	EC8PurchasesDisplay()
 	failedEC12Check()

	// Other 
	runAutoSave()
	fixInfinityTimes()
	updateOrderGoals()
	updateHotkeys()
	updateConvertSave(eligibleConvert())

	// Meta
	obtainBadges()
	REDISCOVER.update()
	if (meta.mustSave) {
		updateBadges()
		saveMeta()
	}

	// Errors
	isInfiniteDetected()
	if (!mod.ngp3 || !quantumed) if (player.infinityPoints.lt(100)) player.infinityPoints = player.infinityPoints.round()
	checkGluonRounding()
}

var IPminpeak = E(0)
var EPminpeakType = 'normal'
var EPminpeak = E(0)
var replicantiTicks = 0
var isSmartPeakActivated = false

function updateEPminpeak(diff, type) {
	if (type == "EP") {
		var gainedPoints = gainedEternityPoints()
		var oldPoints = player.eternityPoints
	} else if (type == "TP") {
		var gainedPoints = getDilGain().sub(player.dilation.totalTachyonParticles).max(0)
		var oldPoints = player.dilation.totalTachyonParticles
	} else {
		var gainedPoints = getEMGain()
		var oldPoints = beSave.eternalMatter
	}
	var newPoints = oldPoints.add(gainedPoints)
	var newLog = Math.max(newPoints.log10(),0)
	var minutes = player.thisEternity / 600
	if (newLog > 1000 && EPminpeakType == 'normal' && isSmartPeakActivated) {
		EPminpeakType = 'logarithm'
		EPminpeak = E(0)
	}
	// for logarithm, we measure the amount of exponents gained from current
	var currentEPmin = (EPminpeakType == 'logarithm' ? E(Math.max(0, newLog - Math.max(oldPoints.log10(), 0))) : gainedPoints).dividedBy(minutes)
	if (currentEPmin.gt(EPminpeak) && player.infinityPoints.gte(Number.MAX_VALUE)) {
		EPminpeak = currentEPmin
		if (mod.ngp3) player.peakSpent = 0
	} else if (mod.ngp3 && currentEPmin.gt(0)) {
		player.peakSpent = diff + (player.peakSpent ? player.peakSpent : 0)
	}
	return currentEPmin;
}

function hasMatter() {
	return inNC(12) || player.currentChallenge == "postc1" || player.currentChallenge == "postc7"
}

function checkMatter(diff) {
	var newMatter = player.matter.mul(E_pow(tmp.matter_rate, diff))
	player.matter = newMatter

	var relativeMatter = player.matter.pow(player.currentChallenge == "postc7" ? 20 : 1)
	if (relativeMatter.gt(player.money)) quickReset()
}

function passiveIPupdating(diff){
	if (player.infinityUpgrades.includes("passiveGen") && player.bestInfinityTime < 9999999999) player.partInfinityPoint += diff / player.bestInfinityTime * 10
	else player.partInfinityPoint = 0

	let x = Math.floor(player.partInfinityPoint / 10)
	if (x > 0) {
		player.partInfinityPoint -= x * 10
		player.infinityPoints = player.infinityPoints.add(getIPMult().mul(x))
	}

	IPonCrunchPassiveGain(diff)
	infUpgPassiveIPGain(diff)
}

function passiveInfinitiesUpdating(diff){
	if (typeof(player.infinitied) != "number") return

	if (player.infinityUpgrades.includes("infinitiedGeneration") && player.currentEternityChall != "eterc4") player.partInfinitied += diff / player.bestInfinityTime
	let x = Math.floor(player.partInfinitied * 2)
	if (x > 0) {
		player.partInfinitied -= x/2
		player.infinitied += x
	}
}

function incrementTimesUpdating(diffStat){
	player.totalTimePlayed += diffStat
	if (ghSave) ghSave.time += diffStat
	if (quSave) quSave.time += diffStat

	if (player.currentEternityChall == "eterc12") diffStat /= 1e3
	player.thisEternity += diffStat
	player.thisInfinityTime += diffStat
	if (inNGM(2)) player.galacticSacrifice.time += diffStat
}

function preInfinityUpdating(diff){
	if (tmp.ri) return

	let offset = inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4) ? 2 : 1
	for (let tier = getNormalDimensions() - offset; tier > 0; --tier) {
		var name = dimTiers[tier];
		player[name + 'Amount'] = player[name + 'Amount'].add(getDimensionProductionPerSecond(tier + offset).mul(diff / 10));
	}
	if (player.dontWant && player.firstAmount.gt(0)) player.dontWant = false

	var tempa = getDimensionProductionPerSecond(1).mul(diff)
	player.money = player.money.add(tempa)	
	player.totalmoney = player.totalmoney.add(tempa)
	if (bigRipped()) brSave.totalAntimatter = brSave.totalAntimatter.add(tempa)
}

function chall2PowerUpdating(diff){
	player.chall2Pow = Math.min(player.chall2Pow + diff / 1800, 1)
}

let postC2Count = 0
function normalChallPowerUpdating(diff){
	if (player.currentChallenge == "postc2") {
		postC2Count += diff
		if (postC2Count >= 0.4) {
			sacrifice(true)
			postC2Count = 0
		}
	}
	if (player.currentChallenge == "postc8") player.postC8Mult = player.postC8Mult.mul(Math.pow(0.000000046416, diff))
	if (inNC(3) || player.matter.gte(1)) player.chall3Pow = player.chall3Pow.mul(E_pow(1.00038, diff)).min(1e200)

	chall2PowerUpdating(diff)
	checkMatter(diff)
}

function infinityTimeBlackHoleDimUpdating(diff){
	var step = inQC(4) ? 2 : 1
	var stepT = inNC(7) && inNGM(4) ? 2 : step
	for (let tier = 1 ; tier < 9; tier++) {
		if (tier < 9 - step) player["infinityDimension"+tier].amount = player["infinityDimension"+tier].amount.add(DimensionProduction(tier+step).mul(diff / 10))
		if (tier < 9 - stepT) player["timeDimension"+tier].amount = player["timeDimension"+tier].amount.add(getTimeDimensionProduction(tier+stepT).mul(diff / 10))
		if (mod.ngud) if (isBHDimUnlocked(tier+step)) player["blackholeDimension"+tier].amount = player["blackholeDimension"+tier].amount.add(getBlackholeDimensionProduction(tier+step).mul(diff / 10))
	}
}

function otherDimsUpdating(diff){
	if (player.currentEternityChall !== "eterc7") player.infinityPower = player.infinityPower.add(DimensionProduction(1).mul(diff))
	 	else if (!inNC(4) && player.currentChallenge !== "postc1") player.seventhAmount = player.seventhAmount.add(DimensionProduction(1).mul(diff))

	 	if (player.currentEternityChall == "eterc7") player.infinityDimension8.amount = player.infinityDimension8.amount.add(getTimeDimensionProduction(1).mul(diff))
	 	else {
		if (ECComps("eterc7") > 0) player.infinityDimension8.amount = player.infinityDimension8.amount.add(DimensionProduction(9).mul(diff))
		player.timeShards = player.timeShards.add(getTimeDimensionProduction(1).mul(diff)).max(getTimeDimensionProduction(1).mul(0))
	}
}

function bigCrunchButtonUpdating(){
	el("bigcrunch").style.display = 'none'
	el("postInfinityButton").style.display = 'none'
	if (tmp.ri) {
		el("bigcrunch").style.display = 'inline-block';
		if ((!inNC(0) || !player.break) && player.bestInfinityTime > 600) TAB_CORE.open("")
	} else if (player.break && player.currentChallenge == "") {
		if (player.money.gte(Number.MAX_VALUE)) {
			el("postInfinityButton").style.display = ""
			var currentIPmin = getIPGain().dividedBy(player.thisInfinityTime/600)
			if (currentIPmin.gt(IPminpeak)) IPminpeak = currentIPmin
			if (IPminpeak.log10() > 1e6) el("postInfinityButton").innerHTML = "Big Crunch"
			else {
				var IPminpart = IPminpeak.log10() > 1e4 ? "" : "<br>" + shortenDimensions(currentIPmin) + " IP/min" + "<br>Peaked at " + shortenDimensions(IPminpeak) + " IP/min"
				el("postInfinityButton").innerHTML = "<b>" + (IPminpeak.log10() > 1e4 ? "Gain " : "Big Crunch for ") + shortenDimensions(getIPGain()) + " Infinity Points.</b>" + IPminpart
			}
		}
	}
}

function nextICUnlockUpdating(){
	var nextUnlock = getNextAt(order[player.postChallUnlocked])

	// unlock Infinity Challenges
	while (nextUnlock != undefined && player.money.gte(nextUnlock)) {
		if (getEternitied() >= 7) {
			player.challenges.push(order[player.postChallUnlocked])
			tmp.ic_power++
		}
		player.postChallUnlocked++
		updateChallenges()
		nextUnlock = getNextAt(order[player.postChallUnlocked])
	}

	// update next unlock text
	let hideNextUnlockDisplay = !hasAch("r51") || nextUnlock == undefined
	if (!hideNextUnlockDisplay)
		el("nextchall").textContent = `Next challenge unlocks at ${shortenCosts(nextUnlock)} antimatter.`
	el("nextchall").style.display = hideNextUnlockDisplay ? "none" : null

	// hide max all button on Antimatter Dimensions tab
	// if all dimension 1-8 + tickspeed autobuyers are enabled
	// and player completed Infinity Challenge 8
	if (getEternitied() >= 7 && player.postChallUnlocked >= 8) {
		ndAutobuyersUsed = 0
		for (i = 0; i <= 8; i++) if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].isOn) ndAutobuyersUsed++
		el("maxall").style.display = ndAutobuyersUsed > 8 && player.challenges.includes("postc8") ? "none" : ""
	}
}

function passiveIPperMUpdating(diff){
	player.infinityPoints = player.infinityPoints.add(bestRunIppm.mul(player.offlineProd/100).mul(diff/600))
}

function giveBlackHolePowerUpdating(diff){
	if (isBHDimUnlocked(1)) player.blackhole.power = player.blackhole.power.add(getBlackholeDimensionProduction(1).mul(diff))
}

function freeTickspeedUpdating(){
	if (mod.rs) ERFreeTickUpdating()
	if (player.timeShards.gt(player.tickThreshold) && !mod.rs) nonERFreeTickUpdating()
}

function replicantiIncrease(diff) {
	if (!player.replicanti.unl) return
	if (diff > 5 || tmp.rep.chance > 1 || tmp.rep.interval < 50 || tmp.rep.est.gt(50) || hasTimeStudy(192)) continuousReplicantiUpdating(diff)
	else notContinuousReplicantiUpdating()
	if (player.replicanti.amount.gt(0)) replicantiTicks += diff

	if (hasMasteryStudy("d10") && quSave.autoOptions.replicantiReset && player.replicanti.amount.gt(quSave.replicants.requirement)) replicantReset(true)
	if (player.replicanti.galaxybuyer && canGetReplicatedGalaxy() && canAutoReplicatedGalaxy()) replicantiGalaxy()
}

function IPMultBuyUpdating() {
	if (player.infMultBuyer && (!mod.rs || canBuyIPMult())) {
		var dif = Math.floor(player.infinityPoints.div(player.infMultCost).log(mod.ngep?4:10)) + 1
		if (dif > 0) {
			player.infMult = player.infMult.mul(E_pow(getIPMultPower(), dif))
			player.infMultCost = player.infMultCost.mul(E_pow(ipMultCostIncrease, dif))
			if (player.infinityPoints.lte(pow10(1e9))) player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(mod.ngep?4:10).min(player.infinityPoints))
			if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = Decimal.mul(player.autobuyers[11].priority, E_pow(getIPMultPower(), dif));
			if (player.autoCrunchMode == "amount") el("priority12").value = formatValue("Scientific", player.autobuyers[11].priority, 2, 0);
		}
	}
}

function doEternityButtonDisplayUpdating(diff){
	var unl = canEternity()
	el("eternitybtn").style.display = unl ? "" : "none"
	el("eternitybtn").className = player.dilation.active ? "dilationupg" : "eternitybtn"
	if (!unl) return

	var isSmartPeakActivated = mod.ngp3 && getEternitied() >= 1e13
	var EPminpeakUnits = isSmartPeakActivated ? (player.dilation.active ? 'TP' : tmp.qu.be ? 'EM' : 'EP') : 'EP'
	var currentEPmin = updateEPminpeak(diff, EPminpeakUnits)
	EPminpeakUnits = (EPminpeakType == 'logarithm' ? ' log(' + EPminpeakUnits + ')' : ' ' + EPminpeakUnits) + '/min'

	let flavor = (((!player.dilation.active&&gainedEternityPoints().lt(1e6))||player.eternities<1||player.currentEternityChall!==""||(player.options.theme=="Aarex's Modifications"&&player.options.notation!="Morse code"))
		? ((player.currentEternityChall!=="" ? "Other challenges await..." : player.eternities>0 ? "" : "Other times await...") + " I need to become Eternal.") : "")
	el("eternitybtnFlavor").textContent = flavor
	if (player.dilation.active && player.dilation.totalTachyonParticles.gte(getDilGain())) el("eternitybtnEPGain").innerHTML = "Reach " + shortenMoney(getReqForTPGain()) + " antimatter to gain more Tachyon Particles."
	else {
		if ((EPminpeak.lt(pow10(9)) && EPminpeakType == "logarithm") || (EPminpeakType == 'normal' && EPminpeak.lt(pow10(1e9)))) {
			el("eternitybtnEPGain").innerHTML = ((player.eternities > 0 && (player.currentEternityChall==""||player.options.theme=="Aarex's Modifications"))
				? "Gain <b>"+(player.dilation.active?shortenMoney(getDilGain().sub(player.dilation.totalTachyonParticles)):shortenDimensions(gainedEternityPoints()))+"</b> "+(player.dilation.active?"Tachyon particles.":tmp.qu.be?"EP and <b>"+shortenDimensions(getEMGain())+"</b> Eternal Matter.":"Eternity Points.") : "")
		} else el("eternitybtnEPGain").innerHTML = flavor == "" ? "<b>Go eternal</b>" : ""
	}
	var showEPmin=(player.currentEternityChall===""||player.options.theme=="Aarex's Modifications")&&EPminpeak>0&&player.eternities>0&&player.options.notation!='Morse code'&&player.options.notation!='Spazzy'&&(!(player.dilation.active||tmp.qu.be)||isSmartPeakActivated)
	if (EPminpeak.log10() < 1e5) {
		el("eternitybtnRate").textContent = (showEPmin&&(EPminpeak.lt("1e30003")||player.options.theme=="Aarex's Modifications")
										? (EPminpeakType == "normal" ? shortenDimensions(currentEPmin) : shorten(currentEPmin))+EPminpeakUnits : "")
		el("eternitybtnPeak").textContent = showEPmin ? "Peaked at "+(EPminpeakType == "normal" ? shortenDimensions(EPminpeak) : shorten(EPminpeak))+EPminpeakUnits : ""
	} else {
		el("eternitybtnRate").textContent = ''
		el("eternitybtnPeak").textContent = ''
	}
}

function doQuantumButtonDisplayUpdating(diff){
	var currentQKmin = E(0)
	if (quantumed && isQuantumReached()) {
		var bigRip = bigRipped()
		if (!bigRip) {
			currentQKmin = quarkGain().dividedBy(quSave.time / 600)
			if (currentQKmin.gt(QKminpeak) && player.meta.antimatter.gte(E_pow(Number.MAX_VALUE,mod.ngp3 ? 1.2 : 1))) {
				QKminpeak = currentQKmin
				QKminpeakValue = quarkGain()
				quSave.autobuyer.peakTime = 0
			} else quSave.autobuyer.peakTime += diff
		}
	}

	let flavor = "I need to go quantum."
	if (!quantumed) flavor = "We have enough to reform... " + flavor
	if (inAnyQC()) flavor = "Embrace the quantum... " + flavor
	if (ghostified) flavor = "Go quantum."
	if (bigRipped()) flavor = (ghostified ? "" : "This isn't potential... ") + "Restore the rift."
	el("quantumbtnFlavor").textContent = flavor

	var showGain = quantumed && notInQC() ? "QK" : ""
	if (bigRipped()) showGain = "SS"

	var gainMsg = ""
	if (showGain == "QK") gainMsg += "+"+shortenDimensions(quarkGain())+" anti-quarks"
	if (showGain == "SS") gainMsg += "+"+shortenDimensions(getSpaceShardsGain())+" Space Shards"
	el("quantumbtnQKGain").textContent = gainMsg

	var showPeak = showGain == "QK" && currentQKmin.lt(1e100)
	if (showPeak) {
		var showQKPeakValue = QKminpeakValue.lt(1e30)
		el("quantumbtnRate").textContent = shortenMoney(currentQKmin)+" aQ/min"
		el("quantumbtnPeak").textContent = (showQKPeakValue ? "" : "Peaked at ") + shortenMoney(QKminpeak)+" aQ/min" + (showQKPeakValue ? " at " + shortenDimensions(QKminpeakValue) + " aQ" : "")
	} else {
		el("quantumbtnRate").textContent = ''
		el("quantumbtnPeak").textContent = ''
	}

	if (!showPeak) el("quantumbtn").removeAttribute('ach-tooltip')
	else {
		let gluons = getGluonGains()
		el("quantumbtn").setAttribute('ach-tooltip', `More information:
			+${shortenDimensions(gluons.rg)} red-green gluons,
			+${shortenDimensions(gluons.gb)} green-blue gluons,
			+${shortenDimensions(gluons.br)} blue-red gluons
		`)
	}
}

function doGhostifyButtonDisplayUpdating(diff){
	var currentGHPmin = E(0)
	if (bigRipped() && isQuantumReached()) {
		currentGHPmin = getGHPGain().dividedBy(ghSave.time / 600)
		if (currentGHPmin.gt(GHPminpeak)) {
			GHPminpeak = currentGHPmin
			GHPminpeakValue = getGHPGain()
		}
	}

	var ghostifyGains = []
	if (ghostified) ghostifyGains.push(shortenDimensions(getGHPGain()) + " Spectral Particles")

	el("ghostifybtnFlavor").textContent = ghostified ? "" : "Time to enlarge! I need to fundament."
	el("GHPGain").textContent = ghostifyGains.length ? "Gain " + ghostifyGains[0] + (ghostifyGains.length > 2 ? ", " + ghostifyGains[1] + "," : "") + (ghostifyGains.length > 1 ? " and " + ghostifyGains[ghostifyGains.length-1] : "") + "." : ""

	var showGHPPeakValue = GHPminpeakValue.lt(1e6) || player.options.theme=="Aarex's Modifications"
	el("GHPRate").textContent = ghostifyGains.length == 1 && showGHPPeakValue ? getGHPRate(currentGHPmin) : ""
	el("GHPPeak").textContent = ghostifyGains.length == 1 ? (showGHPPeakValue?"":"Peaked at ")+getGHPRate(GHPminpeak)+(showGHPPeakValue?" at "+shortenDimensions(GHPminpeakValue)+" ElP":"") : ""
}

function normalSacDisplay() {
	let unl = (player.resets > 4 || player.infinitied > 0 || player.eternities !== 0 || quantumed) && !inQC(6)
	el("confirmation").style.display = unl ? "inline-block" : "none"
	el("sacrifice").style.display = unl ? "inline-block" : "none"
	if (!unl) return

	if (player.eightBought > 0 && player.resets > 4 && player.currentEternityChall !== "eterc3") el("sacrifice").className = "storebtn"
	else el("sacrifice").className = "unavailablebtn"
}

function DimBoostBulkDisplay(){
	var bulkDisplay = player.infinityUpgrades.includes("bulkBoost") || player.autobuyers[9].bulkBought === true ? "inline" : "none"
	el("bulkdimboost").style.display = bulkDisplay
	if (inNGM(3)) el("bulkTickBoostDiv").style.display = bulkDisplay
}

function currentChallengeProgress(){
	var p = Math.min((Decimal.log10(player.money.add(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip',"Percentage to challenge goal")
}

function preBreakProgess(){
	var p = Math.min((Decimal.log10(player.money.add(1)) / Decimal.log10(Number.MAX_VALUE) * 100), 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip',"Percentage to Infinity")
}

function infDimProgress(){
	var p = Math.min(player.money.e / getNewInfReq().money.e * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip',"Percentage to next Dimension unlock")
}

function currentEChallengeProgress(){
	var p = Math.min(Decimal.log10(player.infinityPoints.add(1)) / player.eternityChallGoal.log10() * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip',"Percentage to Eternity Challenge goal")
}

function preEternityProgress(){
	var p = Math.min(Decimal.log10(player.infinityPoints.add(1)) / Decimal.log10(Number.MAX_VALUE)	* 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip',"Percentage to Eternity")
}

function r128Progress(){
	var p = (Decimal.log10(player.infinityPoints.add(1)) / 220).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip','Percentage to "What do I have to do to get rid of you"') 
}

function r138Progress(){
	var p = Math.min(Decimal.log10(player.infinityPoints.add(1)) / 200, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip','Percentage to "That is what I have to do to get rid of you."')
}

function gainTPProgress(){
	var p = (getDilGain().log10() / player.dilation.totalTachyonParticles.log10()).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progress").setAttribute('ach-tooltip','Percentage to the requirement for Tachyon Particle gain')
}

function ngpp13Progress(){
	var gepLog = gainedEternityPoints().log2()
	var goal = Math.pow(2,Math.ceil(Math.log10(gepLog) / Math.log10(2)))
	goal = Decimal.sub("1e40000", player.eternityPoints).log2()
	var percentage = Math.min(gepLog / goal * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = percentage
	el("progresspercent").textContent = percentage
	el("progress").setAttribute('ach-tooltip','Percentage to "In the grim darkness of the far endgame"')
}

function r127Progress(){
	var gepLog = gainedEternityPoints().log2()
	var goal = Math.pow(2,Math.ceil(Math.log10(gepLog) / Math.log10(2)))
	goal = Decimal.sub(Number.MAX_VALUE, player.eternityPoints).log2()
	var percentage = Math.min(gepLog / goal * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = percentage
	el("progresspercent").textContent = percentage
	el("progress").setAttribute('ach-tooltip','Percentage to "But I wanted another prestige layer..."')
}

function preQuantumNormalProgress(){
	var gepLog = gainedEternityPoints().log2()
	var goal = Math.pow(2,Math.ceil(Math.log10(gepLog) / Math.log10(2)))
	if (goal > 131072 && mod.ngpp && !hasAch('ngpp13')) {
		ngpp13Progress()
	} else if (goal > 512 && !hasAch('r127')) {
		r127Progress()
	} else {
		var percentage = Math.min(gepLog / goal * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progress").setAttribute('ach-tooltip',"Percentage to "+shortenDimensions(pow2(goal))+" EP gain")
	}
}

function progressBarUpdating(){
	if (!aarMod.progressBar) return

	el("progressbar").className=""
	if (isTabShown("dim_meta")) doNGP3ProgressBar() 
	else if (player.currentChallenge !== "") {
		currentChallengeProgress()
	} else if (!player.break) {
		preBreakProgess()
	} else if (player.infDimensionsUnlocked.includes(false)) {
		infDimProgress()
	} else if (player.currentEternityChall !== '' && player.infinityPoints.lt(player.eternityChallGoal.pow(2))) {
		currentEChallengeProgress()
	} else if (player.infinityPoints.lt(Number.MAX_VALUE) || player.eternities == 0) {
		preEternityProgress()
	} else if (hasAch('r127') && !hasAch('r128') && player.timestudy.studies.length == 0) {
		r128Progress()
	} else if (hasDilStudy(5) && player.dilation.active && !hasAch('r138') && player.timestudy.studies.length == 0) {
		r138Progress()
	} else if (player.dilation.active && player.dilation.totalTachyonParticles.gte(getDilGain())) {
		gainTPProgress()
	} else if ((inAnyQC() || gainedEternityPoints().gte(pow2(1048576))) && mod.ngpp) doNGP3ProgressBar()
	else preQuantumNormalProgress()
}

function ECRewardDisplayUpdating(){
	el("ec1reward").textContent = "Reward: "+shortenMoney(getECReward(1))+"x on all Time Dimensions (based on time spent this Eternity)"
	el("ec2reward").textContent = "Reward: Infinity Power affects the 1st Infinity Dimension with reduced effect. Currently: " + shortenMoney(getECReward(2)) + "x"
	el("ec3reward").textContent = "Reward: Increase the multiplier for buying 10 Dimensions. Currently: " + shorten(getDimensionPowerMultiplier("no-QC5")) + "x"
	el("ec4reward").textContent = "Reward: Infinity Dimensions gain a multiplier from unspent IP. Currently: " + shortenMoney(getECReward(4)) + "x"
	el("ec5reward").textContent = "Reward: Galaxy cost scaling starts " + getECReward(5) + " galaxies later."
	el("ec6reward").textContent = "Reward: Further reduce the Dimension cost multiplier increase. Currently: " + player.dimensionMultDecrease.toFixed(1) + "x "
	el("ec7reward").textContent = "Reward: First Time Dimensions produce Eighth Infinity Dimensions. Currently: " + shortenMoney(DimensionProduction(9)) + " per second. "
	el("ec8reward").textContent = "Reward: Infinity Power powers up Replicated Galaxies. Currently: " + (getECReward(8) * 100 - 100).toFixed(2) + "%"
	el("ec9reward").textContent = "Reward: Infinity Dimensions gain a " + (inNGM(2) ? "post-Dilation " : "") + " multiplier based on your Time Shards. Currently: "+shortenMoney(getECReward(9))+"x "
	el("ec10reward").textContent = "Reward: Time Dimensions gain a multiplier from your Infinities. Currently: " + shortenMoney(getECReward(10)) + "x "
	el("ec11reward").textContent = "Reward: Further reduce the Tickspeed cost multiplier increase. Currently: " + player.tickSpeedMultDecrease.toFixed(2) + "x "
	el("ec12reward").textContent = "Reward: Infinity Dimension cost multipliers are reduced. (x^" + getECReward(12) + ")"
	el("ec13reward").textContent = "Reward: Increase the exponent of meta-antimatter's effect. (" + (getECReward(13)+9) + "x)"
	el("ec14reward").textContent = "Reward: Free tickspeed upgrades boost the IC3 reward to be " + getIC3EffFromFreeUpgs().toFixed(0) + "x stronger."

	el("ec10span").textContent = shortenMoney(ec10bonus) + "x"
}

function chall23PowerUpdating(){
	el("chall2Pow").textContent = (player.chall2Pow*100).toFixed(2) + "%"
	el("chall3Pow").textContent = shorten(player.chall3Pow*100) + "%"
}

function dimboostBtnUpdating(){
	var shiftRequirement = getShiftRequirement(0);

	if (getAmount(shiftRequirement.tier) >= shiftRequirement.amount) {
		el("softReset").className = 'storebtn';
	} else {
		el("softReset").className = 'unavailablebtn';
	}
}

function galaxyBtnUpdating(){
	if (getAmount(inNC(4)?6:8) >= getGalaxyRequirement()) {
		el("secondSoftReset").className = 'storebtn';
	} else {
		el("secondSoftReset").className = 'unavailablebtn';
	}
}

function newIDDisplayUpdating(){
	el("newDimensionButton").style.display = "none"
	var req = getNewInfReq()
	if (getEternitied() > 24) {
		while (req.money.lt(player.money) && !player.infDimensionsUnlocked[7]) {
			newDimension()
			if (player.infDimBuyers[req.tier-1] && player.currentEternityChall != "eterc8") buyMaxInfDims(req.tier)
			req = getNewInfReq()
		}
	} else if (player.break && player.currentChallenge == "" && !player.infDimensionsUnlocked[7]) {
		el("newDimensionButton").style.display = "inline-block"
		el("newDimensionButton").textContent = "Get " + shortenCosts(req.money) + " antimatter to unlock a new Dimension."
		if (player.money.gte(req.money)) el("newDimensionButton").className = "newdim"
		else el("newDimensionButton").className = "newdimlocked"
	}
}

function d8SacDisplay(){
	if (calcTotalSacrificeBoost().lte(pow10(1e9))) {
		el("sacrifice").setAttribute('ach-tooltip', "Boost the 8th Dimension by " + formatValue(player.options.notation, calcSacrificeBoost(), 2, 2) + "x");
		el("sacrifice").textContent = "Dimensional Sacrifice (" + formatValue(player.options.notation, calcSacrificeBoost(), 2, 2) + "x)"
	} else {
		el("sacrifice").setAttribute('ach-tooltip', "Boost the 8th Dimension");
		el("sacrifice").textContent = "Dimensional Sacrifice (Total: " + formatValue(player.options.notation, calcTotalSacrificeBoost(), 2, 2) + "x)"
	}
}

function EPonEternityPassiveGain(diff){
	if (hasMasteryStudy("t291")) {
		player.eternityPoints = player.eternityPoints.add(gainedEternityPoints().mul(diff / 100))
	}
}

function ngp3DilationUpdating(){
	if (hasMasteryStudy("t292")) {
		let gain = getDilGain(player.dilation.best)
		if (gain.gt(player.dilation.tachyonParticles)) setTachyonParticles(gain)
	}

	if (!player.dilation.active) return

	if (inNGM(2)) player.dilation.bestIP = player.infinityPoints.max(player.dilation.bestIP)
	if (mod.ngp3) player.dilation.best = player.dilation.best.max(player.money)
}

function passiveQuantumLevelStuff(diff) {
	if (bigRipped() && hasAch("ng3p107")) {
		ghSave.ghostParticles = ghSave.ghostParticles.add(getGHPGain().mul(diff))
		let ngain = getNeutrinoGain()
		ghSave.neutrinos.electron = ghSave.neutrinos.electron.add(ngain.mul(diff))
		ghSave.neutrinos.mu = ghSave.neutrinos.mu.add(ngain.mul(diff))
		ghSave.neutrinos.tau = ghSave.neutrinos.tau.add(ngain.mul(diff))
	}

	if (bigRipped()) brSave.spaceShards = brSave && brSave.spaceShards.add(getSpaceShardsGain().mul(diff / 100))
	if (!bigRipped()) {
		quSave.quarks = quSave.quarks.add(quarkGain().sqrt().mul(diff))
		var p = GLUON.mixes
		for (var i = 0; i < 3; i++) {
			var r = quSave.usedQuarks[p[i][0]].min(quSave.usedQuarks[p[i][1]]).div(100)
			quSave.gluons[p[i]] = quSave.gluons[p[i]].add(r.mul(diff))
		}
		if (hasBraveMilestone(15)) quSave.quarks=quSave.quarks.add(quarkGain().mul(diff / 100))
	}
	if (tmp.qu.be && hasBraveMilestone(16)) beSave.eternalMatter = beSave.eternalMatter.add(getEMGain().mul(diff / 100))

	updateQuantumWorth("quick")
}

function TTpassiveGain(diff){
	if (player.dilation.upgrades.includes(10)) {
		var speed = getPassiveTTGen()
		var div = player.timestudy.theorem / speed
		player.timestudy.theorem += diff * speed	
		if (div < 3600 && hasAch("ng3p44")) player.timestudy.theorem += Math.min(diff * 9, 3600 - div) * speed
		if (player.timestudy.theorem > 1e200) player.timestudy.theorem = 1e200
	}
}

function thisQuantumTimeUpdating(){
	setAndMaybeShow("quantumClock", (quSave.times >= 2 || ghostified) && speedrunMilestones < 28, '"Quantum time: <b class=\'QKAmount\'>"+timeDisplayShort(quSave.time)+"</b>"')
}

function fixInfinityTimes(){
	if (player.thisInfinityTime < -10) player.thisInfinityTime = 0
	if (player.bestInfinityTime < -10) player.bestInfinityTime = Infinity
}

function infUpgPassiveIPGain(diff){
	if (diff > player.autoTime && !player.break) player.infinityPoints = player.infinityPoints.add(player.autoIP.div(player.autoTime).mul(diff))
}

function gameLoop(diff, quick) {
	//Game
	updateTemp()

	var thisUpdate = Date.now()
	if (diff == undefined) diff = thisUpdate - player.lastUpdate
	player.lastUpdate = thisUpdate

	diff = Math.max(diff / 1e3, 0)
	var diffStat = diff * 10
	if (player.version === 12.2 && typeof player.shameLevel === 'number') diff *= Math.min(Math.pow(10, player.shameLevel), 1)
	if (player.currentEternityChall === "eterc12") diff /= getEC12Slowdown()
	incrementTimesUpdating(diffStat)

	if (mod.ngp3) {
		ngp3DilationUpdating()
		if (ghostified) {
			if (HIGGS.unlocked()) HIGGS.calc(diff) // Higgs Field
			if (LAB.unlocked()) LAB.calc(diff) // Bosonic Lab
			if (PHOTON.unlocked()) PHOTON.calc(diff) // Photons
			automatorTick(diff)
		}
		if (hasBraveMilestone(8)) passiveQuantumLevelStuff(diff)
		if (quantumed) quantumOverallUpdating(diff)
		if (hasAch("ng3p72")) player.eternities = nMx(player.eternities, gainEternitiedStat())
	}
	if (mod.udsp && player.blackhole.unl) BH_UDSP.calc(diff)
	if (mod.ngpp) metaDimsUpdating(diff)

	infinityTimeBlackHoleDimUpdating(diff) //production of those dims
	giveBlackHolePowerUpdating(diff)

	EPonEternityPassiveGain(diff)
	freeTickspeedUpdating()
	TTpassiveGain(diff)
	if (hasDilStudy(1)) {
		player.dilation.dilatedTime = player.dilation.dilatedTime.add(getDilTimeGainPerSecond().mul(diff))
		gainDilationGalaxies()
	}

	replicantiIncrease(diff * 10)
	passiveIPperMUpdating(diff)
	passiveIPupdating(diff)
	passiveInfinitiesUpdating(diff)
	IPMultBuyUpdating()

	passiveGPGen(diff)
	preInfinityUpdating(diff)
	otherDimsUpdating(diff)

	normalChallPowerUpdating(diff)

	checkPain()
	checkMarathon()
	checkMarathon2()

	//Put here due to peak update.
	if (quick) return
	doEternityButtonDisplayUpdating(diff)
	if (mod.ngp3) {
		doQuantumButtonDisplayUpdating(diff)
		doGhostifyButtonDisplayUpdating(diff)
		if (hasBraveMilestone(8)) updateQuarkDisplay()
	}
	if (PRESET_DIAL.dial) PRESET_DIAL.update()
}

function updateDisplays() {
	//Tab Title
	let abbs = modAbbs(mod, true)
	el("z").textContent = (abbs.length > 8 ? "" : "AD: ") + abbs + (player.options.tabAmount ? " | " + shortenMoney(player.money) + (player.money.e >= 1e6 ? "" : " antimatter") : "")

	//Display
	chall23PowerUpdating()
	updateMoney()
	updateCoinPerSec()
	TAB_CORE.update()
	tickspeedDisplay()
	galSacDisplay()
	progressBarUpdating()
	if (notify_feature_queue) {
		onNotifyFeature(notify_feature_queue)
		notify_feature_queue = ""
	}

	let msg = shortenDimensions(player.infinityPoints)
	el("infinityPoints1").innerHTML = "You have <span class='IPAmount'>"+msg+"</span> Infinity Points."
	msg = "<b class='IPAmount'>"+msg+"</b> Infinity Points"
	if (mod.ngp3 && hasTimeStudy(192)) msg += "<br><b class='IPAmount'>"+shortenDimensions(player.replicanti.amount)+"</b> Replicantis"
	else msg = "You have "+msg+"."
	el("infinityPoints2").innerHTML = msg

	bigCrunchButtonUpdating()
	nextICUnlockUpdating()
	newIDDisplayUpdating()

	if (player.break) el("iplimit").style.display = "inline"
	else el("iplimit").style.display = "none"
	el("IPPeakDiv").style.display=(player.break&&mod.rs)?"":"none"

	msg = "<span class='EPAmount2'>"+shortenDimensions(player.eternityPoints)+"</span> Eternity Points"
	if (tmp.qu.be) msg += "<br><span class='EPAmount2'>"+shortenDimensions(beSave.eternalMatter)+"</span> Eternal Matter"
	else if (mod.ngp3 && hasDilStudy(6)) msg += `<br><span class='EPAmount2'>${shortenDimensions(getEternitied())}</span>
		${nG(player.eternitiesBank, 0) ? "total" : ""}
		Eternities`
	else msg = "You have " + msg + "."
	el("eternityPoints2").innerHTML = msg

	if (el("loadmenu").style.display == "block") changeSaveDesc(savePlacement)
	if (player.options.secrets?.ghostlyNews) nextGhostlyNewsTickerMsg()
}

function simulateTime(seconds, amt, id) {
	//the game is simulated at a 50ms update rate, with a max of 1000 ticks
	//warning: do not call this function with real unless you know what you're doing
	var ticksAmt = Math.min(seconds * 5, amt ?? 1e3)
	var ticks = seconds / ticksAmt
	var storageStart = recordSimulationAmount()

	for (let ticksDone = 0; ticksDone < ticksAmt; ticksDone++) {
		gameLoop(ticks * 1e3, true)
		if (ticksDone % 10 == 0) updatePerSecond(true)
		autoBuyerTick()
	}
	if (seconds >= 3600*6) giveAchievement("Don't you dare sleep")

	var storageEnd = recordSimulationAmount()

	//Show pop-up
	var nothing = true
	var popupString = ""
	for (var [i, x] of Object.entries(storageEnd)) {
		if (x.lte(storageStart[i])) continue
		nothing = false
		popupString += `<b style='color: ${simulateParts[i].color}'>${simulateParts[i].name}</b> → ${shortenDimensions(x)}<br>`
	}

	if (nothing) {
		popupString = "Nothing happened."
		if (id == "lair") popupString+= "<br><br>I told you so."
		giveAchievement("While you were away... Nothing happened.")
	}

	closeToolTip()
	el("offlineprogress").style.display = "block"
	el("offlinetime").innerHTML = `(You've gone offline for ${timeDisplayShort(seconds * 10)})`
	el("offlinetext").innerHTML = popupString
}

let simulateParts = {
	am: {
		amt: _ => player.money,
		name: "Antimatter",
		color: "red"
	},
	ip: {
		amt: _ => player.infinityPower,
		name: "Infinity Power",
		color: "gold"
	},
	rep: {
		amt: _ => player.replicanti.amount,
		name: "Replicantis",
		color: "orange"
	},
	ts: {
		amt: _ => player.timeShards,
		name: "Time Shards",
		color: "#b7f"
	},
	tt: {
		amt: _ => player.timestudy.theorem,
		name: "Time Theorems",
		color: "#b7f"
	},
	dt: {
		amt: _ => player.dilation.dilatedTime,
		name: "Dilated Time",
		color: "#7b7"
	},
	bh: {
		amt: _ => player.blackhole?.power,
		name: "Black Hole Power",
		color: "black"
	},
	bhh: {
		amt: _ => player.blackhole?.hunger,
		name: "Black Hole Hunger",
		color: "black"
	},
	ma: {
		amt: _ => player.meta?.antimatter,
		name: "Meta-Antimatter",
		color: "cyan"
	},
	pos: {
		amt: _ => quSave?.electrons.amount,
		name: "Positrons",
		color: "gold"
	},
	ant: {
		amt: _ => quSave?.replicants.amount,
		name: "Duplicants",
		color: "grey"
	},
	nr: {
		amt: _ => nfSave?.rewards,
		name: "Nanorewards",
		color: "grey"
	},
	ps: {
		amt: _ => todSave?.r.spin,
		name: "Preonic Spin",
		color: "brown"
	},
	rd: {
		amt: _ => todSave?.r.decays,
		name: "Radioactive Decays",
		color: "brown"
	},
	le: {
		amt: _ => PHOTON.unlocked(),
		name: "Light Emissions",
		color: "#b97"
	},
	bm: {
		amt: _ => blSave?.bosons,
		name: "Bosonic Matter",
		color: "#f70"
	},
	inf: {
		amt: _ => player.infinities,
		name: "Infinities",
		color: "gold"
	},
	eter: {
		amt: _ => player.eternities,
		name: "Eternities",
		color: "#b7f"
	}
}

function recordSimulationAmount() {
	let ret = {}
	for (var [i, x] of Object.entries(simulateParts)) ret[i] = E(x.amt() ?? 0)
	return ret
}

var tickWait = 0
var tickWaitStart = 0
function startInterval() {
	gameLoopIntervalId = setInterval(function() {
		if (aarMod.performanceTicks && new Date().getTime() - tickWaitStart < tickWait) return
		tickWait = 1/0

		var tickStart = new Date().getTime()
		try {
			gameLoop()
			updateDisplays()
		} catch (e) {
			console.error(e)
		}
		var tickEnd = new Date().getTime()
		var tickDiff = tickEnd - tickStart

		tickWait = tickDiff * (aarMod.performanceTicks * 2)
		tickWaitStart = tickEnd
	}, player.options.updateRate);
}

var slider = el("updaterateslider");
var sliderText = el("updaterate");

slider.oninput = function() {
	player.options.updateRate = parseInt(this.value);
	sliderText.textContent = "Update rate: " + this.value + "ms"
	if (player.options.updateRate === 200) giveAchievement("You should download some more RAM")
	clearInterval(gameLoopIntervalId)
	startInterval()
}

function dimBoolean() {
	var req = getShiftRequirement(0)
	var amount = getAmount(req.tier)
	if (inQC(6)) return false
	if (!player.autobuyers[9].isOn) return false
	if (player.autobuyers[9].ticks*100 < player.autobuyers[9].interval) return false
	if (amount < req.amount) return false
	if (inNGM(4) && inNC(14)) return false
	if (getEternitied() < 10 && !player.autobuyers[9].bulkBought && amount < getShiftRequirement(player.autobuyers[9].bulk-1).amount) return false
	if (player.overXGalaxies <= player.galaxies) return true
	if (player.autobuyers[9].priority < req.amount && req.tier == ((inNC(4) || player.currentChallenge == "postc1") ? 6 : 8)) return false
	return true
}


function maxBuyGalaxies(manual) {
	if ((inNC(11) || player.currentEternityChall == "eterc6" || player.currentChallenge == "postc1" || (player.currentChallenge == "postc5" && inNGM(3)) || player.currentChallenge == "postc7" || inQC(6)) && !tmp.qu.be) return
	if (player.autobuyers[10].priority > player.galaxies || manual) {
		let amount=getAmount(inNC(4)?6:8)
		let increment=0.5
		let toSkip=0
		var check=0
		while (amount >= getGalaxyRequirement(increment*2) && (player.autobuyers[10].priority > player.galaxies + increment*2 || manual)) increment*=2
		while (increment>=1) {
			check=toSkip+increment
			if (amount >= getGalaxyRequirement(check) && (player.autobuyers[10].priority > player.galaxies + check || manual)) toSkip+=increment
			increment/=2
		}
		galaxyReset(toSkip+1)
	}
}

function autoQuantumABTick(){
	if (quSave.autobuyer.mode == "amount") {
		if (quarkGain().gte(Decimal.round(quSave.autobuyer.limit))) quantum(true, false, 0)
	} else if (quSave.autobuyer.mode == "relative") {
		if (quarkGain().gte(Decimal.round(quSave.autobuyer.limit).mul(quSave.last10[0][1]))) quantum(true, false, 0)
	} else if (quSave.autobuyer.mode == "time") {
		if (quSave.time / 10 >= E(quSave.autobuyer.limit).toNumber()) quantum(true, false, 0)
	} else if (quSave.autobuyer.mode == "peak") {
		if (quSave.autobuyer.peakTime >= E(quSave.autobuyer.limit).toNumber()) quantum(true, false, 0)
	} else if (quSave.autobuyer.mode == "dilation") {
		if (player.dilation.times >= Math.round(E(quSave.autobuyer.limit).toNumber())) quantum(true, false, 0)
	}
}

function autoEternityABTick(){
	if (player.autoEterMode === undefined || player.autoEterMode == "amount") {
		if (gainedEternityPoints().gte(player.eternityBuyer.limit)) eternity(false, true)
	} else if (player.autoEterMode == "time") {
		if (player.thisEternity / 10 >= E(player.eternityBuyer.limit).toNumber()) eternity(false, true)
	} else if (player.autoEterMode == "relative") {
		if (gainedEternityPoints().gte(player.lastTenEternities[0][1].mul(player.eternityBuyer.limit))) eternity(false, true)
	} else if (player.autoEterMode == "relativebest") {
		if (gainedEternityPoints().gte(bestEp.mul(player.eternityBuyer.limit))) eternity(false, true)
	} else if (player.autoEterMode == "replicanti") {
		if (player.replicanti.amount.gte(player.eternityBuyer.limit)) eternity(false, true)
	} else if (player.autoEterMode == "peak") {
		if (player.peakSpent >= E(player.eternityBuyer.limit).toNumber()*10 && EPminpeak.gt(0)) eternity(false, true)
	} else if (player.autoEterMode == "eternitied") {
		var eternitied = getEternitied()
		if (nG(nA(eternitied, gainEternitiedStat()), nM(eternitied, E(player.eternityBuyer.limit).toNumber()))) eternity(false, true)
	}
}

function galSacABTick(){
	if (player.autobuyers[12].ticks*100 >= player.autobuyers[12].interval && getGSAmount().gte(player.autobuyers[12].priority) && player.autobuyers[12].isOn) {
		galacticSacrifice(true);
		player.autobuyers[12].ticks=0
	}
	player.autobuyers[12].ticks++
}

function galaxyABTick(){
	if (player.autobuyers[10].ticks*100 >= player.autobuyers[10].interval && getAmount(inNC(4) ? 6 : 8) >= getGalaxyRequirement() && player.autobuyers[10].isOn) {
		if (getEternitied() < 9) {
			if (player.autobuyers[10].isOn && player.autobuyers[10].priority > player.galaxies) {
				autoS = false;
				el("secondSoftReset").click()
			}
		} else if (timer >= player.autobuyers[10].bulk) {
			maxBuyGalaxies()
			timer = 0
		}
		player.autobuyers[10].ticks = 0
	}
	player.autobuyers[10].ticks++
}

function TSBoostABTick(){
	if (autoTickspeedBoostBoolean()) {
		tickspeedBoost(player.autobuyers[13].bulk)
		player.autobuyers[13].ticks = 0
	}
	player.autobuyers[13].ticks += 1;
}

function TDBoostABTick(){
	if (autoTDBoostBoolean()) {
		tdBoost(1)
		player.autobuyers[14].ticks = 0
	}
	player.autobuyers[14].ticks += 1;
}

function dimBoostABTick(){
	if (player.autobuyers[9].isOn && dimBoolean()) {
		if (player.resets < 4) dimBoost(1)
		else if (getEternitied() < 10 && !player.autobuyers[9].bulkBought) dimBoost(player.autobuyers[9].bulk)
		else if ((Math.round(timer * 100))%(Math.round(player.autobuyers[9].bulk * 100)) == 0 && getAmount(8) >= getShiftRequirement(0).amount) maxBuyDimBoosts()
		player.autobuyers[9].ticks = 0
	}
	player.autobuyers[9].ticks += 1;
}

var timer = 0
function autoBuyerTick() {
	if (mod.ngp3 && speedrunMilestones>22&&quSave.autobuyer.enabled&&!bigRipped()) autoQuantumABTick()
	
	if (getEternitied() >= 100 && isEterBuyerOn()) autoEternityABTick()

	if (player.autobuyers[11]%1 !== 0) {
		if (player.autobuyers[11].ticks*100 >= player.autobuyers[11].interval && player.money !== undefined && player.money.gte(player.currentChallenge == "" ? Number.MAX_VALUE : player.challengeTarget)) {
			if (player.autobuyers[11].isOn) {
				if ((!player.autobuyers[11].requireIPPeak || IPminpeak.gt(getIPGain().div(player.thisInfinityTime/600))) && player.autobuyers[11].priority) {
					if (player.autoCrunchMode == "amount") {
						if (!player.break || player.currentChallenge != "" || getIPGain().gte(player.autobuyers[11].priority)) {
							autoS = false;
							bigCrunch(true)
						}
					} else if (player.autoCrunchMode == "time"){
						if (!player.break || player.currentChallenge != "" || player.thisInfinityTime / 10 >= E(player.autobuyers[11].priority).toNumber()) {
							autoS = false;
							bigCrunch(true)
						}
					} else if (player.autoCrunchMode == "replicanti"){
						if (!player.break || player.currentChallenge != "" || (player.replicanti.galaxies >= (player.autobuyers[11].priority.toString().toLowerCase()=="max"?player.replicanti.gal:Math.round(E(player.autobuyers[11].priority).toNumber())) && (!player.autobuyers[11].requireMaxReplicanti || player.replicanti.amount.gte(getReplicantiLimit())))) {
							autoS = false;
							bigCrunch(true)
						}
					} else {
						if (!player.break || player.currentChallenge != "" || getIPGain().gte(player.lastTenRuns[0][1].mul(player.autobuyers[11].priority))) {
							autoS = false;
							bigCrunch(true)
						}
					}
				}
				player.autobuyers[11].ticks = 1;
			}
		} else player.autobuyers[11].ticks += 1;
	}

	if (inNGM(2) && player.autobuyers[12]%1 !== 0) galSacABTick()
	if (player.autobuyers[10]%1 !== 0) galaxyABTick()
	if (player.autobuyers[9]%1 !== 0) dimBoostABTick()
	if (inNGM(3) && player.autobuyers[13]%1 !== 0) TSBoostABTick()
	if (inNGM(4) && player.autobuyers[14]%1 !== 0) TDBoostABTick()

	if (player.autoSacrifice%1 !== 0) {
		if ((inNGM(2) ? player.autoSacrifice.ticks * 100 >= player.autoSacrifice.interval : true) && calcSacrificeBoost().gte(player.autoSacrifice.priority) && player.autoSacrifice.isOn) {
			sacrifice(true)
			if (inNGM(2)) player.autoSacrifice.ticks=0
		}
		if (inNGM(2)) player.autoSacrifice.ticks++
	}

	for (var i=0; i<priority.length; i++) {
		if (priority[i].ticks * 100 >= priority[i].interval || priority[i].interval == 100) {
			if (priority[i].isOn) {
				if (priority[i] == player.autobuyers[8]) {
					if (!inNC(14) || inNGM(3)) {
						if (priority[i].target == 10) buyMaxTickSpeed()
						else buyTickSpeed()
					}
				} else if (canBuyDimension(priority[i].tier)) {
					if (priority[i].target > 10) {
						if (player.options.bulkOn) buyBulkDimension(priority[i].target - 10, priority[i].bulk, true)
						else buyBulkDimension(priority[i].target - 10, 1, true)
					} else {
						buyOneDimension(priority[i].target)
					}
					if (inNGM(4)) buyMaxTimeDimension(priority[i].target % 10, priority[i].bulk)
				}
				priority[i].ticks = 0;
			}
		} else priority[i].ticks += 1;
	}
}


setInterval(function() {
	timer += 0.05
	if (player) if (!player.infinityUpgrades.includes("autoBuyerUpgrade")) autoBuyerTick()
}, 100)

setInterval(function() {
	if (player) if (player.infinityUpgrades.includes("autoBuyerUpgrade")) autoBuyerTick()
}, 50)

for (let ncid = 2; ncid <= 12; ncid++){
	el("challenge" + ncid).onclick = function () {
		startNormalChallenge(ncid)
	}
}

function isEterBuyerOn() {
	if (!player.eternityBuyer.isOn) return
	if (!player.eternityBuyer.ifAD || player.dilation.active) return true
	if (!player.eternityBuyer.dilationMode) return false
	return (player.eternityBuyer.dilMode != "upgrades" && !player.eternityBuyer.slowStopped) || (player.eternityBuyer.dilMode == "upgrades" && player.eternityBuyer.tpUpgraded)
}

function toggleProgressBar() {
	aarMod.progressBar=!aarMod.progressBar
	el("progressBarBtn").textContent = (aarMod.progressBar?"Hide":"Show")+" progress bar"	
}

function closeToolTip(showStuck) {
	var elements = el_class("popup")
	for (var i=0; i<elements.length; i++) if (elements[i].id!='welcome') elements[i].style.display = "none"
	if (showStuck && !game_loaded) stuckPopUp()
}

var game_loaded
function initGame() {
	//Setup stuff.
	initiateMetaSave()
	migrateOldSaves()
	setupBugfixData()
	setupHTMLAndData()
	saveMeta()

	//Load a save.
	load_game(false, "start")

	//On load
	game_loaded = true
	console.log("[ 👻 Antimatter Dimensions: NG+3 v" + ngp3_ver + ": Ghostify Respecced 👻 ]")
	setTimeout(function(){
		el("container").style.display = "block"
		el("loading").style.display = "none"
		updatePaddingForFooter()
		resizeCanvas()
	}, 100)
	clearInterval(stuckTimeout)

	setInterval(updatePerSecond, 1000)
	updatePerSecond()
}

window.addEventListener("resize", resizeCanvas)
window.addEventListener('keydown', function(event) {
	if (keySequence == 0 && event.keyCode == 38) keySequence++
	else if (keySequence == 1 && event.keyCode == 38) keySequence++
	else if (keySequence == 2 && event.keyCode == 40) keySequence++
	else if (keySequence == 3 && event.keyCode == 40) keySequence++
	else if (keySequence == 4 && event.keyCode == 37) keySequence++
	else if (keySequence == 5 && event.keyCode == 39) keySequence++
	else if (keySequence == 6 && event.keyCode == 37) keySequence++
	else if (keySequence == 7 && event.keyCode == 39) keySequence++
	else if (keySequence == 8 && event.keyCode == 66) keySequence++
	else if (keySequence == 9 && event.keyCode == 65) giveAchievement("30 Lives")
	else keySequence = 0;
	if (keySequence2 == 0 && event.keyCode == 49) keySequence2++
	else if (keySequence2 == 1 && event.keyCode == 55) keySequence2++
	else if (keySequence2 == 2 && event.keyCode == 55) keySequence2++
	else if (keySequence2 == 3 && event.keyCode == 54) giveAchievement("Revolution, when?")
	else keySequence2 = 0
	
	if (event.keyCode == 17) controlDown = true;
	if (event.keyCode == 16) {
		shiftDown = true;
		drawStudyTree()
		drawMasteryTree()
	}
	if ((controlDown && shiftDown && (event.keyCode == 67 || event.keyCode == 73 || event.keyCode == 74)) || event.keyCode == 123) {
		giveAchievement("Stop right there criminal scum!")
	}
}, false);

window.addEventListener('keyup', function(event) {
	if (event.keyCode == 17) controlDown = false;
	if (event.keyCode == 16) {
		shiftDown = false;
		drawStudyTree()
		drawMasteryTree()
	}
}, false);

window.onfocus = function() {
	controlDown = false;
	shiftDown = false;
	drawStudyTree()
	drawMasteryTree()
}

window.addEventListener('keydown', function(event) {
	if (!player.options.hotkeys || controlDown === true || document.activeElement.type === "text" || document.activeElement.type === "textarea" || document.activeElement.type === "number" || onImport) return false

	const key = event.keyCode;
	if (key >= 49 && key <= 56) {
		if (shiftDown) buyOneDimension(key-48)
		else buyManyDimension(key-48)
		return false;
	}
	switch (key) {
		case 37: // Left
			TAB_CORE.shift("root", -1)
			break
		case 39: // Right
			TAB_CORE.shift("root", 1)
			break
		case 38: // Up
			TAB_CORE.shift(tmp.tab.open.root, -1)
			break
		case 40: // Down
			TAB_CORE.shift(tmp.tab.open.root, 1)
			break

		case 65: // A
			toggleAutoBuyers()
			break
		case 66: // B
			if (hasAch("ng3p51")) bigRip()
			else if (inNGM(3)) manualTickspeedBoost()
			break
		case 68: // D
			if (shiftDown && hasAch("ngpp11")) metaBoost()
			else if (hasAch("r136")) startDilatedEternity()
			else el("softReset").onclick()
			break
		case 70: // F
			if (hasAch("ng3p51")) ghostify()
			break
		case 71: // G
			if (!hasAch("ng3p51")) el("secondSoftReset").onclick()
			break
		case 76: // N
			if (inNGM(4)) tdBoost(1)
			break
		case 77: // M
			if (ndAutobuyersUsed<9||!player.challenges.includes("postc8")) el("maxall").onclick()
			if (hasDilStudy(6)) {
				var maxmeta=true
				for (d = 1; d < 9; d++) {
					if (player.autoEterOptions["meta" + d]) {
						if (d > 7 && speedrunMilestones < 28) maxmeta = false
					} else break
				}
				if (maxmeta) el("metaMaxAll").onclick()
			}
			break
		case 82: // R
			replicantiGalaxy()
			break
		case 83: // S
			sacrifice()
			break
		case 84: // T
			if (shiftDown) buyTickSpeed()
			else buyMaxTickSpeed()
			break
		case 85: // U
			if (mod.ngp3) unstableAll()
			break
	}
}, false);

window.addEventListener('keyup', function(event) {
	if (event.keyCode === 70) {
		$.notify("Paying respects", "info")
		giveAchievement("It pays to have respect")
	}
		if (Math.random() <= 1e-6) giveAchievement("keyboard broke?")
	if (!player.options.hotkeys || controlDown === true || document.activeElement.type === "text") return false
	switch (event.keyCode) {
		case 67: // C
		bigCrunch()
		break;

		case 69: // E, also, nice.
		el("eternitybtn").onclick();
		break;
		
		case 81: // Q, for quantum.
		if (mod.ngpp) quantum(false,false,0)
		break;
	}
}, false);

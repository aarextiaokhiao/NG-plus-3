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
var TIER_NAMES = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
var DISPLAY_NAMES = [ null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth" ];
var break_infinity_js
var forceHardReset = false;
var player
var metaSave = null
var modes = {}
var gameSpeed = 1

//TO-DO: Move setup into another file.
function setupAutobuyerHTMLandData(){
	el("buyerBtn" + 1).onclick = function () { 
		buyAutobuyer(1 - 1);
	}

	el("buyerBtn" + 2).onclick = function () { 
		buyAutobuyer(2 - 1);
	}

	el("buyerBtn" + 3).onclick = function () { 
		buyAutobuyer(3 - 1);
	}

	el("buyerBtn" + 4).onclick = function () { 
		buyAutobuyer(4 - 1);
	}

	el("buyerBtn" + 5).onclick = function () { 
		buyAutobuyer(5 - 1);
	}

	el("buyerBtn" + 6).onclick = function () { 
		buyAutobuyer(6 - 1);
	}

	el("buyerBtn" + 7).onclick = function () { 
		buyAutobuyer(7 - 1);
	}

	el("buyerBtn" + 8).onclick = function () { 
		buyAutobuyer(8 - 1);
	}

	el("buyerBtnTickSpeed").onclick = function () {
		buyAutobuyer(8);
	}

	el("buyerBtnDimBoost").onclick = function () {
		buyAutobuyer(9);
	}

	el("buyerBtnGalaxies").onclick = function () {
		buyAutobuyer(10);
	}

	el("buyerBtnInf").onclick = function () {
		buyAutobuyer(11);
	}

	for (let abnum = 1; abnum <= 8; abnum ++){
		el("toggleBtn" + abnum).onclick = function () {
			toggleAutobuyerTarget(abnum)
		}
	}

	el("toggleBtnTickSpeed").onclick = function () {
		if (player.autobuyers[8].target == 1) {
			player.autobuyers[8].target = 10
			el("toggleBtnTickSpeed").textContent = "Buys max"
		} else {
			player.autobuyers[8].target = 1
			el("toggleBtnTickSpeed").textContent = "Buys singles"
		}
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
	el("infi14").innerHTML = "Decrease the number of Dimensions needed for Dimension Boosts and Galaxies by 9<br>Cost: 1 IP"
	el("infi24").innerHTML = "Antimatter Galaxies are twice as effective<br>Cost: 2 IP"
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

function setupPCTableHTMLandData(){
	var pcct = el("pccompletionstable")
	var row = pcct.insertRow(0)
	for (let c = 0; c < 9; c++) {
		var col = row.insertCell(c)
		if (c > 0) col.textContent = "#" + c
	}
	for (let r = 1; r < 9; r++) {
		row = pcct.insertRow(r)
		for (let c = 0; c < 9; c++) {
			var col = row.insertCell(c)
			if (c < 1) col.textContent = "#" + r
			else if (c == r) {
				col.id = "qcC" + r
			} else col.id = "pc" + r + c
		}
	}
	var ndsDiv = el("parent")
	var pdsDiv = el("pdTable")
	var edsDiv = el("empDimTable")
	for (let d = 1; d < 9; d++) {
		var row = ndsDiv.insertRow(d - 1)
		row.id = d + "Row"
		row.style["font-size"] = "15px"
		var html = '<td class="rel" id="D' + d + '" align="right" width="32%"> </td>'
		html += '<td id="A' + d + '"></td>'
		html += '<td align="right" width="10%"><button id="B' + d + '" style="color:black; height: 25px; font-size: 10px; width: 135px" class="storebtn" onclick="buyOneDimension(' + d + ')"></button></td>'
		html += '<td align="right" width="10%"><button id="M' + d + '" style="color:black; width:210px; height: 25px; font-size: 10px" class="storebtn" onclick="buyManyDimension(' + d + ')"></button></td>'
		row.innerHTML = html
		
		var row=pdsDiv.insertRow(d-1)
		row.id = "pR" + d
		row.style["font-size"] = "16px"
		var html = '<td id="pD' + d + '" width="41%">' + DISPLAY_NAMES[d] + ' Paradox Dimension x1</td>'
		html += '<td id="pA' + d + '">0 (0)</td>'
		html += '<td align="right" width="10%"><button id="pB'+d+'" style="color:black; width:195px; height:30px" class="storebtn" align="right" onclick="buyPD('+d+')">Cost: ??? Px</button></td></tr>'
		row.innerHTML = html
		
		var row=edsDiv.insertRow(d - 1)
		row.id = "empRow" + d
		row.style["font-size"] = "15px"
		var html = '<td id="empD' + d + '" width="41%">' + DISPLAY_NAMES[d] + ' Emperor Dimension x1</td>'
		html += '<td id="empAmount' + d + '"></td>'
		html += '<td><span class="empQuarks" id="empQuarks' + d + '">0</span> pilons/s</td>'
		html += '<td align="right" width="2.5%"><button id="empFeedMax' + d + '" style="color:black; width:70px; font-size:10px" class="storebtn" align="right" onclick="feedReplicant('+d+', true)">Max</button></td>'
		html += '<td align="right" width="7.5%"><button id="empFeed' + d + '" style="color:black; width:195px; height:25px; font-size:10px" class="storebtn" align="right" onclick="feedReplicant('+d+')">Feed (0%)</button></td>'
		row.innerHTML = html
	}
}

function setupToDHTMLandData(){
	for (var c = 0; c < 1; c++) {
		var color = (["red", "green", "blue"])[c]
		var shorthand = (["r", "g", "b"])[c]
		var branchUpgrades = ["Gain <span id='" + color + "UpgPow1'></span>x preons, but preons decay <span id='" + color + "UpgSpeed1'></span>x faster.",
				      "Boost preons.",
				      "Preons decay <span id='" + color + "UpgEffDesc'>4x</span> slower."] //might need to change this to just "slower" once we have 1000+ upgrade 3's

		var html = '<span class="' + color + '" id="' + color + 'QuarksToD" style="font-size: 35px">0</span> ' + color + ' quarks<br>'
		html += '<button class="storebtn" id="' + color + 'UnstableGain" style="width: 210px; height: 120px" onclick="unstableQuarks(\'' + shorthand + '\')"></button><br>'
		html += "<span class='" + color + "' id='" + color + "UnstableQuarks' style='font-size: 20px'>0</span> " + " <span id='" + shorthand + "UQName'></span> preons<br>"
		html += "<span id='" + color + "QuarksDecayRate'></span><br>"
		html += "(Duration: <span id='" + color + "QuarksDecayTime'></span>)<br>"
		html += '<span class="' + color + '" id="' + color + 'QuarkSpin" style="font-size: 25px">0.0</span> ' + ' preonic spin '
		html += '<span class="' + color + '" id="' + color + 'QuarkSpinProduction" style="font-size: 15px">+0/s</span>'
		el("todRow").innerHTML = html
		el("todRow").className = shorthand + "qC"
		
		html = "<table class='table' align='center' style='margin: auto'><tr>"
		for (var u = 1; u <= 3; u++) {
			html += "<td style='vertical-align: 0'><button class='gluonupgrade unavailablebtn' id='" + color + "upg" + u + "' onclick='buyBranchUpg(\"" + shorthand + "\", " + u + ")' style='font-size:10px'>" + branchUpgrades[u - 1] + "<br>" 
			html += "Currently: <span id='" + color + "upg" + u + "current'>1</span><br><span id='" + color + "upg" + u + "cost'>?</span></button>"
			html += (u == 2 ? "<br><button class='storebtn' style='width: 190px' onclick='maxBranchUpg(\"" + shorthand + "\")'>Max all upgrades</button>" + "<br><button class='storebtn' style='width: 190px; font-size:10px' onclick='maxBranchUpg(\"" + shorthand + "\", true)'>Max 2nd and 3rd upgrades</button>":"")+"</td>"
		}
		html += "</tr></tr><td></td><td><button class='gluonupgrade unavailablebtn' id='" + shorthand + "RadioactiveDecay' style='font-size:9px' onclick='radioactiveDecay(\"" + shorthand + "\")'>Reset to strengthen the 1st upgrade, but nerf this branch.<br><span id='" + shorthand + "RDReq'></span><br>Radioactive Decays: <span id='" + shorthand + "RDLvl'></span></button></td><td></td>"
		html += "</tr></table>"
		el(color + "Branch").innerHTML = html
	}
}

function setupNanofieldHTMLandData(){
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

function setupBraveMilestones(){
	for (var m = 1; m <= 16; m++) el("braveMilestone" + m).textContent=getFullExpansion(tmp.bm[m - 1])+"x quantumed"+(m==1?" or lower":"")
}

function setupBosonicExtraction(){
	var ben = el("enchants")
	for (var g2 = 2; g2 <= br.maxLimit; g2++) {
		var row = ben.insertRow(g2 - 2)
		row.id = "bEnRow" + (g2 - 1)
		for (var g1 = 1; g1 < g2; g1++) {
			var col = row.insertCell(g1 - 1)
			var id = (g1 * 10 + g2)
			col.innerHTML = "<button id='bEn" + id + "' class='gluonupgrade unavailablebtn' style='font-size: 9px' onclick='takeEnchantAction("+id+")'>"+(bEn.descs[id]||"???")+"<br>"+
			"Currently: <span id='bEnEffect" + id + "'>???</span><br>"+
			"<span id='bEnLvl" + id + "'></span><br>" +
			"<span id='bEnOn" + id + "'></span><br>" +
			"Cost: <span id='bEnG1Cost" + id + "'></span> <div class='bRune' type='" + g1 + "'></div> & <span id='bEnG2Cost" + id + "'></span> <div class='bRune' type='" + g2 + "'></div></button><br>"
		}
	}
	var toeDiv = ""
	for (var g = 1; g <= br.maxLimit; g++) toeDiv += ' <button id="typeToExtract' + g + '" class="storebtn" onclick="changeTypeToExtract(' + g + ')" style="width: 25px; font-size: 12px"><div class="bRune" type="' + g + '"></div></button>'
	el("typeToExtract").innerHTML=toeDiv
}

function setupBosonicUpgrades(){
	setupBosonicUpgReqData()
	var buTable=el("bUpgs")
	for (r = 1; r <= bu.maxRows; r++) {
		var row = buTable.insertRow(r - 1)
		row.id = "bUpgRow" + r
		for (c = 1; c < 6; c++) {
			var col = row.insertCell(c - 1)
			var id = (r * 10 + c)
			col.innerHTML = "<button id='bUpg" + id + "' class='gluonupgrade unavailablebtn' style='font-size: 9px' onclick='buyBosonicUpgrade(" + id + ")'>" + (bu.descs[id] || "???") + "<br>" +
			(bu.effects[id] !== undefined ? "Currently: <span id='bUpgEffect" + id + "'>0</span><br>" : "") +
			"Cost: <span id='bUpgCost" + id + "'></span> Bosons<br>" +
			"Requires: <span id='bUpgG1Req" + id + "'></span> <div class='bRune' type='" + bu.reqData[id][2] + "'></div> & <span id='bUpgG2Req" + id + "'></span> <div class='bRune' type='" + bu.reqData[id][4] + "'></div></button>"
		}
	}
}

function setupBosonicRunes(){
	var brTable=el("bRunes")
	for (var g = 1; g <= br.maxLimit; g++) {
		var col = brTable.rows[0].insertCell(g - 1)
		col.id = "bRuneCol" + g
		col.innerHTML = '<div class="bRune" type="' + g + '"></div>: <span id="bRune' + g + '"></span>'
	}
	var glyphs=document.getElementsByClassName("bRune")
	for (var g = 0 ; g < glyphs.length; g++) {
		var glyph = glyphs[g]
		var type = glyph.getAttribute("type")
		if (type > 0 && type <= br.maxLimit) {
			glyph.className = "bRune " + br.names[type]
			glyph.setAttribute("ach-tooltip", br.names[type] + " Hypothesis")
		}
	}
}

function setupHTMLAndData() {
	setupInfUpgHTMLandData()
	setupDilationUpgradeList()
	setupMasteryStudiesHTML()
	setupPCTableHTMLandData()
	setupToDHTMLandData()
	setupNanofieldHTMLandData()
	setupBraveMilestones()
	setupBosonicExtraction()
	setupBosonicUpgrades()
	setupBosonicRunes()
	setupAutobuyerHTMLandData()

	setupPostNGp3HTML()
}

//Theme stuff
function setTheme(name) {
	document.querySelectorAll("link").forEach( function(e) {
		if (e.href.includes("theme")) e.remove();
	});
	
	player.options.theme=name
	if(name !== undefined && name.length < 3) giveAchievement("Shhh... It's a secret")
	var themeName=player.options.secretThemeKey
	if(name === undefined) themeName="Normal"
	else if (name !== "S6") themeName=name

	el("theme").innerHTML="<p style='font-size:15px'>Themes</p>Current theme: " + themeName;
	el("chosenTheme").textContent="Current theme: " + themeName;
	
	if (name === undefined) return;
	if (name === "Aarex's Modifications") name = "Aarexs Modifications"
	if (name === "Aarex's Mods II") name = "Aarexs Mods II"
	if (name === "Aarex's Mods Tribus") name = "Aarexs Mods Tribus"
	
	var head = document.head;
	var link = document.createElement('link');
	
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = "stylesheets/theme-" + name + ".css";
	
	head.appendChild(link);
}

el("theme").onclick = function () {
	closeToolTip()
	el('thememenu').style.display="flex"
}

function showTab(tabName, init) {
	if (tabName == 'quantumtab' && !player.masterystudies) {
		alert("Because Quantum was never fully developed due to the abandonment of development, you cannot access the Quantum tab in NG++. This is the definitive endgame.")
		return
	}
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName("tab");
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
		aarMod.tabsSave.tabMain = tabName
		if ((el("antimatterdimensions").style.display != "none" || el("metadimensions").style.display != "none") && aarMod.progressBar && tabName == "dimensions") el("progress").style.display = "block";
		else el("progress").style.display = "none"
		if ((el("timestudies").style.display != "none" || el("ers_timestudies").style.display != "none" || el("masterystudies").style.display != "none") && tabName=="eternitystore") el("TTbuttons").style.display = "block";
		else el("TTbuttons").style.display = "none"
		if (tabName=="eternitystore") {
			if (el('timestudies') !== "none" || el('masterystudies') !== "none" || el('dilation') !== "none" || el("blackhole") !== "none") resizeCanvas()
			if (el("dilation") !== "none") requestAnimationFrame(drawAnimations)
			if (el("blackhole") !== "none") requestAnimationFrame(drawBlackhole)
		}
		if (tabName=="quantumtab") {
			if (el('uquarks') !== "none") resizeCanvas()
			if (el("uquarks") !== "none") requestAnimationFrame(drawQuarkAnimation)
		}
        showHideFooter(tabName)

		var oldEmpty = isEmptiness
		isEmptiness = tabName=="emptiness" || tabName==""
		if (oldEmpty != isEmptiness) updateHeaders()
	}
	if (!init) closeToolTip();
}


function updateMoney() {
	el("z").textContent = "AD: PNG+3R | " + shortenMoney(player.money) + (player.money.e >= 1e6 ? "" : " antimatter")
	el("coinAmount").textContent = shortenMoney(player.money)

	var element2 = el("matter");
	if (inNC(12) || player.currentChallenge == "postc1" || player.currentChallenge == "postc6" || inQC(6)) element2.textContent = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter."; //TODO

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

function getInfinitiedStat(){
	return getInfinitied()
}

function getInfinitied() {
	return nMx(nA(player.infinitied,player.infinitiedBank),0)
}

function getInfinitiedGain() {
	let infGain=1
	if (player.thisInfinityTime > 50 && hasAch("r87")) infGain = 250
	if (player.timestudy.studies.includes(32)) infGain *= tsMults[32]()
	if (hasAch("r133") && player.meta) infGain = nM(player.dilation.dilatedTime.pow(.25).max(1), infGain)
	return nA(infGain, hasAch("r87") && inNGM(2) ? 249 : 0)
}

function getEternitied() {
	let banked = player.eternitiesBank
	let total = player.eternities
	if (banked && (inQC(0) || hasNU(10))) total = nA(total, player.eternitiesBank)
	return total
}

//DISPLAY FUNCTIONS
function hideDimensions() {
	for (var d = 2; d < 9; d++) if (!canBuyDimension(d)) el(d + "Row").style.display = "none"
}

function updateCosts() {
	var costPart = quantumed ? '' : 'Cost: '
	if (el("dimensions").style.display == "block" && el("antimatterdimensions").style.display == "block") {
		var until10CostPart = quantumed ? '' : 'Until 10, Cost: '
		for (var i=1; i<9; i++) {
			var cost = player[TIER_NAMES[i] + "Cost"]
			var resource = getOrSubResource(i)
			el('B'+i).className = cost.lte(resource) ? 'storebtn' : 'unavailablebtn'
			el('B'+i).textContent = costPart + shortenPreInfCosts(cost)
			el('M'+i).className = cost.times(10 - dimBought(i)).lte(resource) ? 'storebtn' : 'unavailablebtn'
			el('M'+i).textContent = until10CostPart + shortenPreInfCosts(cost.times(10 - dimBought(i)));
		}
	}
	el("tickSpeed").textContent = costPart + shortenPreInfCosts(player.tickSpeedCost);
}

function floatText(id, text, leftOffset = 150) {
	if (!player.options.animations.floatingText) return
	var el = $("#"+id)
	el.append("<div class='floatingText' style='left: "+leftOffset+"px'>"+text+"</div>")
	setTimeout(function() {
		el.children()[0].remove()
	}, 1000)
}

function updateChallenges() {
	var buttons = Array.from(el("normalchallenges").getElementsByTagName("button")).concat(Array.from(el("breakchallenges").getElementsByTagName("button")))
	for (var i=0; i < buttons.length; i++) {
		buttons[i].className = "challengesbtn";
		buttons[i].textContent = "Start"
	}

	tmp.cp=0
	infDimPow=1
	for (var i=0; i < player.challenges.length; i++) {
		el(player.challenges[i]).className = "completedchallengesbtn";
		el(player.challenges[i]).textContent = "Completed"
		if (player.challenges[i].search("postc")==0) tmp.cp++
		if (player.challenges.includes("postc1")) if (player.challenges[i].split("postc")[1]) infDimPow*=inNGM(2)?2:1.3
	}
	
	var challengeRunning
	if (player.currentChallenge === "") {
		if (!player.challenges.includes("challenge1")) challengeRunning="challenge1"
	} else challengeRunning=player.currentChallenge
	if (challengeRunning!==undefined) {
		el(challengeRunning).className = "onchallengebtn";
		el(challengeRunning).textContent = "Running"
	}

	if (inNGM(4)) {
		var chall=player.galacticSacrifice.chall
		if (chall) {
			chall="challenge"+chall
			el(chall).className = "onchallengebtn";
			el(chall).textContent = "Running"
		}
	}

	el("challenge7").parentElement.parentElement.style.display = player.infinitied < 1 && player.eternities < 1 && !quantumed ? "none" : ""
	if (inQC(4)) {
		el("challenge7").className = "onchallengebtn";
		el("challenge7").textContent = "Trapped in"
	}

	if (inQC(6)) for (i=2;i<9;i++) if (i<3||i>5) {
		el("postc"+i).className = "onchallengebtn";
		el("postc"+i).textContent = "Trapped in"
	}

	if (isIC3Trapped()) {
		el("postc3").className = "onchallengebtn";
		el("postc3").textContent = "Trapped in"
	}

	if (player.postChallUnlocked > 0 || Object.keys(player.eternityChalls).length > 0 || player.eternityChallUnlocked !== 0 || quantumed) el("challTabButtons").style.display = "table"
	for (c=0;c<order.length;c++) el(order[c]).parentElement.parentElement.style.display=player.postChallUnlocked<c+1?"none":""
}

function getNextAt(chall) {
	var ret = nextAt[chall]
	if (inNGM(2)) {
		var retNGMM = nextAt[chall+"_ngmm"]
		if (retNGMM) ret = retNGMM
	}
	if (inNGM(3)) {
		var retNGM3 = nextAt[chall+"_ngm3"]
		if (retNGM3) ret = retNGM3
	}
	if (inNGM(4)){
		var retNGM4 = nextAt[chall+"_ngm4"]
		if (retNGM4) ret = retNGM4
	}
	return ret
}

function getGoal(chall) {
	var ret = goals[chall]
	if (inNGM(2)) {
		var retNGMM = goals[chall+"_ngmm"]
		if (retNGMM) ret = retNGMM
	}
	if (inNGM(3)) {
		var retNGM3 = goals[chall+"_ngm3"]
		if (retNGM3) ret = retNGM3
	}
	if (inNGM(4)){
		var retNGM4 = goals[chall+"_ngm4"]
		if (retNGM4) ret = retNGM4
	}
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
	tmp.ec=0
	var locked = true
	for (ec=1;ec<15;ec++) {
		var property = "eterc"+ec 
		var ecdata = player.eternityChalls[property]
		if (ecdata) {
			tmp.ec+=ecdata
			locked=false
		}
		el(property+"div").style.display=ecdata?"inline-block":"none"
		el(property).textContent=ecdata>4?"Completed":"Locked"
		el(property).className=ecdata>4?"completedchallengesbtn":"lockedchallengesbtn"
	}
	if (player.eternityChallUnlocked>0) {
		var property="eterc"+player.eternityChallUnlocked
		var onchallenge=player.currentEternityChall==property
		locked=false
		el(property+"div").style.display="inline-block"
		el(property).textContent=onchallenge?"Running":"Start"
		el(property).className=onchallenge?"onchallengebtn":"challengesbtn"
	}
	el("eterctabbtn").parentElement.style.display = locked?"none":""
	el("autoEC").style.display=quantumed&&tmp.ngp3?"inline-block":"none"
	if (quantumed&&tmp.ngp3) el("autoEC").className=quSave.autoEC?"timestudybought":"storebtn"
}

function glowText(id) {
	var text = el(id);
	text.style.setProperty("-webkit-animation", "glow 1s");
	text.style.setProperty("animation", "glow 1s");
}

function toggleChallengeRetry() {
	player.options.retryChallenge = !player.options.retryChallenge
	el("retry").textContent = "Automatically retry challenges: O" + (player.options.retryChallenge ? "N" : "FF")
}

el("news").onclick = function () {
	if (el("news").textContent === "Click this to unlock a secret achievement.") giveAchievement("Real news")
	if (el("news").textContent === "If you are a ghost, try to click me!" && ghostified && (player.options.secrets === undefined || player.options.secrets.ghostlyNews === undefined)) {
		if (player.options.secrets === undefined) {
			player.options.secrets = {}
			el("secretoptionsbtn").style.display = ""
		}
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

function glowText(id) {
	var text = el(id);
	text.style.setProperty("-webkit-animation", "glow 1s");
	text.style.setProperty("animation", "glow 1s");
}

el("maxall").onclick = function () {
	if (tmp.ri) return false
	if (player.currentChallenge !== 'challenge14' || tmp.ngmX !== 2) buyMaxTickSpeed()
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
			dim.cost = E_pow(getIDCostMult(tier),dim.baseAmount / 10).times(infBaseCost[tier])
		}
	}
}

var ipMultPower = 2
var ipMultCostIncrease = 10
function getIPMultPower() {
	let ret = ipMultPower
	if (hasGalUpg(53)) ret += Math.pow(1.25, -15e4 / player.galacticSacrifice.galaxyPoints.log10())
	return ret
}
function canBuyIPMult() {
	return player.infinityUpgrades.includes("skipResetGalaxy") && player.infinityUpgrades.includes("passiveGen") && player.infinityUpgrades.includes("galaxyBoost") && player.infinityUpgrades.includes("resetBoost") && player.infinityPoints.gte(player.infMultCost)
}

el("infiMult").onclick = function() {
	if (canBuyIPMult()) {
		player.infinityPoints = player.infinityPoints.minus(player.infMultCost)
		player.infMult = player.infMult.times(getIPMultPower());
		player.autoIP = player.autoIP.times(getIPMultPower());
		player.infMultCost = player.infMultCost.times(ipMultCostIncrease)
		if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = Decimal.times(player.autobuyers[11].priority, 2);
		if (player.autoCrunchMode == "amount") el("priority12").value = formatValue("Scientific", player.autobuyers[11].priority, 2, 0);
	}
}


function updateEternityUpgrades() {
	el("eter1").className = (player.eternityUpgrades.includes(1)) ? "eternityupbtnbought" : (player.eternityPoints.gte(5)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter2").className = (player.eternityUpgrades.includes(2)) ? "eternityupbtnbought" : (player.eternityPoints.gte(10)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter3").className = (player.eternityUpgrades.includes(3)) ? "eternityupbtnbought" : (player.eternityPoints.gte(50e3)) ? "eternityupbtn" : "eternityupbtnlocked"
	if (player.boughtDims) {
		el("eterrow2").style.display = "none"
		return
	} else el("eterrow2").style.display = ""
	el("eter4").className = (player.eternityUpgrades.includes(4)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e16)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter5").className = (player.eternityUpgrades.includes(5)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e40)) ? "eternityupbtn" : "eternityupbtnlocked"
	el("eter6").className = (player.eternityUpgrades.includes(6)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e50)) ? "eternityupbtn" : "eternityupbtnlocked"
	if (player.exdilation != undefined && player.dilation.studies.includes(1))  {
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
		updateEternityUpgrades();
		if (name == 4) {
			achMultLabelUpdate(); // Eternity Upgrade 4 applies achievement multiplier to Time Dimensions
		}
	}
}

function getEPCost(bought) {
	if (inNGM(2)) return E_pow(50,bought).times(500)
	return E_pow(bought > 481 ? 1e3 : bought > 153 ? 500 : bought > 58 ? 100 : 50, bought + Math.pow(Math.max(bought - 1334, 0), 1.2)).times(500)	
}

function buyEPMult() {
	if (player.eternityPoints.gte(player.epmultCost)) {
		player.epmult = player.epmult.times(5)
		if (player.autoEterMode === undefined || player.autoEterMode === 'amount') {
			player.eternityBuyer.limit = Decimal.times(player.eternityBuyer.limit, 5);
			el("priority13").value = formatValue("Scientific", player.eternityBuyer.limit, 2, 0);
		}
		player.eternityPoints = player.eternityPoints.minus(player.epmultCost)
		player.epmultCost = getEPCost(Math.round(player.epmult.ln()/Math.log(5)))
		el("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
		updateEternityUpgrades()
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
	player.epmult = player.epmult.times(E_pow(5, toBuy))
	player.epmultCost = getEPCost(bought+toBuy)
	el("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
}

function playerInfinityUpgradesOnEternity() {
	if (getEternitied() > 19 || hasAch("ng3p51")) return
	else if (getEternitied() > 3) {
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
		if (player.tickSpeedMultDecrease > 2) el("postinfi31").innerHTML = "Tickspeed cost multiplier increase <br>"+player.tickSpeedMultDecrease+"x -> "+(player.tickSpeedMultDecrease-1)+"x<br>Cost: "+shortenDimensions(player.tickSpeedMultDecreaseCost) +" IP"
		else {
			for (c=0;c<ECComps("eterc11");c++) player.tickSpeedMultDecrease-=0.07
			el("postinfi31").innerHTML = "Tickspeed cost multiplier increase<br>"+player.tickSpeedMultDecrease.toFixed(player.tickSpeedMultDecrease<2?2:0)+"x"
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
		if (player.dimensionMultDecrease > 3) el("postinfi42").innerHTML = "Dimension cost multiplier increase <br>"+player.dimensionMultDecrease+"x -> "+(player.dimensionMultDecrease-1)+"x<br>Cost: "+shortenCosts(player.dimensionMultDecreaseCost) +" IP"
		else {
			for (c=0;c<ECComps("eterc6");c++) player.dimensionMultDecrease-=0.2
			el("postinfi42").innerHTML = "Dimension cost multiplier increase<br>"+player.dimensionMultDecrease.toFixed(ECComps("eterc6")%5>0?1:0)+"x"
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
function updateInfCosts() {
	if (el("replicantis").style.display == "block" && el("infinity").style.display == "block") replicantiDisplay()
	if (el("timestudies").style.display == "block" && el("eternitystore").style.display == "block") mainTimeStudyDisplay()
	if (el("ers_timestudies").style.display == "block" && el("eternitystore").style.display == "block") updateERSTTDesc()
}

function toggleRepresentation() {
	// 0 == visible, 1 == not visible
	aarMod.hideRepresentation=!aarMod.hideRepresentation
	el("hideRepresentation").textContent=(aarMod.hideRepresentation?"Show":"Hide")+" antimatter representation"
}

function updateMilestones() {
	var moreUnlocked = tmp.ngp3 && (player.dilation.upgrades.includes("ngpp3") || quantumed)
	var milestoneRequirements = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 25, 30, 40, 50, 60, 80, 100, 1e9, 2e10, 4e11, 1e13]
	for (i=0; i<(moreUnlocked ? 28 : 24); i++) {
		var name = "reward" + i;
		if (i > 23) el("milestone" + i).textContent = shortenMoney(milestoneRequirements[i]) + " Eternities:"
		if (getEternitied() >= milestoneRequirements[i]) {
			el(name).className = "milestonereward"
		} else {
			el(name).className = "milestonerewardlocked"
		}
	}
	el("mdmilestonesrow1a").style.display = moreUnlocked ? "" : "none"
	el("mdmilestonesrow1b").style.display = moreUnlocked ? "" : "none"
	el("mdmilestonesrow2a").style.display = moreUnlocked ? "" : "none"
	el("mdmilestonesrow2b").style.display = moreUnlocked ? "" : "none"
}

function infMultAutoToggle() {
	if (getEternitied()<1) {
		if (canBuyIPMult()) {
			var toBuy = Math.max(Math.floor(player.infinityPoints.div(player.infMultCost).times(ipMultCostIncrease - 1).plus(1).log(ipMultCostIncrease)), 1)
			var toSpend = E_pow(ipMultCostIncrease, toBuy).sub(1).div(ipMultCostIncrease - 1).times(player.infMultCost).round()
			if (toSpend.gt(player.infinityPoints)) player.infinityPoints = E(0)
			else player.infinityPoints = player.infinityPoints.sub(toSpend)
			player.infMult = player.infMult.times(E_pow(getIPMultPower(), toBuy))
			player.infMultCost = player.infMultCost.times(E_pow(ipMultCostIncrease,toBuy))
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
	var ret = E_pow(5, player.infinityPoints.plus(gainedInfinityPoints()).e / (hasAch("ng3p23") ? 307.8 : 308) - 0.7).times(player.epmult)
	if (aarMod.newGameExpVersion) ret = ret.times(10)
	if (player.timestudy.studies.includes(61)) ret = ret.times(tsMults[61]())
	if (player.timestudy.studies.includes(121)) ret = ret.times(((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5)) //x300 if tryhard, ~x60 if not
	else if (player.timestudy.studies.includes(122)) ret = ret.times(35)
	else if (player.timestudy.studies.includes(123)) ret = ret.times(Math.sqrt(1.39*player.thisEternity/10))
	if (hasGalUpg(51)) ret = ret.times(galMults.u51())
	if (tmp.ngp3) {
		if (brSave.active) {
			if (isBigRipUpgradeActive(5)) ret = ret.times(brSave.spaceShards.max(1))
			if (isBigRipUpgradeActive(8)) ret = ret.times(tmp.bru[8])
		}
		if (tmp.be) ret = ret.times(getBreakUpgMult(7))
	}
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

function toggleTabsSave() {
	aarMod.tabsSave.on =! aarMod.tabsSave.on
	el("tabsSave").textContent = "Saved tabs: O" + (aarMod.tabsSave.on ? "N" : "FF")
}

function updatePerformanceTicks() {
	if (aarMod.performanceTicks) el("updaterateslider").min=1
	else {
		slider.min=33
		if (player.options.updateRate<33) {
			clearInterval(gameLoopIntervalId)
			player.options.updateRate=33
			sliderText.textContent="Update rate: "+player.options.updateRate+"ms"
			startInterval()
		}
	}
	el("performanceTicks").textContent = "Performance ticks: " + ["OFF", "LOW", "MEDIUM", "HIGH"][(aarMod.performanceTicks || 0) + 0]
}

function togglePerformanceTicks() {
	aarMod.performanceTicks = ((aarMod.performanceTicks || 0) + 1) % 4
	updatePerformanceTicks()
}

function showHideFooter(tab, toggle) {
	if (toggle) aarMod.noFooter = !aarMod.noFooter
	el("nofooterbtn").textContent = (aarMod.noFooter ? "Show" : "Hide") + " footer"
	el("footer").style.display = tab == "options" || !aarMod.noFooter ? "" : "none"
}

el("newsbtn").onclick = function(force) {
	player.options.newsHidden=!player.options.newsHidden
	el("newsbtn").textContent=(player.options.newsHidden?"Show":"Hide")+" news ticker"
	el("game").style.display=player.options.newsHidden?"none":"block"
	if (!player.options.newsHidden) scrollNextMessage()
}

function resetDimensions() {
	var costs = [10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24]
	var costMults = [1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15]
	if (inNC(10) || player.currentChallenge == "postc1") costs = [10, 100, 100, 500, 2500, 2e4, 2e5, 4e6]
	if (inNC(10)) costMults = [1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4]
	for (var d=1;d<9;d++) {
		var name=TIER_NAMES[d]
		player[name+"Amount"] = E(0)
		player[name+"Bought"] = 0
		player[name+"Cost"] = E(costs[d-1])
	}
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
		if (player.timestudy.studies.includes(228)) pow = 0.013
		else if (hasAch("r97") && player.boughtDims) pow = 0.012
		else if (hasAch("r88")) pow = 0.011
		ret = player.firstAmount.div(player.sacrificed.max(1)).pow(pow).max(1)
	} else if (!inNC(11)) {
		pow = 2
		if (hasAch("r32")) pow += inNGM(3) ? 2 : 0.2
		if (hasAch("r57")) pow += player.boughtDims ? 0.3 : 0.2 //this upgrade was too OP lol
		ret = E_pow(Math.max(player.firstAmount.e/10.0, 1) / Math.max(player.sacrificed.e/10.0, 1), pow).max(1)
	} else ret = player.firstAmount.pow(0.05).dividedBy(player.sacrificed.pow(inNGM(4)?0.05:0.04).max(1)).max(1)
	if (player.boughtDims) ret = ret.pow(1 + Math.log(1 + Math.log(1 + player.timestudy.ers_studies[1] / 5)))
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
		if (player.timestudy.studies.includes(228)) pow = 0.013
		else if (hasAch("r97") && player.boughtDims) pow = 0.012
		else if (hasAch("r88")) pow = 0.011
		ret = player.sacrificed.pow(pow).max(1)
	} else if (!inNC(11)) {
		pow = 2
		if (hasAch("r32")) pow += inNGM(3) ? 2 : 0.2
		if (hasAch("r57")) pow += player.boughtDims ? 0.3 : 0.2 //this upgrade was too OP lol
		ret = E_pow(Math.max(player.sacrificed.e/10.0, 1), pow)
	} else ret = player.chall11Pow 
	if (player.boughtDims) ret = ret.pow(1 + Math.log(1 + Math.log(1 + (player.timestudy.ers_studies[1] + (next ? 1 : 0))/ 5)))
	return ret
}

function sacrifice(auto = false) {
	if (player.eightAmount == 0) return false;
	if (player.resets < 5) return false
	if (player.currentEternityChall == "eterc3") return false
	var sacGain = calcSacrificeBoost()
	var maxPower = inNGM(2) ? "1e8888" : Number.MAX_VALUE
	if (inNC(11) && (tmp.sacPow.gte(maxPower) || player.chall11Pow.gte(maxPower))) return false
	if (!auto) floatText("D8", "x" + shortenMoney(sacGain))
	player.sacrificed = player.sacrificed.plus(player.firstAmount);
	if (!inNC(11)) {
		if ((inNC(7) || player.currentChallenge == "postcngm3_3") && !hasAch("r118")) clearDimensions(6);
		else if (!hasAch("r118")) clearDimensions(7);
	} else {
		player.chall11Pow = player.chall11Pow.times(sacGain)
		if (!hasAch("r118")) resetDimensions();
		player.money = E(100)
	}
	tmp.sacPow = tmp.sacPow.times(sacGain)
}

el("sacrifice").onclick = function () {
	if (player.eightAmount.eq(0)) return false
	if (!el("confirmation").checked) {
		if (!confirm("Dimensional Sacrifice will remove all of your First to Seventh Dimensions (with the cost and multiplier unchanged) for a boost to the Eighth Dimension. It will take time to regain production.")) {
			return false;
		}
	}
	auto = false;
	return sacrifice();
}

var ndAutobuyersUsed = 0
function updateAutobuyers() {
	var autoBuyerDim1 = new Autobuyer (1)
    	var autoBuyerDim2 = new Autobuyer (2)
    	var autoBuyerDim3 = new Autobuyer (3)
    	var autoBuyerDim4 = new Autobuyer (4)
    	var autoBuyerDim5 = new Autobuyer (5)
    	var autoBuyerDim6 = new Autobuyer (6)
    	var autoBuyerDim7 = new Autobuyer (7)
    	var autoBuyerDim8 = new Autobuyer (8)
    	var autoBuyerDimBoost = new Autobuyer (9)
    	var autoBuyerGalaxy = new Autobuyer (el("secondSoftReset"))
    	var autoBuyerTickspeed = new Autobuyer (el("tickSpeed"))
    	var autoBuyerInf = new Autobuyer (el("bigcrunch"))
    	var autoSacrifice = new Autobuyer(13)

    	if (aarMod.newGameExpVersion) {
        	autoBuyerDim1.interval = 1000
        	autoBuyerDim2.interval = 1000
        	autoBuyerDim3.interval = 1000
        	autoBuyerDim4.interval = 1000
        	autoBuyerDim5.interval = 1000
        	autoBuyerDim6.interval = 1000
        	autoBuyerDim7.interval = 1000
        	autoBuyerDim8.interval = 1000
    	} else {
        	autoBuyerDim1.interval = 1500
        	autoBuyerDim2.interval = 2000
        	autoBuyerDim3.interval = 2500
        	autoBuyerDim4.interval = 3000
        	autoBuyerDim5.interval = 4000
        	autoBuyerDim6.interval = 5000
        	autoBuyerDim7.interval = 6000
        	autoBuyerDim8.interval = 7500
    	}
    	autoBuyerDimBoost.interval = 8000
    	autoBuyerGalaxy.interval = inNGM(2) ? 6e4 : 1.5e4
    	autoBuyerTickspeed.interval = 5000
    	autoBuyerInf.interval = inNGM(2) ? 6e4 : 3e5
   	if (player.boughtDims) {
        	autoBuyerInf.requireMaxReplicanti = false
        	autoBuyerInf.requireIPPeak = false
    	}

    	autoSacrifice.interval = inNGM(2) ? 1.5e4 : 100
    	autoSacrifice.priority = 5

    	autoBuyerDim1.tier = 1
    	autoBuyerDim2.tier = 2
    	autoBuyerDim3.tier = 3
    	autoBuyerDim4.tier = 4
    	autoBuyerDim5.tier = 5
    	autoBuyerDim6.tier = 6
    	autoBuyerDim7.tier = 7
    	autoBuyerDim8.tier = 8
    	autoBuyerTickSpeed.tier = 9
	
    	if (inNGM(2)) {
        	var autoGalSacrifice = new Autobuyer(14)
        	autoGalSacrifice.interval = 1.5e4
        	autoGalSacrifice.priority = 5
    	}
	
    	if (inNGM(3)) {
        	var autoTickspeedBoost = new Autobuyer(15)
        	autoTickspeedBoost.interval = 1.5e4
        	autoTickspeedBoost.priority = 5
    	}
	if (inNGM(4)) {
        	var autoTDBoost = new Autobuyer(16)
        	autoTDBoost.interval = 15e3
        	autoTDBoost.priority = 5
        	autoTDBoost.overXGals = 0
    	}

    	if (player.challenges.includes("challenge1") && player.autobuyers[0] == 1) {
        	player.autobuyers[0] = autoBuyerDim1
        	el("autoBuyer1").style.display = "inline-block"
    	} else el("autoBuyer1").style.display = "none"
    	if (player.challenges.includes("challenge2") && player.autobuyers[1] == 2) {
        	player.autobuyers[1] = autoBuyerDim2
        	el("autoBuyer2").style.display = "inline-block"
    	} else el("autoBuyer2").style.display = "none"
    	if (player.challenges.includes("challenge3") && player.autobuyers[2] == 3) {
        	player.autobuyers[2] = autoBuyerDim3
        	el("autoBuyer3").style.display = "inline-block"
    	} else el("autoBuyer3").style.display = "none"
    	if (player.challenges.includes("challenge4") && player.autobuyers[9] == 10) {
        	player.autobuyers[9] = autoBuyerDimBoost
        	el("autoBuyerDimBoost").style.display = "inline-block"
    	} else {
        	el("autoBuyerDimBoost").style.display = "none"
        	el("buyerBtnDimBoost").style.display = ""
    	}
    	if (player.challenges.includes("challenge5") && player.autobuyers[8] == 9) {
        	player.autobuyers[8] = autoBuyerTickspeed
        	el("autoBuyerTickSpeed").style.display = "inline-block"
	} else {
        	el("autoBuyerTickSpeed").style.display = "none"
        	el("buyerBtnTickSpeed").style.display = ""
    	}
    	if (player.challenges.includes("challenge6") && player.autobuyers[4] == 5) {
        	player.autobuyers[4] = autoBuyerDim5
        	el("autoBuyer5").style.display = "inline-block"
    	} else el("autoBuyer5").style.display = "none"
    	if (player.challenges.includes("challenge7") && player.autobuyers[11] == 12) {
        	player.autobuyers[11] = autoBuyerInf
        	el("autoBuyerInf").style.display = "inline-block"
    	} else {
        	el("autoBuyerInf").style.display = "none"
        	el("buyerBtnInf").style.display = ""
    	}
    	if (player.challenges.includes("challenge8") && player.autobuyers[3] == 4) {
        	player.autobuyers[3] = autoBuyerDim4
        	el("autoBuyer4").style.display = "inline-block"
    	} else el("autoBuyer4").style.display = "none"
    	if (player.challenges.includes("challenge9") && player.autobuyers[6] == 7) {
        	player.autobuyers[6] = autoBuyerDim7
        	el("autoBuyer7").style.display = "inline-block"
    	} else el("autoBuyer7").style.display = "none"
    	if (player.challenges.includes("challenge10") && player.autobuyers[5] == 6) {
        	player.autobuyers[5] = autoBuyerDim6
        	el("autoBuyer6").style.display = "inline-block"
    	} else el("autoBuyer6").style.display = "none"
    	if (player.challenges.includes("challenge11") && player.autobuyers[7] == 8) {
        	player.autobuyers[7] = autoBuyerDim8
        	el("autoBuyer8").style.display = "inline-block"
    	} else el("autoBuyer8").style.display = "none"
    	if (player.challenges.includes("challenge12") && player.autobuyers[10] == 11) {
        	player.autobuyers[10] = autoBuyerGalaxy
        	el("autoBuyerGalaxies").style.display = "inline-block"
        	el("buyerBtnGalaxies").style.display = ""
    	} else el("autoBuyerGalaxies").style.display = "none"
    	if ((player.challenges.includes("postc2") || player.challenges.includes("challenge13") || player.challenges.includes("challenge16")) && player.autoSacrifice == 1) {
        	player.autoSacrifice = autoSacrifice
        	el("autoBuyerSac").style.display = "inline-block"
        	el("buyerBtnSac").style.display = ""
    	} else el("autoBuyerSac").style.display = "none"
    	if (player.challenges.includes("challenge14") && player.autobuyers[12] == 13) {
        	player.autobuyers[12] = autoGalSacrifice
        	el("autoBuyerGalSac").style.display = "inline-block"
        	el("buyerBtnGalSac").style.display = ""
    	} else el("autoBuyerGalSac").style.display = "none"
   	if (player.challenges.includes("challenge15") && player.autobuyers[13] == 14) {
        	player.autobuyers[13] = autoTickspeedBoost
        	el("autoBuyerTickspeedBoost").style.display = "inline-block"
        	el("buyerBtnTickspeedBoost").style.display = ""
    	} else el("autoBuyerTickspeedBoost").style.display = "none"
    	if (player.challenges.includes("challenge16") && player.autobuyers[14] == 15) {
        	player.autobuyers[14] = autoTDBoost
        	el("autoTDBoost").style.display = "inline-block"
		el("buyerBtnTDBoost").style.display = ""
    	} else el("autoTDBoost").style.display = "none"

	if (getEternitied() >= 100) el("autoBuyerEter").style.display = "inline-block"
    	else el("autoBuyerEter").style.display = "none"

	var intervalUnits = player.infinityUpgrades.includes("autoBuyerUpgrade") ? 1/2000 : 1/1000
	for (var tier = 1; tier <= 8; ++tier) {
		el("interval" + tier).textContent = "Current interval: " + (player.autobuyers[tier-1].interval * intervalUnits).toFixed(2) + " seconds"
	}
	el("intervalTickSpeed").textContent = "Current interval: " + (player.autobuyers[8].interval * intervalUnits).toFixed(2) + " seconds"
	el("intervalDimBoost").textContent = "Current interval: " + (player.autobuyers[9].interval * intervalUnits).toFixed(2) + " seconds"
	el("intervalGalaxies").textContent = "Current interval: " + (player.autobuyers[10].interval * intervalUnits).toFixed(2) + " seconds"
	el("intervalInf").textContent = "Current interval: " + (player.autobuyers[11].interval * intervalUnits).toFixed(2) + " seconds"
	el("intervalSac").textContent = "Current interval: " + (player.autoSacrifice.interval * intervalUnits).toFixed(2) + " seconds"
	if (inNGM(2)) el("intervalGalSac").textContent = "Current interval: " + (player.autobuyers[12].interval * intervalUnits).toFixed(2) + " seconds"
	if (inNGM(3)) el("intervalTickspeedBoost").textContent = "Current interval: " + (player.autobuyers[13].interval * intervalUnits).toFixed(2) + " seconds"
	if (inNGM(4)) el("intervalTDBoost").textContent = "Current interval: " + (player.autobuyers[14].interval * intervalUnits).toFixed(2) + " seconds"

    	var maxedAutobuy = 0;
    	var e100autobuy = 0;
    	var currencyEnd = inNGM(4) ? " GP" : " IP"
    	for (let tier = 1; tier <= 8; ++tier) {
        	el("toggleBtn" + tier).style.display = "inline-block";
        	if (player.autobuyers[tier-1].bulk >= 1e100) {
			player.autobuyers[tier-1].bulk = 1e100;
        		el("buyerBtn" + tier).textContent = shortenDimensions(player.autobuyers[tier-1].bulk)+"x bulk purchase";
        		e100autobuy++;
		} else {
			if (player.autobuyers[tier-1].interval <= 100) {
				if (player.autobuyers[tier-1].bulk * 2 >= 1e100) {
					el("buyerBtn" + tier).innerHTML = shortenDimensions(1e100)+"x bulk purchase<br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + currencyEnd;
				} else {
					el("buyerBtn" + tier).innerHTML = shortenDimensions(player.autobuyers[tier-1].bulk*2)+"x bulk purchase<br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + currencyEnd;
				}
				maxedAutobuy++;
			}
			else el("buyerBtn" + tier).innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + currencyEnd
		}
	}

    	if (player.autobuyers[8].interval <= 100) {
        	el("buyerBtnTickSpeed").style.display = "none"
        	el("toggleBtnTickSpeed").style.display = "inline-block"
        	maxedAutobuy++;
	}

	if (player.autobuyers[11].interval <= 100) {
        	el("buyerBtnInf").style.display = "none"
        	maxedAutobuy++
    	}

    	if (canBreakInfinity()) {
        	el("postinftable").style.display = "inline-block"
        	el("breaktable").style.display = "inline-block"
        	el("abletobreak").style.display = "none"
		el("break").style.display = "inline-block"
	} else {
        	el("postinftable").style.display = "none"
        	el("breaktable").style.display = "none"
		el("abletobreak").textContent = "You need to " + (aarMod.ngexV ? "complete all Normal Challenges" : "get Automated Big Crunch interval to 0.1") + " to be able to break infinity"
		el("abletobreak").style.display = "block"
		el("break").style.display = "none"
		el("break").textContent = "BREAK INFINITY"
    	}

    	if (player.autoSacrifice.interval <= 100) {
        	el("buyerBtnSac").style.display = "none"
        	if (inNGM(2)) maxedAutobuy++;
    	}
    	if (inNGM(2)) if (player.autobuyers[12].interval <= 100) {
        	el("buyerBtnGalSac").style.display = "none"
        	maxedAutobuy++;
    	}
    	if (inNGM(3)) if (player.autobuyers[13].interval <= 100) {
        	el("buyerBtnTickspeedBoost").style.display = "none"
        	maxedAutobuy++;
    	}
    	if (inNGM(4)) if (player.autobuyers[14].interval <= 100) {
        	el("buyerBtnTDBoost").style.display = "none"
        	maxedAutobuy++;
    	}

    	el("buyerBtnTickSpeed").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[8].cost + currencyEnd
	el("buyerBtnDimBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[9].cost + currencyEnd
    	el("buyerBtnGalaxies").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[10].cost + currencyEnd
    	el("buyerBtnInf").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[11].cost + " IP"
    	el("buyerBtnSac").innerHTML = "40% smaller interval <br>Cost: " + player.autoSacrifice.cost + currencyEnd
    	if (player.autobuyers[9].interval <= 100) {
        	el("buyerBtnDimBoost").style.display = "none"
        	maxedAutobuy++;
	}
    	if (player.autobuyers[10].interval <= 100) {
        	el("buyerBtnGalaxies").style.display = "none"
        	maxedAutobuy++;
    	}
    	if (inNGM(2)) el("buyerBtnGalSac").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[12].cost + currencyEnd
	if (inNGM(3)) el("buyerBtnTickspeedBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[13].cost + currencyEnd
	if (inNGM(4)) el("buyerBtnTDBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[14].cost + currencyEnd

	if (maxedAutobuy >= 9) giveAchievement("Age of Automation");
    	if (maxedAutobuy >= getTotalNormalChallenges() + 1) giveAchievement("Definitely not worth it");
    	if (e100autobuy >= 8) giveAchievement("Professional bodybuilder");

    	for (var i=0; i<8; i++) {
        	if (player.autobuyers[i]%1 !== 0) el("autoBuyer"+(i+1)).style.display = "inline-block"
	}
    	if (player.autobuyers[8]%1 !== 0) el("autoBuyerTickSpeed").style.display = "inline-block"
    	if (player.autobuyers[9]%1 !== 0) el("autoBuyerDimBoost").style.display = "inline-block"
    	if (player.autobuyers[10]%1 !== 0) el("autoBuyerGalaxies").style.display = "inline-block"
    	if (player.autobuyers[11]%1 !== 0) el("autoBuyerInf").style.display = "inline-block"
    	if (player.autoSacrifice%1 !== 0) el("autoBuyerSac").style.display = "inline-block"

    	for (var i=1; i<=12; i++) {
        	player.autobuyers[i-1].isOn = el(i + "ison").checked;
    	}

    	player.autoSacrifice.isOn = el("13ison").checked
    	if (inNGM(2)) {
        	if (player.autobuyers[12]%1 !== 0) el("autoBuyerGalSac").style.display = "inline-block"
        	player.autobuyers[12].isOn = el("14ison").checked
    	}
    	if (inNGM(3)) {
        	if (player.autobuyers[13]%1 !== 0) el("autoBuyerTickspeedBoost").style.display = "inline-block"
        	player.autobuyers[13].isOn = el("15ison").checked
    	}
    	if (inNGM(4)) {
        	if (player.autobuyers[14]%1 !== 0) el("autoTDBoost").style.display = "inline-block"
        	player.autobuyers[14].isOn = el("16ison").checked
    	}
    	player.eternityBuyer.isOn = el("eternityison").checked
    	if (tmp.ngp3) {
			player.eternityBuyer.dilationMode = el("dilatedeternityison").checked
			player.eternityBuyer.dilationPerAmount = Math.max(parseInt(el("prioritydil").value),2)
			player.eternityBuyer.statBeforeDilation = Math.min(player.eternityBuyer.statBeforeDilation, player.eternityBuyer.dilationPerAmount)
			if (player.eternityBuyer.isOn&&player.eternityBuyer.dilationMode&&player.eternityBuyer.statBeforeDilation<=0) {
				startDilatedEternity(true)
				return
			}
			if (quSave && quSave.autobuyer) quSave.autobuyer.enabled = el("quantumison").checked
		}
    	priorityOrder()
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
		player.autobuyers[13].bulk = (isNaN(player.autobuyers[13].bulk)) ? 1 : player.autobuyers[13].bulk
	}
	if (player.autobuyers[14]!=undefined) {
		player.autobuyers[14].priority = parseInt(el("priority16").value)
		player.autobuyers[14].overXGals = parseInt(el("overGalaxiesTDBoost").value)
	}
	player.autobuyers[10].bulk = parseFloat(el("bulkgalaxy").value)
	const eterValue = fromValue(el("priority13").value)
	if (!isNaN(break_infinity_js ? eterValue : eterValue.l)) player.eternityBuyer.limit = eterValue
	if (tmp.ngp3) {
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
	if (tmp.ngp3) {
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
	if (tmp.ngp3) quSave.autobuyer.enabled = !bool
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
		el("hotkeys").textContent = "Enable hotkeys"
	} else {
		player.options.hotkeys = true
		el("hotkeys").textContent = "Disable hotkeys"
	}
}

function updateHotkeys() {
	let html = "Hotkeys: 1-8 for buy 10 dimension, shift+1-8 for buy 1 dimension, T to buy max tickspeed, shift+T to buy one tickspeed, M for max all,<br>S for sacrifice"
	if (!hasAch("r136")) html += ", D for dimension boost"
	if (!hasAch("ng3p51")) {
		if (inNGM(3)) html += ", B for tickspeed boost"
		if (inNGM(4)) html += ", N for time dimension boost"
		html += ", G for galaxy"
	}
	html += ", C for crunch, A for toggle autobuyers, R for replicanti galaxies, E for eternity"
	if (hasAch("r136")) html += ", D to dilate time"
	if (hasAch("ngpp11")) html += ", shift+D to Meta-Dimension Boost"
	if (player.meta) html += ", Q for quantum"
	if (hasAch("ng3p45")) html += ", U for unstabilize all quarks"
	if (hasAch("ng3p51")) html += ", B for Big Rip, F to fundament"
	html += "."
	if (player.boughtDims) html += "<br>You can hold shift while buying time studies to buy all up until that point, see each study's number, and save study trees."
	html += "<br>Hotkeys do not work while holding control."
	el("hotkeysDesc").innerHTML = html
}


var bestECTime
function updateEterChallengeTimes() {
	bestECTime=0
	var temp=0
	var tempcounter=0
	for (var i=1;i<15;i++) {
		setAndMaybeShow("eterchallengetime"+i,aarMod.eternityChallRecords[i],'"Eternity Challenge '+i+' time record: "+timeDisplayShort(aarMod.eternityChallRecords['+i+'], false, 3)')
		if (aarMod.eternityChallRecords[i]) {
			bestECTime=Math.max(bestECTime, aarMod.eternityChallRecords[i])
			temp+=aarMod.eternityChallRecords[i]
			tempcounter++
		}
	}
	setAndMaybeShow("eterchallengetimesum",tempcounter>1,'"Sum of completed eternity challenge time records is "+timeDisplayShort('+temp+', false, 3)')
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
			tempTime = tempTime.plus(player.lastTenEternities[i][0])
			tempEP = tempEP.plus(player.lastTenEternities[i][1])
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
}

function addTime(array) {
	for (var i=player.lastTenRuns.length-1; i>0; i--) {
		player.lastTenRuns[i] = player.lastTenRuns[i-1]
	}
	player.lastTenRuns[0] = array
}

function doDefaultTickspeedReduction(){
	if (hasAch("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r66")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r83")) player.tickspeed = player.tickspeed.times(E_pow(0.95, player.galaxies));
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
		if (tmp.ngp3 ? quSave.autoEC && player.eternityChalls[player.currentEternityChall] < 5 : false) {
			if (player.etercreq > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.etercreq]
			else player.timestudy.theorem += ([0,30,35,40,70,130,85,115,115,415,550,1,1])[player.etercreq]
			player.eternityChallUnlocked = 0
			quSave.autoECN = player.etercreq
		} else if (ghostified && ghSave.milestones > 1) {
			if (player.etercreq > 12) player.timestudy.theorem += masteryStudies.costs.ec[player.etercreq]
			else player.timestudy.theorem += ([0, 30, 35, 40, 70, 130, 85, 115, 115, 415, 550, 1, 1])[player.etercreq]
			player.eternityChallUnlocked = 0
		} else forceRespec = true
		player.etercreq = 0
	} else if (tmp.ngp3) delete quSave.autoECN
	return forceRespec
}

function canEternity() {
	var eter25 = getEternitied() >= 25
	var id7unlocked = player.infDimensionsUnlocked[7]
	if (eter25) id7unlocked = true
	if (tmp.ngp3 && brSave.active) id7unlocked = true

	return player.infinityPoints.gte(player.eternityChallGoal || Number.MAX_VALUE) && id7unlocked
}

function eternity(force, auto, dil, presetLoad) {
	if (!force && !canEternity()) return
	if (!auto && !dil && player.options.eternityconfirm && !confirm("Eternity will reset everything except achievements and challenge records. You will also gain an Eternity point and unlock various upgrades.")) return

	var oldEter = getEternitied()
	var oldEP = player.eternityPoints
	if (!force) {
		//Infinities / Eternities
		player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())
		player.eternities = nA(player.eternities, gainEternitiedStat())
		updateMilestones()
		updateBankedEter()

		//Eternity 
		player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints())

		//Records
		if (player.thisEternity < player.bestEternity && !force) player.bestEternity = player.thisEternity
		temp = []
		var array = [player.thisEternity, gainedEternityPoints()]
		if (player.dilation.active) array = [player.thisEternity, getDilGain().sub(player.dilation.totalTachyonParticles).max(0), "d2"]
		else if (player.currentEternityChall != "") array.push(player.eternityChallUnlocked)
		else if (tmp.be) {
			beSave.eternalMatter = beSave.eternalMatter.add(getEMGain())
			if (ghSave.milestones < 15) beSave.eternalMatter = beSave.eternalMatter.round()
			array = [player.thisEternity, getEMGain(), "b"]
			updateBreakEternity()
		}
		addEternityTime(array)
		updateLastTenEternities
	}

	//Challenges
	var forceRespec = doCheckECCompletionStuff()
	player.currentEternityChall = ""
	player.eternityChallGoal = E(Number.MAX_VALUE)
	if (player.currentEternityChall !== "" && player.infinityPoints.lt(player.eternityChallGoal)) return false
	if (player.currentEternityChall == "eterc6" && ECComps("eterc6") < 5 && player.dimensionMultDecrease < 4) player.dimensionMultDecrease = Math.max(parseFloat((player.dimensionMultDecrease - 0.2).toFixed(1)),2)
	if (!GUBought("gb4")) if ((player.currentEternityChall == "eterc11" || (player.currentEternityChall == "eterc12" && ghostified)) && ECComps("eterc11") < 5) player.tickSpeedMultDecrease = Math.max(parseFloat((player.tickSpeedMultDecrease - 0.07).toFixed(2)), 1.65)
	updateEternityChallenges()

	//Dilation
	if (player.dilation.active && (!force || player.infinityPoints.gte(Number.MAX_VALUE))) {
		let gain = getDilGain()
		if (gain.gte(player.dilation.totalTachyonParticles)) {
			if (player.dilation.totalTachyonParticles.gt(0) && gain.div(player.dilation.totalTachyonParticles).lt(2)) player.eternityBuyer.slowStopped = true
			if (tmp.ngp3) player.dilation.times = (player.dilation.times || 0) + 1
			player.dilation.totalTachyonParticles = gain
			setTachyonParticles(gain)
		}
	}
	if (!player.dilation.studies.includes(1)) dil = false
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
	if (player.infinitied < 10 && !force && !player.boughtDims) giveAchievement("Do you really need a guide for this?");
	if (Decimal.round(player.replicanti.amount) == 9) giveAchievement("We could afford 9");
	if (player.dimlife && !force) giveAchievement("8 nobody got time for that")
	if (player.dead && !force) giveAchievement("You're already dead.")
	if (player.infinitied <= 1 && !force) giveAchievement("Do I really need to infinity")
	if (gainedEternityPoints().gte("1e600") && player.thisEternity <= 600 && player.dilation.active && !force) giveAchievement("Now you're thinking with dilation!")
	if (gainedEternityPoints().gte(player.eternityPoints) && player.eternityPoints.gte("1e1185") && (tmp.ngp3 ? player.dilation.active && brSave.active : false)) giveAchievement("Gonna go fast")

	//Presets
	if (player.respec || player.respecMastery || forceRespec) respecTimeStudies(forceRespec, presetLoad)
	if (typeof(presetLoad) == "string") importStudyTree(presetLoad)
	if (player.respec) respecToggle()
	if (player.respecMastery) respecMasteryToggle()

	player.dilation.active = dil
	doReset("eter")

	if (player.eternities == 1 && !quantumed) {
		showTab("dimensions")
		showDimTab("timedimensions")
		loadAutoBuyerSettings()
	}

	if (tmp.ngp3) {
		if (player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 1e9) player.dbPower = E(1)
		if (quantumed) updateColorCharge()
		updateBreakEternity()
	}
	doAutoEterTick()
}

function challengesCompletedOnEternity(bigRip) {
	var array = []
	if (getEternitied() > 1 || bigRip || hasAch("ng3p51")) for (i = 1; i < (inNGM(2) ? 15 : 13); i++) array.push("challenge" + i)
	if (hasAch("r133")) for (i = 0; i < order.length; i++) array.push(order[i])
	return array
}

function gainEternitiedStat() {
	let ret = 1
	if (ghostified) {
		ret = Math.pow(10, 2 / (Math.log10(getEternitied() + 1) / 10 + 1))
		if (hasNU(9)) ret = nM(ret, brSave.spaceShards.max(1).pow(.1))
	}
	if (quantumed && player.eternities < 1e5) ret = Math.max(ret, 20)
	let exp = getEternitiesAndDTBoostExp()
	if (exp > 0) ret = nM(player.dilation.dilatedTime.max(1).pow(exp), ret)
	if (typeof(ret) == "number") ret = Math.floor(ret)
	return ret
}

function gainBankedInf() {
	let ret = 0 
	let numerator = player.infinitied
	if (speedrunMilestonesReached > 27 || hasAch("ng3p73")) numerator = nA(getInfinitiedGain(), player.infinitied)
	let frac = 0.05
	if (player.timestudy.studies.includes(191)) ret = nM(numerator, frac)
	if (hasAch("r131")) ret = nA(nM(numerator, frac), ret)
	if (player.exdilation != undefined) ret = nM(ret, getBlackholePowerEffect().pow(1/3))
	return ret
}

function exitChallenge() {
	if (inNGM(4) && player.galacticSacrifice.chall) {
		galacticSacrifice(false, true)
		showTab("dimensions")
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
	if (tmp.ngp3) if (!inQC(0)) quantum(false, true, 0)
}

function onChallengeFail() {
	el("challfail").style.display = "block"
	giveAchievement("You're a mistake")
	failureCount++
	if (failureCount > 9) giveAchievement("You're a failure")
}

function unlockEChall(idx) {
	if (player.eternityChallUnlocked == 0) {
		player.eternityChallUnlocked = idx
		el("eterc"+player.eternityChallUnlocked+"div").style.display = "inline-block"
		if (!justImported) showTab("challenges")
		if (!justImported) showChallengesTab("eternitychallenges")
		if (idx !== 13 && idx !== 14) {
			updateTimeStudyButtons(true)
			player.etercreq = idx
		}
		if (tmp.ngp3) delete quSave.autoECN
	}
	updateEternityChallenges()
}

function ECComps(name) {
	return player.eternityChalls[name] || 0
}

function canUnlockEC(idx, cost, study, study2) {
	study2 = (study2 !== undefined) ? study2 : 0;
	if (player.eternityChallUnlocked !== 0) return false
	if (!player.timestudy.studies.includes(study) && (player.study2 == 0 || !player.timestudy.studies.includes(study2))) return false
	if (player.timestudy.theorem < cost) return false
	if (player.etercreq == idx && idx !== 11 && idx !== 12) return true

	var ec1Mult = aarMod.newGameExpVersion ? 1e3 : 2e4
	switch(idx) {
		case 1:
			if (getEternitied() >= (ECComps("eterc1") ? ECComps("eterc1") + 1 : 1) * ec1Mult) return true
			break;

		case 2:
			if (player.totalTickGained >= 1300 + (ECComps("eterc2") * 150)) return true
			break;

		case 3:
			if (player.eightAmount.gte(17300 + (ECComps("eterc3") * 1250))) return true
			break;

		case 4:
			if (1e8 + (ECComps("eterc4") * 5e7) <= getInfinitied()) return true
			break;

		case 5:
			if (160 + (ECComps("eterc5") * 14) <= player.galaxies) return true
			break;

		case 6:
			if (40 + (ECComps("eterc6") * 5) <= player.replicanti.galaxies) return true
			break;

		case 7:
			if (player.money.gte(E("1e500000").times(E("1e300000").pow(ECComps("eterc7"))))) return true
			break;

		case 8:
			if (player.infinityPoints.gte(E("1e4000").times(E("1e1000").pow(ECComps("eterc8"))))) return true
			break;

		case 9:
			if (player.infinityPower.gte(E("1e17500").times(E("1e2000").pow(ECComps("eterc9"))))) return true
			break;

		case 10:
			if (player.eternityPoints.gte(E("1e100").times(E("1e20").pow(ECComps("eterc10"))))) return true
			break;

		case 11:
			if (player.timestudy.studies.includes(71) && !player.timestudy.studies.includes(72) && !player.timestudy.studies.includes(73)) return true
			break;

		case 12:
			if (player.timestudy.studies.includes(73) && !player.timestudy.studies.includes(71) && !player.timestudy.studies.includes(72)) return true
			break;
	}
	return false
}

function canUnlockECFromNum(n){
	if (n == 1) return canUnlockEC(1, 30, 171)
	if (n == 2) return canUnlockEC(2, 35, 171)
	if (n == 3) return canUnlockEC(3, 40, 171)
	if (n == 4) return canUnlockEC(4, 70, 143)
	if (n == 5) return canUnlockEC(5, 130, 42)
	if (n == 6) return canUnlockEC(6, 85, 121)
	if (n == 7) return canUnlockEC(7, 115, 111)
	if (n == 8) return canUnlockEC(8, 115, 123)
	if (n == 9) return canUnlockEC(9, 415, 151)
	if (n == 10) return canUnlockEC(10, 550, 181)
	if (n == 11) return canUnlockEC(11, 1, 231, 232)
	if (n == 12) return canUnlockEC(12, 1, 233, 234)
	return false
}

function updateECUnlockButtons() {
	for (let ecnum = 1; ecnum <= 12; ecnum ++){
		let s = "ec" + ecnum + "unl"
		if (canUnlockECFromNum(ecnum)) el(s).className = "eternitychallengestudy"
		else el(s).className = "eternitychallengestudylocked"
	}
	if (player.eternityChallUnlocked !== 0) el("ec" + player.eternityChallUnlocked + "unl").className = "eternitychallengestudybought"
}

var ECCosts = [null, 
		30,  35,  40,
		70,  130, 85,
		115, 115, 415,
		550, 1,   1]

for (let ecnum = 1; ecnum <= 12; ecnum ++){
	el("ec" + ecnum + "unl").onclick = function(){
		if (canUnlockECFromNum(ecnum)) {
			unlockEChall(ecnum)
			player.timestudy.theorem -= ECCosts[ecnum]
			drawStudyTree()
		}
	}
}

function getEC12TimeLimit() {
	//In the multiple of 0.1 seconds
	let r = 10 - 2 * ECComps("eterc12")
	if (tmp.ngex) r *= 3.75
	return Math.max(r , 1)
}

var ecExpData = {
	inits: {
		eterc1: 1800,
		eterc2: 975,
		eterc3: 600,
		eterc4: 2750,
		eterc5: 750,
		eterc6: 850,
		eterc7: 2000,
		eterc8: 1300,
		eterc9: 1750,
		eterc10: 3000,
		eterc11: 500,
		eterc12: 110000,
		eterc13: 38500000,
		eterc14: 1595000,
		eterc1_ngmm: 1800,
		eterc2_ngmm: 1125,
		eterc3_ngmm: 1025,
		eterc4_ngmm: 2575,
		eterc5_ngmm: 600,
		eterc6_ngmm: 850,
		eterc7_ngmm: 1450,
		eterc8_ngmm: 2100,
		eterc9_ngmm: 2250,
		eterc10_ngmm: 2205,
		eterc11_ngmm: 35000,
		eterc12_ngmm: 17000,
		eterc13_legacy: 38000000,
	},
	increases: {
		eterc1: 200,
		eterc2: 175,
		eterc3: 75,
		eterc4: 550,
		eterc5: 400,
		eterc6: 250,
		eterc7: 530,
		eterc8: 900,
		eterc9: 250,
		eterc10: 300,
		eterc11: 200,
		eterc12: 12000,
		eterc13: 1000000,
		eterc14: 800000,
		eterc1_ngmm: 400,
		eterc2_ngmm: 250,
		eterc3_ngmm: 100,
		eterc4_ngmm: 525,
		eterc5_ngmm: 300,
		eterc6_ngmm: 225,
		eterc8_ngmm: 500,
		eterc9_ngmm: 300,
		eterc10_ngmm: 175,
		eterc11_ngmm: 3250,
		eterc12_ngmm: 1500,
		eterc13_legacy: 1200000,
		eterc14_legacy: 250000
	}
}
function getECGoal(x) {
	let expInit = ecExpData.inits[x]
	let expIncrease = ecExpData.increases[x]
	let completions = ECComps(x)
	if (inNGM(2)) {
		expInit = ecExpData.inits[x + "_ngmm"] || expInit
		expIncrease = ecExpData.increases[x + "_ngmm"] || expIncrease
	}
	if (tmp.ngp3l) {
		expInit = ecExpData.inits[x + "_legacy"] || expInit
		expIncrease = ecExpData.increases[x + "_legacy"] || expIncrease
	}
	let exp = expInit + expIncrease * completions
	if (x == "ec13") exp += 600000 * Math.max(completions - 2, 0) * (completions - 3, 0)
	return pow10(exp)
}

function getECReward(x) {
	let m2 = inNGM(2)
	let c=ECComps("eterc" + x)
	if (x == 1) return Math.pow(Math.max(player.thisEternity * 10, 1), (0.3 + c * 0.05) * (m2 ? 5 : 1))
	if (x == 2) {
		let r = player.infinityPower.pow((m2 ? 4.5 : 1.5) / (700 - c * 100)).add(1)
		if (m2) r = E_pow(player.infinityPower.add(10).log10(), 1000).times(r)
		else r = r.min(1e100)
		return r.max(1)
	}
	if (x == 3) return c * 0.8
	if (x == 4) return player.infinityPoints.max(1).pow((m2 ? .4 : 0.003) + c * (m2 ? .2 : 0.002)).min(m2 ? 1/0 : 1e200)
	if (x == 5) return c * 5
	if (x == 8) {
		let x = Math.log10(player.infinityPower.plus(1).log10() + 1)
		if (x > 0) x=Math.pow(x, (m2 ? 0.05 : 0.03) * c)
		return Math.max(x, 1)
	}
	if (x == 9) {
		let r=player.timeShards
		if (r.gt(0)) r = r.pow(c / (m2 ? 2 : 10))
		if (m2) return r.plus(1).min("1e10000")
		if (!aarMod.newGameExpVersion) return r.plus(1).min("1e400")
		if (r.lt("1e400")) return r.plus(1)
		let log = Math.sqrt(r.log10() * 400)
		return pow10(Math.min(50000, log))	
	}
	if (x == 10) return E_pow(getInfinitied(), m2 ? 2 : .9).times(c * (m2 ? 0.02 : 0.000002)).add(1).pow(player.timestudy.studies.includes(31) ? 4 : 1)
	if (x == 12) return 1 - c * (m2 ? .06 : 0.008)
	if (x == 13) {
		var data={
			main:[0, 0.25, 0.5, 0.7, 0.85, 1],
			legacy:[0, 0.2, 0.4, 0.6, 0.8, 1]
		}
		var dataUsed = data[tmp.ngp3l ? "legacy" : "main"]
		return dataUsed[c]
	}
	if (x == 14) return getIC3EffFromFreeUpgs()
}

function startEternityChallenge(n) {
	if (player.currentEternityChall == "eterc"+n || parseInt(n) != player.eternityChallUnlocked) return
	if (player.options.challConf) if (!confirm("You will start over with just your time studies, eternity upgrades and achievements. You need to reach a set IP goal with special conditions.")) return
	if (ghostified && name == "eterc10") ghSave.under = false

	//Eternities (to add)
	var oldStat = getEternitied()
	player.eternities = nA(player.eternities, gainEternitiedStat())
	updateBankedEter()

	player.eternityChallGoal = getECGoal("eterc" + n)
	player.currentEternityChall =  "eterc" + n	
	doReset("eter")
}

function getEC12Slowdown() {
	return 1e3
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
	if (tmp.ngp3 && player.masterystudies.includes("d14") && inQC(0) && quSave.electrons.amount >= 62500) {
		if (ghSave.milestones >= 2) x = true
		else for (var p = 1; p < 5; p++) {
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

function crunchAnimationBtn(){
	if (player.infinitied !== 0 || getEternitied() !== 0 || quantumed) el("bigCrunchAnimBtn").style.display = "inline-block"
	else el("bigCrunchAnimBtn").style.display = "none"
}

function TPAnimationBtn(){
	if (!player.dilation.tachyonParticles.eq(0) || quantumed) el("tachyonParticleAnimBtn").style.display = "inline-block"
	else el("tachyonParticleAnimBtn").style.display = "none"
}

function idAutoTick() {
	if (getEternitied() > 10 && player.currentEternityChall !== "eterc8") {
		for (var i=1;i<getEternitied()-9 && i < 9; i++) {
			if (player.infDimBuyers[i-1]) {
				buyMaxInfDims(i, true)
				buyManyInfinityDimension(i, true)
			}
		}
	}
}

function replicantiAutoTick() {
	if (getEternitied() >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8" && isChanceAffordable()) {
		var chance = Math.round(player.replicanti.chance * 100)
		var maxCost = (tmp.ngp3 ? player.masterystudies.includes("t265") : false) ? 1 / 0 : E("1e1620").div(inOnlyNGM(2) ? 1e60 : 1);
		var bought = Math.max(Math.floor(player.infinityPoints.min(maxCost).div(player.replicanti.chanceCost).log(1e15) + 1), 0)
		if (!tmp.ngp3 || !player.masterystudies.includes("t265")) bought = Math.min(bought, 100 - chance)
		player.replicanti.chance = (chance + bought) / 100
		player.replicanti.chanceCost = player.replicanti.chanceCost.times(E_pow(1e15, bought))
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
	el('epmultauto').style.display=hasAch("ngpp17")?"":"none"
	for (i=1;i<9;i++) el("td"+i+'auto').style.visibility=hasAch("ngpp17")?"visible":"hidden"
	el('togglealltimedims').style.visibility=hasAch("ngpp17")?"visible":"hidden"
}

function updateNGpp16Reward(){
	el('replicantibulkmodetoggle').style.display=hasAch("ngpp16")?"inline-block":"none"
}

function notifyQuantumMilestones(){
	if (typeof notifyId == "undefined") notifyId = 24
	if (speedrunMilestonesReached > notifyId) {
		$.notify("You have unlocked the "+timeDisplayShort(speedrunMilestones[notifyId + 1]*10)+" speedrun milestone! "+(["You now start with 20,000 eternities when going Quantum","You unlocked the Time Theorem autobuyer","You now start with all Eternity Challenges completed and\nEternity Upgrades bought","You now start with Dilation unlocked","You unlocked the Dilation option for the Eternity autobuyer","You now start with all dilation studies and\nnon-rebuyable dilation upgrades before Meta Dimensions unlocked, except the passive TT gen upgrade","You unlocked the First Meta Dimension autobuyer","You unlocked the Second Meta Dimension autobuyer","You unlocked the Third Meta Dimension autobuyer","You unlocked the Fourth Meta Dimension autobuyer","You unlocked the Fifth Meta Dimension autobuyer, and you now keep Time Studies and the passive TT gen upgrade","You unlocked the Sixth Meta Dimension autobuyer","You unlocked the Seventh Meta Dimension autobuyer","You unlocked Eighth Meta Dimension autobuyer, and\nall non-rebuyable dilation upgrades","You unlocked the Meta-Dimension Boost autobuyer","You now keep your Mastery Studies","All Meta Dimensions are instantly available for purchase on Quantum","You now start with "+shortenCosts(1e13)+" eternities","You now start with "+shortenCosts(1e25)+" meta-antimatter on reset","You can now turn on automatic replicated galaxies regardless of your second Time Study split path","Rebuyable Dilation upgrade and Meta Dimension autobuyers are 3x faster","You now start with "+shortenCosts(1e100)+" dilated time on Quantum, and dilated time only resets on Quantum","You unlocked the Quantum autobuyer","You now keep your Replicanti on Eternity","You unlocked the manual mode for the Eternity autobuyer and got the sacrifice galaxy autobuyer","Your rebuyable dilation upgrade autobuyer can now buy the maximum upgrades possible","You now can buy max Meta-Dimension Boosts and start with 4 Meta-Dimension Boosts","From now on, you can gain banked infinities based on your post-crunch infinitied stat"])[notifyId]+".","success")
		notifyId++
	}
}

function notifyGhostifyMilestones(){
	if (typeof notifyId2 == "undefined") notifyId2 = 16
	if (notifyId2 <= 0) notifyId2 = 0
	if (ghSave.milestones > notifyId2) {
		$.notify("You became a ghost in at most "+getFullExpansion(tmp.bm[notifyId2])+" quantumed stat! "+(["You now start with all Speedrun Milestones and all "+shorten(Number.MAX_VALUE)+" QK assignation features unlocked, all Paired Challenges completed, all Big Rip upgrades bought, Nanofield is 2x faster until you reach 16 rewards, and you get quarks based on your best MA this quantum", "From now on, colored quarks do not cancel, you keep your gluon upgrades, you can quick Big Rip, and completing an Eternity Challenge doesn't respec your Time Studies.", "You now keep your Electron upgrades", "From now on, Quantum doesn't reset your Tachyon particles unless you are in a QC, unstabilizing quarks doesn't lose your colored quarks, and you start with 5 of 1st upgrades of each Tree Branch", "From now on, Quantum doesn't reset your Meta-Dimension Boosts unless you are in a QC or undoing Big Rip", "From now on, Quantum doesn't reset your normal duplicants unless you are in a QC or undoing Big Rip", "You now start with 10 worker duplicants and Ghostify now doesn't reset Neutrinos.", "You are now gaining ^0.5 amount of quarks, ^0.5 amount of gluons, and 1% of Space Shards gained on Quantum per second.", "You now start with 10 Emperor Dimensions of each tier up to the second tier"+(aarMod.ngudpV?", and from now on, start Big Rips with the 3rd row of Eternity Upgrades":""), "You now start with 10 Emperor Dimensions of each tier up to the fourth tier", "You now start with 10 Emperor Dimensions of each tier up to the sixth tier, and the IP multiplier no longer costs IP", "You now start with 10 of each Emperor Dimension", "You now start with 16 Nanorewards", "You now start with "+shortenCosts(1e25)+" quark spins, and Branches are faster based on your spins", "You now start with Break Eternity unlocked and all Break Eternity upgrades bought and generate 1% of Eternal Matter gained on Eternity per second", "From now on, you gain 1% of quarks you will gain per second and you keep your Tachyon particles on Quantum and Ghostify outside of Big Rip."])[notifyId2]+".","success")
		notifyId2++
	}
}

function dilationStuffABTick(){
	var canAutoUpgs = canAutoDilUpgs()
	el('dilUpgsauto').style.display = canAutoUpgs ? "" : "none"
	el('distribEx').style.display = hasAch("ngud14") && aarMod.nguspV !== undefined ? "" : "none"
	if (canAutoUpgs && player.autoEterOptions.dilUpgs) autoBuyDilUpgs()

	el("dilationTabbtn").style.display = (player.dilation.studies.includes(1)) ? "table-cell" : "none"
	el("blackHoleTabbtn").style.display = player.dilation.studies.includes(1) && player.exdilation != undefined ? "table-cell" : "none"
	updateDilationUpgradeButtons()
}

function doBosonsUnlockStuff() {
	player.ghostify.wzb.unl=true
	ngp3_feature_notify("bl")
	giveAchievement("Even Ghostlier than before")

	updateTemp()
	updateNeutrinoBoosts()
	updateBLUnlocks()
	updateBosonicLimits()
}

function doPhotonsUnlockStuff(){
	player.ghostify.ghostlyPhotons.unl=true
	ngp3_feature_notify("ph")
	giveAchievement("Progressing as a Ghost")
	
	updateTemp()
	updateBreakEternity()
	updateGPHUnlocks()
}

function updateOrderGoals(){
	if (order) for (var i=0; i<order.length; i++) el(order[i]+"goal").textContent = "Goal: "+shortenCosts(getGoal(order[i]))
}

let autoSaveSeconds=0
function updatePerSecond() {
	updateTemp()
	runAutoSave()
	if (!player) return

	//Achieve:
	cantHoldInfinitiesCheck()
	antitablesHaveTurnedCheck()
	updateBlinkOfAnEye()
	ALLACHIEVECHECK()
	bendTimeCheck()
	metaAchMultLabelUpdate()

	// AB Stuff
	ABTypeDisplay()
	dimboostABTypeDisplay()
	IDABDisplayCorrection()
	replicantiAutoDisplay()
	replicantiAutoTick()
	idAutoTick()
	doAutoEterTick()
	dilationStuffABTick()
	updateNGpp17Reward()
	updateNGpp16Reward()

	// Button Displays
	infPoints2Display()
	eterPoints2Display()
	updateResetTierButtons()
	updateQuarkDisplay()
	primaryStatsDisplayResetLayers()
	crunchAnimationBtn()
	TPAnimationBtn()

	// EC Stuff
	ECCompletionsDisplay()
	ECchallengePortionDisplay()
	updateECUnlockButtons()
	EC8PurchasesDisplay()
 	failedEC12Check()

	// Other 
	updateHeaders()
	updateOrderGoals()
	bankedInfinityDisplay()
	doPerSecondNGP3Stuff()
	notifyQuantumMilestones()
	updateQuantumWorth()
	updateNGM2RewardDisplay()
	updateGalaxyUpgradesDisplay()
	updateTimeStudyButtons(false, true)
	updateHotkeys()
	updateQCDisplaysSpecifics()

	//Rounding errors
	if (!tmp.ngp3 || !quantumed) if (player.infinityPoints.lt(100)) player.infinityPoints = player.infinityPoints.round()
	checkGluonRounding()
}

var postC2Count = 0;
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
	var newPoints = oldPoints.plus(gainedPoints)
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
		if (tmp.ngp3) player.peakSpent = 0
	} else if (tmp.ngp3 && currentEPmin.gt(0)) {
		player.peakSpent = diff + (player.peakSpent ? player.peakSpent : 0)
	}
	return currentEPmin;
}

function checkMatter(diff){
	var newMatter = player.matter.times(E_pow(tmp.mv,diff))
	player.matter = newMatter
	if (player.matter.pow(20).gt(player.money) && (player.currentChallenge == "postc7" || (inQC(6) && !hasAch("ng3p34")))) {
		if (tmp.ngp3 ? brSave.active && tmp.ri : false) {}
		else if (inQC(6)) {
			quantum(false, true, 0)
			onChallengeFail()
		} else quickReset()
	} else if (player.matter.gt(player.money) && (inNC(12) || player.currentChallenge == "postc1") && !haveET) {
		quickReset()
	}
}

function passiveIPupdating(diff){
	if (player.infinityUpgrades.includes("passiveGen")) player.partInfinityPoint += diff / player.bestInfinityTime * 10
	else player.partInfinityPoint = 0
	if (player.bestInfinityTime == 9999999999) player.partInfinityPoint = 0
	let x = Math.floor(player.partInfinityPoint / 10)
	player.partInfinityPoint -= x * 10
	player.infinityPoints = player.infinityPoints.plus(getIPMult().times(x));
}

function passiveInfinitiesUpdating(diff){
	if (typeof(player.infinitied) != "number") return 
	if (player.infinityUpgrades.includes("infinitiedGeneration") && player.currentEternityChall !== "eterc4") player.partInfinitied += diff / player.bestInfinityTime;
	if (player.partInfinitied >= 1/2) {
		let x = Math.floor(player.partInfinitied*2)
		player.partInfinitied -= x/2
		player.infinitied += x;
	}
}

function incrementTimesUpdating(diffStat){
	player.totalTimePlayed += diffStat
	if (tmp.ngp3) ghSave.time += diffStat
	if (player.meta) quSave.time += diffStat
	if (player.currentEternityChall == "eterc12") diffStat /= 1e3
	player.thisEternity += diffStat
   	player.thisInfinityTime += diffStat
	if (inNGM(2)) player.galacticSacrifice.time += diffStat
	failsafeDilateTime = false
}

function requiredInfinityUpdating(diff){
	if (tmp.ri) return

	for (let tier = (inQC(1) ? 1 : player.currentEternityChall == "eterc3" ? 3 : (inNC(4) || player.currentChallenge == "postc1") ? 5 : 7) - (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4) ? 1 : 0); tier >= 1; --tier) {
		var name = TIER_NAMES[tier];
		player[name + 'Amount'] = player[name + 'Amount'].plus(getDimensionProductionPerSecond(tier + (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4) ? 2 : 1)).times(diff / 10));
	}
	if (player.masterystudies != undefined) if (player.firstAmount.gt(0)) player.dontWant = false
	var tempa = getDimensionProductionPerSecond(1).times(diff)
	player.money = player.money.plus(tempa)	
	player.totalmoney = player.totalmoney.plus(tempa)
	if (isInfiniteDetected()) return
	if (tmp.ngp3 && brSave.active) {
		brSave.totalAntimatter = brSave && brSave.totalAntimatter.add(tempa)
		brSave.bestThisRun = brSave && brSave.bestThisRun.max(player.money)
	}
	tmp.ri=player.money.gte(Number.MAX_VALUE) && ((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) || !onPostBreak())
}

function chall2PowerUpdating(diff){
	player.chall2Pow = Math.min(player.chall2Pow + diff / 1800, 1);
	if (player.currentChallenge == "postc2" || inQC(6)) {
		postC2Count++;
		if (postC2Count >= 8 || diff > 80) {
			sacrifice();
			postC2Count = 0;
		}
	}
}

function normalChallPowerUpdating(diff){
	if (player.currentChallenge == "postc8" || inQC(6)) player.postC8Mult = player.postC8Mult.times(Math.pow(0.000000046416, diff))

	if (inNC(3) || player.matter.gte(1)) player.chall3Pow = player.chall3Pow.times(E_pow(1.00038, diff)).min(1e200);

	chall2PowerUpdating(diff)
}

function dimensionButtonDisplayUpdating(){
	el("tdtabbtn").style.display = ((player.eternities > 0 || quantumed || inNGM(4)) && (!inQC(8) || tmp.be)) ? "" : "none"
	el("mdtabbtn").style.display = player.dilation.studies.includes(6) ? "" : "none"
}

function infinityTimeMetaBlackHoleDimUpdating(diff){
	var step = inQC(4) ? 2 : 1
	var stepT = inNC(7) && inNGM(4) ? 2 : step
	for (let tier = 1 ; tier < 9; tier++) {
		if (tier < 9 - step){
			player["infinityDimension"+tier].amount = player["infinityDimension"+tier].amount.plus(DimensionProduction(tier+step).times(diff / 10))
			if (player.meta) player.meta[tier].amount = player.meta[tier].amount.plus(getMetaDimensionProduction(tier+step).times(diff / 10))
		}
		if (tier < 9 - stepT) player["timeDimension"+tier].amount = player["timeDimension"+tier].amount.plus(getTimeDimensionProduction(tier+stepT).times(diff / 10))
		if (player.exdilation != undefined) if (isBHDimUnlocked(tier+step)) player["blackholeDimension"+tier].amount = player["blackholeDimension"+tier].amount.plus(getBlackholeDimensionProduction(tier+step).times(diff / 10))
	}
}

function dimensionPageTabsUpdating(){
	el("dimTabButtons").style.display = "none"
	if (player.infDimensionsUnlocked[0] || player.eternities !== 0 || quantumed || inNGM(4)) el("dimTabButtons").style.display = "inline-block"
}

function otherDimsUpdating(diff){
	if (player.currentEternityChall !== "eterc7") player.infinityPower = player.infinityPower.plus(DimensionProduction(1).times(diff))
   	else if (!inNC(4) && player.currentChallenge !== "postc1") player.seventhAmount = player.seventhAmount.plus(DimensionProduction(1).times(diff))

   	if (player.currentEternityChall == "eterc7") player.infinityDimension8.amount = player.infinityDimension8.amount.plus(getTimeDimensionProduction(1).times(diff))
   	else {
		if (ECComps("eterc7") > 0) player.infinityDimension8.amount = player.infinityDimension8.amount.plus(DimensionProduction(9).times(diff))
		player.timeShards = player.timeShards.plus(getTimeDimensionProduction(1).times(diff)).max(getTimeDimensionProduction(1).times(0))
	}
}

function ERFreeTickUpdating(){
	var oldT = player.totalTickGained
	player.totalTickGained = getTotalTickGained()
	player.tickThreshold = tickCost(player.totalTickGained+1)
	player.tickspeed = player.tickspeed.times(E_pow(tmp.tsReduce, player.totalTickGained - oldT))
}

function nonERFreeTickUpdating(){
	let thresholdMult = 1.33
	let easier = inOnlyNGM(2)
	if (easier) {
		thresholdMult = player.timestudy.studies.includes(171) ? 1.1 : 1.15
		if (inNGM(3)) thresholdMult = player.timestudy.studies.includes(171) ? 1.03 : 1.05
	} else if (player.timestudy.studies.includes(171)) {
		thresholdMult = 1.25
		if (aarMod.newGameMult) thresholdMult -= 0.08
	}
	if (QCIntensity(7)) thresholdMult *= tmp.qcRewards[7]
	if (ghostified && ghSave.neutrinos.boosts > 9) thresholdMult -= tmp.nb[10]
	if (thresholdMult < 1.1 && inNGM(2)) thresholdMult = 1 + 0.1 / (2.1 - thresholdMult)
	if (thresholdMult < 1.01 && inNGM(2)) thresholdMult = 1.005 + 0.005 / (2.01 - thresholdMult)

	let gain = Math.ceil(E(player.timeShards).dividedBy(player.tickThreshold).log10()/Math.log10(thresholdMult))
	player.totalTickGained += gain
	player.tickspeed = player.tickspeed.times(E_pow(tmp.tsReduce, gain))
	player.postC3Reward = E_pow(getPostC3Mult(), gain * getIC3EffFromFreeUpgs()).times(player.postC3Reward)
	var base = inNGM(4) ? 0.01 : (player.tickspeedBoosts ? .1 : 1)
	player.tickThreshold = E_pow(thresholdMult, player.totalTickGained).times(base)
	el("totaltickgained").textContent = "You've gained " + getFullExpansion(player.totalTickGained) + " tickspeed upgrades."
	tmp.tickUpdate = true
}

function bigCrunchButtonUpdating(){
	el("bigcrunch").style.display = 'none'
	el("postInfinityButton").style.display = 'none'
	if (tmp.ri) {
		el("bigcrunch").style.display = 'inline-block';
		if ((!inNC(0) && !player.options.retryChallenge) || (!player.break && player.bestInfinityTime < 600)) showTab('emptiness')
	} else if (player.break && player.currentChallenge == "") {
		if (player.money.gte(Number.MAX_VALUE)) {
			el("postInfinityButton").style.display = ""
			var currentIPmin = gainedInfinityPoints().dividedBy(player.thisInfinityTime/600)
			if (currentIPmin.gt(IPminpeak)) IPminpeak = currentIPmin
			if (IPminpeak.log10() > 1e6) el("postInfinityButton").innerHTML = "Big Crunch"
			else {
				var IPminpart = IPminpeak.log10() > 1e4 ? "" : "<br>" + shortenDimensions(currentIPmin) + " IP/min" + "<br>Peaked at " + shortenDimensions(IPminpeak) + " IP/min"
				el("postInfinityButton").innerHTML = "<b>" + (IPminpeak.log10() > 1e4 ? "Gain " : "Big Crunch for ") + shortenDimensions(gainedInfinityPoints()) + " Infinity points.</b>" + IPminpart
			}
		}
	}
}

function nextICUnlockUpdating(){
	var nextUnlock = getNextAt(order[player.postChallUnlocked])
	if (nextUnlock == undefined) el("nextchall").textContent = " "
	else if (!hasAch("r133")) {
		el("nextchall").textContent = "Next challenge unlocks at "+ shortenCosts(nextUnlock) + " antimatter."
		while (player.money.gte(nextUnlock) && nextUnlock != undefined) {
			if (getEternitied() > 6) {
				player.challenges.push(order[player.postChallUnlocked])
				if (order[player.postChallUnlocked] == "postc1") for (var i = 0; i < player.challenges.length; i++) if (player.challenges[i].split("postc")[1]) infDimPow *= inNGM(2) ? 2 : 1.3
				tmp.cp++
			}
			player.postChallUnlocked++
			nextUnlock = getNextAt(order[player.postChallUnlocked])
			updateChallenges()
		}
		if (getEternitied() > 6 && player.postChallUnlocked >= 8) {
			ndAutobuyersUsed = 0
			for (i = 0; i <= 8; i++) if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].isOn) ndAutobuyersUsed++
			el("maxall").style.display = ndAutobuyersUsed > 8 && player.challenges.includes("postc8") ? "none" : ""
		}
	}
}

function passiveIPperMUpdating(diff){
	player.infinityPoints = player.infinityPoints.plus(bestRunIppm.times(player.offlineProd/100).times(diff/600))
}

function giveBlackHolePowerUpdating(diff){
	if (player.exdilation != undefined) player.blackhole.power = player.blackhole.power.plus(getBlackholeDimensionProduction(1).times(diff))
}

function freeTickspeedUpdating(){
	if (player.boughtDims) ERFreeTickUpdating()
	if (player.timeShards.gt(player.tickThreshold) && !player.boughtDims) nonERFreeTickUpdating()
}

function replicantiIncrease(diff) {
	if (!player.replicanti.unl) return
	if (diff > 5 || tmp.rep.chance > 1 || tmp.rep.interval < 50 || tmp.rep.est.gt(50) || player.timestudy.studies.includes(192)) continuousReplicantiUpdating(diff)
	else notContinuousReplicantiUpdating()
	if (player.replicanti.amount.gt(0)) replicantiTicks += diff

	if (tmp.ngp3 && player.masterystudies.includes("d10") && quSave.autoOptions.replicantiReset && player.replicanti.amount.gt(quSave.replicants.requirement)) replicantReset(true)
	if (player.replicanti.galaxybuyer && canGetReplicatedGalaxy() && canAutoReplicatedGalaxy()) replicantiGalaxy()
}

function IPMultBuyUpdating() {
	if (player.infMultBuyer && (!player.boughtDims || canBuyIPMult())) {
		var dif = Math.floor(player.infinityPoints.div(player.infMultCost).log(aarMod.newGameExpVersion?4:10)) + 1
		if (dif > 0) {
			player.infMult = player.infMult.times(E_pow(getIPMultPower(), dif))
			player.infMultCost = player.infMultCost.times(E_pow(ipMultCostIncrease, dif))
			if (player.infinityPoints.lte(pow10(1e9))) {
				if (ghostified) {
					if (ghSave.milestones < 11) player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(aarMod.newGameExpVersion?4:10).min(player.infinityPoints))
				}
				else player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(aarMod.newGameExpVersion?4:10).min(player.infinityPoints))
			}
			if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = Decimal.times(player.autobuyers[11].priority, E_pow(getIPMultPower(), dif));
			if (player.autoCrunchMode == "amount") el("priority12").value = formatValue("Scientific", player.autobuyers[11].priority, 2, 0);
		}
	}
}

function doEternityButtonDisplayUpdating(diff){
	var unl = canEternity()
	el("eternitybtn").style.display = unl ? "" : "none"
	el("eternitybtn").className = player.dilation.active ? "dilationupg" : "eternitybtn"
	if (!unl) return

	var isSmartPeakActivated = tmp.ngp3 && getEternitied() >= 1e13 && player.dilation.upgrades.includes("ngpp6")
	var EPminpeakUnits = isSmartPeakActivated ? (player.dilation.active ? 'TP' : tmp.be ? 'EM' : 'EP') : 'EP'
	var currentEPmin = updateEPminpeak(diff, EPminpeakUnits)
	EPminpeakUnits = (EPminpeakType == 'logarithm' ? ' log(' + EPminpeakUnits + ')' : ' ' + EPminpeakUnits) + '/min'

	el("eternitybtnFlavor").textContent = (((!player.dilation.active&&gainedEternityPoints().lt(1e6))||player.eternities<1||player.currentEternityChall!==""||(player.options.theme=="Aarex's Modifications"&&player.options.notation!="Morse code"))
									? ((player.currentEternityChall!=="" ? "Other challenges await..." : player.eternities>0 ? "" : "Other times await...") + " I need to become Eternal.") : "")
	if (player.dilation.active && player.dilation.totalTachyonParticles.gte(getDilGain())) el("eternitybtnEPGain").innerHTML = "Reach " + shortenMoney(getReqForTPGain()) + " antimatter to gain more Tachyon Particles."
	else {
		if ((EPminpeak.lt(pow10(9)) && EPminpeakType == "logarithm") || (EPminpeakType == 'normal' && EPminpeak.lt(pow10(1e9)))) {
			el("eternitybtnEPGain").innerHTML = ((player.eternities > 0 && (player.currentEternityChall==""||player.options.theme=="Aarex's Modifications"))
										  ? "Gain <b>"+(player.dilation.active?shortenMoney(getDilGain().sub(player.dilation.totalTachyonParticles)):shortenDimensions(gainedEternityPoints()))+"</b> "+(player.dilation.active?"Tachyon particles.":tmp.be?"EP and <b>"+shortenDimensions(getEMGain())+"</b> Eternal Matter.":"Eternity points.") : "")
		} else {
			el("eternitybtnEPGain").innerHTML = "<b>Go eternal</b>"
		}
	}
	var showEPmin=(player.currentEternityChall===""||player.options.theme=="Aarex's Modifications")&&EPminpeak>0&&player.eternities>0&&player.options.notation!='Morse code'&&player.options.notation!='Spazzy'&&(!(player.dilation.active||tmp.be)||isSmartPeakActivated)
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
		var bigRipped = !tmp.ngp3 ? false : brSave.active
		if (!bigRipped) {
			currentQKmin = quarkGain().dividedBy(quSave.time / 600)
			if (currentQKmin.gt(QKminpeak) && player.meta.antimatter.gte(E_pow(Number.MAX_VALUE,tmp.ngp3 ? 1.2 : 1))) {
				QKminpeak = currentQKmin
				QKminpeakValue = quarkGain()
				quSave.autobuyer.peakTime = 0
			} else quSave.autobuyer.peakTime += diff
		}
	}

	let flavor = "I need to go quantum."
	if (!quantumed) flavor = "I am not powerful enough... " + flavor
	if (!inQC(0)) flavor = "Challenges aren't enough... " + flavor
	if (tmp.ngp3 && brSave.active) flavor = "The universe isn't potential enough..."
	el("quantumbtnFlavor").textContent = flavor

	var showGain = quantumed && inQC(0) ? "QK" : ""
	if (tmp.ngp3 && brSave.active) showGain = "SS"

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
}

function doGhostifyButtonDisplayUpdating(diff){
	var currentGHPmin = E(0)
	if (ghostified && bigRipped) {
		currentGHPmin = getGHPGain().dividedBy(ghSave.time / 600)
		if (currentGHPmin.gt(GHPminpeak)) {
			GHPminpeak = currentGHPmin
			GHPminpeakValue = getGHPGain()
		}
	}
	var ghostifyGains = []
	if (ghostified) ghostifyGains.push(shortenDimensions(getGHPGain()) + " Elementary Particles")
	if (ghostified && hasAch("ng3p78")) ghostifyGains.push(shortenDimensions(Decimal.times(6e3 * brSave.bestGals, getGhostifiedGain()).times(getNeutrinoGain())) + " Neutrinos")
	if (hasBU(15)) ghostifyGains.push(getFullExpansion(getGhostifiedGain()) + " Fundaments")
	el("ghostifybtnFlavor").textContent = ghostifyGains.length > 1 ? "" : (ghostifyGains.length ? "" : "Time to enlarge! ") + "I need to fundament."
	el("GHPGain").textContent = ghostifyGains.length ? "Gain " + ghostifyGains[0] + (ghostifyGains.length > 2 ? ", " + ghostifyGains[1] + "," : "") + (ghostifyGains.length > 1 ? " and " + ghostifyGains[ghostifyGains.length-1] : "") + "." : ""
	var showGHPPeakValue = GHPminpeakValue.lt(1e6) || player.options.theme=="Aarex's Modifications"
	el("GHPRate").textContent = ghostifyGains.length == 1 && showGHPPeakValue ? getGHPRate(currentGHPmin) : ""
	el("GHPPeak").textContent = ghostifyGains.length == 1 ? (showGHPPeakValue?"":"Peaked at ")+getGHPRate(GHPminpeak)+(showGHPPeakValue?" at "+shortenDimensions(GHPminpeakValue)+" ElP":"") : ""
}

function tickspeedButtonDisplay(){
	if (player.tickSpeedCost.gt(player.money)) {
		el("tickSpeed").className = 'unavailablebtn';
		el("tickSpeedMax").className = 'unavailablebtn';
	} else {
		el("tickSpeed").className = 'storebtn';
		el("tickSpeedMax").className = 'storebtn';
	}
}

function normalSacDisplay(){
	if (player.eightBought > 0 && player.resets > 4 && player.currentEternityChall !== "eterc3") el("sacrifice").className = "storebtn"
   	else el("sacrifice").className = "unavailablebtn"
}

function DimBoostBulkDisplay(){
	var bulkDisplay = player.infinityUpgrades.includes("bulkBoost") || player.autobuyers[9].bulkBought === true ? "inline" : "none"
	el("bulkdimboost").style.display = bulkDisplay
	if (inNGM(3)) el("bulkTickBoostDiv").style.display = bulkDisplay
}

function currentChallengeProgress(){
	var p = Math.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip',"Percentage to challenge goal")
}

function preBreakProgess(){
	var p = Math.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(Number.MAX_VALUE) * 100), 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip',"Percentage to Infinity")
}

function infDimProgress(){
	var p = Math.min(player.money.e / getNewInfReq().money.e * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip',"Percentage to next dimension unlock")
}

function currentEChallengeProgress(){
	var p = Math.min(Decimal.log10(player.infinityPoints.plus(1)) / player.eternityChallGoal.log10() * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip',"Percentage to Eternity Challenge goal")
}

function preEternityProgress(){
	var p = Math.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(Number.MAX_VALUE)  * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip',"Percentage to Eternity")
}

function r128Progress(){
	var p = (Decimal.log10(player.infinityPoints.plus(1)) / 220).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip','Percentage to "What do I have to do to get rid of you"') 
}

function r138Progress(){
	var p = Math.min(Decimal.log10(player.infinityPoints.plus(1)) / 200, 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip','Percentage to "That is what I have to do to get rid of you."')
}

function gainTPProgress(){
	var p = (getDilGain().log10() / player.dilation.totalTachyonParticles.log10()).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip','Percentage to the requirement for tachyon particle gain')
}

function ngpp13Progress(){
	var gepLog = gainedEternityPoints().log2()
	var goal = Math.pow(2,Math.ceil(Math.log10(gepLog) / Math.log10(2)))
	goal = Decimal.sub("1e40000", player.eternityPoints).log2()
	var percentage = Math.min(gepLog / goal * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = percentage
	el("progresspercent").textContent = percentage
	el("progresspercent").setAttribute('ach-tooltip','Percentage to "In the grim darkness of the far endgame"')
}

function r127Progress(){
	var gepLog = gainedEternityPoints().log2()
	var goal = Math.pow(2,Math.ceil(Math.log10(gepLog) / Math.log10(2)))
	goal = Decimal.sub(Number.MAX_VALUE, player.eternityPoints).log2()
	var percentage = Math.min(gepLog / goal * 100, 100).toFixed(2) + "%"
	el("progressbar").style.width = percentage
	el("progresspercent").textContent = percentage
	el("progresspercent").setAttribute('ach-tooltip','Percentage to "But I wanted another prestige layer..."')
}

function preQuantumNormalProgress(){
	var gepLog = gainedEternityPoints().log2()
	var goal = Math.pow(2,Math.ceil(Math.log10(gepLog) / Math.log10(2)))
	if (goal > 131072 && player.meta && !hasAch('ngpp13')) {
		ngpp13Progress()
	} else if (goal > 512 && !hasAch('r127')) {
		r127Progress()
	} else {
		var percentage = Math.min(gepLog / goal * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = percentage
		el("progresspercent").textContent = percentage
		el("progresspercent").setAttribute('ach-tooltip',"Percentage to "+shortenDimensions(pow2(goal))+" EP gain")
	}
}

function progressBarUpdating(){
	if (!aarMod.progressBar) return
	el("progressbar").className=""
	if (el("metadimensions").style.display == "block") doQuantumProgress() 
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
	} else if (player.dilation.studies.includes(5) && player.dilation.active && !hasAch('r138') && player.timestudy.studies.length == 0) {
		r138Progress()
	} else if (player.dilation.active && player.dilation.totalTachyonParticles.gte(getDilGain())) {
		gainTPProgress()
	} else if ((!inQC(0) || gainedEternityPoints().gte(pow2(1048576))) && player.meta) doQuantumProgress()
	else preQuantumNormalProgress()
}

function ECRewardDisplayUpdating(){
	el("ec1reward").textContent = "Reward: "+shortenMoney(getECReward(1))+"x on all Time Dimensions (based on time spent this Eternity)"
	el("ec2reward").textContent = "Reward: Infinity Power affects the 1st Infinity Dimension with reduced effect. Currently: " + shortenMoney(getECReward(2)) + "x"
	el("ec3reward").textContent = "Reward: Increase the multiplier for buying 10 Dimensions. Currently: " + shorten(getDimensionPowerMultiplier("no-QC5")) + "x"
	el("ec4reward").textContent = "Reward: Infinity Dimensions gain a multiplier from unspent IP. Currently: " + shortenMoney(getECReward(4)) + "x"
	el("ec5reward").textContent = "Reward: Galaxy cost scaling starts " + getECReward(5) + " galaxies later."
	el("ec6reward").textContent = "Reward: Further reduce the dimension cost multiplier increase. Currently: " + player.dimensionMultDecrease.toFixed(1) + "x "
	el("ec7reward").textContent = "Reward: First Time Dimensions produce Eighth Infinity Dimensions. Currently: " + shortenMoney(DimensionProduction(9)) + " per second. "
	el("ec8reward").textContent = "Reward: Infinity Power powers up replicanti galaxies. Currently: " + (getECReward(8) * 100 - 100).toFixed(2) + "%"
	el("ec9reward").textContent = "Reward: Infinity Dimensions gain a " + (inNGM(2) ? "post dilation " : "") + " multiplier based on your Time Shards. Currently: "+shortenMoney(getECReward(9))+"x "
	el("ec10reward").textContent = "Reward: Time Dimensions gain a multiplier from your Infinities. Currently: " + shortenMoney(getECReward(10)) + "x "
	el("ec11reward").textContent = "Reward: Further reduce the tickspeed cost multiplier increase. Currently: " + player.tickSpeedMultDecrease.toFixed(2) + "x "
	el("ec12reward").textContent = "Reward: Infinity Dimension cost multipliers are reduced. (x^" + getECReward(12) + ")"
	el("ec13reward").textContent = "Reward: Increase the exponent of meta-antimatter's effect. (" + (getECReward(13)+9) + "x)"
	el("ec14reward").textContent = "Reward: Free tickspeed upgrades boost the IC3 reward to be " + getIC3EffFromFreeUpgs().toFixed(0) + "x stronger."

	el("ec10span").textContent = shortenMoney(ec10bonus) + "x"
}

function challengeOverallDisplayUpdating(){
	if (el("challenges").style.display == "block") {
		if (el("eternitychallenges").style.display == "block") ECRewardDisplayUpdating()
		if (el("quantumchallenges").style.display == "block") {
			if (quSave.autoOptions.sacrifice) el("electronsAmount2").textContent="You have " + getFullExpansion(Math.round(quSave.electrons.amount)) + " electrons."
			for (var c=1;c<7;c++) {
				if (c==5) el("qc5reward").textContent = getDimensionPowerMultiplier("linear").toFixed(2)
				else if (c!=2) el("qc"+c+"reward").textContent = shorten(tmp.qcRewards[c])
			}
		}
	}
}

function infDimTabUpdating(){
   	el("idtabbtn").style.display = ((player.infDimensionsUnlocked[0] || player.eternities > 0 || quantumed) && !inQC(8)) ? "" : "none"
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
	if (tmp.ngp3 && player.masterystudies.includes("t291")) {
		player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints().times(diff / 100))
	}
}

function ngp3DilationUpdating(){
	let gain = getDilGain()
	if (inNGM(2)) player.dilation.bestIP = player.infinityPoints.max(player.dilation.bestIP)
	if (player.dilation.tachyonParticles.lt(gain) && player.masterystudies.includes("t292")) setTachyonParticles(gain)
}

function setTachyonParticles(x) {
	player.dilation.tachyonParticles = E(x)
	if (!player.dilation.active) player.dilation.totalTachyonParticles = player.dilation.tachyonParticles
	quSave.notrelative = false
	if (hasAch("ng3p18") || hasAch("ng3p37")) {
		player.dilation.bestTP = Decimal.max(player.dilation.bestTP || 0, player.dilation.tachyonParticles)
		player.dilation.bestTPOverGhostifies = player.dilation.bestTPOverGhostifies.max(player.dilation.bestTP)
		el('bestTP').textContent = "Your best" + (ghostified ? "" : " ever")+" Tachyon particles" + (ghostified ? " in this Fundament" : "") + " was " + shorten(player.dilation.bestTP) + "."
		setAndMaybeShow('bestTPOverGhostifies', ghostified, '"Your best-ever Tachyon particles was "+shorten(player.dilation.bestTPOverGhostifies)+"."')
	}
}

function passiveQuantumLevelStuff(diff){
	if (brSave.active && hasAch("ng3p107")) {
		ghSave.ghostParticles = ghSave.ghostParticles.add(getGHPGain().times(diff))
		ghSave.times = nA(ghSave.times, E(getGhostifiedGain()).mul(diff))
		let ngain = getNeutrinoGain()
		ghSave.neutrinos.electron = ghSave.neutrinos.electron.add(ngain.mul(diff))
		ghSave.neutrinos.mu = ghSave.neutrinos.mu.add(ngain.mul(diff))
		ghSave.neutrinos.tau = ghSave.neutrinos.tau.add(ngain.mul(diff))
	}
	if (brSave.active || hasBU(24)) brSave.spaceShards = brSave && brSave.spaceShards.add(getSpaceShardsGain().times(diff / 100))
	if (!brSave.active) {
		quSave.quarks = quSave.quarks.add(quarkGain().sqrt().times(diff))
		var p = ["rg", "gb", "br"]
		for (var i = 0; i < 3; i++) {
			var r = quSave.usedQuarks[p[i][0]].min(quSave.usedQuarks[p[i][1]]).div(100)
			quSave.gluons[p[i]] = quSave.gluons[p[i]].add(r.times(diff))
		}
		if (ghSave.milestones>15) quSave.quarks=quSave.quarks.add(quarkGain().times(diff / 100))
	}
	if (tmp.be && ghSave.milestones>14) beSave.eternalMatter=beSave.eternalMatter.add(getEMGain().times(diff / 100))
	updateQuarkDisplay()
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
	setAndMaybeShow("quantumClock", tmp.ngp3 ? (quantumed && quSave.times > 1 && speedrunMilestonesReached < 28) : false, '"Quantum time: <b class=\'QKAmount\'>"+timeDisplayShort(quSave.time)+"</b>"')
}

function updateInfinityTimes(){
	if (player.thisInfinityTime < -10) player.thisInfinityTime = Infinity
	if (player.bestInfinityTime < -10) player.bestInfinityTime = Infinity
}

function infUpgPassiveIPGain(diff){
	if (diff > player.autoTime && !player.break) player.infinityPoints = player.infinityPoints.plus(player.autoIP.div(player.autoTime).times(diff))
}

function gameLoop(diff) {
	var thisUpdate = new Date().getTime();
	if (thisUpdate - player.lastUpdate >= 21600000) giveAchievement("Don't you dare sleep")
		if (typeof diff === 'undefined') {
		if (player.options.secrets && player.options.secrets.ghostlyNews) nextGhostlyNewsTickerMsg()
		var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
	}

	diff = Math.max(diff / 1e3, 0)
	if (gameSpeed != 1) diff = diff * gameSpeed
	var diffStat = diff * 10
	if (player.version === 12.2 && typeof player.shameLevel === 'number') diff *= Math.min(Math.pow(10, player.shameLevel), 1)
	if (player.currentEternityChall === "eterc12") diff /= getEC12Slowdown()

	updateInfinityTimes()
	updateTemp()
	infUpgPassiveIPGain(diff)

	checkMatter(diff)
	passiveIPupdating(diff)
	passiveInfinitiesUpdating(diff)
	requiredInfinityUpdating(diff)
	normalChallPowerUpdating(diff)
	passiveIPperMUpdating(diff)
	incrementTimesUpdating(diffStat)
	dimensionButtonDisplayUpdating()
	automatorTick(diff)

	if (player.meta) metaDimsUpdating(diff)
	infinityTimeMetaBlackHoleDimUpdating(diff) //production of those dims
	otherDimsUpdating(diff)
	giveBlackHolePowerUpdating(diff)
	freeTickspeedUpdating()
	IPonCrunchPassiveGain(diff)
	EPonEternityPassiveGain(diff)
	TTpassiveGain(diff)

	infDimTabUpdating()
	dimensionPageTabsUpdating()
	bigCrunchButtonUpdating()
	nextICUnlockUpdating()

	if (player.break) el("iplimit").style.display = "inline"
	else el("iplimit").style.display = "none"
	el("IPPeakDiv").style.display=(player.break&&player.boughtDims)?"":"none"

	if (tmp.tickUpdate) {
		updateTickspeed()
		tmp.tickUpdate = false
	}
	replicantiIncrease(diff * 10)
	IPMultBuyUpdating()
	doEternityButtonDisplayUpdating(diff)
	doQuantumButtonDisplayUpdating(diff)	
	doGhostifyButtonDisplayUpdating(diff)
	
	updateMoney();
	updateCoinPerSec();

	updateDimensionsDisplay()
	updateInfCosts()

	updateDilationDisplay()

	checkMarathon()
	checkMarathon2()
	checkPain()
	checkSupersanic()
	tickspeedButtonDisplay()
	updateCosts()

	if (player.dilation.studies.includes(1)) player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilTimeGainPerSecond().times(diff))
	gainDilationGalaxies()

	passiveGPGen(diff)
	normalSacDisplay()
	galSacDisplay()
	d8SacDisplay()

	DimBoostBulkDisplay()
	el("epmult").className = player.eternityPoints.gte(player.epmultCost) ? "eternityupbtn" : "eternityupbtnlocked"

	progressBarUpdating()
	challengeOverallDisplayUpdating()
	chall23PowerUpdating()

	dimboostBtnUpdating()
	galaxyBtnUpdating()  
	newIDDisplayUpdating()
	galSacBtnUpdating()
	updateConvertSave(eligibleConvert())

	if (isNaN(player.totalmoney)) player.totalmoney = E(10)
	
	if (tmp.ngp3) {
		if (player.dilation.active) ngp3DilationUpdating()
		else if (isBigRipUpgradeActive(20)) {
			let gain = getDilGain()
			if (player.dilation.tachyonParticles.lt(gain)) setTachyonParticles(gain)
		}
		if (ghSave.milestones>7) passiveQuantumLevelStuff(diff)
		if (player.masterystudies.includes('t291')) updateEternityUpgrades() // to fix the 5ep upg display
		if (quantumed) quantumOverallUpdating(diff)
		if (ghostified) {
			if (ghSave.wzb.unl) WZBosonsUpdating(diff) // Bosonic Lab
			if (ghSave.ghostlyPhotons.unl) ghostlyPhotonsUpdating(diff) // Photons
		}
		postNGp3Updating(diff)
	}

	thisQuantumTimeUpdating()
	var s = shortenDimensions(player.infinityPoints)
	el("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+s+"</span> Infinity points."
	el("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+s+"</span> Infinity points."
	el("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity points."

	if (el("loadmenu").style.display == "block") changeSaveDesc(metaSave.current, savePlacement)

	player.lastUpdate = thisUpdate;
}

function simulateTime(seconds, real, id) {
	//the game is simulated at a 50ms update rate, with a max of 1000 ticks
	//warning: do not call this function with real unless you know what you're doing
	var ticks = seconds * 20;
	var bonusDiff = 0;
	var playerStart = Object.assign({}, player);
	var storage = {}
	if (player.blackhole !== undefined) storage.bp = player.blackhole.power
	if (player.meta !== undefined) storage.ma = player.meta.antimatter
	if (tmp.ngp3) {
		storage.dt = player.dilation.dilatedTime
		storage.ec = quSave.electrons.amount
		storage.nr = quSave.replicants.amount
		storage.bAm = ghSave.bl.am
	}
	if (ticks > 1000 && !real) {
		bonusDiff = (ticks - 1000) / 20;
		ticks = 1000;
	}
	let ticksDone = 0
	for (ticksDone=0; ticksDone<ticks; ticksDone++) {
		gameLoop(50+bonusDiff)
		autoBuyerTick();
	}
	closeToolTip()
	var popupString = "While you were away"
	if (player.money.gt(playerStart.money)) popupString+= ",<br> your antimatter increased "+shortenMoney(player.money.log10() - (playerStart.money).log10())+" orders of magnitude"
	if (player.infinityPower.gt(playerStart.infinityPower) && !quantumed) popupString+= ",<br> infinity power increased "+shortenMoney(player.infinityPower.log10() - (Decimal.max(playerStart.infinityPower, 1)).log10())+" orders of magnitude"
	if (player.timeShards.gt(playerStart.timeShards) && !quantumed) popupString+= ",<br> time shards increased "+shortenMoney(player.timeShards.log10() - (Decimal.max(playerStart.timeShards, 1)).log10())+" orders of magnitude"
	if (storage.dt) if (player.dilation.dilatedTime.gt(storage.dt)) popupString+= ",<br> dilated time increased "+shortenMoney(player.dilation.dilatedTime.log10() - (Decimal.max(storage.dt, 1)).log10())+" orders of magnitude"
	if (storage.bp) if (player.blackhole.power.gt(storage.bp)) popupString+= ",<br> black hole power increased "+shortenMoney(player.blackhole.power.log10() - (Decimal.max(storage.bp, 1)).log10())+" orders of magnitude"
	if (storage.ma) if (player.meta.antimatter.gt(storage.ma)) popupString+= ",<br> meta-antimatter increased "+shortenMoney(player.meta.antimatter.log10() - (Decimal.max(storage.ma, 1)).log10())+" orders of magnitude"
	if (storage.dt) {
		if (quSave.electrons.amount>storage.ec) popupString+= ",<br> electrons increased by "+getFullExpansion(Math.round(quSave.electrons.amount-storage.ec))
		if (quSave.replicants.amount.gt(storage.nr)) popupString+= ",<br> normal duplicants increased "+shortenMoney(quSave.replicants.amount.log10() - (Decimal.max(storage.nr, 1)).log10())+" orders of magnitude"
		if (ghSave.bl.am.gt(storage.ma)) popupString+= ",<br> Bosons increased "+shortenMoney(ghSave.bl.am.log10() - (Decimal.max(storage.bAm, 1)).log10())+" orders of magnitude"
	}
	if (player.infinitied > playerStart.infinitied || player.eternities > playerStart.eternities) popupString+= ","
	else popupString+= "."
	if (player.infinitied > playerStart.infinitied) popupString+= "<br>you infinitied "+getFullExpansion(player.infinitied-playerStart.infinitied)+" times."
	if (player.eternities > playerStart.eternities) popupString+= " <br>you eternitied "+getFullExpansion(player.eternities-playerStart.eternities)+" times."
	if (popupString.length == 20) {
		popupString = popupString.slice(0, -1);
		popupString+= "... Nothing happened."
		if (id == "lair") popupString+= "<br><br>I told you so."
		giveAchievement("While you were away... Nothing happened.")
	}
	el("offlineprogress").style.display = "block"
	el("offlinePopup").innerHTML = popupString
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
	} catch (e) {
		console.error(e)
	}
	var tickEnd = new Date().getTime()
	var tickDiff = tickEnd - tickStart

	tickWait = tickDiff * (aarMod.performanceTicks * 2)
	tickWaitStart = tickEnd
	}, player.options.updateRate);
}

function enableChart() {
	if (el("chartOnOff").checked) {
		player.options.chart.on = true;
		if (player.options.chart.warning < 1) alert("Warning: Using the chart can cause performance issues. Please disable it if you're experiencing lag.")
	} else {
		player.options.chart.on = false;
	}
}

function enableChartDips() {
	if (el("chartDipsOnOff").checked) {
		player.options.chart.dips = true;
	} else {
		player.options.chart.dips = false;
	}
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
	if ((inNC(11) || player.currentEternityChall == "eterc6" || player.currentChallenge == "postc1" || (player.currentChallenge == "postc5" && inNGM(3)) || player.currentChallenge == "postc7" || inQC(6)) && !tmp.be) return
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
		if (quarkGain().gte(Decimal.round(quSave.autobuyer.limit).times(quSave.last10[0][1]))) quantum(true, false, 0)
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
		if (gainedEternityPoints().gte(player.lastTenEternities[0][1].times(player.eternityBuyer.limit))) eternity(false, true)
	} else if (player.autoEterMode == "relativebest") {
		if (gainedEternityPoints().gte(bestEp.times(player.eternityBuyer.limit))) eternity(false, true)
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
	if (player.autobuyers[10].ticks*100 >= player.autobuyers[10].interval && getAmount(inNC(4)?6:8) >= getGalaxyRequirement() && (!inNC(14) || !inNGM(3))) {
		if (getEternitied() < 9) {
			if (player.autobuyers[10].isOn && player.autobuyers[10].priority > player.galaxies) {
				autoS = false;
				el("secondSoftReset").click()
				player.autobuyers[10].ticks = 1;
			}
		} else if (player.autobuyers[10].isOn && (player.autobuyers[10].bulk == 0 || (Math.round(timer * 100))%(Math.round(player.autobuyers[10].bulk * 100)) == 0)){
			maxBuyGalaxies()
		}
	} else player.autobuyers[10].ticks += 1;
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
	if (tmp.ngp3) if (speedrunMilestonesReached>22&&quSave.autobuyer.enabled&&!brSave.active) autoQuantumABTick()
	
	if (getEternitied() >= 100 && isEterBuyerOn()) autoEternityABTick()

	if (player.autobuyers[11]%1 !== 0) {
		if (player.autobuyers[11].ticks*100 >= player.autobuyers[11].interval && player.money !== undefined && player.money.gte(player.currentChallenge == "" ? Number.MAX_VALUE : player.challengeTarget)) {
			if (player.autobuyers[11].isOn) {
				if ((!player.autobuyers[11].requireIPPeak || IPminpeak.gt(gainedInfinityPoints().div(player.thisInfinityTime/600))) && player.autobuyers[11].priority) {
					if (player.autoCrunchMode == "amount") {
						if (!player.break || player.currentChallenge != "" || gainedInfinityPoints().gte(player.autobuyers[11].priority)) {
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
						if (!player.break || player.currentChallenge != "" || gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(player.autobuyers[11].priority))) {
							autoS = false;
							bigCrunch(true)
						}
					}
				}
				player.autobuyers[11].ticks = 1;
			}
		} else player.autobuyers[11].ticks += 1;
	}
	
	if (player.autobuyers[9]%1 !== 0) dimBoostABTick()
	if (player.autobuyers[10]%1 !== 0) galaxyABTick()
	if (inNGM(2)) if (player.autobuyers[12]%1 !== 0) galSacABTick()
	if (inNGM(3)) if (player.autobuyers[13]%1 !== 0) TSBoostABTick()
	if (inNGM(4)) if (player.autobuyers[14]%1 !== 0) TDBoostABTick()

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
					if (!inNC(14) | inNGM(3)) {
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

function showInftab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('inftab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	aarMod.tabsSave.tabInfinity = tabName
}

function showStatsTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('statstab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	aarMod.tabsSave.tabStats = tabName
}

function showDimTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('dimtab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	aarMod.tabsSave.tabDims = tabName
	if (el("dimensions").style.display !== "none" && aarMod.progressBar && (tabName === 'antimatterdimensions' || tabName === 'metadimensions')) el("progress").style.display = "block"
	else el("progress").style.display = "none"
}

function toggleProgressBar() {
	aarMod.progressBar=!aarMod.progressBar
	el("progressBarBtn").textContent = (aarMod.progressBar?"Hide":"Show")+" progress bar"	
}

function showChallengesTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('challengeTab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	aarMod.tabsSave.tabChalls = tabName
}

function showEternityTab(tabName, init) {
	if (tabName == "timestudies" && player.boughtDims) tabName = "ers_" + tabName
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('eternitytab');
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
	if ((tabName === 'timestudies' || tabName === 'ers_timestudies' || tabName === 'masterystudies') && !init) el("TTbuttons").style.display = "block"
	else el("TTbuttons").style.display = "none"
	if (tabName != oldTab) {
		aarMod.tabsSave.tabEternity = tabName
		if (tabName === 'timestudies' || tabName === 'masterystudies' || tabName === 'dilation' || tabName === 'blackhole') resizeCanvas()
		if (tabName === "dilation") requestAnimationFrame(drawAnimations)
		if (tabName === "blackhole") requestAnimationFrame(drawBlackhole)
	}
	closeToolTip()
}

function showAchTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('achtab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	aarMod.tabsSave.tabAchs = tabName
}

function showOptionTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('optionstab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	aarMod.tabsSave.tabOptions = tabName
	closeToolTip()
}

function closeToolTip(showStuck) {
	var elements = document.getElementsByClassName("popup")
	for (var i=0; i<elements.length; i++) if (elements[i].id!='welcome') elements[i].style.display = "none"
	if (showStuck && !game_loaded) showStuckPopup()
}

var game_loaded
function initGame() {
	//Setup stuff.
	initiateMetaSave()
	migrateOldSaves()
	setup_data()
	updateNewPlayer(meta_started ? "meta_started" : "")
	setupHTMLAndData()
	localStorage.setItem(metaSaveId, btoa(JSON.stringify(metaSave)))

	//Load a save.
	load_game(false, true)
	game_loaded=true

	//show one tab during init or they'll all start hidden
	let tabsSaveData = aarMod.tabsSave
	let tabsSave = tabsSaveData&&tabsSaveData.on
	showTab((tabsSave && tabsSaveData.tabMain) || "dimensions",true)
	showOptionTab((tabsSave && tabsSaveData.tabOptions) || "saving")
	if (aarMod.progressBar && el("dimensions").style.display != "none") el("progress").style.display = "block"
	else el("progress").style.display = "none"
	tmp.tickUpdate = true
	updateAutobuyers()
	updateChallengeTimes()
	window.addEventListener("resize", resizeCanvas);

	//On load
	setTimeout(function(){
		el("container").style.display = "block"
		el("loading").style.display = "none"
	},100)
	clearInterval(stuckTimeout)

	setInterval(updatePerSecond, 1000)
	updatePerSecond()
}

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
	if (!player.options.hotkeys || controlDown === true || document.activeElement.type === "text" || document.activeElement.type === "number" || onImport) return false
	const key = event.keyCode;
	if (key >= 49 && key <= 56) {
		if (shiftDown) buyOneDimension(key-48)
		else buyManyDimension(key-48)
		return false;
	} else if (key >= 97 && key <= 104) {
		if (shiftDown) buyOneDimension(key-96)
		else buyManyDimension(key-96)
		return false;
	}
	switch (key) {
		case 65: // A
			toggleAutoBuyers();
		break;

		case 66: // B
			if (hasAch("ng3p51")) bigRip()
			else if (inNGM(3)) manualTickspeedBoost()
		break;

		case 68: // D
			if (shiftDown && hasAch("ngpp11")) metaBoost()
			else if (hasAch("r136")) startDilatedEternity()
			else el("softReset").onclick()
		break;

		case 70: // F
			if (hasAch("ng3p51")) ghostify()
		break;

		case 71: // G
			if (!hasAch("ng3p51")) el("secondSoftReset").onclick()
		break;

		case 76: // N
			if (inNGM(4)) tdBoost(1)
		break;

		case 77: // M
			if (ndAutobuyersUsed<9||!player.challenges.includes("postc8")) el("maxall").onclick()
			if (player.dilation.studies.includes(6)) {
				var maxmeta=true
				for (d = 1; d < 9; d++) {
					if (player.autoEterOptions["meta" + d]) {
						if (d > 7 && speedrunMilestonesReached < 28) maxmeta = false
					} else break
				}
				if (maxmeta) el("metaMaxAll").onclick()
			}
		break;

		case 83: // S
			el("sacrifice").onclick()
		break;

		case 84: // T
			if (shiftDown) buyTickSpeed()
			else buyMaxTickSpeed()
		break;

		case 85: // U
			if (tmp.ngp3) unstableAll()
		break;

		case 82: //R
			replicantiGalaxy()
		break;
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
		if (player.meta) quantum(false,false,0)
		break;
	}
}, false);


function getUnspentBonus() {
	x = player.infinityPoints
	if (!x) return E(1)
	if (inNGM(2)) return x.pow(Math.max(Math.min(Math.pow(x.max(1).log(10), 1 / 3) * 3, 8), 1)).plus(1);
	else return x.dividedBy(2).pow(1.5).plus(1)
}

var totalMult = 1
var currentMult = 1
var infinitiedMult = 1
var achievementMult = 1
var unspentBonus = 1
var mult18 = 1
var ec10bonus = E(1)
var QC4Reward

function getAchievementMult(){
	var ach = player.achievements.length
	var gups = inNGM(2) ? player.galacticSacrifice.upgrades.length : 0
	var minus = inNGM(2) ? 10 : 30
	var exp = inNGM(2) ? 5 : 3
	var div = 40
	if (inNGM(4)) {
		minus = 0
		exp = 10
		div = 20
		div -= Math.sqrt(gups)
		if (gups > 15) exp += gups
	}
	return Math.max(Math.pow(ach - minus - getSecretAchAmount(), exp) / div, 1)
}

function updatePowers() {
	totalMult = tmp.postinfi11
	currentMult = tmp.postinfi21
	infinitiedMult = getInfinitiedMult()
	achievementMult = getAchievementMult()
	unspentBonus = getUnspentBonus()
	if (player.boughtDims) mult18 = getDimensionFinalMultiplier(1).max(1).times(getDimensionFinalMultiplier(8).max(1)).pow(0.02)
	else mult18 = getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(8)).pow(0.02)
	if (player.currentEternityChall == "eterc10" || inQC(6)) {
		ec10bonus = E_pow(getInfinitied(), 1e3).max(1)
		if (player.timestudy.studies.includes(31)) ec10bonus = ec10bonus.pow(4)
	} else {
		ec10bonus = E(1)
	}
}

var updatePowerInt
function resetUP() {
	clearInterval(updatePowerInt)
	updatePowers()
	updateTemp()
	mult18 = 1
	updatePowerInt = setInterval(updatePowers, 100)
}
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

function setupParadoxUpgrades(){
	var pu = el("pUpgs")
	for (let r = 1; r <= puSizes.y; r++) {
		let row = pu.insertRow(r - 1)
		for (let c = 1; c <= puSizes.x; c++) {
			var col = row.insertCell(c - 1)
			var id = (r * 10 + c)
			col.innerHTML = "<button id='pu" + id + "' class='infinistorebtn1' onclick='buyPU("+id+","+(r<2)+")'>"+(typeof(puDescs[id])=="function"?"<span id='pud"+id+"'></span>":puDescs[id]||"???")+(puMults[id]?"<br>Currently: <span id='pue"+id+"'></span>":"")+"<br><span id='puc"+id+"'></span></button>"
		}
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
		html += '<td><span class="empQuarks" id="empQuarks' + d + '">0</span> preons/s</td>'
		html += '<td align="right" width="2.5%"><button id="empFeedMax' + d + '" style="color:black; width:70px; font-size:10px" class="storebtn" align="right" onclick="feedReplicant('+d+', true)">Max</button></td>'
		html += '<td align="right" width="7.5%"><button id="empFeed' + d + '" style="color:black; width:195px; height:25px; font-size:10px" class="storebtn" align="right" onclick="feedReplicant('+d+')">Feed (0%)</button></td>'
		row.innerHTML = html
	}
}

function setupToDHTMLandData(){
	for (var c = 0; c < 3; c++) {
		var color = (["red", "green", "blue"])[c]
		var shorthand = (["r", "g", "b"])[c]
		var branchUpgrades = ["Gain <span id='" + color + "UpgPow1'></span>x " + color + " quark spins, but " + color + " quarks decay <span id='" + color + "UpgSpeed1'></span>x faster.",
				      "The gain of " + color + " <span id='" + color + "UpgName2'></span> quarks is multiplied by x and then raised to the power of x.",
				      (["Red", "Green", "Blue"])[c]+" <span id='" + color + "UpgName3'></span> quarks decay<span id='" + color + "UpgEffDesc'> 4x</span> slower."] //might need to change this to just "slower" once we have 1000+ upgrade 3's

		var html = 'You have <span class="' + color + '" id="' + color + 'QuarksToD" style="font-size: 35px">0</span> ' + color + ' quarks.<br>'
		html += '<button class="storebtn" id="' + color + 'UnstableGain" style="width: 240px; height: 80px" onclick="unstableQuarks(\'' + shorthand + '\')"></button><br>'
		html += 'You have <span class="' + color + '" id="' + color + 'QuarkSpin" style="font-size: 35px">0.0</span> ' + color + ' quark spin.'
		html += '<span class="' + color + '" id="' + color + 'QuarkSpinProduction" style="font-size: 25px">+0/s</span><br>'
		html += "You have <span class='" + color + "' id='" + color + "UnstableQuarks' style='font-size: 35px'>0</span> " + color + " <span id='" + shorthand + "UQName'></span> quarks.<br>"
		html += "<span id='" + color + "QuarksDecayRate'></span>.<br>"
		html += "They will last <span id='" + color + "QuarksDecayTime'></span>."
		el("todRow").insertCell(c).innerHTML = html
		el("todRow").cells[c].className = shorthand + "qC"
		
		html = "<table class='table' align='center' style='margin: auto'><tr>"
		for (var u = 1; u <= 3; u++) {
			html += "<td style='vertical-align: 0'><button class='gluonupgrade unavailablebtn' id='" + color + "upg" + u + "' onclick='buyBranchUpg(\"" + shorthand + "\", " + u + ")' style='font-size:10px'>" + branchUpgrades[u - 1] + "<br>" 
			html += "Currently: <span id='" + color + "upg" + u + "current'>1</span>x<br><span id='" + color + "upg" + u + "cost'>?</span></button>"
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

function setupQuantumChallenges(){
	var modDiv = ""
	for (var m = 0; m < qcm.modifiers.length; m++) {
		var id = qcm.modifiers[m]
		modDiv += ' <button id="qcm_' + id + '" onclick="toggleQCModifier(\'' + id + '\')">' + (qcm.names[id] || "???") + '</button>'
	}
	el("modifiers").innerHTML = modDiv
	var modDiv = '<button class="storebtn" id="qcms_normal" onclick="showQCModifierStats(\'\')">Normal</button>'
	for (var m = 0; m < qcm.modifiers.length; m++) {
		var id = qcm.modifiers[m]
		modDiv += ' <button class="storebtn" id="qcms_' + id + '" onclick="showQCModifierStats(\'' + id + '\')">'+(qcm.names[id] || "???")+'</button>'
	}
	el("modifiersStats").innerHTML=modDiv
}

function setupBraveMilestones(){
	for (var m = 1; m < 17; m++) el("braveMilestone" + m).textContent=getFullExpansion(tmp.bm[m - 1])+"x quantumed"
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
	setupParadoxUpgrades()
	setupInfUpgHTMLandData()
	setupDilationUpgradeList()
	setupMasteryStudiesHTML()
	setupPCTableHTMLandData()
	setupToDHTMLandData()
	setupNanofieldHTMLandData()
	setupQuantumChallenges()
	setupBraveMilestones()
	setupBosonicExtraction()
	setupBosonicUpgrades()
	setupBosonicRunes()
	setupAutobuyerHTMLandData()

	setupPostNGp3HTML()
}

Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = 'Typewriter';
var ctx2 = el("normalDimChart").getContext('2d');
var normalDimChart = new Chart(ctx2, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: ['Exponents of antimatter per second'],
			data: [],
			backgroundColor: ['rgba(0,0,0,1)'],
			borderColor: ['rgba(0,0,0,1)'],
			fill: false,
			lineTension: 0.1,
			borderWidth: 3,
			pointRadius: 0,
			pointBorderWidth: 0,
			pointHoverRadius: 0
		}]
	},
	options: {
		tooltips: {enabled: false},
		hover: {mode: null},
		legend: {
			display: false,
			labels: {
				boxWidth: 0
			}
		},
		scales: {
			yAxes: [{
				ticks: {
					max: 100000000,
					min: 1
				}
			}],
			xAxes: [{
				gridLines: {
					display: false,
					drawTicks: false
				},
				ticks: { fontSize: 0}
			}]
		},
		layout: {padding: {top: 10}}
	}
});

function updateChartValues() {
	player.options.chart.duration = Math.min(Math.max(parseInt(el("chartDurationInput").value), 1), 300);
	el("chartDurationInput").value = player.options.chart.duration;
	player.options.chart.updateRate = Math.min(Math.max(parseInt(el("chartUpdateRateInput").value), 50), 10000);
	el("chartUpdateRateInput").value = player.options.chart.updateRate;
	if (Number.isInteger(player.options.chart.updateRate) === false) {
		player.options.chart.updateRate = 1000;
	}
	if ((player.options.chart.updateRate <= 200 && player.options.chart.duration >= 30) && player.options.chart.warning === 0) {
		alert("Warning: Setting the duration and update rate to more demanding values can cause performance issues.");
		player.options.chart.warning = 1;
	}
	if (player.options.chart.duration / player.options.chart.updateRate * 1000 >= 1000 && player.options.chart.warning !== 2) {
		alert("Warning: You have set the duration and update rate quite high, make sure you know what you're doing or have a good computer before using the chart.");
		player.options.chart.warning = 2;
	}
}


//Theme stuff
function setTheme(name) {
	document.querySelectorAll("link").forEach( function(e) {
		if (e.href.includes("theme")) e.remove();
	});
	
	player.options.theme=name
	if(name !== undefined && name.length < 3) giveAchievement("Shhh... It's a secret")
	var themeName=player.options.secretThemeKey
	if(name === undefined) {
		themeName="Normal"
	} else if(name === "S1") {
		Chart.defaults.global.defaultFontColor = 'black';
		normalDimChart.data.datasets[0].borderColor = '#000'
	} else if(name === "S2") {
		Chart.defaults.global.defaultFontColor = 'black';
		normalDimChart.data.datasets[0].borderColor = '#000'
	} else if(name === "S3") {
		Chart.defaults.global.defaultFontColor = 'black';
		normalDimChart.data.datasets[0].borderColor = '#000'
	} else if(name === "S4") {
		Chart.defaults.global.defaultFontColor = 'black';
		normalDimChart.data.datasets[0].borderColor = '#000'
	} else if(name === "S5") {
		Chart.defaults.global.defaultFontColor = 'black';
		normalDimChart.data.datasets[0].borderColor = '#000'
	} else if (name !== "S6") {
		themeName=name;
	}
	if (theme=="Dark"||theme=="Dark Metro"||name === "S6") {
		Chart.defaults.global.defaultFontColor = '#888';
		normalDimChart.data.datasets[0].borderColor = '#888'
	} else {
		Chart.defaults.global.defaultFontColor = 'black';
		normalDimChart.data.datasets[0].borderColor = '#000'
		}
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

function doWeakerPowerReductionSoftcapNumber(num,start,exp){
	if (num < start || num < 1) return num
	return start*(( (num/start)**exp -1)/exp+1)
}

function doWeakerPowerReductionSoftcapDecimal(num,start,exp){
	if (num.lt(start) || num.lt(1)) return num
	return start.times( num.div(start).pow(exp).minus(1).div(exp).plus(1) )
}

function doStrongerPowerReductionSoftcapNumber(num,start,exp){
	if (num < start || num < 1) return num
	return start*((num/start)**exp)
}

function doStrongerPowerReductionSoftcapDecimal(num,start,exp){
	if (num.lt(start) || num.lt(1)) return num
	return start.times(num.div(start).pow(exp))
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
	}
	if (!init) closeToolTip();
}


function updateMoney() {
	el("z").textContent = "AD: PNG+3R | " + shortenMoney(player.money) + (player.money.e >= 1e6 ? "" : " antimatter")
	el("coinAmount").textContent = shortenMoney(player.money)
	var element2 = el("matter");
	if (player.currentChallenge == "postc6" || inQC(6)) element2.textContent = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter."; //TODO
	else if (inNC(12) || player.currentChallenge == "postc1" || player.pSac !== undefined) {
		var txt = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter."
		var extra = getExtraTime()
		if (player.pSac !== undefined && player.matter.gt(0)) txt += " (" + timeDisplayShort(Math.max(player.money.div(player.matter).log(tmp.mv) * getEC12Mult(),0)) + (extra ? " + " + timeDisplayShort((extra - player.pSac.dims.extraTime) * 10 * getEC12Mult()) : "") + " left until matter reset)"
		element2.innerHTML = txt
	}
	var element3 = el("chall13Mult");
	if (isADSCRunning()) {
		var mult = getProductBoughtMult()
		element3.innerHTML = formatValue(player.options.notation, productAllTotalBought(), 2, 1) + 'x multiplier on all dimensions (product of '+(player.tickspeedBoosts != undefined&&(inNC(13)||player.currentChallenge=="postc1")?"1+log10(amount)":"bought")+(mult==1?"":"*"+shorten(mult))+').'
	}
	if (inNC(14) && aarMod.ngmX > 3) el("c14Resets").textContent = "You have "+getFullExpansion(10-getTotalResets())+" resets left."
	if (player.pSac !== undefined) el("ec12Mult").textContent = "Time speed: 1 / " + shorten(getEC12Mult()) + "x"
}

function updateCoinPerSec() {
	var element = el("coinsPerSec");
	var ret = getDimensionProductionPerSecond(1)
	if (player.pSac !== undefined) ret = ret.div(getEC12Mult())
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
	return nA(infGain, hasAch("r87") && player.galacticSacrifice ? 249 : 0)
}

function getEternitied() {
	let banked = player.eternitiesBank
	let total = player.eternities
	if (banked && (inQC(0) || hasNU(10))) total = nA(total, player.eternitiesBank)
	return total
}

var worstChallengeTime = 1
var worstChallengeBonus = 1

function updateWorstChallengeTime() {
	worstChallengeTime = 1
	for (var i = 0; i < getTotalNormalChallenges(); i++) worstChallengeTime = Math.max(worstChallengeTime, player.challengeTimes[i])
}

function updateWorstChallengeBonus() {
	updateWorstChallengeTime()
	var exp = player.galacticSacrifice ? 2 : 1
	var timeeff = Math.max(33e-6, worstChallengeTime * 0.1)
	var base = aarMod.ngmX >= 4 ? 3e4 : 3e3
	var eff = Decimal.max(Math.pow(base / timeeff, exp), 1)
	if (aarMod.ngmX >= 4) eff = eff.times(E_pow(eff.plus(10).log10(), 5)) 
	worstChallengeBonus = eff
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
		if (player.challenges.includes("postc1")) if (player.challenges[i].split("postc")[1]) infDimPow*=player.galacticSacrifice?2:1.3
	}
	
	var challengeRunning
	if (player.currentChallenge === "") {
		if (!player.challenges.includes("challenge1")) challengeRunning="challenge1"
	} else challengeRunning=player.currentChallenge
	if (challengeRunning!==undefined) {
		el(challengeRunning).className = "onchallengebtn";
		el(challengeRunning).textContent = "Running"
	}

	if (aarMod.ngmX>3) {
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

	if (player.postChallUnlocked > 0 || Object.keys(player.eternityChalls).length > 0 || player.eternityChallUnlocked !== 0) el("challTabButtons").style.display = "table"
	for (c=0;c<order.length;c++) el(order[c]).parentElement.parentElement.style.display=player.postChallUnlocked<c+1?"none":""
}

function getNextAt(chall) {
	var ret = nextAt[chall]
	if (player.galacticSacrifice) {
		var retNGMM = nextAt[chall+"_ngmm"]
		if (retNGMM) ret = retNGMM
	}
	if (player.tickspeedBoosts != undefined) {
		var retNGM3 = nextAt[chall+"_ngm3"]
		if (retNGM3) ret = retNGM3
	}
	if (aarMod.ngmX >= 4){
		var retNGM4 = nextAt[chall+"_ngm4"]
		if (retNGM4) ret = retNGM4
	}
	return ret
}

function getGoal(chall) {
	var ret = goals[chall]
	if (player.galacticSacrifice) {
		var retNGMM = goals[chall+"_ngmm"]
		if (retNGMM) ret = retNGMM
	}
	if (player.tickspeedBoosts != undefined) {
		var retNGM3 = goals[chall+"_ngm3"]
		if (retNGM3) ret = retNGM3
	}
	if (aarMod.ngmX >= 4){
		var retNGM4 = goals[chall+"_ngm4"]
		if (retNGM4) ret = retNGM4
	}
	return ret
}

function checkICID(name) {
	if (player.galacticSacrifice) {
		var split=name.split("postcngm3_")
		if (split[1]!=undefined) return parseInt(split[1])+2
		var split=name.split("postcngmm_")
		if (split[1]!=undefined) {
			var num=parseInt(split[1])
			if (player.tickspeedBoosts != undefined&&num>2) return 5
			return num
		}
		var split=name.split("postc")
		if (split[1]!=undefined) {
			var num=parseInt(split[1])
			var offset=player.tickspeedBoosts == undefined?3:5
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
	if (player.currentChallenge !== 'challenge14' || aarMod.ngmX !== 2) buyMaxTickSpeed()
	for (var tier=1; tier<9;tier++) buyBulkDimension(tier, 1/0)
	if (aarMod.ngmX>3) buyMaxTimeDimensions()
	if (player.pSac!=undefined) maxAllIDswithAM()
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
	if (player.galacticSacrifice && player.galacticSacrifice.upgrades.includes(53)) ret += Math.pow(1.25, -15e4 / player.galacticSacrifice.galaxyPoints.log10())
	return ret
}
function canBuyIPMult() {
	if (player.infinityUpgradesRespecced!=undefined) return player.infinityPoints.gte(player.infMultCost)
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
	if (player.galacticSacrifice !== undefined) return E_pow(50,bought).times(500)
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
	buyInfinityUpgrade("bulkBoost",player.tickspeedBoosts != undefined ? 2e4 : player.galacticSacrifice?5e6:5e9);
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

function toggleProductionTab() {
	// 0 == visible, 1 == not visible
	aarMod.hideProductionTab=!aarMod.hideProductionTab
	el("hideProductionTab").textContent = (aarMod.hideProductionTab?"Show":"Hide")+" production tab"
	if (el("production").style.display == "block") showDimTab("antimatterdimensions")
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
	if (player.galacticSacrifice !== undefined && player.galacticSacrifice.upgrades.includes(51)) ret = ret.times(galMults.u51())
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

function showHideFooter(toggle) {
	if (toggle) aarMod.noFooter = !aarMod.noFooter
	el("footerBtn").textContent = (aarMod.noFooter ? "Show" : "Hide") + " footer"
	document.documentElement.style.setProperty('--footer', aarMod.noFooter ? "none" : "")
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
	if (player.challenges.includes("postc2") || (player.tickspeedBoosts != undefined && player.currentChallenge == "postc2")) {
		pow = 0.01
		if (player.timestudy.studies.includes(228)) pow = 0.013
		else if (hasAch("r97") && player.boughtDims) pow = 0.012
		else if (hasAch("r88")) pow = 0.011
		ret = player.firstAmount.div(player.sacrificed.max(1)).pow(pow).max(1)
	} else if (!inNC(11)) {
		pow = 2
		if (hasAch("r32")) pow += player.tickspeedBoosts != undefined ? 2 : 0.2
		if (hasAch("r57")) pow += player.boughtDims ? 0.3 : 0.2 //this upgrade was too OP lol
		if (player.infinityUpgradesRespecced) pow *= getInfUpgPow(5)
		ret = E_pow(Math.max(player.firstAmount.e/10.0, 1) / Math.max(player.sacrificed.e/10.0, 1), pow).max(1)
	} else ret = player.firstAmount.pow(0.05).dividedBy(player.sacrificed.pow(aarMod.ngmX>3?0.05:0.04).max(1)).max(1)
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
	if (player.challenges.includes("postc2") || (player.tickspeedBoosts != undefined && player.currentChallenge == "postc2")) {
		pow = 0.01
		if (player.timestudy.studies.includes(228)) pow = 0.013
		else if (hasAch("r97") && player.boughtDims) pow = 0.012
		else if (hasAch("r88")) pow = 0.011
		ret = player.sacrificed.pow(pow).max(1)
	} else if (!inNC(11)) {
		pow = 2
		if (hasAch("r32")) pow += player.tickspeedBoosts != undefined ? 2 : 0.2
		if (hasAch("r57")) pow += player.boughtDims ? 0.3 : 0.2 //this upgrade was too OP lol
		if (player.infinityUpgradesRespecced) pow *= getInfUpgPow(5)
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
	var maxPower = player.galacticSacrifice ? "1e8888" : Number.MAX_VALUE
	if (inNC(11) && (tmp.sacPow.gte(maxPower) || player.chall11Pow.gte(maxPower))) return false
	if (!auto) floatText("D8", "x" + shortenMoney(sacGain))
	player.sacrificed = player.sacrificed.plus(player.firstAmount);
	if (!inNC(11)) {
		if ((inNC(7) || player.currentChallenge == "postcngm3_3" || player.pSac !== undefined) && !hasAch("r118")) clearDimensions(6);
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
    	if (player.infinityUpgradesRespecced) autoBuyerDimBoost.bulkBought = false
    	autoBuyerGalaxy.interval = player.galacticSacrifice ? 6e4 : 1.5e4
    	if (player.infinityUpgradesRespecced) autoBuyerGalaxy.bulkBought = false
    	autoBuyerTickspeed.interval = 5000
    	autoBuyerInf.interval = player.galacticSacrifice ? 6e4 : 3e5
   	if (player.boughtDims) {
        	autoBuyerInf.requireMaxReplicanti = false
        	autoBuyerInf.requireIPPeak = false
    	}

    	autoSacrifice.interval = player.galacticSacrifice ? 1.5e4 : player.infinityUpgradesRespecced ? 3500 : 100
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
	
    	if (player.galacticSacrifice) {
        	var autoGalSacrifice = new Autobuyer(14)
        	autoGalSacrifice.interval = 1.5e4
        	autoGalSacrifice.priority = 5
    	}
	
    	if (player.tickspeedBoosts != undefined) {
        	var autoTickspeedBoost = new Autobuyer(15)
        	autoTickspeedBoost.interval = 1.5e4
        	autoTickspeedBoost.priority = 5
    	}
	if (aarMod.ngmX > 3) {
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
	if (player.galacticSacrifice) el("intervalGalSac").textContent = "Current interval: " + (player.autobuyers[12].interval * intervalUnits).toFixed(2) + " seconds"
	if (player.tickspeedBoosts != undefined) el("intervalTickspeedBoost").textContent = "Current interval: " + (player.autobuyers[13].interval * intervalUnits).toFixed(2) + " seconds"
	if (aarMod.ngmX>3) el("intervalTDBoost").textContent = "Current interval: " + (player.autobuyers[14].interval * intervalUnits).toFixed(2) + " seconds"

    	var maxedAutobuy = 0;
    	var e100autobuy = 0;
    	var currencyEnd = aarMod.ngmX > 3 ? " GP" : " IP"
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
        	if (player.galacticSacrifice || player.infinityUpgradesRespecced) maxedAutobuy++;
    	}
    	if (player.galacticSacrifice) if (player.autobuyers[12].interval <= 100) {
        	el("buyerBtnGalSac").style.display = "none"
        	maxedAutobuy++;
    	}
    	if (player.tickspeedBoosts != undefined) if (player.autobuyers[13].interval <= 100) {
        	el("buyerBtnTickspeedBoost").style.display = "none"
        	maxedAutobuy++;
    	}
    	if (aarMod.ngmX > 3) if (player.autobuyers[14].interval <= 100) {
        	el("buyerBtnTDBoost").style.display = "none"
        	maxedAutobuy++;
    	}

    	el("buyerBtnTickSpeed").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[8].cost + currencyEnd
	el("buyerBtnDimBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[9].cost + currencyEnd
    	el("buyerBtnGalaxies").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[10].cost + currencyEnd
    	el("buyerBtnInf").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[11].cost + " IP"
    	el("buyerBtnSac").innerHTML = "40% smaller interval <br>Cost: " + player.autoSacrifice.cost + currencyEnd
    	if (player.autobuyers[9].interval <= 100) {
        	if (player.infinityUpgradesRespecced && !player.autobuyers[9].bulkBought) el("buyerBtnDimBoost").innerHTML = "Buy bulk feature<br>Cost: "+shortenCosts(1e4)+currencyEnd
        	else el("buyerBtnDimBoost").style.display = "none"
        	maxedAutobuy++;
	}
    	if (player.autobuyers[10].interval <= 100) {
        	if (player.infinityUpgradesRespecced && !player.autobuyers[10].bulkBought) el("buyerBtnGalaxies").innerHTML = "Buy bulk feature<br>Cost: "+shortenCosts(1e4)+currencyEnd
        	else el("buyerBtnGalaxies").style.display = "none"
        	maxedAutobuy++;
    	}
    	if (player.galacticSacrifice) el("buyerBtnGalSac").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[12].cost + currencyEnd
	if (player.tickspeedBoosts != undefined) el("buyerBtnTickspeedBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[13].cost + currencyEnd
	if (aarMod.ngmX > 3) el("buyerBtnTDBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[14].cost + currencyEnd

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
    	if (player.galacticSacrifice) {
        	if (player.autobuyers[12]%1 !== 0) el("autoBuyerGalSac").style.display = "inline-block"
        	player.autobuyers[12].isOn = el("14ison").checked
    	}
    	if (player.tickspeedBoosts!=undefined) {
        	if (player.autobuyers[13]%1 !== 0) el("autoBuyerTickspeedBoost").style.display = "inline-block"
        	player.autobuyers[13].isOn = el("15ison").checked
    	}
    	if (aarMod.ngmX>3) {
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
	if (player.galacticSacrifice) {
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
		if (player.tickspeedBoosts != undefined) html += ", B for tickspeed boost"
		if (aarMod.ngmX >= 4) html += ", N for time dimension boost"
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

var challNames = [null, null, "Second Dimension Autobuyer Challenge", "Third Dimension Autobuyer Challenge", "Fourth Dimension Autobuyer Challenge", "Fifth Dimension Autobuyer Challenge", "Sixth Dimension Autobuyer Challenge", "Seventh Dimension Autobuyer Challenge", "Eighth Dimension Autobuyer Challenge", "Tickspeed Autobuyer Challenge", "Automated Dimension Boosts Challenge", "Automated Galaxies Challenge", "Automated Big Crunches Challenge", "Automated Dimensional Sacrifice Challenge", "Automated Galactic Sacrifice Challenge", "Automated Tickspeed Boosts Challenge", "Automated Time Dimension Boosts Challenge"]
var challOrder = [null, 1, 2, 3, 8, 6, 10, 9, 11, 5, 4, 12, 7, 13, 14, 15, 16]
function updateChallengeTimes() {
	for (c=2;c<17;c++) setAndMaybeShow("challengetime"+c,player.challengeTimes[challOrder[c]-2]<600*60*24*31,'"'+challNames[c]+' time record: "+timeDisplayShort(player.challengeTimes['+(challOrder[c]-2)+'], false, 3)')
	var temp=0
	var tempcounter=0
	for (var i=0;i<player.challengeTimes.length;i++) if (player.challenges.includes("challenge"+(i+2))&&player.challengeTimes[i]<600*60*24*31) {
		temp+=player.challengeTimes[i]
		tempcounter++
	}
	setAndMaybeShow("challengetimesum",tempcounter>1,'"Sum of completed challenge time records is "+timeDisplayShort('+temp+', false, 3)')
	el("challengetimesbtn").style.display = tempcounter>0 ? "inline-block" : "none"

	var temp=0
	var tempcounter=0
	for (var i=0;i<14;i++) {
		setAndMaybeShow("infchallengetime"+(i+1),player.infchallengeTimes[i]<600*60*24*31,'"Infinity Challenge '+(i+1)+' time record: "+timeDisplayShort(player.infchallengeTimes['+i+'], false, 3)')
		if (player.infchallengeTimes[i]<600*60*24*31) {
			temp+=player.infchallengeTimes[i]
			tempcounter++
		}
	}
	setAndMaybeShow("infchallengetimesum",tempcounter>1,'"Sum of completed infinity challenge time records is "+timeDisplayShort('+temp+', false, 3)')
	el("infchallengesbtn").style.display = tempcounter>0 ? "inline-block" : "none"
	updateWorstChallengeBonus();
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
	el("eterchallengesbtn").style.display = tempcounter > 0 ? "inline-block" : "none"
	setAndMaybeShow("eterchallengetimesum",tempcounter>1,'"Sum of completed eternity challenge time records is "+timeDisplayShort('+temp+', false, 3)')
}

var averageEp = E(0)
var bestEp
function updateLastTenEternities() {
	var listed = 0
	var tempTime = E(0)
	var tempEP = E(0)
	for (var i=0; i<10; i++) {
		if (player.lastTenEternities[i][1].gt(0)) {
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

var infchallengeTimes = 999999999

function getLimit() {
	if (player.infinityUpgradesRespecced == undefined || player.currentChallenge != "") return Number.MAX_VALUE
	return E_pow(Number.MAX_VALUE, 1 + player.infinityUpgradesRespecced[3] / 2)
}

function doCrunchReplicantiAutobuy(){
	if (getEternitied() >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8" && isChanceAffordable()) {
		var bought = Math.min(Math.max(Math.floor(player.infinityPoints.div(player.replicanti.chanceCost).log(1e15) + 1), 0), tmp.ngp3&&player.masterystudies.includes("t265")?1/0:100-Math.round(player.replicanti.chance*100))
		player.replicanti.chance = Math.round(player.replicanti.chance*100+bought)/100
		player.replicanti.chanceCost = player.replicanti.chanceCost.times(E_pow(1e15, bought))
	}

	if (getEternitied() >= 60 && player.replicanti.auto[1] && player.currentEternityChall !== "eterc8") {
		while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && isIntervalAffordable()) upgradeReplicantiInterval()
	}

	if (getEternitied() >= 80 && player.replicanti.auto[2] && player.currentEternityChall !== "eterc8") autoBuyRG()
}

function doCrunchIDAutobuy(){
	if (getEternitied() > 10 && player.currentEternityChall !== "eterc8" && player.currentEternityChall !== "eterc2" && player.currentEternityChall !== "eterc10") {
		for (var i = 1; i < getEternitied() - 9 && i < 9; i++) {
			if (player.infDimBuyers[i-1]) {
				buyMaxInfDims(i, true)
				buyManyInfinityDimension(i, true)
			}
		}
	}
}

function doIRCrunchResetStuff(){
	if (player.infinityUpgradesRespecced == undefined) return 
	player.singularity.darkMatter = E(0)
	player.dimtechs.discounts = 0
	if (player.dimtechs.respec) {
		var total = 0
		for (let dim = 1; dim < 9; dim++) total += player.dimtechs["dim" + dim + "Upgrades"]
		total += player.dimtechs.tickUpgrades
		player.infinityPoints = player.infinityPoints.add(E_pow(5, total).sub(1).div(4).round().times(1e95))
		player.dimtechs.tickUpgrades = 0
		for (let dim = 1; dim < 9; dim++) player.dimtechs["dim" + dim + "Upgrades"] = 0
		player.dimtechs.respec = false
	}	
}

function doGPUpgCrunchUpdating(g11MultShown){
	var showg11Mult = player.infinitied > 0 || player.eternities !== 0 || quantumed
	if (player.galacticSacrifice && (showg11Mult != g11MultShown)) {
		el("galaxy11").innerHTML = "Normal" + (aarMod.ngmX > 3 ? " and Time D" : " d")+"imensions are " + (showg11Mult ? "cheaper based on your infinitied stat.<br>Currently: <span id='galspan11'></span>x":"99% cheaper.")+"<br>Cost: 1 GP"
		el("galaxy15").innerHTML = "Normal and Time Dimensions produce " + (showg11Mult ? "faster based on your infinitied stat.<br>Currently: <span id='galspan15'></span>x":"100x faster")+".<br>Cost: 1 GP"
	}
}

function doDefaultTickspeedReduction(){
	if (hasAch("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r66")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r83")) player.tickspeed = player.tickspeed.times(E_pow(0.95, player.galaxies));
}

function doAfterResetCrunchStuff(g11MultShown){
	el("challengeconfirmation").style.display = "inline-block"
	if (!player.options.retryChallenge) player.currentChallenge = ""
	skipResets()
	doIRCrunchResetStuff()
	updateSingularity()
	updateDimTechs()
	if (player.replicanti.unl && !hasAch("r95")) player.replicanti.amount = E(1)
	if (speedrunMilestonesReached < 28 && (tmp.ngp3l || !hasAch("ng3p67"))) player.replicanti.galaxies = (player.timestudy.studies.includes(33)) ? Math.floor(player.replicanti.galaxies / 2) : 0
	player.tdBoosts = resetTDBoosts()
	resetPSac()
	resetTDs()
	reduceDimCosts()
	setInitialDimensionPower();
	doDefaultTickspeedReduction()
	checkSecondSetOnCrunchAchievements()
	updateAutobuyers();
	setInitialMoney()
	resetInfDimensions();
	hideDimensions()
	tmp.tickUpdate = true;
	GPminpeak = E(0)
	IPminpeak = E(0)
	doGPUpgCrunchUpdating(g11MultShown)
	doCrunchIDAutobuy()
	doCrunchReplicantiAutobuy()
	Marathon2 = 0;
	updateChallenges();
	updateNCVisuals()
	updateChallengeTimes()
	updateLastTenRuns()
}

function doCrunchInfinitiesGain(){
	let infGain
	if (player.currentEternityChall == "eterc4") {
		infGain = 1
		if (player.infinitied >= 16 - (ECComps("eterc4")*4)) {
			setTimeout(exitChallenge, 500)
			onChallengeFail()
		}
	} else infGain = getInfinitiedGain()
	player.infinitied = nA(player.infinitied, infGain)
}

var isEmptiness=false
function bigCrunch(autoed) {
	var challNumber
	var split = player.currentChallenge.split("challenge")
	if (split[1] != undefined) challNumber = parseInt(split[1])
	var icID = checkICID(player.currentChallenge)
	if (icID) challNumber = icID
	var crunchStuff = (player.money.gte(Number.MAX_VALUE) && !player.currentChallenge.includes("post")) || (player.currentChallenge !== "" && player.money.gte(player.challengeTarget))
	//crunch stuff is whether we are completing a non NG-(4+) NC/IC
	if (!crunchStuff) {
		updateChallenges()
		updateNCVisuals()
		updateChallengeTimes()
		updateLastTenRuns()
		return
	}
	
	if ((!hasAch("r55") || (player.options.animations.bigCrunch === "always" && !autoed)) && isEmptiness && implosionCheck === 0 && player.options.animations.bigCrunch) {
		implosionCheck = 1;
		el("body").style.animation = "implode 2s 1";
		setTimeout(function(){ el("body").style.animation = ""; }, 2000)
		setTimeout(bigCrunch, 1000)
		return
	}
	implosionCheck = 0;
	checkOnCrunchAchievements()
	if (player.currentChallenge != "" && player.challengeTimes[challNumber-2] > player.thisInfinityTime) player.challengeTimes[challNumber-2] = player.thisInfinityTime
	if (aarMod.ngmX >= 4) if (player.galacticSacrifice.chall) {
		challNumber = player.galacticSacrifice.chall
		if (player.challengeTimes[challNumber-2] > player.thisInfinityTime) player.challengeTimes[challNumber-2] = player.thisInfinityTime
	}
	if (player.currentChallenge.includes("post") && player.infchallengeTimes[challNumber-1] > player.thisInfinityTime) player.infchallengeTimes[challNumber-1] = player.thisInfinityTime
	if (player.currentChallenge == "postc5" && player.thisInfinityTime <= 100) giveAchievement("Hevipelle did nothing wrong")
	if (player.tickspeedBoosts != undefined && player.thisInfinityTime <= 100 && player.currentChallenge == "postc7") giveAchievement("Hevipelle did nothing wrong")
	if (isEmptiness) {
		showTab("dimensions")
		isEmptiness = false
		if (player.eternities > 0 || quantumed) el("eternitystorebtn").style.display = "inline-block"
		if (quantumed) el("quantumtabbtn").style.display = "inline-block"
		if (ghostified) el("ghostifytabbtn").style.display = "inline-block"
	}
	if (player.currentChallenge != "" && !player.challenges.includes(player.currentChallenge)) player.challenges.push(player.currentChallenge);
	if (player.currentChallenge == "postc8") giveAchievement("Anti-antichallenged");
	var add = getIPMult()
	if ((player.break && player.currentChallenge == "") || player.infinityUpgradesRespecced != undefined) add = gainedInfinityPoints()
	else if (player.timestudy.studies.includes(51)) add = add.times(1e15)
	player.infinityPoints = player.infinityPoints.plus(add)
	var array = [player.thisInfinityTime, add]
	if (player.currentChallenge != "") array.push(player.currentChallenge)
	addTime(array)
	checkYoDawg()

	if (autoS && auto) {
		if (gainedInfinityPoints().dividedBy(player.thisInfinityTime).gt(player.autoIP) && !player.break) player.autoIP = gainedInfinityPoints().dividedBy(player.thisInfinityTime);
		if (player.thisInfinityTime<player.autoTime) player.autoTime = player.thisInfinityTime;
	}
	auto = autoS; //only allow autoing if prev crunch was autoed
	autoS = true;
	if (player.tickspeedBoosts != undefined) player.tickspeedBoosts = 0
	var g11MultShown = player.infinitied > 0 || player.eternities !== 0 || quantumed
	doCrunchInfinitiesGain()
	doCrunchResetStuff()
	doAfterResetCrunchStuff(g11MultShown)
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


function eternity(force, auto, presetLoad, dil) {
	var id7unlocked = player.infDimensionsUnlocked[7]
	if (tmp.ngp3) if (brSave.active) id7unlocked = true
	var canEternity = force || (player.infinityPoints.gte(Number.MAX_VALUE) && id7unlocked && (auto || !player.options.eternityconfirm || confirm("Eternity will reset everything except achievements and challenge records. You will also gain an Eternity point and unlock various upgrades.")))
	if (!canEternity) return
	
	if (force) player.currentEternityChall = "";
	if (player.currentEternityChall !== "" && player.infinityPoints.lt(player.eternityChallGoal)) return false
	if (player.thisEternity < player.bestEternity && !force) player.bestEternity = player.thisEternity
	if (player.thisEternity < 2) giveAchievement("Eternities are the new infinity")
	if (player.currentEternityChall == "eterc6" && ECComps("eterc6") < 5 && player.dimensionMultDecrease < 4) player.dimensionMultDecrease = Math.max(parseFloat((player.dimensionMultDecrease - 0.2).toFixed(1)),2)
	if (!GUBought("gb4")) if ((player.currentEternityChall == "eterc11" || (player.currentEternityChall == "eterc12" && ghostified)) && ECComps("eterc11") < 5) player.tickSpeedMultDecrease = Math.max(parseFloat((player.tickSpeedMultDecrease - 0.07).toFixed(2)), 1.65)
	if (player.infinitied < 10 && !force && !player.boughtDims) giveAchievement("Do you really need a guide for this?");
	if (Decimal.round(player.replicanti.amount) == 9) giveAchievement("We could afford 9");
	if (player.dimlife && !force) giveAchievement("8 nobody got time for that")
	if (player.dead && !force) giveAchievement("You're already dead.")
	if (player.infinitied <= 1 && !force) giveAchievement("Do I really need to infinity")
	if (gainedEternityPoints().gte("1e600") && player.thisEternity <= 600 && player.dilation.active && !force) giveAchievement("Now you're thinking with dilation!")
	if (ghostified && player.currentEternityChall == "eterc11" && inQC(6) && inQC(8) && inQCModifier("ad") && player.infinityPoints.e >= 15500) giveAchievement("The Deep Challenge")
	if (isEmptiness) {
		showTab("dimensions")
		isEmptiness = false
		if (quantumed) el("quantumtabbtn").style.display = "inline-block"
		if (ghostified) el("ghostifytabbtn").style.display = "inline-block"
	}
	temp = []
	if (gainedEternityPoints().gte(player.eternityPoints) && player.eternityPoints.gte("1e1185") && (tmp.ngp3 ? player.dilation.active && brSave.active : false)) giveAchievement("Gonna go fast")
	var oldEP = player.eternityPoints
	player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints())
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
	var forceRespec = doCheckECCompletionStuff()
	for (var i = 0; i < player.challenges.length; i++) {
		if (!player.challenges[i].includes("post") && getEternitied() > 1) temp.push(player.challenges[i])
	}
	player.challenges = temp
	player.infinitiedBank = nA(player.infinitiedBank, gainBankedInf())

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

	var oldStat = getEternitied()
	player.eternities = nA(player.eternities, gainEternitiedStat())
	updateBankedEter()
	if (player.tickspeedBoosts != undefined) player.tickspeedBoosts = 0
	player.infinityPoints = E(hasAch("r104") ? 2e25 : 0);

	doEternityResetStuff()

	player.dilation.active = dil
	if (player.galacticSacrifice && getEternitied() < 2) player.autobuyers[12] = 13
	if (player.tickspeedBoosts != undefined && getEternitied() < 2) player.autobuyers[13] = 14

	if (player.respec || player.respecMastery || forceRespec) respecTimeStudies(forceRespec, presetLoad)
	if (typeof(presetLoad) == "string") importStudyTree(presetLoad)
	if (player.respec) respecToggle()
	if (player.respecMastery) respecMasteryToggle()
	giveAchievement("Time is relative")
	if (player.replicanti.unl && speedrunMilestonesReached < 22) player.replicanti.amount = E(1)
	player.replicanti.galaxies = 0
	extraReplGalaxies = 0
	if (dilated || tmp.ngp3l || !hasAch("ng3p67")) resetReplicantiUpgrades()
	player.tdBoosts = resetTDBoosts()
	resetPSac()
	resetTDs()
	reduceDimCosts()
	setInitialDimensionPower()
	if (hasAch("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	var autobuyers = document.getElementsByClassName('autoBuyerDiv')
	if (getEternitied() < 2) {
		for (var i = 0; i < autobuyers.length; i++) autobuyers.item(i).style.display = "none"
		el("buyerBtnDimBoost").style.display = "inline-block"
		el("buyerBtnGalaxies").style.display = "inline-block"
		el("buyerBtnInf").style.display = "inline-block"
		el("buyerBtnTickSpeed").style.display = "inline-block"
		el("buyerBtnSac").style.display = "inline-block"
	}
	updateAutobuyers();
	setInitialMoney()
	if (hasAch("r85")) player.infMult = player.infMult.times(4);
	if (hasAch("r93")) player.infMult = player.infMult.times(4);
	resetInfDimensions();
	updateChallenges();
	updateNCVisuals()
	updateEterChallengeTimes()
	updateLastTenRuns()
	updateLastTenEternities()
	if (!hasAch("r133")) {
		var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
		for (var i = 0; i < 8; i++) infchalls[i].style.display = "none"
	}
	GPminpeak = E(0)
	IPminpeak = E(0)
	EPminpeakType = 'normal'
	EPminpeak = E(0)
	updateMilestones()
	resetTimeDimensions()
	el("eternityconf").style.display = "inline-block"
	if (getEternitied() < 20) {
		player.autobuyers[9].bulk = 1
		el("bulkDimboost").value = player.autobuyers[9].bulk
	}
	if (getEternitied() < 50) {
		el("replicantidiv").style.display = "none"
		el("replicantiunlock").style.display = "inline-block"
	} else if (el("replicantidiv").style.display === "none" && getEternitied() >= 50) {
		el("replicantidiv").style.display = "inline-block"
		el("replicantiunlock").style.display = "none"
	}
	if (getEternitied() > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false
	var IPshortened = shortenDimensions(player.infinityPoints)
	el("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + IPshortened + "</span> Infinity points."
	el("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + IPshortened + "</span> Infinity points."
	if (getEternitied() > 0 && oldStat < 1) {
		el("infmultbuyer").style.display = "inline-block"
		el("infmultbuyer").textContent = "Autobuy IP mult O" + (player.infMultBuyer ? "N" : "FF")
	}
	hideMaxIDButton()
	el("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
	el("eternityPoints2").style.display = "inline-block"
	el("eternitystorebtn").style.display = "inline-block"
	updateEternityUpgrades()
	el("totaltickgained").textContent = "You've gained "+getFullExpansion(player.totalTickGained)+" tickspeed upgrades."
	hideDimensions()
	tmp.tickUpdate = true;
	playerInfinityUpgradesOnEternity()
	el("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	updateEternityChallenges()
	if (player.eternities <= 1) {
		showTab("dimensions")
		showDimTab("timedimensions")
		loadAutoBuyerSettings()
	}
	Marathon2 = 0;
	doAutoEterTick()
	resetUP()
	if (tmp.ngp3 && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 1e9) player.dbPower = E(1)
	if (tmp.ngp3 && quantumed) updateColorCharge()
	if (tmp.ngp3) updateBreakEternity()
}

function resetReplicantiUpgrades() {
	let keepPartial = tmp.ngp3 && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 2e10
	player.replicanti.chance = keepPartial ? Math.min(player.replicanti.chance, 1) : 0.01
	player.replicanti.interval = keepPartial ? Math.max(player.replicanti.interval, player.timestudy.studies.includes(22) ? 1 : 50) : 1000
	player.replicanti.gal = 0
	player.replicanti.chanceCost = E_pow(1e15, player.replicanti.chance * 100).times((player.galacticSacrifice !== undefined && player.tickspeedBoosts == undefined) ? 1e75 : 1e135)
	player.replicanti.intervalCost = E_pow(1e10, Math.round(Math.log10(1000 / player.replicanti.interval) / -Math.log10(0.9))).times((player.galacticSacrifice !== undefined && player.tickspeedBoosts == undefined) ? 1e80 : player.boughtDims ? 1e150 : 1e140)
	player.replicanti.galCost = E((player.galacticSacrifice !== undefined && player.tickspeedBoosts == undefined) ? 1e110 : 1e170)	
}

function challengesCompletedOnEternity(bigRip) {
	var array = []
	if (getEternitied() > 1 || bigRip || hasAch("ng3p51")) for (i = 1; i < (player.galacticSacrifice ? 15 : 13); i++) array.push("challenge" + i)
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
	if (aarMod.ngmX > 3 && player.galacticSacrifice.chall) {
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
	if (player.galacticSacrifice != undefined) {
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
	let m2 = player.galacticSacrifice !== undefined
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
	var oldStat = getEternitied()
	player.eternities = nA(player.eternities, gainEternitiedStat())
	updateBankedEter()
	if (player.tickspeedBoosts != undefined) player.tickspeedBoosts = 0
	if (hasAch("r104")) player.infinityPoints = E(2e25);
	else player.infinityPoints = E(0);
	
	doEternityResetStuff()

	player.eternityChallGoal =  getECGoal("eterc" + n)
	player.currentEternityChall =  "eterc" + n
	player.galacticSacrifice = resetGalacticSacrifice(true)
		
	if (player.galacticSacrifice && getEternitied() < 2) player.autobuyers[12] = 13
	if (player.tickspeedBoosts != undefined && getEternitied() < 2) player.autobuyers[13] = 14
	if (player.dilation.active) {
		player.dilation.active = false
		if (tmp.ngp3 && quantumed) updateColorCharge()
	}
	if (player.replicanti.unl && speedrunMilestonesReached < 22) player.replicanti.amount = E(1)
	extraReplGalaxies = 0
	resetReplicantiUpgrades()
	player.tdBoosts = resetTDBoosts()
	resetPSac()
	resetTDs()
	reduceDimCosts()
	setInitialDimensionPower()
	if (hasAch("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (hasAch("r45")) player.tickspeed = player.tickspeed.times(0.98);
	var autobuyers = document.getElementsByClassName('autoBuyerDiv')
	if (getEternitied() < 2) {
		for (var i = 0; i < autobuyers.length; i++) autobuyers.item(i).style.display = "none"
		el("buyerBtnDimBoost").style.display = "inline-block"
		el("buyerBtnGalaxies").style.display = "inline-block"
		el("buyerBtnInf").style.display = "inline-block"
		el("buyerBtnTickSpeed").style.display = "inline-block"
		el("buyerBtnSac").style.display = "inline-block"
	}
	updateAutobuyers()
	setInitialMoney()
	if (hasAch("r85")) player.infMult = player.infMult.times(4);
	if (hasAch("r93")) player.infMult = player.infMult.times(4);
	if (hasAch("r104")) player.infinityPoints = E(2e25);
	resetInfDimensions();
	updateChallenges();
	updateNCVisuals()
	updateLastTenRuns()
	updateLastTenEternities()
	if (!hasAch("r133")) {
		var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
		for (var i = 0; i < infchalls.length; i++) infchalls[i].style.display = "none"
	}
	GPminpeak = E(0)
	IPminpeak = E(0)
	EPminpeakType = 'normal'
	EPminpeak = E(0)
	updateMilestones()
	resetTimeDimensions()
	if (getEternitied() < 20) player.autobuyers[9].bulk = 1
	if (getEternitied() < 20) el("bulkDimboost").value = player.autobuyers[9].bulk
	if (getEternitied() < 50) {
		el("replicantidiv").style.display="none"
		el("replicantiunlock").style.display="inline-block"
	}
	if (getEternitied() > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false
	el("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
	el("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
	if (getEternitied() > 0 && oldStat < 1) {
		el("infmultbuyer").style.display = "inline-block"
		el("infmultbuyer").textContent = "Autobuy IP mult O" + (player.infMultBuyer?"N":"FF")
	}
	hideMaxIDButton()
	el("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
	el("eternityPoints2").style.display = "inline-block"
	el("eternitystorebtn").style.display = "inline-block"
	updateEternityUpgrades()
	el("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
	hideDimensions()
	tmp.tickUpdate = true;
	playerInfinityUpgradesOnEternity()
	el("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">" + shortenDimensions(player.eternityPoints) + "</span> Eternity point" + ((player.eternityPoints.eq(1)) ? "." : "s.")
	updateEternityChallenges()
	Marathon2 = 0
	doAutoEterTick()
	resetUP()
	if (tmp.ngp3 && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 1e9) player.dbPower = getDimensionBoostPower()
}

function getEC12Mult() {
	let r = 1e3
	let p14 = hasPU(14, true)
	if (p14) r /= puMults[14](p14)
	return r
}

function quickReset() {
	if (inQC(6)) return
	if (inNC(14)) if (player.tickBoughtThisInf.pastResets.length < 1) return
	if (player.resets > 0 && !(player.galacticSacrifice && inNC(5))) player.resets--
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
	softReset(0)
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

function runIDBuyersTick(){
	if (getEternitied() > 10 && player.currentEternityChall !== "eterc8") {
		for (var i=1;i<getEternitied()-9 && i < 9; i++) {
			if (player.infDimBuyers[i-1]) {
				buyMaxInfDims(i, true)
				buyManyInfinityDimension(i, true)
			}
		}
	}
}

function crunchAnimationBtn(){
	if (player.infinitied !== 0 || getEternitied() !== 0 || quantumed) el("bigCrunchAnimBtn").style.display = "inline-block"
	else el("bigCrunchAnimBtn").style.display = "none"
}

function TPAnimationBtn(){
	if (!player.dilation.tachyonParticles.eq(0) || quantumed) el("tachyonParticleAnimBtn").style.display = "inline-block"
	else el("tachyonParticleAnimBtn").style.display = "none"
}

function replicantiShopABRun(){
	if (getEternitied() >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8" && isChanceAffordable()) {
		var chance = Math.round(player.replicanti.chance * 100)
		var maxCost = (tmp.ngp3 ? player.masterystudies.includes("t265") : false) ? 1 / 0 : E("1e1620").div(aarMod.ngmX == 2 ? 1e60 : 1);
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
		$.notify("You became a ghost in at most "+getFullExpansion(tmp.bm[notifyId2])+" quantumed stat! "+(["You now start with all Speedrun Milestones and all "+shorten(Number.MAX_VALUE)+" QK assignation features unlocked, all Paired Challenges completed, all Big Rip upgrades bought, Nanofield is 2x faster until you reach 16 rewards, and you get quarks based on your best MA this quantum", "From now on, colored quarks do not cancel, you keep your gluon upgrades, you can quick Big Rip, and completing an Eternity Challenge doesn't respec your Time Studies.", "You now keep your Electron upgrades", "From now on, Quantum doesn't reset your Tachyon particles unless you are in a QC, unstabilizing quarks doesn't lose your colored quarks, and you start with 5 of 1st upgrades of each Tree Branch", "From now on, Quantum doesn't reset your Meta-Dimension Boosts unless you are in a QC or undoing Big Rip", "From now on, Quantum doesn't reset your normal duplicants unless you are in a QC or undoing Big Rip", "You now start with 10 worker duplicants and Ghostify now doesn't reset Neutrinos.", "You are now gaining ^0.5 amount of quarks, ^0.5 amount of gluons, and 1% of Space Shards gained on Quantum per second.", "You now start with 10 Emperor Dimensions of each tier up to the second tier"+(aarMod.ngudpV?", and from now on, start Big Rips with the 3rd row of Eternity Upgrades":""), "You now start with 10 Emperor Dimensions of each tier up to the fourth tier", "You now start with 10 Emperor Dimensions of each tier up to the sixth tier, and the IP multiplier no longer costs IP", "You now start with 10 of each Emperor Dimension", "You now start with 16 Nanofield rewards", "You now start with "+shortenCosts(1e25)+" quark spins, and Branches are faster based on your spins", "You now start with Break Eternity unlocked and all Break Eternity upgrades bought and generate 1% of Eternal Matter gained on Eternity per second", "From now on, you gain 1% of quarks you will gain per second and you keep your Tachyon particles on Quantum and Ghostify outside of Big Rip."])[notifyId2]+".","success")
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

function inEasierMode() {
	return aarMod.newGameMult || aarMod.newGameExpVersion || aarMod.ngudpV || aarMod.ngumuV || aarMod.nguepV || aarMod.aau
}

function doBreakEternityUnlockStuff(){
	beSave.unlocked = true
	$.notify("Congratulations! You have unlocked Break Eternity!", "success")
	updateBreakEternity()
}

function doGhostifyUnlockStuff(){
	ghSave.reached = true
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "You are finally able to complete PC6+8 in Big Rip! However, because of the unstability of this universe, the only way to go further is to fundament. This allows to unlock new stuff in exchange for everything that you have."
}

function doReachAMGoalStuff(chall){
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "You reached the antimatter goal (" + shorten(pow10(getQCGoal())) + "), but you didn't reach the meta-antimatter goal yet! Get " + shorten(getQuantumReq()) + " meta-antimatter" + (brSave.active ? " and then you can fundament!" : " and then go Quantum to complete your challenge!")
	quSave.nonMAGoalReached.push(chall)
}

function doQuantumUnlockStuff(){
	quSave.reached = true
	if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
	else aarMod.popUpId = ""
	el("welcomeMessage").innerHTML = "Congratulations! You reached " + shorten(getQuantumReq()) + " MA and completed EC14 for the first time! This allows you to go Quantum (the 5th layer), giving you a quark in exchange for everything up to this point, which can be used to get more powerful upgrades. This allows you to get gigantic numbers!"
}

function doNGP3UnlockStuff(){
	var chall = tmp.inQCs
	if (chall.length < 2) chall = chall[0]
	else if (chall[0] > chall[1]) chall = chall[1] * 10 + chall[0]
	else chall = chall[0] * 10 + chall[1]
	if (!quSave.reached && isQuantumReached()) doQuantumUnlockStuff()
	let MAbool = player.meta.bestAntimatter.lt(getQuantumReq())
	let DONEbool = !quSave.nonMAGoalReached.includes(chall)
	let TIMEbool = quSave.time > 10
	if (chall && player.money.gt(pow10(getQCGoal())) && MAbool && DONEbool && TIMEbool) {
		doReachAMGoalStuff(chall)
	}
	if (!ghSave.reached && brSave.active) if (brSave.bestThisRun.gte(pow10(getQCGoal(undefined, true)))) {
		doGhostifyUnlockStuff()
	}
	var inEasierModeCheck = !inEasierMode()
	if (player.masterystudies && (player.masterystudies.includes("d14")||hasAch("ng3p51")) && !metaSave.ngp4 && !inEasierModeCheck) doNGP4UnlockStuff()
	if (player.eternityPoints.gte("1e1200") && brSave.active && !beSave.unlocked) doBreakEternityUnlockStuff()
	if (player.money.gte(pow10(4.7e9)) && brSave.active && !ghSave.ghostlyPhotons.unl) doPhotonsUnlockStuff()
	if (canUnlockBosonicLab() && !ghSave.wzb.unl) doBosonsUnlockStuff()
	if (!tmp.ng3l) unlockHiggs()
}

function updateResetTierButtons(){
	var postBreak = getEternitied()!=0||(player.infinityPoints.gte(Number.MAX_VALUE)&&player.infDimensionsUnlocked[7])||player.break
	var preQuantumEnd = quantumed
	var canBigRip = canQuickBigRip()
	
	if (!preQuantumEnd && player.meta !== undefined) preQuantumEnd = isQuantumReached()
	var haveBlock = (player.galacticSacrifice!=undefined&&postBreak)||(player.pSac!=undefined&&player.infinitied>0)||preQuantumEnd
	var haveBlock2 = player.pSac!==undefined&&(ghostified||hasAch("ng3p51")||canBigRip)

	if (player.pSac!==undefined) {
		el("px").className = haveBlock2?"PX":postBreak?"GHP":player.infinitied>0?"QK":"IP"
	}
	el("px").style.display=pSacrificed()?"":"none"
	el("pSacPos").className = haveBlock2?"pSacPos":postBreak?"ghostifyPos":player.infinitied>0?"quantumpos":"infpos"

	if (player.galacticSacrifice===undefined?false:(postBreak||player.infinitied>0||player.galacticSacrifice.times>0)&&!isEmptiness) {
		el("galaxyPoints2").style.display = ""
		el("galaxyPoints2").className = preQuantumEnd?"GP":postBreak?"QK":"EP"
	} else el("galaxyPoints2").style.display = "none"
	el("sacpos").className = preQuantumEnd?"sacpos":postBreak?"quantumpos":"eterpos"

	el("bigcrunch").parentElement.style.top = haveBlock2 ? "259px" : haveBlock ? "139px" : "19px"
	el("quantumBlock").style.display = haveBlock ? "" : "none"
	el("quantumBlock").style.height = haveBlock2 ? "240px" : "120px"

	var showQuantumBtn = false
	var bigRipped = false
	if (player.meta !== undefined && isQuantumReached()) showQuantumBtn = true
	if (tmp.ngp3 && brSave.active) bigRipped = true
	el("quantumbtn").className = bigRipped ? "bigripbtn" : "quantumbtn"
	el("quantumbtn").style.display = showQuantumBtn || bigRipped ? "" : "none"
	el("bigripbtn").style.display = canBigRip ? "" : "none"

	el("ghostparticles").style.display = ghostified ? "" : "none"
	if (ghostified) {
		el("GHPAmount").textContent = shortenDimensions(ghSave.ghostParticles)
		var showQuantumed = ghSave.times > 0 && ghSave.milestones < 16
		el("quantumedBM").style.display = showQuantumed ? "" : "none"
		if (showQuantumed) el("quantumedBMAmount").textContent = getFullExpansion(quSave.times)
	}
	el("ghostifybtn").style.display = showQuantumBtn && bigRipped ? "" : "none"
}

function updateOrderGoals(){
	if (order) for (var i=0; i<order.length; i++) el(order[i]+"goal").textContent = "Goal: "+shortenCosts(getGoal(order[i]))
}

function updateReplicantiGalaxyToggels(){
	if (player.replicanti.galaxybuyer === undefined || player.boughtDims) el("replicantiresettoggle").style.display = "none"
	else el("replicantiresettoggle").style.display = "inline-block"
}

function givePerSecondNeuts(){
	if (!hasAch("ng3p75") || tmp.ngp3l) return
	var mult = 1 //in case you want to buff in the future
	var n = getNeutrinoGain().times(mult)
	ghSave.neutrinos.electron = ghSave.neutrinos.electron.plus(n)
	ghSave.neutrinos.mu       = ghSave.neutrinos.mu.plus(n)
	ghSave.neutrinos.tau      = ghSave.neutrinos.tau.plus(n)
}

function doPerSecondNGP3Stuff(){
	if (!tmp.ngp3) return

	//Post-NG+3
	doPostNGP3UnlockStuff()

	//NG+3
	if (quSave.autoECN !== undefined) {
		justImported = true
		if (quSave.autoECN > 12) buyMasteryStudy("ec", quSave.autoECN,true)
		else el("ec" + quSave.autoECN + "unl").onclick()
		justImported = false
	}
	if (isAutoGhostActive(14)) maxBuyBEEPMult()
	if (isAutoGhostActive(4) && ghSave.automatorGhosts[4].mode=="t") rotateAutoUnstable()
	if (isAutoGhostActive(10)) maxBuyLimit()
	if (isAutoGhostActive(9) && quSave.replicants.quantumFood > 0) {
		for (d = 1;d < 9; d++) if (canFeedReplicant(d) && (d == quSave.replicants.limitDim || (!EDsave[d + 1].perm && EDsave[d].workers.lt(11)))) {
			feedReplicant(d, true);
			break;
		} 
	}
	if (isAutoGhostActive(8)) buyMaxQuantumFood()
	if (isAutoGhostActive(7)) maxQuarkMult()
	doNGP3UnlockStuff()
	notifyGhostifyMilestones()
	if (quSave.autoOptions.assignQK && ghSave.milestones > 7) assignAll(true) 

	if (hasAch("ng3p43")) if (ghSave.milestones >= 8) maxUpgradeColorDimPower()
	givePerSecondNeuts()
}

function checkGluonRounding(){
	if (!tmp.ngp3) return
	if (ghSave.milestones > 7 || !quantumed) return
	if (quSave.gluons.rg.lt(101)) quSave.gluons.rg = quSave.gluons.rg.round()
	if (quSave.gluons.gb.lt(101)) quSave.gluons.gb = quSave.gluons.gb.round()
	if (quSave.gluons.br.lt(101)) quSave.gluons.br = quSave.gluons.br.round()
	if (quSave.quarks.lt(101)) quSave.quarks = quSave.quarks.round()
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
	updateReplicantiGalaxyToggels()
	ABTypeDisplay()
	dimboostABTypeDisplay()
	IDABDisplayCorrection()
	replicantiShopABDisplay()
	replicantiShopABRun()
	runIDBuyersTick()
	doAutoEterTick()
	dilationStuffABTick()
	updateNGpp17Reward()
	updateNGpp16Reward()

	// Button Displays
	infPoints2Display()
	eterPoints2Display()
	updateResetTierButtons()
	eternityBtnDisplayType()
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
	updateChallTabDisplay()
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
setInterval(updatePerSecond, 1000)

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
	var haveET=haveExtraTime()
	var pxGain
	if (haveET) {
		//Matter
		if (player.matter.lt(player.money)) {
			player.matter=player.matter.times(E_pow(tmp.mv, diff))
			if (player.matter.gte(player.money)) player.pSac.dims.extraTime+=player.matter.div(player.money).log(tmp.mv)/10
			player.matter=player.matter.min(player.money)
		} else player.pSac.dims.extraTime+=diff
		if (player.pSac.dims.extraTime>getExtraTime()) {
			pxGain=getPxGain()
			player.matter=E(1/0)
			haveET=false
		}
	} else {
		var newMatter=player.matter.times(E_pow(tmp.mv,diff))
		if (player.pSac != undefined && !haveET && newMatter.gt(player.money)) pxGain = getPxGain()
		player.matter = newMatter
	}
	if (player.matter.pow(20).gt(player.money) && (player.currentChallenge == "postc7" || (inQC(6) && !hasAch("ng3p34")))) {
		if (tmp.ngp3 ? brSave.active && tmp.ri : false) {}
		else if (inQC(6)) {
			quantum(false, true, 0)
			onChallengeFail()
		} else quickReset()
	} else if (player.matter.gt(player.money) && (inNC(12) || player.currentChallenge == "postc1" || player.pSac !== undefined) && !haveET) {
		if (player.pSac!=undefined) player.pSac.lostResets++
		if (player.pSac!=undefined && !player.resets) pSacReset(true, undefined, pxGain)
		else quickReset()
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

function infinityRespeccedDMUpdating(diff){
	var prod = getDarkMatterPerSecond()
	player.singularity.darkMatter = player.singularity.darkMatter.add(getDarkMatterPerSecond().times(diff))
	if (prod.gt(0)) tmp.tickUpdate = true
	if (player.singularity.darkMatter.gte(getNextDiscounts())) {
		player.dimtechs.discounts++
		for (d=1;d<9;d++) {
			var name = TIER_NAMES[d]
			player[name+"Cost"] = player[name+"Cost"].div(getDiscountMultiplier("dim" + d))
		}
		player.tickSpeedCost = player.tickSpeedCost.div(getDiscountMultiplier("tick"))
	}
}

function incrementTimesUpdating(diffStat){
	player.totalTimePlayed += diffStat
	if (tmp.ngp3) ghSave.time += diffStat
	if (player.meta) quSave.time += diffStat
	if (player.currentEternityChall == "eterc12") diffStat /= 1e3
	player.thisEternity += diffStat
   	player.thisInfinityTime += diffStat
	if (player.galacticSacrifice) player.galacticSacrifice.time += diffStat
	if (player.pSac) player.pSac.time += diffStat
	failsafeDilateTime = false
}

function requiredInfinityUpdating(diff){
	if (tmp.ri) return
	if (player.infinityUpgradesRespecced != undefined) infinityRespeccedDMUpdating(diff)
		
	for (let tier = (inQC(1) ? 1 : player.currentEternityChall == "eterc3" ? 3 : (inNC(4) || player.currentChallenge == "postc1") ? 5 : 7) - (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4) || player.pSac !== undefined ? 1 : 0); tier >= 1; --tier) {
		var name = TIER_NAMES[tier];
		player[name + 'Amount'] = player[name + 'Amount'].plus(getDimensionProductionPerSecond(tier + (inNC(7) || player.currentChallenge == "postcngm3_3" || inQC(4) || player.pSac !== undefined ? 2 : 1)).times(diff / 10));
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
	tmp.ri=player.money.gte(getLimit()) && ((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) || !onPostBreak())
}

function chall2PowerUpdating(diff){
	var div = 1800 / puMults[11](hasPU(11, true, true))
	player.chall2Pow = Math.min(player.chall2Pow + diff / div, 1);
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

function incrementParadoxUpdating(diff){
	if (player.pSac !== undefined) {
		//Paradox Power
		player.pSac.dims.power=player.pSac.dims.power.add(getPDProduction(1).times(diff))
		for (var t=1;t<7;t++) {
			if (!isDimUnlocked(t+2)) break
			player.pSac.dims[t].amount=player.pSac.dims[t].amount.add(getPDProduction(t+2).times(diff))
		}
	}
}

function dimensionButtonDisplayUpdating(){
	el("pdtabbtn").style.display = pSacrificed() ? "" : "none"
	el("tdtabbtn").style.display = ((player.eternities > 0 || quantumed || aarMod.ngmX > 3) && (!inQC(8) || tmp.be)) ? "" : "none"
	el("mdtabbtn").style.display = player.dilation.studies.includes(6) ? "" : "none"
}

function ghostifyAutomationUpdating(diff){
	if (!ghostified) return
	if (!isAutoGhostsSafe) return

	//Ghostify Layer
	if (player.ghostify.wzb.unl) {
		if (isAutoGhostActive(17)) {
			let ag = player.ghostify.automatorGhosts[17]

			let change = getRemainingExtractTime().gte(ag.s || 60)
			if (!change) change = ag.oc && ag.t >= 2 / (hasAch("ng3p103") ? 10 : 1)
			if (change) changeTypeToExtract(tmp.bl.typeToExtract % br.limit + 1)

			if (!tmp.bl.extracting) extract()
		}
		if (isAutoGhostActive(20)) buyMaxBosonicUpgrades()
		if (isAutoGhostActive(21)) {
			let data = player.ghostify.wzb
			let hasWNB = data.wnb.gt(0)

			if (data.dPUse == 0 && data.dP.gt(0)) useAntiPreon(hasWNB ? 3 : 1)
			if (data.dPUse == 1) useAntiPreon(hasWNB ? 3 : 2)
			if (data.dPUse == 2) useAntiPreon(1)
			if (data.dPUse == 3 && !hasWNB) useAntiPreon(2)
		}
	}
	if (isAutoGhostActive(19)) {
		let ag = player.ghostify.automatorGhosts[19]
		let perSec = 1/2
		ag.t = (ag.t || 0) + diff * perSec
		let times = Math.floor(ag.t)
		if (times > 0) {
			let max = times
			if (isEnchantUsed(35)) max = tmp.bEn[35].times(max)
			autoMaxAllEnchants(max)
			ag.t = ag.t - times
		}
	}
	if (isAutoGhostActive(22)) {
		lightEmpowerment(true)
	}
	if (isAutoGhostActive(15)) if ((hasNU(16) || inBigRip()) && getGHPGain().gte(player.ghostify.automatorGhosts[15].a)) ghostify(true)

	//Quantum Layer
	let limit = player.ghostify.automatorGhosts[13].o || 1 / 0
	if (player.masterystudies.includes("d13") && isAutoGhostActive(13)) {
		if (brSave.active) {
			if (quSave.time >= player.ghostify.automatorGhosts[13].u * 10 && brSave.times <= limit) quantumReset(true, true)
		} else if (quSave.time >= player.ghostify.automatorGhosts[13].t * 10 && brSave.times < limit) bigRip(true)
	}
	if (NF.unl()) {
		let colorShorthands = ["r", "g", "b"]
		for (let c = 1; c <= 3; c++) {
			let shorthand = colorShorthands[c - 1]
			if (isAutoGhostActive(c) && quSave.usedQuarks[shorthand].gt(0) && todSave[shorthand].quarks.eq(0)) unstableQuarks(shorthand)
			if (isAutoGhostActive(12) && getUnstableGain(shorthand).max(todSave[shorthand].quarks).gte(Decimal.pow(10, Math.pow(2, 50)))) {
				unstableQuarks(shorthand)
				radioactiveDecay(shorthand)
			}
			if (isAutoGhostActive(5)) maxBranchUpg(shorthand)
		}
		if (isAutoGhostActive(6)) maxTreeUpg()
	}
	if (player.masterystudies.includes("d11") && isAutoGhostActive(11)) {
		let ag = player.ghostify.automatorGhosts[11]
		ag.t = (ag.t || 0) + diff

		let start = nfSave.producingCharge ? ag.t <= ag.cw : ag.t >= ag.pw
		if (nfSave.producingCharge != start) {
			startProduceQuarkCharge()
			if (start) ag.t = 0
		}
	}
}

function WZBosonsUpdating(diff){
	ghSave.automatorGhosts[17].t += diff

	var data = ghSave.bl
	var wattGain = getBosonicWattGain()
	if (wattGain.gt(data.watt)) {
		if (wattGain.gt(data.speed)) data.speed = wattGain.sub(data.watt).times(10).add(data.speed).min(wattGain)
		data.watt = wattGain
	}

	if (E(data.speed).gt(0)) {
		var limitDiff = data.speed.times(14400).min(diff).toNumber()
		bosonicTick(data.speed.sub(limitDiff / 28800).times(limitDiff))
		data.speed = data.speed.max(limitDiff / 14400).sub(limitDiff / 14400)
	}
}

function ghostlyPhotonsUpdating(diff){
	var data = ghSave.ghostlyPhotons
	var type = brSave && brSave.active ? "amount" : "darkMatter"
	data[type] = data[type].add(getGPHProduction().times(diff))
	data.ghostlyRays = data.ghostlyRays.add(getWVProduction().times(diff)).min(getWVCap())
	for (var c = 0; c < 8; c++) {
		if (data.ghostlyRays.gte(getLightThreshold(c))) {
			data.lights[c] += Math.floor(data.ghostlyRays.div(getLightThreshold(c)).log(getLightThresholdIncrease(c)) + 1)
			tmp.updateLights = true
		}
	}
	data.maxRed = Math.max(data.lights[0], data.maxRed)
}

function nanofieldProducingChargeUpdating(diff){
	var rate = getQuarkChargeProduction()
	var loss = getQuarkLossProduction()
	var toSub = loss.times(diff).min(quSave.replicants.quarks)
	if (toSub.eq(0)) {
		nfSave.producingCharge = false
		el("produceQuarkCharge").innerHTML="Start production of preon charge.<br>(You will not get preons when you do this.)"
	} else {
		let chGain = toSub.div(loss).times(rate)
		if (!hasAch("ng3p71")) quSave.replicants.quarks = quSave.replicants.quarks.sub(toSub)
		nfSave.charge = nfSave.charge.add(chGain)
	}
}

function nanofieldUpdating(diff){
	var AErate = getQuarkAntienergyProduction()
	var toAddAE = AErate.times(diff).min(getQuarkChargeProductionCap().sub(nfSave.antienergy))
	if (nfSave.producingCharge) nanofieldProducingChargeUpdating(diff)
	if (toAddAE.gt(0)) {
		nfSave.antienergy = nfSave.antienergy.add(toAddAE).min(getQuarkChargeProductionCap())
		nfSave.energy = nfSave.energy.add(toAddAE.div(AErate).times(getQuarkEnergyProduction()))
		tmp.nanofield_free_rewards = 0
		updateNextPreonEnergyThreshold()
		if (nfSave.power > nfSave.rewards) {
			nfSave.rewards = nfSave.power
			
			if (!nfSave.apgWoke && nfSave.rewards >= tmp.apgw) {
				nfSave.apgWoke = tmp.apgw
				$.notify("You reached " + getFullExpansion(tmp.apgw) + " rewards... The Anti-Preonius has woken up and took over the Nanoverse! Be careful!")
				showTab("quantumtab")
				showQuantumTab("replicants")
				showAntTab("antipreon")
			}
		}
	}
}

function treeOfDecayUpdating(diff){
	var colorShorthands=["r","g","b"]
	for (var c = 0; c < 3; c++) {
		var shorthand = colorShorthands[c]
		var branch = todSave[shorthand]
		var decayRate = getDecayRate(shorthand)
		var decayPower = getRDPower(shorthand)
				
		var mult = pow2(decayPower)
		var power = Decimal.div(branch.quarks.gt(mult)?branch.quarks.div(mult).log(2)+1:branch.quarks.div(mult),decayRate)
		var decayed = power.min(diff)
		power = power.sub(decayed).times(decayRate)

		var sProd = getQuarkSpinProduction(shorthand)
		branch.quarks = power.gt(1) ? pow2(power-1).times(mult) : power.times(mult)	
		branch.spin = branch.spin.add(sProd.times(decayed))	
	}
}

function emperorDimUpdating(diff){
	for (dim=8;dim>1;dim--) {
		var promote = hasNU(2) ? 1/0 : getWorkerAmount(dim-2)
		if (canFeedReplicant(dim-1,true)) {
			if (dim>2) promote = EDsave[dim-2].workers.sub(10).round().min(promote)
			EDsave[dim-1].progress = EDsave[dim-1].progress.add(EDsave[dim].workers.times(getEmperorDimensionMultiplier(dim)).times(diff/200)).min(promote)
			var toAdd = EDsave[dim-1].progress.floor()
			if (toAdd.gt(0)) {
				if (!hasAch("ng3p52")) {
					if (dim>2 && toAdd.gt(getWorkerAmount(dim-2))) EDsave[dim-2].workers = E(0)
					else if (dim>2) EDsave[dim-2].workers = EDsave[dim-2].workers.sub(toAdd).round()
					else if (toAdd.gt(quSave.replicants.amount)) quSave.replicants.amount = E(0)
					else quSave.replicants.amount = quSave.replicants.amount.sub(toAdd).round()
				}
				if (toAdd.gt(EDsave[dim-1].progress)) EDsave[dim-1].progress = E(0)
				else EDsave[dim-1].progress = EDsave[dim-1].progress.sub(toAdd)
				EDsave[dim-1].workers = EDsave[dim-1].workers.add(toAdd).round()
			}
		}
		if (!canFeedReplicant(dim-1,true)) EDsave[dim-1].progress = E(0)
	}
}

function replicantEggonUpdating(diff){
	var newBabies = tmp.twr.times(getEmperorDimensionMultiplier(1)).times(getSpinToReplicantiSpeed()).times(diff/200)
	if (hasAch("ng3p35")) newBabies = newBabies.times(10)
	quSave.replicants.eggonProgress = quSave.replicants.eggonProgress.add(newBabies)
	var toAdd = quSave.replicants.eggonProgress.floor()
	if (toAdd.gt(0)) {
		if (toAdd.gt(quSave.replicants.eggonProgress)) quSave.replicants.eggonProgress = E(0)
		else quSave.replicants.eggonProgress = quSave.replicants.eggonProgress.sub(toAdd)
		quSave.replicants.eggons = quSave.replicants.eggons.add(toAdd).round()
	}
}

function replicantBabyHatchingUpdating(diff){
	if (quSave.replicants.eggons.gt(0)) {
		quSave.replicants.babyProgress = quSave.replicants.babyProgress.add(diff/getHatchSpeed()/10)
		var toAdd = hasNU(2) ? quSave.replicants.eggons : quSave.replicants.babyProgress.floor().min(quSave.replicants.eggons)
		if (toAdd.gt(0)) {
			if (toAdd.gt(quSave.replicants.eggons)) quSave.replicants.eggons = E(0)
			else quSave.replicants.eggons = quSave.replicants.eggons.sub(toAdd).round()
			if (toAdd.gt(quSave.replicants.babyProgress)) quSave.replicants.babyProgress = E(0)
			else quSave.replicants.babyProgress = quSave.replicants.babyProgress.sub(toAdd)
			quSave.replicants.babies = quSave.replicants.babies.add(toAdd).round()
		}
	}
}

function replicantBabiesGrowingUpUpdating(diff){
	if (quSave.replicants.babies.gt(0)&&tmp.tra.gt(0)) {
		quSave.replicants.ageProgress = quSave.replicants.ageProgress.add(getGrowupRatePerMinute().div(60).times(diff)).min(quSave.replicants.babies)
		var toAdd = quSave.replicants.ageProgress.floor()
		if (toAdd.gt(0)) {
			if (!hasAch("ng3p71")) {
				if (toAdd.gt(quSave.replicants.babies)) quSave.replicants.babies = E(0)
				else quSave.replicants.babies = quSave.replicants.babies.sub(toAdd).round()
			}
			if (toAdd.gt(quSave.replicants.ageProgress)) quSave.replicants.ageProgress = E(0)
			else quSave.replicants.ageProgress = quSave.replicants.ageProgress.sub(toAdd)
			quSave.replicants.amount = quSave.replicants.amount.add(toAdd).round()
		}
	}
}

function replicantOverallUpdating(diff){
	replicantEggonUpdating(diff)
	replicantBabyHatchingUpdating(diff)
	if (quSave.replicants.eggons.lt(1)) quSave.replicants.babyProgress = E(0)
	replicantBabiesGrowingUpUpdating(diff)
	if (quSave.replicants.babies.lt(1)) quSave.replicants.ageProgress = E(0)
	if (!nfSave.producingCharge) quSave.replicants.quarks = quSave.replicants.quarks.add(getGatherRate().total.max(0).times(diff))
}

function quantumOverallUpdating(diff){
	var colorShorthands=["r","g","b"]
	//Color Powers
	for (var c=0;c<3;c++) quSave.colorPowers[colorShorthands[c]]=quSave.colorPowers[colorShorthands[c]].add(getColorPowerProduction(colorShorthands[c]).times(diff))
	updateColorPowers()
	if (player.masterystudies.includes("d10")) replicantOverallUpdating(diff)
	if (player.masterystudies.includes("d11")) emperorDimUpdating(diff)
	if (NF.unl()) nanofieldUpdating(diff)
	if (player.masterystudies.includes("d13")) treeOfDecayUpdating(diff)
	
	if (speedrunMilestonesReached>5) {
		quSave.metaAutobuyerWait+=diff*10
		var speed=speedrunMilestonesReached>20?10/3:10
		if (quSave.metaAutobuyerWait>speed) {
			quSave.metaAutobuyerWait=quSave.metaAutobuyerWait%speed
			doAutoMetaTick()
		}
	}
}

function metaDimsUpdating(diff){
	player.meta.antimatter = player.meta.antimatter.plus(getMetaDimensionProduction(1).times(diff))
	if (inQC(4)) player.meta.antimatter = player.meta.antimatter.plus(getMetaDimensionProduction(1).times(diff))
	if (tmp.ngp3 && inQC(0)) gainQuarkEnergy(player.meta.bestAntimatter, player.meta.antimatter)
	player.meta.bestAntimatter = player.meta.bestAntimatter.max(player.meta.antimatter)
	if (tmp.ngp3) {
		player.meta.bestOverQuantums = player.meta.bestOverQuantums.max(player.meta.antimatter)
		player.meta.bestOverGhostifies = player.meta.bestOverGhostifies.max(player.meta.antimatter)
	}
}

function infinityTimeMetaBlackHoleDimUpdating(diff){
	var step = inQC(4) || player.pSac!=undefined ? 2 : 1
	var stepT = inNC(7) && aarMod.ngmX > 3 ? 2 : step
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
	var showProdTab=false
	el("dimTabButtons").style.display = "none"
	if (player.infinitied > 0 || player.eternities !== 0 || quantumed) {
		el("hideProductionTab").style.display = ""
		showProdTab=!aarMod.hideProductionTab
	} else el("hideProductionTab").style.display = "none"
	if (player.infDimensionsUnlocked[0] || player.eternities !== 0 || quantumed || showProdTab || aarMod.ngmX > 3) el("dimTabButtons").style.display = "inline-block"
	el("prodtabbtn").style.display=showProdTab ? "inline-block":"none"
	if (!showProdTab) player.options.chart.on=false
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
	let easier = player.galacticSacrifice && !(aarMod.ngmX > 3)
	if (easier) {
		thresholdMult = player.timestudy.studies.includes(171) ? 1.1 : 1.15
		if (player.tickspeedBoosts != undefined) thresholdMult = player.timestudy.studies.includes(171) ? 1.03 : 1.05
	} else if (player.timestudy.studies.includes(171)) {
		thresholdMult = 1.25
		if (aarMod.newGameMult) thresholdMult -= 0.08
	}
	if (QCIntensity(7)) thresholdMult *= tmp.qcRewards[7]
	if (ghostified && ghSave.neutrinos.boosts > 9) thresholdMult -= tmp.nb[10]
	if (thresholdMult < 1.1 && player.galacticSacrifice == undefined) thresholdMult = 1 + 0.1 / (2.1 - thresholdMult)
	if (thresholdMult < 1.01 && player.galacticSacrifice) thresholdMult = 1.005 + 0.005 / (2.01 - thresholdMult)

	let gain = Math.ceil(E(player.timeShards).dividedBy(player.tickThreshold).log10()/Math.log10(thresholdMult))
	player.totalTickGained += gain
	player.tickspeed = player.tickspeed.times(E_pow(tmp.tsReduce, gain))
	player.postC3Reward = E_pow(getPostC3Mult(), gain * getIC3EffFromFreeUpgs()).times(player.postC3Reward)
	var base = aarMod.ngmX > 3 ? 0.01 : (player.tickspeedBoosts ? .1 : 1)
	player.tickThreshold = E_pow(thresholdMult, player.totalTickGained).times(base)
	el("totaltickgained").textContent = "You've gained " + getFullExpansion(player.totalTickGained) + " tickspeed upgrades."
	tmp.tickUpdate = true
}

function bigCrunchButtonUpdating(){
	el("bigcrunch").style.display = 'none'
	el("postInfinityButton").style.display = 'none'
	if (tmp.ri) {
		el("bigcrunch").style.display = 'inline-block';
		if ((player.currentChallenge == "" || player.options.retryChallenge) && (player.bestInfinityTime <= 600 || player.break)) {}
		else {
			isEmptiness = true
			showTab('emptiness')
		}
	} else if ((player.break && player.currentChallenge == "") || player.infinityUpgradesRespecced != undefined) {
		if (player.money.gte(Number.MAX_VALUE)) {
			el("postInfinityButton").style.display = "inline-block"
			var currentIPmin = gainedInfinityPoints().dividedBy(player.thisInfinityTime/600)
			if (currentIPmin.gt(IPminpeak)) IPminpeak = currentIPmin
			if (IPminpeak.log10() > 1e9) el("postInfinityButton").innerHTML = "Big Crunch"
			else {
				var IPminpart = IPminpeak.log10() > 1e5 ? "" : "<br>" + shortenDimensions(currentIPmin) + " IP/min" + "<br>Peaked at " + shortenDimensions(IPminpeak) + " IP/min"
				el("postInfinityButton").innerHTML = "<b>" + (IPminpeak.log10() > 3e5 ? "Gain " : "Big Crunch for ") + shortenDimensions(gainedInfinityPoints()) + " Infinity points.</b>" + IPminpart
			}
		}
	}
}

function eternityButtonUpdating(){
	if ((player.eternities == 0 && !quantumed) || isEmptiness) {
		el("eternityPoints2").style.display = "none"
		el("eternitystorebtn").style.display = "none"
	} else {
		el("eternityPoints2").style.display = "inline-block"
		el("eternitystorebtn").style.display = "inline-block"
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
				if (order[player.postChallUnlocked] == "postc1") for (var i = 0; i < player.challenges.length; i++) if (player.challenges[i].split("postc")[1]) infDimPow *= player.galacticSacrifice ? 2 : 1.3
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

function IRsetsUnlockUpdating(){
	if (player.infinityUpgradesRespecced != undefined) if (setUnlocks.length > player.setsUnlocked) if (player.money.gte(setUnlocks[player.setsUnlocked])) player.setsUnlocked++
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
			if (tmp.ngp3l || player.infinityPoints.lte(pow10(1e9))) {
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
	var isSmartPeakActivated = tmp.ngp3 && getEternitied() >= 1e13 && player.dilation.upgrades.includes("ngpp6")
	var EPminpeakUnits = isSmartPeakActivated ? (player.dilation.active ? 'TP' : tmp.be ? 'EM' : 'EP') : 'EP'
	var currentEPmin = updateEPminpeak(diff, EPminpeakUnits)
	EPminpeakUnits = (EPminpeakType == 'logarithm' ? ' log(' + EPminpeakUnits + ')' : ' ' + EPminpeakUnits) + '/min'
	if (el("eternitybtn").style.display == "inline-block") {
		el("eternitybtnFlavor").textContent = (((!player.dilation.active&&gainedEternityPoints().lt(1e6))||player.eternities<1||player.currentEternityChall!==""||(player.options.theme=="Aarex's Modifications"&&player.options.notation!="Morse code"))
									    ? ((player.currentEternityChall!=="" ? "Other challenges await..." : player.eternities>0 ? "" : "Other times await...") + " I need to become Eternal.") : "")
		if (player.dilation.active && player.dilation.totalTachyonParticles.gte(getDilGain())) el("eternitybtnEPGain").innerHTML = "Reach " + shortenMoney(getReqForTPGain()) + " antimatter to gain more Tachyon Particles."
		else {
			if ((EPminpeak.lt(pow10(9)) && EPminpeakType == "logarithm") || (EPminpeakType == 'normal' && EPminpeak.lt(pow10(1e9)))) {
				el("eternitybtnEPGain").innerHTML = ((player.eternities > 0 && (player.currentEternityChall==""||player.options.theme=="Aarex's Modifications"))
											  ? "Gain <b>"+(player.dilation.active?shortenMoney(getDilGain().sub(player.dilation.totalTachyonParticles)):shortenDimensions(gainedEternityPoints()))+"</b> "+(player.dilation.active?"Tachyon particles.":tmp.be?"EP and <b>"+shortenDimensions(getEMGain())+"</b> Eternal Matter.":"Eternity points.") : "")
			} else {
				el("eternitybtnEPGain").innerHTML = "Go Eternal"
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
	
	el("quantumbtnFlavor").textContent = ((quSave!==undefined?!quSave.times&&(ghSave!==undefined?!ghSave.milestones:true):false)||!inQC(0)?((tmp.ngp3 ? brSave.active : false)?"I am":inQC(0)?"My computer is":quSave.challenge.length>1?"These paired challenges are":"This challenge is")+" not powerful enough... ":"") + "I need to go quantum."
	var showGain = ((quantumed && quSave.times) || (ghostified && ghSave.milestones)) && (inQC(0)||player.options.theme=="Aarex's Modifications") ? "QK" : ""
	if (tmp.ngp3) if (brSave.active) showGain = "SS"
	el("quantumbtnQKGain").textContent = showGain == "QK" ? "Gain "+shortenDimensions(quarkGain())+" quark"+(quarkGain().eq(1)?".":"s.") : ""
	if (showGain == "SS") el("quantumbtnQKGain").textContent = "Gain " + shortenDimensions(getSpaceShardsGain()) + " Space Shards."
	if (showGain == "QK" && currentQKmin.gt(pow10(1e5))) {
		el("quantumbtnRate").textContent = ''
		el("quantumbtnPeak").textContent = ''
	} else {
		el("quantumbtnRate").textContent = showGain == "QK" ? shortenMoney(currentQKmin)+" QK/min" : ""
		var showQKPeakValue = QKminpeakValue.lt(1e30) || player.options.theme=="Aarex's Modifications"
		el("quantumbtnPeak").textContent = showGain == "QK" ? (showQKPeakValue ? "" : "Peaked at ") + shortenMoney(QKminpeak)+" QK/min" + (showQKPeakValue ? " at " + shortenDimensions(QKminpeakValue) + " QK" : "") : ""
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
	if (hasBU(15)) ghostifyGains.push(getFullExpansion(getGhostifiedGain()) + " Ghostifies")
	el("ghostifybtnFlavor").textContent = ghostifyGains.length > 1 ? "" : (ghostifyGains.length ? "" : "Research time! ") + "I need to fundament."
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

function passiveGPGen(diff){
	let passiveGPGen = false
	if (player.tickspeedBoosts != undefined) passiveGPGen = hasAch("r56")
	else if (player.galacticSacrifice) passiveGPGen = player.timestudy.studies.includes(181)
	var mult = 1
	if (aarMod.ngmX >= 4){
		if (hasAch("r43")){
			mult = Math.pow(player.galacticSacrifice.galaxyPoints.plus(1e20).log10() / 10, 2) /2
		}
		if (mult > 100) mult = 100
	}
	if (passiveGPGen) player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.add(getGSAmount().times(diff / 100 * mult))
}

function paradoxSacDisplay(){
	if (pSacrificed()) {
		el("paradoxbtn").style.display = ""
		el("px").style.display = ""
		el("px").innerHTML = "You have <span class='pxAmount'>"+shortenDimensions(player.pSac.px)+"</span> Paradox"+(player.galacticSacrifice.galaxyPoints.eq(1)?".":"es.")
	} else {
		el("paradoxbtn").style.display = "none"
		el("px").style.display = "none"
	}
}

function normalSacDisplay(){
	if (player.eightBought > 0 && player.resets > 4 && player.currentEternityChall !== "eterc3") el("sacrifice").className = "storebtn"
   	else el("sacrifice").className = "unavailablebtn"
}

function galSacDisplay(){
	if ((player.galacticSacrifice ? (player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0 || quantumed) : false) && !isEmptiness) {
		el("galaxybtn").style.display = "inline-block"
		el("galaxyPoints2").innerHTML = "You have <span class='GPAmount'>"+shortenDimensions(player.galacticSacrifice.galaxyPoints)+"</span> Galaxy point"+(player.galacticSacrifice.galaxyPoints.eq(1)?".":"s.")
	} else el("galaxybtn").style.display = "none";
	el("automationbtn").style.display = aarMod.ngmX > 3 && (player.challenges.includes("challenge1") || player.infinitied > 0 || player.eternities != 0 || quantumed) && !isEmptiness ? "inline-block" : "none"
	if (el("paradox").style.display=='block') updatePUMults()
	if (el("galaxy").style.display=='block') {
		galacticUpgradeSpanDisplay()
		galacticUpgradeButtonTypeDisplay()
	}
}

function isEmptinessDisplayChanges(){
	if (isEmptiness) {
		el("dimensionsbtn").style.display = "none";
		el("optionsbtn").style.display = "none";
		el("statisticsbtn").style.display = "none";
		el("achievementsbtn").style.display = "none";
		el("tickSpeed").style.visibility = "hidden";
		el("tickSpeedMax").style.visibility = "hidden";
		el("tickLabel").style.visibility = "hidden";
		el("tickSpeedAmount").style.visibility = "hidden";
		el("quantumtabbtn").style.display = "none"
		el("ghostifytabbtn").style.display = "none"
	} else {
		el("dimensionsbtn").style.display = "inline-block";
		el("optionsbtn").style.display = "inline-block";
		el("statisticsbtn").style.display = "inline-block";
		el("achievementsbtn").style.display = "inline-block";
	}
}

function DimBoostBulkDisplay(){
	var bulkDisplay = player.infinityUpgrades.includes("bulkBoost") || player.autobuyers[9].bulkBought === true ? "inline" : "none"
	el("bulkdimboost").style.display = bulkDisplay
	if (player.tickspeedBoosts != undefined) el("bulkTickBoostDiv").style.display = bulkDisplay
}

function currentChallengeProgress(){
	var p = Math.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
	el("progressbar").style.width = p
	el("progresspercent").textContent = p
	el("progresspercent").setAttribute('ach-tooltip',"Percentage to challenge goal")
}

function preBreakProgess(){
	var p = Math.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(getLimit()) * 100), 100).toFixed(2) + "%"
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
	el("ec9reward").textContent = "Reward: Infinity Dimensions gain a " + (player.galacticSacrifice ? "post dilation " : "") + " multiplier based on your Time Shards. Currently: "+shortenMoney(getECReward(9))+"x "
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
	if (getAmount(inNC(4)||player.pSac!=undefined?6:8) >= getGalaxyRequirement()) {
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

function pSacBtnUpdating(){
	if (canPSac()) {
		let px = getPxGain()
		el("pSac").style.display = ""
		el("pSac").innerHTML = "Paradox Sacrifice for " + shortenDimensions(px) + " Paradox" + (px.eq(1) ? "." : "es.")
	} else el("pSac").style.display = "none"
}

function galSacBtnUpdating(){
	el("sacrificebtn").style.display = "none"
	if (el("gSacrifice").style.display === "inline-block") {
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

function IPonCrunchPassiveGain(diff){
	if (player.timestudy.studies.includes(181)) player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints().times(diff / 100))
}

function EPonEternityPassiveGain(diff){
	if (tmp.ngp3) {
		if (player.masterystudies.includes("t291")) {
			player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints().times(diff / 100))
			el("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity points."
		}
	}
}

function ngp3DilationUpdating(){
	let gain = getDilGain()
	if (player.galacticSacrifice !== undefined) player.dilation.bestIP = player.infinityPoints.max(player.dilation.bestIP)
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
	if (player.currentEternityChall === "eterc12" || player.pSac !== undefined) diff /= getEC12Mult()

	updateInfinityTimes()
	updateTemp()
	infUpgPassiveIPGain(diff)

	incrementParadoxUpdating(diff)
	checkMatter(diff)
	passiveIPupdating(diff)
	passiveInfinitiesUpdating(diff)
	requiredInfinityUpdating(diff)
	normalChallPowerUpdating(diff)
	passiveIPperMUpdating(diff)
	incrementTimesUpdating(diffStat)
	dimensionButtonDisplayUpdating()
	ghostifyAutomationUpdating(diff)

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
	eternityButtonUpdating()
	IRsetsUnlockUpdating()
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
	paradoxSacDisplay()
	normalSacDisplay()
	galSacDisplay()
	d8SacDisplay()

	el("challengesbtn").style.display = player.challenges.includes("challenge1") && !isEmptiness ? "inline-block" : "none"
	el("infinitybtn").style.display = (player.infinitied > 0 || player.infinityPoints.gt(0) || player.eternities !== 0 || quantumed) && !isEmptiness ? "inline-block" : "none"

	isEmptinessDisplayChanges()
	DimBoostBulkDisplay()
	el("epmult").className = player.eternityPoints.gte(player.epmultCost) ? "eternityupbtn" : "eternityupbtnlocked"

	progressBarUpdating()
	challengeOverallDisplayUpdating()
	chall23PowerUpdating()
	
	pSacBtnUpdating()
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

function updateChart(first) {
	if (player.options.chart.on === true && first !== true) addData(normalDimChart, "0", getDimensionProductionPerSecond(1))
	setTimeout(updateChart, player.options.chart.updateRate || 1000)
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
	if (aarMod.ngmX > 3 && inNC(14)) return false
	if (getEternitied() < 10 && !player.autobuyers[9].bulkBought && amount < getShiftRequirement(player.autobuyers[9].bulk-1).amount) return false
	if (player.overXGalaxies <= player.galaxies) return true
	if (player.autobuyers[9].priority < req.amount && req.tier == ((inNC(4) || player.currentChallenge == "postc1") ? 6 : 8)) return false
	return true
}


function maxBuyGalaxies(manual) {
	if ((inNC(11) || player.currentEternityChall == "eterc6" || player.currentChallenge == "postc1" || (player.currentChallenge == "postc5" && player.tickspeedBoosts != undefined) || player.currentChallenge == "postc7" || inQC(6)) && !tmp.be) return
	if (player.autobuyers[10].priority > player.galaxies || manual) {
		let amount=getAmount(inNC(4)||player.pSac!=undefined?6:8)
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
	if (player.autobuyers[10].ticks*100 >= player.autobuyers[10].interval && getAmount(inNC(4)||player.pSac != undefined?6:8) >= getGalaxyRequirement() && (!inNC(14) || !(aarMod.ngmX > 3))) {
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
		if (player.resets < 4) softReset(1)
		else if (getEternitied() < 10 && !player.autobuyers[9].bulkBought) softReset(player.autobuyers[9].bulk)
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
		if (player.autobuyers[11].ticks*100 >= player.autobuyers[11].interval && player.money !== undefined && player.money.gte(player.currentChallenge == "" ? getLimit() : player.challengeTarget)) {
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
	if (player.galacticSacrifice) if (player.autobuyers[12]%1 !== 0) galSacABTick()
	if (player.tickspeedBoosts!=undefined) if (player.autobuyers[13]%1 !== 0) TSBoostABTick()
	if (aarMod.ngmX>3) if (player.autobuyers[14]%1 !== 0) TDBoostABTick()

	if (player.autoSacrifice%1 !== 0) {
		if ((player.galacticSacrifice ? player.autoSacrifice.ticks * 100 >= player.autoSacrifice.interval : true) && calcSacrificeBoost().gte(player.autoSacrifice.priority) && player.autoSacrifice.isOn) {
			sacrifice(true)
			if (player.galacticSacrifice!==undefined) player.autoSacrifice.ticks=0
		}
		if (player.galacticSacrifice!==undefined) player.autoSacrifice.ticks++
	}

	for (var i=0; i<priority.length; i++) {
		if (priority[i].ticks * 100 >= priority[i].interval || priority[i].interval == 100) {
			if (priority[i].isOn) {
				if (priority[i] == player.autobuyers[8]) {
					if (!inNC(14) | player.tickspeedBoosts != undefined) {
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
					if (aarMod.ngmX>3) buyMaxTimeDimension(priority[i].target % 10, priority[i].bulk)
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
	updatePerSecond()
	updateChart(true)
	setTimeout(function(){
		el("container").style.display = "block"
		el("loading").style.display = "none"
	},100)
	clearInterval(stuckTimeout)

	//Update temp twice to make sure all values are correct
	updateTemp()
	updateTemp()
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
	else if (keySequence2 == 3 && event.keyCode == 54) if (!tmp.ngp3l) giveAchievement("Revolution, when?")
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
			else if (player.tickspeedBoosts != undefined) manualTickspeedBoost()
		break;

		case 68: // D
			if (shiftDown && hasAch("ngpp11")) metaBoost()
			else if (hasAch("r136")) startDilatedEternity(false, true)
			else el("softReset").onclick()
		break;

		case 70: // F
			if (hasAch("ng3p51")) ghostify()
		break;

		case 71: // G
			if (!hasAch("ng3p51")) el("secondSoftReset").onclick()
		break;

		case 76: // N
			if (aarMod.ngmX >= 4) tdBoost(1)
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
	if (player.galacticSacrifice) return x.pow(Math.max(Math.min(Math.pow(x.max(1).log(10), 1 / 3) * 3, 8), 1)).plus(1);
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
	var gups = player.galacticSacrifice ? player.galacticSacrifice.upgrades.length : 0
	var minus = player.galacticSacrifice ? 10 : 30
	var exp = player.galacticSacrifice ? 5 : 3
	var div = 40
	if (aarMod.ngmX >= 4) {
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
	updateColorDimPowers()
	mult18 = 1
	updatePowerInt = setInterval(updatePowers, 100)
}
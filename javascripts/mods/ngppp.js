masterystudies={initialCosts:{time:{241: 1e71, 251: 2e71, 252: 2e71, 253: 2e71, 261: 5e71, 262: 5e71, 263: 5e71, 264: 5e71, 265: 5e71, 266: 5e71, 271: 2.7434842249657063e76, 272: 2.7434842249657063e76, 273: 2.7434842249657063e76, 281: 6.858710562414266e76, 282: 6.858710562414266e76},
		ec:{13:1e72, 14:1e72}},
	costs:{time:{},
		ec:{},
		dil:{7: 2e82, 8: 1e84, 9: 1e85},
		mc:{}},
	costmults:{241: 1, 251: 2.5, 252: 2.5, 253: 2.5, 261: 6, 262: 6, 263: 6, 264: 6, 265: 6, 266: 6, 271: 2, 272: 2, 273: 2, 281: 4, 282: 4},
	costmult:1,
	allTimeStudies:[241, 251, 252, 253, 261, 262, 263, 264, 265, 266, 271, 272, 273, 281, 282],
	initialReqs:{13:728e3,14:255e5},
	incrementReqs:{13:6e3,14:9e5},
	reqs:{}}

function portal() {
	if (player.dilation.upgrades.includes("ngpp6")) showEternityTab("masterystudies")
}
	
function updateMasteryStudyButtons() {
	document.getElementById("costmult").textContent=shorten(masterystudies.costmult)
	for (id=0;id<(quantumed?masterystudies.allTimeStudies.length:10);id++) {
		var name=masterystudies.allTimeStudies[id]
		var div=document.getElementById("timestudy"+name)
		document.getElementById("ts"+name+"Cost").textContent="Cost: "+shorten(masterystudies.costs.time[name])+" Time Theorems"
		if (player.masterystudies.includes("t"+name)) div.className="timestudybought"
		else if (canBuyMasteryStudy('t', name)) div.className="timestudy"
		else div.className="timestudylocked"
	}
	for (id=13;id<15;id++) {
		var element=document.getElementById("ec"+id+"unl")
		if (player.eternityChallUnlocked==id) element.className="eternitychallengestudybought"
		else if (canBuyMasteryStudy('ec', id)) element.className="eternitychallengestudy"
		else element.className="timestudylocked"
		document.getElementById("ec"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.ec[id])+" Time Theorems"
		document.getElementById("ec"+id+"Req").textContent=getFullExpansion(masterystudies.reqs[id])
	}
	for (id=262;id<265;id++) document.getElementById("ts"+id+"Current").textContent="Currently: "+shorten(getMTSMult(id))+"x"
	if (quantumed) {
		for (id=7;id<10;id++) {
			var div=document.getElementById("dilstudy"+id)
			if (player.masterystudies.includes("d"+id)) div.className="dilationupgbought"
			else if (canBuyMasteryStudy('d', id)) div.className="dilationupg"
			else div.className="timestudylocked"
			document.getElementById("ds"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.dil[id])+" Time Theorems"
		}
		document.getElementById("ds8Req").textContent="Requirement: "+shorten(15700)+" electrons"
		for (id=281;id<283;id++) document.getElementById("ts"+id+"Current").textContent="Currently: "+shorten(getMTSMult(id))+"x"
	}
}

function updateMasteryStudyCosts() {
	masterystudies.costmult=1
	for (id=0;id<player.masterystudies.length;id++) {
		var t=player.masterystudies[id].split("t")[1]
		if (t) {
			masterystudies.costs.time[t]=masterystudies.initialCosts.time[t]*masterystudies.costmult
			masterystudies.costmult*=masterystudies.costmults[t]
		}
	}
	for (id=0;id<masterystudies.allTimeStudies.length;id++) {
		var name=masterystudies.allTimeStudies[id]
		if (!player.masterystudies.includes("t"+name)) masterystudies.costs.time[name]=masterystudies.initialCosts.time[name]*masterystudies.costmult
	}
	for (id=13;id<15;id++) {
		masterystudies.costs.ec[id]=masterystudies.initialCosts.ec[id]*masterystudies.costmult
		masterystudies.reqs[id]=masterystudies.initialReqs[id]+masterystudies.incrementReqs[id]*ECTimesCompleted("eterc"+id)
		masterystudies.costs.ec[name]=masterystudies.initialCosts.ec[name]*masterystudies.costmult
	}
}

var types = {t:"time",ec:"ec",d:"dil"}
function buyMasteryStudy(type, id) {
	if (canBuyMasteryStudy(type, id)) {
		player.timestudy.theorem-=masterystudies.costs[types[type]][id]
		if (type=='ec') {
			player.eternityChallUnlocked=id
			showTab("challenges")
			showChallengesTab("eternitychallenges")
			updateEternityChallenges()
		} else {
			player.masterystudies.push(type+id)
		}
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		drawMasteryTree()
		
		if (id==241&&!GUBought("gb3")) {
			ipMultPower=2.2
			document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
		}
		if (id==7) {
			showTab("quantumtab")
			showQuantumTab("electrons")
			updateElectrons()
		}
		if (id>7&&id<10) {
			showTab("challenges")
			showChallengesTab("quantumchallenges")
			updateQuantumChallenges()
			if (id>8) updateGluons()
		}
	}
}

function canBuyMasteryStudy(type, id) {
	if (type=='t') {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)||player.eternityChallUnlocked>12) return false
		var row=Math.floor(id/10)
		for (check=1;check<10;check++) if (player.masterystudies.includes('t'+(row+1).toString()+check)) return false
		var col=id%10
		if (row>27) return player.masterystudies.includes('t27'+col)||player.masterystudies.includes('t27'+(col+1))
		if (row>26) return player.masterystudies.includes('t252')&&player.masterystudies.includes('d7')
		if (row>25) return player.masterystudies.includes('t25'+Math.ceil(col/2))
		if (row>24) return player.masterystudies.includes('t241')
	} else if (type=='d') {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
		if (id>8) return player.masterystudies.includes("d8")&&QCIntensity(8)
		if (id>7) return player.masterystudies.includes("t272")&&player.quantum.electrons.amount.gte(15700)
		if (id>6) return player.masterystudies.includes("t252")
	} else {
		if (player.timestudy.theorem<masterystudies.costs.ec[id]||player.eternityChallUnlocked) return false
		if (id==14) if (Math.round(player.replicanti.chance*100)<masterystudies.reqs[14]||!(player.masterystudies.includes('t264')||player.masterystudies.includes('t265')||player.masterystudies.includes('t266'))) return false
		if (id==13) if (player.resets<masterystudies.reqs[13]||!(player.masterystudies.includes('t261')||player.masterystudies.includes('t262')||player.masterystudies.includes('t263'))) return false
	}
	return true
}

function drawMasteryBranch(num1, num2) {
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("masterystudies").style.display === "none" || player.masterystudies === undefined) return
	var type=num2.split("ec")[1]?"ec":num2.split("di")[1]?"d":"t"
	var start=document.getElementById(num1).getBoundingClientRect();
	var end=document.getElementById(num2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	if (type=="ec"?player.eternityChallUnlocked==num2.slice(2,4):player.masterystudies.includes(type+num2.split("study")[1])) {
		if (type=="d" && player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle=parseInt(num2.split("study")[1])<8?"#D2E500":parseInt(num2.split("study")[1])>9?"#333333":"#009900";
		} else if (type=="ec") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else if (type=="d" && player.options.theme == "Aarex's Modifications") {
		msctx.strokeStyle=parseInt(num2.split("study")[1])<8?"#697200":parseInt(num2.split("study")[1])>9?"#262626":"#006600";
	} else msctx.strokeStyle="#444";
	msctx.moveTo(x1, y1);
	msctx.lineTo(x2, y2);
	msctx.stroke();
}

function drawMasteryTree() {
	msctx.clearRect(0, 0, msc.width, msc.height);
	drawMasteryBranch("back", "timestudy241")
	drawMasteryBranch("timestudy241", "timestudy251")
	drawMasteryBranch("timestudy241", "timestudy252")
	drawMasteryBranch("timestudy241", "timestudy253")
	drawMasteryBranch("timestudy251", "timestudy261")
	drawMasteryBranch("timestudy251", "timestudy262")
	drawMasteryBranch("timestudy252", "timestudy263")
	drawMasteryBranch("timestudy252", "timestudy264")
	drawMasteryBranch("timestudy253", "timestudy265")
	drawMasteryBranch("timestudy253", "timestudy266")
	drawMasteryBranch("timestudy261", "ec13unl")
	drawMasteryBranch("timestudy262", "ec13unl")
	drawMasteryBranch("timestudy263", "ec13unl")
	drawMasteryBranch("timestudy264", "ec14unl")
	drawMasteryBranch("timestudy265", "ec14unl")
	drawMasteryBranch("timestudy266", "ec14unl")
	if (quantumed) {
		document.getElementById("quantumstudies").style.display=""
		drawMasteryBranch("timestudy252", "dilstudy7")
		drawMasteryBranch("dilstudy7", "timestudy271")
		drawMasteryBranch("dilstudy7", "timestudy272")
		drawMasteryBranch("dilstudy7", "timestudy273")
		drawMasteryBranch("timestudy271","timestudy281")
		drawMasteryBranch("timestudy272","timestudy281")
		drawMasteryBranch("timestudy272","timestudy282")
		drawMasteryBranch("timestudy273","timestudy282")
		drawMasteryBranch("timestudy272", "dilstudy8")
		drawMasteryBranch("dilstudy8", "dilstudy9")
		drawMasteryBranch("dilstudy9", "dilstudy10")
		drawMasteryBranch("dilstudy10", "dilstudy11")
	} else document.getElementById("quantumstudies").style.display="none"
}

function setupText() {
	for (id=0;id<masterystudies.allTimeStudies.length;id++) {
		var name=masterystudies.allTimeStudies[id]
		var div=document.getElementById("timestudy"+name)
		div.innerHTML=div.innerHTML+"<br><span id='ts"+name+"Cost'></span>"
	}
}

//v1.1
function getMTSMult(id) {
	if (id==262) return Math.max(player.resets/15e3-19,1)
	if (id==263) return player.meta.resets+1
	if (id==264) return Math.pow(player.galaxies+1,0.25)*2
	if (id>280) {
		var replmult = Decimal.pow(Decimal.log2(Decimal.max(player.replicanti.amount, 1)), 2)
		if (player.timestudy.studies.includes(21)) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032))
		if (player.timestudy.studies.includes(102)) replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies, 150))
	}
	if (id==281) return Decimal.pow(10,Math.pow(replmult.max(1).log10(),0.25)/10)
	if (id==282) return Decimal.pow(10,Math.pow(replmult.max(1).log10(),0.25)/15)
}

//v1.3
function getEC14Power() {
	return player.currentEterChall=='eterc14'?5:ECTimesCompleted("eterc14")*2
}

//v1.5
function showQuantumTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('quantumtab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	resizeCanvas()
	closeToolTip()
}

function updateQuantumTabs() {
	if (document.getElementById("uquarks").style.display=="block") {
		document.getElementById("redPower").textContent=shortenMoney(player.quantum.colorPowers.r)
		document.getElementById("greenPower").textContent=shortenMoney(player.quantum.colorPowers.g)
		document.getElementById("bluePower").textContent=shortenMoney(player.quantum.colorPowers.b)
		document.getElementById("redTranslation").textContent=((colorBoosts.r-1)*100).toFixed(1)
		document.getElementById("greenTranslation").textContent=shortenDimensions((colorBoosts.g-1)*100)
		document.getElementById("blueTranslation").textContent=shortenMoney(colorBoosts.b)
	}
	if (document.getElementById("gluons").style.display=="block") {
		document.getElementById("brupg1current").textContent="Currently: "+shortenMoney(player.dilation.dilatedTime.add(1).log10()+1)+"x"
		document.getElementById("brupg2current").textContent="Currently: "+shortenMoney(Decimal.pow(2.2, Math.pow(calcTotalSacrificeBoost().log10()/1e6, 0.25)))+"x"
		document.getElementById("brupg4current").textContent="Currently: "+shortenMoney(Decimal.pow(getDimensionPowerMultiplier(), 0.0003))+"x"
		if (player.masterystudies.includes("d9")) {
			document.getElementById("gbupg5current").textContent="Currently: "+(Math.sqrt(player.replicanti.galaxies)/6).toFixed(1)+"%"
			document.getElementById("brupg5current").textContent="Currently: "+(Math.sqrt(player.dilation.tachyonParticles.log10())*1.2).toFixed(1)+"%"
		}
	}
	if (document.getElementById("electrons").style.display=="block") {
		for (i=1;i<7;i++) document.getElementById("sacrifice"+i).className=(Math.pow(10,i>4?0:i-1)>player.galaxies-player.quantum.electrons.sacGals||!inQC(0))?"unavailablebtn":"storebtn"
		for (u=1;u<5;u++) document.getElementById("electronupg"+u).className="gluonupgrade "+(canBuyElectronUpg(u)?"stor":"unavailabl")+"ebtn"
	}
}

colorCharge={}
colorShorthands={r:'red',
	g:'green',
	b:'blue'}
colorBoosts={
	r:1,
	g:1,
	b:1
}
function updateColorCharge() {
	if (player.masterystudies) {
		var sorted=[]
		var colors=['r','g','b']
		for (s=1;s<4;s++) {
			var search=''
			for (i=0;i<3;i++) if (!sorted.includes(colors[i])&&(search==''||player.quantum.usedQuarks[colors[i]].gte(player.quantum.usedQuarks[search]))) search=colors[i]
			sorted.push(search)
		}
		colorCharge={color:sorted[0],charge:Decimal.sub(player.quantum.usedQuarks[sorted[0]]).sub(player.quantum.usedQuarks[sorted[1]])}
		if (player.quantum.usedQuarks[sorted[0]].gt(0)&&colorCharge.charge.eq(0)) giveAchievement("Hadronization")
	} else {
		colorCharge={color:'r',charge:new Decimal(0)}
		return
	}
	document.getElementById("powerRate").textContent=shortenDimensions(colorCharge.charge)
	if (colorCharge.charge.eq(0)) {
		document.getElementById("powerRate").className=''
		document.getElementById("colorCharge").textContent='any'
	} else {
		var color=colorShorthands[colorCharge.color]
		document.getElementById("powerRate").className=color
		document.getElementById("colorCharge").textContent=color
	}
	document.getElementById("redQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.r)
	document.getElementById("greenQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.g)
	document.getElementById("blueQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.b)
	var canAssign=player.quantum.quarks.gt(0)
	document.getElementById("boost").style.display=player.dilation.active?"":"none"
	document.getElementById("redAssign").className=canAssign?"storebtn":"unavailablebtn"
	document.getElementById("greenAssign").className=canAssign?"storebtn":"unavailablebtn"
	document.getElementById("blueAssign").className=canAssign?"storebtn":"unavailablebtn"
}

function assignQuark(color) {
	player.quantum.usedQuarks[color]=player.quantum.usedQuarks[color].add(player.quantum.quarks)
	player.quantum.quarks=new Decimal(0)
	document.getElementById("quarks").innerHTML="You have <b class='QKAmount'>0</b> quarks."
	updateColorCharge()
	updateGluons()
}

//v1.75
GUCosts=[null, 1, 2, 4, 100, 6e15]

function updateGluons() {
	if (!player.masterystudies) return
	else if (!player.quantum.gluons.rg) {
		player.quantum.gluons = {
			rg: new Decimal(0),
			gb: new Decimal(0),
			br: new Decimal(0)
		}
	}
	document.getElementById("rg").textContent=shortenDimensions(player.quantum.gluons.rg)
	document.getElementById("gb").textContent=shortenDimensions(player.quantum.gluons.gb)
	document.getElementById("br").textContent=shortenDimensions(player.quantum.gluons.br)
	document.getElementById("rggain").textContent=shortenDimensions(player.quantum.usedQuarks.r.min(player.quantum.usedQuarks.g))
	document.getElementById("gbgain").textContent=shortenDimensions(player.quantum.usedQuarks.g.min(player.quantum.usedQuarks.b))
	document.getElementById("brgain").textContent=shortenDimensions(player.quantum.usedQuarks.b.min(player.quantum.usedQuarks.r))
	var names=["rg","gb","br"]
	for (u=1;u<7;u++) {
		var showRow=true
		if (u>4) {
			if (u>5) showRow=false
			else showRow=player.masterystudies.includes("d9")
			document.getElementById("gupgrow"+u).style.display=showRow?"":"none"
			if (showRow) for (c=0;c<3;c++) document.getElementById(names[c]+"upg"+u+"cost").textContent=shortenDimensions(GUCosts[u])
		}
		if (showRow) {
			for (c=0;c<3;c++) {
				var div=document.getElementById(names[c]+"upg"+u)
				if (GUBought(names[c]+u)) div.className="gluonupgradebought "+names[c]
				else if (player.quantum.gluons[names[c]].lt(GUCosts[u])) div.className="gluonupgrade unavailablebtn"
				else div.className="gluonupgrade "+names[c]
			}
		}
	}
	var c=Decimal.pow(100, Math.floor(player.quantum.multPower/3)).times(500)
	var t=player.quantum.multPower%3
	var div=document.getElementById("qkmult")
	document.getElementById("qkmultcurrent").textContent="Currently: "+shortenDimensions(Decimal.pow(2, player.quantum.multPower))+"x"
	document.getElementById("qkmultcost").textContent="Cost: "+shortenDimensions(c)+" "+names[t].toUpperCase()+" gluons"
	if (player.quantum.gluons[names[t]].lt(c)) div.className="gluonupgrade unavailablebtn"
	else div.className="gluonupgrade "+names[t]
}

function buyGluonUpg(color, id) {
	var name=color+id
	if (player.quantum.upgrades.includes(name)||player.quantum.gluons[color].lt(GUCosts[id])) return
	player.quantum.upgrades.push(name)
	player.quantum.gluons[color]=player.quantum.gluons[color].sub(GUCosts[id])
	updateGluons()
	if (name=="gb4") player.tickSpeedMultDecrease=1.25
	if (name=="br5") resetDilationGalaxies()
}

function GUBought(id) {
	if (!player.masterystudies) return false
	return player.quantum.upgrades.includes(id)
}

//v1.79
var speedrunMilestonesReached
var speedrunMilestones = [12,9,6,4.5,3,2,1,8/9,7/9,6/9,5/9,4/9,3/9,2/9,1/9,1/12,1/15,7/120,1/20,1/24,1/30,1/40,1/60,1/120]
function updateSpeedruns() {
	speedrunMilestonesReached = 0
	if (player.masterystudies) {
		for (i=0;i<24;i++) {
			if (player.quantum.best>speedrunMilestones[i]*36e3) break
			speedrunMilestonesReached++
		}
		for (i=1;i<25;i++) document.getElementById("speedrunMilestone"+i).className="achievement achievement"+(speedrunMilestonesReached>=i?"un":"")+"locked"
		for (i=1;i<4;i++) document.getElementById("speedrunRow"+i).className=speedrunMilestonesReached>=i*8?"completedrow":""
	}
}

function toggleAutoTT() {
	if (speedrunMilestonesReached<1) maxTheorems()
	else player.autoEterOptions.tt = !player.autoEterOptions.tt
	document.getElementById("theoremmax").innerHTML = speedrunMilestonesReached > 2 ? ("Auto max: O"+(player.autoEterOptions.tt?"N":"FF")) : "Buy max Theorems"
}

//v1.8
function doAutoMetaTick() {
	if (!player.masterystudies) return
	if (player.autoEterOptions.rebuyupg) {
		buyDilationUpgrade(11)
		buyDilationUpgrade(3)
		buyDilationUpgrade(1)
		buyDilationUpgrade(2)
	}
	for (dim=8;dim>0;dim--) if (player.autoEterOptions["md"+dim]) buyMaxMetaDimension(dim)
	if (player.autoEterOptions.metaboost) metaBoost()
}

function toggleAllMetaDims() {
	var turnOn
	var id=1
	var stop=Math.min(speedrunMilestonesReached-5,9)
	while (id<stop&&turnOn===undefined) {
		if (!player.autoEterOptions["md"+id]) turnOn=true
		else if (id>stop-2) turnOn=false
		id++
	}
	for (id=1;id<stop;id++) player.autoEterOptions["md"+id]=turnOn
}

function sacrificeGalaxy(id) {
	if (player.galaxies-player.quantum.electrons.sacGals<1||!inQC(0)) return
	var amount=1
	if (id>5) amount=player.galaxies-player.quantum.electrons.sacGals
	else if (id>4) amount=Math.ceil((player.galaxies-player.quantum.electrons.sacGals)/2)
	else if (id>3) amount=1e3
	else if (id>2) amount=100
	else if (id>1) amount=10
	if (amount>player.galaxies-player.quantum.electrons.sacGals) return
	if (player.options.sacrificeConfirmation) if (!confirm("Sacrificing your galaxies reduces your tickspeed and so your tick interval. You will gain a boost for multiplier per ten dimensions. Are you sure you want to do that?")) return
	var old=new Decimal(getTickSpeedMultiplier()).log10()
	player.quantum.electrons.sacGals+=amount
	player.quantum.electrons.amount=player.quantum.electrons.amount.add(player.quantum.electrons.mult*amount)
	player.tickspeed=player.tickspeed.pow(old/new Decimal(getTickSpeedMultiplier()).log10())
	updateElectrons()
}

function getMPTPower() {
	if (!inQC(0)) return 1
	var a = player.quantum.electrons.amount
	if (GUBought("rg4")) a = a.times(0.7)
	return a.toNumber()+1
}

//v1.8
function isRewardEnabled(id) {
	if (!player.masterystudies) return false
	return speedrunMilestonesReached>=id&&!player.quantum.disabledRewards[id]
}

function disableReward(id) {
	player.quantum.disabledRewards[id]=!player.quantum.disabledRewards[id]
	document.getElementById("reward"+id+"disable").textContent=(id>3?4.5:6)+" hours reward: O"+(player.quantum.disabledRewards[id]?"FF":"N")
}

function updateElectrons() {
	if (player.masterystudies ? !player.masterystudies.includes("d7") : true) {
		document.getElementById("electronstabbtn").style.display="none"
		return
	} else document.getElementById("electronstabbtn").style.display=""
	document.getElementById("electronsAmount").textContent=shortenDimensions(player.quantum.electrons.amount)
	document.getElementById("electronsAmount2").textContent="You have "+shortenDimensions(player.quantum.electrons.amount)+" electrons."
	document.getElementById("electronsTranslation").textContent=shortenDimensions(getMPTPower())
	document.getElementById("sacrificedGals").textContent=getFullExpansion(player.quantum.electrons.sacGals)
	document.getElementById("electronsGainMult").textContent=shorten(player.quantum.electrons.mult)
	for (u=1;u<5;u++) {
		var cost=getElectronUpgCost(u)
		document.getElementById("electronupg"+u).innerHTML="Upgrade multiplier using "+([null,"time theorems","dilated time","meta-antimatter","meta-dimension boosts"])[u]+".<br>Cost: "+(u>3?getFullExpansion(getElectronUpgCost(u)):shortenCosts(getElectronUpgCost(u)))+([null," TT"," DT"," MA"," MDB"])[u]
	}
}

//v1.9
function getElectronUpgCost(u) {
	var baseCost=([0,82,153,638,26])[u]+Math.pow(player.quantum.electrons.rebuyables[u-1]*Math.max(player.quantum.electrons.rebuyables[u-1]-1,1)+1,u<2?1:2)
	if (u>3) return baseCost
	if (u<2) return Math.pow(10,baseCost)
	return Decimal.pow(10,baseCost)
}

function buyElectronUpg(u) {
	if (!canBuyElectronUpg(u)) return
	var cost=getElectronUpgCost(u)
	if (u>3) {
		player.meta.resets-=cost
		player.meta.antimatter=new Decimal(100)
		clearMetaDimensions()
		for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) document.getElementById(i + "MetaRow").style.display = "none"
	} else if (u>2) player.meta.antimatter=player.meta.antimatter.sub(cost)
	else if (u>1) player.dilation.dilatedTime=player.dilation.dilatedTime.sub(cost)
	else player.timestudy.theorem-=cost
	player.quantum.electrons.rebuyables[u-1]++
	player.quantum.electrons.mult+=0.25
	updateElectrons()
}

//v1.9
function buyQuarkMult() {
	var c=Decimal.pow(100, Math.floor(player.quantum.multPower/3)).times(500)
	var color=(["rg","gb","br"])[player.quantum.multPower%3]
	var t=player.quantum.gluons[color]
	if (t.gte(c)) {
		player.quantum.gluons[color]=t.sub(c)
		player.quantum.multPower++
		updateGluons()
	}
}

var quantumChallenges={
	costs:[0,15700,16900,18300,22700,25750,29600,32500,33900],
	goals:[0,6375e6,735e7,4265e7,6899e7,1231e7,251e6,684e8,2855e7]
}

var assigned
var pcFocus=0
function updateQuantumChallenges() {
	if (player.masterystudies ? !player.masterystudies.includes("d8") : true) {
		document.getElementById("qctabbtn").style.display="none"
		return
	} else document.getElementById("qctabbtn").style.display=""
	assigned=[]
	var assignedNums={}
	document.getElementById("pairedchallenges").style.display = player.masterystudies.includes("d9") ? "" : "none"
	document.getElementById("respecPC").style.display = player.masterystudies.includes("d9") ? "" : "none"
	for (pc=1;pc<5;pc++) {
		var subChalls=player.quantum.pairedChallenges.order[pc]
		if (subChalls) for (sc=0;sc<2;sc++) {
			var subChall=subChalls[sc]
			if (subChall) {
				assigned.push(subChall)
				assignedNums[subChall]=pc
			}
		}
		if (player.masterystudies.includes("d9")) {
			var property="pc"+pc
			var sc1=player.quantum.pairedChallenges.order[pc]?player.quantum.pairedChallenges.order[pc][0]:0
			var sc2=(sc1?player.quantum.pairedChallenges.order[pc].length>1:false)?player.quantum.pairedChallenges.order[pc][1]:0
			document.getElementById(property+"desc").textContent="Paired Challenge "+pc+": Both Quantum Challenge "+(sc1?sc1:"?")+" and "+(sc2?sc2:"?")+" are applied."
			document.getElementById(property+"cost").textContent="Cost: "+(sc2?shorten(getQCCost(pc+8)):"???")+" electrons"
			document.getElementById(property+"goal").textContent="Goal: "+(sc2?shortenCosts(Decimal.pow(10,getQCGoal(pc+8))):"???")+" antimatter"
			document.getElementById(property).textContent=pcFocus==pc?"Cancel":(player.quantum.pairedChallenges.order[pc]?player.quantum.pairedChallenges.order[pc].length<2:true)?"Assign":player.quantum.pairedChallenges.completed>=pc?"Completed":player.quantum.pairedChallenges.completed+1<pc?"Locked":player.quantum.pairedChallenges.current==pc?"Running":"Start"
			document.getElementById(property).className=pcFocus==pc||(player.quantum.pairedChallenges.order[pc]?player.quantum.pairedChallenges.order[pc].length<2:true)?"challengesbtn":player.quantum.pairedChallenges.completed>=pc?"completedchallengesbtn":player.quantum.pairedChallenges.completed+1<pc?"lockedchallengesbtn":player.quantum.pairedChallenges.current==pc?"onchallengebtn":"challengesbtn"
		}
	}
	for (qc=1;qc<9;qc++) {
		var property="qc"+qc
		document.getElementById(property+"div").style.display=(qc<2||QCIntensity(qc-1))?"inline-block":"none"
		document.getElementById(property).textContent=((!assigned.includes(qc)&&pcFocus)?"Choose":inQC(qc)?"Running":QCIntensity(qc)?(assigned.includes(qc)?"Assigned":"Completed"):"Start")+(assigned.includes(qc)?" (PC"+assignedNums[qc]+")":"")
		document.getElementById(property).className=(!assigned.includes(qc)&&pcFocus)?"challengesbtn":inQC(qc)?"onchallengebtn":QCIntensity(qc)?"completedchallengesbtn":"challengesbtn"
		document.getElementById(property+"cost").textContent="Cost: "+shortenDimensions(quantumChallenges.costs[qc])+" electrons"
		document.getElementById(property+"goal").textContent="Goal: "+shortenCosts(Decimal.pow(10,getQCGoal(qc)))+" antimatter"
	}
	document.getElementById("qc7desc").textContent="Dimension & tickspeed cost multiplier increases are "+shorten(Number.MAX_VALUE)+"x. Multiplier per ten dimensions and meta-antimatter effect are disabled."
}

function inQC(num) {
	try {
		if (num<1) return player.quantum.challenge.length<1
		return player.quantum.challenge.includes(num)
	} catch (_) {
		return num<1
	}
}

//v1.95?
function getQCGoal(num) {
	if (!player.masterystudies) return 0
	var c1
	var c2
	if (!num) {
		c1=player.quantum.challenge[0]
		c2=player.quantum.challenge[1]
	} else if (num<9) {
		c1=num
	} else if (player.quantum.pairedChallenges.order[num-8]) {
		c1=player.quantum.pairedChallenges.order[num-8][0]
		c2=player.quantum.pairedChallenges.order[num-8][1]
	}
	if (!c1) return quantumChallenges.goals[0]
	if (!c2) return quantumChallenges.goals[c1]
	return quantumChallenges.goals[c1]*quantumChallenges.goals[c2]/1e11
}

function QCIntensity(num) {
	if (player.masterystudies) if (player.quantum.challenges[num]) return player.quantum.challenges[num]
	return 0
}

//v1.997
function respecTogglePC() {
	player.quantum.pairedChallenges.respec=!player.quantum.pairedChallenges.respec
	document.getElementById("respecPC").className=player.quantum.pairedChallenges.respec?"quantumbtn":"storebtn"
}

function getQCCost(num) {
	if (num>8) return quantumChallenges.costs[player.quantum.pairedChallenges.order[num-8][0]]+quantumChallenges.costs[player.quantum.pairedChallenges.order[num-8][1]]
	return quantumChallenges.costs[num]
}

//v1.997895
function canBuyElectronUpg(id) {
	if (!inQC(0)) return false
	if (id>3) return player.meta.resets>=getElectronUpgCost(4)
	if (id>2) return player.meta.antimatter.gte(getElectronUpgCost(3))
	if (id>1) return player.dilation.dilatedTime.gte(getElectronUpgCost(2))
	return player.timestudy.theorem>=getElectronUpgCost(1)
}

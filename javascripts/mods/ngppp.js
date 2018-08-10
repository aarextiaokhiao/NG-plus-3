masterystudies={initialCosts:{time:{241: 1e71, 251: 2e71, 252: 2e71, 253: 2e71, 261: 5e71, 262: 5e71, 263: 5e71, 264: 5e71, 265: 5e71, 266: 5e71},
		ec:{13:1e72, 14:1e72}},
	costs:{time:{},
		ec:{},
		dil:{7: 2e82},
		mc:{}},
	costmults:{241: 1, 251: 2.5, 252: 2.5, 253: 2.5, 261: 6, 262: 6, 263: 6, 264: 6, 265: 6, 266: 6},
	costmult:1,
	allTimeStudies:[241, 251, 252, 253, 261, 262, 263, 264, 265, 266],
	initialReqs:{13:728e3,14:255e5},
	incrementReqs:{13:6e3,14:9e5},
	reqs:{}}

function portal() {
	if (player.dilation.upgrades.includes("ngpp6")) showEternityTab("masterystudies")
}
	
function updateMasteryStudyButtons() {
	document.getElementById("costmult").textContent=shorten(masterystudies.costmult)
	for (id=0;id<masterystudies.allTimeStudies.length;id++) {
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
	if (quantumed) for (id=7;id<8;id++) {
		var div=document.getElementById("dilstudy"+id)
		if (player.masterystudies.includes("d"+id)) div.className="dilationupgbought"
		else if (canBuyMasteryStudy('d', id)) div.className="dilationupg"
		else div.className="timestudylocked"
		document.getElementById("ds"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.dil[id])+" Time Theorems"
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
			document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
		}
		if (id==7) {
			showTab("quantumtab")
			showQuantumTab("electrons")
			document.getElementById("electronstabbtn").style.display=""
		}
	}
}

function canBuyMasteryStudy(type, id) {
	if (type=='t') {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)||player.eternityChallUnlocked) return false
		var row=Math.floor(id/10)
		for (check=1;check<10;check++) if (player.masterystudies.includes('t'+(row+1).toString()+check)) return false
		var col=id%10
		if (row>25) return player.masterystudies.includes('t25'+Math.ceil(col/2))
		if (row>24) return player.masterystudies.includes('t241')
	} else if (type=='d') {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
		if (id>6) if (player.masterystudies.includes(252)) return
	} else {
		if (player.timestudy.theorem<masterystudies.costs.ec[id]||player.eternityChallUnlocked) return false
		if (id>13) if (Math.round(player.replicanti.chance*100)<masterystudies.reqs[14]||!(player.masterystudies.includes('t264')||player.masterystudies.includes('t265')||player.masterystudies.includes('t266'))) return false
		if (id>12) if (player.resets<masterystudies.reqs[13]||!(player.masterystudies.includes('t261')||player.masterystudies.includes('t262')||player.masterystudies.includes('t263'))) return false
	}
	return true
}

var msc = document.getElementById("studyTreeCanvas2");
var msctx = msc.getContext("2d");
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
			msctx.strokeStyle="#D2E500";
		} else if (type=="ec") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else if (type=="d" && player.options.theme == "Aarex's Modifications") {
		msctx.strokeStyle="#697200";
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
		document.getElementById("dilstudy7").style.display=""
		drawMasteryBranch("timestudy252", "dilstudy7")
	} else document.getElementById("dilstudy7").style.display="none"
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
	}
	if (document.getElementById("electrons").style.display=="block") {
		document.getElementById("electronsAmount").textContent=shortenDimensions(player.quantum.electrons.amount)
		document.getElementById("electronsTranslation").textContent=shortenDimensions(getMPTPower())
		document.getElementById("sacrificedGals").textContent=getFullExpansion(player.quantum.electrons.sacGals)
		for (i=1;i<6;i++) document.getElementById("sacrifice"+i).className=Math.pow(10,i>4?0:i-1)>player.galaxies-player.quantum.electrons.sacGals?"unavailablebtn":"storebtn"
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
			for (i=0;i<3;i++) {
				if (!sorted.includes(colors[i])&&player.quantum.usedQuarks[colors[i]].gte(search==''?0:player.quantum.usedQuarks[search])) search=colors[i]
			}
			sorted.push(search)
		}
		colorCharge={color:sorted[0],charge:Decimal.sub(player.quantum.usedQuarks[sorted[0]],player.quantum.usedQuarks[sorted[1]]).sub(player.quantum.usedQuarks[sorted[2]])}
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
	document.getElementById("QK").textContent=0
	updateColorCharge()
	updateGluons()
}

//v1.75
GUCosts=[null, 1, 2, 4]

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
	for (u=1;u<4;u++) {
		for (c=0;c<3;c++) {
			var div=document.getElementById(names[c]+"upg"+u)
			if (GUBought(names[c]+u)) div.className="gluonupgradebought "+names[c]
			else if (player.quantum.gluons[names[c]].lt(GUCosts[u])) div.className="gluonupgrade unavailablebtn"
			else div.className="gluonupgrade "+names[c]
		}
	}
}

function buyGluonUpg(color, id) {
	var name=color+id
	if (player.quantum.upgrades.includes(name)||player.quantum.gluons[color].lt(GUCosts[id])) return
	player.quantum.upgrades.push(name)
	player.quantum.gluons[color]=player.quantum.gluons[color].sub(GUCosts[id])
	updateGluons()
}

function GUBought(id) {
	if (!player.masterystudies) return false
	return player.quantum.upgrades.includes(id)
}

//v1.79
var speedrunMilestonesReached
var speedrunMilestones = [12,10,9,8,6,5,4,3.5,3,2.5,2,1.6,1.2,0.8,0.4,1/60]
function updateSpeedruns() {
	speedrunMilestonesReached = 0
	if (player.masterystudies) {
		for (i=0;i<16;i++) {
			if (player.quantum.best>speedrunMilestones[i]*36e3) break
			speedrunMilestonesReached++
		}
		for (i=1;i<17;i++) document.getElementById("speedrunMilestone"+i).className="achievement achievement"+(speedrunMilestonesReached>=i?"un":"")+"locked"
		for (i=1;i<3;i++) document.getElementById("speedrunRow"+i).className=speedrunMilestonesReached>=i*8?"completedrow":""
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
	for (dim=8;dim>0;dim--) if (player.autoEterOptions["md"+dim]) while (canBuyMetaDimension(dim) && canAffordMetaDimension(getMetaMaxCost(dim))) metaBuyManyDimension(dim)
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
	var amount=1
	if (id>4) amount=Math.ceil((player.galaxies-player.quantum.electrons.sacGals)/2)
	else if (id>3) amount=1e3
	else if (id>2) amount=100
	else if (id>1) amount=10
	if (amount>player.galaxies-player.quantum.electrons.sacGals) return
	if (player.options.sacrificeConfirmation) if (!confirm("Sacrificing your sacrifice will do a galaxy reset, but you will not gain galaxies and only reduce your tick interval. You will gain a boost for multiplier per ten dimensions. Are you sure you want to do that?")) return
	player.quantum.electrons.sacGals+=amount
	var ret=new Decimal(2)
	player.quantum.electrons.amount=ret.times(amount).add(player.quantum.electrons.amount)
}

function getMPTPower() {
	return 1+player.quantum.electrons.amount.toNumber()
}
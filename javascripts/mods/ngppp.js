masterystudies={initialCosts:{time:{241: 1e67, 251: 1e69, 252: 1e69, 253: 1e69, 261: 1e70, 262: 1e70, 263: 1e70, 264: 1e70, 265: 1e70, 266: 1e70},
		ec:{13:2e75, 14:2e75}},
	costs:{time:{},
		ec:{},
		dil:{},
		mc:{}},
	costmults:{241: 1, 251: 3, 252: 3, 253: 3, 261: 9, 262: 9, 263: 9, 264: 9, 265: 9, 266: 9},
	costmult:1,
	allTimeStudies:[241, 251, 252, 253, 261, 262, 263, 264, 265, 266],
	initialReqs:{13:422e3,14:923e4},
	incrementReqs:{13:2e3,14:2e4},
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
	document.getElementById("ts262Current").textContent="Currently: "+shorten(getTS262Mult())+"x"
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

var types = {t:"time",ec:"ec"}
function buyMasteryStudy(type, id) {
	if (canBuyMasteryStudy(type, id)) {
		player.timestudy.theorem-=masterystudies.costs[types[type]][id]
		if (type=='t') player.masterystudies.push(type+id)
		else {
			player.eternityChallUnlocked=id
			showTab("challenges")
			showChallengesTab("eternitychallenges")
			updateEternityChallenges()
		}
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		drawMasteryTree()
		
		if (id==241) {
			ipMultPower=2.2
			document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
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
	var type=num2.split("ec")[1]?"ec":"t"
	var start=document.getElementById(num1).getBoundingClientRect();
	var end=document.getElementById(num2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	if (type=="t"?player.masterystudies.includes("t"+num2.split("timestudy")[1]):player.eternityChallUnlocked==num2.slice(2,4)) {
		if (type=="ec") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
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
}

//v1.1
function getTS262Mult() {
	return Math.max(player.resets/15e3-19,1)
}

//v1.3
function getEC14Power() {
	return player.currentEterChall=='eterc14'?5:ECTimesCompleted("eterc14")*2
}

//v2
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
				if (!sorted.includes(colors[i])&&Decimal.gte(player.quantum.usedQuarks[colors[i]],search==''?0:player.quantum.usedQuarks[search])) search=colors[i]
			}
			sorted.push(search)
		}
		colorCharge={color:sorted[0],charge:Decimal.sub(player.quantum.usedQuarks[sorted[0]],player.quantum.usedQuarks[sorted[1]]).sub(player.quantum.usedQuarks[sorted[2]])}
	} else colorCharge={color:'r',charge:new Decimal(0)}
	document.getElementById("powerRate").textContent=shortenDimensions(colorCharge.charge)
	if (colorCharge.charge.eq(0)) {
		document.getElementById("powerRate").className=''
		document.getElementById("colorCharge").textContent='any'
	} else {
		var color=colorShorthands[colorCharge.color]
		document.getElementById("powerRate").className=color
		document.getElementById("colorCharge").textContent=color
	}
	if (!player.masterystudies) return
	document.getElementById("redQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.r)
	document.getElementById("greenQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.g)
	document.getElementById("blueQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.b)
}

function assignQuark(color) {
	player.quantum.usedQuarks[color]=player.quantum.usedQuarks[color].add(player.quantum.quarks)
	player.quantum.quarks=new Decimal(0)
	document.getElementById("QK").textContent=0
	updateColorCharge()
}
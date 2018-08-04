masterystudies={initialCosts:{time:{241: 1e67, 251: 1e69, 252: 1e69, 253: 1e69, 261: 1e70, 262: 1e70, 263: 1e70, 264: 1e70, 265: 1e70, 266: 1e70},
		ec:{13:2e75, 14:2e75}},
	costs:{time:{},
		ec:{},
		dil:{7:1e52},
		mc:{}},
	costmults:{241: 1, 251: 3, 252: 3, 253: 3, 261: 9, 262: 9, 263: 9, 264: 9, 265: 9, 266: 9},
	costmult:1,
	allTimeStudies:[241, 251, 252, 253, 261, 262, 263, 264, 265, 266, 271, 272, 281, 282, 291, 292, 301, 302],
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
	for (id=7;id<8;id++) {
		var element=document.getElementById("dilstudy"+id)
		if (player.masterystudies.includes("d"+id)) element.className="dilationupgbought"
		else if (canBuyMasteryStudy('d', id)) element.className="dilationupg"
		else element.className="timestudylocked"
		document.getElementById("ds"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.dil[id])+" Time Theorems"
	}
	for (id=1;id<5;id++) {
		document.getElementById("mc"+id+"unl").innerHTML=player.masterystudies.includes("d7")?"Meta Challenge "+id+"<br>Feat: ???<br>Cost: Infinite Time Theorems":"???<br>Cost: Infinite Time Theorems"
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

function updateMetaChallengeButtons() {
	for (id=0;id<3;id++) {
		masterystudies.costs.ec[id]=masterystudies.initialCosts.ec[id]*masterystudies.costmult
		masterystudies.reqs[id]=masterystudies.initialReqs[id]+masterystudies.incrementReqs[id]*ECTimesCompleted("eterc"+id)
		masterystudies.costs.ec[name]=masterystudies.initialCosts.ec[name]*masterystudies.costmult
	}
}

var types = {t:"time",ec:"ec",d:"dil",m:"mc"}
function buyMasteryStudy(type, id) {
	if (canBuyMasteryStudy(type, id)) {
		player.timestudy.theorem-=masterystudies.costs[types[type]][id]
		if (type=='mc') {
			player.eternityChallUnlocked='m'+id
			showTab("challenges")
			showChallengesTab("metachallenges")
			updateEternityChallenges()
		} else if (type=='ec') {
			player.eternityChallUnlocked=id
			showTab("challenges")
			showChallengesTab("eternitychallenges")
			updateEternityChallenges()
		} else player.masterystudies.push(type+id)
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		drawMasteryTree()
		
		if (type=='t') {
			if (id==241) {
				ipMultPower=2.2
				document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
			}
		} else if ('d') {
			
		}
	}
}

function canBuyMasteryStudy(type, id) {
	if (type=='t') {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)||player.eternityChallUnlocked) return false
		var row=Math.floor(id/10)
		for (check=1;check<10;check++) if (player.masterystudies.includes('t'+(row+1).toString()+check)) return false
		var col=id%10
		if (row>27&&col>1) return player.masterystudies.includes('t'+row+'1')||player.masterystudies.includes('t'+(row-1)+'2')
		if (row>27) return (player.masterystudies.includes('t'+(row-1)+'1')||player.masterystudies.includes('t'+(row-1)+'2'))&&!player.masterystudies.includes('t'+row+'2')
		if (row>26&&col>1) return player.masterystudies.includes('t271')
		if (row>26) return false
		if (row>25) return player.masterystudies.includes('t25'+Math.ceil(col/2))
		if (row>24) return player.masterystudies.includes('t241')
	} else if (type=='ec') {
		if (player.timestudy.theorem<masterystudies.costs.ec[id]||player.eternityChallUnlocked) return false
		if (id>13) if (Math.round(player.replicanti.chance*100)<masterystudies.reqs[14]||!(player.masterystudies.includes('t264')||player.masterystudies.includes('t265')||player.masterystudies.includes('t266'))) return false
		if (id>12) if (player.resets<masterystudies.reqs[13]||!(player.masterystudies.includes('t261')||player.masterystudies.includes('t262')||player.masterystudies.includes('t263'))) return false
	} else if (type=='d') {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
		if (id>7) return false
		if (id>6) return player.masterystudies.includes('t252')
	} else {
		if (player.eternityChallUnlocked) return false
	}
	return true
}

var msc = document.getElementById("studyTreeCanvas2");
var msctx = msc.getContext("2d");
function drawMasteryBranch(num1, num2) {
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("masterystudies").style.display === "none" || player.masterystudies === undefined) return
	var type=num2.split("mc")[1]?"m":num2.split("un")[1]?"ec":num2.split("di")[1]?"d":"t"
	var start=document.getElementById(num1).getBoundingClientRect();
	var end=document.getElementById(num2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	if (type=="dc"?player.eternityChallUnlocked=="d"+num2.slice(2,4):type=="ec"?player.eternityChallUnlocked==num2.slice(2,4):player.masterystudies.includes(type=="d"?"d"+num2.split("dilstudy")[1]:"t"+num2.split("timestudy")[1])) {
		if ((type=="d"||type=="m")&&player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle="#00E5E5";
		} else if (type=="d"||type=="m") {
			ctx.strokeStyle="#64DD17";
		} else if (type=="ec") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else {
		if ((type=="d"||type=="m")&&player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle="#007272";
		} else if (type=="d"||type=="dc") {
			msctx.strokeStyle="#4b3753";
		} else {
			msctx.strokeStyle="#444";
		}
	}
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
	drawMasteryBranch("timestudy252", "dilstudy7")
	drawMasteryBranch("dilstudy7", "mc1unl")
	drawMasteryBranch("ec13unl", "mc2unl")
	drawMasteryBranch("ec14unl", "mc3unl")
	drawMasteryBranch("mc1unl", "timestudy271")
	drawMasteryBranch("timestudy271", "timestudy272")
	drawMasteryBranch("timestudy271", "timestudy281")
	drawMasteryBranch("timestudy272", "timestudy281")
	drawMasteryBranch("timestudy272", "timestudy282")
	drawMasteryBranch("timestudy281", "timestudy282")
	drawMasteryBranch("timestudy281", "timestudy291")
	drawMasteryBranch("timestudy282", "timestudy291")
	drawMasteryBranch("timestudy282", "timestudy292")
	drawMasteryBranch("timestudy291", "timestudy292")
	drawMasteryBranch("timestudy291", "timestudy301")
	drawMasteryBranch("timestudy292", "timestudy301")
	drawMasteryBranch("timestudy292", "timestudy302")
	drawMasteryBranch("timestudy301", "timestudy302")
	drawMasteryBranch("timestudy301", "mc4unl")
	drawMasteryBranch("timestudy302", "mc4unl")
}

//v1.1
function getTS262Mult() {
	return Math.max(player.resets/15e3-19,1)
}

//v1.3
function getEC14Power() {
	return player.currentEterChall=='eterc14'?5:ECTimesCompleted("eterc14")*2
}
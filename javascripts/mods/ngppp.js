masterystudies={initialCosts:{time:{241: 1e41, 251: 1e43, 252: 1e43, 253: 1e43, 261: 1e44, 262: 1e44, 263: 1e44, 264: 1e44, 265: 1e44, 266: 1e44},
		dil:{}},
	costs:{time:{},
		dil:{}},
	costmults:{time:{241: 1, 251: 3, 252: 3, 253: 3, 261: 9, 262: 9, 263: 9, 264: 9, 265: 9, 266: 9},
		dil:{}},
	costmult:1,
	allTimeStudies:[241, 251, 252, 253, 261, 262, 263, 264, 265, 266, 271, 272, 281, 282, 291, 292, 301, 302]}

function portal() {
	if (player.dilation.upgrades.includes("ngpp4")) showEternityTab("masterystudies")
}
	
function updateMasteryStudyButtons() {
	document.getElementById("costmult").textContent=shorten(masterystudies.costmult)
	for (id=0;id<masterystudies.allTimeStudies.length;id++) {
		var name=masterystudies.allTimeStudies[id]
		var div=document.getElementById("timestudy"+name)
		document.getElementById("ts"+name+"Cost").textContent="Cost: "+shorten(masterystudies.costs.time[name])+" Time Theorems"
		if (player.masterystudies.includes("t"+name)) div.className="timestudybought"
		else if (canBuyMasteryStudy(true, name)) div.className="timestudy"
		else div.className="timestudylocked"
	}
	for (id=7;id<8;id++) {
		var element=document.getElementById("dilstudy"+id)
		var cost=masterystudies.costs.dil[id]
		if (player.masterystudies.includes("d"+id)) element.className="dilationupgbought"
		else if (canBuyMasteryStudy(false, id)) element.className="dilationupg"
		else element.className="timestudylocked"
		document.getElementById("ds"+id+"Cost").textContent="Cost: "+shorten(cost)+" Time Theorems"
	}
	document.getElementById("ts262Current").textContent="Currently: "+shorten(getTS262Mult())+"x"
}

function updateMasteryStudyCosts() {
	masterystudies.costmult=1
	for (id=0;id<player.masterystudies.length;id++) {
		var s=player.masterystudies[id].split("d")[1]
		if (s) {
			masterystudies.costs.dil[s]=masterystudies.initialCosts.dil[s]*masterystudies.costmult
			masterystudies.costmult*=masterystudies.costmults.dil[s]
		} else {
			s=player.masterystudies[id].split("t")[1]
			masterystudies.costs.time[s]=masterystudies.initialCosts.time[s]*masterystudies.costmult
			masterystudies.costmult*=masterystudies.costmults.time[s]
		}
	}
	for (id=0;id<masterystudies.allTimeStudies.length;id++) {
		var name=masterystudies.allTimeStudies[id]
		if (!player.masterystudies.includes("t"+name)) masterystudies.costs.time[name]=masterystudies.initialCosts.time[name]*masterystudies.costmult
	}
	for (id=7;id<8;id++) if (!player.masterystudies.includes("d"+id)) masterystudies.costs.dil[id]=masterystudies.initialCosts.dil[id]*masterystudies.costmult
}

function buyMasteryStudy(isTime, id) {
	if (canBuyMasteryStudy(isTime, id, true)) {
		player.timestudy.theorem-=masterystudies.costs[isTime?"time":"dil"][id]
		player.masterystudies.push((isTime?"t":"d")+id)
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		drawMasteryTree()
		
		if (isTime) {
			if (id==241) {
				ipMultPower=2.2
				document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
			}
		} else {
			
		}
	}
}

function canBuyMasteryStudy(isTime, id) {
	if (isTime) {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)) return false
		var row=Math.floor(id/10)
		for (check=1;check<10;check++) if (player.masterystudies.includes('t'+(row+1).toString()+check)) return false
		var col=id%10
		if (row>27&&col>1) return player.masterystudies.includes('t'+row+'1')||player.masterystudies.includes('t'+(row-1)+'2')
		if (row>27) return (player.masterystudies.includes('t'+(row-1)+'1')||player.masterystudies.includes('t'+(row-1)+'2'))&&!player.masterystudies.includes('t'+row+'2')
		if (row>26&&col>1) return player.masterystudies.includes('t271')
		if (row>26) return false
		if (row>25) return player.masterystudies.includes('t25'+Math.ceil(col/2))
		if (row>24) return player.masterystudies.includes('t241')
	} else {
		return false //temp
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
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
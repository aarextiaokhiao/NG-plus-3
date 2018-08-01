masterystudies={initialCosts:{time:{241: 1e40},
		dil:{}},
	costs:{time:{},
		dil:{}},
	costmults:{time:{241: 1},
		dil:{}},
	costmult:1,
	allTimeStudies:[241, 251, 252, 253, 261, 262, 263, 264, 265, 266]}

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
	/*for (id=7;id<16;id++) {
		var element=document.getElementById("dilstudy"+id)
		var cost=masterystudies.costs.dil[id]
		if (player.masterystudies.includes("d"+id)) element.className="dilationupgbought"
		else if (canBuyMasteryStudy(false, id)) element.className="dilationupg"
		else element.className="timestudylocked"
		document.getElementById("dilstudy"+id+"Cost").textContent=shorten(cost)
	}*/
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
	//for (id=7;id<16;id++) masterystudies.costs.dil[id]=masterystudies.initialCosts.dil[id]*masterystudies.costmult
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
		if (row>24) return false //temp
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)) return false
		var row=Math.floor(id/10)
		var col=id%10
		if (row>25) return player.masterystudies.includes('t25'+Math.ceil(col/2))
		else if (row>24) return player.masterystudies.includes('t241')
	} else {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
	}
	return true
}

var msc = document.getElementById("studyTreeCanvas2");
var msctx = msc.getContext("2d");
function drawMasteryBranch(num1, num2) {
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("masterystudies").style.display === "none" || player.masterystudies === undefined) return
	var type=num2.split("un")[1]?(num2.split("d")[1]?"dc":"ec"):num2.split("di")[1]?"d":"t"
	var start=document.getElementById(num1).getBoundingClientRect();
	var end=document.getElementById(num2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	if (type=="dc"?player.eternityChallUnlocked=="d"+num2.slice(2,4):type=="ec"?player.eternityChallUnlocked==num2.slice(2,4):player.masterystudies.includes(type=="d"?"d"+num2.split("dilstudy")[1]:"t"+num2.split("timestudy")[1])) {
		if ((type=="d"||type=="dc")&&player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle="#00E5E5";
		} else if (type=="ec") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else {
		if ((type=="d"||type=="dc")&&player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle="#007272";
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
	drawMasteryBranch("ec13unl", "dc1unl")
	drawMasteryBranch("ec14unl", "dc1unl")
}
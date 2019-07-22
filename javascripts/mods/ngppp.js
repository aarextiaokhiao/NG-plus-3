masterystudies={initialCosts:{time:{241: 1e71, 251: 2e71, 252: 2e71, 253: 2e71, 261: 5e71, 262: 5e71, 263: 5e71, 264: 5e71, 265: 5e71, 266: 5e71, 271: 2.7434842249657063e76, 272: 2.7434842249657063e76, 273: 2.7434842249657063e76, 281: 6.858710562414266e76, 282: 6.858710562414266e76, 291: 2.143347050754458e77, 292: 2.143347050754458e77, 301: 8.573388203017832e77, 302: 2.6791838134430725e78, 303: 8.573388203017832e77, 311: 8.573388203017832e77, 312: 8.573388203017832e77, 321: 2.6791838134430727e76, 322: 9.324815538194444e77, 323: 2.6791838134430727e76, 331: 1.0172526041666666e79, 332: 1.0172526041666666e79, 341: 9.5367431640625e78, 342: 1.0172526041666666e79, 343: 1.0172526041666666e79, 344: 9.5367431640625e78, 351: 2.1192762586805557e79, 361: 1.5894571940104167e79, 362: 1.5894571940104167e79, 371: 2.1192762586805557e79, 372: 6.622738308376736e79, 373: 2.1192762586805557e79, 381: 6.622738308376736e79, 382: 6.622738308376736e79, 383: 6.622738308376736e79, 391: 8.27842288547092e79, 392: 8.27842288547092e79, 393: 8.27842288547092e79, 401: 4.967053731282552e80, 402: 8.278422885470921e80, 411: 1.3245476616753473e61, 412: 1.655684577094184e61, 421: 1.9868214925130208e62},
		ec:{13:1e72, 14:1e72}},
	costs:{time:{},
		ec:{},
		dil:{7: 2e82, 8: 2e84, 9: 4e85, 10: 4e87, 11: 3e90, 12: 3e92, 13: 1e95, 14: 2e98},
		mc:{}},
	costmults:{241: 1, 251: 2.5, 252: 2.5, 253: 2.5, 261: 6, 262: 6, 263: 6, 264: 6, 265: 6, 266: 6, 271: 2, 272: 2, 273: 2, 281: 4, 282: 4, 291: 1, 292: 1, 301: 2, 302: 131072, 303: 2, 311: 64, 312: 64, 321: 2, 322: 2, 323: 2, 331: 2, 332: 2, 341: 1, 342: 1, 343: 1, 344: 1, 351: 4, 361: 1, 362: 1, 371: 2, 372: 2, 373: 2, 381: 1, 382: 1, 383: 2, 391: 1, 392: 1, 393: 1, 401: 1e20, 402: 1e20, 411: 1, 412: 1, 421: 1},
	costmult:1,
	allTimeStudies: [241, 251, 252, 253, 261, 262, 263, 264, 265, 266, 271, 272, 273, 281, 282, 291, 292, 301, 302, 303, 311, 312, 321, 322, 323, 331, 332, 341, 342, 343, 344, 351, 361, 362, 371, 372, 373, 381, 382, 383, 391, 392, 393, 401, 402, 411, 412, 421],
	initialReqs:{13:728e3,14:255e5},
	incrementReqs:{13:6e3,14:9e5},
	reqs:{},
	latestBoughtRow:0}

function portal() {
	if (player.dilation.upgrades.includes("ngpp6")) showEternityTab("masterystudies")
}
	
function updateMasteryStudyButtons() {
	if (!player.masterystudies) return
	for (id=0;id<(quantumed?masterystudies.allTimeStudies.length:10);id++) {
		var name=masterystudies.allTimeStudies[id]
		var div=document.getElementById("timestudy"+name)
		if (player.masterystudies.includes("t"+name)) div.className="timestudybought"
		else if (canBuyMasteryStudy('t', name)) div.className="timestudy"
		else div.className="timestudylocked"
	}
	for (id=13;id<15;id++) {
		var element=document.getElementById("ec"+id+"unl")
		if (player.eternityChallUnlocked==id) element.className="eternitychallengestudybought"
		else if (canBuyMasteryStudy('ec', id)) element.className="eternitychallengestudy"
		else element.className="timestudylocked"
	}
	for (id=251;id<254;id++) document.getElementById("ts"+id+"Current").textContent="Currently: +"+getFullExpansion(getMTSMult(id))
	for (id=262;id<265;id++) document.getElementById("ts"+id+"Current").textContent="Currently: "+shorten(getMTSMult(id))+"x"
	if (quantumed) {
		document.getElementById("ts273Current").textContent="Currently: ^"+shorten(getMTSMult(273, "ms"))
		for (id=281;id<283;id++) document.getElementById("ts"+id+"Current").textContent="Currently: "+shorten(getMTSMult(id))+"x"
		document.getElementById("ts303Current").textContent="Currently: "+shorten(getMTSMult(303))+"x"
		document.getElementById("ts322Current").textContent="Currently: "+shorten(getMTSMult(322))+"x"
		for (id=7;id<11;id++) {
			var div=document.getElementById("dilstudy"+id)
			if (player.masterystudies.includes("d"+id)) div.className="dilationupgbought"
			else if (canBuyMasteryStudy('d', id)) div.className="dilationupg"
			else div.className="timestudylocked"
		}
	}
	if (player.masterystudies.includes("d10")||ghostified) {
		document.getElementById("ts341Current").textContent="Currently: "+shorten(getMTSMult(341))+"x"
		document.getElementById("ts344Current").textContent="Currently: "+(getMTSMult(344)*100-100).toFixed(2)+"%"
		document.getElementById("ts351Current").textContent="Currently: "+shorten(getMTSMult(351))+"x"
		
		var div=document.getElementById("dilstudy11")
		if (player.masterystudies.includes("d11")) div.className="dilationupgbought"
		else if (canBuyMasteryStudy('d', 11)) div.className="dilationupg"
		else div.className="timestudylocked"
	}
	if (player.masterystudies.includes("d11")||ghostified) {
		document.getElementById("ts361Current").textContent="Currently: "+shorten(getMTSMult(361))+"x"
		for (r=37;r<40;r++) for (c=1;c<4;c++) document.getElementById("ts"+(r*10+c)+"Current").textContent="Currently: "+shorten(getMTSMult(r*10+c))+"x"
		
		var div=document.getElementById("dilstudy12")
		if (player.masterystudies.includes("d12")) div.className="dilationupgbought"
		else if (canBuyMasteryStudy('d', 12)) div.className="dilationupg"
		else div.className="timestudylocked"
	}
	if (player.masterystudies.includes("d12")||ghostified) {
		document.getElementById("ts401Current").textContent="Currently: "+shorten(getMTSMult(401))+"x"
		document.getElementById("ts411Current").textContent="Currently: "+shorten(getMTSMult(411))+"x"
		document.getElementById("ts421Current").textContent="Currently: "+shorten(getMTSMult(421))+"x"
		
		for (var d=13;d<15;d++) {
			var div=document.getElementById("dilstudy" + d)
			if (player.masterystudies.includes("d" + d)) div.className="dilationupgbought"
			else if (canBuyMasteryStudy('d', d)) div.className="dilationupg"
			else div.className="timestudylocked"
		}
	}
}

function updateMasteryStudyCosts(quick=false) {
	masterystudies.latestBoughtRow=0
	masterystudies.costmult=1
	for (id=0;id<player.masterystudies.length;id++) {
		var t=player.masterystudies[id].split("t")[1]
		if (t) {
			masterystudies.costs.time[t]=masterystudies.initialCosts.time[t]*masterystudies.costmult
			if (masterystudies.allTimeStudies.includes(parseInt(t))) masterystudies.costmult*=masterystudies.costmults[t]
			masterystudies.latestBoughtRow=Math.max(masterystudies.latestBoughtRow,Math.floor(t/10))
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
	if (!quick) updateMasteryStudyTextDisplay()
}

var types = {t:"time",ec:"ec",d:"dil"}
function buyMasteryStudy(type, id, quick=false) {
	if (canBuyMasteryStudy(type, id)) {
		player.timestudy.theorem-=masterystudies.costs[types[type]][id]
		if (type=='ec') {
			player.eternityChallUnlocked=id
			player.etercreq=id
			updateEternityChallenges()
			delete player.quantum.autoECN
		} else player.masterystudies.push(type+id)
		updateMasteryStudyCosts(quick)
		if (id==302) maybeShowFillAll()
		if (!quick) {
			if (id==302) fillAll()
			if (type=='ec') {
				showTab("challenges")
				showChallengesTab("eternitychallenges")
			} else drawMasteryTree()
			updateMasteryStudyButtons()
		}
		if (id==241&&!GUBought("gb3")) {
			var otherMults=1
			ipMultPower=2.2
			if (player.achievements.includes("r85")) otherMults*=4
			if (player.achievements.includes("r93")) otherMults*=4
			player.infMult=player.infMult.div(otherMults).pow(Math.log10(2.2)/Math.log10(2)).times(otherMults)
			document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
		}
		if (id==266&&player.replicanti.gal>399) {
			var gal=player.replicanti.gal
			player.replicanti.gal=0
			player.replicanti.galCost=new Decimal(1e170)
			player.replicanti.galCost=getRGCost(gal)
			player.replicanti.gal=gal
		}
		if (id==383) updateColorCharge()
		if (id==7) {
			showTab("quantumtab")
			showQuantumTab("electrons")
			updateElectrons()
		}
		if (type=="d"&&(id==8||id==9||id==14)) {
			showTab("challenges")
			showChallengesTab("quantumchallenges")
			updateQuantumChallenges()
			if (id==9) updateGluons()
		}
		if (id==10) {
			showTab("quantumtab")
			showQuantumTab("replicants")
			document.getElementById("replicantsstudies").style.display=""
			document.getElementById("timestudy322").style.display=""
			updateReplicants()
		}
		if (id==11) {
			showTab("dimensions")
			showDimTab("emperordimensions")
			document.getElementById("empstudies").style.display=""
			document.getElementById("timestudy361").style.display=""
			document.getElementById("timestudy362").style.display=""
			document.getElementById("edtabbtn").style.display=""
			updateReplicants()
		}
		if (id==12) {
			showTab("quantumtab")
			showQuantumTab("nanofield")
			document.getElementById("nfstudies").style.display=""
			document.getElementById("nanofieldtabbtn").style.display = ""
		}
		if (type=="d"&&id==13) {
			showTab("quantumtab")
			showQuantumTab("tod")
			player.ghostify.noGrind = false
			updateColorCharge()
			updateTODStuff()
		}
	}
}

function canBuyMasteryStudy(type, id) {
	if (type=='t') {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)||player.eternityChallUnlocked>12||!masterystudies.allTimeStudies.includes(id)) return false
		var row=Math.floor(id/10)
		if (masterystudies.latestBoughtRow>row) return false
		var col=id%10
		if (row>40) return player.masterystudies.includes('t'+(id-10))
		if (row>39) return player.masterystudies.includes('d12')&&player.masterystudies.includes('t392')
		if (row>38) {
			if (col>2) return player.masterystudies.includes('t382')
			if (col>1) return player.masterystudies.includes('t391')||player.masterystudies.includes('t393')
			return player.masterystudies.includes('t381')
		}
		if (row>37) {
			if (col>2) return player.masterystudies.includes('t373')
			if (col>1) return player.masterystudies.includes('t383')
			return player.masterystudies.includes('t372')
		}
		if (row>36) {
			if (col>2) return player.masterystudies.includes('t362')
			if (col>1) return player.masterystudies.includes('t371')
			return player.masterystudies.includes('t361')
		}
		if (row>35) return player.masterystudies.includes('d11')&&player.masterystudies.includes('t351')
		if (row>34) return player.masterystudies.includes('t344')
		if (row>33) {
			if (col>3) return player.masterystudies.includes('t343')
			if (col>1) return player.masterystudies.includes('t33'+(col-1))
			return player.masterystudies.includes('t342')
		}
		if (row>32) return player.masterystudies.includes('t322')
		if (row>31) {
			if (col==2) return player.masterystudies.includes('t302')&&player.masterystudies.includes('d10')
			return player.masterystudies.includes('t31'+((col+1)/2))
		}
		if (row>30) return player.masterystudies.includes('t30'+(col*2-1))
		if (row>29) {
			if (col==2) return player.masterystudies.includes('t272')&&player.masterystudies.includes('d9')
			return player.masterystudies.includes('t29'+((col+1)/2))
		}
		if (row>28) return player.masterystudies.includes('t272')&&player.masterystudies.includes('d9')
		if (row>27) return player.masterystudies.includes('t27'+col)||player.masterystudies.includes('t27'+(col+1))
		if (row>26) return player.masterystudies.includes('t252')&&player.masterystudies.includes('d7')
		if (row>25) return player.masterystudies.includes('t25'+Math.ceil(col/2))
		if (row>24) return player.masterystudies.includes('t241')
	} else if (type=='d') {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
		if (id>13) return player.masterystudies.includes("t412")&&player.masterystudies.includes("d12")&&player.achievements.includes("ng3p34")
		if (id>12) return player.masterystudies.includes("t412")&&(ghostified||player.quantum.nanofield.rewards>14)
		if (id>11) return player.masterystudies.includes("t392")&&(ghostified||eds[8].workers.gt(9.9))
		if (id>10) return player.masterystudies.includes("t351")&&(ghostified||eds[1].workers.gt(9.9))
		if (id>9) return player.masterystudies.includes("t302")&&(ghostified||player.quantum.pairedChallenges.completed>3)
		if (id>8) return player.masterystudies.includes("d8")&&(ghostified||QCIntensity(8))
		if (id>7) return player.masterystudies.includes("t272")&&(ghostified||player.quantum.electrons.amount.gte(16750))
		if (id>6) return player.masterystudies.includes("t252")
	} else {
		if (player.timestudy.theorem<masterystudies.costs.ec[id]||player.eternityChallUnlocked) return false
		if (id==13&&!(player.masterystudies.includes('t261')||player.masterystudies.includes('t262')||player.masterystudies.includes('t263'))) return false
		if (id==14&&!(player.masterystudies.includes('t264')||player.masterystudies.includes('t265')||player.masterystudies.includes('t266'))) return false
		if (player.etercreq==id) return true
		if (id==13) return player.resets>=masterystudies.reqs[13]
		return Math.round(player.replicanti.chance*100)>=masterystudies.reqs[14]
	}
	return true
}

function drawMasteryBranch(num1, num2) {
	var type=num2.split("ec")[1]?"ec":num2.split("di")[1]?"d":"t"
	var start=document.getElementById(num1).getBoundingClientRect();
	var end=document.getElementById(num2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	var drawBoughtLine=false
	if (type=="ec") {
		if (player.eternityChallUnlocked==num2.slice(2,4)) drawBoughtLine=player.masterystudies.includes('t'+num1.split("study")[1])
	} else drawBoughtLine=player.masterystudies.includes(type+num2.split("study")[1])
	if (drawBoughtLine) {
		if (type=="d" && player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle=parseInt(num2.split("study")[1])<8?"#D2E500":parseInt(num2.split("study")[1])>9?"#333333":"#009900";
		} else if (type=="ec") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else if (type=="d" && player.options.theme == "Aarex's Modifications") {
		msctx.strokeStyle=parseInt(num2.split("study")[1])<8?"#697200":parseInt(num2.split("study")[1])>11?"#727272":parseInt(num2.split("study")[1])>9?"#262626":"#006600";
	} else msctx.strokeStyle="#444";
	msctx.moveTo(x1, y1);
	msctx.lineTo(x2, y2);
	msctx.stroke();
    if (shiftDown && type == "t") {
		var start = document.getElementById(num2).getBoundingClientRect();
		var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
		var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
		var mult = masterystudies.costmults[num2.split("study")[1]]
		var msg = num2.split("study")[1] + " (" + (mult>1e3?shorten(mult):mult) + "x)"
		msctx.fillStyle = 'white';
		msctx.strokeStyle = 'black';
		msctx.lineWidth = 3;
		msctx.font = "15px Typewriter";
		msctx.strokeText(msg, x1 - start.width / 2, y1 - start.height / 2 - 1);
		msctx.fillText(msg, x1 - start.width / 2, y1 - start.height / 2 - 1);
    }
}

function drawMasteryTree() {
	msctx.clearRect(0, 0, msc.width, msc.height);
	if (player === undefined) return
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("masterystudies").style.display === "none" || player.masterystudies === undefined) return
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
		drawMasteryBranch("dilstudy9", "timestudy291")
		drawMasteryBranch("dilstudy9", "timestudy292")
		drawMasteryBranch("timestudy291", "timestudy301")
		drawMasteryBranch("dilstudy9", "timestudy302")
		drawMasteryBranch("timestudy292", "timestudy303")
		drawMasteryBranch("timestudy301", "timestudy311")
		drawMasteryBranch("timestudy303", "timestudy312")
		drawMasteryBranch("timestudy302", "dilstudy10")
		drawMasteryBranch("timestudy311", "timestudy321")
		drawMasteryBranch("timestudy312", "timestudy323")
	}
	if (player.masterystudies.includes("d10")||ghostified) {
		drawMasteryBranch("dilstudy10", "timestudy322")
		drawMasteryBranch("timestudy322", "timestudy331")
		drawMasteryBranch("timestudy322", "timestudy332")
		drawMasteryBranch("timestudy331", "timestudy342")
		drawMasteryBranch("timestudy332", "timestudy343")
		drawMasteryBranch("timestudy342", "timestudy341")
		drawMasteryBranch("timestudy343", "timestudy344")
		drawMasteryBranch("timestudy344", "timestudy351")
		drawMasteryBranch("timestudy351", "dilstudy11")
	}
	if (player.masterystudies.includes("d11")||ghostified) {
		drawMasteryBranch("dilstudy11", "timestudy361")
		drawMasteryBranch("dilstudy11", "timestudy362")
		drawMasteryBranch("timestudy361", "timestudy371")
		drawMasteryBranch("timestudy371", "timestudy372")
		drawMasteryBranch("timestudy362", "timestudy373")
		drawMasteryBranch("timestudy372", "timestudy381")
		drawMasteryBranch("timestudy383", "timestudy382")
		drawMasteryBranch("timestudy373", "timestudy383")
		drawMasteryBranch("timestudy373", "timestudy383")
		drawMasteryBranch("timestudy381", "timestudy391")
		drawMasteryBranch("timestudy391", "timestudy392")
		drawMasteryBranch("timestudy393", "timestudy392")
		drawMasteryBranch("timestudy382", "timestudy393")
		drawMasteryBranch("timestudy392", "dilstudy12")
	}
	if (player.masterystudies.includes("d12")||ghostified) {
		drawMasteryBranch("dilstudy12", "timestudy401")
		drawMasteryBranch("dilstudy12", "timestudy402")
		drawMasteryBranch("timestudy401", "timestudy411")
		drawMasteryBranch("timestudy402", "timestudy412")
		drawMasteryBranch("timestudy411", "timestudy421")
		drawMasteryBranch("timestudy412", "dilstudy13")
		drawMasteryBranch("dilstudy13", "dilstudy14")
	}
}

function setupText() {
	for (id=0;id<masterystudies.allTimeStudies.length;id++) {
		var name=masterystudies.allTimeStudies[id]
		var div=document.getElementById("timestudy"+name)
		div.innerHTML=div.innerHTML+"<br><span id='ts"+name+"Cost'></span>"
	}
	var pcct = document.getElementById("pccompletionstable")
	var row = pcct.insertRow(0)
	for (c=0;c<9;c++) {
		var col = row.insertCell(c)
		if (c>0) col.textContent = "#" + c
	}
	for (r=1;r<9;r++) {
		row = pcct.insertRow(r)
		for (c=0;c<9;c++) {
			var col = row.insertCell(c)
			if (c<1) col.textContent = "#" + r
			else if (c==r) {
				col.textContent = "QC" + r
				col.id = "qcC" + r
			} else col.id = "pc" + r + c
		}
	}
	var edsDiv = document.getElementById("empDimTable")
	for (d=1;d<9;d++) {
		var row=edsDiv.insertRow(d-1)
		row.id="empRow"+d
		row.style["font-size"]="15px"
		var html='<td id="empD'+d+'" width="41%">'+DISPLAY_NAMES[d]+' Emperor Dimension x1</td>'
		html+='<td><div id="empAmount'+d+'">0'+(d>7?'':' (+0.00%/s)')+'</div></td>'
		html+='<td><span class="empQuarks" id="empQuarks'+d+'">0</span> preons/s</td>'
		html+='<td align="right" width="2.5%"><button id="empFeedMax'+d+'" style="color:black; width:70px; font-size:10px" class="storebtn" align="right" onclick="feedReplicant('+d+', true)">Max</button></td>'
		html+='<td align="right" width="7.5%"><button id="empFeed'+d+'" style="color:black; width:195px; height:25px; font-size:10px" class="storebtn" align="right" onclick="feedReplicant('+d+')">Feed (0%)</button></td>'
		row.innerHTML=html
	}
	for (var c=0;c<3;c++) {
		var color=(["red","green","blue"])[c]
		var shorthand=(["r","g","b"])[c]
		var branchUpgrades=["Gain <span id='"+color+"UpgPow1'></span>x "+color+" quark spins, but "+color+" quarks decay 2x faster.","The gain of "+color+" <span id='"+color+"UpgName2'></span> quarks is multiplied by x and then raised to the power of x.",(["Red","Green","Blue"])[c]+" <span id='"+color+"UpgName3'></span> quarks decay 4x slower."]

		var html='You have <span class="'+color+'" id="'+color+'QuarksToD" style="font-size: 35px">0</span> '+color+' quarks.<br>'
		html+='<button class="storebtn" id="'+color+'UnstableGain" style="width: 240px; height: 80px" onclick="unstableQuarks(\''+shorthand+'\')"></button><br>'
		html+='<span id="'+color+'Conversion">9.90e531 '+color+' quarks => 1.0 unstable '+color+' quarks</span><br>'
		html+='You have <span class="'+color+'" id="'+color+'QuarkSpin" style="font-size: 35px">0.0</span> '+color+' quark spin.'
		html+='<span class="'+color+'" id="'+color+'QuarkSpinProduction" style="font-size: 25px">+0/s</span><br>'
		html+="You have <span class='"+color+"' id='"+color+"UnstableQuarks' style='font-size: 35px'>0</span> "+color+" <span id='"+shorthand+"UQName'></span> quarks.<br>"
		html+="<span id='"+color+"QuarksDecayRate'></span>."
		document.getElementById("todRow").insertCell(c).innerHTML=html
		document.getElementById("todRow").cells[c].className=shorthand+"qC"
		
		html="<table class='table' align='center' style='margin: auto'><tr>"
		for (var u=1;u<4;u++) html+="<td style='vertical-align: 0'><button class='gluonupgrade unavailablebtn' id='"+color+"upg"+u+"' onclick='buyBranchUpg(\""+shorthand+"\", "+u+")'"+(u<3?" style='font-size:10px'":"")+">"+branchUpgrades[u-1]+"<br>Currently: <span id='"+color+"upg"+u+"current'>1</span>x<br>Cost: <span id='"+color+"upg"+u+"cost'>?</span> "+color+" quark spin</button>"+(u==2?"<br><button class='storebtn' style='width: 190px' onclick='maxBranchUpg(\""+shorthand+"\")'>Max all upgrades</button><br><button class='storebtn' style='width: 190px; font-size:10px' onclick='maxBranchUpg(\""+shorthand+"\", true)'>Max 2nd and 3rd upgrades</button>":"")+"</td>"
		html+="</tr></tr><td></td><td><button class='gluonupgrade unavailablebtn' id='"+shorthand+"RadioactiveDecay' style='font-size:10px' onclick='radioactiveDecay(\""+shorthand+"\")'>Reset to make 1st upgrades stronger, but this branch will be nerfed.<br><span id='"+shorthand+"RDReq'></span><br>Radioactive Decays: <span id='"+shorthand+"RDLvl'></span></button></td><td></td>"
		html+="</tr></table>"
		document.getElementById(color+"Branch").innerHTML=html
	}
	for (var m=1;m<17;m++) document.getElementById("braveMilestone"+m).textContent=getFullExpansion(tmp.bm[m-1])+"x quantumed"
}

//v1.1
function getMTSMult(id, modifier) {
	if (id==251) return Math.floor(player.resets/3e3)
	if (id==252) return Math.floor(player.dilation.freeGalaxies/7)
	if (id==253) return Math.floor(extraReplGalaxies/9)*20
	if (id==262) return Math.max(player.resets/15e3-19,1)
	if (id==263) return player.meta.resets+1
	if (id==264) return Math.pow(player.galaxies+1,0.25)*2
	if (id==273) {
		var intensity = 0
		if (player.masterystudies ? player.masterystudies.includes("t273") || modifier == "ms" : false) intensity = 5
		if (ghostified ? player.ghostify.neutrinos.boosts > 1 && modifier != "pn" : false) intensity += tmp.nb[1]
		return Decimal.pow(Math.log10(player.replicanti.chance+1), intensity).max(1)
	}
	if (id==281) return Decimal.pow(10,Math.pow(tmp.rm.max(1).log10(),0.25)/10)
	if (id==282) return Decimal.pow(10,Math.pow(tmp.rm.max(1).log10(),0.25)/15)
	if (id==303) return Decimal.pow(4.7,Math.pow(Math.log10(Math.max(player.galaxies,1)),1.5))
	if (id==322) {
		let log = Math.sqrt(-player.tickspeed.div(1000).log10())/20000
		if (log>110) log = Math.sqrt(log * 27.5) + 55
		return Decimal.pow(10, log)
	}
	if (id==341) return Decimal.pow(2,Math.sqrt(player.quantum.replicants.quarks.add(1).log10()))
	if (id==344) return Math.pow(player.quantum.replicants.quarks.div(1e7).add(1).log10(),0.25)*0.17+1
	if (id==351) return player.timeShards.max(1).pow(14e-7)
	if (id==361) return player.dilation.tachyonParticles.max(1).pow(0.01824033924212366)
	if (id==371) return Math.pow(extraReplGalaxies+1,0.3)
	if (id==372) return Math.sqrt(player.timeShards.add(1).log10())/20+1
	if (id==373) return Math.pow(player.galaxies+1,0.55)
	if (id==381) return 1 - Decimal.max(getTickSpeedMultiplier(), 1).log10() / 135
	if (id==382) return player.eightAmount.max(1).pow(Math.PI)
	if (id==383) return Decimal.pow(3200,Math.pow(player.quantum.colorPowers.b.add(1).log10(),0.25))
	if (id==391) return player.meta.antimatter.max(1).pow(8e-4)
	if (id==392) return Decimal.pow(1.6,Math.sqrt(player.quantum.replicants.quarks.add(1).log10()))
	if (id==393) return Decimal.pow(4e5,Math.sqrt(getTotalWorkers().add(1).log10()))
	if (id==401) return player.quantum.replicants.quarks.div(1e28).add(1).pow(0.2)
	if (id==411) return getTotalReplicants().div(1e24).add(1).pow(0.2)
	if (id==421) {
		let ret=Math.pow(Math.max(-player.tickspeed.log10()/1e13-1.5,1),4)
		if (ret>100) ret=Math.sqrt(Math.log10(ret/10))*100
		return ret
	}
}

//v1.3
function getEC14Power() {
	if (player.masterystudies == undefined) return 0
	if (player.currentEterChall=='eterc14') return 5
	let ret = ECTimesCompleted("eterc14") * 2
	return ret
}

//v1.5
function showQuantumTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('quantumtab');
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
	if (oldTab != tabName) {
		player.aarexModifications.tabsSave.tabQuantum = tabName
		if (tabName == "uquarks" && document.getElementById("quantumtab").style.display !== "none") {
			resizeCanvas()
			requestAnimationFrame(drawQuarkAnimation)
		}
	}
	closeToolTip()
}

function updateQuantumTabs() {
	if (document.getElementById("uquarks").style.display=="block") {
		document.getElementById("redPower").textContent=shortenMoney(player.quantum.colorPowers.r)
		document.getElementById("greenPower").textContent=shortenMoney(player.quantum.colorPowers.g)
		document.getElementById("bluePower").textContent=shortenMoney(player.quantum.colorPowers.b)
		document.getElementById("redTranslation").textContent=((colorBoosts.r-1)*100).toFixed(1)
		var msg = getFullExpansion(Math.round((colorBoosts.g-1)*100))+(gatheredQuarksBoost>0?"+"+getFullExpansion(Math.round(gatheredQuarksBoost*100)):"")
		document.getElementById("greenTranslation").textContent=msg
		document.getElementById("blueTranslation").textContent=shortenMoney(colorBoosts.b)
		if (player.masterystudies.includes("t383")) document.getElementById("blueTranslationMD").textContent=shorten(getMTSMult(383))
		if (player.ghostify.milestones>7||player.achievements.includes("ng3p66")) {
			document.getElementById("assignAllButton").className=(player.quantum.quarks.lt(1)?"unavailabl":"stor")+"ebtn"
			updateQuantumWorth("display")
		}
	}
	if (document.getElementById("gluons").style.display=="block") {
		document.getElementById("gbupg1current").textContent="Currently: "+shortenMoney(1-Math.min(Decimal.log10(getTickSpeedMultiplier()),0))+"x"
		document.getElementById("brupg1current").textContent="Currently: "+shortenMoney(player.dilation.dilatedTime.add(1).log10()+1)+"x"
		document.getElementById("rgupg2current").textContent="Currently: "+(Math.pow(player.dilation.freeGalaxies/5e3+1,0.25)*100-100).toFixed(1)+"%"
		document.getElementById("brupg2current").textContent="Currently: "+shortenMoney(Decimal.pow(2.2, Math.pow(calcTotalSacrificeBoost().log10()/1e6, 0.25)))+"x"
		document.getElementById("brupg4current").textContent="Currently: "+shortenMoney(Decimal.pow(getDimensionPowerMultiplier(), 0.0003))+"x"
		if (player.masterystudies.includes("d9")) {
			document.getElementById("gbupg5current").textContent="Currently: "+(Math.sqrt(player.replicanti.galaxies)/5.5).toFixed(1)+"%"
			document.getElementById("brupg5current").textContent="Currently: "+Math.min(Math.sqrt(player.dilation.tachyonParticles.max(1).log10())*1.3,14).toFixed(1)+"%"
			document.getElementById("gbupg6current").textContent="Currently: "+(100-100/(1+Math.pow(player.infinityPower.log10(),0.25)/2810)).toFixed(1)+"%"
			document.getElementById("brupg6current").textContent="Currently: "+(100-100/(1+player.meta.resets/340)).toFixed(1)+"%"
			document.getElementById("gbupg7current").textContent="Currently: "+(100-100/(1+Math.log10(1+player.infinityPoints.max(1).log10())/100)).toFixed(1)+"%"
			document.getElementById("brupg7current").textContent="Currently: "+(100-100/(1+Math.log10(1+player.eternityPoints.max(1).log10())/80)).toFixed(1)+"%"
		}
		if (player.masterystudies.includes("d13")) {
			document.getElementById("rgupg8current").textContent="Currently: "+shorten(getGU8Effect("rg"))+"x"
			document.getElementById("gbupg8current").textContent="Currently: "+shorten(getGU8Effect("gb"))+"x"
			document.getElementById("brupg8current").textContent="Currently: "+shorten(getGU8Effect("br"))+"x"
		}
		if (player.ghostify.milestones>7||player.achievements.includes("ng3p66")) {
			updateQuantumWorth("display")
			updateGluons("display")
		}
	}
	if (document.getElementById("electrons").style.display=="block") {
		document.getElementById("normalGalaxies").textContent=getFullExpansion(player.galaxies)
		document.getElementById("sacrificeGal").className="gluonupgrade "+((player.galaxies>player.quantum.electrons.sacGals&&inQC(0))?"stor":"unavailabl")+"ebtn"
		document.getElementById("sacrificeGals").textContent=getFullExpansion(Math.max(player.galaxies-player.quantum.electrons.sacGals, 0))
		for (u=1;u<5;u++) document.getElementById("electronupg"+u).className="gluonupgrade "+(canBuyElectronUpg(u)?"stor":"unavailabl")+"ebtn"
		if (player.quantum.autoOptions.sacrifice) updateElectronsEffect()
	}
	if (document.getElementById("replicants").style.display=="block") {
		document.getElementById("replicantiAmount2").textContent=shortenDimensions(player.replicanti.amount)
		document.getElementById("replicantReset").className=player.replicanti.amount.lt(player.quantum.replicants.requirement)?"unavailablebtn":"storebtn"
		document.getElementById("replicantReset").innerHTML="Reset replicanti amount for a replicant.<br>(requires "+shortenCosts(player.quantum.replicants.requirement)+" replicanti)"
		document.getElementById("replicantAmount").textContent=shortenDimensions(player.quantum.replicants.amount)
		document.getElementById("workerReplAmount").textContent=shortenDimensions(getTotalWorkers())
		document.getElementById("babyReplAmount").textContent=shortenDimensions(player.quantum.replicants.babies)

		var gatherRateData=getGatherRate()
		document.getElementById("normalReplGatherRate").textContent=shortenDimensions(gatherRateData.normal)
		document.getElementById("workerReplGatherRate").textContent=shortenDimensions(gatherRateData.workersTotal)
		document.getElementById("babyReplGatherRate").textContent=shortenDimensions(gatherRateData.babies)
		document.getElementById("gatherRate").textContent='+'+shortenDimensions(gatherRateData.total)+'/s'

		document.getElementById("gatheredQuarks").textContent=shortenDimensions(player.quantum.replicants.quarks.floor())
		document.getElementById("quarkTranslation").textContent=getFullExpansion(Math.round(gatheredQuarksBoost*100))

		var eggonRate = getTotalWorkers().times(getEDMultiplier(1)).times(3)
		if (eggonRate.lt(30)) {
			document.getElementById("eggonRate").textContent=shortenDimensions(eggonRate)
			document.getElementById("eggonRateTimeframe").textContent="minute"
		} else {
			document.getElementById("eggonRate").textContent=shortenMoney(eggonRate.div(60))
			document.getElementById("eggonRateTimeframe").textContent="second"
		}
		document.getElementById("feedNormal").className=(canFeedReplicant(1)?"stor":"unavailabl")+"ebtn"
		document.getElementById("workerProgress").textContent=Math.round(eds[1].progress.toNumber()*100)+"%"

		if (!hasNU(2)) {
			document.getElementById("eggonAmount").textContent=shortenDimensions(player.quantum.replicants.eggons)
			document.getElementById("hatchProgress").textContent=Math.round(player.quantum.replicants.babyProgress.toNumber()*100)+"%"
		}
		var growupRate = getTotalReplicants().times(player.achievements.includes("ng3p35")?1.5:0.15)
		if (player.quantum.replicants.babies.eq(0)) growupRate = growupRate.min(eggonRate)
		if (growupRate.lt(30)) {
			document.getElementById("growupRate").textContent=shortenDimensions(growupRate)
			document.getElementById("growupRateUnit").textContent="minute"
		} else {
			document.getElementById("growupRate").textContent=shortenMoney(growupRate.div(60))
			document.getElementById("growupRateUnit").textContent="second"
		}
		document.getElementById("growupProgress").textContent=Math.round(player.quantum.replicants.ageProgress.toNumber()*100)+"%"

		document.getElementById("reduceHatchSpeed").innerHTML="Hatch speed: "+hatchSpeedDisplay()+" -> "+hatchSpeedDisplay(true)+"<br>Cost: "+shortenDimensions(player.quantum.replicants.hatchSpeedCost)+" for all 3 gluons"
		if (player.ghostify.milestones>7||player.achievements.includes("ng3p66")) updateReplicants("display")
	}
	if (document.getElementById("nanofield").style.display == "block") {
		var rewards = player.quantum.nanofield.rewards
		document.getElementById("quarksNanofield").textContent=shortenDimensions(player.quantum.replicants.quarks)
		document.getElementById("quarkCharge").textContent=shortenMoney(player.quantum.nanofield.charge)
		document.getElementById("quarkChargeRate").textContent=shortenDimensions(getQuarkChargeProduction())
		document.getElementById("quarkLoss").textContent=shortenDimensions(getQuarkLossProduction())
		document.getElementById("quarkEnergy").textContent=shortenMoney(player.quantum.nanofield.energy)
		document.getElementById("quarkEnergyRate").textContent=shortenMoney(getQuarkEnergyProduction())
		document.getElementById("quarkPower").textContent=getFullExpansion(player.quantum.nanofield.power)
		document.getElementById("quarkPowerThreshold").textContent=shortenMoney(player.quantum.nanofield.powerThreshold)
		document.getElementById("quarkAntienergy").textContent=shortenMoney(player.quantum.nanofield.antienergy)
		document.getElementById("quarkAntienergyRate").textContent=shortenMoney(getQuarkAntienergyProduction())
		document.getElementById("quarkChargeProductionCap").textContent=shortenMoney(getQuarkChargeProductionCap())
		document.getElementById("rewards").textContent=getFullExpansion(player.quantum.nanofield.rewards)

		for (var reward=1; reward<9; reward++) {
			document.getElementById("nanofieldreward" + reward).className = reward > rewards ? "nanofieldrewardlocked" : "nanofieldreward"
			document.getElementById("reward" + reward + "tier").textContent = getFullExpansion(Math.ceil((rewards + 1 - reward)/8))
		}
		document.getElementById("nanofieldreward1").textContent = "Hatch speed is " + shortenDimensions(getNanofieldRewardEffect(1)) + "x faster."
		document.getElementById("nanofieldreward2").textContent = "Meta-antimatter effect power is increased by " + getNanofieldRewardEffect(2).toFixed(1) + "x."
		document.getElementById("nanofieldreward3").textContent = "Free galaxy gain is increased by " + (getNanofieldRewardEffect(3)*100-100).toFixed(1) + "%."
		document.getElementById("nanofieldreward4").textContent = "Dilated time multiplier power on Meta Dimensions is " + getNanofieldRewardEffect(4).toFixed(3) + "x."
		document.getElementById("nanofieldreward5").textContent = "While dilated, Normal Dimension multipliers and tickspeed are raised to the power of " + getNanofieldRewardEffect(5).toFixed(2) + "."
		document.getElementById("nanofieldreward6").textContent = "Meta-dimension boost power is increased to " + getNanofieldRewardEffect(6).toFixed(2) + "x."
		document.getElementById("nanofieldreward7").textContent = "Remote galaxy cost scaling starts " + getFullExpansion(getNanofieldRewardEffect(7)) + " later and the production of preon charge is " + shortenMoney(getNanofieldRewardEffect("7g")) + "x faster."
		document.getElementById("nanofieldreward8").textContent = "Add " + getNanofieldRewardEffect(8).toFixed(2) + "x to multiplier per ten dimensions before getting affected by electrons and the production of preon energy is " + shortenMoney(getNanofieldRewardEffect("8c")) + "x faster."
	}
	if (document.getElementById("tod").style.display == "block") {
		var branchNum=0
		var colors=["red","green","blue"]
		var shorthands=["r","g","b"]
		if (document.getElementById("redBranch").style.display == "block") branchNum=1
		if (document.getElementById("greenBranch").style.display == "block") branchNum=2
		if (document.getElementById("blueBranch").style.display == "block") branchNum=3
		for (var c=0;c<3;c++) {
			var color=colors[c]
			var shorthand=shorthands[c]
			var branch=player.quantum.tod[shorthand]
			var name=color+" "+getUQName(shorthand)+" quarks"
			var rate=getDecayRate(shorthand)
			var linear=Decimal.pow(2,getRadioactiveDecays(shorthand)*25)
			document.getElementById(color+"UnstableGain").textContent="Gain "+shortenMoney(getUnstableGain(shorthand))+" "+name+", but lose all your "+color+" quarks."
			document.getElementById(color+"Conversion").textContent=shorten(player.quantum.tod[shorthand].gainDiv.times(99e30)) + " " + color + " quarks => " + shortenMoney(getUnstableGain(shorthand, true)) + " " + name
			document.getElementById(color+"QuarkSpin").textContent=shortenMoney(branch.spin)
			document.getElementById(color+"UnstableQuarks").textContent=shortenMoney(branch.quarks)
			document.getElementById(color+"QuarksDecayRate").textContent=branch.quarks.lt(linear)&&rate.lt(1)?"You are losing "+shorten(linear.times(rate))+" "+name+" per second":"Their half-life is "+timeDisplayShort(Decimal.div(10,rate),true,2)+(linear.eq(1)?"":" until their amount reaches "+shorten(linear))
			let ret=getQuarkSpinProduction(shorthand)
			document.getElementById(color+"QuarkSpinProduction").textContent="+"+shortenMoney(ret)+"/s"
			if (branchNum==c+1) {
				for (var u=1;u<4;u++) document.getElementById(color+"upg"+u).className="gluonupgrade "+(branch.spin.lt(getBranchUpgCost(shorthand,u))?"unavailablebtn":shorthand)
				if (ghostified) document.getElementById(shorthand+"RadioactiveDecay").className="gluonupgrade "+(branch.quarks.lt(Decimal.pow(10,Math.pow(2,50)))?"unavailablebtn":shorthand)
			}
		}
		if (branchNum<1) for (var u=1;u<9;u++) {
			document.getElementById("treeupg"+u).className="gluonupgrade "+(canBuyTreeUpg(u)?shorthands[getTreeUpgradeLevel(u)%3]:"unavailablebtn")
			document.getElementById("treeupg"+u+"current").textContent=getTreeUpgradeEffectDesc(u)
		}
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
	var colors=['r','g','b']
	if (player.masterystudies) {
		if (player.ghostify.milestones<2) {
			var sorted=[]
			for (s=1;s<4;s++) {
				var search=''
				for (i=0;i<3;i++) if (!sorted.includes(colors[i])&&(search==''||player.quantum.usedQuarks[colors[i]].gte(player.quantum.usedQuarks[search]))) search=colors[i]
				sorted.push(search)
			}
			colorCharge={color:sorted[0],charge:Decimal.sub(player.quantum.usedQuarks[sorted[0]]).sub(player.quantum.usedQuarks[sorted[1]])}
			if (player.quantum.usedQuarks[sorted[0]].gt(0)&&colorCharge.charge.eq(0)) giveAchievement("Hadronization")
		} else colorCharge={color:'r',charge:new Decimal(0)}
	} else {
		colorCharge={color:'r',charge:new Decimal(0)}
		return
	}
	if (player.ghostify.milestones<2) {
		document.getElementById("powerRate").textContent=shortenDimensions(colorCharge.charge)
		if (colorCharge.charge.eq(0)) {
			document.getElementById("colorChargeAmount").style.display='none'
			document.getElementById("colorCharge").textContent='neutral'
			document.getElementById("powerRate").className=''
			document.getElementById("colorPower").textContent=''
			document.getElementById("powerRate").parentElement.className=""
		} else {
			var color=colorShorthands[colorCharge.color]
			document.getElementById("colorChargeAmount").style.display=''
			document.getElementById("colorChargeAmount").className=color
			document.getElementById("colorChargeAmount").textContent=shortenDimensions(colorCharge.charge)
			document.getElementById("colorCharge").textContent=' '+color
			document.getElementById("powerRate").className=color
			document.getElementById("colorPower").textContent=color+' power'
			document.getElementById("powerRate").parentElement.className=colorCharge.color+"qC"
		}
	} else for (c=0;c<3;c++) document.getElementById(colors[c]+"PowerRate").textContent=shortenDimensions(player.quantum.usedQuarks[colors[c]])
	document.getElementById("redQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.r)
	document.getElementById("greenQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.g)
	document.getElementById("blueQuarks").textContent=shortenDimensions(player.quantum.usedQuarks.b)
	var canAssign=player.quantum.quarks.gt(0)
	document.getElementById("boost").style.display=player.dilation.active?"":"none"
	document.getElementById("redAssign").className=canAssign?"storebtn":"unavailablebtn"
	document.getElementById("greenAssign").className=canAssign?"storebtn":"unavailablebtn"
	document.getElementById("blueAssign").className=canAssign?"storebtn":"unavailablebtn"
	document.getElementById("rggain").textContent=shortenDimensions(player.quantum.usedQuarks.r.min(player.quantum.usedQuarks.g))
	document.getElementById("gbgain").textContent=shortenDimensions(player.quantum.usedQuarks.g.min(player.quantum.usedQuarks.b))
	document.getElementById("brgain").textContent=shortenDimensions(player.quantum.usedQuarks.b.min(player.quantum.usedQuarks.r))
	document.getElementById("rednext").textContent=shortenDimensions(player.quantum.usedQuarks.r.sub(player.quantum.usedQuarks.r.min(player.quantum.usedQuarks.g)).round())
	document.getElementById("greennext").textContent=shortenDimensions(player.quantum.usedQuarks.g.sub(player.quantum.usedQuarks.g.min(player.quantum.usedQuarks.b)).round())
	document.getElementById("bluenext").textContent=shortenDimensions(player.quantum.usedQuarks.b.sub(player.quantum.usedQuarks.b.min(player.quantum.usedQuarks.r)).round())
	document.getElementById("assignAllButton").className=canAssign?"storebtn":"unavailablebtn"
	document.getElementById("bluePowerMDEffect").style.display=player.masterystudies.includes("t383")?"":"none"
	if (player.masterystudies.includes("d13")) {
		document.getElementById("redQuarksToD").textContent=shortenDimensions(player.quantum.usedQuarks.r)
		document.getElementById("greenQuarksToD").textContent=shortenDimensions(player.quantum.usedQuarks.g)
		document.getElementById("blueQuarksToD").textContent=shortenDimensions(player.quantum.usedQuarks.b)	
		document.getElementById("redUnstableGain").className=player.quantum.usedQuarks.r.gt(0)?"storebtn":"unavailablebtn"
		document.getElementById("greenUnstableGain").className=player.quantum.usedQuarks.g.gt(0)?"storebtn":"unavailablebtn"
		document.getElementById("blueUnstableGain").className=player.quantum.usedQuarks.b.gt(0)?"storebtn":"unavailablebtn"
	}
}

function assignQuark(color) {
	if (color!="r"&&player.quantum.times<2&&!ghostified) if (!confirm("It is recommended to assign your first quarks to red. Are you sure you want to do that?")) return
	var usedQuarks=player.quantum.quarks.floor()
	player.quantum.usedQuarks[color]=player.quantum.usedQuarks[color].add(usedQuarks).round()
	player.quantum.quarks=player.quantum.quarks.sub(usedQuarks)
	document.getElementById("quarks").innerHTML="You have <b class='QKAmount'>0</b> quarks."
	updateColorCharge()
}

//v1.75
GUCosts=[null, 1, 2, 4, 100, 7e15, 4e19, 3e28, "1e570"]

function updateGluons(mode) {
	if (!player.masterystudies) return
	else if (!player.quantum.gluons.rg) {
		player.quantum.gluons = {
			rg: new Decimal(0),
			gb: new Decimal(0),
			br: new Decimal(0)
		}
	}
	if (player.ghostify.milestones<8&&!player.achievements.includes("ng3p66")) mode=undefined
	if (mode==undefined||mode=="display") {
		document.getElementById("rg").textContent=shortenDimensions(player.quantum.gluons.rg)
		document.getElementById("gb").textContent=shortenDimensions(player.quantum.gluons.gb)
		document.getElementById("br").textContent=shortenDimensions(player.quantum.gluons.br)
	}
	var names=["rg","gb","br"]
	var sevenUpgrades=player.masterystudies.includes("d9")
	var eightUpgrades=player.masterystudies.includes("d13")
	if (mode==undefined) for (r=3;r<5;r++) document.getElementById("gupgrow"+r).style.display=sevenUpgrades?"":"none"
	for (c=0;c<3;c++) {
		if (mode==undefined) {
			document.getElementById(names[c]+"upg7col").setAttribute("colspan",eightUpgrades?1:2)
			document.getElementById(names[c]+"upg8col").style.display=eightUpgrades?"":"none"
		}
		if (mode==undefined||mode=="display") {
			var name=names[c]
			for (u=1;u<=(eightUpgrades?8:sevenUpgrades?7:4);u++) {
				var upg=name+"upg"+u
				if (u>4) document.getElementById(upg+"cost").textContent=shortenMoney(new Decimal(GUCosts[u]))
				if (player.quantum.upgrades.includes(name+u)) document.getElementById(upg).className="gluonupgradebought small "+name
				else if (player.quantum.gluons[name].lt(GUCosts[u])) document.getElementById(upg).className="gluonupgrade small unavailablebtn"
				else document.getElementById(upg).className="gluonupgrade small "+name
			}
			var upg=name+"qk"
			var cost=Decimal.pow(100,player.quantum.multPower[name]+Math.max(player.quantum.multPower[name]-467,0)).times(500)
			document.getElementById(upg+"cost").textContent=shortenDimensions(cost)
			if (player.quantum.gluons[name].lt(cost)) document.getElementById(upg+"btn").className="gluonupgrade unavailablebtn"
			else document.getElementById(upg+"btn").className="gluonupgrade "+name
		}
	}
	if (mode==undefined||mode=="display") document.getElementById("qkmultcurrent").textContent=shortenDimensions(Decimal.pow(2, player.quantum.multPower.total))
}

function buyGluonUpg(color, id) {
	var name=color+id
	if (player.quantum.upgrades.includes(name)||player.quantum.gluons[color].lt(GUCosts[id])) return
	player.quantum.upgrades.push(name)
	player.quantum.gluons[color]=player.quantum.gluons[color].sub(GUCosts[id])
	updateGluons("spend")
	if (name=="gb3") {
		var otherMults=1
		if (player.achievements.includes("r85")) otherMults*=4
		if (player.achievements.includes("r93")) otherMults*=4
		player.infMult=player.infMult.div(otherMults).pow(Math.log10(2.3)/Math.log10(ipMultPower)).times(otherMults)
		ipMultPower=2.3
		document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by "+ipMultPower+"<br>currently: "+shorten(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
	}
	if (name=="rg4" && !player.quantum.autoOptions.sacrifice) updateElectronsEffect()
	if (name=="gb4") player.tickSpeedMultDecrease=1.25
	updateQuantumWorth()
}

function GUBought(id) {
	if (!player.masterystudies) return false
	return player.quantum.upgrades.includes(id)
}

//v1.79
var speedrunMilestonesReached
var speedrunMilestones = [12,9,6,4.5,3,2,1,8/9,7/9,6/9,5/9,4/9,3/9,2/9,1/9,1/12,1/15,7/120,1/20,1/24,1/30,1/40,1/60,1/120,1/180,1/240,1/360,1/720]
function updateSpeedruns() {
	speedrunMilestonesReached = 0
	if (player.masterystudies) {
		for (i=0;i<28;i++) {
			if (player.quantum.best>speedrunMilestones[i]*36e3&&player.ghostify.milestones<1) break
			speedrunMilestonesReached++
		}
		document.getElementById('sacrificeAuto').style.display=speedrunMilestonesReached>24?"":"none"
		for (i=1;i<29;i++) document.getElementById("speedrunMilestone"+i).className="achievement achievement"+(speedrunMilestonesReached>=i?"un":"")+"locked"
		for (i=1;i<5;i++) document.getElementById("speedrunRow"+i).className=speedrunMilestonesReached<(i>3?28:i*8)?"":"completedrow"
	}
}

function toggleAutoTT() {
	if (speedrunMilestonesReached < 2) maxTheorems()
	else player.autoEterOptions.tt = !player.autoEterOptions.tt
	document.getElementById("theoremmax").innerHTML = speedrunMilestonesReached > 2 ? ("Auto max: O"+(player.autoEterOptions.tt?"N":"FF")) : "Buy max Theorems"
}

//v1.8
function doAutoMetaTick() {
	if (!player.masterystudies) return
	if (player.autoEterOptions.rebuyupg && speedrunMilestonesReached > 6) {
		if (speedrunMilestonesReached > 25) maxAllDilUpgs()
		else {
			for (i=0;i<1;i++) {
				buyDilationUpgrade(11)
				buyDilationUpgrade(3)
				buyDilationUpgrade(1)
				buyDilationUpgrade(2)
			}
		}
	}
	for (dim=8;dim>0;dim--) if (player.autoEterOptions["md"+dim] && speedrunMilestonesReached > 5+dim) buyMaxMetaDimension(dim)
	if (player.autoEterOptions.metaboost && speedrunMilestonesReached > 14) metaBoost()
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
	document.getElementById("metaMaxAllDiv").style.display=turnOn&&stop>7&&speedrunMilestonesReached>27?"none":""
}

function sacrificeGalaxy(auto=false) {
	var amount=player.galaxies-player.quantum.electrons.sacGals
	if (amount<1) return
	if (player.options.sacrificeConfirmation&&!auto) if (!confirm("Sacrificing your galaxies reduces your tickspeed and so your tick interval. You will gain a boost for multiplier per ten dimensions. Are you sure you want to do that?")) return
	var old=new Decimal(getTickSpeedMultiplier()).log10()
	player.quantum.electrons.sacGals+=amount
	player.quantum.electrons.amount+=getELCMult()*amount
	player.tickspeed=player.tickspeed.pow(old/new Decimal(getTickSpeedMultiplier()).log10())
	if (!player.quantum.autoOptions.sacrifice) updateElectronsEffect()
}

function getMPTPower(on) {
	if (!inQC(0)) return 1
	a = player.quantum.electrons.amount
	if (a>187300) a = Math.sqrt((a-149840)*37460)+149840
	if (GUBought("rg4")) a *= 0.7
	if (player.masterystudies != undefined) if (on == undefined ? player.masterystudies.includes("d13") : on) a *= Math.sqrt(getTreeUpgradeEffect(4))
	return a+1
}

//v1.8
function isRewardEnabled(id) {
	if (!player.masterystudies) return false
	return speedrunMilestonesReached>=id&&!player.quantum.disabledRewards[id]
}

function disableReward(id) {
	player.quantum.disabledRewards[id]=!player.quantum.disabledRewards[id]
	document.getElementById("reward"+id+"disable").textContent=(id>11?"10 seconds":id>4?"33.3 mins":(id>3?4.5:6)+" hours")+" reward: O"+(player.quantum.disabledRewards[id]?"FF":"N")
}

function updateElectrons() {
	if (player.masterystudies ? !player.masterystudies.includes("d7") : true) {
		document.getElementById("electronstabbtn").style.display="none"
		return
	} else document.getElementById("electronstabbtn").style.display=""
	document.getElementById("electronsGainMult").textContent=getELCMult().toFixed(2)
	if (!player.quantum.autoOptions.sacrifice) updateElectronsEffect()
	for (u=1;u<5;u++) {
		var cost=getElectronUpgCost(u)
		document.getElementById("electronupg"+u).innerHTML="Upgrade multiplier with "+([null,"time theorems","dilated time","meta-antimatter","meta-dimension boosts"])[u]+".<br>Cost: "+(u>3?getFullExpansion(getElectronUpgCost(u)):shortenCosts(getElectronUpgCost(u)))+([null," TT"," DT"," MA"," MDB"])[u]
	}
}

//v1.9
function getElectronUpgCost(u) {
	var amount=player.quantum.electrons.rebuyables[u-1]
	var baseCost=([0,82,153,638,26])[u]+Math.pow(amount*Math.max(amount-1,1)+1,u<2?1:2)
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
function buyQuarkMult(name) {
	var cost=Decimal.pow(100,player.quantum.multPower[name]+Math.max(player.quantum.multPower[name]-467,0)).times(500)
	if (player.quantum.gluons[name].lt(cost)) return
	player.quantum.gluons[name]=player.quantum.gluons[name].sub(cost).round()
	player.quantum.multPower[name]++
	player.quantum.multPower.total++
	updateGluons("spend")
	if (player.quantum.autobuyer.mode === 'amount') {
		player.quantum.autobuyer.limit = Decimal.times(player.quantum.autobuyer.limit, 2)
		document.getElementById("priorityquantum").value = formatValue("Scientific", player.quantum.autobuyer.limit, 2, 0);
	}
}

var quantumChallenges={
	costs:[0,16750,19100,21500,24050,25900,28900,31850,33600],
	goals:[0,665e7,768e8,4525e7,5325e7,1344e7,561e6,6254e7,2925e7]
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
	document.getElementById("bigrip").style.display = player.masterystudies.includes("d14") ? "" : "none"
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
			document.getElementById(property+"cost").textContent="Cost: "+(sc2?getFullExpansion(getQCCost(pc+8)):"???")+" electrons"
			document.getElementById(property+"goal").textContent="Goal: "+(sc2?shortenCosts(Decimal.pow(10,getQCGoal(pc+8))):"???")+" antimatter"
			document.getElementById(property).textContent=pcFocus==pc?"Cancel":(player.quantum.pairedChallenges.order[pc]?player.quantum.pairedChallenges.order[pc].length<2:true)?"Assign":player.quantum.pairedChallenges.completed>=pc?"Completed":player.quantum.pairedChallenges.completed+1<pc?"Locked":player.quantum.pairedChallenges.current==pc?"Running":"Start"
			document.getElementById(property).className=pcFocus==pc||(player.quantum.pairedChallenges.order[pc]?player.quantum.pairedChallenges.order[pc].length<2:true)?"challengesbtn":player.quantum.pairedChallenges.completed>=pc?"completedchallengesbtn":player.quantum.pairedChallenges.completed+1<pc?"lockedchallengesbtn":player.quantum.pairedChallenges.current==pc?"onchallengebtn":"challengesbtn"

			var sc1t=Math.min(sc1,sc2)
			var sc2t=Math.max(sc1,sc2)
			if (player.masterystudies.includes("d14")) {
				document.getElementById(property + "br").style.display = ""
				document.getElementById(property + "br").textContent = sc1t != 6 || sc2t != 8 ? "QC6 & 8" : player.quantum.bigRip.active ? "Big Ripped" : player.quantum.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
				document.getElementById(property + "br").className = sc1t != 6 || sc2t != 8 ? "lockedchallengesbtn" : player.quantum.bigRip.active ? "onchallengebtn" : player.quantum.pairedChallenges.completed + 1 < pc ? "lockedchallengesbtn" : "bigripbtn"
			} else document.getElementById(property + "br").style.display = "none"
		}
	}
	if (player.masterystudies.includes("d14")) {
		document.getElementById("spaceShards").textContent = shortenDimensions(player.quantum.bigRip.spaceShards)
		document.getElementById("spaceShards2").textContent = shortenDimensions(player.quantum.bigRip.spaceShards)
		for (var u=1;u<18;u++) {
			document.getElementById("bigripupg"+u).className = player.quantum.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" : player.quantum.bigRip.spaceShards.lt(bigRipUpgCosts[u]) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
			document.getElementById("bigripupg"+u+"cost").textContent = shortenDimensions(new Decimal(bigRipUpgCosts[u]))
		}
	}
	for (qc=1;qc<9;qc++) {
		var property="qc"+qc
		document.getElementById(property+"div").style.display=(qc<2||QCIntensity(qc-1))?"inline-block":"none"
		document.getElementById(property).textContent=((!assigned.includes(qc)&&pcFocus)?"Choose":inQC(qc)?"Running":QCIntensity(qc)?(assigned.includes(qc)?"Assigned":"Completed"):"Start")+(assigned.includes(qc)?" (PC"+assignedNums[qc]+")":"")
		document.getElementById(property).className=(!assigned.includes(qc)&&pcFocus)?"challengesbtn":inQC(qc)?"onchallengebtn":QCIntensity(qc)?"completedchallengesbtn":"challengesbtn"
		document.getElementById(property+"cost").textContent="Cost: "+getFullExpansion(quantumChallenges.costs[qc])+" electrons"
		document.getElementById(property+"goal").textContent="Goal: "+shortenCosts(Decimal.pow(10,getQCGoal(qc)))+" antimatter"
	}
	document.getElementById("qc2reward").textContent = Math.round(getQCReward(2)*100-100)
	document.getElementById("qc7desc").textContent="Dimension & tickspeed cost multiplier increases are "+shorten(Number.MAX_VALUE)+"x. Multiplier per ten dimensions and meta-antimatter's effect on dimension boosts are disabled. "
	document.getElementById("qc7reward").textContent = (100-getQCReward(7)*100).toFixed(2)
	document.getElementById("qc8reward").textContent = getQCReward(8)
}

function inQC(num) {
	var data=getCurrentQCData()
	if (num>0) return data.includes(num)
	return data.length<1
}

//v1.95?
function getQCGoal(num) {
	if (player.masterystudies==undefined) return 0
	var c1=0
	var c2=0
	if (num==undefined) {
		var data=getCurrentQCData()
		if (data[0]) c1=data[0]
		if (data[1]) c2=data[1]
	} else if (num<9) {
		c1=num
	} else if (player.quantum.pairedChallenges.order[num-8]) {
		c1=player.quantum.pairedChallenges.order[num-8][0]
		c2=player.quantum.pairedChallenges.order[num-8][1]
	}
	if (c1==0) return quantumChallenges.goals[0]
	if (c2==0) return quantumChallenges.goals[c1]
	var cs=[c1,c2]
	var mult=1
	if (cs.includes(1)&&cs.includes(3)) mult=1.6
	if (cs.includes(2)&&cs.includes(6)) mult=1.7
	if (cs.includes(3)&&cs.includes(7)) mult=2.68
	return quantumChallenges.goals[c1]*quantumChallenges.goals[c2]/1e11*mult
}

function QCIntensity(num) {
	if (player.masterystudies != undefined) if (player.quantum != undefined) if (player.quantum.challenges != undefined) if (player.quantum.challenges[num] != undefined) return player.quantum.challenges[num]
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

//v1.99795
function updateMasteryStudyTextDisplay() {
	if (!player.masterystudies) return
	document.getElementById("costmult").textContent=shorten(masterystudies.costmult)
	for (id=0;id<(quantumed?masterystudies.allTimeStudies.length:10);id++) {
		var name=masterystudies.allTimeStudies[id]
		document.getElementById("ts"+name+"Cost").textContent="Cost: "+shorten(masterystudies.costs.time[name])+" Time Theorems"
	}
	for (id=13;id<15;id++) {
		document.getElementById("ec"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.ec[id])+" Time Theorems"
		document.getElementById("ec"+id+"Req").style.display=player.etercreq==id?"none":"block"
	}
	document.getElementById("ec13Req").textContent="Requirement: "+getFullExpansion(masterystudies.reqs[13])+" dimension boosts"
	document.getElementById("ec14Req").textContent="Requirement: "+getFullExpansion(masterystudies.reqs[14])+"% replicate chance"
	if (quantumed) {
		for (id=7;id<11;id++) document.getElementById("ds"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.dil[id])+" Time Theorems"
		document.getElementById("ds8Req").innerHTML=ghostified?"":"<br>Requirement: "+shorten(16750)+" electrons"
		document.getElementById("ds9Req").innerHTML=ghostified?"":"<br>Requirement: Complete Quantum Challenge 8"
		document.getElementById("ds10Req").innerHTML=ghostified?"":"<br>Requirement: Complete Paired Challenge 4"
		document.getElementById("321effect").textContent=shortenCosts(new Decimal("1e430"))
	}
	if (player.masterystudies.includes("d10")) {
		for (id=341;id<345;id++) document.getElementById("ts"+id+"Cost").textContent="Cost: "+shorten(masterystudies.costs.time[id])+" Time Theorems"
		document.getElementById("ds11Cost").textContent="Cost: "+shorten(3e90)+" Time Theorems"
		document.getElementById("ds11Req").innerHTML=ghostified?"":"<br>Requirement: 10 worker replicants"
	}
	if (player.masterystudies.includes("d11")) {
		document.getElementById("ds12Cost").textContent="Cost: "+shorten(3e92)+" Time Theorems"
		document.getElementById("ds12Req").innerHTML=ghostified?"":"<br>Requirement: 10 8th Emperor Dimensions"
	}
	if (player.masterystudies.includes("d12")) {
		document.getElementById("ds13Cost").textContent="Cost: "+shorten(1e95)+" Time Theorems"
		document.getElementById("ds13Req").innerHTML=ghostified?"":"<br>Requirement: 15 Nanofield rewards"
		document.getElementById("ds14Cost").textContent="Cost: "+shorten(2e98)+" Time Theorems"
		document.getElementById("ds14Req").innerHTML=ghostified?"":"<br>Requirement: 'The Challenging Day' achievement"
	}
}

var quarks={}
var centerX
var centerY
var maxDistance
var code

function drawQuarkAnimation(ts){
	centerX=canvas.width/2
	centerY=canvas.height/2
	maxDistance=Math.sqrt(Math.pow(centerX,2)+Math.pow(centerY,2))
	code=player.options.theme=="Aarex's Modifications"?"e5":"99"
	if (document.getElementById("quantumtab").style.display !== "none" && document.getElementById("uquarks").style.display !== "none" && player.options.animations.quarks) {
		qkctx.clearRect(0, 0, canvas.width, canvas.height);
		quarks.sum=player.quantum.colorPowers.r.max(1).log10()+player.quantum.colorPowers.g.max(1).log10()+player.quantum.colorPowers.b.max(1).log10()
		quarks.amount=Math.ceil(Math.min(quarks.sum,200))
		for (p=0;p<quarks.amount;p++) {
			var particle=quarks['p'+p]
			if (particle==undefined) {
				particle={}
				var random=Math.random()
				if (random<=player.quantum.colorPowers.r.max(1).log10()/quarks.sum) particle.type='r'
				else if (random>=1-player.quantum.colorPowers.b.max(1).log10()/quarks.sum) particle.type='b'
				else particle.type='g'
				particle.motion=Math.random()>0.5?'in':'out'
				particle.direction=Math.random()*Math.PI*2
				particle.distance=Math.random()
				quarks['p'+p]=particle
			} else {
				particle.distance+=0.01
				if (particle.distance>=1) {
					var random=Math.random()
					if (random<=player.quantum.colorPowers.r.max(1).log10()/quarks.sum) particle.type='r'
					else if (random>=1-player.quantum.colorPowers.b.max(1).log10()/quarks.sum) particle.type='b'
					else particle.type='g'
					particle.motion=Math.random()>0.5?'in':'out'
					particle.direction=Math.random()*Math.PI*2
					particle.distance=0
				}
				var actualDistance=particle.distance*maxDistance
				if (particle.motion=="in") actualDistance=maxDistance-actualDistance
				qkctx.fillStyle=particle.type=="r"?"#"+code+"0000":particle.type=="g"?"#00"+code+"00":"#0000"+code
				point(centerX+Math.sin(particle.direction)*actualDistance, centerY+Math.cos(particle.direction)*actualDistance, qkctx)
			}
		}
		delta = (ts - lastTs) / 1000;
		lastTs = ts;
		requestAnimationFrame(drawQuarkAnimation);
	}
}

//v1.99798
function maxQuarkMult() {
	var names=["rg","gb","br"]
	var bought=0
	for (c=0;c<3;c++) {
		var name=names[c]
		var buying=true
		while (buying) {
			var cost=Decimal.pow(100,player.quantum.multPower[name]+Math.max(player.quantum.multPower[name]-467,0)).times(500)
			if (player.quantum.gluons[name].lt(cost)) buying=false
			else if (player.quantum.multPower[name]<468) {
				var toBuy=Math.min(Math.floor(player.quantum.gluons[name].div(cost).times(99).add(1).log(100)),468-player.quantum.multPower[name])
				var toSpend=Decimal.pow(100,toBuy).sub(1).div(99).times(cost)
				if (toSpend.gt(player.quantum.gluons[name])) player.quantum.gluons[name]=new Decimal(0)
				else player.quantum.gluons[name]=player.quantum.gluons[name].sub(toSpend).round()
				player.quantum.multPower[name]+=toBuy
				bought+=toBuy
			} else {
				var toBuy=Math.floor(player.quantum.gluons[name].div(cost).times(9999).add(1).log(1e4))
				var toSpend=Decimal.pow(1e4,toBuy).sub(1).div(9999).times(cost)
				if (toSpend.gt(player.quantum.gluons[name])) player.quantum.gluons[name]=new Decimal(0)
				else player.quantum.gluons[name]=player.quantum.gluons[name].sub(toSpend).round()
				player.quantum.multPower[name]+=toBuy
				bought+=toBuy
			}
		}
	}
	player.quantum.multPower.total+=bought
	if (player.quantum.autobuyer.mode === 'amount') {
		player.quantum.autobuyer.limit = Decimal.times(player.quantum.autobuyer.limit, Decimal.pow(2, bought))
		document.getElementById("priorityquantum").value = formatValue("Scientific", player.quantum.autobuyer.limit, 2, 0)
	}
	updateGluons("spend")
}

//v1.99799
function respecOptions() {
	closeToolTip()
	document.getElementById("respecoptions").style.display="flex"
}

//v1.998
function toggleAutoQuantumContent(id) {
	player.quantum.autoOptions[id]=!player.quantum.autoOptions[id]
	if (id=='sacrifice') {
		document.getElementById('sacrificeAuto').textContent="Auto: O"+(player.quantum.autoOptions.sacrifice?"N":"FF")
		if (player.quantum.autoOptions.sacrifice) sacrificeGalaxy(6)
	}
}

function updateReplicants(mode) {
	if (player.masterystudies==undefined?true:player.ghostify.milestones<8&&!player.achievements.includes("ng3p66")) mode=undefined
	if (mode === undefined) {
		if (player.masterystudies ? !player.masterystudies.includes("d10") : true) {
			document.getElementById("replicantstabbtn").style.display="none"
			return
		} else document.getElementById("replicantstabbtn").style.display=""
	}
	if (mode === undefined || mode === "display") {
		document.getElementById("rgRepl").textContent=shortenDimensions(player.quantum.gluons.rg)
		document.getElementById("gbRepl").textContent=shortenDimensions(player.quantum.gluons.gb)
		document.getElementById("brRepl").textContent=shortenDimensions(player.quantum.gluons.br)

		document.getElementById("quantumFoodAmount").textContent=getFullExpansion(player.quantum.replicants.quantumFood)
		document.getElementById("buyQuantumFood").innerHTML="Buy 1 quantum food<br>Cost: "+shortenDimensions(player.quantum.replicants.quantumFoodCost)+" for all 3 gluons"
		document.getElementById("buyQuantumFood").className="gluonupgrade "+(player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).lt(player.quantum.replicants.quantumFoodCost)?"unavailabl":"stor")+"ebtn"
		document.getElementById("breakLimit").innerHTML="Limit of workers: "+getLimitMsg()+(isLimitUpgAffordable()?" -> "+getNextLimitMsg()+"<br>Cost: "+shortenDimensions(player.quantum.replicants.limitCost)+" for all 3 gluons":"")
		document.getElementById("breakLimit").className=(player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).lt(player.quantum.replicants.limitCost)||!isLimitUpgAffordable()?"unavailabl":"stor")+"ebtn"
		document.getElementById("reduceHatchSpeed").className=(player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).lt(player.quantum.replicants.hatchSpeedCost)?"unavailabl":"stor")+"ebtn"
		if (player.masterystudies.includes('d11')) {
			document.getElementById("quantumFoodAmountED").textContent=getFullExpansion(player.quantum.replicants.quantumFood)
			document.getElementById("buyQuantumFoodED").innerHTML="Buy 1 quantum food<br>Cost: "+shortenDimensions(player.quantum.replicants.quantumFoodCost)+" for all 3 gluons"
			document.getElementById("buyQuantumFoodED").className="gluonupgrade "+(player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).lt(player.quantum.replicants.quantumFoodCost)?"unavailabl":"stor")+"ebtn"
			document.getElementById("breakLimitED").innerHTML="Limit of workers: "+getLimitMsg()+(isLimitUpgAffordable()?" -> "+getNextLimitMsg()+"<br>Cost: "+shortenDimensions(player.quantum.replicants.limitCost)+" for all 3 gluons":"")
			document.getElementById("breakLimitED").className=(player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).lt(player.quantum.replicants.limitCost)||!isLimitUpgAffordable()?"unavailabl":"stor")+"ebtn"
		}
	}
}

function replicantReset() {
	if (player.replicanti.amount.lt(player.quantum.replicants.requirement)) return
	if (!player.achievements.includes("ng3p47")) player.replicanti.amount=new Decimal(1)
	player.quantum.replicants.amount=player.quantum.replicants.amount.add(1)
	player.quantum.replicants.requirement=player.quantum.replicants.requirement.times("1e100000")
}

function getGatherRate() {
	var mult = new Decimal(1)
	if (player.masterystudies.includes("t373")) mult = getMTSMult(373)
	var data = {
		normal: player.quantum.replicants.amount.times(mult),
		babies: player.quantum.replicants.babies.times(mult).div(20),
		workers : { }
	}
	data.total = data.normal.add(data.babies)
	data.workersTotal = new Decimal(0)
	for (var d=1; d<9; d++) {
		data.workers[d] = eds[d].workers.times(mult).times(Decimal.pow(20, d))
		data.workersTotal = data.workersTotal.add(data.workers[d])
	}
	data.total = data.total.add(data.workersTotal)
	return data
}

function buyQuantumFood() {
	if (player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).gte(player.quantum.replicants.quantumFoodCost)) {
		player.quantum.gluons.rg=player.quantum.gluons.rg.sub(player.quantum.replicants.quantumFoodCost)
		player.quantum.gluons.gb=player.quantum.gluons.gb.sub(player.quantum.replicants.quantumFoodCost)
		player.quantum.gluons.br=player.quantum.gluons.br.sub(player.quantum.replicants.quantumFoodCost)
		player.quantum.replicants.quantumFood++
		player.quantum.replicants.quantumFoodCost=player.quantum.replicants.quantumFoodCost.times(5)
		updateGluons("spend")
		updateReplicants("spend")
	}
}

function reduceHatchSpeed() {
	if (player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).gte(player.quantum.replicants.hatchSpeedCost)) {
		player.quantum.gluons.rg=player.quantum.gluons.rg.sub(player.quantum.replicants.hatchSpeedCost)
		player.quantum.gluons.gb=player.quantum.gluons.gb.sub(player.quantum.replicants.hatchSpeedCost)
		player.quantum.gluons.br=player.quantum.gluons.br.sub(player.quantum.replicants.hatchSpeedCost)
		player.quantum.replicants.hatchSpeed=player.quantum.replicants.hatchSpeed/1.1
		player.quantum.replicants.hatchSpeedCost=player.quantum.replicants.hatchSpeedCost.times(10)
		updateGluons("spend")
		updateReplicants("spend")
	}
}

function breakLimit() {
	if (player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br).gte(player.quantum.replicants.limitCost)&&isLimitUpgAffordable()) {
		player.quantum.gluons.rg=player.quantum.gluons.rg.sub(player.quantum.replicants.limitCost)
		player.quantum.gluons.gb=player.quantum.gluons.gb.sub(player.quantum.replicants.limitCost)
		player.quantum.gluons.br=player.quantum.gluons.br.sub(player.quantum.replicants.limitCost)
		player.quantum.replicants.limit++
		if (player.quantum.replicants.limit>10&&player.quantum.replicants.limitDim<8) {
			player.quantum.replicants.limit=1
			player.quantum.replicants.limitDim++
		}
		if (player.quantum.replicants.limit%10>0) player.quantum.replicants.limitCost=player.quantum.replicants.limitCost.times(200)
		updateGluons("spend")
		updateReplicants("spend")
	}
}

//v1.9984
function maxAllID() {
	for (t=1;t<9;t++) {
		var dim=player["infinityDimension"+t]
		if (player.infDimensionsUnlocked[t-1]&&player.infinityPoints.gte(dim.cost)) {
			var costMult=infCostMults[t]
			if (ECTimesCompleted("eterc12")) costMult=Math.pow(costMult,1-ECTimesCompleted("eterc12")*0.008)
			if (player.infinityPoints.lt(Decimal.pow(10, 1e10))) {
				var toBuy=Math.max(Math.floor(player.infinityPoints.div(9-t).div(dim.cost).times(costMult-1).add(1).log(costMult)),1)
				var toSpend=Decimal.pow(costMult,toBuy).sub(1).div(costMult-1).times(dim.cost).round()
				if (toSpend.gt(player.infinityPoints)) player.infinityPoints=new Decimal(0)
				else player.infinityPoints=player.infinityPoints.sub(toSpend)
			} else var toBuy = Math.floor(player.infinityPoints.div(dim.cost).log(costMult))
			dim.amount=dim.amount.add(toBuy*10)
			dim.baseAmount+=toBuy*10
			dim.power=dim.power.times(Decimal.pow(infPowerMults[t],toBuy))
			dim.cost=dim.cost.times(Decimal.pow(costMult,toBuy))
		}
	}
}

function hideMaxIDButton(onLoad=false) {
	if (!onLoad) if (!player.masterystudies) return
	var hide=true
	if (player.masterystudies&&player.currentEterChall!="eterc8") {
		hide=false
		if (player.eternities>17) {
			for (d=0;d<8;d++) {
				if (player.infDimBuyers[d]) {
					if (d>6) hide=true
				} else break
			}
		}
	}
	document.getElementById("maxAllID").style.display=hide?"none":""
}

//v1.9986
function respecMasteryToggle() {
	player.respecMastery=!player.respecMastery
	updateRespecButtons()
}

//v1.99861
function getCurrentQCData() {
	if (player.masterystudies==undefined) return []
	if (player.quantum==undefined) return []
	if (player.quantum.challenge==undefined) return []
	if (typeof(player.quantum.challenge)=="number") return [player.quantum.challenge]
	return player.quantum.challenge
}

//v1.9987
var bankedEterGain
function updateBankedEter(updateHtml=true) {
	bankedEterGain=0
	if (player.achievements.includes("ng3p15")) bankedEterGain=nD(player.eternities,5)
	if (updateHtml) {
		setAndMaybeShow("bankedEterGain",bankedEterGain>0,'"You will gain "+getFullExpansion(bankedEterGain)+" banked eternities on next quantum."')
		setAndMaybeShow("eternitiedBank",player.eternitiesBank,'"You have "+getFullExpansion(player.eternitiesBank)+" banked eternities."')
	}
}

//v1.99871
function hatchSpeedDisplay(next) {
	var speed = getHatchSpeed()
	if (next) speed /= 1.1
	if (speed < 1e-24) return shorten(1/speed)+"/s"
	return timeDisplayShort(speed*10, true, 1)
}

function fillAll() {
	var oldLength = player.timestudy.studies.length
	for (t=0;t<all.length;t++) buyTimeStudy(all[t], 0, true)
	if (player.timestudy.studies.length > oldLength) {
		updateTheoremButtons()
		updateTimeStudyButtons()
		drawStudyTree()
		if (player.timestudy.studies.length > 56) $.notify("All studies in time study tab are now filled.")
	}
}

//v1.99872
function maxAllDilUpgs(quick) {
	while (buyDilationUpgrade(11,true)) {}
	while (buyDilationUpgrade(3,true)) {}
	var cost=Decimal.pow(10,player.dilation.rebuyables[1]+5)
	if (player.dilation.dilatedTime.gte(cost)) {
		var toBuy=Math.floor(player.dilation.dilatedTime.div(cost).times(9).add(1).log10())
		var toSpend=Decimal.pow(10,toBuy).sub(1).div(9).times(cost)
		player.dilation.dilatedTime=player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
		player.dilation.rebuyables[1]+=toBuy
	}
	if (speedrunMilestonesReached>21) {
		var cost=Decimal.pow(10,player.dilation.rebuyables[2]*2+6)
		if (player.dilation.dilatedTime.gte(cost)) {
			var toBuy=Math.floor(player.dilation.dilatedTime.div(cost).times(99).add(1).log(100))
			var toSpend=Decimal.pow(100,toBuy).sub(1).div(99).times(cost)
			player.dilation.dilatedTime=player.dilation.dilatedTime.sub(player.dilation.dilatedTime.min(cost))
			player.dilation.rebuyables[2]+=toBuy
			resetDilationGalaxies()
		}
	} else buyDilationUpgrade(2,true)
	updateDilationUpgradeCosts()
	updateDilationUpgradeButtons()
	updateTimeStudyButtons()
}

function updateQCTimes() {
	document.getElementById("qcsbtn").style.display = "none"
	if (!player.masterystudies) return
	var temp=0
	var tempcounter=0
	for (var i=1;i<9;i++) {
		setAndMaybeShow("qctime"+i,player.quantum.challengeRecords[i],'"Quantum Challenge '+i+' time record: "+timeDisplayShort(player.quantum.challengeRecords['+i+'], false, 3)')
		if (player.quantum.challengeRecords[i]) {
			temp+=player.quantum.challengeRecords[i]
			tempcounter++
		}
	}
	if (tempcounter>0) document.getElementById("qcsbtn").style.display = "inline-block"
	setAndMaybeShow("qctimesum",tempcounter>1,'"Sum of completed quantum challenge time records is "+timeDisplayShort('+temp+', false, 3)')
}

//v1.99873
function updatePCCompletions() {
	document.getElementById("pccompletionsbtn").style.display = "none"
	if (!player.masterystudies) return
	var tempcounter=0
	var tempcounter2=0
	var ranking=0
	for (var c1=2;c1<9;c1++) for (var c2=1;c2<c1;c2++) {
		var rankingPart=0
		if (c2*10+c1==68 && ghostified) {
			rankingPart=2
			tempcounter++
		} else {
			if (player.quantum.pairedChallenges.completions[c2*10+c1]) {
				rankingPart=5-player.quantum.pairedChallenges.completions[c2*10+c1]
				tempcounter++
			}
			if (player.quantum.qcsNoDil["pc"+(c2*10+c1)]) {
				rankingPart+=5-player.quantum.qcsNoDil["pc"+(c2*10+c1)]
				tempcounter2++
			}
		}
		ranking+=Math.sqrt(rankingPart)
	}
	ranking=ranking/56*100
	if (tempcounter>0) document.getElementById("pccompletionsbtn").style.display = "inline-block"
	if (tempcounter>23) giveAchievement("The Challenging Day")
	document.getElementById("upcc").textContent = tempcounter
	document.getElementById("udcc").textContent = tempcounter2
	document.getElementById("pccranking").textContent = ranking.toFixed(1)
	for (r=1;r<9;r++) for (c=1;c<9;c++) {
		if (r!=c) {
			var divid = "pc" + (r*10+c)
			var pcid = r*10+c
			if (r>c) pcid = c*10+r
			var comp = player.quantum.pairedChallenges.completions[pcid]
			if (comp !== undefined) {
				document.getElementById(divid).textContent = "PC" + comp
				document.getElementById(divid).className = (player.quantum.qcsNoDil["pc" + pcid] ? "nd" : "pc" + comp) + "completed"
				var achTooltip = 'Fastest time: ' + (player.quantum.pairedChallenges.fastest[pcid] ? timeDisplayShort(player.quantum.pairedChallenges.fastest[pcid]) : "N/A")
				if (player.quantum.qcsNoDil["pc" + pcid]) achTooltip += ", No dilation: PC" + player.quantum.qcsNoDil["pc" + pcid]
				document.getElementById(divid).setAttribute('ach-tooltip', achTooltip)
				if (divid=="pc38") giveAchievement("Hardly marked")
			} else if (pcid == 68 && ghostified) {
				document.getElementById(divid).textContent = "BR"
				document.getElementById(divid).className = "brCompleted"
				document.getElementById(divid).removeAttribute('ach-tooltip')
				document.getElementById(divid).setAttribute('ach-tooltip', 'Fastest time from start of Ghostify: ' + timeDisplayShort(player.ghostify.best))
			} else {
				document.getElementById(divid).textContent = ""
				document.getElementById(divid).className = ""
				document.getElementById(divid).removeAttribute('ach-tooltip')
			}
		} else if (player.quantum.qcsNoDil["qc"+r]) {
			document.getElementById("qcC"+r).className = "ndcompleted"
			document.getElementById("qcC"+r).setAttribute('ach-tooltip', 'No dilation achieved!')
		} else {
			document.getElementById("qcC"+r).className = "pc1completed"
			document.getElementById("qcC"+r).removeAttribute('ach-tooltip')
		}
	}
}

//v1.99874
function getQCReward(num) {
	if (QCIntensity(num) < 1) return 1
	if (num == 1) return Decimal.pow(10, Math.pow(getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(2)).log10(), QCIntensity(1)>1?0.275:0.25)/200)
	if (num == 2) return 1.2 + QCIntensity(2) * 0.2
	if (num == 3) return Decimal.pow(10, Math.sqrt(Math.max(player.infinityPower.log10(), 0)/(QCIntensity(3)>1?2e8:1e9)))
	if (num == 4) {
		let mult = player.meta[2].amount.times(player.meta[4].amount).times(player.meta[6].amount).times(player.meta[8].amount).max(1)
		if (QCIntensity(4) > 1) return mult.pow(1/75)
		return Decimal.pow(10, Math.sqrt(mult.log10())/10)
	}
	if (num == 5) return Math.log10(1 + player.resets) * Math.pow(QCIntensity(5), 0.4)
	if (num == 6) return player.achPow.pow(QCIntensity(6)>1?3:1)
	if (num == 7) return Math.pow(0.975, QCIntensity(7))
	if (num == 8) return QCIntensity(8)+2
}

function maybeShowFillAll() {
	var display = "none"
	if (player.masterystudies) if (player.masterystudies.includes("t302")) display = "block"
	document.getElementById("fillAll").style.display = display
	document.getElementById("fillAll2").style.display = display
}

//v1.999
function getTotalReplicants(data) {
	let ret = getTotalWorkers(data)
	if (data == undefined) data = player
	return ret.add(data.quantum.replicants.amount).round()
}

function feedReplicant(tier, max) {
	if (!canFeedReplicant(tier)) return
	var toFeed = max ? Math.min(player.quantum.replicants.quantumFood, player.quantum.replicants.limitDim > tier ? Math.round(getWorkerAmount(tier - 1).toNumber() * 3) : Math.round((player.quantum.replicants.limit - eds[tier].perm - eds[tier].progress.toNumber()) * 3)) : 1
	if (tier<8) {
		var reduced = Math.max(toFeed - Math.round((10 - eds[tier].perm - eds[tier].progress.toNumber()) * 3), 0)
		if (reduced > 0) player.quantum.replicants.quantumFoodCost=player.quantum.replicants.quantumFoodCost.div(Decimal.pow(5, reduced))
	}
	eds[tier].progress=eds[tier].progress.add(toFeed/3)
	if (tier<8||getWorkerAmount(tier+1).eq(0)) eds[tier].progress=eds[tier].progress.times(3).round().div(3)
	if (eds[tier].progress.gte(1)) {
		var toAdd=eds[tier].progress.floor()
		if (tier>1) eds[tier-1].workers=eds[tier-1].workers.sub(toAdd.min(eds[tier-1].workers)).round()
		else player.quantum.replicants.amount=player.quantum.replicants.amount.sub(toAdd.min(player.quantum.replicants.amount)).round()
		eds[tier].progress=eds[tier].progress.sub(toAdd)
		eds[tier].workers=eds[tier].workers.add(toAdd).round()
		eds[tier].perm = Math.min(eds[tier].perm + Math.round(toAdd.toNumber()), tier > 7 ? 1/0 : 10)
		if (tier==2) giveAchievement("An ant office?")
	}
	player.quantum.replicants.quantumFood -= toFeed
	updateReplicants("spend")
}

function getWorkerAmount(tier) {
	if (tier<1) return player.quantum.replicants.amount
	if (tier>8) return new Decimal(0)
	return eds[tier].workers
}

function getTotalWorkers(data) {
	if (data) {
		if (data.quantum.emperorDimensions == undefined) return new Decimal(data.quantum.replicants.workers)
		data = data.quantum.emperorDimensions
	} else data = eds
	var total = new Decimal(0)
	for (var d=1; d<9; d++) total = total.add(data[d].workers)
	return total.round()
}

function buyMaxQuantumFood() {
	let minGluons = player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br)
	let toBuy = Math.floor(minGluons.div(player.quantum.replicants.quantumFoodCost).times(4).add(1).log(5))
	if (toBuy < 1) return
	let toSpend = Decimal.pow(5, toBuy).minus(1).div(4).times(player.quantum.replicants.quantumFoodCost)
	if (toSpend.gt(player.quantum.gluons.rg)) player.quantum.gluons.rg = new Decimal(0)
	else player.quantum.gluons.rg = player.quantum.gluons.rg.sub(toSpend)
	if (toSpend.gt(player.quantum.gluons.gb)) player.quantum.gluons.gb = new Decimal(0)
	else player.quantum.gluons.gb = player.quantum.gluons.gb.sub(toSpend)
	if (toSpend.gt(player.quantum.gluons.br)) player.quantum.gluons.br = new Decimal(0)
	else player.quantum.gluons.br = player.quantum.gluons.br.sub(toSpend)
	player.quantum.replicants.quantumFood += toBuy
	player.quantum.replicants.quantumFoodCost = player.quantum.replicants.quantumFoodCost.times(Decimal.pow(5, toBuy))
	updateGluons("spend")
	updateReplicants("spend")
}

function canFeedReplicant(tier, auto) {
	if (player.quantum.replicants.quantumFood<1 && !auto) return false
	if (tier>1) {
		if (eds[tier].workers.gte(eds[tier-1].workers)) return auto && hasNU(2)
		if (eds[tier-1].workers.lte(10)) return false
	} else {
		if (eds[1].workers.gte(player.quantum.replicants.amount)) return auto && hasNU(2)
		if (player.quantum.replicants.amount.eq(0)) return false
	}
	if (tier>player.quantum.replicants.limitDim) return false
	if (tier==player.quantum.replicants.limitDim) return getWorkerAmount(tier).lt(player.quantum.replicants.limit)
	return true
}

function isLimitUpgAffordable() {
	if (!player.masterystudies.includes("d11")) return player.quantum.replicants.limit < 10
	return true
}

function getLimitMsg() {
	if (!player.masterystudies.includes("d11")) return player.quantum.replicants.limit
	return player.quantum.replicants.limit+" ED"+player.quantum.replicants.limitDim+"s"
}

function getNextLimitMsg() {
	if (!player.masterystudies.includes("d11")) return player.quantum.replicants.limit+1
	if (player.quantum.replicants.limit > 9 && player.quantum.replicants.limitDim < 8) return "1 ED"+(player.quantum.replicants.limitDim+1)+"s"
	return (player.quantum.replicants.limit+1)+" ED"+player.quantum.replicants.limitDim+"s"
}

function getHatchSpeed() {
	var speed = player.quantum.replicants.hatchSpeed
	if (player.masterystudies.includes("t361")) speed /= getMTSMult(361)
	if (player.masterystudies.includes("t371")) speed /= getMTSMult(371)
	if (player.masterystudies.includes("t372")) speed /= getMTSMult(372)
	if (player.masterystudies.includes("t381")) speed /= getMTSMult(381)
	if (player.masterystudies.includes("t391")) speed /= getMTSMult(391)
	if (player.masterystudies.includes("d12")) speed /= getNanofieldRewardEffect(1)
	if (player.masterystudies.includes("t402")) speed /= 30
	return speed
}

var eds
function updateEmperorDimensions() {
	let production = getGatherRate()
	document.getElementById("replicantAmountED").textContent=shortenDimensions(player.quantum.replicants.amount)
	for (d=1;d<9;d++) {
		document.getElementById("empD"+d).textContent = DISPLAY_NAMES[d] + " Emperor Dimension x" + formatValue(player.options.notation, getEDMultiplier(d), 2, 1)
		
		var desc = shortenDimensions(eds[d].workers)
		if (d<8) desc += " (+" + shorten(getEDRateOfChange(d)) + dimDescEnd
		document.getElementById("empAmount"+d).textContent = desc
		document.getElementById("empFeed"+d).className=(canFeedReplicant(d)?"stor":"unavailabl")+"ebtn"
		document.getElementById("empFeed"+d).textContent="Feed ("+Math.round(eds[d].progress.toNumber()*100)+"%, "+eds[d].perm+" kept)"
		document.getElementById("empFeedMax"+d).className=(canFeedReplicant(d)?"stor":"unavailabl")+"ebtn"

		document.getElementById("empQuarks"+d).textContent = shorten(production.workers[d])
	}
	document.getElementById("totalWorkers").textContent = shortenDimensions(getTotalWorkers())
	document.getElementById("totalQuarkProduction").textContent = shorten(production.workersTotal)
	if (player.ghostify.milestones>7||player.achievements.includes("ng3p66")) updateReplicants("display")
}

function getEDMultiplier(dim) {
	let ret = new Decimal(1)
	if (player.currentEternityChall === "eterc11") return ret
	if (player.masterystudies.includes("t392")) ret = getMTSMult(392)
	if (player.masterystudies.includes("t402")) ret = ret.times(30)
	if (player.masterystudies.includes("d13")) ret = ret.times(getTreeUpgradeEffect(6))
	if (player.dilation.active || player.galacticSacrifice) ret = Decimal.pow(10, Math.pow(ret.log10(), dilationPowerStrength()))
	return ret
}

function getEDRateOfChange(dim) {
	if (!canFeedReplicant(dim, true)) return 0
	let toGain = getEDMultiplier(dim+1).times(eds[dim+1].workers).div(20)

	var current = eds[dim].workers.add(eds[dim].progress).max(1)
	if (player.aarexModifications.logRateChange) {
		var change = current.add(toGain).log10()-current.log10()
		if (change<0||isNaN(change)) change = 0
	} else var change = toGain.times(10).dividedBy(current)

	return change
}

//v1.9995
function maxReduceHatchSpeed() {
	let minGluons = player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br)
	let toBuy = Math.floor(minGluons.div(player.quantum.replicants.hatchSpeedCost).times(9).add(1).log10())
	if (toBuy < 1) return
	let toSpend = Decimal.pow(10, toBuy).minus(1).div(9).times(player.quantum.replicants.hatchSpeedCost)
	if (toSpend.gt(player.quantum.gluons.rg)) player.quantum.gluons.rg = new Decimal(0)
	else player.quantum.gluons.rg = player.quantum.gluons.rg.sub(toSpend)
	if (toSpend.gt(player.quantum.gluons.gb)) player.quantum.gluons.gb = new Decimal(0)
	else player.quantum.gluons.gb = player.quantum.gluons.gb.sub(toSpend)
	if (toSpend.gt(player.quantum.gluons.br)) player.quantum.gluons.br = new Decimal(0)
	else player.quantum.gluons.br = player.quantum.gluons.br.sub(toSpend)
	player.quantum.replicants.hatchSpeed /= Math.pow(1.1, toBuy)
	player.quantum.replicants.hatchSpeedCost = player.quantum.replicants.hatchSpeedCost.times(Decimal.pow(10, toBuy))
	updateGluons()
	updateReplicants()
}

function getQuarkChargeProduction() {
	let ret = getNanofieldRewardEffect("7g")
	if (hasNU(3)) ret = ret.times(tmp.nu[1])
	return ret
}

function startProduceQuarkCharge() {
	player.quantum.nanofield.producingCharge = !player.quantum.nanofield.producingCharge
	document.getElementById("produceQuarkCharge").innerHTML="S" + (player.quantum.nanofield.producingCharge ? "top" : "tart") + " production of preon charge." + (player.quantum.nanofield.producingCharge ? "" : "<br>(You will not get preons when you do this.)")
}

function getQuarkLossProduction() {
	let ret = getQuarkChargeProduction().pow(4).times(4e25)
	if (hasNU(3)) ret = ret.div(10)
	return ret
}

function getQuarkEnergyProduction() {
	let ret = player.quantum.nanofield.charge.sqrt()
	if (player.masterystudies.includes("t411")) ret = ret.times(getMTSMult(411))
	if (player.masterystudies.includes("t421")) ret = ret.times(getMTSMult(421))
	ret = ret.times(getNanofieldRewardEffect("8c"))
	if (ghostified && player.ghostify.neutrinos.boosts > 4) ret = ret.times(tmp.nb[4])
	return ret
}

function getQuarkAntienergyProduction() {
	let ret = player.quantum.nanofield.charge.sqrt()
	if (player.masterystudies.includes("t401")) ret = ret.div(getMTSMult(401))
	return ret
}

function getQuarkChargeProductionCap() {
	return player.quantum.nanofield.charge.times(2500).sqrt()
}

function getNanofieldRewardEffect(id) {
	var rewards = player.quantum.nanofield.rewards
	var stacks = Math.ceil((rewards - id + 1) / 8)
	if (id == 1) return Decimal.pow(30, stacks)
	if (id == 2) return stacks * 6.8
	if (id == 3) return 1 + Math.pow(stacks, 0.83) * 0.039
	if (id == 4) return 0.1 + Math.sqrt(stacks) * 0.021
	if (id == 5) return 1 + stacks * 0.36
	if (id == 6) return 3 + stacks * 1.34
	if (id == 7) return stacks * 2150
	if (id == "7g") return Decimal.pow(2.6,Math.ceil((rewards - 6) / 8))
	if (id == 8) return stacks * 0.76
	if (id == "8c") return player.quantum.nanofield.rewards>7?2.5:1
}

function updateAutoQuantumMode() {
	if (player.quantum.autobuyer.mode == "amount") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: amount"
		document.getElementById("autoquantumtext").textContent = "Amount of QK to wait until reset:"
	} else if (player.quantum.autobuyer.mode == "relative") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: X times last quantum"
		document.getElementById("autoquantumtext").textContent = "X times last quantum:"
	} else if (player.quantum.autobuyer.mode == "time") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: time"
		document.getElementById("autoquantumtext").textContent = "Seconds between quantums:"
	} else if (player.quantum.autobuyer.mode == "peak") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: peak"
		document.getElementById("autoquantumtext").textContent = "Seconds to wait after latest peak gain:"
	} else if (player.quantum.autobuyer.mode == "dilation") {
		document.getElementById("toggleautoquantummode").textContent = "Auto quantum mode: # of dilated"
		document.getElementById("autoquantumtext").textContent = "Wait until # of dilated stat:"
	}
}

function toggleAutoQuantumMode() {
	if (player.quantum.reachedInfQK && player.quantum.autobuyer.mode == "amount") player.quantum.autobuyer.mode = "relative"
	else if (player.quantum.autobuyer.mode == "relative") player.quantum.autobuyer.mode = "time"
	else if (player.quantum.autobuyer.mode == "time") player.quantum.autobuyer.mode = "peak"
	else if (player.achievements.includes("ng3p25") && player.quantum.autobuyer.mode != "dilation") player.quantum.autobuyer.mode = "dilation"
	else player.quantum.autobuyer.mode = "amount"
	updateAutoQuantumMode()
}

function assignAll(auto) {
	var ratios =  player.quantum.assignAllRatios
	var sum = ratios.r+ratios.g+ratios.b
	var oldQuarks = player.quantum.quarks.floor()
	var colors = ['r','g','b']
	for (c=0;c<3;c++) {
		var toAssign = oldQuarks.times(ratios[colors[c]]/sum).round()
		player.quantum.usedQuarks[colors[c]] = player.quantum.usedQuarks[colors[c]].add(toAssign).round()
		if (toAssign.gt(player.quantum.quarks)) player.quantum.quarks = new Decimal(0)
		else player.quantum.quarks = player.quantum.quarks.sub(toAssign)
		if (player.ghostify.milestones<8&&!player.achievements.includes("ng3p66")) player.quantum.quarks = player.quantum.quarks.round()
	}
	if (player.quantum.autoOptions.assignQKRotate) {
		if (player.quantum.autoOptions.assignQKRotate > 1) {
			player.quantum.assignAllRatios = {
				r: player.quantum.assignAllRatios.g,
				g: player.quantum.assignAllRatios.b,
				b: player.quantum.assignAllRatios.r
			}
		} else player.quantum.assignAllRatios = {
			r: player.quantum.assignAllRatios.b,
			g: player.quantum.assignAllRatios.r,
			b: player.quantum.assignAllRatios.g
		}
		var colors = ['r','g','b']
		for (c=0;c<3;c++) document.getElementById("ratio_" + colors[c]).value = player.quantum.assignAllRatios[colors[c]]
	}
	updateColorCharge()
}

function changeRatio(color) {
	var value = parseFloat(document.getElementById("ratio_" + color).value)
	if (value < 0 || isNaN(value)) {
		document.getElementById("ratio_" + color).value = player.quantum.assignAllRatios[color]
		return
	}
	var sum = 0
	var colors = ['r','g','b']
	for (c=0;c<3;c++) sum += colors[c] == color ? value : player.quantum.assignAllRatios[colors[c]]
	if (sum == 0 || sum == 1/0) {
		document.getElementById("ratio_" + color).value = player.quantum.assignAllRatios[color]
		return
	}
	player.quantum.assignAllRatios[color] = value
}

function toggleAutoAssign() {
	player.quantum.autoOptions.assignQK = !player.quantum.autoOptions.assignQK
	document.getElementById('autoAssign').textContent="Auto: O"+(player.quantum.autoOptions.assignQK?"N":"FF")
	if (player.quantum.autoOptions.assignQK && player.quantum.quarks.gt(0)) assignAll(true)
}

//v1.9997
function updateTODStuff() {
	if (player.masterystudies ? !player.masterystudies.includes("d13") : true) {
		document.getElementById("todtabbtn").style.display="none"
		return
	} else {
		document.getElementById("todtabbtn").style.display=""
		giveAchievement("Do protons decay?")
	}
	var colors=["red","green","blue"]
	var shorthands=["r","g","b"]
	for (var c=0;c<3;c++) {
		var color=colors[c]
		var shorthand=shorthands[c]
		var branch=player.quantum.tod[shorthand]
		var name=getUQName(shorthand)
		var decays=getRadioactiveDecays(shorthand)
		document.getElementById(shorthand+"UQName").textContent=name
		document.getElementById(color+"UpgPow1").textContent=decays>0?Math.pow(2,1+decays*0.1).toFixed(2):2
		for (var b=1;b<4;b++) {
			document.getElementById(color+"upg"+b+"current").textContent=shortenDimensions(Decimal.pow(b==3?4:2,getBranchUpgLevel(shorthand,b,true)*(b<2?1+decays*0.1:1)))
			document.getElementById(color+"upg"+b+"cost").textContent=shortenMoney(getBranchUpgCost(shorthand,b))
			if (b>1) document.getElementById(color+"UpgName"+b).textContent=name
		}
		if (ghostified) {
			document.getElementById(shorthand+"RadioactiveDecay").parentElement.parentElement.style.display=""
			document.getElementById(shorthand+"RDReq").textContent="(requires "+shorten(Decimal.pow(10,Math.pow(2,50)))+" of "+color+" "+getUQName(shorthand)+" quarks)"
			document.getElementById(shorthand+"RDLvl").textContent=getFullExpansion(getRadioactiveDecays(shorthand))
		} else document.getElementById(shorthand+"RadioactiveDecay").parentElement.parentElement.style.display="none"
	}
	for (var t=1;t<9;t++) {
		var lvl=getTreeUpgradeLevel(t)
		document.getElementById("treeupg"+t+"lvl").textContent=getFullExpansion(lvl)
		document.getElementById("treeupg"+t+"cost").textContent=shortenMoney(getTreeUpgradeCost(t))+" "+colors[lvl%3]
	}
}

function showBranchTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('branchtab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName + "Branch") {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab !== tabName) player.aarexModifications.tabsSave.tabBranch = tabName
	closeToolTip()
}

function getUnstableGain(branch, fixed) {
	let ret
	let power=getBranchUpgLevel(branch,2)-getRadioactiveDecays(branch)*25
	if (fixed) ret=new Decimal(2)
	else {
		ret=player.quantum.usedQuarks[branch].div(1e30).div(player.quantum.tod[branch].gainDiv).add(1).log10()
		if (ret<2) ret=Math.max(player.quantum.usedQuarks[branch].times(1e90/99).div(player.quantum.tod[branch].gainDiv).log10()/60,0)
	}
	ret=Decimal.pow(2,power).times(ret)
	if (ret.gt(1)) ret=Decimal.pow(ret, Math.pow(2,power+1))
	return ret.times(Decimal.pow(2,getRadioactiveDecays(branch)*25+1)).min(Decimal.pow(10,Math.pow(2,51)))
}

function unstableQuarks(branch) {
	if (player.quantum.usedQuarks[branch].eq(0)) return
	player.quantum.tod[branch].quarks=player.quantum.tod[branch].quarks.max(getUnstableGain(branch))
	player.quantum.tod[branch].gainDiv=player.quantum.usedQuarks[branch].max(player.quantum.tod[branch].gainDiv)
	player.quantum.usedQuarks[branch]=new Decimal(0)
	updateColorCharge()
	updateQuantumWorth()
}

function getDecayRate(branch) {
	let ret = Decimal.pow(2,getBranchUpgLevel(branch,1)-getBranchUpgLevel(branch,3)*2-getRadioactiveDecays(branch)*25-4)
	if (branch=="r") {
		if (GUBought("rg8")) ret = ret.div(getGU8Effect("rg"))
	}
	if (branch=="g") {
		if (GUBought("gb8")) ret = ret.div(getGU8Effect("gb"))
	}
	if (branch=="b") {
		if (GUBought("br8")) ret = ret.div(getGU8Effect("br"))
	}
	ret = ret.times(getTreeUpgradeEffect(3))
	ret = ret.times(getTreeUpgradeEffect(5))
	if (hasNU(4)) ret = ret.times(tmp.nu[2])
	return ret.min(Math.pow(2,40))
}

function getQuarkSpinProduction(branch) {
	let ret = Decimal.pow(2,getBranchUpgLevel(branch,1)*(1+getRadioactiveDecays(branch)/10)).times(getTreeUpgradeEffect(3)).times(getTreeUpgradeEffect(5))
	if (hasNU(4)) ret = ret.times(tmp.nu[2].pow(2))
	return ret
}

function getTreeUpgradeCost(upg, add) {
	lvl=getTreeUpgradeLevel(upg)
	if (add!==undefined) lvl+=add
	if (upg==1) return Decimal.pow(2,lvl*2+Math.max(lvl-35,0)*(lvl-34)/2).times(50)
	if (upg==2) return Decimal.pow(4,lvl*(lvl+3)/2).times(600)
	if (upg==3) return Decimal.pow(32,lvl).times(3e9)
	if (upg==4) return Decimal.pow(2,lvl+Math.max(lvl-37,0)*(lvl-36)/2).times(1e12)
	if (upg==5) return Decimal.pow(2,lvl+Math.max(lvl-35,0)*(lvl-34)/2).times(4e12)
	if (upg==6) return Decimal.pow(4,lvl*(lvl+3)/2).times(6e22)
	if (upg==7) return Decimal.pow(16,lvl*lvl).times(4e22)
	if (upg==8) return Decimal.pow(2,lvl).times(3e23)
	return 0
}

function canBuyTreeUpg(upg) {
	var shorthands=["r","g","b"]
	return getTreeUpgradeCost(upg).lte(player.quantum.tod[shorthands[getTreeUpgradeLevel(upg)%3]].spin)
}

function buyTreeUpg(upg) {
	if (!canBuyTreeUpg(upg)) return
	var colors=["red","green","blue"]
	var shorthands=["r","g","b"]
	var branch=player.quantum.tod[shorthands[getTreeUpgradeLevel(upg)%3]]
	branch.spin=branch.spin.sub(getTreeUpgradeCost(upg))
	if (!player.quantum.tod.upgrades[upg]) player.quantum.tod.upgrades[upg]=0
	player.quantum.tod.upgrades[upg]++
	document.getElementById("treeupg"+upg+"lvl").textContent=player.quantum.tod.upgrades[upg]
	document.getElementById("treeupg"+upg+"cost").textContent=shortenMoney(getTreeUpgradeCost(upg))+" "+colors[player.quantum.tod.upgrades[upg]%3]
}

function getTreeUpgradeLevel(upg) {
	upg=player.quantum.tod.upgrades[upg]
	if (upg) return upg
	else return 0
}

function getTreeUpgradeEffect(upg) {
	let lvl = getTreeUpgradeLevel(upg)
	if (upg==1) return lvl * 30
	if (upg==2) return lvl * 0.25
	if (upg==3) {
		if (lvl<1) return 1
		let power=0
		for (var upg=1;upg<9;upg++) if (player.quantum.tod.upgrades[upg]) power+=player.quantum.tod.upgrades[upg]
		return Decimal.pow(2, Math.sqrt(Math.sqrt(Math.max(lvl * 3 - 2, 0)) * Math.max(power - 10, 0)))
	}
	if (upg==4) return 1 + Math.log10(lvl * 0.5 + 1) * 0.1
	if (upg==5) return Math.pow(Math.log10(player.meta.bestOverQuantums.add(1).log10()+1)/5+1,Math.sqrt(lvl))
	if (upg==6) return Decimal.pow(2, lvl)
	if (upg==7) return Decimal.pow(player.replicanti.amount.max(1).log10()+1, 0.25*lvl)
	if (upg==8) return Math.log10(player.meta.bestAntimatter.add(1).log10()+1)/4*Math.sqrt(lvl)
	return 0
}

function getTreeUpgradeEffectDesc(upg) {
	if (upg==1) return getFullExpansion(getTreeUpgradeEffect(upg))
	if (upg==2) return getDilExp("TU3").toFixed(2) + " -> " + getDilExp().toFixed(2)
	if (upg==4) return "^" + shorten(getMPTPower(false)) + " -> ^" + shorten(getMPTPower(true))
	if (upg==8) return "+" + getTreeUpgradeEffect(8).toFixed(2)
	return shortenMoney(getTreeUpgradeEffect(upg))
}

var branchUpgCostScales = [[300, 15], [600, 10], [8e7, 7]]
function getBranchUpgCost(branch, upg) {
	var lvl = getBranchUpgLevel(branch, upg)
	var scale = branchUpgCostScales[upg-1]
	return Decimal.pow(2, lvl * upg + Math.max(lvl - scale[1], 0) * Math.max(3 - upg, 1)).times(scale[0])
}

function buyBranchUpg(branch,upg) {
	var colors={r:"red",g:"green",b:"blue"}
	var bData=player.quantum.tod[branch]
	if (bData.spin.lt(getBranchUpgCost(branch,upg))) return
	bData.spin=bData.spin.sub(getBranchUpgCost(branch,upg))
	if (bData.upgrades[upg]==undefined) bData.upgrades[upg]=0
	bData.upgrades[upg]++
	document.getElementById(colors[branch]+"upg"+upg+"current").textContent=shortenDimensions(Decimal.pow(upg>2?4:2, bData.upgrades[upg]*(upg==1?1+getRadioactiveDecays(branch)*0.1:1)))
	document.getElementById(colors[branch]+"upg"+upg+"cost").textContent=shortenMoney(getBranchUpgCost(branch, upg))
}

function getBranchUpgLevel(branch,upg) {
	upg=player.quantum.tod[branch].upgrades[upg]
	if (upg) return upg
	return 0
}

function getGU8Effect(type) {
	return Math.pow(player.quantum.gluons[type].div("1e565").add(1).log10()*0.505+1, 1.5)
}

function toggleAutoReset() {
	player.quantum.autoOptions.replicantiReset = !player.quantum.autoOptions.replicantiReset
	document.getElementById('autoReset').textContent="Auto: O"+(player.quantum.autoOptions.replicantiReset?"N":"FF")
}

//v2
function autoECToggle() {
	player.quantum.autoEC=!player.quantum.autoEC
	document.getElementById("autoEC").className=player.quantum.autoEC?"timestudybought":"storebtn"
}

var quantumWorth
function updateQuantumWorth(mode) {
	if (player.ghostify.milestones<8&&!player.achievements.includes("ng3p66")) {
		if (mode!="notation") mode=undefined
	} else if (mode=="notation") return
	if (mode != "notation") {
		if (mode != "display") quantumWorth = player.quantum.quarks.add(player.quantum.usedQuarks.r).add(player.quantum.usedQuarks.g).add(player.quantum.usedQuarks.b).add(player.quantum.gluons.rg).add(player.quantum.gluons.gb).add(player.quantum.gluons.br).round()
		if (player.ghostify.times) {
			var automaticCharge = Math.max(Math.log10(quantumWorth.add(1).log10()/150)/Math.log10(2),0)+Math.max(Math.pow(player.quantum.bigRip.spaceShards.add(1).log10()/20,0.5),0)
			player.ghostify.automatorGhosts.power = Math.max(automaticCharge, player.ghostify.automatorGhosts.power)
			if (mode != "quick") {
				document.getElementById("automaticCharge").textContent = automaticCharge.toFixed(1)
				document.getElementById("automaticPower").textContent = player.ghostify.automatorGhosts.power.toFixed(1)
			}
			while (player.ghostify.automatorGhosts.power>=autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3]) {
				player.ghostify.automatorGhosts.ghosts++
				document.getElementById("autoGhost"+player.ghostify.automatorGhosts.ghosts).style.display=""
				if (player.ghostify.automatorGhosts.ghosts>17) document.getElementById("nextAutomatorGhost").parentElement.style.display="none"
				else {
					document.getElementById("automatorGhostsAmount").textContent=player.ghostify.automatorGhosts.ghosts
					document.getElementById("nextAutomatorGhost").parentElement.style.display=""
					document.getElementById("nextAutomatorGhost").textContent=autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3].toFixed(1)
				}
			}
		}
	}
	if (mode != "quick") for (var e=1;e<4;e++) document.getElementById("quantumWorth"+e).textContent = shortenDimensions(quantumWorth)
}

function getELCMult() {
	let ret=player.quantum.electrons.mult
	if (hasNU(5)) ret*=3.5
	return ret
}

function updateElectronsEffect() {
	document.getElementById("sacrificedGals").textContent=getFullExpansion(player.quantum.electrons.sacGals)
	document.getElementById("electronsAmount").textContent=getFullExpansion(Math.round(player.quantum.electrons.amount))
	if (!player.quantum.autoOptions.sacrifice) document.getElementById("electronsAmount2").textContent="You have " + getFullExpansion(Math.round(player.quantum.electrons.amount)) + " electrons."
	document.getElementById("electronsTranslation").textContent=getFullExpansion(Math.round(getMPTPower()))
	document.getElementById("electronsEffect").textContent = shorten(getDimensionPowerMultiplier(true))
}

function maxBuyLimit() {
	var min=player.quantum.gluons.rg.min(player.quantum.gluons.gb).min(player.quantum.gluons.br)
	if (!min.gte(player.quantum.replicants.limitCost)&&isLimitUpgAffordable()) return
	for (var i=0;i<(player.masterystudies.includes("d11")?3:1);i++) {
		if (i==1) {
			var toAdd=Math.max(Math.floor(min.div(player.quantum.replicants.limitCost).log(200)/9),0)
			var toSpend=Decimal.pow(200,toAdd*9).times(player.quantum.replicants.limitCost)
			player.quantum.gluons.rg=player.quantum.gluons.rg.sub(player.quantum.gluons.rg.min(toSpend))
			player.quantum.gluons.gb=player.quantum.gluons.gb.sub(player.quantum.gluons.gb.min(toSpend))
			player.quantum.gluons.br=player.quantum.gluons.br.sub(player.quantum.gluons.br.min(toSpend))
			player.quantum.replicants.limitCost=player.quantum.replicants.limitCost.times(Decimal.pow(200,toAdd*9))
			player.quantum.replicants.limit+=toAdd*10
		} else {
			var toAdd=Math.max(Math.min(Math.floor(min.div(player.quantum.replicants.limitCost).times(199).add(1).log(200)),10-player.quantum.replicants.limit%10),0)
			var toSpend=Decimal.pow(200,toAdd).sub(1).div(199).round().times(player.quantum.replicants.limitCost)
			player.quantum.gluons.rg=player.quantum.gluons.rg.sub(player.quantum.gluons.rg.min(toSpend))
			player.quantum.gluons.gb=player.quantum.gluons.gb.sub(player.quantum.gluons.gb.min(toSpend))
			player.quantum.gluons.br=player.quantum.gluons.br.sub(player.quantum.gluons.br.min(toSpend))
			player.quantum.replicants.limitCost=player.quantum.replicants.limitCost.times(Decimal.pow(200,Math.max(Math.min(toAdd,9-player.quantum.replicants.limit%10),0)))
			player.quantum.replicants.limit+=toAdd
			var dimAdd=Math.max(Math.min(Math.ceil(player.quantum.replicants.limit/10-1),8-player.quantum.replicants.limitDim),0)
			if (dimAdd>0) {
				player.quantum.replicants.limit-=dimAdd*10
				player.quantum.replicants.limitDim+=dimAdd
			}
		}
	}
	updateGluons()
	updateReplicants()
}

function rotateAutoAssign() {
	player.quantum.autoOptions.assignQKRotate=player.quantum.autoOptions.assignQKRotate?(player.quantum.autoOptions.assignQKRotate+1)%3:1
	document.getElementById('autoAssignRotate').textContent=player.quantum.autoOptions.assignQKRotate?"C"+(player.quantum.autoOptions.assignQKRotate>1?"ounterc":"")+"lockwise":"No rotate"
}

function unstableAll() {
	var colors=["r","g","b"]
	for (c=0;c<3;c++) {
		var bData=player.quantum.tod[colors[c]]
		if (player.quantum.usedQuarks[colors[c]].gt(0)) {
			bData.quarks=bData.quarks.max(getUnstableGain(colors[c]))
			bData.gainDiv=player.quantum.usedQuarks[colors[c]].max(bData.gainDiv)
			player.quantum.usedQuarks[colors[c]]=new Decimal(0)
		}
	}
	updateColorCharge()
	updateQuantumWorth()
}

function getUQName(shorthand) {
	let ret="unstable"
	if (player.quantum.tod[shorthand].decays!==undefined) {
		let mod8=player.quantum.tod[shorthand].decays%8
		let div8=(player.quantum.tod[shorthand].decays-mod8)/8
		if (div8>0) ret="ghostly"+(div8>1?"^"+getFullExpansion(div8):"")+" "+ret
		if (mod8>1) ret=(["infinity ","eternity ","quantum "])[Math.floor(mod8/2)-1]+ret
		if (mod8%2>0) ret="ratioactive "+ret
	}
	return ret
}

function maxTreeUpg() {
	var update=false
	var colors=["r","g","b"]
	var todData=player.quantum.tod
	for (u=1;u<9;u++) {
		var cost=getTreeUpgradeCost(u)
		var newSpins=[]
		var min
		for (c=0;c<3;c++) {
			min=todData[colors[c]].spin.min(c?min:1/0)
			newSpins[c]=todData[colors[c]].spin
		}
		if (min.gte(cost)) {
			var lvl=getTreeUpgradeLevel(u)
			var increment=1
			while (min.gte(getTreeUpgradeCost(u,increment-1))) increment*=2
			var toBuy=0
			while (increment>=1) {
				if (min.gte(getTreeUpgradeCost(u,toBuy+increment-1))) toBuy+=increment
				increment/=2
			}
			var cost=getTreeUpgradeCost(u,toBuy-1)
			var toBuy2=toBuy
			while (toBuy>0&&newSpins[(lvl+toBuy-1)%3].div(cost).lt(1e16)) {
				if (newSpins[(lvl+toBuy-1)%3].gte(cost)) newSpins[(lvl+toBuy-1)%3]=newSpins[(lvl+toBuy-1)%3].sub(cost)
				else {
					newSpins[(lvl+toBuy-1)%3]=todData[colors[(lvl+toBuy-1)%3]].spin.sub(cost)
					toBuy2--
				}
				toBuy--
				cost=getTreeUpgradeCost(u,toBuy-1)
			}
			for (c=0;c<3;c++) todData[colors[c]].spin=newSpins[c]
			todData.upgrades[u]=toBuy2+(todData.upgrades[u]===undefined?0:todData.upgrades[u])
			update=true
		}
	}
	if (update) updateTODStuff()
}

function maxBranchUpg(branch, weak) {
	var colors={r:"red",g:"green",b:"blue"}
	var bData=player.quantum.tod[branch]
	for (var u=(weak?2:1);u<4;u++) {
		var oldLvl=getBranchUpgLevel(branch,u)
		var scaleStart=branchUpgCostScales[u-1][1]
		var cost=getBranchUpgCost(branch,u)
		if (bData.spin.gte(cost)&&oldLvl<scaleStart) {
			var costMult=Math.pow(2,u)
			var toAdd=Math.min(Math.floor(bData.spin.div(cost).times(costMult-1).add(1).log(costMult)),scaleStart-oldLvl)
			bData.spin=bData.spin.sub(Decimal.pow(costMult,toAdd).sub(1).div(costMult).times(cost))
			if (bData.upgrades[u]===undefined) bData.upgrades[u]=0
			bData.upgrades[u]+=toAdd
			cost=getBranchUpgCost(branch,u)
		}
		if (bData.spin.gte(cost)&&bData.upgrades[u]>=scaleStart) {
			var costMult=Math.pow(2,u+Math.max(3-u,1))
			var toAdd=Math.floor(bData.spin.div(cost).times(costMult-1).add(1).log(costMult))
			bData.spin=bData.spin.sub(Decimal.pow(costMult,toAdd).sub(1).div(costMult).times(cost))
			if (bData.upgrades[u]===undefined) bData.upgrades[u]=0
			bData.upgrades[u]+=toAdd
		}
		if (bData.upgrades[u]>oldLvl) {
			document.getElementById(colors[branch]+"upg"+u+"current").textContent=shortenDimensions(Decimal.pow(u>2?4:2,bData.upgrades[u]))
			document.getElementById(colors[branch]+"upg"+u+"cost").textContent=shortenMoney(getBranchUpgCost(branch,u))
		}
	}
}

function radioactiveDecay(shorthand) {
	let data=player.quantum.tod[shorthand]
	if (!data.quarks.gte(Decimal.pow(10,Math.pow(2,50)))) return
	data.gainDiv=new Decimal("1e390")
	data.quarks=new Decimal(0)
	data.spin=new Decimal(0)
	data.upgrades={}
	data.decays=data.decays===undefined?1:data.decays+1
	updateTODStuff()
}

function getRadioactiveDecays(shorthand) {
	let data=player.quantum.tod[shorthand]
	return data.decays===undefined?0:data.decays
}

function openAfterEternity() {
	showEternityTab("autoEternity")
	showTab("eternitystore")
}

function toggleABEter() {
	document.getElementById("eternityison").checked=!player.eternityBuyer.isOn
	updateAutobuyers()
}

function updateAutoEterValue() {
	document.getElementById("priority13").value=document.getElementById("autoEterValue").value
	updatePriorities()
}

function toggleAutoEterIfAD() {
	player.eternityBuyer.ifAD=!player.eternityBuyer.ifAD
	document.getElementById("autoEterIfAD").textContent="Auto-eternity only if able to auto-dilate: O" + (player.eternityBuyer.ifAD ? "N" : "FF")
}

function toggleAutoDil() {
	document.getElementById("dilatedeternityison").checked=!player.eternityBuyer.dilationMode	
	updateAutobuyers()
}

function updateAutoDilValue() {
	document.getElementById("prioritydil").value=document.getElementById("autoDilValue").value
	updatePriorities()
}

function changeAutoDilateMode() {
	if (player.eternityBuyer.dilMode == "amount") player.eternityBuyer.dilMode = "upgrades"
	else player.eternityBuyer.dilMode = "amount"
	document.getElementById("autodilatemode").textContent = "Mode: " + (player.eternityBuyer.dilMode == "amount" ? "Amount of eternities" : "Upgrades")
}

function toggleSlowStop() {
	player.eternityBuyer.slowStop = !player.eternityBuyer.slowStop
	player.eternityBuyer.slowStopped = false
	document.getElementById("slowstop").textContent = "Stop auto-dilate if a little bit of TP is gained: O" + (player.eternityBuyer.slowStop ? "N" : "FF")
}

function toggleAPs() {
	player.eternityBuyer.presets.on = !player.eternityBuyer.presets.on
	document.getElementById("toggleAP").textContent = player.eternityBuyer.presets.on ? "Disable" : "Enable"
}

var apLoaded = false
var apInterval
var loadedAPs = 0
function loadAP() {
	if (apLoaded) return
	apLoaded = true
	loadedAPs = 0
	document.getElementById("automatedPresets").innerHTML = ""
	occupied = false
	apInterval = setInterval(function() {
		if (occupied) return
		occupied = true
		if (loadedAPs == player.eternityBuyer.presets.order.length) {
			clearInterval(apInterval)
			return
		} else if (!onLoading) {
			latestRow = document.getElementById("automatedPresets").insertRow(loadedAPs)
			onLoading = true
		}
		try {
			latestRow.innerHTML = '<td id="apselected'+loadedAPs+'"></td><td><b id="apname'+loadedAPs+'"></b><br># of eternities: <input id="apeternities'+loadedAPs+'" type="text" onchange="changeAPEternities('+loadedAPs+')" value=2></input><button class="storebtn" onclick="selectNextAP('+loadedAPs+')">Select next</button> <button class="storebtn" onclick="moveAP('+loadedAPs+', -1)">Move up</button> <button class="storebtn" onclick="moveAP('+loadedAPs+', 1)">Move down</button> <button class="storebtn" onclick="renameAP('+loadedAPs+')">Rename</button> <button class="storebtn" onclick="replaceAP('+loadedAPs+')">Replace</button> <button id="apdisable'+loadedAPs+'" class="storebtn" onclick="disableAP('+loadedAPs+')"></button> <button class="storebtn"onclick="removeAP('+loadedAPs+')">Remove</button></td>'
			changeAPOptions(player.eternityBuyer.presets.order[loadedAPs],loadedAPs)
			loadedAPs++
			onLoading = false
		} catch (_) {}
		occupied = false
	}, 0)
	if (player.eternityBuyer.presets.dil === undefined) {
		document.getElementById("apDilSelected").textContent = ""
		document.getElementById("apDil").innerHTML = '<b>Empty Dilation preset</b><br>(Dilating time selects this)<br><button class="storebtn" onclick="createAP(false, \'dil\')">Add preset</button> <button class="storebtn" onclick="createAP(true, \'dil\')">Import preset</button>'
	} else {
		document.getElementById("apDil").innerHTML = '<b id="apnamedil"></b><br>(Dilating time selects this)<br><button class="storebtn" onclick="renameAP(\'dil\')">Rename</button> <button class="storebtn" onclick="replaceAP(\'dil\')">Replace</button> <button id="apdisabledil" class="storebtn" onclick="disableAP(\'dil\')"></button>'
		changeAPOptions('dil')
	}
	if (player.eternityBuyer.presets.grind === undefined) {
		document.getElementById("apGrindSelected").textContent = ""
		document.getElementById("apGrind").innerHTML = '<b>Empty grind preset</b><br>(Eternitying with <10,000 log(EP)/min selects this)<br><button class="storebtn" onclick="createAP(false, \'grind\')">Add preset</button> <button class="storebtn" onclick="createAP(true, \'dil\')">Import preset</button>'
	} else {
		document.getElementById("apGrind").innerHTML = '<b id="apnamegrind"></b><br>(Eternitying with <10,000 log(EP)/min selects this)<br><button class="storebtn" onclick="renameAP(\'grind\')">Rename</button> <button class="storebtn" onclick="replaceAP(\'grind\')">Replace</button> <button id="apdisablegrind" class="storebtn" onclick="disableAP(\'grind\')"></button>'
		changeAPOptions('grind')
	}
}

function changeAPOptions(id, placement) {
	if (id=="grind") {
		let name="Unnamed grind preset"
		let apData=player.eternityBuyer.presets.grind
		if (apData.title!="") name=apData.title
		document.getElementById("apnamegrind").textContent=name
		document.getElementById("apdisablegrind").textContent=apData.on?"Disable":"Enable"
		document.getElementById("apGrindSelected").textContent=player.eternityBuyer.presets.selected=="grind"?">>":""
	} else if (id=="dil") {
		let name="Unnamed Dilation preset"
		let apData=player.eternityBuyer.presets.dil
		if (apData.title!="") name=apData.title
		document.getElementById("apnamedil").textContent=name
		document.getElementById("apdisabledil").textContent=apData.on?"Disable":"Enable"
		document.getElementById("apDilSelected").textContent=player.eternityBuyer.presets.selected=="dil"?">>":""
	} else {
		let name="#"+(placement+1)
		let pointer=""
		let apData=player.eternityBuyer.presets[id]
		if (apData.title!="") name=apData.title
		document.getElementById("apname"+placement).textContent=name
		document.getElementById("apeternities"+placement).value=apData.length
		document.getElementById("apdisable"+placement).textContent=apData.on?"Disable":"Enable"
		if (placement==player.eternityBuyer.presets.selected) pointer=">>"
		else if (placement==player.eternityBuyer.presets.selectNext) pointer=">"
		document.getElementById("apselected"+placement).textContent=pointer
	}
}

function changeAPEternities(id) {
	let value=parseInt(document.getElementById("apeternities"+id).value)
	if (!isNaN(value)) if (value>0) player.eternityBuyer.presets[player.eternityBuyer.presets.order[id]].length=value
}

function createAP(importing, type) {
	if (importing) {
		onImport=true
		var input=prompt()
		if (input===null) return
		onImport=false
	} else {
		var mtsstudies=[]
		for (var id2=0;id2<player.masterystudies.length;id2++) {
			var t = player.masterystudies[id2].split("t")[1]
			if (t) mtsstudies.push(t)
		}
		var input=player.timestudy.studies+(mtsstudies.length>0?","+mtsstudies:"")+"|"+player.eternityChallUnlocked
	}
	var id=1
	if (type) id=type
	else {
		while (player.eternityBuyer.presets.order.includes(id)) id++
		player.eternityBuyer.presets.order.push(id)
	}
	player.eternityBuyer.presets[id]={title:"",preset:input,length:1,on:true}
	if (type=="grind") {
		document.getElementById("apGrind").innerHTML = '<b id="apnamegrind"></b><br>(Eternitying with <10,000 log(EP)/min selects this)<br><button class="storebtn" onclick="renameAP(\'grind\')">Rename</button> <button class="storebtn" onclick="replaceAP(\'grind\')">Replace</button> <button id="apdisablegrind" class="storebtn" onclick="disableAP(\'grind\')"></button>'
		changeAPOptions('grind')
		$.notify("Grind preset created", "info")
	} else if (type) {
		document.getElementById("apDil").innerHTML = '<b id="apnamedil"></b><br>(Dilating time selects this)<br><button class="storebtn" onclick="renameAP(\'dil\')">Rename</button> <button class="storebtn" onclick="replaceAP(\'dil\')">Replace</button> <button id="apdisabledil" class="storebtn" onclick="disableAP(\'dil\')"></button>'
		changeAPOptions('dil')
		$.notify("Dilation preset created", "info")
	} else {
		if (loadedAPs+1==player.eternityBuyer.presets.order.length) {
			let latestRow=document.getElementById("automatedPresets").insertRow(loadedAPs)
			latestRow.innerHTML='<td id="apselected'+loadedAPs+'"></td><td><b id="apname'+loadedAPs+'"></b><br># of eternities: <input id="apeternities'+loadedAPs+'" type="text" onchange="changeAPEternities('+loadedAPs+')" value=2></input><button class="storebtn" onclick="selectNextAP('+loadedAPs+')">Select next</button> <button class="storebtn" onclick="moveAP('+loadedAPs+', -1)">Move up</button> <button class="storebtn" onclick="moveAP('+loadedAPs+', 1)">Move down</button> <button class="storebtn" onclick="renameAP('+loadedAPs+')">Rename</button> <button class="storebtn" onclick="replaceAP('+loadedAPs+')">Replace</button> <button id="apdisable'+loadedAPs+'" class="storebtn" onclick="disableAP('+loadedAPs+')"></button> <button class="storebtn"onclick="removeAP('+loadedAPs+')">Remove</button></td>'
			changeAPOptions(id,loadedAPs)
			loadedAPs++
		}
		$.notify("Preset #"+player.eternityBuyer.presets.order.length+" created", "info")
	}
}

function selectNextAP(id) {
	if (player.eternityBuyer.presets.selected==id) return
	if (player.eternityBuyer.presets.selectNext==id) return
	document.getElementById("apselected"+player.eternityBuyer.presets.selectNext).textContent=""
	document.getElementById("apselected"+id).textContent=">"
	player.eternityBuyer.presets.selectNext=id
}

function moveAP(id, offset) {
	var apData=player.eternityBuyer.presets
	var orderData=apData.order
	if (offset>0) {
		if (id+offset>=orderData.length) return
	} else if (id+offset<0) return
	var storedCell=orderData[id+offset]
	orderData[id+offset]=orderData[id]
	orderData[id]=storedCell
	if (apData.selected==id) apData.selected=id+offset
	else if (apData.selected==id+offset) apData.selected=id
	if (apData.selectNext==id) apData.selectNext=id+offset
	else if (apData.selectNext==id+offset) apData.selectNext=id
	changeAPOptions(orderData[id],id)
	changeAPOptions(orderData[id+offset],id+offset)
	$.notify("Preset #"+(id+1)+" moved", "info")
}

function renameAP(id) {
	onImport=true
	var input=prompt()
	if (input===null) return
	onImport=false
	if (id=="grind") {
		player.eternityBuyer.presets.grind.title=input
		changeAPOptions('grind')
		$.notify("Grind preset renamed", "info")
	} else if (id=="dil") {
		player.eternityBuyer.presets.dil.title=input
		changeAPOptions('dil')
		$.notify("Dilation preset renamed", "info")
	} else {
		player.eternityBuyer.presets[player.eternityBuyer.presets.order[id]].title=input
		changeAPOptions(player.eternityBuyer.presets.order[id],id)
		$.notify("Preset #"+(id+1)+" renamed", "info")
	}
}

function replaceAP(id) {
	onImport=true
	var input=prompt()
	if (input===null) return
	onImport=false
	if (id=="grind") {
		player.eternityBuyer.presets.grind.preset=input
		$.notify("Grind preset replaced", "info")
	} else if (id=="dil") {
		player.eternityBuyer.presets.dil.preset=input
		$.notify("Dilation preset replaced", "info")
	} else {
		player.eternityBuyer.presets[player.eternityBuyer.presets.order[id]].preset=input
		$.notify("Preset #"+(id+1)+" replaced", "info")
	}
}

function disableAP(id) {
	let apData=player.eternityBuyer.presets[typeof(id)=="number"?player.eternityBuyer.presets.order[id]:id]
	apData.on=!apData.on
	document.getElementById("apdisable"+id).textContent=apData.on?"Disable":"Enable"
}

function removeAP(id) {
	var order=player.eternityBuyer.presets.order
	var newOrder=[]
	for (var i=0;i<order.length;i++) {
		if (i==id) {
            document.getElementById("automatedPresets").deleteRow(i)
			loadedAPs--
			if (player.eternityBuyer.presets.selected==i) player.eternityBuyer.presets.selected=-1
			if (player.eternityBuyer.presets.selectNext==i&&i+1==order.length&&order.length>1) {
				player.eternityBuyer.presets.selectNext=0
				document.getElementById("apselected0").textContent=">"
			}
			if (player.eternityBuyer.presets.selectNext>i) player.eternityBuyer.presets.selectNext--
			delete player.eternityBuyer.presets[order[i]]
		} else newOrder.push(order[i])
		if (i>id) {
			let row=document.getElementById("automatedPresets").rows[i-1]
			let j=i-1
			row.innerHTML='<td id="apselected'+j+'"></td><td><b id="apname'+j+'"></b><br># of eternities: <input id="apeternities'+j+'" type="text" onchange="changeAPEternities('+j+')" value=2></input><button class="storebtn" onclick="selectNextAP('+j+')">Select next</button> <button class="storebtn" onclick="moveAP('+j+', -1)">Move up</button> <button class="storebtn" onclick="moveAP('+j+', 1)">Move down</button> <button class="storebtn" onclick="renameAP('+j+')">Rename</button> <button class="storebtn" onclick="replaceAP('+j+')">Replace</button> <button id="apdisable'+j+'" class="storebtn" onclick="disableAP('+j+')"></button> <button class="storebtn"onclick="removeAP('+j+')">Remove</button></td>'
			changeAPOptions(order[i],j)
		}
	}
	player.eternityBuyer.presets.order=newOrder
	$.notify("Preset #"+(id+1)+" removed", "info")
}

function bigRip() {
	if (!player.masterystudies.includes("d14")||player.quantum.electrons.amount<62500||!inQC(0)) return
	if (player.ghostify.milestones>1) {
		player.quantum.pairedChallenges.order={1:[1,2],2:[3,4],3:[5,7],4:[6,8]}
		player.quantum.pairedChallenges.completed=3
		for (var c=1;c<9;c++) player.quantum.challenges[c]=(c==6||c==8)?1:2
		quantumReset(true,true,12,true)
	} else {
		for (var p=1;p<5;p++) {
			var pcData=player.quantum.pairedChallenges.order[p]
			if (pcData) {
				var pc1=Math.min(pcData[0],pcData[1])
				var pc2=Math.max(pcData[0],pcData[1])
				if (pc1==6&&pc2==8) {
					if (p-1>player.quantum.pairedChallenges.completed) return
					quantum(false,true,p+8,true)
				}
			}
		}
	}
}

function toggleBigRipConf() {
	player.quantum.bigRip.conf = !player.quantum.bigRip.conf
	document.getElementById("bigRipConfirmBtn").textContent = "Big Rip confirmation: O" + (player.quantum.bigRip.conf ? "N" : "FF")
}

function switchAB() {
	var bigRip = player.quantum.bigRip.active
	var data = player.quantum.bigRip["savedAutobuyers" + (bigRip ? "" : "No") + "BR"]
	for (d=1;d<9;d++) if (player.autobuyers[d-1] % 1 !== 0) data["d"+d] = {
		time: player.autobuyers[d-1].interval,
		priority: player.autobuyers[d-1].priority,
		perTen: player.autobuyers[d-1].target > 10,
		on: player.autobuyers[d-1].isOn,
	}
	if (player.autobuyers[8] % 1 !== 0) data.tickspeed = {
		time: player.autobuyers[8].interval,
		priority: player.autobuyers[8].priority,
		max: player.autobuyers[8].target == 10,
		on: player.autobuyers[8].isOn
	}
	if (player.autoSacrifice % 1 !== 0) data.sacrifice = {
		time: player.autoSacrifice.interval,
		amount: player.autoSacrifice.priority,
		on: player.autoSacrifice.isOn
	}
	if (player.autobuyers[9] % 1 !== 0) data.dimBoosts = {
		time: player.autobuyers[9].interval,
		maxDims: player.autobuyers[9].priority,
		always: player.overXGalaxies,
		bulk: player.autobuyers[9].bulk,
		on: player.autobuyers[9].isOn
	}
	if (player.tickspeedBoosts !== undefined) if (player.autobuyers[13] % 1 !== 0) data.tickBoosts = {
		time: player.autobuyers[13].interval,
		maxDims: player.autobuyers[13].priority,
		always: player.overXGalaxiesTickspeedBoost,
		bulk: player.autobuyers[13].bulk,
		on: player.autobuyers[13].isOn
	}
	if (player.autobuyers[10] % 1 !== 0) data.galaxies = {
		time: player.autobuyers[10].interval,
		maxGalaxies: player.autobuyers[10].priority,
		bulkTime: player.autobuyers[10].bulk,
		on: player.autobuyers[10].isOn
	}
	if (player.galacticSacrifice !== undefined) if (player.autobuyers[12] % 1 !== 0) data.galSacrifice = {
		time: player.autobuyers[12].interval,
		amount: player.autobuyers[12].priority,
		on: player.autobuyers[12].isOn
	}
	if (player.autobuyers[11] % 1 !== 0) data.crunch = {
		time: player.autobuyers[11].interval,
		mode: player.autoCrunchMode,
		amount: player.autobuyers[11].priority,
		on: player.autobuyers[11].isOn
	}
	data.eternity = {
		mode: player.autoEterMode,
		amount: player.eternityBuyer.limit,
		dilation: player.eternityBuyer.dilationMode,
		dilationPerStat: player.eternityBuyer.dilationPerAmount,
		dilMode: player.eternityBuyer.dilMode,
		tpUpgraded: player.eternityBuyer.tpUpgraded,
		slowStop: player.eternityBuyer.slowStop,
		slowStopped: player.eternityBuyer.slowStopped,
		ifAD: player.eternityBuyer.ifAD,
		presets: Object.assign({}, player.eternityBuyer.presets),
		on: player.eternityBuyer.isOn
	}
	data.eternity.presets.order = []
	for (var i=0;i<player.eternityBuyer.presets.order.length;i++) {
		var id=player.eternityBuyer.presets.order[i]
		data.eternity.presets[id]=Object.assign({},player.eternityBuyer.presets[id])
		data.eternity.presets.order.push(id)
	}
	var data = player.quantum.bigRip["savedAutobuyers" + (bigRip ? "No" : "") + "BR"]
	for (var d=1;d<9;d++) if (data["d"+d]) player.autobuyers[d-1] = {
		interval: data["d"+d].time,
		cost: player.autobuyers[d-1].cost,
		bulk: player.autobuyers[d-1].bulk,
		priority: data["d"+d].priority,
		tier: d,
		target: d + (data["d"+d].perTen ? 10 : 0),
		ticks: 0,
		isOn: data["d"+d].on
	}
	if (data.tickspeed) player.autobuyers[8] = {
		interval: data.tickspeed.time,
		cost: player.autobuyers[8].cost,
		bulk: 1,
		priority: data.tickspeed.priority,
		tier: 1,
		target: (data.tickspeed.max ? 10 : 1),
		ticks: 0,
		isOn: data.tickspeed.on
	}
	if (data.sacrifice) player.autoSacrifice = {
		interval: data.sacrifice.time,
		cost: player.autoSacrifice.cost,
		bulk: 1,
		priority: data.sacrifice.priority,
		tier: 1,
		target: 13,
		ticks: 0,
		isOn: data.sacrifice.on
	}
	if (data.dimBoosts) {
		player.autobuyers[9] = {
			interval: data.dimBoosts.time,
			cost: player.autobuyers[9].cost,
			bulk: data.dimBoosts.bulk,
			priority: data.dimBoosts.maxDims,
			tier: 1,
			target: 11,
			ticks: 0,
			isOn: data.dimBoosts.on
		}
		player.overXGalaxies = data.dimBoosts.always
	}
	if (data.tickBoosts) {
		player.autobuyers[13] = {
			interval: data.tickBoosts.time,
			cost: player.autobuyers[13].cost,
			bulk: data.tickBoosts.bulk,
			priority: data.tickBoosts.maxDims,
			tier: 1,
			target: 14,
			ticks: 0,
			isOn: data.tickBoosts.on
		}
		player.overXGalaxiesTickspeedBoost = data.tickBoosts.always
	}
	if (data.galaxies) player.autobuyers[10] = {
		interval: data.galaxies.time,
		cost: player.autobuyers[10].cost,
		bulk: data.galaxies.bulkTime,
		priority: data.galaxies.maxGalaxies,
		tier: 1,
		target: 11,
		ticks: 0,
		isOn: data.galaxies.on
	}
	if (data.galacticSacrifice) player.autobuyers[12] = {
		interval: data.galacticSacrifice.time,
		cost: player.autobuyers[12].cost,
		bulk: 1,
		priority: data.galacticSacrifice.amount,
		tier: 1,
		target: 13,
		ticks: 0,
		isOn: data.galacticSacrifice.on
	}
	if (data.crunch) {
		player.autobuyers[11] = {
			interval: data.crunch.time,
			cost: player.autobuyers[11].cost,
			bulk: 1,
			priority: data.crunch.amount,
			tier: 1,
			target: 12,
			ticks: 0,
			isOn: data.crunch.on
		}
		player.autoCrunchMode = data.crunch.mode
	}
	if (data.eternity) {
		player.eternityBuyer = {
			limit: data.eternity.amount,
			dilationMode: data.eternity.dilation,
			dilationPerAmount: data.eternity.dilationPerStat,
			statBeforeDilation: data.eternity.dilationPerStat,
			dilMode: data.eternity.dilMode ? data.eternity.dilMode : "amount",
			tpUpgraded: data.eternity.tpUpgraded ? data.eternity.tpUpgraded : false,
			slowStop: data.eternity.slowStop ? data.eternity.slowStop : false,
			slowStopped: data.eternity.slowStopped ? data.eternity.slowStopped : false,
			ifAD: data.eternity.ifAD ? data.eternity.ifAD : false,
			presets: data.eternity.presets ? data.eternity.presets : {on: false, autoDil: false, selected: -1, selectNext: 0, left: 1, order: []},
			isOn: data.eternity.on
		}
		if (player.eternityBuyer.presets.selectNext === undefined) {
			player.eternityBuyer.presets.selected = -1
			player.eternityBuyer.presets.selectNext = 0
		}
		if (player.eternityBuyer.presets.left === undefined) player.eternityBuyer.presets.left = 1
		player.autoEterMode = data.eternity.mode
	}
	updateCheckBoxes()
	loadAutoBuyerSettings()
	if (player.autoCrunchMode == "amount") {
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
		document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
	} else if (player.autoCrunchMode == "time") {
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: time"
		document.getElementById("limittext").textContent = "Seconds between crunches:"
	} else {
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
		document.getElementById("limittext").textContent = "X times last crunch:"
	}
	updateAutoEterMode()
}

function unstoreTT() {
	if (player.quantum.bigRip.storedTS===undefined) return
	player.timestudy.theorem=player.quantum.bigRip.storedTS.tt
	player.timestudy.amcost=Decimal.pow(10,2e4*(player.quantum.bigRip.storedTS.boughtA+1))
	player.timestudy.ipcost=Decimal.pow(10,100*player.quantum.bigRip.storedTS.boughtI)
	player.timestudy.epcost=Decimal.pow(2,player.quantum.bigRip.storedTS.boughtE)
	var newTS=[]
	var newMS=[]
	var studies=player.quantum.bigRip.storedTS.studies
	for (var s=0;s<studies.length;s++) {
		if (studies[s]<240) newTS.push(studies[s])
		else newMS.push("t"+studies[s])
	}
	for (var s=7;s<15;s++) if (player.masterystudies.includes("d"+s)) newMS.push("d"+s)
	player.timestudy.studies=newTS
	player.masterystudies=newMS
	updateTimeStudyButtons()
	updateTheoremButtons()
	drawStudyTree()
	maybeShowFillAll()
	drawMasteryTree()
	updateMasteryStudyButtons()
	delete player.quantum.bigRip.storedTS
}

function getSpaceShardsGain() {
	let ret = Decimal.pow(player.quantum.bigRip.bestThisRun.log10()/2000, 1.5).times(player.dilation.dilatedTime.add(1).pow(0.05))
	if (player.quantum.breakEternity.break) {
		if (player.quantum.breakEternity.upgrades.includes(3)) ret = ret.times(getBreakUpgMult(3))
		if (player.quantum.breakEternity.upgrades.includes(6)) ret = ret.times(getBreakUpgMult(6))
	}
	return ret.floor()
}

let bigRipUpgCosts = [0, 2, 3, 5, 20, 30, 45, 60, 150, 300, 2000, 1e10, 3e14, 1e17, 3e18, 3e20, 5e22, 1e33]
function buyBigRipUpg(id) {
	if (player.quantum.bigRip.spaceShards.lt(bigRipUpgCosts[id])||player.quantum.bigRip.upgrades.includes(id)) return
	player.quantum.bigRip.spaceShards=player.quantum.bigRip.spaceShards.sub(bigRipUpgCosts[id]).round()
	player.quantum.bigRip.upgrades.push(id)
	document.getElementById("spaceShards").textContent = shortenDimensions(player.quantum.bigRip.spaceShards)
	if (player.quantum.bigRip.active) tweakBigRip(id, true)
	if (id==10 && !player.quantum.bigRip.upgrades.includes(9)) {
		player.quantum.bigRip.upgrades.push(9)
		if (player.quantum.bigRip.active) tweakBigRip(9, true)
	}
	for (var u=1;u<18;u++) document.getElementById("bigripupg"+u).className = player.quantum.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" : player.quantum.bigRip.spaceShards.lt(bigRipUpgCosts[u]) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
}

function tweakBigRip(id, reset) {
	if (id == 2) {
		for (var ec=1;ec<15;ec++) player.eternityChalls["eterc"+ec] = 5
		player.eternities = Math.max(player.eternities, 1e5)
		if (!reset) updateEternityChallenges()
	}
	if (!player.quantum.bigRip.upgrades.includes(9)) {
		if (id == 3) player.timestudy.theorem += 5
		if (id == 5) player.timestudy.theorem += 20
		if ((id == 7) && !player.timestudy.studies.includes(192)) player.timestudy.studies.push(192)
	}
	if (id == 9) {
		if (reset) player.timestudy = {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: []
		}
		if (!player.quantum.bigRip.upgrades.includes(12)) player.timestudy.theorem += 1350
	}
	if (id == 10) {
		if (!player.dilation.studies.includes(1)) player.dilation.studies.push(1)
		if (reset) {
			showTab("eternitystore")
			showEternityTab("dilation")
		}
	}
	if (id == 11) {
		if (reset) player.timestudy = {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: []
		}
		player.dilation.tachyonParticles = player.dilation.tachyonParticles.max(player.dilation.bestTP.sqrt())
		player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.max(player.dilation.bestTP.sqrt())
	}
}

function isBigRipUpgradeActive(id, bigRipped) {
	if (player.masterystudies == undefined) return false
	if (bigRipped === undefined ? !player.quantum.bigRip.active : !bigRipped) return false
	if (id == 1) if (!player.quantum.bigRip.upgrades.includes(17)) for (var u=3;u<18;u++) if (player.quantum.bigRip.upgrades.includes(u)) return false
	if (id > 2 && id != 4 && id < 9) if (player.quantum.bigRip.upgrades.includes(9) && (id != 8 || !hasNU(9))) return false
	if (id == 4) if (player.quantum.bigRip.upgrades.includes(11)) return false
	return player.quantum.bigRip.upgrades.includes(id)
}

function updateBreakEternity() {
	if (player.masterystudies === undefined) {
		document.getElementById("breakEternityTabbtn").style.display = "none"
		return
	}
	document.getElementById("breakEternityTabbtn").style.display = player.quantum.bigRip.active || player.quantum.breakEternity.unlocked ? "" : "none"
	if (player.quantum.breakEternity.unlocked) {
		document.getElementById("breakEternityReq").style.display = "none"
		document.getElementById("breakEternityShop").style.display = ""
		document.getElementById("breakEternityNoBigRip").style.display = player.quantum.bigRip.active ? "none" : ""
		document.getElementById("breakEternityBtn").textContent = (player.quantum.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
		document.getElementById("eternalMatter").textContent = shortenDimensions(player.quantum.breakEternity.eternalMatter)
		for (var u=1;u<8;u++) {
			document.getElementById("breakUpg" + u).className = player.quantum.breakEternity.upgrades.includes(u) ? "eternityupbtnbought" : player.quantum.breakEternity.eternalMatter.gte(getBreakUpgCost(u)) ? "eternityupbtn" : "eternityupbtnlocked"
			document.getElementById("breakUpg" + u + "Cost").textContent = shortenDimensions(getBreakUpgCost(u))
		}
		document.getElementById("breakUpg7MultIncrease").textContent = shortenDimensions(1e9)
		document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
	} else {
		document.getElementById("breakEternityReq").style.display = ""
		document.getElementById("breakEternityReq").textContent = "You need to get " + shorten(new Decimal("1e1220")) + " EP before you will be able to Break Eternity."
		document.getElementById("breakEternityNoBigRip").style.display = "none"
		document.getElementById("breakEternityShop").style.display = "none"
	}
}

function breakEternity() {
	player.quantum.breakEternity.break = !player.quantum.breakEternity.break
	document.getElementById("breakEternityBtn").textContent = (player.quantum.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
	giveAchievement("Time Breaker")
	if (!player.dilation.active && isSmartPeakActivated) {
		EPminpeakType = 'normal'
		EPminpeak = new Decimal(0)
		player.peakSpent = 0
	}
}

function getEMGain() {
	let mult=1
	if (hasNU(9)) mult=tmp.nu[4]
	let log=player.timeShards.div(1e15).log10()*0.25
	if (log>15) return Decimal.pow(10,Math.sqrt(log*15)).times(mult).floor()
	return Decimal.pow(10,log).times(mult).floor()
}

var breakUpgCosts = [1, 1e3, 1e6, 2e11, 8e17, 1e48]
function getBreakUpgCost(id) {
	if (id == 7) return Decimal.pow(2, player.quantum.breakEternity.epMultPower).times(1e6)
	return breakUpgCosts[id-1]
}

function buyBreakUpg(id) {
	if (!player.quantum.breakEternity.eternalMatter.gte(getBreakUpgCost(id)) || player.quantum.breakEternity.upgrades.includes(id)) return
	player.quantum.breakEternity.eternalMatter = player.quantum.breakEternity.eternalMatter.sub(getBreakUpgCost(id))
	if (id == 7) {
		player.quantum.breakEternity.epMultPower++
		document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		document.getElementById("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
	} else player.quantum.breakEternity.upgrades.push(id)
	document.getElementById("eternalMatter").textContent = shortenDimensions(player.quantum.breakEternity.eternalMatter)
	for (var u=1;u<8;u++) document.getElementById("breakUpg" + u).className = player.quantum.breakEternity.upgrades.includes(u) ? "eternityupbtnbought" : player.quantum.breakEternity.eternalMatter.gte(getBreakUpgCost(u)) ? "eternityupbtn" : "eternityupbtnlocked"
}

function getBreakUpgMult(id) {
	if (id == 1) {
		var log1 = player.eternityPoints.div("1e1280").add(1).log10()
		var log2 = player.quantum.breakEternity.eternalMatter.add(1).log10()
		return Decimal.pow(10, Math.pow(log1, 1/3) * 0.5 + Math.pow(log2, 1/3)).max(1)
	}
	if (id == 2) {
		var log = player.eternityPoints.div("1e1290").add(1).log10()
		return Math.pow(Math.log10(log + 1) * 1.6 + 1, 2)
	}
	if (id == 3) {
		var log = player.eternityPoints.div("1e1370").add(1).log10()
		return Decimal.pow(10, Math.pow(log, 1/3) * 0.5)
	}
	if (id == 4) {
		var log1 = player.eternityPoints.div("1e1860").add(1).log10()
		var log2 = player.quantum.bigRip.spaceShards.div("7e19").add(1).log10()
		return Decimal.pow(10, Math.pow(log1, 1/3) + Math.pow(log2, 1/3) * 8)
	}
	if (id == 5) {
		var log1 = player.eternityPoints.div("1e2230").add(1).log10()
		var log2 = player.timeShards.div(1e90).add(1).log10()
		var log = Math.pow(log1, 1/3) + Math.pow(log2, 1/3)
		return Decimal.pow(1e4, log)
	}
	if (id == 6) {
		var log1 = player.eternityPoints.div("1e4900").add(1).log10()
		var log2 = player.quantum.breakEternity.eternalMatter.div(1e45).add(1).log10()
		return Decimal.pow(10, Math.pow(log1, 1/3) / 1.7 + Math.pow(log2, 1/3) * 2)
	}
	if (id == 7) return Decimal.pow(1e9, player.quantum.breakEternity.epMultPower)
}

function getExtraTickReductionMult() {
	if (player.masterystudies !== undefined ? player.quantum.bigRip.active && player.quantum.breakEternity.break : false) {
		let ret = new Decimal(1)
		if (player.quantum.breakEternity.upgrades.includes(5)) ret = ret.times(getBreakUpgMult(5))
		return ret
	} else return 1
}

function maxBuyBEEPMult() {
	let cost=getBreakUpgCost(7)
	if (!player.quantum.breakEternity.eternalMatter.gte(cost)) return
	let toBuy=Math.floor(player.quantum.breakEternity.eternalMatter.div(cost).add(1).log(2))
	let toSpend=Decimal.pow(2,toBuy).sub(1).times(cost)
	player.quantum.breakEternity.epMultPower+=toBuy
	if (player.quantum.breakEternity.eternalMatter.lt(toSpend)) player.quantum.breakEternity.eternalMatter=new Decimal(0)
	else player.quantum.breakEternity.eternalMatter=player.quantum.breakEternity.eternalMatter.sub(toSpend)
	document.getElementById("eternalMatter").textContent = shortenDimensions(player.quantum.breakEternity.eternalMatter)
	document.getElementById("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
	document.getElementById("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
	for (var u=1;u<8;u++) document.getElementById("breakUpg" + u).className = player.quantum.breakEternity.upgrades.includes(u) ? "eternityupbtnbought" : player.quantum.breakEternity.eternalMatter.gte(getBreakUpgCost(u)) ? "eternityupbtn" : "eternityupbtnlocked"
}

function getGHPGain() {
	if (player.masterystudies == undefined) return new Decimal(0)
	if (!player.quantum.bigRip.active) return new Decimal(0)
	return player.quantum.bigRip.bestThisRun.div(Decimal.pow(10, getQCGoal())).pow(2/getQCGoal()).times(Decimal.pow(2, player.ghostify.multPower - 1)).floor()
}

ghostified = false
function ghostify() {
	if ((!isQuantumReached()&&player.quantum.bigRip.active)||implosionCheck) return
	if (player.aarexModifications.ghostifyConf) if(!confirm("Ghostifying resets everything quantum resets, and also resets your best TP & MA, quarks, gluons, electrons, Quantum Challenges, Replicants, Nanofield, and Tree of Decay to gain a Ghost Particle. Are you ready for this?")) return
	if (!ghostified) {
		if (!confirm("Are you sure you want to do that? You will lose everything you have!")) return
		if (!confirm("ARE YOU REALLY SURE YOU WANT TO DO THAT? YOU CAN'T UNDO THIS AFTER YOU BECAME A GHOST AND PASS THE UNIVERSE EVEN IT IS BIG RIPPED! THIS IS YOUR LAST CHANCE!")) return
	}
	var implode = player.options.animations.ghostify
	if (implode) {
		var gain = getGHPGain()
		var amount = player.ghostify.ghostParticles.add(gain).round()
		var seconds = ghostified ? 4 : 10
		implosionCheck=1
		dev.ghostify(gain, amount, seconds)
		setTimeout(function(){
			isEmptiness = true
			showTab("")
		}, seconds * 250)
		setTimeout(function(){
			ghostifyReset(true, gain, amount)
		}, seconds * 500)
		setTimeout(function(){
			implosionCheck=0
		}, seconds * 1000)
	} else ghostifyReset()
}

function ghostifyReset(implode, gain, amount, force) {
	if (!force) {
		if (gain === undefined) {
			var gain = getGHPGain()
			player.ghostify.ghostParticles = player.ghostify.ghostParticles.add(gain).round()
		} else player.ghostify.ghostParticles = amount
		for (var i=player.ghostify.last10.length-1; i>0; i--) player.ghostify.last10[i] = player.ghostify.last10[i-1]
		player.ghostify.last10[0] = [player.ghostify.time, gain]
		player.ghostify.times++
		player.ghostify.best = Math.min(player.ghostify.best, player.ghostify.time)
		while (player.quantum.times<=tmp.bm[player.ghostify.milestones]) {
			player.ghostify.milestones++
			if (player.ghostify.milestones==2) document.getElementById('coloredQuarksProduction').innerHTML="You are getting <span id='rPowerRate' style='font-size:35px' class='red'></span> red power, <span id='gPowerRate' style='font-size:35px' class='green'></span> green power, and <span id='bPowerRate' style='font-size:35px' class='blue'></span> blue power per second."
		}
	}
	if (player.quantum.bigRip.active) switchAB()
	var bm = player.ghostify.milestones
	if (bm > 15) giveAchievement("I rather oppose the theory of everything")
	player.ghostify.time = 0
	player = {
		money: new Decimal(10),
		tickSpeedCost: new Decimal(1000),
		tickspeed: new Decimal(player.aarexModifications.newGameExpVersion?500:1000),
		tickBoughtThisInf: resetTickBoughtThisInf(),
		firstCost: new Decimal(10),
		secondCost: new Decimal(100),
		thirdCost: new Decimal(10000),
		fourthCost: new Decimal(1000000),
		fifthCost: new Decimal(1e9),
		sixthCost: new Decimal(1e13),
		seventhCost: new Decimal(1e18),
		eightCost: new Decimal(1e24),
		firstAmount: new Decimal(0),
		secondAmount: new Decimal(0),
		thirdAmount: new Decimal(0),
		fourthAmount: new Decimal(0),
		firstBought: 0,
		secondBought: 0,
		thirdBought: 0,
		fourthBought: 0,
		fifthAmount: new Decimal(0),
		sixthAmount: new Decimal(0),
		seventhAmount: new Decimal(0),
		eightAmount: new Decimal(0),
		fifthBought: 0,
		sixthBought: 0,
		seventhBought: 0,
		eightBought: 0,
		totalBoughtDims: resetTotalBought(),
		firstPow: new Decimal(1),
		secondPow: new Decimal(1),
		thirdPow: new Decimal(1),
		fourthPow: new Decimal(1),
		fifthPow: new Decimal(1),
		sixthPow: new Decimal(1),
		seventhPow: new Decimal(1),
		eightPow: new Decimal(1),
		sacrificed: new Decimal(0),
		achievements: player.achievements,
		challenges: player.challenges,
		currentChallenge: "",
		infinityUpgrades: player.infinityUpgrades,
		setsUnlocked: 0,
		infinityPoints: player.infinityPoints,
		infinitied: 0,
		infinitiedBank: player.achievements.includes("ng3p15") ? player.infinitiedBank : 0,
		totalTimePlayed: player.totalTimePlayed,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: 0,
		dbPower: player.dbPower,
		tickspeedBoosts: player.tickspeedBoosts,
		galaxies: 0,
		galacticSacrifice: resetGalacticSacrifice(),
		totalmoney: player.totalmoney,
		interval: null,
		lastUpdate: player.lastUpdate,
		achPow: player.achPow,
		autobuyers: player.autobuyers,
		partInfinityPoint: 0,
		partInfinitied: 0,
		break: player.break,
		costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
		tickspeedMultiplier: new Decimal(10),
		chall2Pow: 1,
		chall3Pow: new Decimal(0.01),
		newsArray: player.newsArray,
		matter: new Decimal(0),
		chall11Pow: new Decimal(1),
		challengeTimes: player.challengeTimes,
		infchallengeTimes: player.infchallengeTimes,
		lastTenRuns: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		lastTenEternities: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		infMult: new Decimal(1),
		infMultCost: new Decimal(10),
		tickSpeedMultDecrease: Math.max(player.tickSpeedMultDecrease, bm > 1 ? 1.25 : 2),
		tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
		dimensionMultDecrease: player.dimensionMultDecrease,
		dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
		extraDimPowerIncrease: player.extraDimPowerIncrease,
		dimPowerIncreaseCost: player.dimPowerIncreaseCost,
		version: player.version,
		postC4Tier: 1,
		postC8Mult: new Decimal(1),
		overXGalaxies: player.overXGalaxies,
		overXGalaxiesTickspeedBoost: player.tickspeedBoosts == undefined ? player.overXGalaxiesTickspeedBoost : 0,
		spreadingCancer: player.spreadingCancer,
		postChallUnlocked: 8,
		postC4Tier: 0,
		postC3Reward: new Decimal(1),
		eternityPoints: new Decimal(0),
		eternities: bm ? 1e13 : 0,
		eternitiesBank: 0,
		thisEternity: 0,
		bestEternity: 9999999999,
		eternityUpgrades: bm ? [1, 2, 3, 4, 5, 6] : [],
		epmult: new Decimal(1),
		epmultCost: new Decimal(500),
		infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
		infinityPower: new Decimal(1),
		infinityDimension1 : {
			cost: new Decimal(1e8),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension2 : {
			cost: new Decimal(1e9),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension3 : {
			cost: new Decimal(1e10),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension4 : {
			cost: new Decimal(1e20),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension5 : {
			cost: new Decimal(1e140),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension6 : {
			cost: new Decimal(1e200),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension7 : {
			cost: new Decimal(1e250),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension8 : {
			cost: new Decimal(1e280),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infDimBuyers: [false, false, false, false, false, false, false, false],
		timeShards: new Decimal(0),
		tickThreshold: new Decimal(1),
		totalTickGained: 0,
		timeDimension1: {
			cost: new Decimal(1),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension2: {
			cost: new Decimal(5),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension3: {
			cost: new Decimal(100),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension4: {
			cost: new Decimal(1000),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension5: {
			cost: new Decimal("1e2350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension6: {
			cost: new Decimal("1e2650"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension7: {
			cost: new Decimal("1e3000"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension8: {
			cost: new Decimal("1e3350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		offlineProd: player.offlineProd,
		offlineProdCost: player.offlineProdCost,
		challengeTarget: 0,
		autoSacrifice: player.autoSacrifice,
		replicanti: {
			amount: new Decimal(bm ? 1 : 0),
			unl: bm ? true : false,
			chance: 0.01,
			chanceCost: new Decimal(1e150),
			interval: 1000,
			intervalCost: new Decimal(1e140),
			gal: 0,
			galaxies: 0,
			galCost: new Decimal(1e170),
			galaxybuyer: player.replicanti.galaxybuyer,
			auto: bm ? player.replicanti.auto : [false, false, false]
		},
		timestudy: bm ? player.timestudy : {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: [],
		},
		eternityChalls: bm ? player.eternityChalls : {},
		eternityChallGoal: new Decimal(Number.MAX_VALUE),
		currentEternityChall: "",
		eternityChallUnlocked: 0,
		etercreq: 0,
		autoIP: new Decimal(0),
		autoTime: 1e300,
		infMultBuyer: bm ? player.infMultBuyer : false,
		autoCrunchMode: player.autoCrunchMode,
		autoEterMode: bm ? player.autoEterMode : "amount",
		peakSpent: 0,
		respec: false,
		respecMastery: false,
		eternityBuyer: bm ? player.eternityBuyer : {
			limit: new Decimal(0),
			isOn: false,
			dilationMode: false,
			dilationPerAmount: 10,
			dilMode: player.eternityBuyer.dilMode,
			tpUpgraded: player.eternityBuyer.tpUpgraded,
			slowStop: player.eternityBuyer.slowStop,
			slowStopped: player.eternityBuyer.slowStopped,
			ifAD: player.eternityBuyer.ifAD,
			presets: player.eternityBuyer.presets
		},
		eterc8ids: 50,
		eterc8repl: 40,
		dimlife: true,
		dead: true,
		dilation: {
			studies: bm ? player.dilation.studies : [],
			active: false,
			times: 0,
			tachyonParticles: new Decimal(0),
			dilatedTime: new Decimal(bm ? 1e100 : 0),
			totalTachyonParticles: new Decimal(0),
			bestTP: new Decimal(0),
			bestTPOverGhostifies: player.dilation.bestTPOverGhostifies,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: bm ? player.dilation.upgrades : [],
			rebuyables: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
			}
		},
		why: player.why,
		options: player.options,
		meta: {
			antimatter: new Decimal(100),
			bestAntimatter: new Decimal(100),
			bestOverQuantums: new Decimal(100),
			bestOverGhostifies: player.meta.bestOverGhostifies,
			resets: 0,
			'1': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(10)
			},
			'2': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(100)
			},
			'3': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e4)
			},
			'4': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e6)
			},
			'5': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e9)
			},
			'6': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e13)
			},
			'7': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e18)
			},
			'8': {
				amount: new Decimal(0),
				bought: 0,
				cost: new Decimal(1e24)
			}
		},
		masterystudies: bm ? player.masterystudies : [],
		autoEterOptions: player.autoEterOptions,
		galaxyMaxBulk: player.galaxyMaxBulk,
		quantum: {
			reached: true,
			times: 0,
			time: 0,
			best: 9999999999,
			last10: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
			autoEC: player.quantum.autoEC,
			disabledRewards: player.quantum.disabledRewards,
			metaAutobuyerWait: 0,
			autobuyer: {
				enabled: false,
				limit: new Decimal(0),
				mode: "amount",
				peakTime: 0
			},
			autoOptions: {
				assignQK: player.quantum.autoOptions.assignQK,
				assignQKRotate: player.quantum.autoOptions.assignQKRotate,
				sacrifice: bm ? player.quantum.autoOptions.sacrifice : false
			},
			assignAllRatios: player.quantum.assignAllRatios,
			quarks: new Decimal(0),
			usedQuarks: {
				r: new Decimal(0),
				g: new Decimal(0),
				b: new Decimal(0)
			},
			colorPowers: {
				r: new Decimal(0),
				g: new Decimal(0),
				b: new Decimal(0)
			},
			gluons: {
				rg: new Decimal(0),
				gb: new Decimal(0),
				br: new Decimal(0)
			},
			multPower: {
				rg: 0,
				gb: 0,
				br: 0,
				total: 0
			},
			electrons: {
				amount: 0,
				sacGals: 0,
				mult: bm > 2 ? player.quantum.electrons.mult : bm ? 6 : 2,
				rebuyables: bm > 2 ? player.quantum.electrons.rebuyables : [0,0,0,0]
			},
			challenge: [],
			challenges: {},
			challengeRecords: {},
			pairedChallenges: {
				order: bm ? player.quantum.pairedChallenges.order : {},
				current: 0,
				completed: bm ? 4 : 0,
				completions: player.quantum.pairedChallenges.completions,
				fastest: player.quantum.pairedChallenges.fastest,
				pc68best: player.quantum.pairedChallenges.pc68best,
				respec: false
			},
			qcsNoDil: player.quantum.qcsNoDil,
			replicants: {
				amount: new Decimal(0),
				requirement: new Decimal("1e3000000"),
				quarks: new Decimal(0),
				quantumFood: 0,
				quantumFoodCost: new Decimal(2e46),
				limit: 1,
				limitDim: 1,
				limitCost: new Decimal(1e49),
				eggonProgress: new Decimal(0),
				eggons: new Decimal(0),
				hatchSpeed: 20,
				hatchSpeedCost: new Decimal(1e49),
				babyProgress: new Decimal(0),
				babies: new Decimal(0),
				ageProgress: new Decimal(0)
			},
			emperorDimensions: {},
			nanofield: {
				charge: new Decimal(0),
				energy: new Decimal(0),
				antienergy: new Decimal(0),
				power: 0,
				powerThreshold: new Decimal(50),
				rewards: bm>12?15:0,
				producingCharge: false
			},
			reachedInfQK: bm,
			tod: {
				r: {
					quarks: new Decimal(bm > 13 ? 1e25 : 0),
					spin: new Decimal(0),
					gainDiv: new Decimal(0),
					upgrades: {}
				},
				g: {
					quarks: new Decimal(bm > 13 ? 1e25 : 0),
					spin: new Decimal(0),
					gainDiv: new Decimal(0),
					upgrades: {}
				},
				b: {
					quarks: new Decimal(bm > 13 ? 1e25 : 0),
					spin: new Decimal(0),
					gainDiv: new Decimal(0),
					upgrades: {}
				},
				upgrades: {}
			},
			bigRip: {
				active: false,
				conf: true,
				times: 0,
				bestThisRun: new Decimal(0),
				bestAntimatter: player.quantum.bigRip.bestAntimatter,
				totalAntimatter: player.quantum.bigRip.totalAntimatter,
				savedAutobuyersNoBR: player.quantum.bigRip.savedAutobuyersNoBR,
				savedAutobuyersBR: player.quantum.bigRip.savedAutobuyersBR,
				spaceShards: new Decimal(0),
				upgrades: []
			},
			breakEternity: {
				unlocked: bm > 14,
				break: false,
				eternalMatter: new Decimal(0),
				upgrades: bm > 14 ? [1, 2, 3, 4, 5, 6] : [],
				epMultPower: 0
			},
			notrelative: true,
			wasted: true,
			producedGluons: 0,
			realGluons: 0,
			bosons: {
				'w+': 0,
				'w-': 0,
				'z0': 0
			},
			neutronstar: {
				quarks: 0,
				metaAntimatter: 0,
				dilatedTime: 0
			},
			rebuyables: {
				1: 0,
				2: 0
			},
			upgrades: bm > 1 ? player.quantum.upgrades : []
		},
		old: false,
		dontWant: true,
		ghostify: player.ghostify,
		aarexModifications: player.aarexModifications
	}
	//Pre-infinity
	if (player.challenges.includes("challenge1")) player.money = new Decimal(100)
	if (player.achievements.includes("r37")) player.money = new Decimal(1000)
	if (player.achievements.includes("r54")) player.money = new Decimal(2e5)
	if (player.achievements.includes("r55")) player.money = new Decimal(1e10)
	if (player.achievements.includes("r78")) player.money = new Decimal(1e25)
	setInitialDimensionPower()
	updatePowers()
	mult18 = new Decimal(1)
	GPminpeak = new Decimal(0)
	if (implode) showTab("dimensions")
	document.getElementById("secondRow").style.display = "none"
	document.getElementById("thirdRow").style.display = "none"
	document.getElementById("tickSpeed").style.visibility = "hidden"
	document.getElementById("tickSpeedMax").style.visibility = "hidden"
	document.getElementById("tickLabel").style.visibility = "hidden"
	document.getElementById("tickSpeedAmount").style.visibility = "hidden"
	document.getElementById("fourthRow").style.display = "none"
	document.getElementById("fifthRow").style.display = "none"
	document.getElementById("sixthRow").style.display = "none"
	document.getElementById("seventhRow").style.display = "none"
	document.getElementById("eightRow").style.display = "none"
	updateTickSpeed()

	//Infinity
	if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4)
	if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4)
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25)
	player.challenges=challengesCompletedOnEternity()
	IPminpeak = new Decimal(0)
	if (isEmptiness) {
		showTab("dimensions")
		isEmptiness = false
		document.getElementById("quantumtabbtn").style.display = "inline-block"
		document.getElementById("ghostifytabbtn").style.display = "inline-block"
	}
	document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
	document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
	document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(getIPMult()) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
	document.getElementById("infmultbuyer").textContent="Max buy IP mult"
	if (implode) showChallengesTab("normalchallenges")
	updateChallenges()
	document.getElementById("matter").style.display = "none"
	updateAutobuyers()
	hideMaxIDButton()
	if (!bm) {
		ipMultPower = player.masterystudies.includes("t241") ? 2.2 : 2
		document.getElementById("replicantidiv").style.display="none"
		document.getElementById("replicantiunlock").style.display="inline-block"
		document.getElementById("replicantiresettoggle").style.display = "none"
		delete player.replicanti.galaxybuyer
	}
	updateLastTenRuns()
	if ((document.getElementById("metadimensions").style.display == "block" && !bm) || implode) showDimTab("antimatterdimensions")
	resetInfDimensions()

	//Eternity
	EPminpeakType = 'normal'
	EPminpeak = new Decimal(0)
	document.getElementById("eternitybtn").style.display = "none"
	document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
	document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
	if (((document.getElementById("masterystudies").style.display == "block" || document.getElementById("breakEternity").style.display == "block") && !bm) || implode) showEternityTab("timestudies", document.getElementById("eternitystore").style.display == "none")
	updateLastTenEternities()
	resetTimeDimensions()
	updateRespecButtons()
	updateMilestones()
	updateEternityUpgrades()
	updateTheoremButtons()
	updateTimeStudyButtons()
	if (player.autoEterMode=="replicanti"||player.autoEterMode=="peak") {
		player.autoEterMode="amount"
		updateAutoEterMode()
	}
	updateEternityChallenges()
	updateDilationUpgradeCosts()
	for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) document.getElementById(i + "MetaRow").style.display = "none"
	if (!bm) document.getElementById("masterystudyunlock").style.display = "none"
	updateMasteryStudyCosts()
	updateMasteryStudyButtons()

	//Quantum
	player.quantum.replicants.amount = new Decimal(0)
	player.quantum.replicants.requirement = new Decimal("1e3000000")
	player.quantum.replicants.quarks = new Decimal(0)
	player.quantum.replicants.eggonProgress = new Decimal(0)
	player.quantum.replicants.eggons = new Decimal(0)
	player.quantum.replicants.babyProgress = new Decimal(0)
	player.quantum.replicants.babies = new Decimal(0)
	player.quantum.replicants.growupProgress = new Decimal(0)
	eds = player.quantum.emperorDimensions
	QKminpeak = new Decimal(0)
	QKminpeakValue = new Decimal(0)
	if (implode) showQuantumTab("uquarks")
	var permUnlocks=[7,9,10,10,11,11,12,12]
	for (var i=1;i<9;i++) {
		var num=bm>=permUnlocks[i-1]?10:0
		ed[i]={workers:new Decimal(num),progress:new Decimal(0),perm:new Decimal(num)}
		if (num>9) player.quantum.replicants.limitDim=i
	}
	if (bm>6) {
		player.quantum.replicants.limit=10
		player.quantum.replicants.limitCost=Decimal.pow(200,player.quantum.replicants.limitDim*9).times(1e49)
	}
	if (bm) {
		for (var i=1;i<9;i++) player.quantum.challenges[i] = 2
		for (var u=1;u<18;u++) player.quantum.bigRip.upgrades.push(u)
	} else {
		document.getElementById('rebuyupgauto').style.display="none"
		document.getElementById('toggleallmetadims').style.display="none"
		document.getElementById('metaboostauto').style.display="none"
		document.getElementById("autoBuyerQuantum").style.display="none"
		document.getElementById("electronstabbtn").style.display = "none"
		document.getElementById("nanofieldtabbtn").style.display = "none"
		document.getElementById('toggleautoquantummode').style.display="none"
		document.getElementById("edtabbtn").style.display = "none"
	}
	updateLastTenQuantums()
	updateSpeedruns()
	updateColorCharge()
	updateGluons("prestige")
	updateQuantumWorth("quick")
	updateQuantumChallenges()
	updatePCCompletions()
	updateReplicants("prestige")
	updateEmperorDimensions()
	updateTODStuff()
	updateBreakEternity()
	
	//Ghostify
	GHPminpeak = new Decimal(0)
	GHPminpeakValue = new Decimal(0)
	document.getElementById("ghostifybtn").style.display = "none"
	if (!ghostified) {
		ghostified = true
		document.getElementById('bestTP').textContent="Your best Tachyon particles in this Ghostify was "+shorten(player.dilation.bestTP)+"."
		document.getElementById("ghostifytabbtn").style.display = "inline-block"
		document.getElementById("ghostparticles").style.display = ""
		document.getElementById("ghostifyAnimBtn").style.display = "inline-block"
		document.getElementById("ghostifyConfirmBtn").style.display = "inline-block"
		giveAchievement("Kee-hee-hee!")
	}
	document.getElementById("GHPAmount").textContent = shortenDimensions(player.ghostify.ghostParticles)
	player.ghostify.neutrinos.electron = new Decimal(0)
	player.ghostify.neutrinos.mu = new Decimal(0)
	player.ghostify.neutrinos.tau = new Decimal(0)
	player.ghostify.noGrind = !player.masterystudies.includes("d13")
	updateLastTenGhostifies()
	updateBraveMilestones()
}

function toggleGhostifyConf() {
	player.aarexModifications.ghostifyConf = !player.aarexModifications.ghostifyConf
	document.getElementById("ghostifyConfirmBtn").textContent = "Ghostify confirmation: O" + (player.aarexModifications.ghostifyConf ? "N" : "FF")
}

function getGHPRate(num) {
	if (num.lt(1/60)) return (num*1440).toFixed(1)+" GHP/day"
	if (num.lt(1)) return (num*60).toFixed(1)+" GHP/hr"
	return shorten(num)+" GHP/min"
}

var averageGHP = new Decimal(0)
var bestGHP
function updateLastTenGhostifies() {
	if (player.masterystudies === undefined) return
    var listed = 0
    var tempTime = new Decimal(0)
    var tempGHP = new Decimal(0)
    for (var i=0; i<10; i++) {
        if (player.ghostify.last10[i][1].gt(0)) {
            var qkpm = player.ghostify.last10[i][1].dividedBy(player.ghostify.last10[i][0]/600)
            var tempstring = shorten(qkpm) + " GHP/min"
            if (qkpm<1) tempstring = shorten(qkpm*60) + " GHP/hour"
            var msg = "The Ghostify " + (i == 0 ? '1 Ghostify' : (i+1) + ' Ghostifies') + " ago took " + timeDisplayShort(player.ghostify.last10[i][0], false, 3) + " and gave " + shortenDimensions(player.ghostify.last10[i][1]) +" GHP. "+ tempstring
            document.getElementById("ghostifyrun"+(i+1)).textContent = msg
            tempTime = tempTime.plus(player.ghostify.last10[i][0])
            tempGHP = tempGHP.plus(player.ghostify.last10[i][1])
            bestGHP = player.ghostify.last10[i][1].max(bestGHP)
            listed++
        } else document.getElementById("ghostifyrun"+(i+1)).textContent = ""
    }
    if (listed > 1) {
        tempTime = tempTime.dividedBy(listed)
        tempGHP = tempGHP.dividedBy(listed)
        var qkpm = tempGHP.dividedBy(tempTime/600)
        var tempstring = shorten(qkpm) + " GHP/min"
        averageGHP = tempGHP
        if (qkpm<1) tempstring = shorten(qkpm*60) + " GHP/hour"
        document.getElementById("averageGhostifyRun").textContent = "Last " + listed + " Ghostifys average time: "+ timeDisplayShort(tempTime, false, 3)+" Average GHP gain: "+shortenDimensions(tempGHP)+" GHP. "+tempstring
    } else document.getElementById("averageGhostifyRun").textContent = ""
}

function updateBraveMilestones() {
	if (ghostified) {
		for (var m=1;m<17;m++) document.getElementById("braveMilestone"+m).className="achievement achievement"+(player.ghostify.milestones<m?"":"un")+"locked"
		for (var r=1;r<3;r++) document.getElementById("braveRow"+r).className=player.ghostify.milestones<r*8?"":"completedrow"
	}
}

function showGhostifyTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = document.getElementsByClassName('ghostifytab');
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
	if (oldTab !== tabName) player.aarexModifications.tabsSave.tabGhostify = tabName
	closeToolTip()
}

function updateGhostifyTabs() {
	if (document.getElementById("neutrinos").style.display=="block") {
		var generations = ["electron", "Muon", "Tau"]
		var neutrinoGain = getNeutrinoGain()
		var sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
		document.getElementById("neutrinosGain").textContent="You gain " + shortenDimensions(neutrinoGain) + " " + generations[player.ghostify.neutrinos.generationGain - 1] + " neutrino" + (neutrinoGain.eq(1) ? "" : "s") + " each time you get 1 normal galaxy."
		document.getElementById("electronNeutrinos").textContent=shortenDimensions(player.ghostify.neutrinos.electron)
		document.getElementById("muonNeutrinos").textContent=shortenDimensions(player.ghostify.neutrinos.mu)
		document.getElementById("tauNeutrinos").textContent=shortenDimensions(player.ghostify.neutrinos.tau)
		document.getElementById("preNeutrinoBoost1").textContent=getDilExp("neutrinos").toFixed(2)
		document.getElementById("neutrinoBoost1").textContent=getDilExp().toFixed(2)
		if (player.ghostify.neutrinos.boosts>1) {
			document.getElementById("preNeutrinoBoost2").textContent=shorten(getMTSMult(273, "pn"))
			document.getElementById("neutrinoBoost2").textContent="^"+shorten(getMTSMult(273))
		}
		if (player.ghostify.neutrinos.boosts>2) document.getElementById("neutrinoBoost3").textContent=getFullExpansion(tmp.nb[2])
		if (player.ghostify.neutrinos.boosts>3) document.getElementById("neutrinoBoost4").textContent=(tmp.nb[3]*100-100).toFixed(1)
		if (player.ghostify.neutrinos.boosts>4) document.getElementById("neutrinoBoost5").textContent=shorten(tmp.nb[4])
		if (player.ghostify.neutrinos.boosts>5) document.getElementById("neutrinoBoost6").textContent=shorten(tmp.nb[5])
		if (player.ghostify.neutrinos.boosts>6) document.getElementById("neutrinoBoost6").textContent=shorten(tmp.nb[6])
		if (player.ghostify.neutrinos.boosts>7) document.getElementById("neutrinoBoost7").textContent=(tmp.nb[7]*100-100).toFixed(1)
		if (player.ghostify.neutrinos.boosts>8) document.getElementById("neutrinoBoost8").textContent=(tmp.nb[8]*100).toFixed(1)
		document.getElementById("neutrinoUpg1Pow").textContent=tmp.nu[0]
		document.getElementById("neutrinoUpg3Pow").textContent=shorten(tmp.nu[1])
		document.getElementById("neutrinoUpg4Pow").textContent=shorten(tmp.nu[2])
		document.getElementById("neutrinoUpg7Pow").textContent=shorten(tmp.nu[3])
		document.getElementById("neutrinoUpg9Pow").textContent=shorten(tmp.nu[4])
		for (var u=1; u<10; u++) {
			if (hasNU(u)) document.getElementById("neutrinoUpg" + u).className = "gluonupgradebought neutrinoupg"
			else if (sum.gte(tmp.nuc[u])) document.getElementById("neutrinoUpg" + u).className = "gluonupgrade neutrinoupg"
			else document.getElementById("neutrinoUpg" + u).className = "gluonupgrade unavailablebtn"
		}
		if (player.ghostify.ghostParticles.gte(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))) document.getElementById("neutrinoMultUpg").className = "gluonupgrade neutrinoupg"
		else document.getElementById("neutrinoMultUpg").className = "gluonupgrade unavailablebtn"
		if (sum.gte(Decimal.pow(25,player.ghostify.multPower-1).times(1e10))) document.getElementById("ghpMultUpg").className = "gluonupgrade neutrinoupg"
		else document.getElementById("ghpMultUpg").className = "gluonupgrade unavailablebtn"
	}
	if (document.getElementById("automaticghosts").style.display=="block") if (player.ghostify.milestones>7||player.achievements.includes("ng3p66")) updateQuantumWorth("display")
}

function onNotationChangeNeutrinos() {
	if (player.masterystudies == undefined) return
	document.getElementById("neutrinoUnlockCost").textContent=shortenDimensions(tmp.nbc[player.ghostify.neutrinos.boosts])
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5,player.ghostify.neutrinos.multPower-1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))
	document.getElementById("ghpMult").textContent=shortenDimensions(Decimal.pow(2,player.ghostify.multPower-1))
	document.getElementById("ghpMultUpgCost").textContent=shortenDimensions(Decimal.pow(25,player.ghostify.multPower-1).times(1e10))
	for (var u=1; u<10; u++) document.getElementById("neutrinoUpg"+u+"Cost").textContent=shortenDimensions(tmp.nuc[u])
	document.getElementById("BU8Cap").textContent=shorten(Number.MAX_VALUE)
}

function getNeutrinoGain() {
	return Decimal.pow(5,player.ghostify.neutrinos.multPower-1)
}

function buyNeutrinoUpg(id) {
	let sum=player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost=new Decimal(tmp.nuc[id])
	if (!sum.gte(cost)||player.ghostify.neutrinos.upgrades.includes(id)) return
	player.ghostify.neutrinos.upgrades.push(id)
	let generations=["electron","mu","tau"]
	for (g=0;g<3;g++) player.ghostify.neutrinos[generations[g]]=player.ghostify.neutrinos[generations[g]].sub(cost.times(player.ghostify.neutrinos[generations[g]]).div(sum)).round()
	if (id==2) {
		document.getElementById("eggonsCell").style.display="none"
		document.getElementById("workerReplWhat").textContent="babies"
	}
	if (id==5) {
		document.getElementById("electronsGainMult").textContent=getELCMult().toFixed(2)
		player.quantum.electrons.amount*=3.5
	}
}

function updateNeutrinoBoosts() {
	for (var b=2;b<10;b++) document.getElementById("neutrinoBoost"+(b%3==1?"Row"+(b+2)/3:"Cell"+b)).style.display=player.ghostify.neutrinos.boosts>=b?"":"none"
	document.getElementById("neutrinoUnlock").style.display=player.ghostify.neutrinos.boosts>8?"none":""
	document.getElementById("neutrinoUnlockCost").textContent=shortenDimensions(tmp.nbc[player.ghostify.neutrinos.boosts])
}

function unlockNeutrinoBoost() {
	var cost=tmp.nbc[player.ghostify.neutrinos.boosts]
	if (!player.ghostify.ghostParticles.lte(cost)||player.ghostify.neutrinos.boosts>8) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.boosts++
	updateNeutrinoBoosts()
	if (player.ghostify.neutrinos.boosts==3) tmp.nb[2]=0
}

function hasNU(id) {
	return ghostified ? player.ghostify.neutrinos.upgrades.includes(id) : false
}

function buyNeutrinoMult() {
	let cost=Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.multPower++
	document.getElementById("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5,player.ghostify.neutrinos.multPower-1))
	document.getElementById("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))
}

function buyGHPMult() {
	let sum=player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost=Decimal.pow(25,player.ghostify.multPower-1).times(1e10)
	if (!sum.gte(cost)) return
	player.ghostify.neutrinos.upgrades.push(id)
	let generations=["electron","mu","tau"]
	for (g=0;g<3;g++) player.ghostify.neutrinos[generations[g]]=player.ghostify.neutrinos[generations[g]].sub(cost.times(player.ghostify.neutrinos[generations[g]]).div(sum)).round()
	player.ghostify.multPower++
	document.getElementById("ghpMult").textContent=shortenDimensions(Decimal.pow(2,player.ghostify.multPower-1))
	document.getElementById("ghpMultUpgCost").textContent=shortenDimensions(Decimal.pow(25,player.ghostify.multPower-1).times(1e10))
}

function setupAutomaticGhostsData() {
	var data = {power: 0, ghosts: 3}
	for (var ghost=1; ghost<19; ghost++) data[ghost] = {on: false}
	return data
}

var autoGhostRequirements=[2,4,4,9,9,9,9,9,9,9,9,9,9,9,9,1/0]
var powerConsumed
var powerConsumptions=[0,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1]
function updateAutoGhosts(load) {
	if (load) {
		if (player.ghostify.automatorGhosts.ghosts>17) document.getElementById("nextAutomatorGhost").parentElement.style.display="none"
		else {
			document.getElementById("automatorGhostsAmount").textContent=player.ghostify.automatorGhosts.ghosts
			document.getElementById("nextAutomatorGhost").parentElement.style.display=""
			document.getElementById("nextAutomatorGhost").textContent=autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3].toFixed(1)
		}
	}
	powerConsumed=0
	for (var ghost=1;ghost<19;ghost++) {
		if (ghost>player.ghostify.automatorGhosts.ghosts) {
			if (load) document.getElementById("autoGhost"+ghost).style.display="none"
		} else {
			if (load) {
				document.getElementById("autoGhost"+ghost).style.display=""
				document.getElementById("isAutoGhostOn"+ghost).checked=player.ghostify.automatorGhosts[ghost].on
			}
			if (player.ghostify.automatorGhosts[ghost].on) powerConsumed+=powerConsumptions[ghost]
		}
	}
	document.getElementById("consumedPower").textContent=powerConsumed.toFixed(1)
	isAutoGhostsSafe=player.ghostify.automatorGhosts.power>=powerConsumed
	document.getElementById("tooMuchPowerConsumed").style.display=isAutoGhostsSafe?"none":""
}

function toggleAutoGhost(id) {
	player.ghostify.automatorGhosts[id].on = document.getElementById("isAutoGhostOn" + id).checked
	updateAutoGhosts()
}

function isAutoGhostActive(id) {
	return player.ghostify.automatorGhosts[id].on
}
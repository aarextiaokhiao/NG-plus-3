var masteryStudies = {
	initialCosts: {
		time: {241: 1e71, 251: 2e71, 252: 2e71, 253: 2e71, 261: 5e71, 262: 5e71, 263: 5e71, 264: 5e71, 265: 5e71, 266: 5e71, 271: 2.7434842249657063e76, 272: 2.7434842249657063e76, 273: 2.7434842249657063e76, 281: 6.858710562414266e76, 282: 6.858710562414266e76, 291: 2.143347050754458e77, 292: 2.143347050754458e77, 301: 8.573388203017832e77, 302: 2.6791838134430725e78, 303: 8.573388203017832e77, 311: 8.573388203017832e77, 312: 8.573388203017832e77, 321: 2.6791838134430727e76, 322: 9.324815538194444e77, 323: 2.6791838134430727e76, 331: 1.0172526041666666e79, 332: 1.0172526041666666e79, 341: 9.5367431640625e78, 342: 1.0172526041666666e79, 343: 1.0172526041666666e79, 344: 9.5367431640625e78, 351: 2.1192762586805557e79, 361: 1.5894571940104167e79, 362: 1.5894571940104167e79, 371: 2.1192762586805557e79, 372: 6.622738308376736e79, 373: 2.1192762586805557e79, 381: 6.622738308376736e79, 382: 6.622738308376736e79, 383: 6.622738308376736e79, 391: 8.27842288547092e79, 392: 8.27842288547092e79, 393: 8.27842288547092e79, 401: 4.967053731282552e80, 402: 8.278422885470921e80, 411: 1.3245476616753473e71, 412: 1.655684577094184e71, 421: 1.9868214925130208e72, 431: 1.1037897180627893e75},
		time_legacy: {},
		ec: {13: 1e72, 14: 1e72},
		ec_legacy: {},
		dil: {7: 2e82, 8: 2e84, 9: 4e85, 10: 4e87, 11: 3e90, 12: 3e92, 13: 1e95, 14: 1e98},
		dil_legacy: {}
	},
	costs: {
		time: {},
		ec: {},
		dil: {}
	},
	costMults: {241: 1, 251: 2.5, 252: 2.5, 253: 2.5, 261: 6, 262: 6, 263: 6, 264: 6, 265: 6, 266: 6, 271: 2, 272: 2, 273: 2, 281: 4, 282: 4, 291: 1, 292: 1, 301: 2, 302: 131072, 303: 2, 311: 64, 312: 64, 321: 2, 322: 2, 323: 2, 331: 2, 332: 2, 341: 1, 342: 1, 343: 1, 344: 1, 351: 4, 361: 1, 362: 1, 371: 2, 372: 2, 373: 2, 381: 1, 382: 1, 383: 2, 391: 1, 392: 1, 393: 1, 401: 1e10, 402: 1e10, 411: 1, 412: 1, 421: 1, 431: 1},
	costMult: 1,
	ecReqs: {
		13: function() {
			return 728e3 + 6e3 * ECTimesCompleted("eterc13")
		},
		14: function() {
			return 255e5 + 9e5 * ECTimesCompleted("eterc14")
		}
	},
	ecReqsStored: {},
	types: {t: "time", ec: "ec", d: "dil"},
	allStudies: [],
	allTimeStudies: [],
	allStudyEffects: {
		251: function(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		252: function(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		253: function(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		273: function(x) {
			return "^" + shorten(x)
		},
		301: function(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		332: function(x) {
			return shortenDimensions(x) + "x"
		},
		344: function(x) {
			return (x * 100 - 100).toFixed(2) + "%"
		},
		431: function(x) {
			let msg = shorten(x) + "x"
			if (shiftDown && tmp.eg431) msg += ", Galaxy amount: " + getFullExpansion(Math.floor(player.dilation.freeGalaxies)) + "+" + getFullExpansion(Math.floor(tmp.eg431))
			return msg
		}
	},
	ecsUpTo: 14,
	unlocksUpTo: 14,
	allConnections: {241: [251, 253, 252], 251: [261, 262], 252: [263, 264, "d7"], 253: [265, 266], 261: ["ec13"], 262: ["ec13"], 263: ["ec13"], 264: ["ec14"], 265: ["ec14"], 266: ["ec14"], d7: [272], 272: [271, 273, 281, 282, "d8"], 271: [281], 273: [282], d8: ["d9"], d9: [291, 292, 302], 291: [301], 292: [303], 301: [311], 302: ["d10"], 303: [312], 311: [321], d10: [322], 312: [323], 322: [331, 332], 331: [342], 332: [343], 342: [341], 343: [344], 344: [351], 351: ["d11"], d11: [361, 362], 361: [371], 362: [373], 371: [372], 372: [381], 373: [382], 381: [391], 382: [383], 383: [393], 391: [392], 393: [392], 392: ["d12"], d12: [401, 402], 401: [411], 402: [412], 411: [421], 412: ["d13"], 421: ["d13"], d13: [431], 431: ["d14"]},
	allUnlocks: {
		d7: function() {
			return quantumed
		},
		r29: function() {
			return player.masterystudies.includes("d9") || ghostified
		},
		322: function() {
			return player.masterystudies.includes("d10") || ghostified
		},
		361: function() {
			return player.masterystudies.includes("d11") || ghostified
		},
		r40: function() {
			return player.masterystudies.includes("d12") || ghostified
		},
		r43: function() {
			return player.masterystudies.includes("d13") || ghostified
		}
	},
	unlocked: [],
	spentable: [],
	latestBoughtRow: 0,
	ttSpent: 0
}

function enterMasteryPortal() {
	if (player.dilation.upgrades.includes("ngpp6")) {
		recordUpDown(1)
		showEternityTab("masterystudies")
	}
}

function exitMasteryPortal() {
	recordUpDown(2)
	showEternityTab("timestudies")
}

function convertMasteryStudyIdToDisplay(x) {
	x=x.toString()
	var ec=x.split("ec")[1]
	var dil=x.split("d")[1]
	return ec?"ec"+ec+"unl":dil?"dilstudy"+dil:"timestudy"+x
}

function updateMasteryStudyCosts() {
	masteryStudies.latestBoughtRow=0
	masteryStudies.costMult=1
	masteryStudies.bought=0
	masteryStudies.ttSpent=0
	for (id=0;id<player.masterystudies.length;id++) {
		var t=player.masterystudies[id].split("t")[1]
		if (t) {
			masteryStudies.costs.time[t]=((tmp.ngp3l&&masteryStudies.initialCosts.time_legacy[t])||masteryStudies.initialCosts.time[t])*masteryStudies.costMult
			masteryStudies.ttSpent+=masteryStudies.costs.time[t]
			if (masteryStudies.allTimeStudies.includes(parseInt(t))) masteryStudies.costMult*=masteryStudies.costMults[t]
			masteryStudies.latestBoughtRow=Math.max(masteryStudies.latestBoughtRow,Math.floor(t/10))
			masteryStudies.bought++
		}
	}
	for (id=0;id<masteryStudies.allTimeStudies.length;id++) {
		var name=masteryStudies.allTimeStudies[id]
		if (!masteryStudies.unlocked.includes(name)) break
		if (!player.masterystudies.includes("t"+name)) masteryStudies.costs.time[name]=((tmp.ngp3l&&masteryStudies.initialCosts.time_legacy[name])||masteryStudies.initialCosts.time[name])*masteryStudies.costMult
	}
	for (id=13;id<=masteryStudies.ecsUpTo;id++) {
		masteryStudies.costs.ec[id]=((tmp.ngp3l&&masteryStudies.initialCosts.ec_legacy[id])||masteryStudies.initialCosts.ec[id])*masteryStudies.costMult
		masteryStudies.ecReqsStored[id]=masteryStudies.ecReqs[id]()
	}
	for (id=7;id<=masteryStudies.unlocksUpTo;id++) masteryStudies.costs.dil[id]=(tmp.ngp3l&&masteryStudies.initialCosts.dil_legacy[id])||masteryStudies.initialCosts.dil[id]
	if (player.eternityChallUnlocked>12) masteryStudies.ttSpent+=masteryStudies.costs.ec[player.eternityChallUnlocked]
	if (masteryStudies.bought>=48) giveAchievement("The Theory of Ultimate Studies")
	updateMasteryStudyTextDisplay()
}

function setupMasteryStudies() {
	masteryStudies.allStudies=[241]
	var map=masteryStudies.allStudies
	var pos=0
	while (true) {
		var id=map[pos]
		if (!id) break
		var paths=masteryStudies.allConnections[id]
		if (paths) for (var x=0;x<paths.length;x++) {
			var y=paths[x]
			if (!map.includes(y)&&y!="d7") {
				map.push(y)
				if (y=="ec14") map.push("d7")
				if (typeof(y)=="number") masteryStudies.allTimeStudies.push(y)
			}
		}
		pos++
	}
}

function updateUnlockedMasteryStudies() {
	var unl=true
	var rowNum=0
	masteryStudies.unlocked=[]
	for (var x=0;x<masteryStudies.allStudies.length;x++) {
		var id=masteryStudies.allStudies[x]
		if (Math.floor(id/10)>rowNum) {
			rowNum=Math.floor(id/10)
			if (masteryStudies.allUnlocks["r"+rowNum]&&!masteryStudies.allUnlocks["r"+rowNum]()) unl=false
			document.getElementById("timestudy"+id).parentElement.parentElement.parentElement.parentElement.style=unl?"":"display: none !important"
			if (unl) masteryStudies.unlocked.push("r"+rowNum)
		}
		if (masteryStudies.allUnlocks[id]&&!masteryStudies.allUnlocks[id]()) unl=false
		document.getElementById(convertMasteryStudyIdToDisplay(id)).style.visibility=unl?"":"hidden"
		if (unl) masteryStudies.unlocked.push(id)
	}
}

function buyMasteryStudy(type, id, quick=false) {
	if (quick) masteryStudies.costs[masteryStudies.types[type]][id]=masteryStudies.initialCosts[masteryStudies.types[type]][id]*masteryStudies.costMult
	if (canBuyMasteryStudy(type, id)) {
		player.timestudy.theorem-=masteryStudies.costs[masteryStudies.types[type]][id]
		if (type=='ec') {
			player.eternityChallUnlocked=id
			player.etercreq=id
			updateEternityChallenges()
			if (!quick) {
				showTab("challenges")
				showChallengesTab("eternitychallenges")
			}
			delete tmp.qu.autoECN
		} else player.masterystudies.push(type+id)
		if (type=="t") {
			if (id==302) maybeShowFillAll()
			if (quick) {
				masteryStudies.costMult*=masteryStudies.costMults[id]
				masteryStudies.latestBoughtRow=Math.max(masteryStudies.latestBoughtRow,Math.floor(id/10))
			} else {
				if (id==302) fillAll()
				updateMasteryStudyCosts()
				updateMasteryStudyButtons()
				drawMasteryTree()
			}
			if (id==241&&!GUBought("gb3")) {
				var otherMults=1
				if (player.achievements.includes("r85")) otherMults*=4
				if (player.achievements.includes("r93")) otherMults*=4
				var old=getIPMultPower()
				ipMultPower=2.2
				player.infMult=player.infMult.div(otherMults).pow(Math.log10(getIPMultPower())/Math.log10(old)).times(otherMults)
			}
			if (id==266&&player.replicanti.gal>399) {
				var gal=player.replicanti.gal
				player.replicanti.gal=0
				player.replicanti.galCost=getRGCost(gal)
				player.replicanti.gal=gal
			}
			if (id==383) updateColorCharge()
		}
		if (type=="d") {
			if (id==7) {
				showTab("quantumtab")
				showQuantumTab("electrons")
				updateElectrons()
			}
			if (id==8||id==9||id==14) {
				showTab("challenges")
				showChallengesTab("quantumchallenges")
				updateQuantumChallenges()
				if (id==9) updateGluons()
			}
			if (id==10) {
				showTab("quantumtab")
				showQuantumTab("replicants")
				document.getElementById("timestudy322").style.display=""
				updateReplicants()
			}
			if (id==11) {
				showTab("dimensions")
				showDimTab("emperordimensions")
				document.getElementById("timestudy361").style.display=""
				document.getElementById("timestudy362").style.display=""
				document.getElementById("edtabbtn").style.display=""
				updateReplicants()
			}
			if (id==12) {
				showTab("quantumtab")
				showQuantumTab("nanofield")
				document.getElementById("nanofieldtabbtn").style.display = ""
			}
			if (id==13) {
				showTab("quantumtab")
				showQuantumTab("tod")
				updateColorCharge()
				updateTODStuff()
			}
			updateUnlockedMasteryStudies()
			updateMasteryStudyCosts()
			updateMasteryStudyButtons()
			drawMasteryTree()
		}
	}
}

function canBuyMasteryStudy(type, id) {
	if (type=='t') {
		if (inQCModifier("sm")&&masteryStudies.bought>=20) return false
		if (player.timestudy.theorem<masteryStudies.costs.time[id]||player.masterystudies.includes('t'+id)||player.eternityChallUnlocked>12||!masteryStudies.allTimeStudies.includes(id)) return false
		var row=Math.floor(id/10)
		if (masteryStudies.latestBoughtRow>row) return false
		var col=id%10
		if (row>42) return player.masterystudies.includes('d13')&&(player.masterystudies.includes('t412')||player.masterystudies.includes('t421'))
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
		if (player.timestudy.theorem<masteryStudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
		if (id>13) return player.masterystudies.includes("t431")&&player.achievements.includes("ng3p34")
		if (id>12) return (player.masterystudies.includes('t412')||player.masterystudies.includes('t421'))&&(ghostified||tmp.qu.nanofield.rewards>15)
		if (id>11) return player.masterystudies.includes("t392")&&(ghostified||tmp.eds[8].workers.gt(9.9))
		if (id>10) return player.masterystudies.includes("t351")&&(ghostified||tmp.eds[1].workers.gt(9.9))
		if (id>9) return player.masterystudies.includes("t302")&&(ghostified||tmp.qu.pairedChallenges.completed>3)
		if (id>8) return player.masterystudies.includes("d8")&&(ghostified||QCIntensity(8))
		if (id>7) return player.masterystudies.includes("t272")&&(ghostified||tmp.qu.electrons.amount>16750)
		if (id>6) return player.masterystudies.includes("t252")
	} else {
		if (player.timestudy.theorem<masteryStudies.costs.ec[id]||player.eternityChallUnlocked) return false
		if (id==13&&!(player.masterystudies.includes('t261')||player.masterystudies.includes('t262')||player.masterystudies.includes('t263'))) return false
		if (id==14&&!(player.masterystudies.includes('t264')||player.masterystudies.includes('t265')||player.masterystudies.includes('t266'))) return false
		if (player.etercreq==id) return true
		if (id==13) return player.resets>=masteryStudies.ecReqsStored[13]
		return Math.round(player.replicanti.chance*100)>=masteryStudies.ecReqsStored[14]
	}
	return true
}
	
function updateMasteryStudyButtons() {
	if (!tmp.ngp3) return
	for (id=0;id<masteryStudies.allTimeStudies.length;id++) {
		var name=masteryStudies.allTimeStudies[id]
		var div=document.getElementById("timestudy"+name)
		var mult=getMTSMult(name, "ms")
		if (!masteryStudies.unlocked.includes(name)) break
		if (player.masterystudies.includes("t"+name)) div.className="timestudybought"
		else if (canBuyMasteryStudy('t', name)) div.className="timestudy"
		else div.className="timestudylocked"
		if (mult!==undefined) document.getElementById("ts"+name+"Current").textContent="Currently: "+(masteryStudies.allStudyEffects[name]?masteryStudies.allStudyEffects[name](mult):shorten(mult)+"x")
	}
	for (id=13;id<=masteryStudies.ecsUpTo;id++) {
		var div=document.getElementById("ec"+id+"unl")
		if (player.eternityChallUnlocked==id) div.className="eternitychallengestudybought"
		else if (canBuyMasteryStudy('ec', id)) div.className="eternitychallengestudy"
		else div.className="timestudylocked"
	}
	for (id=7;id<=masteryStudies.unlocksUpTo;id++) {
		var div=document.getElementById("dilstudy"+id)
		if (player.masterystudies.includes("d"+id)) div.className="dilationupgbought"
		else if (canBuyMasteryStudy('d', id)) div.className="dilationupg"
		else div.className="timestudylocked"
	}
}

function updateMasteryStudyTextDisplay() {
	if (!player.masterystudies) return
	document.getElementById("costmult").textContent=shorten(masteryStudies.costMult)
	document.getElementById("totalmsbought").textContent=masteryStudies.bought
	document.getElementById("totalttspent").textContent=shortenDimensions(masteryStudies.ttSpent)
	for (id=0;id<(quantumed?masteryStudies.allTimeStudies.length:10);id++) {
		var name=masteryStudies.allTimeStudies[id]
		document.getElementById("ts"+name+"Cost").textContent="Cost: "+shorten(masteryStudies.costs.time[name])+" Time Theorems"
	}
	for (id=13;id<15;id++) {
		document.getElementById("ec"+id+"Cost").textContent="Cost: "+shorten(masteryStudies.costs.ec[id])+" Time Theorems"
		document.getElementById("ec"+id+"Req").style.display=player.etercreq==id?"none":"block"
	}
	document.getElementById("ec13Req").textContent="Requirement: "+getFullExpansion(masteryStudies.ecReqsStored[13])+" dimension boosts"
	document.getElementById("ec14Req").textContent="Requirement: "+getFullExpansion(masteryStudies.ecReqsStored[14])+"% replicate chance"
	if (quantumed) {
		for (id=7;id<11;id++) document.getElementById("ds"+id+"Cost").textContent="Cost: "+shorten(masteryStudies.costs.dil[id])+" Time Theorems"
		document.getElementById("ds8Req").innerHTML=ghostified?"":"<br>Requirement: "+getFullExpansion(16750)+" electrons"
		document.getElementById("ds9Req").innerHTML=ghostified?"":"<br>Requirement: Complete Quantum Challenge 8"
		document.getElementById("ds10Req").innerHTML=ghostified?"":"<br>Requirement: Complete Paired Challenge 4"
		document.getElementById("321effect").textContent=shortenCosts(new Decimal("1e430"))
	}
	if (player.masterystudies.includes("d10")||ghostified) {
		for (id=341;id<345;id++) document.getElementById("ts"+id+"Cost").textContent="Cost: "+shorten(masteryStudies.costs.time[id])+" Time Theorems"
		document.getElementById("ds11Cost").textContent="Cost: "+shorten(3e90)+" Time Theorems"
		document.getElementById("ds11Req").innerHTML=ghostified?"":"<br>Requirement: 10 worker replicants"
	}
	if (player.masterystudies.includes("d11")||ghostified) {
		document.getElementById("ds12Cost").textContent="Cost: "+shorten(3e92)+" Time Theorems"
		document.getElementById("ds12Req").innerHTML=ghostified?"":"<br>Requirement: 10 8th Emperor Dimensions"
	}
	if (player.masterystudies.includes("d12")||ghostified) {
		document.getElementById("ds13Cost").textContent="Cost: "+shorten(1e95)+" Time Theorems"
		document.getElementById("ds13Req").innerHTML=ghostified?"":"<br>Requirement: 16 Nanofield rewards"
		document.getElementById("ds14Cost").textContent="Cost: "+shorten(1e98)+" Time Theorems"
		document.getElementById("ds14Req").innerHTML=ghostified?"":"<br>Requirement: 'The Challenging Day' achievement"
	}
}

var occupied
function drawMasteryBranch(id1, id2) {
	var type1=id1.split("ec")[1]?"c":id1.split("dil")[1]?"d":id1.split("time")[1]?"t":undefined
	var type2=id2.split("ec")[1]?"c":id2.split("dil")[1]?"d":id2.split("time")[1]?"t":undefined
	var start=document.getElementById(id1).getBoundingClientRect();
	var end=document.getElementById(id2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	var drawBoughtLine=true
	if (type1=="t"||type1=="d") drawBoughtLine=player.masterystudies.includes(type1+id1.split("study")[1])
	if (type2=="t"||type2=="d") drawBoughtLine=drawBoughtLine&&player.masterystudies.includes(type2+id2.split("study")[1])
	if (type2=="c") drawBoughtLine=drawBoughtLine&&player.eternityChallUnlocked==id2.slice(2,4)
	if (drawBoughtLine) {
		if (type2=="d" && player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle=parseInt(id2.split("study")[1])<8?"#D2E500":parseInt(id2.split("study")[1])>9?"#333333":"#009900";
		} else if (type2=="c") {
			msctx.strokeStyle="#490066";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else if (type2=="d" && player.options.theme == "Aarex's Modifications") {
		msctx.strokeStyle=parseInt(id2.split("study")[1])<8?"#697200":parseInt(id2.split("study")[1])>11?"#727272":parseInt(id2.split("study")[1])>9?"#262626":"#006600";
	} else msctx.strokeStyle="#444";
	msctx.moveTo(x1, y1);
	msctx.lineTo(x2, y2);
	msctx.stroke();
	if (!occupied.includes(id2) && type2 == "t") {
		occupied.push(id2)
		if (shiftDown) {
			var start = document.getElementById(id2).getBoundingClientRect();
			var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
			var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
			var mult = masteryStudies.costMults[id2.split("study")[1]]
			var msg = id2.split("study")[1] + " (" + (mult>1e3?shorten(mult):mult) + "x)"
			msctx.fillStyle = 'white';
			msctx.strokeStyle = 'black';
			msctx.lineWidth = 3;
			msctx.font = "15px Typewriter";
			msctx.strokeText(msg, x1 - start.width / 2, y1 - start.height / 2 - 1);
			msctx.fillText(msg, x1 - start.width / 2, y1 - start.height / 2 - 1);
		}
	}
}

function drawMasteryTree() {
	msctx.clearRect(0, 0, msc.width, msc.height);
	if (player === undefined) return
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("masterystudies").style.display === "none" || player.masterystudies === undefined) return
	occupied=[]
	drawMasteryBranch("back", "timestudy241")
	for (var x=0;x<masteryStudies.allStudies.length;x++) {
		var id=masteryStudies.allStudies[x]
		var paths=masteryStudies.allConnections[id]
		if (!masteryStudies.unlocked.includes(id)) return
		if (paths) for (var y=0;y<paths.length;y++) if (masteryStudies.unlocked.includes(paths[y])) drawMasteryBranch(convertMasteryStudyIdToDisplay(id), convertMasteryStudyIdToDisplay(paths[y]))
	}
}

function getMTSMult(id, uses = "") {
	if (id==251) return Math.floor(player.resets/3e3)
	if (id==252) return Math.floor(player.dilation.freeGalaxies/7)
	if (id==253) return Math.floor(extraReplGalaxies/9)*20
	if (id==262) return Math.max(player.resets/15e3-19,1)
	if (id==263) return player.meta.resets+1
	if (id==264) return Math.pow(player.galaxies+1,0.25)*2
	if (id==273) {
		var intensity = 0
		if (player.masterystudies !== undefined && (player.masterystudies.includes("t273") || uses.includes("ms"))) intensity = 5
		if (ghostified && player.ghostify.neutrinos.boosts > 1 && !uses.includes("pn")) intensity += tmp.nb[1]
		if (uses.includes("intensity")) return intensity
		return Decimal.max(Math.log10(player.replicanti.chance + 1), 1).pow(intensity)
	}
	if (id==281) return Decimal.pow(10,Math.pow(tmp.rm.max(1).log10(),0.25)/10)
	if (id==282) return Decimal.pow(10,Math.pow(tmp.rm.max(1).log10(),0.25)/15)
	if (id==301) return Math.floor(extraReplGalaxies/4.15)
	if (id==303) return Decimal.pow(4.7,Math.pow(Math.log10(Math.max(player.galaxies,1)),1.5))
	if (id==322) {
		let log = Math.sqrt(Math.max(3-getTickspeed().log10(),0))/2e4
		if (log>110) log=Math.sqrt(log*27.5)+55
		if (log>1e3&&player.aarexModifications.ngudpV!==undefined) log=Math.pow(7+Math.log10(log),3)
		return Decimal.pow(10,log)
	}
	if (id==332) return Math.max(player.galaxies, 1)
	if (id==341) return Decimal.pow(2,Math.sqrt(tmp.qu.replicants.quarks.add(1).log10()))
	if (id==344) return Math.pow(tmp.qu.replicants.quarks.div(1e7).add(1).log10(),0.25)*0.17+1
	if (id==351) {
		let log=player.timeShards.max(1).log10()*14e-7
		if (log>1e4) log=Math.pow(log*Math.pow(10,36),.1)
		return Decimal.pow(10,log)
	}
	if (id==361) return player.dilation.tachyonParticles.max(1).pow(0.01824033924212366)
	if (id==371) return Math.pow(extraReplGalaxies+1,0.3)
	if (id==372) return Math.sqrt(player.timeShards.add(1).log10())/20+1
	if (id==373) return Math.pow(player.galaxies+1,0.55)
	if (id==381) return Decimal.min(getTickSpeedMultiplier(), 1).log10() / -135 + 1
	if (id==382) return player.eightAmount.max(1).pow(Math.PI)
	if (id==383) return Decimal.pow(3200,Math.pow(tmp.qu.colorPowers.b.add(1).log10(),0.25))
	if (id==391) return player.meta.antimatter.max(1).pow(8e-4)
	if (id==392) return Decimal.pow(1.6,Math.sqrt(tmp.qu.replicants.quarks.add(1).log10()))
	if (id==393) return Decimal.pow(4e5,Math.sqrt(tmp.twr.add(1).log10()))
	if (id==401) {
		let log=tmp.qu.replicants.quarks.div(1e28).add(1).log10()*0.2
		if (log>5) log=Math.log10(log*2)*5
		return Decimal.pow(10,log)
	}
	if (id==411) return tmp.tra.div(1e24).add(1).pow(0.2)
	if (id==421) {
		let ret=Math.pow(Math.max(-getTickspeed().log10()/1e13-0.75,1),4)
		if (ret>100) ret=Math.sqrt(ret*100)
		return ret
	}
	if (id==431) {
		let x=player.dilation.freeGalaxies+tmp.eg431
		return Decimal.pow(Math.max(x/1e4,1),Math.max(x/1e4+Math.log10(x)/2,1))
	}
}


var upDown={
	point: 0,
	times: 0
}

function recordUpDown(x) {
	if (upDown.point>0&&upDown.point==x) return
	upDown.point=x
	upDown.times++
	if (upDown.times>=200) giveAchievement("Up and Down and Up and Down...")
}
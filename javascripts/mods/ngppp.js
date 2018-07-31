masterystudies={initialCosts:{time:{},
		dil:{}},
	costs:{time:{},
		dil:{}},
	costmults:{time:{},
		dil:{}},
	costmult:1,
	allTimeStudies:[]}

function updateMasteryStudyButtons() {
	document.getElementById("costmult").textContent=shorten(masterystudies.costmult)
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
		if (player.masterystudies[id].split("d")[1]) {
			masterystudies.costmult*=masterystudies.costmults.dil[player.masterystudies[id].split("d")[1]]
		} else {
			masterystudies.costmult*=masterystudies.costmults.time[player.masterystudies[id].split("t")[1]]
		}
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
	}
}

function canBuyMasteryStudy(isTime, id) {
	if (isTime) {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)) return false
	} else {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
	}
	return true
}

var msc = document.getElementById("studyTreeCanvas2");
var msctx = msc.getContext("2d");
function drawMasteryBranch(num1, num2) {
	if (document.getElementById("masterystudies").style.display === "none" || player.masterystudies === undefined) return
	var isDil=num2.split("dilstudy")[1]!==undefined
	var start=document.getElementById(num1).getBoundingClientRect();
	var end=document.getElementById(num2).getBoundingClientRect();
	var x1=start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1=start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2=end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2=end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth=15;
	msctx.beginPath();
	if (player.masterystudies.includes(isDil?"d"+num2.split("dilstudy")[1]:"t"+num2.split("timestudy")[1])) {
		if (isDil&& player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle="#00E5E5";
		} else {
			msctx.strokeStyle="#000000";
		}
	} else {
		if (isDil&& player.options.theme == "Aarex's Modifications") {
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
	drawMasteryBranch("back", "dilstudy7")
}

function toggleAutoEter(id) {
	player.autoEterOptions[id]!=player.autoEterOptions[id]
	document.getElementById(id+'auto').textContent="Auto: O"+(player.autoEterOptions[id]?"N":"FF")
}
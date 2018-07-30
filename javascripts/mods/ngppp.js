masterystudies={initialCosts:{time:{},
		dil:{7:1e40,8:1e40,9:1e42,10:1e42,11:1e43,12:1e44,13:1e44,14:1e45,15:1e45}},
	costs:{time:{},
		dil:{}},
	costmults:{time:{},
		dil:{7:Math.sqrt(10),8:Math.sqrt(10),9:Math.pow(10,1/3),10:Math.pow(10,1/3),11:Math.pow(10,1/3),12:Math.sqrt(10),13:Math.sqrt(10),14:Math.pow(10,1/3),15:Math.pow(10,1/3)}},
	costmult:1,
	allTimeStudies:[]}

function updateMasteryStudyButtons() {
	document.getElementById("costmult").textContent=shorten(masterystudies.costmult)
	for (id=7;id<16;id++) {
		var element=document.getElementById("dilstudy"+id)
		var cost=masterystudies.costs.dil[id]
		if (player.masterystudies.includes("d"+id)) element.className="dilationupgbought"
		else if (canBuyMasteryStudy(false, id)) element.className="dilationupg"
		else element.className="timestudylocked"
		document.getElementById("dilstudy"+id+"Cost").textContent=shorten(cost)
	}
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
	for (id=7;id<16;id++) masterystudies.costs.dil[id]=masterystudies.initialCosts.dil[id]*masterystudies.costmult
}

function buyMasteryStudy(isTime, id) {
	if (canBuyMasteryStudy(isTime, id, true)) {
		player.timestudy.theorem-=masterystudies.costs[isTime?"time":"dil"][id]
		player.masterystudies.push((isTime?"t":"d")+id)
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		
        var name=id==11?'epmult':'td'+(id<8?1:id<9?6:id<10?8:id<11?3:id<13?2:id<14?7:id<15?5:4)
		player.autoEterOptions[name]=false
		document.getElementById(name+'auto').style.visibility="visible"
		console.log(player.autoEterOptions)
	}
}

function canBuyMasteryStudy(isTime, id) {
	if (isTime) {
		if (player.timestudy.theorem<masterystudies.costs.time[id]||player.masterystudies.includes('t'+id)) return false
	} else {
		if (player.timestudy.theorem<masterystudies.costs.dil[id]||player.masterystudies.includes('d'+id)) return false
		if (id>11&&id<14) return player.masterystudies.includes('d11')
		if (id==11) return player.masterystudies.includes('d9')||player.masterystudies.includes('d10')
		if (id>8) return player.masterystudies.includes('d'+(id-2))
	}
	return true
}

function toggleAutoEter(id) {
	player.autoEterOptions[id]!=player.autoEterOptions[id]
	document.getElementById(id+'auto').textContent="Auto: O"+(player.autoEterOptions[id]?"N":"FF")
}
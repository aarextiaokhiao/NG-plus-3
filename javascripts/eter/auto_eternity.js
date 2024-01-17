function updateAutoEterMode() {
	var modeText = ""
	var modeCond = ""
	el("priority13").disabled = false
	if (player.autoEterMode == "time") {
		modeText = "time"
		modeCond = "Seconds between eternities:"
	} else if (player.autoEterMode == "relative") {
		modeText = "X times last eternity"
		modeCond = modeText + ":"
	} else if (player.autoEterMode == "relativebest") {
		modeText = "X times best of last 10"
		modeCond = modeText + " eternities:"
	} else if (player.autoEterMode == "replicanti") {
		modeText = "replicanti"
		modeCond = "Amount of replicanti to wait until reset:"
	} else if (player.autoEterMode == "peak") {
		modeText = "peak"
		modeCond = "Seconds to wait after latest peak gain:"
	} else if (player.autoEterMode == "eternitied") {
		modeText = "X times eternitied"
		modeCond = modeText + ":"
	} else if (player.autoEterMode == "manual") {
		modeText = "dilate only"
		modeCond = "Does nothing to eternity"
		el("priority13").disabled = true
	} else {
		modeText = "amount"
		modeCond = "Amount of EP to wait until reset:"
	}
	el("toggleautoetermode").textContent = "Auto eternity mode: " + modeText
	el("eterlimittext").textContent = modeCond
}

function toggleAutoEterMode() {
	if (player.autoEterMode == "amount") player.autoEterMode = "time"
	else if (player.autoEterMode == "time") player.autoEterMode = "relative"
	else if (player.autoEterMode == "relative") player.autoEterMode = "relativebest"
	else if (player.autoEterMode == "relativebest" && player.dilation.upgrades.includes("ngpp3") && getEternitied() >= 4e11 && aarMod.newGame3PlusVersion) player.autoEterMode = "replicanti"
	else if (player.autoEterMode == "replicanti" && getEternitied() >= 1e13) player.autoEterMode = "peak"
	else if (player.autoEterMode == "peak" && hasAch("ng3p51")) player.autoEterMode = "eternitied"
	else if ((player.autoEterMode == "peak" || player.autoEterMode == "eternitied") && speedrunMilestones > 24) player.autoEterMode = "manual"
	else if (player.autoEterMode) player.autoEterMode = "amount"
	updateAutoEterMode()
}

function toggleAutoEter(id) {
	player.autoEterOptions[id] = !player.autoEterOptions[id]
	el(id + 'Auto').textContent = "Auto" + (id == "rebuyupg" && mod.udsp ? " (repeatable): " : ": ") + (player.autoEterOptions[id] ? "ON" : "OFF")
	if (id.slice(0,2) == "td") {
		var removeMaxAll = false
		for (var d = 1; d < 9; d++) {
			if (player.autoEterOptions["td" + d]) {
				if (d > 7) removeMaxAll = true
			} else break
		}
		el("maxTimeDimensions").style.display = removeMaxAll ? "none" : ""
	}
}

function doAutoEterTick() {
	if (!mod.ngpp) return
	if (hasAch("ngpp17")) {
		if (!bigRipped() || tmp.qu.be) for (var d = 1; d < 9; d++) if (player.autoEterOptions["td" + d]) buyMaxTimeDimension(d)
		if (player.autoEterOptions.epmult) buyMaxEPMult()
		if (player.autoEterOptions.blackhole) {
			buyMaxBlackholeDimensions()
			feedBlackholeMax()
		}
	}
	if (player.autoEterOptions.tt && !player.dilation.upgrades.includes(10) && speedrunMilestones > 1) maxTheorems()
}
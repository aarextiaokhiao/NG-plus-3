//Saving
el("save").onclick = function () {
	saved++
	if (saved > 99) giveAchievement("Just in case")
	save_game();
};

var noSave=false
function save_game(silent) {
	if (!game_loaded || noSave || infiniteDetected) return
	set_save(meta.save.current, player);
	$.notify("Game saved", "info")
}

function runAutoSave(){
	if (!player) return
	if (!aarMod) return
	if (aarMod.autoSave) {
		autoSaveSeconds++
		if (autoSaveSeconds >= getAutoSaveInterval()) {
			save_game()
			autoSaveSeconds=0
		}
	}
}

//Loading
var savePlacement
function load_game(noOffline, init) {
	if (!meta.save.saveOrder.includes(meta.save.current)) meta.save.current = meta.save.saveOrder[0]
	var dimensionSave = get_save(meta.save.current)
	infiniteDetected = false
	if (dimensionSave!=null) {
		if (dimensionSave.quantum !== undefined) if (dimensionSave.quantum.timeFluxPower !== undefined) dimensionSave = get_save(meta.save.current + "_af2019")
		player = dimensionSave
		if (detectInfinite()) infiniteCheck=true
	}
	savePlacement=1
	while (meta.save.saveOrder[savePlacement - 1] != meta.save.current) savePlacement++
	if (infiniteCheck) exportInfiniteSave()
	if (infiniteCheck || infiniteCheck2 || dimensionSave?.aarMod?.ngp3Build) {
		updateNewPlayer("reset")
		infiniteCheck2 = false
	}
	onLoad(noOffline)
	startInterval()
}

var loadedSaves=0
var onLoading=false
var latestRow
var loadSavesIntervalId
var occupied=false
function load_saves() {
	closeToolTip()
	el("loadmenu").style.display = "block"
	changeSaveDesc(meta.save.current, savePlacement)
	clearInterval(loadSavesIntervalId)
	occupied = false
	loadSavesIntervalId = setInterval(function(){
		if (occupied) return
		else occupied = true
		if (loadedSaves == meta.save.saveOrder.length) {
			clearInterval(loadSavesIntervalId)
			return
		} else if (!onLoading) {
			latestRow = el("saves").insertRow(loadedSaves)
			onLoading = true
		}
		try {
			var id = meta.save.saveOrder[loadedSaves]
			latestRow.innerHTML = getSaveLayout(id)
			changeSaveDesc(id, loadedSaves+1)
			loadedSaves++
			onLoading = false
		} catch (_) {}
		occupied=false
	}, 0)
}

function getSaveLayout(id) {
	return `<b id='save_${id}_title'>Save #${loadedSaves+1}</b>
	<div id='save_${id}_desc'></div>
	<button class='storebtn' onclick='overwrite_save(${id})'>Save</button>
	<button class='storebtn' onclick='change_save(${id})'>Load</button>
	<button class='storebtn' onclick='rename_save(${id})'>Rename</button>
	<button class='storebtn' onclick='export_save(${id})'>Export</button>
	<button class='storebtn' onclick='import_save(${id})'>Overwrite</button>
	<span class='metaOpts'>
		<button class='storebtn' onclick='move(${id}, -1)'>⭡</button>
		<button class='storebtn' onclick='move(${id}, 1)'>⭣</button>
		<button class='storebtn' onclick='delete_save(${id})'>X</button>
	</span>`
}

function changeSaveDesc(saveId, placement) {
	var element = el("save_" + saveId + "_desc")

	if (element == undefined) return

	try {
		var isSaveCurrent = meta.save.current == saveId
		var temp = isSaveCurrent ? player : get_save(saveId)
		if (temp.aarexModifications == null) temp.aarexModifications = {}
		var msg = modAbbs(checkMods(temp)) + "<br>"

		var isSaveGhostified = temp?.ghostify?.times > 0
		var isSaveQuantumed = temp?.quantum?.times > 0
		if (isSaveGhostified) {
			if (temp.achievements.includes("ng3p101")) {
				var data=temp.ghostify
				msg+="Higgs: "+shortenDimensions(E(data.hb.higgs))+", Gravitons: "+shorten(E(data.gravitons.amount))
			} else if (temp.achievements.includes("ng3p91")) {
				var data=temp.ghostify.hb
				msg+="Bosons: "+shorten(E(temp.ghostify.bl.am))+", Higgs: "+shortenDimensions(E(data.higgs))
			} else if (temp.achievements.includes("ng3p81")) {
				var data=temp.ghostify.wzb
				msg+="Bosons: "+shorten(E(temp.ghostify.bl.am))+", W+ Bosons: "+shortenDimensions(E(data.wpb))+", W- Bosons: "+shortenDimensions(E(data.wnb))+", Z Bosons: "+shortenDimensions(E(data.zb))
			} else if (temp.achievements.includes("ng3p71")) {
				//var data=temp.ghostify.photons
				msg+="Elementary Particles: "+shortenDimensions(E(temp.ghostify.ghostParticles))+", Enlightenments: "+getFullExpansion(temp.ghostify.photons.lighten)
			} else msg+="Elementary Particles: "+shortenDimensions(E(temp.ghostify.ghostParticles))+", Neutrinos: "+shortenDimensions(Decimal.add(temp.ghostify.neutrinos.electron, temp.ghostify.neutrinos.mu).add(temp.ghostify.neutrinos.tau).round())
		} else if (isSaveQuantumed) {
			if (!temp.masterystudies) msg+="Endgame of NG++"
			else if (temp.masterystudies.includes('d14')) msg+="Total antimatter in Big Rips: "+shortenDimensions(E(temp.quantum.bigRip.totalAntimatter))+", Space Shards: "+shortenDimensions(E(temp.quantum.bigRip.spaceShards))+(temp.achievements.includes("ng3p55")?", Eternal Matter: "+shortenDimensions(E(temp.quantum.breakEternity.eternalMatter)):"")
			else {
				msg+="Quarks: "+shortenDimensions(Decimal.add(temp.quantum.quarks,temp.quantum.usedQuarks.r).add(temp.quantum.usedQuarks.g).add(temp.quantum.usedQuarks.b))
				if (temp.masterystudies.includes('d13')) msg+=", Preonic Spins: "+shortenDimensions(E(temp.quantum.tod.r.spin))
				else if (temp.masterystudies.includes('d12')) msg+=", Nanocharge: "+shortenDimensions(E(temp.quantum.nanofield.charge))+", Nanorewards: "+getFullExpansion(temp.quantum.nanofield.rewards)
				else if (temp.masterystudies.includes('d10')) msg+=", Duplicants: "+shortenDimensions(getTotalDuplicants(temp))+", Worker duplicants: "+shortenDimensions(getTotalWorkers(temp))
				else if (temp.masterystudies.includes('d9')) msg+=", Paired challenges: "+temp.quantum.pairedChallenges.completed
				else if (temp.masterystudies.includes('d8')) {
					var completions=0
					if (typeof(temp.quantum.challenges)=="number") completions=temp.quantum.challenges
					else for (c=1;c<9;c++) if (temp.quantum.challenges[c]) completions++
					msg+=", Challenge completions: "+completions
				} else {
					if (temp.quantum.gluons.rg) msg+=", Gluons: "+shortenDimensions(Decimal.add(temp.quantum.gluons.rg,temp.quantum.gluons.gb).add(temp.quantum.gluons.br))
					if (temp.masterystudies.includes('d7')) msg+=", Electrons: "+shortenDimensions(temp.quantum.electrons.amount)
					msg+=", Best quantum: "+timeDisplayShort(temp.quantum.best)
				}
			}
		} else if (temp.exdilation==undefined?false:temp.blackhole.unl) {
			var tempstart="Eternity points: "+shortenDimensions(E(temp.eternityPoints))
			var tempend=", Black hole power: "+shortenMoney(E(temp.blackhole.power))
			if (temp.exdilation.times > 0) msg+=tempstart+tempend+", Ex-dilation: "+shortenDimensions(E(temp.exdilation.unspent))
			else msg+=tempstart+", Dilated time: "+shortenMoney(E(temp.dilation.dilatedTime))+", Banked infinities: "+getFullExpansion(temp.infinitiedBank)+", Replicanti: "+shortenMoney(E(temp.replicanti.amount))+tempend
		} else if (temp.dilation?temp.dilation.studies.includes(1):false) {
			var temp2="Tachyon particles: "+shortenMoney(E(temp.dilation.totalTachyonParticles))+", Dilated time: "+shortenMoney(E(temp.dilation.dilatedTime))
			if (temp.dilation.studies.includes(6)) temp2+=", Best meta-antimatter: "+shortenMoney(E(temp.meta.bestAntimatter))+", Meta-dimension shifts/boosts: "+temp.meta.resets
			else if (!temp.dilation.studies.includes(5)) temp2="Time Theorems: "+shortenMoney(getTotalTT(temp))+", "+temp2
			else if (!temp.dilation.upgrades.includes(10)) temp2="Eternity points: "+shortenDimensions(temp.eternityPoints)+", "+temp2
			msg+=temp2
		} else {
			var totalChallengeCompletions=(temp.aarexModifications.newGameMinusVersion?-6:0)
			for (ec=1;ec<13;ec++) totalChallengeCompletions+=(temp.eternityChalls['eterc'+ec]?temp.eternityChalls['eterc'+ec]:0)
			if (totalChallengeCompletions>0) {
				msg+="Time Theorems: "+getFullExpansion(getTotalTT(temp))+", Challenge completions: "+totalChallengeCompletions
			} else if (temp.eternities>(temp.aarexModifications.newGameMinusVersion?-20:0)) msg+="Eternity points: "+shortenDimensions(E(temp.eternityPoints))+", Eternities: "+temp.eternities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+", Time Theorems: "+getTotalTT(temp)
			else if (temp.achievements.includes("r51")) {
				msg+="Antimatter: "+shortenMoney(E(temp.money))+", Infinity points: "+shortenDimensions(E(temp.infinityPoints))
				if (temp.postChallUnlocked>0&&!temp.replicanti.unlocked) {
					var totalChallengeCompletions=0
					for (ic=1;ic<13;ic++) totalChallengeCompletions+=temp.challenges.includes("postc"+ic)?1:0
					msg+=", Challenge completions: "+totalChallengeCompletions
				}
			} else if (temp.infinitied>(temp.aarexModifications.newGameMinusVersion?990:temp.aarexModifications.newGamePlusVersion?1:0)) msg+="Infinity points: "+shortenDimensions(E(temp.infinityPoints))+", Infinities: "+temp.infinitied.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+", Challenge completions: "+temp.challenges.length
			else if (temp?.galacticSacrifice?.times) msg+="Antimatter: "+shortenMoney(E(temp.money))+", Galaxy points: "+shortenDimensions(E(temp.galacticSacrifice.galaxyPoints))
			else msg+="Antimatter: "+shortenMoney(E(temp.money))+", Dimension Shifts/Boosts: "+temp.resets+((temp.tickspeedBoosts != undefined ? (temp.resets > 0 || temp.tickspeedBoosts > 0 || temp.galaxies > 0 || temp.infinitied > 0 || temp.eternities != 0 || isSaveQuantumed) : false)?", Tickspeed boosts: "+getFullExpansion(temp.tickspeedBoosts):"")+", Galaxies: "+temp.galaxies
		}

		el("save_"+saveId+"_title").textContent = (temp?.aarexModifications?.save_name || "Save #"+placement) + (isSaveCurrent ? " (selected)" : "")
	} catch (_) {
		var msg = "New game"
	}
	element.innerHTML = msg
}

function reload() {
	clearInterval(gameLoopIntervalId)
	closeToolTip()
	load_game(true)
}

function verify_save(obj) {
	if (typeof obj != 'object') return false;
	return true;
}

function change_save(id) {
	if (!game_loaded) {
		meta.save.current=id
		saveMeta()
		document.location.reload(true)
		return
	}
	save_game(true)
	clearInterval(gameLoopIntervalId)
	var oldId=meta.save.current
	meta.save.current=id
	changeSaveDesc(oldId, savePlacement)
	updateNewPlayer()
	infiniteCheck2 = false
	closeToolTip()
	load_game(shiftDown)
	savePlacement=1
	while (meta.save.saveOrder[savePlacement-1]!=id) savePlacement++
	changeSaveDesc(meta.save.current, savePlacement)

	$.notify("Save #"+savePlacement+" loaded", "info")
	saveMeta()
}

function export_save(id) {
	var placement=1
	if (!id) id = meta.save.current
	while (meta.save.saveOrder[placement-1] != id) placement++

	let data
	if (id == meta.save.current) data = btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v }))
	else data = localStorage.getItem(btoa(savePrefix + id))

	exportData(data, "Exported save #"+placement+" to clipboard")
}

//Credits to MrRedShark77 from https://github.com/MrRedShark77/incremental-mass-rewritten/blob/main/js/saves.js
function export_file() {
		let file = new Blob([btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v }))], {type: "text/plain"})
		window.URL = window.URL || window.webkitURL;
		let a = document.createElement("a")
		a.href = window.URL.createObjectURL(file)
		a.download = "NG+3 v2.31 Beta - "+new Date().toGMTString()+".txt"
		a.click()
}

function exportData(encoded, success) {
	let output = el('output');
	let parent = output.parentElement;

	parent.style.display = "";
	output.value = encoded
	output.onblur = function() { parent.style.display = "none";}
	output.focus();
	output.select();
	
	try {
		if (document.execCommand('copy')) {
			$.notify(success || "Exported to clipboard", "info");
			output.blur();
			output.onblur();
		}
	} catch(ex) {
		// well, we tried.
	}
};

var onImport = false
function import_save(type) {
	if (type=="current") type=meta.save.current
	else if (type!="new") {
		var placement=1
		while (meta.save.saveOrder[placement-1]!=type) placement++
	}
	onImport = true
	var save_data = prompt("Input your save. "+(type=="new"?"":"("+(type==meta.save.current?"your current save file":"save #"+placement)+" will be overwritten!)"));
	onImport = false

	if (save_data.split("AntimatterDimensions")[1] && save_data.split("EndOf")[1]) {
		$.notify("Reality isn't supported in this mod!", "error")
		return
	}
	if (save_data.constructor !== String) save_data = "";
	if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "80b7fdc794f5dfc944da6a445a3f21a2d0f7c974d044f2ea25713037e96af9e3") {
		el("body").style.animation = "barrelRoll 5s 1";
		giveAchievement("Do a barrel roll!")
		setTimeout(function(){ el("body").style.animation = ""; }, 5000)
	}
	if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "857876556a230da15fe1bb6f410ca8dbc9274de47c1a847c2281a7103dd2c274") giveAchievement("So do I");
	if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "8aaff3cdcf68f6392b172ee9924a22918451e511c8e60b120f09e2c16d4e26ac") giveAchievement("The Forbidden Layer");
	if (sha512_256(save_data) === "de24687ee7ba1acd8f5dc8f71d41a3d4b7f14432fff53a4d4166e7eea48a88c0") {
		player.options.theme = "S1";
		player.options.secretThemeKey = save_data;
		setTheme(player.options.theme);
	} else if (sha512_256(save_data) === "76269d18c05c9ebec8a990a096cee046dea042a0421f8ab81d17f34dd1cdbdbf") {
		player.options.theme = "S2";
		player.options.secretThemeKey = save_data;
		setTheme(player.options.theme);
	} else if (sha512_256(save_data) === "d764e9a1d1e18081be19f3483b537ae1159ab40d10e096df1d9e857d68d6ba7a") {
		player.options.theme = "S3";
		player.options.secretThemeKey = save_data;
		setTheme(player.options.theme);
	} else if (sha512_256(save_data) === "ae0199482ecfa538a03eb37c67866e67a11f1832516c26c7939e971e514d40c5") {
		player.options.theme = "S4";
		player.options.secretThemeKey = save_data;
		setTheme(player.options.theme);
	} else if (sha512_256(save_data) === "7a668b64cdfe1bcdf7a38d3858429ee21290268de66b9784afba27dc5225ce28") {
		player.options.theme = "S5";
		player.options.secretThemeKey = save_data;
		setTheme(player.options.theme);
	} else if (sha512_256(save_data) === "4f82333af895f5c89e6b2082a7dab5a35b964614e74908961fe915cefca1c6d0") {
		player.options.theme = "S6";
		player.options.secretThemeKey = save_data;
		setTheme(player.options.theme);
	} else {
		var decoded_save_data = JSON.parse(atob(save_data, function(k, v) { return (v === Infinity) ? "Infinity" : v; }));
		if (!verify_save(decoded_save_data)) {
			forceHardReset = true
			reset_game()
			forceHardReset = false
			return
		} else if (!decoded_save_data||!save_data) {
			alert('could not load the save..')
			return
		}
		if (decoded_save_data?.reality || decoded_save_data?.celestials) {
			$.notify("Reality or NG+Reality aren't supported in this mod!", "error")
			return
		}
		if (type==meta.save.current) {
			clearInterval(gameLoopIntervalId)
			infiniteCheck2 = false
			player = decoded_save_data;
			if (detectInfinite()) infiniteDetected=true
			if (!game_loaded) {
				set_save(meta.save.current, player)
				document.location.reload(true)
				return
			}
			onLoad()
			if (infiniteDetected) {
				if (el("welcome").style.display != "flex") el("welcome").style.display = "flex"
				el("welcomeMessage").innerHTML = "Because you imported a save that has an Infinite bug in it, saving is disabled. Most functionality is disabled to prevent further damage. It is highly recommended that you report this occurrence to the #bugs_and_glitches channel on the Discord server, so the bug can be looked into and fixed. It is not recommended to modify the save as it may result in undesirable effects, and will be hard reset after you switch saves or refresh the game."
			}
			startInterval()
		} else if (type === "new") {
			var newSaveId=1
			while (meta.save.saveOrder.includes(newSaveId)) newSaveId++
			meta.save.saveOrder.push(newSaveId)
			localStorage.setItem(btoa(savePrefix+newSaveId),save_data)
			if (!game_loaded) {
				meta.save.current=newSaveId
				saveMeta()
				document.location.reload(true)
				return
			}
			latestRow=el("saves").insertRow(loadedSaves)
			latestRow.innerHTML=getSaveLayout(newSaveId)
			loadedSaves++
			changeSaveDesc(newSaveId, loadedSaves)
			saveMeta()
		} else {
			set_save(type, decoded_save_data)
			if (!game_loaded) {
				meta.save.current=type
				saveMeta()
				document.location.reload(true)
				return
			}
			changeSaveDesc(type, placement)
			$.notify("Save #"+placement+" imported", "info")
		}
	}
}

function move(id,offset) {
	placement=0
	while (meta.save.saveOrder[placement]!=id) placement++
	if (offset<0) {
		if (placement<-offset) return
	} else if (placement>meta.save.saveOrder.length-offset-1) return
	var temp=meta.save.saveOrder[placement]
	if (temp==meta.save.current) savePlacement+=offset
	if (meta.save.saveOrder[placement+offset]==meta.save.current) savePlacement-=offset
	meta.save.saveOrder[placement]=meta.save.saveOrder[placement+offset]
	meta.save.saveOrder[placement+offset]=temp
	el("saves").rows[placement].innerHTML=getSaveLayout(meta.save.saveOrder[placement])
	el("saves").rows[placement+offset].innerHTML=getSaveLayout(id)
	changeSaveDesc(meta.save.saveOrder[placement], placement+1)
	changeSaveDesc(id, placement+offset+1)
	saveMeta()
}

function delete_save(saveId) {
	if (meta.save.saveOrder.length<2) {
		reset_game()
		return
	} else if (!confirm("Do you really want to erase this save? All game data in this save will be deleted!")) return
	var alreadyDeleted=false
	var newSaveOrder=[]
	for (orderId=0;orderId<meta.save.saveOrder.length;orderId++) {
		if (alreadyDeleted) changeSaveDesc(meta.save.saveOrder[orderId], orderId)
		if (meta.save.saveOrder[orderId]==saveId) {
			localStorage.removeItem(btoa(savePrefix+saveId))
			alreadyDeleted=true
			el("saves").deleteRow(orderId)
			if (savePlacement>orderId+1) savePlacement--
			loadedSaves--
		} else newSaveOrder.push(meta.save.saveOrder[orderId])
	}
	meta.save.saveOrder=newSaveOrder
	if (meta.save.current==saveId) {
		change_save(meta.save.saveOrder[0])
		el("loadmenu").style.display="block"
	} else saveMeta()
	$.notify("Save deleted", "info")
}

function rename_save(id) {
	if (meta.save.current != id && id !== undefined) {
		var placement=1
		while (meta.save.saveOrder[placement-1]!=id) placement++
	}
	var save_name = prompt("Input the new name of "+((meta.save.current == id || id === undefined) ? "your current save" : "save #" + placement)+". It's recommended to put the name of the mod as your save name. Leave blank to reset the save's name.")
	if (save_name === null) return
	if (meta.save.current == id || id === undefined) {
		aarMod.save_name = save_name
		el("save_name").textContent = "You are currently playing in " + (aarMod.save_name ? aarMod.save_name : "Save #" + savePlacement)
	} else {
		var temp_save = get_save(id)
		if (!temp_save.aarexModifications) temp_save.aarexModifications={
			dilationConf: false,
			offlineProgress: true,
			autoSave: true,
			progressBar: true,
			logRateChange: false,
			eternityChallRecords: {},
			popUpId: 0,
			tabsSave: {on: false},
			breakInfinity: false
				}
		temp_save.aarexModifications.save_name = save_name
	}
	set_save(id, temp_save)
	placement=1
	while (meta.save.saveOrder[placement-1]!=id) placement++
	changeSaveDesc(id, placement)
	$.notify("Save #"+placement+" renamed", "info")
}

function overwrite_save(id) {
	if (id == meta.save.current) {
		save_game()
		return
	}
	var placement=1
	while (meta.save.saveOrder[placement-1]!=id) placement++
	if (!confirm("Are you really sure you want to overwrite save #"+placement+"? All progress in the current save will be overwritten with the new save!")) return
	set_save(id, player)
	$.notify("Save overwritten", "info")
}

function reset_game() {
	if (!forceHardReset) if (!confirm("Do you really want to erase all your progress in this save?")) return
	clearInterval(gameLoopIntervalId)
	infiniteDetected = false
	updateNewPlayer("reset")
	if (!game_loaded) {
		set_save(meta.save.current, player)
		document.location.reload(true)
		return
	}
	save_game(true)
	onLoad()
	startInterval()
};

//Creation + Mods
function new_save() {
	if (modsShown == "adv") new_game()
	else show_mods('basic')
}

function new_game(type) {
	save_game(true)
	clearInterval(gameLoopIntervalId)
	updateNewPlayer(type ? "quick" : "new", type)
	infiniteCheck2 = false

	var oldId = meta.save.current
	meta.save.current=1
	while (meta.save.saveOrder.includes(meta.save.current)) meta.save.current++
	meta.save.saveOrder.push(meta.save.current)
	saveMeta()

	changeSaveDesc(oldId, savePlacement)
	latestRow = el("saves").insertRow(loadedSaves)
	latestRow.innerHTML = getSaveLayout(meta.save.current)
	loadedSaves++
	changeSaveDesc(meta.save.current, loadedSaves)
	savePlacement = loadedSaves

	onLoad()
	startInterval()
	
	$.notify("Save created", "info")
	saveMeta()

	closeToolTip()
	show_mods()
}

//Saving Options
function toggleAutoSave() {
	aarMod.autoSave = !aarMod.autoSave
	el("autoSave").textContent = "Auto save: " + (aarMod.autoSave ? "ON" : "OFF")
	autoSaveSeconds = 0
}

function changeAutoSaveInterval() {
	aarMod.autoSaveInterval = el("autoSaveIntervalSlider").value
	el("autoSaveInterval").textContent = "Auto-save interval: " + aarMod.autoSaveInterval + "s"
	autoSaveSeconds = 0
}

function getAutoSaveInterval() {
	return aarMod.autoSaveInterval || 30
}

function toggleOfflineProgress() {
	aarMod.offlineProgress = !aarMod.offlineProgress
	el("offlineProgress").textContent = "Offline progress: O"+(aarMod.offlineProgress?"N":"FF")
};

//Player Creation
var player
function updateNewPlayer(mode, preset) {
	if (mode == "quick") mod = modPresets[preset]
	else if (mode == "new") mod = modChosen
	else if (mode == "meta.started") mod = modPresets.ngp3
	else if (mode != "reset") mod = {}

	player = {
		money: E(mod.ngmm>2?200:mod.ngp>1?20:10),
		tickSpeedCost: E(1000),
		tickspeed: E(mod.ngp>1?500:1000),
		firstCost: E(10),
		secondCost: E(100),
		thirdCost: E(10000),
		fourthCost: E(1000000),
		fifthCost: E(1e9),
		sixthCost: E(1e13),
		seventhCost: E(1e18),
		eightCost: E(1e24),
		firstAmount: E(0),
		secondAmount: E(0),
		thirdAmount: E(0),
		fourthAmount: E(0),
		firstBought: mod.ngm ? 5 : 0,
		secondBought: 0,
		thirdBought: 0,
		fourthBought: 0,
		fifthAmount: E(0),
		sixthAmount: E(0),
		seventhAmount: E(0),
		eightAmount: E(0),
		fifthBought: 0,
		sixthBought: 0,
		seventhBought: 0,
		eightBought: 0,
		sacrificed: E(0),
		achievements: [],
		infinityUpgrades: [],
		challenges: [],
		currentChallenge: "",
		infinityPoints: E(0),
		infinitied: mod.ngm ? 990 : mod.ngp ? 1 : 0,
		infinitiedBank: mod.ngm ? -1000 : 0,
		totalTimePlayed: 0,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: 0,
		galaxies: mod.ngm ? -1 : 0,
		totalmoney: E(0),
		achPow: 1,
		newsArray: [],
		interval: null,
		lastUpdate: new Date().getTime(),
		autobuyers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		costMultipliers: [E(1e3), E(1e4), E(1e5), E(1e6), E(1e8), E(1e10), E(1e12), E(1e15)],
		tickspeedMultiplier: E(10),
		chall2Pow: 1,
		chall3Pow: E(0.01),
		matter: E(0),
		chall11Pow: E(1),
		partInfinityPoint: mod.ngm ? -1e300 : 0,
		partInfinitied: mod.ngm ? -1e8 : 0,
		break: false,
		challengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
		infchallengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
		lastTenRuns: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
		lastTenEternities: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
		infMult: E(mod.ngm ? 0.5 : 1),
		infMultCost: E(mod.ngm ? 30 : 10),
		tickSpeedMultDecrease: 10,
		tickSpeedMultDecreaseCost: 3e6,
		dimensionMultDecrease: mod.ngm ? 11 : 10,
		dimensionMultDecreaseCost: 1e8,
		overXGalaxies: 10,
		version: 10,
		infDimensionsUnlocked: [],
		infinityPower: E(1),
		spreadingCancer: mod.ngm ? -9990 : 0,
		postChallUnlocked: 0,
		postC4Tier: 0,
		postC3Reward: E(1),
		postC8Mult: E(1),
		eternityPoints: E(0),
		eternities: mod.ngm ? -20 : 0,
		thisEternity: 0,
		bestEternity: 9999999999,
		eternityUpgrades: [],
		epmult: E(1),
		epmultCost: E(500),
		infinityDimension1 : {
			cost: E(1e8),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		},
		infinityDimension2 : {
			cost: E(1e9),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		},
		infinityDimension3 : {
			cost: E(1e10),
			amount: E(0),
			bought: 0,
			power: E(1),
			baseAmount: 0
		},
		infinityDimension4 : {
			cost: E(1e20),
			amount: E(0),
			bought: 0,
			power: E(mod.ngm ? 0.0000125 : 1),
			baseAmount: 0
		},
		infinityDimension5 : {
			cost: E(1e140),
			amount: E(0),
			bought: 0,
			power: E(mod.ngm ? 0.01 : 1),
			baseAmount: 0
		},
		infinityDimension6 : {
			cost: E(1e200),
			amount: E(0),
			bought: 0,
			power: E(mod.ngm ? 0.015 : 1),
			baseAmount: 0
		},
		infinityDimension7 : {
			cost: E(1e250),
			amount: E(0),
			bought: 0,
			power: E(mod.ngm ? 0.01 : 1),
			baseAmount: 0
		},
		infinityDimension8 : {
			cost: E(1e280),
			amount: E(0),
			bought: 0,
			power: E(mod.ngm ? 0.01 : 1),
			baseAmount: 0
		},
		infDimBuyers: [false, false, false, false, false, false, false, false],
		timeShards: E(0),
		tickThreshold: E(1),
		totalTickGained: 0,
		timeDimension1: {
			cost: E(1),
			amount: E(0),
			power: E(mod.ngm ? 0.01 : 1),
			bought: 0
		},
		timeDimension2: {
			cost: E(5),
			amount: E(0),
			power: E(mod.ngm ? 0.03 : 1),
			bought: 0
		},
		timeDimension3: {
			cost: E(100),
			amount: E(0),
			power: E(mod.ngm ? 0.025 : 1),
			bought: 0
		},
		timeDimension4: {
			cost: E(1000),
			amount: E(0),
			power: E(mod.ngm ? 0.02 : 1),
			bought: 0
		},
		timeDimension5: {
			cost: E("1e2350"),
			amount: E(0),
			power: E(mod.ngm ? 1e-5 : 1),
			bought: 0
		},
		timeDimension6: {
			cost: E("1e2650"),
			amount: E(0),
			power: E(mod.ngm ? 5e-6 : 1),
			bought: 0
		},
		timeDimension7: {
			cost: E("1e3000"),
			amount: E(0),
			power: E(mod.ngm ? 3e-6 : 1),
			bought: 0
		},
		timeDimension8: {
			cost: E("1e3350"),
			amount: E(0),
			power: E(mod.ngm ? 2e-6 : 1),
			bought: 0
		},
		offlineProd: 0,
		offlineProdCost: mod.ngm ? 5e11 : 1e7,
		challengeTarget: 0,
		autoSacrifice: 1,
		replicanti: {
			amount: E(0),
			unl: false,
			chance: 0.01,
			chanceCost: E(mod.ngmm?1e90:1e150),
			interval: mod.ngm ? 5000 : 1000,
			intervalCost: E(mod.ngmm?1e80:mod.rs?1e150:1e140),
			gal: 0,
			galaxies: 0,
			galCost: E(mod.ngmm?1e110:1e170),
			auto: [false, false, false]
		},
		timestudy: {
			theorem: mod.ngm ? -6 : 0,
			amcost: E("1e20000"),
			ipcost: E(mod.ngm ? 1e-13 : 1),
			epcost: E(1),
			studies: [],
		},
		eternityChalls: mod.ngm ? {eterc1:-6} : {},
		eternityChallGoal: E(Number.MAX_VALUE),
		currentEternityChall: "",
		eternityChallUnlocked: 0,
		etercreq: 0,
		autoIP: E(0),
		autoTime: 1e300, 
		infMultBuyer: false,
		autoCrunchMode: "amount",
		respec: false,
		eternityBuyer: {
				limit: E(0),
				isOn: false
		},
		eterc8ids: 50,
		eterc8repl: 40,
		dimlife: true,
		dead: true,
		dilation: {
			studies: [],
			active: false,
			tachyonParticles: E(0),
			dilatedTime: E(0),
			totalTachyonParticles: E(mod.ngm ? 2000 :0),
			nextThreshold: E(1000),
			freeGalaxies: 0,
			upgrades: [],
			rebuyables: {
				1: 0,
				2: mod.ngm ? 1 : 0,
				3: 0,
			}
		},
		why: 0,
		shameLevel: 0,
		options: {
			newsHidden: true,
			notation: "Mixed scientific",
			scientific: false,
			challConf: true,
			sacrificeConfirmation: true,
			retryChallenge: false,
			bulkOn: true,
			cloud: true,
			hotkeys: true,
			theme: undefined,
			secretThemeKey: 0,
			eternityconfirm: true,
			commas: "Commas",
			updateRate: 50,
			chart: {
				updateRate: 1000,
				duration: 10,
				warning: 0,
			},
			animations: {
				floatingText: true,
				bigCrunch: true,
				eternity: true,
				tachyonParticles: true,
			}
		},
		aarexModifications: {
			offlineProgress: true,
			autoSave: true,
			progressBar: true,
			eternityChallRecords: {},
			popUpId: 0,
			tabsSave: {}
		}
	}
	aarMod = player.aarexModifications

	if (mod.ngm) doNGMinusNewPlayer()
	if (mod.ngpp) doNGPlusTwoNewPlayer()
	if (mod.ngpp > 1) doNGPlusThreeNewPlayer()

	if (mod.ngmu) doNGMultipliedPlayer()
	if (mod.ngep) doNGEXPNewPlayer()

	if (mod.ngud) doNGUDNewPlayer()
	if (mod.ngud == 2) aarMod.ngudpV = 1.12
	if (mod.ngud == 3) doNGUDSemiprimePlayer()
	if (mod.nguep) aarMod.nguepV = 1.03
	if (mod.ngumu) aarMod.ngumuV = 1.03

	if (mod.ngmm) {
		mod.ngmX = aarMod.ngmX = mod.ngmm+1
		doNGMinusTwoNewPlayer()
	}
	if (mod.ngmm >= 2) doNGMinusThreeNewPlayer()
	if (mod.ngmm >= 3) doNGMinusFourPlayer()

	if (mod.rs == 1) doEternityRespeccedNewPlayer()

	if (mod.ngp) doNGPlusOneNewPlayer()
	if (mod.ngp > 1) doNGPlusFourPlayer()
	if (mod.aau) {
		aarMod.aau = 1
		dev.giveAllAchievements(true)
	}
}

function doNGMinusNewPlayer(){
	player.achievements.push("r22")
	player.achievements.push("r85")
	aarMod.newGameMinusVersion = 2.2
}

function doNGPlusOneNewPlayer(){
	for (i = 1; i <= 13; i++) { // get all achievements up to and including row 13
		for (j = 1; j <= 8; j++) {
			player.achievements.push("r" + i + j)
		}
	}

	player.money = E(2e25)
	player.resets = 4
	player.galaxies = 1
	player.infinitiedBank = 5e9
	player.infinityUpgrades = ["timeMult", "dimMult", "timeMult2", "unspentBonus", "27Mult", "18Mult", "36Mult", "resetMult", "passiveGen", "45Mult", "resetBoost", "galaxyBoost", "skipReset1", "skipReset2", "skipReset3", "skipResetGalaxy"]
	player.infMult = 2048
	player.dimensionMultDecrease = 2
	player.tickSpeedMultDecrease = 1.65
	player.eternities = 1012680
	setInfChallengeOrder()
	player.challenges = challengesCompletedOnEternity()
	player.postChallUnlocked = order.length
	player.replicanti.unl = true
	player.replicanti.amount = E(1)
	for (ec = 1; ec <= 12; ec++) player.eternityChalls['eterc' + ec] = 5
	player.eternityChalls.eterc1 = 1
	player.eternityChalls.eterc4 = 1
	player.eternityChalls.eterc10 = 1
	player.dilation.studies = [1]
	player.dilation.rebuyables[3] = 2
	player.break = true
	aarMod.newGamePlusVersion = 3.01
}

function doNGPlusTwoNewPlayer(){
	aarMod.newGamePlusPlusVersion = 2.90142

	player.autoEterMode = "amount"
	player.dilation.rebuyables[4] = 0
	player.meta = {resets: 0, antimatter: 10, bestAntimatter: 10}
	for (dim = 1; dim <= 8; dim++) player.meta[dim] = {amount: 0, bought: 0, cost: initCost[dim]}

	player.autoEterOptions = {}
	player.galaxyMaxBulk = false
	player.quantum = {
		times: 0,
		time: 0,
		best: 9999999999,
		last10: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
		quarks: 0,
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
		upgrades: []
	}
	aarMod.quantumConf = true
	quSave = player.quantum
}

function doNGMinusTwoNewPlayer(){
	aarMod.newGameMinusMinusVersion = 2.41
	player.galacticSacrifice = resetGalacticSacrificeData()
	player.totalBoughtDims = {}
	player.tickBoughtThisInf = resetTickBoughtThisInf()
	player.challengeTimes.push(600*60*24*31)
	player.challengeTimes.push(600*60*24*31)
	player.autobuyers[12] = 13
	player.extraDimPowerIncrease = 0
	player.dimPowerIncreaseCost = !inNGM(3) ? 1e3 : 3e5
	player.infchallengeTimes.push(600*60*24*31)
	player.infchallengeTimes.push(600*60*24*31)
	player.options.gSacrificeConfirmation = true
}

function getBrandNewReplicantsData() {
	return {
		amount: E(0),
		requirement: E("1e3000000"),
		quarks: E(0),
		quantumFood: 0,
		quantumFoodCost: E(2e46),
		limit: 1,
		limitDim: 1,
		limitCost: E(1e49),
		eggonProgress: E(0),
		eggons: E(0),
		hatchSpeed: 20,
		hatchSpeedCost: 1e49,
		babyProgress: E(0),
		babies: E(0),
		ageProgress: E(0)
	}
}

function getBrandNewTodData(){
	return {
		r: {
			quarks: 0,
			spin: 0,
			upgrades: {}
		},
		g: {
			quarks: 0,
			spin: 0,
			upgrades: {}
		},
		b: {
			quarks: 0,
			spin: 0,
			upgrades: {}
		},
		upgrades: {}
	}
}

function getBrandNewBigRipData(){
	return {
		conf: true,
		times: 0,
		bestThisRun: 0,
		bestGals: 0,
		totalAntimatter: E(0),
		spaceShards: E(0),
		upgrades: []
	}
}

function getBrandNewElectronData(){
	return {
		amount: 0,
		sacGals: 0,
		mult: 2,
		rebuyables: [0,0,0,0]
	}
}

function getBrandNewPCData(){
	return {
		order: {},
		current: 0,
		completed: 0,
		fastest: {},
		pc68best: 0
	}
}

function getBrandNewNanofieldData(){
	return {
		charge: 0,
		energy: 0,
		antienergy: 0,
		power: 0,
		powerThreshold: 50,
		rewards: 0
	}
}

function getBrandNewBosonicLabData() {
	let r = {
		watt: E(0),
		speed: E(1),
		ticks: E(0),
		am: E(0),
		typeToExtract: 1,
		extracting: false,
		extractProgress: E(0),
		autoExtract: E(0),
		glyphs: [],
		enchants: {},
		usedEnchants: [],
		upgrades: [],
		battery: E(0),
		odSpeed: 1
	}
	for (var g = 1; g <= br.maxLimit; g++) r.glyphs.push(E(0))
	return r
}

function getBrandNewWZBosonsData() {
	return {
		unl: false,
		dP: E(0),
		dPUse: 0,
		wQkUp: true,
		wQkProgress: 0,
		zNeGen: 1,
		zNeProgress: 1,
		zNeReq: E(1),
		wpb: E(0),
		wnb: E(0),
		zb: E(0)
	}
}

function doNGPlusThreeNewPlayer() {
	aarMod.newGame3PlusVersion = ngp3_ver
	aarMod.ngp3_build = ngp3_build

	player.dbPower = 1
	player.dilation.times = 0
	player.peakSpent = 0
	player.masterystudies = []
	quSave.reached = false
	player.meta.bestOverQuantums = player.meta.bestAntimatter
	quSave.usedQuarks = {
		r: 0,
		g: 0,
		b: 0
	}
	quSave.colorPowers = {
		r: 0,
		g: 0,
		b: 0
	}
	quSave.gluons = {
		rg: 0,
		gb: 0,
		br: 0
	}
	player.eternityBuyer.dilationMode = false
	player.eternityBuyer.statBeforeDilation = 0
	player.eternityBuyer.dilationPerAmount = 10
	quSave.autobuyer = {
		enabled: false,
		limit: 1,
		mode: "amount",
		peakTime: 0
	}
	quSave.electrons = {
		amount: 0,
		sacGals: 0,
		mult: 2,
		rebuyables: [0,0,0,0]
	}
	quSave.disabledRewards = {}
	quSave.metaAutobuyerWait = 0
	quSave.multPower = 0
	quSave.challenge = []
	quSave.challenges = {}
	quSave.nonMAGoalReached = []
	quSave.challengeRecords = {}
	quSave.pairedChallenges = getBrandNewPCData()
	quSave.qcsNoDil = {}
	player.dilation.bestTP = 0
	player.old = false
	quSave.autoOptions = {}
	quSave.replicants = {
		amount: 0,
		requirement: "1e3000000",
		quarks: 0,
		quantumFood: 0,
		quantumFoodCost: 2e46,
		limit: 1,
		limitDim: 1,
		limitCost: 1e49,
		eggonProgress: 0,
		eggons: 0,
		hatchSpeed: 20,
		hatchSpeedCost: 1e49,
		babyProgress: 0,
		babies: 0,
		ageProgress: 0
	}
	quSave.emperorDimensions = {}
	for (d=1;d<9;d++) quSave.emperorDimensions[d] = {workers: 0, progress: 0, perm: 0}
	quSave.nanofield = {
		charge: 0,
		energy: 0,
		antienergy: 0,
		power: 0,
		powerThreshold: 50,
		rewards: 0,
		producingCharge: false
	}
	quSave.assignAllRatios = {
		r: 1,
		g: 1,
		b: 1
	}
	quSave.notrelative = false
	quSave.wasted = false
	quSave.tod = {
		r: {
			quarks: 0,
			spin: 0,
			upgrades: {}
		},
		upgrades: {}
	}
	quSave.bigRip = getBrandNewBigRipData()
	quSave.breakEternity = {
		unlocked: false,
		break: false,
		eternalMatter: 0,
		upgrades: [],
		epMultPower: 0
	}
	aarMod.ghostifyConf = true
}

function doEternityRespeccedNewPlayer(){
	aarMod.ersVersion = 1.02
	player.boughtDims = []
	player.replicanti.limit = Number.MAX_VALUE
	player.replicanti.newLimit = Number.MAX_VALUE
	player.timestudy.ers_studies = [null, 0, 0, 0, 0, 0, 0]
	player.timestudy.studyGroupsUnlocked = 0
}

function doNGMinusThreeNewPlayer(){
	aarMod.newGame3MinusVersion = 3.202
	player.tickspeedBoosts = 0
	player.autobuyers[13] = 14
	player.challengeTimes.push(600*60*24*31)
	player.infchallengeTimes.push(600*60*24*31)
	player.infchallengeTimes.push(600*60*24*31)
	player.infchallengeTimes.push(600*60*24*31)
	player.infchallengeTimes.push(600*60*24*31)
	player.overXGalaxiesTickspeedBoost=10
	player.replicanti.chanceCost = pow10(150)
	player.replicanti.intervalCost = pow10(140)
	player.replicanti.galCost = pow10(170)
}

function doNGEXPNewPlayer(){
	aarMod.newGameExpVersion = 1.11
	for (u=1;u<5;u++) player.infinityUpgrades.push("skipReset" + (u > 3 ? "Galaxy" : u))
	player.resets=4
}

function doNGUDNewPlayer(){
	aarMod.newGameUpdateVersion = 1.1
	player.exdilation = {
		unspent: 0,
		spent: {
			1: 0,
			2: 0,
			3: 0
		},
		times: 0
	}
	player.blackhole = {
		unl: false,
		upgrades: {dilatedTime: 0, bankedInfinities: 0, replicanti: 0, total: 0},
		power: 0
	}
	for (var d = 1; d < 5; d++) player["blackholeDimension" + d] = {
		cost: blackholeDimStartCosts[d],
		amount: 0,
		power: 1,
		bought: 0
	}
	player.options.exdilationconfirm = true
}

function doNGPlusFourPlayer(){
	player.eternities = 1e13
	for (var c = 13; c < 15; c++) player.eternityChalls["eterc" + c] = 5

	player.dilation.studies = [1, 2, 3, 4, 5, 6]
	player.dilation.dilatedTime = 1e100
	for (var u = 4; u < 11; u++) player.dilation.upgrades.push(u)
	for (var u = 1; u < 7; u++) player.dilation.upgrades.push("ngpp" + u)

	player.meta.antimatter = 1e25
	player.meta.resets = 4
	quSave.times = 1
	quSave.best = 10
	for (var d = 7; d < 14; d++) player.masterystudies.push("d"+d)

	quSave.electrons.mult = 6
	for (var c = 1; c < 9; c++) quSave.challenges[c] = 2
	quSave.pairedChallenges.completed = 4
	quSave.nanofield.rewards = 19
	quSave.reachedInfQK = true

	player.achievements.push("ng3p18")
	player.achievements.push("ng3p28")
	player.achievements.push("ng3p37")
	player.achievements.push("ng3p47")
	aarMod.ngp4V = 1
}

function doNGUDSemiprimePlayer(){
	for (var d = 5; d < 9; d++) player["blackholeDimension" + d] = {
		cost: blackholeDimStartCosts[d],
		amount: 0,
		power: 1,
		bought: 0
	}
	aarMod.nguspV = 1
}

function doNGMinusFourPlayer(){
	aarMod.newGame4MinusVersion = 2.111
	player.tdBoosts = 0
	player.challengeTimes.push(600 * 60 * 24 * 31)
	player.autobuyers.push(15)
	resetNGM4TDs()
	reduceDimCosts()
}

function doNGMultipliedPlayer(){
	aarMod.newGameMult = 1
	player.infMult = 2048
	player.eternities = 1012680
	player.replicanti.unl = true
	player.replicanti.amount = E(1)
}
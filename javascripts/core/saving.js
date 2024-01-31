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
	if (!silent) $.notify("Game saved", "info")
}

function runAutoSave() {
	if (!aarMod) return

	autoSaveSeconds++
	if (autoSaveSeconds >= getAutoSaveInterval()) {
		save_game()
		autoSaveSeconds=0
	}
}

//Loading
var savePlacement
var preventLoop = false
function load_game(reload, type, preset) {
	clearInterval(gameLoopIntervalId)
	updateNewPlayer(type, preset)

	let curr = meta.save.current
	let save = get_save(curr)
	if (save != null) {
		if (save?.quantum?.timeFluxPower !== undefined) save = get_save(curr + "_af2019")

		infiniteDetected = false
		if (!infiniteCheck) player = save
		if (infiniteCheck2) infiniteCheck2 = false
		if (detectInfinite()) infiniteCheck = true
	}

	savePlacement = -1
	if (meta.save.saveOrder.includes(meta.save.current)) {
		while (meta.save.saveOrder[savePlacement] != meta.save.current) savePlacement++
	}

	onLoad(reload)
	startInterval()
}

var loadedSaves=0
var onLoading
var latestRow
var loadSavesIntervalId
function load_saves() {
	closeToolTip()
	el("loadmenu").style.display = "block"
	clearInterval(loadSavesIntervalId)

	loadSavesIntervalId = setInterval(function(){
		if (onLoading) return
		if (loadedSaves == meta.save.saveOrder.length) {
			clearInterval(loadSavesIntervalId)
			return
		}

		onLoading = true
		try {
			setupSaveDisp()
			onLoading = false
		} catch (_) {}
	}, 10)
}

function setupSaveDisp() {
	let i = loadedSaves
	el("saves").insertRow(i).innerHTML = `<b id='save_${i}_title'></b>
		<div id='save_${i}_desc'></div>
		<button class='storebtn' onclick='change_save_placement(${i})'>Load</button>
		<button class='storebtn' onclick='rename_save(${i})'>Rename</button>
		<button class='storebtn' onclick='export_save(${i})'>Export</button>
		<button class='storebtn' onclick='import_save(${i})'>Import</button>
		<button class='storebtn' onclick='overwrite_save(${i})'>Overwrite</button>
		<span class='metaOpts'>
			<button class='storebtn' onclick='swap_save(${i}, ${i-1})'>⭡</button>
			<button class='storebtn' onclick='swap_save(${i}, ${i+1})'>⭣</button>
			<button class='storebtn' onclick='delete_save(${i})'>X</button>
		</span>`
	loadedSaves++
	changeSaveDesc(i)
}

function changeSaveDesc(i, exit) {
	let element = el("save_" + i + "_desc")
	if (element == undefined) return

	let isCurrent = savePlacement == i
	let data = isCurrent ? player : get_save(meta.save.saveOrder[i])
	el("save_"+i+"_title").textContent = (data?.aarexModifications?.save_name || "Save #" + (i + 1)) + (isCurrent && !exit ? " (selected)" : "")

	try {
		if (data.aarexModifications == null) data.aarexModifications = {}
		let msg = modAbbs(checkMods(data)) + "<br>"

		var isSaveGhostified = data?.ghostify?.times > 0
		var isSaveQuantumed = data?.quantum?.times > 0
		if (isSaveGhostified) {
			if (data.achievements.includes("ng3p81")) {
				msg+="Spectral Particles: "+shortenDimensions(E(data.ghostify.ghostParticles))+", Bosons: "+shorten(E(data.ghostify.lab.best_bosons))
			} else if (data.achievements.includes("ng3p71")) {
				msg+="Spectral Particles: "+shortenDimensions(E(data.ghostify.ghostParticles))
			} else msg+="Spectral Particles: "+shortenDimensions(E(data.ghostify.ghostParticles))+", Neutrinos: "+shortenDimensions(Decimal.add(data.ghostify.neutrinos.electron, data.ghostify.neutrinos.mu).add(data.ghostify.neutrinos.tau).round())
		} else if (isSaveQuantumed) {
			if (!data.masterystudies) msg+="Endgame of NG++"
			else if (data.masterystudies.includes('d14')) msg+="Total antimatter in Big Rips: "+shortenDimensions(E(data.quantum.bigRip.totalAntimatter))+", Space Shards: "+shortenDimensions(E(data.quantum.bigRip.spaceShards))+(data.achievements.includes("ng3p55")?", Eternal Matter: "+shortenDimensions(E(data.quantum.breakEternity.eternalMatter)):"")
			else {
				msg+="Quarks: "+shortenDimensions(Decimal.add(data.quantum.quarks,data.quantum.usedQuarks.r).add(data.quantum.usedQuarks.g).add(data.quantum.usedQuarks.b))
				if (data.masterystudies.includes('d13')) msg+=", Preonic Spins: "+shortenDimensions(E(data.quantum.tod.r.spin))
				else if (data.masterystudies.includes('d12')) msg+=", Nanocharge: "+shortenDimensions(E(data.quantum.nanofield.charge))+", Nanorewards: "+getFullExpansion(data.quantum.nanofield.rewards)
				else if (data.masterystudies.includes('d10')) msg+=", Duplicants: "+shortenDimensions(getTotalDuplicants(data))+", Worker duplicants: "+shortenDimensions(getTotalWorkers(data))
				else if (data.masterystudies.includes('d9')) msg+=", Paired Challenges: "+data.quantum.pairedChallenges.completed
				else if (data.masterystudies.includes('d8')) {
					var completions=0
					if (typeof(data.quantum.challenges)=="number") completions=data.quantum.challenges
					else for (c=1;c<9;c++) if (data.quantum.challenges[c]) completions++
					msg+=", Challenge completions: "+completions
				} else {
					if (data.quantum.gluons.rg) msg+=", Gluons: "+shortenDimensions(Decimal.add(data.quantum.gluons.rg,data.quantum.gluons.gb).add(data.quantum.gluons.br))
					if (data.masterystudies.includes('d7')) msg+=", Positrons: "+shortenDimensions(data.quantum.electrons.amount)
				}
				msg+=", Best quantum: "+timeDisplayShort(data.quantum.best)
			}
		} else if (data.exdilation && data.blackhole.unl) {
			var datastart="Eternity Points: "+shortenDimensions(E(data.eternityPoints))
			var dataend=", Black Hole Power: "+shortenMoney(E(data.blackhole.power))
			if (data.exdilation.times > 0) msg+=datastart+dataend+", Ex-dilation: "+shortenDimensions(E(data.exdilation.unspent))
			else msg+=datastart+", Dilated time: "+shortenMoney(E(data.dilation.dilatedTime))+", Banked Infinities: "+getFullExpansion(data.infinitiedBank)+", Replicanti: "+shortenMoney(E(data.replicanti.amount))+dataend
		} else if (data.dilation?data.dilation.studies.includes(1):false) {
			var data2="Tachyon particles: "+shortenMoney(E(data.dilation.totalTachyonParticles))+", Dilated Time: "+shortenMoney(E(data.dilation.dilatedTime))
			if (data.dilation.studies.includes(6)) data2+=", Best meta-antimatter: "+shortenMoney(E(data.meta.bestAntimatter))+", Meta-Dimension Shifts/Boosts: "+data.meta.resets
			else if (!data.dilation.studies.includes(5)) data2="Time Theorems: "+shortenMoney(getTotalTT(data))+", "+data2
			else if (!data.dilation.upgrades.includes(10)) data2="Eternity Points: "+shortenDimensions(data.eternityPoints)+", "+data2
			msg+=data2
		} else {
			var totalChallengeCompletions=0
			for (ec=1;ec<13;ec++) totalChallengeCompletions+=(data.eternityChalls['eterc'+ec]?data.eternityChalls['eterc'+ec]:0)
			if (totalChallengeCompletions>0) {
				msg+="Time Theorems: "+getFullExpansion(getTotalTT(data))+", Challenge completions: "+totalChallengeCompletions
			} else if (data.eternities>0) msg+="Eternity Points: "+shortenDimensions(E(data.eternityPoints))+", Eternities: "+data.eternities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+", Time Theorems: "+getTotalTT(data)
			else if (data.achievements.includes("r51")) {
				msg+="Antimatter: "+shortenMoney(E(data.money))+", Infinity Points: "+shortenDimensions(E(data.infinityPoints))
				if (data.postChallUnlocked>0&&!data.replicanti.unlocked) {
					var totalChallengeCompletions=0
					for (ic=1;ic<13;ic++) totalChallengeCompletions+=data.challenges.includes("postc"+ic)?1:0
					msg+=", Challenge completions: "+totalChallengeCompletions
				}
			} else if (data.infinitied>0) msg+="Infinity Points: "+shortenDimensions(E(data.infinityPoints))+", Infinities: "+data.infinitied.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+", Challenge completions: "+data.challenges.length
			else if (data?.galacticSacrifice?.times) msg+="Antimatter: "+shortenMoney(E(data.money))+", Galaxy Points: "+shortenDimensions(E(data.galacticSacrifice.galaxyPoints))
			else msg+="Antimatter: "+shortenMoney(E(data.money))+", Dimension Shifts/Boosts: "+data.resets+((data.tickspeedBoosts != undefined ? (data.resets > 0 || data.tickspeedBoosts > 0 || data.galaxies > 0 || data.infinitied > 0 || data.eternities != 0 || isSaveQuantumed) : false)?", Tickspeed Boosts: "+getFullExpansion(data.tickspeedBoosts):"")+", Galaxies: "+data.galaxies
		}
		element.innerHTML = msg
	} catch (e) {
		console.error(e)
		element.innerHTML = "New game"
	}
}

function reload() {
	load_game(true)
}

function verify_save(obj) {
	if (typeof obj != 'object') return false;
	return true;
}

function change_save(id) {
	if (game_loaded) save_game(true)
	changeSaveDesc(savePlacement, true)

	meta.save.current = id
	meta.mustSave = true
	if (game_loaded) {
		load_game(shiftDown)
		$.notify("Save #" + (savePlacement + 1) + " loaded", "info")
	} else document.location.reload()
}

function change_save_placement(i) {
	change_save(meta.save.saveOrder[i])
}

function export_save(i = savePlacement) {
	let data
	if (i == savePlacement) data = btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v }))
	else data = localStorage.getItem(btoa(savePrefix + meta.save.saveOrder[i]))

	exportData(data, "Exported save #" + (i + 1) + " to clipboard")
}

//Credits to MrRedShark77 from https://github.com/MrRedShark77/incremental-mass-rewritten/blob/main/js/saves.js
function export_file() {
	downloadData(btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v })), "NG+3 v2.31 Beta - "+new Date().toGMTString()+".txt")
}

function downloadData(str, url) {
	let file = new Blob([str], {type: "text/plain"})
	window.URL = window.URL || window.webkitURL;
	let a = document.createElement("a")
	a.href = window.URL.createObjectURL(file)
	a.download = url
	a.click()
}

function exportData(encoded, success) {
	let output = el('output');
	let parent = output.parentElement;

	parent.style.display = ""
	output.value = encoded
	output.onblur = _ => parent.style.display = "none"
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
function import_save(i = savePlacement) {
	if (i == -1) {
		$.notify("Importing saves is disabled during a Rediscovery to prevent cheating.")
		return
	}

	onImport = true
	var save_data = prompt("Input your save. " + (i == "new" ? "(the save file will be placed as the last entry of your savefile list)" : "("+(i==savePlacement?"your current save file":"save #"+(i+1))+" will be overwritten!)"));
	onImport = false

	// current reality version update number is 19
	if (save_data.version > 12.2 && save_data.split("AntimatterDimensions")[1] && save_data.split("EndOf")[1]) {
		$.notify("The Reality Update is incompatible with Aarex's mods.", "error")
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
			$.notify("The Reality Update is incompatible with Aarex's mods.", "error")
			return
		}
		if (i == savePlacement) {
			clearInterval(gameLoopIntervalId)
			infiniteCheck2 = false
			player = decoded_save_data;
			if (detectInfinite()) infiniteDetected = true
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
		} else if (i == "new") {
			var new_id=1
			while (meta.save.saveOrder.includes(new_id)) new_id++
			meta.save.saveOrder.push(new_id)
			set_save(new_id, decoded_save_data)

			setupSaveDisp()
			meta.mustSave = true
		} else {
			set_save(meta.save.saveOrder[i], decoded_save_data)
			changeSaveDesc(i)
		}
	}
}

function swap_save(i, j) {
	let order = meta.save.saveOrder
	if (j < 0 || j >= order.length) return

	let save = order[i]
	let other = order[j]
	order[i] = other
	order[j] = save
	meta.mustSave = true

	if (savePlacement == j) savePlacement = i
	else if (savePlacement == i) savePlacement = j
	changeSaveDesc(i)
	changeSaveDesc(j)
}

function delete_save(i) {
	if (REDISCOVER.in()) {
		$.notify("You cannot delete Rediscovery saves.")
		return
	}
	if (meta.save.saveOrder.length == 1) {
		reset_game()
		return
	}

	if (!confirm("Do you really want to erase this save? All game data in this save will be deleted!")) return

	let order = meta.save.saveOrder
	let new_order = []
	for (let j in order) if (j != i) new_order.push(order[j])
	meta.save.saveOrder = new_order

	if (savePlacement == i) change_save_placement(0)
	if (savePlacement > i) savePlacement--
	saveMeta()

	for (let j = i; j < new_order.length; j++) changeSaveDesc(j)
	loadedSaves--
	el("saves").deleteRow(loadedSaves)

	$.notify("Save deleted", "info")
}

function rename_save(i = savePlacement) {
	var save_name = prompt("Input the new name of " + (i == savePlacement ? "your current save" : "save #" + (i + 1))+". Leave the space blank to reset the save's name.")

	if (i == savePlacement) {
		aarMod.save_name = save_name
		el("save_name").textContent = "You are currently playing in " + (save_name ? save_name : "Save #" + (i + 1))
	} else {
		var saveId = meta.save.saveOrder[i]
		var data = get_save(saveId)
		if (!data.aarexModifications) data.aarexModifications = {
			dilationConf: false,
			progressBar: true,
			logRateChange: false,
			eternityChallRecords: {},
			breakInfinity: false
		}
		data.aarexModifications.save_name = save_name
		set_save(saveId, data)
		changeSaveDesc(i)
	}

	$.notify("Save renamed", "info")
}

function overwrite_save(i) {
	if (savePlacement == i) save_game()
	else {
		if (!confirm("Are you really sure you want to overwrite save #"+(i+1)+"? All progress in the current save will be overwritten with the new save!")) return
		set_save(meta.save.saveOrder[i], player)
		changeSaveDesc(i)
		$.notify("Save overwritten", "info")
	}
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
function new_game(type) {
	changeSaveDesc(savePlacement, true)
	save_game(true)

	meta.save.current = 1
	while (meta.save.saveOrder.includes(meta.save.current)) meta.save.current++
	meta.save.saveOrder.push(meta.save.current)
	meta.mustSave = true

	$.notify("Save created", "info")
	set_save(meta.save.current)
	load_game(true, type ? "quick" : "new", type)
}

//Saving Options
function changeAutoSaveInterval(update) {
	if (update) aarMod.autoSaveInterval = el("autoSaveIntervalSlider").value

	let autoInt = getAutoSaveInterval()
	el("autoSaveInterval").textContent = "Auto-save: " + (autoInt < 1/0 ? autoInt + "s" : "OFF")
	el("autoSaveIntervalSlider").value = autoInt == 1/0 ? 14 : autoInt
}

function getAutoSaveInterval() {
	if (aarMod.autoSaveInterval == 14) return 1/0
	return aarMod.autoSaveInterval || 30
}

function adjustOfflineProgress() {
	aarMod.offline = parseInt(el("offlineSlider").value)
	el("offlineInterval").textContent = "Offline progress: " + (aarMod.offline ? (aarMod.offline * 100) + " ticks" : "OFF")
};

//Player Creation
var player
function updateNewPlayer(mode, preset) {
	if (mode == "quick") mod = modPresets[preset]
	else if (mode == "new") mod = modChosen
	else if (mode == "start") mod = modPresets.ngp3
	else if (mode != "reset") mod = {}

	player = {
		money: E(mod.ngmm>2?200:mod.ngp>1?20:10),
		tickSpeedCost: E(1000),
		tickspeed: E(mod.ngp>1?500:1000),
		sacrificed: E(0),
		achievements: [],
		infinityUpgrades: [],
		challenges: [],
		currentChallenge: "",
		infinityPoints: E(0),
		infinitied: mod.ngp ? 1 : 0,
		infinitiedBank: 0,
		totalTimePlayed: 0,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: 0,
		galaxies: 0,
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
		partInfinityPoint: 0,
		partInfinitied: 0,
		break: false,
		challengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
		infchallengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
		lastTenRuns: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
		lastTenEternities: [[600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0], [600*60*24*31, 0]],
		infMult: E(1),
		infMultCost: E(10),
		tickSpeedMultDecrease: 10,
		tickSpeedMultDecreaseCost: 3e6,
		dimensionMultDecrease: 10,
		dimensionMultDecreaseCost: 1e8,
		overXGalaxies: 10,
		version: 10,
		infDimensionsUnlocked: [],
		infinityPower: E(1),
		spreadingCancer: 0,
		postChallUnlocked: 0,
		postC4Tier: 0,
		postC3Reward: E(1),
		postC8Mult: E(1),
		eternityPoints: E(0),
		eternities: 0,
		thisEternity: 0,
		bestEternity: 9999999999,
		eternityUpgrades: [],
		epmult: E(1),
		epmultCost: E(500),
		infDimBuyers: [false, false, false, false, false, false, false, false],
		timeShards: E(0),
		tickThreshold: E(1),
		totalTickGained: 0,
		offlineProd: 0,
		offlineProdCost: 1e7,
		challengeTarget: 0,
		autoSacrifice: 1,
		replicanti: {
			amount: E(0),
			unl: false,
			chance: 0.01,
			chanceCost: E(mod.ngmm?1e90:1e150),
			interval: 1000,
			intervalCost: E(mod.ngmm?1e80:mod.rs?1e150:1e140),
			gal: 0,
			galaxies: 0,
			galCost: E(mod.ngmm?1e110:1e170),
			auto: [false, false, false]
		},
		timestudy: {
			theorem: 0,
			amcost: E("1e20000"),
			ipcost: E(1),
			epcost: E(1),
			studies: [],
		},
		eternityChalls: {},
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
			totalTachyonParticles: E(0),
			nextThreshold: E(1000),
			freeGalaxies: 0,
			upgrades: [],
			rebuyables: {
				1: 0,
				2: 0,
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
			tabAmount: true,
			animations: {
				floatingText: true,
				bigCrunch: true,
				eternity: true,
				tachyonParticles: true,
			}
		},
		aarexModifications: {
			progressBar: true,
			eternityChallRecords: {}
		}
	}
	aarMod = player.aarexModifications

	if (mod.ngpp) doNGPlusTwoNewPlayer()
	if (mod.ngpp > 1) doNGPlusThreeNewPlayer()

	if (mod.ngmu) doNGMultipliedPlayer()
	if (mod.ngep) doNGEXPNewPlayer()

	if (mod.ngud) doNGUDNewPlayer()
	if (mod.ngud == 2) aarMod.ngudpV = 1.12
	if (mod.ngud == 3) doNGUDSemiprimePlayer()
	if (mod.nguep) aarMod.nguepV = 1.03
	if (mod.ngumu) aarMod.ngumuV = 1.03

	if (mod.rs == 1) doEternityRespeccedNewPlayer()

	if (mod.ngp) doNGPlusOneNewPlayer()
	if (mod.ngp > 1) doNGPlusFourPlayer()
	if (mod.aau) {
		aarMod.aau = 1
		dev.giveAllAchievements(true)
	}

	resetDimensions()
	completelyResetInfinityDimensions()
	completelyResetTimeDimensions()

	if (mod.ngmm) {
		mod.ngmX = aarMod.ngmX = mod.ngmm+1
		doNGMinusTwoNewPlayer()
	}
	if (mod.ngmm >= 2) doNGMinusThreeNewPlayer()
	if (mod.ngmm >= 3) doNGMinusFourPlayer()
}

function doNGPlusOneNewPlayer(){ // eventually change to have multiple versions/variations of NG+
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

function getBrandNewDuplicantsData() {
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
		chosen: "r",
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

function getBrandNewPositronData(){
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
	quSave.emperorDimensions = setupEDSave()
	quSave.nanofield = {
		charge: 0,
		energy: 0,
		antienergy: 0,
		rewards: 0,
	}
	quSave.assignAllRatios = {
		r: 1,
		g: 1,
		b: 1
	}
	quSave.tod = getBrandNewTodData()
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
	player.dilation.dilatedTime = E(1e100)
	for (var u = 4; u < 11; u++) player.dilation.upgrades.push(u)
	for (var u = 1; u < 7; u++) player.dilation.upgrades.push("ngpp" + u)

	player.meta.antimatter = E(1e25)
	player.meta.resets = 4
	quSave.times = 1
	quSave.best = 10
	for (var d = 7; d < 14; d++) player.masterystudies.push("d"+d)

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

function doNGUDSemiprimePlayer() {
	aarMod.nguspV = 0
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
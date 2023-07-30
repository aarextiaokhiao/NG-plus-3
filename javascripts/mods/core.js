function show_mods(type) {
	modsShown = type

	el("savesTab").style.display = modsShown ? "none" : ""
	el("modsTab").style.display = modsShown ? "" : "none"

	el("newSaveBtn").style.display = modsShown ? "none" : ""
	el("newImportBtn").style.display = modsShown ? "none" : ""
	el("cancelNewSaveBtn").style.display = modsShown ? "" : "none"
}

var ngModeMessages=[]
function showNextModeMessage() {
	if (ngModeMessages.length > 0) {
		el("welcome").style.display = "flex"
		el("welcomeMessage").innerHTML = ngModeMessages[ngModeMessages.length-1]
		ngModeMessages.pop()
	} else el("welcome").style.display = "none"
}

var modsShown = false
var modPresets = {
	vanilla: {},
	ngp3: {ngpp: 2, ngp: 1},
	grand_run: {ngpp: 2},
	ngm4: {ngmm: 3},
	udsp: {ngpp: 2, ngp: 1, ngud: 3},
}
var modFullNames = {
	rs: "Eternity Respecced",
	ngep: "NG↑",
	ngpp: "NG++",
	ngp: "NG+",
	ngmm: "NG--",
	ngud: "NGUd",
	nguep: "NGUd↑'",
	ngmu: "NG*",
	ngumu: "NGUd*'",
	aau: "AAU",
	//ngprw: "NG+ Reworked"
}
var modSubNames = {
	ngp: ["OFF", "ON", "+4"], // TODO: make ngp customization more versatile
	ngpp: ["OFF", "ON", "+3"],
	//ngep: ["Linear (↑⁰)", "Exponential (↑)"/*, "Tetrational (↑↑)"*/],
	ngmm: ["OFF", "ON", "-3", "-4"],
	ngud: ["OFF", "ON", "Prime (')", "Semiprime (S')"/*, "Semiprime.1 (S'.1)"*/],
	//nguep: ["Linear' (↑⁰')", "Exponential' (↑')"/*, "Tetrational' (↑↑')"*/]
	/*,
	// modChosen that aren't even made yet
	NG/	 - ngdv: ["OFF", "ON"],
	NG*	 - ngmu: ["OFF", "ON", "NG**", "NG***"],
	NGUd* - ngumu: ["OFF", "ON", "NGUd**'", "NGUd***'"],
	*/
}
var modChosen = {}

function update_mod_btn(id) {
	let mode = modChosen[id] || 0
	let hasSubMod = Object.keys(modSubNames).includes(id)
	el(id+"Btn").textContent=`${modFullNames[id]}: ${hasSubMod ? modSubNames[id][mode] : mode ? "ON" : "OFF"}`
}

function update_mod_btns() {
	//HTML
	for (var i of Object.keys(modFullNames)) update_mod_btn(i)
}

function toggle_mod(id) {
	let hasSubMod = Object.keys(modSubNames).includes(id)
	modChosen[id] = ((modChosen[id] || 0) + 1) % ((hasSubMod && modSubNames[id].length) || 2)

	//Filter
	if (id == "ngp") {
		if (modChosen.ngp == 2) modChosen.ngpp = 2
	}
	if (id == "ngpp") {
		if (modChosen.ngpp && !modChosen.ngp) modChosen.ngp = 1
		if (modChosen.ngpp && modChosen.ngud) modChosen.ngpp = 2
		if (!modChosen.ngpp && modChosen.ngp >= 2) modChosen.ngp = 1
		if (!modChosen.ngpp && modChosen.ngud >= 2) modChosen.ngud = 1
	}
	if (id == "ngud") {
		if (modChosen.ngud && modChosen.ngpp) modChosen.ngpp = 2
		if (modChosen.ngud >= 2) {
			modChosen.ngpp = 2
			if (!modChosen.ngp) modChosen.ngp = 1
		}
		if (!modChosen.ngud) {
			modChosen.ngumu = 0
			modChosen.nguep = 0
		}
	}
	if (id == "ngumu" || id == "nguep") {
		modChosen.ngud = 2
		modChosen.ngpp = 2
		if (!modChosen.ngp) modChosen.ngp = 1
	}
	if (id == "rs") {
		modChosen = { rs: modChosen.rs }
	} else modChosen.rs = 0

	update_mod_btns()
}

function reset_mods() {
	modChosen = {}
	update_mod_btns()
}

//CONDITIONS
let mod = {}
function checkMods(save = player) {
	let aMod = save.aarexModifications || {}
	return {
		ngp: aMod.ngp4V != undefined ? 2 : aMod.newGamePlusVersion != undefined ? 1 : 0,
		ngep: aMod.newGameExpVersion != undefined,
		ngpp: save.masterystudies != undefined ? 2 : save.meta != undefined ? 1 : 0,
		ngmm: Math.max(getNGMX(save) - 1, 0),
		rs: save.boughtDims != undefined,
		ngud: aMod.nguspV != undefined ? 3 : aMod.ngudpV != undefined ? 2 : save.exdilation != undefined ? 1 : 0,
		nguep: aMod.nguepV != undefined,
		ngmu: aMod.newGameMult != undefined,
		ngumu: aMod.ngumuV != undefined,
		aau: aMod.aau != undefined
	}
}

function cacheMods() {
	mod = checkMods()

	mod.ngmX = getNGMX(player)
	mod.ngp3 = mod.ngpp == 2
	mod.p3ep = mod.ngp3 && (mod.ngmu || mod.ngep)
	mod.udp = mod.ngud == 2
	mod.udsp = mod.ngud == 3

	setInfChallengeOrder()
}

function modFragments(mods = mod) {
	let frag = []

	if (mods.ngm) frag.push("-1")
	if (mods.ngmm) frag.push("-" + (mods.ngmm + 1))
	if (mods.rs) frag.push("ER")

	if (mods.ngep) frag.push("Ep")
	if (mods.ngmu) frag.push("Mu")

	if (mods.ngud) {
		frag.push("Ud")
		if (mods.ngud == 2) frag.push("UdP")
		if (mods.ngud == 3) frag.push("UdSP")
		if (mods.nguep) frag.push("UdEpP")
		if (mods.ngumu) frag.push("UdMuP")
	}

	if (mods.ngp) frag.push("+1")
	if (mods.ngpp) frag.push("+"+(mods.ngpp+1))
	if (mods.ngp == 2) frag.push("+4")
	if (mods.aau) frag.push("AAU")
	if (ngpRecommended(mods)) {
		frag.push("No+")
		if (mods.ngpp == 2) frag.push("GR")
	}

	return frag
}

function ngpRecommended(mods = mod) {
	return !mods.ngp && (mods.ngpp || mods.ngud)
}

function inEasierMode() {
	return mod.ngmu || mod.ngep || mod.udp || aarMod.aau
}

//Others
let welcomeMsgs = {
	["-1"]: "Welcome to NG-, created by slabdrill! Originally made as a save file modification, NG- is now ported as a 'mod'. Everything in the original Antimatter Dimensions is nerfed, making the endgame harder to reach.",
	["-2"]: "Welcome to NG--, created by Nyan cat! You are always in Dilation and IC3, but there is a new layer called Galactic Sacrifice.",
	["-3"]: "Welcome to NG-3, the nerfed version of NG--! This mode reduces tickspeed multiplier multiplier and nerfs galaxies, but has a new feature called \"Tickspeed Boosts\" and many more changes to NG--.",
	["-4"]: "Welcome to NG-4, the nerfed version of NG-3! This mode features even more changes from NG---, and is very hardcore. WIP by Nyan Cat and edited by Aarex.",

	["+1"]: "Welcome to NG+ v2, by usavictor and Aarex! You start with many things unlocked to make early game faster.",
	["+2"]: "Welcome to NG++, by dan-simon! New Dilation upgrades and Meta Dimensions are added to push the endgame further. Tweaked due to NG+ updates.",
	["+3"]: "Welcome to NG+++, a long extension to NG++! There is a lot of content in this mod, so good luck!",
	["+4"]: "Welcome to NG+4, originally by Soul147! This is a NG+ checkpoint of NG+3, starting you off with Big Rip unlocked. It is not recommend to play this due to a lot of content being accessible. Tweaked due to NG+3 updates.",

	["Ud"]: "Welcome to NG Update, made by dan-simon! In this mod, Black Hole and Ex-Dilation are available after the endgame of the vanilla Antimatter Dimensions.",
	["Ud+"]: "Welcome to NG Update+, a combination made by Soul147 (Sigma)! This is a combination of dan-simon's NG Update and Aarex's NG+++, which can end up unbalancing the game because of some mechanics.",
	["UdP"]: "Welcome to NG Update Prime, made by pg132! NGUd' is like NGUd+, but you can't reverse dilation. Good luck for beating this mod. >:)",
	["UdSP"]: "Welcome to NG Update Semiprime, made by Aarex! This is like NGUd', but with balancing changes implemented. Good luck! :)",
	["UdMuP"]: "Welcome to NG Update Multiplied Prime, made by Aarex! This is a NG*-like mod of NGUd'. This mod will thus be very fast, but it's unlikely that you will break it.",
	["UdEpP"]: "Welcome to NG Update Exponential Prime, made by pg132! NGUd^' is like NGUd', but nerfs unrelated to the Black Hole are removed to make NGUd^' a NG^-like mod of NGUd'. This mod will be fast as a result, but it is somewhat unlikely that you will break it.",

	["Mu"]: "Welcome to NG Multiplied, made by Despacit and Soul147! This mode adds many buffs which may break the game, similar to NG^.",
	["Ep"]: "Welcome to NG^, made by Naruyoko! This mode adds many buffs to features that can end up unbalancing the game significantly.",
	["ER"]: "Welcome to Eternity Respecced, created by dan-simon! In this mode, Eternity is changed to be balanced better without any scaling. Note: The port is not complete yet, and will be implemented soon.",

	["No+"]: "You have disabled NG+ features on NG++. Without NG+ effects, you will play Antimatter Dimensions without any headstarts, and with NG+3 enabled, it can be considered as The Grand Run. If you want to go for it, good luck.",
	["GR"]: "Welcome to the Grand Run, where you start from the beginning of the original Antimatter Dimensions, but play up to the end of NG+3 without Reality content / balancing. Have fun!",
	["AAU"]: "You have applied the AAU 'mod', made by Apeirogon. This will unbalance many areas of the game, as you get all achievements available in your save. It is not recommended to choose this 'mod' for this reason, unless you want fast gameplay.",
}

function welcomeMods(mods) {
	let frag = modFragments(mods)
	let type = []

	for (var i = 1; i <= 4; i++) if (frag.includes("-"+i)) type.push("-"+i)
	if (frag.includes("ER")) type.push("ER")

	if (frag.includes("UdSP")) type.push("UdSP")
	else if (frag.includes("UdP")) type.push("UdP")
	else if (frag.includes("Ud")) {
		if (frag.includes("+3")) type.push("Ud+")
		else type.push("Ud")
	} else if (frag.includes("+3") && !frag.includes("GR")) {
		if (!frag.includes("+4")) type.push("+3")
	} else if (frag.includes("+2")) type.push("+2")
	else if (frag.includes("+1")) type.push("+1")

	if (frag.includes("UdEpP")) type.push("UdEpP")
	if (frag.includes("UdMuP")) type.push("UdMuP")
	if (frag.includes("+4")) type.push("+4")
	if (frag.includes("Mu")) type.push("Mu")
	if (frag.includes("Ep")) type.push("Ep")

	if (frag.includes("AAU")) type.push("AAU")
	if (frag.includes("GR")) type.push("GR")
	else if (frag.includes("No+")) type.push("No+")

	let msgs = []
	for (var i of type) msgs.push(welcomeMsgs[i])
	return msgs
}

function modAbbs(mods = mod, short) {
	let r = "NG"
	let end = ""

	if (mods.rs) r = short ? "ER" : "Eternity Respecced"

	if (mods.ngud) {
		r += "Ud"
		if (mods.nguep) r += "^"
		if (mods.ngumu) r += "*"
		r += ["", "", "'", "S'"][mods.ngud]
	}

	if (mods.ngep) r += "^"
	if (mods.ngmu) r += "*"

	let plus = 0
	if (mods.ngpp) {
		if (!mods.ngud) plus += mods.ngpp + 1
		if (mods.ngud == 1) plus++
	} else if (mods.ngp) {
		if (mods.ngud) end += ", NG+"
		else plus = 1
	}
	if (mods.ngp == 2) plus++
	if (plus) r += "+" + (plus > 1 ? plus : "")

	if (mods.ngmm) {
		r += "-"+(mods.ngmm+1)
		if (mods.ngm) end += ", NG-"
	} else if (mods.ngm) r += "-"

	if (ngpRecommended(mods)) end += (mods.ngpp == 2 ? ", The Grand Run" : ", No NG+")
	if (mods.aau) end += ", AAU"

	if (r == "NG") r  = short ? "NG=" : "Vanilla AD (pre-Reality)"
	return r + (short ? "" : end)
}
function show_mods(type) {
	modsShown = type

	el("savesTab").style.display = modsShown ? "none" : ""
	el("modsTab").style.display = modsShown === 'basic' ? "" : "none"
	el("advModsTab").style.display = modsShown === 'adv' ? "" : "none"

	el("newSaveBtn").style.display = modsShown ? (modsShown === 'adv' ? "" : "none") : ""
	el("newAdvSaveBtn").style.display = modsShown === "basic" ? "" : "none"
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
	pngp3: {ngpp: 2, ngp: 2},
	ngp3: {ngpp: 2, ngp: 1},
	grand_run: {ngpp: 2},
}
var modFullNames = {
	rs: "Respecced",
	arrows: "NG↑",
	ngpp: "NG++",
	ngp: "NG+",
	ngmm: "NG--",
	ngm: "NG-",
	ngud: "NGUd",
	nguep: "NGUd↑'",
	ngmu: "NG*",
	ngumu: "NGUd*'",
	aau: "AAU",
	ngprw: "NG+ Reworked"
}
var modSubNames = {
	ngp: ["OFF", "ON", "NG+4"],
	ngpp: ["OFF", "ON", "Post-NG+++"/*, "NG+5R"*/],
	arrows: ["Linear (↑⁰)", "Exponential (↑)"/*, "Tetrational (↑↑)"*/],
	ngmm: ["OFF", "ON", "NG---", "NG-4", "NG-5"],
	ngud: ["OFF", "ON", "Prime (')", "Semiprime (S')"/*, "Semiprime.1 (S'.1)"*/],
	nguep: ["Linear' (↑⁰')", "Exponential' (↑')"/*, "Tetrational' (↑↑')"*/]
	/*,
	// modes that aren't even made yet
	NG/   - ngdv: ["OFF", "ON"],
	NG*   - ngmu: ["OFF", "ON", "NG**", "NG***"],
	NGUd* - ngumu: ["OFF", "ON", "NGUd**'", "NGUd***'"],
	*/
}

function toggle_mod(id) {
	hasSubMod = Object.keys(modSubNames).includes(id)
	// Change submod
	var subMode = ((modes[id] || 0) + 1) % ((hasSubMod && modSubNames[id].length) || 2)
	if (id == "ngp" && subMode == 2 && modes.ngpp < 2) subMode = 0
	else if (id == "ngpp" && subMode == 1 && modes.ngud) subMode = 2
	else if (id == "arrows" && subMode == 2 && modes.rs) subMode = 0
	modes[id] = subMode
	// Update displays
	el(id+"Btn").textContent=`${modFullNames[id]}: ${hasSubMod?modSubNames[id][subMode] : subMode ? "ON" : "OFF"}`
	if (id=="ngex"&&subMode) {
		modes.ngp=0
		modes.aau=0
		el("ngpBtn").textContent = "NG+: OFF"
		el("aauBtn").textContent = "AAU: OFF"
	}
	if ((id=="ngpp"||id=="ngud")&&subMode) {
		if (!modes.ngp) toggle_mod("ngp")
	}
	if (((id=="ngpp"&&!subMode)||(id=="rs"&&subMode))&&modes.ngp==2) {
		modes.ngp=1
		el("ngpBtn").textContent = "NG+: ON"
	}
	if ((id=="ngpp"&&subMode==2)&&modes.ngp!==2) {
		modes.ngp=2
		el("ngpBtn").textContent = "NG+: NG+4"
	}
	if ((id=="ngud"&&((subMode>1&&!modes.ngpp)||modes.ngpp==1))&&subMode) {
		modes.ngpp=2
		el("ngppBtn").textContent = "NG++: Post-NG+3"
	}
	if (id=="rs"&&subMode) {
		modes.ngpp=0
		modes.ngud=0
		el("ngppBtn").textContent = "NG++: OFF"
		el("ngudBtn").textContent = "NGUd: OFF"
	}
	if ((id=="ngpp"||id=="ngud")&&!subMode) {
		if (modes.ngud>1) {
			modes.ngud=1
			el("ngudBtn").textContent = "NGUd: ON"
		}
		if (id=="rs"&&modes.arrows>1) {
			modes.arrows=1
			el("arrowsBtn").textContent = "NG↑: Exponential (↑)"
		}
		modes.nguep=0
		modes.ngumu=0
		el("nguepBtn").textContent = "NGUd↑': Linear' (↑⁰')"
		el("ngumuBtn").textContent = "NGUd*': OFF"
	}
	if ((id=="ngumu"||id=="nguep")&&!(modes.ngud>1)&&subMode) {
		modes.ngud=1
		toggle_mod("ngud")
	}
}
//Core
const gWell = {
	1: {
		req: 0,
		hb_req: 0,
		exchanges: [],
		title: "Newtonian",
		desc: "W Bosons have a weaker effect.",
	},
	2: {
		req: 0,
		hb_req: 0,
		exchanges: [],
		title: "Relativity",
		desc: "Gain less Bosons.",
	},
	3: {
		req: 0,
		hb_req: 0,
		exchanges: [],
		title: "Intergalactic",
		desc: "Gain less Hypotheses.",
	},
	4: {
		req: 1/0,
		hb_req: 1/0,
		exchanges: [],
		title: "Einstein",
		desc: "Dimensions are dilated.",
	},
	5: {
		req: 0,
		hb_req: 0,
		exchanges: [],
		title: "Lunarian",
		desc: "Electrons have a weaker effect.",
	},
	6: {
		req: 0,
		hb_req: 0,
		exchanges: [],
		title: "Strange",
		desc: "Fundament effects are weaker.",
	}
}

function doGravitonsUnlockStuff(){
	ghSave.gravitons.unl=true
	ngp3_feature_notify("gw")
	updateBLParticleUnlocks()
	updateTemp()
}

function getBrandNewGravitonsData() {
	return {
		unl: false,
		amt: 0,
		cur: 0,
		slot: [1,2,3,null,null],
		his: [],
		well: {}
	}
}

//Functions
function inGrav() {
	return tmp.ngp3 && ghSave.gravitons.cur
}

function exitGrav() {
	if (!ghSave.gravitons.cur) return
	if (!confirm("You will exit a Gravity Well with no reward. Are you sure?")) return
	ghSave.gravitons.cur = 0
	bosonicLabReset()
}

function pullGrav(x) {
	alert("Soon.")
	return

	if (ghSave.gravitons.cur) return
	if (!ghSave.gravitons.well[x] && !confirm("On entering this depth, some nerfs will be applied in a Gravity Well.")) return
	ghSave.gravitons.cur = x
	bosonicLabReset()
}

function compGrav() {
	let cur = ghSave.gravitons.cur
	ghSave.gravitons.cur = 0
	ghSave.gravitons.well[cur] = (ghSave.gravitons.well[cur] || 0) + 1
}

function exchangeGrav(x, y) {
	ghSave.gravitons.slot[x] = y
	ghSave.gravitons.his.push([[...ghSave.gravitons.well], x, y])
	//WIP
}

function rollbackGrav(x) {
	alert("Soon.")
}

function gravLength() {
	return 3
}

//Temp and Displays
function updateGravitonsTemp() {
	let data = {}
	let save = ghSave && ghSave.gravitons
	tmp.gv = data
	if (!save || !save.unl) return

	//gain
	data.gain = E(0)
}

function updateGravitonsTab() {
	el("gw_rollback").style.display = ghSave.gravitons.his ? "" : "none"
	el("gw_exit").style.display = ghSave.gravitons.cur ? "" : "none"
	el("gw_replace").style.display = "none"
}
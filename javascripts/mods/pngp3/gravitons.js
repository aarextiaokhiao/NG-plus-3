//Core
function doGravitonsUnlockStuff(){
	ghSave.gravitons.unl=true
	ngp3_feature_notify("gw")
	updateBLParticleUnlocks()
	updateTemp()
}

function getBrandNewGravitonsData() {
	return {
		unl: false,
		amount: E(0),
		cur: 0,
		slot: [],
		well: {}
	}
}

//Functions
function hasGrav(x) {
	return false
}

function getGrav(x, type) {
	return tmp.gv.core[x][type + "eff"]
}

function exitGrav() {
	if (!ghSave.gravitons.cur) return
	if (!confirm("You will exit a Gravity Well with no reward. Are you sure?")) return
	ghSave.gravitons.cur = 0
	bosonicLabReset()
}

function pullGrav(x) {
	if (ghSave.gravitons.cur) return
	ghSave.gravitons.cur = x
	bosonicLabReset()
}

function compGrav() {
	let cur = ghSave.gravitons.cur
	ghSave.gravitons.cur = 0
	ghSave.gravitons.well[cur] = (ghSave.gravitons.well[cur] || 0) + 1
}

function exchangeGrav(x) {
	//Soon.
}

//Temp
function updateGravitonsTemp() {
	let data = {}
	let save = ghSave && ghSave.gravitons
	tmp.gv = data
	if (!save || !save.unl) return

	//gain
	data.gain = E(0)
}

//Displays
function updateGravitonsTab() {
	return
}
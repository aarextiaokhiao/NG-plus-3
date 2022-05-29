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
        best: E(0)
	}
}

//Functions
function hasGrav(x) {
	return false
}

function getGrav(x, type) {
	return tmp.gv.core[x][type + "eff"]
}

function respecGv() {
	if (!confirm("This will perform a Higgs reset. Are you sure?")) return
	bosonicLabReset()
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
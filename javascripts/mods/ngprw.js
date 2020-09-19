//NG+: Reworked
function changeNGPLayer() {
	let elem = document.getElementById("ngpLayer")
	let value = elem.value
	if (value != Math.round(value)) elem.value = Math.round(value)
	if (elem.value > getMaxNGPlusLayer()) elem.value = getMaxNGPlusLayer()
	else if (elem.value < 0) elem.value = 0
}

function getMaxNGPlusLayer() {
	return metaSave.ngPlusLayer || 1
}

function checkForNextNGPLayer() {
	return player.aarexModifications.ngpReworked == getMaxNGPlusLayer() && player.eternityPoints.gte("1e4000") && !inEasierMode()
}

function unlockNextNGPLayer() {
	metaSave.ngPlusLayer = getMaxNGPlusLayer() + 1
	console.log("REACHED NG+ REWORKED RESET MODE #" + metaSave.ngPlusLayer)
	document.getElementById("welcomeMessage").innerHTML = "Congratulations, you reached the end of reset #" + (metaSave.ngPlusLayer - 1) + " mode for the first time! You have unlocked reset #" + metaSave.ngPlusLayer + " mode of NG+ Reworked! You can either hard reset the game or create a new save to start this mode."
	localStorage.setItem(metaSaveId,btoa(JSON.stringify(metaSave)))
}
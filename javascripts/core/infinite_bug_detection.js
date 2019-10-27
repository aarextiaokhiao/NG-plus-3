function detectInfinite(part) {
	if (part !== undefined) return isNaN(Decimal.log10(part))
	return detectInfinite(player.money) || detectInfinite(player.infinityPoints) || detectInfinite(player.eternityPoints) || detectInfinite(player.dilation.dilatedTime)
}

var infiniteDetected = false
var infiniteCheck = false
var infiniteCheck2 = false
var infiniteSave
function isInfiniteDetected() {
	if (infiniteDetected) return
	if (detectInfinite()) {
		infiniteDetected = true
		exportInfiniteSave()
		reload()
		infiniteDetected = false
		if (document.getElementById("welcome").style.display != "flex") document.getElementById("welcome").style.display = "flex"
		if (infiniteCheck2) document.getElementById("welcomeMessage").innerHTML = "I'm terribly sorry, but there has been an Infinite bug detected within your save file, which is why said save file will get reset. Luckily, you can export your save before this reset. Thanks! :)"
		else {
			document.getElementById("welcomeMessage").innerHTML = "I'm sorry, but you got an Infinite bug. Because of this, your save is reverted to your last saved progress. It is recommended to post how did you got this bug. Thanks! :)"
			infiniteCheck2 = true
		}
		return true
	}
}

function exportInfiniteSave() {
	infiniteSave = btoa(JSON.stringify(player))
	document.getElementById("bugExport").style.display = ""
	bugExport()
}

function bugExport() {
	let output = document.getElementById('output');
	let parent = output.parentElement;

	parent.style.display = "";
	output.value = infiniteSave;

	output.onblur = function() {
		parent.style.display = "none";
	}

	output.focus()
	output.select()

	try {
		if (document.execCommand('copy')) {
			$.notify("Exported to clipboard", "info");
			output.blur()
			output.onblur()
		}
	} catch(ex) {
		// well, we tried.
	}
}
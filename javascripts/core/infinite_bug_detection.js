function detectInfinite() {
	return isNaN(Decimal.log10(player.money))
}

var infiniteDetected = false
var infiniteCheck = false
var infiniteSave
function isInfiniteDetected() {
	if (infiniteDetected) return
	if (detectInfinite()) {
		infiniteDetected = true
		exportInfiniteSave()
		reload()
		if (document.getElementById("welcome").style.display != "flex") document.getElementById("welcome").style.display = "flex"
		document.getElementById("welcomeMessage").innerHTML = "I'm sorry, but you got an Infinite bug. Because of this, your save is reverted to your last saved progress. It is recommended to post how did you got this bug. Thanks! :)"
		infiniteDetected = false
	}
}

function exportInfiniteSave() {
	infiniteSave = btoa(JSON.stringify(player))
	document.getElementById("bugExport").parentElement.parentElement.parentElement.style.display = ""
	bugExport()
}

function bugExport() {
	let output = document.getElementById('bugExportOutput');
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
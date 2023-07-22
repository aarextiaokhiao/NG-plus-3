function updateConvertSave(convertMod) {
	var convert;
	var conversionText;
	if (convertMod === "NG+3") {
		convert = true;
		conversionText = "Convert to NG+3";
	} else if (convertMod === "NGUdS'") {
		convert = true;
		conversionText = "Convert to NGUdS'";
	} else convert = false;
	el("convertSave").style.display = convert ? "" : "none";
	el("convertSave").textContent = conversionText;
}

function eligibleConvert() {
	if (mod.ngpp == 2 && !player.dilation.studies.includes(1)) convert = "NGUdS'"
	if (!mod.ngp3 && !inEasierMode() && !aarMod.ersVersion) {
		if (mod.ngud) convert = "NGUdS'"
		else convert = "NG+3"
	} else convert = undefined
	return convert
}

function convertSave(conversion) {
	if (conversion) {
		if (!confirm("Upon converting to " + conversion + ", this save will no longer be able to be reverted back into its original state. It is recommended to export before converting, so that you don't lose anything upon conversion.")) return
		clearInterval(gameLoopIntervalId);

		if (!player.meta) doNGPlusTwoNewPlayer();
		doNGPlusThreeNewPlayer();
		if (conversion === "NGUdS'") doNGUDSemiprimePlayer()
		set_save(meta.save.current, player);
		reload();
		$.notify("Conversion successful", "success");
	}
}

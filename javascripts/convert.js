function updateConvertSave(convertMod) {
	var convert;
	var conversionText;
	if (convertMod === "NG+3.1") {
		convert = true;
		conversionText = "Migrate to NG+3.1";
	} else if (convertMod === "NG+3") {
		convert = true;
		conversionText = "Convert to NG+3";
	} else
		convert = false;
	document.getElementById("convertSave").style.display = convert ? "" : "none";
	document.getElementById("convertSave").textContent = conversionText;
}

function eligibleConvert() {
	if (aarMod.newGame3PlusVersion == undefined && (player.galacticSacrifice || player.tickspeedBoosts || player.pSac) == undefined && (aarMod.newGameMult || aarMod.newGameExpVersion) == undefined && (aarMod.newGameUpdateVersion == undefined) && (aarMod.ngexV == undefined) && (aarMod.ersVersion || aarMod.irsVersion) == undefined) {
		convert = "NG+3";
	} else
		convert = undefined;
	return convert;
}

function convertSave(conversion) {
	if (conversion === "NG+3") {
		if (!confirm("Upon converting to NG+3, this save will no longer be able to be reverted back into its original state. It is recommended to export before converting, so that you don't lose anything upon conversion. Are you sure you want to convert this save to NG+3?"))
			return;
		clearInterval(gameLoopIntervalId);
		doNGPlusTwoNewPlayer();
		doNGPlusThreeNewPlayer();
		set_save(metaSave.current, player);
		reload();
		$.notify("Conversion successful", "success");
	}
}

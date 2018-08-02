function getDilationMetaDimensionMultiplier () {
  return player.dilation.dilatedTime.div(1e40).pow(.1).plus(1);
}

function getMetaDimensionMultiplier (tier) {
  if (player.currentEternityChall === "eterc11") {
    return new Decimal(1);
  }
  let power = player.dilation.upgrades.includes("ngpp4") ? getDil15Bonus() : 2
  let multiplier = Decimal.pow(power, Math.floor(player.meta[tier].bought / 10)).times(Decimal.pow(power*(player.achievements.includes("ngpp14")?1.01:1), Math.max(0, player.meta.resets - tier + 1))).times(getDilationMetaDimensionMultiplier());
  if (player.dilation.upgrades.includes("ngpp13")) {
    multiplier = multiplier.times(getDil14Bonus());
  }
  if (player.achievements.includes("ngpp12")) multiplier = multiplier.times(1.1)
  if (player.masterystudies) if (player.masterystudies.includes("t262")) multiplier = multiplier.times(getTS262Mult())
  
  if (multiplier.lt(1)) multiplier = new Decimal(1)
  if (player.dilation.active || player.aarexModifications.newGameMinusMinusVersion) {
    multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 0.75))
    if (player.dilation.upgrades.includes(11)) {
      multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 1.05))
    }
  }

  return multiplier;
}

function getMetaDimensionDescription(tier) {
  if (tier > Math.min(7, player.meta.resets + 3)) return getFullExpansion(player.meta[tier].bought) + ' (' + dimMetaBought(tier) + ')';
  else return shortenDimensions(player.meta[tier].amount) + ' (' + dimMetaBought(tier) + ')  (+' + formatValue(player.options.notation, getMetaDimensionRateOfChange(tier), 2, 2) + '%/s)';
}

function getMetaDimensionRateOfChange(tier) {
  let toGain = getMetaDimensionProduction(tier + 1);

  var current = player.meta[tier].amount.max(1);
  var change  = toGain.times(10).dividedBy(current);

  return change;
}

function canBuyMetaDimension(tier) {
    if (tier > player.meta.resets + 4) return false;
    if (tier > 1 && player.meta[tier - 1].amount.eq(0)) return false;
    return true;
}

function clearMetaDimensions () {
    for (i = 1; i <= 8; i++) {
        player.meta[i].amount = new Decimal(0);
        player.meta[i].bought = 0;
        player.meta[i].cost = new Decimal(initCost[i]);
    }
}

function getMetaShiftRequirement () {
  return {
    tier: Math.min(8, player.meta.resets + 4),
    amount: Math.max(20, -40 + 15 * player.meta.resets)
  }
}

function metaBoost() {
    let req = getMetaShiftRequirement();
    if (player.meta[req.tier].bought<req.amount) {
        return false;
    }
    player.meta.resets++;
    if (player.meta.resets>9) giveAchievement("Meta-boosting to the max")
    player.meta.antimatter = new Decimal(player.achievements.includes("ngpp12")?100:10);
    clearMetaDimensions();
    for (let i = 2; i <= 8; i++) {
      document.getElementById(i + "MetaRow").style.display = "none"
    }
    return true;
}


function getMetaDimensionCostMultiplier(tier) {
    return costMults[tier];
}

function dimMetaBought(tier) {
	return player.meta[tier].bought % 10;
}

function metaBuyOneDimension(tier) {
    var cost = player.meta[tier].cost;
    if (!canBuyMetaDimension(tier)) {
        return false;
    }
    if (!canAffordMetaDimension(cost)) {
        return false;
    }
    player.meta.antimatter = player.meta.antimatter.minus(cost);
    player.meta[tier].amount = player.meta[tier].amount.plus(1);
    player.meta[tier].bought++;
    if (player.meta[tier].bought === 10) {
        player.meta[tier].cost = player.meta[tier].cost.times(getMetaDimensionCostMultiplier(tier));
    }
    if (tier>7) giveAchievement("And still no ninth dimension...")
    return true;
}

function getMetaMaxCost(tier) {
  return player.meta[tier].cost.times(10 - dimMetaBought(tier));
}

function metaBuyManyDimension(tier) {
    var cost = getMetaMaxCost(tier);
    if (!canBuyMetaDimension(tier)) {
        return false;
    }
    if (!canAffordMetaDimension(cost)) {
        return false;
    }
    player.meta.antimatter = player.meta.antimatter.minus(cost);
    player.meta[tier].amount = player.meta[tier].amount.plus(10 - dimMetaBought(tier));
    player.meta[tier].cost = player.meta[tier].cost.times(getMetaDimensionCostMultiplier(tier));
    player.meta[tier].bought += 10 - dimMetaBought(tier)
    if (tier>7) giveAchievement("And still no ninth dimension...")
    return true;
}

function canAffordMetaDimension(cost) {
    return cost.lte(player.meta.antimatter);
}

for (let i = 1; i <= 8; i++) {
    document.getElementById("meta" + i).onclick = function () {
        metaBuyOneDimension(i);
    }
    document.getElementById("metaMax" + i).onclick = function () {
        metaBuyManyDimension(i);
    }
}

document.getElementById("metaMaxAll").onclick = function () {
    for (let i = 1; i <= 8; i++) {
      while (metaBuyManyDimension(i)) {};
    }
}

document.getElementById("metaSoftReset").onclick = function () {
    metaBoost();
}

function getMetaDimensionProduction(tier) {
    return Decimal.floor(player.meta[tier].amount).times(getMetaDimensionMultiplier(tier));
}

function getExtraDimensionBoostPower() {
	return player.meta.bestAntimatter.pow(player.dilation.upgrades.includes("ngpp5") ? 10 : 8).plus(1)
}

function getDil14Bonus () {
	return 1 + Math.log10(1 - Math.min(0, player.tickspeed.log(10)));
}

function getDil17Bonus () {
	return Math.log10(player.meta.bestAntimatter);
}

function updateMetaDimensions () {
	document.getElementById("metaAntimatterAmount").textContent = shortenMoney(player.meta.antimatter);
	document.getElementById("metaAntimatterBest").textContent = shortenMoney(player.meta.bestAntimatter);
	document.getElementById("metaAntimatterEffect").textContent = shortenMoney(getExtraDimensionBoostPower())
	document.getElementById("metaAntimatterPerSec").textContent = 'You are getting ' + shortenDimensions(getMetaDimensionProduction(1)) + ' meta-antimatter per second.';
	for (let tier = 1; tier <= 8; ++tier) {
		if (!canBuyMetaDimension(tier) && document.getElementById(tier + "MetaRow").style.display !== "table-row") {
			break;
		}
		document.getElementById(tier + "MetaD").childNodes[0].nodeValue = DISPLAY_NAMES[tier] + " Meta Dimension x" + formatValue(player.options.notation, getMetaDimensionMultiplier(tier), 1, 1);
		document.getElementById("meta" + tier + "Amount").textContent = getMetaDimensionDescription(tier);
	}
	for (let tier = 1; tier <= 8; ++tier) {
		if (!canBuyMetaDimension(tier)) {
			break;
		}
		document.getElementById(tier + "MetaRow").style.display = "table-row";
		document.getElementById(tier + "MetaRow").style.visibility = "visible";
	}
	for (let tier = 1; tier <= 8; ++tier) {
		document.getElementById('meta' + tier).className = canAffordMetaDimension(player.meta[tier].cost) ? 'storebtn' : 'unavailablebtn';
		document.getElementById('metaMax' + tier).className = canAffordMetaDimension(getMetaMaxCost(tier)) ? 'storebtn' : 'unavailablebtn';
	}
	var isMetaShift = player.meta.resets < 4
	var metaShiftRequirement = getMetaShiftRequirement()
        document.getElementById("metaResetLabel").textContent = 'Meta-Dimension ' + (isMetaShift ? "Shift" : "Boost") + ' ('+ getFullExpansion(player.meta.resets) +'): requires ' + getFullExpansion(metaShiftRequirement.amount) + " " + DISPLAY_NAMES[metaShiftRequirement.tier] + " Meta Dimensions"
        document.getElementById("metaSoftReset").textContent = "Reset meta-dimensions for " + (isMetaShift ? "a new dimension" : "the boost")
	if (player.meta[metaShiftRequirement.tier].bought >= metaShiftRequirement.amount) {
		document.getElementById("metaSoftReset").className = 'storebtn';
	} else {
		document.getElementById("metaSoftReset").className = 'unavailablebtn';
	}
}

// v2.2
function updateAutoEterMode() {
	if (player.autoEterMode == "time") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: time"
		document.getElementById("eterlimittext").textContent = "Seconds between eternities:"
	} else if (player.autoEterMode == "relative") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: X times last eternity"
		document.getElementById("eterlimittext").textContent = "X times last eternity:"
	} else if (player.autoEterMode == "relativebest") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: X times best of last 10"
        document.getElementById("eterlimittext").textContent = "X times best of last 10 eternities:"
	} else if (player.autoEterMode == "replicanti") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: replicanti"
		document.getElementById("eterlimittext").textContent = "Amount of replicanti to wait until reset:"
	} else if (player.autoEterMode == "peak") {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: peak"
		document.getElementById("eterlimittext").textContent = "Seconds to wait after latest peak gain:"
	} else {
		document.getElementById("toggleautoetermode").textContent = "Auto eternity mode: amount"
		document.getElementById("eterlimittext").textContent = "Amount of EP to wait until reset:"
	}
}

function toggleAutoEterMode() {
	if (player.autoEterMode == "amount") player.autoEterMode = "time"
	else if (player.autoEterMode == "time") player.autoEterMode = "relative"
	else if (player.autoEterMode == "relative") player.autoEterMode = "relativebest"
	else if (player.autoEterMode == "relativebest" && player.dilation.upgrades.includes("ngpp3") && player.eternities >= 4e11 && player.aarexModifications.newGame3PlusVersion) player.autoEterMode = "replicanti"
	else if (player.autoEterMode == "replicanti" && player.eternities >= 1e13) player.autoEterMode = "peak"
	else if (player.autoEterMode) player.autoEterMode = "amount"
	updateAutoEterMode()
}

// v2.21
function getDil15Bonus () {
	return Math.log10(player.dilation.dilatedTime.max(1e10).min(1e100).log(10)) + 1;
}

// v2.3
function toggleAllTimeDims() {
	var turnOn
	var id=1
	while (id<9&&turnOn===undefined) {
		if (!player.autoEterOptions["td"+id]) turnOn=true
		else if (id>7) turnOn=false
		id++
	}
	for (id=1;id<9;id++) {
		player.autoEterOptions["td"+id]=turnOn
		document.getElementById("td"+id+'auto').textContent="Auto: O"+(turnOn?"N":"FF")
	}
}

function toggleAutoEter(id) {
	player.autoEterOptions[id]=!player.autoEterOptions[id]
	document.getElementById(id+'auto').textContent="Auto: O"+(player.autoEterOptions[id]?"N":"FF")
}

function doAutoEterTick() {
	if (player.achievements.includes("ngpp17")) {
		for (d=1;d<9;d++) if (player.autoEterOptions["td"+d]) while (buyTimeDimension(d)) {}
		if (player.autoEterOptions.epmult) buyMaxEPMult()
	}
}

// v2.301
function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk=!player.galaxyMaxBulk
	document.getElementById('replicantibulkmodetoggle').textContent="Mode: "+(player.galaxyMaxBulk?"Max":"Singles")
}
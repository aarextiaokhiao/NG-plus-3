function displayMainStats() {
	el("totalmoney").textContent = 'You have made a total of ' + shortenMoney(player.totalmoney) + ' antimatter.'
	el("totalresets").textContent = 'You have performed ' + getFullExpansion(player.resets) + ' Dimension Boosts/Shifts.'
	el("tdboosts").textContent = inNGM(4) ? 'You have performed ' + getFullExpansion(player.tdBoosts) + ' Time Dimension Boosts/Shifts.':""
	var showBoosts=isTickspeedBoostPossible()
	el("boosts").style.display = showBoosts ? '' : 'none'
	if (showBoosts) el("boosts").textContent = 'You have performed '+getFullExpansion(player.tickspeedBoosts)+' Tickspeed Boosts.'
	el("galaxies").textContent = 'You have ' + getFullExpansion(player.galaxies) + ' Antimatter Galaxies.'
	el("totalTime").textContent = "You have played for " + timeDisplay(player.totalTimePlayed) + "."
}

function displayInfinityStats(){
	el("thisInfinity").textContent = "You have spent " + timeDisplay(player.thisInfinityTime) + " in this Infinity."
	el("bestInfinity").textContent = player.bestInfinityTime < 9999999999 ? "Your fastest Infinity is " + timeDisplay(player.bestInfinityTime) + "." : ""
	el("infinitied").textContent = "You have Infinitied " + getFullExpansion(player.infinitied) + " time" + (player.infinitied == 1 ? "" : "s") + (player.eternities !== 0 || player.eternitiesBank > 0 ? " this Eternity." : ".")
}

function bankedInfinityDisplay(){
	el("infinitiedBank").style.display = (player.infinitiedBank > 0) ? "block" : "none"
	el("infinitiedBank").textContent = "You have " + getFullExpansion(player.infinitiedBank) + " banked Infinities."
	var bankedInfGain=gainBankedInf()
	el("bankedInfGain").style.display = bankedInfGain>0 ? "block" : "none"
	el("bankedInfGain").textContent = "You will gain " + getFullExpansion(bankedInfGain) + " banked Infinities on next Eternity."
	if (hasAch("ng3p72")) updateBankedEter(true)
}

function displayEternityStats() {
	/* ETERNITY */
	el("thisEternity").textContent = "You have spent " + timeDisplay(player.thisEternity) + " in this Eternity."
	el("bestEternity").textContent = player.bestEternityTime < 9999999999 ? "Your fastest Eternity is " + timeDisplay(player.bestEternityTime) + "." : ""
	el("eternitied").textContent = "You have Eternitied " + getFullExpansion(player.eternities) + " time" + (player.eternities == 1 ? "" : "s") + (quantumed ? " this Quantum." : ".")

	/* DILATION */
	let dil = hasAch("r136")
	el("stats_dil").style.display = dil ? "" : "none"
	if (dil) {
		el("bestmoneydilation").textContent = player.dilation.best ? "Your best antimatter in Dilation is " + shortenMoney(player.dilation.best) + "." : ""
		el("dilated").textContent = "You have succesfully Dilated "+getFullExpansion(player.dilation.times)+" times."
		el("exdilated").textContent = exdilated() ? "You have reversed Dilation " + getFullExpansion(player.exdilation.times) + " times." : ""
	}
}

function displayQuantumStats() {
	el("quantumed").textContent = "You have gone Quantum " + getFullExpansion(quSave.times) + " time" + (quSave.times == 1 ? "" : "s") + (ghostified ? " this Fundament." : ".")
	el("thisQuantum").textContent = "You have spent " + timeDisplay(quSave.time) + " in this Quantum."
	el("bestQuantum").textContent = quSave.best < 9999999999 ? "Your fastest Quantum is in " + timeDisplay(quSave.best) + "." : ""

	let br = hasAch("ng3p51")
	el("stats_br").style.display = br ? "" : "none"
	if (br) {
		setAndMaybeShow("bigRipped", brSave.times, '"You have big ripped the universe " + getFullExpansion(brSave.times) + " time" + (brSave.times == 1 ? "" : "s") + "."')
		setAndMaybeShow("bestmoneythisrip", bigRipped(), "'Your best antimatter for this Big Rip is ' + shortenMoney(brSave.bestThisRun) + '.'")
		el("totalmoneybigrip").textContent = 'You have made a total of ' + shortenMoney(brSave.totalAntimatter) + ' antimatter in all Big Rips.'
		el("bestgalsbigrip").textContent = `You reformed a best-ever of ${getFullExpansion(brSave.bestGals)} Antimatter Galaxies in Big Rips.`
	}
}

function bestGhostifyDisplay(){
	el("ghostified").textContent = "You have enlarged " + getFullExpansion(ghSave.times) + " time" + (ghSave.times == 1 ? "" : "s") +"."
	el("thisGhostify").textContent = "You have spent " + timeDisplay(ghSave.time) + " in this Fundament."
	el("lowestGhostify").textContent = "Your lowest Quantum times on any Fundament is " + getFullExpansion(ghSave.low) + "."
	el("bestGhostify").textContent = "Your fastest Fundament is in " + timeDisplay(ghSave.best) + "."
}

function scienceNumberDisplay(){
	var scale1 = [2.82e-45,1e-42,7.23e-30,5e-21,9e-17,6.2e-11,5e-8,3.555e-6,7.5e-4,1,2.5e3,2.6006e6,3.3e8,5e12,4.5e17,1.08e21,1.53e24,1.41e27,5e32,8e36,1.7e45,1.7e48,3.3e55,3.3e61,5e68,1e73,3.4e80,1e113,Number.MAX_VALUE,E("1e65000")];
	var scale2 = [" protons."," nucleui."," Hydrogen atoms."," viruses."," red blood cells."," grains of sand."," grains of rice."," teaspoons."," wine bottles."," fridge-freezers."," Olympic-sized swimming pools."," Great Pyramids of Giza."," Great Walls of China."," large asteroids.",
					" dwarf planets."," Earths."," Jupiters."," Suns."," red giants."," hypergiant stars."," nebulas."," Oort clouds."," Local Bubbles."," galaxies."," Local Groups."," Sculptor Voids."," observable universes."," Dimensions.", " Infinity Dimensions.", " Time Dimensions."];
	var id = 0;
	if (player.money.mul(4.22419).gt(2.82e60)) {
		if (player.money.mul(4.22419e-105).gt(scale1[scale1.length - 1])) id = scale1.length - 1;
		else {
			while (player.money.mul(4.22419e-105).gt(scale1[id])) id++;
			if (id > 0) id--;
		}
		if (id >= 7 && id < 11) el("infoScale").textContent = "If every antimatter were a planck volume, you would have enough to fill " + formatValue(player.options.notation, player.money * 4.22419e-105 / scale1[id], 2, 1) + scale2[id];
		else el("infoScale").textContent = "If every antimatter were a planck volume, you would have enough to make " + formatValue(player.options.notation, player.money.mul(4.22419e-105).dividedBy(scale1[id]), 2, 1) + scale2[id];
	} else { //does this part work correctly? i doubt it does
		if (player.money.lt(2.82e9)) el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, 2.82e9 / player.money, 2, 1) + " attometers cubed, you would have enough to make a proton."
		else if (player.money.lt(2.82e18)) el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, 2.82e18 / player.money, 2, 1) + " zeptometers cubed, you would have enough to make a proton."
		else if (player.money.lt(2.82e27)) el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, 2.82e27 / player.money, 2, 1) + " yoctometers cubed, you would have enough to make a proton."
		else el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, (2.82e-45 / 4.22419e-105 / player.money), 2, 1) + " planck volumes, you would have enough to make a proton."
	}
}

function eventsTimeDisplay(years, thisYear){
	var bc = years - thisYear + 1
	var since
	var sinceYears
	var dates = [5.332e6, 3.5e6,	2.58e6, 7.81e5, 3.15e5, 
		 2.5e5,	 1.95e5, 1.6e5,	1.25e5, 7e4, 
		 6.7e4,	 5e4,	 4.5e4,	4e4,	 3.5e4, 
		 3.3e4,	 3.1e4,	2.9e4,	2.8e4,	2e4, 
		 1.6e4,	 1.5e4,	1.4e4,	11600, 1e4,
		 8e3,		6e3,	 5e3,	 4e3,	 3200,
		 3000,	 2600,	2500,	2300,	1800,
		 1400,	 1175,	800,	 753,	 653,
		 539,		356,	 200,	 4,		 0]
	var events = ["start of Pliocene epoch", "birthdate of Lucy (typical Australopithicus afarensis female)", "Quaternary period", "Calabrian age", "first alleged appearance of Homo sapiens",
		"first alleged appearance of Homo neanderthalensis", "emergence of anatomically modern humans", "first alleged appearance of Homo sapiens idaltu", "peak of Eemian interglacial period", "earliest abstract/symbolic art",
		"Upper Paleolithic", "Late Stone Age", "European early modern humans", "first human settlement", "oldest known figurative art",
		"oldest known domesticated dog", "Last Glacial Maximum", "oldest ovens", "oldest known twisted rope", "oldest human permanent settlement (hamlet considering to be built of rocks and of mammoth bones)",
		"rise of Kerberan culture", "colonization of North America", "domestication of the pig", "prehistoric warfare", "Holocene",
		"death of other human breeds", "agricultural revolution", "farmers arrived in Europe", "first metal tools", "first horse",
		"Sumerian cuneiform writing system", "union of Egypt", "rise of Maya", "extinct of mammoths", "rise of Akkadian Empire",
		"first alphabetic writing", "rise of Olmec civilization", "end of bronze age", "rise of Greek city-states", "rise of Rome",
		"rise of Persian Empire", "fall of Babylonian Empire", "birth of Alexander the Great", "first papers", "birth of Jesus Christ"]
	/*
	"the homo sapiens" is weird, as is "the homo neanderthaliensis" and "the homo sapiens idaltu"
	*/
	var index = 0
	for (var i = 0; i < dates.length; i++){
		if (bc > dates[i]) {
			index = i
			break
		}
	} // dates[index] < bc <= dates[index-1] 
	if (index > 0) { //bc is less than or equal to 5.332e6 (5332e3)
		since = events[index - 1]
		sinceYears = bc - dates[index]
	}
	var message = "<br>If you wanted to finish writing out your full antimatter amount at a rate of 3 digits per second, you would need to start it in " 
	message += getFullExpansion(Math.floor(bc)) + " BC." + (since ? "<br>This is around " + getFullExpansion(Math.ceil(sinceYears)) + " years before the " + since + "." : "")
	el("infoScale").innerHTML = message
}

function universesTimeDisplay(years){
	var message = "<br>The time needed to finish writing your full antimatter amount at a rate of 3 digits per second would span "
	let unis = years / 13.78e9 
	// 13.78 Billion years as measured by the CMB (cosmic microwave background) and various models, feel free to change if more accurate data comes along
	let timebit 
	let end = "% of another."
	if (unis < 1) timebit = (unis * 100).toFixed(3) + "% of a universe."
	else if (unis < 2) timebit = "1 universe and " + (unis * 100 - 100).toFixed(3) + end
	else timebit = getFullExpansion(Math.floor(unis)) + " universes and " + (unis * 100 - 100 * Math.floor(unis)).toFixed(3) + end
	el("infoScale").innerHTML = message + timebit
}

function lifetimeTimeDisplay(years){
	var message = "<br>If you wrote 3 digits of your full antimatter amount every second since you were born as an American,<br> you would "
	if (years > 79.3) message += "be a ghost for " + ((years - 79.3) / years * 100).toFixed(3) + "% of the session."
	else message += "waste " + (years / 0.793).toFixed(3) + "% of your projected average lifespan."
	el("infoScale").innerHTML = message
}

function infoScaleDisplay(){
	if (aarMod.hideRepresentation) el("infoScale").textContent=""
	else if (player.money.gt(pow10(3 * 86400 * 365.2425 * 79.3 / 10))) {
		var years = player.money.log10() / 3 / 86400 / 365.2425
		var thisYear = new Date().getFullYear() || 2020
		if (years >= 1e13){
			el("infoScale").innerHTML = "<br>The time needed to finish writing your full antimatter amount at a rate of 3 digits per second would span " + Decimal.div(years, 1e12).toFixed(2) + " trillion years."
		} else if (years >= 1e9) {
			universesTimeDisplay(years)
		} else if (years > 1e7) {
			el("infoScale").innerHTML = "<br>The time needed to finish writing your full antimatter amount at a rate of 3 digits per second would span " + Decimal.div(years, 1e6).toFixed(2) + " million years."
		} else if (years >= thisYear) { 
			eventsTimeDisplay(years, thisYear)
		} else {
			lifetimeTimeDisplay(years)
		}
	}
	else if (player.money.log10() > 1e5) el("infoScale").innerHTML = "<br>If you wrote 3 numbers a second, it would take you <br>" + timeDisplay(player.money.log10() * 10 / 3) + "<br> to write down your antimatter amount."
	else scienceNumberDisplay()
}
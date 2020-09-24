function canBreakInfinity() {
	if (player.aarexModifications.ngexV) return player.challenges.length == getTotalNormalChallenges() + 1
	return player.autobuyers[11] % 1 != 0 && player.autobuyers[11].interval <= 100
}

function breakInfinity() {
	if (!canBreakInfinity()) return false
	if (player.break && !player.currentChallenge.includes("post")) {
		player.break = false
		document.getElementById("break").textContent = "BREAK INFINITY"
	} else {
		player.break = true
		document.getElementById("break").textContent = "FIX INFINITY"
	}
	if (player.galacticSacrifice) if (player.eternities==0&&player.infinityPoints.lt(Number.MAX_VALUE)&&!quantumed) {
		document.getElementById("quantumBlock").style.display=player.break?"":"none"
		document.getElementById("sacpos").className=player.break?"quantumpos":"eterpos"
		document.getElementById("galaxyPoints2").className=player.break?"QK":"EP"
	}
}

function onPostBreak() {
	return (player.break && inNC(0)) || player.currentChallenge.includes("p")
}

function getInfinityPointGain(){
	return gainedInfinityPoints()
}

function getIPGain(){
	return gainedInfinityPoints()
}

function gainedInfinityPoints(next) {
	let div = 308;
	if (player.timestudy.studies.includes(111)) div = 285;
	else if (player.achievements.includes("r103")) div = 307.8;
	if (player.galacticSacrifice && player.tickspeedBoosts == undefined) div -= galIP()

	if (player.infinityUpgradesRespecced == undefined) var ret = Decimal.pow(10, player.money.e / div - 0.75).times(getIPMult())
	else var ret = player.money.div(Number.MAX_VALUE).pow(2 * (1 - Math.log10(2)) / Decimal.log10(Number.MAX_VALUE)).times(getIPMult())
	if (player.timestudy.studies.includes(41)) ret = ret.times(Decimal.pow(tsMults[41](), player.galaxies + player.replicanti.galaxies))
	if (player.timestudy.studies.includes(51)) ret = ret.times(player.aarexModifications.newGameExpVersion?1e30:1e15)
	if (player.timestudy.studies.includes(141)) ret = ret.times(new Decimal(1e45).dividedBy(Decimal.pow(15, Math.log(player.thisInfinityTime+1)*Math.pow(player.thisInfinityTime+1, 0.125))).max(1))
	if (player.timestudy.studies.includes(142)) ret = ret.times(1e25)
	if (player.timestudy.studies.includes(143)) ret = ret.times(Decimal.pow(15, Math.log(player.thisInfinityTime+1)*Math.pow(player.thisInfinityTime+1, 0.125)))
	if (player.achievements.includes("r116")) ret = ret.times(Decimal.add(getInfinitied(), 1).pow(Math.log10(2)))
	if (player.achievements.includes("r125")) ret = ret.times(Decimal.pow(2, Math.log(player.thisInfinityTime+1)*Math.pow(player.thisInfinityTime+1, 0.11)))
	if (player.dilation.upgrades.includes(7)) ret = ret.times(player.dilation.dilatedTime.max(1).pow(1000))
	if (player.boughtDims) {
		ret = ret.times(Decimal.pow(Math.max(1e4/player.thisInfinityTime),player.timestudy.ers_studies[5]+(next==5?1:0)))
		ret = ret.times(Decimal.pow(player.thisInfinityTime/10,player.timestudy.ers_studies[6]+(next==6?1:0)))
	}
	if (isBigRipUpgradeActive(4)) ret = ret.times(player.replicanti.amount.pow(0.34).max(1))
	if (player.tickspeedBoosts != undefined && player.achievements.includes("r95") && player.eightAmount > 5000) ret = ret.times(Decimal.pow(player.eightAmount, 2))
	return ret.floor()
}

function getIPMult() {
	let mult = player.infMult
	if (player.galacticSacrifice && player.tickspeedBoosts == undefined) {
		if (player.achievements.includes("r85")) mult = mult.times(4)
		if (player.achievements.includes("r93")) mult = mult.times(4)
		if (player.achievements.includes("r43")) mult = mult.times(1.25)
		if (player.achievements.includes("r55")) mult = mult.times(Math.min(Math.log10(Math.max(6000 / player.bestInfinityTime, 10)), 10))
		if (player.achievements.includes("r41")) mult = mult.times(Math.pow(Math.log10(Math.max(player.spreadingCancer, 10)), .05))
		if (player.achievements.includes("r51")) {
			let galaxies = Math.max((player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies), 0) // just in case
			if (galaxies < 5) mult = mult.times(Math.max(galaxies, 1))
			else if (galaxies < 50) mult = mult.times(Decimal.pow(galaxies + 5, 0.5).plus(2))
			else mult = mult.times(Decimal.pow(galaxies, 0.3).plus(7))
		}
	}
	return mult;
}

function toggleCrunchMode(freeze) {
	if (player.autoCrunchMode == "amount") {
		player.autoCrunchMode = "time"
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: time"
		document.getElementById("limittext").textContent = "Seconds between crunches:"
	} else if (player.autoCrunchMode == "time"){
		player.autoCrunchMode = "relative"
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
		document.getElementById("limittext").textContent = "X times last crunch:"
	} else if (player.autoCrunchMode == "relative" && player.boughtDims){
		player.autoCrunchMode = "replicanti"
		document.getElementById("togglecrunchmode").innerHTML = "Auto crunch mode: replicated galaxies"
		document.getElementById("limittext").innerHTML = "Replicanti galaxies needed for crunch:"
		document.getElementById("maxReplicantiCrunchSwitchDiv").style.display = 'inline'
	} else {
		player.autoCrunchMode = "amount"
		document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
		document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
		document.getElementById("maxReplicantiCrunchSwitchDiv").style.display = 'none'
		if (!freeze&&player.autobuyers[11].priority.toString().toLowerCase()=="max") {
			player.autobuyers[11].priority = new Decimal(1)
			document.getElementById("priority12").value=1
		}
	}
}

var bestRunIppm = new Decimal(0)
function updateLastTenRuns() {
	var listed = 0
	var tempBest = 0
	var tempTime = new Decimal(0)
	var tempIP = new Decimal(0)
	bestRunIppm = new Decimal(0)
	for (var i=0; i<10; i++) {
		if (player.lastTenRuns[i][1].gt(0)) {
			var ippm = player.lastTenRuns[i][1].dividedBy(player.lastTenRuns[i][0]/600)
			if (ippm.gt(tempBest)) tempBest = ippm
			var tempstring = shorten(ippm) + " IP/min"
			if (ippm<1) tempstring = shorten(ippm*60) + " IP/hour"
			var msg = "The infinity " + (i == 0 ? '1 infinity' : (i+1) + ' infinities') + " ago took " + timeDisplayShort(player.lastTenRuns[i][0], false, 3)
			if (player.lastTenRuns[i][2]) {
				var split=player.lastTenRuns[i][2].split("challenge")
				if (split[1]==undefined) msg += " in Infinity Challenge " + checkICID(player.lastTenRuns[i][2])
				else msg += " in " + challNames[parseInt(split[1])]
			}
			msg += " and gave " + shortenDimensions(player.lastTenRuns[i][1]) +" IP. "+ tempstring
			document.getElementById("run"+(i+1)).textContent = msg
			tempTime = tempTime.plus(player.lastTenRuns[i][0])
			tempIP = tempIP.plus(player.lastTenRuns[i][1])
			listed++
		} else document.getElementById("run"+(i+1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempIP = tempIP.dividedBy(listed)
		var ippm = tempIP.dividedBy(tempTime/600)
		var tempstring = "(" + shorten(ippm) + " IP/min"
		averageIP = tempIP
		if (ippm < 1) tempstring = "(" + shorten(ippm * 60) + " IP/hour"
		document.getElementById("averagerun").textContent = "Average time of the last " + listed + " Infinities: " + timeDisplayShort(tempTime, false, 3) + " | Average IP gain: " + shortenDimensions(tempIP) + " IP. " + tempstring
		
		if (tempBest.gte(1e8)) giveAchievement("Oh hey, you're still here");
		if (tempBest.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");
		bestRunIppm = tempBest
	} else document.getElementById("averagerun").innerHTML = ""
}

function startChallenge(name) {
	if (name == "postc3" && isIC3Trapped()) return
	if (name == "challenge7" && inQC(4)) return
	if ((name == "postc2" || name == "postc6" || name == "postc7" || name == "postc8") && inQC(6)) return
	if (name.includes("post")) {
		if (player.postChallUnlocked < checkICID(name)) return
		var target = getGoal(name)
	} else var target = new Decimal(Number.MAX_VALUE)
	if (player.options.challConf && name != "") if (!confirm("You will start over with just your Infinity upgrades, and achievements. You need to reach " + (name.includes("post") ? "a set goal" : "infinity") + " with special conditions. The 4th Infinity upgrade column doesn't work on challenges.")) return
	if (player.tickspeedBoosts != undefined) player.tickspeedBoosts = 0
	if (name == "postc1" && player.currentEternityChall != "" && inQC(4) && inQC(6)) giveAchievement("The Ultimate Challenge")
	
	doNormalChallengeResetStuff()
	player.currentChallenge = name
	player.challengeTarget = target
	NC10NDCostsOnReset()
	
	player.tdBoosts = resetTDBoosts()
	resetPSac()
	resetTDs()
	reduceDimCosts()
	if (player.currentChallenge == "postc1") player.costMultipliers = [new Decimal(1e3), new Decimal(5e3), new Decimal(1e4), new Decimal(1.2e4), new Decimal(1.8e4), new Decimal(2.6e4), new Decimal(3.2e4), new Decimal(4.2e4)];
	if (player.currentChallenge == "postc2") {
		player.eightAmount = new Decimal(1);
		player.eightBought = 1;
		player.resets = 4;
	}
	updateNCVisuals()
	
	if (player.infinityUpgradesRespecced != undefined) {
		player.singularity.darkMatter = new Decimal(0)
		player.dimtechs.discounts = 0
	}
	updateSingularity()
	updateDimTechs()
	
	if (player.replicanti.unl) player.replicanti.amount = new Decimal(1)
	player.replicanti.galaxies = 0

	// even if we're in a challenge, apparently if it's challenge 2 we might have four resets anyway.
	setInitialDimensionPower();

	GPminpeak = new Decimal(0)
	IPminpeak = new Decimal(0)
	if (player.currentChallenge.includes("post")) {
		player.break = true
		document.getElementById("break").innerHTML = "FIX INFINITY"
	}
	if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r66")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r83")) player.tickspeed = player.tickspeed.times(Decimal.pow(0.95, player.galaxies));

	showTab('dimensions')
	updateChallenges()
	setInitialMoney()

	resetInfDimensions();
	hideDimensions()
	tmp.tickUpdate = true;

	skipResets()
	if (player.currentChallenge.includes("post") && player.currentEternityChall !== "") giveAchievement("I wish I had gotten 7 eternities")
	Marathon2 = 0;
}

function startNormalChallenge(x) {
	if (x == 7) {
		if (player.infinitied < 1 && player.eternities < 1 && !quantumed) return
		startChallenge("challenge7", Number.MAX_VALUE)
	}
	if (player.aarexModifications.ngmX > 3) galacticSacrifice(false, true, x)
	else startChallenge("challenge" + x, Number.MAX_VALUE)
}

function inNC(x, n) {
	if (x == 6) {
		if (n == 1 && player.aarexModifications.ngexV && (player.currentChallenge == "" || player.currentChallenge.indexOf("postc") == 0) && player.currentChallenge != "postc1") return true
		if (n == 1 && player.aarexModifications.ngexV && player.currentChallenge == "challenge6") return false
		if (n == 2 && !player.aarexModifications.ngexV) return false
	}
	if (x == 0) return player.currentChallenge == "" && (!(player.aarexModifications.ngmX > 3) || !player.galacticSacrifice.chall) && inPxC(0)
	return player.currentChallenge == "challenge" + x || (player.aarexModifications.ngmX > 3 && player.galacticSacrifice.chall == x) || inPxC(x)
}

function getTotalNormalChallenges() {
	let x = 11
	if (player.galacticSacrifice) x += 2
	else if (player.infinityUpgradesRespecced) x++
	if (player.tickspeedBoosts != undefined) x++
	if (player.aarexModifications.ngmX > 3) x++
	return x
}

function updateNCVisuals() {
	var chall = player.currentChallenge

	if (inNC(2) || chall == "postc1" || player.pSac) document.getElementById("chall2Pow").style.display = "inline-block"
	else document.getElementById("chall2Pow").style.display = "none"

	if (inNC(3) || chall == "postc1") document.getElementById("chall3Pow").style.display = "inline-block"
	else document.getElementById("chall3Pow").style.display = "none"

	if (inNC(12) || chall == "postc1" || chall == "postc6" || inQC(6) || player.pSac) document.getElementById("matter").style.display = "block"
	else document.getElementById("matter").style.display = "none"

	if (isADSCRunning()) document.getElementById("chall13Mult").style.display = "block"
	else document.getElementById("chall13Mult").style.display = "none"

	if (inNC(14) && player.aarexModifications.ngmX > 3) document.getElementById("c14Resets").style.display = "block"
	else document.getElementById("c14Resets").style.display = "none"

	if (inNC(6, 2) || inNC(9) || inNC(12) || ((inNC(5) || inNC(14) || chall == "postc4" || chall == "postc5") && player.tickspeedBoosts != undefined) || player.pSac || chall == "postc1" || chall == "postc6" || chall == "postc8") document.getElementById("quickReset").style.display = "inline-block"
	else document.getElementById("quickReset").style.display = "none"
}
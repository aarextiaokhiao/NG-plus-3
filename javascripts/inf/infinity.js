var isEmptiness=false

function canBigCrunch() {
	return (
		!player.currentChallenge.startsWith("post") &&
		player.money.gte(Number.MAX_VALUE)
	) || (
		player.currentChallenge !== "" &&
		player.money.gte(player.challengeTarget)
	)
}

function bigCrunch(auto) {
	if (!canBigCrunch()) return
	if (implosionCheck) return

	if (!auto && player.options.animations.bigCrunch) {
		implosionCheck = 1
		el("body").style.animation = "implode 2s 1"
		setTimeout(function(){ 
			el("body").style.animation = ""
			implosionCheck = 0
		}, 2000)
		setTimeout(doBigCrunch, 1000)
		return
	} else {
		doBigCrunch()
	}
}

function doBigCrunch(auto) {
	//Infinity
	var add = getIPMult()
	if (player.break && player.currentChallenge == "") add = getIPGain()
	else if (hasTimeStudy(51)) add = add.mul(1e15)
	player.infinityPoints = player.infinityPoints.add(add)
	player.bestInfinityTime = player.bestInfinityTime > player.thisInfinityTime ? player.thisInfinityTime : player.bestInfinityTime

	if (auto && autoS) {
		if (getIPGain().dividedBy(player.thisInfinityTime).gt(player.autoIP) && !player.break) player.autoIP = getIPGain().dividedBy(player.thisInfinityTime);
		if (player.thisInfinityTime < player.autoTime) player.autoTime = player.thisInfinityTime;
	}
	auto = autoS; //only allow autoing if prev crunch was auto
	autoS = true;

	doCrunchInfinitiesGain()

	//Times
	var array = [player.thisInfinityTime, add]
	if (player.currentChallenge != "") array.push(player.currentChallenge)
	addTime(array)
	updateLastTenRuns()
	checkYoDawg()

	//Achievements
	checkOnCrunchAchievements()
	checkSecondSetOnCrunchAchievements()

	//Challenges
	checkChallengesOnCrunch()

	//Others
	doGPUpgCrunchUpdating(true)
	doReset("inf")

	replicantiAutoTick()
	idAutoTick()
}

function checkChallengesOnCrunch() {
	el("challengeconfirmation").style.display = "inline-block"
	if (!player.challenges.includes("challenge1")) {
		player.challenges.push("challenge1")
		updateAutobuyers()
	}

	var isChal = player.currentChallenge != ""
	if (!isChal) return

	if (!player.challenges.includes(player.currentChallenge)) {
		player.challenges.push(player.currentChallenge)
		updateAutobuyers()
	}

	var challNumber
	var split = player.currentChallenge.split("challenge")
	if (split[1] != undefined) challNumber = parseInt(split[1])
	var icID = checkICID(player.currentChallenge)
	if (icID) challNumber = icID

	if (player.currentChallenge != "" && player.challengeTimes[challNumber-2] > player.thisInfinityTime) player.challengeTimes[challNumber-2] = player.thisInfinityTime
	if (inNGM(4) && player.galacticSacrifice.chall) {
		challNumber = player.galacticSacrifice.chall
		if (player.challengeTimes[challNumber-2] > player.thisInfinityTime) player.challengeTimes[challNumber-2] = player.thisInfinityTime
	}
	if (player.currentChallenge.includes("post") && player.infchallengeTimes[challNumber-1] > player.thisInfinityTime) player.infchallengeTimes[challNumber-1] = player.thisInfinityTime

	if (!player.options.retryChallenge) player.currentChallenge = ""

	updateChallenges()
	updateChallengeTimes()
}

function getInfinityPointGain() {
	return getIPGain()
}

function gainedInfinityPoints() {
	return getIPGain()
}

function getIPGain(next) {
	let div = 308;
	if (hasTimeStudy(111)) div = 285;
	else if (hasAch("r103")) div = 307.8;
	if (inOnlyNGM(2)) div -= galIP()

	var ret = pow10(player.money.e / div - 0.75).mul(getIPMult())
	if (hasTimeStudy(41)) ret = ret.mul(E_pow(tsMults[41](), player.galaxies + player.replicanti.galaxies))
	if (hasTimeStudy(51)) ret = ret.mul(mod.ngep?1e30:1e15)
	if (hasTimeStudy(141)) ret = ret.mul(E(1e45).dividedBy(E_pow(15, Math.log(player.thisInfinityTime+1)*Math.pow(player.thisInfinityTime+1, 0.125))).max(1))
	if (hasTimeStudy(142)) ret = ret.mul(1e25)
	if (hasTimeStudy(143)) ret = ret.mul(E_pow(15, Math.log(player.thisInfinityTime+1)*Math.pow(player.thisInfinityTime+1, 0.125)))
	if (hasAch("r116")) ret = ret.mul(Decimal.add(getInfinitied(), 1).pow(Math.log10(2)))
	if (hasAch("r125")) ret = ret.mul(pow2(Math.log(player.thisInfinityTime+1)*Math.pow(player.thisInfinityTime+1, 0.11)))
	if (player.dilation.upgrades.includes(7)) ret = ret.mul(player.dilation.dilatedTime.max(1).pow(1000))
	if (mod.rs) {
		ret = ret.mul(E_pow(Math.max(1e4/player.thisInfinityTime),player.timestudy.ers_studies[5]+(next==5?1:0)))
		ret = ret.mul(E_pow(player.thisInfinityTime/10,player.timestudy.ers_studies[6]+(next==6?1:0)))
	}
	if (isBigRipUpgradeActive(4)) ret = ret.mul(player.replicanti.amount.pow(0.34).max(1))
	if (inNGM(3) && hasAch("r95") && player.eightAmount > 5000) ret = ret.mul(E_pow(player.eightAmount, 2))
	return ret.floor()
}

function getIPMult() {
	let mult = player.infMult
	if (inOnlyNGM(2)) {
		if (hasAch("r85")) mult = mult.mul(4)
		if (hasAch("r93")) mult = mult.mul(4)
		if (hasAch("r43")) mult = mult.mul(1.25)
		if (hasAch("r55")) mult = mult.mul(Math.min(Math.log10(Math.max(6000 / player.bestInfinityTime, 10)), 10))
		if (hasAch("r41")) mult = mult.mul(2)
		if (hasAch("r51")) {
			let galaxies = Math.max((player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies), 0) // just in case
			if (galaxies < 5) mult = mult.mul(Math.max(galaxies, 1))
			else if (galaxies < 50) mult = mult.mul(E_pow(galaxies + 5, 0.5).add(2))
			else mult = mult.mul(E_pow(galaxies, 0.3).add(7))
		}
	}
	return mult;
}

function IPonCrunchPassiveGain(diff){
	if (hasTimeStudy(181)) player.infinityPoints = player.infinityPoints.add(getIPGain().mul(diff / 100))
}

function doCrunchInfinitiesGain(){
	let infGain
	if (player.currentEternityChall == "eterc4") {
		infGain = 1
		if (player.infinitied >= 16 - (ECComps("eterc4")*4)) {
			setTimeout(exitChallenge, 500)
			onChallengeFail()
		}
	} else infGain = getInfinitiedGain()
	player.infinitied = nA(player.infinitied, infGain)
}

function updateAutoCrunchMode() {
	let mode = player.autoCrunchMode
	if (mode == "amount") {
		el("togglecrunchmode").textContent = "Auto crunch mode: amount"
		el("limittext").textContent = "Amount of IP to wait until reset:"
	} else if (mode == "time"){
		el("togglecrunchmode").textContent = "Auto crunch mode: Time"
		el("limittext").textContent = "Seconds between crunches:"
	} else if (mode == "relative"){
		el("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
		el("limittext").textContent = "X times last crunch:"
	} else if (mod == "replicanti") {
		el("togglecrunchmode").innerHTML = "Auto crunch mode: Replicated Galaxies"
		el("limittext").innerHTML = "Replicated Galaxies needed for crunch:"
	}
	el("maxReplicantiCrunchSwitchDiv").style.display = mod == "replicanti" ? "inline" : 'none'
}

function toggleCrunchMode(freeze) {
	if (player.autoCrunchMode == "amount") {
		player.autoCrunchMode = "time"
	} else if (player.autoCrunchMode == "time"){
		player.autoCrunchMode = "relative"
	} else if (player.autoCrunchMode == "relative" && mod.rs) {
		player.autoCrunchMode = "replicanti"
	} else {
		player.autoCrunchMode = "amount"
		if (!freeze&&player.autobuyers[11].priority.toString().toLowerCase()=="max") {
			player.autobuyers[11].priority = E(1)
			el("priority12").value=1
		}
	}
	updateAutoCrunchMode()
}

var bestRunIppm = E(0)
function updateLastTenRuns() {
	var listed = 0
	var tempBest = 0
	var tempTime = E(0)
	var tempIP = E(0)
	bestRunIppm = E(0)
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
			el("run"+(i+1)).textContent = msg
			tempTime = tempTime.add(player.lastTenRuns[i][0])
			tempIP = tempIP.add(player.lastTenRuns[i][1])
			listed++
		} else el("run"+(i+1)).textContent = ""
	}
	if (listed > 1) {
		tempTime = tempTime.dividedBy(listed)
		tempIP = tempIP.dividedBy(listed)
		var ippm = tempIP.dividedBy(tempTime/600)
		var tempstring = "(" + shorten(ippm) + " IP/min)"
		averageIP = tempIP
		if (ippm < 1) tempstring = "(" + shorten(ippm * 60) + " IP/hour)"
		el("averagerun").textContent = "Average time of the last " + listed + " Infinities: " + timeDisplayShort(tempTime, false, 3) + " | Average IP gain: " + shortenDimensions(tempIP) + " IP. " + tempstring
		
		if (tempBest.gte(1e8)) giveAchievement("Oh hey, you're still here");
		if (tempBest.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");
		bestRunIppm = tempBest
	} else el("averagerun").innerHTML = ""
}

function checkOnCrunchAchievements() {
	if (player.thisInfinityTime <= 72000) giveAchievement("That's fast!");
	if (player.thisInfinityTime <= 6000) giveAchievement("That's faster!")
	if (player.thisInfinityTime <= 600) giveAchievement("Forever isn't that long")
	if (player.thisInfinityTime <= 2) giveAchievement("Blink of an eye")
	if (player.eightAmount == 0) giveAchievement("You didn't need it anyway");
	if (player.galaxies == 1) giveAchievement("Claustrophobic");
	if (player.galaxies == 0 && player.resets == 0) giveAchievement("Zero Deaths")
	if (inNC(2) && player.thisInfinityTime <= 1800) giveAchievement("Many Deaths")
	if (inNC(11) && player.thisInfinityTime <= 1800) giveAchievement("Gift from the Gods")
	if (inNC(5) && player.thisInfinityTime <= 1800) giveAchievement("Is this hell?")
	if (inNC(3) && player.thisInfinityTime <= 100) giveAchievement("You did this again just for the achievement right?");
	if (player.firstAmount == 1 && player.resets == 0 && player.galaxies == 0 && inNC(12)) giveAchievement("ERROR 909: Dimension not found")
	if (getIPGain().gte(1e150)) giveAchievement("All your IP are belong to us")
	if (getIPGain().gte(1e200) && player.thisInfinityTime <= 20) giveAchievement("Ludicrous Speed")
	if (getIPGain().gte(1e250) && player.thisInfinityTime <= 200) giveAchievement("I brake for nobody")
	if (player.currentChallenge.includes("post")) giveAchievement("Infinitely Challenging")
	if (player.currentChallenge == "postc5" && player.thisInfinityTime <= 100) giveAchievement("Hevipelle did nothing wrong")
	if (inNGM(3) && player.thisInfinityTime <= 100 && player.currentChallenge == "postc7") giveAchievement("Hevipelle did nothing wrong")
	if (player.currentChallenge == "postc8") giveAchievement("Anti-antichallenged");
}

function checkSecondSetOnCrunchAchievements(){
	checkForEndMe()
	giveAchievement("To infinity!");
	if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	if (player.bestInfinityTime <= 0.01) giveAchievement("Less than or equal to 0.001");
	if (player.challenges.length >= 2) giveAchievement("Daredevil")
	if (player.challenges.length >= getTotalNormalChallenges() + 1) giveAchievement("AntiChallenged")
	if (player.challenges.length >= getTotalNormalChallenges() + order.length + 1) giveAchievement("Anti-antichallenged")
}

//Infinities
function getInfinitiedStat(){
	return getInfinitied()
}

function getInfinitied() {
	return nMx(nA(player.infinitied,player.infinitiedBank),0)
}

function getInfinitiedGain() {
	let infGain=1
	if (player.thisInfinityTime > 50 && hasAch("r87")) infGain = 250
	if (hasTimeStudy(32)) infGain *= tsMults[32]()
	if (hasAch("r133") && mod.ngpp) infGain = nM(player.dilation.dilatedTime.pow(.25).max(1), infGain)
	return nA(infGain, hasAch("r87") && inNGM(2) ? 249 : 0)
}

//CHALLENGES
// to do: fix all challenge ids because i have no idea how it got this messed up
var challNames = [null, null, "Second Dimension Autobuyer Challenge", "Third Dimension Autobuyer Challenge", "Fourth Dimension Autobuyer Challenge", "Fifth Dimension Autobuyer Challenge", "Sixth Dimension Autobuyer Challenge", "Seventh Dimension Autobuyer Challenge", "Eighth Dimension Autobuyer Challenge", "Tickspeed Autobuyer Challenge", "Automated Dimension Boosts Challenge", "Automated Galaxies Challenge", "Automated Big Crunches Challenge", "Automated Dimensional Sacrifice Challenge", "Automated Galactic Sacrifice Challenge", "Automated Tickspeed Boosts Challenge", "Automated Time Dimension Boosts Challenge"]
var challOrder = [null, 1, 2, 3, 8, 6, 10, 9, 11, 5, 4, 12, 7, 13, 14, 15, 16]

function updateChallenges() {
	var buttons = Array.from(el("tab_chal_n").getElementsByTagName("button")).concat(Array.from(el("tab_chal_inf").getElementsByTagName("button")))
	for (var i=0; i < buttons.length; i++) {
		buttons[i].className = "challengesbtn";
		buttons[i].textContent = "Start"
	}

	tmp.ic_power = 0
	for (var i=0; i < player.challenges.length; i++) {
		el(player.challenges[i]).className = "completedchallengesbtn";
		el(player.challenges[i]).textContent = "Completed"
		if (player.challenges[i].search("postc")==0) tmp.ic_power++
	}
	
	var challengeRunning
	if (player.currentChallenge === "") {
		if (!player.challenges.includes("challenge1")) challengeRunning="challenge1"
	} else challengeRunning=player.currentChallenge
	if (challengeRunning!==undefined) {
		el(challengeRunning).className = "onchallengebtn";
		el(challengeRunning).textContent = "Running"
	}

	if (inNGM(4)) {
		var chall=player.galacticSacrifice.chall
		if (chall) {
			chall="challenge"+chall
			el(chall).className = "onchallengebtn";
			el(chall).textContent = "Running"
		}
	}

	el("challenge7").parentElement.parentElement.style.display = player.infinitied < 1 && player.eternities < 1 && !quantumed ? "none" : ""

	let traps = []
	if (inQC(4)) traps.push("challenge7")
	if (isIC3Trapped()) traps.push("postc3")
	if (inQC(6)) traps.push("postc7")

	for (let trap of traps) {
		el(trap).className = "onchallengebtn";
		el(trap).textContent = "Trapped in"
	}

	for (c=0;c<order.length;c++) el(order[c]).parentElement.parentElement.style.display=player.postChallUnlocked<c+1?"none":""
}

function startChallenge(name) {
	if (name == "postc3" && isIC3Trapped()) return
	if (name == "challenge7" && inQC(4)) return
	if ((name == "postc2" || name == "postc6" || name == "postc7" || name == "postc8") && inQC(6)) return
	if (name.includes("post")) {
		if (player.postChallUnlocked < checkICID(name)) return
		var target = getGoal(name)
	} else var target = E(Number.MAX_VALUE)
	if (player.options.challConf && name != "") if (!confirm("You will start over with just your Infinity upgrades, statistics, and achievements. You need to reach " + (name.includes("post") ? "a set goal" : "Infinity") + " with special conditions. The 4th Infinity upgrade column doesn't work on challenges.")) return
	if (inNGM(3)) player.tickspeedBoosts = 0
	if (name == "postc1" && player.currentEternityChall != "" && inQC(4) && inQC(6)) giveAchievement("The Ultimate Challenge")

	player.currentChallenge = name
	player.challengeTarget = target
	doReset("inf")

	updateChallenges()

	if (player.currentChallenge.includes("post") && player.currentEternityChall !== "") giveAchievement("I wish I had gotten 7 eternities")
}

function startNormalChallenge(x) {
	if (x == 7) {
		if (player.infinitied < 1 && player.eternities < 1 && !quantumed) return
		startChallenge("challenge7", Number.MAX_VALUE)
	}
	if (inNGM(4)) galacticSacrifice(false, true, x)
	else startChallenge("challenge" + x, Number.MAX_VALUE)
}

function inNC(x, n) {
	if (inNGM(4)) return x==0 ? !player.galacticSacrifice.chall : player.galacticSacrifice.chall == x
	return player.currentChallenge == (x==0 ? "" : "challenge" + x)
}

function getTotalNormalChallenges() {
	let x = 11
	if (inNGM(2)) x += 2
	if (inNGM(3)) x++
	if (inNGM(4)) x++
	return x
}

function updateNCVisuals() {
	var chall = player.currentChallenge

	if (inNC(2) || chall == "postc1") el("chall2Pow").style.display = "inline-block"
	else el("chall2Pow").style.display = "none"

	if (inNC(3) || chall == "postc1") el("chall3Pow").style.display = "inline-block"
	else el("chall3Pow").style.display = "none"

	el("matter").style.display = hasMatter() ? "block" : "none"
	el("chall13Mult").style.display = isADSCRunning() ? "block" : "none"
	el("c14Resets").style.display = inNC(14) ? "block" : "none"

	if (inNC(9) || inNC(12) || ((inNC(5) || inNC(14) || chall == "postc4" || chall == "postc5") && !inNGM(3)) || chall == "postc1" || chall == "postc6" || chall == "postc8") el("quickReset").style.display = "inline-block"
	else el("quickReset").style.display = "none"
}

var infchallengeTimes = 999999999
function updateChallengeTimes() {
	for (c=2;c<17;c++) setAndMaybeShow("challengetime"+c,player.challengeTimes[challOrder[c]-2]<600*60*24*31,'"'+challNames[c]+' time record: "+timeDisplayShort(player.challengeTimes['+(challOrder[c]-2)+'], false, 3)')
	var temp=0
	var tempcounter=0
	for (var i=0;i<player.challengeTimes.length;i++) if (player.challenges.includes("challenge"+(i+2))&&player.challengeTimes[i]<600*60*24*31) {
		temp+=player.challengeTimes[i]
		tempcounter++
	}
	setAndMaybeShow("challengetimesum",tempcounter>1,'"Sum of completed Normal Challenge time records is " + timeDisplayShort('+temp+', false, 3) + "."')

	var temp=0
	var tempcounter=0
	for (var i=0;i<14;i++) {
		setAndMaybeShow("infchallengetime"+(i+1),player.infchallengeTimes[i]<600*60*24*31,'"Infinity Challenge '+(i+1)+' time record: "+timeDisplayShort(player.infchallengeTimes['+i+'], false, 3)')
		if (player.infchallengeTimes[i]<600*60*24*31) {
			temp+=player.infchallengeTimes[i]
			tempcounter++
		}
	}
	setAndMaybeShow("infchallengetimesum",tempcounter>1,'"Sum of completed Infinity Challenge time records is " + timeDisplayShort('+temp+', false, 3) + "."')
	updateWorstChallengeBonus();
}

var worstChallengeTime = 1
var worstChallengeBonus = 1
function updateWorstChallengeTime() {
	worstChallengeTime = 1
	for (var i = 0; i < getTotalNormalChallenges(); i++) worstChallengeTime = Math.max(worstChallengeTime, player.challengeTimes[i])
}

function updateWorstChallengeBonus() {
	updateWorstChallengeTime()
	var exp = inNGM(2) ? 2 : 1
	var timeeff = Math.max(33e-6, worstChallengeTime * 0.1)
	var base = inNGM(4) ? 3e4 : 3e3
	var eff = Decimal.max(Math.pow(base / timeeff, exp), 1)
	if (inNGM(4)) eff = eff.mul(E_pow(eff.add(10).log10(), 5)) 
	worstChallengeBonus = eff
}

//BREAK INFINITY
function canBreakInfinity() {
	return player.autobuyers[11] % 1 != 0 && player.autobuyers[11].interval <= 100
}

function breakInfinity() {
	if (!canBreakInfinity()) return false
	player.break = !player.break
}

function onPostBreak() {
	return (player.break && inNC(0)) || player.currentChallenge.includes("p")
}
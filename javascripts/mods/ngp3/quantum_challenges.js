var quantumChallenges = {
	costs:[0,16750,19100,21500,24050,25900,28900,31300,33600],
	goals:[0,665e7,768e8,4525e7,5325e7,1344e7,561e6,6254e7,2925e7]
}

var assigned = []
var pcFocus = 0
function updateQuantumChallenges() {
	if (!tmp.ngp3 || !player.masterystudies.includes("d8")) {
		document.getElementById("qctabbtn").style.display = "none"
		return
	} else document.getElementById("qctabbtn").style.display = ""
	var assigned = []
	var assignedNums = {}
	document.getElementById("bigrip").style.display = player.masterystudies.includes("d14") ? "" : "none"
	document.getElementById("pairedchallenges").style.display = player.masterystudies.includes("d9") ? "" : "none"
	document.getElementById("respecPC").style.display = player.masterystudies.includes("d9") ? "" : "none"
	for (var pc = 1; pc <= 4; pc++) {
		var subChalls = tmp.qu.pairedChallenges.order[pc]
		if (subChalls) for (var sc=0; sc < 2; sc++) {
			var subChall = subChalls[sc]
			if (subChall) {
				assigned.push(subChall)
				assignedNums[subChall] = pc
			}
		}
		if (player.masterystudies.includes("d9")) {
			var property = "pc" + pc
			var sc1 = tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc][0] : 0
			var sc2 = (sc1 ? tmp.qu.pairedChallenges.order[pc].length > 1 : false) ? tmp.qu.pairedChallenges.order[pc][1] : 0
			document.getElementById(property+"desc").textContent = "Paired Challenge "+pc+": Both Quantum Challenge " + (sc1 ? sc1 : "?") + " and " + (sc2 ? sc2 : "?") + " are applied."
			document.getElementById(property+"cost").textContent = "Cost: " + (sc2 ? getFullExpansion(getQCCost(pc + 8)) : "???") + " electrons"
			document.getElementById(property+"goal").textContent = "Goal: " + (sc2 ? shortenCosts(Decimal.pow(10, getQCGoal(pc + 8))) : "???") + " antimatter"
			document.getElementById(property).textContent = pcFocus == pc ? "Cancel" : (tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc].length < 2 : true) ? "Assign" : tmp.qu.pairedChallenges.completed >= pc ? "Completed" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : tmp.qu.pairedChallenges.current == pc ? "Running" : "Start"
			document.getElementById(property).className = pcFocus == pc || (tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc].length < 2 : true) ? "challengesbtn" : tmp.qu.pairedChallenges.completed >= pc ? "completedchallengesbtn" : tmp.qu.pairedChallenges.completed + 1 <pc ? "lockedchallengesbtn" : tmp.qu.pairedChallenges.current == pc ? "onchallengebtn" : "challengesbtn"

			var sc1t = Math.min(sc1, sc2)
			var sc2t = Math.max(sc1, sc2)
			if (player.masterystudies.includes("d14")) {
				document.getElementById(property + "br").style.display = ""
				document.getElementById(property + "br").textContent = sc1t != 6 || sc2t != 8 ? "QC6 & 8" : tmp.qu.bigRip.active ? "Big Ripped" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
				document.getElementById(property + "br").className = sc1t != 6 || sc2t != 8 ? "lockedchallengesbtn" : tmp.qu.bigRip.active ? "onchallengebtn" : tmp.qu.pairedChallenges.completed + 1 < pc ? "lockedchallengesbtn" : "bigripbtn"
			} else document.getElementById(property + "br").style.display = "none"
		}
	}
	if (player.masterystudies.includes("d14")) {
		var max = getMaxBigRipUpgrades()
		document.getElementById("spaceShards").textContent = shortenDimensions(tmp.qu.bigRip.spaceShards)
		for (var u = 18; u <= 20; u++) document.getElementById("bigripupg" + u).parentElement.style.display = u > max ? "none" : ""
		for (var u = 1; u <= max; u++) {
			document.getElementById("bigripupg" + u).className = tmp.qu.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" + (isBigRipUpgradeActive(u, true) ? "" : "off") : tmp.qu.bigRip.spaceShards.lt(bigRipUpgCosts[u]) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
			document.getElementById("bigripupg" + u + "cost").textContent = shortenDimensions(new Decimal(bigRipUpgCosts[u]))
		}
	}
	for (var qc = 1; qc <= 8; qc++) {
		var property = "qc" + qc
		document.getElementById(property + "div").style.display = (qc < 2 || QCIntensity(qc - 1)) ? "inline-block" : "none"
		document.getElementById(property).textContent = ((!assigned.includes(qc) && pcFocus) ? "Choose" : inQC(qc) ? "Running" : QCIntensity(qc) ? (assigned.includes(qc) ? "Assigned" : "Completed") : "Start") + (assigned.includes(qc) ? " (PC" + assignedNums[qc] + ")" : "")
		document.getElementById(property).className = (!assigned.includes(qc) && pcFocus) ? "challengesbtn" : inQC(qc) ? "onchallengebtn" : QCIntensity(qc) ? "completedchallengesbtn" : "challengesbtn"
		document.getElementById(property + "cost").textContent = "Cost: " + getFullExpansion(quantumChallenges.costs[qc]) + " electrons"
		document.getElementById(property + "goal").textContent = "Goal: " + shortenCosts(Decimal.pow(10, getQCGoal(qc))) + " antimatter"
	}
	document.getElementById("qc2reward").textContent = Math.round(tmp.qcRewards[2] * 100 - 100)
	document.getElementById("qc7desc").textContent = "Dimension and tickspeed cost multiplier increases are " + shorten(Number.MAX_VALUE) + "x. Multiplier per ten Dimensions and meta-Antimatter boost to Dimension Boosts are disabled."
	document.getElementById("qc7reward").textContent = (100 - tmp.qcRewards[7] * 100).toFixed(2)
	document.getElementById("qc8reward").textContent = tmp.qcRewards[8]
}

function inQC(num) {
	return tmp.inQCs.includes(num)
}

function updateInQCs() {
	tmp.inQCs = [0]

	if (tmp.qu !== undefined && tmp.qu.challenge !== undefined) {
		data = tmp.qu.challenge
		if (typeof(data) == "number") data = [data]
		else if (data.length == 0) data = [0]
		tmp.inQCs = data
	}
}

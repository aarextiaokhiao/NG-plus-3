function onChallengeFail() {
	el("challfail").style.display = "block"
	giveAchievement("You're a mistake")
	failureCount++
	if (failureCount > 9) giveAchievement("You're a failure")
}

function unlockEChall(idx, auto) {
	if (player.eternityChallUnlocked != 0) return
	player.eternityChallUnlocked = idx
	updateEternityChallenges()

	if (idx < 12) {
		updateTimeStudyButtons(true)
		player.etercreq = idx
	}
	if (mod.ngp3) delete quSave.autoECN
}

function ECComps(name) {
	return player.eternityChalls[name] || 0
}

function canUnlockEC(idx, cost, study, study2) {
	study2 = (study2 !== undefined) ? study2 : 0;
	if (player.eternityChallUnlocked !== 0) return false
	if (!hasTimeStudy(study) && (player.study2 == 0 || !hasTimeStudy(study2))) return false
	if (player.timestudy.theorem < cost) return false
	if (player.etercreq == idx && idx !== 11 && idx !== 12) return true

	var ec1Mult = mod.ngep ? 1e3 : 2e4
	switch(idx) {
		case 1:
			if (getEternitied() >= (ECComps("eterc1") ? ECComps("eterc1") + 1 : 1) * ec1Mult) return true
			break;

		case 2:
			if (player.totalTickGained >= 1300 + (ECComps("eterc2") * 150)) return true
			break;

		case 3:
			if (player.eightAmount.gte(17300 + (ECComps("eterc3") * 1250))) return true
			break;

		case 4:
			if (1e8 + (ECComps("eterc4") * 5e7) <= getInfinitied()) return true
			break;

		case 5:
			if (160 + (ECComps("eterc5") * 14) <= player.galaxies) return true
			break;

		case 6:
			if (40 + (ECComps("eterc6") * 5) <= player.replicanti.galaxies) return true
			break;

		case 7:
			if (player.money.gte(E("1e500000").mul(E("1e300000").pow(ECComps("eterc7"))))) return true
			break;

		case 8:
			if (player.infinityPoints.gte(E("1e4000").mul(E("1e1000").pow(ECComps("eterc8"))))) return true
			break;

		case 9:
			if (player.infinityPower.gte(E("1e17500").mul(E("1e2000").pow(ECComps("eterc9"))))) return true
			break;

		case 10:
			if (player.eternityPoints.gte(E("1e100").mul(E("1e20").pow(ECComps("eterc10"))))) return true
			break;

		case 11:
			if (hasTimeStudy(71) && !hasTimeStudy(72) && !hasTimeStudy(73)) return true
			break;

		case 12:
			if (hasTimeStudy(73) && !hasTimeStudy(71) && !hasTimeStudy(72)) return true
			break;
	}
	return false
}

function canUnlockECFromNum(n){
	if (n == 1) return canUnlockEC(1, 30, 171)
	if (n == 2) return canUnlockEC(2, 35, 171)
	if (n == 3) return canUnlockEC(3, 40, 171)
	if (n == 4) return canUnlockEC(4, 70, 143)
	if (n == 5) return canUnlockEC(5, 130, 42)
	if (n == 6) return canUnlockEC(6, 85, 121)
	if (n == 7) return canUnlockEC(7, 115, 111)
	if (n == 8) return canUnlockEC(8, 115, 123)
	if (n == 9) return canUnlockEC(9, 415, 151)
	if (n == 10) return canUnlockEC(10, 550, 181)
	if (n == 11) return canUnlockEC(11, 1, 231, 232)
	if (n == 12) return canUnlockEC(12, 1, 233, 234)
	return false
}

function updateECUnlockButtons() {
	for (let ecnum = 1; ecnum <= 12; ecnum ++){
		let s = "ec" + ecnum + "unl"
		if (canUnlockECFromNum(ecnum)) el(s).className = "eternitychallengestudy"
		else el(s).className = "eternitychallengestudylocked"
	}
	if (player.eternityChallUnlocked !== 0) el("ec" + player.eternityChallUnlocked + "unl").className = "eternitychallengestudybought"
}

var ECCosts = [null, 
		30,	35,	40,
		70,	130, 85,
		115, 115, 415,
		550, 1,	 1]

for (let ecnum = 1; ecnum <= 12; ecnum ++){
	el("ec" + ecnum + "unl").onclick = function(){
		if (!canUnlockECFromNum(ecnum)) return
		player.timestudy.theorem -= ECCosts[ecnum]
		unlockEChall(ecnum)
		drawStudyTree()
	}
}

function getEC12TimeLimit() {
	//In the multiple of 0.1 seconds
	let r = 10 - 2 * ECComps("eterc12")
	return Math.max(r , 1)
}

var ecExpData = {
	inits: {
		eterc1: 1800,
		eterc2: 975,
		eterc3: 600,
		eterc4: 2750,
		eterc5: 750,
		eterc6: 850,
		eterc7: 2000,
		eterc8: 1300,
		eterc9: 1750,
		eterc10: 3000,
		eterc11: 500,
		eterc12: 110000,
		eterc13: 38500000,
		eterc14: 1595000,
		eterc1_ngmm: 1800,
		eterc2_ngmm: 1125,
		eterc3_ngmm: 1025,
		eterc4_ngmm: 2575,
		eterc5_ngmm: 600,
		eterc6_ngmm: 850,
		eterc7_ngmm: 1450,
		eterc8_ngmm: 2100,
		eterc9_ngmm: 2250,
		eterc10_ngmm: 2205,
		eterc11_ngmm: 35000,
		eterc12_ngmm: 17000
	},
	increases: {
		eterc1: 200,
		eterc2: 175,
		eterc3: 75,
		eterc4: 550,
		eterc5: 400,
		eterc6: 250,
		eterc7: 530,
		eterc8: 900,
		eterc9: 250,
		eterc10: 300,
		eterc11: 200,
		eterc12: 12000,
		eterc13: 1000000,
		eterc14: 800000,
		eterc1_ngmm: 400,
		eterc2_ngmm: 250,
		eterc3_ngmm: 100,
		eterc4_ngmm: 525,
		eterc5_ngmm: 300,
		eterc6_ngmm: 225,
		eterc8_ngmm: 500,
		eterc9_ngmm: 300,
		eterc10_ngmm: 175,
		eterc11_ngmm: 3250,
		eterc12_ngmm: 1500
	}
}
function getECGoal(x) {
	let expInit = ecExpData.inits[x]
	let expIncrease = ecExpData.increases[x]
	let completions = ECComps(x)
	if (inNGM(2)) {
		expInit = ecExpData.inits[x + "_ngmm"] || expInit
		expIncrease = ecExpData.increases[x + "_ngmm"] || expIncrease
	}
	let exp = expInit + expIncrease * completions
	if (x == "ec13") exp += 600000 * Math.max(completions - 2, 0) * (completions - 3, 0)
	return pow10(exp)
}

function getECReward(x) {
	let m2 = inNGM(2)
	let c=ECComps("eterc" + x)
	if (x == 1) return Math.pow(Math.max(player.thisEternity * 10, 1), (0.3 + c * 0.05) * (m2 ? 5 : 1))
	if (x == 2) {
		let r = player.infinityPower.pow((m2 ? 4.5 : 1.5) / (700 - c * 100)).add(1)
		if (m2) r = E_pow(player.infinityPower.add(10).log10(), 1000).mul(r)
		else r = r.min(1e100)
		return r.max(1)
	}
	if (x == 3) return c * 0.8
	if (x == 4) return player.infinityPoints.max(1).pow((m2 ? .4 : 0.003) + c * (m2 ? .2 : 0.002)).min(m2 ? 1/0 : 1e200)
	if (x == 5) return c * 5
	if (x == 8) {
		let x = Math.log10(player.infinityPower.add(1).log10() + 1)
		if (x > 0) x=Math.pow(x, (m2 ? 0.05 : 0.03) * c)
		return Math.max(x, 1)
	}
	if (x == 9) {
		let r=player.timeShards
		if (r.gt(0)) r = r.pow(c / (m2 ? 2 : 10))
		if (m2) return r.add(1).min("1e10000")
		if (!mod.ngep) return r.add(1).min("1e400")
		if (r.lt("1e400")) return r.add(1)
		let log = Math.sqrt(r.log10() * 400)
		return pow10(Math.min(50000, log))	
	}
	if (x == 10) return E_pow(getInfinitied(), m2 ? 2 : .9).mul(c * (m2 ? 0.02 : 0.000002)).add(1).pow(hasTimeStudy(31) ? 4 : 1)
	if (x == 12) return 1 - c * (m2 ? .06 : 0.008)
	if (x == 13) return [0, 0.25, 0.5, 0.7, 0.85, 1][c]
	if (x == 14) return getIC3EffFromFreeUpgs()
}

function startEternityChallenge(n) {
	if (player.currentEternityChall == "eterc"+n || parseInt(n) != player.eternityChallUnlocked) return
	if (player.options.challConf) if (!confirm("You will start over with just your Time Studies, Eternity upgrades and achievements. You need to reach a set IP goal with special conditions to beat the Eternity Challenge.")) return
	if (ghostified && name == "eterc10") ghSave.under = false

	//Eternities (to add)
	var oldStat = getEternitied()
	player.eternities = nA(player.eternities, gainEternitiedStat())
	updateBankedEter()

	player.eternityChallGoal = getECGoal("eterc" + n)
	player.currentEternityChall =	"eterc" + n	
	doReset("eter")
}

function getEC12Slowdown() {
	return 1e3
}
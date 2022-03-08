function updatePostNGp3TempStuff() {
    updateBDTemp()
    updateNU16Temp()
    updateGravitonsTemp()
}

function postNGp3Updating(dt) {
	if (tmp.gv.core) {
		ghSave.gravitons.amount = ghSave.gravitons.amount.add(tmp.gv.gain.mul(dt))
		ghSave.gravitons.best = ghSave.gravitons.amount.max(ghSave.gravitons.best)
		ghSave.gravitons.tog = Math.max(ghSave.gravitons.tog, tmp.gv.bulk)
	}

    if (ghSave.breakDilation.break) {
        setTachyonParticles(player.dilation.tachyonParticles.max(getDilGain()));
        ghSave.breakDilation.cr = ghSave.breakDilation.cr.add(tmp.bd.crGain.mul(dt))
    }
}

function setupPostNGp3HTML() {
    setupBDUpgradesHTML()
}

function doBDUnlockStuff(){
	ghSave.breakDilation.unl=true
	$.notify("Congratulations! You have unlocked Break Dilation!", "success")
	updateTemp()
}

function doPostNGP3UnlockStuff() {
    if (ghSave.hb.unl && !ghSave.gravitons.unl && player.money.gte("e1e18")) doGravitonsUnlockStuff()
    //if (ghSave.gravitons.unl && !ghSave.breakDilation.unl && brSave.active && player.money.gte("e4e12")) doBDUnlockStuff()
}

function getBrandNewBDData() {
	return {
		unl: false,
        break: false,
        cr: E(0),
        upgs: [],
	}
}

function conToDeciPostNGP3() {
    if (ghSave) {
        if (ghSave.breakDilation===undefined) ghSave.breakDilation={}
        ghSave.breakDilation = deepUndefinedAndDecimal(ghSave.breakDilation, getBrandNewBDData())
        if (ghSave.gravitons===undefined) ghSave.gravitons={}
        else if (ghSave.gravitons.tog===undefined) ghSave.gravitons={}
        ghSave.gravitons = deepUndefinedAndDecimal(ghSave.gravitons, getBrandNewGravitonsData())
    }
}

function postNGp3AchsCheck() {
    if (ghSave.gravitons.unl) giveAchievement(allAchievements.ng3p101)
    if (ghSave.hb.higgs >= 50) giveAchievement(allAchievements.ng3p102)
    if (player.money.gte("e2e18")) giveAchievement(allAchievements.ng3p103)
    if (beSave && beSave.eternalMatter.gte("9.99e999")) giveAchievement(allAchievements.ng3p104)
    if (tmp.rep && E(tmp.rep.freq).gte(E(2).pow(1024))) giveAchievement(allAchievements.ng3p105)
    if (E(ghSave.times).gte(E(2).pow(1024))) giveAchievement(allAchievements.ng3p106)
    if (ghSave.ghostParticles.gte("e6000")) giveAchievement(allAchievements.ng3p107)
    if (player.money.gte("e1e11") && brSave.active && !beSave.break && beSave.eternalMatter.lte(0)) giveAchievement(allAchievements.ng3p108)

    if (player.totalTickGained >= 8e10) giveAchievement(allAchievements.ng3p112)
    if (nfSave.rewards >= 200) giveAchievement(allAchievements.ng3p113)
}

function setPostR23Tooltip() {
    a = el("Mega Boo!")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e6000")) + " Ghost Particles. Reward: Gain 100% of Ghost Particles, Ghostifies & Neutrions gained in Big Rip.")

    a = el("When Infinity Replicanti")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(2).pow(1024)) + " of Replicate amount.")

    a = el("Not again?")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(2).pow(1024)) + " Ghostifies.")

    a = el("Double Quintillion")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e2e18")) + " antimatter.")

    a = el("Breaking Eternity is Fixed")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e1e11")) + " antimatter while Big Ripped whithout Breaking Eternity.")

    a = el("This achievement doesn't exist 5")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("9.99e999")) + " Eternal Matters. Reward: Eternal Matter boost its gain at a reduced rate.")
}

function updateBreakEternityUpgrade11Temp(){
	var s = tmp.sacPow||E(1)
	tmp.beu[11] = pow10(s.e**0.3)
}
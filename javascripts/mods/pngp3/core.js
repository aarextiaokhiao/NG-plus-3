function updatePostNGp3TempStuff() {
    updateBDTemp()
    updateGravitonsTemp()
}

function postNGp3Updating(dt) {
    if (brokeDilation()) {
        setTachyonParticles(player.dilation.tachyonParticles.max(getDilGain()));
        ghSave.breakDilation.cr = ghSave.breakDilation.cr.add(tmp.bd.crGain.mul(dt))
    }
}

function setupPostNGp3HTML() {
    setupBDUpgradesHTML()
}

function doBDUnlockStuff(){
	ghSave.breakDilation.unl=true
	ngp3_feature_notify("bd")
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
        else if (ghSave.gravitons.his===undefined) ghSave.gravitons={}
        ghSave.gravitons = deepUndefinedAndDecimal(ghSave.gravitons, getBrandNewGravitonsData())
    }
}

function postNGp3AchsCheck() {
    //giveAchievement(allAchievements.ng3p101)
    if (ghSave.hb.higgs >= 150) giveAchievement(allAchievements.ng3p102)
    //giveAchievement(allAchievements.ng3p103)
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
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e6000")) + " Elementary Particles. Reward: Gain 100% of Elementary Particles, Fundaments & Neutrions gained in Big Rip.")

    a = el("Quantized Reproduction")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(2).pow(1024)) + " of Replicate amount.")

    a = el("Spectral Phasing")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(2).pow(1024)) + " Fundaments.")

    a = el("Temporality")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e1e11")) + " antimatter while Big Ripped whithout Breaking Eternity.")

    a = el("This achievement doesn't exist 5")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("9.99e999")) + " Eternal Matters. Reward: Eternal Matter boost its gain at a reduced rate.")
}


function updateNU16Temp(){
	tmp.nu[7] = (E(ghSave.times).log10()+1)**1.5
}

function updateBreakEternityUpgrade11Temp(){
	var s = tmp.sacPow||E(1)
	tmp.beu[11] = pow10(s.e**0.3)
}

//Respecced
function adjustTSSoftcapPow(x) {
	var f = 1
	if (f < 1) x = (1 - f) + x * f
	return x
}
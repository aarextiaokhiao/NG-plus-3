function updatePostNGp3TempStuff() {
    updateBDTemp()
    updateNU16Temp()
    updateGravitonsTemp()
}

function postNGp3Updating(dt) {
    ghSave.gravitons.amount = ghSave.gravitons.amount.add(tmp.gravitons.gain.mul(dt))
    ghSave.gravitons.best = ghSave.gravitons.amount.max(ghSave.gravitons.best)

    if (ghSave.breakDilation.break) {
        setTachyonParticles(player.dilation.tachyonParticles.max(getDilGain()));
        ghSave.breakDilation.cr = ghSave.breakDilation.cr.add(tmp.bd.crGain.mul(dt))
    }
}

function setupPostNGp3HTML() {
    setupGravitonUpgradesHTML()
    setupBDUpgradesHTML()
}

function updateGravitonsTab() {
    document.getElementById("gravUnl").style.display = ghSave.gravitons.unl ? "none" : ""
    document.getElementById("gravUnl").textContent="To unlock Gravitons, you need to get "+shortenCosts(pow10(1e18))+" antimatter."
    document.getElementById("gravDiv").style.display = ghSave.gravitons.unl ? "" : "none"

    if (ghSave.gravitons.unl) {
        document.getElementById("gravAmt").innerHTML = shortenMoney(ghSave.gravitons.amount)
        document.getElementById("gravGain").innerHTML = shorten(tmp.gravitons.gain)
        document.getElementById("gravBest").innerHTML = shortenMoney(ghSave.gravitons.best)
        document.getElementById("gravPow").innerHTML = shorten(tmp.gravitons.powEff)
        document.getElementById("gravEff").innerHTML = shorten(tmp.gravitons.eff)

        for (let x = 0; x < GRAVITON_UPGS.length; x++) {
            let name = "gravUpg"+x
            let upg = GRAVITON_UPGS[x]
            let unl = (upg.unl ? upg.unl() : true) && x < tmp.gravitons.unls
    
            document.getElementById(name+"_div").style.visibility = unl ? "visible" : "hidden"
            if (unl) {
                document.getElementById(name+"_div").className = "gravitonupg "+(ghSave.gravitons.upgs.includes(x)?"upg_bought":ghSave.gravitons.amount.gte(upg.cost)?"":"upg_locked")
                document.getElementById(name+"_cost").innerHTML = shorten(upg.cost)
                if (upg.effDesc) document.getElementById(name+"_eff").innerHTML = upg.effDesc(tmp.gravitons.upg_eff[x])
            }
        }
    }
}

function doGravitonsUnlockStuff(){
	ghSave.gravitons.unl=true
	$.notify("Congratulations! You have unlocked Gravitons!", "success")
	updateTemp()
}

function doBDUnlockStuff(){
	ghSave.breakDilation.unl=true
	$.notify("Congratulations! You have unlocked Break Dilation!", "success")
	updateTemp()
}

function doPostNGP3UnlockStuff() {
    if (ghSave.hb.unl && !ghSave.gravitons.unl && player.money.gte("e1e18")) doGravitonsUnlockStuff()
    if (ghSave.gravitons.unl && !ghSave.breakDilation.unl && brSave.active && player.money.gte("e4e12")) doBDUnlockStuff()
}

function getBrandNewGravitonsData() {
	return {
		unl: false,
        amount: E(0),
        best: E(0),
        upgs: [],
	}
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
        ghSave.gravitons = deepUndefinedAndDecimal(ghSave.gravitons, getBrandNewGravitonsData())
    }
}

function postNGp3AchsCheck() {
    if (ghSave.gravitons.best.gte(1e4)) giveAchievement(allAchievements.ng3p101)
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
    let a = document.getElementById("The Layer of Recreation")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(1e4)) + " of best Gravitons. Reward: Light Empowerments no longer resets anything.")

    a = document.getElementById("Mega Boo!")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e6000")) + " Ghost Particles. Reward: Gain 100% of Ghost Particles, Ghostifies & Neutrions gained in Big Rip.")

    a = document.getElementById("When Infinity Replicanti")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(2).pow(1024)) + " of Replicate amount.")

    a = document.getElementById("Not again?")
    a.setAttribute('ach-tooltip', "Get " + shorten(E(2).pow(1024)) + " Ghostifies.")

    a = document.getElementById("Double Quintillion")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e2e18")) + " antimatter.")

    a = document.getElementById("Breaking Eternity is Fixed")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("e1e11")) + " antimatter while Big Ripped whithout Breaking Eternity.")

    a = document.getElementById("This achievement doesn't exist 5")
    a.setAttribute('ach-tooltip', "Get " + shorten(E("9.99e999")) + " Eternal Matters. Reward: Eternal Matter boost its gain at a reduced rate.")
}
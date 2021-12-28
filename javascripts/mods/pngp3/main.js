function updatePostNGp3TempStuff() {
    updateNU16Temp()
    updateGravitonsTemp()
}

function postNGp3Updating(dt) {
    player.ghostify.gravitons.amount = player.ghostify.gravitons.amount.add(tmp.gravitons.gain.mul(dt))
    player.ghostify.gravitons.best = player.ghostify.gravitons.amount.max(player.ghostify.gravitons.best)
}

function setupPostNGp3HTML() {
    setupGravitonUpgradesHTML()
}

function updateGravitonsTab() {
    document.getElementById("gravUnl").style.display = player.ghostify.gravitons.unl ? "none" : ""
    document.getElementById("gravUnl").textContent="To unlock Gravitons, you need to get "+shortenCosts(Decimal.pow(10,1e18))+" antimatter."
    document.getElementById("gravDiv").style.display = player.ghostify.gravitons.unl ? "" : "none"

    if (player.ghostify.gravitons.unl) {
        document.getElementById("gravAmt").innerHTML = shortenMoney(player.ghostify.gravitons.amount)
        document.getElementById("gravGain").innerHTML = shorten(tmp.gravitons.gain)
        document.getElementById("gravBest").innerHTML = shortenMoney(player.ghostify.gravitons.best)
        document.getElementById("gravPow").innerHTML = shorten(tmp.gravitons.powEff)
        document.getElementById("gravEff").innerHTML = shorten(tmp.gravitons.eff)

        for (let x = 0; x < GRAVITON_UPGS.length; x++) {
            let name = "gravUpg"+x
            let upg = GRAVITON_UPGS[x]
            let unl = upg.unl ? upg.unl() : true
    
            document.getElementById(name+"_div").style.visibility = unl ? "visible" : "hidden"
            if (unl) {
                document.getElementById(name+"_div").className = "gravitonupg "+(player.ghostify.gravitons.upgs.includes(x)?"upg_bought":player.ghostify.gravitons.amount.gte(upg.cost)?"":"upg_locked")
                document.getElementById(name+"_cost").innerHTML = shorten(upg.cost)
                if (upg.effDesc) document.getElementById(name+"_eff").innerHTML = upg.effDesc(tmp.gravitons.upg_eff[x])
            }
        }
    }
}

function updateBDTab() {
    document.getElementById("bdUnl").textContent="To unlock Break Dilation, you need to get "+shortenCosts(Decimal.pow(10,4e12))+" antimatter while Big Ripped. (coming soon)"
}

function doGravitonsUnlockStuff(){
	player.ghostify.gravitons.unl=true
	$.notify("Congratulations! You have unlocked Gravitons!", "success")
	updateTemp()
}

function doPostNGP3UnlockStuff() {
    if (player.ghostify.hb.unl && !player.ghostify.gravitons.unl && player.money.gte("e1e18")) doGravitonsUnlockStuff()
}

function getBrandNewGravitonsData() {
	return {
		unl: false,
        amount: new Decimal(0),
        best: new Decimal(0),
        upgs: [],
	}
}

function conToDeciPostNGP3() {
    player.ghostify.gravitons = deepUndefinedAndDecimal(player.ghostify.gravitons, getBrandNewGravitonsData())
}

function postNGp3AchsCheck() {
    if (player.ghostify.gravitons.best.gte(1e4)) giveAchievement(allAchievements.ng3p101)
    if (player.ghostify.hb.higgs >= 50) giveAchievement(allAchievements.ng3p102)
    if (player.money.gte("e2e18")) giveAchievement(allAchievements.ng3p103)
    if (player.quantum.breakEternity.eternalMatter.gte("9.99e999")) giveAchievement(allAchievements.ng3p104)
    if (E(tmp.rep.freq).gte(E(2).pow(1024))) giveAchievement(allAchievements.ng3p105)
    if (E(player.ghostify.times).gte(E(2).pow(1024))) giveAchievement(allAchievements.ng3p106)
    if (player.ghostify.ghostParticles.gte("e6000")) giveAchievement(allAchievements.ng3p107)
    if (player.money.gte("e1e11") && player.quantum.bigRip.active && !player.quantum.breakEternity.break && player.quantum.breakEternity.eternalMatter.lte(0)) giveAchievement(allAchievements.ng3p108)

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
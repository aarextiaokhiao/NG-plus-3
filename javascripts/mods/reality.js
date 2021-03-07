function updateReality() {
    document.getElementById('realityBlock2').style.display = 'none'
    document.getElementById('realityBlock').style.height = '0px'
    if (!player.reality) return;
    document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`

    updateRealityUpgrades()
    updateGainRPMilestones()
    updateExponential()
    tabRealityUpdate()
    if (REALITY.canReset() || player.reality.times > 0) {
        document.getElementById('realityBlock2').style.display = ''
        document.getElementById('realityBlock').style.height = '120px'
    } else {
        document.getElementById('realityBlock2').style.display = 'none'
        document.getElementById('realityBlock').style.height = '0px'
    }
    document.getElementById("realitystorebtn").style.display = (player.reality.times > 0) ? "inline-block" : 'none'
    document.getElementById('realitybtn').style.display = REALITY.canReset() ? '' : 'none'

    REALITYDisplay()
}

function tabRealityUpdate() {
    document.getElementById('rexp').style.display = (player.reality.upgrades.includes(3)) ? "inline-block" : 'none'
}

function setRealityIfUndefined() {
    if (!player.reality) return
    let p_real = player.reality
    let data = getRealityData()

    if (p_real.points === undefined) p_real.points = data.points
    if (p_real.shards === undefined) p_real.shards = data.shards
    if (p_real.times === undefined) p_real.times = data.times
    if (p_real.time === undefined) p_real.time = data.time
    if (p_real.bestTime === undefined) p_real.bestTime = data.bestTime
    if (p_real.upgrades === undefined) p_real.upgrades = data.upgrades
    if (p_real.bestPoints === undefined) p_real.bestPoints = data.bestPoints
    if (p_real.bestPointsGained === undefined) p_real.bestPointsGained = data.bestPointsGained
    if (p_real.exp === undefined) p_real.exp = {}

    let p_exp = p_real.exp
    if (p_exp.amount === undefined) p_exp.amount = data.exp.amount
    if (p_exp.buys === undefined) p_exp.buys = data.exp.buys


    if (player.autoEterOptions === undefined) player.autoEterOptions = {}
    let p_autoE = player.autoEterOptions

    if (p_autoE.epmult === undefined) p_autoE.epmult = false

    if (player.galaxyMaxBulk === undefined) player.galaxyMaxBulk = false
}

function conToDeciReality() {
    if (player.reality) {
        player.reality.points = new Decimal(player.reality.points)
        player.reality.shards = new Decimal(player.reality.shards)
        player.reality.bestPoints = new Decimal(player.reality.bestPoints)
        player.reality.bestPointsGained = new Decimal(player.reality.bestPointsGained)
        player.reality.exp.amount = new Decimal(player.reality.exp.amount)
    }
}

function realUpgsDisplay() {
    for (let x = 1; x <= 4; x++) {
        let upg = REALITY.upgs[x]
        document.getElementById('real'+x).innerHTML = upg.desc
        +(upg.effDesc?("<br>Currently: "+upg.effDesc()):'')+
        "<br>Cost: "+shortenCosts(upg.cost)+' RS'
    }
}

function buyRealityUpgrade(name) {
	if (REALITY.upgs[name].can() && !player.reality.upgrades.includes(name)) {
		player.reality.upgrades.push(name)
		player.reality.shards = player.reality.shards.minus(REALITY.upgs[name].cost)
		updateRealityUpgrades();
        document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`
        tabRealityUpdate()
	}
}

function REALITYDisplay() {
    realityGainDisplay()
    document.getElementById('epmultauto').textContent="Auto: O"+(player.autoEterOptions.epmult?"N":"FF")
    if (document.getElementById("realityupgrades").style.display == "block") realUpgsDisplay()
    if (document.getElementById("exponential").style.display == "block") exponentialDisplay()
}

function realityGainDisplay() {
    document.getElementById('realirtbtnFlavor').innerHTML = (player.reality.times > 0)?"":"I'm tired of these games..... I need to become Real";
    document.getElementById('realitybtnRPGain').innerHTML = (player.reality.times > 0)?`Gain <b>${shortenDimensions(REALITY.points())}</b> Reality points and <b>${shortenDimensions(REALITY.shards())}</b> Reality shards.`:"";
}

function updateRealityUpgrades() {
    for (let x = 1; x <= 4; x++) {
        document.getElementById("real"+x).className = (player.reality.upgrades.includes(x)) ? "realityupbtnbought" : (REALITY.upgs[x].can()) ? "realityupbtn" : "realityupbtnlocked"
    }
    let have = 0
    for (let x = 1; x <= 4; x++) if (player.reality.upgrades.includes(x)) have++
    if (have == 4) giveAchievement("Finally pass first row")
}

function updateGainRPMilestones() {
    for (let x = 1; x <= 2; x++) {
        document.getElementById("gainrp"+x).className = (REALITY.milestones_req.can(x)) ? "gainrpmilestone unlocked" : "gainrpmilestone"
    }
}

function updateExponential() {
    document.getElementById('expmult').className = (REALITY.exp.mult.can())?'storebtn':'unavailablebtn'
    document.getElementById('exppen').className = (REALITY.exp.pen.can())?'storebtn':'unavailablebtn'
}

function exponentialDisplay() {
    document.getElementById('expamount').innerHTML = shortenMoney(player.reality.exp.amount)
    document.getElementById('expeffect').innerHTML = shortenMoney(REALITY.exp.effect())
    document.getElementById('expgain').innerHTML = longMoney(REALITY.exp.gain())

    document.getElementById('expmult').innerHTML = `Multiplier: x${shortenMoney(REALITY.exp.mult.effect())}<br>-> x${shortenMoney(REALITY.exp.mult.effect(REALITY.exp.have(1)+1))} Costs: ${shortenDimensions(REALITY.exp.mult.cost())} RP`
    document.getElementById('exppen').innerHTML = `Penalty: ^${longMoney(REALITY.exp.pen.effect())}<br>-> ^${longMoney(REALITY.exp.pen.effect(REALITY.exp.have(1)+1))} Costs: ${shortenDimensions(REALITY.exp.pen.cost())} RP`
}

function ExponentialPassiveGain(dt) {
    if (player.reality) player.reality.exp.amount = player.reality.exp.amount.mul(REALITY.exp.gain().pow(dt))
}

function upgradeMultipler() {
    if (REALITY.exp.mult.can()) {
        player.reality.points = player.reality.points.sub(REALITY.exp.mult.cost())
        if (player.reality.exp.buys[1] === undefined) player.reality.exp.buys[1] = 0
        player.reality.exp.buys[1]++
        updateExponential()
        document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`
    }
}

function upgradePenalty() {
    if (REALITY.exp.pen.can()) {
        player.reality.points = player.reality.points.sub(REALITY.exp.pen.cost())
        if (player.reality.exp.buys[2] === undefined) player.reality.exp.buys[2] = 0
        player.reality.exp.buys[2]++
        updateExponential()
        document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`
    }
}

function reality() {
    if (REALITY.canReset()) if (confirm('Reality will reset everything except achievements and challenge records. You will also gain an Reality point, Reality shards and unlock various upgrades.')) {
        giveAchievement("Time is realistic")
        let havent = true
        for (let x = 5; x <= 8; x++) if (player['timeDimension'+x].bought > 0) {
            havent = false
            break
        }
        if (havent) giveAchievement("I not really buy time, because i had bad day")

        player.reality.points = player.reality.points.add(REALITY.points())
        player.reality.shards = player.reality.shards.add(REALITY.shards())

        if (player.eternityPoints.gt(player.reality.bestPointsGained)) player.reality.bestPointsGained = player.eternityPoints
        if (player.reality.points.gt(player.reality.bestPoints)) player.reality.bestPoints = player.reality.points
        player.reality.times += 1
        if (player.reality.time < player.reality.bestTime) player.reality.bestTime = player.reality.time
        player.reality.time = 0
        if (player.achievements.includes('ngr11')) player.eternities = 20000
        else player.eternities = 0

        player.reality.exp.amount = new Decimal(1)
        
        eternity(true, true)
        
        respecTimeStudies(true)
        if (!REALITY.milestones_req.can(1)) player.eternityChalls = {}
        player.eternityChallUnlocked = 0
        player.currentEternityChall = ""
        player.eternityUpgrades = []
        player.epmult = new Decimal(1)
        player.epmultCost = new Decimal(500)
        player.dilation.studies = []
        if (REALITY.milestones_req.can(2)) player.dilation.studies = [1]
        if (player.achievements.includes('ngr12')) player.dilation.studies.push(2,3,4,5)
        player.dilation.tachyonParticles = new Decimal(0)
        if (REALITY.milestones_req.can(2)) player.dilation.tachyonParticles = new Decimal(1e3)
        player.dilation.dilatedTime = new Decimal(0)
        player.dilation.upgrades = []
        player.dilation.freeGalaxies = 0
        player.dilation.rebuyables = {1: 0, 2: 0, 3: 0}
        player.dilation.active = false
        player.bestEternity = 9999999999
        player.eternityPoints = new Decimal(0)
        player.timestudy.theorem = 0
        player.timestudy.amcost = new Decimal("1e20000"),
		player.timestudy.ipcost = new Decimal(1),
		player.timestudy.epcost = new Decimal(1),

        showTab("dimensions")
		showDimTab("antimatterdimensions")
		showChallengesTab("challenges")
		showInfTab("preinf")
		showEternityTab("timestudies", true)

        for (let x = 1; x <= 8; x++) player['timeDimension'+x] = {
			cost: timeDimCost(x, 0),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		}
        player.timeShards = new Decimal(0)
        player.tickThreshold = new Decimal(1)
		player.totalTickGained = 0

        setInitialDimensionPower()
        resetUP()
        player.replicanti.galaxies = 0
        updateRespecButtons()
        if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
        if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
        if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
        updateAutobuyers()
        if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4);
        if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4);
        if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
        resetInfDimensions();
        updateChallenges();
        updateNCVisuals()
        updateChallengeTimes()
        updateLastTenRuns()
        updateLastTenEternities()
        if (!player.achievements.includes("r133") && !bigRip) {
            var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
            for (var i = 0; i < infchalls.length; i++) infchalls[i].style.display = "none"
        }
        IPminpeak = new Decimal(0)
        EPminpeakType = 'normal'
        EPminpeak = new Decimal(0)
        updateAutobuyers()
        updateMilestones()
        resetTimeDimensions()
        hideDimensions()
        if (tmp.ngp3) document.getElementById("infmultbuyer").textContent="Max buy IP mult"
        else document.getElementById("infmultbuyer").style.display = "none"
        hideMaxIDButton()
        document.getElementById("replicantidiv").style.display="none"
        document.getElementById("replicantiunlock").style.display="inline-block"
        document.getElementById("replicantiresettoggle").style.display = "none"
        delete player.replicanti.galaxybuyer
        var shortenedIP = shortenDimensions(player.infinityPoints)
        document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenedIP + "</span> Infinity points."
        document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenedIP + "</span> Infinity points."
        document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
        document.getElementById("eternityPoints2").style.display = "inline-block"
        document.getElementById("eternitystorebtn").style.display = "inline-block"
        updateEternityUpgrades()
        document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
        hideDimensions()
        tmp.tickUpdate = true
        playerInfinityUpgradesOnEternity()
        document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
        document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: 1x<p>Cost: 500 EP"
        updateEternityChallenges()
        updateTheoremButtons()
        updateTimeStudyButtons()
        updateDilationUpgradeCosts()
        drawStudyTree()
        setInitialMoney()

        updateReality()
        updateRealityUpgrades()
    }
}

const REALITY = {
    points() {
        let gain = Decimal.pow(5, new Decimal(new Decimal(player.eternityPoints).max(1).log('1e10000')).sub(1)).div(5).pow(1/2)
        if (gain.lt(1)) return new Decimal(0)

        return gain.floor()
    },
    shards() {
        let gain = new Decimal(1)
        return gain
    },
    canReset() {
        return this.points().gte(1)
    },
    milestones_req: {
        can(x) { return player.reality.bestPointsGained.gte(REALITY.milestones_req[x]) },
        1: new Decimal('1e60000'),
        2: new Decimal('1e80000'),
    },
    upgs: {
        /*
        1: {
            desc: 'Placeholder.',
            cost: new Decimal(1),
            can() { return player.reality.shards.gte(this.cost) },
            effect() {
                let eff = new Decimal(1)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        */
        1: {
            desc: 'Increase Infinity Power raising effect from ^7 to ^10.',
            cost: new Decimal(1),
            can() { return player.reality.shards.gte(this.cost) },
        },
        2: {
            desc: 'Multiples EP gain based on your replicanti.',
            cost: new Decimal(1),
            can() { return player.reality.shards.gte(this.cost) },
            effect() {
                let eff = player.replicanti.amount.pow(.25)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        3: {
            desc: 'Unlock Exponential.',
            cost: new Decimal(1),
            can() { return player.reality.shards.gte(this.cost) },
        },
        4: {
            desc: 'Raise TP gain by 1.5.',
            cost: new Decimal(1),
            can() { return player.reality.shards.gte(this.cost) },
        },
    },
    exp: {
        gain() {
            if (!player.reality.upgrades.includes(3)) return new Decimal(1)
            let gain = new Decimal(1)
            gain = gain.times(this.mult.effect())
            return Decimal.add(1, gain.div(Decimal.pow(player.reality.exp.amount.log(10), 0.5).add(1).pow(Decimal.pow(player.reality.exp.amount.log(100),this.pen.effect()))))
            //E(player.number.log10().pow(1/2).add(2)).pow(player.number.log10().div(2)))
        },
        have(x) {
            if (player.reality.exp.buys[x]) return player.reality.exp.buys[x]
            else return 0
        },
        effect(x=player.reality.exp.amount) {
            let eff = x.pow(10).pow(x.log(10)**(2/3))
            return eff
        },
        mult: {
            cost(x=REALITY.exp.have(1)) { return Decimal.pow(3,x) },
            can() { return player.reality.points.gte(this.cost()) },
            effect(x=REALITY.exp.have(1)) {
                let eff = Decimal.pow(2, x)
                return eff
            },
        },
        pen: {
            cost(x=REALITY.exp.have(2)) { return Decimal.pow(4,x+1) },
            can() { return player.reality.points.gte(this.cost()) },
            effect(x=REALITY.exp.have(2)) {
                let eff = Decimal.pow(0.95, x)
                return eff
            },
        },
    },
}
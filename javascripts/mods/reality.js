function updateReality() {
    document.getElementById('realityBlock2').style.display = 'none'
    document.getElementById('realityBlock').style.height = '0px'
    if (!player.reality) return;
    document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`

    updateRealityUpgrades()
    updateGainRPMilestones()
    updateExponential()
    tabRealityUpdate()
    gainRealityUpdate()
    updateRealStudies()
    updateShardBooster()

    document.getElementById('respecReality').style.display = REALITY.milestones_req.can(4) ? '' : 'none'

    REALITYDisplay()
}

function tabRealityUpdate() {
    document.getElementById('rexp').style.display = (player.reality.upgrades.includes(3)) ? "inline-block" : 'none'
    document.getElementById('rsboost').style.display = (player.reality.sb.unl) ? "inline-block" : 'none'
}

function gainRealityUpdate() {
    if (REALITY.canReset() || player.reality.times > 0) {
        document.getElementById('realityBlock2').style.display = ''
        document.getElementById('realityBlock').style.height = '120px'
    } else {
        document.getElementById('realityBlock2').style.display = 'none'
        document.getElementById('realityBlock').style.height = '0px'
    }
    document.getElementById("realitystorebtn").style.display = (player.reality.times > 0) ? "inline-block" : 'none'
    document.getElementById('realitybtn').style.display = (REALITY.canReset() && !player.dilation.active) ? '' : 'none'
    document.getElementById('realityconf').style.display = (player.reality.times > 0) ? 'inline' : 'none'
}

function toggleRealityConf() {
    player.reality.conf = !player.reality.conf
    document.getElementById('realityconf').innerHTML = 'Reality confirmation: '+(player.reality.conf?'ON':"OFF")
}

function setRealityIfUndefined() {
    if (!player.reality) return
    let p_real = player.reality
    let data = getRealityData()

    if (p_real.points === undefined) p_real.points = data.points
    if (p_real.shards === undefined) p_real.shards = data.shards
    if (p_real.bestShards === undefined) p_real.bestShards = data.bestShards
    if (p_real.times === undefined) p_real.times = data.times
    if (p_real.time === undefined) p_real.time = data.time
    if (p_real.bestTime === undefined) p_real.bestTime = data.bestTime
    if (p_real.upgrades === undefined) p_real.upgrades = data.upgrades
    if (p_real.bestPoints === undefined) p_real.bestPoints = data.bestPoints
    if (p_real.bestPointsGained === undefined) p_real.bestPointsGained = data.bestPointsGained
    if (p_real.exp === undefined) p_real.exp = {}
    if (p_real.sb === undefined) p_real.sb = {}
    if (p_real.conf === undefined) p_real.conf = false
    if (p_real.respec === undefined) p_real.respec = false
    if (p_real.studies === undefined) p_real.studies = []

    let p_exp = p_real.exp
    if (p_exp.amount === undefined) p_exp.amount = data.exp.amount
    if (p_exp.buys === undefined) p_exp.buys = data.exp.buys

    let p_sb = p_real.sb
    if (p_sb.unl === undefined) p_sb.unl = false
    if (p_sb.resources === undefined) p_sb.resources = {}
    for (let x = 1; x < 4; x++) if (p_sb.resources[x] === undefined) p_sb.resources[x] = new Decimal(0)
    if (p_sb.boosters === undefined) p_sb.boosters = {}
    for (let x = 1; x < 4; x++) if (p_sb.boosters[x] === undefined) p_sb.boosters[x] = new Decimal(0)
    if (p_sb.sort === undefined) p_sb.sort = data.sb.sort

    if (player.autoEterOptions === undefined) player.autoEterOptions = {}
    let p_autoE = player.autoEterOptions

    if (p_autoE.epmult === undefined) p_autoE.epmult = false
    if (p_autoE.rebuyupg === undefined) p_autoE.rebuyupg = false
    for (let x = 1; x < 9; x++) if (p_autoE['td'+x] === undefined) p_autoE['td'+x] = false

    if (player.galaxyMaxBulk === undefined) player.galaxyMaxBulk = false
}

function conToDeciReality() {
    if (player.reality) {
        player.reality.points = new Decimal(player.reality.points)
        player.reality.shards = new Decimal(player.reality.shards)
        player.reality.bestShards = new Decimal(player.reality.bestShards)
        player.reality.bestPoints = new Decimal(player.reality.bestPoints)
        player.reality.bestPointsGained = new Decimal(player.reality.bestPointsGained)
        player.reality.exp.amount = new Decimal(player.reality.exp.amount)
        for (let x = 1; x < 4; x++) {
            player.reality.sb.resources[x] = new Decimal(player.reality.sb.resources[x])
            player.reality.sb.boosters[x] = new Decimal(player.reality.sb.boosters[x])
        }
    }
}

function realUpgsDisplay() {
    for (let x = 1; x <= 9; x++) {
        let upg = REALITY.upgs[x]
        document.getElementById('real'+x).innerHTML = upg.desc
        +(upg.effDesc?("<br>Currently: "+upg.effDesc()):'')+
        "<br>Cost: "+shortenCosts(upg.cost())+' RS'
    }
}

function buyRealityUpgrade(name) {
	if (REALITY.upgs[name].can() && !player.reality.upgrades.includes(name)) {
		player.reality.upgrades.push(name)
		player.reality.shards = player.reality.shards.minus(REALITY.upgs[name].cost())
		updateRealityUpgrades();
        document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`
        tabRealityUpdate()
	}
}

function REALITYDisplay() {
    realityGainDisplay()
    document.getElementById('rebuyupgauto').textContent="Rebuyable upgrade auto: O"+(player.autoEterOptions.rebuyupg?"N":"FF")
    document.getElementById('realityconf').innerHTML = 'Reality confirmation: '+(player.reality.conf?'ON':"OFF")
    document.getElementById('epmultauto').textContent="Auto: O"+(player.autoEterOptions.epmult?"N":"FF")
    if (document.getElementById("realityupgrades").style.display == "block") realUpgsDisplay()
    if (document.getElementById("exponential").style.display == "block") exponentialDisplay()
    if (document.getElementById("shardbooster").style.display == "block") shardBoosterDisplay()
}

//Shard Booster
function shardBoosterDisplay() {
    document.getElementById('sbbest').innerHTML = shortenDimensions(player.reality.bestShards)
    document.getElementById('sbamount').innerHTML = shortenDimensions(getShardBooster())
    document.getElementById('sbreq').innerHTML = shortenDimensions(getShardBoosterRequirement())
    document.getElementById('sbunspent').innerHTML = shortenDimensions(getUnspentSB())

    for (let x = 1; x < 4; x++) {
        document.getElementById('sb'+x).innerHTML = shortenDimensions(player.reality.sb.boosters[x])
        document.getElementById('sbe'+x).innerHTML = shortenDimensions(SBEff[x]())
        document.getElementById('sb'+x+'p').innerHTML = shortenDimensions(player.reality.sb.resources[x])+' (+'+shortenDimensions(getPartsGain(x))+'/s)'
    }
}

function changeShardAssortPercentage(x) {
    player.reality.sb.sort = x
    updateShardBooster()
}

function getShardBooster() {
    let exp = player.reality.studies.includes(81)?2.5:3
    return player.reality.bestShards.root(exp).floor()
}

function getShardBoosterRequirement() {
    let exp = player.reality.studies.includes(81)?2.5:3
    return getShardBooster().add(1).pow(exp).floor()
}

function getUnspentSB() {
    let sb = getShardBooster()
    for (let x = 1; x < 4; x++) sb = sb.minus(player.reality.sb.boosters[x])
    return sb.ceil()
}

function getPartsGain(x) {
    let ret = player.reality.sb.boosters[x].pow(5)
    if (x == 1 && player.reality.studies.includes(83)) ret = ret.mul(RStudies[83].eff())
    return ret
}

function assignShard(x) {
    if (getUnspentSB().gte(1)) {
        let gain = getUnspentSB().mul(player.reality.sb.sort/100).ceil()
        player.reality.sb.boosters[x] = player.reality.sb.boosters[x].add(gain).ceil()
        updateShardBooster()
    }
}

function updateShardBooster() {
    if (!player.reality) return
    let assort = [10, 25, 50, 100]
    for (let x = 0; x < assort.length; x++) {
        document.getElementById('sbap_'+assort[x]).className = (player.reality.sb.sort == assort[x]) ? 'chosenbtn2' : 'storebtn'
    }
    for (let x = 1; x < 4; x++) document.getElementById('sba'+x).className = (getUnspentSB().lt(1)) ? 'unavailablebtn' : 'storebtn'
}

function SPartsPassiveGain(dt) {
    if (player.reality) for (let x = 1; x < 4; x++) player.reality.sb.resources[x] = player.reality.sb.resources[x].add(getPartsGain(x).mul(dt))
}

const SBEff = {
    1() {
        let eff = player.reality.sb.resources[1].max(1).pow(100)
        return eff
    },
    2() {
        let eff = player.reality.sb.resources[2].max(1).pow(500000)
        return eff
    },
    3() {
        let eff = player.reality.sb.resources[3].max(1).pow(2)
        return eff
    },
}


function realityGainDisplay() {
    document.getElementById('realirtbtnFlavor').innerHTML = (player.reality.times > 0)?"":"I'm tired of these games..... I need to become Real";
    document.getElementById('realitybtnRPGain').innerHTML = (player.reality.times > 0)?`Gain <b>${shortenDimensions(REALITY.points())}</b> Reality points and <b>${shortenDimensions(REALITY.shards())}</b> Reality shards.`:"";
}

function updateRealityUpgrades() {
    for (let x = 1; x <= 9; x++) {
        document.getElementById("real"+x).className = (player.reality.upgrades.includes(x)) ? "realityupbtnbought" : (REALITY.upgs[x].can()) ? "realityupbtn" : "realityupbtnlocked"
        document.getElementById("real"+x).style.visibility = (REALITY.upgs[x].unl()) ? 'visible' : 'invisible'
    }
    let have = 0
    for (let x = 1; x <= 4; x++) if (player.reality.upgrades.includes(x)) have++
    if (have == 4) giveAchievement("Finally pass first row")
}

function updateGainRPMilestones() {
    for (let x = 1; x <= 6; x++) {
        document.getElementById("gainrp"+x).className = (REALITY.milestones_req.can(x)) ? "gainrpmilestone unlocked" : "gainrpmilestone"
    }
}

function updateExponential() {
    document.getElementById('expmult').className = (REALITY.exp.mult.can())?'storebtn':'unavailablebtn'
    document.getElementById('exppen').className = (REALITY.exp.pen.can() && REALITY.exp.pen.effect().gt(.5))?'storebtn':'unavailablebtn'
}

function exponentialDisplay() {
    document.getElementById('expamount').innerHTML = shortenMoney(player.reality.exp.amount)
    document.getElementById('expeffect').innerHTML = shortenMoney(REALITY.exp.effect())
    document.getElementById('expgain').innerHTML = longMoney(REALITY.exp.gain())

    document.getElementById('expbeyond').style.display = REALITY.exp.beyond().gt(0)?'':'none'
    document.getElementById('expbeyondeff').innerHTML = '^'+longMoney(REALITY.exp.beyond())

    document.getElementById('expmult').innerHTML = `Multiplier: x${shortenMoney(REALITY.exp.mult.effect())}<br>-> x${shortenMoney(REALITY.exp.mult.effect(REALITY.exp.have(1)+1))} Costs: ${shortenDimensions(REALITY.exp.mult.cost())} RP`
    document.getElementById('exppen').innerHTML = (REALITY.exp.pen.effect().lte(.5))
    ?`Penalty: ^${longMoney(REALITY.exp.pen.effect())}`
    :`Penalty: ^${longMoney(REALITY.exp.pen.effect())}<br>-> ^${longMoney(REALITY.exp.pen.effect(REALITY.exp.have(2)+1))} Costs: ${shortenDimensions(REALITY.exp.pen.cost())} RP`
    +(REALITY.exp.beyond().gt(0)?('<br>Beyond, ^'+longMoney(REALITY.exp.beyond())):'')
}

function ExponentialPassiveGain(dt) {
    if (player.reality) {
        player.reality.exp.amount = player.reality.exp.amount.mul(REALITY.exp.gain().pow(dt))
        if (player.reality.exp.amount.gte('1e20')) giveAchievement('Mini-replicanti')
        if (player.money.gte('1e10000000000')) giveAchievement('10^^3')
    }
}

function RealityShardsPassiveGain(dt) {
    if (player.reality) {
        if (player.reality.upgrades.includes(9)) {
            player.reality.shards = player.reality.shards.add(REALITY.upgs[9].effect().div(60).mul(dt))
            if (player.reality.shards.gt(player.reality.bestShards)) player.reality.bestShards = player.reality.shards
            document.getElementById('realityPoints1').innerHTML = `You have <span class='RPAmount'>${shortenDimensions(player.reality.points)}</span> Reality points and<br><span class='RPAmount'>${shortenDimensions(player.reality.shards)}</span> Reality shards.`
        }
    }
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
    if (REALITY.canReset()) if (player.reality.conf?confirm('Reality will reset everything except achievements and challenge records. You will also gain an Reality point, Reality shards and unlock various upgrades.'):true) {
        giveAchievement("Time is realistic")
        let havent = true
        for (let x = 5; x <= 8; x++) if (player['timeDimension'+x].bought > 0) {
            havent = false
            break
        }
        if (havent) giveAchievement("I not really buy time, because i had bad day")
        if (player.infinityDimension1.amount.lte(0) && player.infinityDimension1.bought <= 0 && player.timeDimension1.amount.lte(0) && player.timeDimension1.bought <= 0) giveAchievement('Non-Free Tickspeed & Non-Free Multiplier')

        player.reality.points = player.reality.points.add(REALITY.points())
        player.reality.shards = player.reality.shards.add(REALITY.shards())

        if (player.reality.respec) {
            let keep = [61]
            let save = []
            for (let x = 0; x < keep.length; x++) if (player.reality.studies.includes(keep[x])) save.push(keep[x])
            player.reality.studies = save
            player.reality.respec = false
        }

        if (player.eternityPoints.gt(player.reality.bestPointsGained)) player.reality.bestPointsGained = player.eternityPoints
        if (player.reality.points.gt(player.reality.bestPoints)) player.reality.bestPoints = player.reality.points
        if (player.reality.shards.gt(player.reality.bestShards)) player.reality.bestShards = player.reality.shards
        player.reality.times += 1
        if (player.reality.time < player.reality.bestTime) player.reality.bestTime = player.reality.time
        if (player.reality.bestTime < 300) giveAchievement("Reality go brrr")
        player.reality.time = 0
        if (player.achievements.includes('ngr11')) player.eternities = 20000
        else player.eternities = 0
        
        player.reality.exp.amount = new Decimal(1)
        
        eternity(true, true)
        if (!player.reality.studies.includes(71)) player.replicanti.gal = 0
        
        respecTimeStudies(!REALITY.milestones_req.can(4))
        if (!REALITY.milestones_req.can(1)) player.eternityChalls = {}
        player.eternityChallUnlocked = 0
        player.currentEternityChall = ""
        if (!REALITY.milestones_req.can(3)) player.eternityUpgrades = []
        player.epmult = new Decimal(1)
        player.epmultCost = new Decimal(500)
        player.dilation.studies = []
        if (REALITY.milestones_req.can(2)) player.dilation.studies = [1]
        if (player.achievements.includes('ngr12')) player.dilation.studies.push(2,3,4,5)
        player.dilation.tachyonParticles = new Decimal(0)
        player.dilation.totalTachyonParticles = new Decimal(0)
        if (REALITY.milestones_req.can(2)) {
            player.dilation.tachyonParticles = new Decimal(1e3)
            player.dilation.totalTachyonParticles = new Decimal(1e3)
        }
        player.dilation.dilatedTime = new Decimal(0)
        if (!REALITY.milestones_req.can(3)) player.dilation.upgrades = []
        player.dilation.freeGalaxies = 0
        player.dilation.rebuyables = {1: 0, 2: 0, 3: 0}
        player.dilation.active = false
        player.bestEternity = 9999999999
        player.eternityPoints = new Decimal(0)
        if (player.achievements.includes('ngr17')) player.eternityPoints = new Decimal('1e5000')
        player.timestudy.theorem = 0
        player.timestudy.amcost = new Decimal("1e20000")
		player.timestudy.ipcost = new Decimal(1)
		player.timestudy.epcost = new Decimal(1)

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
        if (!player.achievements.includes('ngr11')) delete player.replicanti.galaxybuyer
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
        if (gain.gte(1e10)) gain = gain.div(1e10).pow(.4).mul(1e10)

        return gain.floor()
    },
    shards() {
        let gain = new Decimal(1)
        if (player.reality.upgrades.includes(6)) gain = gain.times(REALITY.upgs[6].effect())
        if (player.reality.studies.includes(72)) gain = gain.times(10)
        if (player.reality.studies.includes(81)) gain = gain.mul(RStudies[81].eff())
        return gain.floor()
    },
    canReset() {
        return this.points().gte(1)
    },
    dilations_eff: {
        82() {
            let eff = Decimal.pow(player.timestudy.theorem+1, 3/5)
            return eff
        },
    },
    milestones_req: {
        can(x) { return player.reality ? player.reality.bestPointsGained.gte(REALITY.milestones_req[x]) : false },
        1: new Decimal('1e60000'),
        2: new Decimal('1e80000'),
        3: new Decimal('1e100000'),
        4: new Decimal('1e200000'),
        5: new Decimal('1e600000'),
        6: new Decimal('1e800000'),
    },
    upgs: {
        /*
        1: {
            desc: 'Placeholder.',
            unl() { return true },
            cost() { return new Decimal(1) },
            can() { return player.reality.shards.gte(this.cost()) },
            effect() {
                let eff = new Decimal(1)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        */
        1: {
            desc: 'Increase Infinity Power raising effect from ^7 to ^10.',
            unl() { return true },
            cost() { return new Decimal(1) },
            can() { return player.reality.shards.gte(this.cost()) },
        },
        2: {
            desc: 'Multiples EP gain based on your replicanti.',
            unl() { return true },
            cost() { return new Decimal(1) },
            can() { return player.reality.shards.gte(this.cost()) },
            effect() {
                let eff = player.replicanti.amount.pow(.25)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        3: {
            desc: 'Unlock Exponential.',
            unl() { return true },
            cost() { return new Decimal(1) },
            can() { return player.reality.shards.gte(this.cost()) },
        },
        4: {
            desc: 'Raise DT gain by 1.5.',
            unl() { return true },
            cost() { return new Decimal(1) },
            can() { return player.reality.shards.gte(this.cost()) },
        },
        5: {
            desc: 'You can buy replicate chance beyond 100%.',
            unl() { return REALITY.milestones_req.can(2) },
            cost() { return new Decimal(2) },
            can() { return player.reality.shards.gte(this.cost()) && player.reality.upgrades.includes(1) },
        },
        6: {
            desc: 'Gain more RS based on Realities.',
            unl() { return REALITY.milestones_req.can(2) },
            cost() { return new Decimal(2) },
            can() { return player.reality.shards.gte(this.cost()) && player.reality.upgrades.includes(2) },
            effect() {
                let eff = Decimal.pow(player.reality.times, .5)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        7: {
            desc: 'You gain replicanti faster based on your exponential.',
            unl() { return REALITY.milestones_req.can(2) },
            cost() { return new Decimal(2) },
            can() { return player.reality.shards.gte(this.cost()) && player.reality.upgrades.includes(3) },
            effect() {
                let eff = Decimal.pow(player.reality.exp.amount, .15)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        8: {
            desc: 'You gain exponential faster based on dilated time.',
            unl() { return REALITY.milestones_req.can(2) },
            cost() { return new Decimal(2) },
            can() { return player.reality.shards.gte(this.cost()) && player.reality.upgrades.includes(4) },
            effect() {
                let eff = Decimal.max(1, Decimal.max(1, player.dilation.dilatedTime.add(1).log(10)).log(10))
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'x' }
        },
        9: {
            desc: 'Generate 10% of RS based on fastest Reality.',
            unl() { return player.reality.sb.unl },
            cost() { return new Decimal(200) },
            can() { return player.reality.shards.gte(this.cost()) && player.reality.upgrades.includes(4) },
            effect() {
                let eff = REALITY.shards().mul(1/player.reality.bestTime).mul(60)
                return eff
            },
            effDesc(x=this.effect()) { return shortenMoney(x)+'/min' }
        },
    },
    exp: {
        gain() {
            if (!player.reality.upgrades.includes(3)) return new Decimal(1)
            let gain = new Decimal(1)
            gain = gain.times(this.mult.effect())
            return Decimal.add(1, gain.div(Decimal.pow(player.reality.exp.amount.log(10), 0.5).add(1).pow(Decimal.pow(player.reality.exp.amount.log(100),this.pen.effect().max(REALITY.exp.beyond())))))
            //E(player.number.log10().pow(1/2).add(2)).pow(player.number.log10().div(2)))
        },
        have(x) {
            if (player.reality.exp.buys[x]) return player.reality.exp.buys[x]
            else return 0
        },
        effect(x=player.reality.exp.amount) {
            let eff = x.pow(10).pow(x.log(10)**(2/3))
            if (eff.gte('1e10000')) eff = eff.div('1e10000').pow(0.1).mul('1e10000')
            if (eff.gte('1e30000')) eff = eff.div('1e30000').pow(0.1).mul('1e30000')
            return eff
        },
        beyond() {
            if (player.reality.exp.amount.lt('1e1000')) return new Decimal(0)
            let eff = Decimal.sub(player.reality.exp.amount.log(10), 1000).div(100).add(1).pow(0.25)
            return this.pen.effect().mul(eff)
        },
        mult: {
            cost(x=REALITY.exp.have(1)) { return Decimal.pow(3,x) },
            can() { return player.reality.points.gte(this.cost()) },
            effect(x=REALITY.exp.have(1)) {
                let base = new Decimal(2)
                if (player.achievements.includes('ngr16')) base = base.times(2)
                if (player.reality.studies.includes(41)) base = base.times(4)
                if (player.reality.studies.includes(73) && player.reality.exp.amount.gte('1e1000')) base = base.times(2)
                if (player.reality.upgrades.includes(8)) base = base.times(REALITY.upgs[8].effect())
                let eff = Decimal.pow(base, x)
                return eff
            },
        },
        pen: {
            cost(x=REALITY.exp.have(2)) { return Decimal.pow(4,x+1) },
            can() { return player.reality.points.gte(this.cost()) },
            effect(x=REALITY.exp.have(2)) {
                if (x >= 10) x = (x-10)**(1/3)+10
                let eff = Decimal.pow(0.95, x)
                return eff.max(0.5)
            },
        },
    },
}
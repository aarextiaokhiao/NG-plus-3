function buyRealStudy(name) {
    if (canBuyRealStudy(name)) {
        player.timestudy.theorem -= RStudies[name].cost()
        player.reality.studies.push(name)
        updateRealStudies()
        if (name == 61 && !player.reality.sb.unl) {
            player.reality.sb.unl = true
            showRealityTab('shardbooster')
            showTab('reality')
        }
        if (name == 91 && !player.reality.chal.unl) {
            player.reality.chal.unl = true
            showChallengesTab('realitychallenges')
            showTab('challenges')
        }
        tabRealityUpdate()
    }
}

function canBuyRealStudy(name) {
    let and = (name == 51)
	let bought = (name == 11) ? (player.dilation.studies.includes(5)) : canBuyRealStudyBranch(name, and)
    if (name == 91) bought = player.money.gte('1e200000000000')
    return ((player.timestudy.theorem >= RStudies[name].cost()) && bought && !player.reality.studies.includes(name))
}

function canBuyRealStudyBranch(name, and=false) {
    let have = and ? 0 : false
    for (let x = 0; x < RSBranch[name].length; x++) {
        if (player.reality.studies.includes(RSBranch[name][x])) have = and ? (have + 1) : true
        if (and ? false : have) break
    }
    return and ? (have >= RSBranch[name].length) : have
}

function respecRealityToggle() {
	player.reality.respec = !player.reality.respec
	updateRespecButtons()
}

const RStudies = {
    /*11: {
        cost() { return 1e19 },
        eff() {
            let eff = new Decimal(1)
            return eff
        },
        effDesc(x=this.eff()) { return shortenMoney(x)+'x' }
    },*/
    11: {
        cost() { return 1e20 },
    },
    21: {
        cost() { return player.reality.studies.includes(22) ? 5e21 : 1e21 },
    },
    22: {
        cost() { return player.reality.studies.includes(21) ? 5e21 : 1e21 },
        eff() {
            let eff = Decimal.pow(player.eternityPoints.log(10)+1, 1.5)
            return eff
        },
        effDesc(x=this.eff()) { return '√'+shortenMoney(x) }
    },
    31: {
        cost() {
            let have = 0
            for (let x = 1; x <= 4; x++) if (player.reality.studies.includes(30+x)) have++
            return 1e22 * (25 ** have)
        },
        eff() {
            let eff = Decimal.div(player.reality.exp.amount.log(10)+1, 5)
            return eff
        },
        effDesc(x=this.eff()) { return '^'+shortenMoney(x) }
    },
    32: {
        cost() {
            let have = 0
            for (let x = 1; x <= 4; x++) if (player.reality.studies.includes(30+x)) have++
            return 1e22 * (25 ** have)
        },
    },
    33: {
        cost() {
            let have = 0
            for (let x = 1; x <= 4; x++) if (player.reality.studies.includes(30+x)) have++
            return 1e22 * (25 ** have)
        },
    },
    34: {
        cost() {
            let have = 0
            for (let x = 1; x <= 4; x++) if (player.reality.studies.includes(30+x)) have++
            return 1e22 * (25 ** have)
        },
    },
    41: {
        cost() { return player.reality.studies.includes(42) ? 5e25 : 5e24 },
    },
    42: {
        cost() { return player.reality.studies.includes(41) ? 5e25 : 5e24 },
        eff() {
            let eff = Math.floor(player.replicanti.galaxies/100)/100+1
            return eff
        },
    },
    51: {
        cost() { return 5e26 },
    },
    61: {
        cost() { return 2.5e27 },
    },
    71: {
        cost() { return player.reality.studies.includes(75) ? 4e40 : 2e39 },
    },
    72: {
        cost() { return player.reality.studies.includes(74) ? 1e38 : 1e37 },
    },
    73: {
        cost() { return 2.5e35 },
    },
    74: {
        cost() { return player.reality.studies.includes(72) ? 1e38 : 1e37 },
        eff() {
            let eff = new Decimal(player.reality.points.log(10))
            return eff
        },
        effDesc(x=this.eff()) { return shortenMoney(x)+'x' }
    },
    75: {
        cost() { return player.reality.studies.includes(71) ? 4e40 : 2e39 },
        eff() {
            let eff = getShardBooster().max(1).pow(2)
            return eff
        },
        effDesc(x=this.eff()) { return '^'+shortenMoney(x) }
    },
    81: {
        cost() { return player.reality.studies.includes(83) ? 1e42 : 2.5e40 },
        eff() {
            let eff = getShardBooster().max(1).pow(0.5)
            return eff
        },
        effDesc(x=this.eff()) { return shortenMoney(x)+'x' }
    },
    82: {
        cost() { return 1e41 },
    },
    83: {
        cost() { return player.reality.studies.includes(81) ? 1e42 : 2.5e40 },
        eff() {
            let eff = player.reality.sb.resources[2].max(1).pow(1/6)
            return eff
        },
        effDesc(x=this.eff()) { return shortenMoney(x)+'x' }
    },
    91: {
        cost() { return 1e44 },
    },
    101: {
        cost() { return 1e45 },
        eff() {
            let eff = getShardBooster().max(0).pow(2)
            return eff
        },
        effDesc(x=this.eff()) { return shortenMoney(x)+'x' }
    },
    102: {
        cost() { return 1e48 },
        eff() {
            let eff = Decimal.pow(player.reality.points.max(1).log(10), 2.5)
            return eff
        },
        effDesc(x=this.eff()) { return shortenMoney(x)+'x' }
    },
    103: {
        cost() { return player.reality.studies.includes(104) ? 1e53 : 1e52 },
    },
    104: {
        cost() { return player.reality.studies.includes(103) ? 1e53 : 1e52 },
        eff() {
            let eff = Math.floor(player.dilation.freeGalaxies/5)
            return eff
        },
        effDesc(x=this.eff()) { return shortenDimensions(x)+' galaxies later' }
    },
}

const RSBranch = {
    21: [11], 22: [11],
    31: [21], 32: [21], 33: [22], 34: [22],
    41: [31,32], 42: [33,34],
    51: [41,42],
    61: [51],
    71: [72], 72: [73], 73: [61], 74: [73], 75: [74],
    81: [72], 82: [73], 83: [74],
    91: [82],
    101: [91], 102: [101], 103: [102], 104: [102],
}

const RSRows = 10

var all_real = []

function updateRealStudies() {
    all_real = []
    for (let r = 1; r <= RSRows; r++) {
        for (let c = 1; c <= 10; c++) {
            let id = r*10+c

            let div = document.getElementById('realstudy'+id)
            if (div !== null) {
                div.style.display = (player.reality ? REALITY.milestones_req.can(4) : false) ? '' : 'none'
                if (player.reality) {
                    div.className = canBuyRealStudy(id) ? "realstudy" : (player.reality.studies.includes(id) ? "realstudybought" : "realstudylocked")
                    div.onclick = () => {buyRealStudy(id)}
                }
                all_real.push(id)
            }
        }
    }
}

function displayRealStudies() {
    for (let r = 1; r <= RSRows; r++) {
        for (let c = 1; c <= 10; c++) {
            let id = r*10+c

            let cost = document.getElementById('realstudycost'+id)
            let desc = document.getElementById('realstudydesc'+id)
            if (cost !== null) cost.innerHTML = shortenDimensions(RStudies[id].cost()) + ' Time Theorems'
            if (desc !== null) desc.innerHTML = 'Currently: ' + RStudies[id].effDesc()
        }
    }
}
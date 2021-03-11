function buyRealStudy(name) {
    if (canBuyRealStudy(name)) {
        player.timestudy.theorem -= RStudies[name].cost()
        player.reality.studies.push(name)
        updateRealStudies()
    }
}

function canBuyRealStudy(name) {
    let and = (name == 51)
	let bought = (name == 11) ? (player.dilation.studies.includes(5)) : canBuyRealStudyBranch(name, and)
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
        cost() { return 1e26 },
    },
}

const RSBranch = {
    21: [11], 22: [11],
    31: [21], 32: [21], 33: [22], 34: [22],
    41: [31,32], 42: [33,34],
    51: [41,42],
}

const RSRows = 5

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
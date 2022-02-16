const GRAVITON_UPGS = [
    {
        desc: "Tickspeed affect Gravitons gain at a reduced rate.",
        cost: E(300),
        eff() {
            let x = E(-player.tickspeed.log10()).max(1).root(10)
            if (hasBosonicUpg(54) && tmp.blu) x = x.pow(tmp.blu[54])
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Light threshold is cheaper based on your best Graviton.",
        cost: E(1.5e4),
        eff() {
            let x = player.ghostify.gravitons.best.add(1).pow(1.5)
            if (hasBosonicUpg(54) && tmp.blu) x = x.pow(tmp.blu[54])
            return x
        },
        effDesc(x) { return shorten(x)+"x cheaper" },
    },{
        desc: "Gravitons gain is multiplied by Bosonic speed.",
        cost: E(5e4),
    },{
        desc: "Ghostly Photons & Dark Matters gains are boosted by Higgs Bosons. Unlock more Bosonic Upgrades.",
        cost: E(1e6),
        eff() {
            let x = E(1.5).pow(player.ghostify.hb.higgs)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Nanofield does not need to be active to gain Preon Charge, and you gain more Preon Charge based on your GHP.",
        cost: E(1e7),
        eff() {
            let x = player.ghostify.ghostParticles.add(1).root(50)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Get ^0.5 of Electrons translation while in any QCs, or Big Ripped.",
        cost: E(1e8),
    },{
        desc: "Best Gravitons adds free Nanofield rewards at a reduced rate.",
        cost: E(1e12),
        eff() {
            let x = Math.floor(player.ghostify.gravitons.best.add(1).log(1.5))
            return x
        },
        effDesc(x) { return "+"+getFullExpansion(x) },
    },{
        desc: "Best Gravitons boosts themselves. Light Empowerments adds each free Lights.",
        cost: E(1e13),
        eff() {
            let x = player.ghostify.gravitons.best.add(1).root(4)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Best Gravitons boosts oscillate progression gain.",
        cost: E(1e17),
        eff() {
            let x = player.ghostify.gravitons.best.add(1).pow(2)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Time Dimensions powers are 25% stronger.",
        cost: E(2.5e18),
    },{
        desc: "Cherenkov Radiation add base from Graviton's effect.",
        cost: E(1e20),
        eff() {
            let x = player.ghostify.breakDilation.cr.add(1).log10()**0.75/10
            return x
        },
        effDesc(x) { return "+"+shorten(x) },
    },
    
    /*
    {
        desc: "Placeholder.",
        cost: E(1/0),
        eff() {
            let x = E(1)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },
    */
]

function getGravUpgUnls() {
    let x = 10
    if (player.ghostify.breakDilation.unl) x += 1
    return x
}

function hasGravUpg(x) { return player.ghostify ? player.ghostify.gravitons.upgs.includes(x) : false }

function buyGravitonUpg(x) {
    if (player.ghostify.gravitons.amount.gte(GRAVITON_UPGS[x].cost) && !player.ghostify.gravitons.upgs.includes(x)) {
        player.ghostify.gravitons.amount = player.ghostify.gravitons.amount.sub(GRAVITON_UPGS[x].cost)
        player.ghostify.gravitons.upgs.push(x)
    }
}

function setupGravitonUpgradesHTML() {
    let new_table = document.getElementById("gravUpgsTable")
    let inner = ""
    for (let r = 0; r <= Math.floor((GRAVITON_UPGS.length-1)/6); r++) {
        inner += "<tr>"
        for (let c = 0; c < 6; c++) {
            let id = r*6+c
            let name = "gravUpg"+id
            let upg = GRAVITON_UPGS[id]
            if (upg) inner += `
            <td><button id="${name}_div" class="gravitonupg" onclick="buyGravitonUpg(${id})">
            ${upg.desc}<br>${upg.effDesc?`Currently: <span id="${name}_eff">X</span><br>`:""}Cost: <span id="${name}_cost">${shorten(upg.cost)}</span> Gravitons
            </button></td>
            `
        }
        inner += "</tr>"
    }
    new_table.innerHTML = inner
}

function updateGravitonsTemp() {
    tmp.gravitons.unls = getGravUpgUnls()

    for (let x = 0; x < GRAVITON_UPGS.length; x++) if (GRAVITON_UPGS[x].eff) tmp.gravitons.upg_eff[x] = GRAVITON_UPGS[x].eff()

    tmp.gravitons.gain = new Decimal(0)
    if (player.ghostify.gravitons.unl) tmp.gravitons.gain = tmp.gravitons.gain.add(1)
    if (hasGravUpg(0)) tmp.gravitons.gain = tmp.gravitons.gain.mul(tmp.gravitons.upg_eff[0])
    if (hasGravUpg(2)) tmp.gravitons.gain = tmp.gravitons.gain.mul(tmp.bl.speed)
    if (hasGravUpg(7)) tmp.gravitons.gain = tmp.gravitons.gain.mul(tmp.gravitons.upg_eff[7])
    if (hasBosonicUpg(52) && tmp.blu) tmp.gravitons.gain = tmp.gravitons.gain.mul(tmp.blu[52])
    if (hasNU(16)) tmp.gravitons.gain = tmp.gravitons.gain.mul(tmp.nu[7] || 1)

    tmp.gravitons.powEff = E(2)
    if (hasNU(16)) tmp.gravitons.powEff = tmp.gravitons.powEff.add(1)
    if (hasBosonicUpg(53) && tmp.blu) tmp.gravitons.powEff = tmp.gravitons.powEff.add(tmp.blu[53])
    if (hasGravUpg(10)) tmp.gravitons.powEff = tmp.gravitons.powEff.add(tmp.gravitons.upg_eff[10])
    tmp.gravitons.eff = player.ghostify.gravitons.best.add(1).pow(tmp.gravitons.powEff)
}
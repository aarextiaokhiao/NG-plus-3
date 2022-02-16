const BD_UPGS = [
    {
        desc: "Cherenkov Radiation boost TP gain.",
        cost: E(1e5),
        eff() {
            let c = player.ghostify.breakDilation.cr
            let x = c.add(1).pow(c.add(1).log10()**0.5)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Dilated galaxy boost Cherenkov Radiations gain at a reduced rate.",
        cost: E(1e6),
        eff() {
            let x = E(1.01).pow(player.dilation.freeGalaxies**0.5)
            return x
        },
        effDesc(x) { return shorten(x)+"x" },
    },{
        desc: "Graviton will reduce Cherenkov Radiation’s effect.",
        cost: E(1e9),
        eff() {
            let x = player.ghostify.gravitons.amount.add(1).pow(2)
            return x
        },
        effDesc(x) { return "/"+shorten(x) },
    },{
        desc: "Eternal Matters gain 2nd softcap is weaker. Preons & baby replicants are no longer decreasing.",
        cost: E(1e10),
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

function breakDilation() {
    giveAchievement(allAchievements.ng3p111)
    if (player.ghostify.breakDilation.break) {
        player.ghostify.breakDilation.cr = E(0)

        fixDilationReset()
    }
    player.ghostify.breakDilation.break = !player.ghostify.breakDilation.break
}

function fixDilationReset() {
    ghostifyReset(false, 0, 0, true)
    player.dilation.tachyonParticles = new Decimal(0);
    player.dilation.bestTP = new Decimal(0);
    player.dilation.bestTPOverGhostifies = new Decimal(0);
}

function getCRGain() {
    let x = E(0)
    if (!player.ghostify.breakDilation.break) return x
    x = player.dilation.tachyonParticles.max(0).root(100).div(1e12)

    if (hasBDUpg(1)) x = x.mul(tmp.bd.upg_eff[1])
    return x
}

function getCREffect() {
    let x = E(1)
    if (!player.ghostify.breakDilation.break || tmp.qu.bigRip.active) return x
    x = player.ghostify.breakDilation.cr.add(1).pow(10)

    if (hasBDUpg(2)) x = x.div(tmp.bd.upg_eff[2])
    return x
}

function hasBDUpg(x) { return player.ghostify ? player.ghostify.breakDilation.upgs.includes(x) : false }

function buyBDUpg(x) {
    if (player.ghostify.breakDilation.cr.gte(BD_UPGS[x].cost) && !player.ghostify.breakDilation.upgs.includes(x)) {
        player.ghostify.breakDilation.cr = player.ghostify.breakDilation.cr.sub(BD_UPGS[x].cost)
        player.ghostify.breakDilation.upgs.push(x)
    }
}

function setupBDUpgradesHTML() {
    let new_table = document.getElementById("bdUpgsTable")
    let inner = ""
    for (let r = 0; r <= Math.floor((BD_UPGS.length-1)/6); r++) {
        inner += "<tr>"
        for (let c = 0; c < 6; c++) {
            let id = r*6+c
            let name = "bdUpg"+id
            let upg = BD_UPGS[id]
            if (upg) inner += `
            <td><button id="${name}_div" class="bd_btnUpg" onclick="buyBDUpg(${id})">
            ${upg.desc}<br>${upg.effDesc?`Currently: <span id="${name}_eff">X</span><br>`:""}Cost: <span id="${name}_cost">${shorten(upg.cost)}</span> Cherenkov Radiations
            </button></td>
            `
        }
        inner += "</tr>"
    }
    new_table.innerHTML = inner
}

function updateBDTemp() {
    for (let x = 0; x < BD_UPGS.length; x++) if (BD_UPGS[x].eff) tmp.bd.upg_eff[x] = BD_UPGS[x].eff()

    tmp.bd.crGain = getCRGain()
    tmp.bd.crEff = getCREffect()
}

function updateBDTab() {
    document.getElementById("bdUnl").style.display = player.ghostify.breakDilation.unl ? "none" : ""
    document.getElementById("bdUnl").textContent="To unlock Break Dilation, you need to get "+shortenCosts(Decimal.pow(10,4e12))+" antimatter while Big Ripped. (coming soon)"
    document.getElementById("bdDiv").style.display = player.ghostify.breakDilation.unl ? "" : "none"

    if (player.ghostify.breakDilation.unl) {
        document.getElementById("bd_tp").textContent = shortenMoney(player.dilation.tachyonParticles)
        document.getElementById("breakDilationBtn").textContent = (player.ghostify.breakDilation.break?"Fix":"Break")+" Dilation"
        document.getElementById("crAmt").textContent = shorten(player.ghostify.breakDilation.cr)
        document.getElementById("crGain").textContent = shorten(tmp.bd.crGain)
        document.getElementById("crEff").textContent = shorten(tmp.bd.crEff)

        for (let x = 0; x < BD_UPGS.length; x++) {
            let name = "bdUpg"+x
            let upg = BD_UPGS[x]
            let unl = upg.unl ? upg.unl() : true
    
            document.getElementById(name+"_div").style.visibility = unl ? "visible" : "hidden"
            if (unl) {
                document.getElementById(name+"_div").className = "bd_btnUpg "+(player.ghostify.breakDilation.upgs.includes(x)?"upg_bought":player.ghostify.breakDilation.cr.gte(upg.cost)?"":"upg_locked")
                document.getElementById(name+"_cost").innerHTML = shorten(upg.cost)
                if (upg.effDesc) document.getElementById(name+"_eff").innerHTML = upg.effDesc(tmp.bd.upg_eff[x])
            }
        }
    }
}
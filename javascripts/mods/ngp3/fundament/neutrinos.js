const NEUTRINO = NT = {
	/* CORE */
	//Unlock
	unlocked: () => ghostified,

	//Calculation
	setup() {
		let r = {
			generationGain: 1,
			boosts: 0,
			multPower: 1,
			upgrades: []
		}
		for (let type of NT_RES.types) r[type] = E(0)
		return r
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.neutrino = data

		data.amt = []
		for (let type of NT_RES.types) data.amt.push(ghSave.neutrinos[type])

		data.boost = {}
		for (let i = 1; i <= ghSave.neutrinos.boosts; i++) {
			let nt_eff = 0, nb = this.boosts.data[i-1]
			for (let amt of data.amt) nt_eff += amt.add(1).log10() ** (nb.eff_exp || 1)
			data.boost[i] = nb.eff(nt_eff)
		}

		data.upg = {}
		for (let [i, upg] of Object.entries(NT.upgrades.data)) if (upg.eff) data.upg[parseInt(i)+1] = upg.eff()
	},

	/* OTHERS */
	onGalaxy(bulk) {
		NT_RES.addType(NT_RES.types[ghSave.neutrinos.generationGain - 1], NT_RES.gain().mul(bulk))
	},
	eff(type, x, def = 1) {
		return tmp.funda.neutrino?.[type][x] ?? def
	},

	/* FEATURES */
	resources: {
		names: ["Electron ", "Muon ", "Tau "],
		types: ["electron", "mu", "tau"],
		total() {
			let r = E(0)
			for (let type of this.types) r = r.add(ghSave.neutrinos[type])
			return r.round()
		},
		gain() { 
			let r = E_pow(getNeutrinoMultBase(), ghSave.neutrinos.multPower - 1)
			r = E_pow(lightEff(2), brSave.bestGals).mul(r)
			if (mod.p3ep) r = r.mul(pow10(player.galaxies / 1e5))
			return r
		},
		spend(x) {
			let sum = this.total()
			for (let type of this.types) this.subType(type, ghSave.neutrinos[type].div(sum).mul(x))
		},

		setType(type, x) {
			ghSave.neutrinos[type] = E(x).round()
		},
		addType(type, x) {
			this.setType(type, ghSave.neutrinos[type].add(x))
		},
		subType(type, x) {
			this.setType(type, ghSave.neutrinos[type].sub(ghSave.neutrinos[type].min(x)))
		},
		addAll(x) {
			for (let type of this.types) this.addType(type, x)
		}
	},
	boosts: {
		can() {
			return ghSave.ghostParticles.gte(NT.boosts.data[ghSave.neutrinos.boosts].cost) && !this.maxed()
		},
		maxed() {
			return ghSave.neutrinos.boosts == NT.boosts.data.length
		},
		unlock() {
			if (!NT.boosts.can()) return
			ghSave.ghostParticles = ghSave.ghostParticles.sub(NT.boosts.data[ghSave.neutrinos.boosts].cost).round()
			ghSave.neutrinos.boosts++
		},
		has(x) {
			return ghSave?.neutrinos.boosts >= x
		},
		data: [
			{
				//Cost: Ghost Particles
				cost: E(1),
				eff: nt => Math.pow(nt / 5 + 1, 0.5) * (mod.p3ep ? .8 : .75),
				effDesc: e => `Increase TP gain exponent by <b>+^${shorten(e)}</b>.`,
			}, {
				cost: E(2),
				eff(nt) {
					let nb2 = Math.pow(nt, .25) * 1.5, ol = lightEff(1)
					return Math.pow(nb2, ol[0]) * ol[1]
				},
				effDesc: e => `Replicate chance boosts itself more. (<b>+^${shorten(e)}</b>)`,
			}, {
				cost: E(4),				
				exp_eff: 2,
				eff: nt => Math.sqrt(Math.sqrt(nt)+625) / 25,
				effDesc: e => `Uncap the Dilation Upgrade 14 and increase it by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(6),
				eff(nt) {
					let a = Math.log10(nt*(bigRipped()||mod.p3ep?1:0.06)+1)/4+1
					if (!bigRipped()) a = Math.sqrt(a)
					a = Math.min(a, 1.1)

					let b = Math.max((nt - 90) / 10, 1)
					return [a, b]
				},
				effDesc: e => `Raise Infinite Time by <b>^${shorten(e[0])}</b>.
					${PHOTON.unlocked() ? `<br>Raise its 2nd softcap start by <b>^${shorten(e[1])}</b>.` : ""}`,
			}, {
				cost: E(15),
				eff: nt => Math.min(nt / 33, 1),
				effDesc: e => `Red power softcaps <b>${shortenMoney(e*100)}%</b> weaker.`,
			}, {
				cost: E(50),
				exp_eff: 2,
				eff(nt) {
					let nb6exp = mod.p3ep ? .26 : .25
					if (bigRipped()) nb6exp /= 2

					let r = Math.pow(nt, nb6exp) * .3 + 1
					return Math.min(r, 2)
				},
				effDesc: e => `Distant Antimatter Galaxies scale <b>${shorten(e)}x</b> slower.`,
			}, {
				cost: E(1e3),
				eff: nt => (Math.pow(Math.log10(nt + 10), .5) - 1) * 5,
				effDesc: e => `Strengthen Tree Upgrades by <b>${shorten(e*100-1)}%</b>.`,
			}, {
				cost: E(1e9),
				eff(nt) {
					let exp = mod.p3ep ? .6 : .5
					let r = Math.pow(nt / 30 + 1, exp)
					return Math.min(r, 6)
				},
				effDesc: e => `Raise Big Rip Upgrade 1 by <b>^${shorten(e)}</b>.`,
			}, {
				cost: E(2e15),
				eff: nt => pow10(Math.pow(nt / 40, 1.5)).max(nt),
				effDesc: e => `Increase IC3 multiplier base by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(1e21),
				eff: nt => Math.log2(Math.max(nt / 70, 1)) / 200,
				effDesc: e => `Outside of Big Rip, TS232 regains <b>${shorten(e*100)}%</b> power.`,
			}, {
				cost: E(1e24),
				eff: nt => (nt / 100 + 1) ** 3,
				effDesc: e => `Gain <b>${shorten(e)}x</b> more Photons.`,
			}, {
				cost: E(1/0),
				eff: nt => 1,
				effDesc: e => `Placeholder.`,
			}
		]
	},
	upgrades: {
		can(x) {
			return NT_RES.total().gte(NT.upgrades.data[x-1].cost)
		},
		buy(x) {
			if (hasNU(x)) return
			if (!NT.upgrades.can(x)) return

			NT_RES.spend(NT.upgrades.data[x-1].cost)
			ghSave.neutrinos.upgrades.push(x)

			if (x == 16) resetNanoRewardEffects()
		},
		has(x) {
			return ghSave?.neutrinos.upgrades.includes(x)
		},
		data: [
			{
				//Cost: Neutrinos
				cost: E(1e6),
				desc: `Cheapen Meta-Dimension Boosts. (reduces itself outside of Big Rips)`,

				eff() {
					let x = 110
					if (!bigRipped()) x = Math.max(x - player.meta.resets, 0)
					return x
				},
				effDesc: e => `-${getFullExpansion(e)}`
			}, {
				cost: E(1e7),
				desc: `Eggons hatch instantly.`
			}, {
				cost: E(1e8),
				desc: `Blue power boosts nanocharge and preonic spin.`,

				eff() {
					let bLog = quSave.colorPowers.b.max(1).log10()
					return E_pow(2, Math.pow(bLog / 400 + 1, 3 / 4) - 1)
				},
				effDesc: e => `${shorten(e)}x`
			}, {
				unl: _ => ghSave.times >= 2,
				cost: E(2e8),
				desc: `Tickspeed speeds up Decay.`,

				eff: _ => pow10(Math.pow(Math.max(-getTickspeed().div(1e3).log10() / 4e13 - 4, 0), .25)),
				effDesc: e => `${shorten(e)}x`
			}, {
				unl: _ => ghSave.times >= 3,
				cost: E(5e8),
				desc: `Triple Positrons.`
			}, {
				unl: _ => ghSave.times >= 4,
				cost: E(2e9),
				desc: `Disable Remote Antimatter Galaxies!`
			}, {
				unl: _ => ghSave.times >= 5,
				cost: E(5e9),
				desc: `Green power boosts odd Emperor Dimensions and nanocharge.`,

				eff: _ => quSave.colorPowers.g.add(1).root(300),
				effDesc: e => `${shorten(e)}x`
			}, {
				unl: _ => ghSave.times >= 6,
				cost: E(7.5e9),
				desc: `Disable the meta-antimatter boost nerf to quark gain.`
			}, {
				unl: _ => ghSave.times >= 7,
				cost: E(1e10),
				desc: `Eternities and Space Shards synergy each other.`
			}, {
				unl: _ => ghSave.times >= 8,
				cost: E(1e12),
				desc: `Enable Banked Eternities in Quantum Challenges.`
			}, {
				unl: _ => ghSave.times >= 9,
				cost: E(1e16),
				desc: `Reactivate and uncap Big Rip Upgrade 8.`
			}, {
				unl: _ => ghSave.times >= 10,
				cost: E(1e20),
				desc: `Galaxy types boost several things.`,

				eff() {
					return { 
						normal: pow2(player.galaxies / 1e5),
						replicated: getTotalRG() / 2e4 + 1,
						free: pow2(player.dilation.freeGalaxies / 2e3), //NU12 
					}
				},
				effDesc: e => `(hover)`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e28),
				desc: `Unlock Replicanti Warp. Replicanti interval cost scales slower.`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e33),
				desc: `Tachyonic Galaxies scale Positron softcap later.`,

				eff: _ => player.dilation.freeGalaxies / 2,
				effDesc: e => `+${getFullExpansion(Math.round(e))}`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e35),
				desc: `Replace some Nanobenefits. Improve 7th Nanobenefit.`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1/0),
				desc: `Galaxy strength raises Meta-Antimatter effect.`,

				eff: _ => tmp.gal.str / 2,
				effDesc: e => `+^${shorten(e)}`
			}
		]
	},

	/* HTML */
	setupTab() {
		var html = ""
		for (var b in NT.boosts.data) {
			html += `<td id='nt_bst_${parseInt(b) + 1}'></td>`
			if (b % 3 == 2) html += "</tr><tr>"
		}
		el('nt_bst_div').innerHTML = "<tr>" + html + "</tr>"

		var html = ""
		for (var [i, upg] of Object.entries(NT.upgrades.data)) {
			i = parseInt(i)+1
			html += `<td><button id='nt_upg_${i}' onclick='NT.upgrades.buy(${i})'>
				${upg.desc}<br>
				${upg.eff ? `Currently: <span id='nt_upg_eff_${i}'></span><br>` : ``}
				Cost: <span id='nt_upg_cost_${i}'></span> neutrinos
			</button></td>`
			if (i % 4 == 0) html += "</tr><tr>"
		}
		el('nt_upg_div').innerHTML = "<tr>" + html + "</tr>"
	},
	update() {
		for (var type of NT_RES.types) el(type + "Neutrinos").textContent = shortenDimensions(ghSave.neutrinos[type])
		el("neutrinosGain").textContent = "+" + shortenDimensions(NT_RES.gain()) + " " + NT_RES.names[ghSave.neutrinos.generationGain - 1] + "Neutrinos per Antimatter Galaxy"

		for (var [i, bst] of Object.entries(NT.boosts.data)) {
			i = parseInt(i)+1
			el("nt_bst_"+i).innerHTML = hasNB(i) ? bst.effDesc(tmp.funda.neutrino.boost[i]) : ""
		}
		if (!NT.boosts.maxed()) {
			el("nt_bst_unl").style.display = ""
			el("nt_bst_unl").className = "qu_upg " + (NT.boosts.can() ? "neutrinoupg" : "unavailablebtn")
			el("nt_bst_cost").innerHTML = shortenDimensions(NT.boosts.data[ghSave.neutrinos.boosts].cost)
		} else el("nt_bst_unl").style.display = "none"

		for (var [i, upg] of Object.entries(NT.upgrades.data)) {
			i = parseInt(i)+1
			el("nt_upg_cost_"+i).textContent = shorten(upg.cost)
			el("nt_upg_"+i).className = (hasNU(i) ? "qu_upg_bought neutrinoupg" : NT.upgrades.can(i) ? "qu_upg neutrinoupg" : "qu_upg unavailablebtn") + " condensed"
			if (upg.eff) el("nt_upg_eff_"+i).textContent = upg.effDesc(tmp.funda.neutrino.upg[i])
			if (upg.unl) el("nt_upg_"+i).style.display = upg.unl() ? "" : "none"
		}
		el("nt_upg_12").setAttribute('ach-tooltip',
			`Normal galaxy effect: ${shorten(NT.eff('upg', 12).normal)}x to preonic spin production,
			Replicated Galaxy effect: ${shorten(NT.eff('upg', 12).replicated)}x to EC14 reward,
			Tachyonic galaxy effect: ${shorten(NT.eff('upg', 12).free)}x to IC3 base`
		)

		el("neutrinoMultUpg").className = "qu_upg " + (ghSave.ghostParticles.gte(getNeutrinoMultCost()) ? "storebtn" : "unavailablebtn")
		el("neutrinoMultBase").textContent = shorten(getNeutrinoMultBase())
		el("neutrinoMult").textContent = shortenDimensions(E_pow(getNeutrinoMultBase(), ghSave.neutrinos.multPower - 1))
		el("neutrinoMultUpgCost").textContent = shortenDimensions(getNeutrinoMultCost())
		el("ghpMultUpg").className = "qu_upg " + (NT_RES.total().gte(getGHPMultCost()) ? "storebtn" : "unavailablebtn")
		el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
		el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
	},
}
const NT_RES = NT.resources

function hasNB(x) {
	return NT.boosts.has(x)
}
function hasNU(x) {
	return NT.upgrades.has(x)
}

//Multipliers
function getNeutrinoMultCost() {
	return E_pow(5, ghSave.neutrinos.multPower - 1).mul(2)
}

function buyNeutrinoMult(max) {
	let cost = getNeutrinoMultCost()
	if (!ghSave.ghostParticles.gte(cost)) return

	let toBuy = max ? Math.floor(ghSave.ghostParticles.div(cost).log(5) + 1) : 1
	ghSave.ghostParticles=ghSave.ghostParticles.sub(E_pow(5, toBuy - 1).mul(cost)).round()
	ghSave.neutrinos.multPower += toBuy

	el("neutrinoMult").textContent=shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
	el("neutrinoMultUpgCost").textContent=shortenDimensions(getNeutrinoMultCost())
}

function getNeutrinoMultBase() {
	let r = 5
	if (hasBLMilestone(10)) r += blEff(10)
	return r
}

function maxNeutrinoMult() {
	buyNeutrinoMult(true)
}

function getGHPBaseMult() {
	return E_pow(3, ghSave.multPower - 1)
}

function getGHPMultCost() {
	return E_pow(25, ghSave.multPower).mul(1e6)
}

function buyGHPMult(max) {
	let sum = ghSave.neutrinos.electron.add(ghSave.neutrinos.mu).add(ghSave.neutrinos.tau).round()
	let cost = getGHPMultCost()
	if (sum.lt(cost)) return

	let toBuy = max ? Math.floor(sum.div(cost).log(25) + 1) : 1
	NT_RES.spend(E_pow(25,toBuy - 1).mul(cost))
	ghSave.multPower += toBuy

	el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
	el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
}

function maxGHPMult() {
	buyGHPMult(true)
}
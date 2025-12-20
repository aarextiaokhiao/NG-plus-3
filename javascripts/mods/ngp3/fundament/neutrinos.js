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

		let data = tmp.funda.neutrino = {}
		data.amt = []
		for (let type of NT_RES.types) data.amt.push(ghSave.neutrinos[type])

		data.boost = {}
		for (let i = 1; i <= ghSave.neutrinos.boosts; i++) {
			let nt_eff = 0, nb = this.boosts.data[i-1]
			for (let amt of data.amt) nt_eff += amt.add(1).log10()
			data.boost[i] = nb.eff(nt_eff)
		}

		data.upg = {}
		for (let [i, upg] of Object.entries(NT.upgrades.data)) if (upg.eff) data.upg[parseInt(i)+1] = upg.eff()
	},

	/* OTHERS */
	onGalaxy(bulk) {
		NT_RES.addType(NT_RES.types[ghSave.neutrinos.generationGain - 1], NT_RES.gain().mul(bulk))
	},
	getAllPerGalaxy(galaxies) {
		for (var i = 0; i < 3; i++) NT_RES.addType(NT_RES.types[i], NT_RES.gain().mul(galaxies))
	},
	onProd() {
		let prod = ntProd
		if (prod.total.length == 20) ntProd.total = ntProd.total.slice(1,20)
		prod.total.push(prod.next)

		let got = 0
		prod.next = E(0), prod.average = E(0)
		for (var i of prod.total) if (i.gt(0)) {
			prod.average = prod.average.add(i)
			got++
		}
		if (got > 0) prod.average = prod.average.div(got)
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
			let r = E_pow(5, ghSave.neutrinos.multPower - 1)
			r = E_pow(lightEff(1), Math.max(brSave.bestGals - 2000, 0)).mul(r)
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
			ntProd.next = ntProd.next.add(x)
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
				eff: nt => hasNU(15) ? Math.pow(nt, .75) / 3 :  Math.pow(nt, .25) * 1.5,
				effDesc: e => `Replicate chance boosts itself more. (<b>+^${shorten(e)}</b>)`,
			}, {
				cost: E(4),
				eff: nt => Math.log10(Math.max(nt / 5, 10)),
				effDesc: e => `Uncap the Dilation Upgrade 14 and increase it by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(6),
				eff(nt) {
					let a = Math.log10(nt*(bigRipped()||mod.p3ep?1:0.06)+1)/4+1
					if (!bigRipped()) a = Math.sqrt(a)
					a = Math.min(a, 1.1)

					let b = Math.max(nt - 100, 0) / 150 + 1
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

					return Math.min(Math.pow(nt, nb6exp) * .3 + 1, 2)
				},
				effDesc: e => `Distant Antimatter Galaxies scale <b>${shorten(e)}x</b> slower.`,
			}, {
				cost: E(1e3),
				eff: nt => Math.max(Math.pow(Math.log10(nt + 10, 0), .5) * 5 - 5, 1),
				effDesc: e => `Strengthen Tree Upgrades by <b>+${shorten(e*100-100)}%</b>.`,
			}, {
				cost: E(1e9),
				eff(nt) {
					let exp = mod.p3ep ? .6 : .5
					let r = Math.pow(nt / 30 + 1, exp)
					return Math.min(r, 3)
				},
				effDesc: e => `Raise Big Rip Upgrade 1 effect by <b>^${shorten(e)}</b>.`,
			}, {
				cost: E(2e15),
				eff: nt => pow10(Math.pow(nt / 40, 1.5)).max(nt),
				effDesc: e => `Increase IC3 multiplier base by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(1e19),
				eff: nt => Math.min(Math.max(nt - 80, 0) / 50, 1.5),
				effDesc: e => `Raise Infinity Power effect by <b>+^${shorten(e)}</b>.`
			}, {
				cost: E(1e24),
				eff: nt => Math.max(nt / 30 - 1.5, 1) ** 3,
				effDesc: e => `Gain <b>${shorten(e)}x</b> more Photons.`,
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

			if (x == 14) resetNanoRewardEffects()
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
				desc: `Blue power boosts Nanocharge and preonic spin.`,

				eff() {
					let bLog = quSave.colorPowers.b.max(1).log10()
					return E_pow(3, Math.pow(bLog / 400 + 1, 3 / 4) - 1)
				},
				effDesc: e => `${shorten(e)}x`
			}, {
				unl: _ => ghSave.neutrinos.boosts > 1,
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
				desc: `Green power boosts odd-tiered Emperor Dimensions and Nanocharge.`,

				eff: _ => quSave.colorPowers.g.add(1).root(300),
				effDesc: e => `${shorten(e)}x`
			}, {
				unl: _ => ghSave.times >= 6,
				cost: E(7.5e9),
				desc: `Unsoftcap the Anti-Quark gain.`
			}, {
				unl: _ => ghSave.times >= 7,
				cost: E(1e10),
				desc: `Eternities and Space Shards boost each other.`
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
				cost: E(1e29),
				desc: `Unlock Replicanti Warp. Replicanti interval cost scales slower.`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e38),
				desc: `Unlock new Nanobenefits. Improve 7th Nanobenefit.`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e47),
				desc: `Improve 2nd Neutrino Boost.`
			}, {
				unl: _ => false,
				cost: E(1/0),
				desc: `Galaxies raise Meta-Antimatter effect.`,

				eff: _ => player.galaxies / 6e3,
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
		el("neutrinosGain").textContent = "+" + shortenDimensions(NT_RES.gain()) + " " + NT_RES.names[ghSave.neutrinos.generationGain - 1] + "Neutrinos per Antimatter Galaxy (+" + shortenDimensions(ntProd.average) + " per sec)"
		el("neutrinosNext").textContent = "(" + NT_RES.names[ghSave.neutrinos.generationGain % 3] + "Neutrinos on next Quantum)"

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
			el("nt_upg_"+i).className = (hasNU(i) ? "qu_upg_bought neutrinoupg" : NT.upgrades.can(i) ? "qu_upg neutrinoupg" : "qu_upg unavailablebtn")
			if (upg.eff) el("nt_upg_eff_"+i).textContent = upg.effDesc(tmp.funda.neutrino.upg[i])
			if (upg.unl) el("nt_upg_"+i).style.display = upg.unl() ? "" : "none"
		}
		el("nt_upg_12").setAttribute('ach-tooltip',
			`Antimatter Galaxy effect: ${shorten(NT.eff('upg', 12).normal)}x to preonic spin production,
			Replicated Galaxy effect: ${shorten(NT.eff('upg', 12).replicated)}x to EC14 reward,
			Tachyonic galaxy effect: ${shorten(NT.eff('upg', 12).free)}x to IC3 base`
		)

		el("neutrinoMultUpg").className = "qu_upg " + (ghSave.ghostParticles.gte(getNeutrinoMultCost()) ? "storebtn" : "unavailablebtn")
		el("neutrinoMult").textContent = shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
		el("neutrinoMultUpgCost").textContent = shortenDimensions(getNeutrinoMultCost())
		el("ghpMultUpg").className = "qu_upg " + (NT_RES.total().gte(getGHPMultCost()) ? "storebtn" : "unavailablebtn")
		el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
		el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
	},
}
let ntProd = { total: [], next: E(0), average: E(0) }
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
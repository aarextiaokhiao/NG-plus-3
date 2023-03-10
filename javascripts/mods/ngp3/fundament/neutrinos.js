const NEUTRINO = {
	/* CORE */
	//Unlock
	unlocked: () => ghostified,

	//Calculation
	setup() {
		return {
			electron: E(0),
			mu: E(0),
			tau: E(0),
			generationGain: 1,
			boosts: 0,
			multPower: 1,
			upgrades: []
		}
	},
	onGalaxy(bulk) {
		let nts = NT_RES
		nts.addType(nts.types[ghSave.neutrinos.generationGain - 1], nts.gain().mul(bulk))
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.neutrino = data

		data.amt = []
		for (let type of this.neutrinos.types) data.amt.push(ghSave.neutrinos[type])

		data.boost = {}
		for (let i = 1; i <= ghSave.neutrinos.boosts; i++) data.boost[i] = this.boosts.data[i-1].eff(data.amt)

		data.upg = {}
		for (let [i, upg] of Object.entries(NEUTRINO.upgrades.data)) if (upg.eff) data.upg[parseInt(i)+1] = upg.eff()
	},

	/* FEATURES */
	neutrinos: {
		names: ["electron", "Muon", "Tau"],
		types: ["electron", "mu", "tau"],
		total() {
			let r = E(0)
			for (let type of this.types) r = r.add(ghSave.neutrinos[type])
			return r.round()
		},
		setType(type, x) {
			ghSave.neutrinos[type] = E(x).round()
		},
		addType(type, x) {
			this.setType(type, ghSave.neutrinos[type].add(x))
		},
		addAll(x) {
			for (let type of this.types) this.addType(type, x)
		},
		subType(type, x) {
			this.setType(type, ghSave.neutrinos[type].sub(ghSave.neutrinos[type].min(x)))
		},
		spend(x) {
			let sum = this.total()
			for (let type of this.types) this.subType(type, ghSave.neutrinos[type].div(sum).mul(x))
		},

		gain() { 
			let r = E_pow(5, ghSave.neutrinos.multPower - 1)
			if (mod.p3ep) r = r.mul(pow10(player.galaxies / 1e5))
			return r
		}
	},
	boosts: {
		can() {
			return ghSave.ghostParticles.gte(NEUTRINO.boosts.data[ghSave.neutrinos.boosts].cost) && !this.maxed()
		},
		maxed() {
			return ghSave.neutrinos.boosts == NEUTRINO.boosts.data.length
		},
		unlock() {
			if (!NEUTRINO.boosts.can()) return
			ghSave.ghostParticles = ghSave.ghostParticles.sub(NEUTRINO.boosts.data[ghSave.neutrinos.boosts].cost).round()
			ghSave.neutrinos.boosts++
		},
		has(x) {
			return ghSave?.neutrinos.boosts >= x
		},
		data: [
			{
				//Cost: Ghost Particles
				cost: E(1),
				eff(nt) {
					let nb1mult = .75
					if (mod.p3ep) nb1mult = .8
					let nb1neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
					return Math.log10(1+nb1neutrinos)*nb1mult
				},
				effDesc: e => `Increase TP gain exponent by <b>+^${shorten(e)}</b>.`,
			}, {
				cost: E(2),
				eff(nt) {
					let nb2neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
					let nb2 = Math.pow(nb2neutrinos, .25) * 1.5
					if (nb2 > 10) nb2 = Math.pow(nb2 / 10, PHOTON.eff(6)) + 9
					return nb2
				},
				effDesc: e => `Replicate chance boosts itself more. (<b>+^${shorten(e)}</b>)`,
			}, {
				cost: E(4),
				eff(nt) {
					let nb3neutrinos = Math.sqrt(
						Math.pow(nt[0].max(1).log10(), 2) +
						Math.pow(nt[1].max(1).log10(), 2) +
						Math.pow(nt[2].max(1).log10(), 2)
					)
					let nb3 = Math.sqrt(nb3neutrinos + 625) / 25
					return nb3
				},
				effDesc: e => `Uncap the Dilation Upgrade 14 and increase it by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(6),
				eff(nt) {
					var nb4neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
					var nb4 = Math.log10(nb4neutrinos*(bigRipped()||mod.p3ep?1:0.07)+1)/4+1
					if (!bigRipped()) nb4 = Math.sqrt(nb4)
					return Math.min(nb4, 2)
				},
				effDesc: e => `Raise Infinite Time by <b>^${shorten(e)}</b>.`,
			}, {
				cost: E(15),
				eff(nt) {
					var nb5neutrinos = nt[0].max(1).log10()+nt[1].max(1).log10()+nt[2].max(1).log10()
					return Math.min(nb5neutrinos / 33, 1)
				},
				effDesc: e => `Red power softcap is <b>${shortenMoney(e*100)}%</b> weaker.`,
			}, {
				cost: E(50),
				eff(nt) {
					var nb6neutrinos = Math.pow(nt[0].add(1).log10(), 2) + Math.pow(nt[1].add(1).log10(), 2) + Math.pow(nt[2].add(1).log10(), 2)

					var nb6exp = .25
					if (mod.p3ep) nb6exp = .26
					if (bigRipped()) nb6exp /= 2

					let nb6 = Math.pow(nb6neutrinos, nb6exp) * 0.525 + 1
					return Math.min(nb6, 2)
				},
				effDesc: e => `Distant Antimatter Galaxies scale <b>${shorten(e)}x</b> slower.`,
			}, {
				cost: E(1e3),
				eff(nt) {
					let nb7exp = .5
					let nb7neutrinos = nt[0].add(1).log10() + nt[1].add(1).log10() + nt[2].add(1).log10()
					let nb7 = (Math.pow(Math.log10(nb7neutrinos + 10), nb7exp) - 1) * 5
					return Math.min(nb7, 10)
				},
				effDesc: e => `Strengthen Tree Upgrades by <b>+${shorten(e*100)}%</b>.`,
			}, {
				cost: E(1e9),
				eff(nt) {
					let neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
					let exp = mod.p3ep ? .6 : .5
					var nb8 = Math.pow(neutrinos / 30 + 1, exp)
					return Math.min(nb8, 6)
				},
				effDesc: e => `Strengthen Big Rip Upgrade 1 by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(2e15),
				eff(nt) {
					var nb9 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
					nb9 = pow10(Math.pow(nb9 / 50, 2/3)).mul(nb9)
					return nb9
				},
				effDesc: e => `Strengthen IC3 multiplier base by <b>${shorten(e)}x</b>.`,
			}, {
				cost: E(1e27),
				eff(nt) {
					var nb10 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
					return nb10/10+1
				},
				effDesc: e => `Gain <b>${shorten(e)}x</b> more Photons.`,
			}, {
				cost: E(1e36),
				eff(nt) {
					var nb11 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
					nb11 = Math.log10(nb11 + 10)
					return nb11
				},
				effDesc: e => `Raise Emperor Dimensions and Nanocharge by <b>^${shorten(e)}</b>.`,
			}, {
				cost: E(1e45),
				eff(nt) {
					var nb12 = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
					var mul = mod.p3ep ? 0.5 : 0.25
					return Math.log10(ghSave.time / 1e3 + 1) * Math.log10(nb12 + 10) * mul + 1
				},
				effDesc: e => `Fundament time boosts Replicanti Slowdown by <b>^${shorten(e)}</b>.`,
			}
		]
	},
	upgrades: {
		can(x) {
			return NT_RES.total().gte(NEUTRINO.upgrades.data[x-1].cost)
		},
		buy(x) {
			if (hasNU(x)) return
			if (!NEUTRINO.upgrades.can(x)) return

			NT_RES.spend(NEUTRINO.upgrades.data[x-1].cost)
			ghSave.neutrinos.upgrades.push(x)
		},
		has(x) {
			return ghSave?.neutrinos.upgrades.includes(x)
		},
		data: [
			{
				//Cost: Neutrinos
				cost: E(1e6),
				desc: `Cheapen Meta-Dimension Boosts.`,

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
					let bLog = quSave.colorPowers.b.log10()
					let exp = Math.max(bLog / 1e4 + 1, 2)
					return E_pow(Math.max(bLog / 500 + 1, 1), exp)
				},
				effDesc: e => `${shorten(e)}x`
			}, {
				unl: _ => ghSave.times >= 2,
				cost: E(2e8),
				desc: `Tickspeed speeds up Decay.`,

				eff: _ => pow10(Math.sqrt(Math.max(-getTickspeed().div(1e3).log10() / 4e13 - 4, 0)) * 0.6),
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
				desc: `Eternities and Space Shards boost each other.`
			}, {
				unl: _ => ghSave.times >= 8,
				cost: E(1e12),
				desc: `Banked eternities are counted in Quantum Challenges.`
			}, {
				unl: _ => ghSave.times >= 9,
				cost: E(1e16),
				desc: `8th Big Rip upgrade is never repealed and capped.`
			}, {
				unl: _ => ghSave.times >= 10,
				cost: E(1e20),
				desc: `Galaxy types boosts several things.`,

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
				cost: E(1e24),
				desc: `Tachyonic Galaxies scale Positron softcap later.`,

				eff: _ => player.dilation.freeGalaxies * ,
				effDesc: e => `+${getFullExpansion(e)}`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e27),
				desc: `Galaxy strength adds Meta-Antimatter effect exponent.`,

				eff: _ => tmp.galStr / 2,
				effDesc: e => `+^${shorten(e)}`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e30),
				desc: `First Nanobenefit boosts Photons instead.`
			}, {
				unl: _ => PHOTON.unlocked(),
				cost: E(1e33),
				desc: `Replicate slowdown absorbs replicate interval.`
			}
		]
	},

	/* HTML */
	setupTab() {
		var html = ""
		for (var b in NEUTRINO.boosts.data) {
			html += `<td id='nt_bst_${parseInt(b) + 1}'></td>`
			if (b % 3 == 2) html += "</tr><tr>"
		}
		el('nt_bst_div').innerHTML = "<tr>" + html + "</tr>"

		var html = ""
		for (var [i, upg] of Object.entries(NEUTRINO.upgrades.data)) {
			i = parseInt(i)+1
			html += `<td><button id='nt_upg_${i}' onclick='NEUTRINO.upgrades.buy(${i})'>
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
		el("neutrinosGain").textContent = "+" + shortenDimensions(NT_RES.gain()) + " " + NT_RES.names[ghSave.neutrinos.generationGain - 1] + " Neutrinos per Antimatter Galaxy"

		for (var [i, bst] of Object.entries(NEUTRINO.boosts.data)) {
			i = parseInt(i)+1
			el("nt_bst_"+i).innerHTML = hasNB(i) ? bst.effDesc(tmp.funda.neutrino.boost[i]) : ""
		}
		if (!NEUTRINO.boosts.maxed()) {
			el("nt_bst_unl").style.display = ""
			el("nt_bst_unl").className = "gluonupgrade " + (NEUTRINO.boosts.can() ? "neutrinoupg" : "unavailablebtn")
			el("nt_bst_cost").innerHTML = shortenDimensions(NEUTRINO.boosts.data[ghSave.neutrinos.boosts].cost)
		} else el("nt_bst_unl").style.display = "none"

		for (var [i, upg] of Object.entries(NEUTRINO.upgrades.data)) {
			i = parseInt(i)+1
			el("nt_upg_cost_"+i).textContent = shorten(upg.cost)
			el("nt_upg_"+i).className = hasNU(i) ? "gluonupgradebought neutrinoupg" : NEUTRINO.upgrades.can(i) ? "gluonupgrade neutrinoupg" : "gluonupgrade unavailablebtn"
			if (upg.eff) el("nt_upg_eff_"+i).textContent = upg.effDesc(tmp.funda.neutrino.upg[i])
			if (upg.unl) el("nt_upg_"+i).style.display = upg.unl() ? "" : "none"
		}
		el("nt_upg_12").setAttribute('ach-tooltip',
			`Normal galaxy effect: ${shorten(ntEff('upg', 12).normal)}x to quark spin production,
			Replicated galaxy effect: ${shorten(ntEff('upg', 12).replicated)}x to EC14 reward,
			Tachyonic galaxy effect: ${shorten(ntEff('upg', 12).free)}x to IC3 base`
		)

		el("neutrinoMultUpg").className = "gluonupgrade " + (ghSave.ghostParticles.gte(getNeutrinoMultCost()) ? "storebtn" : "unavailablebtn")
		el("neutrinoMult").textContent = shortenDimensions(E_pow(5, ghSave.neutrinos.multPower - 1))
		el("neutrinoMultUpgCost").textContent = shortenDimensions(getNeutrinoMultCost())
		el("ghpMultUpg").className = "gluonupgrade " + (NT_RES.total().gte(getGHPMultCost()) ? "storebtn" : "unavailablebtn")
		el("ghpMult").textContent = shortenDimensions(getGHPBaseMult())
		el("ghpMultUpgCost").textContent = shortenDimensions(getGHPMultCost())
	},
}
const NT_RES = NEUTRINO_RES = NEUTRINO.neutrinos

function hasNB(x) {
	return NEUTRINO.boosts.has(x)
}
function hasNU(x) {
	return NEUTRINO.upgrades.has(x)
}
function ntEff(type, x, def = 1) {
	return tmp.funda.neutrino?.[type][x] ?? def
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
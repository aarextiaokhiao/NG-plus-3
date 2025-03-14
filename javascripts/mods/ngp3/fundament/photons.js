function lightEff(x, def) {
	return PHOTON.light.eff(x, def)
}

let PHOTON = {
	/* CORE */
	setup() {
		return {
			amt: E(0),
			sel: [0, -1],
			slots: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
		}
	},

	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(18e8)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		notifyFeature("ph")
	},

	//Calculation
	calc(dt) {
		ghSave.photons.amt = this.photon_prod().mul(dt * PHOTON.checkSpeed(0)).add(ghSave.photons.amt)
		if (ghSave.photons.sel[1] != -1) ghSave.photons.slots[ghSave.photons.sel[1]][0] = Math.max(ghSave.photons.slots[ghSave.photons.sel[1]][0] + dt, getTreeUpgradeEffect(9))
	},
	temp() {
		if (!this.unlocked()) return

		let data = tmp.funda.photon = {}
		let lights = this.light.data

		data.unls = 0, data.eff = []
		for (let [i, light] of Object.entries(lights)) {
			if (ghSave.photons.amt.gte(light.req)) data.unls++
			data.eff[i] = light.eff(data.unls > i ? ghSave.photons.amt.div(light.req).log10() : 0)
		}
	},

	/* Feature - Time */
	sel(i) {
		if (ghSave.photons.slots[i][1]) {
			if (ghSave.photons.sel[0] == 2 && bigRipped()) return

			if (ghSave.photons.sel[0] == 0) ghSave.photons.amt = this.photon_prod().mul(ghSave.photons.slots[i][0]).add(ghSave.photons.amt)
			if (ghSave.photons.sel[0] == 1) replicantiIncrease(ghSave.photons.slots[i][0] * 10)
			if (ghSave.photons.sel[0] == 2) treeOfDecayUpdating(ghSave.photons.slots[i][0])

			ghSave.photons.slots[i][1]--
			if (ghSave.photons.slots[i][1] == 0) ghSave.photons.slots[i] = [0, 0]
		} else ghSave.photons.sel[1] = i
	},
	emits() {
		let r = 1
		if (hasAch("ng3p75")) r++
		if (hasAch("ng3p78")) r++
		if (hasAch("ng3p82")) r++
		return r
	},

	/* Feature - Lights */
	photon_prod() {
		let r = pow10(player.dilation.freeGalaxies / 2e3 - 18)
		if (hasNB(11))               r = r.mul(NT.eff("boost", 11))
		if (hasNanoReward("photon")) r = r.mul(tmp.qu.nf.eff.photon)
		if (PHANTOM.amt >= 1)        r = r.mul(pow2(PHANTOM.amt))
		return r
	},
	checkSpeed(x) { return PHOTON.unlocked() && ghSave.photons.sel[0] == x && ghSave.photons.sel[1] != -1 ? .1 : 1 },
	light: {
		data: [
			{
				name: "infrared",
				req: 1,
				eff: exp => Math.min(Math.min(exp, exp ** 0.2) / 5, 1.5),
				desc: e => `Raise Infinity Power effect by +^${shorten(e)}.`
			}, {
				name: "red",
				req: 50,
				eff: exp => Math.cbrt(1 + exp / 150),
				desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
			}, {
				name: "orange",
				req: 300,
				eff: exp => exp / 2,
				desc: e => `Nanorewards scale +${shorten(e)} later.`
			}, {
				name: "yellow",
				req: 1e3,
				eff: exp => exp / 4 + 1,
				desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
			}, {
				name: "green",
				req: 5e3,
				eff: exp => E_pow(tmp.gal.ts || 1, Math.min(-exp / 5, 1)),
				desc: e => `Tickspeed reduction multiplies per-ten Antimatter Dimension bonus by ${shorten(e)}x.`
			}, {
				name: "blue",
				req: 1e100,
				eff: exp => 1 + exp / 100,
				desc: e => `Strengthen Meta-Dimension Boosts by ${shorten((e-1)*100)}%.`
			}, {
				name: "violet",
				req: 1e100,
				eff: exp => Math.min(1 + Math.sqrt(exp), 3),
				desc: e => `Raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
			}, {
				name: "ultraviolet",
				req: 1e100,
				eff: exp => Math.min(exp / 1e4, .05),
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% efficient.`
			}
		],
		eff: (x, def = 1) => tmp.funda.photon?.eff[x] ?? def,
	},

	/* HTML */
	setupTab() {
		let html = ``
		for (var i = 0; i < 8; i++) {
			let light = this.light.data[i]
			html += `<div id='ph_light_${i}'>
				<b style='font-size: 18px'>${light.name[0].toUpperCase() + light.name.slice(1, light.name.length)}</b><br>
				<span id='ph_light_eff_${i}'></span>
			</div>`
		}
		el('light_table').innerHTML = html
	},
	update() {
		let unl = this.unlocked()
		el("gphUnl").style.display = unl ? "none" : ""
		el("gphDiv").style.display = unl ? "" : "none"
		if (!unl) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(18e8))+" antimatter in Big Rip to unlock Photons."
			return
		}

		let pt = tmp.funda.photon, ps = ghSave.photons
		let lights = this.light.data
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var i = 0; i < 3; i++) el("ph_fea_" + i).className = "photon " + (ps.sel[0] == i ? "choosed" : "")
		for (var i = 0; i < 5; i++) {
			el("ph_slot_" + i).innerHTML = ps.slots[i][0] ? (
				(ps.slots[i][1] ? `<b>Emit</b> (${ps.slots[i][1] === true ? 1 : ps.slots[i][1]})<br>+` : "Energizing<br>") +
				`${shorten(ps.slots[i][0])}s`
			) : `Energize`
			el("ph_slot_" + i).className = "photon slot " + (ps.sel[1] == i ? "choosed" : "")
		}

		for (var [i, light] of Object.entries(lights)) {
			el("ph_light_" + i).className = `light ${light.name} ${pt.unls > i ? "" : "blank"}`
			el("ph_light_eff_" + i).innerHTML = (pt.unls > i ? "" : `(Requires ${shorten(light.req)} Photons)<br>`) + light.desc(lightEff(i))
		}
	}
}
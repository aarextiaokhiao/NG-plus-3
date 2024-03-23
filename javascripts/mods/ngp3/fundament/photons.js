function lightEff(x, def) {
	return PHOTON.light.eff(x, def)
}

let PHOTON = {
	/* CORE */
	setup() {
		return {
			amt: E(0),
			sel: [0, -1],
			slots: [[0, false], [0, false], [0, false], [0, false], [0, false]]
		}
	},

	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(17e8)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		notifyFeature("ph")
	},

	//Calculation
	calc(dt) {
		ghSave.photons.amt = this.photon_prod().mul(dt * PHOTON.checkSpeed(0)).add(ghSave.photons.amt)
		if (ghSave.photons.sel[1] != -1) ghSave.photons.slots[ghSave.photons.sel[1]][0] += dt
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		let lights = this.light.data
		tmp.funda.photon = data

		data.emission = ghSave.photons.amt.max(1).log(10)
		data.light = []
		data.eff = []

		let cycles = Math.floor(data.emission / 8)
		let remainder = data.emission % 8

		data.curr = -1
		data.next = E(10).pow(cycles * 8)

		for (let [i, light] of Object.entries(lights)) {
			data.light[i] = cycles + Math.min(remainder, 1)
			data.eff[i] = light.eff(data.light[i]) //will be determined soon

			if (remainder > 0) {
				data.curr = Number(i)
				data.next = E(10).mul(data.next)
				data.gain = remainder
			}
			remainder = Math.max(remainder - 1, 0)
		}
	},

	/* Feature - Time */
	sel(i) {
		if (ghSave.photons.slots[i][1]) {
			if (ghSave.photons.sel[0] == 0) ghSave.photons.amt = this.photon_prod().mul(ghSave.photons.slots[i][0]).add(ghSave.photons.amt)
			if (ghSave.photons.sel[0] == 1) replicantiIncrease(ghSave.photons.slots[i][0] * 10)
			if (ghSave.photons.sel[0] == 2) treeOfDecayUpdating(ghSave.photons.slots[i][0])
			ghSave.photons.slots[i] = [0, false]
		} else ghSave.photons.sel[1] = i
	},

	/* Feature - Lights */
	photon_prod() {
		let r = pow10(player.dilation.freeGalaxies / 2e4 - 3)

		if (hasNB(11))               r = r.mul(NT.eff("boost", 11))
		if (hasNanoReward("photon")) r = r.mul(tmp.qu.nf.eff.photon)
		if (PHANTOM.amt >= 1)        r = r.mul(2 ** PHANTOM.amt)
		return r
	},
	checkSpeed(x) { return PHOTON.unlocked() && ghSave.photons.sel[0] == x && ghSave.photons.sel[1] != -1 ? .1 : 1 },
	light: {
		data: [
			{
				name: "infrared",
				eff: a => E_pow(tmp.gal.ts || 1, -Math.min(2**a-1,16) / 4),
				desc: e => `Tickspeed reduction multiplies per-ten multiplier by ${shorten(e)}x.`
			}, {
				name: "red",
				eff: a => Math.min(1 + Math.sqrt(a), 3),
				desc: e => `Raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
			}, {
				name: "orange",
				eff: a => 1 + a / 500,
				desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
			}, {
				name: "yellow",
				eff: a => a / 100,
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% efficient.`
			}, {
				name: "green",
				eff: a => Math.min(Math.min(a, a ** 0.2), 1.5),
				desc: e => `Increase Infinity Power effect by +^${shorten(e)}.`
			}, {
				name: "blue",
				eff: a => a / 3 + 1,
				desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
			}, {
				name: "violet",
				eff: a => a * 4,
				desc: e => `Nanorewards scale +${shorten(e)} later.`
			}, {
				name: "ultraviolet",
				eff: a => 1 + a / 100,
				desc: e => `Strengthen Meta-Dimension Boosts by +${shorten((e-1)*100)}% per boost.`
			}
		],
		eff(x, def = 1) {
			return tmp.funda.photon?.eff[x] ?? def
		},
	},

	/* HTML */
	setupTab() {
		let html = ``
		for (var i = 0; i < 8; i++) {
			let light = this.light.data[i]
			html += `<div id='ph_light_${i}'>
				<b id='ph_light_amt_${i}' style='font-size: 18px'></b><br>
				<b id='ph_light_size_${i}'></b><br>
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
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(17e8))+" antimatter in Big Rip to unlock Photons."
			return
		}

		let pt = tmp.funda.photon, ps = ghSave.photons
		let lights = this.light.data
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var i = 0; i < 3; i++) el("ph_fea_" + i).className = "photon " + (ps.sel[0] == i ? "choosed" : "")
		for (var i = 0; i < 5; i++) {
			el("ph_slot_" + i).innerHTML = ps.slots[i][0] ? (
				(ps.slots[i][1] ? "Jump<br>+" : "Generating<br>") +
				`${shorten(ps.slots[i][0])}s`
			) : `Generate time`
			el("ph_slot_" + i).className = "photon slot " + (ps.sel[1] == i ? "choosed" : "")
		}

		for (var [i, light] of Object.entries(lights)) {
			el("ph_light_" + i).className = `light ${light.name} ${pt.curr == i ? "" : "blank"}`
			el("ph_light_amt_" + i).textContent = `${shorten(pt.light[i])} ${light.name}`
			el("ph_light_size_" + i).textContent = (pt.curr + 1) % 8 == i ? `Next at: ${shortenDimensions(pt.next)} Photons` : pt.curr ==i ? `+${shorten(pt.gain)} / 1` : ""
			el("ph_light_eff_" + i).textContent = light.desc(lightEff(i))
		}
	}
}
function lightEff(x, def) {
	return PHOTON.light.eff(x, def)
}

let PHOTON = {
	/* CORE */
	setup() {
		return {
			amt: E(0),
			range: [0, 0]
		}
	},

	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(2.9e9)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		notifyFeature("ph")
	},

	//Calculation
	calc(dt) {
		ghSave.photons.amt = this.photon_prod().mul(dt).add(ghSave.photons.amt)
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		let lights = this.light.data
		tmp.funda.photon = data

		data.emission = ghSave.photons.amt.div(100).max(1).log10()
		data.light = []
		data.harvest = [0,0]
		data.eff = []
		data.size = []

		let harvest = 0.1
		let total_size = lights.length - harvest * 6
		let cycles = Math.floor(data.emission / total_size)
		let remainder = data.emission % total_size

		for (let [i, light] of Object.entries(lights)) {
			let size = 1
			for (let r of ghSave.photons.range) if (i - r >= 0 && i - r < 3) size -= harvest

			data.light[i] = cycles + Math.min(remainder / size, 1)
			data.eff[i] = light.eff(0) //will be determined soon
			data.size[i] = size
			remainder = Math.max(remainder - size, 0)

			for (let [ri, r] of Object.entries(ghSave.photons.range)) if (i - r >= 0 && i - r < 3) data.harvest[ri] += data.light[i]
		}
	},

	/* Feature - Enharvestments */
	harvest: {
		names: ["Dark Essence", "Enlightenment"],
		change(i) {
			ghSave.photons.range[i] = Number(el("ph_harvest_range_"+i).value)
		},
		update() {
			for (let i in this.names) el("ph_harvest_range_" + i).value = ghSave.photons.range[i]
		},
	},

	/* Feature - Lights */
	photon_prod: _ => E(1),
	light: {
		data: [
			{
				name: "infrared",
				eff: a => E_pow(tmp.gal.ts || 1, -Math.min(Math.sqrt(a) / 10, 0.2)),
				desc: e => `Tickspeed reduction multiplies per-ten multiplier by ${shorten(e)}x.`
			}, {
				name: "red",
				eff: a => 1.5 - 0.5 / Math.log2(a + 2),
				desc: e => `Starting at ^9, raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
			}, {
				name: "orange",
				eff: a => Math.log2(a + 1) / 20,
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% effective.`
			}, {
				name: "yellow",
				eff(a) {
					if (a > 5) a = Math.log10(a * 2) + 4
					return 1+a/1.5e3
				},
				desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
			}, {
				name: "green",
				eff: a => Math.log10(a / 5 + 1) + 1,
				desc: e => `Raise Replicate Slowdown by ^${shorten(e)}.`
			}, {
				name: "blue",
				eff: a => Math.log10(a + 1) / 5 + 1,
				desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
			}, {
				name: "violet",
				eff: a => Math.cbrt(a / 5 + 1),
				desc: e => `Post-16 Nanoreward scaling scales ${shorten(e)}x slower.`
			}, {
				name: "ultraviolet",
				eff: a => a / 1e4 + 1,
				desc: e => `Boost Meta-Dimension Boosts by +${shorten((e-1)*100)}% per boost.`
			}
		],
		eff(x, def = 1) {
			return tmp.funda.photon?.eff[x] ?? def
		},
	},

	/* HTML */
	setupTab() {
		let html = ``
		for (var [r, type] of Object.entries(this.harvest.names)) {
			let row = ''
			for (var i = r * 4; i < r * 4 + 4; i++) {
				let light = this.light.data[i]
				row += `<div class='light ${light.name}' id='ph_light_${i}'>
					<b style='font-size: 18px'>
						<span id='ph_light_amt_${i}'>0</span> ${light.name}
					</b><br>
					<span id='ph_light_eff_${i}'></span>
				</div>`
			}
			html += `<div class='table_flex'>
				<div class='light lEp'>
					<b style='font-size: 18px'>
						<span id='ph_harvest_${r}'></span> ${type}s
					</b><br>
					<input id='ph_harvest_range_${r}' type='range' max=5 onchange="PHOTON.harvest.change(${r})"><br>
				</div>
				${row}
			</div>`
		}
		el('light_table').innerHTML = html
	},
	update() {
		let unl = this.unlocked()
		el("gphUnl").style.display = unl ? "none" : ""
		el("gphDiv").style.display = unl ? "" : "none"
		if (!unl) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(2.9e9))+" antimatter in Big Rip to unlock Photons."
			return
		}

		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var r in this.harvest.names) el("ph_harvest_" + r).textContent = shorten(tmp.funda.photon.harvest[r])
		for (var [i, light] of Object.entries(this.light.data)) {
			el("ph_light_" + i).style["border-bottom-width"] = (1 - tmp.funda.photon.size[i]) * 150 + "px"
			el("ph_light_" + i).style.height = tmp.funda.photon.size[i] * 150 + "px"
			el("ph_light_amt_" + i).textContent = shorten(tmp.funda.photon.light[i])
			el("ph_light_eff_" + i).textContent = light.desc(lightEff(i))
		}
	}
}
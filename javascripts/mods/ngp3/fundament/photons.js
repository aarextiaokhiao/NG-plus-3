function lightEff(x) {
	return PHOTON.light.eff(x)
}

let PHOTON = {
	/* CORE */
	setup() {
		let r = {
			amt: E(0),
			emission: E(0),
			range: [0, 1]
		}
		return r
	},

	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(2.9e9)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		ngp3_feature_notify("ph")
	},

	//Calculation
	calc() {
		ghSave.photons.amt = E(0)
		ghSave.photons.emission = this.range.get()
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.photon = data

		let range = ghSave.photons.range
		data.light = []
		data.eff = []
		data.range = range[1] - range[0]

		for (let [i, light] of Object.entries(this.light.data)) {
			data.light[i] = Math.max(Math.min(range[1] - i, 1), 0)
			if (i == 0) data.light[0] -= range[0]
			data.light[i] = ghSave.photons.amt.mul(data.light[i])

			data.eff[i] = light.eff(0) //will be determined soon
		}
	},

	//Feature - Range
	range: {
		get() {
			let r = 3
			r -= ghSave.photons.range[1] * 2
			r -= tmp.funda.photon.range
			return r
		},
		extend() {
			ghSave.photons.range[0] = Math.max(ghSave.photons.range[0] - ghSave.photons.emission / 3, 0)
		},
		move() {
			let diff = tmp.funda.photon.emission / 3 * 2
			for (let i = 0; i < 2; i++) ghSave.photons.range[i] += diff
		},
	},

	//Feature - Lights
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
				eff: a => 1,
				desc: e => `???`
			}
		],
		eff(x, def = 1) {
			return tmp.funda.photon?.eff[x] ?? def
		},
	},

	/* HTML */
	setupTab() {
		let html = ``
		for (var [i, light] of Object.entries(PHOTON.light.data)) html += `<div class='light ${light.name}'>
			<b style='font-size: 18px'><span id='ph_light_amt_${i}'>0</span> ${light.name} Light</b><br>
			<span id='ph_light_eff_${i}'>Do something.</span>
		</div>`
		el('light_table').innerHTML = html
	},
	update() {
		let unl = this.unlocked()
		el("gphUnl").style.display = unl ? "none" : ""
		el("gphDiv").style.display = unl ? "" : "none"
		if (!this.unlocked()) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(2.9e9))+" antimatter in Big Rip to unlock Photons."
			return
		}

		el("ph_emission").textContent = shorten(ghSave.photons.emission)
		el("ph_range").textContent = `${ghSave.photons.range[0].toFixed(2)} - ${ghSave.photons.range[1].toFixed(2)}`
		el("ph_amt").textContent = shorten(ghSave.photons.amt)

		for (const [i, light] of Object.entries(this.light.data)) {
			el("ph_light_amt_" + i).textContent = shorten(tmp.funda.photon.light[i])
			el("ph_light_eff_" + i).textContent = light.desc(lightEff(i))
		}
	}
}
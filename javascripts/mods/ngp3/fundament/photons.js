function lightEff(x) {
	return PHOTON.light.eff(x)
}

let PHOTON = {
	/* CORE */
	setup() {
		let r = {
			amt: E(0),
			range: [0, 0]
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
	calc(dt) {
		ghSave.photons.amt = this.photon_prod().mul(dt).add(ghSave.photons.amt)
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.photon = data

		data.light = []
		data.lighten = []
		data.eff = []

		let remain = 4
		for (var r in this.lighten.names) {
			data.lighten[r] = remain

			let total = 0
			for (var i = r * 4; i < r * 4 + 4; i++) {
				let light = this.light.data[i]
				let size = light.size + (i - r * 4 - ghSave.photons.range[r] >= 0 && i - r * 4 - ghSave.photons.range[r] < 2 ? 1 : 0)
				data.light[i] = Math.min(remain / size, 1)
				total += size
				remain = Math.max(remain - size, 0)
			}
			for (var i = r * 4; i < r * 4 + 4; i++) {
				let light = this.light.data[i]
				data.light[i] *= ghSave.photons.amt.add(1).log10() * (1 + remain / total)
				data.eff[i] = light.eff(0) //will be determined soon
			}
		}
	},

	photon_prod: _ => E(1),

	//Feature - Enlightenments
	lighten: {
		names: ["Dark Essence", "Enlightenment"],
		change(i) {
			ghSave.photons.range[i] = Number(el("ph_lighten_range_"+i).value)
		},
		update() {
			for (let i in this.names) el("ph_lighten_range_" + i).value = ghSave.photons.range[i]
		},
	},

	//Feature - Lights
	light: {
		data: [
			{
				name: "infrared",
				size: 2,
				eff: a => E_pow(tmp.gal.ts || 1, -Math.min(Math.sqrt(a) / 10, 0.2)),
				desc: e => `Tickspeed reduction multiplies per-ten multiplier by ${shorten(e)}x.`
			}, {
				name: "red",
				size: 2,
				eff: a => 1.5 - 0.5 / Math.log2(a + 2),
				desc: e => `Starting at ^9, raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
			}, {
				name: "orange",
				size: 2,
				eff: a => Math.log2(a + 1) / 20,
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% effective.`
			}, {
				name: "yellow",
				size: 2,
				eff(a) {
					if (a > 5) a = Math.log10(a * 2) + 4
					return 1+a/1.5e3
				},
				desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
			}, {
				name: "green",
				size: 2,
				eff: a => Math.log10(a / 5 + 1) + 1,
				desc: e => `Raise Replicate Slowdown by ^${shorten(e)}.`
			}, {
				name: "blue",
				size: 2,
				eff: a => Math.log10(a + 1) / 5 + 1,
				desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
			}, {
				name: "violet",
				size: 2,
				eff: a => Math.cbrt(a / 5 + 1),
				desc: e => `Post-16 Nanoreward scaling scales ${shorten(e)}x slower.`
			}, {
				name: "ultraviolet",
				size: 2,
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
		for (var [r, type] of Object.entries(this.lighten.names)) {
			let row = ''
			for (var i = r * 4; i < r * 4 + 4; i++) {
				let light = this.light.data[i]
				row += `<div class='light ${light.name}'>
					<b style='font-size: 18px'>
						<span id='ph_light_amt_${i}'>0</span> ${light.name}
					</b><br>
					<span id='ph_light_eff_${i}'></span>
				</div>`
			}
			html += `<div class='table_flex'>
				<div class='light'>
					<b style='font-size: 18px'>
						<span id='ph_lighten_${r}'></span> ${type}s
					</b><br>
					<input id='ph_lighten_range_${r}' type='range' max=2 onchange="PHOTON.lighten.change(${r})"><br>
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
		if (!this.unlocked()) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(2.9e9))+" antimatter in Big Rip to unlock Photons."
			return
		}

		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var [r, type] of Object.entries(this.lighten.names)) {
			el("ph_lighten_" + r).textContent = shorten(tmp.funda.photon.lighten[r])
			for (var i = r * 4; i < r * 4 + 4; i++) {
				let light = this.light.data[i]
				el("ph_light_amt_" + i).textContent = shorten(tmp.funda.photon.light[i])
				el("ph_light_eff_" + i).textContent = light.desc(lightEff(i))
			}			
		}
	}
}
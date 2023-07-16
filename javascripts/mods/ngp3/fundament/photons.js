let PHOTON = {
	/* CORE */
	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(2.9e9)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		ngp3_feature_notify("ph")
	},

	//Calculation
	setup() {
		let r = {
			amt: E(0),
			light: [],
			lighten: 0
		}
		for (var i of this.lightData) r.light.push(E(0))
		return r
	},
	calc(dt) {
		ghSave.photons.amt = ghSave.photons.amt.add(this.photonGain().mul(dt)).min(this.photonCap())
		this.enlighten()
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.photon = data

		data.cap = this.lightCap()
		data.eff = []
		for (var [i, light] of Object.entries(this.lightData)) data.eff[i] = light.eff(ghSave.photons.light[i].toNumber())
	},

	/* FEATURES */
	//Feature - Photons
	photonGain() {
		let r = E(player.dilation.bestTPOverGhostifies.max(1).log10() / 200).pow(5)
		if (hasNanoReward("photon")) r = r.mul(getNanorewardEff("photon"))
		if (hasBLMilestone(18)) r = r.mul(blEff(18))
		return r.div(100)
	},
	photonCap() {
		return E(1)
	},

	//Feature - Lights
	emit(x) {
		let max = this.lightCap(x)
		let amt = ghSave.photons.light[x]
		let gain = ghSave.photons.amt.min(max.sub(amt))
		ghSave.photons.amt = ghSave.photons.amt.sub(gain)
		ghSave.photons.light[x] = amt.add(gain).min(max)
		return
		/* = []

		let total = this.totalEmissions()
		for (const [i, light] of Object.entries(this.lightData)) {
			let gain = total - light.start + 1
			gain *= 1 + ghSave.photons.offset[i]
			gain = Math.min(Math.max(gain, 0), tmp.funda.photon.cap)

			ghSave.photons.light.push(gain)
		}*/
	},
	lightCap(x) {
		let r = E(0) //ghSave.photons.light[(x - 1) % 8]
		if (x == 0) r = r.add(1)
		return r.add(this.enlightenEff())
	},
	lightData: [
		{
			name: "red",
			start: 1,
			eff: a => E_pow(tmp.gal.ts || 1, -Math.min(Math.sqrt(a) / 10, 0.2)),
			desc: e => `Tickspeed reduction multiplies per-ten multiplier by ${shorten(e)}x.`
		}, {
			name: "orange",
			start: 4,
			eff: a => 1.5 - 0.5 / Math.log2(a + 2),
			desc: e => `Starting at ^9, raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
		}, {
			name: "yellow",
			start: 6,
			eff: a => Math.log2(a + 1) / 20,
			desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% effective.`
		}, {
			name: "green",
			start: 10,
			eff(a) {
				if (a > 5) a = Math.log10(a * 2) + 4
				return 1+a/1.5e3
			},
			desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
		}, {
			name: "cyan",
			start: 20,
			eff: a => Math.log10(a / 5 + 1) + 1,
			desc: e => `Raise Replicate Slowdown by ^${shorten(e)}.`
		}, {
			name: "blue",
			start: 50,
			eff: a => Math.log10(a + 1) / 5 + 1,
			desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
		}, {
			name: "violet",
			start: 100,
			eff: a => Math.cbrt(a / 5 + 1),
			desc: e => `Post-16 Nanoreward scaling scales ${shorten(e)}x slower.`
		}, {
			name: "ultraviolet",
			start: 200,
			eff: a => 1,
			desc: e => `???`
		}
	],
	eff(x, def = 1) {
		return tmp.funda.photon?.eff[x] ?? def
	},
	trade(x) {
		ghSave.photons.offset_click = x
		ghSave.photons.offset[x] += tmp.funda.photon.leftover ? .125 : -.125
		ghSave.photons.offset[x] = Math.max(ghSave.photons.offset[x], -.25)
		PHOTON.temp()
	},

	//Feature - Enlighten
	enlighten() {
		let lighten = ghSave.photons.lighten
		let gain = 0
		ghSave.photons.lighten = Math.max(gain, lighten)
	},
	enlightenEff() {
		let r = ghSave.photons.lighten
		return Math.ceil(r * 2.5)
	},

	/* HTML */
	setupTab() {
		for (var [i, light] of Object.entries(PHOTON.lightData)) {
			el('ph_light_'+i).innerHTML = `<div id='ph_light_div_${i}' style='display: none'>
				<span id='ph_light_amt_${i}' style='font-size: 18px'></span> ${light.name}<br>
				<span id='ph_light_eff_${i}'></span><br>
				<button class='storebtn photon' id='ph_light_emit_${i}' onclick='PHOTON.emit(${i})'>Emit</button>
			</div><div id='ph_light_req_${i}'>
				Requires ${light.start} Emissions
			</div>`
		}
	},
	update() {
		let unl = this.unlocked()
		el("gphUnl").style.display = unl ? "none" : ""
		el("gphDiv").style.display = unl ? "" : "none"
		if (!this.unlocked()) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(2.9e9))+" antimatter in Big Rip to unlock Photons."
			return
		}

		el("ph_amt").textContent = shorten(ghSave.photons.amt) + " / " + shorten(this.photonCap())
		el("ph_prod").textContent = "(+" + shorten(this.photonGain()) + "/s)"

		el("ph_lighten").textContent = getFullExpansion(ghSave.photons.lighten)
		el("ph_lighten_eff").textContent = "+" + getFullExpansion(this.enlightenEff()) + " cap"
		el("ph_lighten_req").textContent = "Requires " + getFullExpansion(ghSave.photons.lighten * 2 + 14) + " Emissions"

		for (const [i, light] of Object.entries(this.lightData)) {
			el("ph_light_amt_" + i).textContent = shorten(ghSave.photons.light[i] || 0) + " / " + shorten(this.lightCap(i))
			el("ph_light_eff_" + i).textContent = light.desc(this.eff(i))

			el("ph_light_div_" + i).style.display = ghSave.photons.light[i] ? "" : "none"
			el("ph_light_req_" + i).style.display = ghSave.photons.light[i] ? "none" : ""
		}
	}
}
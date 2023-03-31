let PHOTON = {
	/* CORE */
	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(1.9e9)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		ngp3_feature_notify("ph")
		updatePhotonUnlocks()
	},

	//Calculation
	setup() {
		return {
			amt: E(0),
			emission: [],
			light: [],
			offset: [0,0,0,0,0,0,0],
			lighten: 0
		}
	},
	calc(dt) {
		ghSave.photons.amt = ghSave.photons.amt.add(this.photonGain().mul(dt))
		for (var i in this.emissionData) this.getEmission(i)

		this.release()
		this.enlighten()
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.photon = data

		data.leftover = 0
		for (var i of ghSave.photons.offset) data.leftover -= i

		data.cap = this.lightCap()
		data.eff = []
		for (var [i, light] of Object.entries(this.lightData)) data.eff[i] = light.eff(ghSave.photons.light[i] || 0)
	},

	/* FEATURES */
	//Feature - Photons
	photonGain() {
		let r = E(player.dilation.bestTPOverGhostifies.max(1).log10() / 200).pow(10)
		if (hasNanoReward("photon")) r = r.mul(tmp.nf.eff.photon)
		return r
	},

	//Feature - Ions
	getEmission(i) {
		let amt = ghSave.photons.emission[i] || 0
		let kind = this.emissionData[i]
		let bulk = kind.bulk(kind.res())
		if (isNaN(bulk)) return

		ghSave.photons.emission[i] = Math.max(bulk, amt)
	},
	totalEmissions() {
		let total = 0
		for (const amt of ghSave.photons.emission) total += amt || 0
		return total
	},
	emissionData: [
		{
			resName: "Preonic Spin",
			res: _ => todSave.r.spin,

			req: i => E(50).pow(i).mul(1e27),
			bulk: r => Math.floor(r.max(1).div(1e27).log(50)) + 1,
		}, {
			resName: "Elementary Particles",
			res: _ => ghSave.ghostParticles,

			req: i => E(1e3).pow(i).mul(1e19),
			bulk: r => Math.floor(r.max(1).div(1e19).log(1e3)) + 1,
		}, {
			resName: "Photons",
			res: _ => ghSave.photons.amt,

			req: i => E(3).pow(Math.pow(i, mod.p3ep ? 0.75 : 1)).mul(1e5),
			bulk: r => Math.floor(Math.pow(r.max(1).div(1e5).log(3), 1 / (mod.p3ep ? 0.75 : 1))) + 1,
		}
	],

	//Feature - Lights
	lightCap: _ => 3 + ghSave.photons.lighten,
	release() {
		ghSave.photons.light = []

		let total = PHOTON.totalEmissions()
		for (const [i, light] of Object.entries(PHOTON.lightData)) {
			let gain = total - light.start + 1
			gain *= 1 + ghSave.photons.offset[i]
			gain = Math.min(Math.max(gain, 0), tmp.funda.photon.cap)

			ghSave.photons.light.push(gain)
		}
	},
	lightData: [
		{
			name: "red",
			start: 1,
			eff: a => E_pow(tmp.gal.ts || 1, -Math.cbrt(a) / 10),
			desc: e => `Multiply per-ten multiplier by ${shorten(e)}x. (based on tickspeed reduction)`
		}, {
			name: "orange",
			start: 3,
			eff: a => Math.min(Math.log2(a / 2 + 2), 3),
			desc: e => `Starting at ^9, raise 2nd Neutrino Boost by ^${shorten(e)}.`
		}, {
			name: "yellow",
			start: 5,
			eff: a => Math.cbrt(a + 1),
			desc: e => `Raise Replicate Slowdown by ^${shorten(e)}.`
		}, {
			name: "green",
			start: 7,
			eff: a => 1+a/1.5e3,
			desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
		}, {
			name: "blue",
			start: 9,
			eff: a => Math.cbrt(a / 10 + 1) - 1,
			desc: e => `Discharged Galaxies work, but as ${(e*100).toFixed(1)}% effective.`
		}, {
			name: "violet",
			start: 11,
			eff: a => Math.cbrt(a + 1),
			desc: e => `Post-16 Nanoreward scaling scales ${shorten(e)}x slower.`
		}, {
			name: "ultraviolet",
			start: 13,
			eff: a => Math.cbrt(a + 1),
			desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
		}
	],
	eff(x, def = 1) {
		return tmp.funda?.photon?.eff[x] ?? def
	},
	trade(x) {
		ghSave.photons.offset[x] += tmp.funda.photon.leftover ? 0.25 : -0.25
		ghSave.photons.offset[x] = Math.round(ghSave.photons.offset[x] * 100) / 100
		PHOTON.temp()
	},

	//Feature - Enlighten
	enlighten() {
		if (ghSave.photons.light[0]) {
			let min = 1/0
			for (var amt of ghSave.photons.light) min = Math.min(min, amt)
			if (min > tmp.funda.photon.cap) {
				ghSave.photons.lighten += min - tmp.funda.photon.cap + 1
				ghSave.photons.plusOne = {}
			}
		}
	},

	/* HTML */
	setupTab() {
		let shop = ``
		for (var i in PHOTON.emissionData) shop += `(Next: <span id='ph_shop_req_${i}'></span>)<br>`
		el("ph_shop").innerHTML = shop

		for (var [i, light] of Object.entries(PHOTON.lightData)) {
			el('ph_light_'+i).innerHTML = `<span id='ph_light_amt_${i}' style='font-size: 18px'></span>
			${light.name} Light (<span id='ph_light_per_${i}'></span>%)<br>
			(Req: ${light.start} Emissions)<br>
			<button class='storebtn' onclick='PHOTON.trade(${i})'>Trade</button>
			<br><br>
			<hr>
			<span id='ph_light_eff_${i}'></span>`
		}
	},
	update() {
		if (!PHOTON.unlocked()) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(1.9e9))+" antimatter in Big Rip to unlock Photons."
			return
		}

		el("ph_emission").textContent = getFullExpansion(PHOTON.totalEmissions())
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = "(+" + shortenMoney(PHOTON.photonGain()) + "/s)"
		el("ph_leftover").textContent = (tmp.funda.photon.leftover * 100).toFixed(0) + "%"
		el("ph_lighten").textContent = getFullExpansion(ghSave.photons.lighten)
		el("ph_lighten_req").textContent = "Get " + getFullExpansion(tmp.funda.photon.cap) + " of each Light to Enlighten"

		for (const [i, emission] of Object.entries(PHOTON.emissionData)) {
			el("ph_shop_req_" + i).textContent = `${shorten(emission.req(ghSave.photons.emission[i] || 0))} ${emission.resName}`
		}
		for (const [i, light] of Object.entries(PHOTON.lightData)) {
			el("ph_light_per_" + i).textContent = ((1 + ghSave.photons.offset[i]) * 100).toFixed(0)
			el("ph_light_amt_" + i).textContent = getFullExpansion(ghSave.photons.light[i] || 0) + " / " + getFullExpansion(PHOTON.lightCap(i))
			el("ph_light_eff_" + i).textContent = light.desc(PHOTON.eff(i))
		}
	}
}

function updatePhotonUnlocks() {
	if (!ghostified) return

	let unl = PHOTON.unlocked()
	el("gphUnl").style.display = unl ? "none" : ""
	el("gphDiv").style.display = unl ? "" : "none"
}
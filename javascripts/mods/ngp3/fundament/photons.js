let PHOTON = {
	/* CORE */
	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(1.8e9)),
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
			plusOne: {},
			lighten: 0
		}
	},
	calc(dt) {
		ghSave.photons.amt = ghSave.photons.amt.add(this.photonGain().mul(dt))

		for (var i in this.emissionData) this.getEmission(i)
		if (ghSave.photons.light[0]) {
			let min = 1/0
			for (var amt of ghSave.photons.light) min = Math.min(min, amt)
			if (min > tmp.funda.photon.cap) {
				ghSave.photons.lighten += min - tmp.funda.photon.cap
				ghSave.photons.plusOne = {}
			}
		}
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		tmp.funda.photon = data

		data.cap = this.globalLightCap()
		data.eff = []
		for (var [i, light] of Object.entries(this.lightData)) data.eff[i] = light.eff(ghSave.photons.light[i] || 0)
	},

	/* FEATURES */
	//Feature - Photons
	photonGain() {
		let r = E(player.dilation.bestTPOverGhostifies.max(1).log10() / 200).pow(10)
		if (hasNanoReward("photon")) r = r.mul(tmp.nf.eff.photon)
		if (hasNB(10)) r = r.mul(ntEff("boost", 10))
		return r
	},

	//Feature - Ions
	getEmission(i) {
		let amt = ghSave.photons.emission[i] || 0
		let kind = this.emissionData[i]
		let bulk = kind.bulk(kind.res())
		if (bulk <= amt) return

		ghSave.photons.emission[i] = kind.bulk(kind.res())
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

			req: i => E(50).pow(Math.pow(i, 1.5)).mul(1e26),
			bulk: r => Math.floor(Math.pow(r.max(1).div(1e26).log(50), 2/3)) + 1,
		}, {
			resName: "Elementary Particles",
			res: _ => ghSave.ghostParticles,

			req: i => E(1e3).pow(i).mul(1e18),
			bulk: r => Math.floor(r.max(1).div(1e18).log(1e3)) + 1,
		}, {
			resName: "Photons",
			res: _ => ghSave.photons.amt,

			req: i => E(5).pow(Math.pow(i, mod.p3ep ? 0.75 : 1)).mul(2e4),
			bulk: r => Math.floor(Math.pow(r.max(1).div(2e4).log(5), 1 / (mod.p3ep ? 0.75 : 1))) + 1,
		}
	],

	//Feature - Lights
	globalLightCap: _ => 2 + ghSave.photons.lighten,
	lightCap(i, allPlus) {
		let gain = tmp.funda.photon.cap
		if (allPlus || ghSave.photons.plusOne[i]) gain++
		return gain
	},
	release(allPlus) {
		ghSave.photons.light = []

		let total = PHOTON.totalEmissions()
		for (const i in PHOTON.lightData) {
			gain = Math.min(total, PHOTON.lightCap(i, allPlus))
			ghSave.photons.light.push(gain)
			total -= gain
		}
	},
	lightData: [
		{
			name: "red",
			eff: a => Math.log10(a + 1) / 3,
			desc: e => `Discharged Galaxies work, but as ${(e*100).toFixed(1)}% strong.`
		}, {
			name: "orange",
			eff: a => E_pow(tmp.gal.ts || 1, -Math.cbrt(a) / 10),
			desc: e => `Multiply per-ten multiplier by ${shorten(e)}x. (based on tickspeed reduction)`
		}, {
			name: "yellow",
			eff: a => Math.cbrt(a + 1),
			desc: e => `Strengthen Nanobenefits by ${e.toFixed(3)}x.`
		}, {
			name: "green",
			eff: a => Math.log10(a / 3 + 1) + 1,
			desc: e => `Nanorewards speed up Decay by ${e.toFixed(3)}x each.`
		}, {
			name: "blue",
			eff: a => Math.log2(a + 2),
			desc: e => `Raise Intergalactic by ^${shorten(e)} outside of Big Rips.`
		}, {
			name: "violet",
			eff: a => a/3+1,
			desc: e => `2nd Infinite Time softcap scales ^${shorten(e)} later.`
		}, {
			name: "ultraviolet",
			eff: a => Math.log2(a / 4 + 2),
			desc: e => `Starting at ^10, raise 2nd Neutrino Boost by ^${shorten(e)}.`
		}
	],
	eff(x, def = 1) {
		return tmp.funda?.photon?.eff[x] ?? def
	},

	/* HTML */
	setupTab() {
		let shop = ``
		for (var i in PHOTON.emissionData) shop += `(Next: <span id='ph_shop_req_${i}'></span>)<br>`
		el("ph_shop").innerHTML = shop

		for (var [i, light] of Object.entries(PHOTON.lightData)) {
			el('ph_light_'+i).innerHTML = `<span id='ph_light_amt_${i}' style='font-size: 18px'></span>
			${light.name} Light<br>
			<button class="storebtn" id='ph_light_cap_${i}' onclick='ghSave.photons.plusOne[${i}] = !ghSave.photons.plusOne[${i}]'>+1</button><br>
			<span id='ph_light_eff_${i}'></span>`
		}
	},
	update() {
		if (!PHOTON.unlocked()) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(1.8e9))+" antimatter in Big Rip to unlock Photons."
			return
		}

		el("ph_emission").textContent = getFullExpansion(PHOTON.totalEmissions())
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = "(+" + shortenMoney(PHOTON.photonGain()) + "/s)"
		el("ph_lighten").textContent = getFullExpansion(ghSave.photons.lighten)
		el("ph_lighten_req").textContent = "Get " + getFullExpansion(tmp.funda.photon.cap + 1) + " of each Light to Enlighten"

		for (const [i, emission] of Object.entries(PHOTON.emissionData)) {
			el("ph_shop_req_" + i).textContent = `${shorten(emission.req(ghSave.photons.emission[i] || 0))} ${emission.resName}`
		}
		for (const [i, light] of Object.entries(PHOTON.lightData)) {
			el("ph_light_amt_" + i).textContent = getFullExpansion(ghSave.photons.light[i] || 0) + " / " + getFullExpansion(PHOTON.lightCap(i))
			el("ph_light_eff_" + i).textContent = light.desc(PHOTON.eff(i))
			el("ph_light_cap_" + i).className = "storebtn " + (ghSave.photons.plusOne[i] ? "photon" : "")
		}
	}
}

function updatePhotonUnlocks() {
	if (!ghostified) return

	let unl = PHOTON.unlocked()
	el("gphUnl").style.display = unl ? "none" : ""
	el("gphDiv").style.display = unl ? "" : "none"
}
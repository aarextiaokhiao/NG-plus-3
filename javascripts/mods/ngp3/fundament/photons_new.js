let PHOTON = {
	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(1e10)),
	unlocked: _ => ghSave?.photons?.unl,

	//Calculation
	calc(dt) {
		ghSave.photons.amt = ghSave.photons.amt.add(this.photonGain().mul(dt))

		if (ghSave.photons.light[0]) {
			let min = 1/0
			for (var amt of ghSave.photons.light) min = Math.min(min, amt)
			if (min > tmp.photon.lightCap) {
				ghSave.photons.lighten++
				ghSave.photons.plusOne = {}
			}
		}
	},

	//Temp
	updateTemp() {
		if (!PHOTON.unlocked()) return
		let data = {}
		tmp.photon = data

		data.lightCap = this.globalCap()
		data.lightEff = []
		for (var [i, light] of Object.entries(this.lightData)) data.lightEff[i] = light.eff(ghSave.photons.light[i] || 0)
	},

	/* FEATURES */
	//PHOTONS
	photonGain() {
		return E(1)
	},

	//Ions
	canEmission(i) {
		let amt = ghSave.photons.emission[i] || 0
		let kind = this.emissionData[i]
		let bulk = kind.bulk(kind.res())
		return bulk > amt
	},
	getEmission(i) {
		if (!PHOTON.canEmission(i)) return
		let kind = PHOTON.emissionData[i]
		ghSave.photons.emission[i] = kind.bulk(kind.res())
	},
	emissions() {
		let total = 0
		for (const amt of ghSave.photons.emission) total += amt
		return total
	},
	emissionData: [
		{
			resName: "Preonic Spin",
			res: _ => todSave.r.spin,

			req: i => 0,
			bulk: r => 0,
		}, {
			resName: "Elementary Particles",
			res: _ => ghSave.ghostParticles,

			req: i => 0,
			bulk: r => 0,
		}, {
			resName: "Photons",
			res: _ => ghSave.photons.amt,

			req: i => 0,
			bulk: r => 0,
		}
	],

	//Feature - Lights
	globalCap: _ => 4 + ghSave.photons.lighten,
	lightCap(i) {
		let amt = tmp.photon.lightCap
		if (ghSave.photons.plusOne[i]) amt++
		return amt
	},
	release() {
		ghSave.photons.lights = []

		let total = PHOTON.emissions()
		for (const i in PHOTON.lightData) {
			let gain = Math.min(total, PHOTON.lightCap(i))
			ghSave.photons.lights.push(gain)
			total -= gain
		}
	},
	lightData: [
		{
			name: "red",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}, {
			name: "orange",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}, {
			name: "yellow",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}, {
			name: "green",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}, {
			name: "blue",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}, {
			name: "violet",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}, {
			name: "ultraviolet",
			eff: a => a,
			desc: e => `Boost something by ${shorten(e)}x.`
		}
	],
}

function setupPhotons() {
	return {
		amt: E(0),
		emission: [],
		light: [],
		plusOne: {},
		lighten: 0
	}
}

function unlockPhotons() {
	ghSave.photons.unl = true
	ngp3_feature_notify("ph")
	giveAchievement("Progressing as a Ghost")

	updateTemp()
	updateBreakEternity()
	updatePhotonUnlocks()
}

function updatePhotonUnlocks() {
	if (!mod.ngp3) return

	let unl = PHOTON.unlocked()
	el("gphUnl").style.display = unl ? "none" : ""
	el("gphDiv").style.display = unl ? "" : "none"
	el("gphRow").style.display = unl ? "" : "none"
	el("breakUpgR3").style.display = unl ? "" : "none"
}

function getLightEff(x, def) {
	return tmp?.photon?.lightEff?.[x] ?? def
}

function setupPhotonTab() {
	let shop = ``
	for (var i in PHOTON.emissionData) shop += `<button id='ph_shop_${i}' class='gluonupgrade gph' onclick='PHOTON.getEmission(${i})'>
		+1 Light Emission<br>
		<span id='ph_shop_req_${i}'></span>
	</button>`
	el("ph_shop").innerHTML = shop

	for (var [i, light] of Object.entries(PHOTON.lightData)) {
		el('ph_light_'+i).innerHTML = `<span id='ph_light_amt_${i}' style='font-size: 24px'></span>
		${light.name} Light<br>
		<button class="storebtn" id='ph_light_cap_${i}' onclick='ghSave.photons.plusOne[${i}] = !ghSave.photons.plusOne[${i}]'>+1</button><br>
		<span id='ph_light_eff_${i}'></span>`
	}
}

function updatePhotonTab() {
	if (!PHOTON.unlocked()) {
		el("gphUnl").textContent = "Get "+shortenCosts(pow10(1e10))+" antimatter in Big Rip to unlock Photons."
		return
	}

	el("ph_emission").textContent = getFullExpansion(PHOTON.emissions())
	el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
	el("ph_prod").textContent = "(+" + shortenMoney(PHOTON.photonGain()) + "/s)"
	el("ph_lighten").textContent = getFullExpansion(ghSave.photons.lighten)
	el("ph_lighten_req").textContent = "Get " + getFullExpansion(tmp.photon.lightCap + 1) + " of each Light to Enlightenment"

	for (const [i, emission] of Object.entries(PHOTON.emissionData)) {
		el("ph_shop_" + i).className = "gluonupgrade " + (PHOTON.canEmission(i) ? "gph" : "unavailablebtn")
		el("ph_shop_req_" + i).textContent = `(${emission.req(ghSave.photons.emission[i] || 0)} ${emission.resName})`
	}
	for (const [i, light] of Object.entries(PHOTON.lightData)) {
		el("ph_light_amt_" + i).textContent = getFullExpansion(ghSave.photons.light[i] || 0) + " / " + getFullExpansion(PHOTON.lightCap(i))
		el("ph_light_eff_" + i).textContent = light.desc(getLightEff(i))
		el("ph_light_cap_" + i).className = ghSave.photons.plusOne[i] ? "chosenbtn" : "storebtn"
	}
}
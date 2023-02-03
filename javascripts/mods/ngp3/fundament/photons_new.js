let PHOTON = {
	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(8e9)),
	unlocked: _ => ghSave?.photons?.unl,

	//Calculation
	calc(dt) {
		ghSave.photons.amt = ghSave.photons.amt.add(this.photonGain().mul(dt))

		for (var i in this.emissionData) this.getEmission(i)
		if (ghSave.photons.light[0]) {
			let min = 1/0
			for (var amt of ghSave.photons.light) min = Math.min(min, amt)
			if (min > tmp.photon.lightCap) {
				ghSave.photons.lighten += min - tmp.photon.lightCap
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
		let r = E(player.dilation.bestTPOverGhostifies.max(1).log10())
		if (tmp.nb[10]) r = r.mul(tmp.nb[10])
		if (isNanoEffectUsed("photons")) ret = ret.mul(tmp.nf.effects.photons)
		return r
	},

	//Ions
	getEmission(i) {
		let amt = ghSave.photons.emission[i] || 0
		let kind = this.emissionData[i]
		let bulk = kind.bulk(kind.res())
		if (bulk <= amt) return

		ghSave.photons.emission[i] = kind.bulk(kind.res())
	},
	emissions() {
		let total = 0
		for (const amt of ghSave.photons.emission) total += amt || 0
		return total
	},
	emissionData: [
		{
			resName: "Preonic Spin",
			res: _ => todSave.r.spin,

			req: i => E(1e3).pow(i).mul(1e30),
			bulk: r => Math.floor(r.div(1e30).log(1e3))+1,
		}, {
			resName: "Elementary Particles",
			res: _ => ghSave.ghostParticles,

			req: i => E(1e10).pow(i).mul(1e90),
			bulk: r => Math.floor(r.div(1e90).log(1e10))+1,
		}, {
			resName: "Photons",
			res: _ => ghSave.photons.amt,

			req: i => E(5).pow(i).mul(1e5),
			bulk: r => Math.floor(r.div(1e5).log(5))+1,
		}
	],

	//Feature - Lights
	globalCap: _ => 2 + ghSave.photons.lighten,
	lightCap(i) {
		let amt = tmp.photon.lightCap
		if (ghSave.photons.plusOne[i]) amt++
		return amt
	},
	release() {
		ghSave.photons.light = []

		let total = PHOTON.emissions()
		for (const i in PHOTON.lightData) {
			let gain = Math.min(total, PHOTON.lightCap(i))
			ghSave.photons.light.push(gain)
			total -= gain
		}
	},
	lightData: [
		{
			name: "red",
			eff: a => Math.log10(a + 10),
			desc: e => `2nd Infinite Time softcap starts ^${e.toFixed(3)} later.`
		}, {
			name: "orange",
			eff: a => Math.log10(a + 10),
			desc: e => `Nanorewards speed up Nanofield by ${e.toFixed(3)}x per each.`
		}, {
			name: "yellow",
			eff: a => Math.log10(a + 10),
			desc: e => `Strengthen 8th Nanoreward by ${e.toFixed(3)}x.`
		}, {
			name: "green",
			eff: a => Math.log10(a + 10),
			desc: e => `Dilated time gives ^${e.toFixed(3)} boost to Meta Dimensions.`
		}, {
			name: "blue",
			eff: a => Math.log10(a + 10),
			desc: e => `Free tickspeed upgrades scale ${e.toFixed(3)}x faster.`
		}, {
			name: "violet",
			eff: a => Math.log10(a + 10) - 1,
			desc: e => `Add per-10 base by +${e.toFixed(3)}x before Positrons.`
		}, {
			name: "ultraviolet",
			eff: a => Math.log10(a + 10),
			desc: e => `Meta Dimension costs scale ^${e.toFixed(2)} later.`
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

function getLightEff(x, def = 1) {
	return tmp?.photon?.lightEff?.[x] ?? def
}

function setupPhotonTab() {
	let shop = ``
	for (var i in PHOTON.emissionData) shop += `(Next: <span id='ph_shop_req_${i}'></span>)<br>`
	el("ph_shop").innerHTML = shop

	for (var [i, light] of Object.entries(PHOTON.lightData)) {
		el('ph_light_'+i).innerHTML = `<span id='ph_light_amt_${i}' style='font-size: 18px'></span>
		${light.name} Light<br>
		<button class="storebtn" id='ph_light_cap_${i}' onclick='ghSave.photons.plusOne[${i}] = !ghSave.photons.plusOne[${i}]'>+1</button><br>
		<span id='ph_light_eff_${i}'></span>`
	}
}

function updatePhotonTab() {
	if (!PHOTON.unlocked()) {
		el("gphUnl").textContent = "Get "+shortenCosts(pow10(8e9))+" antimatter in Big Rip to unlock Photons."
		return
	}

	el("ph_emission").textContent = getFullExpansion(PHOTON.emissions())
	el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
	el("ph_prod").textContent = "(+" + shortenMoney(PHOTON.photonGain()) + "/s)"
	el("ph_lighten").textContent = getFullExpansion(ghSave.photons.lighten)
	el("ph_lighten_req").textContent = "Get " + getFullExpansion(tmp.photon.lightCap + 1) + " of each Light to Enlightenment"

	for (const [i, emission] of Object.entries(PHOTON.emissionData)) {
		el("ph_shop_req_" + i).textContent = `${shorten(emission.req(ghSave.photons.emission[i] || 0))} ${emission.resName}`
	}
	for (const [i, light] of Object.entries(PHOTON.lightData)) {
		el("ph_light_amt_" + i).textContent = getFullExpansion(ghSave.photons.light[i] || 0) + " / " + getFullExpansion(PHOTON.lightCap(i))
		el("ph_light_eff_" + i).textContent = light.desc(getLightEff(i))
		el("ph_light_cap_" + i).className = ghSave.photons.plusOne[i] ? "chosenbtn" : "storebtn"
	}
}
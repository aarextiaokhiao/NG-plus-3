function lightEff(x, def) {
	return PHOTON.light.eff(x, def)
}

let PHOTON = {
	/* CORE */
	setup() {
		return {
			amt: E(0),
			exp_time: 0,
			slowdown: {}
		}
	},

	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(19e8)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		notifyFeature("ph")
	},

	//Calculation
	calc(dt) {
		ghSave.photons.amt = this.photon_prod().mul(PHOTON.get_tick(dt, "photon")).add(ghSave.photons.amt)

		ghSave.photons.exp_time += tmp.funda.photon.et_prod * dt
		if (ghSave.photons.exp_time < 0) {
			ghSave.photons.exp_time = 0
			ghSave.photons.speed = false
		}
	},
	temp() {
		if (!this.unlocked()) return

		let data = tmp.funda.photon = {}
		let lights = this.light.data

		data.et_prod = 0
		data.et_bonus = Math.max(player.meta.resets - 375, 0) * 10 + getTreeUpgradeEffect(9)
		for (var i in this.affected_features) {
			if (ghSave.photons.slowdown[i]) data.et_prod += 1/3
			else if (ghSave.photons.speed) data.et_prod -= 100
		}

		data.eff_amt = ghSave.photons.amt
		if (data.eff_amt.gt(1e10)) data.eff_amt = data.eff_amt.sqrt().mul(1e5)

		data.unls = 0, data.eff = []
		for (let [i, light] of Object.entries(lights)) {
			if (ghSave.photons.amt.gte(light.req)) data.unls++
			data.eff[i] = light.eff(data.unls > i ? data.eff_amt.div(light.req).log10() : 0)
		}
	},

	/* Feature - Time */
	affected_features: {
		rep: "Replicantis",
		ed: "Emperors",
		decay: "Decay",
		photon: "Photons",
	},
	get_tick(x, feature) {
		if (PHOTON.unlocked()) {
			if (ghSave.photons.slowdown[feature]) x /= 100
			else if (ghSave.photons.speed) x += Math.min(x, -ghSave.photons.exp_time / tmp.funda.photon.et_prod) * 99
		}
		return x
	},
	toggle_speed(i) {
		ghSave.photons.slowdown[i] = !ghSave.photons.slowdown[i]
	},

	/* Feature - Lights */
	photon_prod() {
		let r = pow10((player.meta.resets - 400) / 25)
		if (hasNB(11))               r = r.mul(NT.eff("boost", 11))
		if (hasNanoReward("photon")) r = r.mul(tmp.qu.nf.eff.photon)
		if (WZ_BOSONS.unlocked()) {
			r = r.mul(WZ_BOSONS.eff("pos", 0))
			r = r.div(WZ_BOSONS.eff("neg", 1))
		}
		return r
	},
	light: {
		data: [
			{
				name: "infrared",
				req: 10,
				eff: exp => Math.min(Math.sqrt(exp) / 200, .01),
				desc: e => `Outside of Big Rip, TS232 regains ${shorten(e*100)}% of strength.`,
			}, {
				name: "red",
				req: 100,
				eff: exp => Math.min(exp / 500 + 1, 1.005),
				desc: e => `Starting at 2,000: Gain ${shorten((e-1)*100)}% more Neutrinos per a Big Rip galaxy gained in this Fundament.`
			}, {
				name: "orange",
				req: 300,
				eff: exp => E(tmp.gal.ts || 1).pow(-Math.min(exp / 20, 1)),
				desc: e => `Tickspeed reduction multiplies per-ten Antimatter Dimension bonus by ${shorten(e)}x.`
			}, {
				name: "yellow",
				req: 2e3,
				eff: exp => Math.min(1 + exp / 20, 2),
				desc: e => `Meta Dimensions scale ${shorten((e-1)*100)}% weaker.`
			}, {
				name: "green",
				req: 2e4,
				eff: exp => exp * 2,
				desc: e => `Nanorewards scale +${shorten(e)} later.`
			}, {
				name: "blue",
				req: 2e6,
				eff: exp => Math.log10(exp / 10 + 1) + 1,
				desc: e => `Raise all non-Decay multipliers that speed up Decay by ^${shorten(e)}.`
			}, {
				name: "violet",
				req: 2e8,
				eff: exp => Math.min(Math.log10(exp / 7.5 + 1), 1),
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% efficient.`
			}, {
				name: "ultraviolet",
				req: 5e9,
				eff: exp => 0,
				desc: e => `Placeholder boost.`
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

		html = ``
		for (var i in this.affected_features) html += `<button id='ph_time_${i}' onclick='PHOTON.toggle_speed("${i}")'></button>`
		el('ph_speeds').innerHTML = html
	},
	update() {
		let unl = this.unlocked()
		el("gphUnl").style.display = unl ? "none" : ""
		el("gphDiv").style.display = unl ? "" : "none"
		if (!unl) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(19e8))+" antimatter in Big Rip to unlock Photons."
			return
		}

		let pt = tmp.funda.photon, ps = ghSave.photons
		el("ph_time").textContent = timeDisplayShort(ps.exp_time * 10)
		el("ph_speed").textContent = "▲ Speeding: " + (ps.speed ? "100x" : "1x")
		for (var [i, name] of Object.entries(this.affected_features)) {
			el("ph_time_" + i).className = "photon slot " + (ps.slowdown[i] ? "off" : "")
			el("ph_time_" + i).innerHTML = `<b>${name}</b><br>
			${ps.slowdown[i] ? "▼ STALLING<br>(0.01x speed)" : ps.speed ? "▲ SPEEDING<br>(100x speed)" : "▲ SPEEDING<br>(1x speed)"}`
		}

		let pg_html = `${(pt.et_prod < 0 ? "-" : "+") + shortenMoney(Math.abs(pt.et_prod))}/s, `
		if (pt.et_prod < 0) pg_html += `time left: ${timeDisplayShort(-ghSave.photons.exp_time / pt.et_prod * 10)}, `
		pg_html += `next fundament: +${shortenMoney(pt.et_bonus)}s`
		el("ph_gain").textContent = "(" + pg_html + ")"

		let lights = this.light.data
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var [i, light] of Object.entries(lights)) {
			el("ph_light_" + i).className = `light ${light.name} ${pt.unls > i ? "" : "blank"}`
			el("ph_light_eff_" + i).innerHTML = (pt.unls > i ? "" : `(Requires ${shorten(light.req)} Photons)<br>`) + light.desc(lightEff(i))
		}
	}
}
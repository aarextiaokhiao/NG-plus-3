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
		data.et_bonus = Math.max(player.meta.resets - 400, 0) * 5
		for (var i in this.affected_features) {
			if (ghSave.photons.slowdown[i]) data.et_prod += 1/3
			else if (ghSave.photons.speed) data.et_prod -= 100
		}

		data.unls = 0, data.eff = []
		for (let [i, light] of Object.entries(lights)) {
			if (ghSave.photons.amt.gte(light.req)) data.unls++
			data.eff[i] = light.eff(data.unls > i ? ghSave.photons.amt.div(light.req).log10() : 0)
		}
	},

	/* Feature - Time */
	affected_features: {
		rep: "Replicantis",
		nf: "Nanofield",
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
		let r = (player.meta.resets - 400) / 30

		r = pow10(r)
		if (hasNB(11))               r = r.mul(NT.eff("boost", 11))
		if (hasNanoReward("photon")) r = r.mul(tmp.qu.nf.eff.photon)
		if (PHANTOM.amt >= 1)        r = r.mul(pow2(PHANTOM.amt))
		return r
	},
	light: {
		data: [
			{
				name: "infrared",
				req: 10,
				eff: exp => Math.min(Math.min(exp, exp ** 0.2) / 5, 1.5),
				desc: e => `Raise Infinity Power effect by +^${shorten(e)}.`
			}, {
				name: "red",
				req: 500,
				eff: exp => Math.log2(exp + 1) / 200 + 1,
				desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
			}, {
				name: "orange",
				req: 3e3,
				eff: exp => exp / 3,
				desc: e => `Nanorewards scale +${shorten(e)} later.`
			}, {
				name: "yellow",
				req: 1e4,
				eff: exp => Math.min(exp / 50 + 1, 2),
				desc: e => `Raise all non-Decay multipliers that speed up Decay by ^${shorten(e)}.`
			}, {
				name: "green",
				req: 1e5,
				eff: exp => E_pow(tmp.gal.ts || 1, Math.min(-exp / 10, 1)),
				desc: e => `Tickspeed reduction multiplies per-ten Antimatter Dimension bonus by ${shorten(e)}x.`
			}, {
				name: "blue",
				req: 1e6,
				eff: exp => Math.sqrt(1 + exp / 100),
				desc: e => `Meta Dimension cost scales ${shorten((e-1)*100)}% weaker.`
			}, {
				name: "violet",
				req: 1e100,
				eff: exp => Math.min(1 + Math.sqrt(exp), 3),
				desc: e => `Raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
			}, {
				name: "ultraviolet",
				req: 1e100,
				eff: exp => Math.min(exp / 1e4, .05),
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% efficient.`
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
		for (var i in this.affected_features) html += `<button id='ph_time_${i}' onclick='PHOTON.toggle_speed("${i}")' class='photon slot'></button>`
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
		el("ph_time").textContent = shortenMoney(ps.exp_time) + "s"
		el("ph_speed").textContent = "Speedramp: " + (ps.speed ? "ON" : "OFF")
		el("ph_gain").textContent = `(${(pt.et_prod < 0 ? "-" : "+") + shortenMoney(Math.abs(pt.et_prod))}/s, next fundament: +${shortenMoney(pt.et_bonus)}s)`
		for (var [i, name] of Object.entries(this.affected_features)) {
			el("ph_time_" + i).innerHTML = `<b>${name}</b><br>
			${ps.slowdown[i] ? "STALLING<br>(0.01x speed)" : ps.speed ? "PASSING<br>(100x speed)" : "PASSING<br>(1x speed)"}`
		}

		let lights = this.light.data
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var [i, light] of Object.entries(lights)) {
			el("ph_light_" + i).className = `light ${light.name} ${pt.unls > i ? "" : "blank"}`
			el("ph_light_eff_" + i).innerHTML = (pt.unls > i ? "" : `(Requires ${shorten(light.req)} Photons)<br>`) + light.desc(lightEff(i))
		}
	}
}
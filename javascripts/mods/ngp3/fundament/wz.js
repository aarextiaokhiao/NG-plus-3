const WZ_BOSONS = {
	/* CORE */
	//Unlock
	req: _ => tmp.funda.photon?.unls >= 8 && ghSave.ghostParticles.gte(1e38),
	unlocked: _ => blSave?.unl,
	unlock() {
		blSave.unl = true
		notifyFeature("bl")
	},

	setup() {
		return {
			z_best: 1,
			w_used: 0,
			w_next: 0
		}
	},

	/* CALCULATION */
	temp() {
		let data = tmp.funda.wz || {}
		tmp.funda.wz = data

		data.eff = {
			pos: [],
			neg: []
		}

		if (!this.unlocked()) return

		data.potential_z = 0
		data.potential_w = data.potential_z - blSave.w_used

		let group = data.potential_w > 0 ? "pos" : "neg"
		for (var i of WZ_BOSONS.milestones[group]) {
			if (Math.abs(data.potential_w) > Math.abs(i.req)) {
				data.eff[group].push(i.eff())
			}
		}
	},

	insert_w() {
		if (blSave.z_best - blSave.w_next < 1) blSave.w_next = blSave.z_best
		else blSave.w_next++
	},
	remove_w() {
		if (blSave.w_used > 0 && !confirm("This will cancel your W- Bosons on your current run! Are you sure?")) return

		blSave.w_used = 0
		blSave.w_next = 0
	},

	milestones: {
		pos: [
			{ req: 0, eff: _ => x + 1, desc: x => `<b>${shorten(x)}x</b> Photons.` }
		],
		neg: [
			{ req: 0, eff: _ => 1 / (x * 0.2 + 1), desc: x => `<b>^${shorten(x)}</b> Neutrinos.` },
			{ req: 0, eff: _ => Math.pow(x + 1, 2), desc: x => `<b>/${shorten(x)}</b> Photons.` },
		]
	},
	eff(type, x, def = 1) {
		return tmp.funda.wz.eff[type][x] ?? def
	},

	format_w(x) {
		return shortenMoney(Math.abs(x)) + (x > 0 ? "+" : x < 0 ? "-" : "")
	},

	/* HTML */
	setupTab() {
		//placeholder
	},
	updateTab() {
		el("wz_req").style.display = !WZ_BOSONS.unlocked() ? "" : "none"
		el("wz_div").style.display = WZ_BOSONS.unlocked() ? "" : "none"
		if (!WZ_BOSONS.unlocked()) {
			el("wz_req").innerHTML = `Reach Ultraviolet Light and ${shorten(1e38)} Spectral Particles to unlock W & Z Bosons.`
			return
		}

		el("z_amt").innerHTML = shorten(blSave.z_best - blSave.w_next) + " / " + shorten(blSave.z_best)
		el("w_applied").innerHTML = this.format_w(tmp.funda.wz.potential_w)
		el("w_next").innerHTML = this.format_w(-blSave.w_next)
		el("w_cur").innerHTML = this.format_w(-blSave.w_used)
		el("w_add").className = blSave.z_best > blSave.w_next ? "storebtn" : "unavailablebtn"
		el("w_sub").className = blSave.w_next > 0 ? "storebtn" : "unavailablebtn"

		let w_html = ''
		let group = tmp.funda.wz.potential_w > 0 ? "pos" : "neg"
		for (var [i, eff] of Object.entries(tmp.funda.wz.eff[group])) {
			w_html += WZ_BOSONS.milestones[group][i].desc(eff)
			w_html += `<br>`
		}

		w_html += `<b>${shorten(tmp.funda.wz.potential_z)}</b> potential Z Bosons (based on your progress)`

		el("w_eff").innerHTML = w_html
	},
}
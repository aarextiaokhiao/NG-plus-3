function hasWZMilestone(type, i) {
	//to-do: Replace this function with something else.
	return false
}

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
			total_z: 0,
			w_used: 0
		}
	},

	/* CALCULATION */
	temp() {
		if (!this.unlocked()) return

		let data = tmp.funda.wz || {}
		tmp.funda.wz = data

		data.potential_z = 0
		data.potential_w = 0
		data.eff = {
			pos: [],
			neg: []
		}
		
		if (data.potential_w > 0) for (var i of WZ_BOSONS.milestones.pos) data.eff.pos.push(i.eff())
		if (data.potential_w < 0) for (var i of WZ_BOSONS.milestones.neg) data.eff.neg.push(i.eff())
	},

	milestones: {
		pos: [
			{ req: 1, eff: _ => 1, desc: _ => "Testing..." }
		],
		neg: [
			{ req: 1, eff: _ => 1, desc: _ => "Testing..." }
		]
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

		//placeholder
	},
}
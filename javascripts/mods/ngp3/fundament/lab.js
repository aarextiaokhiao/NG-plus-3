function hasWZMilestone(type, i) {
	//to-do: Replace this function with something else.
	return false
}

const WZ_FIELD = {
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
			//placeholder
		}
	},

	/* CALCULATION */
	temp() {
		if (!this.unlocked()) return

		let data = tmp.funda.wz || {}
		tmp.funda.wz = data

		//placeholder
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
		el("wz_req").style.display = !WZ_FIELD.unlocked() ? "" : "none"
		el("wz_div").style.display = WZ_FIELD.unlocked() ? "" : "none"
		if (!WZ_FIELD.unlocked()) {
			el("wz_req").innerHTML = `Reach Ultraviolet Light and ${shorten(1e38)} Spectral Particles to unlock W & Z Field.`
			return
		}
	},
}
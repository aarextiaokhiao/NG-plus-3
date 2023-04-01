let BOSONIC_LAB = {
	started: _ => ghostified,
	setup() {
		return {
			portions: []
		}
	},

	find(x) {
		if (ghSave.lab_real.portions.includes(x)) $.notify(`You already found piece #${x}.`)
		else {
			ghSave.lab_real.portions.push(x)
			$.notify("You found a piece!")
		}

		let msg = ghSave.lab_real.portions.length == 5 ? "Go back to the ??? tab and sign the contract!" : (5 - ghSave.lab_real.portions.length) + " remain."
		$.notify(msg)
	},
	sign() {
		if (ghSave.lab_real.signed) {
			$.notify("You already signed a contract!")
		} else if (ghSave.lab_real.portions.length < 5) {
			$.notify("The contract requires you to get 5 pieces hidden from NG+3.")
		} else {
			ghSave.lab_real.signed = true
			$.notify("You signed a contract.")
		}
	},
	findKey() {
		ghSave.lab_real.key = true
		$.notify("You found a key! Go back to 'Bosonic Lab' tab.")
	},
	unlock() {
		if (!ghSave.lab_real.key) {
			$.notify("???: Ummm... Can you find the key? Hint: Keys save you from wasted clicks! Those keys are disablable at options.")
			return
		}
		$.notify("April Fools 2023! Stay tuned for real Bosonic Lab.")
	},

	//HTML
	updateHTML() {
		let started = this.started()
		el("tab_bl").style.display = started ? "" : "none"
		el("tab_bl").textContent = started && ghSave.lab_real.signed ? "Bosonic Lab" : "???"
		for (var i = 1; i <= 5; i++) el("bl_portion_"+i).style.display = started ? "" : "none"
		if (!started) return

		el("bl_unl").style.display = ghSave.lab_real.signed ? "" : "none"
		el("bl_unl").className = "qu_upg " + (ghSave.lab_real.key ? "storebtn" : "unavailablebtn")
	}
}
//Real
const BOSONIC_LAB = LAB = {
	/* CORE */
	//Unlock
	req: _ => PHOTON.totalEmissions() >= 15,
	unlocked: _ => ghSave?.lab.unl,
	unlock() {
		blSave.unl = true
		ngp3_feature_notify("bl")
	},

	//Calculation
	setup() {
		return {
			bosons: E(0),
			best_bosons: E(0),

			hypo_field: {},
			wz_capacitors: WEAK_FORCE.setup(),
			hf: {
				amt: E(0),
				boosts: {},
				dims: [E(0), E(0), E(0), E(0)],
			}
		}
	},
	calc(dt) {
		blSave.bosons = blSave.bosons.add(this.prod().mul(dt)).min(this.cap())
		blSave.best_bosons = blSave.best_bosons.max(blSave.bosons)
	},
	temp() {
		if (!this.unlocked()) return
		let data = {}
		tmp.funda.lab = data

		WEAK_FORCE.temp()
		BL_HYPOTHESES.temp()

		data.ms = {}
		for (var [i, d] of Object.entries(this.milestones)) {
			if (d.eff) data.ms[i] = d.eff(blSave.best_bosons)
		}
	},

	/* BOSONS */
	prod() {
		let r = E(0.01)
		if (hasBond("0;1")) r = r.mul(bondEff("0;1"))
		if (isCapacitorsActive()) r = r.mul(capacitorEff(0))
		if (isCapacitorsActive() && r.gt(1)) r = r.pow(capacitorEff(1))
		return r
	},
	cap() {
		return ghSave.ghostParticles.pow(.05).div(100)
	},
	milestones: [
		{
			req: E(1),
			desc: "Boost something.",
			eff: b => 1,
			effDesc: e => `(by ${shorten(e)}x)`,
		}, {
			req: E(2),
			desc: "Boost something."
		}, {
			req: E(5),
			desc: "Boost something."
		}, {
			req: E(10),
			desc: "Boost something.",
			eff: b => 1,
			effDesc: e => `(by ${shorten(e)}x)`,
		}, {
			req: E(20),
			desc: "Boost something."
		}, {
			req: E(50),
			desc: "Boost something."
		}, {
			req: E(100),
			desc: "Boost something.",
			eff: b => 1,
			effDesc: e => `(by ${shorten(e)}x)`,
		}, {
			req: E(200),
			desc: "Boost something."
		}, {
			req: E(500),
			desc: "Boost something."
		}, {
			req: E(1e3),
			desc: "Boost something.",
			eff: b => 1,
			effDesc: e => `(by ${shorten(e)}x)`,
		}, {
			req: E(2e3),
			desc: "Boost something."
		}, {
			unl: _ => false,
			req: E(5e3),
			desc: "Boost something."
		}
	],

	/* HTML */
	setupTab() {
		BL_HYPOTHESES.setupTab()
		WEAK_FORCE.setupTab()

		let html = ""
		for (var [i, d] of Object.entries(this.milestones)) {
			html += `<tr id='bl_milestone_div_${i}'>
				<td><b id='bl_milestone_req_${i}'></b></td>
				<td><button class="milestonerewardlocked" id='bl_milestone_${i}'>
					${d.desc}<br>
					${d.effDesc ? `Currently: <span id='bl_milestone_eff_${i}'></span>` : ""}
				</button></td>
			</tr>`
		}
		el("bl_milestone_table").innerHTML = html
	},
	update() {
		if (BL_JOKE.started()) return
		//AF2023 joke.

		el("bl_amt").textContent = shorten(blSave.bosons) + " / " + shorten(this.cap())
		el("bl_best").textContent = "(" + shorten(blSave.best_bosons) + " best)"
		el("bl_prod").textContent = shorten(this.prod()) + "/s"

		if (isTabShown("hypotheses")) BL_HYPOTHESES.update()
		if (isTabShown("weak_force")) WEAK_FORCE.update()
		if (isTabShown("bl_milestones")) {
			for (var [i, d] of Object.entries(this.milestones)) {
				let unl = !d.unl || d.unl()
				el("bl_milestone_div_"+i).style.display = unl ? "" : "none"
				if (!unl) continue

				el("bl_milestone_"+i).className = hasBLMilestone(i) ? "milestonereward bosonic_btn" : "milestonerewardlocked"
				el("bl_milestone_req_"+i).innerHTML = shortenDimensions(d.req) + " Bosons"
				if (d.effDesc) el("bl_milestone_eff_"+i).innerHTML = d.effDesc(tmp.funda.lab.ms[i])
			}
		}
	},
}

function hasBLMilestone(i) {
	if (!LAB.unlocked()) return
	return blSave.best_bosons.gte(LAB.milestones[i].req)
}

function blEff(i, def) {
	return tmp.funda?.lab?.ms[i] || def
}

function showBLTab(x) {
	showTab(x, "bl_tab")
}

//Subfeatures
const BL_HYPOTHESES = {
	//Calculation
	temp() {
		tmp.funda.lab.bond = {}
		for (let i of Object.keys(blSave.hypo_field)) {
			let x = parseInt(i.split(";")[1])
			let y = parseInt(i.split(";")[0])
			this.recordBond(y+";"+x, y+";"+(x+1))
			this.recordBond(y+";"+x, (y+1)+";"+x)
		}

		let str = this.hypo_str()
		tmp.funda.lab.bond_eff = {}
		for (let [i, a] of Object.entries(tmp.funda.lab.bond)) tmp.funda.lab.bond_eff[i] = this.bond_eff[i].eff(a * str)
	},

	/* HYPOTHESES */
	choose(x) {
		BL_HYPOTHESES.hypo_chosen = x
	},
	hypo_types: [
		{
			name: "Infinity",
			unl: _ => true,
		}, {
			name: "Eternal",
			unl: _ => true,
		}, {
			name: "Quantum",
			unl: _ => true,
		}, {
			name: "Spectral",
			unl: _ => false,
		}
	],
	hypo_str() {
		let r = 1
		if (isCapacitorsActive()) r = capacitorEff(2)
		return r
	},

	/* FIELD */
	clear() {
		blSave.hypo_field = {}
	},
	exportField() {
		let str = ""
		for (var [i, d] of Object.entries(blSave.hypo_field)) str+=","+i+";"+d
		exportData("[FIELD" + str + "]")
	},

	place(x) {
		if (blSave.hypo_field[x] === BL_HYPOTHESES.hypo_chosen) delete blSave.hypo_field[x]
		else blSave.hypo_field[x] = BL_HYPOTHESES.hypo_chosen
	},
	recordBond(a, b) {
		let field = blSave.hypo_field
		if (field[a] === undefined) return
		if (field[b] === undefined) return
		if (field[a] == field[b]) return

		let id = Math.min(field[a], field[b]) + ";" + Math.max(field[b], field[a])
		tmp.funda.lab.bond[id] = (tmp.funda.lab.bond[id] || 0) + 1
	},
	bond_eff: {
		["0;1"]: {
			eff: x => x/10+1,
			disp: e => `Boost Bosons by <b>${shorten(e)}x</b>`,
		},
		["0;2"]: {
			eff: x => Math.floor(x/2),
			disp: e => `Add W Bosons by <b>+${e}</b>`,
		},
		["1;2"]: {
			eff: x => Math.floor(x/10),
			disp: e => `Add Z0 Bosons by <b>+${e}</b>`,
		}
	},

	/* HTML */
	setupTab() {
		let choices = ""
		for (let i = 0; i < this.hypo_types.length; i++) choices += `<button class='hypo_btn' id='hypo_choice_${i}' ach-tooltip="${this.hypo_types[i].name}" onclick="BL_HYPOTHESES.choose(${i})"><span class="hypo hypo${i}"></span></button>`
		el("hypo_choice").innerHTML = choices

		let field = "<tr>"
		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				field += `<td><button class='hypo_btn' onclick='BL_HYPOTHESES.place("${y};${x}")'><span class="hypo" id="hypo_${y};${x}"></span></button></td>`
			}
			field += "</tr><tr>"
		}
		el("hypo_field").innerHTML = field
	},
	update() {
		for (let i = 0; i < this.hypo_types.length; i++) {
			el("hypo_choice_" + i).className = "hypo_btn " + (this.hypo_chosen == i ? "chosen" : "")
			el("hypo_choice_" + i).style.display = this.hypo_types[i].unl() ? "" : "none"
		}

		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				let id = y+";"+x
				let type = blSave.hypo_field[id]
				el('hypo_'+id).className = type !== undefined ? "hypo hypo" + type : "hypo"
			}
		}

		let bonds = ""
		for (let [i, a] of Object.entries(tmp.funda.lab.bond_eff)) {
			let split = i.split(";")
			bonds += `<span class="hypo hypo${split[0]}"></span><span class="hypo hypo${split[1]}"></span> ${this.bond_eff[i].disp(a)}<br>`
		}
		el("hypo_bonds").innerHTML = bonds
	},
}

function hasBond(i) {
	return tmp.funda?.lab?.bond[i]
}

function bondEff(i, def = 1) {
	return tmp.funda?.lab?.bond_eff[i] || def
}

const WEAK_FORCE = {
	setup() {
		let data = []
		for (var i in this.capacitors) data.push({p: 0, m: 0})
		return data
	},

	//Calculation
	temp() {
		let amt = {}
		tmp.funda.lab.bosons = amt
		amt.w = this.amt.w()
		amt.z = this.amt.z()
		amt.hc = amt.z
		for (var d of blSave.wz_capacitors) {
			amt.w -= d.p + d.m
			amt.hc += d.m - d.p
		}

		let eff = {}
		tmp.funda.lab.capacitors = eff
		for (var [i, d] of Object.entries(this.capacitors)) eff[i] = d.eff(blSave.wz_capacitors[i].p)
	},

	/* BOSONS */
	amt: {
		w() {
			return 5
		},
		z() {
			return 0
		}
	},

	/* CAPACIATORS */
	capacitors: [
		{
			eff: x => blSave.bosons.add(1).log10() * Math.sqrt(x) + 1,
			disp: e => `Bosons boost itself by <b>${shorten(e)}x</b>.`,
			unl: _ => true,
		}, {
			eff: x => Math.sqrt(x/10+1),
			disp: e => `Raise Bosons by <b>^${shorten(e)}</b>.`,
			unl: _ => true,
		}, {
			eff: x => Math.log10(x+10),
			disp: e => `Boost Hypotheses by <b>${shorten(e)}x</b>.`,
			unl: _ => false,
		}
	],
	total(i) {
	},
	put(i, type) {
		let data = blSave.wz_capacitors
		if (type == "plus" && tmp.funda.lab.bosons.w) data[i].p++
		if (type == "minus" && tmp.funda.lab.bosons.w) data[i].m++
		if (type == "putout") {
			data[i].p = Math.max(data[i].p - 1, 0)
			data[i].m = Math.max(data[i].m - 1, 0)
		}
		if (type == "clear") data[i] = {p: 0, m: 0}
	},

	/* HTML */
	setupTab() {
		let html = ""
		for (var i in this.capacitors) html += `<td  id='wz_capacitor_div_${i}' style='text-align: center'>
			<button class='wz_capacitor' onclick='WEAK_FORCE.put(${i}, "plus")'>
				<b id='wz_capacitor_amt_${i}'>0/0</b><br>
				<span id='wz_capacitor_eff_${i}'></span>
			</button><br>
			<button class='storebtn' onclick='WEAK_FORCE.put(${i}, "minus")'>+1 W-</button><br>
			<button class='storebtn' onclick='WEAK_FORCE.put(${i}, "putout")'>-1</button><br>
			<button class='storebtn' onclick='WEAK_FORCE.put(${i}, "clear")'>Clear</button>
		</td>`
		el("wz_capacitors").innerHTML = html
	},
	update() {
		let data_tmp = tmp.funda.lab
		el("wz_w").innerHTML = data_tmp.bosons.w
		el("wz_z").innerHTML = data_tmp.bosons.z
		el("wz_hc").innerHTML = data_tmp.bosons.hc
		el("wz_hc").className = !isCapacitorsActive() ? "red" : ""
		el("wz_deactive").style.display = !isCapacitorsActive() ? "" : "none"
		for (var [i, d] of Object.entries(this.capacitors)) {
			el("wz_capacitor_div_"+i).style.display = d.unl() ? "" : "none"

			let amts = blSave.wz_capacitors[i]
			el("wz_capacitor_amt_"+i).innerHTML = amts.p + "/" + (amts.p + amts.m)
			el("wz_capacitor_eff_"+i).innerHTML = d.disp(data_tmp.capacitors[i])
		}
	},
}

function isCapacitorsActive() {
	return tmp.funda.lab.bosons.hc > 0
}

function capacitorEff(i, def = 1) {
	return tmp.funda.lab.capacitors[i] || def
}

//Joke
const BL_JOKE = {
	started: _ => ghSave?.lab_real,
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
		$.notify("You found a key! Get 15 Light Emissions and go back to 'Bosonic Lab' tab.")
	},
	unlock() {
		if (!ghSave.lab_real.key) {
			$.notify("???: Ummm... Can you find the key? Hint: Keys save you from wasted clicks! Those keys are disablable at options.")
			return
		}
		if (!LAB.req()) return
		$.notify("April Fools 2023! You will now be redirected to real Bosonic Lab.")

		delete ghSave.lab_real
		LAB.unlock()
		this.updateHTML()
		showBLTab("hypotheses")
	},

	//HTML
	updateHTML() {
		let started = this.started()
		el("bl_header").style.display = started ? "none" : ""
		el("tab_bl").textContent = started && !ghSave.lab_real.signed ? "???" : "Bosonic Lab"
		for (var i = 1; i <= 5; i++) el("bl_portion_"+i).style.display = started ? "" : "none"
		if (!started) return

		el("bl_unl").style.display = ghSave.lab_real.signed ? "" : "none"
		el("bl_unl").className = "qu_upg " + (ghSave.lab_real.key && LAB.req() ? "storebtn" : "unavailablebtn")
	}
}
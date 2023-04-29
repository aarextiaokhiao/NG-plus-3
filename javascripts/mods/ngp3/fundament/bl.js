//Real
const BOSONIC_LAB = LAB = {
	/* CORE */
	//Unlock
	req: _ => PHOTON.totalEmissions() >= 15,
	unlocked: _ => blSave?.unl,
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
		blSave.bosons = blSave.bosons.add(this.prod().mul(dt))
		blSave.best_bosons = blSave.best_bosons.max(blSave.bosons)
	},
	temp() {
		if (!this.unlocked()) return
		let data = tmp.funda.lab || {}
		tmp.funda.lab = data

		if (tmp.funda.lab.bond == undefined) BL_HYPOTHESES.temp()
		WEAK_FORCE.temp()

		data.ms = {}
		for (var [i, d] of Object.entries(this.milestones)) {
			if (d.eff) data.ms[i] = d.eff(blSave.best_bosons)
		}
	},

	/* BOSONS */
	// Goal: 10M Bosons (100/s Boson production + x10 from Milestones)
	prod() {
		return E(0)
		//Bosonic Milestones aren't implemented

		let r = E(bondEff("0;1", 0))
		if (bondEff("1;3") >= 5) r = r.mul(2)
		if (isCapacitorsActive()) r = r.mul(capacitorEff(0))
		if (isCapacitorsActive()) r = r.mul(capacitorEff(1))
		if (isCapacitorsActive() && r.gt(1)) r = r.pow(capacitorEff(2))
		if (hasBLMilestone(12)) r = r.mul(blEff(12))
		if (hasBLMilestone(19)) r = r.mul(blEff(19))
		return r
	},
	milestones: [
		{
			//QOL
			req: E(100),
			desc: "[QOL] Bank ^0.9 of Replicantis on exiting Big Rips."
		}, {
			req: E(200),
			desc: "Replicanti Absorb speeds up Replicantis.",
			eff: b => Math.max((tmp.rep.absorb || 1) / 5, 1),
			effDesc: e => shorten(e) + "x",
		}, {
			req: E(500),
			desc: "Bosons strengthen 1st Tree Upgrade.",
			eff: b => Math.log10(b.max(1).log10() + 10),
			effDesc: e => shorten(e) + "x",
		}, {
			//QOL
			req: E(1e3),
			desc: "[QOL] Preon charge production boosts pilon energy instead."
		}, {
			req: E(1.5e3),
			desc: "Eternities boost Space Shards more.",
		}, {
			req: E(2e3),
			desc: "Replicated Galaxies add Intergalactic outside of Big Rips.",
			eff: b => getTotalRG(),
			effDesc: e => "+" + shortenDimensions(e)
		}, {
			req: E(5e3),
			desc: "Galaxy strength boosts Intergalactic outside of Big Rips.",
			eff: b => Math.pow(Math.max(tmp.gal.str / 20, 1), 0.6),
			effDesc: e => shorten(e) + "x"
		}, {
			//QOL
			req: E(1e4),
			desc: "[QOL] Net Quarks give more Automator Potency."
		}, {
			req: E(1.5e4),
			desc: "Replicanti efficiency boosts Time Dimensions more."
		}, {
			req: E(2e4),
			desc: "Per-bought Time Dimensions works in Big Rip, but reduced."
		}, {
			req: E(5e4),
			desc: "Bosonic Matter multiplies Neutrino multiplier base.",
			eff: b => Math.log10(b.max(1).log10() + 10),
			effDesc: e => shorten(e) + "x"
		}, {
			//QOL
			req: E(1e5),
			desc: "[QOL] Replicantis are faster up to the point based on Replicate Slowdown.",
			eff: b => pow10((tmp.rep.speeds?.exp || 1) * 2e3),
			effDesc: e => "Up to " + shortenDimensions(e)
		}, {
			req: E(1.5e5),
			desc: "Elementary Particles boost Bosonic Matter.",
			eff: b => ghSave.ghostParticles.max(1).log10() / 50 + 1,
			effDesc: e => shorten(e) + "x"
		}, {
			req: E(2e5),
			desc: "Replicantis boost Emperor Dimensions.",
			eff: b => pow10(Math.pow(tmp.rep.eff.log10(), 3/4) / 2e4),
			effDesc: e => shorten(e) + "x"
		}, {
			req: E(5e5),
			desc: "Bosonic Matter strengthens Radioactive Decays boost to Tree Upgrades.",
			eff: b => Math.min(Math.log10(b.max(1).log10() + 1) + 1, 2.5),
			effDesc: e => shorten(e) + "x"
		}, {
			//QOL
			req: E(1e6),
			desc: "[QOL] Bosonic Matter adds Automator Potency.",
			eff: b => Math.log2(b.max(1).log10() + 1),
			effDesc: e => "+" + shorten(e)
		}, {
			req: E(1.5e6),
			desc: "Scaling Remote Galaxies later also scales Distant Galaxies.",
			eff: b => getRemoteScalingStart() / 100,
			effDesc: e => "+" + shortenDimensions(e),
		}, {
			req: E(2e6),
			desc: "Galaxy strength raises galaxy bonus to replicantis.",
			eff: b => Math.max(tmp.gal.str / 3, 1),
			effDesc: e => "^" + shorten(e)
		}, {
			req: E(5e6),
			desc: "Bosonic Matter boosts Photons.",
			eff: b => b.max(1).log10() + 1,
			effDesc: e => shorten(e) + "x",
		}, {
			req: E(1e7),
			desc: "Enlightenments boost Bosonic Matter.",
			eff: b => ghSave.photons.lighten / 2 + 1,
			effDesc: e => shorten(e) + "x"
		}
	],

	/* HTML */
	setupTab() {
		BL_HYPOTHESES.setupTab()
		WEAK_FORCE.setupTab()

		let html = ""
		for (var [i, d] of Object.entries(this.milestones)) {
			html += `<td id='bl_milestone_div_${i}'>
				<h2 id='bl_milestone_req_${i}'></h2>
				<button class="milestonerewardlocked" id='bl_milestone_${i}'>
					${d.desc}
					${d.effDesc ? `<hr style='margin: 3px'>Currently: <span id='bl_milestone_eff_${i}'></span>` : ""}
				</button>
			</td>`
			if (i % 3 == 2) html += "</tr><tr>"
		}
		el("bl_milestone_table").innerHTML = "<tr>" + html + "</tr>"
	},
	update() {
		el("bl_amt").textContent = shorten(blSave.bosons)
		el("bl_best").textContent = "" //"(" + shorten(blSave.best_bosons) + " best)"
		el("bl_prod").textContent = shorten(this.prod()) + "/s"

		if (isTabShown("hypotheses")) BL_HYPOTHESES.update()
		if (isTabShown("weak_force")) WEAK_FORCE.update()
		if (isTabShown("bl_milestones")) {
			for (var [i, d] of Object.entries(this.milestones)) {
				let unl = !d.unl || d.unl()
				el("bl_milestone_div_"+i).style.display = unl ? "" : "none"
				if (!unl) continue

				el("bl_milestone_"+i).className = (hasBLMilestone(i) ? "milestonereward" : "milestonerewardlocked") + " bl"
				el("bl_milestone_req_"+i).innerHTML = shiftDown ? "#" + (parseInt(i) + 1) : shortenDimensions(d.req) + " bM"
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

		tmp.funda.lab.bond_eff = {}
		for (let [i, a] of Object.entries(tmp.funda.lab.bond)) tmp.funda.lab.bond_eff[i] = this.bond_eff[i].eff(a)
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
			unl: _ => blSave.best_bosons.gte(1e3),
		}
	],

	/* FIELD */
	clear() {
		blSave.hypo_field = {}
		BL_HYPOTHESES.temp()
	},
	exportField() {
		let str = ""
		for (var [i, d] of Object.entries(blSave.hypo_field)) str+=","+i+";"+d
		exportData("[FIELD" + str + "]")
	},
	importField(str) {
		if (!str) str = prompt("Insert your preset here. Your field will be overwritten on import!")
		if (str.slice(0,6) == "[FIELD" && str[str.length - 1] == "]") {
			let list = str.slice(6, str.length - 1).split(",").slice(1)
			let newField = {}

			while (list.length) {
				let entry = list.pop().split(";")
				let check = entry.length == 3
				if (!check) {
					$.notify("[X] Invalid hypothesis format!")
					continue
				}

				check = (entry[0] >= 0 && entry[0] < 5) &&
					(entry[1] >= 0 && entry[1] < 5)
				if (!check) {
					$.notify("[X] Invalid hypothesis position!")
					continue
				}

				let unl = BL_HYPOTHESES.hypo_types[entry[2]]?.unl
				check = unl && unl()

				if (!check) {
					$.notify("[X] Invalid hypothesis kind! It might be invalid or locked!")
					continue
				}

				newField[entry[0]+";"+entry[1]] = entry[2]
			}
			blSave.hypo_field = newField
			BL_HYPOTHESES.temp()
		} else {
			$.notify("[X] Invalid preset type!")
		}
	},

	place(x) {
		if (blSave.hypo_field[x] === BL_HYPOTHESES.hypo_chosen) delete blSave.hypo_field[x]
		else blSave.hypo_field[x] = BL_HYPOTHESES.hypo_chosen
		BL_HYPOTHESES.temp()
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
			eff: x => x/40,
			disp: e => `Generate <b>${shorten(e)}/s</b> Bosonic Matter.`,
		},
		["0;2"]: {
			eff: x => Math.floor(x/5),
			disp: e => `Add W Bosons by <b>+${e}</b>`,
		},
		["1;2"]: {
			eff: x => Math.floor(x/10),
			disp: e => `Add Z0 Bosons by <b>+${e}</b>`,
		},
		["0;3"]: {
			eff: x => Math.cbrt(x/4+1),
			disp: e => `Strengthen W-Z Capacitors by <b>${shorten(e)}x</b>`,
		},
		["1;3"]: {
			eff: x => x,
			disp: e => `At 3 levels, double Bosonic Matter. <b>(${e}/3)</b>`,
		},
		["2;3"]: {
			eff: x => x,
			disp: e => `At 5 levels, double Z0 Bosons. <b>(${e}/5)</b>`,
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

function bondEff(i, def = 1) {
	return tmp.funda?.lab?.bond_eff?.[i] || def
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
		let str = bondEff("0;3")
		tmp.funda.lab.capacitors = eff
		for (var [i, d] of Object.entries(this.capacitors)) eff[i] = d.eff(blSave.wz_capacitors[i].p * str)
	},

	/* BOSONS */
	amt: {
		w() {
			let r = bondEff("0;2", 0)
			return r
		},
		z() {
			let r = bondEff("1;2", 0)
			if (bondEff("2;3") >= 5) r *= 2
			return r
		}
	},

	/* CAPACIATORS */
	capacitors: [
		{
			eff: x => Math.sqrt(x + 1),
			disp: e => `Boost Bosonic Matter by <b>${shorten(e)}x</b>.`,
			unl: _ => true,
		}, {
			eff: x => blSave.bosons.add(1).log10() * Math.sqrt(x) + 1,
			disp: e => `Bosonic Matter synergizes itself by <b>${shorten(e)}x</b>.`,
			unl: _ => true,
		}, {
			eff: x => Math.sqrt(x + 1),
			disp: e => `Raise Bosonic Matter by <b>^${shorten(e)}</b> before milestones.`,
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
		if (type == "plus" && tmp.funda.lab.bosons.w >= 1 && data[i].p + data[i].m < 5) data[i].p++
		if (type == "minus" && tmp.funda.lab.bosons.w >= 1 && data[i].p + data[i].m < 5) data[i].m++
		if (type == "putout") {
			data[i].p = Math.max(data[i].p - 1, 0)
			data[i].m = Math.max(data[i].m - 1, 0)
		}
		if (type == "clear") data[i] = {p: 0, m: 0}
	},

	/* HTML */
	setupTab() {
		let html = ""
		for (var i in this.capacitors) html += `<td id='wz_capacitor_div_${i}' style='text-align: center; width: 200px'>
			<div class='wz_capacitor'>
				<button class='can plus' id='wz_capacitor_plus_${i}' onclick='WEAK_FORCE.put(${i}, "plus")'></button>
				<button class='can minus' id='wz_capacitor_minus_${i}' onclick='WEAK_FORCE.put(${i}, "minus")'></button>
			</div>
			<span id='wz_capacitor_eff_${i}'></span><br><br>

			<button class='storebtn' onclick='WEAK_FORCE.put(${i}, "putout")'>Putout</button><br>
		</td>`
		//<button class='storebtn' onclick='WEAK_FORCE.put(${i}, "clear")'>Clear</button>
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
			if (!d.unl()) return

			let amts = blSave.wz_capacitors[i]
			let maxed = amts.p + amts.m >= 5
			el("wz_capacitor_plus_"+i).className = "plus " + (maxed ? "unavailablebtn" : "can")
			el("wz_capacitor_plus_"+i).innerHTML = amts.p + "+"
			el("wz_capacitor_minus_"+i).className = "minus " + (maxed ? "unavailablebtn" : "can")
			el("wz_capacitor_minus_"+i).innerHTML = amts.m + "-"

			el("wz_capacitor_eff_"+i).innerHTML = d.disp(data_tmp.capacitors[i])
		}
	},
}

function isCapacitorsActive() {
	return tmp.funda.lab.bosons?.hc > 0
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
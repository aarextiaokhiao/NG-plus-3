//Real
const BOSONIC_LAB = LAB = {
	/* CORE */
	//Unlock
	req: _ => tmp.funda.photon?.unls >= 8,
	unlocked: _ => blSave?.unl,
	unlock() {
		blSave.unl = true
		notifyFeature("bl")
	},

	//Calculation
	setup() {
		return {
			bosons: E(0),
			best_bosons: E(0),

			hypo_field: {},
			wz_capacitors: WEAK_FORCE.setup()
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

		if (data.bond == undefined) BL_HYPOTHESES.temp()
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

		let r = E(bondEff("0;1", 0))
		if (bondEff("0;3") >= 2) r = r.mul(2)
		if (isCapacitorsActive()) r = r.mul(capacitorEff(0))
		if (isCapacitorsActive()) r = r.mul(capacitorEff(1))
		if (hasBLMilestone(12)) r = r.mul(blEff(12))
		if (hasBLMilestone(19)) r = r.mul(blEff(19))
		if (HIGGS.unlocked()) r = r.mul(hbEff(0))
		return r
	},
	milestones: [
		{
			//QOL
			req: E(100),
			desc: "[QOL] Bank Replicantis upon exiting Big Rips."
		}, {
			req: E(200),
			desc: "Replicanti Absorb speeds up Replicanti.",
			eff: b => Math.max((tmp.rep.warp || 1) / 5, 1),
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
			desc: "Eternities boost Space Shards.",
			eff: b => E(getEternitied()).add(1).pow(.1),
			effDesc: e => shorten(e) + "x",
		}, {
			req: E(2e3),
			desc: "Replicated Galaxies count in Intergalactic's formula outside of Big Rips.",
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
			desc: "Replicanti efficiency boosts Time Dimensions further."
		}, {
			req: E(2e4),
			desc: "The Time Dimensions multiplier per-purchase works in Big Rip, but is reduced."
		}, {
			req: E(5e4),
			desc: "Bosonic Matter multiplies Neutrino multiplier base.",
			eff: b => Math.log10(b.max(10).log10()),
			effDesc: e => "+" + shorten(e) + "x"
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
			desc: "Scaling Remote Galaxies also scales Distant Galaxies.",
			eff: b => getRemoteScalingStart() / 100,
			effDesc: e => "+" + shortenDimensions(e),
		}, {
			req: E(2e6),
			desc: "Galaxy strength raises Time Study 102.",
			eff: b => Math.max(tmp.gal.str / 3, 1),
			effDesc: e => "^" + shorten(e)
		}, {
			req: E(5e6),
			desc: "Bosonic Matter boosts Photons.",
			eff: b => b.max(1).log10() + 1,
			effDesc: e => shorten(e) + "x",
		}, {
			req: E(1e7),
			desc: "??? boosts Bosonic Matter.",
			eff: b => E(1),
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
		el("bl_prod").textContent = shorten(this.prod()) + "/s"

		for (var [i, d] of Object.entries(this.milestones)) {
			let unl = !d.unl || d.unl()
			el("bl_milestone_div_"+i).style.display = unl ? "" : "none"
			if (!unl) continue

			el("bl_milestone_"+i).className = (hasBLMilestone(i) ? "milestonereward" : "milestonerewardlocked") + " bl"
			el("bl_milestone_req_"+i).innerHTML = shiftDown ? "#" + (parseInt(i) + 1) : shortenDimensions(d.req) + " bM"
			if (d.effDesc) el("bl_milestone_eff_"+i).innerHTML = d.effDesc(tmp.funda.lab.ms[i])
		}
	},
	updateReq() {
		el("bl_req").style.display = PHOTON.unlocked() && !LAB.unlocked() && !BL_JOKE.started() ? "" : "none"
	}
}

function hasBLMilestone(i) {
	if (!LAB.unlocked()) return
	return blSave.best_bosons.gte(LAB.milestones[i].req)
}

function blEff(i, def) {
	return tmp.funda.lab?.ms[i] || def
}

TABS = Object.assign(TABS, {
	bl: { name: "Bosonic Lab", class: "bosonic_btn", stab: [ "bl_hy", "bl_wf", "hb", "mil_bl", "bl_real" ], unl: _ => LAB.unlocked() || BL_JOKE.started() },
	bl_hy: { name: "Hypotheses", update: _ => BL_HYPOTHESES.update(), unl: _ => LAB.unlocked() },
	bl_wf: { name: "Weak Force", update: _ => WEAK_FORCE.update(), unl: _ => LAB.unlocked() },
	mil_bl: { name: "Milestones", update: _ => LAB.update(), unl: _ => LAB.unlocked() },
	hb: { name: "Higgs", update: _ => HIGGS.updateTab(), unl: _ => LAB.unlocked() },
	bl_real: { unl: _ => BL_JOKE.started() }
})

//Subfeatures
const BL_HYPOTHESES = {
	/* CALCULATION */
	temp() {
		tmp.funda.lab.stable = 0
		tmp.funda.lab.stable_max = 6
		if (isCapacitorsActive()) tmp.funda.lab.stable_max += capacitorEff(2, 0)

		tmp.funda.lab.bond = {}
		for (let i of Object.keys(blSave.hypo_field)) {
			let x = parseInt(i.split(";")[1])
			let y = parseInt(i.split(";")[0])
			this.checkBond(y+";"+x, y+";"+(x+1))
			this.checkBond(y+";"+x, (y+1)+";"+x)
		}

		tmp.funda.lab.bonds = {}
		if (tmp.funda.lab.stable > tmp.funda.lab.stable_max) return
		for (let [i, a] of Object.entries(tmp.funda.lab.bond)) tmp.funda.lab.bonds[i] = this.bonds[i].eff(a)
	},

	/* HYPOTHESES */
	data: [
		{
			name: "Infinity",
			power: 0,
			sym: "∞",
			unl: _ => true,
		}, {
			name: "Eternal",
			power: 1,
			sym: "Δ",
			unl: _ => true,
		}, {
			name: "Quantum",
			power: 1,
			sym: "Π",
			unl: _ => true,
		}, {
			name: "Spectral",
			power: 2,
			sym: "φ",
			unl: _ => blSave.best_bosons.gte(1e3),
		}, {
			name: "Fundament",
			power: 2,
			sym: "?",
			unl: _ => false,
		}
	],

	/* FIELD */
	clear() {
		blSave.hypo_field = {}
		BL_HYPOTHESES.temp()
	},
	export: _ => exportData(PRESET_DATA.bl.get()),
	import: _ => PRESET_DATA.bl.load(prompt("Insert your preset here. Your field will be overwritten on import!")),
	choose(x) {
		BL_HYPOTHESES.hypo_chosen = x
	},
	place(x) {
		if (blSave.hypo_field[x] === BL_HYPOTHESES.hypo_chosen) delete blSave.hypo_field[x]
		else blSave.hypo_field[x] = BL_HYPOTHESES.hypo_chosen
		BL_HYPOTHESES.temp()
	},

	/* BONDS */
	checkBond(a, b) {
		let field = blSave.hypo_field
		if (field[a] === undefined) return
		if (field[b] === undefined) return
		if (field[a] == field[b]) return

		let id = Math.min(field[a], field[b]) + ";" + Math.max(field[b], field[a])
		tmp.funda.lab.bond[id] = (tmp.funda.lab.bond[id] || 0) + 1
		tmp.funda.lab.stable += this.data[field[a]].power + this.data[field[b]].power
	},
	bonds: {
		["0;1"]: {
			eff: x => pow10(x/10).sub(1).div(10),
			disp: e => `Generate <b>${shorten(e)}/s</b> Bosonic Matter.`,
		},
		["0;2"]: {
			eff: x => Math.floor(x),
			disp: e => `Add W Bosons by <b>+${e}</b>`,
		},
		["1;2"]: {
			eff: x => Math.floor(x/2),
			disp: e => `Add Z0 Bosons by <b>+${e}</b>`,
		},
		["0;3"]: {
			eff: x => x,
			disp: e => `On 2 bonds, double Bosonic Matter. <b>(${e}/2)</b>`,
		},
		["1;3"]: {
			eff: x => x,
			disp: e => `On 2 bonds, double W Bosons. <b>(${e}/2)</b>`,
		},
		["2;3"]: {
			eff: x => x,
			disp: e => `On 2 bonds, double Z0 Bosons. <b>(${e}/2)</b>`,
		},
		["0;4"]: {
			eff: x => x,
			disp: e => `Placeholder.`,
		},
		["1;4"]: {
			eff: x => x,
			disp: e => `Placeholder.`,
		},
		["2;4"]: {
			eff: x => x,
			disp: e => `Placeholder.`,
		},
		["3;4"]: {
			eff: x => x,
			disp: e => `Placeholder.`,
		}
	},

	/* HTML */
	setupTab() {
		let choices = ""
		for (let [i, h] of Object.entries(this.data)) choices += `<button class='hypo_btn' id='hypo_choice_${i}' ach-tooltip="${h.name}" onclick="BL_HYPOTHESES.choose(${i})"><span class="hypo hypo${i}">${h.sym}</span></button>`
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
		for (let i = 0; i < this.data.length; i++) {
			el("hypo_choice_" + i).className = "hypo_btn " + (this.hypo_chosen == i ? "chosen" : "")
			el("hypo_choice_" + i).style.display = this.data[i].unl() ? "" : "none"
		}

		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				let id = y+";"+x
				let type = blSave.hypo_field[id]
				el('hypo_'+id).className = type !== undefined ? "hypo hypo" + type : "hypo"
				el('hypo_'+id).textContent = type !== undefined ? this.data[type].sym : ""
			}
		}
		el('hypo_stable').textContent = getFullExpansion(tmp.funda.lab.stable) + " / " + getFullExpansion(tmp.funda.lab.stable_max)
		el('hypo_stable').className = tmp.funda.lab.stable > tmp.funda.lab.stable_max ? "red" : ""

		let bonds = ""
		let shown = Object.keys(tmp.funda.lab.bonds)
		if (shiftDown) {
			let unlocked = []
			for (var [i, d] of Object.entries(this.data)) {
				if (!d.unl()) continue
				for (var j of unlocked) {
					if (shown.includes(j+";"+i)) continue
					shown.push(j+";"+i)
				}
				unlocked.push(i)
			}
		}
		for (let i of shown) {
			let split = i.split(";")
			let has = tmp.funda.lab.bonds[i] !== undefined
			let eff = tmp.funda.lab.bonds[i] ?? this.bonds[i].eff(0)
			bonds += `<span class="hypo hypo${split[0]}"></span><span class="hypo hypo${split[1]}"></span> <span ${has ? '' : 'style="opacity: 0.2"'}>${this.bonds[i].disp(eff)}</span><br>`
		}
		el("hypo_bonds").innerHTML = bonds
	},
}

PRESET_DATA.bl = {
	name: "Hypotheses",
	in: _ => isTabShown("bl_hy"),
	unl: _ => LAB.unlocked(),

	get() {
		let str = ""
		for (var [i, d] of Object.entries(blSave.hypo_field)) str+=","+i+";"+d
		return "[FIELD" + str + "]"
	},

	options: [],
	load(str, options) {
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

				let unl = BL_HYPOTHESES.data[entry[2]]?.unl
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
	}
}

function bondEff(i, def = 1) {
	return tmp.funda.lab?.bonds[i] ?? def
}

/* WZ CAPACITORS */
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
		amt.max = 0
		amt.hc = amt.z
		for (var [i, d] of Object.entries(blSave.wz_capacitors)) {
			amt.w -= d.p + d.m
			amt.hc += d.m - d.p
			if (d.p == 5 && d.m == 0 && amt.max == i) amt.max++
		}

		let eff = {}
		let str = bondEff("0;3")
		tmp.funda.lab.capacitors = eff
		for (var [i, d] of Object.entries(this.capacitors)) {
			if (i > amt.max + 1) return
			eff[i] = d.eff(blSave.wz_capacitors[i].p * str)
		}
	},

	/* BOSONS */
	amt: {
		w() {
			let r = bondEff("0;2", 0)
			if (bondEff("1;3") >= 2) r *= 2
			return r
		},
		z() {
			let r = bondEff("1;2", 0)
			if (bondEff("2;3") >= 2) r *= 2
			return r
		}
	},

	/* CAPACIATORS */
	capacitors: [
		{
			eff: x => Math.sqrt(x + 1),
			disp: e => `Boost Bosonic Matter by <b>${shorten(e)}x</b>.`
		}, {
			eff: x => blSave.bosons.add(1).log10() * Math.sqrt(x) + 1,
			disp: e => `Bosonic Matter synergizes itself by <b>${shorten(e)}x</b>.`
		}, {
			eff: x => x,
			disp: e => `Add Stability by <b>+${e}</b>.`
		}
	],
	put(i, type) {
		let data = blSave.wz_capacitors
		if (type == "putout") {
			data[i].p = Math.max(data[i].p - 1, 0)
			data[i].m = Math.max(data[i].m - 1, 0)
		}
		if (data[i].p + data[i].m >= 5) return
		if (type == "plus" && tmp.funda.lab.bosons.w >= 1) data[i].p++
		if (type == "minus" && tmp.funda.lab.bosons.w >= 1) data[i].m++
	},

	/* HTML */
	setupTab() {
		let html = ""
		for (var i in this.capacitors) html += `<td id='wz_capacitor_div_${i}' style='text-align: center; vertical-align: 0; width: 200px; display: none'>
			<div class='wz_capacitor'>
				<button class='can plus' id='wz_capacitor_plus_${i}' onclick='WEAK_FORCE.put(${i}, "plus")'></button>
				<button class='can minus' id='wz_capacitor_minus_${i}' onclick='WEAK_FORCE.put(${i}, "minus")'></button>
			</div>
			<button class='storebtn' onclick='WEAK_FORCE.put(${i}, "putout")'>Weaken</button><br><br>
			<span id='wz_capacitor_eff_${i}'></span>
		</td>`
		el("wz_capacitors").innerHTML = html
	},
	update() {
		let data_tmp = tmp.funda.lab.bosons
		el("wz_w").innerHTML = data_tmp.w
		el("wz_z").innerHTML = data_tmp.z
		el("wz_hc").innerHTML = data_tmp.hc
		el("wz_hc").className = !isCapacitorsActive() ? "red" : ""
		el("wz_deactive").style.display = !isCapacitorsActive() ? "" : "none"

		for (let [i, d] of Object.entries(this.capacitors)) {
			let unl = data_tmp.max + 1 >= i
			el("wz_capacitor_div_"+i).style.display = unl ? "" : "none"
			if (!unl) continue

			let amts = blSave.wz_capacitors[i]
			let maxed = amts.p + amts.m >= 5
			el("wz_capacitor_plus_"+i).className = "plus " + (maxed ? "unavailablebtn" : "can")
			el("wz_capacitor_plus_"+i).innerHTML = amts.p + "+"
			el("wz_capacitor_minus_"+i).className = "minus " + (maxed ? "unavailablebtn" : "can")
			el("wz_capacitor_minus_"+i).innerHTML = amts.m + "-"

			el("wz_capacitor_eff_"+i).innerHTML = d.disp(tmp.funda.lab.capacitors[i])
		}
	},
}

function isCapacitorsActive() {
	return tmp.funda.lab.bosons?.hc >= 0
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
			$.notify("???: Ummm... Can you find the key? Hint: Hotkeys save you.")
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
		if (el("tab_btn_bl")) el("tab_btn_bl").textContent = started && !ghSave.lab_real.signed ? "???" : "Bosonic Lab"

		for (var i = 1; i <= 5; i++) el("bl_portion_"+i).style.display = started ? "" : "none"
		if (!started) return

		el("bl_unl").style.display = ghSave.lab_real.signed ? "" : "none"
		el("bl_unl").className = "qu_upg " + (ghSave.lab_real.key && LAB.req() ? "storebtn" : "unavailablebtn")
	}
}
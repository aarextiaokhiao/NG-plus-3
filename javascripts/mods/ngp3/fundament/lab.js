function hasWZMilestone(type, i) {
	return tmp.funda.wz !== undefined && tmp.funda.wz.mil[type] > i
}

function wzEff(type, i) {
	return tmp.funda.wz.eff[type][i]
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
			bosons: E(0),
			best_bosons: E(0),
			hypo_field: {}
		}
	},

	/* CALCULATION */
	calc(dt) {
		blSave.bosons = blSave.bosons.add(this.prod().mul(dt))
		blSave.best_bosons = blSave.best_bosons.max(blSave.bosons)
	},
	temp() {
		if (!this.unlocked()) return

		let data = tmp.funda.wz || {}
		tmp.funda.wz = data

		if (data.lim == undefined) WZ_FIELD.recalc()

		tmp.funda.wz.eff = {}
		for (let i in tmp.funda.wz.mil) {
			tmp.funda.wz.eff[i] = []
			for (let j = 0; j < tmp.funda.wz.mil[i]; j++) {
				tmp.funda.wz.eff[i][j] = this.milestones[i][j].eff()
			}
		}
	},
	recalc() {
		let data = tmp.funda.wz
		data.lim = [], data.str = [], data.amt = []
		for (let [i, j] of Object.entries(this.data)) {
			data.lim[i] = j.lim ? j.lim() : 1/0
			data.str[i] = 0
			data.amt[i] = 0
		}

		for (let [i, j] of Object.entries(blSave.hypo_field)) {
			if (j < 2) {
				let add = j ? -1 : 1
				let [x, y] = [parseInt(i.split(";")[0]), parseInt(i.split(";")[1])]
				this.addStr(x-1, y, add)
				this.addStr(x+1, y, add)
				this.addStr(x, y-1, add)
				this.addStr(x, y+1, add)
			}
			data.amt[j]++
		}

		data.ch = { pos: 0, neg: 0 }
		for (let [i, j] of Object.entries(this.data)) {
			if (data.str[i] > 0) data.ch.pos += data.amt[i] * data.str[i] * j.mult
			if (data.str[i] < 0) data.ch.neg -= data.amt[i] * data.str[i] * j.mult
		}

		data.mil = {}
		for (let i in this.milestones) {
			data.mil[i] = 0
			for (let j of this.milestones[i]) {
				if (data.ch[i] < j.req) break
				data.mil[i]++
			}
		}
	},
	addStr(x, y, add) {
		let j = blSave.hypo_field[x+";"+y]
		if (j > 1) tmp.funda.wz.str[j] += add
	},

	/* BOSONS */
	prod() {
		let r = E(0)
		if (hasWZMilestone(12)) r = r.mul(blEff(12))
		if (hasWZMilestone(19)) r = r.mul(blEff(19))
		if (HIGGS.unlocked()) r = r.mul(hbEff(0))
		return r
	},

	/* HYPOTHESES */
	data: [
		{
			name: "W+ Generator",
			sym: "+",
			unl: _ => true,
			lim: _ => 1,
		}, {
			name: "W- Generator",
			sym: "-",
			unl: _ => true,
			lim: _ => 1,
		}, {
			name: "Infinity",
			sym: "∞",
			mult: .25,
			unl: _ => true,
			lim: _ => 5,
		}, {
			name: "Eternal",
			sym: "Δ",
			mult: 1,
			unl: _ => true,
			lim: _ => 3,
		}, {
			name: "Quantum",
			sym: "Π",
			unl: _ => false,
		}, {
			name: "Spectral",
			sym: "φ",
			unl: _ => false,
		}, {
			name: "Fundament",
			sym: "?",
			unl: _ => false,
		}
	],
	milestones: {
		pos: [
			{ req: 1, eff: _ => 1, desc: _ => "Testing..." }
		],
		neg: [
			{ req: 1, eff: _ => 1, desc: _ => "Testing..." }
		]
	},

	/* FIELD */
	clear() {
		blSave.hypo_field = {}
		WZ_FIELD.recalc()
	},
	export: _ => exportData(PRESET_DATA.bl.get()),
	import: _ => PRESET_DATA.bl.load(prompt("Insert your preset here. Your field will be overwritten on import!")),
	choose(x) {
		WZ_FIELD.hypo_chosen = x
	},
	place(x) {
		let i = WZ_FIELD.hypo_chosen
		if (blSave.hypo_field[x] === i) delete blSave.hypo_field[x]
		else if (tmp.funda.wz.lim[i] > tmp.funda.wz.amt[i]) blSave.hypo_field[x] = i
		WZ_FIELD.recalc()
	},

	/* HTML */
	setupTab() {
		let choices = ""
		for (let [i, h] of Object.entries(this.data)) choices += `<button class='hypo_btn' id='hypo_choice_${i}'  onclick="WZ_FIELD.choose(${i})"><span class="hypo hypo${i}">${h.sym}</span></button>`
		el("hypo_choice").innerHTML = choices

		let field = "<tr>"
		for (let x = 0; x < 7; x++) {
			for (let y = 0; y < 7; y++) {
				field += `<td><button class='hypo_btn' onclick='WZ_FIELD.place("${y};${x}")'><span class="hypo" id="hypo_${y};${x}"></span></button></td>`
			}
			field += "</tr><tr>"
		}
		el("hypo_field").innerHTML = field
	},
	updateTab() {
		el("wz_req").style.display = !WZ_FIELD.unlocked() ? "" : "none"
		el("wz_div").style.display = WZ_FIELD.unlocked() ? "" : "none"
		if (!WZ_FIELD.unlocked()) {
			el("wz_req").innerHTML = `Reach Ultraviolet Light and ${shorten(1e38)} Spectral Particles to unlock W & Z Field.`
			return
		}

		el("bl_amt").textContent = shorten(blSave.bosons)
		el("bl_prod").textContent = shorten(this.prod()) + "/s"

		for (let [i, j] of Object.entries(this.data)) {
			let msg = `${getFullExpansion(tmp.funda.wz.amt[i])} / ${getFullExpansion(tmp.funda.wz.lim[i])} placed`
			if (i >= 2) msg += `, per charger: ${Math.abs(j.mult * tmp.funda.wz.str[i]).toFixed(2)} ${tmp.funda.wz.str[i] < 0 ? "Negative" : "Positive"} Hypercharge (${tmp.funda.wz.str[i].toFixed(2)}x)`
			msg = `${j.name} (${msg})`

			el("hypo_choice_" + i).className = "hypo_btn " + (this.hypo_chosen == i ? "chosen" : "")
			el("hypo_choice_" + i).style.display = j.unl() ? "" : "none"
			el("hypo_choice_" + i).setAttribute("ach-tooltip", msg)
		}

		el("wz_pos").textContent = shorten(tmp.funda.wz.ch.pos)
		el("wz_neg").textContent = shorten(tmp.funda.wz.ch.neg)

		for (let x = 0; x < 7; x++) {
			for (let y = 0; y < 7; y++) {
				let id = y+";"+x
				let type = blSave.hypo_field[id]
				el('hypo_'+id).className = type !== undefined ? "hypo hypo" + type : "hypo"
				el('hypo_'+id).textContent = type !== undefined ? this.data[type].sym : ""
			}
		}

		let msg = ""
		for (let i in tmp.funda.wz.eff) {
			for (let [i2, j] of Object.entries(tmp.funda.wz.eff[i])) msg += shorten(this.milestones[i][i2].req) + (i == "pos" ? " Positive" : " Negative") + " Hypercharge: " + this.milestones[i][i2].desc(j) + "<br>"
		}
		el("wz_eff").innerHTML = msg
	},
}

PRESET_DATA.bl = {
	name: "W & Z Field",
	in: _ => isTabShown("wz"),
	unl: _ => WZ_FIELD.unlocked(),

	get() {
		let str = ""
		for (var [i, d] of Object.entries(blSave.hypo_field)) str+=","+i+";"+d
		return "[FIELD" + str + "]"
	},

	options: [],
	load(str, options) {
		if (str.slice(0,6) == "[FIELD" && str[str.length - 1] == "]") {
			let list = str.slice(6, str.length - 1).split(",").slice(1)
			let newField = {}, amts = [0,0,0,0,0,0,0,0,0,0]

			while (list.length) {
				let entry = list.pop().split(";")
				let check = entry.length == 3
				if (!check) {
					$.notify("[X] Invalid: Unknown cause")
					continue
				}

				check = (entry[0] >= 0 && entry[0] < 7) &&
					(entry[1] >= 0 && entry[1] < 7)
				if (!check) {
					$.notify("[X] Invalid: Wrong position")
					continue
				}

				let unl = WZ_FIELD.data[entry[2]]?.unl
				check = unl && unl()

				if (!check) {
					$.notify("[X] Invalid: Kind might be invalid or locked!")
					continue
				}

				check = tmp.funda.wz.lim[entry[2]] >= amts[entry[2]]
				if (!check) {
					$.notify("[X] Invalid: Amount Overflow")
					continue
				}

				newField[entry[0]+";"+entry[1]] = entry[2]
				amts[entry[2]]++
			}
			blSave.hypo_field = newField
			WZ_FIELD.temp()
		} else {
			$.notify("[X] Invalid preset type!")
		}
	}
}
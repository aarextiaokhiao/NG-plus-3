let HIGGS = {
	setupSave() {
		return {
			amt: 0,
			mass: E(0),
			field: [
				[1, 2, 3, 4, "c1"],
				[5, 6, 7, 8, "c2"],
				[9, 10, 11, 12, "c3"]
			]
		}
	},
	unlocked: _ => ghSave.hb?.amt > 0,

	//Calculation
	calc(dt) {
		ghSave.hb.mass = this.mass.gain().mul(dt).add(ghSave.hb.mass)
	},
	temp() {
		if (!this.unlocked()) return
		let t = {}
		tmp.funda.hm_eff = t

		let hm = this.mass
		for (var [ri, rb] of Object.entries(ghSave.hb.field)) {
			for (var b of rb) {
				if (this.mass.unl(b) && b[0] != "c") t[b] = hm.data[b].eff(hm.eff_row(ri))
			}
		}
	},

	//Prestige
	pres: {
		req: i => E(100).pow(i + 8),
		bulk: bm => Math.floor(E(bm).log(100) - 7),
		reset(force) {
			let bulk = this.bulk(blSave.best_bosons)
			if (!force && ghSave.hb.amt >= bulk) return

			if (ghSave.hb.amt == 0) ngp3_feature_notify("hb")
			ghSave.hb.amt = Math.max(ghSave.hb.amt, bulk)
			ghSave.hb.mass = E(0)
			blSave.bosons = E(0)
			blSave.wz_capacitors = WEAK_FORCE.setup()
		}
	},

	//Mass
	mass: {
		gain: _ => E(1),

		charged: i => ghSave.hb.field.map(x => x[0] == "c").includes(true),
		eff_boost: (i, def) => tmp.funda?.hm_eff?.[i] ?? def,
		eff_row: i => ghSave.hb.mass.div(3 ** i * 100).log10() + (HIGGS.mass.charged(i) ? 1 : 0),
		unl: i => ghSave.hb.amt >= HIGGS.mass.data[i].req,

		click(i, x) {
			if (this.toSwap) {
				let val_1 = ghSave.hb.field[i][x]
				let val_2 = ghSave.hb.field[this.toSwap[0]][this.toSwap[1]]
				if (val_1 != val_2 && this.toSwap[0] != i) {
					if (!confirm("Swapping will force a Higgs reset!")) return
					HIGGS.pres.reset(true)
				}

				ghSave.hb.field[i][x] = val_2
				ghSave.hb.field[this.toSwap[0]][this.toSwap[1]] = val_1
				delete this.toSwap
			} else this.toSwap = [i,x]
		},

		data: {
			1: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			2: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			3: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			4: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			5: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			6: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			7: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			8: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			9: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			10: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			11: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},
			12: {
				req: 1,
				eff: e => 1,
				disp: e => "Do something.",
			},

			c1: { req: 999 },
			c2: { req: 999 },
			c3: { req: 999 },
		}
	},

	//DOM
	setupTab() {
		let html = ``
		for (let i = 0; i < 3; i++) {
			let boosts = ``
			for (let j = 0; j < 5; j++) boosts += `<button class="btn" id="hb_btn_${i}_${j}" onclick="HIGGS.mass.click(${i}, ${j})"></button>`
			html += `<div class="hb_boost">
				<div class="id">${i+1}</div>
				<div class="eff" id="hb_eff_${i}"></div>
				<div class="boost">${boosts}</div>
			</div>`
		}
		el("hb_field").innerHTML = html
	},
	updateTab() {
		let hb = ghSave.hb.amt
		el("hb_amt").innerHTML = getFullExpansion(hb)
		el("hb_btn").innerHTML = `
			Reset Bosons for +${getFullExpansion(Math.max(this.pres.bulk() - hb, 0))} Higgs.<br>
			(Req: ${shorten(blSave.best_bosons)} / ${shorten(this.pres.req(hb))} Bosonic Matter)
		`

		el("hb_mass_div").style.display = this.unlocked() ? "" : "none"
		el("hb_field").style.display = this.unlocked() ? "" : "none"
		if (!this.unlocked()) return

		el("hb_mass").textContent = shortenMoney(ghSave.hb.mass)
		for (let i = 0; i < 3; i++) {
			el("hb_eff_"+i).textContent = formatPercentage(this.mass.eff_row[i])
			for (let j = 0; j < 5; j++) {
				let b = ghSave.hb.field[i][j]
				let elm = el(`hb_btn_${i}_${j}`)
				elm.style.display = this.mass.unl(b) ? "" : "none"
				if (!this.mass.unl(b)) continue

				let ch = b[0] == "c"
				elm.innerHTML = ch ? "C" : b
				elm.className = "btn" + (ch ? " charger" : "") + (this.mass.toSwap?.[0] == i && this.mass.toSwap[1] == j ? " chosen" : "")
				elm.setAttribute("ach-tooltip", "Effect: " + (ch ? "+1x to row (can't be stacked)" : this.mass.data[b].disp(tmp.funda.hm_eff[b])))
			}
		}
	},
}
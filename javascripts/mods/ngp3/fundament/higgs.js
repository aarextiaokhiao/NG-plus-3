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
			for (var b of rb) if (b[0] != "c") t[b] = hm.data[b].eff(hm.eff_row(ri))
		}
	},

	//Prestige
	pres: {
		req: i => E(100).pow(i + 8),
		bulk: bm => Math.floor(E(bm).log(100) - 7),
		reset() {
			let bulk = this.bulk(blSave.best_bosons)
			if (ghSave.hb.amt >= bulk) return

			if (ghSave.hb.amt == 0) ngp3_feature_notify("hb")
			ghSave.hb.amt = bulk
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

		click(i, x) {
			if (this.toSwap) {
				let val_1 = ghSave.hb.field[i][x]
				let val_2 = ghSave.hb.field[this.toSwap[0]][this.toSwap[1]]
				ghSave.hb.field[i][x] = val_2
				ghSave.hb.field[this.toSwap[0]][this.toSwap[1]] = val_1
				delete this.toSwap
			}
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
		for (var i = 1; i <= 3; i++) html += `<div class="hb_boost">
			<div class="id">${i}</div>
			<div class="eff">???%</div>
			<div class="boost">
				<button class="btn">${i*4-3}</button>
				<button class="btn">${i*4-2}</button>
				<button class="btn">${i*4-1}</button>
				<button class="btn">${i*4}</button>
				<button class="btn charger">C</button>
			</div>
		</div>`
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
	},
}
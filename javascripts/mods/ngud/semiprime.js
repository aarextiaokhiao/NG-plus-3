//v1
function autoBuyDilUpgs() {
	if (player.autoEterOptions.dilUpgs) {
		var upgs = player.dilation.autoUpgrades
		var old = player.dilation.upgrades.length
		for (var u = 0; u < upgs.length; u++) {
			var upg = upgs[u]
			if (upg > 11) upg = DIL_UPG_OLD_POS_IDS[upg]
			buyDilationUpgrade(upg, true)
		}
		maxAllDilUpgs()
		if (player.dilation.upgrades.length > old) updateDilationUpgradeButtons()
	}
}

function distribEx() {
	let toAdd = player.exdilation.unspent
	for (var i = 1; i <= 4; i++) toAdd = toAdd.add(player.exdilation.spent[i] || 0)

	toAdd = toAdd.div(5)
	player.exdilation.unspent = toAdd
	for (var i = 1; i <= 4; i++) player.exdilation.spent[i] = toAdd
}

//v2: Rebalanced
function hasBlackHoleEff(i) {
	return tmp.bh_eff?.[i] !== undefined
}

function getBlackHoleEff(i, def = 1) {
	return tmp.bh_eff?.[i] || def
}

const BH_UDSP = {
	getSave() {
		let s = {
			hunger: 0,
			weight: {},
			boost: {}
		}
		for (var i in BH_FEED) s.weight[i] = 0
		return s
	},

	//Calculation
	calc(dt) {
		player.blackhole.hunger = Math.max(player.blackhole.hunger - dt, 0)
		for (let [i, b] of Object.entries(BH_FEED)) player.blackhole.upgrades[i] = Math.max(player.blackhole.upgrades[i], E(b.res()).max(1).div(b.cost[0]).log(b.cost[1]) + 1)
		for (let i in player.blackhole.boost) {
			player.blackhole.boost[i] -= dt
			if (player.blackhole.boost[i] <= 0) delete player.blackhole.boost[i]
		}
	},
	temp() {
		if (!mod.udsp || !player.blackhole?.unl) {
			delete tmp.bh_eff
			return
		}
		tmp.bh_eff = {}
		for (let d in player.blackhole.boost) tmp.bh_eff[d] = this.boosts[d].eff(player.blackhole.power)
	},

	//Features
	hunger: {
		cap: _ => 100,
		calc: x => player.blackhole.upgrades[x] * player.blackhole.weight[x] / 100,

		feed() {
			if (player.blackhole.hunger >= this.cap()) return
			for (let [i, b] of Object.entries(BH_UDSP.boosts)) {
				let can = true
				for (let [i2, req] of Object.entries(b.req)) if (this.calc(i2) < req) can = false
				if (can) player.blackhole.boost[i] = 600
			}
			player.blackhole.power = player.blackhole.power.add(1)
			player.blackhole.hunger += 200
		},
		change(i) {
			let sum = 0
			for (let i2 in BH_FEED) if (i2 != i) sum += player.blackhole.weight[i2]
			player.blackhole.weight[i] = Math.min(el("bh_udsp_w_"+i).value, 100 - sum)
			this.update()
		},
		update() {
			for (let i in BH_FEED) el("bh_udsp_w_" + i).value = player.blackhole.weight[i]
		},
	},
	boosts: [
		{
			req: { dilatedTime: 1 },
			eff: x => Math.min(1 + x.add(1).log10() / 10, 2),
			disp: e => `Strengthen the replicanti Dilation upgrade by <b>${shorten(e)}x</b>.`
		},
		{
			req: { dilatedTime: 1 },
			eff: x => x.add(1).log10() + 1,
			disp: e => `Gain <b>${shorten(e)}x</b> more Dilated Time.`
		},
		{
			req: { dilatedTime: 1 },
			eff: x => x.add(1).log10() / 2 + 1,
			disp: e => `Gain <b>${shorten(e)}x</b> more ex-dilation.`
		},
		{
			req: { dilatedTime: 1 },
			eff: x => x.add(1).pow(.1),
			disp: e => `Gain <b>${shorten(e)}x</b> more Black Hole Power.`
		},
		{
			req: { dilatedTime: 1 },
			eff: x => x.add(1).log10() + 1,
			disp: e => `Gain <b>${shorten(e)}x</b> more banked Infinities.`
		},
		{
			req: { dilatedTime: 1 },
			eff: x => x.add(1).log10() / 5 + 1,
			disp: e => `Raise ex-dilation by <b>^${shorten(e)}</b>.`
		},
	],

	//DOM
	setup() {
		let html = ""
		for (let i in BH_FEED) {
			html += `<tr>
				<td>
					<b>${BH_FEED[i].title}</b>:
					<span id="bh_udsp_amt_${i}"></span>
				</td><td>
					<input id="bh_udsp_w_${i}" type="range" min="0" max="100" onchange="BH_UDSP.hunger.change('${i}')"></input>
					<span id="bh_udsp_per_${i}"></span>
				</td>
				<td></td>
			</tr>`
		}
		el("bh_udsp_feed").innerHTML = html
	},
	update() {
		let unl = player.blackhole.unl && mod.udsp
		el("bh_udsp").style.display = unl ? "" : "none"
		if (!unl) return

		el("bh_udsp_btn").className = player.blackhole.hunger < this.hunger.cap() ? "storebtn" : "unavailablebtn"
		el("bh_udsp_hu").textContent = shorten(player.blackhole.hunger) + " / " + shorten(this.hunger.cap())
		el("bh_udsp_dm").textContent = shorten(player.blackhole.power)

		for (let i in BH_FEED) {
			el("bh_udsp_per_" + i).innerHTML = player.blackhole.weight[i] + "%"
			el("bh_udsp_amt_" + i).innerHTML = shorten(this.hunger.calc(i))
		}

		let html = ""
		for (let [i, t] of Object.entries(player.blackhole.boost)) html += `<b>#${parseInt(i)+1}</b> (${timeDisplayShort(t * 10, 1)}): ${BH_UDSP.boosts[i].disp(tmp.bh_eff[i])}<br>`
		el("bh_udsp_eff").innerHTML = html
	}
}
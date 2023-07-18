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
	return (player.blackhole?.best || 0) >= BH_UDSP.eff[i].req
}

function getBlackHoleEff(i, def = 1) {
	return tmp.bh_eff?.[i] || def
}

const BH_UDSP = {
	calc(dt) {
		let data = BH_UDSP.feed
		player.blackhole.hunger = Math.min((player.blackhole.hunger || 0) + data.hunger_gain() * dt, data.hunger_cap())
	},
	temp() {
		if (!mod.udsp || !player.blackhole?.unl) {
			delete tmp.bh_eff
			return
		}

		tmp.bh_eff = []
		for (let d of BH_UDSP.eff) tmp.bh_eff.push(d.eff(player.blackhole.power))
	},

	//Features
	remnant: {
		reduce() {
			if (player.exdilation.unspent.eq(0)) return
			player.exdilation.unspent = E(0)
			for (let i of Object.keys(BH_FEED)) player.blackhole.upgrades[i] /= 2
		},
	},
	feed: {
		use() {
			let gain = Math.floor(Math.min(player.blackhole.hunger, player.blackhole.upgrades.total / 3))
			if (gain == 0) return

			player.blackhole.upgrades.total -= gain * 3
			player.blackhole.best = Math.max(player.blackhole.best || 0, gain * 3)
			player.blackhole.hunger -= gain
			player.blackhole.power = player.blackhole.power.add(BH_UDSP.feed.gain(gain))
		},
		gain(x) {
			let r = pow10(x / 2)
			if (hasBlackHoleEff(3)) r = r.mul(getBlackHoleEff(3))
			return r
		},
		hunger_gain() {
			let r = .03
			if (player.dilation.upgrades.includes("udsp2")) r *= Math.max(this.hunger_cap() / 5, 1)
			return r
		},
		hunger_cap() {
			let r = 1
			if (player.dilation.upgrades.includes("udsp1")) r += Math.max(player.dilation.dilatedTime.max(1).log10() / 3 - 10, 0)
			return r
		}
	},
	eff: [
		{ req: 1, eff: x => Math.min(1 + x.add(1).log10() / 10, 2), desc: e => `Strengthen the replicanti Dilation upgrade by <b>${shorten(e)}x</b>.` },
		{ req: 3, eff: x => x.add(1).log10() + 1, desc: e => `Gain <b>${shorten(e)}x</b> more Dilated Time.` },
		{ req: 6, eff: x => x.add(1).log10() / 2 + 1, desc: e => `Gain <b>${shorten(e)}x</b> more ex-dilation.` },
		{ req: 10, eff: x => x.add(1).pow(.1), desc: e => `Gain <b>${shorten(e)}x</b> more Black Hole Power.` },
		{ req: 15, eff: x => x.add(1).log10() + 1, desc: e => `Gain <b>${shorten(e)}x</b> more banked Infinities.` },
		{ req: 21, eff: x => x.add(1).log10() / 5 + 1, desc: e => `Raise ex-dilation by <b>^${shorten(e)}</b>.` },
	],

	//DOM
	setup() {
		let html = ""
		for (let i in BH_UDSP.eff) {
			html += `<td id="bh_udsp_eff_${i}" style='width: 420px; text-align: center'></td>`
			if (i % 2 == 1) html += `</tr><tr>`
		}
		el("bh_udsp_eff").innerHTML = `<tr>${html}</tr>`
	},
	update() {
		let unl = player.blackhole.unl && mod.udsp
		el("bh_udsp").style.display = unl ? "" : "none"
		el("blackholeSac").style.display = unl && exdilated() ? "" : "none"
		if (!unl) return

		el("bh_udsp_hu").textContent = shorten(player.blackhole.hunger) + " / " + shorten(BH_UDSP.feed.hunger_cap())
		el("bh_udsp_dm").textContent = shorten(player.blackhole.power)
		el("bh_udsp_re").textContent = getFullExpansion(player.blackhole.upgrades.total)
		for (let [i, d] of Object.entries(BH_UDSP.eff)) el("bh_udsp_eff_"+i).innerHTML = hasBlackHoleEff(i) ? d.desc(tmp.bh_eff[i]) : `[ Feed ${getFullExpansion(d.req)} Remnants ]`
	}
}

function moveBlackHoleFeed() {
	el(mod.udsp ? "bh_udsp_feed" : "bh_feed").appendChild(el("bh_feed_div"))
}

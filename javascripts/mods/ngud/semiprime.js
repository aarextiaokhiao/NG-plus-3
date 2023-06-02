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

//v2: Rebalanced
function updateBlackHoleUDSPTemp() {
	if (!mod.udsp || !player.blackhole?.unl) {
		delete tmp.bh_eff
		return
	}

	tmp.bh_eff = []
	for (let d of BH_UDSP.eff) tmp.bh_eff.push(d.eff(player.blackhole.power))
}

function hasBlackHoleEff(i) {
	return (player.blackhole?.best || 0) >= BH_UDSP.eff[i].req
}

function getBlackHoleEff(i, def = 1) {
	return tmp.bh_eff?.[i] || def
}

function calcBlackHoleUDSP(dt) {
	let data = BH_UDSP.feed
	player.blackhole.hunger = Math.min((player.blackhole.hunger || 0) + data.hunger_gain() * dt, data.hunger_cap())
}

function updateBlackHoleUDSP() {
	let unl = player.blackhole.unl && mod.udsp
	el("bh_udsp").style.display = unl ? "" : "none"
	if (!unl) return

	el("bh_udsp_hu").textContent = shorten(player.blackhole.hunger) + " / " + shorten(BH_UDSP.feed.hunger_cap())
	el("bh_udsp_dm").textContent = shorten(player.blackhole.power)
	el("bh_udsp_re").textContent = getFullExpansion(player.blackhole.upgrades.total)
	for (let [i, d] of Object.entries(BH_UDSP.eff)) el("bh_udsp_eff_"+i).innerHTML = hasBlackHoleEff(i) ? d.desc(tmp.bh_eff[i]) : `[ Feed ${getFullExpansion(d.req)} Remnants ]`
}

function setupBlackHoleUDSP() {
	let html = ""
	for (let i in BH_UDSP.eff) html += `<td id="bh_udsp_eff_${i}"></td>`
	el("bh_udsp_eff").innerHTML = html
}

const BH_UDSP = {
	remnant: {
		reduce() {
			if (player.exdilation.unspent.eq(0)) return
			player.exdilation.unspent = E(0)
			for (let i of Object.keys(BH_FEED)) player.blackhole.upgrades[i] /= 2
		},
	},
	feed: {
		use() {
			if (player.blackhole.upgrades.total == 0) return
			if (player.blackhole.hunger < 100) return
			player.blackhole.upgrades.total--
			player.blackhole.best = 1
			player.blackhole.hunger = 0
			player.blackhole.power = player.blackhole.power.add(pow10(.1))
		},
		hunger_gain: _ => 1,
		hunger_cap: _ => 100
	},
	eff: [
		{ req: 1, eff: x => 1, desc: e => `Boost something by <b>${shorten(e)}x</b>` },
		{ req: 2, eff: x => 1, desc: e => `Boost something by <b>${shorten(e)}x</b>` },
		{ req: 5, eff: x => 1, desc: e => `Boost something by <b>${shorten(e)}x</b>` },
		{ req: 10, eff: x => 1, desc: e => `Boost something by <b>${shorten(e)}x</b>` },
		{ req: 20, eff: x => 1, desc: e => `Boost something by <b>${shorten(e)}x</b>` },
		{ req: 50, eff: x => 1, desc: e => `Boost something by <b>${shorten(e)}x</b>` },
	],
}
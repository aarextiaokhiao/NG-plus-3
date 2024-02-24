//Gluons
const GLUON = {
	mixes: ["rg", "gb", "br"],

	//Upgrades
	upg_costs: [1, 2, 4, 100, 7e15, 4e19, 3e28, E("1e570")],
	upg_len: 8,
	upg_unls: {
		5: _ => hasMasteryStudy("d9"),
		6: _ => hasMasteryStudy("d9"),
		7: _ => hasMasteryStudy("d9"),
		8: _ => hasMasteryStudy("d13"),
	},
	upg_data: {
		rg: [
			{
				disp: "Remote Antimatter Galaxies scale approximately 2x slower."
			}, {
				disp: "Tachyonic Galaxies strengthen Galaxies.",
				eff: _ => Math.min(Math.pow(player.dilation.freeGalaxies / 5e3 + 1, 0.25), 1.7),
				eff_desc: e => formatPercentage(e-1)+"%"
			}, {
				disp: "Dimension Boosts boost 1st Meta Dimensions.",
				eff: () => E_pow(player.resets, player.resets / 1e6 + .25),
				eff_desc: e => shorten(e) + "x"
			}, {
				disp: "Galaxies are 50% stronger, but positrons are 30% weaker and disable Time Study 232."
			}, {
				disp: "Gain 10x more Quarks."
			}, {
				disp: "Distant Antimatter Galaxies scale 13.2% slower."
			}, {
				disp: "Remote Antimatter Galaxies scale 10% slower."
			}, {
				disp: "RG gluons increase free preons' half-life.",
				eff: _ => getGU8Effect("rg"),
				eff_desc: e => shorten(e) + "x"
			}
		],
		gb: [
			{
				disp: "Tickspeed reduction speeds up Replicantis.",
				eff: _ => 1-tmp.gal.ts.min(1).log10(),
				eff_desc: e => shorten(e) + "x"
			}, {
				disp: "Replicate interval scales 2x slower."
			}, {
				disp: "The IP mult multiplies IP gain by 2.3x per upgrade."
			}, {
				disp: "Massively decrease the tickspeed cost multiplier increase to 1.25x."
			}, {
				disp: "Positron Upgrades scale 0.3 levels lower."
			}, {
				disp: "Infinity Power scales Distant Antimatter Galaxies slower.",
				eff: _ => Math.min(1 + Math.pow(player.infinityPower.add(1).log10(), 0.25) / 2810, 2.5),
				eff_desc: e => "/" + shorten(e)
			}, {
				disp: "Infinity Points scale Remote Antimatter Galaxies slower.",
				eff: _ => 1 + Math.log10(1+player.infinityPoints.max(1).log10()) / 100,
				eff_desc: e => "/" + shorten(e)
			}, {
				disp: "GB gluons increase free preons' half-life.",
				eff: _ => getGU8Effect("gb"),
				eff_desc: e => shorten(e) + "x"
			}
		],
		br: [
			{
				disp: "Dilated Time boosts Tachyon Particles.",
				eff: _ => Math.sqrt(player.dilation.dilatedTime.add(10).log10()) / 2,
				eff_desc: e => shorten(e) + "x"
			}, {
				disp: "Sacrifice boosts Dilated Time.",
				eff: _ => E_pow(2.2, Math.pow(tmp.sacPow.log10() / 1e6, 0.25)),
				eff_desc: e => shorten(e) + "x"
			}, {
				disp: "Tachyon Particles slightly boost Dilated Time production."
			}, {
				disp: "Multiplier per ten dimensions boosts Meta Dimensions.",
				eff() {
					let log = E(getDimensionPowerMultiplier(hasNU(13) && "no-rg4")).log10() * 0.0003
					if (log > 1e3) log = Math.sqrt(log * 1e3)
					return pow10(log).max(1)
				},
				eff_desc: e => shorten(e) + "x"
			}, {
				disp: "Meta Dimensions produce 3x faster."
			}, {
				disp: "Meta-Dimension Boosts scale Distant Antimatter Galaxies slower.",
				eff: _ => Math.min(1 + player.meta.resets / 340, 2.5),
				eff_desc: e => "/" + shorten(e)
			}, {
				disp: "Eternity Points scale Remote Antimatter Galaxies slower.",
				eff: _ => 1 + Math.log10(1+player.eternityPoints.max(1).log10()) / 80,
				eff_desc: e => "/" + shorten(e)
			}, {
				disp: "BR gluons increase free preons' half-life.",
				eff: _ => getGU8Effect("br"),
				eff_desc: e => shorten(e) + "x"
			}
		]
	},

	//HTML
	setupTab() {
		let html = ""
		for (var mix of this.mixes) {
			let bond = COLORS[mix[0]] + "-" + COLORS[mix[1]]

			let mix_table = ``
			for (var i = 1; i <= this.upg_len; i++) {
				let data = this.upg_data[mix][i-1]
				mix_table += `<td>
					<button class='qu_upg condensed ${mix}' id='${mix}_upg_${i}' onclick='buyGluonUpg("${mix}", ${i})'>
						${data.disp}<br>
						${data.eff ? `Currently: <span id='${mix}_eff_${i}'></span><br>` : "" }
						Cost: <span id='${mix}_cost_${i}'></span> ${bond}
					</button>
				</td>`
				if (i % 2 == 0) mix_table += "</tr><tr>"
			}

			html += `<td class='${mix[0]}qC'>
				<span id="${mix}" style="font-size:35px">0</span> ${bond} gluons<br>
				(next quantum: <span id='${mix}_next'>0</span> ${COLORS[mix[0]]}, +<span id='${mix}_gain'>0</span>)
				<table><tr>${mix_table}</tr></table>
			</td>`
		}
		el("gl_upgs").innerHTML = html
	},
	update() {
		var gains = getGluonGains()
		for (var mix of this.mixes) {
			el(mix).innerHTML = shortenDimensions(quSave.gluons[mix])
			el(mix+"_next").innerHTML = shortenDimensions(quSave.usedQuarks[mix[0]].sub(gains[mix]))
			el(mix+"_gain").innerHTML = shortenDimensions(gains[mix])

			for (var i = 1; i <= this.upg_len; i++) {
				let unl = !this.upg_unls[i] || this.upg_unls[i]()
				el(mix+"_upg_"+i).style.display = unl ? "" : "none"
				if (!unl) continue

				let data = this.upg_data[mix][i-1]
				let cost = this.upg_costs[i-1]
				let bought = hasGluonUpg(mix, i)
				let can = bought || quSave.gluons[mix].gte(cost)

				el(mix+"_upg_"+i).className = "qu_upg" + (bought ? "_bought" : "") + " condensed " + (can ? mix : "unavailablebtn")
				el(mix+"_cost_"+i).innerHTML = shortenDimensions(cost)
				if (data.eff) el(mix+"_eff_"+i).innerHTML = data.eff_desc(data.eff())
			}
		}
	},
}

function hasGluonUpg(mix, i) {
	return quSave?.upgrades.includes(mix + i)
}

function gluonEff(mix, i) {
	return GLUON.upg_data[mix][i - 1].eff()
}

function getGluonGains() {
	var qk = quSave.usedQuarks
	var gains = {}
	for (let mix of GLUON.mixes) gains[mix] = qk[mix[0]].min(qk[mix[1]])
	return gains
}

function convertAQToGluons() {
	var qk = quSave.usedQuarks
	var gl = quSave.gluons
	var gains = getGluonGains()
	for (var mix of GLUON.mixes) {
		gl[mix] = gl[mix].add(gains[mix]).round()
		qk[mix[0]] = qk[mix[0]].sub(gains[mix]).round()
	}
}

function checkGluonRounding(){
	if (!quantumed) return
	if (hasBraveMilestone(8)) return
	for (var mix of GLUON.mixes) {
		if (quSave.gluons[mix].lt(100)) quSave.gluons[mix] = quSave.gluons[mix].round()
	}
	if (quSave.quarks.lte(100)) quSave.quarks = quSave.quarks.round()
}

function subtractGluons(toSpend = 0) {
	quSave.gluons.rg = quSave.gluons.rg.sub(quSave.gluons.rg.min(toSpend))
	quSave.gluons.gb = quSave.gluons.gb.sub(quSave.gluons.gb.min(toSpend))
	quSave.gluons.br = quSave.gluons.br.sub(quSave.gluons.br.min(toSpend))
}

function buyGluonUpg(color, i) {
	var name = color + i
	if (hasGluonUpg(color, i) || quSave.gluons[color].add(0.001).lt(GLUON.upg_costs[i-1])) return
	quSave.upgrades.push(name)
	quSave.gluons[color] = quSave.gluons[color].sub(GLUON.upg_costs[i-1])
	if (name == "gb3") {
		var otherMults = 1
		if (hasAch("r85")) otherMults *= 4
		if (hasAch("r93")) otherMults *= 4
		var old = getIPMultPower()
		ipMultPower = 2.3
		player.infMult = player.infMult.div(otherMults).pow(Math.log10(getIPMultPower()) / Math.log10(old)).mul(otherMults)
	}
	if (name == "rg4") updatePositronsEffect()
	if (name == "gb4") player.tickSpeedMultDecrease = 1.25
	updateQuantumWorth()
}

function getGU8Effect(type) {
	return Math.max(quSave.gluons[type].add(1).log10() / 100 - 4, 1)
}
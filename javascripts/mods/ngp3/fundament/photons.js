function lightEff(x, def) {
	return PHOTON.light.eff(x, def)
}

let PHOTON = {
	/* CORE */
	setup() {
		return {
			amt: E(0),
			range: [0, 0]
		}
	},

	//Unlock
	req: _ => bigRipped() && player.money.gte(pow10(17e8)),
	unlocked: _ => ghSave?.photons.unl,
	unlock() {
		ghSave.photons.unl = true
		notifyFeature("ph")
	},

	//Calculation
	calc(dt) {
		ghSave.photons.amt = this.photon_prod().mul(dt).add(ghSave.photons.amt)
	},
	temp() {
		if (!this.unlocked()) return

		let data = {}
		let lights = this.light.data
		tmp.funda.photon = data

		data.emission = ghSave.photons.amt.div(100).max(1).log(30)
		data.light = []
		data.harvest = [0,0]
		data.eff = []
		data.size = []

		let harvest = 0.1
		let total_size = lights.length - harvest * 6
		let cycles = Math.floor(data.emission / total_size)
		let remainder = data.emission % total_size

		data.curr = -1
		data.next = E(30).pow(cycles * total_size).mul(100)

		for (let [i, light] of Object.entries(lights)) {
			let size = 1
			for (let r of ghSave.photons.range) if (i - r >= 0 && i - r < 3) size -= harvest
			data.light[i] = cycles + Math.min(remainder / size, 1)
			data.eff[i] = light.eff(data.light[i]) //will be determined soon
			data.size[i] = size
			for (let [ri, r] of Object.entries(ghSave.photons.range)) if (i - r >= 0 && i - r < 3) data.harvest[ri] += data.light[i]

			if (remainder > 0) {
				data.curr = Number(i)
				data.next = E(30).pow(size).mul(data.next)
				data.gain = remainder / size
			}
			remainder = Math.max(remainder - size, 0)
		}
	},

	/* Feature - Enharvestments */
	harvest: {
		names: ["Dark Essence", "Enlightenment"],
		classes: ["lDe", "lEp"],
		change(i) {
			ghSave.photons.range[i] = Number(el("ph_harvest_range_"+i).value)
		},
		update() {
			for (let i in this.names) el("ph_harvest_range_" + i).value = ghSave.photons.range[i]
		},
	},

	/* Feature - Lights */
	photon_prod() {
		let r = player.dilation.tachyonParticles.max(1).pow(1/60).div(1e4)
		r = E(ghSave.ghostParticles.max(1e18).log10() / 18).pow(5).mul(r)
		if (hasNB(12)) r = r.mul(NT.eff("boost", 12))
		if (hasNanoReward("photon")) r = r.mul(tmp.qu.nf.eff.photon)
		return r
	},
	light: {
		data: [
			{
				name: "infrared",
				eff: a => E_pow(tmp.gal.ts || 1, -a/4),
				desc: e => `Tickspeed reduction multiplies per-ten multiplier by ${shorten(e)}x.`
			}, {
				name: "red",
				eff: a => Math.min(1 + Math.sqrt(a), 3),
				desc: e => `Raise 2nd Neutrino Boost by ^${e.toFixed(3)}.`
			}, {
				name: "orange",
				eff: a => 1 + a / 500,
				desc: e => `Gain ${shorten((e-1)*100)}% more Neutrinos per Big Rip galaxy.`
			}, {
				name: "yellow",
				eff: a => a / 100,
				desc: e => `Discharged Galaxies are ${(e*100).toFixed(1)}% efficient.`
			}, {
				name: "green",
				eff: a => Math.min(a, 3),
				desc: e => `Increase Infinity Power effect by +^${shorten(e)}.`
			}, {
				name: "blue",
				eff: a => a / 3 + 1,
				desc: e => `Raise Emperor Dimensions by ^${shorten(e)}.`
			}, {
				name: "violet",
				eff: a => a * 4,
				desc: e => `Nanoreward scales +${shorten(e)} later.`
			}, {
				name: "ultraviolet",
				eff: a => 1 + a / 100,
				desc: e => `Strengthen Meta-Dimension Boosts by +${shorten((e-1)*100)}% per boost.`
			}
		],
		eff(x, def = 1) {
			return tmp.funda.photon?.eff[x] ?? def
		},
	},

	/* HTML */
	setupTab() {
		let html = ``
		for (var [r, type] of Object.entries(this.harvest.names)) {
			let row = ''
			for (var i = r * 4; i < r * 4 + 4; i++) {
				let light = this.light.data[i]
				row += `<div id='ph_light_${i}'>
					<b id='ph_light_amt_${i}' style='font-size: 18px'></b><br>
					<b id='ph_light_size_${i}'></b><br>
					<span id='ph_light_eff_${i}'></span>
				</div>`
			}
			html += `<div class='table_flex'>
				<div id='ph_harvest_${r}'>
					<b id='ph_harvest_amt_${r}' style='font-size: 18px'></b><br>
					<b id='ph_harvest_gather_${r}'></b><br>
					<input id='ph_harvest_range_${r}' type='range' max=5 onchange="PHOTON.harvest.change(${r})"><br>
				</div>
				${row}
			</div>`
		}
		el('light_table').innerHTML = html
	},
	update() {
		let unl = this.unlocked()
		el("gphUnl").style.display = unl ? "none" : ""
		el("gphDiv").style.display = unl ? "" : "none"
		if (!unl) {
			el("gphUnl").textContent = "Get "+shortenCosts(pow10(17e8))+" antimatter in Big Rip to unlock Photons."
			return
		}

		let pt = tmp.funda.photon
		let lights = this.light.data
		el("ph_amt").textContent = shortenMoney(ghSave.photons.amt)
		el("ph_prod").textContent = `(+${shorten(this.photon_prod())}/s)`

		for (var [i, hav] of Object.entries(this.harvest.names)) {
			let pos = ghSave.photons.range[i]
			let on = [0,1,2].map(x => pos + x).includes(pt.curr)
			el("ph_harvest_" + i).className = `light ${on ? this.harvest.classes[i] : ""}`
			el("ph_harvest_amt_" + i).textContent = `${shorten(pt.harvest[i])} ${hav}s`
			el("ph_harvest_range_" + i).style.display = pt.emission > 1.6 ? "" : "none"
			el("ph_harvest_gather_" + i).textContent = on ? `Harvesting until ${lights[pos+2].name}` : `Harvests at ${lights[pos].name}`
		}
		for (var [i, light] of Object.entries(lights)) {
			el("ph_light_" + i).className = `light ${light.name} ${pt.curr == i ? "" : "blank"}`
			el("ph_light_" + i).style["border-bottom-width"] = (1 - pt.size[i]) * 150 + "px"
			el("ph_light_" + i).style.height = pt.size[i] * 150 + "px"
			el("ph_light_amt_" + i).textContent = `${shorten(pt.light[i])} ${light.name}`
			el("ph_light_size_" + i).textContent = shiftDown ? `(${pt.size[i].toFixed(1)} size)` : (pt.curr + 1) % 8 == i ? `Next at: ${shortenDimensions(pt.next)} Photons` : pt.curr ==i ? `+${shorten(pt.gain)} / 1` : ""
			el("ph_light_eff_" + i).textContent = light.desc(lightEff(i))
		}
	}
}
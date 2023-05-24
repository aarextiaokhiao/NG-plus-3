let PRESET_DATA = {
	ts: {
		name: "Time Studies",
		unl: _ => (getEternitied() > 0 || quantumed) && !mod.rs,
		in: _ => isTabShown("eternitystore") && (isTabShown('timestudies') || isTabShown('masterystudies')),

		get: _ => getStudyTreeStr(),
		options: ["respec", "dil"],
		load(str, options = {}) {
			let dil = options.dil
			if (options.respec) {
				if (!canEternity()) {
					$.notify("You need " + shorten(Number.MAX_VALUE) + " IP to do a force respec load.")
					return
				}
				eternity(false, false, dil, true)
			} else if (dil) startDilatedEternity(true)

			importStudyTree(str)
		}
	},
	ts_er: {
		name: "Studies [Respecced]",
		unl: _ => getEternitied() > 0 && mod.rs,
		in: _ => isTabShown("eternitystore") && isTabShown('ers_timestudies'),

		get: _ => getStudyTreeStr(),
		options: ["respec", "dil"],
		load(str, options) {
			PRESET_DATA.ts.load(str, options)
		}
	},
}

let PRESET_OPTION_NAMES = {
	respec: "Respec",
	dil: "Dilation"
}

let PRESET = {
	data(loc) {
		return (loc.global ? meta.save : aarMod).presets?.[loc.preset] ?? {
			main: [],
			dial: {}
		}
	},

	open(toChange, val) {
		if (toChange && this.loc[toChange] != val) {
			this.loc[toChange] = val
			delete this.reload
		}

		closeToolTip()
		el("preset_menu").style.display = "block"
		el('preset_options').style.display = this.loc.preset ? "" : "none"
		el('preset_global_btn').className = "storebtn" + (this.loc.global ? " chosen" : "")
		el('preset_local_btn').className = "storebtn" + (!this.loc.global ? " chosen" : "")
		for (let [i, data] of Object.entries(PRESET_DATA)) {
			el(`preset_${i}_open`).style.display = data.unl() ? "" : "none"
			el(`preset_${i}_open`).className = "storebtn longbtn" + (this.loc.preset == i ? " chosen" : "")
		}

		if (this.reload) return
		this.reload = true
		clearInterval(this.interval)
		el("preset_list").innerHTML = ""

		if (!this.loc.preset) return
		this.player = this.data(this.loc)
		this.loaded = 0
		this.loading = false

		this.interval = setInterval(function() {
			if (PRESET.loading) return
			if (PRESET.loaded == PRESET.player.main.length) {
				clearInterval(PRESET.interval)
				return
			}
			PRESET.loading = true
			PRESET.layout()
			PRESET.loading = false
		}, 10)
	},
	loc: {},

	setup() {
		let html = ""
		for (let [i, data] of Object.entries(PRESET_DATA)) html += `<button id='preset_${i}_open' onclick="PRESET.open('preset', '${i}')">${data.name}</button>`
		el("preset_types").innerHTML = html
	},
	layout() {
		let i = PRESET.loaded
		let options = ""
		for (var opt of PRESET_DATA[PRESET.loc.preset].options) options += `<button class="storebtn" id="preset_${i}_${opt}" onclick='PRESET.toggle(${i}, "${opt}")'></button>`

		el("preset_list").insertRow(i).innerHTML = `<b id='preset_${i}_title'></b><br>
			${options}<br>
			<input id='preset_${i}_data' style='width: 75%' onchange='PRESET.change(${i})'><br>

			<button class='storebtn' onclick='PRESET.change(${i}, true)'>Overwrite</button>
			<button class='storebtn' onclick='PRESET.load(${i})'>Load</button>
			<button class='storebtn' onclick='PRESET.rename(${i})'>Rename</button>

			<span class='metaOpts'>
				<button class='storebtn' onclick='PRESET.swap(${i}, ${i-1})'>⭡</button>
				<button class='storebtn' onclick='PRESET.swap(${i}, ${i+1})'>⭣</button>
				<button class='storebtn' onclick='PRESET.delete(${i})'>X</button>
			</span>`
		PRESET.loaded++
		this.update(i)
	},
	update(i) {
		let options = PRESET_DATA[PRESET.loc.preset].options
		let data = PRESET.player.main[i]
		el(`preset_${i}_title`).innerHTML = data.title || `${PRESET_DATA[PRESET.loc.preset].name} Preset #${i+1}`
		el(`preset_${i}_data`).value = data.str
		for (let opt of options) el(`preset_${i}_${opt}`).innerHTML = PRESET_OPTION_NAMES[opt] + ": " + (data[opt] ? "ON" : "OFF")
	},

	change(i, overwrite) {
		PRESET.player.main[i].str = overwrite ? PRESET_DATA[PRESET.loc.preset].get() : el(`preset_${i}_data`).value
		PRESET.save(i)
	},
	toggle(i, opt) {
		PRESET.player.main[i][opt] = !PRESET.player.main[i][opt]
		PRESET.save(i)
	},

	new(onImport) {
		let str = onImport ? prompt() : PRESET_DATA[PRESET.loc.preset].get()
		PRESET.player.main.push({ str: str })
		PRESET.save()

		$.notify(`Preset created`, "info")
		PRESET.layout()
	},
	save(i) {
		let data = (PRESET.loc.global ? meta.save : aarMod).presets
		data[PRESET.loc.preset] = PRESET.player
		if (PRESET.loc.global) meta.mustSave = true

		if (i == undefined) return
		$.notify(`Preset #${i+1} changed and saved`, "info")
		PRESET.update(i)
	},
	load(i) {
		let data = PRESET.player.main[i]
		PRESET_DATA[PRESET.loc.preset].load(data.str || "", data)

		$.notify(`Preset #${i+1} loaded`, "info")
		closeToolTip()
	},
	rename(i) {
		PRESET.player.main[i].title = prompt("Enter your new preset name. Leaving the blank will reset the name!")
		PRESET.save(i)
	},
	swap(i, j) {
		if (j < 0 || j >= PRESET.player.main.length) return
		let p1 = PRESET.player.main[i]
		let p2 = PRESET.player.main[j]
		PRESET.player.main[i] = p2
		PRESET.player.main[j] = p1
		PRESET.update(i)
		PRESET.update(j)
		PRESET.save()
	},
	delete(i) {
		let newData = []
		for (var j = 0; j < PRESET.player.main.length; j++) if (i != j) newData.push(PRESET.player.main[j])
		PRESET.player.main = newData
		PRESET.save()

		delete PRESET.reload
		PRESET.open()
	}
}

let PRESET_DIAL = {
	detect() {
		delete this.dial
		for (var [i, data] of Object.entries(PRESET_DATA)) if (data.in()) this.dial = i
		el("preset_buttons").style.display = this.dial ? "" : "none"
	},
	open() {
		PRESET.open("preset", this.dial)
	},
	click(i) {
		PRESET_DIAL[shiftDown ? "save" : "load"](i)
	},
	save(i) {
		let data = PRESET.data({ preset: PRESET_DIAL.dial })
		data.dial[i] = PRESET_DATA[PRESET_DIAL.dial].get()

		aarMod.presets[PRESET_DIAL.dial] = data
		if (PRESET.loc.preset == PRESET_DIAL.dial && !PRESET.loc.global) PRESET.player = data

		$.notify("Dial preset #" + i + " saved", "info")
	},
	load(i) {
		PRESET_DATA[PRESET_DIAL.dial].load(PRESET.data({ preset: PRESET_DIAL.dial }).dial[i] || "")
		$.notify("Dial preset #" + i + " loaded", "info")
	}
}

let PRESET_BULK = {
	open() {
		closeToolTip()
		el("preset_bulk").style.display = "block"
		el("preset_bulk_str").value = `${PRESET_BULK.get()}`
	},
	close(save) {
		if (save) {
			PRESET.player = this.parse()
			PRESET.save()
			delete PRESET.reload
		}
		PRESET.open()
	},
	download() {
		downloadData(el("preset_bulk_str").value, `NG+3 v2.31 Beta - ${PRESET_DATA[PRESET.loc.preset].name} Presets - ${new Date().toGMTString()}.txt`)
	},

	get() {
		let data = PRESET.player
		let value = ``

		value = `-- MAIN --\n`
		for (let main of data.main) {
			value += `"${main.title||''}" / "${main.str}"`
			for (let [i, opt] of Object.entries(PRESET_OPTION_NAMES)) if (main[i]) value += ` / ${opt}`
			value += `\n`
		}

		value += `-- DIAL --\n`
		for (let [i, dial] of Object.entries(data.dial)) value += `${i} / "${dial}"\n`
		return value
	},
	parse() {
		let data = { main: [], dial: {} }
		let mode = ""
		let lines = el("preset_bulk_str").value.split("\n")
		for (let line of lines) {
			if (line == "") continue
			if (line == "-- MAIN --") mode = "main"
			if (line == "-- DIAL --") mode = "dial"

			let split = line.split(` / `).map(x => x[0] == `"` ? x.slice(1, x.length - 1) : x)
			if (split.length == 1) continue

			if (mode == "main") {
				let json = { title: split[0], str: split[1] }
				for (let [i, opt] of Object.entries(PRESET_OPTION_NAMES)) if (split.includes(opt)) json[i] = true
				data.main.push(json)
			}
			if (mode == "dial") data.dial[split[0]] = split[1]
		}
		return data
	},
}

/*

-=-=- [ TO DO ] -=-=-
1. Add pin/favorite system.

*/
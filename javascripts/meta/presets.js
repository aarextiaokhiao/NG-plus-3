let PRESET_DATA = {
	ts: {
		name: "Time Studies",
		unl: _ => (eternitied()) && !mod.rs,
		in: _ => isTabShown('ts') || isTabShown('ts_master'),

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
		in: _ => isTabShown('ts_respec'),

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
	get(loc) {
		let d = (loc.global ? meta.save : aarMod).presets?.[loc.preset] ?? { main: [] }
		if (!d.dial?.length) d.dial = []
		return d
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
		this.data = this.get(this.loc)
		this.loaded = 0
		this.loading = false

		this.interval = setInterval(function() {
			if (PRESET.loading) return
			if (PRESET.loaded == PRESET.data.main.length) {
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
		let data = PRESET.data.main[i]
		el(`preset_${i}_title`).innerHTML = data.title || `${PRESET_DATA[PRESET.loc.preset].name} Preset #${i+1}`
		el(`preset_${i}_data`).value = data.str
		for (let opt of options) el(`preset_${i}_${opt}`).innerHTML = PRESET_OPTION_NAMES[opt] + ": " + (data[opt] ? "ON" : "OFF")
	},

	change(i, overwrite) {
		PRESET.data.main[i].str = overwrite ? PRESET_DATA[PRESET.loc.preset].get() : el(`preset_${i}_data`).value
		PRESET.save(i)
	},
	toggle(i, opt) {
		PRESET.data.main[i][opt] = !PRESET.data.main[i][opt]
		PRESET.save(i)
	},

	new(onImport) {
		let str = onImport ? prompt() : PRESET_DATA[PRESET.loc.preset].get()
		PRESET.data.main.push({ str: str })
		PRESET.save()

		$.notify(`Preset created`, "info")
		PRESET.layout()
	},
	save(i) {
		let data = (PRESET.loc.global ? meta.save : aarMod).presets
		data[PRESET.loc.preset] = PRESET.data
		if (PRESET.loc.global) meta.mustSave = true

		if (i == undefined) return
		$.notify(`Preset #${i+1} changed and saved`, "info")
		PRESET.update(i)
	},
	load(i) {
		let data = PRESET.data.main[i]
		PRESET_DATA[PRESET.loc.preset].load(data.str || "", data)

		$.notify(`Preset #${i+1} loaded`, "info")
		closeToolTip()
	},
	rename(i) {
		PRESET.data.main[i].title = prompt("Enter your new preset name. Leaving the blank will reset the name!")
		PRESET.save(i)
	},
	swap(i, j) {
		if (j < 0 || j >= PRESET.data.main.length) return
		let p1 = PRESET.data.main[i]
		let p2 = PRESET.data.main[j]
		PRESET.data.main[i] = p2
		PRESET.data.main[j] = p1
		PRESET.update(i)
		PRESET.update(j)
		PRESET.save()
	},
	delete(i) {
		let newData = []
		for (var j = 0; j < PRESET.data.main.length; j++) if (i != j) newData.push(PRESET.data.main[j])
		PRESET.data.main = newData
		PRESET.save()

		delete PRESET.reload
		PRESET.open()
	}
}

let PRESET_DIAL = {
	detect() {
		delete this.dial
		for (var [i, data] of Object.entries(PRESET_DATA)) if (data.in()) this.dial = i

		this.data = this.dial && PRESET.get({ preset: this.dial })

		el("preset_buttons").style.display = this.dial ? "" : "none"
	},
	update() {
		el("preset_dial_info").innerHTML = `${shiftDown ? 'Save' : 'Load'} a dial preset (${PRESET_DATA[PRESET_DIAL.dial].name})`
		for (var i = 0; i < 3; i++) {
			let dial = this.data.dial[i]
			let has = dial !== undefined
			el("preset_dial_" + i).className = has ? "timetheorembtn" : "storebtn"
			el("preset_dial_" + i).textContent = has ? dial.title : "Empty"
		}
	},
	click(i) {
		PRESET_DIAL[shiftDown || !PRESET_DIAL.data.dial[i] ? "save" : "load"](i)
	},
	open() {
		PRESET.open("preset", this.dial)
	},

	//Loading
	save(i) {
		let data = PRESET_DIAL.data
		data.dial[i] = { title: prompt("Name your preset dial #" + (i+1)) || (i+1), str: PRESET_DATA[PRESET_DIAL.dial].get() }

		aarMod.presets[PRESET_DIAL.dial] = data
		if (PRESET.loc.preset == PRESET_DIAL.dial && !PRESET.loc.global) PRESET.data = data

		$.notify("Dial preset #" + (i+1) + " saved", "info")
	},
	load(i) {
		PRESET_DATA[PRESET_DIAL.dial].load(PRESET_DIAL.data.dial[i].str || "")
		$.notify("Dial preset #" + (i+1) + " loaded", "info")
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
			PRESET.data = this.parse()
			PRESET.save()
			delete PRESET.reload
		}
		PRESET.open()
		PRESET_DIAL.detect()
	},
	download() {
		downloadData(el("preset_bulk_str").value, `NG+3 v2.31 Beta - ${PRESET_DATA[PRESET.loc.preset].name} Presets - ${new Date().toGMTString()}.txt`)
	},

	get() {
		let data = PRESET.data
		let value = ``

		for (let main of data.main) {
			value += `"${main.title||''}" / "${main.str}"`
			for (let [i, opt] of Object.entries(PRESET_OPTION_NAMES)) if (main[i]) value += ` / ${opt}`
			value += `\n`
		}
		if (!PRESET.loc.global) {
			value = `-- MAIN --\n` + value + `\n-- DIAL --\n`
			for (let main of data.dial) value += `"${main.title||''}" / "${main.str}"\n`
		}
		return value
	},
	parse() {
		let data = { main: [], dial: [] }
		let mode = "main"
		for (let line of el("preset_bulk_str").value.split("\n")) {
			if (line == "-- DIAL --") mode = "dial"
			if (!mode) continue

			let split = line.split(` / `).map(x => x[0] == `"` && x[x.length - 1] == `"` ? x.slice(1, x.length - 1) : x)
			if (split.length == 1) continue

			let json = { title: split[0], str: split[1] }
			for (let [i, opt] of Object.entries(PRESET_OPTION_NAMES)) if (split.includes(opt)) json[i] = true		
			data[mode].push(json)
		}
		return data
	},
}

/*

-=-=- [ TO DO ] -=-=-
1. Add pin/favorite system.

*/
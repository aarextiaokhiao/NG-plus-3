let PRESET_DATA = {
	ts: {
		name: "Time Studies",
		unl: _ => !mod.rs,
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
		unl: _ => mod.rs,
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
		if (toChange && PRESET.loc[toChange] != val) {
			PRESET.loc[toChange] = val
			delete PRESET.reload
		}
		closeToolTip()
		el("preset_menu").style.display = "block"

		if (PRESET.reload) return
		PRESET.reload = true
		PRESET.player = this.data(this.loc)
		PRESET.loaded = 0
		PRESET.loading = false
		clearInterval(PRESET.interval)

		for (let [i, data] of Object.entries(PRESET_DATA)) el(`preset_${i}_open`).style.display = data.unl() ? "" : "none"

		el("preset_list").innerHTML = ""
		PRESET.interval = setInterval(function() {
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
	loc: {
		global: false,
		preset: "ts",
	},

	setup() {
		let html = ""
		for (let [i, data] of Object.entries(PRESET_DATA)) html += `<button class='storebtn longbtn' id='preset_${i}_open' onclick="PRESET.open('preset', '${i}')">${data.name}</button>`
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
		PRESET.save(i, true)

		$.notify(`Preset created`, "info")
		PRESET.layout()
	},
	save(i, silent) {
		let data = (PRESET.loc.global ? meta.save : aarMod).presets
		data[PRESET.loc.preset] = PRESET.player
		if (PRESET.loc.global) meta.mustSave = true

		if (silent) return
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
		PRESET.save(null, true)
	},
	delete(i) {
		let newData = []
		for (var j = 0; j < PRESET.player.main.length; j++) if (i != j) newData.push(PRESET.player.main[j])
		PRESET.player.main = newData
		PRESET.save(null, true)

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
		$.notify("Preset #" + i + " saved", "info")
	},
	load(i) {
		PRESET_DATA[PRESET_DIAL.dial].load(PRESET.data({ preset: PRESET_DIAL.dial }).dial[i] || "")
		$.notify("Preset #" + i + " loaded", "info")
	}
}

/*

-=-=- [ TO DO ] -=-=-
1. Add pin/favorite system.

*/
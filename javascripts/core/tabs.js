let TABS = {
	root: { stab: [ "dim", "ach", "stats", "opt", "chal", "gSac", "inf", "eter", "qu", "ant", "funda", "bl" ] },

	ach: { name: "Achievements", stab: [ "ach_n", "ach_sec", "ach_badge" ] },
	ach_n: { name: "Normal" },
	ach_sec: { name: "Secrets", unl: _ => !aarMod.hideSecretAchs },
	ach_badge: { name: "Badges", unl: _ => !aarMod.hideSecretAchs },

	stats: { name: "Statistics", stab: [ "stats_main", "stats_inf", "stats_eter", "stats_qu", "stats_funda" ] },
	stats_main: { name: "Main", update() {
		displayMainStats()
		displayGalSacStats()
		infoScaleDisplay()
	} },
	stats_inf: { name: "Infinity", class: "infinitybtn", unl: _ => infinitied(), update: _ => displayInfinityStats() },
	stats_eter: { name: "Eternity", class: "eternitybtn", unl: _ => eternitied(), update: _ => displayEternityStats() },

	opt: { name: "Options", stab: [ "opt_save", "opt_disp", "opt_key", "opt_other", "opt_sec" ] },
	opt_save: { name: "Saving" },
	opt_disp: { name: "Display" },
	opt_key: { name: "Hotkeys" },
	opt_other: { name: "Others" },
	opt_sec: { name: "Secrets", unl: _ => player.options.secrets != undefined },

	dim: { name: "Dimensions", stab: [ "dim_am", "dim_inf", "dim_time", "dim_meta", "dim_emp" ] },
	dim_am: { name: "Antimatter", update: _ => dimensionTabDisplay() },
	dim_inf: { name: "Infinity", class: "infinitybtn", unl: _ => (player.infDimensionsUnlocked[0] || eternitied()) && !inQC(8), update: _ => updateInfinityDimensions() },
	dim_time: { name: "Time", class: "eternitybtn", unl: _ => (inNGM(4) || eternitied()) && (!inQC(8) || brokeEternity()) && PHANTOM.amt < 8, update: _ => updateTimeDimensions() },
	dim_meta: { name: "Meta", class: "quantumbtn", unl: _ => player.dilation.studies.includes(6), update: _ => updateMetaDimensions() },

	chal: { name: "Challenges", stab: [ "chal_n", "chal_inf", "chal_eter", "chal_qu", "rip" ], unl: _ => inNGM(4) ? gSacrificed() : infinitied() },
	chal_n: { name: "Normal" },
	chal_inf: { name: "Infinity", unl: _ => player.postChallUnlocked || eternitied(), class: "infinitybtn" },
	chal_eter: { name: "Eternity", unl: _ => tmp.ec_unl, class: "eternitybtn", update: _ => ECRewardDisplayUpdating() },

	gSac: { name: "Galaxy", class: "galaxybtn", stab: [ "upg_gSac", "auto_buy" ], unl: _ => gSacrificed() },
	upg_gSac: { name: "Upgrades", update() {
		galacticUpgradeSpanDisplay()
		galacticUpgradeButtonTypeDisplay()
	} },

	inf: { name: "Infinity", class: "infinitybtn", stab: [ "upg_inf", "auto_buy", "break", "rep" ], unl: _ => infinitied() },
	upg_inf: { name: "Upgrades", update: _ => preBreakUpgradeDisplay() },
	auto_buy: { name: "Autobuyers", unl: _ => inNGM(4) ? gSacrificed() : infinitied()  },
	break: { name: "Break Infinity", update() {
		if (el("breaktable").style.display == "inline-block") breakInfinityUpgradeDisplay()
	} },
	rep: { name: "Replicanti", update: _ => replicantiDisplay() },

	eter: { name: "Eternity", class: "eternitybtn", stab: [ "ts", "ts_respec", "ts_master", "upg_eter", "dil", "bh", "mil_eter" ], unl: _ => eternitied(), update() {
		if (el("TTbuttons").style.display !== "none") updateTheoremButtons()
	} },
	ts: { name: "Time Studies", unl: _ => !mod.rs, update() {
		updateTimeStudyButtons()
		mainTimeStudyDisplay()
	} },
	ts_respec: { name: "Time Studies", unl: _ => mod.rs, update() {
		updateTimeStudyButtons()
		updateERSTTDesc()
	} },
	ts_master: { name: "Mastery Studies", unl: _ => MTS.unl(), update: _ => updateMasteryStudyButtons() },
	upg_eter: { name: "Upgrades", update() {
		eternityUpgradesDisplay()
		updateEternityUpgrades()
		breakEternityDisplay()
	} },
	mil_eter: { name: "Milestones" },
	dil: { name: "Time Dilation", unl: _ => player.dilation.studies.includes(1), update() {
		updateDilation()
		updateExdilation()
	} },
	bh: { name: "Black Hole", unl: _ => player.dilation.studies.includes(1) && mod.ngud, update: _ => updateBlackhole() }
}

const TAB_CORE = {
	//update_tmp: Update the tree of tabs you have unlocked.
	//Subtabs have a priority on latter tabs!
	update_tmp() {
		tmp.tab.rev = {}
		this.collect("root")

		tmp.tab.old = tmp.tab.new
		tmp.tab.new = {}
		for (var [i, p] of Object.entries(tmp.tab.rev)) tmp.tab.new[p] = (tmp.tab.new[p] ?? []).concat(i)
		for (var i in tmp.tab.new) this.reload(i)
		for (var i in tmp.tab.old) this.reload(i)
	},

	//Collect: Collect the parents from its subtabs.
	collect(x) {
		let tabs = TABS[x]?.stab
		if (tabs == undefined) return
		for (var i of tabs) {
			if (TABS[i] == undefined) continue
			if (TABS[i].unl != undefined && !TABS[i].unl()) continue
			this.collect(i)
			delete tmp.tab.rev[i]
			tmp.tab.rev[i] = x
		}	
	},

	//Reload: Refresh the DOM for the subtab menu.
	reload(x) {
		let refresh = false
		let tab = tmp.tab.new[x] ?? []
		let old = tmp.tab.old?.[x] ?? []
		for (var i of tab.concat(old)) if (!old.includes(i) || !tab.includes(i)) refresh = true
		if (!refresh) return

		let div = ""
		for (let i of tab) {
			let data = TABS[i]
			let type = data.class || ""
			if (x == "root") div += `<button class='${type || "tabbtn"}' id='tab_btn_${i}' onclick="TAB_CORE.open('${i}')" style='font-size: 20px'>${data.name}</button> `
			else div += `<td><button class='secondarytabbtn ${type}' id='tab_btn_${i}' onclick="TAB_CORE.open('${i}')">${data.name}</button></td>`
			el(x == "root" ? "container" : "tab_" + x).appendChild(el("tab_" + i))
		}
		el("tabs_" + x).innerHTML = tab.length > 1 ? div : ""
		this.switch(x, tab.includes(aarMod.tabs[x]) ? aarMod.tabs[x] : tab[0])
	},

	//Open: Open the tab and subtabs.
	open(x) {
		if (!tmp.tab.rev[x]) this.update_tmp()

		let p = tmp.tab.rev[x] || "root"
		if (p != "root") this.switch("root", p)
		this.switch(p, x)
	},
	shift(p, i) {
		let tabs = tmp.tab.new[p]
		let index = tabs.indexOf(tmp.tab.open[p])
		if (index >= 0 && index + i >= 0 && index + i < tabs.length) this.switch(p, tabs[index + i])
	},
	switch(a, b) {
		if (tmp.tab.open[a]) el("tab_" + tmp.tab.open[a]).style.display = ""
		if (b) el("tab_" + b).style.display = "block"
		aarMod.tabs[a] = tmp.tab.open[a] = b

		tmp.tab.in = [tmp.tab.open.root, tmp.tab.open[tmp.tab.open.root]]
		if (isTabShown(b)) onTabSwitch()
	},

	//update: Update opened tabs.
	update() {
		for (var x of tmp.tab.in) TABS[x]?.update?.()
	},
}

function onTabSwitch() {
	el("progress").style.display = aarMod.progressBar && isTabShown("dim") ? "block" : "none"
	updatePaddingForFooter()

	let study_tree = isTabShown('ts') || isTabShown('ts_respec') || isTabShown('ts_master')
	el("TTbuttons").style.display = study_tree ? "block" : "none"

	if (isTabShown("ts"))        el("ts_preset_div_1").appendChild(el("ts_preset_menu"))
	if (isTabShown("ts_respec")) el("ts_preset_div_2").appendChild(el("ts_preset_menu"))
	if (isTabShown("ts_master")) el("ts_preset_div_3").appendChild(el("ts_preset_menu"))

	var oldEmpty = isEmptiness
	isEmptiness = !aarMod.tabs.root
	if (oldEmpty != isEmptiness) updateHeaders()

	showHideFooter()
	PRESET_DIAL.detect()


	//Canvases
	resizeCanvas()
	if (isTabShown("dil")) requestAnimationFrame(drawAnimations)
	if (isTabShown("bh")) requestAnimationFrame(drawBlackhole)
	if (isTabShown("aq")) requestAnimationFrame(drawQuarkAnimation)
}

function isTabShown(x) {
	return tmp.tab.in.includes(x)
}
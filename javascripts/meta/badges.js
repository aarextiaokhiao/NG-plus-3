//META

let BADGES = []
const BADGE_LOOKUP = {
	//Combinations: NGUdS', NG-x
	ngmX: {
		//Galactic Sacrifice, Infinity, Eternity, Interreality, Dilation
		data: ["mX_gs", "mX_inf", "mX_eter", "mX_ir", "mX_dil", "mX_fu"],
		generate() {
			let r = []
			for (var i = 2; i <= MAX_NGMX; i++) r = r.concat(this.data.map(n => n.replace("X", i + "")))
			return r
		}
	},
	ngp3: {
		//Quantum, Duplicants, Fundament, Bosonic Lab
		data: ["p3_qu", "p3_ant", "p3_fu", "p3_bl"],
		generate() {
			return this.data.concat(["sp_qu", "sp_ant", "sp_fu", "tgr"])
		}
	},
}
let BADGE_FRAG = {
	p3: "NG+3",
	sp: "NGUdS'",
	m2: "NG-2",
	m3: "NG-3",
	m4: "NG-4",
	m5: "NG-5",

	gs: "Galactic Sacrifice",
	inf: "Infinity",
	eter: "Eternity",
	ir: "Interreality",
	dil: "Dilate Time",
	qu: "Quantum",
	ant: "Reach Duplicants",
	fu: "Fundament",
	bl: "Reach Bosonic Lab",
}
let BADGE_TITLE = {
	p3_qu: "Superposition",
	p3_ant: "Colonist",
	p3_fu: "Enlargement",
	p3_bl: "Bosonic Scientist",
	tgr: "The Grand Run",

	sp_qu: "Dark Foam",
	sp_ant: "Dark Colonist",
	sp_fu: "Evaporated",

	m2_gs: "Sacrifice Worthy",
	m2_inf: "Infinitist",
	m2_eter: "Eternalist",
	m2_ir: "Snap Back",
	m2_dil: "Out of World",
	m2_fu: "Superpolar",

	m3_gs: "Temporal Slowdown",
	m3_inf: "Infinitist II",
	m3_eter: "Eternalist II",
	m3_ir: "Throwback",
	m3_dil: "Out of Star",
	m3_fu: "Hellish Dedicated",

	m4_gs: "Stumped Back",
	m4_inf: "Infinitist III",
	m4_eter: "Eternalist III",
	m4_ir: "Reality?",
	m4_dil: "Out of Galaxy",
	m4_fu: "Unstoppable",

	m5_gs: "Felt Infinity?",
	m5_inf: "A Large Bite",
	m5_eter: "Almost Everlasting",
	m5_ir: "Step to Freedom",
	m5_dil: "Out of Universe",
	m5_fu: "No Life...",
}

function canGetBadge(x) {
	if (mod.ngmu || mod.ngep || mod.aau || mod.ngm) return

	const ngmX = !mod.ngp && mod.ngmX
	const ngp3 = mod.ngp3 && (mod.ngud == 0 || mod.ngud == 3) && !(mod.ngumu || mod.nguep) && mod.ngp < 2

	let data = x.split("_")
	if (!ngp3) {
		if (data[1] == "fu") return
		if (data[0] == "p3") return
	}
	if (data[0] == "sp" && (!ngp3 || mod.ngud != 3)) return
	if (data[1] == "ir") return
	if (data[0][0] == "m") return ngmX >= data[0][1]
	if (x == "tgr") return ngp3 && !mod.ngp
	return true
}

function getBadgeReq(x) {
	if (x == "tgr") return "Beat NG+3 without NG+ features and buffs."

	let data = x.split("_")
	let req = BADGE_FRAG[data[1]]
	let mod = BADGE_FRAG[data[0]]
	return `${req} in ${mod}`
}

//Obtaining
function getBadge(x, tier, time) {
	meta.save.badges[x] = {
		tier: tier,
		best: time,
		time: player.lastUpdate
	}
	meta.mustSave = true
	$.notify("BADGE GOT! " + (BADGE_TITLE[x] ? BADGE_TITLE[x] + (tier ? "" : " [buffed]") + " in " + timeDisplay(time) + " " : "") + "(" + getBadgeReq(x) + ")", "success")
}

function hasBadge(x) {
	return meta.save.badges[x] !== undefined
}

function onObtainBadgeCheck(x) {
	if (hasBadge(x) && meta.save.badges[x].best <= player.totalTimePlayed) return
	if (!canGetBadge(x)) return
	getBadge(x, 1, player.totalTimePlayed)
}

function obtainBadges() {
	for (var i = 2; i <= mod.ngmX; i++) {
		if (player.galacticSacrifice.times) onObtainBadgeCheck("m"+i+"_gs")
		if (player.infinitied) onObtainBadgeCheck("m"+i+"_inf")
		if (player.eternities) onObtainBadgeCheck("m"+i+"_eter")
		if (player.dilation.active) onObtainBadgeCheck("m"+i+"_dil")
	}

	if (mod.ngp3) {
		if (quantumed) onObtainBadgeCheck("p3_qu")
		if (hasMasteryStudy("d10")) onObtainBadgeCheck("p3_ant")
		if (ghostified) onObtainBadgeCheck("p3_fu")
		if (ghSave?.wzb.unl) onObtainBadgeCheck("p3_bl")
	}
	if (mod.ngud == 3) {
		if (quantumed) onObtainBadgeCheck("sp_qu")
		if (hasMasteryStudy("d10")) onObtainBadgeCheck("sp_ant")
		if (ghostified) onObtainBadgeCheck("sp_fu")
	}
}

//Tiers are determined on progression. You'll get Red Tier if you obtain it with buffs.
function getBadgeTier(x) {
	let data = x.split("_")
	return (x == "tgr") ? 2 :
		(x == "sp_fu" || x == "m4_ir" || (x[0] == "m" && (data[1] == "dil" || data[1] == "fu"))) ? 1 :
		0
}

//Data & HTML
function setupBadges() {
	let html = ""
	for (var set of Object.values(BADGE_LOOKUP)) {
		let list = set.generate()
		BADGES = BADGES.concat()

		let len = set.data.length
		html += "<table style='margin: auto'><tr>"
		for (var [i, badge] of Object.entries(list)) {
			html += `<td>
				<div
					style="background-image: url(images/placeholder.png)"
					id="badge_${badge}"
				>${BADGE_TITLE[badge] || getBadgeReq(badge)}</div>
			</td>`
			if (i % len == len - 1) html += "</tr><tr>"
		}
		html += "</tr><table>"

		BADGES = BADGES.concat(list)
	}
	el("badges_div").innerHTML = html
}

function updateBadges() {
	for (let id of BADGES) {
		let has = hasBadge(id)
		let can = canGetBadge(id)
		let tier = ['', 'gold', 'diamond'][getBadgeTier(id)]
		let title = BADGE_TITLE[id]
		el("badge_"+id).className = 'achievement ' + (can ? tier : 'cant') + ' achievement' + (has ? "unlocked" : "hidden")
		el("badge_"+id).setAttribute('ach-tooltip', (has ? 'Obtained in ' + timeDisplay(meta.save.badges[id].best) + '!' : can ? 'Unobtained' : 'Unobtainable') + (title ? ` (${getBadgeReq(id)})` : ''))
	}
}
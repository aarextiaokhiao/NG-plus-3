// Gathered from NG+3R v0.7 - Fluctuate
// Feature Notifications
const NGP3_FEATURES = {
	start: {
		name: "Start",
		met: _ => true
	},
	md: {
		name: "Meta Dimensions",
		tab() {
			showTab("dimensions")
			showDimTab("metadimensions")
		},

		met: _ => hasDilStudy(6),
		req: _ => 1e24,
		req_res: _ => player.dilation.dilatedTime,
		req_log: true,
		req_disp: (amt, req) => `${shortenDimensions(amt)} / ${shortenDimensions(req)} TT study`
	},
	ms: {
		name: "Mastery Studies",
		tab() {
			showTab("eternitystore")
			showEternityTab("masterystudies")
		},

		met: _ => mod.ngp3 && player.dilation.upgrades.includes("ngpp6"),
		req: _ => 1e100,
		req_res: _ => player.timestudy.theorem,
		req_log: true,
		req_disp: (amt, req) => `${shorten(amt)} / ${shorten(req)} DT upgrade`
	},
	qu: {
		name: "Quantum",
		tab() {
			showTab("quantumtab")
		},

		met: _ => (quantumed && isQuantumReached()) || bigRipped(),
		req: _ => inAnyQC() ? getQCGoal() : getQuantumReq(),
		req_res: _ => inAnyQC() ? player.money : player.meta.bestAntimatter,
		req_log: true,
		req_disp: (amt, req) => inAnyQC() ? `${shorten(amt)} / ${shorten(req)} antimatter` : `${shorten(amt)} / ${shorten(req)} meta-antimatter (+EC14 completion)`
	},
	pos: {
		name: "Positrons",
		tab() {
			showTab("quantumtab")
			showQuantumTab('positrons')
		},

		met: _ => hasMasteryStudy("d7"),
		req: _ => 50,
		req_res: _ => quantumWorth,
		req_disp: (amt, req) => `${shortenDimensions(amt)} / ${shortenDimensions(req)} net Quarks`
	},
	qc: {
		name: "Quantum Challenges",
		tab() {
			showTab("challenges")
			showChallengesTab("quantumchallenges")
		},

		met: _ => hasMasteryStudy("d8"),
		req: _ => 16750,
		req_res: _ => quSave.electrons.amount,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} Positrons`
	},
	pc: {
		name: "Paired Challenges",
		tab() {
			showTab("challenges")
			showChallengesTab("pChalls")
		},

		met: _ => hasMasteryStudy("d9"),
		req: _ => 8,
		req_res: _ => Object.keys(quSave.challenges).length,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} QC Completions`
	},
	ant: {
		name: "Duplicants",
		tab() {
			showTab("duplicants")
		},

		met: _ => hasMasteryStudy("d10"),
		req: _ => 4,
		req_res: _ => quSave.pairedChallenges.completed,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} PC Completions`
	},
	ed: {
		name: "Emperor Dimensions",
		tab() {
			teleportToEDs()
		},

		met: _ => hasMasteryStudy("d11"),
		req: _ => 10,
		req_res: _ => EDsave[1].perm,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} worker ants`
	},
	nf: {
		name: "Nanofield",
		tab() {
			showTab("duplicants")
			showAntTab('nanofield')
		},

		met: _ => hasMasteryStudy("d12"),
		req: _ => 10,
		req_res: _ => EDsave[8].perm,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} of 8th Emperor Dimensions to unlock Emperor Dimensions.`
	},
	decay: {
		name: "Decay",
		tab() {
			showTab("quantumtab")
			showQuantumTab('tod')
		},

		met: _ => hasMasteryStudy("d13"),
		req: _ => 16,
		req_res: _ => nfSave.rewards,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} Nanorewards`
	},
	br: {
		name: "Big Rip",
		tab() {
			showTab("quantumtab")
			showQuantumTab('bigrip')

			el("welcome").style.display = "flex"
			el("welcomeMessage").innerHTML = "<h1>Your journey is not over...</h1>Anyways, welcome to NG+4, originally by Soul147! You have reached the NG+4 checkpoint. However, many features remain for you to dominate."
		},

		met: _ => hasMasteryStudy("d14"),
		req: _ => 24,
		req_res: _ => tmp.qu.chal.pc_comp,
		req_disp: (amt, req) => `${getFullExpansion(amt)} / ${getFullExpansion(req)} PC combinations`
	},
	be: {
		name: "Break Eternity",
		tab() {
			showTab("eternitystore")
			showEternityTab('eternityupgrades')
		},

		met: _ => beSave.unlocked,
		req: _ => E("1e100"),
		req_res: _ => bigRipped() ? player.eternityPoints : 0,
		req_log: true,
		req_disp: (amt, req) => `Get ${shorten(amt)} / ${shorten(req)} Eternity Points while Big Ripped`
	},
	fu: {
		name: "Fundament",
		tab() {
			showTab("ghostify")
		},

		met: _ => (!bigRipped() || isQuantumReached()) && ghostified,
		req: _ => getQCIdGoal([6,8],true),
		req_res: _ => bigRipped() ? player.money : 0,
		req_log: true,
		req_disp: (amt, req) => `${shorten(amt)} / ${shorten(req)} antimatter while Big Ripped`
	},
	ph: {
		name: "Photons",
		tab() {
			showTab("ghostify")
			showGhostifyTab('gphtab')
		},

		met: _ => PHOTON.unlocked(),
		req: _ => pow10(1.9e9),
		req_res: _ => bigRipped() ? player.money : 0,
		req_log: true,
		req_disp: (amt, req) => `${shorten(amt)} / ${shorten(req)} antimatter while Big Ripped`
	},
	bl: {
		name: "Bosonic Lab",
		tab() {
			showTab("bosonic_lab")
		},

		met: _ => LAB.unlocked(),
		req: _ => 15,
		req_res: _ => PHOTON.totalEmissions(),
		req_disp: (amt, req) => `${shorten(amt)} / ${shorten(req)} Light Emissions`
	},
	hb: {
		name: "Higgs",
		tab() {
			showTab("bosonic_lab")
		},

		met: _ => false,
		req: _ => 1e7,
		req_res: _ => blSave.best_bosons,
		req_log: true,
		req_disp: (amt, req) => `???`
	}
}
const NGP3_FEATURE_LEN = Object.keys(NGP3_FEATURES).length

function ngp3_feature_notify(k) {
	NGP3_FEATURES[k].tab()
	$.notify("Congratulations! You unlocked " + NGP3_FEATURES[k].name + "!", "success")

	el("ngp3_feature_ani").style.display = ""
	el("ngp3_feature_ani_4").textContent = "You've unlocked " + NGP3_FEATURES[k].name + "!"
	setTimeout(function() {
		el("ngp3_feature_ani_1").style.background = "transparent"
		el("ngp3_feature_ani_2a").style.background = "transparent"
		el("ngp3_feature_ani_2a").style.left = "0"
		el("ngp3_feature_ani_2a").style.top = "0"
		el("ngp3_feature_ani_2a").style.width = "100%"
		el("ngp3_feature_ani_2a").style.height = "100%"
		el("ngp3_feature_ani_2b").style.background = "transparent"
		el("ngp3_feature_ani_2b").style.left = "0"
		el("ngp3_feature_ani_2b").style.top = "0"
		el("ngp3_feature_ani_2b").style.width = "100%"
		el("ngp3_feature_ani_2b").style.height = "100%"
	}, 100)

	setTimeout(function() {
		el("ngp3_feature_ani").style.opacity = 0
	}, 3500)
	setTimeout(function() {
		el("ngp3_feature_ani").style.display = "none"
		el("ngp3_feature_ani").style.opacity = 1
		el("ngp3_feature_ani_1").style.background = "white"
		el("ngp3_feature_ani_2a").style.background = "#7fff00"
		el("ngp3_feature_ani_2a").style.left = "50%"
		el("ngp3_feature_ani_2a").style.top = "50%"
		el("ngp3_feature_ani_2a").style.width = "0"
		el("ngp3_feature_ani_2a").style.height = "0"
		el("ngp3_feature_ani_2b").style.background = "#00ffff"
		el("ngp3_feature_ani_2b").style.left = "50%"
		el("ngp3_feature_ani_2b").style.top = "50%"
		el("ngp3_feature_ani_2b").style.width = "0"
		el("ngp3_feature_ani_2b").style.height = "0"
	}, 4000)
}

function updateNGP3Progress() {
	let data = Object.values(NGP3_FEATURES)
	while (NGP3_FEATURE_LEN > tmp.progress.reached - 1 && data[tmp.progress.reached + 1].met()) tmp.progress.reached++
	while (tmp.progress.max > tmp.progress.reached && !data[tmp.progress.max].met()) tmp.progress.max--
}

function doNGP3ProgressBar() {
	let names = Object.keys(NGP3_FEATURES)
	let data = Object.values(NGP3_FEATURES)

	if (NGP3_FEATURE_LEN == tmp.progress.reached - 1) {
		el("progressbar").style.width = "100%"
		el("progresspercent").textContent = "All features unlocked!"
		el("progress").setAttribute('ach-tooltip', `All features unlocked!`)
	} else {
		data = data[tmp.progress.reached + 1]
		let amt = E(data.req_res()) 
		let req = E(data.req())

		var p = Math.min((data.req_log ? amt.max(1).log(req) : amt.div(req).toNumber()) * 100, 100).toFixed(2) + "%"
		el("progressbar").style.width = p
		el("progresspercent").textContent = p
		el("progress").setAttribute('ach-tooltip', `${data.name}: ${data.req_disp(amt, req)} (${tmp.progress.reached + 1} / ${NGP3_FEATURE_LEN})`)
	}
}

/*function setupNGP3ProgressTab() {
	let html = ""
	for (let i = 0; i < NGP3_FEATURE_LEN; i++) {
		html += `<td><div class='autoBuyerDiv' id='ngp3_progress_${i}'>
			<h2>${Object.values(NGP3_FEATURES)[i].name}</h2>
		</div></td>`
		if (i % 4 == 3) html += "</tr><tr>"
	}
	el("ngp3_progress").innerHTML = html
}

function updateNGP3ProgressTab() {
	el("ngp3_progress_div").style.display = mod.ngp3 ? "" : "none"
	if (!mod.ngp3) return

	for (let i = 0; i < NGP3_FEATURE_LEN; i++) {
		el("ngp3_progress_"+i).style.display = i <= tmp.progress.max + 1 ? "block" : ""
		el("ngp3_progress_"+i).className = i <= tmp.progress.max ? "autoBuyerDiv on" : "autoBuyerDiv"
	}
}*/
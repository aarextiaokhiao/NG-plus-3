const REDISCOVER = {
	data: [
		{
			to: "Meta Dimensions",
			unl: _ => true,
			goal: _ => hasDilStudy(6),
			preload() {
			},
		}, {
			to: "Mastery Studies",
			unl: _ => hasBadge("p3_qu"),
			goal: _ => player.dilation.upgrades.includes("ngpp6"),
			preload() {
				for (var i = 1; i <= 6; i++) player.eternityUpgrades.push(i)
				for (var i = 2; i <= 6; i++) player.dilation.studies.push(i)
				for (var i = 4; i <= 10; i++) player.dilation.upgrades.push(i)
				for (var i = 1; i <= 2; i++) player.dilation.upgrades.push("ngpp"+i)
				player.dilation.dilatedTime = E(1e40)
			},
		}, {
			to: "Quantum",
			unl: _ => hasBadge("p3_qu"),
			goal: _ => quantumed,
			preload() {
				REDISCOVER.data[1].preload()
				for (var i = 3; i <= 6; i++) player.dilation.upgrades.push("ngpp"+i)
				player.dilation.dilatedTime = E(1e100)
				player.meta.bestAntimatter = E(Number.MAX_VALUE)
			},
		}, {
			to: "Duplicants",
			unl: _ => hasBadge("p3_ant"),
			goal: _ => hasMasteryStudy("d10"),
			preload() {
				quSave.times = 1
				quantumed = true
			},
		}, {
			to: "Fundament",
			unl: _ => hasBadge("p3_fu"),
			goal: _ => ghostified,
			preload() {
				REDISCOVER.data[2].preload()
				REDISCOVER.data[3].preload()
				player.timestudy.theorem = 1e80

				quSave.best = 100
				for (var i = 7; i <= 10; i++) player.masterystudies.push("d"+i)

				speedrunMilestones = 28
				notifyId = 28
			},
		}, {
			to: "Bosonic Lab",
			unl: _ => hasBadge("p3_bl"),
			goal: _ => LAB.unlocked(),
			preload() {
				player.ghostify = { times: 1 }
				loadFundament(true)
			},
		}
		/*, {
			to: "End",
			unl: _ => false,
			goal: _ => false,
			preload() {
				player.masterystudies.push("d13")
				beSave.unlocked = true
				for (var x = 1; x <= 8; x++) beSave.upgrades.push(x)

				ghSave.times = 20
				ghSave.low = 0
				ghSave.neutrinos.boosts = 12
				for (var x = 1; x <= 16; x++) ghSave.neutrinos.upgrades.push(x)
				ghSave.photons.unl = true
				blSave.unl = true
			},
		}*/
	],
	in: _ => meta.save.current == "rediscover",
	start(x) {
		if (meta.save.rediscover.in !== undefined && !confirm("Doing this will overwrite your Rediscovery run! If you wish to continue, click 'Continue.' Are you really sure?")) return

		save_game(true)
		set_save("rediscover")

		meta.save.rediscover.in = x
		meta.save.current = "rediscover"
		meta.mustSave = true
		load_game(true, "start")
		//Preloading is moved to load_functions.js to fix "rediscovery wiping" bug.

		$.notify("Rediscovery started!")
		el("welcomeMessage").innerHTML = "Welcome to Rediscovery! On the bottom-right, you'll see statistics about this Rediscovery. Get the goal to win!"
	},
	continue() {
		if (meta.save.rediscover.in != undefined) change_save("rediscover")
	},
	restart() {
		if (meta.save.rediscover.in != undefined) REDISCOVER.start(meta.save.rediscover.in)
	},
	exit() {
		if (meta.save.rediscover.in != undefined) change_save_placement(0)
	},

	open() {
		closeToolTip()
		el("rediscover_menu").style.display = "block"
	},
	setup() {
		let html = ""
		let from = "Start"
		for (var [i, seg] of Object.entries(this.data)) {
			html += `<tr id='rediscover_${i}'>
				<td style='width: 200px'><button class='storebtn' onclick='REDISCOVER.start(${i})'>${from} →<br>${seg.to}</button></td>
				<td style='width: 390px; text-align: center' id='rediscover_best_${i}'></td>
			</tr>`
			from = seg.to
		}
		el('rediscover_sections').innerHTML = html
	},
	update() {
		for (var [i, seg] of Object.entries(this.data)) {
			el("rediscover_" + i).style.display = seg.unl() ? "" : "none"
			el("rediscover_best_" + i).innerHTML = meta.save.rediscover.best[i] ? "Best: " + timeDisplayShort(meta.save.rediscover.best[i]) : "Not completed yet"
		}

		let segData = this.data[meta.save.rediscover.in]
		if (this.in() && segData.goal()) {
			$.notify("Rediscovery completed! Time: " + timeDisplayShort(player.totalTimePlayed))
			meta.save.rediscover.best[meta.save.rediscover.in] = Math.min(player.totalTimePlayed, meta.save.rediscover.best[meta.save.rediscover.in] || 1/0)
			this.exit()
			delete meta.save.rediscover.in
		}

		el("rediscover_btn").innerHTML = "<p style='font-size: 20px'>Rediscover</p>" + (segData ? `(${segData.to})` : "(Redo a NG+3 segment)")
		el("rediscover_info").textContent = segData ? `Ongoing Rediscovery! (${segData.to}) Click 'Continue' to continue.` : "Click a segment to start a Rediscovery."
		el('rediscover_options').style.display = segData ? "" : "none"
		el('rediscover_stats').innerHTML = this.in() ? `Goal: ${segData.to}<br>${timeDisplayShort(player.totalTimePlayed)}` : ``
	}
}
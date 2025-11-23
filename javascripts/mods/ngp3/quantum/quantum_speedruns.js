//v1.79
let speedrunMilestones = 0
let SM_LIST = [
	//Row 1
	{
		req: 2*86400, // in seconds
		desc: "Start with 100 Eternities."
	},
	{
		req: 1.5*86400,
		desc: "Gain 5x more Eternities."
	},
	{
		req: 86400,
		desc: "Automate Time Theorems."
	},
	{
		req: 18*3600,
		desc: "Keep Time Studies on completing an Eternity Challenge up to 4th completion."
	},
	{
		req: 12*3600,
		desc: "Passive / active studies have no downsides."
	},
	{
		req: 8*3600,
		desc: "Unlock Dilation option in Auto-Eternity."
	},
	{
		req: 6*3600,
		desc: "Keep Eternity Upgrades."
	},
	{
		req: 4*3600,
		desc: "All Meta Dimensions are available."
	},

	//Row 2
	{
		req: 3*3600,
		desc: "Keep Time Studies."
	},
	{
		req: 2*3600,
		desc: "Keep Eternity Challenges."
	},
	{
		req: 1.5*3600,
		desc: "Start with Dilation unlocked."
	},
	{
		req: 3600,
		desc: "Automate rebuyable Dilation Upgrades."
	},
	{
		req: 45*60,
		desc: "Start with 8 Time Dimensions unlocked."
	},
	{
		req: 30*60,
		desc: "Start with Meta Dimensions unlocked."
	},
	{
		req: 20*60,
		desc: "Automate Meta Dimensions."
	},
	{
		req: 15*60,
		desc: "Keep non-rebuyable Dilation Upgrades."
	},

	//Row 3
	{
		req: 10*60,
		desc: "Keep Mastery Studies."
	},
	{
		req: 7.5*60,
		desc: "Keep Discharge."
	},
	{
		req: 5*60,
		desc: "Keep Replicantis on Replicated Galaxies."
	},
	{
		req: 3*60,
		desc: () => "Start with " + shortenCosts(1e100) + " Dilated Time and Rebuyable Dilation Upgrades don't spend anything."
	},
	{
		req: 2*60,
		desc: "Automate Rebuyable Dilation Upgrades and Meta Dimension 3x faster."
	},
	{
		req: 1.5*60,
		desc: "Dilated Time only resets on Quantum."
	},
	{
		req: 60,
		desc: "Automate Quantum."
	},
	{
		req: 30,
		desc: "Keep Replicantis on Eternity."
	},

	//Row 4
	{
		req: 20,
		desc: "Unlock the manual option for the Eternity autobuyer."
	},
	{
		req: 15,
		desc: "The rebuyable Dilation upgrade autobuyer can buy the maximum upgrades possible."
	},
	{
		req: 10,
		desc: "You can buy max Meta-Dimension Boosts, and start with 4 Meta-Dimension Boosts.",
		togglable: true
	},
	{
		req: 5,
		desc: "Gain banked infinities without Big Crunching, and keep Replicated Galaxies on Big Crunch."
	}
]

function updateSpeedruns(onReset) {
	let oldMilestones = speedrunMilestones
	speedrunMilestones = hasBraveMilestone(1) ? 28 : 0

	if (!mod.ngp3) return
	for (let i = speedrunMilestones; i < 28; i++) {
        if (quSave.best <= SM_LIST[i].req * 10) speedrunMilestones++
    }

	if (onReset && speedrunMilestones > oldMilestones) {
		let sm = SM_LIST[speedrunMilestones - 1]
		$.notify("You quantumed in under "+timeDisplayShort(sm.req * 10)+"!", "success")
		setTimeout(() => $.notify(typeof sm.desc == "function" ? sm.desc() : sm.desc), 2e3)
	}

	for (let i = 1; i <= 28; i++) {
		let sm = SM_LIST[i - 1]
		let elm = el("speedrunMilestone"+i)
		elm.innerHTML = timeDisplayShort(sm.req * 10)
		elm.setAttribute("ach-tooltip", "Reward: " + (typeof sm.desc == "function" ? sm.desc() : sm.desc))
		elm.className = "achievement achievement" + (speedrunMilestones >= i ? "un" : "") + "locked"
	}
	for (let i = 1; i <= 4; i++) el("speedrunRow"+i).className = speedrunMilestones < (i == 4 ? 28 : i * 8) ? "" : "completedrow"

	let removeMaxAll = false
	if (speedrunMilestones >= 15) {
		for (let d = 1; d < 9; d++) {
			if (player.autoEterOptions["md" + d]) {
				if (d > 7) removeMaxAll = true
			} else break
		}
	}
	el("metaMaxAll").style.display = removeMaxAll ? "none" : ""

	if (speedrunMilestones >= 26) el('rebuyupgmax').style.display = "none"
}

function isRewardEnabled(id) {
	return speedrunMilestones >= id && !quSave.disabledRewards[id]
}

function disableReward(id) {
	quSave.disabledRewards[id] = !quSave.disabledRewards[id]
	el("reward" + id + "disable").textContent = timeDisplayShort(SM_LIST[id-1].req * 10) + " reward: " + (quSave.disabledRewards[id] ? "OFF" : "ON")
}

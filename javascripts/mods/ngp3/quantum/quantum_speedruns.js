//v1.79
let speedrunMilestones = 0
let SM_REQ = [null, 43200, 32400, 21600, 16200, 10800, 7200, 3600, 3200, 2800, 2400, 2000, 1600, 1200, 800, 400, 300, 240, 210, 180, 150, 120, 90, 60, 30, 20, 15, 10, 5]
function updateSpeedruns(onReset) {
	let oldMilestones = speedrunMilestones
	speedrunMilestones = hasBraveMilestone(1) ? 28 : 0

	if (!mod.ngp3) return
	for (let i = 1; i <= 28; i++) {
        if (quSave.best <= SM_REQ[i] * 10) speedrunMilestones++
    }

	if (onReset && speedrunMilestones > oldMilestones) {
		$.notify("You quantumed in under "+timeDisplay(SM_REQ[speedrunMilestones-1])+"!", "success")
		setTimeout(() => $.notify(el("speedrunMilestone"+speedrunMilestones).getAttribute("ach-tooltip"), "info"), 2e3)
	}

	for (let i = 1; i <= 28; i++) el("speedrunMilestone"+i).className = "achievement achievement" + (speedrunMilestones >= i ? "un" : "") + "locked"
	for (let i = 1; i <= 4; i++) el("speedrunRow"+i).className = speedrunMilestones < (i == 4 ? 28 : i * 8) ? "" : "completedrow"

	if (speedrunMilestones >= 26) el('rebuyupgmax').style.display = "none"
	if (speedrunMilestones >= 28) {
		let removeMaxAll = false
		for (let d = 1; d < 9; d++) {
			if (player.autoEterOptions["md" + d]) {
				if (d > 7) removeMaxAll = true
			} else break
		}
		el("metaMaxAll").style.display = removeMaxAll ? "none" : ""
	}
}

function isRewardEnabled(id) {
	if (!mod.ngp3) return false
	return speedrunMilestones >= id && !quSave.disabledRewards[id]
}

function disableReward(id) {
	quSave.disabledRewards[id] = !quSave.disabledRewards[id]
	el("reward" + id + "disable").textContent = (id > 11 ? "10 seconds" : id > 4 ? "33.3 mins" : (id > 3 ? 4.5 : 6) + " hours") + " reward: " + (quSave.disabledRewards[id] ? "OFF" : "ON")
}

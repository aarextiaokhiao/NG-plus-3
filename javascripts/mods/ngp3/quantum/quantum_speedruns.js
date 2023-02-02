//v1.79
var speedrunMilestonesReached
var speedrunMilestones = [null, 43200, 32400, 21600, 16200, 10800, 7200, 3600, 3200, 2800, 2400, 2000, 1600, 1200, 800, 400, 300, 240, 210, 180, 150, 120, 90, 60, 30, 20, 15, 10, 5]
function updateSpeedruns() {
	speedrunMilestonesReached = 0
	if (!mod.ngp3) return

	if (ghSave.milestones >= 1) speedrunMilestonesReached = 28
	else {
		for (var i = 1; i <= 28; i++) {
			if (quSave.best > speedrunMilestones[i] * 10) break
			speedrunMilestonesReached++
		}
	}

	for (var i = 1; i <= 28; i++) el("speedrunMilestone"+i).className = "achievement achievement" + (speedrunMilestonesReached >= i ? "un" : "") + "locked"
	for (var i = 1; i <= 4; i++) el("speedrunRow"+i).className = speedrunMilestonesReached < (i > 3 ? 28 : i * 8) ? "" : "completedrow"

	if (speedrunMilestonesReached >= 26) el('rebuyupgmax').style.display = "none"
	if (speedrunMilestonesReached >= 28) {
		var removeMaxAll = false
		for (var d = 1; d < 9; d++) {
			if (player.autoEterOptions["md" + d]) {
				if (d > 7) removeMaxAll = true
			} else break
		}
		el("metaMaxAllDiv").style.display = removeMaxAll ? "none" : ""
	}
}

function isRewardEnabled(id) {
	if (!player.masterystudies) return false
	return speedrunMilestonesReached >= id && !quSave.disabledRewards[id]
}

function disableReward(id) {
	quSave.disabledRewards[id] = !quSave.disabledRewards[id]
	el("reward" + id + "disable").textContent = (id > 11 ? "10 seconds" : id > 4 ? "33.3 mins" : (id > 3 ? 4.5 : 6) + " hours") + " reward: " + (quSave.disabledRewards[id] ? "OFF" : "ON")
}

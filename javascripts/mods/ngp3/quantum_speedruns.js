//v1.79
var speedrunMilestonesReached
var speedrunMilestones = [null, 43200, 32400, 21600, 16200, 10800, 7200, 3600, 3200, 2800, 2400, 2000, 1600, 1200, 800, 400, 300, 240, 210, 180, 150, 120, 90, 60, 30, 20, 15, 10, 5]
function updateSpeedruns() {
	speedrunMilestonesReached = 0
	if (tmp.ngp3) {
		if (player.ghostify.milestones >= 1) speedrunMilestonesReached = 28
		else {
			for (var i = 1; i <= 28; i++) {
				if (tmp.qu.best > speedrunMilestones[i] * 10) break
				speedrunMilestonesReached++
			}
		}
		document.getElementById('sacrificeAuto').style.display = speedrunMilestonesReached >= 25 ? "" : "none"
		for (var i = 1; i <= 28; i++) document.getElementById("speedrunMilestone"+i).className = "achievement achievement" + (speedrunMilestonesReached >= i ? "un" : "") + "locked"
		for (var i = 1; i <= 4; i++) document.getElementById("speedrunRow"+i).className = speedrunMilestonesReached < ( i > 3 ? 28 : i * 8) ? "" : "completedrow"
		if (speedrunMilestonesReached >= 24) giveAchievement("And the winner is...")
		if (speedrunMilestonesReached >= 26) document.getElementById('rebuyupgmax').style.display = "none"
		if (speedrunMilestonesReached >= 28) {
			giveAchievement("Special Relativity")
			var removeMaxAll = false
			for (var d = 1; d < 9; d++) {
				if (player.autoEterOptions["md" + d]) {
					if (d > 7) removeMaxAll = true
				} else break
			}
			document.getElementById("metaMaxAllDiv").style.display = removeMaxAll ? "none" : ""
		}
		if (tmp.qu.best <= 10) giveAchievement("Quantum doesn't take so long")
	}
}

function isRewardEnabled(id) {
	if (!player.masterystudies) return false
	return speedrunMilestonesReached >= id && !tmp.qu.disabledRewards[id]
}

function disableReward(id) {
	tmp.qu.disabledRewards[id] = !tmp.qu.disabledRewards[id]
	document.getElementById("reward" + id + "disable").textContent = (id > 11 ? "10 seconds" : id > 4 ? "33.3 mins" : (id > 3 ? 4.5 : 6) + " hours") + " reward: " + (tmp.qu.disabledRewards[id] ? "OFF" : "ON")
}

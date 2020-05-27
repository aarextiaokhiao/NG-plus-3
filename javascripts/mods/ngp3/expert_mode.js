function checkForExpertMode() {
	if (!metaSave.ngp4) return
	if (metaSave.ngp3ex) return
	console.log("EXPERT MODE UNLOCKED!")
	metaSave.ngp3ex = true
	if (document.getElementById("welcome").style.display != "flex") document.getElementById("welcome").style.display = "flex"
	else player.aarexModifications.popUpId = ""
	document.getElementById("welcomeMessage").innerHTML = "Hello, player. I recently seem that you big ripped one of your universes. In the deep depths of all Big Rips, a space crystal is about to impend you with more challenges. You unlocked NG+3 Expert Mode!"
	localStorage.setItem(metaSaveId,btoa(JSON.stringify(metaSave)))
}
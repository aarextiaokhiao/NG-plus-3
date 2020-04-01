let af2020 = {
	init: function() {
		this.initiated = true
		if (this.newsBroken()) this.onNewsBreak()
		else document.getElementById("breakNews").textContent = "BREAK THE NEWS"
	},
	initiated: false,
	newsBreak: function() {
		if (!this.initiated || this.newsBroken() || !confirm("Are you sure? You won't be able to read the news anymore!")) return
		metaSave.af2020 = true
		localStorage.setItem(metaSaveId, btoa(JSON.stringify(metaSave)))
		this.onNewsBreak()
	},
	newsBroken: function() {
		return metaSave.af2020
	},
	onNewsBreak: function() {
		if (!this.initiated) return
		$.notify("Happy April Fools 2020! ~ Aarex")
		document.getElementById("breakNews").textContent = "Happy April Fools 2020! ~ Aarex"
		this.onSaveLoad()
	},
	onSaveLoad: function() {
		if (!this.initiated || !this.newsBroken()) return
		if (player.options.newsHidden) document.getElementById("newsbtn").onclick(true)
		if (player.options.secrets && player.options.secrets.ghostlyNews) toggleGhostlyNews(true)
		document.getElementById("newsbtn").textContent = "You just broke the news..."
		document.getElementById("ghostlynewsbtn").textContent = "You just broke the news..."
	},
	messages: ["Aarex pranked players a year ago. Today, he did it again!",
	"After somebody tested their health, they just got an unknown virus because his test results are positive!",
	"A person has died due to an unknown virus because there is a lack of anti-toilet paper!",
	"There are now over 1.79e308 cases in our antimatter universe!",
	"We are now in crisis due to an economic crash on antimatter sanitizers!",
	"NG+3 development has stopped because of an unknown virus!",
	"There is an possibility that in next week, we will reach e309 cases!",
	"Every single Ghost can be infected by an unknown virus!",
	"A quark has died due to an unknown virus! Was it made of matter or dark matter?"],
}
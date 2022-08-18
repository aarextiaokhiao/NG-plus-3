var player = {};

//Do not remove.
var betaId = "P"
var prefix = betaId + "ds"
var savePrefix = prefix + "AM_"
var metaSaveId = betaId + "AD_aarexModifications"

function changestate(n) {
    var classes = el('div'+n).classList
    if(classes.contains('hidden')){
		classes.remove('hidden');
	    classes.add('shown');
	}
    else{
		classes.remove('shown');
		classes.add('hidden');
	}
}

if (localStorage.getItem("howToSpoilers") !== null) var spoilers = parseInt(localStorage.getItem("howToSpoilers"))
else var spoilers = 0

if (spoilers === 0) el("showspoilersbtn").innerHTML = "Show spoilers"
else el("showspoilersbtn").innerHTML= "Avoid spoilers"

function save() {
	localStorage.setItem("howToSpoilers", spoilers)
}

function get_save(id) {
    try {
        var dimensionSave = localStorage.getItem(btoa(savePrefix+id))
        if (dimensionSave !== null) dimensionSave = JSON.parse(atob(dimensionSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
        return dimensionSave
    } catch(e) { console.log("An error happened"); }
}

function load_game() {
	metaSave = localStorage.getItem(metaSaveId)
	if (metaSave == null) metaSave = {}
	else metaSave = JSON.parse(atob(metaSave))
	if (metaSave.current == undefined) {
		metaSave.current = 1
		metaSave.saveOrder = [1]
	}
	player = get_save(metaSave.current)
	ghSave = player.ghostify
}

document.getElementById("importbtn").onclick = function () {
    var save_data = prompt("Input your save.");
	save_data = JSON.parse(atob(save_data), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
	if (!save_data) {
		alert('could not load the save..');
		return;
	}
	player = save_data;
	updateSpoilers()
};

//To avoid errors
function hasAch(x) {
	return player.achievements.includes(x)
}

//Spoilers
function showspoilers() {
	if (spoilers === 0) {
		if (!confirm("This will reveal the content you haven't got! Are you sure?")) return
		spoilers = 1;
		el("showspoilersbtn").innerHTML= "Avoid spoilers"
	} else {
		spoilers = 0;
		el("showspoilersbtn").innerHTML = "Show spoilers"
	}
	save()
	updateSpoilers();
}

function updateSpoilers() {
	var displayed = spoilers;
	var max = 0
	document.getElementById("ng3pguide").style.display=player.masterystudies||spoilers?"":"none"
	for (i=40; i>0; i--) {
		if (i != 7) {
			if (!displayed) {
				if (i < 5) displayed = 1
				else if (player) {
					if (i == 5 && player.resets > 4) displayed = 1
					if (i == 9 && hasAch("r21")) displayed = 1
					if (i == 10 && hasAch("r41")) displayed = 1
					if (i == 11 && player.infDimensionsUnlocked[0]) displayed = 1
					if (i == 12 && player.postChallUnlocked > 0) displayed = 1
					if (i == 13 && player.replicanti.unlocked) displayed = 1
					if (i == 17 && hasAch("r96")) displayed = 1
					if (i == 18 && (player.eternityChallUnlocked > 0 || player.eternityChalls.eterc1)) displayed = 1
					if (i == 19 && player.dilation.studies.includes(1)) displayed = 1
					if (i == 20 && player.dilation.studies.includes(6)) displayed = 1
					if (i == 22 && player.quantum) if (player.quantum.times>0) displayed = 1
					if (player.masterystudies) {
						if (i == 21 && player.dilation.upgrades.includes("ngpp4")) displayed = 1
						if (i == 23 && player.quantum) if (player.quantum.times > 0) displayed = 1
						if (i >= 24 && i <= 31 && player.masterystudies.includes("d"+(i-17))) displayed = 1
					}
					if (ghSave) {
						if (i == 35 && ghSave.times > 0) displayed = 1
						if (i == 36 && ghSave.ghostlyPhotons && ghSave.ghostlyPhotons.unl) displayed = 1
						if (i == 37 && ghSave.wzb && ghSave.wzb.unl) displayed = 1
						if (i == 38 && ghSave.hb && ghSave.hb.higgs) displayed = 1
						if (i == 39 && ghSave.gravitons && ghSave.gravitons.unl) displayed = 1
						if (i == 40 && ghSave.breakDilation && ghSave.breakDilation.unl) displayed = 1
					}
				}
			}
			if (displayed) {
				max = Math.max(i, max)
			}
			if (max >= i + 5 && !spoilers) displayed = 0
			if (displayed) {
				if (i == 22) {
					var msg = "When you reach "
					if (player.masterystudies) msg += "9.32e446 meta-antimatter and completed EC14 for the first time"
					else msg += "infinity meta-antimatter"
					msg += ", you will able to go quantum. Quantum will reset everything eternity resets, and also time studies, eternity challenges, dilation, "+(player.masterystudies?"meta dimensions, and mastery studies":"and meta dimensions (except your best meta-antimatter)")+". You will gain a quark and unlock various upgrades."
					if (player.masterystudies) msg += "<br><br>You will also unlock speedrun milestones where you must do fast quantums to get your QoL content rewards on eternity, and even quantum autobuyer."
					document.getElementById("div22").innerHTML = msg
				}
			} else document.getElementById("div"+i).className = "hidden";
			document.getElementById("div"+i+"btn").style.display = displayed ? "block" : "none";
			document.getElementById("div"+i+"hr").style.display = displayed ? "block" : "none";
		}
	}
}

//Loading
load_game();
save()
updateSpoilers()
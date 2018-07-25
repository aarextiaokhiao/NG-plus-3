var player = {};

function changestate(n) {
    var classes = document.getElementById('div'+n).classList
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

if (spoilers === 0) document.getElementById("showspoilersbtn").innerHTML = "View: <br> Avoid spoilers"
else document.getElementById("showspoilersbtn").innerHTML= "View: <br> Show spoilers"

function save() {
	localStorage.setItem("howToSpoilers", spoilers)
}

function get_save(id) {
    try {
        var dimensionSave = localStorage.getItem(btoa('dsAM_'+id))
        if (dimensionSave !== null) dimensionSave = JSON.parse(atob(dimensionSave, function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
        return dimensionSave
    } catch(e) { console.log("Fuck IE"); }
}

function load_game() {
	metaSave = localStorage.getItem('AD_aarexModifications')
	if (metaSave == null) metaSave = {}
	else metaSave = JSON.parse(atob(metaSave))
	if (metaSave.current == undefined) {
		metaSave.current = 1
		metaSave.saveOrder = [1]
	}
	player = get_save(metaSave.current)
}

function showspoilers() {
	if (spoilers === 0) {
		spoilers = 1;
		document.getElementById("showspoilersbtn").innerHTML= "View: <br> Show spoilers"
	} else {
		spoilers = 0;
		document.getElementById("showspoilersbtn").innerHTML = "View: <br> Avoid spoilers"
	}
	save()
	updateSpoilers();
}

function updateSpoilers() {
	var displayed = spoilers;
	for (i=19; i>0; i--) {
		if (i != 7) {
			if (!displayed) {
				if (i < 5) displayed = 1
				else if (player) {
					if (i == 5 && player.resets > 4) displayed = 1
					if (i == 9 && player.achievements.includes("r21")) displayed = 1
					if (i == 10 && player.achievements.includes("r41")) displayed = 1
					if (i == 11 && player.infDimensionsUnlocked[0]) displayed = 1
					if (i == 12 && player.postChallUnlocked > 0) displayed = 1
					if (i == 13 && player.replicanti.unlocked) displayed = 1
					if (i == 17 && player.achievements.includes("r96")) displayed = 1
					if (i == 18 && (player.eternityChallUnlocked > 0 || player.eternityChalls.eterc1)) displayed = 1
					if (i == 19 && player.dilation.studies.includes(1)) displayed = 1
				}
			}
			document.getElementById("div"+i+"btn").style.display = displayed ? "block" : "none";
			document.getElementById("div"+i+"hr").style.display = displayed ? "block" : "none";
		}
	}
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

load_game();
save()
updateSpoilers()

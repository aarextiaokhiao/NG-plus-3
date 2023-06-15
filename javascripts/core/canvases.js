var lastTs = 0;
var goalX = -1;
var goalY = -1;
var particles = {}
var direction = 0;
var velocityX = 0;
var velocityY = 0;

var canvas = el("studyTreeCanvas");
var canvas3 = el("dilationCanvas");
var bhc = el("blackHoleCanvas");
var msc = el("studyTreeCanvas2");
var qkc = el("quarkCanvas");
var ctx = canvas.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var bhctx = bhc.getContext("2d");
var msctx = msc.getContext("2d");
var qkctx = qkc.getContext("2d");

function resizeCanvas() {
	let scrollHeight = document.body.scrollHeight
	let height = Math.max(window.innerHeight, scrollHeight)
	let width = window.innerWidth
	canvas.width = width
	canvas.height = scrollHeight
	canvas3.width = width
	canvas3.height = height
	bhc.width = width
	bhc.height = height
	msc.width = width
	msc.height = scrollHeight
	qkc.width = width
	qkc.height = height
	drawStudyTree();
	drawMasteryTree();
}

function point(x, y, ctz){
	ctz.beginPath();
	ctz.arc(x, y, 2, 0, 2 * Math.PI, true);
	ctz.fill();
}

const ANIMATIONS = {
	gSac: {
		unl: _ => inNGM(2) && (player.galacticSacrifice.times > 0 || infinitied()),
		title: "Galactic Sacrifice"
	},
	bigCrunch: {
		unl: _ => infinitied(),
		title: "Big Crunch"
	},
	quantum: {
		unl: _ => quantumed,
		title: "Quantum"
	},
	ghostify: {
		unl: _ => ghostified,
		title: "Fundament"
	},

	floatingText: {
		unl: _ => true,
		title: "Floating text"
	},
	tachyonParticles: {
		unl: _ => hasAch("r136"),
		title: "Tachyon particles"
	},
	blackHole: {
		unl: _ => mod.ngud && (player.blackhole.unl || quantumed),
		title: "Black hole"
	},
	quarks: {
		unl: _ => quantumed,
		title: "Quarks"
	}
}

function isAnimationOn(x) {
	return player.options.animations[x] ?? true
}

function setupAnimationBtns() {
	var html = ``
	for (let name of Object.keys(ANIMATIONS)) html += `<button id="${name}AnimBtn" class="storebtn" onclick="animationOnOff('${name}')" style="width: 200px; height: 55px; font-size: 15px"></button>`
	el("animationoptionsdiv").innerHTML = html
}

function updateAnimationBtns(onLoad) {
	for (let [name, data] of Object.entries(ANIMATIONS)) {
		el(name+"AnimBtn").style.display = data.unl() ? "inline" : "none"
		if (onLoad) el(name+"AnimBtn").textContent = data.title + ": " + (isAnimationOn(name) ? "ON" : "OFF")
	}
}

function animationOnOff(x) {
	let on = !isAnimationOn(x)
	player.options.animations[x] = on
	el(x+"AnimBtn").textContent = ANIMATIONS[x].title + ": " + (on ? "ON" : "OFF")
}

function drawAnimations(ts){
	if (player.dilation.tachyonParticles.gte(1) && isTabShown("dil") && player.options.animations.tachyonParticles) {
		ctx3.clearRect(0, 0, canvas.width, canvas.height);
		if (player.options.theme == "Aarex's Modifications") ctx3.fillStyle="#e5e5e5";
		else if (player.options.theme == "Dark" || player.options.theme == "Dark Metro") ctx3.fillStyle="#FFF";
		else ctx3.fillStyle="#000";
		for (i=0; i<Math.min(player.dilation.tachyonParticles.e+1,100); i++) {
			if (typeof particles["particle"+i] == "undefined") {
				particles["particle"+i] = {}
				particles["particle"+i].goalX = Math.ceil(Math.random() * canvas3.width);
				particles["particle"+i].goalY = Math.ceil(Math.random() * canvas3.height);
				particles["particle"+i].direction = Math.ceil(Math.random() * 8);
				particles["particle"+i].velocityX = Math.ceil((Math.random() - 0.5) * 25)
				particles["particle"+i].velocityY = Math.ceil((Math.random() - 0.5) * 25)
				if (particles["particle"+i].velocityX < 0) particles["particle"+i].velocityX -= 10
				else particles["particle"+i].velocityX += 10
				if (particles["particle"+i].velocityY < 0) particles["particle"+i].velocityY -= 10
				else particles["particle"+i].velocityY += 10
				}
			goalX = particles["particle"+i].goalX
			goalY = particles["particle"+i].goalY
			if ((goalX > canvas3.width || goalX < 0) || (goalY > canvas3.height || goalY < 0)) {
				particles["particle"+i].goalX = Math.ceil(Math.random() * canvas3.width);
				particles["particle"+i].goalY = Math.ceil(Math.random() * canvas3.height);
				particles["particle"+i].direction = Math.ceil(Math.random() * 8);
				particles["particle"+i].velocityX = Math.ceil((Math.random() - 0.5) * 25)
				particles["particle"+i].velocityY = Math.ceil((Math.random() - 0.5) * 25)
				if (particles["particle"+i].velocityX < 0) particles["particle"+i].velocityX -= 10
				else particles["particle"+i].velocityX += 10
				if (particles["particle"+i].velocityY < 0) particles["particle"+i].velocityY -= 10
				else particles["particle"+i].velocityY += 10
				}
			point(particles["particle"+i].goalX, particles["particle"+i].goalY, ctx3)
			particles["particle"+i].goalX += particles["particle"+i].velocityX
			particles["particle"+i].goalY += particles["particle"+i].velocityY
		}
		delta = (ts - lastTs) / 1000;
		lastTs = ts;
		requestAnimationFrame(drawAnimations);
	}
}

function drawTreeBranch(num1, num2) {
	if (!isTabShown("ts")) return

	var name1 = parseInt(num1);
	var isECName = false;
	var isDilStudyName = false;
	if (num2.includes("ec")) {
		var a = num2.split("c")[1];
		var name2 = parseInt(a.split("u")[0]);
		var isECName = true;
	} else if (num2.includes("dilstudy")) {
		var isDilStudyName = true;
		var name2 = parseInt(num2.split("y")[1]);
	} else {
		var name2 = parseInt(num2)
	}
	var start = el(num1).getBoundingClientRect();
	var end = el(num2).getBoundingClientRect();
	var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	ctx.lineWidth=15;
	ctx.beginPath();
	if ((hasTimeStudy(name1) && hasTimeStudy(name2) && !isECName) || (hasTimeStudy(name1) && (player.eternityChallUnlocked === name2 && isECName)) || (hasDilStudy(name2-1) && (hasDilStudy(name2) && isDilStudyName))) {
		if (name2 == 6 && isDilStudyName && (player.options.theme == "Aarex's Modifications" || player.options.theme == "Aarex's Mods II")) {
			ctx.strokeStyle="#00E5E5";
		} else if (name2 < 20 && isECName) {
			ctx.strokeStyle="#490066";
		} else if (name2 < 20) {
			ctx.strokeStyle="#64DD17";
		} else if (name2 == 71 || name2 == 81 || name2 == 91 || name2 == 101 || name1 == 101) {
			ctx.strokeStyle="#22aa48";
		} else if (name2 == 72 || name2 == 82 || name2 == 92 || name2 == 102 || name1 == 102) {
			ctx.strokeStyle="#B67F33";
		} else if (name2 == 73 || name2 == 83 || name2 == 93 || name2 == 103 || name1 == 103) {
			ctx.strokeStyle="#B241E3";
		} else if (name2 == 121 || name2 == 131 || name2 == 141 || name1 == 141) {
			ctx.strokeStyle="#FF0100";
		} else if (name2 == 122 || name2 == 132 || name2 == 142 || name1 == 142) {
			ctx.strokeStyle="#5E33B6";
		} else if (name2 == 123 || name2 == 133 || name2 == 143 || name1 == 143) {
			ctx.strokeStyle="#0080ff";
		} else {
			ctx.strokeStyle="#000000";
		}
	} else {
		if (name2 == 6 && isDilStudyName && (player.options.theme == "Aarex's Modifications" || player.options.theme == "Aarex's Mods II")) {
			ctx.strokeStyle="#007272";
		} else if (name2 < 20) {
			ctx.strokeStyle="#4b3753";
		} else if (name2 == 71 || name2 == 81 || name2 == 91 || name2 == 101 || name1 == 101) {
			ctx.strokeStyle="#37533f";
		} else if (name2 == 72 || name2 == 82 || name2 == 92 || name2 == 102 || name1 == 102) {
			ctx.strokeStyle="#534737";
		} else if (name2 == 73 || name2 == 83 || name2 == 93 || name2 == 103 || name1 == 103) {
			ctx.strokeStyle="#4a3753";
		} else if (name2 == 121 || name2 == 131 || name2 == 141 || name1 == 141) {
			ctx.strokeStyle="#533737";
		} else if (name2 == 122 || name2 == 132 || name2 == 142 || name1 == 142) {
			ctx.strokeStyle="#403753";
		} else if (name2 == 123 || name2 == 133 || name2 == 143 || name1 == 143) {
			ctx.strokeStyle="#374553";
		} else {
			ctx.strokeStyle="#444";
		}
	}
	if (num2 == "secretstudy") ctx.strokeStyle="#000000";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawStudyHeader(ctx, id, disp) {
	if (!shiftDown) return

	var start = el(id).getBoundingClientRect();
	var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.font = "15px Typewriter";
	ctx.strokeText(disp, x1 - start.width / 2, y1 - start.height / 2 - 1);
	ctx.fillText(disp, x1 - start.width / 2, y1 - start.height / 2 - 1);
}

function drawStudyTree() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (el("secretstudy").style.opacity != "0") drawTreeBranch("11", "secretstudy");
	drawTreeBranch("11", "21");
	drawTreeBranch("11", "22");
	drawTreeBranch("21", "31");
	drawTreeBranch("21", "33");
	drawTreeBranch("22", "32");
	drawTreeBranch("31", "41");
	drawTreeBranch("32", "42");
	drawTreeBranch("41", "51");
	drawTreeBranch("42", "51");
	drawTreeBranch("51", "61");
	drawTreeBranch("ec5unl", "62")
	drawTreeBranch("61", "71");
	drawTreeBranch("61", "72");
	drawTreeBranch("61", "73");
	drawTreeBranch("71", "81");
	drawTreeBranch("72", "82");
	drawTreeBranch("73", "83");
	drawTreeBranch("81", "91");
	drawTreeBranch("82", "92");
	drawTreeBranch("83", "93");
	drawTreeBranch("91", "101");
	drawTreeBranch("92", "102");
	drawTreeBranch("93", "103");
	drawTreeBranch("101", "111");
	drawTreeBranch("102", "111");
	drawTreeBranch("103", "111");
	drawTreeBranch("111", "121");
	drawTreeBranch("111", "122");
	drawTreeBranch("111", "123");
	drawTreeBranch("121", "131");
	drawTreeBranch("122", "132");
	drawTreeBranch("123", "133");
	drawTreeBranch("131", "141");
	drawTreeBranch("132", "142");
	drawTreeBranch("133", "143");
	drawTreeBranch("141", "151");
	drawTreeBranch("142", "151");
	drawTreeBranch("143", "151");
	drawTreeBranch("151", "161");
	drawTreeBranch("151", "162");
	drawTreeBranch("161", "171");
	drawTreeBranch("162", "171");
	drawTreeBranch("171", "ec1unl")
	drawTreeBranch("171", "ec2unl")
	drawTreeBranch("171", "ec3unl")
	drawTreeBranch("143", "ec4unl")
	drawTreeBranch("42", "ec5unl")
	drawTreeBranch("121", "ec6unl")
	drawTreeBranch("111", "ec7unl")
	drawTreeBranch("123", "ec8unl")
	drawTreeBranch("151", "ec9unl")
	drawTreeBranch("ec1unl", "181")
	drawTreeBranch("ec2unl", "181")
	drawTreeBranch("ec3unl", "181")
	drawTreeBranch("181", "ec10unl")
	drawTreeBranch("ec10unl", "191")
	drawTreeBranch("ec10unl", "192")
	drawTreeBranch("ec10unl", "193")
	drawTreeBranch("191", "211")
	drawTreeBranch("191", "212")
	drawTreeBranch("192", "201")
	drawTreeBranch("193", "213")
	drawTreeBranch("193", "214")
	drawTreeBranch("211", "221")
	drawTreeBranch("211", "222")
	drawTreeBranch("212", "223")
	drawTreeBranch("212", "224")
	drawTreeBranch("213", "225")
	drawTreeBranch("213", "226")
	drawTreeBranch("214", "227")
	drawTreeBranch("214", "228")
	drawTreeBranch("221", "231")
	drawTreeBranch("222", "231")
	drawTreeBranch("223", "232")
	drawTreeBranch("224", "232")
	drawTreeBranch("225", "233")
	drawTreeBranch("226", "233")
	drawTreeBranch("227", "234")
	drawTreeBranch("228", "234")
	drawTreeBranch("231", "ec11unl")
	drawTreeBranch("232", "ec11unl")
	drawTreeBranch("233", "ec12unl")
	drawTreeBranch("234", "ec12unl")
	drawTreeBranch("ec11unl", "dilstudy1")
	drawTreeBranch("ec12unl", "dilstudy1")
	drawTreeBranch("dilstudy1", "dilstudy2")
	drawTreeBranch("dilstudy2", "dilstudy3")
	drawTreeBranch("dilstudy3", "dilstudy4")
	drawTreeBranch("dilstudy4", "dilstudy5")
	if (mod.ngpp) drawTreeBranch("dilstudy5", "dilstudy6")
	if (mod.ngp3) drawTreeBranch("dilstudy6", "masteryportal")
	if (shiftDown) {
		for (i=0; i<all.length; i++) {
			let id = all[i]
			let disp = id
			let type = el(all[i]).className.split(" ")[1]
			if (type !== undefined) {
				if (all[i] == 222 || all[i] == 223 || all[i] == 226 || all[i] == 227 || all[i] == 232 || all[i] == 234) type = "dark"
				else if (all[i] == 221 || all[i] == 224 || all[i] == 225 || all[i] == 228 || all[i] == 231 || all[i] == 233) type = "light"
				else if (type.includes("normaldimstudy")) type = "normal dims"
				else if (type.includes("infdimstudy")) type = "infinity dims"
				else if (type.includes("timedimstudy")) type = "time dims"
				else if (type.includes("activestudy")) type = "active"
				else if (type.includes("passivestudy")) type = "passive"
				else if (type.includes("idlestudy")) type = "idle"
				disp += " " + type
			}
			drawStudyHeader(ctx, id, disp)
		}
	}
}
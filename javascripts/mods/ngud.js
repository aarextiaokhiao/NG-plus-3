//v1: black hole part
function getBlackholeDimensionPower(tier) {
  var dim = player["blackholeDimension"+tier];

  let ret = dim.power;

  if (ret.lt(1)) {
    ret = new Decimal(1)
  }

  if (player.dilation.active) {
    ret = Decimal.pow(10, Math.pow(ret.log10(), 0.75))
    if (player.dilation.upgrades.includes(9)) {
      ret = Decimal.pow(10, Math.pow(ret.log10(), 1.05))
    }
  }


  return ret

}


function getBlackholeDimensionProduction(tier) {
  var dim = player["blackholeDimension"+tier]
  if (player.currentEternityChall == "eterc11") return dim.amount
  var ret = dim.amount.times(getBlackholeDimensionPower(tier))
  return ret
}


function getBlackholeDimensionRateOfChange(tier) {
  let toGain = getBlackholeDimensionProduction(tier+1)
  var current = Decimal.max(player["blackholeDimension"+tier].amount, 1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(10).dividedBy(current);
  return change;
}

function getBlackholeDimensionDescription(tier) {
  if (tier > 3) return getFullExpansion(player['blackholeDimension' + tier].bought)
  else return shortenDimensions(player['blackholeDimension' + tier].amount) + ' (+' + formatValue(player.options.notation, getBlackholeDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getBlackholeUpgradeExponent() {
  let ret = player.blackhole.upgrades.total / 10;
  if (ret > 2) {
    ret = (ret - 2) / Math.log2(ret) + 2;
  }
  if (ret > 20 && player.aarexModifications.ngudpV) { // this should only happen if you are playing NGUd'.
    ret = Math.min(20 + Math.pow(Math.log10(ret-19),2),ret)
  }
  return ret;
}

function getBlackholePowerEffect() {
  return Math.pow(Math.max(player.blackhole.power.log(2), 1), getBlackholeUpgradeExponent());
}

function unlockBlackhole() {
    if (player.eternityPoints.gte('1e4000')) {
        document.getElementById("blackholediv").style.display="inline-block"
        document.getElementById("blackholeunlock").style.display="none"
        document.getElementById("blackHoleAnimBtn").style.display="inline-block"
        player.blackhole.unl = true
        player.eternityPoints = player.eternityPoints.minus('1e4000')
    }
}

function updateBlackhole() {
  drawBlackhole();
  document.getElementById("blackholePowAmount").innerHTML = shortenMoney(player.blackhole.power);
  document.getElementById("blackholePowPerSec").innerHTML = "You are getting " + shortenMoney(getBlackholeDimensionProduction(1)) + " black hole power per second.";
  document.getElementById("DilMultAmount").innerHTML = formatValue(player.options.notation, getBlackholePowerEffect(), 2, 2)
  document.getElementById("InfAndReplMultAmount").innerHTML = formatValue(player.options.notation, Math.cbrt(getBlackholePowerEffect()), 2, 2)
  document.getElementById("blackholeDil").innerHTML = "Feed the black hole with dilated time<br>Cost: "+shortenCosts(new Decimal(1e20).times(Decimal.pow(10, player.blackhole.upgrades.dilatedTime)))+" dilated time";
  document.getElementById("blackholeInf").innerHTML = "Feed the black hole with banked infinities<br>Cost: "+formatValue(player.options.notation, 5e9 * Math.pow(2, player.blackhole.upgrades.bankedInfinities), 1, 1)+" banked infinities";
  document.getElementById("blackholeRepl").innerHTML = "Feed the black hole with replicanti<br>Cost: "+shortenCosts(new Decimal("1e20000").times(Decimal.pow("1e1000", player.blackhole.upgrades.replicanti)))+" replicanti";
  document.getElementById("blackholeDil").className = canFeedBlackHole(1) ? 'eternityupbtn' : 'eternityupbtnlocked';
  document.getElementById("blackholeInf").className = canFeedBlackHole(2) ? 'eternityupbtn' : 'eternityupbtnlocked';
  document.getElementById("blackholeRepl").className = canFeedBlackHole(3) ? 'eternityupbtn' : 'eternityupbtnlocked';
  if (document.getElementById("blackhole").style.display == "block" && document.getElementById("eternitystore").style.display == "block") {
    for (let tier = 1; tier <= 4; ++tier) {
      document.getElementById("blackholeD"+tier).textContent = DISPLAY_NAMES[tier] + " Black Hole Dimension x" + shortenMoney(getBlackholeDimensionPower(tier));
      document.getElementById("blackholeAmount"+tier).textContent = getBlackholeDimensionDescription(tier);
      document.getElementById("blackholeMax"+tier).textContent = "Cost: " + shortenCosts(player["blackholeDimension"+tier].cost) + " EP";
      if (player.eternityPoints.gte(player["blackholeDimension"+tier].cost)) document.getElementById("blackholeMax"+tier).className = "storebtn"
      else document.getElementById("blackholeMax"+tier).className = "unavailablebtn"
    }
  }
}

function drawBlackhole(ts) {
	if (document.getElementById("eternitystore").style.display !== "none" && document.getElementById("blackhole").style.display !== "none" && player.options.animations.blackHole) {
		bhctx.clearRect(0, 0, canvas.width, canvas.height);
		let radius = Math.max(player.blackhole.power.log(2), 0);
		bhctx.beginPath();
		bhctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2 * Math.PI, true);
		bhctx.fill();
		delta = (ts - lastTs) / 1000;
		lastTs = ts;
		requestAnimationFrame(drawBlackhole);
	}
}

function canFeedBlackHole (i) {
    if (i === 1) {
        return new Decimal(1e20).times(Decimal.pow(10, player.blackhole.upgrades.dilatedTime)).lte(player.dilation.dilatedTime);
    } else if (i === 2) {
        return 5e9 * Math.pow(2, player.blackhole.upgrades.bankedInfinities) <= player.infinitiedBank;
    } else if (i === 3) {
        return new Decimal("1e20000").times(Decimal.pow("1e1000", player.blackhole.upgrades.replicanti)).lte(player.replicanti.amount);
    }
}

function feedBlackHole (i) {
  if (!canFeedBlackHole(i)) {
    return false;
  }
  if (i === 1) {
      player.dilation.dilatedTime = player.dilation.dilatedTime.minus(new Decimal(1e20).times(Decimal.pow(10, player.blackhole.upgrades.dilatedTime)));
      player.blackhole.upgrades.dilatedTime++;
  } else if (i === 2) {
      player.infinitiedBank -= 5e9 * Math.pow(2, player.blackhole.upgrades.bankedInfinities);
      player.blackhole.upgrades.bankedInfinities++;
  } else if (i === 3) {
      player.replicanti.amount = player.replicanti.amount.minus(new Decimal("1e20000").times(Decimal.pow("1e1000", player.blackhole.upgrades.replicanti)));
      player.blackhole.upgrades.replicanti++;
  }
  player.blackhole.upgrades.total++;
  updateBlackhole();
  return true;
}

let blackholeDimStartCosts = [null, new Decimal('1e4000'), new Decimal('1e8000'), new Decimal('1e12000'), new Decimal('1e20000')];

let blackholeDimCostMults = [null, new Decimal('1e500'), new Decimal('1e1000'), new Decimal('1e2000'), new Decimal('1e4000')]

function buyBlackholeDimension(tier) {
  var dim = player["blackholeDimension"+tier]
  if (tier > 4) return false
  if (player.eternityPoints.lt(dim.cost)) return false

  player.eternityPoints = player.eternityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(1);
  dim.bought += 1
  dim.cost = Decimal.pow(blackholeDimCostMults[tier], dim.bought).times(blackholeDimStartCosts[tier]);
  dim.power = dim.power.times(2)
  updateBlackhole();
  if (tier === 4) {giveAchievement("We couldn't afford 5")}
  return true
}

function resetBlackhole() {
  player.blackhole.power = new Decimal(0);
  document.getElementById('blackHoleCanvas').getContext('2d').clearRect(0, 0, 400, 400);
  for (var i=1; i<5; i++) {
      var dim = player["blackholeDimension"+i]
      dim.amount = new Decimal(dim.bought)
  }
}

function buyMaxBlackholeDimensions(){
    for (var i = 1; i <5; i ++){
        // i is the tier
        let e = player.eternityPoints.log10()
        let dim = player["blackholeDimension" + i]
        if (dim.cost.log10() <= e){
            let diff = e - dim.cost.log10()
            let buying = Math.ceil(diff/blackholeDimCostMults[i].log10())
			player.eternityPoints = player.eternityPoints.minus(player.eternityPoints.min(Decimal.pow(blackholeDimCostMults[tier],buying-1).times(dim.cost)))
            dim.amount = dim.amount.plus(buying)
            dim.bought += buying    
            dim.cost = Decimal.pow(blackholeDimCostMults[tier], dim.bought).times(blackholeDimStartCosts[tier])
            dim.power = dim.power.times(Decimal.pow(2,buying))
        }
    }
}

//v1: ex-dilation part
function canReverseDilation() {
    return player.eternityPoints.gte("1e10000") && player.dilation.dilatedTime.gte(1e30);
}

function updateExdilation() {
	document.getElementById("xdp").style.display = "none"
	document.getElementById("xdrow").style.display = "none"
	document.getElementById("exdilationConfirmBtn").style.display = "none"
	if (player.exdilation == undefined || player.aarexModifications.ngudpV) return
	if (player.exdilation.times < 1) return
	document.getElementById("xdp").style.display = ""
	document.getElementById("xdrow").style.display = ""
	document.getElementById("exdilationConfirmBtn").style.display = "inline"
	document.getElementById("exDilationAmount").textContent = shortenDimensions(player.exdilation.unspent)
	document.getElementById("exDilationBenefit").textContent = (exDilationBenefit()/0.0075).toFixed(1)
	for (var i=1;i<4;i++) {
		document.getElementById("xd"+i).className = player.exdilation.unspent.eq(0) ? "dilationupgrebuyablelocked" : "dilationupgrebuyable";
		document.getElementById("xd"+i+"span").textContent = exDilationUpgradeStrength(i).toFixed(2) + 'x -> ' + exDilationUpgradeStrength(i,player.exdilation.unspent).toFixed(2) + 'x';
	}
}

function getExDilationGain() {
    return Decimal.pow(Math.max(1, (player.eternityPoints.log10() - 9900) / 100), 2 * player.dilation.dilatedTime.log(1e15) - 4).floor();
}

function exDilationBenefit() {
    let ret = Math.max(player.exdilation.unspent.log(10) + 1, 0) / 10;
    if (ret > .3) {
        ret = .8 - Math.pow(Math.E, 2 * (.3 - ret)) / 2;
    }
    return ret;
}

function exDilationUpgradeStrength(x,add=0) {
	if (player.exdilation == undefined) return 1
	let ret = Math.max(player.exdilation.spent[x].plus(add).log(10) + 1, 0) / 10;
	if (ret > .3) {
		ret = .8 - Math.pow(Math.E, 2 * (.3 - ret)) / 2;
	}
	return 1 + ret / 2;
}

function reverseDilation () {
    if (!canReverseDilation()) return;
    if (player.options.exdilationconfirm) if (!confirm('Reversing dilation will make you lose all your tachyon particles, ' +
    'dilated time, dilation upgrades, and blackhole power, but you will gain ex-dilation ' +
    'that makes repeatable upgrades more powerful. Are you sure you want to do this?')) return;
    var eterConf = player.options.eternityconfirm
    player.options.eternityconfirm = false
    eternity(true);
    player.options.eternityconfirm = eterConf
    player.exdilation.unspent = player.exdilation.unspent.plus(getExDilationGain());
    player.exdilation.times++;
    player.dilation = {
        studies: player.dilation.studies,
        active: false,
        tachyonParticles: new Decimal(0),
        dilatedTime: new Decimal(0),
        totalTachyonParticles: new Decimal(0),
        nextThreshold: new Decimal(1000),
        freeGalaxies: 0,
        upgrades: [],
        rebuyables: {
            1: 0,
            2: 0,
            3: 0
        }
    }
    resetBlackhole();
    updateDilation();
    updateDilationUpgradeButtons();
    updateDilationUpgradeCosts();
    updateExdilation()
    giveAchievement('Time is absolute')
}

function toggleExdilaConf() {
	player.options.exdilationConfirm = !player.options.exdilationConfirm
	document.getElementById("exdilationConfirmBtn").textContent = "Reverse dilation confirmation: O" + (player.options.exdilationConfirm ? "N" : "FF")
}

function boostDilationUpgrade(x) {
    player.exdilation.spent[x] = player.exdilation.spent[x].plus(player.exdilation.unspent).round();
    player.exdilation.unspent = new Decimal(0);
    updateDilation();
    updateDilationUpgradeButtons();
    updateExdilation();
}
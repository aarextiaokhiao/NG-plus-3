let prestigeHandler = {
	order: ["paradox", "galaxy", "infinity", "eternity", "quantum", "ghostify"],
	reqs: {
		paradox: function() {
			return player.matter.max(player.money).gte(1e3) && player.totalTickGained && !tmp.ri
		},
		galaxy: function() {
			return getGSAmount().eq(0) && !tmp.ri
		},
		infinity: function() {
			return player.money.gte(Number.MAX_VALUE) && player.break && player.currentChallenge == ""
		},
		eternity:
			function() { return player.infinityPoints.gte(player.eternityChallGoal)
		},
		quantum: function() {
			return player.meta.antimatter.gte(Decimal.pow(Number.MAX_VALUE, tmp.ngp3 ? 1.45 : 1)) && quarkGain().gt(0) && (!tmp.ngp3 || ECTimesCompleted("eterc14")) && player.money.log10() >= getQCGoal()
				
		},
		ghostify: function() {
			return ph.reqs.quantum()
		}
	},
	modReqs: {
		paradox: function() {
			return player.pSac !== undefined
		},
		galaxy: function() {
			return player.galacticSacrifice !== undefined
		},
		quantum: function() {
			return player.meta !== undefined
		},
		ghostify: function() {
			return tmp.ngp3
		}
	},
	dids: {
		paradox: function() {
			return player.pSac.times
		},
		galaxy: function() {
			return player.galacticSacrifice.times
		},
		infinity: function() {
			return player.infinitied
		},
		eternity: function() {
			return player.eternities
		},
		quantum: function() {
			return tmp.qu.times
		},
		ghostify: function() {
			return player.ghostify.times
		}
	},
	memory: [],
	canPrestige: function(id) {
		return ph.reqs[id] && ph.reqs[id]()
	},
	prestiged: function(id) {
		return ph.memory[id] >= 3
	},
	update: function() {
		var pp = false
		for (var x=ph.order.length;x>0;x--) {
			var p = ph.order[x-1]
			ph.memory[p] = 0
			if (!ph.modReqs[p] || ph.modReqs[p]()) {
				ph.memory[p] = 1
				if (ph.canPrestige(p)) ph.memory[p] = 2
				if (pp || (ph.dids[p] && ph.dids[p]())) {
					ph.memory[p] = 3
					pp = true
				}
			}
		}
	}
}
let ph = prestigeHandler
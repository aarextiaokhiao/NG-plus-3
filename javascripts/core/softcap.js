var softcap_data = {
	dt_log: {
		1: {
			func: "pow",
			start: 4e3,
			pow: 0.6,
			derv: true
		},
		2: {
			func: "pow",
			start: 5e3,
			pow: 0.4,
			derv: true
		},
		3: {
			func: "pow",
			start: 6e3,
			pow: 0.2,
			derv: true
		}
	},
	ts_reduce_log: {
		1: {
			func: "pow",
			start: 1e7,
			pow: 0.75
		},
		2: {
			func: "pow",
			start: 1e8,
			pow: 0.75
		}
	},
	ts_reduce_log_big_rip: {
		1: {
			func: "pow",
			start: 1e4,
			pow: 0.75
		},
		2: {
			func: "pow",
			start: 1e5,
			pow: 0.75
		}
	},
	ts11_log_big_rip: {
		1: {
			func: "pow",
			start: 11e4,
			pow: 0.5
		},
		2: {
			func: "pow",
			start: 13e4,
			pow: 0.4,
			derv: true
		},
		3: {
			func: "pow",
			start: 16e4,
			pow: 0.3,
			derv: true
		},
		4: {
			func: "pow",
			start: 20e4,
			pow: 0.2,
			derv: true
		},
		5: {
			func: "pow",
			start: 25e4,
			pow: 0.1,
			derv: true
		}
	},
	ms322_log: {
		1: {
			func: "pow",
			start: 500,
			pow: 0.75,
			derv: true
		}
	},
	bru1_log: {
		1: {
			func: "pow",
			start: 3e8,
			pow: 0.75
		},
		2: {
			func: "log",
			start: 1e10,
			pow: 10
		},
		3: {
			func: "pow",
			start: 3e10,
			pow: 0.5
		},
		4: {
			func: "log",
			start: 1e11,
			pow: 11,
			add: -1
		}
	},
	beu3_log: {
		1: {
			func: "pow",
			start: 150,
			pow: 0.5
		}
	},
	inf_time_log_1: {
		1: {
			func: "pow",
			start: 12e4,
			pow: 0.5
		},
		2: {
			func: "pow",
			start: 12e6,
			pow: 2/3
		}
	},
	inf_time_log_1_big_rip: {
		1: {
			func: "pow",
			start: 100,
			pow: 0.5
		},
		2: {
			func: "pow",
			start: 1e4,
			pow: 0.4
		}
	},
	inf_time_log_2: {
		1: {
			func: "pow",
			start: 12e7,
			pow: 0.6
		}
	},
	ig_log_high: {
		1: {
			func: "log",
			pow: 10,
			mul: 5
		},
		2: {
			func: "pow",
			start: 1e21,
			pow: 0.2
		},
		3: {
			func: "log",
			pow: 11,
			mul: 4,
			add: 12
		},
		4: {
			func: "pow",
			start: 1e23,
			pow: 0.1
		}
	}
}

var softcap_vars = {
	pow: ["start", "pow", "derv"],
	log: ["pow", "mul", "add"]
}

var softcap_funcs = {
	pow: function(x, start, pow, derv) {
		if (x > start) {
			x = Math.pow(x / start, pow)
			if (derv) x = (x - 1) / pow + 1
			x *= start
			return x
		} 
		return x
	},
	pow_decimal: function(x, start, pow, derv) {
		if (x.gt(start)) {
			x = x.div(start).pow(pow)
			if (derv) x = x.sub(1).div(pow).add(1)
			x = x.times(start)
			return x
		}
		return x
	},
	log: function(x, pow = 1, mul = 1, add = 0) {
		var x2 = Math.pow(Math.log10(x) * mul + add, pow)
		if (x > x2) return x2
		return x
	}
}

function do_softcap(x, data, num) {
	var data = data[num]
	if (data === undefined) return
	var func = data.func
	var vars = softcap_vars[func]
	if (x + 0 != x) func += "_decimal"
	return softcap_funcs[func](x, data[vars[0]], data[vars[1]], data[vars[2]])
}

function softcap(x, id, max = 1/0) {
	var data = softcap_data[id]
	if (tmp.ngp3 && tmp.qu.bigRip.active) {
		var big_rip_data = softcap_data[id + "_big_rip"]
		if (big_rip_data !== undefined) data = big_rip_data
	}

	var sc = 1
	var stopped
	while (!stopped && sc <= max) {
		var y = do_softcap(x, data, sc)
		if (y !== undefined) {
			x = y
			sc++
		} else stopped = true
	}
	return x
}

var softcap_data = {
	ts_reduce_log: {
		1: {
			func: "pow",
			start: 1e6,
			pow: 0.95,
			derv: true
		},
		2: {
			func: "pow",
			start: 2e6,
			pow: 0.9,
			derv: true
		},
		3: {
			func: "pow",
			start: 4e6,
			pow: 0.85,
			derv: true
		},
		4: {
			func: "pow",
			start: 8e6,
			pow: 0.8,
			derv: true
		},
		5: {
			func: "pow",
			start: 1e7,
			pow: 0.75,
			derv: true
		},
		6: {
			func: "pow",
			start: 2e7,
			pow: 0.7,
			derv: true
		}
	},
	ts_reduce_log_big_rip: {
		1: {
			func: "pow",
			start: 1e4,
			pow: 0.6,
			derv: true
		},
		2: {
			func: "pow",
			start: 14e3,
			pow: 0.5,
			derv: true
		},
		3: {
			func: "pow",
			start: 18e3,
			pow: 0.4,
			derv: true
		},
		4: {
			func: "pow",
			start: 22e3,
			pow: 0.3,
			derv: true
		},
		5: {
			func: "pow",
			start: 26e3,
			pow: 0.2,
			derv: true
		},
		6: {
			func: "pow",
			start: 3e4,
			pow: 0.1,
			derv: true
		}
	},
	ts11_log_big_rip: {
		1: {
			func: "pow",
			start: 11e4,
			pow: 0.5,
			derv: true
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
			pow: 0.5,
			derv: true
		},
		2: {
			func: "pow",
			start: 12e5,
			pow: 1/3,
			derv: true
		}
	},
	inf_time_log_1_big_rip: {
		1: {
			func: "pow",
			start: 100,
			pow: 0.5,
			derv: true
		}
	},
	inf_time_log_2: {
		1: {
			func: "pow",
			start: 20e7,
			pow: 0.7,
			derv: true
		},
		2: {
			func: "pow",
			start: 25e7,
			pow: 0.5,
			derv: true
		},
		3: {
			func: "pow",
			start: 30e7,
			pow: 0.3,
			derv: true
		}
	},
	inf_time_log_2_big_rip: {
		1: {
			func: "pow",
			start: 50e3,
			pow: 0.9,
			derv: true
		},
		2: {
			func: "pow",
			start: 55e3,
			pow: 0.7,
			derv: true
		},
		3: {
			func: "pow",
			start: 60e3,
			pow: 0.5,
			derv: true
		},
		4: {
			func: "pow",
			start: 65e3,
			pow: 0.3,
			derv: true
		},
		5: {
			func: "pow",
			start: 70e3,
			pow: 0.1,
			derv: true
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
	log: function(x, pow, mul = 1, add = 0) {
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

function softcap(x, id) {
	var data = softcap_data[id]
	if (tmp.ngp3 && tmp.qu.bigRip.active) {
		var big_rip_data = softcap_data[id + "_big_rip"]
		if (big_rip_data !== undefined) data = big_rip_data
	}

	var sc = 1
	var stopped
	while (!stopped) {
		var y = do_softcap(x, data, sc)
		if (y !== undefined) {
			x = y
			sc++
		} else stopped = true
	}
	return x
}

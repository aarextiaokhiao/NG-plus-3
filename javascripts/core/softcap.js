var softcap_data = {
	ts11_log_big_rip: {
		1: {
			func: "pow",
			start: 11e4,
			pow: 0.8,
			derv: true
		},
		2: {
			func: "pow",
			start: 13e4,
			pow: 0.7,
			derv: true
		},
		3: {
			func: "pow",
			start: 15e4,
			pow: 0.6,
			derv: true
		},
		4: {
			func: "pow",
			start: 17e4,
			pow: 0.5,
			derv: true
		},
		5: {
			func: "pow",
			start: 19e4,
			pow: 0.4,
			derv: true
		}
	},
	inf_time_log: {
		1: {
			func: "pow",
			start: 12e4,
			pow: 0.5,
			derv: false
		},
		2: {
			func: "pow",
			start() {
				let r = 1.2e7
				if (hasNB(4)) r *= NT.eff("boost", 4)[1]
				return r
			},
			pow: 2/3,
			derv: false
		}
	},
	inf_time_log_big_rip: {
		1: {
			func: "pow",
			start: 100,
			pow: 0.5,
			derv: false
		}
	},
	bam: {
		1: {
			func: "pow",
			start: E(1e80),
			pow: 0.8,
			derv: true
		}
	},
	qc3reward: {
		1: {
			func: "pow",
			start: 1331,
			pow: 9/16,
			derv: false
		}
	}
}

var softcap_vars = {
	pow: ["start", "pow", "derv"],
	log: ["pow", "mul", "add"],
	logshift: ["shift", "pow", "add"]
}

var softcap_funcs = {
	pow: function(x, start, pow, derv = false) {
		if (typeof start == "function") start = start()
		if (typeof pow == "function") pow = pow()
		if (typeof derv == "function") derv = derv()
		if (x > start) {
			x = Math.pow(x / start, pow)
			if (derv) x = (x - 1) / pow + 1
			x *= start
			return x
		} 
		return x
	},
	pow_decimal: function(x, start, pow, derv = false) {
		if (typeof start == "function") start = start()
		if (typeof pow == "function") pow = pow()
		if (typeof derv == "function") derv = derv()
		if (Decimal.gt(x, start)) {
			x = Decimal.div(x, start).pow(pow)
			if (derv) x = x.sub(1).div(pow).add(1)
			x = x.mul(start)
			return x
		}
		return x
	},
	log: function(x, pow = 1, mul = 1, add = 0) {
		if (typeof pow == "function") pow = pow()
		if (typeof mul == "function") mul = mul()
		if (typeof add == "function") add = add()
		var x2 = Math.pow(Math.log10(x) * mul + add, pow)
		return Math.min(x, x2)
	},
	logshift: function (x, shift, pow, add = 0){
		if (typeof pow == "function") pow = pow()
		if (typeof shift == "function") shift = shift()
		if (typeof add == "function") add = add()
		var x2 = Math.pow(Math.log10(x * shift), pow) + add
		return Math.min(x, x2)
	}
}

function do_softcap(x, data, num) {
	var data = data[num]
	if (data === undefined) return
	var func = data.func
	if (func == "log" && data["start"]) if (x < data["start"]) return x
	var vars = softcap_vars[func]
	if (x + 0 != x) func += "_decimal"
	return softcap_funcs[func](x, data[vars[0]], data[vars[1]], data[vars[2]])
}

function softcap(x, id, max = 1/0) {
	var data = softcap_data[id]
	if (bigRipped()) {
		var big_rip_data = softcap_data[id + "_big_rip"]
		if (big_rip_data !== undefined) data = big_rip_data
	}

	var sc = 1
	var stopped = false
	while (!stopped && sc <= max) {
		var y = do_softcap(x, data, sc)
		if (y !== undefined) {
			x = y
			sc++
		} else stopped = true
	}
	return x
}

/* Aarex is currently refactoring code... */
function doWeakerPowerReductionSoftcapNumber(num,start,exp){
	if (num < start || num < 1) return num
	return start*(( (num/start)**exp -1)/exp+1)
}

function doWeakerPowerReductionSoftcapDecimal(num,start,exp){
	if (num.lt(start) || num.lt(1)) return num
	return start.mul( num.div(start).pow(exp).minus(1).div(exp).add(1) )
}

function doStrongerPowerReductionSoftcapNumber(num,start,exp){
	if (num < start || num < 1) return num
	return start*((num/start)**exp)
}

function doStrongerPowerReductionSoftcapDecimal(num,start,exp){
	if (num.lt(start) || num.lt(1)) return num
	return start.mul(num.div(start).pow(exp))
}
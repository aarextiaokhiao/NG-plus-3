var FormatList = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce',];

function letter(power,str) {
    const len = str.length;
    function lN(n) {
        let result = 1;
        for (var j = 0; j < n; ++j) result = len*result+1;
        return result;
    }
    if (power <= 5) return str[0];
    power = Math.floor(power / 3);
    let i=0;
    while (power >= lN(++i));
    if (i==1) return str[power-1];
    power -= lN(i-1);
    let ret = '';
    while (i>0) ret += str[Math.floor(power/Math.pow(len,--i))%len]
    return ret;
}

function getAbbreviation(e) {
    const prefixes = [
    ['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
    ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
    ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
    const prefixes2 = ['', 'MI', 'MC', 'NA']
	var result = ''
    e = Math.floor(e/3)-1;
	e2 = 0
    while (e > 0) {		
		var partE = e % 1000
		if (partE > 0) {
			if (partE == 1 && e2 > 0) var prefix = ""
			else var prefix = prefixes[0][partE % 10] + prefixes[1][Math.floor(partE/10) % 10] + prefixes[2][Math.floor(partE/100)]
			if (result == "") result = prefix + prefixes2[e2]
			else result = prefix + prefixes2[e2] + '-' + result
		}
		e = Math.floor(e/1000)
		e2++
	}
	return result
}

function getShortAbbreviation(e) {
	const prefixes = [
	['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
	['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
	['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
	const prefixes2 = ['', 'MI', 'MC', 'NA', 'PC', 'FM', 'AT', 'ZP', 'YC', 'XN', 
	'VE', 'ME', 'DE', 'TE', 'TeE', 'PE', 'HE', 'HeE', 'OC', 'EC', 
	'IS', 'MS', 'DS', 'TS', 'TeS', 'PS', 'HS', 'HeS', 'OS', 'ES', 
	'TN', 'MTN', 'DTN', 'TTN', 'TeTN', 'PTN', 'HTN', 'HeTN', 'OTN', 'ETN', 
	'TeC', 'MTeC', 'DTeC', 'TTeC', 'TeTeC', 'PTeC', 'HTeC', 'HeTeC', 'OTeC', 'ETeC', 
	'PC', 'MPC', 'DPC', 'TPC', 'TePC', 'PPC', 'HPC', 'HePC', 'OPC', 'EPC', 
	'HC', 'MHC', 'DHC', 'THC', 'TeHC', 'PHC', 'HHC', 'HeHC', 'OHC', 'EHC', 
	'HeC', 'MHeC', 'DHeC', 'THeC', 'TeHeC', 'PHeC', 'HHeC', 'HeHeC', 'OHeC', 'EHeC', 
	'OC', 'MOC', 'DOC', 'TOC', 'TeOC', 'POC', 'HOC', 'HeOC', 'OOC', 'EOC', 
	'EC', 'MEC', 'DEC', 'TEC', 'TeEC', 'PEC', 'HEC', 'HeEC', 'OEC', 'EEC', 
	'HT', 'MHT', 'DHT']
	var result = ''
	var id = Math.floor(e/3-1)
	var log = Math.floor(Math.log10(id))
	var step = Math.max(Math.floor(log/3-3),0)
	id = Math.round(id/Math.pow(10,Math.max(log-9,0)))*Math.pow(10,Math.max(log-9,0)%3)
    while (id > 0) {		
		var partE = id % 1000
		if (partE > 0) {
			if (partE == 1 && step > 0) var prefix = ""
			else var prefix = prefixes[0][partE % 10] + prefixes[1][Math.floor(partE/10) % 10] + prefixes[2][Math.floor(partE/100)]
			if (result == "") result = prefix + prefixes2[step]
			else result = prefix + prefixes2[step] + '-' + result
		}
		id = Math.floor(id/1000)
		step++
	}
	return result
}


const inflog = Math.log10(Number.MAX_VALUE)
function formatValue(notation, value, places, placesUnder1000) {
    if (notation === "Same notation") notation = player.options.notation
    if (Decimal.eq(value, 1/0)) return "Infinite"
    if ((Decimal.lte(value,Number.MAX_VALUE) || (player.break && (player.currentChallenge == "" || !new Decimal(Number.MAX_VALUE).equals(player.challengeTarget)) )) && (Decimal.gte(value,1000))) {
        if (notation === "Hexadecimal") {
            value = Decimal.pow(value, 1/Math.log10(16))
            var mantissa = Math.pow(value.m, Math.log10(16))
            var power = value.e
            if (mantissa > 16 - Math.pow(16, -2)/2) {
                mantissa = 1
                power++
            }
            var digits=[0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']
            mantissa=digits[Math.floor(mantissa)].toString()+'.'+digits[Math.floor(mantissa*16)%16].toString()+digits[Math.floor(mantissa*256)%16].toString()
            if (power > 100000 && !(player.options.commas === "Commas")) return mantissa + "e" + formatValue(player.options.commas, power, 3, 3)
            else {
                if (power >= Math.pow(16, 12)) return mantissa + "e" + formatValue(player.options.notation, power, 3, 3)
                var digit=0
                var result=''
                var temp=power
                while (power>0) {
                    result=digits[power%16].toString()+(temp>1e5&&digit>0&&digit%3<1?',':'')+result
                    power=Math.floor(power/16)
                    digit++
                }
                return mantissa + "e" + result;
            }
        }
        if (notation === "AF5LN") {
            value = new Decimal(value)
            var progress = Math.round(Math.log10(value.add(1).log10()+1)/Math.log10(Number.MAX_VALUE)*11881375)
            var uppercased = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            var result = ""
            for (l=0;l<5;l++) {
                var pos = Math.floor(progress/Math.pow(26,l))%26
                result = uppercased.slice(pos, pos+1) + result
            }
            return result
        }
        if (notation === "Hyperscientific") {
            value = new Decimal(value)
            var e
            var f
            if (value.gt("1e10000000000")) {
                e = Math.log10(Math.log10(value.log10()))
                f = 3
            } else if (value.gt(1e10)) {
                e = Math.log10(value.log10())
                f = 2
            } else {
                e = value.log10()
                f = 1
            }
            e = e.toFixed(2+f)
            if (e == 10) {
                e = (1).toFixed(3+f)
                f++
            }
            return e+"F"+f
        }
        if (value instanceof Decimal) {
           var power = value.e
           var matissa = value.mantissa
        } else {
            var matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
            var power = Math.floor(Math.log10(value));
        }
        if ((notation === "Mixed scientific" && power >= 33) || notation === "Scientific") {
            matissa = matissa.toFixed(places)
            if (matissa >= 10) {
                matissa = (1).toFixed(places);
                power++;
            }
            if (power > 100000) {
                if (player.options.commas != "Commas") return matissa + "e" + formatValue(player.options.commas, power, 3, 3)
                if (power >= 1e12 && player.options.commas == "Commas") return matissa + "e" + formatValue("Standard", power, 3, 3)
                return matissa + "e" + getFullExpansion(power);
            }
            return matissa + "e" + power;
        }
        if (notation === "Psi") {
            var mantissa=matissa
            if(mantissa==10){
                mantissa=1
                power++
            }
            var ret="You have failed"
            if(power==0){
                ret=mantissa.toFixed(0)
            }else if(power<10){
                ret="E"+power.toFixed(0)+"-"+mantissa.toFixed(Math.floor(power)).replace(".","")
            }else if(power<1e10){
                ret="F2-"+Math.floor(Math.log10(power)).toFixed(0)+"-"+(10**(Math.log10(power)%1)).toFixed(10).replace(".","")+"-"+mantissa.toFixed(10).replace(".","")
            }else{
                ret="F3-"+Math.floor(Math.log10(Math.log10(power))).toFixed(0)+"-"+(10**(Math.log10(Math.log10(power))%1)).toFixed(10).replace(".","")+"-"+(10**(Math.log10(power)%1)).toFixed(10).replace(".","")+"-"+mantissa.toFixed(10).replace(".","")
            }
            ret=ret.replace(/$/g,"-")
            ret=ret.replace(/0+-/g,"-")
            ret=ret.replace(/-$/,"")
            ret=ret.replace(/(?:-1)+$/g,"")
            return ret.slice(0,15)
        }
        if (notation === "Greek" || notation === "Morse code") {
            if (matissa>=10-Math.pow(10,-places)/2) {
                matissa=Math.pow(10,places)
                power-=places+1
            } else {
                matissa=Math.round(matissa*Math.pow(10,places))
                power-=places
            }
            if (power > 1e5 && player.options.commas !== "Commas") power = formatValue(player.options.commas, power, 3, 3)
            else power = convTo(notation, power)
            return convTo(notation, matissa)+'e'+power
        }
        if (notation === "Infinity") {
            const inflog = Math.log10(Number.MAX_VALUE)
            const pow = Decimal.log10(value)
            var reduced = pow / inflog
            if (reduced < 1000) var infPlaces = 4
            else var infPlaces = 3
            if (player.options.commas === "Commas") {
                if (reduced>=1e12) return formatValue("Standard", reduced, 3, 3)+"∞"
				var splits=reduced.toFixed(Math.max(infPlaces, places)).split(".")
				return splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+splits[1]+"∞"
            } else {
                if (reduced>=1e5) return formatValue(player.options.commas, reduced, 3, 3)+"∞"
                return reduced.toFixed(Math.max(infPlaces, places))+"∞"
            }
        }
        if (notation === "Game percentages") {
            return (Math.log10(Decimal.log10(value))/Math.log10(3.5e8)*100).toFixed(4)+'%'
        }
        if (notation === "Engineering" || notation === "Mixed engineering") pow = power - (power % 3)
        else pow = power
        if (pow > 100000) {
            if (player.options.commas !== "Commas") pow = formatValue(player.options.commas, pow, 3, 3)
            else if (pow >= 1e12) pow = formatValue("Standard", pow, 3, 3)
            else pow = getFullExpansion(pow);
        }

        if (notation === "Logarithm") {
            if (power > 100000) {
                if (player.options.commas === "Logarithm") return "ee"+Math.log10(Decimal.log10(value)).toFixed(3)
                else if (player.options.commas !== "Commas") return "e"+formatValue(player.options.commas, power, 3, 3)
                else if (power >= 1e12) return "e"+formatValue("Standard", power, 3, 3)
                else return "e"+Decimal.log10(value).toFixed(places).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            return "e"+Decimal.log10(value).toFixed(places)
        }

        if (notation === "Brackets") {
          var table = [")", "[", "{", "]", "(", "}"];
          var log6 = Math.LN10 / Math.log(6) * Decimal.log10(value);
          if (log6 >= 1e12) return "e" + formatValue("Brackets", log6)
          var wholePartOfLog = Math.floor(log6);
          var decimalPartOfLog = log6 - wholePartOfLog;
          //Easier to convert a number between 0-35 to base 6 than messing with fractions and shit
          var decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
          var string = "";
          while (wholePartOfLog >= 6) {
            var remainder = wholePartOfLog % 6;
            wholePartOfLog -= remainder;
            wholePartOfLog /= 6;
            string = table[remainder] + string;
          }
          string = "e" + table[wholePartOfLog] + string + ".";
          string += table[Math.floor(decimalPartTimes36 / 6)];
          string += table[decimalPartTimes36 % 6];
          return string;
        }
        if (notation == "Tetration") {
          var count = -1;
          while (value > 1) {
            value = Decimal.log2(value);
            count++;
          }
          return "2⇈" + (value + count).toFixed(Math.max(places, 0, Math.min(count-1, 4)));
        }

        matissa = (matissa * Decimal.pow(10, power % 3)).toFixed(places)
        if (matissa >= 1000) {
            matissa /= 1000;
            power++;
        }

        if (notation === "Standard" || notation === "Mixed scientific") {
            if (power <= 303) return matissa + " " + FormatList[(power - (power % 3)) / 3];
            else if (power > 3e11+2) return getShortAbbreviation(power) + "s";
            else return matissa + " " + getAbbreviation(power);
        } else if (notation === "Mixed engineering") {
            if (power <= 33) return matissa + " " + FormatList[(power - (power % 3)) / 3];
            else return (matissa + "e" + pow);
        } else if (notation === "Engineering") {
            return (matissa + "e" + pow);
        } else if (notation === "Letters") {
            return matissa + letter(power,'abcdefghijklmnopqrstuvwxyz');
        } else if (notation === "Emojis") {
            return matissa + letter(power,['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡'])
        }

        else {
            if (power > 100000  && player.options.commas === "Commas") power = power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return "1337 H4CK3R"
        }
    } else if (value < 1000) {
        return (value).toFixed(placesUnder1000);
    } else {
        return "Infinite";
    }
}

function convTo(notation, num) {
	var result=""
	var rest=""
	if (num>=1e12) {
		var log = Math.floor(Math.log10(num))
		var step = Math.max(Math.floor(log/3-3),0)
		num = Math.round(num/Math.pow(10,Math.max(log-9,0)))*Math.pow(10,Math.max(log-9,0)%3)
		if (num>=1e12) {
			num/=1000
			step++
		}
		rest=" "+FormatList[step]
	}
	if (notation=='Greek') {
		const marks=[["","A","B","Γ","Δ","E","Ϛ","Z","H","Θ"],["","I","K","Λ","M","N","Ξ","O","Π","Ϟ"],["","P","Σ","T","Y","Φ","X","Ψ","Ω","Ϡ"]]
		var needMark=false
		while (num>0) {
			if (needMark) result=','+marks[2][Math.floor(num/100)%10]+marks[1][Math.floor(num/10)%10]+marks[0][num%10]+result
			else result=marks[2][Math.floor(num/100)%10]+marks[1][Math.floor(num/10)%10]+marks[0][num%10]
			num=Math.floor(num/1000)
			needMark=true
		}
	} else {
		while (num>0) {
			var mod=num%10
			result=(mod>0&&mod<6?"·":'-')+(mod>1&&mod<7?"·":'-')+(mod>2&&mod<8?"·":'-')+(mod>3&&mod<9?"·":'-')+(mod>4?"·":'-')+(result==""?"":" "+result)
			num=Math.floor(num/10)
		}
	}
	return result+rest
}

function getFullExpansion(num) {
	if (typeof(num)=="number"&&isNaN(num)) return "NaN"
	else if (typeof(num)!="number"&&isNaN(break_infinity_js?num:num.logarithm)) return "NaN"
	else if (num < 1e12) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	else if (Decimal.lt(num, 1/0)) return shorten(num)
	else return "Infinite"
}

shorten = function (money) {
  return formatValue(player.options.notation, money, 2, 2);
};

shortenCosts = function (money) {
  return formatValue(player.options.notation, money, 0, 0);
};

shortenPreInfCosts = function (money) {
	return formatValue(player.options.notation, money, (money.mantissa>1&&money.exponent>308)?2:0, 0);
};

shortenInfDimCosts = function (money) {
	return formatValue(player.options.notation, money, ECTimesCompleted("eterc12")?2:0, 0);
};

shortenDimensions = function (money) {
  return formatValue(player.options.notation, money, 2, 0);
};

shortenMoney = function (money) {
  return formatValue(player.options.notation, money, 2, 1);
};


function timeDisplay(time) {
  time = time / 10
  if (time <= 10) return time.toFixed(3) + " seconds"
  time = Math.floor(time)



  if (time >= 31536000) {
      return Math.floor(time / 31536000) + " years, " + Math.floor((time % 31536000) / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 86400) {
      return Math.floor(time / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 3600) {
      return Math.floor(time / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 60) {
      return Math.floor(time / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else return Math.floor(time % 60) + " seconds"
}

function preformat(int) {
  if (int.toString().length == 1) return "0"+int
  else return int
}

let small = ['','m','μ','n','p','f','a','z','y']
function timeDisplayShort(time, rep) {
	if (time == 1/0) {
		if (Decimal.eq(time, 1/0)) return 'eternity'
		return shorten(Decimal.div(time, 31536e4)) + 'y'
	}
	time = time / 10
	if (rep && time < 1) {
		if (time < 1e-24) return "1/"+shorten(1/time)+"s"
		if (time < 0.01) {
			var log = Math.floor(Math.log10(time))
			return (time * Math.pow(1e3, Math.ceil(-log/3))).toFixed((-log-1)%3+1) + " "+small[Math.ceil(-log/3)]+"s"
		}
		return (time * 100).toFixed(time < 0.1 ? 3 : 2) + " cs"
	}
	if (time < 60) return time.toFixed(time < 10 ? 3 : 2) + " s" + (rep ? "" : "econds")
	if (time < 3600) return Math.floor(time/60) + ":" + preformat(Math.floor(time%60))
	if (time < 86400) return Math.floor(time/3600) + ":" + preformat(Math.floor((time/60)%60)) + ":" + preformat(Math.floor(time%60))
	if (time < 31536e3) return Math.floor(time/86400) + 'd, ' + Math.floor((time/3600)%24) + ":" + preformat(Math.floor((time/60)%60)) + ":" + preformat(Math.floor(time%60))
	if (time < 31536e4) return Math.floor(time/31536e3) + 'y, ' + Math.floor((time/86400)%365) + 'd, ' + Math.floor((time/3600)%24) + ":" + preformat(Math.floor((time/60)%60)) + ":" + preformat(Math.floor(time%60))
	return shorten(time/31536e3) + 'y'
}

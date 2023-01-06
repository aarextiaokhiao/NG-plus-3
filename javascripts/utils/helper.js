el = x => document.getElementById(x)
el_class = x => document.getElementsByClassName(x)
getEl = el

/* Credits to MrRedShark77. */
E = x => new Decimal(x)
E_BI = x => new Decimal_BI(x)
E_pow = (x, y) => Decimal.pow(x, y)
INF = Number.MAX_VALUE

m_pow2 = x => Math.pow(2, x)
m_pow10 = x => Math.pow(10, x)
pow2 = x => Decimal.pow(2, x)
pow10 = x => Decimal.pow(10, x)
pow_inf = x => Decimal.pow(INF, x)
d_pow10 = x => pow10(m_pow10(x))

/* Technical from game.js */
if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}
		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
  }


if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		value: function(searchElement, fromIndex) {

        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          // c. Increase k by 1.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }

    if (!Math.log10) {
        Math.log10 = Math.log10 || function(x) {
            return Math.log(x) * Math.LOG10E;
        };
    }

    if (!Math.log2) {
        Math.log2 = Math.log2 || function(x) {
            return Math.log(x) * Math.LOG2E;
        };
    }

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
          value: function(predicate) {
           // 1. Let O be ? ToObject(this value).
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
              throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
              // a. Let Pk be ! ToString(k).
              // b. Let kValue be ? Get(O, Pk).
              // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
              // d. If testResult is true, return kValue.
              var kValue = o[k];
              if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
              }
              // e. Increase k by 1.
              k++;
            }

            // 7. Return undefined.
            return undefined;
          }
        });
      }


Array.max = function( array ){
	return Math.max.apply( Math, array );
};

Array.min = function( array ){
	return Math.min.apply( Math, array );
};

Object.invert = function(obj) {
	var result = {};
	var keys = Object.keys(obj);
	for (var i = 0, length = keys.length; i < length; i++) {
		result[obj[keys[i]]] = keys[i];
	}
	return result;
};

function sortNumber(a,b) {
	return a - b;
}

function toString(x) {
	if (typeof(x) == "number") x = x.toString()
	return x
}

function wordizeList(list, caseFirst) {
	let length = list.length
	if (caseFirst && length > 0) {
		let split0 = [list[0][0], list[0].slice(1)]
		list[0] = split0[0].toUpperCase()
		if (split0[1]) list[0] += split0[1]
	}
	let ret = ""
	for (var i=0; i<length; i++) {
		if (i > 0 && length > 2) {
			ret += ", "
			if (i == length - 1) ret += "and "
		} else if (i > 0) ret += " and "
		ret += list[i]
	}
	return ret
}
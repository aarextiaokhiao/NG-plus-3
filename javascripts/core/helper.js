el = x => document.getElementById(x)
el_class = x => document.getElementsByClassName(x)
getEl = el

/* Credits to MrRedShark77. */
E = x => new Decimal(x)
E_BI = x => new Decimal_BI(x)
E_pow = (x, y) => Decimal.pow(x, y)

pow2 = x => E_pow(2, x)
pow10 = x => E_pow(10, x)
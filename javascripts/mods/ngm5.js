function getPxGain() {
	return new Decimal(1)
}

function canPSac() {
	return !tmp.ri&&false
}

function pSac() {
	if (!canPSac()) return
	pSacReset()
}

function pSacReset(force) {
	player.pSac.px = player.pSac.px.add(getPxGain()).round()
	player.pSac.times++
	player.pSac[force?"forcedTimes":"normalTimes"]++
	player.pSac.time = 0
	PXminpeak = new Decimal(0)
	galaxyReset(-player.galaxies)
}

function pSacrificed() {
	return player.pSac!=undefined&&!isEmptiness&&(player.pSac.times||player.galacticSacrifice.times||player.infinitied>0||getEternitied()>0||quantumed)
}

function buyPU(x,r) {
	//x = upgrade id, r = is repeatable
	if (hasPU(x,r)==(!r||puCaps[x]||1/0)) return
	let c=getPUCost(x,r)||0
	if (!player.pSac.px.gte(c)) return
	player.pSac.px=player.pSac.px.sub(c).round()
	if (r) player.pSac.rebuyables[x]=(player.pSac.rebuyables[x]||0)+1
	else player.pSac.upgs.push(x)
}

function getPUCost(x,r,l) {
	//x = upgrade id, r = is repeatable, l = upgrade level
	if (l==undefined) l=hasPU(x,r)
	if (puCosts[x]==undefined) return 0
	if (r) return puCosts[x](l)
	return puCosts[x]
}

function hasPU(x,r) {
	if (r) return (player.pSac!=undefined&&player.pSac.rebuyables[x])||0
	return player.pSac!=undefined&&player.pSac.upgs.includes(x)
}

let puCosts = {}
let puCaps = {}

function inPxC(x) {
	if (x==0) return player.pSac==undefined||!player.pSac.challenge
	return player.pSac!=undefined&&player.pSac.challenge==x
}

function resetPSac() {
	if (player.aarexModifications.ngmX>4) {
		PXminpeak = new Decimal(0)
		let keepPU
		return {
			time: 0,
			times: 0,
			normalTimes: 0,
			forcedTimes: 0,
			lostResets: 0,
			px: new Decimal(0),
			upgs: keepPU ? player.pSac.upgs : [],
			rebuyables: keepPU ? player.pSac.rebuyables : {}
		}
	}
}
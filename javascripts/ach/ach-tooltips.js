function setR1Tooltip(){
	// Row 1 (1/8)
	//r11/////
	let alot = el("100 antimatter is a lot")
	//r13/////
	//r14/////
	//r15/////
	//r16/////
	//r17/////
	//r18/////

	//ACHIEVEMENT ROW 1 
	alot.setAttribute('ach-tooltip', "Buy a single Second Dimension." + (inNGM(4) ? " Reward: You gain 100x more Time Shards." : ""))
}

function setR2Tooltip(){
	// Row 2 (6/8)
	let infinity = el("To infinity!")
	//r22/////
	let ndial = el("The 9th Dimension is a lie");
	let apocAchieve = el("Antimatter Apocalypse");
	//r25/////
	let gal = el("You got past The Big Wall")
	let doubleGal = el("Double Galaxy");
	let noPointAchieve = el("There's no point in doing that");

	//ACHIEVEMENT ROW 2
	ndial.setAttribute('ach-tooltip', "Have exactly 99 Eighth Dimensions. Reward: Eighth Dimensions are 10% stronger" + (!inNGM(3) ? "." : " and you gain more GP based on your Eighth Dimensions and your Tickspeed Boosts."));
	apocAchieve.setAttribute('ach-tooltip', "Get over " + formatValue(player.options.notation, 1e80, 0, 0) + " antimatter.");
	gal.setAttribute('ach-tooltip', 'Buy an Antimatter Galaxy. ' + (inNGM(4) ? "Reward: Upon a Time Dimension Boost, your Dimension Boosts don’t reset unless you have more Time Dimension Boosts than your Dimension Boosts." : ''));
	doubleGal.setAttribute('ach-tooltip', 'Buy 2 Antimatter Galaxies. ' + (inNGM(3) ? "Reward: Upon a Tickspeed Boost, your Dimension Boosts" + (inNGM(4) ? " and Time Dimension Boosts" : "") + " don’t reset unless you have more Tickspeed Boosts than five times your Antimatter Galaxies minus eight." : '') + (inNGM(4) ? " You start with 3 Time Dimension Boosts." : ""));
	noPointAchieve.setAttribute('ach-tooltip', "Buy a single First Dimension when you have over " + formatValue(player.options.notation, 1e150, 0, 0) + " of them. Reward: First Dimensions are 10% stronger" + (!inNGM(3) ? "." : " and you can max buy Dimension and Tickspeed Boosts."));
	infinity.setAttribute('ach-tooltip', "Big Crunch for the first time. Reward: Start with 100 antimatter" + (inNGM(2) ? " and always have at least 10x lower Dimension costs." : "."));
}

function setR3Tooltip(){
	// Row 3 (5/8)
	let nerf = el("I forgot to nerf that")
	//r32/////
	let lot = el("That's a lot of infinites");
	let didnt = el("You didn't need it anyway")
	//r35/////
	let claustrophobic = el("Claustrophobic");
	let fast = el("That's fast!");
	//r38/////

	//ACHIEVEMENT ROW 3
	claustrophobic.setAttribute('ach-tooltip', "Big Crunch with just 1 Antimatter Galaxy. Reward: Reduce the starting tick interval by 2%" + (inOnlyNGM(2) ? " and keep Galaxy upgrades on Infinity" : "") + (inNGM(4) ? ", Time Dimension Boosts do not reset anything, and you can buy Time Dimensions beyond " + shortenMoney(Number.MAX_VALUE) +" antimatter" : "") + "." );
	nerf.setAttribute('ach-tooltip',"Get the first dimension multiplier over " + shortenCosts(1e31) + ". Reward: First Dimensions are 5% stronger.")
	didnt.setAttribute('ach-tooltip',"Big Crunch without having any 8th Dimensions. Reward: Dimensions 1-7 are 2" + (inNGM(2) ? "x" : "%") + " stronger.")
	fast.setAttribute('ach-tooltip', "Big Crunch in under 2 hours. Reward: Start with " + shortenCosts(1e3) + " antimatter" + (inNGM(2) ? " and get a multiplier to Galaxy Points based on your fastest Infinity (5 hours / x, 10x softcap)." : "."));
	lot.setAttribute('ach-tooltip', "Get at least 10 Infinities." + (inNGM(2) ? " Reward: " + (!inNGM(3) ? "Start Infinities with Galaxy Points based on your Infinities (x^2/100)." : " Keep Galaxy upgrades on Infinity.") : ""));
}

function setR4Tooltip(){
	// Row 4 (6/8)
	let nerd = el("Spreading Nerd");
	let sanic = el("Supersanic")
	let zero = el("Zero Deaths");
	//r44/////
	let potato = el("Faster than a potato")
	let dimensional = el("Multidimensional")
	//r47/////
	let anti = el("AntiChallenged")

	//ACHIEVEMENT ROW 4
	sanic.setAttribute('ach-tooltip', "Get over " + formatValue(player.options.notation, 1e63, 0, 0) + " antimatter" + (inNGM(4) ? " and unlock new galaxy upgrades at " + formatValue(player.options.notation, 1e666, 0, 0) + " antimatter" : "") + ".")
	nerd.setAttribute('ach-tooltip', "Buy ten Galaxies in total while using Emoji notation."+(inOnlyNGM(2)?" Reward: Double Infinity Points.":""))
	sanic.setAttribute('ach-tooltip', "Get over " + formatValue(player.options.notation, 1e63, 0, 0) + " antimatter" + (inNGM(4) ? " and unlock new Galaxy upgrades at " + formatValue(player.options.notation, 1e666, 0, 0) + " antimatter" : "") + ".") // take out ng-4 message from this achievement and show it in Galaxy tab when necessary
	zero.setAttribute('ach-tooltip',"Big Crunch without Dimension Shifts, Boosts or Galaxies in a challenge. Reward: Dimensions 1-4 are 25% stronger"+(inOnlyNGM(2) ? " and you get 1.25x more IP" : "") + (inNGM(4) ? " and gain more passive GP gain based on GP." : "."))
	potato.setAttribute('ach-tooltip', "Get more than " + (inNGM(2) ? formatValue(player.options.notation, 1e32, 0, 0) + " multiplier from tickspeed upgrades. Reward: Galaxies are 2% stronger." : formatValue(player.options.notation, 1e29, 0, 0) + " ticks per second. Reward: Reduce the starting tick interval by 2%."));
	dimensional.setAttribute('ach-tooltip', "Reach " + formatValue(player.options.notation, 1e12, 0, 0) + " of all Antimatter Dimensions, except for the 8th Dimension.");
	anti.setAttribute('ach-tooltip', "Complete all the challenges. Reward: All Antimatter Dimensions are 10% stronger"+(inOnlyNGM(2) ? ", and the tickspeed cost is also reduced based on your Dimension cost reduction." : "."))
}

function setR5Tooltip(){
	// Row 5 (4/8)
	let limitBreak = el("Limit Break")
	//r52/////
	//r53/////
	//r54/////
	let forever = el("Forever isn't that long")
	let many = el("Many Deaths")
	//r57/////
	let is = el("Is this hell?")

	//ACHIEVEMENT ROW 5
	forever.setAttribute('ach-tooltip', "Big Crunch in 1 minute or less. Reward: Start with "+shortenCosts(1e10)+" antimatter" + (inOnlyNGM(2) ? ", and gain a multiplier to IP based on your best Infinity time." : "."))
	many.setAttribute('ach-tooltip', "Complete the Second Dimension Autobuyer challenge in 3 minutes or less. Reward: All Antimatter Dimensions are stronger in the first 3 minutes of an Infinity" + (!inNGM(3) ? "." : ", and you gain 1% of GP gained on Galactic Sacrifice per second."));
	is.setAttribute('ach-tooltip', "Complete the Tickspeed Autobuyer challenge in 3 minutes or less. Reward: The multiplier per-10 dimensions" + (inNGM(3) ? " is boosted based on your best time of the Tickspeed Autobuyer challenge." : inNGM(2) ? " is raised to the power of ^1.0666.":" is 1% more powerful."))
	limitBreak.setAttribute('ach-tooltip', "Break Infinity."+(inOnlyNGM(2)?" Reward: Gain a multiplier to IP based on the total amount of galaxies you have.":""))
}

function setR6Tooltip(){
	// Row 6 (6/8)
	//r61/////
	let oh = el("Oh hey, you're still here")
	let begin = el("A new beginning.")
	let mil = el("1 million is a lot")
	//r65/////
	let potato2 = el("Faster than a squared potato")
	let infchall = el("Infinitely Challenging")
	let right = el("You did this again just for the achievement right?")

	//ACHIEVEMENT ROW 6
	potato2.setAttribute('ach-tooltip', "Get more than " + (inNGM(2) ? formatValue(player.options.notation, 1e61, 0, 0) + " multiplier from tickspeed upgrades. Reward: Multiplier to infinity dimensions based on multiplier from tickspeed upgrades." : formatValue(player.options.notation, 1e58, 0, 0) + " ticks per second. Reward: Reduce starting tick interval by 2%."))
	oh.setAttribute('ach-tooltip', "Reach " + shortenCosts(1e8) + " IP per minute."+(inOnlyNGM(2) ? " Reward: Gain a multiplier to GP based on the logarithm of your IP.":""))
	mil.setAttribute('ach-tooltip',"Reach " + shortenCosts(1e6) + " Infinity Power." + (inNGM(2) ? " Reward: First Antimatter Dimensions are " + shortenCosts(1e6) + " times stronger":"") + (inNGM(4) ? " and each IC boosts g32 by 2%." : "."))
	right.setAttribute('ach-tooltip',"Complete the Third Dimension Autobuyer challenge in 10 seconds or less. Reward: First Dimensions are 5"+(inNGM(2)?"x":"0%")+" stronger.")
	infchall.setAttribute('ach-tooltip', "Complete an Infinity Challenge."+(inNGM(2) ?" Reward: Galaxies and "+(!inNGM(3) ? "g11 is" : "Tickspeed Boosts are") + " more effective based on IC's completed.":""))
	begin.setAttribute('ach-tooltip', "Begin generation of Infinity Power." + (inNGM(4) ? " Reward: Each Galaxy upgrade boosts g32 by 1%." : ""))
}

function setR7Tooltip(){
	// Row 7 (5/8)
	let not = el("ERROR 909: Dimension not found")
	let cant = el("Can't hold all these infinities")
	//r73/////
	//r74/////
	let newDim = el("NEW DIMENSIONS???")
	//r76/////
	let tables = el("How the antitables have turned")
	let blink = el("Blink of an eye")

	//ACHIEVEMENT ROW 7
	not.setAttribute('ach-tooltip',"Big Crunch with only a single First Antimatter Dimension without Dimension Boosts, Shifts or Galaxies while in the Automatic Galaxies Challenge. Reward: First Antimatter Dimensions are " + (inNGM(2) ? 909 : 3) + " times stronger" + (inNGM(4) ? ", and buff the more expensive Break Infinity upgrade based on Infinities to be more effective" : "") + ".")
	blink.setAttribute('ach-tooltip', "Big Crunch in under 200 milliseconds. Reward: Start with " + formatValue(player.options.notation, 2e25, 0, 0) + " antimatter, and all Antimatter Dimensions are stronger in the first 300 milliseconds of this Infinity.");
	cant.setAttribute('ach-tooltip', "Get all Dimension multipliers over "+shortenCosts(1e308)+". Reward: All Antimatter Dimensions are 10"+(inNGM(2)?"x":"%")+" stronger.")
	newDim.setAttribute('ach-tooltip', "Unlock the 4th Infinity Dimension."+(mod.rs?"":" Reward: Your achievement bonus affects Infinity Dimensions."))
	tables.setAttribute('ach-tooltip', "Get 8th Dimension multiplier to be highest, 7th Dimension multiplier second highest, etc. Reward: Each Antimatter Dimension gains a boost proportional to their tier (8th Dimension gets 8"+(inNGM(2)?"0":"")+"%, 7th gets 7"+(inNGM(2)?"0":"")+"%, etc.)")
}

function setR8Tooltip(){
	// Row 8 (5/8)
	let hevipelledidnothing = el("Hevipelle did nothing wrong")
	//r82/////
	//r83/////
	let spare = el("I got a few to spare")
	let IPBelongs = el("All your IP are belong to us")
	//r86/////
	let twomillion = el("2 Million Infinities")
	let reference = el("Yet another infinity reference")

	//ACHIEVEMENT ROW 8
	IPBelongs.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e150)+" IP. Reward: Gain an additional 4x multiplier to IP.")
	reference.setAttribute('ach-tooltip', "Get a x"+shortenDimensions(Number.MAX_VALUE)+" multiplier in a single sacrifice. Reward: Sacrifices are stronger.")
	spare.setAttribute('ach-tooltip', "Reach " +formatValue(player.options.notation, E("1e35000"), 0, 0)+" antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have.");
	twomillion.setAttribute('ach-tooltip', "Get 2,000,000 Infinities. Reward: Infinities longer than 5 seconds give 250 Infinities" + (inNGM(2) ? ", and you gain an additive +249 Infinities per crunch post multipliers" : "") + ".")
	hevipelledidnothing.setAttribute('ach-tooltip', "Beat Infinity Challenge " + (inNGM(2) ? (inNGM(3) ? 13 : 7 ) : 5) + " in 10 seconds or less" + (inNGM(2) ? " Reward: g13's effect is more powerful when outside of Eternity Challenges" : "") + ".")
}

function setR9Tooltip(){
	// Row 9 (7/8)
	let speed = el("Ludicrous Speed")
	let speed2 = el("I brake for nobody")
	let overdrive = el("MAXIMUM OVERDRIVE")
	let minute = el("4.3333 minutes of Infinity")
	let isthissafe = el("Is this safe?")
	//r96/////
	let hell = el("Yes. This is hell.")
	let zerodeg = el("0 degrees from infinity")

	//ACHIEVEMENT ROW 9
	speed.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e200)+" IP in 2 seconds or less. Reward: All Antimatter Dimensions are significantly stronger in the first 5 seconds of an Infinity.")
	speed2.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e250)+" IP in 20 seconds or less. Reward: All Antimatter Dimensions are significantly stronger in the first 60 seconds of an Infinity.")
	overdrive.setAttribute('ach-tooltip', "Big Crunch with " + shortenCosts(1e300) + " IP/min. Reward: Gain an additional 4x multiplier to IP.")
	minute.setAttribute('ach-tooltip', "Reach " + shortenCosts(1e260) + " Infinity Power. Reward: Double Infinity Power gain.")
	hell.setAttribute('ach-tooltip', "Get the sum of Infinity Challenge times under 6.66 seconds." + (mod.rs ? " Reward: Sacrifice is again slightly stronger." : ""))
	zerodeg.setAttribute('ach-tooltip', "Unlock the 8th Infinity Dimension."+(mod.rs?" Reward: Antimatter Dimensions are multiplied by the amount of 8th Infinity Dimensions you have.":"") + (inNGM(3) ? " Reward: Each Replicated Galaxy counts twice in the reward of 'Is this safe?'." : ""))
	isthissafe.setAttribute('ach-tooltip', "Gain Infinite replicanti in 30 minutes. Reward: Infinity doesn't reset your replicanti amount" + (inNGM(3) ? ", each Replicated Galaxy multiplies GP gain by your Eighth Dimensions, and multiply IP by the squared amount of Eighth Dimensions if you have more than 5,000" : "") + ".")
}

function setR10Tooltip(){
	// Row 10 (6/8)
	let costco = el("Costco sells dimboosts now")
	let mile = el("This mile took an Eternity")
	//r103/////
	//r104/////
	let inftime = el("Infinite time")
	let swarm = el("The swarm")
	let guide = el("Do you really need a guide for this?")
	let nine = el("We could afford 9")

	//ACHIEVEMENT ROW 10
	costco.setAttribute('ach-tooltip', "Bulk buy 750 Dimension Boosts at once. Reward: Dimension Boosts are " + (mod.rs?"cheaper based on EP":"1% more powerful (to Antimatter Dimensions)") + (inNGM(3) ? " and g13 is boosted by the cube root of Galaxies" : "") + ".")
	mile.setAttribute('ach-tooltip', "Get "+(mod.ngp3 ? "the 100 Eternities milestone." : "all Eternity milestones."))
	swarm.setAttribute('ach-tooltip', "Get 10 Replicated Galaxies within the first 15 seconds of this Infinity." + (mod.rs ? " Reward: Unlock Replicated Galaxy power control, and uncap replicanti chance and interval." : ""))
	inftime.setAttribute('ach-tooltip', mod.rs ? "Eternity without buying dimensions 1-7. Reward: Time Dimensions gain a multiplier based on the eighth root of eighth dimensions." : "Get 308 tickspeed upgrades (in one eternity) from Time Dimensions. Reward: Time Dimensions are affected slightly more by tickspeed.")
	guide.setAttribute('ach-tooltip', mod.rs ? "Reach " + shortenCosts(E("1e1000000")) + " replicanti. Reward: Replicanti increases faster the more you have." : "Eternity with less than 10 Infinities.")
	nine.setAttribute('ach-tooltip', "Eternity with exactly 9 replicanti." + (mod.rs ? " Reward: The replicanti multiplier to ID is 9% stronger after Time Studies." : ""))
}

function setR11Tooltip(){
	// Row 11 (3/8)
	let dawg = el("Yo dawg, I heard you liked infinities...")
	//r112/////
	//r113/////
	//r114/////
	//r115/////
	//r116/////
	let nobodygottime = el("8 nobody got time for that")
	let over9000 = el("IT'S OVER 9000")

	//ACHIEVEMENT ROW 11
	over9000.setAttribute('ach-tooltip', "Get a total Sacrifice multiplier of "+shortenCosts(E("1e9000"))+". Reward: Sacrifice doesn't reset your dimensions.")
	dawg.setAttribute('ach-tooltip', "Have all your past 10 Infinities be at least "+shortenMoney(Number.MAX_VALUE)+" times higher IP than the previous one. Reward: Your antimatter doesn't reset when buying a Dimension Boost or Galaxy.")
	nobodygottime.setAttribute('ach-tooltip', "Eternity while only buying 8th Antimatter Dimensions." + (inNGM(2) ? " Reward: Boost g13 based on your Dimension Boosts and the square root of g13's effect." : ""))
}

function setR12Tooltip(){
	// Row 12 (7/8)
	let infiniteIP = el("Can you get infinite IP?")
	//r122/////
	let fiveMore = el("5 more eternities until the update")
	let newI = el("Eternities are the new infinity")
	let eatass = el("Like feasting on a behind")
	let minaj = el("Popular music")
	let layer = el("But I wanted another prestige layer...")
	let fkoff = el("What do I have to do to get rid of you")

	//ACHIEVEMENT ROW 12
	infiniteIP.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e30008"))+" IP." + (inNGM(2) ? " Reward: Your total galaxies boost Galaxy Points gain." : ""))
	fiveMore.setAttribute('ach-tooltip', "Complete 50 unique Eternity Challenge tiers." + (inNGM(2) ? " Reward: Divide Infinity Dimension costs based on the multiplier of g11." : ""))
	newI.setAttribute('ach-tooltip', "Eternity in under 200 milliseconds." + (inNGM(2) ? " Reward: The Dimension Boost effect to Galaxy Points gain is buffed based on a specific value (~43 galaxies), and boost g13 based on your fastest Eternity time in Eternity Challenges." : "")) // by how much?
	eatass.setAttribute('ach-tooltip', "Reach "+shortenCosts(1e100)+" IP without any Infinities or First Antimatter Dimensions. Reward: Gain an IP multiplier based on time spent in this Infinity.")
	layer.setAttribute('ach-tooltip', "Reach "+shortenMoney(Number.MAX_VALUE)+" EP." + (inNGM(2) ? " Reward: The Galaxy boost to Galaxy Points gain is buffed." : "")) // by how much?
	fkoff.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e22000"))+" IP without any Time Studies. Reward: Gain a multiplier to Time Dimensions based on the amount of bought Time Studies.")
	minaj.setAttribute('ach-tooltip', "Have 180 times more non-bonus Replicated Galaxies than normal galaxies. Reward: Replicated Galaxies divide your replicanti by "+shortenMoney(Number.MAX_VALUE)+" instead of resetting them to 1.")
}

function setR13Tooltip(){
	// Row 13 (6/8)
	//r131/////
	let unique = el("Unique snowflakes")
	let infstuff = el("I never liked this infinity stuff anyway")
	let when = el("When will it be enough?")
	let potato3 = el("Faster than a potato^286078")
	//r136/////
	let thinking = el("Now you're thinking with dilation!")
	let thisis = el("This is what I have to do to get rid of you.")

	let thinkingReward = [] // for the achievement "This is what I have to do to get rid of you."
	if (mod.ngp3) thinkingReward.push("multiply Dilated Time gain based on Replicanti")
	if (NGP3andVanillaCheck()) thinkingReward.push("gain 2x more DT and TT while dilated")
	thinkingReward = wordizeList(thinkingReward, true)

	let thisisReward = [] // for the achievement "This is what I have to do to get rid of you."
	if (inNGM(2)) thisisReward.push("g23 is more effective based on your best IP in Dilation")
	if (mod.p3ep) thisisReward.push("you gain 3x more DT while you produce less than "+shortenCosts(1e100)+" DT/second")
	thisisReward = wordizeList(thisisReward, true)

	//ACHIEVEMENT ROW 13
	unique.setAttribute('ach-tooltip', "Have 540 galaxies without having any Replicated Galaxies." + (NGP3andVanillaCheck() ? " Reward: Gain a multiplier to Tachyon Particle and Dilated Time gain based on Antimatter Galaxies." : ""))
	potato3.setAttribute('ach-tooltip', "Get more than "+shortenCosts(E("1e8296262"))+" ticks per second." + (inNGM(2) ? " Reward: The Galaxy boost to Galaxy Points gain is buffed based on a specific value (~663 galaxies)." : ""))
	infstuff.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e140000"))+" IP without buying IDs or IP multipliers. Reward: Start Eternities with all Infinity Challenges completed instantly" + (mod.ngpp ? " and multiply Infinities gain by Dilated Time^(1/4)." : "."))
	when.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e20000"))+" replicanti. Reward: You gain Replicanti 2 times faster under " + shortenMoney(Number.MAX_VALUE) + " replicanti.")
	thinking.setAttribute('ach-tooltip', "Eternity for " + shortenCosts(E("1e600")) + " EP in 1 minute or less while Dilated." + (thinking != "" ? " Reward: " + thinkingReward + "." : ""))
	thisis.setAttribute('ach-tooltip', "Reach "+shortenCosts(E('1e20000'))+" IP without any Time Studies while Dilated."+(thisisReward != "" ? " Reward: " + thisisReward + "." : ""))
}

function setR13p5Tooltip(){
	// Row 13.5 (NGUD) (3/6)
	//ngud11/////
	let stillamil = el("1 million is still a lot")
	//ngud13/////
	let out = el("Finally I'm out of that channel")
	//ngud16/////
	let ridNGud = el("I already got rid of you.")

	//NGUD ACHIEVEMENT ROW (13.5)
	stillamil.setAttribute('ach-tooltip', "Reach "+shortenCosts(1e6)+" Black Hole Power.")
	out.setAttribute('ach-tooltip',"Get more than "+shortenCosts(1e5)+" ex-dilation." + (mod.udsp ? " Reward: You can equally distribute ex-dilation to all repeatable Dilation upgrades." : ""))
	ridNGud.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e20000"))+" IP without any Time Studies or Dilation upgrades while Dilated.")
}

function setR14Tooltip(){
	// Row 14 (4/8)
	//ngpp11/////
	//ngpp12/////
	let onlywar = el("In the grim darkness of the far endgame")
	//ngpp14/////
	let thecap = el("The cap is a million, not a trillion")
	let neverenough = el("It will never be enough")
	//ngpp17/////
	let harmony = el("Universal harmony")

	let onlywarReward = [] // for the achievement "In the grim darkness of the far endgame"
	if (mod.ngp3 || mod.p3ep) onlywarReward.push("double Dilated Time gain")
	if (mod.udsp) onlywarReward.push("you can auto-buy Dilation Upgrades")

	let neverenoughReward = ["unlock the option to buy max Replicated Galaxies"]
	if (mod.ngp3) neverenoughReward.push("TS131 no longer disables auto-Replicated Galaxies")

	//ACHIEVEMENT ROW 14 (NG++)
	onlywar.setAttribute('ach-tooltip', "Reach "+shortenMoney(E('1e40000'))+" EP." + (onlywarReward.length ? " Reward: " + wordizeList(onlywarReward, true) + "." : ""))
	thecap.setAttribute('ach-tooltip', "Get "+shortenDimensions(1e12)+" Eternities. Reward: Eternity Upgrade 2 uses a better formula.")
	neverenough.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e100000"))+" replicanti." + (neverenoughReward.length ? " Reward: " + wordizeList(neverenoughReward, true) + "." : ""))
	harmony.setAttribute('ach-tooltip', mod.ngpp ? "Have at least 700 Antimatter, Replicanti, and Tachyonic galaxies. Reward: All Galaxies are 0.1% stronger." : "While having at least 300 of each type, get the same amount of Antimatter, Replicated, and Tachyonic galaxies.")
}

function setR15Tooltip(){
	// Row 15 (ng3p1) (5/8)
	let notenough = el("I don't have enough fuel!")
	//ng3p12/////
	let hadron = el("Hadronization")
	//ng3p14/////
	//ng3p15/////
	let old = el("Old age")
	let rid = el("I already got rid of you...")
	let winner = el("And the winner is...")

	//ACHIEVEMENT ROW 15
	notenough.setAttribute('ach-tooltip', "Reach " + shorten(Number.MAX_VALUE) + " meta-antimatter. Reward: You produce more Dilated Time based on your Antimatter Galaxies, and gain more Tachyon Particles based on your Replicated Galaxies.")
	hadron.setAttribute('ach-tooltip', "Have colored quarks, but have no color charge. Reward: Net Quarks boost all Meta Dimensions.")
	old.setAttribute('ach-tooltip', "Reach " + shortenCosts(getOldAgeRequirement()) + " antimatter. Reward: Get a multiplier to the 1st Meta Dimension based on total antimatter.")
	rid.setAttribute('ach-tooltip', "Reach " + shortenCosts(E("1e400000")) + " IP while Dilated, without having Time Studies and Positrons. Reward: Generate Time Theorems based on your best-ever Tachyon Particles.")
	winner.setAttribute('ach-tooltip', "Quantum in under 30 seconds. Reward: Your EP multiplies Quark gain.")
}

function setR16Tooltip(){
	// Row 16 (ng3p2) (5/8)
	let special = el("Special Relativity")
	let squared = el("We are not going squared.")
	//ng3p23/////
	let memories = el("Old memories come true")
	//ng3p25/////
	let morals = el("Infinity Morals")
	//ng3p27/////
	let seriously = el("Seriously, I already got rid of you.")

	//ACHIEVEMENT ROW 16
	special.setAttribute('ach-tooltip', "Quantum in under 5 seconds. Reward: Start with all Infinity Dimensions unlocked if you have at least 25 Eternities.")
	memories.setAttribute('ach-tooltip', "Reach " + shortenCosts(E("1e1700")) + " MA without ever buying 5th-8th Antimatter Dimensions or having more than 4 Dimension Boosts in this Quantum. Reward: The 4 RG upgrade is stronger based on your Meta-Dimension Boosts.")
	squared.setAttribute('ach-tooltip', "Reach "+shortenCosts(E("1e1500"))+" MA with exactly 8 Meta-Dimension Boosts. Reward: Get a multiplier to the 8th Meta Dimension based on your 1st Meta Dimension.")
	morals.setAttribute('ach-tooltip', "Quantum without any Meta-Dimension Boosts.")
	seriously.setAttribute('ach-tooltip', "Reach " + shortenCosts(E("1e354000")) + " IP without having Time Studies, while Dilated and running QC2. Reward: The Eternity Points boost to Quark gain is 1% stronger.")
}

function setQSRTooltip(){
	// Quantum Speedruns (3/28)
	let tfms = el("speedrunMilestone18")
	let tms = el("speedrunMilestone19")
	let tfms2 = el("speedrunMilestone22")

	//QUANTUM SPEEDRUNS
	tfms.setAttribute('ach-tooltip', "Reward: Start with " + shortenCosts(1e13) + " Eternities.")
	tms.setAttribute('ach-tooltip', "Reward: Start with " + shortenCosts(1e25) + " meta-antimatter on reset.")
	tfms2.setAttribute('ach-tooltip', "Reward: Start with " + shortenCosts(1e100) + " Dilated Time, and Dilated Time only resets on Quantum.")
}

function setR17Tooltip(){
	// Row 17 (ng3p3) (6/8)
	let internal = el("ERROR 500: INTERNAL DIMENSION ERROR")
	let truth = el("The truth of anti-challenged")
	let noparadox = el("Never make paradoxes!")
	//ng3p34/////
	//ng3p35/////
	let cantGet = el("I can’t get my multipliers higher!")
	let noDil = el("No dilation means no production.")
	let dontWant = el("I am not interested...")

	//ACHIEVEMENT ROW 17
	internal.setAttribute('ach-tooltip', "Reach " + shortenCosts(E("1e333")) + " MA without having 2nd Meta Dimensions and Meta-Dimension Boosts. Reward: 1st Meta Dimensions are stronger based on meta-antimatter.")
	truth.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(7.88e13)) + " antimatter without completing Paired Challenge 1.")
	cantGet.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(6.2e11)) + " antimatter in Eternity Challenge 11.")
	noDil.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(2e6)) + " replicanti without having Tachyon Particles. Reward: You start Quantums with the square root of your best TP as your Tachyon Particle amount.")
	dontWant.setAttribute('ach-tooltip', "Reach " + shorten(E_pow(Number.MAX_VALUE, 1000)) + " IP while Dilated, in QC2, and without having Time or Mastery Studies and First Antimatter Dimensions during your current Eternity.")
	noparadox.setAttribute('ach-tooltip', "Quantum without any Dilation upgrades. Reward: The sum of your best Quantum Challenge times boosts Quark gain.")
}

function setR18Tooltip(){
	// Row 18 (ng3p4) (7/8)
	let notrelative = el("Time is not relative")
	let error404 = el("ERROR 404: DIMENSIONS NOT FOUND")
	let ie = el("Impossible expectations")
	let wasted = el("Studies are wasted")
	//ng3p45/////
	//ng3p46/////
	let stop = el("Stop blocking me!")
	let dying = el("Is this really worth it?")

	//ACHIEVEMENT ROW 18
	notrelative.setAttribute('ach-tooltip', "Get " + shorten(pow10(411))+" Dilated Time without gaining Tachyon Particles. Reward: You gain more DT based on the amount of Nanorewards.")
	error404.setAttribute('ach-tooltip', "Get " + shorten(pow10(1.6e12))+" antimatter while having only the 1st Dimensions of each type of Dimension and at least 2 Antimatter Galaxies.")
	ie.setAttribute('ach-tooltip', "Get " + shorten(pow10(8e6)) + " antimatter in a paired challenge with the PC6+8 combination. Reward: Automatically buy the Quark multiplier to dimensions every second if you have the 8th brave milestone.")
	wasted.setAttribute('ach-tooltip', "Gain " + shorten(1.1e7) + " TT without respeccing studies and preserving studies. Reward: While you have less than 1 hour worth of TT production, you gain 10x as much TT.")
	stop.setAttribute('ach-tooltip', "Get the replicanti reset requirement to " + shorten(pow10(1.25e7)) + ". Reward: Getting a normal duplicant manually doesn't reset your replicanti and can be automated.")
	dying.setAttribute('ach-tooltip', "Reach " + shorten(pow10(2.75e5)) + " IP while Dilated, in PC6+8, and without having Time Studies. Reward: Branches are faster based on your Meta-Dimension Boosts.")
}

function setR19Tooltip(){
	// Row 19 (ng3p5) (5/8)
	//ng3p51/////
	//ng3p52/////
	let gofast = el("Gonna go fast")
	//ng3p54/////
	let timeBreak = el("Time Breaker")
	let immunity = el("Time Immunity")
	let notSmart = el("You're not really smart.")
	let soLife = el("And so your life?")

	//ACHIEVEMENT ROW 19
	gofast.setAttribute('ach-tooltip', "Get "+shorten(pow10(1185))+" EP first, and then square your EP by disabling Dilation while Big Ripped. Reward: Space Shards multiply quark gain.")
	immunity.setAttribute('ach-tooltip', "Get " + shorten(pow10(8e7)) + " antimatter with one Antimatter Galaxy while in Eternity Challenge 7 and Big Ripped. Reward: Infinite Time is 3% stronger.")
	notSmart.setAttribute('ach-tooltip', "Get "+shorten(1e215)+" Time Shards without having Time Study 11 while Big Ripped. Reward: Meta Dimensions get a multiplier based on Time Shards.")
	timeBreak.setAttribute('ach-tooltip', "Break Eternity. Reward: Galaxies don't reset Dimension Boosts and Quantum Challenges no longer cost anything.")
	soLife.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(3.5e5)) + " IP in Big Rip while dilated, with no EP multiplier upgrades and Time Studies. Reward: Start with 1 Eighth Time Dimension in Big Rips.")
}

function setR20Tooltip(){
	// Row 20 (ng3p6) (5/8)
	let keeheehee = el("Kee-hee-hee!")
	let finite = el("Finite Time")
	//ng3p63/////
	let really = el("Really?")
	//ng3p65/////
	let oppose = el("I rather oppose the theory of everything")
	let willenough = el("Will it be enough?")
	let pls = el("Please answer me why.")

	let willenoughReward = [] // for the achievement "Will it be enough?"
	willenoughReward.push("keep Replicanti on Eternity")
	if (mod.udp && !aarMod.ngumuV) willenoughReward.push("keep Black Hole Dimensions on Quantum")
	willenoughReward = wordizeList(willenoughReward, true)

	//ACHIEVEMENT ROW 20
	keeheehee.setAttribute('ach-tooltip', "Fundament. Reward: Start with " + getFullExpansion(100) + " banked Eternities, " + shorten(Number.MAX_VALUE) + " aQ features, and obtain all missing achievements prior to Paired Challenges.")
	finite.setAttribute('ach-tooltip', "Get " + shortenCosts(1e33) + " Space Shards without Breaking Eternity within this Fundament. Reward: Outside of Big Rips, Tree Upgrades are 10% stronger.")
	really.setAttribute('ach-tooltip', "Get " + shortenCosts(pow10(4e7)) + " antimatter in QC6+8.")
	willenough.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(mod.udp ? 268435456 : 36000000))+" replicanti." + (willenoughReward != "" ? " Reward: " + willenoughReward + "." : ""))
	oppose.setAttribute('ach-tooltip', "Fundament with at most 1x Quantumed. Reward: Quantumed stat boosts anti-Quarks.")
	pls.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(9.5e5)) + " IP in Big Rip while Dilated, with no EP multiplier upgrades, Time Studies, and Break Eternity within this Fundament. Reward: Gain "+shortenDimensions(2e3)+" galaxies worth of Neutrinos on Fundament, multiplied by your best galaxies in Big Rip.")
}

function setR21Tooltip(){
	// Row 21 (ng3p7) (5/8)
	//ng3p71/////
	let uc = el("Underchallenged")
	let mi = el("Meta-Infinity confirmed?")
	let wd = el("Weak Decay")
	let radioDecay = el("Radioactive Decaying to the max!")
	//ng3p76/////
	//ng3p77/////
	//ng3p78/////

	//ACHIEVEMENT ROW 21
	uc.setAttribute('ach-tooltip', "Get "+shortenCosts(pow10(1e4))+" EP in Big Rips. Reward: Eternities can't go below your Eternitied gain, and gain Banked Eternities on any Quantum reset.")
	mi.setAttribute('ach-tooltip', "Get "+shorten(Number.MAX_VALUE)+" Infinities.")
	wd.setAttribute('ach-tooltip', "Get "+shortenCosts(pow10(1e9))+" preons without Big Ripping in this Fundament. Reward: Normal duplicant autobuyer buys max.")
	radioDecay.setAttribute('ach-tooltip', "Get a Radioactive Decay. Reward: Produce 1 galaxy worth of Neutrinos per second.")
}

function setR22Tooltip(){
	// Row 22 (ng3p8) (3/8)
	let ghostierthanbefore = el("Even Ghostlier than before")
	//ng3p82/////
	//ng3p83/////
	//ng3p84/////
	let ee = el("Everlasting Eternities")
	let btco = el("Back to Challenge One")
	//ng3p87/////
	//ng3p88/////

	//ACHIEVEMENT ROW 22
	ghostierthanbefore.setAttribute("ach-tooltip", "Unlock Bosonic Lab. Reward: Meta-antimatter effect uses best MA in current Fundament, and obtain all missing achievements prior to the Photons row.")
	ee.setAttribute('ach-tooltip', "Get "+shorten(Number.MAX_VALUE)+" Eternities.")
	btco.setAttribute('ach-tooltip', "Complete Paired Challenge 1 after getting "+shortenCosts(pow10(1.65e9)) + " antimatter in Quantum Challenges 6 and 8. Reward: Fundaments lose 25% of Radioactive Decays.")
}

function setR23Tooltip(){
	// Row 23 (ng3p9) (3/8)
	//ng3p91/////
	//ng3p92/////
	let aretheseanother = el("Are these another...")
	//ng3p94/////
	//ng3p95/////
	//ng3p96/////
	let ghostliest = el("The Ghostliest Side")
	let metae18 = el("Meta-Quintillion")

	//ACHIEVEMENT ROW 23
	ghostliest.setAttribute('ach-tooltip', "Get " + shorten(Math.pow(Number.MAX_VALUE, 1/4)) + " Fundaments. Reward: Fundaments boost Spectral Particles.")
	metae18.setAttribute('ach-tooltip', "Get " + shortenCosts(pow10(1e18)) + " antimatter. Reward: Weaken Distant Antimatter Galaxies scaling by 10%.")
	aretheseanother.setAttribute('ach-tooltip', "Reach " + shortenCosts(pow10(40000)) + " Quarks. Reward: Gain 500x more Quarks and Spectral Particles.")
}

function setVanillaAchievementTooltip() {
	setR1Tooltip()
	setR2Tooltip()
	setR3Tooltip()
	setR4Tooltip()
	setR5Tooltip()
	setR6Tooltip()
	setR7Tooltip()
	setR8Tooltip()
	setR9Tooltip()
	setR10Tooltip()
	setR11Tooltip()
	setR12Tooltip()
	setR13Tooltip()
}

function setNGP3AchievementTooltip() {
	// ng+3 achievements
	setQSRTooltip()
	setR15Tooltip()
	setR16Tooltip()
	setR17Tooltip()
	setR18Tooltip()
	setR19Tooltip()
	setR20Tooltip()
	setR21Tooltip()
	setR22Tooltip()
	setR23Tooltip()
}

function setAchieveTooltip() { 
	setVanillaAchievementTooltip()
	setR13p5Tooltip()
	setR14Tooltip()
	setNGP3AchievementTooltip()
}

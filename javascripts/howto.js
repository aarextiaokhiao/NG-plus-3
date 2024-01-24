let HOW_TO = [
	{
		mod: _ => true,
		req: _ => true,

		title: "Dimensions",
		layer: "",
		desc: `<b>Dimensions:</b>
		Dimensions are your production units in game. The first Dimension produces your Antimatter. Each consecutive dimension produces the previous one, allowing you to have steady growth. There are eight dimensions total.
		<br>
		<b>Dimension Multiplier:</b> Beside the dimension there is a multiplier (example: First Dimension x1.0). The base production of each dimension is multiplied by this number. This multiplier increases by 2x(Base) for every 10 of that dimension purchased. Each time this occurs, the price of the dimension will increase.
		<br>
		<b>Accumulated Dimension Quantity:</b> The next column is your current amount of that dimension you own. This is a combination of how many you have purchased with antimatter, as well as produced from the higher dimension.
		<br>
		<b>Purchased Dimensions Quantity:</b> Next to each accumulated quantity of owned dimensions, the amount of that dimension purchased toward the next multiplier upgrade is displayed in brackets. If you have (4) next to your accumulated dimension quantity, you will need 6 more of that dimension for the next multiplier increase.
		<br>
		<b>Dimension Growth Percent:</b> This number represents the amount of growth that dimension experiences per second. +100% means the dimension is doubling each second. This allows you to judge overall growth.
		<br>
		<b>Cost & until 10:</b> You can buy a single quantity of each dimension with antimatter when the cost button is highlighted. Alternatively, if the Until 10 button is highlighted, you can buy whatever quantity gets you to that dimensions next dimension multiplier.
		<br>
		<b>Max all:</b> Max all will buy max tickspeed (see below), then will buy until 10 of 8th dimension until it can't anymore, then 7th, and so on.
		<br>
		<b>Dimension base prices:</b> 10, 100, 10000, 1e6, 1e9, 1e13, 1e18, 1e24
		<br>
		<b>Base per 10 bought dimension price increases:</b>1000, 10000, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15
		<br>
		<b>Hotkeys: 1, 2, 3, 4, 5, 6, 7, 8</b> for buy until 10 []th dimension, <b>M</b> for Max all`
	}, {
		mod: _ => true,
		req: _ => player.firstBought,

		title: "Achievements",
		layer: "",
		desc: `Each achievement has conditions that must be met before they are earned.	Some are very simple, and some are significantly trickier.	You may have to infinity or start a challenge before attempting some of the harder ones.
		<br>
		You will receive a x1.5 multiplier to all dimensions for each completed row. In addition, some achievements have their own rewards.`
	}, {
		mod: _ => true,
		req: _ => player.secondBought,

		title: "Ticks",
		layer: "",
		desc: `<b>Tick:</b> Production in the game happens on each tick.
		<br>
		<b>Interval:</b> The length of time between ticks. This is lowered by purchasing tick interval reductions.
		<br>
		<b>Cost:</b> The cost in antimatter for reducing the tick interval by the % displayed above (Without Galaxies your base tickspeed decrease is 11% per purchase)
		<br>
		<b>Buy Max:</b> This will buy the maximum amount of tick interval decreases available with your current amount of Antimatter.
		<br>
		Note that the actual tickspeed time is fake and the game always runs at 20 ticks per second.`
	}, {
		mod: _ => true,
		req: _ => player.resets > 0,

		title: "Dimension Shifts",
		layer: "",
		desc: `<b>Dimension Shift:</b> This resets your current game, but unlocks another dimension for your next run. Each one requires 20 (base) of your highest unlocked dimension.
		<br>
		<b>Dimension Boost:</b> A dimension shift, but you don't unlock a new dimension. This happens after 4 dimension shifts. Each one requires 20+(boosts*15) (base) eighth dimensions.
		<br>
		Each dimension shift and boost will provide a x2 (base) multiplier to first dimension, and each dimension after will have half (base) multiplier as the previous (min 1).
		<br>
		<b>Hotkey: D</b>
		</div>`
	}, {
		mod: _ => true,
		req: _ => player.resets >= 5,

		title: "Dimensional Sacrifice",
		layer: "",
		desc: `You unlock Dimensional Sacrifice after your first dimensional boost.
		<br>
		Sacrificing will immediately reduce the owned quantity of dimensions 1 through 7 to zero. This does not reduce the multiplier or the current cost.	In return, it will multiply the Eighth Dimension Multiplier by the shown value. It will take time to get back to the production you previously had, but you will end up with a net increase.
		<br>
		<b>When should I Sacrifice?</b> Depends on your percentages (+%/s), but if they are over ~2% and the multiplier is over 2x, I'd say it's worth it. The lower the percentage, the longer it takes to gain back your dimensions.
		<br>
		<b>Dimensional Sacrifice Checkbox:</b> This allows you to complete dimensional sacrifices without having the warning popup.
		<br><br>
		The dimensional sacrifice formula (where n is the total amount of first dimensions you've had) is:
		<br>
		Base: (log(n)/10)^m, where m is 2 at base, 2.2 with the "The Gods are pleased" achievement, and 2.5 with the "Gift from the Gods" achievement.
		<br>
		Eighth Dimension Autobuyer Challenge: m^0.05/n^0.04*j, where m is the current number of first dimensions you have and j is your previous sacrifice multiplier.
		<br>
		After Infinity Challenge 2: n^m, where m is 0.01 at base and 0.011 with the "Yet another infinity reference" achievement.
		<br>
		<b>Hotkey: S</b>`
	}, {
		mod: _ => true,
		req: _ => player.galaxies > 0,

		title: "Galaxies",
		layer: "",
		desc: `Purchasing an Antimatter Galaxy will reset your game back to the point where only 4 Dimensions are available, but will increase the effect of your tick speed interval reduction by 2%.
		<br>
		Though it will have very little impact for the first few purchases, the increase is multiplicative and won’t take long to be visible.
		<br>
		Your first galaxy will increase your tickspeed interval upgrade as if it were 10% originally, so you will have 12% after 1 galaxy.
		<br>
		Galaxies require 80+(galaxies*60) (base) Eighth Dimensions. (80+galaxies*60+(galaxies-99)^2*2 when above 100 non-Replicated Galaxies, with even faster scaling later on)
		<br>
		<b>Hotkey: G</b>`
	}, {
		mod: _ => true,
		req: _ => player.infinitied > 0,

		title: "Infinity",
		layer: "infinity",
		desc: `Once you have too much Antimatter for the world to handle (2^1024, or 1.7976931348623159e308) you'll reach infinity and be able to perform a Big Crunch.
		<br>
		Each Infinity completed will give an Infinity Point. These can be spent on upgrades in the new infinity tab. You must purchase these upgrades from top to bottom.
		<br>
		The "x2 IP from all sources" upgrade can be bought multiple times, but each purchase requires 10 times as much IP. You must buy all 16 previous infinity upgrades to buy the first level.
		<br>
		<b>When should I try to reach Infinity?</b> It's recommend to get 2 galaxies before attempting to reach it. On the way there, you should dimension boost as many times as you can.`
	}, {
		mod: _ => true,
		req: _ => player.infinitied > 0,

		title: "Challenges",
		layer: "infinity",
		desc: `Challenges are unlocked after first infinity; they change in-game mechanics in different ways to create more difficult infinity circumstances.
		<br>
		Each completed challenge will award an auto buyer.	You can run them multiple times (though only the first time grants a reward), and they can be exited at any time via the "Exit Challenge" button on the challenge tab.
		<br>
		The rightmost row of Infinity Upgrades does not work in challenges.`
	}, {
		mod: _ => true,
		req: _ => player.infinitied > 0,

		title: "Automation",
		layer: "infinity",
		desc: `Autobuyers (awarded by completing challenges) allow the automatic purchase of dimensions, dimension shifts/boosts, galaxies, tickspeed interval decreases, Big Crunches, and Dimensional Sacrifice (later). They are located under the infinity tab in "Autobuyers".
		<br><br>
		<b>Priority:</b> Priorities tell the game which autobuyer will buy if two are affordable in the same tick. Priority 1 is bought 1st, Priority 2 is bought 2nd, etc. Two equal priorities will pick their buying order randomly.
		<br>
		<b>Autobuyer Speed:</b>The cooloff period before the autobuyer makes another purchase. This rounds up to the nearest 100ms, so 200ms and 101ms are the same speed.
		<br>
		<b>Bulk Buy:</b> Once the Speed of an Autobuyer is maxed, all future upgrades will double the amount the autobuyer purchases per tick. This can be disabled.
		<br>
		<b>Dimension Autobuyer Buy Quantity:</b> Autobuyers for dimensions can be set to buy a single, or until 10, on each cooldown. Bulk buy does not work when the autobuyer is set to singles.
		<br>
		<b>Tickspeed Autobuyer Buy Quantity:</b> The tickspeed autobuyer can be set to buy a single or the max available on each cooldown.
		<br>
		<b>Automatic Dimboost Customization:</b> With the Dimboost autobuyer you can set the max amount of 8th dimensions to use for the autobuyer, the amount of galaxies before dimboosts are always autopurchased, and (when unlocked) the ability to buy dimboosts in bulk (at a fixed amount).
		<br>
		<b>Max Galaxies:</b> The highest amount of galaxies the galaxies autobuyer will buy.
		<br>
		<b>IP on crunch:</b> Once you break Infinity, you can set how many IP you would like to wait for before crunching. It accepts e notation (12.34e5 is 1234000).
		<br>
		<b>Sacrifice Autobuyer:</b> This autobuyer has a maxed timer from the start. You can set how much multiplier it waits for before sacrificing. It accepts e notation.
		<br>
		The double autobuyer tick speed upgrade will have all autobuyers buy twice as fast.<br>
		<b>Toggle All Autobuyers:</b> This button will turn all of your autobuyers on or off.
		<br>
		<b>Hotkey: A</b> (for toggle all autobuyers)`
	}, {
		mod: _ => true,
		req: _ => player.break,

		title: "Break Infinity",
		layer: "infinity",
		desc: `Originally Antimatter Dimensions was restricted by "Infinity". Since a significant update, you can now "Break Infinity" once your Big Crunch autobuyer has been maxed. This opens up a selection of new upgrades as well as the ability to gain more than 1 infinity Point per run.
		<br>
		<b>Fixing Infinity:</b>You can revert the breaking at anytime by clicking fix infinity.
		<br>
		<b>IP Gain Formula:</b>10^(log(current antimatter)/n-0.75)*bonuses, where n is 308 at default, 307.8 with the "This achievement doesn't exist II" achievement, or 290 with the relevant timestudy.`
	}, {
		mod: _ => true,
		req: _ => player.infDimensionsUnlocked[0] > 0,

		title: "Infinity Dimensions",
		layer: "infinity",
		desc: `<b>Unlocking Infinity Dimensions:</b>Infinity Dimensions are unlocked by reaching a certain amount of antimatter.
		<br>
		<b>Infinity Dimension Cost:</b>Infinity dimensions are only purchasable in sets of 10, and cost Infinity Points.
		<br>
		<b>Infinity Dimension Production:</b>Similar to the original dimensions, each infinity dimension produces the dimension below it. Dimension 3 produce 2, 2 produces 1.	Instead of antimatter, Infinity Dimension produces Infinity power, which translates to an overall multiplier on all original dimensions.
		<br>
		Infinity Power gives a boost to all dimensions equal to (power^7).`
	}, {
		mod: _ => true,
		req: _ => player.postChallUnlocked,

		title: "Infinity Challenges",
		layer: "infinity",
		desc: `Infinity Challenges are like regular challenges, but they have higher end goals and are generally harder than regular challenges (but have a different kind of reward).
		<br>
		They unlock at set amounts of antimatter - the ones unlocking later are (generally) more difficult.`
	}, {
		mod: _ => true,
		req: _ => player.replicanti.unl,

		title: "Replicanti",
		layer: "infinity",
		desc: `Each replicanti has an upgradable chance to update every replicanti tick. You will gain a bonus to infinity dimensions based on how much replicanti you have.
		<br>
		When replicanti reach infinity, you can buy a galaxy. This will not increase the cost of normal galaxies. The amount of Replicated Galaxies you can have is capped (upgradable). Once you reach infinity replicanti, they will not continue growing (unless you have the relevant time study).
		<br>
		When offline, in an inactive tab, lagging, or a tickspeed under 50ms, replicanti get calculated with an approximation. This can cause wildly varying results, especially at extremely low numbers (1-5).
		<br>
		When at low values (100-1000) (when none of the conditions above are true), there may be some minor variances in the expected amount of replicanti gain.
		<br><b>Formulas:
		<br>Infinity Dimension power increase:</b> log2(replicanti)^2, plus replicanti^0.032 if you have the relevant time study, times 5^galaxies if you have that time study.
		<br><b>Chance upgrade cost:</b>x(1e15) per upgrade
		<br><b>Speed upgrade cost:</b>x(1e10) per upgrade
		<br><b>Galaxy upgrade cost:</b>1e(170+n*25+n^2*5)`
	}, {
		mod: _ => true,
		req: _ => player.eternities > 0,

		title: "Eternity",
		layer: "eternity",
		desc: `Upon reaching infinity Infinity Points, you can eternity. Eternities will reset everything before this point except challenge times, achievements, and total antimatter. You also unlock a new tab.
		<br>
		You can pass infinity Infinity Points whenever. You will receive more Eternity Points the more Infinity Points you had before going Eternal.
		<br>
		<b>EP gain formula:</b> floor(5^(floor(log10(IP))/308-0.7)*bonuses. The x10 EP time study gives the bonus before the outer floor.`
	}, {
		mod: _ => true,
		req: _ => player.eternities > 0,

		title: "Eternity Milestones",
		layer: "eternity",
		desc: `To make eternities faster and more convenient, you will unlock various buffs as you get more eternities. These buffs are either making you start with something on eternity or unlock an autobuyer.
		<br>
		For the buffs at the start of an eternity, you will keep the relevant statistic on the run you unlock the milestone. (On 1 > 2, you will keep your autobuyers.)
		<br>
		The last milestone is at 100 eternities and allows full automation.`
	}, {
		mod: _ => true,
		req: _ => player.eternities > 0,

		title: "Time Dimensions",
		layer: "eternity",
		desc: `After your first eternity, you unlock Time Dimensions. You buy them with EP and they provide time shards, which give free tickspeed upgrades (which don't increase the price). These free tickspeed upgrades stay on infinity (applying retroactively to your tickspeed mult through more galaxies).
		<br>
		Similarly to the other dimensions, a Time Dimension 2 produces a Time Dimension 1 and so on.
		<br>
		Each tick threshold takes 33% more time shards than the previous (25% with the relevant time study).`
	}, {
		mod: _ => true,
		req: _ => player.eternities > 0,

		title: "Time Studies",
		layer: "eternity",
		desc: `A Time Study is a powerful post-eternity upgrade, which costs Time Theorems. Time Studies are laid out in a tree-like fashion, where you must buy prerequisites before continuing. There are sometimes choices to make with which Time Study to buy, as you cannot get all of them even if affordable.
		<br>
		Time Theorems are a limited resource which costs more for each one you buy. They can be bought with antimatter, Infinity Points, and Eternity Points.
		<br>
		<b>Respecs:</b> A Respec allows you to reset the upgrades you have in the tree to retrieve the Time Theorems spent on them. It can be done for free on eternity.
		<br>
		<b>Costs:</b> (1e20000^times bought) for antimatter, (1e100^times bought) for IP, (2^times bought) for EP.`
	}, {
		mod: _ => true,
		req: _ => player.eternities >= 1e4,

		title: "Eternity Challenges",
		layer: "eternity",
		desc: `Eternity Challenges are a new type of Challenges where you must eternity at specified amount of IP to finish the challenge. There is a time study that unlocks an Eternity Challenge when bought, called "Eternity Challenge study", but there is a prerequisite for every Eternity Challenge study. Each time you complete an Eternity Challenge, the goal increases and you need to reach bigger prerequisite values to do it again.`
	}, {
		mod: _ => true,
		req: _ => player.dilation.studies.includes(1),

		title: "Time Dilation",
		layer: "eternity",
		desc: `Time dilation is unlocked when you purchase the 5,000 TT time study after beating both EC11 and EC12 five times, and after acquiring a total of 13,000 TT. Dilating time will start a new eternity, and all of your Dimension/Infinity/Time Dimension multipliers’ exponents and tickspeed multipliers’ will be reduced to ^0.75.	
		<br>
		If you can reach 1.79e308 IP and eternity within a dilated eternity, you are rewarded with Tachyon Particles upon the dilated eternity. You can dilate as many times as you want. 
		<br> 
		Tachyon Particles generate another currency, Dilated Time. Dilated time is translated into free galaxies by reaching a certain threshold. These galaxies are permanent except when you buy a certain Dilation Upgrade. 
		<br> 
		Dilation Upgrades are upgrades that are purchasable with Dilated Time. Some upgrades improve the amount of Dilated Time you gain or reset your free galaxies but decrease the threshold required to get to them. In addition, there is also a TT generator as one of the Dilation upgrades. The first row of dilation upgrades is purchasable as many times as possible, but the rest cannot. `
	}, {
		mod: _ => player.aarexModifications?.nguspV,
		req: _ => player.blackhole.unl,

		title: "Black Hole",
		layer: "eternity",
		desc: `On spending e4K EP, several resources can be exchanged for Remnants. Your Black Hole generates hunger. Feeding with Remnants not only reduces hunger, but also unlocks various boosts based on power, which is a reward.`
	}, {
		mod: _ => player.meta !== undefined,
		req: _ => player.dilation.studies.includes(6),

		title: "Meta Dimensions",
		layer: "eternity",
		desc: `Meta Dimensions are a new type of dimensions that resemble Normal Dimensions, but no tickspeed and galaxies. They can be unlocked by buying 1e24 TT dilation study. Meta-dimension 1 produces meta-antimatter, which makes dimension boosts more powerful. A meta-dimension 2 produces meta-dimension 1 and so on until the 8th. Unlike Normal Dimensions, resetting meta-dimensions (with meta-dimension shifts/boosts) does not reset anything outside of it.`
	}, {
		mod: _ => ngp3,
		req: _ => player.dilation.upgrades.includes("ngpp6"),

		title: "Mastery Studies",
		layer: "eternity",
		desc: `Mastery Studies are a new type of Time & Dilation Studies, but the cost will rise for each purchase. Respeccing will reset costs of all Mastery Studies.`
	}, {
		mod: _ => ngp3,
		req: _ => player.quantum?.times,

		title: "Quantum",
		layer: "quantum",
		desc: `When you reach 9.32e446 meta-antimatter and completed EC14 for the first time, you will able to go quantum. Quantum will reset everything eternity resets, and also eternity features. You will gain a quark and unlock various upgrades.
		<br><br>
		You will also unlock speedrun milestones where you must do fast quantums to get QoL rewards, and even quantum autobuyer.`
	}, {
		mod: _ => ngp3,
		req: _ => player.quantum?.times,

		title: "Quarks & Gluons",
		layer: "quantum",
		desc: `When you go quantum, you receive a number of quarks based on meta-antimatter. At any time, you can assign all your quarks to be either red, green, or blue quarks. Your quarks will produce an amount of color power based on the difference between the color quarks you have the most of and the color you have the second-most of. So, if you had 4 red quarks and 1 blue quark, you would get 3 red charge, producing 3 red power per second. Each color power provides a boost: red provides stronger galaxies, green provides more Replicated Galaxies, and blue provide faster dilated time production. Note that even if you aren't generating a particular color power, the color power you have already generated is still effective.
		<br>
		If you have two or more quark colors, upon quantum some quarks will fuse to become gluons. There are three types of gluons: red-green, green-blue, and blue-red. T form them you must have both of the specified colors; when you quantum, only the first color in the gluon's name will be removed, however. For example, if you had 4 green quarks and 2 blue quarks, two green-blue gluons would form, and you'd have 2 green quarks left over. If you had 4 red, 3 green, and 2 blue, you'd end up with 3 red-green gluons, 2 green-blue gluons and 2 blue-red gluons, with 1 red and 1 green quark left. You can spend your accumulated gluons on various upgrades to increase your production further, as well as an upgrade that doubles the amount of quarks you gain on quantum.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d7"),

		title: "Positrons",
		layer: "quantum",
		desc: `You unlock positrons by purchasing the first new dilation study under mastery studies that costs 2e82 time theorems. positrons provide a boost to your multiplier per 10 dimensions bought, but in order to use them, you have to sacrifice your regular galaxies. The number of positrons you get is equal to the number of galaxies you sacrificed times the number of positrons per galaxy you currently have. This number starts at 2 positrons per galaxy, and can be upgraded using either time theorems, dilated time, meta-antimatter, or meta-dimension boosts. Each upgrade increases the positrons per galaxy by 0.25.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d8"),

		title: "Quantum Challenges",
		layer: "quantum",
		desc: `Like infinity challenges, there are quantum challenges where you must reach a certain amount of antimatter and then do a quantum reset (you must also reach 9.31e446 meta-antimatter). To start a QC, you must spend a certain number of positrons, increasing from one challenge to the next. In addition to the conditions of each individual challenge, positrons don't do anything during quantum challenges.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d9"),

		title: "Paired Challenges",
		layer: "quantum",
		desc: `Paired Challenges consist of two quantum challenges whose conditions are applied at once. You can assign each of the four paired challenges to any pair of quantum challenges, though the same challenge can't be used twice. The cost to start a PC is based on the sum of costs for the component challenges, and the goal is also based on the goals of the component challenges. You can respec PC assignments at any time, though you will lose the PCs you already completed.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d10"),

		title: "Duplicants",
		tab: "ant",
		layer: "quantum",
		desc: `Upon buying the appropriate mastery study, you can make duplicants to gather preons which provide a boost to extra Replicated Galaxies. To get a duplicant you have to reset your replicanti amount after reaching certain requirements (starts at e3,000,000, increases e100,000 each time).
		<br>
		You can spend gluons to buy quantum food, which, when used, turns normal duplicants into worker duplicants. Worker duplicants gather more preons, and also produce eggons, which turn into baby duplicants. Baby duplicants will eventually become normal duplicants. You can also spend gluons to make eggons hatch faster.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d11"),

		title: "Emperor Dimensions",
		tab: "ant",
		layer: "quantum",
		desc: `As with other types of dimensions, each emperor dimension produces the one below it, and there are 8 total emperor dimensions. First emperor dimensions are the same as worker duplicants, second emperor dimensions produce worker duplicants, etc. To get the highest emperor dimension available, you must spend quantum food, similar to promoting a normal duplicant to a worker duplicant. You increase the amount of the highest dimension you can get, as well as unlocking the ability to buy higher dimensions, by spending gluons.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d12"),

		title: "Nanofield",
		tab: "ant",
		layer: "quantum",
		desc: `Nanofield allows you to gain further bonuses by getting preon energy, produced by preon charge. You can enable the production of preon charge, which produces preon energy, but also preon anti-energy. Preon anti-energy slows down preon energy production until a cap of anti-energy is reached, where preon energy production completely stops.. When this happens, the only way to get more preon energy is to get more preon charge. You can get rewards from your preon energy, with the first one requiring 50 preon energy, and each subsequent one requiring 4 times as much preon energy. Note: Preon charge, energy, and anti-energy reset on quantum, but you keep whatever rewards you have already earned on previous quantums.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d13"),

		title: "Decay",
		layer: "quantum",
		desc: `You can turn all your Colored Quarks for Free Preons, which eventually decay in exchange of Preonic Spin. Preonic Spins can be spent on a massive set of upgrades.`
	}, {
		mod: _ => ngp3,
		req: _ => player.masterystudies.includes("d14"),

		title: "Big Rip",
		layer: "quantum",
		desc: `Once you unlock this feature by buying a mastery study, you can big rip the universe. To do this, you must have one of your paired challenges assigned to be QC6+QC8, which is the hardest paired challenge to complete. When you big rip, You start a new quantum inside PC6+8, with only your quantum mechanics working (from quarks and gluons on), but nothing before that (it all comes back upon exiting the big rip). At any time, you can exit the big rip to gain an amount of space shards based on your best antimatter amount while big ripped. You can spend space shards to buy various upgrades that make big rips easier, either by giving a boost that only applies in big rips, or letting you keep something inside big rips.
		<br><br>
		There is also a mini-feature called Break Eternity, unlocks at e1,215 EP. While eternity is broken, time dimensions will work in big rips, as well as galaxies (though galaxy costs scale much faster in big rips). When you eternity, you gain eternal matter based on your time shards. You can spend Eternal Matter to buy 7 new big-rip-exclusive upgrades (one of which is repeatable).`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.times,

		title: "Fundament",
		layer: "fundament",
		desc: `This is a prestige layer beyond Quantum that unlocks on reaching the goal in Big Rip. This resets all previous progress, and gives you Spectral Particles based on your antimatter in Big Rips.
		<br><br>
		<b>Brave Milestones</b><br>
		Brave Milestones can be achieved by Fundamenting while under a certain amount of Quantums. Likewise, each Brave Milestone provides you with a reward that greatly boosts progress and makes Fundaments much faster and more efficient.
		<br><br>
		<b>Automators</b><br>
		Automator Charge is based on net Quarks, and you unlock an Automator on passing a certain threshold. Automator Power is your best-ever Automator Charge, but is used up on enabling an Automator. Automators automate various features such as Nanofield and Big Rips, as long Automator Power doesn't exceed the cap.`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.times,

		title: "Neutrinos",
		layer: "fundament",
		desc: `There are 3 kinds of Neutrinos: Electron, Mu, Tau. You gain Neutrinos of a single kind per 1 Antimatter Galaxy.<br>
		Going Quantum switches which kind to produce. Fundamenting resets Neutrinos.
		<br><br>
		Spend Spectral Particles to boost Neutrinos, which boost things depending on 3 types.<br>
		You can also spend Neutrinos for upgrades or a repeatable which gives 3x SP per purchase.`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.photons?.unl,

		title: "Photons",
		layer: "fundament",
		desc: `Best Tachyon Particles produce Photons.<br>
		Photons give Lights on a loop of 8 colors.<br><br>

		You have 2 Light Harvests: Dark Essences and Enlightenments.<br>
		A "Light Harvest" harvests 3 distinct Lights at respective thresholds which can be adjusted.<br>
		While harvesting, gaining Light is faster and also gains the respective resource.`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.lab?.unl,

		title: "Bosonic Lab",
		tab: "bl",
		layer: "fundament",
		desc: `<b>Hypotheses</b><br>
		You have a 5x5 grid where you can place down Hypotheses. A pair of adjacent Hypotheses boosts things depending on their types.
		<br><br>
		<b>Bosonic Milestones</b><br>
		At a specific amount of best Bosonic Matter, you'll unlock a Bosonic Milestone. Best Bosonic Matter strengthens some milestones.
		<br><br>
		<b>W & Z Bosons</b><br>
		There are 3 Capaciators which can be filled up to a total of 5 W+ and W- Bosons. On filling with all 5 W+ Bosons, you unlock the next Capaciator.<br><br>
		Hypercharge must be at least 0 to activate boosts.<br>
		- W+ = If assigned, +1 Hypercharge and empowers an assigned Capaciator.<br>
		- W- = If assigned, -1 Hyperchargebr>
		- Z0 = -1 Hypercharge`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb?.unl,

		title: "Higgs Field",
		tab: "bl",
		layer: "fundament",
		desc: `At ??? Bosonic Matter, you can reset Bosonic Matter and W & Z Bosons for Higgs. You'll unlock Higgs Field where you can swap boosts between different rows.
		<br>
		You generate Higgs Mass which strengthens Higgs Field. However, later rows are weaker. Don't worry, these can be gradually closer to be effective as earlier rows.`,
	}/*, {
		mod: _ => ngp3,
		req: _ => ghSave?.gw?.unl,

		title: "Gravity Well",
		tab: "bl",
		layer: "fundament",
		desc: `???`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.bd.unl,

		title: "Break Dilation",
		layer: "fundament",
		desc: `???`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb.unl,

		title: "Darkness",
		layer: "fundament",
		desc: `You can consume Spectral Ions for Darkness, which decreases Light cap. You'll unlock a Light (Vantablack), which boosts Neutrinos.`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb.unl,

		title: "Anti-Preonius",
		tab: "ant",
		layer: "fundament",
		desc: `A nerf feature coming back from NG+3.1...`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb.unl,

		title: "Endless Mirrors",
		layer: "fundament",
		desc: `???`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb.unl,

		title: "Duplicant Expansion",
		tab: "ant",
		layer: "fundament",
		desc: `If Anti-Preonius is an ant feature, as it is to Ghost Challenges... Why not make it another ant feature?`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb.unl,

		title: "Temporality",
		layer: "fundament",
		desc: `Called Break Dilation in NG+5.`
	}, {
		mod: _ => ngp3,
		req: _ => ghSave?.hb.unl,

		title: "Annihilation",
		layer: "fundament",
		desc: `Nullify features for Exotic Matter.`
	}, {
		mod: _ => true,
		req: _ => true,

		title: "",
		layer: "",
		desc: ``
	}*/
]

function deleteUnneeded() {
	let newData = []
	for (var data of HOW_TO) if (data.mod()) newData.push(data)
	HOW_TO = newData
}

let lastUnl
function setLast() {
	for (var [i, data] of Object.entries(HOW_TO).reverse()) {
		if (data.req()) {
			lastUnl = parseInt(i)
			return
		}
	}
}

function setupDisplays() {
	let r = ""
	for (var [i, data] of Object.entries(HOW_TO)) r += `<div id='how_to_div_${i}'>
		<button id='how_to_btn_${i}' onclick='openPage(${i})' class='${data.tab || data.layer}'>${data.title}</button>
		<div id='how_to_${i}'></div>
		<hr>
	</div>`
	el("how_to_div").innerHTML = r
}

function updateDisplays() {
	for (var i in HOW_TO) el("how_to_div_" + i).style.display = (PRIOR || i >= lastUnl - 3) && (SPOILERS || i <= lastUnl + 1) ? "" : "none"
}

let OPENED = {}
function openPage(x) {
	OPENED[x] = !OPENED[x]

	let r = HOW_TO[x].desc
	el("how_to_"+x).innerHTML = !OPENED[x] ? "" : typeof r == "function" ? r() : r || "Placeholder."
}

//Options
function showButtons() {
	el("showfeatures").style.display = ""
	el("showspoilers").style.display = ""
	el("layercolors").style.display = ""
	el("ngp3guide").style.display = ngp3 ? "" : "none"
}

let PRIOR = false
function showPriorFeatures() {
	PRIOR = !PRIOR
	el("showfeatures").innerHTML = "Show " + (PRIOR ? "latest" : "prior") + " features"
	updateDisplays()
}

let SPOILERS = false
function showSpoilers() {
	if (!SPOILERS && !confirm("This will reveal the content you haven't got! Are you sure?")) return
	SPOILERS = !SPOILERS
	el("showspoilers").innerHTML = (SPOILERS ? "Avoid" : "Show") + " spoilers"
	updateDisplays()
}

let LAYER_COLORS = false
function showLayerColors() {
	LAYER_COLORS = !LAYER_COLORS
	el("layercolors").innerHTML = "Colors: " + (LAYER_COLORS ? "Layers" : "Tabs")
	for (var [i, data] of Object.entries(HOW_TO)) el("how_to_btn_" + i).className = (!LAYER_COLORS && data.tab) || data.layer
}

//Saving
//Do not remove.
var betaId = "P"
var prefix = betaId + "dsAM_"
var metaSaveId = betaId + "AD_aarexModifications"

function loadSave() {
	let metaSave = localStorage.getItem(metaSaveId)
	if (metaSave == null) {
		let err = "Save not found. Go to the game and reload this page."
		alert(err)
		throw err
	}
	metaSave = JSON.parse(atob(metaSave))

	player = localStorage.getItem(btoa(prefix+metaSave.current))
	if (player == null) {
		let err = "Save not found. Go to the game and reload this page."
		alert(err)
		throw err
	}
	player = JSON.parse(atob(player))

	ngp3 = player.masterystudies !== undefined
	ghSave = player.ghostify
}

//On Load
function onLoad() {
	loadSave()
	showButtons()
	deleteUnneeded()
	setLast()
	setupDisplays()
	updateDisplays()
	openPage(lastUnl)
}
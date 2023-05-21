const REDISCOVER = {
	data: [
		{
			to: "e1300 EP",
			unl: _ => true,
			goal: _ => false,
			preload() {
			},
		}, {
			to: "Mastery Studies",
			unl: _ => false,
			goal: _ => false,
			preload() {
			},
		}, {
			to: "Quantum",
			unl: _ => false,
			goal: _ => false,
			preload() {
			},
		}, {
			to: "Duplicants",
			unl: _ => false,
			goal: _ => false,
			preload() {
			},
		}, {
			to: "Fundament",
			unl: _ => false,
			goal: _ => false,
			preload() {
			},
		}, {
			to: "Bosonic Lab",
			unl: _ => false,
			goal: _ => false,
			preload() {
			},
		}, {
			to: "End",
			unl: _ => false,
			goal: _ => false,
			preload() {
			},
		}
	],

	open() {
		closeToolTip()
		el("rediscover_menu").style.display = "block"
	},
	setup() {
		let html = ""
		let from = "Start"
		for (var seg of this.data) {
			html += `<tr>
				<td style='width: 200px'><button class='unavailablebtn' onclick='$.notify("Soon.")'>${from} →<br>???</button></td>
				<td style='width: 390px; text-align: center'>Best: 0.00s</td>
			</tr>`
			from = "???"
		}
		el('rediscover_sections').innerHTML = html
	},
}
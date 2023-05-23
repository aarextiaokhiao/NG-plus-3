const meta = {
	ver: 2.1
}

function initiateMetaSave() {
	meta.save = localStorage.getItem(metaSaveId)
	if (meta.save == null) meta.save = {}
	else meta.save = JSON.parse(atob(meta.save))

	meta.save = deepUndefinedAndDecimal(meta.save, {
		current: 1,
		saveOrder: [1],

		presets: {},
		badges: {},
		rediscover: { best: {} },
	})
}

function saveMeta() {
	localStorage.setItem(metaSaveId, btoa(JSON.stringify(meta.save)))
	delete meta.mustSave
}
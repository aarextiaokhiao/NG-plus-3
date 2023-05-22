const meta = {
	ver: 2.1
}

function initiateMetaSave() {
	meta.save = localStorage.getItem(metaSaveId)
	if (meta.save == null) {
		meta.save = {presetsOrder: []}
	} else {
		meta.save = JSON.parse(atob(meta.save))
	}
	if (meta.save.current == undefined) {
		meta.save.current = 1
		meta.save.saveOrder = [1]
		meta.save.alert = true
	}
	if (!meta.save.presetsOrder_ers) meta.save.presetsOrder_ers = []
	if (!meta.save.badges) meta.save.badges = {}
}

function saveMeta() {
	localStorage.setItem(metaSaveId, btoa(JSON.stringify(meta.save)))
	delete meta.mustSave
}
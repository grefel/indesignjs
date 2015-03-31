#target InDesign
#targetengine "meineSession"
app.addEventListener("beforePrint", vorDruckdialog);

function vorDruckdialog (_event) {
	if (confirm ("Wollen Sie wirklich drucken?") == false) {
		_event.stopPropagation();
		_event.preventDefault();
	}
}
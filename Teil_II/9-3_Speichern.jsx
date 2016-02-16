main();

function main () {
	if (app.documents.length == 0 ) {
		alert ("Es ist keine Dokument geöffnet!");
		return;
	}
	var dok = app.documents[0];
	if (!dok.saved || dok.modified) {
		if (confirm ("Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?", undefined, "Dokument ist nicht gespeichert")) {
			try {
				dok = dok.save();
			} catch (e) { 
				alert ("Die Datei konnte nicht gespeichert werden.\n" + e);
				return;
			}
		}
		else { 
			return; 
		}
	}
	// Das eigentliche Skript
}

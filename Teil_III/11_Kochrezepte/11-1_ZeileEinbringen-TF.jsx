#target InDesign
if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline")) {	
	if (app.scriptPreferences.version >= 6 ) { // Ab CS4 Undo bereitstellen
		app.doScript(zeileEinbringen, ScriptLanguage.JAVASCRIPT , [], UndoModes.ENTIRE_SCRIPT, "Zeile einbringen"); 		
	} 
	else {
		zeileEinbringen();
	}
	} else {
	alert ("Bitte positionieren Sie die Einfügemarke im Text!");
}

function zeileEinbringen() {
	var _tf = app.selection[0].parentTextFrames[0];
	var _besterAbsatz = false;
	var _besteLaufweite;
	var _minTracking = -10;
	// Alle Absätze des Textrahmens prüfen
	for (var i = 0; i < _tf.paragraphs.length;i++) {
		var _abs = _tf.paragraphs[i];	
		var _zeilen = _abs.lines.length;
		var _orgTracking = _abs.tracking;
		_abs.tracking = _abs.tracking +_minTracking; 

		// Wenn eine Zeile eingesparte wurde muss der optimale Wert ermittelt werden
		if (_abs.lines.length < _zeilen) {
			while (_abs.lines.length < _zeilen) { 		
				_abs.tracking++;
			} 
			 _abs.tracking--;
			// Erster Durchlauf 
			if (_besterAbsatz == false) {
				_besterAbsatz = _abs;
				_besteLaufweite = _besterAbsatz.tracking;
			 }
			// Prüfen ob aktuelle Absatz besser ist?
			else if (_abs.tracking > _besteLaufweite) {
				_besterAbsatz = _abs;
				_besteLaufweite = _besterAbsatz.tracking;
			}
		} 
		// Immer Zurücksetzen
		_abs.tracking = _orgTracking;
	}
	// Falls ein Absatz gefunden wurde, Werte anwenden
	if (_besterAbsatz) {
		_besterAbsatz.tracking = _besteLaufweite
		_besterAbsatz.select();
	} else {
		alert ("Konnte keinen Absatz finden!");
	}
}
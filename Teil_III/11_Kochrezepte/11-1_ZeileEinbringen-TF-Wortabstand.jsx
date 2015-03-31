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
	var _minWortabstand = 30;
	var _tf = app.selection[0].parentTextFrames[0];
	var _besterAbsatz = false;
	var _bestMinSpacing;
	var _bestDesSpacing;
	// Alle Absätze des Textrahmens prüfen
	for (var i = 0; i < _tf.paragraphs.length;i++) {
		var _abs = _tf.paragraphs[i];	
		var _zeilen = _abs.lines.length;
		var _orgMinSpacing = _abs.minimumWordSpacing;
		var _orgDesSpacing = _abs.desiredWordSpacing; 
		var _diff = _abs.minimumWordSpacing - _minWortabstand;
		_abs.minimumWordSpacing =_minWortabstand; 
		_abs.desiredWordSpacing = _abs.desiredWordSpacing - _diff;
		// Wenn eine Zeile eingesparte wurde muss der optimale Wert ermittelt werden
		if (_abs.lines.length < _zeilen) {
			while (_abs.lines.length < _zeilen) { 		
				_abs.minimumWordSpacing++;
				_abs.desiredWordSpacing++;
			} 
			// Erster Durchlauf 
			if (_besterAbsatz == false) {
				_besterAbsatz = _abs;
				_bestMinSpacing = _abs.minimumWordSpacing -1;
				_bestDesSpacing = _abs.desiredWordSpacing -1;
			 }
			// Prüfen ob aktuelle Absatz besser ist?
			else if (_abs.minimumWordSpacing > _bestMinSpacing) {
				_besterAbsatz = _abs;
				_bestMinSpacing = _abs.minimumWordSpacing -1;
				_bestDesSpacing = _abs.desiredWordSpacing -1;
			}
		} 
		// Immer Zurücksetzen
		_abs.desiredWordSpacing = _orgDesSpacing;
		_abs.minimumWordSpacing = _orgMinSpacing;
	}
	// Falls ein Absatz gefunden wurde, Werte anwenden
	if (_besterAbsatz) {
		_besterAbsatz.minimumWordSpacing = _bestMinSpacing;
		_besterAbsatz.desiredWordSpacing = _bestDesSpacing;
		_besterAbsatz.select();
	} else {
		alert ("Konnte keinen Absatz finden!");
	}
}
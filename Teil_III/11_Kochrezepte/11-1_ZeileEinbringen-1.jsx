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
	var _abs = app.selection[0].paragraphs[0];
	var _zeilen = _abs.lines.length;
	var _orgTracking = _abs.tracking;
	var _minTracking = -10;
	_abs.tracking = _minTracking; 
	if (_abs.lines.length < _zeilen) {
		while (_abs.lines.length < _zeilen) {
			_abs.tracking++;
		} 
	_abs.tracking--;
	}
	else {
		_abs.tracking = _orgTracking;
	}
}
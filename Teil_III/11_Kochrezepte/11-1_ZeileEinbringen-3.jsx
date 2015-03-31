if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline")) {
	app.doScript(zeileEinbringen, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Zeile einbringen"); 
} 
else {
	alert ("Bitte positionieren Sie die Einfügemarke im Text!");
}

function zeileEinbringen() {
	var _abs = app.selection[0].paragraphs[0];
	var _zeilen = _abs.lines.length;
	// Alternativ; Einstellung der Wortabstände
	var _minWortabstand = 60;
	var _orgMinSpacing = _abs.minimumWordSpacing;
	var _orgDesSpacing = _abs.desiredWordSpacing; 
	var _diff = _abs.minimumWordSpacing - _minWortabstand;
	_abs.minimumWordSpacing =_minWortabstand; 
	_abs.desiredWordSpacing = _abs.desiredWordSpacing - _diff;
	if (_abs.lines.length < _zeilen) {
		while (_abs.lines.length < _zeilen) { 		
			_abs.minimumWordSpacing++;
			_abs.desiredWordSpacing++;
		} 
		_abs.minimumWordSpacing--;
		_abs.desiredWordSpacing--;
	} 
	else {
		_abs.minimumWordSpacing =_orgMinSpacing; 
		_abs.desiredWordSpacing = _orgDesSpacing;
	}
}
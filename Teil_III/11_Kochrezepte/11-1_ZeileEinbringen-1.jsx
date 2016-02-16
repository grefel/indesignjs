if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline")) {
	app.doScript(zeileEinbringen, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Zeile einbringen"); 
} 
else {
	alert ("Bitte positionieren Sie die Einfügemarke im Text!");
}

function zeileEinbringen() {
	var _lwDiff = -10;
	var _schritt = 1;

	var _abs = app.selection[0].paragraphs[0];
	var _origZeilen = _abs.lines.length;
	var _lwArray = liesLW(_abs);
	aendereLW(_lwArray, _lwDiff);
	if (_abs.lines.length < _origZeilen) {
		while (_abs.lines.length < _origZeilen) {
			aendereLW(_lwArray, _schritt);
		} 
		aendereLW(_lwArray, _schritt * -1);
	} 
	else {
		resetLW(_lwArray);
	}
}

function liesLW(_textObjekt) {
	var _lwArray = [];
	for (var i = 0; i < _textObjekt.textStyleRanges.length; i++) {
		var _tsr = _textObjekt.textStyleRanges[i];
		if (_tsr.characters[-1].index >  _textObjekt.characters[-1].index) {
			_tsr = _textObjekt.characters.itemByRange(_tsr.characters[0], _textObjekt.characters[-1]);
		}
		_lwArray[i] = {tsr:_tsr, origTracking:_tsr.tracking};
	}
	return _lwArray;
}

function aendereLW(_lwArray, _schritt) {
	for (var i = 0; i < _lwArray.length; i++) {
		var _tsr = _lwArray[i].tsr;
		_tsr.tracking = _tsr.tracking * 1 + _schritt;
	}
}

function resetLW(_lwArray) {
	for (var i = 0; i < _lwArray.length; i++) {
		_lwArray[i].tsr.tracking = _lwArray[i].origTracking * 1;
	}
}
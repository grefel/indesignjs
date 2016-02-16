if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline")) {
	app.doScript(zeileEinbringen, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Zeile einbringen"); 
} 
else {
	alert ("Bitte positionieren Sie die Einfügemarke im Text!");
}

function zeileEinbringen() {
	var _trackingDiff = -10;
	var _trackSchritt = 1;
	var _tempColor = app.activeDocument.colors.add();

	var _abs = app.selection[0].paragraphs[0];
	// Initiaien auflösen:
	if (_abs.dropCapCharacters > 0) {
		var startIndex = _abs.index;
		var _addIndex = 0;
		if (_abs.dropCapLines) _addIndex  = 1;
		var dopCapTSR = _abs.parent.characters.itemByRange(startIndex, startIndex + _abs.dropCapCharacters - 1 + _addIndex).getElements()[0];
		dopCapTSR.tracking = _abs.dropCapStyle.tracking;
		var _saveColor = dopCapTSR.fillColor;
		dopCapTSR.fillColor = _tempColor;			
	}
	
	var _origZeilen = _abs.lines.length;
	var _trackWerte = getTracking(_abs);
	changeTracking(_trackWerte, _trackingDiff);
	if (_abs.lines.length < _origZeilen) {
		while (_abs.lines.length < _origZeilen) {
			changeTracking(_trackWerte, _trackSchritt);
		} 
		changeTracking(_trackWerte, _trackSchritt * -1);
	} 
	else {
		resetTracking(_trackWerte);
	}
	
	if (_abs.dropCapCharacters > 0) {
		dopCapTSR.fillColor = _saveColor;
	}
	_tempColor.remove();
}

function getTracking(_textObjekt) {
	var _trackWerte = [];
	for (var i = 0; i < _textObjekt.textStyleRanges.length; i++) {
		var _tsr = _textObjekt.textStyleRanges[i];
		if (_tsr.characters[-1].index >  _textObjekt.characters[-1].index) {
			_tsr = _textObjekt.characters.itemByRange(_tsr.characters[0], _textObjekt.characters[-1]);
		}
		_trackWerte[i] = {tsr:_tsr, origTracking:_tsr.tracking};
	}
	return _trackWerte;
}

function changeTracking(_trackWerte, _schritt) {
	for (var i = 0; i < _trackWerte.length; i++) {
		var _tsr = _trackWerte[i].tsr;
		_tsr.tracking = _tsr.tracking * 1 + _schritt;
	}
}

function resetTracking(_trackWerte) {
	for (var i = 0; i < _trackWerte.length; i++) {
		_trackWerte[i].tsr.tracking = _trackWerte[i].origTracking * 1;
	}
}
if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline")) {
	// Auswahlauf Absätze  erweitern
	app.select(app.selection[0].paragraphs[-1], SelectionOptions.ADD_TO)
	app.select(app.selection[0].paragraphs[0], SelectionOptions.ADD_TO)

	app.doScript(zeileEinbringen, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Zeile einbringen"); 
} 
else {
	alert ("Bitte positionieren Sie die Einfügemarke im Text!");
}

function zeileEinbringen() {
	var _trackingDiff = -10;
	var _trackSchritt = 1;
	
	var _tempColor = app.activeDocument.colors.add();
	var _bestParagraph =  {paragraph:undefined, tracking:undefined};

	for (var i = 0; i < app.selection[0].paragraphs.length; i++) {
		var _abs = app.selection[0].paragraphs[i];
		// Initiaien auflösen:
		if (_abs.dropCapCharacters > 0) {
			var _startIndex = _abs.index;
			var _addIndex = 0;
			if (_abs.dropCapLines) _addIndex  = 1;
			var _dopCapTSR = _abs.parent.characters.itemByRange(_startIndex, _startIndex + _abs.dropCapCharacters - 1 + _addIndex).getElements()[0];
			_dopCapTSR.tracking = _abs.dropCapStyle.tracking;
			var _saveColor = _dopCapTSR.fillColor;
			_dopCapTSR.fillColor = _tempColor;			
		}
		
		var _origZeilen = _abs.lines.length;
		var _trackWerte = getTracking(_abs);
		var _currentTrackDiff = _trackingDiff;
		changeTracking(_trackWerte, _currentTrackDiff);
		if (_abs.lines.length < _origZeilen) {
			while (_abs.lines.length < _origZeilen) {
				changeTracking(_trackWerte, _trackSchritt);
				_currentTrackDiff += _trackSchritt;
			} 
			_currentTrackDiff -= _trackSchritt;			 
			// Erster Durchlauf 
			if (i == 0) {
				_bestParagraph.paragraph = _abs;
				_bestParagraph.tracking = _currentTrackDiff;
			 }
			// Prüfen ob aktuelle Absatz besser ist?
			else if (_currentTrackDiff > _bestParagraph.tracking) {
				_bestParagraph.paragraph = _abs;
				_bestParagraph.tracking = _currentTrackDiff;
			}
		} 	
		// Immer Zurücksetzen, das beste Tracking wird erst ganz am Ende wieder gesetzt.
		resetTracking(_trackWerte);		
		if (_abs.dropCapCharacters > 0) {
			_dopCapTSR.fillColor = _saveColor;
		}
	}

	// Falls ein Absatz gefunden wurde, Absatz optimieren 
	if (_bestParagraph.paragraph != undefined) {
		_trackWerte = getTracking(_bestParagraph.paragraph);
		changeTracking(_trackWerte, _bestParagraph.tracking);
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
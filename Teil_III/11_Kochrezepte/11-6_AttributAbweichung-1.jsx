#target InDesign
if (app.documents.length > 0) { 
	if (app.scriptPreferences.version >= 6 ) { // Ab CS4 Undo bereitstellen
		app.doScript(attributAbweichungen, ScriptLanguage.JAVASCRIPT , [], UndoModes.ENTIRE_SCRIPT, "Marginalie erstellen"); 		
	} 
	else {
		attributAbweichungen();
	}
} else {
	alert ("Kein Dokuemnt geöffnet!");
}


function attributAbweichungen() {
	var _dok = app.activeDocument;
	var _as = _dok.stories.everyItem().getElements();
	if (_dok.stories.everyItem().footnotes.length > 0) {
		_as = _as.concat(_dok.stories.everyItem().footnotes.everyItem().getElements());
	}
	if (_dok.stories.everyItem().tables.length > 0 ) { 
		_as = _as.concat(_dok.stories.everyItem().tables.everyItem().cells.everyItem().getElements());
	}
	for (var i =0; i < _as.length ; i++) { 	// Schleife über alle Objekte die Texte enthalten können
		for (var k = _as[i].textStyleRanges.length - 1; k >= 0; k--) {
			var _tsr = _as[i].textStyleRanges[k].getElements()[0];
			if (_tsr.horizontalScale != 100 || _tsr.verticalScale != 100) {
				showIt(_tsr);
				if (confirm ("Der Textbereich ist falsch skaliert.\nHorizontale Skalierung: "+ _tsr.horizontalScale + "\nVertikale Skalierung: "+ _tsr.verticalScale +"\nAufheben?", "Hinweis")) {
					_tsr.horizontalScale = 100;
					_tsr.verticalScale = 100;
				}
			}
		} // end tsr
	} // end as
}




// Funktionen
// showIt() Zeigt das mit dem Parameter _object übergebene Objekt an!
function showIt (_object) {
	if (_object != null && app.documents.length > 0 && app.layoutWindows.length > 0 ) {
		app.activeWindow.activeSpread = getSpreadByObject (_object);
		app.select(_object);
		var myZoom = app.activeWindow.zoomPercentage; 
		app.activeWindow.zoom(ZoomOptions.showPasteboard); 
		app.activeWindow.zoomPercentage = myZoom;
		return true;
	}
	else {
		return false;
	}
}


// Liefert den Druckbogen, auf dem sich das Objekt _object befindet, zurück
function  getSpreadByObject (_object) {
	if (_object != null) {
		_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in  CS5!
		if (_object.hasOwnProperty("baseline")) {
			_object = _object.parentTextFrames[0];
		}
		while (_object != null) {
			var whatIsIt = _object.constructor;
			switch (whatIsIt) {
				case Spread : return _object;
				case Character : _object = _object.parentTextFrames[0]; break;
				case Footnote :; // drop through
				case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
				case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
				case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
				case Application : return null;
				default: _object = _object.parent;
			}
			if (_object == null) return null;
		}
		return _object;
			} 
	else {
		return null;
	}
}
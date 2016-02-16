if (app.documents.length > 0) { 
	attributAbweichungen();
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
	// Schleife über alle Objekte die Texte enthalten können
	for (var i =0; i < _as.length ; i++) {
		for (var k = _as[i].textStyleRanges.length - 1; k >= 0; k--) {
			var _tsr = _as[i].textStyleRanges[k].getElements()[0];
			if (_tsr.tracking > 5 || _tsr.tracking < -5) {
				showIt(_tsr);
				if (_tsr.tracking > 5 && confirm ("Laufweite zu groß.\nAnpassen?", "Hinweis" )) {
					_tsr.tracking = 5;
				}
				if (_tsr.tracking < -5 && confirm ("Laufweite zu gering.\nAnpassen?", "Hinweis" )) {
					_tsr.tracking = -5;
				}
			}
		} // end tsr
	} // end as
}



function showIt (_object) {
    if (_object != null) {
        if (_object.hasOwnProperty ("sourcePageItem")) _object = _object.sourcePageItem;
        if (_object.hasOwnProperty ("sourceText")) _object = _object.sourceText;
        var _spread = getSpreadByObject (_object);
        if (_spread != null) {
            var _dok = _spread.parent;
            if (_dok.layoutWindows.length > 0 && (app.activeWindow.parent != _dok || app.activeWindow.constructor.name == "StoryWindow" )) {
                app.activeWindow = _dok.layoutWindows[0];
            }
            app.activeWindow.activeSpread = _spread;
        }
        app.select(_object);
        var myZoom = app.activeWindow.zoomPercentage; 
        app.activeWindow.zoom(ZoomOptions.showPasteboard); 
        app.activeWindow.zoomPercentage = 200;
        return true;
    }
    else {
        return false;
    }
}

function getSpreadByObject  (_object) {
	if (_object != null) {
		_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
		if (_object.hasOwnProperty("baseline")) {
			_object = _object.parentTextFrames[0];
		}
		while (_object != null) {
			var whatIsIt = _object.constructor;
			switch (whatIsIt) {
				case Spread : return _object;
				case MasterSpread : return _object;
				case Character : _object = _object.parentTextFrames[0]; break;
				case Footnote :; // drop through
				case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
				case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
				case XMLElement : if (_object.insertionPoints[0].isValid) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
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

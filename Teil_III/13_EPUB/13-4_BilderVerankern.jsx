#target InDesign
if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline") == true ) {
	var _dok = app.activeDocument;
	var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	var _zeroPoint = _dok.zeroPoint;
	_dok.zeroPoint = [0,0];
	var _libPath = File("~/Desktop/templib.indl");
	var _lib = app.libraries.add(_libPath);
	var _story = app.selection[0].parent;
	var _parStyle = _dok.paragraphStyles.itemByName ("bild");
	var _args = [_story, _parStyle, _lib];
	try {
			if (app.scriptPreferences.version >= 6 ) { // Ab CS4 Undo bereitstellen
			app.doScript(bilderVerankern, ScriptLanguage.JAVASCRIPT, _args, UndoModes.ENTIRE_SCRIPT, "Bilder verankern"); 		
		} 
		else {
			bilderVerankern(_args);
		}
	} catch (e) {
	 		alert ("Es ist ein Fehler aufgetreten: " + e);
	}
	_lib.close();
	_libPath.remove();
	_dok.viewPreferences.rulerOrigin = _rulerOrigin;
	_dok.zeroPoint = _zeroPoint;				
} else {
	alert ("Bitte setzen Sie den Cursor in den Textabschnitt in dem die Bilder verankert werden sollen!");
}

function bilderVerankern(_args) {
	_story = _args[0];
	_parStyle = _args[1];
	_lib = _args[2];	
	for (var i = _story.textContainers.length -1; i >= 0; i--) {
		var _tc = _story.textContainers[i];
		var _page = getPageByObject(_tc);
		var _allG = _page.allGraphics;
		_allG.sort(verticalSort);
		for (var k = _allG.length - 1; k >= 0 ; k--) {
			var _frame =_allG[k].parent;		
			if (_frame.parent.constructor.name != "Character") {
				if (_tc.lines.length > 0) {
					var _y1 = _frame.geometricBounds[0];
					var _li = _tc.lines.length -1;
					_line = _tc.lines[_li];
					while (_y1 <_line.baseline && _li >= 0) {
							_line = _tc.lines[_li];
							_li--; 
					}
				}
				else {
					if (i < _story.textContainers.length -2) _line = _story.textContainers[i +1].lines[0];
					else _line = _story.lines[-1];
				}
				var _ipi = _line.paragraphs[0].insertionPoints[-1].index;
				_story.insertionPoints[_ipi].contents = "\r";				
				var _par = _story.insertionPoints[_ipi].paragraphs[0];
				_par.appliedParagraphStyle = _parStyle;
				var _asset = _lib.store(_frame);				
				var _ao = _asset.placeAsset(_par.insertionPoints[0]);
				var _ao = _ao[0];				
				_ao.anchoredObjectSettings.anchoredPosition = AnchorPosition.ANCHORED; // Benutzerdefiniert
				_frame.remove();
			}
		} // end for _allG
	} // end for textContainers
}


// Funktionen ... 
// Liefert die Seite, auf der sich das Objekt _object befindet, zurück
function getPageByObject (_object){ 
	if (_object.hasOwnProperty("baseline")) {
		_object = _object.parentTextFrames[0];
	}
	while (_object != null) {
		if (_object.hasOwnProperty ("parentPage")) return _object.parentPage;
		var whatIsIt = _object.constructor;
		switch (whatIsIt) {
			case Page : return _object;
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

// Sortiert die Grafiken vertikal anhand der sichtbaren Position ihrer Rahmen
function verticalSort (a, b) {
	a =a.parent.geometricBounds[0];
	b =b.parent.geometricBounds[0]
	if (a==b) return 0;
	if (a > b) return 1;
	else return -1;
}
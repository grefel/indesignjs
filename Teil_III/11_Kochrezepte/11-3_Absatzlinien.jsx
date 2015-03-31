#target InDesign
if (app.documents.length > 0) {
	var _dok = app.activeDocument;
	var _absF = _dok.paragraphStyles.itemByName("abs_linie");
	var _objektF = _dok.objectStyles.item("transparent");
	if (_objektF == null) {
		_objektF = _dok.objectStyles.add();
		_objektF.name = "transparent";
	}
	var _offset = 2.5;
	var _hMU = _dok.viewPreferences.horizontalMeasurementUnits;
	var _vMU = _dok.viewPreferences.verticalMeasurementUnits;	
	var _zP = _dok.zeroPoint;
	_dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
	_dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;
	_dok.zeroPoint = [0,0]
	// Ab CS4 Undo bereitstellen
	if (app.scriptPreferences.version >= 6 ) app.doScript(absatzLinien, ScriptLanguage.JAVASCRIPT , [], UndoModes.ENTIRE_SCRIPT, "Absatzlinien"); 		
	else absatzLinien();
	_dok.viewPreferences.horizontalMeasurementUnits = _hMU;
	_dok.viewPreferences.verticalMeasurementUnits = _vMU;
	_dok.zeroPoint = _zP;
} else {
	alert ("Kein Dokument geöffnet!");
}

function absatzLinien() {
	while (_dok.rectangles.itemByName("%scriptObj%") != null) {
		_dok.rectangles.itemByName("%scriptObj%").remove();
	}
	var _allPars = _dok.stories.everyItem().paragraphs.everyItem().getElements();
	for (i =0; i < _allPars.length; i++) {
		var _p = _allPars[i];
		if (_p.appliedParagraphStyle == _absF) {
			for (j =0; j < _p.lines.length; j++) {
				var _l = _p.lines[j];
				var _x1 = _l.horizontalOffset;
				var _x2 = _l.endHorizontalOffset; 
				var _y2 = _l.baseline + _offset;	
				if (_l.leading == Leading.AUTO) {
					var _zab = _p.pointSize * (_p.autoLeading/100);
				} else {
					var _zab =_l.leading;
				}
				var _y1 = _y2 - _zab;
				var _tf = _p.parentTextFrames[0];
				var _rect = _dok.rectangles.add(_tf.itemLayer, LocationOptions.AFTER , _tf);
				_rect.appliedObjectStyle = _objektF;
				_rect.geometricBounds = [_y1, _x1, _y2, _x2];
				if (app.scriptPreferences.version > 6) _rect.name = "%scriptObj%";
				_rect.label = "%scriptObj%";
			}
		}
	}	
}


	
// Create ObjectStyle transparent if not exist.
//~ 	var _objektF;
//~ 	_dok.objectStyles.item("transparent") != null ? _objektF = _dok.objectStyles.item("transparent") : 
//~ 		_objektF = _dok.objectStyles.add({strokeWeight:0, name:"transparent", transparencySettings:{blendingSettings:{opacity:50}}});
//~ 		_objektF.fillColor = _dok.swatches[2];



#target InDesign
if (app.documents.length > 0) {
	var _dok = app.activeDocument;
	// Einstellungen merken:
	var _rOrigin = _dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;		
	var _zPoint = _dok.zeroPoint = [0,0];		
	var _hUnits = _dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
	var _vUnits = _dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
	// Einstellungen setzen:
	_dok.viewPreferences.rulerOrigin = RulerOrigin.SPREAD_ORIGIN;		
	_dok.zeroPoint = [0,0];		
	_dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
	_dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

	if (app.selection.length == 1 && 'visibleBounds' in app.selection[0] ) {
		var _obj = app.selection[0];
		$.writeln(_obj.constructor.name + ".visibleBounds[0] (y0) = " +_obj.visibleBounds[0]);
		$.writeln(_obj.constructor.name + ".visibleBounds[1] (x0) = " + _obj.visibleBounds[1]);
		$.writeln(_obj.constructor.name + ".visibleBounds[2] (y1) = " + _obj.visibleBounds[2]);
		$.writeln(_obj.constructor.name + ".visibleBounds[3] (x1) = " + _obj.visibleBounds[3]);
		$.writeln("Breite = " + (_obj.visibleBounds[3] - _obj.visibleBounds[1]));
		$.writeln("Höhe = " + (_obj.visibleBounds[2] - _obj.visibleBounds[0]));				
	} 
	else {
		alert ("Bitte ein Objekt mit Koordinaten auswählen!");
	}

	// Einstellungen zurücksetzen:
	_dok.viewPreferences.rulerOrigin = _rOrigin;		
	_dok.zeroPoint = _zPoint;		
	_dok.viewPreferences.horizontalMeasurementUnits = _hUnits;
	_dok.viewPreferences.verticalMeasurementUnits = _vUnits;
}
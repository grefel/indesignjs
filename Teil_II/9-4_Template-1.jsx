//DESCRIPTION: Beschreibung des Skripts 
/*	Ausführlicher Kommentar
	Autor: Gregor Fellenz
	Datum: 2015-01-15
*/
if (app.documents.length > 0) {
	var _userLevel = app.scriptPreferences.userInteractionLevel;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT; // gegebenenfalls  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
	var _version = app.scriptPreferences.version;
	// Bei Bedarf: app.scriptPreferences.version = 8;
	// Die folgenden Punkte können hier nur gesetzt werden, wenn ein geöffnetes Dokument bearbeitet wird
	var _dok = app.activeDocument;
	var _hMUnits = _dok.viewPreferences.horizontalMeasurementUnits;
	_dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
	var _VMUnits = _dok.viewPreferences.verticalMeasurementUnits;
	_dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
	var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN
	var _zeroPoint = _dok.zeroPoint;										
	_dok.zeroPoint = [0,0]
	var _tRPoint = _dok.layoutWindows[0].transformReferencePoint;
	_dok.layoutWindows[0].transformReferencePoint = AnchorPoint.TOP_LEFT_ANCHOR

	main();

	app.scriptPreferences.userInteractionLevel = _userLevel;
	// app.scriptPreferences.version = _version
	_dok.viewPreferences.horizontalMeasurementUnits = _hMUnits;
	_dok.viewPreferences.verticalMeasurementUnits = _VMUnits;
	_dok.viewPreferences.rulerOrigin = _rulerOrigin;
	_dok.zeroPoint = _zeroPoint;										
	_dok.layoutWindows[0].transformReferencePoint = _tRPoint;
} else {
	alert ("Es ist kein Dokument geöffnet");
}

function main () {
	// Das eigentliche Skript
}
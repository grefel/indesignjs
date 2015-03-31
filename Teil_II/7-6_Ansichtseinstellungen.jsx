#target InDesign
var _dok = app.activeDocument;
_dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
_dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
_dok.zeroPoint = [0,0];
_dok.layoutWindows[0].transformReferencePoint = AnchorPoint.TOP_LEFT_ANCHOR;


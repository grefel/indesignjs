#target InDesign
// Setzen der Maßeinheiten und des Nullpunkts per Skript:
var _dok = app.activeDocument;
_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;		
_dok.zeroPoint = [0,0];		
_dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
_dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

// Eigentliches Skript für die Tabellenspalten
var _table = app.selection[0];
_table.columns[0].width = 25;
var _spAnzahl = _table.columns.length;
var _textRahmenBreite = 100;
_table.columns.itemByRange(1,5).width = (_textRahmenBreite - 25)/(_spAnzahl - 1);
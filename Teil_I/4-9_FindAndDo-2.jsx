app.findGrepPreferences = NothingEnum.nothing;
if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
	app.findChangeGrepOptions.searchBackwards = false;
}
app.findGrepPreferences.findWhat = "\\(S\\.\\h\\d+\\)";
var _ergebnisse = app.activeDocument.findGrep(true);	
app.findGrepPreferences.findWhat = "\\d+";
for (var i =0; i < _ergebnisse.length ; i++) {
	_ergebnis = _ergebnisse[i];
	var _ergebnis2 = _ergebnis.findGrep();
	var _zahl = parseFloat(_ergebnis2[0].contents);
	if (_zahl >= 106) {
		_zahl = _zahl + 4;
		_ergebnis.contents = "(S. " + _zahl + ")";
	}
}
app.findGrepPreferences = NothingEnum.nothing;
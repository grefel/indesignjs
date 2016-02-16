app.findGrepPreferences = NothingEnum.nothing;
if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
	app.findChangeGrepOptions.searchBackwards = false;
}
app.findGrepPreferences.findWhat = "(?<=\\(S\\.\\h)\\d+(?=\\))";
var _ergebnisse = app.activeDocument.findGrep(true);	
for (var i =0; i < _ergebnisse.length ; i++) {
	_ergebnis = _ergebnisse[i];
	var _zahl = parseFloat(_ergebnis.contents);
	if (_zahl >= 106) {
		_zahl = _zahl + 4;
		_ergebnis.contents = _zahl + "";
	}
}
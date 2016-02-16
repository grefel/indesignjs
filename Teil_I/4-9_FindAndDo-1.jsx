app.loadFindChangeQuery ("finde_Abbildung", SearchModes.GREP_SEARCH);
var _ergebnisse = app.activeDocument.findGrep (true);	
for (var i = 0; i < _ergebnisse.length; i++) {
	var _ergebnis = _ergebnisse[i];
	if (_ergebnis.parentTextFrames[0].appliedObjectStyle.name == "legende") {
		_ergebnis.contents = "Abb.";
	}
}
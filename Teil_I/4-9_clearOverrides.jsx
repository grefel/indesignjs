app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = "(?s).+";
var _ergebnisse = app.activeDocument.findGrep();	
for (var i =0; i < _ergebnisse.length ; i++) {
	_ergebnisse[i].clearOverrides();
}
app.findGrepPreferences = NothingEnum.nothing;
